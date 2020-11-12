<template>
  <div>
    <p class="flex-center tip-group">
      <span>
        <i class="q-check bg-already"></i>
        已做
      </span>
      <span>
        <i class="q-check bg-not"></i>
        未做
      </span>
      <span>
        <i class="q-check bg-current"></i>
        当前
      </span>
      <!-- <span>
        <i class="q-check color-red">*</i>标记
      </span> -->
    </p>
    <div v-for="(item,index) in data" :key="index">
      <p class="pc-ti-type margin-tb20">
        <!-- 如果是材料题 -->
        <span v-if="item[0].cailiao">{{ '材料题('+item.length+')' }}</span>
        <!-- 不是材料题 -->
        <span v-else>{{ item[0].exam_type_name+'('+item.length+')' }}</span>
      </p>
      <ul class="clear">
        <li
          v-for="(child,inde) in item"
          :key="inde"
          class="pc-tika"
          :class="{'bg-already':!!child.my_answer,'bg-not':!child.my_answer,'bg-current':child.index==current}"
          @click="swipeHref(child.index)"
        >
          {{child.tihao ? child.tihao : Number(child.index)+1 }}
          <i
            v-if="child.is_tab==1"
            class="is_tab q-check color-red"
          >*</i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data", "current"],
  methods: {
    swipeHref(index) {
      this.$emit("swipeHref", index);
    }
  }
};
</script>

<style lang="less" scoped>
.flex-center{
  display: flex;
  align-items: center;
  justify-content: center;
}
// pc-题卡
.is_tab {
  position: absolute;
  right: 0;
  top: -7px;
}
.pc-tika {
  position: relative;
  width: 35px;
  height: 35px;
  line-height: 35px;
  border-radius: 1px;
  text-align: center;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  float: left;
}
.pc-ti-type {
  display: inline-block;
  position: relative;
  font-size: 18px;
  font-weight: bold;
  span {
    position: relative;
    z-index: 99;
  }
  &::before {
    position: absolute;
    bottom: 1px;
    left: 0;
    content: "";
    width: 80%;
    height: 6px;
    background-color: #26a4fd;
  }
}
.margin-b20 {
  margin-bottom: 20px;
}
.q-check {
  display: inline-block;
  width: 11px;
  height: 12px;
}
.bg-already {
  background-color: #ededed;
  border: 1px solid #ededed;
}
.bg-not {
  background-color: #fff;
  border: 1px solid #999;
}
.bg-current {
  background-color: #d9eaff !important;
  border: 1px solid #25a3fd !important;
}
.tip-group {
  height: 14px;
  justify-content: space-around;
  i {
    margin-right: 5px;
  }
  span {
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 14px;
  }
}
</style>