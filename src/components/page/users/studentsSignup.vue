<template>
  <div class="cashAudit">
    <!-- 添加学员 -->
    <el-dialog title="手动报名" :close-on-click-modal="false" width="80%" :visible.sync="dialogFormVisible" @close="closeDialog">
      <div class="set-dialog">
        <el-form
          :model="addData"
          label-width="100px"
          ref="addData"
          :rules="addRule"
          :inline="false"
        >
          <div class="form-desc">学员基本信息</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名：" prop="real_name">
                <el-input v-model="addData.real_name" disabled placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号：" prop="phone">
                <el-input v-model="addData.phone" disabled placeholder="请输入手机号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="证件类型：" prop="papers_type">
                <el-select v-model="addData.papers_type" disabled class="width-100">
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
                <el-input v-model="addData.papers_num" disabled placeholder="请输入证件名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="form-desc">报名课程信息</div>
          <!-- <el-row>
            <el-col :span="12">
              <el-form-item label="所属网校：" prop="school_id">
                <el-select disabled
                  v-model="addData.school_id"
                  class="width-100" 
                  placeholder="选择所属网校"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in schoolArr"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="学科分类：" prop="parent_id">
                <el-cascader
                  style="width:100%"
                  v-model="addData.parent_id"
                  collapse-tags
                  :options="subjectArr"
                  @change="selSubject"
                  :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选择课程：" prop="lession_id">
                <el-select
                  v-model="addData.lession_id"
                  value-key="item.id"
                  @change="selLession"
                  class="width-100"
                >
                  <el-option
                    v-for="(item, index) in lessionArr"
                    :key="index"
                    :label="item.title"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="课程原价：" prop="lession_price">
                <el-input disabled v-model="addData.lession_price" placeholder="请输入课程原价"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学员价格：" prop="student_price">
                <el-input v-model="addData.student_price" min="0" placeholder="请输入学员价格"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="form-desc">财务信息</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款类型：" prop="payment_type">
                <el-select v-model="addData.payment_type" class="width-100" placeholder="请选择付款类型：">
                  <el-option
                    v-for="(item, index) in payment_typeArr"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款方式：" prop="payment_method">
                <el-select
                  v-model="addData.payment_method"
                  class="width-100"
                  placeholder="请选择付款方式："
                >
                  <el-option
                    v-for="(item, index) in payment_methodArr"
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
              <el-form-item label="付款金额：" prop="payment_fee">
                <el-input
                  v-model="addData.payment_fee"
                  min="0"                  
                  placeholder="请输入付款金额"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款时间：" prop="payment_time">
                <el-date-picker
                  style="width:100%;"
                  v-model="addData.payment_time"
                  type="datetime"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="dialogMarksure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import { formatDate, numAndDecimals2 } from "@/utils/rules";
import {
  checkCharacters,
  checkPhoneCou,
  emailRule,
  qqemailRule
} from "@/utils/rules";
export default {
  props: ["studentSignData", "studentSignup"],
  data() {
    return {
      addRule: {
        payment_type: [
          { required: true, message: "请选择付款类型", trigger: "change" }
        ],
        payment_method: [
          { required: true, message: "请选择付款方式", trigger: "change" }
        ],
        student_price: [
          { validator: numAndDecimals2, trigger: "blur" }
        ],
        payment_fee: [
          { required: true, message: "请输入付款金额", trigger: "blur" },
          { validator: numAndDecimals2, trigger: "blur" }
        ],
        payment_time: [
          { required: true, message: "请选择付款时间", trigger: "change" }
        ],
        parent_id: [
          { required: true, message: "请选择所属学科", trigger: "change" }
        ]
      },
      schoolArr: [],
      subjectArr: [],
      papers_typeArr: [],
      payment_typeArr: [],
      payment_methodArr: [],
      dialogFormVisible: this.studentSignup,
      addData: {
        real_name: "",
        phone: "",
        papers_type: "",
        papers_num: "",
        school_id:'',
        student_id: "",
        lession_id: "",
        lession_name: "",
        lession_price: "",
        student_price: "",
        payment_type: "",
        payment_method: "",
        payment_fee: "",
        payment_time: "",
        nature: ""
      },
      lessionArr: []
    };
  },
  created(){
    // 获取基本信息
    this.getSubjectList();
  },
  mounted() {
    this.CommonList();
    // this.dialogFormVisible = this.studentSignup;   
    var getMess = JSON.parse(this.studentSignData);
    this.addData.phone = getMess.phone;
    this.addData.real_name = getMess.real_name;
    this.addData.papers_type = getMess.papers_type;
    this.addData.papers_num = getMess.papers_num;
    this.addData.student_id = getMess.student_id;
    this.addData.school_id = getMess.school_id;
    this.selSchool();
  },
  methods: {
    getSubjectList() {
      _request.http(this, "schoolLists").then(res => {
        this.schoolArr = res.data; //分类
      });
      
    },
    selSchool(){     
      _request.http(this, "subject",{school_id:this.addData.school_id}).then(res => {
        this.subjectArr = res.data;
      });      
    },
    // 根据学科ID获取课程
    selSubject(val) {
      _request.http(this, "courseType", { parent_id: val,school_id:this.addData.school_id }).then(res => {
        if (res.code == 200) {
          this.lessionArr = res.data;
        }
      });
           
      this.addData.lession_id = "";
    },
    selLession(item) {
      console.log(item);
      var nature = '';
      for(var i=0;i<this.lessionArr.length;i++){
        if(item == this.lessionArr[i]['id']){
          nature = this.lessionArr[i]['nature'];
        }
      }
      _request
        .http(this, "course/courseFirst", { id: this.addData.lession_id,nature:nature})
        .then(res => {
          if (res.code == 200) {
            this.addData.lession_price = res.data.pricing;
            this.addData.nature = res.data.nature;
          }
        });
    },
    CommonList() {
      _request.http(this, "student/getStudentCommonList").then(res => {
        if (res.code == 200) {
          this.papers_typeArr = res.data.papers_type_list;
          this.payment_typeArr = res.data.payment_type;
          this.payment_methodArr = res.data.payment_method;
        }
      });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },

    dialogMarksure() {
      this.$refs.addData.validate(valide => {
        if (valide) {
          _request
            .http(this, "student/doStudentEnrolment", this.addData)
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
.form-desc {
  border-left: 3px solid rgba(38, 164, 253, 1);
  margin-bottom: 15px;
  padding-left: 10px;
  font-size: 16px;
  height: 16px;
  line-height: 16px;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.el-dialog__footer {
  text-align: center;
}
</style>