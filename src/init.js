import {initState} from './state'
import {compileToFunctions} from './compiler/index'
// 在原型上添加一个init方法
export function initMixin(Vue){
    // 初始化流程
    Vue.prototype._init = function (options) {
        // console.log(options);
        // 数据劫持
        const Vm=this;
        Vm.$options=options;
        //初始化状态
        initState(Vm);

        if(Vm.$options.el) {
            Vm.$mount(Vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        el=document.querySelector(el);
        const vm = this;
        const options = vm.$options;
        //如果有render，就直接使用render
        if(!options.render){            //没有render
            let template = options.template; //找template
            if(!template && el){  //没有template，找el
                template = el.outerHTML;
            }
            const render = compileToFunctions(template);    //统一处理成render
            options.render = render;
        }
    }
}