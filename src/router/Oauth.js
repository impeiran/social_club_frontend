import SDK from '../utils/socialSDK'
import * as webSocket from '../websocket'
import store from '../store'

const LS = window.localStorage
const NEED_AUTH_ROUTE = [
  'user', 'user.edit', 'search'
]

const initStoreInfo = data => {
  store.dispatch('INIT_NOTIFICATION')
  store.commit('SET_LOGIN', true)
  store.commit('SET_FOLLOWS', data.follows_num)
  store.commit('SET_FANS', data.fans_num)
  store.commit('SET_LIKES', data.likes_num)
  store.commit('SET_MOMENTS', data.moments_num)
  store.commit('SET_USER_INFO', {
    nickname: data.nickname,
    avatar: data.avatar,
    desc: data.desc,
    sex: data.sex,
    created_at: data.created_at,
    id: data.id
  })
}

export default async (to, from, next) => {
  if (store.state['hasLogin']) { return next() }

  const userToken = LS.getItem('userToken') || ''
  if (userToken) {
    const sdk = new SDK()
    await sdk.quickLogin().then(res => {
      const data = res.data.data
      initStoreInfo(data)
      webSocket.connect()
      return next()
    }).catch(err => {
      if (err) { console.log('登陆信息验证不通过: ' + err) }
      LS.removeItem('userToken')
      return next()
    })
  } else if (NEED_AUTH_ROUTE.includes(to.name)) {
    return next('/entry')
  }
  next()
}
