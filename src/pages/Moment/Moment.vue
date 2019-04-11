<script>
import MomentItem from '../../components/common/Moment'
import SDK from '../../utils/socialSDK.js'

export default {
  components: {
    MomentItem
  },

  data () {
    return {
      rendered: false,
      momentId: '',
      momentInfo: {}
    }
  },

  methods: {
    fetchMomentInfo () {
      if (!this.momentId) return
      const sdk = new SDK()
      sdk.getSingleMoment(this.momentId).then(res => {
        const data = res.data.data
        if (data && data.length) {
          this.rendered = true
          this.momentInfo = data[0]
        } else {
          this.$alert('找不到此动态或已被删除！', { type: 'error', lockScroll: false })
        }
      })
    }
  },

  mounted () {
    this.momentId = this.$route.query['id'] || ''
    this.fetchMomentInfo()
  }
}
</script>

<template>
  <section class="social-moment-page">
    <MomentItem v-if="rendered"
                class="moment-item"
                :data="momentInfo"
                :hideDeleteBtn="true"></MomentItem>
  </section>
</template>

<style lang="scss" scoped>
.moment-item {
  margin: 20px auto;
  width: 580px;
}
</style>
