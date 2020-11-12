<template>
  <div class="container-box" style="background: '#fff'">
    <div class="accounadd clearfix box-margin" id="adminPaper1">
      <p class="head-style">章节添加</p>
      <div class="form-box">
        <el-select v-model="subject_id" placeholder="科目选择">
          <el-option
            :label="item.subject_name"
            :value="item.subject_id"
            v-for="(item, index) in subjectList"
            :key="index"
          ></el-option>
        </el-select>
        <el-button type="primary" plain @click="addPaper">+ 新增章节</el-button>
        <el-tree
          :data="dataList"
          node-key="id"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
          :expand-on-click-node="true"
          class="el-tree-wrap"
          :highlight-current="true"
          draggable
          :allow-drop="allowDrop"
          @node-drop="sort"
        >
          <!-- :default-expanded-keys="expandedList" -->
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <el-input
              v-model="data.name"
              placeholder="请输入内容"
              :readOnly="data.readOnly"
              @blur="inputBlur(node, data)"
              :class="{
                'bg-one': data.readOnly && node.level == 1,
                'bg-two': data.readOnly && node.level == 2,
                'bg-three': data.readOnly && node.level == 3,
              }"
            ></el-input>
            <span class="custom-tree-handle">
              <i
                class="el-icon-plus tree-not-test"
                @click.stop="() => append(node, data)"
                v-if="node.level < 3"
              ></i>
              <i
                class="el-icon-delete tree-not-test"
                @click.stop="() => remove(node, data)"
              ></i>
              <i
                class="el-icon-edit tree-not-test"
                @click.stop="() => edit(node, data)"
              ></i>
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
      id: 10000,
      isEdit: false,
      level: 0, //类型(0代表章,1代表节,2代表考点)
      parent_id: null, //章id或节id(添加节则属于章id,添加考点则属于节id)
      curretObj: {}, //当前新增与编辑的对象
      subject_id: null, //科目
      subjectList: [], // 科目列表
      routerQuery: this.$route.query,
      expandedList: [], //展开list
      dataList: [],
      adminPaper1: null,
    };
  },
  mounted() {
    this.$store.dispatch("disAuthority");
    this.adminPaper1 = document.getElementById("adminPaper1");
    this.adminPaper1.onmousedown = (e) => {
      let classList = ["el-input__inner", "tree-not-test"];
      if (classList.indexOf(e.target.className) == -1) {
        if (this.curretObj.name) {
          if (!this.subject_id) {
            this.$message.error("请选择科目");
            return;
          }
          let param = {};
          let url = "question/doUpdateChapters";
          if (this.isEdit) {
            param = {
              chapters_id: this.curretObj.id,
              name: this.curretObj.name,
            };
          } else {
            url = "question/doInsertChapters";
            param = {
              type: this.level,
              bank_id: this.bank_id,
              subject_id: this.subject_id,
              parent_id: this.parent_id,
              name: this.curretObj.name,
            };
          }
          _request.http(this, url, param).then((res) => {
            if (res.code == 200) {
              this.getChaptersList();
            }
          });
        }
      }
    };
    this.getSubjectList();
    // this.getChaptersList();
  },
  destroyed() {
    this.adminPaper1.onmouseup = null;
  },
  watch: {
    subject_id(val) {
      this.getChaptersList();
    },
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
      // dataList 即为拖拽之后的最新数据
      let nodeArr = dropNode.parent.childNodes;
      let parmArr = [];
      for (var i = 0; i < nodeArr.length; i++) {
        parmArr.push(nodeArr[i]["key"]);
      }
      _request
        .http(this, "question/doUpdateListSort", {
          chapters_id: parmArr,
        })
        .then((res) => {
          if (res.code == 200) {
            this.getChaptersList();
          }
        });
    },
    inputBlur(node, data) {
      // this.parent_id = data.id;
      // this.level = node.level;
      // debugger;
      if (!data.name) {
        this.remove(node, data);
      }
    },
    //科目列表
    getSubjectList() {
      this.curretObj = {};
      _request
        .http(this, "question/getSubjectList", {
          bank_id: this.bank_id,
        })
        .then((res) => {
          let data = res.data.map((item) => {
            item.readonly = true;
            return item;
          });
          this.subjectList = data;
          this.subject_id = data[0].subject_id;
        });
    },
    //章节列表
    getChaptersList() {
      if (!this.subject_id) return;
      let param = {
        bank_id: this.bank_id,
        subject_id: this.subject_id,
      };
      _request.http(this, "question/getChaptersList", param).then((res) => {
        if (res.code == 200) {
          this.dataList = res.data;
          this.testTreeData(res.data);
          this.curretObj = {};
        }
      });
    },
    //增加章节
    addPaper() {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      if (typeof this.curretObj.name === "string") {
        return;
      }
      this.isEdit = false;
      this.parent_id = null;
      this.level = 0;
      let obj = {
        id: null,
        name: "",
        readOnly: false,
        children: [],
      };
      this.dataList.push(obj);
      this.curretObj = this.dataList[this.dataList.length - 1];
    },
    //增加章节
    append(node, data) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      if (typeof this.curretObj.name === "string") {
        return;
      }
      this.isEdit = false;
      this.id++;
      this.parent_id = data.id;
      this.level = node.level;
      let obj = {
        id: this.id,
        name: "",
        readOnly: false,
        children: [],
      };

      if (!data.children) {
        this.$set(dataList, "children", []);
      }
      debugger;
      data.children.push(obj);
      this.curretObj = data.children[data.children.length - 1];
      this.expandedList.push(this.curretObj.id);
    },
    edit(node, data, e) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      this.isEdit = true;
      this.curretObj = data;
      this.level = node.level;
      data.readOnly = false;
    },
    remove(node, data) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      if (!data.id || !data.name) {
        this.curretObj = {};
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex((d) => d.id === data.id);
        children.splice(index, 1);
        return;
      }

      this.$confirm("删除该章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request
            .http(this, "question/doDeleteChapters", { chapters_id: data.id })
            .then((res) => {
              if (res.code == 200) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex((d) => d.id === data.id);
                children.splice(index, 1);
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning",
                });
              }
            });
        })
        .catch((data) => {});
    },
    delEmpty(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      data.readOnly = true;
      if (!data.name) {
        const index = children.findIndex((d) => d.id === data.id);
        children.splice(index, 1);
      }
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
    nodeExpand(data) {
      //展开
      this.expandedList.push(data.id);
      this.expandedList = [...new Set(this.expandedList)];
    },
    nodeCollapse(data) {
      const index = this.expandedList.indexOf(data.id);
      this.expandedList.splice(index, 1);
    },
  },
};
</script>
<style scoped lang="less">
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
/deep/ .bg-two .el-input__inner {
  background-color: #f9f9f9;
}
/deep/ .bg-three .el-input__inner {
  background-color: #f9f9f9;
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
