import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig(function (_a) {
    var command = _a.command;
    return {
        base: command === 'build' ? "/toolbox/" : "/",
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
    };
});
