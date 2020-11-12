<template>
  <div class="tpl tpl-video tpl-full-video">
    <tpl-title
      v-if="blockData && blockData.optionName"
      :title="blockData.optionName"
    ></tpl-title>
    <video
      :src="blockData.videoUrl"
      :poster="blockData.posterUrl"
      controls
    ></video>
  </div>
</template>

<script>
import mixin from "./customComponent/mixin";
export default {
  name: "fullVideo",
  props: ["blockData"],
  mixins: [mixin],
};
</script>

<style lang="less" scoped>
video {
  width: 100%;
  height: 500px;
  background-color: lightgray;
}
</style>