<template>
  <div class="container-box">
    <div class="content-head">
      <el-form :model="searchData" :rules="rule" label-width="90px" ref="searchData">
        <div class="type-list">
          <span class="type">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目：</span>
          <div
            class="typeItem"
            v-for="(item,index) in kemuArr"
            :key="index"
            @click="selSubject(item)"
            :class="{typeActive:subject_id == item.subject_id}"
          >{{item.subject_name}}</div>
        </div>
        <div class="type-list">
          <span class="type">试卷类型：</span>
          <div
            class="typeItem"
            v-for="(item,index) in chapterTypeList"
            :key="index"
            @click="selType(item)"
            :class="{typeActive:item.index == selactType}"
          >{{item.name}}</div>
        </div>
        <div class="type-list">
          <span class="type">试卷状态：</span>
          <div
            class="typeItem"
            v-for="(item,index) in shenheArr"
            :key="index"
            @click="selShenhe(item)"
            :class="{typeActive:item.index == selactShenhe}"
          >{{item.name}}</div>
        </div>
        <div class="type-list">
          <span class="type">搜&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;索：</span>
          <el-input
            style="width:200px;margin-left:5px"
            v-model="searchData.papers_name"
            placeholder="试卷名称"
            clearable
          ></el-input>
          <el-button type="primary" @click="searchFun">搜索</el-button>
        </div>
      </el-form>
      <div class="linear-right-btn" @click="openEdit">添加试卷</div>
    </div>

    <div v-if="dataList && dataList.length>0">
      <div class="con-list">
        <div class="con-item" v-for="(item,index) in dataList" :key="index">
          <div class="con-item-top">
            <div class="top-1">试卷名称</div>
            <div class="top-2">
              <span>考试时间：{{item.papers_time}}分钟</span>
              <span>试卷分数：{{item.exam_sum_score}}分</span>
            </div>
            <div class="top-3">
              <el-button type="primary" @click="openQusetion(item.papers_id)">选择试题</el-button>
            </div>
          </div>
          <div class="con-item-bottom">
            <div class="con-title">{{item.papers_name}}</div>
            <ul class="con-content">
              <li v-for="(exam_item,index) in item.exam_list" :key="index">
                <b>{{exam_item.type}}</b>
                <span
                  v-if="exam_item.type!='简答题'"
                >已选{{exam_item.count}}道{{exam_item.type}}&nbsp;每题{{exam_item.score}}分&nbsp;总分{{exam_item.sum_score}}分</span>
                <span
                  style="    width: 200px;
    display: inline-block;
    text-align: left;"
                  v-else
                >已选{{exam_item.count}}道{{exam_item.type}}</span>
              </li>
            </ul>
            <div
              class="con-zhuangtai"
              v-if="item.is_publish"
              @click="publicChange(item.papers_id,0)"
            >已发布</div>
            <div class="con-zhuangtai weifabu" v-else @click="publicChange(item.papers_id,1)">未发布</div>
            <div class="con-oprrate">
              <el-button type="info" @click="deleteItem(item.papers_id)">删除</el-button>
              <el-button type="success" @click="updateFun(item.papers_id)">编辑</el-button>
            </div>
          </div>
        </div>
      </div>

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
    <div v-else class="nodata">暂时没有数据</div>
    <adminChapterAdd
      :show="showEdit"
      @close="closeEdit"
      @refresh="refreshEdit"
      :searchData="searchData"
      :editData="editData"
    ></adminChapterAdd>
  </div>
</template>
<script>
import { mapState } from "vuex";
import _request from "@/utils/request";
import adminChapterAdd from "./adminChapterAdd";
export default {
  components: {
    adminChapterAdd
  },
  computed: {
    ...mapState({
      authority: state => state.question.authority,
      bank_id: state => state.question.bank_id,
      subject_id: state => state.question.subject_id
    })
  },
  data() {
    return {
      showEdit: false, //编辑试卷
      editData: {},
      dataList: [],
      searchData: {
        bank_id: this.$store.state.question.bank_id,
        papers_name: "",
        is_publish: "",
        diffculty: "",
        subject_id: this.$store.state.question.subject_id,
        subject_name: ""
      },
      extend_id: "", // 修改时传递id
      kemuArr: [],
      chapterArticleArr: [],
      kaodianArr: [],
      shenheArr: [
        { name: "全部", index: "2" },
        { name: "已发布", index: 1 },
        { name: "未发布", index: 0 }
      ],
      nanduArr: [
        { name: "全部", index: "" },
        { name: "简单", index: 1 },
        { name: "一般", index: 2 },
        { name: "困难", index: 3 }
      ],
      chapterTypeList: [
        { name: "全部", index: "" },
        { name: "真题", index: "1" },
        { name: "模拟题", index: "2" },
        { name: "其他", index: "3" }
      ],
      selactType: 0, //默认选择真题
      selactShenhe: "2", // 审核状态默认选择所有
      kaodian: [],
      rule: {},
      cur: {
        pagesize: 20,
        page: 1
      },
      nextPage: 1,
      totalCount: 20
    };
  },
  created() {
    this.$store.dispatch("disAuthority");
    this.getSubjectList();
  },
  methods: {
    publicChange(exam_id, is_publish) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      let text = is_publish == 1 ? "发布" : "取消发布";
      this.$confirm("是否" + text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.publicAjax(exam_id, text);
      });
    },
    publicAjax(id, text) {
      _request
        .http(this, "question/doPublishPapers", { papers_id: id })
        .then(res => {
          if (res.code == 200) {
            this.initData();
            this.$toast(text + "成功");
          }
        });
    },
    //添加、编辑试题
    openQusetion(id) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      this.$store.commit("papers_id", id);
      this.$router.push("/question/getPapersList/check");
    },
    //添加、编辑试卷
    openEdit() {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      this.$store.commit("papers_id", null);
      this.showEdit = true;
      this.editData = {};
    },
    closeEdit() {
      this.showEdit = false;
    },
    refreshEdit() {
      this.showEdit = false;
      this.initData();
    },
    selSubject(item) {
      this.$store.commit("subject_id", item.subject_id);
      this.$store.commit("setSubject_name", item.subject_name);
      this.searchData.subject_id = this.subject_id;
      this.searchData.subject_name = item.subject_name;
      this.initData();
    },
    selShenhe(item) {
      this.selactShenhe = item.index;
      this.searchData.is_publish = item.index;
      this.initData();
    },
    selType(item) {
      this.selactType = item.index;
      this.searchData.diffculty = item.index;
      this.initData();
    },
    getSubjectList() {
      _request
        .http(this, "question/getSubjectList", { bank_id: this.bank_id })
        .then(res => {
          this.kemuArr = res.data;
          if (!this.subject_id) {
            this.searchData.subject_id = res.data[0].subject_id;
            this.searchData.subject_name = res.data[0].subject_name;
            this.$store.commit("subject_id", res.data[0].subject_id);
            this.$store.commit("setSubject_name", res.data[0].subject_name);
          }

          this.initData();
        });
    },
    searchFun() {
      console.log(this.searchData);
      this.initData();
    },
    initData() {
      _request
        .http(this, "question/getPapersList", this.searchData, this.cur)
        .then(res => {
          this.dataList = res.data.papers_list;
          // this.dataList = [{}];
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
    },
    updateFun(id) {
      let pararm = {
        papers_id: id
      };
      this.$store.commit("papers_id", id);
      _request.http(this, "question/getPapersInfoById", pararm).then(res => {
        if (res.code == 200) {
          this.editData = res.data;
          this.showEdit = true;
        }
      });
    },
    deleteItem(id) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      this.$confirm("删除该试卷, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delFun(id);
        })
        .catch(() => {});
    },
    delFun(papers_id) {
      _request
        .http(this, "question/doDeletePapers", { papers_id: papers_id })
        .then(res => {
          if (res.code == 200) {
            if (this.cur.page > 1) {
              this.cur.page =
                Math.ceil(this.totalCount - 1) / this.cur.pagesize;
            }
            this.initData();
          } else {
            this.$message.error(res.msg);
          }
        });
    }
  }
};
</script>
<style scoped lang="less">
/deep/ html {
  font-size: calc(100vw / 960 * 100);
}
@itemHeight: 100px;
.type-list {
  font-size: 14px;
  margin-bottom: 15px;
  .type {
    color: rgba(51, 51, 51, 1);
  }
  .typeItem {
    display: inline-block;
    margin: 0 5px;
    height: 28px;
    padding: 0 12px;
    line-height: 28px;
    cursor: pointer;
    color: rgba(102, 102, 102, 1);
  }
  .typeActive {
    height: 28px;
    background: linear-gradient(
      90deg,
      rgba(38, 164, 253, 1),
      rgba(0, 142, 242, 1)
    );
    border-radius: 3px;
    font-size: 14px;
    color: rgba(254, 254, 254, 1);
  }
}
.content-cont {
  position: relative;
  background: #fff;
  box-shadow: 0 0 8px 0px rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  padding: 10px;
}
.linear-right-btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  color: #fff;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 30px 20px;
  font-size: 14px;
  border-radius: 4px;
  padding: 20px;
  background: linear-gradient(to right, #26a4fd, #6b95fd);
}
.linear-right-btn:hover {
  background: linear-gradient(to right, #6b95fd, #26a4fd);
}
.content-head {
  align-items: flex-start;
  padding-top: 20px;
}

.con-list {
  padding: 0 25px;
}
.con-item {
  background: #fff;
  margin: 10px 0;
  box-shadow: 0px 0px 5px 0px rgba(0, 22, 38, 0.1);
  border-radius: 1px;
  .con-item-top {
    display: flex;
    border-bottom: 1px solid #e9e5ea;
    padding: 10px;
    line-height: 32px;
    & > div {
      padding-left: 10px;
    }
    .top-1 {
      flex: 1;
    }
    .top-2 {
      flex: 4;
      & > span {
        display: inline-block;
        width: 33.3%;
      }
    }
    .top-3 {
      width: 200px;
      text-align: right;
    }
  }
  .con-item-bottom {
    display: flex;
    align-items: center;
    height: 130px;
    padding: 15px 0;
    .con-title {
      flex: 1;
      height: 60px;
      line-height: 30px;
      font-size: 16px;
      margin: 0 10px;
      text-align: center;
      overflow: hidden;
      font-weight: bold;
    }
    .con-content {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      height: 100%;
      flex: 4;
      font-size: 14px;
      /*padding: 0 10px;*/
      border-left: 1px solid #e9e5ea;
      overflow: hidden;
      margin-bottom: 0;
      & > li {
        float: left;
        width: 33.3%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        /*text-align: center;*/
        margin: 7px 0;
        padding-left: 10px;
      }
      & > li:nth-child(3n-1) {
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
      }
      & > li:last-child {
        border-right: none;
      }
    }
    .con-zhuangtai {
      height: 100%;
      line-height: @itemHeight;
      width: 70px;
      text-align: center;
      border-left: 1px solid rgba(233, 229, 234, 1);
      border-right: 1px solid rgba(233, 229, 234, 1);
      color: #159700;
      font-size: 14px;
      cursor: pointer;
    }
    .weifabu {
      color: #e60101;
    }
    .con-oprrate {
      height: 100%;
      line-height: @itemHeight;
      padding: 0 15px;
    }
  }
}

.nodata {
  color: #666;
  font-size: 14px;
  text-align: center;
  margin: 20px 0;
  border-bottom: 1px solid #eee;
}
</style>
