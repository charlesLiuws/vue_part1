import {initMixin} from './init'

// vue核心代码 相当于vue的声明
function Vue(options){
    // Vue初始化操作
    this._init(options)

}

//通过引入文件方式给vue添加原型方法
initMixin(Vue);

export default Vue;