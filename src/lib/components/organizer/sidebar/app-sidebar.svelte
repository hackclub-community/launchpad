<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { SearchIcon } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import KbdGroup from '$lib/components/ui/kbd/kbd-group.svelte';
	import Kbd from '$lib/components/ui/kbd/kbd.svelte';
	import { menuItems } from '../menu-items';
	import { searchState } from '../search/search-state.svelte';
	import User from './user.svelte';

	const { data } = $props();
</script>

<Sidebar.Root variant="floating">
	<Sidebar.Header class="space-y-2">
		<Sidebar.Menu>
			<Sidebar.MenuItem class="flex h-9 flex-col justify-center rounded-full md:pl-10">
				<Button
					variant="outline"
					class="justify-start"
					onclick={() => (searchState.open = !searchState.open)}
				>
					<SearchIcon />
					Search
					<KbdGroup class="ml-auto">
						<Kbd>⌘</Kbd><Kbd>K</Kbd>
					</KbdGroup>
				</Button>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
		{#each menuItems as item, i (i)}
			<Sidebar.Group>
				{#if item.title}
					<Sidebar.GroupLabel>{item.title}</Sidebar.GroupLabel>
				{/if}
				<Sidebar.GroupContent>
					{#each item.items as subItem, j (j)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									{#if subItem.href}
										<a
											href={subItem.href}
											{...props}
											class={cn(props.class || '', 'cursor-pointer')}
										>
											{@render menuItemContent()}
										</a>
									{:else}
										<button
											onclick={subItem.onClick}
											{...props}
											class={cn(props.class || '', 'cursor-pointer')}
										>
											{@render menuItemContent()}
										</button>
									{/if}
									{#snippet menuItemContent()}
										{#if subItem.icon}
											<subItem.icon />
										{/if}
										{subItem.title}
									{/snippet}
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
			<User {data} />
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
