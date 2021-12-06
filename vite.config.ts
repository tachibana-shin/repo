import { resolve, join, dirname, basename } from "path";
import { UserConfig } from "vite";
import fs from "fs-extra";
import Pages from "vite-plugin-pages";
import Inspect from "vite-plugin-inspect";
import Components from "unplugin-vue-components/vite";
import Markdown from "vite-plugin-md";
import Vue from "@vitejs/plugin-vue";
import matter from "gray-matter";
import AutoImport from "unplugin-auto-import/vite";
import anchor from "markdown-it-anchor";
import markdownAttr from "markdown-it-link-attributes";
// @ts-expect-error
import TOC from "markdown-it-table-of-contents";
import { slugify } from "./scripts/slugify";
import yaml from "yamljs";
import { BASE_URL } from "./config.global.json";

const config: UserConfig = {
  base: BASE_URL,
  resolve: {
    alias: {
      assets: join(__dirname, "src/assets"),
    },
  },
  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "@vueuse/core",
      "dayjs",
      "dayjs/plugin/localizedFormat",
    ],
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    {
      name: "vite-plugin-add-control",
      enforce: "pre",
      transform(raw, id) {
        if (
          id.endsWith("/index.md") ||
          /\/pages\/package\/[^/]+\/changelog\.md$/.test(id)
        ) {
          const md = matter(raw);

          const srcControl = join(dirname(id), "control.json");
          const control = fs.existsSync(srcControl)
            ? fs.readFileSync(srcControl, "utf8")
            : undefined;

          let changed = false;

          if (/\/pages\/package\/[^/]+\/index\.md$/.test(id)) {
            const dir = dirname(id);

            Object.assign(md.data, {
              screenshots: fs.existsSync(join(dir, "screenshots"))
                ? fs.readdirSync(join(dir, "screenshots"))
                : [],
              compatible:
                fs.existsSync(join(dir, "compatible.yml")) &&
                yaml.parse(
                  fs.readFileSync(join(dir, "compatible.yml"), "utf8")
                ),
              existsChangelog: fs.existsSync(join(dir, "changelog.md")),
            });

            changed = true;
          }

          if (control) {
            md.data.control = JSON.parse(control);
            changed = true;
          }

          if (changed) {
            return matter.stringify(md.content, md.data);
          }
        }
      },
    },

    Pages({
      extensions: ["vue", "md"],
      pagesDir: "pages",
      extendRoute(route) {
        // const path = resolve(__dirname, route.component.slice(1));

        // if (
        //   (route.component.startsWith("/pages/package/") ||
        //     route.component.startsWith("/pages/section/")) &&
        //   !route.component.endsWith("/package/index.md")
        // ) {
        //   const dir = dirname(path);

        //   route.meta = {
        //     ...(route.meta || {}),
        //     // packageInfo: JSON.parse(
        //     //   fs.readFileSync(join(dir, "control.json"), "utf8")
        //     // ),
        //   };
        // }

        return route;
      },
    }),

    Markdown({
      wrapperComponent: "post",
      wrapperClasses: "prose m-auto",
      headEnabled: true,
      markdownItOptions: {
        quotes: "\"\"''",
      },
      markdownItSetup(md) {
        md.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: "#",
            renderAttrs: () => ({ "aria-hidden": "true" }),
          }),
        });

        md.use(markdownAttr, {
          pattern: /^https?:/,
          attrs: {
            target: "_blank",
            rel: "noopener",
          },
        });

        md.use(TOC, {
          includeLevel: [1, 2, 3],
          slugify,
        });
      },
    }),

    AutoImport({
      imports: ["vue", "vue-router", "@vueuse/core", "@vueuse/head"],
    }),

    Components({
      extensions: ["vue", "md"],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),

    Inspect(),
  ],

  build: {
    rollupOptions: {
      onwarn(warning, next) {
        if (warning.code !== "UNUSED_EXTERNAL_IMPORT") next(warning);
      },
    },
    assetsInlineLimit: 0,
  },

  ssgOptions: {
    formatting: "minify",
  },
};

export default config;
