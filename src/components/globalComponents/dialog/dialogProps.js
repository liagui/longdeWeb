export default {
  props: {
    isShow: { //控制弹窗显示隐藏
      type: Boolean,
      default: true
    },
    beforeCreatDialog: { //弹窗打开的回调
      type: Function,
      default: (res) => {
        return res;
      }
    },
    maskCloseDialog: { // 是否支持遮罩层点击后关闭
      type: Boolean,
      default: true
    },
    title: {
      default: '',
      type: String
    },
    width: {
      type: String,
      default: "30%"
    },
    height: {
      type: String,
      default: "450px"

    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    maskCloseDialogEvent() {
      if(this.maskCloseDialog) {
        this.$emit('closeDialog', false);
      }
    }
  },
  watch: {
  }
}