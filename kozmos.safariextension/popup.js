(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "host": "https://getkozmos.com"
}

},{}],2:[function(require,module,exports){
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

},{"../config":1}],3:[function(require,module,exports){
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

},{"preact":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _button = require("../popup/button");

var _button2 = _interopRequireDefault(_button);

var _likedDialog = require("../popup/liked-dialog");

var _likedDialog2 = _interopRequireDefault(_likedDialog);

var _input = require("../popup/input");

var _input2 = _interopRequireDefault(_input);

var _tabs = require("../safari/tabs");

var _tabs2 = _interopRequireDefault(_tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dialog = function (_Component) {
  _inherits(Dialog, _Component);

  function Dialog() {
    _classCallCheck(this, Dialog);

    return _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).apply(this, arguments));
  }

  _createClass(Dialog, [{
    key: "search",
    value: function search(value) {
      _tabs2.default.create('https://getkozmos.com/search?q=' + encodeURI(value));
      safari.self.hide();
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
              _tabs2.default.create('https://getkozmos.com/login');safari.self.hide();
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

},{"../popup/button":8,"../popup/input":9,"../popup/liked-dialog":10,"../safari/tabs":13,"preact":4}],7:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _tabs = require("../safari/tabs");

var _tabs2 = _interopRequireDefault(_tabs);

var _icons = require("../safari/icons");

var _dialog = require("./dialog");

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

},{"../popup/icon":3,"../safari/icons":12,"../safari/tabs":13,"./dialog":6,"preact":4}],8:[function(require,module,exports){
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

},{"./icon":3,"preact":4}],9:[function(require,module,exports){
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

},{"./icon":3,"preact":4}],10:[function(require,module,exports){
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

},{"./icon":3,"./tagging-form":11,"preact":4,"relative-date":5}],11:[function(require,module,exports){
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

},{"../lib/api":2,"./icon":3,"./input":9,"preact":4}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
"use strict";

var lastURL = '';

module.exports = {
  create: create,
  current: current,
  onUpdated: onUpdated
};

function create(url) {
  safari.application.activeBrowserWindow.openTab().url = url;
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

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcuanNvbiIsImxpYi9hcGkuanMiLCJuZXd0YWIvaWNvbi5qcyIsIm5vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QuanMiLCJub2RlX21vZHVsZXMvcmVsYXRpdmUtZGF0ZS9saWIvcmVsYXRpdmUtZGF0ZS5qcyIsInBvcHVwLXNhZmFyaS9kaWFsb2cuanMiLCJwb3B1cC1zYWZhcmkvcG9wdXAuanMiLCJwb3B1cC9idXR0b24uanMiLCJwb3B1cC9pbnB1dC5qcyIsInBvcHVwL2xpa2VkLWRpYWxvZy5qcyIsInBvcHVwL3RhZ2dpbmctZm9ybS5qcyIsInNhZmFyaS9pY29ucy5qcyIsInNhZmFyaS90YWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNIQSxJQUFNLFNBQVMsUUFBUSxXQUFSLENBQWY7O0FBRUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2Ysb0JBRGU7QUFFZixVQUZlO0FBR2YsWUFIZTtBQUlmLFVBSmU7QUFLZixVQUFRO0FBTE8sQ0FBakI7O0FBUUEsU0FBUyxRQUFULENBQW1CLE1BQW5CLEVBQTJCLEdBQTNCLEVBQWdDLElBQWhDLEVBQXNDLFFBQXRDLEVBQWdEO0FBQzlDLE1BQU0sUUFBUSxhQUFhLE9BQWIsQ0FBZDs7QUFFQSxNQUFJLENBQUMsS0FBTCxFQUFZLE9BQU8sU0FBUyxJQUFJLEtBQUosQ0FBVSx1QkFBVixDQUFULENBQVA7O0FBRVosTUFBSSxVQUFVLElBQUksY0FBSixFQUFkO0FBQ0EsVUFBUSxJQUFSLENBQWEsTUFBYixFQUFxQixPQUFPLElBQVAsR0FBYyxHQUFuQzs7QUFFQSxVQUFRLGdCQUFSLENBQXlCLGFBQXpCLEVBQXdDLEtBQXhDOztBQUVBLE1BQUksSUFBSixFQUFVO0FBQ1IsWUFBUSxnQkFBUixDQUF5QixjQUF6QixFQUF5QyxrQkFBekM7QUFDQSxZQUFRLElBQVIsQ0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFyQixFQUEyQjtBQUN6QixTQUFPLFNBQVAsQ0FBaUIsWUFBakIsQ0FBOEIsT0FBOUIsQ0FBc0MsVUFBVSxPQUFWLEVBQW1CO0FBQ3ZELFlBQVEsT0FBUixHQUFrQixJQUFsQjtBQUNELEdBRkQ7QUFHRDs7Ozs7QUMvQkQsSUFBSSxVQUFVLEVBQWQ7O0FBRUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsZ0JBRGU7QUFFZixrQkFGZTtBQUdmO0FBSGUsQ0FBakI7O0FBTUEsU0FBUyxNQUFULENBQWlCLEdBQWpCLEVBQXNCO0FBQ3BCLFNBQU8sV0FBUCxDQUFtQixtQkFBbkIsQ0FBdUMsT0FBdkMsR0FBaUQsR0FBakQsR0FBdUQsR0FBdkQ7QUFDRDs7QUFFRCxTQUFTLE9BQVQsR0FBb0I7QUFDbEIsU0FBTyxPQUFPLFdBQVAsQ0FBbUIsbUJBQW5CLENBQXVDLFNBQTlDO0FBQ0Q7O0FBRUQsU0FBUyxTQUFULENBQW9CLFFBQXBCLEVBQThCO0FBQzVCLFNBQU8sV0FBUCxDQUFtQixnQkFBbkIsQ0FBb0MsVUFBcEMsRUFBZ0QsUUFBaEQsRUFBMEQsSUFBMUQ7QUFDQSxTQUFPLFdBQVAsQ0FBbUIsZ0JBQW5CLENBQW9DLGdCQUFwQyxFQUFzRCxRQUF0RCxFQUFnRSxJQUFoRTtBQUNBLFNBQU8sV0FBUCxDQUFtQixnQkFBbkIsQ0FBb0MsVUFBcEMsRUFBZ0QsUUFBaEQsRUFBMEQsSUFBMUQ7O0FBRUE7O0FBRUEsV0FBUyxRQUFULENBQW1CLEtBQW5CLEVBQTBCO0FBQ3hCLFFBQUksVUFBVSxHQUFWLEtBQWtCLE9BQXRCLEVBQStCO0FBQy9CLGNBQVUsVUFBVSxHQUFwQjtBQUNBO0FBQ0Q7O0FBRUQsV0FBUyxLQUFULEdBQWtCO0FBQ2hCO0FBQ0EsZUFBVyxLQUFYLEVBQWtCLEdBQWxCO0FBQ0Q7QUFDRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwiaG9zdFwiOiBcImh0dHBzOi8vZ2V0a296bW9zLmNvbVwiXG59XG4iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZW5kSlNPTixcbiAgZ2V0LFxuICBwb3N0LFxuICBwdXQsXG4gIGRlbGV0ZTogZGVsZXRlRm5cbn1cblxuZnVuY3Rpb24gc2VuZEpTT04gKG1ldGhvZCwgdXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZVsndG9rZW4nXVxuXG4gIGlmICghdG9rZW4pIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ0xvZ2luIHJlcXVpcmVkICg0MDEpLicpKVxuXG4gIHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHhtbGh0dHAub3BlbihtZXRob2QsIGNvbmZpZy5ob3N0ICsgdXJsKTtcblxuICB4bWxodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJYLUFQSS1Ub2tlblwiLCB0b2tlbilcblxuICBpZiAoZGF0YSkge1xuICAgIHhtbGh0dHAuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgeG1saHR0cC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgfSBlbHNlIHtcbiAgICB4bWxodHRwLnNlbmQobnVsbCk7XG4gIH1cblxuICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoeG1saHR0cC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoeG1saHR0cC5zdGF0dXMgPj0gNTAwKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKHBhcnNlZC5lcnJvcikpXG4gICAgfVxuXG4gICAgaWYgKHhtbGh0dHAuc3RhdHVzID09IDQwMSkge1xuICAgICAgbG9jYWxTdG9yYWdlWyd0b2tlbiddID0gXCJcIlxuICAgICAgbG9jYWxTdG9yYWdlWyduYW1lJ10gPSBcIlwiXG4gICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdVbmF1dGhvcml6ZWQgKDQwMSknKSlcbiAgICB9XG5cbiAgICBpZiAoeG1saHR0cC5zdGF0dXMgPT0gNDA0KSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdOb3QgZm91bmQnKSlcbiAgICB9XG5cbiAgICBpZiAoeG1saHR0cC5zdGF0dXMgPj0gMzAwKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdSZXF1ZXN0IGVycm9yOiAnICsgeG1saHR0cC5zdGF0dXMpKVxuICAgIH1cblxuICAgIHZhciBwYXJzZWQgPSBudWxsXG4gICAgdmFyIGVyciA9IG51bGxcblxuICAgIHRyeSB7XG4gICAgICBwYXJzZWQgPUpTT04ucGFyc2UoeG1saHR0cC5yZXNwb25zZVRleHQpXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoJ0FuIGVycm9yIGhhcHBlbmVkJylcbiAgICB9XG5cbiAgICBjYWxsYmFjayhlcnIsIHBhcnNlZClcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXQgKHVybCwgY2FsbGJhY2spIHtcbiAgc2VuZEpTT04oJ0dFVCcsIHVybCwgbnVsbCwgY2FsbGJhY2spXG59XG5cbmZ1bmN0aW9uIHBvc3QgKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgc2VuZEpTT04oJ1BPU1QnLCB1cmwsIGRhdGEsIGNhbGxiYWNrKVxufVxuXG5mdW5jdGlvbiBwdXQgKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgc2VuZEpTT04oJ1BVVCcsIHVybCwgZGF0YSwgY2FsbGJhY2spXG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUZuICh1cmwsIGRhdGEsIGNhbGxiYWNrKSB7XG4gIHNlbmRKU09OKCdERUxFVEUnLCB1cmwsIGRhdGEsIGNhbGxiYWNrKVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEljb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgbWV0aG9kID0gdGhpc1sncmVuZGVyJyArIHRoaXMucHJvcHMubmFtZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgwLCAxKSArIHRoaXMucHJvcHMubmFtZS5zbGljZSgxKV1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja30gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7dGhpcy5wcm9wcy5uYW1lfWB9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21ldGhvZCA/IG1ldGhvZC5jYWxsKHRoaXMpIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHN0cm9rZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc3Ryb2tlIHx8IDJcbiAgfVxuXG4gIHJlbmRlckFsZXJ0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1hbGVydFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTE2IDMgTDMwIDI5IDIgMjkgWiBNMTYgMTEgTDE2IDE5IE0xNiAyMyBMMTYgMjVcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2xvY2soKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWNsb2NrXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNlwiIGN5PVwiMTZcIiByPVwiMTRcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTE2IDggTDE2IDE2IDIwIDIwXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsb3NlKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jbG9zZVwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTIgMzAgTDMwIDIgTTMwIDMwIEwyIDJcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySGVhcnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWhlYXJ0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJjdXJyZW50Y29sb3JcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMuc3Ryb2tlKCl9PlxuICAgICAgICA8cGF0aCBkPVwiTTQgMTYgQzEgMTIgMiA2IDcgNCAxMiAyIDE1IDYgMTYgOCAxNyA2IDIxIDIgMjYgNCAzMSA2IDMxIDEyIDI4IDE2IDI1IDIwIDE2IDI4IDE2IDI4IDE2IDI4IDcgMjAgNCAxNiBaXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNlYXJjaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktc2VhcmNoXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNFwiIGN5PVwiMTRcIiByPVwiMTJcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTIzIDIzIEwzMCAzMFwiICAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRXh0ZXJuYWwoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWV4dGVybmFsXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTQgOSBMMyA5IDMgMjkgMjMgMjkgMjMgMTggTTE4IDQgTDI4IDQgMjggMTQgTTI4IDQgTDE0IDE4XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRhZygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktdGFnXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIyNFwiIGN5PVwiOFwiIHI9XCIyXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0yIDE4IEwxOCAyIDMwIDIgMzAgMTQgMTQgMzAgWlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJUcmFzaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktdHJhc2hcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0yOCA2IEw2IDYgOCAzMCAyNCAzMCAyNiA2IDQgNiBNMTYgMTIgTDE2IDI0IE0yMSAxMiBMMjAgMjQgTTExIDEyIEwxMiAyNCBNMTIgNiBMMTMgMiAxOSAyIDIwIDZcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUmlnaHRDaGV2cm9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jaGV2cm9uLXJpZ2h0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTIgMzAgTDI0IDE2IDEyIDJcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXNldHRpbmdzXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTMgMiBMMTMgNiAxMSA3IDggNCA0IDggNyAxMSA2IDEzIDIgMTMgMiAxOSA2IDE5IDcgMjEgNCAyNCA4IDI4IDExIDI1IDEzIDI2IDEzIDMwIDE5IDMwIDE5IDI2IDIxIDI1IDI0IDI4IDI4IDI0IDI1IDIxIDI2IDE5IDMwIDE5IDMwIDEzIDI2IDEzIDI1IDExIDI4IDggMjQgNCAyMSA3IDE5IDYgMTkgMiBaXCIgLz5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjE2XCIgY3k9XCIxNlwiIHI9XCI0XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLW1zZ1wiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTIgNCBMMzAgNCAzMCAyMiAxNiAyMiA4IDI5IDggMjIgMiAyMiBaXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxufVxuIiwiIWZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBmdW5jdGlvbiBWTm9kZSgpIHt9XG4gICAgZnVuY3Rpb24gaChub2RlTmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgbGFzdFNpbXBsZSwgY2hpbGQsIHNpbXBsZSwgaSwgY2hpbGRyZW4gPSBFTVBUWV9DSElMRFJFTjtcbiAgICAgICAgZm9yIChpID0gYXJndW1lbnRzLmxlbmd0aDsgaS0tID4gMjsgKSBzdGFjay5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzICYmIG51bGwgIT0gYXR0cmlidXRlcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgaWYgKCFzdGFjay5sZW5ndGgpIHN0YWNrLnB1c2goYXR0cmlidXRlcy5jaGlsZHJlbik7XG4gICAgICAgICAgICBkZWxldGUgYXR0cmlidXRlcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSBpZiAoKGNoaWxkID0gc3RhY2sucG9wKCkpICYmIHZvaWQgMCAhPT0gY2hpbGQucG9wKSBmb3IgKGkgPSBjaGlsZC5sZW5ndGg7IGktLTsgKSBzdGFjay5wdXNoKGNoaWxkW2ldKTsgZWxzZSB7XG4gICAgICAgICAgICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiBjaGlsZCkgY2hpbGQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHNpbXBsZSA9ICdmdW5jdGlvbicgIT0gdHlwZW9mIG5vZGVOYW1lKSBpZiAobnVsbCA9PSBjaGlsZCkgY2hpbGQgPSAnJzsgZWxzZSBpZiAoJ251bWJlcicgPT0gdHlwZW9mIGNoaWxkKSBjaGlsZCA9IFN0cmluZyhjaGlsZCk7IGVsc2UgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBjaGlsZCkgc2ltcGxlID0gITE7XG4gICAgICAgICAgICBpZiAoc2ltcGxlICYmIGxhc3RTaW1wbGUpIGNoaWxkcmVuW2NoaWxkcmVuLmxlbmd0aCAtIDFdICs9IGNoaWxkOyBlbHNlIGlmIChjaGlsZHJlbiA9PT0gRU1QVFlfQ0hJTERSRU4pIGNoaWxkcmVuID0gWyBjaGlsZCBdOyBlbHNlIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgbGFzdFNpbXBsZSA9IHNpbXBsZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcCA9IG5ldyBWTm9kZSgpO1xuICAgICAgICBwLm5vZGVOYW1lID0gbm9kZU5hbWU7XG4gICAgICAgIHAuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgcC5hdHRyaWJ1dGVzID0gbnVsbCA9PSBhdHRyaWJ1dGVzID8gdm9pZCAwIDogYXR0cmlidXRlcztcbiAgICAgICAgcC5rZXkgPSBudWxsID09IGF0dHJpYnV0ZXMgPyB2b2lkIDAgOiBhdHRyaWJ1dGVzLmtleTtcbiAgICAgICAgaWYgKHZvaWQgMCAhPT0gb3B0aW9ucy52bm9kZSkgb3B0aW9ucy52bm9kZShwKTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV4dGVuZChvYmosIHByb3BzKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gcHJvcHMpIG9ialtpXSA9IHByb3BzW2ldO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbG9uZUVsZW1lbnQodm5vZGUsIHByb3BzKSB7XG4gICAgICAgIHJldHVybiBoKHZub2RlLm5vZGVOYW1lLCBleHRlbmQoZXh0ZW5kKHt9LCB2bm9kZS5hdHRyaWJ1dGVzKSwgcHJvcHMpLCBhcmd1bWVudHMubGVuZ3RoID4gMiA/IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IHZub2RlLmNoaWxkcmVuKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX19kICYmIChjb21wb25lbnQuX19kID0gITApICYmIDEgPT0gaXRlbXMucHVzaChjb21wb25lbnQpKSAob3B0aW9ucy5kZWJvdW5jZVJlbmRlcmluZyB8fCBkZWZlcikocmVyZW5kZXIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXJlbmRlcigpIHtcbiAgICAgICAgdmFyIHAsIGxpc3QgPSBpdGVtcztcbiAgICAgICAgaXRlbXMgPSBbXTtcbiAgICAgICAgd2hpbGUgKHAgPSBsaXN0LnBvcCgpKSBpZiAocC5fX2QpIHJlbmRlckNvbXBvbmVudChwKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNTYW1lTm9kZVR5cGUobm9kZSwgdm5vZGUsIGh5ZHJhdGluZykge1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlIHx8ICdudW1iZXInID09IHR5cGVvZiB2bm9kZSkgcmV0dXJuIHZvaWQgMCAhPT0gbm9kZS5zcGxpdFRleHQ7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUubm9kZU5hbWUpIHJldHVybiAhbm9kZS5fY29tcG9uZW50Q29uc3RydWN0b3IgJiYgaXNOYW1lZE5vZGUobm9kZSwgdm5vZGUubm9kZU5hbWUpOyBlbHNlIHJldHVybiBoeWRyYXRpbmcgfHwgbm9kZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc05hbWVkTm9kZShub2RlLCBub2RlTmFtZSkge1xuICAgICAgICByZXR1cm4gbm9kZS5fX24gPT09IG5vZGVOYW1lIHx8IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0Tm9kZVByb3BzKHZub2RlKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyk7XG4gICAgICAgIHByb3BzLmNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG4gICAgICAgIHZhciBkZWZhdWx0UHJvcHMgPSB2bm9kZS5ub2RlTmFtZS5kZWZhdWx0UHJvcHM7XG4gICAgICAgIGlmICh2b2lkIDAgIT09IGRlZmF1bHRQcm9wcykgZm9yICh2YXIgaSBpbiBkZWZhdWx0UHJvcHMpIGlmICh2b2lkIDAgPT09IHByb3BzW2ldKSBwcm9wc1tpXSA9IGRlZmF1bHRQcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVOb2RlKG5vZGVOYW1lLCBpc1N2Zykge1xuICAgICAgICB2YXIgbm9kZSA9IGlzU3ZnID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIG5vZGVOYW1lKSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuICAgICAgICBub2RlLl9fbiA9IG5vZGVOYW1lO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlKSB7XG4gICAgICAgIHZhciBwYXJlbnROb2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocGFyZW50Tm9kZSkgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0QWNjZXNzb3Iobm9kZSwgbmFtZSwgb2xkLCB2YWx1ZSwgaXNTdmcpIHtcbiAgICAgICAgaWYgKCdjbGFzc05hbWUnID09PSBuYW1lKSBuYW1lID0gJ2NsYXNzJztcbiAgICAgICAgaWYgKCdrZXknID09PSBuYW1lKSA7IGVsc2UgaWYgKCdyZWYnID09PSBuYW1lKSB7XG4gICAgICAgICAgICBpZiAob2xkKSBvbGQobnVsbCk7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHZhbHVlKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKCdjbGFzcycgPT09IG5hbWUgJiYgIWlzU3ZnKSBub2RlLmNsYXNzTmFtZSA9IHZhbHVlIHx8ICcnOyBlbHNlIGlmICgnc3R5bGUnID09PSBuYW1lKSB7XG4gICAgICAgICAgICBpZiAoIXZhbHVlIHx8ICdzdHJpbmcnID09IHR5cGVvZiB2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2Ygb2xkKSBub2RlLnN0eWxlLmNzc1RleHQgPSB2YWx1ZSB8fCAnJztcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiAnb2JqZWN0JyA9PSB0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIG9sZCkgZm9yICh2YXIgaSBpbiBvbGQpIGlmICghKGkgaW4gdmFsdWUpKSBub2RlLnN0eWxlW2ldID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkgbm9kZS5zdHlsZVtpXSA9ICdudW1iZXInID09IHR5cGVvZiB2YWx1ZVtpXSAmJiAhMSA9PT0gSVNfTk9OX0RJTUVOU0lPTkFMLnRlc3QoaSkgPyB2YWx1ZVtpXSArICdweCcgOiB2YWx1ZVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgnZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwnID09PSBuYW1lKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIG5vZGUuaW5uZXJIVE1MID0gdmFsdWUuX19odG1sIHx8ICcnO1xuICAgICAgICB9IGVsc2UgaWYgKCdvJyA9PSBuYW1lWzBdICYmICduJyA9PSBuYW1lWzFdKSB7XG4gICAgICAgICAgICB2YXIgdXNlQ2FwdHVyZSA9IG5hbWUgIT09IChuYW1lID0gbmFtZS5yZXBsYWNlKC9DYXB0dXJlJC8sICcnKSk7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpLnN1YnN0cmluZygyKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghb2xkKSBub2RlLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZXZlbnRQcm94eSwgdXNlQ2FwdHVyZSk7XG4gICAgICAgICAgICB9IGVsc2Ugbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgKG5vZGUuX19sIHx8IChub2RlLl9fbCA9IHt9KSlbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmICgnbGlzdCcgIT09IG5hbWUgJiYgJ3R5cGUnICE9PSBuYW1lICYmICFpc1N2ZyAmJiBuYW1lIGluIG5vZGUpIHtcbiAgICAgICAgICAgIHNldFByb3BlcnR5KG5vZGUsIG5hbWUsIG51bGwgPT0gdmFsdWUgPyAnJyA6IHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChudWxsID09IHZhbHVlIHx8ICExID09PSB2YWx1ZSkgbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbnMgPSBpc1N2ZyAmJiBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvXnhsaW5rXFw6Py8sICcnKSk7XG4gICAgICAgICAgICBpZiAobnVsbCA9PSB2YWx1ZSB8fCAhMSA9PT0gdmFsdWUpIGlmIChucykgbm9kZS5yZW1vdmVBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsIG5hbWUudG9Mb3dlckNhc2UoKSk7IGVsc2Ugbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7IGVsc2UgaWYgKCdmdW5jdGlvbicgIT0gdHlwZW9mIHZhbHVlKSBpZiAobnMpIG5vZGUuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBuYW1lLnRvTG93ZXJDYXNlKCksIHZhbHVlKTsgZWxzZSBub2RlLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0UHJvcGVydHkobm9kZSwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG5vZGVbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gICAgZnVuY3Rpb24gZXZlbnRQcm94eShlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fbFtlLnR5cGVdKG9wdGlvbnMuZXZlbnQgJiYgb3B0aW9ucy5ldmVudChlKSB8fCBlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmx1c2hNb3VudHMoKSB7XG4gICAgICAgIHZhciBjO1xuICAgICAgICB3aGlsZSAoYyA9IG1vdW50cy5wb3AoKSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWZ0ZXJNb3VudCkgb3B0aW9ucy5hZnRlck1vdW50KGMpO1xuICAgICAgICAgICAgaWYgKGMuY29tcG9uZW50RGlkTW91bnQpIGMuY29tcG9uZW50RGlkTW91bnQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBwYXJlbnQsIGNvbXBvbmVudFJvb3QpIHtcbiAgICAgICAgaWYgKCFkaWZmTGV2ZWwrKykge1xuICAgICAgICAgICAgaXNTdmdNb2RlID0gbnVsbCAhPSBwYXJlbnQgJiYgdm9pZCAwICE9PSBwYXJlbnQub3duZXJTVkdFbGVtZW50O1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gbnVsbCAhPSBkb20gJiYgISgnX19wcmVhY3RhdHRyXycgaW4gZG9tKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmV0ID0gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpO1xuICAgICAgICBpZiAocGFyZW50ICYmIHJldC5wYXJlbnROb2RlICE9PSBwYXJlbnQpIHBhcmVudC5hcHBlbmRDaGlsZChyZXQpO1xuICAgICAgICBpZiAoIS0tZGlmZkxldmVsKSB7XG4gICAgICAgICAgICBoeWRyYXRpbmcgPSAhMTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50Um9vdCkgZmx1c2hNb3VudHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgY29tcG9uZW50Um9vdCkge1xuICAgICAgICB2YXIgb3V0ID0gZG9tLCBwcmV2U3ZnTW9kZSA9IGlzU3ZnTW9kZTtcbiAgICAgICAgaWYgKG51bGwgPT0gdm5vZGUgfHwgJ2Jvb2xlYW4nID09IHR5cGVvZiB2bm9kZSkgdm5vZGUgPSAnJztcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHtcbiAgICAgICAgICAgIGlmIChkb20gJiYgdm9pZCAwICE9PSBkb20uc3BsaXRUZXh0ICYmIGRvbS5wYXJlbnROb2RlICYmICghZG9tLl9jb21wb25lbnQgfHwgY29tcG9uZW50Um9vdCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLm5vZGVWYWx1ZSAhPSB2bm9kZSkgZG9tLm5vZGVWYWx1ZSA9IHZub2RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2bm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tLnBhcmVudE5vZGUpIGRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChvdXQsIGRvbSk7XG4gICAgICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGRvbSwgITApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dC5fX3ByZWFjdGF0dHJfID0gITA7XG4gICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICB9XG4gICAgICAgIHZhciB2bm9kZU5hbWUgPSB2bm9kZS5ub2RlTmFtZTtcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHZub2RlTmFtZSkgcmV0dXJuIGJ1aWxkQ29tcG9uZW50RnJvbVZOb2RlKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgaXNTdmdNb2RlID0gJ3N2ZycgPT09IHZub2RlTmFtZSA/ICEwIDogJ2ZvcmVpZ25PYmplY3QnID09PSB2bm9kZU5hbWUgPyAhMSA6IGlzU3ZnTW9kZTtcbiAgICAgICAgdm5vZGVOYW1lID0gU3RyaW5nKHZub2RlTmFtZSk7XG4gICAgICAgIGlmICghZG9tIHx8ICFpc05hbWVkTm9kZShkb20sIHZub2RlTmFtZSkpIHtcbiAgICAgICAgICAgIG91dCA9IGNyZWF0ZU5vZGUodm5vZGVOYW1lLCBpc1N2Z01vZGUpO1xuICAgICAgICAgICAgaWYgKGRvbSkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChkb20uZmlyc3RDaGlsZCkgb3V0LmFwcGVuZENoaWxkKGRvbS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLnBhcmVudE5vZGUpIGRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChvdXQsIGRvbSk7XG4gICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoZG9tLCAhMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZjID0gb3V0LmZpcnN0Q2hpbGQsIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8sIHZjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAobnVsbCA9PSBwcm9wcykge1xuICAgICAgICAgICAgcHJvcHMgPSBvdXQuX19wcmVhY3RhdHRyXyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgYSA9IG91dC5hdHRyaWJ1dGVzLCBpID0gYS5sZW5ndGg7IGktLTsgKSBwcm9wc1thW2ldLm5hbWVdID0gYVtpXS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWh5ZHJhdGluZyAmJiB2Y2hpbGRyZW4gJiYgMSA9PT0gdmNoaWxkcmVuLmxlbmd0aCAmJiAnc3RyaW5nJyA9PSB0eXBlb2YgdmNoaWxkcmVuWzBdICYmIG51bGwgIT0gZmMgJiYgdm9pZCAwICE9PSBmYy5zcGxpdFRleHQgJiYgbnVsbCA9PSBmYy5uZXh0U2libGluZykge1xuICAgICAgICAgICAgaWYgKGZjLm5vZGVWYWx1ZSAhPSB2Y2hpbGRyZW5bMF0pIGZjLm5vZGVWYWx1ZSA9IHZjaGlsZHJlblswXTtcbiAgICAgICAgfSBlbHNlIGlmICh2Y2hpbGRyZW4gJiYgdmNoaWxkcmVuLmxlbmd0aCB8fCBudWxsICE9IGZjKSBpbm5lckRpZmZOb2RlKG91dCwgdmNoaWxkcmVuLCBjb250ZXh0LCBtb3VudEFsbCwgaHlkcmF0aW5nIHx8IG51bGwgIT0gcHJvcHMuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwpO1xuICAgICAgICBkaWZmQXR0cmlidXRlcyhvdXQsIHZub2RlLmF0dHJpYnV0ZXMsIHByb3BzKTtcbiAgICAgICAgaXNTdmdNb2RlID0gcHJldlN2Z01vZGU7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlubmVyRGlmZk5vZGUoZG9tLCB2Y2hpbGRyZW4sIGNvbnRleHQsIG1vdW50QWxsLCBpc0h5ZHJhdGluZykge1xuICAgICAgICB2YXIgaiwgYywgZiwgdmNoaWxkLCBjaGlsZCwgb3JpZ2luYWxDaGlsZHJlbiA9IGRvbS5jaGlsZE5vZGVzLCBjaGlsZHJlbiA9IFtdLCBrZXllZCA9IHt9LCBrZXllZExlbiA9IDAsIG1pbiA9IDAsIGxlbiA9IG9yaWdpbmFsQ2hpbGRyZW4ubGVuZ3RoLCBjaGlsZHJlbkxlbiA9IDAsIHZsZW4gPSB2Y2hpbGRyZW4gPyB2Y2hpbGRyZW4ubGVuZ3RoIDogMDtcbiAgICAgICAgaWYgKDAgIT09IGxlbikgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIF9jaGlsZCA9IG9yaWdpbmFsQ2hpbGRyZW5baV0sIHByb3BzID0gX2NoaWxkLl9fcHJlYWN0YXR0cl8sIGtleSA9IHZsZW4gJiYgcHJvcHMgPyBfY2hpbGQuX2NvbXBvbmVudCA/IF9jaGlsZC5fY29tcG9uZW50Ll9fayA6IHByb3BzLmtleSA6IG51bGw7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBrZXkpIHtcbiAgICAgICAgICAgICAgICBrZXllZExlbisrO1xuICAgICAgICAgICAgICAgIGtleWVkW2tleV0gPSBfY2hpbGQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BzIHx8ICh2b2lkIDAgIT09IF9jaGlsZC5zcGxpdFRleHQgPyBpc0h5ZHJhdGluZyA/IF9jaGlsZC5ub2RlVmFsdWUudHJpbSgpIDogITAgOiBpc0h5ZHJhdGluZykpIGNoaWxkcmVuW2NoaWxkcmVuTGVuKytdID0gX2NoaWxkO1xuICAgICAgICB9XG4gICAgICAgIGlmICgwICE9PSB2bGVuKSBmb3IgKHZhciBpID0gMDsgaSA8IHZsZW47IGkrKykge1xuICAgICAgICAgICAgdmNoaWxkID0gdmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgY2hpbGQgPSBudWxsO1xuICAgICAgICAgICAgdmFyIGtleSA9IHZjaGlsZC5rZXk7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ZWRMZW4gJiYgdm9pZCAwICE9PSBrZXllZFtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0ga2V5ZWRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAga2V5ZWRba2V5XSA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgICAga2V5ZWRMZW4tLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFjaGlsZCAmJiBtaW4gPCBjaGlsZHJlbkxlbikgZm9yIChqID0gbWluOyBqIDwgY2hpbGRyZW5MZW47IGorKykgaWYgKHZvaWQgMCAhPT0gY2hpbGRyZW5bal0gJiYgaXNTYW1lTm9kZVR5cGUoYyA9IGNoaWxkcmVuW2pdLCB2Y2hpbGQsIGlzSHlkcmF0aW5nKSkge1xuICAgICAgICAgICAgICAgIGNoaWxkID0gYztcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltqXSA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gY2hpbGRyZW5MZW4gLSAxKSBjaGlsZHJlbkxlbi0tO1xuICAgICAgICAgICAgICAgIGlmIChqID09PSBtaW4pIG1pbisrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hpbGQgPSBpZGlmZihjaGlsZCwgdmNoaWxkLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBmID0gb3JpZ2luYWxDaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZCAmJiBjaGlsZCAhPT0gZG9tICYmIGNoaWxkICE9PSBmKSBpZiAobnVsbCA9PSBmKSBkb20uYXBwZW5kQ2hpbGQoY2hpbGQpOyBlbHNlIGlmIChjaGlsZCA9PT0gZi5uZXh0U2libGluZykgcmVtb3ZlTm9kZShmKTsgZWxzZSBkb20uaW5zZXJ0QmVmb3JlKGNoaWxkLCBmKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ZWRMZW4pIGZvciAodmFyIGkgaW4ga2V5ZWQpIGlmICh2b2lkIDAgIT09IGtleWVkW2ldKSByZWNvbGxlY3ROb2RlVHJlZShrZXllZFtpXSwgITEpO1xuICAgICAgICB3aGlsZSAobWluIDw9IGNoaWxkcmVuTGVuKSBpZiAodm9pZCAwICE9PSAoY2hpbGQgPSBjaGlsZHJlbltjaGlsZHJlbkxlbi0tXSkpIHJlY29sbGVjdE5vZGVUcmVlKGNoaWxkLCAhMSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsIHVubW91bnRPbmx5KSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBub2RlLl9jb21wb25lbnQ7XG4gICAgICAgIGlmIChjb21wb25lbnQpIHVubW91bnRDb21wb25lbnQoY29tcG9uZW50KTsgZWxzZSB7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBub2RlLl9fcHJlYWN0YXR0cl8gJiYgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZikgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgICAgIGlmICghMSA9PT0gdW5tb3VudE9ubHkgfHwgbnVsbCA9PSBub2RlLl9fcHJlYWN0YXR0cl8pIHJlbW92ZU5vZGUobm9kZSk7XG4gICAgICAgICAgICByZW1vdmVDaGlsZHJlbihub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmxhc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBuZXh0ID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShub2RlLCAhMCk7XG4gICAgICAgICAgICBub2RlID0gbmV4dDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBkaWZmQXR0cmlidXRlcyhkb20sIGF0dHJzLCBvbGQpIHtcbiAgICAgICAgdmFyIG5hbWU7XG4gICAgICAgIGZvciAobmFtZSBpbiBvbGQpIGlmICgoIWF0dHJzIHx8IG51bGwgPT0gYXR0cnNbbmFtZV0pICYmIG51bGwgIT0gb2xkW25hbWVdKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gdm9pZCAwLCBpc1N2Z01vZGUpO1xuICAgICAgICBmb3IgKG5hbWUgaW4gYXR0cnMpIGlmICghKCdjaGlsZHJlbicgPT09IG5hbWUgfHwgJ2lubmVySFRNTCcgPT09IG5hbWUgfHwgbmFtZSBpbiBvbGQgJiYgYXR0cnNbbmFtZV0gPT09ICgndmFsdWUnID09PSBuYW1lIHx8ICdjaGVja2VkJyA9PT0gbmFtZSA/IGRvbVtuYW1lXSA6IG9sZFtuYW1lXSkpKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gYXR0cnNbbmFtZV0sIGlzU3ZnTW9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbGxlY3RDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgICAgIHZhciBuYW1lID0gY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIChjb21wb25lbnRzW25hbWVdIHx8IChjb21wb25lbnRzW25hbWVdID0gW10pKS5wdXNoKGNvbXBvbmVudCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChDdG9yLCBwcm9wcywgY29udGV4dCkge1xuICAgICAgICB2YXIgaW5zdCwgbGlzdCA9IGNvbXBvbmVudHNbQ3Rvci5uYW1lXTtcbiAgICAgICAgaWYgKEN0b3IucHJvdG90eXBlICYmIEN0b3IucHJvdG90eXBlLnJlbmRlcikge1xuICAgICAgICAgICAgaW5zdCA9IG5ldyBDdG9yKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIENvbXBvbmVudC5jYWxsKGluc3QsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGluc3QuY29uc3RydWN0b3IgPSBDdG9yO1xuICAgICAgICAgICAgaW5zdC5yZW5kZXIgPSBkb1JlbmRlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGlzdCkgZm9yICh2YXIgaSA9IGxpc3QubGVuZ3RoOyBpLS07ICkgaWYgKGxpc3RbaV0uY29uc3RydWN0b3IgPT09IEN0b3IpIHtcbiAgICAgICAgICAgIGluc3QuX19iID0gbGlzdFtpXS5fX2I7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBkb1JlbmRlcihwcm9wcywgc3RhdGUsIGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRDb21wb25lbnRQcm9wcyhjb21wb25lbnQsIHByb3BzLCBvcHRzLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3gpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19yID0gcHJvcHMucmVmKSBkZWxldGUgcHJvcHMucmVmO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fX2sgPSBwcm9wcy5rZXkpIGRlbGV0ZSBwcm9wcy5rZXk7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5iYXNlIHx8IG1vdW50QWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0ICYmIGNvbnRleHQgIT09IGNvbXBvbmVudC5jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuX19jKSBjb21wb25lbnQuX19jID0gY29tcG9uZW50LmNvbnRleHQ7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuX19wKSBjb21wb25lbnQuX19wID0gY29tcG9uZW50LnByb3BzO1xuICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICBjb21wb25lbnQuX194ID0gITE7XG4gICAgICAgICAgICBpZiAoMCAhPT0gb3B0cykgaWYgKDEgPT09IG9wdHMgfHwgITEgIT09IG9wdGlvbnMuc3luY0NvbXBvbmVudFVwZGF0ZXMgfHwgIWNvbXBvbmVudC5iYXNlKSByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCAxLCBtb3VudEFsbCk7IGVsc2UgZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fX3IpIGNvbXBvbmVudC5fX3IoY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCBvcHRzLCBtb3VudEFsbCwgaXNDaGlsZCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3gpIHtcbiAgICAgICAgICAgIHZhciByZW5kZXJlZCwgaW5zdCwgY2Jhc2UsIHByb3BzID0gY29tcG9uZW50LnByb3BzLCBzdGF0ZSA9IGNvbXBvbmVudC5zdGF0ZSwgY29udGV4dCA9IGNvbXBvbmVudC5jb250ZXh0LCBwcmV2aW91c1Byb3BzID0gY29tcG9uZW50Ll9fcCB8fCBwcm9wcywgcHJldmlvdXNTdGF0ZSA9IGNvbXBvbmVudC5fX3MgfHwgc3RhdGUsIHByZXZpb3VzQ29udGV4dCA9IGNvbXBvbmVudC5fX2MgfHwgY29udGV4dCwgaXNVcGRhdGUgPSBjb21wb25lbnQuYmFzZSwgbmV4dEJhc2UgPSBjb21wb25lbnQuX19iLCBpbml0aWFsQmFzZSA9IGlzVXBkYXRlIHx8IG5leHRCYXNlLCBpbml0aWFsQ2hpbGRDb21wb25lbnQgPSBjb21wb25lbnQuX2NvbXBvbmVudCwgc2tpcCA9ICExO1xuICAgICAgICAgICAgaWYgKGlzVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJldmlvdXNQcm9wcztcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3RhdGUgPSBwcmV2aW91c1N0YXRlO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gcHJldmlvdXNDb250ZXh0O1xuICAgICAgICAgICAgICAgIGlmICgyICE9PSBvcHRzICYmIGNvbXBvbmVudC5zaG91bGRDb21wb25lbnRVcGRhdGUgJiYgITEgPT09IGNvbXBvbmVudC5zaG91bGRDb21wb25lbnRVcGRhdGUocHJvcHMsIHN0YXRlLCBjb250ZXh0KSkgc2tpcCA9ICEwOyBlbHNlIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbFVwZGF0ZSkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxVcGRhdGUocHJvcHMsIHN0YXRlLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21wb25lbnQuX19wID0gY29tcG9uZW50Ll9fcyA9IGNvbXBvbmVudC5fX2MgPSBjb21wb25lbnQuX19iID0gbnVsbDtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX2QgPSAhMTtcbiAgICAgICAgICAgIGlmICghc2tpcCkge1xuICAgICAgICAgICAgICAgIHJlbmRlcmVkID0gY29tcG9uZW50LnJlbmRlcihwcm9wcywgc3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KSBjb250ZXh0ID0gZXh0ZW5kKGV4dGVuZCh7fSwgY29udGV4dCksIGNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQoKSk7XG4gICAgICAgICAgICAgICAgdmFyIHRvVW5tb3VudCwgYmFzZSwgY2hpbGRDb21wb25lbnQgPSByZW5kZXJlZCAmJiByZW5kZXJlZC5ub2RlTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgY2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkUHJvcHMgPSBnZXROb2RlUHJvcHMocmVuZGVyZWQpO1xuICAgICAgICAgICAgICAgICAgICBpbnN0ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdCAmJiBpbnN0LmNvbnN0cnVjdG9yID09PSBjaGlsZENvbXBvbmVudCAmJiBjaGlsZFByb3BzLmtleSA9PSBpbnN0Ll9faykgc2V0Q29tcG9uZW50UHJvcHMoaW5zdCwgY2hpbGRQcm9wcywgMSwgY29udGV4dCwgITEpOyBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvVW5tb3VudCA9IGluc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuX2NvbXBvbmVudCA9IGluc3QgPSBjcmVhdGVDb21wb25lbnQoY2hpbGRDb21wb25lbnQsIGNoaWxkUHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdC5fX2IgPSBpbnN0Ll9fYiB8fCBuZXh0QmFzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QuX191ID0gY29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoaW5zdCwgY2hpbGRQcm9wcywgMCwgY29udGV4dCwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcG9uZW50KGluc3QsIDEsIG1vdW50QWxsLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYmFzZSA9IGluc3QuYmFzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYmFzZSA9IGluaXRpYWxCYXNlO1xuICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbml0aWFsQ2hpbGRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b1VubW91bnQpIGNiYXNlID0gY29tcG9uZW50Ll9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEJhc2UgfHwgMSA9PT0gb3B0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNiYXNlKSBjYmFzZS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2UgPSBkaWZmKGNiYXNlLCByZW5kZXJlZCwgY29udGV4dCwgbW91bnRBbGwgfHwgIWlzVXBkYXRlLCBpbml0aWFsQmFzZSAmJiBpbml0aWFsQmFzZS5wYXJlbnROb2RlLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxCYXNlICYmIGJhc2UgIT09IGluaXRpYWxCYXNlICYmIGluc3QgIT09IGluaXRpYWxDaGlsZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmFzZVBhcmVudCA9IGluaXRpYWxCYXNlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYXNlUGFyZW50ICYmIGJhc2UgIT09IGJhc2VQYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VQYXJlbnQucmVwbGFjZUNoaWxkKGJhc2UsIGluaXRpYWxCYXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdG9Vbm1vdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbEJhc2UuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoaW5pdGlhbEJhc2UsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodG9Vbm1vdW50KSB1bm1vdW50Q29tcG9uZW50KHRvVW5tb3VudCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmJhc2UgPSBiYXNlO1xuICAgICAgICAgICAgICAgIGlmIChiYXNlICYmICFpc0NoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnRSZWYgPSBjb21wb25lbnQsIHQgPSBjb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0ID0gdC5fX3UpIChjb21wb25lbnRSZWYgPSB0KS5iYXNlID0gYmFzZTtcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50ID0gY29tcG9uZW50UmVmO1xuICAgICAgICAgICAgICAgICAgICBiYXNlLl9jb21wb25lbnRDb25zdHJ1Y3RvciA9IGNvbXBvbmVudFJlZi5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzVXBkYXRlIHx8IG1vdW50QWxsKSBtb3VudHMudW5zaGlmdChjb21wb25lbnQpOyBlbHNlIGlmICghc2tpcCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50RGlkVXBkYXRlKSBjb21wb25lbnQuY29tcG9uZW50RGlkVXBkYXRlKHByZXZpb3VzUHJvcHMsIHByZXZpb3VzU3RhdGUsIHByZXZpb3VzQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWZ0ZXJVcGRhdGUpIG9wdGlvbnMuYWZ0ZXJVcGRhdGUoY29tcG9uZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChudWxsICE9IGNvbXBvbmVudC5fX2gpIHdoaWxlIChjb21wb25lbnQuX19oLmxlbmd0aCkgY29tcG9uZW50Ll9faC5wb3AoKS5jYWxsKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoIWRpZmZMZXZlbCAmJiAhaXNDaGlsZCkgZmx1c2hNb3VudHMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgICAgICB2YXIgYyA9IGRvbSAmJiBkb20uX2NvbXBvbmVudCwgb3JpZ2luYWxDb21wb25lbnQgPSBjLCBvbGREb20gPSBkb20sIGlzRGlyZWN0T3duZXIgPSBjICYmIGRvbS5fY29tcG9uZW50Q29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lLCBpc093bmVyID0gaXNEaXJlY3RPd25lciwgcHJvcHMgPSBnZXROb2RlUHJvcHModm5vZGUpO1xuICAgICAgICB3aGlsZSAoYyAmJiAhaXNPd25lciAmJiAoYyA9IGMuX191KSkgaXNPd25lciA9IGMuY29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lO1xuICAgICAgICBpZiAoYyAmJiBpc093bmVyICYmICghbW91bnRBbGwgfHwgYy5fY29tcG9uZW50KSkge1xuICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoYywgcHJvcHMsIDMsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGRvbSA9IGMuYmFzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChvcmlnaW5hbENvbXBvbmVudCAmJiAhaXNEaXJlY3RPd25lcikge1xuICAgICAgICAgICAgICAgIHVubW91bnRDb21wb25lbnQob3JpZ2luYWxDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIGRvbSA9IG9sZERvbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjID0gY3JlYXRlQ29tcG9uZW50KHZub2RlLm5vZGVOYW1lLCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoZG9tICYmICFjLl9fYikge1xuICAgICAgICAgICAgICAgIGMuX19iID0gZG9tO1xuICAgICAgICAgICAgICAgIG9sZERvbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhjLCBwcm9wcywgMSwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZG9tID0gYy5iYXNlO1xuICAgICAgICAgICAgaWYgKG9sZERvbSAmJiBkb20gIT09IG9sZERvbSkge1xuICAgICAgICAgICAgICAgIG9sZERvbS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShvbGREb20sICExKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZG9tO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1bm1vdW50Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICBpZiAob3B0aW9ucy5iZWZvcmVVbm1vdW50KSBvcHRpb25zLmJlZm9yZVVubW91bnQoY29tcG9uZW50KTtcbiAgICAgICAgdmFyIGJhc2UgPSBjb21wb25lbnQuYmFzZTtcbiAgICAgICAgY29tcG9uZW50Ll9feCA9ICEwO1xuICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcbiAgICAgICAgY29tcG9uZW50LmJhc2UgPSBudWxsO1xuICAgICAgICB2YXIgaW5uZXIgPSBjb21wb25lbnQuX2NvbXBvbmVudDtcbiAgICAgICAgaWYgKGlubmVyKSB1bm1vdW50Q29tcG9uZW50KGlubmVyKTsgZWxzZSBpZiAoYmFzZSkge1xuICAgICAgICAgICAgaWYgKGJhc2UuX19wcmVhY3RhdHRyXyAmJiBiYXNlLl9fcHJlYWN0YXR0cl8ucmVmKSBiYXNlLl9fcHJlYWN0YXR0cl8ucmVmKG51bGwpO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9fYiA9IGJhc2U7XG4gICAgICAgICAgICByZW1vdmVOb2RlKGJhc2UpO1xuICAgICAgICAgICAgY29sbGVjdENvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgcmVtb3ZlQ2hpbGRyZW4oYmFzZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBvbmVudC5fX3IpIGNvbXBvbmVudC5fX3IobnVsbCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIENvbXBvbmVudChwcm9wcywgY29udGV4dCkge1xuICAgICAgICB0aGlzLl9fZCA9ICEwO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgIH1cbiAgICBmdW5jdGlvbiByZW5kZXIodm5vZGUsIHBhcmVudCwgbWVyZ2UpIHtcbiAgICAgICAgcmV0dXJuIGRpZmYobWVyZ2UsIHZub2RlLCB7fSwgITEsIHBhcmVudCwgITEpO1xuICAgIH1cbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBzdGFjayA9IFtdO1xuICAgIHZhciBFTVBUWV9DSElMRFJFTiA9IFtdO1xuICAgIHZhciBkZWZlciA9ICdmdW5jdGlvbicgPT0gdHlwZW9mIFByb21pc2UgPyBQcm9taXNlLnJlc29sdmUoKS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpIDogc2V0VGltZW91dDtcbiAgICB2YXIgSVNfTk9OX0RJTUVOU0lPTkFMID0gL2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgdmFyIG1vdW50cyA9IFtdO1xuICAgIHZhciBkaWZmTGV2ZWwgPSAwO1xuICAgIHZhciBpc1N2Z01vZGUgPSAhMTtcbiAgICB2YXIgaHlkcmF0aW5nID0gITE7XG4gICAgdmFyIGNvbXBvbmVudHMgPSB7fTtcbiAgICBleHRlbmQoQ29tcG9uZW50LnByb3RvdHlwZSwge1xuICAgICAgICBzZXRTdGF0ZTogZnVuY3Rpb24oc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX19zKSB0aGlzLl9fcyA9IGV4dGVuZCh7fSwgcyk7XG4gICAgICAgICAgICBleHRlbmQocywgJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygc3RhdGUgPyBzdGF0ZShzLCB0aGlzLnByb3BzKSA6IHN0YXRlKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgKHRoaXMuX19oID0gdGhpcy5fX2ggfHwgW10pLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgZW5xdWV1ZVJlbmRlcih0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9yY2VVcGRhdGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spICh0aGlzLl9faCA9IHRoaXMuX19oIHx8IFtdKS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHJlbmRlckNvbXBvbmVudCh0aGlzLCAyKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgdmFyIHByZWFjdCA9IHtcbiAgICAgICAgaDogaCxcbiAgICAgICAgY3JlYXRlRWxlbWVudDogaCxcbiAgICAgICAgY2xvbmVFbGVtZW50OiBjbG9uZUVsZW1lbnQsXG4gICAgICAgIENvbXBvbmVudDogQ29tcG9uZW50LFxuICAgICAgICByZW5kZXI6IHJlbmRlcixcbiAgICAgICAgcmVyZW5kZXI6IHJlcmVuZGVyLFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgfTtcbiAgICBpZiAoJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIG1vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBwcmVhY3Q7IGVsc2Ugc2VsZi5wcmVhY3QgPSBwcmVhY3Q7XG59KCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QuanMubWFwIiwidmFyIHJlbGF0aXZlRGF0ZSA9IChmdW5jdGlvbih1bmRlZmluZWQpe1xuXG4gIHZhciBTRUNPTkQgPSAxMDAwLFxuICAgICAgTUlOVVRFID0gNjAgKiBTRUNPTkQsXG4gICAgICBIT1VSID0gNjAgKiBNSU5VVEUsXG4gICAgICBEQVkgPSAyNCAqIEhPVVIsXG4gICAgICBXRUVLID0gNyAqIERBWSxcbiAgICAgIFlFQVIgPSBEQVkgKiAzNjUsXG4gICAgICBNT05USCA9IFlFQVIgLyAxMjtcblxuICB2YXIgZm9ybWF0cyA9IFtcbiAgICBbIDAuNyAqIE1JTlVURSwgJ2p1c3Qgbm93JyBdLFxuICAgIFsgMS41ICogTUlOVVRFLCAnYSBtaW51dGUgYWdvJyBdLFxuICAgIFsgNjAgKiBNSU5VVEUsICdtaW51dGVzIGFnbycsIE1JTlVURSBdLFxuICAgIFsgMS41ICogSE9VUiwgJ2FuIGhvdXIgYWdvJyBdLFxuICAgIFsgREFZLCAnaG91cnMgYWdvJywgSE9VUiBdLFxuICAgIFsgMiAqIERBWSwgJ3llc3RlcmRheScgXSxcbiAgICBbIDcgKiBEQVksICdkYXlzIGFnbycsIERBWSBdLFxuICAgIFsgMS41ICogV0VFSywgJ2Egd2VlayBhZ28nXSxcbiAgICBbIE1PTlRILCAnd2Vla3MgYWdvJywgV0VFSyBdLFxuICAgIFsgMS41ICogTU9OVEgsICdhIG1vbnRoIGFnbycgXSxcbiAgICBbIFlFQVIsICdtb250aHMgYWdvJywgTU9OVEggXSxcbiAgICBbIDEuNSAqIFlFQVIsICdhIHllYXIgYWdvJyBdLFxuICAgIFsgTnVtYmVyLk1BWF9WQUxVRSwgJ3llYXJzIGFnbycsIFlFQVIgXVxuICBdO1xuXG4gIGZ1bmN0aW9uIHJlbGF0aXZlRGF0ZShpbnB1dCxyZWZlcmVuY2Upe1xuICAgICFyZWZlcmVuY2UgJiYgKCByZWZlcmVuY2UgPSAobmV3IERhdGUpLmdldFRpbWUoKSApO1xuICAgIHJlZmVyZW5jZSBpbnN0YW5jZW9mIERhdGUgJiYgKCByZWZlcmVuY2UgPSByZWZlcmVuY2UuZ2V0VGltZSgpICk7XG4gICAgaW5wdXQgaW5zdGFuY2VvZiBEYXRlICYmICggaW5wdXQgPSBpbnB1dC5nZXRUaW1lKCkgKTtcbiAgICBcbiAgICB2YXIgZGVsdGEgPSByZWZlcmVuY2UgLSBpbnB1dCxcbiAgICAgICAgZm9ybWF0LCBpLCBsZW47XG5cbiAgICBmb3IoaSA9IC0xLCBsZW49Zm9ybWF0cy5sZW5ndGg7ICsraSA8IGxlbjsgKXtcbiAgICAgIGZvcm1hdCA9IGZvcm1hdHNbaV07XG4gICAgICBpZihkZWx0YSA8IGZvcm1hdFswXSl7XG4gICAgICAgIHJldHVybiBmb3JtYXRbMl0gPT0gdW5kZWZpbmVkID8gZm9ybWF0WzFdIDogTWF0aC5yb3VuZChkZWx0YS9mb3JtYXRbMl0pICsgJyAnICsgZm9ybWF0WzFdO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gcmVsYXRpdmVEYXRlO1xuXG59KSgpO1xuXG5pZih0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKXtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZWxhdGl2ZURhdGU7XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4uL3BvcHVwL2J1dHRvblwiXG5pbXBvcnQgTGlrZWREaWFsb2cgZnJvbSBcIi4uL3BvcHVwL2xpa2VkLWRpYWxvZ1wiXG5pbXBvcnQgSW5wdXQgZnJvbSBcIi4uL3BvcHVwL2lucHV0XCJcbmltcG9ydCB0YWJzIGZyb20gXCIuLi9zYWZhcmkvdGFic1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHNlYXJjaCh2YWx1ZSkge1xuICAgIHRhYnMuY3JlYXRlKCdodHRwczovL2dldGtvem1vcy5jb20vc2VhcmNoP3E9JyArIGVuY29kZVVSSSh2YWx1ZSkpO1xuICAgIHNhZmFyaS5zZWxmLmhpZGUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc0xpa2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJMaWtlZCgpXG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmlzTG9nZ2VkSW4pIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckxpa2UoKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2dpbigpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyTG9naW4oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nIGxvZ2luXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY1wiPlxuICAgICAgICAgIExvb2tzIGxpa2UgeW91IGhhdmVuJ3QgbG9nZ2VkIGluIHlldC5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEJ1dHRvbiB0aXRsZT1cIkxvZ2luIEtvem1vc1wiIG9uQ2xpY2s9eygpID0+IHsgdGFicy5jcmVhdGUoJ2h0dHBzOi8vZ2V0a296bW9zLmNvbS9sb2dpbicpOyBzYWZhcmkuc2VsZi5oaWRlKCk7IH19PlxuICAgICAgICAgIExvZ2luXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTGlrZWQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxMaWtlZERpYWxvZyBpc0p1c3RMaWtlZD17dGhpcy5zdGF0ZS5pc0p1c3RMaWtlZH1cbiAgICAgICAgbGlrZT17dGhpcy5wcm9wcy5yZWNvcmR9XG4gICAgICAgIHVubGlrZT17dGhpcy5wcm9wcy51bmxpa2V9XG4gICAgICAgIG9uU3RhcnRMb2FkaW5nPXt0aGlzLnByb3BzLm9uU3RhcnRMb2FkaW5nfVxuICAgICAgICBvblN0b3BMb2FkaW5nPXt0aGlzLnByb3BzLm9uU3RvcExvYWRpbmd9XG4gICAgICAgIG9uU3luYz17dGhpcy5wcm9wcy5vblN5bmN9XG4gICAgICAgIG9uRXJyb3I9e3RoaXMucHJvcHMub25FcnJvcn1cbiAgICAgIC8+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTGlrZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2cgbGlrZVwiPlxuICAgICAgICA8SW5wdXQgb25QcmVzc0VudGVyPXt2YWx1ZSA9PiB0aGlzLnNlYXJjaCh2YWx1ZSl9IGljb249XCJzZWFyY2hcIiBwbGFjZWhvbGRlcj1cIlNlYXJjaCBZb3VyIEJvb2ttYXJrc1wiIGljb25TdHJva2U9XCIzXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjXCI+XG4gICAgICAgICAgWW91IGhhdmVuJ3QgbGlrZWQgdGhpcyBwYWdlIHlldC5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxCdXR0b24gdGl0bGU9XCJDbGljayB0byBhZGQgdGhpcyBwYWdlIHRvIHlvdXIgbGlrZXNcIiBpY29uPVwiaGVhcnRcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLmxpa2UoKX0+TGlrZSBJdDwvQnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQsIHJlbmRlciB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IHRhYnMgZnJvbSBcIi4uL3NhZmFyaS90YWJzXCJcbmltcG9ydCB7IHNldEFzTGlrZWQsIHNldEFzTm90TGlrZWQsIHNldEFzTG9hZGluZyB9IGZyb20gXCIuLi9zYWZhcmkvaWNvbnNcIlxuaW1wb3J0IERpYWxvZyBmcm9tIFwiLi9kaWFsb2dcIlxuaW1wb3J0IHsgSWNvbiB9IGZyb20gJy4uL3BvcHVwL2ljb24nO1xuXG5jbGFzcyBQb3B1cCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgd2luZG93LlBvcG92ZXIgPSB0aGlzO1xuXG4gICAgdGhpcy51cGRhdGVQb3BvdmVyKCk7XG4gICAgc2FmYXJpLmV4dGVuc2lvbi5nbG9iYWxQYWdlLmNvbnRlbnRXaW5kb3cubGlzdGVuRm9yUG9wb3ZlcigpXG4gIH1cblxuICB1cGRhdGVQb3BvdmVyKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNMb2dnZWRJbjogISFsb2NhbFN0b3JhZ2VbJ3Rva2VuJ11cbiAgICB9KVxuXG4gICAgY29uc3QgdGFiID0gdGFicy5jdXJyZW50KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB1cmw6IHRhYi51cmwsXG4gICAgICB0aXRsZTogdGFiLnRpdGxlXG4gICAgfSlcblxuICAgIHRoaXMub25TdGFydExvYWRpbmcoKTtcbiAgICBzYWZhcmkuZXh0ZW5zaW9uLmdsb2JhbFBhZ2UuY29udGVudFdpbmRvdy5nZXRMaWtlKHRhYi51cmwpXG4gICAgICAudGhlbigocmVzcCkgPT4ge1xuICAgICAgICB0aGlzLm9uU3RvcExvYWRpbmcoKTtcbiAgICAgICAgaWYgKHJlc3ApIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGxpa2U6IHJlc3AubGlrZSxcbiAgICAgICAgICAgIGlzTGlrZWQ6ICEhcmVzcC5saWtlXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGxpa2U6IG51bGwsXG4gICAgICAgICAgICBpc0xpa2VkOiBmYWxzZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgcmVzaXplUG9wb3ZlcigpIHtcbiAgICBzYWZhcmkuc2VsZi5oZWlnaHQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcbiAgfVxuXG4gIG9uU3RhcnRMb2FkaW5nKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNMb2FkaW5nOiB0cnVlXG4gICAgfSlcbiAgfVxuXG4gIG9uU3RvcExvYWRpbmcoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZVxuICAgICAgfSlcbiAgICB9LCA1MDApXG4gIH1cblxuICBvbkVycm9yKGVycm9yKSB7XG4gICAgY29uc3QgZTQwMSA9IGVycm9yLm1lc3NhZ2UuaW5kZXhPZignNDAxJykgPiAtMVxuICAgIGlmIChlNDAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlzTG9nZ2VkSW46IGZhbHNlLFxuICAgICAgICBpc0xpa2VkOiBmYWxzZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVycm9yXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZUFjdGlvbkljb24oKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaXNMaWtlZCkge1xuICAgICAgc2V0QXNMaWtlZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRBc05vdExpa2VkKCk7XG4gICAgfVxuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgc2FmYXJpLnNlbGYuaGlkZSgpO1xuICB9XG5cbiAgbGlrZSgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNMb2dnZWRJbikge1xuICAgICAgdGFicy5jcmVhdGUoJ2h0dHBzOi8vZ2V0a296bW9zLmNvbS9sb2dpbicpXG4gICAgfVxuXG4gICAgc2FmYXJpLmV4dGVuc2lvbi5nbG9iYWxQYWdlLmNvbnRlbnRXaW5kb3cubGlrZSh0aGlzLnN0YXRlLnVybCwgdGhpcy5zdGF0ZS50aXRsZSlcbiAgICAgIC50aGVuKChyZXNwKSA9PiB7XG4gICAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiByZXNwLmVycm9yIH0pXG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgbGlrZTogcmVzcC5saWtlLFxuICAgICAgICAgIGlzTGlrZWQ6ICEhcmVzcC5saWtlLFxuICAgICAgICAgIGlzSnVzdExpa2VkOiB0cnVlXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy51cGRhdGVBY3Rpb25JY29uKClcbiAgICAgIH0pXG4gIH1cblxuICB1bmxpa2UoKSB7XG4gICAgc2FmYXJpLmV4dGVuc2lvbi5nbG9iYWxQYWdlLmNvbnRlbnRXaW5kb3cudW5saWtlKHRoaXMuc3RhdGUudXJsKVxuICAgICAgLnRoZW4oKHJlc3ApID0+IHtcbiAgICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IHJlc3AuZXJyb3IgfSlcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBsaWtlOiBudWxsLFxuICAgICAgICAgIGlzTGlrZWQ6IGZhbHNlXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy51cGRhdGVBY3Rpb25JY29uKClcbiAgICAgIH0pXG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5yZXNpemVQb3BvdmVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2FmYXJpIGNvbnRhaW5lclwiPlxuICAgICAgICA8aDE+XG4gICAgICAgICAgPGEgdGl0bGU9XCJPcGVuIEtvem1vc1wiIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJodHRwczovL2dldGtvem1vcy5jb21cIiBvbmNsaWNrPXsoKSA9PiB7IHRhYnMuY3JlYXRlKCdodHRwczovL2dldGtvem1vcy5jb20nKTsgc2FmYXJpLnNlbGYuaGlkZSgpOyB9fT5rb3ptb3M8L2E+XG4gICAgICAgICAgPEljb24gbmFtZT1cImV4dGVybmFsXCIgb25jbGljaz17KCkgPT4geyB0YWJzLmNyZWF0ZSgnaHR0cHM6Ly9nZXRrb3ptb3MuY29tJyk7IHNhZmFyaS5zZWxmLmhpZGUoKTsgfX0gdGl0bGU9XCJPcGVuIFlvdXIgQm9va21hcmtzXCIgLz5cbiAgICAgICAgPC9oMT5cblxuICAgICAgICA8RGlhbG9nIGlzTGlrZWQ9e3RoaXMuc3RhdGUuaXNMaWtlZH1cbiAgICAgICAgICByZWNvcmQ9e3RoaXMuc3RhdGUubGlrZX1cbiAgICAgICAgICBpc0p1c3RMaWtlZD17dGhpcy5zdGF0ZS5pc0p1c3RMaWtlZH1cbiAgICAgICAgICBpc0xvZ2dlZEluPXt0aGlzLnN0YXRlLmlzTG9nZ2VkSW59XG4gICAgICAgICAgdW5saWtlPXsoKSA9PiB0aGlzLnVubGlrZSgpfVxuICAgICAgICAgIGxpa2U9eygpID0+IHRoaXMubGlrZSgpfVxuICAgICAgICAgIG9uU3RhcnRMb2FkaW5nPXsoKSA9PiB0aGlzLm9uU3RhcnRMb2FkaW5nKCl9XG4gICAgICAgICAgb25TdG9wTG9hZGluZz17KCkgPT4gdGhpcy5vblN0b3BMb2FkaW5nKCl9XG4gICAgICAgICAgb25TeW5jPXsoKSA9PiB0aGlzLm9uU3luYygpfVxuICAgICAgICAgIG9uRXJyb3I9e2VyciA9PiB0aGlzLm9uRXJyb3IoZXJyKX1cbiAgICAgICAgLz5cblxuICAgICAgICB7dGhpcy5yZW5kZXJTdGF0dXMoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclN0YXR1cygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGF0dXNcIj5cbiAgICAgICAge3RoaXMucmVuZGVyU3RhdHVzSWNvbigpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU3RhdHVzSWNvbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5pc0xvYWRpbmcpIHtcbiAgICAgIHJldHVybiA8SWNvbiBuYW1lPVwiY2xvY2tcIiB0aXRsZT1cIkNvbm5lY3RpbmcgdG8gS296bW9zIHJpZ2h0IG5vd1wiIC8+XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxhIGhyZWY9eydtYWlsdG86YXplckBnZXRrb3ptb3MuY29tP3N1YmplY3Q9RXh0ZW5zaW9uK0Vycm9yJmJvZHk9U3RhY2sgdHJhY2U6JyArIGVuY29kZVVSSSh0aGlzLnN0YXRlLmVycm9yLnN0YWNrKX0+XG4gICAgICAgICAgPEljb24gbmFtZT1cImFsZXJ0XCIgdGl0bGU9XCJBbiBlcnJvciBvY2N1cnJlZC4gQ2xpY2sgaGVyZSB0byByZXBvcnQgaXQuXCIgb25jbGljaz17KCkgPT4gdGhpcy5yZXBvcnRFcnJvcigpfSBzdHJva2U9XCIyXCIgLz5cbiAgICAgICAgPC9hPlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgcmVuZGVyKDxQb3B1cCAvPiwgZG9jdW1lbnQuYm9keSlcbn0pXG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnV0dG9uc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1dHRvblwiIHRpdGxlPXt0aGlzLnByb3BzLnRpdGxlfSBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2xpY2t9PlxuICAgICAgICAgIHsgdGhpcy5wcm9wcy5pY29uID8gPEljb24gbmFtZT17dGhpcy5wcm9wcy5pY29ufSAvPiA6IG51bGx9XG4gICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tICdwcmVhY3QnXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmFsdWU6IFwiXCIsXG4gICAgICBwbGFjZWhvbGRlcjogdGhpcy5wcm9wcy5wbGFjZWhvbGRlclxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hdXRvZm9jdXMpIHRoaXMuZm9jdXMoKVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgcmV0dXJuIG5leHRTdGF0ZS52YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZVxuICB9XG5cbiAgZm9jdXMgKCkge1xuICAgIHRoaXMuZWwuZm9jdXMoKVxuICB9XG5cbiAgb25Gb2N1cyhlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwbGFjZWhvbGRlcjogXCJcIlxuICAgIH0pXG4gIH1cblxuICBvbkJsdXIoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGxhY2Vob2xkZXI6IHRoaXMucHJvcHMucGxhY2Vob2xkZXJcbiAgICB9KVxuICB9XG5cbiAgb25DaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmFsdWU6IGUudGFyZ2V0LnZhbHVlXG4gICAgfSlcblxuICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuc3RhdGUudmFsdWUpXG4gICAgfVxuICB9XG5cbiAgb25LZXlVcChlKSB7XG4gICAgY29uc3QgdmFsdWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLm9uQ2hhbmdlKGUpXG5cbiAgICBpZiAoZS5rZXlDb2RlID09PSAyNykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBcIlwiIH0pXG5cbiAgICAgIGlmICh0aGlzLnByb3BzLm9uUHJlc3NFc2MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25QcmVzc0VzYyh2YWx1ZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZS5rZXlDb2RlID09PSAxMyAmJiB0aGlzLnByb3BzLm9uUHJlc3NFbnRlcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBcIlwiIH0pXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vblByZXNzRW50ZXIodmFsdWUpXG4gICAgfVxuXG4gICAgaWYgKGUua2V5Q29kZSA9PT0gMTg4ICYmIHRoaXMucHJvcHMub25UeXBlQ29tbWEpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogXCJcIiB9KVxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25QcmVzc0VudGVyKHZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dFwiPlxuICAgICAgICB7dGhpcy5wcm9wcy5pY29uID8gPEljb24gbmFtZT17dGhpcy5wcm9wcy5pY29ufSBzdHJva2U9e3RoaXMucHJvcHMuaWNvblN0cm9rZX0gLz4gOiBudWxsfVxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHQvY3NzXCJcbiAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnN0YXRlLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB0aGlzLm9uQ2hhbmdlKGUpfVxuICAgICAgICAgICAgICAgb25LZXlVcD17KGUpID0+IHRoaXMub25LZXlVcChlKX1cbiAgICAgICAgICAgICAgIG9uRm9jdXM9eyhlKSA9PiB0aGlzLm9uRm9jdXMoZSl9XG4gICAgICAgICAgICAgICBvbkJsdXI9eyhlKSA9PiB0aGlzLm9uQmx1cihlKX1cbiAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgICAgICAgcmVmPXtpbnB1dCA9PiB0aGlzLmVsID0gaW5wdXR9XG4gICAgICAgICAgICAgICB0eXBlPXt0aGlzLnByb3BzLnR5cGUgfHwgXCJ0ZXh0XCJ9XG4gICAgICAgICAgICAgICBhdXRvY29tcGxldGU9e3RoaXMucHJvcHMuYXV0b2NvbXBsZXRlID09PSBmYWxzZSA/IFwib2ZmXCIgOiBcIm9uXCJ9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IFRhZ2dpbmdGb3JtIGZyb20gXCIuL3RhZ2dpbmctZm9ybVwiXG5pbXBvcnQgcmVsYXRpdmVEYXRlIGZyb20gXCJyZWxhdGl2ZS1kYXRlXCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaWtlZERpYWxvZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5yZXNldChwcm9wcylcbiAgfVxuXG4gIHJlc2V0KHByb3BzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc09ubGluZTogbmF2aWdhdG9yLm9uTGluZSxcbiAgICAgIGlzSnVzdExpa2VkOiBwcm9wcy5pc0p1c3RMaWtlZCxcbiAgICAgIGxpa2U6IHByb3BzLmxpa2VcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZ1wiPlxuICAgICAgICB7dGhpcy5wcm9wcy5pc0p1c3RMaWtlZCA/IDxoMj5Eb25lLjwvaDI+IDogbnVsbH1cbiAgICAgICAgeyB0aGlzLnN0YXRlLmlzT25saW5lID8gdGhpcy5yZW5kZXJPbmxpbmVCb2R5KCkgOiB0aGlzLnJlbmRlck9mZmxpbmVCb2R5KCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyXCI+XG4gICAgICAgICAgPEljb24gbmFtZT1cInRyYXNoXCIgdGl0bGU9XCJVbmxpa2UgVGhpcyBQYWdlXCIgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy51bmxpa2UoKX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJPZmZsaW5lQm9keSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJvZmZsaW5lXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY1wiPlxuICAgICAgICAgIHt0aGlzLnJlbmRlckxpa2VkQWdvKCl9XG4gICAgICAgICAgPGJyIC8+PGJyIC8+XG4gICAgICAgICAgWW91J3JlIGN1cnJlbnRseSBvZmZsaW5lIGJ1dCBpdCdzIG9rLlxuICAgICAgICAgIDxiciAvPlxuICAgICAgICAgIFRoZSBjaGFuZ2VzIHdpbGwgc3luYyB3aGVuIHlvdSBjb25uZWN0LlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck9ubGluZUJvZHkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25saW5lXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmlzSnVzdExpa2VkID8gXCJZb3UgY2FuIGFkZCBzb21lIHRhZ3MsIHRvbzpcIiA6ICB0aGlzLnJlbmRlckxpa2VkQWdvKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8VGFnZ2luZ0Zvcm0gbGlrZT17dGhpcy5wcm9wcy5saWtlfVxuICAgICAgICAgICAgICAgICAgICAgb25BZGRUYWc9e3RoaXMucHJvcHMub25BZGRUYWd9XG4gICAgICAgICAgICAgICAgICAgICBvblJlbW92ZVRhZz17dGhpcy5wcm9wcy5vblJlbW92ZVRhZ31cbiAgICAgICAgICAgICAgICAgICAgIG9uU3RhcnRMb2FkaW5nPXt0aGlzLnByb3BzLm9uU3RhcnRMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICAgb25TdG9wTG9hZGluZz17dGhpcy5wcm9wcy5vblN0b3BMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICAgb25TeW5jPXt0aGlzLnByb3BzLm9uU3luY31cbiAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3I9e3RoaXMucHJvcHMub25FcnJvcn1cbiAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJMaWtlZEFnbygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaWtlZC1hZ29cIj5cbiAgICAgICAgWW91IGxpa2VkIHRoaXMgcGFnZSB7cmVsYXRpdmVEYXRlKHRoaXMucHJvcHMubGlrZS5saWtlZEF0KX0uXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IElucHV0IGZyb20gXCIuL2lucHV0XCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuaW1wb3J0IGFwaSBmcm9tIFwiLi4vbGliL2FwaVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZ2dpbmdGb3JtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLmxvYWQoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgdGFnczogW11cbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICh0aGlzLnByb3BzLmxpa2UudXJsICE9PSBwcm9wcy5saWtlLnVybCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlzTG9hZGluZzogdHJ1ZSxcbiAgICAgICAgdGFnczogW11cbiAgICAgIH0pXG4gICAgICB0aGlzLmxvYWQoKVxuICAgIH1cbiAgfVxuXG4gIGxvYWQoKSB7XG4gICAgdGhpcy5wcm9wcy5vblN0YXJ0TG9hZGluZygpXG5cbiAgICBhcGkucG9zdChcIi9hcGkvbGlrZS10YWdzXCIsIHsgXCJ1cmxcIjogdGhpcy5wcm9wcy5saWtlLnVybCB9LCAoZXJyLCByZXNwKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLm9uU3RvcExvYWRpbmcoKVxuXG4gICAgICBpZiAoZXJyKSByZXR1cm4gdGhpcy5wcm9wcy5vbkVycm9yKGVycilcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHRhZ3M6IHJlc3AudGFncyxcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgYWRkVGFnKHRhZykge1xuICAgIHRoaXMucHJvcHMub25TdGFydExvYWRpbmcoKVxuXG4gICAgY29uc3QgdGFncyA9IHRhZy5zcGxpdCgvLFxccyovKVxuXG4gICAgYXBpLnB1dCgnL2FwaS9saWtlLXRhZ3MnLCB7IHRhZ3M6IHRhZ3MsIHVybDogdGhpcy5wcm9wcy5saWtlLnVybCB9LCBlcnIgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5vblN0b3BMb2FkaW5nKClcbiAgICAgIGlmIChlcnIpIHJldHVybiB0aGlzLnByb3BzLm9uRXJyb3IoZXJyKVxuICAgICAgdGhpcy5sb2FkKClcbiAgICB9KVxuXG4gICAgY29uc3QgY29weSA9IHRoaXMuc3RhdGUudGFncy5zbGljZSgpXG4gICAgY29weS5wdXNoLmFwcGx5KGNvcHksIHRhZ3MpXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRhZ3M6IGNvcHkgfSlcbiAgfVxuXG4gIGRlbGV0ZVRhZyh0YWcpIHtcbiAgICB0aGlzLnByb3BzLm9uU3RhcnRMb2FkaW5nKClcblxuICAgIGFwaS5kZWxldGUoJy9hcGkvbGlrZS10YWdzJywgeyB0YWc6IHRhZywgdXJsOiB0aGlzLnByb3BzLmxpa2UudXJsIH0sIGVyciA9PiB7XG4gICAgICB0aGlzLnByb3BzLm9uU3RvcExvYWRpbmcoKVxuICAgICAgaWYgKGVycikgcmV0dXJuIHRoaXMucHJvcHMub25FcnJvcihlcnIpXG4gICAgICB0aGlzLmxvYWQoKVxuICAgIH0pXG5cbiAgICBjb25zdCBjb3B5ID0gdGhpcy5zdGF0ZS50YWdzLnNsaWNlKClcbiAgICBsZXQgaW5kZXggPSAtMVxuXG4gICAgbGV0IGkgPSBjb3B5Lmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGlmIChjb3B5W2ldID09PSB0YWcgfHwgY29weVtpXS5uYW1lID09IHRhZykge1xuICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBjb3B5LnNwbGljZShpbmRleCwgMSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0YWdzOiBjb3B5IH0pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhZ2dpbmctZm9ybVwiPlxuICAgICAgICA8SW5wdXQgb25QcmVzc0VudGVyPXt2YWx1ZSA9PiB0aGlzLmFkZFRhZyh2YWx1ZSl9IG9uVHlwZUNvbW1hPXt2YWx1ZSA9PiB0aGlzLmFkZFRhZyh2YWx1ZSl9IGljb249XCJ0YWdcIiBwbGFjZWhvbGRlcj1cIlR5cGUgYSB0YWcgJiBoaXQgZW50ZXJcIiBhdXRvZm9jdXMgLz5cbiAgICAgICAge3RoaXMucmVuZGVyVGFncygpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGFncygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50YWdzLmxlbmd0aCA9PSAwKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhZ3NcIj5cbiAgICAgICAge3RoaXMuc3RhdGUudGFncy5tYXAodCA9PiB0aGlzLnJlbmRlclRhZyh0KSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUYWcodGFnKSB7XG4gICAgaWYgKHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0YWcgPSB7IG5hbWU6IHRhZyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFnXCI+XG4gICAgICAgIDxJY29uIG5hbWU9XCJjbG9zZVwiIHN0cm9rZT1cIjVcIiB0aXRsZT17YERlbGV0ZSBcIiR7dGFnLm5hbWV9XCJgfSBvbmNsaWNrPXsoKSA9PiB0aGlzLmRlbGV0ZVRhZyh0YWcubmFtZSl9IC8+XG4gICAgICAgIHt0YWcubmFtZX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldEFzTGlrZWQsXG4gIHNldEFzTm90TGlrZWQsXG4gIHNldEFzTG9hZGluZ1xufVxuXG5mdW5jdGlvbiBzZXRBc0xpa2VkICgpIHtcbiAgc2V0SWNvbihzYWZhcmkuZXh0ZW5zaW9uLmJhc2VVUkkgKyAnaW1hZ2VzL2hlYXJ0LWljb24tbGlrZWQucG5nJylcbiAgc2V0VG9vbHRpcChcIlVubGlrZSB0aGlzIHBhZ2VcIilcbn1cblxuZnVuY3Rpb24gc2V0QXNOb3RMaWtlZCgpIHtcbiAgc2V0SWNvbihzYWZhcmkuZXh0ZW5zaW9uLmJhc2VVUkkgKyAnaW1hZ2VzL2hlYXJ0LWljb24ucG5nJylcbiAgc2V0VG9vbHRpcChcIkxpa2UgVGhpcyBQYWdlXCIpXG59XG5cbmZ1bmN0aW9uIHNldEFzTG9hZGluZygpIHtcbiAgc2V0SWNvbihzYWZhcmkuZXh0ZW5zaW9uLmJhc2VVUkkgKyAnaW1hZ2VzL2hlYXJ0LWljb24tbG9hZGluZy5wbmcnKVxuICBzZXRUb29sdGlwKFwiQ29ubmVjdGluZyB0byBLb3ptb3MuLi5cIilcbn1cblxuZnVuY3Rpb24gc2V0SWNvbiAoc3JjKSB7XG4gIHNhZmFyaS5leHRlbnNpb24udG9vbGJhckl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKHRvb2xiYXIpIHtcbiAgICB0b29sYmFyLmltYWdlID0gc3JjXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHNldFRvb2x0aXAgKHRleHQpIHtcbiAgc2FmYXJpLmV4dGVuc2lvbi50b29sYmFySXRlbXMuZm9yRWFjaChmdW5jdGlvbiAodG9vbGJhcikge1xuICAgIHRvb2xiYXIudG9vbFRpcCA9IHRleHRcbiAgfSlcbn1cbiIsInZhciBsYXN0VVJMID0gJydcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZSxcbiAgY3VycmVudCxcbiAgb25VcGRhdGVkXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSAodXJsKSB7XG4gIHNhZmFyaS5hcHBsaWNhdGlvbi5hY3RpdmVCcm93c2VyV2luZG93Lm9wZW5UYWIoKS51cmwgPSB1cmxcbn1cblxuZnVuY3Rpb24gY3VycmVudCAoKSB7XG4gIHJldHVybiBzYWZhcmkuYXBwbGljYXRpb24uYWN0aXZlQnJvd3NlcldpbmRvdy5hY3RpdmVUYWJcbn1cblxuZnVuY3Rpb24gb25VcGRhdGVkIChjYWxsYmFjaykge1xuICBzYWZhcmkuYXBwbGljYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImFjdGl2YXRlXCIsIG9uY2hhbmdlLCB0cnVlKTtcbiAgc2FmYXJpLmFwcGxpY2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmVOYXZpZ2F0ZVwiLCBvbmNoYW5nZSwgdHJ1ZSk7XG4gIHNhZmFyaS5hcHBsaWNhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgb25jaGFuZ2UsIHRydWUpO1xuXG4gIGNoZWNrKClcblxuICBmdW5jdGlvbiBvbmNoYW5nZSAoZXZlbnQpIHtcbiAgICBpZiAoY3VycmVudCgpLnVybCA9PT0gbGFzdFVSTCkgcmV0dXJuXG4gICAgbGFzdFVSTCA9IGN1cnJlbnQoKS51cmxcbiAgICBjYWxsYmFjaygpXG4gIH1cblxuICBmdW5jdGlvbiBjaGVjayAoKSB7XG4gICAgb25jaGFuZ2UoKVxuICAgIHNldFRpbWVvdXQoY2hlY2ssIDUwMClcbiAgfVxufVxuIl19
