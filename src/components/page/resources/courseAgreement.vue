<template>
  <div class="container-box">
    课程协议
  </div>
</template>
<script>
import _request from "@/utils/request";
import { testPostImage } from "@/utils/index.js";
import { checkEnACharac4, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  data() {
    return {
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
        id:'',
        subject_name: "",
        description: "",
        subject_cover: "",
        
      },
      subject_cover:'',
      addItemVal:'',
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
    updateSub(item, index, subIndex,nature) {
      if(nature){
        this.$message.error('授权课程不可修改');
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
    addXiaolei(e,nature) {
      if(nature){
        this.$message.error('授权课程不可修改');
        return;
      }
      e.target.previousElementSibling.style.display = 'flex';
      e.target.previousElementSibling.firstChild.value='';
    },
    closeAddItem(e) {
      // console.log(e.currentTarget.parentNode.parentNode);
     e.currentTarget.parentNode.parentNode.style.display = 'none';
    },
    // 添加小类
    addItem(e,parent_id){
      var subject_name = e.currentTarget.parentNode.previousElementSibling.value;
      _request
        .http(this, "coursesubject/subjectAdd", { parent_id: parent_id, subject_name: subject_name })
        .then(res => {
          if (res.code == 200) {
            this.initData();
            e.target.parentNode.parentNode.parentNode.style.display = 'none';
          } else {
            alert(res.msg);
          }
        });
    },
    updateSubItem(parent_id, id, subject_name, item, index, subIndex) {
      // debugger
      if(!subject_name){
        this.$message({
          type:'warning',
          message:'请输入小类名称。'
        })
        return;
      }
      _request
        .http(this, "coursesubject/subjectUpdate", {  id: id, subject_name: subject_name })
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
          _request.http(this, "coursesubject/subjectForStatus", { id: id }).then(res => {
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
      if(nature){
        this.$message.error('授权课程不可修改');
        return;
      }
      var text = type == 1 ? "科目" : "小节";
      this.$confirm("删除该" + text + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request.http(this, "coursesubject/subjectDel", { id: id }).then(res => {
            if (res.code == 200) {
              this.initData();
            } else {
              alert(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    updateSubjectFun(item){
      this.addData = JSON.parse(JSON.stringify(item));
      this.addData = {
        id:item.id,
        subject_name: item.name,
        description: item.description,
        subject_cover: item.cover,
      }
      this.subject_cover = item.cover;
      this.showDialog = true;
    },
    dialogMarksure() {
      this.$refs.addDataForm.validate(valide => {
        if (valide) {
          if (this.addData.id) {
            // 修改
            _request.http(this, "coursesubject/subjectUpdate", this.addData).then(res => {
              if (res.code == 200) {
                this.showDialog = false;
                this.initData();
              }
            });
          } else {
            _request.http(this, "coursesubject/subjectAdd", this.addData).then(res => {
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
    changeStatus(id,open) {
      _request.http(this, "coursesubject/subjectForStatus", { id: id }).then(res => {
        this.initData();
        if (res.code == 200) {
          // this.showDialog = false;
           
        }else{

        }
      });

      // 修改状态
      // console.log(row.is_forbid);
    },
    showLubo() {},

    addSubject() {
      this.showDialog = true;
      this.addData = {
        id:'',
        subject_name: "",
        description: "",
        subject_cover: "",
      }
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
        this.dataList = res.data;
        for(let item in this.dataList){
          for(let subItem in (item.childs)){
            subItem.readOnly = false;
          }
        }
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
/deep/ .inputstyle{
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
