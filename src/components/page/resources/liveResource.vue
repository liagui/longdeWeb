<template>
  <div class="cashAudit">
    <div class="container-box" v-if="showList">
      <div class="content-head">
        <div>直播资源</div>
        <el-form :model="searchData" ref="searchData" :inline="true">
          <el-cascader
            style="width:200px;"
            v-model="searchData.parent_id"
            collapse-tags
            :options="subjectArr"
            clearable
            @change="select"
            placeholder="选择所属学科"
            :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
          ></el-cascader>
          <el-select
            v-model="searchData.nature"
            @change="select"
            style="width:150px"
            placeholder="选择资源属性"
          >
            <el-option
              v-for="(item, index) in natureArr"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-select
            v-model="searchData.is_forbid"
            @change="select"
            style="width:150px"
            placeholder="选择状态"
          >
            <el-option
              v-for="(item, index) in is_forbidArr"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-input
            v-model="searchData.name"
            placeholder="资源名称/id"
            clearable
            prefix-icon="el-icon-search"
            style="width:200px;"
          ></el-input>
          <el-form-item>
            <el-button @click="addResource('addData')" type="primary">+ 添加资源</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content-cont">
        <el-table
          :data="cashAuditData"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
        >
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="name" label="课程单元名称" min-width="160"></el-table-column>
          <el-table-column prop="subject_name" label="所属学科"></el-table-column>
          <el-table-column prop="class_num" label="班号数量"></el-table-column>
          <el-table-column label="资源属性">
            <template slot-scope="scope">
              <div v-text="scope.row.nature == 2?'授权':'自增'"></div>
            </template>
          </el-table-column>
          <el-table-column prop="is_forbid" label="当前状态">
            <template slot-scope="scope">
              <div v-text="scope.row.is_forbid == 1?'已被课程使用':scope.row.is_forbid==2?'禁用':'未被课程使用'"></div>
            </template>
          </el-table-column>
          <el-table-column prop="create_at" label="创建时间"></el-table-column>
          <el-table-column prop="admin_name" label="创建人"></el-table-column>
          <el-table-column prop="errorDesc" label="操作" width="220px">
            <template slot-scope="scope">
              <el-button type="danger" v-if='scope.row.nature == 0' size="mini" @click="delItem(scope.row.id)">删除</el-button>
              <el-button
                type="warning"
                size="mini"
                @click="DisableItem(scope.row.id,scope.row.is_forbid)"
              >{{scope.row.is_forbid == 2? '禁用':'启用'}}</el-button>
              <el-button type="primary" size="mini" @click="detailItem(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          v-if="paginationShow"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[20, 50, 100]"
          :page-size="cur.pagesize"
          :total="totalCount"
          :current-page="nextPage"
          layout="total, sizes, prev, pager, next, jumper,slot"
        >
          <el-button class="pagingBtn" size="small">确认</el-button>
        </el-pagination>
      </div>
    </div>
    <record-detail v-if="showDetail" :transDataId="transDataId" @closeFun="closeFun"></record-detail>

    <el-dialog
      :title="addData.id?'修改直播单元':'添加直播单元'"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      width="60%"
      @close="showDialog = false"
      center
    >
      <div class="form-box">
        <el-form
          :model="addData"
          style="text-align:center;"
          label-width="120px"
          ref="addData"
          :rules="addDataRule"
          :inline="true"
        >
          <el-form-item label="所属学科：" prop="parent_id" style="margin-top:30px;">
            <el-cascader
              style="width:400px;"
              v-model="addData.parent_id"
              collapse-tags
              :options="subjectArr"
              clearable
              :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
          <el-row>
            <el-form-item label="直播单元名称：" style="margin-top:10px;" prop="name">
              <el-input v-model="addData.name" style="width:400px;" placeholder="请输入资源名称" clearable></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="直播单元介绍：" prop="introduce" style="margin-top:10px;">
              <el-input
                v-model="addData.introduce"
                style="width:400px;"
                type="textarea"
                :rows="5"
                placeholder="请输入直播介绍"
                clearable
              ></el-input>
            </el-form-item>
          </el-row>
          <el-form-item>
            <!-- <el-button type="primary" @click="search">查询</el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="clear-btn" @click="showDialog = false">取 消</el-button>
        <el-button class="sub-btn" type="primary" @click="dialogMarksure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
import { checkCharacters, rightNumber } from "@/utils/rules";
// import recordDetail from "./liveResourceDetail";
export default {
  // components: {
  //   "record-detail": recordDetail
  // },
  data() {
    return {
      natureArr: [
        { label: "全部", value: 3 },
        { label: "授权", value: 2 },
        { label: "自增", value: 1 }
      ],
      is_forbidArr: [
        { label: "全部", value: 3 },
        { label: "未被课程使用", value: 0 },
        { label: "已被课程使用", value: 1 },
        { label: "禁用", value: 2 }
      ],
      schoolBranch: [],
      showList: this.$store.state.SecHeadClick,
      showDetail: false,
      showDialog: false,
      subjectArr: [], //课程列表
      addData: {
        id: "",
        name: "",
        introduce: "",
        parent_id: []
      },
      addDataRule: {
        name: [
          { required: true, message: "请输入课程单元名称", trigger: "blur" }
        ],
        introduce: [
          { required: true, message: "请输入课程单元介绍", trigger: "blur" }
        ],
        parent_id: [
          { required: true, message: "请选择所属学科", trigger: "change" }
        ]
      },
      transDataId: "",
      searchData: {
        parent_id: [],
        nature: "",
        is_forbid: "",
        name: ""
      },
      statusArr: [
        { label: "全部", value: "" },
        { label: "待审核", value: 0 },
        { label: "审核通过", value: 1 },
        { label: "审核拒绝", value: 2 }
      ],
      cashAuditData: [],
      selectBox: {
        payType: [],
        status: [],
        startApplyTime: "",
        endApplyTime: ""
      },
      creatTimes: [],
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      totalCount: 20,
      load: false,
      timeout:null
    };
  },
  created() {
    this.initData();
    this.selTeacher();
  },
  mounted() {
    // 直播课程跳转过来 直接展示详情
    var liveId = localStorage.getItem("openCourseLiveDetail");
    var nature = localStorage.getItem("openCourseLiveDetailNature")
    if (liveId) {
      // alert(liveId)
      this.detailItem({id:liveId,nature:nature});
      this.transDataId = liveId;
      localStorage.removeItem("openCourseLiveDetail");
      localStorage.removeItem("openCourseLiveDetailNature");
    }
  },
  methods: {
    closeFun() {
      this.showList = true;
      this.showDetail = false;
      this.initData();
    },
    // 删除
    delItem(id) {
      this.$confirm("删除该直播课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request.http(this, "deleteLive", { id: id }).then(res => {
            if (res.code == 200) {
              if(this.cur.page > 1){
                this.cur.page = Math.ceil(this.totalCount-1) / this.cur.pagesize;
              }
              this.initData();
            } else {
              alert(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    // 禁用
    DisableItem(id,forbit) {
      var text = forbit == 2 ? "启用" : "禁用";
      console.log(id);
      this.$confirm(text + "该直播课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request.http(this, "updateLiveStatus", { id: id }).then(res => {
            if (res.code == 200) {
              this.initData();
            } else {
              alert(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    detailItem(row) {
      // this.showList = false;
      // this.showDetail = true;
      // this.transDataId = id;
      this.$router.push(
        {
          path:"/resources/liveResource/detail",
          query:{
            transDataId: row.id,            
            nature: row.nature,            
          }
        }
        );

    },
    addResource(form) {
      //  添加资源
      this.addData = {
        id: "",
        name: "",
        introduce: "",
        parent_id: []
      };
      this.showDialog = true;
      this.$refs.addData && this.$refs.addData.resetFields();
    },
    selTeacher() {
      _request.http(this, "subject").then(res => {
        this.subjectArr = res.data;
      });
    },
    dialogMarksure() {
      this.$refs.addData.validate(valid => {
        if (valid) {
          if (this.addData.id) {
            // 修改
            _request.http(this, "updateLive", this.addData).then(res => {
              if (res.code == 200) {
                this.showDialog = false;
                this.initData();
              }
            });
          } else {
            _request.http(this, "live/add", this.addData).then(res => {
              if (res.code == 200) {
                this.showDialog = false;
                this.addData.id = "";
                this.initData();
              }
            });
          }
        }
      });
    },
    auditAcess(row) {
      console.log(row);
    },
    initData() {
      _request.http(this, "live", this.searchData, this.cur).then(res => {
        this.cashAuditData = res.data.Live_list;
        this.totalCount = res.data.total;
        this.nextPage = parseInt(res.data.page);
      });
    },
    select() {
      this.paginationShow = false;
      this.cur.page = 1;
      this.$nextTick(() => {
        this.initData();
        this.paginationShow = true;
      });
    },

    //每页
    handleSizeChange(val) {
      this.cur.pagesize = val;
      this.initData();
    },
    //第几页
    handleCurrentChange(val) {
      this.cur.page = val;
      this.initData();
    }
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", data => {
        this.showList = data;
        this.showDetail = false;
      });
    },
    "searchData.name": {
      handler(newVal, oldVal) {        
        if (!this.load) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.initData();
          this.load = false;
        }, 500);
      }
    }
  }
};
</script>

<style scoped lang="less">
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ebebeb;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
  height: 45px;
  line-height: 45px;
  padding: 0 16px 0 24px;
  box-sizing: border-box;
  .pin {
    cursor: pointer;
    color: #444444;
  }
}
.text-color {
  color: black;
}
.btn {
  display: inline-block;
}
.btn:last-child {
  margin-right: 10px;
}
.input-width-150 {
  width: 96px;
}
</style>