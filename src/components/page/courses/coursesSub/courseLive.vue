<template>
  <div class="container-box">
    <div class="kecheng-head">
      <el-row>
        <el-col :span="18">
          <div class="head-label">
            <div class="labelTit">课程名称</div>
            <div class="labelText">{{ transData.title }}</div>
          </div>
          <div class="head-label">
            <div class="labelTit">授课类型</div>
            <div class="labelText">
              <span
                v-for="(item, index) in transData.method"
                :key="index"
                style="margin-right: 10px"
                >{{ methods[item] }}</span
              >
            </div>
          </div>
          <div class="head-label">
            <div class="labelTit">价格</div>
            <div class="labelText">{{ transData.pricing }}</div>
          </div>
        </el-col>
        <el-col :span="6" class="classStatus" style="text-align: right">
          <el-button
            @click="paikeFun(2)"
            class="sub-btn"
            v-if="showUnitCourse"
            type="primary"
            >排课</el-button
          >
          <el-button @click="paikeFun(1)" class="sub-btn" v-else type="primary"
            >课程单元</el-button
          >
          <el-button
            @click="postFun(courseStatus)"
            class="sub-btn"
            type="primary"
            v-text="courseStatus == 1 ? '下架' : '发布'"
          ></el-button>
        </el-col>
      </el-row>
    </div>

    <div class="kecheng-content" v-if="showUnitCourse">
      <el-row class="height-calc">
        <!-- 章节列表 -->
        <el-col :span="10" class="height-calc">
          <div class="content-left">
            <div class="numUnit">总课程单元数：{{ classTotalNum }}个</div>
            <div class="unitBtn">
              <el-button
                type="primary"
                @click="screen = !screen"
                size="small"
                plain
                >课程单元筛选</el-button
              >
              <el-button type="primary" @click="courseUnit" size="small" plain
                >课程单元管理</el-button
              >
            </div>
            <div>
              <el-form :model="searchData" ref="searchData" :inline="true">
                <el-form-item
                  v-show="screen"
                  style="margin: 15px 0 0"
                  label="课程分类："
                  prop="parent"
                >
                  <el-cascader
                    style="width: 220px"
                    v-model="searchData.parent"
                    collapse-tags
                    :options="subjectArr"
                    clearable
                    @change="initData"
                    :props="{
                      checkStrictly: true,
                      value: 'id',
                      label: 'name',
                      children: 'childs',
                      expandTrigger: 'hover',
                    }"
                  ></el-cascader>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <div
                class="listItem"
                v-for="(item, index) in dataList"
                :key="item.id"
              >
                <div class="itemcont">{{ item.name }}</div>
                <div>
                  <i
                    class="el-icon-edit-outline"
                    @click="contentEditFun(item)"
                  ></i>
                  <i class="el-icon-delete" @click="contentDelete(item)"></i>
                  <i
                    class="el-icon-right"
                    @click="changeItemStatus(item, index, 1)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <!-- 右侧 -->
        <el-col :span="14" class="height-calc">
          <div class="content-right">
            <div>已加入{{ classUnitNum }}个直播课程单元</div>
            <div>
              <div
                class="listItem"
                v-for="(item, index) in beginClassList"
                :key="item.id"
              >
                <div class="itemcont">{{ item.name }}</div>
                <div>
                  <i
                    class="el-icon-back"
                    @click="changeItemStatus(item, index, 0)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <div class="foot-btn">
            <el-button @click="closeCourseLive" class="clear-btn"
              >取消</el-button
            >
            <el-button @click="marksureFun" class="sub-btn">保存</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <cousrse-class
        :transData="transUnitData"
        :transUnitDataNature="transUnitDataNature"
        @clearFun="clearFun"
      ></cousrse-class>
    </div>

    <!-- 修改内容 -->
    <el-dialog
      title="编辑直播课程单元"
      :close-on-click-modal="false"
      :visible.sync="showEditBox"
      width="60%"
      @close="showEditBox = false"
      center
    >
      <div class="formbox">
        <el-row class="editHead">
          <el-col :span="12">所属学科： {{ diaparent_name }}</el-col>
          <el-col :span="12">学科小类： {{ diachild_name }}</el-col>
        </el-row>

        <el-form
          :model="addData"
          :rules="rule"
          label-width="120px"
          ref="addData"
        >
          <el-form-item label="课程单元名称：" prop="name">
            <el-input
              placeholder="课程单元名称"
              v-model="addData.name"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="课程单元介绍：" prop="introduce">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="课程单元介绍"
              v-model="addData.introduce"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="cancelFun" class="clear-btn">取消</el-button>
        <el-button @click="updateLiveMess" class="sub-btn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _request from "@/utils/request";
import courseClass from "./courseLiveClass";
import store from "@/store/index";
// import comDialog from "../../globalComponents/dialog/dialog";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components: {
    "cousrse-class": courseClass,
    // "com-dialog": comDialog
  },
  // props: ["transData"],
  data() {
    return {
      transData: {},
      methods: ["", "直播", "录播", "其他"],
      nature: this.$route.query.nature,
      transUnitDataNature: "",
      radio: "",
      showUnitCourse: true,
      showEditBox: false,
      transUnitData: "",
      schoolBranch: [],
      fileUploadPath: this.GLOBAL.postImgUrl,
      fileList: [],
      subjectArr: [],
      courseStatus: 0,
      screen: false,
      dataList: [],
      beginClassList: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      isChapter: false,
      isSubsection: false,
      searchData: {
        parent: [],
      },
      payInfos: [],
      addData: {
        id: "",
        introduce: "",
        name: "",
      },
      diachild_name: "",
      diaparent_name: "",
      rule: {
        // userNameOrPhoneNo: [{ validator: checkCharacters, trigger: "blur" }],
        name: [
          { required: true, message: "请输入课程单元名称", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "请输入课程单元介绍", trigger: "blur" },
        ],
      },
      classUnitNum: 0,
      classTotalNum: 0,
    };
  },
  mounted() {
    this.initData();
    this.getDetail();
    this.getSubjectList();
  },
  methods: {
    getDetail() {
      _request
        .http(this, "course/courseFirst", {
          id: this.$route.query.id,
          nature: this.$route.query.nature,
        })
        .then((res) => {
          if (res.code == 200) {
            this.transData = res.data;
            this.courseStatus = res.data.status;
          }
        });
    },
    clearFun() {
      this.showUnitCourse = true;
    },
    paikeFun(type) {
      // 展示排课页面
      if (type == 2) {
        this.transUnitData = this.$route.query.id;
        this.transUnitDataNature = this.nature;
        // 点击排课 保存排课内容
        var idArr = [];
        var addUnitList = this.beginClassList;
        for (var i = 0; i < addUnitList.length; i++) {
          idArr.push(addUnitList[i]["id"]);
        }
        _request
          .http(this, "course/liveToCourse", {
            id: idArr,
            course_id: this.$route.query.id,
          })
          .then((res) => {
            this.showUnitCourse = false;
          });
      } else {
        this.showUnitCourse = true;
      }
    },
    courseUnit() {
      let isZongKong = this.$store.state.school_status == 1; //总控1 中控0
      let hrefStr = isZongKong ? "/#/resourceGeneral/generalliveresource": "/#/resources/liveResource";
      let href = window.location.origin + hrefStr;
      window.open(href, "_blank");
    },
    handleClose() {
      this.showEditBox = false;
    },
    contentDelete(item) {
      if (this.nature == 1) {
        this.$message.error("授权课程不可修改");
        return;
      }
      this.$confirm("删除该单元, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request
            .http(this, "course/liveCoursesDel", { id: item.id })
            .then((res) => {
              if (res.code == 200) {
                this.initData();
              }
            });
        })
        .catch((data) => {});
    },
    contentEditFun(item) {
      if (this.nature == 1) {
        this.$message.error("授权课程不可修改");
        return;
      }
      this.showEditBox = true;
      this.addData.id = item.id;
      this.addData.name = item.name;
      this.diaparent_name = item.parent_name;
      this.diachild_name = item.chind_name;
      this.addData.introduce = item.introduce;
    },

    // 移入移出
    changeItemStatus(item, index, type) {
      if (this.nature == 1) {
        this.$message.error("授权课程不可修改");
        return;
      }
      if (type == 1) {
        // 移入到正在播放课程
        this.dataList.splice(index, 1);
        this.beginClassList.push(item);
        this.classUnitNum++;
        this.classTotalNum--;
      } else {
        // 移出
        this.beginClassList.splice(index, 1);
        this.dataList.unshift(item);
        this.classUnitNum--;
        this.classTotalNum++;
      }
    },
    getSubjectList() {
      _request.http(this, "subject").then((res) => {
        this.subjectArr = res.data;
      });
    },
    cancelFun() {
      this.showEditBox = false;
      // this.$emit("closeFun", 1);
    },
    closeCourseLive() {
      // this.$emit("closeFun", 1);
      this.$router.go(-1);
    },
    // 关联直播单元
    marksureFun() {
      if (this.nature == 1) {
        this.$message.error("授权课程不可修改,可以查看具体排课");
        return;
      }
      this.showEditBox = false;
      var idArr = [];
      var addUnitList = this.beginClassList;
      for (var i = 0; i < addUnitList.length; i++) {
        idArr.push(addUnitList[i]["id"]);
      }
      _request
        .http(this, "course/liveToCourse", {
          id: idArr,
          course_id: this.$route.query.id,
          nature: this.nature,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$toast("已成功关联直播单元,点击‘排课’选择课次");
          }
        });
    },
    // 修改课程单元信息
    updateLiveMess() {
      this.$refs.addData.validate((valid) => {
        if (valid) {
          _request
            .http(this, "course/liveCoursesUp", this.addData)
            .then((res) => {
              this.showEditBox = false;
              this.initData();
            });
        }
      });
    },
    workSchedule() {},
    // 发布、下架
    postFun(type) {
      var typeVal = type == 1 ? 2 : 1;
      var typeText = type == 1 ? "下架" : "发布";
      this.$confirm(typeText + "该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request
            .http(this, "course/courseUpStatus", {
              id: this.$route.query.id,
              status: typeVal,
              nature: this.nature,
            })
            .then((res) => {
              if (res.code == 200) {
                this.courseStatus = typeVal;
              }
            });
        })
        .catch((data) => {});
    },
    initData() {
      _request
        .http(this, "course/liveCourses", this.searchData, {
          course_id: this.$route.query.id,
          nature: this.$route.query.nature,
        })
        .then((res) => {
          this.dataList = res.livecast;
          this.classTotalNum = res.livecast.length;
          this.beginClassList = res.existlive;
          this.classUnitNum = res.existlive.length;
        });
    },
  },
};
</script>
<style scoped lang="less">
.kecheng-head {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 20px 30px;
  margin: 0 25px 20px;

  .head-label {
    display: inline-block;
    height: 14px;
    margin-top: 20px;
    line-height: 14px;
    font-size: 14px;
    padding-left: 5px;
    border-left: 2px solid #409eff;

    .labelTit {
      display: inline-block;
    }
    .labelText {
      display: inline-block;
      font-size: 16px;
      color: #333;
      font-weight: bold;
      margin-left: 10px;
      margin-right: 30px;
    }
  }
}
.formbox {
  // padding-right: 20px;
  .editHead {
    // width: 100%;
    // display: flex;
    // justify-content: space-between;
    padding: 10px 20px 20px;
    // align-items: center;
    font-size: 14px;
  }
}

/deep/ .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
/deep/ .el-button--text {
  color: #999;
}
.kecheng-content {
  height: calc(100% - 200px);
  .height-calc {
    height: 100%;
  }
  .content-left {
    height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    padding: 20px;
    margin-left: 25px;
    overflow: auto;
    .button-new-tag {
      background: rgba(217, 235, 255, 1);
      border: 1px solid rgba(38, 164, 253, 1);
      border-radius: 3px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 149, 254, 1);
      margin-bottom: 15px;
    }
    .numUnit {
      display: inline-block;
      height: 20px;
      font-size: 16px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin-top: 5px;
    }

    .unitBtn {
      float: right;
    }
    /deep/ .el-button + .el-button {
      margin: 0;
    }
    /deep/ .el-select > .el-input {
      width: 130px;
    }
  }
  .listItem {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid rgba(227, 227, 227, 1);
    border-radius: 5px 5px 5px 5px;
    margin-top: 14px;
    transition: 0.3s;
    .itemcont {
      width: calc(100% - 90px);
      font-size: 14px;
      color: rgba(102, 102, 102, 1);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .content-right {
    position: relative;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    padding: 10px 30px 20px;
    margin: 0 25px;
    overflow: auto;
    .subTitle {
      font-size: 20px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin: 40px 0;
    }
  }
}
.text-center {
  text-align: center;
}
.foot-btn {
  text-align: right;
  padding: 20px 35px 0 0;
}

.width-400 {
  width: 380px;
}
/deep/ .el-upload--text {
  border: 0;
}
/deep/ .el-icon-right,
.el-icon-back {
  border: 0;
  color: #28a745;
  font-weight: bold;
}
/deep/ .el-icon-delete {
  border: 0;
  color: #dc3545;
  font-weight: bold;
}
/deep/ .el-icon-edit-outline {
  border: 0;
  color: #ffc107;
  font-weight: bold;
}
.paike {
  .paike-head {
    font-size: 16px;
    margin-left: 25px;
  }
  .paike-content {
    display: flex;
    align-items: center;
    padding: 15px 0;
    background: #fff;
    margin: 5px 25px;
    .item-head {
      font-size: 16px;
      margin: 0 10px;
      text-align: center;
      font-weight: bold;
    }
    .item-center {
      flex: 1;
      border-left: 1px solid #e9e5ea;
      border-right: 1px solid #e9e5ea;
      padding: 0 10px;
      .item-cont {
        margin-top: 10px;
        .banhao-name {
          font-weight: bold;
          height: 30px;
          line-height: 30px;
        }
        .banhao-Desc {
          padding-left: 24px;
          font-size: 12px;
        }
      }
    }
    .item-right {
      width: 100px;
      text-align: center;
    }
  }
}

.tooltip-mess {
  width: 300px;
  padding-right: 20px;
}
</style>
