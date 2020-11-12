<template>
  <div class="cashAudit">
    <!-- 批量报名 -->
    <el-dialog title="批量报名" :close-on-click-modal="false" width="80%" :visible.sync="dialogFormVisible" @close="closeDialog">
      <div class="set-dialog">
        <el-form
          :model="otherParam"
          label-width="100px"
          ref="otherParam"
          :rules="addRule"
          :inline="false"
        >
          <!-- <div class="form-desc">报名课程信息</div> -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属网校：" prop="school_id">
                <el-select
                  v-model="otherParam.school_id"
                  class="width-100" @change="selSchool"
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
                <span class="color-red">注意：务必填选正确，所属网校务必核实后添加</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="学科分类：" prop="course_type">
                <el-cascader
                  style="width:100%"
                  v-model="otherParam.course_type"
                  collapse-tags
                  :options="subjectArr"
                  @change="selSubject"
                  :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选择课程：" prop="course_id">
                <el-select
                  v-model="otherParam.course_id"
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
              <el-form-item label="课程原价：" prop="sale_price">
                <el-input disabled v-model="otherParam.sale_price" placeholder="请输入课程原价"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="学员价格：" prop="student_price">
                <el-input v-model="otherParam.student_price" min="0" placeholder="请输入学员价格"></el-input>
              </el-form-item>
            </el-col>-->
          </el-row>
          <div class="form-item">
            <label>导入规则：</label>
            <ol>
              <li>导入的文件必须是excel文件。</li>
              <li>请下载示例模板在模板内填充数据，填充数据时，请严格按照模板内规则进行填充！</li>
              <li>为了避免出现重复导入单个文件的情况，导入文件与历史文件不允许重复。</li>
            </ol>
          </div>
          <div class="form-item">
            <label>导入模板说明：</label>
            <ol>
              <li>标红为必填项</li>
              <li>证件类型： 身份证/护照/港澳通行证/台胞证/军官证/士官证/其他</li>
              <li>学历：小学/初中/高中/大专/大本/研究生/博士生/博士后及以上</li>
              <li>支付类型： 定金/部分尾款/最后一笔款/全款</li>
              <li>支付方式：微信/支付宝/银行转账</li>
            </ol>
          </div>
          <div class="form-item">
            <label></label>
            <div>
              <a href="../../../static/excel/批量报名模板.xlsx">导入模板下载</a>
            </div>
          </div>
          <div class="form-item">
            <label>导入文件：</label>
            <Upload
              ref="upload"
              :url="fileUploadPath"
              :otherParam="otherParam"
              @close="closeDialog"
            />
          </div>
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
import Upload from "@/components/common/upload";
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
  components: { Upload },
  props: ["studentSignData", "showMore"],
  data() {
    return {
      otherParam: {
        school_id: null, //分校id
        course_type: [], //课程大小分类(如:[1,2])
        course_id: null, //课程id
        sale_price: null, //优惠价格
        nature: null //课程属性(1代表授权,0代表自增)
      },
      fileUploadPath: this.GLOBAL.ajaxurl + "student/importUser",
      addRule: {
        payment_type: [
          { required: true, message: "请选择付款类型", trigger: "change" }
        ],
        payment_method: [
          { required: true, message: "请选择付款方式", trigger: "change" }
        ],
        student_price: [{ validator: numAndDecimals2, trigger: "blur" }],
        payment_fee: [
          { required: true, message: "请输入付款金额", trigger: "blur" },
          { validator: numAndDecimals2, trigger: "blur" }
        ],
        payment_time: [
          { required: true, message: "请选择付款时间", trigger: "change" }
        ],
        school_id: [
          { required: true, message: "请选择所属网校", trigger: "change" }
        ],
        course_type: [
          { required: true, message: "请选择所属学科", trigger: "change" }
        ]
      },
      schoolArr: [],
      subjectArr: [],
      papers_typeArr: [],
      payment_typeArr: [],
      payment_methodArr: [],
      dialogFormVisible: this.showMore,
      lessionArr: []
    };
  },
  mounted() {
    this.CommonList();
    this.getSubjectList();
  },
  methods: {
    getSubjectList() {
      _request.http(this, "schoolLists").then(res => {
        this.schoolArr = res.data; //分类
      });
      // _request.http(this, "subject").then(res => {
      //   this.subjectArr = res.data;
      // });
    },
    selSchool(val){
      if(val){
        _request.http(this, "subject",{school_id:val}).then(res => {
          this.subjectArr = res.data;
        });
      }     
      
      this.otherParam.course_type = '';
      this.otherParam.course_id = '';
      
    },
    // 根据学科ID获取课程
    selSubject(val) {
      _request.http(this, "courseType", { parent_id: val,school_id:this.otherParam.school_id }).then(res => {
        if (res.code == 200) {
          this.lessionArr = res.data;
        }
      });       
      this.otherParam.course_id = "";
    },
    selLession(item) {
      var nature = "";
      for (var i = 0; i < this.lessionArr.length; i++) {
        if (item == this.lessionArr[i]["id"]) {
          nature = this.lessionArr[i]["nature"];
        }
      }
      _request
        .http(this, "course/courseFirst", {
          id: this.otherParam.course_id,
          nature: nature
        })
        .then(res => {
          if (res.code == 200) {
            this.otherParam.sale_price = res.data.sale_price;
            this.otherParam.nature = res.data.nature;
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
      this.$refs.otherParam.validate(valide => {
        if (valide) {
          this.$refs.upload.submitForm();
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.color-red {
  color: red;
}
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