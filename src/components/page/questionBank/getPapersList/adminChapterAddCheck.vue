<template>
  <div class="edit-info">
    <el-dialog
      :visible="showModal"
      :close-on-click-modal="false"
      class="edit-dialog"
      title="选择试题"
      width="900px"
      :append-to-body="true"
      @close="close()"
    >
      <div class="edit-form">
        <el-form :model="searchData" label-width="90px" ref="searchData">
          <el-select
            class="sel-width"
            clearable
            @change="getJie"
            placeholder="章"
            v-model="searchData.chapter_id"
          >
            <el-option
              v-for="(item, index) in chapterArr"
              :label="item.name"
              :value="item.chapters_id"
              :key="index"
            ></el-option>
          </el-select>
          <el-select class="sel-width" clearable placeholder="节" v-model="searchData.joint_id">
            <el-option
              v-for="(item, index) in chapterArticleArr"
              :label="item.name"
              :value="item.chapters_id"
              :key="index"
            ></el-option>
          </el-select>
          <el-input
            style="width:200px"
            v-model="searchData.exam_name"
            placeholder="请输入题目名称"
            clearable
          ></el-input>
          <el-button type="primary" @click="searchFun">搜索</el-button>
        </el-form>
        <div class="heng"></div>
        <div class="table-box">
          <el-table
            stripe
            border
            :data="dataList"
            highlight-current-row
            ref="custTable"
            cell-class-name="center"
            @selection-change="handleSelectionChange"
            header-cell-class-name="center"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="exam_content" label="题目" show-overflow-tooltip></el-table-column>
            <el-table-column label="难度" width="120">
              <template slot-scope="scope">
                <span>{{getDifficulty(scope.row.item_diffculty)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="cur.pagesize"
            :total="totalCount"
            :current-page="nextPage"
            layout="total, sizes, prev, pager, next, jumper,slot"
          >
            <el-button class="pagingBtn" size="small">确认</el-button>
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="clear-btn" @click="close()">取 消</el-button>
        <el-button type="primary" class="sub-btn" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import _request from "@/utils/request";
export default {
  props: ["show", "type"],
  computed: {
    ...mapState({
      authority: state => state.question.authority,
      bank_id: state => state.question.bank_id
    })
  },
  data() {
    return {
      routerQuery: this.$route.query,
      searchData: {
        is_publish: "2",
        type: this.type,
        bank_id: this.$store.state.question.bank_id,
        subject_id: this.$store.state.question.subject_id,
        chapter_id: "",
        joint_id: "",
        exam_name: ""
      },
      chapterArticleArr: [],
      chapterArr: [],
      dataList: [],
      checkList: [],
      cur: {
        pagesize: 10,
        page: 1
      },
      nextPage: 1,
      totalCount: 0
    };
  },
  watch: {
    type(val) {
      this.searchData.type = val;
    },
    showModal(val) {
      if (val) {
        this.initData();
      }
    }
  },
  computed: {
    showModal() {
      return this.show;
    }
  },
  created() {
    this.getChaptersSelectList();
  },
  methods: {
    getDifficulty(value) {
      if (value == 1) {
        return "简单";
      } else if (value == 2) {
        return "一般";
      } else if (value == 3) {
        return "困难";
      }
    },
    close() {
      this.$emit("close");
    },
    submitForm() {
      let list = this.checkList.map(item => {
        item.is_del = "0";
        return item;
      });
      this.$emit("receive", list);
    },
    searchFun() {
      // this.searchData.lession_subject = JSON.stringify(this.lession_subject);
      console.log(this.searchData);
      this.initData();
    },
    // select 多选
    handleSelectionChange(items) {
      this.checkList = items;
    },
    initData() {
      this.searchData.subject_id = this.$store.state.question.subject_id;

      _request
        .http(this, "question/getExamList", this.searchData, this.cur)
        .then(res => {
          this.dataList = res.data.exam_list;
          this.totalCount = res.data.total;
          this.localType = this.searchData.type;
        });
    },
    getChaptersSelectList() {
      _request
        .http(this, "question/getChaptersSelectList", {
          bank_id: this.searchData.bank_id,
          subject_id: this.searchData.subject_id
        })
        .then(res => {
          this.chapterArr = res.data;
          this.initData();
        });
    },
    getJie() {
      var param = {
        bank_id: this.searchData.bank_id,
        subject_id: this.searchData.subject_id,
        chapters_id: this.searchData.chapter_id,
        type: 1
      };
      this.searchData.joint_id = "";
      this.searchData.point_id = "";

      console.log(JSON.stringify(this.searchData.chapter_id));
      _request.http(this, "question/getChaptersSelectList", param).then(res => {
        this.chapterArticleArr = res.data;
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
<style lang="less" scoped>
.sel-width {
  width: 170px;
}
.edit-form {
  padding: 10px 30px 20px 30px !important;
  color: #606266;
  line-height: 24px;
  font-size: 14px;
}
.heng {
  width: 100%;
  margin: 20px 0;
  height: 1px;
  background-color: #e0e0e0;
}
</style>
