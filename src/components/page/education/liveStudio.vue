<template>
  <div class="container-box">
    <div class="kecheng-box" v-if="showList">
      <div class="search-box">
        <div class="type-list">
          <div class="typeName">日&nbsp;&nbsp;&nbsp;&nbsp;期：</div>
          <div class="typeList">
            <div
              class="typeItem"
              v-for="(item,index) in dateArr"
              :key="index"
              @click="seldataFun(item.value)"
              :class="{typeActive: sellRiqiIndex == item.value}"
            >{{item.label}}</div>
            <el-date-picker
              v-if="showSelTime"
              v-model="searchData.timerange"
              type="daterange"
              style="width:280px!important;"
              format="yyyy-MM-dd"
              value-format="timestamp"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="selTimeRang"
            ></el-date-picker>
          </div>
        </div>
        <div class="type-list">
          <div class="typeName">状&nbsp;&nbsp;&nbsp;&nbsp;态：</div>
          <div class="typeList">
            <div
              class="typeItem"
              v-for="(item,index) in statusArr"
              :key="index"
              @click="selStatusFun(item.value)"
              :class="{typeActive: selStatusIndex == item.value}"
            >{{item.label}}</div>
          </div>
        </div>
        <div class="type-list">
          <div class="typeName">关键词：</div>
          <div class="typeList">
            <el-input
              v-model="searchData.teacherSearch"
              class="width-177"
              placeholder="教师名称"
              clearable
              prefix-icon="el-icon-search"
            ></el-input>
            <el-input
              v-model="searchData.classSearch"
              class="width-177"
              placeholder="课次名称"
              clearable
              prefix-icon="el-icon-search"
            ></el-input>
            <el-input
              v-model="searchData.classNoSearch"
              class="width-177"
              placeholder="班号名称"
              clearable
              prefix-icon="el-icon-search"
            ></el-input>
            <el-button type="primary" @click="select">查询</el-button>
          </div>
        </div>
      </div>
      <div>
        <div class="item-content" v-for="(item,index) in dataList" :key="index">
          <div class="item-head">
            <div class="class-status">
              <span v-if="item.state == 1" class="daojishi">{{item.status}}</span>
              <span v-else-if="item.state == 2" class="zhibozhong">{{item.status}}</span>
              <span v-else>{{item.status}}</span>
            </div>
            <div class="class-date">{{item.start_time}}</div>
          </div>
          <div class="item-center">
            <el-row>
              <el-col :span="9">
                <img src="../../../assets/image/jiaoxue/icon1.png" class="item-img" alt="图片" />班号名称：
                <span class="item-detail">{{item.classno_name}}</span>
              </el-col>
              <el-col :span="9">
                <img src="../../../assets/image/jiaoxue/icon3.png" class="item-img" alt="图片" />课次名称：
                <span class="item-detail">{{item.class_name}}</span>
              </el-col>
            </el-row>
            <el-row class="col-row">
              <el-col :span="9">
                <img src="../../../assets/image/jiaoxue/icon2.png" class="item-img" alt="图片" />授课老师：
                <span class="item-detail">{{item.teacher_name}}</span>
              </el-col>
              <el-col :span="9">
                <img src="../../../assets/image/jiaoxue/icon4.png" class="item-img" alt="图片" />时长：
                <span class="item-detail">{{item.time}}</span>
              </el-col>
              <el-col :span="6">
                <img src="../../../assets/image/jiaoxue/icon5.png" class="item-img" alt="图片" />学员数量：
                <span class="item-detail">{{item.watch_num}}人</span>
              </el-col>
            </el-row>
          </div>
          <div class="item-right">
            <!-- 结束3 直播中2 即将开始1 -->
            <el-button
              type="primary"
              v-if="item.state == 1"
              @click="openLecture(item.class_id,item.is_public)"
              class="reset-button"
            >{{item.statusName}}</el-button>
            <el-button
              type="primary"
              v-else-if="item.state == 2"
              @click="liveLecture(item.class_id,item.is_public,item.classno_id)"
              class="reset-button"
            >{{item.statusName}}</el-button>
            <el-button
              type="primary"
              v-else
              @click="lookBack(item.class_id,item.is_public)"
              class="reset-button"
            >{{item.statusName}}</el-button>
            <el-button
              type="success"
              @click="showDetailFun(item.class_id,item.classno_id,item.is_public,item.state)"
              class="reset-button"
            >查看详情</el-button>
          </div>
        </div>
        <div class="noData" v-if="noData">暂无数据</div>
      </div>
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
    </div>
    <div>
      <liveStudio-detail :transData="transData" v-if="showDetail" @closeDetail="closeFun"></liveStudio-detail>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
import comDetail from "./liveStudioDetail";
export default {
  components: {
    "liveStudio-detail": comDetail
  },
  data() {
    return {
      dateArr: [
        { label: "全部", value: "0" },
        { label: "今天", value: "1" },
        { label: "明天", value: "2" },
        { label: "昨天", value: "3" },
        { label: "指定时间", value: "4" }
      ],
      statusArr: [
        { label: "全部", value: "0" },
        { label: "进行中", value: "1" },
        { label: "未开始", value: "2" },
        { label: "已结束", value: "3" }
      ],
      selStatusIndex: "0",
      sellRiqiIndex: "0",
      searchData: {
        time: "0",
        timerange: [],
        status: "0",
        teacherSearch: "",
        classSearch: "",
        classNoSearch: ""
      },
      dataList: [],
      noData: false,
      transData: {
        id: "",
        public: ""
      },
      showSelTime: false,
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      totalCount: 20,
      showList: this.$store.state.SecHeadClick,
      showDetail: false,
      showLecture: false,
      transLectureData: {}
    };
  },
  methods: {
    // 查看回放
    lookBack(id, is_public) {
      _request
        .http(this, "teach/livePlayback", { id: id, is_public: is_public })
        .then(res => {
          if (res.code == 200) {
            console.log(res.data.playbackUrl);
            window.open(res.data.playbackUrl);
          } else {
            alert(res.msg);
          }
        });
    },
    // 开始讲课
    openLecture(id, is_public) {
      var type = localStorage.getItem("teacher_type");
      _request
        .http(this, "teach/startLiveChild", { id: id, is_public: is_public })
        .then(res => {
          if (res.code == 200) {
            if (type == 2) {
              window.open(res.data.url);
            } else if (type == 1) {
              window.open(res.data.liveUrl);
            } else {
              this.$message.error("只有讲师和教务才能进入直播间"); //2讲师1教务0其他不允许进入
            }
            // window.open('http://testwo.admin.longde999.cn/web/lecturePaqge.html?'+param);
            // 讲师可以使用摄像头  教务不能
          }
        });
    },
    // 进直播间
    liveLecture(classId, ispublic, courseId) {
      var id = "";
      // if(ispublic ==  1){
      //   // class_id  公开课
      //     id = classId;
      // }else{
      //   //
      //     id = courseId;
      // }
      id = classId;
      var type = localStorage.getItem("teacher_type");
      _request
        .http(this, "teach/liveInRoom", { id: id, is_public: ispublic })
        .then(res => {
          if (res.code == 200) {
            if (type == 2) {
              //2讲师1教务0其他不允许进入
              // window.open(res.data.liveVideoUrl);
              window.open(res.data.url);
            } else if (type == 1) {
              window.open(res.data.liveUrl);
            } else {
              this.$message.error("只有讲师和教务才能进入直播间");
            }
          }
        });
    },
    closeFun() {
      this.showList = true;
      this.showDetail = false;
    },
    showDetailFun(id, classno_id, ispublic, state) {
      // this.transData = {
      //   id: id,
      //   classno_id: classno_id,
      //   public: ispublic,
      //   state:state
      // };
      // this.showList = false;
      // this.showDetail = true;
      this.$router.push({
        path: "/education/liveStudio/detail",
        query: {
          id: id,
          classno_id: classno_id,
          public: ispublic,
          state: state
        }
      });
    },
    selTimeRang(val) {
      console.log(val[1]);
      this.searchData.timerange[1] = Number(val[1] + 24 * 60 * 60 * 1000 - 1);
      this.initData();
    },
    selStatusFun(val) {
      this.selStatusIndex = val;
      this.searchData.status = val;
      this.select();
    },
    seldataFun(val) {
      this.sellRiqiIndex = val;
      if (val == 4) {
        this.showSelTime = !this.showSelTime;
        this.searchData.time = "0";
      } else {
        this.searchData.timerange = [];
        this.searchData.time = val;
        this.initData();
      }
    },
    select() {
      this.paginationShow = false;
      this.cur.page = 1;
      console.log(JSON.stringify(this.searchData));
      this.$nextTick(() => {
        this.initData();
        this.paginationShow = true;
      });
    },

    initData() {
      _request.http(this, "teach/getList", this.searchData).then(res => {
        if (res.data.length) {
          this.dataList = res.data;
          this.noData = false;
        } else {
          this.dataList = [];
          this.noData = true;
        } // this.totalCount = res.data.total;
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
  },
  mounted() {
    this.initData();
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", data => {
        this.showList = data;
        this.showLecture = false;
        this.showDetail = false;
      });
    }
    // 'searchData.time': {
    //   handler(val) {
    //     if (val[1]) {
    //       this.searchData.time[1] = Number(
    //         (val[1] + 24 * 60 * 60 * 1000 - 1)
    //       );
    //       console.log(JSON.stringify(this.searchData.time))
    //     }
    //   }
    // }
  }
};
</script>

<style lang="less" scoped>
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
      height: 32px;
      line-height: 32px;
      color: rgba(51, 51, 51, 1);
    }
    .typeList {
      display: inline-block;
      width: calc(100% - 70px);
    }
    .typeItem {
      display: inline-block;
      margin: 0 5px 5px;
      padding: 0 12px;
      height: 32px;
      line-height: 32px;
      color: rgba(102, 102, 102, 1);
    }
    .typeActive {
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
.item-content {
  display: flex;
  align-items: center;
  padding: 30px 0;
  background: #fff;
  margin: 5px 25px 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  .item-head {
    width: 150px;
    text-align: center;
    font-size: 14px;
    color: rgba(153, 153, 153, 1);
    .class-date {
      margin-top: 20px;
      height: 14px;
      line-height: 14px;
    }
    .class-status {
      height: 20px;
      line-height: 20px;
      font-size: 20px;
      font-weight: bold;
    }
    .zhibozhong {
      color: #1cc700;
    }
    .daojishi {
      color: #ff551d;
    }
    .zhiboshijian {
      color: #333333;
    }
  }
  .item-center {
    flex: 1;
    border-left: 1px solid #e9e5ea;
    border-right: 1px solid #e9e5ea;
    padding: 5px 10px 10px;
    font-size: 14px;
    color: #666;
    .item-detail {
      color: #333;
    }
    .col-row {
      margin-top: 20px;
    }
    .item-img {
      width: 20px;
      height: 20px;
      vertical-align: top;
      margin-right: 5px;
    }
  }
  .item-right {
    width: 220px;
    text-align: center;
    .reset-button {
      height: 70px;
      border-radius: 5px;
      font-size: 14px;
    }
  }
}

.width-177 {
  width: 177px;
}
</style>