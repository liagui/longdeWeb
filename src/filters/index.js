import _constants from '@/utils/constants'

/**
 * 过滤空字符串
 * @param value
 * @returns {*}
 */
export function checkEmpty(value) {
    return _constants.emptyTextMap[value]
}

/**
 * 过滤人民币格式
 * @param m
 * @returns {string}
 */
export function money(val) {
    // val = val.toString().replace(/\$|\,/g, '');
    if (isNaN(val)) {
        val = "0";
    }
    let sign = (val == (val = Math.abs(val)));
    val = Math.floor(val * 100 + 0.50000000001);
    let cents = val % 100;
    val = Math.floor(val / 100).toString();
    if (cents < 10) {
        cents = "0" + cents
    }
    for (var i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
        val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
    }
    return (((sign) ? '' : '-') + val + '.' + cents);
}

export function toFixedNum(val) {
    return Number(val * 100).toFixed(0)

}

//格式化日期
export function formatDate(nS, format) {
    //日期格式化
    if (!nS) {
        return '';
    }
    format = format || 'yyyy-MM-dd hh:mm:ss';
    return new Date(nS).format(format);
}

export function dateFormat(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一 如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    // 拼接
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}