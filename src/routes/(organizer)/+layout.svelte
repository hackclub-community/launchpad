<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/organizer/app-sidebar.svelte';
	import SidebarToggle from '$lib/components/organizer/sidebar-toggle.svelte';
	import Search from '$lib/components/organizer/search.svelte';
	import Hotkeys from '$lib/components/organizer/hotkeys.svelte';
	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Search />
	<Hotkeys />
	<main class="pt-2 pl-2">
		<SidebarToggle />
		{@render children?.()}
	</main>
</Sidebar.Provider>
