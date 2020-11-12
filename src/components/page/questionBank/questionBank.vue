<template>
  <div class="container-box" v-cloak>
    <div style="margin-top:10px;">
      <!-- <div class="topHead">
        <div class="mulu">题库目录</div>
        <div class="gengxinbox">
          <span class="time">最后更新时间：2020-5-10 14：00</span>
          <el-button class="sub-btn" @click="initData">更新题库</el-button>
        </div>
      </div>-->
      <div class="clearfix">
        <div class="addBox" @click="changeShowBox(1)">
          <div class="add-content">
            <i class="el-icon-circle-plus"></i>
          </div>
        </div>
        <div class="listbox" v-for="(item,index) in getListData" :key="index">
          <div class="box-head">
            <button class="bg-red" @click="deleteBank(item.bank_id)">
              <i class="el-icon-delete"></i>
            </button>
            <button class="bg-blue" @click="updateBank(item.bank_id)">
              <i class="el-icon-edit-outline"></i>
            </button>
          </div>
          <div class="box-title" v-text="item.topic_name"></div>
          <div class="box-subTitle" v-text="item.describe"></div>
          <div class="box-content">
            <p>
              共有
              <span class="kemu">{{item.subject_count}}</span>个科目
            </p>
            <p>
              共有
              <span class="shijuan">{{item.papers_count}}</span>套试卷
            </p>
            <p>
              共有
              <span class="shijuan">{{item.exam_count}}</span>道试题
            </p>
          </div>
          <div class="box-footer">
            <el-button
              v-if="item.is_open == 0"
              @click="changeCloseBank(item.bank_id)"
              type="success"
            >开启</el-button>
            <el-button v-else type="danger" @click="changeCloseBank(item.bank_id)">关闭</el-button>
            <el-button class="ml" @click="adminBank(item)" type="primary">管理</el-button>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          v-if="paginationShow"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[19, 49, 99]"
          :page-size="cur.pagesize"
          :total="totalCount"
          :current-page="nextPage"
          layout="total, sizes, prev, pager, next, jumper,slot"
        >
          <el-button class="pagingBtn" size="small">确认</el-button>
        </el-pagination>
      </div>
    </div>
    <Modal width="660px" :show="showList" :title="updateItem?'题库修改':'题库添加'" @close="marksureFun">
      <question-add
        @closeAndUpdateFun="addAndUpdateFun"
        :updateDataId="updateItem"
        @closeFun="marksureFun"
      ></question-add>
    </Modal>
  </div>
</template>
<script>
import _request from "@/utils/request";
import Modal from "@/components/business/Modal";
import questionAdd from "./questionAdd";
// import CourseRecord from "./courseRecord";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components: {
    Modal,
    questionAdd
  },
  data() {
    return {
      showList: false,
      updateItem: "",
      getListData: [],
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 19
      },
      nextPage: 1,
      totalCount: 0,
      addData: {
        sex: "1"
      },
      rule: {
        // userNameOrPhoneNo: [{ validator: checkCharacters, trigger: "blur" }],
        payNo: [
          {
            validator: onlyInputNumber,
            trigger: "blur"
          }
        ]
      },
      searchData: {}
    };
  },
  created() {
    this.initData();
    // this.getPayChannels();
    // console.log(this.$store.state.SecHeadClick);
  },
  methods: {
    getAuthority(id, callBack) {
      this.$store.dispatch("disAuthority", id).then(response => {
        if (response == 1) {
          callBack && callBack();
        } else {
          alert("授权的相关内容，没有操作权限，请联系服务商");
        }
      });
    },
    // 改变状态
    changeCloseBank(id) {
      this.getAuthority(id, () => {
        _request
          .http(this, "question/doOpenCloseBank", { bank_id: id })
          .then(res => {
            if (res.code == 200) {
              this.initData();
            } else {
              alert(res.msg);
            }
          });
      });
    },
    adminBank(item) {
      this.$store.commit("bank_id", item.bank_id);
      this.$store.dispatch("disAuthority", item.bank_id);

      localStorage.setItem("bankName", item.topic_name);
      localStorage.setItem("showBank", 0);
      this.$bus.$emit("showBank", 0);
      this.$bus.$emit("bankName", {
        name: item.topic_name,
        bankId: item.bank_id
      });
      var urlParam = `?bankName=${item.topic_name}&bankId=${item.bank_id}&showBank=0`;
      this.$router.push("/question/getExamList" + urlParam);
      // this.$router.push("/question/getExamList");
    },
    // 修改
    updateBank(id) {
      this.getAuthority(id, () => {
        this.updateItem = id;
        this.showList = true;
      });
    },
    deleteBank(id) {
      this.getAuthority(id, () => {
        this.$confirm("删除该题库, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          _request
            .http(this, "question/doDeleteBank", { bank_id: id })
            .then(res => {
              if (res.code == 200) {
                if (this.cur.page > 1) {
                  this.cur.page =
                    Math.ceil(this.totalCount - 1) / this.cur.pagesize;
                }
                this.initData();
              } else {
                alert(res.msg);
              }
            });
        });
      });
    },

    changeShowBox(box) {
      this.updateItem = "";
      this.showList = true;
    },
    // 取消之后显示的页面
    marksureFun(box) {
      this.showList = false;
    },
    // 成功添加之后的返回
    addAndUpdateFun(box) {
      this.initData();
      this.showList = false;
    },

    initData() {
      _request.http(this, "question/getBankList", this.cur).then(res => {
        this.getListData = res.data.bank_list;
        this.totalCount = res.data.total;
        this.nextPage = parseInt(res.data.page);
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
    }
  }
};
</script>
<style scoped lang="less">
.topHead {
  position: relative;
  padding-bottom: 15px;
  .mulu {
    display: inline-block;
    margin-left: 25px;
    height: 45px;
    line-height: 45px;
  }
  .gengxinbox {
    float: right;
    margin-right: 25px;
    .time {
      font-size: 12px;
      color: rgba(153, 153, 153, 1);
      margin-right: 20px;
    }
  }
}
.addBox {
  position: relative;
  float: left;
  width: 320px;
  height: 396px;
  border: 0;
  outline: none;
  margin: 0 25px 50px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 9px 1px rgba(38, 164, 253, 0.1);
  text-align: center;

  .add-content {
    width: 70px;
    height: 70px;
    line-height: 70px;
    margin-top: 150px;
    display: inline-block;
    font-size: 80px;
  }
}
.listbox {
  float: left;
  width: 319px;
  height: 396px;
  background: #fff;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 9px 1px rgba(38, 164, 253, 0.1);
  margin: 0 25px 50px;
  .box-head {
    text-align: right;
    padding: 10px 20px;
    min-height: 40px;
    .bg-red {
      width: 30px;
      height: 30px;
      background: rgb(255, 255, 255);
      border: 1px solid rgba(233, 233, 233, 1);
      box-shadow: 0px 0px 5px 0px rgba(0, 9, 64, 0.1);
      border-radius: 50%;
      color: rgba(255, 63, 63, 1);
      &:hover,
      &:focus,
      &:active,
      &:visited {
        color: #fff;
        background: rgba(255, 63, 63, 1);
        border: 1px solid rgba(233, 233, 233, 1);
        box-shadow: 0px 0px 5px 0px rgba(255, 0, 0, 0.1);
        border-radius: 50%;
      }
    }
    .bg-blue {
      width: 30px;
      height: 30px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(233, 233, 233, 1);
      box-shadow: 0px 0px 5px 0px rgba(0, 9, 64, 0.1);
      border-radius: 50%;
      color: rgba(38, 164, 253, 1);
      &:hover,
      &:focus,
      &:active,
      &:visited {
        color: #fff;
        background: rgba(38, 164, 253, 1);
        border: 1px solid rgba(233, 233, 233, 1);
        box-shadow: 0px 0px 5px 0px rgba(38, 164, 253, 0.1);
        border-radius: 50%;
      }
    }
  }
  .box-title {
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
    height: 50px;
    margin: 18px 24px 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .box-subTitle {
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
    margin: 0 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .box-content {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid #e1e1e1;
    text-align: center;
    font-size: 12px;
    color: rgba(102, 102, 102, 1);
    p {
      height: 17px;
      line-height: 17px;
      margin-bottom: 20px;
      span {
        margin: 0 5px;
      }
    }
    .kemu {
      color: #333;
      font-size: 18px;
      font-weight: bold;
    }
    .shijuan {
      color: #333;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .box-footer {
    display: flex;
    justify-content: center;
    padding-top: 5px;
  }
  .ml {
    margin: 0 25px;
  }
}

.content-box {
  padding: 15px 22px 0 !important;
}

.kecheng-box {
  position: relative;
  .type-list {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .kechengs {
    position: relative;
    display: inline-block;
    width: 260px;
    margin: 0 25px;
    font-size: 12px;
    margin-bottom: 36px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 9px 1px rgba(38, 164, 253, 0.1);
    .tuijian {
      position: absolute;
      top: 0;
      right: 0;
      background: rgba(0, 0, 0, 0);
      width: 50px;
      height: 50px;
      border-bottom-left-radius: 50px;
      padding-top: 6px;
      padding-left: 22px;
      font-size: 18px;
      color: transparent;
      cursor: pointer;
      &:hover {
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
      }
      &.active {
        color: #ffa800;
        background: rgba(0, 0, 0, 0.6);
      }
    }
  }
  .kecheng-status {
    position: relative;
    margin-top: -40px;
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    background: rgba(0, 0, 0, 0.7);
    height: 40px;
    line-height: 40px;

    .shangjia {
      margin-left: 10px;
    }
    .zhibo {
      position: absolute;
      right: 60px;
      cursor: pointer;
      &:hover {
        color: #ffa800;
      }
    }
    .lubo {
      position: absolute;
      right: 10px;
      cursor: pointer;
      &:hover {
        color: #ffa800;
      }
    }
  }

  .kecheng-detail {
    margin: 0 10px;
    .kecheng-title {
      height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 16px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin: 20px 0 16px;
    }
    .jiage {
      color: #ff0000;
    }
    .shangxian {
      margin-top: 18px;
    }
    .renshu {
      color: #1cc700;
    }
    .seeDetail {
      float: right;
      width: 73px;
      height: 30px;
      line-height: 30px;
      margin-top: 20px;
      margin-bottom: 10px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(224, 224, 224, 1);
      border-radius: 2px;
      font-size: 12px;
      color: rgba(102, 102, 102, 1);
    }
  }
}
/deep/ .el-tabs__nav.is-top {
  left: 45%;
}
/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
  background-color: #e0e0e0;
  z-index: 1;
}
.el-icon-circle-plus {
  color: #b8b8b8;
  width: 70px;
  height: 70px;
}
</style>
