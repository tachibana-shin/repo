<template>
  <ListItemGroup name="Sections" :items="items" />
</template>

<script lang="ts" setup>
import list from "/pages/section-list.json";
import { usePackageIcon } from "../uses/packageIcon";

const items = list.map((item) => {
  return {
    name: `${item.name}`,
    icon: usePackageIcon(undefined, item.name),
    version: " ",
    subversion: `${item.countPackage} packages`,
    to: item.to,
  };
});
</script>
