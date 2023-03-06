import {defineConfig} from "astro/config";
import UnoCSS from "unocss/astro";
import presetUno from "@unocss/preset-uno";
import transformerVariantGroup from "@unocss/transformer-variant-group";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";

// https://astro.build/config

// https://astro.build/config
import cloudflare from "@astrojs/cloudflare";

import AstroPWA from "@vite-pwa/astro";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    mode: "directory",
  }),
  integrations: [
    UnoCSS({
      presets: [presetUno()],
      transformers: [transformerVariantGroup()],
    }),
    solidJs(),
    AstroPWA({
      srcDir: "src",
      filename: "sw.js",
      strategies: "injectManifest",
      manifest: false,
      injectManifest: {
        globIgnores: [
          "**/node_modules/**/*",
          "$server_build/*",
          "$server_build/**/*",
        ],
      },
      registerType: "autoUpdate",
      // manifest: {},
      devOptions: {
        enabled: true,
        type: "module",
        /* other options */
      },
    }),
  ],
});
