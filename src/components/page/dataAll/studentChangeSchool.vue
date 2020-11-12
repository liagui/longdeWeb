<template>
  <div class="cashAudit">
    <div class="container-box">
      <div class="content-head">
        <div></div>
        <el-form :model="order" ref="order" :inline="true">
          <el-form-item>
            <el-input
              v-model="order.search"
              prefix-icon="el-icon-search"
              placeholder="手机号/姓名"
              clearable
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="initData">查询</el-button>
        </el-form>
      </div>
      <div class="content-cont">
        <el-table
          :data="dataList"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
        >
          <el-table-column prop="real_name" label="学员姓名"></el-table-column>
          <el-table-column prop="school_name" label="原属分校"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="create_at" label="创建日期"></el-table-column>
          <el-table-column prop="number" label="报名状态">
            <template slot-scope="scope">
              <div v-if="scope.row.enroll_status == 1">已报名</div>
              <div v-else>未报名</div>
            </template>
          </el-table-column>
          <el-table-column label="开课状态">
            <template slot-scope="scope">
              <div v-if="scope.row.state_status == 1">部分开课</div>
              <div v-else-if="scope.row.state_status == 2">全部开课</div>
              <div v-else>未开课</div>
            </template>
          </el-table-column>
          <el-table-column label="账户状态">
            <template slot-scope="scope">
              <el-switch
                :width="55"
                disabled
                v-model="scope.row.is_forbid"
                @change="recommendTeacher(scope.row.teacher_id)"
                active-color="#00cc00"
                :active-value="1"
                :inactive-value="2"
                active-text="是"
                inactive-text="否"
                inactive-color="#ddd"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="需转分校">
            <template slot-scope="scope">
              <el-select v-model="scope.row.school_id" placeholder="选择所属网校">
                <el-option
                  v-for="(item, index) in schoolArr"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="changeSchool-warn">
        <div>*转校功能只针对学员账户基础信息进行转移，学院开课记录、学习进度、交易订单无法转移</div>
        <div>*转校功能请谨慎使用！如无特殊情况请勿使用！</div>
      </div>
      <div class="mt-20">
        <el-form>
          <div @click="cancelFun" class="clear-btn">取消</div>
          <div @click="marksureFun" class="sub-btn">确定</div>
        </el-form>
        
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Modal from "@/components/business/Modal";
import _request from "@/utils/request";
import constants from "@/utils/constants";
import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
import { checkCharacters, rightNumber } from "@/utils/rules";

export default {
  data() {
    return {
      schoolArr: [],
      order: {
        search: "",
      },
      dataList: [],
      cur: {
        page: 1,
        pagesize: 20,
      },
      load: false,
    };
  },
  mounted() {
    this.schoolData();
  },
  methods: {
    cancelFun() {
      this.initData();
    },
    marksureFun() {
      if (this.dataList.length) {
        const h = this.$createElement;
        const newData = [];
        newData.push(
          h(
            "div",
            { style: "color:#E9001D" },
            "*转校功能只针对学员账户基础信息进行转移，学院开课记录、学习进度、交易订单无法转移"
          )
        );
        newData.push(
          h(
            "div",
            { style: "color:#E9001D" },
            "*转校功能请谨慎使用！如无特殊情况请勿使用！"
          )
        );

        this.$confirm("您确认该学院转校吗？", "确认转校", {
          title: "确认转校",
          message: h("p", null, newData),
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            var getData = this.dataList;
            var pushData = [];
            getData.forEach((item) => {
              pushData.push({
                student_id: item.student_id,
                school_id: item.school_id,
              });
            });
            _request
              .http(this, "student/doTransferSchool", {
                transfer_school: pushData,
              })
              .then((res) => {
                if (res.code == 200) {
                  this.$message.success("转校成功");
                  this.initData();
                }
              });
          })
          .catch(() => {});
      } else {
        this.$message.error("请选择学生");
      }
    },
    schoolData() {
      _request.http(this, "schoolLists").then((res) => {
        this.schoolArr = res.data; //分类
      });
    },
    initData() {
      _request
        .http(
          this,
          "student/getStudentTransferSchoolList",
          this.order,
          this.cur
        )
        .then((res) => {
          this.dataList = res.data;
        });
    },
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", (data) => {
        this.showList = data;
        this.showAddBox = false;
      });
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
.changeSchool-warn {
  margin-top: 10px;
  margin-left: 20px;
  height: 15px;
  font-size: 14px;
  color: rgba(233, 0, 29, 1);
  line-height: 25px;
}
.mt-20 {
  margin-top: 60px;
  text-align: center;
}
.confirm-text {
  color: rgba(233, 0, 29, 1);
}
.clear-btn{
  display: inline-block;
  cursor: pointer;
  line-height: 45px;  
  border: 1px solid #DCDFE6;
  margin-right: 20px;
}
.sub-btn{  
  display: inline-block;
  cursor: pointer;
  line-height: 45px;  
}
</style>