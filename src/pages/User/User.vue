<script>
import Moment from '../../components/common/Moment'
import MiniUser from '../../components/common/MiniUser'
import ClickMore from '../../components/common/ClickMore'
import Loading from '../../components/common/Loading'
import SDK from '../../utils/socialSDK.js'
import mixin from '../../mixin.js'
import defaultAvatar from '../../assets/default_avatar.jpg'
import { mapState, mapMutations } from 'vuex'

export default {
  mixins: [mixin],

  components: {
    Moment, MiniUser, ClickMore, Loading
  },

  data () {
    return {
      defaultAvatar: '',
      navFlag: '',

      moments: [],
      users: [],

      userId: '',
      nickname: '',
      avatar: '',
      desc: '',
      sex: undefined,
      fans_num: undefined,
      follows_num: undefined,
      moments_num: undefined,
      hasFollowed: undefined,

      page: 1,
      size: 15,
      completed: false,
      loadingResult: true
    }
  },

  computed: {
    ...mapState([
      'authUserInfo', 'totalFollows', 'totalFans', 'totalMoments'
    ])
  },

  methods: {
    ...mapMutations([
      'HIDE_HEADER', 'SET_FOLLOWS', 'SET_MOMENTS'
    ]),

    handleEdit () {
      this.$router.push('/user/edit')
    },

    clearInfoData () {
      this.avatar = ''
      this.nickname = ''
      this.desc = ''
      this.sex = undefined
      this.moments_num = 0
      this.follows_num = 0
      this.fans_num = 0
    },

    clearLoadedData () {
      this.page = 1
      this.completed = false
      this.moments = []
      this.users = []
    },

    handleSelect (key) {
      this.navFlag = key
      this.clearLoadedData()
      this.loadResults()
    },

    deleteMoment (id, index) {
      const _this = this
      const sdk = new SDK()
      sdk.deleteMoment(id).then(() => {
        _this.SET_MOMENTS(this.totalMoments - 1)
        _this.moments.splice(index, 1)
        _this.$message({message: '删除成功', type: 'success'})
      })
    },

    toggleFollow () {
      const requestFollow = (flag) => {
        const sdk = new SDK()
        sdk.follow(this.userId, flag)
          .then(() => {
            this.hasFollowed = flag === 'follow'
            this.SET_FOLLOWS(flag === 'cancel' ? this.totalFollows - 1 : this.totalFollows + 1)
          })
      }

      if (this.hasFollowed) {
        this.$confirm('你确定要取消此用户吗', { lockScroll: false, type: 'warning' })
          .then(() => {
            requestFollow('cancel')
          })
          .catch()
      } else {
        requestFollow('follow')
      }
    },

    async loadResults () {
      if (this.completed) return
      this.loadingResult = true
      const sdk = new SDK()
      let result = []
      if (this.navFlag === 'totalMoments') {
        const res = await sdk.getMoment('targetMoments', this.page, this.size, this.userId)
        result = res.data.data
        this.moments = this.moments.concat(result)
      } else if (this.navFlag === 'likeMoments') {
        const res = await sdk.getMoment('likeMoments', this.page, this.size, this.userId)
        result = res.data.data
        this.moments = this.moments.concat(result)
      } else if (this.navFlag === 'follows') {
        const res = await sdk.getUserFollows(this.userId, this.page, this.size)
        result = res.data.data
        this.users = this.users.concat(result)
      } else if (this.navFlag === 'fans') {
        const res = await sdk.getUserFans(this.userId, this.page, this.size)
        result = res.data.data
        this.users = this.users.concat(result)
      }

      this.page++
      this.loadingResult = false

      if (result.length < this.size) {
        this.completed = true
      }
    },

    initUserInfo () {
      if (this.userId === this.authUserInfo.id) {
        this.avatar = this.authUserInfo.avatar
        this.nickname = this.authUserInfo.nickname
        this.desc = this.authUserInfo.desc
        this.sex = this.authUserInfo.sex
        this.moments_num = this.totalMoments
        this.follows_num = this.totalFollows
        this.fans_num = this.totalFans
      } else {
        const sdk = new SDK()
        sdk.getUserInfo(this.userId).then(res => {
          const data = res.data.data
          this.avatar = data.avatar
          this.nickname = data.nickname
          this.desc = data.desc
          this.sex = data.sex
          this.moments_num = data.moments_num
          this.follows_num = data.follows_num
          this.fans_num = data.fans_num
          this.hasFollowed = data.hasFollowed
        })
      }
    }
  },

  mounted () {
    this.initUserInfo()
    this.loadResults()
    this.$watch('$route.query.id', newVal => {
      this.navFlag = 'totalMoments'
      this.userId = newVal || this.authUserInfo.id
      this.clearInfoData()
      this.clearLoadedData()
      this.initUserInfo()
      this.loadResults()
    })
  },

  created () {
    const {id, navFlag} = this.$route.query
    this.userId = id || this.authUserInfo.id
    this.navFlag = navFlag || 'totalMoments'
    this.defaultAvatar = defaultAvatar
    this.HIDE_HEADER(false)
  }
}
</script>

<template>
  <section class="social-user">

    <div class="user-header">
      <div class="avatar-box">
        <img :src="avatar || defaultAvatar" class="avatar">
      </div>

      <el-button
        class="follow-btn"
        size="mini"
        v-if="userId !== authUserInfo.id"
        :type="hasFollowed ? '' : 'primary'"
        :icon="hasFollowed ? '' : 'el-icon-plus'"
        :plain="hasFollowed"
        @click="toggleFollow"
        >{{hasFollowed ? '已关注' : '关注'}}</el-button>
      <el-button
        class="edit-btn"
        icon="el-icon-edit-outline"
        size="mini"
        plain
        v-else
        @click="handleEdit"
      >编辑</el-button>

      <h1 class="name">
        {{nickname}}
        <i  v-if="sex" class="fa" :class="sex === 1 ? 'fa-mars' : 'fa-venus'"></i>
      </h1>

      <ul class="info-panel">
        <li @click="handleSelect('follows')">
          <span class="number">{{follows_num}}</span>
          <span class="label">关注</span>
        </li>
        <li @click="handleSelect('fans')">
          <span class="number">{{fans_num}}</span>
          <span class="label">粉丝</span>
        </li>
        <li @click="handleSelect('totalMoments')">
          <span class="number">{{moments_num}}</span>
          <span class="label">动态</span>
        </li>
      </ul>

      <h3 class="desc">简介：{{desc || '这家伙很懒，什么都不写'}}</h3>
    </div>

    <div class="nav-bar">
      <el-menu :default-active="navFlag" active-text-color="#409eff" mode="horizontal" @select="handleSelect" class="menu" >
        <el-menu-item :index="'totalMoments'">所有动态</el-menu-item>
        <el-menu-item :index="'likeMoments'">赞的动态</el-menu-item>
        <el-menu-item :index="'follows'">关注的人</el-menu-item>
        <el-menu-item :index="'fans'">全部粉丝</el-menu-item>
      </el-menu>
    </div>

    <div class="result-wrapper">

      <Loading :loading.sync="loadingResult"></Loading>
      <ClickMore
        :loading="loadingResult"
        :completed="completed"
        @loadMore="loadResults">

        <!-- 动态 && 喜欢的动态 -->
        <template v-if="['totalMoments', 'likeMoments'].includes(navFlag) && moments.length">
          <moment
              v-for="(item, index) in moments"
              :key="item._id"
              :data="item"
              :hideFollowBtn="true"
              @delete="deleteMoment(item._id, index)"/>
        </template>

        <!-- 关注的人 && 粉丝 -->
        <template v-else>
          <mini-user
            v-for="item in users"
            :key="item._id"
            :data="item"
            class="user-card" />
        </template>
      </ClickMore>

    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '../../sass/variable.scss';
@import '../../sass/mixins.scss';
.social-user {
  margin: 20px auto;
  width: 580px;

  .user-header {
    position: relative;
    padding: 20px;
    @include round-shadow-card;

    .avatar-box {
      margin-bottom: 20px;
      text-align: center;
      img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, .1);
        object-fit: cover;
      }
    }

    h1.name {
      margin: 0 auto;
      font-size: 1.6em;
      font-weight: bold;
      text-align: center;
      overflow: hidden;
    }

    .edit-btn,
    .follow-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }

    .info-panel {
      display: flex;
      justify-content: space-around;
      margin: 20px auto 0;
      width: 300px;

      li {
        width: 50px;
        cursor: pointer;
        span {
          display: block;
          text-align: center;
          font-size: 14px;
          &.number {
            font-weight: bold;
            font-size: 16px;
          }
        }
        &:hover {
          .number {
            color: $themeColor;
          }
        }
      }
    }

    h3.desc {
      margin: 20px auto 0;
      width: 300px;
      line-height: 26px;
      text-align: center;
      font-weight: bold;
    }
  }

  .nav-bar {
    margin: 20px auto;
    @include round-shadow-card;
  }

  .result-wrapper {
    margin: 20px auto;
  }

  .user-card {
    display: inline-block;
    margin: 0 11px 10px 0;
  }
}
</style>
