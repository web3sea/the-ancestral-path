/**
 * Validation utilities
 */

import { ValidationError } from './errors';

/**
 * Validates that a value is not null or undefined
 */
export function required<T>(value: T | null | undefined, fieldName: string): T {
  if (value === null || value === undefined) {
    throw new ValidationError(`${fieldName} is required`);
  }
  return value;
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
}

/**
 * Validates that a string is not empty
 */
export function notEmpty(value: string, fieldName: string): string {
  if (!value || value.trim().length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`);
  }
  return value.trim();
}

/**
 * Validates that a number is positive
 */
export function isPositive(value: number, fieldName: string): number {
  if (value <= 0) {
    throw new ValidationError(`${fieldName} must be positive`);
  }
  return value;
}

/**
 * Validates that a value is one of the allowed options
 */
export function isOneOf<T>(value: T, options: T[], fieldName: string): T {
  if (!options.includes(value)) {
    throw new ValidationError(`${fieldName} must be one of: ${options.join(', ')}`);
  }
  return value;
}