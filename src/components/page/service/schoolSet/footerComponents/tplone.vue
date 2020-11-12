<template>
  <div class="content">
    <div class="content-nav">
      <div class="nav-header">
        <div class="nav-line"></div>
        <div class="nav-text">导航效果预览</div>
      </div>
      <div class="nav-meat">
        <footOne :footerOption="footerOption"></footOne>
        <div class="nav-color">
          <div class="nav-color-text">选择主题颜色:</div>
          <div class="nav-color-tab">
            <div
              class="color"
              v-for="(color, key) in colors"
              :key="key"
              :style="{ backgroundColor: color }"
              @click="changeColor(color)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="finished">
      <!-- 底部链接 -->
      <foot-url-edit
        :data="footerOption.footNavList"
        :model="1"
        @change="setNavList"
      ></foot-url-edit>
      <!-- 底部公司信息配置 -->
      <compony-info
        :data="footerOption.componyInfo"
        @change="setComponyInfo"
      ></compony-info>
      <!-- 备案信息配置 -->
      <record-info
        :data="footerOption.recordInfo"
        @change="setRecordInfo"
      ></record-info>
      <!-- 营销链接 -->
      <marketing-url
        :data="footerOption.marketingUrl"
        @change="setMarketingUrl"
      ></marketing-url>
      <!-- submit -->

      <div style="margin: 20px auto">
        <el-button size="large" type="primary" @click="submit"
          >存为草稿</el-button
        >
        <el-button @click="submit" size="large" type="primary"
          >保存发布</el-button
        >
      </div>
    </template>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import itemEdit from "../component/itemEdit";
import componyInfo from "./common/componyInfo";
import recordInfo from "./common/recordInfo";
import marketingUrl from "./common/marketingUrl";
import footUrlEdit from "./common/footUrlEdit";
import footOne from "./template/footOne";
import * as API_schoolSet from "@/api/schoolSet";
export default {
  name: "tplone",
  data() {
    return {
      footerOption: {
        //color
        themeColor: "#E9E9E9",
        //componyINfo
        componyInfo: {
          logoUrl: "",
          componyName: "",
          icp: "",
          records: [],
        },
        // recordInfo
        recordInfo: {
          logoUrl: "",
          showName: "",
        },
        //marketingUrl
        marketingUrl: {
          wb: {
            status: true,
            url: "",
          },
          qq: {
            status: true,
            url: "",
          },
          wx: {
            status: true,
            url: "",
          },
        },
        //footNavList
        footNavList: [
          {
            name: "关于我们",
            url: "",
            type: "默认链接",
            children: [
              {
                name: "产品服务",
                url: "",
                type: "默认链接",
              },
            ],
          },
        ],
      },
      colors: ["#252529", "#E9E9E9", "#FFFFFF"],
      //upload
      fileUploadPath: this.GLOBAL.doUploadOssFile,
      //加载完成
      finished: false,
    };
  },
  components: {
    componyInfo,
    recordInfo,
    marketingUrl,
    footUrlEdit,
    footOne,
  },
  created() {
    API_schoolSet.getConfig().then((res) => {
      const { bottom_list } = res;
      let footerOption = bottom_list.filter((item) => {
        return item.bottom_type == 1;
      })[0];
      this.footerOption = JSON.parse(footerOption.bottom_config);
      this.finished = true;
    });
  },
  methods: {
    changeColor(color) {
      this.footerOption.themeColor = color;
    },
    //component set
    setComponyInfo(data) {
      this.footerOption.componyInfo = data;
    },
    setRecordInfo(data) {
      this.footerOption.recordInfo = data;
    },
    setMarketingUrl(data) {
      this.footerOption.marketingUrl = data;
    },
    setNavList(data) {
      console.log(data);
      this.footerOption.footNavList = data;
    },
    //保存发布
    submit() {
      let _params = {
        cur_type: "bottom_config",
        cur_type_selected: 1,
        cur_content: JSON.stringify(this.footerOption),
        // cur_content: localStorage.getItem("footerOption"),
      };
      API_schoolSet.setConfig(_params).then((res) => {
        this.$toast("保存成功");
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
//tplone
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

/deep/ .el-upload-list {
  margin-left: 0;
}
</style>
