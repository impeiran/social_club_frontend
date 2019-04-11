import Vue from 'vue'
import Vuex from 'vuex'
import SDK from './utils/socialSDK'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    hideHeader: false,
    showNotification: false,
    hasLogin: false,

    totalFollows: 0,
    totalFans: 0,
    totalLikes: 0,
    totalMoments: 0,

    unReadNotifications: [],
    hasReadNotifications: [],

    authUserInfo: {}
  },
  getters: {
    countUnRead: state => {
      return state.unReadNotifications.length
    }
  },

  mutations: {
    // 改变控制状态
    HIDE_HEADER (state, hide) {
      state.hideHeader = hide
    },
    SHOW_NOTIFICATION (state, status) {
      state.showNotification = status
    },

    // 修改显示信息
    SET_LOGIN (state, login) {
      state.hasLogin = login
    },
    SET_USER_INFO (state, info) {
      state.authUserInfo = info
    },
    SET_FOLLOWS (state, num) {
      state.totalFollows = num
    },
    SET_FANS (state, num) {
      state.totalFans = num
    },
    SET_LIKES (state, num) {
      state.totalLikes = num
    },
    SET_MOMENTS (state, num) {
      state.totalMoments = num
    },

    // 处理未读消息
    INIT_UNREAD_NOTIFICATION (state, unReadList) {
      state.unReadNotifications = unReadList
    },
    ADD_UNREAD_NOTIFICATION (state, unReadItem) {
      state.unReadNotifications.unshift(unReadItem)
    },
    READ_NOTIFICATION (state, index) {
      state.unReadNotifications[index].hasRead = true
      state.hasReadNotifications.unshift(state.unReadNotifications.splice(index, 1)[0])
    },
    CLEAR_UNREAD_NOTIFICATION (state) {
      state.unReadNotifications = []
    },

    // 处理已读消息
    INIT_HASREAD_NOTIFICATION (state, hasReadList) {
      state.hasReadNotifications = hasReadList
    },
    CLEAR_HASREAD_NOTIFICATION (state) {
      state.hasReadNotifications = []
    }
  },

  actions: {
    INIT_NOTIFICATION (ctx) {
      ctx.dispatch('FETCH_UNREAD_NOTIFICATION')
      ctx.dispatch('FETCH_HASREAD_NOTIFICATION')
    },

    FETCH_UNREAD_NOTIFICATION (ctx) {
      const sdk = new SDK()
      sdk.getUnReadNotification().then(res => {
        let data = res.data.data
        for (let val of data) {
          val.option = JSON.parse(val.option)
        }
        ctx.commit('INIT_UNREAD_NOTIFICATION', data)
      })
    },

    FETCH_HASREAD_NOTIFICATION (ctx) {
      const sdk = new SDK()
      sdk.getHasReadNotification().then(res => {
        let data = res.data.data
        for (let val of data) {
          val.option = JSON.parse(val.option)
        }
        ctx.commit('INIT_HASREAD_NOTIFICATION', data)
      })
    }
  }
})

export default store
