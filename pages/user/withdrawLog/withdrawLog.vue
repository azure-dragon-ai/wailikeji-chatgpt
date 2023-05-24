<template>
	<view class="page pad page-top">
		<view class="list" v-if="dataList.length">
			<view class="item pad-30 radius-12" v-for="item in dataList" :key="item.id">
				<view class="flex-row space-between">
					<view class="left">
						<text class="label">提现金额：</text> <text class="icon-money">￥</text>{{item.withdrawalMoney}}
					</view>
					<view class="">
						<text class="label">到账金额：</text> <text class="icon-money">￥</text>{{item.realityMoney}}
					</view>
				</view>
				<view class="flex-row space-between mt-20">
					<view class="left">
						<text class="label">手续费：</text> {{item.serviceCharge}}元
					</view>
					<view class="">
						<view class="" v-if="item.type === 1">
							支付宝
						</view>
						<view class="" v-if="item.type === 2">
							微信
						</view>
					</view>
				</view>
				<view class="flex-row space-between mt-20">
					<view class="left c-6">
						{{item.time}}
					</view>
					<view class="" v-if="item.status === 0">
						审核中
					</view>
					<view class="" v-if="item.status === 1">
						审核成功
					</view>
					<view class="" v-if="item.status === 2">
						审核失败
					</view>
				</view>
				<view class="flex-row space-between mt-20">
					<view class="left">
						<text class="label">备注：</text> {{item.content}}
					</view>
				</view>
			</view>
		</view>
		<empty v-else emptyContent="暂无提现记录"></empty>
		
	</view>
</template>

<script>
	import { onMounted, ref, reactive } from "vue";
	import { onReady,onShow } from "@dcloudio/uni-app";
	import { withdrawalList } from '@/http/index.js'
	import {setNavigation} from '@/utils/tools.js'
	export default {
		data:()=>{
			return {
				dataList:[],
			}
		},
		onReady() {
			setNavigation()
		},
		onShow() {
			withdrawalList().then(res=>{
				console.log('withdraw list',res);
				/**
				     * 收款类型(1:支付宝  2:微信)
				     */
				 // private Integer type;
				    /**
				     * 审核状态(0:审核中  1:审核通过  2:审核拒绝)
				     */
				 // private Integer status;
				this.dataList.length = 0;
				this.dataList = res.data;
			})
		}
	}
	
</script>

<style lang="scss" scoped>
.list{
	.item{
		background-color: #FFFFFF;
		&+.item{
			margin-top:20rpx;
		}
		.label{
			color:#666666;
		}
	}
}
	
</style>