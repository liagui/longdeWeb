<template>
<!-- 直播 -->
  <div class="container-box">
    <live-resource></live-resource>
  </div>
</template>
<script>
import liveResource from "../resources/liveResource";
import { testPostImage } from "@/utils/index.js";
import { checkEnACharac4, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components:{
    liveResource
  }
};
</script>
