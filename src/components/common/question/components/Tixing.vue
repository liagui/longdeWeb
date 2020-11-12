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
        <div class="tika-title">
          <span></span>
          <b>单选题</b>
        </div>
        <div class="tika-con">
          <span class="y-circle finished">1</span>
          <span class="y-circle current">1</span>
          <span class="y-circle">1</span>
          <span class="y-circle">1</span>
          <span class="y-circle">1</span>
          <span class="y-circle">1</span>
          <span class="y-circle">1</span>
          <span class="y-circle finished">1</span>
          <span class="y-circle current">1</span>
          <span class="y-circle">1</span>
          <span class="y-circle">1</span>
          <span class="y-circle">1</span>
          <span class="y-circle">1</span>
          <span class="y-circle">1</span>
        </div>
      </div>
      <div class="tika-handle">
        <van-button round color="linear-gradient(to right, #2EC1FE, #2EA1FE)" size="large">交卷并查看结果</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>
<script>
export default {
  props: ["show"],
  data() {
    return {};
  },
  computed: {
    showTK() {
      return this.show;
    }
  },
  methods: {
    close() {
      this.$emit("close");
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
  .tika-title {
    display: flex;
    align-items: center;
    span {
      margin: 0 5px;
      display: inline-block;
      width: 3px;
      height: 16px;
      background-color: @primaryColor;
    }
  }
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