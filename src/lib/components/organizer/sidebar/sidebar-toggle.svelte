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
		'fixed top-4 left-4 z-50 flex flex-row items-center rounded-lg border bg-sidebar p-1 duration-200',
		sidebar.open && 'border-transparent'
	)}
>
	<Sidebar.Trigger />
	{#if !sidebar.open}
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
