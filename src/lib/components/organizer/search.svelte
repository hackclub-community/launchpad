<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Command from '$lib/components/ui/command/index.js';
	import { menuItems } from './menu-items';
</script>

<Command.Dialog open>
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
		<Command.Group heading="Suggestions">
			<Command.Item>Calendar</Command.Item>
			<Command.Item>Search Emoji</Command.Item>
			<Command.Item>Calculator</Command.Item>
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Settings">
			<Command.Item>Profile</Command.Item>
			<Command.Item>Billing</Command.Item>
			<Command.Item>Settings</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
