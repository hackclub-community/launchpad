import type { LayoutServerLoad } from './$types';
import { api } from '$convex/_generated/api';
import { createAuth } from '$convex/auth.js';
import {
	createConvexHttpClient,
	getAuthState
} from '@mmailaender/convex-better-auth-svelte/sveltekit';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const authState = await getAuthState(createAuth, cookies);

	if (!authState.isAuthenticated) {
		return { authState, currentUser: null };
	}

	const client = createConvexHttpClient({ token: locals.token });

	try {
		const currentUser = await client.query(api.auth.getCurrentUser, {});
		return { authState, currentUser };
	} catch {
		return { authState, currentUser: null };
	}
};
