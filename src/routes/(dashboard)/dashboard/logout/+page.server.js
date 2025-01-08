import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
  locals.user = null
  return {}
};

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies }) => {
        cookies.delete('loginCredentials', { path: '/' });
        throw redirect(303, '/login');
	}
};
