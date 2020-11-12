<template>
  <div>
    <van-notice-bar :scrollable="false" text="自由选择章节练习，知识点各个突破" />
    <div v-if="questionList.length>0">
      <dl class="question-list" v-for="(item,index) in questionList" :key="index">
        <dt @click="openQuestion(index,item)">
          <h4>{{item.chapters_name}}</h4>
          <span class="el-icon-arrow-up" :class="{'transY':activeIndex == index}"></span>
        </dt>
        <dd @click="openQuestion(index,item)" class="item1">
          <span class="el-icon-notebook-2"></span>
          <span>共计{{ item.exam_sum_count }}题</span>
        </dd>
        <dd v-show="activeIndex == index && item.joint_list">
          <div
            class="item2"
            @click="pushSetting(item,children)"
            v-for="(children,inde) in item.joint_list"
            :key="inde"
          >
            <div class="flex-center">
              <span class="circle-green"></span>
              <span>{{ children.joint_name }}</span>
            </div>
            <span class="color-bbb">共计{{ children.exam_count }}题</span>
          </div>
        </dd>
      </dl>
    </div>
    <div v-else>
      <NotQuestion text="科目下没有试题"></NotQuestion>
    </div>

    <van-dialog
      v-model="showProgess"
      title
      show-cancel-button
      class="showProgess"
      :showCancelButton="false"
      confirmButtonText="继续做题"
      :closeOnClickOverlay="true"
      @confirm="continueQuestion"
    >
      <div slot="default">
        <van-circle :rate="progess" size="120px" :text="progessText" :stroke-width="100" />
        <p>你还有{{this.not}}道题没做</p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NotQuestion from "../components/NotQuestion";
export default {
  components: {
    NotQuestion
  },
  computed: {
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
      zjList: state => state.question.zjList,
      exerciseTab: state => state.question.exerciseTab
    })
  },
  data() {
    return {
      usrParam: "",
      total: 0,
      not: 0,
      showProgess: false,
      progess: null, //进度
      progessText: "", //进度
      dataList: [],
      activeIndex: null,
      questionList: []
    };
  },
  created() {
    this.initData();
  },
  watch: {
    subject_id(val) {
      if (this.exerciseTab == 0) {
        this.initData();
      }
    },
    exerciseTab(val) {
      if (this.exerciseTab == 0) {
        this.initData();
      }
    }
  },
  methods: {
    continueQuestion() {
      this.$store.commit("startTime", Date.now());
      this.$router.push("/question/topic/examTest");
    },
    initData() {
      this.$axios
        .post("/bank/getBankChaptersList", {
          bank_id: this.bank_id,
          subject_id: this.subject_id
        })
        .then(res => {
          if (res.code == 200) {
            this.questionList = res.data;
          } else {
            this.questionList = [];
          }
        });
    },
    openQuestion(index, item) {
      //没有节
      if (item.joint_list && item.joint_list.length == 0) {
        let obj = {
          bank_id: this.bank_id,
          subject_id: this.subject_id,
          chapter_id: item.chapters_id,
          type: 1
        };
        this.$store.commit("titleName", item.chapters_name);
        for (let i in obj) {
          this.$store.commit(i, obj[i]);
        }
        this.getQuestionList(obj);
        return;
      }
      //有节
      if (index === this.activeIndex) {
        this.activeIndex = -1;
      } else {
        this.activeIndex = index;
      }
    },
    pushSetting(item, children) {
      if (!children.exam_count) {
        this.$Toast("此节没有试题");
        return;
      }
      let obj = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        chapter_id: item.chapters_id,
        joint_id: children.joint_id,
        type: 1
      };
      this.$store.commit("titleName", children.joint_name);
      for (let i in obj) {
        this.$store.commit(i, obj[i]);
      }
      this.getQuestionList(obj);
    },
    getQuestionList(param) {
      this.$axios.post("/bank/doRandExamList", param).then(res => {
        if (res.code == 200) {
          this.dataList = [];
          let show = res.model == "1" ? true : false;
          this.$store.commit("model", res.model);
          for (let i in res.data) {
            let arr = res.data[i];
            for (let item of arr) {
              item.questionType = i;
              if (i == 7) {
                item.questionType = item.real_question_type;
              } else {
                item.questionType = i;
              }
              item.showAnswer = show;
            }
            this.dataList = this.dataList.concat(arr);
          }
          this.dataList.map((item, index) => {
            item.index = index;
            return item;
          });
          this.$store.commit("zjList", JSON.stringify(this.dataList));
          this.not = this.dataList.filter(item => item.is_right == 0).length;
          this.total = this.dataList.length;
          this.progessText = this.total - this.not + "/" + this.total + "题";
          this.progess = (this.not / this.total) * 100;
          this.showProgess = true;
        } else {
          this.$router.push("/question/questionSetting");
        }
      });
    }
  }
};
</script> 

<style lang="less" scoped>
@import "../question.less";
.question-list {
  margin: 10px;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  & > dt {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .item1 {
    padding: 10px 0;
    color: #bbbbbb;
  }
  .item2 {
    padding: 10px 0;
    border-top: 1px solid #f3f3f3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .circle-green {
      margin: 0 5px;
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 5px;
      background-color: #83cd00;
    }
  }
}
.color-bbb {
  color: #bbbbbb;
}
.transY {
  transform: rotateX(180deg);
}
/deep/ path:nth-child(1) {
  stroke: #e7fbfe !important;
}
/deep/ path:nth-child(2) {
  stroke: #1ba6e0 !important;
}
/deep/ .van-dialog__content {
  padding: 20px 0;
}
.showProgess {
  text-align: center;
}
</style>
