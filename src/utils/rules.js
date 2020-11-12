// 匹配完整域名
export function checkDns(rule, value, callback) {
  let reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('不可输入非法字符'));
    }
  }, 100);
}
// 需求  常规匹配
export function checkUsername(rule, value, callback) {
  let reg = /^[a-zA-Z0-9-\.&#?、@!^%+=*&$_/\u4e00-\u9fa5\s]{1,30}$/; //匹配所有非特殊字符，且长度在0和30之间;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('不可输入非法字符'));
    }
  }, 100);
}
// 只能输入汉字或数字
export function checkNumberAndChinese(rule, value, callback) {
  let reg = /^[0-9-\u4e00-\u9fa5\s]{1,20}$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('只能输入1-20位汉字或数字'));
    }
  }, 100);
}
// 不能输入汉字
export function checkChinese(rule, value, callback) {
  let reg = /([\u4E00-\u9FA5])/g;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {    
      callback(new Error('只能包含字母数字和符号'));
    } else if (value.length < 8) {
      callback(new Error('密码长度至少是8位'));
    }else {
      callback();
    }
  }, 100);
}
// 文件夹匹配
export function checkFolder(rule, value, callback) {
  let reg = /^[^\^/:*?"<>|]+$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('不可输入 /:*?"<>|'));
    }
  }, 100);
}

export function checkPhone(rule, value, callback) {
  const phoneReg = /^1[0-9]{10}$/;
  if (!value) {
    // return callback(new Error('电话号码不能为空'));
    callback();
  }
  setTimeout(() => {
    if (!Number.isInteger(+value)) {
      callback(new Error('请输入数字值'));
    } else {
      if (phoneReg.test(value)) {
        callback();
      } else {
        callback(new Error('电话号码格式不正确'));
      }
    }
  }, 100);
}

export function checkPhoneCou(rule, value, callback) {
  const phoneReg = /^1[0-9]{10}$/;
  if (!value) {
    // return callback(new Error('电话号码不能为空'));
    callback();
  }
  setTimeout(() => {
    if (!Number.isInteger(+value)) {
      callback(new Error('请输入数字值'));
    } else {
      if (phoneReg.test(value)) {
        callback();
      } else {
        callback(new Error('请输入1开头的11位数字'));
      }
    }
  }, 100);
}

/* 渠道管理密码验证（只针对渠道管理，密码可为空） */
export function checkWorkNumber(rule, value, callback) {
  let reg = /^[A-Za-z0-9]+$/;
  setTimeout(() => {
    if (value == '') {
      callback();
    } else {
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error('工号格式不正确'));
      }
    }
  }, 100);
}
// 匹配所有特殊字符
export function checkSpecial(rule, value, callback) {
  let reg = /[`~!@#$%^&()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (!reg.test(value)) {
      callback();
    } else {
      callback(new Error('不可输入非法字符'));
    }
  }, 100);
}

//匹配所有非特殊字符，且长度在1和30之间;
export function checkCharacters(rule, value, callback) {
  let reg = /^[\u4E00-\u9FA5A-Za-z0-9·_-]{1,30}$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else if (value.length > 30) {
      callback(new Error('输入长度范围是1～30'));
    } else {
      callback(new Error('不可输入特殊字符'));
    }
  }, 100);
}
//输入大小写英文  、数字和_   *   -
export function checkEnACharac(rule, value, callback) {
  let reg = /^[a-zA-Z0-9-\-*_/\s]{0,15}$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('不可输入特殊字符'));
    }
  }, 100);
}
// 中英文数字和- _
export function checkEnACharac2(rule, value, callback) {
  let reg = /^[a-zA-Z0-9-_\u4e00-\u9fa5]+$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('不可输入特殊字符'));
    }
  }, 100);
}
// 中英文数字和-
export function checkEnACharac3(rule, value, callback) {
  let reg = /^[a-zA-Z0-9,，\u4e00-\u9fa5]+$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('不可输入特殊字符'));
    }
  }, 100);
}
// 中英文数字和- _ ?!，。《》<>:：% /、
export function checkEnACharac4(rule, value, callback) {
  let reg = /^[a-zA-Z0-9-_？！， 。?!《》<>:：%\\、\u4e00-\u9fa5]+$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('不可输入特殊字符'));
    }
  }, 100);
}
// 除- _的特殊字符
export function checkSpecial2(rule, value, callback) {
  let reg = /[`~!@#$%^&()\+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&（）——\+={}|《》？：“”【】、；‘’，。、]/im;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (!reg.test(value)) {
      callback();
    } else {
      callback(new Error('请勿输入非法字符'));
    }
  }, 100);
}
// 除- _ @ .的特殊字符
export function checkSpecial3(rule, value, callback) {
  let reg = /[`~!#$%^&()\+=<>?:"{}|,\/;'\\[\]~！#￥%……&（）——\+={}|《》？：“”【】、；‘’，。、]/im;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (!reg.test(value)) {
      callback();
    } else {
      callback(new Error('请勿输入非法字符'));
    }
  }, 100);
}

//大小写英文和数字
export function benAndNumber(rule, value, callback) {
  let reg = /^[a-zA-Z0-9-\-*_/]*$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('不可输入特殊字符'));
    }
  }, 100);
}
// 匹配邮箱
export function emailRule(rule, value, callback) {
  let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请正确输入邮箱地址'));
    }
  }, 100);
}
// 匹配qq邮箱
export function qqemailRule(rule, value, callback) {
  let reg = /\d{5,12}@qq\.com/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请正确输入QQ邮箱地址'));
    }
  }, 100);
}
//匹配所有非负整数

export function rightNumber(rule, value, callback) {
  let reg = /^([1-9][0-9]*)$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正整数'));
    }
  }, 100);
}
//匹配1~5位的数字
export function priceLen5(rule, value, callback) {
  let reg = /^[1-9][0-9]{0,4}$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入1-99999的整数'));
    }
  }, 100);
}

export function rightNumber1(rule, value, callback) {
  console.log(!value);
  let reg = /^([1-9][0-9]{0,2})$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入1-999的数字'));
    }
  }, 100);
}
export function rightNumber2(rule, value, callback) {
  let reg = /^([1-9][0-9]*)$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入1-3位正整数'));
    }
  }, 100);
}
export function rightNumber3(rule, value, callback) {
  let reg = /^([0-9]*)$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('输入大于等于0的整数'));
    }
  }, 100);
}

export function rightNumber4(rule, value, callback) {
  let reg = /^([1-9][0-9]*)$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入1-2位正整数'));
    }
  }, 100);
}
export function LoginPassword(rule, value, callback) {
  let reg = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}/g;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入大小写字母数字和字符'));
    }
  }, 100);
}


//匹配所有不是汉字的
export function checkUrl(rule, value, callback) {
  let reg = /([\u4E00-\u9FA5])/g;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (!reg.test(value)) {
      callback();
    } else {
      callback(new Error('不可以输入汉字'));
    }
  }, 100);
}

//匹配链接
export function checkLink(rule, value, callback) {
  let reg = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('地址格式不正确'));
    }
  }, 100);
}
//匹配数字和百分比
export function yearRate(rule, value, callback) {
  let reg = /^[0-9\./]{0,10}$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入非负数'));
    }
  }, 100);
}
//匹配1~10位的数字
export function price(rule, value, callback) {
  let reg = /^[0-9]{0,10}$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入非负整数'));
    }
  }, 100);
}
//输入大写英文
export function bigLetter(rule, value, callback) {
  let reg = /[A-Z]/g;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('密码必须包含大写英文，请重新输入！'));
    }
  }, 100);
}
//输入小写英文
export function littleLetter(rule, value, callback) {
  let reg = /[a-z]/g;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('密码必须包含小写英文，请重新输入！'));
    }
  }, 100);
}
//输入数字
export function onlyNumber(rule, value, callback) {
  let reg = /[0-9]/g;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('密码必须包含数字，请重新输入！'));
    }
  }, 100);
}
//只能输入数字
export function onlyInputNumber(rule, value, callback) {
  let reg = /[0-9]/g
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入数字'));
    }
  }, 100);
}
//输入整数和小数(不包含0)
export function numAndDecimals(rule, value, callback) {
  let reg = /^[1-9]+\d*(\.\d{1,2,3})?$|^0?\.\d{1,2}$/;
  // let reg = /^\d+(\.\d{0,2})?$/
  // /^\d+[\d\.]*\d+$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('只能输入整数或两位以内小数'));
    }
  }, 100);
}
//输入整数和小数(包含0)
export function numAndDecimals2(rule, value, callback) {
  let reg = /^[0-9]+\d*(\.\d{1,2})?$|^0?\.\d{1,2}$/;  
  console.log(value)
  if (value.toString().indexOf('.') == -1 && value.length > 1) {
    if (value.toString().indexOf('0') == 0) {
      callback(new Error('只能输入整数或两位以内小数'));
    }

  }
  if (!value) {
    callback();
  }
  setTimeout(() => {
    // if (value.split('.')[0].length > 3) {
    //   callback(new Error('只能输入小于1000的正数'));
    // }
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('只能输入整数或两位以内小数'));
    }
  }, 100);
}

//匹配所有非负整数 & 整百倍数
export function numberHundred(rule, value, callback) {
  let reg = /^([1-9][0-9]*)$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value) && value % 100 == 0) {
      callback();
    } else {
      callback(new Error('请输入整百倍数'));
    }
  }, 100);
}

export function integerJudgment(rule, value, callback) {
  let reg = /^([1-9][0-9]*)$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value) && value % 100 == 0) {
      callback();
    } else {
      callback(new Error('请输入100-9900整百的倍数'));
    }
  }, 100);
}
export function maxNumTen(rule, value, callback) {
  let reg = /^(\d(\.\d)?|10)$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入0-10的整数'));
    }
  }, 100);
}
export function maxOneHundred(rule, value, callback) {
  let reg = /^([1-9][0-9]{0,1}|100)$/;
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入1-100的整数'));
    }
  }, 100);
}

export function initNumberProduct(rule, value, callback) {
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (Number(value) >= 0.01) {
      callback();
    } else {
      callback(new Error('请输入整数或两位以内小数'));
    }
  }, 100);
}