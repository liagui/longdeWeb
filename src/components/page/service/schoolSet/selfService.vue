<template>
  <div class="content">
    <div class="content-nav">
      <div class="nav-header">
        <div>
          <div class="nav-line"></div>
          <div class="nav-text">自定义链接管理</div>
        </div>
        <div>
          <el-button
            type="primary"
            @click="$router.push('/service/schoolSet/customPageEditor')"
            >新增页面</el-button
          >
        </div>
      </div>
      <div class="nav-meat">
        <div class="nav-selct">
          <div class="title">标题</div>
          <div>最后编辑时间</div>
          <div>操作人</div>
          <div>操作</div>
        </div>
        <page-edit
          v-for="(item, key) in customList"
          :key="key"
          :data="item"
          :index="key"
          @itemDelete="itemDelete(item)"
        ></page-edit>
      </div>
    </div>
  </div>
</template>
<script>
import pageEdit from "./component/pageEdit";
import * as API_custom from "@/api/schoolSet";
import * as API_schoolSet from '@/api/schoolSet';
export default {
  name: "selfService",
  data() {
    return {
      params: {
        page: 1,
        page_type: 1,
      },
      customList: [
        // {
        //   title: "标题",
        //   url: "/自定义地址",
        //   model: "模板组",
        //   operator: "操作人",
        // },
      ],
    };
  },
  components: {
    pageEdit,
  },
  created() {
    this.getList();
  },
  methods: {
    itemDelete(item){
      API_schoolSet.customPageDel({
        id_list:item.id
      }).then(res =>  {
        console.log(this.$toast("删除成功"))
        this.getList()
      })
    },
    getList() {
      let _params = {
        page_type: 1,
      };
      API_custom.customPageList(_params).then((res) => {
        console.log(res);
        this.customList = res.list;
      });
    },
  },
  watch: {},
};
</script>

<style lang="less" scoped>
.content {
  width: calc(100%-60px);
  height: auto;
  box-sizing: border-box;
  padding: 0 30px;
  background: #ffffff;
  margin-left: 20px;
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding-bottom: 500px;
}
.content-nav {
  width: 100%;
  height: auto;
}
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.nav-selct {
  box-sizing: border-box;
  width: 100%;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  .title {
    flex: 2;
    box-sizing: border-box;
    padding-left: 30px;
    text-align: left;
  }
}
.nav-selct div {
  flex: 1;
  font-size: 14px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #333333;
  line-height: 16px;
}
.nav ul {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.nav li {
  height: 45px;
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  line-height: 45px;
  flex: 1;
  text-align: center;
}
.nav li a {
  color: #666666;
  text-decoration: none;
}
.nav li a:hover {
  color: #27a4fe !important;
  font-weight: 500;
}
.logo {
  width: 170px;
  height: 45px;
  float: left;
}
.active {
  color: #27a4fe !important;
  font-weight: 500;
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

/deep/ .el-upload-list {
  margin-left: 0;
}
</style>
