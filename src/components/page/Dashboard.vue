<template>
  <div>
    <div class="backdrop" v-if="BackdropShow">
      <div class="changePassword">
        <div class="title">
          修改密码
          <i @click="IconClose" class="icon_right el-icon-close"></i>
        </div>
        <div class="main">
          <el-input
            class="code_inp"
            v-model="oldpass"
            placeholder="原密码"
          ></el-input>
          <el-input
            class="code_inp"
            v-model="newpass"
            placeholder="新密码(至少8位,包含大小写字母和数字)"
          ></el-input>
          <el-input
            class="code_inp"
            v-model="ConNewpass"
            placeholder="确认新密码"
          ></el-input>
          <el-button class="Sub_btn" @click="SubBtn" type="primary"
            >修改</el-button
          >
        </div>
      </div>
    </div>
    <div v-else class="container hei">
      <div>
        您好，
        <span style="font-weight: bolder">{{ homeData.userName }}</span>
        （{{ homeData.roleName }}）
      </div>
      <div>上次登录时间：{{ homeData.lastLoginTime }}</div>
      <div>上次登录地址：{{ homeData.lastLoginAddress }}</div>
      <div v-if="homeData.lastLoginIP">
        上次使用IP：{{
          homeData.lastLoginIP ? homeData.lastLoginIP : "无法获取IP地址"
        }}
      </div>
      <!--<div v-if="code.CheckSmsSurplus">短信余额：{{homeData.verificationCode ? homeData.verificationCode : 0}} 条</div>-->
      <!--<div v-if="code.CheckSmsSurplus">业务短信余额：{{homeData.serviceCode ? homeData.serviceCode : 0}} 条</div>-->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _request from "@/utils/request";
export default {
  data() {
    return {
      code: this.$store.state.objCode,
      BackdropShow: false,
      oldpass: "",
      newpass: "",
      ConNewpass: "",
      homeData: {},
    };
  },
  mounted() {
    console.log(this.$store.state.token, "token");
    console.log(this.$store.state.orgId, "orgId");

    // 页面数据初始化
    if (sessionStorage.getItem("needResetPassword") === "0") {
      this.BackdropShow = true;
    } else {
      this.BackdropShow = false;
      this.initData();
    }

    if (this.$route.path !== "/login") {
      document
        .getElementById("view")
        .setAttribute(
          "content",
          "width=640,minimum-scale=0.1,user-scalable=off, initial-scale=0.3"
        );
    }
    this.getEditName();
  },
  methods: {
    // 提交修改密码
    SubBtn() {
      if (this.oldpass === "") {
        this.$message("请输入原密码");
        return false;
      } else if (this.newpass === "") {
        this.$message("请输入新密码");
        return false;
      } else if (this.ConNewpass === "") {
        this.$message("请输入确认新密码");
        return false;
      } else if (this.newpass != this.ConNewpass) {
        this.$message("两次新密码输入不一致");
        return false;
      }
      // axios
      //   .post(this.GLOBAL.ajaxurl + "employee/changePassword", {
      //     header: {
      //       token: this.$store.state.token,
      //       orgId: this.$store.state.orgId
      //     },
      //     body: {
      //       oldPassword: this.oldpass,
      //       newPassword: this.newpass
      //     }
      //   })
      //   .then(
      //     function(res) {
      //       res = res.data;
      //       if (res.message.code === 0) {
      //         this.$message(res.message.userMsg);
      //         this.$router.push("/login");
      //         this.BackdropShow = false;
      //       } else if (res.message.code === 5) {
      //         this.$message(res.message.userMsg);
      //         this.$router.push("/login");
      //       } else {
      //         this.$message(res.message.userMsg);
      //       }
      //     }.bind(this)
      //   );
    },
    IconClose() {
      this.$message("请修改密码,无法关闭");
    },
    initData() {
      _request.http(this, "getLoginShowInfo").then((res) => {
        this.homeData = res;
        console.log(this.homeData, "homeData");
        if (res.productName) {
          this.$store.commit("ProductName", res.productName);
        } else {
          this.$store.commit("ProductName", "风控名称");
        }
      });
    },
    //初始化发送数据
    initPostData(obj) {
      let postData = {};
      Object.keys(obj).forEach((item) => {
        if (obj[item] !== "" || obj[item] === 0) {
          postData[item] = obj[item];
        }
      });
      return postData;
    },
    getEditName() {},
  },
};
</script>

<style scoped lang="less">
.hei {
  width: 100%;
  height: 100%;
  padding: 80px;
  box-sizing: border-box;
  position: fixed;
  div {
    margin-bottom: 30px;
  }
}
.backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 11;
  background-color: rgba(0, 0, 0, 0.3);
}
.changePassword {
  width: 30%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 12;
}
.title {
  padding: 10px 15px;
  background: #f8f8f8;
  border-bottom: 1px solid #efefef;
  color: black;
}
.icon_right {
  float: right;
  line-height: 25px;
}
.main {
  padding: 15px 15px;
  background: white;
  text-align: center;
}
.code_inp {
  width: 80%;
  margin-bottom: 15px;
}
.Sub_btn {
  width: 80%;
  height: 35px;
  margin-top: 15px;
}
</style>
