<template>
  <div class="catalogAdmin">
    <el-dialog
      title="权限设置"
      :close-on-click-modal="false"
      :visible.sync="purViewDialog"
      destroy-on-close
      @close="closePurViewDialog()"
      width="80%"
    >
      <div>
        <div class="headerTitle">
          <div id="userIdOrOA">
            <el-select
              style="width: 500px; margin-right: 20px"
              name=""
              v-if="queryName"
              value-key="loginId"
              v-model="inputUserName"
              filterable
              remote
              reserve-keyword
              multiple
              :remote-method="searchUser"
              placeholder="请输入OA账号或用户名称"
              :loading="loading"
              loading-text="正在加载..."
              @visible-change="selectOptionVisibleChange"
              @change="selectOptionDatalist($event)"
            >
              <el-option
                v-for="(itemSelect, index) in searchPurViewDataList"
                :key="index"
                :value="itemSelect"
                :label="itemSelect.name + '--' + itemSelect.tkDepartMentName"
              ></el-option>
            </el-select>
          </div>
          <div v-if="roleQueryInput" style="margin-right: 20px" id="roleQuery">
            <!-- 按照系统查询,暂时写死 -->

            <!-- 按照机构查询 -->
            <!-- <span style="margin-right:5px">&nbsp;机构:</span>
                        <el-select
                                v-model="roleNamePcOrgan"
                                multiple
                                placeholder="请选择"
                                @change="empListsFind()"
                        >
                            <el-option value="all" label="全部"></el-option>
                            <el-option v-for="(item,index) in pcOrganList" :key="index" :value="item.comCode" :label="item.shortName"></el-option>
                        </el-select> -->

            <!-- 按照系统查询角色 -->
            <div style="display: flex">
              <div style="margin-right: 10px">
                <span style="color: red; margin-right: 5px">*</span>
                <span style="margin-right: 5px">系统:</span>
                <el-select
                  type="text"
                  size="small"
                  v-model="inputUserName"
                  clearable
                  @change="systemSelect($event)"
                  placeholder="e企战"
                >
                  <el-option
                    v-for="item in systemTypes"
                    :key="item"
                    :label="getDicData(item)"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="margin-right: 10px" v-if="!researchCenterVis">
                <span style="margin-right: 5px">用户角色:</span>
                <el-select
                  ref="roleSelect"
                  type="text"
                  size="small"
                  v-model.trim="searchCondition.roleId"
                  clearable
                  placeholder="请选择用户角色"
                >
                  <el-option
                    v-for="(item, index) in roleList"
                    :key="index"
                    :label="item.roleName"
                    :value="item.roleId"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="margin-right: 10px" v-if="!researchCenterVis">
                <span>所属分公司:</span>
                <el-select
                  clearable
                  size="medium"
                  v-model="searchCondition.comCode"
                  placeholder="请选择所属"
                >
                  <el-option
                    v-for="(item, index) in pcOrganList"
                    :key="index"
                    :value="item.comCode"
                    :label="item.shortName"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="margin-right: 10px" v-if="!researchCenterVis">
                <span>业务方向:</span>
                <el-select
                  size="medium"
                  v-model="searchCondition.busiType"
                  placeholder="请选择业务类型"
                >
                  <el-option
                    v-for="optionItem in Options.projectBusiType"
                    :key="optionItem.value"
                    :value="optionItem.value"
                    :label="optionItem.label"
                  >
                  </el-option>
                </el-select>
              </div>
              <div v-if="researchCenterVis" style="margin-right: 10px">
                <span>标签类型:</span>
                <el-select
                  size="medium"
                  v-model="userLableSystemChose"
                  placeholder="请选择标签类型"
                >
                  <el-option
                    v-for="item in userLableSystemList"
                    :key="item.labelCode"
                    :value="item.labelCode"
                    :label="item.labelName"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>

            <!-- <span style="margin-right:5px">&nbsp;角色:</span>
                        <el-select
                                v-model="roleName"
                                multiple
                                placeholder="请选择"
                                @change="empListsFind()"
                        >
                            <el-option value="all" label="全部"></el-option>
                            <el-option v-for="(item,index) in sysLists" :key="index" :value="item.id" :label="item.name"></el-option>
                        </el-select> -->

            <!-- <span style="margin-right:5px">&nbsp;用户类型:</span>
                        <el-select
                                v-model="userTypeId"
                                placeholder="请选择"
                                @change="empListsFind()"
                        >
                            <el-option value="all" label="全部"></el-option>
                            <el-option v-for="(item,index) in userTypes" :key="index" :value="item.id" :label="item.name"></el-option>
                        </el-select> -->
          </div>
          <div
            v-if="department"
            style="margin-right: 20px; display: flex"
            id="roleQuery"
          >
            <div v-if="systemList.length > 1" style="margin-right: 10px">
              <span style="color: red; margin-right: 5px">*</span>
              <span style="margin-right: 5px">系统:</span>
              <el-select v-model="systemType">
                <el-option
                  v-for="item in systemList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div style="margin-right: 10px">
              <span style="margin-right: 5px">机构:</span>
              <el-select
                class="com"
                v-model="comCode"
                placeholder=""
                :disabled="comCodeFlag"
                @change="getFirstDept"
              >
                <el-option
                  v-for="item in pcOrganList"
                  :key="item.comCode"
                  :label="item.shortName"
                  :value="item.comCode"
                >
                </el-option>
              </el-select>
            </div>
            <div style="margin-right: 10px">
              <span style="margin-right: 5px">一级部门:</span>
              <el-select
                v-model="firstDept"
                :disabled="!firstDeptList.length"
                @change="deptChange"
                clearable
                filterable
              >
                <el-option
                  v-for="(item, index) in firstDeptList"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
            <div style="margin-right: 10px">
              <span style="margin-right: 5px">二级部门:</span>
              <el-select
                v-model="secondDept"
                :disabled="!secondDeptList.length"
                clearable
              >
                <el-option
                  v-for="(item, index) in secondDeptList"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <el-button
            v-if="!department"
            type="primary"
            size="small"
            @click="on_promission_commit()"
            >查询</el-button
          >
          <el-button
            v-if="department"
            type="primary"
            size="small"
            @click="searchByDepartment()"
            >查询</el-button
          >
          <el-button v-if="!roleQuery" size="small" @click="getRoleList('角色')"
            >按角色查找</el-button
          >
          <el-button v-if="!queryName" size="small" @click="getRoleList('用户')"
            >按用户查找</el-button
          >
          <el-button
            v-if="!department"
            size="small"
            @click="getRoleList('部门')"
            >按部门查找</el-button
          >
          <el-button
            v-if="!oneKeyView"
            size="small"
            class="oneKeyButton"
            @click="oneKey()"
            >一键配置</el-button
          >
          <!--          <el-button v-if="!oneKeyView&&department" class="oneKeyButton" @click="oneKey2()">一键配置2</el-button>-->
        </div>
        <div v-if="!oneKeyView" class="tabContent">
          <div class="" v-show="TabNum == 0" style="overflow: hidden">
            <el-table
              class="queryTable"
              :data="purViewDataList"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              @selection-change="selectChangePurView($event)"
              v-loading="permission_table_loading"
            >
              <!-- 复选框 -->
              <!-- <el-table-column  width="55" type="selection">
                            </el-table-column> -->
              <el-table-column width="50" type="index" label="序号">
              </el-table-column>
              <el-table-column width="100" label="名称">
                <template slot-scope="scope">
                  <div class="filesname userName">
                    <span v-if="scope.row" style="color: #1e7ee8">
                      {{ scope.row.userName }}
                    </span>
                    <span v-else>--</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="300" label="部门">
                <template slot-scope="scope">
                  <span v-if="scope.row">
                    {{ scope.row.deptName }}
                  </span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column width="80" label="浏览权限">
                <template slot-scope="scope">
                  <div v-if="scope.row">
                    <el-checkbox
                      :title="
                        scope.row.tipsMapArr.includes('02')
                          ? scope.row.tipsMapArrNameObj['02'] +
                            '等目录已设置权限'
                          : ''
                      "
                      :disabled="scope.row.tipsMapArr.includes('02')"
                      @change="checkboxOperateType(scope.row, '02', $event)"
                      id=""
                      :value="scope.row.operateTypeListNew.includes('02')"
                    >
                    </el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="80" label="下载权限">
                <template slot-scope="scope">
                  <div v-if="scope.row">
                    <el-checkbox
                      :title="
                        scope.row.tipsMapArr.includes('03')
                          ? scope.row.tipsMapArrNameObj['03'] +
                            '等目录已设置权限'
                          : ''
                      "
                      :disabled="scope.row.tipsMapArr.includes('03')"
                      @change="checkboxOperateType(scope.row, '03', $event)"
                      id=""
                      :value="scope.row.operateTypeListNew.includes('03')"
                    >
                    </el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="80" label="上传权限">
                <template slot-scope="scope">
                  <div v-if="scope.row">
                    <el-checkbox
                      :title="
                        scope.row.tipsMapArr.includes('05')
                          ? scope.row.tipsMapArrNameObj['05'] +
                            '等目录已设置权限'
                          : ''
                      "
                      :disabled="scope.row.tipsMapArr.includes('05')"
                      @change="checkboxOperateType(scope.row, '05', $event)"
                      id=""
                      :value="scope.row.operateTypeListNew.includes('05')"
                    >
                    </el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="80" label="编辑权限">
                <template slot-scope="scope">
                  <div v-if="scope.row">
                    <el-checkbox
                      :title="
                        scope.row.tipsMapArr.includes('06')
                          ? scope.row.tipsMapArrNameObj['06'] +
                            '等目录已设置权限'
                          : ''
                      "
                      :disabled="scope.row.tipsMapArr.includes('06')"
                      @change="checkboxOperateType(scope.row, '06', $event)"
                      id=""
                      :value="scope.row.operateTypeListNew.includes('06')"
                    >
                    </el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="80" label="删除权限">
                <template slot-scope="scope">
                  <div v-if="scope.row">
                    <el-checkbox
                      :title="
                        scope.row.tipsMapArr.includes('07')
                          ? scope.row.tipsMapArrNameObj['07'] +
                            '等目录已设置权限'
                          : ''
                      "
                      :disabled="scope.row.tipsMapArr.includes('07')"
                      @change="checkboxOperateType(scope.row, '07', $event)"
                      id=""
                      :value="scope.row.operateTypeListNew.includes('07')"
                    >
                    </el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="80" label="管理权限">
                <template slot-scope="scope">
                  <span v-if="scope.row">
                    <el-checkbox
                      :title="
                        scope.row.tipsMapArr.includes('01')
                          ? scope.row.tipsMapArrNameObj['01'] +
                            '等目录已设置权限'
                          : ''
                      "
                      :disabled="scope.row.tipsMapArr.includes('01')"
                      @change="checkboxOperateType(scope.row, '01', $event)"
                      id=""
                      :value="scope.row.operateTypeListNew.includes('01')"
                    ></el-checkbox>
                  </span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <!-- <el-table-column  width="80" label="级联权限">
                                <template  slot-scope="scope">
                                    <div v-if="scope.row">
                                        <el-checkbox :title="'级联权限是默认，无法更改'" disabled @change="checkboxOperateType(scope.row,'04',$event)" id="" checked ></el-checkbox>
                                    </div>
                                </template>
                            </el-table-column> -->
              <el-table-column label="备注">
                <template>
                  <!-- <div v-if="scope.row.childrenCatalogNames">
                                        <i style="color:red">子目录{{scope.row.childrenCatalogNames}}已单独设置权限</i>
                                    </div>
                                    <div v-else-if="scope.row.parentCatalogNames">
                                        <i style="color:red">父目录{{scope.row.parentCatalogNames}}已设置级联</i>
                                    </div>
                                    <div v-else></div> -->
                </template>
              </el-table-column>
            </el-table>
            <div class="allSelect" v-if="this.purViewDataList.length > 0">
              <el-checkbox
                label=""
                v-model="allCheckBoxBtn.checkboxFlag1"
                @change="
                  allSelectClick('02', allCheckBoxBtn.checkboxFlag1, $event)
                "
              ></el-checkbox
              ><!--浏览-->
              <el-checkbox
                label=""
                v-model="allCheckBoxBtn.checkboxFlag2"
                @change="
                  allSelectClick('03', allCheckBoxBtn.checkboxFlag2, $event)
                "
              ></el-checkbox
              ><!--下载-->
              <el-checkbox
                label=""
                v-model="allCheckBoxBtn.checkboxFlag3"
                @change="
                  allSelectClick('05', allCheckBoxBtn.checkboxFlag3, $event)
                "
              ></el-checkbox
              ><!--上传-->
              <el-checkbox
                label=""
                v-model="allCheckBoxBtn.checkboxFlag4"
                @change="
                  allSelectClick('06', allCheckBoxBtn.checkboxFlag4, $event)
                "
              ></el-checkbox
              ><!--编辑-->
              <el-checkbox
                label=""
                v-model="allCheckBoxBtn.checkboxFlag5"
                @change="
                  allSelectClick('07', allCheckBoxBtn.checkboxFlag5, $event)
                "
              ></el-checkbox
              ><!--删除-->
              <el-checkbox
                label=""
                v-model="allCheckBoxBtn.checkboxFlag6"
                @change="
                  allSelectClick('01', allCheckBoxBtn.checkboxFlag6, $event)
                "
              ></el-checkbox
              ><!--管理-->
              <el-checkbox
                label="全选"
                v-model="checkBoxBtnAll"
                @change="allSelectClickAll($event)"
              ></el-checkbox
              ><!--管理-->
            </div>

            <div class="pagination-wrap">
              <el-pagination
                v-if="pagePurview.total > 10"
                @current-change="getCurrentPageData"
                :current-page.sync="pagePurview.currentPage"
                :page-size="pagePurview.size"
                :page-count="5"
                layout="prev,pager,next, total"
                :total="pagePurview.total"
              >
              </el-pagination>
              <el-select
                v-if="pagePurview.total > 10"
                v-model="page_val"
                @change="on_page_change"
                style="width: 150px"
                size="mini"
              >
                <el-option
                  v-for="item in page_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div v-if="oneKeyView" class="tabContent">
          <div class="" v-show="TabNum == 0" style="overflow: hidden">
            <el-table
              class="queryTable"
              :data="oneKeyDataList.lable"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              v-loading="permission_table_loading"
            >
              <el-table-column
                width="100"
                label="序号"
                type="index"
              ></el-table-column>
              <el-table-column
                width="250"
                label="权限"
                prop="lableName"
              ></el-table-column>

              <el-table-column width="80" label="浏览权限">
                <template slot-scope="scope">
                  <div v-if="scope.row">
                    <el-checkbox @change="oneKeyChangeChose($event, '02')">
                    </el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="80" label="下载权限">
                <template slot-scope="scope">
                  <div v-if="scope.row">
                    <el-checkbox @change="oneKeyChangeChose($event, '03')">
                    </el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="80" label="上传权限">
                <template slot-scope="scope">
                  <div v-if="scope.row">
                    <el-checkbox @change="oneKeyChangeChose($event, '05')">
                    </el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="80" label="编辑权限">
                <template slot-scope="scope">
                  <div v-if="scope.row">
                    <el-checkbox @change="oneKeyChangeChose($event, '06')">
                    </el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="80" label="删除权限">
                <template slot-scope="scope">
                  <div v-if="scope.row">
                    <el-checkbox @change="oneKeyChangeChose($event, '07')">
                    </el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="80" label="管理权限">
                <template slot-scope="scope">
                  <span v-if="scope.row">
                    <el-checkbox
                      @change="oneKeyChangeChose($event, '01')"
                    ></el-checkbox>
                  </span>
                  <span v-else>--</span>
                </template>
              </el-table-column>

              <el-table-column label="备注" prop="remark"> </el-table-column>
            </el-table>

            <div style="margin-top: 15px">
              对当前筛选的
              <span style="font-size: 20px; font-weight: 900">{{
                pagePurview.total
              }}</span>
              个用户进行权限配置
            </div>
          </div>
        </div>
      </div>
      <div class="dialogFooter">
        <el-button
          v-if="!oneKeyView && !queryName"
          type="primary"
          @click="purViewSureDialog('sure')"
          >确认</el-button
        >
        <el-button v-if="oneKeyView && !queryName" @click="closePurViewDialog()"
          >取消</el-button
        >
        <el-button
          v-if="oneKeyView && !queryName"
          type="primary"
          @click="oneKeyOpen()"
          >确认</el-button
        >
        <el-button
          v-if="queryName && systemUserFlag && !showConfirm"
          type="primary"
          @click="userLableSet()"
          >下一步</el-button
        >
        <el-button
          v-if="queryName && systemUserFlag && showConfirm"
          type="primary"
          @click="userFindSetPermissionEqz()"
          >确定</el-button
        >
        <el-button
          v-if="queryName && !systemUserFlag"
          type="primary"
          @click="purViewSureDialog('sure')"
          >确认</el-button
        >
        <!-- <el-button v-if="queryName" type="primary"  @click="purViewSureDialog('sure')">确认</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  permissionsCheck,
  setPermission,
  getFirstDeptList,
  getSecondDeptList,
  getUserList,
} from "api/train";
import {
  catalogManagement,
  deleteFiles,
  getKnowledgeManagementlistinfo,
  addFolder,
  deleteFolder,
  getUserInfo,
  empList,
  queryFolder,
  updateknowledge,
  uploadKnowledgeNew,
  getCataloglistinfo,
  deleteFile,
  getKnowledgelistinfoEs,
} from "api/knowledge";
import { RES_OK } from "js/constant";
import {
  trainSeriesManageUserFindSetPermissionEqz,
  getRoleLists,
  findKbPcOrgan,
  getRoleInfoList,
  getUserInfo as getUserInfoMy,
  trainQuickSetPermission,
  knowledgeGetTypeList,
  userFindSetPermissionT,
} from "api/common";
import trainCourseDetailsManage from "./trainCourseDetailsManage.vue";
let Base64 = require("js-base64").Base64;
import Options from "js/map/Options";
import { RESULT_OK } from "js/constant";
import { savePCUserAction } from "api/mapApi";
import { getUserInfoList } from "api/mobileApi";
class Paging {
  constructor() {
    this.size = 10;
    this.currentPage = 1;
    this.total = 0;
  }
}

export default {
  data() {
    return {
      //目表目录id
      moveToCatalog: "",
      currentMoveCatalog: "",
      // 权限管理全选框状态
      checkAll: false,
      parentTreeId: 2,
      viewTree: [],
      userId: "",
      treeData: [],
      treeNode: {},
      selectedTreeData: {},
      isLight: true,
      isDiaLogLight: true,
      treeId: 0,
      sysList: [
        { name: "e企战", id: 1 },
        { name: "科技中心", id: 2 },
      ],
      page: new Paging(),
      pagePurview: new Paging(),
      // 获取的资料文件数组
      resultData: [],
      textContent: "按角色查询",
      // 按名称查找
      queryName: true,
      // 按角色查找
      roleQuery: false,
      // 按部门查找
      department: false,
      roleQueryInput: false,

      deleteDialog: false,
      shareDialog: false,
      moveDialog: false,
      isAllMoveFlag: false,
      creatNewFolderDialog: false,
      renameFolderDialog: false,
      deleteFileFolderDialog: false,
      addTagsDialog: false,
      // 权限设置弹框
      purViewDialog: false,
      fileEditDialog: false,
      uploadFileDialog: false,
      // 输入框V-model变量
      newFolderName: "",
      renameFolderName: "",
      addTagsName: "",
      roleName: [],
      roleNamePcOrgan: [],
      userTypeId: "",
      systemType: "",
      comCode: "",
      systemList: [
        { name: "E企战", id: "001" },
        { name: "科技中心", id: "003" },
      ],
      comCodeFlag: false,

      // 权限分配Tab切换
      tabTitle: [
        {
          titlename: "人员设置",
        },
        {
          titlename: "机构设置",
        },
      ],
      // 权限分配Tab切换默认索引
      TabNum: 0,
      // 复选框列表
      checkBoxList: [],

      //选中的文件id和目录id
      checkedCatalogIdAndFileIdList: [],
      // 权限设置table数据
      purViewDataList: [],
      // 选择框option的值
      searchPurViewDataList: [],
      sysLists: [],
      pcOrganList: [],
      userTypes: [
        {
          id: 10,
          name: "内勤",
        },
        {
          id: 11,
          name: "外勤",
        },
      ],
      // 权限上传列表
      PurViewUpdataList: [],
      searchText: "",
      labelId: "",
      catalogName: "全部",
      // 搜索框输入内容&&选择以后的值
      inputUserName: [],
      // 权限设置选择框
      selectValue: [],
      // 选择出来的列表
      selectOptionDatalists: [],
      // 请求数据
      requestUserList: [],
      downUploadData: {},
      // 搜索加载中
      loading: false,
      // 目录所选择ID
      catalogId: 0,
      // 目录所选择ID的permissions情况
      permissions: null,
      form: {},
      isManager: false,
      // 可设置权限列表
      PurViewSetList: [],
      // 新增文件夹确认按钮文本
      creatNewFolderFlag: "确认",
      isSearch: false,
      permission: [],
      allCheckBoxBtn: {
        checkboxFlag1: false,
        checkboxFlag2: false,
        checkboxFlag3: false,
        checkboxFlag4: false,
        checkboxFlag5: false,
        checkboxFlag6: false,
      },
      checkBoxBtnAll: false,
      default_sort: {
        prop: "fcd",
        order: "descending",
      },
      sort_label: "time",
      sort_order: "Desc",

      page_options: [
        {
          label: "10条/页",
          value: 10,
        },
        {
          label: "50条/页",
          value: 50,
        },
        {
          label: "100条/页",
          value: 100,
        },
        {
          label: "200条/页",
          value: 200,
        },
      ],
      page_val: 10,
      permission_table_loading: false,
      edit_percentage: 0,
      edit_fail: false,

      upload_percentage: 0,
      upload_fail: false,

      searchCondition: {
        loginId: "",
        roleId: "", // 用户角色
        depLevel: "", // 机构级别
        comCode: "", // 选择机构
        staffPostCode: "", //用户职称代码
        busiType: "", //业务方向
        userStatus: "在职", // 在职状态
      },
      Options,
      paging: new Paging(),
      roleList: [],

      oneKeyView: false,
      oneKeyDataList: {
        lable: [
          {
            lableName: "全部授权",
            remark: "勾选后，既表示给所选用户授权该权限",
          },
          // {lableName:'取消授权',remark:'勾选后，取消所有用户的权限'}
        ],
        chose: [],
      },
      oneKeyEndTime: "",
      userAuthVisibleMobile: false,
      userLableList: [],
      systemTypes: "",
      //系统列表字典
      systemListDic: [
        { value: "001", key: "e企战" },
        { value: "002", key: "知识库" },
        { value: "003", key: "科技中心" },
      ],
      //科技中心开关
      researchCenterVis: false,
      //标签列表
      userLableSystemList: [],
      //用户选择的标签-搜索条件
      userLableSystemChose: "",
      //设置标签时选择的系统
      userSetLableSystem: "",
      //用户选择的标签-添加条件
      userLableChose: "",
      //用户是否已经添加进入系统
      systemUserFlag: false,
      trainSeriesId: "",
      currentUserComCode: "",
      selectUser: [],
      firstDeptList: [],
      firstDept: "",
      secondDeptList: [],
      secondDept: "",
    };
  },
  name: "trainPermissionDialog",
  components: {},
  created() {
    if (this.$store.getters.userLoginId) {
      window.sessionStorage.setItem("store", this.$store.getters.userLoginId);
    }
    this.userId = window.sessionStorage.getItem("store");
    this.getUser();
    this.checkSystemType();
  },
  watch: {
    roleNamePcOrgan: function (val, oldval) {
      let newIndex = val.indexOf("all"),
        oldIndex = oldval.indexOf("all");
      if (newIndex !== -1 && (oldIndex == -1) & (val.length > 1)) {
        this.roleNamePcOrgan = ["all"];
      } else if (newIndex !== -1 && oldIndex !== -1 && val.length > 1) {
        this.roleNamePcOrgan.splice(val.indexOf("all"), 1);
      }
    },
    roleName: function (val, oldval) {
      let newIndex = val.indexOf("all"),
        oldIndex = oldval.indexOf("all");
      if (newIndex !== -1 && (oldIndex == -1) & (val.length > 1)) {
        this.roleName = ["all"];
      } else if (newIndex !== -1 && oldIndex !== -1 && val.length > 1) {
        this.roleName.splice(val.indexOf("all"), 1);
      }
    },
  },
  mounted() {
    // 获取目录列表
    // this.getCataloglistinfo();
    this.get_role_list();
    this.getCataloglistinfo();
  },
  methods: {
    get_role_list() {
      this.Loading.open();
      getRoleInfoList({
        pageSize: 100,
        pageNum: this.paging.currentPage,
        name: "",
        comCode: "",
        busiTypeList: [],
      }).then((res) => {
        this.Loading.close();
        if (res.code !== RESULT_OK) {
          this.$message.error(res.message);
          return;
        }

        this.roleList = res.data.list;
      });
    },
    getFirstDept() {
      this.firstDeptList = [];
      getFirstDeptList({
        comCode: this.comCode,
        sysType: this.systemType,
      }).then((res) => {
        res.data.forEach((item) => {
          if (item) this.firstDeptList.push(item);
        });
        // this.firstDept = this.firstDeptList[0]
      });
    },
    deptChange() {
      this.secondDeptList = [];
      this.secondDept = "";
      const params = {
        comCode: this.comCode,
        firstDeptName: this.firstDept,
        sysType: this.systemType,
      };
      getSecondDeptList(params).then((res) => {
        res.data.forEach((item) => {
          if (item) this.secondDeptList.push(item);
        });
      });
    },
    searchByDepartment() {
      this.getUserListBydepartment();
      console.log("搜索部门");
    },
    getUserListBydepartment() {
      this.permission_table_loading = true;
      const params = {
        sysType: this.systemType,
        comCode: this.comCode,
        firstDeptName: this.firstDept,
        secondDeptName: this.secondDept,
        pi: this.pagePurview.currentPage,
        ps: this.pagePurview.size,
      };
      getUserList(params).then((res) => {
        this.permission_table_loading = false;
        if (res.code == 200) {
          this.pagePurview.total = res.pager.total;
          const user_list = res.data.map((user) => {
            return {
              pi: this.pagePurview.currentPage,
              ps: this.pagePurview.size,
              trainSeriesId: this.trainSeriesId,
              userId: user.userCode,
              userName: user.userName,
              deptName: user.deptName,
              dept: user.deptCode,
            };
          });
          if (!user_list.length) {
            this.purViewDataList = [];
            return;
          }
          this.get_permission(user_list, true);
          this.selectRoleName = null;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    get_user_list(type) {
      this.permission_table_loading = true;
      getUserInfoList({
        pageSize: this.pagePurview.size,
        pageNum: this.pagePurview.currentPage,
        name: this.searchCondition.loginId,
        roleId: this.inputUserName == "003" ? "" : this.searchCondition.roleId,
        busiType:
          this.inputUserName == "003" ? "" : this.searchCondition.busiType,
        comCode: this.searchCondition.comCode,
        oaPosition: this.searchCondition.staffPostCode,
        userStatus: this.searchCondition.userStatus,
        systemType: this.inputUserName == "003" ? "003" : "001",
        userLabelCode: this.researchCenterVis ? this.userLableSystemChose : "",
      }).then((res) => {
        this.permission_table_loading = false;
        if (res.code !== RESULT_OK) {
          this.pagePurview.total = 0;
          this.$message.error(res.message);
          return;
        }
        if (res.data) {
          this.pagePurview.total = res.data.total;
          const user_list = res.data.list.map((user) => {
            return {
              pi: this.pagePurview.currentPage,
              ps: this.pagePurview.size,
              trainSeriesId: this.catalogId,
              userId: user.userCode,
              userName: user.userName,
              deptName: user.deptName,
              dept: user.deptCode,
            };
          });
          if (!user_list.length) return;

          if (typeof type == "undefined") {
            this.get_permission(user_list, true);
            this.selectRoleName = null;
          } else {
            // 每次查询数据都会检测一下 是否搜索了 用户角色。如果搜索了就赋值，如果没搜索就null
            if (this.$refs.roleSelect == null) {
              this.selectRoleName = "";
            } else {
              this.selectRoleName =
                this.$refs.roleSelect.selectedLabel == ""
                  ? null
                  : this.$refs.roleSelect.selectedLabel;
            }
          }
        } else this.pagePurview.total = 0;
      });
    },

    on_page_change(val) {
      this.page_val = val;
      if (val != -1) this.pagePurview.size = val;
      else this.pagePurview.size = this.pagePurview.total;
      this.pagePurview.currentPage = 1;
      if (this.queryName) {
        this.perviewHandle();
      } else {
        this.get_user_list();
      }
    },
    on_sort_change({ column, prop, order }) {
      console.log(column, prop, order);
      this.page.currentPage = 1;
      if (prop == "viewNums") this.sort_label = "viewNums";
      if (prop == "downloadNums") this.sort_label = "downloadNums";
      if (prop == "fcd") this.sort_label = "time";
      if (order == "ascending") this.sort_order = "Asc";
      if (order == "descending") this.sort_order = "Desc";
      this.getKnowledgelistinfo();
    },

    // 关闭弹层
    // close() {
    //     this.fileEditDialog = false
    // },
    // 文件列表
    getKnowledgelistinfo(e) {
      // 清空上次选择的文件夹
      this.checkBoxList = [];
      this.checkedCatalogIdAndFileIdList = [];
      if (this.isSearch) {
        this.getKnowledgelistinfoEsRequest();
      } else {
        if (e) {
          this.page.currentPage = e;
        }
        getKnowledgeManagementlistinfo({
          knowledgeInfo: {
            pi: this.page.currentPage,
            ps: this.page.size,
            // catalogId: this.catalogId,
            trainSeriesId: this.trainSeriesId,
            title: this.searchText.trim(),
            userId: this.userId,
            sortType: this.sort_label + this.sort_order,
          },
          fileLabelRela: {
            labelId: this.labelId,
          },
        })
          .then((res) => {
            if (res.code !== 200) {
              this.$alert("数据请求异常", "提示", {
                type: "error",
              });
              return;
            }
            if (res.data) {
              console.log(res.data, "初始的res");
              this.resultData = res.data;
              this.page.total = res.pager.total;
            }
          })
          .catch(() => {
            this.Loading.close();
            this.$message.error("查询目录列表失败");
          });
      }
    },
    // 获取目录树目录菜单
    getCataloglistinfo() {
      console.log("-----!!!!!!!!!!!!!", this.userId);
      catalogManagement({ userId: this.userId })
        .then((res) => {
          console.log(res.code, RES_OK);
          if (res.code !== 200) {
            this.$alert(res.message, "提示", {
              type: "error",
            });
            return;
          }
          if (res.data) {
            if (res.data.isManager && res.data.isManager === "N") {
              console.log("res.data.isManager===N", res);
              this.isManager = false;
            } else {
              this.isManager = true;
              this.getKnowledgelistinfo();
            }
            if (res.data.catalogMaps) {
              this.viewTree = res.data.catalogMaps.treeList;
              console.log("this.viewTree", this.viewTree);
              this.treeData = res.data.catalogMaps.treeList;
            }
          }
        })
        .catch(() => {
          this.Loading.close();
          this.$message.error("查询目录列表失败");
        });
    },


    checkSystemType() {
      const systemTypes = JSON.parse(
        window.sessionStorage.getItem("userInfo")
      ).systemTypes;
      this.systemList = this.systemList.filter((item) => {
        return systemTypes.includes(item.id);
      });
      this.systemType = this.systemList[0].id;
    },
    // 得到目录树的节点


    // 权限设置按钮全部复选框按钮暂时取消    此方法暂时无用
    selectChangePurView(e) {
      console.log("改变的值", e);
      this.purViewDataList.forEach((ele) => {
        e.forEach((el) => {
          if (el.userId == ele.userId) {
            ele.operateType = "01";
            ele.is_relation_children = "Y";
          }
        });
      });
      // this.$forceUpdate();
      console.log(e, "e");
    },
    // 权限设置分页事件
    getCurrentPageData(e) {
      this.purViewSureDialog("current");
      console.log(e, "切换");
      // 全选按钮 和单列全选按钮清空
      this.checkBoxBtnAllFalse();
      this.pagePurview.currentPage = e;

      if (this.queryName) {
        this.perviewHandle();
      } else {
        this.get_user_list();
      }
    },

    get_permission(params, donot_update_total) {
      this.permission_table_loading = true;
      permissionsCheck(params)
        .then((res) => {
          this.permission_table_loading = false;

          if (res.code == 400) {
            return this.$message.error("请求数据异常");
          }

          const arrResult = [];
          if (res.data.length == 1 && !donot_update_total) {
            this.pagePurview.total = res.data[0].total;
          }
          if (res.data && res.data.length) {
            for (const d of res.data) {
              for (const user of d.records) {
                const operateTypeListNew = [];
                for (const type_list of user.operateTypeList) {
                  if (type_list) {
                    const types = type_list.split(",");

                    for (const type of types) {
                      operateTypeListNew.push(type);
                    }
                  }
                }

                const tipsMapArr = [];
                const tipsMapArrNameObj = {};
                if (user.tipsMap) {
                  for (const key in user.tipsMap) {
                    const tips = key.split(",");
                    for (const tip of tips) {
                      tipsMapArrNameObj[tip] = user.tipsMap[key];
                      tipsMapArr.push(tip);
                    }
                  }
                }

                const obj = {
                  trainSeriesId: this.trainSeriesId,
                  deptName: user.deptName,
                  operate: user.operate,
                  childrenCatalogNames: user.childrenCatalogNames,
                  operateType: user.operateType
                    ? user.operateType.split(",")
                    : [],
                  parentCatalogNames: user.parentCatalogNames,
                  userId: user.userId,
                  userName: user.userName,
                  dept: user.deptCode,
                  operateTypeListNew: operateTypeListNew,
                  tipsMapArr: tipsMapArr,
                  tipsMapArrNameObj: tipsMapArrNameObj,
                };
                arrResult.push(obj);
              }
            }
          }
          // console.log(arrResult);

          this.purViewDataList = [...arrResult];
          console.log(arrResult);

          this.PurViewUpdataList = [];
          if (this.purViewDataList.length > 0) {
            this.purViewDataList.forEach((ele) => {
              for (let index = 0; index < 7; index++) {
                if (index == 3) continue;
                this.PurViewUpdataList.push({
                  fcu: this.userId,
                  lcu: this.userId,
                  userId: ele.userId,
                  trainSeriesId: this.trainSeriesId,
                  operateType: `0${index + 1}`,
                  dept: ele.dept,
                  isValid: ele.operateTypeListNew.includes(`0${index + 1}`)
                    ? "Y"
                    : "N",
                  userName: ele.userName,
                  deptName: ele.deptName,
                });
              }
            });
          }
        })
        .catch((error) => {
          this.permission_table_loading = false;
          this.purViewDataList = [];
        });
    },
    // 权限设置入口按钮事件(包含翻页)
    perviewHandle() {
      this.checkBoxBtnAllFalse();
      // 置空列表
      this.purViewDataList = [];
      //   if (this.trainSeriesId&&this.permissions&&this.permissions.includes('01')) {
      if (this.trainSeriesId) {
        this.purViewDialog = true;
        this.get_permission([
          {
            pi: this.pagePurview.currentPage,
            ps: this.pagePurview.size,
            trainSeriesId: this.trainSeriesId,
          },
        ]);
      } else {
        if (!this.trainSeriesId) {
          return this.$message.warning("请先选择目录");
        } else {
          return this.$message.warning("没有该目录权限");
        }
      }
    },
    // 权限设置确定按钮
    purViewSureDialog(value) {
      if (this.purViewDataList.length == 0) {
        this.$message.error("请先选择用户");
        return;
      }
      setPermission(this.PurViewUpdataList)
        .then((res) => {
          if (res.code == 200) {
            if (value == "current") {
              console.log("自动保存");
            } else {
              this.$message.success("权限设置成功");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 置空复选框的按钮函数事件
    checkBoxBtnAllFalse() {
      // 全选按钮 和单列全选按钮清空
      this.checkBoxBtnAll = false;
      for (let key in this.allCheckBoxBtn) {
        this.allCheckBoxBtn[key] = false;
      }
    },
    on_promission_commit(type) {
      if (!this.queryName) {
        this.roleQuery = true;
        this.roleQueryInput = true;
        this.purViewDataList = [];
        this.pagePurview.currentPage = 1;
        if (this.oneKeyView == true) {
          this.roleQuery = false;
          this.get_user_list(true);
        } else {
          this.get_user_list();
        }
      }
    },

    buttonType(type) {
      if (type == "角色") {
      } else if (type == "名称") {
      } else {
        this.oneKey();
      }
    },
    //一键配置
    oneKey() {
      this.researchCenterVis = false;
      this.oneKeyView = true;
      this.roleQuery = false;
      this.roleQueryInput = false;
      this.queryName = false;
      this.textContent = "按用户查找";

      if (this.systemTypes.length == 1) {
        this.inputUserName = this.systemTypes[0];
        if (this.inputUserName == "003") {
          this.systemSelect("003");
        }
      } else {
        this.inputUserName = "001";
      }

      this.on_promission_commit("onekey");
    },
    //配置确认弹窗
    oneKeyOpen() {
      this.$confirm(
        "<div>确定给所有筛选用户配置权限吗？</div><div>注意：点击确定后，系统将后台进行处理，请于10分钟后进行查询</div>",
        "提醒",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          this.oneKeyCommit();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    //选择系统时触发的事件
    systemSelect(system) {
      if (system == "003") {
        //进入科技中心模式,可以配置标签
        console.log("进来了");
        this.searchCondition.roleId = "";
        this.searchCondition.busiType = "";
        this.researchCenterVis = true;
        this.getSystemLableList();
      } else {
        this.userLableSystemChose = "";
        this.researchCenterVis = false;
      }
    },
    //一键配置提交
    oneKeyCommit() {
      trainQuickSetPermission({
        systemType: this.inputUserName,
        labelCode: this.userLableSystemChose,
        busiType: this.searchCondition.busiType,
        comCode: this.searchCondition.depLevel
          ? this.searchCondition.depLevel === "001"
            ? "%"
            : this.searchCondition.comCode.toString()
          : "",
        name: this.searchCondition.loginId,
        oaPosition: this.searchCondition.staffPostCode,
        roleId: this.searchCondition.roleId,
        userStatus: this.searchCondition.userStatus,
        // catalogId : this.catalogId,
        trainSeriesId: this.trainSeriesId,
        operateTypeList: this.oneKeyDataList.chose,
        userId: this.userId,
      })
        .then((res) => {
          this.$message({
            type: "success",
            message: "提交成功,系统将后台进行处理，请于10分钟后进行查询",
          });
          this.closePurViewDialog();
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "出错了",
          });
        });
    },

    //一键配置页面修改权限操作
    oneKeyChangeChose(event, type) {
      let choseArry = new Set(this.oneKeyDataList.chose);
      if (event == true) {
        choseArry.add(type);
      } else {
        choseArry.delete(type);
      }
      this.oneKeyDataList.chose = [...choseArry];
    },

    //获取系统标签入口
    getSystemLableList() {
      this.userLableChose = "";
      this.userLableSystemList = [];
      knowledgeGetTypeList({
        paramType: "userLabelList",
        paramCode: this.userSetLableSystem ? this.userSetLableSystem : "003",
      })
        .then((res) => {
          if (res.code == 0) {
            console.log("获取用户系统标签成功", res);
            this.userLableSystemList = res.data;
          } else {
            console.log("用户标签获取失败", error);
          }
        })
        .catch((error) => {
          console.log("用户标签获取失败", error);
        });
    },
    //用户权限及标签弹框关闭
    userAuthLableClose() {
      this.userAuthVisibleMobile = false;
      this.userSetLableSystem = "";
      this.userLableChose = "";
      this.userLableList = "";

      this.getUserLable();
    },

    //用户标签配置确认弹窗
    userLableSet() {
      if (this.purViewDataList.length == 0) {
        this.$message.error("请先选择用户再进行下一步操作");
      } else {
        let user = "";
        this.purViewDataList.forEach((item) => {
          if (item.userId.split("_")[0] == "itw") {
            if (user == "") user = user + item.userName;
            else user = user + "、" + item.userName;
          }
        });

        if (user == "") {
          this.userAuthVisibleMobile = true;
        } else {
          console.log(typeof user);
          this.$message.error("用户 " + user + " 无法被设置标签");
          return;
        }
      }
    },
    //获取用户对应的标签
    getUserLable() {
      this.userLableList = [];
    },
    //获取当前用户的系统
    getUser() {
      getUserInfoMy().then((res) => {
        if (res.code !== RES_OK) {
          this.$alert("获取用户信息失败", "提示", {
            type: "error",
          });
          return;
        }
        if (res.data) {
          console.log("获取用户信息成功", res.data);
          this.systemTypes = res.data.systemTypes;
          this.currentUserComCode = res.data.org;
          this.currentUserCode = res.data.loginId;
          // this.systemTypes = ['001','002','003']
        }
      });
    },
    //系统字典函数
    getDicData(value) {
      let key = "";
      this.systemListDic.forEach((item) => {
        if (item.value == value) key = item.key;
      });
      return key;
    },

    // 按照系统查询角色
    async getRoleList(type) {
      (this.userLableSystemChose = ""), this.checkBoxBtnAllFalse();
      this.oneKeyView = false;
      this.researchCenterVis = false;
      this.inputUserName = [];
      this.sysLists = [];
      this.pcOrganList = [];
      this.pagePurview.currentPage = 1;
      this.pagePurview.size = this.page_options[0].value;
      console.log(this.queryName);
      if (type == "角色") {
        if (this.systemTypes.length == 1) {
          this.inputUserName = this.systemTypes[0];
          if (this.inputUserName == "003") {
            this.systemSelect("003");
          }
        } else {
          this.inputUserName = "001";
        }
        // this.purViewDataList = []
        this.textContent = "按用户查找";
        this.queryName = false;
        this.roleQuery = true;
        this.department = false;
        this.roleQueryInput = true;
        this.purViewDataList = [];
        this.pagePurview.total = 0;

        getRoleLists({})
          .then((res) => {
            if (res.data.length > 0) {
              res.data.forEach((e) => {
                this.sysLists.push({
                  id: e.code,
                  name: e.name,
                });
              });
            }
            // this.sysLists.unshift({
            //   id:-1,
            //   name:'全部'
            // })
          })
          .catch((err) => {
            console.log(err);
          });
        // 获取机构···
        findKbPcOrgan({})
          .then((res) => {
            if (res.data.length) {
              res.data.forEach((ele) => {
                this.pcOrganList.push({
                  comCode: ele.comCode,
                  shortName: ele.shortName,
                });
              });
              this.pcOrganList.shift();
              this.pcOrganList[0].comCode = "%";
            }
          })
          .catch((err) => {
            console.log(err);
          });

        this.get_user_list();
      } else if (type == "用户") {
        this.inputUserName = [];
        this.purViewDataList = [];
        this.roleNamePcOrgan = [];
        this.roleName = [];
        this.pagePurview.total = 0;
        this.textContent = "按角色查找";
        this.queryName = true;
        this.roleQuery = false;
        this.department = false;
        this.roleQueryInput = false;
        this.perviewHandle();
      } else {
        this.queryName = false;
        this.roleQuery = false;
        this.department = true;
        this.roleQueryInput = false;
        await this.getPcOrgan();
        await this.getFirstDept();
        await this.getUserListBydepartment();
      }
    },
    async getPcOrgan() {
      await findKbPcOrgan().then((res) => {
        if (res.data.length) {
          res.data.forEach((ele) => {
            this.pcOrganList.push({
              comCode: ele.comCode,
              shortName: ele.shortName,
            });
          });
        }
      });
      const comCode = JSON.parse(window.sessionStorage.getItem("userInfo")).org;
      this.comCode = comCode;
      if (this.comCode != "%") {
        this.comCodeFlag = true;
      }
    },

    // 按照角色查询用户
    empLists() {
      this.loading = true;
      let postIdList = [];
      let roleIdList = [];
      let userTypeList = [];
      this.purViewDataList = [];
      setTimeout(() => {
        let roleNamePcOrganNew = [];
        let roleNameNew = [];
        if (this.roleNamePcOrgan.includes("all")) {
          let pcOrganListNew = JSON.parse(JSON.stringify(this.pcOrganList));
          pcOrganListNew.forEach((ele) => {
            roleNamePcOrganNew.push(ele.comCode);
          });
        } else {
          roleNamePcOrganNew = this.roleNamePcOrgan;
        }
        if (this.roleName.includes("all")) {
          let sysListsNew = JSON.parse(JSON.stringify(this.sysLists));
          sysListsNew.forEach((ele) => {
            console.log(sysListsNew, "---------------sysListsNew");
            roleNameNew.push(ele.id);
          });
          console.log(roleNameNew, "-------------roleNameNew");
        } else {
          roleNameNew = this.roleName;
        }
        console.log(this.userTypeId);
        if (this.userTypeId) {
          if (this.userTypeId == "all")
            for (const { id } of this.userTypes) userTypeList.push(id);
          else userTypeList = [this.userTypeId];
        }
        console.log(roleNameNew, "---------------roleNameNew");
        // 数字与字符分开
        if (roleNameNew.length > 0) {
          roleNameNew.forEach((ele) => {
            if (isNaN(ele)) {
              roleIdList.push(ele);
            } else {
              postIdList.push(ele);
            }
          });
        }

        this.permission_table_loading = true;
        empList({
          postIdList: postIdList,
          comCodeList: roleNamePcOrganNew,
          roleIdList: roleIdList,
          userTypeIdList: userTypeList,
          pageIndex: this.pagePurview.currentPage,
          pageSize: this.pagePurview.size,
        })
          .then((res) => {
            this.permission_table_loading = false;
            this.loading = false;
            this.pagePurview.total = res.data.totalElements;
            this.requestUserList = [];
            let arr = res.data.content;
            if (arr.length == 0) {
              return null;
            }
            if (arr.length > 0) {
              arr.forEach((eleUser) => {
                this.requestUserList.push({
                  pi: 1,
                  ps: 10,
                  // "catalogId":this.catalogId,
                  trainSeriesId: this.trainSeriesId,
                  userId: eleUser.loginId,
                  userName: eleUser.name,
                  deptName: eleUser.deptName,
                  dept: eleUser.tkDepartMentId,
                });
              });
              this.get_permission(this.requestUserList);
            }
          })
          .catch((err) => {
            console.log(err);
            this.permission_table_loading = false;
          });
      }, 10);
    },
    // 权限设置 OA搜索
    searchUser(e) {
      // 页码置空
      this.pagePurview.total = 0;
      // this.selectValue=[];
      this.purViewDataList = [];
      console.log(e, "输入内容");
      this.loading = true;
      getUserInfo({ name: e.trim() })
        .then((res) => {
          // console.log(res);
          this.loading = false;
          this.searchPurViewDataList = res.data;
          this.searchPurViewDataList.splice(10);
          console.log(this.searchPurViewDataList, "this.searchPurViewDataList");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 编辑
    editResetName(id) {
      savePCUserAction({
        pageName: this.$router.app._route.meta.title,
        operation: "知识库文件编辑",
      })
        .then((res) => {
          // console.log(res,res.data)
        })
        .catch((error) => {
          console.log("用户足迹保存失败", error);
        });
      queryFolder({ id: id })
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.downUploadData = res.data;
            console.log(this.downUploadData, "this.downUploadData");
            setTimeout(() => {
              this.fileEditDialog = true;
              // console.log("fileEditDialog");
            }, 50);
          } else {
            return this.$message.error("获取数据失败");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器错误");
        });
      //
    },
    // 编辑文件返回数据
    formDateBack(e) {
      console.log(e, "formDateBack返回父组件数据 ");
      this.fileEditSureDialog(e);
    },
    // 编辑文件 文件上传接口
    fileEditSureDialog(e) {
      console.log(e, "编辑上传文件的数据");
      updateknowledge(e.uploadData)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.fileEditDialog = false;
            return this.$message.success("修改文件成功");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    on_upload_progress(e) {
      this.upload_percentage = Math.trunc((e.loaded / e.total) * 100 || 0);
    },
    // 上传文件
    formDateUpfileEvent(e) {
      savePCUserAction({
        pageName: this.$router.app._route.meta.title,
        operation: "知识库上传文件",
      })
        .then((res) => {
          // console.log(res,res.data)
        })
        .catch((error) => {
          console.log("用户足迹保存失败", error);
        });
      this.upload_percentage = 0;
      this.upload_fail = false;
      uploadKnowledgeNew(e.uploadData, this.on_upload_progress)
        .then((res) => {
          if (res.code == 200) {
            if (
              e.fileListLength.split(",")[0] - 1 ==
              e.fileListLength.split(",")[1]
            ) {
              setTimeout(() => {
                this.getKnowledgelistinfo();
              }, 800);
              this.uploadFileDialog = false;
              this.$message.success("文件上传成功");
            }
          } else {
            this.$message.error("上传失败，服务器错误或者参数问题");
            this.upload_fail = true;
          }
        })
        .catch((err) => {
          this.upload_fail = true;
        });
    },
    // 关闭弹窗
    closeUploadFileDialog(e) {
      console.log(e, "----");
      this.fileEditDialog = false;
      this.uploadFileDialog = false;
    },
    // 权限选择框下拉显示隐藏
    selectOptionVisibleChange(e) {
      console.log(e, "搜索框展开事件，true是展开事件，false是关闭事件");
      if (e) {
        // 置空搜索框
        this.inputUserName = [];
        console.log("还没有搜索，仅展开");
        return null;
      }
      if (this.inputUserName.length == 0) {
        return null;
      }
      this.pagePurview.total = 0;
    },
    // 选择框下拉选择数据
    selectOptionDatalist(e) {
      this.pagePurview.total = 0;
      if (e.length < 1) {
        this.searchPurViewDataList = [];
        return null;
      }
      this.systemUserFlag = false;
      e.forEach((item) => {
        //systemUserFlag 0 未录入  1 录入
        if (item.systemUserFlag == "0") {
          this.systemUserFlag = true;
        }
      });
      console.log(e, "eee数组");
      console.log(this.inputUserName, "inputUserName数组");
      this.selectUser = e;
      this.purViewDataList = [];
      this.requestUserList = [];
      if (this.inputUserName.length > 0) {
        this.inputUserName.forEach((eleUser) => {
          this.requestUserList.push({
            pi: 1,
            ps: 10,
            // "catalogId": this.catalogId,
            trainSeriesId: this.trainSeriesId,
            userId: eleUser.loginId,
            userName: eleUser.name,
            deptName: eleUser.tkDepartMentName,
            dept: eleUser.tkDepartMentId,
          });
        });
      }
      this.get_permission(this.requestUserList);
    },
    // 权限设置复选框变化
    checkboxOperateType(item, type, e) {
      if (e) {
        item.operateTypeListNew.push(type);
      } else {
        item.operateTypeListNew.splice(
          item.operateTypeListNew.findIndex((ele) => ele == type),
          1
        );
      }
      // 选择请求到的数据this.purViewDataList
      this.PurViewUpdataList.filter((ele) => {
        if (item.userId == ele.userId && ele.operateType == type) {
          if (ele.isValid == "Y") {
            ele.isValid = "N";
          } else {
            ele.isValid = "Y";
          }
          console.log(ele.isValid, "!!!!!!!!!!!");
          return;
        }
      });
    },
    // 文件上传
    uploadFilesManage() {
      console.log("上传文件");
      if (this.catalogId) {
        this.uploadFileDialog = true;
        this.upload_percentage = 0;
        this.upload_fail = false;
      } else {
        this.$message.warning("请先选择目录");
      }
    },
    // 文件预览
    viewFile(e) {
      console.log(e, "eeeeeeeeeeeee+");
      if (!e.filePath) {
        this.$alert("文件不存在", "提示", {
          type: "error",
        });
      }
      savePCUserAction({
        pageName: this.$router.app._route.meta.title,
        operation: "知识库文件预览",
      })
        .then((res) => {
          // console.log(res,res.data)
        })
        .catch((error) => {
          console.log("用户足迹保存失败", error);
        });
      // 预览+1
      //console.log('this.$store.getters.userLoginId',this.$store.getters.userLoginId)

      let fileIp = process.env.VUE_APP_FILE_REVIEW_IP_CONFIG;
      let serviceIp = process.env.VUE_APP_DOMAIN_SERVICE_IP_CONFIG;

      const fileName =
        serviceIp +
        "/tkp-op/api/kbback/catalog/previewFile?fileId=" +
        e.kdId +
        `&userId=` +
        this.userId +
        "&clientType=pc" +
        "&fullfilename=" +
        e.kdId +
        "." +
        e.fileType +
        "&prefix=knowledge";
      const fileUrl = encodeURIComponent(Base64.encode(fileName));
      const url = fileIp + "/onlinePreview?url=" + fileUrl;
      // window.open(url);
      console.log(fileName, "----", fileUrl, "----", url);
      this.$alert(
        `<iframe frameborder="0" style="height:80vh" width="100%" src=${url}></iframe>`,
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          customClass: "file-view",
        }
      )
        .then()
        .catch(() => {});
    },
    // 关闭权限设置对话框回调
    closePurViewDialog() {
      this.researchCenterVis = false;
      (this.roleQuery = false),
        (this.roleQueryInput = false),
        (this.userLableSystemChose = ""),
        (this.searchCondition.busiType = ""),
        (this.searchCondition.roleId = ""),
        (this.purViewDialog = false),
        (this.oneKeyDataList.chose = []);
      this.sysLists = [];
      this.roleNamePcOrgan = [];
      this.roleName = [];
      (this.queryName = true),
        (this.oneKeyView = false),
        (this.pagePurview.currentPage = 1);
      // 置空搜索框数据
      this.inputUserName = [];
      this.purViewDataList = [];
      console.log("this.purViewDataList", this.purViewDataList);
      this.pagePurview.total = 0;
    },
    deleteFile(e) {
      console.log(e);
      this.$confirm("确认删除吗？", "警告", {
        cancelButtonClass: "el-button--primary el-button--mini is-plain",
        type: "warning",
      })
        .then(() => {
          savePCUserAction({
            pageName: this.$router.app._route.meta.title,
            operation: "知识库文件删除",
          })
            .then(() => {
              // console.log(res,res.data)
            })
            .catch((error) => {
              console.log("用户足迹保存失败", error);
            });
          deleteFile({ id: e.kdId, userId: this.userId })
            .then((res) => {
              this.Loading.close();
              if (res.code !== RES_OK) {
                if (res.code == "-1") {
                  this.$message.error("删除失败");
                }
                this.$message.error(res.message);
                return;
              } else {
                this.$message.success("删除成功");
                this.page.currentPage =
                  (this.page.total - 1) % this.page.size > 0
                    ? this.page.currentPage
                    : this.page.currentPage - 1;
                this.getKnowledgelistinfo();
              }
            })
            .catch((error) => {
              this.Loading.close();
              this.$message.error(
                error.response.data.message || "文件下载失败"
              );
            });
        })
        .catch(() => {});
    },
    // 搜索按钮搜索
    getKnowledgelistinfoEs() {
      savePCUserAction({
        pageName: this.$router.app._route.meta.title,
        operation: "知识库搜索按钮搜索",
      })
        .then((res) => {
          // console.log(res,res.data)
        })
        .catch((error) => {
          console.log("用户足迹保存失败", error);
        });
      console.log(this.page.currentPage, "eeeeeeeeeeee");
      // Es查询
      this.page.currentPage = 1;
      console.log(this.searchText.trim().length, "搜索条件");
      if (this.searchText.trim()) {
        console.log("es搜索");
        this.isSearch = true;
        this.cancelCheck("ES搜索");
        this.getKnowledgelistinfoEsRequest();
        // 搜索置空权限
        this.catalogName = "全部";
        this.permission = null;
      } else {
        console.log("默认搜索");
        this.isSearch = false;
        this.getKnowledgelistinfo();
      }
    },
    // es搜索
    getKnowledgelistinfoEsRequest() {
      getKnowledgelistinfoEs({
        pi: this.page.currentPage,
        ps: this.page.size,
        userId: this.userId,
        fileName: this.searchText.trim(),
      })
        .then((res) => {
          if (res.code !== 200) {
            this.$alert(res.message, "提示", {
              type: "error",
            });
            return;
          }
          if (res.data) {
            this.labelId = "";
            this.page.total = res.pager.total;
            console.log(res.data, "RES数据");
            console.log(this.resultData, "this.result 数据");
            this.resultData = res.data;
          } else if (res.data == null) {
            this.resultData = [];
            this.labelId = "";
            this.page.total = 0;
          }
        })
        .catch((error) => {
          this.Loading.close();
          this.$message.error(
            error.response.data.message || "查询目录列表失败"
          );
        });
    },
    cancelCheck(data) {
      console.log(data);
      this.isLight = false;
      this.treeId = "";
      console.log(this.treeId);
    },
    // 复选框单列全选
    allSelectClick(type, item, value) {
      console.log("type:", type);
      console.log("item:", item);
      console.log("value:", value);
      // v-modle绑定的每个单列全选复选框
      item = !item;
      // 视图v-model绑定
      this.purViewDataList.forEach((element) => {
        if (value) {
          if (element.operateTypeListNew.findIndex((el) => el == type) == -1) {
            if (!element.tipsMapArr.includes(type)) {
              element.operateTypeListNew.push(type);
            }
          }
        } else {
          console.log(
            element.operateTypeListNew.findIndex((ele) => ele == type),
            "---"
          );
          if (!element.tipsMapArr.includes(type)) {
            element.operateTypeListNew.splice(
              element.operateTypeListNew.findIndex((ele) => ele == type),
              1
            );
          }
        }
      });

      const dataLen = this.purViewDataList.length;
      let tempStorage = [];
      for (let i = 0; i < dataLen; i++) {
        const tipsMapArr = this.purViewDataList[i].tipsMapArr;
        const userId = this.purViewDataList[i].userId;
        let tempPurViewUpdateList = this.PurViewUpdataList.filter(
          (data) => userId === data.userId
        );
        if (tipsMapArr.includes(type)) {
          console.log("type:", type);
          tempPurViewUpdateList = tempPurViewUpdateList.filter((item) => {
            return type !== item.operateType;
          });
        }
        tempStorage = tempStorage.concat(tempPurViewUpdateList);
      }

      this.PurViewUpdataList = tempStorage;
      console.log(type, value, "类型,值");
      this.PurViewUpdataList.filter((ele) => {
        if (ele.operateType == type) {
          value ? (ele.isValid = "Y") : (ele.isValid = "N");
        }
      });
    },
    // 全选
    allSelectClickAll(value) {
      this.checkBoxBtnAll = value;
      console.log("allCheckBoxBtn:", this.allCheckBoxBtn);
      for (let i = 1; i <= 7; i++) {
        console.log("0" + i, value, "value----");
        this.allSelectClick(
          "0" + i,
          this.allCheckBoxBtn["checkboxFlag" + i],
          value
        );
      }
      console.log("purViewDataList:", this.purViewDataList);
      const dataLen = this.purViewDataList.length;
      let tempStorage = [];
      for (let i = 0; i < dataLen; i++) {
        const tipsMapArr = this.purViewDataList[i].tipsMapArr;
        const userId = this.purViewDataList[i].userId;
        const tempPurViewUpdateList = this.PurViewUpdataList.filter(
          (data) => userId === data.userId
        ).filter((item) => {
          return !tipsMapArr.includes(item.operateType);
        });
        tempStorage = tempStorage.concat(tempPurViewUpdateList);
        console.log("PurViewUpdataList", this.PurViewUpdataList);
      }
      this.PurViewUpdataList = tempStorage;
      console.log("purViewDataList", this.purViewDataList);

      for (let key in this.allCheckBoxBtn) {
        if (value) {
          this.allCheckBoxBtn[key] = true;
        } else {
          this.allCheckBoxBtn[key] = false;
        }
      }
    },
    async userFindSetPermissionEqz() {
      if (this.purViewDataList.length == 0) {
        return this.$message({
          type: "error",
          message: "请先选择用户",
        });
      }
      const userFinds = this.selectUser.map((item) => {
        console.log(item);
        return {
          loginId: item.loginId,
          name: item.name,
          comCode: item.comCode,
          userType: item.userTYpe,
          deptCode: item.tkDepartMentId,
          deptName: item.tkDepartMentName,
        };
      });
      const catalogUserRels = [];
      this.purViewDataList.forEach((item) => {
        console.log(item);
        for (let i = 0; i < 7; i++) {
          catalogUserRels.push({
            fcu: this.userId,
            lcu: this.userId,
            userId: item.userId,
            catalogId: item.trainSeriesId,
            operateType: `0${i + 1}`,
            dept: item.dept,
            isValid: item.operateTypeListNew.includes(`0${i + 1}`) ? "Y" : "N",
            userName: item.userName,
            deptName: item.deptName,
          });
        }
      });
      this.Loading.open();
      const result = await trainSeriesManageUserFindSetPermissionEqz({
        userFinds: userFinds,
        trainSeriesUserRelations: catalogUserRels,
      }).finally(() => {
        this.Loading.close();
      });
      if (result.code != RESULT_OK) {
        return this.$message({
          type: "error",
          message: result.message,
        });
      }
      this.$message({
        type: "success",
        message: "权限设置成功",
      });
    },
  },
  computed: {
    showConfirm() {
      return this.systemTypes.length == 1 && this.systemTypes.includes("001");
    },
  },
};
</script>
<style scoped lang="less">
.oneKeyButton {
  background-color: #f3cb86;
  border-color: #e29200;
  color: white;
  margin: 0 auto 0 10px;
}
.catalogAdmin {
  user-select: none;
}
.know-content {
  min-height: 100vh;
}

.catalogue {
  display: inline-block;
  position: absolute;
  width: 21%;
  background-color: white;
  /deep/ .el-card__body {
    height: 85vh;
    overflow: auto;
    overflow-x: auto;
  }
  /deep/ .el-card__header {
    font-weight: 600;
  }
}
.rightContent {
  display: inline-block;
  width: 75%;
  height: 100px;
  // position: absolute;
  margin-left: 24%;
  // top:-100vh;
  // background-color: white;
}
.titleAll {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    .allFile {
      display: inline-block;
    }
    span {
      color: #6f6f6f;
    }
  }
  .searchRight {
    display: flex;
    margin-right: 15px;
    .iconBg {
      width: 40px;
      height: 30px;
      background: #1e7ee8;
      color: #fff;
      text-align: center;
      line-height: 30px;
      .iconBtn {
        height: 30px;
        line-height: 8px;
      }
    }
  }
}
.nowCatalog {
  margin: 8px 0;
  color: #aaaaaa;
  font-size: 12px;
}
/deep/.module-title {
  display: inline-block;
  padding: 0;
}
.tags {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .leftTag {
    span {
      cursor: pointer;
      background-color: #e7efff;
      padding: 2px 14px;
      border-radius: 4px;
      margin-right: 15px;
    }
    span:hover {
      opacity: 0.8;
    }
    span:active {
      opacity: 1;
    }
    .delete {
      background-color: #ffeded;
      color: #ff5c23;
    }
    .moveCatalog {
      background-color: #d6f5e1;
      color: #528452;
      padding: 2px 10px;
      /*border-radius: 0px;*/
      margin-right: 10px;
    }
    .defaultColor {
      color: #83aaff;
    }
    .upload {
      background-color: #4a88ff;
      color: #fff;
    }
  }
  .rightTag {
    span {
      cursor: pointer;
      padding: 2px 10px;
      border-radius: 4px;
      border: 1px solid #1e7ee8;
      margin-left: 15px;
      color: #1e7ee8;
    }
    span:hover {
      opacity: 0.8;
    }
    span:active {
      opacity: 1;
    }
  }
  .secondRightTag {
    span {
      cursor: pointer;
      padding: 2px 10px;
      border-radius: 4px;
      border: 1px solid #1e7ee8;
      /*margin-left: 15px;*/
      color: #1e7ee8;
    }
    span:hover {
      opacity: 0.8;
    }
    span:active {
      opacity: 1;
    }
  }
}
.handleOut {
  .handles {
    display: inline-block;
    min-width: 236px;
    margin: 0 auto;
    color: #1e7ee8;
    span {
      cursor: pointer;
      margin-right: 10px;
    }
    .downloads {
      background: #1e7ee8;
      color: #fff;
      padding: 2px 12px;
      border-radius: 4px;
    }
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
}

#inputSearch {
  width: 200px;
  border: none;
  background-color: #eee;
  padding: 4px 10px;
}
.filesname {
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    margin-right: 12px;
  }
}
.userName {
  justify-content: center;
}
.fileType {
  width: 20px;
}
.dialogContent {
  text-align: center;
  .newFolderDialogCatalogName {
    text-align: left;
  }
}
.dialogFooter {
  text-align: center;
  margin: 20px 0;
}
.moveDialogFooter {
  text-align: right;
  margin-right: 20px;
}
/deep/.el-dialog__body {
  padding: 10px;
}
.pageTree {
  min-width: 100%;
  display: inline-block;
}
.catalog-tree {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 8px;
  height: 100%;
  align-items: center;
  .checkTree {
    width: 100%;
    height: 100%;
    line-height: 26px;
  }
}
/deep/
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: #14b5b0;
  .catalog-tree {
    color: white;
    // width: 100%;
  }
}
.newFolderDialog {
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
  margin-bottom: 15px;
  .contentText {
    white-space: nowrap;
    margin-right: 10px;
  }
}
.addTagHeader {
  display: flex;
  .tagText {
    display: block;
    margin-right: 8px;
    width: 40px;
    white-space: nowrap;
    height: 40px;
    line-height: 40px;
  }
  .topInput {
    display: flex;
    .addBtn {
      margin-left: 10px;
    }
  }
}
.tagUl {
  position: relative;
  // margin-left: 40px;
  margin-top: 10px;
  padding: 10px 10px 50px;
  overflow: hidden;
  border: 1px dashed #ccc;
  min-height: 100px;
  li {
    float: left;
    border-radius: 4px;
    border: 1px solid #ccc;
    padding: 2px 6px;
    margin-right: 8px;
    margin-bottom: 6px;
    i {
      margin-left: 6px;
    }
  }
  .clearAll {
    position: absolute;
    bottom: 10px;
    right: 10px;
    cursor: pointer;
    color: #5b91ff;
  }
  .clearAll:hover {
    opacity: 0.8;
  }
  .clearAll:active {
    opacity: 1;
  }
}
.tabBtn {
  margin-right: 15px;
  padding: 4px 8px;
  border: 1px solid #14b5b0;
  color: #14b5b0;
  background: #fff;
  border-radius: 4px;
}
.activeTab {
  color: #fff;
  background-color: #14b5b0;
}
.tabContent {
  margin-top: 15px;
}

.headerTitle {
  display: flex;
  .el-input {
    margin-right: 10px;
  }
}
.fileNameCss {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
/deep/ .headerTitle #userIdOrOA .el-select .el-select__tags > span {
  display: none !important;
}

/deep/ .headerTitle #roleQuery .el-select .el-select__tags > span {
  display: block !important;
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
}
.allSelect {
  margin-top: 10px;
  padding-left: 483px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 600px;
  .el-checkbox {
    margin-right: 66px;
  }
}
/deep/ .allSelect .el-checkbox__inner {
  border: 1px solid #aaa !important;
}
.el-tree-dialog {
  padding-left: 80px;
}
.currentDialogContent {
  color: #c1bebe;
}

.pagination-wrap {
  display: flex;
  align-items: center;
}

.row-label-warp {
  text-align: center;
  margin-bottom: 10px;
}
.user-region-warp {
  display: grid;
  grid-template-columns: 1fr;
  padding: 5px;
  border: 1px solid #eee;
  height: 200px;
  width: 95%;
  overflow: scroll;
  /*  border: 1px solid #eee;*/
  /* row-gap: 5px;*/
  justify-content: space-between;
  grid-auto-rows: 0fr;
  line-height: 1.5;
}

.form-row-name {
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  span {
    display: inline-block;
  }
}

.row-region-warp {
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 35px;
  border: 1px solid #eee;
  height: 165px;
  width: 95%;

  justify-content: space-between;
  grid-auto-rows: 0fr;
  line-height: 1;
  overflow-y: scroll;
  padding: 0 5px;
}

.redDel {
  color: red;
}
</style>
