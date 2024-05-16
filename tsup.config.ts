import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.(ts|tsx)"],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["cjs", "esm"],
  dts: true,
});
