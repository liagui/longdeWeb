<template>
  <div class="box-wrap">
    <el-form :model="addData" :rules="rule" label-width="120px" ref="addData">
      <el-form-item label="题目：">
        <el-input
          v-model="addData.exam_content"
          type="textarea"
          :rows="4"
          placeholder="请输入题目"
          clearable
        ></el-input>
        <el-button type="success" plain class="vertical-t" @click="openEditor('exam_content')">编辑富文本</el-button>
      </el-form-item>
      <!-- 单选1、多选2、不定项4 -->
      <div v-if="status == 1 || status == 2 || status == 4">
        <el-form-item
          v-for="(item,index) in addData.option_list"
          :key="index"
          :label="'选项'+addData.option_list[index]['option_no']+' ：'"
        >
          <el-input clearable v-model="addData.option_list[index].option_name"></el-input>
          <el-button type="primary" plain @click="setRight(item.option_no)">设置为正确答案</el-button>
          <el-button
            type="danger"
            plain
            @click="delRight(index)"
            :class="{visible:index>1}"
            class="visible-none"
          >删除</el-button>
          <el-button type="success" plain @click="openEditor('option_list',index)">编辑富文本</el-button>
        </el-form-item>
        <el-button type="danger" class="addOption" @click="addRight">增加选项</el-button>
        <div class="activeAnswer">
          正确答案：
          <span class="activeSel">{{addData.answer}}</span>
        </div>
      </div>
      <!-- 填空5 -->
      <div v-if="status == 5">
        <el-form-item
          v-for="(item,index) in addData.option_list"
          :key="index"
          :label="'填空'+(index+1)+' ：'"
        >
          <el-input clearable v-model="addData.option_list[index].option_name"></el-input>
          <el-button
            type="danger"
            plain
            @click="delRight(index)"
            :class="{visible:index>0}"
            class="visible-none"
          >删除</el-button>
        </el-form-item>
        <el-button type="danger" class="addOption" @click="addRight">增加选项</el-button>
        <div class="activeAnswer"></div>
      </div>
      <!-- 判断题3-->
      <div v-if="status == 3">
        <el-form-item label="答案：" class="item-padding">
          <el-radio-group v-model="addData.answer">
            <el-radio label="正确"></el-radio>
            <el-radio label="错误"></el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="activeAnswer">
          正确答案：
          <span class="activeSel">{{addData.answer}}</span>
        </div>
      </div>
      <!-- 简答题6 -->
      <div v-if="status == 6">
        <el-form-item label="答案：">
          <el-input type="textarea" rows="4" v-model="addData.answer"></el-input>
          <el-button type="success" plain class="vertical-t" @click="openEditor('answer')">编辑富文本</el-button>
        </el-form-item>
      </div>

      <div class="timujiexi">题目解析</div>
      <el-form-item label="文字解析：">
        <el-input
          v-model="addData.text_analysis"
          type="textarea"
          :rows="4"
          placeholder="请输入文本"
          clearable
        ></el-input>
        <el-button
          type="success"
          plain
          class="vertical-t"
          @click="openEditor('text_analysis')"
        >编辑富文本</el-button>
      </el-form-item>
      <!-- <el-form-item label="音频解析：" prop="audio_analysis">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="fileUploadPath"
          :auto-upload="false"
          style="display:inline-block;"
        >
          <el-button slot="trigger" size="small" type="primary">选取音频</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="视频解析：" prop="video_analysis">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="fileUploadPath"
          :auto-upload="false"
          style="display:inline-block;"
        >
          <el-button slot="trigger" size="small" type="primary">选取视频</el-button>
        </el-upload>
      </el-form-item>-->
      <el-form-item label="章节考点：">
        <el-select class="sel-width" @change="getJie" placeholder="章" v-model="addData.chapter_id">
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
          v-model="addData.joint_id"
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
          v-model="addData.point_id"
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
        <el-radio-group v-model="addData.item_diffculty">
          <el-radio label="1">简单</el-radio>
          <el-radio label="2">一般</el-radio>
          <el-radio label="3">困难</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="text-align:center;">
        <el-button class="margin-right" @click="$emit('clearFun')">取消</el-button>
        <el-button class="margin-right" @click="publishFun('public')" type="primary">发布</el-button>
        <el-button
          class="margin-right"
          @click="publishFun('publicAndConContinue')"
          type="primary"
        >发布并继续</el-button>
        <el-button class="margin-right" @click="publishFun('save')" type="primary">保存</el-button>
      </el-form-item>
    </el-form>
    <editorModal
      :show="editorModalShow"
      :content="editorContent"
      @change="editorChange"
      @close="closeEditor"
    ></editorModal>
  </div>
</template>
<script>
const WORD_STORE = [];
for (var i = 0; i < 26; i++) {
  WORD_STORE.push(String.fromCharCode(65 + i)); //输出baiA-Z  26个大写字du母zhi
}
import { mapState } from "vuex";
import _request from "@/utils/request";
import bus from "@/components/common/bus";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
import editorModal from "@/components/globalComponents/editorModal";
export default {
  props: ["subject_id", "status", "isCaiLiao", "child_extend_id"],
  components: {
    editorModal
  },
  computed: {
    ...mapState({
      authority: state => state.question.authority,
      bank_id: state => state.question.bank_id,
      exam_id: state => state.question.exam_id
    })
  },
  data() {
    return {
      editorModalShow: false,
      editorContent: "",
      checkAll: false,
      fileUploadPath: this.GLOBAL.postImgUrl,
      answerList: [],
      addData: {
        type: this.status,
        subject_id: this.subject_id || null,
        bank_id: this.bankId || null,
        exam_content: "",
        option_list: [
          { option_no: "A", option_name: "", correct_flag: 0 },
          { option_no: "B", option_name: "", correct_flag: 0 },
          { option_no: "C", option_name: "", correct_flag: 0 },
          { option_no: "D", option_name: "", correct_flag: 0 }
        ],
        text_analysis: "",
        audio_analysis: "",
        video_analysis: "",
        answer: "",
        chapter_id: "",
        joint_id: "",
        point_id: "",
        item_diffculty: "1"
      },
      chapterArr: [],
      chapterArticleArr: [],
      kaodianArr: [],
      rule: {},
      currentObj: {
        key: null,
        index: null
      }
    };
  },
  created() {
    this.resetFrom();
    this.getChaptersSelectList();
    if (this.isCaiLiao) {
      //材料题子题
      if (this.child_extend_id) {
        //修改
        this.getExamInfoById(this.child_extend_id);
      } else {
        this.addData.child_extend_id = "";
        this.$nextTick(() => {
          this.$refs.addData && this.$refs.addData.resetFields();
        });
      }
    } else {
      if (this.exam_id) {
        //修改
        this.getExamInfoById(this.exam_id);
      } else {
        this.addData.exam_id = "";
        this.$nextTick(() => {
          this.$refs.addData && this.$refs.addData.resetFields();
        });
      }
    }
  },
  methods: {
    openEditor(key, index) {
      this.editorModalShow = true;
      this.currentObj.key = key;
      this.currentObj.index = index;

      if (this.currentObj.key == "option_list") {
        let index = this.currentObj.index;
        this.editorContent = this.addData[key][index].option_name;
      } else {
        this.editorContent = this.addData[key];
      }
    },
    closeEditor() {
      this.editorModalShow = false;
    },
    editorChange(text) {
      let key = this.currentObj.key;
      if (this.currentObj.key == "option_list") {
        let index = this.currentObj.index;
        this.addData[key][index].option_name = text;
      } else {
        this.addData[key] = text;
      }
      this.editorModalShow = false;
    },
    resetFrom() {
      this.addData = {
        type: this.status,
        subject_id: this.subject_id || null,
        bank_id: this.bank_id || null,
        exam_content: "",
        option_list: [
          { option_no: "A", option_name: "", correct_flag: 0 },
          { option_no: "B", option_name: "", correct_flag: 0 },
          { option_no: "C", option_name: "", correct_flag: 0 },
          { option_no: "D", option_name: "", correct_flag: 0 }
        ],
        text_analysis: "",
        audio_analysis: "",
        video_analysis: "",
        answer: "",
        chapter_id: "",
        joint_id: "",
        point_id: "",
        item_diffculty: "1"
      };
    },
    publishFun(status) {
      this.addData.type = this.status;
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      if (!this.addData.chapter_id) {
        alert("请选择章");
        if (this.chapterArr.length == 0) {
          setTimeout(() => {
            alert("没有可选章节，请到章节考点添加");
          }, 200);
        }
        return;
      }
      if (!this.addData.joint_id) {
        alert("请选择节");
        if (this.chapterArticleArr.length == 0) {
          setTimeout(() => {
            alert("没有可选章节，请到章节考点添加");
          }, 200);
        }
        return;
      }
      if (!this.addData.point_id) {
        alert("请选考点");
        if (this.kaodianArr.length == 0) {
          setTimeout(() => {
            alert("没有可选章节，请到章节考点添加");
          }, 200);
        }
        return;
      }
      if (this.status == 1 || this.status == 2 || this.status == 4) {
        if (!this.addData.answer) {
          alert("请选择答案");
          return;
        }
      }
      if (!this.addData.exam_content) {
        alert("试题内容不合法");
        return;
      }
      let url = "";
      //材料子题
      if (this.isCaiLiao) {
        this.addData.exam_id = this.child_extend_id || this.exam_id || null; //(材料题的子题id)
        url = this.child_extend_id
          ? "question/doUpdateExam"
          : "question/doInsertExam";
      } else {
        this.addData.exam_id = this.exam_id || null;
        url = this.addData.exam_id
          ? "question/doUpdateExam"
          : "question/doInsertExam";
      }
      // 填空
      if (this.status == "5") {
        this.addData.answer = this.addData.option_list
          .map(item => item.option_name)
          .join(",");
      }

      if (status == "public") {
        this.addData.is_publish = "1";
        this.ajaxSend(url, () => {
          this.$emit("marksure");
        });
      } else if (status == "publicAndConContinue") {
        this.addData.is_publish = "1";
        this.ajaxSend(url, () => {
          this.$message.success("发布成功");
          this.resetFrom();
        });
      } else if (status == "save") {
        this.addData.is_publish = "0";
        this.ajaxSend(url, () => {
          this.$emit("marksure");
        });
      }
    },
    ajaxSend(url, callBack) {
      _request.http(this, url, this.addData).then(res => {
        if (res.code == 200) {
          callBack && callBack();
        }
      });
    },
    setRight(label) {
      if (this.status == 1) {
        this.addData.answer = label;
      } else if (this.status == 2) {
        this.answerList.push(label);
        this.answerList = [...new Set(this.answerList)].sort();
        this.addData.answer = this.answerList.join("");
      } else if (this.status == 4) {
        this.answerList.push(label);
        this.answerList = [...new Set(this.answerList)].sort();
        this.addData.answer = this.answerList.join("");
      }
    },
    delRight(index) {
      if (this.status == 5) {
        if (index <= 0) return;
      } else {
        if (index <= 1) return;
      }
      if (this.status == 1) {
        if (this.addData.option_list[index].option_no == this.addData.answer)
          this.addData.answer = "";
      } else if (this.status == 2) {
        var hanveIndex = this.answerList.indexOf(
          this.addData.option_list[index].option_no
        );
        if (hanveIndex > -1) {
          this.answerList.splice(hanveIndex, 1);
          this.addData.answer = this.answerList.join("");
        }
      } else if (this.status == 4) {
        var hanveIndex = this.answerList.indexOf(
          this.addData.option_list[index].option_no
        );
        if (hanveIndex > -1) {
          this.answerList.splice(hanveIndex, 1);
          this.addData.answer = this.answerList.join("");
        }
      }

      this.addData.option_list.splice(index, 1);
      this.formatAnswerList(this.addData.option_list);
      this.addData.answer = "";
    },
    addRight() {
      var optionName = this.formatAnswerList(this.addData.option_list, true);
      if (this.addData.option_list.length < 8) {
        this.addData.option_list.push({
          option_no: optionName,
          option_name: "",
          correct_flag: 0
        });
      }
    },
    formatAnswerList(list, isAdd) {
      if (this.status == 5) return;
      if (isAdd) {
        var optionName = WORD_STORE[list.length];
        return optionName;
      }
      for (let i = 0; i < list.length; i++) {
        list[i].option_no = WORD_STORE[i];
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
        chapters_id: this.addData.chapter_id,
        type: 1
      };
      if(bool != true){
        this.addData.joint_id = "";
        this.addData.point_id = "";
      }
      console.log(JSON.stringify(this.addData.chapter_id));
      _request.http(this, "question/getChaptersSelectList", param).then(res => {
        this.chapterArticleArr = res.data;
      });
    },
    getKaodian(bool) {
      if(bool != true){
        this.addData.point_id = "";
      }
      _request
        .http(this, "question/getChaptersSelectList", {
          bank_id: this.bank_id,
          subject_id: this.subject_id,
          chapters_id: this.addData.joint_id,
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
  },
  watch: {
    exam_id(val) {},
    subject_id() {
      this.getChaptersSelectList();
    },
    bank_id() {
      this.getChaptersSelectList();
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
.addOption {
  margin-left: 120px;
  margin-bottom: 30px;
}
.activeAnswer {
  padding-left: 48px;
  font-size: 14px;
  color: #666;
  padding-bottom: 20px;
  border-bottom: 1px dashed #e0e0e0;
  .activeSel {
    margin-left: 5px;
    font-size: 30px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
}
.timujiexi {
  font-size: 16px;
  color: rgba(51, 51, 51, 1);
  margin: 20px 0;
  text-align: center;
}

/deep/ .el-textarea {
  width: 700px;
}
/deep/.el-input {
  width: 500px;
}
/deep/ .sel-width .el-input {
  width: 230px !important;
}
.margin-right {
  margin-right: 5px;
}
</style>
