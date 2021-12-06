<template>
  <Depiction
    v-if="route.path.startsWith(`/package/`) && route.path.includes(`/changelog`) === false"
    :frontmatter="frontmatter"
  >
	<slot />
  </Depiction>
  <Changelog v-else-if="route.path.startsWith(`/package/`) && route.path.includes(`/changelog`)" :frontmatter="frontmatter">
	<slot />
  </Changelog>
  <Section
    v-else-if="route.path.startsWith(`/section/`)"
    :frontmatter="frontmatter"
  >
	<slot />
  </Section>
  <Unknown v-else :frontmatter="frontmatter">
	<slot />
  </Unknown>
</template>

<script lang="ts" setup>
defineProps<{
  frontmatter: any;
}>();

const route = useRoute();
</script>
