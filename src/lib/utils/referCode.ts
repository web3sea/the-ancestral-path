/**
 * Utility functions for handling referCode functionality
 */

export const REFER_CODE_KEY = "referCode";

/**
 * Extract referCode from URL search params
 */
export function getReferCodeFromUrl(
  searchParams: URLSearchParams
): string | null {
  return searchParams.get("ref");
}

/**
 * Save referCode to localStorage
 */
export function saveReferCodeToStorage(referCode: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFER_CODE_KEY, referCode);
  }
}

/**
 * Get referCode from localStorage
 */
export function getReferCodeFromStorage(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFER_CODE_KEY);
  }
  return null;
}

/**
 * Remove referCode from localStorage
 */
export function removeReferCodeFromStorage(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(REFER_CODE_KEY);
  }
}

/**
 * Check if referCode is valid format
 */
export function isValidReferCode(referCode: string): boolean {
  // Basic validation - can be extended based on your requirements
  return referCode && referCode.length > 0 && referCode.length <= 100;
}

/**
 * Process referCode from URL and save to storage
 */
export function processReferCodeFromUrl(
  searchParams: URLSearchParams
): string | null {
  const referCode = getReferCodeFromUrl(searchParams);

  if (referCode && isValidReferCode(referCode)) {
    saveReferCodeToStorage(referCode);
    return referCode;
  }

  return null;
}
