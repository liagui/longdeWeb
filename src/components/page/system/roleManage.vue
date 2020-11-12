<template>
  <div class="container-box" :style="{ background: showList ? '' : '#fff' }">
    <div v-if="showList">
      <div class="content-head">
        <div>
          <el-button type="primary" @click="addAccount">+ 添加角色</el-button>
        </div>
        <el-form :model="payment" ref="payment" :inline="true">
          <el-form-item>
            <el-input
              placeholder="角色名称"
              v-model="payment.search"
              clearable
              prefix-icon="el-icon-search"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content-cont">
        <el-table
          :data="payInfos"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
        >
          <el-table-column prop="role_name" label="角色名称" title="角色名称"></el-table-column>
          <el-table-column prop="auth_desc" label="权限描述" title="权限描述"></el-table-column>
          <el-table-column prop="create_time" label="创建时间" title="创建时间"></el-table-column>
          <el-table-column prop="username" label="创建用户" title="创建用户"></el-table-column>
          <el-table-column prop label="操作" title="操作">
            <template slot-scope="scope">
              <div v-if="scope.row.role_name=='超级管理员'"></div>
              <div v-else>
                <span
                  class="el-tag el-tag--info el-tag--mini"
                  style="cursor: pointer;padding:0 10px;"
                  @click="changeDataConfig(scope.row.id, scope.$index, true)"
                >编辑</span>
                <span
                  class="el-tag el-tag--danger el-tag--mini"
                  style="cursor: pointer;padding:0 10px;"
                  @click="deleteDataConfig(scope.row.id)"
                >删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            v-if="paginationShow"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[20, 50, 100]"
            :page-size="cur.pageSize"
            :total="totalCount"
            :current-page="nextPage"
            layout="total, sizes, prev, pager, next, jumper,slot"
          >
            <el-button class="pagingBtn" size="small">确认</el-button>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
import bus from "../../common/bus";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";

// import roleEdit from "./roleEdit";
export default {
  // components: {  roleEdit },
  data() {
    return {
      role_id: Number,
      edit_id: "",
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: "",
      schoolBranch: [],
      showList: this.$store.state.SecHeadClick || true,
      showAdd: false,
      showEdit: false,
      payment: {
        search: ""
      },
      payInfos: [],
      selectIds: Number,
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      totalCount: 20,
      addData: {
        sex: "1"
      },
      searchData: {}
    };
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", data => {
        console.log(data);
        this.showList = data;
      });
    },
    nextPage() {
      this.initData();
    }
  },
  created() {
    this.initData();
    // this.getPayChannels();
    bus.$on("changListStatus", msg => {
      this.$nextTick(() => {
        this.showList = msg;
      });
    });
  },
  mounted() {},
  methods: {
    //删除
    deleteDataConfig(val) {
      this.$confirm("删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request.http(this, "role/doRoleDel", { id: val }).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              if (this.cur.page > 1) {
                this.cur.page =
                  Math.ceil(this.totalCount - 1) / this.cur.pagesize;
              }
              this.initData();
            } else {
              alert(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    changeDataConfig(val) {
      // this.showList = false;
      // this.showEdit = true;
      // this.showAdd = false;
      // this.edit_id = val;
      this.$router.push("/system/roleManage/edit?editId=" + val);
    },
    search() {
      _request
        .http(this, "adminuser/getAuthList", this.payment, this.cur)
        .then(res => {
          this.payInfos = res.data.role_auth_list;
          this.totalCount = res.data.total;
        });
    },

    selTeacher() {},
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    getPayChannels() {
      _request.http(this, "payChannel/findConditionPayChannels").then(res => {
        var getData = res.data.payChannels;
        for (var i = 0; i < getData.length; i++) {
          this.schoolBranch.push(getData[i]);
        }
      });
      this.schoolBranch.unshift({
        payChannelId: "",
        payChannelName: "全部"
      });
    },

    addAccount() {
      // this.showList = false;
      // this.showEdit = false;
      // this.showAdd = true;
      this.$router.push("/system/roleManage/add");
    },

    initData() {
      _request
        .http(this, "adminuser/getAuthList", this.payment, this.cur)
        .then(res => {
          this.payInfos = res.data.role_auth_list;
          this.totalCount = res.data.total;
          this.nextPage = parseInt(res.data.page);
        });
    },

    select() {
      this.$refs.payment.validate(valid => {
        if (valid) {
          this.paginationShow = false;
          this.cur.page = 1;
          // this.searchData = this.payment;
          this.$nextTick(() => {
            this.initData();
            this.paginationShow = true;
          });
        } else {
          return false;
        }
      });
    },
    //每页
    handleSizeChange(val) {
      console.log("handleSizeChange:" + val);
      this.cur.pageSize = val;
      this.initData();
    },
    //第几页
    handleCurrentChange(val) {
      console.log("handleCurrentChange:" + val);
      this.cur.page = val;
      this.initData();
    }
  }
};
</script>
<style scoped lang="less">
.accounadd {
  background-color: #fff;
  .head-style {
    margin: 30px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    color: #333333;
  }
  .form-box {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, 0);
  }
  .foot-btn {
    margin-top: 20px;
    text-align: right;
    .sub-btn {
      color: #fff;
      font-size: 12px;
      background: linear-gradient(
        -90deg,
        rgba(38, 164, 253, 1),
        rgba(107, 149, 253, 1)
      );
      border-radius: 3px;
    }
  }
}
/deep/ .el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
