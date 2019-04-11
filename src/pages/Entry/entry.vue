<script>
import SDK from '../../utils/socialSDK.js'
import * as webSocket from '../../websocket'
import { mapState, mapMutations } from 'vuex'

const LS = window.localStorage

export default {
  data () {
    return {
      flag: 'login',
      captchaUrl: 'http://localhost:9002/social_captcha',
      loginData: {
        account: '',
        password: '',
        captcha: ''
      },
      signUpData: {
        nickname: '',
        sex: undefined,
        account: '',
        password: '',
        duplicatePassword: '',
        captcha: ''
      }
    }
  },

  computed: {
    ...mapState([
      'hasLogin'
    ])
  },

  methods: {
    ...mapMutations([
      'HIDE_HEADER',
      'SET_LOGIN',
      'SET_FOLLOWS',
      'SET_FANS',
      'SET_LIKES',
      'SET_MOMENTS',
      'SET_USER_INFO'
    ]),

    handleSelect (key) {
      this.flag = key
      this.changeCaptchaUrl()
    },

    changeCaptchaUrl () {
      this.captchaUrl = 'http://localhost:9002/social_captcha?t=' + new Date().getTime()
    },

    goLogin () {
      const { account, password, captcha } = this.loginData
      this.$refs.loginInputElem.blur()

      if (!account) {
        this.$alert('账号不能为空')
        return
      } else if (!password) {
        this.$alert('密码不能为空')
        return
      } else if (!captcha) {
        this.$alert('缺少验证码')
        return
      }

      const loginLoading = this.$loading()

      const sdk = new SDK()
      sdk.login(account, password, captcha).then(res => {
        if (res.data.success) {
          const data = res.data.data
          this.SET_LOGIN(true)
          this.SET_FOLLOWS(data.follows_num)
          this.SET_FANS(data.fans_num)
          this.SET_LIKES(data.likes_num)
          this.SET_MOMENTS(data.moments_num)
          this.SET_USER_INFO({
            nickname: data.nickname,
            avatar: data.avatar,
            desc: data.desc,
            created_at: data.created_at,
            sex: data.sex,
            id: data.id
          })
          LS.setItem('userToken', data.token)
          webSocket.connect()
          this.$message({ message: '登陆成功！', type: 'success' })
          this.$router.push('/')
        } else {
          this.$alert(res.data.msg, { type: 'error' })
        }
        loginLoading.close()
      })
    },

    goSignUp () {
      const { nickname, sex, account, password, duplicatePassword, captcha } = this.signUpData
      this.$refs.signUpInputElem.blur()
      if (!nickname) {
        this.$alert('昵称不能为空')
        return
      } else if (!sex) {
        this.$alert('请选择性别')
        return
      } else if (!account) {
        this.$alert('账号不能为空')
        return
      } else if (!password || !duplicatePassword) {
        this.$alert('密码不能为空')
        return
      } else if (password !== duplicatePassword) {
        this.$alert('两次密码不一样 请重新输入')
        return
      } else if (!captcha) {
        this.$alert('缺少验证码')
        return
      }

      const sexNum = sex === '男' ? 1 : 0
      const signUpLoading = this.$loading()
      const sdk = new SDK()
      sdk.signUp(nickname, sexNum, account, password, captcha).then(res => {
        if (res.data.success) {
          LS.setItem('userToken', res.data.data.token)
          signUpLoading.close()
          this.$confirm('注册成功，是否跳转登陆')
            .then(() => {
              this.$router.push('/')
            })
        } else {
          this.$alert(res.data.msg, { type: 'error' })
        }
        signUpLoading.close()
      })
    }
  },

  created () {
    if (this.hasLogin) {
      this.$router.push('/')
    }

    this.HIDE_HEADER(true)
  }
}
</script>

<template>
  <section class="social-entry-page">
    <router-link to="/">
      <h1>SocialClub</h1>
    </router-link>

    <div class="panel">

      <el-menu :default-active="'login'" active-text-color="#409eff" mode="horizontal" @select="handleSelect" class="menu">
        <el-menu-item :index="'login'">登陆</el-menu-item>
        <el-menu-item :index="'signUp'">注册</el-menu-item>
      </el-menu>

      <div class="login-content" v-if="flag === 'login'">
        <el-input type="account" placeholder="请输入你的账号" prefix-icon="el-icon-tickets" class="inputBox" clearable autofocus
                  v-model="loginData.account" />
        <el-input type="password" placeholder="请输入你的密码" prefix-icon="el-icon-setting" class="inputBox"
                  v-model="loginData.password"
                  ref="loginInputElem"/>
        <div class="inputBox captcha-box" key="signUpCaptchaBox">
          <el-input type="text" placeholder="验证码" prefix-icon="el-icon-setting" class="captcha-el" maxlength="4"
                  v-model="loginData.captcha"
                  @keyup.enter.native="goLogin"/>
          <img :src="captchaUrl" @click="changeCaptchaUrl">
        </div>
        <el-button type="primary" class="panel-btn" @click="goLogin">登陆</el-button>
      </div>

      <div class="signUp-content" v-if="flag === 'signUp'">
        <el-input type="account" placeholder="请输入昵称" prefix-icon="el-icon-edit" class="inputBox" clearable autofocus
                  v-model="signUpData.nickname" />
        <el-radio-group v-model="signUpData.sex" class="inputBox">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
        <el-input type="account" placeholder="请输入注册账号" prefix-icon="el-icon-tickets" class="inputBox" clearable
                  v-model="signUpData.account" />
        <el-input type="password" placeholder="请输入注册密码" prefix-icon="el-icon-setting" class="inputBox"
                  v-model="signUpData.password" />
        <el-input type="password" placeholder="请再次输入注册密码" prefix-icon="el-icon-setting" class="inputBox"
                  v-model="signUpData.duplicatePassword"
                  ref="signUpInputElem"/>
        <div class="inputBox captcha-box" key="signUpCaptchaBox">
          <el-input type="text" placeholder="验证码" prefix-icon="el-icon-setting" class="captcha-el" maxlength="4"
                  v-model="signUpData.captcha"
                  @keyup.enter.native="goSignUp"/>
          <img :src="captchaUrl" @click="changeCaptchaUrl">
        </div>
        <el-button type="success" class="panel-btn" @click="goSignUp">注册</el-button>
      </div>

      <div class="panel-footer">
         <!-- A greater world is waiting for you... -->
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '../../sass/variable.scss';
.social-entry-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  h1 {
    margin: 40px;
    font-style: italic;
    font-weight: bold;
    font-size: 2em;
    color: $themeColor;
    text-decoration: none;
  }

  .panel {
    position: absolute;
    top: 16%;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
    padding: 20px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 0 8px #eee;

    .panel-footer {
      margin: 20px 0 0;
      color: #aaa;
      text-align: right;
      font-size: 14px;
    }
  }

  .captcha-box {
    display: flex;
    justify-content: space-between;
    img {
      margin-left: 20px;
      height: 40px;
      cursor: pointer;
    }
  }

  .inputBox {
    margin-bottom: 20px;
  }

  .panel-btn {
    width: 100%;
  }

  /deep/ .el-menu.el-menu--horizontal {
    margin-bottom: 20px;
    border-bottom: none;
  }
}
</style>
