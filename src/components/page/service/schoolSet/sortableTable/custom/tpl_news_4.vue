<template>
  <div class="tpl tpl-news">
    <tpl-title
      v-if="blockData && blockData.optionName"
      :title="blockData.optionName"
    ></tpl-title>
    <div class="news-contain" v-if="newsList">
      <div class="news-item" v-for="(item, key) in newsList" :key="key">
        <img :src="item.image" alt="" class="cover" />
        <div class="news-content">
          <div class="title">{{ item.title }}</div>
          <div class="desc">
            {{item.description}}
          </div>
          <div class="info">
            <div class="view"><i class="el-icon-view"></i>{{item.watch_num}}</div>
            <div class="date" v-if="item.create_at">
              {{ item.create_at.slice(0, 10) }}
            </div>
          </div>
        </div>
      </div>
      <div class="block" v-for="key in itemBlockLength" :key="key"></div>
    </div>
  </div>
</template>

<script>
import * as API_schoolSet from "@/api/schoolSet";
import mixin from "./customComponent/mixin";
export default {
  name: "newsMix",
  mixins: [mixin],
  props: ["blockData"],
  data() {
    return {
      newsList: [],
    };
  },
  mounted() {
    API_schoolSet.getArticleList({
      top_num:4
    }).then((res) => {
      this.newsList = res;
    });
  },

  computed: {
    itemBlockLength() {
      if (this.newsList.length < 4) {
        return 4 - this.newsList.length;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "./customComponent/tpl_common.less";
.news-contain {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-content: flex-start;
}
.news-item {
  position: relative;
  margin-bottom: 20px;
  padding: 20px;
  width: 47.5%;
  display: flex;
  background: #ffffff;
  box-shadow: 0px 0px 18px 2px rgba(57, 57, 57, 0.1);
  border-radius: 9px;
  .cover {
    flex-shrink: 0;
    width: 153px;
    height: 153px;
    background-color: lightgray;
  }
  .news-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 20px;
  }
  .title{
      .text-ellipsis(2);
  }
  .desc {
    margin-top: -40px;
    font-size: 12px;
    color: #aaaaaa;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #aaaaaa;
  }
  .view{
    i{
      margin-right: 5px;
    }
  }
}
</style>