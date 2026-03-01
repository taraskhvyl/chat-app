import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

const env = loadEnv("", process.cwd(), "");

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    env: {
      ...env,
      API_URL: env.API_URL ?? "http://localhost:3000",
      AUTH_TOKEN: env.AUTH_TOKEN ?? "super-secret-doodle-token",
    },
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
