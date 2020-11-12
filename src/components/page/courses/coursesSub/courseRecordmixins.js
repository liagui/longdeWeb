
import _request from "@/utils/request";
export const courseRecordmixins ={  
  methods: {    
    // 保存章信息
    saveChapter() {
      if (this.is_nature) {
        this.$message.error("授权课程不可修改");
        return;
      }
      this.$refs.addChapter.validate((valide) => {
        if (valide) {
          if (this.isAppendData) {
            // 新增数据
            console.log(this.addChapter);
            this.addChapter.id = "";
            _request
              .http(this, "course/chapterAdd", this.addChapter)
              .then((res) => {
                if (res.code == 200) {
                  this.initData();
                  this.addChapter.name = "";
                  this.$toast("新增成功。");
                }
              });
          } else {
            _request
              .http(this, "course/chapterUpdate", this.addChapter)
              .then((res) => {
                if (res.code == 200) {
                  this.addChapter.name = "";
                  this.$toast("更新成功。");
                  this.initData();
                }
              });
          }
        } else {
          return false;
        }
      });
    },
    // 保存二级目录、节信息
    saveSubsection() {
      if (this.is_nature) {
        this.$message.error("授权课程不可修改");
        return;
      }
      this.$refs.addData.validate((valide) => {
        if (valide) {
          if (this.addData.id) {
            // 更新
            _request
              .http(this, "course/sectionUpdate", this.addData)
              .then((res) => {
                if (res.code == 200) {
                  this.$message({
                    type: "success",
                    message: "修改成功。",
                  });
                  this.initData();
                }
              });
          } else {
            _request
              .http(this, "course/sectionAdd", this.addData)
              .then((res) => {
                if (res.code == 200) {
                  this.$message({
                    type: "success",
                    message: "添加成功。",
                  });
                  this.initData();
                }
              });
          }
        }
      });
    },    
  
    removeTree(node, data) {
      if (this.is_nature) {
        this.$message.error("此课程是授权课程不能修改");
        return;
      }
      this.$confirm("删除该章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _request
            .http(this, "course/chapterDel", {
              id: data.id,
              course_id: data.course_id,
            })
            .then((res) => {
              if (res.code == 200) {
                this.initData();
              }
            });
        })
        .catch(() => {});
    },
    updateTree(node, data, flag) {
      console.log(node);
      console.log(data);

      // this.isAppendData = !flag;
      // 一级
      if (node.level == 1) {
        // flag:1 新增节 0 修改章
        if (flag == 1) {
          // this.addData.pid = data.id;
          // this.addData.id = '';
          this.addData = {
            course_id: this.transData.id,
            type: 1,
            name: "",
            filearr: [],
            is_free: 0,
            resource: "",
            chapter_id: data.id,
            id: "",
            video_id: "",
          };
          this.isChapter = false;
          this.isSubsection = true;
          // this.$refs.addData.clearValidate();
        } else {
          // 修改章
          this.isChapter = true;
          this.isAppendData = false;
          this.isSubsection = false;
          this.addChapter.id = data.id;
          this.addChapter.name = data.name;
          // this.$refs.addChapter.clearValidate();
        }
      } else {
        // 点击二级目录
        this.isChapter = false;
        this.isSubsection = true;
        // this.$refs.addData.clearValidate();
        this.addData = data;
        _request
          .http(this, "course/sectionFirst", { section_id: data.id })
          .then((res) => {
            this.addData = res.data;
            this.transFile = res.data.filearr;
          });
      }
    },

    renderContent(h, { node, data, store }) {
      // console.log(node);
      if (node.level == 1) {
        return (
          <span class="custom-tree-node">
            <span
              class="treeWidth"
              on-click={() => this.updateTree(node, data, 0)}
            >
              {node.label}
            </span>
            <span class="treebtn" style="width:63px;margin-left:10px;">
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
            <span
              class="treeWidth"
              on-click={() => this.updateTree(node, data)}
            >
              {node.label}
            </span>
            <span class="treebtn" style="width:40px;margin-left:10px;">
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
  },
};
