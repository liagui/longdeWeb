<template>
  <div class="tool">
    <el-title title="配置信息"></el-title>
    <div class="option-item">
      <div class="label">名称：</div>
      <el-input v-model="optionData.optionName" style="width: 300px"></el-input>
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
      <div class="label">授课类型：</div>
      <el-select v-model="optionData.method" placeholder="请选择">
        <el-option
          v-for="(item, key) in subjectTypeList"
          :key="key"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="option-item">
      <div class="label">学科小类：</div>
      <el-switch
        v-model="optionData.showChild"
        active-color="#13ce66"
        inactive-color="#ff4949"
      >
      </el-switch>
    </div>
    <div class="option-item">
      <div class="label">展示顺序：</div>
      <el-radio v-model="optionData.sort" label="2">学员数量</el-radio>
      <el-radio v-model="optionData.sort" label="1">时间</el-radio>
      <el-checkbox v-model="optionData.sort" label="3">推荐优先</el-checkbox>
    </div>

    <div class="tool-button">
      <el-button @click="searchClass" color="#ee7f58">保存配置</el-button>
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
      subjectList: [],
      subjectTypeList: [
        {
          name: "全部",
          value: "",
        },

        {
          name: "直播",
          value: "1",
        },
        {
          name: "录播",
          value: "2",
        },
        {
          name: "面授",
          value: "3",
        },
      ],
      optionData: {
        optionName: "",
        subject: {},
        showChild: false,
        method: "",
        sort: "1",
        courseList: [],
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
      });
    },
    subjectChange(item) {
      this.optionData.subject = item;
      this.searchClass();
    },
    searchClass() {
      console.log(this.optionData);
      let _params = {
        coursesubjectOne: this.optionData.subject.id,
        method: this.optionData.method,
        sort: this.optionData.sort,
        top_num: this.configModel,
      };
      API_schoolSet.getCourseList(_params).then((res) => {
        console.log(res);
        this.optionData.courseList = res;
        this.saveOption();
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import "../common/tpl.css";
</style>