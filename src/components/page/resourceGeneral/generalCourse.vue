<template>
  <div class="container-box">
    <div class="clearfix" v-if="showList">
      <div class="kecheng-box">
        <div class="search-box">
          <div class="type-list">
            <div class="typeName">
              学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;科：
            </div>
            <div class="typeList">
              <div
                class="typeItem"
                v-for="(item, index) in subjectArr"
                @click="selxuekeFun(item)"
                :class="{ typeActive: selxuekeIndex == item.id }"
                :key="index"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="type-list">
            <div class="typeName">学科小类：</div>
            <div class="typeList">
              <div
                class="typeItem"
                v-for="(item, index) in xiaoleiArr"
                @click="selxiaoleiFun(item)"
                :class="{ typeActive: selxiaoleiIndex == item.id }"
                :key="index"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="type-list">
            <div class="typeName">
              类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：
            </div>
            <div class="typeList">
              <div
                class="typeItem"
                v-for="(item, index) in leixingArr"
                :key="index"
                @click="selLeixingFun(item)"
                :class="{ typeActive: selleixingIndex == item.id }"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="type-list">
            <div class="typeName">
              状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：
            </div>
            <div class="typeList">
              <div
                class="typeItem"
                v-for="(item, index) in fabuArr"
                :key="index"
                @click="selfabuFun(item)"
                :class="{ typeActive: selfabuIndex == item.id }"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="type-list">
            <div class="typeName">
              属&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;性：
            </div>
            <div class="typeList">
              <div
                class="typeItem"
                v-for="(item, index) in authArr"
                :key="index"
                @click="selauthFun(item)"
                :class="{ typeActive: selauthIndex == item.id }"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- 列表数据 -->
        <div class="clearfix">
          <div class="addBox" @click="changeShowBox(0)">
            <div class="add-content">
              <i class="el-icon-circle-plus"></i>
            </div>
          </div>
          <div class="kechengs" v-for="(item, index) in payInfos" :key="index">
            <div class="classStatus">
              <div
                v-if="item.status == 0"
                @click="changeStatus(item.id, item.nature, 1)"
                class="grey"
              >
                未发布
              </div>
              <div
                v-else-if="item.status == 1"
                @click="changeStatus(item.id, item.nature, 2)"
                class="primary"
              >
                在售
              </div>
              <div
                v-else
                class="success"
                @click="changeStatus(item.id, item.nature, 1)"
              >
                停售
              </div>
            </div>
            <div class="tuijian active" v-text="item.nature == 0 ? '自增课程' : '授权课程'"></div>
            <!-- <div
              class="tuijian active"
              v-if="item.is_recommend == 1"
              @click="tuijianFun(item.id, item.nature)"
            >
              荐
            </div>
            <div
              class="tuijian"
              v-else
              @click="tuijianFun(item.id, item.nature)"
            >
              荐
            </div> -->
            <img v-if="item.cover" :src="item.cover" class="kecheng-img" alt />
            <img
              v-else
              src="../../../assets/image/defaultImg.png"
              class="kecheng-img"
              alt
            />
            <div class="kecheng-status">
              <span
                class="shangjia"
                v-text="item.nature == 0 ? '自增课程' : '授权课程'"
              ></span>
              <div class="courseStus">
                <span
                  v-for="(itemsub, index) in item.method"
                  class="status"
                  :key="index"
                  @click="changeShowBox(itemsub.method_id, item)"
                  >{{ itemsub.method_name }}</span
                >

                <!-- <span class="status" v-if="item.method == 3">其他</span> -->
              </div>
            </div>
            <div class="kecheng-detail">
              <div class="kecheng-title">{{ item.title }}</div>
              <div>
                价格：
                <span class="jiage">{{ item.impower_price }}</span>
              </div>
              <div class="shangxian">
                <div class="empower">授权网校</div>
                <!-- <el-button type="primary" @click="empowerSchool(item.id)">授权网校</el-button> -->
              </div>
              <button
                class="seeDetail"
                @click="delCourse(item.id, item.nature)"
              >
                删除
              </button>
              <button
                class="seeDetail"
                @click="editCourse(item.id, item.nature)"
              >
                编辑
              </button>
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
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  data() {
    return {
      isZongKong: this.$store.state.school_status,
      courseAddBox: false,
      showLuboBox: false,
      showZhiboBox: false,
      courseSelfId: "",
      is_nature: 0,
      showList: this.$store.state.SecHeadClick,
      payment: {
        status: "1",
        userNameOrPhoneNo: "2",
        payNo: "",
      },
      payInfos: [],
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20,
      },
      nextPage: 1,
      totalCount: 20,
      transData: {},
      searchData: {
        subject_id: Number,
        coursesubjectOne: Number,
        coursesubjectTwo: Number,
        method: 0,
        status: 0,
        nature: 0,
      },
      subjectArr: [],
      selxuekeIndex: Number,
      xiaoleiArr: [{ id: 0, name: "全部" }],
      selxiaoleiIndex: 0,
      leixingArr: [
        { id: 0, name: "全部" },
        { id: 1, name: "直播" },
        { id: 2, name: "录播" },
        { id: 3, name: "其他" },
      ],
      fabuArr: [
        { id: 0, name: "全部" },
        { id: 1, name: "未发布" },
        { id: 2, name: "在售" },
        { id: 3, name: "停售" },
      ],
      authArr: [
        { id: 0, name: "全部" },
        { id: 1, name: "自增" },
        { id: 2, name: "授权" },
      ],
      selleixingIndex: 0,
      selfabuIndex: 0,
      selauthIndex: 0,
    };
  },
  methods: {
    // 授权网校查看
    empowerSchool(id) {},
    delCourse(id, nature) {
      this.$confirm("删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request
            .http(this, "course/courseDel", { id: id, nature: nature })
            .then((res) => {
              if (res.code == 200) {
                if (this.cur.page > 1) {
                  this.cur.page =
                    Math.ceil(this.totalCount - 1) / this.cur.pagesize;
                }
                this.initData();
              } else {
                this.$toast(res.msg);
              }
            });
        })
        .catch((data) => {});
    },
    // 推荐
    tuijianFun(id, nature) {
      _request
        .http(this, "course/courseRecommend", { id: id, nature: nature })
        .then((res) => {
          if (res.code == 200) {
            this.initData();
          } else {
            this.$toast(res.msg);
          }
        });
    },
    changeStatus(id, nature, status) {
      // 未发布状态修改
      // var statsObj = {"1":"未发布","2":"在售","3":"停售"};
      var stuArr = ["", "在售", "停售"];
      var text = "修改课程状态为" + stuArr[status];
      this.$confirm(text + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request
            .http(this, "course/courseUpStatus", {
              id: id,
              nature: nature,
              status: status,
            })
            .then((res) => {
              if (res.code == 200) {
                this.initData();
              } else {
                this.$toast(res.msg);
              }
            });
        })
        .catch(() => {});
    },
    editCourse(id, nature) {
      var urlParam = `?transId=${id}&is_nature=${nature}`;
      this.$router.push("/courses/coursesSub/add" + urlParam);
    },
    selxuekeFun(item) {
      // 选择学科
      this.selxuekeIndex = item.id;
      this.xiaoleiArr = [{ id: 0, name: "全部" }];
      this.xiaoleiArr = this.xiaoleiArr.concat(item.childs || []);
      this.selxiaoleiIndex = 0;
      this.searchData.coursesubjectOne = item.id;
      this.searchData.coursesubjectTwo = 0;
      this.select();
    },
    selxiaoleiFun(item) {
      this.selxiaoleiIndex = item.id;
      this.searchData.coursesubjectTwo = item.id;

      this.select();
    },
    selLeixingFun(item) {
      this.selleixingIndex = item.id;
      this.searchData.method = item.id;
      this.select();
    },
    selfabuFun(item) {
      this.selfabuIndex = item.id;
      this.searchData.status = item.id;
      this.select();
    },
    selauthFun(item) {
      this.selauthIndex = item.id;
      this.searchData.nature = item.id;
      this.select();
    },
    getSubjectList() {
      _request.http(this, "subject").then((res) => {
        var getData = res.data;
        this.subjectArr = getData;
        this.searchData.coursesubjectOne = getData[0]["id"];

        this.selxuekeIndex = getData[0]["id"];

        this.xiaoleiArr = this.xiaoleiArr.concat(getData[0]["childs"] || []);

        this.searchData.coursesubjectTwo = 0;
        this.initData();
      });
    },
    select() {
      this.paginationShow = false;
      this.cur.page = 1;
      this.$nextTick(() => {
        this.initData();
      });
    },

    changeShowBox(type, item) {
      var boxInt = parseInt(type);
      this.transData = item;
      switch (boxInt) {
        case 0: {
          // 添加
          var urlParam = `?transId=&is_nature=0`;
          this.$router.push("/courses/coursesSub/add" + urlParam);
          break;
        }
        case 1: {
          //直播
          this.$router.push({
            path: "/courses/coursesSub/live",
            query: {
              id: item.id,
              nature: item.nature,
            },
          });
          break;
        }
        case 2: {
          // 录播
          var urlParam = `?transId=${item.id}&nature=${item.nature}`;
          this.$router.push({
            path: "/courses/coursesSub/record",
            query: {
              transId: item.id,
              nature: item.nature,
            },
          });
          break;
        }
      }
    },

    initData() {
      _request
        .http(this, "course/courseList", this.searchData, this.cur)
        .then((res) => {
          if (res.code == 200) {
            this.payInfos = res.data;
            this.totalCount = res.page.total;
            this.paginationShow = res.page.total;
            this.nextPage = parseInt(res.page.page);
          } else {
            this.$toast(res.msg);
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
  created() {
    this.getSubjectList();
    // this.getPayChannels();
    // console.log(this.$store.state.SecHeadClick);
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", (data) => {
        this.showList = data;
        this.showLuboBox = false;
        this.showZhiboBox = false;
        this.initData();
      });
    },
  },
};
</script>
<style scoped lang="less">
.addBox {
  position: relative;
  float: left;
  width: 260px;
  height: 300px;
  border: 0;
  outline: none;
  margin: 0 26px 25px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 9px 1px rgba(38, 164, 253, 0.1);
  text-align: center;

  .add-content {
    width: 70px;
    height: 70px;
    line-height: 70px;
    margin-top: 115px;
    display: inline-block;
    font-size: 80px;
  }
}

.kecheng-box {
  position: relative;
  .type-list {
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .search-box {
    padding: 20px 20px 1px;
    margin: 0 25px 20px;
    background: #fff;
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    // border-bottom: 1px solid rgba(224, 224, 224, 1);
    .typeName {
      float: left;
      color: rgba(51, 51, 51, 1);
    }
    .typeList {
      display: inline-block;
      width: calc(100% - 76px);
    }
    .typeItem {
      display: inline-block;
      margin: 0 5px 5px;
      padding: 0 12px;
      height: 28px;
      line-height: 28px;
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

  .kechengs {
    position: relative;
    display: inline-block;
    width: 260px;
    height: 300px;
    margin: 0 25px;
    font-size: 12px;
    margin-bottom: 36px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 9px 1px rgba(38, 164, 253, 0.1);
    .kecheng-img {
      width: 260px;
      height: 130px;
    }
    .classStatus {
      position: absolute;
      top: 5px;
      left: 5px;
      width: 60px;
      height: 24px;
      text-align: center;
      line-height: 24px;
      background: rgba(236, 236, 236, 1);
      box-shadow: 0px 0px 9px 1px rgba(0, 33, 56, 0.2);
      border-radius: 2px;
      font-size: 14px;
      cursor: pointer;
      .grey {
        color: rgba(102, 102, 102, 1);
      }
      .success {
        background: #ff0000;
        color: #fff;
      }
      .primary {
        background: #1cc700;
        color: #fff;
      }
    }
    .tuijian {
      position: absolute;
      top: 0;
      right: 0;
      background: rgba(0, 0, 0, .5);
      width: 90px;
      height: 30px;
      line-height: 30px;
      // border-bottom-left-radius: 50px;
      // padding-top: 6px;
      // padding-left: 22px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
      // &:hover {
      //   color: #fff;
      //   background: rgba(0, 0, 0, 0.6);
      // }
      // &.active {
      //   color: #ffa800;
      //   background: rgba(0, 0, 0, 0.6);
      // }
    }
  }
  .kecheng-status {
    position: relative;
    margin-top: -40px;
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    background: rgba(0, 0, 0, 0.7);
    height: 40px;
    line-height: 40px;

    .shangjia {
      margin-left: 10px;
    }
    .courseStus {
      display: inline-block;
      position: absolute;
      right: 0;
      .status {
        cursor: pointer;
        margin-right: 10px;
        &:hover {
          color: #ffa800;
        }
      }
    }
  }

  .kecheng-detail {
    margin: 0 10px;
    .kecheng-title {
      height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 16px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin: 20px 0 16px;
    }
    .jiage {
      color: #ff0000;
    }
    .shangxian {
      margin-top: 7px;
      text-align: right;
    }
    .empower {
      display: inline-block;
      width: 80px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #eee;
      border-radius: 5px;
      cursor: pointer;
    }
    .renshu {
      color: #1cc700;
    }
    .seeDetail {
      float: right;
      padding: 0 15px;
      margin-left: 5px;
      height: 30px;
      line-height: 30px;
      margin-top: 20px;
      margin-bottom: 10px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(230, 230, 230, 1);
      border-radius: 15px;
      font-size: 12px;
      color: rgba(102, 102, 102, 1);
    }
  }
}
/deep/ .el-tabs__nav.is-top {
  left: 45%;
}
/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
  background-color: #e0e0e0;
  z-index: 1;
}
.el-icon-circle-plus {
  color: #b8b8b8;
  width: 70px;
  height: 70px;
}
</style>
