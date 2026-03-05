<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Command from '$lib/components/ui/command/index.js';
	import { menuItems } from '../menu-items';
	import { searchState } from './search-state.svelte';
</script>

<Command.Dialog open={searchState.open} onOpenChange={(open) => (searchState.open = open)}>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		{#each menuItems as item, i (i)}
			<Command.Group heading={item.title}>
				{#each item.items as subItem, j (j)}
					<Command.Item
						onSelect={() => {
							if (subItem.href) {
								goto(subItem.href);
							} else if (subItem.onClick) {
								subItem.onClick();
							}
							searchState.open = false;
						}}
					>
						{#if subItem.icon}
							<subItem.icon class="text-inherit" />
						{/if}
						{subItem.title}
					</Command.Item>
				{/each}
			</Command.Group>
		{/each}
	</Command.List>
</Command.Dialog>
