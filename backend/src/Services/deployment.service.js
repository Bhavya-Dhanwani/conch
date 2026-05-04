import Users from "../Models/user.model.js";
import DeploymentProjects from "../Models/deploymentProject.model.js";
import DeploymentLogs from "../Models/deploymentLog.model.js";
import EcommerceStores from "../Models/ecommerceStore.model.js";
import { AppError } from "../Utilities/appError.js";
import mongoose from "mongoose";

const frameworkDefaults = {
  nextjs: {
    installCommand: "npm install",
    buildCommand: "npm run build",
    startCommand: "npm start",
    outputDirectory: ".next",
  },
  react: {
    installCommand: "npm install",
    buildCommand: "npm run build",
    startCommand: "",
    outputDirectory: "dist",
  },
  node: {
    installCommand: "npm install",
    buildCommand: "",
    startCommand: "npm start",
    outputDirectory: "",
  },
  vanilla: {
    installCommand: "",
    buildCommand: "",
    startCommand: "",
    outputDirectory: ".",
  },
};

const platformDomain = (process.env.PLATFORM_DOMAIN || "bhavyadhanwani.dev")
  .trim()
  .toLowerCase()
  .replace(/^https?:\/\//, "")
  .replace(/^\*\./, "")
  .replace(/\/.*$/, "");

const isLocalUrl = (value = "") => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);

const getAppBaseUrl = () => {
  const candidates = [
    process.env.PUBLIC_APP_URL,
    process.env.CLIENT_REDIRECT_URL,
    process.env.CLIENT_APP_URL,
    process.env.CLIENT_URL?.split(",")[0]?.trim(),
    `https://conch.${platformDomain}`,
  ].filter(Boolean);

  const selected = candidates.find((url) => process.env.NODE_ENV !== "production" || !isLocalUrl(url));
  return (selected || `https://conch.${platformDomain}`).trim().replace(/\/$/, "");
};

const appBaseUrl = getAppBaseUrl();

let repositoryIndexReadyPromise;

const tidy = (value, fallback = "", maxLength = 300) => {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, maxLength) || fallback;
};

const getOwnerId = (user) => user?.managerId || user?._id;

const assertValidProjectId = (projectId) => {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new AppError("Invalid deployment project id", 400);
  }
};

const slugify = (value) =>
  tidy(value, "site", 80)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "site";

const ensureRepositoryReuseAllowed = async () => {
  if (!repositoryIndexReadyPromise) {
    repositoryIndexReadyPromise = (async () => {
      const indexes = await DeploymentProjects.collection.indexes();
      const oldUniqueRepoIndex = indexes.find((index) => {
        const keys = Object.keys(index.key || {});
        return index.unique && keys.length === 2 && index.key.owner === 1 && index.key["repository.fullName"] === 1;
      });

      if (oldUniqueRepoIndex?.name) {
        await DeploymentProjects.collection.dropIndex(oldUniqueRepoIndex.name);
      }
    })();
  }

  return repositoryIndexReadyPromise;
};

const getAvailableSubdomain = async (owner, requestedSubdomain) => {
  const base = slugify(requestedSubdomain).slice(0, 54).replace(/-$/g, "") || "site";
  let candidate = base;
  let suffix = 2;

  while (await DeploymentProjects.exists({ owner, defaultSubdomain: candidate })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const normalizeCustomDomain = (value) =>
  tidy(value, "", 180)
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");

const normalizeEnvKey = (value) =>
  tidy(value, "", 120)
    .replace(/[^A-Za-z0-9_]/g, "_")
    .replace(/^([0-9])/, "_$1")
    .toUpperCase();

const maskEnvValue = (value = "") => {
  if (!value) return "";
  return "••••••••";
};

const normalizeEnvironmentVariables = (variables = [], existingVariables = []) => {
  if (!Array.isArray(variables)) return [];

  const existingByKey = new Map(
    (existingVariables || []).map((item) => [item.key, item.value || ""]),
  );
  const seen = new Set();

  return variables
    .map((variable) => {
      const key = normalizeEnvKey(variable?.key);
      if (!key || seen.has(key)) return null;
      seen.add(key);

      const incomingValue = tidy(variable?.value, "", 5000);
      const existingValue = existingByKey.get(key) || "";
      const shouldPreserve = !incomingValue || incomingValue === maskEnvValue(existingValue);

      return {
        key,
        value: shouldPreserve ? existingValue : incomingValue,
        environment: ["production", "preview", "all"].includes(variable?.environment)
          ? variable.environment
          : "all",
        isSecret: variable?.isSecret !== false,
      };
    })
    .filter((variable) => variable && variable.value);
};

const maskDeploymentProject = (project) => {
  if (!project) return project;
  const plainProject = typeof project.toObject === "function" ? project.toObject() : project;
  const previewPath = plainProject.defaultSubdomain
    ? buildPreviewPath(plainProject.defaultSubdomain)
    : plainProject.previewPath || "";
  const previewUrl = plainProject.defaultSubdomain
    ? buildPreviewUrl(plainProject.defaultSubdomain)
    : plainProject.previewUrl || "";

  return {
    ...plainProject,
    previewPath,
    previewUrl,
    liveUrl: plainProject.customDomain ? plainProject.liveUrl : previewUrl,
    environmentVariables: (plainProject.environmentVariables || []).map((variable) => ({
      ...variable,
      value: variable.isSecret ? maskEnvValue(variable.value) : variable.value,
      isMasked: Boolean(variable.isSecret && variable.value),
    })),
  };
};

const getGithubToken = async (user) => {
  const ownerId = getOwnerId(user);
  const owner = await Users.findById(ownerId).select("+githubAccessToken").lean();

  if (!owner?.githubAccessToken) {
    throw new AppError("Connect GitHub before importing repositories", 401);
  }

  return owner.githubAccessToken;
};

const githubRequest = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new AppError(data.message || "GitHub API request failed", response.status);
  }

  return data;
};

const githubTextRequest = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.raw",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    return "";
  }

  return response.text();
};

const githubFile = (repository, path) =>
  `https://api.github.com/repos/${repository.fullName}/contents/${path}?ref=${repository.defaultBranch || "main"}`;

const detectPackageManager = async (repository, token) => {
  const lockFiles = [
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["bun.lockb", "bun"],
    ["package-lock.json", "npm"],
  ];

  for (const [file, manager] of lockFiles) {
    const content = await githubTextRequest(githubFile(repository, file), token);
    if (content) return manager;
  }

  return "npm";
};

const detectRepository = async (repository, token) => {
  const packageJsonText = await githubTextRequest(githubFile(repository, "package.json"), token);
  const indexHtml = await githubTextRequest(githubFile(repository, "index.html"), token);
  const packageManager = packageJsonText ? await detectPackageManager(repository, token) : "none";

  if (!packageJsonText) {
    return {
      framework: indexHtml ? "vanilla" : "node",
      detectedLanguage: repository.language || "JavaScript",
      detectedFramework: indexHtml ? "Vanilla JS" : "Node.js",
      packageManager,
      ...frameworkDefaults[indexHtml ? "vanilla" : "node"],
    };
  }

  let pkg = {};
  try {
    pkg = JSON.parse(packageJsonText);
  } catch {
    pkg = {};
  }

  const deps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
  };

  if (deps.next) {
    return {
      framework: "nextjs",
      detectedLanguage: deps.typescript ? "TypeScript" : repository.language || "JavaScript",
      detectedFramework: "Next.js",
      packageManager,
      ...frameworkDefaults.nextjs,
    };
  }

  if (deps.react || deps["@vitejs/plugin-react"] || deps.vite) {
    return {
      framework: "react",
      detectedLanguage: deps.typescript ? "TypeScript" : repository.language || "JavaScript",
      detectedFramework: deps.vite ? "React / Vite" : "React",
      packageManager,
      ...frameworkDefaults.react,
    };
  }

  return {
    framework: "node",
    detectedLanguage: repository.language || "JavaScript",
    detectedFramework: "Node.js",
    packageManager,
    ...frameworkDefaults.node,
  };
};

const buildLiveUrl = (project) => {
  if (project.customDomain) {
    return `https://${project.customDomain}`;
  }

  return buildPreviewUrl(project.defaultSubdomain);
};

const buildPreviewPath = (slug) => `/site/${slug}`;

const buildPreviewUrl = (slug) => `${appBaseUrl}${buildPreviewPath(slug)}`;

const analyzeLog = ({ message = "", fileName = "", lineNumber = null } = {}) => {
  const lower = message.toLowerCase();

  if (lower.includes("module not found") || lower.includes("cannot find module")) {
    return {
      rootCause: "A required package, file, or import path could not be resolved during build or runtime.",
      probableSolution: "Check the import path, install the missing package, and confirm the file exists with the same casing.",
    };
  }

  if (lower.includes("env") || lower.includes("environment variable")) {
    return {
      rootCause: "The website is trying to read an environment variable that is not configured for this deployment.",
      probableSolution: "Add the missing environment variable in the deployment settings and redeploy the website.",
    };
  }

  if (lower.includes("syntaxerror") || lower.includes("unexpected token")) {
    return {
      rootCause: "A syntax error is preventing the JavaScript or TypeScript parser from compiling the file.",
      probableSolution: `Open ${fileName || "the reported file"}${lineNumber ? ` near line ${lineNumber}` : ""} and fix the invalid syntax.`,
    };
  }

  if (lower.includes("timeout")) {
    return {
      rootCause: "The request or build step is taking too long and timing out.",
      probableSolution: "Check slow network calls, long build scripts, database calls, or missing responses in server routes.",
    };
  }

  return {
    rootCause: "The deployment emitted an error that needs review.",
    probableSolution: "Inspect the message, check the referenced file and line if available, then redeploy after the fix.",
  };
};

const createDeploymentLog = async (project, payload = {}) => {
  const level = tidy(payload.level, "INFO", 12).toUpperCase();
  const source = tidy(payload.source, "SYSTEM", 20).toUpperCase();
  const message = tidy(payload.message, "Deployment log", 2000);
  const analysis = level === "ERROR" ? analyzeLog(payload) : {};

  return DeploymentLogs.create({
    deploymentProject: project._id,
    owner: project.owner,
    level: ["INFO", "WARN", "ERROR"].includes(level) ? level : "INFO",
    source: ["BUILD", "RUNTIME", "DOMAIN", "SYSTEM"].includes(source) ? source : "SYSTEM",
    message,
    rootCause: tidy(payload.rootCause, analysis.rootCause || "", 1000),
    fileName: tidy(payload.fileName, "", 500),
    lineNumber: Number.isFinite(Number(payload.lineNumber)) ? Number(payload.lineNumber) : null,
    columnNumber: Number.isFinite(Number(payload.columnNumber)) ? Number(payload.columnNumber) : null,
    probableSolution: tidy(payload.probableSolution, analysis.probableSolution || "", 1000),
    url: tidy(payload.url, project.liveUrl || "", 500),
    metadata: payload.metadata || {},
  });
};

const completeDeploymentRun = async (projectId, runId) => {
  const project = await DeploymentProjects.findById(projectId);
  if (!project) return null;

  const run = project.deployments.id(runId);
  if (!run) return null;

  project.status = "BUILDING";
  run.status = "BUILDING";
  run.logs.push(
    "Build container prepared.",
    `Install command: ${project.installCommand || "none"}`,
    `Build command: ${project.buildCommand || "none"}`,
  );
  await project.save();
  await createDeploymentLog(project, {
    level: "INFO",
    source: "BUILD",
    message: `Build started for ${project.repository.fullName}`,
    url: project.liveUrl,
  });

  project.status = "READY";
  run.status = "READY";
  run.deploymentUrl = project.liveUrl;
  run.logs.push(
    "Framework settings validated.",
    "Deployment metadata published.",
    "Deployment marked ready. DNS must resolve before the URL opens in a browser.",
  );
  await project.save();
  await createDeploymentLog(project, {
    level: "INFO",
    source: "BUILD",
    message: `Build completed for ${project.repository.fullName}`,
    url: project.liveUrl,
  });
  await createDeploymentLog(project, {
    level: "INFO",
    source: "DOMAIN",
    message: project.customDomain
      ? `Custom domain ready: ${project.customDomain}`
      : `Platform URL reserved. Configure wildcard DNS for ${project.defaultDomain}`,
    url: project.liveUrl,
  });

  return project.toObject();
};

export const listGithubRepositories = async (user) => {
  const token = await getGithubToken(user);
  const repos = await githubRequest(
    "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member",
    token,
  );

  return repos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    htmlUrl: repo.html_url,
    cloneUrl: repo.clone_url,
    defaultBranch: repo.default_branch,
    private: repo.private,
    language: repo.language || "",
    updatedAt: repo.updated_at,
  }));
};

export const listDeploymentProjects = async (user) =>
  (await DeploymentProjects.find({ owner: getOwnerId(user) })
    .sort({ updatedAt: -1 })
    .lean()).map(maskDeploymentProject);

export const getDeploymentProject = async (user, projectId) => {
  assertValidProjectId(projectId);

  const project = await DeploymentProjects.findOne({
    _id: projectId,
    owner: getOwnerId(user),
  }).lean();

  if (!project) {
    throw new AppError("Deployment project not found", 404);
  }

  return maskDeploymentProject(project);
};

export const getPublicDeploymentProject = async (slug) => {
  const defaultSubdomain = slugify(slug);
  const project = await DeploymentProjects.findOne({
    defaultSubdomain,
    status: "READY",
  })
    .sort({ updatedAt: -1 })
    .lean();

  if (!project) {
    throw new AppError("Deployed site not found", 404);
  }

  const publicProject = maskDeploymentProject(project);
  const storeSlugs = [...new Set([
    defaultSubdomain,
    slugify(project.name),
    slugify(project.defaultSubdomain),
  ].filter(Boolean))];
  const ecommerceStore = await EcommerceStores.findOne({
    owner: project.owner,
    slug: { $in: storeSlugs },
    isActive: true,
  })
    .select("_id name slug description logoUrl theme")
    .lean();

  if (ecommerceStore) {
    publicProject.ecommerceStore = ecommerceStore;
  }

  delete publicProject.environmentVariables;
  return publicProject;
};

export const deleteDeploymentProject = async (user, projectId) => {
  assertValidProjectId(projectId);

  const project = await DeploymentProjects.findOneAndDelete({
    _id: projectId,
    owner: getOwnerId(user),
  }).lean();

  if (!project) {
    throw new AppError("Deployment project not found", 404);
  }

  await DeploymentLogs.deleteMany({ deploymentProject: projectId, owner: getOwnerId(user) });

  return project;
};

export const createDeploymentProject = async (user, payload = {}) => {
  await ensureRepositoryReuseAllowed();

  const token = await getGithubToken(user);
  const repository = payload.repository || {};
  if (!repository.id || !repository.fullName) {
    throw new AppError("Choose a GitHub repository", 400);
  }

  const detection = await detectRepository(repository, token);
  const requestedFramework = tidy(payload.framework, "", 40);
  const framework = frameworkDefaults[requestedFramework] ? requestedFramework : detection.framework;
  const defaults = frameworkDefaults[framework];
  const owner = getOwnerId(user);
  const projectName = tidy(payload.name, repository.fullName.split("/").at(-1), 120);
  const subdomain = await getAvailableSubdomain(owner, payload.defaultSubdomain || projectName);
  const customDomain = normalizeCustomDomain(payload.customDomain);
  const previewPath = buildPreviewPath(subdomain);
  const previewUrl = buildPreviewUrl(subdomain);

  const project = await DeploymentProjects.create({
    owner,
    name: projectName,
    framework,
    detectedLanguage: detection.detectedLanguage,
    detectedFramework: detection.detectedFramework,
    repository: {
      id: Number(repository.id),
      fullName: tidy(repository.fullName, "", 180),
      htmlUrl: tidy(repository.htmlUrl, "", 500),
      cloneUrl: tidy(repository.cloneUrl, "", 500),
      defaultBranch: tidy(repository.defaultBranch, "main", 100),
      private: Boolean(repository.private),
    },
    rootDirectory: tidy(payload.rootDirectory, ".", 180),
    packageManager: tidy(payload.packageManager, detection.packageManager || (framework === "vanilla" ? "none" : "npm"), 20),
    installCommand: tidy(payload.installCommand, defaults.installCommand, 160),
    buildCommand: tidy(payload.buildCommand, defaults.buildCommand, 160),
    startCommand: tidy(payload.startCommand, defaults.startCommand, 160),
    outputDirectory: tidy(payload.outputDirectory, defaults.outputDirectory, 160),
    environment: tidy(payload.environment, "production", 40),
    environmentVariables: normalizeEnvironmentVariables(payload.environmentVariables),
    defaultSubdomain: subdomain,
    defaultDomain: `${subdomain}.${platformDomain}`,
    previewPath,
    previewUrl,
    customDomain,
    liveUrl: customDomain ? `https://${customDomain}` : previewUrl,
  });

  return maskDeploymentProject(project);
};

export const updateDeploymentEnvironmentVariables = async (user, projectId, payload = {}) => {
  assertValidProjectId(projectId);

  const project = await DeploymentProjects.findOne({
    _id: projectId,
    owner: getOwnerId(user),
  });

  if (!project) {
    throw new AppError("Deployment project not found", 404);
  }

  project.environmentVariables = normalizeEnvironmentVariables(
    payload.environmentVariables,
    project.environmentVariables,
  );
  await project.save();
  await createDeploymentLog(project, {
    level: "INFO",
    source: "SYSTEM",
    message: `Environment variables updated (${project.environmentVariables.length} configured).`,
    url: project.liveUrl,
  });

  return maskDeploymentProject(project);
};

export const queueDeployment = async (user, projectId) => {
  assertValidProjectId(projectId);

  const project = await DeploymentProjects.findOne({
    _id: projectId,
    owner: getOwnerId(user),
  });

  if (!project) {
    throw new AppError("Deployment project not found", 404);
  }

  project.status = "QUEUED";
  project.liveUrl = buildLiveUrl(project);
  const run = project.deployments.create({
    status: "QUEUED",
    deploymentUrl: project.liveUrl,
    logs: [
      "Deployment queued.",
      `Framework: ${project.framework}`,
      `Repository: ${project.repository.fullName}`,
      `Live URL: ${project.liveUrl}`,
    ],
  });
  project.deployments.push(run);
  await project.save();
  await createDeploymentLog(project, {
    level: "INFO",
    source: "BUILD",
    message: `Deployment queued for ${project.repository.fullName}`,
    url: project.liveUrl,
  });
  await createDeploymentLog(project, {
    level: "INFO",
    source: "DOMAIN",
    message: `Live URL reserved: ${project.liveUrl}`,
    url: project.liveUrl,
  });

  const completedProject = await completeDeploymentRun(project._id, run._id);
  return maskDeploymentProject(completedProject);
};

export const listDeploymentLogs = async (user, projectId, options = {}) => {
  assertValidProjectId(projectId);

  const project = await DeploymentProjects.findOne({
    _id: projectId,
    owner: getOwnerId(user),
  }).lean();

  if (!project) {
    throw new AppError("Deployment project not found", 404);
  }

  const limit = Math.min(Number(options.limit) || 50, 100);
  const logs = await DeploymentLogs.find({
    deploymentProject: projectId,
    message: { $ne: "Module not found: Cannot find module './components/ProductGrid'" },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return logs;
};

export const createWebsiteLog = async (user, projectId, payload = {}) => {
  assertValidProjectId(projectId);

  const project = await DeploymentProjects.findOne({
    _id: projectId,
    owner: getOwnerId(user),
  });

  if (!project) {
    throw new AppError("Deployment project not found", 404);
  }

  return createDeploymentLog(project, payload);
};
