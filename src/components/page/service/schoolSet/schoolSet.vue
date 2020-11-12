<template>
  <div>
    <navTitle></navTitle>
    <div class="content-tab">
      <LeftTab title="网校设置" :navList="navList"></LeftTab>
    </div>
  </div>
</template>
<script>
import LeftTab from "../leftTab";
import navTitle from "../navTitle";
export default {
  data() {
    return {
      navList: [
        {
          name: "/service/schoolSet/headerService",
          navItem: "页头设置",
          icon: "el-icon-news",
        },
        {
          name: "/service/schoolSet/footerService",
          navItem: "页尾设置",
          icon: "el-icon-connection",
        },
        {
          name: "/service/schoolSet/homeService",
          navItem: "首页设置",
          icon: "el-icon-wallet",
        },
        {
          name: "/service/schoolSet/seoservice",
          navItem: "SEO设置",
          icon: "el-icon-setting",
        },
        {
          name: "/service/schoolSet/selfService",
          navItem: "自定义页面",
          icon: "el-icon-help",
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
<style>
</style>
