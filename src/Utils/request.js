export default function (Vue) {
  const baseUrl = 'https://api-ugo-web.itheima.net'
  Vue.prototype.request = async function (opts) {
    const {
      url,
      data,
      method,
      header
    } = opts
    uni.showLoading({
      title: '加载中'
    })
    const [err, res] = await uni.request({
      url: baseUrl + url,
      data,
      method,
      header
    })
    uni.hideLoading()
    return res.data
  }
}