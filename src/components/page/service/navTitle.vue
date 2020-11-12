<template>
  <div>
    <div class="rechargeNav">
      <span>{{ data.name }}</span>
      <a style="color: #fc9541" href="https://www.baidu.com/">{{ data.dns }}</a>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span>服务到期：{{ data.end_time }}</span>
    </div>
  </div>
</template>
<script >
import _request from "@/utils/request";
export default {
  name: "",
  data() {
    return {
      form: {
        school_id: window.localStorage.getItem("school_id"),
      },
      data: {},
    };
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      console.log(this.form);
      _request.http(this, "school/getSchoolUpdate", this.form).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.data = res.data;
          this.balance = res.data.balance;
        }
      });
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
.content-box {
  padding: 0;
  margin: 0;
}
.rechargeNav {
  background-color: white;
  line-height: 50px;
  display: flex;
  // padding: 10px 35px;
  // border-bottom: 2px solid #f0f0f0;
  span {
    margin-right: 40px;
    margin-left: 10px;
    font-size: 15px;
  }
}
</style>
