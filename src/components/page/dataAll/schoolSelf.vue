<template>
  <div class="container-box">
    <div class="clearfix detail">
      <div class="detail-head">
        <!-- <img :src="schoolData.logo" class="detail-img" alt />
        <div class="wangxiao-box">
          <div class="wangxiao-name">
            {{ schoolData.name }}
            <a
              href="schoolData.dns"
              target="_blank"
              rel="nofollow"
              class="website"
            >{{ schoolData.dns }}</a>
          </div>

          <div>
            <div class="componet">网校介绍：</div>
            <div class="componnet-text">{{ schoolData.introduce }}</div>
          </div>
        </div>
        <div class="edit-detail">
          <img @click="editInfo()" src="../../../assets/image/edit.png" alt />
        </div> -->
        <el-row class="">
          <el-col :span="4" :offset="4">
            <img
              src="../../../assets/image/school/zaishou.png"
              alt=""
              class="iconImg"
            />
            停售</el-col
          >
          <el-col :span="4">
            <img
              src="../../../assets/image/school/tingshou.png"
              alt=""
              class="iconImg"
            />
            在售</el-col
          >
          <el-col :span="4" :offset="4">
            <img
              src="../../../assets/image/school/zaishou.png"
              alt=""
              class="iconImg"
            />停售</el-col
          >
          <el-col :span="4"
            ><img
              src="../../../assets/image/school/tingshou.png"
              alt=""
              class="iconImg"
            />在售</el-col
          >
        </el-row>
        <el-row class="rowHeight">
          <el-col :span="4"> 授权课程 </el-col>
          <el-col :span="4" class="pl">
            {{ showData.give.hidden.total }}
          </el-col>
          <el-col :span="4" class="pl">
            {{ showData.give.normal.total }}
          </el-col>
          <el-col :span="4"> 自增课程 </el-col>
          <el-col :span="4" class="pl">
            {{ showData.school.hidden.total }}
          </el-col>
          <el-col :span="4" class="pl">
            {{ showData.school.normal.total }}
          </el-col>
        </el-row>
        <el-row class="rowHeight">
          <el-col :span="4">库存数量</el-col>
          <el-col :span="4" class="pl">{{
            showData.give.hidden.stocks
          }}</el-col>
          <el-col :span="4" class="pl">{{
            showData.give.normal.stocks
          }}</el-col>
          <el-col :span="4">售出量</el-col>
          <el-col :span="4" class="pl">{{
            showData.school.hidden.used_stocks
          }}</el-col>
          <el-col :span="4" class="pl">
            {{ showData.school.normal.used_stocks }}</el-col
          >
        </el-row>
        <el-row class="rowHeight">
          <el-col :span="4">现有库存 </el-col>
          <el-col :span="4" class="pl">{{
            showData.give.hidden.surplus_stocks
          }}</el-col>
          <el-col :span="4" class="pl">{{
            showData.give.normal.surplus_stocks
          }}</el-col>
        </el-row>
        <el-row class="rowHeight">
          <el-col :span="4">售出量</el-col>
          <el-col :span="4" class="pl">{{
            showData.give.hidden.used_stocks
          }}</el-col>
          <el-col :span="4" class="pl">{{
            showData.give.normal.used_stocks
          }}</el-col>
        </el-row>
      </div>
      <div class="self-content">
        <!-- <div class="header">
          <div class="headText">课程列表</div>
          <el-button type="primary" class="updateRevoke" @click="addCourseStock"
            >批量添加库存</el-button
          >
          <el-button type="primary" class="addCourse" @click="addCourse()"
            >课程授权</el-button
          >
        </div> -->
        <!-- <courses-list :trandSchoolId="schoolId"></courses-list> -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="课程列表" name="kecheng">
            <courses-list :trandSchoolId="schoolId"></courses-list>
          </el-tab-pane>
          <el-tab-pane label="公开课列表" name="gongkaike">
            <open-course :trandSchoolId="schoolId"></open-course>
          </el-tab-pane>
          <!-- <el-tab-pane label="讲师列表" name="jiangshi">
            <div class="teachers-box clearfix">
              <div
                class="teachers"
                v-for="(item, index) in jiangshiArr"
                :key="index"
              >
                <div class="teacher-title">{{ item.school_status }}</div>
                <img :src="item.head_icon" class="teacher-img" alt />
                <div class="teacher-name">{{ item.real_name }}</div>
                <div class="teacher-introduce">{{ item.describe }}</div>
              </div>
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
    <edit-info
      v-if="showEditInfo"
      :showEditInfo="showEditInfo"
      :schoolId="schoolId"
      @clearFun="clearFun"
      @marksureFun="marksureFun"
    ></edit-info>
    <!-- 授权 -->
    <course-auth
      v-if="showCoursesAuth"
      :showCoursesAuth="showCoursesAuth"
      @marksure="marksureFun"
      @close="clearFun"
      :transDataAuth="transDataAuth"
    ></course-auth>
    <!-- 批量添加库存 -->
    <courses-stockbatch
      v-if="showCoursesStockbatch"
      :showCoursesStockbatch="showCoursesStockbatch"
      @marksure="marksureFun"
      @close="clearFun"
      :transData="stockData"
    ></courses-stockbatch>
  </div>
</template>
<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
import editInfo from "./school/editInfo";
import coursesList from "./coursesList";
import courseAuth from "./coursesAuth";
import coursesStockbatch from "./school/coursesStockbatch";
import OpenCourse from "./coursesListOpenCourse";
export default {
  components: {
    editInfo,
    coursesList,
    OpenCourse,
    courseAuth,
    coursesStockbatch,
  },
  data() {
    return {
      showCoursesAuth: false,
      transDataAuth: {
        school_id: "",
      },
      stockData:{
        school_id:'',
      },
      showData: {
        give:{
          hidden:{},
          noraml:{}
        },
        school:{
          hidden:{},
          normal:{},
        }
      },
      lessonId: "",
      schoolPid: localStorage.getItem("school_id"),
      showEditInfo: false,
      showCoursesAuth: false,
      showCoursesStockbatch: false,
      showOpenCoursesAuth: false,

      schoolData: {
        name: "",
        dns: "",
        logo: "",
        introduce: "",
      },
      activeName: "kecheng",
      inputVisible: false,
      jiangshiArr: [],
      kechengArr: [],
      payment: {},
      payInfos: [],
      selectIds: Number,
      paginationShow: true,
      cur: {
        pageNumber: 1,
        pageSize: 20,
      },
      nextPage: 1,
      totalCount: 20,
      addData: {
        sex: "1",
      },
      rule: {
        // userNameOrPhoneNo: [{ validator: checkCharacters, trigger: "blur" }],
        payNo: [
          {
            validator: onlyInputNumber,
            trigger: "blur",
          },
        ],
      },
      searchData: {},
      schoolId: "",
    };
  },
  created() {
    this.schoolId = this.$route.query.schoolId;
    this.$nextTick(() => {
      this.initData();
    });
  },  
  methods: {
    // 添加库存
    addCourseStock() {
      console.log('kucun')
      this.stockData.school_id = this.schoolId;
      this.showCoursesStockbatch = true;
    },
    // 添加授权
    addCourse() {
      console.log('shouquan')
      // this.schoolSelf.showCoursesAuth = true
      this.transDataAuth.school_id = this.schoolId;
      this.showCoursesAuth = true;
    },

    updateRevoke() {
      _request
        .http(this, "courschool/authorUpdate", {
          is_public: 0,
          school_id: this.schoolId,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getSubjectList();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    editInfo() {
      this.showEditInfo = true;
    },
    clearFun() {
      this.showEditInfo = false;
      this.showCoursesAuth = false;
      this.showCoursesStockbatch = false;
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    marksureFun() {
      this.showEditInfo = false;
      this.showCoursesAuth = false;
      this.showCoursesStockbatch = false;
      this.initData();
    },
    initData() {
      _request
        .http(this, "dashboard/course/detailStocks", {
          schoolid: this.schoolId,
        })
        .then((res) => {
          this.showData = res.data;
        });
    },

    select() {
      this.$refs.payment.validate((valid) => {
        if (valid) {
          this.paginationShow = false;
          this.cur.pageNumber = 1;
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
      this.cur.pageSize = val;
      this.initData();
    },
    //第几页
    handleCurrentChange(val) {
      this.cur.pageNumber = val;
      this.initData();
    },
  },
};
</script>
<style scoped lang="less">
.detail {
  .detail-head {
    background: #fff;
    height: 240px;
    padding: 25px;
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
    font-size: 16px;
    border-radius: 6px;
    .iconImg {
      width: 25px;
      height: 25px;
      vertical-align: bottom;
      margin-right: 4px;
    }
    .rowHeight {
      height: 14px;
      line-height: 14px;
      margin-top: 26px;
    }
    .pl {
      padding-left: 30px;
    }
    .edit-detail {
      position: absolute;
      right: 40px;
      top: 40px;
      width: 23px;
      height: 23px;
    }
  }
  .detail-img {
    float: left;
    width: 170px;
    height: 170px;
    margin-right: 40px;
  }
  .wangxiao-box {
    display: inline-block;
    width: calc(100% - 220px);
    .wangxiao-name {
      height: 20px;
      font-size: 20px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 40px;
    }
    .website {
      position: relative;
      top: -2px;
      margin-left: 40px;
      font-size: 16px;
      font-weight: normal;
      text-decoration: underline;
      color: rgba(255, 85, 29, 1);
    }
    .componet {
      float: left;
      font-size: 14px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
    .componnet-text {
      display: inline-block;
      width: calc(100% - 80px);
      font-size: 14px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }
}
.self-content {
  margin-top: 20px;
  padding-top: 20px;
  background: #fff;
  .header {
    position: relative;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
    .headText {
      display: inline-block;
      width: 80px;
      font-size: 18px;
      font-weight: 500;
      color: #018ef2;
      line-height: 18px;
      padding-bottom: 15px;
      border-bottom: 4px solid #018ef2;
    }
  }
  .addCourse {
    float: right;
    margin-right: 20px;
  }
  .updateRevoke {
    float: right;
    margin-right: 20px;
  }
}
/deep/ .el-tabs__nav-scroll {
  margin-left: 20px;
}
/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
  background-color: #e0e0e0;
  z-index: 1;
}
.el-icon-circle-plus {
  color: #b8b8b8;
  width: 70px;
  height: 70px;
}
</style>
