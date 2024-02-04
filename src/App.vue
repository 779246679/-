<template>
  <div id="app"><TestProvide></TestProvide></div>
</template>
<script>
import watermark from "@/utils/watermark";
import TestProvide from "@/components/testProvide/TestProvide.vue";
export default {
  components: { TestProvide },
  mounted() {
    watermark.set("请勿泄露哦");
  },
};
</script>
<style lang="less"></style>
