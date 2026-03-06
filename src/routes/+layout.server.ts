import type { LayoutServerLoad } from './$types';
import { createAuth } from '$convex/auth.js';
import { getAuthState } from '@mmailaender/convex-better-auth-svelte/sveltekit';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const authState = await getAuthState(createAuth, cookies);
	return { authState };
};
