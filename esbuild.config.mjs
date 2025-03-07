import { build } from "esbuild";
import copyPlugin from "esbuild-plugin-copy";

build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  platform: "node",
  outfile: "dist/main.cjs",
  plugins: [
    copyPlugin({
      assets: {
        from: ["src/public/**/*"],
        to: ["public"],
      },
    }),
  ],
}).catch((e) => {
  console.error("Build failed: ", e);
  process.exit(1);
});
