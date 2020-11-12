<template>
  <div class="container-box">
    <div v-if="showList">
      <div class="content-head">
        <el-form :model="searchData" :rules="rule" label-width="90px" ref="searchData">
          <div class="type-list">
            <span class="type">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目：</span>
            <div
              class="typeItem"
              v-for="(item,index) in kemuArr"
              :key="index"
              @click="selSubject(item,index)"
              :class="{typeActive:question_subject_id == item.subject_id}"
            >{{item.subject_name}}</div>
          </div>
          <div class="type-list">
            <span class="type">审核状态：</span>
            <div
              class="typeItem"
              v-for="(item,index) in shenheArr"
              :key="index"
              @click="selShenhe(item)"
              :class="{typeActive:item.index == selactShenhe}"
            >{{item.name}}</div>
          </div>
          <div class="type-list">
            <span class="type">筛选条件：</span>
            <!-- <el-cascader
                v-model="lession_subject"
                :options="subjectArr"
                collapse-tags
                style="width:260px"
                :props="{ multiple:true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
            ></el-cascader>-->
            <el-select
              class="sel-width"
              clearable
              @change="getJie"
              placeholder="章"
              v-model="searchData.chapter_id"
            >
              <el-option
                v-for="(item, index) in chapterArr"
                :label="item.name"
                :value="item.chapters_id"
                :key="index"
              ></el-option>
            </el-select>
            <el-select
              class="sel-width"
              clearable
              @change="getKaodian"
              placeholder="节"
              v-model="searchData.joint_id"
            >
              <el-option
                v-for="(item, index) in chapterArticleArr"
                :label="item.name"
                :value="item.chapters_id"
                :key="index"
              ></el-option>
            </el-select>

            <el-select
              v-if="kaodianArr.length>0"
              class="sel-width"
              clearable
              placeholder="考点"
              v-model="searchData.point_id"
            >
              <el-option
                v-for="(item, index) in kaodianArr"
                :label="item.name"
                :value="item.chapters_id"
                :key="index"
              ></el-option>
            </el-select>
            <el-select v-model="searchData.item_diffculty" style="width:100px" placeholder="请选择难易">
              <el-option
                v-for="item in nanduArr"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              ></el-option>
            </el-select>
            <el-input
              style="width:200px"
              v-model="searchData.exam_name"
              placeholder="请输入试题名称"
              clearable
            ></el-input>
            <el-button type="primary" @click="searchFun">搜索</el-button>
          </div>
        </el-form>
      </div>
      <div class="content-cont">
        <div class="tab-wrap">
          <div class="tab-group">
            <span
              :class="{active: currentQuestionType == item.status}"
              v-for="(item,index) in tabList"
              :key="index"
              @click="tabClick(item)"
            >{{ item.text }}</span>
          </div>
          <div class="rightBtnBox">
            <el-button @click="importQuestion" type="primary">导入试题</el-button>
            <el-button @click="changeShowBox" type="primary">添加试题</el-button>
          </div>
        </div>
        <adminQuestionList
          v-if="isRefresh"
          :selData="searchData"
          :status="currentQuestionType"
          @showEdit="showEdit"
        ></adminQuestionList>
      </div>
    </div>

    <!-- 导入试题 -->
    <div v-if="importModalShow">
      <adminQuestionImport
        :show="importModalShow"
        @close="importModalClose"
        :subject_id="searchData.subject_id"
        @refesh="searchFun"
      ></adminQuestionImport>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

import _request from "@/utils/request";
import bus from "@/components/common/bus";
import adminQuestionList from "./adminQuestionList";
import adminQuestionImport from "./adminQuestionImport";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components: {
    adminQuestionList,
    adminQuestionImport
  },
  computed: {
    ...mapState({
      authority: state => state.question.authority,
      bank_id: state => state.question.bank_id,
      currentQuestionType: state => state.question.currentQuestionType || 1,
      question_subject_id: state => state.question.question_subject_id
    })
  },
  data() {
    return {
      importModalShow: false, //导入试题模态框
      isRefresh: true, //是否刷新列表
      tabList: this.$store.state.question.questionTypeList,
      tableHeight: null,
      searchData: {
        exam_name: "",
        is_publish: "2",
        subject_id: this.$store.state.question.question_subject_id,
        bank_id: this.$store.state.question.bank_id,
        chapter_id: "",
        joint_id: "",
        point_id: "",
        item_diffculty: "",
        type: this.$store.state.question.currentQuestionType
      },
      exam_id: "", // 修改时传递id
      showList: this.$store.state.SecHeadClick,
      showAddBox: false,
      activeName: "first",
      lession_subject: [], //章节考点
      subjectArr: [],
      kemuArr: [],
      chapterArr: [],
      chapterArticleArr: [],
      kaodianArr: [],
      shenheArr: [
        { name: "全部", index: 2 },
        { name: "已发布", index: 1 },
        { name: "未发布", index: 0 }
      ],
      nanduArr: [
        { name: "全部", index: "" },
        { name: "简单", index: 1 },
        { name: "一般", index: 2 },
        { name: "困难", index: 3 }
      ],
      selactShenhe: "2", // 审核状态默认选择所有
      kaodian: [],
      rule: {}
    };
  },
  created() {
    this.$store.dispatch("disAuthority");
    this.getSubjectList();
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", data => {
        console.log(data);
        if (data) {
          this.showList = true;
          this.showAddBox = false;
        } else {
          this.showList = false;
          this.showAddBox = true;
        }
      });
    },
    "searchData.chapter_id"(val) {
      if (val) {
      } else {
        this.chapterArticleArr = [];
      }
    },
    "searchData.joint_id"(val) {
      if (val) {
      } else {
        this.kaodianArr = [];
      }
    }
  },
  methods: {
    //导入试题模态框-开启
    importQuestion() {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      this.importModalShow = true;
    },
    //导入试题模态框-关闭
    importModalClose() {
      this.importModalShow = false;
    },
    tableReload() {
      this.isRefresh = false;
      setTimeout(() => {
        this.isRefresh = true;
      }, 200);
    },
    tabClick(item) {
      this.$store.commit("currentQuestionType", item.status);
      this.searchData.type = item.status;
      this.tableReload();
    },
    showEdit(id) {
      // 关闭列表展示修改
      this.showList = false;
      this.showAddBox = true;
      this.exam_id = id;
    },
    changeShowBox() {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      this.$store.commit("exam_id", "");
      this.$router.push(
        "/question/getExamList/add?questionType=" + this.currentQuestionType
      );
    },
    clearFun() {
      //  添加时取消返回
      this.showAddBox = false;
      this.showList = true;
    },

    selSubject(item, index) {
      this.$store.commit("question_subject_id", item.subject_id);
      this.searchData.subject_id = this.question_subject_id;
      this.getChaptersSelectList();
      this.searchData.chapter_id = "";
      this.searchData.joint_id = "";
      this.searchData.point_id = "";
    },
    selShenhe(item) {
      this.selactShenhe = item.index;
      this.searchData.is_publish = item.index;
    },
    getSubjectList() {
      _request
        .http(this, "question/getSubjectList", { bank_id: this.bank_id })
        .then(res => {
          this.kemuArr = res.data;
          if (!this.question_subject_id) {
            this.searchData.subject_id = res.data[0].subject_id;
            this.$store.commit(
              "question_subject_id",
              this.searchData.subject_id
            );
          }

          this.getChaptersSelectList();
        });
    },
    searchFun() {
      this.searchData.lession_subject = JSON.stringify(this.lession_subject);
      console.log(this.searchData);
      this.tableReload();
    },

    dialogMarksure() {
      this.showDialog = false;
    },
    // 选择老师
    clickTeacher(e) {
      console.log(e);
    },
    // 添加角色
    addRole() {
      bus.$emit("changListStatus", false);
      this.$router.push("/system/roleManage");
    },
    cancelFun() {
      this.$emit("closeFun", false);
    },
    marksureFun() {
      this.showList = true;
      this.showAddBox = false;
    },
    selTeacher() {
      this.showDialog = true;
    },

    getChaptersSelectList() {
      _request
        .http(this, "question/getChaptersSelectList", {
          bank_id: this.bank_id,
          subject_id: this.question_subject_id
        })
        .then(res => {
          this.chapterArr = res.data;
        });
    },
    getJie() {
      var param = {
        bank_id: this.bank_id,
        subject_id: this.searchData.subject_id,
        chapters_id: this.searchData.chapter_id,
        type: 1
      };
      this.searchData.joint_id = "";
      this.searchData.point_id = "";

      console.log(JSON.stringify(this.searchData.chapter_id));
      _request.http(this, "question/getChaptersSelectList", param).then(res => {
        this.chapterArticleArr = res.data;
      });
    },
    getKaodian() {
      var param = {
        bank_id: this.bank_id,
        subject_id: this.searchData.subject_id,
        chapters_id: this.searchData.joint_id, // 选择节的时候传递节的参数
        type: 2
      };
      this.searchData.point_id = "";
      _request.http(this, "question/getChaptersSelectList", param).then(res => {
        this.kaodianArr = res.data;
      });
    }
  }
};
</script>
<style scoped lang="less">
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
.content-cont {
  position: relative;
  background: #fff;
  box-shadow: 0 0 8px 0px rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  padding: 10px;
}
.sel-width {
  width: 170px;
}
</style>
