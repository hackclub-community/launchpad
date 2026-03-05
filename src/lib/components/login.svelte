<script lang="ts">
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import Button from './ui/button/button.svelte';
	import { authClient } from '$lib/auth-client';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { ArrowRight } from '@lucide/svelte';

	const auth = useAuth();
	let loading = $state(false);
</script>

<div class="flex w-fit flex-col items-start gap-4">
	<Card.Root class="w-fit min-w-md bg-card/75 backdrop-blur-lg">
		<Card.Header>
			<Card.Title>Enter your attendee code</Card.Title>
			<Card.Description>You should have been provided this code by an organizer.</Card.Description>
		</Card.Header>
		<Card.Content>
			<InputOTP.Root maxlength={6} autofocus disabled={loading} class="w-fit">
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells.slice(0, 3) as cell, i (i)}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
					<InputOTP.Separator />
					<InputOTP.Group>
						{#each cells.slice(3, 6) as cell, i (i)}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>
		</Card.Content>
	</Card.Root>
	{#if auth.isLoading}
		<!-- Auth should never load because its preloaded on server -->
		If you are seeing this something is broken please DM Ingo
	{:else if auth.isAuthenticated}
		<Item.Root
			variant="outline"
			class="w-full rounded-xl bg-linear-to-l from-border/75 to-card/75 backdrop-blur-lg"
		>
			<Item.Content>
				<Item.Title>You're already logged in as an organizer!</Item.Title>
			</Item.Content>
			<Item.Actions>
				<Button variant="default" href="/organizer"><ArrowRight />Dashboard</Button>
			</Item.Actions>
		</Item.Root>
	{:else}
		<Button
			variant="ghost"
			disabled={loading}
			onclick={() => {
				loading = true;
				authClient.signIn.oauth2({ providerId: 'hca', callbackURL: '/organizer' });
			}}
		>
			Log in as organizer
		</Button>
	{/if}
</div>
