<template>
  <div>
    <van-notice-bar :scrollable="false" text="随机抽取一定数量试题，碎片化学习更方便" />

    <div class="box-wrap" v-if="dataList.length>0">
      <div
        class="padding-lr"
        v-for="(item,index) in dataList"
        :key="index"
        @click="questionClick(item)"
      >
        <div>
          <p class="font-title">{{ item.name }}</p>
          <p class="font-des">{{ item.make_date +' '+ item.make_time}}</p>
        </div>
        <el-button v-if="item.is_over==0" @click="pushUrl(item.papers_id)" type="primary" plain>继续做题</el-button>
      </div>
    </div>

    <div v-else class="text-c">
      <NotQuestion text="您还没有做题记录"></NotQuestion>
    </div>
    <div class="text-c">
      <van-button
        v-if="showBtn"
        @click="pushUrl()"
        round
        color="linear-gradient(to right, #2EC1FE, #2EA1FE)"
        class="btn-large"
      >开始做题</van-button>
    </div>
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
      exerciseTab: state => state.question.exerciseTab
    })
  },
  watch: {
    subject_id(val) {
      if (this.exerciseTab == 1) {
        this.initData();
      }
    },
    exerciseTab(val) {
      if (this.exerciseTab == 1) {
        this.initData();
      }
    }
  },
  data() {
    return {
      showBtn: false,
      dataList: []
    };
  },
  created() {
    this.initData();
  },
  methods: {
    questionClick(item) {
      if (item.is_over == 0) {
        return;
      }
      this.$store.commit("chapter_id", item.chapter_id);
      this.$store.commit("joint_id", item.joint_id);
      this.$store.commit("papers_id", item.papers_id);
      this.$router.push("/question/recordQuestion/recordQuestionDetail?type=2");
    },
    initData() {
      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        type: 2
      };
      this.$axios
        .post("/bank/getMyMakeExamList", param)
        .then(res => {
          if (res.code == 200) {
            this.dataList = res.data;

            this.showBtn = this.dataList.every(item => item.is_over != 0);
          } else if (res.code == 203) {
            this.showBtn = true;
          } else {
            this.dataList = [];
            this.showBtn = false;
          }
        })
        .catch(() => {
          this.showBtn = false;
        });
    },
    pushUrl(id) {
      this.$store.commit("zjList", "");
      this.$store.commit("type", 2);
      this.$store.commit("startTime", Date.now());
      if (id) {
        this.$store.commit("papers_id", id);
      }
      this.$router.push("/question/topic/examTest");
    }
  }
};
</script> 

<style lang="less" scoped>
@import "../question.less";
.btn-large {
  padding-left: 40px;
  padding-right: 40px;
}
.box-wrap {
  background: none;
}
.padding-lr {
  border-radius: 10px;
  margin: 10px 0;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
}
.start-btn {
  padding: 30px;
  text-align: center;
}
</style>
