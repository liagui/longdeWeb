 export const payManageInfo = {
  data() {
    return {
      rules: {
        zfb_app_id: [{
          required: true,
          message: '请输入APPID',
          trigger: 'blur'
        }],
        zfb_app_public_key: [{
          required: true,
          message: '请输入应用公钥',
          trigger: 'blur'
        }],
        zfb_public_key: [{
          required: true,
          message: '请输入支付宝公钥',
          trigger: 'blur'
        }],
        wx_app_id: [{
          required: true,
          message: '请输入APPID',
          trigger: 'blur'
        }],
        wx_commercial_tenant_number: [{
          required: true,
          message: '请输入商户号',
          trigger: 'blur'
        }],
        wx_api_key: [{
          required: true,
          message: '请输入API密钥',
          trigger: 'blur'
        }],
        hj_commercial_tenant_number: [{
          required: true,
          message: '请输入商户编号',
          trigger: 'blur'
        }],
        hj_md_key: [{
          required: true,
          message: '请输入MD5密钥',
          trigger: 'blur'
        }],
        hj_zfb_commercial_tenant_deal_number: [{
          required: true,
          message: '请输入支付宝交易商户号',
          trigger: 'blur'
        }],
        hj_zfb_pay_state: [{
          required: true,
          message: '请选择支付状态',
          trigger: 'blur'
        }],
        hj_wx_commercial_tenant_deal_number: [{
          required: true,
          message: '请输入微信交易商户号',
          trigger: 'blur'
        }],
        hj_wx_pay_state: [{
          required: true,
          message: '请选择支付状态',
          trigger: 'blur'
        }]
      },
    }
  }
}