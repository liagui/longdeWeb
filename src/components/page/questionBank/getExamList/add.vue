<template>
  <div>
    <adminQuestionAdd
      :status="questionType"
      :subject_id="subject_id"
      @clearFun="clearFun"
      @marksure="marksureFun"
      v-if="questionType<7"
    ></adminQuestionAdd>
    <adminQuestionMaterialAdd
      :status="questionType"
      :subject_id="subject_id"
      @clearFun="clearFun"
      @marksure="marksureFun"
      v-if="questionType == 7"
    ></adminQuestionMaterialAdd>
  </div>
</template>
<script>
import { mapState } from "vuex";
import adminQuestionAdd from "../adminQuestionAdd";
import adminQuestionMaterialAdd from "../adminQuestionMaterialAdd";
export default {
  computed: {
    ...mapState({
      subject_id: state => state.question.question_subject_id
    })
  },
  data() {
    return {
      questionType: this.$route.query.questionType
    };
  },
  components: {
    adminQuestionAdd,
    adminQuestionMaterialAdd
  },
  methods: {
    clearFun() {
      this.$router.go(-1);
    },
    marksureFun() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
</style>