<template>
  <div class="tool swiper-edit">
    <el-title title="菜单设置"></el-title>
    <div class="option-item">
      <div class="label">菜单显示：</div>
      <el-radio v-model="optionData.menuShow" label="1">是</el-radio>
      <el-radio v-model="optionData.menuShow" label="2">否</el-radio>
    </div>
    <div class="option-item">
      <div class="label">菜单颜色：</div>
      <el-radio v-model="optionData.menuColor" label="#fff">是</el-radio>
      <el-radio v-model="optionData.menuColor" label="#000">否</el-radio>
    </div>
    <div class="option-item">
      <div class="label">菜单显示：</div>
      <el-slider
        v-model="optionData.menuOpc"
        show-input
        :show-input-controls="false"
      ></el-slider>
    </div>
    <el-title title="添加轮播图">
      <el-button type="primary" @click="addSwiper">添加轮播图</el-button>
    </el-title>
    <draggable
      class="draggable-right swiper-contain"
      v-bind="draggOption"
      :list="optionData.swiperData"
      handle=".handleSwiper"
    >
      <div
        class="swiper-card"
        v-for="(item, key) in optionData.swiperData"
        :key="key"
      >
        <div class="card-head">
          <div class="left">第{{ key + 1 }}张</div>
          <div class="right handle">
            <i class="el-icon-s-fold handleSwiper"></i>
          </div>
        </div>
        <img :src="item.imgUrl" alt="" class="swiper-img" />
        <div class="option-item upload" style="height: auto">
          <div class="label">上传图片：</div>
          <ld-upload
            ref="upload"
            :on-success="(res) => handleSuccess(res, item)"
            :on-remove="handleRemove"
          >
            <el-button style="margin-top: 20px">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              当前轮播图建议上传尺寸为 1920px*536px
            </div>
          </ld-upload>
        </div>
        <div class="option-item">
          <div class="label">链接地址：</div>
          <el-input v-model="item.imgLink"></el-input>
        </div>
        <div class="option-item">
          <div class="label">链接状态：</div>
          <el-switch
            v-model="item.imgStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </div>
        <div class="card-button">
          <el-button type="danger" @click="deleteCard(key)">删除</el-button>
          <!-- <el-button type="primary" @click="saveCard">保存</el-button> -->
        </div>
      </div>
      <div class="block-card">

      </div>
    </draggable>
    <div class="swiper-block"></div>
    <div class="tool-button">
      <el-button @click="saveOption">保存配置</el-button>
    </div>
  </div>
</template>

<script>
import mixin from "../common/mixin.js";
export default {
  name: "swiperEdit",
  mixins: [mixin],
  data() {
    return {
      fileUploadPath: this.GLOBAL.doUploadOssFile,
      optionData: {
        menuShow: "1",
        menuColor: "#fff",
        menuOpc: 1,
        swiperData: [
          {
            imgUrl: "",
            imgLink: "",
            imgStatus: false,
          },
        ],
      },
    };
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

  methods: {
    //uplpad
    handleSuccess(res, item) {
      item.imgUrl = res.data.url;
    },
    handleRemove() {},
    //swiper
    addSwiper() {
      if (this.optionData.swiperData) {
        this.optionData.swiperData.push({
          imgUrl: "",
          imgLink: "",
          imgStatus: false,
        });
      } else {
        this.$set(this.optionData, "swiperData", [
          {
            imgUrl: "",
            imgLink: "",
            imgStatus: false,
          },
        ]);
      }
    },
    // save
    deleteCard(index) {
      this.optionData.swiperData.splice(index, 1);
    },
    saveCard() {
      console.log(this.optionData);
    },
    saveOption() {
      this.$emit("setBlockData", this.optionData);
    },
  },
};
</script>
<style lang="less" scoped>
@import "../common/tpl.css";
.upload {
  align-items: start;
  .label {
    padding-top: 30px;
  }
}
.swiper-contain {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: flex-start;
  .block-card{
    width: 350px;
    margin-bottom: 30px;
  }
  .swiper-card {
    margin-bottom: 30px;
    width: 350px;
    padding: 10px 20px;
    background: #ffffff;
    box-shadow: 0px 0px 9px 1px rgba(0, 26, 44, 0.1);
    border-radius: 10px;
    &::after {
      content: "";
      display: block;
      width: 30%;
      border: 1px solid transparent;
    }
  }
  .card-head {
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: space-between;
  }
  .swiper-img {
    width: 100%;
    height: 160px;
    background-color: gray;
  }
  .swiper-block {
    margin-top: 30px;
    width: 30%;
    min-width: 400px;
    padding: 10px 20px;
  }
}
.card-button {
  display: flex;
  justify-content: flex-end;
}
</style>