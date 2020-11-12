<template>
  <div class="edit-info">
    <el-dialog :close-on-click-modal="false" title="内容编辑" :visible.sync="showModal" @close="close()">
      <quillEditorCom
        @tranCont="getContent"
        :transIntroduction="contentModal"
      ></quillEditorCom>
      <span slot="footer" class="dialog-footer">
        <el-button class="clear-btn" @click="close()">取 消</el-button>
        <el-button type="primary" class="sub-btn" @click="submitForm()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _request from "@/utils/request";
import quillEditorCom from "../page/ueditorCom/comEditor";
export default {
  props: ["show", "content"],
  components: {
    quillEditorCom,
  },
  data() {
    return {
      neirong: "",
    };
  },
  computed: {
    showModal() {
      return this.show;
    },
    contentModal() {
      return this.content;
    },
  },
  created() {
    this.neirong = this.content;
  },
  methods: {
    getContent(val) {
      this.neirong = val;
    },
    close() {
      this.$emit("close");
    },
    submitForm() {
      this.$emit("change", this.neirong);
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .el-dialog__footer {
  text-align: center !important;
}
/deep/ .ql-container {
  min-height: 300px;
}
.ql-editor {
  height: 300px !important;
}
</style>

