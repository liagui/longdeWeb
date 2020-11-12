<template>
  <div class="container-box">
    <div v-if="showList">
      <div class="content-head">
        <span>
          <b>学员统计</b>
        </span>
      </div>
      <div class="type-list">
        <div class="typeName">筛选条件：</div>
        <el-form :rules="rule" ref="payment" :inline="true">
          <el-select
            v-model="whereArr.school_id"
            placeholder="学科"
            @change="schoolChange"
          >
            <el-option
              v-for="(item, index) in schoolBranch"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-select
            v-model="whereArr.source"
            placeholder="学科小类"
            @change="sourceChange"
          >
            <el-option
              v-for="(item, index) in sourceBranch"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-form-item>
            <el-input
              placeholder="课程名称"
              v-model="whereArr.phone"
              prefix-icon="el-icon-search"
              @blur="phone"
            ></el-input>
          </el-form-item>
          <el-select
            v-model="whereArr.type"
            placeholder="全部单元"
            @change="typeChange"
          >
            <el-option
              v-for="(item, index) in typeBranch"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-select
            v-model="whereArr.type"
            placeholder="全部课次"
            @change="typeChange"
          >
            <el-option
              v-for="(item, index) in typeBranch"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form>
      </div>
      <div class="type-list">
        <div class="typeName">
          日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期：
        </div>
      </div>
      <div class="content-cont">
        <el-table
          :data="student"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
          :max-height="tableHeight"
        >
          <el-table-column
            prop="name"
            label="学科"
            title="学科"
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="学科小类"
            title="学科小类"
          ></el-table-column>
          <el-table-column
            prop="real_name"
            label="课程"
            title="课程"
          ></el-table-column>
          <el-table-column
            prop="create_at"
            label="单元"
            title="单元"
          ></el-table-column>
          <el-table-column
            prop="create_at"
            label="课次"
            title="课次"
          ></el-table-column>
          <el-table-column
            prop="create_at"
            label="课次"
            title="课次"
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
      //列表展示
      showList: true,
      tableHeight: null,
      student: [],
      schoolBranch: [],
      sourceBranch: [],
      typeBranch: [],
      subjectArr: [],
      data: [],

      whereArr: {
        school_id: "",
        reg_source: "",
        enroll_status: "",
        real_name: "",
        phone: "",
        type: "",
        source: "",
        time: "",
      },
      cur: {
        page: 1,
        pageSize: 20,
      },
      nextPage: 1,
      totalCount: 20,
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
        .http(this, "statistics/StudentList", this.whereArr, this.cur)
        .then((res) => {
          console.log(res);
          // this.nextPage = parseInt(res.data.page.page);
        });
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
    typeChange() {},
    sourceChange() {},
    schoolChange() {},
    phone() {},
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
