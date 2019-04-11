<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
    size: { type: String, default: 'default' }
  },

  computed: {
    loadingSizeClass () {
      return 'size-' + this.size
    }
  }
}
</script>

<template>
  <div class="social-loading">
    <div class="loading-wrapper" v-if="loading" :class="loadingSizeClass">
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-wrapper {
  text-align: center;
  color: #128fdc;
  margin: 10px auto;

  &.size-big {
    font-size: 4em;
  }

  &.size-default {
    font-size: 3em;
  }

  &.size-small {
    font-size: 2em;
  }

  &.size-mini {
    font-size: 1em;
  }
}
</style>
