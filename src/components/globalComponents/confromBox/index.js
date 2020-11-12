
import Vue from 'vue';
import confrims from './confrom.vue';
const MessageBoxConstructor = Vue.extend(confrims);
// const initInstance = () => {
//   instance = new MessageBoxConstructor({
//     el: document.createElement('div')
//   });
// }

let instance;
var confrim = function(text, option, sureCallback, closecallback) {
  instance = new MessageBoxConstructor({
    propsData: {
      message: text ? text : '',
      ...option
    },
    data() {
      return {
        isshow: false
      }
    },
    watch: {
      isSure(val) {
        if(val) {
          if(sureCallback) {
            sureCallback();
          }
        } else {
          if(closecallback) {
            closecallback();
          }
        }
        this.isshow = false;
      }
    }
  });

  instance.$mount()
  document.body.appendChild(instance.$el);
  instance.isshow = true;

  return instance
  // return new Promise((resolve, reject) => {
  //   document.body.appendChild(instance.$el);
  //   if(isSure) {
  //     resolve(() => {
  //       instance.isSure();
  //     });
  //   } else {
  //     instance.close();
  //     reject();
  //   }
  // })
}





function merge(target) {
  for(let i = 1, j = arguments.length; i < j; i++) {
    let source = arguments[i] || {};
    for(let prop in source) {
      if(source.hasOwnProperty(prop)) {
        let value = source[prop];
        if(value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }
}
Vue.prototype.$mymsg = confrim;
export default confrim;
