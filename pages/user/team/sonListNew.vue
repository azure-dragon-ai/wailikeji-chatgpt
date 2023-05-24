<template>
	<view class="page page-top">
		<view class="page-nav mr-20 ml-20 bg-white radius-12 pad-30 flex-row flex-align">
			<view class="left item">
				<view class="font-28 c-6">
					{{navigationTitle}}
				</view>
				<view class="mt-8 c-y font-36">
					{{userCount}}人
				</view>
			</view>
			<view class="item-line"></view>
			<view class="right item">
				<view class="font-28 c-6">
					间邀好友
				</view>
				<view class="mt-8 c-y font-36">
					{{twoUserCount}}人
				</view>
			</view>
			<view class="item-line"></view>
			<view class="right item">
				<view class="font-28 c-6">
					1级比例
				</view>
				<view class="mt-8 c-y font-36">
					{{leveloneProportion}}%
				</view>
			</view>
			<view class="item-line"></view>
			<view class="right item">
				<view class="font-28 c-6">
					2级比例
				</view>
				<view class="mt-8 c-y font-36">
					{{secondaryProportion}}%
				</view>
			</view>
		</view>

		<u-tabs class="mt-24" active-color="#63acb6" inactive-color="#333333" :list="tabList" :is-scroll="false"
			v-model="currentTab" bar-width="40" @change="changeTab"></u-tabs>

		<!-- 我的团队 -->
		<view class="table-list mt-12 ml-20 mr-20" v-if="dataArray.length">
			<view class="card-box" v-for="item in dataArray" :key="item">
				<view class="flex-row">
					<view class="inline-block">
						<image :src="item.avatar" class="icon-avatar" mode=""></image>
					</view>
					<view class="flex-row space-between inline-block ml-16">
						<view class="font-32 text-line1" style="font-weight: bold; color: #63acb6;">
							{{item.nickName}}
						</view>
						<view class="font-26">
							<text class="c-6">ID：</text> {{item.id}}
						</view>
						<view class="font-26 c-6">
							<text class="c-6">注册时间：</text>{{item.createTime}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<empty v-else emptyText="暂无邀请记录!"></empty>
	</view>
</template>

<script setup>
	import {
		onMounted,
		reactive,
		ref
	} from "vue";
	import {
		onReady,
		onShow,
		onLoad
	} from "@dcloudio/uni-app";
	import {
		sonList
	} from '@/http/index.js'
	import {
		setNavigation
	} from '@/utils/tools.js'
	let dataArray = reactive([]);
	let userCount = ref('0');
	let twoUserCount = ref('0');
	let leveloneProportion = ref('0');
	let secondaryProportion = ref('0');
	let navigationTitle = ref('直邀好友');
	let type = ref(1);
	let currentTab = ref(0);
	const tabList = reactive([{
			name: '直邀',
			index: 1
		},
		{
			name: '间邀',
			index: 2
		},
	]);

	const withdrawBtn = () => {
		uni.navigateTo({
			url: '/pages/user/withdraw/withdraw'
		})
	}

	const changeTab = (index) => {
		type.value = tabList[index].index
		querySonList()
	}

	const querySonList = () => {
		sonList({
			'relationType': type.value
		}).then(res => {
			dataArray.length = 0;
			dataArray.push(...res.data.userList)
			twoUserCount = res.data.twoUserCount;
			leveloneProportion = res.data.leveloneProportion;
			secondaryProportion = res.data.secondaryProportion;
			userCount = res.data.userCount;
		})
	}

	onShow(() => {
		type.value = uni.getStorageSync('sonPageType');
		currentTab.value = type.value - 1;
		uni.setNavigationBarTitle({
			title: type.value === 1 ? '直邀好友' : '间邀好友'
		})
	})

	onReady(() => {
		setNavigation();
		querySonList();
	})
</script>

<style lang="scss" scoped>
	.page-nav {
		.item {
			flex: 1;
			text-align: center;
		}

		.item-line {
			height: 60rpx;
			width: 2rpx;
			background-color: #efefef;
		}
	}

	.text-line {
		border-bottom: 1rpx solid #999;
		padding-bottom: 6rpx;
	}

	.table-list {
		.card-box {
			background-color: #FFF;
			border-radius: 12rpx;
			padding: 20rpx 32rpx;

			&+.card-box {
				margin-top: 20rpx;
			}

			.icon-avatar {
				width: 120rpx;
				height: 120rpx;
				border-radius: 200rpx;
				margin-right: 20rpx;
			}
		}

		.icon-label {
			font-size: 24rpx;
		}

		.text-money {
			color: #101213;
		}
	}
</style>