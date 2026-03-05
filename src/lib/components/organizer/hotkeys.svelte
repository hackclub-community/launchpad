<script lang="ts">
	import hotkeys from 'hotkeys-js';
	import { onMount } from 'svelte';
	import { searchState } from './search/search-state.svelte';

	onMount(() => {
		hotkeys('ctrl+k,command+k', (e) => {
			searchState.open = true;
			e.preventDefault();
		});

		return () => hotkeys.unbind('ctrl+k,command+k');
	});
</script>
