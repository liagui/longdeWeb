<template>
  <li class="pc-answer-item">
    <i :class="'y-icon '+icon"></i>
    <span class="margin-lr10">{{ text }}:</span>
    <span :class="classAnswer">{{ answer }}</span>
  </li>
</template>

<script>
export default {
  props: ["icon", "text", "answer", "classAnswer"]
};
</script>
<style lang="less" scoped>
.y-icon {
  width: 13px;
  height: 13px;
}
.bg-xuanze {
  background-image: url(~assets/image/question/pc_xuanze@2x.png);
}
.bg-daananswer {
  background-image: url(~assets/image/question/pc_daananswer@2x.png);
}
.bg-shipin {
  background-image: url(~assets/image/question/pc_shipin@2x.png);
}
.bg-wenhuachengdu {
  background-image: url(~assets/image/question/pc_wenhuachengdu@2x.png);
}
.bg-wenzi {
  background-image: url(~assets/image/question/pc_wenzi@2x.png);
}
.bg-yinpin {
  background-image: url(~assets/image/question/pc_yinpin@2x.png);
}
.pc-answer-item {
  min-height: 30px;
  line-height: 20px;
  margin-bottom: 5px;
}
</style>