<!--
  - Copyright(c)  2022 厦门外里科技有限公司 All rights reserved.
  -
  - https://www.wailikeji.com
  -
  - 版权所有，侵权必究！
  -->

<template>
  <view class="poster_page">
    <canvas canvas-id="poster0" class="poster_canvas0"></canvas>
    <canvas canvas-id="poster1" class="poster_canvas1"></canvas>
    <canvas canvas-id="poster2" class="poster_canvas2"></canvas>
    <canvas canvas-id="poster3" class="poster_canvas3"></canvas>
    <canvas canvas-id="poster4" class="poster_canvas4"></canvas>
    <swiper class="poster_swiper" previous-margin="110rpx" circular :current="state.swiperIndex" next-margin="110rpx"
            @change="onSwiperChange">
      <swiper-item v-for="(item, index) of state.promoteBgImgs" :key="index">
        <view class="poster_image" :class="{ active: state.swiperIndex == index }">
          <image class="poster_bg_image" :src="item" mode="widthFix"></image>
          <image :class="'poster_code_image'+index" :src="state.promoteCodeImg" mode="aspectFit"></image>
        </view>
      </swiper-item>
    </swiper>
    <view class="share_save_box">
      <!-- #ifdef MP -->
<!--      <button open-type="share">-->
<!--        <image :src="baseImageUrl+'/static/img/share/ic_pic.png'" mode="aspectFit"></image>-->
<!--        <text>发给好友</text>-->
<!--      </button>-->
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <button @click="onAppShare">
        <image :src="state.baseImageUrl+'/static/img/share/ic_pic.png'" mode="aspectFit"></image>
        <text>发给好友</text>
      </button>
      <!-- #endif -->
      <button class="onSave" hover-class="hover-class" @click="onSaveImg">生成海报</button>

    </view>
    <!-- #ifdef H5 -->
    <view class="h5_press_save" v-if="state.h5SaveImg" @click="state.h5SaveImg = ''">
      <image :src="state.h5SaveImg" mode="widthFix"></image>
      <button class="download">长按二维码保存图片</button>
    </view>
    <!-- #endif -->
  </view>
</template>

<script setup>
import Qrcode from 'qrious'
import { ref, reactive,onMounted } from 'vue'
import {BASE_URL, IMAGE_URL} from "../../../utils/env";

let settingWritePhotosAlbum = false
const state = reactive({
  baseUrl: BASE_URL,
  baseImageUrl: IMAGE_URL,
  promoteBgImgs: [
    "/static/img/share/bg1.png",
    "/static/img/share/bg2.png",
    // "/static/img/share/bg23.jpg",
    // "/static/img/share/bg24.jpg",
    // "/static/img/share/bg25.jpg",
  ],
  //二维码
  promoteCodeImg: "",
  swiperIndex: 0,
  posterImgs: [],
  shareInfo: {
    shareContent: "商家云系统,点击了解",
    shareImg: "http://qn.kemean.cn/upload/202004/08/15863540965488mlv1qgj.png",
    shareTitle: "商家云",
    shareUrl: "http://kemean.com/download/3jiayunbz/index.html"
  },
  h5SaveImg: "",
  user:uni.getStorageSync('userInfo')
})

onMounted(() => {
  //#ifdef H5
  let protocol = window.location.protocol;
  let host = window.location.host;
  state.inviteUrl = protocol + '//' + host + "/#/pages/index/index?pid=" + state.user.id
  console.log("url=" + state.inviteUrl)
  //绘制二维码图片
  let qr = new Qrcode({
    value: state.inviteUrl
  });
  state.promoteCodeImg = qr.toDataURL()
  //#endif
  //#ifdef MP-WEIXIN
  state.promoteCodeImg = state.baseUrl + '/api/wx/mp/createQr?token=' + state.user.token
  //#endif
});
//方法
// 轮播图变化
const onSwiperChange = (e) => {
  state.swiperIndex = e.detail.current;
};

// 创建海报
const createPoster = async () => {
  return new Promise((resolve, reject) => {
    if (state.posterImgs[state.swiperIndex]) {
      resolve(state.posterImgs[state.swiperIndex])
      return
    }
    uni.showLoading({ title: '海报生成中' })
    let ctx = {}
    if (state.swiperIndex == 0) {
      ctx = uni.createCanvasContext('poster0')
      ctx.fillRect(0, 0, 375, 506.98)
    } else if (state.swiperIndex == 1) {
      ctx = uni.createCanvasContext('poster1')
      ctx.fillRect(0, 0, 375, 505.48)
    } else if (state.swiperIndex == 2) {
      ctx = uni.createCanvasContext('poster2')
      ctx.fillRect(0, 0, 375, 666.66)
    } else if (state.swiperIndex == 3) {
      ctx = uni.createCanvasContext('poster3')
      ctx.fillRect(0, 0, 375, 596.34)
    } else if (state.swiperIndex == 4) {
      ctx = uni.createCanvasContext('poster4')
      ctx.fillRect(0, 0, 375, 502.77)
    }
    uni.downloadFile({
      url: state.promoteBgImgs[state.swiperIndex],
      success: async res => {
        if (res.statusCode === 200) {
          //点生成图片后背景图的位置和大小，调整方式：宽度固定375，高度=原始图片像素高度/（原始图片像素宽度/375）=原始图片像素高度*375/原始图片像素宽度
          if (state.swiperIndex == 0) {
            ctx.drawImage(res.tempFilePath, 0, 0, 375, 506.98)
          } else if (state.swiperIndex == 1) {
            ctx.drawImage(res.tempFilePath, 0, 0, 375, 505.48)
          } else if (state.swiperIndex == 2) {
            ctx.drawImage(res.tempFilePath, 0, 0, 375, 666.66)
          } else if (state.swiperIndex == 3) {
            ctx.drawImage(res.tempFilePath, 0, 0, 375, 596.34)
          } else if (state.swiperIndex == 4) {
            ctx.drawImage(res.tempFilePath, 0, 0, 375, 502.77)
          }
          try {
            const { tempFilePath } = await uni.downloadFile({
              url: state.promoteCodeImg
            })
            //点生成图片后二维码的未知和大小
            if (tempFilePath) {
              if (state.swiperIndex == 0) {
                ctx.drawImage(tempFilePath, 37, 332, 140, 140)
              } else if (state.swiperIndex == 1) {
                ctx.drawImage(tempFilePath, 12, 387, 105, 105)
              } else if (state.swiperIndex == 2) {
                ctx.drawImage(tempFilePath, 206, 431, 106, 106)
              } else if (state.swiperIndex == 3) {
                ctx.drawImage(tempFilePath, 117.5, 120, 136, 136)
              } else if (state.swiperIndex == 4) {
                ctx.drawImage(tempFilePath, 77, 152, 225, 225)
              }
              ctx.draw(true, async () => {
                try {
                  const { tempFilePath } = await uni.canvasToTempFilePath({ canvasId: ('poster' + state.swiperIndex), width: 375, height: 667 })
                  if (state.posterImgs[state.swiperIndex]) {
                    state.posterImgs[state.swiperIndex].temporary = tempFilePath
                  } else {
                    state.posterImgs[state.swiperIndex] = {}
                    state.posterImgs[state.swiperIndex].temporary = tempFilePath
                  }
                  resolve(tempFilePath)
                  console.log(tempFilePath)
                } catch (error) {
                  uni.hideLoading()
                  reject()
                }
              })
            }
          } catch (err) {
            uni.hideLoading()
            uni.showToast({ title: '海报制作失败，图片下载失败1', icon: 'none' })
          }
          return
        }
        uni.hideLoading()
        uni.showToast({ title: '海报制作失败，图片下载失败3', icon: 'none' })
      },
      fail: err => {
        uni.hideLoading()
        uni.showToast({ title: '海报制作失败，图片下载失败4', icon: 'none' })
      }
    })
  })
}

const onSaveImg = async () => {
  let imgUrl = ''
  if (state.posterImgs[state.swiperIndex] && state.posterImgs[state.swiperIndex].temporary) {
    imgUrl = await state.posterImgs[state.swiperIndex].temporary
  } else {
    imgUrl = await createPoster()
  }
  //#ifdef H5
  state.h5SaveImg = imgUrl
  uni.hideLoading()
  //#endif
  //#ifdef MP-WEIXIN
  uni.showLoading({ title: '海报下载中' })
  if (settingWritePhotosAlbum) {
    uni.getSetting({
      success: res => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          uni.saveImageToPhotosAlbum({
            filePath: imgUrl,
            success: () => {
              uni.hideLoading()
              uni.showToast({ title: '保存成功' })
            }
          })
        } else {
          uni.showModal({
            title: '提示',
            content: '请先在设置页面打开“保存相册”使用权限',
            confirmText: '去设置',
            cancelText: '算了',
            success: data => {
              if (data.confirm) {
                uni.hideLoading()
                uni.openSetting()
              }
            }
          });
        }
      }
    })
  } else {
    settingWritePhotosAlbum = true
    uni.authorize({
      scope: 'scope.writePhotosAlbum',
      success: () => {
        uni.saveImageToPhotosAlbum({
          filePath: imgUrl,
          success: () => {
            uni.hideLoading()
            uni.showToast({ title: '保存成功' })
          }
        })
      }
    })
  }
  //#endif
  //#ifdef APP-PLUS
  uni.showLoading({ title: '海报下载中' })
  uni.saveImageToPhotosAlbum({
    filePath: imgUrl,
    success: () => {
      uni.hideLoading()
      uni.showToast({ title: '保存成功' })
    }
  })
  //#endif
}

const onAppShare = () => {
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    title: state.shareInfo.shareTitle,
    href: state.shareInfo.shareUrl,
    summary: state.shareInfo.shareContent,
    imageUrl: state.shareInfo.shareImg,
    success: function(res) {
      console.log('success:' + JSON.stringify(res))
    },
    fail: function(err) {
      console.log('fail:' + JSON.stringify(err))
    }
  })
}
//用户点击分享
const onShareAppMessage = e => {
  let shareInfo = {
    path: this.$base.share.path,
    title: state.shareInfo.shareTitle,
    imageUrl: state.shareInfo.shareImg
  };
  if (state.user.token) {
    if (shareInfo.path.indexOf("?") >= 0) {
      shareInfo.path += "&recommendCode=" + state.user.uid;
    } else {
      shareInfo.path += "?recommendCode=" + state.user.uid;
    }
  }
  return shareInfo;
}


</script>
<style lang="scss" scoped>

.poster_page {
  min-height: 70vh;
  background-color: #fff;
  display: flex;
  align-items: center;
}
//长按保存图片最终的图片大小，高度=原始图片像素高度*950/原始图片像素宽度
//最好是真机调试
.poster_canvas0 {
  // width: 750rpx;
  // height: 1334rpx;
  width: 950rpx;
  height: 1000rpx;
  position: fixed;
  top: -10000rpx;
  left: 0rpx;
}

.poster_canvas1 {
  width: 950rpx;
  height: 980rpx;
  position: fixed;
  top: -10000rpx;
  left: 0rpx;
}

.poster_canvas2 {
  width: 950rpx;
  height: 1333.32rpx;
  position: fixed;
  top: -10000rpx;
  left: 0rpx;
}

.poster_canvas3 {
  width: 950rpx;
  height: 1192.68rpx;
  position: fixed;
  top: -10000rpx;
  left: 0rpx;
}

.poster_canvas4 {
  width: 950rpx;
  height: 1005.54rpx;
  position: fixed;
  top: -10000rpx;
  left: 0rpx;
}

.poster_swiper {
  height: 934rpx;
  width: 100%;

  swiper-item {
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .poster_image {
      width: 100%;
      height: 100%;
      transform: scale(0.88);
      transition: all 0.4s;
      position: relative;
      display: flex;
      align-items: flex-end;
      overflow: hidden;

      &.active {
        transform: scale(1);
      }

      .poster_bg_image {
        width: 100%;
        height: 100%;
      }
      //二维码的位置和大小
      .poster_code_image0 {
        position: absolute;
        bottom: 50rpx;
        width: 200rpx;
        height: 200rpx;
        left: 28.7%;
        transform: translateX(-50%);
      }

      .poster_code_image1 {
        position: absolute;
        bottom: 23rpx;
        width: 138rpx;
        height: 138rpx;
        left: 17%;
        transform: translateX(-50%);
      }

      .poster_code_image2 {
        position: absolute;
        bottom: 190rpx;
        width: 145rpx;
        height: 145rpx;
        left: 69%;
        transform: translateX(-50%);
      }

      .poster_code_image3 {
        position: absolute;
        bottom: 486rpx;
        width: 193rpx;
        height: 193rpx;
        left: 49.5%;
        transform: translateX(-50%);
      }

      .poster_code_image4 {
        position: absolute;
        bottom: 180rpx;
        width: 320rpx;
        height: 320rpx;
        left: 50.5%;
        transform: translateX(-50%);
      }
    }
  }
}

.share_save_box {
  position: fixed;
  bottom: calc((100vh - 934rpx - 240rpx) / 4);
  left: 0;
  z-index: 6;
  width: 100%;
  display: flex;
  justify-content: space-around;

  button {
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    margin: 40rpx;
    background-color: #1243cd;
    font-size: 32rpx;
    color: #fff;
    border-radius: 12rpx;
    font-weight: bold;
  }
}

.h5_press_save {
  background-color: #000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 100;

  image {
    width: 100%;
  }

  .download {
    font-size: 24rpx;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    position: absolute;
    padding: 5rpx 30rpx;
    border-radius: 40rpx;
    bottom: 30rpx;
    left: 50%;
    transform: translateX(-50%);

    &:before {
      content: '';
      //@include bis('@/static/share/icon_download.png');
      width: 24rpx;
      height: 24rpx;
      margin-right: 15rpx;
    }
  }
}
</style>
