<script>

let timer = null

export default {
  data () {
    return {
      showButton: false
    }
  },

  methods: {
    goTop () {
      window.scrollTo(0, 0)
    }
  },

  mounted () {
    window.addEventListener('scroll', e => {
      timer = setTimeout(() => {
        this.showButton = document.documentElement.scrollTop > 600
        clearTimeout(timer)
      }, 400)
    })
  }
}
</script>

<template>
  <transition name="el-fade-in">
    <aside class="back-to-top" v-show="showButton" @click="goTop">
      <i class="el-icon-arrow-up"></i>
    </aside>
  </transition>
</template>

<style lang="scss" scoped>
@import '../../sass/variable.scss';
.back-to-top {
  display: block;
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 2em;
  background: $themeColor;
  border-radius: 50%;
  cursor: pointer;
}
</style>
