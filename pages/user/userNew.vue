<template>
	<view class="page">
		<view class="page-content">
			<view class="header-bg pt-36 text-center">
				<view class="userinfo">
					<view class="userinfo-top">
						<view class="left">
							<u-avatar :src="user.avatar || avatarDeft" mode="square"></u-avatar>
						</view>
						<view class="center">
							<view style="display: flex;">
								<view style="margin: 10rpx 10rpx">
									<u-line class="u-line" length="20rpx" direction="col"></u-line>
								</view>
								<view>{{user&&user.nickName?user.nickName:'未登录'}}</view>
							</view>
							<view style="display: flex;">
								<view style="margin: 10rpx 10rpx">
									<u-line class="u-line" length="20rpx" direction="col"></u-line>
								</view>
								<view class="id">ID号:{{user&&user.id?user.id:""}}</view>
							</view>
						</view>
						<u-button class="right" v-if="isLogin" type="primary" size="medium"
							:customStyle="{width: '160rpx',height:'60rpx'}" @click="loginBtn">修改信息 </u-button>
					</view>
					<u-row class="userinfo-data" gutter="16" justify="center">
						<u-col span="3" text-align="center" @click="navTo('/pages/user/withdrawLog/withdrawLog')">
							<view style="display: flex;">
								<view style="width: 100%;">
									<view class="number">{{user&&user.money?user.money:0}}</view>
									<view class="dsc">可提佣金</view>
								</view>
								<u-line class="u-line" length="50rpx" direction="col"></u-line>
							</view>
						</u-col>
						<u-col span="3" text-align="center" @click="navTo('/pages/user/speciesList/speciesList')">
							<view style="display: flex;">
								<view style="width: 100%;">
									<view class="number">{{user.msgCount?user.msgCount:0}}</view>
									<view class="dsc">问答币</view>
								</view>
								<u-line class="u-line" length="50rpx" direction="col"></u-line>
							</view>
						</u-col>
						<u-col span="3" text-align="center"
							@click="navTo('/pages/user/team/sonListNew', {key: 'sonPageType', value:1})">
							<view style="display: flex;">
								<view style="width: 100%;">
									<view class="number">{{user.directlyInviteCount?user.directlyInviteCount:0}}</view>
									<view class="dsc">直邀好友</view>
								</view>
								<u-line class="u-line" length="50rpx" direction="col"></u-line>
							</view>
						</u-col>
						<u-col span="3" text-align="center"
							@click="navTo('/pages/user/team/sonListNew', {key: 'sonPageType', value:2})">
							<view style="display: flex;">
								<view style="width: 100%;">
									<view class="number">{{user.indirectlyInviteCount?user.indirectlyInviteCount:0}}
									</view>
									<view class="dsc">间邀好友</view>
								</view>
							</view>
						</u-col>
					</u-row>
				</view>
				<view class="flex-row recharge-box radius-20 mt-30 space-between px-20 py-20">
					<view class="c-3 flex-row flex-align">
						<image src="@/static/img/huangguan.png" class="icon-vip" mode=""></image>
						<view v-if="user.vip" style="text-align: left;">
							<view style="margin-left: 5rpx;">会员时间：</view>
							<view style="margin-left: 5rpx;color: #b3b3b3;">{{user.vipDate}} </view>
						</view>
						<view v-else style="text-align: left;">
							<view style="margin-left: 5rpx;">未开通</view>
							<view style="margin-left: 5rpx;color: #b3b3b3;">开通会员免币提问</view>
						</view>
					</view>
					<navigator url="/pages/user/recharge/recharge" hover-class="none" class="btn recharge-btn">
						立即充值
					</navigator>
				</view>
			</view>
			<view class="flex-row radius-20  space-between" style="background: white; margin: 80rpx 30rpx 20rpx 30rpx">
				<view class="left" style="width: 50%;">
					<u-cell-item icon="man-add-fill" :iconStyle="{ color: '#4fc08d' }" title="我的团队"
						@click="navTo('/pages/user/team/team')" :border-bottom="false" :arrow="false" hover-class="none"
						:title-style="{color: '#303133' }">
					</u-cell-item>
					<u-cell-item icon="edit-pen" :iconStyle="{ color: '#ffa734' }" title="签到"
						@click="navTo('/pages/user/sign/signNew')" :border-bottom="false" :arrow="false"
						hover-class="none" :title-style="{color: '#303133' }">
					</u-cell-item>

				</view>
				<view class="right" style="width: 50%;">
					<u-cell-item icon="zhifubao-circle-fill" :iconStyle="{ color: '#5f8dff' }" title="佣金提现"
						@click="navTo('/pages/user/withdraw/withdraw')" :border-bottom="false" :arrow="false"
						hover-class="none" :title-style="{color: '#303133' }">
					</u-cell-item>
					<u-cell-item icon="share" :iconStyle="{ color: '#ff2229' }" title="邀请好友" @click="inviteImgNew"
						:border-bottom="false" :arrow="false" hover-class="none" :title-style="{color: '#303133' }">
					</u-cell-item>
				</view>
			</view>
			<!-- 菜单列表 -->
			<view class="nav-container mb-10 bg-white radius-12">
				<!-- #ifdef MP-WEIXIN -->
				<!--			<button class="navigator-box" open-type="contact" hover-class="none">-->
				<!--				<view class="flex-row flex-align font-30">-->
				<!--					<image src="@/static/img/kefu.png" class="icon-nav" alt=""></image>-->
				<!--					联系客服-->
				<!--				</view>-->
				<!--				<image src="@/static/img/right.png" class="icon-right" mode=""></image>-->
				<!--			</button>-->
				<!-- #endif -->
				<!--			<view class="navigator-box" url="/pages/user/team/team" @click="conponBtn" hover-class="none">-->
				<!--				<view class="flex-row flex-align font-30">-->
				<!--					<image src="@/static/img/conpon.png" class="icon-nav" alt=""></image>-->
				<!--					卡密兑换-->
				<!--				</view>-->
				<!--				<image src="@/static/img/right.png" class="icon-right" mode=""></image>-->
				<!--			</view>-->
				<u-cell-item icon="coupon" :iconStyle="{ color: '#4fc08d' }" title="卡密兑换" @click="conponBtn"
					:border-bottom="false" hover-class="none" :title-style="{color: '#303133' }">
				</u-cell-item>
				<!--			<navigator class="navigator-box" url="/pages/user/team/team" hover-class="none">-->
				<!--				<view class="flex-row flex-align font-30">-->
				<!--					<image src="@/static/img/nav1.png" class="icon-nav" alt=""></image>-->
				<!--					我的团队-->
				<!--				</view>-->
				<!--				<image src="@/static/img/right.png" class="icon-right" mode=""></image>-->
				<!--			</navigator>-->
				<!--			<navigator class="navigator-box" url="/pages/user/issureList/issureList" hover-class="none">-->
				<!--				<view class="flex-row flex-align font-30">-->
				<!--					<image src="@/static/img/nav2.png" class="icon-nav" alt=""></image>-->
				<!--					问答记录-->
				<!--				</view>-->
				<!--				<image src="@/static/img/right.png" class="icon-right" mode=""></image>-->
				<!--			</navigator>-->
				<u-cell-item icon="question-circle" :iconStyle="{ color: '#ff8a00' }" title="问答记录"
					@click="navTo('/pages/user/issureList/issureListNew')" :border-bottom="false" hover-class="none"
					:title-style="{color: '#303133' }">
				</u-cell-item>
				<u-cell-item icon="plus-people-fill" :iconStyle="{ color: '#ff2229' }" title="升级合伙人" @click="opneHhr()"
					:border-bottom="false" hover-class="none" :title-style="{color: '#303133' }">
				</u-cell-item>
				<!--			<navigator class="navigator-box" url="/pages/user/editInfo/editInfo" hover-class="none">-->
				<!--				<view class="flex-row flex-align font-30">-->
				<!--					<image src="@/static/img/nav3.png" class="icon-nav" alt=""></image>-->
				<!--					修改资料-->
				<!--				</view>-->
				<!--				<image src="@/static/img/right.png" class="icon-right" mode=""></image>-->
				<!--			</navigator>-->
				<!--			<navigator class="navigator-box" url="/pages/user/rechargeLog/rechargeLog" hover-class="none">-->
				<!--				<view class="flex-row flex-align font-30">-->
				<!--					<image src="@/static/img/nav4.png" class="icon-nav" alt=""></image>-->
				<!--					充值记录-->
				<!--				</view>-->
				<!--				<image src="@/static/img/right.png" class="icon-right" mode=""></image>-->
				<!--			</navigator>-->
				<u-cell-item icon="rmb-circle-fill" :iconStyle="{ color: '#ff8a00' }" title="充值记录"
					@click="navTo('/pages/user/rechargeLog/rechargeLog')" :border-bottom="false" hover-class="none"
					:title-style="{color: '#303133' }">
				</u-cell-item>

				<!--			<navigator class="navigator-box" url="/pages/user/withdrawLog/withdrawLog" hover-class="none">-->
				<!--				<view class="flex-row flex-align font-30">-->
				<!--					<image src="@/static/img/tixian.png" class="icon-nav" alt=""></image>-->
				<!--					佣金明细-->
				<!--				</view>-->
				<!--				<image src="@/static/img/right.png" class="icon-right" mode=""></image>-->
				<!--			</navigator>-->
				<u-cell-item icon="file-text" :iconStyle="{ color: '#2979ff' }" title="佣金明细"
					@click="navTo('/pages/user/withdrawLog/withdrawLog')" :border-bottom="false" hover-class="none"
					:title-style="{color: '#303133' }">
				</u-cell-item>
				<!--			<navigator class="navigator-box" url="/pages/user/speciesList/speciesList" hover-class="none">-->
				<!--				<view class="flex-row flex-align font-30">-->
				<!--					<image src="@/static/img/species.png" class="icon-nav" alt=""></image>-->
				<!--					问答币流水-->
				<!--				</view>-->
				<!--				<image src="@/static/img/right.png" class="icon-right" mode=""></image>-->
				<!--			</navigator>-->
				<u-cell-item icon="edit-pen-fill" :iconStyle="{ color: '#ffa734' }" title="问答币流水"
					@click="navTo('/pages/user/speciesList/speciesList')" :border-bottom="false" hover-class="none"
					:title-style="{color: '#303133' }">
				</u-cell-item>
				<!--      <u-cell-item icon="server-man" :iconStyle="{ color: '#4fc08d' }" title="联系客服" @click="conponBtn"-->
				<!--                   :border-bottom="false" hover-class="none" :title-style="{color: '#303133' }">-->
				<!--      </u-cell-item>-->
				<!--			<navigator class="navigator-box" hover-class="none" @click="loginOut()">-->
				<!--				<view class="flex-row flex-align font-30">-->
				<!--					<image src="@/static/img/logout.png" class="icon-nav" alt=""></image>-->
				<!--					退出登录-->
				<!--				</view>-->
				<!--				<image src="@/static/img/right.png" class="icon-right" mode=""></image>-->
				<!--			</navigator>-->
				<u-cell-item icon="backspace" :iconStyle="{ color: '#fc0107' }" title="退出登录" @click="loginOut()"
					:border-bottom="false" hover-class="none" :title-style="{color: '#303133' }">
				</u-cell-item>
			</view>
			<!-- 输入卡密 -->
			<view class="mask-box" v-if="cardVisible">
				<view class="mask-content">
					<view class="mask-title flex-row flex-center">
						输入卡密兑换 <image src="@/static/img/close_ff.png" @click="cardVisible=false" class="icon-close"
							mode="">
						</image>
					</view>
					<view class="mask-input-box">
						<input type="text" class="mask-input" placeholder="请输入卡密" v-model="cardPwd">
					</view>
					<view class="mask-footer flex-row flex-center btn primary" @click="confirmCardBtn">
						立即兑换
					</view>
				</view>
			</view>
			<!-- end of 输入卡密 -->
		</view>
	</view>
</template>

<script setup>
	import {
		onShow
	} from "@dcloudio/uni-app"
	import {
		userInfo,
		CamilleExchange,
		getPoster,
		SignIn
	} from '@/http/index.js'
	import {
		ref,
		reactive
	} from 'vue'
	import {
		vipDayCalc,
		toLogin,
		toast
	} from '@/utils/tools.js'
	import avatarDeft from '@/static/img/avatar_deft.png'
	const user = reactive({
		nickName: "",
		avatar: '',
		msgCount: 0,
		vipDay: 0
	});
	const isLogin = ref(true);
	onShow(() => {
		let token = uni.getStorageSync('token');
		getUserInfo()
		// userInfo().then(res=>{
		// 	isLogin.value = true;
		// 	let data = res.data;
		// 	user.nickName = data.nickName;
		// 	user.avatar = data.avatar;
		// 	user.msgCount = data.msgCount;
		// 	user.vipDay = vipDayCalc(data.vipDate);
		// }).catch((error)=>{
		// 	//这里不用判断 直接走接口 接口返回8000状态码 直接就是掉线了 对应取登录页面
		// 	isLogin.value = false;
		// 	console.log('user info',error)
		// })
	})

	const that = this;
	//在H5页面 param.code 无法获取code值
	// h5页面获取页面传参
	const functiongetQueryString = (name) => {
		const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		const url = window.location.search.split('?')[1] || '';
		const r = url.match(reg) || [];
		return r[2];
	}
	// #ifdef H5

	const search = window.location.search.split('?')[1] || '';
	console.log('search', search);
	// if (search){
	//     //在H5页面获取code值
	//     let code  = functiongetQueryString('code')
	//     //通过code值请求鉴权接口获取后台数据
	//     that.$http.get('api/wx_oauth',{code:code}).then(res => {
	//         console.log("授权登录", res);
	//         if (res.status_code == 200) {
	//             let open_id = res.data.open_id;
	//             let nickname = res.data.nickname;
	//             let avatar = res.data.avatar;
	//             //利用open_id  nickname  avatar 调用登录
	//             that.$http.post("api/login", {
	//                 open_id: open_id,
	//                 nickname: nickname,
	//                 avatar: avatar,
	//             }).then(res1 => {
	//                 console.log('登录信息', res1)
	//             })
	//         } else {
	//             that.$tool.toast(res.message)
	//         }
	//     })
	// }
	// #endif
	const loginBtn = () => {
		if (isLogin.value) {
			uni.navigateTo({
				url: '/pages/user/editInfo/editInfo'
			})
		} else {
			toLogin()
		}
	}
	let cardPwd = ref(''),
		cardVisible = ref(false);

	function conponBtn() {
		cardPwd.value = '';
		cardVisible.value = true;
	}
	/**
	 * 跳转路由
	 * @param {Object} url
	 */
	function navTo(url, options) {
		if (options) {
			uni.setStorageSync(options.key, options.value);
		}
		uni.navigateTo({
			url: url
		});
	}
	const isSign = ref(false);
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
	const inviteImgNew = () => {
    uni.setStorageSync('userInfo', user);
    uni.navigateTo({
      url: `/pages/user/share/share`
    })
	}

	function opneHhr() {
		uni.setStorageSync('tabIndex', 2);
		uni.navigateTo({
			url: `/pages/user/recharge/recharge`
		})
	}

	function getUserInfo() {
		userInfo().then(res => {
			// console.log("userInfo",res.data)
			isLogin.value = true;
			let data = res.data;
			user.id = data.id;
			user.nickName = data.nickName;
			user.avatar = data.avatar;
			user.money = data.money;
			user.msgCount = data.msgCount;
			user.directlyInviteCount = data.directlyInviteCount;
			user.indirectlyInviteCount = data.indirectlyInviteCount;
			user.vipDay = vipDayCalc(data.vipDate);
			user.vipDate = data.vipDate;
			user.vip = data.vip;
		}).catch((error) => {
			//这里不用判断 直接走接口 接口返回8000状态码 直接就是掉线了 对应取登录页面
			isLogin.value = false;
			console.log('user info', error)
		})
	}
	//提交卡密兑换
	function confirmCardBtn() {
		if (!cardPwd.value) {
			return toast("卡密不能为空")
		}
		let param = {
			camilleNumber: cardPwd.value
		}
		CamilleExchange(param).then(res => {
			console.log(res)
			toast("兑换成功")
			cardVisible.value = false;
			getUserInfo()
		})
	}

	function loginOut() {
		try {
			// 清理缓存
			uni.clearStorageSync();
			// 重新加载，解决退出登录后提问记录还在的问题
			uni.reLaunch({
				url: '/pages/user/editInfo/editInfo'
			});
		} catch (e) {
			toast('退出登录失败！')
		}
	}
</script>

<style lang="scss" scoped>
	uni-page-body,
	.page {
		height: 100%;
		overflow-y: auto;
	}

	.page-content {
		min-height: 100%;
	}

	.header-bg {
		background-color: $theme-color;
		color: #ffffff; //字体色
		height: 350rpx;
		padding-top: 50rpx;

		//用户信息
		.userinfo {
			.userinfo-top {
				display: flex;
				width: 90%;

				.left {
					margin-left: 70rpx;
				}

				.center {
					width: 50%;
					margin-left: 20rpx;
				}
			}

			//用户数据
			.userinfo-data {
				padding: 10px 15px;

				//用户数据值
				.number {
					margin-bottom: 4px;
					font-size: 38rpx;
					font-family: DINPro;
				}

				//用户数据描述
				.dsc {
					font-family: PingFang SC;
					font-weight: 500;
					color: #f4edf9;
				}
			}
		}
	}

	.icon-edit {
		width: 40rpx;
		height: 40rpx;
		margin-left: 12rpx;
	}

	.recharge-box {
		background: white;

		margin: 5rpx 30rpx 0 30rpx;

		.icon-vip {
			width: 80rpx;
			height: 70rpx;
			margin: 0rpx 30rpx;
		}

		.recharge-btn {
			background-color: #2979ff;
			height: 65rpx;
			line-height: 65rpx;
			border-radius: 40rpx;
			font-size: 26rpx;
		}
	}

	.nav-container {
		margin-left: 30rpx;
		margin-right: 30rpx;

		.navigator-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 90rpx;
			padding: 0 12rpx;
			border-bottom: 1px solid #E5E5E5;
		}

		.icon-nav {
			width: 40rpx;
			height: 40rpx;
			margin-right: 12rpx;
		}

		.icon-right {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.mask-box {
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, .2);
		position: fixed;
		top: 0;
		right: 0;

		.mask-content {
			width: 560rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #FFF;
			border-radius: 20rpx;
		}

		.input-textarea {
			margin-top: 20rpx;
			width: 500rpx;
			height: 350rpx;
			box-sizing: border-box;
			border: 1rpx solid #EFEFEF;
			border-radius: 10rpx;
			padding: 20rpx;
			line-height: 1, .25;
		}

		.mask-title {
			border-radius: 20rpx 20rpx 0 0;
			background-image: linear-gradient(90deg, #4fc08d, #4fc08d);
			height: 90rpx;
			color: #FFFFFF;
			position: relative;
			font-size: 30rpx;

			.icon-close {
				position: absolute;
				right: 20rpx;
				top: 50%;
				width: 40rpx;
				height: 40rpx;
				transform: translateY(-50%);
			}
		}

		.mask-footer {
			background: #4fc08d;
			margin: 40rpx 30rpx 30rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 12rpx;
		}

		.mask-input-box {
			margin-top: 30rpx;

			.mask-input {
				margin: 10rpx 0;
				padding: 0 30rpx;
			}
		}
	}
</style>