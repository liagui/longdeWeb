<template>
  <div>
    <el-dialog
      :title="transData.dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      width="60%"
      @close="showDialog = false"
      center
    >
      <div class="dialogStyle">
        <div class="titleMess">订单信息</div>
        <el-row>
          <el-col class="lineHeight" :span="12">
            订单编号：<span class="contMess">编号内容</span>
          </el-col>
          <el-col class="lineHeight" :span="12">
            支付方式：<span class="contMess">编号内容</span>
          </el-col>
          <el-col class="lineHeight" :span="12">
            订单类型：<span class="contMess">编号内容</span>
          </el-col>
          <el-col class="lineHeight" :span="12">
            订单时间：<span class="contMess">编号内容</span>
          </el-col>
          <el-col class="lineHeight" :span="12">
            备注信息：<span class="contMess">编号内容</span>
          </el-col>
        </el-row>
        <div class="titleMess">购买信息</div>
        <el-row>
          <el-col class="lineHeight" :span="12">
            购买服务：<span class="contMess">编号内容</span>
          </el-col>
          <el-col class="lineHeight" :span="12">
            单价：<span class="contMess">编号内容</span>
          </el-col>
          <el-col class="lineHeight" :span="12">
            购买总量：<span class="contMess">编号内容</span>
          </el-col>
          <el-col class="lineHeight" :span="12">
            订单金额：<span class="contMess">编号内容</span>
          </el-col>
          <el-col class="lineHeight" :span="12">
            备注信息：<span class="contMess">编号内容</span>
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
                <el-select v-model="formData.stataus" style="width: 100%">
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
              <el-form-item label="驳回原因：" v-if="formData.stataus == 2">
                <el-input type="textarea" :rows="3"></el-input>
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
      formData: {
        mess: "",
        stataus: "1",
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
        { label: "待审核", value: "1" },
        { label: "驳回", value: "2" },
        { label: "通过", value: "3" },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
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
      this.$refs.addData.validate((valid) => {
        if (valid) {
          if (this.addData.id) {
            // 修改
            _request.http(this, "updateLive", this.addData).then((res) => {
              if (res.code == 200) {
                this.showDialog = false;
                this.initData();
              }
            });
          } else {
            _request.http(this, "live/add", this.addData).then((res) => {
              if (res.code == 200) {
                this.showDialog = false;
                this.addData.id = "";
                this.initData();
              }
            });
          }
        }
      });
    },

    initData() {
      _request.http(this, "live", this.searchData, this.cur).then((res) => {
        this.cashAuditData = res.data.Live_list;
        this.totalCount = res.data.total;
        this.nextPage = parseInt(res.data.page);
      });
    },
    select() {
      this.paginationShow = false;
      this.cur.page = 1;
      this.$nextTick(() => {
        this.initData();
        this.paginationShow = true;
      });
    },

    //每页
    handleSizeChange(val) {
      this.cur.pagesize = val;
      this.initData();
    },
    //第几页
    handleCurrentChange(val) {
      this.cur.page = val;
      this.initData();
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
}
</style>