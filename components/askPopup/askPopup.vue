<template>
	<view class="mask-box" v-if="maskVisible">
		<view class="mask-content">
			<view class="mask-title">
				{{ques.qsTitle}}
			</view>
			<textarea :placeholder="ques.qsHint" v-model="content" class="input-textarea"></textarea>
			<view class="mask-footer flex-row mt-20 flex-center">
				<view class="cancel-btn btn" @click="maskVisible = false">
					取消
				</view>
				<view class="confirm-btn ml-30 btn primary" @click="confirmBtn">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {ref, reactive, onMounted  } from 'vue'
	const maskVisible = ref(false);
	const emits = defineEmits(), content = ref('');
	const ques = reactive({
		qsTitle:'',
		qsHint:''
	})
	const openPopup = ()=>{
		maskVisible.value = true;
		content.value = '';
	}
	const confirmBtn = (fn)=>{
		maskVisible.value = false;
		emits('confirmAnswer',content.value)
	}
	defineExpose ({
		maskVisible,
		openPopup,
		content,
		ques,
	})
</script>

<style lang="scss">
	.mask-box{
		width:100vw;
		height:100vh;
		background-color: rgba(0,0,0,.2);
		position: fixed;
		top:0;
		right:0;
		.mask-content{
			width:560rpx;
			padding:30rpx;
			position: absolute;
			top:50%;
			left:50%;
			transform: translate(-50%,-50%);
			background-color: #FFF;
			border-radius: 20rpx;
		}
		.input-textarea{
			margin-top:20rpx;
			width:500rpx;
			height:350rpx;
			box-sizing: border-box;
			border:1rpx solid #EFEFEF;
			border-radius: 10rpx;
			padding:20rpx;
			line-height: 1,.25;
		}
		.mask-title{
			
		}
		.mask-footer{
			.btn{
				height:60rpx;
				line-height: 60rpx;

				&.cancel-btn{
					border:1rpx solid #efefef;
					border-radius: 12rpx;
				}
			}
		}
	}
</style>