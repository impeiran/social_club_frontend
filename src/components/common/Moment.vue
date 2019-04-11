<script>
import CommentItem from '../../components/common/CommentItem'
import Loading from '../../components/common/Loading'
import ClickMore from '../../components/common/ClickMore'
import SDK from '../../utils/socialSDK.js'
import defaultAvatar from '../../assets/default_avatar.jpg'
import mixin from '../../mixin.js'
import { mapState } from 'vuex'

const PHOTO_MAX_HEIGHT = 250
const PHOTO_MAX_WIDTH = 300

export default {
  mixins: [mixin],
  props: {
    data: { type: Object, required: true },
    hideFollowBtn: { type: Boolean, default: false },
    hideDeleteBtn: { type: Boolean, default: false }
  },

  components: {
    CommentItem,
    Loading,
    ClickMore
  },

  data () {
    return {
      defaultAvatar: undefined,
      showCommentPanel: false,
      inputComment: '',

      hasLiked: undefined,
      displayLike: undefined,
      displayComment: undefined,
      showFollowedButton: undefined,

      comments: [],
      commentPage: 1,
      commentListSize: 10,
      isLoadingComment: true,
      loadCommentCompleted: false
    }
  },

  computed: {
    ...mapState([
      'authUserInfo'
    ])
  },

  methods: {
    photosAdapter (e, index) {
      let target = this.$refs['photos' + index][0]
      if (this.data.images && this.data.images.length > 1) {
        target.style.opacity = 1
        return
      }
      const targetWidth = target.width
      const targetHeight = target.height
      if (targetHeight > targetWidth) {
        target.height = PHOTO_MAX_HEIGHT
        target.width = PHOTO_MAX_HEIGHT / targetHeight * targetWidth
      } else {
        if (targetWidth > PHOTO_MAX_WIDTH) {
          target.width = PHOTO_MAX_WIDTH
          target.height = PHOTO_MAX_WIDTH / targetWidth * targetHeight
        }
      }
      target.style.opacity = 1
    },

    deleteThis () {
      this.$confirm('确定要删除此动态吗', {lockScroll: false, type: 'warning'})
        .then(() => {
          this.$emit('delete')
        })
        .catch(() => {})
    },

    toggleCommentPanel () {
      if (!this.showCommentPanel) {
        this.loadComments()
      } else {
        this.comments = []
        this.commentPage = 1
        this.loadCommentCompleted = false
      }
      this.showCommentPanel = !this.showCommentPanel
    },

    toggleLike () {
      if (!this.checkLoginBeforeAction()) return
      const parseLike = parseInt(this.displayLike)
      const requestFlag = this.hasLiked ? 'cancel' : 'like'
      const sdk = new SDK()
      if (this.hasLiked) {
        this.displayLike = parseLike - 1 || '喜欢'
      } else {
        this.displayLike = isNaN(parseLike) ? 1 : parseLike + 1
      }
      sdk.likeMoment(this.data._id, requestFlag)
      this.hasLiked = !this.hasLiked
    },

    toggleFollow () {
      if (!this.checkLoginBeforeAction()) return
      if (this.data.author.hasFollowed) {
        this.$confirm('确定要取消关注此用户吗', { lockScroll: false, type: 'warning' })
          .then(() => {
            this.$emit('toggleFollow', 'cancel')
          })
          .catch(() => {})
      } else {
        this.$emit('toggleFollow', 'follow')
      }
    },

    updateCommentDisplay (trend) {
      const parseComment = parseInt(this.displayComment)
      if (trend > 0) {
        this.displayComment = isNaN(parseComment) ? 1 : parseComment + 1
      } else {
        this.displayComment = this.displayComment - 1 || '评论'
      }
    },

    deleteComment (commentId, index) {
      const sdk = new SDK()
      sdk.deleteComment(this.data._id, commentId).then(() => {
        this.comments.splice(index, 1)
        this.updateCommentDisplay(-1)
        this.$message({message: '删除评论成功！', type: 'success'})
      })
    },

    goComment () {
      if (!this.checkLoginBeforeAction()) return
      if (!this.inputComment) {
        this.$alert('请输入评论内容', { type: 'warning', lockScroll: false })
        return
      }
      const sdk = new SDK()
      sdk.commentMoment(this.data._id, this.inputComment).then(res => {
        let newComment = res.data.data
        newComment.author = {
          _id: newComment.author,
          avatar: this.authUserInfo.avatar,
          nickname: this.authUserInfo.nickname
        }
        this.$message({ message: '评论成功！', type: 'success' })
        this.comments.push(newComment)
        this.updateCommentDisplay(1)
        this.inputComment = ''
      })
    },

    loadComments () {
      if (this.loadCommentCompleted) return
      this.isLoadingComment = true
      const sdk = new SDK()
      sdk.getMomentComment(this.data._id, this.commentPage, this.commentListSize)
        .then(res => {
          const comments = res.data.data
          this.comments = this.comments.concat(comments)
          this.isLoadingComment = false
          this.commentPage++
          if (comments.length < this.commentListSize) {
            this.loadCommentCompleted = true
          }
        })
    }
  },

  mounted () {
    this.hasLiked = this.data.hasLiked
    this.displayLike = this.data.likes_num || '喜欢'
    this.displayComment = this.data.comments_num || '评论'
    this.showFollowedButton = this.hideFollowBtn ? false : 'hasFollowed' in this.data.author ? !this.data.author.hasFollowed : false
  },

  created () {
    this.defaultAvatar = defaultAvatar
  }
}
</script>

<template>
  <article class="social-moment">

    <div class="avatar-box">
      <img :src="data.author.avatar || defaultAvatar" alt="avatar">
    </div>

    <div class="content">

      <div class="content-head">
        <div class="head-info">
          <h4>
            <router-link :to="'/user?id=' + data.author._id">{{data.author.nickname}}</router-link>
          </h4>
          <h5>{{getDateDict(data.created_at)}}</h5>
        </div>

        <!-- 关注按钮 -->
        <el-button class="follow-btn"
                size="mini"
                v-if="showFollowedButton"
                :type="data.author.hasFollowed ? '' : 'primary'"
                :icon="data.author.hasFollowed ? '' : 'el-icon-plus'"
                :plain="data.author.hasFollowed"
                @click="toggleFollow"
        >{{data.author.hasFollowed ? '已关注' : '关注'}}</el-button>
      </div>

      <div class="content-body">

        <!-- 内容区 -->
        <!-- <p>{{data.content}}</p> -->
        <p v-html="data.content"></p>

        <!-- 图片组 -->
        <div class="media-img-box" v-if="data.images.length">
          <viewer :images="data.images" static>
            <div class="media-img"
                v-for="(item, index) in data.images"
                :key="index"
                :class="data.images.length > 1 ? 'normal' : 'single'">
              <img
                :src="item"
                :ref="'photos' + index"
                @load="e => photosAdapter(e, index)" />
            </div>
          </viewer>
        </div>

        <!-- 视频 -->
        <div class="media-video-box" v-if="data.video">
          <video :src="data.video" controls ref="socialVideo"></video>
        </div>

      </div>

      <!-- 评论点赞按钮 -->
      <ul class="control-bar">
        <li @click="toggleCommentPanel">
          <i class="fa fa-comments-o"></i>
          <span>{{displayComment}}</span>
        </li>
        <li @click="toggleLike">
          <i class="fa fa-thumbs-o-up" :class="hasLiked ? 'fa-thumbs-up' : 'fa-thumbs-o-up'"></i>
          <span>{{displayLike}}</span>
        </li>
      </ul>

      <!-- 删除按钮 -->
      <div class="delete-btn el-icon-error"
           v-if="data.author._id === authUserInfo.id && !hideDeleteBtn"
           @click="deleteThis"></div>

      <!-- 评论面板 -->
      <div class="comment-panel" v-show="showCommentPanel">
        <div class="input-box">
          <el-input type="textarea" rows="2" maxlength="100" @keyup.enter.native="goComment" v-model="inputComment" />
          <el-button type="primary" size="mini" class="comment-btn" @click="goComment">评论</el-button>
        </div>
        <div class="comment-list">
          <Loading :size="'small'" :loading="isLoadingComment && !comments.length"></Loading>
          <ClickMore
            :loading="isLoadingComment"
            :completed="loadCommentCompleted"
            :useCardLayout="false"
            :noMoreText="'已无更多评论'"
            @loadMore="loadComments">
            <comment-item
              class="comment-item"
              v-for="(item, index) in comments"
              :key="item._id"
              :data="item"
              :belong="data._id"
              @hasReply="updateCommentDisplay(1)"
              @hasDeleteReply="updateCommentDisplay(-1)"
              @delete="deleteComment(item._id, index)"/>
          </ClickMore>
        </div>
      </div>
    </div>

  </article>
</template>

<style lang="scss" scoped>
@import '../../sass/variable.scss';
@import '../../sass/mixins.scss';
.social-moment {
  display: flex;
  position: relative;
  margin-bottom: 20px;
  padding: 20px 0 20px;
  box-sizing: border-box;
  z-index: 10;
  @include round-shadow-card;

  .avatar-box {
    flex: 0 0 51px;
    margin: 0 10px 0 20px;
    img {
      width: 49px;
      height: 49px;
      border: 1px solid rgba(196, 196, 196, .6);
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .content {
    flex: 1;
    margin-right: 20px;
    @include clearFix;

    // 名字 时间
    .content-head {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      h4 {
        margin-bottom: 4px;
        font-weight: bold;
      }
      h5 {
        font-size: 12px;
        color: #808080;
      }
    }

    // 正文内容
    .content-body {
      margin-top: 20px;
      width: 100%;
      overflow: hidden;
      @include clearFix;
      p {
        margin-bottom: 10px;
        line-height: 23px;
        white-space: pre-wrap;
        overflow: hidden;

        /deep/ a {
          /* font-weight: bold; */
          color: $themeColor;

          &:active,
          &:visited {
            color: $themeColor !important;
          }
        }
      }

      // 媒体图片盒子
      .media-img-box {
        max-width: 370px;
        .media-img.normal {
          display: inline-block;
          margin-right: 3px;
          width: 120px;
          height: 120px;
          box-sizing: border-box;
          overflow: hidden;
          border: 1px solid rgba(196, 196, 196, .6);
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        img {
          opacity: 0;
          transition: all .4s;
          cursor: zoom-in;
        }
      }

      // 媒体视频盒子
      .media-video-box {
        margin: 10px 0;
        text-align: center;
        video {
          width: 100%;
          max-height: 300px;
          background: #000;
        }
      }
    }
  }

  // 点赞评论
  .control-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 30px -4px 10px;
    user-select: none;
    overflow: hidden;
    li {
      float: left;
      margin-right: 30px;
      color: $themeColor;
      font-weight: bold;
      @include hover-theme-color;

      &:last-child {
        margin-right: 12px;
      }
      i { font-size: 16px; }
      span { font-size: 12px;}
    }
  }

  // 删除按钮
  .delete-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 1.2em;
    font-weight: bold;
    color: $themeColor;
    cursor: pointer;
  }

  .comment-panel {
    .input-box {
      margin-bottom: 10px;
      width: 100%;
      text-align: right;
      border-bottom: 1px solid #eee;

      /deep/ textarea {
        font-size: 12px;
      }
    }
    .comment-btn {
      margin: 10px 0;
    }

    .comment-item {
      margin-bottom: 10px;
    }

  }
}
</style>
