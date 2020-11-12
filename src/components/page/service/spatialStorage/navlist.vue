<template>
  <div>
    <div class="contents">
      <i></i>空间购买&nbsp;&nbsp;
      <p>
        <img
          src="../../../../assets/image/statistics/liuliang (1)@2x.png"
          alt=""
        />流量:<span style="color: blue">{{ space_info.space_total }}GB</span>
      </p>
      <p>
        <img
          src="../../../../assets/image/statistics/kongjian@2x.png"
          alt=""
        />空间:<span style="color: blue">{{ space_info.space_used }}GB</span>
      </p>
      <p>
        <img
          src="../../../../assets/image/statistics/shijian@2x.png"
          alt=""
        />空间有效期:<span style="color: blue">{{
          space_info.expires_time
        }}</span>
      </p>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
export default {
  name: "",
  data() {
    return {
      space_info: {},
      schoolId: {
        schoolid: window.localStorage.getItem("school_id"),
      },
    };
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {
    this.detailLiu();
  },
  methods: {
    detailLiu() {
      _request.http(this, "school/spacedeatil", this.schoolId).then((res) => {
        console.log(res);
        this.space_info = res.data.space_info;
      });
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
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
