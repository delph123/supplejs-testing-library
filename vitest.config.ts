import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/*.ts"],
    },
    environment: "jsdom",
    watch: false,
    globals: true,
    clearMocks: true,
    include: ["src/__tests__/*.tsx"],
  },
});
