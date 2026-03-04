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

<div class="flex flex-col justify-center items-center min-h-screen bg-background text-foreground px-4">
	<h1 class="text-4xl font-bold mb-6">Login</h1>

	<div class="bg-card p-8 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-6">
		<!-- BetterAuth login -->
		<Login />

		<!-- Dummy PIN login -->
		<div class="flex flex-col gap-2 mt-4">
			<label class="font-semibold">PIN Login (dummy)</label>
			<input type="password" bind:value={pin} placeholder="Enter PIN" class="border border-border rounded-md p-2 text-foreground bg-background" />
			<button on:click={handleDummyPin} class="bg-primary text-primary-foreground rounded-md py-2 mt-2 hover:brightness-110 transition">
				Login with PIN
			</button>
			{#if showError}
				<p class="text-destructive font-semibold">Invalid PIN</p>
			{/if}
		</div>
	</div>
</div>