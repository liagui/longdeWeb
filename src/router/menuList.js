const question = [
    {
        path: '/question',
        // name:'题库',
        component: resolve => require(['../components/page/questionBank/questionBank.vue'], resolve),
        children: [
            {
                path: '/question/getExamList',
                // name:'试题管理',
                component: resolve => require(['../components/page/questionBank/getExamList/getExamList.vue'], resolve),
                children: [
                    {
                        path: '/question/getExamList/add',
                        // name:'添加试题',
                        component: resolve => require(['../components/page/questionBank/getExamList/add.vue'], resolve),
                    },
                    {
                        path: '/question/getExamList/edit',
                        // name:'编辑试题',
                        component: resolve => require(['../components/page/questionBank/getExamList/edit.vue'], resolve),
                    },
                ]
            },
            {
                path: '/question/getPapersList',
                // name:'试卷管理',
                component: resolve => require(['../components/page/questionBank/getPapersList/getPapersList.vue'], resolve),
                children: [
                    {
                        path: '/question/getPapersList/check',
                        // name:'选择试题',
                        component: resolve => require(['../components/page/questionBank/getPapersList/check.vue'], resolve),
                    },
                ]
            },
            {
                path: '/question/getChaptersList',
                // name:'章节考点',
                component: resolve => require(['../components/page/questionBank/getChaptersList/getChaptersList.vue'], resolve),
            },
            {
                path: '/question/getSubjectList',
                // name:'科目管理',
                component: resolve => require(['../components/page/questionBank/getSubjectList/getSubjectList.vue'], resolve),
            },
        ]
    },
    {
        path: '/courses/courses',
        component: resolve => require(['../components/page/courses/courses.vue'], resolve),
        // name:'课程',
        children: [
            {
                path: '/courses/coursesSub/add',
                component: resolve => require(['../components/page/courses/coursesSub/coursesAdd.vue'], resolve),
                // name:'课程',
            },
            {
                path: '/courses/coursesSub/record',
                component: resolve => require(['../components/page/courses/coursesSub/courseRecord.vue'], resolve),
                // name:'课程录播',
            },
            {
                path: '/courses/coursesSub/live',
                component: resolve => require(['../components/page/courses/coursesSub/courseLive.vue'], resolve),
                // name:'课程直播',
                children: [
                    {
                        path: '/courses/coursesSub/liveClass',
                        component: resolve => require(['../components/page/courses/coursesSub/courseLiveClass.vue'], resolve),
                        // name:'直播单元',
                    }
                ]
            },
        ]
    },

    // 总校
    {
        path: '/resourceGeneral/generalSubject',
        component: resolve => require(['../components/page/resourceGeneral/generalSubject.vue'], resolve),
        // name:'学科',
        children: [

        ]
    },
    {
        path: '/resourceGeneral/generalCourse',
        component: resolve => require(['../components/page/resourceGeneral/generalCourse.vue'], resolve),
        // name:'课程',
        children: [

        ]
    },
    {
        path: '/resourceGeneral/generalOpencourse',
        component: resolve => require(['../components/page/resourceGeneral/generalOpencourse.vue'], resolve),
        // name:'公开课',
        children: [

        ]
    },
    {
        path: '/resourceGeneral/generalRecordresource',
        component: resolve => require(['../components/page/resourceGeneral/generalRecordresource.vue'], resolve),
        // name:'资源库',
        children: [

        ]
    },
    {
        path: '/resourceGeneral/generalliveresource',
        component: resolve => require(['../components/page/resourceGeneral/generalliveresource.vue'], resolve),
        // name:'直播单元',
    },
    {
        path: '/resourceGeneral/generalQuestionbank',
        component: resolve => require(['../components/page/resourceGeneral/generalQuestionbank.vue'], resolve),
        // name:'题库',
    },
    {
        path: '/resourceGeneral/generalLecturers',
        component: resolve => require(['../components/page/resourceGeneral/generalLecturers.vue'], resolve),
        // name:'讲师',
    },
    {
        path: '/resourceGeneral/generalEducation',
        component: resolve => require(['../components/page/resourceGeneral/generalEducation.vue'], resolve),
        // name:'教务',
    },

    {
        path: '/courses/openCouses',
        component: resolve => require(['../components/page/courses/openCouses.vue'], resolve),
        // name:'公开课',
        children: [
            {
                path: '/courses/openCousesSub/add',
                component: resolve => require(['../components/page/courses/coursesSub/openCourseAdd.vue'], resolve),
                // name:'课程',
            },
        ]
    },
    {
        path: '/education/liveStudio',
        component: resolve => require(['../components/page/education/liveStudio.vue'], resolve),
        // name:'教学',
        children: [
            {
                path: '/education/liveStudio/detail',
                component: resolve => require(['../components/page/education/liveStudioDetail.vue'], resolve),
                // name:'教学',
            },
        ]
    },
    {
        path: '/education/schoolLiveStudio',
        component: resolve => require(['../components/page/education/liveStudio.vue'], resolve),
        // name:'中控教学',
        children: [
            {
                path: '/education/liveStudio/detail',
                component: resolve => require(['../components/page/education/liveStudioDetail.vue'], resolve),
                // name:'教学',
            },
        ]
    },

    {
        path: '/system/accountManage',
        component: resolve => require(['../components/page/system/accountManage.vue'], resolve),
        // name:'账户管理',
        children: [
            {
                path: '/system/accountManage/add',
                component: resolve => require(['../components/page/system/accountAdd.vue'], resolve),
                // name:'账户添加',
            },
            {
                path: '/system/accountManage/update',
                component: resolve => require(['../components/page/system/accountUpdate.vue'], resolve),
                // name:'账户添加',
            },
        ]

    },
    {
        path: '/system/roleManage',
        component: resolve => require(['../components/page/system/roleManage.vue'], resolve),
        // name:'角色管理',
        children: [
            {
                path: '/system/roleManage/add',
                component: resolve => require(['../components/page/system/roleAdd.vue'], resolve),
                // name:'角色添加',
            },
            {
                path: '/system/roleManage/edit',
                component: resolve => require(['../components/page/system/roleEdit.vue'], resolve),
                // name:'角色更新',
            },
        ]
    },
    {
        path: '/system/webSet',
        component: resolve => require(['../components/page/system/webSet.vue'], resolve),
        meta: {
            // name:'页面配置',
        }
    },
    {
        path: '/system/payManage',
        component: resolve => require(['../components/page/system/payManage.vue'], resolve),
        meta: {
            // name:'支付管理',
        }
    },
    // 资源
    {
        path: '/resources/subject',
        component: resolve => require(['../components/page/resources/subject.vue'], resolve),
        meta: {
            // name:'学科',
        }
    },
    {
        path: '/resources/liveResource',
        component: resolve => require(['../components/page/resources/liveResource.vue'], resolve),
        // name:'/resources/liveResource',
        children: [
            {
                path: '/resources/liveResource/detail',
                component: resolve => require(['../components/page/resources/liveResources/liveResourceDetail.vue'], resolve),
                // name:'详情',
                children: [
                    {
                        path: '/resources/liveResource/classAdmin',
                        component: resolve => require(['../components/page/resources/liveResources/liveResourceClassAdmin.vue'], resolve),
                        // name:'班号管理',

                    },
                ]
            },
        ]
    },
    {
        path: '/resources/recordResource',
        component: resolve => require(['../components/page/resources/recordResource.vue'], resolve),
        meta: {
            // name:'录播资源',
        }
    },
    {
        path: '/resources/courseAgreement',
        component: resolve => require(['../components/page/resources/courseAgreement.vue'], resolve),
        meta: {
            // name:'课程协议',
        }
    },
    // 用户
    {
        path: '/users/students',
        component: resolve => require(['../components/page/users/students.vue'], resolve),
        // name:'学员',
        children: [
            {
                path: '/users/students/archive',
                component: resolve => require(['../components/page/users/students/studentsArchive.vue'], resolve),
                // name:'班号管理',
                meta: {
                    name: '班号管理',
                    keepAlive: true
                },
                children: [
                    {
                        path: '/users/students/changeClass',
                        component: resolve => require(['../components/page/users/students/changeClass.vue'], resolve),
                        // name:'转班',
                    },
                    {
                        path: '/users/students/changeClassOrder',
                        component: resolve => require(['../components/page/users/students/changeClassOrder.vue'], resolve),
                        // name:'转班订单',
                    },
                    {
                        path: '/users/students/studentQuestion',
                        component: resolve => require(['../components/page/users/students/studentQuestion.vue'], resolve),
                        // name:'做题记录-详情',
                    },
                ]
            },
        ]
    },
    {
        path: '/users/lecturers',
        // name:'/users/lecturers',
        component: resolve => require(['../components/page/users/lecturers.vue'], resolve),
        meta: {
            // name:'讲师',
        }
    },
    {
        path: '/users/educatAdmin',
        // name:'/users/educatAdmin',
        component: resolve => require(['../components/page/users/educatAdmin.vue'], resolve),
        meta: {
            // name:'教务',
        }
    },
    // 运营
    {
        path: '/operate/articleAdmin',
        component: resolve => require(['../components/page/operate/articleAdmin.vue'], resolve),
        // name:'文章管理',
        children: [
            {
                path: '/operate/articleAdmin/artileCate',
                component: resolve => require(['../components/page/operate/artileCate.vue'], resolve),
                // name:'分类管理',
            },

        ]
    },
    {
        path: '/operate/commentAdmin',
        // name:'/operate/commentAdmin',
        component: resolve => require(['../components/page/operate/commentAdmin.vue'], resolve),
        meta: {
            // name:'评论管理',
        }

    },
    {
        path: '/operate/qaAdmin',
        component: resolve => require(['../components/page/operate/qaAdmin.vue'], resolve),
        meta: {
            // name:'问答管理',
        }

    },

    // 财务
    {
        path: '/orders/orders',
        component: resolve => require(['../components/page/orders/orders.vue'], resolve),
        meta: {
            // name:'订单',
        }
    },
    {
        path: '/orders/incomeDetail',
        component: resolve => require(['../components/page/orders/incomeDetail.vue'], resolve),
        meta: {
            // name:'收入详情',
        }
    },
    // 数据
    {
        path: '/statistics/schoolStatistic',
        component: resolve => require(['../components/page/statistics/schoolStatistic.vue'], resolve),
        meta: {
            // name:'学员统计',
        }
    },
    {
        path: '/statistics/teacherStatistic',
        component: resolve => require(['../components/page/statistics/teacherStatistic.vue'], resolve),
        meta: {
            // name:'讲师统计',
        }
    },
    {
        path: '/statistics/classStatistic',
        component: resolve => require(['../components/page/statistics/classStatistic.vue'], resolve),
        meta: {
            // name:'课时统计',
        }
    },
    //网校管理
    {
        path: '/dataAll/schoolAdmin',
        component: resolve => require(['../components/page/dataAll/schoolAdmin.vue'], resolve),
        // name:'网校管理',
        children: [
            {
                path: '/dataAll/schoolAdmin/auth',
                component: resolve => require(['../components/page/dataAll/schoolAuth.vue'], resolve),
                // name:'权限管理',
            },
            {
                path: '/dataAll/schoolAdmin/schoolAdd',
                component: resolve => require(['../components/page/dataAll/schoolAdd.vue'], resolve),
                // name:'网校添加',
            },
            {
                path: '/dataAll/schoolAdmin/schoolSelf',
                component: resolve => require(['../components/page/dataAll/schoolSelf.vue'], resolve),
                // name:'网校信息',
            },
            {
                path: '/dataAll/schoolAdmin/reconciliationData',
                component: resolve => require(['../components/page/dataAll/school/reconciliationData.vue'], resolve),
                // name:'对账数据',
            }
        ]
    },
    {
        path: '/dataAll/studentChangeSchool',
        component: resolve => require(['../components/page/dataAll/studentChangeSchool.vue'], resolve),
        meta: {
            // name:'学院转校',
        }
    },
    {
        path: '/dataAll/orderReview',
        component: resolve => require(['../components/page/dataAll/orderReview.vue'], resolve),
        meta: {
            // name:'学院转校',
        }
    },



]
export default question;