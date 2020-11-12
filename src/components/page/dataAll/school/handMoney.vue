<template>
  <div>
    <!-- 弹出框 -->
    <el-dialog
      title="手动充值"
      :close-on-click-modal="false"
      :visible.sync="transData.showDialog"
      width="770px"
      @close="handleClose"
    >
      <div>
        <div class="schoolHead">
          分校名称：<span class="showName">{{ transData.schoolName }}</span>
        </div>
        <el-form
          ref="formData"
          :model="formData"
          :rules="rule"
          style="width:95%"
          label-width="80px"
        >
          <el-form-item label="线下充值：" prop="money">
            <el-input v-model="formData.money" placeholder="请输入充值金额">            
            </el-input> <span class="yuan">元</span>
          </el-form-item>
          <el-form-item label="赠送金额：" prop="give_money">
            <el-input
              v-model="formData.give_money"
              placeholder="请输入赠送金额"
            ></el-input> <span class="yuan">元</span>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="formData.remark"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="markSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { numAndDecimals2 } from "@/utils/rules";
export default {
  props: ["transData"],
  data() {
    return {
      liveArr: [],
      formData: {
        schoolid: this.transData.schoolid,
        money: "",
        give_money: "",
        remark: "",
      },
      rule: {
        money: [{ validator: numAndDecimals2, trigger: "blur" }],
        give_money: [{ validator: numAndDecimals2, trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    selLive(index, checked, liveid) {
      console.log(index, checked);
      this.liveArr[index]["checked"] = !checked;
      this.formData.liveid = liveid;
    },
    markSure() {
      if (this.formData.money == '' && this.formData.give_money == '') {
        this.$toast("线下充值和赠送金额不能全为空");
        return;
      }
      this.request
        .http(this, "dashboard/account/recharge", this.formData)
        .then((res) => {
          if (res.code == 200) {
            this.$emit("handleSure");
          }
        });
    },
    initData() {
      this.request.http(this, "dashboard/liveService/index").then((res) => {
        if (res.code == 200) {
          for (var item of res.data.list) {
            item.checked = false;
          }
          this.liveArr = res.data.list;
        }
      });
    },
    handleClose(done) {
      this.$emit("handleClose");
    },
  },
  watch: {},
};
</script>
<style scoped lang='less'>
.schoolHead {
  margin-left: 9px;
  margin-bottom: 20px;
  font-size: 15px;
  color: #333333;
  .showName {
    font-size: 15px;
    font-weight: bold;
    color: #333333;
  }
}
.yuan{
  position: absolute;
}
</style>
