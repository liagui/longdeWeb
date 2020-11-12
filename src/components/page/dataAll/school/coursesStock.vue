<template>
  <div class="courses-stock">
    <el-dialog
      class="courses-stock-dialog"
      title="添加库存"
      :close-on-click-modal="false"
      :visible.sync="CoursesStock"
      width="773px"
      :append-to-body="true"
      @close="close()"
    >
      <el-table
        ref="stockTable"
        :data="schoolSelf.stockList"
        border
        stripe
        :summary-method="getSummaries"
        show-summary
        max-height="500px"
        class="table-top-border"
      >
        <el-table-column label-class-name="tab-tit" label="日期" min-width="100" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.create_at != 'add'">
              {{
              scope.row.create_at
              }}
            </span>
            <span v-else>——</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="current_number"
          label-class-name="tab-tit"
          label="剩余库存"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.current_number != 'add'">
              {{
              scope.row.current_number
              }}
            </span>
            <span v-else>——</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="add_number"
          label-class-name="tab-tit"
          label="库存"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.add_number != 'add'">
              {{
              scope.row.add_number
              }}
            </span>
            <el-input v-else v-model="addInput"></el-input>
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
            <span v-if="scope.row.add_number != 'add'">
              {{
              scope.row.add_number
              }}
            </span>
            <el-input v-else disabled v-model="sumInput"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <div v-if="addStatus" class="add">
          <el-button type="primary" class="add-btn" @click="add">添加库存</el-button>
        </div>
        <div v-else>
          <el-button class="clear-btn" @click="close()">取 消</el-button>
          <el-button type="primary" class="sub-btn" @click="submit">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _request from "@/utils/request";
import formatDate from "@/filters";
export default {
  // inject: ["schoolSelf"],
  props:['transData','showCoursesStock'],
  data() {
    return {
      addInput: "",
      sumInput: "",
      addStatus: true,
      schoolSelf:{
        residue_number:'',
        sum_current_number:'',
        residue_number:'',
        stockList:[],
        defalutStockList:[],
        lessonId:'',
      },
      CoursesStock: false,

    };
  },
  watch:{
    addInput(val){
      this.sumInput = Number(val)*Number(this.transData.price)
    },
  },
  mounted() {
    this.CoursesStock = this.showCoursesStock;
    console.log('transData.school_id:'+this.transData.school_id);
    this.lessonStock();
  },
  methods: {
    // inputChange(val){
    //   this.sumInput = Number(val)*Number(this.transData.price)
    // },
    lessonStock() {
      _request
        .http(this, 'courstocks/getList', {
          school_id: this.transData.school_id,
          course_id: this.transData.id,
        })
        .then((res) => {
          console.log('获取的库存内容', res)
          this.schoolSelf.residue_number = res.residue_number
          this.schoolSelf.sum_current_number = res.sum_current_number
          this.schoolSelf.stockList = res.data
          this.schoolSelf.defalutStockList = res.data
          this.schoolSelf.lessonId = this.transData.id
        })
    },
    close() {
      this.$emit('close');
      // this.addStatus = true;
      // this.schoolSelf.stockList = this.schoolSelf.defalutStockList;
      // this.addInput = "";
      // this.schoolSelf.showCoursesStock = false;
    },
    add() {
      this.addStatus = false;
      console.log("添加的内容", this.schoolSelf);
      this.schoolSelf.stockList.push({
        create_at: "add",
        add_number: "add",
        current_number: "add"
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      sums[0] = "合计";
      sums[1] = this.schoolSelf.sum_current_number;
      sums[2] = this.schoolSelf.residue_number;

      return sums;
    },
    submit() {
      this.$confirm("确定添加  "+this.addInput+"  库存?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let params = {
        course_id: this.transData.id,
        school_id: this.transData.school_id,
        add_number: this.addInput,
        money:this.sumInput,
        // current_number: this.schoolSelf.residue_number,
      };
      _request.http(this, "courstocks/doInsertStocks", params).then(res => {
        if (res.code == 200) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "success"
          });
          this.$emit('marksure')

          // this.$router.go(0)
        }
      });
      })
      .catch((data) => {
        
      });
      
    }
  }
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
