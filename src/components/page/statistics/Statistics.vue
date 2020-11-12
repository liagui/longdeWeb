<template>
  <div class="box">
    <div class="record phone">
      <nav>
        <p>手机端</p>
        <p>{{ userNum.count }}</p>
      </nav>
      <img src="../../../assets/image/statistics/phone.png" alt="" />
    </div>
    <div class="record gift">
      <nav>
        <p>线下录入</p>
        <p>{{ userNum.mobile }}</p>
      </nav>
      <img src="../../../assets/image/statistics/gift.png" alt="" />
    </div>
    <div class="record comput">
      <nav>
        <p>官网注册</p>
        <p>{{ userNum.offline }}</p>
      </nav>
      <img src="../../../assets/image/statistics/comput.png" alt="" />
    </div>
    <div class="record user">
      <nav>
        <p>合计新增学员</p>
        <p>{{ userNum.website }}</p>
      </nav>
      <img src="../../../assets/image/statistics/timer.png" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  props: ["userNum"],
  data() {
    return {};
  },
  created() {},
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {},
  methods: {},
  watch: {},
};
</script>
<style  scoped lang="less">
.box {
  display: flex;
  margin: 0 25px;
  margin-bottom: 25px;
}
.phone {
  background: url("../../../assets/image/statistics/blue.png") no-repeat 100%;
}
.gift {
  background: url("../../../assets/image/statistics/pink.png") no-repeat 100%;
}
.comput {
  background: url("../../../assets/image/statistics/green.png") no-repeat 100%;
}
.user {
  background: url("../../../assets/image/statistics/red.png") no-repeat 100%;
}
.record {
  display: flex;
  width: 240px;
  height: 140px;
  box-sizing: border-box;
  padding: 8px 28px;
  margin-right: 40px;
  justify-content: space-between;
  align-items: center;
  color: white;
}
[class*=" el-icon-"],
[class^="el-icon-"] {
  font-size: 50px;
}
p {
  padding: 0;
  margin: 0;
  line-height: 40px;
}
</style>

