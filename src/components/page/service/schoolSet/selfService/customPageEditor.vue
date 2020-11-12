<template>
  <div class="content">
    <div class="header-nav">
      <div class="header">
        <div class="line"></div>
        页面编辑
      </div>
      <div>
        <el-button type="primary" @click="$router.back()">返回</el-button>
      </div>
    </div>
    <div class="nav-meat">
      <div class="page-item">
        <div class="label">标题：</div>
        <el-input placeholder="标题" v-model="form.name"></el-input>
      </div>
      <div class="page-item">
        <div class="label">自定义链接：</div>
        <el-input placeholder="自定义域名" v-model="form.sign"></el-input>
      </div>
      <div class="rich-editor">
        <quillEditorCom
          @tranCont="getContent"
          :transIntroduction="contentModal"
        ></quillEditorCom>
      </div>
      <div class="button">
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import quillEditorCom from "@/components/page/ueditorCom/comEditor";
import * as API_custom from "@/api/schoolSet";
export default {
  name: "customPageEditor",
  data() {
    return {
      form: {},
    };
  },
  components: {
    quillEditorCom,
  },
  computed: {
    contentModal() {
      this.content = this.form.rickText;
      return this.content;
    },
  },
  created() {
    if (this.$route.query.id) {
      this.editor();
    }
  },
  methods: {
    //富文本
    getContent(val) {
      this.form.rickText = val;
    },
    //提交
    submit() {
      let _params = {
        page_type: 1,
        parent_id: 0,
        name: this.form.name,
        url: "",
        sign: this.form.sign,
        link_type: 2,
        is_new_open: 0,
        sort: 0,
        text: this.form.rickText,
      };
      API_custom.customPageAdd(_params).then((res) => {
        console.log(res);
      });
    },
    //编辑
    editor() {
      console.log(this.$route.query);
      let _params = {
        id: this.$route.query.id,
      };
      API_custom.customPageDetail(_params).then((res) => {
        this.form = {
          name: res.name,
          sign: res.sign,
          rickText: res.text,
        };
        // console.log(text(res.text));
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  width: calc(100%-60px);
  height: auto;
  box-sizing: border-box;
  padding: 30px;
  background: #ffffff;
  margin-left: 20px;
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding-bottom: 500px;
}
.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header {
    display: flex;
    align-items: center;
  }
  .line {
    display: inline-block;
    margin-right: 15px;
    width: 4px;
    height: 20px;
    background: rgb(32, 166, 255);
  }
}
.nav-meat {
  margin-top: 30px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 30px;
}
.page-item {
  display: flex;
  font-size: 14px;
  height: 50px;
  align-items: center;
  .label {
    width: 120px;
    text-align: right;
  }
  .el-input {
    width: 400px;
  }
  .el-radio {
    margin-top: 9px;
  }
}
.rich-editor {
  box-sizing: border-box;
  padding: 0 30px;
  margin: 30px auto;
}
.button {
  width: 100%;
  .el-butotn {
    margin: 0 auto;
  }
}
</style>