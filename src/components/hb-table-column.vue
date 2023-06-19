<template>
  <el-table-column
    :align="column.align || 'center'"
    :label="column.label"
    :prop="column.prop"
    :width="column.width"
    :min-width="column.minWidth"
    :fixed="column.fixed"
    :sortable="column.sortable"
    :height="column.height"
    :max-height="column.maxHeight"
    :resizable="column.resizable"
    :show-overflow-tooltip="column.showOverflowTooltip"
  >
    <template v-if="column.children && column.children.length">
      <hb-table-column
        v-for="el in column.children"
        :key="el.prop"
        :column="el"
      ></hb-table-column>
    </template>
    <template v-else-if="column.click" v-slot:default="scope">
      <span
        style="color: #409eff; cursor: pointer"
        @click="tableClick(scope.row, column)"
        >{{ scope.row[column.prop] }}</span
      >
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "hb-table-column",
  props: {
    column: {
      default() {
        return {};
      },
    },
  },
  methods: {
    tableClick(row, column) {
      this.$emit("tableClick", row, column);
    },
  },
};
</script>
