<template>
  <div>
    <!-- phone -->
    <div class="container hidden-md-and-up phone-question-wrap">
      <van-nav-bar @click-left="clickLeft" left-arrow>
        <template #title>
          <van-dropdown-menu>
            <van-dropdown-item v-model="value1" :options="subject_List" />
          </van-dropdown-menu>
        </template>
        <template #right>
          <van-icon ref name="apps-o" size="18" is-link @click="showDropDown" />
        </template>
      </van-nav-bar>
      <DropDown
        :show="showDrop"
        :list="dropList"
        @close="closeDrop"
        @change="changeDrop"
        class="DropDown"
        ref="DropDown"
      />
      <div class="phone-wrap bg-hui">
        <van-tabs v-model="tabActive" swipeable>
          <van-tab title="章节练习">
            <ChapterExercise />
          </van-tab>
          <van-tab title="快速做题">
            <QuickExercise />
          </van-tab>
          <van-tab title="模拟真题">
            <AnalogExercise />
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <!-- pc -->
    <div class="hidden-sm-and-down pc-question-wrap">
      <div class="question-pc">
        <div class="y-box">
          <PcTop class="margin-b20">
            <div slot="left">
              <el-dropdown class="y-drop-down" @command="handleCommand">
                <span class="el-dropdown-link">
                  {{value1Name}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,index) in subject_List"
                    :key="index"
                    :command="item.subject_id"
                  >{{ item.subject_name }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="ex-btn-wrap" slot="center">
              <div
                class="ex-btn"
                v-for="(item,index) in pcDropList"
                :key="index"
                @click="changeDrop(item)"
              >
                <i :class="item.icon+' y-icon'"></i>
                <span>{{ item.name }}</span>
              </div>
            </div>
            <div slot="right">
              <el-button @click="quickPushUrl" type="primary">快速做题</el-button>
            </div>
          </PcTop>
          <p class="historyRecord flex-between" v-for="(item,index) in prevDataList" :key="index">
            <span>
              最近做题记录 :
              <span>{{ item.name }}&nbsp;&nbsp;已做{{ item.make_exam_count+'/'+item.sum_exam_count }}</span>
              <a class="color-money margin-l10" @click="continueClick(item)">继续做题</a>
            </span>
            <i @click="delHistory(index)" class="el-icon-error"></i>
          </p>
        </div>
        <div class="y-box">
          <div class="y-tab">
            <span @click="pcTabChange(0)" :class="{active:tabActive==0}">章节练习</span>
            <span @click="pcTabChange(2)" :class="{active:tabActive==2}">模拟真题</span>
          </div>
          <div class="bg-hui pc">
            <ChapterExercise v-show="tabActive==0" />
            <AnalogExercise v-show="tabActive==2" />
          </div>
          <!-- <div>
            <div class="y-collapse-title flex-between">
              <div>
                <i class="el-icon-arrow-up margin-r10"></i>
                <span>第一章：想法范德萨范德萨</span>
              </div>
              <div>
                <span class="margin-r50">
                  共
                  <span class="color-money">111</span>道
                </span>

                <el-button type="primary">开始做题</el-button>
              </div>
            </div>
            <div class="y-collapse-content">

            </div>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// phone
import DropDown from "@/components/DropDown";
import ChapterExercise from "./ChapterExercise";
import QuickExercise from "./QuickExercise";
import AnalogExercise from "./AnalogExercise";
import PcTop from "../components/PcTop";
export default {
  components: {
    // phone
    DropDown,
    ChapterExercise,
    QuickExercise,
    AnalogExercise,
    // pc
    PcTop
  },
  computed: {
    ...mapState({
      bank_id: state => state.question.bank_id,
      subject_id: state => state.question.subject_id,
      exerciseTab: state => state.question.exerciseTab,
      subject_List: state => {
        let arr = JSON.parse(state.question.subject_List);
        if (arr instanceof Array) {
          arr = arr.map(item => {
            item.text = item.subject_name;
            item.value = item.subject_id;
            return item;
          });
          return arr;
        }
      }
    })
  },
  data() {
    return {
      // phone
      dropList: [],
      showDrop: false,
      value1: 0,
      value1Name: "",
      tabActive: 0,
      // pc
      pcDropList: [],
      prevDataList: []
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.exerciseTab == null) {
        this.$store.commit("exerciseTab", 0);
      }
      this.tabActive = Number(this.exerciseTab);
      this.value1 = Number(this.subject_id);
      this.getTitleName();
    });
    this.getDrop();
    this.prevInitData();
  },
  watch: {
    value1(val, old) {
      if (val != old) {
        this.$store.commit("subject_id", val);
        this.getTitleName();
        this.getDrop();
        this.prevInitData();
      }
    },
    tabActive(val, old) {
      if (val != old) {
        this.$store.commit("exerciseTab", val);
      }
    }
  },
  methods: {
    // phone
    getDrop() {
      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id
      };
      this.$axios.post("/bank/getCollectErrorExamCount", param).then(res => {
        if (res.code == 200) {
          let data = res.data;
          this.dropList = [
            {
              name: "我的收藏(" + data.collect_count + ")",
              count: data.collect_count,
              text: "您没有收藏任何题目",
              path: "/question/collectionQuestion"
            },
            {
              name: "错题本(" + data.error_count + ")",
              count: data.error_count,
              text: "您没有错题",
              path: "/question/errorQuestion"
            },
            {
              name: "做题记录(" + data.exam_count + ")",
              count: data.exam_count,
              text: "您没有做题记录",
              path: "/question/recordQuestion"
            }
          ];
          this.pcDropList = [
            {
              name: "错题本(" + data.error_count + ")",
              count: data.error_count,
              text: "您没有错题",
              icon: "bg-error",
              path: "/question/errorQuestion"
            },
            {
              name: "收藏(" + data.collect_count + ")",
              count: data.collect_count,
              text: "您没有收藏任何题目",
              icon: "bg-collect",
              path: "/question/collectionQuestion"
            },

            {
              name: "记录(" + data.exam_count + ")",
              count: data.exam_count,
              text: "您没有做题记录",
              icon: "bg-record",
              path: "/question/recordQuestion"
            }
          ];
        }
      });
    },
    changeDrop(item) {
      this.showDrop = false;
      if (item.count > 0) {
        this.$router.push(item.path);
      } else {
        this.$Toast(item.text);
      }
    },
    closeDrop() {
      this.showDrop = false;
    },
    showDropDown(e) {
      if (this.dropList.length == 0) {
        this.$Toast("无做题权限");
        return;
      }
      this.showDrop = true;
      setTimeout(() => {
        this.$refs.DropDown.$children[0].$el.style.top = e.clientY + "px";
        this.$refs.DropDown.$children[0].$el.style.left =
          e.clientX - 180 + "px";
      }, 10);
    },
    clickLeft() {
      this.$router.push("/question");
    },
    // pc\
    getTitleName() {
      this.value1Name = this.subject_List.find(
        item => item.subject_id == this.subject_id
      ).subject_name;
      this.$store.commit("titleName", this.value1Name);
    },
    handleCommand(val) {
      this.value1 = val;
    },
    pcTabChange(val) {
      this.tabActive = val;
    },
    prevInitData() {
      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id
      };
      this.$axios.post("/bank/getNewMakeExamInfo", param).then(res => {
        if (res.code == 200) {
          this.prevDataList = res.data;
        } else {
          this.prevDataList = [];
        }
      });
    },
    continueClick(item) {
      this.$store.commit("zjList", "");
      this.$store.commit("type", item.type);

      this.$store.commit("titleName", item.name);

      //章节练习
      if (item.type == 1) {
        this.$store.commit("chapter_id", item.chapter_id);
        this.$store.commit("joint_id", item.joint_id);
      } else if (item.type == 2) {
        //快速做题
        this.$store.commit("papers_id", item.papers_id);
      } else if (item.type == 3) {
        //模拟真题
        this.$store.commit("papers_id", item.papers_id);
      }
      this.$router.push("/question/topic/examTest");
    },
    quickPushUrl(id) {
      this.$store.commit("zjList", "");
      this.$store.commit("type", 2);
      this.$store.commit("startTime", Date.now());
      // if (id) {
      //   this.$store.commit("papers_id", id);
      // }
      this.$router.push("/question/topic/examTest");
    },
    delHistory(index) {
      this.prevDataList.splice(index, 1);
    }
  }
};
</script> 

<style lang="less" scoped>
@import "../question.less";
/deep/ .van-nav-bar {
  z-index: 99;
}

/deep/ .DropDown .van-popup--top {
  width: 200px;
}

// pc
.bg-hui.pc {
  padding-bottom: 20px;
}
.margin-b20 {
  margin-bottom: 20px;
}
.el-icon-error {
  font-size: 16px;
  cursor: pointer;
}

.historyRecord {
  margin-top: 10px;
  position: relative;
  font-size: 12px;
  color: #999;
  background-color: #f6f6f6;
  padding: 10px 20px;
}
.margin-r10 {
  margin-right: 10px;
}
.margin-r50 {
  margin-right: 50px;
}
.y-collapse-title {
  padding: 0 20px;
  height: 67px;
  background: rgba(245, 245, 245, 1);
}
.container {
  // padding: 30px 0;
}
.y-drop-down {
  width: 200px;
  text-align: center;
  .el-dropdown-link {
    cursor: pointer;
    font-weight: 500;
    font-size: 18px;
    color: #333;
  }
  .el-icon-arrow-down {
    font-size: 24px;
    color: #333;
  }
}
.ex-btn-wrap {
  width: 500px;
}

.ex-btn {
  float: left;
  margin-left: 20px;
  width: 140px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(6, 16, 57, 0.09);
  box-shadow: 0px 0px 5px 0px rgba(6, 16, 57, 0.09);
  cursor: pointer;
}
.y-icon {
  width: 28px;
  height: 28px;
  margin-right: 10px;
}
.bg-error {
  background-image: url(~assets/image/question/WechatIMG389@2x.png);
}
.bg-collect {
  background-image: url(~assets/image/question/WechatIMG390@2x.png);
}
.bg-record {
  background-image: url(~assets/image/question/WechatIMG391@2x.png);
}
.y-tab {
  margin-bottom: 30px;
  span {
    position: relative;
    margin-right: 65px;
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
    display: inline-block;
    font-size: 18px;
    font-weight: 400;
    color: #999;
    cursor: pointer;
  }
  span.active {
    font-weight: 500;
    color: #333;
    &::after {
      content: "";
      display: inline-block;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: #27a3fd;
      border-radius: 2px;
    }
  }
}
</style>
