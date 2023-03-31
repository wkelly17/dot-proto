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
import {presetAttributify} from "unocss";

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({
      presets: [presetUno(), presetAttributify()],
      transformers: [transformerVariantGroup()],
    }),
    solidJs(),
    AstroPWA({
      srcDir: "src",
      filename: "sw.js",
      strategies: "injectManifest",
      registerType: "autoUpdate",
      // manifest: {},
      devOptions: {
        enabled: true,
        type: "module",
        /* other options */
      },
    }),
  ],
  output: "server",
  adapter: cloudflare({
    mode: "directory",
  }),
});
