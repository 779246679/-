<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "pdfDemo",
  data() {
    return {
      url: "",
    };
  },
});
</script>

<template>
  <div>
    <iframe width="100%" height="900px" :src="url" frameborder="0"></iframe>
  </div>
</template>

<style scoped lang="less"></style>
