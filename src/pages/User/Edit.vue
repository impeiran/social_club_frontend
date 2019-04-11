<script>
import SDK from '../../utils/socialSDK.js'
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      nickname: '',
      sex: '',
      desc: '',
      avatarFile: undefined,
      avatarUrl: ''
    }
  },

  computed: {
    ...mapState([
      'authUserInfo'
    ])
  },

  methods: {
    ...mapMutations([
      'HIDE_HEADER', 'SET_USER_INFO'
    ]),

    goSubmit () {
      const { nickname, desc } = this
      const sex = this.sex === '男' ? 1 : 0
      const sdk = new SDK()
      let formData = new FormData()
      formData.append('sex', sex)
      formData.append('desc', desc)
      formData.append('nickname', nickname)
      this.avatarFile && formData.append('avatar', this.avatarFile)
      sdk.editUserInfo(formData).then(res => {
        const data = res.data.data
        const currentUserInfo = {
          nickname: data.nickname,
          avatar: data.avatar,
          desc: data.desc,
          sex: data.sex,
          created_at: data.created_at,
          id: data._id
        }
        this.SET_USER_INFO(currentUserInfo)
        this.$message({message: '编辑成功', type: 'success'})
      })
    },

    avatarHandler (file) {
      this.avatarReader.readAsDataURL(file.raw)
      this.avatarFile = file.raw
    },

    _initAvatarReader () {
      this.avatarReader = new FileReader()
      this.avatarReader.onload = (e) => {
        this.avatarUrl = e.target.result
      }
    }
  },

  created () {
    this.nickname = this.authUserInfo.nickname
    this.desc = this.authUserInfo.desc
    this.sex = parseInt(this.authUserInfo.sex) === 1 ? '男' : '女'
    this.avatarUrl = this.authUserInfo.avatar
    this.HIDE_HEADER(false)
    this._initAvatarReader()
  }
}
</script>

<template>
  <section class="user-edit">
    <el-form  label-width="100px">

      <el-form-item class="headline" label="编辑信息："></el-form-item>

      <el-form-item label="昵称">
        <el-input v-model="nickname"></el-input>
      </el-form-item>

      <el-form-item label="性别">
        <el-radio-group v-model="sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="desc"></el-input>
      </el-form-item>

      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action=""
          :auto-upload="false"
          :show-file-list="false"
          :on-change="avatarHandler">
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>

    <div class="control-bar">
      <el-button
        size="mini"
        type="primary"
        @click="goSubmit"
      >提交</el-button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '../../sass/variable.scss';
@import '../../sass/mixins.scss';
.user-edit {
  margin: 20px auto;
  padding: 20px;
  box-sizing: border-box;
  width: 600px;
  @include round-shadow-card;

  .headline {
    font-weight: bold;
  }

  .avatar-uploader {
    /deep/ .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409EFF;
      }
    }
    /deep/ .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      display: block;
      width: 178px;
      height: 178px;
      object-fit: cover;
    }
  }

  .control-bar {
    text-align: center;
  }
}
</style>
