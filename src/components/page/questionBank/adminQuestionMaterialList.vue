<template>
  <div class="con-list" v-if="tableData.length">
    <div class="con-item" v-for="(item,index) in tableData" :key="index">
      <div class="con-zhuangtai">{{index+1}}</div>
      <div class="con-content">{{item.content}}</div>
      <div class="con-oprrate">
        <el-button type="info" @click="deleteItem(item.id)">删除</el-button>
        <el-button type="success" @click="updateFun(item)">编辑</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import _request from "@/utils/request";
export default {
  props: ["data", "subjectId"],
  computed: {
    ...mapState({
      authority: state => state.question.authority,
      bank_id: state => state.question.bank_id
    })
  },
  data() {
    return {
      tableData: [],
      showAddBox: false,
      subject_id: this.subjectId,
      extend_id: "",
      paginationShow: true,
      cur: {
        pagesize: 20,
        page: 1
      },
      nextPage: 1,
      totalCount: 20
    };
  },
  created() {
    this.tableData = this.data;
  },
  methods: {
    updateFun(item) {
      // 修改列表信息
      this.$emit("showEdit", item.id, item.status);
    },
    deleteItem(id) {
      var examArr = [];
      examArr.push(id);
      this.$confirm("删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delFun(examArr);
        })
        .catch(() => {});
    },
    delFun(arr) {
      _request
        .http(this, "question/doDeleteExam", { exam_id: arr })
        .then(res => {
          if (res.code == 200) {
            this.$emit("marksure");
          } else {
          }
        });
    },
    handleCheckedCitiesChange(value) {}
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        this.tableData = newVal;
      },
      deep: true
    }
  }
};
</script>
<style scoped lang="less">
.con-list {
  .con-item {
    display: flex;
    align-items: center;
    height: 50px;
    line-height: 50px;
    background: rgba(255, 255, 255, 1);
    margin: 10px;
    box-shadow: 0px 0px 5px 0px rgba(0, 22, 38, 0.1);
    border-radius: 1px;
    .check-item {
      margin-bottom: 0;
      margin-left: 10px;
      padding-right: 10px;
      border-right: 1px solid rgba(233, 229, 234, 1);
    }
    .con-content {
      flex: 1;
      font-size: 14px;
      margin: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .con-zhuangtai {
      width: 70px;
      text-align: center;
      border-left: 1px solid rgba(233, 229, 234, 1);
      border-right: 1px solid rgba(233, 229, 234, 1);
      font-size: 14px;
    }
    .weifabu {
      color: #e60101;
    }
    .con-oprrate {
      padding: 0 15px;
    }
  }
}
.nodata {
  color: #666;
  font-size: 14px;
  text-align: center;
  margin: 20px 0;
  border-bottom: 1px solid #eee;
}
</style>
