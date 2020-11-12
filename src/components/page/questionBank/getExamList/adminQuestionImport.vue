<template>
  <div class="edit-info">
    <el-dialog
      :visible="showModal"
      :close-on-click-modal="false"
      class="edit-dialog"
      title="导入试题"
      width="773px"
      :append-to-body="true"
      @close="close()"
    >
      <div class="form-wrap edit-form">
        <!-- <div class="form-item">
          <label>导入题库：</label>
          <div>题库名称 —— 科目一</div>
        </div>-->
        <div class="form-item">
          <label>导入规则：</label>
          <ol>
            <li>导入的文件必须是excel文件。</li>
            <li>请下载示例模板在模板内填充数据，填充数据时，请严格按照模板内规则进行填充！</li>
            <li>为了避免出现重复导入单个文件的情况，导入文件与历史文件不允许重复。</li>
            <li>单次最多导入1000 条数据</li>
          </ol>
        </div>
        <div class="form-item">
          <label></label>
          <div>
            <a href="../../../static/excel/题库题型模板.xlsx">导入模板下载</a>
          </div>
        </div>
        <div class="form-item">
          <label>导入文件：</label>
          <div>
            <el-upload
              ref="upload"
              class="avatar-uploader"
              :action="fileUploadPath"
              :headers="setHead"
              :data="otherParam"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false"
              :limit="1"
              :on-exceed="onexceed"
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

            <!-- <el-button type="primary">校验数据</el-button> -->
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="clear-btn" @click="close()">取 消</el-button>
        <el-button type="primary" class="sub-btn" @click="submitForm('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import _request from "@/utils/request";
import { checkCharacters, rightNumber, checkDns } from "@/utils/rules";
export default {
  props: ["show"],
  computed: {
    ...mapState({
      subject_id: state => state.question.question_subject_id,
      bank_id: state => state.question.bank_id
    }),
    showModal() {
      this.fileName = "";
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles();
      }
      return this.show;
    }
  },
  data() {
    return {
      loading: null,
      fileList: [],
      fileUploadPath: this.GLOBAL.ajaxurl + "question/importExam",
      setHead: this.GLOBAL.setHead(),
      fileName: "",
      otherParam: {}
    };
  },
  mounted() {
    this.otherParam = {
      bank_id: this.bank_id,
      subject_id: this.subject_id
    };
    console.log(JSON.stringify(this.otherParam));
  },
  methods: {
    onexceed(files, fileList) {
      // this.$set(this.$refs.upload.uploadFiles, 0, fileList);
      console.log(this.$refs.upload);
    },
    uploadClick() {
      this.fileName = "";
      this.$refs.upload.clearFiles();
      this.$refs.uploadClick.click();
    },
    //上传图片 之后的钩子方法
    handleAvatarSuccess(res, file) {
      this.$toast(res.msg);
      this.$store.commit("loading", false);
      this.$emit("close");
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
      this.$refs.upload.submit();
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
</style>
