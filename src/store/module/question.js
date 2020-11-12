import axios from 'axios';
import global from '@/store/global';
import store from '@/store';
let question = {
    state: {
        questionTypeList: [
            { text: "单选题", status: "1" },
            { text: "多选题", status: "2" },
            { text: "判断题", status: "3" },
            { text: "不定项", status: "4" },
            { text: "填空题", status: "5" },
            { text: "简答题", status: "6" },
            { text: "材料题", status: "7" }
        ],
        bank_id: localStorage.getItem("bank_id"),//试题id
        exam_id: localStorage.getItem("exam_id"),//试题id
        subject_id: localStorage.getItem("subject_id"),//试卷管理科目id\
        question_subject_id: localStorage.getItem("question_subject_id"),//试题管理科目id\

        subject_name: localStorage.getItem("subject_name"),//科目name
        papers_id: localStorage.getItem("papers_id"),//试卷id
        authority: localStorage.getItem("logweb"),//权限

        currentQuestionType: localStorage.getItem('currentQuestionType'),//试题管理---试题类型
    },
    mutations: {
        bank_id(state, str) {
            state.bank_id = str;
            localStorage.setItem("bank_id", str);
        },
        exam_id(state, str) {
            state.exam_id = str;
            localStorage.setItem("exam_id", str);
        },
        subject_id(state, str) {
            state.subject_id = str;
            localStorage.setItem("subject_id", str);
        },
        question_subject_id(state, str) {
            state.question_subject_id = str;
            localStorage.setItem("question_subject_id", str);
        },
        setSubject_name(state, str) {
            state.subject_name = str;
            localStorage.setItem("subject_name", str);
        },
        papers_id(state, str) {
            state.papers_id = str;
            localStorage.setItem("papers_id", str);
        },
        setAuthority(state, str) {
            state.authority = str;
            localStorage.setItem("logweb", str);
        },
        currentQuestionType(state, str) {
            state.currentQuestionType = str;
            localStorage.setItem("currentQuestionType", str);
        },
    },
    actions: {
        disAuthority(context, id) {
            return new Promise((resolve) => {
                if (localStorage.getItem("school_id") == 1) {
                    context.commit('setAuthority', 1);
                    resolve(1);
                    return
                }
                let bankId = id || context.state.bank_id;
                // debugger
                axios.post(global.ajaxurl + `question/getBankIsAuth`, `bank_id=${bankId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + store.state.token,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }).then(response => {
                    let res = response.data;
                    if (res.code == 200) {
                        //未授权可增删改查
                        context.commit('setAuthority', 1);
                        resolve(1)
                    } else if (res.code == 203) {
                        context.commit('setAuthority', 0);
                        resolve(0)
                    }
                })
            })

        }
    },
}


export default question;