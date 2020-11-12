<template>
  <div style="background: '#fff'">
    <div class="accounadd clearfix">
      <!-- <p class="head-style" v-text="updateDataId?'题库修改':'题库添加'"></p> -->
      <div>
        <el-form :model="addData" :rules="rule" label-width="90px" ref="addData">
          <el-form-item label="题库名称：" prop="topic_name">
            <el-input v-model="addData.topic_name" placeholder="请输入题库名称" clearable></el-input>
          </el-form-item>

          <el-form-item label="包含科目：" prop="subject_list" ref="subject_list">
            <el-row v-for="(item,index) in subject_list" class="subject_kemu" :key="index">
              <el-input
                placeholder="请输入科目名称"
                class="width-300"
                :disabled="item.disabled"
                v-model="item.subject_name"
              ></el-input>
              <el-button @click="subjectSave(index)" v-show="!item.disabled" type="primary">保存</el-button>
              <el-button @click="subjectClear(index)" v-show="!item.disabled">取消</el-button>
            </el-row>
            <el-button type="primary" @click="addSubject" plain>+ 添加科目</el-button>
          </el-form-item>

          <el-form-item label="绑定学科：" ref="lession_subject" prop="parent_id">
            <el-cascader
              style="width:510px"
              v-model="lession_subject"
              :options="subjectArr"
              @change="selLession"
              :props="{ checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="题库描述: " prop="describe">
            <el-input
              type="textarea"
              :rows="5"
              v-model="addData.describe"
              placeholder="请输入题库描述"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="foot-btn dialog-footer">
            <el-button @click="cancelFun" class="clear-btn">取消</el-button>
            <el-button @click="marksureFun" class="sub-btn">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
import bus from "@/components/common/bus";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  props: ["updateDataId"],
  data() {
    return {
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: "",
      subjectTypeArr: [],
      subjectArr: [],
      addData: {
        topic_name: "",
        parent_id: Number,
        child_id: Number,
        describe: ""
      },
      subject_list: [],
      lession_subject: [],
      questionArr: [],
      jiangshi: [],
      showDialog: false,
      rule: {
        // topic_name: [
        //   { required: true, message: "请输入题库标题", trigger: "blur" },
        //   // { validator: checkCharacters, trigger: "blur" }
        // ],
        // parent_id: [
        //   { required: true, message: "请输入题库标题", trigger: "blur" },
        //   { required: true, message: "请选择学科", trigger: "blur" }
        // ],
        // describe: [
        //   { required: true, message: "请输入题库描述", trigger: "blur" }
        // ],
        // subject_list: [
        //   { required: true, message: "请添加包含科目", trigger: "blur" }
        // ],
        // parent_id: [
        //   { required: true, message: "请选择绑定学科", trigger: "blur" }
        // ]
      },
      searchData: {}
    };
  },
  watch: {
    updateDataId(val, old) {
      if (!val) {
        this.clearForm();
      } else {
        this.getBankUpdate(this.updateDataId);
      }
    }
  },
  created() {
    this.getSubjectList(); //学科列表
    if (this.updateDataId) {
      //修改
      this.getBankUpdate(this.updateDataId);
    }
  },
  methods: {
    clearForm() {
      this.addData = {
        topic_name: "",
        parent_id: null,
        child_id: null,
        describe: ""
      };
      this.subject_list = [];
      this.lession_subject = [];
    },
    getSubjectList() {
      _request.http(this, "subject").then(res => {
        this.subjectArr = res.data;
      });
    },
    // 修改时获取之前的数据
    getBankUpdate(id) {
      _request
        .http(this, "question/getBankInfoById", { bank_id: id })
        .then(res => {
          console.log(res);
          var data = res.data;
          this.subject_list = data.subject_list;
          this.lession_subject = data.lession_subject;
          this.addData = data;
          this.addData.bank_id = id;
        });
    },
    addSubject() {
      this.subject_list.push({ subject_name: "", disabled: false });
      this.$refs.subject_list.clearValidate();
    },
    // 保存之后不允许修改
    subjectSave(index) {
      if (this.subject_list[index].subject_name == "") {
        this.subject_list.splice(index, 1);
        return;
      }
      this.subject_list[index]["disabled"] = true;
      this.$refs.subject_list.clearValidate();
    },
    // 绑定学科后清除验证
    selLession() {
      this.$refs.lession_subject.clearValidate();
    },

    subjectClear(index) {
      this.subject_list.splice(index, 1);
    },
    cancelFun() {
      this.$emit("closeFun", false);
    },
    // 提交表单
    marksureFun() {
      console.log(this.addData);
      // addData: {
      //   topic_name: "",
      //   parent_id: Number,
      //   child_id: Number,
      //   describe: ""
      // },

      this.addData.parent_id = this.lession_subject[0];
      this.addData.child_id = this.lession_subject[1];
      this.addData.subject_list = JSON.stringify(this.subject_list);
      if (!this.addData.topic_name) {
        alert("请输入题库名称");
        return;
      }

      if (!this.subject_list.length) {
        alert("请输入包含科目");
        return;
      }

      var subjectList = this.subject_list;
      for (let i = 0; i < subjectList.length; i++) {
        if (!subjectList[i].subject_name) {
          alert("请输入科目名称");
          return;
        }
      }
      if (!this.addData.parent_id) {
        alert("请选择所属学科");
        return;
      }
      if (!this.addData.describe) {
        alert("请输入题库描述");
        return;
      }
      if (this.updateDataId) {
        // 更新
        _request.http(this, "question/doUpdateBank", this.addData).then(res => {
          if (res.code == 200) {
            this.$toast("修改题库成功。");
            this.$emit("closeAndUpdateFun", false);
          } else {
            alert(res.msg);
          }
        });
      } else {
        // 添加
        _request.http(this, "question/doInsertBank", this.addData).then(res => {
          if (res.code == 200) {
            this.$toast("添加题库成功。");
            this.$emit("closeAndUpdateFun", false);
          } else {
            alert(res.msg);
          }
        });
      }
    },
    selTeacher() {
      this.showDialog = true;
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  }
};
</script>
<style scoped lang="less">
.accounadd {
  background-color: #fff;
  height: 100%;
  .head-style {
    margin: 30px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    color: #333333;
  }
  .form-box {
    // position: relative;
    // left: 50%;
    // transform: translate(-50%, 0);
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
.width-300 {
  width: 360px;
}
.subject_kemu {
  height: 40px;
}
</style>
