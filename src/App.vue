<template>
  <div id="app">
    <router-view></router-view>
    <!-- 
      v-if="referFlag"
      v-wechat-title="$store.state.productName ? $store.state.productName : '赚番'"
    -->
  </div>
</template>

<script>
import Watermark from "./utils/watermark";
import { getLoc } from "./utils/index.js";
import bus from "./components/common/bus";
export default {
  data() {
    return {
      referFlag: true
    };
  },
  mounted() {
    bus.$on("refer", msg => {
      this.referFlag = false;
      this.$nextTick(() => {
        this.referFlag = true;
      });
    });
  },
  mounted() {
    Watermark.set(`${getLoc("ms_username")} ${this.$store.state.employeeId}`);
    window.alert = e => {
      this.$message.error(e);
    };
  }
};
</script>

<style lang='less'>
@import "../static/css/main.css";
</style>

