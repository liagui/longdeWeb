<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="transData.addSchool"
      width="850px"
      @close="handleClose"
    >
      <div class="accounadd clearfix">
        <div class="form-box">
          <el-form
            :model="schoolForm"
            :rules="rules"
            ref="schoolForm"
            label-width="80px"
            label-position="left"
          >
            <div class="typeMess">网校信息</div>
            <el-row>
              <el-col :span="12">
                <el-form-item :span="12" label="网校名称" prop="name">
                  <el-input
                    v-model="schoolForm.name"
                    placeholder="请输入网校名称"
                  ></el-input>
                </el-form-item>
                <el-form-item :span="12" label="网校域名" prop="dns">
                  <el-input
                    v-model="schoolForm.dns"
                    placeholder="请输入网校域名"
                  ></el-input>
                </el-form-item>
                <el-form-item label="网校简介" prop="introduce">
                  <el-input
                    type="textarea"
                    :rows="3"
                    v-model="schoolForm.introduce"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="网校logo" ref="uploadFile" prop="logo_url">
                  <el-upload
                    class="avatar-uploader"
                    :action="fileUploadPath"
                    :show-file-list="false"
                    :headers="setHead"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img
                      v-if="schoolForm.logo_url"
                      :src="imageUrl"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <el-form-item label="账户名称：" prop="account_name">
            <el-input v-model="schoolForm.account_name"></el-input>
          </el-form-item>
          <el-form-item label="对公账号：" prop="account_num">
            <el-input v-model="schoolForm.account_num"></el-input>
          </el-form-item>
          <el-form-item label="开户银行：" prop="open_bank">
            <el-input v-model="schoolForm.open_bank"></el-input>
          </el-form-item> -->
            <div class="typeMess">账户信息</div>
            <el-form-item label="账户有效期" required>
              <el-col :span="11">
                <el-form-item prop="start_time">
                  <el-date-picker
                    v-model="schoolForm.start_time"
                    class="apply"
                    style="width: 100% !important"
                    type="date"
                    placeholder="开始时间"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="startpickerOptions"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align:center;">至</el-col>
              <el-col :span="11">
                <el-form-item prop="end_time">
                  <el-date-picker
                    v-model="schoolForm.end_time"
                    class="apply"
                    style="width: 100% !important"
                    type="date"
                    placeholder="结束时间"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>

            <el-form-item label="用户名" prop="username">
              <el-input
                :disabled="transData.schoolId != 0"
                v-model="schoolForm.username"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="schoolForm.password"
                placeholder=" 请输入密码"
                autocomplete="new-password"
                :clearable="false"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="pwd">
              <el-input
                v-model="schoolForm.pwd"
                placeholder=" 请输入确认密码"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="realname">
              <el-input
                v-model="schoolForm.realname"
                placeholder=" 请输入联系人"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="mobile">
              <el-input
                v-model="schoolForm.mobile"
                placeholder=" 请输入联系方式"
              ></el-input>
            </el-form-item>

            <div class="typeMess">单价信息</div>
            <el-form-item label="直播并发：" prop="live_price">
              <el-input
                v-model="schoolForm.live_price"
                min="0"
                placeholder="单位：元/人/月"
              ></el-input>
            </el-form-item>

            <el-form-item label="空间费用：" prop="storage_price">
              <el-input
                v-model="schoolForm.storage_price"
                min="0"
                placeholder="单位：元/GB/月"
              ></el-input>
            </el-form-item>

            <el-form-item label="流量费用：" prop="flow_price">
              <el-input
                v-model="schoolForm.flow_price"
                min="0"
                placeholder="单位：GB/元"
              ></el-input>
            </el-form-item>
            <div class="typeMess">快捷入口</div>
            <div>
              <el-checkbox v-model="schoolForm.ifinto"
                >课程分销系统</el-checkbox
              >
            </div>
            <div style="text-align:center;">
              <el-button class="clear-btn" @click="handleClose">取消</el-button>
              <el-button class="sub-btn" @click="submitForm('schoolForm')"
                >立即添加</el-button
              >
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _request from "@/utils/request";
import constants from "@/utils/constants";
import { testPostImage, postImg } from "@/utils/index.js";
import bus from "@/components/common/bus";
import { checkCharacters, checkChinese, numAndDecimals2 } from "@/utils/rules";
export default {
  props: ["transData"],
  data() {
    const pwdAgainCheck = async (rule, value, callback) => {
      if (this.schoolForm.password != this.schoolForm.pwd) {
        return callback(new Error("两次输入密码不一致！"));
      } else {
        callback();
      }
    };
    return {
      fileUploadPath: this.GLOBAL.postImgUrl,
      setHead: this.GLOBAL.setHead(),
      showlist: false,
      articleadd: true,
      schoolForm: {
        name: "",
        dns: "",
        introduce: "",
        logo_url: "",
        username: "",
        password: "",
        pwd: "",
        realname: "",
        mobile: "",
        account_name: "",
        account_num: "",
        open_bank: "",
        start_time: "",
        end_time: "",
        live_price: "",
        storage_price: "",
        flow_price: "",
        ifinto: false,
      },
      dialogTitle: "网校添加",
      rules: {
        name: [{ required: true, message: "请输入网校名称", trigger: "blur" }],
        dns: [{ required: true, message: "请输入网校域名", trigger: "blur" }],
        introduce: [
          { required: true, message: "请输入网校简介", trigger: "blur" },
        ],
        live_price: [{ validator: numAndDecimals2, trigger: "blur" }],
        storage_price: [{ validator: numAndDecimals2, trigger: "blur" }],
        flow_price: [{ validator: numAndDecimals2, trigger: "blur" }],
        logo_url: [
          { required: true, message: "请上传网校logo", trigger: "blur" },
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        start_time: [
          { required: true, message: "请输入开始时间", trigger: "blur" },
        ],
        end_time: [
          { required: true, message: "请输入结束时间", trigger: "blur" },
        ],
        password: [
          // { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkChinese, trigger: "blur" },
        ],
        pwd: [
          // { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: pwdAgainCheck, trigger: "blur" },
        ],

        realname: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "目前只支持中国大陆的手机号码",
          },
        ],
      },
      startpickerOptions: {
        disabledDate: (time) => {
          if (this.schoolForm.end_time) {
            return (
              time.getTime() > new Date(this.schoolForm.end_time).getTime() ||
              time.getTime() < new Date().getTime()
            );
          } else {
            return time.getTime() < new Date().getTime() - 8.64e7;
          }
        },
      },
      pickerOptions: {
        disabledDate: (time) => {
          if (this.schoolForm.start_time) {
            return (
              time.getTime() < new Date(this.schoolForm.start_time).getTime() ||
              time.getTime() < new Date().getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        },
      },
      fileList: [],
      schoolArr: [],
      typeArr: [],
      imageUrl: "",
      showDialog: false,
    };
  },
  created() {
    this.getSubjectList(); //学校分类
    if (this.transData.schoolId == 0) {
      // 添加
      this.dialogTitle = "网校添加";
    } else {
      // 修改
      this.dialogTitle = "网校修改";
      this.getSchoolMess();
    }
  },
  methods: {
    getSchoolMess() {
      _request
        .http(this, "school/getSchoolUpdate", {
          school_id: this.transData.schoolId,
        })
        .then((res) => {
          // console.log('获取的网校信息', res.data)
          this.schoolForm = res.data;
          this.imageUrl = res.data.logo_url;
        });
    },
    handleClose(done) {
      this.$emit("handleClose");
    },
    getSubjectList() {
      _request.http(this, "article/schoolList").then((res) => {
        console.log(res);
        this.schoolArr = res.school; //网校
        this.typeArr = res.type; //分类
      });
    },
    // 提交表单
    submitForm(schoolForm) {
      this.$refs[schoolForm].validate((valid) => {
        if (valid) {
          if (this.transData.schoolId == 0) {
            // 添加
            if (!this.schoolForm.password) {
              this.$toast("用户密码不能为空");
              return;
            }
            if (!this.schoolForm.pwd) {
              this.$toast("确认密码不能为空");
              return;
            }
            _request
              .http(this, "school/doInsertSchool", this.schoolForm)
              .then((res) => {
                if (res.code == 200) {
                  this.$message({
                    showClose: true,
                    message: "创建成功",
                    type: "success",
                  });
                  this.$emit("handleSure");
                } else {
                  this.$message({
                    showClose: true,
                    message: res.msg,
                    type: "error",
                  });
                }
                console.log(res);
              });
          }else{
            this.schoolForm.schoolid = this.transData.schoolId;
            _request
            .http(this, "school/doSchoolUpdate", this.schoolForm)
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  showClose: true,
                  message: "更新成功",
                  type: "success",
                });
                this.$emit("handleSure");
              } else {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: "error",
                });
              }
              console.log(res);
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //上传图片 之后的钩子方法
    handleAvatarSuccess(res, file) {
      console.log(res);
      // this.cover = URL.createObjectURL(file.raw);
      if (res.code == 200) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.$set(this.schoolForm, "logo_url", res.data);
        this.$refs.uploadFile.clearValidate();
      } else {
        alert(res.msg);
      }
    },
    //上传之前的钩子方法
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      // const isLt5M = file.size / 1024 / 1024 < 5;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt5M) {
      //   this.$message.error("上传头像图片大小不能超过 5MB!");
      // }
      // return isJPG && isLt5M;
      return true;
      // return testPostImage(file);
    },
    //文件上传钩子方法
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handSuccess(res, file) {
      this.schoolForm.accessory = URL.createObjectURL(file.raw);
    },
  },
};
</script>
<style scoped lang="less">
.typeMess {
  height: 16px;
  line-height: 16px;
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #333333;
  padding-left: 8px;
  border-left: 4px solid #26a4fd;
  margin-bottom: 20px;
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
.accounadd {
  background-color: #fff;
  height: 100%;
  .head-style {
    margin: 30px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    color: #333333;
  }
  .form-box {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .foot-btn {
    margin-top: 20px;
    text-align: right;
  }
}

.listType {
  margin-bottom: 16px;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
}
.listItem {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 26px;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(227, 227, 227, 1);
  border-radius: 3px;
  margin: 0 20px 20px 0;
}
.itemActive {
  background: rgba(38, 164, 253, 1);
  border-radius: 3px;
  color: #fff;
  border: 0;
}
.addTeacher {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 13px;
  border: 1px solid rgba(38, 164, 253, 1);
  color: rgba(38, 164, 253, 1);
  font-size: 14px;
  border-radius: 3px;
  margin: 0 20px 20px 0;
}
/deep/ .el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.width-300 {
  width: 360px;
}
</style>
