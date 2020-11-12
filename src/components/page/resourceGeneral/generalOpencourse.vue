<template>
  <div class="container-box">
    <open-couses></open-couses>
  </div>
</template>
<script>
import openCouses from "../courses/openCouses";
import { testPostImage } from "@/utils/index.js";
import { checkEnACharac4, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components:{
    openCouses
  }
};
</script>
