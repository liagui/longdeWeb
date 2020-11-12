<template>
  <div class="courses-stock">
    <el-dialog
      class="courses-stock-dialog"
      title="批量添加库存"
      :close-on-click-modal="false"
      :visible.sync="showStockbatch"
      width="1000px"
      :append-to-body="true"
      @close="close()"
    >
      <el-table
        ref="stockTable"
        :data="dataList"
        border
        stripe
        max-height="550px"
        class="table-top-border"
      >
        <el-table-column
          prop="title"
          label="授权课程"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="parent_name"
          label="学科"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="child_name"
          label="小类"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="surplus"
          label="剩余库存"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="add_number"
          label-class-name="tab-tit"
          label="库存"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.add_number" @input="inputNumber(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="add_number"
          label-class-name="tab-tit"
          label="价格合计"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.sum_number" disabled></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button class="clear-btn" @click="close()">取 消</el-button>
        <el-button type="primary" class="sub-btn" @click="submit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _request from "@/utils/request";
import formatDate from "@/filters";
export default {
  props: ["transData", "showCoursesStockbatch"],
  data() {
    return {
      dataList: [],
      addInput: "",
      addStatus: true,
      showStockbatch: false,
    };
  },
  mounted() {
    this.initData();
    this.showStockbatch = this.showCoursesStockbatch;
  },
  methods: {
    inputNumber(item){
       item.sum_number = Number(item.add_number) *Number(item.nature_price);
    },
    initData() {
      _request
        .http(this, "school/getLessonList", {
          school_id: this.transData.school_id,
          subjectOne: 0,
          subjectTwo: 0,
          gettotal: 1,
          nature: 2,
        })
        .then((res) => {
          var data = res.data;
          for (var i in data) {
            data[i]["add_number"] = "";
          }
          this.dataList = data;
        });
    },
    close() {
      this.$emit("close");
    },
    submit() {
      var data = this.dataList;
      let course_id = [],
        add_number = [],
        sum_number = [];
      for (let i=0;i< data.length;i++) {        
        if (data[i]['add_number'] != 0) {
          // debugger
          course_id.push(data[i]["id"]);
          add_number.push(Number(data[i]["add_number"]));
          sum_number.push(Number(data[i]["sum_number"]));
        }
      } 
      let params = {
        course_id: course_id.join(","),
        schoolid: this.transData.school_id,
        add_number: add_number.join(","),
        moneys:sum_number.join(",")
      };
      _request
        .http(this, "dashboard/course/addMultiStocks", params)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "success",
            });
            this.$emit("marksure");

            // this.$router.go(0)
          }
        });
    },
  },
};
</script>
<style lang="less">
.courses-stock-dialog {
  .add-btn {
    padding: 15px 0;
    width: 100%;
    // display: flex;
    // justify-content: center;
    // margin: 40px 0;
  }
}
</style>
<style lang="less" scoped></style>
