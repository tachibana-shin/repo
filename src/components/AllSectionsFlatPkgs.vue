<template>
  <template v-for="section in sections" :key="section.name">
    <ListItemGroup
      :name="section.name"
      :items="section.packages.concat([{
          name: 'More...',
          icon: useAssetsIcon('moreinfo.png') as any,
          to: section.to,
        } as any,
    ])"
    />
  </template>
</template>

<script lang="ts" setup>
import { usePackageIcon } from "../uses/packageIcon";
import inCydia from "../constants/inCydia";
import listSections from "/pages/section-list-pkgs.json";
import useAssetsIcon from "../uses/assetsIcon";
import { format } from "timeago.js";

const sections = listSections.map((section) => {
  return {
    ...section,
    packages: section.packages.map((pkg) => {
      return {
        name: pkg.name || pkg.packageID,
        icon: usePackageIcon(pkg.icon, section.name),
        to: inCydia
          ? `https://shin.is-a.dev/repo/package/${pkg.packageID}`
          : `/package/${pkg.packageID}`,
      };
    }),
  };
});
</script>
