<template>
  <div class="minWdith-1500">
    <div class="content-head">
      <el-form ref="form" :model="form" :inline="true" class="froms">
        <el-form-item>
          <el-input
            placeholder="网校名称"
            v-model="form.school_name"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="网校域名" v-model="form.school_dns"></el-input>
        </el-form-item>
        <el-button type="primary" @click="initData">搜索</el-button>
      </el-form>
      <div>
        <el-button type="primary" @click="reconciliationData(-1)"
          >对账数据</el-button
        >
        <el-button
          type="primary"
          @click="
            transDataSchool.addSchool = true;
            transDataSchool.schoolId = 0;
          "
          >添加网校</el-button
        >
      </div>
    </div>
    <div class="content-cont">
      <div>
        <div v-for="(item, index) in schoolList" class="contList" :key="index">
          <div class="cont-left">
            <div class="head-btn">
              <el-button
                v-if="item.is_forbid == 1 || item.is_forbid == 2"
                type="success"
                class="left-btn"
                @click="changeStatus(item.id, 3)"
                >启用中台</el-button
              >
              <el-button
                v-if="item.is_forbid == 0 || item.is_forbid == 3"
                type="danger"
                class="left-btn"
                @click="changeStatus(item.id, 5)"
                >禁用中台</el-button
              >
              <el-button
                v-if="item.is_forbid == 1 || item.is_forbid == 3"
                type="success"
                class="left-btn"
                @click="changeStatus(item.id, 2)"
                >启用前台</el-button
              >
              <el-button
                v-if="item.is_forbid == 0 || item.is_forbid == 2"
                type="danger"
                class="left-btn"
                @click="changeStatus(item.id, 4)"
                >禁用前台</el-button
              >
            </div>
            <img :src="item.logo_url" class="logo" alt="" />
          </div>
          <div class="user-im">
            <div style="color: #27a4fe" class="item-head">{{ item.name }}</div>
            <div style="color: #666; margin-top: 10px" class="item-head">
              {{ item.dns }}
            </div>
            <div>账户余额：{{ item.balance }}</div>
            <div>服务到期：{{ item.end_time }}</div>
            <div>负责人：{{ item.service }}</div>
          </div>
          <div class="user-course">
            <div class="item-head">
              <img
                src="../../../assets/image/school/kecheng@2x.png"
                alt=""
                class="iconImg"
              />课程
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />授权课程
            </div>
            <div style="padding-left: 30px">
              库存量 {{ item.content.course.give_stocks }}
            </div>
            <div style="padding-left: 30px">
              销售量 {{ item.content.course.give_sales }}
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />自增课程
            </div>
            <div style="padding-left: 30px">
              增加量 {{ item.content.course.total }}
            </div>
            <div style="padding-left: 30px">
              销售量 {{ item.content.course.sales }}
              <a class="setBtn" @click="classDetail(item.id)">详情></a>
            </div>
          </div>

          <div class="user-ims">
            <div class="item-head">
              <img
                src="../../../assets/image/school/bofang@2x.png"
                alt=""
                class="iconImg"
              />直播
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />并发数量
              <a style="margin-left：20px">{{ item.content.live.num }}</a>
              <a class="setBtn" @click="setFun(item.id, item.name, 1)">设置></a>
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />当月可用并发 {{ item.content.live.month_num }}
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />当月已用并发 {{ item.content.live.month_usednum }}
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />有效期 {{ item.content.live.end_time }}
            </div>
          </div>

          <div class="user-ims">
            <div class="item-head">
              <img
                src="../../../assets/image/school/kongjian@2x.png"
                alt=""
                class="iconImg"
              />空间
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />使用量 {{ item.content.storage.used }}/{{ item.content.storage.total }}G
              <a class="setBtn" @click="setFun(item.id, item.name, 2)">设置></a>
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />有效期 {{ item.content.storage.end_time }}
            </div>
          </div>
          <div class="user-ims">
            <div class="item-head">
              <img
                src="../../../assets/image/school/liuliang@2x.png"
                alt=""
                class="iconImg"
              />流量
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />使用量 {{ item.content.flow.used }}/{{ item.content.flow.used }}G
              <a class="setBtn" @click="setFun(item.id, item.name, 3)">设置></a>
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />有效期 {{ item.content.flow.end_time }}
            </div>
          </div>

          <div class="user-ims">
            <div class="item-head">
              <img
                src="../../../assets/image/school/xueyuanguanli@2x.png"
                alt=""
                class="iconImg"
              />学员
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />总注册 {{ item.content.user.total }}
            </div>
            <div>
              <img
                src="../../../assets/image/school/shuliang 拷贝@2x.png"
                alt=""
                class="iconImg"
              />总付费 {{ item.content.user.pay_student }}
            </div>
          </div>

          <div class="user-imsb">
            <el-button
              type="primary"
              plain
              @click="recharge(item.id, item.name)"
              >手动充值</el-button
            >
            <el-button type="primary" plain @click="jumpCentral(item.id)"
              >查看详情</el-button
            >
            <el-button
              type="primary"
              plain
              @click="reconciliationData(item.id)"
            >
              对账数据</el-button
            >
            <el-button type="primary" plain @click="updateSchool(item.id)"
              >管理设置</el-button
            >
            <el-button
              type="primary"
              plain
              @click="
                transData.liveChange = true;
                transData.schoolName = item.name;
                transData.schoolid = item.id;
                transData.liveid = item.livetype || -1;
              "
              >直播切换</el-button
            >
            <el-button type="primary" v-if='item.ifinto == 1' plain @click="fenxiao"
              >课程分销</el-button
            >
            <el-button type="primary" plain @click="jurisdiction(item.id)"
              >权限管理</el-button
            >
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[20, 50, 100]"
            :page-size="cur.pagesize"
            :total="totalCount"
            :current-page="nextPage"
            layout="total, sizes, prev, pager, next, jumper,slot"
          >
            <el-button class="pagingBtn" size="small">确认</el-button>
          </el-pagination>
        </div>
      </div>
      <!-- 直播并发 -->
      <live-broadcast
        v-if="broadcastData.showDialog"
        @handleSure="dialogSure"
        @handleClose="dialogClose"
        :transData="broadcastData"
      ></live-broadcast>
      <!-- 手动充值 -->
      <handMoney
        v-if="rechargeData.showDialog"
        @handleSure="dialogSure"
        @handleClose="dialogClose"
        :transData="rechargeData"
      ></handMoney>

      <!-- 直播切换 -->
      <livebroad-change
        v-if="transData.liveChange"
        @handleSure="dialogSure"
        @handleClose="dialogClose"
        :transData="transData"
      ></livebroad-change>
      <!-- 添加网校 -->
      <school-add
        v-if="transDataSchool.addSchool"
        @handleSure="dialogSure"
        @handleClose="dialogClose"
        :transData="transDataSchool"
      ></school-add>
      <!-- 网校授权 -->
      <school-auth
        v-if="transDataSchoolAuth.showDialog"
        @handleSure="dialogSure"
        @handleClose="dialogClose"
        :transData="transDataSchoolAuth"
      ></school-auth>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
import handMoney from "./school/handMoney";
import livebroadChange from "./school/livebroadChange";
import schoolAdd from "./school/schoolAdd";
import schoolAuth from "./school/schoolAuth";
import liveBroadcast from "./school/liveBroadcast";
export default {
  components: {
    handMoney,
    livebroadChange,
    schoolAdd,
    schoolAuth,
    liveBroadcast,
  },
  data() {
    return {
      transData: {
        //直播切换
        schoolid: 0,
        liveChange: false,
        schoolName: "",
        liveid: -1,
      },
      transDataSchool: {
        addSchool: false,
        schoolId: 0,
      },
      transDataSchoolAuth: {
        showDialog: false,
        schoolAuthId: "",
      },
      rechargeData: {
        showDialog: false,
        schoolid: "",
        schoolName: "",
      },
      broadcastData: {
        //直播空间
        showDialog: false,
        schoolid: "",
        schoolName: "",
        dialogTitle: "",
        type: 0,
      },
      handMoney: false,
      radioSend: false,
      loadBeal: "",
      form: {
        school_name: "",
        school_dns: "",
      },
      forms: {
        cz: "",
        money: "",
        textarea: "",
      },
      formt: {
        cz: "",
        timer: "",
        texts: "",
      },
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20,
      },
      nextPage: 1,
      totalCount: 0,
      schoolList: [],
      updataForm: [],
      
      schoolId: "",
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    //
    setFun(id, name, type) {
      if (type == 1) {
        // 直播并发
        this.broadcastData.dialogTitle = "直播并发";
      } else if (type == 2) {
        // 空间设置
        this.broadcastData.dialogTitle = "资源空间";
      } else {
        this.broadcastData.dialogTitle = "使用流量";
      }
      this.broadcastData.type = type;
      this.broadcastData.schoolid = id;
      this.broadcastData.showDialog = true;
      this.broadcastData.schoolName = name;
    },
    // 手动充值
    recharge(id, schoolName) {
      this.rechargeData.showDialog = true;
      this.rechargeData.schoolid = id;
      this.rechargeData.schoolName = schoolName;
    },
    // 修改网校
    updateSchool(id) {
      this.transDataSchool.addSchool = true;
      this.transDataSchool.schoolId = id;
    },
    // 改变状态
    changeStatus(id, statuts) {
      _request
        .http(this, "school/doSchoolForbid", { school_id: id, status: statuts })
        .then((res) => {
          if (res.code == 200) {
            this.initData();
          }
        });
    },
    // 直播切换
    dialogSure() {
      this.transData.liveChange = false;
      this.transDataSchool.addSchool = false;
      this.transDataSchoolAuth.showDialog = false;
      this.rechargeData.showDialog = false;
      this.broadcastData.showDialog = false;
      this.initData();
    },
    dialogClose() {
      this.transData.liveChange = false;
      this.transDataSchool.addSchool = false;
      this.transDataSchoolAuth.showDialog = false;
      this.rechargeData.showDialog = false;
      this.broadcastData.showDialog = false;
    },
    initData() {
      _request
        .http(this, "dashboard/index", this.form, this.cur)
        .then((res) => {
          if (res.code == 200) {
            this.schoolList = res.data.list;
            this.totalCount = res.data.total;
          }
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    listenHand(Forms) {
      this.updataForm = Forms;
      this.handMoney = false;
    },
    classDetail(id) {
      this.$router.push("/dataAll/schoolAdmin/schoolSelf?schoolId=" + id);
    },
    reconciliationData(id) {
      this.$router.push(
        "/dataAll/schoolAdmin/reconciliationData?schoolId=" + id
      );
    },
    // 分销
    fenxiao() {
      window.open("http://tianchengoa.longde999.cn", "_blank");
    },
    // 权限
    jurisdiction(id) {
      this.transDataSchoolAuth.showDialog = true;
      this.transDataSchoolAuth.schoolAuthId = id;
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
    jumpCentral(schoolId) {
      //路由跳转前做判断
      let centerParam = {
        school_id: schoolId,
      };
      _request
        .http(this, "school/getManageSchoolToken", centerParam)
        .then((res) => {
          if(res.code != 200 ) return;
          let hrefStr = ''
          if (process.env.NODE_ENV === "development") hrefStr = "http://localhost:8080";
          if (process.env.NODE_ENV === "production") {
            if (process.env.EVN_CONFIG == "prod") hrefStr = this.GLOBAL.webUrl.branchProd;//// 生产环境配置
            if (process.env.EVN_CONFIG == "test") hrefStr = this.GLOBAL.webUrl.branchDev;//测试环境
          }
          window.open(hrefStr+"/#/login?token=" + res.data.token+"&cur_admin_id="+res.data.cur_admin_id, "_blank");
        });
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
.minWdith-1500 {
  min-width: 1500px;
  max-width: 100%;
}
.contList {
  font-size: 16px;
  color: #333333;
  display: flex;
  justify-content: space-between;
  align-items: top;
  padding-right: 10px;
  margin: 25px 0 0;
  width: 100%;
  height: 260px;
  box-shadow: 3px 4px 3px 4px #f0f0f0;
  background: #fff;
  .cont-left {
    position: relative;
    width: 260px;
    background: #27a4fe;
    .head-btn {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
    }
    .left-btn {
      box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
    }
    .logo {
      width: 180px;
      position: absolute;
      margin-top: 10px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      // margin: 30px 20px 0;
    }
  }
  .iconImg {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
  .user-ims {
    line-height: 42px;
  }

  span {
    width: 180px;
    height: 200px;
    position: relative;
    // background: #27a4fe;
    display: flex;
    align-items: center;
    // margin-right: 20px;
    // justify-content: space-between;
    img {
      width: 90%;
      margin: auto;
    }
    a {
      position: absolute;
      top: 5px;
      left: 5px;
      padding: 1px 10px;
      font-size: 15px;
      border-radius: 5px;
      color: #fff;
      background: rgb(57, 241, 97);
    }
  }
  .user-im {
    line-height: 50px;
  }
  .user-course {
    line-height: 34px;
  }
  .setBtn {
    font-size: 13px;
    color: #fe6f21;
    cursor: pointer;
  }
  .user-imsb {
    width: 170px;

    .el-button {
      width: 80px;
      text-align: center;
      margin: 0;
      margin-top: 20px;
    }
  }
  .item-head {
    margin-top: 16px;
    height: 25px;
    line-height: 25px;
    margin-bottom: 6px;
    .iconImg {
      width: 25px;
      height: 25px;
      margin-left: -4px;
    }
  }
}
.el-button--danger {
  color: #fff;
  background-color: #e9001d;
  border-color: #e9001d;
}
.el-button--danger:focus,
.el-button--danger:hover {
  color: #fff;
  background-color: #eb465b;
  border-color: #eb465b;
}
</style>
