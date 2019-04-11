<script>
import SDK from '../utils/socialSDK.js'
import mixin from '../mixin.js'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  mixins: [mixin],

  computed: {
    ...mapState([
      'showNotification', 'unReadNotifications', 'hasReadNotifications'
    ])
  },

  methods: {
    ...mapMutations([
      'SHOW_NOTIFICATION', 'CLEAR_UNREAD_NOTIFICATION', 'CLEAR_HASREAD_NOTIFICATION', 'READ_NOTIFICATION'
    ]),

    ...mapActions([
      'FETCH_HASREAD_NOTIFICATION'
    ]),

    genNotificationInfo (item) {
      item = item.option
      switch (item.flag) {
        case 'moment_mention':
          return item.from_name + ' 在动态中提及到了你'
        case 'moment_comment':
          return item.from_name + ' 评论了你的动态'
        case 'comment_mention':
          return item.from_name + ' 在评论中提及到了你'
        case 'comment_reply':
          return item.from_name + ' 回复了你的评论'
        case 'follow':
          return item.from_name + ' 关注了你'
        case 'like':
          return item.from_name + ' 点赞了你的动态'
        default:
          return ''
      }
    },

    signAllUnRead () {
      if (!this.unReadNotifications.length) return
      let sdk = new SDK()
      let id = []
      this.unReadNotifications.forEach(item => {
        id.push(item._id)
      })
      sdk.readNotification(id).then(res => {
        this.CLEAR_UNREAD_NOTIFICATION()
        this.FETCH_HASREAD_NOTIFICATION()
      })
    },

    clearAllHasRead () {
      if (!this.hasReadNotifications.length) return
      let sdk = new SDK()
      sdk.clearNotification().then(() => {
        this.CLEAR_HASREAD_NOTIFICATION()
      })
    },

    readNotification (item, index) {
      let redirectUrl = ''
      let itemOption = item.option
      switch (itemOption.flag) {
        case 'follow':
          redirectUrl = '/user?navFlag=fans'
          break
        default:
          redirectUrl = '/moment?id=' + itemOption.origin_moment
      }

      if (!item.hasRead) {
        this.READ_NOTIFICATION(index)
        new SDK().readNotification(item._id)
      }

      this.SHOW_NOTIFICATION(false)
      this.$router.push(redirectUrl)
    }
  }
}
</script>

<template>
  <aside class="notification-side-bar">
    <transition name="slide">
      <div class="wrapper" v-show="showNotification">

        <i class="el-icon-close" @click="() => { SHOW_NOTIFICATION(false) }"></i>

        <div class="headline">
          <h1 class="title">未读消息</h1>
          <h1 class="all-read" @click="signAllUnRead">全部标记已读</h1>
        </div>
        <ul class="notification-list">
          <li v-for="(item, index) in unReadNotifications"
              :key="index"
              @click="readNotification(item, index)">
            <el-badge is-dot>
              <div class="notification-list-item">
                <div class="info">{{genNotificationInfo(item)}}</div>
                <div class="time-before">{{getDateDict(item.created_at)}}</div>
              </div>
            </el-badge>
          </li>
          <li class="no-notification" v-if="!unReadNotifications.length">暂无消息</li>
        </ul>

        <div class="headline">
          <h1 class="title">已读消息</h1>
          <h1 class="all-clear" @click="clearAllHasRead">全部清除</h1>
        </div>
        <ul class="notification-list">
          <li v-for="(item, index) in hasReadNotifications"
              :key="index"
              @click="readNotification(item, index)">
            <div class="notification-list-item">
              <div class="info">{{genNotificationInfo(item)}}</div>
              <div class="time-before">{{getDateDict(item.created_at)}}</div>
            </div>
          </li>
          <li class="no-notification" v-if="!hasReadNotifications.length">暂无消息</li>
        </ul>

      </div>
    </transition>

    <transition name="el-fade-in">
      <div class="mask" v-show="showNotification" @click="() => { SHOW_NOTIFICATION(false) }"></div>
    </transition>
  </aside>
</template>

<style lang="scss" scoped>
@import '../sass/variable.scss';
@import '../sass/mixins.scss';
.notification-side-bar {
  .wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    padding-top: 30px;
    width: 320px;
    background: #eee;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    overflow: auto;
    z-index: 1000;
    transform: translate3d(0, 0, 0);

    .el-icon-close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 1.3em;
      color: #333;
      cursor: pointer;
    }

    .headline {
      display: flex;
      justify-content: space-between;
      margin: 10px 15px;
      font-weight: bold;

      .all-read, .all-clear {
        cursor: pointer;
      }
    }

    .notification-list {
      margin: 10px 15px 40px;
      /deep/ .el-badge {
        width: 100%;
      }
      .notification-list-item {
        display: flex;
        margin-bottom: 10px;
        padding: 16px 10px;
        box-sizing: border-box;
        width: 100%;
        /* font-weight: bold; */
        background: #fff;
        border-radius: 8px;
        cursor: pointer;

        .info {
          flex: 1;
          @include wrap-ellipsis;
        }
        .time-before {
          color: #aaa;
        }
        &:hover {
          background: #ddd;
        }
      }
      .no-notification {
        text-align: center;
        font-weight: bold;
      }
    }
  }

  .mask {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .7);
    z-index: 90;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(320px, 0, 0);
  }
  .slide-enter-active, .slide-leave-active {
    transition: all .4s;
  }
}
</style>
