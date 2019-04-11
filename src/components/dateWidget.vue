<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      today: ''
    }
  },

  computed: {
    ...mapState([
      'hasLogin', 'authUserInfo'
    ]),

    hasJoined () {
      let result = 0
      if (this.hasLogin && this.authUserInfo) {
        let diff = ((+new Date() - new Date(this.authUserInfo.created_at).getTime())) / 1000 / 60 / 60 / 24
        result = Math.ceil(diff)
      }
      return result
    }
  },

  mounted () {
  },

  created () {
    const date = new Date()
    const month = (date.getMonth() + 1).toString()
    const day = date.getDate().toString()
    this.today = month + '/' + day
  }
}
</script>

<template>
  <aside class="date-widget">
    <div class="widget-head">Today</div>
    <h1>{{today}}</h1>
    <div class="widget-footer">
      {{ hasLogin ? `加入SocialClub的第${hasJoined}天` : 'SocialClub期待你的加入'}}
    </div>
  </aside>
</template>

<style lang="scss" scoped>
@import '../sass/variable.scss';
@import '../sass/mixins.scss';
.date-widget {
  position: relative;
  margin: 10px 0 20px;
  height: 233px;
  box-sizing: border-box;
  @include round-shadow-card;

  .widget-head {
    height: 59px;
    line-height: 59px;
    color: #fff;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    background: $themeColor;
  }

  h1 {
    margin-top: 20px;
    color: $themeColor;
    font-weight: bold;
    font-size: 6em;
    text-align: center;
  }

  .widget-footer {
    position: absolute;
    bottom: 0;
    padding: 0 10px;
    width: 100%;
    min-height: 40px;
    line-height: 40px;
    color: $themeColor;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
    border-top: 1px solid #eee;
  }
}
</style>
