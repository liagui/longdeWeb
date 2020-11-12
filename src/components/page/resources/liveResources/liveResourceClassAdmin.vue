<template>
  <div>
    <div class="content-head">
      <div>排课计划 {{this.$route.query.name}}</div>
      <div>
        <el-button type="primary" @click="addClassNum">添加课次</el-button>
        <el-button type="primary" @click="goback">返回</el-button>
      </div>
    </div>
    <div class="content-cont">
      <el-table
        :data="dataList"
        stripe
        border
        cell-class-name="center"
        header-cell-class-name="center"
      >
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="week" label="星期"></el-table-column>
        <el-table-column prop="period" label="时段"></el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
        <el-table-column prop="name" label="课次"></el-table-column>
        <el-table-column prop="class_hour" label="课时"></el-table-column>
        <el-table-column label="弹幕">
          <template slot-scope="scope">
            <div v-text="scope.row.is_bullet == 1?'是':'否'"></div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="状态">
          <template slot-scope="scope">
            <div v-text="scope.row.is_free == 1?'收费':'免费'"></div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="模式">
          <template slot-scope="scope">
            <div v-text="scope.row.live_type == 3?'大班课':''"></div>
          </template>
        </el-table-column>
        <el-table-column label="关联讲师" min-width="90">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="itemRelatedTeacher(scope.row)" v-text="scope.row.teacher_id?'已关联':'未关联'"></el-button> -->
            <el-button size="mini" v-if='scope.row.teacher_id' @click="itemRelatedTeacher(scope.row)" type="warning" plain>已关联</el-button>
            <el-button size="mini" v-else @click="itemRelatedTeacher(scope.row)" type="danger">未关联</el-button>
          </template>
        </el-table-column>
        <el-table-column label="课次状态" min-width="90">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="doPost(scope.row.id,scope.row.teacher_id)" v-text="scope.row.status?'已发布':'未发布'"></el-button> -->
            <el-button size="mini" v-if='scope.row.status' @click="doPosted" type="info" plain>已发布</el-button>
            <el-button size="mini" v-else @click="doPost(scope.row.id,scope.row.teacher_id)" type="success">未发布</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="delClass(scope.row.id)">删除</el-button>
            <el-button type="text" @click="updateClass(scope.row.id)">编辑</el-button>
            <!-- <el-button type="text" @click="itemRelatedTeacher(scope.row)">关联教师</el-button> -->
            <el-button type="text" @click="uploadFileFun(scope.row.id)">课次资料</el-button>
            <!-- <el-button type="text" @click="doPost(scope.row.id,scope.row.teacher_id)">发布</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-if="paginationShow"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[20, 50, 100]"
        :page-size="cur.pagesize"
        :total="totalCount"
        :current-page="nextPage"
        layout="total, sizes, prev, pager, next, jumper,slot"
      >
        <el-button class="pagingBtn" size="small">确认</el-button>
      </el-pagination>
    </div>

    <el-dialog
      :title="addData.id?'修改课次':'添加课次'"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      width="650px"
      @close="showDialog = false"
    >
      <div class="form-box">
        <el-form
          :model="addData"
          label-width="120px"
          ref="addData"
          :rules="addDataRule"
          :inline="true"
        >
          <el-row>
            <el-form-item label="添加日期：" prop="date" style="margin-top:30px;">
              <el-date-picker
                v-model="addData.date"
                type="date"
                style="width:180px"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="selDate"
              ></el-date-picker>
              <el-form-item prop="time">
                <el-time-picker
                  ref="selTime"
                  is-range
                  v-model="addData.time"
                  range-separator="-"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  align="right"
                  :picker-options="pickerOption"
                ></el-time-picker>
                <!-- default-value='[08:00:00,22:00:00]'   -->
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="课次名称：" style="margin-top:10px;" prop="name">
              <el-input v-model="addData.name" style="width:400px;" placeholder="请输入课次名称" clearable></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="课时：" prop="class_hour" style="margin-top:10px;">
              <el-input
                type="number"
                style="width:400px;"
                :min='0'
                v-model="addData.class_hour"
                placeholder="请输入课时数量"
                clearable
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="是否收费：">
              <el-radio-group v-model="addData.is_free">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="是否弹幕：">
              <el-radio-group v-model="addData.is_bullet">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-form-item label="选择模式：">
            <el-select v-model="addData.live_type" style="width:150px" placeholder="选择模式">
              <el-option
                v-for="(item, index) in schoolBranch"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="dialogMarksure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关联老师 -->
    <relat-teac
      @closeDialog="closeDialog"
      @markSureDialog="markSureDialog"
      v-if="relateTeacher"
      :transData = 'transClassId'
      :relateTea="relateTeacher"
    ></relat-teac>
    <!-- 选择资料 -->
      <chapter-file
        v-if="changeDialogFile"
        :changeDialogFile="changeDialogFile"
        :transFile="transFile"
        @marksure="marksureFileFun"
        @closeFile="clearFileFun"
      ></chapter-file>
  </div>
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import relatTeac from "./../../commonDialog/relatedTeacher";
import selPdfExcel from "./../../commonDialog/selPdfExcel";
import { checkCharacters, numAndDecimals2 } from "@/utils/rules";

export default {
  components: {
    "relat-teac": relatTeac,
    "chapter-file": selPdfExcel,
  },
  data() {
    var setDate = new Date();
    var getM = setDate.getMonth()+1;
    var defltyear = setDate.getFullYear();
    var defltMon = getM<10?'0'+getM:getM;
    var defltDay = setDate.getDate();
    var getH = setDate.getHours();
    var deftH = getH <22? getH + 1: getH;
    var deftH2 = deftH + 2;    

    return {
      changeDialogFile:false,
      relateTeacher: false,
      fileLoadData: {
        parent_id: "", 
        filearr: []
      },
      dataList: [],
      is_recommend: "1",
      schoolBranch: [{ value: 3, label: "大班课" }],
      showList: true,
      showaddClass: false,
      showDialog: false,
      addData: {
        shift_no_id: this.$route.query.id,
        date: defltyear+'-'+defltMon+'-'+defltDay,
        time: [
         deftH+':00:00', deftH2+':00:00'
        ],
        name: "",
        description: "",
        is_free: 1,
        is_bullet: 1,
        live_type: 3
      },
      
      pickerOption:{},
      addDataRule: {
        name: [
          { required: true, message: "请输入课程单元名称", trigger: "blur" }
        ],
        description: [{ validator: checkCharacters, trigger: "blur" }],
        date: [
          { required: true, message: "请选择日期", trigger: "change" }
        ],
        class_hour: [
          { required: true, message: "请输入课时", trigger: "change" },
          { validator: numAndDecimals2, trigger: "blur" }
         ]
      },
      transClassId:{
        id:'',
        teacher_id:'',
        senate_id:[],
      },      
    
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      totalCount: 20
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    clearFileFun() {
      this.changeDialogFile = false;
    },
   // 上传课程资料
    marksureFileFun(arr) {
      console.log(arr);
      this.fileLoadData.filearr = arr;
      // this.addData.filearr = arr;
      _request.http(this, "uploadLiveClassChild", this.fileLoadData).then(res => {
        if (res.code == 200) {
          // this.getLiveClassList();
        } else {
          alert(res.msg);
        }
      });
    },
    //上传资料按钮
    uploadFileFun(id) {
      this.fileLoadData.parent_id = id;
      // 获取已经上传的资料
      _request
        .http(this, "getLiveClassMaterial", { parent_id: id })
        .then(res => {
          if (res.code == 200) {
            this.transFile = res.data.LiveClass_list_child_Material;            
            this.changeDialogFile = true;
            console.log(this.transFile);
          }
        });
    },
    selDate() {
      this.$refs.selTime.focus();
    },
    markSureDialog(teacher,senateArr) {
        _request
          .http(this, "teacherLiveChild", {
            class_id: this.transClassId.id,
            teacher_id: teacher,
            senate_id: senateArr
          })
          .then(res => {
            if (res.code == 200) {
              // this.showDialog = false;

              this.relateTeacher = false;

              this.initData();
            }
          });


      // this.relateTeacher = false;

      // this.initData();
    },
    closeDialog() {
      this.relateTeacher = false;
    },
    
    // 添加班号
    addClassNum() {
      this.showDialog = true;
      this.addData.id = "";
      this.$refs.addData && this.$refs.addData.resetFields();
    },
    recommendTeacher(id) {
      _request
        .http(this, "teacher/doRecommendTeacher", { teacher_id: id })
        .then(res => {
          if (res.code == 200) {
          }
        });
    },
    goback() {
      // this.$emit("classCloseFun");
      this.$router.go(-1);
    },
    itemRelatedTeacher(item) {
      this.relateTeacher = true;
      this.transClassId ={
        id:item.id,
        teacher_id: item.teacher_id,
        senate_id:item.senate_id
      }
      
    },
    // 列表中发布
    doPost(id,teacher){
      // 必须绑定老师
      if(teacher){
       _request.http(this, "creationLive", { class_id: id }).then(res => {
            if (res.code == 200) {
              this.$toast('发布成功');
              this.initData();
            } else {
              this.$toast(res.msg);
            }
          });
      }else{
         this.$toast('发布前请先关联教师');
        return;
      }
      
    },
    doPosted(){
      this.$toast('已经发布成功')
    },
    // 删除
    delClass(id) {
      console.log(id);
      this.$confirm("删除该课次, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request.http(this, "deleteLiveChild", { id: id }).then(res => {
            if (res.code == 200) {
              this.initData();
            } else {
              alert(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    // 修改课次
    updateClass(id) {
      this.showDialog = true;
      _request.http(this, "liveChildShowOne", { id: id }).then(res => {
        if (res.code == 200) {
          this.addData = res.data;
        } else {
          alert(res.msg);
        }
      });
    },
    addResource(form) {
      //  添加资源
      this.addData = {
        id: "",
        name: "",
        description: "",
        subject_id: []
      };
      this.showDialog = true;
      // this.$refs.addData.resetFields();
    },
    dialogMarksure() {
      // addData
       this.$refs.addData.validate(valid => {
        if (valid) {
          if (this.addData.id) {
        // 修改
        _request.http(this, "updateLiveChild", this.addData).then(res => {
          if (res.code == 200) {
            this.showDialog = false;
            this.initData();
          }
        });
      } else {
        _request.http(this, "liveChild/add", this.addData).then(res => {
          if (res.code == 200) {
            this.showDialog = false;
            this.addData.id = "";
            this.initData();
          }
        });
      }

        }
       })
      
    },
    
    initData() {
      _request
        .http(
          this,
          "liveChildList",
          { shift_no_id: this.$route.query.id },
          this.cur
        )
        .then(res => {
          this.dataList = res.data.LiveClassChild_list;
          this.totalCount = res.data.total;
        });
    },

    //每页
    handleSizeChange(val) {
      this.cur.pagesize = val;
      this.initData();
    },
    //第几页
    handleCurrentChange(val) {
      this.cur.page = val;
      this.initData();
    }
  }
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
    display: inline-block;
    width: 200px;
  }
  .keshiMess {
    display: inline-block;
    width: 150px;
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