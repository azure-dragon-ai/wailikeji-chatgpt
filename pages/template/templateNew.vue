<template>
	<view class="pad">
		<!-- <u-swiper id="swiper" class="mb-10" :list="list"></u-swiper> -->
		<scroll-view scroll-x="true">
			<view class="cate-box-nav">
				<view class="cate-item" :class="{active:item.id === cateItem.id  }" @click="categoryBtn(item)"
					v-for="item in cateArray">
					{{item.categoryName}}
				</view>
			</view>
		</scroll-view>

		<view class="loading-box flex-row flex-center" v-if="isLoading">
			<image src="@/static/img/loading.png" class="loading-img" mode=""></image>
		</view>

		<view class="mt-16 moban-box flex-row flex-wrap space-between" v-else-if="dataArray.length">
			<view class="item bg-gray pad-18 mt-20 radius-10" v-for="(item, index) in dataArray"
				:class="`card-bg-${index % 5 + 1}`" :key="item">
				<view class="font-28 c-3" @click="issureTmpBtn(item)">
					{{item.qsTitle}}
				</view>
				<view class="mt-12 font-26 text-line2 c-6" @click="issureTmpBtn(item)">
					{{item.qsHint}}
				</view>
			</view>
		</view>
		<empty emptyText="暂无模版，敬请期待。" v-else></empty>
		<askPopup ref="askPopupRef" @confirmAnswer="confirmAnswer"></askPopup>
	</view>
</template>

<script setup>
	import {
		onMounted,
		reactive,
		ref,
		defineComponent
	} from "vue";
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app"
	import {
		queryHotQs,
		queryAllQs,
		queryTmplCate,
		queryQsByCateId
	} from '@/http/index.js'
	onMounted(() => {
		console.log('template mounted')
	})
	onLoad(() => {
		queryTmplCate().then(res => {
			console.log('ressss', res);
			cateArray.push(...res.data);
			cateItem.id = res.data[0].id;
			queryQS()
		})
	})
	const isLoading = ref(false);
	const queryQS = () => {
		dataArray.length = 0;
		isLoading.value = true;
		queryQsByCateId({
			tid: cateItem.id
		}).then(res => {
			dataArray.push(...res.data);
			isLoading.value = false;
		})
	}
	const categoryBtn = (item) => {
		cateItem.id = item.id;
		queryQS()
	}
	const dataArray = reactive([]),
		cateArray = reactive([]),
		cateItem = reactive({
			id: ''
		});
	let issureItem = {};
	const issureTmpBtn = (item) => {
		askPopupRef.value.ques.qsTitle = item.qsTitle;
		askPopupRef.value.ques.qsHint = item.qsHint;
		askPopupRef.value.ques.qsCall = item.qsCall;
		askPopupRef.value.openPopup();
		issureItem = item;
	}
	const askPopupRef = ref(null);
	const confirmAnswer = (data) => {
		if (!data) {
			askPopupRef.value.openPopup()
			return toast('问题不能为空')
		}
		let contentValue = issureItem.qsCall + data;
		uni.setStorageSync('tmpContent', contentValue);
		uni.switchTab({
			url: '/pages/index/index'
		})
	}
</script>

<style lang="scss">
	#swiper {}

	.moban-box {
		margin-bottom: var(--tab-bar-height);

		.item {
			width: 332rpx;
		}
	}

	.title-box {
		padding-top: 24rpx;
	}

	.icon-title {
		width: 30rpx;
		height: 30rpx;
		margin-right: 8rpx;
	}

	.cate-box-nav {
		display: flex;
		padding: 12rpx 0;

		.cate-item {
			margin: 0 10rpx;
			font-size: 30rpx;

			&:first-child {
				margin-left: 0rpx;
			}

			&:last-child {
				margin-right: 0rpx;
			}

			&.active {
				font-weight: bold;
				position: relative;

				&::after {
					content: "";
					background-color: $theme-color;
					width: 80%;
					height: 4rpx;
					position: absolute;
					bottom: -10rpx;
					left: 50%;
					transform: translateX(-50%);
				}
			}

		}
	}

	@keyframes circle {
		0% {
			transform: rotate(0);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.loading-box {
		height: 750rpx;

		.loading-img {
			width: 60rpx;
			height: 60rpx;
			animation: circle 1.5s infinite linear;
		}
	}
</style>