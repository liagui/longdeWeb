import Vue from 'vue';
import Vuex from 'vuex';
import question from './module/question'
import menu from './module/menu'
import {
    setLoc,
    getLoc
} from '@/utils';
Vue.use(Vuex);

let defaultToken = '';
let defaultOrgId = '';
try {
    if (localStorage.token) {
        defaultToken = localStorage.token;
    }
} catch (e) { }


try {
    if (localStorage.orgId) {
        defaultOrgId = localStorage.orgId;
    }

} catch (e) { }


export default new Vuex.Store({
    state: {
        loading: false,
        token: defaultToken,
        orgId: defaultOrgId,
        phoneNumber: "" || getLoc('phoneNumber'),
        code: '' || getLoc('code'),
        objCode: '' || getLoc('objCode'),
        topList: '' || getLoc('topList'),
        authList: '' || getLoc('authList'),
        menuList: '' || getLoc('menuList'),
        flag: false,
        firstPage: true,
        SecHeadClick: true,
        userInfo: '' || window.localStorage.getItem('userInfo'),
        school_status: localStorage.getItem('school_status'),
        cur_admin_id: getLoc('cur_admin_id') || 0
    },
    getters: {
        getSetbarList: state => state.topList || {
            subs: [],
        }
    },
    mutations: {
        userInfo(state, data) {
            state.userInfo = data;
            window.localStorage.setItem('userInfo', data)
        },
        school_status(state, data) {
            state.school_status = data;
            window.localStorage.setItem('school_status', data)
        },
        loading(state, bool) {
            state.loading = bool;
        },
        Token(state, token) {
            state.token = token;
            try {
                localStorage.token = token;
            } catch (e) { }
        },
        OrgId(state, orgId) {
            state.orgId = orgId;
            try {
                localStorage.orgId = orgId;
            } catch (e) { }
        },
        PhoneNumber(state, data) {
            state.phoneNumber = data;
            setLoc('phoneNumber', data);
        },
        clickSecHead(state, data) {
            state.SecHeadClick = data;
        },
        getCode(state, data) {
            state.code = data;
            setLoc('code', state.code);
            let obj = {};
            state.code.forEach(el => {
                obj[el] = el;
            })
            state.objCode = obj;
            setLoc('objCode', state.objCode);
        },
        getTapList(state, list) {
            state.topList = list;
            setLoc('topList', state.topList);
        },
        authList(state, list) {
            state.authList = list;
            setLoc('authList', state.authList);
        },
        menuList(state, list) {
            state.menuList = list;
            setLoc('menuList', state.menuList);
        },
        setFlag(state, blo) {
            state.flag = blo;
        },
        setFirstPage(state, rlt) {
            state.firstPage = rlt
        },
        cur_admin_id(state, str) {
            state.cur_admin_id = str;
            setLoc('cur_admin_id', str);
        },

    },
    actions: {
        A_privilegeList(context, res) {
            context.commit('M_privilegeList', res);
        }
    },
    modules: {
        question,
        menu,
    }
})
