<script lang="ts">
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import Button from './ui/button/button.svelte';
	import { authClient } from '$lib/auth-client';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { ArrowRight } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import Input from './ui/input/input.svelte';
	import Label from './ui/label/label.svelte';

	const auth = useAuth();
	let loading = $state(false);
	let loginPage = $state<'participant' | 'organizer'>('organizer');

	const { id } = $props();
</script>

<div class="flex w-fit flex-col items-start gap-4">
	{#if loginPage === 'participant'}
		<Card.Root class="w-fit min-w-md bg-card/75 backdrop-blur-lg">
			<Card.Header>
				<Card.Title>Enter your attendee code</Card.Title>
				<Card.Description>You should have been provided this code by an organizer.</Card.Description
				>
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
	{:else}
		<Card.Root class="w-fit min-w-md bg-card/75 backdrop-blur-lg">
			<Card.Header>
				<Card.Title>Log in as an organizer</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				<Button
					disabled={loading}
					onclick={async () => {
						loading = true;
						toast.promise(
							authClient.signIn
								.oauth2({
									providerId: 'hca',
									callbackURL: '/organizer'
								})
								.then(({ data, error }) => {
									if (error) {
										loading = false;
										throw error;
									}
									return data;
								}),
							{
								loading: 'Loading...',
								success: 'Redirecting...',
								error: 'Something went wrong'
							}
						);
					}}>Continue with Hack Club</Button
				>
				<div class="flex w-full max-w-sm flex-col gap-2">
					<Label for="email-{id}">Email</Label>
					<Input type="email" id="email-{id}" placeholder="iwill@hackthisclub.com" />
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

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
			onclick={() => {
				loginPage = loginPage === 'organizer' ? 'participant' : 'organizer';
			}}
		>
			Log in as {#if loginPage === 'organizer'}
				a participant
			{:else if loginPage === 'participant'}
				an organizer
			{/if}
		</Button>
	{/if}
</div>
