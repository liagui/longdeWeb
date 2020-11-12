<template>
  <div class="content-boxs">
    <navlist></navlist>
    <h5>
      注：流量数为网校购买的用于播放课程资源及下载课程相关资料时使用的流量，若网校内流量使用已超预购的流量数，学员将不可播放录播资源及下载课程的相关文件
    </h5>
    <p id="yue">
      <img
        src="../../../../assets/image/statistics/jiage 拷贝 3@2x.png"
        alt=""
      />
      <span style="line-height：40px"
        >当前合约价格：{{ data.flow_price || 10 }}元/GB</span
      >
    </p>
    <!-- <div class="contents"><i></i>升级空间</div> -->
    <ul>
      <li>
        <div class="num">
          <div class="numItem">
            <span
              v-for="(item, index) in mouned"
              :key="index"
              @click="numMound(item, index)"
              :class="{ active: index == activeIndex }"
              >{{ item }}G</span
            >
          </div>

          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item>
              <el-input type="number" v-model="form.num"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </li>
      <li>
        <img src="../../../../assets/image/statistics/shuliang@2x.png" alt="" />
        <span>新增流量：</span>
        <span style="margin-left: 30px">{{ form.num }}GB</span>
      </li>
      <li>
        <img
          src="../../../../assets/image/statistics/jiage 拷贝 3@2x.png"
          alt=""
        />
        <span>单价：</span>
        <span style="margin-left: 60px">{{ data.flow_price || 10 }}元/GB</span>
      </li>

      <li>
        <img
          src="../../../../assets/image/statistics/jiage 拷贝 3@2x.png"
          alt=""
        />
        <span>订单价格：</span>
        <span style="margin-left: 30px">{{ this.form.num * 10 }}元</span>
      </li>
      <el-row>
        <el-button type="primary" @click="toMoney">立即支付</el-button>
      </el-row>
    </ul>
  </div>
</template>
<script>
import navlist from "./navlist";
import _request from "@/utils/request";
export default {
  name: "",
  data() {
    return {
      form: {
        num: 1,
      },
      addLiu: "",

      mouned: [2000, 4000, 6000, 8000, 10000],
      activeIndex: 0,
      sizeForm: {
        date1: "",
        date2: "",
      },
      data: {},
      getList: {
        schoolid: window.localStorage.getItem("school_id"),
      },
      dataList: {
        schoolid: window.localStorage.getItem("school_id"),

        money: 1,
      },
    };
  },

  components: {
    navlist,
  },
  computed: {},
  beforeMount() {},
  mounted() {
    this.getData();
  },
  methods: {
    numMound(i, index) {
      this.activeIndex = index;
      this.dataList.money = this.form.num * 10;
    },
    getData() {
      _request
        .http(this, "dashboard/purservice/getPrice", this.getList)
        .then((res) => {
          if (res.code == 200) {
            this.data = res.data;
          } else {
            this.$message("无数据");
          }
        });
    },
    toMoney() {
      this.dataList.money = this.form.num * 10;
      _request
        .http(this, "service/purFlow", this.dataList, this.form)
        .then((res) => {
          if (res.code == 200) {
          }
        });
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
.content-boxs {
  width: 95%;
  margin: 0 auto;
  border-radius: 5px;
  background: #fff;
  box-shadow: 3px 5px 3px 6px #f0f0f0;
}
.el-row {
  margin: 30px 0;
}
.el-button--small,
.el-button--small.is-round {
  padding: 10px 40px;
  margin-bottom: 20px;
}
ul {
  width: 92%;
  margin: 0 auto;
  li {
    font-size: 15px;
    display: flex;
    height: 60px;
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
      width: 95%;
      display: flex;
      height: 40px;
      align-items: center;
      // margin-left: 30px;
      .numItem {
        width: 40%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border: 1px solid rgb(142, 210, 250);
        // padding: 5px 20px;
        span {
          width: 20%;
          text-align: center;
          line-height: 40px;
          display: block;
        }
        a {
          color: #bdbcbc;
          font-size: 12px;
        }
      }
    }
  }
}
.active {
  background: rgb(142, 210, 250);
  // border-right: 10px solid rgb(142, 210, 250);
}
#yue {
  width: 92%;
  margin: 10px auto;
}
h5 {
  width: 95%;
  line-height: 40px;
  margin: 0 auto;
  font-size: 13px;
  color: #a8a5a5;
}
.contents {
  width: 95%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  line-height: 60px;
  align-items: center;
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
</style>
