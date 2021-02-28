//拷贝数组的原型方法
let oldArrayProtoMethods = Array.prototype;
//创建一个空对象，将其继承数组的原型对象
let arrayMethods = Object.create(Array.prototype);
//改造可改变原数组的七种原型方法
let methods=['push','sort','splice','reverse','pop','shift','unshift'];
methods.forEach(method=>{
    arrayMethods[method]=function (...args){
        //新增的逻辑
        console.log('Array is change !');
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted=args;
                break;
            case 'splice':
                inserted=args.slice(2)
            default:
                break;
        }
        if(inserted){
            //对数组里新增的对象进行监听
            this.__ob__.observeArray(inserted);
        }
        //执行原有的数组方法
        return oldArrayProtoMethods[method].call(this,...args);
    }
})
export {arrayMethods}