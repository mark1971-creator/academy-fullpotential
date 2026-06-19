/**
 * PM2 process file for production (Contabo VPS / self-hosted).
 *
 * Reads environment variables from `.env` in the project root.
 * Set PORT in `.env` to change the listen port (default 3000).
 *
 *   pm2 start ecosystem.config.js
 *   pm2 reload ecosystem.config.js --update-env
 *   pm2 save
 */
const fs = require("fs");
const path = require("path");

const appRoot = __dirname;

function loadDotEnv(filePath) {
  const env = {
    NODE_ENV: "production",
    PORT: "3000",
  };

  if (!fs.existsSync(filePath)) {
    console.warn(
      `[ecosystem] ${filePath} not found — PM2 will start with NODE_ENV=production and PORT=3000 only.`,
    );
    return env;
  }

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

const env = loadDotEnv(path.join(appRoot, ".env"));
const port = env.PORT || "3000";

module.exports = {
  apps: [
    {
      name: "academy-fullpotential",
      cwd: appRoot,
      script: "node_modules/next/dist/bin/next",
      args: `start -p ${port}`,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      time: true,
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      min_uptime: "10s",
      max_restarts: 10,
      env,
    },
  ],
};
