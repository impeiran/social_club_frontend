<script>
import Sortable from 'sortablejs'
import SDK from '../utils/socialSDK.js'
import mixin from '../mixin.js'
import { mapState, mapMutations } from 'vuex'

const VIDEO_SIZE_LIMIT = 20 * 1024 * 1024

export default {
  mixins: [mixin],
  data () {
    return {
      postMomentLoading: false,
      content: '',
      previewVideo: '',
      previewPhotos: []
    }
  },

  computed: {
    ...mapState([
      'totalMoments'
    ])
  },

  methods: {
    ...mapMutations([
      'SET_MOMENTS'
    ]),

    removePhotos (index) {
      this.previewPhotos.splice(index, 1)
      this.photosFileList.splice(index, 1)
    },

    removeVideo () {
      this.previewVideo = ''
      this.videoFile = null
    },

    clearAll () {
      this.previewPhotos = []
      this.photosFileList = []
      this.previewVideo = ''
      this.videoFile = null
      this.content = ''
      this.$refs.photosInputer.value = null
      this.$refs.videoInputer.value = null
    },

    sortHandler (e) {
      const oldIndex = e.oldIndex
      const newIndex = e.newIndex
      let swapMiddleVar = null
      swapMiddleVar = this.photosFileList[oldIndex]
      this.photosFileList[oldIndex] = this.photosFileList[newIndex]
      this.photosFileList[newIndex] = swapMiddleVar
    },

    photosHandler (e) {
      const handler = () => {
        this.photosFileList = []
        this.previewPhotos = []

        const currentFileList = e.target.files
        if (currentFileList.length > 9) {
          this.$alert('最多只能选择九张图片！', { type: 'warning', lockScroll: false })
          return
        }

        Array.prototype.push.apply(this.photosFileList, currentFileList)
        this.photosFileList.forEach(item => {
          const fileReader = new FileReader()
          fileReader.readAsDataURL(item)
          fileReader.onload = e => {
            this.previewPhotos.push(e.target.result)
          }
        })
        this.$refs.photosInputer.value = ''
      }
      if (this.videoFile) {
        this.$confirm('视频/图片只能二选一，请问要放弃已选择的视频吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          lockScroll: false,
          type: 'warning'
        }).then(() => {
          this.videoFile = null
          handler()
        }).catch(() => {
          handler()
        })
      } else { handler() }
    },

    videoHandler (e) {
      const handler = () => {
        const videoFile = e.target.files[0]
        console.log(videoFile.size, VIDEO_SIZE_LIMIT)
        if (videoFile.size > VIDEO_SIZE_LIMIT) {
          this.$alert('只能上传小于20M的视频', { type: 'warning', lockScroll: false })
          return
        }
        this.videoFile = videoFile
        this.previewVideo = videoFile.name
        this.$refs.videoInputer.value = ''
      }
      if (this.photosFileList.length) {
        this.$confirm('视频/图片只能二选一，请问要放弃已选择的图片吗？')
          .then(() => {
            this.photosFileList = []
            this.previewPhotos = []
            handler()
          })
          .catch(() => {
            handler()
          })
      } else { handler() }
    },

    clearFileInput () {

    },

    postMoment () {
      if (!this.checkLoginBeforeAction()) { return }
      if (!this.content && !this.videoFile && !this.photosFileList.length) {
        this.$alert('发布内容不能为空！', { type: 'error', lockScroll: false })
        return
      }

      const sdk = new SDK()
      let flag = ''
      let formData = new FormData()
      formData.append('content', this.content.trim())
      if (this.videoFile) {
        flag = 'video'
        formData.append('video', this.videoFile)
      } else {
        flag = 'images'
        this.photosFileList.forEach(item => {
          formData.append('images', item)
        })
      }

      this.postMomentLoading = true
      sdk.postMoment(formData, flag).then(() => {
        this.postMomentLoading = false
        this.clearAll()
        this.SET_MOMENTS(this.totalMoments + 1)
        this.$message({ message: '发布成功！', type: 'success' })
        this.$emit('needRefreshMoment')
      })
    }
  },

  mounted () {
    const _this = this
    Sortable.create(this.$refs.previewPhotos, {
      animation: 400,
      onEnd: _this.sortHandler
    })
  },

  created () {
    this.photosFileList = []
    this.videoFile = undefined
  }
}
</script>

<template>
  <div class="moment-poster" v-loading="postMomentLoading">
    <ul class="tool-bar">
      <li class="tool-item" @click="() => { this.content += '@用户昵称 ' }">
        <i class="fa fa-at"></i>
        <span>提及</span>
      </li>
      <li class="tool-item" @click="() => { this.content += '#在此输入话题# ' }">
        <i class="fa fa-hashtag"></i>
        <span>话题</span>
      </li>
      <li class="tool-item" @click="() => { this.$refs.photosInputer.click() }">
        <i class="fa fa-picture-o"></i>
        <span>图片</span>
      </li>
      <li class="tool-item" @click="() => { this.$refs.videoInputer.click() }">
        <i class="fa fa-film"></i>
        <span>小视频</span>
      </li>
    </ul>

    <el-input class="textarea" type="textarea" rows="5" maxlength="250" v-model="content"/>

    <div class="preview-wrapper" ref="previewPhotos">
      <el-badge
        v-for="(item, index) in previewPhotos"
        :key="index"
        value="-"
        class="preview-item">
        <img :src="item" @click="removePhotos(index)">
      </el-badge>
    </div>
    <div class="tip" v-if="previewPhotos.length">ps：可以对已选图片拖拽进行排序，点击进行删除</div>

    <div class="preview-wrapper" v-if="previewVideo.length">
      <h3>已选择视频：
        <span @click="removeVideo">{{previewVideo}}&nbsp;&nbsp;x</span>
      </h3>
    </div>

    <div class="bottom">
      <h3>把身边的新鲜事儿分享给大家~</h3>
      <el-button type="primary" size="small" @click="postMoment">发布</el-button>
    </div>

    <input
      type="file"
      multiple
      hidden
      accept="image/png, image/gif, image/jpg, image/jpeg"
      ref="photosInputer"
      @change="photosHandler"
    >
    <input type="file" ref="videoInputer" accept="video/mp4" hidden @change="videoHandler">
  </div>
</template>

<style lang="scss" scoped>
@import "../sass/variable.scss";
@import "../sass/mixins.scss";

.moment-poster {
  margin: 10px 0 20px;
  padding: 20px;
  box-sizing: border-box;
  @include round-shadow-card;

  .tool-bar {
    display: flex;
    margin-bottom: 10px;
    li {
      margin-right: 20px;
      font-size: 12px;
      font-weight: bold;
      @include hover-theme-color;
      .fa {
        font-size: 14px;
      }
    }
  }

  .textarea {
    margin-bottom: 20px;
    /deep/ textarea {
      color: #000;
      font-size: 14px;
    }
  }

  .preview-wrapper {
    .preview-item {
      margin: 8px;
      cursor: pointer;
    }
    img {
      display: inline-block;
      width: 40px;
      height: 40px;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #ddd;
      object-fit: cover;
    }
    h3 {
      font-weight: bold;
      span {
        cursor: pointer;
      }
    }
  }

  .tip {
    margin-bottom: 12px;
  }

  .bottom {
    display: flex;
    align-items: center;
    h3 {
      flex: 1;
      color: #ccc;
      font-style: italic;
    }
  }
}
</style>
