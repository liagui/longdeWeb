import Vue from 'vue';
import Router from 'vue-router';

import menuList from './menuList'
import service from './service'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

let formatRouterList = [];
function formatRouter(list) {
	for (let item of list) {
		if (item.children && !item.haveChildRouter) {
			formatRouter(item.children);
			item.children = null;
			let obj = Object.assign({}, item);
			obj.children = null;
			formatRouterList.push(item);
		} else {
			formatRouterList.push(item);
		}
	}
}
formatRouter(menuList)

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
		children: [
			...formatRouterList,//导航上的路由
			...service,
		]
	},

	{
		path: '/all',
		component: resolve => require(['../components/common/Home.vue'], resolve),
		meta: {
			title: '自述文件'
		},
		children: [
			...formatRouterList,//导航上的路由


		]
	},

	{
		path: '/login',
		name: 'login',
		component: resolve => require(['../components/page/Login.vue'], resolve),
		meta: {

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