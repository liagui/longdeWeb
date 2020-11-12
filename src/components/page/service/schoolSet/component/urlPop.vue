<template>
  <el-dialog
    title="链接地址"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="handleClose"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="课程链接" name="subject">
        <div class="tool">
          <div class="option-item">
            <div class="label">学科：</div>
            <el-select
              v-model="optionData.subject"
              value-key="id"
              @change="subjectChange"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, key) in subjectList"
                :key="key"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="option-item">
            <div class="label">学科小类：</div>
            <el-select
              v-model="optionData.childSubject"
              value-key="id"
              @change="searchClass"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, key) in childSubjectList"
                :key="key"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="option-item">
            <div class="label">课程：</div>
            <el-select
              v-model="optionData.course"
              value-key="id"
              @change="selectCourse"
              placeholder="请选择"
              :multiple-limit="1"
            >
              <el-option
                v-for="(item, key) in courseList"
                :key="key"
                :label="item.title"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自定义链接" name="custom">
        <div class="custom-url">
          <div class="header">
            <div>标题</div>
            <div class="flex-2">自定义域名</div>
            <div>发布时间</div>
            <div>发布人</div>
          </div>
          <div
            class="content"
            v-for="(item, key) in customList"
            :key="key"
            @click="selectCustom(item, key)"
            :class="{ active: customIndex == key }"
          >
            <div class="item">
              {{ item.name }}
            </div>
            <div class="item flex-2">{{ item.url }}</div>
            <div class="item">{{ item.update_time.slice(0, 10) }}</div>
            <div class="item">{{ item.admin_name }}</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="setNavigationUrl">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as API_schoolSet from "@/api/schoolSet";

export default {
  props: ["show", "data"],
  data() {
    return {
      dialogVisible: false,
      activeName: "subject",
      optionData: {
        optionName: "",
        subject: {},
        childSubject: {},
        course: {},
      },
      subjectList: [],
      childSubjectList: [],
      courseList: [],
      //课程查询
      _params: {
        method: 0,
        status: 0,
        nature: 0,
        top_num: 2,
      },
      //自定义链接
      costomUrl: "",
      customList: [],
      customIndex: "0",
    };
  },
  watch: {
    show(value) {
      this.getSubject();
      this.getList();
      this.dialogVisible = value;
    },
  },
  mounted() {
    // this.getSubject();
    // this.getList();
  },
  methods: {
    getSubject() {
      API_schoolSet.getSubject().then((res) => {
        this.subjectList = res;
        const { subject = {}, childSubject } = this.optionData;
        this.childSubjectList = subject.childs ? subject.childs : {};
        if (subject.id && childSubject.id) {
          this.searchClass();
        }
      });
    },
    getList() {
      let _params = {
        page_type: 1,
        pagesize: 5,
      };
      API_schoolSet.customPageList(_params).then((res) => {
        console.log(res);
        this.customList = res.list;
      });
    },
    subjectChange(item) {
      this.childSubjectList = item.childs;
    },
    searchClass(item) {
      let _params = {
        coursesubjectOne: this.optionData.subject.id,
        coursesubjectTwo: this.optionData.childSubject.id,
        ...this._params,
      };
      API_schoolSet.getCourseList(_params).then((res) => {
        this.courseList = res;
      });
    },
    selectCourse(course) {
      this.optionData.course = course;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 自定义链接
    selectCustom(item, index) {
      this.costomUrl = item.url;
      this.customIndex = index;
      this.setNavigationUrl();
    },
    handleClose(done) {
      this.dialogVisible = false;
      this.$emit("close");
    },
    setNavigationUrl() {
      if (this.activeName == "subject") {
        if (this.optionData && this.optionData.course) {
          this.$emit(
            "changeUrl",
            `/onlineStudent/lesson?id=${this.optionData.course.id}`
          );
          this.$toast("保存成功");
        } else {
          this.$toast("fail");
        }
      } else if (this.activeName == "custom") {
        this.$emit("changeUrl", `/custom/${this.costomUrl}`);
      } else {
        this.$toast("fail");
      }
      this.handleClose();
    },
  },
};
</script>

<style lang="less" scoped>
.option-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666666;
  height: 50px;
}
.option-item .label {
  flex-shrink: 0;
  width: 75px;
  text-align: right;
}
.option-item .el-radio {
  margin-top: 7.5px;
}
.option-item .el-input {
  width: 100%;
  min-width: 200px;
}
.option-item .el-slider {
  width: 400px;
}
.option-item /deep/ .el-upload--text {
  border: none;
}
/* tool-button */
.tool-button {
  margin-top: 75px;
  padding-right: 30px;
  display: flex;
  justify-content: flex-end;
}
.tool-button .el-button {
  border-color: #ee7f58;
  background-color: #ee7f58;
  color: #fff;
}

.custom-url {
  padding: 15px;
  .header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    box-shadow: 0px 0px 9px 1px rgba(0, 26, 44, 0.1);
    border-radius: 4px;
    div {
      text-align: center;
      flex: 1;
    }
    .flex-2 {
      flex: 2;
    }
  }
  .content {
    display: flex;
    align-items: center;
    height: 50px;
    cursor: pointer;
    &.active {
      color: red;
    }
    .item {
      text-align: center;
      flex: 1;
    }
    .flex-2 {
      flex: 2;
    }
  }
}
</style>