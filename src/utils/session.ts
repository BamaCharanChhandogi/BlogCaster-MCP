/**
 * Session management utilities for token management portal
 */

const SESSION_KEY = "user-session-key";

/**
 * Generate a cryptographically secure session key
 */
export function generateSessionKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get existing session key or create a new one
 */
export async function getOrCreateSessionKey(storage: DurableObjectStorage): Promise<string> {
  let sessionKey = await storage.get<string>(SESSION_KEY);
  
  if (!sessionKey) {
    sessionKey = generateSessionKey();
    await storage.put(SESSION_KEY, sessionKey);
  }
  
  return sessionKey;
}

/**
 * Validate session key against stored key
 */
export async function validateSessionKey(storage: DurableObjectStorage, providedKey: string): Promise<boolean> {
  const storedKey = await storage.get<string>(SESSION_KEY);
  return storedKey === providedKey;
}
