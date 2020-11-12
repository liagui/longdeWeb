<template>
  <div class="container">
    <div v-if="questionList.length>0">
      <dl
        @click="questionClick(item)"
        class="question-list"
        v-for="(item,index) in questionList"
        :key="index"
      >
        <dt>
          <h4>{{item.name}}</h4>
        </dt>
        <dd class="item1">
          <p class="flex-center">
            <span class="y-circle bg-file"></span>
            <span>{{ item.make_date }}</span>
            <span class="y-circle bg-biao margin-l30"></span>
            <span>{{ item.make_time }}</span>
          </p>
          <p class="flex-center color-333">
            <span class="y-circle success"></span>
            <span>{{ item.collect_count }}</span>
            <span class="y-circle error margin-l10"></span>
            <span>{{ item.error_count }}</span>
          </p>
        </dd>
      </dl>
    </div>
    <div v-else>
      <NotQuestion text="科目下没有试题"></NotQuestion>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NotQuestion from "../components/NotQuestion";
export default {
  props: ["type"],
  components: {
    NotQuestion
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
      exerciseTab: state => state.question.exerciseTab
    })
  },
  data() {
    return {
      not: 0,
      questionList: []
    };
  },
  created() {
    this.initData();
    // console.log(111111);
  },
  watch: {
    subject_id(val) {
      this.initData();
    }
    // exerciseTab(val) {
    //   this.initData();
    // }
  },
  methods: {
    initData() {
      this.$axios
        .post("/bank/getMyMakeExamList", {
          bank_id: this.bank_id,
          subject_id: this.subject_id,
          type: this.type
        })
        .then(res => {
          if (res.code == 200) {
            this.questionList = res.data;
          } else {
            this.questionList = [];
          }
        });
    },
    questionClick(item) {
      this.$store.commit("chapter_id", item.chapter_id);
      this.$store.commit("joint_id", item.joint_id);
      this.$store.commit("papers_id", item.papers_id);
      this.$router.push("/question/recordQuestion/recordQuestionDetail?type="+this.type);
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
    padding-top: 10px;
    color: #bbbbbb;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.color-bbb {
  color: #bbbbbb;
}
.color-999 {
  color: #999;
}
.color-333 {
  color: #333;
}
.margin-l10 {
  margin-left: 10px;
}
.margin-l30 {
  margin-left: 30px;
}
.y-circle {
  width: 20px;
  height: 20px;
  margin-right: 2px;
  line-height: 20px;
}
</style>
