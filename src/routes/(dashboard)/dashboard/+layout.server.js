/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals }) => {
    return {
        username: locals.user.UserName
    }
};