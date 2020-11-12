<template>
  <div>
    <van-notice-bar :scrollable="false" text="模拟真实考试场景知识点综合评测" />

    <el-row :gutter="24" v-if="dataList.length>0">
      <el-col :xs="12" :sm="8" :md="6" v-for="(item,index) in dataList" :key="index">
        <div class="q-moni-box">
          <div class="moni-box" :class="{'active':item.is_over==0}">
            <h4>{{ item.papers_name }}</h4>
            <div class="items">
              <span class="q-icon"></span>
              <span>时间：</span>
              <span>{{ item.papers_time }}分钟</span>
            </div>
            <!-- <div class="items" v-if="item.is_over==1">
              <span class="q-icon"></span>
              <span>耗时：</span>
              <span>{{ item.answer_time }}</span>
            </div>-->
            <div class="items">
              <span class="q-icon"></span>
              <span>总分：</span>
              <span>{{ item.papers_sum_score }}分</span>
            </div>
            <div class="items" v-if="item.is_over==1">
              <span class="q-icon"></span>
              <span>得分：</span>
              <span class="color-yellow">{{item.sum_score}}分</span>
            </div>
            <div class="text-c moni-handle">
              <van-button
                v-if="item.is_over==0"
                round
                color="linear-gradient(to right, #2EC1FE, #2EA1FE)"
                size="large"
                @click="startQuestion(item)"
              >开始做题</van-button>
              <van-button
                v-else
                round
                color="linear-gradient(to right, #2EC1FE, #2EA1FE)"
                size="large"
                @click="startQuestion(item)"
              >继续做题</van-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-else>
      <NotQuestion text="没有对应的试卷"></NotQuestion>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
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
      chapter_id: state => state.question.chapter_id,
      joint_id: state => state.question.joint_id,
      exerciseTab: state => state.question.exerciseTab,
      papers_id: state => state.question.papers_id
    })
  },
  data() {
    return {
      dataList: [],
      moni_papers_id: "",
      type: 3
    };
  },
  created() {
    this.initData();
  },
  watch: {
    subject_id(val) {
      if (this.exerciseTab == 2) {
        this.initData();
      }
    },
    exerciseTab(val) {
      if (this.exerciseTab == 2) {
        this.initData();
      }
    }
  },
  methods: {
    startQuestion(item) {
      this.$store.commit("papers_id", item.papers_id);
      this.$store.commit("type", 3);
      this.$store.commit("startTime", Date.now());
      this.$store.commit("titleName", item.papers_name);
      if (item.is_over == 0) {
        this.isContinue(item.papers_id);
      } else {
        this.$router.push("/question/topic/examTest");
      }
    },
    isContinue(papers_id) {
      this.$axios
        .post("/bank/getPapersIdByMoId", {
          bank_id: this.bank_id,
          subject_id: this.subject_id,
          papers_id: papers_id
        })
        .then(res => {
          if (res.data) {
            Dialog.confirm({
              title: "提示",
              cancelButtonText: "继续做题",
              confirmButtonText: "交卷",
              title: "您还有未做完的题，是否交卷？"
            })
              .then(() => {
                this.$router.push("/question/topic/examTest?jiaojuan=true");
              })
              .catch(() => {
                this.$router.push("/question/topic/examTest");
              });
          } else {
            this.$router.push("/question/topic/examTest");
          }
        });
    },
    initData() {
      this.$axios
        .post("/bank/getExamPapersList", {
          bank_id: this.bank_id,
          subject_id: this.subject_id
        })
        .then(res => {
          if (res.code == 200) {
            this.dataList = res.data;
            // this.$store.commit("papers_time");
          } else {
            this.dataList = [];
          }
        });
    }
  }
};
</script> 

<style lang="less" scoped>
@import "../question.less";
.q-moni-box {
  margin-top: 15px;
  padding: 10px;
}
.moni-box {
  position: relative;
  padding: 10px 20px;
  height: 205px;
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  .moni-handle {
    position: absolute;
    bottom: 15px;
    left: 20px;
    right: 20px;
  }
  &::after {
    content: "";
    position: absolute;
    left: 10%;
    top: -4px;
    width: 80%;
    height: 10px;
    border-radius: 10px;
    background-color: #dce8ed;
  }
  h4 {
    padding: 10px 0;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .items {
    margin: 5px 0;
  }
  .items span:nth-child(2) {
    color: #999;
  }
  .padding-tb {
    padding: 4px 0;
  }
}
.moni-box.active::after {
  background-color: #69c0ff;
}
.color-yellow {
  color: #ffa905;
}
/deep/ .el-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
/deep/ .el-col {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
