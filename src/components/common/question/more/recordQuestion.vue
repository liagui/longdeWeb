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
      </van-nav-bar>
      <div class="phone-wrap bg-hui">
        <van-tabs v-model="tabActive" swipeable>
          <van-tab title="章节练习">
            <Record :type="1" />
          </van-tab>
          <van-tab title="快速做题">
            <Record :type="2" />
          </van-tab>
          <van-tab title="模拟真题">
            <Record :type="3 " />
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <!-- pc -->
    <div class="hidden-sm-and-down pc-question-wrap">
      <div class="question-pc">
        <div class="y-box">
          <PcTop>
            <div slot="left">
              <div class="y-icon y-pc-title"></div>
              <div class="y-icon y-pc-jilu"></div>
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
              <el-button @click="pushUrl('/question/questionExercise')" type="primary" plain>返回做题</el-button>
            </div>
          </PcTop>
        </div>

        <ul class="y-table">
          <li v-for="(item,index) in dataList" :key="index">
            <div class="item1">{{ item.make_date }}</div>
            <!-- <div class="item2">{{ $Common.formatDuring(item.answer_time) }}</div> -->
            <div class="item3">
              <van-circle
                :value="item.percentage"
                :clockwise="false"
                size="20px"
                :stroke-width="200"
              />
            </div>
            <div class="item4">
              <span class="table-tip-btn" :class="getTipBg(item.type)">{{ item.type_name }}</span>
              <span class="item4-margin">|</span>
              <span class="question-name">{{ item.name }}</span>
            </div>
            <div class="item5">
              <span class="flex2">共{{ item.sum_exam_count }}题</span>
              <div class="flex-center color-333 flex3">
                <span class="y-circle success"></span>
                <span>{{ item.collect_count }}</span>
                <span class="y-circle error margin-l10"></span>
                <span>{{ item.error_count }}</span>
              </div>
              <span class="flex2">
                <span v-if="item.type==3">得分：{{ Number(item.answer_score) }}</span>
              </span>
            </div>
            <div class="item6 y-handle-btn">
              <el-button @click="handleClick(item)" v-if="item.is_over==0" type="primary" plain>继续做题</el-button>
              <el-button
                @click="handleClick(item,'again')"
                v-if="item.is_over==1 && item.type==3"
                class="bg-fff"
                type="primary"
                plain
              >再考一遍</el-button>
              <el-button
                @click="handleClick(item,'jiexi')"
                v-if="item.is_over==1"
                type="primary"
              >查看解析</el-button>
            </div>
          </li>
        </ul>
        <div class="paging">
          <el-pagination
            background
            layout="prev, pager, next, total"
            @current-change="handleCurrentChange"
            :page.sync="page"
            :page-size="pagesize"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { mapState } from "vuex";
import Record from "../components/Record";
import PcTop from "../components/PcTop";
export default {
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
      },

      titleName: state => state.question.titleName,
      papers_id: state => state.question.papers_id
    })
  },
  components: {
    Record,
    PcTop
  },
  data() {
    return {
      phoneBg: "#f3f3f3",
      dropList: [],
      showDrop: false,
      value1: 0,
      tabActive: 0,
      page: 1,
      pagesize: 10,
      total: 0,
      dataList: []
    };
  },
  created() {
    this.initData();
    this.$nextTick(() => {
      this.tabActive = Number(this.exerciseTab);
      this.value1 = Number(this.subject_id);
    });
  },
  watch: {
    value1(val, old) {
      if (val != old) {
        this.$store.commit("subject_id", val);
      }
    },
    tabActive(val, old) {
      if (val != old) {
        this.$store.commit("exerciseTab", val);
        this.$store.commit("type", val + 1);
      }
    }
  },
  methods: {
    initData() {
      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        pagesize: this.pagesize,
        page: this.page
      };
      this.$axios.post("/bank/getMyMakeExamPageList", param).then(res => {
        if (res.code == 200) {
          this.dataList = res.data.list;

          this.total = res.data.count;
        }
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.initData();
    },
    getTipBg(type) {
      if (type == 1) return "bg-primary";
      if (type == 2) return "bg-warning";
      if (type == 3) return "bg-zi";
      return "bg-primary";
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
    handleClick(item, clickType) {
      this.$store.commit("zjList", "");
      this.$store.commit("type", item.type);
      this.$store.commit("papers_id", item.papers_id);
      this.$store.commit("titleName", item.name);

      //章节练习
      if (item.type == 1) {
        this.$store.commit("chapter_id", item.chapter_id);
        this.$store.commit("joint_id", item.joint_id);
      } else if (item.type == 3) {
        this.$store.commit("moni_papers_id", item.moni_papers_id);
      }

      if (clickType == "jiexi") {
        this.$router.push(
          "/question/recordQuestion/recordQuestionDetail?type=" + item.type
        );
      } else if (clickType == "again") {
        this.isContinue(item.moni_papers_id);
      } else {
        this.$router.push("/question/topic/examTest");
      }
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

/deep/ path:nth-child(1) {
  stroke: #e7fbfe !important;
}
/deep/ path:nth-child(2) {
  stroke: #1ba6e0 !important;
}
/deep/ .van-dialog__content {
  padding: 20px 0;
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

.y-table {
  color: #666;
  background-color: #f3f3f3;
  width: 100%;
  li {
    padding: 30px 0;
    margin: 10px 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .item1 {
      width: 90px;
    }
    .item2 {
      width: 80px;
    }
    .item3 {
      width: 30px;
      display: flex;
      align-items: center;
    }
    .item4 {
      display: flex;
      align-items: center;
      width: 350px;
      .item4-margin {
        margin: 0 10px;
      }
      .question-name {
        display: inline-block;
        width: 250px;
      }
    }
    .item5 {
      width: 300px;
      display: flex;
      align-items: center;
    }
    .item6 {
      width: 185px;
    }
  }
  .el-button {
    padding: 6px 13px;
    border-radius: 0;
  }
  .el-button--primary.is-plain.bg-fff {
    background-color: #fff;
    color: #27a4fe;
  }
  .el-button--primary.is-plain.bg-fff:hover {
    background-color: #b3d8ff;
    color: #409eff;
  }
  .y-handle-btn {
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }
  .table-tip-btn {
    padding: 2px 10px;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    transition: 0.1s;
  }
  .bg-primary {
    color: #409eff;
    background: #ecf5ff;
  }
  .bg-warning {
    color: #fe7d27;
    background: #ffe6d4;
  }
  .bg-zi {
    color: #c927fe;
    background: #f4d4ff;
  }
}
.paging {
  margin: 40px auto;
  text-align: center;
}
</style>
