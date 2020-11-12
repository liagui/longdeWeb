<template>
  <div>
    <el-upload
      ref="upload1"
      class="avatar-uploader"
      :action="url"
      :headers="setHead"
      :data="uploadParam"
      :on-success="handleAvatarSuccess"
      :on-error="handleAvatarError"
      :before-upload="beforeAvatarUpload"
      :auto-upload="false"
      :limit="1"
    >
      <div slot="file" slot-scope="{file}">{{fileName=file.name}}</div>
      <div ref="uploadClick"></div>
    </el-upload>
    <el-input
      placeholder="请上传文件"
      v-model="fileName"
      disabled
      style="width: 350px;margin-right: 10px;"
    >
      <el-button slot="append" icon="el-icon-upload" @click="uploadClick">选择文件</el-button>
    </el-input>
  </div>
</template>

<script>
import _request from "@/utils/request";
export default {
  props: ["url", "otherParam"],
  data() {
    return {
      uploadParam: {},
      loading: null,
      fileList: [],
      setHead: this.GLOBAL.setHead(),
      fileName: ""
    };
  },
  watch: {},
  methods: {
    formatParam(param) {
      console.log(param);
      let obj = Object.assign({}, param);
      for (let i in obj) {
        if (obj[i] instanceof Array) {
          obj[i] = JSON.stringify(obj[i]);
        }
      }
      console.log(obj);
      return obj;
    },
    uploadClick() {
      this.fileName = "";
      this.$refs.upload1.clearFiles();
      this.$refs.uploadClick.click();
    },
    //上传图片 之后的钩子方法
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.$toast("导入成功");
        this.$store.commit("loading", false);
        this.$emit("close");
      } else {
        this.$toast(res.msg);
      }
    },
    //上传之前的钩子方法
    beforeAvatarUpload(file) {
      const isXLSX = file.name.indexOf(".xlsx") > -1;
      if (!isXLSX) {
        this.$message.error("请上传.xlsx类型文件!");
      } else {
        this.$store.commit("loading", true);
      }
      return isXLSX;
      // const isLt5M = file.size / 1024 / 1024 < 5
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt5M) {
      //   this.$message.error('上传头像图片大小不能超过 5MB!')
      // }
      // return isJPG && isLt5M
    },
    handleAvatarError(err) {
      this.$message.error("上传失败，请联系管理员");
      this.$store.commit("loading", false);
    },
    close() {
      this.$emit("close");
    },
    submitForm(editForm) {
      this.uploadParam = this.formatParam(this.otherParam);
      setTimeout(() => {
        this.$refs.upload1.submit();
      }, 200);
    }
  }
};
</script>
<style lang="less" scoped>
.avatar-uploader {
  display: none;
}
.form-wrap {
  padding: 10px 30px 20px 30px !important;
  color: #606266;
  line-height: 24px;
  font-size: 14px;
}
.form-item {
  min-height: 30px;
  line-height: 30px;
  margin: 10px 0;
  display: flex;
  & > label {
    width: 80px;
    text-align: right;
  }
  & > div {
    flex: 1;
  }
  ol {
    list-style-type: decimal;
    padding-left: 16px;
    margin-bottom: 0;
    li {
      list-style: decimal;
    }
  }
}
</style>
