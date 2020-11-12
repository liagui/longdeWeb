<template>
  <div>
    <!-- 弹出框 -->
    <el-dialog
      title="直播切换"
      :close-on-click-modal="false"
      :visible.sync="transData.liveChange"
      width="30%"
      @close="handleClose"
    >
      <div>
        <div class="schoolHead">
          分校名称：<span class="showName">{{ transData.schoolName }}</span>
        </div>
        <el-form :inline="false">
          <div
            v-for="(item, index) in liveArr"
            :label="item.name"
            :key="item.id"
          >
            <el-checkbox
              @change="selLive(index, item.checked, item.id)"
              v-model="formData.liveid"
              :label="item.name"
              :true-label="item.id"
            ></el-checkbox>
          </div>
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
export default {
  props: ["transData"],
  data() {
    return {
      liveArr: [],
      formData: {
        liveid: this.transData.liveid,
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
      if (this.formData.liveid == -1) {
        alert("请选择直播方式");
        return;
      }
      this.request
        .http(this, "dashboard/liveService/updateLivetype", {
          schoolid: this.transData.schoolid,
          liveid: this.formData.liveid,
        })
        .then((res) => {
          if (res.code == 200) {
           this.$emit('handleSure');
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
  margin-bottom: 15px;
  .showName {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
  }
}
</style>
