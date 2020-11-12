<template>
  <div class="container-box login-wrap">
    <!--    <div class="login-title">风控后台管理系统</div>-->
    <div class="ms-login">
      <img src="../../assets/image/login/leftimg.png" class="leftimg" alt />
      <div class="logoBox">
        <div class="logoForm">
          <img src="../../assets/image/login/logoTitle.png" class="logoTitle" alt />
          <div class="gobackText">欢迎回来！</div>
          <div class="loginText">请使用您的账号进行登录</div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="0px"
            class="ms-content"
          >
            <el-form-item prop="username" class="margin-bottom">
              <el-input
                v-model="ruleForm.username"
                placeholder="请输入用户名"
                @focus="focusUserName"
                @blur="blurUserName"
                :style="style_username"
              ></el-input>
              <img :src="userImg" class="user-img" />
            </el-form-item>
            <el-form-item prop="password" class="margin-bottom">
              <i @click="HandlChangeInp" :class="passwordIcon"></i>
              <el-input
                ref="input"
                :type="this.ChangeInp"
                placeholder="请输入密码"
                v-model="ruleForm.password"
                @keyup.enter.native="submitForm('ruleForm')"
                @focus="focusPwd"
                @blur="blurPwd"
                :style="style_pwd"
              ></el-input>
              <img :src="passImg" class="pass-img" />
            </el-form-item>
            <div class="login-btn">
              <el-button @click="submitForm('ruleForm')" class="submit-btn">登录</el-button>
            </div>
            <p class="login-tips" v-show="pass_num_show">提示 : 账号不存在或密码错误，您还可以尝试{{ pass_num }}次。</p>
            <p class="login-tips" v-show="errorMsg">提示 : 账号已被锁定，请联系管理员！</p>
          </el-form>
          <div class="tishi">
            <span style="font-weight: bold">温馨提示：</span>
            <br />该系统仅支持pc浏览器使用，建议使用
            <a href="#" @click="openUrl('https://www.google.cn/chrome')">谷歌浏览器</a>、
            <a href="#" @click="openUrl('http://www.firefox.com.cn')">火狐浏览器</a>，如果使用其他浏览器有可能会遇到不可知问题
            <br />
          </div>
        </div>
      </div>
    </div>

    <p class="copyright">copyright @ 北京泷德天成科技有限公司 京ICP备19058426号-2</p>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import { checkUrl, checkChinese, checkCharacters } from "@/utils/rules";
import _request from "@/utils/request";
import Watermark from "@/utils/watermark";
import iconUser from "../../assets/image/login/user.png";
import iconUserAct from "../../assets/image/login/useract.png";
import iconpass from "../../assets/image/login/pass.png";
import iconpassAct from "../../assets/image/login/passact.png";
export default {
  name: "Login",
  data: function() {
    return {
      passwordIcon: "icon_view el-icon-view iconColor",
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            validator: checkCharacters,
            trigger: "blur",
            message: "不可输入特殊字符，请重新输入！"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkChinese, trigger: "blur" }
        ]
      },
      pass_num: "",
      pass_num_show: false,
      backdrop: false,
      verify: false,
      message: false,
      lastPhone: false,
      employeeId: "",
      verificationCode: "",
      message_num: 0,
      code_show: true,
      count: "",
      timer: null,
      ChangeInp: "password",
      errorMsg: false,
      style_username: {
        border: "0px solid rgba(250,100,0,1)",
        borderRadius: "0px"
      },
      style_pwd: {
        border: "0px solid rgba(250,100,0,1)",
        borderRadius: "0px"
      },
      userImg: iconUser,
      passImg: iconpass,
      school_status: 0,
      menuList: []
    };
  },
  mounted() {
    localStorage.clear();
    sessionStorage.clear();
    // history.pushState(null, null, document.URL);
    // window.addEventListener("popstate", function() {
    //   history.pushState(null, null, document.URL);
    // });
    if (this.$route.params.resetLogin) {
      this.$message("请重新登录");
    }
    Watermark.set(``);

    if (this.$route.path === "/login") {
      this.$nextTick(() => {
        document
          .getElementById("view")
          .setAttribute(
            "content",
            "width=640,minimum-scale=0.1,maximum-scale=1.0,user-scalable=no, initial-scale=0.5"
          );
      });
    }
    // school_status 0==中控menu     1==总控menu2
    let domain = window.location.host;
    if (
      domain == "twotest.admin.longde999.cn" ||
      domain == "admin.longde999.cn" ||
      domain == "localhost:8080"
    ) {
      //总控
      this.school_status = 1;
    } else {
      this.school_status = 0;
    }

    if (this.$route.query.token) {
      this.userLogin();
    }
  },
  methods: {
    getMenu(school_status) {
      if (school_status == 1) {
        ////总控
        this.menuList = this.copyArr(this.$store.state.menu.menu2);
      } else {
        ////中控
        this.menuList = this.copyArr(this.$store.state.menu.menu);
      }

      this.initSelectId(school_status);

      this.$store.commit("menuList", this.menuList);
    },
    initSelectId(school_status) {
      let authList = [...this.$store.state.authList];
      console.log(authList);
      console.log(this.menuList);
      if (authList.length > 0) {
        this.menuList = this.menuList.filter(item => {
          return authList.indexOf(item.id) > -1;
        });
      }
      this.menuList.forEach(item => {
        item.subs.forEach(val => {
          if (school_status == 1) {
            item.subs = item.subs.filter(val => {
              return authList.indexOf(val.id) > -1;
            });
          }
        });
      });
      console.log(this.menuList);
    },
    copyArr(list) {
      return JSON.parse(JSON.stringify(list));
    },
    openUrl(url) {
      window.open(url, "_blank");
    },
    focusUserName() {
      this.style_username = {
        border: "1px solid rgba(8, 153, 213, 1)",
        borderRadius: "4px"
      };
      this.userImg = iconUserAct;
    },
    blurUserName() {
      this.style_username = {
        border: "0px solid rgba(250,100,0,1)",
        borderRadius: "0px"
      };
      this.userImg = iconUser;
    },
    focusPwd() {
      this.style_pwd = {
        border: "1px solid rgba(250,100,0,1)",
        borderRadius: "4px"
      };
      this.passImg = iconpassAct;
    },
    blurPwd() {
      this.style_pwd = {
        border: "0px solid rgba(250,100,0,1)",
        borderRadius: "0px"
      };
      this.passImg = iconpass;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          _request
            .http(this, "login", {
              username: this.ruleForm.username,
              password: this.ruleForm.password,
              school_status: this.school_status
            })
            .then(res => {
              if (res.code === 200) {
                this.loginBack(res, true);
              }
            });
        }
      });
    },

    CountDown() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.code_show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.code_show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    getCode() {
      this.lastPhone = true;
      this.CountDown();
      this.sendVerificationCode();
    },
    onFail() {
      this.$toast("验证失败");
    },
    onRefresh() {
      // this.$toast("刷新成功");
    },
    handlclick() {
      // this.message = false;
      if (!this.message) {
        this.backdrop = false;
        this.verify = false;
      }
      this.message_num = 0;
      this.verificationCode = "";
      // clearInterval(this.timer);
      // this.code_show = true;
      // this.timer = null;
    },
    IconClose() {
      this.backdrop = false;
      this.verify = false;
      this.message = false;
      this.message_num = 0;
      this.verificationCode = "";
      clearInterval(this.timer);
      this.code_show = true;
      this.timer = null;
    },
    HandlChangeInp() {
      this.ChangeInp = this.ChangeInp === "password" ? "text" : "password";
      if (this.ChangeInp === "password") {
        this.passwordIcon = "icon_view el-icon-view iconColor";
      } else {
        this.passwordIcon = "icon_view el-icon-view";
      }
    },
    //总控跳转中控
    userLogin() {
      let _loginParams = {
        token: this.$route.query.token
      };
      this.$store.commit("Token", this.$route.query.token);
      this.$store.commit("cur_admin_id", this.$route.query.cur_admin_id);
      _request
        .http(this, "adminuser/getLoginUserInfo", _loginParams)
        .then(res => {
          if (res.code === 200) {
            this.loginBack(res);
          }
        });
    },
    loginBack(res, reloadToken) {
      this.$toast("验证成功，已登录");
      //自己登录的
      if (reloadToken) {
        this.$store.commit("Token", res.data.token);
      } else {
        //总控跳转中控的
      }
      localStorage.setItem("school_id", res.data.school_id);
      localStorage.setItem("school_name", res.data.school_name);
      localStorage.setItem("ms_username", res.data.realname);
      localStorage.setItem("teacher_type", res.data.teacher_type);

      this.$store.commit("setFlag", true);
      this.$store.commit("authList", res.data.auth);
      this.$store.commit("userInfo", JSON.stringify(res.data));
      this.$store.commit("school_status", res.data.school_status);
      localStorage.setItem("showBank", 1);

      this.getMenu(res.data.school_status);
      this.$store.commit("MENU_SELECT_ID", this.menuList[0].id);
      this.$router.push(this.menuList[0].subs[0].index + "?recive=login");
    }
  }
};
</script>

<style scoped lang='less'>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("../../assets/image/login/bg.png") no-repeat;
  background-size: 100% 100%;
}
.copyright {
  position: absolute;
  width: 100%;
  bottom: 10px;
  color: #fff;
  text-align: center;
}
.ms-login {
  position: absolute;
  width: calc(100% - 332px);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 12px 15px;
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
  border: 5px solid rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 29px 3px rgba(41, 95, 167, 0.46);
  .leftimg {
    float: left;
    width: 52%;
  }
  .logoBox {
    float: left;
    width: 48%;
    text-align: center;
    position: relative;
  }
  .logoForm {
    position: absolute;
    width: 400px;
    left: 50%;
    transform: translateX(-50%);

    .loginText {
      height: 18px;
      line-height: 18px;
      font-size: 18px;
      color: rgba(153, 153, 153, 1);
      margin-bottom: 10px;
    }
    .user-img {
      position: absolute;
      top: 14px;
      left: 10px;
      width: 31px;
      height: 20px;
      padding-right: 10px;
      border-right: 1px solid rgba(233, 237, 238, 1);
    }
    .pass-img {
      position: absolute;
      top: 14px;
      left: 10px;
      width: 30px;
      height: 20px;
      padding-right: 10px;
      border-right: 1px solid rgba(233, 237, 238, 1);
    }
  }
}
.logoTitle {
  margin-top: 8%;
  width: 100%;
}

.gobackText {
  margin-top: 8%;
  margin-bottom: 10px;
  height: 22px;
  line-height: 22px;
  font-size: 24px;
  color: rgba(102, 102, 102, 1);
}
.margin-bottom {
  margin-bottom: 30px;
}
/deep/ .el-input-group {
  height: 50px;
  line-height: 50px;
}
/deep/ .el-input--small .el-input__inner {
  height: 50px;
  line-height: 50px;
  padding-left: 60px;
}
/deep/ input:focus {
  background: #fff;
}
.tishi {
  // position: absolute;
  // bottom: 10px;
  width: 100%;
  text-align: left;
  font-size: 16px;
  color: #666;
}
@media screen and (max-width: 1400px) {
  .ms-login {
    width: calc(100% - 150px);
  }
  .margin-bottom {
    margin-bottom: 20px;
  }
  .logoTitle,
  .gobackText {
    margin-top: 12%;
  }
}
@media screen and (max-width: 1200px) {
  .ms-login {
    width: calc(100% - 90px);
  }
  .margin-bottom {
    margin-bottom: 20px;
  }
  .logoTitle,
  .gobackText {
    margin-top: 10%;
  }
}
@media screen and (max-width: 1100px) {
  .ms-login {
    width: calc(100% - 80px);
  }
  .margin-bottom {
    margin-bottom: 15px;
  }
  .logoTitle,
  .gobackText {
    margin-top: 8%;
  }
}
@media screen and (max-width: 1000px) {
  .margin-bottom {
    margin-bottom: 10px;
  }
  .logoTitle {
    margin-top: 8%;
    width: 100%;
  }

  .gobackText {
    margin-top: 8%;
    margin-bottom: 10px;
    height: 22px;
    line-height: 22px;
    font-size: 24px;
    color: rgba(102, 102, 102, 1);
  }
}
@media screen and (min-width: 1400px) {
  .ms-login {
    width: calc(100% - 200px);
  }
  .margin-bottom {
    margin-bottom: 24px;
  }
  .logoTitle {
    margin-top: 14%;
  }
  .gobackText {
    margin-top: 12%;
    margin-bottom: 20px;
  }
  .submit-btn {
    height: 60px;
    line-height: 60px;
  }
  .tishi {
    margin-top: 10px;
  }
}
@media screen and (min-width: 1600px) {
  .margin-bottom {
    margin-bottom: 30px;
  }
  .logoTitle {
    margin-top: 20%;
  }
  .gobackText {
    margin-top: 18%;
    margin-bottom: 20px;
  }
  .tishi {
    margin-top: 20px;
  }
}
@media screen and (min-width: 1800px) {
  .logoTitle {
    margin-top: 30%;
  }
  .tishi {
    margin-top: 20%;
  }
}
.ms-content {
  padding: 20px;
}

.submit-btn {
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0;
  font-size: 20px;
  color: #fff;
  background: rgba(8, 153, 213, 1);
}
// .copyright {
//   position: absolute;
//   bottom: 10px;
//   width: 100%;
//   text-align: center;
//   font-size: 17px;
//   text-decoration: underline;
//   color: rgba(153, 153, 153, 1);
// }
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #e57470;
}
.slide-verify {
  background: white;
}
.backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.3);
}
.frameBox {
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
}
.frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
  z-index: 5;
}
.icon_view {
  position: absolute;
  right: 1px;
  top: 8px;
  z-index: 1;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
}
.message_code {
  width: 350px;
  height: 200px;
  background: white;
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
}
.code_inp {
  width: 70%;
}
.code_btn {
  margin-left: 3%;
}

.tips {
  margin-top: 15px;
}
.iconColor {
  color: #999;
}

/* .el-input-group__prepend {
  background-color: #ffffff;
  color: #909399;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: 1px solid #dcdfe6;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 0 20px;
  width: 1px;
  white-space: nowrap;
} */
</style>
