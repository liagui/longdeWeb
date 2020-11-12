const service = [
    {
        path: '/service/schoolRecharge',
        component: resolve => require(['../components/page/service/schoolRecharge.vue'], resolve),
        name: '网校预充值',
    },
    {
        path: '/service/schoolSet',
        redirect:"/service/schoolSet/headerService",
        component: resolve => require(['../components/page/service/schoolSet/schoolSet.vue'], resolve),
        children: [
            {
                path: '/service/schoolSet/headerService',
                component: resolve => require(['../components/page/service/schoolSet/headerService.vue'], resolve),
                name: '页头设置',
            },
            {
                path: '/service/schoolSet/footerService',
                component: resolve => require(['../components/page/service/schoolSet/footerService.vue'], resolve),
                name: '页尾设置2',
            },
            {
                path: '/service/schoolSet/homeService',
                component: resolve => require(['../components/page/service/schoolSet/homeService.vue'], resolve),
                name: '首页设置2',
            },
            {
                path: '/service/schoolSet/seoservice',
                component: resolve => require(['../components/page/service/schoolSet/seoService.vue'], resolve),
                name: 'seo设置',
            },
            {
                path: '/service/schoolSet/selfService',
                component: resolve => require(['../components/page/service/schoolSet/selfService.vue'], resolve),
                name: '自定义页面'
            },
            {
                path: '/service/schoolSet/customPageEditor',
                component: resolve => require(['../components/page/service/schoolSet/selfService/customPageEditor'], resolve),
                name: '页面编辑', 
            }
        ]
    },
        {
         path: '/service/schoolSet/investMoney',
         component: resolve => require(['../components/page/service/schoolSet/investMoney.vue'], resolve),
         name: '充值中心',
    },
      {
         path: '/service/schoolSet/investMoneys',
         component: resolve => require(['../components/page/service/schoolSet/investMoneys.vue'], resolve),
         name: '明细',
    },
    {
        path: '/service/payManage',
        component: resolve => require(['../components/page/service/payManage.vue'], resolve),
        meta: {
            name: '支付管理',
        }
    },
    {
        path: '/service/liveConcurrent',
        redirect:"/service/liveConcurrent/videoDetail",
        component: resolve => require(['../components/page/service/liveConcurrent.vue'], resolve),
        meta: {
            name: '直播并发',
        },
       
        children: [
             {
                path: '/service/liveConcurrent/videoDetail',
                component: resolve => require(['../components/page/service/liveConcurrent/videoDetail.vue'], resolve),
                name: '直播详情',
            },
            {
                path: '/service/liveConcurrent/takeShop',
                component: resolve => require(['../components/page/service/liveConcurrent/takeShop.vue'], resolve),
                name: '页尾设置',
            },
            {
                path: '/service/liveConcurrent/share',
                component: resolve => require(['../components/page/service/liveConcurrent/share.vue'], resolve),
                name: '首页设置',
            }
        ]
    },
    {
        path: '/service/spatialStorage',
          redirect:"/service/spatialStorage/spatialStorageDetail",
        component: resolve => require(['../components/page/service/spatialStorage.vue'], resolve),
        meta: {
            name: '空间存储',
        },
        children: [
            {
                path: '/service/spatialStorage/spatialStorageDetail',
                component: resolve => require(['../components/page/service/spatialStorage/spatialStorageDetail.vue'], resolve),
                name: '空间流量详情',
            },
            {
                path: '/service/spatialStorage/spatialStorageMoney',
                component: resolve => require(['../components/page/service/spatialStorage/spatialStorageMoney.vue'], resolve),
                name: '空间续费',
            },
            {
                path: '/service/spatialStorage/spatialStorageTall',
                component: resolve => require(['../components/page/service/spatialStorage/spatialStorageTall.vue'], resolve),
                name: '升级空间',
            },
            {
                path: '/service/spatialStorage/spatialStorageBuy',
                component: resolve => require(['../components/page/service/spatialStorage/spatialStorageBuy.vue'], resolve),
                name: '购买流量',
            },
        ]
    },
    {
        path: '/service/courseInventory',
        redirect:"/service/courseInventory/classKnow",
        component: resolve => require(['../components/page/service/courseInventory.vue'], resolve),
        meta: {
            name: '课程库存',
        },
        children: [
            {
                path: '/service/courseInventory/classKnow',
                component: resolve => require(['../components/page/service/courseInventory/classKnow.vue'], resolve),
                name: '授权课程',
            },
            {
                path: '/service/courseInventory/AllClass',
                component: resolve => require(['../components/page/service/courseInventory/AllClass.vue'], resolve),
                name: '库存总量',
            },
             {
                path: '/service/courseInventory/orderClass',
                component: resolve => require(['../components/page/service/courseInventory/orderClass.vue'], resolve),
                name: '库存订单',
            },
        ]
    }, 
    {
        path: '/service/callMarket',
         redirect:"/service/callMarket/callMarketTall",
        component: resolve => require(['../components/page/service/callMarket.vue'], resolve),
        meta: {
            name: '客服营销',
        },
        children: [
              {
                path: '/service/callMarket/callMarketTall',
                component: resolve => require(['../components/page/service/callMarket/callMarketTall.vue'], resolve),
                name: '工具条设置',
            },
            {
                path: '/service/callMarket/callMarketWC',
                component: resolve => require(['../components/page/service/callMarket/callMarketWC.vue'], resolve),
                name: '微信公众号',
            },
            {
                path: '/service/callMarket/callMarketQQ',
                component: resolve => require(['../components/page/service/callMarket/callMarketQQ.vue'], resolve),
                name: 'QQ号',
            },
            {
                path: '/service/callMarket/callMarketLang',
                component: resolve => require(['../components/page/service/callMarket/callMarketLang.vue'], resolve),
                name: '新浪微博',
            },
            {
                path: '/service/callMarket/callMarketTelephone',
                component: resolve => require(['../components/page/service/callMarket/callMarketTelephone.vue'], resolve),
                name: '客服电话',
            },
        ]
    },
    {
        path: '/service/statisticalAnalysis',
         redirect:"/service/statisticalAnalysis/statisticalAnalysisThree",
        component: resolve => require(['../components/page/service/statisticalAnalysis.vue'], resolve),
        meta: {
            name: '统计分析',
        },
        children: [
             {
                path: '/service/statisticalAnalysis/statisticalAnalysisThree',
                component: resolve => require(['../components/page/service/statisticalAnalysis/statisticalAnalysisThree.vue'], resolve),
                name: '第三方统计代码部署',
            },
            {
                path: '/service/statisticalAnalysis/statisticalAnalysisBai',
                component: resolve => require(['../components/page/service/statisticalAnalysis/statisticalAnalysisBai.vue'], resolve),
                name: '百度',
            },
            {
                path: '/service/statisticalAnalysis/statisticalAnalysisGrome',
                component: resolve => require(['../components/page/service/statisticalAnalysis/statisticalAnalysisGrome.vue'], resolve),
                name: '谷歌'
            },
            {
                path: '/service/statisticalAnalysis/statisticalAnalysisTeng',
                component: resolve => require(['../components/page/service/statisticalAnalysis/statisticalAnalysisTeng.vue'], resolve),
                name: '腾讯'
            },
            {
                path: '/service/statisticalAnalysis/statisticalAnalysisCnzz',
                component: resolve => require(['../components/page/service/statisticalAnalysis/statisticalAnalysisCnzz.vue'], resolve),
                name: 'cnzz'
            },
        ]
    },
]
export default service;