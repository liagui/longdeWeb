<template>
  <div class="content">
    <div class="contents">
      <i></i>直播服务
      <p>
        <img
          src="../../../../assets/image/statistics/bingfa@2x.png"
          alt=""
        />当月可用并发:<span style="color: blue">10000</span>
      </p>
      <p>
        <img
          src="../../../../assets/image/statistics/bingfa2x.png"
          alt=""
        />当月已用并发:<span style="color: red">12333</span>
      </p>
    </div>
    <h5>
      注：并发数为网校购买的用于学员在直播间内上课或查看直播回放的最大人数，若网校学员已超过预购的并发数，学员将无法进入直播间上课
    </h5>
    <ul>
      <li>
        <img src="../../../../assets/image/statistics/jiage@2x.png" alt="" />
        <span> 当前合约价格： </span>
        <span>{{ data.live_price || 10 }}元/人/月</span>
      </li>
      <li>
        <img src="../../../../assets/image/statistics/yue@2x.png" alt="" />
        <span> 购买月份：</span>
        <el-form ref="form" :model="sizeForm" size="mini">
          <el-form-item>
            <el-col :span="8">
              <el-date-picker
                type="month"
                placeholder="选择日期"
                v-model="sizeForm.start_time"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-col>
            <el-col
              class="line"
              :span="2"
              style="text-align: center; width: 80px"
              >至</el-col
            >
            <el-col :span="8">
              <el-date-picker
                placeholder="选择日期"
                type="month"
                value-format="yyyy-MM-dd"
                v-model="sizeForm.end_time"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
          </el-form-item>
        </el-form>
      </li>
      <li>
        <img src="../../../../assets/image/statistics/shuliang@2x.png" alt="" />
        <span>并发数量：</span>
        <div class="num">
          <span
            v-for="(item, index) in mouned"
            :key="index"
            @click="numMound(item, index)"
            :class="{ active: activeindex == index }"
            >{{ item }}</span
          >
          <a>用户超出并发数将无法进入教室</a>
        </div>
      </li>
      <li>
        <img
          src="../../../../assets/image/statistics/xinzeng (1)@2x.png"
          alt=""
        />
        <span>新增并发：</span>
        <span style="margin-left: 30px">{{ dataList.num }}并发</span>
      </li>
      <li>
        <img src="../../../../assets/image/statistics/shijian@2x.png" alt="" />
        <span>并发时长：</span>
        <span style="margin-left: 30px">{{ timerSure | yuefen }}</span>
      </li>
      <li>
        <img
          src="../../../../assets/image/statistics/jiage 拷贝 3@2x.png"
          alt=""
        />
        <span>单价：</span>
        <span style="margin-left: 60px">{{ data.live_price || 10 }}/人/月</span>
      </li>
      <li>
        <img
          src="../../../../assets/image/statistics/jiage 拷贝 4@2x.png"
          alt=""
        />
        <span>费用：</span>
        <span style="margin-left: 60px"
          >{{ dataList.num }}并发×{{ data.live_price || 10 }}.0元×{{
            timerSure
          }}个月={{ dataList.money }}.00元</span
        >
      </li>
      <el-row>
        <el-button type="primary" @click="toMoney">支付</el-button>
      </el-row>
    </ul>
  </div>
</template>
<script>
import { dateToObj } from "@/utils";
import _request from "@/utils/request";
export default {
  name: "",
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      sizeForm: {
        start_time: "",
        end_time: "",
      },
      timerSure: 0,
      data: {},
      mouned: [200, 400, 600, 700, 800, 10000, 12000],

      dataList: {
        schoolid:window.localStorage.getItem("school_id"),
        num: 0,
        money: 0,
      },
      activeindex: 0,
    };
  },
  filters: {
    yuefen(val) {
      return val + "个月";
    },
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {
    this.getData();
  },

  methods: {
    numMound(i, ind) {
      this.dataList.num = i;
      this.activeindex = ind;
      this.dataList.money = 10 * this.dataList.num;
    },

    getData() {
      _request
        .http(this, "dashboard/purservice/getPrice", this.dataList)
        .then((res) => {
          console.log(res);
          this.data = res.data;
        });
    },
    toMoney() {
      this.dataList.money = 10 * this.dataList.num * this.timerSure;
      _request
        .http(this, "service/purLive", this.dataList, this.sizeForm)
        .then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.data = res.data;
          }
        });
    },
    getTime(d) {
      return new Date(d).getTime();
    },
  },
  watch: {
    "sizeForm.end_time"(val) {
      if (val && this.sizeForm.start_time) {
        let start = this.getTime(this.sizeForm.start_time);
        let end = this.getTime(val);
        let time = end - start;
        if (time < 0) this.sizeForm.end_time = "";
        let yuefen = time / 1000 / 60 / 60 / 24 / 30;
        this.timerSure = parseInt(yuefen + 1);
      } else {
        this.sizeForm.end_time = "";
      }
    },
  },
  computed: {},
};
</script>
<style scoped lang="less">
.content {
  width: 95%;
  background: #fff;
  margin: 0 auto;
  padding: 0;
  box-shadow: 3px 5px 5px 3px #f0f0f0;
  h5 {
    width: 95%;
    line-height: 40px;
    margin: 0 auto;
    font-size: 15px;
    color: #c2bfbf;
  }
}
.active {
  background: rgb(55, 186, 238);
}
.el-row {
  margin: 30px 0;
}
.el-button--small,
.el-button--small.is-round {
  padding: 10px 40px;
}
.contents {
  width: 95%;
  margin: 0 auto;
  display: flex;
  border-radius: 5px;
  justify-content: flex-start;
  align-items: center;
  line-height: 60px;
  /* margin-left: 20px; */
  // margin-bottom: 20px;
  // padding-bottom: 20px;
  border-bottom: 1px solid #cfcfcf;

  i {
    width: 4px;
    height: 20px;
    background: rgb(18, 161, 228);
    margin-right: 10px;
  }

  p {
    // border-bottom: 1px solid #f0f0f0;
    // padding: 10px 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin: 0 20px;
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
}
ul {
  width: 95%;
  margin: 0 auto;
  li {
    font-size: 15px;
    display: flex;
    height: 45px;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    .el-form-item__label {
      width: 80px;
      text-align: center;
    }
    form {
      height: 35px;
      margin-left: 30px;
    }
    .num {
      display: flex;
      margin-left: 30px;
      span {
        margin-right: 20px;
        padding: 3px 10px;
        border: 1px solid rgb(142, 210, 250);
      }
      a {
        color: #bdbcbc;
        font-size: 12px;
      }
    }
  }
}
</style>
