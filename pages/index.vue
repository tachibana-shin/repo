<template>
  <AddRepo v-if="!inCydia" />

  <div
    class="bg-white p-3 border-custom"
    style="border-left: none; border-right: none"
  >
    <div class="d-flex align-items-center">
      <img width="64" height="64" src="/CydiaIcon.png" />
      <div class="pl-1">
        <h1 class="h5">Tachibana Shin (たちばなしん) Repo</h1>
        Email:
        <a href="mailto:tachib.shin@gmail.com" target="_blank"
          >tachib.shin@gmail.com</a
        >
      </div>
    </div>
    <hr />
    <div class="text-center">
      Add this URL via Cydia™:<br />
      <a
        href="cydia://url/https://cydia.saurik.com/api/share#?source=https://tachibana-shin.github.io/repo"
        target="_blank"
        >https://tachibana-shin.github.io/repo</a
      >
    </div>
  </div>

  <div class="alert alert-info text-center mt-3">
    <strong>{{ control.countPackage }}</strong> packages uploaded.<br />
    Last update at
    <strong>{{
      new Date(control.pkgLastUpdate[0].birthtimeMs).toLocaleDateString()
    }}</strong>
  </div>

  <SocialShare />
  <PackageUpdates />
  <AllSectionsFlatPkgs />
  <ThemeChange />
  <Copyright />
</template>

<script lang="ts" setup>
import control from "./control.json";
import inCydia from "../src/constants/inCydia";
</script>
