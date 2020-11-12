<template>
  <van-action-sheet
    :value="showTK"
    title="答题卡"
    @close="close"
    @click-overlay="close"
    @cancel="close"
    :close-on-click-overlay="false"
  >
    <div class="tika-wrap">
      <div class="tika-list">
        <!-- <div class="tika-title">
          <span></span>
          <b>单选题</b>
        </div>-->
        <div class="tika-con">
          <span
            v-for="(item,index) in data"
            :key="index"
            class="y-circle"
            :class="{'finished':item.is_right,'current':current==index}"
            @click="setActive(index)"
          >{{index+1}}</span>
        </div>
      </div>
      <div class="tika-handle" v-if="showSubmit">
        <van-button
          @click="submit"
          round
          color="linear-gradient(to right, #2EC1FE, #2EA1FE)"
          size="large"
        >交卷并查看结果</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>
<script>
export default {
  props: ["show", "data", "current", "showSubmit"],
  data() {
    return {
      dataList: [],
      typeList: []
    };
  },
  computed: {
    showTK() {
      return this.show;
    }
  },
  methods: {
    submit() {
      this.$emit("submit");
    },
    close() {
      this.$emit("close");
    },
    setActive(index) {
      this.$emit("href", index);
    }
  },
  watch: {
    data(val) {
      // this.dataList = val;
      // for (var i in this.dataList) {
      //   this.typeList.push(i);
      // }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../question.less";
@borderColor: #f7f7f7;
@primaryColor: #2ea1fe;
.tika-wrap {
  padding-bottom: 100px;
}
.tika-handle {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  border-top: 1px solid #f7f7f7;
  background: rgba(247, 248, 250, 0.6);
}
.tika-list {
  padding: 16px;
}
.tika-con {
  .y-circle {
    margin: 8px;
    cursor: pointer;
    &:hover {
      border-color: @primaryColor;
    }
  }
  .finished {
    background-color: @primaryColor;
    color: #fff;
  }
  .current {
    border-color: @primaryColor;
  }
}
</style>