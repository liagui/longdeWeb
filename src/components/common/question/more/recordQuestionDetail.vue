<template>
  <div>
    <!-- phone -->
    <div class="container hidden-md-and-up phone-question-wrap">
      <van-nav-bar @click-left="clickLeft" left-arrow title="做题记录">
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
        <div class="y-progress" v-if="total">
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
              <Ti :data="item" :showImportant="true"></Ti>
            </van-swipe-item>
          </van-swipe>
        </div>

        <TabBar
          class="tabAbsolute"
          :showTypeList="['tika']"
          @change="swipeChange"
          @tika="tikaShowMethod"
        ></TabBar>
        <Tika
          @close="tikaClose"
          @href="swipeHref"
          :show="tikaShow"
          :data="dataList"
          :current="current"
        ></Tika>
      </div>
    </div>
    <!-- pc -->
    <div class="hidden-sm-and-down pc-question-wrap">
      <div class="question-pc">
        <div class="y-box">
          <PcTop>
            <div slot="left">
              <div class="y-icon y-pc-title"></div>
              <div class="y-icon y-pc-mock"></div>
            </div>
            <div slot="center">
              <el-row class="flex-center">
                <el-col :span="12">{{ titleName }}</el-col>
                <el-col :span="12" class="flex-center">
                  <!--<i class="y-icon y-pc-time"></i>
                  <span class="color-main font20 margin-l10 bold">00:00:34</span>-->
                </el-col>
              </el-row>
            </div>
            <div slot="right">
              <el-button @click="pushUrl('/question/questionExercise')" type="primary">返回做题</el-button>
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
                      <Ti :data="item" :showImportant="true"></Ti>
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
                  <PcAnswers :currentQuestion="currentQuestion" />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
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
    PcTop,
    PcAnswers,
    PcTika
  },
  computed: {
    percentage() {
      return ((this.current + 1) / this.total) * 100;
    },
    ...mapState({
      bank_id: state => state.question.bank_id,
      subject_id: state => state.question.subject_id,
      type: state => state.question.type,
      chapter_id: state => state.question.chapter_id,
      joint_id: state => state.question.joint_id,
      papers_id: state => state.question.papers_id,

      titleName: state => state.question.titleName
    })
  },
  created() {
    this.initData();
  },
  data() {
    return {
      // pc
      tikaList: [],
      answerLen: 0,
      currentQuestion: {},
      // phone
      showAnswer: false, //是否展示答案与解析
      current: 0, //当前第几道题
      total: null, //总题数
      dataList: [], //题目数组
      tikaShow: false, //题卡显示隐藏
      customColor: "#409eff",
      isStar: false //是否点赞
    };
  },

  methods: {
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
    currentSwipeRef() {
      // return "swipe";
      return this.$Common.isPc() ? "swipePc" : "swipe";
    },
    // phone
    swipeHref(index) {
      let ref = this.currentSwipeRef();
      this.$refs[ref]["swipeTo"](index);
      this.tikaShow = false;
    },
    initData() {
      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        type: this.$route.query.type,
        chapter_id: this.chapter_id, //	章id(注:只有章节练习时需要传)
        joint_id: this.joint_id, //	节id(注:只有章节练习时需要传)
        papers_id: this.papers_id //试卷id(注:只有模拟真题时需要传)
      };

      this.$axios.post("/bank/getMakeExamInfo", param).then(res => {
        if (res.code == 200 && Object.keys(res.data).length > 0) {
          this.dataList = [];
          this.dataList = this.formatExamList(res.data, true);
          this.total = this.dataList.length;
          this.answerLen = this.getAnswer().already;
          this.currentQuestion = this.dataList[this.current];
          if (this.dataList[0]) {
            this.isStar = this.dataList[0].is_collect == 1;
          }
        }
      });
    },
    tikaClose() {
      this.tikaShow = false;
    },
    //tabBar题卡
    tikaShowMethod() {
      this.tikaShow = true;
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
      this.isStar = this.dataList[index].is_collect == 1;
      this.currentQuestion = this.dataList[this.current];
    },
    starClick() {
      let param = {
        papers_id: this.papers_id,
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        exam_id: this.dataList[this.current].exam_id,
        type: this.dataList[this.current].type
      };
      // param.type = this.$Common.statusToCode(this.query.status);
      this.$axios.post("/bank/doCollectQuestion", param).then(res => {
        if (res.code == 200) {
          this.isStar = !this.isStar;
          this.$set(
            this.dataList[this.current],
            "is_collect",
            this.isStar ? 1 : 0
          );
          if (this.current > 0) {
            this.current = this.current - 1;
          }
          this.$Toast(res.msg);
        } else {
          this.$Toast(res.msg);
        }
      });
    }
    //手机事件
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
  min-height: 80vh;
}
/deep/ .phone-wrap .van-swipe__track {
  min-height: 80vh;
  background-color: #fff;
}
.y-question {
  padding-bottom: 50px;
}
</style>
