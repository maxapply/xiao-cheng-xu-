<template>
  <view :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll" />
    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item v-for="item in SwiperArr" :key="item.goods_id">
        <navigator :url="'/pages/goods/index?id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
      <!-- <swiper-item>
        <navigator url="/pages/goods/index">
          <image src="http://static.botue.com/ugo/uploads/banner2.png"></image>
        </navigator>
      </swiper-item>
      <swiper-item>
        <navigator url="/pages/goods/index">
          <image src="http://static.botue.com/ugo/uploads/banner3.png"></image>
        </navigator>
      </swiper-item> -->
    </swiper>
    <!-- 导航条 -->
    <view class="navs">
      <navigator open-type="switchTab" url="/pages/category/index" v-for="item in navList" :key="item.name">
        <image :src="item.image_src"></image>
      </navigator>
      <!-- <navigator url="/pages/list/index">
        <image src="http://static.botue.com/ugo/uploads/icon_index_nav_3@2x.png"></image>
      </navigator>
      <navigator url="/pages/list/index">
        <image src="http://static.botue.com/ugo/uploads/icon_index_nav_2@2x.png"></image>
      </navigator>
      <navigator url="/pages/list/index">
        <image src="http://static.botue.com/ugo/uploads/icon_index_nav_1@2x.png"></image>
      </navigator> -->
    </view>
    <!-- 楼层 -->
    <view class="floors">
      <view class="floor" v-for="(item,index) in floorsList" :key="index">

        <view class="title">
          <image :src="item.floor_title.image_src"></image>
        </view>

        <view class="items">
          <navigator :url="'/pages/list/index?query='+i.name" v-for="i in item.product_list" :key="i.name">
            <image :src="i.image_src"></image>
          </navigator>
          <!-- <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor01_2@2x.png"></image>
          </navigator>
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor01_3@2x.png"></image>
          </navigator>
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor01_4@2x.png"></image>
          </navigator>
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor01_5@2x.png"></image>
          </navigator> -->
        </view>
      </view>
      <!-- <view class="floor">
        <view class="title">
          <image src="http://static.botue.com/ugo/uploads/pic_floor02_title.png" />
        </view>
        <view class="items">
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor02_1@2x.png"></image>
          </navigator>
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor02_2@2x.png"></image>
          </navigator>
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor02_3@2x.png"></image>
          </navigator>
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor02_4@2x.png"></image>
          </navigator>
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor02_5@2x.png"></image>
          </navigator>
        </view>
      </view> -->
      <!-- <view class="floor">
        <view class="title">
          <image src="http://static.botue.com/ugo/uploads/pic_floor03_title.png"></image>
        </view>
        <view class="items">
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor03_1@2x.png"></image>
          </navigator>
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor03_2@2x.png"></image>
          </navigator>
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor03_3@2x.png"></image>
          </navigator>
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor03_4@2x.png"></image>
          </navigator>
          <navigator url="/pages/list/index">
            <image src="http://static.botue.com/ugo/uploads/pic_floor03_5@2x.png"></image>
          </navigator>
        </view>
      </view> -->
    </view>
    <!-- 回到顶部 -->
    <view class="goTop icon-top" v-if="isShow" @click="goTop"></view>
  </view>
</template>

<script>
import search from '@/components/search';

export default {

  data () {
    return {
      pageHeight: 'auto',
      SwiperArr: [],
      navList: [],
      floorsList: [],
      isShow: false
    }
  },

  components: {
    search
  },

  methods: {
    disableScroll (ev) {
      this.pageHeight = ev.pageHeight + 'px';
    },
    // 轮播图
    async getSwiperArr () {
      const res = await this.request({
        url: '/api/public/v1/home/swiperdata'
      })
      this.SwiperArr = res.message
    },
    // 导航条
    async getnavsList () {
      const res = await this.request({
        url: '/api/public/v1/home/catitems'
      })
      this.navList = res.message
    },
    // 楼层数据
    async getFloorsList () {
      const res = await this.request({
        url: '/api/public/v1/home/floordata'
      })
      this.floorsList = res.message
    },
    // 回到顶部
    goTop () {
      uni.pageScrollTo({ scrollTop: 0 })
    }
  },
  onLoad () {
    this.getSwiperArr()
    this.getnavsList()
    this.getFloorsList()
  },
  // 下拉的时候执行
  async onPullDownRefresh () {
    await this.getSwiperArr()
    await this.getnavsList()
    await this.getFloorsList()
    uni.stopPullDownRefresh()
  },
  // 页面滚动执行
  onPageScroll (e) {
    // console.log(e.scrollTop);
    if (e.scrollTop > 200) {
      this.isShow = true
    } else {
      this.isShow = false
    }
  },
  // 转发
  onShareAppMessage () {
    return {
      title: '欢饮使用UGO!',
      imageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586077811886&di=9648a3f5baab3acf97640b81ef51bb73&imgtype=0&src=http%3A%2F%2Fxcx.360shop.com.cn%2Fueditor%2FuploadiImages%2Fimage%2F20171031%2F1509431324295463.gif',
      path: './index.vue'
    }
  }
}
</script>

<style scoped lang="less">
.banner {
  width: 100%;
  height: 340rpx;

  image {
    width: 100%;
    height: 340rpx;
  }
}

.navs {
  display: flex;
  justify-content: space-between;
  padding: 30rpx 44rpx;

  image {
    width: 128rpx;
    height: 140rpx;
  }
}

.floor {
  .title {
    width: 750rpx;
    height: 60rpx;
    padding: 20rpx 0 0 8rpx;
    background-color: #f4f4f4;
  }

  .items {
    padding: 20rpx 16rpx;
    overflow: hidden;

    navigator {
      width: 193rpx;
      height: 188rpx;
      margin-left: 10rpx;
      margin-bottom: 10rpx;
      float: left;
    }

    navigator:first-child {
      width: 232rpx;
      height: 386rpx;
      margin-left: 0rpx;
    }

    navigator:nth-child(2),
    navigator:nth-child(5) {
      width: 273rpx;
    }
  }

  &:first-child {
    .items {
      navigator {
        width: 233rpx;
      }
    }
  }
}

.goTop {
  position: fixed;
  bottom: 30rpx;
  /* #ifdef H5 */
  bottom: 65px;
  /* #endif */
  right: 30rpx;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100rpx;
  height: 100rpx;
  font-size: 48rpx;
  color: #666;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>