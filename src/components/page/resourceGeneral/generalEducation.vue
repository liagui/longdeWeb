<template>
  <div class="container-box">
    <educat-admin></educat-admin>
  </div>
</template>
<script>
import educatAdmin from "../users/educatAdmin";
import { testPostImage } from "@/utils/index.js";
import { checkEnACharac4, rightNumber, onlyInputNumber } from "@/utils/rules";
export default {
  components:{
    educatAdmin
  }
};
</script>
