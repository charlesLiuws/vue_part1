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
      // console.log('Array is change !');
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

    if (data.__ob__) {
      return;
    }

    return new Observer(data);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      Object.defineProperty(value, '__ob__', {
        value: this,
        enumerable: false,
        configurable: false
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

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // aa-aa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // aa：aa或者aa

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  function createASTElement(tag, attrs) {
    return {
      tag: tag,
      type: 1,
      //标签类型
      children: [],
      attrs: attrs,
      parent: null
    };
  }
  var currentParent; //栈型结构管理所有的标签元素

  var stack = [];

  function parseHTML(html) {
    // 根据开始标签、结束标签、文本内容生成ast语法树
    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs); //创建ast语法树

      currentParent = element; //暂存当前元素，便于关联父子关系

      stack.push(element);
      console.log('开始标签：' + tagName);
    }

    function end(tagName) {
      var element = stack.pop();
      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }

      console.log('结束标签：' + tagName);
    }

    function chars(text) {
      text = text.replace(/\s/g, ' ');

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }

      console.log('文本' + text);
    } //截取html前进


    function advance(n) {
      html = html.substring(n);
    }

    function parseStarTag() {
      //解析标签
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          //目标元素标签
          attrs: [] //标签属性

        };
        advance(start[0].length);

        var _end;

        var attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          //开始查找该元素的属性，直到遇到该元素的 > 停止
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          //删减 >
          advance(_end[0].length);
          return match;
        } // console.log(match,html);

      }
    }

    while (html) {
      //循环匹配html,不断截取删减
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        //以 < 开头,开始解析标签
        var startTagMatch = parseStarTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          //匹配到的是结束（如</div>）标签时，则删减
          advance(endTagMatch[0].length);
          end(endTagMatch[0]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        //不以 < 开头,开始解析文本
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }
  }

  function compileToFunctions(template) {
    console.log(template);
    parseHTML(template);
  }

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // console.log(options);
      // 数据劫持
      var Vm = this;
      Vm.$options = options; //初始化状态

      initState(Vm);

      if (Vm.$options.el) {
        Vm.$mount(Vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      el = document.querySelector(el);
      var vm = this;
      var options = vm.$options; //如果有render，就直接使用render

      if (!options.render) {
        //没有render
        var template = options.template; //找template

        if (!template && el) {
          //没有template，找el
          template = el.outerHTML;
        }

        var render = compileToFunctions(template); //统一处理成render

        options.render = render;
      }
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
