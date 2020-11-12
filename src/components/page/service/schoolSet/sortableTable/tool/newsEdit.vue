<template>
  <div class="news-edit">
    <el-title title="配置信息"></el-title>
    <div class="option-item">
      <div class="label">名称：</div>
      <el-input v-model="optionData.optionName"></el-input>
    </div>
    <div class="option-item">
      <div class="label">展示顺序：</div>
      <el-radio v-model="optionData.sort" label="1">推荐优先</el-radio>
    </div>
    <div class="tool-button">
      <el-button @click="saveOption" color="#ee7f58">保存配置</el-button>
    </div>
  </div>
</template>

<script>
import * as API_schoolSet from "@/api/schoolSet";
import mixin from "../common/mixin.js";
export default {
  name: "newsEdit",
  mixins: [mixin],
  data() {
    return {
      optionData: {
        optionName: "",
        sort: "1",
        newsList: [],
      },
    };
  },
};
</script>

<style lang="less" scoped>
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
    width: 200px;
    min-width: 200px;
  }
  .el-slider {
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