<template>
  <div class="cashAudit">
    <div class="container-box" v-if="showList">
      <div class="content-head">
        <span>文章管理</span>
        <div></div>
        <el-form :model="payment" ref="payment" :inline="true">
          <el-select v-model="order.school_id" placeholder="选择网校" @change="schoolChange">
            <el-option
              v-for="(item, index) in schoolArr"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="order.type_id" clearable placeholder="选择分类" @change="initData">
            <el-option
              v-for="(item, index) in typeArr"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-form-item>
            <el-input placeholder="文章名称/ID" prefix-icon="el-icon-search" v-model="order.title"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="articleCate">分类管理</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="artileadd=true;paramData = '';">+ 添加文章</el-button>
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
          <el-table-column prop="id" label="id" title="id" width="100"></el-table-column>
          <el-table-column prop="title" label="文章名称" title="文章名称"></el-table-column>
          <el-table-column prop="typename" label="所属分类" title="所属分类"></el-table-column>
          <el-table-column prop="name" label="所属网校" title="所属网校"></el-table-column>
          <el-table-column prop="username" label="创建人" title="创建人"></el-table-column>
          <el-table-column prop="create_at" label="上传时间" title="上传时间"></el-table-column>
          <el-table-column label="推荐">
            <template slot-scope="scope">
              <el-switch
                :width="55"
                v-model="scope.row.is_recommend"
                @change="recommend(scope.row.id)"
                active-color="#00cc00"
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
                inactive-color="#ddd"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" title="状态">
            <template slot-scope="scope">
              <el-switch
                :width="55"
                v-model="scope.row.status"
                @change="changeStatus(scope.row.id)"
                active-color="#00cc00"
                :active-value="1"
                :inactive-value="2"
                active-text="启用"
                inactive-text="禁用"
                inactive-color="#ddd"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="errorDesc" label="操作" title="操作" width="160">
            <template slot-scope="scope">
              <el-button type="delete" @click="articleDetail(scope.row.id)">删除</el-button>
              <el-button type="primary" @click="articleShow(scope.row.id)">编辑</el-button>
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
          :page-size="cur.pageSize"
          :total="totalCount"
          :current-page="nextPage"
          layout="total, sizes, prev, pager, next, jumper,slot"
        >
          <el-button class="pagingBtn" size="small">确认</el-button>
        </el-pagination>
      </div>
    </div>
    <Modal width='80%' min-idth="860px" :show="artileadd" :title="paramData?'文章修改':'文章添加'" @close="closeAddBox">
      <artile-add
      v-if="artileadd"
      @closeAdd="closeAddBox"
      @successClose="marksureFun"
      @gotoTypePage="gotoTypePage"
      :tranData="paramData"
    ></artile-add>
    </Modal>
    
  </div>
</template>
<script>
import _request from "@/utils/request";
import constants from "@/utils/constants";
import Modal from "@/components/business/Modal";
import artileAdd from "./articleAdd";
import { checkCharacters, rightNumber } from "@/utils/rules";

export default {
  components: {
    Modal,
    "artile-add": artileAdd,
  },
  data() {
    return {
      load: false,
      paramData: "",
      schoolBranch: [],
      showList: this.$store.state.SecHeadClick,
      showcate: false,
      artileadd: false,
      artileup: false,
      startpickerOptions: {
        disabledDate: time => {
          if (this.creatTimes[1]) {
            return time.getTime() > this.creatTimes[1];
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      },
      pickerOptions: {
        disabledDate: time => {
          if (this.creatTimes[0]) {
            return (
              time.getTime() < this.creatTimes[0] ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      },
      payment: {
        status: "",
        userNameOrPhoneNo: "",
        payNo: ""
      },
      //删除,或者禁用启用条件  传id
      delid: {
        id: ""
      },
      tableHeight: null,
      schoolArr: [],
      typeArr: [],
      //条件复现
      wherename: {
        school_name: "",
        type_name: ""
      },
      //传输条件
      order: {
        school_id: "",
        type_id: "",
        title: ""
      },
      cashAudit: {
        subject_id: "1",
        userNameOrPhoneNo: "",
        status: ""
      },
      cashAuditData: [],
      selectBox: {
        payType: [],
        repaymentWay: constants.repaymentWay,
        status: constants.status,
        status: [],
        startApplyTime: "",
        endApplyTime: ""
      },
      paginationShow: true,
      cur: {
        pageSize: 20, //每页显示条数
        page: 1 //页数
      },
      nextPage: 1,
      totalCount: 0
    };
  },
  created() {
    this.initData();
    this.schoolData();
  },
  methods: {
    articleCate(){
      this.$router.push('/operate/articleAdmin/artileCate');
    },
    //编辑
    articleShow(val) {
      this.paramData = val;
      this.showList = true;
      this.showcate = false;
      this.artileadd = true;
    },
    schoolData() {
      _request.http(this, "schoolLists").then(res => {
        this.schoolArr = [{ value: 0, label: "全部" }].concat(res.data); //分类
      });
    },
    //学校下拉框修改
    schoolChange(val) {
      this.initData();
      this.order.type_id = "";
      _request
        .http(this, "listType", { school_id: this.order.school_id })
        .then(res => {
          console.log(res);
          this.typeArr = [{ value: 0, label: "全部" }].concat(res.data); //分类
        });
    },

    //分类下拉框修改
    typeChange(val) {
      this.order.type_id = val;
      this.initData();
    },
    closeAddBox() {
      this.showList = true;
      this.artileadd = false;
    },
    marksureFun() {
      this.showList = true;
      this.artileup = false;
      this.artileadd = false;
      this.initData();
    },
    gotoTypePage() {
      this.showList = false;
      this.artileup = false;
      this.artileadd = false;
      this.showcate = true;
      this.initData();
    },
    closeUpBox() {
      this.showList = true;
      this.artileup = false;
    },
    initData() {
      _request
        .http(this, "article/getArticleList", this.order, this.cur)
        .then(res => {
          this.cashAuditData = res.data;
          this.totalCount = res.page.total; //总条数
          this.cur.pageSize = parseInt(res.page.pageSize); //每页条数
          this.cur.page = res.page.page;
          this.nextPage = parseInt(res.page.page);
        });
    },
    //每页
    handleSizeChange(val) {
      this.cur.pageSize = val;
      this.initData();
    },
    //第几页
    handleCurrentChange(val) {
      this.cur.page = val;
      this.initData();
    },
    //删除(val  id)
    articleDetail(val) {
      //弹框处理
      console.log(val);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.delid.id = val;
          _request
            .http(this, "article/editDelToId", this.delid, this.cur)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              if (this.cur.page > 1) {
                this.cur.page =
                  Math.ceil(this.totalCount - 1) / this.cur.pagesize;
              }
              this.initData();
              console.log(res);
            });
        })
        .catch(() => {});
    },
    //启用或禁用弹框
    changeStatus(val) {
      this.delid.id = val;
      _request.http(this, "article/editStatusToId", this.delid).then(res => {
        this.initData();
      });
    },
    // 推荐
    recommend(id) {
      _request.http(this, "article/recommendId", { id: id }).then(res => {
        this.initData();
      });
    }
  },
  watch: {
    "order.title": {
      handler(newVal, oldVal) {
        let timeout;
        if (this.load) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          this.initData();
          this.load = false;
        }, 500);
      }
    },
    showList() {
      this.$bus.$on("clickSecHead", data => {
        this.showList = data;
        this.showcate = false;
        this.artileadd = false;
        this.artileup = false;
      });
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
