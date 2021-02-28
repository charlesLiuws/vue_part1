import {isObject} from '../util/index'
import {arrayMethods} from './array'
//把data中的数据都使用object.defineProperty重新定义 属于es5方法(不兼容ie8以及一下版本)
export function observe(data){
    // console.log(data,'observe');
    let isObj=isObject(data);   //是否为对象
    if(!isObj){
        return;
    }
    if(data.__ob__){
        return;
    }
    return new Observer(data)
}
class Observer{
    constructor(value){
        Object.defineProperty(value,'__ob__',{
            value:this,
            enumerable:false,
            configurable:false
        })
        if(Array.isArray(value)){
            value.__proto__=arrayMethods;
            // 劫持原有数组里的对象
            this.observeArray(value);
        }else{
            this.walk(value);
        }
    }
    observeArray(value){
        value.forEach(item=>{
            observe(item);
        })
    }
    walk(data){
        Object.keys(data).forEach(key=>{
            defineReactive(data,key,data[key]);
        })
    }
}
function defineReactive(data,key,value){
    observe(value); //递归实现深度劫持
    Object.defineProperty(data,key,{
        get(){
            return value;
        },
        set(newValue){
            if(newValue === value){
                return;
            }
            observe(newValue); //继续劫持用户设置的新值（设置对象）
            value=newValue;
        }
    })
}