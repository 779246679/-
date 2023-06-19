<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import watermark from "@/utils/watermark";
export default {
  mounted() {
    watermark.set("请勿泄露哦");
  },
};
</script>
<style lang="less"></style>
