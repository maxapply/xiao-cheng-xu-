<template>
  <view class="wrapper">
    <!-- 收货信息 -->
    <view class="shipment" v-if="addr">
      <view class="dt">收货人: </view>
      <view class="dd meta">
        <text class="name">{{addr.userName}}</text>
        <text class="phone">{{addr.telNumber}}</text>
      </view>
      <view class="dt">收货地址:</view>
      <view class="dd">{{addr.detail}}</view>
    </view>
    <button v-else type="primary" @tap="getaddr">点击添加地址</button>
    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>
        <view class="goods" v-for="(item,index) in list" :key="item.goods_id">
          <!-- 商品图片 -->
          <image class="pic" :src="item.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{item.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{item.goods_price}}<text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @tap="change_num(-1,index)">-</text>
              <input type="number" :value="item.goods_numb" class="number">
              <text class="plus" @tap="change_num(1,index)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox">
            <icon @tap="change_buy(index)" type="success" size="20" :color="item.goods_buy?'#ea4451':'#ccc'"></icon>
          </view>
        </view>

      </view>
    </view>
    <!-- 其它 -->
    <view class="extra">
      <label class="checkall">
        <icon type="success" @tap="change_all" :color="is?'#ea4451':'#ccc'" size="20"></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{arr}}</label><text>.00</text>
      </view>
      <view class="pay" @tap="pay">结算({{ckLiset.length}})</view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      list: uni.getStorageSync('carts') || [],
      arr: '',
      addr: null
    }
  },
  computed: {
    ckLiset: function () {
      var arr = []
      this.list.forEach(item => {
        if (item.goods_buy) {
          arr.push(item)
        }
      })
      return arr
    },
    is: function () {
      return this.ckLiset.length == this.list.length
    },
    num: function () {
      var unmb = 0
      this.ckLiset.forEach(item => {
        // console.log(item);
        unmb += item.goods_price * item.goods_numb
      })
      this.arr = unmb
      return unmb
      console.log(unmb);

    }
  },
  methods: {
    change_num (taps, index) {
      if (taps == -1 && this.list[index].goods_numb <= 1) {
        return
      }
      if (taps == 1 && this.list[index].goods_numb == 15) {
        return
      }

      this.list[index].goods_numb += taps
      uni.setStorageSync('carts', this.list)
    },
    change_buy (index) {
      this.list[index].goods_buy = !this.list[index].goods_buy
      uni.setStorageSync('carts', this.list)
    },
    change_all () {
      var str = !this.is
      this.list.forEach(item => {
        item.goods_buy = str
      })
      uni.setStorageSync('carts', this.list)
    },
    async getaddr () {
      const [err, res] = await uni.chooseAddress()
      this.addr = {
        userName: res.userName,
        telNumber: res.telNumber,
        detail: res.provinceName + res.cityName + res.countyName + res.detailInfo
      }
      console.log(res);

    },
    async pay () {
      if (!this.ckLiset.length) {
        uni.showToast({ title: '添加要结算的商品', icon: 'none' })
      }
      if (!this.addr) {
        uni.showToast({ title: '请添加收货地址', icon: 'none' })
      }
      if (!uni.getStorageSync('user')) {
        uni.showToast({ title: '请登录', icon: 'none' })
        uni.navigateTo({
          url: '/pages/auth/index'
        })
      }
      const res = await this.request({
        url: '/api/public/v1/my/orders/create',
        method: 'post',
        header: {
          "Authorization": uni.getStorageSync('user')
        },
        data: {
          order_price: this.getaddr,
          consignee_addr: this.addr.detail,
          goods: this.ckLiset
        }
      })
      // console.log(res);
      if (res.status == 200) {
        uni.removeStorageSync('user')
        uni.navigateTo({
          url: '/pages/order/index'
        })
      }

    }
  },
  onShow () {
    this.list = uni.getStorageSync('carts') || []
  }
}
</script>

<style scoped lang="less">
.shipment {
  height: 100rpx;
  line-height: 2;
  padding: 30rpx 30rpx 40rpx 30rpx;
  font-size: 27rpx;
  color: #333;
  background-color: #fff;
  background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;

  .dt {
    width: 140rpx;
    float: left;
    clear: both;
  }

  .dd {
    padding-left: 160rpx;
  }

  .meta {
    padding-right: 50rpx;
  }

  text.phone {
    float: right;
  }
}

.carts {
  background-color: #f4f4f4;
  padding-bottom: 110rpx;
  overflow: hidden;

  .shopname {
    padding: 30rpx;
    margin-top: 20rpx;
    font-size: 30rpx;
    color: #333;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    border-bottom: 1rpx solid #eee;
  }

  .goods {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 100rpx;
    border-bottom: 1rpx solid #eee;
    background-color: #fff;

    position: relative;

    .checkbox {
      width: 101rpx;
      height: 100%;
      background-color: #fff;

      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      left: -100rpx;
      top: 0;
    }

    &:last-child {
      border-bottom: none;
    }

    .pic {
      width: 200rpx;
      height: 200rpx;
      margin-right: 30rpx;
    }

    .meta {
      flex: 1;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      text {
        font-size: 22rpx;
      }
    }

    .amount {
      position: absolute;
      bottom: 0;
      right: 20rpx;

      height: 48rpx;
      text-align: center;
      border: 1rpx solid #ddd;
      border-radius: 8rpx;

      display: flex;
      align-items: center;

      text {
        display: block;
        width: 60rpx;
        line-height: 48rpx;
        font-size: 36rpx;
        color: #ddd;
        text-align: center;
      }

      input {
        width: 60rpx;
        height: 48rpx;
        min-height: 48rpx;
        font-size: 27rpx;
        border-left: 1rpx solid #ddd;
        border-right: 1rpx solid #ddd;
      }
    }
  }
}

.extra {
  position: fixed;
  bottom: 0;
  /* #ifdef H5 */
  bottom: 50px;
  /* #endif */
  left: 0;
  z-index: 9;

  width: 750rpx;
  height: 96rpx;
  text-align: center;
  line-height: 96rpx;
  font-size: 36rpx;
  border-top: 1rpx solid #eee;
  background-color: #fff;
  color: #333;
  display: flex;

  .checkall {
    width: 140rpx;
    line-height: 1;
    margin-left: 25rpx;
    display: flex;
    align-items: center;

    icon {
      margin-right: 20rpx;
    }
  }

  .total {
    display: flex;
    justify-content: center;
    flex: 1;

    label,
    text {
      color: #ea4451;
      vertical-align: bottom;
      position: relative;
      bottom: -2rpx;
    }

    text {
      position: relative;
      bottom: -3rpx;
      font-size: 24rpx;

      &:first-child {
        margin-left: 10rpx;
      }
    }
  }

  .pay {
    width: 200rpx;
    background-color: #ea4451;
    color: #fff;
  }
}
</style>

