<template>
  <!-- 选择关联课程 -->
  <el-dialog title="关联课程" :close-on-click-modal="false" :visible.sync="showVideo" width="80%" min-width="850px" @close="clearFun">
    <div class="form-box" style="width:100%;">
      <el-form :model="search" ref="formBox" :inline="true">
        <el-form-item>
          <el-cascader
            style="width:260px;"
            v-model="search.parent_id"
            collapse-tags
            :options="subjectArr"
            clearable
            placeholder="选择所属学科"
            :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="资源名称" clearable v-model="search.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="initData">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-checkbox
            v-model="search.is_show"
            @change="isShowFun"
            :true-label="1"
            :false-label="0"
          >仅展示当前关联的课程</el-checkbox>
        </el-form-item>
      </el-form>
      <el-table
        stripe
        border
        :data="dataList"
        highlight-current-row
        ref="custTable"
        width="100%"
        cell-class-name="center"
        header-cell-class-name="center"
        height="500px"
        :row-key='getRowKey'
        @row-click = 'handleSelectionChange'
        @selection-change="handleSelectionChange"
      >
        
        <el-table-column :reserve-selection="true" type="selection" width="55"></el-table-column>
        <el-table-column label="课程名称" prop="title"></el-table-column>
        <el-table-column label="学科名称" prop="subject_name"></el-table-column>
        <el-table-column label="学科小类" width="100px" prop="subject_child_name"></el-table-column>
      </el-table>
      <!-- <div class="pagination">
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
      </div>-->
      <div style="text-align:center;margin:20px 0 0;">
        <el-button type="primary" @click="clearFun">取消</el-button>
        <el-button type="primary" @click="markSure">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  props: ["transId", "changeDialogCourse"],
  data() {
    return {
      subjectArr: [],
      search: {
        parent_id: [],
        title: "",
        is_show: 0,
        resource_id: this.transId,
        nature:this.$route.query.nature
      },
      dataList: [],
      showVideo: false,
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      totalCount: 20,
      selItemId: [],
      selRow:{},
    };
  },
  mounted() {
    this.showVideo = this.changeDialogCourse;
    this.initData();
    this.selTeacher();
   
  },

  methods: {
    isShowFun(val){
      console.log(val);
      this.selRow = {};
      this.initData();
    },
    handleSelectionChange(row,index) {
      // console.log(JSON.stringify(row))
      this.selRow = {};
      this.selRow = row;
    },
    getRowKey(row){
      return row.id;
    },
    clearFun() {
      this.$emit("clearFun");
      // this.showVideo = false;
    },
    markSure() {
      // [{"name":"aa","url":"aa.jpg","size":20,"type":1}]
      for(var i=0;i<this.selRow.length;i++){
        this.selItemId.push(this.selRow[i]['id']);
      }
      console.log(JSON.stringify(this.selItemId))
      if (this.selItemId.length) {
        this.$emit("marksureFun", this.selItemId);
      } else {
        this.$toast("请选择关联课程");
      }
    },
    del_file(id) {
      console.log("删除ID：" + id);
    },
    dialogMarksure() {},

    initData() {
      _request.http(this, "lessonList", this.search).then(res => {
        this.dataList = res.data;
        this.selItemId = [];
        this.selRow = {};
        this.dataList.forEach(row => {
          if(row.is_relevance == 1){
            this.$refs.custTable.toggleRowSelection(row);
          }
         
        });
        
      });
    },

    selTeacher() {
      _request.http(this, "subject").then(res => {
        this.subjectArr = res.data;
      });
    }
  }
};
</script>
<style scoped lang="less">
.text-center {
  text-align: center;
}
.foot-btn {
  text-align: right;
  padding: 20px 35px 0 0;
}
</style>
