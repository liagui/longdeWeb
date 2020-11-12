<template>
  <div class="content-boxs">
    <navlist></navlist>
    <div class="liu-item">
      <span
        >流量提醒：<el-input
          type="text"
          style="width: 100px"
          v-model="liu"
        ></el-input
        >GB</span
      >
      <el-button type="primary" @click="addListen">添加提醒</el-button>
      <span style="color: #666; font-size: 15px"
        >说明：当流量消耗到设置值时给管理员发送短信提醒，提醒充值流量，最多可设置三个值</span
      >
    </div>
    <!-- 流量图统计图切换 -->
    <div class="tab">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="统计概况" name="first">
          <!-- 饼状图-->
          <div
            id="echartBox"
            ref="echartBox"
            style="width: 600px; height: 400px; margin: 0 auto"
          ></div>
          <!-- 饼状图-->
          <div
            id="echartBoxt"
            ref="echartBoxt"
            style="width: 600px; height: 400px; margin: 0 auto"
          ></div>
        </el-tab-pane>
        <el-tab-pane label="流量统计详情" name="second">
          <div class="timer">
            <!-- 时间日历组件 -->
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="起始时间：">
                <el-col :span="8">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="form.start_date"
                    style="width: 100%"
                  ></el-date-picker>
                </el-col>
                <el-col class="line" :span="1" style="text-align: center"
                  >至</el-col
                >
                <el-col :span="8">
                  <el-date-picker
                    placeholder="选择日期"
                    v-model="form.end_date"
                    style="width: 100%"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
            </el-form>
            <!-- 时间日历组件结束 -->
            <!-- 下拉 -->

            <el-dropdown size="medium" split-button>
              全部
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>一个月</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button type="primary">搜索</el-button>
          </div>
          <div class="center">
            <img src="../../../../assets/image/timer.png" alt="" />
            <p>总计：<a style="color: blue">436546757645</a>GB</p>
            <p>说明：统计数据最多延时24个小时</p>
          </div>
          <!-- 折线图-->
          <div
            id="echartBoxs"
            ref="echartBoxs"
            style="width: 1000px; height: 400px; margin: 0 auto"
          ></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import navlist from "./navlist";
import _request from "@/utils/request";
// 引入 ECharts 主模块
import echarts from "echarts";
export default {
  name: "",
  data() {
    return {
      space_info: {},
      space_chart: {},
      traffic_chart: {},
      datalist: [
        { date: "2020-11", count: "0" },
        { date: "2020-12", count: "10" },
      ],
      activeName: "first",
      liu: "",
      form: {
        schoolid: window.localStorage.getItem("school_id"),
        start_date: "",
        end_date: "",
      },
    };
  },
  components: {
    navlist,
  },
  computed: {},
  beforeMount() {},
  mounted() {
    this.detailLiu();
    this.drawEcharts();
  },
  methods: {
    addListen() {
      if (this.liu != "") {
        this.$toast("添加提醒成功");
      }
    },
    detailLiu() {
      _request.http(this, "school/spacedeatil", this.form).then((res) => {
        console.log(res);
        this.space_info = res.space_info;
        this.space_chart = res.space_chart;
        this.traffic_chart = res.traffic_chart;
      });

      _request.http(this, "school/trafficdetail", this.form).then((res) => {
        this.datalist = res.list;
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    drawEcharts() {
      // 基于准备好的dom，初始化echarts实例 饼状图一
      var myChart = echarts.init(document.getElementById("echartBox"));
      // 绘制图表
      myChart.setOption({
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              {
                value: this.traffic_chart.video.used,
                name: this.traffic_chart.video.percent,
              },
              {
                value: this.traffic_chart.document.used,
                name: this.traffic_chart.document.percent,
              },
              {
                value: this.traffic_chart.free.used,
                name: this.traffic_chart.free.percent,
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
      // 饼状图二
      // 基于准备好的dom，初始化echarts实例
      var myChartt = echarts.init(document.getElementById("echartBoxt"));
      // 绘制图表
      myChartt.setOption({
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              {
                value: this.space_chart.video.used,
                name: this.space_chart.video.percent,
              },
              {
                value: this.space_chart.document.used,
                name: this.space_chart.document.percent,
              },
              {
                value: this.space_chart.free.used,
                name: this.space_chart.free.percent,
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
      //折线图
      var myCharts = echarts.init(document.getElementById("echartBoxs"));
      // 绘制图表
      myCharts.setOption({
        title: [
          {
            left: "center",
          },
          {
            top: "55%",
            left: "center",
          },
        ],
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          data: [this.datalist[0].date, this.datalist[1].date],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "line",
            data: [this.datalist[0].count, this.datalist[1].count],
          },
        ],
      });
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
.tab {
  width: 95% !important;
  margin: 30px auto;
}
.el-dropdown .el-button-group {
  width: 220px;
}
.center {
  width: 20%;
  // height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin: 20px auto;
  img {
    width: 60px;
    height: 60px;
  }
}
.timer {
  width: 100%;
  display: flex;
  .el-button {
    height: 33px;
    margin: 0 20px;
  }
}
.el-form {
  margin-right: 0;
}
// .el-tabs__nav-scroll {
//   border: none;
// }
.liu-item {
  width: 95%;
  height: 50px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  input[type="text"] {
    height: 28px;
    border: 1px solid #acabab;
    width: 100px;
  }
  .el-button {
    margin: 0 20px;
  }
}

.num {
  margin: 10px auto;
  width: 90%;
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
.content-boxs {
  width: 95%;
  margin: 0 auto;
  border-radius: 5px;
  background: #fff;
  box-shadow: 3px 5px 3px 6px #f0f0f0;
}
</style>
