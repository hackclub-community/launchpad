<script lang="ts">
	import Login from '$lib/components/login.svelte';
</script>

<div
	class="relative flex min-h-screen w-full items-center bg-cover bg-center px-6 text-white"
	style="background-image:
		linear-gradient(to bottom right, rgba(0,0,0,0.65), rgba(0,0,0,0.65)),
		url('https://cdn.hackclub.com/019c3145-9292-72ce-9c97-6e2fbddcc559/crowd.jpeg');"
>
	<div class="w-full max-w-md">
		<div
			class="rounded-2xl p-8 shadow-2xl backdrop-blur-md"
			style="background-color: rgba(0,0,0,0.6);"
		>
			<h1 class="mb-2 text-4xl" style="font-family: 'Lalezar', sans-serif;">Login</h1>

			<p class="mb-6" style="font-family: 'Labrada', serif;">Enter your attendee code</p>

			<div class="mb-4">
				<Login />
			</div>

			<a
				href="/login"
				class="text-sm underline opacity-80 hover:opacity-100"
				style="font-family: 'Kulim Park', sans-serif;"
			>
				Are you an organiser?
			</a>
		</div>
	</div>

	<div
		class="absolute bottom-6 left-0 w-full text-center text-sm opacity-80"
		style="font-family: 'Kulim Park', sans-serif;"
	>
		Assemble • 2022
	</div>
</div>
