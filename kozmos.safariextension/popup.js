(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
module.exports=[
  {
    key: "oneClickLike",
    title: "One-click bookmarking",
    desc: "Heart button will immediately bookmark when clicked.",
    defaultValue: true,
    popup: true
  },
  {
    key: "recentBookmarksFirst",
    title: "Recent Bookmarks First",
    desc: "Move Recent Bookmarks Over Frequently Visited",
    defaultValue: false,
    newtab: true
  },
  {
    key: "minimalMode",
    title: "Enable Minimal Mode",
    desc: "Hide majority of the interface until user focuses.",
    defaultValue: true,
    newtab: true
  },
  {
    key: "showWallpaper",
    title: "Show Wallpaper",
    desc: "Get a new beautiful photo in your new tab every day.",
    defaultValue: true,
    newtab: true
  },
  {
    key: "enableGreeting",
    title: "Show greeting & time",
    desc: "See your name, and a nice clock.",
    defaultValue: false,
    newtab: true
  },
  {
    key: "enableNewTab",
    title: "Enable New Tab Interface",
    desc: "Faster and easier search interface.",
    defaultValue: true,
    popup: true,
    newtab: true
  }
]

},{}],2:[function(require,module,exports){
'use strict';

module.exports = {
  create: create,
  current: current,
  onUpdated: onUpdated
};

function create(url) {
  chrome.tabs.create({ url: url });
}

function current(callback) {
  chrome.tabs.query({ 'active': true, currentWindow: true }, function (tabs) {
    if (tabs[0]) callback(undefined, tabs[0]);

    chrome.tabs.query({ 'active': true }, function (tabs) {
      callback(undefined, tabs[0]);
    });
  });
}

function onUpdated(callback) {
  chrome.tabs.onUpdated.addListener(callback);
  chrome.tabs.onActivated.addListener(callback);
}

},{}],3:[function(require,module,exports){
module.exports={
  "host": "https://getkozmos.com"
}

},{}],4:[function(require,module,exports){
'use strict';

var config = require("../config");

module.exports = {
  sendJSON: sendJSON,
  get: get,
  post: post,
  put: put,
  delete: deleteFn
};

function sendJSON(method, url, data, callback) {
  var token = localStorage['token'];

  if (!token) return callback(new Error('Login required (401).'));

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open(method, config.host + url);

  xmlhttp.setRequestHeader("X-API-Token", token);

  if (data) {
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
  } else {
    xmlhttp.send(null);
  }

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState !== 4) {
      return;
    }

    if (xmlhttp.status >= 500) {
      return callback(new Error(parsed.error));
    }

    if (xmlhttp.status == 401) {
      localStorage['token'] = "";
      localStorage['name'] = "";
      return callback(new Error('Unauthorized (401)'));
    }

    if (xmlhttp.status == 404) {
      return callback(new Error('Not found'));
    }

    if (xmlhttp.status >= 300) {
      return callback(new Error('Request error: ' + xmlhttp.status));
    }

    var parsed = null;
    var err = null;

    try {
      parsed = JSON.parse(xmlhttp.responseText);
    } catch (e) {
      err = new Error('An error happened');
    }

    callback(err, parsed);
  };
}

function get(url, callback) {
  sendJSON('GET', url, null, callback);
}

function post(url, data, callback) {
  sendJSON('POST', url, data, callback);
}

function put(url, data, callback) {
  sendJSON('PUT', url, data, callback);
}

function deleteFn(url, data, callback) {
  sendJSON('DELETE', url, data, callback);
}

},{"../config":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Icon = function (_Component) {
  _inherits(Icon, _Component);

  function Icon() {
    _classCallCheck(this, Icon);

    return _possibleConstructorReturn(this, (Icon.__proto__ || Object.getPrototypeOf(Icon)).apply(this, arguments));
  }

  _createClass(Icon, [{
    key: "render",
    value: function render() {
      var method = this['render' + this.props.name.slice(0, 1).toUpperCase(0, 1) + this.props.name.slice(1)];

      return (0, _preact.h)(
        "div",
        _extends({ onClick: this.props.onClick, className: "icon icon-" + this.props.name }, this.props),
        method ? method.call(this) : null
      );
    }
  }, {
    key: "stroke",
    value: function stroke() {
      return this.props.stroke || 2;
    }
  }, {
    key: "renderAlert",
    value: function renderAlert() {
      return (0, _preact.h)(
        "svg",
        { id: "i-alert", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.props.stroke || "2" },
        (0, _preact.h)("path", { d: "M16 3 L30 29 2 29 Z M16 11 L16 19 M16 23 L16 25" })
      );
    }
  }, {
    key: "renderClock",
    value: function renderClock() {
      return (0, _preact.h)(
        "svg",
        { id: "i-clock", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.props.stroke || "2" },
        (0, _preact.h)("circle", { cx: "16", cy: "16", r: "14" }),
        (0, _preact.h)("path", { d: "M16 8 L16 16 20 20" })
      );
    }
  }, {
    key: "renderClose",
    value: function renderClose() {
      return (0, _preact.h)(
        "svg",
        { id: "i-close", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.props.stroke || "2" },
        (0, _preact.h)("path", { d: "M2 30 L30 2 M30 30 L2 2" })
      );
    }
  }, {
    key: "renderHeart",
    value: function renderHeart() {
      return (0, _preact.h)(
        "svg",
        { id: "i-heart", viewBox: "0 0 32 32", width: "32", height: "32", fill: "currentcolor", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.stroke() },
        (0, _preact.h)("path", { d: "M4 16 C1 12 2 6 7 4 12 2 15 6 16 8 17 6 21 2 26 4 31 6 31 12 28 16 25 20 16 28 16 28 16 28 7 20 4 16 Z" })
      );
    }
  }, {
    key: "renderSearch",
    value: function renderSearch() {
      return (0, _preact.h)(
        "svg",
        { id: "i-search", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.props.stroke || "2" },
        (0, _preact.h)("circle", { cx: "14", cy: "14", r: "12" }),
        (0, _preact.h)("path", { d: "M23 23 L30 30" })
      );
    }
  }, {
    key: "renderExternal",
    value: function renderExternal() {
      return (0, _preact.h)(
        "svg",
        { id: "i-external", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.props.stroke || "2" },
        (0, _preact.h)("path", { d: "M14 9 L3 9 3 29 23 29 23 18 M18 4 L28 4 28 14 M28 4 L14 18" })
      );
    }
  }, {
    key: "renderTag",
    value: function renderTag() {
      return (0, _preact.h)(
        "svg",
        { id: "i-tag", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.props.stroke || "2" },
        (0, _preact.h)("circle", { cx: "24", cy: "8", r: "2" }),
        (0, _preact.h)("path", { d: "M2 18 L18 2 30 2 30 14 14 30 Z" })
      );
    }
  }, {
    key: "renderTrash",
    value: function renderTrash() {
      return (0, _preact.h)(
        "svg",
        { id: "i-trash", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.props.stroke || "2" },
        (0, _preact.h)("path", { d: "M28 6 L6 6 8 30 24 30 26 6 4 6 M16 12 L16 24 M21 12 L20 24 M11 12 L12 24 M12 6 L13 2 19 2 20 6" })
      );
    }
  }, {
    key: "renderRightChevron",
    value: function renderRightChevron() {
      return (0, _preact.h)(
        "svg",
        { id: "i-chevron-right", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.props.stroke || "2" },
        (0, _preact.h)("path", { d: "M12 30 L24 16 12 2" })
      );
    }
  }, {
    key: "renderSettings",
    value: function renderSettings() {
      return (0, _preact.h)(
        "svg",
        { id: "i-settings", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.props.stroke || "2" },
        (0, _preact.h)("path", { d: "M13 2 L13 6 11 7 8 4 4 8 7 11 6 13 2 13 2 19 6 19 7 21 4 24 8 28 11 25 13 26 13 30 19 30 19 26 21 25 24 28 28 24 25 21 26 19 30 19 30 13 26 13 25 11 28 8 24 4 21 7 19 6 19 2 Z" }),
        (0, _preact.h)("circle", { cx: "16", cy: "16", r: "4" })
      );
    }
  }, {
    key: "renderMessage",
    value: function renderMessage() {
      return (0, _preact.h)(
        "svg",
        { id: "i-msg", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.props.stroke || "2" },
        (0, _preact.h)("path", { d: "M2 4 L30 4 30 22 16 22 8 29 8 22 2 22 Z" })
      );
    }
  }]);

  return Icon;
}(_preact.Component);

exports.default = Icon;

},{"preact":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _icon = require("./icon");

var _icon2 = _interopRequireDefault(_icon);

var _settingsSections = require("../chrome/settings-sections");

var _settingsSections2 = _interopRequireDefault(_settingsSections);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Settings = function (_Component) {
  _inherits(Settings, _Component);

  function Settings(props) {
    _classCallCheck(this, Settings);

    var _this = _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).call(this, props));

    _settingsSections2.default.forEach(function (s) {
      return _this.loadSection(s);
    });
    return _this;
  }

  _createClass(Settings, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {
      var _this2 = this;

      _settingsSections2.default.forEach(function (s) {
        return _this2.loadSection(s);
      });
    }
  }, {
    key: "loadSection",
    value: function loadSection(s) {
      var _this3 = this;

      this.props.messages.send({ task: 'get-settings-value', key: s.key }, function (resp) {
        if (resp.error) return _this3.onError(resp.error);
        var u = {};
        u[s.key] = resp.content.value;
        _this3.setState(u);
      });
    }
  }, {
    key: "onChange",
    value: function onChange(value, options) {
      var _this4 = this;

      this.props.messages.send({ task: 'set-settings-value', key: options.key, value: value }, function (resp) {
        if (resp.error) return _this4.onError(resp.error);

        if (_this4.props.onChange) {
          _this4.props.onChange();
        }
      });
    }
  }, {
    key: "onError",
    value: function onError(error) {
      this.setState({
        error: error
      });

      if (this.props.onError) {
        this.props.onError(error);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      return (0, _preact.h)(
        "div",
        { className: "settings " + (this.state.open ? "open" : "") },
        (0, _preact.h)(_icon2.default, { onClick: function onClick() {
            return _this5.setState({ open: true });
          }, name: "settings" }),
        this.renderSettings()
      );
    }
  }, {
    key: "renderSettings",
    value: function renderSettings() {
      var _this6 = this;

      return (0, _preact.h)(
        "div",
        { className: "content" },
        this.renderCloseButton(),
        (0, _preact.h)(
          "h1",
          null,
          "Settings"
        ),
        (0, _preact.h)(
          "h2",
          null,
          "Got feedback / recommendation ? ",
          (0, _preact.h)(
            "a",
            { href: "mailto:azer@getkozmos.com" },
            "feedback"
          ),
          " anytime."
        ),
        this.renderSections(),
        (0, _preact.h)(
          "div",
          { className: "footer" },
          (0, _preact.h)(
            "button",
            { onclick: function onclick() {
                return _this6.setState({ open: false });
              } },
            "Done"
          )
        )
      );
    }
  }, {
    key: "renderSections",
    value: function renderSections() {
      var _this7 = this;

      return (0, _preact.h)(
        "div",
        { className: "sections" },
        _settingsSections2.default.map(function (s) {
          return _this7.renderSection(s);
        })
      );
    }
  }, {
    key: "renderSection",
    value: function renderSection(options) {
      var _this8 = this;

      if (this.props.type && !options[this.props.type]) {
        return;
      }

      return (0, _preact.h)(
        "section",
        { className: "setting " + options.key },
        (0, _preact.h)("input", { className: "checkbox", id: options.key, name: options.key, type: "checkbox", checked: this.state[options.key], onChange: function onChange(e) {
            return _this8.onChange(e.target.checked, options);
          } }),
        (0, _preact.h)(
          "label",
          { title: options.desc, htmlFor: options.key },
          options.title
        ),
        (0, _preact.h)(
          "p",
          null,
          options.desc
        )
      );
    }
  }, {
    key: "renderCloseButton",
    value: function renderCloseButton() {
      var _this9 = this;

      return (0, _preact.h)(_icon2.default, { stroke: "3", name: "close", onClick: function onClick() {
          return _this9.setState({ open: false });
        } });
    }
  }]);

  return Settings;
}(_preact.Component);

exports.default = Settings;

},{"../chrome/settings-sections":1,"./icon":5,"preact":7}],7:[function(require,module,exports){
!function() {
    'use strict';
    function VNode() {}
    function h(nodeName, attributes) {
        var lastSimple, child, simple, i, children = EMPTY_CHILDREN;
        for (i = arguments.length; i-- > 2; ) stack.push(arguments[i]);
        if (attributes && null != attributes.children) {
            if (!stack.length) stack.push(attributes.children);
            delete attributes.children;
        }
        while (stack.length) if ((child = stack.pop()) && void 0 !== child.pop) for (i = child.length; i--; ) stack.push(child[i]); else {
            if ('boolean' == typeof child) child = null;
            if (simple = 'function' != typeof nodeName) if (null == child) child = ''; else if ('number' == typeof child) child = String(child); else if ('string' != typeof child) simple = !1;
            if (simple && lastSimple) children[children.length - 1] += child; else if (children === EMPTY_CHILDREN) children = [ child ]; else children.push(child);
            lastSimple = simple;
        }
        var p = new VNode();
        p.nodeName = nodeName;
        p.children = children;
        p.attributes = null == attributes ? void 0 : attributes;
        p.key = null == attributes ? void 0 : attributes.key;
        if (void 0 !== options.vnode) options.vnode(p);
        return p;
    }
    function extend(obj, props) {
        for (var i in props) obj[i] = props[i];
        return obj;
    }
    function cloneElement(vnode, props) {
        return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
    }
    function enqueueRender(component) {
        if (!component.__d && (component.__d = !0) && 1 == items.push(component)) (options.debounceRendering || defer)(rerender);
    }
    function rerender() {
        var p, list = items;
        items = [];
        while (p = list.pop()) if (p.__d) renderComponent(p);
    }
    function isSameNodeType(node, vnode, hydrating) {
        if ('string' == typeof vnode || 'number' == typeof vnode) return void 0 !== node.splitText;
        if ('string' == typeof vnode.nodeName) return !node._componentConstructor && isNamedNode(node, vnode.nodeName); else return hydrating || node._componentConstructor === vnode.nodeName;
    }
    function isNamedNode(node, nodeName) {
        return node.__n === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
    }
    function getNodeProps(vnode) {
        var props = extend({}, vnode.attributes);
        props.children = vnode.children;
        var defaultProps = vnode.nodeName.defaultProps;
        if (void 0 !== defaultProps) for (var i in defaultProps) if (void 0 === props[i]) props[i] = defaultProps[i];
        return props;
    }
    function createNode(nodeName, isSvg) {
        var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
        node.__n = nodeName;
        return node;
    }
    function removeNode(node) {
        var parentNode = node.parentNode;
        if (parentNode) parentNode.removeChild(node);
    }
    function setAccessor(node, name, old, value, isSvg) {
        if ('className' === name) name = 'class';
        if ('key' === name) ; else if ('ref' === name) {
            if (old) old(null);
            if (value) value(node);
        } else if ('class' === name && !isSvg) node.className = value || ''; else if ('style' === name) {
            if (!value || 'string' == typeof value || 'string' == typeof old) node.style.cssText = value || '';
            if (value && 'object' == typeof value) {
                if ('string' != typeof old) for (var i in old) if (!(i in value)) node.style[i] = '';
                for (var i in value) node.style[i] = 'number' == typeof value[i] && !1 === IS_NON_DIMENSIONAL.test(i) ? value[i] + 'px' : value[i];
            }
        } else if ('dangerouslySetInnerHTML' === name) {
            if (value) node.innerHTML = value.__html || '';
        } else if ('o' == name[0] && 'n' == name[1]) {
            var useCapture = name !== (name = name.replace(/Capture$/, ''));
            name = name.toLowerCase().substring(2);
            if (value) {
                if (!old) node.addEventListener(name, eventProxy, useCapture);
            } else node.removeEventListener(name, eventProxy, useCapture);
            (node.__l || (node.__l = {}))[name] = value;
        } else if ('list' !== name && 'type' !== name && !isSvg && name in node) {
            setProperty(node, name, null == value ? '' : value);
            if (null == value || !1 === value) node.removeAttribute(name);
        } else {
            var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
            if (null == value || !1 === value) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase()); else node.removeAttribute(name); else if ('function' != typeof value) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value); else node.setAttribute(name, value);
        }
    }
    function setProperty(node, name, value) {
        try {
            node[name] = value;
        } catch (e) {}
    }
    function eventProxy(e) {
        return this.__l[e.type](options.event && options.event(e) || e);
    }
    function flushMounts() {
        var c;
        while (c = mounts.pop()) {
            if (options.afterMount) options.afterMount(c);
            if (c.componentDidMount) c.componentDidMount();
        }
    }
    function diff(dom, vnode, context, mountAll, parent, componentRoot) {
        if (!diffLevel++) {
            isSvgMode = null != parent && void 0 !== parent.ownerSVGElement;
            hydrating = null != dom && !('__preactattr_' in dom);
        }
        var ret = idiff(dom, vnode, context, mountAll, componentRoot);
        if (parent && ret.parentNode !== parent) parent.appendChild(ret);
        if (!--diffLevel) {
            hydrating = !1;
            if (!componentRoot) flushMounts();
        }
        return ret;
    }
    function idiff(dom, vnode, context, mountAll, componentRoot) {
        var out = dom, prevSvgMode = isSvgMode;
        if (null == vnode || 'boolean' == typeof vnode) vnode = '';
        if ('string' == typeof vnode || 'number' == typeof vnode) {
            if (dom && void 0 !== dom.splitText && dom.parentNode && (!dom._component || componentRoot)) {
                if (dom.nodeValue != vnode) dom.nodeValue = vnode;
            } else {
                out = document.createTextNode(vnode);
                if (dom) {
                    if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
                    recollectNodeTree(dom, !0);
                }
            }
            out.__preactattr_ = !0;
            return out;
        }
        var vnodeName = vnode.nodeName;
        if ('function' == typeof vnodeName) return buildComponentFromVNode(dom, vnode, context, mountAll);
        isSvgMode = 'svg' === vnodeName ? !0 : 'foreignObject' === vnodeName ? !1 : isSvgMode;
        vnodeName = String(vnodeName);
        if (!dom || !isNamedNode(dom, vnodeName)) {
            out = createNode(vnodeName, isSvgMode);
            if (dom) {
                while (dom.firstChild) out.appendChild(dom.firstChild);
                if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
                recollectNodeTree(dom, !0);
            }
        }
        var fc = out.firstChild, props = out.__preactattr_, vchildren = vnode.children;
        if (null == props) {
            props = out.__preactattr_ = {};
            for (var a = out.attributes, i = a.length; i--; ) props[a[i].name] = a[i].value;
        }
        if (!hydrating && vchildren && 1 === vchildren.length && 'string' == typeof vchildren[0] && null != fc && void 0 !== fc.splitText && null == fc.nextSibling) {
            if (fc.nodeValue != vchildren[0]) fc.nodeValue = vchildren[0];
        } else if (vchildren && vchildren.length || null != fc) innerDiffNode(out, vchildren, context, mountAll, hydrating || null != props.dangerouslySetInnerHTML);
        diffAttributes(out, vnode.attributes, props);
        isSvgMode = prevSvgMode;
        return out;
    }
    function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
        var j, c, f, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren ? vchildren.length : 0;
        if (0 !== len) for (var i = 0; i < len; i++) {
            var _child = originalChildren[i], props = _child.__preactattr_, key = vlen && props ? _child._component ? _child._component.__k : props.key : null;
            if (null != key) {
                keyedLen++;
                keyed[key] = _child;
            } else if (props || (void 0 !== _child.splitText ? isHydrating ? _child.nodeValue.trim() : !0 : isHydrating)) children[childrenLen++] = _child;
        }
        if (0 !== vlen) for (var i = 0; i < vlen; i++) {
            vchild = vchildren[i];
            child = null;
            var key = vchild.key;
            if (null != key) {
                if (keyedLen && void 0 !== keyed[key]) {
                    child = keyed[key];
                    keyed[key] = void 0;
                    keyedLen--;
                }
            } else if (!child && min < childrenLen) for (j = min; j < childrenLen; j++) if (void 0 !== children[j] && isSameNodeType(c = children[j], vchild, isHydrating)) {
                child = c;
                children[j] = void 0;
                if (j === childrenLen - 1) childrenLen--;
                if (j === min) min++;
                break;
            }
            child = idiff(child, vchild, context, mountAll);
            f = originalChildren[i];
            if (child && child !== dom && child !== f) if (null == f) dom.appendChild(child); else if (child === f.nextSibling) removeNode(f); else dom.insertBefore(child, f);
        }
        if (keyedLen) for (var i in keyed) if (void 0 !== keyed[i]) recollectNodeTree(keyed[i], !1);
        while (min <= childrenLen) if (void 0 !== (child = children[childrenLen--])) recollectNodeTree(child, !1);
    }
    function recollectNodeTree(node, unmountOnly) {
        var component = node._component;
        if (component) unmountComponent(component); else {
            if (null != node.__preactattr_ && node.__preactattr_.ref) node.__preactattr_.ref(null);
            if (!1 === unmountOnly || null == node.__preactattr_) removeNode(node);
            removeChildren(node);
        }
    }
    function removeChildren(node) {
        node = node.lastChild;
        while (node) {
            var next = node.previousSibling;
            recollectNodeTree(node, !0);
            node = next;
        }
    }
    function diffAttributes(dom, attrs, old) {
        var name;
        for (name in old) if ((!attrs || null == attrs[name]) && null != old[name]) setAccessor(dom, name, old[name], old[name] = void 0, isSvgMode);
        for (name in attrs) if (!('children' === name || 'innerHTML' === name || name in old && attrs[name] === ('value' === name || 'checked' === name ? dom[name] : old[name]))) setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
    function collectComponent(component) {
        var name = component.constructor.name;
        (components[name] || (components[name] = [])).push(component);
    }
    function createComponent(Ctor, props, context) {
        var inst, list = components[Ctor.name];
        if (Ctor.prototype && Ctor.prototype.render) {
            inst = new Ctor(props, context);
            Component.call(inst, props, context);
        } else {
            inst = new Component(props, context);
            inst.constructor = Ctor;
            inst.render = doRender;
        }
        if (list) for (var i = list.length; i--; ) if (list[i].constructor === Ctor) {
            inst.__b = list[i].__b;
            list.splice(i, 1);
            break;
        }
        return inst;
    }
    function doRender(props, state, context) {
        return this.constructor(props, context);
    }
    function setComponentProps(component, props, opts, context, mountAll) {
        if (!component.__x) {
            component.__x = !0;
            if (component.__r = props.ref) delete props.ref;
            if (component.__k = props.key) delete props.key;
            if (!component.base || mountAll) {
                if (component.componentWillMount) component.componentWillMount();
            } else if (component.componentWillReceiveProps) component.componentWillReceiveProps(props, context);
            if (context && context !== component.context) {
                if (!component.__c) component.__c = component.context;
                component.context = context;
            }
            if (!component.__p) component.__p = component.props;
            component.props = props;
            component.__x = !1;
            if (0 !== opts) if (1 === opts || !1 !== options.syncComponentUpdates || !component.base) renderComponent(component, 1, mountAll); else enqueueRender(component);
            if (component.__r) component.__r(component);
        }
    }
    function renderComponent(component, opts, mountAll, isChild) {
        if (!component.__x) {
            var rendered, inst, cbase, props = component.props, state = component.state, context = component.context, previousProps = component.__p || props, previousState = component.__s || state, previousContext = component.__c || context, isUpdate = component.base, nextBase = component.__b, initialBase = isUpdate || nextBase, initialChildComponent = component._component, skip = !1;
            if (isUpdate) {
                component.props = previousProps;
                component.state = previousState;
                component.context = previousContext;
                if (2 !== opts && component.shouldComponentUpdate && !1 === component.shouldComponentUpdate(props, state, context)) skip = !0; else if (component.componentWillUpdate) component.componentWillUpdate(props, state, context);
                component.props = props;
                component.state = state;
                component.context = context;
            }
            component.__p = component.__s = component.__c = component.__b = null;
            component.__d = !1;
            if (!skip) {
                rendered = component.render(props, state, context);
                if (component.getChildContext) context = extend(extend({}, context), component.getChildContext());
                var toUnmount, base, childComponent = rendered && rendered.nodeName;
                if ('function' == typeof childComponent) {
                    var childProps = getNodeProps(rendered);
                    inst = initialChildComponent;
                    if (inst && inst.constructor === childComponent && childProps.key == inst.__k) setComponentProps(inst, childProps, 1, context, !1); else {
                        toUnmount = inst;
                        component._component = inst = createComponent(childComponent, childProps, context);
                        inst.__b = inst.__b || nextBase;
                        inst.__u = component;
                        setComponentProps(inst, childProps, 0, context, !1);
                        renderComponent(inst, 1, mountAll, !0);
                    }
                    base = inst.base;
                } else {
                    cbase = initialBase;
                    toUnmount = initialChildComponent;
                    if (toUnmount) cbase = component._component = null;
                    if (initialBase || 1 === opts) {
                        if (cbase) cbase._component = null;
                        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, !0);
                    }
                }
                if (initialBase && base !== initialBase && inst !== initialChildComponent) {
                    var baseParent = initialBase.parentNode;
                    if (baseParent && base !== baseParent) {
                        baseParent.replaceChild(base, initialBase);
                        if (!toUnmount) {
                            initialBase._component = null;
                            recollectNodeTree(initialBase, !1);
                        }
                    }
                }
                if (toUnmount) unmountComponent(toUnmount);
                component.base = base;
                if (base && !isChild) {
                    var componentRef = component, t = component;
                    while (t = t.__u) (componentRef = t).base = base;
                    base._component = componentRef;
                    base._componentConstructor = componentRef.constructor;
                }
            }
            if (!isUpdate || mountAll) mounts.unshift(component); else if (!skip) {
                if (component.componentDidUpdate) component.componentDidUpdate(previousProps, previousState, previousContext);
                if (options.afterUpdate) options.afterUpdate(component);
            }
            if (null != component.__h) while (component.__h.length) component.__h.pop().call(component);
            if (!diffLevel && !isChild) flushMounts();
        }
    }
    function buildComponentFromVNode(dom, vnode, context, mountAll) {
        var c = dom && dom._component, originalComponent = c, oldDom = dom, isDirectOwner = c && dom._componentConstructor === vnode.nodeName, isOwner = isDirectOwner, props = getNodeProps(vnode);
        while (c && !isOwner && (c = c.__u)) isOwner = c.constructor === vnode.nodeName;
        if (c && isOwner && (!mountAll || c._component)) {
            setComponentProps(c, props, 3, context, mountAll);
            dom = c.base;
        } else {
            if (originalComponent && !isDirectOwner) {
                unmountComponent(originalComponent);
                dom = oldDom = null;
            }
            c = createComponent(vnode.nodeName, props, context);
            if (dom && !c.__b) {
                c.__b = dom;
                oldDom = null;
            }
            setComponentProps(c, props, 1, context, mountAll);
            dom = c.base;
            if (oldDom && dom !== oldDom) {
                oldDom._component = null;
                recollectNodeTree(oldDom, !1);
            }
        }
        return dom;
    }
    function unmountComponent(component) {
        if (options.beforeUnmount) options.beforeUnmount(component);
        var base = component.base;
        component.__x = !0;
        if (component.componentWillUnmount) component.componentWillUnmount();
        component.base = null;
        var inner = component._component;
        if (inner) unmountComponent(inner); else if (base) {
            if (base.__preactattr_ && base.__preactattr_.ref) base.__preactattr_.ref(null);
            component.__b = base;
            removeNode(base);
            collectComponent(component);
            removeChildren(base);
        }
        if (component.__r) component.__r(null);
    }
    function Component(props, context) {
        this.__d = !0;
        this.context = context;
        this.props = props;
        this.state = this.state || {};
    }
    function render(vnode, parent, merge) {
        return diff(merge, vnode, {}, !1, parent, !1);
    }
    var options = {};
    var stack = [];
    var EMPTY_CHILDREN = [];
    var defer = 'function' == typeof Promise ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;
    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
    var items = [];
    var mounts = [];
    var diffLevel = 0;
    var isSvgMode = !1;
    var hydrating = !1;
    var components = {};
    extend(Component.prototype, {
        setState: function(state, callback) {
            var s = this.state;
            if (!this.__s) this.__s = extend({}, s);
            extend(s, 'function' == typeof state ? state(s, this.props) : state);
            if (callback) (this.__h = this.__h || []).push(callback);
            enqueueRender(this);
        },
        forceUpdate: function(callback) {
            if (callback) (this.__h = this.__h || []).push(callback);
            renderComponent(this, 2);
        },
        render: function() {}
    });
    var preact = {
        h: h,
        createElement: h,
        cloneElement: cloneElement,
        Component: Component,
        render: render,
        rerender: rerender,
        options: options
    };
    if ('undefined' != typeof module) module.exports = preact; else self.preact = preact;
}();

},{}],8:[function(require,module,exports){
var relativeDate = (function(undefined){

  var SECOND = 1000,
      MINUTE = 60 * SECOND,
      HOUR = 60 * MINUTE,
      DAY = 24 * HOUR,
      WEEK = 7 * DAY,
      YEAR = DAY * 365,
      MONTH = YEAR / 12;

  var formats = [
    [ 0.7 * MINUTE, 'just now' ],
    [ 1.5 * MINUTE, 'a minute ago' ],
    [ 60 * MINUTE, 'minutes ago', MINUTE ],
    [ 1.5 * HOUR, 'an hour ago' ],
    [ DAY, 'hours ago', HOUR ],
    [ 2 * DAY, 'yesterday' ],
    [ 7 * DAY, 'days ago', DAY ],
    [ 1.5 * WEEK, 'a week ago'],
    [ MONTH, 'weeks ago', WEEK ],
    [ 1.5 * MONTH, 'a month ago' ],
    [ YEAR, 'months ago', MONTH ],
    [ 1.5 * YEAR, 'a year ago' ],
    [ Number.MAX_VALUE, 'years ago', YEAR ]
  ];

  function relativeDate(input,reference){
    !reference && ( reference = (new Date).getTime() );
    reference instanceof Date && ( reference = reference.getTime() );
    input instanceof Date && ( input = input.getTime() );
    
    var delta = reference - input,
        format, i, len;

    for(i = -1, len=formats.length; ++i < len; ){
      format = formats[i];
      if(delta < format[0]){
        return format[2] == undefined ? format[1] : Math.round(delta/format[2]) + ' ' + format[1];
      }
    };
  }

  return relativeDate;

})();

if(typeof module != 'undefined' && module.exports){
  module.exports = relativeDate;
}

},{}],9:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _tabs = require("../safari/tabs");

var _tabs2 = _interopRequireDefault(_tabs);

var _icons = require("../safari/icons");

var _dialog = require("../popup/dialog");

var _dialog2 = _interopRequireDefault(_dialog);

var _icon = require("../popup/icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Popup = function (_Component) {
  _inherits(Popup, _Component);

  function Popup(props) {
    _classCallCheck(this, Popup);

    var _this = _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).call(this, props));

    window.Popover = _this;

    _this.updatePopover();
    safari.extension.globalPage.contentWindow.listenForPopover();
    return _this;
  }

  _createClass(Popup, [{
    key: "updatePopover",
    value: function updatePopover() {
      var _this2 = this;

      this.setState({
        isLoggedIn: !!localStorage['token']
      });

      var tab = _tabs2.default.current();
      this.setState({
        url: tab.url,
        title: tab.title
      });

      this.onStartLoading();
      safari.extension.globalPage.contentWindow.getLike(tab.url).then(function (resp) {
        _this2.onStopLoading();
        if (resp) {
          _this2.setState({
            like: resp.like,
            isLiked: !!resp.like
          });
        } else {
          _this2.setState({
            like: null,
            isLiked: false
          });
        }
      });
    }
  }, {
    key: "resizePopover",
    value: function resizePopover() {
      safari.self.height = document.body.clientHeight;
    }
  }, {
    key: "onStartLoading",
    value: function onStartLoading() {
      this.setState({
        isLoading: true
      });
    }
  }, {
    key: "onStopLoading",
    value: function onStopLoading() {
      var _this3 = this;

      setTimeout(function () {
        _this3.setState({
          isLoading: false
        });
      }, 500);
    }
  }, {
    key: "onError",
    value: function onError(error) {
      var e401 = error.message.indexOf('401') > -1;
      if (e401) {
        return this.setState({
          isLoggedIn: false,
          isLiked: false
        });
      }

      this.setState({
        error: error
      });
    }
  }, {
    key: "updateActionIcon",
    value: function updateActionIcon() {
      if (this.state.isLiked) {
        (0, _icons.setAsLiked)();
      } else {
        (0, _icons.setAsNotLiked)();
      }
    }
  }, {
    key: "close",
    value: function close() {
      safari.self.hide();
    }
  }, {
    key: "like",
    value: function like() {
      var _this4 = this;

      if (!this.state.isLoggedIn) {
        _tabs2.default.create('https://getkozmos.com/login');
      }

      safari.extension.globalPage.contentWindow.like(this.state.url, this.state.title).then(function (resp) {
        if (resp.error) return _this4.setState({ error: resp.error });

        _this4.setState({
          like: resp.like,
          isLiked: !!resp.like,
          isJustLiked: true
        });

        _this4.updateActionIcon();
      });
    }
  }, {
    key: "unlike",
    value: function unlike() {
      var _this5 = this;

      safari.extension.globalPage.contentWindow.unlike(this.state.url).then(function (resp) {
        if (resp.error) return _this5.setState({ error: resp.error });

        _this5.setState({
          like: null,
          isLiked: false
        });

        _this5.updateActionIcon();
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.resizePopover();
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      return (0, _preact.h)(
        "div",
        { className: "safari container" },
        (0, _preact.h)(
          "h1",
          null,
          (0, _preact.h)(
            "a",
            { title: "Open Kozmos", target: "_blank", href: "https://getkozmos.com", onclick: function onclick() {
                _tabs2.default.create('https://getkozmos.com');safari.self.hide();
              } },
            "kozmos"
          ),
          (0, _preact.h)(_icon.Icon, { name: "external", onclick: function onclick() {
              _tabs2.default.create('https://getkozmos.com');safari.self.hide();
            }, title: "Open Your Bookmarks" })
        ),
        (0, _preact.h)(_dialog2.default, { isLiked: this.state.isLiked,
          record: this.state.like,
          isJustLiked: this.state.isJustLiked,
          isLoggedIn: this.state.isLoggedIn,
          unlike: function unlike() {
            return _this6.unlike();
          },
          like: function like() {
            return _this6.like();
          },
          onStartLoading: function onStartLoading() {
            return _this6.onStartLoading();
          },
          onStopLoading: function onStopLoading() {
            return _this6.onStopLoading();
          },
          onSync: function onSync() {
            return _this6.onSync();
          },
          onError: function onError(err) {
            return _this6.onError(err);
          }
        }),
        this.renderStatus()
      );
    }
  }, {
    key: "renderStatus",
    value: function renderStatus() {
      return (0, _preact.h)(
        "div",
        { className: "status" },
        this.renderStatusIcon()
      );
    }
  }, {
    key: "renderStatusIcon",
    value: function renderStatusIcon() {
      var _this7 = this;

      if (this.state.isLoading) {
        return (0, _preact.h)(_icon.Icon, { name: "clock", title: "Connecting to Kozmos right now" });
      }

      if (this.state.error) {
        return (0, _preact.h)(
          "a",
          { href: 'mailto:azer@getkozmos.com?subject=Extension+Error&body=Stack trace:' + encodeURI(this.state.error.stack) },
          (0, _preact.h)(_icon.Icon, { name: "alert", title: "An error occurred. Click here to report it.", onclick: function onclick() {
              return _this7.reportError();
            }, stroke: "2" })
        );
      }
    }
  }]);

  return Popup;
}(_preact.Component);

document.addEventListener("DOMContentLoaded", function () {
  (0, _preact.render)((0, _preact.h)(Popup, null), document.body);
});

},{"../popup/dialog":11,"../popup/icon":5,"../safari/icons":15,"../safari/tabs":16,"preact":7}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _icon = require("./icon");

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_Component) {
  _inherits(Button, _Component);

  function Button() {
    _classCallCheck(this, Button);

    return _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).apply(this, arguments));
  }

  _createClass(Button, [{
    key: "render",
    value: function render() {
      return (0, _preact.h)(
        "div",
        { className: "buttons" },
        (0, _preact.h)(
          "div",
          { className: "button", title: this.props.title, onClick: this.props.onClick },
          this.props.icon ? (0, _preact.h)(_icon2.default, { name: this.props.icon }) : null,
          this.props.children
        )
      );
    }
  }]);

  return Button;
}(_preact.Component);

exports.default = Button;

},{"./icon":5,"preact":7}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _button = require("./button");

var _button2 = _interopRequireDefault(_button);

var _likedDialog = require("./liked-dialog");

var _likedDialog2 = _interopRequireDefault(_likedDialog);

var _input = require("./input");

var _input2 = _interopRequireDefault(_input);

var _settings = require("../newtab/settings");

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Check to see if the extension is running on Chrome or Safari
 * and require the respective tabs module
 */
var tabs = void 0;
if (typeof chrome !== "undefined") {
  tabs = require("../chrome/tabs");
} else if (typeof safari !== "undefined") {
  tabs = require("../safari/tabs");
}

var Dialog = function (_Component) {
  _inherits(Dialog, _Component);

  function Dialog() {
    _classCallCheck(this, Dialog);

    return _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).apply(this, arguments));
  }

  _createClass(Dialog, [{
    key: "search",
    value: function search(value) {
      tabs.create('https://getkozmos.com/search?q=' + encodeURI(value));
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.isLiked) {
        return this.renderLiked();
      } else if (this.props.isLoggedIn) {
        return this.renderLike();
      } else {
        return this.renderLogin();
      }
    }
  }, {
    key: "renderLogin",
    value: function renderLogin() {
      return (0, _preact.h)(
        "div",
        { className: "dialog login" },
        (0, _preact.h)(
          "div",
          { className: "desc" },
          "Looks like you haven't logged in yet."
        ),
        (0, _preact.h)(
          _button2.default,
          { title: "Login Kozmos", onClick: function onClick() {
              return tabs.create('https://getkozmos.com/login');
            } },
          "Login"
        )
      );
    }
  }, {
    key: "renderLiked",
    value: function renderLiked() {
      return (0, _preact.h)(_likedDialog2.default, { isJustLiked: this.state.isJustLiked,
        like: this.props.record,
        unlike: this.props.unlike,
        onStartLoading: this.props.onStartLoading,
        onStopLoading: this.props.onStopLoading,
        onSync: this.props.onSync,
        onError: this.props.onError
      });
    }
  }, {
    key: "renderLike",
    value: function renderLike() {
      var _this2 = this;

      return (0, _preact.h)(
        "div",
        { className: "dialog like" },
        (0, _preact.h)(_input2.default, { onPressEnter: function onPressEnter(value) {
            return _this2.search(value);
          }, icon: "search", placeholder: "Search Your Bookmarks", iconStroke: "3" }),
        (0, _preact.h)(
          "div",
          { className: "desc" },
          "You haven't liked this page yet."
        ),
        (0, _preact.h)(
          _button2.default,
          { title: "Click to add this page to your likes", icon: "heart", onClick: function onClick() {
              return _this2.props.like();
            } },
          "Like It"
        )
      );
    }
  }]);

  return Dialog;
}(_preact.Component);

exports.default = Dialog;

},{"../chrome/tabs":2,"../newtab/settings":6,"../safari/tabs":16,"./button":10,"./input":12,"./liked-dialog":13,"preact":7}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _icon = require("./icon");

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Input = function (_Component) {
  _inherits(Input, _Component);

  function Input(props) {
    _classCallCheck(this, Input);

    var _this = _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).call(this, props));

    _this.setState({
      value: "",
      placeholder: _this.props.placeholder
    });
    return _this;
  }

  _createClass(Input, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.autofocus) this.focus();
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextState.value !== this.state.value;
    }
  }, {
    key: "focus",
    value: function focus() {
      this.el.focus();
    }
  }, {
    key: "onFocus",
    value: function onFocus(e) {
      this.setState({
        placeholder: ""
      });
    }
  }, {
    key: "onBlur",
    value: function onBlur(e) {
      this.setState({
        placeholder: this.props.placeholder
      });
    }
  }, {
    key: "onChange",
    value: function onChange(e) {
      this.setState({
        value: e.target.value
      });

      if (this.props.onChange) {
        this.props.onChange(this.state.value);
      }
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp(e) {
      var value = e.target.value;
      this.onChange(e);

      if (e.keyCode === 27) {
        this.setState({ value: "" });

        if (this.props.onPressEsc) {
          return this.props.onPressEsc(value);
        }
      }

      if (e.keyCode === 13 && this.props.onPressEnter) {
        this.setState({ value: "" });
        return this.props.onPressEnter(value);
      }

      if (e.keyCode === 188 && this.props.onTypeComma) {
        this.setState({ value: "" });
        return this.props.onPressEnter(value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this,
          _h;

      return (0, _preact.h)(
        "div",
        { className: "input" },
        this.props.icon ? (0, _preact.h)(_icon2.default, { name: this.props.icon, stroke: this.props.iconStroke }) : null,
        (0, _preact.h)("input", (_h = { type: "text/css",
          placeholder: this.state.placeholder,
          onChange: function onChange(e) {
            return _this2.onChange(e);
          },
          onKeyUp: function onKeyUp(e) {
            return _this2.onKeyUp(e);
          },
          onFocus: function onFocus(e) {
            return _this2.onFocus(e);
          },
          onBlur: function onBlur(e) {
            return _this2.onBlur(e);
          },
          value: this.state.value,
          ref: function ref(input) {
            return _this2.el = input;
          }
        }, _defineProperty(_h, "type", this.props.type || "text"), _defineProperty(_h, "autocomplete", this.props.autocomplete === false ? "off" : "on"), _h))
      );
    }
  }]);

  return Input;
}(_preact.Component);

exports.default = Input;

},{"./icon":5,"preact":7}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _taggingForm = require("./tagging-form");

var _taggingForm2 = _interopRequireDefault(_taggingForm);

var _relativeDate = require("relative-date");

var _relativeDate2 = _interopRequireDefault(_relativeDate);

var _icon = require("./icon");

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LikedDialog = function (_Component) {
  _inherits(LikedDialog, _Component);

  function LikedDialog(props) {
    _classCallCheck(this, LikedDialog);

    var _this = _possibleConstructorReturn(this, (LikedDialog.__proto__ || Object.getPrototypeOf(LikedDialog)).call(this, props));

    _this.reset(props);
    return _this;
  }

  _createClass(LikedDialog, [{
    key: "reset",
    value: function reset(props) {
      this.setState({
        isOnline: navigator.onLine,
        isJustLiked: props.isJustLiked,
        like: props.like
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return (0, _preact.h)(
        "div",
        { className: "dialog" },
        this.props.isJustLiked ? (0, _preact.h)(
          "h2",
          null,
          "Done."
        ) : null,
        this.state.isOnline ? this.renderOnlineBody() : this.renderOfflineBody(),
        (0, _preact.h)(
          "div",
          { className: "footer" },
          (0, _preact.h)(_icon2.default, { name: "trash", title: "Unlike This Page", onClick: function onClick() {
              return _this2.props.unlike();
            } })
        )
      );
    }
  }, {
    key: "renderOfflineBody",
    value: function renderOfflineBody() {
      return (0, _preact.h)(
        "div",
        { className: "offline" },
        (0, _preact.h)(
          "div",
          { className: "desc" },
          this.renderLikedAgo(),
          (0, _preact.h)("br", null),
          (0, _preact.h)("br", null),
          "You're currently offline but it's ok.",
          (0, _preact.h)("br", null),
          "The changes will sync when you connect."
        )
      );
    }
  }, {
    key: "renderOnlineBody",
    value: function renderOnlineBody() {
      return (0, _preact.h)(
        "div",
        { className: "online" },
        (0, _preact.h)(
          "div",
          { className: "desc" },
          this.props.isJustLiked ? "You can add some tags, too:" : this.renderLikedAgo()
        ),
        (0, _preact.h)(_taggingForm2.default, { like: this.props.like,
          onAddTag: this.props.onAddTag,
          onRemoveTag: this.props.onRemoveTag,
          onStartLoading: this.props.onStartLoading,
          onStopLoading: this.props.onStopLoading,
          onSync: this.props.onSync,
          onError: this.props.onError
        })
      );
    }
  }, {
    key: "renderLikedAgo",
    value: function renderLikedAgo() {
      return (0, _preact.h)(
        "div",
        { className: "liked-ago" },
        "You liked this page ",
        (0, _relativeDate2.default)(this.props.like.likedAt),
        "."
      );
    }
  }]);

  return LikedDialog;
}(_preact.Component);

exports.default = LikedDialog;

},{"./icon":5,"./tagging-form":14,"preact":7,"relative-date":8}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _input = require("./input");

var _input2 = _interopRequireDefault(_input);

var _icon = require("./icon");

var _icon2 = _interopRequireDefault(_icon);

var _api = require("../lib/api");

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TaggingForm = function (_Component) {
  _inherits(TaggingForm, _Component);

  function TaggingForm(props) {
    _classCallCheck(this, TaggingForm);

    var _this = _possibleConstructorReturn(this, (TaggingForm.__proto__ || Object.getPrototypeOf(TaggingForm)).call(this, props));

    _this.load();
    _this.setState({
      isLoading: true,
      tags: []
    });
    return _this;
  }

  _createClass(TaggingForm, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      if (this.props.like.url !== props.like.url) {
        this.setState({
          isLoading: true,
          tags: []
        });
        this.load();
      }
    }
  }, {
    key: "load",
    value: function load() {
      var _this2 = this;

      this.props.onStartLoading();

      _api2.default.post("/api/like-tags", { "url": this.props.like.url }, function (err, resp) {
        _this2.props.onStopLoading();

        if (err) return _this2.props.onError(err);

        _this2.setState({
          tags: resp.tags,
          isLoading: false
        });
      });
    }
  }, {
    key: "addTag",
    value: function addTag(tag) {
      var _this3 = this;

      this.props.onStartLoading();

      var tags = tag.split(/,\s*/);

      _api2.default.put('/api/like-tags', { tags: tags, url: this.props.like.url }, function (err) {
        _this3.props.onStopLoading();
        if (err) return _this3.props.onError(err);
        _this3.load();
      });

      var copy = this.state.tags.slice();
      copy.push.apply(copy, tags);
      this.setState({ tags: copy });
    }
  }, {
    key: "deleteTag",
    value: function deleteTag(tag) {
      var _this4 = this;

      this.props.onStartLoading();

      _api2.default.delete('/api/like-tags', { tag: tag, url: this.props.like.url }, function (err) {
        _this4.props.onStopLoading();
        if (err) return _this4.props.onError(err);
        _this4.load();
      });

      var copy = this.state.tags.slice();
      var index = -1;

      var i = copy.length;
      while (i--) {
        if (copy[i] === tag || copy[i].name == tag) {
          index = i;
          break;
        }
      }

      if (index > -1) {
        copy.splice(index, 1);
        this.setState({ tags: copy });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      return (0, _preact.h)(
        "div",
        { className: "tagging-form" },
        (0, _preact.h)(_input2.default, { onPressEnter: function onPressEnter(value) {
            return _this5.addTag(value);
          }, onTypeComma: function onTypeComma(value) {
            return _this5.addTag(value);
          }, icon: "tag", placeholder: "Type a tag & hit enter", autofocus: true }),
        this.renderTags()
      );
    }
  }, {
    key: "renderTags",
    value: function renderTags() {
      var _this6 = this;

      if (this.state.tags.length == 0) return;

      return (0, _preact.h)(
        "div",
        { className: "tags" },
        this.state.tags.map(function (t) {
          return _this6.renderTag(t);
        })
      );
    }
  }, {
    key: "renderTag",
    value: function renderTag(tag) {
      var _this7 = this;

      if (typeof tag === 'string') {
        tag = { name: tag };
      }

      return (0, _preact.h)(
        "div",
        { className: "tag" },
        (0, _preact.h)(_icon2.default, { name: "close", stroke: "5", title: "Delete \"" + tag.name + "\"", onclick: function onclick() {
            return _this7.deleteTag(tag.name);
          } }),
        tag.name
      );
    }
  }]);

  return TaggingForm;
}(_preact.Component);

exports.default = TaggingForm;

},{"../lib/api":4,"./icon":5,"./input":12,"preact":7}],15:[function(require,module,exports){
'use strict';

module.exports = {
  setAsLiked: setAsLiked,
  setAsNotLiked: setAsNotLiked,
  setAsLoading: setAsLoading
};

function setAsLiked() {
  setIcon(safari.extension.baseURI + 'images/heart-icon-liked.png');
  setTooltip("Unlike this page");
}

function setAsNotLiked() {
  setIcon(safari.extension.baseURI + 'images/heart-icon.png');
  setTooltip("Like This Page");
}

function setAsLoading() {
  setIcon(safari.extension.baseURI + 'images/heart-icon-loading.png');
  setTooltip("Connecting to Kozmos...");
}

function setIcon(src) {
  safari.extension.toolbarItems.forEach(function (toolbar) {
    toolbar.image = src;
  });
}

function setTooltip(text) {
  safari.extension.toolbarItems.forEach(function (toolbar) {
    toolbar.toolTip = text;
  });
}

},{}],16:[function(require,module,exports){
"use strict";

var lastURL = '';

module.exports = {
  create: create,
  current: current,
  onUpdated: onUpdated
};

function create(url) {
  safari.application.activeBrowserWindow.openTab().url = url;
  safari.self.hide();
}

function current() {
  return safari.application.activeBrowserWindow.activeTab;
}

function onUpdated(callback) {
  safari.application.addEventListener("activate", onchange, true);
  safari.application.addEventListener("beforeNavigate", onchange, true);
  safari.application.addEventListener("navigate", onchange, true);

  check();

  function onchange(event) {
    if (current().url === lastURL) return;
    lastURL = current().url;
    callback();
  }

  function check() {
    onchange();
    setTimeout(check, 500);
  }
}

},{}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaHJvbWUvc2V0dGluZ3Mtc2VjdGlvbnMuanNvbiIsImNocm9tZS90YWJzLmpzIiwiY29uZmlnLmpzb24iLCJsaWIvYXBpLmpzIiwibmV3dGFiL2ljb24uanMiLCJuZXd0YWIvc2V0dGluZ3MuanMiLCJub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0LmpzIiwibm9kZV9tb2R1bGVzL3JlbGF0aXZlLWRhdGUvbGliL3JlbGF0aXZlLWRhdGUuanMiLCJwb3B1cC1zYWZhcmkvcG9wdXAuanMiLCJwb3B1cC9idXR0b24uanMiLCJwb3B1cC9kaWFsb2cuanMiLCJwb3B1cC9pbnB1dC5qcyIsInBvcHVwL2xpa2VkLWRpYWxvZy5qcyIsInBvcHVwL3RhZ2dpbmctZm9ybS5qcyIsInNhZmFyaS9pY29ucy5qcyIsInNhZmFyaS90YWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3Q0EsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsZ0JBRGU7QUFFZixrQkFGZTtBQUdmO0FBSGUsQ0FBakI7O0FBTUEsU0FBUyxNQUFULENBQWlCLEdBQWpCLEVBQXNCO0FBQ3BCLFNBQU8sSUFBUCxDQUFZLE1BQVosQ0FBbUIsRUFBRSxLQUFLLEdBQVAsRUFBbkI7QUFDRDs7QUFFRCxTQUFTLE9BQVQsQ0FBa0IsUUFBbEIsRUFBNEI7QUFDMUIsU0FBTyxJQUFQLENBQVksS0FBWixD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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TUFBVCxDQUFpQixHQUFqQixFQUFzQjtBQUNwQixTQUFPLFdBQVAsQ0FBbUIsbUJBQW5CLENBQXVDLE9BQXZDLEdBQWlELEdBQWpELEdBQXVELEdBQXZEO0FBQ0EsU0FBTyxJQUFQLENBQVksSUFBWjtBQUNEOztBQUVELFNBQVMsT0FBVCxHQUFvQjtBQUNsQixTQUFPLE9BQU8sV0FBUCxDQUFtQixtQkFBbkIsQ0FBdUMsU0FBOUM7QUFDRDs7QUFFRCxTQUFTLFNBQVQsQ0FBb0IsUUFBcEIsRUFBOEI7QUFDNUIsU0FBTyxXQUFQLENBQW1CLGdCQUFuQixDQUFvQyxVQUFwQyxFQUFnRCxRQUFoRCxFQUEwRCxJQUExRDtBQUNBLFNBQU8sV0FBUCxDQUFtQixnQkFBbkIsQ0FBb0MsZ0JBQXBDLEVBQXNELFFBQXRELEVBQWdFLElBQWhFO0FBQ0EsU0FBTyxXQUFQLENBQW1CLGdCQUFuQixDQUFvQyxVQUFwQyxFQUFnRCxRQUFoRCxFQUEwRCxJQUExRDs7QUFFQTs7QUFFQSxXQUFTLFFBQVQsQ0FBbUIsS0FBbkIsRUFBMEI7QUFDeEIsUUFBSSxVQUFVLEdBQVYsS0FBa0IsT0FBdEIsRUFBK0I7QUFDL0IsY0FBVSxVQUFVLEdBQXBCO0FBQ0E7QUFDRDs7QUFFRCxXQUFTLEtBQVQsR0FBa0I7QUFDaEI7QUFDQSxlQUFXLEtBQVgsRUFBa0IsR0FBbEI7QUFDRDtBQUNGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHtcbiAgICBrZXk6IFwib25lQ2xpY2tMaWtlXCIsXG4gICAgdGl0bGU6IFwiT25lLWNsaWNrIGJvb2ttYXJraW5nXCIsXG4gICAgZGVzYzogXCJIZWFydCBidXR0b24gd2lsbCBpbW1lZGlhdGVseSBib29rbWFyayB3aGVuIGNsaWNrZWQuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHBvcHVwOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwicmVjZW50Qm9va21hcmtzRmlyc3RcIixcbiAgICB0aXRsZTogXCJSZWNlbnQgQm9va21hcmtzIEZpcnN0XCIsXG4gICAgZGVzYzogXCJNb3ZlIFJlY2VudCBCb29rbWFya3MgT3ZlciBGcmVxdWVudGx5IFZpc2l0ZWRcIixcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9LFxuICB7XG4gICAga2V5OiBcIm1pbmltYWxNb2RlXCIsXG4gICAgdGl0bGU6IFwiRW5hYmxlIE1pbmltYWwgTW9kZVwiLFxuICAgIGRlc2M6IFwiSGlkZSBtYWpvcml0eSBvZiB0aGUgaW50ZXJmYWNlIHVudGlsIHVzZXIgZm9jdXNlcy5cIixcbiAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgbmV3dGFiOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwic2hvd1dhbGxwYXBlclwiLFxuICAgIHRpdGxlOiBcIlNob3cgV2FsbHBhcGVyXCIsXG4gICAgZGVzYzogXCJHZXQgYSBuZXcgYmVhdXRpZnVsIHBob3RvIGluIHlvdXIgbmV3IHRhYiBldmVyeSBkYXkuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9LFxuICB7XG4gICAga2V5OiBcImVuYWJsZUdyZWV0aW5nXCIsXG4gICAgdGl0bGU6IFwiU2hvdyBncmVldGluZyAmIHRpbWVcIixcbiAgICBkZXNjOiBcIlNlZSB5b3VyIG5hbWUsIGFuZCBhIG5pY2UgY2xvY2suXCIsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBuZXd0YWI6IHRydWVcbiAgfSxcbiAge1xuICAgIGtleTogXCJlbmFibGVOZXdUYWJcIixcbiAgICB0aXRsZTogXCJFbmFibGUgTmV3IFRhYiBJbnRlcmZhY2VcIixcbiAgICBkZXNjOiBcIkZhc3RlciBhbmQgZWFzaWVyIHNlYXJjaCBpbnRlcmZhY2UuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHBvcHVwOiB0cnVlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlLFxuICBjdXJyZW50LFxuICBvblVwZGF0ZWRcbn1cblxuZnVuY3Rpb24gY3JlYXRlICh1cmwpIHtcbiAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiB1cmwgfSlcbn1cblxuZnVuY3Rpb24gY3VycmVudCAoY2FsbGJhY2spIHtcbiAgY2hyb21lLnRhYnMucXVlcnkoeyAnYWN0aXZlJzogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCBmdW5jdGlvbiAodGFicykge1xuICAgIGlmICh0YWJzWzBdKSBjYWxsYmFjayh1bmRlZmluZWQsIHRhYnNbMF0pO1xuXG4gICAgY2hyb21lLnRhYnMucXVlcnkoeyAnYWN0aXZlJzogdHJ1ZSB9LCBmdW5jdGlvbiAodGFicykge1xuICAgICAgY2FsbGJhY2sodW5kZWZpbmVkLCB0YWJzWzBdKTtcbiAgICB9KVxuICB9KTtcbn1cblxuXG5mdW5jdGlvbiBvblVwZGF0ZWQgKGNhbGxiYWNrKSB7XG4gIGNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcihjYWxsYmFjaylcbiAgY2hyb21lLnRhYnMub25BY3RpdmF0ZWQuYWRkTGlzdGVuZXIoY2FsbGJhY2spXG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwiaG9zdFwiOiBcImh0dHBzOi8vZ2V0a296bW9zLmNvbVwiXG59XG4iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZW5kSlNPTixcbiAgZ2V0LFxuICBwb3N0LFxuICBwdXQsXG4gIGRlbGV0ZTogZGVsZXRlRm5cbn1cblxuZnVuY3Rpb24gc2VuZEpTT04gKG1ldGhvZCwgdXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZVsndG9rZW4nXVxuXG4gIGlmICghdG9rZW4pIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ0xvZ2luIHJlcXVpcmVkICg0MDEpLicpKVxuXG4gIHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHhtbGh0dHAub3BlbihtZXRob2QsIGNvbmZpZy5ob3N0ICsgdXJsKTtcblxuICB4bWxodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJYLUFQSS1Ub2tlblwiLCB0b2tlbilcblxuICBpZiAoZGF0YSkge1xuICAgIHhtbGh0dHAuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgeG1saHR0cC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgfSBlbHNlIHtcbiAgICB4bWxodHRwLnNlbmQobnVsbCk7XG4gIH1cblxuICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoeG1saHR0cC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoeG1saHR0cC5zdGF0dXMgPj0gNTAwKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKHBhcnNlZC5lcnJvcikpXG4gICAgfVxuXG4gICAgaWYgKHhtbGh0dHAuc3RhdHVzID09IDQwMSkge1xuICAgICAgbG9jYWxTdG9yYWdlWyd0b2tlbiddID0gXCJcIlxuICAgICAgbG9jYWxTdG9yYWdlWyduYW1lJ10gPSBcIlwiXG4gICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdVbmF1dGhvcml6ZWQgKDQwMSknKSlcbiAgICB9XG5cbiAgICBpZiAoeG1saHR0cC5zdGF0dXMgPT0gNDA0KSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdOb3QgZm91bmQnKSlcbiAgICB9XG5cbiAgICBpZiAoeG1saHR0cC5zdGF0dXMgPj0gMzAwKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdSZXF1ZXN0IGVycm9yOiAnICsgeG1saHR0cC5zdGF0dXMpKVxuICAgIH1cblxuICAgIHZhciBwYXJzZWQgPSBudWxsXG4gICAgdmFyIGVyciA9IG51bGxcblxuICAgIHRyeSB7XG4gICAgICBwYXJzZWQgPUpTT04ucGFyc2UoeG1saHR0cC5yZXNwb25zZVRleHQpXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoJ0FuIGVycm9yIGhhcHBlbmVkJylcbiAgICB9XG5cbiAgICBjYWxsYmFjayhlcnIsIHBhcnNlZClcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXQgKHVybCwgY2FsbGJhY2spIHtcbiAgc2VuZEpTT04oJ0dFVCcsIHVybCwgbnVsbCwgY2FsbGJhY2spXG59XG5cbmZ1bmN0aW9uIHBvc3QgKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgc2VuZEpTT04oJ1BPU1QnLCB1cmwsIGRhdGEsIGNhbGxiYWNrKVxufVxuXG5mdW5jdGlvbiBwdXQgKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgc2VuZEpTT04oJ1BVVCcsIHVybCwgZGF0YSwgY2FsbGJhY2spXG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUZuICh1cmwsIGRhdGEsIGNhbGxiYWNrKSB7XG4gIHNlbmRKU09OKCdERUxFVEUnLCB1cmwsIGRhdGEsIGNhbGxiYWNrKVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEljb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgbWV0aG9kID0gdGhpc1sncmVuZGVyJyArIHRoaXMucHJvcHMubmFtZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgwLCAxKSArIHRoaXMucHJvcHMubmFtZS5zbGljZSgxKV1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja30gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7dGhpcy5wcm9wcy5uYW1lfWB9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21ldGhvZCA/IG1ldGhvZC5jYWxsKHRoaXMpIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHN0cm9rZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc3Ryb2tlIHx8IDJcbiAgfVxuXG4gIHJlbmRlckFsZXJ0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1hbGVydFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTE2IDMgTDMwIDI5IDIgMjkgWiBNMTYgMTEgTDE2IDE5IE0xNiAyMyBMMTYgMjVcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2xvY2soKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWNsb2NrXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNlwiIGN5PVwiMTZcIiByPVwiMTRcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTE2IDggTDE2IDE2IDIwIDIwXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsb3NlKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jbG9zZVwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTIgMzAgTDMwIDIgTTMwIDMwIEwyIDJcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySGVhcnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWhlYXJ0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJjdXJyZW50Y29sb3JcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMuc3Ryb2tlKCl9PlxuICAgICAgICA8cGF0aCBkPVwiTTQgMTYgQzEgMTIgMiA2IDcgNCAxMiAyIDE1IDYgMTYgOCAxNyA2IDIxIDIgMjYgNCAzMSA2IDMxIDEyIDI4IDE2IDI1IDIwIDE2IDI4IDE2IDI4IDE2IDI4IDcgMjAgNCAxNiBaXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNlYXJjaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktc2VhcmNoXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNFwiIGN5PVwiMTRcIiByPVwiMTJcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTIzIDIzIEwzMCAzMFwiICAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRXh0ZXJuYWwoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWV4dGVybmFsXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTQgOSBMMyA5IDMgMjkgMjMgMjkgMjMgMTggTTE4IDQgTDI4IDQgMjggMTQgTTI4IDQgTDE0IDE4XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRhZygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktdGFnXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIyNFwiIGN5PVwiOFwiIHI9XCIyXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0yIDE4IEwxOCAyIDMwIDIgMzAgMTQgMTQgMzAgWlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJUcmFzaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktdHJhc2hcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0yOCA2IEw2IDYgOCAzMCAyNCAzMCAyNiA2IDQgNiBNMTYgMTIgTDE2IDI0IE0yMSAxMiBMMjAgMjQgTTExIDEyIEwxMiAyNCBNMTIgNiBMMTMgMiAxOSAyIDIwIDZcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUmlnaHRDaGV2cm9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jaGV2cm9uLXJpZ2h0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTIgMzAgTDI0IDE2IDEyIDJcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXNldHRpbmdzXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTMgMiBMMTMgNiAxMSA3IDggNCA0IDggNyAxMSA2IDEzIDIgMTMgMiAxOSA2IDE5IDcgMjEgNCAyNCA4IDI4IDExIDI1IDEzIDI2IDEzIDMwIDE5IDMwIDE5IDI2IDIxIDI1IDI0IDI4IDI4IDI0IDI1IDIxIDI2IDE5IDMwIDE5IDMwIDEzIDI2IDEzIDI1IDExIDI4IDggMjQgNCAyMSA3IDE5IDYgMTkgMiBaXCIgLz5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjE2XCIgY3k9XCIxNlwiIHI9XCI0XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLW1zZ1wiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTIgNCBMMzAgNCAzMCAyMiAxNiAyMiA4IDI5IDggMjIgMiAyMiBaXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcbmltcG9ydCBzZWN0aW9ucyBmcm9tICcuLi9jaHJvbWUvc2V0dGluZ3Mtc2VjdGlvbnMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmdzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHNlY3Rpb25zLmZvckVhY2gocyA9PiB0aGlzLmxvYWRTZWN0aW9uKHMpKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpIHtcbiAgICBzZWN0aW9ucy5mb3JFYWNoKHMgPT4gdGhpcy5sb2FkU2VjdGlvbihzKSlcbiAgfVxuXG4gIGxvYWRTZWN0aW9uKHMpIHtcbiAgICB0aGlzLnByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LXNldHRpbmdzLXZhbHVlJywga2V5OiBzLmtleSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5vbkVycm9yKHJlc3AuZXJyb3IpXG4gICAgICBjb25zdCB1ID0ge31cbiAgICAgIHVbcy5rZXldID0gcmVzcC5jb250ZW50LnZhbHVlXG4gICAgICB0aGlzLnNldFN0YXRlKHUpXG4gICAgfSlcbiAgfVxuXG4gIG9uQ2hhbmdlKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgdGhpcy5wcm9wcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ3NldC1zZXR0aW5ncy12YWx1ZScsIGtleTogb3B0aW9ucy5rZXksIHZhbHVlIH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLm9uRXJyb3IocmVzcC5lcnJvcilcblxuICAgICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG9uRXJyb3IoZXJyb3IpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVycm9yXG4gICAgfSlcblxuICAgIGlmICh0aGlzLnByb3BzLm9uRXJyb3IpIHtcbiAgICAgIHRoaXMucHJvcHMub25FcnJvcihlcnJvcilcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2V0dGluZ3MgJHt0aGlzLnN0YXRlLm9wZW4gPyBcIm9wZW5cIiA6IFwiXCJ9YH0+XG4gICAgICAgIDxJY29uIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBvcGVuOiB0cnVlIH0pfSBuYW1lPVwic2V0dGluZ3NcIiAvPlxuICAgICAgICB7dGhpcy5yZW5kZXJTZXR0aW5ncygpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPlxuICAgICAgICB7dGhpcy5yZW5kZXJDbG9zZUJ1dHRvbigpfVxuICAgICAgICA8aDE+U2V0dGluZ3M8L2gxPlxuICAgICAgICA8aDI+R290IGZlZWRiYWNrIC8gcmVjb21tZW5kYXRpb24gPyA8YSBocmVmPVwibWFpbHRvOmF6ZXJAZ2V0a296bW9zLmNvbVwiPmZlZWRiYWNrPC9hPiBhbnl0aW1lLjwvaDI+XG4gICAgICAgIHt0aGlzLnJlbmRlclNlY3Rpb25zKCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyXCI+XG4gICAgICAgICAgPGJ1dHRvbiBvbmNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgb3BlbjogZmFsc2UgfSl9PlxuICAgICAgICAgICAgRG9uZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNlY3Rpb25zKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb25zXCI+XG4gICAgICAgIHtzZWN0aW9ucy5tYXAocyA9PiB0aGlzLnJlbmRlclNlY3Rpb24ocykpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2VjdGlvbihvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMucHJvcHMudHlwZSAmJiAhb3B0aW9uc1t0aGlzLnByb3BzLnR5cGVdKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPXtgc2V0dGluZyAke29wdGlvbnMua2V5fWB9PlxuICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiY2hlY2tib3hcIiBpZD17b3B0aW9ucy5rZXl9IG5hbWU9e29wdGlvbnMua2V5fSB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXt0aGlzLnN0YXRlW29wdGlvbnMua2V5XX0gb25DaGFuZ2U9e2UgPT4gdGhpcy5vbkNoYW5nZShlLnRhcmdldC5jaGVja2VkLCBvcHRpb25zKX0gLz5cbiAgICAgICAgPGxhYmVsIHRpdGxlPXtvcHRpb25zLmRlc2N9IGh0bWxGb3I9e29wdGlvbnMua2V5fT57b3B0aW9ucy50aXRsZX08L2xhYmVsPlxuICAgICAgICA8cD57b3B0aW9ucy5kZXNjfTwvcD5cbiAgICAgIDwvc2VjdGlvbj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDbG9zZUJ1dHRvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEljb24gc3Ryb2tlPVwiM1wiIG5hbWU9XCJjbG9zZVwiIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBvcGVuOiBmYWxzZSB9KX0gLz5cbiAgICApXG4gIH1cbn1cbiIsIiFmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgZnVuY3Rpb24gVk5vZGUoKSB7fVxuICAgIGZ1bmN0aW9uIGgobm9kZU5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGxhc3RTaW1wbGUsIGNoaWxkLCBzaW1wbGUsIGksIGNoaWxkcmVuID0gRU1QVFlfQ0hJTERSRU47XG4gICAgICAgIGZvciAoaSA9IGFyZ3VtZW50cy5sZW5ndGg7IGktLSA+IDI7ICkgc3RhY2sucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICBpZiAoYXR0cmlidXRlcyAmJiBudWxsICE9IGF0dHJpYnV0ZXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmICghc3RhY2subGVuZ3RoKSBzdGFjay5wdXNoKGF0dHJpYnV0ZXMuY2hpbGRyZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGF0dHJpYnV0ZXMuY2hpbGRyZW47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkgaWYgKChjaGlsZCA9IHN0YWNrLnBvcCgpKSAmJiB2b2lkIDAgIT09IGNoaWxkLnBvcCkgZm9yIChpID0gY2hpbGQubGVuZ3RoOyBpLS07ICkgc3RhY2sucHVzaChjaGlsZFtpXSk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgY2hpbGQpIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChzaW1wbGUgPSAnZnVuY3Rpb24nICE9IHR5cGVvZiBub2RlTmFtZSkgaWYgKG51bGwgPT0gY2hpbGQpIGNoaWxkID0gJyc7IGVsc2UgaWYgKCdudW1iZXInID09IHR5cGVvZiBjaGlsZCkgY2hpbGQgPSBTdHJpbmcoY2hpbGQpOyBlbHNlIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgY2hpbGQpIHNpbXBsZSA9ICExO1xuICAgICAgICAgICAgaWYgKHNpbXBsZSAmJiBsYXN0U2ltcGxlKSBjaGlsZHJlbltjaGlsZHJlbi5sZW5ndGggLSAxXSArPSBjaGlsZDsgZWxzZSBpZiAoY2hpbGRyZW4gPT09IEVNUFRZX0NISUxEUkVOKSBjaGlsZHJlbiA9IFsgY2hpbGQgXTsgZWxzZSBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIGxhc3RTaW1wbGUgPSBzaW1wbGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHAgPSBuZXcgVk5vZGUoKTtcbiAgICAgICAgcC5ub2RlTmFtZSA9IG5vZGVOYW1lO1xuICAgICAgICBwLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHAuYXR0cmlidXRlcyA9IG51bGwgPT0gYXR0cmlidXRlcyA/IHZvaWQgMCA6IGF0dHJpYnV0ZXM7XG4gICAgICAgIHAua2V5ID0gbnVsbCA9PSBhdHRyaWJ1dGVzID8gdm9pZCAwIDogYXR0cmlidXRlcy5rZXk7XG4gICAgICAgIGlmICh2b2lkIDAgIT09IG9wdGlvbnMudm5vZGUpIG9wdGlvbnMudm5vZGUocCk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBleHRlbmQob2JqLCBwcm9wcykge1xuICAgICAgICBmb3IgKHZhciBpIGluIHByb3BzKSBvYmpbaV0gPSBwcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xvbmVFbGVtZW50KHZub2RlLCBwcm9wcykge1xuICAgICAgICByZXR1cm4gaCh2bm9kZS5ub2RlTmFtZSwgZXh0ZW5kKGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyksIHByb3BzKSwgYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiB2bm9kZS5jaGlsZHJlbik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVucXVldWVSZW5kZXIoY29tcG9uZW50KSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9fZCAmJiAoY29tcG9uZW50Ll9fZCA9ICEwKSAmJiAxID09IGl0ZW1zLnB1c2goY29tcG9uZW50KSkgKG9wdGlvbnMuZGVib3VuY2VSZW5kZXJpbmcgfHwgZGVmZXIpKHJlcmVuZGVyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVyZW5kZXIoKSB7XG4gICAgICAgIHZhciBwLCBsaXN0ID0gaXRlbXM7XG4gICAgICAgIGl0ZW1zID0gW107XG4gICAgICAgIHdoaWxlIChwID0gbGlzdC5wb3AoKSkgaWYgKHAuX19kKSByZW5kZXJDb21wb25lbnQocCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzU2FtZU5vZGVUeXBlKG5vZGUsIHZub2RlLCBoeWRyYXRpbmcpIHtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHJldHVybiB2b2lkIDAgIT09IG5vZGUuc3BsaXRUZXh0O1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlLm5vZGVOYW1lKSByZXR1cm4gIW5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yICYmIGlzTmFtZWROb2RlKG5vZGUsIHZub2RlLm5vZGVOYW1lKTsgZWxzZSByZXR1cm4gaHlkcmF0aW5nIHx8IG5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNOYW1lZE5vZGUobm9kZSwgbm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuX19uID09PSBub2RlTmFtZSB8fCBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5vZGVQcm9wcyh2bm9kZSkge1xuICAgICAgICB2YXIgcHJvcHMgPSBleHRlbmQoe30sIHZub2RlLmF0dHJpYnV0ZXMpO1xuICAgICAgICBwcm9wcy5jaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0gdm5vZGUubm9kZU5hbWUuZGVmYXVsdFByb3BzO1xuICAgICAgICBpZiAodm9pZCAwICE9PSBkZWZhdWx0UHJvcHMpIGZvciAodmFyIGkgaW4gZGVmYXVsdFByb3BzKSBpZiAodm9pZCAwID09PSBwcm9wc1tpXSkgcHJvcHNbaV0gPSBkZWZhdWx0UHJvcHNbaV07XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTm9kZShub2RlTmFtZSwgaXNTdmcpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBpc1N2ZyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBub2RlTmFtZSkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcbiAgICAgICAgbm9kZS5fX24gPSBub2RlTmFtZTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudE5vZGUpIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldEFjY2Vzc29yKG5vZGUsIG5hbWUsIG9sZCwgdmFsdWUsIGlzU3ZnKSB7XG4gICAgICAgIGlmICgnY2xhc3NOYW1lJyA9PT0gbmFtZSkgbmFtZSA9ICdjbGFzcyc7XG4gICAgICAgIGlmICgna2V5JyA9PT0gbmFtZSkgOyBlbHNlIGlmICgncmVmJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKG9sZCkgb2xkKG51bGwpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB2YWx1ZShub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmICgnY2xhc3MnID09PSBuYW1lICYmICFpc1N2Zykgbm9kZS5jbGFzc05hbWUgPSB2YWx1ZSB8fCAnJzsgZWxzZSBpZiAoJ3N0eWxlJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2YgdmFsdWUgfHwgJ3N0cmluZycgPT0gdHlwZW9mIG9sZCkgbm9kZS5zdHlsZS5jc3NUZXh0ID0gdmFsdWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBvbGQpIGZvciAodmFyIGkgaW4gb2xkKSBpZiAoIShpIGluIHZhbHVlKSkgbm9kZS5zdHlsZVtpXSA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIG5vZGUuc3R5bGVbaV0gPSAnbnVtYmVyJyA9PSB0eXBlb2YgdmFsdWVbaV0gJiYgITEgPT09IElTX05PTl9ESU1FTlNJT05BTC50ZXN0KGkpID8gdmFsdWVbaV0gKyAncHgnIDogdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSBub2RlLmlubmVySFRNTCA9IHZhbHVlLl9faHRtbCB8fCAnJztcbiAgICAgICAgfSBlbHNlIGlmICgnbycgPT0gbmFtZVswXSAmJiAnbicgPT0gbmFtZVsxXSkge1xuICAgICAgICAgICAgdmFyIHVzZUNhcHR1cmUgPSBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvQ2FwdHVyZSQvLCAnJykpO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9sZCkgbm9kZS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudFByb3h5LCB1c2VDYXB0dXJlKTtcbiAgICAgICAgICAgIChub2RlLl9fbCB8fCAobm9kZS5fX2wgPSB7fSkpW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2xpc3QnICE9PSBuYW1lICYmICd0eXBlJyAhPT0gbmFtZSAmJiAhaXNTdmcgJiYgbmFtZSBpbiBub2RlKSB7XG4gICAgICAgICAgICBzZXRQcm9wZXJ0eShub2RlLCBuYW1lLCBudWxsID09IHZhbHVlID8gJycgOiB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAobnVsbCA9PSB2YWx1ZSB8fCAhMSA9PT0gdmFsdWUpIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5zID0gaXNTdmcgJiYgbmFtZSAhPT0gKG5hbWUgPSBuYW1lLnJlcGxhY2UoL154bGlua1xcOj8vLCAnJykpO1xuICAgICAgICAgICAgaWYgKG51bGwgPT0gdmFsdWUgfHwgITEgPT09IHZhbHVlKSBpZiAobnMpIG5vZGUucmVtb3ZlQXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBuYW1lLnRvTG93ZXJDYXNlKCkpOyBlbHNlIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpOyBlbHNlIGlmICgnZnVuY3Rpb24nICE9IHR5cGVvZiB2YWx1ZSkgaWYgKG5zKSBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpLCB2YWx1ZSk7IGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldFByb3BlcnR5KG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBub2RlW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV2ZW50UHJveHkoZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2xbZS50eXBlXShvcHRpb25zLmV2ZW50ICYmIG9wdGlvbnMuZXZlbnQoZSkgfHwgZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZsdXNoTW91bnRzKCkge1xuICAgICAgICB2YXIgYztcbiAgICAgICAgd2hpbGUgKGMgPSBtb3VudHMucG9wKCkpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyTW91bnQpIG9wdGlvbnMuYWZ0ZXJNb3VudChjKTtcbiAgICAgICAgICAgIGlmIChjLmNvbXBvbmVudERpZE1vdW50KSBjLmNvbXBvbmVudERpZE1vdW50KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgcGFyZW50LCBjb21wb25lbnRSb290KSB7XG4gICAgICAgIGlmICghZGlmZkxldmVsKyspIHtcbiAgICAgICAgICAgIGlzU3ZnTW9kZSA9IG51bGwgIT0gcGFyZW50ICYmIHZvaWQgMCAhPT0gcGFyZW50Lm93bmVyU1ZHRWxlbWVudDtcbiAgICAgICAgICAgIGh5ZHJhdGluZyA9IG51bGwgIT0gZG9tICYmICEoJ19fcHJlYWN0YXR0cl8nIGluIGRvbSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IGlkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBjb21wb25lbnRSb290KTtcbiAgICAgICAgaWYgKHBhcmVudCAmJiByZXQucGFyZW50Tm9kZSAhPT0gcGFyZW50KSBwYXJlbnQuYXBwZW5kQ2hpbGQocmV0KTtcbiAgICAgICAgaWYgKCEtLWRpZmZMZXZlbCkge1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gITE7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudFJvb3QpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpIHtcbiAgICAgICAgdmFyIG91dCA9IGRvbSwgcHJldlN2Z01vZGUgPSBpc1N2Z01vZGU7XG4gICAgICAgIGlmIChudWxsID09IHZub2RlIHx8ICdib29sZWFuJyA9PSB0eXBlb2Ygdm5vZGUpIHZub2RlID0gJyc7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUgfHwgJ251bWJlcicgPT0gdHlwZW9mIHZub2RlKSB7XG4gICAgICAgICAgICBpZiAoZG9tICYmIHZvaWQgMCAhPT0gZG9tLnNwbGl0VGV4dCAmJiBkb20ucGFyZW50Tm9kZSAmJiAoIWRvbS5fY29tcG9uZW50IHx8IGNvbXBvbmVudFJvb3QpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVmFsdWUgIT0gdm5vZGUpIGRvbS5ub2RlVmFsdWUgPSB2bm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodm5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShkb20sICEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQuX19wcmVhY3RhdHRyXyA9ICEwO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdm5vZGVOYW1lID0gdm5vZGUubm9kZU5hbWU7XG4gICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiB2bm9kZU5hbWUpIHJldHVybiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgIGlzU3ZnTW9kZSA9ICdzdmcnID09PSB2bm9kZU5hbWUgPyAhMCA6ICdmb3JlaWduT2JqZWN0JyA9PT0gdm5vZGVOYW1lID8gITEgOiBpc1N2Z01vZGU7XG4gICAgICAgIHZub2RlTmFtZSA9IFN0cmluZyh2bm9kZU5hbWUpO1xuICAgICAgICBpZiAoIWRvbSB8fCAhaXNOYW1lZE5vZGUoZG9tLCB2bm9kZU5hbWUpKSB7XG4gICAgICAgICAgICBvdXQgPSBjcmVhdGVOb2RlKHZub2RlTmFtZSwgaXNTdmdNb2RlKTtcbiAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIG91dC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGRvbSwgITApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBmYyA9IG91dC5maXJzdENoaWxkLCBwcm9wcyA9IG91dC5fX3ByZWFjdGF0dHJfLCB2Y2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKG51bGwgPT0gcHJvcHMpIHtcbiAgICAgICAgICAgIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8gPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGEgPSBvdXQuYXR0cmlidXRlcywgaSA9IGEubGVuZ3RoOyBpLS07ICkgcHJvcHNbYVtpXS5uYW1lXSA9IGFbaV0udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoeWRyYXRpbmcgJiYgdmNoaWxkcmVuICYmIDEgPT09IHZjaGlsZHJlbi5sZW5ndGggJiYgJ3N0cmluZycgPT0gdHlwZW9mIHZjaGlsZHJlblswXSAmJiBudWxsICE9IGZjICYmIHZvaWQgMCAhPT0gZmMuc3BsaXRUZXh0ICYmIG51bGwgPT0gZmMubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIGlmIChmYy5ub2RlVmFsdWUgIT0gdmNoaWxkcmVuWzBdKSBmYy5ub2RlVmFsdWUgPSB2Y2hpbGRyZW5bMF07XG4gICAgICAgIH0gZWxzZSBpZiAodmNoaWxkcmVuICYmIHZjaGlsZHJlbi5sZW5ndGggfHwgbnVsbCAhPSBmYykgaW5uZXJEaWZmTm9kZShvdXQsIHZjaGlsZHJlbiwgY29udGV4dCwgbW91bnRBbGwsIGh5ZHJhdGluZyB8fCBudWxsICE9IHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKTtcbiAgICAgICAgZGlmZkF0dHJpYnV0ZXMob3V0LCB2bm9kZS5hdHRyaWJ1dGVzLCBwcm9wcyk7XG4gICAgICAgIGlzU3ZnTW9kZSA9IHByZXZTdmdNb2RlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbm5lckRpZmZOb2RlKGRvbSwgdmNoaWxkcmVuLCBjb250ZXh0LCBtb3VudEFsbCwgaXNIeWRyYXRpbmcpIHtcbiAgICAgICAgdmFyIGosIGMsIGYsIHZjaGlsZCwgY2hpbGQsIG9yaWdpbmFsQ2hpbGRyZW4gPSBkb20uY2hpbGROb2RlcywgY2hpbGRyZW4gPSBbXSwga2V5ZWQgPSB7fSwga2V5ZWRMZW4gPSAwLCBtaW4gPSAwLCBsZW4gPSBvcmlnaW5hbENoaWxkcmVuLmxlbmd0aCwgY2hpbGRyZW5MZW4gPSAwLCB2bGVuID0gdmNoaWxkcmVuID8gdmNoaWxkcmVuLmxlbmd0aCA6IDA7XG4gICAgICAgIGlmICgwICE9PSBsZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBfY2hpbGQgPSBvcmlnaW5hbENoaWxkcmVuW2ldLCBwcm9wcyA9IF9jaGlsZC5fX3ByZWFjdGF0dHJfLCBrZXkgPSB2bGVuICYmIHByb3BzID8gX2NoaWxkLl9jb21wb25lbnQgPyBfY2hpbGQuX2NvbXBvbmVudC5fX2sgOiBwcm9wcy5rZXkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAga2V5ZWRMZW4rKztcbiAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gX2NoaWxkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcyB8fCAodm9pZCAwICE9PSBfY2hpbGQuc3BsaXRUZXh0ID8gaXNIeWRyYXRpbmcgPyBfY2hpbGQubm9kZVZhbHVlLnRyaW0oKSA6ICEwIDogaXNIeWRyYXRpbmcpKSBjaGlsZHJlbltjaGlsZHJlbkxlbisrXSA9IF9jaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoMCAhPT0gdmxlbikgZm9yICh2YXIgaSA9IDA7IGkgPCB2bGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZjaGlsZCA9IHZjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBrZXkgPSB2Y2hpbGQua2V5O1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleWVkTGVuICYmIHZvaWQgMCAhPT0ga2V5ZWRba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGtleWVkW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGtleWVkW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGtleWVkTGVuLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghY2hpbGQgJiYgbWluIDwgY2hpbGRyZW5MZW4pIGZvciAoaiA9IG1pbjsgaiA8IGNoaWxkcmVuTGVuOyBqKyspIGlmICh2b2lkIDAgIT09IGNoaWxkcmVuW2pdICYmIGlzU2FtZU5vZGVUeXBlKGMgPSBjaGlsZHJlbltqXSwgdmNoaWxkLCBpc0h5ZHJhdGluZykpIHtcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGM7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bal0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGNoaWxkcmVuTGVuIC0gMSkgY2hpbGRyZW5MZW4tLTtcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gbWluKSBtaW4rKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoaWxkID0gaWRpZmYoY2hpbGQsIHZjaGlsZCwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZiA9IG9yaWdpbmFsQ2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQgJiYgY2hpbGQgIT09IGRvbSAmJiBjaGlsZCAhPT0gZikgaWYgKG51bGwgPT0gZikgZG9tLmFwcGVuZENoaWxkKGNoaWxkKTsgZWxzZSBpZiAoY2hpbGQgPT09IGYubmV4dFNpYmxpbmcpIHJlbW92ZU5vZGUoZik7IGVsc2UgZG9tLmluc2VydEJlZm9yZShjaGlsZCwgZik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleWVkTGVuKSBmb3IgKHZhciBpIGluIGtleWVkKSBpZiAodm9pZCAwICE9PSBrZXllZFtpXSkgcmVjb2xsZWN0Tm9kZVRyZWUoa2V5ZWRbaV0sICExKTtcbiAgICAgICAgd2hpbGUgKG1pbiA8PSBjaGlsZHJlbkxlbikgaWYgKHZvaWQgMCAhPT0gKGNoaWxkID0gY2hpbGRyZW5bY2hpbGRyZW5MZW4tLV0pKSByZWNvbGxlY3ROb2RlVHJlZShjaGlsZCwgITEpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZWNvbGxlY3ROb2RlVHJlZShub2RlLCB1bm1vdW50T25seSkge1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gbm9kZS5fY29tcG9uZW50O1xuICAgICAgICBpZiAoY29tcG9uZW50KSB1bm1vdW50Q29tcG9uZW50KGNvbXBvbmVudCk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG51bGwgIT0gbm9kZS5fX3ByZWFjdGF0dHJfICYmIG5vZGUuX19wcmVhY3RhdHRyXy5yZWYpIG5vZGUuX19wcmVhY3RhdHRyXy5yZWYobnVsbCk7XG4gICAgICAgICAgICBpZiAoITEgPT09IHVubW91bnRPbmx5IHx8IG51bGwgPT0gbm9kZS5fX3ByZWFjdGF0dHJfKSByZW1vdmVOb2RlKG5vZGUpO1xuICAgICAgICAgICAgcmVtb3ZlQ2hpbGRyZW4obm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBub2RlID0gbm9kZS5sYXN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgICAgICB2YXIgbmV4dCA9IG5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUobm9kZSwgITApO1xuICAgICAgICAgICAgbm9kZSA9IG5leHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZkF0dHJpYnV0ZXMoZG9tLCBhdHRycywgb2xkKSB7XG4gICAgICAgIHZhciBuYW1lO1xuICAgICAgICBmb3IgKG5hbWUgaW4gb2xkKSBpZiAoKCFhdHRycyB8fCBudWxsID09IGF0dHJzW25hbWVdKSAmJiBudWxsICE9IG9sZFtuYW1lXSkgc2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBvbGRbbmFtZV0sIG9sZFtuYW1lXSA9IHZvaWQgMCwgaXNTdmdNb2RlKTtcbiAgICAgICAgZm9yIChuYW1lIGluIGF0dHJzKSBpZiAoISgnY2hpbGRyZW4nID09PSBuYW1lIHx8ICdpbm5lckhUTUwnID09PSBuYW1lIHx8IG5hbWUgaW4gb2xkICYmIGF0dHJzW25hbWVdID09PSAoJ3ZhbHVlJyA9PT0gbmFtZSB8fCAnY2hlY2tlZCcgPT09IG5hbWUgPyBkb21bbmFtZV0gOiBvbGRbbmFtZV0pKSkgc2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBvbGRbbmFtZV0sIG9sZFtuYW1lXSA9IGF0dHJzW25hbWVdLCBpc1N2Z01vZGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb2xsZWN0Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICB2YXIgbmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAoY29tcG9uZW50c1tuYW1lXSB8fCAoY29tcG9uZW50c1tuYW1lXSA9IFtdKSkucHVzaChjb21wb25lbnQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoQ3RvciwgcHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGluc3QsIGxpc3QgPSBjb21wb25lbnRzW0N0b3IubmFtZV07XG4gICAgICAgIGlmIChDdG9yLnByb3RvdHlwZSAmJiBDdG9yLnByb3RvdHlwZS5yZW5kZXIpIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgQ3Rvcihwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBDb21wb25lbnQuY2FsbChpbnN0LCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IENvbXBvbmVudChwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpbnN0LmNvbnN0cnVjdG9yID0gQ3RvcjtcbiAgICAgICAgICAgIGluc3QucmVuZGVyID0gZG9SZW5kZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpc3QpIGZvciAodmFyIGkgPSBsaXN0Lmxlbmd0aDsgaS0tOyApIGlmIChsaXN0W2ldLmNvbnN0cnVjdG9yID09PSBDdG9yKSB7XG4gICAgICAgICAgICBpbnN0Ll9fYiA9IGxpc3RbaV0uX19iO1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZG9SZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0Q29tcG9uZW50UHJvcHMoY29tcG9uZW50LCBwcm9wcywgb3B0cywgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX194KSB7XG4gICAgICAgICAgICBjb21wb25lbnQuX194ID0gITA7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fciA9IHByb3BzLnJlZikgZGVsZXRlIHByb3BzLnJlZjtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19rID0gcHJvcHMua2V5KSBkZWxldGUgcHJvcHMua2V5O1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuYmFzZSB8fCBtb3VudEFsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKSBjb21wb25lbnQuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0ICE9PSBjb21wb25lbnQuY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50Ll9fYykgY29tcG9uZW50Ll9fYyA9IGNvbXBvbmVudC5jb250ZXh0O1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY29tcG9uZW50Ll9fcCkgY29tcG9uZW50Ll9fcCA9IGNvbXBvbmVudC5wcm9wcztcbiAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9feCA9ICExO1xuICAgICAgICAgICAgaWYgKDAgIT09IG9wdHMpIGlmICgxID09PSBvcHRzIHx8ICExICE9PSBvcHRpb25zLnN5bmNDb21wb25lbnRVcGRhdGVzIHx8ICFjb21wb25lbnQuYmFzZSkgcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCwgMSwgbW91bnRBbGwpOyBlbHNlIGVucXVldWVSZW5kZXIoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19yKSBjb21wb25lbnQuX19yKGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCwgb3B0cywgbW91bnRBbGwsIGlzQ2hpbGQpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX194KSB7XG4gICAgICAgICAgICB2YXIgcmVuZGVyZWQsIGluc3QsIGNiYXNlLCBwcm9wcyA9IGNvbXBvbmVudC5wcm9wcywgc3RhdGUgPSBjb21wb25lbnQuc3RhdGUsIGNvbnRleHQgPSBjb21wb25lbnQuY29udGV4dCwgcHJldmlvdXNQcm9wcyA9IGNvbXBvbmVudC5fX3AgfHwgcHJvcHMsIHByZXZpb3VzU3RhdGUgPSBjb21wb25lbnQuX19zIHx8IHN0YXRlLCBwcmV2aW91c0NvbnRleHQgPSBjb21wb25lbnQuX19jIHx8IGNvbnRleHQsIGlzVXBkYXRlID0gY29tcG9uZW50LmJhc2UsIG5leHRCYXNlID0gY29tcG9uZW50Ll9fYiwgaW5pdGlhbEJhc2UgPSBpc1VwZGF0ZSB8fCBuZXh0QmFzZSwgaW5pdGlhbENoaWxkQ29tcG9uZW50ID0gY29tcG9uZW50Ll9jb21wb25lbnQsIHNraXAgPSAhMTtcbiAgICAgICAgICAgIGlmIChpc1VwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByZXZpb3VzUHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gcHJldmlvdXNTdGF0ZTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IHByZXZpb3VzQ29udGV4dDtcbiAgICAgICAgICAgICAgICBpZiAoMiAhPT0gb3B0cyAmJiBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlICYmICExID09PSBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCkpIHNraXAgPSAhMDsgZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50Ll9fcCA9IGNvbXBvbmVudC5fX3MgPSBjb21wb25lbnQuX19jID0gY29tcG9uZW50Ll9fYiA9IG51bGw7XG4gICAgICAgICAgICBjb21wb25lbnQuX19kID0gITE7XG4gICAgICAgICAgICBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICByZW5kZXJlZCA9IGNvbXBvbmVudC5yZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmdldENoaWxkQ29udGV4dCkgY29udGV4dCA9IGV4dGVuZChleHRlbmQoe30sIGNvbnRleHQpLCBjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkpO1xuICAgICAgICAgICAgICAgIHZhciB0b1VubW91bnQsIGJhc2UsIGNoaWxkQ29tcG9uZW50ID0gcmVuZGVyZWQgJiYgcmVuZGVyZWQubm9kZU5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZFByb3BzID0gZ2V0Tm9kZVByb3BzKHJlbmRlcmVkKTtcbiAgICAgICAgICAgICAgICAgICAgaW5zdCA9IGluaXRpYWxDaGlsZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluc3QgJiYgaW5zdC5jb25zdHJ1Y3RvciA9PT0gY2hpbGRDb21wb25lbnQgJiYgY2hpbGRQcm9wcy5rZXkgPT0gaW5zdC5fX2spIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDEsIGNvbnRleHQsICExKTsgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbnN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Ll9jb21wb25lbnQgPSBpbnN0ID0gY3JlYXRlQ29tcG9uZW50KGNoaWxkQ29tcG9uZW50LCBjaGlsZFByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QuX19iID0gaW5zdC5fX2IgfHwgbmV4dEJhc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fdSA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDAsIGNvbnRleHQsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBvbmVudChpbnN0LCAxLCBtb3VudEFsbCwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJhc2UgPSBpbnN0LmJhc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2Jhc2UgPSBpbml0aWFsQmFzZTtcbiAgICAgICAgICAgICAgICAgICAgdG9Vbm1vdW50ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9Vbm1vdW50KSBjYmFzZSA9IGNvbXBvbmVudC5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxCYXNlIHx8IDEgPT09IG9wdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYmFzZSkgY2Jhc2UuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlID0gZGlmZihjYmFzZSwgcmVuZGVyZWQsIGNvbnRleHQsIG1vdW50QWxsIHx8ICFpc1VwZGF0ZSwgaW5pdGlhbEJhc2UgJiYgaW5pdGlhbEJhc2UucGFyZW50Tm9kZSwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbml0aWFsQmFzZSAmJiBiYXNlICE9PSBpbml0aWFsQmFzZSAmJiBpbnN0ICE9PSBpbml0aWFsQ2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJhc2VQYXJlbnQgPSBpbml0aWFsQmFzZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZVBhcmVudCAmJiBiYXNlICE9PSBiYXNlUGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlUGFyZW50LnJlcGxhY2VDaGlsZChiYXNlLCBpbml0aWFsQmFzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRvVW5tb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxCYXNlLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGluaXRpYWxCYXNlLCAhMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgdW5tb3VudENvbXBvbmVudCh0b1VubW91bnQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5iYXNlID0gYmFzZTtcbiAgICAgICAgICAgICAgICBpZiAoYmFzZSAmJiAhaXNDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50UmVmID0gY29tcG9uZW50LCB0ID0gY29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodCA9IHQuX191KSAoY29tcG9uZW50UmVmID0gdCkuYmFzZSA9IGJhc2U7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UuX2NvbXBvbmVudCA9IGNvbXBvbmVudFJlZjtcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPSBjb21wb25lbnRSZWYuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1VwZGF0ZSB8fCBtb3VudEFsbCkgbW91bnRzLnVuc2hpZnQoY29tcG9uZW50KTsgZWxzZSBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZSkgY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZShwcmV2aW91c1Byb3BzLCBwcmV2aW91c1N0YXRlLCBwcmV2aW91c0NvbnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyVXBkYXRlKSBvcHRpb25zLmFmdGVyVXBkYXRlKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBjb21wb25lbnQuX19oKSB3aGlsZSAoY29tcG9uZW50Ll9faC5sZW5ndGgpIGNvbXBvbmVudC5fX2gucG9wKCkuY2FsbChjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKCFkaWZmTGV2ZWwgJiYgIWlzQ2hpbGQpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGRDb21wb25lbnRGcm9tVk5vZGUoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgdmFyIGMgPSBkb20gJiYgZG9tLl9jb21wb25lbnQsIG9yaWdpbmFsQ29tcG9uZW50ID0gYywgb2xkRG9tID0gZG9tLCBpc0RpcmVjdE93bmVyID0gYyAmJiBkb20uX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZSwgaXNPd25lciA9IGlzRGlyZWN0T3duZXIsIHByb3BzID0gZ2V0Tm9kZVByb3BzKHZub2RlKTtcbiAgICAgICAgd2hpbGUgKGMgJiYgIWlzT3duZXIgJiYgKGMgPSBjLl9fdSkpIGlzT3duZXIgPSBjLmNvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICAgICAgaWYgKGMgJiYgaXNPd25lciAmJiAoIW1vdW50QWxsIHx8IGMuX2NvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCAzLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBkb20gPSBjLmJhc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWxDb21wb25lbnQgJiYgIWlzRGlyZWN0T3duZXIpIHtcbiAgICAgICAgICAgICAgICB1bm1vdW50Q29tcG9uZW50KG9yaWdpbmFsQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICBkb20gPSBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYyA9IGNyZWF0ZUNvbXBvbmVudCh2bm9kZS5ub2RlTmFtZSwgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGRvbSAmJiAhYy5fX2IpIHtcbiAgICAgICAgICAgICAgICBjLl9fYiA9IGRvbTtcbiAgICAgICAgICAgICAgICBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoYywgcHJvcHMsIDEsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGRvbSA9IGMuYmFzZTtcbiAgICAgICAgICAgIGlmIChvbGREb20gJiYgZG9tICE9PSBvbGREb20pIHtcbiAgICAgICAgICAgICAgICBvbGREb20uX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUob2xkRG9tLCAhMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvbTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdW5tb3VudENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYmVmb3JlVW5tb3VudCkgb3B0aW9ucy5iZWZvcmVVbm1vdW50KGNvbXBvbmVudCk7XG4gICAgICAgIHZhciBiYXNlID0gY29tcG9uZW50LmJhc2U7XG4gICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG4gICAgICAgIGNvbXBvbmVudC5iYXNlID0gbnVsbDtcbiAgICAgICAgdmFyIGlubmVyID0gY29tcG9uZW50Ll9jb21wb25lbnQ7XG4gICAgICAgIGlmIChpbm5lcikgdW5tb3VudENvbXBvbmVudChpbm5lcik7IGVsc2UgaWYgKGJhc2UpIHtcbiAgICAgICAgICAgIGlmIChiYXNlLl9fcHJlYWN0YXR0cl8gJiYgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZikgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX2IgPSBiYXNlO1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShiYXNlKTtcbiAgICAgICAgICAgIGNvbGxlY3RDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkcmVuKGJhc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb21wb25lbnQuX19yKSBjb21wb25lbnQuX19yKG51bGwpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBDb21wb25lbnQocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fX2QgPSAhMDtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVuZGVyKHZub2RlLCBwYXJlbnQsIG1lcmdlKSB7XG4gICAgICAgIHJldHVybiBkaWZmKG1lcmdlLCB2bm9kZSwge30sICExLCBwYXJlbnQsICExKTtcbiAgICB9XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICB2YXIgRU1QVFlfQ0hJTERSRU4gPSBbXTtcbiAgICB2YXIgZGVmZXIgPSAnZnVuY3Rpb24nID09IHR5cGVvZiBQcm9taXNlID8gUHJvbWlzZS5yZXNvbHZlKCkudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKSA6IHNldFRpbWVvdXQ7XG4gICAgdmFyIElTX05PTl9ESU1FTlNJT05BTCA9IC9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHZhciBtb3VudHMgPSBbXTtcbiAgICB2YXIgZGlmZkxldmVsID0gMDtcbiAgICB2YXIgaXNTdmdNb2RlID0gITE7XG4gICAgdmFyIGh5ZHJhdGluZyA9ICExO1xuICAgIHZhciBjb21wb25lbnRzID0ge307XG4gICAgZXh0ZW5kKENvbXBvbmVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgc2V0U3RhdGU6IGZ1bmN0aW9uKHN0YXRlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLnN0YXRlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9fcykgdGhpcy5fX3MgPSBleHRlbmQoe30sIHMpO1xuICAgICAgICAgICAgZXh0ZW5kKHMsICdmdW5jdGlvbicgPT0gdHlwZW9mIHN0YXRlID8gc3RhdGUocywgdGhpcy5wcm9wcykgOiBzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spICh0aGlzLl9faCA9IHRoaXMuX19oIHx8IFtdKS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGVucXVldWVSZW5kZXIodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcmNlVXBkYXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSAodGhpcy5fX2ggPSB0aGlzLl9faCB8fCBbXSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICByZW5kZXJDb21wb25lbnQodGhpcywgMik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBwcmVhY3QgPSB7XG4gICAgICAgIGg6IGgsXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQ6IGgsXG4gICAgICAgIGNsb25lRWxlbWVudDogY2xvbmVFbGVtZW50LFxuICAgICAgICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgICAgICAgcmVuZGVyOiByZW5kZXIsXG4gICAgICAgIHJlcmVuZGVyOiByZXJlbmRlcixcbiAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgIH07XG4gICAgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiBtb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gcHJlYWN0OyBlbHNlIHNlbGYucHJlYWN0ID0gcHJlYWN0O1xufSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0LmpzLm1hcCIsInZhciByZWxhdGl2ZURhdGUgPSAoZnVuY3Rpb24odW5kZWZpbmVkKXtcblxuICB2YXIgU0VDT05EID0gMTAwMCxcbiAgICAgIE1JTlVURSA9IDYwICogU0VDT05ELFxuICAgICAgSE9VUiA9IDYwICogTUlOVVRFLFxuICAgICAgREFZID0gMjQgKiBIT1VSLFxuICAgICAgV0VFSyA9IDcgKiBEQVksXG4gICAgICBZRUFSID0gREFZICogMzY1LFxuICAgICAgTU9OVEggPSBZRUFSIC8gMTI7XG5cbiAgdmFyIGZvcm1hdHMgPSBbXG4gICAgWyAwLjcgKiBNSU5VVEUsICdqdXN0IG5vdycgXSxcbiAgICBbIDEuNSAqIE1JTlVURSwgJ2EgbWludXRlIGFnbycgXSxcbiAgICBbIDYwICogTUlOVVRFLCAnbWludXRlcyBhZ28nLCBNSU5VVEUgXSxcbiAgICBbIDEuNSAqIEhPVVIsICdhbiBob3VyIGFnbycgXSxcbiAgICBbIERBWSwgJ2hvdXJzIGFnbycsIEhPVVIgXSxcbiAgICBbIDIgKiBEQVksICd5ZXN0ZXJkYXknIF0sXG4gICAgWyA3ICogREFZLCAnZGF5cyBhZ28nLCBEQVkgXSxcbiAgICBbIDEuNSAqIFdFRUssICdhIHdlZWsgYWdvJ10sXG4gICAgWyBNT05USCwgJ3dlZWtzIGFnbycsIFdFRUsgXSxcbiAgICBbIDEuNSAqIE1PTlRILCAnYSBtb250aCBhZ28nIF0sXG4gICAgWyBZRUFSLCAnbW9udGhzIGFnbycsIE1PTlRIIF0sXG4gICAgWyAxLjUgKiBZRUFSLCAnYSB5ZWFyIGFnbycgXSxcbiAgICBbIE51bWJlci5NQVhfVkFMVUUsICd5ZWFycyBhZ28nLCBZRUFSIF1cbiAgXTtcblxuICBmdW5jdGlvbiByZWxhdGl2ZURhdGUoaW5wdXQscmVmZXJlbmNlKXtcbiAgICAhcmVmZXJlbmNlICYmICggcmVmZXJlbmNlID0gKG5ldyBEYXRlKS5nZXRUaW1lKCkgKTtcbiAgICByZWZlcmVuY2UgaW5zdGFuY2VvZiBEYXRlICYmICggcmVmZXJlbmNlID0gcmVmZXJlbmNlLmdldFRpbWUoKSApO1xuICAgIGlucHV0IGluc3RhbmNlb2YgRGF0ZSAmJiAoIGlucHV0ID0gaW5wdXQuZ2V0VGltZSgpICk7XG4gICAgXG4gICAgdmFyIGRlbHRhID0gcmVmZXJlbmNlIC0gaW5wdXQsXG4gICAgICAgIGZvcm1hdCwgaSwgbGVuO1xuXG4gICAgZm9yKGkgPSAtMSwgbGVuPWZvcm1hdHMubGVuZ3RoOyArK2kgPCBsZW47ICl7XG4gICAgICBmb3JtYXQgPSBmb3JtYXRzW2ldO1xuICAgICAgaWYoZGVsdGEgPCBmb3JtYXRbMF0pe1xuICAgICAgICByZXR1cm4gZm9ybWF0WzJdID09IHVuZGVmaW5lZCA/IGZvcm1hdFsxXSA6IE1hdGgucm91bmQoZGVsdGEvZm9ybWF0WzJdKSArICcgJyArIGZvcm1hdFsxXTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aXZlRGF0ZTtcblxufSkoKTtcblxuaWYodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyl7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVsYXRpdmVEYXRlO1xufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50LCByZW5kZXIgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCB0YWJzIGZyb20gXCIuLi9zYWZhcmkvdGFic1wiXG5pbXBvcnQgeyBzZXRBc0xpa2VkLCBzZXRBc05vdExpa2VkLCBzZXRBc0xvYWRpbmcgfSBmcm9tIFwiLi4vc2FmYXJpL2ljb25zXCJcbmltcG9ydCBEaWFsb2cgZnJvbSBcIi4uL3BvcHVwL2RpYWxvZ1wiXG5pbXBvcnQgeyBJY29uIH0gZnJvbSAnLi4vcG9wdXAvaWNvbic7XG5cbmNsYXNzIFBvcHVwIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB3aW5kb3cuUG9wb3ZlciA9IHRoaXM7XG5cbiAgICB0aGlzLnVwZGF0ZVBvcG92ZXIoKTtcbiAgICBzYWZhcmkuZXh0ZW5zaW9uLmdsb2JhbFBhZ2UuY29udGVudFdpbmRvdy5saXN0ZW5Gb3JQb3BvdmVyKClcbiAgfVxuXG4gIHVwZGF0ZVBvcG92ZXIoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc0xvZ2dlZEluOiAhIWxvY2FsU3RvcmFnZVsndG9rZW4nXVxuICAgIH0pXG5cbiAgICBjb25zdCB0YWIgPSB0YWJzLmN1cnJlbnQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVybDogdGFiLnVybCxcbiAgICAgIHRpdGxlOiB0YWIudGl0bGVcbiAgICB9KVxuXG4gICAgdGhpcy5vblN0YXJ0TG9hZGluZygpO1xuICAgIHNhZmFyaS5leHRlbnNpb24uZ2xvYmFsUGFnZS5jb250ZW50V2luZG93LmdldExpa2UodGFiLnVybClcbiAgICAgIC50aGVuKChyZXNwKSA9PiB7XG4gICAgICAgIHRoaXMub25TdG9wTG9hZGluZygpO1xuICAgICAgICBpZiAocmVzcCkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgbGlrZTogcmVzcC5saWtlLFxuICAgICAgICAgICAgaXNMaWtlZDogISFyZXNwLmxpa2VcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgbGlrZTogbnVsbCxcbiAgICAgICAgICAgIGlzTGlrZWQ6IGZhbHNlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICByZXNpemVQb3BvdmVyKCkge1xuICAgIHNhZmFyaS5zZWxmLmhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xuICB9XG5cbiAgb25TdGFydExvYWRpbmcoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc0xvYWRpbmc6IHRydWVcbiAgICB9KVxuICB9XG5cbiAgb25TdG9wTG9hZGluZygpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpc0xvYWRpbmc6IGZhbHNlXG4gICAgICB9KVxuICAgIH0sIDUwMClcbiAgfVxuXG4gIG9uRXJyb3IoZXJyb3IpIHtcbiAgICBjb25zdCBlNDAxID0gZXJyb3IubWVzc2FnZS5pbmRleE9mKCc0MDEnKSA+IC0xXG4gICAgaWYgKGU0MDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaXNMb2dnZWRJbjogZmFsc2UsXG4gICAgICAgIGlzTGlrZWQ6IGZhbHNlXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXJyb3JcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlQWN0aW9uSWNvbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5pc0xpa2VkKSB7XG4gICAgICBzZXRBc0xpa2VkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldEFzTm90TGlrZWQoKTtcbiAgICB9XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBzYWZhcmkuc2VsZi5oaWRlKCk7XG4gIH1cblxuICBsaWtlKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5pc0xvZ2dlZEluKSB7XG4gICAgICB0YWJzLmNyZWF0ZSgnaHR0cHM6Ly9nZXRrb3ptb3MuY29tL2xvZ2luJylcbiAgICB9XG5cbiAgICBzYWZhcmkuZXh0ZW5zaW9uLmdsb2JhbFBhZ2UuY29udGVudFdpbmRvdy5saWtlKHRoaXMuc3RhdGUudXJsLCB0aGlzLnN0YXRlLnRpdGxlKVxuICAgICAgLnRoZW4oKHJlc3ApID0+IHtcbiAgICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IHJlc3AuZXJyb3IgfSlcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBsaWtlOiByZXNwLmxpa2UsXG4gICAgICAgICAgaXNMaWtlZDogISFyZXNwLmxpa2UsXG4gICAgICAgICAgaXNKdXN0TGlrZWQ6IHRydWVcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLnVwZGF0ZUFjdGlvbkljb24oKVxuICAgICAgfSlcbiAgfVxuXG4gIHVubGlrZSgpIHtcbiAgICBzYWZhcmkuZXh0ZW5zaW9uLmdsb2JhbFBhZ2UuY29udGVudFdpbmRvdy51bmxpa2UodGhpcy5zdGF0ZS51cmwpXG4gICAgICAudGhlbigocmVzcCkgPT4ge1xuICAgICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogcmVzcC5lcnJvciB9KVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGxpa2U6IG51bGwsXG4gICAgICAgICAgaXNMaWtlZDogZmFsc2VcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLnVwZGF0ZUFjdGlvbkljb24oKVxuICAgICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLnJlc2l6ZVBvcG92ZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzYWZhcmkgY29udGFpbmVyXCI+XG4gICAgICAgIDxoMT5cbiAgICAgICAgICA8YSB0aXRsZT1cIk9wZW4gS296bW9zXCIgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cImh0dHBzOi8vZ2V0a296bW9zLmNvbVwiIG9uY2xpY2s9eygpID0+IHsgdGFicy5jcmVhdGUoJ2h0dHBzOi8vZ2V0a296bW9zLmNvbScpOyBzYWZhcmkuc2VsZi5oaWRlKCk7IH19Pmtvem1vczwvYT5cbiAgICAgICAgICA8SWNvbiBuYW1lPVwiZXh0ZXJuYWxcIiBvbmNsaWNrPXsoKSA9PiB7IHRhYnMuY3JlYXRlKCdodHRwczovL2dldGtvem1vcy5jb20nKTsgc2FmYXJpLnNlbGYuaGlkZSgpOyB9fSB0aXRsZT1cIk9wZW4gWW91ciBCb29rbWFya3NcIiAvPlxuICAgICAgICA8L2gxPlxuXG4gICAgICAgIDxEaWFsb2cgaXNMaWtlZD17dGhpcy5zdGF0ZS5pc0xpa2VkfVxuICAgICAgICAgIHJlY29yZD17dGhpcy5zdGF0ZS5saWtlfVxuICAgICAgICAgIGlzSnVzdExpa2VkPXt0aGlzLnN0YXRlLmlzSnVzdExpa2VkfVxuICAgICAgICAgIGlzTG9nZ2VkSW49e3RoaXMuc3RhdGUuaXNMb2dnZWRJbn1cbiAgICAgICAgICB1bmxpa2U9eygpID0+IHRoaXMudW5saWtlKCl9XG4gICAgICAgICAgbGlrZT17KCkgPT4gdGhpcy5saWtlKCl9XG4gICAgICAgICAgb25TdGFydExvYWRpbmc9eygpID0+IHRoaXMub25TdGFydExvYWRpbmcoKX1cbiAgICAgICAgICBvblN0b3BMb2FkaW5nPXsoKSA9PiB0aGlzLm9uU3RvcExvYWRpbmcoKX1cbiAgICAgICAgICBvblN5bmM9eygpID0+IHRoaXMub25TeW5jKCl9XG4gICAgICAgICAgb25FcnJvcj17ZXJyID0+IHRoaXMub25FcnJvcihlcnIpfVxuICAgICAgICAvPlxuXG4gICAgICAgIHt0aGlzLnJlbmRlclN0YXR1cygpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU3RhdHVzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YXR1c1wiPlxuICAgICAgICB7dGhpcy5yZW5kZXJTdGF0dXNJY29uKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJTdGF0dXNJY29uKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmlzTG9hZGluZykge1xuICAgICAgcmV0dXJuIDxJY29uIG5hbWU9XCJjbG9ja1wiIHRpdGxlPVwiQ29ubmVjdGluZyB0byBLb3ptb3MgcmlnaHQgbm93XCIgLz5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5lcnJvcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGEgaHJlZj17J21haWx0bzphemVyQGdldGtvem1vcy5jb20/c3ViamVjdD1FeHRlbnNpb24rRXJyb3ImYm9keT1TdGFjayB0cmFjZTonICsgZW5jb2RlVVJJKHRoaXMuc3RhdGUuZXJyb3Iuc3RhY2spfT5cbiAgICAgICAgICA8SWNvbiBuYW1lPVwiYWxlcnRcIiB0aXRsZT1cIkFuIGVycm9yIG9jY3VycmVkLiBDbGljayBoZXJlIHRvIHJlcG9ydCBpdC5cIiBvbmNsaWNrPXsoKSA9PiB0aGlzLnJlcG9ydEVycm9yKCl9IHN0cm9rZT1cIjJcIiAvPlxuICAgICAgICA8L2E+XG4gICAgICApXG4gICAgfVxuICB9XG5cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuICByZW5kZXIoPFBvcHVwIC8+LCBkb2N1bWVudC5ib2R5KVxufSlcbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1dHRvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidXR0b25zXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnV0dG9uXCIgdGl0bGU9e3RoaXMucHJvcHMudGl0bGV9IG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja30+XG4gICAgICAgICAgeyB0aGlzLnByb3BzLmljb24gPyA8SWNvbiBuYW1lPXt0aGlzLnByb3BzLmljb259IC8+IDogbnVsbH1cbiAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi9idXR0b25cIlxuaW1wb3J0IExpa2VkRGlhbG9nIGZyb20gXCIuL2xpa2VkLWRpYWxvZ1wiXG5pbXBvcnQgSW5wdXQgZnJvbSBcIi4vaW5wdXRcIlxuaW1wb3J0IFNldHRpbmdzIGZyb20gXCIuLi9uZXd0YWIvc2V0dGluZ3NcIlxuXG4vKipcbiAqIENoZWNrIHRvIHNlZSBpZiB0aGUgZXh0ZW5zaW9uIGlzIHJ1bm5pbmcgb24gQ2hyb21lIG9yIFNhZmFyaVxuICogYW5kIHJlcXVpcmUgdGhlIHJlc3BlY3RpdmUgdGFicyBtb2R1bGVcbiAqL1xubGV0IHRhYnM7XG5pZiAodHlwZW9mIGNocm9tZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICB0YWJzID0gcmVxdWlyZShcIi4uL2Nocm9tZS90YWJzXCIpO1xufSBlbHNlIGlmICh0eXBlb2Ygc2FmYXJpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIHRhYnMgPSByZXF1aXJlKFwiLi4vc2FmYXJpL3RhYnNcIik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHNlYXJjaCh2YWx1ZSkge1xuICAgIHRhYnMuY3JlYXRlKCdodHRwczovL2dldGtvem1vcy5jb20vc2VhcmNoP3E9JyArIGVuY29kZVVSSSh2YWx1ZSkpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaXNMaWtlZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTGlrZWQoKVxuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5pc0xvZ2dlZEluKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJMaWtlKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9naW4oKVxuICAgIH1cbiB9XG5cbiAgcmVuZGVyTG9naW4oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nIGxvZ2luXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY1wiPlxuICAgICAgICAgIExvb2tzIGxpa2UgeW91IGhhdmVuJ3QgbG9nZ2VkIGluIHlldC5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkxvZ2luIEtvem1vc1wiIG9uQ2xpY2s9eygpID0+IHRhYnMuY3JlYXRlKCdodHRwczovL2dldGtvem1vcy5jb20vbG9naW4nKX0+XG4gICAgICAgICAgTG9naW5cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJMaWtlZCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPExpa2VkRGlhbG9nIGlzSnVzdExpa2VkPXt0aGlzLnN0YXRlLmlzSnVzdExpa2VkfVxuICAgICAgICAgICAgICAgICAgIGxpa2U9e3RoaXMucHJvcHMucmVjb3JkfVxuICAgICAgICAgICAgICAgICAgIHVubGlrZT17dGhpcy5wcm9wcy51bmxpa2V9XG4gICAgICAgICAgICAgICAgICAgb25TdGFydExvYWRpbmc9e3RoaXMucHJvcHMub25TdGFydExvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgb25TdG9wTG9hZGluZz17dGhpcy5wcm9wcy5vblN0b3BMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgIG9uU3luYz17dGhpcy5wcm9wcy5vblN5bmN9XG4gICAgICAgICAgICAgICAgICAgb25FcnJvcj17dGhpcy5wcm9wcy5vbkVycm9yfVxuICAgICAgICAgICAgICAgICAgIC8+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTGlrZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2cgbGlrZVwiPlxuICAgICAgICA8SW5wdXQgb25QcmVzc0VudGVyPXt2YWx1ZSA9PiB0aGlzLnNlYXJjaCh2YWx1ZSl9IGljb249XCJzZWFyY2hcIiBwbGFjZWhvbGRlcj1cIlNlYXJjaCBZb3VyIEJvb2ttYXJrc1wiIGljb25TdHJva2U9XCIzXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjXCI+XG4gICAgICAgICAgWW91IGhhdmVuJ3QgbGlrZWQgdGhpcyBwYWdlIHlldC5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDbGljayB0byBhZGQgdGhpcyBwYWdlIHRvIHlvdXIgbGlrZXNcIiBpY29uPVwiaGVhcnRcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLmxpa2UoKX0+TGlrZSBJdDwvQnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tICdwcmVhY3QnXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICBwbGFjZWhvbGRlcjogdGhpcy5wcm9wcy5wbGFjZWhvbGRlclxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hdXRvZm9jdXMpIHRoaXMuZm9jdXMoKVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgcmV0dXJuIG5leHRTdGF0ZS52YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZVxuICB9XG5cbiAgZm9jdXMgKCkge1xuICAgIHRoaXMuZWwuZm9jdXMoKVxuICB9XG5cbiAgb25Gb2N1cyhlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwbGFjZWhvbGRlcjogXCJcIlxuICAgIH0pXG4gIH1cblxuICBvbkJsdXIoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGxhY2Vob2xkZXI6IHRoaXMucHJvcHMucGxhY2Vob2xkZXJcbiAgICB9KVxuICB9XG5cbiAgb25DaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmFsdWU6IGUudGFyZ2V0LnZhbHVlXG4gICAgfSlcblxuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuc3RhdGUudmFsdWUpXG4gICAgfVxuICB9XG5cbiAgb25LZXlVcChlKSB7XG4gICAgY29uc3QgdmFsdWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLm9uQ2hhbmdlKGUpXG5cbiAgICBpZiAoZS5rZXlDb2RlID09PSAyNykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBcIlwiIH0pXG5cbiAgICAgIGlmICh0aGlzLnByb3BzLm9uUHJlc3NFc2MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25QcmVzc0VzYyh2YWx1ZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZS5rZXlDb2RlID09PSAxMyAmJiB0aGlzLnByb3BzLm9uUHJlc3NFbnRlcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBcIlwiIH0pXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vblByZXNzRW50ZXIodmFsdWUpXG4gICAgfVxuXG4gICAgaWYgKGUua2V5Q29kZSA9PT0gMTg4ICYmIHRoaXMucHJvcHMub25UeXBlQ29tbWEpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogXCJcIiB9KVxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25QcmVzc0VudGVyKHZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dFwiPlxuICAgICAgICB7dGhpcy5wcm9wcy5pY29uID8gPEljb24gbmFtZT17dGhpcy5wcm9wcy5pY29ufSBzdHJva2U9e3RoaXMucHJvcHMuaWNvblN0cm9rZX0gLz4gOiBudWxsfVxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHQvY3NzXCJcbiAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnN0YXRlLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB0aGlzLm9uQ2hhbmdlKGUpfVxuICAgICAgICAgICAgICAgb25LZXlVcD17KGUpID0+IHRoaXMub25LZXlVcChlKX1cbiAgICAgICAgICAgICAgIG9uRm9jdXM9eyhlKSA9PiB0aGlzLm9uRm9jdXMoZSl9XG4gICAgICAgICAgICAgICBvbkJsdXI9eyhlKSA9PiB0aGlzLm9uQmx1cihlKX1cbiAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgICAgICAgcmVmPXtpbnB1dCA9PiB0aGlzLmVsID0gaW5wdXR9XG4gICAgICAgICAgICAgICB0eXBlPXt0aGlzLnByb3BzLnR5cGUgfHwgXCJ0ZXh0XCJ9XG4gICAgICAgICAgICAgICBhdXRvY29tcGxldGU9e3RoaXMucHJvcHMuYXV0b2NvbXBsZXRlID09PSBmYWxzZSA/IFwib2ZmXCIgOiBcIm9uXCJ9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IFRhZ2dpbmdGb3JtIGZyb20gXCIuL3RhZ2dpbmctZm9ybVwiXG5pbXBvcnQgcmVsYXRpdmVEYXRlIGZyb20gXCJyZWxhdGl2ZS1kYXRlXCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaWtlZERpYWxvZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5yZXNldChwcm9wcylcbiAgfVxuXG4gIHJlc2V0KHByb3BzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc09ubGluZTogbmF2aWdhdG9yLm9uTGluZSxcbiAgICAgIGlzSnVzdExpa2VkOiBwcm9wcy5pc0p1c3RMaWtlZCxcbiAgICAgIGxpa2U6IHByb3BzLmxpa2VcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZ1wiPlxuICAgICAgICB7dGhpcy5wcm9wcy5pc0p1c3RMaWtlZCA/IDxoMj5Eb25lLjwvaDI+IDogbnVsbH1cbiAgICAgICAgeyB0aGlzLnN0YXRlLmlzT25saW5lID8gdGhpcy5yZW5kZXJPbmxpbmVCb2R5KCkgOiB0aGlzLnJlbmRlck9mZmxpbmVCb2R5KCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyXCI+XG4gICAgICAgICAgPEljb24gbmFtZT1cInRyYXNoXCIgdGl0bGU9XCJVbmxpa2UgVGhpcyBQYWdlXCIgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy51bmxpa2UoKX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJPZmZsaW5lQm9keSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJvZmZsaW5lXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY1wiPlxuICAgICAgICAgIHt0aGlzLnJlbmRlckxpa2VkQWdvKCl9XG4gICAgICAgICAgPGJyIC8+PGJyIC8+XG4gICAgICAgICAgWW91J3JlIGN1cnJlbnRseSBvZmZsaW5lIGJ1dCBpdCdzIG9rLlxuICAgICAgICAgIDxiciAvPlxuICAgICAgICAgIFRoZSBjaGFuZ2VzIHdpbGwgc3luYyB3aGVuIHlvdSBjb25uZWN0LlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck9ubGluZUJvZHkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25saW5lXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmlzSnVzdExpa2VkID8gXCJZb3UgY2FuIGFkZCBzb21lIHRhZ3MsIHRvbzpcIiA6ICB0aGlzLnJlbmRlckxpa2VkQWdvKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8VGFnZ2luZ0Zvcm0gbGlrZT17dGhpcy5wcm9wcy5saWtlfVxuICAgICAgICAgICAgICAgICAgICAgb25BZGRUYWc9e3RoaXMucHJvcHMub25BZGRUYWd9XG4gICAgICAgICAgICAgICAgICAgICBvblJlbW92ZVRhZz17dGhpcy5wcm9wcy5vblJlbW92ZVRhZ31cbiAgICAgICAgICAgICAgICAgICAgIG9uU3RhcnRMb2FkaW5nPXt0aGlzLnByb3BzLm9uU3RhcnRMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICAgb25TdG9wTG9hZGluZz17dGhpcy5wcm9wcy5vblN0b3BMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICAgb25TeW5jPXt0aGlzLnByb3BzLm9uU3luY31cbiAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I9e3RoaXMucHJvcHMub25FcnJvcn1cbiAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJMaWtlZEFnbygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaWtlZC1hZ29cIj5cbiAgICAgICAgWW91IGxpa2VkIHRoaXMgcGFnZSB7cmVsYXRpdmVEYXRlKHRoaXMucHJvcHMubGlrZS5saWtlZEF0KX0uXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IElucHV0IGZyb20gXCIuL2lucHV0XCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuaW1wb3J0IGFwaSBmcm9tIFwiLi4vbGliL2FwaVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZ2dpbmdGb3JtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLmxvYWQoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgdGFnczogW11cbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICh0aGlzLnByb3BzLmxpa2UudXJsICE9PSBwcm9wcy5saWtlLnVybCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlzTG9hZGluZzogdHJ1ZSxcbiAgICAgICAgdGFnczogW11cbiAgICAgIH0pXG4gICAgICB0aGlzLmxvYWQoKVxuICAgIH1cbiAgfVxuXG4gIGxvYWQoKSB7XG4gICAgdGhpcy5wcm9wcy5vblN0YXJ0TG9hZGluZygpXG5cbiAgICBhcGkucG9zdChcIi9hcGkvbGlrZS10YWdzXCIsIHsgXCJ1cmxcIjogdGhpcy5wcm9wcy5saWtlLnVybCB9LCAoZXJyLCByZXNwKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLm9uU3RvcExvYWRpbmcoKVxuXG4gICAgICBpZiAoZXJyKSByZXR1cm4gdGhpcy5wcm9wcy5vbkVycm9yKGVycilcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHRhZ3M6IHJlc3AudGFncyxcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgYWRkVGFnKHRhZykge1xuICAgIHRoaXMucHJvcHMub25TdGFydExvYWRpbmcoKVxuXG4gICAgY29uc3QgdGFncyA9IHRhZy5zcGxpdCgvLFxccyovKVxuXG4gICAgYXBpLnB1dCgnL2FwaS9saWtlLXRhZ3MnLCB7IHRhZ3M6IHRhZ3MsIHVybDogdGhpcy5wcm9wcy5saWtlLnVybCB9LCBlcnIgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5vblN0b3BMb2FkaW5nKClcbiAgICAgIGlmIChlcnIpIHJldHVybiB0aGlzLnByb3BzLm9uRXJyb3IoZXJyKVxuICAgICAgdGhpcy5sb2FkKClcbiAgICB9KVxuXG4gICAgY29uc3QgY29weSA9IHRoaXMuc3RhdGUudGFncy5zbGljZSgpXG4gICAgY29weS5wdXNoLmFwcGx5KGNvcHksIHRhZ3MpXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRhZ3M6IGNvcHkgfSlcbiAgfVxuXG4gIGRlbGV0ZVRhZyh0YWcpIHtcbiAgICB0aGlzLnByb3BzLm9uU3RhcnRMb2FkaW5nKClcblxuICAgIGFwaS5kZWxldGUoJy9hcGkvbGlrZS10YWdzJywgeyB0YWc6IHRhZywgdXJsOiB0aGlzLnByb3BzLmxpa2UudXJsIH0sIGVyciA9PiB7XG4gICAgICB0aGlzLnByb3BzLm9uU3RvcExvYWRpbmcoKVxuICAgICAgaWYgKGVycikgcmV0dXJuIHRoaXMucHJvcHMub25FcnJvcihlcnIpXG4gICAgICB0aGlzLmxvYWQoKVxuICAgIH0pXG5cbiAgICBjb25zdCBjb3B5ID0gdGhpcy5zdGF0ZS50YWdzLnNsaWNlKClcbiAgICBsZXQgaW5kZXggPSAtMVxuXG4gICAgbGV0IGkgPSBjb3B5Lmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGlmIChjb3B5W2ldID09PSB0YWcgfHwgY29weVtpXS5uYW1lID09IHRhZykge1xuICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBjb3B5LnNwbGljZShpbmRleCwgMSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0YWdzOiBjb3B5IH0pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhZ2dpbmctZm9ybVwiPlxuICAgICAgICA8SW5wdXQgb25QcmVzc0VudGVyPXt2YWx1ZSA9PiB0aGlzLmFkZFRhZyh2YWx1ZSl9IG9uVHlwZUNvbW1hPXt2YWx1ZSA9PiB0aGlzLmFkZFRhZyh2YWx1ZSl9IGljb249XCJ0YWdcIiBwbGFjZWhvbGRlcj1cIlR5cGUgYSB0YWcgJiBoaXQgZW50ZXJcIiBhdXRvZm9jdXMgLz5cbiAgICAgICAge3RoaXMucmVuZGVyVGFncygpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGFncygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50YWdzLmxlbmd0aCA9PSAwKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhZ3NcIj5cbiAgICAgICAge3RoaXMuc3RhdGUudGFncy5tYXAodCA9PiB0aGlzLnJlbmRlclRhZyh0KSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUYWcodGFnKSB7XG4gICAgaWYgKHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0YWcgPSB7IG5hbWU6IHRhZyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFnXCI+XG4gICAgICAgIDxJY29uIG5hbWU9XCJjbG9zZVwiIHN0cm9rZT1cIjVcIiB0aXRsZT17YERlbGV0ZSBcIiR7dGFnLm5hbWV9XCJgfSBvbmNsaWNrPXsoKSA9PiB0aGlzLmRlbGV0ZVRhZyh0YWcubmFtZSl9IC8+XG4gICAgICAgIHt0YWcubmFtZX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldEFzTGlrZWQsXG4gIHNldEFzTm90TGlrZWQsXG4gIHNldEFzTG9hZGluZ1xufVxuXG5mdW5jdGlvbiBzZXRBc0xpa2VkICgpIHtcbiAgc2V0SWNvbihzYWZhcmkuZXh0ZW5zaW9uLmJhc2VVUkkgKyAnaW1hZ2VzL2hlYXJ0LWljb24tbGlrZWQucG5nJylcbiAgc2V0VG9vbHRpcChcIlVubGlrZSB0aGlzIHBhZ2VcIilcbn1cblxuZnVuY3Rpb24gc2V0QXNOb3RMaWtlZCgpIHtcbiAgc2V0SWNvbihzYWZhcmkuZXh0ZW5zaW9uLmJhc2VVUkkgKyAnaW1hZ2VzL2hlYXJ0LWljb24ucG5nJylcbiAgc2V0VG9vbHRpcChcIkxpa2UgVGhpcyBQYWdlXCIpXG59XG5cbmZ1bmN0aW9uIHNldEFzTG9hZGluZygpIHtcbiAgc2V0SWNvbihzYWZhcmkuZXh0ZW5zaW9uLmJhc2VVUkkgKyAnaW1hZ2VzL2hlYXJ0LWljb24tbG9hZGluZy5wbmcnKVxuICBzZXRUb29sdGlwKFwiQ29ubmVjdGluZyB0byBLb3ptb3MuLi5cIilcbn1cblxuZnVuY3Rpb24gc2V0SWNvbiAoc3JjKSB7XG4gIHNhZmFyaS5leHRlbnNpb24udG9vbGJhckl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKHRvb2xiYXIpIHtcbiAgICB0b29sYmFyLmltYWdlID0gc3JjXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHNldFRvb2x0aXAgKHRleHQpIHtcbiAgc2FmYXJpLmV4dGVuc2lvbi50b29sYmFySXRlbXMuZm9yRWFjaChmdW5jdGlvbiAodG9vbGJhcikge1xuICAgIHRvb2xiYXIudG9vbFRpcCA9IHRleHRcbiAgfSlcbn1cbiIsInZhciBsYXN0VVJMID0gJydcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZSxcbiAgY3VycmVudCxcbiAgb25VcGRhdGVkXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSAodXJsKSB7XG4gIHNhZmFyaS5hcHBsaWNhdGlvbi5hY3RpdmVCcm93c2VyV2luZG93Lm9wZW5UYWIoKS51cmwgPSB1cmw7XG4gIHNhZmFyaS5zZWxmLmhpZGUoKTtcbn1cblxuZnVuY3Rpb24gY3VycmVudCAoKSB7XG4gIHJldHVybiBzYWZhcmkuYXBwbGljYXRpb24uYWN0aXZlQnJvd3NlcldpbmRvdy5hY3RpdmVUYWJcbn1cblxuZnVuY3Rpb24gb25VcGRhdGVkIChjYWxsYmFjaykge1xuICBzYWZhcmkuYXBwbGljYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImFjdGl2YXRlXCIsIG9uY2hhbmdlLCB0cnVlKTtcbiAgc2FmYXJpLmFwcGxpY2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmVOYXZpZ2F0ZVwiLCBvbmNoYW5nZSwgdHJ1ZSk7XG4gIHNhZmFyaS5hcHBsaWNhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgb25jaGFuZ2UsIHRydWUpO1xuXG4gIGNoZWNrKClcblxuICBmdW5jdGlvbiBvbmNoYW5nZSAoZXZlbnQpIHtcbiAgICBpZiAoY3VycmVudCgpLnVybCA9PT0gbGFzdFVSTCkgcmV0dXJuXG4gICAgbGFzdFVSTCA9IGN1cnJlbnQoKS51cmxcbiAgICBjYWxsYmFjaygpXG4gIH1cblxuICBmdW5jdGlvbiBjaGVjayAoKSB7XG4gICAgb25jaGFuZ2UoKVxuICAgIHNldFRpbWVvdXQoY2hlY2ssIDUwMClcbiAgfVxufVxuIl19
