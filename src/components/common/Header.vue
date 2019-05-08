<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

const LS = window.localStorage

export default {
  data () {
    return {
      keyword: '',
      searchFlag: '',
      inputFocus: false,

      popDownHeader: false,
      lastY: 0
    }
  },

  computed: {
    ...mapState([
      'hideHeader', 'showNotification', 'hasLogin', 'authUserInfo'
    ]),

    ...mapGetters([
      'countUnRead'
    ]),

    hideInput () {
      return this.$route.name === 'search'
    },

    focusStyle () {
      return this.inputFocus ? { width: '500px' } : { width: '300px' }
    }
  },

  methods: {
    ...mapMutations([
      'SHOW_NOTIFICATION'
    ]),

    notificationControl () {
      this.SHOW_NOTIFICATION(!this.showNotification)
    },

    inputFocusHandler () {
      this.inputFocus = true
    },

    inputBlurHandler () {
      this.inputFocus = false
    },

    goSearch () {
      this.$router.push('/search?kw=' + this.keyword)
      this.keyword = ''
    },

    goLogout () {
      this.$confirm('确定要退出登陆吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(() => {
        LS.removeItem('userToken')
        location.href = '/entry'
      })
    }
  },

  mounted () {
    window.addEventListener('scroll', e => {
      if (document.documentElement.scrollTop > 600) {
        this.popDownHeader = true
      } else {
        this.popDownHeader = false
      }
    })
  }
}
</script>

<template>
  <section class="social-header"
           :class="{'popDown': popDownHeader}"
           v-show="!hideHeader">
    <div class="wrapper">

      <router-link to="/">
        <h1>SocialClub</h1>
      </router-link>

      <el-input placeholder="请输入搜索内容" suffix-icon="el-icon-search" class="inputBox"
                v-if="!hideInput"
                v-model="keyword"
                :style="focusStyle"
                @focus="inputFocusHandler"
                @blur="inputBlurHandler"
                @keyup.enter.native="goSearch">
      </el-input>

      <div class="corner">

        <template v-if="hasLogin">
          <div class="notification" @click="notificationControl">
            <el-badge :value="countUnRead" :max="99" class="notifi-icon" :hidden="countUnRead === 0">
              <i class="el-icon-bell"></i>
            </el-badge>
          </div>
          <router-link to="/user">
            <span class="name">{{this.authUserInfo.nickname}}</span>
          </router-link>
          <span class="logout" @click="goLogout">退出</span>
        </template>

        <template v-else>
          <router-link to="/entry">
            <span class="login">登陆</span>
          </router-link>
        </template>

      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '../../sass/variable.scss';

.social-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 69px;
  background: $themeColor;

  .wrapper {
    display: flex;
    align-items: center;
    position: relative;
    margin: 0 auto;
    width: 1280px;

    h1 {
      font-style: italic;
      font-weight: bold;
      font-size: 2em;
      color: #fff;
      text-decoration: none;
    }

    .inputBox {
      position: relative;
      margin: 0 20px 0 80px;
      transition: all .3s;
      /deep/ input {
        border-radius: 40px !important;
      }
    }

    .corner {
      display: flex;
      align-items: center;
      position: absolute;
      right: 0;
      span {
        display: inline-block;
        margin-right: 30px;
      }

      /* 角标 消息通知 */
      .notification {
        display: inline-block;
        margin-right: 30px;
        .notifi-icon {
          cursor: pointer;
          .el-icon-bell {
            font-size: 1.4em;
            color: #fff;
          }
        }
      }

      /* 名字 登陆按钮 退出按钮 */
      .name, .login {
        color: #fff;
        font-weight: bold;
        cursor: pointer;
      }
      .logout {
        margin-right: 0;
        color: red;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}
@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translate3d(0, -70px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.popDown {
  position: fixed;
  /* top: -70px; */
  animation: slideDown .6s ease-in-out;
  z-index: 1000;
}

</style>
