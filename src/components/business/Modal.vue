<template>
  <div class="edit-info">
    <el-dialog
      :visible="showModal"
      :close-on-click-modal="false"
      class="edit-dialog"
      :title="title"
      :width="width"
      :append-to-body="true"
      @close="close()"
      center
    >
      <slot />
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["show", "title", "width", "clickModal"],
  data() {
    return {};
  },
  computed: {
    showModal() {
      return this.show;
    }
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

