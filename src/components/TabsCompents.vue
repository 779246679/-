<template>
  <div class="container">
    <div class="left-tabs">
      <el-tabs tab-position="left">
        <el-tab-pane
          v-for="item of tabsList"
          :key="item.name"
          :label="item.name"
        >
          <el-menu v-if="item.children.length" :openedMenus="openedMenus">
            <el-submenu
              v-for="e of item.children"
              :key="e.name"
              :index="e.name"
            >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ e.name }}</span>
              </template>
              <el-menu-item-group v-for="child of e.children" :key="child.name">
                <template slot="title">
                  {{ child.name }}
                </template>
                <el-menu-item :index="child.name">
                  {{ child.name }}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: "TabsComponents",
  data() {
    return {
      openedMenus: [],
      tabsList: [
        {
          name: "1",
          children: [
            {
              name: "1-1",
              children: [
                { name: "1 - 1 - 1" },
                { name: "1 - 1 - 2" },
                { name: "1 - 1 - 3" },
              ],
            },
            {
              name: "1-2",
              children: [{ name: "1 - 2 - 1" }, { name: "1 - 2 - 2" }],
            },
          ],
        },
        {
          name: "2",
          children: [{ name: "2-1", children: [{ name: "2 - 1 - 1" }] }],
        },
        {
          name: "3",
          children: [{ name: "3-1", children: [{ name: "3 - 1 - 1" }] }],
        },
        {
          name: "4",
          children: [{ name: "4-1", children: [{ name: " 4 - 1 - 1" }] }],
        },
        {
          name: "4",
          children: [],
        },
      ],
    };
  },
};
</script>
<style scoped lang="less">
/deep/.el-submenu__title:hover + .el-menu--inline {
  display: block !important;
}
</style>
