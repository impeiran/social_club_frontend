import store from './store'

const LS = localStorage || window.localStorage
const WS_API = 'ws://111.230.157.91:9009'

let WebServer

export const connect = () => {
  const token = LS.getItem('userToken')
  if (!token) return

  WebServer = new WebSocket(WS_API + '?token=' + token)

  WebServer.onopen = e => {
    console.log('connected ' + WS_API)
  }

  WebServer.onmessage = e => {
    if (!e || !e.data) return

    let data = JSON.parse(e.data)
    data.option = JSON.parse(data.option)
    store.commit('ADD_UNREAD_NOTIFICATION', data)
  }
}
