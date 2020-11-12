<template>
  <div class="pay-manage">
    <div class="content-head">
      <el-form :model="payment" ref="payment" :inline="true">
        <el-form-item>
          <el-input
            placeholder="网校名称"
            v-model="payment.search"
            prefix-icon="el-icon-search"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <div class="pay-list">
        <div v-for="(school, index) in payLists" :key="index" class="pay-item">
          <div class="title">
            <div class="name">{{ school.name }}</div>
            <!-- <el-button class="pay-btn" v-if="school.is_forbid" type="success"
              >开启</el-button
            > 
            <el-button class="pay-btn" v-else type="danger">关闭</el-button>-->
          </div>
          <div class="content">
            <div class="pay-type pay-zfb" @click="payInfo(school.id, 'zfb')">
              <div class="pay-state">
                <el-button
                  class="pay-btn-all"
                  v-if="school.zfb_pay_state == 1"
                  @click.stop="updateStateDialog('close', school.id, 'zfb')"
                  size="mini"
                  type="success"
                  >开启</el-button
                >
                <el-button
                  class="pay-btn-all"
                  size="mini"
                  @click.stop="updateStateDialog('open', school.id, 'zfb')"
                  v-else
                  type="danger"
                  >关闭</el-button
                >
              </div>
              <div class="img">
                <img src="../../../assets/image/zhifubao.png" alt />
              </div>
              <div class="name">支付宝</div>
            </div>
            <div class="pay-type pay-wx" @click="payInfo(school.id, 'wx')">
              <div class="pay-state">
                <el-button
                  class="pay-btn-all"
                  v-if="school.wx_pay_state == 1"
                  size="mini"
                  type="success"
                  @click.stop="updateStateDialog('close', school.id, 'wx')"
                  >开启</el-button
                >
                <el-button
                  class="pay-btn-all"
                  size="mini"
                  @click.stop="updateStateDialog('open', school.id, 'wx')"
                  v-else
                  type="danger"
                  >关闭</el-button
                >
              </div>
              <div class="img">
                <img src="../../../assets/image/weixin.png" alt />
              </div>
              <div class="name">微信</div>
            </div>
            <div class="pay-type pay-hj" @click="payInfo(school.id, 'hj')">
              <div class="pay-state">
                <el-button
                  class="pay-btn-all"
                  v-if="school.hj_state == 1"
                  size="mini"
                  type="success"
                  @click.stop="updateStateDialog('close', school.id, 'hj', 1)"
                  >开启</el-button
                >
                <el-button
                  class="pay-btn-all"
                  size="mini"
                  @click.stop="updateStateDialog('open', school.id, 'hj', -1)"
                  v-else
                  type="danger"
                  >关闭</el-button
                >
              </div>
              <div class="img">
                <img src="../../../assets/image/huiju.png" alt />
              </div>
              <div class="name">汇聚支付</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 30, 50]"
          :page-size="cur.pageSize"
          :total="totalCount"
          :current-page="cur.page"
          layout="total, sizes, prev, pager, next, jumper,slot"
        >
          <el-button class="pagingBtn" size="small">确认</el-button>
        </el-pagination>
      </div>
    </div>
    <el-dialog
      class="pay-dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="773px"
      :append-to-body="true"
      @close="payInfoClose()"
    >
      <div class="zfb-view" v-if="showZfbInfo">
        <el-form
          class="pay-form"
          ref="zfbForm"
          :model="zfbForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="APPID：" prop="zfb_app_id">
            <el-input
              v-model="zfbForm.zfb_app_id"
              :disabled="
                zfbForm.zfb_app_id != '' &&
                zfbForm.zfb_app_id == currentPayInfo.zfb_app_ids
              "
              clearable
            ></el-input>
            <el-button
              class="update-btn"
              @click="editBtn('zfbForm', 'zfb_app_id')"
              >修改</el-button
            >
          </el-form-item>
          <el-form-item label="应用公钥：" prop="zfb_app_public_key">
            <el-input
              v-model="zfbForm.zfb_app_public_key"
              :disabled="
                zfbForm.zfb_app_public_key != '' &&
                zfbForm.zfb_app_public_key == currentPayInfo.zfb_app_public_keys
              "
              clearable
            ></el-input>
            <el-button
              class="update-btn"
              @click="editBtn('zfbForm', 'zfb_app_public_key')"
              >修改</el-button
            >
          </el-form-item>
          <el-form-item label=" 支付宝公钥：" prop="zfb_public_key">
            <el-input
              v-model="zfbForm.zfb_public_key"
              :disabled="
                zfbForm.zfb_public_key != '' &&
                zfbForm.zfb_public_key == currentPayInfo.zfb_public_keys
              "
              clearable
            ></el-input>
            <el-button
              class="update-btn"
              @click="editBtn('zfbForm', 'zfb_public_key')"
              >修改</el-button
            >
          </el-form-item>
          <el-form-item label="备注：">
            <div>
              请登录
              <a
                class="target"
                href="https://open.alipay.com/platform/home.htm"
                target="_blank"
                >《支付宝开放平台》</a
              >
              查询以上所填写信息，查询路径为账号管理>>密钥管理>>开放平台密钥
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button class="clear-btn" @click="payInfoClose()">取 消</el-button>
          <el-button
            type="primary"
            class="sub-btn"
            @click="payInfoSub('zfbForm')"
            >保 存</el-button
          >
        </span>
      </div>
      <div class="wx-view" v-if="showWxInfo">
        <el-form
          class="pay-form"
          ref="wxForm"
          :model="wxForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="APPID：" prop="wx_app_id">
            <el-input
              v-model="wxForm.wx_app_id"
              :disabled="
                wxForm.wx_app_id != '' &&
                wxForm.wx_app_id == currentPayInfo.wx_app_ids
              "
              clearable
            ></el-input>
            <el-button
              class="update-btn"
              @click="editBtn('wxForm', 'wx_app_id')"
              >修改</el-button
            >
          </el-form-item>
          <el-form-item label="商户号：" prop="wx_commercial_tenant_number">
            <el-input
              v-model="wxForm.wx_commercial_tenant_number"
              :disabled="
                wxForm.wx_commercial_tenant_number != '' &&
                wxForm.wx_commercial_tenant_number ==
                  currentPayInfo.wx_commercial_tenant_numbers
              "
              clearable
            ></el-input>
            <el-button
              class="update-btn"
              @click="editBtn('wxForm', 'wx_commercial_tenant_number')"
              >修改</el-button
            >
          </el-form-item>
          <el-form-item label="API密钥：" prop="wx_api_key">
            <el-input
              v-model="wxForm.wx_api_key"
              :disabled="
                wxForm.wx_api_key != '' &&
                wxForm.wx_api_key == currentPayInfo.wx_api_keys
              "
              clearable
            ></el-input>
            <el-button
              class="update-btn"
              @click="editBtn('wxForm', 'wx_api_key')"
              >修改</el-button
            >
          </el-form-item>
          <el-form-item label="备注：">
            <div>
              请登录
              <a
                class="target"
                href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
                target="_blank"
                >《微信支付平台》</a
              >
              查询以上所填信息 拷贝
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button class="clear-btn" @click="payInfoClose()">取 消</el-button>
          <el-button
            type="primary"
            class="sub-btn"
            @click="payInfoSub('wxForm')"
            >保 存</el-button
          >
        </span>
      </div>
      <div class="hj-view" v-if="showHjInfo">
        <el-form
          class="pay-form"
          ref="hjForm"
          :model="hjForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="商户编号：" prop="hj_commercial_tenant_number">
            <el-input
              v-model="hjForm.hj_commercial_tenant_number"
              :disabled="
                hjForm.hj_commercial_tenant_number != '' &&
                hjForm.hj_commercial_tenant_number ==
                  currentPayInfo.hj_commercial_tenant_numbers
              "
              clearable
            ></el-input>
            <el-button
              class="update-btn"
              @click="editBtn('hjForm', 'hj_commercial_tenant_number')"
              >修改</el-button
            >
          </el-form-item>
          <el-form-item label="MD5密钥：" prop="hj_md_key">
            <el-input
              v-model="hjForm.hj_md_key"
              :disabled="
                hjForm.hj_md_key != '' &&
                hjForm.hj_md_key == currentPayInfo.hj_md_keys
              "
              clearable
            ></el-input>
            <el-button
              class="update-btn"
              @click="editBtn('hjForm', 'hj_md_key')"
              >修改</el-button
            >
          </el-form-item>
          <div class="pay-form-title">
            <div class="cut"></div>
            <div>支付宝设置</div>
          </div>
          <el-form-item
            label="交易商户号："
            prop="hj_zfb_commercial_tenant_deal_number"
          >
            <el-input
              v-model="hjForm.hj_zfb_commercial_tenant_deal_number"
              :disabled="
                hjForm.hj_zfb_commercial_tenant_deal_number != '' &&
                hjForm.hj_zfb_commercial_tenant_deal_number ==
                  currentPayInfo.hj_zfb_commercial_tenant_deal_numbers
              "
              clearable
            ></el-input>
            <el-button
              class="update-btn"
              @click="editBtn('hjForm', 'hj_zfb_commercial_tenant_deal_number')"
              >修改</el-button
            >
          </el-form-item>
          <el-form-item label="支付状态：" prop="hj_zfb_pay_state">
            <el-radio-group v-model="hjForm.hj_zfb_pay_state">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="-1">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="pay-form-title">
            <div class="cut"></div>
            <div>微信设置</div>
          </div>
          <el-form-item
            label="交易商户号："
            prop="hj_wx_commercial_tenant_deal_number"
          >
            <el-input
              v-model="hjForm.hj_wx_commercial_tenant_deal_number"
              :disabled="
                hjForm.hj_wx_commercial_tenant_deal_number != '' &&
                hjForm.hj_wx_commercial_tenant_deal_number ==
                  currentPayInfo.hj_wx_commercial_tenant_deal_numbers
              "
              clearable
            ></el-input>
            <el-button
              class="update-btn"
              @click="editBtn('hjForm', 'hj_wx_commercial_tenant_deal_number')"
              >修改</el-button
            >
          </el-form-item>
          <el-form-item label="支付状态：" prop="hj_wx_pay_state">
            <el-radio-group v-model="hjForm.hj_wx_pay_state">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="-1">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button class="clear-btn" @click="payInfoClose()">取 消</el-button>
          <el-button
            type="primary"
            class="sub-btn"
            @click="payInfoSub('hjForm')"
            >保 存</el-button
          >
        </span>
      </div>
    </el-dialog>
    <el-dialog
      :title="updateDialogTitle + '提示'"
      :close-on-click-modal="false"
      class="update-state"
      :visible.sync="updateDialogVisible"
      width="30%"
    >
      <img
        v-if="currentData.dialogState == 'open'"
        src="../../../assets/image/open.png"
        alt
      />
      <img
        v-if="currentData.dialogState == 'close'"
        src="../../../assets/image/close.png"
        alt
      />
      <span>您确认{{ updateDialogTitle }}吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button
          v-if="currentData.dialogState == 'open'"
          size="mini"
          type="success"
          @click="switchState()"
          >确 定</el-button
        >
        <el-button
          v-if="currentData.dialogState == 'close'"
          size="mini"
          type="danger"
          @click="switchState()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber } from "@/utils/rules";
import { payManageInfo } from "./mixins/payManageInfo";
export default {
  mixins: [payManageInfo],
  data() {
    return {
      payment: {
        search: "",
      },
      payLists: "",
      cur: {
        page: 1,
        pagesize: 10,
      },
      nextPage: 1,
      totalCount: 20,
      dialogVisible: false,
      updateDialogVisible: false,
      showZfbInfo: false,
      showWxInfo: false,
      showHjInfo: false,
      currentPayInfo: "",
      currentData: "",
      zfbForm: {
        zfb_app_id: "",
        zfb_app_public_key: "",
        zfb_public_key: "",
      },
      wxForm: {
        wx_app_id: "",
        wx_commercial_tenant_number: "",
        wx_api_key: "",
      },
      hjForm: {
        hj_commercial_tenant_number: "",
        hj_md_key: "",
        hj_wx_commercial_tenant_deal_number: "",
        hj_wx_pay_state: "",
        hj_zfb_commercial_tenant_deal_number: "",
        hj_zfb_pay_state: "",
      },
    };
  },
  computed: {
    dialogTitle() {
      if (this.showZfbInfo) {
        return "支付宝";
      }
      if (this.showWxInfo) {
        return "微信";
      }
      if (this.showHjInfo) {
        return "汇聚支付";
      }
    },
    updateDialogTitle() {
      if (this.currentData.dialogState == "open") {
        return "开启";
      }
      if (this.currentData.dialogState == "close") {
        return "关闭";
      }
    },
  },
  mounted() {
    this.getPayList();
  },
  methods: {
    getPayList() {
      _request
        .http(this, "payset/getList", this.payment, this.cur)
        .then((res) => {
          this.payLists = res.data.list;
          this.totalCount = res.data.total;
          this.nextPage = parseInt(res.data.page);
        });
    },
    getZfbById(id) {
      this.showZfbInfo = true;
      _request.http(this, "payset/getZfbById", { id }).then((res) => {
        this.currentPayInfo = res.data;
        this.currentPayInfo.id = id;
        this.zfbForm.zfb_app_id = res.data.zfb_app_ids;
        this.zfbForm.zfb_app_public_key = res.data.zfb_app_public_keys;
        this.zfbForm.zfb_public_key = res.data.zfb_public_keys;
      });
    },
    getWxById(id) {
      this.showWxInfo = true;
      _request.http(this, "payset/getWxById", { id }).then((res) => {
        this.currentPayInfo = res.data;
        this.currentPayInfo.id = id;
        this.wxForm.wx_api_key = res.data.wx_api_keys;
        this.wxForm.wx_app_id = res.data.wx_app_ids;
        this.wxForm.wx_commercial_tenant_number =
          res.data.wx_commercial_tenant_numbers;
      });
    },
    getHjById(id) {
      this.showHjInfo = true;
      _request.http(this, "payset/getHjById", { id }).then((res) => {
        this.currentPayInfo = res.data;
        this.currentPayInfo.id = id;
        this.hjForm.hj_commercial_tenant_number =
          res.data.hj_commercial_tenant_numbers;
        this.hjForm.hj_md_key = res.data.hj_md_keys;
        this.hjForm.hj_wx_commercial_tenant_deal_number =
          res.data.hj_wx_commercial_tenant_deal_numbers;
        this.hjForm.hj_wx_pay_state = res.data.hj_wx_pay_state;
        this.hjForm.hj_zfb_commercial_tenant_deal_number =
          res.data.hj_zfb_commercial_tenant_deal_numbers;
        this.hjForm.hj_zfb_pay_state = res.data.hj_zfb_pay_state;
      });
    },
    doZfbUpdate() {
      let params = {
        id: this.currentPayInfo.id,
        app_id: this.zfbForm.zfb_app_id,
        app_public_key: this.zfbForm.zfb_app_public_key,
        public_key: this.zfbForm.zfb_public_key,
      };
      _request.http(this, "payset/doZfbUpdate", params).then((res) => {
        if (res.code == 200) {
          this.getPayList();
          this.payInfoClose();
          this.$toast(res.msg);
        } else {
          this.$toast("保存未成功，请重试");
        }
      });
    },
    doWxUpdate() {
      let params = {
        id: this.currentPayInfo.id,
        app_id: this.wxForm.wx_app_id,
        shop_number: this.wxForm.wx_commercial_tenant_number,
        api_key: this.wxForm.wx_api_key,
      };
      _request.http(this, "payset/doWxUpdate", params).then((res) => {
        if (res.code == 200) {
          this.getPayList();
          this.payInfoClose();
          this.$toast(res.msg);
        } else {
          this.$toast("保存未成功，请重试");
        }
      });
    },
    doHjUpdate() {
      let params = {
        id: this.currentPayInfo.id,
        shop_number: this.hjForm.hj_commercial_tenant_number,
        md_key: this.hjForm.hj_md_key,
        wx_deal_shop_number: this.hjForm.hj_wx_commercial_tenant_deal_number,
        wx_state: this.hjForm.hj_wx_pay_state,
        zfb_deal_shop_number: this.hjForm.hj_zfb_commercial_tenant_deal_number,
        zfb_state: this.hjForm.hj_zfb_pay_state,
      };
      _request.http(this, "payset/doHjUpdate", params).then((res) => {
        if (res.code == 200) {
          this.getPayList();
          this.payInfoClose();
          this.$toast(res.msg);
        } else {
          this.$toast("保存未成功，请重试");
        }
      });
    },
    doUpdateZfbState() {
      _request
        .http(this, "payset/doUpdateZfbState", { id: this.currentData.id })
        .then((res) => {
          this.getPayList();
          this.updateDialogVisible = false;
        });
    },
    doUpdateWxState() {
      _request
        .http(this, "payset/doUpdateWxState", { id: this.currentData.id })
        .then((res) => {
          this.getPayList();
          this.updateDialogVisible = false;
        });
    },
    doUpdateHjState() {
      _request
        .http(this, "payset/doUpdateHjState", {
          id: this.currentData.id,
          hj_state: this.currentData.payState,
        })
        .then((res) => {
          this.getPayList();
          this.updateDialogVisible = false;
        });
    },
    //每页
    handleSizeChange(val) {
      this.cur.pageSize = val;
      this.getPayList();
    },
    //第几页
    handleCurrentChange(val) {
      this.cur.page = val;
      this.getPayList();
    },
    updateStateDialog(dialogState, id, payType, payState) {
      this.currentData = { dialogState, id, payType, payState };
      this.updateDialogVisible = true;
    },
    switchState() {
      switch (this.currentData.payType) {
        case "zfb":
          this.doUpdateZfbState();
          break;
        case "wx":
          this.doUpdateWxState();
          break;
        case "hj":
          this.doUpdateHjState();
          break;
      }
    },
    payInfo(id, payType) {
      this.dialogVisible = true;
      switch (payType) {
        case "zfb":
          this.getZfbById(id);
          break;
        case "wx":
          this.getWxById(id);
          break;
        case "hj":
          this.getHjById(id);
          break;
      }
    },
    editBtn(key1, key2) {
      this[key1][key2] = this.currentPayInfo[key2];
    },
    payInfoClose() {
      this.dialogVisible = false;
      this.showZfbInfo = false;
      this.showWxInfo = false;
      this.showHjInfo = false;
    },
    subData(payType) {
      for (var prop in this[payType]) {
        if (this[payType][prop] == this.currentPayInfo[prop + "s"]) {
          this[payType][prop] = this.currentPayInfo[prop];
        }
      }
    },
    payInfoSub(payType) {
      this.$refs[payType].validate((valid) => {
        if (valid) {
          this.subData(payType);
          console.log("提交的数据", payType, this[payType]);
          switch (payType) {
            case "zfbForm":
              this.doZfbUpdate();
              break;
            case "wxForm":
              this.doWxUpdate();
              break;
            case "hjForm":
              this.doHjUpdate();
              break;
          }
        } else {
          return false;
        }
      });
    },
    search() {
      this.getPayList();
    },
  },
};
</script>
<style lang="less">
.pay-dialog {
  .el-radio-group {
    display: flex;
    align-items: center;
    .el-radio {
      margin-bottom: 0;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    margin: 40px 0;
  }
  .el-form-item {
    .el-form-item__content {
      display: flex;
      height: 32px;
    }
  }
}
</style>
<style lang="less" scoped>
.update-btn {
  width: 120px;
  margin-left: 30px;
}
.pay-form {
  padding: 28px 0;
  // border-top: solid 1px #eaeaea;
  border-bottom: solid 1px #eaeaea;
  .pay-form-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #333333;

    .cut {
      margin-right: 10px;
      width: 4px;
      height: 15px;
      background: #26a4fd;
    }
  }
}
.content-head {
  display: flex;
  flex-direction: row-reverse;
}
.content-main {
  .pay-list {
    .pay-item {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
      border-radius: 6px;
      margin: 0 25px 20px;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        border-bottom: solid 1px #f2f2f2;
        padding: 30px;
        .name {
          font-size: 20px;
          font-weight: bold;
        }
      }
      .content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 30px 40px;
        width: 100%;
        .pay-type {
          width: 200px;
          height: 240px;
          padding: 10px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 2px 7px 1px rgba(184, 200, 212, 0.46);
          border-radius: 5px;
          text-align: center;
          .pay-state {
            display: flex;
            flex-direction: row-reverse;
          }
          .img {
            margin: 30px 0 20px;
            img {
              width: 104px;
              height: 102px;
            }
          }
        }
      }
    }
  }
}
</style>
