<template>
  <div class="archive-content">
    <keep-alive>
    <div style="padding:20px;">
      <div class="content-order">选择课程</div>
      <div class="cont-mess">&nbsp;&nbsp;订单信息</div>
      <el-form :model="addData" label-width="100px" ref="addData" :rules="rule" :inline="true">
        <el-form-item label="学科分类：" prop="parent_id">
          <el-cascader
            v-model="addData.parent_id"
            collapse-tags
            :options="subjectArr"
            @change="selSubject"
            :props="{checkStrictly: true,value:'id',label:'name',children:'childs',expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="选择课程：" prop="lession_id">
          <el-select v-model="addData.lession_id" value-key="item.id" @change="selLession">
            <el-option
              v-for="(item, index) in lessionArr"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授课类型：" prop="lession_id">
          <span class="methodsStyle">{{getMethods}}</span>
        </el-form-item>
      </el-form>

      <div class="cont-mess">&nbsp;&nbsp;课程信息</div>
      <div v-if="liveArr.length">
        <div v-for="(item,index) in liveArr" class="liveBox" :key="index">
          <div class="liveLeft">
            <div class="leftName">{{item.livename}}</div>
            <div class="leftText">
              课程类型：
              <span class="zhibo">{{item.type}}</span>
            </div>
          </div>
          <div class="liveRight">
            <span class="m-color">{{item.livearr.name}}</span>
            <span class="m-left">课次：{{item.livearr.class_num}}</span>
            <span class="m-left">课时：{{item.livearr.class_time}}</span>
          </div>
        </div>
      </div>
      <div v-if="lubo.type">
        <div class="liveBox">
          <div class="liveLeft">
            <div class="leftName">{{lubo.recordedname}}</div>
            <div class="leftText">
              课程类型：
              <span class="zhibo">{{lubo.type}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="rest.type">
        <div class="liveBox">
          <div class="liveLeft">
            <div class="leftName">{{rest.recordedname}}</div>
            <div class="leftText">
              课程类型：
              <span class="zhibo">{{rest.type}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="changeFooter">
        <el-button @click="cancelFun" class="clear-btn">取消</el-button>
        <el-button @click="marksureFun" class="sub-btn">下一步</el-button>
      </div>
    </div>
    </keep-alive>
  </div>
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
export default {
  props: ["order_number","school_id"],
  data() {
    return {
      detailList: {},
      orderList: [],
      noData: false,
      subjectArr: [],
      lessionArr: [],
      rule: {},
      getMethods: "",
      addData: {
        parent_id: "",
        lession_id: "",
        nature: "",
      },
      liveArr: [],
      lubo: {},
      rest: {},
    };
  },
  mounted() {
    this.selSchool();
    this.initData();
  },
  methods: {
    cancelFun() {
      this.$router.go(-1);
    },
    marksureFun() {
      if (this.addData.lession_id) {
        this.$emit('marksureFun',this.addData.lession_id,this.addData.nature)
        // this.$router.push({
        //   path: "/users/students/changeClassOrder",
        //   query: {
        //     order_number: this.order_number,
        //     course_id: this.addData.lession_id,
        //   },
        // });
      } else {
        this.$message.error("请选择课程");
      }
    },
    // 选择课程之后获取课程信息
    selLession(item) {
      console.log(item);
      // id: this.addData.lession_id,nature:nature
      var courseList = this.lessionArr;
      var selId = this.addData.lession_id;
      courseList.forEach(item=>{
        if(item.id == selId){
          this.addData.nature = item.nature;
        }
      })
      _request
        .http(this, "course/courseDetail", {
          id: this.addData.lession_id,
          nature: this.addData.nature,
        })
        .then((res) => {
          if (res.code == 200) {
            if (res.data.live) {
              this.liveArr = res.data.live;
            }
            if (res.data.lubo) {
              this.lubo = res.data.lubo;
            }
            if (res.data.rest) {
              this.rest = res.data.rest;
            }
            this.getMethods = res.data.methodtype;
          }
        });
    },
    // 根据学科ID获取课程
    selSubject(val) {
      _request
        .http(this, "courseType", {
          parent_id: val,
          school_id: this.school_id,
        })
        .then((res) => {
          if (res.code == 200) {
            this.lessionArr = res.data;
          }
        });

      this.addData.lession_id = "";
    },
    selSchool() {
      _request
        .http(this, "subject", { school_id: this.schoolId })
        .then((res) => {
          this.subjectArr = res.data;
        });
    },
    initData() {
      _request
        .http(this, "course/consumerUser", {
          order_number: this.$route.query.order_number,
        })
        .then((res) => {
          if (res.code == 200) {
            this.detailList = res.data;
          }
        });
    },
  },
};
</script>

<style scoped lang="less">
.archive {
  margin: 0 25px;
}
.archive-head {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  padding: 30px 10px 20px;

  .head-box {
    display: flex;
  }
  .head-mess {
    flex: 1;
    font-size: 14px;
    color: #666;

    .el-col {
      margin-bottom: 20px;
    }
  }
  .text-333 {
    color: #333;
  }
  .head-right {
    font-size: 14px;
    color: #666;
    margin-bottom: 38px;
  }
}
.item-img {
  vertical-align: top;
  margin-right: 2px;
}
.right-img {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 5px;
}
.statusbox {
  width: 100px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  border: 0;
  background: #ddd;
  border-radius: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  margin-right: 30px;
}
.archive-content {
  background: #fff;
  margin-top: 15px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05);
  .content-order {
    font-size: 24px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 20px;
  }
  .cont-mess {
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    border-left: 4px solid rgba(38, 164, 253, 1);
    margin-bottom: 30px;
  }
}
.liveBox {
  display: flex;
  padding: 20px 10px;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  margin-bottom: 10px;
}
.liveLeft {
  width: 50%;
  border-right: 1px solid rgba(224, 224, 224, 1);
}
.liveRight {
  flex: 1;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  margin-top: 30px;
  padding-left: 20px;
}
.leftName {
  font-size: 20px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 30px;
  margin-bottom: 20px;
}
.leftText {
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}
.zhibo {
  color: #1cc700;
}
.m-color {
  color: #333;
}
.m-left {
  margin-left: 10px;
}
.changeFooter {
  text-align: right;
  margin: 20px 30px;
}
.methodsStyle{
  font-weight:500;
  color:rgba(51,51,51,1);
}
</style>