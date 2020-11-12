<template>
  <div class="container-box">
    <lecturers></lecturers>
  </div>
</template>
<script>
import lecturers from "../users/lecturers";
import { testPostImage } from "@/utils/index.js";
import { checkEnACharac4, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components:{
    lecturers
  }
};
</script>
