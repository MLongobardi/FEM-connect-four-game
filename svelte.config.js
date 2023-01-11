import adapter from '@sveltejs/adapter-auto';
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$comps: path.resolve("./src/lib/components/_exporter.js"),
			$scripts: path.resolve("./src/lib/scripts"),
			$stores: path.resolve("./src/lib/stores/_exporter.js"),
		},
	},
};

export default config;