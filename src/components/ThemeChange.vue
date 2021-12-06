<template>
  <ListItemGroup name="Theme" :items="items" />
</template>

<script lang="ts" setup>
import { isClient } from "@vueuse/core";
import cookie from "js-cookie";
import useAssetsIcon from "../uses/assetsIcon";

if (isClient && cookie.get("enabled-dark-mode") === "yes") {
  document.documentElement.classList.add("dark");
}

const items = reactive([
  {
    name: "Change Theme",
    icon:
      isClient && cookie.get("enabled-dark-mode") === "yes"
        ? useAssetsIcon("darkmode-dark.png")
        : useAssetsIcon("darkmode-light.png"),
    onclick() {
      if (cookie.get("enabled-dark-mode") === "yes") {
        items[0].icon = useAssetsIcon("darkmode-light.png");
        cookie.remove("enabled-dark-mode");
        document.documentElement.classList.remove("dark");
      } else {
        items[0].icon = useAssetsIcon("darkmode-dark.png");
        cookie.set("enabled-dark-mode", "yes", {
          path: "/",
          expires: 365,
        });
        document.documentElement.classList.add("dark");
      }
    },
  },
]);
</script>
