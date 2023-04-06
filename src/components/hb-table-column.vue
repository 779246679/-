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
};
</script>

<style scoped></style>
