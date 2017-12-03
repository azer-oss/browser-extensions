(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=[
  {
    key: "oneClickLike",
    title: "One-click bookmarking",
    desc: "Heart button will immediately bookmark when clicked.",
    defaultValue: true,
    popup: true
  },
  {
    key: "minimalMode",
    title: "Enable Minimal Mode",
    desc: "Hide majority of the interface until user focuses.",
    defaultValue: false,
    newtab: true
  },
  {
    key: "showWallpaper",
    title: "Show Wallpaper",
    desc: "Get a new beautiful photo in your new tab every day.",
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

      if (msg.content && msg.content.ping) {
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

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require('./rows');

var _rows2 = _interopRequireDefault(_rows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BookmarkSearch = function (_Rows) {
  _inherits(BookmarkSearch, _Rows);

  function BookmarkSearch(results, sort) {
    _classCallCheck(this, BookmarkSearch);

    var _this = _possibleConstructorReturn(this, (BookmarkSearch.__proto__ || Object.getPrototypeOf(BookmarkSearch)).call(this, results, sort));

    _this.name = 'bookmark-search';
    _this.title = 'Liked in Kozmos';
    return _this;
  }

  _createClass(BookmarkSearch, [{
    key: 'fail',
    value: function fail(error) {
      console.error(error);
    }
  }, {
    key: 'update',
    value: function update(query) {
      var _this2 = this;

      if (!query || query.indexOf('tag:') === 0 && query.length > 4) return this.add([]);

      var oquery = query || this.results.props.query;

      this.results.messages.send({ task: 'search-bookmarks', query: query }, function (resp) {
        if (oquery !== _this2.results.props.query.trim()) {
          return;
        }

        if (resp.error) return _this2.fail(resp.error);

        _this2.add(resp.content.results.likes);
      });
    }
  }]);

  return BookmarkSearch;
}(_rows2.default);

exports.default = BookmarkSearch;

},{"./rows":15}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require('./rows');

var _rows2 = _interopRequireDefault(_rows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListBookmarksByTag = function (_Rows) {
  _inherits(ListBookmarksByTag, _Rows);

  function ListBookmarksByTag(results, sort) {
    _classCallCheck(this, ListBookmarksByTag);

    var _this = _possibleConstructorReturn(this, (ListBookmarksByTag.__proto__ || Object.getPrototypeOf(ListBookmarksByTag)).call(this, results, sort));

    _this.name = 'bookmarks-by-tag';
    _this.title = function (query) {
      return 'Tagged with ' + query.slice(4) + ' On Kozmos';
    };
    return _this;
  }

  _createClass(ListBookmarksByTag, [{
    key: 'update',
    value: function update(query) {
      var _this2 = this;

      if (!query || query.indexOf('tag:') !== 0 || query.length < 5) return this.add([]);

      var oquery = query || this.results.props.query;

      this.results.messages.send({ task: 'search-bookmarks', query: query }, function (resp) {
        if (oquery !== _this2.results.props.query.trim()) {
          return;
        }

        if (resp.error) return _this2.fail(resp.error);

        _this2.add(resp.content.results.likes);
      });
    }
  }]);

  return ListBookmarksByTag;
}(_rows2.default);

exports.default = ListBookmarksByTag;

},{"./rows":15}],5:[function(require,module,exports){
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
            { className: "content " + (this.props.focused ? "focused" : "") },
            this.props.children
          )
        )
      );
    }
  }]);

  return Content;
}(_preact.Component);

exports.default = Content;

},{"preact":30}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require('./rows');

var _rows2 = _interopRequireDefault(_rows);

var _urlImage = require('./url-image');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var History = function (_Rows) {
  _inherits(History, _Rows);

  function History(results, sort) {
    _classCallCheck(this, History);

    var _this = _possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).call(this, results, sort));

    _this.name = 'history';
    _this.title = 'Previously Visited';
    return _this;
  }

  _createClass(History, [{
    key: 'update',
    value: function update(query) {
      var _this2 = this;

      if (!query) return this.add([]);

      chrome.history.search({ text: query }, function (history) {
        _this2.add(history.filter(filterOutSearch));
      });
    }
  }]);

  return History;
}(_rows2.default);

exports.default = History;


function filterOutSearch(row) {
  return (0, _urlImage.findHostname)(row.url).split('.')[0] !== 'google' && !/search\/?\?q\=\w*/.test(row.url) && !/facebook\.com\/search/.test(row.url) && !/twitter\.com\/search/.test(row.url) && (0, _urlImage.findHostname)(row.url) !== 't.co';
}

},{"./rows":15,"./url-image":23}],7:[function(require,module,exports){
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
  }]);

  return Icon;
}(_preact.Component);

exports.default = Icon;

},{"preact":30}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Logo = function (_Component) {
  _inherits(Logo, _Component);

  function Logo() {
    _classCallCheck(this, Logo);

    return _possibleConstructorReturn(this, (Logo.__proto__ || Object.getPrototypeOf(Logo)).apply(this, arguments));
  }

  _createClass(Logo, [{
    key: "render",
    value: function render() {
      return (0, _preact.h)(
        "a",
        { className: "logo", href: "https://getkozmos.com" },
        (0, _preact.h)("img", { src: chrome.extension.getURL("images/icon128.png"), title: "Open Kozmos" })
      );
    }
  }]);

  return Logo;
}(_preact.Component);

exports.default = Logo;

},{"preact":30}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

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
            (0, _preact.h)(Button, {
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
            (0, _preact.h)(Button, {
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
            (0, _preact.h)(Button, {
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

},{"preact":30}],10:[function(require,module,exports){
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

},{"../lib/messaging":2}],11:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _wallpaper = require("./wallpaper");

var _wallpaper2 = _interopRequireDefault(_wallpaper);

var _menu = require("./menu");

var _menu2 = _interopRequireDefault(_menu);

var _search = require("./search");

var _search2 = _interopRequireDefault(_search);

var _logo = require("./logo");

var _logo2 = _interopRequireDefault(_logo);

var _messaging = require("./messaging");

var _messaging2 = _interopRequireDefault(_messaging);

var _settings = require("./settings");

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewTab = function (_Component) {
  _inherits(NewTab, _Component);

  function NewTab(props) {
    _classCallCheck(this, NewTab);

    var _this = _possibleConstructorReturn(this, (NewTab.__proto__ || Object.getPrototypeOf(NewTab)).call(this, props));

    _this.messages = new _messaging2.default();

    _this.loadSettings();
    _this.checkIfDisabled();
    return _this;
  }

  _createClass(NewTab, [{
    key: "loadSettings",
    value: function loadSettings(avoidCache) {
      this.loadSetting('minimalMode', avoidCache);
      this.loadSetting('showWallpaper', avoidCache);
    }
  }, {
    key: "checkIfDisabled",
    value: function checkIfDisabled() {
      var _this2 = this;

      if (localStorage['is-disabled'] == '1') {
        this.showDefaultNewTab();
      }

      this.messages.send({ task: 'get-settings-value', key: 'enableNewTab' }, function (resp) {
        if (resp.error) {
          return _this2.setState({ error: resp.error });
        }

        if (!resp.content.value) {
          localStorage['is-disabled'] = "1";
          _this2.showDefaultNewTab();
        } else {
          localStorage['is-disabled'] = "";
        }
      });
    }
  }, {
    key: "loadSetting",
    value: function loadSetting(key, avoidCache) {
      var _this3 = this;

      if (!avoidCache && localStorage['settings-cache-' + key]) {
        try {
          this.applySetting(key, JSON.parse(localStorage['settings-cache-' + key]));
        } catch (e) {}
      }

      this.messages.send({ task: 'get-settings-value', key: key }, function (resp) {
        if (!resp.error) {
          localStorage['settings-cache-' + key] = JSON.stringify(resp.content.value);
          _this3.applySetting(key, resp.content.value);
        }
      });
    }
  }, {
    key: "applySetting",
    value: function applySetting(key, value) {
      var u = {};
      u[key] = value;
      this.setState(u);
    }
  }, {
    key: "showDefaultNewTab",
    value: function showDefaultNewTab() {
      if (this.state.disabled) return;

      this.setState({
        newTabURL: document.location.href,
        disabled: true
      });

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var active = tabs[0].id;

        chrome.tabs.update(active, {
          url: "chrome-search://local-ntp/local-ntp.html"
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      if (this.state.disabled) return;

      return (0, _preact.h)(
        "div",
        { className: "newtab " + (this.state.showWallpaper ? "has-wallpaper" : "") + " " + (this.state.minimalMode ? "minimal" : "") },
        this.state.minimalMode ? null : (0, _preact.h)(_logo2.default, null),
        (0, _preact.h)(_settings2.default, { onChange: function onChange() {
            return _this4.loadSettings(true);
          }, messages: this.messages, type: "newtab" }),
        (0, _preact.h)(_search2.default, { settings: this.settings }),
        this.state.showWallpaper ? (0, _preact.h)(_wallpaper2.default, { messages: this.messages }) : null
      );
    }
  }]);

  return NewTab;
}(_preact.Component);

(0, _preact.render)((0, _preact.h)(NewTab, null), document.body);

},{"./logo":8,"./menu":9,"./messaging":10,"./search":17,"./settings":18,"./wallpaper":24,"preact":30}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require("./rows");

var _rows2 = _interopRequireDefault(_rows);

var _titleFromUrl = require("title-from-url");

var _titleFromUrl2 = _interopRequireDefault(_titleFromUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QuerySuggestions = function (_Rows) {
  _inherits(QuerySuggestions, _Rows);

  function QuerySuggestions(results, sort) {
    _classCallCheck(this, QuerySuggestions);

    var _this = _possibleConstructorReturn(this, (QuerySuggestions.__proto__ || Object.getPrototypeOf(QuerySuggestions)).call(this, results, sort));

    _this.name = 'query-suggestions';
    return _this;
  }

  _createClass(QuerySuggestions, [{
    key: "createURLSuggestions",
    value: function createURLSuggestions(query) {
      if (!isURL(query)) return [];

      var url = /\w+:\/\//.test(query) ? query : 'http://' + query;

      return [{
        title: "Open \"" + (0, _titleFromUrl2.default)(query) + "\"",
        type: 'query-suggestion',
        url: url
      }];
    }
  }, {
    key: "createSearchSuggestions",
    value: function createSearchSuggestions(query) {
      if (isURL(query)) return [];
      if (query.indexOf('tag:') === 0 && query.length > 4) return [{
        url: 'https://getkozmos.com/tag/' + encodeURI(query.slice(4)),
        query: query,
        title: "Open \"" + query.slice(4) + "\" tag in Kozmos",
        type: 'search-query'
      }];

      return [{
        url: 'https://google.com/search?q=' + encodeURI(query),
        query: query,
        title: "Search \"" + query + "\" on Google",
        type: 'search-query'
      }, {
        url: 'https://getkozmos.com/search?q=' + encodeURI(query),
        query: query,
        title: "Search \"" + query + "\" on Kozmos",
        type: 'search-query'
      }];
    }
  }, {
    key: "update",
    value: function update(query) {
      if (!query) return this.add([]);
      this.add(this.createURLSuggestions(query).concat(this.createSearchSuggestions(query)));
    }
  }]);

  return QuerySuggestions;
}(_rows2.default);

exports.default = QuerySuggestions;


function isURL(query) {
  return query.trim().indexOf('.') > 0 && query.indexOf(' ') === -1;
}

},{"./rows":15,"title-from-url":40}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require('./rows');

var _rows2 = _interopRequireDefault(_rows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RecentBookmarks = function (_Rows) {
  _inherits(RecentBookmarks, _Rows);

  function RecentBookmarks(results, sort) {
    _classCallCheck(this, RecentBookmarks);

    var _this = _possibleConstructorReturn(this, (RecentBookmarks.__proto__ || Object.getPrototypeOf(RecentBookmarks)).call(this, results, sort));

    _this.name = 'recent-bookmarks';
    _this.title = 'Recently Liked in Kozmos';
    return _this;
  }

  _createClass(RecentBookmarks, [{
    key: 'update',
    value: function update(query) {
      var _this2 = this;

      if (query.length > 0) return this.add([]);

      this.results.messages.send({ task: 'get-recent-bookmarks', query: query }, function (resp) {
        if (resp.error) return _this2.fail(resp.error);

        _this2.add(resp.content.results.likes);
      });
    }
  }]);

  return RecentBookmarks;
}(_rows2.default);

exports.default = RecentBookmarks;

},{"./rows":15}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _debounceFn = require("debounce-fn");

var _debounceFn2 = _interopRequireDefault(_debounceFn);

var _topSites = require("./top-sites");

var _topSites2 = _interopRequireDefault(_topSites);

var _recentBookmarks = require("./recent-bookmarks");

var _recentBookmarks2 = _interopRequireDefault(_recentBookmarks);

var _querySuggestions = require("./query-suggestions");

var _querySuggestions2 = _interopRequireDefault(_querySuggestions);

var _bookmarkSearch = require("./bookmark-search");

var _bookmarkSearch2 = _interopRequireDefault(_bookmarkSearch);

var _history = require("./history");

var _history2 = _interopRequireDefault(_history);

var _bookmarkTags = require("./bookmark-tags");

var _bookmarkTags2 = _interopRequireDefault(_bookmarkTags);

var _sidebar = require("./sidebar");

var _sidebar2 = _interopRequireDefault(_sidebar);

var _messaging = require("./messaging");

var _messaging2 = _interopRequireDefault(_messaging);

var _urlIcon = require("./url-icon");

var _urlIcon2 = _interopRequireDefault(_urlIcon);

var _icon = require("./icon");

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MAX_ITEMS = 5;

var Results = function (_Component) {
  _inherits(Results, _Component);

  function Results(props) {
    _classCallCheck(this, Results);

    var _this = _possibleConstructorReturn(this, (Results.__proto__ || Object.getPrototypeOf(Results)).call(this, props));

    _this.messages = new _messaging2.default();

    _this.categories = [new _querySuggestions2.default(_this, 1), new _topSites2.default(_this, 2), new _recentBookmarks2.default(_this, 3), new _bookmarkTags2.default(_this, 4), new _bookmarkSearch2.default(_this, 5), new _history2.default(_this, 6)];

    _this._onKeyPress = (0, _debounceFn2.default)(_this.onKeyPress.bind(_this), 50);
    _this.update(props.query || "");
    return _this;
  }

  _createClass(Results, [{
    key: "addRows",
    value: function addRows(category, rows) {
      var _this2 = this;

      if (rows.length === 0) return;

      var urlMap = {};
      var i = this.state.content.length;
      while (i--) {
        urlMap[this.state.content[i].url] = true;
      }

      var content = this.state.content.concat(rows.filter(function (r) {
        return !urlMap[r.url];
      }).slice(0, this.max()).map(function (r, i) {
        r.category = category;
        r.index = _this2.state.content.length + i;
        return r;
      }));

      this.setState({
        content: content
      });
    }
  }, {
    key: "content",
    value: function content() {
      var content = this.state.content;
      content.sort(function (a, b) {
        if (a.category.sort < b.category.sort) return -1;
        if (a.category.sort > b.category.sort) return 1;

        if (a.index < b.index) return -1;
        if (a.index > b.index) return 1;

        return 0;
      });

      return content.map(function (row, index) {
        return {
          url: row.url,
          title: row.title,
          images: row.images,
          type: row.category.name,
          category: row.category,
          absIndex: index,
          index: index
        };
      });
    }
  }, {
    key: "contentByCategory",
    value: function contentByCategory() {
      if (this.state.content.length === 0) return [];

      var content = this.content();
      var selectedCategory = this.state.selected ? content[this.state.selected].category : content[0].category;
      var categories = [];
      var categoriesMap = {};

      var tabIndex = 2;
      var category = null;
      content.forEach(function (row, ind) {
        if (!category || category.name !== row.category.name) {
          category = row.category;
          categoriesMap[category.name] = {
            title: category.title,
            name: category.name,
            sort: category.sort,
            collapsed: content.length > MAX_ITEMS && selectedCategory.name != category.name && category.title,
            rows: []
          };

          categories.push(categoriesMap[category.name]);

          row.tabIndex = ++tabIndex;
        }

        categoriesMap[category.name].rows.push(row);
      });

      return categories;
    }
  }, {
    key: "max",
    value: function max() {
      var len = this.state.content.length;
      var i = -1;
      while (++i < len) {
        if (this.state.content[i].category.name !== 'query-suggestions') {
          break;
        }
      }

      return this.props.query ? MAX_ITEMS - i : MAX_ITEMS;
    }
  }, {
    key: "reset",
    value: function reset(query) {
      this.setState({
        selected: 0,
        content: [],
        errors: [],
        query: query || ''
      });
    }
  }, {
    key: "update",
    value: function update(query) {
      query = query.trim();

      this.reset();
      this.categories.forEach(function (c) {
        return c.update(query);
      });
    }
  }, {
    key: "select",
    value: function select(index) {
      this.setState({
        selected: index
      });
    }
  }, {
    key: "selectNext",
    value: function selectNext() {
      this.setState({
        selected: (this.state.selected + 1) % this.state.content.length
      });
    }
  }, {
    key: "selectPrevious",
    value: function selectPrevious() {
      this.setState({
        selected: this.state.selected == 0 ? this.state.content.length - 1 : this.state.selected - 1
      });
    }
  }, {
    key: "selectNextCategory",
    value: function selectNextCategory() {
      var currentCategory = this.state.content[this.state.selected].category;

      var len = this.state.content.length;
      var i = this.state.selected;
      while (++i < len) {
        if (this.state.content[i].category.sort !== currentCategory.sort) {
          this.select(i);
          return;
        }
      }

      if (this.state.content[0].category.sort !== currentCategory.sort) {
        this.select(0);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (nextProps.query !== this.props.query) {
        return true;
      }

      if (nextState.content.length !== this.state.content.length) {
        return true;
      }

      if (nextState.selected !== this.state.selected) {
        return true;
      }

      return false;
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      window.addEventListener('keyup', this._onKeyPress, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('keyup', this._onKeyPress, false);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      if (props.query !== this.props.query) {
        this.update(props.query || "");
      }
    }
  }, {
    key: "navigateTo",
    value: function navigateTo(url) {
      if (!/^\w+:\/\//.test(url)) {
        url = 'http://' + url;
      }

      document.location.href = url;
    }
  }, {
    key: "onKeyPress",
    value: function onKeyPress(e) {
      if (e.keyCode == 13) {
        // enter
        this.navigateTo(this.state.content[this.state.selected].url);
      } else if (e.keyCode == 40) {
        // down arrow
        this.selectNext();
      } else if (e.keyCode == 38) {
        // up arrow
        this.selectPrevious();
      } else if (e.keyCode == 9) {
        // tab key
        this.selectNextCategory();
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      this.counter = 0;

      return (0, _preact.h)(
        "div",
        { className: "results" },
        (0, _preact.h)(
          "div",
          { className: "results-categories" },
          this.contentByCategory().map(function (category) {
            return _this3.renderCategory(category);
          })
        ),
        (0, _preact.h)(_sidebar2.default, { selected: this.content()[this.state.selected], messages: this.messages, onUpdateTopSites: function onUpdateTopSites() {
            return _this3.onUpdateTopSites();
          }, updateFn: function updateFn() {
            return _this3.update(_this3.props.query || "");
          } }),
        (0, _preact.h)("div", { className: "clear" })
      );
    }
  }, {
    key: "renderCategory",
    value: function renderCategory(c) {
      var _this4 = this;

      var overflow = c.collapsed && this.state.content[this.state.selected].category.sort < c.sort && this.counter < MAX_ITEMS ? c.rows.slice(0, MAX_ITEMS - this.counter) : [];
      var collapsed = c.rows.slice(overflow.length, MAX_ITEMS);

      return (0, _preact.h)(
        "div",
        { className: "category " + (c.collapsed ? "collapsed" : "") },
        this.renderCategoryTitle(c),
        overflow.length > 0 ? (0, _preact.h)(
          "div",
          { className: "category-rows overflow" },
          overflow.map(function (row) {
            return _this4.renderRow(row);
          })
        ) : null,
        collapsed.length > 0 ? (0, _preact.h)(
          "div",
          { className: "category-rows" },
          collapsed.map(function (row) {
            return _this4.renderRow(row);
          })
        ) : null
      );
    }
  }, {
    key: "renderCategoryTitle",
    value: function renderCategoryTitle(c) {
      var _this5 = this;

      if (!c.title) return;

      var title = c.title;
      if (typeof title === 'function') {
        title = c.title(this.props.query);
      }

      return (0, _preact.h)(
        "div",
        { className: "title" },
        (0, _preact.h)(
          "h1",
          { onClick: function onClick() {
              return _this5.select(c.rows[0].absIndex);
            } },
          (0, _preact.h)(_icon2.default, { stroke: "3", name: "rightChevron" }),
          title
        )
      );
    }
  }, {
    key: "renderRow",
    value: function renderRow(row) {
      var _this6 = this;

      this.counter++;

      return (0, _preact.h)(_urlIcon2.default, { content: row, onSelect: function onSelect(r) {
          return _this6.select(r.index);
        }, selected: this.state.selected == row.index });
    }
  }]);

  return Results;
}(_preact.Component);

exports.default = Results;

},{"./bookmark-search":3,"./bookmark-tags":4,"./history":6,"./icon":7,"./messaging":10,"./query-suggestions":12,"./recent-bookmarks":13,"./sidebar":19,"./top-sites":21,"./url-icon":22,"debounce-fn":26,"preact":30}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _urlIcon = require("./url-icon");

var _urlIcon2 = _interopRequireDefault(_urlIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rows = function () {
  function Rows(results, sort) {
    _classCallCheck(this, Rows);

    this.results = results;
    this.sort = sort;
  }

  _createClass(Rows, [{
    key: "add",
    value: function add(rows) {
      this.results.addRows(this, rows);
    }
  }]);

  return Rows;
}();

exports.default = Rows;

},{"./url-icon":22}],16:[function(require,module,exports){
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

var SearchInput = function (_Component) {
  _inherits(SearchInput, _Component);

  function SearchInput(props) {
    _classCallCheck(this, SearchInput);

    var _this = _possibleConstructorReturn(this, (SearchInput.__proto__ || Object.getPrototypeOf(SearchInput)).call(this, props));

    _this._onClick = _this.onClick.bind(_this);
    return _this;
  }

  _createClass(SearchInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.input) {
        this.input.focus();
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextState.value !== this.state.value;
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      window.addEventListener('click', this._onClick);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('click', this._onClick);
    }
  }, {
    key: "onClick",
    value: function onClick(e) {
      if (this.state.value === '' && !document.querySelector('.content-wrapper .content').contains(e.target)) {
        this.props.onBlur();
      }
    }
  }, {
    key: "onQueryChange",
    value: function onQueryChange(value, keyCode) {
      if (keyCode === 13) {
        return this.props.onPressEnter(value);
      }

      if (keyCode === 27) {
        return this.props.onBlur();
      }

      this.setState({ value: value });

      if (this.queryChangeTimer !== undefined) {
        clearTimeout(this.queryChangeTimer);
        this.queryChangeTimer = 0;
      }

      if (this.props.onQueryChange) {
        this.props.onQueryChange(value);
      }
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
      var _this2 = this;

      return (0, _preact.h)(_icon2.default, { name: "search", onclick: function onclick() {
          return _this2.input.focus();
        } });
    }
  }, {
    key: "renderInput",
    value: function renderInput() {
      var _this3 = this;

      return (0, _preact.h)("input", { tabindex: "1",
        ref: function ref(el) {
          return _this3.input = el;
        },
        type: "text",
        className: "input",
        placeholder: "Search or enter website name.",
        onFocus: function onFocus(e) {
          return _this3.props.onFocus();
        },
        onChange: function onChange(e) {
          return _this3.onQueryChange(e.target.value);
        },
        onKeyUp: function onKeyUp(e) {
          return _this3.onQueryChange(e.target.value, e.keyCode);
        },
        value: this.state.value });
    }
  }]);

  return SearchInput;
}(_preact.Component);

exports.default = SearchInput;

},{"./icon":7,"preact":30}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _debounceFn = require("debounce-fn");

var _debounceFn2 = _interopRequireDefault(_debounceFn);

var _content = require("./content");

var _content2 = _interopRequireDefault(_content);

var _searchInput = require("./search-input");

var _searchInput2 = _interopRequireDefault(_searchInput);

var _results = require("./results");

var _results2 = _interopRequireDefault(_results);

var _messaging = require("./messaging");

var _messaging2 = _interopRequireDefault(_messaging);

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

    _this.setState({
      id: 0,
      rows: {},
      rowsAvailable: 5,
      query: '',
      focused: false
    });

    _this._onQueryChange = (0, _debounceFn2.default)(_this.onQueryChange.bind(_this), 50);
    return _this;
  }

  _createClass(Search, [{
    key: "id",
    value: function id() {
      return ++this.state.id;
    }
  }, {
    key: "onFocus",
    value: function onFocus() {
      this.setState({
        focused: true
      });
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      this.setState({
        focused: false
      });
    }
  }, {
    key: "onPressEnter",
    value: function onPressEnter() {
      if (this.state.selected) {
        this.navigateTo(this.state.selected.url);
      }
    }
  }, {
    key: "onSelect",
    value: function onSelect(row) {
      if (this.state.selected && this.state.selected.id === row.id) return;

      this.setState({
        selected: row
      });
    }
  }, {
    key: "onQueryChange",
    value: function onQueryChange(query) {
      query = query.trim();

      if (query === this.state.query) return;

      this.setState({
        rows: {},
        rowsAvailable: 5,
        selected: null,
        id: 0,
        query: query
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return (0, _preact.h)(
        _content2.default,
        { wallpaper: this.props.wallpaper, focused: this.state.focused },
        (0, _preact.h)(
          "div",
          { className: "content-inner" },
          (0, _preact.h)(_searchInput2.default, { onPressEnter: function onPressEnter() {
              return _this2.onPressEnter();
            },
            onQueryChange: this._onQueryChange,
            onFocus: function onFocus() {
              return _this2.onFocus();
            },
            onBlur: function onBlur() {
              return _this2.onBlur();
            } }),
          (0, _preact.h)(_results2.default, { focused: this.state.focused, query: this.state.query }),
          (0, _preact.h)("div", { className: "clear" })
        )
      );
    }
  }, {
    key: "renderResults",
    value: function renderResults() {
      return (0, _preact.h)(
        "div",
        { className: "results" },
        (0, _preact.h)("div", { className: "results-rows" }),
        (0, _preact.h)("div", { className: "clear" })
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

},{"./content":5,"./messaging":10,"./results":14,"./search-input":16,"debounce-fn":26,"preact":30}],18:[function(require,module,exports){
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
          "Customize your new tab made by ",
          (0, _preact.h)(
            "a",
            { href: "https://getkozmos.com" },
            "Kozmos"
          ),
          "."
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

},{"../chrome/settings-sections":1,"./icon":7,"preact":30}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _urls = require("urls");

var _relativeDate = require("relative-date");

var _relativeDate2 = _interopRequireDefault(_relativeDate);

var _icon = require("./icon");

var _icon2 = _interopRequireDefault(_icon);

var _urlImage = require("./url-image");

var _urlImage2 = _interopRequireDefault(_urlImage);

var _topSites = require("./top-sites");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sidebar = function (_Component) {
  _inherits(Sidebar, _Component);

  function Sidebar() {
    _classCallCheck(this, Sidebar);

    return _possibleConstructorReturn(this, (Sidebar.__proto__ || Object.getPrototypeOf(Sidebar)).apply(this, arguments));
  }

  _createClass(Sidebar, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      var _this2 = this;

      if (!props.selected) return;
      props.messages.send({ task: 'get-like', url: props.selected.url }, function (resp) {
        _this2.setState({
          like: resp.content.like
        });
      });
    }
  }, {
    key: "deleteTopSite",
    value: function deleteTopSite() {
      (0, _topSites.hide)(this.props.selected.url);
      this.props.updateFn();
    }
  }, {
    key: "toggleLike",
    value: function toggleLike() {
      if (this.state.like) this.unlike();else this.like();
    }
  }, {
    key: "like",
    value: function like() {
      var _this3 = this;

      this.props.messages.send({ task: 'like', url: this.props.selected.url }, function (resp) {
        _this3.setState({
          like: resp.content.like
        });
      });
    }
  }, {
    key: "unlike",
    value: function unlike() {
      var _this4 = this;

      this.props.messages.send({ task: 'unlike', url: this.props.selected.url }, function (resp) {
        _this4.setState({
          like: null
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.selected) return;

      return (0, _preact.h)(
        "div",
        { className: "sidebar" },
        (0, _preact.h)(
          "div",
          { className: "image" },
          (0, _preact.h)(
            "a",
            { className: "link", href: this.props.selected.url },
            (0, _preact.h)(_urlImage2.default, { content: this.props.selected }),
            (0, _preact.h)(
              "h1",
              null,
              this.props.selected.title
            ),
            (0, _preact.h)(
              "h2",
              null,
              (0, _urls.clean)(this.props.selected.url)
            )
          ),
          this.renderButtons()
        )
      );
    }
  }, {
    key: "renderButtons",
    value: function renderButtons() {
      return (0, _preact.h)(
        "div",
        { className: "buttons" },
        this.renderLikeButton(),
        this.props.selected.type === 'top' ? this.renderDeleteTopSiteButton() : null
      );
    }
  }, {
    key: "renderLikeButton",
    value: function renderLikeButton() {
      var _this5 = this;

      var ago = this.state.like ? (0, _relativeDate2.default)(this.state.like.likedAt) : "";
      var title = this.state.like ? "Delete It From Your Likes" : "Add It To Your Likes";

      return (0, _preact.h)(
        "div",
        { title: title, className: "button like-button " + (this.state.like ? "liked" : ""), onClick: function onClick() {
            return _this5.toggleLike();
          } },
        (0, _preact.h)(_icon2.default, { name: "heart" }),
        this.state.like ? "Liked " + ago : "Like It"
      );
    }
  }, {
    key: "renderDeleteTopSiteButton",
    value: function renderDeleteTopSiteButton() {
      var _this6 = this;

      return (0, _preact.h)(
        "div",
        { title: "Delete It From Frequently Visited", className: "button delete-button", onClick: function onClick() {
            return _this6.deleteTopSite();
          } },
        (0, _preact.h)(_icon2.default, { name: "trash" }),
        "Delete It"
      );
    }
  }]);

  return Sidebar;
}(_preact.Component);

exports.default = Sidebar;

},{"./icon":7,"./top-sites":21,"./url-image":23,"preact":30,"relative-date":37,"urls":46}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValid = isValid;
exports.normalize = normalize;
exports.generateFromURL = generateFromURL;

var _titleFromUrl = require('title-from-url');

var _titleFromUrl2 = _interopRequireDefault(_titleFromUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValid(title) {
  var abslen = title.replace(/[^\w]+/g, '').length;
  return abslen >= 2 && !/^http\w?:\/\//.test(title);
}

function normalize(title) {
  return title.trim().replace(/^\(\d+\)/, '');
}

function generateFromURL(url) {
  return (0, _titleFromUrl2.default)(url);
}

},{"title-from-url":40}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.get = get;
exports.hide = hide;

var _rows = require('./rows');

var _rows2 = _interopRequireDefault(_rows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TopSites = function (_Rows) {
  _inherits(TopSites, _Rows);

  function TopSites(results, sort) {
    _classCallCheck(this, TopSites);

    var _this = _possibleConstructorReturn(this, (TopSites.__proto__ || Object.getPrototypeOf(TopSites)).call(this, results, sort));

    _this.title = 'Frequently Visited';
    _this.name = 'top';
    return _this;
  }

  _createClass(TopSites, [{
    key: 'update',
    value: function update(query) {
      var _this2 = this;

      if (query.length > 0) return this.add([]);
      get(function (rows) {
        return _this2.add(addKozmos(rows.slice(0, 5)));
      });
    }
  }]);

  return TopSites;
}(_rows2.default);

exports.default = TopSites;


function addKozmos(rows) {
  var i = rows.length;
  while (i--) {
    if (rows[i].url.indexOf('getkozmos.com') > -1) {
      return rows;
    }
  }

  rows[4] = {
    url: 'https://getkozmos.com',
    title: 'Kozmos'
  };

  return rows;
}

function get(callback) {
  chrome.topSites.get(function (topSites) {
    callback(filter(topSites));
  });
}

function hide(url) {
  var hidden = getHiddenTopSites();
  hidden[url] = true;
  setHiddenTopSites(hidden);
}

function getHiddenTopSites() {
  var list = {};
  try {
    list = JSON.parse(localStorage['hidden-toplist']);
  } catch (err) {
    setHiddenTopSites(list);
  }

  return list;
}

function setHiddenTopSites(list) {
  localStorage['hidden-toplist'] = JSON.stringify(list);
}

function filter(topSites) {
  var hide = getHiddenTopSites();
  return topSites.filter(function (row) {
    return !hide[row.url];
  });
}

},{"./rows":15}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _img = require("img");

var _img2 = _interopRequireDefault(_img);

var _urls = require("urls");

var _titles = require("./titles");

var titles = _interopRequireWildcard(_titles);

var _urlImage = require("./url-image");

var _urlImage2 = _interopRequireDefault(_urlImage);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var URLIcon = function (_Component) {
  _inherits(URLIcon, _Component);

  function URLIcon() {
    _classCallCheck(this, URLIcon);

    return _possibleConstructorReturn(this, (URLIcon.__proto__ || Object.getPrototypeOf(URLIcon)).apply(this, arguments));
  }

  _createClass(URLIcon, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return this.props.content.url !== nextProps.content.url || this.props.selected !== nextProps.selected || this.props.type !== nextProps.type;
    }
  }, {
    key: "select",
    value: function select() {
      this.props.onSelect(this.props.content);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return (0, _preact.h)(
        "a",
        { id: this.props.content.id, className: "urlicon " + (this.props.selected ? "selected" : ""), href: this.url(), title: this.title() + " - " + (0, _urls.clean)(this.props.content.url), onMouseMove: function onMouseMove() {
            return _this2.select();
          } },
        (0, _preact.h)(_urlImage2.default, { content: this.props.content, "icon-only": true }),
        (0, _preact.h)(
          "div",
          { className: "title" },
          this.title()
        ),
        (0, _preact.h)(
          "div",
          { className: "url" },
          this.prettyURL()
        ),
        (0, _preact.h)("div", { className: "clear" })
      );
    }
  }, {
    key: "title",
    value: function title() {
      if (this.props.content.type === 'search-query') {
        return this.props.content.title;
      }

      if (this.props.content.type === 'url-query') {
        return "Open " + (0, _urls.clean)(this.props.content.url);
      }

      if (this.props.content.title && titles.isValid(this.props.content.title)) {
        return titles.normalize(this.props.content.title);
      }

      return titles.generateFromURL(this.props.content.url);
    }
  }, {
    key: "url",
    value: function url() {
      if (/^https?:\/\//.test(this.props.content.url)) {
        return this.props.content.url;
      }

      return 'http://' + this.props.content.url;
    }
  }, {
    key: "prettyURL",
    value: function prettyURL() {
      return (0, _urls.clean)(this.url());
    }
  }]);

  return URLIcon;
}(_preact.Component);

exports.default = URLIcon;

},{"./titles":20,"./url-image":23,"img":28,"preact":30,"urls":46}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.popularIcons = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.findHostname = findHostname;
exports.findProtocol = findProtocol;

var _preact = require("preact");

var _img = require("img");

var _img2 = _interopRequireDefault(_img);

var _debounceFn = require("debounce-fn");

var _debounceFn2 = _interopRequireDefault(_debounceFn);

var _randomColor = require("random-color");

var _randomColor2 = _interopRequireDefault(_randomColor);

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var popularIcons = exports.popularIcons = {
  'facebook.com': 'https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/N4H_50KFp8i.png',
  'twitter.com': 'https://ma-0.twimg.com/twitter-assets/responsive-web/web/ltr/icon-ios.a9cd885bccbcaf2f.png',
  'youtube.com': 'https://www.youtube.com/yts/img/favicon_96-vflW9Ec0w.png',
  'amazon.com': 'https://images-na.ssl-images-amazon.com/images/G/01/anywhere/a_smile_120x120._CB368246573_.png',
  'google.com': 'https://www.google.com/images/branding/product_ios/2x/gsa_ios_60dp.png',
  'yahoo.com': 'https://www.yahoo.com/apple-touch-icon-precomposed.png',
  'reddit.com': 'https://www.redditstatic.com/mweb2x/favicon/120x120.png',
  'instagram.com': 'https://www.instagram.com/static/images/ico/apple-touch-icon-120x120-precomposed.png/004705c9353f.png',
  'getkozmos.com': 'https://getkozmos.com/public/logos/kozmos-heart-logo-100px.png',
  'github.com': 'https://assets-cdn.github.com/pinned-octocat.svg',
  'gist.github.com': 'https://assets-cdn.github.com/pinned-octocat.svg',
  'mail.google.com': 'https://www.google.com/images/icons/product/googlemail-128.png',
  'paypal.com': 'https://www.paypalobjects.com/webstatic/icon/pp144.png',
  'imdb.com': 'http://ia.media-imdb.com/images/G/01/imdb/images/desktop-favicon-2165806970._CB522736561_.ico',
  'en.wikipedia.org': 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
  'wikipedia.org': 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
  'espn.com': 'http://a.espncdn.com/favicon.ico',
  'twitch.tv': 'https://static.twitchcdn.net/assets/favicon-75270f9df2b07174c23ce844a03d84af.ico',
  'cnn.com': 'http://cdn.cnn.com/cnn/.e/img/3.0/global/misc/apple-touch-icon.png',
  'office.com': 'https://seaofficehome.msocdn.com/s/7047452e/Images/favicon_metro.ico',
  'bankofamerica.com': 'https://www1.bac-assets.com/homepage/spa-assets/images/assets-images-global-favicon-favicon-CSX386b332d.ico',
  'chase.com': 'https://www.chase.com/etc/designs/chase-ux/favicon-152.png',
  'nytimes.com': 'https://static01.nyt.com/images/icons/ios-ipad-144x144.png',
  'apple.com': 'https://www.apple.com/favicon.ico',
  'wellsfargo.com': 'https://www.wellsfargo.com/assets/images/icons/apple-touch-icon-120x120.png',
  'yelp.com': 'https://s3-media2.fl.yelpcdn.com/assets/srv0/yelp_styleguide/118ff475a341/assets/img/logos/favicon.ico',
  'wordpress.com': 'http://s0.wp.com/i/webclip.png',
  'dropbox.com': 'https://cfl.dropboxstatic.com/static/images/favicon-vflUeLeeY.ico',
  'mail.superhuman.com': 'https://superhuman.com/build/71222bdc169e5906c28247ed5b7cf0ed.share-icon.png',
  'aws.amazon.com': 'https://a0.awsstatic.com/libra-css/images/site/touch-icon-iphone-114-smile.png',
  'console.aws.amazon.com': 'https://a0.awsstatic.com/libra-css/images/site/touch-icon-iphone-114-smile.png',
  'us-west-2.console.aws.amazon.com': 'https://a0.awsstatic.com/libra-css/images/site/touch-icon-iphone-114-smile.png',
  'stackoverflow.com': 'https://cdn.sstatic.net/Sites/stackoverflow/img/apple-touch-icon.png'
};

var URLImage = function (_Component) {
  _inherits(URLImage, _Component);

  function URLImage(props) {
    _classCallCheck(this, URLImage);

    var _this = _possibleConstructorReturn(this, (URLImage.__proto__ || Object.getPrototypeOf(URLImage)).call(this, props));

    _this._refreshSource = (0, _debounceFn2.default)(_this.refreshSource.bind(_this));
    return _this;
  }

  _createClass(URLImage, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      if (this.props.content.url !== props.content.url) {
        this._refreshSource(props.content);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (nextProps.content.url !== this.props.content.url) {
        return true;
      }

      if (nextState.src !== this.state.src) {
        return true;
      }

      if (nextState.loading !== this.state.loading || nextState.error !== this.state.error) {
        return true;
      }

      if (!nextProps.content.images || this.props.content.images || nextProps.content.images || !this.props.content.images || nextProps.content.images[0] !== this.props.content.images[0]) {
        return true;
      }

      return false;
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.refreshSource();
    }
  }, {
    key: "refreshSource",
    value: function refreshSource(content) {
      this.setState({
        color: (0, _randomColor2.default)(100, 50)
      });

      this.findSource(content);
      this.preload(this.state.src);
    }
  }, {
    key: "findSource",
    value: function findSource(content) {
      content || (content = this.props.content);

      if (!this.props['icon-only'] && content.images && content.images.length > 0) {
        return this.setState({
          type: 'image',
          src: content.images[0]
        });
      }

      if (content.icon) {
        return this.setState({
          type: 'icon',
          src: absoluteIconURL(content)
        });
      }

      var hostname = findHostname(content.url);
      if (popularIcons[hostname]) {
        return this.setState({
          type: 'popular-icon',
          src: popularIcons[hostname]
        });
      }

      this.setState({
        type: 'favicon',
        src: 'http://' + hostname + '/favicon.ico'
      });
    }
  }, {
    key: "preload",
    value: function preload(src) {
      var _this2 = this;

      if (this.state.loading && this.state.loadingFor === this.props.content.url) {
        return;
      }

      this.setState({
        error: null,
        loading: true,
        loadingFor: this.props.content.url,
        loadingSrc: src,
        src: this.cachedIconURL()
      });

      (0, _img2.default)(src, function (err) {
        if (_this2.state.loadingSrc !== src) {
          return;
        }

        if (err) {
          return _this2.setState({
            loading: false,
            error: err,
            src: _this2.cachedIconURL()
          });
        }

        _this2.setState({
          src: src,
          loading: false,
          error: null
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.loading || this.state.error) {
        return this.renderLoading();
      }

      var style = {
        backgroundImage: "url(" + this.state.src + ")"
      };

      return (0, _preact.h)("div", { className: "url-image " + this.state.type, style: style });
    }
  }, {
    key: "renderLoading",
    value: function renderLoading() {
      var style = {
        backgroundColor: this.state.color
      };

      return (0, _preact.h)(
        "div",
        { "data-error": this.state.error, "data-type": this.state.type, "data-src": this.state.src, className: "url-image generated-image center", style: style },
        (0, _preact.h)(
          "span",
          null,
          findHostname(this.props.content.url).slice(0, 1).toUpperCase()
        )
      );
    }
  }, {
    key: "cachedIconURL",
    value: function cachedIconURL() {
      return 'chrome://favicon/size/72/' + findProtocol(this.props.content.url) + '://' + findHostname(this.props.content.url);
    }
  }]);

  return URLImage;
}(_preact.Component);

exports.default = URLImage;


function absoluteIconURL(like) {
  if (/^https?:\/\//.test(like.icon)) return like.icon;
  return 'http:\/\/' + (0, _path.join)(findHostname(like.url), like.icon);
}

function findHostname(url) {
  return url.replace(/^\w+:\/\//, '').split('/')[0].replace(/^www\./, '');
}

function findProtocol(url) {
  if (!/^https?:\/\//.test(url)) return 'http';
  return url.split('://')[0];
}

},{"debounce-fn":26,"img":28,"path":29,"preact":30,"random-color":36}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _img = require("img");

var _img2 = _interopRequireDefault(_img);

var _wallpapers = require("./wallpapers");

var _wallpapers2 = _interopRequireDefault(_wallpapers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ONE_DAY = 1000 * 60 * 60 * 24;

var Wallpaper = function (_Component) {
  _inherits(Wallpaper, _Component);

  function Wallpaper(props) {
    _classCallCheck(this, Wallpaper);

    var _this = _possibleConstructorReturn(this, (Wallpaper.__proto__ || Object.getPrototypeOf(Wallpaper)).call(this, props));

    setTimeout(_this.cacheTomorrow(), 1000);
    return _this;
  }

  _createClass(Wallpaper, [{
    key: "today",
    value: function today() {
      var now = new Date();
      var start = new Date(now.getFullYear(), 0, 0);
      var diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
      return Math.floor(diff / ONE_DAY);
    }
  }, {
    key: "selected",
    value: function selected() {
      return _wallpapers2.default[this.today() % _wallpapers2.default.length];
    }
  }, {
    key: "cacheTomorrow",
    value: function cacheTomorrow() {
      var url = _wallpapers2.default[(this.today() + 1) % _wallpapers2.default.length].url;
      if (localStorage['last-wallpaper-cache'] === url) return;

      (0, _img2.default)(url, function (err) {
        localStorage['last-wallpaper-cache'] = url;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var selected = this.selected();
      var style = {
        backgroundImage: "url(" + selected.url + ")"
      };

      if (selected.position) {
        style.backgroundPosition = selected.position;
      }

      return (0, _preact.h)("div", { className: "wallpaper", style: style });
    }
  }, {
    key: "renderAuthor",
    value: function renderAuthor() {
      var name = this.props.content.user.name || this.props.content.user.username;
      var link = this.props.content.user.portfolio_url || 'https://unsplash.com/@' + this.props.content.user.username;
      var profilePhotoStyle = {
        backgroundImage: "url(" + this.props.content.user.profile_image.small + ")"
      };

      return (0, _preact.h)(
        "a",
        { href: link, className: "author", title: "Photo was shot by " + this.props.content.user.name },
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

},{"./wallpapers":25,"img":28,"preact":30}],25:[function(require,module,exports){
module.exports=[
  { "url": "https://images.unsplash.com/photo-1444464666168-49d633b86797" },
  { "url": "https://images.unsplash.com/photo-1450849608880-6f787542c88a" },
  { "url": "https://images.unsplash.com/photo-1477681952211-b8e8cca49b4d" },
  { "position": "top center", "url": "https://images.unsplash.com/photo-1429516387459-9891b7b96c78" },
  { "url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800" },
  { "url": "https://images.unsplash.com/photo-1488724034958-0faad88cf69f" },
  { "url": "https://images.unsplash.com/photo-1430651717504-ebb9e3e6795e" },
  { "url": "https://images.unsplash.com/photo-1441802259878-a13f732ce410" },
  { "url": "https://images.unsplash.com/photo-1494200483035-db7bc6aa5739" },
  { "url": "https://images.unsplash.com/photo-1459258350879-34886319a3c9" },
  { "url": "https://images.unsplash.com/photo-1507098926331-8d324b139d15" },
  { "url": "https://images.unsplash.com/photo-1510353622758-62e3b63b5fb5" },
  { "position": "top center", "url": "https://images.unsplash.com/photo-1494301950624-2c54cc9826c5" },
  { "url": "https://images.unsplash.com/photo-1483116531522-4c4e525f504e" },
  { "url": "https://images.unsplash.com/photo-1479030160180-b1860951d696" },
  { "url": "https://images.unsplash.com/photo-1504535497387-90c521ae8523" },
  { "url": "https://images.unsplash.com/photo-1477951233099-d2c5fbd878ee" },
  { "url": "https://images.unsplash.com/photo-1501446690852-da55df7bfe07" }
]

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){

/**
 * Escape regexp special characters in `str`.
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

module.exports = function(str){
  return String(str).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
};
},{}],28:[function(require,module,exports){
module.exports = img;

function img (src, opt, callback) {
  if (typeof opt === 'function') {
    callback = opt
    opt = null
  }


  var el = document.createElement('img');
  var locked;

  el.onload = function () {
    if (locked) return;
    locked = true;

    callback && callback(undefined, el);
  };

  el.onerror = function (err) {
    if (locked) return;
    locked = true;

    callback && callback(new Error('Unable to load "' + src + '"'), el);
  };
  
  if (opt && opt.crossOrigin)
    el.crossOrigin = opt.crossOrigin;

  el.src = src;

  return el;
}

},{}],29:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":31}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],32:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],33:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],34:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],35:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":33,"./encode":34}],36:[function(require,module,exports){
var random = require("rnd");

module.exports = color;

function color (max, min) {
  max || (max = 255);
  return 'rgb(' + random(max, min) + ', ' + random(max, min) + ', ' + random(max, min) + ')';
}

},{"rnd":38}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
module.exports = random;

function random (max, min) {
  max || (max = 999999999999);
  min || (min = 0);

  return min + Math.floor(Math.random() * (max - min));
}

},{}],39:[function(require,module,exports){

module.exports = [
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'en',
  'for',
  'from',
  'how',
  'if',
  'in',
  'neither',
  'nor',
  'of',
  'on',
  'only',
  'onto',
  'out',
  'or',
  'per',
  'so',
  'than',
  'that',
  'the',
  'to',
  'until',
  'up',
  'upon',
  'v',
  'v.',
  'versus',
  'vs',
  'vs.',
  'via',
  'when',
  'with',
  'without',
  'yet'
];
},{}],40:[function(require,module,exports){
var toTitle = require("to-title");

module.exports = urlToTitle;

function urlToTitle (url) {
  url = unescape(url).replace(/_/g, ' ');
  url = url.replace(/^\w+:\/\//, '');
  url = url.replace(/^www\./, '');
  url = url.replace(/(\/|\?)$/, '');

  var parts = url.split('?');
  url = parts[0];
  url = url.replace(/\.\w+$/, '');

  parts = url.split('/');

  var name = parts[0];
  name = name.replace(/\.\w+(\/|$)/, '').replace(/\.(com?|net|org|fr)$/, '')

  if (parts.length == 1) {
    return title(name);
  }

  return toTitle(parts.slice(1).reverse().map(toTitle).join(' - ')) + ' on ' + title(name);
}

function title (host) {
  if (/^[\w\.\-]+:\d+/.test(host)) {
    return host
  }

  return toTitle(host.split('.').join(', '))
}

},{"to-title":43}],41:[function(require,module,exports){

var clean = require('to-no-case');


/**
 * Expose `toCapitalCase`.
 */

module.exports = toCapitalCase;


/**
 * Convert a `string` to capital case.
 *
 * @param {String} string
 * @return {String}
 */


function toCapitalCase (string) {
  return clean(string).replace(/(^|\s)(\w)/g, function (matches, previous, letter) {
    return previous + letter.toUpperCase();
  });
}
},{"to-no-case":42}],42:[function(require,module,exports){

/**
 * Expose `toNoCase`.
 */

module.exports = toNoCase;


/**
 * Test whether a string is camel-case.
 */

var hasSpace = /\s/;
var hasCamel = /[a-z][A-Z]/;
var hasSeparator = /[\W_]/;


/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */

function toNoCase (string) {
  if (hasSpace.test(string)) return string.toLowerCase();

  if (hasSeparator.test(string)) string = unseparate(string);
  if (hasCamel.test(string)) string = uncamelize(string);
  return string.toLowerCase();
}


/**
 * Separator splitter.
 */

var separatorSplitter = /[\W_]+(.|$)/g;


/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function unseparate (string) {
  return string.replace(separatorSplitter, function (m, next) {
    return next ? ' ' + next : '';
  });
}


/**
 * Camelcase splitter.
 */

var camelSplitter = /(.)([A-Z]+)/g;


/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function uncamelize (string) {
  return string.replace(camelSplitter, function (m, previous, uppers) {
    return previous + ' ' + uppers.toLowerCase().split('').join(' ');
  });
}
},{}],43:[function(require,module,exports){
var escape = require('escape-regexp-component');
var capital = require('to-capital-case');
var minors = require('title-case-minors');

/**
 * Expose `toTitleCase`.
 */

module.exports = toTitleCase;


/**
 * Minors.
 */

var escaped = minors.map(escape);
var minorMatcher = new RegExp('[^^]\\b(' + escaped.join('|') + ')\\b', 'ig');
var colonMatcher = /:\s*(\w)/g;


/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */


function toTitleCase (string) {
  return capital(string)
    .replace(minorMatcher, function (minor) {
      return minor.toLowerCase();
    })
    .replace(colonMatcher, function (letter) {
      return letter.toUpperCase();
    });
}

},{"escape-regexp-component":27,"title-case-minors":39,"to-capital-case":41}],44:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":45,"punycode":32,"querystring":35}],45:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],46:[function(require,module,exports){
const parse = require("url").parse

module.exports = {
  clean,
  page,
  protocol,
  hostname,
  normalize,
  isSearchQuery,
  isURL
}

function protocol (url) {
  const match = url.match(/(^\w+):\/\//)
  if (match) {
    return match[1]
  }

  return 'http'
}

function clean (url) {
  return cleanUTM(url)
    .trim()
    .replace(/^\w+:\/\//, '')
    .replace(/^[\w-_]+:[\w-_]+@/, '')
    .replace(/#.*$/, '')
    .replace(/(\/|\?|\&|#)*$/, '')
    .replace(/\/\?/, '?')
    .replace(/^www\./, '')
}

function page (url) {
  return clean(url.replace(/\#.*$/, ''))
}

function hostname (url) {
  return parse(normalize(url)).hostname.replace(/^www\./, '')
}

function normalize (input) {
  if (input.trim().length === 0) return ''

  if (isSearchQuery(input)) {
    return `https://google.com/search?q=${encodeURI(input)}`
  }

  if (!/^\w+:\/\//.test(input)) {
    return `http://${input}`
  }

  return input
}

function isSearchQuery (input) {
  return !isURL(input.trim())
}

function isURL (input) {
  return input.indexOf(' ') === -1 && (/^\w+:\/\//.test(input) || input.indexOf('.') > 0 || input.indexOf(':') > 0)
}

function cleanUTM (url) {
  return url
    .replace(/(\?|\&)utm_[\w]+\=[^\&]+/g, '$1')
    .replace(/(\?|\&)ref\=[^\&]+\&?/, '$1')
    .replace(/[\&]{2,}/,'&')
    .replace('?&', '?')
}

},{"url":44}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaHJvbWUvc2V0dGluZ3Mtc2VjdGlvbnMuanNvbiIsImxpYi9tZXNzYWdpbmcuanMiLCJuZXd0YWIvYm9va21hcmstc2VhcmNoLmpzIiwibmV3dGFiL2Jvb2ttYXJrLXRhZ3MuanMiLCJuZXd0YWIvY29udGVudC5qcyIsIm5ld3RhYi9oaXN0b3J5LmpzIiwibmV3dGFiL2ljb24uanMiLCJuZXd0YWIvbG9nby5qcyIsIm5ld3RhYi9tZW51LmpzIiwibmV3dGFiL21lc3NhZ2luZy5qcyIsIm5ld3RhYi9uZXd0YWIuanMiLCJuZXd0YWIvcXVlcnktc3VnZ2VzdGlvbnMuanMiLCJuZXd0YWIvcmVjZW50LWJvb2ttYXJrcy5qcyIsIm5ld3RhYi9yZXN1bHRzLmpzIiwibmV3dGFiL3Jvd3MuanMiLCJuZXd0YWIvc2VhcmNoLWlucHV0LmpzIiwibmV3dGFiL3NlYXJjaC5qcyIsIm5ld3RhYi9zZXR0aW5ncy5qcyIsIm5ld3RhYi9zaWRlYmFyLmpzIiwibmV3dGFiL3RpdGxlcy5qcyIsIm5ld3RhYi90b3Atc2l0ZXMuanMiLCJuZXd0YWIvdXJsLWljb24uanMiLCJuZXd0YWIvdXJsLWltYWdlLmpzIiwibmV3dGFiL3dhbGxwYXBlci5qcyIsIm5ld3RhYi93YWxscGFwZXJzLmpzb24iLCJub2RlX21vZHVsZXMvZGVib3VuY2UtZm4vaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXNjYXBlLXJlZ2V4cC1jb21wb25lbnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaW1nL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhdGgtYnJvd3NlcmlmeS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3B1bnljb2RlL3B1bnljb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9kZWNvZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2VuY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmFuZG9tLWNvbG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlbGF0aXZlLWRhdGUvbGliL3JlbGF0aXZlLWRhdGUuanMiLCJub2RlX21vZHVsZXMvcm5kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RpdGxlLWNhc2UtbWlub3JzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RpdGxlLWZyb20tdXJsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RvLWNhcGl0YWwtY2FzZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90by1uby1jYXNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RvLXRpdGxlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3VybC91cmwuanMiLCJub2RlX21vZHVsZXMvdXJsL3V0aWwuanMiLCJub2RlX21vZHVsZXMvdXJscy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQy9CQSxJQUFJLGlCQUFpQixDQUFyQjs7QUFFTyxJQUFNLHNEQUF1QixDQUE3Qjs7SUFFYyxTO0FBQ25CLHVCQUFjO0FBQUE7O0FBQ1osU0FBSyxpQkFBTDtBQUNBLFNBQUssT0FBTCxHQUFlLEVBQWY7QUFDRDs7OztnQ0FFd0M7QUFBQSxVQUFqQyxFQUFpQyxRQUFqQyxFQUFpQztBQUFBLFVBQTdCLE9BQTZCLFFBQTdCLE9BQTZCO0FBQUEsVUFBcEIsS0FBb0IsUUFBcEIsS0FBb0I7QUFB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHtcbiAgICBrZXk6IFwib25lQ2xpY2tMaWtlXCIsXG4gICAgdGl0bGU6IFwiT25lLWNsaWNrIGJvb2ttYXJraW5nXCIsXG4gICAgZGVzYzogXCJIZWFydCBidXR0b24gd2lsbCBpbW1lZGlhdGVseSBib29rbWFyayB3aGVuIGNsaWNrZWQuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHBvcHVwOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwibWluaW1hbE1vZGVcIixcbiAgICB0aXRsZTogXCJFbmFibGUgTWluaW1hbCBNb2RlXCIsXG4gICAgZGVzYzogXCJIaWRlIG1ham9yaXR5IG9mIHRoZSBpbnRlcmZhY2UgdW50aWwgdXNlciBmb2N1c2VzLlwiLFxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgbmV3dGFiOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwic2hvd1dhbGxwYXBlclwiLFxuICAgIHRpdGxlOiBcIlNob3cgV2FsbHBhcGVyXCIsXG4gICAgZGVzYzogXCJHZXQgYSBuZXcgYmVhdXRpZnVsIHBob3RvIGluIHlvdXIgbmV3IHRhYiBldmVyeSBkYXkuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBuZXd0YWI6IHRydWVcbiAgfSxcbiAge1xuICAgIGtleTogXCJlbmFibGVOZXdUYWJcIixcbiAgICB0aXRsZTogXCJFbmFibGUgTmV3IFRhYiBJbnRlcmZhY2VcIixcbiAgICBkZXNjOiBcIkZhc3RlciBhbmQgZWFzaWVyIHNlYXJjaCBpbnRlcmZhY2UuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHBvcHVwOiB0cnVlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9XG5dXG4iLCJsZXQgbWVzc2FnZUNvdW50ZXIgPSAwXG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RJTUVPVVRfU0VDUyA9IDVcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnaW5nIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5saXN0ZW5Gb3JNZXNzYWdlcygpXG4gICAgdGhpcy53YWl0aW5nID0ge31cbiAgfVxuXG4gIGRyYWZ0KHsgaWQsIGNvbnRlbnQsIGVycm9yLCB0bywgcmVwbHkgfSkge1xuICAgIGlkID0gdGhpcy5nZW5lcmF0ZUlkKClcblxuICAgIHJldHVybiB7XG4gICAgICBmcm9tOiB0aGlzLm5hbWUsXG4gICAgICB0bzogdG8gfHwgdGhpcy50YXJnZXQsXG4gICAgICBlcnJvcjogY29udGVudC5lcnJvciB8fCBlcnJvcixcbiAgICAgIGlkLCBjb250ZW50LCByZXBseVxuICAgIH1cbiAgfVxuXG4gIGdlbmVyYXRlSWQoKSB7XG4gICAgcmV0dXJuIChEYXRlLm5vdygpICogMTAwMCkgKyAoKyttZXNzYWdlQ291bnRlcilcbiAgfVxuXG4gIG9uUmVjZWl2ZShtc2cpIHtcbiAgICBpZiAobXNnLnRvICE9PSB0aGlzLm5hbWUpIHJldHVybiB0cnVlXG5cbiAgICBpZiAobXNnLnJlcGx5ICYmIHRoaXMud2FpdGluZ1ttc2cucmVwbHldKSB7XG4gICAgICB0aGlzLndhaXRpbmdbbXNnLnJlcGx5XShtc2cpXG4gICAgfVxuXG4gICAgaWYgKG1zZy5yZXBseSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobXNnLmNvbnRlbnQgJiYgbXNnLmNvbnRlbnQucGluZykge1xuICAgICAgdGhpcy5yZXBseShtc2csIHsgcG9uZzogdHJ1ZSB9KVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBwaW5nKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zZW5kKHsgcGluZzogdHJ1ZSB9LCBjYWxsYmFjaylcbiAgfVxuXG4gIHJlcGx5KG1zZywgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5jb250ZW50KSB7XG4gICAgICBvcHRpb25zID0ge1xuICAgICAgICBjb250ZW50OiBvcHRpb25zXG4gICAgICB9XG4gICAgfVxuXG4gICAgb3B0aW9ucy5yZXBseSA9IG1zZy5pZFxuICAgIG9wdGlvbnMudG8gPSBtc2cuZnJvbVxuXG4gICAgdGhpcy5zZW5kKG9wdGlvbnMpXG4gIH1cblxuICBzZW5kKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbXNnID0gdGhpcy5kcmFmdChvcHRpb25zLmNvbnRlbnQgPyBvcHRpb25zIDogeyBjb250ZW50OiBvcHRpb25zIH0pXG5cbiAgICB0aGlzLnNlbmRNZXNzYWdlKG1zZylcblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdGhpcy53YWl0UmVwbHlGb3IobXNnLmlkLCBERUZBVUxUX1RJTUVPVVRfU0VDUywgY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgd2FpdFJlcGx5Rm9yKG1zZ0lkLCB0aW1lb3V0U2VjcywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgIGxldCB0aW1lb3V0ID0gdW5kZWZpbmVkXG5cbiAgICBpZiAodGltZW91dFNlY3MgPiAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChvblRpbWVvdXQsIHRpbWVvdXRTZWNzICogMTAwMClcbiAgICB9XG5cbiAgICB0aGlzLndhaXRpbmdbbXNnSWRdID0gbXNnID0+IHtcbiAgICAgIGRvbmUoKVxuICAgICAgY2FsbGJhY2sobXNnKVxuICAgIH1cblxuICAgIHJldHVybiBkb25lXG5cbiAgICBmdW5jdGlvbiBkb25lICgpIHtcbiAgICAgIGlmICh0aW1lb3V0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgIH1cblxuICAgICAgdGltZW91dCA9IHVuZGVmaW5lZFxuICAgICAgZGVsZXRlIHNlbGYud2FpdGluZ1ttc2dJZF1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblRpbWVvdXQgKCkge1xuICAgICAgZG9uZSgpXG4gICAgICBjYWxsYmFjayh7IGVycm9yOiAnTWVzc2FnZSByZXNwb25zZSB0aW1lb3V0ICgnICsgdGltZW91dFNlY3MgKycpcy4nIH0pXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9va21hcmtTZWFyY2ggZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gJ2Jvb2ttYXJrLXNlYXJjaCdcbiAgICB0aGlzLnRpdGxlID0gJ0xpa2VkIGluIEtvem1vcydcbiAgfVxuXG4gIGZhaWwoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgaWYgKCFxdWVyeSB8fCAocXVlcnkuaW5kZXhPZigndGFnOicpID09PSAwICYmIHF1ZXJ5Lmxlbmd0aCA+IDQpKSByZXR1cm4gdGhpcy5hZGQoW10pXG5cbiAgICBjb25zdCBvcXVlcnkgPSBxdWVyeSB8fCB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnlcblxuICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ3NlYXJjaC1ib29rbWFya3MnLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChvcXVlcnkgIT09IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeS50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgIHRoaXMuYWRkKHJlc3AuY29udGVudC5yZXN1bHRzLmxpa2VzKVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXN0Qm9va21hcmtzQnlUYWcgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gJ2Jvb2ttYXJrcy1ieS10YWcnXG4gICAgdGhpcy50aXRsZSA9IHF1ZXJ5ID0+IGBUYWdnZWQgd2l0aCAke3F1ZXJ5LnNsaWNlKDQpfSBPbiBLb3ptb3NgXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBpZiAoIXF1ZXJ5IHx8IHF1ZXJ5LmluZGV4T2YoJ3RhZzonKSAhPT0gMCB8fCBxdWVyeS5sZW5ndGggPCA1KSByZXR1cm4gdGhpcy5hZGQoW10pXG5cbiAgICBjb25zdCBvcXVlcnkgPSBxdWVyeSB8fCB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnlcblxuICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ3NlYXJjaC1ib29rbWFya3MnLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChvcXVlcnkgIT09IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeS50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgIHRoaXMuYWRkKHJlc3AuY29udGVudC5yZXN1bHRzLmxpa2VzKVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGJnID0gdGhpcy5wcm9wcy53YWxscGFwZXIgPyB7XG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6IGB1cmwoJHt0aGlzLnByb3BzLndhbGxwYXBlci51cmxzLnRodW1ifSlgXG4gICAgfSA6IG51bGxcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnQtd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnXCIgc3R5bGU9e2JnfT48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjZW50ZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGNvbnRlbnQgJHt0aGlzLnByb3BzLmZvY3VzZWQgPyBcImZvY3VzZWRcIiA6IFwiXCJ9YH0+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IHsgZmluZEhvc3RuYW1lIH0gZnJvbSAnLi91cmwtaW1hZ2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhpc3RvcnkgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gJ2hpc3RvcnknXG4gICAgdGhpcy50aXRsZSA9ICdQcmV2aW91c2x5IFZpc2l0ZWQnXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBpZiAoIXF1ZXJ5KSByZXR1cm4gdGhpcy5hZGQoW10pXG5cbiAgICBjaHJvbWUuaGlzdG9yeS5zZWFyY2goeyB0ZXh0OiBxdWVyeSB9LCBoaXN0b3J5ID0+IHtcbiAgICAgIHRoaXMuYWRkKGhpc3RvcnkuZmlsdGVyKGZpbHRlck91dFNlYXJjaCkpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJPdXRTZWFyY2ggKHJvdykge1xuICByZXR1cm4gZmluZEhvc3RuYW1lKHJvdy51cmwpLnNwbGl0KCcuJylbMF0gIT09ICdnb29nbGUnXG4gICAgJiYgIS9zZWFyY2hcXC8/XFw/cVxcPVxcdyovLnRlc3Qocm93LnVybClcbiAgICAmJiAhL2ZhY2Vib29rXFwuY29tXFwvc2VhcmNoLy50ZXN0KHJvdy51cmwpXG4gICAgJiYgIS90d2l0dGVyXFwuY29tXFwvc2VhcmNoLy50ZXN0KHJvdy51cmwpXG4gICAgJiYgZmluZEhvc3RuYW1lKHJvdy51cmwpICE9PSAndC5jbydcbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJY29uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXNbJ3JlbmRlcicgKyB0aGlzLnByb3BzLm5hbWUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoMCwgMSkgKyB0aGlzLnByb3BzLm5hbWUuc2xpY2UoMSldXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2xpY2t9IGNsYXNzTmFtZT17YGljb24gaWNvbi0ke3RoaXMucHJvcHMubmFtZX1gfSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIHttZXRob2QgPyBtZXRob2QuY2FsbCh0aGlzKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBzdHJva2UgKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnN0cm9rZSB8fCAyXG4gIH1cblxuICByZW5kZXJBbGVydCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktYWxlcnRcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0xNiAzIEwzMCAyOSAyIDI5IFogTTE2IDExIEwxNiAxOSBNMTYgMjMgTDE2IDI1XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsb2NrKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jbG9ja1wiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTZcIiBjeT1cIjE2XCIgcj1cIjE0XCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0xNiA4IEwxNiAxNiAyMCAyMFwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJDbG9zZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktY2xvc2VcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0yIDMwIEwzMCAyIE0zMCAzMCBMMiAyXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckhlYXJ0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1oZWFydFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnN0cm9rZSgpfT5cbiAgICAgICAgPHBhdGggZD1cIk00IDE2IEMxIDEyIDIgNiA3IDQgMTIgMiAxNSA2IDE2IDggMTcgNiAyMSAyIDI2IDQgMzEgNiAzMSAxMiAyOCAxNiAyNSAyMCAxNiAyOCAxNiAyOCAxNiAyOCA3IDIwIDQgMTYgWlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZWFyY2goKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXNlYXJjaFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTRcIiBjeT1cIjE0XCIgcj1cIjEyXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0yMyAyMyBMMzAgMzBcIiAgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckV4dGVybmFsKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1leHRlcm5hbFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTE0IDkgTDMgOSAzIDI5IDIzIDI5IDIzIDE4IE0xOCA0IEwyOCA0IDI4IDE0IE0yOCA0IEwxNCAxOFwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJUYWcoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXRhZ1wiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMjRcIiBjeT1cIjhcIiByPVwiMlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMiAxOCBMMTggMiAzMCAyIDMwIDE0IDE0IDMwIFpcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVHJhc2goKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXRyYXNoXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMjggNiBMNiA2IDggMzAgMjQgMzAgMjYgNiA0IDYgTTE2IDEyIEwxNiAyNCBNMjEgMTIgTDIwIDI0IE0xMSAxMiBMMTIgMjQgTTEyIDYgTDEzIDIgMTkgMiAyMCA2XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclJpZ2h0Q2hldnJvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktY2hldnJvbi1yaWdodFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTEyIDMwIEwyNCAxNiAxMiAyXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNldHRpbmdzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1zZXR0aW5nc1wiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTEzIDIgTDEzIDYgMTEgNyA4IDQgNCA4IDcgMTEgNiAxMyAyIDEzIDIgMTkgNiAxOSA3IDIxIDQgMjQgOCAyOCAxMSAyNSAxMyAyNiAxMyAzMCAxOSAzMCAxOSAyNiAyMSAyNSAyNCAyOCAyOCAyNCAyNSAyMSAyNiAxOSAzMCAxOSAzMCAxMyAyNiAxMyAyNSAxMSAyOCA4IDI0IDQgMjEgNyAxOSA2IDE5IDIgWlwiIC8+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNlwiIGN5PVwiMTZcIiByPVwiNFwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dvIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJsb2dvXCIgaHJlZj1cImh0dHBzOi8vZ2V0a296bW9zLmNvbVwiPlxuICAgICAgICA8aW1nIHNyYz17Y2hyb21lLmV4dGVuc2lvbi5nZXRVUkwoXCJpbWFnZXMvaWNvbjEyOC5wbmdcIil9IHRpdGxlPVwiT3BlbiBLb3ptb3NcIiAvPlxuICAgICAgPC9hPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbnUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzZXRUaXRsZSh0aXRsZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyB0aXRsZSB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICAgIHt0aGlzLnN0YXRlLnRpdGxlIHx8IFwiXCJ9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwiYnV0dG9uc1wiPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgaWNvbj1cImNhbGVuZGFyXCJcbiAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0VGl0bGUoJ1JlY2VudGx5IFZpc2l0ZWQnKX1cbiAgICAgICAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy5zZXRUaXRsZSgpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5SZWNlbnQoKX0gLz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgaWNvbj1cImhlYXJ0XCJcbiAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0VGl0bGUoJ0Jvb2ttYXJrcycpfVxuICAgICAgICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLnNldFRpdGxlKCl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub3BlbkJvb2ttYXJrcygpfSAvPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgaWNvbj1cImZpcmVcIlxuICAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0VGl0bGUoJ01vc3QgVmlzaXRlZCcpfVxuICAgICAgICAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy5zZXRUaXRsZSgpfVxuICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vcGVuVG9wKCl9IC8+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IE1lc3NhZ2luZyBmcm9tICcuLi9saWIvbWVzc2FnaW5nJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGcm9tTmV3VGFiVG9CYWNrZ3JvdW5kIGV4dGVuZHMgTWVzc2FnaW5nIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubmFtZSA9ICdrb3ptb3M6bmV3dGFiJ1xuICAgIHRoaXMudGFyZ2V0ID0gJ2tvem1vczpiYWNrZ3JvdW5kJ1xuICB9XG5cbiAgbGlzdGVuRm9yTWVzc2FnZXMoKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKG1zZyA9PiB0aGlzLm9uUmVjZWl2ZShtc2cpKVxuICB9XG5cbiAgc2VuZE1lc3NhZ2UgKG1zZywgY2FsbGJhY2spIHtcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtc2csIGNhbGxiYWNrKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQsIHJlbmRlciB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IFdhbGxwYXBlciBmcm9tICcuL3dhbGxwYXBlcidcbmltcG9ydCBNZW51IGZyb20gXCIuL21lbnVcIlxuaW1wb3J0IFNlYXJjaCBmcm9tICcuL3NlYXJjaCdcbmltcG9ydCBMb2dvIGZyb20gJy4vbG9nbydcbmltcG9ydCBNZXNzYWdpbmcgZnJvbSBcIi4vbWVzc2FnaW5nXCJcbmltcG9ydCBTZXR0aW5ncyBmcm9tIFwiLi9zZXR0aW5nc1wiXG5cbmNsYXNzIE5ld1RhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNZXNzYWdpbmcoKVxuXG4gICAgdGhpcy5sb2FkU2V0dGluZ3MoKVxuICAgIHRoaXMuY2hlY2tJZkRpc2FibGVkKClcbiAgfVxuXG4gIGxvYWRTZXR0aW5ncyhhdm9pZENhY2hlKSB7XG4gICAgdGhpcy5sb2FkU2V0dGluZygnbWluaW1hbE1vZGUnLCBhdm9pZENhY2hlKVxuICAgIHRoaXMubG9hZFNldHRpbmcoJ3Nob3dXYWxscGFwZXInLCBhdm9pZENhY2hlKVxuICB9XG5cbiAgY2hlY2tJZkRpc2FibGVkKCkge1xuICAgIGlmIChsb2NhbFN0b3JhZ2VbJ2lzLWRpc2FibGVkJ10gPT0gJzEnKSB7XG4gICAgICB0aGlzLnNob3dEZWZhdWx0TmV3VGFiKClcbiAgICB9XG5cbiAgICB0aGlzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LXNldHRpbmdzLXZhbHVlJywga2V5OiAnZW5hYmxlTmV3VGFiJyB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IHJlc3AuZXJyb3IgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXNwLmNvbnRlbnQudmFsdWUpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlWydpcy1kaXNhYmxlZCddID0gXCIxXCJcbiAgICAgICAgdGhpcy5zaG93RGVmYXVsdE5ld1RhYigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2NhbFN0b3JhZ2VbJ2lzLWRpc2FibGVkJ10gPSBcIlwiXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGxvYWRTZXR0aW5nKGtleSwgYXZvaWRDYWNoZSkge1xuICAgIGlmICghYXZvaWRDYWNoZSAmJiBsb2NhbFN0b3JhZ2VbJ3NldHRpbmdzLWNhY2hlLScgKyBrZXldKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmFwcGx5U2V0dGluZyhrZXksIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydzZXR0aW5ncy1jYWNoZS0nICsga2V5XSkpXG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIHRoaXMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtc2V0dGluZ3MtdmFsdWUnLCBrZXkgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAoIXJlc3AuZXJyb3IpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlWydzZXR0aW5ncy1jYWNoZS0nICsga2V5XSA9IEpTT04uc3RyaW5naWZ5KHJlc3AuY29udGVudC52YWx1ZSlcbiAgICAgICAgdGhpcy5hcHBseVNldHRpbmcoa2V5LCByZXNwLmNvbnRlbnQudmFsdWUpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGFwcGx5U2V0dGluZyhrZXksIHZhbHVlKSB7XG4gICAgY29uc3QgdSA9IHt9XG4gICAgdVtrZXldID0gdmFsdWVcbiAgICB0aGlzLnNldFN0YXRlKHUpXG4gIH1cblxuICBzaG93RGVmYXVsdE5ld1RhYigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5kaXNhYmxlZCkgcmV0dXJuXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG5ld1RhYlVSTDogZG9jdW1lbnQubG9jYXRpb24uaHJlZixcbiAgICAgIGRpc2FibGVkOiB0cnVlXG4gICAgfSlcblxuXHRcdGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIGZ1bmN0aW9uKHRhYnMpIHtcblx0XHRcdHZhciBhY3RpdmUgPSB0YWJzWzBdLmlkXG5cblx0XHRcdGNocm9tZS50YWJzLnVwZGF0ZShhY3RpdmUsIHtcbiAgICAgICAgdXJsOiBcImNocm9tZS1zZWFyY2g6Ly9sb2NhbC1udHAvbG9jYWwtbnRwLmh0bWxcIlxuICAgICAgfSlcblx0XHR9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmRpc2FibGVkKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YG5ld3RhYiAke3RoaXMuc3RhdGUuc2hvd1dhbGxwYXBlciA/IFwiaGFzLXdhbGxwYXBlclwiIDogXCJcIn0gJHt0aGlzLnN0YXRlLm1pbmltYWxNb2RlID8gXCJtaW5pbWFsXCIgOiBcIlwifWB9PlxuICAgICAgICB7dGhpcy5zdGF0ZS5taW5pbWFsTW9kZSA/IG51bGwgOiA8TG9nbyAvPn1cbiAgICAgICAgPFNldHRpbmdzIG9uQ2hhbmdlPXsoKSA9PiB0aGlzLmxvYWRTZXR0aW5ncyh0cnVlKX0gbWVzc2FnZXM9e3RoaXMubWVzc2FnZXN9IHR5cGU9XCJuZXd0YWJcIiAvPlxuICAgICAgICA8U2VhcmNoIHNldHRpbmdzPXt0aGlzLnNldHRpbmdzfSAvPlxuICAgICAgICB7IHRoaXMuc3RhdGUuc2hvd1dhbGxwYXBlciA/IDxXYWxscGFwZXIgbWVzc2FnZXM9e3RoaXMubWVzc2FnZXN9IC8+IDogbnVsbCB9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxucmVuZGVyKDxOZXdUYWIgLz4sIGRvY3VtZW50LmJvZHkpXG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCB0aXRsZUZyb21VUkwgZnJvbSBcInRpdGxlLWZyb20tdXJsXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnlTdWdnZXN0aW9ucyBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSAncXVlcnktc3VnZ2VzdGlvbnMnXG4gIH1cblxuICBjcmVhdGVVUkxTdWdnZXN0aW9ucyhxdWVyeSkge1xuICAgIGlmICghaXNVUkwocXVlcnkpKSByZXR1cm4gW11cblxuICAgIGNvbnN0IHVybCA9IC9cXHcrOlxcL1xcLy8udGVzdChxdWVyeSkgPyBxdWVyeSA6ICdodHRwOi8vJyArIHF1ZXJ5XG5cbiAgICByZXR1cm4gW3tcbiAgICAgIHRpdGxlOiBgT3BlbiBcIiR7dGl0bGVGcm9tVVJMKHF1ZXJ5KX1cImAsXG4gICAgICB0eXBlOiAncXVlcnktc3VnZ2VzdGlvbicsXG4gICAgICB1cmxcbiAgICB9XVxuICB9XG5cbiAgY3JlYXRlU2VhcmNoU3VnZ2VzdGlvbnMocXVlcnkpIHtcbiAgICBpZiAoaXNVUkwocXVlcnkpKSByZXR1cm4gW11cbiAgICBpZiAocXVlcnkuaW5kZXhPZigndGFnOicpID09PSAwICYmIHF1ZXJ5Lmxlbmd0aCA+IDQpIHJldHVybiBbe1xuICAgICAgdXJsOiAnaHR0cHM6Ly9nZXRrb3ptb3MuY29tL3RhZy8nICsgZW5jb2RlVVJJKHF1ZXJ5LnNsaWNlKDQpKSxcbiAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgIHRpdGxlOiBgT3BlbiBcIiR7cXVlcnkuc2xpY2UoNCl9XCIgdGFnIGluIEtvem1vc2AsXG4gICAgICB0eXBlOiAnc2VhcmNoLXF1ZXJ5J1xuICAgIH1dXG5cbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICB1cmw6ICdodHRwczovL2dvb2dsZS5jb20vc2VhcmNoP3E9JyArIGVuY29kZVVSSShxdWVyeSksXG4gICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgdGl0bGU6IGBTZWFyY2ggXCIke3F1ZXJ5fVwiIG9uIEdvb2dsZWAsXG4gICAgICAgIHR5cGU6ICdzZWFyY2gtcXVlcnknXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmw6ICdodHRwczovL2dldGtvem1vcy5jb20vc2VhcmNoP3E9JyArIGVuY29kZVVSSShxdWVyeSksXG4gICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgdGl0bGU6IGBTZWFyY2ggXCIke3F1ZXJ5fVwiIG9uIEtvem1vc2AsXG4gICAgICAgIHR5cGU6ICdzZWFyY2gtcXVlcnknXG4gICAgICB9XG4gICAgXVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgaWYgKCFxdWVyeSkgcmV0dXJuIHRoaXMuYWRkKFtdKVxuICAgIHRoaXMuYWRkKHRoaXMuY3JlYXRlVVJMU3VnZ2VzdGlvbnMocXVlcnkpLmNvbmNhdCh0aGlzLmNyZWF0ZVNlYXJjaFN1Z2dlc3Rpb25zKHF1ZXJ5KSkpXG4gIH1cbn1cblxuZnVuY3Rpb24gaXNVUkwgKHF1ZXJ5KSB7XG4gIHJldHVybiBxdWVyeS50cmltKCkuaW5kZXhPZignLicpID4gMCAmJiBxdWVyeS5pbmRleE9mKCcgJykgPT09IC0xXG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjZW50Qm9va21hcmtzIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMubmFtZSA9ICdyZWNlbnQtYm9va21hcmtzJ1xuICAgIHRoaXMudGl0bGUgPSAnUmVjZW50bHkgTGlrZWQgaW4gS296bW9zJ1xuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgaWYgKHF1ZXJ5Lmxlbmd0aCA+IDApIHJldHVybiB0aGlzLmFkZChbXSlcblxuICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ2dldC1yZWNlbnQtYm9va21hcmtzJywgcXVlcnkgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMuZmFpbChyZXNwLmVycm9yKVxuXG4gICAgICB0aGlzLmFkZChyZXNwLmNvbnRlbnQucmVzdWx0cy5saWtlcylcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuXG5pbXBvcnQgVG9wU2l0ZXMgZnJvbSBcIi4vdG9wLXNpdGVzXCJcbmltcG9ydCBSZWNlbnRCb29rbWFya3MgZnJvbSBcIi4vcmVjZW50LWJvb2ttYXJrc1wiXG5pbXBvcnQgUXVlcnlTdWdnZXN0aW9ucyBmcm9tIFwiLi9xdWVyeS1zdWdnZXN0aW9uc1wiXG5pbXBvcnQgQm9va21hcmtTZWFyY2ggZnJvbSBcIi4vYm9va21hcmstc2VhcmNoXCJcbmltcG9ydCBIaXN0b3J5IGZyb20gXCIuL2hpc3RvcnlcIlxuaW1wb3J0IEJvb2ttYXJrVGFncyBmcm9tIFwiLi9ib29rbWFyay10YWdzXCJcblxuXG5pbXBvcnQgU2lkZWJhciBmcm9tIFwiLi9zaWRlYmFyXCJcbmltcG9ydCBNZXNzYWdpbmcgZnJvbSBcIi4vbWVzc2FnaW5nXCJcbmltcG9ydCBVUkxJY29uIGZyb20gXCIuL3VybC1pY29uXCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuXG5jb25zdCBNQVhfSVRFTVMgPSA1XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3VsdHMgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWVzc2FnaW5nKClcblxuICAgIHRoaXMuY2F0ZWdvcmllcyA9IFtcbiAgICAgIG5ldyBRdWVyeVN1Z2dlc3Rpb25zKHRoaXMsIDEpLFxuICAgICAgbmV3IFRvcFNpdGVzKHRoaXMsIDIpLFxuICAgICAgbmV3IFJlY2VudEJvb2ttYXJrcyh0aGlzLCAzKSxcbiAgICAgIG5ldyBCb29rbWFya1RhZ3ModGhpcywgNCksXG4gICAgICBuZXcgQm9va21hcmtTZWFyY2godGhpcywgNSksXG4gICAgICBuZXcgSGlzdG9yeSh0aGlzLCA2KVxuICAgIF1cblxuICAgIHRoaXMuX29uS2V5UHJlc3MgPSBkZWJvdW5jZSh0aGlzLm9uS2V5UHJlc3MuYmluZCh0aGlzKSwgNTApXG4gICAgdGhpcy51cGRhdGUocHJvcHMucXVlcnkgfHwgXCJcIilcbiAgfVxuXG4gIGFkZFJvd3MoY2F0ZWdvcnksIHJvd3MpIHtcbiAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgY29uc3QgdXJsTWFwID0ge31cbiAgICBsZXQgaSA9IHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICB1cmxNYXBbdGhpcy5zdGF0ZS5jb250ZW50W2ldLnVybF0gPSB0cnVlXG4gICAgfVxuXG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuc3RhdGUuY29udGVudC5jb25jYXQocm93cy5maWx0ZXIociA9PiAhdXJsTWFwW3IudXJsXSkuc2xpY2UoMCwgdGhpcy5tYXgoKSkubWFwKChyLCBpKSA9PiB7XG4gICAgICByLmNhdGVnb3J5ID0gY2F0ZWdvcnlcbiAgICAgIHIuaW5kZXggPSB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoICsgaVxuICAgICAgcmV0dXJuIHJcbiAgICB9KSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY29udGVudFxuICAgIH0pXG4gIH1cblxuICBjb250ZW50KCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnN0YXRlLmNvbnRlbnRcbiAgICBjb250ZW50LnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLmNhdGVnb3J5LnNvcnQgPCBiLmNhdGVnb3J5LnNvcnQpIHJldHVybiAtMVxuICAgICAgaWYgKGEuY2F0ZWdvcnkuc29ydCA+IGIuY2F0ZWdvcnkuc29ydCkgcmV0dXJuIDFcblxuICAgICAgaWYgKGEuaW5kZXggPCBiLmluZGV4KSByZXR1cm4gLTFcbiAgICAgIGlmIChhLmluZGV4ID4gYi5pbmRleCkgcmV0dXJuIDFcblxuICAgICAgcmV0dXJuIDBcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbnRlbnQubWFwKChyb3csIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6IHJvdy51cmwsXG4gICAgICAgIHRpdGxlOiByb3cudGl0bGUsXG4gICAgICAgIGltYWdlczogcm93LmltYWdlcyxcbiAgICAgICAgdHlwZTogcm93LmNhdGVnb3J5Lm5hbWUsXG4gICAgICAgIGNhdGVnb3J5OiByb3cuY2F0ZWdvcnksXG4gICAgICAgIGFic0luZGV4OiBpbmRleCxcbiAgICAgICAgaW5kZXhcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY29udGVudEJ5Q2F0ZWdvcnkoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGggPT09IDApIHJldHVybiBbXVxuXG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudCgpXG4gICAgY29uc3Qgc2VsZWN0ZWRDYXRlZ29yeSA9IHRoaXMuc3RhdGUuc2VsZWN0ZWQgPyBjb250ZW50W3RoaXMuc3RhdGUuc2VsZWN0ZWRdLmNhdGVnb3J5IDogY29udGVudFswXS5jYXRlZ29yeVxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBbXVxuICAgIGNvbnN0IGNhdGVnb3JpZXNNYXAgPSB7fVxuXG4gICAgbGV0IHRhYkluZGV4ID0gMlxuICAgIGxldCBjYXRlZ29yeSA9IG51bGxcbiAgICBjb250ZW50LmZvckVhY2goKHJvdywgaW5kKSA9PiB7XG4gICAgICBpZiAoIWNhdGVnb3J5IHx8IGNhdGVnb3J5Lm5hbWUgIT09IHJvdy5jYXRlZ29yeS5uYW1lKSB7XG4gICAgICAgIGNhdGVnb3J5ID0gcm93LmNhdGVnb3J5XG4gICAgICAgIGNhdGVnb3JpZXNNYXBbY2F0ZWdvcnkubmFtZV0gPSB7XG4gICAgICAgICAgdGl0bGU6IGNhdGVnb3J5LnRpdGxlLFxuICAgICAgICAgIG5hbWU6IGNhdGVnb3J5Lm5hbWUsXG4gICAgICAgICAgc29ydDogY2F0ZWdvcnkuc29ydCxcbiAgICAgICAgICBjb2xsYXBzZWQ6IGNvbnRlbnQubGVuZ3RoID4gTUFYX0lURU1TICYmIHNlbGVjdGVkQ2F0ZWdvcnkubmFtZSAhPSBjYXRlZ29yeS5uYW1lICYmIGNhdGVnb3J5LnRpdGxlLFxuICAgICAgICAgIHJvd3M6IFtdXG4gICAgICAgIH1cblxuICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcmllc01hcFtjYXRlZ29yeS5uYW1lXSlcblxuICAgICAgICByb3cudGFiSW5kZXggPSArK3RhYkluZGV4XG4gICAgICB9XG5cbiAgICAgIGNhdGVnb3JpZXNNYXBbY2F0ZWdvcnkubmFtZV0ucm93cy5wdXNoKHJvdylcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNhdGVnb3JpZXNcbiAgfVxuXG4gIG1heCgpIHtcbiAgICBjb25zdCBsZW4gPSB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoXG4gICAgbGV0IGkgPSAtMVxuICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmNvbnRlbnRbaV0uY2F0ZWdvcnkubmFtZSAhPT0gJ3F1ZXJ5LXN1Z2dlc3Rpb25zJykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5xdWVyeSA/IE1BWF9JVEVNUyAtIGkgOiBNQVhfSVRFTVNcbiAgfVxuXG4gIHJlc2V0KHF1ZXJ5KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZDogMCxcbiAgICAgIGNvbnRlbnQ6IFtdLFxuICAgICAgZXJyb3JzOiBbXSxcbiAgICAgIHF1ZXJ5OiBxdWVyeSB8fCAnJ1xuICAgIH0pXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBxdWVyeSA9IHF1ZXJ5LnRyaW0oKVxuXG4gICAgdGhpcy5yZXNldCgpXG4gICAgdGhpcy5jYXRlZ29yaWVzLmZvckVhY2goYyA9PiBjLnVwZGF0ZShxdWVyeSkpXG4gIH1cblxuICBzZWxlY3QoaW5kZXgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOiBpbmRleFxuICAgIH0pXG4gIH1cblxuICBzZWxlY3ROZXh0KCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWQ6ICh0aGlzLnN0YXRlLnNlbGVjdGVkICsgMSkgJSB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoXG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdFByZXZpb3VzKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWQ6IHRoaXMuc3RhdGUuc2VsZWN0ZWQgPT0gMCA/IHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGggLSAxIDogdGhpcy5zdGF0ZS5zZWxlY3RlZCAtIDFcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0TmV4dENhdGVnb3J5KCkge1xuICAgIGxldCBjdXJyZW50Q2F0ZWdvcnkgPSB0aGlzLnN0YXRlLmNvbnRlbnRbdGhpcy5zdGF0ZS5zZWxlY3RlZF0uY2F0ZWdvcnlcblxuICAgIGNvbnN0IGxlbiA9IHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGhcbiAgICBsZXQgaSA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRcbiAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5jb250ZW50W2ldLmNhdGVnb3J5LnNvcnQgIT09IGN1cnJlbnRDYXRlZ29yeS5zb3J0KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KGkpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmNvbnRlbnRbMF0uY2F0ZWdvcnkuc29ydCAhPT0gY3VycmVudENhdGVnb3J5LnNvcnQpIHtcbiAgICAgIHRoaXMuc2VsZWN0KDApXG4gICAgfVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgaWYgKG5leHRQcm9wcy5xdWVyeSAhPT0gdGhpcy5wcm9wcy5xdWVyeSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobmV4dFN0YXRlLmNvbnRlbnQubGVuZ3RoICE9PSB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChuZXh0U3RhdGUuc2VsZWN0ZWQgIT09IHRoaXMuc3RhdGUuc2VsZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fb25LZXlQcmVzcywgZmFsc2UpXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9vbktleVByZXNzLCBmYWxzZSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAocHJvcHMucXVlcnkgIT09IHRoaXMucHJvcHMucXVlcnkpIHtcbiAgICAgIHRoaXMudXBkYXRlKHByb3BzLnF1ZXJ5IHx8IFwiXCIpXG4gICAgfVxuICB9XG5cbiAgbmF2aWdhdGVUbyh1cmwpIHtcbiAgICBpZiAoIS9eXFx3KzpcXC9cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gJ2h0dHA6Ly8nICsgdXJsXG4gICAgfVxuXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHVybFxuICB9XG5cbiAgb25LZXlQcmVzcyhlKSB7XG4gICAgaWYgKGUua2V5Q29kZSA9PSAxMykgeyAvLyBlbnRlclxuICAgICAgdGhpcy5uYXZpZ2F0ZVRvKHRoaXMuc3RhdGUuY29udGVudFt0aGlzLnN0YXRlLnNlbGVjdGVkXS51cmwpXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gNDApIHsgLy8gZG93biBhcnJvd1xuICAgICAgdGhpcy5zZWxlY3ROZXh0KClcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSAzOCkgeyAvLyB1cCBhcnJvd1xuICAgICAgdGhpcy5zZWxlY3RQcmV2aW91cygpXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gOSkgeyAvLyB0YWIga2V5XG4gICAgICB0aGlzLnNlbGVjdE5leHRDYXRlZ29yeSgpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy5jb3VudGVyID0gMFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzdWx0c1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHMtY2F0ZWdvcmllc1wiPlxuICAgICAgICAgIHt0aGlzLmNvbnRlbnRCeUNhdGVnb3J5KCkubWFwKGNhdGVnb3J5ID0+IHRoaXMucmVuZGVyQ2F0ZWdvcnkoY2F0ZWdvcnkpKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxTaWRlYmFyIHNlbGVjdGVkPXt0aGlzLmNvbnRlbnQoKVt0aGlzLnN0YXRlLnNlbGVjdGVkXX0gbWVzc2FnZXM9e3RoaXMubWVzc2FnZXN9IG9uVXBkYXRlVG9wU2l0ZXM9eygpID0+IHRoaXMub25VcGRhdGVUb3BTaXRlcygpfSB1cGRhdGVGbj17KCkgPT4gdGhpcy51cGRhdGUodGhpcy5wcm9wcy5xdWVyeSB8fCBcIlwiKX0gLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhclwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2F0ZWdvcnkoYykge1xuICAgIGNvbnN0IG92ZXJmbG93ID0gYy5jb2xsYXBzZWQgJiYgdGhpcy5zdGF0ZS5jb250ZW50W3RoaXMuc3RhdGUuc2VsZWN0ZWRdLmNhdGVnb3J5LnNvcnQgPCBjLnNvcnQgJiYgdGhpcy5jb3VudGVyIDwgTUFYX0lURU1TID8gYy5yb3dzLnNsaWNlKDAsIE1BWF9JVEVNUyAtIHRoaXMuY291bnRlcikgOiBbXVxuICAgIGNvbnN0IGNvbGxhcHNlZCA9IGMucm93cy5zbGljZShvdmVyZmxvdy5sZW5ndGgsIE1BWF9JVEVNUylcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YGNhdGVnb3J5ICR7Yy5jb2xsYXBzZWQgPyBcImNvbGxhcHNlZFwiIDogXCJcIn1gfT5cbiAgICAgICAge3RoaXMucmVuZGVyQ2F0ZWdvcnlUaXRsZShjKX1cbiAgICAgICAge292ZXJmbG93Lmxlbmd0aCA+IDAgPyA8ZGl2IGNsYXNzTmFtZT0nY2F0ZWdvcnktcm93cyBvdmVyZmxvdyc+XG4gICAgICAgICAge292ZXJmbG93Lm1hcCgocm93KSA9PiB0aGlzLnJlbmRlclJvdyhyb3cpKX1cbiAgICAgICAgPC9kaXY+IDogbnVsbH1cbiAgICAgICAgIHtjb2xsYXBzZWQubGVuZ3RoID4gMCA/IDxkaXYgY2xhc3NOYW1lPSdjYXRlZ29yeS1yb3dzJz5cbiAgICAgICAgICAgIHtjb2xsYXBzZWQubWFwKChyb3cpID0+IHRoaXMucmVuZGVyUm93KHJvdykpfVxuICAgICAgICAgPC9kaXY+IDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNhdGVnb3J5VGl0bGUoYykge1xuICAgIGlmICghYy50aXRsZSkgcmV0dXJuXG5cbiAgICBsZXQgdGl0bGUgPSBjLnRpdGxlXG4gICAgaWYgKHR5cGVvZiB0aXRsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGl0bGUgPSBjLnRpdGxlKHRoaXMucHJvcHMucXVlcnkpXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgPGgxIG9uQ2xpY2s9eygpID0+IHRoaXMuc2VsZWN0KGMucm93c1swXS5hYnNJbmRleCl9PlxuICAgICAgICAgIDxJY29uIHN0cm9rZT1cIjNcIiBuYW1lPVwicmlnaHRDaGV2cm9uXCIgLz5cbiAgICAgICAgICB7dGl0bGV9XG4gICAgICAgIDwvaDE+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJSb3cocm93KSB7XG4gICAgdGhpcy5jb3VudGVyKytcblxuICAgIHJldHVybiAoXG4gICAgICA8VVJMSWNvbiBjb250ZW50PXtyb3d9IG9uU2VsZWN0PXtyID0+IHRoaXMuc2VsZWN0KHIuaW5kZXgpfSBzZWxlY3RlZD17dGhpcy5zdGF0ZS5zZWxlY3RlZCA9PSByb3cuaW5kZXh9IC8+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgVVJMSWNvbiBmcm9tIFwiLi91cmwtaWNvblwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgdGhpcy5yZXN1bHRzID0gcmVzdWx0c1xuICAgIHRoaXMuc29ydCA9IHNvcnRcbiAgfVxuXG4gIGFkZChyb3dzKSB7XG4gICAgdGhpcy5yZXN1bHRzLmFkZFJvd3ModGhpcywgcm93cylcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoSW5wdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5fb25DbGljayA9IHRoaXMub25DbGljay5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5pbnB1dCkge1xuICAgICAgdGhpcy5pbnB1dC5mb2N1cygpXG4gICAgfVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgcmV0dXJuIG5leHRTdGF0ZS52YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uQ2xpY2spXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkNsaWNrKVxuICB9XG5cbiAgb25DbGljayhlKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudmFsdWUgPT09ICcnICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudC13cmFwcGVyIC5jb250ZW50JykuY29udGFpbnMoZS50YXJnZXQpKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQmx1cigpXG4gICAgfVxuICB9XG5cbiAgb25RdWVyeUNoYW5nZSh2YWx1ZSwga2V5Q29kZSkge1xuICAgIGlmIChrZXlDb2RlID09PSAxMykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25QcmVzc0VudGVyKHZhbHVlKVxuICAgIH1cblxuICAgIGlmIChrZXlDb2RlID09PSAyNykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25CbHVyKClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWUgfSlcblxuICAgIGlmICh0aGlzLnF1ZXJ5Q2hhbmdlVGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucXVlcnlDaGFuZ2VUaW1lcilcbiAgICAgIHRoaXMucXVlcnlDaGFuZ2VUaW1lciA9IDA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMub25RdWVyeUNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vblF1ZXJ5Q2hhbmdlKHZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWFyY2gtaW5wdXRcIj5cbiAgICAgICAge3RoaXMucmVuZGVySWNvbigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJJbnB1dCgpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySWNvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8SWNvbiBuYW1lPVwic2VhcmNoXCIgb25jbGljaz17KCkgPT4gdGhpcy5pbnB1dC5mb2N1cygpfSAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlcklucHV0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8aW5wdXQgdGFiaW5kZXg9XCIxXCJcbiAgICAgICAgcmVmPXtlbCA9PiB0aGlzLmlucHV0ID0gZWx9XG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXRcIlxuICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBvciBlbnRlciB3ZWJzaXRlIG5hbWUuXCJcbiAgICAgICAgb25Gb2N1cz17ZSA9PiB0aGlzLnByb3BzLm9uRm9jdXMoKX1cbiAgICAgICAgb25DaGFuZ2U9e2UgPT4gdGhpcy5vblF1ZXJ5Q2hhbmdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgb25LZXlVcD17ZSA9PiB0aGlzLm9uUXVlcnlDaGFuZ2UoZS50YXJnZXQudmFsdWUsIGUua2V5Q29kZSl9XG4gICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSAvPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImRlYm91bmNlLWZuXCJcbmltcG9ydCBDb250ZW50IGZyb20gXCIuL2NvbnRlbnRcIlxuaW1wb3J0IFNlYXJjaElucHV0IGZyb20gXCIuL3NlYXJjaC1pbnB1dFwiXG5pbXBvcnQgUmVzdWx0cyBmcm9tIFwiLi9yZXN1bHRzXCJcbmltcG9ydCBNZXNzYWdpbmcgZnJvbSBcIi4vbWVzc2FnaW5nXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1lc3NhZ2luZygpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlkOiAwLFxuICAgICAgcm93czoge30sXG4gICAgICByb3dzQXZhaWxhYmxlOiA1LFxuICAgICAgcXVlcnk6ICcnLFxuICAgICAgZm9jdXNlZDogZmFsc2VcbiAgICB9KVxuXG4gICAgdGhpcy5fb25RdWVyeUNoYW5nZSA9IGRlYm91bmNlKHRoaXMub25RdWVyeUNoYW5nZS5iaW5kKHRoaXMpLCA1MClcbiAgfVxuXG4gIGlkKCkge1xuICAgIHJldHVybiArK3RoaXMuc3RhdGUuaWRcbiAgfVxuXG4gIG9uRm9jdXMoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c2VkOiB0cnVlXG4gICAgfSlcbiAgfVxuXG4gIG9uQmx1cigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvY3VzZWQ6IGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIG9uUHJlc3NFbnRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZCkge1xuICAgICAgdGhpcy5uYXZpZ2F0ZVRvKHRoaXMuc3RhdGUuc2VsZWN0ZWQudXJsKVxuICAgIH1cbiAgfVxuXG4gIG9uU2VsZWN0KHJvdykge1xuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkICYmIHRoaXMuc3RhdGUuc2VsZWN0ZWQuaWQgPT09IHJvdy5pZCkgcmV0dXJuXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOiByb3dcbiAgICB9KVxuICB9XG5cbiAgb25RdWVyeUNoYW5nZShxdWVyeSkge1xuICAgIHF1ZXJ5ID0gcXVlcnkudHJpbSgpXG5cbiAgICBpZiAocXVlcnkgPT09IHRoaXMuc3RhdGUucXVlcnkpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByb3dzOiB7fSxcbiAgICAgIHJvd3NBdmFpbGFibGU6IDUsXG4gICAgICBzZWxlY3RlZDogbnVsbCxcbiAgICAgIGlkOiAwLFxuICAgICAgcXVlcnlcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Q29udGVudCB3YWxscGFwZXI9e3RoaXMucHJvcHMud2FsbHBhcGVyfSBmb2N1c2VkPXt0aGlzLnN0YXRlLmZvY3VzZWR9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnQtaW5uZXJcIj5cbiAgICAgICAgICA8U2VhcmNoSW5wdXQgb25QcmVzc0VudGVyPXsoKSA9PiB0aGlzLm9uUHJlc3NFbnRlcigpfVxuICAgICAgICAgICAgb25RdWVyeUNoYW5nZT17dGhpcy5fb25RdWVyeUNoYW5nZX1cbiAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHRoaXMub25Gb2N1cygpfVxuICAgICAgICAgICAgb25CbHVyPXsoKSA9PiB0aGlzLm9uQmx1cigpfSAvPlxuICAgICAgICAgICAgPFJlc3VsdHMgZm9jdXNlZD17dGhpcy5zdGF0ZS5mb2N1c2VkfSBxdWVyeT17dGhpcy5zdGF0ZS5xdWVyeX0gLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0NvbnRlbnQ+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUmVzdWx0cygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzdWx0cy1yb3dzXCI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxufVxuXG5mdW5jdGlvbiBzb3J0TGlrZXMoYSwgYikge1xuICBpZiAoYS5saWtlZF9hdCA8IGIubGlrZWRfYXQpIHJldHVybiAxXG4gIGlmIChhLmxpa2VkX2F0ID4gYi5saWtlZF9hdCkgcmV0dXJuIC0xXG4gIHJldHVybiAwXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuaW1wb3J0IHNlY3Rpb25zIGZyb20gJy4uL2Nocm9tZS9zZXR0aW5ncy1zZWN0aW9ucydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZ3MgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgc2VjdGlvbnMuZm9yRWFjaChzID0+IHRoaXMubG9hZFNlY3Rpb24ocykpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKCkge1xuICAgIHNlY3Rpb25zLmZvckVhY2gocyA9PiB0aGlzLmxvYWRTZWN0aW9uKHMpKVxuICB9XG5cbiAgbG9hZFNlY3Rpb24ocykge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtc2V0dGluZ3MtdmFsdWUnLCBrZXk6IHMua2V5IH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLm9uRXJyb3IocmVzcC5lcnJvcilcbiAgICAgIGNvbnN0IHUgPSB7fVxuICAgICAgdVtzLmtleV0gPSByZXNwLmNvbnRlbnQudmFsdWVcbiAgICAgIHRoaXMuc2V0U3RhdGUodSlcbiAgICB9KVxuICB9XG5cbiAgb25DaGFuZ2UodmFsdWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnc2V0LXNldHRpbmdzLXZhbHVlJywga2V5OiBvcHRpb25zLmtleSwgdmFsdWUgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMub25FcnJvcihyZXNwLmVycm9yKVxuXG4gICAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgb25FcnJvcihlcnJvcikge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXJyb3JcbiAgICB9KVxuXG4gICAgaWYgKHRoaXMucHJvcHMub25FcnJvcikge1xuICAgICAgdGhpcy5wcm9wcy5vbkVycm9yKGVycm9yKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BzZXR0aW5ncyAke3RoaXMuc3RhdGUub3BlbiA/IFwib3BlblwiIDogXCJcIn1gfT5cbiAgICAgICAgPEljb24gb25DbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG9wZW46IHRydWUgfSl9IG5hbWU9XCJzZXR0aW5nc1wiIC8+XG4gICAgICAgIHt0aGlzLnJlbmRlclNldHRpbmdzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZXR0aW5ncygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50XCI+XG4gICAgICAgIHt0aGlzLnJlbmRlckNsb3NlQnV0dG9uKCl9XG4gICAgICAgIDxoMT5TZXR0aW5nczwvaDE+XG4gICAgICAgIDxoMj5DdXN0b21pemUgeW91ciBuZXcgdGFiIG1hZGUgYnkgPGEgaHJlZj1cImh0dHBzOi8vZ2V0a296bW9zLmNvbVwiPktvem1vczwvYT4uPC9oMj5cbiAgICAgICAge3RoaXMucmVuZGVyU2VjdGlvbnMoKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXJcIj5cbiAgICAgICAgICA8YnV0dG9uIG9uY2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBvcGVuOiBmYWxzZSB9KX0+XG4gICAgICAgICAgICBEb25lXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2VjdGlvbnMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbnNcIj5cbiAgICAgICAge3NlY3Rpb25zLm1hcChzID0+IHRoaXMucmVuZGVyU2VjdGlvbihzKSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZWN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5wcm9wcy50eXBlICYmICFvcHRpb25zW3RoaXMucHJvcHMudHlwZV0pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9e2BzZXR0aW5nICR7b3B0aW9ucy5rZXl9YH0+XG4gICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJjaGVja2JveFwiIGlkPXtvcHRpb25zLmtleX0gbmFtZT17b3B0aW9ucy5rZXl9IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3RoaXMuc3RhdGVbb3B0aW9ucy5rZXldfSBvbkNoYW5nZT17ZSA9PiB0aGlzLm9uQ2hhbmdlKGUudGFyZ2V0LmNoZWNrZWQsIG9wdGlvbnMpfSAvPlxuICAgICAgICA8bGFiZWwgdGl0bGU9e29wdGlvbnMuZGVzY30gaHRtbEZvcj17b3B0aW9ucy5rZXl9PntvcHRpb25zLnRpdGxlfTwvbGFiZWw+XG4gICAgICAgIDxwPntvcHRpb25zLmRlc2N9PC9wPlxuICAgICAgPC9zZWN0aW9uPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsb3NlQnV0dG9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8SWNvbiBzdHJva2U9XCIzXCIgbmFtZT1cImNsb3NlXCIgb25DbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG9wZW46IGZhbHNlIH0pfSAvPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgeyBjbGVhbiBhcyBjbGVhblVSTCB9IGZyb20gXCJ1cmxzXCJcbmltcG9ydCByZWxhdGl2ZURhdGUgZnJvbSBcInJlbGF0aXZlLWRhdGVcIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5pbXBvcnQgVVJMSW1hZ2UgZnJvbSBcIi4vdXJsLWltYWdlXCJcbmltcG9ydCB7IGhpZGUgYXMgaGlkZVRvcFNpdGUgfSBmcm9tICcuL3RvcC1zaXRlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lkZWJhciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAoIXByb3BzLnNlbGVjdGVkKSByZXR1cm5cbiAgICBwcm9wcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ2dldC1saWtlJywgdXJsOiBwcm9wcy5zZWxlY3RlZC51cmwgfSwgcmVzcCA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbGlrZTogcmVzcC5jb250ZW50Lmxpa2VcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGRlbGV0ZVRvcFNpdGUoKSB7XG4gICAgaGlkZVRvcFNpdGUodGhpcy5wcm9wcy5zZWxlY3RlZC51cmwpXG4gICAgdGhpcy5wcm9wcy51cGRhdGVGbigpXG4gIH1cblxuICB0b2dnbGVMaWtlKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmxpa2UpIHRoaXMudW5saWtlKClcbiAgICBlbHNlIHRoaXMubGlrZSgpXG4gIH1cblxuICBsaWtlKCkge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdsaWtlJywgdXJsOiB0aGlzLnByb3BzLnNlbGVjdGVkLnVybCB9LCByZXNwID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsaWtlOiByZXNwLmNvbnRlbnQubGlrZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgdW5saWtlKCkge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICd1bmxpa2UnLCB1cmw6IHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsIH0sIHJlc3AgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxpa2U6IG51bGxcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuc2VsZWN0ZWQpIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2lkZWJhclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltYWdlXCI+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwibGlua1wiIGhyZWY9e3RoaXMucHJvcHMuc2VsZWN0ZWQudXJsfT5cbiAgICAgICAgICAgIDxVUkxJbWFnZSBjb250ZW50PXt0aGlzLnByb3BzLnNlbGVjdGVkfSAvPlxuICAgICAgICAgICAgPGgxPnt0aGlzLnByb3BzLnNlbGVjdGVkLnRpdGxlfTwvaDE+XG4gICAgICAgICAgICA8aDI+e2NsZWFuVVJMKHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsKX08L2gyPlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJCdXR0b25zKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQnV0dG9ucygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidXR0b25zXCI+XG4gICAgICAgIHt0aGlzLnJlbmRlckxpa2VCdXR0b24oKX1cbiAgICAgICAge3RoaXMucHJvcHMuc2VsZWN0ZWQudHlwZSA9PT0gJ3RvcCcgPyB0aGlzLnJlbmRlckRlbGV0ZVRvcFNpdGVCdXR0b24oKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJMaWtlQnV0dG9uKCkge1xuICAgIGNvbnN0IGFnbyA9IHRoaXMuc3RhdGUubGlrZSA/IHJlbGF0aXZlRGF0ZSh0aGlzLnN0YXRlLmxpa2UubGlrZWRBdCkgOiBcIlwiXG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLnN0YXRlLmxpa2UgPyBcIkRlbGV0ZSBJdCBGcm9tIFlvdXIgTGlrZXNcIiA6IFwiQWRkIEl0IFRvIFlvdXIgTGlrZXNcIlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgdGl0bGU9e3RpdGxlfSBjbGFzc05hbWU9e2BidXR0b24gbGlrZS1idXR0b24gJHt0aGlzLnN0YXRlLmxpa2U/IFwibGlrZWRcIiA6IFwiXCJ9YH0gb25DbGljaz17KCkgPT4gdGhpcy50b2dnbGVMaWtlKCl9PlxuICAgICAgICA8SWNvbiBuYW1lPVwiaGVhcnRcIiAvPlxuICAgICAgICB7dGhpcy5zdGF0ZS5saWtlID8gYExpa2VkICR7YWdvfWAgOiBcIkxpa2UgSXRcIn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckRlbGV0ZVRvcFNpdGVCdXR0b24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgdGl0bGU9XCJEZWxldGUgSXQgRnJvbSBGcmVxdWVudGx5IFZpc2l0ZWRcIiBjbGFzc05hbWU9XCJidXR0b24gZGVsZXRlLWJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHRoaXMuZGVsZXRlVG9wU2l0ZSgpfT5cbiAgICAgICAgPEljb24gbmFtZT1cInRyYXNoXCIgLz5cbiAgICAgICAgRGVsZXRlIEl0XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxufVxuIiwiaW1wb3J0IHRpdGxlRnJvbVVSTCBmcm9tIFwidGl0bGUtZnJvbS11cmxcIlxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZCh0aXRsZSkge1xuICBjb25zdCBhYnNsZW4gPSB0aXRsZS5yZXBsYWNlKC9bXlxcd10rL2csICcnKS5sZW5ndGhcbiAgcmV0dXJuIGFic2xlbiA+PSAyICYmICEvXmh0dHBcXHc/OlxcL1xcLy8udGVzdCh0aXRsZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZSh0aXRsZSkge1xuICByZXR1cm4gdGl0bGUudHJpbSgpLnJlcGxhY2UoL15cXChcXGQrXFwpLywgJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUZyb21VUkwodXJsKSB7XG4gIHJldHVybiB0aXRsZUZyb21VUkwodXJsKVxufVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvcFNpdGVzIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMudGl0bGUgPSAnRnJlcXVlbnRseSBWaXNpdGVkJ1xuICAgIHRoaXMubmFtZSA9ICd0b3AnXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBpZiAocXVlcnkubGVuZ3RoID4gMCkgcmV0dXJuIHRoaXMuYWRkKFtdKVxuICAgIGdldChyb3dzID0+IHRoaXMuYWRkKGFkZEtvem1vcyhyb3dzLnNsaWNlKDAsIDUpKSkpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkS296bW9zIChyb3dzKSB7XG4gIGxldCBpID0gcm93cy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChyb3dzW2ldLnVybC5pbmRleE9mKCdnZXRrb3ptb3MuY29tJykgPiAtMSkge1xuICAgICAgcmV0dXJuIHJvd3NcbiAgICB9XG4gIH1cblxuICByb3dzWzRdID0ge1xuICAgIHVybDogJ2h0dHBzOi8vZ2V0a296bW9zLmNvbScsXG4gICAgdGl0bGU6ICdLb3ptb3MnXG4gIH1cblxuICByZXR1cm4gcm93c1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0IChjYWxsYmFjaykge1xuICBjaHJvbWUudG9wU2l0ZXMuZ2V0KHRvcFNpdGVzID0+IHtcbiAgICBjYWxsYmFjayhmaWx0ZXIodG9wU2l0ZXMpKVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlkZSAodXJsKSB7XG4gIGxldCBoaWRkZW4gPSBnZXRIaWRkZW5Ub3BTaXRlcygpXG4gIGhpZGRlblt1cmxdID0gdHJ1ZVxuICBzZXRIaWRkZW5Ub3BTaXRlcyhoaWRkZW4pXG59XG5cbmZ1bmN0aW9uIGdldEhpZGRlblRvcFNpdGVzICgpIHtcbiAgbGV0IGxpc3QgPSB7fVxuICB0cnkge1xuICAgIGxpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVsnaGlkZGVuLXRvcGxpc3QnXSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgc2V0SGlkZGVuVG9wU2l0ZXMobGlzdClcbiAgfVxuXG4gIHJldHVybiBsaXN0XG59XG5cbmZ1bmN0aW9uIHNldEhpZGRlblRvcFNpdGVzKGxpc3QpIHtcbiAgbG9jYWxTdG9yYWdlWydoaWRkZW4tdG9wbGlzdCddID0gSlNPTi5zdHJpbmdpZnkobGlzdClcbn1cblxuZnVuY3Rpb24gZmlsdGVyKHRvcFNpdGVzKSB7XG4gIGNvbnN0IGhpZGUgPSBnZXRIaWRkZW5Ub3BTaXRlcygpXG4gIHJldHVybiB0b3BTaXRlcy5maWx0ZXIocm93ID0+ICFoaWRlW3Jvdy51cmxdKVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgaW1nIGZyb20gXCJpbWdcIlxuaW1wb3J0IHsgY2xlYW4gYXMgY2xlYW5VUkwgfSBmcm9tIFwidXJsc1wiXG5pbXBvcnQgKiBhcyB0aXRsZXMgZnJvbSBcIi4vdGl0bGVzXCJcbmltcG9ydCBVUkxJbWFnZSBmcm9tICcuL3VybC1pbWFnZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVVJMSWNvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jb250ZW50LnVybCAhPT0gbmV4dFByb3BzLmNvbnRlbnQudXJsIHx8XG4gICAgICB0aGlzLnByb3BzLnNlbGVjdGVkICE9PSBuZXh0UHJvcHMuc2VsZWN0ZWQgfHxcbiAgICAgIHRoaXMucHJvcHMudHlwZSAhPT0gbmV4dFByb3BzLnR5cGVcbiAgfVxuXG4gIHNlbGVjdCgpIHtcbiAgICB0aGlzLnByb3BzLm9uU2VsZWN0KHRoaXMucHJvcHMuY29udGVudClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGEgaWQ9e3RoaXMucHJvcHMuY29udGVudC5pZH0gY2xhc3NOYW1lPXtgdXJsaWNvbiAke3RoaXMucHJvcHMuc2VsZWN0ZWQgPyBcInNlbGVjdGVkXCIgOiBcIlwifWB9IGhyZWY9e3RoaXMudXJsKCl9IHRpdGxlPXtgJHt0aGlzLnRpdGxlKCl9IC0gJHtjbGVhblVSTCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKX1gfSBvbk1vdXNlTW92ZT17KCkgPT4gdGhpcy5zZWxlY3QoKX0+XG4gICAgICAgIDxVUkxJbWFnZSBjb250ZW50PXt0aGlzLnByb3BzLmNvbnRlbnR9IGljb24tb25seSAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAge3RoaXMudGl0bGUoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXJsXCI+XG4gICAgICAgICAge3RoaXMucHJldHR5VVJMKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyXCI+PC9kaXY+XG4gICAgICA8L2E+XG4gICAgKVxuICB9XG5cbiAgdGl0bGUoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC50eXBlID09PSAnc2VhcmNoLXF1ZXJ5Jykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY29udGVudC50aXRsZVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNvbnRlbnQudHlwZSA9PT0gJ3VybC1xdWVyeScpIHtcbiAgICAgIHJldHVybiBgT3BlbiAke2NsZWFuVVJMKHRoaXMucHJvcHMuY29udGVudC51cmwpfWBcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jb250ZW50LnRpdGxlICYmIHRpdGxlcy5pc1ZhbGlkKHRoaXMucHJvcHMuY29udGVudC50aXRsZSkpIHtcbiAgICAgIHJldHVybiB0aXRsZXMubm9ybWFsaXplKHRoaXMucHJvcHMuY29udGVudC50aXRsZSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGl0bGVzLmdlbmVyYXRlRnJvbVVSTCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKVxuICB9XG5cbiAgdXJsKCkge1xuICAgIGlmICgvXmh0dHBzPzpcXC9cXC8vLnRlc3QodGhpcy5wcm9wcy5jb250ZW50LnVybCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmNvbnRlbnQudXJsXG4gICAgfVxuXG4gICAgcmV0dXJuICdodHRwOi8vJyArIHRoaXMucHJvcHMuY29udGVudC51cmxcbiAgfVxuXG4gIHByZXR0eVVSTCgpIHtcbiAgICByZXR1cm4gY2xlYW5VUkwodGhpcy51cmwoKSlcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgaW1nIGZyb20gJ2ltZydcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuaW1wb3J0IHJhbmRvbUNvbG9yIGZyb20gXCJyYW5kb20tY29sb3JcIlxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBjb25zdCBwb3B1bGFySWNvbnMgPSB7XG4gICdmYWNlYm9vay5jb20nOiAnaHR0cHM6Ly9zdGF0aWMueHguZmJjZG4ubmV0L3JzcmMucGhwL3YzL3l4L3IvTjRIXzUwS0ZwOGkucG5nJyxcbiAgJ3R3aXR0ZXIuY29tJzogJ2h0dHBzOi8vbWEtMC50d2ltZy5jb20vdHdpdHRlci1hc3NldHMvcmVzcG9uc2l2ZS13ZWIvd2ViL2x0ci9pY29uLWlvcy5hOWNkODg1YmNjYmNhZjJmLnBuZycsXG4gICd5b3V0dWJlLmNvbSc6ICdodHRwczovL3d3dy55b3V0dWJlLmNvbS95dHMvaW1nL2Zhdmljb25fOTYtdmZsVzlFYzB3LnBuZycsXG4gICdhbWF6b24uY29tJzogJ2h0dHBzOi8vaW1hZ2VzLW5hLnNzbC1pbWFnZXMtYW1hem9uLmNvbS9pbWFnZXMvRy8wMS9hbnl3aGVyZS9hX3NtaWxlXzEyMHgxMjAuX0NCMzY4MjQ2NTczXy5wbmcnLFxuICAnZ29vZ2xlLmNvbSc6ICdodHRwczovL3d3dy5nb29nbGUuY29tL2ltYWdlcy9icmFuZGluZy9wcm9kdWN0X2lvcy8yeC9nc2FfaW9zXzYwZHAucG5nJyxcbiAgJ3lhaG9vLmNvbSc6ICdodHRwczovL3d3dy55YWhvby5jb20vYXBwbGUtdG91Y2gtaWNvbi1wcmVjb21wb3NlZC5wbmcnLFxuICAncmVkZGl0LmNvbSc6ICdodHRwczovL3d3dy5yZWRkaXRzdGF0aWMuY29tL213ZWIyeC9mYXZpY29uLzEyMHgxMjAucG5nJyxcbiAgJ2luc3RhZ3JhbS5jb20nOiAnaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9zdGF0aWMvaW1hZ2VzL2ljby9hcHBsZS10b3VjaC1pY29uLTEyMHgxMjAtcHJlY29tcG9zZWQucG5nLzAwNDcwNWM5MzUzZi5wbmcnLFxuICAnZ2V0a296bW9zLmNvbSc6ICdodHRwczovL2dldGtvem1vcy5jb20vcHVibGljL2xvZ29zL2tvem1vcy1oZWFydC1sb2dvLTEwMHB4LnBuZycsXG4gICdnaXRodWIuY29tJzogJ2h0dHBzOi8vYXNzZXRzLWNkbi5naXRodWIuY29tL3Bpbm5lZC1vY3RvY2F0LnN2ZycsXG4gICdnaXN0LmdpdGh1Yi5jb20nOiAnaHR0cHM6Ly9hc3NldHMtY2RuLmdpdGh1Yi5jb20vcGlubmVkLW9jdG9jYXQuc3ZnJyxcbiAgJ21haWwuZ29vZ2xlLmNvbSc6ICdodHRwczovL3d3dy5nb29nbGUuY29tL2ltYWdlcy9pY29ucy9wcm9kdWN0L2dvb2dsZW1haWwtMTI4LnBuZycsXG4gICdwYXlwYWwuY29tJzogJ2h0dHBzOi8vd3d3LnBheXBhbG9iamVjdHMuY29tL3dlYnN0YXRpYy9pY29uL3BwMTQ0LnBuZycsXG4gICdpbWRiLmNvbSc6ICdodHRwOi8vaWEubWVkaWEtaW1kYi5jb20vaW1hZ2VzL0cvMDEvaW1kYi9pbWFnZXMvZGVza3RvcC1mYXZpY29uLTIxNjU4MDY5NzAuX0NCNTIyNzM2NTYxXy5pY28nLFxuICAnZW4ud2lraXBlZGlhLm9yZyc6ICdodHRwczovL2VuLndpa2lwZWRpYS5vcmcvc3RhdGljL2Zhdmljb24vd2lraXBlZGlhLmljbycsXG4gICd3aWtpcGVkaWEub3JnJzogJ2h0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy9zdGF0aWMvZmF2aWNvbi93aWtpcGVkaWEuaWNvJyxcbiAgJ2VzcG4uY29tJzogJ2h0dHA6Ly9hLmVzcG5jZG4uY29tL2Zhdmljb24uaWNvJyxcbiAgJ3R3aXRjaC50dic6ICdodHRwczovL3N0YXRpYy50d2l0Y2hjZG4ubmV0L2Fzc2V0cy9mYXZpY29uLTc1MjcwZjlkZjJiMDcxNzRjMjNjZTg0NGEwM2Q4NGFmLmljbycsXG4gICdjbm4uY29tJzogJ2h0dHA6Ly9jZG4uY25uLmNvbS9jbm4vLmUvaW1nLzMuMC9nbG9iYWwvbWlzYy9hcHBsZS10b3VjaC1pY29uLnBuZycsXG4gICdvZmZpY2UuY29tJzogJ2h0dHBzOi8vc2Vhb2ZmaWNlaG9tZS5tc29jZG4uY29tL3MvNzA0NzQ1MmUvSW1hZ2VzL2Zhdmljb25fbWV0cm8uaWNvJyxcbiAgJ2JhbmtvZmFtZXJpY2EuY29tJzogJ2h0dHBzOi8vd3d3MS5iYWMtYXNzZXRzLmNvbS9ob21lcGFnZS9zcGEtYXNzZXRzL2ltYWdlcy9hc3NldHMtaW1hZ2VzLWdsb2JhbC1mYXZpY29uLWZhdmljb24tQ1NYMzg2YjMzMmQuaWNvJyxcbiAgJ2NoYXNlLmNvbSc6ICdodHRwczovL3d3dy5jaGFzZS5jb20vZXRjL2Rlc2lnbnMvY2hhc2UtdXgvZmF2aWNvbi0xNTIucG5nJyxcbiAgJ255dGltZXMuY29tJzogJ2h0dHBzOi8vc3RhdGljMDEubnl0LmNvbS9pbWFnZXMvaWNvbnMvaW9zLWlwYWQtMTQ0eDE0NC5wbmcnLFxuICAnYXBwbGUuY29tJzogJ2h0dHBzOi8vd3d3LmFwcGxlLmNvbS9mYXZpY29uLmljbycsXG4gICd3ZWxsc2ZhcmdvLmNvbSc6ICdodHRwczovL3d3dy53ZWxsc2ZhcmdvLmNvbS9hc3NldHMvaW1hZ2VzL2ljb25zL2FwcGxlLXRvdWNoLWljb24tMTIweDEyMC5wbmcnLFxuICAneWVscC5jb20nOiAnaHR0cHM6Ly9zMy1tZWRpYTIuZmwueWVscGNkbi5jb20vYXNzZXRzL3NydjAveWVscF9zdHlsZWd1aWRlLzExOGZmNDc1YTM0MS9hc3NldHMvaW1nL2xvZ29zL2Zhdmljb24uaWNvJyxcbiAgJ3dvcmRwcmVzcy5jb20nOiAnaHR0cDovL3MwLndwLmNvbS9pL3dlYmNsaXAucG5nJyxcbiAgJ2Ryb3Bib3guY29tJzogJ2h0dHBzOi8vY2ZsLmRyb3Bib3hzdGF0aWMuY29tL3N0YXRpYy9pbWFnZXMvZmF2aWNvbi12ZmxVZUxlZVkuaWNvJyxcbiAgJ21haWwuc3VwZXJodW1hbi5jb20nOiAnaHR0cHM6Ly9zdXBlcmh1bWFuLmNvbS9idWlsZC83MTIyMmJkYzE2OWU1OTA2YzI4MjQ3ZWQ1YjdjZjBlZC5zaGFyZS1pY29uLnBuZycsXG4gICdhd3MuYW1hem9uLmNvbSc6ICdodHRwczovL2EwLmF3c3N0YXRpYy5jb20vbGlicmEtY3NzL2ltYWdlcy9zaXRlL3RvdWNoLWljb24taXBob25lLTExNC1zbWlsZS5wbmcnLFxuICAnY29uc29sZS5hd3MuYW1hem9uLmNvbSc6ICdodHRwczovL2EwLmF3c3N0YXRpYy5jb20vbGlicmEtY3NzL2ltYWdlcy9zaXRlL3RvdWNoLWljb24taXBob25lLTExNC1zbWlsZS5wbmcnLFxuICAndXMtd2VzdC0yLmNvbnNvbGUuYXdzLmFtYXpvbi5jb20nOiAnaHR0cHM6Ly9hMC5hd3NzdGF0aWMuY29tL2xpYnJhLWNzcy9pbWFnZXMvc2l0ZS90b3VjaC1pY29uLWlwaG9uZS0xMTQtc21pbGUucG5nJyxcbiAgJ3N0YWNrb3ZlcmZsb3cuY29tJzogJ2h0dHBzOi8vY2RuLnNzdGF0aWMubmV0L1NpdGVzL3N0YWNrb3ZlcmZsb3cvaW1nL2FwcGxlLXRvdWNoLWljb24ucG5nJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVUkxJbWFnZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5fcmVmcmVzaFNvdXJjZSA9IGRlYm91bmNlKHRoaXMucmVmcmVzaFNvdXJjZS5iaW5kKHRoaXMpKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICh0aGlzLnByb3BzLmNvbnRlbnQudXJsICE9PSBwcm9wcy5jb250ZW50LnVybCkge1xuICAgICAgdGhpcy5fcmVmcmVzaFNvdXJjZShwcm9wcy5jb250ZW50KVxuICAgIH1cbiAgfVxuXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgIGlmIChuZXh0UHJvcHMuY29udGVudC51cmwgIT09IHRoaXMucHJvcHMuY29udGVudC51cmwpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG5leHRTdGF0ZS5zcmMgIT09IHRoaXMuc3RhdGUuc3JjKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChuZXh0U3RhdGUubG9hZGluZyAhPT0gdGhpcy5zdGF0ZS5sb2FkaW5nIHx8IG5leHRTdGF0ZS5lcnJvciAhPT0gdGhpcy5zdGF0ZS5lcnJvcikge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAoKCFuZXh0UHJvcHMuY29udGVudC5pbWFnZXMgfHwgdGhpcy5wcm9wcy5jb250ZW50LmltYWdlcykgfHwgKG5leHRQcm9wcy5jb250ZW50LmltYWdlcyB8fCAhdGhpcy5wcm9wcy5jb250ZW50LmltYWdlcykgfHwgKG5leHRQcm9wcy5jb250ZW50LmltYWdlc1swXSAhPT0gdGhpcy5wcm9wcy5jb250ZW50LmltYWdlc1swXSkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdGhpcy5yZWZyZXNoU291cmNlKClcbiAgfVxuXG4gIHJlZnJlc2hTb3VyY2UoY29udGVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY29sb3I6IHJhbmRvbUNvbG9yKDEwMCwgNTApXG4gICAgfSlcblxuICAgIHRoaXMuZmluZFNvdXJjZShjb250ZW50KVxuICAgIHRoaXMucHJlbG9hZCh0aGlzLnN0YXRlLnNyYylcbiAgfVxuXG4gIGZpbmRTb3VyY2UoY29udGVudCkge1xuICAgIGNvbnRlbnQgfHwgKGNvbnRlbnQgPSB0aGlzLnByb3BzLmNvbnRlbnQpXG5cbiAgICBpZiAoIXRoaXMucHJvcHNbJ2ljb24tb25seSddICYmIGNvbnRlbnQuaW1hZ2VzICYmIGNvbnRlbnQuaW1hZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdHlwZTogJ2ltYWdlJyxcbiAgICAgICAgc3JjOiBjb250ZW50LmltYWdlc1swXVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoY29udGVudC5pY29uKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHR5cGU6ICdpY29uJyxcbiAgICAgICAgc3JjOiBhYnNvbHV0ZUljb25VUkwoY29udGVudClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgaG9zdG5hbWUgPSBmaW5kSG9zdG5hbWUoY29udGVudC51cmwpXG4gICAgaWYgKHBvcHVsYXJJY29uc1tob3N0bmFtZV0pIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdHlwZTogJ3BvcHVsYXItaWNvbicsXG4gICAgICAgIHNyYzogcG9wdWxhckljb25zW2hvc3RuYW1lXVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHR5cGU6ICdmYXZpY29uJyxcbiAgICAgIHNyYzogJ2h0dHA6Ly8nICsgaG9zdG5hbWUgKyAnL2Zhdmljb24uaWNvJ1xuICAgIH0pXG4gIH1cblxuICBwcmVsb2FkKHNyYykge1xuICAgIGlmICh0aGlzLnN0YXRlLmxvYWRpbmcgJiYgdGhpcy5zdGF0ZS5sb2FkaW5nRm9yID09PSB0aGlzLnByb3BzLmNvbnRlbnQudXJsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIGxvYWRpbmdGb3I6IHRoaXMucHJvcHMuY29udGVudC51cmwsXG4gICAgICBsb2FkaW5nU3JjOiBzcmMsXG4gICAgICBzcmM6IHRoaXMuY2FjaGVkSWNvblVSTCgpXG4gICAgfSlcblxuICAgIGltZyhzcmMsIGVyciA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5sb2FkaW5nU3JjICE9PSBzcmMpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgIGVycm9yOiBlcnIsXG4gICAgICAgICAgc3JjOiB0aGlzLmNhY2hlZEljb25VUkwoKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc3JjOiBzcmMsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmxvYWRpbmcgfHwgdGhpcy5zdGF0ZS5lcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGluZygpXG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6IGB1cmwoJHt0aGlzLnN0YXRlLnNyY30pYFxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YHVybC1pbWFnZSAke3RoaXMuc3RhdGUudHlwZX1gfSBzdHlsZT17c3R5bGV9PjwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckxvYWRpbmcoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuc3RhdGUuY29sb3JcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLWVycm9yPXt0aGlzLnN0YXRlLmVycm9yfSBkYXRhLXR5cGU9e3RoaXMuc3RhdGUudHlwZX0gZGF0YS1zcmM9e3RoaXMuc3RhdGUuc3JjfSBjbGFzc05hbWU9XCJ1cmwtaW1hZ2UgZ2VuZXJhdGVkLWltYWdlIGNlbnRlclwiIHN0eWxlPXtzdHlsZX0+XG4gICAgICAgIDxzcGFuPlxuICAgICAgICAgIHtmaW5kSG9zdG5hbWUodGhpcy5wcm9wcy5jb250ZW50LnVybCkuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgY2FjaGVkSWNvblVSTCgpIHtcbiAgICByZXR1cm4gJ2Nocm9tZTovL2Zhdmljb24vc2l6ZS83Mi8nICsgZmluZFByb3RvY29sKHRoaXMucHJvcHMuY29udGVudC51cmwpICsgJzovLycgKyBmaW5kSG9zdG5hbWUodGhpcy5wcm9wcy5jb250ZW50LnVybClcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGFic29sdXRlSWNvblVSTCAobGlrZSkge1xuICBpZiAoL15odHRwcz86XFwvXFwvLy50ZXN0KGxpa2UuaWNvbikpIHJldHVybiBsaWtlLmljb25cbiAgcmV0dXJuICdodHRwOlxcL1xcLycgKyBqb2luKGZpbmRIb3N0bmFtZShsaWtlLnVybCksIGxpa2UuaWNvbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRIb3N0bmFtZSh1cmwpIHtcbiAgcmV0dXJuIHVybC5yZXBsYWNlKC9eXFx3KzpcXC9cXC8vLCAnJykuc3BsaXQoJy8nKVswXS5yZXBsYWNlKC9ed3d3XFwuLywgJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUHJvdG9jb2wodXJsKSB7XG4gIGlmICghL15odHRwcz86XFwvXFwvLy50ZXN0KHVybCkpIHJldHVybiAnaHR0cCdcbiAgcmV0dXJuIHVybC5zcGxpdCgnOi8vJylbMF1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IGltZyBmcm9tIFwiaW1nXCJcbmltcG9ydCB3YWxscGFwZXJzIGZyb20gJy4vd2FsbHBhcGVycydcbmNvbnN0IE9ORV9EQVkgPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGxwYXBlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgc2V0VGltZW91dCh0aGlzLmNhY2hlVG9tb3Jyb3coKSwgMTAwMClcbiAgfVxuXG4gIHRvZGF5KCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKClcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKVxuICAgIGNvbnN0IGRpZmYgPSAobm93IC0gc3RhcnQpICsgKChzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpIC0gbm93LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNjAgKiAxMDAwKVxuICAgIHJldHVybiBNYXRoLmZsb29yKGRpZmYgLyBPTkVfREFZKVxuICB9XG5cbiAgc2VsZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHdhbGxwYXBlcnNbdGhpcy50b2RheSgpICUgd2FsbHBhcGVycy5sZW5ndGhdXG4gIH1cblxuICBjYWNoZVRvbW9ycm93KCkge1xuICAgIGNvbnN0IHVybCA9IHdhbGxwYXBlcnNbKHRoaXMudG9kYXkoKSArIDEpICUgd2FsbHBhcGVycy5sZW5ndGhdLnVybFxuICAgIGlmIChsb2NhbFN0b3JhZ2VbJ2xhc3Qtd2FsbHBhcGVyLWNhY2hlJ10gPT09IHVybCkgcmV0dXJuXG5cbiAgICBpbWcodXJsLCBlcnIgPT4ge1xuICAgICAgbG9jYWxTdG9yYWdlWydsYXN0LXdhbGxwYXBlci1jYWNoZSddID0gdXJsXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQoKVxuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7c2VsZWN0ZWQudXJsfSlgXG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdGVkLnBvc2l0aW9uKSB7XG4gICAgICBzdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBzZWxlY3RlZC5wb3NpdGlvblxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhbGxwYXBlclwiIHN0eWxlPXtzdHlsZX0+PC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQXV0aG9yKCkge1xuICAgIGxldCBuYW1lID0gdGhpcy5wcm9wcy5jb250ZW50LnVzZXIubmFtZSB8fCB0aGlzLnByb3BzLmNvbnRlbnQudXNlci51c2VybmFtZVxuICAgIGxldCBsaW5rID0gdGhpcy5wcm9wcy5jb250ZW50LnVzZXIucG9ydGZvbGlvX3VybCB8fCAoJ2h0dHBzOi8vdW5zcGxhc2guY29tL0AnICsgdGhpcy5wcm9wcy5jb250ZW50LnVzZXIudXNlcm5hbWUpXG4gICAgY29uc3QgcHJvZmlsZVBob3RvU3R5bGUgPSB7XG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6IGB1cmwoJHt0aGlzLnByb3BzLmNvbnRlbnQudXNlci5wcm9maWxlX2ltYWdlLnNtYWxsfSlgXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGhyZWY9e2xpbmt9IGNsYXNzTmFtZT1cImF1dGhvclwiIHRpdGxlPXtgUGhvdG8gd2FzIHNob3QgYnkgJHt0aGlzLnByb3BzLmNvbnRlbnQudXNlci5uYW1lfWB9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwcm9maWxlLWltYWdlXCIgc3R5bGU9e3Byb2ZpbGVQaG90b1N0eWxlfT48L3NwYW4+XG4gICAgICAgIDxsYWJlbD5QaG90b2dyYXBoZXI6IDwvbGFiZWw+e25hbWV9XG4gICAgICA8L2E+XG4gICAgKVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ0NDQ2NDY2NjE2OC00OWQ2MzNiODY3OTdcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTA4NDk2MDg4ODAtNmY3ODc1NDJjODhhXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDc3NjgxOTUyMjExLWI4ZThjY2E0OWI0ZFwiIH0sXG4gIHsgXCJwb3NpdGlvblwiOiBcInRvcCBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQyOTUxNjM4NzQ1OS05ODkxYjdiOTZjNzhcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0Njk4NTQ1MjMwODYtY2MwMmZlNWQ4ODAwXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDg4NzI0MDM0OTU4LTBmYWFkODhjZjY5ZlwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQzMDY1MTcxNzUwNC1lYmI5ZTNlNjc5NWVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NDE4MDIyNTk4NzgtYTEzZjczMmNlNDEwXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk0MjAwNDgzMDM1LWRiN2JjNmFhNTczOVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1OTI1ODM1MDg3OS0zNDg4NjMxOWEzYzlcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDcwOTg5MjYzMzEtOGQzMjRiMTM5ZDE1XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTEwMzUzNjIyNzU4LTYyZTNiNjNiNWZiNVwiIH0sXG4gIHsgXCJwb3NpdGlvblwiOiBcInRvcCBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ5NDMwMTk1MDYyNC0yYzU0Y2M5ODI2YzVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0ODMxMTY1MzE1MjItNGM0ZTUyNWY1MDRlXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDc5MDMwMTYwMTgwLWIxODYwOTUxZDY5NlwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNDUzNTQ5NzM4Ny05MGM1MjFhZTg1MjNcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0Nzc5NTEyMzMwOTktZDJjNWZiZDg3OGVlXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTAxNDQ2NjkwODUyLWRhNTVkZjdiZmUwN1wiIH1cbl1cbiIsIm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG5cbmZ1bmN0aW9uIGRlYm91bmNlIChmbiwgd2FpdCkge1xuICB2YXIgdGltZXI7XG4gIHZhciBhcmdzO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICB3YWl0ID0gMjUwO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGltZXIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgdGltZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9O1xufVxuIiwiXG4vKipcbiAqIEVzY2FwZSByZWdleHAgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gU3RyaW5nKHN0cikucmVwbGFjZSgvKFsuKis/PV4hOiR7fSgpfFtcXF1cXC9cXFxcXSkvZywgJ1xcXFwkMScpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGltZztcblxuZnVuY3Rpb24gaW1nIChzcmMsIG9wdCwgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBvcHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdFxuICAgIG9wdCA9IG51bGxcbiAgfVxuXG5cbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gIHZhciBsb2NrZWQ7XG5cbiAgZWwub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChsb2NrZWQpIHJldHVybjtcbiAgICBsb2NrZWQgPSB0cnVlO1xuXG4gICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sodW5kZWZpbmVkLCBlbCk7XG4gIH07XG5cbiAgZWwub25lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAobG9ja2VkKSByZXR1cm47XG4gICAgbG9ja2VkID0gdHJ1ZTtcblxuICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKG5ldyBFcnJvcignVW5hYmxlIHRvIGxvYWQgXCInICsgc3JjICsgJ1wiJyksIGVsKTtcbiAgfTtcbiAgXG4gIGlmIChvcHQgJiYgb3B0LmNyb3NzT3JpZ2luKVxuICAgIGVsLmNyb3NzT3JpZ2luID0gb3B0LmNyb3NzT3JpZ2luO1xuXG4gIGVsLnNyYyA9IHNyYztcblxuICByZXR1cm4gZWw7XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTcGxpdCBhIGZpbGVuYW1lIGludG8gW3Jvb3QsIGRpciwgYmFzZW5hbWUsIGV4dF0sIHVuaXggdmVyc2lvblxuLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy5cbnZhciBzcGxpdFBhdGhSZSA9XG4gICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG52YXIgc3BsaXRQYXRoID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufTtcblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKSxcbiAgICAgIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUoZmlsdGVyKHBhdGhzLCBmdW5jdGlvbihwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICAgIHJldHVybiBwO1xuICB9KS5qb2luKCcvJykpO1xufTtcblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZWxhdGl2ZSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBleHBvcnRzLnJlc29sdmUoZnJvbSkuc3Vic3RyKDEpO1xuICB0byA9IGV4cG9ydHMucmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufTtcblxuZXhwb3J0cy5zZXAgPSAnLyc7XG5leHBvcnRzLmRlbGltaXRlciA9ICc6JztcblxuZXhwb3J0cy5kaXJuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgcmVzdWx0ID0gc3BsaXRQYXRoKHBhdGgpLFxuICAgICAgcm9vdCA9IHJlc3VsdFswXSxcbiAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgIC8vIE5vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgIHJldHVybiAnLic7XG4gIH1cblxuICBpZiAoZGlyKSB7XG4gICAgLy8gSXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2hcbiAgICBkaXIgPSBkaXIuc3Vic3RyKDAsIGRpci5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHJldHVybiByb290ICsgZGlyO1xufTtcblxuXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24ocGF0aCwgZXh0KSB7XG4gIHZhciBmID0gc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGY7XG59O1xuXG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcbiIsIiFmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgZnVuY3Rpb24gVk5vZGUoKSB7fVxuICAgIGZ1bmN0aW9uIGgobm9kZU5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGxhc3RTaW1wbGUsIGNoaWxkLCBzaW1wbGUsIGksIGNoaWxkcmVuID0gRU1QVFlfQ0hJTERSRU47XG4gICAgICAgIGZvciAoaSA9IGFyZ3VtZW50cy5sZW5ndGg7IGktLSA+IDI7ICkgc3RhY2sucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICBpZiAoYXR0cmlidXRlcyAmJiBudWxsICE9IGF0dHJpYnV0ZXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmICghc3RhY2subGVuZ3RoKSBzdGFjay5wdXNoKGF0dHJpYnV0ZXMuY2hpbGRyZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGF0dHJpYnV0ZXMuY2hpbGRyZW47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkgaWYgKChjaGlsZCA9IHN0YWNrLnBvcCgpKSAmJiB2b2lkIDAgIT09IGNoaWxkLnBvcCkgZm9yIChpID0gY2hpbGQubGVuZ3RoOyBpLS07ICkgc3RhY2sucHVzaChjaGlsZFtpXSk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgY2hpbGQpIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChzaW1wbGUgPSAnZnVuY3Rpb24nICE9IHR5cGVvZiBub2RlTmFtZSkgaWYgKG51bGwgPT0gY2hpbGQpIGNoaWxkID0gJyc7IGVsc2UgaWYgKCdudW1iZXInID09IHR5cGVvZiBjaGlsZCkgY2hpbGQgPSBTdHJpbmcoY2hpbGQpOyBlbHNlIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgY2hpbGQpIHNpbXBsZSA9ICExO1xuICAgICAgICAgICAgaWYgKHNpbXBsZSAmJiBsYXN0U2ltcGxlKSBjaGlsZHJlbltjaGlsZHJlbi5sZW5ndGggLSAxXSArPSBjaGlsZDsgZWxzZSBpZiAoY2hpbGRyZW4gPT09IEVNUFRZX0NISUxEUkVOKSBjaGlsZHJlbiA9IFsgY2hpbGQgXTsgZWxzZSBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIGxhc3RTaW1wbGUgPSBzaW1wbGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHAgPSBuZXcgVk5vZGUoKTtcbiAgICAgICAgcC5ub2RlTmFtZSA9IG5vZGVOYW1lO1xuICAgICAgICBwLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHAuYXR0cmlidXRlcyA9IG51bGwgPT0gYXR0cmlidXRlcyA/IHZvaWQgMCA6IGF0dHJpYnV0ZXM7XG4gICAgICAgIHAua2V5ID0gbnVsbCA9PSBhdHRyaWJ1dGVzID8gdm9pZCAwIDogYXR0cmlidXRlcy5rZXk7XG4gICAgICAgIGlmICh2b2lkIDAgIT09IG9wdGlvbnMudm5vZGUpIG9wdGlvbnMudm5vZGUocCk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBleHRlbmQob2JqLCBwcm9wcykge1xuICAgICAgICBmb3IgKHZhciBpIGluIHByb3BzKSBvYmpbaV0gPSBwcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xvbmVFbGVtZW50KHZub2RlLCBwcm9wcykge1xuICAgICAgICByZXR1cm4gaCh2bm9kZS5ub2RlTmFtZSwgZXh0ZW5kKGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyksIHByb3BzKSwgYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiB2bm9kZS5jaGlsZHJlbik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVucXVldWVSZW5kZXIoY29tcG9uZW50KSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9fZCAmJiAoY29tcG9uZW50Ll9fZCA9ICEwKSAmJiAxID09IGl0ZW1zLnB1c2goY29tcG9uZW50KSkgKG9wdGlvbnMuZGVib3VuY2VSZW5kZXJpbmcgfHwgZGVmZXIpKHJlcmVuZGVyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVyZW5kZXIoKSB7XG4gICAgICAgIHZhciBwLCBsaXN0ID0gaXRlbXM7XG4gICAgICAgIGl0ZW1zID0gW107XG4gICAgICAgIHdoaWxlIChwID0gbGlzdC5wb3AoKSkgaWYgKHAuX19kKSByZW5kZXJDb21wb25lbnQocCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzU2FtZU5vZGVUeXBlKG5vZGUsIHZub2RlLCBoeWRyYXRpbmcpIHtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHJldHVybiB2b2lkIDAgIT09IG5vZGUuc3BsaXRUZXh0O1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlLm5vZGVOYW1lKSByZXR1cm4gIW5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yICYmIGlzTmFtZWROb2RlKG5vZGUsIHZub2RlLm5vZGVOYW1lKTsgZWxzZSByZXR1cm4gaHlkcmF0aW5nIHx8IG5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNOYW1lZE5vZGUobm9kZSwgbm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuX19uID09PSBub2RlTmFtZSB8fCBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5vZGVQcm9wcyh2bm9kZSkge1xuICAgICAgICB2YXIgcHJvcHMgPSBleHRlbmQoe30sIHZub2RlLmF0dHJpYnV0ZXMpO1xuICAgICAgICBwcm9wcy5jaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0gdm5vZGUubm9kZU5hbWUuZGVmYXVsdFByb3BzO1xuICAgICAgICBpZiAodm9pZCAwICE9PSBkZWZhdWx0UHJvcHMpIGZvciAodmFyIGkgaW4gZGVmYXVsdFByb3BzKSBpZiAodm9pZCAwID09PSBwcm9wc1tpXSkgcHJvcHNbaV0gPSBkZWZhdWx0UHJvcHNbaV07XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTm9kZShub2RlTmFtZSwgaXNTdmcpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBpc1N2ZyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBub2RlTmFtZSkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcbiAgICAgICAgbm9kZS5fX24gPSBub2RlTmFtZTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudE5vZGUpIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldEFjY2Vzc29yKG5vZGUsIG5hbWUsIG9sZCwgdmFsdWUsIGlzU3ZnKSB7XG4gICAgICAgIGlmICgnY2xhc3NOYW1lJyA9PT0gbmFtZSkgbmFtZSA9ICdjbGFzcyc7XG4gICAgICAgIGlmICgna2V5JyA9PT0gbmFtZSkgOyBlbHNlIGlmICgncmVmJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKG9sZCkgb2xkKG51bGwpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB2YWx1ZShub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmICgnY2xhc3MnID09PSBuYW1lICYmICFpc1N2Zykgbm9kZS5jbGFzc05hbWUgPSB2YWx1ZSB8fCAnJzsgZWxzZSBpZiAoJ3N0eWxlJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2YgdmFsdWUgfHwgJ3N0cmluZycgPT0gdHlwZW9mIG9sZCkgbm9kZS5zdHlsZS5jc3NUZXh0ID0gdmFsdWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBvbGQpIGZvciAodmFyIGkgaW4gb2xkKSBpZiAoIShpIGluIHZhbHVlKSkgbm9kZS5zdHlsZVtpXSA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIG5vZGUuc3R5bGVbaV0gPSAnbnVtYmVyJyA9PSB0eXBlb2YgdmFsdWVbaV0gJiYgITEgPT09IElTX05PTl9ESU1FTlNJT05BTC50ZXN0KGkpID8gdmFsdWVbaV0gKyAncHgnIDogdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSBub2RlLmlubmVySFRNTCA9IHZhbHVlLl9faHRtbCB8fCAnJztcbiAgICAgICAgfSBlbHNlIGlmICgnbycgPT0gbmFtZVswXSAmJiAnbicgPT0gbmFtZVsxXSkge1xuICAgICAgICAgICAgdmFyIHVzZUNhcHR1cmUgPSBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvQ2FwdHVyZSQvLCAnJykpO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9sZCkgbm9kZS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudFByb3h5LCB1c2VDYXB0dXJlKTtcbiAgICAgICAgICAgIChub2RlLl9fbCB8fCAobm9kZS5fX2wgPSB7fSkpW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2xpc3QnICE9PSBuYW1lICYmICd0eXBlJyAhPT0gbmFtZSAmJiAhaXNTdmcgJiYgbmFtZSBpbiBub2RlKSB7XG4gICAgICAgICAgICBzZXRQcm9wZXJ0eShub2RlLCBuYW1lLCBudWxsID09IHZhbHVlID8gJycgOiB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAobnVsbCA9PSB2YWx1ZSB8fCAhMSA9PT0gdmFsdWUpIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5zID0gaXNTdmcgJiYgbmFtZSAhPT0gKG5hbWUgPSBuYW1lLnJlcGxhY2UoL154bGlua1xcOj8vLCAnJykpO1xuICAgICAgICAgICAgaWYgKG51bGwgPT0gdmFsdWUgfHwgITEgPT09IHZhbHVlKSBpZiAobnMpIG5vZGUucmVtb3ZlQXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBuYW1lLnRvTG93ZXJDYXNlKCkpOyBlbHNlIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpOyBlbHNlIGlmICgnZnVuY3Rpb24nICE9IHR5cGVvZiB2YWx1ZSkgaWYgKG5zKSBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpLCB2YWx1ZSk7IGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldFByb3BlcnR5KG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBub2RlW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV2ZW50UHJveHkoZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2xbZS50eXBlXShvcHRpb25zLmV2ZW50ICYmIG9wdGlvbnMuZXZlbnQoZSkgfHwgZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZsdXNoTW91bnRzKCkge1xuICAgICAgICB2YXIgYztcbiAgICAgICAgd2hpbGUgKGMgPSBtb3VudHMucG9wKCkpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyTW91bnQpIG9wdGlvbnMuYWZ0ZXJNb3VudChjKTtcbiAgICAgICAgICAgIGlmIChjLmNvbXBvbmVudERpZE1vdW50KSBjLmNvbXBvbmVudERpZE1vdW50KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgcGFyZW50LCBjb21wb25lbnRSb290KSB7XG4gICAgICAgIGlmICghZGlmZkxldmVsKyspIHtcbiAgICAgICAgICAgIGlzU3ZnTW9kZSA9IG51bGwgIT0gcGFyZW50ICYmIHZvaWQgMCAhPT0gcGFyZW50Lm93bmVyU1ZHRWxlbWVudDtcbiAgICAgICAgICAgIGh5ZHJhdGluZyA9IG51bGwgIT0gZG9tICYmICEoJ19fcHJlYWN0YXR0cl8nIGluIGRvbSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IGlkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBjb21wb25lbnRSb290KTtcbiAgICAgICAgaWYgKHBhcmVudCAmJiByZXQucGFyZW50Tm9kZSAhPT0gcGFyZW50KSBwYXJlbnQuYXBwZW5kQ2hpbGQocmV0KTtcbiAgICAgICAgaWYgKCEtLWRpZmZMZXZlbCkge1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gITE7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudFJvb3QpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpIHtcbiAgICAgICAgdmFyIG91dCA9IGRvbSwgcHJldlN2Z01vZGUgPSBpc1N2Z01vZGU7XG4gICAgICAgIGlmIChudWxsID09IHZub2RlIHx8ICdib29sZWFuJyA9PSB0eXBlb2Ygdm5vZGUpIHZub2RlID0gJyc7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUgfHwgJ251bWJlcicgPT0gdHlwZW9mIHZub2RlKSB7XG4gICAgICAgICAgICBpZiAoZG9tICYmIHZvaWQgMCAhPT0gZG9tLnNwbGl0VGV4dCAmJiBkb20ucGFyZW50Tm9kZSAmJiAoIWRvbS5fY29tcG9uZW50IHx8IGNvbXBvbmVudFJvb3QpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVmFsdWUgIT0gdm5vZGUpIGRvbS5ub2RlVmFsdWUgPSB2bm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodm5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShkb20sICEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQuX19wcmVhY3RhdHRyXyA9ICEwO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdm5vZGVOYW1lID0gdm5vZGUubm9kZU5hbWU7XG4gICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiB2bm9kZU5hbWUpIHJldHVybiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgIGlzU3ZnTW9kZSA9ICdzdmcnID09PSB2bm9kZU5hbWUgPyAhMCA6ICdmb3JlaWduT2JqZWN0JyA9PT0gdm5vZGVOYW1lID8gITEgOiBpc1N2Z01vZGU7XG4gICAgICAgIHZub2RlTmFtZSA9IFN0cmluZyh2bm9kZU5hbWUpO1xuICAgICAgICBpZiAoIWRvbSB8fCAhaXNOYW1lZE5vZGUoZG9tLCB2bm9kZU5hbWUpKSB7XG4gICAgICAgICAgICBvdXQgPSBjcmVhdGVOb2RlKHZub2RlTmFtZSwgaXNTdmdNb2RlKTtcbiAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIG91dC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGRvbSwgITApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBmYyA9IG91dC5maXJzdENoaWxkLCBwcm9wcyA9IG91dC5fX3ByZWFjdGF0dHJfLCB2Y2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKG51bGwgPT0gcHJvcHMpIHtcbiAgICAgICAgICAgIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8gPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGEgPSBvdXQuYXR0cmlidXRlcywgaSA9IGEubGVuZ3RoOyBpLS07ICkgcHJvcHNbYVtpXS5uYW1lXSA9IGFbaV0udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoeWRyYXRpbmcgJiYgdmNoaWxkcmVuICYmIDEgPT09IHZjaGlsZHJlbi5sZW5ndGggJiYgJ3N0cmluZycgPT0gdHlwZW9mIHZjaGlsZHJlblswXSAmJiBudWxsICE9IGZjICYmIHZvaWQgMCAhPT0gZmMuc3BsaXRUZXh0ICYmIG51bGwgPT0gZmMubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIGlmIChmYy5ub2RlVmFsdWUgIT0gdmNoaWxkcmVuWzBdKSBmYy5ub2RlVmFsdWUgPSB2Y2hpbGRyZW5bMF07XG4gICAgICAgIH0gZWxzZSBpZiAodmNoaWxkcmVuICYmIHZjaGlsZHJlbi5sZW5ndGggfHwgbnVsbCAhPSBmYykgaW5uZXJEaWZmTm9kZShvdXQsIHZjaGlsZHJlbiwgY29udGV4dCwgbW91bnRBbGwsIGh5ZHJhdGluZyB8fCBudWxsICE9IHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKTtcbiAgICAgICAgZGlmZkF0dHJpYnV0ZXMob3V0LCB2bm9kZS5hdHRyaWJ1dGVzLCBwcm9wcyk7XG4gICAgICAgIGlzU3ZnTW9kZSA9IHByZXZTdmdNb2RlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbm5lckRpZmZOb2RlKGRvbSwgdmNoaWxkcmVuLCBjb250ZXh0LCBtb3VudEFsbCwgaXNIeWRyYXRpbmcpIHtcbiAgICAgICAgdmFyIGosIGMsIGYsIHZjaGlsZCwgY2hpbGQsIG9yaWdpbmFsQ2hpbGRyZW4gPSBkb20uY2hpbGROb2RlcywgY2hpbGRyZW4gPSBbXSwga2V5ZWQgPSB7fSwga2V5ZWRMZW4gPSAwLCBtaW4gPSAwLCBsZW4gPSBvcmlnaW5hbENoaWxkcmVuLmxlbmd0aCwgY2hpbGRyZW5MZW4gPSAwLCB2bGVuID0gdmNoaWxkcmVuID8gdmNoaWxkcmVuLmxlbmd0aCA6IDA7XG4gICAgICAgIGlmICgwICE9PSBsZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBfY2hpbGQgPSBvcmlnaW5hbENoaWxkcmVuW2ldLCBwcm9wcyA9IF9jaGlsZC5fX3ByZWFjdGF0dHJfLCBrZXkgPSB2bGVuICYmIHByb3BzID8gX2NoaWxkLl9jb21wb25lbnQgPyBfY2hpbGQuX2NvbXBvbmVudC5fX2sgOiBwcm9wcy5rZXkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAga2V5ZWRMZW4rKztcbiAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gX2NoaWxkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcyB8fCAodm9pZCAwICE9PSBfY2hpbGQuc3BsaXRUZXh0ID8gaXNIeWRyYXRpbmcgPyBfY2hpbGQubm9kZVZhbHVlLnRyaW0oKSA6ICEwIDogaXNIeWRyYXRpbmcpKSBjaGlsZHJlbltjaGlsZHJlbkxlbisrXSA9IF9jaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoMCAhPT0gdmxlbikgZm9yICh2YXIgaSA9IDA7IGkgPCB2bGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZjaGlsZCA9IHZjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBrZXkgPSB2Y2hpbGQua2V5O1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleWVkTGVuICYmIHZvaWQgMCAhPT0ga2V5ZWRba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGtleWVkW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGtleWVkW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGtleWVkTGVuLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghY2hpbGQgJiYgbWluIDwgY2hpbGRyZW5MZW4pIGZvciAoaiA9IG1pbjsgaiA8IGNoaWxkcmVuTGVuOyBqKyspIGlmICh2b2lkIDAgIT09IGNoaWxkcmVuW2pdICYmIGlzU2FtZU5vZGVUeXBlKGMgPSBjaGlsZHJlbltqXSwgdmNoaWxkLCBpc0h5ZHJhdGluZykpIHtcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGM7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bal0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGNoaWxkcmVuTGVuIC0gMSkgY2hpbGRyZW5MZW4tLTtcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gbWluKSBtaW4rKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoaWxkID0gaWRpZmYoY2hpbGQsIHZjaGlsZCwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZiA9IG9yaWdpbmFsQ2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQgJiYgY2hpbGQgIT09IGRvbSAmJiBjaGlsZCAhPT0gZikgaWYgKG51bGwgPT0gZikgZG9tLmFwcGVuZENoaWxkKGNoaWxkKTsgZWxzZSBpZiAoY2hpbGQgPT09IGYubmV4dFNpYmxpbmcpIHJlbW92ZU5vZGUoZik7IGVsc2UgZG9tLmluc2VydEJlZm9yZShjaGlsZCwgZik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleWVkTGVuKSBmb3IgKHZhciBpIGluIGtleWVkKSBpZiAodm9pZCAwICE9PSBrZXllZFtpXSkgcmVjb2xsZWN0Tm9kZVRyZWUoa2V5ZWRbaV0sICExKTtcbiAgICAgICAgd2hpbGUgKG1pbiA8PSBjaGlsZHJlbkxlbikgaWYgKHZvaWQgMCAhPT0gKGNoaWxkID0gY2hpbGRyZW5bY2hpbGRyZW5MZW4tLV0pKSByZWNvbGxlY3ROb2RlVHJlZShjaGlsZCwgITEpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZWNvbGxlY3ROb2RlVHJlZShub2RlLCB1bm1vdW50T25seSkge1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gbm9kZS5fY29tcG9uZW50O1xuICAgICAgICBpZiAoY29tcG9uZW50KSB1bm1vdW50Q29tcG9uZW50KGNvbXBvbmVudCk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG51bGwgIT0gbm9kZS5fX3ByZWFjdGF0dHJfICYmIG5vZGUuX19wcmVhY3RhdHRyXy5yZWYpIG5vZGUuX19wcmVhY3RhdHRyXy5yZWYobnVsbCk7XG4gICAgICAgICAgICBpZiAoITEgPT09IHVubW91bnRPbmx5IHx8IG51bGwgPT0gbm9kZS5fX3ByZWFjdGF0dHJfKSByZW1vdmVOb2RlKG5vZGUpO1xuICAgICAgICAgICAgcmVtb3ZlQ2hpbGRyZW4obm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBub2RlID0gbm9kZS5sYXN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgICAgICB2YXIgbmV4dCA9IG5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUobm9kZSwgITApO1xuICAgICAgICAgICAgbm9kZSA9IG5leHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZkF0dHJpYnV0ZXMoZG9tLCBhdHRycywgb2xkKSB7XG4gICAgICAgIHZhciBuYW1lO1xuICAgICAgICBmb3IgKG5hbWUgaW4gb2xkKSBpZiAoKCFhdHRycyB8fCBudWxsID09IGF0dHJzW25hbWVdKSAmJiBudWxsICE9IG9sZFtuYW1lXSkgc2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBvbGRbbmFtZV0sIG9sZFtuYW1lXSA9IHZvaWQgMCwgaXNTdmdNb2RlKTtcbiAgICAgICAgZm9yIChuYW1lIGluIGF0dHJzKSBpZiAoISgnY2hpbGRyZW4nID09PSBuYW1lIHx8ICdpbm5lckhUTUwnID09PSBuYW1lIHx8IG5hbWUgaW4gb2xkICYmIGF0dHJzW25hbWVdID09PSAoJ3ZhbHVlJyA9PT0gbmFtZSB8fCAnY2hlY2tlZCcgPT09IG5hbWUgPyBkb21bbmFtZV0gOiBvbGRbbmFtZV0pKSkgc2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBvbGRbbmFtZV0sIG9sZFtuYW1lXSA9IGF0dHJzW25hbWVdLCBpc1N2Z01vZGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb2xsZWN0Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICB2YXIgbmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAoY29tcG9uZW50c1tuYW1lXSB8fCAoY29tcG9uZW50c1tuYW1lXSA9IFtdKSkucHVzaChjb21wb25lbnQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoQ3RvciwgcHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGluc3QsIGxpc3QgPSBjb21wb25lbnRzW0N0b3IubmFtZV07XG4gICAgICAgIGlmIChDdG9yLnByb3RvdHlwZSAmJiBDdG9yLnByb3RvdHlwZS5yZW5kZXIpIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgQ3Rvcihwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBDb21wb25lbnQuY2FsbChpbnN0LCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IENvbXBvbmVudChwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpbnN0LmNvbnN0cnVjdG9yID0gQ3RvcjtcbiAgICAgICAgICAgIGluc3QucmVuZGVyID0gZG9SZW5kZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpc3QpIGZvciAodmFyIGkgPSBsaXN0Lmxlbmd0aDsgaS0tOyApIGlmIChsaXN0W2ldLmNvbnN0cnVjdG9yID09PSBDdG9yKSB7XG4gICAgICAgICAgICBpbnN0Ll9fYiA9IGxpc3RbaV0uX19iO1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZG9SZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0Q29tcG9uZW50UHJvcHMoY29tcG9uZW50LCBwcm9wcywgb3B0cywgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX194KSB7XG4gICAgICAgICAgICBjb21wb25lbnQuX194ID0gITA7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fciA9IHByb3BzLnJlZikgZGVsZXRlIHByb3BzLnJlZjtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19rID0gcHJvcHMua2V5KSBkZWxldGUgcHJvcHMua2V5O1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuYmFzZSB8fCBtb3VudEFsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKSBjb21wb25lbnQuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0ICE9PSBjb21wb25lbnQuY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50Ll9fYykgY29tcG9uZW50Ll9fYyA9IGNvbXBvbmVudC5jb250ZXh0O1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY29tcG9uZW50Ll9fcCkgY29tcG9uZW50Ll9fcCA9IGNvbXBvbmVudC5wcm9wcztcbiAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9feCA9ICExO1xuICAgICAgICAgICAgaWYgKDAgIT09IG9wdHMpIGlmICgxID09PSBvcHRzIHx8ICExICE9PSBvcHRpb25zLnN5bmNDb21wb25lbnRVcGRhdGVzIHx8ICFjb21wb25lbnQuYmFzZSkgcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCwgMSwgbW91bnRBbGwpOyBlbHNlIGVucXVldWVSZW5kZXIoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19yKSBjb21wb25lbnQuX19yKGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCwgb3B0cywgbW91bnRBbGwsIGlzQ2hpbGQpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX194KSB7XG4gICAgICAgICAgICB2YXIgcmVuZGVyZWQsIGluc3QsIGNiYXNlLCBwcm9wcyA9IGNvbXBvbmVudC5wcm9wcywgc3RhdGUgPSBjb21wb25lbnQuc3RhdGUsIGNvbnRleHQgPSBjb21wb25lbnQuY29udGV4dCwgcHJldmlvdXNQcm9wcyA9IGNvbXBvbmVudC5fX3AgfHwgcHJvcHMsIHByZXZpb3VzU3RhdGUgPSBjb21wb25lbnQuX19zIHx8IHN0YXRlLCBwcmV2aW91c0NvbnRleHQgPSBjb21wb25lbnQuX19jIHx8IGNvbnRleHQsIGlzVXBkYXRlID0gY29tcG9uZW50LmJhc2UsIG5leHRCYXNlID0gY29tcG9uZW50Ll9fYiwgaW5pdGlhbEJhc2UgPSBpc1VwZGF0ZSB8fCBuZXh0QmFzZSwgaW5pdGlhbENoaWxkQ29tcG9uZW50ID0gY29tcG9uZW50Ll9jb21wb25lbnQsIHNraXAgPSAhMTtcbiAgICAgICAgICAgIGlmIChpc1VwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByZXZpb3VzUHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gcHJldmlvdXNTdGF0ZTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IHByZXZpb3VzQ29udGV4dDtcbiAgICAgICAgICAgICAgICBpZiAoMiAhPT0gb3B0cyAmJiBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlICYmICExID09PSBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCkpIHNraXAgPSAhMDsgZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50Ll9fcCA9IGNvbXBvbmVudC5fX3MgPSBjb21wb25lbnQuX19jID0gY29tcG9uZW50Ll9fYiA9IG51bGw7XG4gICAgICAgICAgICBjb21wb25lbnQuX19kID0gITE7XG4gICAgICAgICAgICBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICByZW5kZXJlZCA9IGNvbXBvbmVudC5yZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmdldENoaWxkQ29udGV4dCkgY29udGV4dCA9IGV4dGVuZChleHRlbmQoe30sIGNvbnRleHQpLCBjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkpO1xuICAgICAgICAgICAgICAgIHZhciB0b1VubW91bnQsIGJhc2UsIGNoaWxkQ29tcG9uZW50ID0gcmVuZGVyZWQgJiYgcmVuZGVyZWQubm9kZU5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZFByb3BzID0gZ2V0Tm9kZVByb3BzKHJlbmRlcmVkKTtcbiAgICAgICAgICAgICAgICAgICAgaW5zdCA9IGluaXRpYWxDaGlsZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluc3QgJiYgaW5zdC5jb25zdHJ1Y3RvciA9PT0gY2hpbGRDb21wb25lbnQgJiYgY2hpbGRQcm9wcy5rZXkgPT0gaW5zdC5fX2spIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDEsIGNvbnRleHQsICExKTsgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbnN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Ll9jb21wb25lbnQgPSBpbnN0ID0gY3JlYXRlQ29tcG9uZW50KGNoaWxkQ29tcG9uZW50LCBjaGlsZFByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QuX19iID0gaW5zdC5fX2IgfHwgbmV4dEJhc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fdSA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDAsIGNvbnRleHQsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBvbmVudChpbnN0LCAxLCBtb3VudEFsbCwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJhc2UgPSBpbnN0LmJhc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2Jhc2UgPSBpbml0aWFsQmFzZTtcbiAgICAgICAgICAgICAgICAgICAgdG9Vbm1vdW50ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9Vbm1vdW50KSBjYmFzZSA9IGNvbXBvbmVudC5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxCYXNlIHx8IDEgPT09IG9wdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYmFzZSkgY2Jhc2UuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlID0gZGlmZihjYmFzZSwgcmVuZGVyZWQsIGNvbnRleHQsIG1vdW50QWxsIHx8ICFpc1VwZGF0ZSwgaW5pdGlhbEJhc2UgJiYgaW5pdGlhbEJhc2UucGFyZW50Tm9kZSwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbml0aWFsQmFzZSAmJiBiYXNlICE9PSBpbml0aWFsQmFzZSAmJiBpbnN0ICE9PSBpbml0aWFsQ2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJhc2VQYXJlbnQgPSBpbml0aWFsQmFzZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZVBhcmVudCAmJiBiYXNlICE9PSBiYXNlUGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlUGFyZW50LnJlcGxhY2VDaGlsZChiYXNlLCBpbml0aWFsQmFzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRvVW5tb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxCYXNlLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGluaXRpYWxCYXNlLCAhMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgdW5tb3VudENvbXBvbmVudCh0b1VubW91bnQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5iYXNlID0gYmFzZTtcbiAgICAgICAgICAgICAgICBpZiAoYmFzZSAmJiAhaXNDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50UmVmID0gY29tcG9uZW50LCB0ID0gY29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodCA9IHQuX191KSAoY29tcG9uZW50UmVmID0gdCkuYmFzZSA9IGJhc2U7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UuX2NvbXBvbmVudCA9IGNvbXBvbmVudFJlZjtcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPSBjb21wb25lbnRSZWYuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1VwZGF0ZSB8fCBtb3VudEFsbCkgbW91bnRzLnVuc2hpZnQoY29tcG9uZW50KTsgZWxzZSBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZSkgY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZShwcmV2aW91c1Byb3BzLCBwcmV2aW91c1N0YXRlLCBwcmV2aW91c0NvbnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyVXBkYXRlKSBvcHRpb25zLmFmdGVyVXBkYXRlKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBjb21wb25lbnQuX19oKSB3aGlsZSAoY29tcG9uZW50Ll9faC5sZW5ndGgpIGNvbXBvbmVudC5fX2gucG9wKCkuY2FsbChjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKCFkaWZmTGV2ZWwgJiYgIWlzQ2hpbGQpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGRDb21wb25lbnRGcm9tVk5vZGUoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgdmFyIGMgPSBkb20gJiYgZG9tLl9jb21wb25lbnQsIG9yaWdpbmFsQ29tcG9uZW50ID0gYywgb2xkRG9tID0gZG9tLCBpc0RpcmVjdE93bmVyID0gYyAmJiBkb20uX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZSwgaXNPd25lciA9IGlzRGlyZWN0T3duZXIsIHByb3BzID0gZ2V0Tm9kZVByb3BzKHZub2RlKTtcbiAgICAgICAgd2hpbGUgKGMgJiYgIWlzT3duZXIgJiYgKGMgPSBjLl9fdSkpIGlzT3duZXIgPSBjLmNvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICAgICAgaWYgKGMgJiYgaXNPd25lciAmJiAoIW1vdW50QWxsIHx8IGMuX2NvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCAzLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBkb20gPSBjLmJhc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWxDb21wb25lbnQgJiYgIWlzRGlyZWN0T3duZXIpIHtcbiAgICAgICAgICAgICAgICB1bm1vdW50Q29tcG9uZW50KG9yaWdpbmFsQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICBkb20gPSBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYyA9IGNyZWF0ZUNvbXBvbmVudCh2bm9kZS5ub2RlTmFtZSwgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGRvbSAmJiAhYy5fX2IpIHtcbiAgICAgICAgICAgICAgICBjLl9fYiA9IGRvbTtcbiAgICAgICAgICAgICAgICBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoYywgcHJvcHMsIDEsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGRvbSA9IGMuYmFzZTtcbiAgICAgICAgICAgIGlmIChvbGREb20gJiYgZG9tICE9PSBvbGREb20pIHtcbiAgICAgICAgICAgICAgICBvbGREb20uX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUob2xkRG9tLCAhMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvbTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdW5tb3VudENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYmVmb3JlVW5tb3VudCkgb3B0aW9ucy5iZWZvcmVVbm1vdW50KGNvbXBvbmVudCk7XG4gICAgICAgIHZhciBiYXNlID0gY29tcG9uZW50LmJhc2U7XG4gICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG4gICAgICAgIGNvbXBvbmVudC5iYXNlID0gbnVsbDtcbiAgICAgICAgdmFyIGlubmVyID0gY29tcG9uZW50Ll9jb21wb25lbnQ7XG4gICAgICAgIGlmIChpbm5lcikgdW5tb3VudENvbXBvbmVudChpbm5lcik7IGVsc2UgaWYgKGJhc2UpIHtcbiAgICAgICAgICAgIGlmIChiYXNlLl9fcHJlYWN0YXR0cl8gJiYgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZikgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX2IgPSBiYXNlO1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShiYXNlKTtcbiAgICAgICAgICAgIGNvbGxlY3RDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkcmVuKGJhc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb21wb25lbnQuX19yKSBjb21wb25lbnQuX19yKG51bGwpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBDb21wb25lbnQocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fX2QgPSAhMDtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVuZGVyKHZub2RlLCBwYXJlbnQsIG1lcmdlKSB7XG4gICAgICAgIHJldHVybiBkaWZmKG1lcmdlLCB2bm9kZSwge30sICExLCBwYXJlbnQsICExKTtcbiAgICB9XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICB2YXIgRU1QVFlfQ0hJTERSRU4gPSBbXTtcbiAgICB2YXIgZGVmZXIgPSAnZnVuY3Rpb24nID09IHR5cGVvZiBQcm9taXNlID8gUHJvbWlzZS5yZXNvbHZlKCkudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKSA6IHNldFRpbWVvdXQ7XG4gICAgdmFyIElTX05PTl9ESU1FTlNJT05BTCA9IC9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHZhciBtb3VudHMgPSBbXTtcbiAgICB2YXIgZGlmZkxldmVsID0gMDtcbiAgICB2YXIgaXNTdmdNb2RlID0gITE7XG4gICAgdmFyIGh5ZHJhdGluZyA9ICExO1xuICAgIHZhciBjb21wb25lbnRzID0ge307XG4gICAgZXh0ZW5kKENvbXBvbmVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgc2V0U3RhdGU6IGZ1bmN0aW9uKHN0YXRlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLnN0YXRlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9fcykgdGhpcy5fX3MgPSBleHRlbmQoe30sIHMpO1xuICAgICAgICAgICAgZXh0ZW5kKHMsICdmdW5jdGlvbicgPT0gdHlwZW9mIHN0YXRlID8gc3RhdGUocywgdGhpcy5wcm9wcykgOiBzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spICh0aGlzLl9faCA9IHRoaXMuX19oIHx8IFtdKS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGVucXVldWVSZW5kZXIodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcmNlVXBkYXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSAodGhpcy5fX2ggPSB0aGlzLl9faCB8fCBbXSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICByZW5kZXJDb21wb25lbnQodGhpcywgMik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBwcmVhY3QgPSB7XG4gICAgICAgIGg6IGgsXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQ6IGgsXG4gICAgICAgIGNsb25lRWxlbWVudDogY2xvbmVFbGVtZW50LFxuICAgICAgICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgICAgICAgcmVuZGVyOiByZW5kZXIsXG4gICAgICAgIHJlcmVuZGVyOiByZXJlbmRlcixcbiAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgIH07XG4gICAgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiBtb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gcHJlYWN0OyBlbHNlIHNlbGYucHJlYWN0ID0gcHJlYWN0O1xufSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0LmpzLm1hcCIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKiEgaHR0cHM6Ly9tdGhzLmJlL3B1bnljb2RlIHYxLjQuMSBieSBAbWF0aGlhcyAqL1xuOyhmdW5jdGlvbihyb290KSB7XG5cblx0LyoqIERldGVjdCBmcmVlIHZhcmlhYmxlcyAqL1xuXHR2YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmXG5cdFx0IWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblx0dmFyIGZyZWVNb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJlxuXHRcdCFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXHR2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO1xuXHRpZiAoXG5cdFx0ZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHxcblx0XHRmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCB8fFxuXHRcdGZyZWVHbG9iYWwuc2VsZiA9PT0gZnJlZUdsb2JhbFxuXHQpIHtcblx0XHRyb290ID0gZnJlZUdsb2JhbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYHB1bnljb2RlYCBvYmplY3QuXG5cdCAqIEBuYW1lIHB1bnljb2RlXG5cdCAqIEB0eXBlIE9iamVjdFxuXHQgKi9cblx0dmFyIHB1bnljb2RlLFxuXG5cdC8qKiBIaWdoZXN0IHBvc2l0aXZlIHNpZ25lZCAzMi1iaXQgZmxvYXQgdmFsdWUgKi9cblx0bWF4SW50ID0gMjE0NzQ4MzY0NywgLy8gYWthLiAweDdGRkZGRkZGIG9yIDJeMzEtMVxuXG5cdC8qKiBCb290c3RyaW5nIHBhcmFtZXRlcnMgKi9cblx0YmFzZSA9IDM2LFxuXHR0TWluID0gMSxcblx0dE1heCA9IDI2LFxuXHRza2V3ID0gMzgsXG5cdGRhbXAgPSA3MDAsXG5cdGluaXRpYWxCaWFzID0gNzIsXG5cdGluaXRpYWxOID0gMTI4LCAvLyAweDgwXG5cdGRlbGltaXRlciA9ICctJywgLy8gJ1xceDJEJ1xuXG5cdC8qKiBSZWd1bGFyIGV4cHJlc3Npb25zICovXG5cdHJlZ2V4UHVueWNvZGUgPSAvXnhuLS0vLFxuXHRyZWdleE5vbkFTQ0lJID0gL1teXFx4MjAtXFx4N0VdLywgLy8gdW5wcmludGFibGUgQVNDSUkgY2hhcnMgKyBub24tQVNDSUkgY2hhcnNcblx0cmVnZXhTZXBhcmF0b3JzID0gL1tcXHgyRVxcdTMwMDJcXHVGRjBFXFx1RkY2MV0vZywgLy8gUkZDIDM0OTAgc2VwYXJhdG9yc1xuXG5cdC8qKiBFcnJvciBtZXNzYWdlcyAqL1xuXHRlcnJvcnMgPSB7XG5cdFx0J292ZXJmbG93JzogJ092ZXJmbG93OiBpbnB1dCBuZWVkcyB3aWRlciBpbnRlZ2VycyB0byBwcm9jZXNzJyxcblx0XHQnbm90LWJhc2ljJzogJ0lsbGVnYWwgaW5wdXQgPj0gMHg4MCAobm90IGEgYmFzaWMgY29kZSBwb2ludCknLFxuXHRcdCdpbnZhbGlkLWlucHV0JzogJ0ludmFsaWQgaW5wdXQnXG5cdH0sXG5cblx0LyoqIENvbnZlbmllbmNlIHNob3J0Y3V0cyAqL1xuXHRiYXNlTWludXNUTWluID0gYmFzZSAtIHRNaW4sXG5cdGZsb29yID0gTWF0aC5mbG9vcixcblx0c3RyaW5nRnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZSxcblxuXHQvKiogVGVtcG9yYXJ5IHZhcmlhYmxlICovXG5cdGtleTtcblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGVycm9yIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFRoZSBlcnJvciB0eXBlLlxuXHQgKiBAcmV0dXJucyB7RXJyb3J9IFRocm93cyBhIGBSYW5nZUVycm9yYCB3aXRoIHRoZSBhcHBsaWNhYmxlIGVycm9yIG1lc3NhZ2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBlcnJvcih0eXBlKSB7XG5cdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoZXJyb3JzW3R5cGVdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIGdlbmVyaWMgYEFycmF5I21hcGAgdXRpbGl0eSBmdW5jdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5IGFycmF5XG5cdCAqIGl0ZW0uXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgb2YgdmFsdWVzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG1hcChhcnJheSwgZm4pIHtcblx0XHR2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcdHZhciByZXN1bHQgPSBbXTtcblx0XHR3aGlsZSAobGVuZ3RoLS0pIHtcblx0XHRcdHJlc3VsdFtsZW5ndGhdID0gZm4oYXJyYXlbbGVuZ3RoXSk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHQvKipcblx0ICogQSBzaW1wbGUgYEFycmF5I21hcGAtbGlrZSB3cmFwcGVyIHRvIHdvcmsgd2l0aCBkb21haW4gbmFtZSBzdHJpbmdzIG9yIGVtYWlsXG5cdCAqIGFkZHJlc3Nlcy5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcy5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5XG5cdCAqIGNoYXJhY3Rlci5cblx0ICogQHJldHVybnMge0FycmF5fSBBIG5ldyBzdHJpbmcgb2YgY2hhcmFjdGVycyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2tcblx0ICogZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXBEb21haW4oc3RyaW5nLCBmbikge1xuXHRcdHZhciBwYXJ0cyA9IHN0cmluZy5zcGxpdCgnQCcpO1xuXHRcdHZhciByZXN1bHQgPSAnJztcblx0XHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdFx0Ly8gSW4gZW1haWwgYWRkcmVzc2VzLCBvbmx5IHRoZSBkb21haW4gbmFtZSBzaG91bGQgYmUgcHVueWNvZGVkLiBMZWF2ZVxuXHRcdFx0Ly8gdGhlIGxvY2FsIHBhcnQgKGkuZS4gZXZlcnl0aGluZyB1cCB0byBgQGApIGludGFjdC5cblx0XHRcdHJlc3VsdCA9IHBhcnRzWzBdICsgJ0AnO1xuXHRcdFx0c3RyaW5nID0gcGFydHNbMV07XG5cdFx0fVxuXHRcdC8vIEF2b2lkIGBzcGxpdChyZWdleClgIGZvciBJRTggY29tcGF0aWJpbGl0eS4gU2VlICMxNy5cblx0XHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShyZWdleFNlcGFyYXRvcnMsICdcXHgyRScpO1xuXHRcdHZhciBsYWJlbHMgPSBzdHJpbmcuc3BsaXQoJy4nKTtcblx0XHR2YXIgZW5jb2RlZCA9IG1hcChsYWJlbHMsIGZuKS5qb2luKCcuJyk7XG5cdFx0cmV0dXJuIHJlc3VsdCArIGVuY29kZWQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBudW1lcmljIGNvZGUgcG9pbnRzIG9mIGVhY2ggVW5pY29kZVxuXHQgKiBjaGFyYWN0ZXIgaW4gdGhlIHN0cmluZy4gV2hpbGUgSmF2YVNjcmlwdCB1c2VzIFVDUy0yIGludGVybmFsbHksXG5cdCAqIHRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IGEgcGFpciBvZiBzdXJyb2dhdGUgaGFsdmVzIChlYWNoIG9mIHdoaWNoXG5cdCAqIFVDUy0yIGV4cG9zZXMgYXMgc2VwYXJhdGUgY2hhcmFjdGVycykgaW50byBhIHNpbmdsZSBjb2RlIHBvaW50LFxuXHQgKiBtYXRjaGluZyBVVEYtMTYuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZW5jb2RlYFxuXHQgKiBAc2VlIDxodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZGVjb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgVGhlIFVuaWNvZGUgaW5wdXQgc3RyaW5nIChVQ1MtMikuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIG5ldyBhcnJheSBvZiBjb2RlIHBvaW50cy5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJkZWNvZGUoc3RyaW5nKSB7XG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBjb3VudGVyID0gMCxcblx0XHQgICAgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcblx0XHQgICAgdmFsdWUsXG5cdFx0ICAgIGV4dHJhO1xuXHRcdHdoaWxlIChjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHR2YWx1ZSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHRcdC8vIGhpZ2ggc3Vycm9nYXRlLCBhbmQgdGhlcmUgaXMgYSBuZXh0IGNoYXJhY3RlclxuXHRcdFx0XHRleHRyYSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRcdGlmICgoZXh0cmEgJiAweEZDMDApID09IDB4REMwMCkgeyAvLyBsb3cgc3Vycm9nYXRlXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goKCh2YWx1ZSAmIDB4M0ZGKSA8PCAxMCkgKyAoZXh0cmEgJiAweDNGRikgKyAweDEwMDAwKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyB1bm1hdGNoZWQgc3Vycm9nYXRlOyBvbmx5IGFwcGVuZCB0aGlzIGNvZGUgdW5pdCwgaW4gY2FzZSB0aGUgbmV4dFxuXHRcdFx0XHRcdC8vIGNvZGUgdW5pdCBpcyB0aGUgaGlnaCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpclxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdFx0XHRjb3VudGVyLS07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgc3RyaW5nIGJhc2VkIG9uIGFuIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZGVjb2RlYFxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuXHQgKiBAbmFtZSBlbmNvZGVcblx0ICogQHBhcmFtIHtBcnJheX0gY29kZVBvaW50cyBUaGUgYXJyYXkgb2YgbnVtZXJpYyBjb2RlIHBvaW50cy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIG5ldyBVbmljb2RlIHN0cmluZyAoVUNTLTIpLlxuXHQgKi9cblx0ZnVuY3Rpb24gdWNzMmVuY29kZShhcnJheSkge1xuXHRcdHJldHVybiBtYXAoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YXIgb3V0cHV0ID0gJyc7XG5cdFx0XHRpZiAodmFsdWUgPiAweEZGRkYpIHtcblx0XHRcdFx0dmFsdWUgLT0gMHgxMDAwMDtcblx0XHRcdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMCk7XG5cdFx0XHRcdHZhbHVlID0gMHhEQzAwIHwgdmFsdWUgJiAweDNGRjtcblx0XHRcdH1cblx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIG91dHB1dDtcblx0XHR9KS5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGJhc2ljIGNvZGUgcG9pbnQgaW50byBhIGRpZ2l0L2ludGVnZXIuXG5cdCAqIEBzZWUgYGRpZ2l0VG9CYXNpYygpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gY29kZVBvaW50IFRoZSBiYXNpYyBudW1lcmljIGNvZGUgcG9pbnQgdmFsdWUuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludCAoZm9yIHVzZSBpblxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGluIHRoZSByYW5nZSBgMGAgdG8gYGJhc2UgLSAxYCwgb3IgYGJhc2VgIGlmXG5cdCAqIHRoZSBjb2RlIHBvaW50IGRvZXMgbm90IHJlcHJlc2VudCBhIHZhbHVlLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzaWNUb0RpZ2l0KGNvZGVQb2ludCkge1xuXHRcdGlmIChjb2RlUG9pbnQgLSA0OCA8IDEwKSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gMjI7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA2NSA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gNjU7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA5NyA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gOTc7XG5cdFx0fVxuXHRcdHJldHVybiBiYXNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgZGlnaXQvaW50ZWdlciBpbnRvIGEgYmFzaWMgY29kZSBwb2ludC5cblx0ICogQHNlZSBgYmFzaWNUb0RpZ2l0KClgXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBkaWdpdCBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBiYXNpYyBjb2RlIHBvaW50IHdob3NlIHZhbHVlICh3aGVuIHVzZWQgZm9yXG5cdCAqIHJlcHJlc2VudGluZyBpbnRlZ2VycykgaXMgYGRpZ2l0YCwgd2hpY2ggbmVlZHMgdG8gYmUgaW4gdGhlIHJhbmdlXG5cdCAqIGAwYCB0byBgYmFzZSAtIDFgLiBJZiBgZmxhZ2AgaXMgbm9uLXplcm8sIHRoZSB1cHBlcmNhc2UgZm9ybSBpc1xuXHQgKiB1c2VkOyBlbHNlLCB0aGUgbG93ZXJjYXNlIGZvcm0gaXMgdXNlZC4gVGhlIGJlaGF2aW9yIGlzIHVuZGVmaW5lZFxuXHQgKiBpZiBgZmxhZ2AgaXMgbm9uLXplcm8gYW5kIGBkaWdpdGAgaGFzIG5vIHVwcGVyY2FzZSBmb3JtLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlnaXRUb0Jhc2ljKGRpZ2l0LCBmbGFnKSB7XG5cdFx0Ly8gIDAuLjI1IG1hcCB0byBBU0NJSSBhLi56IG9yIEEuLlpcblx0XHQvLyAyNi4uMzUgbWFwIHRvIEFTQ0lJIDAuLjlcblx0XHRyZXR1cm4gZGlnaXQgKyAyMiArIDc1ICogKGRpZ2l0IDwgMjYpIC0gKChmbGFnICE9IDApIDw8IDUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpYXMgYWRhcHRhdGlvbiBmdW5jdGlvbiBhcyBwZXIgc2VjdGlvbiAzLjQgb2YgUkZDIDM0OTIuXG5cdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNDkyI3NlY3Rpb24tMy40XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBhZGFwdChkZWx0YSwgbnVtUG9pbnRzLCBmaXJzdFRpbWUpIHtcblx0XHR2YXIgayA9IDA7XG5cdFx0ZGVsdGEgPSBmaXJzdFRpbWUgPyBmbG9vcihkZWx0YSAvIGRhbXApIDogZGVsdGEgPj4gMTtcblx0XHRkZWx0YSArPSBmbG9vcihkZWx0YSAvIG51bVBvaW50cyk7XG5cdFx0Zm9yICgvKiBubyBpbml0aWFsaXphdGlvbiAqLzsgZGVsdGEgPiBiYXNlTWludXNUTWluICogdE1heCA+PiAxOyBrICs9IGJhc2UpIHtcblx0XHRcdGRlbHRhID0gZmxvb3IoZGVsdGEgLyBiYXNlTWludXNUTWluKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZsb29yKGsgKyAoYmFzZU1pbnVzVE1pbiArIDEpICogZGVsdGEgLyAoZGVsdGEgKyBza2V3KSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzIHRvIGEgc3RyaW5nIG9mIFVuaWNvZGVcblx0ICogc3ltYm9scy5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIHJlc3VsdGluZyBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG5cdFx0Ly8gRG9uJ3QgdXNlIFVDUy0yXG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aCxcblx0XHQgICAgb3V0LFxuXHRcdCAgICBpID0gMCxcblx0XHQgICAgbiA9IGluaXRpYWxOLFxuXHRcdCAgICBiaWFzID0gaW5pdGlhbEJpYXMsXG5cdFx0ICAgIGJhc2ljLFxuXHRcdCAgICBqLFxuXHRcdCAgICBpbmRleCxcblx0XHQgICAgb2xkaSxcblx0XHQgICAgdyxcblx0XHQgICAgayxcblx0XHQgICAgZGlnaXQsXG5cdFx0ICAgIHQsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBiYXNlTWludXNUO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50czogbGV0IGBiYXNpY2AgYmUgdGhlIG51bWJlciBvZiBpbnB1dCBjb2RlXG5cdFx0Ly8gcG9pbnRzIGJlZm9yZSB0aGUgbGFzdCBkZWxpbWl0ZXIsIG9yIGAwYCBpZiB0aGVyZSBpcyBub25lLCB0aGVuIGNvcHlcblx0XHQvLyB0aGUgZmlyc3QgYmFzaWMgY29kZSBwb2ludHMgdG8gdGhlIG91dHB1dC5cblxuXHRcdGJhc2ljID0gaW5wdXQubGFzdEluZGV4T2YoZGVsaW1pdGVyKTtcblx0XHRpZiAoYmFzaWMgPCAwKSB7XG5cdFx0XHRiYXNpYyA9IDA7XG5cdFx0fVxuXG5cdFx0Zm9yIChqID0gMDsgaiA8IGJhc2ljOyArK2opIHtcblx0XHRcdC8vIGlmIGl0J3Mgbm90IGEgYmFzaWMgY29kZSBwb2ludFxuXHRcdFx0aWYgKGlucHV0LmNoYXJDb2RlQXQoaikgPj0gMHg4MCkge1xuXHRcdFx0XHRlcnJvcignbm90LWJhc2ljJyk7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQucHVzaChpbnB1dC5jaGFyQ29kZUF0KGopKTtcblx0XHR9XG5cblx0XHQvLyBNYWluIGRlY29kaW5nIGxvb3A6IHN0YXJ0IGp1c3QgYWZ0ZXIgdGhlIGxhc3QgZGVsaW1pdGVyIGlmIGFueSBiYXNpYyBjb2RlXG5cdFx0Ly8gcG9pbnRzIHdlcmUgY29waWVkOyBzdGFydCBhdCB0aGUgYmVnaW5uaW5nIG90aGVyd2lzZS5cblxuXHRcdGZvciAoaW5kZXggPSBiYXNpYyA+IDAgPyBiYXNpYyArIDEgOiAwOyBpbmRleCA8IGlucHV0TGVuZ3RoOyAvKiBubyBmaW5hbCBleHByZXNzaW9uICovKSB7XG5cblx0XHRcdC8vIGBpbmRleGAgaXMgdGhlIGluZGV4IG9mIHRoZSBuZXh0IGNoYXJhY3RlciB0byBiZSBjb25zdW1lZC5cblx0XHRcdC8vIERlY29kZSBhIGdlbmVyYWxpemVkIHZhcmlhYmxlLWxlbmd0aCBpbnRlZ2VyIGludG8gYGRlbHRhYCxcblx0XHRcdC8vIHdoaWNoIGdldHMgYWRkZWQgdG8gYGlgLiBUaGUgb3ZlcmZsb3cgY2hlY2tpbmcgaXMgZWFzaWVyXG5cdFx0XHQvLyBpZiB3ZSBpbmNyZWFzZSBgaWAgYXMgd2UgZ28sIHRoZW4gc3VidHJhY3Qgb2ZmIGl0cyBzdGFydGluZ1xuXHRcdFx0Ly8gdmFsdWUgYXQgdGhlIGVuZCB0byBvYnRhaW4gYGRlbHRhYC5cblx0XHRcdGZvciAob2xkaSA9IGksIHcgPSAxLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblxuXHRcdFx0XHRpZiAoaW5kZXggPj0gaW5wdXRMZW5ndGgpIHtcblx0XHRcdFx0XHRlcnJvcignaW52YWxpZC1pbnB1dCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlnaXQgPSBiYXNpY1RvRGlnaXQoaW5wdXQuY2hhckNvZGVBdChpbmRleCsrKSk7XG5cblx0XHRcdFx0aWYgKGRpZ2l0ID49IGJhc2UgfHwgZGlnaXQgPiBmbG9vcigobWF4SW50IC0gaSkgLyB3KSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aSArPSBkaWdpdCAqIHc7XG5cdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA8IHQpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0aWYgKHcgPiBmbG9vcihtYXhJbnQgLyBiYXNlTWludXNUKSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dyAqPSBiYXNlTWludXNUO1xuXG5cdFx0XHR9XG5cblx0XHRcdG91dCA9IG91dHB1dC5sZW5ndGggKyAxO1xuXHRcdFx0YmlhcyA9IGFkYXB0KGkgLSBvbGRpLCBvdXQsIG9sZGkgPT0gMCk7XG5cblx0XHRcdC8vIGBpYCB3YXMgc3VwcG9zZWQgdG8gd3JhcCBhcm91bmQgZnJvbSBgb3V0YCB0byBgMGAsXG5cdFx0XHQvLyBpbmNyZW1lbnRpbmcgYG5gIGVhY2ggdGltZSwgc28gd2UnbGwgZml4IHRoYXQgbm93OlxuXHRcdFx0aWYgKGZsb29yKGkgLyBvdXQpID4gbWF4SW50IC0gbikge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0biArPSBmbG9vcihpIC8gb3V0KTtcblx0XHRcdGkgJT0gb3V0O1xuXG5cdFx0XHQvLyBJbnNlcnQgYG5gIGF0IHBvc2l0aW9uIGBpYCBvZiB0aGUgb3V0cHV0XG5cdFx0XHRvdXRwdXQuc3BsaWNlKGkrKywgMCwgbik7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdWNzMmVuY29kZShvdXRwdXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scyAoZS5nLiBhIGRvbWFpbiBuYW1lIGxhYmVsKSB0byBhXG5cdCAqIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGVuY29kZShpbnB1dCkge1xuXHRcdHZhciBuLFxuXHRcdCAgICBkZWx0YSxcblx0XHQgICAgaGFuZGxlZENQQ291bnQsXG5cdFx0ICAgIGJhc2ljTGVuZ3RoLFxuXHRcdCAgICBiaWFzLFxuXHRcdCAgICBqLFxuXHRcdCAgICBtLFxuXHRcdCAgICBxLFxuXHRcdCAgICBrLFxuXHRcdCAgICB0LFxuXHRcdCAgICBjdXJyZW50VmFsdWUsXG5cdFx0ICAgIG91dHB1dCA9IFtdLFxuXHRcdCAgICAvKiogYGlucHV0TGVuZ3RoYCB3aWxsIGhvbGQgdGhlIG51bWJlciBvZiBjb2RlIHBvaW50cyBpbiBgaW5wdXRgLiAqL1xuXHRcdCAgICBpbnB1dExlbmd0aCxcblx0XHQgICAgLyoqIENhY2hlZCBjYWxjdWxhdGlvbiByZXN1bHRzICovXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50UGx1c09uZSxcblx0XHQgICAgYmFzZU1pbnVzVCxcblx0XHQgICAgcU1pbnVzVDtcblxuXHRcdC8vIENvbnZlcnQgdGhlIGlucHV0IGluIFVDUy0yIHRvIFVuaWNvZGVcblx0XHRpbnB1dCA9IHVjczJkZWNvZGUoaW5wdXQpO1xuXG5cdFx0Ly8gQ2FjaGUgdGhlIGxlbmd0aFxuXHRcdGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgc3RhdGVcblx0XHRuID0gaW5pdGlhbE47XG5cdFx0ZGVsdGEgPSAwO1xuXHRcdGJpYXMgPSBpbml0aWFsQmlhcztcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHNcblx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgMHg4MCkge1xuXHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoY3VycmVudFZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aGFuZGxlZENQQ291bnQgPSBiYXNpY0xlbmd0aCA9IG91dHB1dC5sZW5ndGg7XG5cblx0XHQvLyBgaGFuZGxlZENQQ291bnRgIGlzIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgdGhhdCBoYXZlIGJlZW4gaGFuZGxlZDtcblx0XHQvLyBgYmFzaWNMZW5ndGhgIGlzIHRoZSBudW1iZXIgb2YgYmFzaWMgY29kZSBwb2ludHMuXG5cblx0XHQvLyBGaW5pc2ggdGhlIGJhc2ljIHN0cmluZyAtIGlmIGl0IGlzIG5vdCBlbXB0eSAtIHdpdGggYSBkZWxpbWl0ZXJcblx0XHRpZiAoYmFzaWNMZW5ndGgpIHtcblx0XHRcdG91dHB1dC5wdXNoKGRlbGltaXRlcik7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBlbmNvZGluZyBsb29wOlxuXHRcdHdoaWxlIChoYW5kbGVkQ1BDb3VudCA8IGlucHV0TGVuZ3RoKSB7XG5cblx0XHRcdC8vIEFsbCBub24tYmFzaWMgY29kZSBwb2ludHMgPCBuIGhhdmUgYmVlbiBoYW5kbGVkIGFscmVhZHkuIEZpbmQgdGhlIG5leHRcblx0XHRcdC8vIGxhcmdlciBvbmU6XG5cdFx0XHRmb3IgKG0gPSBtYXhJbnQsIGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA+PSBuICYmIGN1cnJlbnRWYWx1ZSA8IG0pIHtcblx0XHRcdFx0XHRtID0gY3VycmVudFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEluY3JlYXNlIGBkZWx0YWAgZW5vdWdoIHRvIGFkdmFuY2UgdGhlIGRlY29kZXIncyA8bixpPiBzdGF0ZSB0byA8bSwwPixcblx0XHRcdC8vIGJ1dCBndWFyZCBhZ2FpbnN0IG92ZXJmbG93XG5cdFx0XHRoYW5kbGVkQ1BDb3VudFBsdXNPbmUgPSBoYW5kbGVkQ1BDb3VudCArIDE7XG5cdFx0XHRpZiAobSAtIG4gPiBmbG9vcigobWF4SW50IC0gZGVsdGEpIC8gaGFuZGxlZENQQ291bnRQbHVzT25lKSkge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsdGEgKz0gKG0gLSBuKSAqIGhhbmRsZWRDUENvdW50UGx1c09uZTtcblx0XHRcdG4gPSBtO1xuXG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgbiAmJiArK2RlbHRhID4gbWF4SW50KSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlID09IG4pIHtcblx0XHRcdFx0XHQvLyBSZXByZXNlbnQgZGVsdGEgYXMgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlclxuXHRcdFx0XHRcdGZvciAocSA9IGRlbHRhLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblx0XHRcdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXHRcdFx0XHRcdFx0aWYgKHEgPCB0KSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cU1pbnVzVCA9IHEgLSB0O1xuXHRcdFx0XHRcdFx0YmFzZU1pbnVzVCA9IGJhc2UgLSB0O1xuXHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goXG5cdFx0XHRcdFx0XHRcdHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWModCArIHFNaW51c1QgJSBiYXNlTWludXNULCAwKSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRxID0gZmxvb3IocU1pbnVzVCAvIGJhc2VNaW51c1QpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWMocSwgMCkpKTtcblx0XHRcdFx0XHRiaWFzID0gYWRhcHQoZGVsdGEsIGhhbmRsZWRDUENvdW50UGx1c09uZSwgaGFuZGxlZENQQ291bnQgPT0gYmFzaWNMZW5ndGgpO1xuXHRcdFx0XHRcdGRlbHRhID0gMDtcblx0XHRcdFx0XHQrK2hhbmRsZWRDUENvdW50O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdCsrZGVsdGE7XG5cdFx0XHQrK247XG5cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dC5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzXG5cdCAqIHRvIFVuaWNvZGUuIE9ubHkgdGhlIFB1bnljb2RlZCBwYXJ0cyBvZiB0aGUgaW5wdXQgd2lsbCBiZSBjb252ZXJ0ZWQsIGkuZS5cblx0ICogaXQgZG9lc24ndCBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgb24gYSBzdHJpbmcgdGhhdCBoYXMgYWxyZWFkeSBiZWVuXG5cdCAqIGNvbnZlcnRlZCB0byBVbmljb2RlLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBQdW55Y29kZWQgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcyB0b1xuXHQgKiBjb252ZXJ0IHRvIFVuaWNvZGUuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBVbmljb2RlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBQdW55Y29kZVxuXHQgKiBzdHJpbmcuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b1VuaWNvZGUoaW5wdXQpIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleFB1bnljb2RlLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/IGRlY29kZShzdHJpbmcuc2xpY2UoNCkudG9Mb3dlckNhc2UoKSlcblx0XHRcdFx0OiBzdHJpbmc7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBVbmljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzIHRvXG5cdCAqIFB1bnljb2RlLiBPbmx5IHRoZSBub24tQVNDSUkgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHdpbGwgYmUgY29udmVydGVkLFxuXHQgKiBpLmUuIGl0IGRvZXNuJ3QgbWF0dGVyIGlmIHlvdSBjYWxsIGl0IHdpdGggYSBkb21haW4gdGhhdCdzIGFscmVhZHkgaW5cblx0ICogQVNDSUkuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MgdG8gY29udmVydCwgYXMgYVxuXHQgKiBVbmljb2RlIHN0cmluZy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFB1bnljb2RlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBkb21haW4gbmFtZSBvclxuXHQgKiBlbWFpbCBhZGRyZXNzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9BU0NJSShpbnB1dCkge1xuXHRcdHJldHVybiBtYXBEb21haW4oaW5wdXQsIGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHJlZ2V4Tm9uQVNDSUkudGVzdChzdHJpbmcpXG5cdFx0XHRcdD8gJ3huLS0nICsgZW5jb2RlKHN0cmluZylcblx0XHRcdFx0OiBzdHJpbmc7XG5cdFx0fSk7XG5cdH1cblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHQvKiogRGVmaW5lIHRoZSBwdWJsaWMgQVBJICovXG5cdHB1bnljb2RlID0ge1xuXHRcdC8qKlxuXHRcdCAqIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBQdW55Y29kZS5qcyB2ZXJzaW9uIG51bWJlci5cblx0XHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0XHQgKiBAdHlwZSBTdHJpbmdcblx0XHQgKi9cblx0XHQndmVyc2lvbic6ICcxLjQuMScsXG5cdFx0LyoqXG5cdFx0ICogQW4gb2JqZWN0IG9mIG1ldGhvZHMgdG8gY29udmVydCBmcm9tIEphdmFTY3JpcHQncyBpbnRlcm5hbCBjaGFyYWN0ZXJcblx0XHQgKiByZXByZXNlbnRhdGlvbiAoVUNTLTIpIHRvIFVuaWNvZGUgY29kZSBwb2ludHMsIGFuZCBiYWNrLlxuXHRcdCAqIEBzZWUgPGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nPlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIE9iamVjdFxuXHRcdCAqL1xuXHRcdCd1Y3MyJzoge1xuXHRcdFx0J2RlY29kZSc6IHVjczJkZWNvZGUsXG5cdFx0XHQnZW5jb2RlJzogdWNzMmVuY29kZVxuXHRcdH0sXG5cdFx0J2RlY29kZSc6IGRlY29kZSxcblx0XHQnZW5jb2RlJzogZW5jb2RlLFxuXHRcdCd0b0FTQ0lJJzogdG9BU0NJSSxcblx0XHQndG9Vbmljb2RlJzogdG9Vbmljb2RlXG5cdH07XG5cblx0LyoqIEV4cG9zZSBgcHVueWNvZGVgICovXG5cdC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIHNwZWNpZmljIGNvbmRpdGlvbiBwYXR0ZXJuc1xuXHQvLyBsaWtlIHRoZSBmb2xsb3dpbmc6XG5cdGlmIChcblx0XHR0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJlxuXHRcdGRlZmluZS5hbWRcblx0KSB7XG5cdFx0ZGVmaW5lKCdwdW55Y29kZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHB1bnljb2RlO1xuXHRcdH0pO1xuXHR9IGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcblx0XHRpZiAobW9kdWxlLmV4cG9ydHMgPT0gZnJlZUV4cG9ydHMpIHtcblx0XHRcdC8vIGluIE5vZGUuanMsIGlvLmpzLCBvciBSaW5nb0pTIHYwLjguMCtcblx0XHRcdGZyZWVNb2R1bGUuZXhwb3J0cyA9IHB1bnljb2RlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBpbiBOYXJ3aGFsIG9yIFJpbmdvSlMgdjAuNy4wLVxuXHRcdFx0Zm9yIChrZXkgaW4gcHVueWNvZGUpIHtcblx0XHRcdFx0cHVueWNvZGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAoZnJlZUV4cG9ydHNba2V5XSA9IHB1bnljb2RlW2tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvLyBpbiBSaGlubyBvciBhIHdlYiBicm93c2VyXG5cdFx0cm9vdC5wdW55Y29kZSA9IHB1bnljb2RlO1xuXHR9XG5cbn0odGhpcykpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnlQcmltaXRpdmUgPSBmdW5jdGlvbih2KSB7XG4gIHN3aXRjaCAodHlwZW9mIHYpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHY7XG5cbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2ID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gaXNGaW5pdGUodikgPyB2IDogJyc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwgc2VwLCBlcSwgbmFtZSkge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIG9iaiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBtYXAob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihrKSB7XG4gICAgICB2YXIga3MgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuICAgICAgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgICByZXR1cm4gbWFwKG9ialtrXSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuZnVuY3Rpb24gbWFwICh4cywgZikge1xuICBpZiAoeHMubWFwKSByZXR1cm4geHMubWFwKGYpO1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICByZXMucHVzaChmKHhzW2ldLCBpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG4iLCJ2YXIgcmFuZG9tID0gcmVxdWlyZShcInJuZFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb2xvcjtcblxuZnVuY3Rpb24gY29sb3IgKG1heCwgbWluKSB7XG4gIG1heCB8fCAobWF4ID0gMjU1KTtcbiAgcmV0dXJuICdyZ2IoJyArIHJhbmRvbShtYXgsIG1pbikgKyAnLCAnICsgcmFuZG9tKG1heCwgbWluKSArICcsICcgKyByYW5kb20obWF4LCBtaW4pICsgJyknO1xufVxuIiwidmFyIHJlbGF0aXZlRGF0ZSA9IChmdW5jdGlvbih1bmRlZmluZWQpe1xuXG4gIHZhciBTRUNPTkQgPSAxMDAwLFxuICAgICAgTUlOVVRFID0gNjAgKiBTRUNPTkQsXG4gICAgICBIT1VSID0gNjAgKiBNSU5VVEUsXG4gICAgICBEQVkgPSAyNCAqIEhPVVIsXG4gICAgICBXRUVLID0gNyAqIERBWSxcbiAgICAgIFlFQVIgPSBEQVkgKiAzNjUsXG4gICAgICBNT05USCA9IFlFQVIgLyAxMjtcblxuICB2YXIgZm9ybWF0cyA9IFtcbiAgICBbIDAuNyAqIE1JTlVURSwgJ2p1c3Qgbm93JyBdLFxuICAgIFsgMS41ICogTUlOVVRFLCAnYSBtaW51dGUgYWdvJyBdLFxuICAgIFsgNjAgKiBNSU5VVEUsICdtaW51dGVzIGFnbycsIE1JTlVURSBdLFxuICAgIFsgMS41ICogSE9VUiwgJ2FuIGhvdXIgYWdvJyBdLFxuICAgIFsgREFZLCAnaG91cnMgYWdvJywgSE9VUiBdLFxuICAgIFsgMiAqIERBWSwgJ3llc3RlcmRheScgXSxcbiAgICBbIDcgKiBEQVksICdkYXlzIGFnbycsIERBWSBdLFxuICAgIFsgMS41ICogV0VFSywgJ2Egd2VlayBhZ28nXSxcbiAgICBbIE1PTlRILCAnd2Vla3MgYWdvJywgV0VFSyBdLFxuICAgIFsgMS41ICogTU9OVEgsICdhIG1vbnRoIGFnbycgXSxcbiAgICBbIFlFQVIsICdtb250aHMgYWdvJywgTU9OVEggXSxcbiAgICBbIDEuNSAqIFlFQVIsICdhIHllYXIgYWdvJyBdLFxuICAgIFsgTnVtYmVyLk1BWF9WQUxVRSwgJ3llYXJzIGFnbycsIFlFQVIgXVxuICBdO1xuXG4gIGZ1bmN0aW9uIHJlbGF0aXZlRGF0ZShpbnB1dCxyZWZlcmVuY2Upe1xuICAgICFyZWZlcmVuY2UgJiYgKCByZWZlcmVuY2UgPSAobmV3IERhdGUpLmdldFRpbWUoKSApO1xuICAgIHJlZmVyZW5jZSBpbnN0YW5jZW9mIERhdGUgJiYgKCByZWZlcmVuY2UgPSByZWZlcmVuY2UuZ2V0VGltZSgpICk7XG4gICAgaW5wdXQgaW5zdGFuY2VvZiBEYXRlICYmICggaW5wdXQgPSBpbnB1dC5nZXRUaW1lKCkgKTtcbiAgICBcbiAgICB2YXIgZGVsdGEgPSByZWZlcmVuY2UgLSBpbnB1dCxcbiAgICAgICAgZm9ybWF0LCBpLCBsZW47XG5cbiAgICBmb3IoaSA9IC0xLCBsZW49Zm9ybWF0cy5sZW5ndGg7ICsraSA8IGxlbjsgKXtcbiAgICAgIGZvcm1hdCA9IGZvcm1hdHNbaV07XG4gICAgICBpZihkZWx0YSA8IGZvcm1hdFswXSl7XG4gICAgICAgIHJldHVybiBmb3JtYXRbMl0gPT0gdW5kZWZpbmVkID8gZm9ybWF0WzFdIDogTWF0aC5yb3VuZChkZWx0YS9mb3JtYXRbMl0pICsgJyAnICsgZm9ybWF0WzFdO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gcmVsYXRpdmVEYXRlO1xuXG59KSgpO1xuXG5pZih0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKXtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZWxhdGl2ZURhdGU7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJhbmRvbTtcblxuZnVuY3Rpb24gcmFuZG9tIChtYXgsIG1pbikge1xuICBtYXggfHwgKG1heCA9IDk5OTk5OTk5OTk5OSk7XG4gIG1pbiB8fCAobWluID0gMCk7XG5cbiAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKTtcbn1cbiIsIlxubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdhJyxcbiAgJ2FuJyxcbiAgJ2FuZCcsXG4gICdhcycsXG4gICdhdCcsXG4gICdidXQnLFxuICAnYnknLFxuICAnZW4nLFxuICAnZm9yJyxcbiAgJ2Zyb20nLFxuICAnaG93JyxcbiAgJ2lmJyxcbiAgJ2luJyxcbiAgJ25laXRoZXInLFxuICAnbm9yJyxcbiAgJ29mJyxcbiAgJ29uJyxcbiAgJ29ubHknLFxuICAnb250bycsXG4gICdvdXQnLFxuICAnb3InLFxuICAncGVyJyxcbiAgJ3NvJyxcbiAgJ3RoYW4nLFxuICAndGhhdCcsXG4gICd0aGUnLFxuICAndG8nLFxuICAndW50aWwnLFxuICAndXAnLFxuICAndXBvbicsXG4gICd2JyxcbiAgJ3YuJyxcbiAgJ3ZlcnN1cycsXG4gICd2cycsXG4gICd2cy4nLFxuICAndmlhJyxcbiAgJ3doZW4nLFxuICAnd2l0aCcsXG4gICd3aXRob3V0JyxcbiAgJ3lldCdcbl07IiwidmFyIHRvVGl0bGUgPSByZXF1aXJlKFwidG8tdGl0bGVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gdXJsVG9UaXRsZTtcblxuZnVuY3Rpb24gdXJsVG9UaXRsZSAodXJsKSB7XG4gIHVybCA9IHVuZXNjYXBlKHVybCkucmVwbGFjZSgvXy9nLCAnICcpO1xuICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcdys6XFwvXFwvLywgJycpO1xuICB1cmwgPSB1cmwucmVwbGFjZSgvXnd3d1xcLi8sICcnKTtcbiAgdXJsID0gdXJsLnJlcGxhY2UoLyhcXC98XFw/KSQvLCAnJyk7XG5cbiAgdmFyIHBhcnRzID0gdXJsLnNwbGl0KCc/Jyk7XG4gIHVybCA9IHBhcnRzWzBdO1xuICB1cmwgPSB1cmwucmVwbGFjZSgvXFwuXFx3KyQvLCAnJyk7XG5cbiAgcGFydHMgPSB1cmwuc3BsaXQoJy8nKTtcblxuICB2YXIgbmFtZSA9IHBhcnRzWzBdO1xuICBuYW1lID0gbmFtZS5yZXBsYWNlKC9cXC5cXHcrKFxcL3wkKS8sICcnKS5yZXBsYWNlKC9cXC4oY29tP3xuZXR8b3JnfGZyKSQvLCAnJylcblxuICBpZiAocGFydHMubGVuZ3RoID09IDEpIHtcbiAgICByZXR1cm4gdGl0bGUobmFtZSk7XG4gIH1cblxuICByZXR1cm4gdG9UaXRsZShwYXJ0cy5zbGljZSgxKS5yZXZlcnNlKCkubWFwKHRvVGl0bGUpLmpvaW4oJyAtICcpKSArICcgb24gJyArIHRpdGxlKG5hbWUpO1xufVxuXG5mdW5jdGlvbiB0aXRsZSAoaG9zdCkge1xuICBpZiAoL15bXFx3XFwuXFwtXSs6XFxkKy8udGVzdChob3N0KSkge1xuICAgIHJldHVybiBob3N0XG4gIH1cblxuICByZXR1cm4gdG9UaXRsZShob3N0LnNwbGl0KCcuJykuam9pbignLCAnKSlcbn1cbiIsIlxudmFyIGNsZWFuID0gcmVxdWlyZSgndG8tbm8tY2FzZScpO1xuXG5cbi8qKlxuICogRXhwb3NlIGB0b0NhcGl0YWxDYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvQ2FwaXRhbENhc2U7XG5cblxuLyoqXG4gKiBDb252ZXJ0IGEgYHN0cmluZ2AgdG8gY2FwaXRhbCBjYXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5cbmZ1bmN0aW9uIHRvQ2FwaXRhbENhc2UgKHN0cmluZykge1xuICByZXR1cm4gY2xlYW4oc3RyaW5nKS5yZXBsYWNlKC8oXnxcXHMpKFxcdykvZywgZnVuY3Rpb24gKG1hdGNoZXMsIHByZXZpb3VzLCBsZXR0ZXIpIHtcbiAgICByZXR1cm4gcHJldmlvdXMgKyBsZXR0ZXIudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59IiwiXG4vKipcbiAqIEV4cG9zZSBgdG9Ob0Nhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdG9Ob0Nhc2U7XG5cblxuLyoqXG4gKiBUZXN0IHdoZXRoZXIgYSBzdHJpbmcgaXMgY2FtZWwtY2FzZS5cbiAqL1xuXG52YXIgaGFzU3BhY2UgPSAvXFxzLztcbnZhciBoYXNDYW1lbCA9IC9bYS16XVtBLVpdLztcbnZhciBoYXNTZXBhcmF0b3IgPSAvW1xcV19dLztcblxuXG4vKipcbiAqIFJlbW92ZSBhbnkgc3RhcnRpbmcgY2FzZSBmcm9tIGEgYHN0cmluZ2AsIGxpa2UgY2FtZWwgb3Igc25ha2UsIGJ1dCBrZWVwXG4gKiBzcGFjZXMgYW5kIHB1bmN0dWF0aW9uIHRoYXQgbWF5IGJlIGltcG9ydGFudCBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHRvTm9DYXNlIChzdHJpbmcpIHtcbiAgaWYgKGhhc1NwYWNlLnRlc3Qoc3RyaW5nKSkgcmV0dXJuIHN0cmluZy50b0xvd2VyQ2FzZSgpO1xuXG4gIGlmIChoYXNTZXBhcmF0b3IudGVzdChzdHJpbmcpKSBzdHJpbmcgPSB1bnNlcGFyYXRlKHN0cmluZyk7XG4gIGlmIChoYXNDYW1lbC50ZXN0KHN0cmluZykpIHN0cmluZyA9IHVuY2FtZWxpemUoc3RyaW5nKTtcbiAgcmV0dXJuIHN0cmluZy50b0xvd2VyQ2FzZSgpO1xufVxuXG5cbi8qKlxuICogU2VwYXJhdG9yIHNwbGl0dGVyLlxuICovXG5cbnZhciBzZXBhcmF0b3JTcGxpdHRlciA9IC9bXFxXX10rKC58JCkvZztcblxuXG4vKipcbiAqIFVuLXNlcGFyYXRlIGEgYHN0cmluZ2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHVuc2VwYXJhdGUgKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2Uoc2VwYXJhdG9yU3BsaXR0ZXIsIGZ1bmN0aW9uIChtLCBuZXh0KSB7XG4gICAgcmV0dXJuIG5leHQgPyAnICcgKyBuZXh0IDogJyc7XG4gIH0pO1xufVxuXG5cbi8qKlxuICogQ2FtZWxjYXNlIHNwbGl0dGVyLlxuICovXG5cbnZhciBjYW1lbFNwbGl0dGVyID0gLyguKShbQS1aXSspL2c7XG5cblxuLyoqXG4gKiBVbi1jYW1lbGNhc2UgYSBgc3RyaW5nYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gdW5jYW1lbGl6ZSAoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShjYW1lbFNwbGl0dGVyLCBmdW5jdGlvbiAobSwgcHJldmlvdXMsIHVwcGVycykge1xuICAgIHJldHVybiBwcmV2aW91cyArICcgJyArIHVwcGVycy50b0xvd2VyQ2FzZSgpLnNwbGl0KCcnKS5qb2luKCcgJyk7XG4gIH0pO1xufSIsInZhciBlc2NhcGUgPSByZXF1aXJlKCdlc2NhcGUtcmVnZXhwLWNvbXBvbmVudCcpO1xudmFyIGNhcGl0YWwgPSByZXF1aXJlKCd0by1jYXBpdGFsLWNhc2UnKTtcbnZhciBtaW5vcnMgPSByZXF1aXJlKCd0aXRsZS1jYXNlLW1pbm9ycycpO1xuXG4vKipcbiAqIEV4cG9zZSBgdG9UaXRsZUNhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdG9UaXRsZUNhc2U7XG5cblxuLyoqXG4gKiBNaW5vcnMuXG4gKi9cblxudmFyIGVzY2FwZWQgPSBtaW5vcnMubWFwKGVzY2FwZSk7XG52YXIgbWlub3JNYXRjaGVyID0gbmV3IFJlZ0V4cCgnW15eXVxcXFxiKCcgKyBlc2NhcGVkLmpvaW4oJ3wnKSArICcpXFxcXGInLCAnaWcnKTtcbnZhciBjb2xvbk1hdGNoZXIgPSAvOlxccyooXFx3KS9nO1xuXG5cbi8qKlxuICogQ29udmVydCBhIGBzdHJpbmdgIHRvIGNhbWVsIGNhc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cblxuZnVuY3Rpb24gdG9UaXRsZUNhc2UgKHN0cmluZykge1xuICByZXR1cm4gY2FwaXRhbChzdHJpbmcpXG4gICAgLnJlcGxhY2UobWlub3JNYXRjaGVyLCBmdW5jdGlvbiAobWlub3IpIHtcbiAgICAgIHJldHVybiBtaW5vci50b0xvd2VyQ2FzZSgpO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoY29sb25NYXRjaGVyLCBmdW5jdGlvbiAobGV0dGVyKSB7XG4gICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHVueWNvZGUgPSByZXF1aXJlKCdwdW55Y29kZScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuZXhwb3J0cy5wYXJzZSA9IHVybFBhcnNlO1xuZXhwb3J0cy5yZXNvbHZlID0gdXJsUmVzb2x2ZTtcbmV4cG9ydHMucmVzb2x2ZU9iamVjdCA9IHVybFJlc29sdmVPYmplY3Q7XG5leHBvcnRzLmZvcm1hdCA9IHVybEZvcm1hdDtcblxuZXhwb3J0cy5VcmwgPSBVcmw7XG5cbmZ1bmN0aW9uIFVybCgpIHtcbiAgdGhpcy5wcm90b2NvbCA9IG51bGw7XG4gIHRoaXMuc2xhc2hlcyA9IG51bGw7XG4gIHRoaXMuYXV0aCA9IG51bGw7XG4gIHRoaXMuaG9zdCA9IG51bGw7XG4gIHRoaXMucG9ydCA9IG51bGw7XG4gIHRoaXMuaG9zdG5hbWUgPSBudWxsO1xuICB0aGlzLmhhc2ggPSBudWxsO1xuICB0aGlzLnNlYXJjaCA9IG51bGw7XG4gIHRoaXMucXVlcnkgPSBudWxsO1xuICB0aGlzLnBhdGhuYW1lID0gbnVsbDtcbiAgdGhpcy5wYXRoID0gbnVsbDtcbiAgdGhpcy5ocmVmID0gbnVsbDtcbn1cblxuLy8gUmVmZXJlbmNlOiBSRkMgMzk4NiwgUkZDIDE4MDgsIFJGQyAyMzk2XG5cbi8vIGRlZmluZSB0aGVzZSBoZXJlIHNvIGF0IGxlYXN0IHRoZXkgb25seSBoYXZlIHRvIGJlXG4vLyBjb21waWxlZCBvbmNlIG9uIHRoZSBmaXJzdCBtb2R1bGUgbG9hZC5cbnZhciBwcm90b2NvbFBhdHRlcm4gPSAvXihbYS16MC05ListXSs6KS9pLFxuICAgIHBvcnRQYXR0ZXJuID0gLzpbMC05XSokLyxcblxuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgYSBzaW1wbGUgcGF0aCBVUkxcbiAgICBzaW1wbGVQYXRoUGF0dGVybiA9IC9eKFxcL1xcLz8oPyFcXC8pW15cXD9cXHNdKikoXFw/W15cXHNdKik/JC8sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyByZXNlcnZlZCBmb3IgZGVsaW1pdGluZyBVUkxzLlxuICAgIC8vIFdlIGFjdHVhbGx5IGp1c3QgYXV0by1lc2NhcGUgdGhlc2UuXG4gICAgZGVsaW1zID0gWyc8JywgJz4nLCAnXCInLCAnYCcsICcgJywgJ1xccicsICdcXG4nLCAnXFx0J10sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyBub3QgYWxsb3dlZCBmb3IgdmFyaW91cyByZWFzb25zLlxuICAgIHVud2lzZSA9IFsneycsICd9JywgJ3wnLCAnXFxcXCcsICdeJywgJ2AnXS5jb25jYXQoZGVsaW1zKSxcblxuICAgIC8vIEFsbG93ZWQgYnkgUkZDcywgYnV0IGNhdXNlIG9mIFhTUyBhdHRhY2tzLiAgQWx3YXlzIGVzY2FwZSB0aGVzZS5cbiAgICBhdXRvRXNjYXBlID0gWydcXCcnXS5jb25jYXQodW53aXNlKSxcbiAgICAvLyBDaGFyYWN0ZXJzIHRoYXQgYXJlIG5ldmVyIGV2ZXIgYWxsb3dlZCBpbiBhIGhvc3RuYW1lLlxuICAgIC8vIE5vdGUgdGhhdCBhbnkgaW52YWxpZCBjaGFycyBhcmUgYWxzbyBoYW5kbGVkLCBidXQgdGhlc2VcbiAgICAvLyBhcmUgdGhlIG9uZXMgdGhhdCBhcmUgKmV4cGVjdGVkKiB0byBiZSBzZWVuLCBzbyB3ZSBmYXN0LXBhdGhcbiAgICAvLyB0aGVtLlxuICAgIG5vbkhvc3RDaGFycyA9IFsnJScsICcvJywgJz8nLCAnOycsICcjJ10uY29uY2F0KGF1dG9Fc2NhcGUpLFxuICAgIGhvc3RFbmRpbmdDaGFycyA9IFsnLycsICc/JywgJyMnXSxcbiAgICBob3N0bmFtZU1heExlbiA9IDI1NSxcbiAgICBob3N0bmFtZVBhcnRQYXR0ZXJuID0gL15bK2EtejAtOUEtWl8tXXswLDYzfSQvLFxuICAgIGhvc3RuYW1lUGFydFN0YXJ0ID0gL14oWythLXowLTlBLVpfLV17MCw2M30pKC4qKSQvLFxuICAgIC8vIHByb3RvY29scyB0aGF0IGNhbiBhbGxvdyBcInVuc2FmZVwiIGFuZCBcInVud2lzZVwiIGNoYXJzLlxuICAgIHVuc2FmZVByb3RvY29sID0ge1xuICAgICAgJ2phdmFzY3JpcHQnOiB0cnVlLFxuICAgICAgJ2phdmFzY3JpcHQ6JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgbmV2ZXIgaGF2ZSBhIGhvc3RuYW1lLlxuICAgIGhvc3RsZXNzUHJvdG9jb2wgPSB7XG4gICAgICAnamF2YXNjcmlwdCc6IHRydWUsXG4gICAgICAnamF2YXNjcmlwdDonOiB0cnVlXG4gICAgfSxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBhbHdheXMgY29udGFpbiBhIC8vIGJpdC5cbiAgICBzbGFzaGVkUHJvdG9jb2wgPSB7XG4gICAgICAnaHR0cCc6IHRydWUsXG4gICAgICAnaHR0cHMnOiB0cnVlLFxuICAgICAgJ2Z0cCc6IHRydWUsXG4gICAgICAnZ29waGVyJzogdHJ1ZSxcbiAgICAgICdmaWxlJzogdHJ1ZSxcbiAgICAgICdodHRwOic6IHRydWUsXG4gICAgICAnaHR0cHM6JzogdHJ1ZSxcbiAgICAgICdmdHA6JzogdHJ1ZSxcbiAgICAgICdnb3BoZXI6JzogdHJ1ZSxcbiAgICAgICdmaWxlOic6IHRydWVcbiAgICB9LFxuICAgIHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcblxuZnVuY3Rpb24gdXJsUGFyc2UodXJsLCBwYXJzZVF1ZXJ5U3RyaW5nLCBzbGFzaGVzRGVub3RlSG9zdCkge1xuICBpZiAodXJsICYmIHV0aWwuaXNPYmplY3QodXJsKSAmJiB1cmwgaW5zdGFuY2VvZiBVcmwpIHJldHVybiB1cmw7XG5cbiAgdmFyIHUgPSBuZXcgVXJsO1xuICB1LnBhcnNlKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpO1xuICByZXR1cm4gdTtcbn1cblxuVXJsLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpIHtcbiAgaWYgKCF1dGlsLmlzU3RyaW5nKHVybCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGFyYW1ldGVyICd1cmwnIG11c3QgYmUgYSBzdHJpbmcsIG5vdCBcIiArIHR5cGVvZiB1cmwpO1xuICB9XG5cbiAgLy8gQ29weSBjaHJvbWUsIElFLCBvcGVyYSBiYWNrc2xhc2gtaGFuZGxpbmcgYmVoYXZpb3IuXG4gIC8vIEJhY2sgc2xhc2hlcyBiZWZvcmUgdGhlIHF1ZXJ5IHN0cmluZyBnZXQgY29udmVydGVkIHRvIGZvcndhcmQgc2xhc2hlc1xuICAvLyBTZWU6IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0yNTkxNlxuICB2YXIgcXVlcnlJbmRleCA9IHVybC5pbmRleE9mKCc/JyksXG4gICAgICBzcGxpdHRlciA9XG4gICAgICAgICAgKHF1ZXJ5SW5kZXggIT09IC0xICYmIHF1ZXJ5SW5kZXggPCB1cmwuaW5kZXhPZignIycpKSA/ICc/JyA6ICcjJyxcbiAgICAgIHVTcGxpdCA9IHVybC5zcGxpdChzcGxpdHRlciksXG4gICAgICBzbGFzaFJlZ2V4ID0gL1xcXFwvZztcbiAgdVNwbGl0WzBdID0gdVNwbGl0WzBdLnJlcGxhY2Uoc2xhc2hSZWdleCwgJy8nKTtcbiAgdXJsID0gdVNwbGl0LmpvaW4oc3BsaXR0ZXIpO1xuXG4gIHZhciByZXN0ID0gdXJsO1xuXG4gIC8vIHRyaW0gYmVmb3JlIHByb2NlZWRpbmcuXG4gIC8vIFRoaXMgaXMgdG8gc3VwcG9ydCBwYXJzZSBzdHVmZiBsaWtlIFwiICBodHRwOi8vZm9vLmNvbSAgXFxuXCJcbiAgcmVzdCA9IHJlc3QudHJpbSgpO1xuXG4gIGlmICghc2xhc2hlc0Rlbm90ZUhvc3QgJiYgdXJsLnNwbGl0KCcjJykubGVuZ3RoID09PSAxKSB7XG4gICAgLy8gVHJ5IGZhc3QgcGF0aCByZWdleHBcbiAgICB2YXIgc2ltcGxlUGF0aCA9IHNpbXBsZVBhdGhQYXR0ZXJuLmV4ZWMocmVzdCk7XG4gICAgaWYgKHNpbXBsZVBhdGgpIHtcbiAgICAgIHRoaXMucGF0aCA9IHJlc3Q7XG4gICAgICB0aGlzLmhyZWYgPSByZXN0O1xuICAgICAgdGhpcy5wYXRobmFtZSA9IHNpbXBsZVBhdGhbMV07XG4gICAgICBpZiAoc2ltcGxlUGF0aFsyXSkge1xuICAgICAgICB0aGlzLnNlYXJjaCA9IHNpbXBsZVBhdGhbMl07XG4gICAgICAgIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHRoaXMuc2VhcmNoLnN1YnN0cigxKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5xdWVyeSA9IHRoaXMuc2VhcmNoLnN1YnN0cigxKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoID0gJyc7XG4gICAgICAgIHRoaXMucXVlcnkgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwcm90byA9IHByb3RvY29sUGF0dGVybi5leGVjKHJlc3QpO1xuICBpZiAocHJvdG8pIHtcbiAgICBwcm90byA9IHByb3RvWzBdO1xuICAgIHZhciBsb3dlclByb3RvID0gcHJvdG8udG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLnByb3RvY29sID0gbG93ZXJQcm90bztcbiAgICByZXN0ID0gcmVzdC5zdWJzdHIocHJvdG8ubGVuZ3RoKTtcbiAgfVxuXG4gIC8vIGZpZ3VyZSBvdXQgaWYgaXQncyBnb3QgYSBob3N0XG4gIC8vIHVzZXJAc2VydmVyIGlzICphbHdheXMqIGludGVycHJldGVkIGFzIGEgaG9zdG5hbWUsIGFuZCB1cmxcbiAgLy8gcmVzb2x1dGlvbiB3aWxsIHRyZWF0IC8vZm9vL2JhciBhcyBob3N0PWZvbyxwYXRoPWJhciBiZWNhdXNlIHRoYXQnc1xuICAvLyBob3cgdGhlIGJyb3dzZXIgcmVzb2x2ZXMgcmVsYXRpdmUgVVJMcy5cbiAgaWYgKHNsYXNoZXNEZW5vdGVIb3N0IHx8IHByb3RvIHx8IHJlc3QubWF0Y2goL15cXC9cXC9bXkBcXC9dK0BbXkBcXC9dKy8pKSB7XG4gICAgdmFyIHNsYXNoZXMgPSByZXN0LnN1YnN0cigwLCAyKSA9PT0gJy8vJztcbiAgICBpZiAoc2xhc2hlcyAmJiAhKHByb3RvICYmIGhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dKSkge1xuICAgICAgcmVzdCA9IHJlc3Quc3Vic3RyKDIpO1xuICAgICAgdGhpcy5zbGFzaGVzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dICYmXG4gICAgICAoc2xhc2hlcyB8fCAocHJvdG8gJiYgIXNsYXNoZWRQcm90b2NvbFtwcm90b10pKSkge1xuXG4gICAgLy8gdGhlcmUncyBhIGhvc3RuYW1lLlxuICAgIC8vIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiAvLCA/LCA7LCBvciAjIGVuZHMgdGhlIGhvc3QuXG4gICAgLy9cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBAIGluIHRoZSBob3N0bmFtZSwgdGhlbiBub24taG9zdCBjaGFycyAqYXJlKiBhbGxvd2VkXG4gICAgLy8gdG8gdGhlIGxlZnQgb2YgdGhlIGxhc3QgQCBzaWduLCB1bmxlc3Mgc29tZSBob3N0LWVuZGluZyBjaGFyYWN0ZXJcbiAgICAvLyBjb21lcyAqYmVmb3JlKiB0aGUgQC1zaWduLlxuICAgIC8vIFVSTHMgYXJlIG9ibm94aW91cy5cbiAgICAvL1xuICAgIC8vIGV4OlxuICAgIC8vIGh0dHA6Ly9hQGJAYy8gPT4gdXNlcjphQGIgaG9zdDpjXG4gICAgLy8gaHR0cDovL2FAYj9AYyA9PiB1c2VyOmEgaG9zdDpjIHBhdGg6Lz9AY1xuXG4gICAgLy8gdjAuMTIgVE9ETyhpc2FhY3MpOiBUaGlzIGlzIG5vdCBxdWl0ZSBob3cgQ2hyb21lIGRvZXMgdGhpbmdzLlxuICAgIC8vIFJldmlldyBvdXIgdGVzdCBjYXNlIGFnYWluc3QgYnJvd3NlcnMgbW9yZSBjb21wcmVoZW5zaXZlbHkuXG5cbiAgICAvLyBmaW5kIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhbnkgaG9zdEVuZGluZ0NoYXJzXG4gICAgdmFyIGhvc3RFbmQgPSAtMTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhvc3RFbmRpbmdDaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGhlYyA9IHJlc3QuaW5kZXhPZihob3N0RW5kaW5nQ2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKVxuICAgICAgICBob3N0RW5kID0gaGVjO1xuICAgIH1cblxuICAgIC8vIGF0IHRoaXMgcG9pbnQsIGVpdGhlciB3ZSBoYXZlIGFuIGV4cGxpY2l0IHBvaW50IHdoZXJlIHRoZVxuICAgIC8vIGF1dGggcG9ydGlvbiBjYW5ub3QgZ28gcGFzdCwgb3IgdGhlIGxhc3QgQCBjaGFyIGlzIHRoZSBkZWNpZGVyLlxuICAgIHZhciBhdXRoLCBhdFNpZ247XG4gICAgaWYgKGhvc3RFbmQgPT09IC0xKSB7XG4gICAgICAvLyBhdFNpZ24gY2FuIGJlIGFueXdoZXJlLlxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhdFNpZ24gbXVzdCBiZSBpbiBhdXRoIHBvcnRpb24uXG4gICAgICAvLyBodHRwOi8vYUBiL2NAZCA9PiBob3N0OmIgYXV0aDphIHBhdGg6L2NAZFxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcsIGhvc3RFbmQpO1xuICAgIH1cblxuICAgIC8vIE5vdyB3ZSBoYXZlIGEgcG9ydGlvbiB3aGljaCBpcyBkZWZpbml0ZWx5IHRoZSBhdXRoLlxuICAgIC8vIFB1bGwgdGhhdCBvZmYuXG4gICAgaWYgKGF0U2lnbiAhPT0gLTEpIHtcbiAgICAgIGF1dGggPSByZXN0LnNsaWNlKDAsIGF0U2lnbik7XG4gICAgICByZXN0ID0gcmVzdC5zbGljZShhdFNpZ24gKyAxKTtcbiAgICAgIHRoaXMuYXV0aCA9IGRlY29kZVVSSUNvbXBvbmVudChhdXRoKTtcbiAgICB9XG5cbiAgICAvLyB0aGUgaG9zdCBpcyB0aGUgcmVtYWluaW5nIHRvIHRoZSBsZWZ0IG9mIHRoZSBmaXJzdCBub24taG9zdCBjaGFyXG4gICAgaG9zdEVuZCA9IC0xO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9uSG9zdENoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaGVjID0gcmVzdC5pbmRleE9mKG5vbkhvc3RDaGFyc1tpXSk7XG4gICAgICBpZiAoaGVjICE9PSAtMSAmJiAoaG9zdEVuZCA9PT0gLTEgfHwgaGVjIDwgaG9zdEVuZCkpXG4gICAgICAgIGhvc3RFbmQgPSBoZWM7XG4gICAgfVxuICAgIC8vIGlmIHdlIHN0aWxsIGhhdmUgbm90IGhpdCBpdCwgdGhlbiB0aGUgZW50aXJlIHRoaW5nIGlzIGEgaG9zdC5cbiAgICBpZiAoaG9zdEVuZCA9PT0gLTEpXG4gICAgICBob3N0RW5kID0gcmVzdC5sZW5ndGg7XG5cbiAgICB0aGlzLmhvc3QgPSByZXN0LnNsaWNlKDAsIGhvc3RFbmQpO1xuICAgIHJlc3QgPSByZXN0LnNsaWNlKGhvc3RFbmQpO1xuXG4gICAgLy8gcHVsbCBvdXQgcG9ydC5cbiAgICB0aGlzLnBhcnNlSG9zdCgpO1xuXG4gICAgLy8gd2UndmUgaW5kaWNhdGVkIHRoYXQgdGhlcmUgaXMgYSBob3N0bmFtZSxcbiAgICAvLyBzbyBldmVuIGlmIGl0J3MgZW1wdHksIGl0IGhhcyB0byBiZSBwcmVzZW50LlxuICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lIHx8ICcnO1xuXG4gICAgLy8gaWYgaG9zdG5hbWUgYmVnaW5zIHdpdGggWyBhbmQgZW5kcyB3aXRoIF1cbiAgICAvLyBhc3N1bWUgdGhhdCBpdCdzIGFuIElQdjYgYWRkcmVzcy5cbiAgICB2YXIgaXB2Nkhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVswXSA9PT0gJ1snICYmXG4gICAgICAgIHRoaXMuaG9zdG5hbWVbdGhpcy5ob3N0bmFtZS5sZW5ndGggLSAxXSA9PT0gJ10nO1xuXG4gICAgLy8gdmFsaWRhdGUgYSBsaXR0bGUuXG4gICAgaWYgKCFpcHY2SG9zdG5hbWUpIHtcbiAgICAgIHZhciBob3N0cGFydHMgPSB0aGlzLmhvc3RuYW1lLnNwbGl0KC9cXC4vKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gaG9zdHBhcnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgcGFydCA9IGhvc3RwYXJ0c1tpXTtcbiAgICAgICAgaWYgKCFwYXJ0KSBjb250aW51ZTtcbiAgICAgICAgaWYgKCFwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFBhdHRlcm4pKSB7XG4gICAgICAgICAgdmFyIG5ld3BhcnQgPSAnJztcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgayA9IHBhcnQubGVuZ3RoOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgICBpZiAocGFydC5jaGFyQ29kZUF0KGopID4gMTI3KSB7XG4gICAgICAgICAgICAgIC8vIHdlIHJlcGxhY2Ugbm9uLUFTQ0lJIGNoYXIgd2l0aCBhIHRlbXBvcmFyeSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRoaXMgdG8gbWFrZSBzdXJlIHNpemUgb2YgaG9zdG5hbWUgaXMgbm90XG4gICAgICAgICAgICAgIC8vIGJyb2tlbiBieSByZXBsYWNpbmcgbm9uLUFTQ0lJIGJ5IG5vdGhpbmdcbiAgICAgICAgICAgICAgbmV3cGFydCArPSAneCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdwYXJ0ICs9IHBhcnRbal07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHdlIHRlc3QgYWdhaW4gd2l0aCBBU0NJSSBjaGFyIG9ubHlcbiAgICAgICAgICBpZiAoIW5ld3BhcnQubWF0Y2goaG9zdG5hbWVQYXJ0UGF0dGVybikpIHtcbiAgICAgICAgICAgIHZhciB2YWxpZFBhcnRzID0gaG9zdHBhcnRzLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgdmFyIG5vdEhvc3QgPSBob3N0cGFydHMuc2xpY2UoaSArIDEpO1xuICAgICAgICAgICAgdmFyIGJpdCA9IHBhcnQubWF0Y2goaG9zdG5hbWVQYXJ0U3RhcnQpO1xuICAgICAgICAgICAgaWYgKGJpdCkge1xuICAgICAgICAgICAgICB2YWxpZFBhcnRzLnB1c2goYml0WzFdKTtcbiAgICAgICAgICAgICAgbm90SG9zdC51bnNoaWZ0KGJpdFsyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm90SG9zdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmVzdCA9ICcvJyArIG5vdEhvc3Quam9pbignLicpICsgcmVzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaG9zdG5hbWUgPSB2YWxpZFBhcnRzLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhvc3RuYW1lLmxlbmd0aCA+IGhvc3RuYW1lTWF4TGVuKSB7XG4gICAgICB0aGlzLmhvc3RuYW1lID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGhvc3RuYW1lcyBhcmUgYWx3YXlzIGxvd2VyIGNhc2UuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGlmICghaXB2Nkhvc3RuYW1lKSB7XG4gICAgICAvLyBJRE5BIFN1cHBvcnQ6IFJldHVybnMgYSBwdW55Y29kZWQgcmVwcmVzZW50YXRpb24gb2YgXCJkb21haW5cIi5cbiAgICAgIC8vIEl0IG9ubHkgY29udmVydHMgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHRoYXRcbiAgICAgIC8vIGhhdmUgbm9uLUFTQ0lJIGNoYXJhY3RlcnMsIGkuZS4gaXQgZG9lc24ndCBtYXR0ZXIgaWZcbiAgICAgIC8vIHlvdSBjYWxsIGl0IHdpdGggYSBkb21haW4gdGhhdCBhbHJlYWR5IGlzIEFTQ0lJLW9ubHkuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gcHVueWNvZGUudG9BU0NJSSh0aGlzLmhvc3RuYW1lKTtcbiAgICB9XG5cbiAgICB2YXIgcCA9IHRoaXMucG9ydCA/ICc6JyArIHRoaXMucG9ydCA6ICcnO1xuICAgIHZhciBoID0gdGhpcy5ob3N0bmFtZSB8fCAnJztcbiAgICB0aGlzLmhvc3QgPSBoICsgcDtcbiAgICB0aGlzLmhyZWYgKz0gdGhpcy5ob3N0O1xuXG4gICAgLy8gc3RyaXAgWyBhbmQgXSBmcm9tIHRoZSBob3N0bmFtZVxuICAgIC8vIHRoZSBob3N0IGZpZWxkIHN0aWxsIHJldGFpbnMgdGhlbSwgdGhvdWdoXG4gICAgaWYgKGlwdjZIb3N0bmFtZSkge1xuICAgICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUuc3Vic3RyKDEsIHRoaXMuaG9zdG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBpZiAocmVzdFswXSAhPT0gJy8nKSB7XG4gICAgICAgIHJlc3QgPSAnLycgKyByZXN0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIG5vdyByZXN0IGlzIHNldCB0byB0aGUgcG9zdC1ob3N0IHN0dWZmLlxuICAvLyBjaG9wIG9mZiBhbnkgZGVsaW0gY2hhcnMuXG4gIGlmICghdW5zYWZlUHJvdG9jb2xbbG93ZXJQcm90b10pIHtcblxuICAgIC8vIEZpcnN0LCBtYWtlIDEwMCUgc3VyZSB0aGF0IGFueSBcImF1dG9Fc2NhcGVcIiBjaGFycyBnZXRcbiAgICAvLyBlc2NhcGVkLCBldmVuIGlmIGVuY29kZVVSSUNvbXBvbmVudCBkb2Vzbid0IHRoaW5rIHRoZXlcbiAgICAvLyBuZWVkIHRvIGJlLlxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXV0b0VzY2FwZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBhZSA9IGF1dG9Fc2NhcGVbaV07XG4gICAgICBpZiAocmVzdC5pbmRleE9mKGFlKSA9PT0gLTEpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgdmFyIGVzYyA9IGVuY29kZVVSSUNvbXBvbmVudChhZSk7XG4gICAgICBpZiAoZXNjID09PSBhZSkge1xuICAgICAgICBlc2MgPSBlc2NhcGUoYWUpO1xuICAgICAgfVxuICAgICAgcmVzdCA9IHJlc3Quc3BsaXQoYWUpLmpvaW4oZXNjKTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIGNob3Agb2ZmIGZyb20gdGhlIHRhaWwgZmlyc3QuXG4gIHZhciBoYXNoID0gcmVzdC5pbmRleE9mKCcjJyk7XG4gIGlmIChoYXNoICE9PSAtMSkge1xuICAgIC8vIGdvdCBhIGZyYWdtZW50IHN0cmluZy5cbiAgICB0aGlzLmhhc2ggPSByZXN0LnN1YnN0cihoYXNoKTtcbiAgICByZXN0ID0gcmVzdC5zbGljZSgwLCBoYXNoKTtcbiAgfVxuICB2YXIgcW0gPSByZXN0LmluZGV4T2YoJz8nKTtcbiAgaWYgKHFtICE9PSAtMSkge1xuICAgIHRoaXMuc2VhcmNoID0gcmVzdC5zdWJzdHIocW0pO1xuICAgIHRoaXMucXVlcnkgPSByZXN0LnN1YnN0cihxbSArIDEpO1xuICAgIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnlzdHJpbmcucGFyc2UodGhpcy5xdWVyeSk7XG4gICAgfVxuICAgIHJlc3QgPSByZXN0LnNsaWNlKDAsIHFtKTtcbiAgfSBlbHNlIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgLy8gbm8gcXVlcnkgc3RyaW5nLCBidXQgcGFyc2VRdWVyeVN0cmluZyBzdGlsbCByZXF1ZXN0ZWRcbiAgICB0aGlzLnNlYXJjaCA9ICcnO1xuICAgIHRoaXMucXVlcnkgPSB7fTtcbiAgfVxuICBpZiAocmVzdCkgdGhpcy5wYXRobmFtZSA9IHJlc3Q7XG4gIGlmIChzbGFzaGVkUHJvdG9jb2xbbG93ZXJQcm90b10gJiZcbiAgICAgIHRoaXMuaG9zdG5hbWUgJiYgIXRoaXMucGF0aG5hbWUpIHtcbiAgICB0aGlzLnBhdGhuYW1lID0gJy8nO1xuICB9XG5cbiAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICBpZiAodGhpcy5wYXRobmFtZSB8fCB0aGlzLnNlYXJjaCkge1xuICAgIHZhciBwID0gdGhpcy5wYXRobmFtZSB8fCAnJztcbiAgICB2YXIgcyA9IHRoaXMuc2VhcmNoIHx8ICcnO1xuICAgIHRoaXMucGF0aCA9IHAgKyBzO1xuICB9XG5cbiAgLy8gZmluYWxseSwgcmVjb25zdHJ1Y3QgdGhlIGhyZWYgYmFzZWQgb24gd2hhdCBoYXMgYmVlbiB2YWxpZGF0ZWQuXG4gIHRoaXMuaHJlZiA9IHRoaXMuZm9ybWF0KCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZm9ybWF0IGEgcGFyc2VkIG9iamVjdCBpbnRvIGEgdXJsIHN0cmluZ1xuZnVuY3Rpb24gdXJsRm9ybWF0KG9iaikge1xuICAvLyBlbnN1cmUgaXQncyBhbiBvYmplY3QsIGFuZCBub3QgYSBzdHJpbmcgdXJsLlxuICAvLyBJZiBpdCdzIGFuIG9iaiwgdGhpcyBpcyBhIG5vLW9wLlxuICAvLyB0aGlzIHdheSwgeW91IGNhbiBjYWxsIHVybF9mb3JtYXQoKSBvbiBzdHJpbmdzXG4gIC8vIHRvIGNsZWFuIHVwIHBvdGVudGlhbGx5IHdvbmt5IHVybHMuXG4gIGlmICh1dGlsLmlzU3RyaW5nKG9iaikpIG9iaiA9IHVybFBhcnNlKG9iaik7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIFVybCkpIHJldHVybiBVcmwucHJvdG90eXBlLmZvcm1hdC5jYWxsKG9iaik7XG4gIHJldHVybiBvYmouZm9ybWF0KCk7XG59XG5cblVybC5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhdXRoID0gdGhpcy5hdXRoIHx8ICcnO1xuICBpZiAoYXV0aCkge1xuICAgIGF1dGggPSBlbmNvZGVVUklDb21wb25lbnQoYXV0aCk7XG4gICAgYXV0aCA9IGF1dGgucmVwbGFjZSgvJTNBL2ksICc6Jyk7XG4gICAgYXV0aCArPSAnQCc7XG4gIH1cblxuICB2YXIgcHJvdG9jb2wgPSB0aGlzLnByb3RvY29sIHx8ICcnLFxuICAgICAgcGF0aG5hbWUgPSB0aGlzLnBhdGhuYW1lIHx8ICcnLFxuICAgICAgaGFzaCA9IHRoaXMuaGFzaCB8fCAnJyxcbiAgICAgIGhvc3QgPSBmYWxzZSxcbiAgICAgIHF1ZXJ5ID0gJyc7XG5cbiAgaWYgKHRoaXMuaG9zdCkge1xuICAgIGhvc3QgPSBhdXRoICsgdGhpcy5ob3N0O1xuICB9IGVsc2UgaWYgKHRoaXMuaG9zdG5hbWUpIHtcbiAgICBob3N0ID0gYXV0aCArICh0aGlzLmhvc3RuYW1lLmluZGV4T2YoJzonKSA9PT0gLTEgP1xuICAgICAgICB0aGlzLmhvc3RuYW1lIDpcbiAgICAgICAgJ1snICsgdGhpcy5ob3N0bmFtZSArICddJyk7XG4gICAgaWYgKHRoaXMucG9ydCkge1xuICAgICAgaG9zdCArPSAnOicgKyB0aGlzLnBvcnQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMucXVlcnkgJiZcbiAgICAgIHV0aWwuaXNPYmplY3QodGhpcy5xdWVyeSkgJiZcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMucXVlcnkpLmxlbmd0aCkge1xuICAgIHF1ZXJ5ID0gcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHRoaXMucXVlcnkpO1xuICB9XG5cbiAgdmFyIHNlYXJjaCA9IHRoaXMuc2VhcmNoIHx8IChxdWVyeSAmJiAoJz8nICsgcXVlcnkpKSB8fCAnJztcblxuICBpZiAocHJvdG9jb2wgJiYgcHJvdG9jb2wuc3Vic3RyKC0xKSAhPT0gJzonKSBwcm90b2NvbCArPSAnOic7XG5cbiAgLy8gb25seSB0aGUgc2xhc2hlZFByb3RvY29scyBnZXQgdGhlIC8vLiAgTm90IG1haWx0bzosIHhtcHA6LCBldGMuXG4gIC8vIHVubGVzcyB0aGV5IGhhZCB0aGVtIHRvIGJlZ2luIHdpdGguXG4gIGlmICh0aGlzLnNsYXNoZXMgfHxcbiAgICAgICghcHJvdG9jb2wgfHwgc2xhc2hlZFByb3RvY29sW3Byb3RvY29sXSkgJiYgaG9zdCAhPT0gZmFsc2UpIHtcbiAgICBob3N0ID0gJy8vJyArIChob3N0IHx8ICcnKTtcbiAgICBpZiAocGF0aG5hbWUgJiYgcGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycpIHBhdGhuYW1lID0gJy8nICsgcGF0aG5hbWU7XG4gIH0gZWxzZSBpZiAoIWhvc3QpIHtcbiAgICBob3N0ID0gJyc7XG4gIH1cblxuICBpZiAoaGFzaCAmJiBoYXNoLmNoYXJBdCgwKSAhPT0gJyMnKSBoYXNoID0gJyMnICsgaGFzaDtcbiAgaWYgKHNlYXJjaCAmJiBzZWFyY2guY2hhckF0KDApICE9PSAnPycpIHNlYXJjaCA9ICc/JyArIHNlYXJjaDtcblxuICBwYXRobmFtZSA9IHBhdGhuYW1lLnJlcGxhY2UoL1s/I10vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KG1hdGNoKTtcbiAgfSk7XG4gIHNlYXJjaCA9IHNlYXJjaC5yZXBsYWNlKCcjJywgJyUyMycpO1xuXG4gIHJldHVybiBwcm90b2NvbCArIGhvc3QgKyBwYXRobmFtZSArIHNlYXJjaCArIGhhc2g7XG59O1xuXG5mdW5jdGlvbiB1cmxSZXNvbHZlKHNvdXJjZSwgcmVsYXRpdmUpIHtcbiAgcmV0dXJuIHVybFBhcnNlKHNvdXJjZSwgZmFsc2UsIHRydWUpLnJlc29sdmUocmVsYXRpdmUpO1xufVxuXG5VcmwucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihyZWxhdGl2ZSkge1xuICByZXR1cm4gdGhpcy5yZXNvbHZlT2JqZWN0KHVybFBhcnNlKHJlbGF0aXZlLCBmYWxzZSwgdHJ1ZSkpLmZvcm1hdCgpO1xufTtcblxuZnVuY3Rpb24gdXJsUmVzb2x2ZU9iamVjdChzb3VyY2UsIHJlbGF0aXZlKSB7XG4gIGlmICghc291cmNlKSByZXR1cm4gcmVsYXRpdmU7XG4gIHJldHVybiB1cmxQYXJzZShzb3VyY2UsIGZhbHNlLCB0cnVlKS5yZXNvbHZlT2JqZWN0KHJlbGF0aXZlKTtcbn1cblxuVXJsLnByb3RvdHlwZS5yZXNvbHZlT2JqZWN0ID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcbiAgaWYgKHV0aWwuaXNTdHJpbmcocmVsYXRpdmUpKSB7XG4gICAgdmFyIHJlbCA9IG5ldyBVcmwoKTtcbiAgICByZWwucGFyc2UocmVsYXRpdmUsIGZhbHNlLCB0cnVlKTtcbiAgICByZWxhdGl2ZSA9IHJlbDtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBuZXcgVXJsKCk7XG4gIHZhciB0a2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpO1xuICBmb3IgKHZhciB0ayA9IDA7IHRrIDwgdGtleXMubGVuZ3RoOyB0aysrKSB7XG4gICAgdmFyIHRrZXkgPSB0a2V5c1t0a107XG4gICAgcmVzdWx0W3RrZXldID0gdGhpc1t0a2V5XTtcbiAgfVxuXG4gIC8vIGhhc2ggaXMgYWx3YXlzIG92ZXJyaWRkZW4sIG5vIG1hdHRlciB3aGF0LlxuICAvLyBldmVuIGhyZWY9XCJcIiB3aWxsIHJlbW92ZSBpdC5cbiAgcmVzdWx0Lmhhc2ggPSByZWxhdGl2ZS5oYXNoO1xuXG4gIC8vIGlmIHRoZSByZWxhdGl2ZSB1cmwgaXMgZW1wdHksIHRoZW4gdGhlcmUncyBub3RoaW5nIGxlZnQgdG8gZG8gaGVyZS5cbiAgaWYgKHJlbGF0aXZlLmhyZWYgPT09ICcnKSB7XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGhyZWZzIGxpa2UgLy9mb28vYmFyIGFsd2F5cyBjdXQgdG8gdGhlIHByb3RvY29sLlxuICBpZiAocmVsYXRpdmUuc2xhc2hlcyAmJiAhcmVsYXRpdmUucHJvdG9jb2wpIHtcbiAgICAvLyB0YWtlIGV2ZXJ5dGhpbmcgZXhjZXB0IHRoZSBwcm90b2NvbCBmcm9tIHJlbGF0aXZlXG4gICAgdmFyIHJrZXlzID0gT2JqZWN0LmtleXMocmVsYXRpdmUpO1xuICAgIGZvciAodmFyIHJrID0gMDsgcmsgPCBya2V5cy5sZW5ndGg7IHJrKyspIHtcbiAgICAgIHZhciBya2V5ID0gcmtleXNbcmtdO1xuICAgICAgaWYgKHJrZXkgIT09ICdwcm90b2NvbCcpXG4gICAgICAgIHJlc3VsdFtya2V5XSA9IHJlbGF0aXZlW3JrZXldO1xuICAgIH1cblxuICAgIC8vdXJsUGFyc2UgYXBwZW5kcyB0cmFpbGluZyAvIHRvIHVybHMgbGlrZSBodHRwOi8vd3d3LmV4YW1wbGUuY29tXG4gICAgaWYgKHNsYXNoZWRQcm90b2NvbFtyZXN1bHQucHJvdG9jb2xdICYmXG4gICAgICAgIHJlc3VsdC5ob3N0bmFtZSAmJiAhcmVzdWx0LnBhdGhuYW1lKSB7XG4gICAgICByZXN1bHQucGF0aCA9IHJlc3VsdC5wYXRobmFtZSA9ICcvJztcbiAgICB9XG5cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKHJlbGF0aXZlLnByb3RvY29sICYmIHJlbGF0aXZlLnByb3RvY29sICE9PSByZXN1bHQucHJvdG9jb2wpIHtcbiAgICAvLyBpZiBpdCdzIGEga25vd24gdXJsIHByb3RvY29sLCB0aGVuIGNoYW5naW5nXG4gICAgLy8gdGhlIHByb3RvY29sIGRvZXMgd2VpcmQgdGhpbmdzXG4gICAgLy8gZmlyc3QsIGlmIGl0J3Mgbm90IGZpbGU6LCB0aGVuIHdlIE1VU1QgaGF2ZSBhIGhvc3QsXG4gICAgLy8gYW5kIGlmIHRoZXJlIHdhcyBhIHBhdGhcbiAgICAvLyB0byBiZWdpbiB3aXRoLCB0aGVuIHdlIE1VU1QgaGF2ZSBhIHBhdGguXG4gICAgLy8gaWYgaXQgaXMgZmlsZTosIHRoZW4gdGhlIGhvc3QgaXMgZHJvcHBlZCxcbiAgICAvLyBiZWNhdXNlIHRoYXQncyBrbm93biB0byBiZSBob3N0bGVzcy5cbiAgICAvLyBhbnl0aGluZyBlbHNlIGlzIGFzc3VtZWQgdG8gYmUgYWJzb2x1dGUuXG4gICAgaWYgKCFzbGFzaGVkUHJvdG9jb2xbcmVsYXRpdmUucHJvdG9jb2xdKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHJlbGF0aXZlKTtcbiAgICAgIGZvciAodmFyIHYgPSAwOyB2IDwga2V5cy5sZW5ndGg7IHYrKykge1xuICAgICAgICB2YXIgayA9IGtleXNbdl07XG4gICAgICAgIHJlc3VsdFtrXSA9IHJlbGF0aXZlW2tdO1xuICAgICAgfVxuICAgICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHJlc3VsdC5wcm90b2NvbCA9IHJlbGF0aXZlLnByb3RvY29sO1xuICAgIGlmICghcmVsYXRpdmUuaG9zdCAmJiAhaG9zdGxlc3NQcm90b2NvbFtyZWxhdGl2ZS5wcm90b2NvbF0pIHtcbiAgICAgIHZhciByZWxQYXRoID0gKHJlbGF0aXZlLnBhdGhuYW1lIHx8ICcnKS5zcGxpdCgnLycpO1xuICAgICAgd2hpbGUgKHJlbFBhdGgubGVuZ3RoICYmICEocmVsYXRpdmUuaG9zdCA9IHJlbFBhdGguc2hpZnQoKSkpO1xuICAgICAgaWYgKCFyZWxhdGl2ZS5ob3N0KSByZWxhdGl2ZS5ob3N0ID0gJyc7XG4gICAgICBpZiAoIXJlbGF0aXZlLmhvc3RuYW1lKSByZWxhdGl2ZS5ob3N0bmFtZSA9ICcnO1xuICAgICAgaWYgKHJlbFBhdGhbMF0gIT09ICcnKSByZWxQYXRoLnVuc2hpZnQoJycpO1xuICAgICAgaWYgKHJlbFBhdGgubGVuZ3RoIDwgMikgcmVsUGF0aC51bnNoaWZ0KCcnKTtcbiAgICAgIHJlc3VsdC5wYXRobmFtZSA9IHJlbFBhdGguam9pbignLycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucGF0aG5hbWUgPSByZWxhdGl2ZS5wYXRobmFtZTtcbiAgICB9XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICByZXN1bHQuaG9zdCA9IHJlbGF0aXZlLmhvc3QgfHwgJyc7XG4gICAgcmVzdWx0LmF1dGggPSByZWxhdGl2ZS5hdXRoO1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3Q7XG4gICAgcmVzdWx0LnBvcnQgPSByZWxhdGl2ZS5wb3J0O1xuICAgIC8vIHRvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKHJlc3VsdC5wYXRobmFtZSB8fCByZXN1bHQuc2VhcmNoKSB7XG4gICAgICB2YXIgcCA9IHJlc3VsdC5wYXRobmFtZSB8fCAnJztcbiAgICAgIHZhciBzID0gcmVzdWx0LnNlYXJjaCB8fCAnJztcbiAgICAgIHJlc3VsdC5wYXRoID0gcCArIHM7XG4gICAgfVxuICAgIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdmFyIGlzU291cmNlQWJzID0gKHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpLFxuICAgICAgaXNSZWxBYnMgPSAoXG4gICAgICAgICAgcmVsYXRpdmUuaG9zdCB8fFxuICAgICAgICAgIHJlbGF0aXZlLnBhdGhuYW1lICYmIHJlbGF0aXZlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nXG4gICAgICApLFxuICAgICAgbXVzdEVuZEFicyA9IChpc1JlbEFicyB8fCBpc1NvdXJjZUFicyB8fFxuICAgICAgICAgICAgICAgICAgICAocmVzdWx0Lmhvc3QgJiYgcmVsYXRpdmUucGF0aG5hbWUpKSxcbiAgICAgIHJlbW92ZUFsbERvdHMgPSBtdXN0RW5kQWJzLFxuICAgICAgc3JjUGF0aCA9IHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuc3BsaXQoJy8nKSB8fCBbXSxcbiAgICAgIHJlbFBhdGggPSByZWxhdGl2ZS5wYXRobmFtZSAmJiByZWxhdGl2ZS5wYXRobmFtZS5zcGxpdCgnLycpIHx8IFtdLFxuICAgICAgcHN5Y2hvdGljID0gcmVzdWx0LnByb3RvY29sICYmICFzbGFzaGVkUHJvdG9jb2xbcmVzdWx0LnByb3RvY29sXTtcblxuICAvLyBpZiB0aGUgdXJsIGlzIGEgbm9uLXNsYXNoZWQgdXJsLCB0aGVuIHJlbGF0aXZlXG4gIC8vIGxpbmtzIGxpa2UgLi4vLi4gc2hvdWxkIGJlIGFibGVcbiAgLy8gdG8gY3Jhd2wgdXAgdG8gdGhlIGhvc3RuYW1lLCBhcyB3ZWxsLiAgVGhpcyBpcyBzdHJhbmdlLlxuICAvLyByZXN1bHQucHJvdG9jb2wgaGFzIGFscmVhZHkgYmVlbiBzZXQgYnkgbm93LlxuICAvLyBMYXRlciBvbiwgcHV0IHRoZSBmaXJzdCBwYXRoIHBhcnQgaW50byB0aGUgaG9zdCBmaWVsZC5cbiAgaWYgKHBzeWNob3RpYykge1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9ICcnO1xuICAgIHJlc3VsdC5wb3J0ID0gbnVsbDtcbiAgICBpZiAocmVzdWx0Lmhvc3QpIHtcbiAgICAgIGlmIChzcmNQYXRoWzBdID09PSAnJykgc3JjUGF0aFswXSA9IHJlc3VsdC5ob3N0O1xuICAgICAgZWxzZSBzcmNQYXRoLnVuc2hpZnQocmVzdWx0Lmhvc3QpO1xuICAgIH1cbiAgICByZXN1bHQuaG9zdCA9ICcnO1xuICAgIGlmIChyZWxhdGl2ZS5wcm90b2NvbCkge1xuICAgICAgcmVsYXRpdmUuaG9zdG5hbWUgPSBudWxsO1xuICAgICAgcmVsYXRpdmUucG9ydCA9IG51bGw7XG4gICAgICBpZiAocmVsYXRpdmUuaG9zdCkge1xuICAgICAgICBpZiAocmVsUGF0aFswXSA9PT0gJycpIHJlbFBhdGhbMF0gPSByZWxhdGl2ZS5ob3N0O1xuICAgICAgICBlbHNlIHJlbFBhdGgudW5zaGlmdChyZWxhdGl2ZS5ob3N0KTtcbiAgICAgIH1cbiAgICAgIHJlbGF0aXZlLmhvc3QgPSBudWxsO1xuICAgIH1cbiAgICBtdXN0RW5kQWJzID0gbXVzdEVuZEFicyAmJiAocmVsUGF0aFswXSA9PT0gJycgfHwgc3JjUGF0aFswXSA9PT0gJycpO1xuICB9XG5cbiAgaWYgKGlzUmVsQWJzKSB7XG4gICAgLy8gaXQncyBhYnNvbHV0ZS5cbiAgICByZXN1bHQuaG9zdCA9IChyZWxhdGl2ZS5ob3N0IHx8IHJlbGF0aXZlLmhvc3QgPT09ICcnKSA/XG4gICAgICAgICAgICAgICAgICByZWxhdGl2ZS5ob3N0IDogcmVzdWx0Lmhvc3Q7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gKHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3RuYW1lID09PSAnJykgP1xuICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLmhvc3RuYW1lIDogcmVzdWx0Lmhvc3RuYW1lO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgc3JjUGF0aCA9IHJlbFBhdGg7XG4gICAgLy8gZmFsbCB0aHJvdWdoIHRvIHRoZSBkb3QtaGFuZGxpbmcgYmVsb3cuXG4gIH0gZWxzZSBpZiAocmVsUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBpdCdzIHJlbGF0aXZlXG4gICAgLy8gdGhyb3cgYXdheSB0aGUgZXhpc3RpbmcgZmlsZSwgYW5kIHRha2UgdGhlIG5ldyBwYXRoIGluc3RlYWQuXG4gICAgaWYgKCFzcmNQYXRoKSBzcmNQYXRoID0gW107XG4gICAgc3JjUGF0aC5wb3AoKTtcbiAgICBzcmNQYXRoID0gc3JjUGF0aC5jb25jYXQocmVsUGF0aCk7XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgfSBlbHNlIGlmICghdXRpbC5pc051bGxPclVuZGVmaW5lZChyZWxhdGl2ZS5zZWFyY2gpKSB7XG4gICAgLy8ganVzdCBwdWxsIG91dCB0aGUgc2VhcmNoLlxuICAgIC8vIGxpa2UgaHJlZj0nP2ZvbycuXG4gICAgLy8gUHV0IHRoaXMgYWZ0ZXIgdGhlIG90aGVyIHR3byBjYXNlcyBiZWNhdXNlIGl0IHNpbXBsaWZpZXMgdGhlIGJvb2xlYW5zXG4gICAgaWYgKHBzeWNob3RpYykge1xuICAgICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBzcmNQYXRoLnNoaWZ0KCk7XG4gICAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgICAvL3RoaXMgZXNwZWNpYWxseSBoYXBwZW5zIGluIGNhc2VzIGxpa2VcbiAgICAgIC8vdXJsLnJlc29sdmVPYmplY3QoJ21haWx0bzpsb2NhbDFAZG9tYWluMScsICdsb2NhbDJAZG9tYWluMicpXG4gICAgICB2YXIgYXV0aEluSG9zdCA9IHJlc3VsdC5ob3N0ICYmIHJlc3VsdC5ob3N0LmluZGV4T2YoJ0AnKSA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuaG9zdC5zcGxpdCgnQCcpIDogZmFsc2U7XG4gICAgICBpZiAoYXV0aEluSG9zdCkge1xuICAgICAgICByZXN1bHQuYXV0aCA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSByZXN1bHQuaG9zdG5hbWUgPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmICghdXRpbC5pc051bGwocmVzdWx0LnBhdGhuYW1lKSB8fCAhdXRpbC5pc051bGwocmVzdWx0LnNlYXJjaCkpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gKHJlc3VsdC5wYXRobmFtZSA/IHJlc3VsdC5wYXRobmFtZSA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQuc2VhcmNoID8gcmVzdWx0LnNlYXJjaCA6ICcnKTtcbiAgICB9XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmICghc3JjUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBubyBwYXRoIGF0IGFsbC4gIGVhc3kuXG4gICAgLy8gd2UndmUgYWxyZWFkeSBoYW5kbGVkIHRoZSBvdGhlciBzdHVmZiBhYm92ZS5cbiAgICByZXN1bHQucGF0aG5hbWUgPSBudWxsO1xuICAgIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAocmVzdWx0LnNlYXJjaCkge1xuICAgICAgcmVzdWx0LnBhdGggPSAnLycgKyByZXN1bHQuc2VhcmNoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucGF0aCA9IG51bGw7XG4gICAgfVxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBpZiBhIHVybCBFTkRzIGluIC4gb3IgLi4sIHRoZW4gaXQgbXVzdCBnZXQgYSB0cmFpbGluZyBzbGFzaC5cbiAgLy8gaG93ZXZlciwgaWYgaXQgZW5kcyBpbiBhbnl0aGluZyBlbHNlIG5vbi1zbGFzaHksXG4gIC8vIHRoZW4gaXQgbXVzdCBOT1QgZ2V0IGEgdHJhaWxpbmcgc2xhc2guXG4gIHZhciBsYXN0ID0gc3JjUGF0aC5zbGljZSgtMSlbMF07XG4gIHZhciBoYXNUcmFpbGluZ1NsYXNoID0gKFxuICAgICAgKHJlc3VsdC5ob3N0IHx8IHJlbGF0aXZlLmhvc3QgfHwgc3JjUGF0aC5sZW5ndGggPiAxKSAmJlxuICAgICAgKGxhc3QgPT09ICcuJyB8fCBsYXN0ID09PSAnLi4nKSB8fCBsYXN0ID09PSAnJyk7XG5cbiAgLy8gc3RyaXAgc2luZ2xlIGRvdHMsIHJlc29sdmUgZG91YmxlIGRvdHMgdG8gcGFyZW50IGRpclxuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gc3JjUGF0aC5sZW5ndGg7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGFzdCA9IHNyY1BhdGhbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKCFtdXN0RW5kQWJzICYmICFyZW1vdmVBbGxEb3RzKSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBzcmNQYXRoLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG11c3RFbmRBYnMgJiYgc3JjUGF0aFswXSAhPT0gJycgJiZcbiAgICAgICghc3JjUGF0aFswXSB8fCBzcmNQYXRoWzBdLmNoYXJBdCgwKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgudW5zaGlmdCgnJyk7XG4gIH1cblxuICBpZiAoaGFzVHJhaWxpbmdTbGFzaCAmJiAoc3JjUGF0aC5qb2luKCcvJykuc3Vic3RyKC0xKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgucHVzaCgnJyk7XG4gIH1cblxuICB2YXIgaXNBYnNvbHV0ZSA9IHNyY1BhdGhbMF0gPT09ICcnIHx8XG4gICAgICAoc3JjUGF0aFswXSAmJiBzcmNQYXRoWzBdLmNoYXJBdCgwKSA9PT0gJy8nKTtcblxuICAvLyBwdXQgdGhlIGhvc3QgYmFja1xuICBpZiAocHN5Y2hvdGljKSB7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBpc0Fic29sdXRlID8gJycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjUGF0aC5sZW5ndGggPyBzcmNQYXRoLnNoaWZ0KCkgOiAnJztcbiAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgLy90aGlzIGVzcGVjaWFsbHkgaGFwcGVucyBpbiBjYXNlcyBsaWtlXG4gICAgLy91cmwucmVzb2x2ZU9iamVjdCgnbWFpbHRvOmxvY2FsMUBkb21haW4xJywgJ2xvY2FsMkBkb21haW4yJylcbiAgICB2YXIgYXV0aEluSG9zdCA9IHJlc3VsdC5ob3N0ICYmIHJlc3VsdC5ob3N0LmluZGV4T2YoJ0AnKSA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lmhvc3Quc3BsaXQoJ0AnKSA6IGZhbHNlO1xuICAgIGlmIChhdXRoSW5Ib3N0KSB7XG4gICAgICByZXN1bHQuYXV0aCA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgIHJlc3VsdC5ob3N0ID0gcmVzdWx0Lmhvc3RuYW1lID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgIH1cbiAgfVxuXG4gIG11c3RFbmRBYnMgPSBtdXN0RW5kQWJzIHx8IChyZXN1bHQuaG9zdCAmJiBzcmNQYXRoLmxlbmd0aCk7XG5cbiAgaWYgKG11c3RFbmRBYnMgJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBzcmNQYXRoLnVuc2hpZnQoJycpO1xuICB9XG5cbiAgaWYgKCFzcmNQYXRoLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wYXRobmFtZSA9IG51bGw7XG4gICAgcmVzdWx0LnBhdGggPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5wYXRobmFtZSA9IHNyY1BhdGguam9pbignLycpO1xuICB9XG5cbiAgLy90byBzdXBwb3J0IHJlcXVlc3QuaHR0cFxuICBpZiAoIXV0aWwuaXNOdWxsKHJlc3VsdC5wYXRobmFtZSkgfHwgIXV0aWwuaXNOdWxsKHJlc3VsdC5zZWFyY2gpKSB7XG4gICAgcmVzdWx0LnBhdGggPSAocmVzdWx0LnBhdGhuYW1lID8gcmVzdWx0LnBhdGhuYW1lIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChyZXN1bHQuc2VhcmNoID8gcmVzdWx0LnNlYXJjaCA6ICcnKTtcbiAgfVxuICByZXN1bHQuYXV0aCA9IHJlbGF0aXZlLmF1dGggfHwgcmVzdWx0LmF1dGg7XG4gIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5VcmwucHJvdG90eXBlLnBhcnNlSG9zdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaG9zdCA9IHRoaXMuaG9zdDtcbiAgdmFyIHBvcnQgPSBwb3J0UGF0dGVybi5leGVjKGhvc3QpO1xuICBpZiAocG9ydCkge1xuICAgIHBvcnQgPSBwb3J0WzBdO1xuICAgIGlmIChwb3J0ICE9PSAnOicpIHtcbiAgICAgIHRoaXMucG9ydCA9IHBvcnQuc3Vic3RyKDEpO1xuICAgIH1cbiAgICBob3N0ID0gaG9zdC5zdWJzdHIoMCwgaG9zdC5sZW5ndGggLSBwb3J0Lmxlbmd0aCk7XG4gIH1cbiAgaWYgKGhvc3QpIHRoaXMuaG9zdG5hbWUgPSBob3N0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzU3RyaW5nOiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mKGFyZykgPT09ICdzdHJpbmcnO1xuICB9LFxuICBpc09iamVjdDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZihhcmcpID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG4gIH0sXG4gIGlzTnVsbDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbiAgfSxcbiAgaXNOdWxsT3JVbmRlZmluZWQ6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBhcmcgPT0gbnVsbDtcbiAgfVxufTtcbiIsImNvbnN0IHBhcnNlID0gcmVxdWlyZShcInVybFwiKS5wYXJzZVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2xlYW4sXG4gIHBhZ2UsXG4gIHByb3RvY29sLFxuICBob3N0bmFtZSxcbiAgbm9ybWFsaXplLFxuICBpc1NlYXJjaFF1ZXJ5LFxuICBpc1VSTFxufVxuXG5mdW5jdGlvbiBwcm90b2NvbCAodXJsKSB7XG4gIGNvbnN0IG1hdGNoID0gdXJsLm1hdGNoKC8oXlxcdyspOlxcL1xcLy8pXG4gIGlmIChtYXRjaCkge1xuICAgIHJldHVybiBtYXRjaFsxXVxuICB9XG5cbiAgcmV0dXJuICdodHRwJ1xufVxuXG5mdW5jdGlvbiBjbGVhbiAodXJsKSB7XG4gIHJldHVybiBjbGVhblVUTSh1cmwpXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9eXFx3KzpcXC9cXC8vLCAnJylcbiAgICAucmVwbGFjZSgvXltcXHctX10rOltcXHctX10rQC8sICcnKVxuICAgIC5yZXBsYWNlKC8jLiokLywgJycpXG4gICAgLnJlcGxhY2UoLyhcXC98XFw/fFxcJnwjKSokLywgJycpXG4gICAgLnJlcGxhY2UoL1xcL1xcPy8sICc/JylcbiAgICAucmVwbGFjZSgvXnd3d1xcLi8sICcnKVxufVxuXG5mdW5jdGlvbiBwYWdlICh1cmwpIHtcbiAgcmV0dXJuIGNsZWFuKHVybC5yZXBsYWNlKC9cXCMuKiQvLCAnJykpXG59XG5cbmZ1bmN0aW9uIGhvc3RuYW1lICh1cmwpIHtcbiAgcmV0dXJuIHBhcnNlKG5vcm1hbGl6ZSh1cmwpKS5ob3N0bmFtZS5yZXBsYWNlKC9ed3d3XFwuLywgJycpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZSAoaW5wdXQpIHtcbiAgaWYgKGlucHV0LnRyaW0oKS5sZW5ndGggPT09IDApIHJldHVybiAnJ1xuXG4gIGlmIChpc1NlYXJjaFF1ZXJ5KGlucHV0KSkge1xuICAgIHJldHVybiBgaHR0cHM6Ly9nb29nbGUuY29tL3NlYXJjaD9xPSR7ZW5jb2RlVVJJKGlucHV0KX1gXG4gIH1cblxuICBpZiAoIS9eXFx3KzpcXC9cXC8vLnRlc3QoaW5wdXQpKSB7XG4gICAgcmV0dXJuIGBodHRwOi8vJHtpbnB1dH1gXG4gIH1cblxuICByZXR1cm4gaW5wdXRcbn1cblxuZnVuY3Rpb24gaXNTZWFyY2hRdWVyeSAoaW5wdXQpIHtcbiAgcmV0dXJuICFpc1VSTChpbnB1dC50cmltKCkpXG59XG5cbmZ1bmN0aW9uIGlzVVJMIChpbnB1dCkge1xuICByZXR1cm4gaW5wdXQuaW5kZXhPZignICcpID09PSAtMSAmJiAoL15cXHcrOlxcL1xcLy8udGVzdChpbnB1dCkgfHwgaW5wdXQuaW5kZXhPZignLicpID4gMCB8fCBpbnB1dC5pbmRleE9mKCc6JykgPiAwKVxufVxuXG5mdW5jdGlvbiBjbGVhblVUTSAodXJsKSB7XG4gIHJldHVybiB1cmxcbiAgICAucmVwbGFjZSgvKFxcP3xcXCYpdXRtX1tcXHddK1xcPVteXFwmXSsvZywgJyQxJylcbiAgICAucmVwbGFjZSgvKFxcP3xcXCYpcmVmXFw9W15cXCZdK1xcJj8vLCAnJDEnKVxuICAgIC5yZXBsYWNlKC9bXFwmXXsyLH0vLCcmJylcbiAgICAucmVwbGFjZSgnPyYnLCAnPycpXG59XG4iXX0=
