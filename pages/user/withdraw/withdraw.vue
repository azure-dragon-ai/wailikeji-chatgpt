<template>
	<view class="page page-top pad">
		<view class="bg-white radius-10 pad-20 ">
			<view class="flex-row space-between pad-20  border-line">
				<view class="left">
					提现方式：
				</view>
				<picker :range="paywayArr"  @change="payChange">
					<view :class="{'input-placeholder':!pay_way_str}">{{pay_way_str||"请选择提现方式"}}</view>
				</picker>
			</view>
			<view class="flex-row space-between  pad-20 border-line">
				<view class="left">
					提现金额
				</view>
				<input type="digit" class="money-input"  placeholder="请输入提现金额" v-model="money">
			</view>
			<view class="flex-row space-between  pad-20">
				<view class="left">
					二维码图片
				</view>
				<view class="upload-box flex-center" :class="{add:!codeUrl}" @click="chooseCodeUrl">
					<view class="code-img-box" v-if="codeUrl">
						<image :src="codeUrl" class="code-img"></image>
					</view>
					<view class="add-box" v-else>
						<image src="@/static/img/add.png" class="icon-add" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view class="mt-20 c-6">
			提现手续费{{fee}}%
		</view>
		<view class="add-btn flex-row flex-center font-30 radius-12 btn primary mt-40" @click="submitBtn">
			提现
		</view>
	</view>
</template>

<script>
	import {toast} from '@/utils/tools.js'
	import {chargeScale , flowPath} from '@/http/index.js'
  import {BASE_URL} from "../../../utils/env";
	export default {
		data() {
			return {
				paywayArr:['支付宝','微信'],
				pay_way_str:'',
				pay_way:'',
				money:'',
				codeUrl:'',
				fee:0,
			}
		},
		methods: {
			payChange(e){
				console.log('detail',e.detail.value);
				let value = e.detail.value;
				this.pay_way = value;
				this.pay_way_str = this.paywayArr[Number(value)];
			},
			chooseCodeUrl(){
				uni.chooseImage({
					count:1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success:(res)=>{
						uni.showLoading({
							title:'上传中...'
						})
						this.uploadImage(res.tempFilePaths)
					}
				})
			},
			uploadImage(tempFilePaths) {
				uni.uploadFile({
					url: BASE_URL + '/api/upload/merChantupload', //接口地址
					header: {
						"token": uni.getStorageSync('token'),
					},
					filePath: tempFilePaths[0],
					name: 'file',
					success: (resp) => {
						let res = JSON.parse(resp.data);
						uni.hideLoading();
						if(res.msg === 'success'){
							this.codeUrl = res.data.src
						}
					}
				})
			},
			submitBtn(){
				if(!/\d/.test(this.pay_way)){
					return toast('请选择提现方式')
				}else if(!this.money){
					return toast("请输入提现金额")
				}else if(!this.codeUrl){
					return toast("请上传二维码图片")
				}else{
					let param = {
						makeCollectionsUrl:this.codeUrl,
						type:Number(this.pay_way)+1,
						withdrawalMoney:this.money
					}
					flowPath(param).then(res=>{
						toast("提现申请成功，3个工作日内将会处理");
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},1200)
					})
				}
				
			},
			getChangeFee(){
				chargeScale().then(res=>{
					this.fee = res.data;
				})
			}
		},
		onLoad() {
			this.getChangeFee()
		}
	}
</script>

<style lang="scss" scoped>
.border-line{
	border-bottom: 1px solid #ECECEC;
}
.money-input{
	text-align: right;
}
.upload-box{
	width:150rpx;
	heigth:150rpx;
	background-color:#EFEEEF;

	.add-box{
		width:150rpx;
		heigth:150rpx;
		.icon-add{
			width:80rpx;
			height: 80rpx;
			margin:30rpx;
		}
	}
}
.code-img-box{
	width:150rpx;
	heigth:150rpx;
	overflow: hidden;
	
	.code-img{
		width:150rpx!important;
		heigth:150rpx!important;
	}
}
.add-btn{
	margin-left: 80rpx;
	margin-right:80rpx;
	height:80rpx;
}
</style>
