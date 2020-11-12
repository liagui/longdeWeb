<template>
  <div class="content">
    <p class="contents"><i></i> 直播明细</p>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="活动时间：">
        <el-col :span="8">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.start_date"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center; width: 50px"
          >至</el-col
        >
        <el-col :span="8">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.end_date"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-button type="info" @click="zhiBo">搜索</el-button>
    </el-form>
    <div class="brokendiv">
      <!-- 折线图-->
      <div id="echartBox" ref="echartBox"></div>
    </div>
  </div>
</template>
<script>
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
import _request from "@/utils/request";
// 引入 ECharts 主模块
import echarts from "echarts";
export default {
  name: "",
  data() {
    return {
      form: {
        schoolid: window.localStorage.getItem("school_id"),
        start_date: "",
        end_date: "",
      },
      datalist: [
        {
          date: "2020-10-1",
          count: 100,
        },
        {
          date: "2020-10-2",
          count: 100,
        },
      ],
    };
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {
    //折线图
    var myCharts = echarts.init(document.getElementById("echartBox"));
    // 绘制图表
    myCharts.setOption({
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
    this.zhiBo();
  },
  methods: {
    zhiBo() {
      _request.http(this, "school/connections", this.form).then((res) => {
        console.log(res);
        this.datalist = res.list;
      });
    },
    search() {},
  },
  watch: {},
};
</script>
<style scoped lang="less">
.content {
  width: 95%;
  padding: 0;
  margin: 0 auto;
  border-radius: 5px;
  background: #fff;
  box-shadow: 3px 5px 3px 5px #f0f0f0;
  // background: #faf9f9;
}
.brokendiv {
  width: 95%;
  #echartBox {
    width: 700px;
    margin: 0 auto;
    height: 400px;
  }
}
.contents {
  width: 95%;
  margin: 0 auto;
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  line-height: 60px;
  margin-bottom: 20px;

  i {
    width: 4px;
    height: 20px;
    background: rgb(18, 161, 228);
    margin-right: 10px;
  }
}

.el-col-2 {
  padding: 0 30px;
}
.el-form-item__label {
  width: 80px;
  text-align: center;
}
form {
  height: 35px;
  margin-left: 20px;
  display: flex;
}
</style>
