<template>
  <ListItemGroup :name="noName ? undefined : `Social`" :items="items" />
</template>

<script lang="ts" setup>
import useAssetsIcon from "../uses/assetsIcon";

defineProps<{
  noName?: boolean;
}>();

const items = [
  {
    icon: useAssetsIcon("github.png"),
    name: "Github",
    to: "https://github.com/tachibana-shin",
  },
  {
    icon: useAssetsIcon("reddit.png"),
    name: "Reddit",
    to: "https://reddit.com",
  },
  {
    icon: useAssetsIcon("twitter.png"),
    name: "Follow Tachibana Shin",
    to: "https://twitter.com/tachib_shin",
  },
  {
    icon: useAssetsIcon("ipa.png"),
    name: "Tools Jailbreak",
    to: "https://tachibana-shin.github.io/jailbreak-tools",
  },
];
</script>
