import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		include: ["sweetalert2"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src/"),
		},
	},
});
