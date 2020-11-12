<template>
  <div class="nexHeader">
    <div class="list">
      <div v-if="isQuestion" class="taps firstLevel">{{ bankName }}</div>
      <div v-else class="taps firstLevel">
        <i :class="getSetbarList.icon"></i>
        {{ getSetbarList.title }}
      </div>

      <div
        v-for="(item, index) in formatList(getSetbarList.subs)"
        :key="index"
        class="taps"
        @click="selectSidbar(item, formatList(getSetbarList.subs))"
        @mouseenter="enter(index)"
        @mouseleave="leave"
      >
        <span class="tap-text" :class="{ selectId: selectIndex === item.index }">
          <span>{{ item.title }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "../common/bus";
import { setSen, getSen, objToUrlParam } from "@/utils";
import _request from "@/utils/request";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      collapseText: true,
      collapse: true,
      selectId: "",
      arr: [],
      temp: null,
      code: this.$store.state.objCode,
      selectIndex: "",
      seletIndexActive: false,
      openCloseText: "收起",
      openCloseTextIcon: "el-icon-caret-left",
      hoverIndex: "",
      flag: true,
      bankName: ""
    };
  },
  computed: {
    ...mapGetters(["getSetbarList"]),
    ...mapState({
      userInfo: state => JSON.parse(state.userInfo)
    }),
    onRoutes() {
      return this.$route.path;
    },
    isQuestion() {
      if (this.userInfo.school_status != 1) {
        return this.selectIndex.indexOf("/question/get") == 0;
      } else {
        return false;
      }
    }
    // bankName() {
    //   return localStorage.getItem("bankName");
    // }
  },
  created() {
    // this.selectIndex = this.$route.path;
  },
  mounted() {
    var subList = this.getSetbarList.subs;
    this.selectIndex = this.$route.path;
    for (let i = 0; i < subList.length; i++) {
      if (this.$route.path.indexOf(subList[i]["index"]) == 0) {
        this.selectIndex = subList[i]["index"];
      }
    }
    if (this.$route.path.indexOf("/question/") == 0) {
      this.bankName = localStorage.getItem("bankName");
    }
  },
  watch: {
    bankName() {
      this.bankName = localStorage.getItem("bankName");
    },
    // getSetbarList(item) {
    //   setTimeout(() => {
    //     this.selectIndex = this.$route.path;
    //   }, 100);
    // },
    $route(newValue, oldValue) {
      if (newValue) {
        // 如果是中控题库
        if (newValue.path == "/question" && this.userInfo.school_status != 1) {
          this.$store.commit(
            "getTapList",
            this.$store.state.menu.menu.find(item => item.id == 3)
          );
        } else if (
          newValue.path.indexOf("/question/") == 0 &&
          this.userInfo.school_status == 1
        ) {
          //如果是总控题库
          let obj = Object.assign(
            {},
            this.$store.state.menu.menu.find(item => item.id == 3)
          );
          obj.subs = obj.subs.slice(1);
          this.$store.commit("getTapList", obj);
        }
        var barList = this.getSetbarList.subs;
        console.log(barList);

        for (let i = 0; i < barList.length; i++) {
          if (newValue.path.indexOf(barList[i]["index"]) == 0) {
            this.selectIndex = barList[i]["index"];
          }
        }
      }
      if (newValue.path.indexOf("/question/") == 0) {
        this.bankName = localStorage.getItem("bankName");
      }
    }
  },
  methods: {
    formatList(list) {
      //题库一级
      if (this.selectIndex == "/question") {
        return list.slice(0, 1);
        //题库二级
      } else if (this.isQuestion) {
        return list.slice(1);
      } else {
        return list;
      }
    },
    selectSidbar(item, secItem) {
      this.$emit("setFirstPage", true);
      var urlParamStr = objToUrlParam(this.$route.query);
      this.$router.push(item.index);
      // this.$router.push(item.index + urlParamStr);
      this.selectIndex = item.index;
      this.$bus.$emit("clickSecHead", true);
    },
    changeTap() {
      if (this.flag) {
        if (!this.collapse) {
          this.collapse = !this.collapse;
          this.flag = false;
          setTimeout(() => {
            this.collapseText = true;
            this.flag = true;
          }, 300);
        } else {
          this.collapseText = !this.collapseText;
          this.collapse = !this.collapse;
        }
      }
      bus.$emit("collapse", !this.collapse);
    },
    enter(index) {
      this.hoverIndex = index;
    },
    leave() {
      this.hoverIndex = "";
    }
  }
};
</script>

<style scoped lang="less">
.nexHeader {
  width: 100%;
  height: 50px;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
.list {
  height: 100%;
  display: flex;
  border-bottom: 1px solid #f2f2f2;
}

.taps {
  float: left;
  font-size: 15px;
  transition: 0.3s;
  display: flex;
  height: 50px;
  align-items: center;
  color: #333;
  min-width: 90px;
  box-sizing: border-box;
  justify-content: center;
  cursor: pointer;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  /* font-weight: bold; */
}
.firstLevel {
  margin-left: 50px;
  padding-left: 0;
  // width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.taps i {
  padding: 0 10px 0 0;
}
.tap-text {
  height: 50px;
  line-height: 50px;
}
.tap-text:hover,
.selectId {
  color: #26a4fd;
  border-bottom: 2px solid #26a4fd;
}
</style>

