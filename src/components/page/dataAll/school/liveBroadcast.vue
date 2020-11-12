<template>
  <div>
    <!-- 弹出框 -->
    <el-dialog
      :title="transData.dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="transData.showDialog"
      width="770px"
      @close="handleClose"
    >
      <div>
        <div class="schoolHead">
          分校名称：<span class="showName">{{ transData.schoolName }}</span>
        </div>
        <div class="schoolHead">
          合同单价：<span class="showName" v-if="transData.type == 1"
            >{{ price.live_price }}元/人/月</span
          >
          <span class="showName" v-if="transData.type == 2"
            >{{ price.storage_price }}元/GB/月</span
          >
          <span class="showName" v-if="transData.type == 3"
            >{{ price.flow_price }}元/GB</span
          >
        </div>
        <el-form
          ref="formData"
          :model="formData"
          :rules="rule"
          style="width: 95%"
          label-width="80px"
        >
          <div v-if="transData.type == 1">
            <el-form-item label="直播并发：" prop="num">
              <el-input
                v-model="formData.num"
                type="number"
                placeholder="请输入直播并发数量"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="购买月份：" required>
              <el-col :span="11">
                <el-form-item prop="start_time">
                  <el-date-picker
                    v-model="formData.start_time"
                    class="apply"
                    style="width: 100% !important"
                    type="date"
                    placeholder="开始时间"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="startpickerOptions"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align: center">至</el-col>
              <el-col :span="11">
                <el-form-item prop="end_time">
                  <el-date-picker
                    v-model="formData.end_time"
                    class="apply"
                    style="width: 100% !important"
                    type="date"
                    placeholder="结束时间"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
          <div v-if="transData.type == 2">
            <el-form-item label="升级空间：" prop="num">
              <el-input
                v-model="formData.num"
                type="number"
                placeholder=""
              ></el-input
              ><span class="yuan">GB</span>
            </el-form-item>
            <el-form-item label="续费时长：" prop="month">
              <el-input
                v-model="formData.month"
                type="number"
                placeholder=""
              ></el-input
              ><span class="yuan">月</span>
            </el-form-item>
          </div>
          <div v-if="transData.type == 3">
            <el-form-item label="新增流量：" prop="num">
              <el-input
                v-model="formData.num"
                type="number"
                placeholder="请输入新增流量"
              >
              </el-input
              ><span class="yuan">GB</span>
            </el-form-item>
          </div>

          <el-form-item label="订单金额：" prop="money">
            <el-input v-model="formData.money" placeholder=""></el-input>
            <span class="yuan">元</span>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
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
import { numAndDecimals2, onlyNumber } from "@/utils/rules";
export default {
  props: ["transData"],
  data() {
    return {
      liveArr: [],
      formData: {
        schoolid: this.transData.schoolid,
        num: "",
        money: "",
        remark: "",
        start_time: "",
        end_time: "",
        month: "",
      },
      price: {},
      rule: {
        num: [{ validator: onlyNumber, trigger: "blur" }],
        money: [{ validator: numAndDecimals2, trigger: "blur" }],
      },
      startpickerOptions: {
        disabledDate: (time) => {
          if (this.formData.end_time) {
            return (
              time.getTime() > new Date(this.formData.end_time).getTime() ||
              time.getTime() < new Date().getTime()
            );
          } else {
            return time.getTime() < new Date().getTime() - 8.64e7;
          }
        },
      },
      pickerOptions: {
        disabledDate: (time) => {
          if (this.formData.start_time) {
            return (
              time.getTime() < new Date(this.formData.start_time).getTime() ||
              time.getTime() < new Date().getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        },
      },
    };
  },
  watch: {
    "formData.num": {
      handler(newVal, oldVal) {
        if (newVal) {
          if (this.transData.type == 1) {
            this.formData.money =
              Number(newVal) * Number(this.price.live_price);
          } else if (this.transData.type == 2) {
            this.formData.money =
              Number(newVal) * Number(this.price.storage_price);
          } else {
            this.formData.money =
              Number(newVal) * Number(this.price.flow_price);
          }
        }
      },
    },
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
      if (this.transData.type == 1) {
        let parm = {
          schoolid: this.transData.schoolid,
          num: this.formData.num,
          money: this.formData.money,
          remark: this.formData.remark,
          start_time: this.formData.start_time,
          end_time: this.formData.end_time,
        };
        this.request
          .http(this, "dashboard/purservice/live", parm)
          .then((res) => {
            if (res.code == 200) {
              this.$emit("handleSure");
            }
          });
      }
      if (this.transData.type == 2) {
        let parm = {
          schoolid: this.transData.schoolid,
          num: this.formData.num,
          month: this.formData.month,
          money: this.formData.money,
          remark: this.formData.remark,
        };
        this.request
          .http(this, "dashboard/purservice/storage", parm)
          .then((res) => {
            if (res.code == 200) {
              this.$emit("handleSure");
            }
          });
      }
      if (this.transData.type == 3) {
        let parm = {
          schoolid: this.transData.schoolid,
          num: this.formData.num,
          money: this.formData.money,
          remark: this.formData.remark,
        };
        this.request
          .http(this, "dashboard/purservice/flow", parm)
          .then((res) => {
            if (res.code == 200) {
              this.$emit("handleSure");
            }
          });
      }
    },
    initData() {
      this.request
        .http(this, "dashboard/purservice/getPrice", {
          schoolid: this.transData.schoolid,
        })
        .then((res) => {
          if (res.code == 200) {
            this.price = res.data;
          }
        });
    },
    handleClose(done) {
      this.$emit("handleClose");
    },
  },
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
.yuan {
  position: absolute;
  width: 30px;
}
</style>
