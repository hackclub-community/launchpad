<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { ChevronUpIcon } from '@lucide/svelte';
	import type { FunctionReturnType } from 'convex/server';
	import { api } from '$convex/_generated/api';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { useQuery } from 'convex-svelte';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { cn } from '$lib/utils';
	import { type ComponentProps } from 'svelte';

	const {
		data
	}: {
		data: {
			currentUser: FunctionReturnType<typeof api.auth.getCurrentUser>;
		};
	} = $props();

	const auth = useAuth();

	const user = useQuery(
		api.auth.getCurrentUser,
		() => (auth.isAuthenticated ? {} : 'skip'),
		() => ({
			initialData: data.currentUser,
			keepPreviousData: true
		})
	);

	let accountMenuOpen = $state(false);
</script>

<Sidebar.MenuItem>
	<DropdownMenu.Root open={accountMenuOpen} onOpenChange={(open) => (accountMenuOpen = open)}>
		<DropdownMenu.Trigger class="w-full">
			{#snippet child({ props })}
				{@render menuButton({ props })}
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Group>
				<DropdownMenu.Label
					>{user.data?.name}
					<br />
					<span class="text-xs font-normal">{user.data?.email}</span></DropdownMenu.Label
				>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>Settings</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() =>
						toast.promise(
							authClient.signOut().then(({ data, error }) => {
								if (error) {
									throw error;
								}
								goto('/');
								return data;
							}),
							{
								loading: 'Signing out...',
								success: 'Signed out',
								error: 'Something went wrong'
							}
						)}>Sign out</DropdownMenu.Item
				>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Sidebar.MenuItem>

{#snippet menuButton({ props }: { props: ComponentProps<typeof Sidebar.MenuButton> })}
	<Sidebar.MenuButton
		size="lg"
		{...props}
		class={cn('cursor-pointer border shadow-xs' + props.class)}
	>
		<Avatar.Root>
			<Avatar.Fallback>{user.data?.name?.charAt(0) || ''}</Avatar.Fallback>
		</Avatar.Root>
		{user.data?.name}
		<ChevronUpIcon class="mr-1 ml-auto transition-transform in-data-[state=open]:rotate-180" />
	</Sidebar.MenuButton>
{/snippet}
