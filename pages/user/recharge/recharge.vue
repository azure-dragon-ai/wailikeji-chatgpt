<template>
	<view>
		<view class="user-header flex-row">
			<view class="">
				<image :src="user.avatar" class="avatar-img" mode=""></image>
			</view>
			<view class="info-content">
				<view class="title c-f font-32">
					{{user.nickName}}
				</view>
				<view class="content-box mt-20 flex-row">
					<view class="text-btn flex-center">
						问答币：{{user.msgCount}}
					</view>
					<view class="text-btn flex-center ml-30">
						会员时长：{{user.vipDay}}天
					</view>
				</view>
			</view>
			<navigator url="/pages/user/rechargeLog/rechargeLog" hover-class="none" class="recharge-log-btn flex flex-center px-20 btn">
				记录
			</navigator>
		</view>
		<view class="tab-list flex-row pad py-20">
			<view class="tab-item" :class="{active:tabIndex===index}" @click="tabClick(index)" v-for="(item,index) in tabList" :key="index">
				{{item.name}}
			</view>
		</view>
		<swiper :indicator-dots="false" class="swiper-container" @change="currentChange"  :interval="3000" :current="tabIndex">
			<swiper-item class="swiper-item pt-30">
				<view class="item pad-40" :class="{on:content1==index}" @click="contentBtn(index)" v-for="(item,index) in tabContentArray1">
					<view class="flex-row space-between font-bold">
						<view class="font-36 ">
							{{item.commodityName}}
						</view>
						<view class="font-36 ">
							<text class="font-26">￥</text>{{item.commodityPrice}}
						</view>
					</view>
					<view class="flex-row space-between mt-10 info-box">
						<view class="font-28 ">
							会员天数 {{item.commoditySpec}}
						</view>
						<!-- <view class="font-28">
							原价：<text class="font-28 text-line">{{item.remark}}</text>元 
						</view> -->
					</view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item pt-30">
				<view class="item pad-40" :class="{on:content2==index}" @click="contentBtn2(index)" v-for="(item,index) in tabContentArray2">
					<view class="flex-row space-between font-bold">
						<view class="font-36 ">
							{{item.commodityName}}
						</view>
						<view class="font-36 ">
							<text class="font-26">￥</text>{{item.commodityPrice}}
						</view>
					</view>
					<view class="flex-row space-between mt-10 info-box">
						<view class="font-28 ">
							问答币 {{item.commoditySpec}}
						</view>
						<!-- <view class="font-28">
							原价：<text class="font-28 text-line">{{item.remark}}</text>元 
						</view> -->
					</view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item pt-30">
				<view class="item pad-40" :class="{on:content3==index}" @click="contentBtn3(index)" v-for="(item,index) in tabContentArray3">
					<view class="flex-row space-between font-bold">
						<view class="font-36 ">
							{{item.commodityName}}
						</view>
						<view class="font-36 ">
							<text class="font-26">￥</text>{{item.commodityPrice}}
						</view>
					</view>
					<view class="flex-row space-between mt-10 info-box">
						<view class="font-28 ">
							{{item.remark}}
						</view>
					</view>
				</view>
			</swiper-item>
			<!-- <swiper-item class="swiper-item pt-30">
				<view class="flex-row space-between flex-align bg-gray pad-30 radius-20">
					<view class="left">
						<view class="font-30 ">
							签到领AI星球币(今日{{isSign?1:0}}/1)
						</view>
						<view class="c-y mt-10">
							5AI星球币1次
						</view>
					</view>
					<view class="sign-btn flex-row flex-center" @click="signBtn" :class="{sign:isSign}">
						立即签到
					</view>
				</view>
			</swiper-item> -->
		</swiper>
		<view v-if="[0,1].includes(tabIndex)">
			<view class="mt-12 font-26 text-line2 c-6">
				会员不限制问答次数
			</view>
			<view class="mt-12 font-26 text-line2 c-6">
				非会员对话问答1问答币1次
			</view>
			<view class="mt-12 font-26 text-line2 c-6">
				非会员AI绘画{{imgCount}}问答币1次
			</view>
		</view>
		<view v-if="[2].includes(tabIndex)">
			<view class="mt-12 font-26 text-line2 c-6">
				合伙人:
			</view>
			<view class="mt-12 font-26 text-line2 c-6">
				邀请直属下级返利比例{{HHRONE}}%
			</view>
			<view class="mt-12 font-26 text-line2 c-6">
				二级返利比例{{HHRTWO}}%
			</view>
		</view>
		<view class="purchase-footer  bg-gray flex-row space-between pad flex-align" v-if="[0,1,2].includes(tabIndex)">
			<view class="left font-36">
				{{price}} <text class="font-24">元</text>
			</view>
			<view class="btn primary purchase-btn flex-center" @click="purchaseClick">
				购买
			</view>
		</view>
		
		<!-- 支付通道  -->
		<payPopup ref="payPopupRef"></payPopup>
	</view>
</template>

<script setup>
	// import {  } from '@vue/runtime-core';
	import { defineComponent, reactive,ref , getCurrentInstance} from 'vue';
	import { onReady, onShow } from "@dcloudio/uni-app";
	import {setNavigation,vipDayCalc} from '@/utils/tools.js'
	import {userInfo,commodityList,pay } from '@/http/index.js'
	import defAvatar from '@/static/img/avatar_deft.png'
	// const currentInstance = getCurrentInstance();
	import payPopup from '@/components/payPopup/payPopup'
	defineComponent({
		components:{
			payPopup
		}
	})
	onReady(()=>{
		setNavigation();
		commodityList().then(res=>{
			let tabIndexStorage = uni.getStorageSync('tabIndex');
			
			let data = res.data;
			if(data.VIP[0]){
				price.value = data.VIP[0].commodityPrice
				commodityId.value = data.VIP[0].id
				uni.setStorageSync('commodityId', data.VIP[0].id);
			}
			if(tabIndexStorage){
				tabClick(tabIndexStorage);
				if(data.HHR[0]){
					price.value = data.HHR[0].commodityPrice
					uni.setStorageSync('commodityId', data.HHR[0].id);
				}
				uni.removeStorageSync('tabIndex');
			}
			tabContentArray1.push(...data.VIP);
			tabContentArray2.push(...data.STR);
			tabContentArray3.push(...data.HHR);
			HHRTWO.value = data.HHRTWO;
			HHRONE.value = data.HHRONE;
		})
	})
	onShow(()=>{
		userInfo().then(res=>{
			let data = res.data;
			user.nickName = data.nickName;
			if(data.avatar){
				user.avatar = data.avatar
			}
			vipCount.value = data.vipCount;
			imgCount.value = data.imgCount;
			user.msgCount = data.msgCount;
			user.vipDay = vipDayCalc(data.vipDate);
		})
		
		// isTodaySign().then(res=>{
		// 	if(res.data.type === '1'){
		// 		isSign.value = true;
		// 	}
		// })
	})
	const user = reactive({
		nickName:'',
		avatar:defAvatar,
		msgCount:0,
		vipDay:0,
	})
	let vipCount = ref(0);
	let imgCount = ref(0);
	let HHRONE = ref(0);
	let HHRTWO = ref(0);
	const tabList =reactive([
		{name:'购买会员时长'},
		{name:'购买问答币'},
		{name:'升级合伙人'},
	]);
	const tabIndex = ref(0)
	const tabClick = (index)=>{
		tabIndex.value = index;
	}
	const price = ref('0.00');
	//充值会员
	const tabContentArray1 = reactive([]);
	const content1 = ref(0);
	let commodityId = ref(0);
	const tabContentArray3 = reactive([]);
	const content3 = ref(0);
	const contentBtn = (index)=>{
		
		content1.value = index;
		// console.log(tabContentArray1[content1.value])
		commodityId.value = tabContentArray1[content1.value].id
		uni.setStorageSync('commodityId', tabContentArray1[content1.value].id);
		price.value = tabContentArray1[content1.value].commodityPrice
	}
	const currentChange = ({detail})=>{
		// console.log(detail)
		tabIndex.value = detail.current;
		let current = detail.current;
		if(current === 0){
			price.value = tabContentArray1[content1.value].commodityPrice
			commodityId.value = tabContentArray1[content1.value].id
			uni.setStorageSync('commodityId', tabContentArray1[content1.value].id);
		}else if(current === 1){
			price.value = tabContentArray2[content2.value].commodityPrice
			commodityId.value = tabContentArray2[content2.value].id
			uni.setStorageSync('commodityId',tabContentArray2[content2.value].id);
		}else if(current === 2){
			price.value = tabContentArray3[content3.value].commodityPrice
			commodityId.value = tabContentArray3[content3.value].id
			uni.setStorageSync('commodityId',tabContentArray3[content3.value].id);
		}
	}
	const contentBtn3 = (index)=>{
		content3.value = index;
		commodityId.value = tabContentArray3[content3.value].id
		uni.setStorageSync('commodityId',tabContentArray3[content3.value].id);
		price.value = tabContentArray3[content3.value].commodityPrice
	}
	//充值星球币
	const tabContentArray2 = reactive([]);
	const content2 = ref(0);
	
	const contentBtn2 = (index)=>{
		content2.value = index;
		commodityId.value = tabContentArray2[content2.value].id
		uni.setStorageSync('commodityId',tabContentArray2[content2.value].id);
		price.value = tabContentArray2[content2.value].commodityPrice
	}
	//签到金币
	const isSign = ref(false);
	const signBtn = ()=>{
		isSign.value = true;
	}
	
	//购买支付
	const payPopupRef = ref(null)
	const purchaseClick = ()=>{
		// #ifdef MP-WEIXIN
		toPayMiniApp(4);
		//#endif
		// #ifdef H5
			//H5就判断是否微信内部
			let ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger"){
				//是 直接拉微信支付 公众号传2 小程序传4
				toPay(2);
			}else{
				// alert(123)
				payPopupRef.value.openPopup();
			}
		//#endif
		// #ifdef APP-PLUS
			payPopupRef.value.openPopup();
		//#endif
		
	}
	function toPay(value){
		let param = {};
		param.commodityId = commodityId.value;//产品ID  recharge页面选择的产品 我带不来 先写死
		param.payId = value;
		pay(param).then(res=>{
			console.log(res)
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest', {
					"appId": res.data.appId, //公众号名称，由商户传入
					"timeStamp": res.data.timestamp, //时间戳，自1970年以来的秒数
					"nonceStr": res.data.nonceStr, //随机串
					"package": res.data.package,
					"signType": res.data.signType, //微信签名方式：
					"paySign": res.data.paySign //微信签名
				},
				function(res) {
					if (res.err_msg === "get_brand_wcpay_request:ok") {
						// 使用以上方式判断前端返回,微信团队郑重提示：
						//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
						uni.showLoading({
							title: '支付成功'
						});
						setTimeout(function() {
							uni.hideLoading();
							uni.switchTab({
								url: '/pages/user/user'
							})
						}, 1000);
					} else {
						uni.hideLoading();
					}
					WeixinJSBridge.log(res.err_msg);
				}
			);
		})
	}
	function toPayMiniApp(value){
		let param = {};
		param.commodityId = commodityId.value;//产品ID 
		param.payId = value;
		pay(param).then(res=>{
			console.log(res)
			uni.requestPayment({
				provider: 'wxpay',    //支付类型-固定值
				timeStamp: res.data.timestamp, // 时间戳（单位：秒）
				nonceStr: res.data.nonceStr, // 随机字符串
				package: res.data.package, // 固定值
				signType: res.data.signType, //固定值
				paySign: res.data.paySign, //签名
				
				success: function (res) {
					// console.log('success:' + JSON.stringify(res));
					uni.showLoading({
						title: '支付成功'
					});
					setTimeout(function() {
						uni.hideLoading();
						uni.switchTab({
							url: '/pages/user/user'
						})
					}, 1000);
				},
				
				fail: function (err) {
					console.log('fail:' + JSON.stringify(err));
					console.log("支付失败");
					uni.showToast({
						icon: 'none',
						title: '支付失败'
					})
				}
			})

		})
	}
</script>

<style lang="scss" scoped>
	.user-header{
		background-color: $theme-color;
		padding:30rpx 30rpx 24rpx;
		.avatar-img{
			width:120rpx;
			height:120rpx;
			border-radius: 50%;
		}
		.info-content{
			flex:1;
			margin-left:16rpx;

			.content-box{
				.text-btn{
					border:1px solid $yellow-text;
					color:$yellow-text;
					&.text-btn{
						display: flex;
						height:44rpx;
						border-radius: 22rpx;
						font-size: 24rpx;
						padding:0 16rpx;
					}
				}
			}
		}
		
		.recharge-log-btn{
			background-color: $yellow;
			color:#FFF;
			height:52rpx;
			border-radius: 26rpx;
		}
	}
	.tab-list{
		justify-content: space-around;
		.tab-item{
			font-size: 32rpx;
			&.active{
				position: relative;
				&::after{
					content:'';
					width:120rpx;
					height:6rpx;
					background-color: $theme-color;
					position: absolute;
					bottom:-12rpx;
					left:50%;
					transform: translateX(-50%);
				}
			}
		}
	}
	.pt-30{
		margin-top:20rpx;
	}
	.swiper-container{
		height:860rpx;
		
		.swiper-item{
			padding:0 30rpx;
			box-sizing: border-box;
			height:560rpx;
			
			
			.item{
				background-color: #F5F5F5;
				color:#333;
				border-radius: 12rpx;
				&+.item{
					margin-top:24rpx;
				}
				&.on{
					background-color: $theme-color;
					color:#FFF;
					.info-box{
						color:$yellow-text;
					}
				}
				
			}
			.text-line{
				text-decoration: line-through;
			}
		}
		.sign-btn{
			background-color: $theme-color;
			color:#FFFFFF;
			height:60rpx;
			width:160rpx;
			border-radius: 30rpx;
			font-size: 26rpx;
			&.sign{
				background-color: #BEBEBE;
			}
		}
	}
	.purchase-footer{
		padding:24rpx 30rpx;
		position: fixed;
		bottom:0;
		left:0;
		width:100%;
		z-index: 10;
		
		.purchase-btn{
			display: flex;
			height:80rpx;
			width:180rpx;
			border-radius: 40rpx;
		}
	}
</style>
