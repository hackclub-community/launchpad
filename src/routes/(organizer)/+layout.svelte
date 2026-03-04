<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/organizer/app-sidebar.svelte';
	import SidebarToggle from '$lib/components/organizer/sidebar-toggle.svelte';
	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="pt-2 pl-2">
		<SidebarToggle />
		{@render children?.()}
	</main>
</Sidebar.Provider>
