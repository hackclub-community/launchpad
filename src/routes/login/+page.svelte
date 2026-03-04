<script lang="ts">
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '$lib/auth-client';
	import Login from '$lib/components/login.svelte';

	createSvelteAuthClient({ authClient });

	let pin = '';
	let showError = false;

	function handleDummyPin() {
		if (pin === '1234') {
			alert('Dummy PIN login successful!');
			showError = false;
			// redirect or trigger auth event
		} else {
			showError = true;
		}
	}
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground"
>
	<h1 class="mb-6 text-4xl font-bold">Login</h1>

	<div class="flex w-full max-w-md flex-col gap-6 rounded-xl bg-card p-8 shadow-xl">
		<!-- BetterAuth login -->
		<Login />

		<!-- Dummy PIN login -->
		<div class="mt-4 flex flex-col gap-2">
			<label class="font-semibold">PIN Login (dummy)</label>
			<input
				type="password"
				bind:value={pin}
				placeholder="Enter PIN"
				class="rounded-md border border-border bg-background p-2 text-foreground"
			/>
			<button
				on:click={handleDummyPin}
				class="mt-2 rounded-md bg-primary py-2 text-primary-foreground transition hover:brightness-110"
			>
				Login with PIN
			</button>
			{#if showError}
				<p class="font-semibold text-destructive">Invalid PIN</p>
			{/if}
		</div>
	</div>
</div>
