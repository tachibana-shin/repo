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

defineProps<{
  frontmatter: any;
}>();

const packageId = useRoute().path.match(/\/package\/([^/]+)\//)?.[1];
const name = ref<string>("");

import(/* @vite-ignore */ `../../pages/package/${packageId}/control.json`)
  .then((res) => {
    name.value = res.default[0].control.Name;
  })
  .catch(() => {});
</script>
