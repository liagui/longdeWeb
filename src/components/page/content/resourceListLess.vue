<template>
  <div>
   <articleList :section=5 redirectionUrl='resourceListLess'></articleList>
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