(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  //一些公共方法
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }

  //拷贝数组的原型方法
  var oldArrayProtoMethods = Array.prototype; //创建一个空对象，将其继承数组的原型对象

  var arrayMethods = Object.create(Array.prototype); //改造可改变原数组的七种原型方法

  var methods = ['push', 'sort', 'splice', 'reverse', 'pop', 'shift', 'unshift'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayProtoMethods;

      //新增的逻辑
      console.log('Array is change !');
      var inserted;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
      }

      if (inserted) {
        //对数组里新增的对象进行监听
        this.__ob__.observeArray(inserted);
      } //执行原有的数组方法


      return (_oldArrayProtoMethods = oldArrayProtoMethods[method]).call.apply(_oldArrayProtoMethods, [this].concat(args));
    };
  });

  function observe(data) {
    // console.log(data,'observe');
    var isObj = isObject(data); //是否为对象

    if (!isObj) {
      return;
    }

    return new Observer(data);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      Object.defineProperty(value, '__ob__', {
        value: this,
        enumerable: false
      });

      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods; // 劫持原有数组里的对象

        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        value.forEach(function (item) {
          observe(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); //递归实现深度劫持

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) {
          return;
        }

        observe(newValue); //继续劫持用户设置的新值（设置对象）

        value = newValue;
      }
    });
  }

  function initState(Vm) {
    var opts = Vm.$options; //vue的数据来源：属性 方法 数据 计算属性 watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(Vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  function initData(Vm) {
    //数据初始化
    var data = Vm.$options.data;
    data = Vm._data = typeof data === 'function' ? data.call(Vm) : data;
    Object.keys(data).forEach(function (key) {
      proxy(Vm, '_data', key);
    }); // Object.defineProperty() 给属性增加get方法和set方法

    observe(data); //响应式原理
  }

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // console.log(options);
      // 数据劫持
      var Vm = this;
      Vm.$options = options; //初始化状态

      initState(Vm);
    };
  }

  function Vue(options) {
    // Vue初始化操作
    this._init(options);
  } //通过引入文件方式给vue添加原型方法


  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
