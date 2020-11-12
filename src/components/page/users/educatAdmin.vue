<template>
  <div class="cashAudit">
    <div class="container-box" v-if="showList">
      <div class="content-head">
        <span>教务</span>
        <div></div>
        <el-form :model="order" :rules="rule" ref="order" :inline="true">
          <el-form-item>
            <el-input
              v-model="order.search"
              prefix-icon="el-icon-search"
              placeholder="教务姓名"
              clearable
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="addBox">+ 添加教务</el-button>
        </el-form>
      </div>
      <div class="content-cont">
        <el-table
          :data="dataList"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
          :max-height="tableHeight"
        >
          <el-table-column prop="teacher_id" label="ID" width="100"></el-table-column>
          <el-table-column prop="real_name" label="教务姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="number" label="教务属性">
            <template slot-scope="scope">
              <div v-if="scope.row.is_auth == 1">授权教务</div>
              <div v-else>自增教务</div>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                :width="55"
                :disabled="Boolean(scope.row.is_auth)"
                v-model="scope.row.is_forbid"
                @change="changeStatus(scope.row.teacher_id)"
                active-color="#00cc00"
                :active-value="0"
                :inactive-value="1"
                active-text="启用"
                inactive-text="禁用"
                inactive-color="#ddd"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="errorDesc" label="操作" width="150px">
            <template slot-scope="scope">
              <el-button
                type="warning"
                :disabled="Boolean(scope.row.is_auth)"
                @click="delItem(scope.row.teacher_id)"
              >删除</el-button>
              <el-button type="primary" @click="orderDetailMsg(scope.row)">编辑</el-button>
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
    <!-- <Modal
      width="80%"
      min-idth="660px"
      :show="showAddBox"
      :title="transId?'教务修改':'教务添加'"
      @close="closeCom"
    > -->
    <el-dialog
      :title="transId?'教务修改':'教务添加'"
      :close-on-click-modal="false"
      width="80%"
       min-idth="660px"
      :visible.sync="showAddBox"
      @close="closeCom"
      center
    >
      <eduicate-add
        v-if="showAddBox"
        @closeFun="closeCom"
        @successClose="marksureFun"
        :transId="transId"
        :is_auth="isAuth"
      ></eduicate-add>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import Modal from "@/components/business/Modal";
import _request from "@/utils/request";
import constants from "@/utils/constants";
import eduicateAdd from "./educatAdd";
import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
import { checkCharacters, rightNumber } from "@/utils/rules";

export default {
  components: {
    Modal,
    eduicateAdd,
  },
  data() {
    return {
      isAuth: false,
      schoolBranch: [],
      showcate: false,
      showList: this.$store.state.SecHeadClick,
      showAddBox: false,
      order: {
        type: 1,
        search: "",
      },
      tableHeight: null,
      dataList: [],
      selectBox: {
        payType: [],
        repaymentWay: constants.repaymentWay,
        status: constants.status,
        status: [],
        startApplyTime: "",
        endApplyTime: "",
      },
      creatTimes: [],
      transId: "",
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20,
      },
      nextPage: 1,
      totalCount: 20,
      rule: {
        orderNo: [
          {
            validator: checkCharacters,
            validator: rightNumber,
            trigger: "blur",
          },
        ],
      },
      load: false,
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    if (document.body.clientWidth >= 1680) {
      this.tableHeight = parseInt(document.body.clientHeight) - 240 + "px";
      window.onresize = () => {
        this.$nextTick(() => {
          this.tableHeight = parseInt(document.body.clientHeight) - 240 + "px";
        });
      };
    } else {
      this.tableHeight = parseInt(document.body.clientHeight) - 290 + "px";
      window.onresize = () => {
        this.$nextTick(() => {
          this.tableHeight = parseInt(document.body.clientHeight) - 290 + "px";
        });
      };
    }
  },
  methods: {
    addBox() {
      this.showList = true;
      this.showAddBox = true;
      this.transId = "";
      this.isAuth = false;
    },
    auditAcess(row) {
      console.log(row);
    },
    delItem(id) {
      this.$confirm("删除该教务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request
            .http(this, "teacher/doDeleteTeacher", { teacher_id: id })
            .then((res) => {
              if (res.code == 200) {
                if (this.cur.page > 1) {
                  this.cur.page =
                    Math.ceil(this.totalCount - 1) / this.cur.pagesize;
                }
                this.initData();
              }
            });
        })
        .catch(() => {});
    },
    orderDetailMsg(row) {
      this.transId = row.teacher_id;
      this.isAuth = Boolean(row.is_auth);
      this.showList = true;
      this.showAddBox = true;
    },
    initData() {
      _request
        .http(this, "teacher/getTeacherList", this.order, this.cur)
        .then((res) => {
          this.dataList = res.data.teacher_list;
          this.totalCount = res.data.total;
        });
    },
    marksureFun() {
      this.showList = true;
      this.showAddBox = false;
      this.initData();
    },
    closeCom() {
      this.showAddBox = false;
      this.showList = true;
    },

    // 推荐老师
    changeStatus(id) {
      _request
        .http(this, "teacher/doForbidTeacher", { teacher_id: id })
        .then((res) => {
          if (res.code == 200) {
          }
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
    },
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", (data) => {
        this.showList = data;
        this.showAddBox = false;
      });
    },
    "order.search": {
      handler(newVal, oldVal) {
        let timeout;
        if (this.load) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          this.initData();
          this.load = false;
        }, 500);
      },
    },
  },
};
</script>

<style scoped lang="less">
.cashAudit {
  height: 100%;
}
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