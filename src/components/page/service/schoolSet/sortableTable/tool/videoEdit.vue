<template>
  <div class="vedio-edit">
    <el-title title="配置信息"></el-title>
    <div class="tips">
      由于不同分辨率下图片可显示有效区域不同（1280分辨率仅可展示图片中间1280区域的内容），此处建议制作封面图时将图片内主要内容设计在中间1200像素内。
    </div>
    <div class="option-item">
      <div class="label">名称：</div>
      <el-input v-model="optionData.optionName" style="width: 300px"></el-input>
    </div>
    <div class="option-item upload" style="height: auto">
      <div class="label">上传封面：</div>
      <ld-upload
        ref="upload"
        :on-success="handlePosterSuccess"
        :on-remove="handleRemove"
        :limit="1"
        :show-file-list="false"
      >
        <el-button style="margin-top: 20px">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">建议上传尺寸为 1920px*536px</div>
      </ld-upload>
    </div>
    <div class="option-item upload" style="height: auto">
      <div class="label">上传视频：</div>
      <ld-upload
        ref="upload"
        :on-success="handleVideoSuccess"
        :on-remove="handleRemove"
        :limit="1"
        :show-file-list="false"
      >
        <el-button style="margin-top: 20px">点击上传</el-button>
        <div slot="tip" class="el-upload__tip"></div>
      </ld-upload>
    </div>
    <template v-if="configModel">
      <div class="option-item">
        <div class="label">主标题：</div>
        <el-input v-model="optionData.title"></el-input>
      </div>
      <div class="option-item">
        <div class="label">副标题：</div>
        <el-input
          class="text-area"
          type="textarea"
          v-model="optionData.desc"
        ></el-input>
      </div>
    </template>
    <div class="tool-button">
      <el-button @click="saveOption" color="#ee7f58">保存配置</el-button>
    </div>
  </div>
</template>
<script>
import mixin from "../common/mixin.js";
export default {
  name: "videoEdit",
  props: ["blockData", "configModel"],
  mixins: [mixin],
  data() {
    return {
      optionData: {
        title: "",
        desc: "",
        posterUrl: "",
        videoUrl: "",
      },
    };
  },
  mounted() {
    this.optionData = this.blockData;
  },
  methods: {
    handleRemove() {},
    handlePosterSuccess(res) {
      this.optionData.posterUrl = res.data.url;
    },
    handleVideoSuccess(res) {
      this.optionData.videoUrl = res.data.url;
    },
  },
};
</script>
<style lang="less" scoped>
.tips {
  font-size: 12px;
  color: #666666;
}
.option-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666666;
  height: 50px;
  .label {
    flex-shrink: 0;
    width: 75px;
    text-align: right;
  }
  .el-radio {
    margin-top: 7.5px;
  }
  .el-input {
    width: 400px;
    min-width: 200px;
  }
  .el-slider {
    width: 400px;
  }
  .area {
    width: 400px;
  }
  /deep/ .el-upload--text {
    border: none;
  }
}

.tool-button {
  margin-top: 75px;
  padding-right: 30px;
  display: flex;
  justify-content: flex-end;
  .el-button {
    border-color: #ee7f58;
    background-color: #ee7f58;
    color: #fff;
  }
}
</style>