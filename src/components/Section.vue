<template>
  <ListItemGroup
    :items="[
      {
        name: 'Back',
        icon: useAssetsIcon('back.png'),
        onclick: () => $router.back(),
        noChevron: true,
      },
    ]"
  />

  <AddRepo v-if="!inCydia" />

  <h6 class="title">{{ sectionInfo.name }}</h6>

  <div class="alert alert-info text-center">
    <strong>{{ sectionInfo.packages.length }}</strong> packages this in
    section.<br />
    Last update at
    {{
      new Date(
        sectionInfo.packages
          .sort((a, b) => a.ctimeMs - b.ctimeMs)
          .reverse()[0].ctimeMs
      ).toLocaleString()
    }}
  </div>

  <ListItemGroup :items="items" />
</template>

<script lang="ts" setup>
import type { SectionControlFile } from "../../scripts/build-control";
import inCydia from "../constants/inCydia";
import { usePackageIcon } from "../uses/packageIcon";
import useAssetsIcon from "../uses/assetsIcon";

const { frontmatter } = defineProps<{
  frontmatter: any;
}>();

const sectionInfo = frontmatter.control as SectionControlFile;
const items = sectionInfo.packages.map((pkg) => ({
  name: pkg.name,
  icon: usePackageIcon(pkg.icon, sectionInfo.name),
  version: pkg.lastVersion,
  to: inCydia
    ? `https://shin.is-a.dev/repo/package/${pkg.packageID}`
    : `/package/${pkg.packageID}`,
}));

useHead({
  title: frontmatter.title || sectionInfo.name,
  meta: [
    {
      charset: "utf-8",
    },
    {
      name: "description",
      hid: "description",
      content: `Packages in section ${sectionInfo.name}`,
    },
    {
      property: "og:title",
      hid: "og:title",
      content: frontmatter.title || sectionInfo.name,
    },
    {
      property: "og:description",
      hid: "og:description",
      content: `Packages in section ${sectionInfo.name}`,
    },
    {
      property: "og:image",
      hid: "og:image",
      content: usePackageIcon(undefined, sectionInfo.name),
    },
    // twitter
    {
      name: "twitter:title",
      hid: "twitter:title",
      content: frontmatter.title || sectionInfo.name,
    },
    {
      name: "twitter:description",
      hid: "twitter:description",
      content: `Packages in section ${sectionInfo.name}`,
    },
    {
      name: "twitter:image",
      hid: "twitter:image",
      content: usePackageIcon(undefined, sectionInfo.name),
    },
  ],
});
</script>
