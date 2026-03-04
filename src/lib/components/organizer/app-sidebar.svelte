<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
</script>

<Sidebar.Root variant="floating">
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem class="flex h-9 items-center rounded-full bg-card pl-12">
				Launchpad
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group />
		<Sidebar.Group />
	</Sidebar.Content>
	<Sidebar.Footer />
</Sidebar.Root>
