/**
 * Environment configuration utilities
 * Centralized access to environment variables with type safety
 */

export interface AppConfig {
  gcp: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
    bucketName?: string;
  };
  database: {
    url?: string;
    key?: string;
  };
  app: {
    env: string;
    port: number;
  };
}

/**
 * Gets a required environment variable or throws an error
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Gets an optional environment variable with default value
 */
function getEnv(key: string, defaultValue: string = ""): string {
  return process.env[key] || defaultValue;
}

/**
 * Validates and returns application configuration
 */
export function getAppConfig(): AppConfig {
  return {
    gcp: {
      projectId: requireEnv("GCP_PROJECT_ID"),
      clientEmail: requireEnv("GCP_CLIENT_EMAIL"),
      privateKey: requireEnv("GCP_PRIVATE_KEY"),
      bucketName: getEnv("GCP_BUCKET_NAME"),
    },
    database: {
      url: getEnv("SUPABASE_URL"),
      key: getEnv("SUPABASE_ANON_KEY"),
    },
    app: {
      env: getEnv("NODE_ENV", "development"),
      port: parseInt(getEnv("PORT", "3000"), 10),
    },
  };
}

/**
 * Checks if the app is running in production
 */
export function isProduction(): boolean {
  return getEnv("NODE_ENV") === "production";
}

/**
 * Checks if the app is running in development
 */
export function isDevelopment(): boolean {
  return getEnv("NODE_ENV") === "development";
}