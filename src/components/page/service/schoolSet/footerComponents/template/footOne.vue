<template>
  <div class="foot-container">
    <div class="foot-left">
      <div
        class="foot-item"
        v-for="(item, key) in footerOption.footNavList"
        :key="key"
      >
        <div class="item-title">
          <div class="title">{{ item.name }}</div>
          <ul>
            <li v-for="(child, index) in item.children" :key="index">
              {{ child.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="foot-right">
      <img class="logo" :src="footerOption.componyInfo.logoUrl" alt="" />
      <template v-if="footerOption.componyInfo.records">
        <div class="text" style="margin-top: 15px">
          <span> {{ footerOption.componyInfo.records[0] }} </span>
          <span> {{ footerOption.componyInfo.records[1] }} </span>
          <span>版权所有</span>
        </div>
        <div class="text">{{ footerOption.componyInfo.records[2] }}　</div>
      </template>
      <div class="text">
        <img
          :src="footerOption.recordInfo.logoUrl"
          alt=""
          class="record-logo"
        />
        {{ footerOption.recordInfo.showName }}　
      </div>
      <div class="foot-icon">
        <img
          class="qq"
          v-if="footerOption.marketingUrl.qq.status"
          src="../../../../../../assets/image/school/schoolset/icon/qq.png"
          alt=""
        />
        <img
          class="wb"
          v-if="footerOption.marketingUrl.wb.status"
          src="../../../../../../assets/image/school/schoolset/icon/wb.png"
          alt=""
        />
        <img
          class="wx"
          v-if="footerOption.marketingUrl.wx.status"
          src="../../../../../../assets/image/school/schoolset/icon/wx.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "footOne",
  props: ["footerOption"],
  mounted() {
    console.log(this.footerOption);
  },
};
</script>
<style lang="less" scoped>
.foot-container {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  color: #fff;
  padding: 30px;
  background-color: #282828;
  .foot-left {
    flex: 3;
    display: flex;
    justify-content: center;
  }
  .foot-right {
    flex: 1;
  }
}
.foot-item {
  box-sizing: border-box;
  width: 160px;
  padding: 0 40px;
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  &:not(:last-child) {
    border-right: solid 1px rgba(255, 255, 255, 0.3);
  }
  .item-title {
    width: 100%;
    color: rgba(255, 255, 255, 0.5);
  }
  ul {
    width: 100%;
  }
  li {
    margin-top: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
  }
}
.foot-right {
  box-sizing: border-box;
  padding-right: 50px;
  font-size: 12px;
  .text {
    color: #fff;
    opacity: 0.2;
    line-height: 20px;
  }
  .logo {
    width: 100px;
    height: 30px;
  }
  .record-logo {
    width: 14px;
    height: 14px;
  }
}
.foot-icon {
  margin-top: 30px;
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
</style>