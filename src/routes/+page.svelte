<script lang="ts">
	import Login from '$lib/components/login.svelte';
	import crowdImage from '$lib/assets/crowd.jpeg?enhanced';
</script>

<div
	class="relative z-10 flex h-screen w-full items-center justify-start bg-linear-to-r from-background/75 to-transparent px-10"
>
	<Login />
</div>
<enhanced:img src={crowdImage} class="fixed top-0 left-0 h-full w-full object-cover" />
