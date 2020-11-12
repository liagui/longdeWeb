<template>
 <div class="form-box">
        <el-form :model="resData" ref="formBox">
          <el-form-item label="资源类型：">
            <el-select v-model="resData.resType" style="width:150px" placeholder="选择资源类型">
              <el-option
                v-for="(item, index) in resTypeArr"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传资源：">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="fileUploadPath"
              :auto-upload="false"
              :on-change="handleChange"
              :show-file-list="false"
            >
              <el-button size="small" type="primary">选择资料</el-button>
            </el-upload>
          </el-form-item>

          <el-table
            stripe
            border
            :data="fileList"
            highlight-current-row
            ref="custTable"
            cell-class-name="center"
            header-cell-class-name="center"
            height="200px"
          >
            <el-table-column label="资料名称" prop="name"></el-table-column>
            <el-table-column label="大小" prop="size"></el-table-column>
            <el-table-column label="类型" prop="type"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="del_file(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div> 
  
</template>
<script>
import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  props: ["transData"],
  components: {
  },
  data() {
    return {
      showDialog: false,
      resData: {},
      is_shouquan: this.transData.is_auth == 2,
      resTypeArr: [
        { id: 1, name: "材料" },
        { id: 2, name: "辅料" },
        { id: 3, name: "其他" }
      ],
      fileUploadPath: this.GLOBAL.postImgUrl,
      fileList: [
        {
          id: 1,
          name: "food.jpeg",
          size: "200M",
          type: "材料",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          id: 2,
          name: "food2.jpeg",
          size: "123M",
          type: "辅料",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],

      data: [],
      defaultProps: {
        children: "childs",
        label: "name"
      },
      isChapter: false,
      isSubsection: false,
      payInfos: [],
      paginationShow: true,
      cur: {
        page: 1,
        pagesize: 20,
        lesson_id: this.transData.id,
        pid: "0"
      },
      nextPage: 1,
      totalCount: 20,
      addChapter: {
        name: "",
        lesson_id: this.transData.id,
        pid: "0"
      },
      addData: {
        lesson_id: this.transData.id,
        category: '1',
        name: "",
        url: [{ name: "aa", url: "aa.jpg", size: 20, type: 1 }],
        is_free: "0",
        resource: "",
        pid: "",
        video_id: ""
      },
      chapterRule: {
        name: [{ required: true, message: "请输入章名称", trigger: "blur" }]
      },
      addDataRule: {
        name: [{ required: true, message: "请输入章名称", trigger: "blur" }]
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
      searchData: {},
      appendeData: {}, // 新增数据时存储数据
      isAppendData: Boolean
    };
  },
  created() {
    this.initData();
    // this.getSubjectList();
  },

  mounted() {
    console.log(this.transData);
  },
  methods: {
    del_file(id) {
      console.log("删除ID：" + id);
    },
    handleChange(file, fileList) {
      // this.fileList = fileList.slice(-3);
      this.fileList.push({
        id: 3,
        name: "food2.jpeg",
        size: "123M",
        type: "其他",
        url:
          "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
      });
    },
    dialogMarksure() {},
    // 保存章信息
    saveChapter() {
      this.$refs.addChapter.validate(valide => {
        if (valide) {
          if (this.isAppendData) {
            // 新增数据
            console.log(this.addChapter);
            this.addChapter.id = "";
            _request
              .http(this, "lessonChild/add", this.addChapter)
              .then(res => {
                if (res.code == 200) {
                  this.initData();
                  this.addChapter.name = '';
                  this.$toast('新增成功。')
                }
              });
          } else {
            _request
              .http(this, "updateLessonChild", this.addChapter)
              .then(res => {
                if (res.code == 200) {
                  this.addChapter.name = '';
                  this.$toast('更新成功。')
                  this.initData();
                }
              });
          }
        }else{
          return false;
        }
      });
    },
    // 保存二级目录、节信息
    saveSubsection() {
      this.$refs.addData.validate(valide => {
        if (valide) {
          if(this.addData.id){
            // 更新
            _request.http(this, "updateLessonChild", this.addData).then(res => {
              if (res.code == 200) {

                this.initData();
              }
            });
          }else{
            _request.http(this, "lessonChild/add", this.addData).then(res => {
              if (res.code == 200) {
                this.initData();
              }
            });
          }
        }
      })
      console.log(this.addData);
      
    },
    selTeacher() {
      // 上传图片
      this.$refs.upload.submit();
    },
    cancelFun() {
      // this.$emit("closeFun", 1);
    },
    marksureFun() {
      // this.$emit("closeFun", 1);
    },
    postFun() {
      this.$emit("closeFun", 1);
    },

    removeTree(node, data) {
      this.$confirm("删除该章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _request
            .http(this, "deleteLessonChild", { id: data.id })
            .then(res => {
              if (res.code == 200) {
                this.initData();
              }
            });
        })
        .catch(() => {});
      // const parent = node.parent;
      // console.log(node)
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex(d => d.id === data.id);
      // children.splice(index, 1);
    },
    updateTree(node, data, flag) {
      console.log(node);
      console.log(data);
      // this.isAppendData = !flag;
      // 一级
      if (node.level == 1) {
        // flag:1 新增节 0 修改章
        if (flag) {
          // this.addData.pid = data.id;
          // this.addData.id = '';
          this.addData = {
            lesson_id: this.transData.id,
            category: '1',
            name: "",
            url: [{ name: "aa", url: "aa.jpg", size: 20, type: 1 }],
            is_free: "0",
            resource: "",
            pid: data.id,
            id:'',
            video_id: ""
          };
          this.isChapter = false;
          this.isSubsection = true;
          this.$refs.addData.clearValidate();          

        } else {
          this.isChapter = true;
          this.isSubsection = false;
          this.addChapter.id = data.id;
          this.addChapter.name = data.name;
        }
      } else {
        // 点击二级目录
        this.isChapter = false;
        this.isSubsection = true;
        this.addData = data;     
        this.$refs.addData.clearValidate();   
      }
    },

    renderContent(h, { node, data, store }) {
      // console.log(node);
      if (node.level == 1) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.updateTree(node, data, 1)}
              >
                <i class="el-icon-plus"></i>
              </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.removeTree(node, data)}
              >
                <i class="el-icon-delete"></i>
              </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.updateTree(node, data, 0)}
              >
                <i class="el-icon-edit-outline"></i>
              </el-button>
            </span>
          </span>
        );
      } else {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.removeTree(node, data)}
              >
                <i class="el-icon-delete"></i>
              </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.updateTree(node, data)}
              >
                <i class="el-icon-edit-outline"></i>
              </el-button>
            </span>
          </span>
        );
      }
    },
    addArticle() {
      this.isChapter = true;
      this.isAppendData = true;
      this.isSubsection = false;
      this.addChapter.id = '';
      this.addChapter.name = '';
      
      console.log(this.addChapter.lesson_id);
    },

    initData() {
      _request.http(this, "lessonChild", this.cur).then(res => {
        this.data = res.data.page_data;
      });
    }
  }
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
  height: calc(100% - 180px);
  .height-calc {
    height: 100%;
  }
  .content-left {
    height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    padding: 20px 30px 20px;
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
  }
  .content-right {
    position: relative;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    padding: 10px 30px 20px;
    margin: 0 25px;
    .subTitle {
      font-size: 20px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin: 40px 0;
    }
    .Chapter {
      margin-top: 20px;
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
/deep/ .el-icon-plus {
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
</style>
