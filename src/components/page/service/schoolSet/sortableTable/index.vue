<template>
  <div class="custom-module">
    <component
      :is="customModel[id]"
      :blockData="blockOption.block_data"
    ></component>
    <!-- module-head -->
    <div class="module-head">
      <div class="handle">
        {{ blockOption.block_name }}
      </div>
      <div class="handle-right">
        <el-button type="danger" @click="removeAt(index)">删除该内容</el-button>
        <el-button type="primary" @click="openEdit(index)"
          >{{ blockOption.block_name }}配置</el-button
        >
      </div>
    </div>
    <!-- tool -->
    <template v-if="showEdit">
      <el-divider></el-divider>
      <component
        :is="editTool[blockOption.config_type]"
        :configModel="blockOption.config_model"
        :blockData="blockOption.block_data"
        @setBlockData="setBlockData"
      ></component>
    </template>
  </div>
</template>

<script>
import * as customModel from "./custom";
import * as editTool from "./tool";

export default {
  data() {
    return {
      showEdit: false,
      customModel,
      editTool,
    };
  },
  props: ["id", "index", "blockOption"],
  mounted() {},
  methods: {
    removeAt(index) {
      this.$emit("removeCallback", index);
    },
    openEdit(index) {
      this.showEdit = !this.showEdit;
    },
    setBlockData(blockData) {
      this.$emit("setBlockData", {
        blockData,
        index: this.index,
      });
      this.$toast("模块保存成功");
    },
  },
};
</script>

<style lang="less" scoped>
.custom-module {
  border: 1px solid #e5e5e5;
  padding: 20px;
  width: 1240px;
  border-radius: 5px;
}
.module-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  line-height: 80px;
  .handle {
    color: #333333;
    font-size: 20px;
  }
  span {
    padding: 0 10px;
    cursor: pointer;

    &:hover {
      background-color: #e8e8e8;
    }
  }
}
</style>
