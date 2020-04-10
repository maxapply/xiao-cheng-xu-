<template>
  <view>
    <button type="primary" open-type="getUserInfo" @getuserinfo="btnGetInfo">微信登录</button>
  </view>
</template>

<script>
export default {
  data () {
    return {
      str: ''
    }
  },
  methods: {
    async loin () {
      const [err, res] = await uni.getUserInfo()
      console.log(res);
      if (!res) {
        return
      }
      this.getToken(res)
    },
    btnGetInfo (e) {
      // console.log(e.detail);
      this.getToken(e.detail)
    },
    async  getToken (detail) {
      const [err, then] = await uni.login()

      const res = await this.request({
        url: '/api/public/v1/users/wxlogin',
        method: 'post',
        data: {
          encryptedData: detail.encryptedData,
          iv: detail.iv,
          rawData: detail.rawData,
          signature: detail.signature,
          code: then.code
        }
      })
      uni.setStorageSync('user', res.message.token)
      uni.navigateBack()
    }

  },
  onLoad () {
    this.loin()
  }
}
</script>

<style lang="less" scoped>
button {
  width: 600rpx;
  margin: 200rpx auto 0;
}
</style>