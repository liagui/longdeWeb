<template>
  <div class="content-boxs">
    <div class="contents">
      <i></i>预存分配
      <p>
        <img
          src="../../../../assets/image/statistics/bingfa@2x.png"
          alt=""
        />当前剩余可分配并发:<span style="color: blue">10000</span>
      </p>
    </div>
    <h5>
      注：并发数为网校购买的用于学员在直播间内上课或查看直播回放的最大人数，若网校学员已超过预购的并发数，学员将无法进入直播间上课
    </h5>

    <div class="classify num">
      <span
        v-for="(title, index) in dateList"
        :key="title.index"
        @click="onItemClick(title.year, index)"
        :class="{ active: index == nums }"
        >{{ title.year }}</span
      >
    </div>

    <ul
      class="content"
      v-for="(item, index) in dateList"
      v-show="index == nums"
      v-bind:key="item.index"
    >
      <li v-for="(content, i) of item.list" v-bind:key="i" class="news">
        <!-- <div v-for="(content,ind) in list.child" :key="ind"> -->

        <span>{{ content.month }}月</span>
        {{ content.counts }}并发
        <a
          @click="setDate(i, content.month, content.counts)"
          v-show="content.assignment_enable && content.assignment_status"
          >分配并发</a
        >
      </li>
    </ul>

    <!--  -->
    <div class="contents" style="border: none">
      <i></i>
      {{ year }}-{{ formt.log_data }}并发分配记录
    </div>
    <template>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="username" label="操作人" width="180">
        </el-table-column>
        <el-table-column prop="log_date" label="操作时间" width="180">
        </el-table-column>
        <el-table-column prop="num" label="分配并发"> </el-table-column>
        <el-table-column prop="after_num" label="分配后当月可用并发">
        </el-table-column>
      </el-table>
    </template>

    <!-- 弹出层 -->
    <el-dialog
      title="分配并发  可用并发：1000个"
      :close-on-click-modal="false"
      :visible.sync="isShow"
      width="30%"
    >
      <div class="top">
        <span>分配：</span>
        <el-input v-model="form.num" placeholder="填入分配数量"></el-input>
        <span>↑</span>
      </div>
      <p
        style="
          color: red;
          margin-bottom: 100px;
          width: 70%;
          margin: 0 auto 100px auto;
          line-height: 40px;
        "
      >
        注：分配完成后无法撤销，请谨慎操作
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="sureNum">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _request from "@/utils/request";
export default {
  name: "",
  data() {
    return {
      isShow: false,
      activeName: "first",
      nums: 0,
      tableData: [],
      dateList: [],
      form: {
        schoolid: window.localStorage.getItem("school_id") ,
        month: 1,
        num: 1,
      },
      forms: {
        schoolid: window.localStorage.getItem("school_id") ,
      },
      formt: {
        schoolid: window.localStorage.getItem("school_id"),
        log_data: "01",
      },
      getForm: {},
      year: "2020",
      month: "",
    };
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {
    this.initData();
  },
  methods: {
    // 点击切换年份
    onItemClick(year, index) {
      // console.log(index);
      this.nums = index;
      this.year = year;
    },
    // 点击弹框设置并发数
    sureNum() {
      this.isShow = false;
      _request.http(this, "school/setdistribution", this.form).then((res) => {
        if (res.code == 0) {
          console.log(res);
        }
      });
    },

    // 获取点击的月份
    setDate(i, m, c) {
      this.month = m;
      this.formt.log_data = m;
      this.form.month = this.year + "-" + this.month + "-01";
      console.log(this.form.month);
      this.isShow = true;
      _request.http(this, "school/getdistribution", this.form).then((res) => {
        if (res.code == 200) {
          console.log(res);
        }
      });
      // 对应月份显示对应并发记录接口
      _request
        .http(this, "getSchoolConnectionsByDate", this.formt)
        .then((res) => {
          console.log(res);
          this.tableData = res.data;
        });
    },

    // 获取每年每月并发数
    initData() {
      _request
        .http(this, "school/connectiondistribution", { schoolid: 3 })
        .then((res) => {
          console.log(res);
          if (res.code == 0) {
            console.log(res);
            this.dateList = res.connections;
          }
        });
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
.top {
  display: flex;
  justify-content: space-between;
  span {
    width: 80px;
    text-align: center;
  }
}
.active {
  background: rgb(41, 122, 245);
  color: #bdbcbc;
}
.el-input {
  flex: 1;
}

.el-dialog__header {
  border-radius: 1px solid #f0f0f0;
}
.el-dialog__title {
  font-size: 14px !important;
}
.el-table {
  width: 90% !important;
  margin: 0 auto;
  margin-bottom: 15px;
}
.el-table td,
.el-table th {
  text-align: center !important;
}
.content-boxs {
  width: 95%;
  background: #fff;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow: 3px 5px 5px 3px #f0f0f0;
  h5 {
    width: 95%;
    line-height: 40px;
    margin: 0 auto;
    font-size: 15px;
    color: #c2bfbf;
    border-bottom: 10px solid #fff;
  }
}
ul {
  width: 90%;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  li {
    width: 220px;
    height: 100px;
    margin: 10px 25px 10px 0;
    line-height: 100px;
    text-align: center;
    background: url("../../../../assets/image/statistics/曲线 3 拷贝 4@2x.png")
      no-repeat;
    background-size: 100% 100%;
    position: relative;

    span {
      position: absolute;
      top: -35px;
      font-size: 15px;
      left: 5px;
    }
    a {
      position: absolute;
      top: -35px;
      font-size: 15px;
      right: 5px;
      display: none;
      color: #5eb5fc;
    }
  }
  li:hover {
    background: url("../../../../assets/image/statistics/曲线 3@2x.png")
      no-repeat;
    background-size: 100% 100%;
    a {
      display: block;
    }
  }
}
.num {
  display: flex;
  margin-left: 30px;
  span {
    margin-right: 20px;
    padding: 3px 20px;
    border-radius: 5px;
    border: 1px solid rgb(41, 122, 245);
  }
  span:hover {
    border: 1px solid rgb(122, 181, 240);
  }
  a {
    color: #bdbcbc;
    font-size: 12px;
  }
}
.contents {
  width: 95%;
  line-height: 60px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* margin-left: 20px; */
  margin-bottom: 20px;
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
