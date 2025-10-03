/**
 * UUID generator utility
 * Simple UUID v4 implementation for generating unique identifiers
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a new UUID v4
 * @returns A new UUID string
 */
export function generateUUID(): string {
  return uuidv4();
}

/**
 * Generate a new UUID v4 (alias for generateUUID)
 * @returns A new UUID string
 */
export function createId(): string {
  return generateUUID();
}

/**
 * Validate if a string is a valid UUID v4
 * @param uuid The string to validate
 * @returns True if valid UUID v4, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate a timestamp-based ID (alternative to UUID)
 * @returns A timestamp-based ID string
 */
export function generateTimestampId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
