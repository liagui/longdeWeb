<template>
  <div>
    <!-- 发布时 -->
    <div class="box-wrap" v-if="showEditMater">
      <el-form :model="addData1" label-width="120px">
        <el-form-item label="材料内容：">
          <quillEditorCom @tranCont="getContent" :transIntroduction="addData1.exam_content"></quillEditorCom>
        </el-form-item>
        <el-form-item label="章节考点：">
          <el-select
            class="sel-width"
            @change="getJie"
            placeholder="章"
            v-model="addData1.chapter_id"
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
            @change="getKaodian"
            placeholder="节"
            v-model="addData1.joint_id"
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
            placeholder="考点"
            v-model="addData1.point_id"
          >
            <el-option
              v-for="(item, index) in kaodianArr"
              :label="item.name"
              :value="item.chapters_id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试题难度：">
          <el-radio-group v-model="addData1.item_diffculty">
            <el-radio label="1">简单</el-radio>
            <el-radio label="2">一般</el-radio>
            <el-radio label="3">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="text-align:center;">
          <el-button class="margin-right" @click="$emit('clearFun')">取消</el-button>
          <el-button class="margin-right" @click="publishFun1('public')" type="primary">发布</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 编辑/查看材料 -->
    <div class="box-wrap" v-if="exam_id&&!showEditMater">
      <el-form :model="addData" :rules="rule" label-width="120px" ref="addData">
        <el-form-item label="材料内容：">
          <div v-html="neirong">{{neirong}}</div>
          <!-- <el-input v-model="addData.exam_content" type="textarea" :rows="10" disabled></el-input> -->
        </el-form-item>
        <el-form-item label class="text-r">
          <el-button @click="showEditMater=true" type="success" plain>编辑材料</el-button>
          <el-button @click="addChildQuestion" type="danger" plain>新增子题</el-button>
<!--          <el-button @click="publishFun('public')" type="primary" plain>发布</el-button>-->
          <el-button @click="goback" plain>返回</el-button>
        </el-form-item>
      </el-form>
      <!-- 子题列表 -->
      <div v-if="!showChild && childList.length>0">
        <div class="add-wrap">
          <div class="add-title">题目</div>
        </div>
        <adminQuestionMaterialList
          :data="childList"
          :status="childStatus"
          @showEdit="showEdit"
          @marksure="marksureFun"
        ></adminQuestionMaterialList>
        <div class="pagination">
          <el-pagination
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
      <!-- 新增子题 -->
      <div class="add-wrap" v-show="showChild && !child_extend_id">
        <div class="add-title">新增子题</div>
        <div class="add-handle">
          <span>试题类型：</span>
          <el-radio-group v-model="childStatus">
            <el-radio
              :label="item.status"
              v-for="(item,index) in tabList"
              :key="index"
            >{{item.text}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 子题区域 -->
      <adminQuestionAdd
        :status="childStatus"
        :child_extend_id="child_extend_id"
        :isCaiLiao="true"
        :subject_id="subject_id"
        @clearFun="clearFun"
        @marksure="marksureFun"
        v-if="showChild"
      ></adminQuestionAdd>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import _request from "@/utils/request";
import bus from "@/components/common/bus";
import quillEditorCom from "../ueditorCom/comEditor";
import adminQuestionAdd from "./adminQuestionAdd";
import adminQuestionMaterialList from "./adminQuestionMaterialList";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  props: ["subject_id"],
  computed: {
    ...mapState({
      authority: state => state.question.authority,
      bank_id: state => state.question.bank_id
    })
  },
  components: {
    quillEditorCom,
    adminQuestionAdd,
    adminQuestionMaterialList
  },
  data() {
    return {
      chapterArr: [],
      chapterArticleArr: [],
      kaodianArr: [],
      showEditMater: true,
      tabList: this.$store.state.question.questionTypeList.slice(0, -1),
      exam_id: this.$store.state.question.exam_id,
      neirong: "",
      childList: [],
      child_extend_id: null, //子题id
      listParam: { bank_id: this.bank_id },
      childStatus: null,
      showChild: false,
      fileUploadPath: this.GLOBAL.postImgUrl,
      addData1: {
        type: 7,
        is_publish: 1,
        subject_id: this.subject_id,
        bank_id: this.bank_id,
        exam_content: "",
        chapter_id: "",
        joint_id: "",
        point_id: "",
        item_diffculty: "3"
      },
      addData: {},
      rule: {},
      cur: {
        pagesize: 20,
        page: 1
      },
      nextPage: 1,
      totalCount: 20
    };
  },
  created() {
    this.getChaptersSelectList();
    this.listParam.bank_id = this.bank_id;
    this.addData1.bank_id = this.bank_id;
    this.initData();
    if (this.exam_id) {
      this.showEditMater = false;
    }
  },
  methods: {
    addChildQuestion() {
      //新增子题
      this.child_extend_id = null;
      this.showChild = true;
    },
    getContent(val) {
      this.addData1.exam_content = val;
    },
    publishFun(status) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      let url = "";
      if (this.extemdId) {
        this.addData.exam_id = this.extemdId;
        url = "question/doUpdateExam";
      } else {
        this.addData.exam_id = null;
        url = "question/doInsertExam";
      }

      if (status == "public") {
        this.addData.is_publish = 1;
      } else if (status == "publicAndConContinue") {
        this.addData.is_publish = 0;
      } else if (status == "save") {
        this.addData.is_publish = 0;
      }
      this.ajaxSend();
    },
    publishFun1() {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      let url = "";
      if (this.exam_id) {
        this.addData1.exam_id = this.exam_id;
        url = "question/doUpdateExam";
      } else {
        url = "question/doInsertExam";
      }
      _request.http(this, url, this.addData1).then(res => {
        this.$emit("marksure");
      });
    },
    ajaxSend(callBack) {
      _request.http(this, "question/doInsertExam", this.addData).then(res => {
        this.$emit("marksure");
        callBack && callBack();
      });
    },
    clearFun() {
      this.showChild = false;
    },
    marksureFun() {
      this.showChild = false;
      this.initData();
    },
    goback() {
      this.$emit("clearFun");
    },
    showEdit(id, status) {
      //编辑子题
      this.showChild = true;
      this.childStatus = status;
      this.child_extend_id = id;
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
    initData() {
      if (this.exam_id) {
        let param = {
          exam_id: this.exam_id
        };

        _request
          .http(this, "question/getMaterialList", param, this.cur)
          .then(res => {
            this.neirong = res.data.material_info;
            this.addData1.exam_content = res.data.material_info;
            this.addData1.item_diffculty = String(res.data.item_diffculty);
            this.addData1.chapter_id = res.data.chapter_id;
            this.addData1.joint_id = res.data.joint_id;
            this.addData1.point_id = res.data.point_id;
            this.childList = res.data.child_list;
            this.totalCount = res.data.total;
            this.getJie(true);
            this.getKaodian(true);
          });
      }
    },
    getChaptersSelectList() {
      _request
        .http(this, "question/getChaptersSelectList", {
          bank_id: this.bank_id,
          subject_id: this.subject_id
        })
        .then(res => {
          this.chapterArr = res.data;
        });
    },
    getJie(bool) {
      var param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        chapters_id: this.addData1.chapter_id,
        type: 1
      };
      if (!bool) {
        this.addData1.joint_id = "";
        this.addData1.point_id = "";
      }
      _request.http(this, "question/getChaptersSelectList", param).then(res => {
        this.chapterArticleArr = res.data;
      });
    },
    getKaodian(bool) {
      if (!bool) {
        this.addData1.point_id = "";
      }

      _request
        .http(this, "question/getChaptersSelectList", {
          bank_id: this.bank_id,
          subject_id: this.subject_id,
          chapters_id: this.addData1.joint_id,
          type: 2
        })
        .then(res => {
          this.kaodianArr = res.data;
        });
    },
    getExamInfoById(id) {
      _request
        .http(this, "question/getExamInfoById", { exam_id: id })
        .then(res => {
          this.addData = Object.assign({}, res.data);
          this.getJie(true);
          this.getKaodian(true);
        });
    }
  }
};
</script>
<style scoped lang="less">
.box-wrap {
  background: #fff;
  margin-right: 25px;
  padding: 25px;
}
.margin-right {
  margin-right: 5px;
}
/deep/ .ql-container {
  height: 220px !important;
}
.add-wrap {
  margin-bottom: 5px;
  .add-title {
    text-align: center;
    width: 100%;
    border-top: 1px dashed #e0e0e0;
    padding-top: 20px;
  }
  .add-handle {
    overflow: hidden;
    padding: 20px 20px;
    margin-top: 20px;

    box-shadow: 0px 0px 5px 2px rgba(0, 22, 38, 0.1);
    border-radius: 1px;
  }
}

/deep/ .add-handle .el-radio {
  margin-bottom: 0;
}
</style>
