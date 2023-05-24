<template>
	<view class="pad page page-top">
		<view class="chat-box ">
			<image src="@/static/img/aislogo.png" class="avatar-img" mode=""></image>
			<view class="content-info">
				<view class="title font-24 c-6">
					小助手
				</view>
				<view class="say-content temp-content" style="padding-bottom:20rpx;">
					<view class="">
						您可以输入想绘画的内容，AI绘画助手一键为你生成。
					</view>
				</view>
			</view>
		</view>
		<view class="chat-box" :class="{'user-msg':item.self=== 1}" v-for="(item,index) in chatList" :key="item.id">
			<image v-if="item.avatarImg && item.avatarImg !== '123456'" :src="item.avatarImg" class="avatar-img" ></image>
			<view v-else class="error-img">
				<u-icon name="account" size='70'></u-icon>
			</view>
			<view class="content-info">
				<view class="title font-24 c-6">
					{{item.modelRole}}
				</view>
				<view class="say-content-box">
					<view class="say-content" :class="{'item-content':item.self === 0}"
						style="background-color: #FFF;padding:20rpx;border-radius: 10rpx;">
						<text v-if="item.type==1">{{item.content}}</text>
						<view class="img-content-box" v-else>
							<image :src="item.content" @load="imageLoading" class="content-image" mode="widthFix">
							</image>
							<view class="loading-box" v-if="item.loading">
								<image src="@/static/img/loading.png" class="loading-img" mode=""></image>
							</view> 
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		nextTick,
		toRefs
	} from 'vue'
	import {
		onShow,
		onUnload
	} from '@dcloudio/uni-app'
	import {
		cleanHistory,
		drawImage
	} from '@/http/index.js'
	import {
		toast,
		copyContent
	} from '@/utils/tools.js'
	import avatarDef from '@/static/img/avatar_deft.png'
	import {
		BASE_WS
	} from "../../utils/env";
	const modeArr = reactive([]);
	let scrollTop = ref(0),
		qsTimer = new Date().getTime();
	const props = defineProps({
		content: String,
		user: Object,
		aiUser: Object,
	})
	const emit = defineEmits(['clear'])

	let {
		content,
		user,
		aiUser
	} = toRefs(props);

	const downLoadBtn = (linkUrl) => {
		uni.showLoading({
			title: '加载中'
		});
		uni.downloadFile({
			url: linkUrl,
			success: (res) => {
				uni.hideLoading();
				if (res.statusCode === 200) {
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function() {
							uni.showToast({
								title: "保存成功",
								icon: "none"
							});
						},
						fail: function() {
							uni.showToast({
								title: "保存失败，请稍后重试",
								icon: "none"
							});
						}
					});
				}
			},
			fail: (err) => {
				console.log('下载失败')
			}
		})
	}
	const copyContentBtn = (item) => {
		copyContent(item);
	}
	const imageLoading = (data) => {
		console.log('image load end')
		let lastItem = chatList[chatList.length - 1];
		lastItem.loading = false;

	}
	const sendBtn = () => {
		let data = {
			msg: content.value,
		}
		chatList.push({
			modelRole: user.value.nickName,
			avatarImg: user.value.avatar,
			self: 1,
			type: 1,
			id: +new Date(),
			content: content.value,
		})
		emit('clear');
		console.log(aiUser.avatar)
		chatList.push({
			modelRole: aiUser.value.nickName,
			avatarImg: aiUser.value.avatar,
			self: 0,
			type: 1,
			id: +new Date(),
			content: '正在思考中...',
			loading: true,
		})
		drawImage(data).then(res => {
			let lastItem = chatList[chatList.length - 1];
			if (res.data.errorMsg) {
				lastItem.type = 1;
				lastItem.content = res.data.errorMsg;
				return;
			}
			console.log('draw image', res)
			console.log('draw image', res.data.url)
			let data = res.data;
			if (/提问次数已用完/.test(data)) {
				return toast("聊天次数已经用完")
			}
			if (new Date().getTime() - qsTimer > 1.5e3) {
				scrollBottom();
				qsTimer = new Date().getTime();
			}

			lastItem.type = 2;
			lastItem.content = res.data.url;

			nextTick(() => {
				scrollBottom();
			})
		})
	}

	function scrollBottom() {
		const query = uni.createSelectorQuery()
		query
			.select('.page-top')
			.boundingClientRect((data) => {
				let pageScrollTop = Math.round(data.bottom)
				uni.pageScrollTo({
					scrollTop: pageScrollTop, //滚动的距离
					duration: 0, //过渡时间
				})
			}).exec()
	}

	const chatList = reactive([]),
		modelId = ref('')

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
	defineExpose({
		sendBtn
	})
</script>

<style lang="scss" scoped>
	.page {
		background: transparent;
		padding-top: 30rpx;
	}

	.icon-refresh {
		height: 32rpx;
		width: 32rpx;
		margin-left: 8rpx;
	}

	.content-image {
		width: 450rpx;
		min-height: 450rpx;
	}

	.loading-box {
		height: 160rpx;
		padding-top: 50rpx;
		position: absolute;
		left: 0;
		top: 0;
		width: 450rpx;

		.loading-img {
			width: 60rpx;
			height: 60rpx;
			display: block;
			margin: 0 auto;
			animation: circle 1s linear infinite;
		}
	}

	.img-content-box {
		position: relative;
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
		
		.content-info {
			max-width: 80%;
		}

		.temp-content {
			padding: 20rpx;
			max-width: 100%;
			min-width: 480rpx;
			border-radius: 12rpx;
			background-color: #FFF;
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


			.say-content-box {
				margin-right: 0;
				width: 480rpx;
				display: flex;
				justify-content: flex-end;

				.say-content {

					padding: 20rpx;
					max-width: 480rpx;
					border-radius: 12rpx;
					background-color: #FFF;
					line-height: 1.45;
					margin-top: 8rpx;
				}

			}
		}

	}

	.say-content.item-content {
		width: 480rpx;
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

				// align-items: center;
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