<template>
  <div class="content">
    <div class="step step-one" v-if="step == 1">
      <div class="header-nav">
        <div class="header">
          <div class="line"></div>
          页尾配置
        </div>
      </div>
      <div class="nav-meat">
        <div class="template">
          <div class="template-head">
            <div class="title">模版一</div>
            <el-button @click="handleModelEdit(1)">设置</el-button>
          </div>
          <div class="select-block">
            <div class="mask">
              <el-button
                class="select-button"
                v-if="selectedModel == 1"
                type="success"
                >正在使用</el-button
              >
              <el-button
                class="select-button"
                @click="selectFootModel(1)"
                v-else
                >启用</el-button
              >
            </div>
            <template v-if="footerOptionOne">
              <footOne :footerOption="footerOptionOne"></footOne>
            </template>
          </div>
        </div>
      </div>
      <div class="nav-meat">
        <div class="template">
          <div class="template-head">
            <div class="title">模版二</div>
            <el-button @click="handleModelEdit(2)">设置</el-button>
          </div>
          <div class="select-block">
            <div class="mask">
              <el-button
                class="select-button"
                v-if="selectedModel == 2"
                type="success"
                >正在使用</el-button
              >
              <el-button
                class="select-button"
                @click="selectFootModel(2)"
                v-else
                >启用</el-button
              >
            </div>
            <footTwo :footerOption="footerOptionTwo"></footTwo>
          </div>
        </div>
      </div>
      <div class="nav-meat">
        <div class="template">
          <div class="template-head">
            <div class="title">模版三</div>
            <el-button @click="handleModelEdit(3)">设置</el-button>
          </div>
          <div class="select-block">
            <div class="mask">
              <el-button
                class="select-button"
                v-if="selectedModel == 3"
                type="success"
                >正在使用</el-button
              >
              <el-button
                class="select-button"
                @click="selectFootModel(3)"
                v-else
                >启用</el-button
              >
            </div>
            <footThree :footerOption="footerOptionThree"></footThree>
          </div>
        </div>
      </div>
    </div>
    <div class="step step-two" v-else-if="step == 2">
      <tplone v-if="model == 1"></tplone>
      <tpltwo v-if="model == 2"></tpltwo>
      <tplthree v-if="model == 3"></tplthree>
    </div>
  </div>
</template>

<script>
import * as footerComponets from "./footerComponents";
import * as API_schoolSet from "@/api/schoolSet";

export default {
  name: "footerService",
  data() {
    return {
      step: 1,
      model: 1,
      selectedModel: 1,
      //option
      footerOptionOne: {
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
      footerOptionTwo: {
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
      footerOptionThree: {
        //color
        themeColor: "#E9E9E9",
        // recordInfo
        recordInfo: {
          logoUrl: "",
          showName: "",
        },
        //footNavList
        footNavList: [
          {
            name: "关于我们",
            url: "",
            type: "默认链接",
          },
        ],
      },
    };
  },
  components: {
    ...footerComponets,
  },
  created() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      API_schoolSet.getConfig().then((res) => {
        let { bottom_list, bottom_type_selected } = res;
        this.selectedModel = res.bottom_type_selected;
        if (bottom_list && bottom_list.length) {
          this.footerOptionOne = JSON.parse(bottom_list[0].bottom_config);
          this.footerOptionTwo = JSON.parse(bottom_list[1].bottom_config);
          this.footerOptionThree = JSON.parse(bottom_list[2].bottom_config);
        }
      });
    },
    selectFootModel(index) {
      let _params = {
        cur_type: "bottom_type_selected",
        cur_type_selected: 0,
        cur_content: index,
      };
      API_schoolSet.setConfig(_params).then((res) => {
        this.$toast("设置成功");
        this.selectedModel = index;
      });
    },
    handleModelEdit(model) {
      this.step = 2;
      this.model = model;
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: calc(100%-60px);
  height: auto;
  box-sizing: border-box;
  padding: 30px;
  background: #ffffff;
  margin-left: 20px;
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding-bottom: 500px;
}
.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header {
    display: flex;
    align-items: center;
  }
  .line {
    display: inline-block;
    margin-right: 15px;
    width: 4px;
    height: 20px;
    background: rgb(32, 166, 255);
  }
}
.nav-meat {
  margin-top: 30px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 30px;
  padding-top: 10px;
}
.template-head {
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
}
.select-block {
  position: relative;
  .select-button {
    position: absolute;
    right: 20px;
    top: 20px;
  }
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
