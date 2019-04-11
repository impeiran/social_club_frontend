<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'HIDE_HEADER'
    ])
  },

  created () {
    this.HIDE_HEADER(false)
  }
}
</script>

<template>
  <section class="social-not-found">
    <h1>404 not found</h1>
    <span>oops, are u lost ?</span>
  </section>
</template>

<style lang="scss" scoped>
@import '../sass/variable.scss';
.social-not-found {
  margin-top: 10%;
  color: $themeColor;
  text-align: center;

  h1 {
    margin: 15px;
    text-align: center;
    font-size: 3em;
    font-weight: bold;
  }
}
</style>
