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

  <AddRepo :package-id="packageId" v-if="!inCydia" />

  <h6 class="title">Changelog: {{ name }}</h6>

  <slot />
</template>

<script lang="ts" setup>
import inCydia from "../constants/inCydia";
import useAssetsIcon from "../uses/assetsIcon";
import type { PackageControlFile } from "scripts/build-control";

const { frontmatter } = defineProps<{
  frontmatter: any;
}>();

const packageId = useRoute().path.match(/\/package\/([^/]+)\//)?.[1];
const name =
  (frontmatter.control as Required<PackageControlFile>[])[0].control.Name ||
  (frontmatter.control as Required<PackageControlFile>[])[0].control.Package;
</script>
