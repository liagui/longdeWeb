<template>
  <div>
    <div class="content-nav">
      <div class="nav-header">
        <div class="nav-line"></div>
        <div class="nav-text">底部链接</div>
      </div>
      <div class="nav-meat">
        <div class="editor-th">
          <div class="th">内容名称</div>
          <div class="th flex-two">链接地址</div>
          <div class="th">方式</div>
          <div class="th">操作</div>
        </div>
        <div class="editor-td">
          <draggable
            class="draggable-right"
            v-bind="draggOption"
            :list="footNavList"
            handle=".handle"
          >
            <url-edit
              v-for="(item, key) in footNavList"
              :key="key"
              :data="item"
              :index="key"
              :model="model"
              @itemChange="setNavList"
              @itemDelete="delNavList"
            ></url-edit
          ></draggable>
          <div class="item-add"  @click="addItem">
            <i class="el-icon-plus"></i>
            新增
          </div>
        </div>
        <!-- submit -->
        <el-button
          style="margin-top: 30px"
          class="submit"
          type="primary"
          @click="submit"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import urlEdit from "../../component/urlEdit";
import { deepCompare } from "@/utils/Foundation";
import draggable from "vuedraggable";

export default {
  name: "footUrlEdit",
  props: ["data", "model"],
  data() {
    return {
      showSave: false,
      footNavList: [
        {
          name: "关于我们",
          url: "",
          type: "无跳转",
        },
      ],
    };
  },
  watch: {
    //暂时不用
    footNavList(val) {
      if (deepCompare(val, this.data)) {
        this.showSave = false;
      } else {
        this.showSave = true;
      }
    },
  },
  computed: {
    // drag
    draggOption() {
      return {
        animation: 0,
        group: "people",
      };
    },
  },
  created() {
    if (this.data) {
      this.footNavList = JSON.parse(JSON.stringify(this.data)); //深拷贝
    }
  },
  components: {
    urlEdit,
    draggable,
  },
  methods: {
    addItem() {
      this.footNavList.push({
        name: "模块名称",
        url: "",
        type: "无跳转",
        children: [],
      });
    },
    delNavList(index) {
      this.footNavList.splice(index, 1);
    },
    setNavList(data) {
      console.log(data);
      const { index, item } = data;
      this.$set(this.footNavList, index, item);
    },
    submit() {
      this.$emit("change", this.footNavList);
      this.$toast("保存成功");
    },
  },
};
</script>

<style lang="less" scoped>
.content-nav {
  width: 100%;
  height: auto;
}
.nav-header {
  width: 100%;
  box-sizing: border-box;
  padding: 25px 0;
}
.nav-line {
  width: 4px;
  height: 19px;
  background: rgb(32, 166, 255);
  float: left;
}
.nav-text {
  font-size: 19px;
  height: 19px;
  line-height: 19px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #333333;
  box-sizing: border-box;
  padding: 0 0 0 7px;
}
.nav-meat {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 30px;
}
//urlEdit
.editor-th {
  display: flex;
  font-size: 14px;
  text-align: center;
  .th {
    flex: 1;
  }
  .flex-two {
    flex: 2;
  }
}
.item-add {
  margin-top: 25px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
</style>