<template>
  <div class="tpl tpl-video">
    <div class="title">{{ blockData.title }}</div>
    <div class="line"></div>
    <div class="desc">
      {{ blockData.desc }}
    </div>
    <video
      :src="blockData.videoUrl"
      :poster="blockData.posterUrl"
      controls
    ></video>
  </div>
</template>

<script>
export default {
  name: "videoModel",
  props: ["blockData"],
};
</script>
<style lang="less" scoped>
.tpl-video {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: 28px;
  height: 30px;
  line-height: 30px;
}
.line {
  margin: 20px 0;
  width: 64px;
  height: 6px;
  border-radius: 3px;
  background: #0fadfc;
  border-radius: 3px;
}
.desc {
  color: #666666;
  text-align: center;
  font-size: 16px;
}
video {
  margin-top: 35px;
  width: 100%;
  height: 300px;
  background-color: lightgray;
}
</style>