<script>
import Moment from '../../components/common/Moment'
import MiniUser from '../../components/common/MiniUser'
import ClickMore from '../../components/common/ClickMore'
import SDK from '../../utils/socialSDK.js'
import { mapMutations } from 'vuex'

export default {
  name: 'Search',
  components: {
    Moment,
    MiniUser,
    ClickMore
  },

  data () {
    return {
      keyword: '',
      navFlag: 'moments',

      moments: [],
      users: [],

      searchLoading: true,
      searchComplete: false,
      page: 1,
      size: 15
    }
  },

  methods: {
    ...mapMutations([
      'HIDE_HEADER'
    ]),

    handleSelect (key) {
      this.navFlag = key
      this.goSearch()
    },

    goSearch () {
      this.moments = []
      this.users = []
      this.page = 1
      this.searchComplete = false
      this.loadSearchResult()
    },

    async loadSearchResult () {
      if (this.searchComplete) return
      const sdk = new SDK()
      let result
      this.searchLoading = true
      if (this.navFlag === 'moments') {
        result = await sdk.searchMoment(this.keyword, this.page, this.size)
        this.moments = this.moments.concat(result.data.data)
      } else if (this.navFlag === 'users') {
        result = await sdk.searchUser(this.keyword, this.page, this.size)
        this.users = this.users.concat(result.data.data)
      }
      ++this.page
      this.searchLoading = false
      if (result.data.data.length < this.size) {
        this.searchComplete = true
      }
    }
  },

  mounted () {
    this.loadSearchResult()
  },

  created () {
    this.HIDE_HEADER(false)
    this.keyword = this.$route.query['kw'] || ''
  }

}
</script>

<template>
  <section class="social-search">
    <div class="wrapper-top">
      <div class="input-box">
        <el-input placeholder="搜索" prefix-icon="el-icon-search" class="inputBox"
                  v-model="keyword"
                  @keyup.enter.native="goSearch">
        </el-input>
        <el-button type="primary" size="mini" class="search-btn" @click="goSearch">搜索</el-button>
      </div>

      <div class="nav-bar">
        <el-menu :default-active="navFlag" active-text-color="#409eff" mode="horizontal" @select="handleSelect" class="menu">
          <el-menu-item :index="'moments'">找动态</el-menu-item>
          <el-menu-item :index="'users'">找用户</el-menu-item>
        </el-menu>
      </div>
    </div>

    <div class="wrapper-body">
      <ClickMore
        :loading="searchLoading"
        :completed="searchComplete">
        <template v-if="navFlag === 'moments'">
          <moment
              v-for="(item) in moments"
              :key="item._id"
              :data="item"
              :hideDeleteBtn="true"/>
              <!-- @delete="deleteMoment(item._id, index)"/> -->
        </template>

        <template v-if="navFlag === 'users'">
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
.social-search {
  margin: 20px auto;
  width: 580px;

  .wrapper-top {
    margin-bottom: 20px;
    box-sizing: border-box;
    @include round-shadow-card;

    .input-box {
      display: flex;
      padding: 20px;
      .search-btn {
        margin-left: 30px;
      }
    }

    .menu {
      margin: 0W auto;
    }
  }

  .wrapper-body {
    .user-card {
      display: inline-block;
      margin: 0 11px 10px 0;
    }
  }

}
</style>
