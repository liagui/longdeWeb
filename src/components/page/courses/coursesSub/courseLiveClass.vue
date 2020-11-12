<template>
  <div class="container-box">
    <div class="paike">
      <div class="paike-head"><span  @click="initData">排课表 <i class="el-icon-refresh"></i></span></div>
      <div>
        <div class="paike-content" v-for="(item,index) in dataList" :key="index">
          <div class="item-head">{{item.name}}</div>
          <div class="item-center">
            <el-tooltip class="item" effect="light" placement="right">
              <div slot="content" class="tooltip-mess">为此课程中每个单元指定默认报名班号，报名此课程时默认安排到此班号中</div>
              <el-button>
                指定默认报名的班号
                <i class="el-icon-question"></i>
              </el-button>
            </el-tooltip>
            <div class="item-cont">
              <el-radio-group v-model="postData.checked[index]">
                <el-row v-for="(subItem,index) in item.shift_no" :key="index">
                  <el-radio :disabled="nature" :label="subItem.id" >
                    <span class="banhao-name">{{subItem.name}}</span>
                    <div class="banhao-Desc">
                      课次：{{subItem.class_num}}次
                      <span>课时：{{subItem.class_time}}</span>
                    </div>
                  </el-radio>
                </el-row>
              </el-radio-group>
            </div>
          </div>
          <div class="item-right">
            <el-button type="primary" :disabled="nature" @click="adminClass(item)">管理班号</el-button>
          </div>
        </div>
        <div class="footBtn">
          <el-button class="sub-btn" @click="clearFun">取消</el-button>
          <el-button class="sub-btn" :disabled="nature" @click="marksureFun">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components: {},
  props: ["transData",'transUnitDataNature'],
  data() {
    return {
      postData:{
        first:[],
        checked:[]
      },
      nature:Boolean(this.transUnitDataNature),
      id: this.transData,
      dataList: [],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    
    // 保存
    marksureFun() {
      console.log(JSON.stringify(this.postData))
      
       _request
        .http(this, "course/liveToCourseshift", this.postData)
        .then(res => {
          if(res.code == 200){
            this.$toast(res.msg);
            this.initData();
          }
        });
    },
    clearFun() {
      this.$emit("clearFun");
    },
    initData() {
      _request
        .http(this, "course/liveToCourseList", { id: this.id })
        .then(res => {
          this.postData.first = res.first;
          this.postData.checked = res.checked
          this.dataList = res.data;
        });
    },
    adminClass(item) {
      localStorage.setItem("openCourseLiveDetail", item.resource_id);
      localStorage.setItem("openCourseLiveDetailNature", this.$route.query.nature);
         debugger
      let isZongKong = this.$store.state.school_status == 1; //总控1 中控0
      let hrefStr = isZongKong ? "/#/resourceGeneral/generalliveresource": "/#/resources/liveResource";
      let href = window.location.origin + hrefStr;
      window.open(href, "_blank");

   
    }
  }
};
</script>
<style scoped lang="less">
.formbox {
  // padding-right: 20px;
  .editHead {
    // width: 100%;
    // display: flex;
    // justify-content: space-between;
    padding: 10px 20px 20px;
    // align-items: center;
    font-size: 14px;
  }
}

/deep/ .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
/deep/ .el-button--text {
  color: #999;
}

.text-center {
  text-align: center;
}
.foot-btn {
  text-align: right;
  padding: 20px 35px 0 0;
}

.width-400 {
  width: 380px;
}
/deep/ .el-upload--text {
  border: 0;
}
/deep/ .el-icon-right,
.el-icon-back {
  border: 0;
  color: #28a745;
  font-weight: bold;
}
/deep/ .el-icon-delete {
  border: 0;
  color: #dc3545;
  font-weight: bold;
}
/deep/ .el-icon-edit-outline {
  border: 0;
  color: #ffc107;
  font-weight: bold;
}
.paike {
  .paike-head {
    font-size: 16px;
    margin-left: 25px;
    cursor: pointer;
  }
  
  .paike-content {
    display: flex;
    align-items: center;
    padding: 15px 0;
    background: #fff;
    margin: 5px 25px;
    .item-head {
      width: 200px;
      font-size: 16px;
      margin: 0 10px;
      text-align: center;
      font-weight: bold;
    }
    .item-center {
      flex: 1;
      border-left: 1px solid #e9e5ea;
      border-right: 1px solid #e9e5ea;
      padding: 0 10px;
      .item-cont {
        margin-top: 10px;
        .banhao-name {
          font-weight: bold;
          height: 30px;
          line-height: 30px;
        }
        .banhao-Desc {
          padding-left: 24px;
          font-size: 12px;
        }
      }
    }
    .item-right {
      width: 100px;
      text-align: center;
    }
  }
}

.tooltip-mess {
  width: 300px;
  padding-right: 20px;
}
.footBtn {
  margin-top: 20px;
  text-align: right;
  padding-right: 30px;
}

</style>
