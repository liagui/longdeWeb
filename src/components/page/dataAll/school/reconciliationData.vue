<template>
  <div class="container-box">
    <div>
      <div class="content-head">
        <span>对账数据</span>
        <el-form :model="searchData" ref="order" :inline="true">
          <el-form-item v-if="schoolDisabled">
            <el-select
              v-model="searchData.school_id"
              style="width: 150px"
              placeholder="选择网校"
              clearable
              @change="select"
            >
              <el-option
                v-for="(item, index) in schoolArr"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-cascader
              style="width: 150px"
              v-model="searchData.subject_id"
              collapse-tags
              @change="getCourse"
              :options="subjectArr"
              clearable
              placeholder="选择所属学科"
              :props="{
                checkStrictly: true,
                value: 'id',
                label: 'name',
                children: 'childs',
                expandTrigger: 'hover',
              }"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="searchData.course_id"
              style="width: 150px"
              placeholder="课程"
              @change="select"
              clearable
            >
              <el-option
                v-for="(item, index) in lessionArr"
                :label="item.title"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-date-picker
            v-model="searchData.start_time"
            class="apply"
            style="width: 130px !important"
            type="date"
            placeholder="开始时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="select"
            :picker-options="startpickerOptions"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="searchData.end_time"
            class="apply"
            style="width: 130px !important"
            type="date"
            placeholder="结束时间"
            @change="select"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <el-form-item>
            <el-input
              placeholder="姓名/手机号"
              style="width: 200px"
              prefix-icon="el-icon-search"
              v-model="searchData.name"
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="exportFile">导出数据</el-button>
        </el-form>
      </div>
      <div class="content-cont">
        <el-table
          :data="datatList"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
        >
          <el-table-column
            prop="school_name"
            label="网校名称"
          ></el-table-column>
          <el-table-column prop="real_name" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column
            prop="course_title"
            label="课程名称"
          ></el-table-column>
          <el-table-column
            prop="course_subject_name"
            label="所属学科"
          ></el-table-column>
          <el-table-column prop="price" label="课程价格"></el-table-column>
          <el-table-column
            prop="lession_price"
            label="购买价格"
          ></el-table-column>
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
  </div>
</template>
<script>
import qs from "qs";
import global from "@/store/global";
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  data() {
    return {
      schoolArr: [],
      subjectArr: [],
      datatList: [],
      lessionArr: [],
      cur: {
        page: 1,
        pagesize: 20,
      },
      schoolDisabled: true,
      nextPage: 1,
      totalCount: 0,
      searchData: {
        school_id: "",
        subject_id: "",
        course_id: "",
        name: "",
        start_time: "",
        end_time: "",
      },
      timeout: null,
      load: false,
      paginationShow: true,
      startpickerOptions: {
        disabledDate: (time) => {
          if (this.searchData.end_time) {
            return (
              time.getTime() > new Date(this.searchData.end_time).getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        },
      },
      pickerOptions: {
        disabledDate: (time) => {
          if (this.searchData.start_time) {
            return (
              time.getTime() < new Date(this.searchData.start_time).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        },
      },
    };
  },
  created() {},
  mounted() {
    if (this.$route.query.schoolId == -1) {
      this.searchData.school_id = "";
      this.schoolDisabled = true;
    } else {
      this.searchData.school_id = this.$route.query.schoolId;
      this.schoolDisabled = false;
    }
    this.getSchoolList();
    // this.initData();
    this.getSubject();
  },
  methods: {
    exportFile() {
      let obj = Object.assign(this.searchData, this.cur);
      let paramStr = qs.stringify(obj);
      // console.log(global.ajaxurl);
      window.open(global.ajaxurl + "dashboard/orderExport?" + paramStr);
      // _request
      //   .http(this, "student/exportExcelStudentBankList", this.search, this.cur)
      //   .then((res) => {
      //     this.dataList = res.data;
      //     this.totalCount = res.data.total;
      //   });
    },

    getSchoolList() {
      _request.http(this, "schoolLists").then((res) => {
        this.schoolArr = res.data; //分类

        console.log(this.searchData.school_id);
      });
    },
    getSubject(val) {
      _request.http(this, "subject").then((res) => {
        if (res.code == 200) {
          this.subjectArr = res.data;
        }
      });
    },
    getCourse(val) {
      _request
        .http(this, "courseType", {
          parent_id: val,
          school_id: this.searchData.school_id,
        })
        .then((res) => {
          if (res.code == 200) {
            this.lessionArr = res.data;
          }
        });
      this.searchData.course_id = "";
      this.initData();
    },

    initData() {
      _request
        .http(this, "dashboard/orderlist", this.searchData, this.cur)
        .then((res) => {
          this.datatList = res.data.list; //數據
          this.totalCount = res.data.total; //总条数
        });
    },
    select() {
      console.log(this.searchData);
      this.cur.page = 1;
      this.initData();
      this.paginationShow = true;
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
    "searchData.name": {
      handler(newVal, oldVal) {
        if (!this.load) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.initData();
          this.load = false;
        }, 500);
      },
    },
  },
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
.primary {
  color: #1cc700;
}
.warning {
  color: #ff8a00;
}
.error {
  color: #ff0000;
}
.over {
  color: #d3daf1;
}
.apply {
  width: 150px;
}
.mb-10 {
  margin-bottom: 10px;
}
</style>
