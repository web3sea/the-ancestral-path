/**
 * Environment configuration utilities
 * Centralized access to environment variables with type safety
 */

export interface AppConfig {
  gcp: {
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
    bucketName?: string;
  };
  database: {
    url?: string;
    key?: string;
    serviceKey?: string;
  };
  app: {
    env: string;
    port: number;
  };
  auth: {
    secret: string;
    google: {
      clientId: string;
      clientSecret: string;
    };
  };
  stripe: {
    publishableKey?: string;
    secretKey?: string;
    webhookSecret?: string;
  };
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
      projectId: getEnv("GCP_PROJECT_ID"),
      clientEmail: getEnv("GCP_CLIENT_EMAIL"),
      privateKey: getEnv("GCP_PRIVATE_KEY"),
      bucketName: getEnv("GCP_BUCKET_NAME"),
    },
    database: {
      url: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
      key: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      serviceKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    },
    app: {
      env: getEnv("NODE_ENV", "development"),
      port: parseInt(getEnv("PORT", "3000"), 10),
    },
    auth: {
      secret: getEnv("NEXTAUTH_SECRET"),
      google: {
        clientId: getEnv("GOOGLE_CLIENT_ID"),
        clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
      },
    },
    stripe: {
      publishableKey: getEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
      secretKey: getEnv("STRIPE_SECRET_KEY"),
      webhookSecret: getEnv("STRIPE_WEBHOOK_SECRET"),
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
