<template>
  <div class="courses-auth">
    <el-dialog
      class="courses-auth-dialog"
      title="课程授权"
      :close-on-click-modal="false"
      :visible.sync="CoursesAuth"
      width="980px"
      :append-to-body="true"
      @close="close()"
    >
      <div class="head">
        <el-select
          v-model="searchData.parentid"
          class="middle"
          value-key="id"
          placeholder="请选择学科"
          @change="selxuekeFun"
          style="width:180px;"
        >
          <el-option
            v-for="item in subjectArr"
            :key="item.id"
            :label="item.subject_name"
            :value="item"
          />
        </el-select>
        <el-select
          v-model="searchData.childid"
          class="middle"
          value-key="id"
          placeholder="请选择学科小类"
          @change="selxiaoleiFun"
          style="width:180px;"
        >
          <el-option
            v-for="item in xiaoleiArr"
            :key="item.id"
            :label="item.subject_name"
            :value="item"
          />
        </el-select>
        <div class="search">
          <el-input
            class="middle"
            placeholder="请输入课程名称"
            v-model="searchData.search"
            prefix-icon="el-icon-search"
          ></el-input>
          <el-button type="primary" @click="search()">搜索</el-button>
        </div>
        <el-checkbox class="auth-checked" v-model="searchData.is_show" @change="authCheck">仅展示当前关联的课程</el-checkbox>
      </div>
      <div class="list-table">
        <el-table
          ref="lessonTable"
          :data="lessonList"
          border
          stripe
          width="100%"
          :height="500"
          @select-all="selectAll"
          class="table-top-border"
           @row-click = 'handleSelectionChange'
          @selection-change="handleSelectionChange"
        >
          <el-table-column :reserve-selection="true" type="selection" width="50" />
          <el-table-column
            label-class-name="tab-tit"
            prop="title"
            label="课程名称"
            min-width="120"
            align="left"
          />
          <el-table-column
            label-class-name="tab-tit"
            prop="method[0]"
            label="类型"
            min-width="70"
            align="center"
          />
          <el-table-column
            prop="subjectNameOne"
            label-class-name="tab-tit"
            label="学科名称"
            min-width="150"
            align="center"
          />
          <el-table-column
            prop="subjectNameTwo"
            label-class-name="tab-tit"
            label="学科小类名称"
            min-width="150"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="clear-btn" @click="close()">取 消</el-button>
        <el-button type="primary" class="sub-btn" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _request from "@/utils/request";
export default {
  // inject: ["schoolSelf"],
  props:['transDataAuth','showCoursesAuth'],
  data() {
    return {
      authChecked: false,
      searchValue: "",
      searchData: {
        parentid:'',
        childid: '',
        search: "",
        schoolid: '',
        // is_public: 0,
        gettotal:1,
        // is_show:0
      },
      selxuekeIndex: 0,
      subject: "",
      subjectArr: [{ id: 0, subject_name: "全部", childs: [] }],
      xiaolei: "",
      xiaoleiArr: [{ id: 0, name: "全部" }],
      lessonList: [],
      authList: [],
      addAuthList: [],
      CoursesAuth:false,
      selRow:{},
    };
  },
  mounted() {    
    this.CoursesAuth = this.showCoursesAuth;
    this.searchData.schoolid = this.transDataAuth.school_id;
    this.getSubjectList();
    this.initData();
    this.$nextTick(() => {
      this.authLesson();
    });
    
  },
  methods: {
    selectAll(val) {
      if (val.length == 0) {
        this.authChecked = false;
      }
    },
    close() {
      this.$emit('close');
    },
    submit() {
      _request
        .http(this, "courschool/courseStore", {
          course_id: this.addAuthList,
          school_id: this.transDataAuth.school_id,
          is_public: 0
        })
        .then(res => {
          this.$emit('marksure');
          this.$message({
              showClose: true,
              message: res.msg,
              type: "success"
            });
          
        })
        .catch(err => {
          // if (err.code == 202) {
          //   this.$message({
          //     showClose: true,
          //     message: err.msg,
          //     type: "success"
          //   });
          // } else {
          //   this.$message({
          //     showClose: true,
          //     message: "添加失败，请重试",
          //     type: "error"
          //   });
          // }
        });
    },
    authCheck(val) {
      if (val) {
        this.authList.forEach(val => {
          console.log(val);
          this.$refs.lessonTable.toggleRowSelection(
            this.lessonList.find(item => {
              return val == item.id;
            }),
            true
          );
        });
      } else {
        this.authList.forEach(val => {
          this.$refs.lessonTable.toggleRowSelection(
            this.lessonList.find(item => {
              return val == item.id;
            }),
            false
          );
        });
      }
    },
    search() {
      this.initData();
    },
    selxuekeFun(item) {
      this.searchData.parentid = item.id;
      this.selxuekeIndex = item.id;
      _request
        .http(this, "courschool/getNatureSubjectByid", {
          subjectOne: item.id
        })
        .then(res => {
          this.xiaoleiArr = [{ id: 0, subject_name: "全部" }];
          this.xiaoleiArr = this.xiaoleiArr.concat(res.data);
          this.initData();
        });
    },
    selxiaoleiFun(item) {
      if (item.id != 0) {
        this.searchData.childid = item.id;
      } else {
        this.searchData.childid = 0;
      }
      this.initData();
    },
    handleSelectionChange(row,index) {
      // this.addAuthList = val.map(item => item.id);
      this.selRow = {};
      this.selRow = row;
    },
    getSubjectList() {
      _request
        .http(this, "courschool/getNatureSubjectList", {
          school_id: this.transDataAuth.school_id,
          is_public: 0
        })
        .then(res => {
          this.subjectArr = this.subjectArr.concat(res.data);
        });
    },
    initData() {
      _request
        .http(this, "service/stock/courseIndex", this.searchData)
        .then(res => {
          this.authChecked = false;
          this.lessonList = res.data; 
          // this.totalCount = res.data.total
        });
    },
    authLesson() {
      _request
        .http(this, "courschool/courseIdList", {
          school_id: this.transDataAuth.school_id,
          is_public: 0
        })
        .then(res => {
          this.authList = res.data.ids;
        });
    }
  }
};
</script>
<style lang="less">
.courses-auth-dialog {
  .el-select-dropdown__wrap {
    height: 275px;
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    
  }
}
</style>
<style lang="less" scoped>
.middle {
  margin-right: 20px;
}
.head {
  display: flex;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  .search {
    display: flex;
  }
  .auth-checked {
    position: absolute;
    right: 30px;
    top: 64px;
  }
}
</style>
