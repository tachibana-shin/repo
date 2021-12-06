<template>
  <h6 class="title" v-if="name">{{ name }}</h6>

  <ul class="list-item bg-white border-custom" v-bind="$attrs">
    <li v-for="(item, index) in items" :key="index">
      <component
        :is="
          item.to
            ? item.to.includes('://') ||
              item.to.startsWith('//') ||
              item.to.startsWith('mailto:')
              ? `a`
              : `router-link`
            : `span`
        "
        :to="
          item.to &&
          (item.to.includes('://') ||
            item.to.startsWith('//') ||
            item.to.startsWith('mailto:')) === false
            ? item.to
            : undefined
        "
        :href="
          item.to &&
          (item.to.includes('://') ||
            item.to.startsWith('//') ||
            item.to.startsWith('mailto:')) === true
            ? item.to.replace(/^\/{2}/, `${BASE_URL}`)
            : undefined
        "
        :target="
          item.to &&
          (item.to.includes('://') ||
            item.to.startsWith('//') ||
            item.to.startsWith('mailto:')) === true
            ? `_blank`
            : undefined
        "
        class="item__child d-flex justify-content-between align-items-center hover__bg-grey before__bg-secondary"
        :class="{
          'no-chevron': item.noChevron,
        }"
        @click="item.onclick"
      >
        <div class="d-flex align-items-center">
          <img :src="item.icon" class="icon" v-if="item.icon" />
          <div class="pl-2">
            <p class="text-truncate mb-0">{{ item.name }}</p>
            <small class="d-block" v-if="item.version"
              >{{ item.version }}
              <span class="text-secondary ml-1" v-if="item.subversion">{{
                item.subversion
              }}</span></small
            >
          </div>
        </div>
        <span class="text-secondary mr-4" v-if="item.after">{{
          item.after
        }}</span>
      </component>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { BASE_URL } from "../../config.global.json";

defineProps<{
  name?: string;
  items: {
    name: string;
    icon?: string;
    to?: string;
    version?: string;
    subversion?: string;
    noChevron?: boolean;
    after?: string;
    onclick?: () => void;
  }[];
}>();
</script>

<style lang="scss" scoped>
@use "sass:math";

.list-item {
  padding: 0;
  list-style: none;

  li {
    margin: 0;
    padding: 0;
    & > .no-chevron:after {
      background-image: none;
    }

    & > .item__child {
      text-decoration: none;
      color: inherit;
    }

    & > * {
      //margin-left: 15px;
      //padding: 12px 15px;
      padding: 6px 15px;
      min-height: math.div(40rem, 16);
      box-sizing: border-box;
      position: relative;

      &:first-child {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }

      &:last-child {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      &:after {
        content: "";
        display: block;
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NSIgaGVpZ2h0PSI5OSI+PHBvbHlnb24gcG9pbnRzPSIzNC43LDQ5LjcgMCw4NC40IDE1LjEsOTkuNSA2NC44LDQ5LjcgNDkuNywzNC43IDE1LjEsMCAwLDE1LjEiIHN0eWxlPSJmaWxsOiNjN2M3Y2MiLz48L3N2Zz4=);
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(-100%, -50%);
        width: 10px;
        height: 13px;
        background-size: 100% 100%;
      }

      position: relative;
      overflow: hidden;
      vertical-align: middle;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      &:before {
        content: "";
        position: absolute;
        height: 1px;
        width: 100%;
        bottom: 0;
        left: (2em + math.div(30, 16));
      }

      .icon {
        width: 2em;
	height: 2em;
        // background-image: url("assets/icons/Sections/Unknown.png");
      }
    }

    &:last-child *:before {
      display: none;
    }
  }
}
</style>
