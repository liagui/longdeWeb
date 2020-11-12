<template>
  <div class="question-pc">
    <div class="y-box">
      <PcTop>
        <div slot="left">
          <!-- <div class="y-icon y-pc-title"></div>
          <div class="y-icon y-pc-mock"></div> -->
          {{ titleName }}
          <el-button @click="goback" type="primary">返回做题记录</el-button>
        </div>
        <!-- <div slot="center">
          <el-row class="flex-center">
            <el-col :span="12">{{ titleName }}</el-col>
            <el-col :span="12" class="flex-center">
              <i class="y-icon y-pc-time"></i>
              <span class="color-main font20 margin-l10 bold">00:00:34</span>
            </el-col>
          </el-row>
        </div>
        <div slot="right">
          <el-button @click="pushUrl('/question/questionExercise')" type="primary">返回做题</el-button>
        </div> -->
      </PcTop>
    </div>
    <el-row>
      <el-col :span="5">
        <div class="y-box">
          <p class="text-c font24 padding-tb20">
            共{{ dataList.length }}题 已做
            <span class="color-main bold">{{ answerLen }}</span>题
          </p>
          <PcTika @swipeHref="swipeHref" :data="tikaList" :current="current" />
        </div>
      </el-col>
      <el-col :span="19">
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
              </p>
              <!-- 答案区域 -->
              <PcAnswers :currentQuestion="currentQuestion" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _request from "@/utils/request";
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
  created() {
    let query = this.$route.query;
    this.paramObj = {
      bank_id: query.bank_id,
      subject_id: query.subject_id,
      papers_id: query.papers_id,
      student_id: query.student_id,
      type: query.type
    };
    this.titleName = query.papers_name || ''
    this.initData();
  },
  data() {
    return {
      paramObj: {
        bank_id: null,
        subject_id: null,
        papers_id: null,
        student_id: null,
        type: null
      },
      // pc
      titleName: "",
      tikaList: [],
      answerLen: 0,
      currentQuestion: {},
      // phone
      showAnswer: false, //是否展示答案与解析
      current: 0, //当前第几道题
      total: null, //总题数
      dataList: [], //题目数组
      tikaShow: false //题卡显示隐藏
    };
  },

  methods: {
    goback(){
      this.$router.go(-1);
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
      return 'swipePc'
    },
    // phone
    swipeHref(index) {
      let ref = this.currentSwipeRef();
      this.$refs[ref]["swipeTo"](index);
      this.tikaShow = false;
    },
    initData() {
      console.log(this.paramObj);
      _request
        .http(this, "student/getStudentBankDetails", this.paramObj)
        .then(res => {
          if (res.code == 200 && Object.keys(res.data).length > 0) {
            this.dataList = [];
            this.dataList = this.formatExamList(res.data, true);
            this.total = this.dataList.length;
            this.answerLen = this.getAnswer().already;
            this.currentQuestion = this.dataList[this.current];
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
      this.currentQuestion = this.dataList[this.current];
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
