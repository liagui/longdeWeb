// http 辅助工具类
import axios from 'axios';
import global from '@/store/global';
import Qs from 'qs'
import store from '@/store';
import {
    Loading
} from 'element-ui';
import CryptoJS from 'Crypto-js';
import JsEncrypt from 'jsencrypt/bin/jsencrypt';
import JSrsasign from 'jsrsasign';
/**
 * 网络请求
 * @param url
 * @param data
 * @param cur
 * @returns {Promise<any>}
 */

let lodingUrl = ['magicScoreAndMultipoint/get'];
let loadingInstance;

function http(_self, url, data, cur) {
    // if (lodingUrl.indexOf(url) >= 0) {
    //     loadingInstance = Loading.service({
    //         fullscreen: true,
    //         text: '正在执行,请稍后...',
    //         background: 'rgba(0, 0, 0, 0.5)',
    //         spinner: 'el-icon-loading'
    //     });
    // }    
    return new Promise((resolve, reject) => {
        var token = {};
        if (url == 'login') {
            token = {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        } else {
            token = {
                'Authorization': 'Bearer ' + store.state.token,
                'Content-Type': 'application/x-www-form-urlencoded',
                'CurAdminId': store.state.cur_admin_id
            }
        }
        //    'Authorization': 'Bearer ' + store.state.token,
        axios.post(global.ajaxurl + url, Qs.stringify({
            ...initPostData(data),
            ...initPostData(cur)
        }), {
            headers: token,
            // withCredentials: true
        })
            .then(res => {
                // debugger

                resolve(res.data);
                if (loadingInstance) {
                    loadingInstance.close();
                }
                if (res.data.code != 200) {
                    setTimeout(() => {
                        _self.$message.closeAll();
                        _self.$message({
                            message: res.data.msg,
                            type: 'error',
                            duration: 1000
                        });
                    })
                }
            })
            .catch((err) => {
                if (err.response) {
                    if (err.response.status == 401) {
                        _self.$alert('登录失效', '消息提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                _self.$router.push("/login");
                            }
                        });

                    }
                }

            })


    })

}

function postImg(url, imgFile) {
    var formData = new FormData();

    formData.append("file", imgFile);
    return new Promise((resolve, reject) => {
        axios.post(global.ajaxurl + url, formData, {
            headers: {
                'Authorization': 'Bearer ' + store.state.token,
            },
        }).then(res => {
            if (res.data.code == 200) {
                resolve(res.data);
            } else {
                console.log('else' + JSON.stringify(res))
                reject(res.data.msg);
                this.$message({
                    type: "info",
                    message: res.data.msg
                });
            }

        });
    });
}
/**
 * 去除空参数
 * @param obj
 */
function initPostData(obj) {
    let postData = {};
    if (undefined === obj) {
        return postData;
    }
    Object.keys(obj).forEach(item => {
        if (obj[item] !== '') {
            postData[item] = obj[item];
        }
        if (Object.prototype.toString.call(obj[item]) == '[object Array]') {

            // }
            // if (obj[item].constructor.name == 'Array') {
            postData[item] = JSON.stringify(obj[item]);
        }
    });
    return postData;
}

// var RSAencrypt = jsencrypt.RSAencrypt(JSON.stringify(arr));
// console.log(RSAencrypt)
// var RSAdencrypt = jsencrypt.RSAdencrypt(RSAencrypt);
// console.log(RSAdencrypt)

// var getKey = generatekey(16) || 'abcdsxyzhkj12345';

// var RSAkey = RSAencrypt(getKey);


let privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQChMx+AdLgn/mvU2uTMvV7L2b/VraaEab3ABvhf8qALEmPg+sPu
LmYxjFt9N7jz0IbXzZq0d5WVTaGXhqnWrigGCxGi9losvIcQ33mms+9GgYbTasFo
NbM3BhjDgqdXVTsU08sfIBNJ+PkfPuwcj+UEUA+MziLaGyxa1IQ456HhDQIDAQAB
AoGBAJzB7Ulqt8bUqCHm94aORQgxaVautnafqZF6dcBAXhhGOvCGi1AsuN5IIpQD
Qw1+ZBKp8165x7HYO2Lx5mlJFMs4W6iM/nXbR2j/WfihsDWxhAmvUevbZ6wz22+b
g9/QMO9sUVM0+W0WymMlKzaj7HX4kiL8ynn5JlkTsoiTZZT1AkEA0eU5Hmdaybg9
aGe/c7BCtrNsNpDPkzfbGzNF2mDYk91qWKMod4F90oynOkn5ZykaC71e6lr5K6cy
xwS1w/TI5wJBAMSbqEqaNVCucNj6QpBqboi2hmO3FK3DXw14oaYXnu0hfpyW8qkU
xY65ZHQh72zU9O+DGkeWH1n5a5OMDUe/Q+sCQHsOsAFCSTkQ2nfWs6lJAqQI533K
QtimG8CDvAV/WBrA6nOTHMuL0M/bhMOo0R8JOur9GKO/uGw+d4e1HDgJ0KsCQEWG
IbnX1DimpwMjZDx7VoEDwnwqdqaHquoxmUAJpEqIiKRJAKBn1wCEcJBcm7TpjX/Q
5Y8g+A8yEyeG4/9WFGcCQQCJSc17ORFF/70FLrQ+u9k5Qx+boH/Go/1sl/ywDu9I
ASEr/L8MpfsLiubluFvN8A2+TezECAfwc9A5MQx0OBPv
-----END RSA PRIVATE KEY-----`;
let publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChMx+AdLgn/mvU2uTMvV7L2b/V
raaEab3ABvhf8qALEmPg+sPuLmYxjFt9N7jz0IbXzZq0d5WVTaGXhqnWrigGCxGi
9losvIcQ33mms+9GgYbTasFoNbM3BhjDgqdXVTsU08sfIBNJ+PkfPuwcj+UEUA+M
ziLaGyxa1IQ456HhDQIDAQAB
-----END PUBLIC KEY-----`;
// JsEncrypt加密
function RSAencrypt(obj) {
    let encrypt = new JsEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(obj)
}
// JsEncrypt解密
function RSAdencrypt(obj) {
    let encrypt = new JsEncrypt();
    encrypt.setPrivateKey(privateKey);
    return encrypt.decrypt(obj)
}
// 生成数字签名
function getsign(str) {
    let rsa = new JSrsasign.RSAKey();
    rsa = JSrsasign.KEYUTIL.getKey(privateKey);
    let sig = new JSrsasign.KJUR.crypto.Signature({
        "alg": 'SHA1withRSA',
        "prov": "cryptojs/jsrsa"
    });
    sig.init(rsa);
    sig.updateString(str);
    let sign = JSrsasign.hextob64(sig.sign());
    return sign;
}
//随机生成指定数量的16进制key
function generatekey(num) {
    let library = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (var i = 0; i < num; i++) {
        let randomPoz = Math.floor(Math.random() * library.length);
        key += library.substring(randomPoz, randomPoz + 1);
    }
    return key;
}

//CryptoJS加密
function AESencrypt(word, keyStr) {
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv = CryptoJS.enc.Utf8.parse('sciCuBC7orQtDhTO');
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}


//CryptoJS解密
function AESdencrypt(word, keyStr) {
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv = CryptoJS.enc.Utf8.parse('sciCuBC7orQtDhTO');
    var decrypt = CryptoJS.AES.decrypt(word, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}


export default {
    initPostData,
    http,
    postImg
}