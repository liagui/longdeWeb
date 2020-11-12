import store from '@/store';
// const ajaxurl = 'http://admin.zyrc66.com/';
const ajaxurl = process.env.API_ROOT;
// const ajaxurl = 'http://test.longde999.cn/admin/';

// const postImgUrl = 'http://admin.zyrc66.com/oss/uploadFile'; // 
const postImgUrl = ajaxurl + 'doUploadOssImage'; // 图片上传地址
const bigImgUrl = ajaxurl + 'videoUploadUrl'; // 视频上传地址
const postQuillImgUrl = ajaxurl + 'doUploadImage'; // 富文本上传图片地址
const doUploadOssFile = ajaxurl + 'doUploadOssFile'; //pdf、excel文件的上传

const webUrl = {
  masterDev:'http://twotest.admin.longde999.cn',//测试总控
  branchDev:'http://twotest.tiancheng.admin.longde999.cn',//测试中控

  masterProd:'http://admin.longde999.cn ',//生产总控
  branchProd:'http://tiancheng.admin.longde999.cn',//生产中控
}
const setHead = function () {
  return {
    'Authorization': 'Bearer ' + store.state.token
  }

}
// 测试服务器
export default {
  ajaxurl,
  postImgUrl,
  setHead,
  bigImgUrl,
  postQuillImgUrl,
  doUploadOssFile,
  webUrl
}
