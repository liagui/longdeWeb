<template>
  <el-dialog
    title="浏览器图标"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="handleClose"
  >
    <div class="contain">
      <div class="label">浏览器图标：</div>
      <div class="contain-right">
        <div class="img-block" v-if="!icoUrl">
          <i class="el-icon-plus"></i>
        </div>
        <img v-else class="favico" :src="icoUrl" alt="" />
        <el-upload
          ref="upload"
          :action="fileUploadPath"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :limit="1"
          :headers="setHead"
          accept=".jpg,.jpeg,.png,.ico"
          :before-upload="beforeUpload"
          :show-file-list="false"
        >
          <el-button style="margin-top: 20px">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            *说明：上传文件格式为icon类型，文件大小不能大于32kb.
          </div>
        </el-upload>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["show", "favicoUrl"],
  data() {
    return {
      dialogVisible: false,
      fileUploadPath: this.GLOBAL.doUploadOssFile,
      icoUrl: "",
      imageList: [],
      setHead: this.GLOBAL.setHead(),
    };
  },
  watch: {
    show(value) {
      this.icoUrl = this.favicoUrl;
      this.dialogVisible = value;
    },
  },
  mounted() {},
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleClose(done) {
      this.dialogVisible = false;
      this.$emit("close");
    },
    handleConfirm() {
      this.$emit("upload", this.icoUrl);
      this.$toast("上传成功");
      this.handleClose();
    },
    handleSuccess(res, file, fileList) {
      this.icoUrl = res.data.url;
      console.log(res);
    },
    beforeUpload(file){
      console.log(file.size)
      if(file.size > 32 * 1024){
        this.$toast("文件大小不能大于32")
        return false
      }
    }
  },
};
</script>

<style lang="less" scoped>
.contain {
  display: flex;
}
.label {
  width: 100px;
  text-align: right;
}
.img-block {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: #eaeaea;
}
.favico {
  width: 50px;
  height: 50px;
}
/deep/ .el-upload--text {
  border: none;
}
</style>