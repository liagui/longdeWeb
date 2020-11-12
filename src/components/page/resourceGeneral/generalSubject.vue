<template>
  <div class="container-box">
    <subject></subject>
  </div>
</template>
<script>
import subject from "../resources/subject";
import { testPostImage } from "@/utils/index.js";
import { checkEnACharac4, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components:{
    subject
  }
};
</script>
