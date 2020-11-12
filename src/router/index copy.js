import Vue from 'vue';
import Router from 'vue-router';

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);

export default new Router({
	routes: [{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/',
		component: resolve => require(['../components/common/Home.vue'], resolve),
		meta: {
			title: '自述文件'
		},
		children: [{
			path: '/courses/courses',
			component: resolve => require(['../components/page/courses/courses.vue'], resolve),
			meta: {
				name: '课程',
				keepAlive: true
			}

		},
		{
			path: '/system/accountManage',
			component: resolve => require(['../components/page/system/accountManage.vue'], resolve),
			meta: {
				name: '账户管理',
				keepAlive: true
			}
		},
		{
			path: '/education/liveStudio',
			component: resolve => require(['../components/page/education/liveStudio.vue'], resolve),
			meta: {
				name: '教学',
				keepAlive: true
			}
		},
		{
			path: '/system/roleManage',
			component: resolve => require(['../components/page/system/roleManage.vue'], resolve),
			meta: {
				name: '角色管理',
				keepAlive: true
			}
		},
		{
			path: '/system/payManage',
			component: resolve => require(['../components/page/system/payManage.vue'], resolve),
			meta: {
				name: '支付管理',
				keepAlive: true
			}
		},
		{
			path: '/courses/openCouses',
			component: resolve => require(['../components/page/courses/openCouses.vue'], resolve),
			meta: {
				name: '公开课',
				keepAlive: true
			}
		},
		{
			path: '/questionBank/questionBank',
			component: resolve => require(['../components/page/questionBank/questionBank.vue'], resolve),
			meta: {
				name: '题库',
				keepAlive: true
			}
		},
		{
			path: '/questionBank/adminQuestion',
			component: resolve => require(['../components/page/questionBank/adminQuestion.vue'], resolve),
			meta: {
				name: '试题管理',
				keepAlive: false,
			}
		},
		{
			path: '/questionBank/adminChapter',
			component: resolve => require(['../components/page/questionBank/adminChapter.vue'], resolve),
			meta: {
				name: '试卷管理',
				keepAlive: false,
			}
		},
		{
			path: '/questionBank/adminPaper',
			component: resolve => require(['../components/page/questionBank/adminPaper.vue'], resolve),
			meta: {
				name: '章节考点',
				keepAlive: false,
			}
		},
		{
			path: '/questionBank/adminSubject',
			component: resolve => require(['../components/page/questionBank/adminSubject.vue'], resolve),
			meta: {
				name: '科目管理',
				keepAlive: false,
			}
		},

		// 资源
		{
			path: '/resources/subject',
			component: resolve => require(['../components/page/resources/subject.vue'], resolve),
			meta: {
				name: '学科',
				keepAlive: true
			}
		},
		{
			path: '/resources/liveResource',
			name: '/resources/liveResource',
			component: resolve => require(['../components/page/resources/liveResource.vue'], resolve),
			meta: {
				name: '直播单元',
				keepAlive: true
			}
		},
		{
			path: '/resources/recordResource',
			component: resolve => require(['../components/page/resources/recordResource.vue'], resolve),
			meta: {
				name: '录播资源',
				keepAlive: true
			}
		},
		// 用户
		{
			path: '/users/students',
			component: resolve => require(['../components/page/users/students.vue'], resolve),
			meta: {
				name: '学员',
				keepAlive: true
			}
		},
		{
			path: '/users/lecturers',
			name: '/users/lecturers',
			component: resolve => require(['../components/page/users/lecturers.vue'], resolve),
			meta: {
				name: '讲师',
				keepAlive: true
			}
		},
		{
			path: '/users/educatAdmin',
			name: '/users/educatAdmin',
			component: resolve => require(['../components/page/users/educatAdmin.vue'], resolve),
			meta: {
				name: '教务',
				keepAlive: true
			}
		},
		// 运营
		{
			path: '/operate/articleAdmin',
			component: resolve => require(['../components/page/operate/articleAdmin.vue'], resolve),
			meta: {
				name: '文章管理',
				keepAlive: true
			}
		},
		// 财务
		{
			path: '/orders/orders',
			component: resolve => require(['../components/page/orders/orders.vue'], resolve),
			meta: {
				name: '订单',
				keepAlive: true
			}
		},
		// 数据
		{
			path: '/statistics/schoolStatistic',
			component: resolve => require(['../components/page/statistics/schoolStatistic.vue'], resolve),
			meta: {
				name: '学员统计',
				keepAlive: true
			}
		},
		{
			path: '/statistics/teacherStatistic',
			component: resolve => require(['../components/page/statistics/teacherStatistic.vue'], resolve),
			meta: {
				name: '讲师统计',
				keepAlive: true
			}
		},
		{
			path: '/statistics/classStatistic',
			component: resolve => require(['../components/page/statistics/classStatistic.vue'], resolve),
			meta: {
				name: '课时统计',
				keepAlive: true
			}
		},
		//网校管理
		{
			path: '/dataAll/schoolAdmin',
			component: resolve => require(['../components/page/dataAll/schoolAdmin.vue'], resolve),
			meta: {
				name: '网校管理',
				keepAlive: true
			}
		},

		{
			path: '/content/tagManage',
			component: resolve => require(['../components/page/content/tagManage.vue'], resolve),
			meta: {
				title: '客户管理',
				keepAlive: true
			}
		},
		{
			path: '/content/bannerManage',
			component: resolve => require(['../components/page/content/bannerManage.vue'], resolve),
			meta: {
				title: '轮播图管理',
				keepAlive: true
			}
		},
		{
			path: '/channel/channel',
			component: resolve => require(['../components/page/channel/channel.vue'], resolve),
			meta: {
				title: '渠道管理',
				keepAlive: true
			}
		},
		{
			path: '/channel/pushMess',
			component: resolve => require(['../components/page/channel/pushMess.vue'], resolve),
			meta: {
				title: '消息推送',
				keepAlive: true
			}
		},
		{
			path: '/customer/feedbackManage',
			component: resolve => require(['../components/page/customer/feedbackManage.vue'], resolve),
			meta: {
				title: '客户反馈',
				keepAlive: true
			}
		},
		{
			path: '/customer/custManage',
			component: resolve => require(['../components/page/customer/custManage.vue'], resolve),
			meta: {
				title: '客户管理',
				keepAlive: true
			}
		},
		{
			path: '/customer/customeVip',
			component: resolve => require(['../components/page/customer/customeVip.vue'], resolve),
			meta: {
				title: '客户管理',
				keepAlive: true
			}
		},
		{
			path: '/channel/channelStatistics',
			component: resolve => require(['../components/page/channel/channelStatistics.vue'], resolve),
			meta: {
				title: '渠道统计',
				keepAlive: true
			}
		},

		]
	},
	{
		path: '/login',
		name: 'login',
		component: resolve => require(['../components/page/Login.vue'], resolve),
		meta: {
			keepAlive: false
		}
	},
	{
		path: '/404',
		component: resolve => require(['../components/page/404.vue'], resolve)
	},
	{
		path: '/403',
		component: resolve => require(['../components/page/403.vue'], resolve)
	},
	{
		path: '*',
		redirect: '/404'
	}
	]
})