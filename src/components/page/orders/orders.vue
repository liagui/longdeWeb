<template>
  <div class="container-box">
    <div v-if="showList">
      <div class="content-head">
        <span>订单管理</span>
        <el-form :model="whereArr" :rules="rule" ref="order" :inline="true">
          <el-form-item>
            <el-select
              v-model="whereArr.school_id"
              style="width:150px;"
              placeholder="选择网校"
              clearable
              @change="select"
            >
              <el-option
                v-for="(item, index) in schoolBranch"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="whereArr.status"
              style="width:150px;"
              placeholder="选择状态"
              @change="select"
            >
              <el-option
                v-for="(item, index) in payStatus"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-date-picker
            v-model="whereArr.state_time"
            class="apply"
            style="width:130px !important;"
            type="date"
            placeholder="开始时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="startpickerOptions"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="whereArr.end_time"
            class="apply"
            style="width:130px !important;"
            type="date"
            placeholder="结束时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <el-form-item>
            <el-input
              placeholder="订单号/姓名/手机号"
              style="width:200px"
              prefix-icon="el-icon-search"
              v-model="whereArr.order_number"
              @blur="searchArticle"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="select">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content-cont">
        <el-table
          :data="orderInfos"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
          :max-height="tableHeight"
        >
          <el-table-column prop="order_number" label="订单编号" title="订单编号"></el-table-column>
          <el-table-column prop="order_type" label="订单类型" title="订单类型">
            <template slot-scope="scope">
              <span v-if="scope.row.order_type == 1">后台录入</span>
              <span v-else>在线支付</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="账号" title="账号"></el-table-column>
          <el-table-column prop="real_name" label="学员姓名" title="学员姓名"></el-table-column>
          <el-table-column prop="price" label="金额(元)" title="金额"></el-table-column>
          <el-table-column prop="phone" label="手机号" title="手机号"></el-table-column>
          <el-table-column prop="pay_status" label="支付类型" title="支付类型">
            <template slot-scope="scope">
              <span v-if="scope.row.pay_status == 1">定金</span>
              <span v-if="scope.row.pay_status == 2">尾款</span>
              <span v-if="scope.row.pay_status == 3">最后一笔尾款</span>
              <span v-if="scope.row.pay_status == 4">全款</span>
            </template>
          </el-table-column>
          <el-table-column prop="pay_type" label="支付方式" title="支付方式">
            <template slot-scope="scope">
              <span v-if="scope.row.pay_type == 1">微信</span>
              <span v-if="scope.row.pay_type == 2">支付宝</span>
              <span v-if="scope.row.pay_type == 3">银行转账</span>
              <span v-if="scope.row.pay_type == 4">汇聚</span>
              <span v-if="scope.row.pay_type == 5">苹果内购</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="支付状态" title="支付状态">
            <template slot-scope="scope">
              <span class="primary" v-if="scope.row.status == 0">待支付</span>
              <span class="warning" v-if="scope.row.status == 1">支付待审核</span>
              <span v-if="scope.row.status == 2">审核成功</span>
              <span class="error" v-if="scope.row.status == 3">审核失败</span>
              <span class="over" v-if="scope.row.status == 4">已退款</span>
              <span class="over" v-if="scope.row.status == 5">已失效</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_at" label="下单时间" title="下单时间"></el-table-column>
          <el-table-column prop="oa_status" label="OA" title="OA">
            <template slot-scope="scope">
              <span class="warning" v-if="scope.row.oa_status == 0">待审核</span>
              <span v-if="scope.row.oa_status == 1">成功</span>
              <span class="error" v-if="scope.row.oa_status == 2">失败</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="160">
            <template slot-scope="scope">
              <el-button type="text" @click="orderDetailMsg(scope.row.id)">详情</el-button>
              <el-button @click="auditOn(scope.row.id,scope.row.status)" type="text">审核</el-button>
              <el-button @click="auditOff(scope.row.id,scope.row.status)" type="text">退回</el-button>
              <el-button @click="buttOA(scope.row.id)" type="text">对接OA</el-button>
              <!-- <el-button type="primary" @click="orderDetailMsg(scope.row.id)" class="mb-10"  size="small">详情</el-button>
              <el-button @click="auditOn(scope.row.id,scope.row.status)" type="warning"  class="mb-10" size="small">审核</el-button>
              <el-button @click="auditOff(scope.row.id,scope.row.status)" type="danger" size="small">退回</el-button>
              <el-button @click="buttOA(scope.row.id)" type="success" size="small">对接OA</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination">
        <el-pagination
          v-if="paginationShow"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[20, 50, 100]"
          :page-size="cur.pageSize"
          :total="totalCount"
          :current-page="nextPage"
          layout="total, sizes, prev, pager, next, jumper,slot"
        >
          <el-button class="pagingBtn" size="small">确认</el-button>
        </el-pagination>
      </div>
      <!--      彈框詳情-->
      <el-dialog title="订单详情" :close-on-click-modal="false" width="80%" :visible.sync="dialogFormVisible">
        <el-row style="margin: 10px;">
          <el-col :span="8">用户名：{{dialogData.real_name}}</el-col>
          <el-col :span="8">手机号：{{dialogData.phone}}</el-col>
          <el-col :span="8">网校名称：{{dialogData.schoolname}}</el-col>
        </el-row>
        <el-row style="height:50px;line-height:50px;background: rgba(234,234,234,1);">
          <el-col :span="12" style="padding-left: 20px;">{{dialogData.title}}</el-col>
          <el-col
            :span="12"
            style="text-align: right;padding-right: 20px;"
          >订单号：{{dialogData.order_number}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" style="border:1px solid rgba(228, 223, 230, 1);">
            <div class="diaHead">下单时间</div>
            <div class="diaCont">{{dialogData.create_at}}</div>
          </el-col>
          <el-col :span="6" style="border:1px solid rgba(228, 223, 230, 1);">
            <div class="diaHead">商品金额</div>
            <div class="diaCont">{{dialogData.lession_price}}</div>
          </el-col>
          <el-col :span="6" style="border:1px solid rgba(228, 223, 230, 1);">
            <div class="diaHead">支付状态</div>
            <div class="diaCont">{{status[dialogData.status]}}</div>
          </el-col>
          <el-col :span="6" style="border:1px solid rgba(228, 223, 230, 1);">
            <div class="diaHead">支付时间</div>
            <div class="diaCont">{{dialogData.pay_time}}</div>
          </el-col>
        </el-row>
        <el-row
          style="height:50px;line-height:50px;margin-bottom:20px;background: rgba(234,234,234,1);"
        >
          <el-col :span="24" style="padding-left: 20px;font-size:17px;color:rgba(136,136,136,1);">
            支付明细：
            <span style="color:rgba(255,85,29,1);margin-right: 10px;">实付款￥{{dialogData.price}}</span> 商品总价：
            <span style="color:rgba(255,85,29,1);">{{dialogData.lession_price}}</span>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  data() {
    return {
      //详情弹框
      dialogFormVisible: false,
      formLabelWidth: "120px",
      showList: true,
      tableHeight: null,
      schoolBranch: [],
      payStatus: [
        { label: "全部", value: "-1" },
        { label: "待支付", value: "0" },
        { label: "支付待审核", value: "1" },
        { label: "审核成功", value: "2" },
        { label: "审核失败", value: "3" },
        { label: "已退款", value: "4" } // { label: "全部", value: "-1" },
      ],
      status: [
        "未支付",
        "支付待审核",
        "审核成功",
        "审核失败",
        "已退款",
        "已失效"
      ],
      orderInfos: [],
      cur: {
        page: 1,
        pageSize: 20
      },
      nextPage: 1,
      totalCount: 20,
      whereArr: {
        order_number: "",
        school_id: "",
        status: "",
        state_time: "",
        end_time: ""
      },
      //条件复现
      wherename: {
        school_name: "",
        type_name: ""
      },
      //审核数据
      audit: {
        order_id: "",
        status: ""
      },
      //單條詳情
      dialogData: [],
      paginationShow: true,
      rule: {
        payNo: [
          {
            validator: onlyInputNumber,
            trigger: "blur"
          }
        ]
      },
      startpickerOptions: {
        disabledDate: time => {
          if (this.whereArr.end_time) {
            return time.getTime() > new Date(this.whereArr.end_time).getTime() ;
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      },
      pickerOptions: {
        disabledDate: time => {
          if (this.whereArr.state_time) {
            return (
              time.getTime() < new Date(this.whereArr.state_time).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      _request
        .http(this, "order/orderList", this.whereArr, this.cur)
        .then(res => {
          this.orderInfos = res.data.data; //數據
          this.totalCount = res.data.page.total; //总条数
          this.cur.pageSize = parseInt(res.data.page.pageSize); //每页条数
          this.cur.page = res.data.page.page;
          this.nextPage = parseInt(res.data.page.page);
          // this.schoolBranch = [];
          this.schoolBranch = res.data.school;
          // this.schoolBranch.unshift({ value: "0", label: "全部" });
        });
    },
    //詳情
    orderDetailMsg(val) {
      //单条查询
      console.log(val);
      this.audit.order_id = val;
      _request.http(this, "order/findOrderForId", this.audit).then(res => {
        this.dialogData = res.data;
        this.dialogFormVisible = true;
      });
    },
    select() {
      console.log(this.whereArr);
      this.initData();
      this.paginationShow = true;
    },
    //每页
    handleSizeChange(val) {
      this.cur.pageSize = val;
      this.initData();
    },
    //第几页
    handleCurrentChange(val) {
      this.cur.page = val;
      this.initData();
    },

    //輸入框改變事件
    searchArticle(e) {
      this.whereArr.titlt = e.target.value;
      console.log(e.target.value);
    },
    //審核通過事件
    auditOn: function(id, status) {
      if (status > 1) {
        this.$alert(
          '<strong>此订单 <span style="color: #ff1e6f">已审核</span></strong>',
          "提示",
          {
            dangerouslyUseHTMLString: true
          }
        );
        return false;
      } else if (status < 1) {
        this.$alert(
          '<strong>此订单 <span style="color: #ff1e6f">暂时无法审核</span></strong>',
          "提示",
          {
            dangerouslyUseHTMLString: true
          }
        );
        return false;
      } else {
        this.audit.order_id = id;
        this.audit.status = 2;
        this.$confirm("确定审核通过？", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "放弃"
        })
          .then(() => {
            _request.http(this, "order/auditToId", this.audit).then(res => {
              console.log(res);
              this.initData();
            });
          })
          .catch(action => {});
      }
    },
    //審核駁回事件
    auditOff: function(id, status) {
      console.log(id);
      console.log(status);
      if (status > 3) {
        this.$alert(
          '<strong>此订单无法进行操作。</strong>',
          "提示",
          {
            dangerouslyUseHTMLString: true
          }
        );
        return false;
      } else if (status < 1) {
        this.$alert(
          '<strong>此订单 <span style="color: #ff1e6f">暂时无法审核</span></strong>',
          "提示",
          {
            dangerouslyUseHTMLString: true
          }
        );
        return false;
      } else {
        this.audit.order_id = id;
        this.audit.status = 4;
        this.$confirm("确定退回？", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "放弃"
        })
          .then(() => {
            _request.http(this, "order/orderBack", this.audit).then(res => {
              console.log(res);
              this.initData();
            });
          })
          .catch(action => {});
      }
    },
    //对接OA
    buttOA(e) {
      this.audit.order_id = e;
      console.log(this.audit);
      this.$confirm("确定对接OA？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          _request.http(this, "order/buttOa", this.audit).then(res => {
            console.log(res);
            this.initData();
          });
        })
        .catch(action => {});
    }
  },
  mounted() {
    if (document.body.clientWidth >= 1250) {
      this.tableHeight = parseInt(document.body.clientHeight) - 270 + "px";
      window.onresize = () => {
        this.$nextTick(() => {
          this.tableHeight = parseInt(document.body.clientHeight) - 270 + "px";
        });
      };
    } else {
      this.tableHeight = parseInt(document.body.clientHeight) - 270 + "px";
      window.onresize = () => {
        this.$nextTick(() => {
          this.tableHeight = parseInt(document.body.clientHeight) - 270 + "px";
        });
      };
    }
  }
};
</script>
<style scoped lang="less">
.accounadd {
  background-color: #fff;
  .head-style {
    margin: 30px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    color: #333333;
  }
  .form-box {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, 0);
  }
  .foot-btn {
    margin-top: 20px;
    text-align: right;
    .sub-btn {
      color: #fff;
      font-size: 12px;
      background: linear-gradient(
        -90deg,
        rgba(38, 164, 253, 1),
        rgba(107, 149, 253, 1)
      );
      border-radius: 3px;
    }
  }
}
/deep/ .el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.diaHead {
  height: 36px;
  font-size: 15px;
  color: rgba(136, 136, 136, 1);
  line-height: 36px;
  text-align: center;
  margin-top: 20px;
}
.diaCont {
  font-size: 17px;
  color: rgba(85, 85, 85, 1);
  line-height: 36px;
  text-align: center;
  margin-bottom: 20px;
}
.primary {
  color: #1cc700;
}
.warning {
  color: #ff8a00;
}
.error {
  color: #ff0000;
}
.over {
  color: #d3daf1;
}
.apply {
  width: 150px;
}
.mb-10 {
  margin-bottom: 10px;
}
</style>
