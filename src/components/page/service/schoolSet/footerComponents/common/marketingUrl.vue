<template>
  <div>
    <div class="content-nav">
      <div class="nav-header">
        <div class="nav-line"></div>
        <div class="nav-text">营销链接</div>
      </div>
      <div class="nav-meat">
        <div class="item wb">
          <div class="item-head">
            <div class="left">
              <img src="logo" alt="" />
              新浪微博
            </div>
            <div class="right">
              <el-switch
                style="display: inline-block"
                v-model="marketingUrl.wb.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </div>
          </div>
          <div class="item-content">
            <div class="edit-item">
              <div class="label">链接地址：</div>
              <el-input placeholder="链接地址" v-model="marketingUrl.wb.url">
              </el-input>
            </div>
          </div>
        </div>
        <div class="item qq">
          <div class="item-head">
            <div class="left">
              <img src="logo" alt="" />
              腾讯营销
            </div>
            <div class="right">
              <el-switch
                style="display: inline-block"
                v-model="marketingUrl.qq.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </div>
          </div>
          <div class="item-content">
            <div class="edit-item">
              <div class="label">链接地址：</div>
              <el-input placeholder="链接地址" v-model="marketingUrl.qq.url">
              </el-input>
            </div>
          </div>
        </div>
        <div class="item wx">
          <div class="item-head">
            <div class="left">
              <img src="logo" alt="" />
              微信
            </div>
            <div class="right">
              <el-switch
                style="display: inline-block"
                v-model="marketingUrl.wx.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </div>
          </div>
          <div class="item-content">
            <div class="edit-item">
              <div class="label">链接地址：</div>
              <el-input
                placeholder="链接地址"
                v-model="marketingUrl.wx.url"
                :disabled="true"
              >
              </el-input>

              <div class="img">
                <div class="img-up">
                  <img class="record-img" :src="marketingUrl.wx.url" alt="" />
                  <el-upload
                    :limit="1"
                    :action="fileUploadPath"
                    :on-success="handleSuccess"
                    :on-remove="handleRemove"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click.stop="clearFiles"
                      >点击删除</el-button
                    >
                  </el-upload>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-button class="submit" type="primary" @click="submit"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "componyInfo",
  props: ["data"],
  data() {
    return {
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
      //upload
      fileUploadPath: this.GLOBAL.doUploadOssFile,
    };
  },
  mounted() {
    if (this.data) {
      this.marketingUrl = JSON.parse(JSON.stringify(this.data)); //深拷贝
    }
  },
  methods: {
    clearFiles() {
      console.log(this.$refs.upload);
      this.marketingUrl.wx.url = "";
    },
    submit() {
      console.log(this.marketingUrl);
      this.$emit("change", this.marketingUrl);
    },
    handleRemove(res) {},
    handleSuccess(res) {
      this.marketingUrl.wx.url = res.data.url;
    },
  },
};
</script>
<style lang="less" scoped>
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
//marketingUrl
.item {
  margin-bottom: 30px;
  font-size: 14px;
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
}
.item-head {
  padding: 0 30px;
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
}
.item-content {
  padding: 30px;
  border-top: solid 1px #e5e5e5;
}
.edit-item {
  display: flex;
  font-size: 14px;
  height: 50px;
  align-items: center;
  .el-input {
    width: 500px;
  }
  .el-radio {
    margin-top: 9px;
  }
}
//img
//record
.img-up {
  font-size: 14px;
  display: flex;
  align-items: center;
  .record-img {
    display: block;
    margin: 0 10px;
    width: 20px;
    height: 20px;
  }
}

/deep/ .el-upload--text {
  border: none;
}
</style>