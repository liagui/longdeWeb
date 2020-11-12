<template>
  <div class="flex-between">
    <div class="text-l flex1">
      <slot name="left"></slot>
    </div>

    <div class="text-l flex3 clear">
      <slot name="center"></slot>
    </div>
    <div class="text-r flex2 clear">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {};
</script>