<template>
	<view class="page pad page-top">
		<view class="" v-if="dataArray.length">
			<view class="item flex space-between px-24 py-30 radius-12 flex-align bg-white" v-for="item in dataArray" :key="item">
				<view class="left">
					<view class="font-28 text-line1" >
						{{item.commodityName}}
					</view>
					<view class="c-9 font-24 mt-4">
						{{item.foundTime}}
					</view>
				</view>
				<view class="font-32 font-bold">
					{{item.rechargeAmount}}元
				</view>
			</view>
		</view>
		<empty v-else emptyText="暂无数据"></empty>
	
	</view>
</template>

<script setup>
	import { onMounted, reactive } from "vue";
	import { onReady,onShow } from "@dcloudio/uni-app";
	import { queryOrderList } from '@/http/index.js'
	import {setNavigation} from '@/utils/tools.js'
	onReady(()=>{
		setNavigation()
	})
	const dataArray = reactive([]);
	onShow(()=>{
		queryOrderList().then(res=>{
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
