<script lang="ts">
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from './ui/button/button.svelte';
</script>

<div class="flex w-fit flex-col items-center gap-4">
	<Card.Root class="w-fit min-w-md">
		<Card.Header>
			<Card.Title>Enter your attendee code</Card.Title>
			<Card.Description>You should have been provided this code by the organizer.</Card.Description>
		</Card.Header>
		<Card.Content class="flex justify-center">
			<InputOTP.Root maxlength={6}>
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
	<Button variant="ghost">Log in as organizer</Button>
</div>
