<template>
  <div class="archive">
    <div class="archive-head">
      <div class="head-box">
        <img :src="addData.head_icon" class="head_icon" alt />
        <div class="head-mess">
          <el-row>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon1.png"
                class="item-img"
                alt="图片"
              />姓名：
              <span class="text-333">{{ addData.real_name }}</span>
            </el-col>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon14.png"
                class="item-img"
                alt="图片"
              />所属网校：
              <span class="text-333">{{ addData.school_name }}</span>
            </el-col>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon8.png"
                class="item-img"
                alt="图片"
              />出生日期：
              <span class="text-333">{{ addData.birthday }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon2.png"
                class="item-img"
                alt="图片"
              />手机号：
              <span class="text-333">{{ addData.phone }}</span>
            </el-col>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon9.png"
                class="item-img"
                alt="图片"
              />最高学历：
              <span class="text-333">{{ addData.educational_name }}</span>
            </el-col>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon15.png"
                class="item-img"
                alt="图片"
              />微信：
              <span class="text-333">{{ addData.wechat }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon3.png"
                class="item-img"
                alt="图片"
              />证件类型：
              <span class="text-333">{{ addData.papers_type_name }}</span>
            </el-col>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon10.png"
                class="item-img"
                alt="图片"
              />户口所在地：
              <span class="text-333">{{ addData.address_locus }}</span>
            </el-col>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon16.png"
                class="item-img"
                alt="图片"
              />家庭电话：
              <span class="text-333">{{ addData.family_phone }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon4.png"
                class="item-img"
                alt="图片"
              />证件号：
              <span class="text-333">{{ addData.papers_num }}</span>
            </el-col>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon11.png"
                class="item-img"
                alt="图片"
              />住址：
              <span class="text-333">{{ addData.address }}</span>
            </el-col>
            <el-col :span="8">
              <img
                src="@/assets/image/xueyuan/icon17.png"
                class="item-img"
                alt="图片"
              />办公电话：
              <span class="text-333">{{ addData.office_phone }}</span>
            </el-col>
          </el-row>
          <div v-if="showAllMess">
            <el-row>
              <el-col :span="8">
                <img
                  src="@/assets/image/xueyuan/icon14.png"
                  class="item-img"
                  alt="图片"
                />QQ：
                <span class="text-333">{{ addData.qq }}</span>
              </el-col>
              <el-col :span="8">
                <img
                  src="@/assets/image/xueyuan/icon12.png"
                  class="item-img"
                  alt="图片"
                />性别：
                <span class="text-333">{{
                  addData.sex == 1 ? "男" : "女"
                }}</span>
              </el-col>
              <el-col :span="8">
                <img
                  src="@/assets/image/xueyuan/icon.png"
                  class="item-img18"
                  alt="图片"
                />年龄：
                <span class="text-333">{{ addData.age }}岁</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <img
                  src="@/assets/image/xueyuan/icon5.png"
                  class="item-img"
                  alt="图片"
                />紧急联系人：
                <span class="text-333">{{ addData.contact_people }}</span>
              </el-col>
              <el-col :span="8">
                <img
                  src="@/assets/image/xueyuan/icon16.png"
                  class="item-img"
                  alt="图片"
                />紧急联系人电话：
                <span class="text-333">{{ addData.contact_phone }}</span>
              </el-col>
              <el-col :span="8">
                <img
                  src="@/assets/image/xueyuan/icon19.png"
                  class="item-img"
                  alt="图片"
                />邮箱：
                <span class="text-333">{{ addData.email }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">
                <img
                  src="@/assets/image/xueyuan/icon7.png"
                  class="item-img"
                  alt="图片"
                />备注：
                <span class="text-333">{{ addData.remark }}</span>
              </el-col>
            </el-row>
          </div>
          <div>
            <div v-if='showAllMess' class="lookMore" @click='showAllMess= false'>点击收回∧</div>
            <div v-else class="lookMore" @click='showAllMess= true'>查看更多∨</div>
          </div>
        </div>
        <div>
          <div class="head-right">
            <img
              src="@/assets/image/xueyuan/right1.png"
              class="right-img"
              alt="图片"
            />余额：
            <span class="text-333">{{ addData.balance }}</span>
          </div>
          <div class="head-right">
            <img
              src="@/assets/image/xueyuan/right2.png"
              class="right-img"
              alt="图片"
            />最后登录时间：
            <span class="text-333">{{ addData.login_at }}</span>
          </div>
          <div class="head-right">
            <img
              src="@/assets/image/xueyuan/right3.png"
              class="right-img"
              alt="图片"
            />注册来源：
            <span class="text-333">{{ addData.reg_source }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="archive-content">
      <div style="margin-bottom: 20px">
        <el-tabs v-model="tabActive" @tab-click="activeTab">
          <el-tab-pane label="消费记录" name="0">
            <record-purchase></record-purchase>
          </el-tab-pane>
          <el-tab-pane label="学习记录" name="1">
            <record-learn></record-learn>
          </el-tab-pane>
          <el-tab-pane label="做题记录" name="2">
            <record-question :transdata='$route.query.archiveId'></record-question>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
import Modal from "@/components/business/Modal";
import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
import recordPurchase from "./studentsarchive/recordPurchase";
import recordLearn from "./studentsarchive/recordLearn";
import recordQuestion from "./studentsarchive/recordQuestion";
export default {
  data() {
    return {
      pagesize: 10,
      currentPage: 1,
      total: 0,
      showModal: false, //学习进度
      student_id: "",
      addData: {
        head_icon: "",
        schoolName: "",
        phone: "",
        real_name: "",
        sex: 1,
        papers_type: "",
        papers_num: "",
        birthday: "",
        address_locus: "",
        age: "",
        educational: "",
        family_phone: "",
        office_phone: "",
        contact_people: "",
        contact_phone: "",
        email: "",
        qq: "",
        wechat: "",
        address: "",
        remark: "",
      },
      orderList: [],
      noData: false,
      tabActive: "0", //当前选择的tab
      tabArr: ["消费记录", "学习记录", "做题记录"],
      showAllMess: false, // 显示所有信息
      transId:0,
    };
  },
  components: { Modal, recordPurchase, recordLearn ,recordQuestion},
  mounted() {
    this.getDetail();
    // this.orderForStudent();
  },
  methods: {
    activeTab(item, index) {
      // this.tabActive = index;
    },
    getDetail() {
      _request
        .http(this, "student/getStudentInfoById", {
          student_id: this.$route.query.archiveId,
        })
        .then((res) => {
          if (res.code == 200) {
            this.addData = res.data;
          }
        });
    },
  },
  watch: {
    student_id(val) {
      console.log(val);
      this.getDetail();
    },
  },
};
</script>

<style scoped lang="less">
.archive {
  margin: 0 25px;
}
 .lookMore {
    text-align: center;
    font-size: 14px;
    color: #27a4fe;
    cursor: pointer;
  }
.archive-head {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  padding: 10px 10px 5px;

  .head-box {
    display: flex;
  }
  .head_icon {
    width: 128px;
    height: 128px;
    vertical-align: top;
    margin-right: 10px;
  }
  .head-mess {
    flex: 1;
    font-size: 14px;
    color: #666;

    .el-col {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  .text-333 {
    color: #333;
  }
  .head-right {
    font-size: 14px;
    color: #666;
    padding-top: 15px;
    padding-bottom: 20px;
  }
}
.item-img {
  vertical-align: top;
  margin-right: 2px;
}
.right-img {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 5px;
}
.archive-content {
  padding-top: 20px;

  .content-order {
    font-size: 15px;
    padding-bottom: 10px;
    color: #343434;
    margin: 20px 30px 20px 10px;
    cursor: pointer;
    &.tabActive {
      border-bottom: 1px solid #24a3fc;
      color: #24a3fc;
    }
  }
  .list-box {
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
    display: flex;
    padding: 23px 16px 8px;

    .course-cover {
      width: 260px;
      height: 140px;
      margin-right: 10px;
      vertical-align: middle;
    }
    .course-center {
      flex: 1;
      padding-top: 10px;
      font-size: 14px;
      color: #666666;
    }
    .rowStyle {
      margin-bottom: 20px;
      .center-data {
        color: #333;
      }
    }
    .statusbox {
      margin-top: 63px;
      text-align: right;
      font-size: 14px;
    }
    .changeClass {
      position: absolute;
      right: 0;
      width: 42px;
      text-align: center;
      color: #fff;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      border: 0;
      background: #fda426;
      border-radius: 15px;
      cursor: pointer;
    }
  }
 
}
</style>