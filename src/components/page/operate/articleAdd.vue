<template>
  <div class="accounadd">
    <div class="form-box">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择网校:" prop="school_id">
              <el-select v-model="ruleForm.school_id" @change="schoolChange" placeholder="所属网校">
                <el-option
                  v-for="(item, index) in schoolArr"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择分类:" prop="article_type_id">
              <el-select v-model="ruleForm.article_type_id" placeholder="请选择分类">
                <el-option
                  v-for="(item, index) in typeArr"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
              <el-button type="primary" @click="addType">添加分类</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文章标题:" prop="title">
              <el-input v-model="ruleForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关键词:" prop="key_word">
              <el-input v-model="ruleForm.key_word" placeholder="请输入关键词"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文章来源:" prop="sources">
              <el-input v-model="ruleForm.sources" placeholder=" 请输入文章来源"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传附件:" prop="accessory">
              <el-upload
                ref="selFile"
                class="upload-demo"
                :action="fileUploadPathFile"
                :auto-upload="true"
                :headers="setHead"
                :file-list="ruleForm.accessory"
                :on-remove="handleRemove"
                :on-success="handleChange"
                :show-file-list="true"
                :before-upload="beforeAvatarFileUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >压缩包文件（rar、zip）、文档文件（doc、docx、xls、xlsx、ppt、pptx、txt）、图片文件（jpg、png、paf），文档大小不超过200M</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文章摘要:" prop="description">
              <el-input
                type="textarea"
                v-model="ruleForm.description"
                :rows="6"
                placeholder="请输入课程描述"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封面图:" prop="image" ref="uploadFile">
              <el-upload
                class="avatar-uploader"
                :action="fileUploadPath"
                :headers="setHead"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="ruleForm.image" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="正文:" prop="text" ref="textquill">
            <quill-editors @tranCont="getContent" :transIntroduction="ruleForm.text"></quill-editors>
          </el-form-item>
        </el-row>
        <el-row style="text-align:right;">
          <el-button class="clear-btn" @click="clearFun">取消</el-button>
          <el-button class="sub-btn" @click="submitForm('ruleForm')">确定</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber } from "@/utils/rules";
import articleAdmin from "./articleAdmin";
import quillEditorCom from "./../ueditorCom/comEditor";
import { testPostImage, postImg } from "@/utils/index.js";
export default {
  props: ["tranData"],
  components: {
    "artile-list": articleAdmin,
    "quill-editors": quillEditorCom
  },
  data() {
    return {
      fileUploadPath: this.GLOBAL.postImgUrl,
      fileUploadPathFile: this.GLOBAL.doUploadOssFile,
      setHead: this.GLOBAL.setHead(),
      showlist: false,
      articleadd: true,
      ruleForm: {
        school_id: "",
        article_type_id: "",
        title: "",
        image: "",
        key_word: "",
        sources: "",
        accessory: [],
        description: "",
        text: ""
      },
      rules: {
        school_id: [
          { required: true, message: "请选择网校", trigger: "change" }
        ],
        article_type_id: [
          { required: true, message: "请选择分类", trigger: "change" }
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        image: [{ required: true, message: "请上传封面", trigger: "change" }],
        description: [
          { required: true, message: "请填写摘要", trigger: "blur" }
        ],
        text: [{ required: true, message: "请填写正文内容", trigger: "blur" }]
      },
      schoolArr: [],
      typeArr: [],
      fileList: [],
      imageUrl: "",
      showDialog: false,
      searchData: {},
      editorOption: {
        //  富文本编辑器配置
        modules: {
          toolbar: {
            container: "#toolbar"
          }
        },
        theme: "snow",
        placeholder: "请输入正文"
      }
    };
  },
  created() {
    this.getSubjectList(); //学校分类
    if (this.tranData) {
      // 修改
      this.getDetail();
    } else {
    }
  },
  methods: {
    getDetail() {
      _request
        .http(this, "article/findToId", { id: this.tranData })
        .then(res => {
          console.log(res);
          this.ruleForm.id = res.data.id;
          this.ruleForm.school_id = res.data.school_id;
          this.ruleForm.title = res.data.title;
          this.ruleForm.image = res.data.image;
          this.ruleForm.key_word = res.data.key_word;
          this.ruleForm.sources = res.data.sources;
          this.ruleForm.accessory = res.data.accessory;
          this.ruleForm.description = res.data.description;
          this.ruleForm.text = res.data.text;
          this.imageUrl = res.data.image; //图片
          this.$nextTick(() => {
            this.schoolChange();
          });
          this.ruleForm.article_type_id = res.data.article_type_id;
        });
    },
    handleRemove(file, fileList) {
      console.log(file);
      console.log(fileList);
      this.ruleForm.accessory = JSON.parse(JSON.stringify(fileList));
    },
    getContent(val) {
      this.ruleForm.text = val;
      if (this.ruleForm.text) {
        this.$refs.textquill.clearValidate();
      }
    },
    clearFun() {
      this.$emit("closeAdd");
    },
    getSubjectList() {
      _request.http(this, "schoolLists").then(res => {
        this.schoolArr = res.data; //分类
      });
    },
    //学校下拉框修改
    schoolChange(val) {
      _request
        .http(this, "listType", { school_id: this.ruleForm.school_id })
        .then(res => {
          console.log(res);
          this.typeArr = res.data; //分类
        });
    },
    addType() {
      // this.$emit("gotoTypePage");
      this.$router.push('/operate/articleAdmin/artileCate')
    },
    // 提交表单
    submitForm(ruleForm) {
      console.log(JSON.stringify(this.ruleForm));
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (this.tranData) {
            // 修改
            _request
              .http(this, "article/exitForId", this.ruleForm)
              .then(res => {
                console.log(res);
                this.$emit("successClose");
              });
          } else {
            _request
              .http(this, "article/addArticle", this.ruleForm)
              .then(res => {
                console.log(res);
                this.$emit("successClose");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消提交表单操作

    //上传图片 之后的钩子方法
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.code == 200) {
        this.ruleForm.image = res.data;
        this.$refs.uploadFile.clearValidate();
      }
      console.log(this.ruleForm.image);
      console.log(res);
    },
    //上传之前的钩子方法
    beforeAvatarUpload(file) {
      return testPostImage(file);
    },

    handleChange(res, file) {
      var getData = res.data;
      console.log(JSON.stringify(getData));
      console.log({ name: getData.name, url: getData.url });
      var obj = { name: getData.name, url: getData.url };
      this.ruleForm.accessory.push(obj);
      console.log(this.ruleForm.accessory);
    },
    beforeAvatarFileUpload(file){
      var FileExt = file.name.replace(/.+\./, "");       
      if (['rar','zip','doc','docx','xls','xlsx','pptx','ppt','txt','jpg','png','pdf'].indexOf(FileExt.toLowerCase()) === -1){            
        this.$message({ 
            type: 'warning', 
            message: '请上传后缀名为rar、zip、jpg、png、txt、pdf、ppt、pptx、doc、docx、xls或xlsx的附件！' 
         });                
        return false;       
      } 
    }
  }
};
</script>
<style scoped lang="less">
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
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.accounadd {
  height: 100%;
  .head-style {
    margin: 30px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    color: #333333;
  }
  .form-box {
    position: relative;
    width: 100%;
    padding-right: 50px;
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
