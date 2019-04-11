<script>
import defaultAvatar from '../../assets/default_avatar.jpg'
import SDK from '../../utils/socialSDK.js'
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    data: { type: Object, required: true }
  },

  data () {
    return {
      defaultAvatar: '',

      isFollowed: undefined
    }
  },

  computed: {
    ...mapState([
      'authUserInfo', 'totalFollows'
    ]),

    checkIsSameStyle () {
      return this.authUserInfo.id === this.data._id ? { visibility: 'hidden' } : {}
    }
  },

  methods: {
    ...mapMutations([
      'SET_FOLLOWS'
    ]),

    goFollow () {
      const sdk = new SDK()
      if (this.isFollowed) {
        this.$confirm('确定要对他取消关注吗？', { type: 'warning', lockScroll: false })
          .then(() => {
            sdk.follow(this.data._id, 'cancel').then(() => {
              this.isFollowed = false
              this.SET_FOLLOWS(this.totalFollows - 1)
            })
          }).catch(() => {})
      } else {
        sdk.follow(this.data._id, 'follow').then(() => {
          this.isFollowed = true
          this.SET_FOLLOWS(this.totalFollows + 1)
        })
      }
    }
  },

  created () {
    this.defaultAvatar = defaultAvatar
    this.isFollowed = this.data.hasFollowed
  }
}
</script>

<template>
  <div class="mini-user">
    <div class="avatar-box">
      <img :src="data.avatar || defaultAvatar" class="avatar">
    </div>
    <div class="content">
      <h3>
        <router-link :to="'/user?id=' + data._id">{{data.nickname}}</router-link>
      </h3>
      <h4>简介：{{ data.desc ||  '这个人很懒什么都不写'}}</h4>
      <el-button
        class="follow-btn"
        size="mini"
        :icon="isFollowed ? '' : 'el-icon-plus'"
        :type="isFollowed ? 'default' : 'primary'"
        :style="checkIsSameStyle"
        @click="goFollow"
      >{{isFollowed ? '已关注' : '关注'}}</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../sass/variable.scss';
@import '../../sass/mixins.scss';
.mini-user {
  padding: 10px;
  box-sizing: border-box;
  width: 182px;
  @include round-shadow-card;

  .avatar-box {
    box-sizing: border-box;
    text-align: center;
    .avatar {
      height: 60px;
      width: 60px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .content {
    h3, h4 {
      margin-bottom: 4px;
      text-align: center;
      font-weight: bold;
      @include wrap-ellipsis;
    }
    h4 {
      font-weight: normal;
    }
    .follow-btn {
      width: 100%;
    }
  }
}
</style>
