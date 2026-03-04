<script lang="ts">
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '$lib/auth-client';
	import Login from '$lib/components/login.svelte';

	createSvelteAuthClient({ authClient });
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground"
>
	<h1 class="mb-6 text-4xl font-bold">Login</h1>

	<div class="flex w-full max-w-md flex-col gap-6 rounded-xl bg-card p-8 shadow-xl">
		<!-- BetterAuth login -->
		<Login />
	</div>
</div>
