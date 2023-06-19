<template>
  <div class="container">
    <dynamicTable
      :tableHeaders="tableHeaders"
      :tableData="tableData"
      @sortChange="handleSortChange"
      @selectHeader="selectHeader"
      @tableClick="tableClick"
      :selectHeader="myHeader"
      :loading="false"
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
          click: true,
          children: [],
        },
        {
          label: "年龄",
          prop: "age",
          sortable: "custom",
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
          age: 22,
          province: "北京",
          districts: "朝阳",
          streets: "北苑",
          zip: "10000",
        },
        {
          name: "小",
          age: 21,
          province: "北京",
          districts: "朝阳",
          streets: "北苑",
          zip: "10000",
        },
      ],
      myHeader: [],
    };
  },
  methods: {
    handleSortChange({ column, prop, order }) {
      console.log(column, prop, order);
    },
    handleCellClick(row, column, index) {
      console.log(row, column, index);
    },
    selectHeader(e) {
      this.myHeader = e;
      console.log(e);
    },
    tableClick(row, column) {
      console.log(row, column);
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
