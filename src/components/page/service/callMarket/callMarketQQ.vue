<template>
  <div class="content-boxs">
    <div class="contents">
      <span><i>|</i>QQ号码</span>
      <el-switch
        v-model="value"
        active-color="#13ce66"
        inactive-color="#f0f0f0"
        @change="changeStatus(1)"
        :active-text="value ? '开启' : '关闭'"
      >
      </el-switch>
    </div>
    <div class="open close" v-show="value">
      <!-- 开始状态 -->
      <div class="qq">
        <span
          class="span"
          v-if="activeIndex == 1"
          @mouseover="overUser"
          @mouseout="outUser"
        >
          <img src="../../../../assets/image/kefu/QQ-(4)@2x.gif" alt="" />
          <a>个人QQ</a>
        </span>
        <!-- 悬停让qq选择项出现 -->
        <span class="span s" v-if="activeIndex == 2">
          <img src="../../../../assets/image/kefu/QQ-(4)@2x.gif" alt="" />

          <a>个人QQ</a>
          <button @click="xuanSqq(1)">选择</button>
        </span>
        <!--  -->
        <!-- 点击选择时，选中qq方式 -->
        <div class="qqxian" v-if="activeIndex == 3">
          <span class="span">
            <img src="../../../../assets/image/kefu/QQ (6)@2x.png" alt="" />
            <a>个人QQ</a>
            <button class="button">已选择</button>
          </span>
          <p>
            <span>输入qq号：</span
            ><el-input
              v-model="input"
              placeholder="请输入QQ"
              @change="buttonA"
            ></el-input>
          </p>

          <el-button type="primary" @click="qqRegs">保存</el-button>
        </div>
        <!--  -->

        <span
          class="span"
          v-if="activeIndexs == 1"
          @mouseover="overY"
          @mouseout="outY"
        >
          <img src="../../../../assets/image/kefu/图层-4@2x.gif" alt="" />
          <a>营销QQ</a>
        </span>
        <span class="span s" v-if="activeIndexs == 2">
          <img src="../../../../assets/image/kefu/图层-4@2x.gif" alt="" />

          <a>营销QQ</a>
          <button @click="xuansQQ(2)">选择</button>
        </span>

        <!-- 点击选择时，选中qq方式 -->
        <div class="qqxian" v-if="activeIndexs == 3">
          <span class="span">
            <img src="../../../../assets/image/kefu/图层 4(1)@2x.png" alt="" />

            <a>个人QQ</a>
            <button class="button">已选择</button>
          </span>
          <p>
            <span>qq号码：</span
            ><el-input
              v-model="inputs"
              placeholder="请输入QQ"
              @change="buttonKey"
            ></el-input>
          </p>
          <p>
            <span>营销QQ-key值：</span
            ><el-input
              v-model="key"
              placeholder="请输入QQ"
              @change="buttonS"
            ></el-input>
          </p>
          <div id="bth" style="width:200px'margin:0 auto">
            <el-button type="primary" @click="qqReg">保存</el-button>
          </div>
        </div>

        <!--  -->
      </div>
    </div>
    <!-- 状态为false时  开始状态 -->
    <div class="close" v-show="!value">
      <div class="qq">
        <span class="span">
          <img src="../../../../assets/image/kefu/QQ-(4)@2x.gif" alt="" />
          <a>个人QQ</a>
        </span>

        <span class="span">
          <img src="../../../../assets/image/kefu/图层-4@2x.gif" alt="" />
          <a>营销QQ</a>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { qqemailRule } from "../../../../utils/rules";
import _request from "@/utils/request";
export default {
  name: "",
  data() {
    return {
      value: false,
      disabled: false,
      ActiveIndex: 0,
      data: [],
      // xuanQQ: false,
      // xuanYQQ: false,
      // xuanSqq: false,
      // xuanssQQ: false,
      // xuan: true,
      activeIndex: 1,
      activeIndexs: 1,
      key: "",
      inputs: "",
      input: "",
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
      _request.http(this, "services/servicelist", { type: 1 }).then((res) => {
        if (res.code == 200) {
          this.data = res.data[0];
        }
      });
    },
    buttonA() {
      const Reg = /[1-9]\d{4,}/;
      if (Reg.test(this.input)) {
        // this.$message("添加成功");
      } else {
        // this.$message("不能少于九位数");
        this.input = "";
        return;
      }
    },
    buttonKey() {
      const reg = /[1-9]\d{4,}/;
      if (reg.test(this.inputs)) {
        // this.$message("添加成功");
        console.log(this.inputs);
      } else {
        // this.$message("不能少于九位数");
        this.inputs = "";
        return;
      }
    },
    buttonS() {
      // const regs = /[0-9]{9,10}/;
      // if (regs.test(this.key)) {
      //   this.$message("添加成功");
      //   console.log(this.key);
      // } else {
      //   this.$message("不能少于九位数");
      //   this.key = "";
      //   return;
      // }
    },
    qqRegs() {
      if (this.input == "") {
        // this.$message("QQ号不能为空并且为数字");
        return;
      } else {
        // this.$message("操作成功");
        this.activeIndex = 2;
      }
    },
    qqReg() {
      if (this.key == "") {
        this.$message("QQ号不能为空并且为数字");
        return;
      } else {
        // this.$message("操作成功");
        this.activeIndexs = 2;
      }
      if (this.inputs == "") {
        this.$message("营销QQ-Key值不能为空");
        return;
      } else {
        // this.$message("操作成功");
        this.activeIndexs = 2;
      }
    },
    changeStatus(val) {
      this.types.type = val;
      _request.http(this, "services/openstatus", this.types).then((res) => {
        if (res.code == 200) {
          console.log(res);
          // // this.value = res.status;
          // if (res.data == 1) {
          //   this.value = true;
          // } else if (res.data == 0) {
          //   this.value = false;
          // }
        }
      });
    },
    // qq选择
    xuanSqq(val) {
      this.activeIndex = 3;
      this.activeIndexs = 1;
      _request.http(this, "services/qqelect", { type: val }).then((res) => {
        if (res.code == 200) {
          console.log(res);
        }
      });
    },
    overUser() {
      this.activeIndex = 2;
    },
    outUser() {
      this.activeIndex = 1;
    },
    // qq营销选择
    xuansQQ(val) {
      this.activeIndexs = 3;
      this.activeIndex = 1;
      _request.http(this, "services/qqelect", { type: val }).then((res) => {
        if (res.code == 200) {
          console.log(res);
        }
      });
    },
    overY() {
      this.activeIndexs = 2;
    },
    outY() {
      this.activeIndexs = 1;
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 60px;
    // border-bottom: 2px solid #f0f0f0;

    i {
      width: 4px;
      height: 20px;
      font-size: 20px;
      color: rgb(240, 22, 40);
      // background: rgb(240, 22, 40);
      margin-right: 10px;
    }
  }
  .open {
    width: 95%;
    margin: 0 auto;
    padding: 15px;

    margin-bottom: 15px solid #fff;

    .qq {
      width: 800px;
      // height: 300px;
      margin: 30px auto;
      display: flex;
      justify-content: space-between;
      background: #fff;
      .user,
      .yin {
        // width: 30%;
        // height: 300px;
        display: flex;
        flex-direction: column;
        // justify-content: center;
        .span {
          width: 300px;
          height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #fff;
          align-items: center;
          box-shadow: 2px 3px 2px 2px #f0f0f0;
          position: relative;
          margin-bottom: 10px;
          img {
            width: 120px;
            height: 120px;
            background-size: 100%;
            margin-bottom: 20px;
          }
          button {
            border-radius: 5px;
            border: none;
            font-size: 15px;
            margin-top: 20px;

            // background: chartreuse;
          }
        }
        .yin {
          div {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            p {
              // line-height: 60px;
              display: flex;
              justify-content: space-between;
              align-items: center;

              span {
                font-size: 15px;
              }
            }
          }
        }
      }
    }
  }
  .close {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    background: #fff;
    padding: 15px;

    .qq {
      width: 800px;
      margin: 30px auto;
      display: flex;
      justify-content: space-between;
      background: #fff;
      border: #f0f0f0;
      .qqxian {
        width: 300px;
        height: 300px;
        p {
          width: 300px;
          line-height: 45px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 15px;
          input {
            width: 120px;
          }
          span {
            width: 180px;
            font-size: 14px;
          }
        }
      }
      .span {
        width: 300px;
        height: 300px;
        margin: 0 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: #fff;
        align-items: center;
        box-shadow: 2px 3px 2px 2px #f0f0f0;
        position: relative;
        button {
          padding: 5px 10px;
          border-radius: 5px;
          border: none;
          font-size: 15px;
          position: absolute;
          bottom: 15px;
          // left: 0;
          background: rgb(147, 214, 245);
        }
      }
      // .qqxian {
      //   width: 30%;
      //   height: 500px;
      // }
      img {
        width: 120px;
        height: 120px;
        background-size: 100%;
        margin-bottom: 20px;
      }

      .button {
        width: 80px;
        height: 35px;
        position: absolute;
        left: 10px;
        top: 10px;
      }
      .s {
        background: #f0f0f0;
        opacity: 0.8;
        // position: relative;
      }
    }
  }
}
</style>
