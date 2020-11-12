<template>
  <div>
    <div class="queCont" v-if="dataList.length">
      <div class="quesHead">
        <el-checkbox class="gouxuanshiti" @change="handleCheckAllChange" v-model="checkAll">勾选试题</el-checkbox>
        <el-button type="warning" plain @click="remove">批量删除</el-button>
        <el-button type="warning" plain @click="examine">批量审核</el-button>
      </div>
      <!-- <el-checkbox-group v-model="checkboxGroup1">
      <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
      </el-checkbox-group>-->
      <div class="con-list">
        <el-checkbox-group v-model="checkboxGroup">
          <div class="con-item" v-for="(item,index) in dataList" :key="index">
            <!-- <el-checkbox class="check-item"></el-checkbox> -->
            <el-checkbox class="check-item" :label="item.exam_id" :key="item.exam_id">{{kong}}</el-checkbox>
            <div class="con-content">{{item.exam_content}}</div>
            <div
              class="con-zhuangtai"
              v-if="item.is_publish"
              @click="publicChange(item.exam_id,0)"
            >已发布</div>
            <div class="con-zhuangtai weifabu" v-else @click="publicChange(item.exam_id,1)">未发布</div>
            <div class="con-oprrate">
              <el-button type="info" @click="deleteItem(item.exam_id)">删除</el-button>
              <el-button type="success" @click="updateFun(item.exam_id)">编辑</el-button>
            </div>
          </div>
        </el-checkbox-group>
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
    <div v-else class="nodata">暂时没有数据</div>
    <div>
      <!-- <question-add :bankId='bank_id' :subjectId='subject_id' :examId='extend_id' v-if='showAddBox'></question-add> -->
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import _request from "@/utils/request";
import bus from "@/components/common/bus";

import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  computed: {
    ...mapState({
      authority: state => state.question.authority,
      loading: state => state.loading,
      bank_id: state => state.question.bank_id
    })
  },
  props: ["selData", "subjectId", "status"],
  data() {
    return {
      kong: "",
      checkAll: false,
      dataList: [],
      showAddBox: false,
      subject_id: this.subjectId,
      extend_id: "",
      paginationShow: true,
      cur: {
        pagesize: 20,
        page: 1
      },
      nextPage: 1,
      totalCount: 20,
      checkboxGroup: []
    };
  },
  created() {
    this.initData();
    // this.getSubjectList();
  },
  methods: {
    publicChange(exam_id, is_publish) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      let text = is_publish == 1 ? "发布" : "取消发布";
      this.$confirm("是否" + text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.publicAjax(exam_id, text);
      });
    },
    publicAjax(id, text) {
      _request
        .http(this, "question/doPublishExam", { exam_id: [id] })
        .then(res => {
          if (res.code == 200) {
            this.$toast(text + "成功");
            this.initData();
          }
        });
    },
    remove() {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      if (this.checkboxGroup.length == 0) {
        alert("请选择要删除的试题");
        return;
      }
      this.$confirm("删除所选中试题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delFun(this.checkboxGroup);
      });
    },
    examine() {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      if (this.checkboxGroup.length == 0) {
        alert("您还没有选择任何题目");
        return;
      }
      _request
        .http(this, "question/doPublishExam", { exam_id: this.checkboxGroup })
        .then(res => {
          if (res.code == 200) {
            this.$toast("审核成功");
            this.initData();
          }
        });
    },
    updateFun(id) {
      // 修改列表信息
      this.$store.commit("exam_id", id);
      this.$router.push(
        "/question/getExamList/edit?questionType=" + this.status
      );
    },
    deleteItem(id) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      var examArr = [];
      examArr.push(id);
      this.$confirm("是否确认删除？删除后此题将不在试卷中展示", "提示", {
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
            if (this.cur.page > 1) {
              this.cur.page =
                Math.ceil(this.totalCount - 1) / this.cur.pagesize;
            }
            this.initData();
          }
        });
    },
    handleCheckAllChange(val) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      if (val) {
        var idArr = [];
        var dataList = this.dataList;
        for (var i = 0; i < dataList.length; i++) {
          idArr.push(dataList[i]["exam_id"]);
        }
        this.checkboxGroup = idArr;
      } else {
        this.checkboxGroup = [];
      }
    },
    initData() {
      _request
        .http(this, "question/getExamList", this.selData, this.cur)
        .then(res => {
          this.dataList = res.data.exam_list;
          this.totalCount = res.data.total;
          this.checkAll = false;
          this.checkboxGroup = [];
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
    }
  },
  watch: {
    selData: {
      handler(newVal, oldVal) {
        this.initData();
      },
      deep: true
    },
    loading(newVal, oldVal) {
      if (newVal != oldVal && newVal == false) {
        setTimeout(() => {
          this.initData();
        }, 1000);
      }
    }
  }
};
</script>
<style scoped lang="less">
.gouxuanshiti {
  margin: 0 20px;
}
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
      color: #159700;
      font-size: 14px;
      cursor: pointer;
    }
    .weifabu {
      color: #e60101;
    }
    .con-oprrate {
      display: flex;
      align-items: center;
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
