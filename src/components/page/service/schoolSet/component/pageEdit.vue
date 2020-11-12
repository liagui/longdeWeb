<template>
  <div class="item-container">
    <div class="nav-item">
      <div class="nav-title flex-2">
        <div class="title">{{ data.name }}</div>
        <div>自定义域名：{{ data.sign }}</div>
      </div>
      <div class="nav-date flex-1">{{ updateTime }}</div>
      <div class="nav-oprator flex-1">{{ data.admin_name }}</div>
      <div class="nav-operation flex-1">
        <i class="el-icon-edit-outline" @click="showEdit"></i>
        <i class="el-icon-delete" @click="del"></i>
      </div>
    </div>
  </div>
</template>

<script>
import * as API_delCustom from "@/api/schoolSet";
export default {
  name: "pageEdit",
  props: ["data", "index"],
  data() {
    return {
      show: false,
      blockData: {
        name: "",
        url: "",
        blank: "1",
      },
      updateTime: "",
    };
  },
  created() {
    this.operationTime();
  },
  methods: {
    showEdit() {
      this.show = !this.show;
      this.$router.push({
        path: "/service/schoolSet/customPageEditor",
        query: {
          id: this.data.id,
        },
      });
    },
    edit() {},
    //删除链接
    del() {
      this.$emit("itemDelete", this.index);
    },
    //操作时间
    operationTime() {
      this.updateTime = this.data.update_time.slice(
        this.data.update_time.indexOf(this.data.update_time.charAt(0)),
        this.data.update_time.indexOf(" ")
      );
    },
  },
};
</script>

<style lang="less" scoped>
.item-container {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 9px 1px rgba(0, 26, 44, 0.1);
  border-radius: 4px;
}
.nav-item {
  width: 100%;
  padding: 20px 0px;
  align-items: center;
  margin-top: 25px;
  display: flex;
  font-size: 14px;
  font-weight: 400;
  color: #888888;
  text-align: center;
  .flex-1 {
    flex: 1;
  }
  .flex-2 {
    flex: 2;
  }
}
.nav-title {
  box-sizing: border-box;
  padding-left: 30px;
  text-align: left;
  .title {
    color: #50a3f6;
  }
}
.nav-operation {
  cursor: pointer;
  flex: 1;
  i {
    display: inline-block;
    margin: 0 5px;
  }
}
</style>