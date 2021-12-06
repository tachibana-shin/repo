<template>
  <div class="container-fluid py-4">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: "Tachibana Shin (たちばなしん) Repo",
  meta: [
    {
      charset: "utf-8"
    },
    {
      name: "description",
      hid: "description",
      content: "This is the official repo of Tachibana Shin (たちばなしん)"
    },
    {
      property: "og:title",
      hid: "og:title",
      content: "Tachibana Shin (たちばなしん) Repo",
    },
    {
      property: "og:description",
      hid: "og:description",
      content: "This is the official repo of Tachibana Shin (たちばなしん)"
    },
    {
      property: "og:image",
      hid: "og:image",
      content: "https://tachibana-shin.github.io/avatar-flat.jpg",
    },
    {
      property: "og:site_name",
      content: "Tachibana Shin (たちばなしん) Repo",
    },
    // twitter
    {
      name: "twitter:title",
      hid: "twitter:title",
      content: "Tachibana Shin (たちばなしん) Repo",
    },
    {
      name: "twitter:description",
      hid: "twitter:description",
      content: "This is the official repo of Tachibana Shin (たちばなしん)"
    },
    {
      name: "twitter:image",
      hid: "twitter:image",
      content: "https://tachibana-shin.github.io/avatar-flat.jpg",
    },
    {
      name: "twitter:card",
      content: "summary"
    },
    {
      name: "twitter:creator",
      content: "@tachib_shin"
    },
    {
      name: "twitter:card",
      content: "summary_large_image"
    }
  ]
})
</script>

<style lang="scss">
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/root";
@import "bootstrap/scss/reboot";
@import "bootstrap/scss/type";
@import "bootstrap/scss/grid";
@import "bootstrap/scss/alert";
@import "bootstrap/scss/utilities/flex";
@import "bootstrap/scss/utilities/spacing";
@import "bootstrap/scss/utilities/display";
@import "bootstrap/scss/utilities/text";

html {
  .bg-white {
    background-color: #fff;
  }

  .hover__bg-grey {
    &:hover {
      background-color: rgb(217, 217, 217);
    }
  }

  .before__bg-secondary {
    &:before {
      background-color: #c8c7cc;
    }
  }
  .title {
    color: rgb(109, 109, 114);
    font-size: 0.875rem;
    font-weight: 400;
    margin-bottom: 5px;
    text-transform: uppercase;
  }

  .border-custom {
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  body {
    background-color: #f5f5fa;
  }
  font: 16px -apple-system-font, ".Helvetica NeueUI", "Helvetica Neue",
    sans-serif;

  &.dark {
    body {
      background-color: #161616;
      color: #fff;
    }

    .bg-white {
      background-color: #000 !important;
    }

    .hover__bg-grey {
      &:hover {
        background-color: rgb((255-217), (255-217), (255-217)) !important;
      }
    }

    .before__bg-secondary {
      &:before {
        background-color: rgb(55, 56, 51) !important;
      }
    }

    .border-custom {
      border-color: rgba(255, 255, 255, 0.2) !important;
    }
  }
}
</style>
