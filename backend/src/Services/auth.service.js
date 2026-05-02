import Users from "../Models/user.model.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { AppError } from "../Utilities/appError.js";
import { generateToken } from "../Utilities/jwtokenGenerator.js";
import { generateHash, compareHash } from "../Utilities/generateHash.js";
import sendEmail from "../Utilities/sendEmail.js";

const editableEmployeeFields = [
  "name",
  "work",
  "employmentStartsAt",
  "employmentEndsAt",
];

const sanitizeUser = (user) => user.toObject();
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

  if (
    updatePayload.employmentEndsAt === null ||
    updatePayload.employmentEndsAt === ""
  ) {
    throw new AppError("employmentEndsAt is required for employee TTL", 400);
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
  const { name, email, work, employmentStartsAt, employmentEndsAt } =
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

  if (!employmentEndsAt) {
    throw new AppError("employmentEndsAt is required for employee TTL", 400);
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
    employmentStartsAt,
    employmentEndsAt,
  });

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
    console.error("Employee email send failed:", error.message);
    await Users.findByIdAndDelete(employee._id);
    throw new AppError(
      "Employee email send failed. Employee was not created.",
      500,
    );
  }

  return sanitizeUser(employee);
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
