/**
 * Environment validation utility for OAuth setup
 * Use this to debug OAuth configuration issues
 */

export function validateOAuthEnvironment() {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  const requiredVars = [
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  // Validate NEXTAUTH_URL format
  if (process.env.NEXTAUTH_URL) {
    try {
      new URL(process.env.NEXTAUTH_URL);
    } catch {
      errors.push(
        "NEXTAUTH_URL must be a valid URL (e.g., http://localhost:3000)"
      );
    }
  }

  // Validate Google Client ID format
  if (
    process.env.GOOGLE_CLIENT_ID &&
    !process.env.GOOGLE_CLIENT_ID.includes(".")
  ) {
    warnings.push(
      "GOOGLE_CLIENT_ID format looks unusual - should contain dots"
    );
  }

  // Check for common configuration issues
  if (
    process.env.NEXTAUTH_URL &&
    process.env.NEXTAUTH_URL.includes("localhost")
  ) {
    if (process.env.NODE_ENV === "production") {
      warnings.push("Using localhost URL in production environment");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Log environment validation results
 */
export function logEnvironmentValidation() {
  const validation = validateOAuthEnvironment();

  console.log("🔍 OAuth Environment Validation:");

  if (validation.errors.length > 0) {
    console.error("❌ Errors found:");
    validation.errors.forEach((error) => console.error(`  - ${error}`));
  }

  if (validation.warnings.length > 0) {
    console.warn("⚠️  Warnings:");
    validation.warnings.forEach((warning) => console.warn(`  - ${warning}`));
  }

  if (validation.isValid) {
    console.log("✅ Environment configuration looks good!");
  }

  return validation;
}
