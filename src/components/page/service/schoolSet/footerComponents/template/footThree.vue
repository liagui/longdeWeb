<template>
  <div>
    <div class="content-three">
      <div class="mate" :style="{ backgroundColor: footerOption.themeColor }">
        <div class="mate-list">
          <div v-for="(item, key) in footerOption.footNavList" :key="key">
            {{ item.name }}
          </div>
        </div>
        <div class="mate-server">
          <div style="float: left">
            <div style="float: left" v-if="footerOption.componyInfo">
              <span> {{ footerOption.componyInfo.records[0] }} </span>
              <span> {{ footerOption.componyInfo.records[1] }} </span>
              <span>版权所有</span>
            </div>
            <div style="float: left">京ICP备19014804号-1</div>
          </div>
          <div style="float: left; margin-left: 12px">
            <img
              :src="footerOption.recordInfo.logoUrl"
              alt=""
              style="background: #ffffff; width: 12px; height: 14px"
            />
            {{ footerOption.recordInfo.showName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "footThree",
  props: ["footerOption"],
};
</script>
<style lang="less" scoped>
.mate {
  width: 100%;
  height: 135px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  .mate-list {
    font-family: Source Han Sans CN;
    font-weight: 400;
    line-height: 15px;
    flex: 1;
    div {
      float: left;
      width: 100px;
      font-size: 14px;
      opacity: 0.6;
      height: 15px;
      border-right: 2px solid #ffffff;
      text-align: center;
      margin-top: 30px;
    }
    div:last-child {
      border: none;
    }
  }
  .mate-server {
    flex: 1;
    font-size: 12px;
    opacity: 0.2;
    line-height: 67px;
  }
}
</style>