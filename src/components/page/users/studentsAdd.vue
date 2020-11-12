<template>
  <div class="cashAudit">
    <!-- 添加学员 -->
    <el-dialog
      :title="isAdd?'学员添加':'学员更新'"
      :close-on-click-modal="false"
      width="80%"
      :visible.sync="dialogFormVisible"
      @close="closeDialog"
      center
    >
      <div class="set-dialog">
        <el-form
          :model="addData"
          label-width="120px"
          ref="addData"
          :rules="addRule"
          :inline="false"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属网校：" prop="school_id">
                <!-- <el-input v-model="addData.schoolName" disabled placeholder="请选择网校"></el-input> -->
                <el-select v-model="addData.school_id" :disabled="!isAdd" class="width-100">
                  <el-option
                    v-for="(item, index) in schoolArr"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名：" prop="real_name">
                <el-input v-model="addData.real_name" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号：" prop="phone">
                <el-input v-model="addData.phone" :disabled="!isAdd" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别：" prop="sex">
                <el-radio v-model="addData.sex" :label="1">男</el-radio>
                <el-radio v-model="addData.sex" :label="2">女</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="证件类型：" prop="papers_type">
                <el-select v-model="addData.papers_type" class="width-100">
                  <el-option
                    v-for="(item, index) in papers_typeArr"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号码：" prop="papers_num">
                <el-input v-model="addData.papers_num" placeholder="请输入证件名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出生日期：" prop="birthday">
                <el-date-picker
                  style="width:100%"
                  v-model="addData.birthday"
                  type="date"
                  default-value="1998-01-01"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="户口所在地：" prop="address_locus">
                <el-input v-model="addData.address_locus" placeholder="请输入户口所在地"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="年龄：" prop="age">
                <el-input
                  v-model="addData.age"
                  min="0"
                  onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                  placeholder="请输入年龄"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最高学历：" prop="educational">
                <el-select v-model="addData.educational" class="width-100">
                  <el-option
                    v-for="(item, index) in educationalArr"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="家庭电话号：" prop="family_phone">
                <el-input v-model="addData.family_phone" placeholder="请输入家庭电话号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="办公电话：" prop="office_phone">
                <el-input v-model="addData.office_phone" placeholder="请输入办公电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="紧急联系人：" prop="contact_people">
                <el-input v-model="addData.contact_people" placeholder="请输入紧急联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="紧急联系人电话：" prop="contact_phone">
                <el-input v-model="addData.contact_phone" placeholder="请输入紧急联系人电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="addData.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="QQ邮箱：" prop="qq">
                <el-input v-model="addData.qq" placeholder="请输入QQ邮箱"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="微信：" prop="wechat">
                <el-input v-model="addData.wechat" placeholder="请输入微信"></el-input>
              </el-form-item>
              <el-form-item label="住址：" prop="address">
                <el-input type="textarea" :row="3" v-model="addData.address" placeholder="请输入地址"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-form-item label="地址：">
                <el-select v-model="addData.address" style="width:32%;">
                  <el-option
                    v-for="(item, index) in address1"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select v-model="addData.address" style="width:32%;">
                  <el-option
                    v-for="(item, index) in address2"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select v-model="addData.address" style="width:32%;">
                  <el-option
                    v-for="(item, index) in address3"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
            </el-form-item>-->

            <el-col :span="12">
              <el-form-item label="备注：" prop="remark">
                <el-input v-model="addData.remark" type="textarea" :rows="5" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="clear-btn" @click="closeDialog">取 消</el-button>
        <el-button class="sub-btn" type="primary" @click="dialogMarksure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
import {
  checkCharacters,
  checkPhoneCou,
  emailRule,
  qqemailRule
} from "@/utils/rules";
export default {
  props: ["studentAdd", "studentMess"],
  data() {
    return {
      addRule: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhoneCou, trigger: "blur" }
        ],
        family_phone: [{ validator: checkPhoneCou, trigger: "blur" }],
        contact_phone: [{ validator: checkPhoneCou, trigger: "blur" }],
        email: [{ validator: emailRule, trigger: "blur" }],
        qq: [{ validator: qqemailRule, trigger: "blur" }],
        real_name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { validator: checkCharacters, trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择", trigger: "blur" }],
        school_id: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      isAdd: true,
      papers_typeArr: [],
      educationalArr: [],
      address1: [],
      address2: [],
      address3: [],
      schoolArr: [],
      dialogFormVisible: false,
      addData: {
        school_id: "",
        phone: "",
        real_name: "",
        sex: 1,
        papers_type: "",
        papers_num: "",
        birthday: "",
        address_locus: "",
        age: "",
        educational: "",
        family_phone: "",
        office_phone: "",
        contact_people: "",
        contact_phone: "",
        email: "",
        qq: "",
        wechat: "",
        address: "",
        remark: ""
      },
      is_nature: false
    };
  },
  mounted() {
    this.CommonList();
    this.dialogFormVisible = this.studentAdd;
    // this.addData.schoolName = localStorage.getItem("school_name");
    if (this.studentMess) {
      // 修改
      this.isAdd = false;
      this.getDetail();
    } else {
      this.addData.student_id = "";
      this.isAdd = true;
    }
    this.getSubjectList();
    this.$refs.addData && this.$refs.addData.resetFields();
  },
  methods: {
    // 地址选择
    // getAdress(region_id){
    //    _request.http(this, "question/getRegionList").then(res => {
    //     if (res.code == 200) {
    //       this.papers_typeArr = res.data.papers_type_list;
    //       this.educationalArr = res.data.educational_list;
    //     }
    //   });
    // },
    getSubjectList() {
      _request.http(this, "schoolLists").then(res => {
        this.schoolArr = res.data; //分类
      });
    },
    // 公共参数
    CommonList() {
      _request.http(this, "student/getStudentCommonList").then(res => {
        if (res.code == 200) {
          this.papers_typeArr = res.data.papers_type_list;
          this.educationalArr = res.data.educational_list;
        }
      });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    getDetail() {
      _request
        .http(this, "student/getStudentInfoById", {
          student_id: this.studentMess
        })
        .then(res => {
          if (res.code == 200) {
            this.dialogFormVisible = true;
            this.addData = res.data;
            this.addData.student_id = this.studentMess;
            this.addData.schoolName = localStorage.getItem("school_name");
          }
        });
    },
    dialogMarksure() {
      this.$refs.addData.validate(valide => {
        if (valide) {
          if (this.studentMess) {
            // 修改
            _request
              .http(this, "student/doUpdateStudent", this.addData)
              .then(res => {
                if (res.code == 200) {
                  this.dialogFormVisible = false;
                  this.$emit("marksureDialog");
                } else {
                  alert(res.msg);
                }
              });
          } else {
            this.addData.student_id = "";
            _request
              .http(this, "student/doInsertStudent", this.addData)
              .then(res => {
                if (res.code == 200) {
                  this.dialogFormVisible = false;
                  this.addData.id = "";
                  this.$emit("marksureDialog");
                } else {
                  alert(res.msg);
                }
              });
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.info {
  color: #888888;
}
.danger {
  color: #ff0000;
}
.primary {
  color: #1cc700;
}
.warning {
  color: #ff8a00;
}
.width-150 {
  width: 150px;
}
.set-dialog {
  margin-right: 20px;
  margin-top: 10px;
}
</style>