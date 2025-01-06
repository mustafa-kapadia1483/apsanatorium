import { authenticateUser } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

/** @type {import('@sveltejs/kit').Handle} */
async function validateAccessToProtectedRoutes({ event, resolve }) {

	// Check if the user is already logged in
	if (event.url.pathname.startsWith('/login')) {
		const loginResponse = await authenticateUser(event);

		if (loginResponse.status == 'success') {
			throw redirect(303, '/dashboard');
		}
	}
	
	if (event.url.pathname.startsWith('/dashboard')) {
		const loginResponse = await authenticateUser(event);

		if (loginResponse.status == 'success') {
			event.locals.user = loginResponse.loggedInUserData;
		} else {
			throw redirect(303, '/login');
		}
	}

	const result = await resolve(event);
	return result;
}

export const handle = sequence(validateAccessToProtectedRoutes);
