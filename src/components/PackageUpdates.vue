<template>
  <ListItemGroup name="Package Updates" :items="items" />
</template>

<script lang="ts" setup>
import { pkgLastUpdate } from "/pages/control.json";
import inCydia from "../constants/inCydia";
import { usePackageIcon } from "../uses/packageIcon";
import { format } from "timeago.js";

const items = pkgLastUpdate.map((pkg) => ({
  name: pkg.name || pkg.packageID,
  icon: usePackageIcon(pkg.icon, pkg.section),
  version: pkg.lastVersion,
  to: inCydia
    ? `https://shin.is-a.dev/repo/package/${pkg.packageID}`
    : `/package/${pkg.packageID}`,
  subversion: format(pkg.ctimeMs, "en_US", {
    relativeDate: Date.now(),
  }),
}));
</script>
