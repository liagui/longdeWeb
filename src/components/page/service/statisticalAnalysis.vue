<template>
  <div>
    <navTitle></navTitle>
    <div class="content-tab">
      <LeftTab title="第三方插件" :navList="navList"></LeftTab>
    </div>
  </div>
</template>
<script>
import LeftTab from "./leftTab";
import navTitle from "./navTitle";
export default {
  data() {
    return {
      navList: [
        {
          name: "/service/statisticalAnalysis/statisticalAnalysisThree",
          navItem: "统计分析",
          icon: "el-icon-finished",
        },
        {
          name: "/service/statisticalAnalysis/statisticalAnalysisBai",
          navItem: "在线客服",
          icon: "el-icon-headset",
        },
        // {
        //   name: "/service/statisticalAnalysis/statisticalAnalysisGrome",
        //   navItem: "谷歌",
        //   icon: "el-icon-wallet",
        // },
        // {
        //   name: "/service/statisticalAnalysis/statisticalAnalysisTeng",
        //   navItem: "腾讯",
        //   icon: "el-icon-wallet",
        // },
        // {
        //   name: "/service/statisticalAnalysis/statisticalAnalysisCnzz",
        //   navItem: "cnzz",
        //   icon: "el-icon-wallet",
        // },
      ],
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
  components: {
    LeftTab,
    navTitle,
  },
};
</script>
<style >
/* .content-tab {
  width: 34%;
} */
.content-router {
  flex: 1;
}
</style>
