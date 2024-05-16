import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.(ts|tsx)"],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"], // 외부 모듈 설정
  format: ["cjs", "esm"],
  cssModules: true,
  dts: true,
  loader: {
    ".css": "css", // CSS 파일 로더 설정
  },
});
