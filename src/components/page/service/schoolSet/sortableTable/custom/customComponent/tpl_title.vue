<template>
  <div class="tpl_title">
    <div class="title">{{ title }}</div>
    <div class="child-items" v-if="showChild && subject.childs">
      <div
        class="item"
        v-for="(item, key) in subject.childs"
        :key="key"
        v-show="key < 5"
        @click="changeSubject(item, key)"
        :class="{active:active == key}"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="more">更多</div>
  </div>
</template>

<script>
export default {
  name: "tplTitle",
  props: ["title", "showChild","subject"],
  data() {
    return {
      active: "",
    };
  },
  mounted() {
    console.log(this.subject);
  },
  methods: {
    changeSubject(item, index) {
      this.active = index;
      this.$emit("change", {
        coursesubjectOne: this.subject.id,
        coursesubjectTwo: item.id,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.tpl_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.title {
  font-size: 28px;
  color: #333333;
}
.more {
  font-size: 16px;
  color: #666666;
}
.child-items {
  display: flex;
  margin-left: 30px;
  flex: 1;
  .item {
    width: 100px;
    height: 30px;
    line-height: 30px;
    color: #999999;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
  }
  .item.active {
    background-color: #0fadfc;
    font-size: 12px;
    color: #fff;
  }
}
</style>