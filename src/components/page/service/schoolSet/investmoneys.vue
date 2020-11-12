<template>
  <div>
    <nav-title></nav-title>
    <div class="contents">
      <div class="top">
        <span>订单明细</span>
        <el-select
          v-model="value"
          clearable
          @change="select"
          placeholder="订单状态"
          class="width-150"
        >
          <el-option
            v-for="item in orderList"
            :key="item.id"
            :label="item.status"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="value1"
          @change="select"
          clearable
          placeholder="订单类型"
        >
          <el-option
            v-for="item in orderList"
            :key="item.id"
            :label="item.type"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="order">
      <div>
        <div class="listItem" v-for="(item, index) in orderList" :key="index">
          <div class="item-cont">
            <el-row>
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order1.png"
                  class="iconimg"
                />订单编号:{{ item.oid }}</el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order2.png"
                  class="iconimg"
                />支付方式:{{ item.paytype_text }}</el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order3.png"
                  class="iconimg"
                />订单状态:{{ item.status_text }}</el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order4.png"
                  class="iconimg"
                />订单类型:{{ item.type_text }}</el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order5.png"
                  class="iconimg"
                />订单金额:{{ item.money }}</el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order6.png"
                  class="iconimg"
                />备注:{{ item.remark }}</el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order7.png"
                  class="iconimg"
                />服务类型: {{ item.service_text }}
              </el-col>
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order8.png"
                  class="iconimg"
                />订单时间:{{ item.apply_time }}</el-col
              >
            </el-row>
          </div>
          <div class="item-btn">
            <el-button type="danger" @click="orderClick(2)" size="big"
              >审核订单</el-button
            >
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
    <order-dialogs
      v-if="showDialog"
      :showDialog="showDialog"
      :transData="transData"
      @dialogClose="dialogClose"
    ></order-dialogs>
  </div>
</template>

<script>
import navTitle from "../navTitle";
import _request from "@/utils/request";
import orderDialogs from "./orderDialog";
export default {
  data() {
    return {
      transData: {
        type: 1,
        dialogTitle: "",
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
      ],
      value: "",
      value1: "",

      natureArr: [
        { label: "全部", value: 3 },
        { label: "授权", value: 2 },
        { label: "自增", value: 1 },
      ],
      is_forbidArr: [
        { label: "全部", value: 3 },
        { label: "未被课程使用", value: 0 },
        { label: "已被课程使用", value: 1 },
        { label: "禁用", value: 2 },
      ],
      schoolBranch: [],
      showList: this.$store.state.SecHeadClick,
      showDialog: false,
      subjectArr: [], //课程列表
      addData: {
        id: "",
        name: "",
        introduce: "",
        parent_id: [],
      },

      transDataId: "",
      searchData: {
        status: "",
        type: "",
        schoolid:  window.localStorage.getItem("school_id"),
      },
      statusArr: [
        { label: "全部", value: "" },
        { label: "待审核", value: 0 },
        { label: "审核通过", value: 1 },
        { label: "审核拒绝", value: 2 },
      ],
      orderList: [],

      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20,
      },
      schoolid: 1,
      nextPage: 1,
      totalCount: 20,
      load: false,
    };
  },
  components: {
    orderDialogs,
    navTitle,
  },
  computed: {},
  beforeMount() {},
  mounted() {
    this.initData();
    console.log(this.schoolid);
  },
  created() {},
  methods: {
    // 按钮操作
    orderClick(type) {
      // type 1: 审核订单 2：订单详情
      this.showDialog = true;
      this.transData.type = type;
      this.transData.dialogTitle = type == 1 ? "审核订单" : "订单详情";
    },
    select() {
      console.log(JSON.stringify(this.orderList));
      this.paginationShow = false;
      this.cur.page = 1;
      this.$nextTick(() => {
        this.initData();
        this.paginationShow = true;
      });
    },
    dialogMarksure() {
      this.$refs.addData.validate((valid) => {
        if (valid) {
          if (this.addData.id) {
            // 修改
            _request.http(this, "updateLive", this.addData).then((res) => {
              if (res.code == 200) {
                this.showDialog = false;
                this.initData();
              }
            });
          } else {
            _request.http(this, "live/add", this.addData).then((res) => {
              if (res.code == 200) {
                this.showDialog = false;
                this.addData.id = "";
                this.initData();
              }
            });
          }
        }
      });
    },
    dialogClose() {
      this.showDialog = false;
    },
    initData() {
      _request
        .http(this, "service/orderIndex", this.searchData, this.cur)
        .then((res) => {
          console.log(res.data);
          this.orderList = res.data.list;
          this.totalCount = res.data.total;
          // this.nextPage = parseInt(res.data.total_page);
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
  watch: {
    "searchData.name": {
      handler(newVal, oldVal) {
        let timeout;
        if (this.load) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          this.initData();
          this.load = false;
        }, 500);
      },
    },
  },
};
</script>
<style scoped lang="less">
.listItem {
  display: flex;
  margin-top: 20px;
  align-items: center;
  background: #fff;
  padding: 30px 50px;

  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  margin-bottom: 20px;
  .item-cont {
    flex: 1;
  }

  .item-btn {
    width: 200px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border-left: 1px solid #d6d6d6;
  }
  .col-height {
    height: 15px;
    line-height: 15px;
    margin: 10px 0 11px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #666666;
  }
  .iconimg {
    height: 16px;
    margin-right: 4px;
  }
}
.content-box {
  padding: 0;
  margin: 0;
}
// .rechargeNav {
//   background-color: white;
//   padding: 10px 35px;
//   border-bottom: 2px solid #f0f0f0;
//   span {
//     margin-right: 40px;
//     margin-left: 10px;
//     font-size: 15px;
//   }
// }
.contents {
  margin: 0 auto;
  background: #fff;
  border-radius: 5px;
  line-height: 60px;
  .top {
    width: 95%;
    margin: 0 auto;
  }
  span {
    font-size: 15px;
    margin-right: 35px;
  }
  .order {
    width: 95%;
  }
}
</style>
