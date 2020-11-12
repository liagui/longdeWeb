<template>
  <div>
    <!-- pc -->
    <div class="hidden-sm-and-down pc-question-wrap">
      <div class="question-pc">
        <div class="y-box">
          <PcTop>
            <div slot="left">
              <div class="y-icon y-pc-title"></div>
              <div class="y-icon" :class="pctopIcon"></div>
            </div>
            <div slot="center">
              <el-row class="flex-center">
                <el-col :span="12">{{ titleName }}</el-col>
                <el-col :span="12" class="flex-center" v-if="type==3">
                  <i class="y-icon y-pc-time"></i>
                  <span>
                    <van-count-down
                      @change="haveTimeChange"
                      :time="haveTime"
                      format="HH:mm:ss"
                      class="color-main font20 margin-l10 bold"
                    />
                  </span>
                </el-col>
              </el-row>
            </div>
            <div slot="right">
              <el-button @click="tabBarSubmit" type="primary" plain>交卷</el-button>
              <!-- <el-button type="primary" plain>暂停</el-button> -->
              <el-popconfirm class="margin-l10" title="请确认是否下次再做？" @onConfirm="nextTry">
                <el-button type="primary" slot="reference">下次再做</el-button>
              </el-popconfirm>
            </div>
          </PcTop>
        </div>
        <el-row>
          <el-col :span="7">
            <div class="y-box">
              <p class="text-c font24 padding-tb20">
                共{{ dataList.length }}题 已做
                <span class="color-main bold">{{ answerLen }}</span>题
              </p>
              <PcTika @swipeHref="swipeHref" :data="tikaList" :current="current" />
            </div>
          </el-col>
          <el-col :span="17">
            <div class="margin-l20 bg-fff">
              <div v-if="currentQuestion.cailiao" class="pc-answer-title">材料题</div>
              <div v-else class="pc-answer-title">{{ currentQuestion.exam_type_name }}</div>
              <div class="y-box">
                <!-- <p class="pc-ti-type">
                  <span>多选(26题)</span>
                </p>-->
                <div class="padding-lr y-question">
                  <!-- 做题区域 -->
                  <van-swipe
                    :touchable="false"
                    class="my-swipe"
                    autoplay="none"
                    indicator-color="white"
                    @change="change"
                    :loop="false"
                    ref="swipePc"
                  >
                    <van-swipe-item v-for="(item,index) in dataList" :key="index">
                      <Ti :data="item" @setAnswer="setAnswer" :showImportant="showImportant"></Ti>
                    </van-swipe-item>
                  </van-swipe>
                  <p class="flex1 text-c q-handle">
                    <span @click="starClick" class="flex-center">
                      <van-icon v-show="!isStar" name="star-o" size="18" is-link color="#333" />
                      <van-icon v-show="isStar" name="star" size="18" is-link color="#FF7939" />
                      <span>加入收藏</span>
                    </span>
                    <span class="margin-lr">
                      <el-button
                        v-if="current!=0"
                        class="fang btn-left"
                        type="primary"
                        @click="swipeChange('prev')"
                      >上一题</el-button>
                      <el-button
                        v-if="current!=(total-1)"
                        class="fang"
                        type="primary"
                        @click="swipeChange('next')"
                      >下一题</el-button>
                    </span>

                    <span @click="biaoji" class="pointer btn-left">
                      <i class="y-icon bg-biaoji" :class="{'active':currentQuestion.is_tab==1}"></i>标记
                    </span>
                  </p>
                  <!-- 答案区域 -->
                  <PcAnswers :currentQuestion="currentQuestion" :type="pcAnswersType" />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- phone -->
    <div class="hidden-md-and-up phone-question-wrap">
      <van-nav-bar @click-left="clickLeft" left-arrow :title="titleName">
        <template #right>
          <van-icon
            v-show="!isStar"
            name="star-o"
            size="18"
            is-link
            @click="starClick"
            color="#333"
          />
          <van-icon
            v-show="isStar"
            name="star"
            size="18"
            is-link
            @click="starClick"
            color="#FF7939"
          />
        </template>
      </van-nav-bar>

      <div class="phone-wrap">
        <div class="y-progress">
          <van-progress
            :percentage="percentage"
            pivot-text
            stroke-width="8"
            pivot-color="#7232dd"
            color="linear-gradient(to right, #27BFFE, #27A4FE)"
          />
          <span class="progress-tip">{{ current+1+'/'+total}}</span>
        </div>
        <div class="padding-lr y-question">
          <van-swipe
            class="my-swipe"
            autoplay="none"
            indicator-color="white"
            @change="change"
            :loop="false"
            ref="swipe"
          >
            <van-swipe-item v-for="(item,index) in dataList" :key="index">
              <Ti :data="item" @setAnswer="setAnswer" :showImportant="showImportant"></Ti>
            </van-swipe-item>
          </van-swipe>
        </div>

        <TabBar
          class="tabAbsolute"
          :showTypeList="showTypeList"
          @change="swipeChange"
          @submit="tabBarSubmit"
          @tika="tikaShowMethod"
        ></TabBar>
        <Tika
          :showSubmit="true"
          @submit="tikaSubmit"
          @close="tikaClose"
          @href="swipeHref"
          :show="tikaShow"
          :data="dataList"
          :current="current"
        ></Tika>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { mapState } from "vuex";
import TabBar from "../components/TabBars";
import Tika from "../components/Tikas";
import Ti from "../components/Tis";
import PcTop from "../components/PcTop";
import PcAnswers from "../components/PcAnswers";
import PcTika from "../components/PcTika";
export default {
  components: {
    TabBar,
    Tika,
    Ti,
    Dialog,
    PcTop,
    PcAnswers,
    PcTika
  },
  computed: {
    ...mapState({
      bank_id: state => state.question.bank_id,
      subject_id: state => state.question.subject_id,
      exam_id: state => state.question.exam_id,
      papers_id: state => state.question.papers_id,
      model: state => state.question.model,
      chapter_id: state => state.question.chapter_id,
      joint_id: state => state.question.joint_id,

      subject_List: state => state.question.zjList,
      zjList: state => state.question.zjList,

      question_type: state => state.question.question_type,
      exam_type: state => state.question.exam_type,
      exam_count: state => state.question.exam_count,

      startTime: state => state.question.startTime,
      titleName: state => state.question.titleName,

      // surplus_time: state => state.question.surplus_time
      moni_papers_id: state => state.question.moni_papers_id
    }),
    type() {
      let qtype = this.$store.state.question.type;
      if (qtype == 1) this.pctopIcon = "y-pc-zhangjie";
      if (qtype == 2) this.pctopIcon = "y-pc-quick";
      if (qtype == 3) this.pctopIcon = "y-pc-mock";

      return qtype;
    },
    percentage() {
      return ((this.current + 1) / this.total) * 100;
    },
    showTypeList() {
      if (this.type == 3) {
        // return ["tika", "submit", "time"]; //暂时注释
        return ["tika", "submit"];
      } else {
        return ["tika", "submit"];
      }
    }
  },
  created() {
    this.initData();
    // 做题倒计时
    window.onbeforeunload = () => {
      this.getAnalogyExamStop();
    };
    this.intervalSet = setInterval(() => {
      this.getAnalogyExamStop();
    }, 5500);
  },
  beforeDestroy() {
    clearInterval(this.intervalSet);
    this.getAnalogyExamStop();
  },
  data() {
    return {
      haveTime: 30 * 60 * 60 * 1000,
      // pc
      pctopIcon: "y-pc-mock",
      pcAnswersType: null,
      answerLen: 0,
      currentQuestion: {},
      // phone
      showImportant: false,
      showAnswer: false, //是否展示答案与解析
      current: 0, //当前第几道题
      total: 1, //总题数
      dataList: [], //题目数组
      tikaList: [], //pc题卡
      tikaShow: false, //题卡显示隐藏
      customColor: "#409eff",
      isStar: false //是否点赞
    };
  },

  methods: {
    haveTimeChange(val) {
      this.surplus_time =
        (val.days * 24 * 60 * 60 +
          val.hours * 60 * 60 +
          val.minutes * 60 +
          val.seconds) *
        1000;
    },
    //倒计时离开调用接口存储剩余时间
    getAnalogyExamStop() {
      if (this.type != 3) {
        return;
      }
      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        papers_id: this.moni_papers_id,
        surplus_time: this.surplus_time
      };
      if (param.papers_id) {
        this.$axios.post("/bank/getAnalogyExamStop", param);
      }
    },
    // pc
    biaoji() {
      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        papers_id: this.currentQuestion.papers_id,
        exam_id: this.currentQuestion.exam_id,
        type: this.currentQuestion.type
      };
      this.$axios.post("/bank/doTabQuestion", param).then(res => {
        this.currentQuestion.is_tab = this.currentQuestion.is_tab == 1 ? 0 : 1;
      });
    },
    nextTry() {
      this.pushUrl("/question");
    },
    currentSwipeRef() {
      // return "swipe";
      return this.$Common.isPc() ? "swipePc" : "swipe";
    },
    //交卷  bool true=>交卷立即查看结果   默认否
    doHandInPapers(bool) {
      let answer_time = Date.now() - this.startTime;
      let answer_time_text = this.$Common.formatDuring(answer_time);
      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        type: this.type,
        chapter_id: this.chapter_id,
        joint_id: this.joint_id,
        papers_id: this.papers_id,
        answer_time: answer_time
      };
      this.$axios.post("/bank/doHandInPapers", param).then(res => {
        if (res.code == 200) {
          let resStr =
            this.type == 3
              ? `耗时${answer_time_text}，得分${res.data.answer_score}分`
              : `耗时${answer_time_text}`;
          // 如果是pc,终止执行

          if (this.$Common.isPc()) {
            let resultPapers = {
              answer_time_text,
              answer_score: res.data.answer_score,
              list: this.resultPapers()
            };
            this.$store.commit("doHandInPapers", JSON.stringify(resultPapers));
            this.$router.push("/question/topic/resultPapers");
            return;
          }

          if (bool) {
            this.showImportant = true;
          } else {
            Dialog.confirm({
              cancelButtonText: "查看解析",
              confirmButtonText: "再做一遍",
              title: "该试卷已做完",
              message: resStr
            })
              .then(() => {
                this.$store.commit("zjList", "");
                this.$store.commit("startTime", Date.now());
                if (this.type == 3) {
                  this.$store.commit("papers_id", this.moni_papers_id);
                }
                window.location.reload();
                // this.initData();
              })
              .catch(() => {
                this.showImportant = true;
                // this.doHandInPapers();
              });
          }
        }
      });
    },
    setAnswer(answerObj) {
      let index = this.dataList.findIndex(
        item => item.exam_id == answerObj.exam_id
      );

      answerObj.showAnswer = this.showAnswer;
      this.$set(this.dataList, index, answerObj);
      if (this.$Common.isPc()) {
        this.tikaList = this.revertList(this.dataList);
        this.answerLen = this.getAnswer().already;
        this.currentQuestion = this.dataList[index];
      } else {
        this.swipeChange("next");
      }

      // 检测是否做完题
      this.testIsFinish();
    },
    testIsFinish() {
      console.log(this.dataList);
    },
    swipeHref(index) {
      let ref = this.currentSwipeRef();
      this.$refs[ref]["swipeTo"](index);
      this.tikaShow = false;
    },
    getShowAnswer(model) {
      if (model == 1) {
        this.$store.commit("model", 1);
      }
      if (this.type == 1 && this.model == 1) {
        this.pcAnswersType = "answer";
        this.showAnswer = true; //是否立即显示答案
      } else {
        this.showAnswer = false;
      }
    },
    initData() {
      this.$store.commit("startTime", Date.now());
      //有未做完得题
      if (this.zjList) {
        this.dataList = JSON.parse(this.zjList);
        this.getShowAnswer();
        this.total = this.dataList.length;
        this.current = 0;
        if (this.dataList[0]) {
          this.isStar = this.dataList[0].is_collect == 1;
          this.$store.commit("papers_id", this.dataList[0].papers_id);
        }
        this.$store.commit("zjList", "");
        this.tikaList = this.revertList(this.dataList);
        this.answerLen = this.getAnswer().already;
        this.currentQuestion = this.dataList[this.current];
        return;
      }

      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        type: this.type
      };
      if (this.type == 1) {
        param.chapter_id = this.chapter_id;
        param.joint_id = this.joint_id;
        param.question_type = this.question_type || "[1]";
        param.exam_type = this.exam_type || 1;
        param.exam_count = this.exam_count || 1;
        param.model = this.model;
      } else if (this.type == 2) {
        param.papers_id = this.papers_id;
      } else if (this.type == 3) {
        param.papers_id = this.papers_id;
      }
      this.$axios.post("/bank/doRandExamList", param).then(res => {
        if (res.code == 200) {
          if (this.type == 3) {
            this.haveTime = res.time;
          }
          this.getShowAnswer(res.model);
          this.dataList = [];
          this.dataList = this.formatExamList(res.data, this.showAnswer);
          this.total = this.dataList.length;
          this.current = 0;
          if (this.dataList[0]) {
            this.isStar = this.dataList[0].is_collect == 1;
            this.$store.commit("papers_id", this.dataList[0].papers_id);
            this.$store.commit(
              "moni_papers_id",
              this.dataList[0].moni_papers_id
            );
          }
          this.answerLen = this.getAnswer().already;
          this.currentQuestion = this.dataList[this.current];

          if (this.$route.query.jiaojuan) {
            this.doHandInPapers();
          }
        }
      });
    },
    formatExamList(list, showAnswer) {
      let tempList = Object.assign({}, list);
      let dataList = [];
      for (let i in tempList) {
        var arr = tempList[i];
        for (let j = 0; j < arr.length; j++) {
          if (i == 7) {
            arr[j].questionType = arr[j].real_question_type;
          } else {
            arr[j].questionType = i;
          }
          arr[j].showAnswer = showAnswer;
          if (j == 0) {
            arr[0].isFirstIndex = true;
          }
        }
        dataList = dataList.concat(arr);
      }
      dataList.map((item, index) => {
        item.index = index;
        return item;
      });
      this.tikaList = this.revertList(dataList);
      return dataList;
    },
    revertList(list) {
      let tempList = [...list];
      let dataList = [];
      let arr = [];
      for (let i = 0; i < tempList.length; i++) {
        if (tempList[i].isFirstIndex & (arr.length > 0)) {
          dataList.push(arr);
          arr = [];
        }
        arr.push(tempList[i]);
        if (i == tempList.length - 1) {
          dataList.push(arr);
        }
      }
      return dataList;
    },
    tikaClose() {
      this.tikaShow = false;
    },
    //tabBar题卡
    tikaShowMethod() {
      this.tikaShow = true;
      console.log("题卡");
    },
    //题卡 交卷并查看结果
    tikaSubmit() {
      this.tikaShow = false;
      let obj = this.getAnswer();
      if (obj.not > 0) {
        Dialog.confirm({
          title: "提示",
          message: `您还有${obj.not}道题没有做，是否提交？`
        }).then(() => {
          this.doHandInPapers(true);
        });
      } else {
        Dialog.confirm({
          title: "提示",
          message: `请确认是否交卷？`
        }).then(() => {
          this.doHandInPapers(true);
        });
      }
    },
    //tabBar提交
    tabBarSubmit() {
      let obj = this.getAnswer();
      if (obj.not > 0) {
        Dialog.confirm({
          title: "提示",
          message: `您还有${obj.not}道题没有做，是否提交？`
        }).then(() => {
          this.doHandInPapers();
        });
      } else {
        Dialog.confirm({
          title: "提示",
          message: `请确认是否交卷？`
        }).then(() => {
          this.doHandInPapers();
        });
      }
    },
    swipeChange(method) {
      let ref = this.currentSwipeRef();
      if (method == "next" && this.current == this.total - 1) {
        return;
      } else if (method == "prev" && this.current == 0) {
        return;
      }
      this.$refs[ref][method]();
    },
    change(index) {
      this.current = index;
      console.log(index);
      this.currentQuestion = this.dataList[this.current];
      this.isStar = this.dataList[index].is_collect == 1;
    },
    starClick() {
      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        papers_id: this.papers_id,
        exam_id: this.dataList[this.current].exam_id,
        type: this.type
      };
      this.$store.commit("exam_id", param.exam_id);
      this.$axios.post("/bank/doCollectQuestion", param).then(res => {
        if (res.code == 200) {
          this.isStar = !this.isStar;
          this.$set(
            this.dataList[this.current],
            "is_collect",
            this.isStar ? 1 : 0
          );
          this.$Toast(res.msg);
        } else {
          this.$Toast(res.msg);
        }
      });
    },
    //手机事件
    clickLeft() {
      console.log("left点击");
      this.$router.push("/question");
    },
    //获取答题信息
    getAnswer(arr) {
      let list = arr || this.dataList;
      var not = list.filter(item => item.is_right == 0).length;
      var right = list.filter(item => item.is_right == 1).length;
      var error = list.filter(item => item.is_right == 2).length;
      var already = list.filter(item => item.is_right != 0).length;
      return {
        not,
        right,
        error,
        already
      };
    },
    // 获取交卷答案信息
    resultPapers() {
      let resultPapersList = [];

      for (var papers of this.tikaList) {
        var text = !!papers[0].cailiao ? "材料题" : papers[0].exam_type_name;
        resultPapersList.push({
          text: text,
          right: this.getAnswer(papers).right,
          error: this.getAnswer(papers).error
        });
      }
      return resultPapersList;
    }
  }
};
</script> 

<style lang="less" scoped>
@import "../question.less";
.margin-b {
  margin-bottom: 25px;
}
/deep/ .van-nav-bar {
  z-index: 99;
}

/deep/ .DropDown .van-popup--top {
  width: 200px;
}
.phone-wrap {
  position: relative;
  margin: 0 auto;
  background-color: #fff;
}
.y-progress {
  position: relative;
  margin: 10px;
  height: 30px;
  padding: 0 60px 10px 10px;
  background-color: #fafafa;
  .progress-tip {
    position: absolute;
    right: 5px;
    top: 10px;
  }
}
/deep/ .van-progress {
  top: 16px;
}
/deep/ .phone-wrap .van-swipe {
  min-height: 65vh;
}
/deep/ .phone-wrap .van-swipe__track {
  min-height: 65vh;
  background-color: #fff;
}
.y-question {
  padding-bottom: 50px;
}

// pc
// 答案区域
.pc-answer {
  padding: 20px 25px;
  margin-top: 30px;
  width: auto;
  background-color: #f5f5f5;
}
</style>
