<template>
  <!-- 选择小节资料 -->
  <el-dialog title="选择资源" :close-on-click-modal="false" :visible.sync="showVideo"  width="80%" min-width='850px' @close="clearFun">
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
          <el-input placeholder="资源名称" clearable v-model="search.resource_name"></el-input>
          </el-form-item>
          <el-form-item>    
          <el-button type='primary' @click="initData"> 查询</el-button>
          </el-form-item>
      </el-form>
      <el-table
        stripe
        border
        :data="dataList"
        highlight-current-row
        ref="custTable"
        width='100%'
        @current-change="handleCurrentRow"
        cell-class-name="center"
        header-cell-class-name="center"
        height="500px"
      >
      <el-table-column label width="35">
        <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="radioId">&nbsp;</el-radio>
          </template>
      </el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="文件名" prop="resource_name"></el-table-column>
        <el-table-column label="大小" prop="resource_size">
          <template slot-scope="scope">
              <div>{{(parseInt(scope.row.resource_size)/1024/1024).toFixed(2)}}MB</div>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" prop='create_at'></el-table-column>
          
      </el-table>
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
      <div style="text-align:center;margin:20px 0 0;">
          <el-button type='primary' @click='clearFun'>取消</el-button>
          <el-button type='primary' @click='openResource'>资源管理</el-button>
          <el-button type='primary' @click='markSure'>确定</el-button>
      </div>

    </div> 
    </el-dialog>
</template>
<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default { 
  props:['transId','changeDialogVideo'],
  data() {
    return {
      subjectArr: [],
      search: {
        parent_id: [],
        resource_name:''
      },
      dataList: [],     
      showVideo:false,
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },      
      nextPage: 1,
      totalCount: 20,
      selVideoItem:{},
      radioId:'',
    };
  },
  mounted(){
    this.showVideo = this.changeDialogVideo;
    console.log(this.showVideo)
     this.initData();
    this.selTeacher();
    if(this.transId){
      this.radioId = this.transId;
    }
  },
 
  methods: {
    openResource(){
      let isZongKong = this.$store.state.school_status == 1; //总控1 中控0
      // let hrefStr = isZongKong ? "/#/resourceGeneral/generalliveresource": "/#/resources/liveResource";
      let hrefStr = isZongKong ? "/#/resourceGeneral/generalRecordresource":"/#/resources/recordResource";
      let href = window.location.origin + hrefStr;
      window.open(href, "_blank");
    },
    clearFun(){
      this.$emit('clearFun');
      // this.showVideo = false;
    },
    markSure(){
      // [{"name":"aa","url":"aa.jpg","size":20,"type":1}]
      this.$emit('marksureFun',this.selVideoItem.resource_name,this.selVideoItem.id);
    },
    del_file(id) {
      console.log("删除ID：" + id);
    },
    handleCurrentRow(row){
      console.log(row);
      this.selVideoItem = row;
      this.radioId = row.id;

    },
    
    dialogMarksure() {},

    initData() {
      _request.http(this, "video", this.search,this.cur).then(res => {
        this.dataList = res.data.video_list;
        this.totalCount = res.data.total;
      });
    },
    
    selTeacher() {
      _request.http(this, "subject").then(res => {
        this.subjectArr = res.data;
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
.text-center {
  text-align: center;
}
.foot-btn {
  text-align: right;
  padding: 20px 35px 0 0;
}

</style>
