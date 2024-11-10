import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		env: {
			dir: './'
		},
		alias: {
			'@/*': './path/to/lib/*',
			$lib: './src/lib'
		},
		adapter: adapter()
	},
	preprocess: vitePreprocess()
};
export default config;
