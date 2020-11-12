<template>
  <div class="show-box" v-cloak>
    <div class="kecheng-box">
      <!-- 直播列表数据-->
      <div class="item-content">
        <div class="item-head">
          <div class="class-status zhibozhong" v-text="state == 1?'预开始':state == 2?'直播中':'已结束'"></div>
          <!-- <div class="class-date">{{dataList.time}}</div> -->
        </div>
        <div class="item-center">
          <el-row>
            <el-col :span="9">
              <img src="../../../assets/image/jiaoxue/icon1.png" class="item-img" alt="图片" />班号名称：
              <span class="item-detail">{{dataList.class_name}}</span>
            </el-col>
            <el-col :span="9">
              <img src="../../../assets/image/jiaoxue/icon3.png" class="item-img" alt="图片" />课次名称：
              <span class="item-detail">{{dataList.title}}</span>
            </el-col>
          </el-row>
          <el-row class="col-row">
            <el-col :span="9">
              <img src="../../../assets/image/jiaoxue/icon2.png" class="item-img" alt="图片" />授课老师：
              <span class="item-detail">{{dataList.lect_teacher_name}}</span>
            </el-col>
            <el-col :span="9">
              <img src="../../../assets/image/jiaoxue/icon4.png" class="item-img" alt="图片" />时长：
              <span class="item-detail">{{dataList.time}}</span>
            </el-col>
            <el-col :span="6">
              <img src="../../../assets/image/jiaoxue/icon5.png" class="item-img" alt="图片" />学员数量：
              <span class="item-detail">{{dataList.watch_num}}人</span>
            </el-col>
          </el-row>
        </div>
        <div class="item-right">
           <el-button
              type="primary"
              v-if="state == 1"
              @click="openLecture(dataList.class_id,dataList.is_public)"
              class="reset-button"
            >{{dataList.statusName}}</el-button>
            <el-button
              type="primary" 
              v-else-if="state == 2"
              @click="liveLecture(dataList.class_id,dataList.is_public,dataList.classno_id)"
              class="reset-button"
            >{{dataList.statusName}}</el-button>
            <el-button
              type="primary"
              v-else
              @click="lookBack(dataList.class_id,dataList.is_public)"
              class="reset-button"
            >{{dataList.statusName}}</el-button>
          <!-- <el-button type="primary" class="reset-button">开始讲课</el-button> -->
          <el-button type="success" @click="goback" class="goback-button">返回</el-button>
        </div>
      </div>
      <div class="liveDetail">
        <!-- 资源信息 -->
        <div class="detail-head">直播资源</div>
        <div class="detail-box">
          <el-row>
            <el-col :span="11" class="set-paddingLeft">
              <img src="../../../assets/image/jiaoxue/icon1.png" class="item-img" alt="图片" />直播主题：
              <span class="item-detail">{{dataList.title}}</span>
            </el-col>
            <el-col :span="6">
              <img src="../../../assets/image/jiaoxue/icon3.png" class="item-img" alt="图片" />老师：
              <span class="item-detail">{{dataList.lect_teacher_name}}</span>
            </el-col>
            <el-col :span="7">
              <img src="../../../assets/image/jiaoxue/icon4.png" class="item-img" alt="图片" />开始时间：
              <span class="item-detail">{{dataList.start_at}}</span>
            </el-col>
          </el-row>
          <el-row class="col-row">
            <el-col :span="11" class="set-paddingLeft">
              <img src="../../../assets/image/jiaoxue/icon5.png" class="item-img" alt="图片" />教务：
              <span class="item-detail">{{dataList.edu_teacher_name}}</span>
            </el-col>
            <el-col :span="6">
              <img src="../../../assets/image/jiaoxue/live6.png" class="item-img" alt="图片" />当前状态：
              <span class="item-detail">{{dataList.status}}</span>
            </el-col>
            <el-col :span="7">
              <img src="../../../assets/image/jiaoxue/live4.png" class="item-img" alt="图片" />结束时间：
              <span class="item-detail">{{dataList.end_at}}</span>
            </el-col>
          </el-row>
        </div>
        <!-- 课件信息 -->
        <div class="detail-head">
          课件信息  <i class="el-icon-refresh" @click="refresh"></i>
          <el-upload
            ref="upload"
            :action="fileUploadPath"
            :auto-upload="true"
            :data='fileData'
            :show-file-list="false"
            class="avatar-uploader"
            :headers="setHead"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-button size="small" type="primary">上传课件</el-button>
          </el-upload>
        </div>
        <el-table
          :data="dataList.courseware"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
        >
          <el-table-column prop="name" label="文件名称"></el-table-column>
          <el-table-column label="大小">
            <template  slot-scope="scope">
                <div>
                  {{(parseInt(scope.row.size)/1024/1024).toFixed(2)}} MB
                </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="上传状态">
            <template  slot-scope="scope">
                <div v-text="scope.row.status == 0?'成功':'失败'">
                 
                </div>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="上传时间"></el-table-column>
          <el-table-column prop="nickname" label="上传者"></el-table-column>          
          <el-table-column prop="errorDesc" label="操作" title="操作" width="160">
            <template slot-scope="scope">
              <el-button type="delete" @click="deletItem(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
export default {
  data() {
    return {
      fileUploadPath: this.GLOBAL.ajaxurl+'teach/coursewareUpload',
      setHead: this.GLOBAL.setHead(),
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
        status: "0",
        timeRange: [],
        teacher: "",
        classTime: "",
        className: ""
      },
      showSelTime: false,
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      totalCount: 20,
      dataList: [],
      fileData:{
         is_public: Number,
        classno_id: Number,
        class_id: Number
      },
      is_refresh:false,
      timeout:'',
      state:this.$route.query.state

    };
  },
  mounted() {
    this.fileData = {
         is_public: this.$route.query.public,
        classno_id: this.$route.query.classno_id,
        class_id: this.$route.query.id
      }
  },
  created(){    
    this.initData();
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
      var type = localStorage.getItem('teacher_type');
      _request
        .http(this, "teach/startLiveChild", { id: id, is_public: is_public })
        .then(res => {
          if (res.code == 200) {
            if(type == 2){
              window.open(res.data.url);
            }else if(type == 1){
              window.open(res.data.liveUrl);
            }
            else{
              this.$message.error('只有讲师和教务才能进入直播间') //2讲师1教务0其他不允许进入
            }            
            // window.open('http://testwo.admin.longde999.cn/web/lecturePaqge.html?'+param);
            // 讲师可以使用摄像头  教务不能
          }
        });
    },
    // 进直播间
    liveLecture(classId,ispublic,courseId){
      var id= '';
      // if(ispublic ==  1){
      //   // class_id  公开课
      //     id = classId;
      // }else{
      //   // 
      //     id = courseId;
      // }
      id = classId;
      var type = localStorage.getItem('teacher_type');
       _request
        .http(this, "teach/liveInRoom", { id: id, is_public: ispublic })
        .then(res => {
          if (res.code == 200) {
            if(type == 2){   //2讲师1教务0其他不允许进入
              // window.open(res.data.liveVideoUrl);
              window.open(res.data.url);
            }else if(type == 1){
              window.open(res.data.liveVideoUrl);
            }
            else{
              this.$message.error('只有讲师和教务才能进入直播间')
            }
          }
        })

    },
    refresh(){       
        if(this.is_refresh){
          clearTimeout(this.timeout);
        } else{
          this.initData();          
        }    
        this.is_refresh = true;       
        this.timeout = setTimeout(()=>{              
          this.is_refresh = false;
        },500)  
    },
    deletItem(id){
      this.$confirm("删除该课件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        _request.http(this, "teach/coursewareDel", { id: id}).then(res => {         
          if (res.code == 200) {
            this.initData();
          } else {
            this.$toast(res.msg);
          }
        });
      })
      .catch((data) => {
        
      });    
    },
    goback() {
      // this.$emit("closeDetail");
      this.$router.go(-1);
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        // 上传之后不能实时调取出来
         this.$message('上传成功，点击刷新按钮刷新页面');
            
      } else {
        alert(res.msg);
      }
    },
    changeFiles(file){
      console.log(file);
      var form = new FormData();
      form.append('file',file);
      form.append('is_public',this.$route.query.public);
      form.append('classno_id',this.$route.query.classno_id);
      form.append('class_id',this.$route.query.id);
       _request
        .http(this, "teach/coursewareUpload", form)
        .then(res => {
          this.dataList = res.data;
        });
    },
    beforeAvatarUpload(file) {
      // return testPostImage(file);
    },
    initData() {
      _request
        .http(this, "teach/details", {
          is_public: this.$route.query.public,
          classno_id: this.$route.query.classno_id,
          class_id: this.$route.query.id
        })
        .then(res => {
          this.dataList = res.data;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.show-box {
  margin: 5px 25px;
}
.item-content {
  display: flex;
  align-items: center;
  padding: 30px 0;
  background: #fff;
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
  }
  .item-right {
    width: 220px;
    text-align: center;
    .reset-button {
      min-width: 90px;
      height: 70px;
      border-radius: 5px;
      font-size: 14px;
    }
    .goback-button {
      height: 70px;
      border-radius: 5px;
      font-size: 14px;
      float: right;
      margin-right: 20px;
    }
    
  }
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
.liveDetail {
  .detail-head {
    font-size: 15px;
    font-weight: bold;
    border-left: 4px solid rgba(37, 163, 253, 1);
    padding-left: 10px;
    color: rgba(51, 51, 51, 1);
    margin: 30px 0 20px;
  }
  .detail-box {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    padding: 30px 0;
    color: #666;
    font-size: 14px;
    .set-paddingLeft {
      padding-left: 10px;
    }
    .item-detail {
      color: #333;
    }
  }
}

.width-177 {
  width: 177px;
}
/deep/ .avatar-uploader .el-upload {
  border: 0;
}
.avatar-uploader {
  float: right;
}

</style>