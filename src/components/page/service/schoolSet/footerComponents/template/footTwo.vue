<template>
  <div class="footer-container">
    <div class="compony-info">
      <img class="logo" :src="footerOption.componyInfo.logoUrl" alt="" />
      <div class="custom">{{ footerOption.componyInfo.custom }}</div>
      <div class="text">
        <span> {{ footerOption.componyInfo.records[0] }} </span>
        <span> {{ footerOption.componyInfo.records[1] }} </span>
        <span>版权所有</span>
        <span> {{ footerOption.componyInfo.records[2] }} </span>
      </div>
      <div class="record">
        <img :src="footerOption.recordInfo.logoUrl" class="record-img" alt="" />
        {{ footerOption.recordInfo.showName }}
      </div>
    </div>
    <div class="nav-lit">
      <div v-for="(item, key) in footerOption.footNavList" :key="key">
        {{ item.name }}
      </div>
    </div>
    <div class="marketing-url">
      <div class="left">
        <div class="text">在这里关注我们的动向</div>
        <div class="foot-icon">
          <img
            class="qq"
            src="../../../../../../assets/image/school/schoolset/icon/qq.png"
            alt=""
          />
          <img
            class="wb"
            src="../../../../../../assets/image/school/schoolset/icon/wb.png"
            alt=""
          />
          <img
            class="wx"
            src="../../../../../../assets/image/school/schoolset/icon/wx.png"
            alt=""
          />
        </div>
      </div>
      <img :src="footerOption.marketingUrl.wx.url" alt="" class="qrcode" />
    </div>
  </div>
</template>

<script>
export default {
  name: "footTwo",
  props: ["footerOption"],
  mounted() {
    console.log(this.footerOption);
  },
};
</script>
<style lang="less" scoped>
.footer-container {
  padding: 50px 30px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #282828;
  color: rgba(255, 255, 255, 0.3);
}
.compony-info {
  padding-right: 120px;
  .logo {
    width: 100px;
    height: 30px;
  }
  .custom {
    margin-top: 20px;
    font-size: 18px;
  }
  div {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.3);
  }
}
.nav-lit {
  display: inline-block;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-shrink: 0;
  width: 170px;
  height: auto;
  border-left: rgba(255, 255, 255, 0.1) 1px solid;
  border-right: rgba(255, 255, 255, 0.1) 1px solid;
  div {
    display: inline-block;
    line-height: 30px;
    height: 30px;
    width: 80px;
    text-align: center;
    font-size: 14px;
  }
}
.record {
  display: flex;
  align-items: center;
  img {
    display: inline-block;
    margin-right: 5px;
    width: 15px;
    height: 15px;
  }
}
.marketing-url {
  display: flex;
  padding-left: 50px;
  .foot-icon {
    min-width: 150px;
    margin-top: 10px;
    .qq {
      margin-right: 25px;
      width: 22px;
      height: 27px;
    }
    .wb {
      margin-right: 25px;
      width: 34px;
      height: 28px;
    }
    .wx {
      width: 33px;
      height: 28px;
    }
  }
  .qrcode {
    display: block;
    margin-left: 30px;
    width: 100px;
    height: 100px;
  }
}
</style>