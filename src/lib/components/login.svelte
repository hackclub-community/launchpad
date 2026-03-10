<script lang="ts">
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import Button from './ui/button/button.svelte';
	import { authClient } from '$lib/auth-client';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { ArrowRight, ArrowRightIcon, LoaderCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import Label from './ui/label/label.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';

	const auth = useAuth();
	let loading = $state(false);
	let loginPage = $state<'participant' | 'organizer'>('participant');

	const id = $props.id();
</script>

<div class="w-full space-y-4">
	<Card.Root class="w-full bg-card/75 backdrop-blur-lg sm:max-w-md sm:min-w-md">
		{#if loginPage === 'participant'}
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
		{:else}
			<Card.Header>
				<Card.Title>Log in as an organizer</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-8">
				{#if loading}
					<div class="flex min-h-32 flex-col items-center justify-center gap-3">
						<LoaderCircle class="size-5 animate-spin" />
					</div>
				{:else}
					<Button
						disabled={loading}
						onclick={async () => {
							loading = true;
							try {
								const { error } = await authClient.signIn.oauth2({
									providerId: 'hca',
									callbackURL: '/organizer'
								});
								if (error) {
									loading = false;
									toast.error('Something went wrong');
								}
							} catch {
								loading = false;
								toast.error('Something went wrong');
							}
						}}
					>
						Continue with Hack Club
					</Button>
					<form class="flex w-full flex-col gap-2">
						<Label for="email-{id}">Email</Label>
						<InputGroup.Root class="w-full">
							<InputGroup.Input
								type="email"
								name="email"
								id="email-{id}"
								required
								placeholder="iwill@hackthisclub.com"
							/>
							<InputGroup.Addon align="inline-end">
								<InputGroup.Button variant="default" type="submit">
									<ArrowRightIcon />
									Send Code
								</InputGroup.Button>
							</InputGroup.Addon>
						</InputGroup.Root>
					</form>
				{/if}
			</Card.Content>
		{/if}
	</Card.Root>

	{#if auth.isLoading}
		<!-- Auth should never load because its preloaded on server -->
		If you are seeing this something is broken please DM Ingo
	{:else if auth.isAuthenticated}
		<Item.Root
			variant="outline"
			class="w-full rounded-xl bg-linear-to-l from-border/75 to-card/75 backdrop-blur-lg sm:max-w-md sm:min-w-md"
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
