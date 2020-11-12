<template>
  <div>
    <nav-title></nav-title>
    <div class="contents">
      <p
        style="
          line-height: 50px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #f0f0f0;
        "
      >
        <span style="width: 3px; color: rgb(46, 169, 240)">|</span>&nbsp;&nbsp;
        网校充值
      </p>
      <p class="yu">
        <img
          src="../../../../assets/image/statistics/jiage@2x.png"
          alt=""
        /><span>当前余额：</span>&nbsp;&nbsp;<span
          style="color: rgb(46, 169, 240)"
          >{{ balance }}</span
        >
      </p>
      <div class="money">
        <img src="../../../../assets/image/statistics/jiage@2x.png" alt="" />
        <span> 充值金额：</span>
        <div class="button-item">
          <span
            plain
            v-for="(item, index) in moneys"
            :key="index"
            :class="{ actives: activeIndex == index }"
            @click="money(item, index)"
            >{{ item }}</span
          >
        </div>
      </div>

      <h5 style="line-height: 50px; padding-left: 20px">
        <img
          src="../../../../assets/image/service/chongzhi- (1)@2x.png"
          alt=""
        />请选择支付方式
      </h5>

      <div class="pay">
        <div>
          <span
            v-for="(item, index) in ToMoney"
            :key="index"
            @click="onItemClick(index)"
            :class="{ active: activeIndexs == index }"
          >
            <i :class="item.icon"></i>
            {{ item.title }}
          </span>
        </div>

        <div v-if="nums == 0" class="template">
          <!-- <div @click="weiMoney">
            <img src="../../../../assets/image/school/组 10@2x(2).png" alt="" />
            <el-radio v-model="radio" label="1">微信支付</el-radio>
          </div> -->
          <!-- <div></div> -->
          <div @click="zhiMoneys">
            <img src="../../../../assets/image/school/组 10@2x(1).png" alt="" />
            <el-radio v-model="radio" label="2" checked>支付宝支付</el-radio>
          </div>
          <div></div>
          <div>
            <p>
              支付金额：<a>{{ item.money }}</a
              >元
            </p>

            <el-button type="danger" class="button-zhi" @click="zhiFu"
              >去支付</el-button
            >
          </div>
        </div>
        <div v-if="nums == 1" class="template">
          <div class="card_money" @click="cardMoney">
            <p>银行对公汇款信息：</p>
            <h5>开户名称：龙德天成教育科技有限公司</h5>
            <h5>收款账号：0342110004001****</h5>
            <h5>开户银行：中国农业银行股份有限公司上海浦三路支行</h5>
            <p>
              汇款时请在备注中写明您在天成课堂的公司认证名和本订单号，以便入账后给你开通服务。若未能及时
              入账或其他问题，请通过联系客服电话或右侧在线客服功能联系客服人员，联系客服人员，联系电话：***
            </p>
          </div>
          <div></div>
          <div>
            <p>
              支付金额：<a>{{ item.money }}</a
              >元
            </p>
            <el-button type="danger" class="button-zhi" @click="zhiFus"
              >去支付</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->

    <!-- el-dialog -->
    <el-dialog
      title="汇款提示"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisibles"
    >
      <div class="loading">
        <i class="el-icon-bell" style="color: red"></i>
        <p>
          您选择了银行汇款方式，请尽快去完成汇款，并于汇款成功后联系我们的客服或客服经理，联系电话：400-8888-888
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibles = false">取 消</el-button>
        <el-button type="danger" @click="dialogFormVisibles = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 自定义金额设置弹框 -->
    <el-dialog
      title="收货地址"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
    >
      <el-form>
        <el-form-item label="设置金额：" :label-width="formLabelWidth">
          <el-input v-model="moneyNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureMoney">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <div class="ma_er" v-show="imgShow">
      <img :src="imgUrl" alt="" />
    </div> -->
    <div id="qrcode" class="ma_er" v-show="imgShow">
      <span @click="close">关闭</span>
      <img :src="qrcodes" alt="" />
    </div>
  </div>
</template>
<script>
import navTitle from "../navTitle";
import _request from "@/utils/request";
import QRCode from "qrcodejs2";
export default {
  name: "",
  data() {
    return {
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dialogFormVisibles: false,
      radio: "1",
      index: 1,
      qrcodes: "",
      nums: 0,
      moneyNum: 1,
      activeIndexs: 0,
      moneys: [
        500,
        1000,
        3000,
        4000,
        5000,
        10000,
        20000,
        50000,
        200000,
        500000,
        "自定义",
      ],
      ToMoney: [
        {
          id: 1,
          icon: "el-icon-bank-card",
          title: "支付平台",
        },
        {
          id: 2,
          icon: "el-icon-receiving",
          title: "银行汇款",
        },
      ],
      form: {
        school_id: window.localStorage.getItem("school_id"),
      },
      item: {
        schoolid: window.localStorage.getItem("school_id"),
        money: 0,
        paytype: 1,
      },
      items: {
        schoolid: window.localStorage.getItem("school_id"),
        oid: "",
      },
      imgUrl: "",
      imgShow: false,
      activeIndex: -1,
      timeOut: 0,
      balance: "",
    };
  },
  components: {
    navTitle,
    QRCode,
  },
  beforeDestroy() {
    clearInterval(this.timeOut);
  },
  computed: {},
  beforeMount() {},
  mounted() {
    _request.http(this, "school/getSchoolUpdate", this.form).then((res) => {
      console.log(res);
      if (res.code == 200) {
        this.balance = res.data.balance;
      }
    });
  },
  created() {},
  methods: {
    // 点击选择支付方式
    zhiMoneys() {
      this.item.paytype = 3;
      console.log(this.item.paytype);
    },
    weiMoney() {
      this.item.paytype = 4;
      console.log(this.item.paytype);
    },
    cardMoney() {
      this.item.paytype = 2;
      console.log(this.item.paytype);
    },
    // 确认金额
    sureMoney() {
      this.dialogFormVisible = false;
      this.item.money = this.moneyNum;
    },
    // 点击切换年份
    onItemClick(index) {
      console.log(this.radio);
      this.activeIndexs = index;
      this.nums = index;
      if (this.nums == 1) {
        this.dialogFormVisibles = true;
        this.item.paytype = 2;
        console.log(this.item.paytype);
      }
    },
    money(i, index) {
      this.item.money = i;
      this.activeIndex = index;
      if (i == "自定义") {
        this.item.money = this.moneyNum;
        this.dialogFormVisible = true;
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    qrcode(url) {
      let that = this;
      // let qrcode = new QRCode("qrcode", {
      //   width: 124,
      //   height: 124, // 高度
      //   text: url, // 二维码内容
      // });
      this.qrcodes = url;
      this.timeOut = setInterval(() => {
        this.lunxun();
      }, 1000);
    },
    // 银行卡汇款
    zhiFus() {
      this.$toast("支付完成");
      this.item.money = 0;
    },
    // 支付按钮
    zhiFu() {
      _request.http(this, "service/recharge", this.item).then((res) => {
        // this.qrcode(res.data.qrcode);
        this.qrcodes = res.data.qrcode;
        this.items.oid = res.data.oid;
        this.imgShow = true;
        // this.$message("支付完成");
      });
    },
    // 支付轮询
    lunxun() {
      _request.http(this, "service/recharge_res", this.items).then((res) => {
        //如果返回1代表支付成功
        if (res.code == 200 && res.data == 1) {
          clearInterval(this.timeOut);
        } else {
        }
      });
    },
    close() {
      this.imgShow = false;

      this.radio = "1";
      this.activeIndex = -1;
      this.$toast("支付未完成");
      clearInterval(this.timeOut);
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
.el-dialog {
  width: 40% !important;
}
.loading {
  display: flex;
  align-items: center;
  i {
    height: 60px;
  }
  p {
    width: 50%;
    height: 60px;
    margin-left: 15px;
    flex-wrap: wrap;
  }
}
.ma_er {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 130;
  background: #000;
  opacity: 0.7;
  display: flex;
  justify-content: space-around;
  // flex-direction: column;
  align-items: center;
  span {
    position: absolute;
    right: 30px;
    top: 30px;
    color: #fff;
  }
  img {
    width: 200px;
    z-index: 101;
    height: 200px;
  }
}
.el-radio,
.el-radio--medium.is-bordered .el-radio__label {
  margin-left: 50px;
}
.yu {
  line-height: 50px;
  padding-left: 20px;
  img {
    width: 20px;
    height: 20px;
    margin-right: 20px;
  }
}
.pay {
  width: 95%;
  position: relative;
  display: flex;
  line-height: 40px;
  padding-left: 20px;
  span {
    width: 150px;
    margin-left: 30px;
    line-height: 40px;
    text-align: center;
    display: block;
    margin-bottom: 20px;
    background: rgb(245, 243, 243);
    font-size: 14px;
    // padding: 5px 15px;
    img {
      width: 18px;
      height: 18px;
    }
  }
  .template {
    // width: 80%;
    display: flex;
    justify-content: space-between;
    div {
      width: 200px;
      height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      img {
        width: 100px;
        height: 100px;
        margin: 0 auto;
      }
      .button-zhi {
        width: 100px;
      }
    }
    div:nth-child(3) {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 240px;
      height: 100px;
      position: absolute;
      right: 30px;
      bottom: 30px;
      p {
        text-align: right;
        a {
          color: red;
        }
        .el-button {
          width: 100px;
        }
      }
    }
    //
    .card_money {
      width: 50%;
      height: 240px;

      font-size: 13px;
      padding-left: 30px;

      p {
        line-height: 30px;
      }
      h5 {
        font-size: 15px;
        font-weight: bold;
      }
    }
  }
}
img {
  width: 20px;
  height: 20px;
  margin-right: 20px;
}
.contents {
  // width: 98%;
  margin: 10px auto;
  background: #fff;
  border-radius: 5px;
  padding: 0 20px;
  .money {
    display: flex;
    padding-left: 20px;
    img {
      width: 20px;
      height: 20px;
      margin-right: 20px;
    }
    .button-item {
      display: flex;
      width: 470px;
      flex-wrap: wrap;
      span {
        // width: 76px;
        padding: 3px 15px;
        text-align: center;
        margin: 0 17px 10px 0;
        border: 1px solid #f0f0f0;
        box-shadow: 2px 2px 2px 2px #fff;
      }
    }
  }
}
.content-box {
  padding: 0;
  margin: 0;
}
.active {
  // background: url("../../../../assets/image/school/white.png") #fff 100%;
  background-color: rgb(198, 244, 250);
  color: rgb(84, 195, 247);
}
.actives {
  background: rgb(96, 204, 247);
}
</style>
