<template>
  <div class="container-box">
    <div class="clearfix" v-if="showList">
      <!-- <div class="topHead">
        <div class="mulu">题库目录</div>
        <div class="gengxinbox">
          <span class="time">最后更新时间：2020-5-10 14：00</span>
          <el-button class="sub-btn">更新题库</el-button>
        </div>
      </div>-->
      <!-- <cardDragger :data="dataList" @finishDrag="finishDrag">
        <template v-slot:header="slotProps">
          <div class="topMenuBox">
            <div class="menuTitle" v-if="slotProps.item.name">{{slotProps.item.id}}</div>
            <div class="menuTitle" v-else>默认标题</div>
          </div>
        </template>
        <template v-slot:content="slotProps">
          <div>1111111111111</div>
        </template>
      </cardDragger>-->
      <div style="margin: 10px 0">
        <div class="gridly">
          <div class="addBox" @click="addSubject">
            <div class="add-content">
              <i class="el-icon-circle-plus"></i>
            </div>
          </div>
          <div class="listbox" v-for="(item, index) in dataList" :key="index" :data-index="item.id">
            <div class="box-head">
              <button class="bg-red" :disabled="item.nature_status" @click="deleteSub(item.id, 1)">
                <i class="el-icon-delete"></i>
              </button>
              <button
                class="bg-blue"
                :disabled="item.nature_status"
                @click="updateSubjectFun(item)"
              >
                <i class="el-icon-edit-outline"></i>
              </button>
            </div>
            <div class="box-title">{{ item.name }}</div>
            <div class="box-subTitle">{{ item.description }}</div>
            <div class="box-content" ref="xiaoleiBox">
              <div
                class="item-list form-none"
                v-for="(subItem, subIndex) in item.childs"
                :key="subIndex"
              >
                <!-- @blur="clearUpdate(subItem,index,subIndex)" -->
                <el-input
                  ref="inputLabel"
                  v-model="subItem.name"
                  :readonly="!subItem.readOnly"
                  :class="{ 'form-none-active': subItem.readOnly }"
                ></el-input>
                <div v-if="subItem.readOnly">
                  <el-button
                    type="text"
                    :disabled="item.nature_status"
                    @click="updateSubItem(item.id, subItem.id, subItem.name)"
                  >确定</el-button>
                  <el-button type="text" @click="clearUpdate(subItem, index, subIndex)">取消</el-button>
                </div>
                <div v-else>
                  <i
                    class="el-icon-delete color-gray"
                    @click="deleteSub(subItem.id, 0, item.nature_status)"
                  ></i>
                  <i
                    class="el-icon-edit-outline color-gray"
                    @click="
                    updateSub(subItem, index, subIndex, item.nature_status)
                  "
                  ></i>
                  <el-switch
                    v-model="subItem.is_open"
                    :disabled="item.nature_status"
                    @change="changeStatus(subItem.id, subItem.is_open)"
                    active-color="#eee"
                    :active-value="1"
                    :inactive-value="0"
                    inactive-color="#13ce66"
                  ></el-switch>
                </div>
              </div>
              <div class="item-list form-none display-none">
                <input ref="input" class="inputstyle form-none-active" />
                <div>
                  <el-button
                    type="text"
                    :disabled="item.nature_status"
                    @click="addItem($event, item.id)"
                  >确定</el-button>
                  <el-button
                    type="text"
                    :disabled="item.nature_status"
                    @click="closeAddItem($event)"
                  >取消</el-button>
                </div>
              </div>
              <div class="item-list addXiaolei" @click="addXiaolei($event, item.nature_status)">添加小类</div>
            </div>

            <div class="box-footer">
              <el-button
                style="width: 100%"
                :disabled="item.nature_status"
                @click="changeSubjectStatus(item.id, '开启')"
                v-if="item.is_open == 1"
                type="danger"
              >关闭</el-button>

              <el-button
                type="primary"
                :disabled="item.nature_status"
                @click="changeSubjectStatus(item.id, '关闭')"
                v-else
                style="width: 100%"
              >开启</el-button>
            </div>
          </div>
        </div>
      </div>

      <el-dialog
        :title="this.addData.id ? '修改学科' : '添加学科'"
        :close-on-click-modal="false"
        :visible.sync="showDialog"
        width="650px"
        @close="showDialog = false"
        center
      >
        <div class="form-box">
          <el-form
            :model="addData"
            label-width="120px"
            ref="addDataForm"
            :rules="addRule"
            :inline="true"
          >
            <el-row>
              <el-form-item label="学科名称：" style="margin-top: 10px" prop="subject_name">
                <el-input
                  v-model="addData.subject_name"
                  style="width: 400px !important"
                  placeholder="请输入学科名称"
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="学科描述：" style="margin-top: 10px" prop="description">
                <el-input
                  v-model="addData.description"
                  type="textarea"
                  :row="5"
                  style="width: 400px"
                  placeholder="请输入学科描述"
                  clearable
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="学科封面：" prop="subject_cover" style="margin-top: 10px">
                <el-upload
                  class="avatar-uploader"
                  ref="uploadFile"
                  :action="fileUploadPath"
                  :show-file-list="false"
                  :headers="setHead"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  style="display: inline-block"
                >
                  <img v-if="addData.subject_cover" :src="subject_cover" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <!-- <el-button v-else slot="trigger" size="small" type="primary">选取图片</el-button> -->
                </el-upload>
              </el-form-item>
            </el-row>
            <el-form-item>
              <!-- <el-button type="primary" @click="search">查询</el-button> -->
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="clear-btn" @click="showDialog = false">取 消</el-button>
          <el-button class="sub-btn" type="primary" @click="dialogMarksure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import { cardDragger } from "carddragger";
import "@/assets/js/jquery.gridly";
import _request from "@/utils/request";
import { testPostImage } from "@/utils/index.js";
import { checkEnACharac4, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components: {
    // cardDragger
  },
  data() {
    return {
      idList: [],
      columns: null,
      cardList: [],
      courseAddBox: false,
      showLuboBox: false,
      showZhiboBox: false,
      showList: this.$store.state.SecHeadClick,
      payment: {
        status: "",
        userNameOrPhoneNo: "",
        payNo: ""
      },
      fileUploadPath: this.GLOBAL.postImgUrl,
      setHead: this.GLOBAL.setHead(),
      showDialog: false,
      dataList: [],
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20
      },
      nextPage: 1,
      totalCount: 20,
      addData: {
        id: "",
        subject_name: "",
        description: "",
        subject_cover: ""
      },
      subject_cover: "",
      addItemVal: "",
      addRule: {
        subject_name: [
          { required: true, message: "请输入学科名称", trigger: "blur" },
          { validator: checkEnACharac4, trigger: "blur" }
        ],
        description: [{ validator: checkEnACharac4, trigger: "blur" }]
      },
      searchData: {}
    };
  },
  created() {
    this.initData();
    // this.getPayChannels();
    // console.log(this.$store.state.SecHeadClick);
  },
  watch: {
    showList() {
      this.$bus.$on("clickSecHead", data => {
        console.log(data);
        this.showList = data;
      });
    }
  },
  methods: {
    reordering(aa) {},
    reordered($elements) {
      this.idList = [];
      for (var item of $elements) {
        this.idList.push({
          scenicId: item.getAttribute("data-index")
        });
      }
      this.idList.map((item, index) => {
        item.showOrder = index;
        return item;
      });
      let paramIdList = this.idList
        .map(item => item.scenicId)
        .filter(item => item != null);
      _request
        .http(this, "coursesubject/subjectListSort", { id: paramIdList })
        .then(res => {});
    },
    init() {
      var bodyW = document.body.clientWidth - 240;
      this.columns = bodyW / 25;
      $(".gridly").gridly({
        base: 1, // px
        gutter: 30, // px
        columns: this.columns,
        callbacks: { reordering: this.reordering, reordered: this.reordered }
      });
    },
    beforeAvatarUpload(file) {
      return testPostImage(file);
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.addData.subject_cover = res.data;
        this.subject_cover = URL.createObjectURL(file.raw);
      } else {
        alert(res.msg);
      }
    },
    updateSub(item, index, subIndex, nature) {
      if (nature) {
        this.$message.error("授权课程不可修改");
        return;
      }
      item.readOnly = true;
      this.$set(this.dataList[index].childs, subIndex, item);
      // this.$refs.inputLabel.focus();
    },
    clearUpdate(item, index, subIndex) {
      item.readOnly = false;
      this.$set(this.dataList[index].childs, subIndex, item);
    },
    // 添加学科小类
    addXiaolei(e, nature) {
      if (nature) {
        this.$message.error("授权课程不可修改");
        return;
      }
      e.target.previousElementSibling.style.display = "flex";
      e.target.previousElementSibling.firstChild.value = "";
    },
    closeAddItem(e) {
      // console.log(e.currentTarget.parentNode.parentNode);
      e.currentTarget.parentNode.parentNode.style.display = "none";
    },
    // 添加小类
    addItem(e, parent_id) {
      var subject_name =
        e.currentTarget.parentNode.previousElementSibling.value;
      _request
        .http(this, "coursesubject/subjectAdd", {
          parent_id: parent_id,
          subject_name: subject_name
        })
        .then(res => {
          if (res.code == 200) {
            this.initData();
            e.target.parentNode.parentNode.parentNode.style.display = "none";
          } else {
            alert(res.msg);
          }
        });
    },
    updateSubItem(parent_id, id, subject_name, item, index, subIndex) {
      // debugger
      if (!subject_name) {
        this.$message({
          type: "warning",
          message: "请输入小类名称。"
        });
        return;
      }
      _request
        .http(this, "coursesubject/subjectUpdate", {
          id: id,
          subject_name: subject_name
        })
        .then(res => {
          if (res.code == 200) {
            this.initData();
          } else {
            alert(res.msg);
          }
        });
    },
    changeSubjectStatus(id, text) {
      this.$confirm(text + "该科目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request
            .http(this, "coursesubject/subjectForStatus", { id: id })
            .then(res => {
              if (res.code == 200) {
                this.initData();
              } else {
                alert(res.msg);
              }
            });
        })
        .catch(() => {});
    },

    deleteSub(id, type, nature) {
      if (nature) {
        this.$message.error("授权课程不可修改");
        return;
      }
      var text = type == 1 ? "科目" : "小节";
      this.$confirm("删除该" + text + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request
            .http(this, "coursesubject/subjectDel", { id: id })
            .then(res => {
              if (res.code == 200) {
                this.initData();
              } else {
                alert(res.msg);
              }
            });
        })
        .catch(() => {});
    },
    updateSubjectFun(item) {
      this.addData = JSON.parse(JSON.stringify(item));
      this.addData = {
        id: item.id,
        subject_name: item.name,
        description: item.description,
        subject_cover: item.cover
      };
      this.subject_cover = item.cover;
      this.showDialog = true;
    },
    dialogMarksure() {
      this.$refs.addDataForm.validate(valide => {
        if (valide) {
          if (this.addData.id) {
            // 修改
            _request
              .http(this, "coursesubject/subjectUpdate", this.addData)
              .then(res => {
                if (res.code == 200) {
                  this.showDialog = false;
                  this.initData();
                }
              });
          } else {
            _request
              .http(this, "coursesubject/subjectAdd", this.addData)
              .then(res => {
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
    changeStatus(id, open) {
      _request
        .http(this, "coursesubject/subjectForStatus", { id: id })
        .then(res => {
          this.initData();
          if (res.code == 200) {
            // this.showDialog = false;
          } else {
          }
        });

      // 修改状态
      // console.log(row.is_forbid);
    },
    showLubo() {},

    addSubject() {
      this.showDialog = true;
      this.addData = {
        id: "",
        subject_name: "",
        description: "",
        subject_cover: ""
      };
    },
    marksureFun(box) {
      this.showList = true;
      console.log(box);
      switch (box) {
        case 1: {
          this.courseAddBox = false;
          break;
        }
        case 2: {
          this.showZhiboBox = false;
          break;
        }
        case 3: {
          this.showLuboBox = false;
          break;
        }
      }
    },

    initData() {
      _request.http(this, "subjects").then(res => {
        let data = res.data;
        for (let item in data) {
          // data[item].positionNum = data[item].id;
          // for (let subItem in item.childs) {
          //   subItem.readOnly = false;
          // }
        }
        this.dataList = [...data];
        this.$nextTick(() => {
          this.init();
        });
      });
    },

    select() {
      this.$refs.payment.validate(valid => {
        if (valid) {
          this.paginationShow = false;
          this.cur.page = 1;
          // this.searchData = this.payment;
          this.$nextTick(() => {
            this.initData();
            this.paginationShow = true;
          });
        } else {
          return false;
        }
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
  height: 580px;
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
    margin-top: 240px;
    display: inline-block;
    font-size: 80px;
  }
}
.listbox {
  position: relative;
  float: left;
  width: 319px;
  height: 580px;
  background: #fff;
  margin: 0 25px 50px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 9px 1px rgba(38, 164, 253, 0.1);

  .box-head {
    text-align: right;
    padding: 10px 20px;
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
    margin: 10px 24px 18px;
    height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // height: 50px;
    // line-height: 25px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 2;
  }
  .box-subTitle {
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
    height: 50px;
    line-height: 25px;
    margin: 0 24px 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .box-content {
    margin-top: 5px;
    padding-top: 20px;
    height: 320px;
    overflow-y: auto;
    border-top: 1px solid #e1e1e1;
    font-size: 12px;
    color: rgba(102, 102, 102, 1);
  }
  .addXiaolei {
    cursor: pointer;
    justify-content: center;
  }
  .box-footer {
    position: absolute;
    width: 100%;
    padding: 0 20px 10px;
    bottom: 10px;
  }
  .ml {
    margin-left: 50px;
  }
}
.item-list {
  display: flex;
  justify-content: space-between;
  margin: 0 20px 10px;
  height: 30px;
  line-height: 30px;
  background: rgba(248, 248, 248, 1);
  border: 1px solid rgba(228, 223, 230, 1);
  border-radius: 2px;
  padding: 0 5px;
  .color-gray {
    margin-right: 5px;
    cursor: pointer;
  }
}
.display-none {
  display: none;
}
.item-list {
  display: flex;
  justify-content: space-between;
  margin: 0 20px 10px;
  height: 30px;
  line-height: 30px;
  background: rgba(248, 248, 248, 1);
  border: 1px solid rgba(228, 223, 230, 1);
  border-radius: 2px;
  padding: 0 5px;
  .color-gray {
    margin-right: 5px;
    cursor: pointer;
  }
}
.display-none {
  display: none;
}
.addXiaolei {
  cursor: pointer;
  justify-content: center;
}
.el-icon-circle-plus {
  color: #b8b8b8;
  width: 70px;
  height: 70px;
}
/deep/ .el-input--small .el-input__inner {
  height: 29px;
  line-height: 29px;
}
/deep/ .el-input__inner,
/deep/ .el-input {
  width: 150px;
}
/deep/ .inputstyle {
  border: 1px solid rgb(220, 223, 230);
  padding-left: 12px;
  border-radius: 4px;
  outline: none;
  width: 150px;
}
/deep/ .avatar-uploader-icon {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

/deep/ .avatar {
  width: 100px;
}
</style>
