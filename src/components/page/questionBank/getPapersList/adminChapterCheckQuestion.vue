<template>
  <div>
    <div class="content-cont">
      <div class="tab-wrap">
        <div class="tab-group">
          <span
            :class="{active: activeIndex == item.status}"
            v-for="(item,index) in tabList"
            :key="index"
            @click="tabClick(item)"
          >{{ item.text }}</span>
          <div class="fenshu">
            每题得分：
            <div class="fenshu-input">
              <input type="text" v-model="fenshu[activeIndex]" placeholder="请输入每题得分" />
            </div>
          </div>
        </div>

        <div class="rightBtnBox">
          <!-- 暂留 -->
          <!-- <el-button @click="testRepeat" type="primary">检测重复</el-button> -->
          <el-button @click="openQusetion" type="primary">手动选择</el-button>
        </div>
      </div>
      <div class="queCont" v-if="currentList.length">
        <div class="con-list">
          <div class="con-item" v-for="(item,index) in currentList" :key="index">
            <div class="con-content">{{item.exam_content}}</div>
            <div class="con-oprrate">
              <el-button type="info" @click="deleteItem(item,index)">删除</el-button>
              <!-- 暂留 -->
              <!-- <el-button type="success" @click="updateFun(item.exam_id)">编辑</el-button> -->
            </div>
          </div>
        </div>
      </div>
      <adminChapterAddCheck
        :show="showQuestionList"
        :type="activeIndex"
        @close="closeQuestion"
        @receive="receive"
      ></adminChapterAddCheck>
      <div class="y-handler dialog-footer">
        <el-button @click="cloesecheckQuestion">取消</el-button>
        <el-button @click="submit" type="primary">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import _request from "@/utils/request";
import bus from "@/components/common/bus";
import adminChapterAddCheck from "./adminChapterAddCheck";

import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  computed: {
    ...mapState({
      authority: state => state.question.authority,
      bank_id: state => state.question.bank_id
    })
  },
  props: ["selData", "subjectId", "status"],
  components: {
    adminChapterAddCheck
  },
  data() {
    return {
      activeIndex: 1,
      tabList: [],
      showQuestionList: false,
      dataList: {},
      fenshu: {},
      showAddBox: false,
      subject_id: this.subjectId,
      extend_id: "",
      paginationShow: true,
      currentList: []
    };
  },
  created() {
    this.getPapersInfoById();
    this.getExamSignleScore();
    // this.getSubjectList();
    // this.refeshData();
  },
  methods: {
    testRepeat() {
      this.currentList.sort();
      // let pararm = {
      //   papers_id: this.$store.state.question.papers_id,
      //   type: this.activeIndex
      // };
      // _request
      //   .http(this, "question/RepetitionTestPaperSelection", pararm)
      //   .then(res => {
      //     if (res.code == 200) {
      //     } else {
      //       this.$message({
      //         message: res.msg,
      //         type: "warning"
      //       });
      //     }
      //   });
    },
    submit() {
      if (!this.testFenShu()) {
        return;
      }
      let pararm = {
        papers_id: this.$store.state.question.papers_id,
        subject_id: this.$store.state.question.subject_id,
        exam_array: this.getExam_array()
      };
      if (pararm.exam_array.length == 0) {
        this.$message.error("请至少选择一道题");
        return;
      }
      _request
        .http(this, "question/InsertTestPaperSelection", pararm)
        .then(res => {
          if (res.code == 200) {
            this.$emit("cloesecheckQuestion");
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        });
    },
    testFenShu() {
      for (var i in this.fenshu) {
        if (
          !this.fenshu[i] &&
          this.dataList[i] &&
          this.dataList[i].length > 0
        ) {
          let index = this.tabList.findIndex(item => item.status == i);
          var msg = "请输入" + this.tabList[index].text + "分数";
          this.$message.error(msg);
          return false;
        }
      }
      return true;
    },
    getExam_array() {
      let list = [];
      for (var i in this.dataList) {
        for (var item of this.dataList[i]) {
          list.push({
            exam_id: item.exam_id,
            type: i,
            grade: this.fenshu[i],
            is_del: item.is_del
          });
        }
        if (this.dataList[i].length == 0 && this.fenshu[i]) {
          list.push({
            exam_id: 0,
            type: i,
            grade: this.fenshu[i],
            is_del: 0
          });
        }
      }
      return list;
    },
    receive(list) {
      let arr = [...this.dataList[this.activeIndex], ...list];
      let tempArr = arr.map(item => JSON.stringify(item));
      tempArr = [...new Set(tempArr)];
      arr = tempArr.map(item => JSON.parse(item));
      this.$set(this.dataList, this.activeIndex, [...arr]);
      this.refeshData();
      this.showQuestionList = false;
    },
    refeshData() {
      var arr = [...this.dataList[this.activeIndex]];
      this.currentList = arr.filter(item => item.is_del == "0");
    },
    cloesecheckQuestion() {
      this.$emit("cloesecheckQuestion");
    },
    tabClick(item) {
      this.activeIndex = item.status;
      this.refeshData();
    },
    //添加、编辑试题
    openQusetion() {
      this.showQuestionList = true;
    },
    closeQuestion() {
      this.showQuestionList = false;
    },
    updateFun(id) {
      // 修改列表信息
      this.$store.commit("exam_id", id);
      this.$emit("showEdit", id);
    },
    deleteItem(item, index) {
      this.$confirm("删除该试题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let list = this.dataList[this.activeIndex];
        item.is_del = "1";
        this.$set(this.dataList[this.activeIndex], index, item);
        this.refeshData();
      });
    },
    delFun(id) {
      _request
        .http(this, "question/deleteTestPaperSelection", { papersexam_id: id })
        .then(res => {
          if (res.code == 200) {
            this.initData();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //获取试卷详情
    getPapersInfoById() {
      let pararm = {
        papers_id: this.$store.state.question.papers_id
      };
      _request.http(this, "question/getPapersInfoById", pararm).then(res => {
        if (res.code == 200) {
          let str = res.data.type;
          if (str) {
            let arr = str.split(",");
            this.activeIndex = arr[0];
            this.tabList = this.$store.state.question.questionTypeList.filter(
              item => arr.indexOf(item.status) != -1
            );
            for (let i = 0; i < arr.length; i++) {
              this.initData(arr[i], i == 0);
            }
          }
        }
      });
    },
    initData(type, isFirst) {
      let pararm = {
        papers_id: this.$store.state.question.papers_id,
        type: type
      };
      _request.http(this, "question/doTestPaperSelection", pararm).then(res => {
        if (res.code == 200) {
          if (!res.data || !res.data instanceof Array) {
            return;
          }
          let obj = res.data.map(item => {
            item.is_del = "0";
            return item;
          });
          this.$set(this.dataList, type, obj);
          if (isFirst) {
            this.refeshData();
          }
        }
      });
    },
    getExamSignleScore() {
      let pararm = {
        papers_id: this.$store.state.question.papers_id
      };
      _request.http(this, "question/getExamSignleScore", pararm).then(res => {
        if (res.code == 200) {
          this.fenshu = res.data;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.fenshu {
  display: inline-block;
  width: 240px;
  margin-left: 100px;
  .fenshu-input {
    display: inline-block;
    width: 140px;
    border: 1px solid #25a3fd;
    color: #25a3fd;
    input {
      padding: 0 10px;
      border: none;
      width: 100%;
      color: #25a3fd;
      &::-webkit-input-placeholder {
        color: #25a3fd;
      }

      &::-moz-placeholder {
        color: #25a3fd;
      }

      &:-ms-input-placeholder {
        color: #25a3fd;
      }
    }
  }
}

.y-handler {
  text-align: center;
  padding: 30px 0;
}
.content-cont {
  background: #ffffff;
  padding: 10px;
}
.tab-wrap {
  // margin: 0;
  // padding: 20px 0;
  // border: 1px solid #ccc;
}
.con-list {
  min-height: 300px;
  .con-item {
    display: flex;
    align-items: center;
    height: 50px;
    line-height: 50px;
    background: rgba(255, 255, 255, 1);
    margin: 10px 0;
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
.type-list {
  font-size: 14px;
  margin-bottom: 15px;
  .type {
    color: rgba(51, 51, 51, 1);
  }
  .typeItem {
    display: inline-block;
    margin: 0 5px;
    height: 28px;
    padding: 0 12px;
    line-height: 28px;
    cursor: pointer;
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
}
</style>
