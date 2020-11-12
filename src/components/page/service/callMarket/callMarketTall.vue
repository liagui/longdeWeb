<template>
  <div class="content-boxs">
    <div class="contents">
      <div class="div">
        <span><i>|</i>工具条设置</span>
        <p class="p">
          说明：营销工具条将在网校右侧显示。展现内容将根据
          <a style="color: blue">系统-营销工具</a> 中的配置
        </p>
      </div>
    </div>
    <div class="nav">
      <div class="mo" @click="xuanM(1)">
        <p>模板一</p>
        <div class="pic img1">
          <button v-if="indexs == 1">已选择</button>
          <img src="../../../../assets/image/kefu/three.png" alt="" />
        </div>
      </div>
      <div class="mo" @click="xuanM(2)">
        <p>模板二</p>
        <div class="pic img2">
          <button v-if="indexs == 2">已选择</button>
          <img src="../../../../assets/image/kefu/one.png" alt="" />
        </div>
      </div>
      <div class="mo" @click="xuanM(3)">
        <p>模板三</p>

        <div class="pic img3">
          <button v-if="indexs == 3">已选择</button>
          <img src="../../../../assets/image/kefu/two.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
export default {
  name: "",
  data() {
    return {
      value: true,
      imgUrl: [],
      indexs: 0,
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
      _request.http(this, "services/workboxlist").then((res) => {
        if (res.code == 200) {
          console.log(res);
        }
      });
    },

    xuanM(i) {
      console.log(i);
      this.$toast("选择成功");
      _request.http(this, "services/workboxlist", { type: i }).then((res) => {
        if (res.code == 200) {
          console.log(res);
        }
      });

      if (i == 1) {
        this.indexs = 1;
      } else if (i == 2) {
        this.indexs = 2;
      } else if (i == 3) {
        this.indexs = 3;
      }
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
.content-boxs {
  width: 95%;
  background: #fff;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow: 3px 5px 5px 3px #f0f0f0;

  .contents {
    width: 100%;
    padding: 0 20px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 3px 5px 5px 3px #f0f0f0;
    .div {
      width: 50%;
      display: flex;
      align-items: center;
      span {
        i {
          width: 2px;
          height: 30px;
          margin-right: 10px;
          font-size: 20px;
          color: rgb(6, 157, 245);
        }
      }
      .p {
        font-size: 12px;
        line-height: 60px;
        color: #666;
        margin: 0 20px;
      }
    }
  }
}

.nav {
  width: 100%;
  height: 500px;
  margin: 50px auto;
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px solid #fff;
  .mo {
    width: 420px;
    height: 450px;
    display: flex;
    .img1 {
      img {
        width: 267px;
        height: 416px;
      }
    }
    .img2 {
      img {
        width: 337px;
        height: 416px;
      }
    }
    .img3 {
      img {
        width: 293px;
        height: 380px;
      }
    }
    p {
      width: 80px;
      line-height: 40px;
      font-size: 15px;
      text-align: center;
    }

    .pic {
      width: 420px;
      height: 450px;
      // margin: auto;
      box-shadow: 2px 2px 2px 2px #f0f0f0;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      button {
        position: absolute;
        top: 0;
        left: 0;
        border: none;
        outline: none;
        background: rgb(87, 183, 247);
        font-size: 14px;
        color: #fff;
        padding: 5px 15px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    }
  }
}
</style>
