<template>
<!-- 录播 -->
  <div class="container-box">
    <record-resource></record-resource>
  </div>
</template>
<script>
import recordResource from "../resources/recordResource";
import { testPostImage } from "@/utils/index.js";
import { checkEnACharac4, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components:{
    recordResource
  }
};
</script>
