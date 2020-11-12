<template>
  <div class="el-title">
    <div class="title">
      <div class="line"></div>
      <span>
        {{ title }}
      </span>
    </div>
    <slot>
      <div class="slot"></div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "elTitle",
  props: ["title"],
};
</script>

<style lang="less" scoped>
.el-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  .title {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333333;
  }
  .line {
    margin-top: -1px;
    margin-right: 7.5px;
    width: 4px;
    height: 17px;
    background-color: #50a3f6;
  }
}
</style>