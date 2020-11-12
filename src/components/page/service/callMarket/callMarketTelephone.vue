<template>
  <div class="content-boxs">
    <div class="contents">
      <span><i>|</i>客服电话设置</span>
      <el-switch
        v-model="value"
        active-color="#13ce66"
        inactive-color="#f0f0f0"
        @change="changeStatus(4)"
        :active-text="value ? '开启' : '关闭'"
      >
      </el-switch>
    </div>
    <div class="nav">
      <p>
        <span>电话号码：</span>
        <input
          type="text"
          v-model="form.input"
          placeholder="请在这里输入电话号码"
          @blur="phone"
        />
      </p>
      <p>
        <span>服务时间：</span>
        <input
          type="text"
          v-model="form.inputs"
          placeholder="上午8:00-下午18.00"
        />
      </p>
      <el-button type="primary" @click="primise">保存</el-button>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
export default {
  name: "",
  data() {
    return {
      value: true,
      data: [],
      form: {
        input: "",
        inputs: "",
      },
      types: {
        type: "",
      },
    };
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      _request.http(this, "services/servicelist", { type: 4 }).then((res) => {
        if (res.code == 200) {
          this.data = res.data[3];
        }
      });
    },
    phone() {
      const Reg = /(\d{4}-|\d{3}-)?(\d{8}|\d{7})/;
      if (Reg.test(this.form.input)) {
        // this.$message("添加成功");
      } else {
        this.$message("请正确输入电话号码");
        this.form.input = "";
        return;
      }
    },
    primise() {
      if (this.form.input == "") {
        this.$toast("请正确输入电话号");
      } else {
        this.$toast("操作成功");
      }
      if (this.form.inputs == "") {
        this.$toast("请输入服务时间");
      } else {
        this.$toast("操作成功");
      }
    },
    changeStatus(val) {
      this.types.type = val;
      _request.http(this, "services/openstatus", this.types).then((res) => {
        if (res.code == 200) {
          console.log(res);
          // this.value = res.status;
          // if (res.data == 1) {
          //   this.value = true;
          // } else if (res.data == 0) {
          //   this.value = false;
          // }
        }
      });
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
.content-boxs {
  width: 95%;
  background: #fff;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow: 3px 5px 5px 3px #f0f0f0;

  .contents {
    width: 95%;
    margin: 0 auto;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 60px;

    i {
      width: 4px;
      font-size: 20px;
      color: rgb(22, 109, 240);
      margin-right: 10px;
    }
  }
  .nav {
    width: 95%;
    margin: 0 auto;
    padding: 15px;
    // margin-bottom: 15px solid #fff;
    display: flex;
    flex-direction: column;
    p {
      input {
        width: 230px;
        height: 30px;
        border: none;
        outline: none;
        background: #f0f0f0;
        border-radius: 5px;
        &::placeholder {
          font-size: 12px;
          padding-left: 10px;
        }
      }
    }
    div {
      display: flex;
      .el-upload--picture-card {
        width: 230px;
        height: 230px;
        border-radius: 5px;
        background: #f0f0f0;
        font-size: 15px;
        border: none;
      }
    }
  }
}
.el-button {
  width: 100px;
  margin: 40px 0 30px 100px;
}
</style>
