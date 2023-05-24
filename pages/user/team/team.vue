<template>
	<view class="page pad page-top">
		<view class="page-nav bg-white radius-12 pad-30 flex-row flex-align">
			<view class="left item">
				<view class="font-28 c-6">
					总收益
				</view>
				<view class="mt-8 c-y font-36">
					{{totalRevenue}}元
				</view>
			</view>
			<view class="item-line"></view>
			<view class="right item">
				<view class="font-28 c-6">
					邀请人数
				</view>
				<view class="mt-8 c-y font-36">
					<!-- {{userCount}}人 -->
					<text class="mt-8 text-line font-36" @click="sonList">{{userCount}}人</text> 
				</view>
			</view>
			<view class="item-line"></view>
			<view class="right item">
				<view class="font-28 c-6">
					待提现
				</view>
				<view class="mt-8 c-y font-36">
					<text class="mt-8 text-line font-36" @click="withdrawBtn">{{money}}元</text> 
				</view>
			</view>
		</view>
		<!-- <view class="mt-20 flex-row flex-end">
			<text class="c-3 text-line font-28" @click="withdrawBtn">去提现</text> 
		</view> -->
		
		<!-- 我的团队 -->
		<view class="table-list mt-48" v-if="dataArray.length">
			<view class="card-box" v-for="item in dataArray" :key="item">
				<view class="item ">
					<view class="flex-row space-between">
						<view class="font-26 text-line1">
							<text class="c-6">昵称：</text> {{item.belowUserName}}
						</view>
						<view class="font-26">
							<text class="c-6">级别：</text> {{item.belowRank}}
						</view>
					</view>
					<view class="flex-row mt-12 space-between">
						<view class="font-26">
							<text class="c-6">消费金额：</text><text class="icon-label">￥</text><text class="font-28">{{item.money}}</text>
						</view>
						<view class="font-26">
							<text class="c-6">返佣：</text><text class="icon-label">￥</text><text class="font-28 text-money">{{item.acquireMoney}}</text>
						</view>
					</view>
					<view class="flex-row mt-12 space-between">
						<view class="font-26">
							<text class="c-6">比例：</text>{{item.scale}}%
						</view>
						<view class="font-26 c-6">
							{{item.time}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<empty v-else emptyText="暂无返利记录!"></empty>
		
	</view>
</template>

<script>
	import { onMounted, reactive } from "vue";
	import { onReady,onShow } from "@dcloudio/uni-app";
	import { inviteRebateList } from '@/http/index.js'
	import {setNavigation} from '@/utils/tools.js'
	export default {
		data() {
			return {
				dataArray: [],
				userCount: '0',
				totalRevenue: '0.00',
				money: '0.00'
				
			}
		},
		methods: {
			withdrawBtn(){
				uni.navigateTo({
					url:'/pages/user/withdraw/withdraw'
				})
			},
			sonList(){
				uni.setStorageSync('sonPageType', 1)
				uni.navigateTo({
					url:'/pages/user/team/sonListNew'
				})
			}
		},
		onReady() {
			setNavigation();
		 inviteRebateList().then(res=>{
			// dataArray = res.data;
			this.dataArray.length = 0;
			this.dataArray.push(...res.data.inviteRebateList)
			this.totalRevenue = res.data.TotalRevenue;
			this.money = res.data.money;
			this.userCount = res.data.userCount;
			// console.log(this.dataArray)
			
		 })
		}
		
	}
</script>

<style lang="scss" scoped>
.page-nav{
	.item{
		flex:1;
		text-align: center;
	}
	.item-line{
		height:60rpx;
		width:2rpx;
		background-color: #efefef;
	}
}
.text-line{
	border-bottom:1rpx solid #999;
	padding-bottom:6rpx;
}
.table-list{
	.card-box{
		background-color: #FFF;
		border-radius:12rpx;
		padding:20rpx 24rpx; 
		&+.card-box{
			margin-top: 20rpx;
		}
	}
	.icon-label{
		font-size:24rpx;
	}
	.text-money{
		color: #101213;
	}
}

</style>
