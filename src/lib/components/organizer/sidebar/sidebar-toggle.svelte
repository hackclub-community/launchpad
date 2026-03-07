<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { SearchIcon } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	const sidebar = useSidebar();
</script>

<div
	class={cn(
		'fixed bottom-2 left-[50%] z-50 flex translate-x-[-50%] flex-row items-center rounded-lg border border-transparent bg-sidebar p-1 duration-200 md:top-4 md:bottom-auto md:left-4 md:translate-x-0',
		(!sidebar.open || sidebar.isMobile) && 'border-border shadow-xs'
	)}
>
	<Sidebar.Trigger />
	{#if !sidebar.open || sidebar.isMobile}
		<div
			in:slide={{ axis: 'x', duration: 100, easing: cubicOut, delay: 150 }}
			out:slide={{ axis: 'x', duration: 100, easing: cubicOut }}
			class="flex gap-1 rounded-full px-1"
		>
			<Badge><SearchIcon /> Search</Badge>
			<Badge variant="outline">Event name</Badge>
		</div>
	{/if}
</div>
