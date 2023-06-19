<template>
  <div class="container">
    <div class="button-box">
      <el-popover placement="bottom" trigger="click" v-model="visiblePop">
        <div class="tree-box">
          <el-tree
            :data="tableHeaders"
            show-checkbox
            node-key="prop"
            ref="tree"
            :default-checked-keys="leafProps"
          ></el-tree>
          <div style="text-align: center">
            <el-button type="primary" @click="changeSelect">确定</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </div>
        </div>
        <el-button slot="reference" type="primary" size="mini"
          >展示指标管理</el-button
        >
      </el-popover>
    </div>
    <div class="table-box">
      <el-table
        @sort-change="sortChange"
        :data="tableData"
        :header-cell-style="{
          background: ' #ebf4ff',
          color: '#333333',
        }"
      >
        <template v-if="type">
          <hb-table-column
            v-for="item in selectHeaders"
            :column="item"
            :key="item.prop"
            @tableClick="tableClick(scope.row, column)"
            :loading="loading"
          >
          </hb-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import hbTableColumn from "@/components/hb-table-column.vue";
export default {
  name: "dynamicTable",
  components: {
    hbTableColumn,
  },
  props: {
    tableHeaders: {
      type: Array,
      default() {
        return [];
      },
    },
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    loading: {
      type: Boolean || String,
      default() {
        return false;
      },
    },
    myHeader: {
      type: Array,
      default() {
        return this.tableHeaders;
      },
    },
  },
  data() {
    return {
      selectHeaders: this.tableHeaders,
      type: true,
      visiblePop: false,
    };
  },
  methods: {
    getAllLeafProps(treeData) {
      const leafProps = [];

      function traverseTree(data) {
        data.forEach((node) => {
          if (node.children && node.children.length > 0) {
            // 当前节点有子节点，继续遍历
            traverseTree(node.children);
          } else {
            // 当前节点是子叶节点，将 prop 添加到结果数组中
            leafProps.push(node.prop);
          }
        });
      }

      // 从根节点开始遍历
      traverseTree(treeData);

      return leafProps;
    },
    changeSelect() {
      this.type = false;
      this.selectHeaders = this.handleGetCheckedNodes();
      this.$nextTick(() => {
        this.type = true;
      });
      this.visiblePop = false;
      this.$emit("selectHeader", this.selectHeaders);
    },
    reset() {
      this.selectHeaders = this.tableHeaders;
      this.$emit("selectHeader", this.selectHeaders);
      this.visiblePop = false;
    },
    getCheckedTreeNodes(treeData, checkedKeys) {
      // 过滤器函数，递归地获取选中的节点
      const filterCheckedNodes = (nodes) => {
        let result = [];
        nodes.forEach((node) => {
          if (checkedKeys.includes(node.prop)) {
            // 当前节点被选中
            result.push({ ...node, children: [] });
          }

          if (node.children && node.children.length) {
            const children = filterCheckedNodes(node.children);
            if (children.length > 0) {
              // 子节点中有被选中的节点
              const parentNode = result.find((item) => item.prop === node.prop);
              if (parentNode) {
                // 如果父节点已存在于结果中，添加子节点
                parentNode.children = children;
              } else {
                // 如果父节点尚未存在于结果中，将其添加到结果中并设置子节点
                result.push({ ...node, children });
              }
            }
          }
        });
        return result;
      };
      return filterCheckedNodes(treeData);
    },
    handleGetCheckedNodes() {
      const treeComponent = this.$refs.tree;
      const checkedKeys = treeComponent.getCheckedKeys();
      const treeData = [...this.tableHeaders];
      const checkedTreeNodes = this.getCheckedTreeNodes(treeData, checkedKeys);
      return checkedTreeNodes;
    },
    sortChange(e) {
      this.$emit("sortChange", e);
    },
    tableClick(row, column) {
      this.$emit("tableClick", row, column);
    },
  },
  computed: {
    leafProps() {
      return this.getAllLeafProps(this.selectHeaders);
    },
  },
};
</script>

<style scoped lang="less">
.container {
  .button-box {
    text-align: right;
  }
  .table-box {
    margin-top: 20px;
  }
  .el-table {
    border-radius: 5px;
    overflow: hidden;
  }
  .el-table__header-wrapper {
    border-radius: 5px;
    overflow: hidden;
  }
  .el-table__body-wrapper {
    border-radius: 5px;
    overflow: hidden;
  }
  .el-table__row {
    border-radius: 5px;
    overflow: hidden;
  }
}
</style>
