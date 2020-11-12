<template>
  <div>
    <div class="container-box" v-if="showList">
      <div class="content-head">
        <span>评论管理</span>
        <el-form :model="searchData" ref="searchData" :inline="true">
          <el-select
            v-model="searchData.school_id"
            placeholder="选择网校"
            @change="schoolChange"
          >
            <el-option
              v-for="(item, index) in schoolArr"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="searchData.status"
            placeholder="评论状态"
            @change="schoolChange"
          >
            <el-option
              v-for="(item, index) in statusArr"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>         
        </el-form>
      </div>
      <div class="content-cont">
        <div>
          <div class="listItem" v-for="(item, index) in dataList" :key="index">
            <div class="item-left">
              <img :src="item.user_icon" alt="" class="itemicon" />
              <div class="itemNickname">{{ item.nickname }}</div>
            </div>

            <div class="item-center">
              <div class="item-head">
                <div>
                  <img
                    src="../../../assets/image/operate/icon1.png"
                    alt=""
                    class="item_xs"
                  />{{ item.create_at }}
                </div>
                <div>
                  <img
                    src="../../../assets/image/operate/icon2.png"
                    alt=""
                    class="item_xs"
                  />网校:{{ item.school_name }}
                </div>
                <div>
                  <img
                    src="../../../assets/image/operate/icon4.png"
                    alt=""
                    class="item_xs"
                  />课程：{{ item.course_name }}
                </div>
               
              </div>
              <div class="item-cont">
                {{ item.content }}
              </div>
            </div>
            <div class="item-right">
              <div v-if="item.status == 0">
                <el-switch
                  v-model="item.status"
                  active-color="#5FB878"
                  inactive-color="#BABABA"
                  :active-value="1"
                  :inactive-value="0"
                  @change='changeStatus(item.id,item.status)'
                >
                </el-switch>
                <span style="color: #bababa">已禁用</span>
              </div>
              <div v-else-if="item.status == 1">
                <el-switch
                  v-model="item.status"
                  active-color="#5FB878"
                  inactive-color="#BABABA"
                  :active-value="1"
                  :inactive-value="0"
                  @change='changeStatus(item.id,item.status)'
                >
                </el-switch>
                <span style="color: #5fb878;">已开启</span>
              </div>
              <div v-else>
                <span style="color:#E60101;">此评论已删除</span>
              </div>
            </div>
          </div>
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
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
export default {
  data() {
    return {
      isAuth: false,
      schoolBranch: [],
      showcate: false,
      showList: this.$store.state.SecHeadClick,
      showAddBox: false,
      searchData: {
        school_id: "",
        status: "",
        search_name: "",
      },
      dataList: [],
      statusArr: [
        { label: "全部", value: 3 },
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 },
      ],
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20,
      },
      nextPage: 1,
      totalCount: 20,

      load: false,
      schoolArr: [],
      typeArr: [],
    };
  },
  mounted() {
    this.initData();
    this.schoolData();
  },
  methods: {
    schoolData() {
      _request.http(this, "schoolLists").then((res) => {
        this.schoolArr = [{ value: 0, label: "全部" }].concat(res.data); //分类
      });
    },
    schoolChange(val) {
      this.initData();
      this.searchData.type_id = "";
      _request
        .http(this, "listType", { school_id: this.searchData.school_id })
        .then((res) => {
          console.log(res);
          this.typeArr = [{ value: 0, label: "全部" }].concat(res.data); //分类
        });
    },
    auditAcess(row) {
      console.log(row);
    },
    changeStatus(id,status) {
     let text = status == 1?'开启':'关闭';
      this.$confirm(text+"此评论, 是否继续?", text, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request
            .http(this, "article/editCommentToId", { id: id ,status:status})
            .then((res) => {
              if (res.code == 200) {                
                this.initData();
              }
            });
        })
        .catch(() => {
          this.initData();
        });
    },
    initData() {
      _request
        .http(this, "article/getCommentList", this.searchData, this.cur)
        .then((res) => {
          this.dataList = res.data.list;
          this.totalCount = res.data.total;
          this.nextPage = parseInt(res.data.page);
        });
    },
    marksureFun() {
      this.showList = true;
      this.showAddBox = false;
      this.initData();
    },
    closeCom() {
      this.showAddBox = false;
      this.showList = true;
    },

    // 推荐老师
    recommendTeacher(id) {
      _request
        .http(this, "teacher/doRecommendTeacher", { teacher_id: id })
        .then((res) => {
          if (res.code == 200) {
          }
        });
    },
    // 启用禁用老师
    forbidTeacher(id) {
      _request
        .http(this, "teacher/doForbidTeacher", { teacher_id: id })
        .then((res) => {
          if (res.code == 200) {
          }
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
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", (data) => {
        this.showList = data;
        this.showAddBox = false;
      });
    },
    "searchData.search_name": {
      handler(newVal, oldVal) {
        let timeout;
        if (this.load) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          this.initData();
          this.load = false;
        }, 500);
      },
    },
  },
};
</script>

<style scoped lang="less">
.listItem {
  background: #ffffff;
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  margin-bottom: 20px;
  padding: 30px 30px 30px 40px;
  display: flex;
  justify-content: space-between;
  // align-items: center;
  .itemicon {
    width: 88px;
    height: 88px;
  }
  .itemNickname {
    font-size: 14px;
    color: #333333;
    margin-top: 4px;
    text-align: center;
  }
  .item-left {
  }
  .item-center {
    margin-left: 40px;
    flex: 1;
  }
  .item-right {
    width: 120px;
    text-align: right;
  }
  .item_xs {
    position: relative;
    margin-top: -2px;
    height: 15px;
    margin-right: 4px;
  }
  .item-head {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #999999;
    height: 15px;
    line-height: 15px;
    margin-bottom: 20px;
  }
  .item-reply {
    .item-reply-head {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #999999;
      height: 15px;
      line-height: 15px;
      margin-top: 30px;
      margin-bottom: 20px;
    }
    .item-reply-cont {
      font-size: 22px;
      color: #333333;
      line-height: 34px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
  .item-cont {
    font-size: 22px;
    color: #333333;
    line-height: 34px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
</style>