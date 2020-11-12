<template>
  <div class="flex-center">
    <img src="~static/image/not_question.png" alt />
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: ["text"]
};
</script>

<style lang="less" scoped>
.flex-center {
  flex-direction: column;
  height: 300px;
  img {
    max-width: 150px;
  }
  span {
    margin-top: 10px;
    color: #bbbbbb;
  }
}
</style>