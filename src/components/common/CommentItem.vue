<script>
import defaultAvatar from '../../assets/default_avatar.jpg'
import SDK from '../../utils/socialSDK.js'
import mixin from '../../mixin.js'
import { mapState } from 'vuex'

export default {
  mixins: [mixin],

  props: {
    data: { type: Object, default: null },
    belong: { type: String, default: '' }
  },

  computed: {
    ...mapState([
      'authUserInfo'
    ])
  },

  data () {
    return {
      defaultAvatar: undefined,

      hasRestSubComment: false,
      showSubInput: false,
      subInputText: '',

      subComments: []
    }
  },

  methods: {
    deleteThis () {
      this.$confirm('你确定要删除此评论吗', { lockScroll: false, type: 'warning' })
        .then(() => {
          this.$emit('delete')
        })
        .catch(() => {})
    },

    deleteReply (subCommentId, index) {
      this.$confirm('你确定要删除此回复吗', { lockScroll: false, type: 'warning' })
        .then(() => {
          const sdk = new SDK()
          sdk.deleteReply(this.data._id, subCommentId).then(res => {
            this.$emit('hasDeleteReply')
            this.subCommentsOrigin.splice(index, 1)
            this.subComments.splice(index, 1)
            this.$message({
              message: '删除成功！',
              lockScroll: false,
              type: 'success'
            })
          })
        })
        .catch(() => {})
    },

    toggleSubInput () {
      if (!this.checkLoginBeforeAction()) return
      this.showSubInput = !this.showSubInput
    },

    collapseReply () {
      if (this.subCommentsOrigin.length !== this.subComments.length) {
        this.subComments = this.subCommentsOrigin.slice(0)
      } else {
        this.subComments = this.subCommentsOrigin.slice(0, 2)
      }
    },

    goReplyComment () {
      if (!this.checkLoginBeforeAction()) return
      if (!this.subInputText) return
      const sdk = new SDK()
      sdk.replyComment(this.data._id, this.subInputText, this.belong).then(res => {
        let newReply = res.data.data
        newReply.author = {
          _id: newReply.author,
          nickname: this.authUserInfo.nickname
        }
        this.subCommentsOrigin.length === this.subComments.length && this.subComments.push(newReply)
        this.subCommentsOrigin.push(newReply)
        this.subInputText = ''
        this.$emit('hasReply')
        this.$message({
          message: '回复成功',
          type: 'success',
          lockScroll: false
        })
      })
    }
  },

  created () {
    this.defaultAvatar = defaultAvatar
    this.subCommentsOrigin = this.data.sub_comments ? this.data.sub_comments.slice(0) : []
    this.subComments = this.data.sub_comments ? this.data.sub_comments.slice(0, 2) : []
    this.hasRestSubComment = this.data.sub_comments.length > 2
  }
}
</script>

<template>
  <div class="comment-item">
    <div class="avatar-box">
      <img :src="data.author.avatar || defaultAvatar" alt="avatar">
    </div>
    <div class="main-box">
      <div class="content">
        <router-link class="name" :to="'/user?id=' + data.author._id">{{data.author.nickname}}：</router-link>
        <span class="comment-content" v-html="data.content"></span>
      </div>
      <div class="foot-box">
        <span class="date">{{getDateDict(data.created_at)}}</span>
        <div class="corner">
          <span class="delete-btn" v-if="authUserInfo.id === data.author._id" @click="deleteThis">删除</span>
          <span class="reply-btn" @click="toggleSubInput">回复</span>
        </div>
      </div>

      <!-- 子回复输入框 -->
      <div class="sub-input-box" v-if="showSubInput">
        <el-input size="mini" v-model="subInputText" maxlength="100" @keyup.enter.native="goReplyComment"></el-input>
        <el-button size="mini" type="primary" class="sub-reply-btn" @click="goReplyComment">回复</el-button>
      </div>

      <div class="sub-comment-box" v-if="subComments.length">

        <!-- 回复评论 -->
        <div class="sub-comment-item"
             v-for="(item, index) in subComments"
             :key="item._id">
          <router-link class="name" :to="'/user?id=' + item.author._id">{{item.author.nickname}}：</router-link>
          <span class="comment-content" v-html="item.content"></span>
          <span class="delete-reply"
                v-if="item.author._id === authUserInfo.id"
                @click="deleteReply(item._id, index)">删除</span>
          <div class="date">{{getDateDict(item.created_at)}}</div>
        </div>

        <div class="collapse-reply"
           v-if="hasRestSubComment && subComments.length"
           @click="collapseReply">
            {{subComments.length === subCommentsOrigin.length ? '收起' : `展开剩余${subCommentsOrigin.length - subComments.length}条回复`}}
          </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../sass/variable.scss';
.comment-item {
  display: flex;
  padding-bottom: 10px;
  font-size: 12px;
  border-bottom: 1px solid #eee;

  .avatar-box {
    margin-top: 4px;
    margin-right: 8px;
    img {
      width: 30px;
      height: 30px;
    }
  }

  .main-box {
    flex: 1;
    .content {
      line-height: 23px;

      .name {
        font-weight: bold;
      }
    }

    .foot-box {
      display: flex;
      justify-content: space-between;

      .date {
        color: #aaa;
      }

      .delete-btn {
        margin-right: 4px;
        color: red;
        cursor: pointer;
      }

      .reply-btn {
        color: $themeColor;
        cursor: pointer;
      }
    }
  }

  .sub-input-box {
    margin-top: 8px;
    display: flex;
    .sub-reply-btn {
      margin-left: 8px;
    }
  }

  .sub-comment-box {
    margin: 8px 0;
    padding: 8px;
    background: #f7f7f7;
    &:last-child .sub-comment-item{
      border-bottom: none;
    }

    .sub-comment-item {
      line-height: 20px;
      border-bottom: 1px solid #eee;
      .name {
        font-weight: bold;
      }
      .date {
        color: #aaa;
      }
      .delete-reply {
        margin-left: 10px;
        color: red;
        cursor: pointer;
      }
    }
  }

  .collapse-reply {
    font-weight: bold;
    cursor: pointer;
  }
}

.comment-content {
  /deep/ a {
    color: $themeColor !important;
  }
}
</style>
