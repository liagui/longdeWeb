<template>
  <div class="tool">
    <el-title title="配置信息"></el-title>
    <div class="option-item">
      <div class="label">名称：</div>
      <el-input v-model="optionData.optionName"></el-input>
    </div>
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
        :multiple="configModel ? true : false"
        :multiple-limit="configModel"
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
    <div class="tool-button">
      <el-button @click="saveOption" color="#ee7f58">保存配置</el-button>
    </div>
  </div>
</template>

<script>
import elTitle from "../../component/el-title";
import * as API_schoolSet from "@/api/schoolSet";
import mixin from "../common/mixin.js";
export default {
  name: "imgEdit",
  props: ["blockData", "configModel"],
  mixins: [mixin],
  data() {
    return {
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
    };
  },
  mounted() {
    this.getSubject();
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
      this.saveOption();
    },
  },
};
</script>
<style lang="less" scoped>
@import "../common/tpl.css";
.el-input {
  width: 300px;
}
</style>