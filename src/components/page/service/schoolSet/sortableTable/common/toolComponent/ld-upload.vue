<template>
  <el-upload
    ref="upload"
    :action="fileUploadPath"
    :headers="setHead"
    :limit="1"
    :show-file-list="false"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-button style="margin-top: 20px">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">建议上传尺寸为 1920px*536px</div>
  </el-upload>
</template>

<script>
export default {
  data() {
    return {
      fileUploadPath: this.GLOBAL.doUploadOssFile,
      setHead: this.GLOBAL.setHead(),
    };
  },
};
</script>

<style lang="less" scoped>
</style>