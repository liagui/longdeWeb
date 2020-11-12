<template>
  <div>
    <div class="content-nav">
      <div class="nav-header">
        <div class="nav-line"></div>
        <div class="nav-text">底部公司信息配置</div>
      </div>
      <div class="nav-meat" v-if="model != 3">
        <div class="tab">
          <el-radio v-model="radio" label="1">LOGO:</el-radio>
          <el-radio v-model="radio" label="2">公司名称</el-radio>
        </div>
        <div class="compony-info" v-if="radio == 1">
          <div class="img">
            <img class="img-image" :src="componyInfo.logoUrl" />
            <div class="img-up">
              <el-upload
                class="upload-demo"
                :limit="1"
                :action="fileUploadPath"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
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
            <div class="record-info">
              <div class="label">备案号：</div>
              <el-input
                v-model="componyInfo.records[0]"
                placeholder="Copyright@"
              ></el-input>
              <el-input
                v-model="componyInfo.records[1]"
                placeholder="北京龙德天成教育科技有限公司"
              ></el-input>
              <span class="block">版权所有</span>
              <el-input
                v-model="componyInfo.records[2]"
                placeholder="京ICP备19014804号—1"
              ></el-input>
            </div>
            <div class="input-contain" v-if="model == 2">
              <div class="input-item">
                <div class="label">自定义内容：</div>
                <el-input v-model="componyInfo.custom"></el-input>
              </div>
              <div class="input-item">
                <div class="label">公司地址：</div>
                <el-input v-model="componyInfo.address"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="componyName" v-else>
          <el-input
            class="name-input"
            v-model="componyInfo.componyName"
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
        <el-button class="submit" type="primary" @click="submit"
          >保存</el-button
        >
      </div>
      <div class="nav-meat" v-else>
        <div class="record-info">
          <div class="label">备案号：</div>
          <el-input
            v-model="componyInfo.records[0]"
            placeholder="Copyright@"
          ></el-input>
          <el-input
            v-model="componyInfo.records[1]"
            placeholder="北京龙德天成教育科技有限公司"
          ></el-input>
          <span>版权所有</span>
          <el-input
            v-model="componyInfo.records[2]"
            placeholder="京ICP备19014804号—1"
          ></el-input>
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
  props: ["data", "model"],
  data() {
    return {
      radio: "1",
      componyInfo: {
        logoUrl: "",
        records: [],
      },
      imageList: [],
      fileUploadPath: this.GLOBAL.doUploadOssFile,
    };
  },
  mounted() {
    if (this.data) {
      this.componyInfo = JSON.parse(JSON.stringify(this.data)); //深拷贝
    }
  },
  methods: {
    handleSuccess(res) {
      this.componyInfo.logoUrl = res.data.url;
    },
    handleRemove() {},
    submit() {
      this.$emit("change", this.componyInfo);
      this.$toast("保存成功");
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
//record
.record-info {
  margin-top: 30px;
  display: flex;
  align-items: center;
  font-size: 14px;
  .el-input {
    margin-right: 15px;
    width: 250px;
  }
  .label {
    width: 100px;
    text-align: right;
  }
  span {
    display: inline-block;
    margin-left: -15px;
    width: 100px;
    text-align: center;
  }
}
.input-contain {
  font-size: 14px;
  .input-item {
    margin-top: 15px;
    display: flex;
    align-items: center;
  }
  .label {
    width: 100px;
    text-align: right;
  }
  .el-input {
    width: 500px;
  }
}
//submit
.submit {
  margin-top: 30px;
}
</style>