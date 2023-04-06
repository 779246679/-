<template>
  <div class="container">
    <dynamicTable
      @sortChange="sortChange"
      :tableHeaders="tableHeaders"
      :tableData="tableData"
    ></dynamicTable>
  </div>
</template>

<script>
import dynamicTable from "@/components/dynamicTable.vue";
export default {
  name: "HomePage",
  components: {
    dynamicTable,
  },
  data() {
    return {
      tableHeaders: [
        {
          label: "姓名",
          prop: "name",
          width: "180",
          children: [],
        },
        {
          label: "年龄",
          prop: "age",
          children: [],
        },
        {
          label: "地址",
          prop: "address",
          children: [
            {
              label: "省份",
              prop: "province",
              children: [],
            },
            {
              label: "城市",
              prop: "city",
              children: [
                {
                  label: "区",
                  prop: "districts",
                  children: [],
                },
                {
                  label: "街道",
                  prop: "streets",
                  children: [],
                },
              ],
            },
            {
              label: "邮编",
              prop: "zip",
              children: [],
            },
          ],
        },
      ],
      tableData: [
        {
          name: "小明",
          age: 20,
          province: "北京",
          districts: "朝阳",
          streets: "北苑",
          zip: "10000",
        },
        {
          name: "小红",
          age: 20,
          province: "北京",
          districts: "朝阳",
          streets: "北苑",
          zip: "10000",
        },
        {
          name: "小",
          age: 20,
          province: "北京",
          districts: "朝阳",
          streets: "北苑",
          zip: "10000",
        },
      ],
    };
  },
  methods: {
    sortChange(e) {
      console.log(e);
    },
  },
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
}
</style>
