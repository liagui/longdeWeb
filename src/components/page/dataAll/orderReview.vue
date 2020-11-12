<template>
  <div>
    <div class="content-head">
      <div>订单审核</div>
      <el-form>
        <el-select
          v-model="searchData.status"
          @change="select"
          style="width: 150px"
          placeholder="选择订单状态"
          clearable
        >
          <el-option
            v-for="(item, index) in statusArr"
            :label="item.name"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
        <el-select
          v-model="searchData.type"
          @change="select"
          style="width: 150px"
          placeholder="请选择订单类型"
        >
          <el-option
            v-for="(item, index) in orderType"
            :label="item.name"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form>
    </div>
    <div class="content-cont">
      <div>
        <div class="listItem" v-for="(item, index) in dataArr" :key="index">
          <div class="item-cont">
            <el-row>
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order1.png"
                  class="iconimg"
                />订单编号:<span class="dataShow">{{ item.oid }}</span></el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order2.png"
                  class="iconimg"
                />支付方式:<span class="dataShow">{{
                  item.paytype_text
                }}</span></el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order3.png"
                  class="iconimg"
                />订单状态:<span
                  class="dataShow"
                  :class="
                    item.status == 1
                      ? 'text-red'
                      : item.status == 2
                      ? 'text-ok'
                      : 'text-reject'
                  "
                >
                  {{ item.status_text }}</span
                ></el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order4.png"
                  class="iconimg"
                />订单类型:<span class="dataShow">{{
                  item.type_text
                }}</span></el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order5.png"
                  class="iconimg"
                />订单金额:<span class="dataShow">{{
                  item.money
                }}</span></el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order6.png"
                  class="iconimg"
                />备注:<span class="dataShow showRow2"
                  >{{item.remark
                  }}</span
                ></el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order7.png"
                  class="iconimg"
                />服务类型:<span class="dataShow">{{
                  item.service_text
                }}</span></el-col
              >
              <el-col class="col-height" :span="8"
                ><img
                  src="@/assets/image/dingdanshenhe/order8.png"
                  class="iconimg"
                />订单时间:<span class="dataShow">{{
                  item.apply_time
                }}</span></el-col
              >
            </el-row>
          </div>
          <div class="item-btn">
            <el-button
              type="danger"
              v-if="item.status == 1"
              @click="orderClick(item)"
              size="big"
              >审核订单</el-button
            >
            <el-button type="danger" v-else @click="orderClick(item)" size="big"
              >订单详情</el-button
            >
          </div>
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
          layout="total, sizes, prev, pager, next, jumper,slot"
        >
          <el-button class="pagingBtn" size="small">确认</el-button>
        </el-pagination>
      </div>
    </div>
    <order-dialog
      v-if="showDialog"
      :showDialog="showDialog"
      :transData="transData"
      @dialogClose="dialogClose"
      @dialogSure='dialogSure'
    ></order-dialog>
  </div>
</template>
<script>
import _request from "@/utils/request";
import orderDialog from "./orderDialog/orderDialog";
export default {
  components: {
    orderDialog,
  },
  data() {
    return {
      transData: {
        dialogTitle: "",
        id: 0, // id
        type: 0, //类型
      },
      showDialog: false,
      searchData: {
        status: "",
        type: "",
      },
      statusArr: [
        { label: "待审核", value: 1 },
        { label: "审核通过", value: 2 },
        { label: "驳回", value: 3 },
      ],
      orderType: [
        { label: "预充金额", value: 1 },
        { label: "购买服务", value: 2 },
      ],
      cashAuditData: [],

      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20,
      },
      nextPage: 1,
      totalCount: 0,
      load: false,
      dataArr: [],
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    this.searchFun();
  },
  methods: {
    // 按钮操作
    orderClick(item) {
      // type 1: 审核订单 2：订单详情
      this.transData.status = item.status;
      this.transData.dialogTitle = item.status == 1 ? "审核订单" : "订单详情";
      this.transData.id = item.id;
      this.transData.type = item.type;
      this.showDialog = true;
    },

    dialogClose() {
      this.showDialog = false;
    },
    dialogSure() {
      this.showDialog = false;
      this.initData();
    },
    initData() {
      _request
        .http(this, "dashboard/offlineOrder/index", this.searchData, this.cur)
        .then((res) => {
          this.dataArr = res.data.list;
          this.totalCount = res.data.total;
          if (!this.statusArr.length) {
            this.statusArr = res.data.searchs.status;
            this.orderType = res.data.searchs.type;
          }
        });
    },
    searchFun() {
      _request
        .http(this, "dashboard/offlineOrder/searchKey")
        .then((res) => {
          
            this.statusArr = res.data.status;
            this.orderType = res.data.type;
          
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
  align-items: center;
  background: #fff;
  padding: 30px 30px;

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
  .dataShow {
    color: #333;
  }
  .text-red {
    color: #FF0000;
  }
  .text-ok {
    color: #1cc700;
  }
  .text-reject {
    color: #ff551d;
  }
  .showRow2 {
    
  }
}
</style>