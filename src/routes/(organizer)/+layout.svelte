<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/organizer/app-sidebar.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="pt-2 pl-2">
		<div class="flex flex-row items-center gap-1 rounded-lg border bg-sidebar p-1 pr-2">
			<Sidebar.Trigger />
			<Badge variant="outline">Launchpad</Badge>
		</div>
		{@render children?.()}
	</main>
</Sidebar.Provider>
