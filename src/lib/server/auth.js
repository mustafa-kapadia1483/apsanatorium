import { login } from '$lib/server/database';
/** @import { LoginResponse } from '$lib/server/database' */

/**
 * @param {import('@sveltejs/kit').Handle} event
 * @returns {Promise<LoginResponse>}
 */
export async function authenticateUser(event) {
	const { cookies } = event;
	const loginCredentialsCookie = cookies.get('loginCredentials');

	if (loginCredentialsCookie === undefined || loginCredentialsCookie.length == 0) {
		return {
			status: 'failed',
			loggedInUserData: null
		};
	}

	try {
		const loginResponse = await login(JSON.parse(loginCredentialsCookie));
		console.log(loginResponse);

		return loginResponse;
	} catch (e) {
		console.log(e);
		return {
			status: 'failed',
			loggedInUserData: null
		};
	}
}
