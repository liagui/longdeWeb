<template>
  <div class="scholl-auth">
    <!-- <header class="content-head">
      <ul class="admin-info">
        <li class="schoo-name">
          <div class="title">网校名称</div>
          <div class="name">{{ adminInfo.school_name }}</div>
        </li>
        <li class="username">
          <div class="title">用户名</div>
          <div class="name">{{ adminInfo.username }}</div>
        </li>
        <li class="realname">
          <div class="title">联系人</div>
          <div class="name">{{ authForm.realname }}</div>
        </li>
        <li class="mobile">
          <div class="title">联系方式</div>
          <div class="name">{{ authForm.mobile }}</div>
        </li>
      </ul>
      <div @click="dialogVisible = true" class="edit-btn">编辑</div>
    </header> -->
    <main class="content-main">
      <!-- <div class="title">
        <span class="name">权限列表</span>
        <span class="info">勾选默认网校管理员权限</span>
      </div> -->
      <div class="auth-info">
        <hb-tree
          :props="props"
          ref="tree"
          :data="authList"
          show-checkbox
          @check-change="checkSerch"
          @check="check"
          node-key="id"
          class="tree-width"
          :expand-on-click-node="false"
          :default-expand-all="true"
        >
          <span class="custom-tree-node" ref="treeChild" slot-scope="{ data }">
            <span>{{ data.title }}</span>
          </span>
        </hb-tree>
        <div class="submit">
          <el-button @click="cancelFun" class="clear-btn">取消</el-button>
          <el-button @click="marksureFun" class="sub-btn">确定</el-button>
        </div>
      </div>
    </main>
    <el-dialog
      class="auth-dialog"
      title="账号信息修改"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="520px"
      :append-to-body="true"
      @close="closeDialog"
    >
      <el-form ref="authForm" :model="authForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名：" prop="name">
          <!-- <el-input v-model="authForm.name" clearable></el-input> -->
          <div>{{ adminInfo.username }}</div>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <!-- <el-input v-model="addData.password" placeholder="请输入密码" autocomplete="new-password" :clearable='false' show-password></el-input> -->
          <el-input v-model="authForm.password" :clearable="false" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="pwd">
          <el-input v-model="authForm.pwd" :clearable="false" show-password></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="mobile">
          <el-input v-model="authForm.mobile" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="realname">
          <el-input v-model="authForm.realname" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="authFormEdit('authForm')">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _request from "@/utils/request";
import { tree } from "@/utils/tree";
import hbTree from "@/components/globalComponents/tree/tree";
import { checkCharacters, checkChinese } from "@/utils/rules";
export default {
  data() {
    const pwdAgainCheck = async (rule, value, callback) => {
      if (this.authForm.password != this.authForm.pwd) {
        return callback(new Error("两次输入密码不一致！"));
      } else {
        callback();
      }
    };
    return {
      props: {
        children: "child_arr"
      },
      rules: {
        password: [{ validator: checkChinese, trigger: "blur" }],
        pwd: [{ validator: pwdAgainCheck, trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "目前只支持中国大陆的手机号码"
          }
        ],
        realname: [{ required: true, message: "请输入联系人", trigger: "blur" }]
      },
      CheckedKeys: [17],
      cacheKeys: [],
      adminInfo: "",
      authList: [],
      dialogVisible: false,
      authForm: {
        user_id: "",
        name: "",
        password: "",
        pwd: "",
        mobile: "",
        realname: ""
      },
      systemList: [],
      defaultCheck: []
    };
  },

  components: {
    HbTree: hbTree
  },
  mounted() {
    _request
      .http(this, "school/getSchoolAdminById", {
        id: this.$route.query.schoolAuthId
      })
      .then(res => {
        this.systemList = res.data.auth_rules;
        this.adminInfo = res.data.admin;
        this.authList = JSON.parse(JSON.stringify(tree(res.data.auth_rules)));
        var getAdminData = res.data.admin;
        this.authForm = {
          user_id: getAdminData.id,
          name: getAdminData.realname,
          mobile: getAdminData.mobile,
          realname: getAdminData.realname
        };
        let map_auth_id = res.data.admin.map_auth_id;
        if (map_auth_id) {
          let checkId = map_auth_id.split(",").map(Number);
          this.CheckedKeys = map_auth_id !== null ? checkId : [];
          this.defaultCheck = [];
          this.formatCheck(this.systemList, checkId);
          this.$refs.tree.setCheckedKeys(this.defaultCheck);
        }
      });
  },
  methods: {
    formatCheck(list, checkArr) {
      for (var item of list) {
        if (!item.child_arr) {
          if (checkArr.indexOf(item.id) > -1) {
            this.defaultCheck.push(item.id);
          }
        } else {
          this.formatCheck(item.child_arr, checkArr);
        }
      }
    },
    closeDialog() {
      this.dialogVisible = false;
      this.$refs.authForm.clearValidate();
    },
    authFormEdit(authForm) {
      this.$refs[authForm].validate(valid => {
        if (valid) {
          _request
            .http(this, "school/doAdminUpdate", this.authForm)
            .then(res => {
              if (res.code == 200) {
                this.$message({
                  showClose: true,
                  message: "保存成功",
                  type: "success"
                });
                this.dialogVisible = false;
                // window.location.reload();
              } else {
                this.$message({
                  showClose: true,
                  message: "保存失败，请重试",
                  type: "error"
                });
              }
              console.log(res);
            });
        }
        // else {
        //   this.$message({
        //     showClose: true,
        //     message: "请完善提示信息",
        //     type: "error"
        //   });
        //   console.log("error submit!!");
        //   return false;
        // }
      });
    },
    checkSerch(data, checked, val) {},
    check(val, check) {
      this.cacheKeys = check.halfCheckedKeys;
      this.CheckedKeys = check.checkedKeys;
    },
    cancelFun() {
      this.$router.go(-1);
    },
    marksureFun() {
      let query = {
        id: this.$route.query.schoolAuthId,
        role_id: this.adminInfo.role_id,
        user_id: this.adminInfo.id,
        auth_id: [
          ...new Set(this.CheckedKeys.concat(this.cacheKeys.map(Number)))
        ].toString()
      };
      // debugger;
      _request.http(this, "school/doSchoolAdminById", query).then(res => {
        this.$toast(res.msg);
        this.$router.go(-1);
      });
    },
    deepSearch(arr, trees, id) {
      let isGet = false;
      let retNode = trees;
      for (var i = 0; i < trees.length; i++) {
        if (trees[i].id == id || isGet) {
          isGet || (retNode = trees[i]);
          isGet = true;
          if (
            typeof trees[i].parent_id === "number" &&
            !isNaN(trees[i].parent_id) &&
            trees[i].parent_id !== 0
          ) {
            console.log("trees[i].parent_id", trees[i].parent_id);
            if (this.CheckedKeys.includes(trees[i].parent_id.toString())) {
              this.CheckedKeys.splice(
                this.CheckedKeys.findIndex(item => item == trees[i].parent_id),
                1
              );
            }
          }
          if (typeof trees[i].parent_id === "string") {
            // console.log('trees[i].parent_id', trees[i].parent_id)
            let parentArr = trees[i].parent_id.split(",").map(Number);
            // console.log('parentArr[s]', parentArr)
            // for (let s = parentArr.length; s >= 0; s--) {
            for (let s = 0; s < parentArr.length; s++) {
              if (this.CheckedKeys.includes(parentArr[s])) {
                this.CheckedKeys.splice(
                  this.CheckedKeys.findIndex(item => item == parentArr[s]),
                  1
                );
              }
            }
          }
          break;
        }
        if (trees[i].child_arr && trees[i].child_arr.length > 0) {
          this.deepSearch(this.CheckedKeys, trees[i].child_arr, id);
        }
      }
    }
  }
};
</script>
<style lang="less">
.auth-dialog {
  .el-dialog__footer {
    text-align: center;
  }
}
.scholl-auth {
  label {
    margin-bottom: 0;
  }
  .el-tree-node__expand-icon {
    display: none;
  }
  .el-tree-node {
    display: flex;
  }
  .el-tree-node__content {
    min-width: 200px;
    text-align: right;
    padding-left: 0 !important;
  }
  .el-tree-node.is-expanded > .el-tree-node__children {
    .el-tree-node__children {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
<style scoped lang="less">
.admin-info {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-bottom: 0;
  padding: 15px 0;
  width: 100%;
  .title {
    margin-bottom: 14px;
    font-size: 14px;
    font-weight: 500;
    color: #999999;
  }
  .name {
    font-size: 20px;
    font-weight: bold;
    color: #333333;
  }
}
.edit-btn {
  width: 50px;
  cursor: pointer;
}
.content-main {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  margin: 0 25px 20px;
  .title {
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid #e3e3e3;
    .name {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
    }
    .info {
      font-size: 14px;
      color: #999999;
    }
  }
  .tree-width {
    padding: 30px;
    border-bottom: 1px solid #e3e3e3;
  }
  .submit {
    padding: 35px 0 40px;
    text-align: center;
  }
}
</style>
