<template>
  <div class="tpl tpl_course-2">
    <tpl-title
      v-if="blockData && blockData.optionName"
      :title="blockData.optionName"
    ></tpl-title>
    <div class="tpl_contain" v-if="blockData && blockData.course">
      <div class="item" v-for="(item, key) in blockData.course" :key="key">
        <img :src="item.cover" alt="" class="cover" />
        <div class="bottom">
          <div class="title">{{ item.title }}</div>
          <div class="desc">
            {{ item.describe }}
          </div>
          <div class="info">
            <div class="users">
              最新加入学习：
              <div class="student">
                <span class="student-avatar"></span>
                <span class="student-avatar"></span>
                <span class="student-avatar"></span>
                <span class="student-avatar"></span>
              </div>
            </div>
            <div class="price">
              <span class="discount"> ¥{{ item.pricing | toFixedNum }} </span>
              <span class="real-price"
                >¥{{ item.sale_price | toFixedNum }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="empty" v-else>loading</div>
  </div>
</template>

<script>
import mixin from "./customComponent/mixin";
export default {
  name: "twoModel",
  mixins: [mixin],
  props: ["blockData"],
};
</script>

<style lang="less" scoped>
.tpl_contain {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &::after {
    content: "";
    width: 49%;
    border: 1px solid transparent;
  }
}
.model-head {
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
}

.item {
  text-align: center;
  width: 49%;
  background: #ffffff;
  box-shadow: 0px 0px 18px 2px rgba(57, 57, 57, 0.1);
  border-radius: 9px 9px 9px 9px;
  text-align: left;
  .bottom {
    padding: 30px;
    padding-top: 0;
  }
  .discount {
    text-decoration: line-through;
  }
  .real-price {
    margin-left: 5px;
    color: #ff5d00;
    font-size: 18px;
  }
  .cover {
    width: 100%;
    height: 330px;
    background-color: lightgray;
  }
  .title {
    height: 50px;
    line-height: 50px;
    color: #484848;
    font-size: 22px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .desc {
    height: 30px;
    font-size: 12px;
    color: #999999;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .info {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #888;
    .users {
      display: flex;
      align-items: center;
      position: relative;
    }
    .price {
      display: flex;
      align-items: center;
    }
    .student {
      display: flex;
      flex-direction: row-reverse;
      span {
        position: relative;
      }
      .student-avatar:nth-child(1) {
        left: -30px;
      }
      .student-avatar:nth-child(2) {
        left: -20px;
      }
      .student-avatar:nth-child(3) {
        left: -10px;
      }
      .student-avatar:nth-child(4) {
        left: 0px;
      }
    }
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

.student-avatar {
  position: relative;
  display: inline-block;
  width: 43px;
  height: 43px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABUCAMAAAAvQDDOAAAC91BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+3vd/////+/f22vN/9//+0ut64vt+1u9/u8v////79/f+utduyuN2vttywt9yss9urstrw8v+zudywtty5v+Dt8P/z8/m9w+H6+/34+PvAxeL09fr29/vx8vnS1uq7weH8/f3t7vf8+/vW2u3Bx+Pf4fDU2OzM0OixuNzv7/fi5PLGy+bn6PO/xOLJzeb8/P/5+vr7/P319vrP0+nDyOT5+vzY2+v87u7a3u7N0un94ODy8/fr7Pbc3+7M0Obl5vPj5fHg4/G7weCzud7u8P7++vr99vbv8PbR1erKz+jFyuP++PjY3O64vOP/u77/tLj6+//+/Pv99PTEyeX4+f/y8//o6vX+8PD96em1vd3z9v72+P3y8/rd4PG3vt/2+P/s7vS5vOX93Nz/u7v6z8/+v8L19v/u9v/w8/3w8fL91df+xsr3xsXp6vXp6vPIzOT+y83+w8X/usL75ub/5+X84+OjzbHxsLD9/fz61dX90NL5y8r+uLz78vHr7O733N6zt+Gwt96xws7yvLvlxLj/rq/wrayX2o/v+f/4+P3/9PPa29/U19vO0dakq9a/wsmwtL2nq7TupqXz6O/m6Orh4uXFyeTAxeSxsuOrw8rzv8LytLPuo6OZ1Z+m1Zm6uuq0wdXMztPHytCpyMC81L33vL3H0KO80KHh2OTi6N3nxc+rvc7Kv8ze18PAx7bNyauoX+GZAAAATXRSTlMABfnC4BrYzLUe0FCPFb6qKvfjyVwM++h4QDMiEQoD6+mEaC8I9fOcSO/mn5VxRT061A3xu6SIgX5gJa1sZFU3Du3bxqeaTd4Yity3sKAOKmMAAA8lSURB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")
    no-repeat;
  background-size: contain;
}
</style>