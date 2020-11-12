<template>
  <div>
    <div class="wrap">
      <div class="container-fluid">
        <div class="row-fluid">
          <div class="span10 ml17">
            <div class="upbox">
              <form id="fileupload" method="POST" enctype="multipart/form-data">
                <div class="row fileupload-buttonbar">
                  <div class="col-lg-7 mb10">
                    <span class="btn btn-primary fileinput-button">
                      <i class="glyphicon glyphicon-plus"></i>
                      <span>上传视频</span>
                      <!--  <input type="file" name="files"> 单选文件 -->
                      <!-- 可多选文件 -->
                      <input type="file" name="files[]" directory multiple />
                    </span>
                    <span class="fileupload-process"></span>
                    <!-- <span>分类:</span>
                    <div id="subCategorys" style="display:inline-block;position:relative;">
                      <input type="hidden" id="uploadCategory" value="0" />
                      <input type="text" value="默认分类" title="默认分类" id="selectCategoryInput" />
                    </div>-->
                  </div>
                </div>
                <div class="updiv mt1">
                  <table class="uptable table table-striped table-hover" style="text-align:center;">
                    <thead>
                      <tr>
                        <th style="text-align: center;">文件名</th>
                        <!-- <th style="width:80px; text-align: center;">格式</th>
                        <th style="width:80px; text-align: center;">分类</th> -->
                        <th style="text-align: center;">大小</th>
                        <th style="text-align: center;">状态</th>
                        <th style=" text-align: center;">操作</th>
                        <th style="display:none"></th>
                      </tr>
                    </thead>
                    <tbody class="files" ref="ccTbody">
                      <tr class="isTemplate" v-if="data.filename" isTemplate v-show="showFile">
                        <td style="width:300px;">
                          <p class="name" style="margin-top: 6px;">{{data.filename}}</p>
                          <strong class="error text-danger"></strong>
                        </td>
                        <!-- <td>
                          <p style="margin-top: 6px;">{{data.filetype}}</p>
                        </td>
                        <td>
                          <p style="margin-top: 6px;" title></p>
                        </td> -->
                        <td style="width:80px;">
                          <p class="size" style="margin-top: 6px;">{{data.filesize}}</p>
                        </td>
                        <td class="progressbar">
                          <div class="tc" style="margin-top:6px;">上传完毕</div>
                        </td>
                        <td style class="operate"></td>
                        <td width="0%" style="display:none">
                          <input id="isPause" value="false" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="footer_push"></div>
    </div>
    <!-- <script id="template-upload" type="text/x-tmpl">
  {% for (var i=0, file; file=o.files[i]; i++) { %}
      <tr class="template-upload">
          <td style="width:300px;">
              <p class="name" style="margin-top: 6px;">{%=file.name%}</p>
              <strong class="error text-danger"></strong>
          </td>
                <td>
                   <p  style="margin-top: 6px;">{%=file.extendName%}</p>
                </td>
                <td>
                   <p  style="margin-top: 6px;" title="{%=file.categoryDesc%}">{%=file.shortCategoryDesc%}</p>
                </td>
          <td style="width:80px;">
              <p class="size" style="margin-top: 6px;">处理中...</p>
          </td>
  		<td class="progressbar">
  			<div style="margin-top:6px;margin-bottom:4px;margin-left: 20px;width:150px;display:inline-block;" class="progress progress-striped active mb0 tc_rel" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
  				<div class="progress-bar progress-bar-success" style="width:0%;"></div>
  				<div style="margin-top: 1px;" class="tc tc_pos upload_percent progress-u">0%</div>
  			</div>
  			<span class="rate" style="vertical-align:super; margin-top:6px; margin-left: 20px;display:inline-block;"></span>
  		</td>
          <td style="" class="operate">
              {% if (!i && !o.options.autoUpload) { %}
                  <button class="btn btn-primary btn-xs start" style="margin-top:3px;" disabled>
                      <i class="glyphicon glyphicon-upload"></i>
                      <span>开始上传</span>
                  </button>
              {% } %}
              {% if (!i) { %}
                  <button class="btn btn-warning btn-xs cancel" style="margin-top:3px;">
                      <i class="glyphicon glyphicon-ban-circle"></i>
                      <span>取消</span>
                  </button>
              {% } %}
  			{% if (!i) { %}
                  <button class="btn btn-primary btn-xs" id="pause" style="margin-top:3px;" disabled>
                      <i class="glyphicon glyphicon-ban-circle"></i>
                      <span>暂停</span>
                  </button>
              {% } %}
  			{% if (!i) { %}
                  <button class="btn btn-primary btn-xs" id="resume" style="display:none; margin-top:3px;">
                      <i class="glyphicon glyphicon-upload"></i>
                      <span>续传</span>
                  </button>
              {% } %}
          </td>
  		<td width="0%" style="display:none">
              <input id="isPause" value="false">
          </td>
      </tr>
  {% } %}
    </script>-->
  </div>
</template>
<script>
import global from "@/store/global";
// import "./js/tmpl.min.js";
import "./js/categoryLayer.js";
import "./js/cch5upload.js";
// import "./js/index.js";
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          filename: null
        };
      }
    }
  },
  name: "",
  components: {},
  watch: {},
  computed: {},
  data() {
    return {
      showFile:true,
    };
  },
  mounted() {
    
    //加载分类
    // loadCategory();
    let _this = this;
    let viedeoInfo = {};
    var uploader = new CCH5Uploader({
      timeout: 180000, // 设置超时处理时间 超时时间3分钟 超时会重试
      maxChunkSize: 1024 * 1024, // 1M 最大不超过4M
      limitConcurrentUploads: 3, //并发上传文件数
      maxRetries: 10, // 文件上传失败重试次数,默认10次
      retryTimeout: 500, //重试延迟时间（毫秒）
      autoUpload: true, //是否添加文件后自动上传
      fileInput: $("#fileupload").find("input[type='file']"), //文件输入组件，必需要有的配置,可以是多个
      filesContainer: $(".files"), //上传文件记录显示的容器

      // 重写获取分类名的方法,没有分类时不需要配置或者返回null
      getCategoryName: function() {
        var hasCategory = $("#uploadCategory").length > 0;
        if (!hasCategory) {
          return null;
        }
        return $("#selectCategoryInput").attr("title");
      },
      //重写获取分类id的方法,没有分类时不需要配置或者返回null
      getCategoryId: function() {
        var hasCategory = $("#uploadCategory").length > 0;
        if (!hasCategory) {
          return null;
        }
        return $("#uploadCategory").val();
      },
      //上传失败重试指定次数后依然失败后的回调
      uploadFail: function(recordNode, fileName, failMsg) {
        errorMsgHandler(
          getShortStr(fileName, 10) + "文件上传失败,原因：" + failMsg
        );
        if (recordNode.find(".rate").length > 0) {
          if (recordNode.find("#pause").css("display") != "none") {
            recordNode.find("#pause").click();
          }
          // 有暂停操作的示例
          recordNode
            .find(".rate")
            .html(
              '<div class="tc" style="margin-top:6px;color:red;">上传失败</div>'
            );
        } else {
          // 无暂停操作的示例
          recordNode
            .find(".start")
            .parent()
            .append('<span style="color:red;">上传失败</span>');
        }
      },

      //上传成功回调,可不做任何处理
      uploadSuccess: function(recordNode, fileName, ccvid) {
        
        console.log("对应的视频id为：" + ccvid);
        _this.$emit("viedeoInfo", viedeoInfo);
        $(".template-upload").remove();
        _this.showFile = true;
        setTimeout(() => {
          $(".template-upload").remove()
        }, 500);
      },

      // 生成视频信息
      createuploadinfo: function(fileName, fileSize, categoryId) {
        var video = {};
        var encodeFileName = encodeURIComponent(fileName);
        var d = {
          title: encodeFileName,
          filename: encodeFileName,
          filesize: fileSize
        };

        //默认分类时不传分类id参数
        if (!!categoryId && categoryId != 0) {
          d.categoryid = categoryId;
        }

        let baseURL =
          process.env.NODE_ENV === "production" ? global.ajaxurl : "/api";

        $.ajax({
          headers: {
            Authorization: "Bearer " + _this.$store.state.token
          },
          url: baseURL + "ccvideoUploadUrl",
          async: false, //必须以同步的方式执行，否则后续操作拿不到接口返回的数据
          type: "post",
          data: d,
          cache: false,
          dataType: "json",
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          error: function() {
            video = {
              errMsg: "获取视频文件vid出错",
              errorType: "network"
            };
          },
          success: function(data) {
            if (data.errMsg) {
              video.errMsg = data.errMsg;
              return;
            }
            _this.showFile = false;
            video.success = true;
            video.uid = data.data.userid;
            video.ccvid = data.data.videoid;
            video.servicetype = data.data.servicetype;
            video.name = fileName;
            video.uri = data.data.chunkurl;
            video.metauri = data.data.metaurl;
            video.size = fileSize;
            viedeoInfo = Object.assign({}, video);
          }
        });
        return video;
      }
    });

    /*******************************************************************************
     * 加载分类
     */
    function loadCategory() {
      $.getJSON("/category/info?t=" + Math.random(), function(data) {
        if (data.error) {
          errorMsgHandler("加载分类失败");
          return;
        }
        var categoryDatas = data.category;
        // 构造分类树
        var categoryTree = initCategoryTree({
          datas: categoryDatas,
          inputId: "selectCategoryInput",
          outerBox: $("#selectCategoryInput").parent(),
          needEnsure: false,
          hasDefault: true,
          defaultName: "默认分类",
          defaultVal: $("#uploadCategory").val(),
          selectItem: function(categoryId, name, shortName) {
            $("#uploadCategory").val(categoryId);
          },
          setDeaultName: function(name, shortName) {
            $("#selectCategoryInput").val(shortName);
          }
        });
      });
    }

    window.onbeforeunload = function(e) {
      if ($(".progress.progress-striped.active.mb0.tc_rel").length) {
        return "视频上传中，离开页面将无法继续上传？";
      } else {
        if (!window.event) {
          return null;
        }
      }
    };

    function getShortStr(str, maxLen) {
      if (typeof str != "string" || str.length <= maxLen) {
        return str;
      }
      return str.substr(0, maxLen) + "...";
    }

    function errorMsgHandler(msg) {
      alert(msg);
    }
  },
  methods: {}
};
</script>
<style src="./css/style.css" scoped></style>
<style src="./css/bootstrap.css" scoped></style>
<style src="./css/category.css" scoped></style>

