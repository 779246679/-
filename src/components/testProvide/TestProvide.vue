<template>
  <div class="container">
    <el-button @click="add">+1</el-button>
    <el-button @click="cut">-1</el-button>
    <SonTestInject></SonTestInject>
  </div>
</template>
<script>
import SonTestInject from "@/components/testProvide/SonTestInject.vue";

export default {
  name: "TestProvide",
  components: { SonTestInject },
  provide() {
    return {
      myNum: this.numObj,
    };
  },
  data() {
    return {
      numObj: {
        num: 12,
      },
    };
  },
  methods: {
    add() {
      this.numObj.num += 1;
      console.log(this.numObj.num);
    },
    cut() {
      this.numObj.num -= 1;
      console.log(this.numObj.num);
    },
  },
};
</script>
<style scoped lang="less"></style>
