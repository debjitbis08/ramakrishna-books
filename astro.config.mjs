// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import alpinejs from "@astrojs/alpinejs";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  experimental: {
    svg: true,
  },
  integrations: [mdx(), tailwind()],
});

