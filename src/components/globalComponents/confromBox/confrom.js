export default {
  props: {
    maskCloseDialog: { // 是否支持遮罩层点击后关闭
      type: Boolean,
      default: false
    },
    isShowSureButton: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '250px'
    },
    isShowCancelIcon: {
      type: Boolean,
      default: true
    },
    jsx: {
      type: String,
      default: ''
    },
    isShowSureButtonPosition: {
      type: Boolean,
      default: true
    },
  }
}
