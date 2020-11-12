<template>
  <div class="container-box">
    <div class="clearfix">
      <div class="kecheng-box">
        <div class="search-box">
          <div class="type-list">
            <div class="typeName">学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;科：</div>
            <div class="typeList">
              <div
                class="typeItem"
                v-for="(item,index) in subjectArr"
                @click="selxuekeFun(item)"
                :class="{typeActive:selxuekeIndex ==item.id}"
                :key="index"
              >{{item.name}}</div>
            </div>
          </div>
          <div class="type-list">
            <div class="typeName">学科小类：</div>
            <div class="typeList">
              <div
                class="typeItem"
                v-for="(item,index) in xiaoleiArr"
                @click="selxiaoleiFun(item)"
                :class="{typeActive:selxiaoleiIndex ==item.id}"
                :key="index"
              >{{item.name}}</div>
            </div>
          </div>
          <div class="type-list">
            <div class="typeName">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</div>
            <div class="typeList">
              <div
                class="typeItem"
                v-for="(item,index) in fabuArr"
                :key="index"
                @click="selfabuFun(item)"
                :class="{typeActive: selfabuIndex == item.id}"
              >{{item.name}}</div>
            </div>
          </div>
          <div class="type-list">
            <div class="typeName">属&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;性：</div>
            <div class="typeList">
              <div
                class="typeItem"
                v-for="(item,index) in authArr"
                :key="index"
                @click="selauthFun(item)"
                :class="{typeActive: selauthIndex == item.id}"
              >{{item.name}}</div>
            </div>
          </div>
          <div class="type-list">
            <div class="typeName">时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：</div>
            <div class="typeList">
              <el-date-picker
                v-model="searchData.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:400px !important;"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                :default-time="['10:00:00', '23:00:00']"
                align="left"
              >
                <!-- value-format="yyyy-MM-dd  HH:mm:ss" -->
              </el-date-picker>
              <el-button @click="select">查询</el-button>
            </div>
          </div>
        </div>
        <div class="clearfix">
          <div class="addBox" @click="changeShowBox(0)">
            <div class="add-content">
              <i class="el-icon-circle-plus"></i>
            </div>
          </div>
          <div class="kechengs" v-for="(item,index) in dataList" :key="index">
            <div class="classStatus">
              <div v-if="item.status == 0" @click="changeStatus(item.id,0,item.nature)" class="grey">未发布</div>
              <div v-else-if="item.status == 1" @click="changeStatus(item.id,1,item.nature)" class="success">在售</div>
              <div v-else class="primary" @click="changeStatus(item.id,0,item.nature)">停售</div>
            </div>
            <div class="tuijian active" v-if="item.is_recommend == 1" @click="tuijianFun(item.id,item.nature)">荐</div>
            <div class="tuijian" v-else @click="tuijianFun(item.id,item.nature)">荐</div>
            <img v-if="item.cover" :src="item.cover" class="kecheng-img" alt />
            <img v-else src="../../../assets/image/defaultImg.png" class="kecheng-img" alt />
            <div class="kecheng-status">
              <span class="shangjia" v-text="item.nature == 1?'自增课程':'授权课程'"></span>
             
            </div>
            <div class="kecheng-detail">
              <div class="kecheng-title">{{item.title}}</div>
              <div>
                时间：
                <span class="jiage">{{item.times}}</span>
              </div>
              <div class="shangxian">
                讲师：
                <span class="renshu">{{item.teacher_name}}</span>
              </div>
              <button class="seeDetail" @click="delCourse(item.id,item.nature)">删除</button>
              <button class="seeDetail" @click="editCourse(item.id,item.nature)">编辑</button>
            </div>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            v-if="paginationShow"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[23, 47, 101]"
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
      courseSelfId: "",
      courseSeNature: "",
      showList: this.$store.state.SecHeadClick,
      payment: {
        status: "1",
        userNameOrPhoneNo: "2",
        payNo: ""
      },
      dataList: [],
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 23
      },
      nextPage: 1,
      totalCount: 0,
      transData: {},
      searchData: {
        subject_id: Number,
        parent_id: Number,
        child_id: Number,
        status: 0,
        time: [],
        nature:'',
      },
      subjectArr: [],
      selxuekeIndex: Number,
      xiaoleiArr: [{ id: 0, name: "全部" }],
      selxiaoleiIndex: 0,
      authArr: [
        { id: 0, name: "全部" },
        { id: 1, name: "自增" },
        { id: 2, name: "授权" }
      ],
      fabuArr: [
        { id: 0, name: "全部" },
        { id: 1, name: "未发布" },
        { id: 2, name: "已发布" },
        { id: 3 , name: "已下架" }
      ],
      selleixingIndex: 0,
      selfabuIndex: 0,
      selauthIndex: 0
    };
  },
  methods: {
    delCourse(id,nature) {
      this.$confirm("删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request.http(this, "opencourse/doUpdateDel", { openless_id: id,nature:nature }).then(res => {
            if (res.code == 200) {
              if(this.cur.page > 1){
                this.cur.page = Math.ceil(this.totalCount-1) / this.cur.pagesize;
              } 
              this.initData();
            } else {
              alert(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    // 推荐
    tuijianFun(id,nature) {
      _request.http(this, "opencourse/doUpdateRecomend", { openless_id: id ,nature:nature}).then(res => {
        if (res.code == 200) {
          this.initData();
        } else {
          alert(res.msg);
        }
      });
    },
    changeStatus(id, status, nature) {
      // 未发布状态修改
      // var statsObj = {"1":"未发布","2":"在售","3":"停售"};
      var stuArr = ["发布", "下架"];
      var text = stuArr[status]+"课程";
      this.$confirm(text + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request
            .http(this, "opencourse/doUpdateStatus", { openless_id: id,nature:nature})
            .then(res => {
              if (res.code == 200) {
                this.initData();
              } else {
                alert(res.msg);
              }
            });
        })
        .catch(() => {});
    },
    editCourse(id,nature) {
      var urlParam = `?transId=${id}&transNature=${nature}`;
      this.$router.push("/courses/openCousesSub/add" + urlParam);
    },
    selxuekeFun(item) {
      // 选择学科
      this.selxuekeIndex = item.id;
      this.xiaoleiArr = [{ id: 0, name: "全部" }];
      this.xiaoleiArr = this.xiaoleiArr.concat(item.childs || []);
      this.selxiaoleiIndex = 0;
      this.searchData.parent_id = item.id;
      this.searchData.child_id = 0;
      this.select();
      //  parent_id:Number,
      //   child_id:Number,
    },
    selxiaoleiFun(item) {
      this.selxiaoleiIndex = item.id;
      this.searchData.child_id = item.id;

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
      _request.http(this, "opencourse/subject").then(res => {
        var getData = res.data;
        this.subjectArr = getData;
        this.searchData.parent_id = getData[0]["id"];
        this.selxuekeIndex = getData[0]["id"];
        this.searchData.child_id = 0;
        this.xiaoleiArr = this.xiaoleiArr.concat(getData[0]["childs"] || []);
        this.initData();
      });
    },
    select() {
      this.paginationShow = false;
      this.cur.page = 1;

      this.$nextTick(() => {
        this.initData();
        this.paginationShow = true;
      });
    },

    changeShowBox(type, box) {
      var boxInt = parseInt(type);
      this.transData = box;
      // 添加
      // this.showList = false;
      // this.courseSelfId = "";
      // this.courseSeNature = "";
      // this.courseAddBox = true;
       var urlParam = `?transId=&transNature=`;
      this.$router.push("/courses/openCousesSub/add" + urlParam);
    },
    marksureFun() {
      this.initData();
      this.showList = true;
      this.courseAddBox = false;
    },
    closeCom(box) {
      this.courseAddBox = false;
      this.showList = true;
    },

    initData() {
      _request
        .http(this, "opencourse/getList", this.searchData, this.cur)
        .then(res => {
          var getData = res.data.open_less_list;          
          for(let i = 0; i<getData.length;i++){
              let timeArr = getData[i]['time'];
              let time0 = timeArr[0].split(' ');
              let time1 = timeArr[1].split(' ');
              let time = time0[0] + ' '+time0[1]+'-'+time1[1];
              getData[i].times = time;
          }
          this.dataList = getData;
          this.totalCount = res.data.total;
          this.nextPage = parseInt(res.data.page);
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
  created() {
    this.getSubjectList();
    // this.getPayChannels();
    // console.log(this.$store.state.SecHeadClick);
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", data => {
        this.showList = data;
        this.courseAddBox = false;
      });
    }
  }
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
      font-size: 16px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin: 20px 0 16px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .jiage {
      color: #FF0000;
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
