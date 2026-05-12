import type { LayoutServerLoad } from './$types';
import { getAuthState } from '@mmailaender/convex-better-auth-svelte/sveltekit';

export const load: LayoutServerLoad = () => {
	return { authState: getAuthState() }; // synchronous, no await needed
};
