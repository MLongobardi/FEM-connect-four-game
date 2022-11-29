import adapter from '@sveltejs/adapter-auto';
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			"$comps": path.resolve("./src/lib/components/_exporter.js"),
			"$scripts": path.resolve("./src/lib/scripts")
		}
	}
};

export default config;