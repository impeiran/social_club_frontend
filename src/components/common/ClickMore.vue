<script>
export default {
  props: {
    loading: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    useCardLayout: { type: Boolean, default: true },
    noMoreText: { type: String, default: '加载完毕，已无更多数据' }
  },

  computed: {
    tipClassStyle () {
      return this.useCardLayout ? 'card' : ''
    }
  },

  methods: {
    clickMore () {
      if (this.completed) return
      this.$emit('loadMore')
    }
  }
}
</script>

<template>
  <figure>
    <slot></slot>
    <div class="to-click" :class="tipClassStyle"  v-if="!loading && !completed" @click="clickMore">点击加载更多</div>
    <div class="is-loading" :class="tipClassStyle" v-if="loading && !completed">正在玩命加载中</div>
    <div class="no-more" :class="tipClassStyle" v-if="!loading && completed ">{{noMoreText}}</div>
  </figure>
</template>

<style lang="scss" scoped>
@import '../../sass/mixins.scss';
.to-click {
  cursor: pointer;
}
.to-click,
.is-loading,
.no-more {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}
.to-click.card,
.is-loading.card,
.no-more.card {
  padding: 20px;
  @include round-shadow-card;
}
</style>
