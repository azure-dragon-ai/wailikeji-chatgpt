<template>
	<view class="page pad page-top">
		<view class="item flex space-between px-24 py-30 radius-12 flex-align bg-white" v-for="item in dataArray" :key="item">
			<view class="left">
				<view class="font-28 text-line1" v-if="item.type == 0">
					问答
				</view>
				<view class="font-28 text-line1" v-if="item.type == 1">
					图片
				</view>
				<view class="font-28 text-line1" v-if="item.type == 2">
					平台赠送
				</view>
				<view class="font-28 text-line1" v-if="item.type == 3">
					充值
				</view>
				<view class="font-28 text-line1" v-if="item.type == 4">
					邀请奖励
				</view>
				<view class="font-28 text-line1" v-if="item.type == 5">
					签到
				</view>
				<view class="font-28 text-line1" v-if="item.type == 6">
					VIP每日赠送
				</view>
				<view class="c-9 font-24 mt-4">
					{{item.createTime}}
				</view>
			</view>
			<view class="font-32 font-bold">
				{{item.species}}
			</view>
		</view>
	</view>
</template>

<script setup>
	import { onMounted, reactive } from "vue";
	import { onReady,onShow } from "@dcloudio/uni-app";
	import { querySpeciesList } from '@/http/index.js'
	import {setNavigation} from '@/utils/tools.js'
	onReady(()=>{
		setNavigation()
	})
	let dataArray = reactive([]);
	onShow(()=>{
		querySpeciesList().then(res=>{
			// dataArray = res.data;
			dataArray.length = 0;
			dataArray.push(...res.data)
			console.log(dataArray)
			
		})
	})
</script>

<style lang="scss" scoped>
.item{
	margin-bottom: 20rpx;
	border-radius: 12rpx;
}
</style>
