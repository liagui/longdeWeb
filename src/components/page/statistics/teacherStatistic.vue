<template>
  <div class="container-box">
    <div v-if="showList">
      <div class="content-head">
        <span>
          <b>学员统计</b>
        </span>
      </div>
      <div class="type-list">
        <div class="typeName">查询条件：</div>
        <el-form :rules="rule" ref="payment" :inline="true">
          <el-select
            v-model="whereArr.school_id"
            placeholder="选择网校"
            @change="schoolChange"
          >
            <el-option
              v-for="(item, index) in schoolBranch"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-form-item>
            <el-input
              placeholder="手机号"
              v-model="whereArr.phone"
              prefix-icon="el-icon-search"
              @blur="phone"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="教师姓名"
              v-model="whereArr.real_name"
              prefix-icon="el-icon-search"
              @blur="realname"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 15px">
            <el-button type="primary" @click="selectWhere">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="type-list">
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
        </div>
        <el-form :inline="true">
          <el-form-item>
            <el-input
              placeholder="指定时间"
              v-model="whereArr.timer"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 15px">
            <el-button type="primary" @click="selectWhere">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content-cont">
        <div class="record phone">
          <nav>
            <p>总课程</p>
            <p>16课程</p>
          </nav>
          <img src="../../../assets/image/statistics/phone.png" alt="" />
        </div>
        <el-table
          :data="teacher"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
          :max-height="tableHeight"
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
            prop="times"
            label="课时"
            title="课时"
          ></el-table-column>
          <el-table-column prop="detailMsg" label="查看" title="查看">
            <template slot-scope="scope">
              <el-link type="primary" @click="teacherDetails(scope.row.id)"
                >详情</el-link
              >
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
  </div>
</template>
<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  data() {
    return {
      name: "",
      // 数据统计
      record: [{ phone: "手机端", userNum: 256, iconPath: "el-icon-mobile" }],
      //列表展示
      showList: true,
      tableHeight: null,
      schoolBranch: [],
      whereArr: {
        school_id: "",
        real_name: "",
        phone: "",
        time: 1,
      },
      subjectArr: [
        { id: 1, name: "今天" },
        { id: 2, name: "昨天" },
        { id: 3, name: "七天" },
        { id: 4, name: "当月" },
        { id: 5, name: "三个月" },
      ],
      selriqiIndex: 1,
      teacher: [],
      cur: {
        page: 1,
        pageSize: 20,
      },
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
      startpickerOptions: {
        disabledDate: (time) => {
          if (this.selectTimes[1]) {
            return time.getTime() > this.selectTimes[1];
          } else {
            return time.getTime() > new Date().getTime();
          }
        },
      },
      pickerOptions: {
        disabledDate: (time) => {
          if (this.selectTimes[0]) {
            return (
              time.getTime() < this.selectTimes[0] ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        },
      },
      selectTimes: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      _request
        .http(this, "statistics/TeacherList", this.whereArr, this.cur)
        .then((res) => {
          console.log(res);
          this.teacher = res.data;
          this.totalCount = res.page.total; //总条数
          this.cur.pageSize = parseInt(res.page.pageSize); //每页条数
          this.cur.page = res.page.page;
          this.nextPage = parseInt(res.page.page);
          this.schoolBranch = res.schoolList;
        });
    },
    //查询
    selectWhere() {
      this.initData();
    },
    //时间选择
    selriqi(val) {
      console.log(val.id);
      this.selriqiIndex = val.id;
      this.whereArr.time = val.id;
    },
    //网校下拉
    schoolChange(val) {
      this.whereArr.school_id = val;
    },
    //手机号输入
    phone(e) {
      this.whereArr.phone = e.target.value;
    },
    //用户名输入
    realname(e) {
      this.whereArr.real_name = e.target.value;
    },
    //課程詳情
    teacherDetails(val) {
      console.log(val);
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
  },
};
</script>
<style scoped lang="less">
.phone {
  background: url("../../../assets/image/statistics/blue.png") no-repeat 100%;
}
.record {
  display: flex;
  width: 240px;
  height: 100px;
  padding: 8px 28px;
  margin-right: 40px;
  margin-bottom: 30px;
  justify-content: space-between;
  align-items: center;
  color: white;
}
[class*=" el-icon-"],
[class^="el-icon-"] {
  font-size: 50px;
}
p {
  padding: 0;
  margin: 0;
  line-height: 40px;
}
from {
  display: flex;
}
.type-list {
  width: 100%;
  display: flex;
}
.typeItem {
  display: inline-block;
  margin: 0 2px 5px;
  padding: 0 10px;
  height: 28px;
  font-size: 14px;
  line-height: 28px;
  color: rgba(102, 102, 102, 1);
}
.typeName {
  float: left;
  margin-left: 25px;
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
.typeItem {
  display: inline-block;
  margin: 0 5px 5px;
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
  color: rgba(102, 102, 102, 1);
}
.typeActive {
  height: 28px;
  background: linear-gradient(
    90deg,
    rgba(38, 164, 253, 1),
    rgba(0, 142, 242, 1)
  );
  border-radius: 3px;
  font-size: 14px;
  color: rgba(254, 254, 254, 1);
}
</style>
