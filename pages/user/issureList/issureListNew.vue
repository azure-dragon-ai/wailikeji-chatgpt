<template>
	<view class="pad page page-top">

		<view class="issure-item bg-white radius-20 px-20 py-20 bg-white" v-for="item in dataArray" :key="item">
			<view class="issure-title">
				问：{{item.question}}
			</view>
			<view class="content-box">
				<view class="content-info" :class="{lock:!item.flag && item.answer.length>150}">
					<template v-if="item.isList">
						<view v-for="(its,index) in item.contentList" :class="{'markdown-box':its.isCode}" :key="index">
							<mp-html v-if="its.isCode" :content="its.content"></mp-html>
							<text v-else class="c-6 font-24">{{its.content}}</text>
						</view>
					</template>
					<text v-else class="c-6 font-24">
						{{item.answer}}
					</text>
				</view>
				<view class="mask-box">
					<view class="mask-shadow" v-show="!item.flag"></view>
					<view class="mask-title" @click="toggleFlag(item)">
						{{item.flag?'收起全文':'展开阅读全文'}}
					</view>
				</view>
				<view class="tips-box">
					AI智能回答时间：{{item.createTime}}
				</view>
				<view class="sumbit-box mt-20 flex-end flex-row">
					<view class="btn copy-btn primary" @click="copyContentBtn(item.answer)">
						一键复制
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		reactive
	} from "vue";

	import {
		onShow,
		onReady
	} from "@dcloudio/uni-app";
	import {
		queryQuestionAnswerList
	} from '@/http/index.js'
	import {
		setNavigation,
		copyContent
	} from '@/utils/tools.js'
	import {
		marked
	} from "marked";

	import hljs from "highlight.js";
	import "highlight.js/scss/atom-one-dark.scss";
	import mpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html";

	let dataArray = reactive([])

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

	function copyContentBtn(content) {
		copyContent(content)
	}

	function toggleFlag(item) {
		item.flag = !item.flag
	}
	onShow(() => {
		initHighLight();
	})
	onReady(() => {
		setNavigation();
		queryQuestionAnswerList().then(res => {
			res.data.map(item => {
				item.flag = false;
				let content = item.answer,
					contentArr = content.split('```');
				if (contentArr.length > 2) {
					item.isList = true;
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
					item.contentList = contentList
				}
				return item;
			})
			dataArray.push(...res.data)
		});
	})
</script>

<style lang="scss" scoped>
	.page-top {
		padding-top: 30rpx;
	}

	.bg-white {
		background-color: #FFFFFF;
	}

	.issure-item {
		margin-bottom: 20rpx;
	}

	.issure-title {
		border-bottom: 1px solid #F5F5F5;
		line-height: 60rpx;
		color: #333333;
		font-size: 30rpx;
	}

	.tips-box {
		color: $theme-color;
		background-color: rgba($theme-color, .1);
		font-size: 26rpx;
		padding: 10rpx 8rpx;
		border-radius: 12rpx;
	}

	.mask-box {
		position: relative;

		.mask-shadow {
			position: absolute;
			left: 0;
			bottom: 50rpx;
			height: 120rpx;
			width: 650rpx;
			background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 80%);
		}
	}

	.sumbit-box {
		.btn {
			width: 300rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 20rpx;
			text-align: center;
		}

		.share-btn {
			background-color: $yellow;
			color: #FFFFFF;
		}
	}

	.content-box {
		padding-top: 20rpx;
		padding-bottom: 20rpx;

		.content-info {
			&.lock {
				height: 200rpx;
				overflow: hidden;
			}
		}

	}

	.mask-title {
		text-align: center;
		color: $theme-color;
		height: 60rpx;
		line-height: 60rpx;
	}

	.markdown-box {
		padding: 10rpx;
		background-color: #F4F5F6;
	}
</style>