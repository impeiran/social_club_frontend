<script>
import mixin from '../mixin.js'
import { mapState } from 'vuex'

export default {
  mixins: [mixin],

  computed: {
    ...mapState([
      'hasLogin', 'totalFollows', 'totalFans', 'totalMoments', 'authUserInfo'
    ])
  },

  methods: {
    goUserWithFlag (flag) {
      this.$router.push('/user?navFlag=' + flag)
    },
    goEdit () {
      this.$router.push('/user/edit')
    }
  }
}
</script>

<template>
  <aside class="user-widget">
    <div class="banner"></div>
    <div class="user-body">
      <img :src="this.userAvatar" class="avatar">
      <router-link :to="hasLogin ? '/user' : '/entry'">
        <h4 class="name">{{hasLogin ? authUserInfo.nickname : '未登陆'}}</h4>
      </router-link>

      <template v-if="hasLogin">
        <ul class="info-panel">
          <li @click="goUserWithFlag('follows')">
            <span class="number">{{totalFollows}}</span>
            <span class="label">关注</span>
          </li>
          <li @click="goUserWithFlag('fans')">
            <span class="number">{{totalFans}}</span>
            <span class="label">粉丝</span>
          </li>
          <li @click="goUserWithFlag('totalMoments')">
            <span class="number">{{totalMoments}}</span>
            <span class="label">动态</span>
          </li>
        </ul>

        <el-button plain
                  size="small"
                  icon="el-icon-edit-outline"
                  class="edit-btn"
                  @click="goEdit"
        >编辑个人资料</el-button>
      </template>

    </div>
  </aside>
</template>

<style lang="scss" scoped>
@import '../sass/variable.scss';
@import '../sass/mixins.scss';
.user-widget {
  margin: 10px 0 20px;
  width: 100%;
  min-height: 136px;
  @include round-shadow-card;

  .banner {
    margin-bottom: -30px;
    width: 100%;
    height: 59px;
    background: $themeColor;
  }

  .avatar {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 4px;
    width: 60px;
    height: 60px;
    border: 1px solid rgba(0, 0, 0, .1);
    border-radius: 50%;
    object-fit: cover;
  }

  .name {
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    &:hover {
      color: $themeColor;
    }
  }

  .info-panel {
    display: flex;
    justify-content: space-around;
    margin: 20px 0 0;

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

  .edit-btn {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin: 30px auto 10px;
    width: 230px;
  }
}
</style>
