<template>
  <div class="content">
    <ul>
      <li>
        <div class="content-nav">
          <div class="nav-header">
            <div class="nav-line"></div>
            <div class="nav-text">导航效果预览</div>
          </div>
          <div class="nav-meat">
            <div
              class="nav-logo"
              :style="{ backgroundColor: headerOption.themeColor.bgColor }"
            >
              <img
                class="logo"
                v-if="headerOption.headType == 1"
                :src="headerOption.logoUrl"
              />
              <div
                class="logo"
                :style="{ color: headerOption.themeColor.activeColor }"
                v-else
              >
                {{ headerOption.comName }}
              </div>
              <div class="nav">
                <ul>
                  <li
                    :key="index"
                    v-for="(item, index) in headerOption.navList"
                    v-show="item.status"
                    @click="active(index)"
                    :class="index == colorIndex ? 'active' : ''"
                  >
                    <span
                      v-if="index == colorIndex"
                      :style="{ color: headerOption.themeColor.activeColor }"
                      >{{ item.name }}</span
                    >
                    <span
                      v-else
                      :style="{ color: headerOption.themeColor.fontColor }"
                    >
                      {{ item.name }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="nav-color">
              <div class="nav-color-text">选择主题颜色:</div>
              <div class="nav-color-tab">
                <div
                  class="color"
                  v-for="(color, key) in colors"
                  :key="key"
                  :style="{ backgroundColor: color.bgColor }"
                  @click="changeColor(color)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="content-nav">
          <div class="nav-header">
            <div class="nav-line"></div>
            <div class="nav-text">企业标识</div>
          </div>
          <div class="nav-meat">
            <div class="tab">
              <el-radio v-model="headerOption.headType" label="1"
                >LOGO:</el-radio
              >
              <el-radio v-model="headerOption.headType" label="2"
                >公司名称</el-radio
              >
            </div>
            <div class="img" v-if="headerOption.headType == 1">
              <img class="img-image" :src="headerOption.logoUrl" />
              <div class="img-up">
                <el-upload
                  class="upload-demo"
                  :limit="1"
                  :action="fileUploadPath"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :headers="setHead"
                  :file-list="imageList"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">
                    <span>*</span
                    >建议上传<span>透明底色的PNG</span>图片，图像尺寸为<span
                      >170px *36px</span
                    >。
                  </div>
                </el-upload>
              </div>
            </div>
            <div class="componyName" v-else>
              <el-input
                class="name-input"
                v-model="headerOption.comName"
                placeholder="公司名称"
              >
                <template slot="append">
                  <el-button>修改</el-button>
                </template>
              </el-input>
              <div class="tips">
                <i style="color: #5fc54e">*</i>
                说明：填写公司名称，或者是你想显示在网校导航栏LOGO位置的文字，长度要求2～8字。
              </div>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="content-nav">
          <div class="nav-header">
            <div class="nav-line"></div>
            <div class="nav-text">菜单导航栏设置</div>
          </div>
          <div class="nav-meat">
            <div class="nav-selct">
              <div>一级导航名称</div>
              <div style="flex: 2">链接地址</div>
              <div>状态</div>
              <div>操作</div>
            </div>
            <draggable
              class="draggable-right"
              v-bind="draggOption"
              :list="headerOption.navList"
              filter=".forbid"
              handle=".handle"
              :move="onMove"
            >
              <url-edit
                v-for="(item, key) in headerOption.navList"
                :key="key + 1"
                :data="item"
                :model="1"
                :head="true"
                :index="key"
                :class="{ forbid: item.forbid }"
                @itemChange="itemChange"
                @itemDelete="itemDelete"
              ></url-edit>
              <div class="item-add" @click="addItem">
                <i class="el-icon-plus"></i>
                新增
              </div>
            </draggable>
          </div>
        </div>
      </li>
      <li style="margin: 20px auto">
        <el-button @click="submit" size="large" type="normal"
          >保存草稿</el-button
        >
        <el-button @click="submit" size="large" type="primary"
          >保存发布</el-button
        >
      </li>
    </ul>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import _request from "@/utils/request";
import itemEdit from "./component/itemEdit";
import urlEdit from "./component/urlEdit";
import * as API_schoolSet from "@/api/schoolSet";
export default {
  name: "",
  data() {
    return {
      colorIndex: "0",
      setHead: this.GLOBAL.setHead(),
      headerOption: {
        headType: "1",
        logoUrl: "",
        themeColor: {
          bgColor: "#000",
          fontColor: "#fff",
          activeColor: "#fff",
        },
        navList: [
          {
            name: "首页",
            url: "/home",
            status: true,
            forbid: false,
            children: [],
          },
          {
            name: "课程",
            url: "/onlineStudent",
            status: true,
            children: [],
          },
          {
            name: "公开课",
            url: "/courses",
            status: true,
            children: [],
          },
          {
            name: "题库",
            url: "/question",
            status: true,
            children: [],
          },
          {
            name: "新闻",
            url: "/newsNotice",
            status: true,
            children: [],
          },
          {
            name: "名师",
            url: "/teacher",
            status: true,
            children: [],
          },
          {
            name: "问答",
            url: "/quesAnwers",
            status: true,
            children: [],
          },
          {
            name: "扫码支付",
            url: "/corporatePurchase",
            qrcode: 1,
            status: true,
            children: [],
          },
        ],
      },
      radio: "1",
      colors: [
        {
          bgColor: "#FFFFFF",
          fontColor: "#666666",
          activeColor: "#00A2FF",
        },
        {
          bgColor: "#252529",
          fontColor: "#999999",
          activeColor: "#FFFFFF",
        },
        {
          bgColor: "#E9E9E9",
          fontColor: "#222222",
          activeColor: "#666666",
        },
        {
          bgColor: "#D3001E",
          fontColor: "#F2F2F2",
          activeColor: "#FFFFFF",
        },
        {
          bgColor: "#34C4B7",
          fontColor: "#F2F2F2",
          activeColor: "#FFFFFF",
        },
        {
          bgColor: "#F59A1C",
          fontColor: "#F2F2F2",
          activeColor: "#FFFFFF",
        },
        {
          bgColor: "#37C47B",
          fontColor: "#F2F2F2",
          activeColor: "#FFFFFF",
        },
        {
          bgColor: "#19A8FF",
          fontColor: "#F2F2F2",
          activeColor: "#FFFFFF",
        },
      ],
      //upload
      imageList: [],
      fileUploadPath: this.GLOBAL.doUploadOssFile,
    };
  },
  components: {
    draggable,
    urlEdit,
    itemEdit,
  },
  computed: {
    // drag
    draggOption() {
      return {
        animation: 0,
        group: "people",
      };
    },
  },
  created() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      API_schoolSet.getConfig().then((res) => {
        let { top_config } = res;
        if (top_config) {
          this.headerOption = JSON.parse(top_config);
        }
      });
    },
    changeColor(color) {
      this.headerOption.themeColor = color;
    },
    active(index) {
      this.colorIndex = index;
    },
    //edit-item
    itemChange(data) {
      const { index, item } = data;
      this.$set(this.headerOption.navList, index, item);
    },
    itemDelete(index) {
      this.headerOption.navList.splice(index, 1);
    },
    addItem() {
      this.headerOption.navList.push({
        name: "模块名称",
        url: "",
        status: false,
        editAble: true,
        children: [],
      });
    },
    // upload
    handleSuccess(res, file, fileList) {
      this.headerOption.logoUrl = res.data.url;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //drag
    onMove(e) {
      if (e.relatedContext.element.forbid) return false;
      return true;
    },
    //保存发布
    submit() {
      let _params = {
        cur_type: "top_config",
        cur_type_selected: 0,
        cur_content: JSON.stringify(this.headerOption),
      };
      API_schoolSet.setConfig(_params).then((res) => {
        this.$toast("成功");
      });
    },
  },
  watch: {},
};
</script>
<style lang="less" scoped>
.content {
  width: calc(100%-60px);
  height: auto;
  box-sizing: border-box;
  padding: 0 30px;
  background: #ffffff;
  margin-left: 20px;
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding-bottom: 500px;
}
.content-nav {
  width: 100%;
  height: auto;
}
.nav-header {
  width: 100%;
  box-sizing: border-box;
  padding: 25px 0;
}
.nav-line {
  width: 4px;
  height: 19px;
  background: rgb(32, 166, 255);
  float: left;
}
.nav-text {
  font-size: 19px;
  height: 19px;
  line-height: 19px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #333333;
  box-sizing: border-box;
  padding: 0 0 0 7px;
}
.nav-meat {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 30px;
}
.nav-logo {
  width: 100%;
  height: 80px;
  background: #ffffff;
  box-shadow: 0px 0px 9px 1px rgba(0, 26, 44, 0.1);
  padding: 18px 30px;
  box-sizing: border-box;
}
.nav-color {
  display: flex;
  margin-top: 30px;
  height: 30px;
}
.nav-color-text {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #777777;
}
.nav-color-tab {
  display: flex;
  height: 30px;
  align-items: center;
}
.color {
  margin: 0 8px;
  width: 20px;
  height: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.img-image {
  vertical-align: top;
  width: 180px;
  height: 100px;
  border: 1px solid #ccc;
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.5);
}
.img-up {
  display: inline-block;
  margin-left: 30px;
}
.img-up span {
  color: red;
}
.componyName {
  .tips {
    margin-top: 20px;
    font-size: 10px;
    color: #999999;
  }
}
.name-input {
  margin-top: 30px;
  width: 300px;
}
.nav-selct {
  box-sizing: border-box;
  padding-left: 30px;
  width: 100%;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.nav-selct div {
  flex: 1;
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #333333;
  line-height: 16px;
  text-align: center;
}
.nav ul {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.nav li {
  height: 45px;
  font-size: 14px;
  font-weight: 400;
  line-height: 45px;
  flex: 1;
  text-align: center;
}
.logo {
  float: left;
  width: 170px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  font-size: 30px;
}
.active {
  color: #27a4fe !important;
  font-weight: 500;
}

.item-add {
  margin-top: 25px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}

/deep/ .el-upload-list {
  margin-left: 0;
}
</style>
