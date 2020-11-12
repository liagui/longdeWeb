<template>
  <div class="role-add">
    <header class="role-head">
      <div class="title">添加角色</div>
      <el-form
        ref="roleForm"
        class="role-form"
        :model="roleForm"
        label-position="left"
        label-width="70px"
      >
        <div class="left">
          <el-form-item label="角色名称：" prop="name">
            <el-input
              v-model="roleForm.name"
              placeholder="内容文字不超过10"
              maxlength="10"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="权限描述：" prop="desc">
            <el-input
              v-model="roleForm.desc"
              type="textarea"
              resize="none"
              size="medium"
              :autosize="{ minRows: 4, maxRows: 10 }"
              placeholder="内容文字不超过20"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </header>
    <main class="role-main">
      <hb-tree
        :props="props"
        ref="tree"
        :data="authList"
        show-checkbox
        @check-change="checkSerch"
        @check="check"
        node-key="id"
        class="tree"
        :expand-on-click-node="false"
        :default-expand-all="true"
        :default-checked-keys="CheckedKeys"
      >
        <span class="custom-tree-node" ref="treeChild" slot-scope="{ data }">
          <span>{{ data.title }}</span>
        </span>
      </hb-tree>
      <div class="submit">
        <el-button @click="cancelFun" class="clear-btn">取消</el-button>
        <el-button @click="marksureFun" class="sub-btn">保存</el-button>
      </div>
    </main>
  </div>
</template>

<script>
import _request from '@/utils/request'
import { tree } from '@/utils/tree'
import hbTree from '@/components/globalComponents/tree/tree'
export default {
  data() {
    return {
      props: {
        children: 'child_arr',
      },
      CheckedKeys: [],
      cacheKeys: [],
      roleForm: {
        name: '',
        role: '',
        desc: '',
      },
      roleList: '',
      authList: [],
    }
  },
  components: {
    HbTree: hbTree,
  },
  mounted() {
    _request.http(this, 'role/getRoleAuthInsert').then((res) => {
      // this.roleList = res.data.role_auth
      this.authList = JSON.parse(JSON.stringify(tree(res.data.auth)))
      // this.CheckedKeys = res.data.role_auth[0].auth_id.split(',')
      this.CheckedKeys = []
      this.cacheKeys = this.CheckedKeys.slice(0)
      for (let i = this.CheckedKeys.length - 1; i >= 0; i--) {
        this.deepSearch(this.CheckedKeys, this.authList, this.CheckedKeys[i])
      }
      this.CheckedKeys = this.CheckedKeys.map(Number)
      // this.roleForm.role = this.roleList[0].id
    })
  },
  methods: {
    changeRadio(val) {
      this.CheckedKeys = val.auth_id.split(',')
      this.cacheKeys = this.CheckedKeys.slice(0)
      for (let i = this.CheckedKeys.length - 1; i >= 0; i--) {
        this.deepSearch(this.CheckedKeys, this.authList, this.CheckedKeys[i])
      }
      this.$refs.tree.setCheckedKeys(this.CheckedKeys.map(Number))
    },
    checkSerch(data, checked, val) {},
    check(val, check) {
      console.log('选中的值', val, check)
      this.cacheKeys = check.halfCheckedKeys
      this.CheckedKeys = check.checkedKeys
    },
    cancelFun() {
      // this.$router.go(0);
      // this.$emit('clearfun')
      this.$router.go(-1);
    },
    marksureFun() {
      let query = {
        role_name: this.roleForm.name,
        auth_desc: this.roleForm.desc,
        auth_id: [
          ...new Set(this.CheckedKeys.concat(this.cacheKeys.map(Number))),
        ].toString(),
      }
      _request.http(this, 'role/doRoleAuthInsert', query).then((res) => {
        if (res.code == 200) {
          // this.$emit('marksure')
          this.$router.go(-1);
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    deepSearch(arr, trees, id) {
      let isGet = false
      let retNode = trees
      for (var i = 0; i < trees.length; i++) {
        if (trees[i].id == id || isGet) {
          isGet || (retNode = trees[i])
          isGet = true
          if (
            typeof trees[i].parent_id === 'number' &&
            !isNaN(trees[i].parent_id) &&
            trees[i].parent_id !== 0
          ) {
            if (this.CheckedKeys.includes(trees[i].parent_id.toString())) {
              this.CheckedKeys.splice(
                this.CheckedKeys.findIndex(
                  (item) => item == trees[i].parent_id
                ),
                1
              )
            }
          }
          if (typeof trees[i].parent_id === 'string') {
            let parentArr = trees[i].parent_id.split(',')
            for (let s = parentArr.length; s >= 0; s--) {
              if (this.CheckedKeys.includes(parentArr[s])) {
                this.CheckedKeys.splice(
                  this.CheckedKeys.findIndex((item) => item == parentArr[s]),
                  1
                )
              }
            }
          }
          break
        }
        if (trees[i].child_arr && trees[i].child_arr.length > 0) {
          this.deepSearch(this.CheckedKeys, trees[i].child_arr, id)
        }
      }
    },
  },
}
</script>
<style lang="less">
.role-add {
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
<style lang="less" scoped>
.role-add {
  padding: 0 15px;
}
.role-head {
  margin-bottom: 25px;
  .title {
    margin: 15px 0;
    font-size: 20px;
    font-weight: bold;
    color: #333333;
  }
  .role-form {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .left {
      width: 40%;
      align-items: center;
      .radio {
        flex-wrap: wrap;
      }
    }
    .right {
      width: 50%;
    }
  }
  .role-desc {
    font-size: 12px;
    font-weight: normal;
    div {
      color: #333333;
    }
    .info {
      color: #999999;
      margin-left: 20px;
    }
  }
}
.role-main {
  .tree {
    padding: 15px 0;
    border-top: solid 1px #e3e3e3;
    border-bottom: solid 1px #e3e3e3;
  }
  .submit {
    padding: 35px 0 40px;
    text-align: center;
  }
}
/deep/ .el-radio__label {
  padding-left: 2px;
  margin-right: 10px;
}
/deep/ .el-tree-node__content > label.el-checkbox {
  padding-left: 8px;
  padding-right: 2px;
}
/deep/ .custom-tree-node {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
