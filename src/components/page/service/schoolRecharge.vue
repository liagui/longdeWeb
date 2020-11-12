<template>
  <div>
    <div class="rechargeNav">
      <nav-title></nav-title>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-row>
        <el-button type="danger" @click="goInvest">充值</el-button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="info" @click="goInvests">明细</el-button>
      </el-row>
    </div>

    <!-- 服务模块 -->
    <ul>
      <li class="itemLi">
        <p>
          <img src="../../../assets/image/service/组 2@2x.png" alt="" />
          <span style="font-weight: bold">网校设置</span>
        </p>
        <div>
          <span>
            <img
              src="../../../assets/image/service/1001布局_头部 (1)@2x.png"
              alt=""
            />
            页头设置</span
          >
          <span>
            <img
              src="../../../assets/image/service/1003布局_底部@2x.png"
              alt=""
            />页尾设置</span
          >
          <span>
            <img
              src="../../../assets/image/service/1002布局_主体@2x.png"
              alt=""
            />首页设置</span
          >
          <span>
            <img
              src="../../../assets/image/service/设置@2x.png"
              alt=""
            />SEO配置</span
          >
          <span>
            <img
              src="../../../assets/image/service/自定义@2x.png"
              alt=""
            />自定义页面</span
          >
        </div>

        <router-link to="/service/schoolSet" tag="button"> 设置 </router-link>
      </li>
      <li class="itemLi">
        <p>
          <img src="../../../assets/image/service/组 3@2x.png" alt="" />
          <span>直播设置</span>
        </p>
        <div>
          <span>
            <img src="../../../assets/image/service/yue@2x.png" alt="" />
            <a>当月可用并发</a> <a style="color: rgb(6, 243, 6)">1000</a></span
          >
          <span>
            <img
              src="../../../assets/image/service/shuliang 拷贝@2x.png"
              alt=""
            />
            <a>当月已用并发：</a>
            <a style="color: rgb(233, 14, 14)">1000</a></span
          >
          <span>
            <img
              src="../../../assets/image/service/xinzeng (1)@2x.png"
              alt=""
            />
            <a>下月可用并发：</a>
            <a style="color: rgb(2, 131, 206)">1000</a></span
          >
          <span>
            <img src="../../../assets/image/service/shijian@2x.png" alt="" />
            <a>有效期：</a> <a>1000</a></span
          >
        </div>

        <router-link to="/service/liveConcurrent" tag="button">
          详情
        </router-link>
      </li>
      <li class="itemLi">
        <p>
          <img src="../../../assets/image/service/组 4@2x.png" alt="" />
          <span>空间/流量</span>
        </p>
        <div>
          <span>
            <img src="../../../assets/image/service/流量@2x.png" alt="" />
            <a>流量GB：</a>
            <a> <b style="color: rgb(6, 243, 6)">1000</b> /1000</a></span
          >
          <span>
            <img
              src="../../../assets/image/service/258体积、空间@2x.png"
              alt=""
            /><a>空间GB：</a>
            <a> <b style="color: rgb(233, 14, 14)">1000</b>/1000</a></span
          >
          <span>
            <img
              src="../../../assets/image/service/shijian 拷贝@2x.png"
              alt=""
            />
            <a>有效期：</a> <a>2020-10-12</a></span
          >
        </div>

        <router-link to="/service/spatialStorage" tag="button">
          详情
        </router-link>
      </li>
      <li class="itemLi">
        <p>
          <img src="../../../assets/image/service/组 5@2x.png" alt="" />
          <span>课程库存</span>
        </p>
        <div>
          <span>
            <img src="../../../assets/image/service/课程授权@2x.png" alt="" />
            <a>授权课程：</a> <a style="color: rgb(6, 243, 6)">20</a></span
          >
          <span>
            <img src="../../../assets/image/service/shijian@2x.png" alt="" />
            <a>库存总量：</a> <a style="color: rgb(233, 14, 14)">1000</a></span
          >
        </div>

        <router-link to="/service/courseInventory" tag="button">
          详情
        </router-link>
      </li>
      <li class="itemLi">
        <p>
          <img src="../../../assets/image/service/组 6@2x.png" alt="" />
          <span>支付管理</span>
        </p>
        <div>
          <span>
            <img src="../../../assets/image/service/微信支付@2x.png" alt="" />
            微信</span
          >
          <span
            ><img
              src="../../../assets/image/service/支付宝支付@2x.png"
              alt=""
            />支付宝</span
          >
          <span
            ><img
              src="../../../assets/image/service/u=1635309086,2631143217&fm=26&gp=0.jpg@2x.png"
              alt=""
            />汇聚</span
          >
          <span
            ><img
              src="../../../assets/image/service/timg@2x.png"
              alt=""
            />汇付</span
          >
        </div>

        <router-link to="/service/payManage" tag="button"> 设置 </router-link>
      </li>
      <li class="itemLi">
        <p>
          <img src="../../../assets/image/service/组 7@2x.png" alt="" />
          <span>客服营销</span>
        </p>
        <div>
          <span>
            <img src="../../../assets/image/service/微信 (2)@2x.png" alt="" />
            微信公众号</span
          >
          <span>
            <img src="../../../assets/image/service/QQ (2)@2x.png" alt="" />
            QQ号</span
          >
          <span>
            <img src="../../../assets/image/service/微博 (1)@2x.png" alt="" />
            新浪微博</span
          >
          <span>
            <img src="../../../assets/image/service/客服 (1)@2x.png" alt="" />
            客服电话</span
          >
        </div>

        <router-link to="/service/callMarket" tag="button"> 设置 </router-link>
      </li>
      <li class="itemLi">
        <p>
          <img src="../../../assets/image/service/组 10@2x.png" alt="" />
          <span>统计分析</span>
        </p>
        <div>
          <p style="width: 95%; border: none; height: 36px; margin: 0 auto">
            第三方统计代码部署
          </p>
          <span>
            <img src="../../../assets/image/service/百度@2x.png" alt="" />
            百度</span
          >
          <span>
            <img src="../../../assets/image/service/图层 1@2x.png" alt="" />
            谷歌</span
          >
          <span>
            <img src="../../../assets/image/service/图层 2@2x.png" alt="" />
            CNZZ</span
          >
          <span>
            <img
              src="../../../assets/image/service/图层 3@2x.png"
              alt=""
              style="width: 120px"
            />
            腾讯</span
          >
        </div>

        <router-link to="/service/statisticalAnalysis" tag="button">
          设置
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import navTitle from "./navTitle";

import _request from "@/utils/request";

export default {
  data() {
    return {
      balance: "",
      form: {
        school_id: window.localStorage.getItem("school_id"),
      },
    };
  },
  // computed: {
  //   ...mapGetters(["getSetbarList"]),
  // },
  // created() {
  //   console.log(this.getSetbarList);
  // },
  methods: {
    goInvest() {
      console.log(this.form);
      this.$router.push("/service/schoolSet/investMoney");
    },
    goInvests() {
      this.$router.push("/service/schoolSet/investMoneys");
    },
  },
  components: {
    navTitle,
  },
};
</script>
<style scoped lang="less">
.rechargeNav {
  background-color: white;
  // padding: 10px 35px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  span {
    margin-right: 40px;
    margin-left: 10px;
    font-size: 15px;
  }
}
.content-box {
  padding: 0;
  margin: 0;
}

ul {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 20px;
}
.itemLi {
  width: 23%;
  background: #ffffff;
  // padding: 15px 20px;
  height: 300px;
  box-sizing: border-box;
  margin-right: 20px;
  margin-bottom: 20px;
  position: relative;
  border-radius: 5px;
  box-shadow: 2px 2px 2px 2px #f0f0f0;
  button {
    float: right;
    border: none;
    margin: 0;
    position: absolute;
    width: 60px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background: #0a97f5;
    color: white;
    right: 20px;
    bottom: 10px;
    font-size: 12px;
    box-shadow: 1px 2px 2px 2px;
    border-radius: 5px;
  }
  p {
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    height: 70px;
    align-items: center;
    img {
      width: 35px;
      height: 35px;
      margin: 0 20px;
    }
  }

  div {
    line-height: 40px;
    font-size: 15px;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    margin: 0 15px;

    a {
      margin-right: 20px;
    }
    span {
      margin: 0 30px 0 10px;
      display: flex;
      align-items: center;
      img {
        width: 18px;
        height: 18px;
        margin-right: 8px;
      }
    }
  }
  img {
    width: 50px;
    height: 50px;
  }
}

.el-button {
  clear: both;
}
</style>
