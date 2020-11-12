<template>
  <div>
    <div class="container-box" v-if="showList">
      <div class="content-head">
        <span>问答管理</span>
      </div>
      <div class="content-cont">
        <div>
          <div class="listbox" v-for="(item, index) in dataList" :key="index">
            <div class="listItem">
              <div class="item-left">
                <img :src="item.user_icon" alt="" class="itemicon" />
                <div class="itemNickname">{{ item.nickname }}</div>
              </div>

              <div class="item-center">
                <div class="question">
                  <img
                    src="../../../assets/image/operate/start.png"
                    class="top"
                    v-if="item.is_top == 1"
                    alt=""
                  />
                  <div class="item-head">
                    <img
                      src="../../../assets/image/operate/question.png"
                      alt=""
                      class="item_xs"
                    />{{ item.title }}
                  </div>
                  <div class="item-cont">
                    {{ item.content }}
                  </div>
                  <div class="item-footer">
                    <el-row>
                      <el-col :span="4">
                        <img
                          src="../../../assets/image/operate/icon.png"
                          alt=""
                          class="item_xs"
                        />共{{ item.count }}条回复
                      </el-col>
                      <el-col :span="4">
                        <img
                          src="../../../assets/image/operate/answer.png"
                          alt=""
                          class="item_xs"
                        />回答
                      </el-col>
                      <el-col :span="8">
                        <img
                          src="../../../assets/image/operate/icon1.png"
                          alt=""
                          class="item_xs"
                        />提问时间:{{ item.create_at }}
                      </el-col>
                      <el-col :span="8">
                        <img
                          src="../../../assets/image/operate/icon1.png"
                          alt=""
                          class="item_xs"
                        />展示时间:{{ item.update_at }}
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
              <div class="item-right">
                <el-button
                  v-if="item.is_top == 1"
                  type="primary"
                  @click="setTop(item.id, item.is_top)"
                  >置顶</el-button
                >
                <el-button
                  v-else
                  class="defaultBtn"
                  @click="setTop(item.id, item.is_top)"
                  >置顶</el-button
                >

                <el-button
                  v-if="item.is_check == 1"
                  type="success"
                  @click="answerStatus(item.id, item.is_check)"
                  >审核通过</el-button
                >
                <el-button
                  v-else
                  class="defaultBtn"
                  @click="answerStatus(item.id, 1)"
                  >审核通过</el-button
                >
                <el-button
                  v-if="item.is_check == 2"
                  type="danger"
                  @click="answerStatus(item.id, 2)"
                  >审核不通过</el-button
                >
                <el-button
                  v-else
                  class="defaultBtn"
                  @click="answerStatus(item.id, 2)"
                  >审核不通过</el-button
                >
              </div>
            </div>
            <div>
              <div
                class="answer"
                v-for="(subItem, subIndex) in item.reply"
                :key="subIndex"
              >
                <div class="item-left">
                  <img :src="subItem.head_icon" alt="" class="itemicon" />
                  <div class="itemNickname">{{ item.user_name }}</div>
                </div>
                <div class="item-center">
                  <div class="answer-foot">
                    <div class="foote-time">
                      <img
                        src="../../../assets/image/operate/icon1.png"
                        alt=""
                        class="item_xs"
                      />回复时间：{{ item.create_at }}
                    </div>
                    <div class="item-cont">
                      {{ item.content }}
                    </div>
                  </div>
                </div>
                <div class="item-right">
                  <el-button v-if="item.is_check == 1" type="success"
                    >审核通过</el-button
                  >
                  <el-button v-else class="defaultBtn">审核通过</el-button>
                  <el-button v-if="item.is_check == 2" type="danger"
                    >审核不通过</el-button
                  >
                  <el-button v-else class="defaultBtn">审核不通过</el-button>
                </div>
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
    changeStatus(id, status) {
      let text = status == 1 ? "开启" : "关闭";
      this.$confirm(text + "此评论, 是否继续?", text, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request
            .http(this, "article/editCommentToId", { id: id, status: status })
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
        .http(this, "article/getAnswersList", this.searchData, this.cur)
        .then((res) => {
          this.dataList = res.data.list;
          this.totalCount = res.data.total;
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

    // 置顶
    setTop(id, top) {
      let topVal = top == 1 ? 0 : 1;
      _request
        .http(this, "article/editAnswersTopStatus", { id: id, is_top: topVal })
        .then((res) => {
          if (res.code == 200) {
            this.initData();
          }
        });
    },
    // 审核
    answerStatus(id, stauts) {
      console.log(id, status);
      _request
        .http(this, "article/editAnswersStatus", { id: id, is_check: stauts })
        .then((res) => {
          if (res.code == 200) {
            this.initData();
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
};
</script>

<style scoped lang="less">
.listbox {
  padding: 30px 20px;
  background: #ffffff;
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  margin-bottom: 20px;
}
.listItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-left {
  .itemicon {
    width: 88px;
    height: 88px;
    border-radius: 50%;
  }
}
.item-center {
  margin-left: 40px;
  flex: 1;

  .question {
    border-right: 1px solid #eee;
    position: relative;
    .top {
      width: 18px;
      position: absolute;
      left: -20px;
      top: 45px;
    }
  }
}
.answer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 120px;
  .itemicon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
}

.itemNickname {
  font-size: 14px;
  color: #333333;
  margin-top: 4px;
  text-align: center;
}
.item-right {
  width: 310px;
  text-align: right;
  button {
    width: 90px;
  }
}
.item_xs {
  position: relative;
  margin-top: -2px;
  height: 15px;
  margin-right: 4px;
}
.item-head {
  font-size: 18px;
  font-family: Source Han Sans CN;
  font-weight: 500;
  color: #333333;
  height: 18px;
  line-height: 18px;
  margin-bottom: 15px;
  overflow: hidden;
  .item_xs {
    height: 20px;
  }
}
.item-footer {
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #999999;
  height: 15px;
  line-height: 15px;
  margin-top: 20px;
  // .foote-item {
  //   display: inline-block;
  //   width: 150px;
  // }
  .foote-time {
    display: inline-block;
    width: 260px;
  }
}
.answer-foot {
  font-size: 14px;
  font-family: Source Han Sans CN;
  color: #999999;
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
  margin-top: 20px;
  position: relative;
}
.defaultBtn {
  background: #efefef;
}
</style>