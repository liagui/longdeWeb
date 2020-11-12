<template>
  <div class="newsModel">
    <tpl-title
      v-if="blockData && blockData.optionName"
      :title="blockData.optionName"
    ></tpl-title>
    <div class="news-contain" v-if="newsList">
      <div class="text-block">
        <div class="text-item">
          <div
            class="contentr"
            v-for="(item, key) in newsList.slice(0, 4)"
            :key="key"
          >
            <div class="quanLine">
              <div></div>
            </div>
            <div class="right">
              <div class="title">{{ item.title }}</div>
              <div class="sub">
                <div class="view"><i class="el-icon-view"></i> 1000</div>
                <div class="date">{{ item.create_at.slice(0,10) }}</div>
                <div class="subject">{{ item.typename }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="image-block">
        <div
          class="img-item"
          v-for="(item, key) in newsList.slice(4, 6)"
          :key="key"
        >
          <img :src="item.image" alt="" class="card-img" />
          <div class="right">
            <div class="title">{{ item.title }}</div>
            <div class="date">{{ item.create_at.slice(0,10) }}</div>
          </div>
        </div>
      </div>
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
      updateTime: "",
    };
  },
  mounted() {
    API_schoolSet.getArticleList({
      top_num: 6,
    }).then((res) => {
      this.newsList = res;
    });
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.news-contain {
  display: flex;
}
.model-head {
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
}
.text-block {
  flex: 1;
  padding-top: 30px;
  padding-right: 50px;
  .text-item {
    height: 80px;
  }
  .contentr {
    display: flex;
    .circle {
      box-sizing: border-box;
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      position: relative;
      border: solid 4px #00adff;
      box-shadow: 0px 0px 8px 0px rgba(0, 173, 255, 0.2);
      border-radius: 50%;
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 2px;
        height: 99px;
        background-color: #e9e9e9;
      }
    }
    &:last-child .quanLine {
      border: none;
    }
    .quanLine {
      width: 20px;
      height: 65px;
      border-left: 2px solid #d1caca;
      position: relative;
      left: 10px;
      top: 2.5px;
      box-sizing: border-box;
      div {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fff;
        border: 4px solid rgba(rgb(0, 195, 255));
        position: absolute;
        left: -11px;
      }
    }
  }
  .right {
    margin-left: 25px;
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    .title {
      font-size: 18px;
      color: #414141;
      text-align: left;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .sub {
      margin-top: 7.5px;
      width: 250px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #787d82;
    }
  }
}

.image-block {
  margin-top: 15px;
  flex: 1;
  .img-item {
    position: relative;
    display: flex;
    height: 152px;
    padding-bottom: 15px;
    &:first-child {
      border-bottom: dashed 1px rgba(0, 0, 0, 0.1);
      margin-bottom: 15px;
    }
  }
  .card-img {
    flex-shrink: 0;
    width: 270px;
    background-color: lightgray;
  }
  .right {
    flex: 1;
    margin-left: 20px;
  }
  .title {
    text-align: left;
    font-size: 18px;
    color: #414141;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .date {
    position: absolute;
    right: 0;
    bottom: 15px;
    font-size: 12px;
    color: #787d82;
  }
}
</style>