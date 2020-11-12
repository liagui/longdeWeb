<template>

  <div class="confrim">
    <transition name="msgbox-fade">
      <div class="confrimBox" v-if="isshow" :style="{'width': width}">
        <header>
          <i :class="{'isShowCancelIcon': !isShowCancelIcon}" class="el-icon-close conf_close_icon" @click="close"></i>
        </header>
        <section>
          <p>
            <i class="el-icon-warning"></i>
            <span v-if="jsx" v-html="jsx"></span>
            <span v-else>{{message}}</span>
          </p>
        </section>
        <footer>
          <div class="conf_one" v-if="isShowSureButtonPosition">
            <el-button class="conf_close" v-show="isShowSureButton" size="mini" @click="close">取消</el-button>
            <el-button class="conf_yes" type="primary" size="mini" @click="sure">确定</el-button>
          </div>
          <div class="conf_two" v-else>
            <el-button class="conf_yes" size="mini" @click="sure">确定</el-button>
            <el-button class="conf_close" type="primary" v-show="isShowSureButton" size="mini" @click="close">取消</el-button>
          </div>
        </footer>
      </div>
    </transition>
    <div v-if="isshow" class="model" @click="maskClose"></div>
  </div>

</template>
<script>
  import confrom from './confrom.js';
  export default {
    mixins: [confrom],
    props: {
      message: {
        type: String,
        default: '确认重新认证身份?'
      }
    },
    data() {
      return {
        isSure: Boolean
      }
    },
    created() {
    },
    methods: {
      stopEvent() {
      },
      maskClose() {
        if(this.maskCloseDialog) {
          this.close()
        }
      },
      close() {
        this.isSure = false;

      },
      sure() {
        this.isSure = true;
      }
    }


  }
</script>
<style lang="less" scoped>
  .confrimBox {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 20%;
    height: 131px;
    line-height: 22px;
    border-radius: 6px;
    background: #ffffff;
    z-index: 10000;
    padding: 10px 20px 20px;
    transition: 0.3s;
    header {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      i {
        cursor: pointer;
      }
    }
    section {
      flex: 1;
      // font-weight: bold;
      text-align: center;
      font-size: 14px;
      padding-top: 30px;
    }
    footer {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  .model {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: 0.2s;
  }
  .el-icon-close {
    color: #909399;
  }
  .isShowCancelIcon {
    visibility: hidden;
  }
</style>
