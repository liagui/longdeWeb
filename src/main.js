import Vue from 'vue';
import ELEMENT from 'element-ui';
import App from './App';
import router from './router';
import axios from 'axios';
import AFTableColumn from 'af-table-column'
import Toast from 'vue2-toast';
import store from './store';
import global from './store/global';
import components from './components/globalComponents/index.js';
import './assets/css/reset.css';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import "babel-polyfill";
import './assets/iconfont/iconfont.css';
import './assets/css/common.css';
import * as filters from './filters';
import Watermark from '@/utils/watermark';
import 'vue2-toast/lib/toast.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import 'jquery'
import 'summernote'
import 'summernote/dist/summernote.css'
import 'summernote/dist/lang/summernote-zh-CN'
import bus from './components/common/bus'
import 'vant/lib/index.css';
// import "../static/cropper/webuploader";
import { Swipe, SwipeItem,Tag,Button  } from "vant";
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Tag);
Vue.use(Button);

Vue.use(AFTableColumn)
Vue.use(ELEMENT, {
    size: 'small'
});
import request from './utils/request'


Vue.prototype.request = request;

Vue.config.productionTip = false;
Vue.prototype.$bus = bus;
Vue.prototype.axios = axios;
Vue.prototype.GLOBAL = global;

Vue.use(Toast, {
    type: 'center',
    duration: 1000,
    wordWrap: true,
    width: 'auto'
})
// 注册全局filter
Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key])
})

Object.keys(components).forEach(key => {
    var name = key.replace(/(\w)/, v => v.toUpperCase()); //首字母大写
    Vue.component(`ty${name}`, components[key]);
});
Vue.directive('preventReClick', {
    inserted(el, binding) {
        let i = 0;
        el.addEventListener('click', (e) => {
            i++
            if (i > 1) {
                el.disabled = true
                // Vue.prototype.$toast('操作过于频繁')
            }
            setTimeout(() => {
                i = 0;
                el.disabled = false
                return;
            }, binding.value || 2000)

        })
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');