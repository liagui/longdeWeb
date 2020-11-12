<template>
  <div>
    <div v-if="showList">
      <div class="content-head">
        <div>直播资源详情</div>
        <div>
          <el-button type="primary" @click="uploadLiveResourceMess">详情修改</el-button>
          <el-button type="primary" @click="addClassNum">添加班号</el-button>
          <el-button type="primary" @click="relativeCourse">关联课程</el-button>
          <el-button type="primary" @click="goback">返回</el-button>
        </div>
      </div>
      <div class="content-cont">
        <div class="borderLeft">课程单元信息</div>
        <div class="unitMess">
          <el-row class="mb-20">
            <el-col :span="7">
              <img src="./../../../../assets/image/kecheng/icon1.png" class="initImg color-blue" />
              学科：{{unitDetail.subject_name}}
            </el-col>
            <el-col :span="7">
              <img src="./../../../../assets/image/kecheng/icon2.png" class="initImg color-blue" />
              学科小类：{{unitDetail.subject_child_name}}
            </el-col>
            <el-col :span="9">
              <img src="./../../../../assets/image/kecheng/icon3.png" class="initImg color-blue" />
              单元名称：{{unitDetail.name}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <img src="./../../../../assets/image/kecheng/icon4.png" class="initImg color-blue" />授课方式：直播
            </el-col>
            <el-col :span="7">
              <img src="./../../../../assets/image/kecheng/icon5.png" class="initImg color-blue" />
              总课时：{{unitDetail.sum_class_hour}}
            </el-col>
            <el-col :span="10">
              <img src="./../../../../assets/image/kecheng/icon6.png" class="initImg color-blue" />
              课程单元介绍：{{unitDetail.introduce}}
            </el-col>
          </el-row>
        </div>
        <div class="borderLeft">班号信息</div>
        <div>
          <div class="unitMess" v-for="(item,index) in liveClassList" :key="index">
            <div class="banhaoHead">
              <div class="banhaoTitle">
                <img src="./../../../../assets/image/kecheng/banhao.png" class="initImg color-blue" />
                {{item.name}}
              </div>
              <div class="banhaoHead-left">
                <div class="keshiMess">
                  总课次：
                  <span style="color:#FF551D">{{item.class_num}}</span>
                </div>
                <div class="keshiMess">
                  已上课次：
                  <span style="color:#1CC700">{{item.class_num_passed}}</span>
                </div>
                <div class="keshiMess">
                  待上课次：
                  <span style="color:#FF0000">{{item.class_num_not}}</span>
                </div>
              </div>
              <div class="banhaoHead-right">
                <el-switch
                  :width="55"
                  v-model="item.is_forbid"
                  @change="recommendTeacher(item.id)"
                  active-color="#00cc00"
                  :active-value="0"
                  :inactive-value="1"
                  active-text="启用"
                  inactive-text="禁用"
                  inactive-color="#ddd"
                ></el-switch>
                <el-button type="info" plain @click="delClassItem(item)">删除</el-button>
                <el-button type="danger" plain @click="updateClassItem(item)">编辑</el-button>
                <el-button type="success" plain @click="uploadFileFun(item.id)">课程资料</el-button>
                <el-button type="primary" @click="classAdminFun(item)" plain>课次管理</el-button>
              </div>
            </div>
            <el-table
              :data="item.class_child"
              stripe
              border
              cell-class-name="center"
              header-cell-class-name="center"
            >
              <el-table-column prop="name" label="课次名称"></el-table-column>
              <el-table-column prop="teacher_name" label="讲师姓名"></el-table-column>
              <el-table-column prop="time" label="时间"></el-table-column>
            </el-table>
          </div>
        </div>
        <div v-if="noData">
          <div class="noData">
            暂无班号信息
            <el-button type="primary" @click="addClassNum">立即添加</el-button>
          </div>
        </div>
      </div>
      <!-- 详情修改 -->
      <el-dialog
        title="修改直播单元"
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        width="60%"
        @close="showDialog = false"
        center
      >
        <div class="form-box">
          <el-form
            :model="addData"
            style="text-align:center;"
            label-width="120px"
            ref="addData"
            :rules="addDataRule"
            :inline="true"
          >
            <el-form-item label="所属学科：" prop="parent_id" style="margin-top:30px;">
              <el-cascader
                style="width:400px;"
                v-model="addData.parent_id"
                collapse-tags
                :options="subjectArr"
                clearable
                disabled
                :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
              ></el-cascader>
            </el-form-item>
            <el-row>
              <el-form-item label="直播单元名称：" style="margin-top:10px;" prop="name">
                <el-input
                  v-model="addData.name"
                  style="width:400px;"
                  placeholder="请输入直播单元名称"
                  clearable
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="直播单元介绍：" prop="introduce" style="margin-top:10px;">
                <el-input
                  v-model="addData.introduce"
                  style="width:400px;"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入直播单元介绍"
                  clearable
                ></el-input>
              </el-form-item>
            </el-row>
            <el-form-item>
              <!-- <el-button type="primary" @click="search">查询</el-button> -->
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="dialogUpdate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加班号 -->
      <el-dialog
        :title="addClassData.id?'修改班号':'添加班号'"
        :close-on-click-modal="false"
        :visible.sync="addClassDialog"
        width="60%"
        @close="addClassDialog = false"
        center
      >
        <div class="form-box">
          <el-form
            :model="addClassData"
            style="text-align:center;"
            label-width="120px"
            ref="addClassData"
            :rules="addClassDataRule"
            :inline="true"
          >
            <el-row>
              <el-form-item label="班号名称：" style="margin-top:10px;" prop="name">
                <el-input
                  v-model="addClassData.name"
                  style="width:400px;"
                  placeholder="请输入班号名称"
                  clearable
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="班号信息：" prop="content" style="margin-top:10px;">
                <el-input
                  v-model="addClassData.content"
                  style="width:400px;"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入班号信息"
                  clearable
                ></el-input>
              </el-form-item>
            </el-row>
            <el-form-item>
              <!-- <el-button type="primary" @click="search">查询</el-button> -->
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addClassDialog = false">取 消</el-button>
          <el-button type="primary" @click="dialogMarksure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <!-- 课次管理 -->
      <liveResource-classAdmin
        @classCloseFun="classCloseFun"
        :transClassData="transClassData"
        v-if="showClassAdmin"
      ></liveResource-classAdmin>

      <!-- 选择关联课程 -->
      <select-course
        v-if="changeDialogCourse"
        :changeDialogCourse="changeDialogCourse"
        :transId="transId"
        @marksureFun="marksureFun"
        @clearFun="clearFun"
        @openSelectCourse="openSelectCourse"
      ></select-course>

      <!-- 选择资料 -->
      <chapter-file
        v-if="changeDialogFile"
        :changeDialogFile="changeDialogFile"
        :transFile="transFile"
        @marksure="marksureFileFun"
        @closeFile="clearFileFun"
      ></chapter-file>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import liveResourceClassAdmin from "./liveResourceClassAdmin";

import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
import { checkCharacters, rightNumber } from "@/utils/rules";
import selPdfExcel from "./../../commonDialog/selPdfExcel";
import selectCourse from "./../../commonDialog/selectCourse";

export default {
  components: {
    "liveResource-classAdmin": liveResourceClassAdmin,
    "chapter-file": selPdfExcel,
    "select-course": selectCourse
  },
  data() {
    return {
      transDataId: "",
      changeDialogFile: false,
      changeDialogCourse: false,
      transId: "",
      transFile: [],
      is_recommend: "1",
      schoolBranch: [],
      showList: true,
      showClassAdmin: false,
      addClassDialog: false,
      showDialog: false,
      subjectArr: [], //课程列表
      transClassData: {},
      addData: {
        id: "",
        name: "",
        introduce: "",
        parent_id: []
      },
      addDataRule: {
        name: [
          { required: true, message: "请输入课程单元名称", trigger: "blur" }
        ],
        introduce: [
          { required: true, message: "请输入课程单元介绍", trigger: "blur" },
          { validator: checkCharacters, trigger: "blur" }
        ],
        parent_id: [
          { required: true, message: "请选择所属学科", trigger: "change" }
        ]
      },
      addClassData: {
        id: "",
        name: "",
        content: "",
        resource_id: this.$route.query.transDataId
      },
      addClassDataRule: {
        name: [{ required: true, message: "请输入班号名称", trigger: "blur" }],
        content: [
          { required: true, message: "请输入班号信息", trigger: "blur" }
        ]
      },
      statusArr: [
        { label: "全部", value: "" },
        { label: "待审核", value: 0 },
        { label: "审核通过", value: 1 },
        { label: "审核拒绝", value: 2 }
      ],
      unitDetail: [],
      liveClassList: [], //班号列表
      noData: false,
      fileLoadData: {
        parent_id: "",
        filearr: []
      }
    };
  },
  mounted() {
    this.transDataId = this.$route.query.transDataId;
    this.initData();
    this.selTeacher();
    this.getLiveClassList();
  },
  methods: {
    marksureFun(selId) {
      this.changeDialogCourse = false;
      _request
        .http(this, "liveRelationLesson", {
          resource_id: this.transDataId,
          course_id: selId
        })
        .then(res => {
          if (res.code == 200) {
          } else {
            alert(res.msg);
          }
        });
    },
    clearFun() {
      this.changeDialogCourse = false;
    },
    // 关联课程
    relativeCourse() {
      _request
        .http(this, "lessonList", {
          resource_id: this.transDataId,
          nature: this.$route.query.nature
        })
        .then(res => {
          if (res.code == 200) {
            this.changeDialogCourse = true;
            this.transId = this.transDataId;
          }
        });
    },
    // 上传课程资料
    marksureFileFun(arr) {
      this.fileLoadData.filearr = arr;
      // this.addData.filearr = arr;
      _request.http(this, "uploadLiveClass", this.fileLoadData).then(res => {
        if (res.code == 200) {
          // this.getLiveClassList();
        } else {
          alert(res.msg);
        }
      });
    },
    clearFileFun() {
      this.changeDialogFile = false;
    },

    classAdminFun(item) {
      // this.showList = false;
      // this.showClassAdmin = true;
      // this.transClassData = item;
      this.$router.push({
        path: "/resources/liveResource/classAdmin",
        query: {
          id: item.id,
          name: item.name
        }
      });
    },
    // 修改详情
    uploadLiveResourceMess() {
      this.showDialog = true;
      this.addData = {
        id: this.unitDetail.id,
        name: this.unitDetail.name,
        introduce: this.unitDetail.introduce,
        parent_id: this.unitDetail.parent_id
      };
      this.$refs.addData && this.$refs.addData.resetFields();
    },

    // 删除
    delClassItem(item) {
      this.$confirm("删除该班号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request
            .http(this, "deleteLiveClass", {
              id: item.id,
              live_id: item.resource_id
            })
            .then(res => {
              if (res.code == 200) {
                this.getLiveClassList();
              } else {
                alert(res.msg);
              }
            });
        })
        .catch(() => {});
    },
    // 更改状态
    recommendTeacher(id) {
      _request.http(this, "updateLiveClassStatus", { id: id }).then(res => {
        if (res.code == 200) {
          this.getLiveClassList();
        }
      });
    },
    classCloseFun() {
      this.showList = true;
      this.showClassAdmin = false;
      this.getLiveClassList();
    },
    goback() {
      // this.$emit("closeFun");
      this.$router.go(-1);
    },
    selTeacher() {
      _request.http(this, "subject").then(res => {
        this.subjectArr = res.data;
      });
    },
    // 修改课程信息
    dialogUpdate() {
      this.$refs.addData.validate(valid => {
        if (valid) {
          // 修改
          _request.http(this, "updateLive", this.addData).then(res => {
            if (res.code == 200) {
              this.showDialog = false;
              this.initData();
            }
          });
        }
      });
    },
    // 添加班号
    addClassNum() {
      this.addClassDialog = true;
      this.addClassData.id = "";
      this.$refs.addClassData && this.$refs.addClassData.resetFields();
    },
    //上传资料
    uploadFileFun(id) {
      this.fileLoadData.parent_id = id;
      // 获取已经上传的资料
      _request
        .http(this, "getListLiveClassMaterial", { parent_id: id })
        .then(res => {
          if (res.code == 200) {
            this.transFile = res.data.LiveClass_list_Material;

            this.changeDialogFile = true;
          }
        });
    },
    // 班号更新
    updateClassItem(item) {
      this.addClassDialog = true;
      this.$refs.addClassData && this.$refs.addClassData.clearValidate();
      this.addClassData = {
        id: item.id,
        name: item.name,
        content: item.content,
        resource_id: this.transDataId
      };
    },
    // 添加班号
    dialogMarksure() {
      this.$refs.addClassData.validate(valid => {
        if (valid) {
          if (this.addClassData.id) {
            // 修改
            _request
              .http(this, "updateLiveClass", this.addClassData)
              .then(res => {
                if (res.code == 200) {
                  this.addClassDialog = false;
                  this.getLiveClassList();
                }
              });
          } else {
            _request
              .http(this, "liveClass/add", this.addClassData)
              .then(res => {
                if (res.code == 200) {
                  this.addClassDialog = false;
                  this.addData.id = "";
                  this.getLiveClassList();
                }
              });
          }
        }
      });
    },

    // 获取班号列表
    getLiveClassList() {
      _request
        .http(this, "liveClass", {
          resource_id: this.transDataId,
          pagesize: 100
        })
        .then(res => {
          if (res.code == 200) {
            if (res.data.LiveClass_list.length) {
              this.liveClassList = res.data.LiveClass_list || [];
              this.noData = false;
            } else {
              this.noData = true;
              this.liveClassList = [];
            }
          }
        });
    },
    // 班号基本信息
    initData() {
      _request.http(this, "liveShow", { id: this.transDataId }).then(res => {
        this.unitDetail = res.data;
      });
    }
  },
  watch: {}
};
</script>

<style scoped lang="less">
.borderLeft {
  border-left: 4px solid rgba(36, 163, 252, 1);
  font-size: 20px;
  padding-left: 5px;
  margin-top: 30px;
  margin-bottom: 20px;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  height: 20px;
  line-height: 20px;
}
.unitMess {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 30px;
  margin-bottom: 20px;
}
.banhaoHead {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .banhaoTitle {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // width: 37%;
  }
  .banhaoHead-left {
    width: 400px;
  }
  .banhaoHead-right {
    width: 400px;
  }
  .keshiMess {
    display: inline-block;
    width: 100px;
    // width: 20%;
  }
}
.mb-20 {
  margin-bottom: 20px;
}
.initImg {
  width: 20px;
  height: 20px;
  vertical-align: text-bottom;
  margin-right: 5px;
}
.color-blue {
  color: #24a3fc;
}
/deep/ .content-cont .el-switch__label--left {
  left: 22px;
}

/deep/ .content-cont .el-switch__label--right {
  right: -3px;
}
</style>