<template>
  <div>
    <transition name="msg-fade">
      <div v-if="isShow" class="dialog" :style="{'width': width, height: height}">
        <header>
          <span v-text="title"></span>
          <i class="el-icon-close" @click="closeDialog"></i>
        </header>
        <section>
          <slot></slot>
        </section>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </div>
    </transition>
    <div v-if="isShow" class="model" @click="maskCloseDialogEvent"></div>
  </div>
</template>
<script>
import dialogProps from './dialogProps.js';
export default {
  mixins: [dialogProps],
  created() {
    if(typeof this.beforeCreatDialog == 'function') {
      this.beforeCreatDialog();
    }
  },
  
}
</script>
<style lang="less" scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 30%;
  box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.3);
  z-index: 20;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    border-bottom: 1px solid #E0E0E0;
    padding: 5px 10px 10px;
    i {
      cursor: pointer;
      color: #999999;
      font-weight: bold;
    }
    span {      
      color: #333333;
    }
  }
  section {
    flex: 1;
    padding: 15px 30px 10px 20px;
  }
  footer {
    border-top: 1px solid #E0E0E0;
    display: flex;
    justify-content: center;
    padding: 10px 10px 0;
  }
}
.model {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
}

/* 媒体查询  最大宽1440*900屏 */
// @media (max-height: 900px) {
//   .dialog {
//     min-height: 250px;
//   }
// }
// /* 媒体查询  最大宽1366屏 */
// @media (max-width: 1366px) {
//   .dialog {
//     max-height: 350px;
//   }
// }
</style>