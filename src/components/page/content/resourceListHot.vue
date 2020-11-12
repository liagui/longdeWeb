<template>
  <div>
   <articleList :section=0 redirectionUrl='resourceListHot'></articleList>
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