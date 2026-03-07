import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		enhancedImages(),
		Icons({
			compiler: 'svelte',
			customCollections: {
				logos: FileSystemIconLoader('./src/lib/assets/logos')
			}
		})
	]
});
