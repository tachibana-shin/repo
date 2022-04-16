<template>
  <ListItemGroup
    name="Tachibana Shin (たちばなしん) Repo"
    :items="list"
    class="mb-0"
  />
  <p class="small text-center text-secondary">
    Repo: https://shin.is-a.dev/repo
  </p>
</template>

<script lang="ts" setup>
import useAssetsIcon from "../uses/assetsIcon";

const props = defineProps<{
  packageId?: string;
}>();

const list = [
  {
    icon: useAssetsIcon("cydia7.png"),
    name: "Open Cydia",
    to: props.packageId
      ? `cydia://url/https://cydia.saurik.com/api/share#?source=https://shin.is-a.dev/repo&package=${props.packageId}`
      : `cydia://url/https://cydia.saurik.com/api/share#?source=https://shin.is-a.dev/repo`,
  },
  {
    icon: useAssetsIcon("zebra.png"),
    name: "Open Zebra",
    to: props.packageId
      ? `zbra://sources/add/https://shin.is-a.dev/repo&package=${props.packageId}`
      : `zbra://sources/add/https://shin.is-a.dev/repo`,
  },
];
</script>
