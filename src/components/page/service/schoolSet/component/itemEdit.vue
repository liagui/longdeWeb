<template>
  <div class="item-container">
    <div class="nav-item">
      <div class="nav-tlt">
        <i class="el-icon-s-fold handle"></i>
        <div>{{ data.name }}</div>
      </div>
      <div class="nav-path">
        {{ data.url }}
      </div>
      <div class="nav-state">
        <el-switch
          v-model="data.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </div>
      <div class="nav-operation">
        <i class="el-icon-edit-outline" @click="showEdit"></i>
        <!-- <i class="el-icon-delete" @click="del"></i> -->
      </div>
    </div>
    <div class="edit-block" v-if="show">
      <div class="edit-item">
        <div class="label">显示名称：</div>
        <el-input placeholder="显示名称" v-model="blockData.name"></el-input>
      </div>
      <!-- <div class="edit-item">
        <div class="label">链接地址：</div>
        <el-input
          placeholder="链接地址"
          v-model="blockData.url"
          :disabled="data.name == '首页'"
        ></el-input>
      </div> -->
      <div class="edit-item">
        <div class="label">链接类型：</div>
        <el-radio v-model="blockData.blank" label="1">本页打开</el-radio>
        <el-radio v-model="blockData.blank" label="2">弹出新窗口</el-radio>
      </div>
      <div class="buttons">
        <el-button type="normal" size="large" @click="handleCancle"
          >关闭</el-button
        >
        <el-button type="primary" size="large" @click="handleSave"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dataEdit",
  props: ["data", "index"],
  data() {
    return {
      show: false,
      blockData: {
        name: "",
        url: "",
        blank: "1",
      },
    };
  },
  methods: {
    showEdit() {
      this.blockData = JSON.parse(JSON.stringify(this.data));
      this.show = !this.show;
    },
    edit() {},
    del() {
      this.$emit("itemDelete", this.index);
    },
    handleCancle() {
      this.show = false;
    },
    handleSave() {
      this.$emit("itemChange", {
        index: this.index,
        item: this.blockData,
      });
      this.$toast("保存成功");
    },
  },
};
</script>

<style lang="less" scoped>
.item-container {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 9px 1px rgba(0, 26, 44, 0.1);
  border-radius: 4px;
}
.nav-item {
  width: 100%;
  height: 50px;
  margin-top: 25px;
  display: flex;
  font-size: 14px;
  font-weight: 400;
  color: #888888;
  line-height: 50px;
  div {
    text-align: center;
  }
}
.nav-icon {
  width: 16px;
  height: 16px;
  line-height: 16px;
  float: left;
}
.nav-icon img {
  width: 16px;
  height: 16px;
}
.nav-tlt {
  position: relative;
  box-sizing: border-box;
  padding-left: 30px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    position: absolute;
    left: 10px;
  }
}
.nav-path {
  flex: 3;
}
.nav-state {
  flex: 1;
}
.nav-operation {
  cursor: pointer;
  flex: 1;
  i {
    display: inline-block;
    margin: 0 5px;
  }
}
.edit-block {
  box-sizing: border-box;
  border-top: solid 1px lightgray;
  padding: 30px;
  width: 100%;
  height: 200px;
  .edit-item {
    display: flex;
    font-size: 14px;
    height: 50px;
    align-items: center;
    .el-input {
      width: 500px;
    }
    .el-radio {
      margin-top: 9px;
    }
  }
  .buttons {
    margin-top: -50px;
    float: right;
  }
}
</style>