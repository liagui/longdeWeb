<template>
  <div class="accounadd">
    <div class="form-box">
      <el-form :model="addData" :rules="rule" label-width="90px" ref="addData">
        <el-row>
          <el-col :span="24">
            <el-form-item :span="24" label="所属网校：" prop="title">
              <div class="schoolName">{{school_name}}</div>
            </el-form-item>     
          </el-col>
          <el-col :span="24">  
            <el-col :span = 12>    
              <el-form-item label="手机号：" prop="phone">
                <el-input
                  v-model="addData.phone"                  
                  placeholder="请输入手机号"
                ></el-input>
              </el-form-item>            
              </el-col>
            </el-col>
          <el-col :span="12"> 
            <el-col> 
              <el-form-item label="教务姓名：" prop="real_name">
                <el-input v-model="addData.real_name" placeholder="请输入教务姓名 " clearable></el-input>
              </el-form-item>
              </el-col>
            </el-col>
          <el-col :span="12"> 
            <el-form-item label="性别：" prop="sex">
              <el-radio v-model="addData.sex" :label="1">男</el-radio>
              <el-radio v-model="addData.sex" :label="2">女</el-radio>
            </el-form-item>
            </el-col>
          <el-col :span="24"> 
            <el-col :span="12">
              <el-form-item label="QQ：" prop="qq">
                <el-input v-model="addData.qq" placeholder="请输入QQ号 " clearable></el-input>
              </el-form-item>
            </el-col>            
            <el-col :span="12">
            <el-form-item label="微信：" prop="wechat">
              <el-input v-model="addData.wechat" placeholder="请输入微信号 " clearable></el-input>
            </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24"> 
            <el-form-item label="教务描述：" prop="describe">
              <el-input
                v-model="addData.describe"
                type="textarea"
                :rows="5"
                placeholder="请输入教务描述"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      <el-row style="text-align:center;">
        <el-button @click="cancelFun" class="clear-btn">取消</el-button>
        <el-button @click="marksureFun" class="sub-btn">确定</el-button>
      </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
import { testPostImage, postImg } from "@/utils/index.js";
import quillEditorCom from "./../ueditorCom/comEditor";
import {
  checkEnACharac4,
  checkPhone,
  rightNumber,
  numAndDecimals2
} from "@/utils/rules";

export default {
  props: ["transId",'is_auth'],
  data() {
    return {
      searchData: {
        real_name: "",
        parent_id: []
      },
      school_name:'',
      schoolBranch: [],
      showDialog: false,
      clickIndex: Number,
      fileUploadPath: this.GLOBAL.postImgUrl,
      setHead: this.GLOBAL.setHead(),
      editor: null, // 富文本编辑器对象
      editorOption: {
        //  富文本编辑器配置
        modules: {
          toolbar: {
            container: "#toolbar"
          }
        },
        theme: "snow",
        placeholder: "请输入正文"
      },
      addData: {
        type: 1,
        phone: "",
        head_icon: "",
        real_name: "",
        sex: 1,
        describe: "",
        qq: "",
        wechat: "",
        parent_id: [],
        title: "",
        teacher_id:'',
        content:''
      },
      subjectsel_arr: [],
      dynamicTags: [],
      selTeachers: [],

      formBox: {
        status: ""
      },
      rule: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        real_name: [
          { required: true, message: "请输入教务姓名", trigger: "blur" },
          { validator: checkEnACharac4, trigger: "blur" }
        ],
        parent_id: [{ required: true, message: "请关联学科", trigger: "blur" }]
      },
      searchData: {}
    };
  },
  mounted() {
    if (this.transId) {
      // 修改
      this.getDetail();
     
    } else {
      this.transId = "";
      this.addData.teacher_id = '';
      this.$refs.addData && this.$refs.addData.resetFields();
    }
    this.school_name = localStorage.getItem('school_name');
  },
  components: {
    // quillEditor
    "quill-editors": quillEditorCom
  },
  methods: {
    getContent(val) {
      this.addData.content = val;
    },  
    
    cancelFun() {
      this.$emit("closeFun", 1);
    },
    marksureFun() {
      // this.addData.subject_id = JSON.stringify(this.addData.subject_id);
      this.$refs.addData.validate(valid => {
        if (valid) {
          if (this.transId) {
            // 修改
            if(this.is_auth){
              this.$message.error('授权教务不可修改');
              return;
            }
            _request
              .http(this, "teacher/doUpdateTeacher", this.addData)
              .then(res => {
                console.log(res);
                if (res.code == 200) {
                  this.$toast(res.msg);
                  this.$emit("successClose", 1);
                } else {
                  this.$toast(res.msg);
                }
              });
          } else {
            this.addData.id = "";
            _request
              .http(this, "teacher/doInsertTeacher", this.addData)
              .then(res => {
                console.log(res);
                if (res.code == 200) {
                  this.$toast(res.msg);
                  this.$emit("successClose", 1);
                } else {
                  this.$toast(res.msg);
                }
              });
          }
        }
      });
    },
    getDetail() {
      _request.http(this, "teacher/getTeacherInfoById", { teacher_id: this.transId }).then(res => {
        if (res.code == 200) {
          this.addData = res.data;       
          this.addData.teacher_id = this.transId;   
        }
      });
    },
    
  }
};
</script>
<style scoped lang="less">
.accounadd {
  height: 100%;

  .head-style {
    margin: 30px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    color: #333333;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
  .form-box {
    position: relative;
    width: 100%;
    padding-right: 20px;
    .schoolName {
      font-size: 16px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
  }
  .foot-btn {
    margin-top: 20px;
    text-align: right;
  }
}
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
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  line-height: 100px;
  display: block;
}

.el-select {
  display: block;
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
.dialog-footer{
  margin-top: 20px;
}

</style>
