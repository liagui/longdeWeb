<template>
  <div class="van-hairline--top-bottom van-tabbar van-tabbar--fixed" ref="tabBar">
    <div class="van-tabbar-item" @click="toggle('prev')">
      <div class="van-tabbar-item__icon">
        <span class="q_bg q_left_bg"></span>
      </div>
      <div class="van-tabbar-item__text">上一题</div>
    </div>
    <div class="van-tabbar-item" @click="tika" v-if="getShow('tika')">
      <div class="van-tabbar-item__icon">
        <span class="q_bg q_tika_bg"></span>
      </div>
      <div class="van-tabbar-item__text">题卡</div>
    </div>
    <div class="van-tabbar-item" @click="tixing" v-if="getShow('tixing')">
      <div class="van-tabbar-item__icon">
        <span class="q_bg q_tixing_bg"></span>
      </div>
      <div class="van-tabbar-item__text">题型</div>
    </div>
    <div class="van-tabbar-item" v-if="getShow('time')">
      <div class="van-tabbar-item__icon" style="color:#FF6000">20:00:11</div>
      <div class="van-tabbar-item__text">暂停</div>
    </div>
    <div class="van-tabbar-item" v-if="getShow('submit')" @click="submit">
      <div class="van-tabbar-item__icon">
        <span class="q_bg q_submit_bg"></span>
      </div>
      <div class="van-tabbar-item__text">提交</div>
    </div>
    <div class="van-tabbar-item" @click="toggle('next')">
      <div class="van-tabbar-item__icon">
        <span class="q_bg q_right_bg"></span>
      </div>
      <div class="van-tabbar-item__text">下一题</div>
    </div>
  </div>
</template>
<script>
export default {
  //
  props: ["showTypeList"],
  data() {
    return {};
  },
  methods: {
    getShow(str) {
      if (this.showTypeList.indexOf(str) != -1) {
        return true;
      } else {
        return false;
      }
    },
    toggle(method) {
      this.$emit("change", method);
    },
    submit() {
      this.$emit("submit");
    },
    tika() {
      this.$emit("tika");
    },
    tixing() {
      this.$emit("tixing");
    }
  }
};
</script>
<style lang="less" scoped>
.q_bg {
  width: 18px;
  height: 18px;
  display: inline-block;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.q_left_bg {
  background-image: url(~assets/image/question/q_left.png);
}
.q_right_bg {
  background-image: url(~assets/image/question/q_right.png);
}
.q_submit_bg {
  background-image: url(~assets/image/question/q_submit.png);
}
.q_tika_bg {
  background-image: url(~assets/image/question/q_tika.png);
}
.q_tixing_bg {
  background-image: url(~assets/image/question/q_tixing.png);
}
.van-tabbar--fixed {
  position: fixed !important;
}
</style>