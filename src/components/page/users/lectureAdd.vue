<template>
  <div class="accounadd">
    <div class="form-box">
      <el-form :model="addData" :rules="rule" label-width="90px" ref="addData">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属网校：" prop="title">
                  <div class="schoolName">龙德教育</div>
                </el-form-item>
                <el-form-item
                  ref="uploadFile"
                  label="缩略图："
                  prop="head_icon"
                >
                  <el-upload
                    class="avatar-uploader"
                    :action="fileUploadPath"
                    :headers="setHead"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img
                      v-if="addData.head_icon"
                      :src="head_icon"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <div class="warning">缩略图大小1:1</div>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  ref="uploadFile1"
                  label="头像："
                  prop="teacher_icon"
                >
                  <el-upload
                    class="avatar-uploader1"
                    :action="fileUploadPath"
                    :headers="setHead"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess1"
                    :before-upload="beforeAvatarUpload1"
                  >
                    <img
                      v-if="addData.teacher_icon"
                      :src="teacher_icon"
                      class="avatar1"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon1"></i>
                  </el-upload>
                  <div class="warning">头像大小9:16</div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item :span="24" label="手机号：" prop="phone">
              <el-input
                v-model="addData.phone"
                type="text"
                min="0"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item :span="24" label="讲师姓名：" prop="real_name">
              <el-input
                v-model="addData.real_name"
                placeholder="请输入讲师姓名 "
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
              <el-radio v-model="addData.sex" :label="1">男</el-radio>
              <el-radio v-model="addData.sex" :label="2">女</el-radio>
            </el-form-item>
            <el-form-item label="QQ：" prop="qq">
              <el-input
                v-model="addData.qq"
                placeholder="请输入QQ号 "
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="微信：" prop="wechat">
              <el-input
                v-model="addData.wechat"
                placeholder="请输入微信号 "
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="关联学科：" prop="parent_id">
              <el-cascader
                style="width: 100%"
                v-model="addData.parent_id"
                collapse-tags
                :options="subjectArr"
                clearable
                :props="{
                  checkStrictly: true,
                  value: 'id',
                  label: 'name',
                  children: 'childs',
                  expandTrigger: 'hover',
                }"
              ></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="讲师描述：" prop="describe">
              <el-input
                v-model="addData.describe"
                type="textarea"
                :rows="7"
                placeholder="请输入讲师描述"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item label="讲师详情：" prop="content">
              <quill-editors
                @tranCont="getContent"
                :transIntroduction="addData.content"
              ></quill-editors>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center">
          <el-button @click="cancelFun" class="clear-btn">取消</el-button>
          <el-button @click="marksureFun" class="sub-btn">确定</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
import { testPostImage, postImg } from "@/utils/index.js";
import quillEditorCom from "./../ueditorCom/comEditor";
import {
  checkEnACharac4,
  checkPhone,
  rightNumber,
  numAndDecimals2,
} from "@/utils/rules";

export default {
  props: ["transId", "is_auth"],
  data() {
    return {
      searchData: {
        real_name: "",
        parent_id: [],
      },
      schoolBranch: [],
      showDialog: false,
      clickIndex: Number,
      fileUploadPath: this.GLOBAL.postImgUrl,
      fileUploadBig: this.GLOBAL.bigImgUrl,
      setHead: this.GLOBAL.setHead(),
      editor: null, // 富文本编辑器对象
      editorOption: {
        //  富文本编辑器配置
        modules: {
          toolbar: {
            container: "#toolbar",
          },
        },
        theme: "snow",
        placeholder: "请输入正文",
      },
      addData: {
        type: 2,
        phone: "",
        head_icon: "",
        teacher_icon: "",
        real_name: "",
        sex: 1,
        describe: "",
        qq: "",
        wechat: "",
        parent_id: [],
        title: "",
        teacher_id: "",
      },
      head_icon: "",
      teacher_icon: "",
      subjectsel_arr: [],
      subjectArr: [],
      dynamicTags: [],
      selTeachers: [],

      formBox: {
        status: "",
      },
      rule: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        real_name: [
          { required: true, message: "请输入讲师姓名", trigger: "blur" },
          { validator: checkEnACharac4, trigger: "blur" },
        ],
        parent_id: [{ required: true, message: "请关联学科", trigger: "blur" }],
      },
      searchData: {},
    };
  },
  mounted() {
    this.getSubjectList();
    if (this.transId) {
      // 修改
      this.getDetail();
    } else {
      this.transId = "";
      this.addData.teacher_id = "";
      this.$refs.addData.resetFields();
    }
  },
  components: {
    // quillEditor
    "quill-editors": quillEditorCom,
  },
  methods: {
    getContent(val) {
      this.addData.content = val;
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.addData.head_icon = res.data;
        this.head_icon = URL.createObjectURL(file.raw);
        this.$refs.uploadFile.clearValidate();
      } else {
        alert(res.msg);
      }
    },
    beforeAvatarUpload(file) {
      return testPostImage(file);
    },
    handleAvatarSuccess1(res, file) {
      if (res.code == 200) {
        this.addData.teacher_icon = res.data;
        this.teacher_icon = URL.createObjectURL(file.raw);
        this.$refs.uploadFile1.clearValidate();
      } else {
        alert(res.msg);
      }
    },
    beforeAvatarUpload1(file) {
      return testPostImage(file);
    },

    dialogMarksure() {
      console.log("dynamicTags:" + this.dynamicTags);
      this.selTeachers = this.dynamicTags;
      console.log(this.selTeachers);
      this.showDialog = false;
    },
    cancelFun() {
      this.$emit("closeFun", 1);
    },
    marksureFun() {
      // this.addData.subject_id = JSON.stringify(this.addData.subject_id);
      this.$refs.addData.validate((valid) => {
        if (valid) {
          if (this.transId) {
            // 修改
            if (this.is_auth) {
              this.$message.error("授权讲师不可修改");
              return;
            }
            _request
              .http(this, "teacher/doUpdateTeacher", this.addData)
              .then((res) => {
                console.log(res);
                if (res.code == 200) {
                  this.$toast(res.msg);
                  this.$emit("successClose", 1);
                } else {
                  this.$toast(res.msg);
                }
              });
          } else {
            this.addData.id = "";
            _request
              .http(this, "teacher/doInsertTeacher", this.addData)
              .then((res) => {
                console.log(res);
                if (res.code == 200) {
                  this.$toast(res.msg);
                  this.$emit("successClose", 1);
                } else {
                  this.$toast(res.msg);
                }
              });
          }
        }
      });
    },
    getSubjectList() {
      _request.http(this, "subject").then((res) => {
        // console.log(JSON.stringify(res))
        this.subjectArr = res.data;
      });
    },
    getDetail() {
      _request
        .http(this, "teacher/getTeacherInfoById", { teacher_id: this.transId })
        .then((res) => {
          if (res.code == 200) {
            this.addData = res.data;
            this.head_icon = res.data.head_icon;
            this.teacher_icon = res.data.teacher_icon;
            this.addData.teacher_id = this.transId;
            // this.selTeachers = this.dynamicTags;
            // this.addData.method_id = ["2"];
          }
        });
    },
  },
};
</script>
<style scoped lang="less">
.accounadd {
  // height: 100%;
  .head-style {
    margin: 30px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    color: #333333;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
  .form-box {
    position: relative;
    width: 100%;
    padding-right: 20px;
    .schoolName {
      font-size: 16px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
  }
  .foot-btn {
    margin-top: 20px;
    text-align: right;
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
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar-uploader-icon1 {
  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 160px;
  line-height: 160px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  line-height: 100px;
  display: block;
}
.avatar1 {
  width: 90px;
  height: 160px;
  line-height: 160px;
  display: block;
}
/deep/ .ql-container {
  height: 220px !important;
}
.ql-editor {
  height: 200px !important;
}
.el-select {
  display: block;
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
.warning {
  color: #aaa;
  font-size: 12px;
}
/deep/ .ql-container {
  min-height: 300px !important;
}
.ql-editor {
  height: 300px !important;
}
.dialog-footer {
  margin-top: 20px;
}
</style>
