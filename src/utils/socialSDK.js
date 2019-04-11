import axios from 'axios'

const apiDomain = 'http://localhost:9002/api'

export default class SDK {
  constructor () {
    this.apiDomain = apiDomain
    this.axios = axios
    // this.axios.defaults.withCredentials = true
    this.axios.interceptors.request.use(function (config) {
      config.withCredentials = true
      config.headers['Authorization'] = localStorage.getItem('userToken') || ''
      return config
    })
  }

  // 账号密码登陆
  login (account, password, captcha) {
    const url = this.apiDomain + '/signIn'
    return this.axios.post(url, {
      account,
      password,
      captcha
    })
  }

  // 快速登陆
  quickLogin () {
    const url = this.apiDomain + '/signIn/quick'
    return this.axios.post(url)
  }

  // 注册
  signUp (nickname, sex, account, password, captcha) {
    const url = this.apiDomain + '/signUp'
    return this.axios.post(url, {
      nickname,
      sex,
      account,
      password,
      captcha
    })
  }

  // 编辑个人信息
  editUserInfo (data) {
    const url = this.apiDomain + '/user/editInfo'
    return this.axios.post(url, data)
  }

  // 获取用户基本信息
  getUserInfo (targetId) {
    const url = this.apiDomain + '/user/info'
    return this.axios.get(url, {
      params: {
        targetId
      }
    })
  }

  // 搜索用户
  searchUser (keyword, page, size) {
    const url = this.apiDomain + '/user/search'
    return this.axios.get(url, {
      params: {
        keyword,
        page,
        size
      }
    })
  }

  // 获取用户关注列表
  getUserFollows (targetId, page, size) {
    const url = this.apiDomain + '/user/info/follows'
    return this.axios.get(url, {
      params: {
        targetId,
        page,
        size
      }
    })
  }

  // 获取用户粉丝列表
  getUserFans (targetId, page, size) {
    const url = this.apiDomain + '/user/info/fans'
    return this.axios.get(url, {
      params: {
        targetId,
        page,
        size
      }
    })
  }

  // 关注
  follow (targetId, flag) {
    const url = this.apiDomain + '/user/follow'
    return this.axios.post(url, {
      targetId,
      flag
    })
  }

  // 发布动态
  postMoment (data, flag) {
    const url = this.apiDomain + '/moment?withFlag=' + flag
    return this.axios.post(url, data)
  }

  // 获取动态
  getMoment (flag, page, size, targetId) {
    const url = this.apiDomain + '/moment'
    return this.axios.get(url, {
      params: {
        flag,
        page,
        size,
        targetId
      }
    })
  }

  getSingleMoment (momentId) {
    const url = this.apiDomain + '/moment/single'
    return this.axios.get(url, {
      params: {
        momentId
      }
    })
  }

  // 获取评论
  getMomentComment (momentId, page, size) {
    const url = this.apiDomain + '/moment/comment'
    return this.axios.get(url, {
      params: {
        momentId,
        page,
        size
      }
    })
  }

  // 删除评论
  deleteComment (momentId, commentId) {
    const url = this.apiDomain + '/moment/comment'
    return this.axios.delete(url, {
      params: {
        momentId,
        commentId
      }
    })
  }

  // 删除回复
  deleteReply (commentId, subCommentId) {
    const url = this.apiDomain + '/moment/comment/sub'
    return this.axios.delete(url, {
      params: {
        commentId,
        subCommentId
      }
    })
  }

  // 搜索动态
  searchMoment (keyword, page, size) {
    const url = this.apiDomain + '/moment/search'
    return this.axios.get(url, {
      params: {
        keyword,
        page,
        size
      }
    })
  }

  // 点赞动态
  likeMoment (momentId, flag) {
    const url = this.apiDomain + '/moment/like'
    return this.axios.post(url, {
      momentId,
      flag
    })
  }

  // 评论动态
  commentMoment (momentId, content) {
    const url = this.apiDomain + '/moment/comment'
    return this.axios.post(url, {
      momentId,
      content
    })
  }

  // 回复评论
  replyComment (commentId, content, momentId) {
    const url = this.apiDomain + '/moment/comment/sub'
    return this.axios.post(url, {
      momentId,
      commentId,
      content
    })
  }

  // 删除动态
  deleteMoment (id) {
    const url = this.apiDomain + '/moment'
    return this.axios.delete(url, {
      params: {
        id
      }
    })
  }

  // 获取未读消息
  getUnReadNotification () {
    const url = this.apiDomain + '/notification/unRead'
    return this.axios.get(url)
  }

  // 获取已读消息
  getHasReadNotification () {
    const url = this.apiDomain + '/notification/hasRead'
    return this.axios.get(url)
  }

  // 读消息
  readNotification (id) {
    const url = this.apiDomain + '/notification/read'
    return this.axios.post(url, {
      id
    })
  }

  // 清除消息
  clearNotification () {
    const url = this.apiDomain + '/notification/clear'
    return this.axios.delete(url)
  }

  // 获取热门话题
  getTrendingTopics () {
    const url = this.apiDomain + '/topic/trending'
    return this.axios.get(url)
  }
}
