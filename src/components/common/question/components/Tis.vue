<template>
  <div>
    <!-- 材料题多出材料内容、 van-tag后加小题号-->
    <div v-html="data.cailiao"></div>
    <p class="margin-b">
      <van-tag round type="success" color="#2BC7BD">{{data.exam_type_name}}</van-tag>
      <span style="color:red;margin-right:5px">{{data.tihao}}</span>

      <span v-html="data.exam_name"></span>
    </p>
    <!-- 答案选择 单选多选不定项 -->
    <div v-if="data.questionType==1 || data.questionType==2 || data.questionType==4">
      <p
        class="y-answer"
        @click="selectAnswer(item)"
        v-for="(item,index) in data.option_list"
        :key="index"
      >
        <span
          class="y-circle"
          :class="{
          'select':!showImportant&& getEqual(item.option_no,data.my_answer,true),
          'success':isShowSuccess&& getEqual(item.option_no,data.correct_answer),
          'error':isShowError && getEqual(item.option_no,data.my_answer)
        }"
        >{{item.option_no}}</span>
        <span v-html="item.option_name"></span>
      </p>
    </div>
    <!-- 答案选择 判断 -->
    <div v-if="data.questionType==3">
      <p
        class="y-answer"
        @click="selectAnswer(item)"
        v-for="(item,index) in judgeList"
        :key="index"
      >
        <span
          class="y-circle panduan"
          :class="{
          'select':!showImportant&& getEqual(item,data.my_answer,true),
          'success':isShowSuccess&& getEqual(item,data.correct_answer),
          'error':isShowError && getEqual(item,data.my_answer)
        }"
        >{{item}}</span>
        <span>{{item}}</span>
      </p>
    </div>

    <!-- 不定项、多选 确认按钮 -->
    <div class="text-c padding-tb" v-show="moreBtnShow && !showImportant">
      <van-button
        round
        color="linear-gradient(to right, #2EC1FE, #2EA1FE)"
        size="large"
        @click="checkAnswer"
      >确认答案</van-button>
    </div>
    <!-- 填空题 -->
    <div v-if="data.questionType==5">
      <el-input
        :disabled="!!data.my_answer"
        v-model="item.answer"
        v-for="(item,index) in tiankongAnswer"
        :key="index"
        style="width:99%;margin:10px auto"
      ></el-input>
      <div class="text-c padding-tb">
        <van-button
          round
          color="linear-gradient(to right, #2EC1FE, #2EA1FE)"
          size="large"
          @click="selectAnswer"
        >确定答案</van-button>
      </div>
    </div>
    <!-- 简答题 -->
    <div v-if="data.questionType==6">
      <el-input
        :disabled="!!data.my_answer"
        v-model="jiandaAnswer"
        type="textarea"
        :autosize="{ minRows: 5}"
        style="width:99%;margin:10px auto"
      ></el-input>
      <div class="text-c padding-tb">
        <van-button
          round
          color="linear-gradient(to right, #2EC1FE, #2EA1FE)"
          size="large"
          @click="selectAnswer"
        >确定答案</van-button>
      </div>
    </div>
    <!-- 过度 -->
    <div class="hidden-md-and-up" v-show="(data.my_answer && data.showAnswer) || showImportant">
      <!-- <div v-show="(data.my_answer && data.showAnswer) || showImportant"> -->
      <div class="answer">
        <div>
          <span class="weight">正确答案：</span>
          <span class="color-lan">{{data.correct_answer}}</span>
        </div>
        <div>
          您的答案：
          <span class="color-hong">{{data.my_answer}}</span>
        </div>
      </div>
      <!-- 解析 -->
      <div class="jiexi">
        <div class="tika-title">
          <span></span>
          <b>解析</b>
        </div>
        <div class="jiexi-con" v-html="data.text_analysis"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["data", "showImportant"],
  computed: {
    isShowSuccess() {
      return (
        (this.data.showAnswer && this.data.my_answer) || this.showImportant
      );
    },
    isShowError() {
      return (
        (this.data.showAnswer && this.data.is_right == 2) || this.showImportant
      );
    },
    moreBtnShow() {
      return this.data.questionType == 2 || this.data.questionType == 4;
    },
    ...mapState({
      bank_id: state => state.question.bank_id,
      subject_id: state => state.question.subject_id,
      exam_id: state => state.question.exam_id,
      papers_id: state => state.question.papers_id,
      type: state => state.question.type,
      model: state => state.question.model,
      chapter_id: state => state.question.chapter_id,
      joint_id: state => state.question.joint_id,

      subject_List: state => state.question.zjList,
      zjList: state => state.question.zjList
    })
  },
  data() {
    return {
      judgeList: ["正确", "错误"],
      checkList: [],
      paramObj: {},
      tiankongAnswer: [], //填空answer
      jiandaAnswer: "" //简答题答案
    };
  },
  created() {
    this.data.correct_answer = this.data.correct_answer.trim();

    //填空题
    if (this.data.questionType == 5) {
      this.data.correct_answer = "";
      let answerList = this.data.my_answer.split(",");

      this.data.option_list.forEach((item, index) => {
        //1.填空answer
        if (answerList.length > 0) {
          this.tiankongAnswer.push({ answer: answerList[index] });
        } else {
          this.tiankongAnswer.push({ answer: "" });
        }

        //2.填空题因为没有正确答案，需要从option_list里去取拼接成correct_answer
        this.data.correct_answer += `（${item.option_name}）`;
      });
    } else if (this.data.questionType == 6) {
      //简答题
      this.jiandaAnswer = this.data.my_answer;
    }
  },
  methods: {
    checkAnswer() {
      this.ajaxSend(this.paramObj);
    },
    getEqual(str1, str2, bool) {
      //单选题
      if (this.data.questionType == 1) {
        return str1 == str2;
      } else if (this.data.questionType == 2 || this.data.questionType == 4) {
        if (bool) {
          return (
            this.checkList.indexOf(str1) != -1 ||
            this.data.my_answer.indexOf(str1) != -1
          );
        }
        //多选题、不定项
        return str2.indexOf(str1) != -1;
      } else if (this.data.questionType == 3) {
        return str1 == str2;
        //判断题
      }
    },
    selectAnswer(item) {
      return
      if (this.showImportant) {
        return;
      }
      //已做题
      if (this.data.my_answer) {
        return;
      }

      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        exam_id: this.data.exam_id,
        // answer_time: this.answer_time,
        papers_id: this.data.papers_id,
        type: this.type
      };
      //章节
      if (this.type == 1) {
        param.chapter_id = this.chapter_id;
        param.joint_id = this.joint_id;
      }

      //单选题
      if (this.data.questionType == 1) {
        this.checkList = this.toggle(item.option_no, this.checkList);
        param.myanswer = item.option_no;
        param.my_answer = param.myanswer;
        this.ajaxSend(param);
      } else if (this.data.questionType == 2 || this.data.questionType == 4) {
        //多选题、不定项
        this.checkList = this.toggle(item.option_no, this.checkList);
        param.myanswer = this.checkList.join("");
        param.my_answer = param.myanswer;
        console.log(param.my_answer);
        // this.ajaxSend(param);
      } else if (this.data.questionType == 3) {
        //判断题
        param.myanswer = item;
        param.my_answer = item;
        this.ajaxSend(param);
      } else if (this.data.questionType == 5) {
        //填空
        let answerStr = this.tiankongAnswer.map(item => item.answer).join(",");
        param.myanswer = answerStr;
        param.my_answer = answerStr;
        this.ajaxSend(param);
      } else if (this.data.questionType == 6) {
        //简答题
        let answerStr = this.jiandaAnswer;
        param.myanswer = answerStr;
        param.my_answer = answerStr;
        this.ajaxSend(param);
      }
      this.paramObj = param;
    },
    ajaxSend(param) {
      if (!param.my_answer) {
        return;
      }
      if (!param.bank_id) {
        return;
      }
      let url =
        this.$route.path == "/question/errorQuestion"
          ? "/bank/doMyErrorExam"
          : "/bank/doBankMakeExam";
      this.$axios.post(url, param).then(res => {
        if (res.code == 200 || res.code == 208) {
          let obj = Object.assign({}, this.data);
          obj.my_answer = param.my_answer;
          // obj.is_right = param.my_answer == obj.correct_answer ? "1" : "2";
          obj.is_right = res.data;
          this.$emit("setAnswer", obj);
        } else {
          this.$Toast(res.msg);
        }
      });
    },
    toggle(str, list) {
      let index = list.findIndex(item => item == str);
      if (index == -1) {
        return [...list, str].sort();
      } else {
        list.splice(index, 1);
        return list;
      }
    }
  }
};
</script> 

<style lang="less" scoped>
@import "../question.less";
.margin-b {
  margin-bottom: 25px;
}
.answer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  background-color: #f2f7f8;
  & > div {
    padding: 0 30px;
    text-align: center;
  }
}
.color-lan {
  color: #27a8fe;
}
.color-hong {
  color: #f76368;
}
.weight {
  font-weight: bold;
}
.tika-title {
  border-top: 3px solid #f8f8f8;
  margin-top: 30px;
  padding: 10px 0;
}
img {
  max-width: 100%;
}
</style>
