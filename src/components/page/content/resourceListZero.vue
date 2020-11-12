<template>
  <div>
   <articleList :section='3' redirectionUrl='resourceListZero'></articleList>
  </div>
</template>
<script>
import articleList from './resourceList'
export default {
  components: {
    articleList
  },
  
 
};
</script>