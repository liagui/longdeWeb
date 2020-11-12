<template>  
    <div class="archive-content">
      <div style="padding:20px;">
        <div class="content-order">缴费</div>
        <div class="cont-mess">&nbsp;&nbsp;新订单应缴费用</div>
        <div class="line-style">
          <div class="setWidth">
            <div class="money">￥</div>课程价格:
          <div class="leftColor">￥{{priceShow.order_price}}</div>
          </div>
          
          <div class="money">￥</div>商品总价:
          <div class="rightColor">￥{{priceShow.price}}</div>
        </div>

        <div class="cont-mess">&nbsp;&nbsp;原订单补缴费用</div>
        <div class="line-style">
          <div class="setWidth">
            <div class="money">￥</div>原订单总价:
            <div class="leftColor">￥{{priceShow.original_course_price}}</div>
          </div>
          <div class="money">￥</div>原订单已缴:
          <div class="rightColor">￥{{priceShow.original_order_price}}</div>
        </div>

        <div class="cont-mess">&nbsp;&nbsp;新订单补缴费用</div>
        <el-form :model="addData" label-width="100px" ref="addData" :rules="rule" :inline="true">
           <div>
              <el-form-item label="付款类型：" prop="pay_status">
                <el-select v-model="addData.pay_status" class="width-100" placeholder="请选择付款类型：">
                  <el-option
                    v-for="(item, index) in payment_typeArr"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
          
              <el-form-item label="付款方式：" prop="pay_type">
                <el-select
                  v-model="addData.pay_type"
                  class="width-100"
                  placeholder="请选择付款方式："
                >
                  <el-option
                    v-for="(item, index) in payment_methodArr"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="付款金额：" prop="price">
                <el-input
                  style="width:215px"
                  v-model="addData.price"
                  min="0"                  
                  placeholder="请输入付款金额"
                ></el-input>
              </el-form-item>
          
              <el-form-item label="付款时间：" prop="pay_time">
                <el-date-picker
                  style="width:215px"
                  v-model="addData.pay_time"
                  type="datetime"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </el-form-item>
          </div>
        </el-form>
        <div class="changeFooter">
          <el-button @click="orderPrevStep" class="clear-btn">上一步</el-button>
          <el-button @click="cancelFun" class="clear-btn">取消</el-button>
          <el-button @click="marksureFun" class="sub-btn">确定</el-button>
        </div>

      </div>
    </div>
  
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import { numAndDecimals2 } from "@/utils/rules";
export default {
  props:['selNature','selectCourseId','order_number'],
  data() {
    return {
      student_id: "",
      detailList: {},
      orderList: [],
      noData: false,
      lessionArr: [],
      rule: {
        pay_status: [
          { required: true, message: "请选择付款类型", trigger: "change" }
        ],
        pay_type: [
          { required: true, message: "请选择付款方式", trigger: "change" }
        ],
        price: [
          { required: true, message: "请输入付款金额", trigger: "blur" },
          { validator: numAndDecimals2, trigger: "blur" }
        ],
        pay_time: [
          { required: true, message: "请选择付款时间", trigger: "change" }
        ],
      },
      getMethods: "",
      addData: {
        order_number:this.order_number,
        pay_status:'',
        pay_type:'',
        price:'',
        pay_time:'',
        id:this.selectCourseId,
        nature: this.selNature,
      },      
      payment_typeArr: [],
      payment_methodArr: [],
      priceShow:{},
    };
  },
  mounted() {
    this.CommonList();
    this.coursePay();
  },
  methods: {
    orderPrevStep(){
      this.$emit('orderPrevStep');
    },
    cancelFun() {
      this.$router.go(-1);
    },
    marksureFun() {
      console.log(JSON.stringify(this.addData))
       _request.http(this, "course/classTransfer", this.addData).then(res => {
        if (res.code == 200) {         
          this.$message.success('转班成功');
          this.$router.go(-1);
        }

      });
    },

    CommonList() {
      _request.http(this, "student/getStudentCommonList").then(res => {
        if (res.code == 200) {         
          this.payment_typeArr = res.data.payment_type;
          this.payment_methodArr = res.data.payment_method;
        }
      });
    },
    coursePay() {
      _request.http(this, "course/coursePay",{
        id:this.selectCourseId,
        nature:this.selNature,
        order_number:this.order_number,
      }).then(res => {
        if (res.code == 200) {         
          this.priceShow = res.data;
        }
      });
    },
    // 选择课程之后获取课程信息
    selLession(item) {
      console.log(item);
      // id: this.addData.lession_id,nature:nature
      _request
        .http(this, "course/courseDetail", {
          id: this.addData.lession_id,
          nature: this.addData.nature,
        })
        .then((res) => {
          if (res.code == 200) {
            // this.getMethods = res.data.method;
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
          school_id: this.$route.query.school_id,
        })
        .then((res) => {
          if (res.code == 200) {
            this.lessionArr = res.data;
          }
        });

      this.addData.lession_id = "";
    },
  },
  watch: {
    student_id(val) {
      console.log(val);
      this.getDetail();
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
.line-style {
  margin-bottom: 40px;
  height: 16px;
  list-style: 16px;
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}
.money {
  display: inline-block;
  color: #fff;
  width: 16px;
  height: 16px;
  line-height: 16px;
  border: 0;
  text-align: center;
  background: #999;
  border-radius: 8px;
  margin-right: 4px;
}
.setWidth{
  display: inline-block;
  width: 350px;
  margin-left: 20px;
}
.leftColor {
  display: inline-block;
  color: #ff551d;
}
.rightColor {
  display: inline-block;
  color: #1cc700;
}
.changeFooter{
  text-align: right;
  margin: 20px 30px;
}
</style>