import {observe} from './observer/index'
export function initState(Vm){
    const opts=Vm.$options;
    //vue的数据来源：属性 方法 数据 计算属性 watch
    if(opts.props){
        initProps(Vm);
    }
    if(opts.methods){
        initMethods(Vm);
    }
    if(opts.data){
        initData(Vm);
    }
    if(opts.computed){
        initComputed(Vm);
    }
    if(opts.watch){
        initWatch(Vm);
    }
}
function initProps(Vm){}
function initMethods(Vm){}
function proxy(vm,source,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key]
        },
        set(newValue){
            vm[source][key]=newValue;
        }
    })
}
function initData(Vm){
    //数据初始化
    let data=Vm.$options.data;
    data=Vm._data=typeof data === 'function'?data.call(Vm):data;
    Object.keys(data).forEach(key=>{
        proxy(Vm,'_data',key)
    })
    // Object.defineProperty() 给属性增加get方法和set方法
    observe(data); //响应式原理

}
function initComputed(Vm){}
function initWatch(Vm){}