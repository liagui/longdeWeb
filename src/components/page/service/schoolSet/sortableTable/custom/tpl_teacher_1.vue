<template>
  <div class="tpl tpl-teacher">
    <tpl-title
      v-if="blockData && blockData.optionName"
      :title="blockData.optionName"
    ></tpl-title>
    <div class="card-contain" v-if="teacherList">
      <div class="card-item" v-for="(item, key) in teacherList" :key="key">
        <img :src="item.head_icon" alt="" class="avatar" />
        <div class="name">{{ item.real_name }}</div>
        <div class="star">
            <el-rate
              v-model="item.star_num"
              disabled
              text-color="#ff9900">
            </el-rate>
            {{item.star_num}}分
        </div>
        <div class="desc">{{item.describe}}</div>
        <div class="info">
          <div class="left"><i class="el-icon-tickets"></i> 1200</div>
          <div class="right"><i class="el-icon-user"></i>1200</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as API_schoolSet from "@/api/schoolSet";
import mixin from "./customComponent/mixin";
export default {
  name: "teacherCard",
  mixins: [mixin],
  data() {
    return {
      teacherList: [],
    };
  },
  mounted() {
    API_schoolSet.getTeacherList({
      top_num: 5,
    }).then((res) => {
      this.teacherList = res;
      console.log(res);
    });
  },
};
</script>

<style lang="less" scoped>
@import "./customComponent/tpl_common.less";
.card-contain {
  display: flex;
  justify-content: space-around;
}
.card-item {
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 0px 18px 2px rgba(57, 57, 57, 0.1);
  border-radius: 4px;
  width: 18%;
  display: flex;
  flex-direction: column;
  align-items: center;
  //   justify-content: center;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: lightgray;
  }
  .title {
    margin-top: 8px;
    font-size: 18px;
    height: 40px;
    line-height: 40px;
  }
  .star {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #999999;
  }
  .desc {
    margin-top: 5px;
    font-size: 12px;
    color: #999999;
    .text-ellipsis(2);
  }
  .info {
    margin-top: 15px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #999999;
  }
}
/deep/ .el-rate{
  span{
    margin: 0 -4px;
  }
}
</style>