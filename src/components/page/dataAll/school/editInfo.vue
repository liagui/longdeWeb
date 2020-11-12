<template>
  <div class="edit-info">
    <el-dialog
      class="edit-dialog"
      title="网校信息修改"
      :close-on-click-modal="false"
      :visible.sync="showInfo"
      width="660px"
      :append-to-body="true"
      @close="close"
    >
      <div class="title">
        <div class="cut"></div>
        <div>网校信息</div>
      </div>
      <el-form
        ref="editForm"
        class="edit-form"
        :model="editForm"
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <div class="top">
          <el-form-item label="网校名称：" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="网校域名：" prop="dns">
            <el-input v-model="editForm.dns"></el-input>
          </el-form-item>
          <el-form-item label="账户名称：" prop="account_name">
            <el-input v-model="editForm.account_name"></el-input>
          </el-form-item>
          <el-form-item label="对公账号：" prop="account_num">
            <el-input v-model="editForm.account_num"></el-input>
          </el-form-item>
          <el-form-item label="开户银行：" prop="open_bank">
            <el-input v-model="editForm.open_bank"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="网校介绍：" prop="introduce">
          <el-input
            v-model="editForm.introduce"
            type="textarea"
            resize="none"
            size="medium"
            :autosize="{ minRows: 4, maxRows: 20 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="网校logo：" prop="logo_url">
          <el-upload
            class="avatar-uploader"
            :action="fileUploadPath"
            :show-file-list="false"
            :headers="setHead"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="clear-btn" @click="close">取 消</el-button>
        <el-button type="primary" class="sub-btn" @click="submitForm('editForm')">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber, checkDns } from "@/utils/rules";
export default {
  props:['schoolId','showEditInfo'],
  data() {
    return {
      fileUploadPath: this.GLOBAL.postImgUrl,
      setHead: this.GLOBAL.setHead(),
      editForm: {
        name: "",
        dns: "",
        introduce: "",
        logo_url: "",
        account_name: "",
        account_num: "",
        open_bank: ""
      },
      showInfo:false,
      aa: "",
      imageUrl: "",
      rules: {
        name: [{ required: true, message: "请输入网校名称", trigger: "blur" }],
        dns: [
          { required: true, message: "请输入网校域名", trigger: "blur" },
          {
            pattern: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
            message: "请输入完整域名"
          }
        ],
        introduce: [
          { required: true, message: "请输入网校简介", trigger: "blur" }
        ],
        logo_url: [
          { required: true, message: "请上传网校logo", trigger: "blur" }
        ]
      }
    };
  },
  mounted(){
    this.showInfo = this.showEditInfo;
  },
  created() {
    _request
      .http(this, "school/getSchoolUpdate", {
        school_id: this.schoolId
      })
      .then(res => {
        // console.log('获取的网校信息', res.data)
        this.editForm = res.data;
        this.imageUrl = res.data.logo_url;
      });
  },
  methods: {
    close() {
      this.$emit('clearFun');
    },
    //上传图片 之后的钩子方法
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.$set(this.editForm, "logo_url", res.data);
        this.$refs.uploadFile.clearValidate();
      } else {
        alert(res.msg);
      }
    },
    //上传之前的钩子方法
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isLt5M = file.size / 1024 / 1024 < 5
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt5M) {
      //   this.$message.error('上传头像图片大小不能超过 5MB!')
      // }
      // return isJPG && isLt5M
      return true;
    },
    submitForm(editForm) {
      this.$refs[editForm].validate(valid => {
        if (valid) {
          _request
            .http(this, "school/doSchoolUpdate", this.editForm)
            .then(res => {
              if (res.code == 200) {
                this.$message({
                  showClose: true,
                  message: "保存成功",
                  type: "success"
                });
                this.$emit("marksureFun");
              } else {
                this.$message({
                  showClose: true,
                  message: "保存失败，请重试",
                  type: "error"
                });
              }
              console.log(res);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.edit-dialog {
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}

.title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #333333;

  .cut {
    margin-right: 10px;
    width: 4px;
    height: 15px;
    background: #26a4fd;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.edit-form {
  border-bottom: solid 1px #eaeaea;
}
</style>
