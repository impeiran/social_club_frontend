import defaultAvatar from './assets/default_avatar.jpg'
import { mapState } from 'vuex'

const min = 1000 * 60
const hour = min * 60
const day = hour * 24
const week = day * 7
const month = day * 30

export default {
  computed: {
    ...mapState([
      'hasLogin', 'authUserInfo'
    ]),

    userAvatar () {
      return this.hasLogin && this.authUserInfo.avatar ? this.authUserInfo.avatar : defaultAvatar
    }
  },

  methods: {
    getDateDict (timeStamp) {
      const history = new Date(timeStamp)
      const now = +new Date()
      const diffValue = now - history.getTime()
      let result = ''

      const diffMonth = diffValue / month
      const diffWeek = diffValue / week
      const diffDay = diffValue / day
      const diffHour = diffValue / hour
      const diffMin = diffValue / min
      if (diffMonth >= 1) {
        result = history.toLocaleString()
      } else if (diffWeek >= 1) {
        result = history.toLocaleString()
      } else if (diffDay >= 1) {
        result = parseInt(diffDay) + '天前 ' + history.toLocaleTimeString()
      } else if (diffHour >= 1) {
        result = parseInt(diffHour) + '小时前'
      } else if (diffMin >= 1) {
        result = parseInt(diffMin) + '分钟前'
      } else {
        result = '1分钟前'
      }
      return result
    },

    checkLoginBeforeAction () {
      if (!this.hasLogin) {
        this.$confirm('未登陆无法进行此操作，是否马上登陆', { type: 'warning', lockScroll: false })
          .then(() => {
            this.$router.push('/entry')
          })
          .catch(() => {})
        return false
      } else {
        return true
      }
    }
  }
}
