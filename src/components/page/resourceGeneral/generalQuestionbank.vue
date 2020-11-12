<template>
  <div class="container-box">
    <question-bank></question-bank>
  </div>
</template>
<script>
import questionBank from "../questionBank/questionBank";
import { testPostImage } from "@/utils/index.js";
import { checkEnACharac4, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components:{
    questionBank
  }
};
</script>
