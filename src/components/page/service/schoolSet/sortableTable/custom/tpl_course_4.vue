<template>
  <div class="tpl tpl_course">
    <tpl-title
      v-if="blockData && blockData.optionName"
      :title="blockData.optionName"
      :showChild="blockData.showChild"
      :subject="blockData.subject"
      @change="titChange"
    ></tpl-title>
    <div class="contain" v-if="blockData && blockData.courseList">
      <div
        class="item"
        v-for="(item, key) in blockData.courseList"
        :key="item.id"
        v-show="key < 4"
      >
        <img :src="item.cover" alt="" class="cover" />
        <div class="bottom">
          <div class="title">{{ item.title }}</div>
          <div class="tags">
            <div
              class="tag"
              :class="[
                {
                  blue: tag.method_id == 1,
                  green: tag.method_id == 2,
                  yellow: tag.method_id == 3,
                },
              ]"
              v-for="(tag, key) in item.method"
              :key="key"
            >
              {{ tag.method_name }}
            </div>
          </div>
          <div class="info">
            <div class="users">{{ item.buy_num }}人购买</div>
            <div class="price">¥{{ item.sale_price | toFixedNum }}</div>
          </div>
        </div>
      </div>
      <div
        class="item-block"
        v-for="(item, key) in itemBlockLength"
        :key="key"
      ></div>
    </div>
    <div class="empty" v-else>请选择课程</div>
  </div>
</template>

<script>
import mixin from "./customComponent/mixin";
import * as API_schoolSet from "@/api/schoolSet";
export default {
  name: "fourModel",
  mixins: [mixin],
  props: ["blockData"],
  computed: {
    itemBlockLength() {
      if (this.blockData.courseList.length < 4) {
        return 4 - this.blockData.courseList.length;
      }
    },
  },
  methods: {
    searchClass(params) {
      let _params = {
        coursesubjectOne: params.coursesubjectOne,
        coursesubjectTwo: params.coursesubjectTwo,
        method: this.blockData.method,
        sort: this.blockData.sort,
        top_num: 4,
      };
      API_schoolSet.getCourseList(_params).then((res) => {
        this.blockData.courseList = res;
      });
    },
    titChange(params) {
      this.searchClass(params);
    },
  },
};
</script>

<style lang="less" scoped>
.contain {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-content: flex-start;
}
.model-head {
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
}
.item-block {
  width: 23%;
}
.item {
  width: 23%;
  box-shadow: 0px 0px 18px 2px rgba(57, 57, 57, 0.1);
  border-radius: 9px 9px 9px 9px;
  border-radius: 5px;
  .tags {
    display: flex;
    .tag {
      margin-top: 5px;
      margin-right: 3px;
      font-size: 10px;
      padding: 4px 10px;
      color: #fff;
      background-color: #45a0ff;
      transform: scale(0.8);
      transform-origin: 0 0;
    }
    .blue {
      background-color: #119dff;
    }
    .green {
      background-color: #00cabd;
    }
    .yellow {
      background-color: #ffa522;
    }
  }
  .cover {
    width: 100%;
    height: 157px;
    border-radius: 5px;
  }
  .bottom {
    padding: 15px;
  }
  .title {
    font-size: 15px;
    color: #484848;
  }
  .info {
    margin-top: 15px;
    display: flex;
    height: 30px;
    justify-content: space-between;
    align-items: center;
  }
  .users {
    font-size: 12px;
    color: #979797;
  }
  .price {
    font-size: 14px;
    color: #fe6f21;
  }
}
.empty {
  width: 100%;
  height: 300px;
  line-height: 300px;
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>