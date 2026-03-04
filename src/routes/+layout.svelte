<script lang="ts">
	import '@fontsource/kulim-park';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';

	import { authClient } from '$lib/auth-client';
	import { ModeWatcher } from 'mode-watcher';
	createSvelteAuthClient({ authClient });

	const { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher />
{@render children()}
