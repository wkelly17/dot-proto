import {defineConfig} from "astro/config";
import UnoCSS from "unocss/astro";
import presetUno from "unocss/preset-uno";
import presetAttributify from "unocss/preset-attributify";
import transformerVariantGroup from "@unocss/transformer-variant-group";

import solidJs from "@astrojs/solid-js";
import cloudflare from "@astrojs/cloudflare";
import AstroPWA from "@vite-pwa/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({
      theme: {
        fontFamily: {
          sans: ["Montserrat", "ui-sans-serif", "system-ui"],
        },
        colors: {
          primary: "hsl(20, 100%, 56%)",
          surface: "hsl(90, 3%, 12%)",
          base: "hsl(72, 46%, 98%)",
        },
      },
      presets: [presetUno(), presetAttributify()],
      transformers: [transformerVariantGroup()],
      rules: [
        [
          /^grid-col-fill-(\d+)$/,
          ([, d]) => ({
            "grid-template-columns": `repeat( auto-fit, minmax(${d}px, 1fr) );`,
          }),
        ],
        [
          /^scrollbar-hide$/,
          ([_]) => {
            return `.scrollbar-hide{scrollbar-width:none}
  .scrollbar-hide::-webkit-scrollbar{display:none}`;
          },
        ],
        [
          /^scrollbar-default$/,
          ([_]) => {
            return `.scrollbar-default{scrollbar-width:auto}
  .scrollbar-default::-webkit-scrollbar{display:block}`;
          },
        ],
        [
          // https://unocss.dev/config/theme#usage-in-rules
          /^text-(.*)$/,
          ([, c], {theme}) => {
            if (theme.colors[c]) return {color: theme.colors[c]};
          },
        ],
        [
          // https://unocss.dev/config/theme#usage-in-rules
          /^bg-(.*)$/,
          ([, c], {theme}) => {
            if (theme.colors[c]) {
              return {"background-color": theme.colors[c]};
            }
          },
        ],
      ],
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
