<template>
  <div class="contents">
    <el-row class="tac">
      <el-col :span="8">
        <el-menu
          class="el-menu-vertical-demo item"
          @click="handleOpen"
          @close="handleClose"
          :default-active="this.$route.name"
          router
        >
          <h5>
            {{ title }}
          </h5>
          <el-menu-item
            v-for="(item, i) in navList"
            :key="i"
            :index="item.name"
            @click="change(i)"
            :class="{ active: i == activeIndex }"
          >
            <i
              :class="item.icon"
              :style="{ color: activeIndex == i ? 'blue' : '' }"
            ></i>
            <!-- <img src="item.icon" alt="" /> -->
            <span slot="title">{{ item.navItem }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
    <div class="content-router">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  props: ["navList", "title"],
  data() {
    return {
      activeIndex: 0,
    };
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {},
  methods: {
    handleOpen(key, keyPath, i) {
      console.log(key, keyPath);
      this.activeIndex = i;
    },
    handleClose() {},
    change(i) {
      this.activeIndex = i;
    },
  },
  watch: {},
};
</script>
<style scoped>
.el-col-8 {
  width: 100%;
}
.contents {
  display: flex;
  width: 100%;
  margin-top: 20px;
}
h5 {
  line-height: 50px;
  font-size: 16px;
  padding-left: 50px;
  background: #ccc;
  margin: 0;
}
/* .item {

  border: none;
} */
/* .is-active {
  border-left: ;
  background: #fff;
} */
.el-menu-item.is-active {
  /* */
  /* background: #fff; */
}
.content-router {
  flex: 1;
}
.el-menu--horizontal > .el-menu-item {
  /* clear: both !important; */
  width: 100%;
  padding-left: 50px;
}
.el-menu.el-menu--horizontal {
  border: none;
}
.active {
  background: rgb(191, 222, 240);
  opacity: 0.6;
  color: rgb(5, 99, 241);
  border-left: 3px solid rgb(5, 99, 241);
}
.actives {
  color: rgb(5, 99, 241);
}
</style>
