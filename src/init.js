import {initState} from './state'
// 在原型上添加一个init方法
export function initMixin(Vue){
    // 初始化流程
    Vue.prototype._init=function(options){
        // console.log(options);
        // 数据劫持
        const Vm=this;
        Vm.$options=options;
        //初始化状态
        initState(Vm);
    }
}