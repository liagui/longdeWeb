<template>
  <div>
    <el-dialog
      :title="transData.dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      width="60%"
      @close="dialogClose"
      center
    >
      <div class="dialogStyle">
        <div class="titleMess">订单信息</div>
        <el-row>
          <el-col class="lineHeight" :span="12">
            网校名称：<span class="contMess">{{ dataList.school_name }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="lineHeight" :span="12">
            订单编号：<span class="contMess">{{ dataList.oid }}</span>
          </el-col>
          <el-col class="lineHeight" :span="12">
            支付方式：<span class="contMess">{{ dataList.paytype_text }}</span>
          </el-col>
          <el-col class="lineHeight" :span="12">
            订单类型：<span class="contMess">{{ dataList.type_text }}</span>
          </el-col>
          <el-col class="lineHeight" :span="12">
            订单时间：<span class="contMess">{{ dataList.apply_time }}</span>
          </el-col>
        </el-row>
        <div v-if="dataList.content && dataList.content.length">
          <div class="titleMess">购买信息</div>
          <el-row
            v-for="(subitem, subindex) in dataList.content"
            :key="subindex"
            class="subCont"
          >
            <el-col class="lineHeight" :span="12">
              购买服务：<span class="contMess">{{ subitem.title }}</span>
            </el-col>
            <el-col class="lineHeight" :span="12">
              单价：<span class="contMess">{{ subitem.price }}</span>
            </el-col>
            <el-col class="lineHeight" :span="12">
              购买总量：<span class="contMess">{{ subitem.num }}</span>
            </el-col>
            <el-col class="lineHeight" :span="12">
              订单金额：<span class="contMess">{{ subitem.money }}</span>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col class="lineHeight" :span="24">
            备注信息：<span class="contMess">{{ dataList.remark }}</span>
          </el-col>
        </el-row>
        <el-form
          :model="formData"
          :rules="formRule"
          ref="formData"
          :inline="true"
          label-position="left"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="订单审核：">
                <el-select
                  v-model="formData.status"
                  :disabled="transData.status != 1"
                  style="width: 480px"
                >
                  <el-option
                    v-for="(item, index) in shenheArr"
                    :label="item.label"
                    :value="item.value"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="驳回原因：" v-if="formData.status == 3">
                <el-input
                  v-model="formData.remark"
                  :disabled="transData.status != 1"
                  type="textarea"
                  :rows="3"
                  style="width: 480px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="clear-btn" @click="dialogClose">取 消</el-button>
        <el-button class="sub-btn" type="primary" @click="dialogMarksure"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _request from "@/utils/request";
export default {
  props: ["showDialog", "transData"],
  data() {
    return {
      dataList: {
        content: [],
      },
      formData: {
        id: this.transData.id,
        remark: "",
        status: "2",
      },
      formRule: {
        name: [
          { required: true, message: "请输入课程单元名称", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "请输入课程单元介绍", trigger: "blur" },
        ],
        parent_id: [
          { required: true, message: "请选择所属学科", trigger: "change" },
        ],
      },
      shenheArr: [
        { label: "通过", value: 2 },
        { label: "驳回", value: 3 },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initData();
    });
    this.formData.status =                                                         
      this.transData.status == 1 ? 2 : this.transData.status;
  },
  methods: {
    initData() {
      _request
        .http(this, "dashboard/offlineOrder/detail", { id: this.transData.id })
        .then((res) => {
          if (res.code == 200) {
            var cont = res.data.content;
            this.dataList = res.data;
            if (this.transData.status == 3) {
              this.formData.remark = res.data.admin_remark;
            }
          } else {
            alert(res.msg);
          }
        });
    },
    DisableItem(id, forbit) {
      var text = forbit == 2 ? "启用" : "禁用";
      console.log(id);
      this.$confirm(text + "该直播课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request.http(this, "updateLiveStatus", { id: id }).then((res) => {
            if (res.code == 200) {
              this.initData();
            } else {
              alert(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    dialogClose() {
      this.$emit("dialogClose");
    },
    dialogMarksure() {
      if (this.transData.status == 1) {
        _request
          .http(this, "dashboard/offlineOrder/operate", this.formData)
          .then((res) => {
            if (res.code == 200) {
              this.$emit("dialogSure");
            }
          });
      } else {
        this.$emit("dialogClose");
      }
      // this.$refs.addData.validate((valid) => {
      //   if (valid) {
      //     if (this.addData.id) {
      //       // 修改
      //       _request.http(this, "updateLive", this.addData).then((res) => {
      //         if (res.code == 200) {
      //           this.showDialog = false;
      //           this.initData();
      //         }
      //       });
      //     } else {
      //       _request.http(this, "live/add", this.addData).then((res) => {
      //         if (res.code == 200) {
      //           this.showDialog = false;
      //           this.addData.id = "";
      //           this.initData();
      //         }
      //       });
      //     }
      //   }
      // });
    },
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", (data) => {
        this.showList = data;
        this.showDetail = false;
      });
    },
    "searchData.name": {
      handler(newVal, oldVal) {
        let timeout;
        if (this.load) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          this.initData();
          this.load = false;
        }, 500);
      },
    },
  },
};
</script>

<style scoped lang="less">
.listItem {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 30px 30px;

  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  margin-bottom: 20px;
  .item-cont {
    flex: 1;
  }

  .item-btn {
    width: 200px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border-left: 1px solid #d6d6d6;
  }
  .col-height {
    height: 15px;
    line-height: 15px;
    margin: 10px 0 11px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #666666;
  }
  .iconimg {
    height: 16px;
    margin-right: 4px;
  }
}
.dialogStyle {
  .titleMess {
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #333333;
    border-left: 4px solid #26a4fd;
    padding-left: 5px;
    margin-bottom: 30px;
  }
  .lineHeight {
    height: 14px;
    line-height: 14px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #777777;
    margin-bottom: 20px;
  }
  .contMess {
    font-size: 14px;
    color: #333333;
  }
  .subCont {
    margin-bottom: 10px;
  }
}
</style>