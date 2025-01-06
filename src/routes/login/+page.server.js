import { login } from '$lib/server/database';
import hashPassword from '$lib/server/hashPassword';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {};
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const userId = data.get('userId');
		const password = data.get('password');

		const loginCredentials = { username: userId, password: await hashPassword(password) };
		const loginResponse = await login(loginCredentials);

		if (loginResponse.status == 'success') {
			cookies.set('loginCredentials', JSON.stringify(loginCredentials), {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: true,
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});

			throw redirect(303, '/dashboard');
		}

		return { error: 'Invalid username or password' };
	}
};
