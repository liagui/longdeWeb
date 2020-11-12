<template>
  <div class="container">
    <van-nav-bar @click-left="clickLeft" @click-right="clickRight" left-arrow title="做题设置">
      <!-- <template #title>
        <van-dropdown-menu>
          <van-dropdown-item v-model="value1" :options="option1" />
        </van-dropdown-menu>
      </template>
      <template #right>
        <van-icon name="apps-o" size="18" is-link @click="showDropDown" />
      </template>-->
    </van-nav-bar>
    <van-notice-bar :scrollable="false" :text="titleName" />
    <!-- 类型 -->
    <section class="handle-list">
      <h2>题型</h2>
      <section class="handle-wrap" ref="type">
        <label
          class="check-bg"
          v-for="(item,index) in settingInfo.exam_type_array"
          :class="{'active': addData.question_type.indexOf(item.type)>-1 }"
          :key="index"
        >
          {{item.name+'('+item.count+')'}}
          <input
            hidden
            type="checkbox"
            :value="item.type"
            v-model="addData.question_type"
          />
        </label>
      </section>
    </section>
    <!-- 分类 -->
    <section class="handle-list">
      <h2>分类</h2>
      <section class="handle-wrap">
        <label
          class="check-bg"
          :class="{'activeRadio':addData.exam_type==item.type}"
          v-for="(item,index) in settingInfo.type_array"
          :key="index"
        >
          {{item.name}}
          <input hidden type="radio" :value="item.type" v-model="addData.exam_type" />
        </label>
      </section>
    </section>
    <!-- 题量 -->
    <section class="handle-list">
      <h2>题量</h2>
      <section class="handle-wrap">
        <label
          class="check-bg"
          :class="{'activeRadio':addData.exam_count==item.type}"
          v-for="(item,index) in settingInfo.count_array"
          :key="index"
        >
          {{item.name}}
          <input hidden type="radio" :value="item.type" v-model="addData.exam_count" />
        </label>
      </section>
    </section>
    <!-- 做题模式 -->
    <section class="handle-list">
      <h2>做题模式</h2>
      <section class="flex-center mode">
        <div class="mode-l" @click="pushUrl('/question/topic/examTest','1')">
          <div class="padding10">
            <div class="font-title">练习模式</div>
            <p>做题后立即显示答案</p>
          </div>
        </div>
        <div class="mode-r" @click="pushUrl('/question/topic/examTest','2')">
          <div class="padding10">
            <div class="font-title">考试模式</div>
            <p>提交试卷后显示答案</p>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      bank_id: state => state.question.bank_id,
      subject_id: state => state.question.subject_id,
      chapter_id: state => state.question.chapter_id,
      joint_id: state => state.question.joint_id
    }),
    titleName() {
      if (
        this.settingInfo.type_array &&
        this.settingInfo.type_array.length > 0
      ) {
        let num = /\d+/.exec(this.settingInfo.type_array[0].name);
        let str = num[0] || 0;
        return "共" + str + "道题";
      }
    }
  },
  data() {
    return {
      settingInfo: {
        count_array: [],
        exam_type_array: [],
        type_array: []
      },
      addData: {
        question_type: [], //题型
        exam_type: "", //分类,
        exam_count: "" //题量,
      },
      questionTypeList: this.$store.state.question.questionTypeList, //题型
      radioList: [
        { text: "全部题", status: "0" },
        { text: "未作题", status: "1" },
        { text: "错题", status: "2" }
      ], // 分类
      questionNumberList: [
        { text: "30道题", status: "0" },
        { text: "60道题", status: "1" },
        { text: "100道题", status: "2" }
      ]
    };
  },
  created() {
    this.initData();
  },
  methods: {
    pushUrl(url, model) {
      this.$store.commit("type", 1);
      this.$store.commit("model", model);
      console.log(this.addData);
      if (this.addData.question_type.length == 0) {
        this.$Toast("请选择题型");
        return;
      }
      if (!this.addData.exam_type) {
        this.$Toast("请选择分类");
        return;
      }
      if (!this.addData.exam_count) {
        this.$Toast("请选择题量");
        return;
      }
      let param = Object.assign({}, this.addData);
      param.question_type = JSON.stringify(param.question_type);
      for (let i in param) {
        this.$store.commit(i, param[i]);
      }
      this.$router.push(url);
    },
    //手机事件
    clickLeft() {
      console.log("left点击");
      // this.$router.go(-1);
      this.$router.push("/question");
    },
    clickRight() {
      console.log("right点击");
    },
    initData() {
      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
        chapter_id: this.chapter_id,
        joint_id: this.joint_id
      };
      this.$axios.post("/bank/getExamSet", param).then(res => {
        if (res.code == 200) {
          let data = res.data;
          // data.exam_type_array = data.exam_type_array.filter(
          //   item => item.type <= 4
          // );
          this.settingInfo = data;
        } else {
          this.$Toast(res.msg);
        }
      });
    }
  }
};
</script> 

<style lang="less" scoped>
@import "../question.less";
.check-bg {
  width: 100px;
  height: 40px;
  background-image: url(~assets/image/question/hui.png);
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100% 100%;
  text-align: center;
  line-height: 40px;
  color: #999999;
}
.check-bg.active {
  color: #2891de;
  background-image: url(~assets/image/question/checkbox_active.png);
}
.check-bg.activeRadio {
  color: #2891de;
  background-image: url(~assets/image/question/radio_active.png);
}
.handle-list {
  max-width: 400px;
  margin: 20px auto 0;
  h2 {
    font-size: 18px;
    font-weight: bold;
    padding-left: 15px;
  }
}
.handle-wrap {
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  // align-items: flex-start;
  justify-content: space-between;
  .check-bg {
    margin-top: 15px;
  }
}
.mode {
  margin-top: 20px;
  justify-content: space-around;
  .font-title {
    font-size: 16px;
    font-weight: bold;
  }
  p {
    color: #86919d;
  }
  .mode-l,
  .mode-r {
    width: 155px;
    height: 94px;
    cursor: pointer;
  }
  .mode-l {
    background: url(~assets/image/question/kaoshi.png) center/cover no-repeat;
  }
  .mode-r {
    background: url(~assets/image/question/lianxi.png) center/cover no-repeat;
  }
  .padding10 {
    padding: 4px 10px;
  }
}
</style>
