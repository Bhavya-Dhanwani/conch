import Users from "../Models/user.model.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { AppError } from "../Utilities/appError.js";
import { generateToken, verifyToken } from "../Utilities/jwtokenGenerator.js";
import { generateHash, compareHash } from "../Utilities/generateHash.js";
import sendEmail from "../Utilities/sendEmail.js";

const editableEmployeeFields = [
  "name",
  "work",
  "employmentStartsAt",
  "employmentEndsAt",
];

const sanitizeUser = (user) => user.toObject();
const sanitizeEmployeeWithInvite = (user, invite = {}) => ({
  ...sanitizeUser(user),
  invite,
});
const normalizeEmail = (email) => email?.trim().toLowerCase();
const normalizeName = (name) => name?.trim();
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const createAuthPayload = (user) => ({
  token: generateToken({ userId: user._id, role: user.role }),
  user: sanitizeUser(user),
});

const isLocalUrl = (value = "") => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);

const getClientRedirectUrl = () => {
  const candidates = [
    process.env.CLIENT_REDIRECT_URL,
    process.env.CLIENT_APP_URL,
    process.env.PUBLIC_APP_URL,
    process.env.CLIENT_URL?.split(",")[0]?.trim(),
    "https://conch.bhavyadhanwani.dev",
  ].filter(Boolean);

  const selected = candidates.find((url) => process.env.NODE_ENV !== "production" || !isLocalUrl(url));
  return (selected || "https://conch.bhavyadhanwani.dev").replace(/\/$/, "");
};

const getGithubScopes = (isConnection = false) => {
  if (isConnection) {
    return process.env.GITHUB_CONNECT_SCOPES || process.env.GITHUB_OAUTH_SCOPES || "read:user user:email repo";
  }

  return process.env.GITHUB_OAUTH_SCOPES || "read:user user:email";
};

const buildGithubAuthorizationUrl = ({ state, isConnection = false } = {}) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_CALLBACK_URL;

  if (!clientId || !redirectUri) {
    throw new AppError("GitHub OAuth is not configured", 500);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: getGithubScopes(isConnection),
    allow_signup: "true",
  });

  if (state) {
    params.set("state", state);
  }

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

export const getGithubAuthorizationUrl = () => buildGithubAuthorizationUrl();

export const getGithubConnectionAuthorizationUrl = (user) => {
  if (!user?._id) {
    throw new AppError("Please login to connect GitHub", 401);
  }

  const state = generateToken(
    {
      purpose: "github-connect",
      userId: user._id,
      role: user.role,
    },
    "10m",
  );

  return buildGithubAuthorizationUrl({ state, isConnection: true });
};

const fetchGithubAccessToken = async (code) => {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
    }),
  });
  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new AppError(data.error_description || "GitHub authorization failed", 401);
  }

  return data.access_token;
};

const fetchGithubJson = async (url, accessToken) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new AppError(data.message || "GitHub API request failed", response.status);
  }

  return data;
};

const getGithubPrimaryEmail = async (accessToken, fallbackEmail) => {
  if (fallbackEmail) {
    return normalizeEmail(fallbackEmail);
  }

  const emails = await fetchGithubJson("https://api.github.com/user/emails", accessToken);
  const primaryEmail =
    emails.find((email) => email.primary && email.verified) ||
    emails.find((email) => email.verified);

  return normalizeEmail(primaryEmail?.email);
};

export const loginWithGithub = async (code) => {
  if (!code) {
    throw new AppError("Missing GitHub authorization code", 400);
  }

  const accessToken = await fetchGithubAccessToken(code);
  const githubUser = await fetchGithubJson("https://api.github.com/user", accessToken);
  const email = await getGithubPrimaryEmail(accessToken, githubUser.email);

  if (!email) {
    throw new AppError("GitHub account does not expose a verified email", 400);
  }

  let user = await Users.findOne({
    $or: [{ githubId: String(githubUser.id) }, { email }],
  });

  const githubPayload = {
    githubId: String(githubUser.id),
    githubUsername: githubUser.login || "",
    githubAvatarUrl: githubUser.avatar_url || "",
    githubEmail: email,
    githubAccessToken: accessToken,
  };

  if (!user) {
    user = await Users.create({
      name: normalizeName(githubUser.name) || githubUser.login || email.split("@")[0],
      email,
      role: "MANAGER",
      ...githubPayload,
    });
  } else {
    Object.assign(user, githubPayload);
    if (!user.name) {
      user.name = githubUser.name || githubUser.login || user.email.split("@")[0];
    }
    await user.save();
  }

  return createAuthPayload(user);
};

export const connectGithubAccount = async (code, state) => {
  if (!code) {
    throw new AppError("Missing GitHub authorization code", 400);
  }

  if (!state) {
    throw new AppError("Missing GitHub connection state", 400);
  }

  let decoded;
  try {
    decoded = verifyToken(state).data;
  } catch {
    throw new AppError("GitHub connection expired. Please try again.", 401);
  }

  if (decoded.purpose !== "github-connect" || !decoded.userId) {
    throw new AppError("Invalid GitHub connection state", 401);
  }

  const accessToken = await fetchGithubAccessToken(code);
  const githubUser = await fetchGithubJson("https://api.github.com/user", accessToken);
  const email = await getGithubPrimaryEmail(accessToken, githubUser.email);
  const githubId = String(githubUser.id);

  if (!email) {
    throw new AppError("GitHub account does not expose a verified email", 400);
  }

  const conflictingUser = await Users.findOne({
    githubId,
    _id: { $ne: decoded.userId },
  }).lean();

  if (conflictingUser) {
    throw new AppError("This GitHub account is already connected to another CONCH user", 409);
  }

  const user = await Users.findById(decoded.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.githubId = githubId;
  user.githubUsername = githubUser.login || "";
  user.githubAvatarUrl = githubUser.avatar_url || "";
  user.githubEmail = email;
  user.githubAccessToken = accessToken;

  await user.save();

  return sanitizeUser(user);
};

export { getClientRedirectUrl };

const generateEmployeePassword = () => {
  return crypto.randomBytes(18).toString("base64url");
};

const getEmployeeFilter = (manager, employeeId) => {
  if (!mongoose.isValidObjectId(employeeId)) {
    throw new AppError("Invalid employee id", 400);
  }

  return {
    _id: employeeId,
    role: "EMPLOYEE",
    managerId: manager._id,
  };
};

const getEmployeeUpdatePayload = (employeeData) => {
  const fields = Object.keys(employeeData || {});
  const blockedFields = fields.filter(
    (field) => !editableEmployeeFields.includes(field),
  );

  if (blockedFields.length) {
    throw new AppError(
      `These fields cannot be updated: ${blockedFields.join(", ")}`,
      400,
    );
  }

  const updatePayload = {};
  for (const field of editableEmployeeFields) {
    if (employeeData[field] !== undefined) {
      updatePayload[field] = employeeData[field];
    }
  }

  if (!Object.keys(updatePayload).length) {
    throw new AppError(
      "At least one editable field is required: name, work, employmentStartsAt, employmentEndsAt",
      400,
    );
  }

  if (updatePayload.employmentEndsAt === "") {
    updatePayload.employmentEndsAt = null;
  }

  return updatePayload;
};

export const signupManager = async ({ name, email, password } = {}) => {
  const normalizedName = normalizeName(name);
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedName || !normalizedEmail || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  const existingUser = await Users.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  const user = await Users.create({
    name: normalizedName,
    email: normalizedEmail,
    password: await generateHash(password),
    role: "MANAGER",
  });

  return createAuthPayload(user);
};

export const loginUser = async ({ email, password } = {}) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await Users.findOne({ email: normalizedEmail }).select(
    "+password",
  );
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await compareHash(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  return createAuthPayload(user);
};

export const createEmployee = async (manager, employeeData = {}) => {
  const { name, email, work, employmentStartsAt, employmentEndsAt = null } =
    employeeData;
  const normalizedName = normalizeName(name);
  const normalizedEmail = normalizeEmail(email);
  const password = generateEmployeePassword();
  const escapedName = escapeHtml(normalizedName);
  const escapedEmail = escapeHtml(normalizedEmail);
  const escapedPassword = escapeHtml(password);

  if (!normalizedName || !normalizedEmail) {
    throw new AppError("Employee name and email are required", 400);
  }

  const existingUser = await Users.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  const employee = await Users.create({
    name: normalizedName,
    email: normalizedEmail,
    password: await generateHash(password),
    role: "EMPLOYEE",
    managerId: manager._id,
    work,
    employmentStartsAt: employmentStartsAt || null,
    employmentEndsAt: employmentEndsAt || null,
  });

  let emailQueued = true;
  let emailError = "";

  try {
    await sendEmail(
      normalizedEmail,
      "Your employee account is ready",
      `<p>Hello ${escapedName},</p>
        <p>Your employee account has been created.</p>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>Password:</strong> ${escapedPassword}</p>
        <p>Please login and keep these credentials safe.</p>`,
    );
  } catch (error) {
    emailQueued = false;
    emailError = error.message;
    console.error("Employee email send failed:", error.message);
  }

  return sanitizeEmployeeWithInvite(employee, {
    emailQueued,
    emailError,
    temporaryPassword: emailQueued ? undefined : password,
  });
};

export const getEmployees = async (manager) => {
  const employees = await Users.find({
    role: "EMPLOYEE",
    managerId: manager._id,
  })
    .sort({ createdAt: -1 })
    .lean();

  return employees;
};

export const updateEmployee = async (manager, employeeId, employeeData) => {
  const updatePayload = getEmployeeUpdatePayload(employeeData);

  const employee = await Users.findOneAndUpdate(
    getEmployeeFilter(manager, employeeId),
    { $set: updatePayload },
    { returnDocument: "after", runValidators: true },
  );
  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  return sanitizeUser(employee);
};

export const deleteEmployee = async (manager, employeeId) => {
  const employee = await Users.findOneAndDelete(
    getEmployeeFilter(manager, employeeId),
  );

  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  return sanitizeUser(employee);
};
