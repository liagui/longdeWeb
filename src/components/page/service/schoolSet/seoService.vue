<template>
  <div>
    <div class="content">
      <div class="nav-header">
        <div class="nav-line"></div>
        <div class="nav-text">SEO配置</div>
      </div>
      <div class="mate">
        <div class="seo-set" :key="index" v-for="(item, index) in seoSetUp">
          <div class="seo-img">
            <img
              :src="item.is_forbid ? item.seo_imgUrl : item.seo_deimgUrl"
              alt=""
            />
          </div>
          <div class="seo-tilt">
            {{ item.page_type }}
          </div>
          <div class="seo-buton">
            <el-row v-show="item.is_forbid"
              ><el-button
                style="width: 90px; height: 40px"
                @click="seoDisable(item, index)"
                ><span>禁用</span></el-button
              >
              <el-button
                style="width: 90px; height: 40px"
                type="primary"
                @click="openSet(item, index)"
                >设置</el-button
              >
            </el-row>
            <el-row v-show="!item.is_forbid"
              ><el-button
                style="width: 90px; height: 40px"
                @click="seoDisable(item, index)"
                ><span>启用</span></el-button
              >
            </el-row>
          </div>
        </div>
        <div style="width: 270px; height: 300px; margin-left: 30px"></div>
      </div>
    </div>
    <!-- set-set -->
    <el-dialog
      :visible.sync="seoShow"
      :title="setData.page_type"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form>
        <el-form-item label="网站标题：">
          <el-input
            type="textarea"
            v-model="setData.title"
          ></el-input>
          <div class="tips">如果有多个关键字，请用英文输入法下逗号“,”或“I”隔开</div>
        </el-form-item>
        <el-form-item label="SEO关键字：">
          <el-input
            type="textarea"
            v-model="setData.keywords"
          ></el-input>
          <div class="tips">如果有多个关键字，请用英文输入法下逗号“,”或“I”隔开</div>
        </el-form-item>
        <el-form-item label="网站标题：">
          <el-input
            type="textarea"
            v-model="setData.description"
            maxlength="500"
            show-word-limit
          ></el-input>
          <div class="tips">提示描述内容不能超过500个字</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="seoShow = false">取 消</el-button>
        <el-button type="primary" @click="setSeoData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- uplodeImg -->
    <uplodeImg
      :show="imgShow"
      :favicoUrl="favicoUrl"
      @close="imgShow = false"
      @upload="setFavico"
    ></uplodeImg>
  </div>
</template>
<script>
import uplodeImg from "./component/seoImageUplode";
import sortableTable from "./sortableTable/index.vue";
import setseoText from "./component/setSeotext";
import * as API_schoolSet from "@/api/schoolSet";
import { image } from "./component/image";
export default {
  name: "",
  data() {
    return {
      seoSetUp: [
        {
          seo_imgUrl: image.diqiu,
          seo_deimgUrl: image.diqiude,
          page_type: "浏览器图标",
          is_forbid: 1,
          seo_set: "",
        },
        {
          seo_imgUrl: image.jigou,
          seo_deimgUrl: image.jigoude,
          page_type: "首页SEO",
          is_forbid: 1,
        },
        {
          seo_imgUrl: image.dangan,
          seo_deimgUrl: image.dangande,
          page_type: "课程列表SEO",
          is_forbid: 1,
        },
        {
          seo_imgUrl: image.shuju,
          seo_deimgUrl: image.shujude,
          page_type: "公开课SEO",
          is_forbid: 1,
        },
        {
          seo_imgUrl: image.xinxi,
          seo_deimgUrl: image.xinxide,
          page_type: "新闻列表SEO",
          is_forbid: 1,
        },
      ],
      imgShow: false,
      setData: {},
      favicoUrl: "",
      seoList: [],
      seoShow: false,
    };
  },
  components: {
    uplodeImg,
    sortableTable,
    setseoText,
  },
  created() {
    API_schoolSet.getSEOConfig().then((res) => {
      this.favicoUrl = res.favicon_info.favicon_config;
      this.seoList = res.page_list;
      this.seoSetUp.forEach((item, index) => {
        if (index == 0) {
          this.seoSetUp[0].is_forbid = res.favicon_info.is_forbid_favicon;
        } else {
          this.seoSetUp[index].is_forbid = res.page_list[index - 1].is_forbid;
        }
      });
      console.log(this.seoSetUp);
    });
  },
  methods: {
    //启用，禁用设置
    seoEnable(index) {
      this.seoSetUp[index].is_forbid = true;
    },
    seoDisable(item, index) {
      let _params = {
        cur_type: this.seoSetUp[index].page_type,
        is_forbid: item.is_forbid == 1 ? 0 : 1,
      };
      if (index == 0) {
        _params.cur_type = "favicon_config";
      }
      API_schoolSet.setSEOOpen(_params).then((res) => {
        this.seoSetUp[index].is_forbid =
          this.seoSetUp[index].is_forbid == 1 ? 0 : 1;
        this.$toast("设置成功");
      });
    },
    setSeoData() {
      API_schoolSet.setPageSEOConfig(this.setData).then((res) => {
        this.$toast("设置成功");
        this.seoShow = false;
      });
    },
    setFavico(favicoUrl) {
      let _params = {
        cur_type: "favicon_config",
        cur_type_selected: 0,
        cur_content: favicoUrl,
      };
      API_schoolSet.setConfig(_params).then((res) => {
        this.$toast("设置成功");
      });
    },
    openSet(item, index) {
      if (index == 0) {
        console.log(index);
        this.imgShow = true;
        return;
      } else {
        let setData = this.seoList.filter((seo) => {
          return seo.page_type == item.page_type;
        })[0];
        if (setData) {
          console.log(setData);
          this.setData = setData;
        }
        this.seoShow = true;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  width: calc(100%-60px);
  box-sizing: border-box;
  padding: 0 30px;
  padding-bottom: 500px;
  background: #ffffff;
  margin-left: 20px;
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}
/*标题*/
.nav-header {
  width: 100%;
  box-sizing: border-box;
  padding: 25px 0;
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
}
/*主体部分*/
.mate {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-between;
  width: calc(100%-60px);
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 30px 30px;
  box-sizing: border-box;
  overflow: hidden;
  .seo-set {
    width: 270px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
    margin-left: 30px;
    background: #ffffff;
    box-shadow: 0px 0px 9px 1px rgba(0, 26, 44, 0.1);
    border-radius: 4px;
  }
  .seo-img {
    width: 60px;
    height: 60px;
    margin-top: 50px;
    img {
      width: 60px;
      height: 60px;
    }
  }
  .seo-tilt {
    height: 25px;
    margin-top: 30px;
    font-size: 24px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #333333;
    line-height: 25px;
    text-align: center;
  }
  .seo-buton {
    margin-top: 58px;
  }
}

.el-dialog{
  .tips{
    font-size: 12px;
    color: #50A3F6;
  }
}
</style>
