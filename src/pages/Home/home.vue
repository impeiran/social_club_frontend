<script>
import dateWidget from '../../components/dateWidget'
import momentPoster from '../../components/momentPoster'
import userWidget from '../../components/userWidget'
import trendingList from '../../components/trendingList'
import Moment from '../../components/common/Moment'
import backToTop from '../../components/common/backToTop'
import Loading from '../../components/common/Loading'
import ClickMore from '../../components/common/ClickMore'
import mixin from '../../mixin.js'
import SDK from '../../utils/socialSDK.js'
import { mapState, mapMutations } from 'vuex'

export default {
  mixins: [mixin],

  name: 'Home',

  components: {
    userWidget, trendingList, momentPoster, dateWidget, Moment, ClickMore, Loading, backToTop
  },

  data () {
    return {
      menuFlag: 'latest',
      moments: [],
      trendingListData: [],

      momentLoading: true,
      momentComplete: false,
      currentPage: 1,
      size: 15
    }
  },

  computed: {
    ...mapState([
      'hasLogin', 'authUserInfo', 'totalMoments', 'totalFollows'
    ])
  },

  methods: {
    ...mapMutations([
      'HIDE_HEADER', 'SET_MOMENTS', 'SET_FOLLOWS'
    ]),

    menuSelectHandler (index) {
      this.menuFlag = index
      this.momentComplete = false
      this.currentPage = 1
      this.moments = []
      this.loadMoments()
    },

    afterPostMoment () {
      this.menuFlag = 'latest'
      this.momentComplete = false
      this.currentPage = 1
      this.moments = []
      this.loadMoments()
    },

    getTrendingList () {
      new SDK().getTrendingTopics().then(res => {
        this.trendingListData = res.data.data
      })
    },

    toggleFollow (momentId, targetId, flag) {
      const sdk = new SDK()
      sdk.follow(targetId, flag)
        .then(() => {
          this.SET_FOLLOWS(flag === 'cancel' ? this.totalFollows - 1 : this.totalFollows + 1)
        })
      let newMoments = JSON.parse(JSON.stringify(this.moments))
      for (let item of newMoments) {
        if (item.author._id === targetId) {
          item.author.hasFollowed = !item.author.hasFollowed
        }
      }
      this.moments = newMoments
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

    loadMoments () {
      if (this.momentComplete) return
      this.momentLoading = true
      const sdk = new SDK()
      sdk.getMoment(this.menuFlag, this.currentPage, this.size).then(res => {
        const data = res.data.data
        this.moments = this.moments.concat(data)
        this.currentPage++
        this.momentLoading = false
        if (data.length < this.size) {
          this.momentComplete = true
        }
      })
    }
  },

  mounted () {
    this.getTrendingList()
    this.loadMoments()
  },

  created () {
    this.HIDE_HEADER(false)
  }
}
</script>

<template>
  <section class="social-home-page">

    <div class="left-side">
      <keep-alive>
        <date-widget />
      </keep-alive>

      <el-menu class="home-menu"
               :default-active="menuFlag"
               @select="menuSelectHandler">
        <el-menu-item index="latest">最新动态</el-menu-item>
        <el-menu-item index="myFollows" v-if="hasLogin">我的关注</el-menu-item>
        <el-menu-item index="myMoments" v-if="hasLogin">我的动态</el-menu-item>
      </el-menu>
    </div>

    <div class="middle-side">
      <keep-alive>
        <moment-poster @needRefreshMoment="afterPostMoment" />
      </keep-alive>
      <Loading :loading.sync="!moments.length && momentLoading"></Loading>
      <div class="moment-wrapper" >
        <ClickMore
          :loading="momentLoading"
          :completed="momentComplete"
          @loadMore="loadMoments">
            <moment
              v-for="(item, index) in moments"
              :key="item._id"
              :data="item"
              @toggleFollow="flag => toggleFollow(item._id, item.author._id, flag)"
              @delete="deleteMoment(item._id, index)" />
        </ClickMore>
      </div>

    </div>

    <div class="right-side">
      <user-widget />
      <trending-list :data="trendingListData" @refresh="getTrendingList" />
    </div>

    <back-to-top class="backTop"></back-to-top>
  </section>
</template>

<style lang="scss" scoped>
@import '../../sass/variable.scss';
@import '../../sass/mixins.scss';
.social-home-page {
  display: flex;
  margin: 0 auto;
  width: 1120px;
  position: relative;

  .left-side {
    margin: 10px;
    width: 250px;

    .home-menu {
      margin: 10px 0 0;
      @include round-shadow-card;
    }

    /deep/ .el-menu {
      border-right: none;
    }
  }

  .middle-side {
    margin: 10px;
    width: 600px;

    .my-loading {
      text-align: center;
      color: #128fdc;
      margin: 10px auto;
      font-size: 3em;
    }
  }

  .right-side {
    margin: 10px;
    width: 250px;
  }

  .backTop {
    position: fixed;
    bottom: 70px;
    right: 70px;
  }
}

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: all .4s;
}
</style>
