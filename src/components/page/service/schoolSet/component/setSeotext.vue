<template>
  <el-dialog
    :title="pop_title"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="handleClose"
  >
    <el-form>
      <el-form-item label="网站标题：">
        <el-input type="textarea" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="SEO关键字：">
        <el-input type="textarea" v-model="form.keywords"></el-input>
      </el-form-item>
      <el-form-item label="网站标题：">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "",
  props: ["show", "setData"],
  data() {
    return {
      dialogVisible: false,
      pop_title: "标题",
      form: {
        title: "",
        keywords: "",
        description: "",
      },
    };
  },
  watch: {
    show(value) {
      if (value == true) {
        this.pop_title = this.setData.title;
      }
      this.dialogVisible = value;
    },
  },
  methods: {
    handleClose(done) {
      this.currentUid = "";
      this.dialogVisible = false;
      this.$emit("close");
    },
  },
};
</script>