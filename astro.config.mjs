import {defineConfig} from "astro/config";
import UnoCSS from "unocss/astro";
import {presetUno} from "unocss";
import {transformerVariantGroup} from "unocss";
import {presetAttributify} from "unocss";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";

// https://astro.build/config

// https://astro.build/config
import cloudflare from "@astrojs/cloudflare";

import AstroPWA from "@vite-pwa/astro";
import {presetUno} from "unocss";
// todo: I want to use attirbutify, but it doesn't work with unocss 50's... Try 49's, but it might just not work.

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
