<template>
  <div class="container-box search-box-top">
    <el-form :model="resource" :rules="resourceRule" ref="resource" :inline="true">
      <el-form-item label="文章标题：" prop="title">
        <el-input v-model="resource.title" placeholder="请输入文章标题" style="width:460px" clearable></el-input>
      </el-form-item>
      <el-form-item label="文章副标题：" prop="subTitle">
        <el-input v-model="resource.subTitle" placeholder="请输入文章副标题" style="width:460px" clearable></el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input
          type="number"
          v-model="resource.sort"
          min="1"
          onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          placeholder="请输入显示序号"
          style="width:124px"
        ></el-input>
      </el-form-item>
      <el-form-item label="文章类型：" prop='chargeType'>
        <el-select class="input-width-150" v-model="resource.chargeType">
          <el-option
            v-for="(item, index) in chargeTypeArr"
            :label="item.text"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签：" prop="labels">
        <el-select
          style="width:380px"
          multiple
          :multiple-limit="4"
          placeholder="请选择"
          v-model="resource.labels"
        >
          <el-option
            v-for="(item, index) in tagArr"
            :label="item.labelName"
            :value="item.labelId"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <div style="display:inline-block;">
        <el-form-item label="缩略图：" prop="icon">
          <el-upload
            :action="fileUploadPath"
            class="avatar-uploader"
            accept="image/jpeg, image/jpg, image/png, image/gif"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editLogo" width="100%" :src="editLogo" style="width: 100px;" alt />
            <!-- <img v-if="editLogo" width="100%" :src="editLogo" style="width: 250px;height:50px;" alt /> -->

            <div v-else>点击上传</div>
          </el-upload>
        </el-form-item>
        <!-- <div class="imgWarn" v-if="!editLogo">仅支持格式为jpg/png/gif，大小不超过500k的图片</div> -->
        <!-- <div class="imgWarn" v-if="!editLogo">仅支持尺寸为750px*150px，格式为jpg/png/gif，大小不超过500k的图片</div> -->
      </div>
      <!-- <vue-ueditor-wrap v-model="resource.content" :config="myConfig"></vue-ueditor-wrap> -->
      <div id="summernote"></div>
      <div class="footer-box">
        <div class="elbtn">
          <el-button @click="reset_btn">取消</el-button>
          <el-button type="primary" :disabled="submitBtn" @click="con_tent">保存</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import _request from "@/utils/request";
import $ from "jquery";

import { checkEnACharac2, checkEnACharac4, rightNumber1 } from "@/utils/rules";
export default {
  name: "UserProtocol",
  props: {
    section: {
      type: Number,
      required: true
    },
    direcData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      getData: "",
      loanAgreement: {
        orgName: ""
      },
      chargeTypeArr: [
        { value: 0, text: "免费" },
        { value: 1, text: "会员免费" },
        // { value: 2, text: "付费" }
      ],
      contents: "",
      resource: {
        dataToken: "",
        articleId: "",
        section: 1,
        title: "",
        subTitle: "",
        sort: 1,
        labels: "",
        content: "",
        icon: "",
        chargeType:1
      },
      resourceRule: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          // { max: 30, message: "长度不能超过30字", trigger: "blur" },
          // {
          //   validator: checkEnACharac4,
          //   trigger: "blur"
          // }
        ],
        subTitle: [
          // { max: 30, message: "长度不能超过30字", trigger: "blur" },
          // {
          //   validator: checkEnACharac4,
          //   trigger: "blur"
          // }
        ],
        sort: [
          { required: true, message: "请输入显示序号", trigger: "blur" },
          {
            validator: rightNumber1,
            trigger: "blur"
          }
        ],
        labels: [{ required: true, message: "请选择标签", trigger: "change" }],
        chargeType: [{ required: true, message: "", trigger: "change" }]
      },
      tagArr: [],
      editLogo: "",
      fileUploadPath: this.GLOBAL.ajaxurl + "oss/uploadFile",
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: "630",
        // 初始容器宽度
        initialFrameWidth: "95%",
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: "http://35.201.165.105:8000/controller.php",
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        //生产环境一定要用这个目录，类似运营商必须挂到risk目录下。
        UEDITOR_HOME_URL: "/zhuanfan/static/lib/ueditor/"
        // UEDITOR_HOME_URL: '/static/lib/ueditor/'
      },
      submitBtn:false

    };
  },
  methods: {
    // 保存
    con_tent() {
      this.$refs.resource.validate(valid => {
        if (valid) {
          if ($("#summernote").summernote("isEmpty")) {
            this.$message({
              type: "info",
              message: "请添加文章内容"
            });
            return;
          }
          this.resource.content = $("#summernote").summernote("code");
          if (
            this.resource.articleId == undefined ||
            this.resource.articleId == ""
          ) {
            console.log("创建");
            axios
              .post(this.GLOBAL.ajaxurl + "article/createArticle", {
                header: {
                  token: this.$store.state.token
                },
                body: this.resource
              })
              .then(res => {
                if (res.data.message.code === 1) {
                  this.$message({
                    type: "success",
                    message: "添加成功!"
                  });
                  this.resource.section = 1;
                  this.resource.title = "";
                  this.resource.subTitle = "";
                  this.resource.sort = 1;
                  this.resource.chargeType = 1;
                  this.resource.labels = "";
                  this.resource.content = "";
                  this.resource.icon = "";
                  this.resource.articleId = "";
                  this.resource.dataToken = "";
                  this.editLogo = "";
                  // this.$router.push("/" + this.$route.params.redirectionUrl);
                  this.$emit("actionSubmit");
                } else {
                  this.$message({
                    type: "info",
                    message: res.data.message.userMsg
                  });
                }
                this.submitBtn = false;
              })
              .catch(res => {
                this.$message({
                  type: "info",
                  message: this.res.message.userMsg
                });
                this.submitBtn = false;
              });
          } else {
            console.log("修改");

            axios
              .post(this.GLOBAL.ajaxurl + "article/editArticle", {
                header: {
                  token: this.$store.state.token,
                  employeeId: this.$store.state.employeeId
                },
                body: this.resource
              })
              .then(res => {
                if (res.data.message.code === 1) {
                  this.$message({
                    type: "success",
                    message: "修改成功!"
                  });
                  this.resource.section = 1;
                  this.resource.title = "";
                  this.resource.subTitle = "";
                  this.resource.sort = 1;
                  this.resource.chargeType = 1;
                  this.resource.labels = "";
                  this.resource.content = "";
                  this.resource.icon = "";
                  this.resource.articleId = "";
                  this.resource.dataToken = "";
                  this.editLogo = "";
                  // this.$router.push("/" + this.$route.params.redirectionUrl);
                  this.$emit("actionSubmit");
                } else {
                  this.$message({
                    type: "info",
                    message: res.data.message.userMsg
                  });
                }
                this.submitBtn = false;
              }).catch(res => {
                this.$message({
                  type: "info",
                  message: this.res.message.userMsg
                });
                this.submitBtn = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    // 取消
    reset_btn() {
      // this.$router.push("/" + this.$route.params.redirectionUrl);
      this.resource.section = 1;
      this.resource.title = "";
      this.resource.subTitle = "";
      this.resource.sort = 1;
      this.resource.labels = "";
      this.resource.content = "";
      this.resource.icon = "";
      this.resource.articleId = "";
      this.resource.dataToken = "";
      this.editLogo = "";
      this.$emit("actionClear");
      // this.$emit('actionSubmit');
    },
    getLoanAgreement() {
      _request
        .http(this, "protocol/getProtocolDetail", {
          type: 1
        })
        .then(res => {
          this.loanAgreement = JSON.parse(res.params);
          this.contents = res.content;
        });
    },
    getTag() {
      _request.http(this, "label/findConditionLabels").then(res => {
        this.tagArr = res.data.labels;
      });
    },
    handleAvatarSuccess(res, file) {
      var img_url = URL.createObjectURL(file.raw);
      var img = new Image();
      this.submitBtn = true;
      img.src = img_url;
      img.onload = () => {
        this.editLogo = URL.createObjectURL(file.raw);
        this.$nextTick(() => {
          this.postImg("oss/uploadFile", file.raw).then(res => {
            this.resource.icon = res.downloadUrl;
            this.submitBtn = false;
          }).catch(res => {
                this.$message({
                  type: "info",
                  message: this.res.message.userMsg
                });
                this.submitBtn = false;
              });
        });

        // if (img.width != 750 || img.height != 150) {
        //   this.$message({
        //     type: "info",
        //     message: "上传图片大小必须是750*150!"
        //   });
        // } else {
        //   this.editLogo = file.raw;
        //   this.editLogo.bannerUrl = URL.createObjectURL(file.raw);
        // }
      };
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/jpg" || "image/gif";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 < 500;
      if (!isJPG && !isPNG) {
        this.$message({
          type: "info",
          message: "上传图片必须是JPG/PNG/GIF 格式!"
        });
      }
      // return isJPG || isPNG;
      if (!isLt2M) {
        this.$message({
          type: "info",
          message: "图片尺寸不正确，请重新选择!"
        });
      }
      this.submitBtn = true;
      return true;

      // return (isJPG || isPNG) && isLt2M;
    },
    //上传图片
    postImg(url, imgFile) {
      var formData = new FormData();
      console.log(imgFile);
      formData.append("file", imgFile);
      return new Promise((resolve, reject) => {
        axios.post(this.GLOBAL.ajaxurl + url, formData).then(res => {
          switch (res.data.message.code) {
            case 1:
              resolve(res.data.data);
              break;
            default:
              reject(res.data.message.userMsg);
              this.$message({
                type: "info",
                message: res.data.message.userMsg
              });
              break;
          }
        });
      });
    }
  },
  mounted() {
    this.getTag();
    this.resource.title = "";
    this.resource.subTitle = "";
    this.resource.sort = 1;
    this.resource.chargeType = 1;
    this.resource.labels = "";
    this.resource.content = "";
    this.resource.icon = "";
    this.resource.articleId = "";
    this.resource.dataToken = "";
    this.editLogo = "";
    $('#summernote').summernote('reset');
    $('#summernote').summernote('destroy');
    if (this.direcData.articleId) {
      this.resource = this.direcData;
      this.resource.subTitle =
        this.direcData.subTitle == "-" ? "" : this.direcData.subTitle;
      this.resource.labels = Object.keys(this.direcData.labels);
      $("#summernote").summernote("code", this.direcData.content);

      this.resource.icon = this.direcData.icon;
      this.editLogo = this.direcData.icon;
    }
    this.resource.section = this.section;

    var _this = this;
    $("#summernote").summernote({
      // lang: "zh-CN",
      placeholder: "请输入内容",
      height: 400,
      minHeight: 400,
      width: "95%",
      htmlMode: false,
      toolbar: [
        ["style", ["bold", "italic", "underline", "clear"]],
        ["fontsize", ["fontsize"]],
        ["fontname", ["fontname"]],
        ["color", ["color"]],
        ["para", ["ul", "ol", "paragraph"]],
                ['hr',['hr']],//插入水平线                
                // ['link',['link']], //插入链接                
                ['picture',['picture']], //插入图片                
                ['video',['video']], //插入视频
      ],
      fontSizes: ["8", "9", "10", "11", "12", "14", "18", "24", "36"],
      fontNames: [
        "Arial",
        "Arial Black",
        "Comic Sans MS",
        "Courier New",
        "Helvetica Neue",
        "Helvetica",
        "Impact",
        "Lucida Grande",
        "Tahoma",
        "Times New Roman",
        "Verdana"
      ],
  
      callbacks: {
        onSubmit: function() {
          vm.richContent = $("#summernote").summernote("code");
        },
        onImageUpload: function(files) {
          _this.postImg("oss/uploadFile", files[0]).then(res => {
            $("#summernote").summernote("insertImage", res.downloadUrl);
          });
        }
      }
    });
    window.uploadVideo = function() {
      vm.showLoading = true // 因ship上传比较耗时，所以加了个loading提示
      upload($('#video')[0].files[0]).then(url => {// upload是自定义的上传文件函数，这里是上传成功的回调，拿到视频的url
        var node = document.createElement('div') // 创建节点，用于包裹视频，再加这一层是方便调视频样式
        node.innerHTML = '<video controls="controls" style="max-width:100%;" src="' + url + '" />'
        node.cssText = 'width:100%;text-aligen:center;'
        $('#summernote').summernote('insertNode', node)// 插入视频
        vm.showLoading = false // 视频上传结束，去掉loading提示
      })
    }
    // video
    var myVideoBtn = function(context) {
      var ui = $.summernote.ui
      // create button
      var button = ui.button({
        contents: '<i class="rich-video-icon"/><input title="视频" οnchange="uploadVideo()" type="file" id="videoInput" accept="video/*" style="opacity: 0; filter:Alpha(opacity=0);width:20px;height: 20px;margin-left: -20px;position:absolute;">', // 这个是展示在富文本顶部的操作图标，这个rich-video-icon是自己写的
        // tooltip: ''// todo 这个视频提示报错，未知原因
        // click: function() {// 点击按钮触发事件，这边不需要用到
          // context.invoke('editor.insertText', 'xxx')
        // }
      })
      return button.render() // return button as jquery object
    }
    
  }
};
</script>

<style scoped>
.imgWarn {
  width: 300px;
  margin: -20px 0 20px 50px;
}
.footer-box {
  width: 80%;
  margin: 15px 0;
}
.footer-tip {
  display: inline-block;
  line-height: 30px;
  color: red;
  font-size: 14px;
}
.elbtn {
  float: right;
}
.note-editor.note-frame .note-editing-area,
.note-editor.note-airframe .note-editing-area {
  min-height: 500px !important;
}
.note-editing-area {
  min-height: 40px !important;
}
.btn{
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
}
</style>
