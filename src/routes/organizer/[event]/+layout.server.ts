import type { LayoutServerLoad } from './$types';
import { api } from '$convex/_generated/api';
import {
	createConvexHttpClient,
	getAuthState
} from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async () => {
	const authState = getAuthState();

	if (!authState.isAuthenticated) {
		throw redirect(302, '/');
	}

	const client = createConvexHttpClient();

	try {
		const currentUser = await client.query(api.auth.getCurrentUser, {});
		return { authState, currentUser };
	} catch {
		return { authState, currentUser: null };
	}
};
