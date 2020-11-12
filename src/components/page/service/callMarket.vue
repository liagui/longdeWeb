<template>
  <div>
    <navTitle></navTitle>
    <div class="content-tab">
      <LeftTab :navList="navList" title="客服营销"></LeftTab>
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
          name: "/service/callMarket/callMarketTall",
          navItem: "工具条设置",
          icon: "el-icon-notebook-2",
        },
        {
          name: "/service/callMarket/callMarketQQ",
          navItem: "QQ号",
          icon: "el-icon-connection",
        },
        {
          name: "/service/callMarket/callMarketWC",
          navItem: "微信",
          icon: "el-icon-news",
        },

        {
          name: "/service/callMarket/callMarketLang",
          navItem: "新浪微博",
          icon: "el-icon-wallet",
        },
        {
          name: "/service/callMarket/callMarketTelephone",
          navItem: "客服电话",
          icon: "el-icon-service",
        },
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
<style scoped>
/* .content-tab {
  width: 34%;
} */
.content-router {
  flex: 1;
}
</style>
