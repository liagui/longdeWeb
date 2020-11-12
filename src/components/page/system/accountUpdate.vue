<template>
  <div class="container-box" style="background: '#fff'">
    <div class="accounadd cleafix">
      <p class="head-style">{{ accountTitle }}</p>
      <div class="form-box">
        <!-- 修改 -->
        <el-form
          :model="addData"
          :rules="ruleUpdate"
          label-width="90px"
          ref="addData"
        >
          <el-form-item label="所属网校：">
            <el-input
              v-model="schoolData.name"
              :value="addData.school_id"
              disabled
              style="width: 600px"
            ></el-input>
          </el-form-item>
          <el-form-item label="登录账号：" prop="username">
            <el-input
              v-model="addData.username"
              placeholder="请输入登录账号"
              clearable
              style="width: 600px"
            ></el-input>
          </el-form-item>
          <el-form-item label="关联老师：" prop="teacher_id">
            <el-tag
              v-if="addData.teacher_id"
              v-model="addData.teacher_id"
              :disable-transitions="false"
              closable
              @close="handleClose"
              >{{ real_name }}</el-tag
            >

            <el-button
              type="primary"
              class="button-new-tag"
              plain
              size="small"
              @click="selTeacher"
              >选择老师</el-button
            >
          </el-form-item>
          <el-form-item label="姓     名：" prop="realname">
            <el-input
              v-model="addData.realname"
              placeholder="请输入姓名"
              clearable
              style="width: 600px"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input
              v-model="addData.mobile"
              placeholder="请输入手机号"
              clearable
              style="width: 600px"
            ></el-input>
          </el-form-item>
          <el-form-item label="性 别：" prop="sex">
            <el-radio v-model="addData.sex" label="0">男</el-radio>
            <el-radio v-model="addData.sex" label="1">女</el-radio>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input
              v-model="addData.password"
              placeholder="请输入密码"
              autocomplete="new-password"
              :clearable="false"
              show-password
              style="width: 600px"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="pwd">
            <el-input
              v-model="addData.pwd"
              placeholder="请输入确认密码"
              autocomplete="new-password"
              :clearable="false"
              show-password
              style="width: 600px"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择角色：" prop="role_id">
            <template>
              <el-radio-group
                v-model="addData.role_id"
                v-for="item in roleArr"
                :key="item.id"
              >
                <el-radio :label="item.id">{{ item.role_name }}</el-radio>
              </el-radio-group>
            </template>
            <el-button
              type="primary"
              class="button-new-tag"
              size="small"
              plain
              @click="addRole"
              >+ 添加角色</el-button
            >
          </el-form-item>
          <el-form-item label="选择网校：" v-if="citiType">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <div style="margin: 15px 0"></div>
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(city, index) in cities"
                :label="city.id"
                :key="index"
                >{{ city.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="foot-btn">
            <el-button @click="cancelFun" class="clear-btn">取消</el-button>
            <el-button @click="marksureFun1" class="sub-btn">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 关联老师模态框 -->
      <el-dialog
        title="关联老师"
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        width="80%"
        min-width="800px"
        @close="showDialog = false"
        center
      >
        <div>
          <el-form :model="formBox" ref="formBox" :inline="true">
            <el-form-item>
              <el-select
                v-model="searchData.parent_id"
                placeholder="所属学科"
                clearable
              >
                <el-option
                  v-for="(item, index) in schoolBranch"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="name">
              <el-input
                v-model="searchData.real_name"
                placeholder="讲师名称"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
            </el-form-item>
          </el-form>
          <div class="listType">讲师：</div>
          <div>
            <div
              class="listItem"
              v-for="(item, index) in jiangshi"
              :key="index"
              @click="clickTeacher(item)"
              :class="{ itemActive: clickIndex == item.teacher_id }"
            >
              {{ item.real_name }}
            </div>
            <div class="addTeacher" @click="xinzenglaoshi">+ 新增老师</div>
          </div>
          <div class="listType">教务：</div>
          <div>
            <div
              class="listItem"
              v-for="(item, index) in jiaowu"
              :key="index"
              @click="clickTeacher(item)"
              :class="{ itemActive: clickIndex == item.teacher_id }"
            >
              {{ item.real_name }}
            </div>
            <div class="addTeacher" @click="xinzengjiaowu">+ 新增教务</div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clearFun">取 消</el-button>
          <el-button type="primary" @click="dialogMarksure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
import bus from "@/components/common/bus";
import { checkEnACharac4, checkChinese, checkPhone } from "@/utils/rules";
export default {
  data() {
    const pwdAgainCheck = async (rule, value, callback) => {
      if (this.addData.password != this.addData.pwd) {
        return callback(new Error("两次输入密码不一致！"));
      } else {
        callback();
      }
    };
    return {
      transId: false,
      accountTitle: "账户添加",
      schoolData: { name: "" },
      roleArr: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      schoolBranch: [],
      real_name: "", // 选择老师存放名字
      addData: {
        school_id: "",
        username: "",
        teacher_id: "", // 选择老师存放对应id
        realname: "",
        mobile: "",
        sex: "0",
        password: "",
        pwd: "",
        role_id: "",
        name: "",
        is_manage_all_school: 0,
        manage_school_list: "",
      },
      formBox: {
        status: "",
      },
      jiangshi: [],
      jiaowu: [],
      clickIndex: Number,
      showDialog: false,
      ruleUpdate: {
        mobile: [
          { required: true, message: "请输入手机号" },
          { validator: checkPhone, trigger: "blur" },
        ],
        sex: [{ required: true, message: "请输入手机号" }],
        realname: [
          { required: true, message: "请输入姓名" },
          { validator: checkEnACharac4, trigger: "blur" },
        ],
        username: [
          { required: true, message: "请输入登录账号" },
          { validator: checkEnACharac4, trigger: "blur" },
        ],
        password: [{ validator: checkChinese, trigger: "blur" }],
        pwd: [{ validator: pwdAgainCheck, trigger: "blur" }],
        role_id: [{ required: true, message: "请选择角色", trigger: "change" }],
      },
      rule: {
        mobile: [
          { required: true, message: "请输入手机号" },
          { validator: checkPhone, trigger: "blur" },
        ],
        sex: [{ required: true, message: "请输入手机号" }],
        realname: [
          { required: true, message: "请输入姓名" },
          { validator: checkEnACharac4, trigger: "blur" },
        ],
        username: [
          { required: true, message: "请输入登录账号" },
          { validator: checkEnACharac4, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: checkChinese, trigger: "blur" },
        ],
        pwd: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: pwdAgainCheck, trigger: "blur" },
        ],
        role_id: [{ required: true, message: "请选择角色", trigger: "change" }],
      },
      searchData: {
        real_name: "",
        parent_id: "",
      },
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true,
      citschool: [],
      citschoolid: "",
      citiType: false,
      schoolId: "",
      citiesId: [],
    };
  },
  created() {
    this.initData();
    this.transId = true;
    this.getUserDetail();
    this.accountTitle = "账户修改";
    // if (this.$route.query.transId) {
    // this.transId = true;
    // this.getUserDetail();
    // this.accountTitle = "账户修改";
    // } else {
    //   this.transId = false;
    //   this.accountTitle = "账户添加";
    //   this.$refs["addData"].resetFields();
    // }
  },
  methods: {
    xinzenglaoshi() {
      let isZongKong = this.$store.state.school_status == 1; //总控1 中控0
      let hrefStr = isZongKong ? "/#/resourceGeneral/generalLecturers": "/#/users/lecturers";
      let href = window.location.origin + hrefStr;
      window.open(href, "_blank");
    },
    xinzengjiaowu() {
      let isZongKong = this.$store.state.school_status == 1; //总控1 中控0
      let hrefStr = isZongKong ? "/#/resourceGeneral/generalEducation": "/#/users/educatAdmin";
      let href = window.location.origin + hrefStr;
      window.open(href, "_blank");
    },
    // 获取用户详情
    getUserDetail() {
      _request
        .http(this, "adminuser/getAdminUserUpdate", {
          id: this.$route.query.transId,
        })
        .then((res) => {
          // this.roleArr = res.data.role_auth;
          // this.schoolData.name = res.data.admin_user.school_name;
          // this.addData.school_id = res.data.admin_user.school_id;
          this.addData.username = res.data.admin_user.username;
          this.addData.realname = res.data.admin_user.realname;
          this.addData.mobile = res.data.admin_user.mobile;
          this.addData.role_id = res.data.admin_user.role_id;
          this.addData.sex = String(res.data.admin_user.sex);
          this.addData.id = res.data.admin_user.id;
          this.addData.teacher_id = res.data.admin_user.teacher_id;
          this.clickIndex = res.data.admin_user.teacher_id;
          if (
            res.data.admin_user.manage_school_list.length == false &&
            res.data.admin_user.is_manage_all_school == 1
          ) {
            this.checkAll = true;
            this.handleCheckAllChange(true);
          } else {
            this.checkAll = false;
            this.checkedCities = res.data.admin_user.manage_school_list;
          }
          if (res.data.admin_user.teacher_name != "") {
            this.real_name = res.data.admin_user.teacher_name.real_name;
          } else {
            this.real_name = "";
          }
        });
    },
    dialogMarksure() {
      this.showDialog = false;
    },
    clearFun() {
      this.showDialog = false;
    },
    initData() {
      _request.http(this, "adminuser/getInsertAdminUser").then((res) => {
        this.roleArr = res.data.role_auth;
        this.addData.school_id = res.data.school.id;
        this.schoolData.name = res.data.school.name;
        if (Boolean(res.data.school_list.length) == true) {
          this.citiType = true;
          this.cities = res.data.school_list;
          this.handleCheckAllChange(true);
        } else {
          this.citiType = false;
        }
      });
    },
    search() {
      _request
        .http(this, "teacher/getTeacherSearchList", this.searchData)
        .then((res) => {
          this.jiangshi = res.data.jiangshi;
          this.jiaowu = res.data.jiaowu;
        });
    },

    // 选择老师
    clickTeacher(item) {
      this.real_name = item.real_name;
      this.addData.teacher_id = item.teacher_id;
      this.clickIndex = item.teacher_id;
      this.dynamicTags = [
        { school_id: item.teacher_id, real_name: item.real_name },
      ];

      console.log(item.teacher_id);
    },
    // 添加角色
    addRole() {
      bus.$emit("changListStatus", false);
      this.$router.push("/system/roleManage");
    },
    cancelFun() {
      // this.$emit("closeFun", false);
      this.$router.go(-1);
    },
    marksureFun1() {
      //修改
      this.$refs.addData.validate((valid) => {
        if (valid) {
          console.log(this.addData);
          _request
            .http(this, "adminuser/doAdminUserUpdate", this.addData)
            .then((res) => {
              // console.log(res);
              // return false;
              if (res.code == 200) {
                this.$message({
                  message: "更改成功",
                  type: "success",
                });
                // this.$emit("markSure");
                this.$router.go(-1);
              } else {
                this.$message.error(res.msg);
              }
            });
        }
      });
    },

    selTeacher() {
      _request.http(this, "teacher/getTeacherSearchList").then((res) => {
        this.jiangshi = res.data.jiangshi;
        this.jiaowu = res.data.jiaowu;
      });
      _request.http(this, "subject").then((res) => {
        this.schoolBranch = res.data.page_data;
      });
      this.showDialog = true;
    },
    handleClose(tag) {
      this.real_name = "";
      this.addData.teacher_id = "";
      this.clickIndex = -1;

      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    getTeacherList() {
      _request.http(this, "payChannel/findConditionPayChannels").then((res) => {
        var getData = res.data.payChannels;
        for (var i = 0; i < getData.length; i++) {
          this.schoolBranch.push(getData[i]);
        }
      });
      this.schoolBranch.unshift({
        payChannelId: "",
        payChannelName: "全部",
      });
    },
    handleCheckAllChange(val) {
      console.log(val);
      for (let i = 0; i < this.cities.length; i++) {
        this.citiesId.push(this.cities[i].id);
      }
      this.checkedCities = val ? this.citiesId : [];
      this.isIndeterminate = false;

      if (val) {
        for (let i = 0; i < this.cities.length; i++) {
          if (this.citschoolid.indexOf(this.cities[i].id) == -1) {
            this.citschoolid += this.cities[i].id + ",";
          }
        }
        let schoolid = this.citschoolid.slice(
          this.citschoolid.indexOf(this.citschoolid.charAt(0)),
          this.citschoolid.lastIndexOf(",")
        );
        this.schoolId = schoolid;
        console.log(this.schoolId);
        this.addData.is_manage_all_school = 1;
        this.addData.manage_school_list = this.schoolId;
      } else {
        this.addData.is_manage_all_school = 0;
        this.addData.manage_school_list = "";
      }
    },
    handleCheckedCitiesChange(value) {
      console.log(this.cities);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
      console.log(value);
      this.citschoolid = "";
      for (let i = 0; i < value.length; i++) {
        if (this.citschoolid.indexOf(value[i]) == -1) {
          this.citschoolid += value[i] + ",";
        }
      }
      console.log(this.citschoolid);
      let citschool = this.citschoolid.slice(
        this.citschoolid.indexOf(this.citschoolid.charAt(0)),
        this.citschoolid.lastIndexOf(",")
      );
      this.schoolId = citschool;
      console.log(this.schoolId);
      if (value == this.cities) {
        this.addData.manage_school_list = this.schoolId;
        this.addData.is_manage_all_school = 1;
      } else {
        this.addData.manage_school_list = this.schoolId;
        this.addData.is_manage_all_school = 0;
      }
    },
  },
};
</script>
<style scoped lang="less">
.accounadd {
  background-color: #fff;
  height: 100%;
  padding-top: 20px;
  .head-style {
    margin: 0 40px 15px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    color: #333333;
  }
  .form-box {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .foot-btn {
    margin-top: 20px;
    text-align: right;
  }
}

.listType {
  margin-bottom: 16px;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
}
.listItem {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 26px;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(227, 227, 227, 1);
  border-radius: 3px;
  margin: 0 20px 20px 0;
  cursor: pointer;
}
.itemActive {
  background: rgba(38, 164, 253, 1);
  border-radius: 3px;
  color: #fff;
  border: 1px solid rgba(38, 164, 253, 1);
}
.addTeacher {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 13px;
  border: 1px solid rgba(38, 164, 253, 1);
  color: rgba(38, 164, 253, 1);
  font-size: 14px;
  border-radius: 3px;
  margin: 0 20px 20px 0;
  cursor: pointer;
}
/deep/ .el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
/deep/ .el-radio__label {
  padding-left: 2px;
  margin-right: 10px;
}
</style>
