import request from '@/utils/request.js';

//验证码登录
export function smsLogin(data){
	return request({
			url: '/api/oauth/smsLogin',
			method: 'post',
			data
	})
}

//发送验证码
export function sendSms(data){
	return request({
			url: '/api/other/sendSms',
			method: 'post',
			data
	})
}

//查询热门问题
export function queryHotQs(data){
	return request({
			url: '/api/other/queryHotQs',
			method: 'get',
			data
	})
}
//查询模版分类
export function queryTmplCate(data){
	return request({
			url: '/api/other/queryTmplCate',
			method: 'get',
			data
	})
}
//查询分类下的模版
export function  queryQsByCateId(data){
	return request({
			url: '/api/other/queryQsByCateId',
			method: 'get',
			data
	})
}
//查询所有的模版
export function queryAllQs(data){
	return request({
			url: '/api/other/queryAllQs',
			method: 'get',
			data
	})
}
//查询所有的模型
export function queryAiModel(data){
	return request({
			url: '/api/other/queryAiModel',
			method: 'get',
			data
	})
}
//用户签到
export function SignIn(data){
	return request({
			url: '/api/SignIn',
			method: 'get',
			data
	})
}

//用户信息
export function userInfo(data){
	return request({
			url: '/api/user/userInfo',
			method: 'get',
			data
	})
}
//上传图片
export function merChantupload(data){
	return request({
			url: '/api/upload/merChantupload',
			method: 'post',
			data,
			header:{
				ContentType:'multipart/form-data'
			}
	})
}
//更新用户信息
export function userUpdate(data){
	return request({
			url: '/api/user/update',
			method: 'post',
			data,
	})
}

//商品列表
export function commodityList(data){
	return request({
			url: '/api/commodityList',
			method: 'get',
			data,
	})
}

export function isTodaySign(data){
	return request({
			url: '/api/isSign',
			method: 'get',
			data,
	})
}

export function drawImage(data){
	return request({
			url: '/api/chat/draw',
			method: 'post',
			data,
	})
}

export function payConfigList(data){
	return request({
			url: '/api/PayConfigList',
			method: 'get',
			data,
	})
}
//切换模型 清空上下文
export function cleanHistory(data){
	return request({
			url: '/api/other/cleanHistory',
			method: 'post',
			data
	})
}

//查询问答次数流水
export function querySpeciesList(data){
	return request({
			url: '/api/user/querySpeciesList',
			method: 'get',
			data
	})
}

//查询充值记录
export function queryOrderList(data){
	return request({
			url: '/api/OrderList',
			method: 'get',
			data
	})
}
//微信公众号登录
export function appWeChatLogin(data){
	return request({
			url: '/api/oauth/appWeChatLogin',
			method: 'post',
			data
	})
} 
//APP微信授权登录
export function mpWeChatLogin(data){
	return request({
			url: '/api/oauth/mpWeChatLogin',
			method: 'post',
			data
	})
} 
// 微信小程序登录
export function miniAppLogin(data){
	return request({
			url: '/api/oauth/miniAppLogin',
			method: 'post',
			data
	})
} 
//微信更新用户头像
export function wxUserInfo(data){
	return request({
			url: '/api/oauth/wxUserInfo',
			method: 'post',
			data
	})
}
//我的团队
export function inviteRebateList(data){
	return request({
			url: '/api/InviteRebateList',
			method: 'get',
			data
	})
}
//问答记录
export function queryQuestionAnswerList(data){
	return request({
			url: '/api/user/queryQuestionAnswerList',
			method: 'get',
			data
	})
}
//提现手续费
export function chargeScale(data){
	return request({
			url: '/api/WithdrawalServiceChargeScale',
			method: 'get',
			data
	})
} 
//提现记录
export function withdrawalList(data){
	return request({
			url: '/api/WithdrawalList',
			method: 'get',
			data
	})
} 
//申请提现
export function flowPath(data){
	return request({
			url: '/api/withdrawalflowpath',
			method: 'post',
			data
	})
}
//统一支付接口
export function pay(data){
	return request({
			url: '/api/pay',
			method: 'post',
			data
	})
}
// 微信公众号登录获取公众号appid
export function getWxGZHAppid(data){
	return request({
			url: '/api/oauth/getWxGZHAppid',
			method: 'get',
			data
	})
} 

// 获取分享链接
export function getInviteUrl(data){
	return request({
			url: '/api/user/getInviteUrl',
			method: 'get',
			data
	})
} 
// 获取海报
export function getPoster(data){
	return request({
			url: '/api/user/getPoster',
			method: 'get',
			data
	})
} 
// 卡密兑换
export function CamilleExchange(data){
	return request({
			url: '/api/CamilleExchange',
			method: 'post',
			data
	})
} 
// 直属下级查询
export function sonList(data){
	return request({
			url: '/api/sonListPage',
			method: 'get',
			data
	})
} 