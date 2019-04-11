<script>
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },

  methods: {
    goSearchWithQuery (query) {
      this.$router.push('/search?kw=' + encodeURIComponent(`#${query}#`))
    },

    addTrendItemStyle (index) {
      switch (index + 1) {
        case 1:
          return { color: 'red', fontWeight: 'bold' }
        case 2:
          return { color: 'orange', fontWeight: 'bold' }
        case 3:
          return { color: 'rgb(255, 231, 147)', fontWeight: 'bold' }
        default:
          return {}
      }
    },

    refresh () {
      this.$emit('refresh')
    }
  }
}
</script>

<template>
  <el-card class="trending-list">
    <div slot="header" class="clearfix">
      <span class="headline">热门话题</span>
      <i class="refresh el-icon-refresh" @click="refresh"></i>
    </div>

    <ul class="item-list" v-if="data && data.length">
      <li v-for="(item, index) in data"
          :key="item._id"
          :style="addTrendItemStyle(index)"
          @click="goSearchWithQuery(item.title)"
      >
      {{index + 1}}. <span class="title">{{item.title}}</span></li>
    </ul>

    <div v-else>暂无数据</div>
  </el-card>
</template>

<style lang="scss" scoped>
@import '../sass/variable.scss';
@import '../sass/mixins.scss';
.trending-list {
  margin: 10px 0 20px;

  .refresh {
    float: right;
    font-weight: bold;
    font-size: 1.2em;
    cursor: pointer;
  }

  .headline {
    font-size: 14px;
    font-weight: bold;
  }

  .item-list {
    li {
      line-height: 28px;
      cursor: pointer;
      transition: all .3s;
      @include wrap-ellipsis;

      &:hover {
        .title {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
