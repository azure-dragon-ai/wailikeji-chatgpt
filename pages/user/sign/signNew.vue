<!--
  - Copyright(c)  2022 厦门外里科技有限公司 All rights reserved.
  -
  - https://www.wailikeji.com
  -
  - 版权所有，侵权必究！
  -->

<template>
  <view class="wrap">
    <view class="header">
      <view class="gold">
        {{ userMsgCount }}
      </view>
      <view class="goldDesc">
        我的问答币
      </view>
    </view>
    <view class="panel" style="margin-top: -85rpx; ">
      <view class="panel-content">
        <u-cell-item v-if="isSign"  title="今天已签到" label="开通会员无需问答币" :arrow="false" hover-class="none"
                     :title-style="titleStyle">
          <u-button shape="circle" type="warning" size="medium" style=" width: 180rpx;" :disabled="true">
            已签到</u-button>
        </u-cell-item>
        <u-cell-item v-else title="今天还未签到" label="开通会员无需问答币"
                     :arrow="false" hover-class="none" :title-style="titleStyle">
          <u-button shape="circle" type="warning" size="medium" style=" width: 180rpx;"
                    @click="signBtn">
            签到{{ msgCount }}问答币</u-button>
        </u-cell-item>

      </view>
    </view>
    <view style="padding: 0 30rpx 0; margin-top: 50rpx; font-size: 40rpx;">赚问答币</view>
    <view class="panel">
      <view class="panel-content">
        <u-cell-item icon="share" :iconStyle="{ color: '#fc0107'}" icon-size="60rpx" title="邀请好友"
                     :label="'邀请一个好友获得'+msgCount+'问答币'" :arrow="false" hover-class="none"
                     :title-style="titleStyle">
          <u-button shape="circle" :hair-line="false" size="medium" style=" width: 100rpx;"
                    @click="inviteImg">去邀请
          </u-button>
        </u-cell-item>
      </view>
    </view>
    <view style="padding: 0 30rpx 0; margin-top: 50rpx; font-size: 40rpx;">问答币用途</view>
    <view class="panel">
      <view class="panel-content">
        <u-cell-item icon="plus-people-fill" :iconStyle="{ color: '#0f80ff'}" icon-size="60rpx" title="AI问答"
                     :label="'发布群需要消耗问答币'" :arrow="false" hover-class="none"
                     :title-style="titleStyle">
          <u-button shape="circle" :hair-line="false" size="medium" style=" width: 100rpx;"
                    @click="switchTab('/pages/index/index')">去提问
          </u-button>
        </u-cell-item>
        <u-cell-item icon="arrow-upward" :iconStyle="{ color: '#fd8008'}" icon-size="60rpx" title="AI绘画"
                     :label="'问答币可置顶一分钟'" :arrow="false" hover-class="none"
                     :title-style="titleStyle">
          <u-button shape="circle" :hair-line="false" size="medium" style=" width: 100rpx;"
                    @click="switchTab('/pages/index/index')">去绘画
          </u-button>
        </u-cell-item>
      </view>
    </view>
  </view>
</template>

<script setup>
import {
  getPoster,
  SignIn,
  isTodaySign,
  userInfo
} from '@/http/index.js'
import {
  ref
} from 'vue'
import { onShow } from "@dcloudio/uni-app"

let userMsgCount = ref(0);
let isSign = ref(false);

let titleStyle = {
  'color': "#303133",
  'font-size': '40rpx'
};
let msgCount = ref(0);
onShow(()=>{
  getUserInfo();

  isTodaySign().then(res=>{
    if(res.data.type === '1'){
      isSign.value = true;
    }
    //每日签到给币数量
    msgCount.value = res.data.msgCount;
  })
})
function getUserInfo(){
  userInfo().then(res=>{
    let data = res.data;
    userMsgCount.value = data.msgCount
  })
}
/**
 * 跳转路由
 * @param {Object} url
 */
function switchTab(url) {
  uni.switchTab({
    url:url
  })
}
/**
 * 跳转路由
 * @param {Object} url
 */
function navTo(url) {
  uni.navigateTo({
    url: url
  });
}

const signBtn = () => {
  if (!isSign.value) {
    SignIn().then(res => {
      uni.showToast({
        title: res.data,
        icon: 'none'
      })
      isSign.value = true;
      // isSignText.value = "已签到";
      getUserInfo();
    })
  }
}
const inviteImg = () => {

  uni.showLoading({
    title: '生成中...'
  });
  getPoster().then(res => {
    uni.hideLoading();
    uni.setStorageSync('posterUrl', res.data);
    uni.navigateTo({
      url: `/pages/user/share/share`
    })
  })
}
</script>

<style lang="scss">
page {
  background: #f8f8f8;
}

.header {
  background: linear-gradient(#f8f8f8, #d7e3f0);
  height: 400rpx;

  .gold {
    display: flex;
    justify-content: center;
    font-size: 120rpx;
    margin-top: 60rpx;
  }

  .goldDesc {
    display: flex;
    justify-content: center;
    font-size: 30rpx;
  }
}

.panel {
  padding: 0 30rpx 0;
  // color: black;

  .panel-content {
    background: white;
    margin: 0 auto;
    border-radius: 16rpx; //面包圆形倒角
    box-shadow: 0 2rpx 20rpx rgba(183, 183, 183, 0.3); //周边阴影
    margin-top: 16rpx; //顶部间隔
  }
}
</style>
