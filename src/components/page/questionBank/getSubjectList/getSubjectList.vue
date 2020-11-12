<template>
  <div class="container-box" style="background: '#fff'">
    <div class="accounadd clearfix box-margin">
      <p class="head-style">科目设置</p>
      <div class="form-box">
        <el-button type="primary" @click="addSubject" plain
          >+ 添加科目</el-button
        >
        <el-tree
          :data="dataList"
          node-key="subject_id"
          :default-expanded-keys="expandedList"
          :props="defaultProps"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
          :expand-on-click-node="true"
          class="el-tree-wrap"
          :highlight-current="true"
          draggable
          :allow-drop="allowDrop"
          @node-drop="sort"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <el-input
              @blur="save(node, data)"
              placeholder="请输入科目名称"
              v-model="data.subject_name"
              :readonly="data.readonly"
              :class="{ 'bg-one': data.readonly }"
            ></el-input>
            <span class="custom-tree-handle">
              <!-- <div class="subject-item-handle"> -->
              <i
                class="el-icon-delete"
                @click.stop="() => remove(node, data)"
              ></i>
              <i class="el-icon-edit" @click.stop="() => edit(node, data)"></i>
              <!-- </div> -->
            </span>
          </div>
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import _request from "@/utils/request";
import bus from "@/components/common/bus";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  computed: {
    ...mapState({
      authority: (state) => state.question.authority,
      bank_id: (state) => state.question.bank_id,
    }),
  },
  data() {
    return {
      isEdit: false,
      routerQuery: this.$route.query,
      dataList: [], //科目列表
      expandedList: [],
      defaultProps: {
        label: "subject_name",
      },
    };
  },
  created() {
    this.$store.dispatch("disAuthority");
    this.getSubjectList();
  },
  methods: {
    // 拖拽判断
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.parent.id === dropNode.parent.id) {
          // 向上拖拽 || 向下拖拽
          return type === "prev" || type === "next";
        }
      } else {
        // 不同级进行处理
        return false;
      }
    },
    // 拖拽完成之后的回调
    sort(draggingNode, dropNode, type, event) {
      let nodeArr = dropNode.parent.childNodes;
      let parmArr = [];
      for (var i = 0; i < nodeArr.length; i++) {
        parmArr.push(nodeArr[i]["key"]);
      }
      _request
        .http(this, "question/doUpdateSubjectListSort", {
          id: parmArr,
        })
        .then((res) => {
          if (res.code == 200) {
            this.getSubjectList();
          }
        });
    },
    nodeExpand(data) {
      //展开
      this.expandedList.push(data.id);
      this.expandedList = [...new Set(this.expandedList)];
    },
    nodeCollapse(data) {
      const index = this.expandedList.indexOf(data.id);
      this.expandedList.splice(index, 1);
    },
    addSubject() {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      // debugger;
      let len = this.dataList.length;
      if (!this.dataList[len - 1]["subject_name"]) return;
      this.isEdit = false;
      this.dataList.push({ text: "", readonly: false });
    },
    // 保存之后不允许修改
    save(node, data) {
      // if (!data.subject_name) {
      //   this.remove(node, data);
      // }
      console.log(data);
      let currentObj = data;
      let url = "";
      let param = {
        subject_name: currentObj.subject_name,
      };
      if (!currentObj.subject_name) {
        this.dataList.splice(1);
        return;
      }
      if (this.isEdit) {
        url = "question/doUpdateSubject";
        param.subject_id = currentObj.subject_id;
      } else {
        url = "question/doInsertSubject";
        param.bank_id = this.bank_id;
      }
      if (currentObj.readonly == false) {
        _request.http(this, url, param).then((res) => {
          if (res.code == 200) {
            //   currentObj.readonly = true;
            //   currentObj.subject_id = res.data.subject_id; //已知问题
            //   this.$set(this.dataList, index, currentObj);
            // } else {
            //   this.$message.error(res.msg);
            this.getSubjectList();
          }
        });
      }
    },
    remove(node, data) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      let currentObj = {};
      // if (!currentObj.subject_name) {
      //   this.dataList.splice(index, 1);
      //   return;
      // }
      this.$confirm("删除该科目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request
            .http(this, "question/doDeleteSubject", {
              subject_id: data.subject_id,
            })
            .then((res) => {
              if (res.code == 200) {
                this.getSubjectList();
              }
            });
        })
        .catch((data) => {});
    },
    edit(node, data) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      this.isEdit = true;
      this.currentObj = data;
      data.readonly = false;
      // this.$set(this.dataList, index, currentObj);
    },
    getSubjectList() {
      _request
        .http(this, "question/getSubjectList", {
          bank_id: this.bank_id,
        })
        .then((res) => {
          let data = res.data.map((item) => {
            item.readonly = true;
            return item;
          });
          this.dataList = data;
        });
    },
    testTreeData(list) {
      this.isEdit = false;
      for (var element of list) {
        if (!element.name) {
          const index = list.findIndex((d) => d.id === element.id);
          list.splice(index, 1);
          return;
        }
        if (!element.readOnly) {
          this.$set(element, "readOnly", true);
        }
        if (element.children && element.children.length > 0) {
          this.testTreeData(element.children);
        }
      }
    },
  },
};
</script>
<style scoped lang="less">
// .accounadd {
//   background-color: #fff;
//   height: 100%;
//   .head-style {
//     margin: 30px;
//     font-size: 20px;
//     font-family: Source Han Sans CN;
//     color: #333333;
//   }
//   .form-box {
//     width: 470px;
//     position: relative;
//     left: 50%;
//     transform: translate(-50%, 0);
//   }
//   .foot-btn {
//     margin-top: 20px;
//     text-align: right;
//   }
// }
// .subject-item {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 4px 10px;
//   margin: 10px 0;
//   border: 1px solid #e3e3e3;
//   background: #f9f9f9;
// }
// .subject-item > span {
//   color: #343434;
//   font-weight: bold;
//   font-family: Source Han Sans CN;
// }
// .subject-item i {
//   cursor: pointer;
//   color: #9a9a9a;
// }
.accounadd {
  padding-bottom: 40px;
  background-color: #fff;
  height: 100%;
  overflow: auto;
  .head-style {
    margin: 30px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    color: #333333;
  }
  .form-box {
    width: 470px;
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
}
.itemActive {
  background: rgba(38, 164, 253, 1);
  border-radius: 3px;
  color: #fff;
  border: 0;
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

.el-tree-wrap {
  margin: 10px 0;
}
.custom-tree-node {
  position: relative;
  display: inline-block;
  width: 100%;
}
.custom-tree-handle {
  position: absolute;
  right: 10px;
  top: 4px;
}
.custom-tree-box {
  padding: 0 2px 0 5px;
  box-sizing: border-box;
  height: 30px;
  line-height: 30px;
  background-color: #efefef;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #e3e3e3;
  box-sizing: border-box;
  color: #333333;
  display: inline-block;
  outline: 0;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
/deep/ .bg-one .el-input__inner {
  background-color: #efefef;
}
/deep/ .el-input__inner {
  cursor: pointer;
  color: #333;
  font-weight: 900;
  padding: 0 2px 0 30px !important;
}
/deep/ .el-tree-node__children {
  .el-input__inner {
    color: #666;
    font-weight: 300;
  }
  .el-icon-caret-right {
    left: 20px;
  }
}

/deep/ .el-tree-node__content {
  position: relative;
  height: 36px;
  cursor: pointer;
}
/deep/ .el-icon-caret-right {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
  font-size: 20px;
}
</style>
