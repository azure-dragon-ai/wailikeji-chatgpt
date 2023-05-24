<template>
	<view class="content">
		<view class="flex-row ml-30 pad-24 mr-30" style="align-items:center">
			<image class="inline-block lili-img" mode="aspectFit" src="@/static/img/avatar.png"></image>
			<view class="ml-24">
				<text class="font-48 block">主人好</text>
				<text class="font-30">里里24小时在线为您提供答疑服务！</text>
			</view>
		</view>
		<issureTmpNew ref="issureTmpRef" v-if="mode === 'text'" :aiUser="aiUser" :user="user" :isConnect="isConnect"
			:content="content" @clear="clearContent" @updateIsConnect="updateIsConnect">
		</issureTmpNew>
		<drawTmpNew v-else ref="drawTmpRef" :aiUser="aiUser" :user="user" :content="content" @clear="clearContent">
		</drawTmpNew>
		<view class="footer-margin"></view>
		<view class="footer-input-box ">
			<view class="footer-btns flex-row flex-end">
				<view class="btn primary" @click="goPage('/pages/user/recharge/recharge')">
					充值问答币
				</view>
			</view>
			<view class="flex-row pad-24 flex-align">
				<view class="tool-btn radius-24 pad-12 mr-10">
					<u-icon size='42' :name="mode == 'paint' ?  'edit-pen' : 'photo'" @click="changeMode"
						:title="mode == 'paint' ?  '切换成提问模式' : '切换成绘画模式'"></u-icon>
				</view>
				<textarea v-model="content" placeholder="请输入您的问题" placeholder-class="input-placeholder"
					class="radius-10 mr-10 form-input pad-6" maxlength="2000" />
				<view class="send-btn btn primary flex-center" :class="{disabled:isConnect || !content}"
					@click="sendBtn">
					发送
				</view>
				<view class="tool-btn radius-24 pad-12 ml-10" v-if="mode==='text'">
					<u-icon size='42' name="plus-circle" title="提问模板" @click="displayTemplate"></u-icon>
				</view>
			</view>
			<view v-if="isShowTemplate" class="flex-row plf-15 moban-box flex-wrap">
				<view class="item bg-gray pad-18 mt-20 radius-10" v-for="item in allHotQS" :key="item">
					<view class="font-28 c-3" @click="issureTmpBtn(item)">
						{{item.qsTitle}}
					</view>
					<view class="mt-12 font-26 text-line2 c-6" @click="issureTmpBtn(item)">
						{{item.qsHint}}
					</view>
				</view>
			</view>
		</view>
		<askPopup ref="askPopupRef" @confirmAnswer="confirmAnswer"></askPopup>
	</view>
</template>

<script setup>
	import issureTmpNew from "@/pages/issureTmp/issureTmpNew"
	import drawTmpNew from "@/pages/issureTmp/drawTmpNew"
	import aislogo from '@/static/img/aislogo.png'
	import {
		ref,
		toRefs,
		reactive,
		getCurrentInstance
	} from 'vue'
	import {
		onLoad,
		onHide,
		onShow,
		onUnload,
	} from '@dcloudio/uni-app'
	import {
		toast,
		randerArray,
		toLogin
	} from '@/utils/tools.js'
	import {
		queryHotQs,
		queryAllQs,
		userInfo
	} from '@/http/index.js'
	const hotQS = reactive([]);
	const allHotQS = reactive([]);
	// text表示文字模式，paint表示绘画模式
	const user = reactive({
		nickName: '',
		avatar: '',
	})
	const aiUser = reactive({
		nickName: '小助手',
		avatar: aislogo,
	})
	const customStyle = reactive({
		color: "#ffffff",
		backgroundColor: "#63acb6",
		width: "85rpx"
	});
	let isConnect = ref(false);
	const mode = ref('text');
	const content = ref(''),
		isLoading = ref(false),
		isShowTemplate = ref(false);
	const askPopupRef = ref(null);
	const issureTmpRef = ref(null);
	const drawTmpRef = ref(null);

	const goPage = (url) => {
		uni.navigateTo({
			url: url
		})
	}

	const displayTemplate = () => {
		isShowTemplate.value = !isShowTemplate.value;
	}
	const updateIsConnect = (value) => {
		isConnect = value;
	}

	const changeMode = () => {
		mode.value = mode.value === 'text' ? 'paint' : 'text';
		isShowTemplate.value = false;
	}

	const sendBtn = (tmpContent = '') => {
		const token = uni.getStorageSync('token');
		if (!token) {
			toLogin()
			return;
		}

		if (isConnect.value) {
			return;
		}

		let msg = content.value;
		console.log(tmpContent)
		if (tmpContent && typeof tmpContent === 'string') {
			msg = tmpContent;
			uni.setStorageSync('tmpContent', '');
		}

		if (!msg) {
			return toast("发送内容不能为空")
		}

		if (mode.value === 'text') {
			issureTmpRef.value.sendBtn(msg);
		} else {
			drawTmpRef.value.sendBtn();
		}
	}

	const clearContent = () => {
		content.value = '';
	}

	let issureItem = {};
	const issureTmpBtn = (item) => {
		askPopupRef.value.ques.qsTitle = item.qsTitle;
		askPopupRef.value.ques.qsHint = item.qsHint;
		askPopupRef.value.ques.qsCall = item.qsCall;
		askPopupRef.value.openPopup();
		issureItem = item;
	}

	const confirmAnswer = (data) => {
		if (!data) {
			askPopupRef.value.openPopup()
			return toast('问题不能为空')
		}
		let contentValue = issureItem.qsCall + data;
		issureTmpRef.value.sendBtn(contentValue);
	}

	const functiongetQueryString = (name) => {
		let geturl = window.location.href
		let getqyinfo = geturl.split('?')[1] //qycode=1001&qyname=%E4%BC%81%E4%B8%9A%E5%BF%99   截取到参数部分
		let getqys = new URLSearchParams('?' + getqyinfo) //将参数放在URLSearchParams函数中
		return getqys.get(name);
	}

	onLoad(() => {
		queryHotQs().then(res => {
			let dataArray = randerArray(res.data, 4);
			hotQS.push(...dataArray);
		})
		queryAllQs().then(res => {
			let dataArray = randerArray(res.data, 4);
			allHotQS.push(...dataArray);
		})
		// #ifdef H5
		let pid = functiongetQueryString('pid');
		if (pid) {
			uni.setStorageSync('pid', pid);
		}
		// #endif
		// #ifdef MP-WEIXIN
		// 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面  
		let pages = getCurrentPages();
		let page = pages[pages.length - 1].$page.fullPath; //完整路由地址
		let pid = page.split('pid=')[1] //携带的pid参数
		if (pid) {
			uni.setStorageSync('pid', pid);
		}
		// #endif
	})

	onShow(() => {
		let tmpContent = uni.getStorageSync('tmpContent');
		console.log('tmpContent' + tmpContent)
		if (tmpContent) {
			sendBtn(tmpContent)
		}
		const token = uni.getStorageSync('token');
		if (!user.nickName && token) {
			userInfo().then(res => {
				let data = res.data;
				user.avatar = data.avatar || avatarDef;
				user.nickName = data.nickName;
			})
		}
	})

	onHide(() => {
		// 防止工具箱跳转页面时还在AI绘画模式
		mode.value = 'text';
	})

</script>

<style lang="scss" scoped>
	uni-page-body {
		height: 100%;
	}

	.content {
		background: linear-gradient(to bottom, rgba($theme-color, .8), $sec-bg-theme-color, $bg-gray-light, $bg-gray-light);
		min-height: 100%;
	}

	.lili-img {
		border-radius: 200rpx;
		width: 100rpx;
		height: 100rpx;
	}

	.list-content {
		.item {
			color: $theme-color;
			line-height: 32rpx;
			font-size: 24rpx;

			&+.item {
				margin-top: 10rpx;
			}

			&:hover {
				color: $theme-dark-color;
			}
		}
	}

	.moban-box {
		justify-content: space-around;
		max-height: 300rpx;
		overflow-y: auto;

		.item {
			width: 44vw;
			box-sizing: border-box;
		}
	}

	.footer-margin {
		height: 200rpx;
	}

	.footer-input-box {
		position: fixed;
		bottom: var(--window-bottom);
		left: 0;
		width: 100%;
		background-color: #FFFFFF;

		.footer-btns {
			position: absolute;
			top: -80rpx;
			right: 25rpx;

			.btn {
				font-size: 26rpx;
				line-height: 60rpx;
				border-radius: 10rpx;

				&.btn {
					margin-left: 12rpx;
				}
			}
		}

		.tool-btn {
			background-color: $theme-color;
			color: $bg-theme-color;
		}

		.form-input {
			flex: 1;
			font-size: 28rpx;
			height: 68rpx;
			border: 1px solid $sec-bg-theme-color;
			height: 48rpx;
		}

		.send-btn {
			width: 140rpx;
			height: 66rpx;
			border-radius: 33rpx;
			display: flex;

			&.disabled {
				opacity: .5;
			}
		}
	}
</style>