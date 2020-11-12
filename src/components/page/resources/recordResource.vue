<template>
  <div class="cashAudit">
    <div class="container-box" v-if="showList">
      <div class="content-head">
        <div>录播资源</div>
        <el-form :model="search" :rules="rule" ref="search" :inline="true">
          <el-cascader
            style="width:150px;"
            v-model="search.parent_id"
            collapse-tags
            @change="select"
            :options="subjectArr"
            clearable
            placeholder="选择所属学科"
            :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
          ></el-cascader>
          <el-select
            v-model="search.nature"
            @change="select"
            style="width:150px"
            placeholder="选择资源属性"
          >
            <el-option
              v-for="(item, index) in natureArr"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-select
            v-model="search.resource_type"
            @change="select"
            style="width:150px"
            placeholder="选择资源类型"
          >
            <el-option
              v-for="(item, index) in resource_typeArr"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-select
            v-model="search.status"
            @change="select"
            style="width:150px"
            placeholder="选择状态"
          >
            <el-option
              v-for="(item, index) in schoolBranch"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-input
            v-model="search.resource_name"
            prefix-icon="el-icon-search"
            placeholder="资源名称/id"
            clearable
            style="width:200px;"
          ></el-input>
          <!-- <el-form-item>
            <el-button type="primary">批量导入</el-button>
          </el-form-item>-->
          <el-form-item>
            <el-button @click="addResource" type="primary">+ 添加资源</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content-cont">
        <el-table
          :data="cashAuditData"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
        >
          <el-table-column prop="id" label="ID" width="60"></el-table-column>
          <el-table-column prop="resource_name" label="资源名称" min-width="160"></el-table-column>
          <el-table-column prop="subject_name" label="所属学科"></el-table-column>
          <el-table-column label="资源属性">
            <template slot-scope="scope">
              <div v-text="scope.row.nature == 2?'授权':'自增'"></div>
            </template>
          </el-table-column>
          <el-table-column label="资源类型">
            <template slot-scope="scope">
              <div
                v-text="scope.row.resource_type == 1?'视频': scope.row.resource_type ==2?'音频':scope.row.resource_type ==3?'课件':'文档'"
              ></div>
            </template>
          </el-table-column>
          <el-table-column prop="resource_size" label="大小">
            <template slot-scope="scope">
              <div>{{(parseInt(scope.row.resource_size)/1024/1024).toFixed(2)}} MB</div>
            </template>
          </el-table-column>
           <el-table-column prop="audit" label="上传状态"></el-table-column>

          <el-table-column prop="create_at" label="上传时间" min-width="150"></el-table-column>
          <!-- <el-table-column prop="status" label="状态"></el-table-column> -->
          <el-table-column prop="errorDesc" label="操作" width="220px">
            <template slot-scope="scope">
              <el-button type="danger" @click="delItem(scope.row.id)">删除</el-button>
              <el-button
                type="warning"
                size="mini"
                @click="DisableItem(scope.row.id,scope.row.status)"
              >{{scope.row.status == 0? '启用':'禁用'}}</el-button>
              <el-button type="primary" @click="updateItem(scope.row.id)">编辑</el-button>
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
    </div>
    <Modal
      width="60%"
      min-idth="660px"
      :show="showAddBox"
      :title="transId?'录播资源修改':'录播资源添加'"
      @close="closeCom"
    >
      <record-add
        v-if="showAddBox"
        @closeFun="closeCom"
        @successClose="marksureFun"
        :transId="transId"
      ></record-add>
    </Modal>
  </div>
</template>
<script>
import axios from "axios";
import Modal from "@/components/business/Modal";
import _request from "@/utils/request";
import constants from "@/utils/constants";
import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
import { checkCharacters, rightNumber } from "@/utils/rules";
import recordAdd from "./recordResourceAdd";
export default {
  components: {
    Modal,
    recordAdd
  },
  data() {
    return {
      schoolBranch: [
        { label: "全部", value: "3" },
        { label: "启用", value: "0" },
        { label: "禁用", value: "1" }
      ],
      natureArr: [
        { label: "全部", value: 3 },
        { label: "授权", value: 2 },
        { label: "自增", value: 1 }
      ],
      showList: this.$store.state.SecHeadClick,
      showAddBox: false,
      showcate: false,
      transId: "",
      showDialog: false,
      subjectArr: [], //课程列表
      resource_typeArr: [
        { label: "全部", value: "0" },
        { label: "视频", value: "1" },
        { label: "音频", value: "2" },
        { label: "课件", value: "3" },
        { label: "文档", value: "4" }
      ],
      fileUploadPath: this.GLOBAL.postImgUrl,
      setHead: this.GLOBAL.setHead(),
      search: {
        nature: "",
        parent_id: [],
        resource_type: "",
        schoolB: "",
        status: "",
        resource_name: "",
        orderNumber: "",
        payNo: ""
      },
      load:false,
      timeout:null,
      cashAuditData: [], 
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      totalCount: 20,
      rule: {
        orderNo: [
          {
            validator: checkCharacters,
            validator: rightNumber,
            trigger: "blur"
          }
        ]
      }
      // uploader: null,
      // MD5_KEY: null
    };
  },
  created() {
    this.initData();
    this.selTeacher();
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", data => {
        this.showList = data;
        this.showAddBox = false;
      });
    },
    "search.resource_name": {
      handler(newVal, oldVal) {
        if(!this.load){
          clearTimeout(this.timeout)
        }     
        this.timeout = setTimeout(()=>{
              this.initData();
              this.load = false
        },500)       
      }
    }
  },
  mounted() {},
  methods: {
    marksureFun() {
      this.showList = true;
      this.showAddBox = false;
      this.initData();
    },
    closeCom() {
      this.showAddBox = false;
      this.showList = true;
    },

    addResource() {
      //  添加资源
      this.showList = true;
      this.showAddBox = true;                                                                                                    
      this.transId = "";
    },
    // 删除
    delItem(id) {
      this.$confirm("删除该直播课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request.http(this, "deleteVideo", { id: id }).then(res => {
            if (res.code == 200) {
              if (this.cur.page > 1) {
                this.cur.page =
                  Math.ceil(this.totalCount - 1) / this.cur.pagesize;
              }
              this.initData();
            } else {
              alert(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    DisableItem(id, status) {
      var text = status == 0 ? "禁用" : "启用";
      this.$confirm(text + "该直播课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request.http(this, "updateVideoStatus", { id: id }).then(res => {
            if (res.code == 200) {
              this.initData();
            } else {
              alert(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    updateItem(id) {
      this.showList = true;
      this.showAddBox = true;
      this.transId = id;
    },

    selTeacher() {
      _request.http(this, "subject").then(res => {
        this.subjectArr = res.data;
      });
    },

    initData() {
      _request.http(this, "video", this.search, this.cur).then(res => {
        this.cashAuditData = res.data.video_list;
        this.totalCount = res.data.total;
        this.nextPage = parseInt(res.data.page);
      });
    },
    select() {
      this.cur.page = 1;
      this.$nextTick(() => {
        this.initData();
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
.cashAudit {
  height: 100%;
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ebebeb;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
  height: 45px;
  line-height: 45px;
  padding: 0 16px 0 24px;
  box-sizing: border-box;
  .pin {
    cursor: pointer;
    color: #444444;
  }
}
.text-color {
  color: black;
}
.btn {
  display: inline-block;
}
.btn:last-child {
  margin-right: 10px;
}
.input-width-150 {
  width: 96px;
}
</style>