<template>
  <AddRepo :package-id="packageInfoLast.control.Package" v-if="!inCydia" />

  <div class="tweak-header" v-if="!inCydia">
    <img class="icon" :src="packageIcon" />
    <div class="info">
      <h1 class="name h6">{{ propertiesShow.Name }}</h1>
      <div class="d-flex justify-content-between w-100">
        <h6 class="text-secondary">{{ propertiesShow.Version }}</h6>
        <h6 class="text-secondary">{{ propertiesShow.Size }}</h6>
      </div>
    </div>
  </div>

  <ListItemGroup
    :items="[
      {
        name: `Author`,
        icon: useAssetsIcon(`email.png`),
        after: packageInfoLast.control.Author?.replace(/<[^>]+?>/, ''),
        to: `mailto:${
          packageInfoLast.control.Author?.match(/<([^>]+?)>/)?.[1]
        }`,
      },
    ]"
    v-if="!inCydia"
  />

  <ListItemGroup
    :items="[
      {
        name: `Debian`,
        icon: useAssetsIcon(`packages.png`),
        after: propertiesShow.Size,
        to: `//debian/${propertiesShow.Package}@${propertiesShow.Version}.deb`,
      },
    ]"
    v-if="!inCydia"
  />

  <ListItemGroup
    :items="[
      {
        name: `Changelog`,
        icon: useAssetsIcon(`changelog.png`),
        to: `${route.path}/changelog`.replace(/\/{2,}/g, '/'),
      },
    ]"
    v-if="existsChangelog"
  />

  <SocialShare />

  <div id="google-translate" class="text-center" />

  <!-- notify -->
  <div
    class="my-3 alert"
    :class="[`alert-${message.type}`]"
    v-html="message.html"
    v-if="message"
  />

  <!-- check support -->
  <div>
    <h6 class="title">Package Example</h6>
    <div class="alert alert-success text-center mb-0" v-if="isSupport">
      Supported iOS version
      {{
        compatible?.latest ||
        compatible?.[packageInfoLast.control.Version] ||
        "unknown"
      }}
    </div>
    <div class="alert alert-danger text-center mb-0" v-else>
      Only support iOS versions
      {{
        compatible?.latest ||
        compatible?.[packageInfoLast.control.Version] ||
        "unknown"
      }}
    </div>
    <p class="small text-secondary text-center mt-1">
      Current iOS {{ iOSVersion || "unknown" }}
    </p>
  </div>

  <!-- description -->
  <div>
    <h6 class="title">Description</h6>
    <div class="bg-white border-custom px-3">
      <slot />
    </div>
  </div>

  <!-- this is open source -->
  <div class="mt-3" v-if="sourceCode">
    <div class="alert alert-info text-center" style="background-color: #c5e8fe">
      This tweak open source.
      <a :href="sourceCode" target="_blank">Source Code</a>
    </div>
  </div>

  <!-- screenshots -->
  <div class="mt-3 screenshots" v-if="screenshots.length > 0">
    <h6 class="title">Screenshots</h6>
    <ul class="border-custom bg-white">
      <li>
        <div>
          <a v-for="item in screenshots" :href="item">
            <img :src="item" />
          </a>
        </div>
      </li>
    </ul>
  </div>

  <!-- package info -->
  <div class="mt-3">
    <h6 class="title">Package info</h6>
    <ul class="properties bg-white border-custom">
      <li
        class="before__bg-secondary"
        v-for="[propName, value] in Object.entries(propertiesShow)"
        :key="propName"
      >
        <span class="propName">{{ propName }}</span>
        <span class="value">{{ value }}</span>
      </li>
    </ul>
  </div>

  <!-- old version -->
  <div class="mt-3">
    <h6 class="title">Old version</h6>
    <ul class="bg-white border-custom py-3">
      <li v-for="pkg in packageInfo" :key="pkg.control.Version">
        <strong>{{ pkg.control.Version }}</strong
        ><br />
        <small class="text-secondary">{{ pkg.MD5sum }}</small>
      </li>
    </ul>
  </div>

  <PackageUpdates />
  <AllSections />
  <!-- <SocialShare /> -->
  <ThemeChange />
  <Copyright />
</template>

<script lang="ts" setup>
import iOSVersion from "../computed/iOSVersion";
import filesize from "filesize";
import { format } from "timeago.js";
import { usePackageIcon } from "../uses/packageIcon";
import type { PackageControlFile } from "scripts/build-control";
import inCydia from "../constants/inCydia";
import useAssetsIcon from "../uses/assetsIcon";
import { satisfies } from "semver";

const { frontmatter } = defineProps<{ frontmatter: any }>();

const route = useRoute();

const message = frontmatter.notification;
const screenshots: string[] =
  frontmatter.screenshots || (route.meta.screenshots as string[]) || [];
const sourceCode = frontmatter["source-code"];
const existsChangelog = route.meta.existsChangelog;
const compatible = route.meta.compatible as Record<string, string> | undefined;
const packageInfo = Object.values(
  import.meta.globEager(`../../pages/package/${route.meta.ID}/control.json`)
)[0]?.default! as Required<PackageControlFile>[];
const packageInfoLast = packageInfo[0];
const isSupport: boolean | null =
  iOSVersion.value &&
  (compatible?.latest || compatible?.[packageInfoLast.control.Version])
    ? satisfies(
        iOSVersion.value,
        compatible.latest || compatible[packageInfoLast.control.Version]
      )
    : null;
const propertiesShow = {
  Name: packageInfoLast.control.Name || packageInfoLast.control.Package,
  Package: packageInfoLast.control.Package,
  Author: packageInfoLast.control.Author,
  Version: packageInfoLast.control.Version,
  Section: packageInfoLast.control.Section,
  Depends: packageInfoLast.control.Depends,
  // Description: packageInfo.control.Description,
  Conflicts: packageInfoLast.control.Conflicts,
  Architecture: packageInfoLast.control.Architecture,
  MD5sum: packageInfoLast.MD5sum,
  // SHA256sum: packageInfoLast.SHA256sum,
  // SHA512sum: packageInfoLast.SHA512sum,
  Size: filesize(packageInfoLast.size),
  "Last Update": format(packageInfoLast.birthtimeMs, "en_US", {
    relativeDate: Date.now(),
  }),
  uid: packageInfoLast.uid,
  tag: packageInfoLast.control.tag,
  dev: packageInfoLast.control.dev,
};

for (const key in propertiesShow) {
  if ((propertiesShow as any)[key] == null) {
    delete (propertiesShow as any)[key];
  }
}

const packageIcon = usePackageIcon(
  packageInfoLast.control.Icon,
  packageInfoLast.control.Section || "Unknown"
);

useHead({
  title: frontmatter.title || propertiesShow.Name,
  meta: [
    {
      charset: "utf-8",
    },
    {
      name: "description",
      hid: "description",
      content: packageInfoLast.control.Description,
    },
    {
      property: "og:title",
      hid: "og:title",
      content: frontmatter.title || propertiesShow.Name,
    },
    {
      property: "og:description",
      hid: "og:description",
      content: packageInfoLast.control.Description,
    },
    {
      property: "og:image",
      hid: "og:image",
      content: packageIcon,
    },
    // twitter
    {
      name: "twitter:title",
      hid: "twitter:title",
      content: frontmatter.title || propertiesShow.Name,
    },
    {
      name: "twitter:description",
      hid: "twitter:description",
      content: packageInfoLast.control.Description,
    },
    {
      name: "twitter:image",
      hid: "twitter:image",
      content: packageIcon,
    },
  ],
});
</script>

<style lang="scss" scoped>
.screenshots {
  width: 100%;
  position: relative;

  overflow: hidden;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      div {
        white-space: nowrap;
        position: relative;
        width: 100%;
        padding: 12px 15px;
        overflow-x: scroll;
        overflow-y: hidden;
        margin-left: -5px;
        text-align: center;

        img {
          height: 320px;
          display: inline-block;
          object-fit: cover;
          margin-left: 5px;
        }
      }
    }
  }
}

.properties {
  list-style: none;
  padding: 5px 16px;

  > li {
    display: flex;
    padding: 0.5rem 0;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      height: 1px;
      width: 100%;
      bottom: 0;
      left: 0;
    }

    &:last-child {
      &:before {
        display: none;
      }
    }

    .propName {
      width: 45%;
      max-width: 120px;
    }
    .value {
      width: 100%;
      text-align: right;
      padding-left: 5px;
      display: block;
      word-break: break-all;
      color: #777;
      display: block;
      white-space: wrap;
    }
  }
}

.tweak-header {
  display: flex;
  margin: 9px;

  .icon {
    width: 64px;
    height: 64px;
    object-fit: cover;
  }
  .info {
    padding: 6px;
    width: 100%;
  }
}
</style>
