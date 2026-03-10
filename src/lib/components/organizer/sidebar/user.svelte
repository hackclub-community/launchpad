<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { ChevronUpIcon, LogOutIcon, SettingsIcon } from '@lucide/svelte';
	import type { FunctionReturnType } from 'convex/server';
	import { api } from '$convex/_generated/api';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { useQuery } from 'convex-svelte';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { cn } from '$lib/utils';
	import { type ComponentProps } from 'svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import AccountDialog from './account-dialog.svelte';

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

	const sidebar = useSidebar();

	let accountMenuOpen = $state(false);
	let accountDialogOpen = $state(false);

	const actions = [
		{
			text: 'Settings',
			icon: SettingsIcon,
			onClick: () => {
				accountDialogOpen = true;
			}
		},
		{
			text: 'Sign out',
			icon: LogOutIcon,
			onClick: () => {
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
				);
			}
		}
	];
</script>

<Sidebar.MenuItem>
	{#if sidebar.isMobile}
		{@render menuButton({
			props: {
				onclick: () => {
					accountDialogOpen = true;
				}
			}
		})}
	{:else}
		<DropdownMenu.Root open={accountMenuOpen} onOpenChange={(open) => (accountMenuOpen = open)}>
			<DropdownMenu.Trigger class="w-full">
				{#snippet child({ props })}
					{@render menuButton({ props })}
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="p-2">
				<DropdownMenu.Group>
					<div class="px-2 pb-2">
						{user.data?.name}
						<br />
						<span class="text-xs font-normal">{user.data?.email}</span>
					</div>
					<div class="grid w-52 grid-cols-2 gap-2">
						{#each actions as action (action.text)}
							<DropdownMenuPrimitive.Item
								onclick={action.onClick}
								class={cn(buttonVariants({ variant: 'outline' }), 'h-fit flex-col rounded-sm py-4')}
							>
								<action.icon />{action.text}
							</DropdownMenuPrimitive.Item>
						{/each}
					</div>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</Sidebar.MenuItem>
<AccountDialog
	bind:open={accountDialogOpen}
	profileName={user.data?.name}
	profileEmail={user.data?.email}
/>

{#snippet menuButton({ props }: { props: ComponentProps<typeof Sidebar.MenuButton> })}
	<Sidebar.MenuButton
		size="lg"
		{...props}
		class={cn('cursor-pointer border shadow-xs', props.class)}
	>
		<Avatar.Root>
			<Avatar.Fallback>{user.data?.name?.charAt(0) || ''}</Avatar.Fallback>
		</Avatar.Root>
		{user.data?.name}
		<ChevronUpIcon class="mr-1 ml-auto transition-transform in-data-[state=open]:rotate-180" />
	</Sidebar.MenuButton>
{/snippet}
