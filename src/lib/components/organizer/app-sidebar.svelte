<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import {
		ChevronUpIcon,
		HouseIcon,
		InfoIcon,
		UserIcon,
		UsersIcon,
		type IconProps
	} from '@lucide/svelte';
	import type { Component } from 'svelte';

	const sidebarItems: {
		title?: string;
		items: {
			title: string;
			href: string;
			icon?: Component<IconProps>;
		}[];
	}[] = [
		{
			items: [
				{
					title: 'Home',
					href: '/organizer',
					icon: HouseIcon
				},
				{
					title: 'Teams',
					href: '/organizer/teams',
					icon: UsersIcon
				}
			]
		},
		{
			title: 'Management',
			items: [
				{
					title: 'Event Details',
					href: '/organizer/details',
					icon: InfoIcon
				},
				{
					title: 'Members',
					href: '/organizer/members',
					icon: UserIcon
				}
			]
		}
	];
</script>

<Sidebar.Root variant="floating">
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem class="flex h-9 flex-col justify-center rounded-full bg-card pl-12">
				<p class="text-xs">Launchpad</p>
				<p>Event name</p>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
		{#each sidebarItems as item, i (i)}
			<Sidebar.Group>
				{#if item.title}
					<Sidebar.GroupLabel>{item.title}</Sidebar.GroupLabel>
				{/if}
				<Sidebar.GroupContent>
					{#each item.items as subItem, j (j)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={subItem.href} {...props}>
										{#if subItem.icon}
											<subItem.icon />
										{/if}
										{subItem.title}
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					<Avatar.Root>
						<Avatar.Fallback>U</Avatar.Fallback>
					</Avatar.Root>
					Username
					<ChevronUpIcon class="mr-1 ml-auto" />
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
