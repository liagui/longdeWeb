<template>
  <div class="news-swiper">
    <tpl-title
      v-if="blockData && blockData.optionName"
      :title="blockData.optionName"
    ></tpl-title>
    <div class="contain">
      <swiper
        :options="swiperOption"
        class="swiper-contain"
        v-if="newsList && newsList.length"
      >
        <swiper-slide v-for="(item, key) in newsList" :key="key">
          <img :src="item.image" alt="" class="cover" />
          <div class="title">{{ item.title }}</div>
          <div class="desc">有了龙德害怕自己自己学不会吗？</div>
        </swiper-slide>
      </swiper>
      <div class="news-contain">
        <div
          class="news-item"
          v-for="(item, key) in newsList"
          :key="key"
          :class="{ active: current == key }"
        >
          <div class="date">
            <div class="day" v-if="item.create_at">
              {{ item.create_at.slice(8, 10) }}
            </div>
            <div class="ymd" v-if="item.create_at">
              {{ item.create_at.slice(0, 10) }}
            </div>
          </div>
          <div class="news">
            <div class="item">
              <div class="title">{{ item.title }}</div>
              <div class="desc">{{ item.description }}</div>
            </div>
          </div>
          <div class="qa"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as API_schoolSet from "@/api/schoolSet";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/swiper-bundle.css";
import mixin from "./customComponent/mixin";
export default {
  name: "newsSwiper",
  mixins: [mixin],
  props: ["blockData"],
  data() {
    const self = this;
    return {
      newsList: [{}, {}, {}, {}],
      current: "",
      swiperOption: {
        on: {
          slideChangeTransitionEnd() {
            self.current = this.realIndex;
          },
        },
      },
    };
  },
  mounted() {
    API_schoolSet.getArticleList({
      top_num: 4,
    }).then((res) => {
      this.newsList = res;
      console.log(res);
    });
  },
  components: {
    Swiper,
    SwiperSlide,
  },
};
</script>
<style lang="less" scoped>
@import "./customComponent/tpl_common.less";
.swiper-slide {
  width: 100% !important;
  height: 100%;
}
.contain {
  display: flex;
}
.swiper-contain {
  margin-top: 15px;
  flex: 3;
  .cover {
    width: 100%;
    height: 300px;
    background-color: lightgray;
  }
  .title {
    font-size: 15px;
    color: #414141;
    height: 50px;
    line-height: 50px;
  }
  .desc {
    font-size: 12px;
    color: #999999;
  }
}
.news-contain {
  flex: 4;
  margin-left: 25px;
}
.news-item {
  padding: 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(:last-child) {
    border-bottom: dashed 1px #2b2b2b;
  }
  .date {
    flex-shrink: 0;
    width: 78px;
    height: 78px;
    border: solid 1px #777d83;
    text-align: center;
    font-size: 12px;
    .day {
      background-color: #777d83;
    }
    div {
      height: 39px;
      line-height: 39px;
    }
  }
  .news {
    flex-grow: 1;
    padding-left: 25px;
    text-align: left;
    .title {
      width: 400px;
      font-size: 15px;
      color: #414141;
      .text-ellipsis(1);
    }
    .desc {
      margin-top: 20px;
      width: 350px;
      font-size: 12px;
      color: #999999;
      .text-ellipsis(1);
    }
  }
  .qa {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    background-image: url("data:image/png;base64,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");
    background-repeat: no-repeat;
    background-size: contain;
  }
}
.news-item.active{
  .title{
    color: #00A2FF;
  }
  .desc{
    color: #00A2FF;
  }
  .date{
    color: #00A2FF;
    border-color: #00A2FF;
    .day{
      background-color: #00A2FF;
      color: #fff;
    }
  }
}
</style>