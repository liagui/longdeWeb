<template>
  <div
    style="overflow-y: auto"
    class="wrapper"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <v-head></v-head>
    <v-sidebar v-show="isShow"></v-sidebar>

    <div class="content-box">
      <div class="content">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import bus from "../common/bus";
import _request from "@/utils/request";
export default {
  data() {
    return {
      collapse: false,
      isCollapse: false,
      privilege_list: [],
      isShow: true,
    };
  },
  watch: {
    $route: {
      handler(val, oldval) {
        console.log(val.path); //新路由信息
        if (val.path.indexOf("/service/") == 0) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      },
    },
  },
  computed: {
    fullscreenLoading() {
      return this.$store.state.loading;
    },
  },
  components: {
    vHead,
    vSidebar,
  },
  mounted() {
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
    });
  },
  methods: {},
};
</script>

<style>
.wrapper {
  min-width: 1100px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
/* .el-icon-arrow-down:before {
  content: "\E6DF";
  color: #ffffff;
  font-size: 18px;
} */
.el-menu-item.is-active {
  background-color: #409eff !important;
}
.content-box {
  /* position: absolute; */
  /* left: 0; */
  /* top: 150px; */
  height: calc(100% - 120px);
}
.tags-li.active {
  border: 0px solid #409eff;
  background-color: #409eff;
}
.content-box::-webkit-scrollbar {
  display: none;
}

</style>
