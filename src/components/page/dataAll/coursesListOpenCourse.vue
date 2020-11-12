<template>
  <div class="courses-list">
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
              {{ item.subject_name }}
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
              {{ item.subject_name }}
            </div>
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
        <!-- <div class="type-list">
          <div class="typeName">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</div>
          <div class="typeList">
            <div
              class="typeItem"
              v-for="(item, index) in leixingArr"
              :key="index"
              @click="selLeixingFun(item)"
              :class="{ typeActive: selleixingIndex == item.id }"
            >{{ item.name }}</div>
          </div>
        </div> -->
      </div>
      <button class="addCourse" @click="addCourse()">+ 添加课程授权</button>      
      <button class="updateRevoke" @click="updateRevoke">授权更新</button>
      <div class="clearfix">
        <div class="kechengs" v-for="(item, index) in payInfos" :key="index">
          <div class="classStatus">
            <div
              v-if="item.status == 0"
              @click="changeStatus(item.id, 2)"
              class="grey"
            >
              未发布
            </div>
            <div
              v-else-if="item.status == 1"
              @click="changeStatus(item.id, 3)"
              class="success"
            >
              在售
            </div>
            <div v-else class="primary" @click="changeStatus(item.id, 2)">
              停售
            </div>
          </div>
          <!-- <div class="tuijian" :class="{ active: index == 1 }">荐</div> -->
          <!-- <img src="../../../assets/image/kecheng.png" class="kecheng-img" alt /> -->
          <img v-if="item.cover" :src="item.cover" class="kecheng-img" alt />
          <img
            v-else
            src="../../../assets/image/defaultImg.png"
            class="kecheng-img"
            alt
          />
          <div class="kecheng-status">
            <span class="shangjia">{{ item.nature }}</span>
            <div class="courseStus">
              <span
                v-for="(item, index) in item.method"
                class="status"
                :key="index"
                @click="changeShowBox(item.id)"
                >{{ item.method_name }}</span
              >
            </div>
          </div>
          <div class="kecheng-detail">
            <div class="kecheng-title">{{ item.title }}</div>
            <div>
              价格：
              <span v-if="!item.pricing" class="jiage">免费</span>
              <span v-else class="jiage">￥{{ item.pricing }}</span>
            </div>
            <div class="shangxian">
              观看人数：
              <!-- <span v-if="item.nature == 0" class="renshu">
                {{ item.buy_nember }}
              </span>
              <span v-else @click="editStock(item.id)" class="renshu">
                {{ item.buy_nember }}
                <i class="ceiling">/{{ item.sum_nember }} 人</i>
              </span> -->
              <span class="renshu">
                <i class="ceiling">{{ item.watch_num }} 人</i>
              </span>
            </div>
            <div class="seeDetail">
              <div v-if="item.nature == '授权课程'" class="seeDeatil-btn" @click='revoke(item.id)'>取消授权</div>
            </div>
            <!-- <button class="seeDetail" @click="delCourse(item.id)">删除</button>
            <button class="seeDetail" @click="editCourse(item.id)">编辑</button>-->
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            v-if="payInfos.length"
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
      <course-auth  v-if='showCoursesAuth' :showCoursesAuth='showCoursesAuth' @marksure='marksureFun' @close='closeFun' :transDataAuth='transDataAuth'></course-auth>
      <div class="noData" v-if="noData">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import _request from '@/utils/request'
import courseAuth from './openCourseAuth'
export default {
  // inject: ['schoolSelf'],
  props:['trandSchoolId'],
  components:{
    courseAuth,
  },
  data() {
    return {
      payInfos: [],
      showCoursesAuth:false,
      transDataAuth:{
        school_id:'',
      },
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20,
      },
      nextPage: 1,
      totalCount: 20,
      searchData: {
        subjectOne: '',
        subjectTwo: '',
        // type:'',
        school_id: this.trandSchoolId,
      },
      // subjectArr: [],
      subjectArr: [{ id: 0, subject_name: '全部' }],
      selxuekeIndex: 0,
      xiaoleiArr: [{ id: 0, subject_name: '全部' }],
      selxiaoleiIndex: 0,
      leixingArr: [
        { id: 0, name: '全部' },
        { id: 1, name: '直播' },
        { id: 2, name: '录播' },
        { id: 3, name: '其他' },
      ],
      authArr: [
        { id: 0, name: "全部" },
        { id: 1, name: "自增" },
        { id: 2, name: "授权" }
      ],
      selleixingIndex: 0,
      selfabuIndex: 0,
      selauthIndex: 0,
      noData: false,
    }
  },
  created() {
    // this.initData();
    this.getSubjectList()
    // this.getPayChannels();
    // console.log(this.$store.state.SecHeadClick);
  },
  methods: {
    // 授权更新
    updateRevoke(){
      _request.http(this, "courschool/authorUpdate", {is_public:1,school_id:this.trandSchoolId})
        .then(res => {          
          if(res.code == 200){
            this.$message.success(res.msg);
            this.getSubjectList();
          }else{
            this.$message.error(res.msg);
          }
        });      
    },
    // 取消授权、
    revoke(id){
      this.$confirm("取消授权, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
         _request.http(this, "courschool/courseCancel", {is_public:1,school_id:this.trandSchoolId,course_id:id})
        .then(res => {
          this.getSubjectList();
        });
      })
      .catch((data) => {
        
      });
    },
     marksureFun(){
        this.showCoursesStock = false;
        this.showCoursesAuth = false;
        this.getSubjectList();
    },
    closeFun(){
      this.showCoursesStock = false;
      this.showCoursesAuth = false;
    },    
    addCourse() {
      // this.schoolSelf.showOpenCoursesAuth = true
       this.showCoursesAuth = true;
      this.transDataAuth.school_id = this.trandSchoolId;
    },
    changeStatus(id, status) {
      // 未发布状态修改
      // var statsObj = {"1":"未发布","2":"在售","3":"停售"};
      // var stuArr = ['', '未发布', '在售', '停售']
      // var text = '修改课程状态为' + stuArr[status]
      // this.$confirm(text + ', 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // })
      //   .then(() => {
      //     _request
      //       .http(this, 'UpdateLessonStatus', { id: id, status: status })
      //       .then((res) => {
      //         if (res.code == 200) {
      //           this.initData()
      //         } else {
      //           alert(res.msg)
      //         }
      //       })
      //   })
      //   .catch(() => {})
    },
    selxuekeFun(item) {
      // 选择学科
      this.selxuekeIndex = item.id

      this.xiaoleiArr = [{ id: 0, subject_name: '全部' }]
      // this.xiaoleiArr = this.xiaoleiArr.concat(item.children)
      if (item.children) {
        this.xiaoleiArr = this.xiaoleiArr.concat(item.children)
      }
      this.selxiaoleiIndex = 0
      this.searchData.subjectOne = item.id
      this.searchData.subjectTwo = 0
      this.select()
    },
    selxiaoleiFun(item) {
      this.selxiaoleiIndex = item.id
      this.searchData.subjectTwo = item.id
      this.select()
    },
    selLeixingFun(item) {
      this.selleixingIndex = item.id
      this.searchData.type = item.id
      this.select()
    },
    selauthFun(item) {
      this.selauthIndex = item.id;
      this.searchData.nature = item.id;
      this.select();
    },
    getSubjectList() {
      _request
        .http(this, 'school/getSubjectList', {
          school_id: this.trandSchoolId,
          is_public: 1,
        })
        .then((res) => {
          if(res.code == 200){
            var getData = res.data
            // this.subjectArr = getData
            this.subjectArr = [{ id: 0, subject_name: "全部" }].concat(getData)
            // this.selxuekeIndex = getData[0]['id']
            // this.searchData.subjectOne = getData[0]['id']
            this.searchData.subjectOne = 0
            // this.xiaoleiArr = this.xiaoleiArr.concat(getData[0]['children'])
            this.searchData.subjectTwo = 0
            this.initData()
          }else{
            this.$message.closeAll();
            this.$message.error(res.msg)
          }

        })
    },
    select() {
      this.paginationShow = false
      this.cur.page = 1
      this.$nextTick(() => {
        this.initData()
      })
    },

    changeShowBox(box) {
      console.log(box)
      switch (box) {
        case 0: {
          // 添加
          this.showList = false
          this.showLuboBox = false
          this.showZhiboBox = false
          this.courseSelfId = ''
          this.courseAddBox = true
          break
        }
        case 1: {
          //直播
          this.showList = false
          this.courseAddBox = false
          this.showLuboBox = false
          this.showZhiboBox = true
          break
        }
        case 2: {
          // 录播
          this.showList = false
          this.courseAddBox = false
          this.showZhiboBox = false
          this.showLuboBox = true
          break
        }
      }
    },
    initData() {
      _request
        .http(this, 'school/getOpenLessonList', this.searchData, this.cur)
        .then((res) => {
          if (res.data.length) {
            this.payInfos = res.data
            this.totalCount = res.total
            this.noData = false
          } else {
            this.payInfos = []
            this.noData = true
          }
        })
    },

    //每页
    handleSizeChange(val) {
      this.cur.pagesize = val
      this.initData()
    },
    //第几页
    handleCurrentChange(val) {
      this.cur.page = val
      this.initData()
    },
  },
}
</script>

<style lang="less" scoped>
.kecheng-box {
  position: relative;
  .type-list {
    display: flex;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .search-box {
    padding: 20px 20px 1px;
    margin: 0 25px 20px;
    background: #fff;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    .typeName {
      float: left;
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
  .addCourse {
    height: 45px;
    background: linear-gradient(
      -90deg,
      rgba(38, 164, 253, 1),
      rgba(107, 149, 253, 1)
    );
    border-radius: 3px;
    line-height: 45px;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    line-height: 45px;
    padding: 0 15px;
    border: 0;
    margin-bottom: 20px;
    margin-left: 18px;
  }
  .updateRevoke {
    float: right;
    margin-right: 20px;
    height: 45px;
    background: linear-gradient(
      -90deg,
      rgba(107, 149, 253, 1),
      rgba(38, 164, 253, 1)
    );
    border-radius: 3px;
    line-height: 45px;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    line-height: 45px;
    padding: 0 15px;
    border: 0;
    margin-bottom: 20px;
    margin-left: 18px;
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
      overflow: hidden;
      border-radius: 2px;
      font-size: 14px;
      cursor: pointer;
      .grey {
        color: rgba(102, 102, 102, 1);
      }
      .success {
        background: #1cc700;
        color: #fff;
      }
      .primary {
        background: #e9001d;
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
      cursor: pointer;
      color: #1cc700;
    }
    .ceiling {
      font-style: normal;
      color: #999999;
    }
    .seeDetail {
      cursor: pointer;
      float: right;
      margin-left: 5px;
      margin-top: 20px;
      margin-bottom: 10px;
      background: rgba(255, 255, 255, 1);
      height: 30px;
      // border-radius: 15px;
      font-size: 12px;
      color: rgba(102, 102, 102, 1);
      .seeDeatil-btn{
        padding: 0 15px;
        height: 30px;
        line-height: 30px;
        border: 1px solid rgba(230, 230, 230, 1);
      }
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
