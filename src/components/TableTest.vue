<template>
  <el-table
    :data="tableData"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    :span-method="spanMethod"
    @expand-change="expandChange"
    row-key="address"
    border
  >
    <el-table-column label="序号" type="index"></el-table-column>
    <el-table-column label="公司" prop="company" type=""></el-table-column>
    <el-table-column label="身份" prop="name"></el-table-column>
    <el-table-column label="名字" prop="address"></el-table-column>
  </el-table>
</template>
<script>
export default {
  data() {
    return {
      spanData: [1, 1, 3, 0, 0, 1],
      tableData: [
        {
          company: "河北",
          name: "客户",
          address: "张三",
          span: 2,
          index: 1,
          children: [
            {
              company: "河北",
              name: "家属",
              address: "王五",
              span: 0,
            },
            {
              company: "河北",
              name: "家属",
              address: "马六",
              span: 0,
            },
          ],
        },
        {
          company: "河北",
          name: "客户",
          address: "asd",
          index: 1,
          span: 0,
          children: [
            {
              company: "河北",
              name: "家属",
              address: "abc",
              span: 0,
            },
            {
              company: "河北",
              name: "家属",
              address: "ddd",
              span: 0,
            },
          ],
        },

        {
          company: "北京",
          name: "客户",
          index: 2,
          address: "哼哼",
          span: 1,
        },
      ],
    };
  },
  methods: {
    spanMethod({ row, column }) {
      if (column.property === "company") {
        return [row.span, 1];
      }
    },
    expandChange(row, expand) {
      let index;
      if (row.index === 1) {
        index = 0;
      } else {
        index = 1;
      }
      if (expand) {
        this.tableData[index].span =
          this.tableData[index].span + row.children.length;
      } else {
        this.tableData[index].span =
          this.tableData[index].span - row.children.length;
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
