<template>
  <div class="container-fluid bj">
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
            </el-row>
          </div>
          <div slot="right">
            <el-button type="primary" @click="historyHref">查看解析</el-button>
          </div>
        </PcTop>
      </div>
      <el-row class="y-box padding">
        <el-col :span="6" :offset="2">
          <div class="text-c">
            <p class="font16">这次做题，您总共用了</p>
            <p class="font26 color-money margin-tb20">{{ doHandInPapers.answer_time_text }}</p>
            <p>
              <img class="margin-fu20" src="~static/image/pc_jiaojuan.png" alt />
            </p>
          </div>
        </el-col>
        <el-col :span="12" :offset="2">
          <table class="y-table" border="0" cellspacing="0">
            <tr>
              <th>题型</th>
              <th>正确</th>
              <th>错误</th>
            </tr>
            <tr v-for="(item,index) in doHandInPapers.list" :key="index">
              <td>{{ item.text }}</td>
              <td>{{ item.right }}</td>
              <td>{{ item.error }}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="24">
          <div class="text-c margin-tb50">
            <el-button type="primary" plain @click="historyHref">查看解析</el-button>
            <el-button type="primary" @click="pushUrl('/question/questionExercise')">返回做题</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PcTop from "../components/PcTop";
export default {
  components: {
    PcTop
  },
  computed: {
    ...mapState({
      doHandInPapers: state => JSON.parse(state.question.doHandInPapers),
      type: state => state.question.type,

      titleName: state => state.question.titleName
    })
  },
  created() {},

  data() {
    return {};
  },
  methods: {
    historyHref() {
      this.$router.push(
        "/question/recordQuestion/recordQuestionDetail?type=" + this.type
      );
    }
  }
};
</script> 

<style lang="less" scoped>
@import "../question.less";
.y-table {
  margin-top: 110px;
  width: 100%;
  th,
  td {
    height: 48px;
    border: none;
    font-size: 18px;
    text-align: center;
  }
  th {
    background-color: #e9f6ff;
    color: #333333;
    font-weight: bold;
  }
  td {
    background-color: #fbfbfb;
    color: #999999;
  }
}
.font26 {
  font-size: 26px;
}
.margin-fu20 {
  margin-left: -40px;
}
.y-box.padding {
  padding-top: 80px;
}
</style>
