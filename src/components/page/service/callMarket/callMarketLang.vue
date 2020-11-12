<template>
  <div class="content-boxs">
    <div class="contents">
      <span><i>|</i>微博设置</span>
      <el-switch
        v-model="value"
        active-color="#13ce66"
        inactive-color="#f0f0f0"
        @change="changeStatus(3)"
        :active-text="value ? '开启' : '关闭'"
      >
      </el-switch>
    </div>
    <div class="nav">
      <p>
        <span>微博号：</span>
        <input type="text" v-model="input" placeholder="请在这里输入微博账号" />
      </p>
      <p>
        <span>微博地址</span>
        <input
          type="text"
          v-model="inputs"
          placeholder="请在这里输入微博地址"
        />
      </p>
      <div>
        <span>二维码：</span>
        <el-upload
          class="avatar-uploader"
          :action="fileUploadPath"
          :show-file-list="false"
          :headers="setHead"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </div>
      <el-button type="primary" @click="primise">保存</el-button>
    </div>
  </div>
</template>
<script>
import { testPostImage, postImg } from "@/utils/index.js";
import _request from "@/utils/request";
export default {
  name: "",
  data() {
    return {
      value: true,
      input: "",
      inputs: "",
      imageUrl: "",
      fileUploadPath: this.GLOBAL.postImgUrl,
      setHead: this.GLOBAL.setHead(),
      data: [],
      types: {
        type: "",
      },
    };
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {
    this.initData();
  },
  methods: {
    primise() {
      if (this.input == "") {
        this.$toast("微博号不能为空");
        return;
      } else {
        this.$toast("操作成功");
      }
      if (this.inputs == "") {
        this.$toast("微博地址不能为空");
        return;
      } else {
        this.$toast("操作成功");
      }
      if (this.imageUrl == "") {
        this.$toast("您未上传二维码");
        return;
      } else {
        this.$toast("操作成功");
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      //   const isJPG = file.type === "image/jpeg";
      //   const isLt2M = file.size / 1024 / 1024 < 2;
      //   if (!isJPG) {
      //     this.$message.error("上传头像图片只能是 JPG 格式!");
      //   }
      //   if (!isLt2M) {
      //     this.$message.error("上传头像图片大小不能超过 2MB!");
      //   }
      //   return isJPG && isLt2M;
    },
    initData() {
      _request.http(this, "services/servicelist", { type: 2 }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.data = res.data[2];
        }
      });
    },
    changeStatus(val) {
      this.types.type = val;
      _request.http(this, "services/openstatus", this.types).then((res) => {
        if (res.code == 200) {
          console.log(res);
          // this.value = res.status;
          // if (res.data == 1) {
          //   this.value = true;
          // } else if (res.data == 0) {
          //   this.value = false;
          // }
        }
      });
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.content-boxs {
  width: 95%;
  background: #fff;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow: 3px 5px 5px 3px #f0f0f0;

  .contents {
    width: 95%;
    margin: 0 auto;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 60px;

    i {
      width: 4px;
      font-size: 20px;
      color: rgb(22, 142, 240);
      margin-right: 10px;
    }
  }
}

.nav {
  width: 95%;
  margin: 0 auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  p {
    input {
      width: 230px;
      height: 30px;
      border: none;
      outline: none;
      background: #f0f0f0;
      border-radius: 5px;
      &::placeholder {
        font-size: 12px;
        padding-left: 10px;
      }
    }
  }
  div {
    display: flex;
    .el-upload--picture-card {
      width: 230px;
      height: 230px;
      border-radius: 5px;
      background: #f0f0f0;
      font-size: 15px;
      border: none;
    }
  }
}

.el-button {
  width: 100px;
  margin: 40px 0 30px 100px;
}
</style>
