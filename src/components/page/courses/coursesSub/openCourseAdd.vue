<template>
  <div class="accounadd clearfix">
    <p class="head-style" v-text="transId?'公开课修改':'公开课添加'"></p>
    <div class="form-box">
      <el-form :model="addData" :rules="rule"  label-width="120px" ref="addData">
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程标题：" prop="title">
              <el-input
                v-model="addData.title"
                type="textarea"
                :rows="4"
                placeholder="请输入课程标题"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程分类：" prop="subject">
              <el-cascader
                style="width:100%"
                v-model="addData.subject"
                collapse-tags
                :options="subjectArr"
                :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="添加日期：" prop="date" style="display:inline-block;">
              <el-date-picker
                v-model="addData.date"
                type="date"
                style="width:40%"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="selDate"
              ></el-date-picker>
              <el-form-item prop="time" style="display:inline-block;">
                <el-time-picker
                  ref="selTime"
                  is-range
                  v-model="addData.time"
                  range-separator="-"
                  style="width:60%"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  align="right"                 
                ></el-time-picker>
                <!-- default-value='[08:00:00,22:00:00]'   -->
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程关键词：" prop="keywords">
              <el-input v-model="addData.keywords" placeholder="请输入关键字，用“，”分割 " clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择讲师：" ref="lect_teacher_id" prop="lect_teacher_id">              
              <!-- <el-select style="display:none;" v-model="addData.lect_teacher_id"></el-select> -->
              <el-tag
                :key="index"
                v-for="(tag,index) in selTeachers"
                @close="handleClose(index,tag.teacher_id)"
              >{{tag.real_name}}</el-tag>
              <!-- closable
              :disable-transitions="false"-->
              <el-button
                type="primary"
                class="button-new-tag"
                plain
                size="small"
                @click="temRelatedTeacher"
              >选择讲师</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="直播属性：" prop="live_type">
              <el-select v-model="addData.live_type">
                <el-option
                  v-for="(item, index) in methodArr"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否弹幕：" prop="is_barrage">
              <el-radio v-model="addData.is_barrage" :label="1">是</el-radio>
              <el-radio v-model="addData.is_barrage" :label="0">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择教务：" prop="edu_teacher_id">
              <el-tag
                :key="index"
                v-for="(tag,index) in selJiaowus"
                @close="handleClose(index,tag.teacher_id)"
              >{{tag.real_name}}</el-tag>
              <!-- closable
              :disable-transitions="false"-->
              <el-button
                type="primary"
                class="button-new-tag"
                plain
                size="small"
                @click="temRelatedTeacher"
              >选择教务</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程描述：" prop="introduce">
              <el-input
                v-model="addData.introduce"
                type="textarea"
                :rows="5"
                placeholder="请输入课程描述"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程封面：" ref="uploadFile" prop="cover">
              <el-upload
                class="avatar-uploader"
                :action="fileUploadPath"
                :headers="setHead"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="addData.cover" :src="cover" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="课程简介：" prop="describe" ref="describe">
            <quill-editors @tranCont="getContent" :transIntroduction="addData.describe"></quill-editors>
          </el-form-item>
        </el-row>

        <el-form-item class="foot-btn">
          <el-button @click="cancelFun" class="clear-btn">取消</el-button>
          <el-button @click="marksureFun" class="sub-btn">确定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 关联老师 -->
    <relat-teacForm
      @closeDialog="closeDialog"
      @markSureDialog="markSureDialog"
      v-if="relateTeacher"
      :transData="transClassId"
      :relateTea="relateTeacher"
    ></relat-teacForm>
  </div>
</template>
<script>
import _request from "@/utils/request";
import { testPostImage } from "@/utils/index.js";
import relatTeacForm from "../../commonDialog/relatedTeacherForm";
import quillEditorCom from "./../../ueditorCom/comEditor";
import bus from "@/components/common/bus";
import { checkEnACharac3, rightNumber, numAndDecimals2 } from "@/utils/rules";

export default {
  data() {
    const dateOption = async (rule, value, callback) => {
      if (value[0]) {
        var val0 = new Date(value[0]).toLocaleDateString();
        var nowdate = new Date().toLocaleDateString();
        // console.log(val0.toLocaleString(),val1);
        if (val0  ==  nowdate && value[0] < new Date().getTime()) {
          return callback(new Error("开始时间必须大于当前时间！"));
        }        
        callback();        
      }
    };
    var setDate = new Date();
    var getM = setDate.getMonth()+1;
    var defltyear = setDate.getFullYear();
    var defltMon = getM<10?'0'+getM:getM;
    var defltDay = setDate.getDate();
    console.log()
    var getH = setDate.getHours();
    var deftH = getH <22? getH + 1: getH;
    var deftH2 = deftH + 2;   
    return {
      relateTeacher: false,
      transClassId: {
        teacher_id: "",
        senate_id: []
      },
      searchData: {
        real_name: "",
        parent_id: []
      },
      startDate: "",
      endDate: "",      
      jiangshi: [],
      transId:'',
      showDialog: false,
      clickIndex: Number,
      fileUploadPath: this.GLOBAL.postImgUrl,
      setHead: this.GLOBAL.setHead(),
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
        live_type: 3,
        is_barrage: 1,
        subject: [],
        title: "",
        keywords: "",
        openless_id: "",
        date: defltyear+'-'+defltMon+'-'+defltDay,
        time: [
         deftH+':00:00', deftH2+':00:00'
        ],
        introduce: "",
        cover: "",
        describe: "",
        lect_teacher_id: "",
        edu_teacher_id: []
      },
      teacher_id: [],
      cover: "",
      subjectsel_arr: [],
      subjectArr: [],
      dynamicTags: [],
      selTeachers: [],
      selJiaowus: [],
      methodArr: [], //直播方式
      formBox: {
        status: ""
      },
      rule: {
        title: [{ required: true, message: "请输入课程标题", trigger: "blur" }],
        subject: [
          { required: true, message: "请选择所属分类", trigger: "change" }
        ],
        keywords: [{ validator: checkEnACharac3, trigger: "blur" }],
        date: [
          { required: true, message: "请选择日期", trigger: "change" }
        ],
        time: [
          { required: true, message: "请输入课程有效期", trigger: "blur" },
          { validator: dateOption, trigger: "blur" }
        ],
        introduce: [
          { required: true, message: "请添加课程描述", trigger: "blur" }
        ],
        describe: [
          { required: true, message: "请添加课程介绍", trigger: "change" }
        ],
        cover: [{ required: true, message: "请选择图片", trigger: "blur" }],
        lect_teacher_id: [
          { required: true, message: "请选择讲师", trigger: "blur" }
        ]
      },
      searchData: {}
    };
  },
  created() {},
  mounted() {
    console.log(this.$router)
    console.log(this.$route)
    this.getSubjectList();
    this.getjiangshiList();
    this.transId = Number(this.$route.query.transId);
    if (this.transId) {
      // 修改
      this.$nextTick(() => {
        this.getDetail();
      });
    } else {
      this.transId = "";
    }
  },
  methods: {
    selDate() {
      this.$refs.selTime.focus();
    },
    //  关联讲师
    temRelatedTeacher() {
      this.relateTeacher = true;
      this.transClassId = {
        teacher_id: this.selTeachers,
        senate_id: this.selJiaowus
      };
      console.log(JSON.stringify(this.transClassId))
    },
    markSureDialog(teacher, senateArr) {
      console.log(teacher);
      this.selTeachers = teacher;
      this.selJiaowus = senateArr;
      this.addData.lect_teacher_id = teacher[0]["teacher_id"];
      this.$refs.lect_teacher_id.clearValidate();
      var senArr = [];
      for (var i = 0; i < senateArr.length; i++) {
        senArr.push(senateArr[i]["teacher_id"]);
      }
      this.addData.edu_teacher_id = senArr;
      // console.log(senateArr)
      this.relateTeacher = false;
    },
    closeDialog() {
      this.relateTeacher = false;
    },
    getContent(val) {
      this.addData.describe = val;
      if (this.addData.describe) {
        this.$refs.describe.clearValidate();
      }
    },
    beforeAvatarUpload(file) {
      return testPostImage(file);
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.addData.cover = res.data;
        this.cover = URL.createObjectURL(file.raw);
        this.$refs.uploadFile.clearValidate();
      } else {
        alert(res.msg);
      }
    },
    handleClose(index, id) {
      this.dynamicTags.splice(index, 1);
      for (var i = 0; i < this.jiangshi.length; i++) {
        if (this.jiangshi[i]["teacher_id"] == id) {
          this.$set(this.jiangshi[index], "checked", false);
        }
      }
    },
    search() {
      _request
        .http(this, "teacher/getTeacherSearchList", this.searchData)
        .then(res => {
          this.jiangshi = res.data.jiangshi;
          this.jiaowu = res.data.jiaowu;
        });
    },

    cancelFun() {
      // this.$emit("closeFun", 1);
      this.$router.go(-1);
    },
    marksureFun() {
      this.$refs.addData.validate(valid => {
        if (valid) {
          if (this.transId) {
            // 修改
            this.addData.nature = this.$route.query.transNature;
            _request
              .http(this, "opencourse/doOpenLessById", this.addData)
              .then(res => {
                console.log(res);
                if (res.code == 200) {
                  this.$toast(res.msg);
                  // this.$emit("successClose", 1);
                  this.$router.go(-1);
                } else {
                  this.$toast(res.msg);
                }
              });
          } else {
            this.addData.id = "";
            _request
              .http(this, "opencourse/doInsertOpenCourse", this.addData)
              .then(res => {
                console.log(res);
                if (res.code == 200) {
                  this.$toast(res.msg);
                  // this.$emit("successClose", 1);
                  this.$router.go(-1);
                } else {
                  this.$toast(res.msg);
                }
              });
          }
        } else {
          return false;
        }
      });
    },
    getSubjectList() {
      _request.http(this, "subject").then(res => {
        this.subjectArr = res.data;
      });
      _request.http(this, "opencourse/zhiboMethod").then(res => {
        this.methodArr = res.data;
      });
    },
    getDetail() {
      _request
        .http(this, "opencourse/getOpenLessById", { openless_id: this.transId })
        .then(res => {
          if (res.code == 200) {
            var getData = res.data.openless;
            this.addData = {
              openless_id: getData.openless_id,
              live_type: getData.live_type,
              is_barrage: getData.is_barrage,
              subject: getData.subject,
              title: getData.title,
              keywords: getData.keywords,
              introduce: getData.introduce,
              cover: getData.cover,
              date:getData.date,
              time:getData.time,
              lect_teacher_id: getData.lect_teacher_id,
              edu_teacher_id: getData.edu_teacher_id
            };

            this.$set(this.addData, "describe", getData.describe);

            this.cover = this.addData.cover;

            this.selTeachers = getData.lect_id;
            this.selJiaowus = getData.edu_id;

            // 修改讲师教务传递参数
          } else {
            alert(res.msg);
          }
        });
    },

    getjiangshiList() {
      _request.http(this, "teacher/getTeacherSearchList").then(res => {
        this.jiangshi = res.data.jiangshi;
      });
    }
  },
  components: {
    "quill-editors": quillEditorCom,
    "relat-teacForm": relatTeacForm
  }
};
</script>
<style scoped lang="less">
.accounadd {
  // background-color: #fff;
  .head-style {
    margin-left: 30px;
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
    padding-right: 50px;
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
  width: 200px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 100px;
  display: block;
}

.el-select {
  display: block;
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
</style>
