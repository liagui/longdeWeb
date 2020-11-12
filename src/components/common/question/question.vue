<template>
  <div class="container-fluid">
    <!-- phone -->
    <div class="hidden-md-and-up">
      <van-nav-bar @click-left="clickLeft" title="题库" left-arrow></van-nav-bar>
      <div class="phone-wrap">
        <van-sidebar v-model="sidebarKey" @change="sidebarChange">
          <van-sidebar-item
            :title="item.bank_name"
            v-for="(item,index) in questionList"
            :key="index"
          />
        </van-sidebar>
        <dl class="phone-list">
          <dd v-for="(item,index) in currenQuestionList" :key="index">
            <van-button
              @click="pushUrl(questionList[sidebarKey],item)"
              type="default"
            >{{ item.subject_name }}</van-button>
          </dd>
        </dl>
      </div>
    </div>
    <!-- pc -->
    <div class="hidden-sm-and-down" v-if="loading">
      <div class="q-banner">
        <img src="~static/image/tiku.png" alt style="width:100%" />
      </div>
      <div class="container tiku-list">
        <h2 class="font16">全部题库</h2>
        <h6>CLASSIFICATION</h6>
        <div class="heng"></div>
        <ul class="q-grid">
          <li @click="selectQuestion(item)" v-for="(item,index) in questionList" :key="index">
            <div class="q-grid-item">
              <div class="grid-img" :style="'background-image:url('+item.img+')'"></div>
              <div class="grid-name">{{item.bank_name}}</div>
            </div>
            <div class="q-grid-none">
              <h4
                @click="pushUrl(item,children)"
                v-for="(children,inde) in item.subject_list"
                :key="inde"
              >{{ children.subject_name }}</h4>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: "My Example App", // set a title
    meta: [
      {
        // set meta
        name: "keyWords",
        content: "My Example App"
      }
    ]
  },
  mounted() {
    setTimeout(() => {
      this.loading = true;
    });
  },
  created() {
    this.$store.commit("clearZhangJie");
    let url = window.location.href;
    if (url.indexOf("token=") > -1) {
      this.$store.commit("setToken", this.$route.query.token);
    }
    this.initData(true);
  },
  data() {
    return {
      loading: false,
      currenQuestionList: [],
      sidebarKey: 0,
      active: 1,
      questionList: []
    };
  },
  methods: {
    initData(isFirst) {
      this.$axios.post("/getBankList", {}).then(res => {
        if (res.code == 200) {
          this.questionList = res.data;
          if (isFirst && this.questionList[0]) {
            this.currenQuestionList = this.questionList[0].subject_list;
          }
        }
      });
    },
    selectQuestion(item) {
      console.log(item);
    },
    //手机事件
    clickLeft() {
      if (window.android && window.android.back) {
        window.android.back();
      } else if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.jsToOcWithPrams.postMessage("backAction");
      } else {
        this.$router.push("/home");
      }
    },
    //跳转tab页
    pushUrl(bankObj, subjectObj) {
      let obj = {
        bank_id: bankObj.bank_id,
        bank_name: bankObj.bank_name,
        subject_id: subjectObj.subject_id,
        subject_name: subjectObj.subject_name
      };

      this.$store.commit("bank_id", obj.bank_id);
      this.$store.commit("subject_id", obj.subject_id);

      this.$store.commit("subject_List", JSON.stringify(bankObj.subject_list));
      this.$router.push("/question/questionExercise");
    },
    sidebarChange(index) {
      this.currenQuestionList = this.questionList[index].subject_list;
    }
  }
};
</script> 

<style lang="less" scoped>
@import "./question.less";
.hidden-sm-and-down {
  background-color: #fff;
}
.q-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 50px;
  margin-bottom: 20px;
  li {
    position: relative;
    width: 25%;
    text-align: center;
    cursor: pointer;

    &:hover .q-grid-none {
      opacity: 1;
      background-color: rgba(64, 158, 255, 0.7);
    }
    &:nth-child(4n) .q-grid-item {
      border-right: none;
    }
    .q-grid-item {
      border-right: 1px solid #e4e7ed;
      border-bottom: 1px solid #e4e7ed;
      padding: 70px 0;
    }
    .q-grid-none {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      overflow: auto;
      z-index: 9999;
      transition: all 0.4s ease;
      opacity: 0;
      background-color: rgba(0, 0, 0, 0.1);
      h4 {
        margin: 3px;
        display: inline-block;
        padding: 9px 19px;
        font-size: 12px;
        color: #666;
        line-height: 1;
        border: 1px solid #eee;
        background-color: #fff;
        border-radius: 16px;
        margin-right: 8px;
        margin-bottom: 18px;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          color: #0af;
          border-color: #0af;
        }
      }
    }
  }
}
.grid-img {
  margin: 0 auto;
  width: 40px;
  height: 40px;
  background-image: url(~assets/image/question/xiaofang@2x.png);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}
.grid-name {
  padding: 20px 0;
}
// .q-banner {
//   height: 60vh;
//   background: url(~static/image/tiku.png) center/cover no-repeat;
// }
.tiku-list {
  margin-top: 80px;
  display: flex;
  align-items: center;
  flex-direction: column;

  .heng {
    position: relative;
    margin-top: 15px;
    height: 1px;
    width: 100%;
    border-bottom: 1px solid #e4e7ed;
    &::after {
      position: absolute;
      top: -12px;
      left: 50%;
      margin-left: -9px;
      display: block;
      content: "";
      width: 18px;
      height: 14px;
      background: url(~assets/image/question/sanjiao@2x.png) center/cover
        no-repeat;
    }
  }
}
// 手机样式
.phone-wrap {
  display: flex;
}
.phone-list {
  flex: 1;
  padding: 10px 0 30px 0;
  dt {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    padding: 0 10px;
  }
  dd {
    margin: 10px;
    display: inline-block;
  }
}
/deep/ .van-sidebar {
  background-color: #f7f8fa;
}
</style>
