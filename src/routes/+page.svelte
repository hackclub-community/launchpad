<script lang="ts">
	import Login from '$lib/components/login.svelte';
	import crowdImage from '$lib/assets/crowd.jpeg?enhanced';
</script>

<div
	class="relative z-10 flex h-screen w-full items-center justify-start bg-linear-to-r from-background/75 to-transparent px-10"
>
	<Login />
</div>
<p class="fixed bottom-2 left-[50%] z-10 translate-x-[-50%]">Assemble - Summer 2022</p>

<enhanced:img
	onload={(e) => {
		const img = e.currentTarget as HTMLImageElement;
		img.style.opacity = '1';
	}}
	src={crowdImage}
	class="fixed top-0 left-0 h-full w-full object-cover opacity-0 duration-200"
/>
