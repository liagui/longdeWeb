<template>
  <div class="container-box" style="border-radius: 5px">
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
              排&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序：
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
        </div>
        <!-- 列表数据 -->
        <div class="clearfix">
          <div class="kechengs" v-for="(item, index) in payInfos" :key="index">
            <div class="classStatus">
              <div
                class="success"
                @click="changeStatus(item.id, item.status, 1)"
              >
                停售
              </div>
            </div>
            <div
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
            </div>
            <img v-if="item.cover" :src="item.cover" class="kecheng-img" alt />
            <img
              v-else
              src="../../../../assets/image/defaultImg.png"
              class="kecheng-img"
              alt
            />
            <div class="kecheng-status">
              <span
                class="shangjia"
                v-text="item.nature == 0 ? '已授权' : '未授权'"
              ></span>
              <span>{{ item.method_name }}</span>
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
            <div
              class="kecheng-detail"
              v-if="isShows"
              @click="buttonShow(item.id)"
              @blur="isShows = true"
            >
              <div class="kecheng-title">{{ item.title }}</div>
              <div>
                网校售价：
                <span class="jiage">{{ item.pricing }}</span>
              </div>
              <div class="shangxian">
                天成单价：
                <span class="renshu">{{ item.buy_num }}</span>
              </div>
              <div class="shangxian">
                课程库存：
                <span class="renshu"
                  >{{ item.buy_num }}/{{ item.sum_number }}</span
                >
              </div>
            </div>
            <div class="button-item" v-if="!isShows">
              <button type="info" @click="tuiMoneys(item.id)" v-show="disAbles">
                申请退费
              </button>
              <button type="info" v-show="disAble" @click="updata(item.id)">
                更换库存
              </button>
              <button type="info" @click="addShop(item.id)">加入购物车</button>
            </div>
          </div>
        </div>
        <!-- 页数 -->
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
        <!-- 页数 -->
      </div>
    </div>

    <!-- 更改弹框 -->
    <el-dialog
      title="更换课程库存"
      :close-on-click-modal="false"
      :visible.sync="DiaglogShow"
      width="60%"
      @close="showDialog = false"
      center
    >
      <div>
        <div class="navTitle">
          <span>课程</span>
          <span>学科</span>
          <span>小类</span>
          <span>单价</span>
          <span>更换课程</span>
          <span>更换课程单价</span>
          <span>更换库存</span>
        </div>
        <div class="conTxt navTitle">
          <span>{{ courseinfo.title }}</span>
          <span>{{ courseinfo.parent }}</span>
          <span>{{ courseinfo.child }}</span>
          <span>{{ courseinfo.price }}</span>
          <span>
            <el-select
              v-model="value"
              clearable
              @change="selectModel($event)"
              placeholder="选择课程"
            >
              <el-option
                v-for="item in courselist"
                :key="item.course_id"
                :label="item.title"
                :value="item.course_id"
                ref="courselists"
              >
              </el-option>
            </el-select>
          </span>
          <span>{{ price }}</span>
          <span>
            <button @click="buttonClick('-', courseinfo.course_id)">-</button>
            <input type="text" v-model="schoolId.stocks" />
            <button @click="buttonClick('+', courseinfo.course_id)">+</button>
          </span>
        </div>

        <div class="word">
          <h5><a>*</a>更换课程库存说明：</h5>
          <p>
            更换后课程如果出现差价，多余部分将退还余额中，少的部分将从余额中扣除
          </p>
        </div>
        <div class="footer" v-if="courseinfo.price > geiPrice">
          <span
            >应付：<a>￥{{ courseinfo.price - geiPrice }}</a></span
          >
          <button @click="sure">确认支付</button>
        </div>
        <div class="footer" v-if="courseinfo.price < geiPrice">
          <span
            >退换：<a>￥{{ geiPrice - courseinfo.price }}</a></span
          >
          <button @click="sure">确认退换</button>
        </div>
        <div class="footer" v-if="courseinfo.price == geiPrice">
          <span
            >合计：<a>￥{{ courseinfo.price - geiPrice }}</a></span
          >
          <button @click="sure">确认更换</button>
        </div>
      </div>
    </el-dialog>
    <!-- 更改弹框 -->

    <!-- 退款弹框 -->
    <el-dialog
      title="申请退费"
      :close-on-click-modal="false"
      :visible.sync="DiaglogtuiShow"
      width="60%"
      @close="DiaglogtuiShow = false"
      center
    >
      <div>
        <div class="navTitle">
          <span></span>
          <span>课程</span>
          <span>学科</span>
          <span>小类</span>
          <span>现有库存</span>
          <span>48小时内购买库存</span>
          <span>48~72小时购买库存</span>
        </div>
        <div class="conTxt navTitle">
          <span></span>
          <span>{{ tuiData.title }}</span>
          <span>{{ tuiData.parent }}</span>
          <span>{{ tuiData.child }}</span>
          <span>{{ tuiData.total }}</span>
          <span>{{ tuiData.num_left }}</span>
          <span>{{ tuiData.num_right }}</span>
        </div>
        <div class="addKu conTxt navTitle">
          <span>申请库存</span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span
            ><button @click="leftButton('-', tuiData.course_id)">-</button>
            <input type="text" v-model="schoolId.numleft" />
            <button @click="leftButton('+', tuiData.course_id)">+</button></span
          >
          <span
            ><button @click="rightButton('-', tuiData.course_id)">-</button>
            <input type="text" v-model="schoolId.numright" /><button
              @click="rightButton('+', tuiData.course_id)"
            >
              +
            </button></span
          >
        </div>
        <div class="addKu conTxt navTitle">
          <span>申请库存</span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span>{{ dataMoney.left_money }}</span>
          <span>{{ dataMoney.right_money }}</span>
        </div>

        <div class="word">
          <h5><a>*</a>退费说明：</h5>
          <p>1.申请发起的退款将在审核后退到您的账户余额中</p>
          <p>
            2.48小时内购买的库存按100%余额退还，超过48小时不足72小时的库存按50余额退还
          </p>
        </div>
        <div class="footer">
          <span
            >合计：<a>￥{{ sumPrice }}</a></span
          >
          <button @click="sureTUI">确认退换</button>
        </div>
      </div>
    </el-dialog>
    <!-- 退款弹框  -->

    <!--  -->
  </div>
</template>
<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  data() {
    return {
      // options: [
      //   {
      //     value: "选项一",
      //     label: "龙德天成",
      //   },
      // ],
      value: "",
      num: 1,
      num1: 1,
      num2: 1,
      disAbles: true,
      disAble: true,
      DiaglogShow: false,
      DiaglogtuiShow: false,
      courseAddBox: false,
      showLuboBox: false,
      showZhiboBox: false,
      isShows: true,
      courseSelfId: "",
      is_nature: 0,
      price: "1.00",
      geiPrice: "1.00",
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
        // subject_id: Number,
        // coursesubjectOne: Number,
        // coursesubjectTwo: Number,
        // method: 0,
        // status: 0,
        // nature: 0,
        parentid: Number,
        childid: Number,
        type: Number,
        schoolid: window.localStorage.getItem("school_id"),
      },
      subjectArr: [{ id: 0, name: "全部" }],
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
        { id: 0, name: "时间" },
        { id: 1, name: "销售量" },
      ],

      selleixingIndex: 0,
      selfabuIndex: 0,
      selauthIndex: 0,
      schoolId: {
        schoolid:  window.localStorage.getItem("school_id"),
        courseid: "",
        ncourseid: "",
        stocks: 1,
        numleft: 0,
        numright: 0,
      },
      schoolIds: {
        schoolid: window.localStorage.getItem("school_id"),
        courseid: "",
      },
      sureMsg: {},
      dataMoney: {},
      tuiData: {}, //退款弹框内容
      courseinfo: {}, //更换库存
      courselist: [], //更换库存选择学校
    };
  },
  methods: {
    // 加入购物车
    addShop(id) {
      this.schoolId.courseid = id;
      _request
        .http(this, "service/stock/addShopCart", this.schoolIds)
        .then((res) => {
          if (res.code == 200) {
            this.$message("加入购物车成功啦！");
            this.isShows = true;
          }
        });
    },
    // 下拉选则更换的课程
    selectModel(course_id) {
      console.log(course_id);
      this.schoolId.ncourseid = course_id;
      this.price = this.courselist[course_id].price;
      console.log(this.price);
      this.geiPrice = this.price * this.schoolId.stocks;
    },
    // 点击加减按钮控制数量
    buttonClick(str, id, index) {
      console.log(str, id);
      this.schoolId.courseid = id;

      if (str == "-") {
        if (this.schoolId.stocks <= 0) {
          this.$message("已经为零喽~~");
          return;
        } else {
          this.schoolId.stocks--;
        }
      } else if (str == "+") {
        this.schoolId.stocks++;
        //
      }
      this.numTui();
    },

    // 库存更换 点击更换仓库，弹框出现
    updata(id) {
      console.log(id);
      this.DiaglogShow = true;
      this.schoolIds.courseid = id;
      _request
        .http(this, "service/stock/preReplace", this.schoolIds)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.isShows = true;
            this.courseinfo = res.data.courseinfo;
            this.courselist = res.data.courselist;
            this.schoolId.stocks = res.data.stocks;
          }
        });
    },
    numTui() {
      // 成功后获取数量
      _request
        .http(this, "service/stock/replaceDetail", this.schoolId)
        .then((res) => {
          if (res.code == 200) {
            console.log(res.data.list);
          }
        });
    },
    // 确认更换按钮
    sure() {
      _request
        .http(this, "service/stock/doReplace", this.schoolId)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.courseinfo = res.data.courseinfo;
            this.courselist = res.data.courselist;
            this.isShows = true;
          }
        });
      this.DiaglogShow = false;
      this.isShows = true;
    },
    // 退款加减
    leftButton(str, id, num) {
      this.schoolId.courseid = id;

      if (str == "-") {
        if (this.schoolId.numleft <= 0) {
          this.$message("已经为零喽~~");
          return;
        } else {
          this.schoolId.numleft--;
        }
      } else if (str == "+") {
        if (this.schoolId.numleft >= this.tuiData.num_left) {
          this.$message("没有多余库存喽~~");
          return;
        } else {
          this.schoolId.numleft++;
        }
      }
    },
    // 退款加减
    rightButton(str, id, num) {
      this.schoolId.courseid = id;

      if (str == "-") {
        if (this.schoolId.numright <= 0) {
          this.$message("已经为零喽~~");
          return;
        } else {
          this.schoolId.numright--;
        }
      } else if (str == "+") {
        if (this.schoolId.numright >= this.tuiData.num_right) {
          this.$message("没有多余库存喽~~");
          return;
        } else {
          this.schoolId.numright++;
        }
      }
    },
    // 库存退费
    tuiMoneys(i) {
      this.schoolId.courseid = i;
      this.DiaglogtuiShow = true;
      _request
        .http(this, "service/stock/Refund", this.schoolIds)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.tuiData = res.data;
            this.isShows = true;
            _request
              .http(this, "service/stock/refundMoney", this.schoolId)
              .then((res) => {
                console.log(res);
                if (res.code == 200) {
                  this.dataMoney = res.data;
                }
              });
          }
        });
    },
    // 确认退款按钮
    sureTUI() {
      this.DiaglogtuiShow = false;
      _request
        .http(this, "service/stock/doRefund", this.schoolId)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
          }
        });
    },

    buttonShow(id) {
      this.isShows = false;
    },
    buttonHide() {
      this.isShows = true;
    },
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
      this.searchData.parentid = item.id;
      this.searchData.childid = 0;
      this.select();
    },
    selxiaoleiFun(item) {
      this.selxiaoleiIndex = item.id;
      this.searchData.childid = item.id;

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
        this.subjectArr = [{ id: 0, name: "全部" }];
        this.subjectArr = getData;
        this.searchData.parentid = getData[0]["id"];

        this.selxuekeIndex = getData[0]["id"];

        this.xiaoleiArr = this.xiaoleiArr.concat(getData[0]["childs"] || []);

        this.searchData.childid = 0;
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
        .http(this, "service/stock/courseIndex", this.searchData, this.cur)
        .then((res) => {
          if (res.code == 200) {
            this.payInfos = res.data.list;
            this.totalCount = res.data.total;
            this.paginationShow = res.data.total;
            // this.nextPage = parseInt(res.page.page);
            for (let i = 0; i < res.data.list; i++) {
              if (i.ishave == 0) {
                this.disAbles = false;
                this.disAble = false;
              } else {
                this.disAbles = true;
                this.disAble = true;
              }
            }
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
  computed: {
    sumPrice() {
      let sum = 0;
      return (sum = this.schoolId.numleft * 18 + this.schoolId.numright * 9);
    },
    numPrice() {},
  },
};
</script>
<style scoped lang="less">
.navTitle {
  width: 100%;
  margin: 0 auto;
  height: 60px;
  display: flex;
  box-shadow: 2px 2px 2px 2px #f0f0f0;
  justify-content: space-between;
  align-items: center;
  span {
    width: 14%;
    text-align: center;
  }
}
.word {
  margin-top: 30px;
  line-height: 30px;
  width: 100%;
  padding-left: 30px;
  border-bottom: 1px solid #f0f0f0;
  h5 {
    font-size: 15px;
    font-weight: bold;
    a {
      color: red;
    }
  }
}
.footer {
  width: 100%;
  padding: 30px 20px;
  // display: flex;
  // align-items: center;
  text-align: right;
  button {
    height: 35px;
    padding: 5px 14px;
    border: none;
    background: rgb(241, 134, 34);
    outline: none;
    margin-left: 30px;
    color: #fff;
  }
  span {
    a {
      color: rgb(241, 134, 34);
      font-size: 20px;
    }
  }
}
.conTxt {
  box-shadow: none;
  button {
    border: none;
    outline: none;
    width: 30px;
    height: 30px;
  }
  input {
    width: 50px;
    height: 30px;
    text-align: center;
    border: none;
    margin: 0 5px;
    background: #f0f0f0;
  }
}
.button-item {
  display: flex;
  flex-direction: column;
  height: 150px;
  justify-content: space-around;
  align-items: center;
  button {
    width: 80px;
    padding: 8px 10px;
    text-align: center;
    border: none;
    outline: none;
  }
}
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
      background: rgba(0, 0, 0, 0);
      width: 50px;
      height: 50px;
      border-bottom-left-radius: 50px;
      padding-top: 6px;
      padding-left: 22px;
      font-size: 18px;
      color: transparent;
      cursor: pointer;
      &:hover {
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
      }
      &.active {
        color: #ffa800;
        background: rgba(0, 0, 0, 0.6);
      }
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
    span:nth-child(1) {
      float: left;
    }
    span:nth-child(2) {
      float: right;
      margin-right: 10px;
    }
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
    height: 150px;
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
      margin-top: 18px;
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
