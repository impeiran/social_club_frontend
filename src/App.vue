<template>
  <div id="app">
    <Header></Header>
    <main class="social-body">
      <router-view/>
    </main>
    <Sider></Sider>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/common/Header'
import Sider from './components/Sider'
import Footer from './components/common/Footer'
export default {
  name: 'App',
  components: {
    Header,
    Sider,
    Footer
  },
  mounted () {
  }
}
</script>

<style lang="scss">
@import './sass/index.scss';
#app {
  min-width: 1280px;

  .social-body {
    min-height: calc(100vh - 60px);
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active, .fade-leave-active{
    transition: all .2s;
  }
}
</style>
