<template>
  <div class="container">
    {{ myNum.num }}
    <el-button @click="add">+2</el-button>
  </div>
</template>
<script>
export default {
  name: "SonTestInject",
  inject: ["myNum"],
  methods: {
    add() {
      this.myNum.num += 2;
    },
  },
};
</script>

<style scoped lang="less"></style>
