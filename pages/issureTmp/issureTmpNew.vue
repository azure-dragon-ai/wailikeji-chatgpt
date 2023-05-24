<template>
	<view class="pad page-top page">
		<view class="chat-box ">
			<image src="@/static/img/aislogo.png" class="avatar-img" mode=""></image>
			<view class="content-info">
				<view class="title font-24 c-6">
					小助手里里
				</view>
				<view class="say-content temp-content bg-gray" style="padding-bottom:20rpx;">
					<view class="">
						猜您想问：
					</view>
					<template v-if="hotArray.length">
						<view class="ques-tips" @click="sendBtn(item.hotQs)" v-for="item in hotArray" :key="item.id">
							{{item.hotQs}}
						</view>
					</template>
					<template v-else>
						<view class="loading-box">
							<image src="@/static/img/loading.png" class="loading-img" mode=""></image>
						</view>
					</template>
					<view class="rechange-box flex-row flex-end flex-align" @click="getHotQS">
						换一换<u-icon name="reload" size="32"></u-icon>
					</view>
					<button class="btn primary mt-12" @click="maskVisible = true;">切换AI角色</button>
				</view>
			</view>
		</view>
		<view class="chat-box" :class="{'user-msg':item.self === 1}" v-for="(item,index) in chatList" :key="item.id">
			<image v-if="item.avatarImg && item.avatarImg !== '123456'" :src="item.avatarImg" class="avatar-img">
			</image>
			<view v-else class="error-img">
				<u-icon name="account" size='65'></u-icon>
			</view>
			<view class="content-info">
				<view class="title font-24 c-6">
					{{item.modelRole}}
				</view>
				<view class="say-content-box">
					<view class="say-content" :class="{'item-content':item.self === 0}">
						<template v-if="item.isList">
							<view v-for="(its,index) in item.contentList" :class="{'markdown-box':its.isCode}"
								:key="index">
								<mp-html v-if="its.isCode" :content="its.content"></mp-html>
								<text v-else>{{its.content}}</text>
							</view>
						</template>

						<text v-else
							:class="{'move-cursor':isConnect&& item.self === 0 && (index+1==chatList.length)}">{{item.content}}
						</text>
					</view>
				</view>
				<view class="mt-8 c-6 font-24" :class="{'copy-txt':item.self === 1}" v-if="item.isEnd || item.self " @click="copyContentBtn(item.content)">
					复制内容
				</view>
			</view>
		</view>

		<!-- 选择模型 -->
		<view class="mask-box" v-show="maskVisible">
			<view class="mask-content">
				<view class="mask-title font-26 c-3">
					选择模型 <image @click="maskVisible = false" src="@/static/img/close.png" class="icon-close">
					</image>
				</view>
				<view class="mode-list mt-16">
					<view class="mode-item" v-for="item in modeArr" :key="item.id">
						<image :src="item.modelImg" class="icon-avatar" mode=""></image>
						<view class="mode-info">
							<view class="font-26">
								{{item.modelTitle}}
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
	</view>
</template>

<script setup>
	import mpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html";
	import {
		marked
	} from "marked";
	import hljs from "highlight.js";
	import "highlight.js/scss/atom-one-dark.scss";

	import {
		ref,
		reactive,
		nextTick,
		toRefs
	} from 'vue'
	import {
		onLoad,
		onShow,
		onUnload,
		onHide
	} from '@dcloudio/uni-app'
	import {
		queryAiModel,
		cleanHistory,
		queryHotQs
	} from '@/http/index.js'
	import {
		toast,
		copyContent,
		toLogin
	} from '@/utils/tools.js'
	import {
		BASE_WS
	} from "../../utils/env";
	import avatarDef from '@/static/img/avatar_deft.png'

	const modeArr = reactive([]),
		hotArray = reactive([]);
	const props = defineProps({
		content: String,
		isConnect: Boolean,
		user: Object,
		aiUser: Object,
	})
	const emit = defineEmits(['clear', 'updateIsConnect'])
	let {
		content,
		isConnect,
		user,
		aiUser
	} = toRefs(props);

	let socketTask = null,
		scrollTop = ref(0),
		qsTimer = new Date().getTime(),
		wssIsConnect = true;

	function initHighLight() {
		hljs.configure({
			useBR: true,
			tabReplace: " ",
		});
		marked.setOptions({
			renderer: new marked.Renderer(),
			gfm: true,
			tables: true,
			breaks: false,
			pedantic: false,
			highlight: function(code, lang) {
				if (lang && hljs.getLanguage(lang)) {
					return hljs.highlight(lang, code, true).value;
				} else {
					return hljs.highlightAuto(code).value;
				}
			},
		});
	}
	const getHotQS = () => {
		hotArray.length = 0;
		queryHotQs().then(res => {
			if (res.data.length > 3) {
				res.data.length = 3
			}
			hotArray.push(...res.data);
		})
	}
	const copyContentBtn = (item) => {
		copyContent(item);
	}
	const sendBtn = (msg = '') => {
		const token = uni.getStorageSync('token');
		if (!token) {
			toLogin()
		}

		const contentValue = msg ? msg : content.value;
		let data = {
			msg: contentValue,
			modelId: modelId.value,
		}
		wssIsConnect = false;
		uni.sendSocketMessage({
			data: JSON.stringify(data),
			success() {
				chatList.push({
					modelRole: user.value.nickName,
					avatarImg: user.value.avatar,
					self: 1,
					id: +new Date(),
					content: contentValue,
				})
				emit('clear')
				chatList.push({
					modelRole: aiUser.value.nickName,
					avatarImg: aiUser.value.avatar,
					self: 0,
					id: +new Date(),
					content: '正在思考中...',
					isEnd: false,
				})
				nextTick(scrollBottom)
			}
		})
		setTimeout(() => {
			if (!wssIsConnect) {
				toast("wss连接已断开，请退出页面重新进入")
			}
		}, 10000)
	}

	function scrollBottom() {
		const query = uni.createSelectorQuery()
		query
			.select('.page-top')
			.boundingClientRect((data) => {
				if (data & data.height) {
					let pageScrollTop = Math.round(data.height);
					uni.pageScrollTo({
						scrollTop: pageScrollTop, //滚动的距离
						duration: 0, //过渡时间
					})
				}
			}).exec()
	}

	const chatList = reactive([]),
		modelId = ref('')
	const modelChoose = (data) => {
		aiUser.avatar = data.modelImg;
		aiUser.nickName = data.modelTitle;

		maskVisible.value = false;
		let {
			modelImg: avatarImg,
			modelTitle: modelRole,
			modelCall: content,
			id
		} = data;
		modelId.value = id;
		chatList.push({
			avatarImg,
			modelRole,
			content,
			id: +new Date(),
			self: 0,
		})
		//切换模型以后要调用接口清空上下文
		cleanHistory();
	}

	//复制文本
	const copyBtn = () => {
		// #ifdef H5
		let textarea = document.createElement("textarea")
		textarea.value = textContent.value;
		textarea.readOnly = "readOnly"
		document.body.appendChild(textarea)
		textarea.select() // 选中文本内容
		textarea.setSelectionRange(0, textContent.value.length)
		uni.showToast({ //提示
			title: '复制成功',
			icon: 'success'
		})
		document.execCommand("copy")
		textarea.remove();
		// #endif
		// #ifndef H5
		uni.setClipboardData({
			data: this.textContent.value, //要被复制的内容
			success: () => { //复制成功的回调函数
				uni.showToast({ //提示
					title: `复制成功`,
					icon: 'success'
				})
			}
		}, true);
		// #endif
	}
	const maskVisible = ref(false)
	const createSocket = () => {
		const token = uni.getStorageSync('token');
		if (!token) {
			return;
		}
		//创建链接
		socketTask = uni.connectSocket({
			url: BASE_WS + '/api/websocket/' + token, //仅为示例，并非真实接口地址。
			success: (res) => {
				console.log('ws succ', res);
			},
			complete(res) {
				console.log('ws complete', res);
			}
		});
		socketTask.onOpen(function(res) {
			console.log('WebSocket连接已打开！');
			if (content.value) {
				sendBtn();
			}
		})
		socketTask.onMessage((res) => {
			if(chatList.length === 0) {
				return;
			}
			let lastItem = chatList[chatList.length - 1];
			let data = res.data;
			wssIsConnect = true;
			if (new Date().getTime() - qsTimer > 1.5e3) {
				scrollBottom();
				qsTimer = new Date().getTime();
			}
			emit('updateIsConnect', true);
			if (data != '[DONE]') {
				if (lastItem.content == '正在思考中...') {
					lastItem.content = data
				} else {
					lastItem.content += data
				}
			} else {
				let content = lastItem.content,
					contentArr = content.split('```');
				if (contentArr.length > 2) {
					lastItem.isList = true;
					let contentList = [];
					contentArr.map(it => {
						let obj = {};
						obj.isCode = /^(javascript|java|go|python|php|c|net|xml)/.test(it);
						obj.content = it;
						if (obj.isCode) {
							obj.content = marked('```' + obj.content + '```');
						}
						contentList.push(obj)
					})
					lastItem.contentList = contentList
				}

				lastItem.isEnd = true;
				emit('updateIsConnect', false);
				nextTick(scrollBottom)
			}
		});
	}
	onLoad(() => {
		getHotQS();
		queryAiModel().then(res => {
			modeArr.length = 0;
			res.data.map(it => {
				it.modelContent = it.modelContent.replace('你', '我');
			})
			modeArr.push(...res.data)
		});
	})
	onShow(() => {
		if (!socketTask) {
			createSocket();
		}
		initHighLight();
	})

	onUnload(() => {
		const token = uni.getStorageSync('token');
		if(socketTask) {
			uni.closeSocket({
				url: BASE_WS + '/api/websocket/' + token,
				success: (res) => {
					console.log('closeSocket success')
				}
			})
		}		
	})

	defineExpose({
		sendBtn
	})
</script>

<style lang="scss" scoped>
	.page {
		padding-top: 30rpx;
		background: transparent;
	}

	.markdown-box {
		padding: 10rpx;
		background-color: #F4F5F6;
	}

	.icon-refresh {
		height: 32rpx;
		width: 32rpx;
		margin-left: 8rpx;
	}

	.loading-box {
		height: 160rpx;
		padding-top: 50rpx;

		.loading-img {
			width: 60rpx;
			height: 60rpx;
			display: block;
			margin: 0 auto;
			animation: circle 1s linear infinite;
		}
	}

	.chat-box {
		display: flex;

		&+.chat-box {
			margin-top: 20rpx;
		}

		@keyframes shine {
			0% {
				opacity: 1;
			}

			50% {
				opacity: .1;
			}

			0% {
				opacity: 1;
			}
		}

		.move-cursor {
			&::after {
				content: "|";
				animation: shine cubic-bezier(0.215, 0.610, 0.355, 1) 1s infinite;
			}
		}
		
		.content-info {
			max-width: 80%;
			
			.copy-txt {
				text-align: right;
			}
		}

		.avatar-img,
		.error-img {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			margin-right: 12rpx;
			background-color: #FFFFFF;
		}

		.error-img {
			color: $theme-color;
			text-align: center;
			padding-top: 5rpx;
			margin-left: 12rpx;
		}

		.ques-tips {
			color: $theme-color;
			font-size: 26rpx;
			margin-top: 8rpx;
		}

		.temp-content {
			padding: 20rpx;
			max-width: 100%;
			min-width: 480rpx;
			border-radius: 12rpx;
			line-height: 1.45;
			margin-top: 8rpx;
		}

		&.user-msg {
			flex-direction: row-reverse;
			justify-content: flex-start;
			padding-left: 104rpx;

			.title {
				text-align: right;
				width: 480rpx;
			}

			.avatar-img {
				margin-left: 12rpx;
				margin-right: 0;
			}
		}
	}

	.say-content-box {
		margin-right: 0;
		max-width: 100%;
		display: flex;
		justify-content: flex-end;

		.say-content {
			padding: 20rpx;
			border-radius: 12rpx;
			background-color: $white;
			line-height: 1.45;
			margin-top: 8rpx;
		}
	}

	.say-content.item-content {
		min-width: 480rpx;
	}

	.mask-box {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 12;
		background-color: rgba(0, 0, 0, .15);

		.mask-content {
			background-color: #FFFFFF;
			position: absolute;
			border-radius: 20rpx 20rpx 0 0;
			left: 0;
			bottom: 0;
			width: 100vw;
			padding: 30rpx 0;
		}

		.mask-title {
			text-align: center;
			position: relative;
			padding: 0 30rpx;

			.icon-close {
				position: absolute;
				width: 32rpx;
				height: 32rpx;
				top: 4rpx;
				right: 32rpx;
			}
		}

		.mode-list {
			height: 500rpx;
			overflow-y: scroll;
			padding: 0 30rpx;

			.mode-item {
				display: flex;

				&+.mode-item {
					margin-top: 16rpx;
				}

				.icon-avatar {
					width: 120rpx;
					height: 120rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
				}

				.mode-info {
					flex: 1;
					height: 120rpx;
				}

				.mode-radio {
					margin-top: 24rpx;
					background-color: $blue;
					height: 60rpx;
					width: 120rpx;
					color: #FFF;
					border-radius: 12rpx;
				}
			}
		}
	}
</style>