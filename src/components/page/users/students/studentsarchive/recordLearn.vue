<template>
  <div class="">
    <div class="bgSet">
      <el-radio-group v-model="courseStatus" style="margin-bottom: 15px">
        <el-radio-button label="zhibo">直播</el-radio-button>
        <el-radio-button label="lubo">录播</el-radio-button>
      </el-radio-group>
      <el-table
        :data="dataList"
        stripe
        border
        cell-class-name="center"
        header-cell-class-name="center"
      >
        <el-table-column prop="real_name" label="课程名称"></el-table-column>
        <el-table-column prop="phone" label="报名时间"></el-table-column>
        <el-table-column label="学习进度">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.id"></el-progress>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="learnText">学习记录</div>
    <div class="bgSet">
      <div class="flex">
        <el-form>
          <el-select
            v-model="search.courseId"
            class="select-width"
            placeholder="全部课程"
            clearable
          >
            <el-option
              v-for="(item, index) in courseArr"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form>
        <div class="exportList">导出列表</div>
      </div>

      <el-table
        :data="dataList"
        stripe
        border
        cell-class-name="center"
        header-cell-class-name="center"
      >
        <el-table-column prop="real_name" label="课程名称"></el-table-column>
        <el-table-column prop="phone" label="课次名称"></el-table-column>
        <el-table-column prop="number" label="教学形式"> </el-table-column>
        <el-table-column label="最后上课时间">
          <!-- <template slot-scope="scope">
              
            </template> -->
        </el-table-column>
        <el-table-column prop="number" label="完成情况"> </el-table-column>
        <el-table-column prop="number" label="最长上课时间"> </el-table-column>
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
import _request from "@/utils/request";
export default {
  components: {},
  data() {
    return {
      courseStatus: "zhibo",
      search: {
        courseId: "",
      },
      courseArr: [
        { label: "aa", value: "333" },
        { label: "aa", value: "333" },
      ],
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

      creatTimes: [],
      transId: "",
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20,
      },
      nextPage: 1,
      totalCount: 20,

      load: false,
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
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
      // _request
      //   .http(this, "student/getStudentStudyList", this.order, this.cur)
      //   .then((res) => {
      //     this.dataList = res.data.teacher_list;
      //     this.totalCount = res.data.total;
      //   });
    },
    marksureFun() {
      this.initData();
    },
    closeCom() {},

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
  },
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