<template>
  <div class="cashAudit">
    <div class="container-box" v-if="showList">
      <div class="content-head">
        <span>学员</span>

        <el-form :model="order" ref="order" :inline="true">
          <el-select
            v-model="order.school_id"
            @change="select"
            placeholder="选择所属网校"
            clearable
            class="width-150"
          >
            <el-option
              v-for="(item, index) in schoolArr"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="order.enroll_status"
            @change="select"
            class="width-150"
            placeholder="选择报名状态"
          >
            <el-option
              v-for="(item, index) in signupStatus"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-select
            v-model="order.is_forbid"
            @change="select"
            class="width-150"
            placeholder="选择账号状态"
          >
            <el-option
              v-for="(item, index) in stuStatus"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-select
            v-model="order.state_status"
            @change="select"
            class="width-150"
            placeholder="选择开课状态"
          >
            <el-option
              v-for="(item, index) in state_statusArr"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-input
            v-model="order.search"
            prefix-icon="el-icon-search"
            placeholder="姓名/手机号"
            clearable
            style="width:200px;"
          ></el-input>

          <el-form-item style="margin-left:15px;">
            <el-button @click="addStutdentFun" type="primary">+ 添加学员</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="addStutdentMore" type="primary">批量报名</el-button>
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
          <el-table-column prop="student_id" label="ID"></el-table-column>
          <el-table-column prop="real_name" label="学员姓名"></el-table-column>
          <el-table-column prop="school_name" label="所属网校"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="create_at" label="创建日期"></el-table-column>
          <el-table-column prop="enroll_status" label="报名状态">
            <template slot-scope="scope">
              <div v-if="scope.row.enroll_status" class="info">已报名</div>
              <div v-else class="danger">未报名</div>
            </template>
          </el-table-column>
          <el-table-column prop="state_status" label="开课状态">
            <template slot-scope="scope">
              <div v-if="scope.row.state_status == 2" class="info">全部开课</div>
              <div v-else-if="scope.row.state_status == 1" class="primary">部分开课</div>
              <div v-else class="warning">均未开课</div>
            </template>
          </el-table-column>
          <el-table-column prop="is_forbid" label="账号状态">
            <template slot-scope="scope">
              <el-switch
                :width="55"
                v-model="scope.row.is_forbid"
                @change="changeStatus(scope.row.student_id)"
                active-color="#00cc00"
                :active-value="1"
                :inactive-value="2"
                active-text="启用"
                inactive-text="禁用"
                inactive-color="#ddd"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="errorDesc" label="操作" width="220px">
            <template slot-scope="scope">
              <el-button type="danger" @click="studentEnrolment(scope.row)">报名</el-button>
              <el-button type="warning" @click="studentArchive(scope.row)">档案</el-button>
              <el-button type="primary" @click="studentUpdate(scope.row)">编辑</el-button>
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
      <!-- 添加 -->
      <students-add
        v-if="studentAdd"
        :studentAdd="studentAdd"
        :studentMess="student_id"
        @marksureDialog="marksureDialog"
        @closeDialog="closeDialog"
      ></students-add>
      <!-- 批量添加 -->
      <StudentMoreAdd
        v-if="studentMoreAdd"
        :showMore="studentMoreAdd"
        @marksureDialog="marksureDialog"
        @closeDialog="closeDialog"
      ></StudentMoreAdd>
      <!-- 报名 -->
      <students-signup
        v-if="studentSignup"
        :studentSignup="studentSignup"
        :studentSignData="student_sign"
        @marksureDialog="marksureDialog"
        @closeDialog="closeDialog"
      ></students-signup>
    </div>
    <div v-else>
      <!-- 档案 -->
      <!-- <students-archive v-if="showArchive" :archiveId="archiveId"></students-archive> -->
    </div>
  </div>
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
import {
  checkCharacters,
  checkPhoneCou,
  emailRule,
  qqemailRule
} from "@/utils/rules";
import { studentsInfo } from "./mixins/studentsInfo";
import studentsAdd from "./studentsAdd";
import StudentMoreAdd from "./StudentMoreAdd";
import studentsSignup from "./studentsSignup";
export default {
  mixins: [studentsInfo],
  components: {
    studentsAdd,
    studentsSignup,
    StudentMoreAdd
  },
  data() {
    return {
      showList: this.$store.state.SecHeadClick,
      studentAdd: false,
      studentMoreAdd: false,
      studentSignup: false,
      showArchive: false,
      student_id: "",
      archiveId: "",
      student_sign: "",
      order: {
        school_id: "",
        enroll_status: "",
        is_forbid: "",
        state_status: "",
        search: ""
      },
      schoolArr: [],
      cashAuditData: [],
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      totalCount: 20
    };
  },

  mounted() {
    this.initData();
    this.getSubjectList();
  },
  methods: {
    getSubjectList() {
      _request.http(this, "schoolLists").then(res => {
        this.schoolArr = res.data; //分类
      });
    },
    marksureDialog() {
      this.studentAdd = false;
      this.studentSignup = false;
      this.studentMoreAdd = false;
      this.initData();
    },
    // 关闭弹窗
    closeDialog() {
      this.studentAdd = false;
      this.studentSignup = false;
      this.studentMoreAdd = false;
      this.initData();
    },
    studentEnrolment(row) {
      this.studentSignup = true;
      this.student_sign = JSON.stringify(row);
    },
    studentUpdate(row) {
      this.studentAdd = true;
      this.student_id = row.student_id;
    },
    studentArchive(row) {
      // this.showList = false;
      // this.archiveId = row.student_id;
      // this.showArchive = true;
      this.$router.push(
        {
          path:"/users/students/archive",
          query:{
            archiveId: row.student_id            
          }
        }
        );


    },

    addStutdentFun() {
      this.studentAdd = true;
      // this.dialogFormVisible = true;
      this.student_id = "";
    },
    addStutdentMore() {
      this.studentMoreAdd = true;
    },
    changeStatus(id) {
      _request
        .http(this, "student/doForbidStudent", { student_id: id })
        .then(res => {
          if (res.code == 200) {
          }
        });
    },

    initData() {
      _request
        .http(this, "student/getStudentList", this.order, this.cur)
        .then(res => {
          this.cashAuditData = res.data.student_list;
          this.totalCount = res.data.total;
          this.nextPage = parseInt(res.data.page);
        });
    },
    select() {
      console.log(JSON.stringify(this.order));
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
        this.showAddBox = false;
        // this.cur.page = 1;
        // this.initData();
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
      }
    }
  }
};
</script>

<style scoped lang="less">
.info {
  color: #888888;
}
.danger {
  color: #ff0000;
}
.primary {
  color: #1cc700;
}
.warning {
  color: #ff8a00;
}
.width-150 {
  width: 150px;
}
.set-dialog {
  margin-right: 20px;
}
</style>