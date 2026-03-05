<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { ChevronUpIcon } from '@lucide/svelte';
</script>

<Sidebar.MenuItem>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="w-full">
			<Sidebar.MenuButton size="lg" class="cursor-pointer border shadow-xs">
				<Avatar.Root>
					<Avatar.Fallback>U</Avatar.Fallback>
				</Avatar.Root>
				Username
				<ChevronUpIcon class="mr-1 ml-auto" />
			</Sidebar.MenuButton>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Group>
				<DropdownMenu.Label>My Account</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>Settings</DropdownMenu.Item>
				<DropdownMenu.Item>Sign out</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Sidebar.MenuItem>
