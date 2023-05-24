<template>
	<view class="mask-box" v-show="maskVisible">
		<view class="mask-content" style="padding-bottom:95px">
			<view class="mask-title font-26 c-3">
				选择支付方式 <image  @click="maskVisible = false" src="@/static/img/close.png" class="icon-close" mode=""></image>
			</view>
			<view class="mode-list mt-16">
				<view class="mode-item" v-for="item in modeArr" :key="item.id">
					<image :src="item.icon" class="icon-avatar" mode="" @click="modelChoose(item)"></image>
					<view class="mode-info" @click="modelChoose(item)">
						<view class="font-26">
							{{item.payName}}
						</view>
						<view class="font-24 text-line2 c-6 mt-4">
							{{item.modelContent}}
						</view>
					</view>
					<view class="mode-radio flex-row flex-center btn" @click="modelChoose(item)">
						选择
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {ref, reactive, onMounted  } from 'vue'
	import {	onLoad, onShow } from '@dcloudio/uni-app'
	import { payConfigList,pay } from '@/http/index.js'
	const maskVisible = ref(false)
	const modeArr = reactive([])
	onShow(()=>{
		let type = null;
		// #ifdef  MP
			type = 4
		// #endif
		// #ifdef H5
			let ua = navigator.userAgent
			if (ua.match(/MicroMessenger/i)=="micromessenger") {
				type = 2;
					// wxjsSdk.miniProgram.getEnv((res) => {
					// 		if (res.miniprogram) {
					// 				console.log('在小程序内');
					// 		} else {
					// 				console.log('不在小程序内');
					// 		}
					// })
				}
		// #endif
		let param = {};
		if(type){
			param.type = type;
		}
		payConfigList(param).then(res=>{
			modeArr.length = 0;
			// console.log('list',res.data);
			modeArr.push(...res.data)
		})
	})
	const  modelChoose = (item)=>{
		console.log('model item',item);
		console.log('model itemId',item.id);
		let commodityId = uni.getStorageSync('commodityId');
		if(!commodityId){
			uni.showToast({
				title:"请选择所购买产品",
				icon:'none'
			})
			return;
		}
		let param = {};
		param.commodityId = commodityId;//产品ID  recharge页面选择的产品 我带不来 先写死
		param.payId = item.id;
		pay(param).then(res=>{
			//判断环境  APP H5  公众号和小程序环境到不了这里
			//APP和H5环境都是返回的url  APP 就调用浏览器打开   H5直接跳转   
			// #ifdef APP-PLUS
			plus.runtime.openURL(res.data.payLink) //这里默认使用外部浏览器打开而不是内部web-view组件打开
			// #endif
			//H5需要判断是否在微信浏览器 也就是公众号环境  这里目前没判断 判断不来
			// #ifdef H5
			// window.open(res.data.payLink)
			setTimeout(() => {
			   window.location.href = res.data.payLink;
			}, 300);
			// #endif
			
			
		})
		maskVisible.value = false;
	}
	const openPopup = ()=>{
		maskVisible.value = true;
	}
	defineExpose ({
		maskVisible,
		openPopup,
	})
	
</script>

<style lang="scss">
	.mask-box{
		width:100vw;
		height: 100vh;
		position: fixed;
		top:0;
		left:0;
		z-index: 12;
		background-color: rgba(0,0,0,.15);
		.mask-content{
			background-color: #FFFFFF;
			position: absolute;
			border-radius: 20rpx 20rpx 0 0;
			left:0;
			bottom: 0;
			width: 100vw;
			padding:30rpx 30rpx;
		}
		.mask-title{
			text-align: center;
			position: relative;
			.icon-close{
				position: absolute;
				width: 32rpx;
				height: 32rpx;
				top:4rpx;
				right:2rpx;
			}
		}
		.mode-list{
			.mode-item{
				display: flex;
				// align-items: center;
				& + .mode-item{
					margin-top: 16rpx;
				}
				
				.icon-avatar{
					width:120rpx;
					height: 120rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
				}
				.mode-info{
					flex:1;
					height: 120rpx;
				}
				.mode-radio{
					margin-top:24rpx;
					background-color: $blue;
					height:60rpx;
					width:120rpx;
					color:#FFF;
					border-radius: 12rpx;
				}
			}
		}
	
	}
</style>