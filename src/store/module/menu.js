var aa = 1111111111111111;
export default {
    state: {
        // 总控
        menu2: [
            {
                id: 9,
                title: "网校控制",
                icon: "iconfont icontiqianhuankuan",
                subs: [
                    {
                        index: "/dataAll/schoolAdmin",
                        title: "网校管理",
                        id: 104,
                        parent_id: 9
                    },
                    {
                        index: "/dataAll/studentChangeSchool",
                        title: "学员转校",
                        id: 128,
                        parent_id: 9
                    },
                    {
                        index: "/dataAll/orderReview",
                        title: "订单审核",
                        id: 263,
                        parent_id: 9
                    }
                ]
            },
            {
                id: 131,
                title: "课程资源",
                icon: "iconfont icontiqianhuankuan",
                subs: [
                    {
                        index: "/resourceGeneral/generalSubject",
                        title: "学科",
                        id: 183,
                        parent_id: 131
                    },
                    {
                        index: "/resourceGeneral/generalCourse",
                        title: "课程",
                        id: 136,
                        parent_id: 131
                    },
                    {
                        index: "/resourceGeneral/generalOpencourse",
                        title: "公开课",
                        id: 150,
                        parent_id: 131
                    },
                    {
                        index: "/resourceGeneral/generalRecordresource",
                        title: "资源库",
                        id: 280,
                        parent_id: 131
                    },
                    {
                        index: "/resourceGeneral/generalliveresource",
                        title: "直播单元",
                        id: 146,
                        parent_id: 131
                    },
                    {
                        index: "/resourceGeneral/generalQuestionbank",
                        // index: "/resourceGeneral/generalQuestionbank",
                        title: "题库",
                        id: 158,
                        parent_id: 131
                    },
                    {
                        index: "/resourceGeneral/generalLecturers",
                        title: "讲师",
                        id: 188,
                        parent_id: 131
                    },
                    {
                        index: "/resourceGeneral/generalEducation",
                        title: "教务",
                        id: 188,
                        parent_id: 131
                    },

                ]
            },
            {
                id: 133,
                title: "教学",
                icon: "iconfont iconjiaoseguanli",
                subs: [
                    {
                        index: "/education/liveStudio",
                        title: "直播间",
                        id: 155,
                        parent_id: 133
                    }
                ]
            },
            {
                id: 132,
                title: "系统权限",
                icon: "iconfont iconyijiaokuanguanli",
                subs: [
                    {
                        index: "/system/accountManage",
                        title: "账户管理",
                        id: 193,
                        parent_id: 132
                    },
                    {
                        index: "/system/roleManage",
                        title: "角色管理",
                        id: 198,
                        parent_id: 132
                    },
                ]
            },
        ],
        // 中控
        menu: [
            {
                id: 1,
                title: "课程",
                icon: "iconfont icontiqianhuankuan",
                subs: [
                    {
                        index: "/courses/courses",
                        title: "课程",
                        parent_id: 1
                    },
                    {
                        index: "/courses/openCouses",
                        title: "公开课",
                        parent_id: 1
                    }
                ]
            },
            {
                id: 2,
                title: "教学",
                icon: "iconfont iconjiaoseguanli",
                subs: [
                    {
                        index: "/education/schoolLiveStudio",
                        title: "直播间",
                        parent_id: 2
                    }
                ]
            },
            {
                id: 3,
                title: "题库",
                icon: "iconfont iconqudaoguanli",
                subs: [
                    {
                        index: "/question",
                        title: "题库",
                        parent_id: 3
                    },
                    {
                        index: "/question/getExamList",
                        title: "试题管理",
                        parent_id: 3
                    },
                    {
                        index: "/question/getPapersList",
                        title: "试卷管理",
                        parent_id: 3
                    },
                    {
                        index: "/question/getChaptersList",
                        title: "章节考点",
                        parent_id: 3
                    },
                    {
                        index: "/question/getSubjectList",
                        title: "科目管理",
                        parent_id: 3
                    }
                ]
            },
            {
                id: 4,
                title: "资源",
                icon: "iconfont iconxujie",
                subs: [
                    {
                        index: "/resources/subject",
                        title: "学科",
                        parent_id: 4
                    },
                    {
                        index: "/resources/recordResource",
                        title: "录播资源",
                        parent_id: 4
                    },
                    {
                        index: "/resources/liveResource",
                        title: "直播单元",
                        parent_id: 4
                    },
                    {
                        index: "/resources/courseAgreement",
                        title: "课程协议",
                        parent_id: 4
                    },
                ]
            },
            {
                id: 5,
                title: "用户",
                icon: "iconfont iconyuangongguanli",
                subs: [
                    {
                        index: "/users/students",
                        title: "学员",
                        parent_id: 5
                    },
                    {
                        index: "/users/lecturers",
                        title: "讲师",
                        parent_id: 5
                    },
                    {
                        index: "/users/educatAdmin",
                        title: "教务",
                        parent_id: 5
                    },
                ]
            },
            {
                id: 6,
                title: "运营",
                icon: "iconfont iconyunyingtongji",
                subs: [
                    {
                        index: "/operate/articleAdmin",
                        title: "文章管理",
                        parent_id: 6
                    },
                    {
                        index: "/operate/commentAdmin",
                        title: "评论管理",
                        parent_id: 6
                    },
                    {
                        index: "/operate/qaAdmin",
                        title: "问答管理",
                        parent_id: 6
                    },
                ]
            },
            {
                id: 7,
                title: "财务",
                icon: "iconfont iconzhanqi",
                subs: [
                    {
                        index: "/orders/orders",
                        title: "订单",
                        parent_id: 7
                    },
                    {
                        index: "/orders/incomeDetail",
                        title: "收入详情",
                        parent_id: 7
                    },
                ]
            },
            {
                id: 8,
                title: "数据",
                icon: "iconfont iconcaiwutongji",
                subs: [
                    {
                        index: "/statistics/schoolStatistic",
                        title: "学员统计",
                        parent_id: 8
                    },
                    {
                        index: "/statistics/teacherStatistic",
                        title: "教师课时",
                        parent_id: 8
                    },
                    {
                        index: "/statistics/classStatistic",
                        title: "直播到课率",
                        parent_id: 8
                    }
                ]
            },
            {
                id: 10,
                title: "账户",
                icon: "iconfont iconyijiaokuanguanli",
                subs: [
                    {
                        index: "/system/accountManage",
                        title: "账户管理",
                        parent_id: 10
                    },
                    {
                        index: "/system/roleManage",
                        title: "角色管理",
                        parent_id: 10
                    },
                    // {
                    //     index: "/dataAll/schoolAdmin",
                    //     title: "网校管理",
                    //     parent_id: 9
                    // },
                    // {
                    //     index: "/dataAll/studentChangeSchool",
                    //     title: "学员转校",
                    //     parent_id: 9
                    // }
                ]
            },

            {
                id: 135,
                title: "服务",
                icon: "iconfont iconchanpinshezhi",
                subs: [

                    {
                        index: "/service/schoolRecharge",
                        title: "网校预充值",
                        parent_id: 135
                    },
                    {
                        index: "/service/schoolSet",
                        title: "网校设置",
                        parent_id: 135
                    },
                    {
                        index: "/service/payManage",
                        title: "支付管理",
                        parent_id: 135
                    },
                    {
                        index: "/service/liveConcurrent",
                        title: "直播并发",
                        parent_id: 135
                    },
                    {
                        index: "/service/spatialStorage",
                        title: "空间存储",
                        parent_id: 135
                    },
                    {
                        index: "/service/courseInventory",
                        title: "课程库存",
                        parent_id: 135
                    },
                    {
                        index: "/service/callMarket",
                        title: "客服营销",
                        parent_id: 135
                    },
                    {
                        index: "/service/statisticalAnalysis",
                        title: "统计分析",
                        parent_id: 135
                    },
                    // {
                    //     index: "/system/webSet",
                    //     title: "页面配置",
                    //     parent_id: 10
                    // }
                ]
            }
        ],
        MENU_SELECT_ID: localStorage.getItem('MENU_SELECT_ID')
    },
    mutations: {
        MENU_SELECT_ID(state, data) {
            state.MENU_SELECT_ID = data;
            window.localStorage.setItem('MENU_SELECT_ID', data)
        },
    }
}