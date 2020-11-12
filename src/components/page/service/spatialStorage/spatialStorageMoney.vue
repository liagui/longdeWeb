<template>
  <div class="content-boxs">
    <navlist></navlist>
    <h5>
      注：空间有效期为当前一购买空间的可使用期限，若网校空间已超过预购的空间有效期，学员将不可查看网校内的录播课以及课程资料等存储与网校内的资源内容
    </h5>
    <p id="yue">
      <img
        src="../../../../assets/image/statistics/jiage 拷贝 3@2x.png"
        alt=""
      />
      <span style="line-height：40px"
        >当前合约价格：{{ data.storage_price }}元/GB/月</span
      >
    </p>
    <div class="contents"><i></i>空间续费</div>
    <ul>
      <li>
        <img src="../../../../assets/image/statistics/yue@2x.png" alt="" />
        <span> 续费时长：</span>
        <div class="num">
          <span
            v-for="(item, index) in mouned"
            :key="index"
            @click="numMound(item, index)"
            :class="{ active: activeIndex == index }"
            >{{ item }}个月</span
          >
        </div>
      </li>
      <li>
        <img src="../../../../assets/image/statistics/shuliang@2x.png" alt="" />
        <span>空间大小：</span>
        <span style="margin-left: 30px">2500GB</span>
      </li>
      <li>
        <img
          src="../../../../assets/image/statistics/jiage 拷贝 3@2x.png"
          alt=""
        />
        <span>单价：</span>
        <span style="margin-left: 60px">{{ data.storage_price }}元/GB/月</span>
      </li>
      <li>
        <img src="../../../../assets/image/statistics/shijian@2x.png" alt="" />
        <span>到期日期：</span>
        <span style="margin-left: 30px">{{ timer || 2020 - 12 - 31 }}</span>
      </li>
      <li>
        <img
          src="../../../../assets/image/statistics/jiage 拷贝 3@2x.png"
          alt=""
        />
        <span>订单价格：</span>
        <span style="margin-left: 30px">{{
          dataList.month * data.storage_price
        }}</span>
      </li>
      <el-row>
        <el-button type="primary" @click="toMoney">支付</el-button>
      </el-row>
    </ul>
  </div>
</template>           
<script>
import navlist from "./navlist";
import _request from "@/utils/request";
import util from "@/filters/timer";
export default {
  name: "",
  data() {
    return {
      sizeForm: {
        date1: "",
        date2: "",
      },
      activeIndex: 0,
      data: {
        storage_price: 19,
      },
      dataList: {
        schoolid:  window.localStorage.getItem("school_id"),
        money: 1,
        month: 1,
        num: 1,
      },
      getList: {
        schoolid:  window.localStorage.getItem("school_id"),
      },
      mouned: [2, 4, 6, 7, 8, 10, 12],
      timer: "2020-12-30",
      space: "",
    };
  },
  components: {
    navlist,
  },
  computed: {},
  beforeMount() {},
  mounted() {
    this.getData();
    // _request.http(this, "school/spacedeatil", this.schoolId).then((res) => {
    //   console.log(res);
    //   this.timer = res.space_info.expires_time;
    // });
  },
  methods: {
    numMound(i, index) {
      this.dataList.month = i;
      this.activeIndex = index;
      _request.http(this, "timetodate", { num: i }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.timer = res.data;
        }
      });
    },
    getData() {
      _request
        .http(this, "dashboard/purservice/getPrice", this.getList)
        .then((res) => {
          if (res.code == 200) {
            console.log(res.data);
            this.data = res.data;
          }
        });
    },
    toMoney() {
      _request
        .http(this, "service/purStorageDate", this.dataList)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.data = res.data;
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
.active {
  background: rgb(59, 151, 236);
  color: #fff;
  border: none;
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
      display: flex;
      margin-left: 30px;
      span {
        margin-right: 20px;
        padding: 5px 15px;
        border-radius: 5px;
        border: 1px solid rgb(142, 210, 250);
      }
      a {
        color: #bdbcbc;
        font-size: 12px;
      }
    }
  }
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
