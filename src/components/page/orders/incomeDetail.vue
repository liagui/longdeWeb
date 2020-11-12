<template>
  <div class="container-box">
    <div v-if="showList">
      <div class="content-head">
        <span>收入详情</span>
        <el-form :model="whereArr" ref="order" :inline="true">
          <el-cascader
            style="width:150px;"
            v-model="whereArr.subject_id"
            collapse-tags
            @change='select'
            :options="subjectArr"
            clearable
            placeholder="选择所属学科"
            :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
          ></el-cascader>
          <el-form-item>
            <el-select
              v-model="whereArr.course_id"
              style="width:150px;"
              collapse-tags
              clearable
              placeholder="课程"
              :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
            >
              <el-option
                v-for="(item, index) in courseArr"
                :label="item.title"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-date-picker
            v-model="whereArr.start_time"
            class="apply"
            style="width:130px !important;"
            type="date"
            placeholder="开始时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="startpickerOptions"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="whereArr.end_time"
            class="apply"
            style="width:130px !important;"
            type="date"
            placeholder="结束时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <el-form-item>
            <el-input
              placeholder="姓名/手机号"
              style="width:200px"
              prefix-icon="el-icon-search"
              v-model="whereArr.name"
              @blur="searchArticle"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="selectOrder">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content-cont">
        <el-table
          :data="orderInfos"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
          :max-height="tableHeight"
        >
          <el-table-column prop="real_name" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="course_title" label="课程名称"></el-table-column>
          <el-table-column prop="course_subject_name" label="所属学科"></el-table-column>
          <el-table-column prop="lession_price" label="课程价格"></el-table-column>
          <el-table-column prop="price" label="购买价格"></el-table-column>
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
  </div>
</template>
<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  data() {
    return {
      paginationShow:true,
      //详情弹框
      showList: true,
      tableHeight: null,
      subjectArr:[],
      orderInfos: [],
      courseArr: [],
      cur: {
        page: 1,
        pageSize: 20
      },
      nextPage: 1,
      totalCount: 20,
      whereArr: {
        subject_id: "", //学科
        course_id: "", //课程id
        start_time: "",  //开始时间
        end_time: "", //结束时间
        name:'', //搜索字段
        school_id:window.localStorage.getItem('school_id'), //学校id
      },
      startpickerOptions: {
        disabledDate: time => {
          if (this.whereArr.end_time) {
            return time.getTime() > new Date(this.whereArr.end_time).getTime() ;
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      },
      pickerOptions: {
        disabledDate: time => {
          if (this.whereArr.state_time) {
            return (
              time.getTime() < new Date(this.whereArr.state_time).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      },
    };
  },
  created() {
    // this.initData();
    this.getCascader();
  },
  methods: {
    // 学科列表
    getCascader() {
      _request.http(this, "subject").then(res => {
        this.subjectArr = res.data;
      });
    },
    initData() {
      console.log(this.whereArr);
      _request
        .http(this, "dashboard/orderlist", this.whereArr, this.cur)
        .then(res => {
          if(res.code == 200){
            this.orderInfos = res.data.list; //数据
            this.totalCount = res.data.total; //总条数
          }
        });
    },
    //查询课程
    select(val) {
      _request
          .http(this, "courseType", {
            parent_id: val,
            school_id: this.$store.state.userInfo.school_id,
          })
          .then((res) => {
            if (res.code == 200) {
              this.courseArr= res.data;
            }
          });
      this.whereArr.course_id = "";
    },
    selectOrder(){
      this.initData();
      this.paginationShow = true;
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
    //輸入框改變事件
    searchArticle(e) {
      this.whereArr.name = e.target.value;
    },
  },
  mounted() {
    if (document.body.clientWidth >= 1250) {
      this.tableHeight = parseInt(document.body.clientHeight) - 270 + "px";
      window.onresize = () => {
        this.$nextTick(() => {
          this.tableHeight = parseInt(document.body.clientHeight) - 270 + "px";
        });
      };
    } else {
      this.tableHeight = parseInt(document.body.clientHeight) - 270 + "px";
      window.onresize = () => {
        this.$nextTick(() => {
          this.tableHeight = parseInt(document.body.clientHeight) - 270 + "px";
        });
      };
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
