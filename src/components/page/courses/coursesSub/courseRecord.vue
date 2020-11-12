<template>
  <div class="container-box">
    <div class="kecheng-head">
      <el-row>
        <el-col :span="18">
          <div class="head-label">
            <div class="labelTit">课程名称</div>
            <div class="labelText">{{ transData.title }}</div>
          </div>
          <div class="head-label">
            <div class="labelTit">授课类型</div>
            <div class="labelText">
              <span
                v-for="(item, index) in transData.method"
                :key="index"
                style="margin-right: 10px"
                >{{ methods[item] }}</span
              >
            </div>
          </div>
          <div class="head-label">
            <div class="labelTit">价格</div>
            <div class="labelText">{{ transData.pricing }}</div>
          </div>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-button
            @click="postFun(courseStatus)"
            class="sub-btn"
            v-text="courseStatus == 1 ? '下架' : '发布'"
          ></el-button>
        </el-col>
      </el-row>
    </div>

    <div class="kecheng-content">
      <el-row class="height-calc">
        <!-- 章节列表 -->
        <el-col :span="11" class="height-calc">
          <div class="content-left">
            <el-button
              type="primary"
              class="button-new-tag"
              size="small"
              plain
              :disabled="is_nature"
              @click="addArticle"
              >+ 新增章节</el-button
            >
            <el-tree
              class="filter-tree"
              :data="data"
              :props="defaultProps"
              default-expand-all
              :expand-on-click-node="false"
              :render-content="renderContent"
              :highlight-current="true"
              
              node-key="id"
              ref="tree"
              draggable
              :allow-drop="allowDrop"
              @node-drop="sort"
              
            >
              ></el-tree
            >
          </div>
        </el-col>
        <!-- 右侧 -->
        <el-col :span="13" class="height-calc">
          <div class="content-right">
            <!-- 文章章名称添加 -->
            <div class="Chapter" v-if="isChapter">
              <div
                class="subTitle"
                v-text="isAppendData ? '新增章节名称' : '修改章节名称'"
              ></div>
              <el-form
                :model="addChapter"
                :rules="chapterRule"
                ref="addChapter"
              >
                <el-form-item label="章名称：" prop="name">
                  <el-input
                    v-model="addChapter.name"
                    class="width-400"
                    placeholder="请输入章名称"
                    clearable
                  ></el-input>
                  <el-button
                    type="primary"
                    plain
                    size="small"
                    @click="saveChapter"
                    >保存</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
            <!-- 小节信息 -->
            <div v-if="isSubsection">
              <div class="subTitle">小节信息</div>
              <el-form :model="addData" :rules="addDataRule" ref="addData">
                <el-form-item label="类型：" prop="type">
                  <el-radio v-model="addData.type" :label="1">视频</el-radio>
                  <el-radio v-model="addData.type" :label="2">音频</el-radio>
                  <el-radio v-model="addData.type" :label="3">课件</el-radio>
                  <el-radio v-model="addData.type" :label="4">文档</el-radio>
                </el-form-item>
                <el-form-item label="小节名称：" prop="name">
                  <el-input
                    v-model="addData.name"
                    class="width-400"
                    placeholder="请输入小节名称"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item label="是否免费：" prop="is_free">
                  <el-radio v-model="addData.is_free" :label="0">否</el-radio>
                  <el-radio v-model="addData.is_free" :label="1">是</el-radio>
                  <el-radio v-model="addData.is_free" :label="2">试听</el-radio>
                </el-form-item>
                <el-form-item label="选择资源：" prop="resource_id">
                  <div class="videoName" v-if="addData.mt_video_name" plain>
                    {{ addData.mt_video_name }}
                  </div>
                  <el-button
                    size="small"
                    :disabled="is_nature"
                    @click="selResourceFun(addData.resource_id)"
                    type="primary"
                    >选取资源</el-button
                  >
                </el-form-item>
                <el-form-item label="选择资料：">
                  <el-button
                    size="small"
                    :disabled="is_nature"
                    @click="uploadFile(addData.filearr)"
                    type="primary"
                    >上传资料</el-button
                  >
                </el-form-item>
                <div class="showFileList">
                  <div v-for="(item, index) in addData.filearr" :key="index">
                    {{ item.name }}
                    <span class="typeName">{{ item.typeName }}</span>
                  </div>
                </div>

                <el-form-item class="text-center">
                  <el-button
                    type="primary"
                    plain
                    size="small"
                    @click="saveSubsection"
                    >保存</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 选择资料 -->
    <chapter-file
      v-if="changeDialogFile"
      :changeDialogFile="changeDialogFile"
      :transFile="transFile"
      @marksure="marksureFileFun"
      @closeFile="clearFileFun"
    ></chapter-file>

    <chapter-video
      v-if="changeDialogVideo"
      :changeDialogVideo="changeDialogVideo"
      :transId="transId"
      @marksureFun="marksureFun"
      @clearFun="clearFun"
    ></chapter-video>
  </div>
</template>
<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
import chapterVideo from "./../../commonDialog/courseRecordChapterVideo";
import selPdfExcel from "./../../commonDialog/selPdfExcel";
import {courseRecordmixins} from "./courseRecordmixins";
export default {
  // props: ["transData"],
  components: {
    "chapter-video": chapterVideo,
    "chapter-file": selPdfExcel,
  },
  mixins:[courseRecordmixins],
  data() {
    return {
      transData: {},
      is_nature: false,
      transFile: "",
      transId: "",
      showDialog: false,
      changeDialogVideo: false,
      changeDialogFile: false,
      courseStatus: 0,
      methods: ["", "直播", "录播", "其他"],
      fileList: [],
      data: [],
      defaultProps: {
        children: "childs",
        label: "name",
      },
      isChapter: false,
      isSubsection: false,
      addChapter: {
        name: "",
        course_id: this.$route.query.transId,
        id: "",
      },
      addData: {
        course_id: this.$route.query.transId,
        type: 1,
        name: "",
        filearr: [],
        is_free: 0,
        resource: "",
        chapter_id: "",
        resource_id: "",
        mt_video_name: "",
      },
      chapterRule: {
        name: [{ required: true, message: "请输入章名称", trigger: "blur" }],
      },
      addDataRule: {
        name: [{ required: true, message: "请输入节名称", trigger: "blur" }],
      },
      isAppendData: Boolean,
      expandedList:[], //展开的树的id
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    if (this.$route.query.nature == 1) {
      this.is_nature = true;
    } else {
      this.is_nature = false;
    }

    this.getDetail();
    // console.log(this.transData);
  },
  methods: {
    // 拖拽判断
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.parent.id === dropNode.parent.id) {
          // 向上拖拽 || 向下拖拽
          return type === "prev" || type === "next";
        }
      } else {
        // 不同级进行处理
        return false;
      }
    },    
// 拖拽完成之后的回调
    sort(draggingNode, dropNode, type, event) {
      let nodeArr = dropNode.parent.childNodes;
      let parmArr = [];
      for(var i=0;i<nodeArr.length;i++){
        parmArr.push(nodeArr[i]['key']);
      }
      _request
        .http(this, "course/updateChapterListSort", {
          id: parmArr
        })
        .then((res) => {
          if(res.code == 200){
            this.initData();
          }
        });
    },

    getDetail() {
      _request
        .http(this, "course/courseFirst", {
          id: this.$route.query.transId,
          nature: this.$route.query.nature,
        })
        .then((res) => {
          if (res.code == 200) {
            this.transData = res.data;
            this.courseStatus = res.data.status;
          }
        });
    },
    uploadFile(arr) {
      this.changeDialogFile = true;
      this.transFile = arr;
    },

    // 关闭弹窗
    clearFileFun(att) {
      this.changeDialogFile = false;
      // this.addData.filearr = att;
    },

    // 关闭弹窗
    clearFun() {
      this.changeDialogVideo = false;
    },
    marksureFileFun(att) {
      this.addData.filearr = att;
    },
    marksureFun(name, id) {
      console.log(name);
      console.log(id);
      this.changeDialogVideo = false;
      this.addData.mt_video_name = name;
      this.addData.resource_id = id;
    },
    selResourceFun(id) {
      this.changeDialogVideo = true;
      this.transId = id;
      console.log(this.changeDialogVideo);
    },
    del_file(row, index) {
      console.log("删除ID：" + JSON.stringify(row) + "===" + index);
    },
// 发布、下架
    postFun(type) {
      this.$emit("successClose", 1);
      var typeVal = type == 1 ? 2 : 1;
      var typeText = type == 1 ? "下架" : "发布";
      this.$confirm(typeText + "该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request
            .http(this, "course/courseUpStatus", {
              id: this.transData.id,
              status: typeVal,
            })
            .then((res) => {
              if (res.code == 200) {
                this.courseStatus = typeVal;
              }
            });
        })
        .catch((data) => {});
    },
    addArticle() {
      if (this.is_nature) {
        this.$message.error("此课程是授权课程不能修改");
        return;
      }
      this.isChapter = true;
      this.isAppendData = true;
      this.isSubsection = false;
      this.addChapter.id = "";
      this.addChapter.name = "";
      console.log(this.addChapter.course_id);
    },

    initData() {
      _request
        .http(this, "course/chapterList", {
          course_id: this.$route.query.transId,
          nature: this.$route.query.nature,
        })
        .then((res) => {
          this.data = res.data;
        });
    },
   
    
    },
};
</script>
<style scoped lang="less">
.kecheng-head {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 20px 30px;
  margin: 0 25px 20px;

  .head-label {
    display: inline-block;
    height: 14px;
    margin-top: 20px;
    line-height: 14px;
    font-size: 14px;
    padding-left: 5px;
    border-left: 2px solid #409eff;

    .labelTit {
      display: inline-block;
    }
    .labelText {
      display: inline-block;
      font-size: 16px;
      color: #333;
      font-weight: bold;
      margin-left: 10px;
      margin-right: 30px;
    }
  }
}

/deep/ .custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  width: 94%;
}

/deep/ .el-button--text {
  color: #999;
}
.kecheng-content {
  height: calc(100% - 130px);
  .height-calc {
    height: 100%;
  }
  .content-left {
    height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    padding: 20px 20px;
    margin-left: 25px;
    overflow: auto;
    .button-new-tag {
      background: rgba(217, 235, 255, 1);
      border: 1px solid rgba(38, 164, 253, 1);
      border-radius: 3px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 149, 254, 1);
      margin-bottom: 15px;
    }
  }
  .content-right {
    position: relative;
    min-height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    padding: 10px 30px 20px;
    margin: 0 25px;
    .subTitle {
      font-size: 20px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin: 20px 0;
    }
    .Chapter {
      margin-top: 20px;
    }
  }
}
.text-center {
  text-align: center;
}
.foot-btn {
  text-align: right;
  padding: 20px 35px 0 0;
}

.width-400 {
  width: 380px;
}
/deep/ .el-upload--text {
  border: 0;
}
/deep/ .el-icon-plus {
  border: 0;
  color: #28a745;
  font-weight: bold;
}
/deep/ .el-icon-delete {
  border: 0;
  color: #dc3545;
  font-weight: bold;
}
/deep/ .el-icon-edit-outline {
  border: 0;
  color: #ffc107;
  font-weight: bold;
}
.videoName {
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: #ecf5ff;
  border-color: #d9ecff;
  float: left;
  margin-right: 5px;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  color: #409eff;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
}

/deep/ .treeWidth {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .custom-tree-node:link, 
/deep/ .custom-tree-node:hover,
/deep/ .custom-tree-node:visited,
/deep/ .custom-tree-node:active,
/deep/ .custom-tree-node:focus
// /deep/ .treeWidth:link,
// /deep/ .treeWidth:hover,
// /deep/ .treeWidth:visited,
// /deep/ .treeWidth:active,
// /deep/ .treeWidth:focus
{
  background: rgba(0, 0, 0, 0.05);
}
.showFileList {
  margin-left: 30px;
  margin-top: -10px;
  max-height: 150px;
  overflow: auto;
}
.typeName {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
}
</style>
