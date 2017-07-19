(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var messageCounter = 0;

var DEFAULT_TIMEOUT_SECS = exports.DEFAULT_TIMEOUT_SECS = 5;

var Messaging = function () {
  function Messaging() {
    _classCallCheck(this, Messaging);

    this.listenForMessages();
    this.waiting = {};
  }

  _createClass(Messaging, [{
    key: 'draft',
    value: function draft(_ref) {
      var id = _ref.id,
          content = _ref.content,
          error = _ref.error,
          to = _ref.to,
          reply = _ref.reply;

      id = this.generateId();

      return {
        from: this.name,
        to: to || this.target,
        error: content.error || error,
        id: id, content: content, reply: reply
      };
    }
  }, {
    key: 'generateId',
    value: function generateId() {
      return Date.now() * 1000 + ++messageCounter;
    }
  }, {
    key: 'onReceive',
    value: function onReceive(msg) {
      if (msg.to !== this.name) return true;

      if (msg.reply && this.waiting[msg.reply]) {
        this.waiting[msg.reply](msg);
      }

      if (msg.reply) {
        return true;
      }

      if (msg.content.ping) {
        this.reply(msg, { pong: true });
        return true;
      }
    }
  }, {
    key: 'ping',
    value: function ping(callback) {
      this.send({ ping: true }, callback);
    }
  }, {
    key: 'reply',
    value: function reply(msg, options) {
      if (!options.content) {
        options = {
          content: options
        };
      }

      options.reply = msg.id;
      options.to = msg.from;

      this.send(options);
    }
  }, {
    key: 'send',
    value: function send(options, callback) {
      var msg = this.draft(options.content ? options : { content: options });

      this.sendMessage(msg);

      if (callback) {
        this.waitReplyFor(msg.id, DEFAULT_TIMEOUT_SECS, callback);
      }
    }
  }, {
    key: 'waitReplyFor',
    value: function waitReplyFor(msgId, timeoutSecs, callback) {
      var self = this;
      var timeout = undefined;

      if (timeoutSecs > 0) {
        timeout = setTimeout(onTimeout, timeoutSecs * 1000);
      }

      this.waiting[msgId] = function (msg) {
        done();
        callback(msg);
      };

      return done;

      function done() {
        if (timeout != undefined) {
          clearTimeout(timeout);
        }

        timeout = undefined;
        delete self.waiting[msgId];
      }

      function onTimeout() {
        done();
        callback({ error: 'Message response timeout (' + timeoutSecs + ')s.' });
      }
    }
  }]);

  return Messaging;
}();

exports.default = Messaging;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _icons = require("./icons");

var _icons2 = _interopRequireDefault(_icons);

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
      var _this2 = this;

      return (0, _preact.h)(
        "div",
        { className: "button " + (this.props.className || this.props.icon) + "-button with-" + this.props.icon + "-icon", onclick: function onclick() {
            return _this2.onClick();
          }, onMouseOver: this.props.onMouseOver, onMouseOut: this.props.onMouseOut },
        (0, _preact.h)("img", { className: "icon", src: this.src() })
      );
    }
  }, {
    key: "onClick",
    value: function onClick() {
      if (this.props.onClick) this.props.onClick();
    }
  }, {
    key: "src",
    value: function src() {
      return _icons2.default[this.props.icon];
    }
  }]);

  return Button;
}(_preact.Component);

exports.default = Button;

},{"./icons":4,"preact":13}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Content = function (_Component) {
  _inherits(Content, _Component);

  function Content() {
    _classCallCheck(this, Content);

    return _possibleConstructorReturn(this, (Content.__proto__ || Object.getPrototypeOf(Content)).apply(this, arguments));
  }

  _createClass(Content, [{
    key: "render",
    value: function render() {
      var bg = this.props.wallpaper ? {
        backgroundImage: "url(" + this.props.wallpaper.urls.thumb + ")"
      } : null;

      return (0, _preact.h)(
        "div",
        { className: "content-wrapper" },
        (0, _preact.h)("div", { className: "bg", style: bg }),
        (0, _preact.h)(
          "div",
          { className: "center" },
          (0, _preact.h)(
            "div",
            { className: "content" },
            this.props.children
          )
        )
      );
    }
  }]);

  return Content;
}(_preact.Component);

exports.default = Content;

},{"preact":13}],4:[function(require,module,exports){
module.exports={
  "white": {
    "search": "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2Ljk2NiA1Ni45NjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU2Ljk2NiA1Ni45NjY7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4Ij4KPHBhdGggZD0iTTU1LjE0Niw1MS44ODdMNDEuNTg4LDM3Ljc4NmMzLjQ4Ni00LjE0NCw1LjM5Ni05LjM1OCw1LjM5Ni0xNC43ODZjMC0xMi42ODItMTAuMzE4LTIzLTIzLTIzcy0yMywxMC4zMTgtMjMsMjMgIHMxMC4zMTgsMjMsMjMsMjNjNC43NjEsMCw5LjI5OC0xLjQzNiwxMy4xNzctNC4xNjJsMTMuNjYxLDE0LjIwOGMwLjU3MSwwLjU5MywxLjMzOSwwLjkyLDIuMTYyLDAuOTIgIGMwLjc3OSwwLDEuNTE4LTAuMjk3LDIuMDc5LTAuODM3QzU2LjI1NSw1NC45ODIsNTYuMjkzLDUzLjA4LDU1LjE0Niw1MS44ODd6IE0yMy45ODQsNmM5LjM3NCwwLDE3LDcuNjI2LDE3LDE3cy03LjYyNiwxNy0xNywxNyAgcy0xNy03LjYyNi0xNy0xN1MxNC42MSw2LDIzLjk4NCw2eiIgZmlsbD0iI0ZGRkZGRiIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K",
    "heart": "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDUxMCA1MTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMCA1MTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iZmF2b3JpdGUiPgoJCTxwYXRoIGQ9Ik0yNTUsNDg5LjZsLTM1LjctMzUuN0M4Ni43LDMzNi42LDAsMjU3LjU1LDAsMTYwLjY1QzAsODEuNiw2MS4yLDIwLjQsMTQwLjI1LDIwLjRjNDMuMzUsMCw4Ni43LDIwLjQsMTE0Ljc1LDUzLjU1ICAgIEMyODMuMDUsNDAuOCwzMjYuNCwyMC40LDM2OS43NSwyMC40QzQ0OC44LDIwLjQsNTEwLDgxLjYsNTEwLDE2MC42NWMwLDk2LjktODYuNywxNzUuOTUtMjE5LjMsMjkzLjI1TDI1NSw0ODkuNnoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K",
    "page": "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQzOC41MzMgNDM4LjUzMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDM4LjUzMyA0MzguNTMzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTM5Ni4yODMsMTMwLjE4OGMtMy44MDYtOS4xMzUtOC4zNzEtMTYuMzY1LTEzLjcwMy0yMS42OTVsLTg5LjA3OC04OS4wODFjLTUuMzMyLTUuMzI1LTEyLjU2LTkuODk1LTIxLjY5Ny0xMy43MDQgICBDMjYyLjY3MiwxLjkwMywyNTQuMjk3LDAsMjQ2LjY4NywwSDYzLjk1M0M1Ni4zNDEsMCw0OS44NjksMi42NjMsNDQuNTQsNy45OTNjLTUuMzMsNS4zMjctNy45OTQsMTEuNzk5LTcuOTk0LDE5LjQxNHYzODMuNzE5ICAgYzAsNy42MTcsMi42NjQsMTQuMDg5LDcuOTk0LDE5LjQxN2M1LjMzLDUuMzI1LDExLjgwMSw3Ljk5MSwxOS40MTQsNy45OTFoMzEwLjYzM2M3LjYxMSwwLDE0LjA3OS0yLjY2NiwxOS40MDctNy45OTEgICBjNS4zMjgtNS4zMzIsNy45OTQtMTEuOCw3Ljk5NC0xOS40MTdWMTU1LjMxM0M0MDEuOTkxLDE0Ny42OTksNDAwLjA4OCwxMzkuMzIzLDM5Ni4yODMsMTMwLjE4OHogTTI1NS44MTYsMzguODI2ICAgYzUuNTE3LDEuOTAzLDkuNDE4LDMuOTk5LDExLjcwNCw2LjI4bDg5LjM2Niw4OS4zNjZjMi4yNzksMi4yODYsNC4zNzQsNi4xODYsNi4yNzYsMTEuNzA2SDI1NS44MTZWMzguODI2eiBNMzY1LjQ0OSw0MDEuOTkxICAgSDczLjA4OVYzNi41NDVoMTQ2LjE3OHYxMTguNzcxYzAsNy42MTQsMi42NjIsMTQuMDg0LDcuOTkyLDE5LjQxNGM1LjMzMiw1LjMyNywxMS44LDcuOTk0LDE5LjQxNyw3Ljk5NGgxMTguNzczVjQwMS45OTF6IiBmaWxsPSIjRkZGRkZGIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="
  },
  "black": {
    "search": "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI1MC4zMTMgMjUwLjMxMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwLjMxMyAyNTAuMzEzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+CjxnIGlkPSJTZWFyY2giPgoJPHBhdGggc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkOyIgZD0iTTI0NC4xODYsMjE0LjYwNGwtNTQuMzc5LTU0LjM3OGMtMC4yODktMC4yODktMC42MjgtMC40OTEtMC45My0wLjc2ICAgYzEwLjctMTYuMjMxLDE2Ljk0NS0zNS42NiwxNi45NDUtNTYuNTU0QzIwNS44MjIsNDYuMDc1LDE1OS43NDcsMCwxMDIuOTExLDBTMCw0Ni4wNzUsMCwxMDIuOTExICAgYzAsNTYuODM1LDQ2LjA3NCwxMDIuOTExLDEwMi45MSwxMDIuOTExYzIwLjg5NSwwLDQwLjMyMy02LjI0NSw1Ni41NTQtMTYuOTQ1YzAuMjY5LDAuMzAxLDAuNDcsMC42NCwwLjc1OSwwLjkyOWw1NC4zOCw1NC4zOCAgIGM4LjE2OSw4LjE2OCwyMS40MTMsOC4xNjgsMjkuNTgzLDBDMjUyLjM1NCwyMzYuMDE3LDI1Mi4zNTQsMjIyLjc3MywyNDQuMTg2LDIxNC42MDR6IE0xMDIuOTExLDE3MC4xNDYgICBjLTM3LjEzNCwwLTY3LjIzNi0zMC4xMDItNjcuMjM2LTY3LjIzNWMwLTM3LjEzNCwzMC4xMDMtNjcuMjM2LDY3LjIzNi02Ny4yMzZjMzcuMTMyLDAsNjcuMjM1LDMwLjEwMyw2Ny4yMzUsNjcuMjM2ICAgQzE3MC4xNDYsMTQwLjA0NCwxNDAuMDQzLDE3MC4xNDYsMTAyLjkxMSwxNzAuMTQ2eiIgZmlsbD0iIzAwMDAwMCIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=",
    "page": "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQzOC41MzMgNDM4LjUzMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDM4LjUzMyA0MzguNTMzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTM5Ni4yODMsMTMwLjE4OGMtMy44MDYtOS4xMzUtOC4zNzEtMTYuMzY1LTEzLjcwMy0yMS42OTVsLTg5LjA3OC04OS4wODFjLTUuMzMyLTUuMzI1LTEyLjU2LTkuODk1LTIxLjY5Ny0xMy43MDQgICBDMjYyLjY3MiwxLjkwMywyNTQuMjk3LDAsMjQ2LjY4NywwSDYzLjk1M0M1Ni4zNDEsMCw0OS44NjksMi42NjMsNDQuNTQsNy45OTNjLTUuMzMsNS4zMjctNy45OTQsMTEuNzk5LTcuOTk0LDE5LjQxNHYzODMuNzE5ICAgYzAsNy42MTcsMi42NjQsMTQuMDg5LDcuOTk0LDE5LjQxN2M1LjMzLDUuMzI1LDExLjgwMSw3Ljk5MSwxOS40MTQsNy45OTFoMzEwLjYzM2M3LjYxMSwwLDE0LjA3OS0yLjY2NiwxOS40MDctNy45OTEgICBjNS4zMjgtNS4zMzIsNy45OTQtMTEuOCw3Ljk5NC0xOS40MTdWMTU1LjMxM0M0MDEuOTkxLDE0Ny42OTksNDAwLjA4OCwxMzkuMzIzLDM5Ni4yODMsMTMwLjE4OHogTTI1NS44MTYsMzguODI2ICAgYzUuNTE3LDEuOTAzLDkuNDE4LDMuOTk5LDExLjcwNCw2LjI4bDg5LjM2Niw4OS4zNjZjMi4yNzksMi4yODYsNC4zNzQsNi4xODYsNi4yNzYsMTEuNzA2SDI1NS44MTZWMzguODI2eiBNMzY1LjQ0OSw0MDEuOTkxICAgSDczLjA4OVYzNi41NDVoMTQ2LjE3OHYxMTguNzcxYzAsNy42MTQsMi42NjIsMTQuMDg0LDcuOTkyLDE5LjQxNGM1LjMzMiw1LjMyNywxMS44LDcuOTk0LDE5LjQxNyw3Ljk5NGgxMTguNzczVjQwMS45OTF6IiBmaWxsPSIjMDAwMDAwIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="
  }
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _button = require("./button");

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Menu = function (_Component) {
  _inherits(Menu, _Component);

  function Menu() {
    _classCallCheck(this, Menu);

    return _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).apply(this, arguments));
  }

  _createClass(Menu, [{
    key: "setTitle",
    value: function setTitle(title) {
      this.setState({ title: title });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return (0, _preact.h)(
        "div",
        { className: "menu" },
        (0, _preact.h)(
          "div",
          { className: "title" },
          this.state.title || ""
        ),
        (0, _preact.h)(
          "ul",
          { className: "buttons" },
          (0, _preact.h)(
            "li",
            null,
            (0, _preact.h)(_button2.default, {
              icon: "calendar",
              onMouseOver: function onMouseOver() {
                return _this2.setTitle('Recently Visited');
              },
              onMouseOut: function onMouseOut() {
                return _this2.setTitle();
              },
              onClick: function onClick() {
                return _this2.props.openRecent();
              } })
          ),
          (0, _preact.h)(
            "li",
            null,
            (0, _preact.h)(_button2.default, {
              icon: "heart",
              onMouseOver: function onMouseOver() {
                return _this2.setTitle('Bookmarks');
              },
              onMouseOut: function onMouseOut() {
                return _this2.setTitle();
              },
              onClick: function onClick() {
                return _this2.props.openBookmarks();
              } })
          ),
          (0, _preact.h)(
            "li",
            null,
            (0, _preact.h)(_button2.default, {
              icon: "fire",
              onMouseOver: function onMouseOver() {
                return _this2.setTitle('Most Visited');
              },
              onMouseOut: function onMouseOut() {
                return _this2.setTitle();
              },
              onClick: function onClick() {
                return _this2.props.openTop();
              } })
          )
        )
      );
    }
  }]);

  return Menu;
}(_preact.Component);

exports.default = Menu;

},{"./button":2,"preact":13}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _messaging = require('../lib/messaging');

var _messaging2 = _interopRequireDefault(_messaging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FromNewTabToBackground = function (_Messaging) {
  _inherits(FromNewTabToBackground, _Messaging);

  function FromNewTabToBackground() {
    _classCallCheck(this, FromNewTabToBackground);

    var _this = _possibleConstructorReturn(this, (FromNewTabToBackground.__proto__ || Object.getPrototypeOf(FromNewTabToBackground)).call(this));

    _this.name = 'kozmos:newtab';
    _this.target = 'kozmos:background';
    return _this;
  }

  _createClass(FromNewTabToBackground, [{
    key: 'listenForMessages',
    value: function listenForMessages() {
      var _this2 = this;

      chrome.runtime.onMessage.addListener(function (msg) {
        return _this2.onReceive(msg);
      });
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(msg, callback) {
      chrome.runtime.sendMessage(msg, callback);
    }
  }]);

  return FromNewTabToBackground;
}(_messaging2.default);

exports.default = FromNewTabToBackground;

},{"../lib/messaging":1}],7:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _wallpaper = require("./wallpaper");

var _wallpaper2 = _interopRequireDefault(_wallpaper);

var _menu = require("./menu");

var _menu2 = _interopRequireDefault(_menu);

var _button = require("./button");

var _button2 = _interopRequireDefault(_button);

var _wallpapers = require("./wallpapers");

var _wallpapers2 = _interopRequireDefault(_wallpapers);

var _search = require("./search");

var _search2 = _interopRequireDefault(_search);

var _icons = require("./icons");

var _icons2 = _interopRequireDefault(_icons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewTab = function (_Component) {
  _inherits(NewTab, _Component);

  function NewTab(props) {
    _classCallCheck(this, NewTab);

    var _this = _possibleConstructorReturn(this, (NewTab.__proto__ || Object.getPrototypeOf(NewTab)).call(this, props));

    _this.setState({
      wallpaper: null
    });
    return _this;
  }

  _createClass(NewTab, [{
    key: "render",
    value: function render() {
      return (0, _preact.h)(
        "div",
        { className: "newtab" },
        (0, _preact.h)(
          "div",
          { className: "center" },
          (0, _preact.h)(_search2.default, null)
        ),
        this.state.wallpaper ? (0, _preact.h)(_wallpaper2.default, this.state.wallpaper) : null
      );
    }
  }]);

  return NewTab;
}(_preact.Component);

(0, _preact.render)((0, _preact.h)(NewTab, null), document.body);

},{"./button":2,"./icons":4,"./menu":5,"./search":9,"./wallpaper":10,"./wallpapers":11,"preact":13}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _icons = require("./icons");

var _icons2 = _interopRequireDefault(_icons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchInput = function (_Component) {
  _inherits(SearchInput, _Component);

  function SearchInput() {
    _classCallCheck(this, SearchInput);

    return _possibleConstructorReturn(this, (SearchInput.__proto__ || Object.getPrototypeOf(SearchInput)).apply(this, arguments));
  }

  _createClass(SearchInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.input) this.input.focus();
    }
  }, {
    key: "render",
    value: function render() {
      return (0, _preact.h)(
        "div",
        { className: "search-input" },
        this.renderIcon(),
        this.renderInput()
      );
    }
  }, {
    key: "renderIcon",
    value: function renderIcon() {
      return (0, _preact.h)("img", { className: "icon", src: _icons2.default.black.search });
    }
  }, {
    key: "renderInput",
    value: function renderInput() {
      var _this2 = this;

      return (0, _preact.h)("input", { ref: function ref(el) {
          return _this2.input = el;
        },
        type: "text",
        className: "input",
        placeholder: "Search your history and bookmarks",
        onChange: function onChange(e) {
          return _this2.props.onQueryChange(e.target.value);
        },
        onKeyUp: function onKeyUp(e) {
          return _this2.props.onQueryChange(e.target.value);
        },
        value: this.props.query });
    }
  }]);

  return SearchInput;
}(_preact.Component);

exports.default = SearchInput;

},{"./icons":4,"preact":13}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _content = require("./content");

var _content2 = _interopRequireDefault(_content);

var _messaging = require("./messaging");

var _messaging2 = _interopRequireDefault(_messaging);

var _searchInput = require("./search-input");

var _searchInput2 = _interopRequireDefault(_searchInput);

var _debounceFn = require("debounce-fn");

var _debounceFn2 = _interopRequireDefault(_debounceFn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Search = function (_Component) {
  _inherits(Search, _Component);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, props));

    _this.messages = new _messaging2.default();
    _this.searchBookmarks = (0, _debounceFn2.default)(_this._searchBookmarks.bind(_this), 600);

    _this.setState({
      query: '',
      likes: [],
      topSites: []
    });

    chrome.topSites.get(function (topSites) {
      return _this.setState({ topSites: topSites.slice(0, 5) });
    });
    _this.getRecentBookmarks(function (err, likes) {
      return _this.setState({ likes: likes });
    });
    return _this;
  }

  _createClass(Search, [{
    key: "getRecentBookmarks",
    value: function getRecentBookmarks(callback) {
      this.messages.send({ task: 'get-recent-bookmarks' }, function (resp) {
        if (resp.error) return callback(new Error(resp.error));
        callback(undefined, resp.media.concat(resp.non_media).sort(sortLikes).slice(0, 5));
      });
    }
  }, {
    key: "_searchBookmarks",
    value: function _searchBookmarks(query, callback) {
      var _this2 = this;

      this.messages.send({ task: 'search-bookmarks', query: query }, function (resp) {
        if (resp.content.query !== _this2.state.query) return;
        if (resp.error) return callback(new Error(resp.error));
        callback(undefined, resp.content);
      });
    }
  }, {
    key: "onQueryChange",
    value: function onQueryChange(query) {
      var _this3 = this;

      if (query === this.state.query) return;

      if (query.length == 0) {
        return this.setState({
          loading: false,
          likes: [],
          query: ""
        });
      }

      if (query === this.state.query.trim()) return;

      this.setState({
        loading: true,
        likes: [],
        history: [],
        query: query
      });

      this.searchBookmarks(query.trim(), function (error, result) {
        if (error) return _this3.setState({ error: error });

        _this3.setState({
          likes: result.media.concat(result.non_media).sort(sortLikes),
          loading: false
        });
      });

      chrome.history.search({ text: query.trim() }, function (history) {
        _this3.setState({
          history: history
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return (0, _preact.h)(
        _content2.default,
        { wallpaper: this.props.wallpaper },
        (0, _preact.h)(
          "div",
          { className: "bookmarks" },
          (0, _preact.h)(_searchInput2.default, { query: this.state.query, onQueryChange: function onQueryChange(query) {
              return _this4.onQueryChange(query);
            } }),
          this.renderTopSites(),
          this.renderHistory(),
          this.renderLikes(),
          this.renderLoading(),
          this.renderNoResults()
        )
      );
    }
  }, {
    key: "renderTopSites",
    value: function renderTopSites() {
      if (this.state.query) return;

      return (0, _preact.h)(
        "div",
        { className: "top-sites urls" },
        this.state.topSites.map(function (site) {
          return (0, _preact.h)(URLIcon, site);
        }),
        (0, _preact.h)("div", { className: "clear" })
      );
    }
  }, {
    key: "renderHistory",
    value: function renderHistory() {
      if (!this.state.history || this.state.history.length === 0) return;

      return (0, _preact.h)(
        "div",
        { className: "history urls" },
        this.state.history.slice(0, 5).map(function (url) {
          return (0, _preact.h)(URLIcon, url);
        }),
        (0, _preact.h)("div", { className: "clear" })
      );
    }
  }, {
    key: "renderLikes",
    value: function renderLikes() {
      return (0, _preact.h)(
        "div",
        { className: "search-likes urls" },
        this.state.likes.length > 10 ? this.renderMoreResultsLink() : null,
        this.state.likes.slice(0, 5).map(function (like) {
          return (0, _preact.h)(URLIcon, like);
        }),
        (0, _preact.h)("div", { className: "clear" })
      );
    }
  }, {
    key: "renderMoreResultsLink",
    value: function renderMoreResultsLink() {
      return (0, _preact.h)(
        "a",
        { className: "more-results-button", href: "https://getkozmos.com/search?query=" + this.state.query },
        "See More Results"
      );
    }
  }, {
    key: "renderLoading",
    value: function renderLoading() {
      var query = this.state.query.trim();
      if (!this.state.loading || query == "") return;

      return (0, _preact.h)(
        "div",
        { className: "loading" },
        (0, _preact.h)(Spinner, null)
      );
    }
  }, {
    key: "renderNoResults",
    value: function renderNoResults() {
      if (this.state.loading || this.state.query === "" || this.state.likes.length > 0) return;

      return (0, _preact.h)(
        "div",
        { className: "loading" },
        (0, _preact.h)(
          "p",
          null,
          "No Bookmarks Found For \"",
          (0, _preact.h)(
            "strong",
            null,
            this.state.query
          ),
          "\" :("
        )
      );
    }
  }]);

  return Search;
}(_preact.Component);

exports.default = Search;


function sortLikes(a, b) {
  if (a.liked_at < b.liked_at) return 1;
  if (a.liked_at > b.liked_at) return -1;
  return 0;
}

},{"./content":3,"./messaging":6,"./search-input":8,"debounce-fn":12,"preact":13}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Wallpaper = function (_Component) {
  _inherits(Wallpaper, _Component);

  function Wallpaper() {
    _classCallCheck(this, Wallpaper);

    return _possibleConstructorReturn(this, (Wallpaper.__proto__ || Object.getPrototypeOf(Wallpaper)).apply(this, arguments));
  }

  _createClass(Wallpaper, [{
    key: "render",
    value: function render() {
      var style = {
        backgroundImage: "url(" + this.props.urls.full + ")"
      };

      return (0, _preact.h)(
        "div",
        { className: "wallpaper", style: style },
        this.renderAuthor()
      );
    }
  }, {
    key: "renderAuthor",
    value: function renderAuthor() {
      var name = this.state.user.name || this.state.user.username;
      var link = this.state.user.portfolio_url || 'https://unsplash.com/@' + this.state.user.username;
      var profilePhotoStyle = {
        backgroundImage: "url(" + this.state.user.profile_image.small + ")"
      };

      return (0, _preact.h)(
        "a",
        { href: link, className: "author" },
        (0, _preact.h)("span", { className: "profile-image", style: profilePhotoStyle }),
        (0, _preact.h)(
          "label",
          null,
          "Photographer: "
        ),
        name
      );
    }
  }]);

  return Wallpaper;
}(_preact.Component);

exports.default = Wallpaper;

},{"preact":13}],11:[function(require,module,exports){
module.exports=[
  {
    "categories": [
      {
        "id": 4,
        "links": {
          "photos": "https://api.unsplash.com/categories/4/photos",
          "self": "https://api.unsplash.com/categories/4"
        },
        "photo_count": 54184,
        "title": "Nature"
      }
    ],
    "color": "#C0C198",
    "created_at": "2016-03-23T05:09:47-04:00",
    "current_user_collections": [],
    "description": null,
    "height": 3319,
    "id": "DMcI0cmYJYk",
    "liked_by_user": false,
    "likes": 1203,
    "links": {
      "download": "http://unsplash.com/photos/DMcI0cmYJYk/download",
      "download_location": "https://api.unsplash.com/photos/DMcI0cmYJYk/download",
      "html": "http://unsplash.com/photos/DMcI0cmYJYk",
      "self": "https://api.unsplash.com/photos/DMcI0cmYJYk"
    },
    "updated_at": "2017-07-01T03:53:54-04:00",
    "urls": {
      "full": "https://images.unsplash.com/photo-1458724029936-2cc6ee38f5ef?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&s=663958309c9dd33a6df01c3f3c93ed1d",
      "raw": "https://images.unsplash.com/photo-1458724029936-2cc6ee38f5ef",
      "regular": "https://images.unsplash.com/photo-1458724029936-2cc6ee38f5ef?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=4b87eb6242f6a451a2125290adbcb37a",
      "small": "https://images.unsplash.com/photo-1458724029936-2cc6ee38f5ef?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&s=4c417769a46569ba37ced7a82d7b918c",
      "thumb": "https://images.unsplash.com/photo-1458724029936-2cc6ee38f5ef?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=02757be3d9b4dcbf8362c15466ca4725"
    },
    "user": {
      "bio": "English photographer living in Sydney, Australia. Shooting with a Canon 6D.\r\n\r\nSamscrim@googlemail.com\r\n",
      "first_name": "Samuel",
      "id": "WdNeYqkfYKM",
      "last_name": "Scrimshaw",
      "links": {
        "followers": "https://api.unsplash.com/users/samscrim/followers",
        "following": "https://api.unsplash.com/users/samscrim/following",
        "html": "http://unsplash.com/@samscrim",
        "likes": "https://api.unsplash.com/users/samscrim/likes",
        "photos": "https://api.unsplash.com/users/samscrim/photos",
        "portfolio": "https://api.unsplash.com/users/samscrim/portfolio",
        "self": "https://api.unsplash.com/users/samscrim"
      },
      "location": "Australia",
      "name": "Samuel Scrimshaw",
      "portfolio_url": "http://www.instagram.com/samscrim",
      "profile_image": {
        "large": "https://images.unsplash.com/profile-1458723679261-a5ef32cb2a04?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=15afce4fd286074d92fa72632d8caa34",
        "medium": "https://images.unsplash.com/profile-1458723679261-a5ef32cb2a04?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=4509645b9289a9fea8b85518c77ce0ed",
        "small": "https://images.unsplash.com/profile-1458723679261-a5ef32cb2a04?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=90ea758be6999807b6d8da1ec602530f"
      },
      "total_collections": 0,
      "total_likes": 0,
      "total_photos": 14,
      "twitter_username": null,
      "updated_at": "2017-07-01T07:05:24-04:00",
      "username": "samscrim"
    },
    "width": 4979
  },
  {
    "categories": [],
    "color": "#382F30",
    "created_at": "2017-05-07T19:46:32-04:00",
    "current_user_collections": [],
    "description": null,
    "height": 2000,
    "id": "EwE4tBYh3ms",
    "liked_by_user": false,
    "likes": 194,
    "links": {
      "download": "http://unsplash.com/photos/EwE4tBYh3ms/download",
      "download_location": "https://api.unsplash.com/photos/EwE4tBYh3ms/download",
      "html": "http://unsplash.com/photos/EwE4tBYh3ms",
      "self": "https://api.unsplash.com/photos/EwE4tBYh3ms"
    },
    "updated_at": "2017-07-01T04:23:24-04:00",
    "urls": {
      "full": "https://images.unsplash.com/photo-1494200483035-db7bc6aa5739?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&s=332589211b5f3b2cb7c64b7efa6f3473",
      "raw": "https://images.unsplash.com/photo-1494200483035-db7bc6aa5739",
      "regular": "https://images.unsplash.com/photo-1494200483035-db7bc6aa5739?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=f7124d88cd8be96a061108b6e3ef9d30",
      "small": "https://images.unsplash.com/photo-1494200483035-db7bc6aa5739?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&s=e7dffd6df9badea9caeba33b2a75cb13",
      "thumb": "https://images.unsplash.com/photo-1494200483035-db7bc6aa5739?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=98e73ef8e4b302cf7aad1bc611a7ec78"
    },
    "user": {
      "bio": "",
      "first_name": "Katie",
      "id": "nigTus9asR8",
      "last_name": "Treadway",
      "links": {
        "followers": "https://api.unsplash.com/users/katietreadway/followers",
        "following": "https://api.unsplash.com/users/katietreadway/following",
        "html": "http://unsplash.com/@katietreadway",
        "likes": "https://api.unsplash.com/users/katietreadway/likes",
        "photos": "https://api.unsplash.com/users/katietreadway/photos",
        "portfolio": "https://api.unsplash.com/users/katietreadway/portfolio",
        "self": "https://api.unsplash.com/users/katietreadway"
      },
      "location": "Bentonville, Ar",
      "name": "Katie Treadway",
      "portfolio_url": "http://www.katietreadwayphotography.com/",
      "profile_image": {
        "large": "https://images.unsplash.com/profile-1480865275933-251817fc5176?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=e1ecce36cee60ac84f89e6d5dda64f62",
        "medium": "https://images.unsplash.com/profile-1480865275933-251817fc5176?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=515a952a8812d9512bae1446327c7327",
        "small": "https://images.unsplash.com/profile-1480865275933-251817fc5176?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=ef8756c5abc4259b275410a8e80c05e6"
      },
      "total_collections": 0,
      "total_likes": 0,
      "total_photos": 7,
      "twitter_username": null,
      "updated_at": "2017-07-01T04:23:24-04:00",
      "username": "katietreadway"
    },
    "width": 3000
  },
  {
        "categories": [
            {
                "id": 2,
                "links": {
                    "photos": "https://api.unsplash.com/categories/2/photos",
                    "self": "https://api.unsplash.com/categories/2"
                },
                "photo_count": 22897,
                "title": "Buildings"
            }
        ],
        "color": "#2B2F2E",
        "created_at": "2016-03-22T17:38:44-04:00",
        "current_user_collections": [],
        "description": null,
        "height": 3366,
        "id": "jR4Zf-riEjI",
        "liked_by_user": false,
        "likes": 1141,
        "links": {
            "download": "http://unsplash.com/photos/jR4Zf-riEjI/download",
            "download_location": "https://api.unsplash.com/photos/jR4Zf-riEjI/download",
            "html": "http://unsplash.com/photos/jR4Zf-riEjI",
            "self": "https://api.unsplash.com/photos/jR4Zf-riEjI"
        },
        "updated_at": "2017-07-01T03:36:45-04:00",
    "urls": {
            "full": "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&s=09279a1a1cc6af8f7e41d1fc706c7025",
            "raw": "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7",
            "regular": "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=102451264e9cd0c6fc94768bf345e686",
            "small": "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&s=3000368aa265299433894bacc7d3526b",
            "thumb": "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=002dc5459c7e37f40f1b508d4bb1dd4e"
        },
        "user": {
            "bio": "London based photographer with an eye for the details in life, which is the basis of the aesthetic in my photographs. Whereas for some, focusing on details and precision detaches feelings, I use details to bring subjects to life.",
            "first_name": "Andrew",
            "id": "ixcRggHpUzs",
            "last_name": "Ridley",
            "links": {
                "followers": "https://api.unsplash.com/users/aridley88/followers",
                "following": "https://api.unsplash.com/users/aridley88/following",
                "html": "http://unsplash.com/@aridley88",
                "likes": "https://api.unsplash.com/users/aridley88/likes",
                "photos": "https://api.unsplash.com/users/aridley88/photos",
                "portfolio": "https://api.unsplash.com/users/aridley88/portfolio",
                "self": "https://api.unsplash.com/users/aridley88"
            },
            "location": "London, UK",
            "name": "Andrew Ridley",
            "portfolio_url": "http://www.aridleyphotography.com/",
            "profile_image": {
                "large": "https://images.unsplash.com/profile-1484418258731-64a647af6e08?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=169e025203647ffa802fad1459dcc33a",
                "medium": "https://images.unsplash.com/profile-1484418258731-64a647af6e08?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=31cbf3b5505a5a87ae69c13ca0d60bf7",
                "small": "https://images.unsplash.com/profile-1484418258731-64a647af6e08?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32&s=8e07874513530e9af29f14a14226cf0c"
            },
            "total_collections": 0,
            "total_likes": 36,
            "total_photos": 33,
            "twitter_username": "andrewridley",
            "updated_at": "2017-07-01T05:49:27-04:00",
            "username": "aridley88"
        },
        "width": 4488
  }
]

},{}],12:[function(require,module,exports){
module.exports = debounce;

function debounce (fn, wait) {
  var timer;
  var args;

  if (arguments.length == 1) {
    wait = 250;
  }

  return function () {
    if (timer != undefined) {
      clearTimeout(timer);
      timer = undefined;
    }

    args = arguments;

    timer = setTimeout(function () {
      fn.apply(undefined, args);
    }, wait);
  };
}

},{}],13:[function(require,module,exports){
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
            if (child === !0 || child === !1) child = null;
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
        if (!component.__d && (component.__d = !0) && 1 == items.push(component)) (options.debounceRendering || setTimeout)(rerender);
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
        if (node.parentNode) node.parentNode.removeChild(node);
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
                for (var i in value) node.style[i] = 'number' == typeof value[i] && IS_NON_DIMENSIONAL.test(i) === !1 ? value[i] + 'px' : value[i];
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
            if (null == value || value === !1) node.removeAttribute(name);
        } else {
            var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
            if (null == value || value === !1) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase()); else node.removeAttribute(name); else if ('function' != typeof value) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value); else node.setAttribute(name, value);
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
        if (null == vnode) vnode = '';
        if ('string' == typeof vnode) {
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
        if ('function' == typeof vnode.nodeName) return buildComponentFromVNode(dom, vnode, context, mountAll);
        isSvgMode = 'svg' === vnode.nodeName ? !0 : 'foreignObject' === vnode.nodeName ? !1 : isSvgMode;
        if (!dom || !isNamedNode(dom, String(vnode.nodeName))) {
            out = createNode(String(vnode.nodeName), isSvgMode);
            if (dom) {
                while (dom.firstChild) out.appendChild(dom.firstChild);
                if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
                recollectNodeTree(dom, !0);
            }
        }
        var fc = out.firstChild, props = out.__preactattr_ || (out.__preactattr_ = {}), vchildren = vnode.children;
        if (!hydrating && vchildren && 1 === vchildren.length && 'string' == typeof vchildren[0] && null != fc && void 0 !== fc.splitText && null == fc.nextSibling) {
            if (fc.nodeValue != vchildren[0]) fc.nodeValue = vchildren[0];
        } else if (vchildren && vchildren.length || null != fc) innerDiffNode(out, vchildren, context, mountAll, hydrating || null != props.dangerouslySetInnerHTML);
        diffAttributes(out, vnode.attributes, props);
        isSvgMode = prevSvgMode;
        return out;
    }
    function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
        var j, c, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren ? vchildren.length : 0;
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
            if (child && child !== dom) if (i >= len) dom.appendChild(child); else if (child !== originalChildren[i]) if (child === originalChildren[i + 1]) removeNode(originalChildren[i]); else dom.insertBefore(child, originalChildren[i] || null);
        }
        if (keyedLen) for (var i in keyed) if (void 0 !== keyed[i]) recollectNodeTree(keyed[i], !1);
        while (min <= childrenLen) if (void 0 !== (child = children[childrenLen--])) recollectNodeTree(child, !1);
    }
    function recollectNodeTree(node, unmountOnly) {
        var component = node._component;
        if (component) unmountComponent(component); else {
            if (null != node.__preactattr_ && node.__preactattr_.ref) node.__preactattr_.ref(null);
            if (unmountOnly === !1 || null == node.__preactattr_) removeNode(node);
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
            if (0 !== opts) if (1 === opts || options.syncComponentUpdates !== !1 || !component.base) renderComponent(component, 1, mountAll); else enqueueRender(component);
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
                if (2 !== opts && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === !1) skip = !0; else if (component.componentWillUpdate) component.componentWillUpdate(props, state, context);
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
                flushMounts();
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

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWVzc2FnaW5nLmpzIiwibmV3dGFiL2J1dHRvbi5qcyIsIm5ld3RhYi9jb250ZW50LmpzIiwibmV3dGFiL2ljb25zLmpzb24iLCJuZXd0YWIvbWVudS5qcyIsIm5ld3RhYi9tZXNzYWdpbmcuanMiLCJuZXd0YWIvbmV3dGFiLmpzIiwibmV3dGFiL3NlYXJjaC1pbnB1dC5qcyIsIm5ld3RhYi9zZWFyY2guanMiLCJuZXd0YWIvd2FsbHBhcGVyLmpzIiwibmV3dGFiL3dhbGxwYXBlcnMuanNvbiIsIm5vZGVfbW9kdWxlcy9kZWJvdW5jZS1mbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUEsSUFBSSxpQkFBaUIsQ0FBckI7O0FBRU8sSUFBTSxzREFBdUIsQ0FBN0I7O0lBRWMsUztBQUNuQix1QkFBYztBQUFBOztBQUNaLFNBQUssaUJBQUw7QUFDQSxTQUFLLE9BQUwsR0FBZSxFQUFmO0FBQ0Q7Ozs7Z0NBRXdDO0FBQUEsVUFBakMsRUFBaUMsUUFBakMsRUFBaUM7QUFBQSxVQUE3QixPQUE2QixRQUE3QixPQUE2QjtBQUFBLFVBQXBCLEtBQW9CLFFBQXBCLEtBQW9CO0FBQUEsVUFBYixFQUFhLFFBQWIsRUFBYTtBQUFBLFVBQVQsS0FBUyxRQUFULEtBQVM7O0FBQ3ZDLFdBQUssS0FBSyxVQUFMLEVBQUw7O0FBRUEsYUFBTztBQUNMLGNBQU0sS0FBSyxJQUROO0FBRUwsWUFBSSxNQUFNLEtBQUssTUFGVjtBQUdMLGVBQU8sUUFBUSxLQUFSLElBQWlCLEtBSG5CO0FBSUwsY0FKSyxFQUlELGdCQUpDLEVBSVE7QUFKUixPQUFQO0FBTUQ7OztpQ0FFWTtBQUNYLGFBQVEsS0FBSyxHQUFMLEtBQWEsSUFBZCxHQUF1QixFQUFFLGNBQWhDO0FBQ0Q7Ozs4QkFFUyxHLEVBQUs7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IG1lc3NhZ2VDb3VudGVyID0gMFxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9USU1FT1VUX1NFQ1MgPSA1XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2luZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubGlzdGVuRm9yTWVzc2FnZXMoKVxuICAgIHRoaXMud2FpdGluZyA9IHt9XG4gIH1cblxuICBkcmFmdCh7IGlkLCBjb250ZW50LCBlcnJvciwgdG8sIHJlcGx5IH0pIHtcbiAgICBpZCA9IHRoaXMuZ2VuZXJhdGVJZCgpXG5cbiAgICByZXR1cm4ge1xuICAgICAgZnJvbTogdGhpcy5uYW1lLFxuICAgICAgdG86IHRvIHx8IHRoaXMudGFyZ2V0LFxuICAgICAgZXJyb3I6IGNvbnRlbnQuZXJyb3IgfHwgZXJyb3IsXG4gICAgICBpZCwgY29udGVudCwgcmVwbHlcbiAgICB9XG4gIH1cblxuICBnZW5lcmF0ZUlkKCkge1xuICAgIHJldHVybiAoRGF0ZS5ub3coKSAqIDEwMDApICsgKCsrbWVzc2FnZUNvdW50ZXIpXG4gIH1cblxuICBvblJlY2VpdmUobXNnKSB7XG4gICAgaWYgKG1zZy50byAhPT0gdGhpcy5uYW1lKSByZXR1cm4gdHJ1ZVxuXG4gICAgaWYgKG1zZy5yZXBseSAmJiB0aGlzLndhaXRpbmdbbXNnLnJlcGx5XSkge1xuICAgICAgdGhpcy53YWl0aW5nW21zZy5yZXBseV0obXNnKVxuICAgIH1cblxuICAgIGlmIChtc2cucmVwbHkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG1zZy5jb250ZW50LnBpbmcpIHtcbiAgICAgIHRoaXMucmVwbHkobXNnLCB7IHBvbmc6IHRydWUgfSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgcGluZyhjYWxsYmFjaykge1xuICAgIHRoaXMuc2VuZCh7IHBpbmc6IHRydWUgfSwgY2FsbGJhY2spXG4gIH1cblxuICByZXBseShtc2csIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuY29udGVudCkge1xuICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgY29udGVudDogb3B0aW9uc1xuICAgICAgfVxuICAgIH1cblxuICAgIG9wdGlvbnMucmVwbHkgPSBtc2cuaWRcbiAgICBvcHRpb25zLnRvID0gbXNnLmZyb21cblxuICAgIHRoaXMuc2VuZChvcHRpb25zKVxuICB9XG5cbiAgc2VuZChvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG1zZyA9IHRoaXMuZHJhZnQob3B0aW9ucy5jb250ZW50ID8gb3B0aW9ucyA6IHsgY29udGVudDogb3B0aW9ucyB9KVxuXG4gICAgdGhpcy5zZW5kTWVzc2FnZShtc2cpXG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMud2FpdFJlcGx5Rm9yKG1zZy5pZCwgREVGQVVMVF9USU1FT1VUX1NFQ1MsIGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIHdhaXRSZXBseUZvcihtc2dJZCwgdGltZW91dFNlY3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXNcbiAgICBsZXQgdGltZW91dCA9IHVuZGVmaW5lZFxuXG4gICAgaWYgKHRpbWVvdXRTZWNzID4gMCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQob25UaW1lb3V0LCB0aW1lb3V0U2VjcyAqIDEwMDApXG4gICAgfVxuXG4gICAgdGhpcy53YWl0aW5nW21zZ0lkXSA9IG1zZyA9PiB7XG4gICAgICBkb25lKClcbiAgICAgIGNhbGxiYWNrKG1zZylcbiAgICB9XG5cbiAgICByZXR1cm4gZG9uZVxuXG4gICAgZnVuY3Rpb24gZG9uZSAoKSB7XG4gICAgICBpZiAodGltZW91dCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgICB9XG5cbiAgICAgIHRpbWVvdXQgPSB1bmRlZmluZWRcbiAgICAgIGRlbGV0ZSBzZWxmLndhaXRpbmdbbXNnSWRdXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25UaW1lb3V0ICgpIHtcbiAgICAgIGRvbmUoKVxuICAgICAgY2FsbGJhY2soeyBlcnJvcjogJ01lc3NhZ2UgcmVzcG9uc2UgdGltZW91dCAoJyArIHRpbWVvdXRTZWNzICsnKXMuJyB9KVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgaWNvbnMgZnJvbSAnLi9pY29ucydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YGJ1dHRvbiAke3RoaXMucHJvcHMuY2xhc3NOYW1lIHx8IHRoaXMucHJvcHMuaWNvbn0tYnV0dG9uIHdpdGgtJHt0aGlzLnByb3BzLmljb259LWljb25gfSBvbmNsaWNrPXsoKSA9PiB0aGlzLm9uQ2xpY2soKX0gb25Nb3VzZU92ZXI9e3RoaXMucHJvcHMub25Nb3VzZU92ZXJ9IG9uTW91c2VPdXQ9e3RoaXMucHJvcHMub25Nb3VzZU91dH0+XG4gICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiaWNvblwiIHNyYz17dGhpcy5zcmMoKX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIG9uQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMucHJvcHMub25DbGljaykgdGhpcy5wcm9wcy5vbkNsaWNrKClcbiAgfVxuXG4gIHNyYygpIHtcbiAgICByZXR1cm4gaWNvbnNbdGhpcy5wcm9wcy5pY29uXVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBiZyA9IHRoaXMucHJvcHMud2FsbHBhcGVyID8ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7dGhpcy5wcm9wcy53YWxscGFwZXIudXJscy50aHVtYn0pYFxuICAgIH0gOiBudWxsXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50LXdyYXBwZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZ1wiIHN0eWxlPXtiZ30+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2VudGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50XCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJ3aGl0ZVwiOiB7XG4gICAgXCJzZWFyY2hcIjogXCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmODtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaWFYTnZMVGc0TlRrdE1TSS9QZ284SVMwdElFZGxibVZ5WVhSdmNqb2dRV1J2WW1VZ1NXeHNkWE4wY21GMGIzSWdNVGt1TUM0d0xDQlRWa2NnUlhod2IzSjBJRkJzZFdjdFNXNGdMaUJUVmtjZ1ZtVnljMmx2YmpvZ05pNHdNQ0JDZFdsc1pDQXdLU0FnTFMwK0NqeHpkbWNnZUcxc2JuTTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5JaUI0Yld4dWN6cDRiR2x1YXowaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1UazVPUzk0YkdsdWF5SWdkbVZ5YzJsdmJqMGlNUzR4SWlCcFpEMGlRMkZ3WVY4eElpQjRQU0l3Y0hnaUlIazlJakJ3ZUNJZ2RtbGxkMEp2ZUQwaU1DQXdJRFUyTGprMk5pQTFOaTQ1TmpZaUlITjBlV3hsUFNKbGJtRmliR1V0WW1GamEyZHliM1Z1WkRwdVpYY2dNQ0F3SURVMkxqazJOaUExTmk0NU5qWTdJaUI0Yld3NmMzQmhZMlU5SW5CeVpYTmxjblpsSWlCM2FXUjBhRDBpTWpSd2VDSWdhR1ZwWjJoMFBTSXlOSEI0SWo0S1BIQmhkR2dnWkQwaVRUVTFMakUwTml3MU1TNDRPRGRNTkRFdU5UZzRMRE0zTGpjNE5tTXpMalE0TmkwMExqRTBOQ3cxTGpNNU5pMDVMak0xT0N3MUxqTTVOaTB4TkM0M09EWmpNQzB4TWk0Mk9ESXRNVEF1TXpFNExUSXpMVEl6TFRJemN5MHlNeXd4TUM0ek1UZ3RNak1zTWpNZ0lITXhNQzR6TVRnc01qTXNNak1zTWpOak5DNDNOakVzTUN3NUxqSTVPQzB4TGpRek5pd3hNeTR4TnpjdE5DNHhOakpzTVRNdU5qWXhMREUwTGpJd09HTXdMalUzTVN3d0xqVTVNeXd4TGpNek9Td3dMamt5TERJdU1UWXlMREF1T1RJZ0lHTXdMamMzT1N3d0xERXVOVEU0TFRBdU1qazNMREl1TURjNUxUQXVPRE0zUXpVMkxqSTFOU3cxTkM0NU9ESXNOVFl1TWprekxEVXpMakE0TERVMUxqRTBOaXcxTVM0NE9EZDZJRTB5TXk0NU9EUXNObU01TGpNM05Dd3dMREUzTERjdU5qSTJMREUzTERFM2N5MDNMall5Tml3eE55MHhOeXd4TnlBZ2N5MHhOeTAzTGpZeU5pMHhOeTB4TjFNeE5DNDJNU3cyTERJekxqazROQ3cyZWlJZ1ptbHNiRDBpSTBaR1JrWkdSaUl2UGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOEwzTjJaejRLXCIsXG4gICAgXCJoZWFydFwiOiBcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4O2Jhc2U2NCxQRDk0Yld3Z2RtVnljMmx2YmowaU1TNHdJaUJsYm1OdlpHbHVaejBpYVhOdkxUZzROVGt0TVNJL1BnbzhJUzB0SUVkbGJtVnlZWFJ2Y2pvZ1FXUnZZbVVnU1d4c2RYTjBjbUYwYjNJZ01UWXVNQzR3TENCVFZrY2dSWGh3YjNKMElGQnNkV2N0U1c0Z0xpQlRWa2NnVm1WeWMybHZiam9nTmk0d01DQkNkV2xzWkNBd0tTQWdMUzArQ2p3aFJFOURWRmxRUlNCemRtY2dVRlZDVEVsRElDSXRMeTlYTTBNdkwwUlVSQ0JUVmtjZ01TNHhMeTlGVGlJZ0ltaDBkSEE2THk5M2QzY3Vkek11YjNKbkwwZHlZWEJvYVdOekwxTldSeTh4TGpFdlJGUkVMM04yWnpFeExtUjBaQ0krQ2p4emRtY2dlRzFzYm5NOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6SXdNREF2YzNabklpQjRiV3h1Y3pwNGJHbHVhejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TVRrNU9TOTRiR2x1YXlJZ2RtVnljMmx2YmowaU1TNHhJaUJwWkQwaVEyRndZVjh4SWlCNFBTSXdjSGdpSUhrOUlqQndlQ0lnZDJsa2RHZzlJakkwY0hnaUlHaGxhV2RvZEQwaU1qUndlQ0lnZG1sbGQwSnZlRDBpTUNBd0lEVXhNQ0ExTVRBaUlITjBlV3hsUFNKbGJtRmliR1V0WW1GamEyZHliM1Z1WkRwdVpYY2dNQ0F3SURVeE1DQTFNVEE3SWlCNGJXdzZjM0JoWTJVOUluQnlaWE5sY25abElqNEtQR2MrQ2drOFp5QnBaRDBpWm1GMmIzSnBkR1VpUGdvSkNUeHdZWFJvSUdROUlrMHlOVFVzTkRnNUxqWnNMVE0xTGpjdE16VXVOME00Tmk0M0xETXpOaTQyTERBc01qVTNMalUxTERBc01UWXdMalkxUXpBc09ERXVOaXcyTVM0eUxESXdMalFzTVRRd0xqSTFMREl3TGpSak5ETXVNelVzTUN3NE5pNDNMREl3TGpRc01URTBMamMxTERVekxqVTFJQ0FnSUVNeU9ETXVNRFVzTkRBdU9Dd3pNall1TkN3eU1DNDBMRE0yT1M0M05Td3lNQzQwUXpRME9DNDRMREl3TGpRc05URXdMRGd4TGpZc05URXdMREUyTUM0Mk5XTXdMRGsyTGprdE9EWXVOeXd4TnpVdU9UVXRNakU1TGpNc01qa3pMakkxVERJMU5TdzBPRGt1Tm5vaUlHWnBiR3c5SWlOR1JrWkdSa1lpTHo0S0NUd3ZaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhMM04yWno0S1wiLFxuICAgIFwicGFnZVwiOiBcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4O2Jhc2U2NCxQRDk0Yld3Z2RtVnljMmx2YmowaU1TNHdJaUJsYm1OdlpHbHVaejBpYVhOdkxUZzROVGt0TVNJL1BnbzhJUzB0SUVkbGJtVnlZWFJ2Y2pvZ1FXUnZZbVVnU1d4c2RYTjBjbUYwYjNJZ01UWXVNQzR3TENCVFZrY2dSWGh3YjNKMElGQnNkV2N0U1c0Z0xpQlRWa2NnVm1WeWMybHZiam9nTmk0d01DQkNkV2xzWkNBd0tTQWdMUzArQ2p3aFJFOURWRmxRUlNCemRtY2dVRlZDVEVsRElDSXRMeTlYTTBNdkwwUlVSQ0JUVmtjZ01TNHhMeTlGVGlJZ0ltaDBkSEE2THk5M2QzY3Vkek11YjNKbkwwZHlZWEJvYVdOekwxTldSeTh4TGpFdlJGUkVMM04yWnpFeExtUjBaQ0krQ2p4emRtY2dlRzFzYm5NOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6SXdNREF2YzNabklpQjRiV3h1Y3pwNGJHbHVhejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TVRrNU9TOTRiR2x1YXlJZ2RtVnljMmx2YmowaU1TNHhJaUJwWkQwaVEyRndZVjh4SWlCNFBTSXdjSGdpSUhrOUlqQndlQ0lnZDJsa2RHZzlJakkwY0hnaUlHaGxhV2RvZEQwaU1qUndlQ0lnZG1sbGQwSnZlRDBpTUNBd0lEUXpPQzQxTXpNZ05ETTRMalV6TXlJZ2MzUjViR1U5SW1WdVlXSnNaUzFpWVdOclozSnZkVzVrT201bGR5QXdJREFnTkRNNExqVXpNeUEwTXpndU5UTXpPeUlnZUcxc09uTndZV05sUFNKd2NtVnpaWEoyWlNJK0NqeG5QZ29KUEhCaGRHZ2daRDBpVFRNNU5pNHlPRE1zTVRNd0xqRTRPR010TXk0NE1EWXRPUzR4TXpVdE9DNHpOekV0TVRZdU16WTFMVEV6TGpjd015MHlNUzQyT1RWc0xUZzVMakEzT0MwNE9TNHdPREZqTFRVdU16TXlMVFV1TXpJMUxURXlMalUyTFRrdU9EazFMVEl4TGpZNU55MHhNeTQzTURRZ0lDQkRNall5TGpZM01pd3hMamt3TXl3eU5UUXVNamszTERBc01qUTJMalk0Tnl3d1NEWXpMamsxTTBNMU5pNHpOREVzTUN3ME9TNDROamtzTWk0Mk5qTXNORFF1TlRRc055NDVPVE5qTFRVdU16TXNOUzR6TWpjdE55NDVPVFFzTVRFdU56azVMVGN1T1RrMExERTVMalF4TkhZek9ETXVOekU1SUNBZ1l6QXNOeTQyTVRjc01pNDJOalFzTVRRdU1EZzVMRGN1T1RrMExERTVMalF4TjJNMUxqTXpMRFV1TXpJMUxERXhMamd3TVN3M0xqazVNU3d4T1M0ME1UUXNOeTQ1T1RGb016RXdMall6TTJNM0xqWXhNU3d3TERFMExqQTNPUzB5TGpZMk5pd3hPUzQwTURjdE55NDVPVEVnSUNCak5TNHpNamd0TlM0ek16SXNOeTQ1T1RRdE1URXVPQ3czTGprNU5DMHhPUzQwTVRkV01UVTFMak14TTBNME1ERXVPVGt4TERFME55NDJPVGtzTkRBd0xqQTRPQ3d4TXprdU16SXpMRE01Tmk0eU9ETXNNVE13TGpFNE9Ib2dUVEkxTlM0NE1UWXNNemd1T0RJMklDQWdZelV1TlRFM0xERXVPVEF6TERrdU5ERTRMRE11T1RrNUxERXhMamN3TkN3MkxqSTRiRGc1TGpNMk5pdzRPUzR6Tmpaak1pNHlOemtzTWk0eU9EWXNOQzR6TnpRc05pNHhPRFlzTmk0eU56WXNNVEV1TnpBMlNESTFOUzQ0TVRaV016Z3VPREkyZWlCTk16WTFMalEwT1N3ME1ERXVPVGt4SUNBZ1NEY3pMakE0T1ZZek5pNDFORFZvTVRRMkxqRTNPSFl4TVRndU56Y3hZekFzTnk0Mk1UUXNNaTQyTmpJc01UUXVNRGcwTERjdU9Ua3lMREU1TGpReE5HTTFMak16TWl3MUxqTXlOeXd4TVM0NExEY3VPVGswTERFNUxqUXhOeXczTGprNU5HZ3hNVGd1TnpjelZqUXdNUzQ1T1RGNklpQm1hV3hzUFNJalJrWkdSa1pHSWk4K0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEM5emRtYytDZz09XCJcbiAgfSxcbiAgXCJibGFja1wiOiB7XG4gICAgXCJzZWFyY2hcIjogXCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmODtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaWFYTnZMVGc0TlRrdE1TSS9QZ284SVMwdElFZGxibVZ5WVhSdmNqb2dRV1J2WW1VZ1NXeHNkWE4wY21GMGIzSWdNVGd1TVM0eExDQlRWa2NnUlhod2IzSjBJRkJzZFdjdFNXNGdMaUJUVmtjZ1ZtVnljMmx2YmpvZ05pNHdNQ0JDZFdsc1pDQXdLU0FnTFMwK0NqeHpkbWNnZUcxc2JuTTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5JaUI0Yld4dWN6cDRiR2x1YXowaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1UazVPUzk0YkdsdWF5SWdkbVZ5YzJsdmJqMGlNUzR4SWlCcFpEMGlRMkZ3WVY4eElpQjRQU0l3Y0hnaUlIazlJakJ3ZUNJZ2RtbGxkMEp2ZUQwaU1DQXdJREkxTUM0ek1UTWdNalV3TGpNeE15SWdjM1I1YkdVOUltVnVZV0pzWlMxaVlXTnJaM0p2ZFc1a09tNWxkeUF3SURBZ01qVXdMak14TXlBeU5UQXVNekV6T3lJZ2VHMXNPbk53WVdObFBTSndjbVZ6WlhKMlpTSWdkMmxrZEdnOUlqSTBjSGdpSUdobGFXZG9kRDBpTWpSd2VDSStDanhuSUdsa1BTSlRaV0Z5WTJnaVBnb0pQSEJoZEdnZ2MzUjViR1U5SW1acGJHd3RjblZzWlRwbGRtVnViMlJrTzJOc2FYQXRjblZzWlRwbGRtVnViMlJrT3lJZ1pEMGlUVEkwTkM0eE9EWXNNakUwTGpZd05Hd3ROVFF1TXpjNUxUVTBMak0zT0dNdE1DNHlPRGt0TUM0eU9Ea3RNQzQyTWpndE1DNDBPVEV0TUM0NU15MHdMamMySUNBZ1l6RXdMamN0TVRZdU1qTXhMREUyTGprME5TMHpOUzQyTml3eE5pNDVORFV0TlRZdU5UVTBRekl3TlM0NE1qSXNORFl1TURjMUxERTFPUzQzTkRjc01Dd3hNREl1T1RFeExEQlRNQ3cwTmk0d056VXNNQ3d4TURJdU9URXhJQ0FnWXpBc05UWXVPRE0xTERRMkxqQTNOQ3d4TURJdU9URXhMREV3TWk0NU1Td3hNREl1T1RFeFl6SXdMamc1TlN3d0xEUXdMak15TXkwMkxqSTBOU3cxTmk0MU5UUXRNVFl1T1RRMVl6QXVNalk1TERBdU16QXhMREF1TkRjc01DNDJOQ3d3TGpjMU9Td3dMamt5T1d3MU5DNHpPQ3cxTkM0ek9DQWdJR000TGpFMk9TdzRMakUyT0N3eU1TNDBNVE1zT0M0eE5qZ3NNamt1TlRnekxEQkRNalV5TGpNMU5Dd3lNell1TURFM0xESTFNaTR6TlRRc01qSXlMamMzTXl3eU5EUXVNVGcyTERJeE5DNDJNRFI2SUUweE1ESXVPVEV4TERFM01DNHhORFlnSUNCakxUTTNMakV6TkN3d0xUWTNMakl6Tmkwek1DNHhNREl0TmpjdU1qTTJMVFkzTGpJek5XTXdMVE0zTGpFek5Dd3pNQzR4TURNdE5qY3VNak0yTERZM0xqSXpOaTAyTnk0eU16WmpNemN1TVRNeUxEQXNOamN1TWpNMUxETXdMakV3TXl3Mk55NHlNelVzTmpjdU1qTTJJQ0FnUXpFM01DNHhORFlzTVRRd0xqQTBOQ3d4TkRBdU1EUXpMREUzTUM0eE5EWXNNVEF5TGpreE1Td3hOekF1TVRRMmVpSWdabWxzYkQwaUl6QXdNREF3TUNJdlBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p4blBnbzhMMmMrQ2p3dmMzWm5QZ289XCIsXG4gICAgXCJwYWdlXCI6IFwiZGF0YTppbWFnZS9zdmcreG1sO3V0Zjg7YmFzZTY0LFBEOTRiV3dnZG1WeWMybHZiajBpTVM0d0lpQmxibU52WkdsdVp6MGlhWE52TFRnNE5Ua3RNU0kvUGdvOElTMHRJRWRsYm1WeVlYUnZjam9nUVdSdlltVWdTV3hzZFhOMGNtRjBiM0lnTVRZdU1DNHdMQ0JUVmtjZ1JYaHdiM0owSUZCc2RXY3RTVzRnTGlCVFZrY2dWbVZ5YzJsdmJqb2dOaTR3TUNCQ2RXbHNaQ0F3S1NBZ0xTMCtDandoUkU5RFZGbFFSU0J6ZG1jZ1VGVkNURWxESUNJdEx5OVhNME12TDBSVVJDQlRWa2NnTVM0eEx5OUZUaUlnSW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTDBkeVlYQm9hV056TDFOV1J5OHhMakV2UkZSRUwzTjJaekV4TG1SMFpDSStDanh6ZG1jZ2VHMXNibk05SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSWlCNGJXeHVjenA0YkdsdWF6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNVGs1T1M5NGJHbHVheUlnZG1WeWMybHZiajBpTVM0eElpQnBaRDBpUTJGd1lWOHhJaUI0UFNJd2NIZ2lJSGs5SWpCd2VDSWdkMmxrZEdnOUlqSTBjSGdpSUdobGFXZG9kRDBpTWpSd2VDSWdkbWxsZDBKdmVEMGlNQ0F3SURRek9DNDFNek1nTkRNNExqVXpNeUlnYzNSNWJHVTlJbVZ1WVdKc1pTMWlZV05yWjNKdmRXNWtPbTVsZHlBd0lEQWdORE00TGpVek15QTBNemd1TlRNek95SWdlRzFzT25Od1lXTmxQU0p3Y21WelpYSjJaU0krQ2p4blBnb0pQSEJoZEdnZ1pEMGlUVE01Tmk0eU9ETXNNVE13TGpFNE9HTXRNeTQ0TURZdE9TNHhNelV0T0M0ek56RXRNVFl1TXpZMUxURXpMamN3TXkweU1TNDJPVFZzTFRnNUxqQTNPQzA0T1M0d09ERmpMVFV1TXpNeUxUVXVNekkxTFRFeUxqVTJMVGt1T0RrMUxUSXhMalk1TnkweE15NDNNRFFnSUNCRE1qWXlMalkzTWl3eExqa3dNeXd5TlRRdU1qazNMREFzTWpRMkxqWTROeXd3U0RZekxqazFNME0xTmk0ek5ERXNNQ3cwT1M0NE5qa3NNaTQyTmpNc05EUXVOVFFzTnk0NU9UTmpMVFV1TXpNc05TNHpNamN0Tnk0NU9UUXNNVEV1TnprNUxUY3VPVGswTERFNUxqUXhOSFl6T0RNdU56RTVJQ0FnWXpBc055NDJNVGNzTWk0Mk5qUXNNVFF1TURnNUxEY3VPVGswTERFNUxqUXhOMk0xTGpNekxEVXVNekkxTERFeExqZ3dNU3czTGprNU1Td3hPUzQwTVRRc055NDVPVEZvTXpFd0xqWXpNMk0zTGpZeE1Td3dMREUwTGpBM09TMHlMalkyTml3eE9TNDBNRGN0Tnk0NU9URWdJQ0JqTlM0ek1qZ3ROUzR6TXpJc055NDVPVFF0TVRFdU9DdzNMams1TkMweE9TNDBNVGRXTVRVMUxqTXhNME0wTURFdU9Ua3hMREUwTnk0Mk9Ua3NOREF3TGpBNE9Dd3hNemt1TXpJekxETTVOaTR5T0RNc01UTXdMakU0T0hvZ1RUSTFOUzQ0TVRZc016Z3VPREkySUNBZ1l6VXVOVEUzTERFdU9UQXpMRGt1TkRFNExETXVPVGs1TERFeExqY3dOQ3cyTGpJNGJEZzVMak0yTml3NE9TNHpOalpqTWk0eU56a3NNaTR5T0RZc05DNHpOelFzTmk0eE9EWXNOaTR5TnpZc01URXVOekEyU0RJMU5TNDRNVFpXTXpndU9ESTJlaUJOTXpZMUxqUTBPU3cwTURFdU9Ua3hJQ0FnU0RjekxqQTRPVll6Tmk0MU5EVm9NVFEyTGpFM09IWXhNVGd1TnpjeFl6QXNOeTQyTVRRc01pNDJOaklzTVRRdU1EZzBMRGN1T1RreUxERTVMalF4TkdNMUxqTXpNaXcxTGpNeU55d3hNUzQ0TERjdU9UazBMREU1TGpReE55dzNMams1TkdneE1UZ3VOemN6VmpRd01TNDVPVEY2SWlCbWFXeHNQU0lqTURBd01EQXdJaTgrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQR2MrQ2p3dlp6NEtQQzl6ZG1jK0NnPT1cIlxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi9idXR0b24nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbnUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzZXRUaXRsZSh0aXRsZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyB0aXRsZSB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICAgIHt0aGlzLnN0YXRlLnRpdGxlIHx8IFwiXCJ9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwiYnV0dG9uc1wiPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgaWNvbj1cImNhbGVuZGFyXCJcbiAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0VGl0bGUoJ1JlY2VudGx5IFZpc2l0ZWQnKX1cbiAgICAgICAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy5zZXRUaXRsZSgpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5SZWNlbnQoKX0gLz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgaWNvbj1cImhlYXJ0XCJcbiAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0VGl0bGUoJ0Jvb2ttYXJrcycpfVxuICAgICAgICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLnNldFRpdGxlKCl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub3BlbkJvb2ttYXJrcygpfSAvPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgaWNvbj1cImZpcmVcIlxuICAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0VGl0bGUoJ01vc3QgVmlzaXRlZCcpfVxuICAgICAgICAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy5zZXRUaXRsZSgpfVxuICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vcGVuVG9wKCl9IC8+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IE1lc3NhZ2luZyBmcm9tICcuLi9saWIvbWVzc2FnaW5nJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGcm9tTmV3VGFiVG9CYWNrZ3JvdW5kIGV4dGVuZHMgTWVzc2FnaW5nIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubmFtZSA9ICdrb3ptb3M6bmV3dGFiJ1xuICAgIHRoaXMudGFyZ2V0ID0gJ2tvem1vczpiYWNrZ3JvdW5kJ1xuICB9XG5cbiAgbGlzdGVuRm9yTWVzc2FnZXMoKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKG1zZyA9PiB0aGlzLm9uUmVjZWl2ZShtc2cpKVxuICB9XG5cbiAgc2VuZE1lc3NhZ2UgKG1zZywgY2FsbGJhY2spIHtcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtc2csIGNhbGxiYWNrKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQsIHJlbmRlciB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IFdhbGxwYXBlciBmcm9tICcuL3dhbGxwYXBlcidcbmltcG9ydCBNZW51IGZyb20gXCIuL21lbnVcIlxuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi9idXR0b25cIlxuaW1wb3J0IHdhbGxwYXBlcnMgZnJvbSAnLi93YWxscGFwZXJzJ1xuaW1wb3J0IFNlYXJjaCBmcm9tICcuL3NlYXJjaCdcbmltcG9ydCBpY29ucyBmcm9tIFwiLi9pY29uc1wiXG5cbmNsYXNzIE5ld1RhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHdhbGxwYXBlcjogbnVsbFxuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgbmV3dGFiYH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2VudGVyXCI+XG4gICAgICAgICAgPFNlYXJjaCAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgeyB0aGlzLnN0YXRlLndhbGxwYXBlciA/IDxXYWxscGFwZXIgey4uLnRoaXMuc3RhdGUud2FsbHBhcGVyfSAvPiA6IG51bGwgfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbnJlbmRlcig8TmV3VGFiIC8+LCBkb2N1bWVudC5ib2R5KVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgaWNvbnMgZnJvbSAnLi9pY29ucydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoSW5wdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5pbnB1dCkgdGhpcy5pbnB1dC5mb2N1cygpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VhcmNoLWlucHV0XCI+XG4gICAgICAgIHt0aGlzLnJlbmRlckljb24oKX1cbiAgICAgICAge3RoaXMucmVuZGVySW5wdXQoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckljb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxpbWcgY2xhc3NOYW1lPVwiaWNvblwiIHNyYz17aWNvbnMuYmxhY2suc2VhcmNofSAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlcklucHV0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8aW5wdXQgcmVmPXtlbCA9PiB0aGlzLmlucHV0ID0gZWx9XG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXRcIlxuICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCB5b3VyIGhpc3RvcnkgYW5kIGJvb2ttYXJrc1wiXG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMucHJvcHMub25RdWVyeUNoYW5nZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgIG9uS2V5VXA9e2UgPT4gdGhpcy5wcm9wcy5vblF1ZXJ5Q2hhbmdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMucXVlcnl9IC8+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBDb250ZW50IGZyb20gXCIuL2NvbnRlbnRcIlxuaW1wb3J0IE1lc3NhZ2luZyBmcm9tIFwiLi9tZXNzYWdpbmdcIlxuaW1wb3J0IFNlYXJjaElucHV0IGZyb20gXCIuL3NlYXJjaC1pbnB1dFwiXG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImRlYm91bmNlLWZuXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1lc3NhZ2luZygpXG4gICAgdGhpcy5zZWFyY2hCb29rbWFya3MgPSBkZWJvdW5jZSh0aGlzLl9zZWFyY2hCb29rbWFya3MuYmluZCh0aGlzKSwgNjAwKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBxdWVyeTogJycsXG4gICAgICBsaWtlczogW10sXG4gICAgICB0b3BTaXRlczogW11cbiAgICB9KVxuXG4gICAgY2hyb21lLnRvcFNpdGVzLmdldCh0b3BTaXRlcyA9PiB0aGlzLnNldFN0YXRlKHsgdG9wU2l0ZXM6IHRvcFNpdGVzLnNsaWNlKDAsIDUpIH0pKVxuICAgIHRoaXMuZ2V0UmVjZW50Qm9va21hcmtzKChlcnIsIGxpa2VzKSA9PiB0aGlzLnNldFN0YXRlKHsgbGlrZXMgfSkpXG4gIH1cblxuICBnZXRSZWNlbnRCb29rbWFya3MoY2FsbGJhY2spIHtcbiAgICB0aGlzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LXJlY2VudC1ib29rbWFya3MnIH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IocmVzcC5lcnJvcikpXG4gICAgICBjYWxsYmFjayh1bmRlZmluZWQsIHJlc3AubWVkaWEuY29uY2F0KHJlc3Aubm9uX21lZGlhKS5zb3J0KHNvcnRMaWtlcykuc2xpY2UoMCwgNSkpXG4gICAgfSlcbiAgfVxuXG4gIF9zZWFyY2hCb29rbWFya3MocXVlcnksIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ3NlYXJjaC1ib29rbWFya3MnLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmNvbnRlbnQucXVlcnkgIT09IHRoaXMuc3RhdGUucXVlcnkpIHJldHVyblxuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IocmVzcC5lcnJvcikpXG4gICAgICBjYWxsYmFjayh1bmRlZmluZWQsIHJlc3AuY29udGVudClcbiAgICB9KVxuICB9XG5cbiAgb25RdWVyeUNoYW5nZShxdWVyeSkge1xuICAgIGlmIChxdWVyeSA9PT0gdGhpcy5zdGF0ZS5xdWVyeSkgcmV0dXJuXG5cbiAgICBpZiAocXVlcnkubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxpa2VzOiBbXSxcbiAgICAgICAgcXVlcnk6IFwiXCJcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHF1ZXJ5ID09PSB0aGlzLnN0YXRlLnF1ZXJ5LnRyaW0oKSkgcmV0dXJuXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBsaWtlczogW10sXG4gICAgICBoaXN0b3J5OiBbXSxcbiAgICAgIHF1ZXJ5XG4gICAgfSlcblxuICAgIHRoaXMuc2VhcmNoQm9va21hcmtzKHF1ZXJ5LnRyaW0oKSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBlcnJvciB9KVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbGlrZXM6IHJlc3VsdC5tZWRpYS5jb25jYXQocmVzdWx0Lm5vbl9tZWRpYSkuc29ydChzb3J0TGlrZXMpLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgY2hyb21lLmhpc3Rvcnkuc2VhcmNoKHsgdGV4dDogcXVlcnkudHJpbSgpIH0sIGhpc3RvcnkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGhpc3RvcnlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENvbnRlbnQgd2FsbHBhcGVyPXt0aGlzLnByb3BzLndhbGxwYXBlcn0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9va21hcmtzXCI+XG4gICAgICAgICAgPFNlYXJjaElucHV0IHF1ZXJ5PXt0aGlzLnN0YXRlLnF1ZXJ5fSBvblF1ZXJ5Q2hhbmdlPXtxdWVyeSA9PiB0aGlzLm9uUXVlcnlDaGFuZ2UocXVlcnkpfSAvPlxuICAgICAgICAgIHt0aGlzLnJlbmRlclRvcFNpdGVzKCl9XG4gICAgICAgICAge3RoaXMucmVuZGVySGlzdG9yeSgpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlckxpa2VzKCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyTG9hZGluZygpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlck5vUmVzdWx0cygpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvQ29udGVudD5cbiAgICApXG4gIH1cblxuICByZW5kZXJUb3BTaXRlcygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5xdWVyeSkgcmV0dXJuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b3Atc2l0ZXMgdXJsc1wiPlxuICAgICAgICB7dGhpcy5zdGF0ZS50b3BTaXRlcy5tYXAoc2l0ZSA9PiA8VVJMSWNvbiB7Li4uc2l0ZX0gLz4pfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJIaXN0b3J5KCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5oaXN0b3J5IHx8IHRoaXMuc3RhdGUuaGlzdG9yeS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGlzdG9yeSB1cmxzXCI+XG4gICAgICAgIHt0aGlzLnN0YXRlLmhpc3Rvcnkuc2xpY2UoMCwgNSkubWFwKHVybCA9PiA8VVJMSWNvbiB7Li4udXJsfSAvPil9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckxpa2VzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlYXJjaC1saWtlcyB1cmxzXCI+XG4gICAgICAgIHt0aGlzLnN0YXRlLmxpa2VzLmxlbmd0aCA+IDEwID8gdGhpcy5yZW5kZXJNb3JlUmVzdWx0c0xpbmsoKSA6IG51bGx9XG4gICAgICAgIHt0aGlzLnN0YXRlLmxpa2VzLnNsaWNlKDAsIDUpLm1hcChsaWtlID0+IDxVUkxJY29uIHsuLi5saWtlfSAvPil9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck1vcmVSZXN1bHRzTGluaygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGEgY2xhc3NOYW1lPVwibW9yZS1yZXN1bHRzLWJ1dHRvblwiIGhyZWY9e2BodHRwczovL2dldGtvem1vcy5jb20vc2VhcmNoP3F1ZXJ5PSR7dGhpcy5zdGF0ZS5xdWVyeX1gfT5cbiAgICAgICAgU2VlIE1vcmUgUmVzdWx0c1xuICAgICAgPC9hPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckxvYWRpbmcoKSB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLnN0YXRlLnF1ZXJ5LnRyaW0oKVxuICAgIGlmICghdGhpcy5zdGF0ZS5sb2FkaW5nIHx8IHF1ZXJ5ID09IFwiXCIpIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibG9hZGluZ1wiPlxuICAgICAgICA8U3Bpbm5lciAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTm9SZXN1bHRzKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmxvYWRpbmcgfHwgdGhpcy5zdGF0ZS5xdWVyeSA9PT0gXCJcIiB8fCB0aGlzLnN0YXRlLmxpa2VzLmxlbmd0aCA+IDApIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibG9hZGluZ1wiPlxuICAgICAgICA8cD5ObyBCb29rbWFya3MgRm91bmQgRm9yIFwiPHN0cm9uZz57dGhpcy5zdGF0ZS5xdWVyeX08L3N0cm9uZz5cIiA6KDwvcD5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBzb3J0TGlrZXMoYSwgYikge1xuICBpZiAoYS5saWtlZF9hdCA8IGIubGlrZWRfYXQpIHJldHVybiAxXG4gIGlmIChhLmxpa2VkX2F0ID4gYi5saWtlZF9hdCkgcmV0dXJuIC0xXG4gIHJldHVybiAwXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbHBhcGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7dGhpcy5wcm9wcy51cmxzLmZ1bGx9KWBcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YWxscGFwZXJcIiBzdHlsZT17c3R5bGV9PlxuICAgICAgICB7dGhpcy5yZW5kZXJBdXRob3IoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckF1dGhvcigpIHtcbiAgICBsZXQgbmFtZSA9IHRoaXMuc3RhdGUudXNlci5uYW1lIHx8IHRoaXMuc3RhdGUudXNlci51c2VybmFtZVxuICAgIGxldCBsaW5rID0gdGhpcy5zdGF0ZS51c2VyLnBvcnRmb2xpb191cmwgfHwgKCdodHRwczovL3Vuc3BsYXNoLmNvbS9AJyArIHRoaXMuc3RhdGUudXNlci51c2VybmFtZSlcbiAgICBjb25zdCBwcm9maWxlUGhvdG9TdHlsZSA9IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke3RoaXMuc3RhdGUudXNlci5wcm9maWxlX2ltYWdlLnNtYWxsfSlgXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGhyZWY9e2xpbmt9IGNsYXNzTmFtZT1cImF1dGhvclwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwcm9maWxlLWltYWdlXCIgc3R5bGU9e3Byb2ZpbGVQaG90b1N0eWxlfT48L3NwYW4+XG4gICAgICAgIDxsYWJlbD5QaG90b2dyYXBoZXI6IDwvbGFiZWw+e25hbWV9XG4gICAgICA8L2E+XG4gICAgKVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHtcbiAgICBcImNhdGVnb3JpZXNcIjogW1xuICAgICAge1xuICAgICAgICBcImlkXCI6IDQsXG4gICAgICAgIFwibGlua3NcIjoge1xuICAgICAgICAgIFwicGhvdG9zXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL2NhdGVnb3JpZXMvNC9waG90b3NcIixcbiAgICAgICAgICBcInNlbGZcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vY2F0ZWdvcmllcy80XCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJwaG90b19jb3VudFwiOiA1NDE4NCxcbiAgICAgICAgXCJ0aXRsZVwiOiBcIk5hdHVyZVwiXG4gICAgICB9XG4gICAgXSxcbiAgICBcImNvbG9yXCI6IFwiI0MwQzE5OFwiLFxuICAgIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTYtMDMtMjNUMDU6MDk6NDctMDQ6MDBcIixcbiAgICBcImN1cnJlbnRfdXNlcl9jb2xsZWN0aW9uc1wiOiBbXSxcbiAgICBcImRlc2NyaXB0aW9uXCI6IG51bGwsXG4gICAgXCJoZWlnaHRcIjogMzMxOSxcbiAgICBcImlkXCI6IFwiRE1jSTBjbVlKWWtcIixcbiAgICBcImxpa2VkX2J5X3VzZXJcIjogZmFsc2UsXG4gICAgXCJsaWtlc1wiOiAxMjAzLFxuICAgIFwibGlua3NcIjoge1xuICAgICAgXCJkb3dubG9hZFwiOiBcImh0dHA6Ly91bnNwbGFzaC5jb20vcGhvdG9zL0RNY0kwY21ZSllrL2Rvd25sb2FkXCIsXG4gICAgICBcImRvd25sb2FkX2xvY2F0aW9uXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3Bob3Rvcy9ETWNJMGNtWUpZay9kb3dubG9hZFwiLFxuICAgICAgXCJodG1sXCI6IFwiaHR0cDovL3Vuc3BsYXNoLmNvbS9waG90b3MvRE1jSTBjbVlKWWtcIixcbiAgICAgIFwic2VsZlwiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS9waG90b3MvRE1jSTBjbVlKWWtcIlxuICAgIH0sXG4gICAgXCJ1cGRhdGVkX2F0XCI6IFwiMjAxNy0wNy0wMVQwMzo1Mzo1NC0wNDowMFwiLFxuICAgIFwidXJsc1wiOiB7XG4gICAgICBcImZ1bGxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1ODcyNDAyOTkzNi0yY2M2ZWUzOGY1ZWY/aXhsaWI9cmItMC4zLjUmcT04NSZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXNyZ2Imcz02NjM5NTgzMDljOWRkMzNhNmRmMDFjM2YzYzkzZWQxZFwiLFxuICAgICAgXCJyYXdcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1ODcyNDAyOTkzNi0yY2M2ZWUzOGY1ZWZcIixcbiAgICAgIFwicmVndWxhclwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU4NzI0MDI5OTM2LTJjYzZlZTM4ZjVlZj9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9dGlueXNyZ2Imdz0xMDgwJmZpdD1tYXgmcz00Yjg3ZWI2MjQyZjZhNDUxYTIxMjUyOTBhZGJjYjM3YVwiLFxuICAgICAgXCJzbWFsbFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU4NzI0MDI5OTM2LTJjYzZlZTM4ZjVlZj9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9dGlueXNyZ2Imdz00MDAmZml0PW1heCZzPTRjNDE3NzY5YTQ2NTY5YmEzN2NlZDdhODJkN2I5MThjXCIsXG4gICAgICBcInRodW1iXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTg3MjQwMjk5MzYtMmNjNmVlMzhmNWVmP2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZW50cm9weSZjcz10aW55c3JnYiZ3PTIwMCZmaXQ9bWF4JnM9MDI3NTdiZTNkOWI0ZGNiZjgzNjJjMTU0NjZjYTQ3MjVcIlxuICAgIH0sXG4gICAgXCJ1c2VyXCI6IHtcbiAgICAgIFwiYmlvXCI6IFwiRW5nbGlzaCBwaG90b2dyYXBoZXIgbGl2aW5nIGluIFN5ZG5leSwgQXVzdHJhbGlhLiBTaG9vdGluZyB3aXRoIGEgQ2Fub24gNkQuXFxyXFxuXFxyXFxuU2Ftc2NyaW1AZ29vZ2xlbWFpbC5jb21cXHJcXG5cIixcbiAgICAgIFwiZmlyc3RfbmFtZVwiOiBcIlNhbXVlbFwiLFxuICAgICAgXCJpZFwiOiBcIldkTmVZcWtmWUtNXCIsXG4gICAgICBcImxhc3RfbmFtZVwiOiBcIlNjcmltc2hhd1wiLFxuICAgICAgXCJsaW5rc1wiOiB7XG4gICAgICAgIFwiZm9sbG93ZXJzXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL3NhbXNjcmltL2ZvbGxvd2Vyc1wiLFxuICAgICAgICBcImZvbGxvd2luZ1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9zYW1zY3JpbS9mb2xsb3dpbmdcIixcbiAgICAgICAgXCJodG1sXCI6IFwiaHR0cDovL3Vuc3BsYXNoLmNvbS9Ac2Ftc2NyaW1cIixcbiAgICAgICAgXCJsaWtlc1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9zYW1zY3JpbS9saWtlc1wiLFxuICAgICAgICBcInBob3Rvc1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9zYW1zY3JpbS9waG90b3NcIixcbiAgICAgICAgXCJwb3J0Zm9saW9cIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvc2Ftc2NyaW0vcG9ydGZvbGlvXCIsXG4gICAgICAgIFwic2VsZlwiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9zYW1zY3JpbVwiXG4gICAgICB9LFxuICAgICAgXCJsb2NhdGlvblwiOiBcIkF1c3RyYWxpYVwiLFxuICAgICAgXCJuYW1lXCI6IFwiU2FtdWVsIFNjcmltc2hhd1wiLFxuICAgICAgXCJwb3J0Zm9saW9fdXJsXCI6IFwiaHR0cDovL3d3dy5pbnN0YWdyYW0uY29tL3NhbXNjcmltXCIsXG4gICAgICBcInByb2ZpbGVfaW1hZ2VcIjoge1xuICAgICAgICBcImxhcmdlXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Byb2ZpbGUtMTQ1ODcyMzY3OTI2MS1hNWVmMzJjYjJhMDQ/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1mYWNlcyZjcz10aW55c3JnYiZmaXQ9Y3JvcCZoPTEyOCZ3PTEyOCZzPTE1YWZjZTRmZDI4NjA3NGQ5MmZhNzI2MzJkOGNhYTM0XCIsXG4gICAgICAgIFwibWVkaXVtXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Byb2ZpbGUtMTQ1ODcyMzY3OTI2MS1hNWVmMzJjYjJhMDQ/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1mYWNlcyZjcz10aW55c3JnYiZmaXQ9Y3JvcCZoPTY0Jnc9NjQmcz00NTA5NjQ1YjkyODlhOWZlYThiODU1MThjNzdjZTBlZFwiLFxuICAgICAgICBcInNtYWxsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Byb2ZpbGUtMTQ1ODcyMzY3OTI2MS1hNWVmMzJjYjJhMDQ/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1mYWNlcyZjcz10aW55c3JnYiZmaXQ9Y3JvcCZoPTMyJnc9MzImcz05MGVhNzU4YmU2OTk5ODA3YjZkOGRhMWVjNjAyNTMwZlwiXG4gICAgICB9LFxuICAgICAgXCJ0b3RhbF9jb2xsZWN0aW9uc1wiOiAwLFxuICAgICAgXCJ0b3RhbF9saWtlc1wiOiAwLFxuICAgICAgXCJ0b3RhbF9waG90b3NcIjogMTQsXG4gICAgICBcInR3aXR0ZXJfdXNlcm5hbWVcIjogbnVsbCxcbiAgICAgIFwidXBkYXRlZF9hdFwiOiBcIjIwMTctMDctMDFUMDc6MDU6MjQtMDQ6MDBcIixcbiAgICAgIFwidXNlcm5hbWVcIjogXCJzYW1zY3JpbVwiXG4gICAgfSxcbiAgICBcIndpZHRoXCI6IDQ5NzlcbiAgfSxcbiAge1xuICAgIFwiY2F0ZWdvcmllc1wiOiBbXSxcbiAgICBcImNvbG9yXCI6IFwiIzM4MkYzMFwiLFxuICAgIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTctMDUtMDdUMTk6NDY6MzItMDQ6MDBcIixcbiAgICBcImN1cnJlbnRfdXNlcl9jb2xsZWN0aW9uc1wiOiBbXSxcbiAgICBcImRlc2NyaXB0aW9uXCI6IG51bGwsXG4gICAgXCJoZWlnaHRcIjogMjAwMCxcbiAgICBcImlkXCI6IFwiRXdFNHRCWWgzbXNcIixcbiAgICBcImxpa2VkX2J5X3VzZXJcIjogZmFsc2UsXG4gICAgXCJsaWtlc1wiOiAxOTQsXG4gICAgXCJsaW5rc1wiOiB7XG4gICAgICBcImRvd25sb2FkXCI6IFwiaHR0cDovL3Vuc3BsYXNoLmNvbS9waG90b3MvRXdFNHRCWWgzbXMvZG93bmxvYWRcIixcbiAgICAgIFwiZG93bmxvYWRfbG9jYXRpb25cIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vcGhvdG9zL0V3RTR0QlloM21zL2Rvd25sb2FkXCIsXG4gICAgICBcImh0bWxcIjogXCJodHRwOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9Fd0U0dEJZaDNtc1wiLFxuICAgICAgXCJzZWxmXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3Bob3Rvcy9Fd0U0dEJZaDNtc1wiXG4gICAgfSxcbiAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE3LTA3LTAxVDA0OjIzOjI0LTA0OjAwXCIsXG4gICAgXCJ1cmxzXCI6IHtcbiAgICAgIFwiZnVsbFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk0MjAwNDgzMDM1LWRiN2JjNmFhNTczOT9peGxpYj1yYi0wLjMuNSZxPTg1JmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9c3JnYiZzPTMzMjU4OTIxMWI1ZjNiMmNiN2M2NGI3ZWZhNmYzNDczXCIsXG4gICAgICBcInJhd1wiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk0MjAwNDgzMDM1LWRiN2JjNmFhNTczOVwiLFxuICAgICAgXCJyZWd1bGFyXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQyMDA0ODMwMzUtZGI3YmM2YWE1NzM5P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZW50cm9weSZjcz10aW55c3JnYiZ3PTEwODAmZml0PW1heCZzPWY3MTI0ZDg4Y2Q4YmU5NmEwNjExMDhiNmUzZWY5ZDMwXCIsXG4gICAgICBcInNtYWxsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQyMDA0ODMwMzUtZGI3YmM2YWE1NzM5P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZW50cm9weSZjcz10aW55c3JnYiZ3PTQwMCZmaXQ9bWF4JnM9ZTdkZmZkNmRmOWJhZGVhOWNhZWJhMzNiMmE3NWNiMTNcIixcbiAgICAgIFwidGh1bWJcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ5NDIwMDQ4MzAzNS1kYjdiYzZhYTU3Mzk/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXRpbnlzcmdiJnc9MjAwJmZpdD1tYXgmcz05OGU3M2VmOGU0YjMwMmNmN2FhZDFiYzYxMWE3ZWM3OFwiXG4gICAgfSxcbiAgICBcInVzZXJcIjoge1xuICAgICAgXCJiaW9cIjogXCJcIixcbiAgICAgIFwiZmlyc3RfbmFtZVwiOiBcIkthdGllXCIsXG4gICAgICBcImlkXCI6IFwibmlnVHVzOWFzUjhcIixcbiAgICAgIFwibGFzdF9uYW1lXCI6IFwiVHJlYWR3YXlcIixcbiAgICAgIFwibGlua3NcIjoge1xuICAgICAgICBcImZvbGxvd2Vyc1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9rYXRpZXRyZWFkd2F5L2ZvbGxvd2Vyc1wiLFxuICAgICAgICBcImZvbGxvd2luZ1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9rYXRpZXRyZWFkd2F5L2ZvbGxvd2luZ1wiLFxuICAgICAgICBcImh0bWxcIjogXCJodHRwOi8vdW5zcGxhc2guY29tL0BrYXRpZXRyZWFkd2F5XCIsXG4gICAgICAgIFwibGlrZXNcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMva2F0aWV0cmVhZHdheS9saWtlc1wiLFxuICAgICAgICBcInBob3Rvc1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9rYXRpZXRyZWFkd2F5L3Bob3Rvc1wiLFxuICAgICAgICBcInBvcnRmb2xpb1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9rYXRpZXRyZWFkd2F5L3BvcnRmb2xpb1wiLFxuICAgICAgICBcInNlbGZcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMva2F0aWV0cmVhZHdheVwiXG4gICAgICB9LFxuICAgICAgXCJsb2NhdGlvblwiOiBcIkJlbnRvbnZpbGxlLCBBclwiLFxuICAgICAgXCJuYW1lXCI6IFwiS2F0aWUgVHJlYWR3YXlcIixcbiAgICAgIFwicG9ydGZvbGlvX3VybFwiOiBcImh0dHA6Ly93d3cua2F0aWV0cmVhZHdheXBob3RvZ3JhcGh5LmNvbS9cIixcbiAgICAgIFwicHJvZmlsZV9pbWFnZVwiOiB7XG4gICAgICAgIFwibGFyZ2VcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcHJvZmlsZS0xNDgwODY1Mjc1OTMzLTI1MTgxN2ZjNTE3Nj9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWZhY2VzJmNzPXRpbnlzcmdiJmZpdD1jcm9wJmg9MTI4Jnc9MTI4JnM9ZTFlY2NlMzZjZWU2MGFjODRmODllNmQ1ZGRhNjRmNjJcIixcbiAgICAgICAgXCJtZWRpdW1cIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcHJvZmlsZS0xNDgwODY1Mjc1OTMzLTI1MTgxN2ZjNTE3Nj9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWZhY2VzJmNzPXRpbnlzcmdiJmZpdD1jcm9wJmg9NjQmdz02NCZzPTUxNWE5NTJhODgxMmQ5NTEyYmFlMTQ0NjMyN2M3MzI3XCIsXG4gICAgICAgIFwic21hbGxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcHJvZmlsZS0xNDgwODY1Mjc1OTMzLTI1MTgxN2ZjNTE3Nj9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWZhY2VzJmNzPXRpbnlzcmdiJmZpdD1jcm9wJmg9MzImdz0zMiZzPWVmODc1NmM1YWJjNDI1OWIyNzU0MTBhOGU4MGMwNWU2XCJcbiAgICAgIH0sXG4gICAgICBcInRvdGFsX2NvbGxlY3Rpb25zXCI6IDAsXG4gICAgICBcInRvdGFsX2xpa2VzXCI6IDAsXG4gICAgICBcInRvdGFsX3Bob3Rvc1wiOiA3LFxuICAgICAgXCJ0d2l0dGVyX3VzZXJuYW1lXCI6IG51bGwsXG4gICAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE3LTA3LTAxVDA0OjIzOjI0LTA0OjAwXCIsXG4gICAgICBcInVzZXJuYW1lXCI6IFwia2F0aWV0cmVhZHdheVwiXG4gICAgfSxcbiAgICBcIndpZHRoXCI6IDMwMDBcbiAgfSxcbiAge1xuICAgICAgICBcImNhdGVnb3JpZXNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiaWRcIjogMixcbiAgICAgICAgICAgICAgICBcImxpbmtzXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJwaG90b3NcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vY2F0ZWdvcmllcy8yL3Bob3Rvc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInNlbGZcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vY2F0ZWdvcmllcy8yXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwicGhvdG9fY291bnRcIjogMjI4OTcsXG4gICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkJ1aWxkaW5nc1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiY29sb3JcIjogXCIjMkIyRjJFXCIsXG4gICAgICAgIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTYtMDMtMjJUMTc6Mzg6NDQtMDQ6MDBcIixcbiAgICAgICAgXCJjdXJyZW50X3VzZXJfY29sbGVjdGlvbnNcIjogW10sXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogbnVsbCxcbiAgICAgICAgXCJoZWlnaHRcIjogMzM2NixcbiAgICAgICAgXCJpZFwiOiBcImpSNFpmLXJpRWpJXCIsXG4gICAgICAgIFwibGlrZWRfYnlfdXNlclwiOiBmYWxzZSxcbiAgICAgICAgXCJsaWtlc1wiOiAxMTQxLFxuICAgICAgICBcImxpbmtzXCI6IHtcbiAgICAgICAgICAgIFwiZG93bmxvYWRcIjogXCJodHRwOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9qUjRaZi1yaUVqSS9kb3dubG9hZFwiLFxuICAgICAgICAgICAgXCJkb3dubG9hZF9sb2NhdGlvblwiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS9waG90b3MvalI0WmYtcmlFakkvZG93bmxvYWRcIixcbiAgICAgICAgICAgIFwiaHRtbFwiOiBcImh0dHA6Ly91bnNwbGFzaC5jb20vcGhvdG9zL2pSNFpmLXJpRWpJXCIsXG4gICAgICAgICAgICBcInNlbGZcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vcGhvdG9zL2pSNFpmLXJpRWpJXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJ1cGRhdGVkX2F0XCI6IFwiMjAxNy0wNy0wMVQwMzozNjo0NS0wNDowMFwiLFxuICAgIFwidXJsc1wiOiB7XG4gICAgICAgICAgICBcImZ1bGxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1ODY4MjYyNTIyMS0zYTQ1ZjhhODQ0Yzc/aXhsaWI9cmItMC4zLjUmcT04NSZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXNyZ2Imcz0wOTI3OWExYTFjYzZhZjhmN2U0MWQxZmM3MDZjNzAyNVwiLFxuICAgICAgICAgICAgXCJyYXdcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1ODY4MjYyNTIyMS0zYTQ1ZjhhODQ0YzdcIixcbiAgICAgICAgICAgIFwicmVndWxhclwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU4NjgyNjI1MjIxLTNhNDVmOGE4NDRjNz9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9dGlueXNyZ2Imdz0xMDgwJmZpdD1tYXgmcz0xMDI0NTEyNjRlOWNkMGM2ZmM5NDc2OGJmMzQ1ZTY4NlwiLFxuICAgICAgICAgICAgXCJzbWFsbFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU4NjgyNjI1MjIxLTNhNDVmOGE4NDRjNz9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9dGlueXNyZ2Imdz00MDAmZml0PW1heCZzPTMwMDAzNjhhYTI2NTI5OTQzMzg5NGJhY2M3ZDM1MjZiXCIsXG4gICAgICAgICAgICBcInRodW1iXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTg2ODI2MjUyMjEtM2E0NWY4YTg0NGM3P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZW50cm9weSZjcz10aW55c3JnYiZ3PTIwMCZmaXQ9bWF4JnM9MDAyZGM1NDU5YzdlMzdmNDBmMWI1MDhkNGJiMWRkNGVcIlxuICAgICAgICB9LFxuICAgICAgICBcInVzZXJcIjoge1xuICAgICAgICAgICAgXCJiaW9cIjogXCJMb25kb24gYmFzZWQgcGhvdG9ncmFwaGVyIHdpdGggYW4gZXllIGZvciB0aGUgZGV0YWlscyBpbiBsaWZlLCB3aGljaCBpcyB0aGUgYmFzaXMgb2YgdGhlIGFlc3RoZXRpYyBpbiBteSBwaG90b2dyYXBocy4gV2hlcmVhcyBmb3Igc29tZSwgZm9jdXNpbmcgb24gZGV0YWlscyBhbmQgcHJlY2lzaW9uIGRldGFjaGVzIGZlZWxpbmdzLCBJIHVzZSBkZXRhaWxzIHRvIGJyaW5nIHN1YmplY3RzIHRvIGxpZmUuXCIsXG4gICAgICAgICAgICBcImZpcnN0X25hbWVcIjogXCJBbmRyZXdcIixcbiAgICAgICAgICAgIFwiaWRcIjogXCJpeGNSZ2dIcFV6c1wiLFxuICAgICAgICAgICAgXCJsYXN0X25hbWVcIjogXCJSaWRsZXlcIixcbiAgICAgICAgICAgIFwibGlua3NcIjoge1xuICAgICAgICAgICAgICAgIFwiZm9sbG93ZXJzXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2FyaWRsZXk4OC9mb2xsb3dlcnNcIixcbiAgICAgICAgICAgICAgICBcImZvbGxvd2luZ1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9hcmlkbGV5ODgvZm9sbG93aW5nXCIsXG4gICAgICAgICAgICAgICAgXCJodG1sXCI6IFwiaHR0cDovL3Vuc3BsYXNoLmNvbS9AYXJpZGxleTg4XCIsXG4gICAgICAgICAgICAgICAgXCJsaWtlc1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9hcmlkbGV5ODgvbGlrZXNcIixcbiAgICAgICAgICAgICAgICBcInBob3Rvc1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9hcmlkbGV5ODgvcGhvdG9zXCIsXG4gICAgICAgICAgICAgICAgXCJwb3J0Zm9saW9cIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvYXJpZGxleTg4L3BvcnRmb2xpb1wiLFxuICAgICAgICAgICAgICAgIFwic2VsZlwiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9hcmlkbGV5ODhcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwibG9jYXRpb25cIjogXCJMb25kb24sIFVLXCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJBbmRyZXcgUmlkbGV5XCIsXG4gICAgICAgICAgICBcInBvcnRmb2xpb191cmxcIjogXCJodHRwOi8vd3d3LmFyaWRsZXlwaG90b2dyYXBoeS5jb20vXCIsXG4gICAgICAgICAgICBcInByb2ZpbGVfaW1hZ2VcIjoge1xuICAgICAgICAgICAgICAgIFwibGFyZ2VcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcHJvZmlsZS0xNDg0NDE4MjU4NzMxLTY0YTY0N2FmNmUwOD9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWZhY2VzJmNzPXRpbnlzcmdiJmZpdD1jcm9wJmg9MTI4Jnc9MTI4JnM9MTY5ZTAyNTIwMzY0N2ZmYTgwMmZhZDE0NTlkY2MzM2FcIixcbiAgICAgICAgICAgICAgICBcIm1lZGl1bVwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9wcm9maWxlLTE0ODQ0MTgyNTg3MzEtNjRhNjQ3YWY2ZTA4P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZmFjZXMmY3M9dGlueXNyZ2ImZml0PWNyb3AmaD02NCZ3PTY0JnM9MzFjYmYzYjU1MDVhNWE4N2FlNjljMTNjYTBkNjBiZjdcIixcbiAgICAgICAgICAgICAgICBcInNtYWxsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Byb2ZpbGUtMTQ4NDQxODI1ODczMS02NGE2NDdhZjZlMDg/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1mYWNlcyZjcz10aW55c3JnYiZmaXQ9Y3JvcCZoPTMyJnc9MzImcz04ZTA3ODc0NTEzNTMwZTlhZjI5ZjE0YTE0MjI2Y2YwY1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ0b3RhbF9jb2xsZWN0aW9uc1wiOiAwLFxuICAgICAgICAgICAgXCJ0b3RhbF9saWtlc1wiOiAzNixcbiAgICAgICAgICAgIFwidG90YWxfcGhvdG9zXCI6IDMzLFxuICAgICAgICAgICAgXCJ0d2l0dGVyX3VzZXJuYW1lXCI6IFwiYW5kcmV3cmlkbGV5XCIsXG4gICAgICAgICAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE3LTA3LTAxVDA1OjQ5OjI3LTA0OjAwXCIsXG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IFwiYXJpZGxleTg4XCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3aWR0aFwiOiA0NDg4XG4gIH1cbl1cbiIsIm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG5cbmZ1bmN0aW9uIGRlYm91bmNlIChmbiwgd2FpdCkge1xuICB2YXIgdGltZXI7XG4gIHZhciBhcmdzO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICB3YWl0ID0gMjUwO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGltZXIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgdGltZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9O1xufVxuIiwiIWZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBmdW5jdGlvbiBWTm9kZSgpIHt9XG4gICAgZnVuY3Rpb24gaChub2RlTmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgbGFzdFNpbXBsZSwgY2hpbGQsIHNpbXBsZSwgaSwgY2hpbGRyZW4gPSBFTVBUWV9DSElMRFJFTjtcbiAgICAgICAgZm9yIChpID0gYXJndW1lbnRzLmxlbmd0aDsgaS0tID4gMjsgKSBzdGFjay5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzICYmIG51bGwgIT0gYXR0cmlidXRlcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgaWYgKCFzdGFjay5sZW5ndGgpIHN0YWNrLnB1c2goYXR0cmlidXRlcy5jaGlsZHJlbik7XG4gICAgICAgICAgICBkZWxldGUgYXR0cmlidXRlcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSBpZiAoKGNoaWxkID0gc3RhY2sucG9wKCkpICYmIHZvaWQgMCAhPT0gY2hpbGQucG9wKSBmb3IgKGkgPSBjaGlsZC5sZW5ndGg7IGktLTsgKSBzdGFjay5wdXNoKGNoaWxkW2ldKTsgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQgPT09ICEwIHx8IGNoaWxkID09PSAhMSkgY2hpbGQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHNpbXBsZSA9ICdmdW5jdGlvbicgIT0gdHlwZW9mIG5vZGVOYW1lKSBpZiAobnVsbCA9PSBjaGlsZCkgY2hpbGQgPSAnJzsgZWxzZSBpZiAoJ251bWJlcicgPT0gdHlwZW9mIGNoaWxkKSBjaGlsZCA9IFN0cmluZyhjaGlsZCk7IGVsc2UgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBjaGlsZCkgc2ltcGxlID0gITE7XG4gICAgICAgICAgICBpZiAoc2ltcGxlICYmIGxhc3RTaW1wbGUpIGNoaWxkcmVuW2NoaWxkcmVuLmxlbmd0aCAtIDFdICs9IGNoaWxkOyBlbHNlIGlmIChjaGlsZHJlbiA9PT0gRU1QVFlfQ0hJTERSRU4pIGNoaWxkcmVuID0gWyBjaGlsZCBdOyBlbHNlIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgbGFzdFNpbXBsZSA9IHNpbXBsZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcCA9IG5ldyBWTm9kZSgpO1xuICAgICAgICBwLm5vZGVOYW1lID0gbm9kZU5hbWU7XG4gICAgICAgIHAuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgcC5hdHRyaWJ1dGVzID0gbnVsbCA9PSBhdHRyaWJ1dGVzID8gdm9pZCAwIDogYXR0cmlidXRlcztcbiAgICAgICAgcC5rZXkgPSBudWxsID09IGF0dHJpYnV0ZXMgPyB2b2lkIDAgOiBhdHRyaWJ1dGVzLmtleTtcbiAgICAgICAgaWYgKHZvaWQgMCAhPT0gb3B0aW9ucy52bm9kZSkgb3B0aW9ucy52bm9kZShwKTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV4dGVuZChvYmosIHByb3BzKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gcHJvcHMpIG9ialtpXSA9IHByb3BzW2ldO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbG9uZUVsZW1lbnQodm5vZGUsIHByb3BzKSB7XG4gICAgICAgIHJldHVybiBoKHZub2RlLm5vZGVOYW1lLCBleHRlbmQoZXh0ZW5kKHt9LCB2bm9kZS5hdHRyaWJ1dGVzKSwgcHJvcHMpLCBhcmd1bWVudHMubGVuZ3RoID4gMiA/IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IHZub2RlLmNoaWxkcmVuKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX19kICYmIChjb21wb25lbnQuX19kID0gITApICYmIDEgPT0gaXRlbXMucHVzaChjb21wb25lbnQpKSAob3B0aW9ucy5kZWJvdW5jZVJlbmRlcmluZyB8fCBzZXRUaW1lb3V0KShyZXJlbmRlcik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlcmVuZGVyKCkge1xuICAgICAgICB2YXIgcCwgbGlzdCA9IGl0ZW1zO1xuICAgICAgICBpdGVtcyA9IFtdO1xuICAgICAgICB3aGlsZSAocCA9IGxpc3QucG9wKCkpIGlmIChwLl9fZCkgcmVuZGVyQ29tcG9uZW50KHApO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1NhbWVOb2RlVHlwZShub2RlLCB2bm9kZSwgaHlkcmF0aW5nKSB7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUgfHwgJ251bWJlcicgPT0gdHlwZW9mIHZub2RlKSByZXR1cm4gdm9pZCAwICE9PSBub2RlLnNwbGl0VGV4dDtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZS5ub2RlTmFtZSkgcmV0dXJuICFub2RlLl9jb21wb25lbnRDb25zdHJ1Y3RvciAmJiBpc05hbWVkTm9kZShub2RlLCB2bm9kZS5ub2RlTmFtZSk7IGVsc2UgcmV0dXJuIGh5ZHJhdGluZyB8fCBub2RlLl9jb21wb25lbnRDb25zdHJ1Y3RvciA9PT0gdm5vZGUubm9kZU5hbWU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzTmFtZWROb2RlKG5vZGUsIG5vZGVOYW1lKSB7XG4gICAgICAgIHJldHVybiBub2RlLl9fbiA9PT0gbm9kZU5hbWUgfHwgbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXROb2RlUHJvcHModm5vZGUpIHtcbiAgICAgICAgdmFyIHByb3BzID0gZXh0ZW5kKHt9LCB2bm9kZS5hdHRyaWJ1dGVzKTtcbiAgICAgICAgcHJvcHMuY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICAgICAgdmFyIGRlZmF1bHRQcm9wcyA9IHZub2RlLm5vZGVOYW1lLmRlZmF1bHRQcm9wcztcbiAgICAgICAgaWYgKHZvaWQgMCAhPT0gZGVmYXVsdFByb3BzKSBmb3IgKHZhciBpIGluIGRlZmF1bHRQcm9wcykgaWYgKHZvaWQgMCA9PT0gcHJvcHNbaV0pIHByb3BzW2ldID0gZGVmYXVsdFByb3BzW2ldO1xuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZU5vZGUobm9kZU5hbWUsIGlzU3ZnKSB7XG4gICAgICAgIHZhciBub2RlID0gaXNTdmcgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgbm9kZU5hbWUpIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG4gICAgICAgIG5vZGUuX19uID0gbm9kZU5hbWU7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVOb2RlKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSkgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRBY2Nlc3Nvcihub2RlLCBuYW1lLCBvbGQsIHZhbHVlLCBpc1N2Zykge1xuICAgICAgICBpZiAoJ2NsYXNzTmFtZScgPT09IG5hbWUpIG5hbWUgPSAnY2xhc3MnO1xuICAgICAgICBpZiAoJ2tleScgPT09IG5hbWUpIDsgZWxzZSBpZiAoJ3JlZicgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGlmIChvbGQpIG9sZChudWxsKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkgdmFsdWUobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2NsYXNzJyA9PT0gbmFtZSAmJiAhaXNTdmcpIG5vZGUuY2xhc3NOYW1lID0gdmFsdWUgfHwgJyc7IGVsc2UgaWYgKCdzdHlsZScgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGlmICghdmFsdWUgfHwgJ3N0cmluZycgPT0gdHlwZW9mIHZhbHVlIHx8ICdzdHJpbmcnID09IHR5cGVvZiBvbGQpIG5vZGUuc3R5bGUuY3NzVGV4dCA9IHZhbHVlIHx8ICcnO1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmICdvYmplY3QnID09IHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICgnc3RyaW5nJyAhPSB0eXBlb2Ygb2xkKSBmb3IgKHZhciBpIGluIG9sZCkgaWYgKCEoaSBpbiB2YWx1ZSkpIG5vZGUuc3R5bGVbaV0gPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHZhbHVlKSBub2RlLnN0eWxlW2ldID0gJ251bWJlcicgPT0gdHlwZW9mIHZhbHVlW2ldICYmIElTX05PTl9ESU1FTlNJT05BTC50ZXN0KGkpID09PSAhMSA/IHZhbHVlW2ldICsgJ3B4JyA6IHZhbHVlW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCdkYW5nZXJvdXNseVNldElubmVySFRNTCcgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkgbm9kZS5pbm5lckhUTUwgPSB2YWx1ZS5fX2h0bWwgfHwgJyc7XG4gICAgICAgIH0gZWxzZSBpZiAoJ28nID09IG5hbWVbMF0gJiYgJ24nID09IG5hbWVbMV0pIHtcbiAgICAgICAgICAgIHZhciB1c2VDYXB0dXJlID0gbmFtZSAhPT0gKG5hbWUgPSBuYW1lLnJlcGxhY2UoL0NhcHR1cmUkLywgJycpKTtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCkuc3Vic3RyaW5nKDIpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFvbGQpIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudFByb3h5LCB1c2VDYXB0dXJlKTtcbiAgICAgICAgICAgIH0gZWxzZSBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZXZlbnRQcm94eSwgdXNlQ2FwdHVyZSk7XG4gICAgICAgICAgICAobm9kZS5fX2wgfHwgKG5vZGUuX19sID0ge30pKVtuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKCdsaXN0JyAhPT0gbmFtZSAmJiAndHlwZScgIT09IG5hbWUgJiYgIWlzU3ZnICYmIG5hbWUgaW4gbm9kZSkge1xuICAgICAgICAgICAgc2V0UHJvcGVydHkobm9kZSwgbmFtZSwgbnVsbCA9PSB2YWx1ZSA/ICcnIDogdmFsdWUpO1xuICAgICAgICAgICAgaWYgKG51bGwgPT0gdmFsdWUgfHwgdmFsdWUgPT09ICExKSBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBucyA9IGlzU3ZnICYmIG5hbWUgIT09IChuYW1lID0gbmFtZS5yZXBsYWNlKC9eeGxpbmtcXDo/LywgJycpKTtcbiAgICAgICAgICAgIGlmIChudWxsID09IHZhbHVlIHx8IHZhbHVlID09PSAhMSkgaWYgKG5zKSBub2RlLnJlbW92ZUF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpKTsgZWxzZSBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTsgZWxzZSBpZiAoJ2Z1bmN0aW9uJyAhPSB0eXBlb2YgdmFsdWUpIGlmIChucykgbm9kZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsIG5hbWUudG9Mb3dlckNhc2UoKSwgdmFsdWUpOyBlbHNlIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRQcm9wZXJ0eShub2RlLCBuYW1lLCB2YWx1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbm9kZVtuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cbiAgICBmdW5jdGlvbiBldmVudFByb3h5KGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19sW2UudHlwZV0ob3B0aW9ucy5ldmVudCAmJiBvcHRpb25zLmV2ZW50KGUpIHx8IGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmbHVzaE1vdW50cygpIHtcbiAgICAgICAgdmFyIGM7XG4gICAgICAgIHdoaWxlIChjID0gbW91bnRzLnBvcCgpKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hZnRlck1vdW50KSBvcHRpb25zLmFmdGVyTW91bnQoYyk7XG4gICAgICAgICAgICBpZiAoYy5jb21wb25lbnREaWRNb3VudCkgYy5jb21wb25lbnREaWRNb3VudCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIHBhcmVudCwgY29tcG9uZW50Um9vdCkge1xuICAgICAgICBpZiAoIWRpZmZMZXZlbCsrKSB7XG4gICAgICAgICAgICBpc1N2Z01vZGUgPSBudWxsICE9IHBhcmVudCAmJiB2b2lkIDAgIT09IHBhcmVudC5vd25lclNWR0VsZW1lbnQ7XG4gICAgICAgICAgICBoeWRyYXRpbmcgPSBudWxsICE9IGRvbSAmJiAhKCdfX3ByZWFjdGF0dHJfJyBpbiBkb20pO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXQgPSBpZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgY29tcG9uZW50Um9vdCk7XG4gICAgICAgIGlmIChwYXJlbnQgJiYgcmV0LnBhcmVudE5vZGUgIT09IHBhcmVudCkgcGFyZW50LmFwcGVuZENoaWxkKHJldCk7XG4gICAgICAgIGlmICghLS1kaWZmTGV2ZWwpIHtcbiAgICAgICAgICAgIGh5ZHJhdGluZyA9ICExO1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnRSb290KSBmbHVzaE1vdW50cygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBjb21wb25lbnRSb290KSB7XG4gICAgICAgIHZhciBvdXQgPSBkb20sIHByZXZTdmdNb2RlID0gaXNTdmdNb2RlO1xuICAgICAgICBpZiAobnVsbCA9PSB2bm9kZSkgdm5vZGUgPSAnJztcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSkge1xuICAgICAgICAgICAgaWYgKGRvbSAmJiB2b2lkIDAgIT09IGRvbS5zcGxpdFRleHQgJiYgZG9tLnBhcmVudE5vZGUgJiYgKCFkb20uX2NvbXBvbmVudCB8fCBjb21wb25lbnRSb290KSkge1xuICAgICAgICAgICAgICAgIGlmIChkb20ubm9kZVZhbHVlICE9IHZub2RlKSBkb20ubm9kZVZhbHVlID0gdm5vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9tKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb20ucGFyZW50Tm9kZSkgZG9tLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG91dCwgZG9tKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoZG9tLCAhMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0Ll9fcHJlYWN0YXR0cl8gPSAhMDtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHZub2RlLm5vZGVOYW1lKSByZXR1cm4gYnVpbGRDb21wb25lbnRGcm9tVk5vZGUoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICBpc1N2Z01vZGUgPSAnc3ZnJyA9PT0gdm5vZGUubm9kZU5hbWUgPyAhMCA6ICdmb3JlaWduT2JqZWN0JyA9PT0gdm5vZGUubm9kZU5hbWUgPyAhMSA6IGlzU3ZnTW9kZTtcbiAgICAgICAgaWYgKCFkb20gfHwgIWlzTmFtZWROb2RlKGRvbSwgU3RyaW5nKHZub2RlLm5vZGVOYW1lKSkpIHtcbiAgICAgICAgICAgIG91dCA9IGNyZWF0ZU5vZGUoU3RyaW5nKHZub2RlLm5vZGVOYW1lKSwgaXNTdmdNb2RlKTtcbiAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIG91dC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGRvbSwgITApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBmYyA9IG91dC5maXJzdENoaWxkLCBwcm9wcyA9IG91dC5fX3ByZWFjdGF0dHJfIHx8IChvdXQuX19wcmVhY3RhdHRyXyA9IHt9KSwgdmNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmICghaHlkcmF0aW5nICYmIHZjaGlsZHJlbiAmJiAxID09PSB2Y2hpbGRyZW4ubGVuZ3RoICYmICdzdHJpbmcnID09IHR5cGVvZiB2Y2hpbGRyZW5bMF0gJiYgbnVsbCAhPSBmYyAmJiB2b2lkIDAgIT09IGZjLnNwbGl0VGV4dCAmJiBudWxsID09IGZjLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICBpZiAoZmMubm9kZVZhbHVlICE9IHZjaGlsZHJlblswXSkgZmMubm9kZVZhbHVlID0gdmNoaWxkcmVuWzBdO1xuICAgICAgICB9IGVsc2UgaWYgKHZjaGlsZHJlbiAmJiB2Y2hpbGRyZW4ubGVuZ3RoIHx8IG51bGwgIT0gZmMpIGlubmVyRGlmZk5vZGUob3V0LCB2Y2hpbGRyZW4sIGNvbnRleHQsIG1vdW50QWxsLCBoeWRyYXRpbmcgfHwgbnVsbCAhPSBwcm9wcy5kYW5nZXJvdXNseVNldElubmVySFRNTCk7XG4gICAgICAgIGRpZmZBdHRyaWJ1dGVzKG91dCwgdm5vZGUuYXR0cmlidXRlcywgcHJvcHMpO1xuICAgICAgICBpc1N2Z01vZGUgPSBwcmV2U3ZnTW9kZTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5uZXJEaWZmTm9kZShkb20sIHZjaGlsZHJlbiwgY29udGV4dCwgbW91bnRBbGwsIGlzSHlkcmF0aW5nKSB7XG4gICAgICAgIHZhciBqLCBjLCB2Y2hpbGQsIGNoaWxkLCBvcmlnaW5hbENoaWxkcmVuID0gZG9tLmNoaWxkTm9kZXMsIGNoaWxkcmVuID0gW10sIGtleWVkID0ge30sIGtleWVkTGVuID0gMCwgbWluID0gMCwgbGVuID0gb3JpZ2luYWxDaGlsZHJlbi5sZW5ndGgsIGNoaWxkcmVuTGVuID0gMCwgdmxlbiA9IHZjaGlsZHJlbiA/IHZjaGlsZHJlbi5sZW5ndGggOiAwO1xuICAgICAgICBpZiAoMCAhPT0gbGVuKSBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgX2NoaWxkID0gb3JpZ2luYWxDaGlsZHJlbltpXSwgcHJvcHMgPSBfY2hpbGQuX19wcmVhY3RhdHRyXywga2V5ID0gdmxlbiAmJiBwcm9wcyA/IF9jaGlsZC5fY29tcG9uZW50ID8gX2NoaWxkLl9jb21wb25lbnQuX19rIDogcHJvcHMua2V5IDogbnVsbDtcbiAgICAgICAgICAgIGlmIChudWxsICE9IGtleSkge1xuICAgICAgICAgICAgICAgIGtleWVkTGVuKys7XG4gICAgICAgICAgICAgICAga2V5ZWRba2V5XSA9IF9jaGlsZDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcHMgfHwgKHZvaWQgMCAhPT0gX2NoaWxkLnNwbGl0VGV4dCA/IGlzSHlkcmF0aW5nID8gX2NoaWxkLm5vZGVWYWx1ZS50cmltKCkgOiAhMCA6IGlzSHlkcmF0aW5nKSkgY2hpbGRyZW5bY2hpbGRyZW5MZW4rK10gPSBfY2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKDAgIT09IHZsZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgdmxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2Y2hpbGQgPSB2Y2hpbGRyZW5baV07XG4gICAgICAgICAgICBjaGlsZCA9IG51bGw7XG4gICAgICAgICAgICB2YXIga2V5ID0gdmNoaWxkLmtleTtcbiAgICAgICAgICAgIGlmIChudWxsICE9IGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXllZExlbiAmJiB2b2lkIDAgIT09IGtleWVkW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBrZXllZFtrZXldO1xuICAgICAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICBrZXllZExlbi0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWNoaWxkICYmIG1pbiA8IGNoaWxkcmVuTGVuKSBmb3IgKGogPSBtaW47IGogPCBjaGlsZHJlbkxlbjsgaisrKSBpZiAodm9pZCAwICE9PSBjaGlsZHJlbltqXSAmJiBpc1NhbWVOb2RlVHlwZShjID0gY2hpbGRyZW5bal0sIHZjaGlsZCwgaXNIeWRyYXRpbmcpKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSBjO1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGlmIChqID09PSBjaGlsZHJlbkxlbiAtIDEpIGNoaWxkcmVuTGVuLS07XG4gICAgICAgICAgICAgICAgaWYgKGogPT09IG1pbikgbWluKys7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGlsZCA9IGlkaWZmKGNoaWxkLCB2Y2hpbGQsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGlmIChjaGlsZCAmJiBjaGlsZCAhPT0gZG9tKSBpZiAoaSA+PSBsZW4pIGRvbS5hcHBlbmRDaGlsZChjaGlsZCk7IGVsc2UgaWYgKGNoaWxkICE9PSBvcmlnaW5hbENoaWxkcmVuW2ldKSBpZiAoY2hpbGQgPT09IG9yaWdpbmFsQ2hpbGRyZW5baSArIDFdKSByZW1vdmVOb2RlKG9yaWdpbmFsQ2hpbGRyZW5baV0pOyBlbHNlIGRvbS5pbnNlcnRCZWZvcmUoY2hpbGQsIG9yaWdpbmFsQ2hpbGRyZW5baV0gfHwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleWVkTGVuKSBmb3IgKHZhciBpIGluIGtleWVkKSBpZiAodm9pZCAwICE9PSBrZXllZFtpXSkgcmVjb2xsZWN0Tm9kZVRyZWUoa2V5ZWRbaV0sICExKTtcbiAgICAgICAgd2hpbGUgKG1pbiA8PSBjaGlsZHJlbkxlbikgaWYgKHZvaWQgMCAhPT0gKGNoaWxkID0gY2hpbGRyZW5bY2hpbGRyZW5MZW4tLV0pKSByZWNvbGxlY3ROb2RlVHJlZShjaGlsZCwgITEpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZWNvbGxlY3ROb2RlVHJlZShub2RlLCB1bm1vdW50T25seSkge1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gbm9kZS5fY29tcG9uZW50O1xuICAgICAgICBpZiAoY29tcG9uZW50KSB1bm1vdW50Q29tcG9uZW50KGNvbXBvbmVudCk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG51bGwgIT0gbm9kZS5fX3ByZWFjdGF0dHJfICYmIG5vZGUuX19wcmVhY3RhdHRyXy5yZWYpIG5vZGUuX19wcmVhY3RhdHRyXy5yZWYobnVsbCk7XG4gICAgICAgICAgICBpZiAodW5tb3VudE9ubHkgPT09ICExIHx8IG51bGwgPT0gbm9kZS5fX3ByZWFjdGF0dHJfKSByZW1vdmVOb2RlKG5vZGUpO1xuICAgICAgICAgICAgcmVtb3ZlQ2hpbGRyZW4obm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBub2RlID0gbm9kZS5sYXN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgICAgICB2YXIgbmV4dCA9IG5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUobm9kZSwgITApO1xuICAgICAgICAgICAgbm9kZSA9IG5leHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZkF0dHJpYnV0ZXMoZG9tLCBhdHRycywgb2xkKSB7XG4gICAgICAgIHZhciBuYW1lO1xuICAgICAgICBmb3IgKG5hbWUgaW4gb2xkKSBpZiAoKCFhdHRycyB8fCBudWxsID09IGF0dHJzW25hbWVdKSAmJiBudWxsICE9IG9sZFtuYW1lXSkgc2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBvbGRbbmFtZV0sIG9sZFtuYW1lXSA9IHZvaWQgMCwgaXNTdmdNb2RlKTtcbiAgICAgICAgZm9yIChuYW1lIGluIGF0dHJzKSBpZiAoISgnY2hpbGRyZW4nID09PSBuYW1lIHx8ICdpbm5lckhUTUwnID09PSBuYW1lIHx8IG5hbWUgaW4gb2xkICYmIGF0dHJzW25hbWVdID09PSAoJ3ZhbHVlJyA9PT0gbmFtZSB8fCAnY2hlY2tlZCcgPT09IG5hbWUgPyBkb21bbmFtZV0gOiBvbGRbbmFtZV0pKSkgc2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBvbGRbbmFtZV0sIG9sZFtuYW1lXSA9IGF0dHJzW25hbWVdLCBpc1N2Z01vZGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb2xsZWN0Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICB2YXIgbmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAoY29tcG9uZW50c1tuYW1lXSB8fCAoY29tcG9uZW50c1tuYW1lXSA9IFtdKSkucHVzaChjb21wb25lbnQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoQ3RvciwgcHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGluc3QsIGxpc3QgPSBjb21wb25lbnRzW0N0b3IubmFtZV07XG4gICAgICAgIGlmIChDdG9yLnByb3RvdHlwZSAmJiBDdG9yLnByb3RvdHlwZS5yZW5kZXIpIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgQ3Rvcihwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBDb21wb25lbnQuY2FsbChpbnN0LCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IENvbXBvbmVudChwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpbnN0LmNvbnN0cnVjdG9yID0gQ3RvcjtcbiAgICAgICAgICAgIGluc3QucmVuZGVyID0gZG9SZW5kZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpc3QpIGZvciAodmFyIGkgPSBsaXN0Lmxlbmd0aDsgaS0tOyApIGlmIChsaXN0W2ldLmNvbnN0cnVjdG9yID09PSBDdG9yKSB7XG4gICAgICAgICAgICBpbnN0Ll9fYiA9IGxpc3RbaV0uX19iO1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZG9SZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0Q29tcG9uZW50UHJvcHMoY29tcG9uZW50LCBwcm9wcywgb3B0cywgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX194KSB7XG4gICAgICAgICAgICBjb21wb25lbnQuX194ID0gITA7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fciA9IHByb3BzLnJlZikgZGVsZXRlIHByb3BzLnJlZjtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19rID0gcHJvcHMua2V5KSBkZWxldGUgcHJvcHMua2V5O1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuYmFzZSB8fCBtb3VudEFsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKSBjb21wb25lbnQuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0ICE9PSBjb21wb25lbnQuY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50Ll9fYykgY29tcG9uZW50Ll9fYyA9IGNvbXBvbmVudC5jb250ZXh0O1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY29tcG9uZW50Ll9fcCkgY29tcG9uZW50Ll9fcCA9IGNvbXBvbmVudC5wcm9wcztcbiAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9feCA9ICExO1xuICAgICAgICAgICAgaWYgKDAgIT09IG9wdHMpIGlmICgxID09PSBvcHRzIHx8IG9wdGlvbnMuc3luY0NvbXBvbmVudFVwZGF0ZXMgIT09ICExIHx8ICFjb21wb25lbnQuYmFzZSkgcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCwgMSwgbW91bnRBbGwpOyBlbHNlIGVucXVldWVSZW5kZXIoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19yKSBjb21wb25lbnQuX19yKGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCwgb3B0cywgbW91bnRBbGwsIGlzQ2hpbGQpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX194KSB7XG4gICAgICAgICAgICB2YXIgcmVuZGVyZWQsIGluc3QsIGNiYXNlLCBwcm9wcyA9IGNvbXBvbmVudC5wcm9wcywgc3RhdGUgPSBjb21wb25lbnQuc3RhdGUsIGNvbnRleHQgPSBjb21wb25lbnQuY29udGV4dCwgcHJldmlvdXNQcm9wcyA9IGNvbXBvbmVudC5fX3AgfHwgcHJvcHMsIHByZXZpb3VzU3RhdGUgPSBjb21wb25lbnQuX19zIHx8IHN0YXRlLCBwcmV2aW91c0NvbnRleHQgPSBjb21wb25lbnQuX19jIHx8IGNvbnRleHQsIGlzVXBkYXRlID0gY29tcG9uZW50LmJhc2UsIG5leHRCYXNlID0gY29tcG9uZW50Ll9fYiwgaW5pdGlhbEJhc2UgPSBpc1VwZGF0ZSB8fCBuZXh0QmFzZSwgaW5pdGlhbENoaWxkQ29tcG9uZW50ID0gY29tcG9uZW50Ll9jb21wb25lbnQsIHNraXAgPSAhMTtcbiAgICAgICAgICAgIGlmIChpc1VwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByZXZpb3VzUHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gcHJldmlvdXNTdGF0ZTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IHByZXZpb3VzQ29udGV4dDtcbiAgICAgICAgICAgICAgICBpZiAoMiAhPT0gb3B0cyAmJiBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlICYmIGNvbXBvbmVudC5zaG91bGRDb21wb25lbnRVcGRhdGUocHJvcHMsIHN0YXRlLCBjb250ZXh0KSA9PT0gITEpIHNraXAgPSAhMDsgZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50Ll9fcCA9IGNvbXBvbmVudC5fX3MgPSBjb21wb25lbnQuX19jID0gY29tcG9uZW50Ll9fYiA9IG51bGw7XG4gICAgICAgICAgICBjb21wb25lbnQuX19kID0gITE7XG4gICAgICAgICAgICBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICByZW5kZXJlZCA9IGNvbXBvbmVudC5yZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmdldENoaWxkQ29udGV4dCkgY29udGV4dCA9IGV4dGVuZChleHRlbmQoe30sIGNvbnRleHQpLCBjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkpO1xuICAgICAgICAgICAgICAgIHZhciB0b1VubW91bnQsIGJhc2UsIGNoaWxkQ29tcG9uZW50ID0gcmVuZGVyZWQgJiYgcmVuZGVyZWQubm9kZU5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZFByb3BzID0gZ2V0Tm9kZVByb3BzKHJlbmRlcmVkKTtcbiAgICAgICAgICAgICAgICAgICAgaW5zdCA9IGluaXRpYWxDaGlsZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluc3QgJiYgaW5zdC5jb25zdHJ1Y3RvciA9PT0gY2hpbGRDb21wb25lbnQgJiYgY2hpbGRQcm9wcy5rZXkgPT0gaW5zdC5fX2spIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDEsIGNvbnRleHQsICExKTsgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbnN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Ll9jb21wb25lbnQgPSBpbnN0ID0gY3JlYXRlQ29tcG9uZW50KGNoaWxkQ29tcG9uZW50LCBjaGlsZFByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QuX19iID0gaW5zdC5fX2IgfHwgbmV4dEJhc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fdSA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDAsIGNvbnRleHQsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBvbmVudChpbnN0LCAxLCBtb3VudEFsbCwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJhc2UgPSBpbnN0LmJhc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2Jhc2UgPSBpbml0aWFsQmFzZTtcbiAgICAgICAgICAgICAgICAgICAgdG9Vbm1vdW50ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9Vbm1vdW50KSBjYmFzZSA9IGNvbXBvbmVudC5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxCYXNlIHx8IDEgPT09IG9wdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYmFzZSkgY2Jhc2UuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlID0gZGlmZihjYmFzZSwgcmVuZGVyZWQsIGNvbnRleHQsIG1vdW50QWxsIHx8ICFpc1VwZGF0ZSwgaW5pdGlhbEJhc2UgJiYgaW5pdGlhbEJhc2UucGFyZW50Tm9kZSwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbml0aWFsQmFzZSAmJiBiYXNlICE9PSBpbml0aWFsQmFzZSAmJiBpbnN0ICE9PSBpbml0aWFsQ2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJhc2VQYXJlbnQgPSBpbml0aWFsQmFzZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZVBhcmVudCAmJiBiYXNlICE9PSBiYXNlUGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlUGFyZW50LnJlcGxhY2VDaGlsZChiYXNlLCBpbml0aWFsQmFzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRvVW5tb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxCYXNlLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGluaXRpYWxCYXNlLCAhMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgdW5tb3VudENvbXBvbmVudCh0b1VubW91bnQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5iYXNlID0gYmFzZTtcbiAgICAgICAgICAgICAgICBpZiAoYmFzZSAmJiAhaXNDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50UmVmID0gY29tcG9uZW50LCB0ID0gY29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodCA9IHQuX191KSAoY29tcG9uZW50UmVmID0gdCkuYmFzZSA9IGJhc2U7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UuX2NvbXBvbmVudCA9IGNvbXBvbmVudFJlZjtcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPSBjb21wb25lbnRSZWYuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1VwZGF0ZSB8fCBtb3VudEFsbCkgbW91bnRzLnVuc2hpZnQoY29tcG9uZW50KTsgZWxzZSBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICBmbHVzaE1vdW50cygpO1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50RGlkVXBkYXRlKSBjb21wb25lbnQuY29tcG9uZW50RGlkVXBkYXRlKHByZXZpb3VzUHJvcHMsIHByZXZpb3VzU3RhdGUsIHByZXZpb3VzQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWZ0ZXJVcGRhdGUpIG9wdGlvbnMuYWZ0ZXJVcGRhdGUoY29tcG9uZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChudWxsICE9IGNvbXBvbmVudC5fX2gpIHdoaWxlIChjb21wb25lbnQuX19oLmxlbmd0aCkgY29tcG9uZW50Ll9faC5wb3AoKS5jYWxsKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoIWRpZmZMZXZlbCAmJiAhaXNDaGlsZCkgZmx1c2hNb3VudHMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgICAgICB2YXIgYyA9IGRvbSAmJiBkb20uX2NvbXBvbmVudCwgb3JpZ2luYWxDb21wb25lbnQgPSBjLCBvbGREb20gPSBkb20sIGlzRGlyZWN0T3duZXIgPSBjICYmIGRvbS5fY29tcG9uZW50Q29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lLCBpc093bmVyID0gaXNEaXJlY3RPd25lciwgcHJvcHMgPSBnZXROb2RlUHJvcHModm5vZGUpO1xuICAgICAgICB3aGlsZSAoYyAmJiAhaXNPd25lciAmJiAoYyA9IGMuX191KSkgaXNPd25lciA9IGMuY29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lO1xuICAgICAgICBpZiAoYyAmJiBpc093bmVyICYmICghbW91bnRBbGwgfHwgYy5fY29tcG9uZW50KSkge1xuICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoYywgcHJvcHMsIDMsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGRvbSA9IGMuYmFzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChvcmlnaW5hbENvbXBvbmVudCAmJiAhaXNEaXJlY3RPd25lcikge1xuICAgICAgICAgICAgICAgIHVubW91bnRDb21wb25lbnQob3JpZ2luYWxDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIGRvbSA9IG9sZERvbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjID0gY3JlYXRlQ29tcG9uZW50KHZub2RlLm5vZGVOYW1lLCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoZG9tICYmICFjLl9fYikge1xuICAgICAgICAgICAgICAgIGMuX19iID0gZG9tO1xuICAgICAgICAgICAgICAgIG9sZERvbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhjLCBwcm9wcywgMSwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZG9tID0gYy5iYXNlO1xuICAgICAgICAgICAgaWYgKG9sZERvbSAmJiBkb20gIT09IG9sZERvbSkge1xuICAgICAgICAgICAgICAgIG9sZERvbS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShvbGREb20sICExKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZG9tO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1bm1vdW50Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICBpZiAob3B0aW9ucy5iZWZvcmVVbm1vdW50KSBvcHRpb25zLmJlZm9yZVVubW91bnQoY29tcG9uZW50KTtcbiAgICAgICAgdmFyIGJhc2UgPSBjb21wb25lbnQuYmFzZTtcbiAgICAgICAgY29tcG9uZW50Ll9feCA9ICEwO1xuICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcbiAgICAgICAgY29tcG9uZW50LmJhc2UgPSBudWxsO1xuICAgICAgICB2YXIgaW5uZXIgPSBjb21wb25lbnQuX2NvbXBvbmVudDtcbiAgICAgICAgaWYgKGlubmVyKSB1bm1vdW50Q29tcG9uZW50KGlubmVyKTsgZWxzZSBpZiAoYmFzZSkge1xuICAgICAgICAgICAgaWYgKGJhc2UuX19wcmVhY3RhdHRyXyAmJiBiYXNlLl9fcHJlYWN0YXR0cl8ucmVmKSBiYXNlLl9fcHJlYWN0YXR0cl8ucmVmKG51bGwpO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9fYiA9IGJhc2U7XG4gICAgICAgICAgICByZW1vdmVOb2RlKGJhc2UpO1xuICAgICAgICAgICAgY29sbGVjdENvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgcmVtb3ZlQ2hpbGRyZW4oYmFzZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBvbmVudC5fX3IpIGNvbXBvbmVudC5fX3IobnVsbCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIENvbXBvbmVudChwcm9wcywgY29udGV4dCkge1xuICAgICAgICB0aGlzLl9fZCA9ICEwO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgIH1cbiAgICBmdW5jdGlvbiByZW5kZXIodm5vZGUsIHBhcmVudCwgbWVyZ2UpIHtcbiAgICAgICAgcmV0dXJuIGRpZmYobWVyZ2UsIHZub2RlLCB7fSwgITEsIHBhcmVudCwgITEpO1xuICAgIH1cbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBzdGFjayA9IFtdO1xuICAgIHZhciBFTVBUWV9DSElMRFJFTiA9IFtdO1xuICAgIHZhciBJU19OT05fRElNRU5TSU9OQUwgPSAvYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB2YXIgbW91bnRzID0gW107XG4gICAgdmFyIGRpZmZMZXZlbCA9IDA7XG4gICAgdmFyIGlzU3ZnTW9kZSA9ICExO1xuICAgIHZhciBoeWRyYXRpbmcgPSAhMTtcbiAgICB2YXIgY29tcG9uZW50cyA9IHt9O1xuICAgIGV4dGVuZChDb21wb25lbnQucHJvdG90eXBlLCB7XG4gICAgICAgIHNldFN0YXRlOiBmdW5jdGlvbihzdGF0ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBzID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fX3MpIHRoaXMuX19zID0gZXh0ZW5kKHt9LCBzKTtcbiAgICAgICAgICAgIGV4dGVuZChzLCAnZnVuY3Rpb24nID09IHR5cGVvZiBzdGF0ZSA/IHN0YXRlKHMsIHRoaXMucHJvcHMpIDogc3RhdGUpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSAodGhpcy5fX2ggPSB0aGlzLl9faCB8fCBbXSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICBlbnF1ZXVlUmVuZGVyKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgKHRoaXMuX19oID0gdGhpcy5fX2ggfHwgW10pLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmVuZGVyQ29tcG9uZW50KHRoaXMsIDIpO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgcHJlYWN0ID0ge1xuICAgICAgICBoOiBoLFxuICAgICAgICBjcmVhdGVFbGVtZW50OiBoLFxuICAgICAgICBjbG9uZUVsZW1lbnQ6IGNsb25lRWxlbWVudCxcbiAgICAgICAgQ29tcG9uZW50OiBDb21wb25lbnQsXG4gICAgICAgIHJlbmRlcjogcmVuZGVyLFxuICAgICAgICByZXJlbmRlcjogcmVyZW5kZXIsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9O1xuICAgIGlmICgndW5kZWZpbmVkJyAhPSB0eXBlb2YgbW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IHByZWFjdDsgZWxzZSBzZWxmLnByZWFjdCA9IHByZWFjdDtcbn0oKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5qcy5tYXAiXX0=
