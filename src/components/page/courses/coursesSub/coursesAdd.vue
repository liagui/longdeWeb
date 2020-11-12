<template>
  <div class="accounadd clearfix">
    <p class="head-style">
      <span v-text="transId ? '课程修改' : '课程添加'"></span>
      <el-button
        type="primary"
        v-if="!this.$route.query.transId"
        class="copy"
        @click="copyCourse"
        >一键复制</el-button
      >
    </p>
    <div class="form-box">
      <el-form :model="addData" :rules="rule" label-width="120px" ref="addData">
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
            <el-form-item label="课程分类：" prop="parent">
              <el-cascader
                style="width: 100%"
                v-model="addData.parent"
                collapse-tags
                :disabled="courseUpdate"
                :options="subjectArr"
                :props="{
                  checkStrictly: true,
                  value: 'id',
                  label: 'name',
                  children: 'childs',
                  expandTrigger: 'hover',
                }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="课程关键词：" prop="keywords">
              <el-input
                v-model="addData.keywords"
                placeholder="请输入关键字，用“，”分割 "
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="isZongKong == 1" :span="12">
            <el-form-item label="网校单价：" prop="impower_price">
              <el-input
                v-model="addData.impower_price"
                type="number"
                :min="0"
                placeholder="请输入课程定价，格式：00.00"
              ></el-input>
              <!-- oninput="this.value=this.value.replace(/[^0-9.]+/g,'');" -->
            </el-form-item>
          </el-col>

          <div v-else>
            <el-col :span="12">
              <el-form-item label="课程定价：" prop="pricing">
                <el-input
                  v-model="addData.pricing"
                  type="number"
                  :min="0"
                  placeholder="请输入课程定价，格式：00.00"
                ></el-input>
                <!-- oninput="this.value=this.value.replace(/[^0-9.]+/g,'');" -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="优惠价格：" prop="sale_price">
                <el-input
                  v-model="addData.sale_price"
                  type="number"
                  min="0"
                  placeholder="请输入优惠价格，格式：00.00"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="课程有效期：" prop="expiry">
                <el-input
                  v-model="addData.expiry"
                  type="number"
                  min="0"
                  placeholder="有效期从学员购买日期起计算，单位：天，0为无限期"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="购买基数：" prop="buy_num">
                <el-input
                  v-model="addData.buy_num"
                  type="number"
                  min="0"
                  placeholder="请输入数量，格式：0"
                ></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择讲师：" prop="teacher_id">
              <el-select
                style="display: none"
                v-model="addData.teacher_id"
              ></el-select>
              <el-tag
                :key="index"
                v-for="(tag, index) in selTeachers"
                @close="handleClose(index, tag.teacher_id)"
                >{{ tag.real_name }}</el-tag
              >
              <!-- closable
              :disable-transitions="false"-->
              <el-button
                type="primary"
                class="button-new-tag"
                plain
                size="small"
                @click="selTeacher"
                :disabled="courseUpdate"
                >选择老师</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授课方式：" prop="method">
              <el-checkbox-group v-model="addData.method">
                <el-checkbox
                  v-for="(item, index) in methodArr"
                  :key="index"
                  :label="item.id"
                  :disabled="courseUpdate"
                  :value="item.id"
                  >{{ item.name }}</el-checkbox
                >
                <!-- <el-checkbox label="1" value='1' >直播</el-checkbox>
                    <el-checkbox label="2" value='2'>录播</el-checkbox>
                <el-checkbox label="3" value='3'>其他</el-checkbox>-->
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程简介：" prop="describe">
              <el-input
                v-model="addData.describe"
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
          <el-form-item label="课程详情：" prop="introduce" ref="introduce">
            <quill-editors
              @tranCont="getContent"
              :transIntroduction="addData.introduce"
            ></quill-editors>
          </el-form-item>
        </el-row>

        <el-form-item class="foot-btn">
          <el-button @click="cancelFun" class="clear-btn">取消</el-button>
          <el-button @click="marksureFun" class="sub-btn">确定</el-button>
        </el-form-item>
      </el-form>

      <!-- 关联老师模态框 -->
      <el-dialog
        title="关联老师"
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        width="80%"
        @close="closeDialog"
        center
      >
        <div>
          <el-form :model="formBox" ref="formBox" :inline="true">
            <el-form-item>
              <el-cascader
                style="width: 100%"
                v-model="searchData.parent_id"
                collapse-tags
                :options="subjectArr"
                clearable
                @change="getjiangshiList"
                :props="{
                  checkStrictly: true,
                  value: 'id',
                  label: 'name',
                  children: 'childs',
                  expandTrigger: 'hover',
                }"
              ></el-cascader>
            </el-form-item>
            <el-form-item prop="name">
              <el-input
                v-model="searchData.real_name"
                placeholder="讲师名称"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
          <!-- <div class="listType">讲师：</div> -->
          <div>
            <div
              class="listItem"
              v-for="(item, index) in jiangshi"
              :key="index"
              @click="clickTeacher(item, index)"
              :class="{ itemActive: item.checked }"
            >
              {{ item.real_name }}
            </div>

            <div class="addTeacher" @click="xinzenglaoshi">+ 新增老师</div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="dialogMarksure">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <courses-copy
      v-if="showcopy.showDialog"
      :transData="showcopy"
      @closeFun="dialogClear"
      @marksure="dialogSure"
    ></courses-copy>
  </div>
</template>
<script>
import _request from "@/utils/request";
import { testPostImage } from "@/utils/index.js";
import quillEditorCom from "./../../ueditorCom/comEditor";
import bus from "@/components/common/bus";
import coursesCopy from "./coursesCopy";
import {
  checkEnACharac3,
  rightNumber3,
  rightNumber,
  numAndDecimals2,
} from "@/utils/rules";

export default {
  data() {
    return {
      isZongKong: this.$store.state.school_status,
      jiangshi: [],
      transId: "",
      showDialog: false,
      clickIndex: Number,
      fileUploadPath: this.GLOBAL.postImgUrl,
      setHead: this.GLOBAL.setHead(),
      editorOption: {
        //  富文本编辑器配置
        modules: {
          toolbar: {
            container: "#toolbar",
          },
        },
        theme: "snow",
        placeholder: "请输入正文",
      },
      showcopy: {
        showDialog: "",
      },
      courseUpdate: false,
      addData: {
        parent: [],
        title: "",
        is_public: 0,
        keywords: "",
        pricing: "",
        impower_price: "",
        sale_price: "",
        buy_num: "",
        method: [1],
        expiry: "",
        describe: "",
        cover: "",
        introduce: "",
        teacher_id: [],
        teacher: [],
      },
      cover: "",
      subjectsel_arr: [],
      subjectArr: [],
      dynamicTags: [],
      selTeachers: [],
      methodArr: [
        { id: 1, name: "直播" },
        { id: 2, name: "录播" },
        { id: 3, name: "其他" },
      ], //直播方式
      formBox: {
        status: "",
      },
      rule: {
        title: [{ required: true, message: "请输入课程标题", trigger: "blur" }],
        parent: [
          { required: true, message: "请选择所属分类", trigger: "change" },
        ],
        impower_price: [
          { required: true, message: "请输入网校单价", trigger: "blur" },
          { validator: numAndDecimals2, trigger: "blur" },
        ],
        pricing: [
          { required: true, message: "请输入课程定价", trigger: "blur" },
          { validator: numAndDecimals2, trigger: "blur" },
        ],
        keywords: [{ validator: checkEnACharac3, trigger: "blur" }],
        sale_price: [
          { required: true, message: "请输入课程优惠价格", trigger: "blur" },
          { validator: numAndDecimals2, trigger: "blur" },
        ],
        buyNum: [{ validator: rightNumber, trigger: "blur" }],
        expiry: [
          { required: true, message: "请输入课程有效期", trigger: "blur" },
          { validator: rightNumber3, trigger: "blur" },
        ],
        buy_num: [{ validator: rightNumber3, trigger: "blur" }],
        describe: [
          { required: true, message: "请添加课程描述", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "请添加课程介绍", trigger: "change" },
        ],
        cover: [{ required: true, message: "请选择图片", trigger: "blur" }],
        method: [
          { required: true, message: "请选择授课方式", trigger: "blur" },
        ],
      },
      searchData: {
        real_name: "",
        parent_id: [],
      },
      load: false,
    };
  },
  mounted() {
    this.getSubjectList();
    this.getjiangshiList();
    if (this.$route.query.is_nature == 0) {
      this.courseUpdate = false;
    } else {
      this.courseUpdate = true;
    }
    if (this.$route.query.transId) {
      // 修改
      this.$nextTick(() => {
        this.getDetail();
      });
      this.transId = this.$route.query.transId;
    } else {
      this.transId = "";
    }
  },
  watch: {
    "searchData.real_name": {
      handler(newVal, oldVal) {
        let timeout;
        if (this.load) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          this.getjiangshiList();
          this.load = false;
        }, 500);
      },
    },
  },
  components: {
    // quillEditor
    "quill-editors": quillEditorCom,
    coursesCopy,
  },
  methods: {
    dialogSure(val) {
      this.showcopy.showDialog = false;
      if (val) {
        this.copyCourseMess(val);
      }
    },
    copyCourseMess(id) {
      _request.http(this, "course/courseFirst", { id: id }).then((res) => {
        if (res.code == 200) {
          var getData = res.data;
          (this.addData = {
            parent: getData.parent,
            title: getData.title,
            is_public: 0,
            keywords: getData.keywords,
            pricing: getData.pricing,
            sale_price: getData.sale_price,
            buy_num: getData.buy_num,
            method: getData.method,
            expiry: getData.expiry,
            describe: getData.describe,
            cover: getData.cover,
            introduce: "",
            teacher_id: [],
            teacher: res.data.teacher,
          }),
            (this.dynamicTags = res.data.teachers);
          this.selTeachers = res.data.teachers;
          this.cover = res.data.cover;
          var jiangshiArr = this.jiangshi;
          var tacArr = res.data.teacher;
          for (let i = 0; i < tacArr.length; i++) {
            for (let j = 0; j < jiangshiArr.length; j++) {
              if (tacArr[i] == jiangshiArr[j]["teacher_id"]) {
                this.$set(this.jiangshi[j], "checked", true);
                break;
              }
            }
          }
          this.$set(this.addData, "introduce", res.data.introduce);
        }
      });
    },
    dialogClear() {
      this.showcopy.showDialog = false;
    },
    copyCourse() {
      this.showcopy.showDialog = true;
    },
    xinzenglaoshi() {
      let isZongKong = this.$store.state.school_status == 1; //总控1 中控0
      let hrefStr = isZongKong
        ? "/#/resourceGeneral/generalLecturers"
        : "/#/users/lecturers";
      let href = window.location.origin + hrefStr;
      window.open(href, "_blank");
    },

    getContent(val) {
      this.addData.introduce = val;
      if (this.addData.introduce) {
        this.$refs.introduce.clearValidate();
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

    getjiangshiList() {
      _request
        .http(this, "teacher/getTeacherSearchList", this.searchData)
        .then((res) => {
          this.jiangshi = res.data.jiangshi;
        });
    },
    closeDialog() {
      for (var j = 0; j < this.jiangshi.length; j++) {
        this.$set(this.jiangshi[j], "checked", false);
      }
      for (var i = 0; i < this.selTeachers.length; i++) {
        for (var j = 0; j < this.jiangshi.length; j++) {
          if (
            this.selTeachers[i]["teacher_id"] == this.jiangshi[j]["teacher_id"]
          ) {
            this.$set(this.jiangshi[j], "checked", true);
          }
        }
      }
      this.showDialog = false;
      this.dynamicTags = JSON.parse(JSON.stringify(this.selTeachers));
    },
    dialogMarksure() {
      console.log("dynamicTags:" + this.dynamicTags);
      this.selTeachers = JSON.parse(JSON.stringify(this.dynamicTags));
      console.log(this.selTeachers);
      this.showDialog = false;
    },
    cancelFun() {
      // this.$emit("closeFun", 1);
      this.$router.go(-1);
    },
    // 添加或修改
    marksureFun() {
      var teacherIds = [];
      for (var i = 0; i < this.selTeachers.length; i++) {
        teacherIds.push(this.selTeachers[i]["teacher_id"]);
      }
      this.addData.teacher = teacherIds;

      this.$refs.addData.validate((valid) => {
        if (valid) {
          if (this.transId) {
            // 修改
            // if(this.nature == 1){
            //   this.$message.error('此课程是授权课程不能修改');
            //   return;
            // }
            _request
              .http(this, "course/courseUpdate", this.addData)
              .then((res) => {
                console.log(res);
                if (res.code == 200) {
                  this.$toast(res.msg);
                  // this.$emit("successClose", 1);
                  this.$router.go(-1);
                }
              });
          } else {
            this.addData.id = "";
            _request
              .http(this, "course/courseAdd", this.addData)
              .then((res) => {
                console.log(res);
                if (res.code == 200) {
                  this.$toast(res.msg);
                  // this.$emit("successClose", 1);
                  this.$router.go(-1);
                }
              });
          }
        } else {
          return false;
        }
      });
    },
    getSubjectList() {
      _request.http(this, "subject").then((res) => {
        this.subjectArr = res.data;
      });
    },
    getDetail() {
      _request
        .http(this, "course/courseFirst", {
          id: this.transId,
          nature: this.$route.query.is_nature,
        })
        .then((res) => {
          if (res.code == 200) {
            this.addData = res.data;
            this.dynamicTags = res.data.teachers;
            this.selTeachers = res.data.teachers;
            this.addData.teacher = res.data.teacher;
            this.cover = res.data.cover;
            var jiangshiArr = this.jiangshi;
            var tacArr = res.data.teacher;
            for (let i = 0; i < tacArr.length; i++) {
              for (let j = 0; j < jiangshiArr.length; j++) {
                if (tacArr[i] == jiangshiArr[j]["teacher_id"]) {
                  this.$set(this.jiangshi[j], "checked", true);
                  break;
                }
              }
            }
            this.$set(this.addData, "introduce", res.data.introduce);
          }
        });
    },
    // 选择老师
    clickTeacher(item, index) {
      if (item.checked == true) {
        // this.item.checked = false;
        // this.$set(this.jiangshi,index,this.item)
        this.$set(this.jiangshi[index], "checked", false);

        for (let i = 0; i < this.dynamicTags.length; i++) {
          if (this.dynamicTags[i]["teacher_id"] == item.teacher_id) {
            this.dynamicTags.splice(i, 1);
          }
        }
      } else {
        // this.item.checked = true;
        // this.$set(this.jiangshi,index,this.item)
        this.$set(this.jiangshi[index], "checked", true);
        this.dynamicTags.push(item);
      }
    },
    selTeacher() {
      var that = this;
      this.showDialog = true;
      var tacArr = this.selTeachers;
      console.log(JSON.stringify(this.selTeachers));
      var jiangshiArr = this.jiangshi;
      this.$nextTick(() => {
        for (let i = 0; i < tacArr.length; i++) {
          for (let j = 0; j < jiangshiArr.length; j++) {
            if (tacArr[i]["teacher_id"] === jiangshiArr[j]["teacher_id"]) {
              this.$set(this.jiangshi[j], "checked", true);
            }
          }
        }
      });
    },
  },
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
    position: relative;
    .copy {
      position: absolute;
      right: 30px;
    }
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
