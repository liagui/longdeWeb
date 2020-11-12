<template>
  <el-dialog
    title="上传图片"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="handleClose"
  >
    <el-upload
      ref="upload"
      :action="fileUploadPath"
      list-type="picture-card"
      :on-preview="handleEditUrl"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :file-list="imageList"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <div v-if="currentUid">
      <div class="lable">图片链接：</div>
      <el-input v-model="navigationUrl">
        <template slot="append">
          <el-button @click="setNavigationUrl">确认链接</el-button>
        </template>
      </el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["show", "data"],
  data() {
    return {
      dialogVisible: false,
      fileUploadPath: this.GLOBAL.doUploadOssFile,
      imageList: [],
      navigationUrl: "",
      currentUid: "",
    };
  },
  watch: {
    show(value) {
      this.dialogVisible = value;
      this.imageList = this.data;
    },
  },
  mounted() {},
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleClose(done) {
      this.currentUid = "";
      this.dialogVisible = false;
      this.$emit("close");
    },
    handleConfirm() {
      let fileList = this.$refs.upload.uploadFiles;
      let data = [];
      fileList.forEach((item) => {
        data.push(item.response.data);
      });
      this.$emit("upload", data);
      this.$toast("上传成功");
      this.handleClose();
    },
    handleSuccess(res, file, fileList) {
      console.log(res);
    },
    handleEditUrl(file) {
      this.navigationUrl = file.navigationUrl || "";
      this.currentUid = file.uid;
    },
    setNavigationUrl() {
      let child = this.data.filter((item) => {
        return item.uid == this.currentUid;
      });
      if (child.length) {
        child[0].navigationUrl = this.navigationUrl;
      }
      this.$emit("upload", this.data);
      this.$toast("保存成功");
    },
  },
};
</script>