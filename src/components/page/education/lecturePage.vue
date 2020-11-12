<template>
  <div class="container-box">
    
  </div>
</template>
<script>
import _request from "@/utils/request";
import lecturePage  from './lecturePage'
export default {
  props:['transData'],
  data() {
    return {
      
    };
  },
  methods: {
    

    initData() {
      _request.http(this, "teach/getList", this.searchData).then(res => {
        if(res.data.length){
          this.dataList = res.data;
          this.noData = false;
        }else{
          this.dataList = [];
          this.noData = true;
        }  // this.totalCount = res.data.total;
      });
    },

   
  },
  mounted() {
    // this.initData();
  },
  watch: {
   
  }
};
</script>

<style lang="less" scoped>

</style>