<template>
  <div>
    <navTitle></navTitle>
    <div class="content-tab">
      <LeftTab title="直播并发" :navList="navList"></LeftTab>
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
          name: "/service/liveConcurrent/videoDetail",
          navItem: "直播详情",
          icon: "el-icon-video-camera",
        },
        {
          name: "/service/liveConcurrent/takeShop",
          navItem: "并发购买",
          icon: "el-icon-postcard",
        },
        {
          name: "/service/liveConcurrent/share",
          navItem: "预算分配",
          icon: "el-icon-wallet",
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
<style >
/* .content-tab {
  width: 34%;
} */
.content-router {
  flex: 1;
}
</style>
