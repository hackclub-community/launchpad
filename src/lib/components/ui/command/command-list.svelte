<script lang="ts">
	import { Command as CommandPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CommandPrimitive.ListProps = $props();
</script>

<CommandPrimitive.List
	bind:ref
	data-slot="command-list"
	style="scrollbar-width: none;"
	class={cn(
		'm-1 max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto rounded-md! border bg-popover shadow-sm',
		className
	)}
	{...restProps}
/>
