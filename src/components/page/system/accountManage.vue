<template>
  <div class="container-box">
    <div class="accounadd" v-if="showList">
      <div class="content-head">
        <el-button type="primary" @click="addAccount">+ 添加账户</el-button>

        <el-form :model="payment" :rules="rule" ref="payment" :inline="true">
          <el-form-item>
            <!-- <el-select
              v-model="payment.school_id"
              placeholder="默认网校"
              clearable
            >-->
            <!-- <el-option
              v-for="(item, index) in schoolBranch"
              :label="item.name"
              :value="item.id"
              :key="index"
            ></el-option>-->
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="用户名/姓名/手机号"
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
          <el-table-column prop="username" label="用户名" title="用户名"></el-table-column>
          <el-table-column prop="realname" label="姓名" title="姓名"></el-table-column>
          <el-table-column prop="sex" label="性别" title="性别">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.sex == 0">男</el-tag>
              <el-tag type="success" v-if="scope.row.sex == 1">女</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" title="手机号"></el-table-column>
          <el-table-column prop="role_name" label="角色名称" title="角色名称"></el-table-column>
          <el-table-column prop="auth_desc" label="权限描述" title="权限描述"></el-table-column>
          <el-table-column prop="is_forbid" label="状态" title="状态">
            <template slot-scope="scope">
              <!-- <el-switch
              @change="changeStatus(scope.row.adminid)"
              v-model="scope.row.is_forbid"
              active-color="#00cc00"
              inactive-color="#797979"
              :active-value="1"
              :inactive-value="0"
              :width="60"
              ></el-switch>-->

              <el-switch
                :width="55"
                v-model="scope.row.is_forbid"
                @change="changeStatus(scope.row.adminid)"
                active-color="#00cc00"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="禁用"
                inactive-color="#ddd"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" title="操作">
            <template slot-scope="scope">
              <span
                class="el-tag el-tag--info el-tag--mini"
                style="cursor: pointer; padding: 0 10px"
                @click="changeDataConfig(scope.row)"
              >编辑</span>
              <span
                class="el-tag el-tag--danger el-tag--mini"
                style="cursor: pointer; padding: 0 10px"
                @click="deleteData(scope.row.adminid)"
              >删除</span>
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
          @click="select"
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
</template>
<script>
import _request from "@/utils/request";
export default {
  data() {
    return {
      inputVisible: false,
      inputValue: "",
      schoolBranch: [],
      showList: this.$store.state.SecHeadClick,
      showAddBox: false,
      payment: {
        search: "",
        school_id: ""
      },
      selfUserId: "",
      payInfos: [],
      selectIds: Number,
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      pageCount: 1,
      totalCount: 20,
      addData: {
        sex: "1"
      },
      rule: {
        // userNameOrPhoneNo: [{ validator: checkCharacters, trigger: "blur" }],
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
    }
  },
  created() {
    this.initData();
  },
  methods: {
    changeDataConfig(item) {
      // console.log(item.adminid);
      var urlParam = `?transId=${item.adminid}`;
      this.$router.push("/system/accountManage/update" + urlParam);
    },
    search() {
      _request
        .http(this, "adminuser/getAdminUserList", this.payment, this.cur)
        .then(res => {
          this.payInfos = res.data.admin_list;
          console.log(res);
          this.totalCount = res.data.total;
          this.nextPage = parseInt(res.data.page);
          this.schoolBranch = res.data.school_list;
        });
    },
    changeStatus(val) {
      // this.switchclose = true;
      _request
        .http(this, "adminuser/upUserForbidStatus", {
          id: val
        })
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.initData();
          setTimeout(() => {
            this.switchclose = false;
          }, 2000);
        });
    },
    deleteData(val) {
      this.$confirm("删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request

            .http(this, "adminuser/upUserDelStatus", { id: val })
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // if (this.cur.page > 1) {
              //   this.cur.page =
              //     Math.ceil(this.totalCount - 1) / this.cur.pagesize;
              // }
              this.initData();
            });
        })
        .catch(() => {});
    },
    closeAddFun(val) {
      this.showList = true;
      this.showAddBox = false;
    },
    cancelFun() {
      this.showList = true;
    },
    marksureFun() {
      this.showList = true;
      this.showAddBox = false;
      this.initData();
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    addAccount() {
      var urlParam = `?transId=`;
      this.$router.push("/system/accountManage/add" + urlParam);
    },

    initData() {
      _request
        .http(this, "adminuser/getAdminUserList", this.payment, this.cur)
        .then(res => {
          this.payInfos = res.data.admin_list;
          this.totalCount = res.data.total;
          this.schoolBranch = res.data.school_list;
        });
    },

    select() {
      this.$refs.payment.validate(valid => {
        if (valid) {
          this.paginationShow = false;
          this.cur.pag = 1;
          // this.searchData = this.payment;
          this.$nextTick(() => {
            this.paginationShow = true;
            this.initData();
          });
        } else {
          return false;
        }
      });
    },
    //每页
    handleSizeChange(val) {
      console.log(val);
      this.cur.pageSize = val;
      this.initData();
    },
    //第几页
    handleCurrentChange(val) {
      console.log(val);
      this.cur.page = val;
      this.initData();
    }
  },
  mounted() {}
};
</script>
<style scoped lang="less">
.accounadd {
  height: 100%;
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
