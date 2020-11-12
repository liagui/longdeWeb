import Vue from "vue";
import axios from "axios";
const qs = require("qs");
import store from '@/store';
import global from '@/store/global';
console.log(store.state)
// 创建axios实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
  // baseURL: global.ajaxurl,
  headers: {
    'Authorization': 'Bearer ' + store.state.token,
    'CurAdminId': store.state.cur_admin_id
  },
  baseURL: process.env.NODE_ENV === "production" ? global.ajaxurl : '/api', // 买家端API
  paramsSerializer: params =>
    qs.stringify(params, {
      arrayFormat: "repeat"
    })
});

// request拦截器
service.interceptors.request.use(
  config => {
    const { loading, message } = config;
    const is_post = config.method === "post";
    const is_put = config.method === "put";
    const is_json = config.headers["Content-Type"] === "application/json";
    const is_file = config.headers["Content-Type"] === "multipart/form-data";
    if (is_post && is_json) {
      config.data = JSON.stringify(config.data);
    }
    if (is_put) {
      config.headers["Content-Type"] = "application/json";
    }
    if (is_post && !is_file && !is_json) {
      config.data = qs.stringify(config.data, {
        arrayFormat: "repeat"
      });
    }

    /** 配置全屏加载 */
    if (loading === true) {
      config.loading = Toast.loading({
        mask: true,
        message: message || "loading...",
        duration: "0",
        className: "vant-loading"
      });
    }

    if (process.env.NODE_ENV === "development") {
      // 测试环境配置
    }
    if (process.env.NODE_ENV === "production") {
      // 生产环境配置
    }
    // config配置
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  async response => {
    await closeLoading(response);
    // if (response.error == "error") {
    //   Toast(response.message);
    // }
    if (response.data.code == 200) {
      return response.data.data;
    } else {
      //   Toast.fail(response.data.message);
      return Promise.reject(response.data);
    }
  },
  async error => {
    if (process.server) return Promise.reject(error);
    await closeLoading(error);
    const error_response = error.response || {};
    const error_data = error_response.data || {};
    if (error_response.status === 401) {
      // const { $store, $router, $route } = Vue.prototype.$nuxt
      return Promise.reject(error);
    }
    if (error.config && error.config.message !== false) {
      let _message =
        error.code === "ECONNABORTED" ? "连接超时，请稍候再试！" : null;
      _message = error_data.message || _message;
      _message && Vue.prototype.$message.error(error_data.message);
    }
    return Promise.reject(error);
  }
);

/**
 * 关闭全局加载
 * @param target
 */
const closeLoading = target => {
  if (!target.config || !target.config.loading) return true;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //   Toast.clear();
      resolve();
    }, 200);
  });
};

export const Method = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete"
};

export default function request(options) {
  return new Promise((resolve, reject) => {
    service(options)
      .then(resolve)
      .catch(reject);
  });
}