<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { ChevronUpIcon } from '@lucide/svelte';
	import type { FunctionReturnType } from 'convex/server';
	import type { api } from '$convex/_generated/api';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	const {
		data
	}: {
		data: {
			currentUser: FunctionReturnType<typeof api.auth.getCurrentUser>;
		};
	} = $props();
</script>

<Sidebar.MenuItem>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="w-full">
			<Sidebar.MenuButton size="lg" class="cursor-pointer border shadow-xs">
				<Avatar.Root>
					<Avatar.Fallback>{data.currentUser?.name.charAt(0) || ''}</Avatar.Fallback>
				</Avatar.Root>
				{data.currentUser?.name}
				<ChevronUpIcon class="mr-1 ml-auto" />
			</Sidebar.MenuButton>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Group>
				<DropdownMenu.Label
					>{data.currentUser?.name}
					<br />
					<span class="text-xs font-normal">{data.currentUser?.email}</span></DropdownMenu.Label
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
