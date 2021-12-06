import "./styles/main.scss";
import "./styles/prose.scss";
import "./styles/markdown.scss";

import autoRoutes from "pages-generated";
import NProgress from "nprogress";
import { ViteSSG } from "vite-ssg";
import {
  RouterScrollBehavior,
  createWebHistory,
  createMemoryHistory,
} from "vue-router";
import { isClient } from "@vueuse/core";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { BASE_URL } from "../config.global.json";
import App from "./App.vue";

declare module "vue-router" {
  interface RouteMeta {
    frontmatter: any;
  }
}

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith("/") ? `${i.path}index.html` : `${i.path}.html`,
  };
});

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) return savedPosition;
  else return { top: 0 };
};
const history = isClient
  ? createWebHistory(BASE_URL)
  : createMemoryHistory(BASE_URL);

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior, history },
  ({ router, isClient }) => {
    dayjs.extend(LocalizedFormat);

    if (isClient) {
      router.beforeEach(() => {
        NProgress.start();
      });
      router.afterEach(() => {
        NProgress.done();
      });
    }
  }
);
