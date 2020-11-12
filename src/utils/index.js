// import store from '../store';
import Vue from 'vue';
//get params from url
export function getParams(url) {
  url = url || window.location.href;
  if (url.indexOf('#') != -1) {
    url = url.split('#')[1];
  }

  let params = '';

  if (url.indexOf('?') != -1) {
    params = url.substr(url.indexOf('?') + 1);
  }

  let obj = {};

  if (params) {
    let arr = [];

    if (params.indexOf('&') == -1) {
      arr = [params];
    } else {
      arr = params.split('&');
    }
    for (let i = 0; i < arr.length; i++) {
      let s = arr[i].split('=');

      obj[s[0]] = decodeURIComponent(s[1]);
    }
  }
  return obj;
}
export function objToUrlParam(obj) {
  var urlParamStr = '';
  if (obj.constructor == Object) {
      var cssStr = '';
      for (var key in obj) {
          cssStr += key + '=' + obj[key] + '&';
      }
      urlParamStr = cssStr.substr(0, cssStr.length - 1);
      urlParamStr = !urlParamStr ? '' : '?'+urlParamStr;
  }
  return urlParamStr;
}
// 上传图片之前
export function testPostImage(file,_this) {
  const isPic =
    file.type === "image/jpeg" || "image/png" || "image/jpg" || "image/gif";
  const isLt2M = file.size / 1024 /1024 < 3;
  if (!isPic) {
    alert('上传图片必须是JPG/PNG/GIF/JPEG 格式!')    
  }
  if (!isLt2M) {    
    alert('上传图片大小不能超过 3MB!');    
  }
  return isPic && isLt2M;
}
// 上传文件之前
// export function testPostFile(file, _this) {
//   const isPic =
//     file.type === "image/jpeg" || "image/png" || "image/jpg" || "image/gif";
//   const isLt2M = file.size / 1024 / 1024 < 3;
//   if (!isPic) {
//     alert('上传图片必须是JPG/PNG/GIF/JPEG 格式!')
//   }
//   if (!isLt2M) {
//     alert('上传图片大小不能超过 3MB!');
//   }
//   return isPic && isLt2M;
// }

//上传图片
export function postImg(imgFile) {
  var formData = new FormData();
  console.log(imgFile);
  formData.append("file", imgFile);
  return new Promise((resolve, reject) => {
    axios.post(this.GLOBAL.postImgUrl, formData).then(res => {
      switch (res.data.message.code) {
        case 1:
          resolve(res.data.data);
          break;
        default:
          reject(res.data.message.userMsg);
          alert(res.data.message.userMsg);
          // this.$toast({
          //   type: "info",
          //   message: res.data.message.userMsg
          // });
          break;
      }
    });
  });
}


//set session
export function setSen(k, val) {
  if (typeof val == 'string') {
    sessionStorage.setItem(k, val);
    return val;
  }
  sessionStorage.setItem(k, JSON.stringify(val));
  return val;
}

//get session
export function getSen(k) {
  let uu = sessionStorage.getItem(k);

  try {
    if (typeof JSON.parse(uu) != 'number') {
      uu = JSON.parse(uu);
    }
  } catch (e) {}
  return uu;
}

//set local
export function setLoc(k, val) {
  if (typeof val == 'string') {
    localStorage.setItem(k, val);
    return val;
  }
  localStorage.setItem(k, JSON.stringify(val));
  return val;
}

//get local
export function getLoc(k) {
  let uu = localStorage.getItem(k);

  try {
    if (typeof JSON.parse(uu) != 'number') {

      
      uu = JSON.parse(uu);
    }
  } catch (e) {}
  return uu;
}

//clear session
export function clearKey(k) {
  if (k) {
    sessionStorage.removeItem(k);
  } else {
    sessionStorage.clear();
  }
}

//获取屏幕宽度高度
export function getClient() {
  let clientWidth = document.documentElement.clientWidth;
  let clientHeight = document.documentElement.clientHeight;

  return {
    clientWidth,
    clientHeight
  };
}

//格式化距离
export function formatDistance(distance) {
  if (distance < 0.1) {
    return '<100m';
  } else if (distance >= 0.1 && distance < 1) {
    return distance * 1000 + 'm';
  } else if (distance >= 1) {
    return distance.toFixed(1) + 'km';
  }
}

//序列化对象和数组
export function serialize(data) {
  if (data != null && data != '') {
    try {
      return JSON.parse(JSON.stringify(data));
    } catch (e) {
      if (data instanceof Array) {
        return [];
      }
      return {};
    }
  }
  return data;
}

//计算金额加减时防止金额失去精度
export function calculatePrice(price = 0) {
  if (typeof price === 'string') {
    price = parseFloat(price);
  }

  if (isNaN(price)) {
    return 0;
  }

  return Math.round(price * 100) / 100;
}

//格式化金额
export function formatPrice(price = 0) {
  if (typeof price === 'string') {
    price = parseFloat(price);
  }

  if (isNaN(price)) {
    return 0;
  }

  if (parseInt(price) === price) {
    return price;
  }

  return price.toFixed(2);
}

//判断当前运行的浏览器环境
export function browser() {
  let os = {};
  let ua = window.navigator.userAgent.toLowerCase();

  os.isAndroid = /android/.test(ua); //browser,wechat,android
  os.isIOS = /iphone|ipad|ipod/.test(ua); //browser,wechat,ios
  os.isBrowser = /macintel|win32/.test(navigator.platform.toLowerCase()); //browser
  os.isWeixin = ua.indexOf('micromessenger') != -1; //wechat
  os.isAlipay = ua.indexOf('alipayclient') != -1; //ali
  os.isApp = function() {
    return (this.isAndroid || this.isIOS) && !this.isWeixin && !this.isBrowser && !this.isAlipay;
  };

  return os;
}

//格式化日期
Date.prototype.format = function(fmt) {
  let o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, String(this.getFullYear()).substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
    }
  }
  return fmt;
};

//格式化日期
export function formatDate(nS, format) {
  //日期格式化
  if (!nS) {
    return '';
  }
  format = format || 'yyyy-MM-dd hh:mm:ss';
  return new Date(nS).format(format);
}

//验证手机号码
export function checkPhone(phone) {
  return Boolean(/^1[3578]\d{9}$/.test(phone));
}

//验证密码
export function checkPassword(pwd) {
  return Boolean(/^[a-z0-9_-]{6,16}$/.test(pwd));
}

//验证验证吗
export function checkVerify(code) {
  return Boolean(/^\d{4}$/.test(code));
}

//去除字符串左右两边的空格
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

//类似于findIndex
Array.prototype.indexOfArr = function(obj) {
  let res = -1;

  this.filter(function(e, i) {
    let keys = '';

    for (let key in obj) {
      keys = key;
    }
    if (obj[keys] == e[keys]) {
      res = i;
    }
  });
  return res;
};

//重写findIndex(某些手机不支持findIndex)
Array.prototype.findIndex = function(func) {
  let result = -1;

  this.forEach((item, index) => {
    var flag = func(item);

    if (flag) {
      result = index;
    }
  });
  return result;
};

Array.prototype.max = function(prop) {
  let result;
  if (!this.length) {
    return null;
  }

  if (prop.length) {
    result = this[0];
    this.forEach(item => {
      if (item[prop] > result[prop]) {
        result = item;
      }
    });
  } else {
    result = this[0];
    this.forEach(item => {
      if (item > result) {
        result = item;
      }
    });
  }
  return result;
};

Array.prototype.min = function(prop) {
  let result;
  if (!this.length) {
    return null;
  }

  if (prop.length) {
    result = this[0];
    this.forEach(item => {
      if (item[prop] < result[prop]) {
        result = item;
      }
    });
  } else {
    result = this[0];
    this.forEach(item => {
      if (item < result) {
        result = item;
      }
    });
  }
  return result;
};

//拆分数组参数
export function spread(cb) {
  return res => {
    // cb(...res);
    cb.apply(null, res);
  };
}

//后台默认数据格式
export function jsonCallback(data) {
  return {
    data,
    errorCode: [],
    status: 10000000
  };
}

//时间对象
export function dateToObj(time){
  let date = new Date(time);
  return {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

//tabelTree格式化数据
export function treeToArray(data, expandAll, parent = null, level = null) {
  let tmp = [];
  Array.from(data).forEach(function(record) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandAll);
      // record._expanded = expandAll;
    }
    let _level = 1;
    if (level !== undefined && level !== null) {
      _level = level + 1;
    }
    Vue.set(record, '_level', _level);
    // record._level = _level;
    // 如果有父元素
    if (parent) {
      Vue.set(record, 'parent', parent);
      // record.parent = parent;
    }
    tmp.push(record);
    if (record.children && record.children.length > 0) {
      const children = treeToArray(record.children, expandAll, record, _level);
      tmp = tmp.concat(children);
    }
  });
  return tmp;
}
//设置cookie
export function setCookie(name, value, day) {
  if (day !== 0) {
    //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
    var expires = day * 24 * 60 * 60 * 1000;
    var date = new Date(+new Date() + expires);
    document.cookie = name + '=' + escape(value) + ';expires=' + date.toUTCString();
  } else {
    document.cookie = name + '=' + escape(value);
  }
}
//获取cookie
export function getCookie(name) {
  var arr;
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}

//删除cookie
export function delCookie(name) {
  setCookie(name, ' ', -1);
}

//数组去重
export function rep2(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr.indexOf(arr[i]) != i) {
      arr.splice(i, 1); //删除数组元素后数组长度减1后面的元素前移
      i--; //数组下标回退
    }
    if (arr.includes(null)) {
      // stivepeim add by el-tree sourceData employeeId is null
      arr.splice(1, 1);
      i--;
    }
  }
  return arr;
}

/**
 * 针对element的时间区间控件解析选择的时间左右侧值
 * @param date
 * @returns {{start: string, end: string}}
 */
export function expendsDataRangeByElDate(date) {
  let result = {
    start: '',
    end: ''
  };
  // if(date) {
  //     return result
  // }
  if (date.length !== 2) {
    return result;
  }
  result.start = date[0];
  result.end = date[1];
  return result;
}
export function compareDate(obj) {
  var begin = obj.begin;
  var over = obj.over;
  begin = begin.sort();
  over = over.sort();
  for (let i = 1; i < begin.length; i++) {
    if (begin[i] < over[i - 1]) {
      return false;
    }
  }
  return true;
}
// 计算数组中最长的数
export function maxArray(arr) {
  var num = arr[0];
  for (var i = 0; i < arr.length; i++) {
    if (num < arr[i]) {
      num = arr[i];
    }
  }
  return num;
}
//计算日期间隔
function getDay2(num) {
  var day1 = new Date().getTime();
  day1.setDate(day1.getDate() - num);
  var s1 = day1.getTime();
  return s1;
}
export function selectDays(startTime, endTime) {
  var nTime = endTime - startTime;
  var day = Math.floor(nTime / 86400000);
  if (startTime === getDay2(0) && startTime === endTime) {
    return 0;
  } else if (startTime === getDay2(1) && startTime === endTime) {
    return 1;
  } else {
    return day;
  }
}

// 日期快捷查询
export function getDay(num) {
  var day1 = new Date(new Date(new Date().toLocaleDateString()).getTime());
  day1.setDate(day1.getDate() - num);
  var s1 = day1.getTime();
  return s1;
}
export function getEndDay(num) {
  var day1 = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
  day1.setDate(day1.getDate() - num);
  var s1 = day1.getTime();
  return s1;
}

export function deisabledTime(time, day, rule) {
  if (rule) {
    return time - 1000 * 60 * 60 * 24 * day;
  } else {
    return time + 1000 * 60 * 60 * 24 * day;
  }
}
// export function labelWidth(name, tableName, num) {
//     let arr = [];
//     this[tableName].forEach(item => {
//         arr.push(item[name].toString().length);
//     })
//     if(name == 'firstLoanAmount') {
//         console.log(maxArray(arr));
//     }
//     return (num ? num : maxArray(arr)) * 8.5
// }

//字符串掩码处理
export function nameMask(name) {
  let length = name.length;
  switch (length) {
    case 1:
      return name;
    case 2:
      return name.substring(0, 1) + '*';
    default:
      return name.substring(0, 1) + '*' + name.substring(length - 1, length);
  }
}
