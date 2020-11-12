<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn">
      <img src="../../../static/image/logo.png" class="logoimg" alt />
    </div>

    <div class="header-right">
      <div class="list">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="taps"
          :class="{ selectId: MENU_SELECT_ID == item.id }"
          @click="setSideBar(item, index)"
        >
          <span>{{ item.title }}</span>
        </div>
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <span @click="changePass('form')">
              <el-dropdown-item>修改密码</el-dropdown-item>
            </span>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 个人信息弹出框 -->
    <el-dialog title="个人信息" :close-on-click-modal="false" :visible.sync="editVisible" width="520px" :append-to-body="true">
      <el-form ref="ruleForm" :model="ruleForm" label-width="60px">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="ruleForm.name" :disabled="true" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="ruleForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机：" prop="phone">
          <el-input v-model="ruleForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="ruleForm.remark" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码弹出框 -->
    <el-dialog title="修改密码" :close-on-click-modal="false" :visible.sync="passVisible" width="435px" :append-to-body="true">
      <el-form ref="form" :rules="rules" :model="form" label-width="90px" style="width: 90%">
        <el-form-item label="旧密码：" prop="oldpassword">
          <el-input
            v-model="form.oldpassword"
            :type="isFidePossworda ? 'text' : 'password'"
            placeholder="请输入旧密码"
            oninput="if(value.length>5)value=value.slice(0,20)"
            class="passInput"
          >
            <i
              slot="suffix"
              :class="isFidePossworda ? '' : 'light'"
              class="pin el-icon-view"
              @click="isFidePossworda = !isFidePossworda"
            ></i>
          </el-input>
          <p class="el-form-item__error" v-if="oldpassShow">旧密码输入有误，请重新输入</p>
        </el-form-item>
        <el-form-item label="新密码：" prop="newpassword">
          <el-input
            v-model="form.newpassword"
            :type="isFidePosswordb ? 'text' : 'password'"
            placeholder="请输入新密码"
            oninput="if(value.length>5)value=value.slice(0,20)"
            class="passInput"
          >
            <i
              slot="suffix"
              :class="isFidePosswordb ? '' : 'light'"
              class="pin el-icon-view"
              @click="isFidePosswordb = !isFidePosswordb"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item label="重复密码：" prop="repassword">
          <el-input
            v-model="form.repassword"
            :type="isFidePosswordc ? 'text' : 'password'"
            placeholder="请再次填写密码"
            oninput="if(value.length>5)value=value.slice(0,20)"
            class="passInput"
          >
            <i
              slot="suffix"
              :class="isFidePosswordc ? '' : 'light'"
              class="pin el-icon-view"
              @click="isFidePosswordc = !isFidePosswordc"
            ></i>
          </el-input>
          <transition name="el-zoom-in-top">
            <p class="el-form-item__error" v-if="repassShow">两次密码输入不一致，请重新输入</p>
          </transition>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button @click="passVisible = false">取 消</el-button>
          <el-button type="primary" @click="savePass">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import bus from "../common/bus";
import { getLoc, serialize } from "@/utils";
import _request from "@/utils/request";
import { mapGetters, mapState } from "vuex";
import {
  checkChinese,
  checkSpecial,
  checkPhone,
  checkNumberAndChinese,
  checkCharacters,
  checkUsername,
  benAndNumber,
  checkUrl,
  bigLetter,
  littleLetter,
  onlyNumber
} from "../../utils/rules";
export default {
  data() {
    const pwdAgainCheck = async (rule, value, callback) => {
      if (this.form.newpassword != this.form.repassword) {
        return callback(new Error("两次输入密码不一致！"));
      } else {
        callback();
      }
    };
    return {
      code: this.$store.state.objCode,
      oldpassShow: false,
      repassShow: false,
      handlyItem: {},
      isFidePossworda: false,
      isFidePosswordb: false,
      isFidePosswordc: false,
      collapse: false,
      fullscreen: false,
      name: "未登录",
      message: 2,
      editVisible: false,
      ruleForm: {
        name: "",
        email: "",
        phone: "",
        remark: ""
      },
      form: {
        oldpassword: "",
        newpassword: "",
        repassword: ""
      },
      rules: {
        oldpassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          { validator: checkChinese, trigger: "blur" }
        ],
        newpassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: checkChinese, trigger: "blur" }
        ],
        repassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: checkChinese, trigger: "blur" },
          { validator: pwdAgainCheck, trigger: "blur" }
        ]
      },
      passVisible: false,
      items: []
    };
  },
  computed: {
    ...mapGetters(["getSetbarList"]),
    ...mapState({
      userInfo: state => JSON.parse(state.userInfo),
      menuList: state => state.menuList,
      MENU_SELECT_ID: state => state.menu.MENU_SELECT_ID
    }),
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    }
  },
  created() {
    this.items = this.copyArr(this.menuList);
    this.reloadTap(this.$route);

    // sessionStorage.setItem("showBank",1);
  },
  methods: {
    copyArr(list) {
      return JSON.parse(JSON.stringify(list));
    },

    setSideBar(item) {
      this.handlyItem = serialize(item);
      this.$store.commit("getTapList", item);
      this.$store.commit("MENU_SELECT_ID", item.id);
      this.$bus.$emit("showBank", 1);
      localStorage.setItem("showBank", 1);
      this.$router.push(this.handlyItem.subs[0]["index"]);
    },
    savePass() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.newpassword !== this.form.repassword) {
            this.repassShow = true;
          } else {
            this.repassShow = false;
            _request
              .http(this, "adminuser/doAdminUserUpdatePwd", this.form)
              .then(res => {
                if (res.code == 200) {
                  this.$mymsg(
                    `密码已修改，请重新登录`,
                    {
                      maskCloseDialog: false,
                      isShowSureButton: false,
                      isShowCancelIcon: false
                    },
                    () => {
                      this.$router.push("/login");
                    }
                  );
                }
              });
          }
        } else {
          this.repassShow = false;
        }
      });
    },
    changePass(formName) {
      this.passVisible = true;
      this.form = {
        oldpassword: "",
        newpassword: "",
        repassword: ""
      };
      this.isFidePossworda = false;
      this.isFidePosswordb = false;
      this.isFidePosswordc = false;
      setTimeout(() => {
        this.$refs[formName].resetFields();
      }, 0);
    },
    iformation() {
      // this.editVisible = true
      // this.$axios
      //   .get(
      //     this.GLOBAL.ajaxurl + 'admin/profile?token=' + this.$store.state.token
      //   )
      //   .then((res) => {
      //     this.ruleForm.name = res.data.data.realname
      //     this.ruleForm.email = res.data.data.email
      //     this.ruleForm.phone = res.data.data.mobile
      //     this.ruleForm.remark = res.data.data.remark
      //   })
    },
    saveEdit() {
      // this.$axios
      //   .post(this.GLOBAL.ajaxurl + 'admin/profile', {
      //     token: this.$store.state.token,
      //     email: this.ruleForm.email,
      //     mobile: this.ruleForm.phone,
      //     remark: this.ruleForm.remark,
      //   })
      //   .then((res) => {
      //     if (res.data.code == 200) {
      //       this.editVisible = false
      //       this.$message.success(res.data.msg)
      //     }
      //   })
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        localStorage.removeItem("productName");
        this.$router.push("/login");
        this.$store.commit("Token", "");
      }
    },
    reloadTap(newValue) {
      this.items.forEach(item => {
        item.subs.forEach(val => {
          if (val.index == newValue.path) {
            this.$store.commit("getTapList", item);
          }
        });
      });
    }
  },
  watch: {
    // $route(newValue, oldValue) {
    //   if (newValue) {
    //     this.items.forEach(item => {
    //       item.subs.forEach(val => {
    //         if (newValue.path.indexOf(val.index) == 0) {
    //           this.selectId = item.id;
    //           this.$store.commit("getTapList", item);
    //         }
    //       });
    //     });
    //   }
    // },
    "form.newpassword"() {
      this.repassShow = false;
    },
    "form.repassword"() {
      this.repassShow = false;
    }
  }
};
</script>
<style scoped>
.light {
  color: darkgray;
}
.pin {
  cursor: pointer;
}
.header {
  display: flex;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 18px;
  color: #2c3743;
  cursor: pointer;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 0px 15px #ddd;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
.logoimg {
  width: 188px;
  height: 44px;
}
.collapse-btn {
  /* position: absolute;
  left: 35px;
  top: 14px; */
  margin: 0 30px;
}
.logo {
  width: calc(140px - 10px);
  text-align: center;
  font-size: 16px;
  color: #b5b5b5;
  font-weight: bold;
  min-width: 130px;
}
.header-right {
  flex: 1;
  /* position: absolute; */
  /* right: 0; */
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  /* margin-top: 24px;
  margin-left: 20px;
  margin-right: 20px;
  min-width: 50px; */
  margin-top: 24px;
  margin-left: 20px;
  min-width: 50px;
  position: absolute;
  right: 20px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-menu__item {
  text-align: center;
}
.list {
  height: 100%;
  display: flex;
}
.taps {
  font-size: 16px;
  padding: 0px 30px;
  transition: 0.3s;
  height: 70px;
  display: flex;
  align-items: center;
  color: #333;
  box-sizing: border-box;
  justify-content: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  /* font-weight: bold; */
}
@media screen and (max-width: 1250px) {
  .taps {
    padding: 0 20px;
  }
}
.taps i {
  padding: 0 10px 0 0;
}
.taps:hover {
  color: #26a4fd;
}
.taps.selectId {
  color: #fff;
  background: #26a4fd;
}

.errorMsg {
  display: inline-block;
  margin-left: 10px;
  color: red;
}
/* .el-popper {
  margin-top: -15px;
} */
</style>
