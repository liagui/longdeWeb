<template>
  <div>
    <navTitle></navTitle>
    <div class="content-tab">
      <LeftTab title="空间存储" :navList="navList"></LeftTab>
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
          name: "/service/spatialStorage/spatialStorageDetail",
          navItem: "空间流量详情",
          icon: "el-icon-location-outline",
        },
        {
          name: "/service/spatialStorage/spatialStorageMoney",
          navItem: "空间续费",
          icon: "el-icon-tickets",
        },
        {
          name: "/service/spatialStorage/spatialStorageTall",
          navItem: "升级空间",
          icon: "el-icon-data-line",
        },
        {
          name: "/service/spatialStorage/spatialStorageBuy",
          navItem: "购买流量",
          icon: "el-icon-folder-checked",
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
