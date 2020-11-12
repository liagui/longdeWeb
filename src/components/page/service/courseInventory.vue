<template>
  <div>
    <navTitle></navTitle>
    <div class="content-tab">
      <LeftTab title="课程库存" :navList="navList"></LeftTab>
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
          name: "/service/courseInventory/classKnow",
          navItem: "库存详情",
          icon: "el-icon-present",
        },
        {
          name: "/service/courseInventory/AllClass",
          navItem: "库存购物车",
          icon: "el-icon-shopping-cart-full",
        },
        {
          name: "/service/courseInventory/orderClass",
          navItem: "库存订单",
          icon: "el-icon-s-order",
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
