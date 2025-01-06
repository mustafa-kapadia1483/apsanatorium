import { SECRET_PASSWORD_SALT } from '$env/static/private';

/**
 * Hashes a password using PBKDF2 with SHA-256
 * @async
 * @function hashPassword
 * @param {string} password - The password to hash
 * @returns {Promise<string>} A base64 encoded hash of the password
 * @throws {Error} If SECRET_PASSWORD_SALT is not set or if hashing fails
 * @example
 * try {
 *   const hash = await hashPassword('myPassword123');
 *   console.log('Password hash:', hash);
 * } catch (error) {
 *   console.error('Hashing failed:', error.message);
 * }
 */
export default async function hashPassword(password) {
	try {
		if (!SECRET_PASSWORD_SALT) {
			throw new Error('SECRET_PASSWORD_SALT environment variable is required');
		}

		const enc = new TextEncoder();
		const passwordBytes = enc.encode(password);
		const saltBytes = enc.encode(SECRET_PASSWORD_SALT);

		// Import the password as a key
		const keyMaterial = await crypto.subtle.importKey('raw', passwordBytes, 'PBKDF2', false, [
			'deriveBits'
		]);

		// Derive bits directly for hashing
		const hashBuffer = await crypto.subtle.deriveBits(
			{
				name: 'PBKDF2',
				salt: saltBytes,
				iterations: 100000,
				hash: 'SHA-256'
			},
			keyMaterial,
			256 // 256 bits for the hash
		);

		// Convert to Base64
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashBase64 = btoa(String.fromCharCode(...hashArray));

		return hashBase64;
	} catch (error) {
		throw new Error(`Hashing failed: ${error.message}`);
	}
}
