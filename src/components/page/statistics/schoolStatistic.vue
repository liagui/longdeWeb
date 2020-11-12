<template>
  <div class="container-box">
    <div v-if="showList" class="">
      <!-- <div class="content-top">学员统计</div> -->
      <div class="content-head">
        <div class="type-list">
          <el-row>
            <div class="typeName">查询条件：</div>
            <el-select
              clearable
              v-model="whereArr.school_id"
              style="width: 150px"
              placeholder="选择网校"
              @change="select"
            >
              <el-option
                v-for="(item, index) in schoolBranch"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
            <el-select
              clearable
              v-model="whereArr.source"
              style="width: 150px"
              placeholder="选择来源"
              @change="select"
            >
              <el-option
                v-for="(item, index) in sourceBranch"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
            <el-select
              v-model="whereArr.enroll_status"
              style="width: 150px"
              placeholder="选择用户类型"
              @change="select"
            >
              <el-option
                v-for="(item, index) in typeBranch"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
            <el-input
              style="width: 180px"
              placeholder="手机号"
              v-model="whereArr.phone"
              prefix-icon="el-icon-search"
            ></el-input>
            <el-input
              style="width: 180px"
              placeholder="用户名"
              v-model="whereArr.real_name"
              prefix-icon="el-icon-search"
            ></el-input>
            <el-button type="primary" @click="selectWhere">查询</el-button>
          </el-row>
          <el-row style="margin-top: 10px">
            <div class="typeName">
              日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期：
            </div>
            <div class="typeList">
              <div
                class="typeItem"
                v-for="(item, index) in subjectArr"
                @click="selriqi(item)"
                :class="{ typeActive: selriqiIndex == item.id }"
                :key="index"
              >
                {{ item.name }}
              </div>
              <el-date-picker
                v-if="showSelTime"
                v-model="whereArr.timeRange"
                type="daterange"
                style="width: 280px !important"
                format="yyyy-MM-dd"
                value-format="timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="selTimeRang"
              ></el-date-picker>
            </div>
          </el-row>
        </div>
      </div>

      <div class="type-list">
        <div class="list-type">
          <el-button type="broken" @click="listshou">统计表</el-button>
          <el-button class="broken" @click="brokenshou">趋势表</el-button>
        </div>
      </div>

      <div class="listdiv">
        <Statistics :userNum="userNum"></Statistics>
        <!--统计表-->
        <div class="content-cont">
          <el-table
            :data="student"
            stripe
            border
            cell-class-name="center"
            header-cell-class-name="center"
          >
            <el-table-column
              prop="name"
              label="所属网校"
              title="所属网校"
            ></el-table-column>
            <el-table-column
              prop="phone"
              label="手机号"
              title="手机号"
            ></el-table-column>
            <el-table-column
              prop="real_name"
              label="姓名"
              title="姓名"
            ></el-table-column>
            <el-table-column
              prop="create_at"
              label="注册时间"
              title="注册时间"
            ></el-table-column>
            <el-table-column
              prop="enroll_status"
              label="用户类型"
              title="用户类型"
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.enroll_status == 1">收费用户</el-tag>
                <el-tag v-if="scope.row.enroll_status == 0">普通用户</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reg_source" label="来源" title="来源">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.reg_source == 0">官网注册</el-tag>
                <el-tag v-if="scope.row.reg_source == 1">手机端</el-tag>
                <el-tag v-if="scope.row.reg_source == 2">线下用户</el-tag>
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
            :page-size="cur.pageSize"
            :total="totalCount"
            :current-page="nextPage"
            layout="total, sizes, prev, pager, next, jumper,slot"
          >
            <el-button class="pagingBtn" size="small">确认</el-button>
          </el-pagination>
        </div>
      </div>
      <div class="brokendiv">
        <!-- 折线图-->
        <div
          id="echartBox"
          ref="echartBox"
          style="width: 600px; height: 400px"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import Statistics from "../../page/statistics/Statistics";
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
// 引入 ECharts 主模块
import echarts from "echarts";

export default {
  data() {
    return {
      userNum: {},
      //列表展示
      showList: true,
      tableHeight: null,
      schoolBranch: [],
      sourceBranch: [
        { label: "官网注册", value: "0" },
        { label: "手机端", value: "1" },
        { label: "线下录入", value: "2" },
      ],
      typeBranch: [
        { label: "普通用户", value: "0" },
        { label: "收费用户", value: "1" },
      ],
      whereArr: {
        school_id: "",
        reg_source: "",
        enroll_status: "",
        real_name: "",
        phone: "",
        type: "",
        source: "",
        time: 1,
        timeRange: "",
      },
      subjectArr: [
        { id: 1, name: "今天" },
        { id: 2, name: "昨天" },
        { id: 3, name: "七天" },
        { id: 4, name: "当月" },
        { id: 5, name: "三个月" },
        { id: 6, name: "指定时间" },
      ],
      showSelTime: false,
      selriqiIndex: 1,
      student: [],
      cur: {
        page: 1,
        pageSize: 20,
      },
      load: false,
      nextPage: 1,
      totalCount: 20,
      orderInfos: [],
      paginationShow: true,
      rule: {
        payNo: [
          {
            validator: onlyInputNumber,
            trigger: "blur",
          },
        ],
      },
      selectTimes: [],
      isShow: true,
      xlen: [],
      ylen: [],
    };
  },
  created() {
    this.$nextTick(() => {
      this.initData();
    });
  },
  methods: {
    drawEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("echartBox"));
      // 绘制图表
      myChart.setOption({
        tooltip: {},
        xAxis: {
          data: this.xlen,
        },
        yAxis: {},
        series: [
          {
            type: "line",
            name: "销量",
            data: this.ylen,
          },
        ],
      });
    },
    initData() {
      _request
        .http(this, "statistics/StudentList", this.whereArr, this.cur)
        .then((res) => {
          if (this.whereArr.type == 1) {
            this.student = res.data;
            this.totalCount = res.page.total; //总条数
            this.nextPage = parseInt(res.page.page); //总条数
          } else {
            this.xlen = res.data.xlen;
            this.ylen = res.data.ylen;
          }
          if (!this.schoolBranch.length) {
            this.schoolBranch = res.schoolList;
          }
          this.userNum = res.studentcount;
          console.log(this.userNum);
          // this.xlen = res.data.xlen;
          // this.ylen = res.data.ylen;
          this.drawEcharts();
        });
    },
    //统计查询切换
    listshou() {
      $(".listdiv").show();
      $(".brokendiv").hide();
      this.whereArr.type = 1;
      this.initData();
    },
    brokenshou() {
      $(".listdiv").hide();
      $(".brokendiv").show();
      this.whereArr.type = 2;
      this.initData();
    },
    //查询
    selectWhere() {
      this.initData();
    },
    //时间选择
    selriqi(val) {
      this.selriqiIndex = val.id;
      if (val.id == 6) {
        this.showSelTime = !this.showSelTime;
        this.whereArr.time = 0;
      } else {
        this.whereArr.timeRange = [];
        this.whereArr.time = val.id;
        this.select();
      }
    },
    selTimeRang(val) {
      this.whereArr.timeRange[1] = Number(val[1] + 24 * 60 * 60 * 1000 - 1);
      this.select();
    },
    select() {
      this.paginationShow = false;
      this.cur.page = 1;
      this.$nextTick(() => {
        this.initData();
      });
    },
    //网校下拉
    schoolChange(val) {
      this.whereArr.school_id = val;
    },
    //来源下拉
    sourceChange(val) {
      this.whereArr.source = val;
    },
    //分类下拉
    typeChange(val) {
      this.whereArr.type = val;
    },
    //手机号输入
    phone(e) {
      this.whereArr.phone = e.target.value;
    },

    //每页
    handleSizeChange(val) {
      this.cur.pageSize = val;
      this.initData();
    },
    //第几页
    handleCurrentChange(val) {
      this.cur.page = val;
      this.initData();
    },
  },
  watch: {
    "whereArr.phone": {
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
    "whereArr.real_name": {
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
  components: {
    Statistics,
  },
};
</script>
<style scoped lang="less">
.schoolStatistic {
  padding-top: 1px;
  padding-bottom: 20px;
  margin: 0 25px;
  // background: rgba(255, 255, 255, 1);
  // box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  // border-radius: 6px;
}
.typeItem {
  display: inline-block;
  padding: 0 10px;
  height: 32px;
  font-size: 14px;
  line-height: 32px;
  color: rgba(102, 102, 102, 1);
}
.content-top {
  line-height: 18px;
  font-size: 18px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  padding-left: 10px;
  border-left: 4px solid rgba(36, 163, 252, 1);
  margin: 20px;
}
.border-top {
  border-top: 1px solid rgba(242, 242, 242, 1);
  padding-top: 20px;
}
.type-list {
  font-size: 14px;
}
.typeName {
  float: left;
  height: 32px;
  line-height: 32px;
}
.list-type {
  border-top: 1px solid rgba(242, 242, 242, 1);
  margin: 20px 25px 10px;
}
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
.listdiv {
  margin-top: 20px;
  min-height: 400px;
}
.brokendiv {
  display: none;
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
.diaHead {
  height: 36px;
  font-size: 15px;
  color: rgba(136, 136, 136, 1);
  line-height: 36px;
  text-align: center;
  margin-top: 20px;
}
.diaCont {
  font-size: 17px;
  color: rgba(85, 85, 85, 1);
  line-height: 36px;
  text-align: center;
  margin-bottom: 20px;
}
.typeActive {
  background: linear-gradient(
    90deg,
    rgba(38, 164, 253, 1),
    rgba(0, 142, 242, 1)
  );
  border-radius: 3px;
  font-size: 14px;
  color: rgba(254, 254, 254, 1);
}
.mb-20 {
  margin-top: 5px;
  margin-bottom: 20px;
}
</style>
