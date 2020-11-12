<template>
  <div class="cashAudit">
    <div class="container-box" v-if="showList">
      <div class="content-head">
        <div>页面配置</div>
        <el-form :inline="true">
          <el-select
            v-model="searchData.school_id"
            clearable
            placeholder="选择网校"
            @change="initData"
          >
            <el-option
              v-for="(item, index) in schoolArr"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form>
      </div>
      <div class="content-cont">
        <div class="list-item">
          <div class="content-name">{{ schoolName }}</div>
          <div class="content-warn">Logo配置</div>
          <el-row class="list-cont">
            <el-upload
              class="avatar-uploader"
              :action="fileUploadPath"
              :headers="setHead"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="cover" :src="cover" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-row>
          <div class="content-warn">页头配置</div>
          <el-row class="list-cont">
            <el-col :span="4" v-for="(item, index) in dataHead" :key="index">
              <div class="headName" @click="diffFun(item, index)">
                {{ item.name }}
              </div>
              <!-- <div class="headName" @click="changeItem(item,1)">{{item.name}}</div> -->
            </el-col>
          </el-row>

          <div class="content-warn">页尾配置</div>
          <el-row class="list-cont" :gutter="20">
            <el-col :span="4" v-for="(item, index) in dataFooter" :key="index">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>{{ item.name }}</span>
                </div>
                <div
                  v-for="(subItem, subIndex) in item.children"
                  :key="subIndex"
                  class="text item"
                >
                  <div class="headName" @click="changeItem(subItem, 2, item)">
                    {{ subItem.name }}
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- <div class="content-warn">{{pagedataShow[0]['name']}}</div>
          <el-row class="list-cont">
            <el-col :span="12" v-for="(item,index) in dataicp" :key="index">
              <div class="headName" @click="changeItem(item,3)">{{pagedataShow[0]['text']}}</div>
            </el-col>
          </el-row>-->
          <div class="content-warn">app页面配置</div>
          <el-collapse class="elCollapse" v-model="activeNames" accordion>
            <el-collapse-item
              v-for="(item, index) in pagedataShow"
              :title="item.name"
              :name="index"
              :key="index"
            >
              <div
                @click="showpageModel(item)"
                v-if="item.text.length"
                v-html="item.text"
              ></div>
              <el-button v-else @click="showpageModel(item)"
                >添加内容</el-button
              >
            </el-collapse-item>
          </el-collapse>

          <div class="content-warn">ICP配置</div>
          <el-row class="list-cont">
            <el-col :span="12" v-for="(item, index) in dataicp" :key="index">
              <div class="headName" @click="changeItem(item, 3)">
                {{ item.name }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 页面配置 -->
    <el-dialog
      :title="pageData.id ? '配置内容' : ''"
      :close-on-click-modal="false"
      :visible.sync="showPageDialog"
      width="80%"
      @close="showPageDialog = false"
      center
    >
      <div class>
        <el-form :model="pageData" style="width: 100%" ref="pageData">
          <el-form-item prop="text" ref="introduce">
            <quill-editors
              @tranCont="getContent1"
              :transIntroduction="pageData.text"
            ></quill-editors>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPageDialog = false">取 消</el-button>
        <el-button type="primary" @click="pagedialogMarksure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 页头页尾ICP配置 -->
    <el-dialog
      :title="addData.id ? '修改' : ''"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      width="80%"
      @close="showDialog = false"
      center
    >
      <div class>
        <el-form
          :model="addData"
          style="width: 100%"
          label-width="120px"
          ref="addData"
          :rules="addDataRule"
        >
          <el-row>
            <el-form-item label="名称：" prop="name">
              <el-input
                v-model="addData.name"
                class="width-100"
                placeholder="请输入名称"
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row v-if="!isIcp || addData.parent_name == '友情链接'">
            <el-form-item label="跳转地址：" prop="url">
              <el-input
                v-model="addData.url"
                class="width-100"
                placeholder="请输入跳转地址"
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="开启状态：" prop="open">
              <el-select v-model="addData.open" clearable placeholder="状态">
                <el-option
                  v-for="(item, index) in openArr"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row v-if="input_title">
            <el-form-item label="banner标题：" prop="title">
              <el-input
                v-model="addData.title"
                class="width-100"
                placeholder="请输入banner标题"
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row v-if="input_title">
            <el-form-item label="banner副标题：" prop="subhead">
              <el-input
                v-model="addData.subhead"
                class="width-100"
                placeholder="请输入banner副标题"
              ></el-input>
            </el-form-item>
          </el-row>
          <el-form-item v-if="isIcp" label="详情：" prop="text" ref="introduce">
            <quill-editors
              @tranCont="getContent"
              :transIntroduction="addData.text"
            ></quill-editors>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="dialogMarksure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import { testPostImage } from "@/utils/index.js";
import quillEditorCom from "./../ueditorCom/comEditor";
export default {
  components: {
    "quill-editors": quillEditorCom,
  },
  data() {
    return {
      schoolName: "",
      schoolBranch: [],
      showList: this.$store.state.SecHeadClick,
      fileUploadPath: this.GLOBAL.postImgUrl,
      setHead: this.GLOBAL.setHead(),
      showDetail: false,
      showDialog: false,
      showPageDialog: false,
      subjectArr: [], //课程列表
      addData: {
        id: "",
        type: "",
        name: "",
        url: "",
        text: "",
        open: 0,
        subhead: "",
        title: "",
        parent_name: "",
      },
      activeNames: 0,
      pageData: {
        id: "",
        type: "",
        text: "",
      },
      openArr: [
        { label: "开启", value: 0 },
        { label: "关闭", value: 1 },
      ],
      isIcp: false,
      input_title: false,
      addDataRule: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入跳转地址", trigger: "blur" }],
      },
      cover: "",
      searchData: {
        school_id: "",
      },
      dataFooter: [],
      dataHead: [],
      dataicp: [],
      dataLogo: [],
      paginationShow: true,
      cur: {
        pageSize: 20, //每页显示条数
        page: 1, //页数
      },
      nextPage: 1,
      totalCount: 0,
      schoolArr: [],
      load: false,
      pagedataShow: [],
    };
  },
  created() {},
  mounted() {
    // 直播课程跳转过来 直接展示详情
    this.initData();
    this.selSchoole();
  },
  methods: {
    showpageModel(item) {
      this.showPageDialog = true;
      this.pageData.id = item.id;
      this.pageData.type = item.type;
      this.pageData.text = item.text;
    },
    beforeAvatarUpload(file) {
      return testPostImage(file);
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        console.log(JSON.stringify(res));
        // this.addData.cover = res.data;
        this.cover = URL.createObjectURL(file.raw);
        // this.$refs.uploadFile.clearValidate();
        _request
          .http(this, "pageset/doLogoUpdate", {
            school_id: this.dataLogo[0]["school_id"],
            logo: res.data,
          })
          .then((res) => {
            this.$message.success(res.msg);
          });
      } else {
        alert(res.msg);
      }
    },
    getContent(val) {
      this.addData.text = val;
    },
    getContent1(val) {
      this.pageData.text = val;
    },
    diffFun(item, index) {
      if (index == 8) {
        this.changeItem(item, 8); // 人机交互修改链接
      } else {
        this.changeItem(item, 1);
      }
    },
    changeItem(item, getType, parent) {
      let type = 0;
      if (getType == 8) {
        type = 1;
      } else {
        type = getType;
      }
      this.addData = {
        id: item.id,
        type: type,
        name: item.name,
        url: item.url,
        text: item.text,
        open: item.is_open,
        subhead: item.subhead,
        title: item.title,
      };
      if (parent) {
        this.addData.parent_name = parent.name;
      }
      this.input_title = false;
      this.isIcp = true;
      if (getType == 1) {
        // 扫码支付需要title输入框 其他不需要
        if (item.status == 0) {
          this.input_title = true;
        }
      }
      if (getType == 3 || getType == 8) {
        this.isIcp = false;
      }

      this.showDialog = true;
      this.$refs.addData && this.$refs.addData.clearValidate();
    },
    selSchoole() {
      _request.http(this, "schoolLists").then((res) => {
        this.schoolArr = res.data; //分类
      });
    },

    closeFun() {
      this.showList = true;
      this.showDetail = false;
      this.initData();
    },

    pagedialogMarksure() {
      this.$refs.pageData.validate((valid) => {
        if (valid) {
          // 修改
          _request.http(this, "pageset/details", this.pageData).then((res) => {
            if (res.code == 200) {
              this.showPageDialog = false;
              this.initData();
            }
          });
        }
      });
    },
    dialogMarksure() {
      this.$refs.addData.validate((valid) => {
        if (valid) {
          // 修改
          _request.http(this, "pageset/details", this.addData).then((res) => {
            if (res.code == 200) {
              this.showDialog = false;
              this.initData();
            }
          });
        }
      });
    },
    initData() {
      _request
        .http(
          this,
          "pageset/getList",
          { curSchool_id: localStorage.getItem("school_id") },
          this.searchData
        )
        .then((res) => {
          this.dataFooter = res.data.footer;
          this.dataHead = res.data.header;
          this.dataicp = res.data.icp;
          this.dataLogo = res.data.logo;
          this.cover = res.data.logo[0]["logo"];
          this.schoolName = res.data.school_name;
          this.pagedataShow = res.data.about;
        });
    },
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", (data) => {
        this.showList = data;
        this.showDetail = false;
      });
    },
  },
};
</script>

<style scoped lang="less">
.list-item {
  background: #ffffff;
  -webkit-box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  margin: 0 0 20px;
  padding-bottom: 20px;
  .content-name {
    padding: 30px 20px 10px;
    font-size: 20px;
    font-weight: bold;
  }
  .content-warn {
    font-size: 16px;
    font-weight: bold;
    padding: 10px 20px;
    border-bottom: solid 1px #f2f2f2;
    margin-bottom: 20px;
  }
  .content-list {
    padding-left: 20px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    .list-head {
      font-size: 16px;
      margin-bottom: 10px;
      font-weight: bold;
      color: #444;
      padding-left: 5px;
      .webImg {
        width: 20px;
        height: 20px;
        margin-right: 4px;
        vertical-align: top;
      }
    }
  }
  .list-cont {
    padding-bottom: 10px;
    margin-bottom: 15px;
    padding-left: 22px;
    cursor: pointer;
    .el-col {
      margin-bottom: 10px;
    }
  }
}
.elCollapse {
  box-shadow: 0px 0px 14px 5px rgba(0, 0, 0, 0.05);
  margin: 20px;
  padding: 5px 20px 10px;
  cursor: pointer;
  /deep/ p {
    margin-bottom: 0;
  }
}
.elCollapse:hover {
  color: #26a4fd;
}
.headName:hover {
  color: #26a4fd;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.item {
  padding-top: 10px;
}
.box-card {
  width: 100%;
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
  width: 200px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 100px;
  display: block;
  background: #f4f4f4;
}
/deep/ .el-collapse-item__header {
  color: #333;
  font-size: 14px;
  font-weight: bold;
}
</style>