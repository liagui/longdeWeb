<template>
  <div>
    <div class="content-nav">
      <div class="nav-header">
        <div class="nav-line"></div>
        <div class="nav-text">备案信息配置</div>
      </div>
      <div class="nav-meat">
        <div class="img">
          <div class="img-up">
            <div class="label">备案图标：</div>
            <img class="record-img" :src="recordInfo.logoUrl" alt="" />
            <el-upload
              ref="upload"
              :limit="1"
              :action="fileUploadPath"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <el-button size="small" type="danger" @click.stop="clearFiles"
                >点击删除</el-button
              >
            </el-upload>
          </div>
        </div>
        <div class="record-name">
          <div class="edit-item">
            <div class="label">显示名称：</div>
            <el-input placeholder="显示名称" v-model="recordInfo.showName">
            </el-input>
          </div>
        </div>
        <el-button class="submit" type="primary" @click="submit"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "reacordInfo",
  props: ["data"],
  data() {
    return {
      recordInfo: {
        logoUrl: "",
        showName: "",
      },
      fileUploadPath: this.GLOBAL.doUploadOssFile,
    };
  },
  mounted() {
    if (this.data) {
      this.recordInfo = JSON.parse(JSON.stringify(this.data)); //深拷贝
    }
  },
  methods: {
    handleSuccess(res) {
      this.recordInfo.logoUrl = res.data.url;
    },
    handleRemove() {},
    clearFiles() {
      console.log(this.$refs.upload);
      this.recordInfo.logoUrl = "";
    },
    submit() {
      console.log(this.recordInfo);
      this.$emit("change", this.recordInfo);
      this.$toast("保存成功");
    },
  },
};
</script>
<style lang="less" scoped>
.content-nav {
  width: 100%;
  height: auto;
}
.nav-header {
  width: 100%;
  box-sizing: border-box;
  padding: 25px 0;
}
.nav-line {
  width: 4px;
  height: 19px;
  background: rgb(32, 166, 255);
  float: left;
}
.nav-text {
  font-size: 19px;
  height: 19px;
  line-height: 19px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #333333;
  box-sizing: border-box;
  padding: 0 0 0 7px;
}
.nav-meat {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 30px;
}
//record
.img-up {
  font-size: 14px;
  display: flex;
  align-items: center;
  .record-img {
    display: block;
    margin: 0 10px;
    width: 20px;
    height: 20px;
  }
}

.edit-item {
  display: flex;
  font-size: 14px;
  height: 50px;
  align-items: center;
  .el-input {
    width: 250px;
  }
  .el-radio {
    margin-top: 9px;
  }
}

/deep/ .el-upload--text {
  border: none;
}
</style>