<template>
  <div class="addbox">
    <div class="form-box">
      <el-form :model="addData" label-width="100px" ref="formBox" :rules="addDataRule">
        <el-row>
          <el-form-item label="资源平台：" style="margin-top:30px;" prop="pingtai">
            <el-radio v-model="addData.pingtai" :label="1">欢拓</el-radio>
            <el-radio v-model="addData.pingtai" :label="2">CC</el-radio>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="资源类型：" style="margin-top:30px;" prop="resource_type">
            <el-radio v-model="addData.resource_type" :label="1">视频</el-radio>
            <el-radio v-model="addData.resource_type" :label="2">音频</el-radio>
            <el-radio v-model="addData.resource_type" :label="3">课件</el-radio>
            <el-radio v-model="addData.resource_type" :label="4">文档</el-radio>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="所属学科：" prop="parent_id" style="margin-top:10px;">
            <el-cascader
              style="width:100%;"
              v-model="addData.parent_id"
              collapse-tags
              :options="subjectArr"
              clearable
              :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="资源名称：" style="margin-top:10px;" prop="resource_name">
            <el-input
              v-model="addData.resource_name"
              style="width:100%;"
              placeholder="请输入资源名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="资源上传：" ref="uploadFile" prop="resource_url" style="margin-top:10px;">
            <!-- 欢脱 -->
            <div id="uploader" class="tf-uploader-example" v-show="addData.pingtai==1">
              <div id="detailoffile" class="loader-list"></div>
              <div id="fileInfo" class="file-info">
                <span>当前文件信息</span>
              </div>
              <div class="btns">
                <div id="picker"></div>
                <p id="xinf">正在处理文件....</p>
                <button id="ctlBtn" class="btn btn-default">开始上传</button>
              </div>
              <div class="file-progress">
                <em class="cur-precent" id="progress"></em>
              </div>
            </div>
            <!-- cc -->
            <CC v-show="addData.pingtai==2" @viedeoInfo="getVideoInfo" :data="ccUploadInfo" />
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelFun" class="clear-btn">取消</el-button>
      <el-button @click="marksureFun" :disabled="disabled" class="sub-btn">确定</el-button>
    </span>
  </div>
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import constants from "@/utils/constants";
import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
import { checkCharacters, rightNumber } from "@/utils/rules";
import WebUploader from "../../../../static/cropper/webuploader";
import CC from "@/components/videoPlay/cc/CC";
// import $ from 'jquery'
export default {
  components: {
    CC
  },
  data() {
    return {
      ccUploadInfo:{
        filename:null
      },
      schoolBranch: [],
      showlist: true,
      showcate: false,
      showDialog: false,
      subjectArr: [], //课程列表
      addData: {
        pingtai: null,
        ccvid: null,
        resource_type: 1,
        resource_name: "",
        resource_url: "",
        parent_id: [],
        resource_size: 0,
        mt_video_id: "",
        mt_video_name: "",
        mt_duration: "",
        course_id: ""
      },
      addDataRule: {
        pingtai: [{ required: true, message: "请选择类型", trigger: "blur" }],
        resource_type: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        resource_name: [
          { required: true, message: "请输入资源名称", trigger: "blur" }
        ],
        description: [{ validator: checkCharacters, trigger: "blur" }],
        parent_id: [
          { required: true, message: "请选择所属学科", trigger: "change" }
        ],
        resource_url: [
          { required: true, message: "请上传资源", trigger: "change" }
        ]
      },
      fileUploadPath: this.GLOBAL.postImgUrl,
      disabled: false,
      setHead: this.GLOBAL.setHead(),
      payment: {
        status: "",
        userNameOrPhoneNo: "",
        payNo: ""
      },
      order: {
        schoolB: "",
        status: "",
        orderNumber: "",
        payNo: ""
      },
      tableHeight: null,
      cashAudit: {
        userNameOrPhoneNo: "",
        status: ""
      },
      cashAuditData: [],
      selectBox: {
        payType: [],
        repaymentWay: constants.repaymentWay,
        status: constants.status,
        status: [],
        startApplyTime: "",
        endApplyTime: ""
      },
      creatTimes: [],

      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      totalCount: 20,
      rule: {
        orderNo: [
          {
            validator: checkCharacters,
            validator: rightNumber,
            trigger: "blur"
          }
        ]
      }
      // uploader: null,
      // MD5_KEY: null
    };
  },
  props: ["transId"],
  created() {
    this.selTeacher();
  },

  mounted() {
    if (document.body.clientWidth >= 1680) {
      this.tableHeight = parseInt(document.body.clientHeight) - 240 + "px";
      window.onresize = () => {
        this.$nextTick(() => {
          this.tableHeight = parseInt(document.body.clientHeight) - 240 + "px";
        });
      };
    } else {
      this.tableHeight = parseInt(document.body.clientHeight) - 290 + "px";
      window.onresize = () => {
        this.$nextTick(() => {
          this.tableHeight = parseInt(document.body.clientHeight) - 290 + "px";
        });
      };
    }
    if (this.transId) {
      // 修改
      this.getDetail();
    } else {
      this.transId = "";
      this.addData.id = "";
      this.$refs.formBox.resetFields();
    }
    var _this = this;
    var getUploadUrlApi = "videoUploadUrl";
    function getUploadApi(that, md5, name, callback) {
      _request
        .http(that, getUploadUrlApi, {
          title: name,
          video_md5: md5
        })
        .then(res => {
          if (res.code == 200) {
            // console.log('res:'+JSON.stringify(res))
            if (res.data.url) {
              that.addData.resource_url = res.data.url;
              that.addData.mt_video_name = name;
              that.addData.course_id = res.data.course_id;
              that.addData.mt_video_id = res.data.videoId;
              that.addData.resource_size = res.data.filesize;
              that.addData.mt_duration = res.data.duration;
            } else {
              callback && callback(res);
            }

            _this.$refs.uploadFile && _this.$refs.uploadFile.clearValidate();
          } else {
            alert(res.msg);
          }
        });
    }

    // 上传完成后回调客户服务器接口
    var uploadSuccessCallback = function(res) {
      console.warn("## 上传完成, 回调数据 ==>", JSON.stringify(res));
      if (res.code == 0) {
        _this.addData.resource_url = res.data.url;
        _this.addData.course_id = res.data.course_id;
        _this.addData.mt_video_id = res.data.videoId;
        _this.addData.resource_size = res.data.filesize;
        _this.addData.mt_duration = res.data.duration;
      }
    };
    // 绑定事件
    var bindUpload = function() {
      // this.$refs.uploadFile.clearValidate();
      $("#ctlBtn").on("click", function() {
        var fileList = uploader.getFiles();
        // console.log(uploader)
        // if (!uploader.options.server) {
        //   alert("上传地址错误,请设置后再试!");
        //   return false;
        // }
        if (_this.addData.resource_url) {
          _this.$message({
            message: "您已成功上传视频，点击 “确定” 添加入库!",
            type: "success"
          });
          return false;
        }
        if (fileList && fileList.length > 0) {
          uploader.upload();
        } else {
          alert("请选择视频文件上传");
        }
      });
    };

    // 获取MD5
    var MD5_KEY = null;
    var getMD5 = function() {
      return MD5_KEY;
    };
    // uploader => 上传
    var uploader = WebUploader.create({
      // 方法
      method: "POST",
      // 设置文件上传域的name
      fileVal: "filedata",
      // 文件上传地址
      server: null,
      // 失败重试
      chunkRetry: 10,
      // 选择文件的按钮。可选。
      // 内部根据当前运行是创建，可能是input元素，也可能是flash.
      pick: {
        id: "#picker",
        innerHTML: "请选择视频文件",
        multiple: false
      },
      // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
      resize: false,
      // 分片上传
      chunked: true,
      // 默认5M每片
      chunkSize: 5 * 1024 * 1024
    });

    // 文件加入队列前相应
    uploader.on("beforeFileQueued", function(file) {
      uploader.reset();
      $("#xinf").fadeIn();
      $("#ctlBtn").fadeOut(10);
      var fileInfo = file;
      var infoDom = $("#fileInfo");
      var p =
        '<p id="' +
        file.id +
        '">' +
        [
          "文件名: " + file.name,
          "大小: " + (file.size / 1000 / 1000).toFixed(2) + " MB"
        ].join("<br/>") +
        "</p>";
      infoDom.html(p);
    });

    // 文件加入队列 => 计算文件MD5
    uploader.on("fileQueued", file => {
      uploader.md5File(file).then(_md5 => {
        // md5
        MD5_KEY = _md5;
        // 上传地址配置
        if (!uploader.options.server) {
          getUploadApi(this, _md5, file.name, function(res) {
            // console.log('callback_____'+JSON.stringify(res))
            uploader.options.server = res.data.resumeUploadUrl;
            uploader.options.formData = {
              md5: _md5,
              fileVal: res.data.field,
              course_id: [50],
              course: {
                start_time: "2020-05-20"
              }
              // title: res.data.field,
              // video_md5: md5
            };
          });
        } else {
          uploader.options.formData = {
            md5: _md5
          };
        }
        $("#xinf").fadeOut(10);
        $("#ctlBtn").fadeIn();
      });
    });

    // 上传前
    uploader.on("uploadBeforeSend", function(file) {
      console.warn("MD5计算 ==> ", MD5_KEY);
      if (!getMD5()) {
        alert("md5为空");
      }
      $("#ctlBtn").off("click");
    });

    // 上传错误
    uploader.on("uploadError", function(res) {
      console.error("上传出错", res);
    });

    // 进度
    uploader.on("uploadProgress", function(file, precent) {
      var per = parseInt(precent * 100);
      document.querySelector("#progress").style["width"] = per + "%";
      $("#ctlBtn").text("上传中 " + per + "%");

      // _this.disabled = true;
      // setTimeout(()=>{
      //      _this.disabled = false;
      // })
    });

    // 上传成功
    uploader.on("uploadSuccess", (_this, file, res) => {
      // 上传完成后回调数据
      // console.log('file::::'+JSON.stringify(file))
      // console.log('res::::'+JSON.stringify(res))
      uploadSuccessCallback(file);
      // uploadSuccessCallback(res);
      // 上传完成后设置
      uploader.reset();
      $("#ctlBtn").fadeOut(10);
      $("#ctlBtn").text("上传成功");
      $("#" + file.id).append("<em>上传成功</em>");
      setTimeout(function() {
        $("#ctlBtn").text("开始上传");
        bindUpload();
      }, 1500);
    });

    // bind uploadr
    bindUpload();
  },
  methods: {
    getVideoInfo(videoInfo) {
      console.log(videoInfo);
      this.addData.resource_url = videoInfo.metauri;
      this.addData.ccvid = videoInfo.ccvid;
      
      this.ccUploadInfo ={
        filename:videoInfo.name,
        filesize:(videoInfo.size / 1000 / 1000).toFixed(2) +" MB"
      }
    },
    getContent(val) {
      this.addData.content = val;
    },

    cancelFun() {
      this.$emit("closeFun", 1);
    },
    marksureFun() {
      console.log(JSON.stringify(this.addData));
      this.$refs.formBox.validate(valid => {
        if (valid) {
          let param = Object.assign({}, this.addData);
          //欢脱
          if (param.pingtai == 1) {
            param.ccvid = null;
          } else if (param.pingtai == 2) {
            //cc
          }
          if (this.transId) {
            // 修改
            _request.http(this, "updateVideo", param).then(res => {
              console.log(res);
              if (res.code == 200) {
                this.$toast(res.msg);
                this.$emit("successClose", 1);
              } else {
                this.$toast(res.msg);
              }
            });
          } else {
            param.id = "";
            _request.http(this, "video/add", param).then(res => {
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
    getDetail() {
      _request.http(this, "videoShow", { id: this.transId }).then(res => {
        if (res.code == 200) {
          let data = res.data;
          this.addData = data;
          // cc
          if(data.cc_video_id){
            this.addData.pingtai = 2;
            this.ccUploadInfo = {
              filename:data.mt_video_name,
              filesize:(data.resource_size / 1000 / 1000).toFixed(2) +" MB"
            }
          }else{
          // 欢脱
          this.addData.pingtai = 1;
          var infoDom = $("#fileInfo");
          var p =
            '<p id="' +
            res.data.mt_video_id +
            '">' +
            [
              "文件名: " + res.data.mt_video_name,
              "大小: " +
                (res.data.resource_size / 1000 / 1000).toFixed(2) +
                " MB"
            ].join("<br/>") +
            "</p>";
          infoDom.html(p);
          }

        }
      });
    },
    addResource() {
      //  添加资源
      this.showDialog = true;
      // this.$refs.formBox.resetFields();
      this.addData = {
        id: "",
        resource_type: 1,
        resource_name: "",
        resource_url: "",
        mt_video_id: "",
        mt_video_name: "",
        parent_id: [],
        resource_size: 0,
        mt_duration: ""
      };
      this.ccUploadInfo = {
        filename:null,
        filesize:null
      }
    },

    selTeacher() {
      _request.http(this, "subject").then(res => {
        this.subjectArr = res.data;
      });
    },
    dialogMarksure() {
      if (this.addData.id) {
        // 修改
        this.disabled = true;
        _request.http(this, "updateVideo", this.addData).then(res => {
          if (res.code == 200) {
            this.disabled = false;
            this.showDialog = false;
          }
        });
      } else {
        _request.http(this, "video/add", this.addData).then(res => {
          if (res.code == 200) {
            this.disabled = false;
            this.showDialog = false;
            this.addData.id = "";
          }
        });
      }
    }
  }
};
</script>


<style scoped lang="less">
.addbox {
  height: 100%;
  background: #fff;
}
.form-box {
  position: relative;
  width: 100%;
  .schoolName {
    font-size: 16px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
}
.foot-btn {
  margin-top: 20px;
  margin-left: 100px;
  text-align: right;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ebebeb;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
  height: 45px;
  line-height: 45px;
  padding: 0 16px 0 24px;
  box-sizing: border-box;
  .pin {
    cursor: pointer;
    color: #444444;
  }
}
.text-color {
  color: black;
}
.btn {
  display: inline-block;
}
.btn:last-child {
  margin-right: 10px;
}
.input-width-150 {
  width: 96px;
}
/deep/ .webuploader-container {
  height: auto;
  position: relative;
  width: 200px;
  height: 40px;
  line-height: 40px;
  margin: 20px 0;
  background: #ccc;
}
/deep/ #xinf {
  display: none;
}
/deep/ .webuploader-pick {
  position: relative;
  /* padding: 10px; */
  /* width: 892px; */
  /* height: 42px; */
  text-align: center;
  overflow: hidden;
  bottom: auto;
  right: auto;
  width: 270px;
  height: 40px;
  border-width: 0px;
  border-radius: 3px;
  background: #1e90ff;
  cursor: pointer;
  outline: none;
  font-family: "Microsoft YaHei";
  color: white;
  font-size: 17px;
}
/deep/ .webuploader-pick-hover {
  background: #006eda;
}
/deep/ #ctlBtn {
  width: 270px;
  height: 40px;
  border-width: 0px;
  border-radius: 3px;
  background: #1e90ff;
  cursor: pointer;
  outline: none;
  font-family: "Microsoft YaHei";
  color: white;
  font-size: 17px;
  display: none;
}
/deep/ #ctlBtn:hover {
  background: #5599ff;
}
/deep/ .webuploader-container input {
  height: 40px;
  width: 100%;
  /* width: 300px; */
  border: 0 none;
  /* background: green; */
  cursor: pointer;
  display: block;
  overflow: hidden;
  opacity: 0;
}
/deep/ .file-progress {
  height: 6px;
  width: 100%;
  margin: 20px 0;
  border-radius: 5px;
  background-color: #e0e0e0;
  position: relative;
}
/deep/ .cur-precent {
  position: absolute;
  width: 0%;
  height: 6px;
  top: 0;
  background-color: #58b3ff;
  border-radius: 5px;
}
/deep/ .file-info {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 2px;
}
/deep/ .file-info p {
  padding: 5px 15px;
  font-size: 12px;
  background: #edf7ff;
}
/deep/ .file-info p em {
  padding: 2px 4px;
  font-size: 12px;
  margin-left: 6px;
  border-radius: 4px;
  background: #56d000;
  font-style: normal;
  color: #ffffff;
  text-align: center;
}
/deep/ .file-info p:hover {
  background: #dcebf7;
}
/deep/ .tf-uploader-example {
  width: 100%;
  margin: auto;
}
</style>