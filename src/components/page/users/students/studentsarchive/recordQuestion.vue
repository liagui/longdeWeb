<template>
  <div class>
    <!-- <el-button type="primary">题库</el-button> -->
    <div class="bgSet">
      <div class="flex">
        <el-form>
          <el-select
            v-model="search.bank_id"
            class="select-width"
            placeholder="题库名称"
            clearable
            @change="changeBank"
          >
            <el-option
              v-for="(item, index) in bank_name"
              :key="index"
              :label="item.topic_name"
              :value="item.bank_id"
            ></el-option>
          </el-select>
          <el-select
            v-model="search.subject_id"
            class="select-width"
            placeholder="科目名称"
            clearable
            @change="change"
          >
            <el-option
              v-for="(item, index) in subject_name"
              :key="index"
              :label="item.subject_name"
              :value="item.subject_id"
            ></el-option>
          </el-select>
          <el-select
            v-model="search.type_id"
            class="select-width"
            placeholder="类型名称"
            clearable
            @change="change"
          >
            <el-option
              v-for="(item, index) in type_name"
              :key="index"
              :label="item.name"
              :value="item.type_id"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="search.start_time"
            class="apply"
            style="width: 130px !important"
            type="date"
            placeholder="开始时间"
            format="yyyy-MM-dd"
            @change="change"
            value-format="yyyy-MM-dd"
            :picker-options="startpickerOptions"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="search.end_time"
            class="apply"
            style="width: 130px !important"
            type="date"
            placeholder="结束时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="change"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form>
        <div class="exportList" @click="exportFile">导出列表</div>
      </div>

      <el-table
        :data="dataList"
        stripe
        border
        cell-class-name="center"
        header-cell-class-name="center"
      >
        <el-table-column prop="create_at" label="做题时间"></el-table-column>
        <el-table-column prop="bank_name" label="题库"></el-table-column>
        <el-table-column prop="subject_name" label="科目"></el-table-column>
        <el-table-column prop="papers_name" label="试卷名称"></el-table-column>
        <el-table-column prop="type_name" label="类型"></el-table-column>
        <el-table-column prop="doTitleCount" label="做题数"></el-table-column>
        <el-table-column prop="answer_score" label="得分"></el-table-column>
        <el-table-column prop="score_avg" label="正确率"></el-table-column>
        <el-table-column prop="error_count" label="错题数"></el-table-column>
        <el-table-column prop="number" label="操作">
          <template slot-scope="scope">
            <el-button @click="searchDetail(scope.row)" class="pagingBtn" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
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
import _request from "@/utils/request";
import global from "@/store/global";
export default {
  components: {},
  props: ["transdata"],
  data() {
    return {
      courseStatus: "zhibo",
      search: {
        bank_id: "",
        subject_id: "",
        type_id: "",
        start_time: "",
        end_time: "",
        student_id: this.transdata
      },
      courseArr: [
        { label: "aa", value: "333" },
        { label: "aa", value: "333" }
      ],
      isAuth: false,
      schoolBranch: [],
      showcate: false,
      showAddBox: false,

      tableHeight: null,
      dataList: [],
      subject_name: [],
      type_name: [],

      creatTimes: [],
      transId: "",
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      totalCount: 20,
      bank_name: [],

      load: false,
      startpickerOptions: {
        disabledDate: time => {
          if (this.search.end_time) {
            return time.getTime() > new Date(this.search.end_time).getTime();
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      },
      pickerOptions: {
        disabledDate: time => {
          if (this.search.start_time) {
            return (
              time.getTime() < new Date(this.search.start_time).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      }
    };
  },
  created() {
    this.initData();
    this.searchArr();
  },
  mounted() {},
  methods: {
    //做题记录详情
    searchDetail(row) {
      let param = {
        student_id: this.$route.query.archiveId, //学员id
        bank_id: row.bank_id, //题库id
        subject_id: row.subject_id, //科目id
        papers_id: row.new_papers_id, //试卷id
        type: row.ttype,
        papers_name: row.papers_name
      };
      let paramStr = qs.stringify(param);
      this.$router.push("/users/students/studentQuestion?" + paramStr);
    },
    searchArr() {
      _request.http(this, "student/getStudentBankSearchInfo").then(res => {
        if (res.code == 200) {
          this.bank_name = res.data.bank_name;
          this.type_name = res.data.type_name;
        }
      });
    },
    auditAcess(row) {
      console.log(row);
    },
    initData() {
      _request
        .http(this, "student/getStudentBankList", this.search, this.cur)
        .then(res => {
          this.dataList = res.data.list;
          this.totalCount = res.data.total;
        });
    },
    change() {
      this.initData();
    },
    changeBank() {
      _request
        .http(this, "question/getSubjectList", { bank_id: this.search.bank_id })
        .then(res => {
          this.subject_name = res.data;
          this.search.subject_id = "";
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
    exportFile() {
      let obj = Object.assign(this.search,{student_id:this.$route.query.archiveId});
      let param = {};
      for(var i in obj){
        if(obj[i]){
          param[i] = obj[i]
        }
      }
      
      let paramStr = qs.stringify(param);
      console.log(paramStr)
      window.open(
        global.ajaxurl + "student/exportExcelStudentBankList?" + paramStr
      );
      // _request
      //   .http(this, "student/exportExcelStudentBankList", {student_id:21})
      //   .then((res) => {
      //     window.open(res.data)
      //     debugger
      //   });
    }
  },
  watch: {
    // "order.search": {
    //   handler(newVal, oldVal) {
    //     let timeout;
    //     if (this.load) {
    //       clearTimeout(timeout);
    //     }
    //     timeout = setTimeout(() => {
    //       this.initData();
    //       this.load = false;
    //     }, 500);
    //   },
    // },
  }
};
</script>

<style scoped lang="less">
.bgSet {
  background: #fff;
  padding: 20px 40px;
}
.learnText {
  border-left: 4px solid #26a4fd;
  height: 16px;
  line-height: 18px;
  font-size: 16px;
  font-weight: bold;
  color: #343434;
  margin: 30px 0 20px;
  padding-left: 10px;
}
.select-width {
  width: 200px;
  margin-bottom: 10px;
}
.flex {
  display: flex;
  justify-content: space-between;
}
.exportList {
  width: 94px;
  height: 32px;
  line-height: 32px;
  background: #d9ebff;
  border: 1px solid #26a4fd;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #0095fe;
  cursor: pointer;
}
</style>