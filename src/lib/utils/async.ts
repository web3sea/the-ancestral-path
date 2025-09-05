/**
 * Async utilities for better error handling and control flow
 */

/**
 * Wraps an async function to return [error, result] tuple instead of throwing
 */
export async function to<T, U = Error>(
  promise: Promise<T>
): Promise<[U, undefined] | [null, T]> {
  try {
    const data: T = await promise;
    return [null, data];
  } catch (error: unknown) {
    return [error as U, undefined];
  }
}

/**
 * Creates a delay/sleep function
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wraps a promise with a timeout
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Retries an async function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    attempts?: number;
    delay?: number;
    backoff?: number;
  } = {}
): Promise<T> {
  const { attempts = 3, delay: initialDelay = 1000, backoff = 2 } = options;
  
  let lastError: Error;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i === attempts - 1) break;
      
      await delay(initialDelay * Math.pow(backoff, i));
    }
  }
  
  throw lastError!;
}