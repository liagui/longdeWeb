<template>
  <!-- 关联老师模态框 -->
  <el-dialog
    title="复制课程"
    :close-on-click-modal="false"
    :visible.sync="transData.showDialog"
    width="80%"
    @close="cancelFun"
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
            @change="select"
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
            v-model="searchData.course_title"
            placeholder="讲师名称"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          :data="dataList"
          stripe
          border ref="dataTable"
          cell-class-name="center"
          highlight-current-row
          header-cell-class-name="center"
          @current-change="selCurrentChange"
        >
        <el-table-column label width="35">
        <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="selCourseId">&nbsp;</el-radio>
          </template>
      </el-table-column>
          <el-table-column prop="title" label="课程名称"></el-table-column>
          <el-table-column prop="parent_name" label="学科"></el-table-column>
          <el-table-column prop="child_name" label="小类"></el-table-column>
          <el-table-column prop="method_name" label="课程类型"></el-table-column>

        </el-table>
         <div class="pagination">
          <el-pagination
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
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelFun">取 消</el-button>
      <el-button type="primary" @click="dialogMarksure">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import _request from "@/utils/request";
import { testPostImage } from "@/utils/index.js";
import quillEditorCom from "./../../ueditorCom/comEditor";
import bus from "@/components/common/bus";
import {
  checkEnACharac3,
  rightNumber3,
  rightNumber,
  numAndDecimals2,
} from "@/utils/rules";

export default {
  data() {
    return {
      dataList:[],
      currentRow:{id:''},
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
      courseUpdate: false,
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20,
      },
      nextPage: 1,
      totalCount: 0,
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
      searchData: {
        course_title: "",
        
      },
      parent_id: [],
      load: false,
      timeout:null,
      selCourseId: '',
    };
  },
  props:['transData'],
  mounted() {
    this.getSubjectList();
    this.initData();    
  },
  watch: {
    "searchData.course_title": {
      handler(newVal, oldVal) {        
        if (!this.load) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.currentRow = {id:''};
          this.initData();
          this.load = false;
        }, 500);
      },
    },
  },
  components: {
    // quillEditor
    "quill-editors": quillEditorCom,
  },
  methods: {
    selCurrentChange(val){
      console.log('选择的课程:'+JSON.stringify(val))
      this.currentRow = val;
      this.selCourseId = val.id;
    },
    select() {
      this.currentRow = {id:''};
      this.initData();
    },

    beforeAvatarUpload(file) {
      return testPostImage(file);
    },
    initData() {
      _request
        .http(this, "course/getCopyCourseInfo", this.searchData)
        .then((res) => {
          this.dataList = res.data.list;
          this.totalCount = res.data.total;
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
      this.$emit('marksure',this.selCourseId)
    },
    cancelFun() {
      this.$emit("closeFun");
    },
    // 添加或修改
    marksureFun() {
      var teacherIds = [];
     
      this.$refs.addData.validate((valid) => {
        if (valid) {
          if (this.transId) {
            // 修改
            // if(this.nature == 1){
            //   this.$message.error('此课程是授权课程不能修改');
            //   return;
            // }
            _request
              .http(this, "course/courseUpdate")
              .then((res) => {
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
            _request
              .http(this, "course/courseAdd")
              .then((res) => {
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
      _request.http(this, "subject").then((res) => {
        this.subjectArr = res.data;
      });
    },
    getDetail() {
      _request
        .http(this, "", {
          id: this.transId,
          nature: this.$route.query.is_nature,
        })
        .then((res) => {
          if (res.code == 200) {
            
          }
        });
    },
    handleSizeChange(val) {
      this.cur.pagesize = val;
      this.initData();
    },
    //第几页
    handleCurrentChange(val) {
      this.cur.page = val;
      this.initData();
    },
    
  },
};
</script>
<style scoped lang="less">
// /deep/ .el-table__body tr.current-row>td,
// /deep/ .el-table--striped .el-table__body tr.el-table__row--striped.current-row td{
//   background: #82bbf9 !important;
// }
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
