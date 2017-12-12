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
    key: "recentBookmarksFirst",
    title: "Recent Bookmarks First",
    desc: "Move Recent Bookmarks Over Frequently Visited",
    defaultValue: true,
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require("./rows");

var _rows2 = _interopRequireDefault(_rows);

var _debounceFn = require("debounce-fn");

var _debounceFn2 = _interopRequireDefault(_debounceFn);

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

    _this.update = (0, _debounceFn2.default)(_this._update.bind(_this), 250);
    return _this;
  }

  _createClass(BookmarkSearch, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return query && query.length > 1 && (query.indexOf('tag:') !== 0 || query.length < 5);
    }
  }, {
    key: "fail",
    value: function fail(error) {
      console.error(error);
    }
  }, {
    key: "_update",
    value: function _update(query) {
      var _this2 = this;

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

},{"./rows":17,"debounce-fn":29}],4:[function(require,module,exports){
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
    key: 'shouldBeOpen',
    value: function shouldBeOpen(query) {
      return query && query.indexOf('tag:') === 0 && query.length > 4;
    }
  }, {
    key: 'update',
    value: function update(query) {
      var _this2 = this;

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

},{"./rows":17}],5:[function(require,module,exports){
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
      return (0, _preact.h)(
        "div",
        { className: "content-wrapper" },
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

},{"preact":33}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Greeting = function (_Component) {
  _inherits(Greeting, _Component);

  function Greeting() {
    _classCallCheck(this, Greeting);

    return _possibleConstructorReturn(this, (Greeting.__proto__ || Object.getPrototypeOf(Greeting)).apply(this, arguments));
  }

  _createClass(Greeting, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      this.props.messages.send({ task: 'get-name' }, function (resp) {
        if (resp.error) return _this2.onError(resp.error);

        _this2.setState({
          name: resp.content.name
        });
      });

      this.tick();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.deleteTimer();
    }
  }, {
    key: "deleteTimer",
    value: function deleteTimer() {
      if (this.timer !== undefined) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
    }
  }, {
    key: "setTimer",
    value: function setTimer() {
      var _this3 = this;

      this.deleteTimer();
      this.timer = setTimeout(function () {
        return _this3.tick();
      }, 60000);
    }
  }, {
    key: "tick",
    value: function tick() {
      var now = new Date();

      this.setState({
        hours: now.getHours(),
        minutes: now.getMinutes()
      });

      this.setTimer();
    }
  }, {
    key: "onError",
    value: function onError(error) {
      console.error(error);
    }
  }, {
    key: "render",
    value: function render() {
      return (0, _preact.h)(
        "div",
        { className: "greeting" },
        this.renderMessage(),
        this.renderTime()
      );
    }
  }, {
    key: "renderTime",
    value: function renderTime() {
      return (0, _preact.h)(
        "div",
        { className: "time" },
        pad(this.state.hours),
        ":",
        pad(this.state.minutes)
      );
    }
  }, {
    key: "renderMessage",
    value: function renderMessage() {
      var hour = this.state.hours;
      var message = "Good morning";

      if (hour >= 12) message = "Good Afternoon";
      if (hour >= 16) message = "Good Evening";

      message += this.state.name ? "," : ".";

      return (0, _preact.h)(
        "div",
        { className: "message" },
        message,
        this.renderName()
      );
    }
  }, {
    key: "renderName",
    value: function renderName() {
      if (!this.state.name) return;

      return (0, _preact.h)(
        "div",
        { className: "name" },
        this.state.name.slice(0, 1).toUpperCase() + this.state.name.slice(1),
        "."
      );
    }
  }]);

  return Greeting;
}(_preact.Component);

exports.default = Greeting;


function pad(n) {
  if (String(n).length < 2) {
    return '0' + n;
  }

  return n;
}

},{"preact":33}],7:[function(require,module,exports){
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
    key: 'shouldBeOpen',
    value: function shouldBeOpen(query) {
      return query.length > 1 && query.trim().length > 1;
    }
  }, {
    key: 'update',
    value: function update(query) {
      var _this2 = this;

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

},{"./rows":17,"./url-image":26}],8:[function(require,module,exports){
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

},{"preact":33}],9:[function(require,module,exports){
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

},{"preact":33}],10:[function(require,module,exports){
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

},{"preact":33}],11:[function(require,module,exports){
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

},{"../lib/messaging":2}],12:[function(require,module,exports){
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
      this.loadSetting('enableGreeting', avoidCache);
      this.loadSetting('recentBookmarksFirst', avoidCache);
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
          url: /firefox/i.test(navigator.userAgent) ? "about:newtab" : "chrome-search://local-ntp/local-ntp.html"
        });
      });
    }
  }, {
    key: "prevWallpaper",
    value: function prevWallpaper() {
      this.setState({
        wallpaperIndex: (this.state.wallpaperIndex || 0) - 1
      });
    }
  }, {
    key: "nextWallpaper",
    value: function nextWallpaper() {
      this.setState({
        wallpaperIndex: (this.state.wallpaperIndex || 0) + 1
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
        (0, _preact.h)(_search2.default, { recentBookmarksFirst: this.state.recentBookmarksFirst, nextWallpaper: function nextWallpaper() {
            return _this4.nextWallpaper();
          }, prevWallpaper: function prevWallpaper() {
            return _this4.prevWallpaper();
          }, enableGreeting: this.state.enableGreeting, settings: this.settings }),
        this.state.showWallpaper ? (0, _preact.h)(_wallpaper2.default, { index: this.state.wallpaperIndex, messages: this.messages }) : null
      );
    }
  }]);

  return NewTab;
}(_preact.Component);

(0, _preact.render)((0, _preact.h)(NewTab, null), document.body);

},{"./logo":9,"./menu":10,"./messaging":11,"./search":19,"./settings":20,"./wallpaper":27,"preact":33}],13:[function(require,module,exports){
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

var OpenWebsite = function (_Rows) {
  _inherits(OpenWebsite, _Rows);

  function OpenWebsite(results, sort) {
    _classCallCheck(this, OpenWebsite);

    var _this = _possibleConstructorReturn(this, (OpenWebsite.__proto__ || Object.getPrototypeOf(OpenWebsite)).call(this, results, sort));

    _this.name = 'open-website';
    _this.pinned = true;
    _this.title = '';
    return _this;
  }

  _createClass(OpenWebsite, [{
    key: 'shouldBeOpen',
    value: function shouldBeOpen(query) {
      return query && query.length > 1 && /^[\w\.]+$/i.test(query);
    }
  }, {
    key: 'fail',
    value: function fail(error) {
      console.error(error);
    }
  }, {
    key: 'update',
    value: function update(query) {
      var _this2 = this;

      var oquery = query || this.results.props.query;

      this.results.messages.send({ task: 'get-website', query: query }, function (resp) {
        if (oquery !== _this2.results.props.query.trim()) {
          return;
        }

        if (resp.error) return _this2.fail(resp.error);

        _this2.add(resp.content.results.likes.slice(0, 1));
      });
    }
  }]);

  return OpenWebsite;
}(_rows2.default);

exports.default = OpenWebsite;

},{"./rows":17}],14:[function(require,module,exports){
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
    _this.pinned = true;
    return _this;
  }

  _createClass(QuerySuggestions, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return query.length > 1 && query.trim().length > 1;
    }
  }, {
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
      this.add(this.createURLSuggestions(query).concat(this.createSearchSuggestions(query)));
    }
  }]);

  return QuerySuggestions;
}(_rows2.default);

exports.default = QuerySuggestions;


function isURL(query) {
  return query.trim().indexOf('.') > 0 && query.indexOf(' ') === -1;
}

},{"./rows":17,"title-from-url":43}],15:[function(require,module,exports){
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
    key: 'shouldBeOpen',
    value: function shouldBeOpen(query) {
      return query.length === 0;
    }
  }, {
    key: 'fail',
    value: function fail(err) {
      console.error(err);
    }
  }, {
    key: 'update',
    value: function update(query) {
      var _this2 = this;

      this.results.messages.send({ task: 'get-recent-bookmarks', query: query }, function (resp) {
        if (resp.error) return _this2.fail(resp.error);
        _this2.add(resp.content.results.likes);
      });
    }
  }]);

  return RecentBookmarks;
}(_rows2.default);

exports.default = RecentBookmarks;

},{"./rows":17}],16:[function(require,module,exports){
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

var _tagbar = require("./tagbar");

var _tagbar2 = _interopRequireDefault(_tagbar);

var _messaging = require("./messaging");

var _messaging2 = _interopRequireDefault(_messaging);

var _urlIcon = require("./url-icon");

var _urlIcon2 = _interopRequireDefault(_urlIcon);

var _icon = require("./icon");

var _icon2 = _interopRequireDefault(_icon);

var _openWebsite = require("./open-website");

var _openWebsite2 = _interopRequireDefault(_openWebsite);

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

    _this.setCategories(props);

    _this._onKeyPress = (0, _debounceFn2.default)(_this.onKeyPress.bind(_this), 50);
    _this.update(props.query || "");
    return _this;
  }

  _createClass(Results, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      if (props.recentBookmarksFirst !== this.props.recentBookmarksFirst) {
        this.setCategories(props);
      }
    }
  }, {
    key: "setCategories",
    value: function setCategories(props) {
      var categories = [new _openWebsite2.default(this, 1), new _querySuggestions2.default(this, 2), new _topSites2.default(this, props.recentBookmarksFirst ? 4 : 3), new _recentBookmarks2.default(this, props.recentBookmarksFirst ? 3 : 4), new _bookmarkTags2.default(this, 5), new _bookmarkSearch2.default(this, 6), new _history2.default(this, 7)];

      this.setState({
        categories: categories
      });

      this.update(props.query || "");
    }
  }, {
    key: "addRows",
    value: function addRows(category, rows) {
      var _this2 = this;

      if (rows.length === 0) return;

      var urlMap = {};
      var i = this.state.content.length;
      while (i--) {
        urlMap[this.state.content[i].url] = true;
      }

      var tags = this.state.tags;
      i = rows.length;
      while (i--) {
        if (rows[i].tags) {
          tags = tags.concat(rows[i].tags);
        }
      }

      tags = tags.filter(function (t) {
        return 'tag:' + t !== _this2.props.query;
      });

      var content = this.trim(this.state.content.concat(rows.filter(function (r) {
        return !urlMap[r.url];
      }).map(function (r, i) {
        r.category = category;
        r.index = _this2.state.content.length + i;
        return r;
      })));

      this.setState({
        content: content,
        tags: tags
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
            collapsed: content.length >= MAX_ITEMS && selectedCategory.name != category.name && !!category.title,
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
    key: "trim",
    value: function trim(content) {
      var categoryCounts = {};
      var pinnedCount = this.pinnedRowCount();

      content = content.filter(function (r) {
        if (!categoryCounts[r.category.name]) {
          categoryCounts[r.category.name] = 0;
        }

        categoryCounts[r.category.name]++;

        return r.category.pinned || MAX_ITEMS - pinnedCount >= categoryCounts[r.category.name];
      });

      return content;
    }
  }, {
    key: "pinnedRowCount",
    value: function pinnedRowCount(content) {
      content || (content = this.state.content);
      var len = content.length;

      var ctr = 0;
      var i = -1;
      while (++i < len) {
        if (content[i].category.pinned) {
          ctr++;
        }
      }

      return ctr;
    }
  }, {
    key: "reset",
    value: function reset(query) {
      this.setState({
        selected: 0,
        content: [],
        tags: [],
        errors: [],
        query: query || ''
      });
    }
  }, {
    key: "update",
    value: function update(query) {
      query = (query || "").trim();
      this.reset();
      this.state.categories.forEach(function (c) {
        return c.onNewQuery(query);
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

      if (nextProps.recentBookmarksFirst !== this.props.recentBookmarksFirst) {
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

      if (props.recentBookmarksFirst !== this.props.recentBookmarksFirst) {
        this.setCategories(props);
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
      } else if (e.ctrlKey && e.keyCode == 37) {
        this.props.prevWallpaper();
        e.preventDefault();
        e.stopPropagation();
      } else if (e.ctrlKey && e.keyCode == 39) {
        this.props.nextWallpaper();
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
        { className: "results " + (this.state.tags.length ? "has-tags" : "") },
        (0, _preact.h)(
          "div",
          { className: "links" },
          (0, _preact.h)(
            "div",
            { className: "results-categories" },
            this.contentByCategory().map(function (category) {
              return _this3.renderCategory(category);
            })
          ),
          (0, _preact.h)(_sidebar2.default, { onChange: function onChange() {
              return _this3.update();
            }, selected: this.content()[this.state.selected], messages: this.messages, onUpdateTopSites: function onUpdateTopSites() {
              return _this3.onUpdateTopSites();
            }, updateFn: function updateFn() {
              return _this3.update(_this3.props.query || "");
            } }),
          (0, _preact.h)("div", { className: "clear" })
        ),
        (0, _preact.h)(_tagbar2.default, { query: this.props.query, openTag: this.props.openTag, content: this.state.tags })
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

},{"./bookmark-search":3,"./bookmark-tags":4,"./history":7,"./icon":8,"./messaging":11,"./open-website":13,"./query-suggestions":14,"./recent-bookmarks":15,"./sidebar":21,"./tagbar":22,"./top-sites":24,"./url-icon":25,"debounce-fn":29,"preact":33}],17:[function(require,module,exports){
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
  }, {
    key: "onNewQuery",
    value: function onNewQuery(query) {
      this.latestQuery = query;

      if (this.shouldBeOpen(query)) {
        this.update(query);
      }
    }
  }]);

  return Rows;
}();

exports.default = Rows;

},{"./url-icon":25}],18:[function(require,module,exports){
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

    _this.setState({
      value: ''
    });

    _this._onClick = _this.onClick.bind(_this);
    return _this;
  }

  _createClass(SearchInput, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      if (props.value && props.value.trim() !== this.state.value.trim()) {
        this.setState({
          value: props.value
        });
      }
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      if (!this.state.focused) return;

      this.setState({
        focused: false
      });

      this.props.onBlur();
    }
  }, {
    key: "onFocus",
    value: function onFocus() {
      if (this.state.focused) return;

      this.setState({
        focused: true
      });

      this.props.onFocus();
    }
  }, {
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
      if (this.state.value === '' && !document.querySelector('.content-wrapper .content').contains(e.target) && !e.target.classList.contains('button')) {
        this.onBlur();
      }
    }
  }, {
    key: "onQueryChange",
    value: function onQueryChange(value, keyCode, event) {
      if (value.trim() !== "") {
        this.onFocus();
      }

      if (keyCode === 13) {
        return this.props.onPressEnter(value);
      }

      if (keyCode === 27) {
        return this.onBlur();
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
          return _this3.onFocus();
        },
        onChange: function onChange(e) {
          return _this3.onQueryChange(e.target.value, undefined, 'change');
        },
        onKeyUp: function onKeyUp(e) {
          return _this3.onQueryChange(e.target.value, e.keyCode, 'key up');
        },
        onClick: function onClick() {
          return _this3.onFocus();
        },
        value: this.state.value });
    }
  }]);

  return SearchInput;
}(_preact.Component);

exports.default = SearchInput;

},{"./icon":8,"preact":33}],19:[function(require,module,exports){
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

var _greeting = require("./greeting");

var _greeting2 = _interopRequireDefault(_greeting);

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
          this.props.enableGreeting ? (0, _preact.h)(_greeting2.default, { name: this.state.username, messages: this.messages }) : null,
          (0, _preact.h)(_searchInput2.default, { onPressEnter: function onPressEnter() {
              return _this2.onPressEnter();
            },
            onQueryChange: this._onQueryChange,
            onFocus: function onFocus() {
              return _this2.onFocus();
            },
            onBlur: function onBlur() {
              return _this2.onBlur();
            },
            value: this.state.query
          }),
          (0, _preact.h)(_results2.default, { recentBookmarksFirst: this.props.recentBookmarksFirst, nextWallpaper: this.props.nextWallpaper, prevWallpaper: this.props.prevWallpaper, openTag: function openTag(tag) {
              return _this2._onQueryChange('tag:' + tag);
            }, focused: this.state.focused, query: this.state.query }),
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

},{"./content":5,"./greeting":6,"./messaging":11,"./results":16,"./search-input":18,"debounce-fn":29,"preact":33}],20:[function(require,module,exports){
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

},{"../chrome/settings-sections":1,"./icon":8,"preact":33}],21:[function(require,module,exports){
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

      setTimeout(this.props.onChange, 1000);
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

      setTimeout(this.props.onChange, 1000);
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

},{"./icon":8,"./top-sites":24,"./url-image":26,"preact":33,"relative-date":40,"urls":49}],22:[function(require,module,exports){
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

var Tagbar = function (_Component) {
  _inherits(Tagbar, _Component);

  function Tagbar() {
    _classCallCheck(this, Tagbar);

    return _possibleConstructorReturn(this, (Tagbar.__proto__ || Object.getPrototypeOf(Tagbar)).apply(this, arguments));
  }

  _createClass(Tagbar, [{
    key: "content",
    value: function content() {
      if (!this.props.content || !this.props.content.length) return [];

      var copy = this.props.content.slice();

      var occr = {};
      var i = copy.length;
      while (i--) {
        occr[copy[i]] = occr[copy[i]] ? occr[copy[i]] + 1 : 1;
      }

      var uniques = Object.keys(occr);
      uniques.sort(function (a, b) {
        if (occr[a] < occr[b]) return 1;
        if (occr[a] > occr[b]) return -1;
        return 0;
      });

      return uniques;
    }
  }, {
    key: "max",
    value: function max() {
      return 10;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var content = this.content();
      if (content.length === 0) return;

      return (0, _preact.h)(
        "div",
        { className: "tagbar" },
        (0, _preact.h)(_icon2.default, { name: "tag", stroke: "3" }),
        (0, _preact.h)(
          "div",
          { className: "personal-tags" },
          content.slice(0, this.max()).map(function (t) {
            return _this2.renderTag(t);
          })
        )
      );
    }
  }, {
    key: "renderTag",
    value: function renderTag(name) {
      var _this3 = this;

      var title = capitalize(name);

      return (0, _preact.h)(
        "a",
        { className: "tag button", onClick: function onClick() {
            return _this3.props.openTag(name);
          }, title: "Open \"" + title + "\" tag" },
        title
      );
    }
  }]);

  return Tagbar;
}(_preact.Component);

exports.default = Tagbar;


function capitalize(title) {
  return title.split(/\s+/).map(function (w) {
    return w.slice(0, 1).toUpperCase() + w.slice(1);
  }).join(' ');
}

},{"./icon":8,"preact":33}],23:[function(require,module,exports){
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

},{"title-from-url":43}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.get = get;
exports.hide = hide;

var _rows = require('./rows');

var _rows2 = _interopRequireDefault(_rows);

var _urls = require('urls');

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
    key: 'shouldBeOpen',
    value: function shouldBeOpen(query) {
      return query.length < 5;
    }
  }, {
    key: 'update',
    value: function update(query) {
      if (!query) {
        return this.all();
      } else {
        return this.filterByQuery(query);
      }
    }
  }, {
    key: 'all',
    value: function all() {
      var _this2 = this;

      get(function (rows) {
        return _this2.add(addKozmos(rows.slice(0, 5)));
      });
    }
  }, {
    key: 'filterByQuery',
    value: function filterByQuery(query) {
      var _this3 = this;

      var result = [];

      chrome.topSites.get(function (topSites) {
        var i = -1;
        var len = topSites.length;
        while (++i < len) {
          if ((0, _urls.clean)(topSites[i].url).indexOf(query) === 0 || topSites[i].title.toLowerCase().indexOf(query) === 0) {
            result.push(topSites[i]);
          }
        }

        _this3.add(result);
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
  var list = {
    'https://google.com/': true,
    'http://google.com/': true
  };

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

},{"./rows":17,"urls":49}],25:[function(require,module,exports){
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

},{"./titles":23,"./url-image":26,"img":31,"preact":33,"urls":49}],26:[function(require,module,exports){
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

      if (!this.props['icon-only'] && content.images && content.images.length > 0 && content.images[0]) {
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

},{"debounce-fn":29,"img":31,"path":32,"preact":33,"random-color":39}],27:[function(require,module,exports){
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

  function Wallpaper() {
    _classCallCheck(this, Wallpaper);

    return _possibleConstructorReturn(this, (Wallpaper.__proto__ || Object.getPrototypeOf(Wallpaper)).apply(this, arguments));
  }

  _createClass(Wallpaper, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.load();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      if (props.index !== this.props.index) {
        this.load();
      }
    }
  }, {
    key: "load",
    value: function load() {
      var _this2 = this;

      this.setState({
        loading: true,
        src: null
      });

      (0, _img2.default)(this.selected().url, function (err) {
        if (err) return _this2.onError(err);

        _this2.setState({
          loading: false,
          src: _this2.selected()
        });
      });

      setTimeout(function () {
        if (!_this2.state.loading || _this2.props.index) return;

        var start = Date.now();
        var cached = (0, _img2.default)(_this2.url(_this2.src(_this2.yesterday())), function (err) {
          if (err || !_this2.state.loading) return;

          _this2.setState({
            src: _this2.src(_this2.yesterday())
          });
        });

        setTimeout(function () {
          cached.src = '';
        }, 1000);
      }, 500);
    }
  }, {
    key: "onError",
    value: function onError(error) {
      console.error(error);

      this.setState({
        loading: false,
        error: error
      });
    }
  }, {
    key: "today",
    value: function today() {
      var now = new Date();
      var start = new Date(now.getFullYear(), 0, 0);
      var diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
      return Math.floor(diff / ONE_DAY);
    }
  }, {
    key: "yesterday",
    value: function yesterday() {
      return this.today() - 1;
    }
  }, {
    key: "src",
    value: function src(index) {
      return _wallpapers2.default[index % _wallpapers2.default.length];
    }
  }, {
    key: "selected",
    value: function selected() {
      return this.src(this.today() + (this.props.index || 0));
    }
  }, {
    key: "width",
    value: function width() {
      return window.innerWidth;
    }
  }, {
    key: "url",
    value: function url(src) {
      return src.url + '?auto=format&fit=crop&w=' + this.width();
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.src) return;

      var src = this.state.src;
      var style = {
        backgroundImage: "url(" + this.url(this.state.src) + ")"
      };

      if (src.position) {
        style.backgroundPosition = src.position;
      }

      return (0, _preact.h)("div", { className: "wallpaper", style: style });
    }
  }]);

  return Wallpaper;
}(_preact.Component);

exports.default = Wallpaper;

},{"./wallpapers":28,"img":31,"preact":33}],28:[function(require,module,exports){
module.exports=[
  { "url": "https://images.unsplash.com/photo-1444464666168-49d633b86797" },
  { "url": "https://images.unsplash.com/photo-1450849608880-6f787542c88a" },
  { "position": "top center", "url": "https://images.unsplash.com/photo-1429516387459-9891b7b96c78" },
  { "url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800" },
  { "url": "https://images.unsplash.com/photo-1488724034958-0faad88cf69f" },
  { "url": "https://images.unsplash.com/photo-1430651717504-ebb9e3e6795e" },
  { "url": "https://images.unsplash.com/photo-1441802259878-a13f732ce410" },
  { "position": "bottom center", "url": "https://images.unsplash.com/photo-1494200483035-db7bc6aa5739" },
  { "url": "https://images.unsplash.com/photo-1459258350879-34886319a3c9" },
  { "url": "https://images.unsplash.com/photo-1507098926331-8d324b139d15" },
  { "position": "top center", "url": "https://images.unsplash.com/photo-1494301950624-2c54cc9826c5" },
  { "url": "https://images.unsplash.com/photo-1480499484268-a85a2414da81" },
  { "url": "https://images.unsplash.com/photo-1483116531522-4c4e525f504e" },
  { "url": "https://images.unsplash.com/photo-1479030160180-b1860951d696" },
  { "url": "https://images.unsplash.com/photo-1510353622758-62e3b63b5fb5" },
  { "url": "https://images.unsplash.com/photo-1501446690852-da55df7bfe07" },
  { "position": "top center", "url": "https://images.unsplash.com/photo-1501862169286-518c291e3eed" },
  { "url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e" },
  { "position": "top center", "url": "https://images.unsplash.com/photo-1479030160180-b1860951d696" },
  { "url": "https://images.unsplash.com/photo-1431887773042-803ed52bed26" },
  { "url": "https://images.unsplash.com/photo-1500514966906-fe245eea9344" },
  { "position": "bottom center", "url": "https://images.unsplash.com/photo-1465401180489-ceb5a34d8a63" },
  { "url": "https://images.unsplash.com/photo-1505299916137-b69793a66907" },
  { "url": "https://images.unsplash.com/photo-1504461154005-31b435e687ed" },
  { "url": "https://images.unsplash.com/photo-1504740191045-63e15251e750" },
  { "url": "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c" },
  { "url": "https://images.unsplash.com/photo-1504908415025-b7c256094693" },
  { "position":"bottom center", "url": "https://images.unsplash.com/photo-1501963422762-3d89bd989568" },
  { "url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" },
  { "url": "https://images.unsplash.com/photo-1499240713677-2c7a4f692044" },
  { "url": "https://images.unsplash.com/photo-1490464348166-8b8bbd9f1e2e" },
  { "position":"top center", "url": "https://images.unsplash.com/photo-1455325528055-ad815afecebe" },
  { "url": "https://images.unsplash.com/photo-1478033394151-c931d5a4bdd6" },
  { "url": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad" },
  { "url": "https://images.unsplash.com/photo-1505053262691-624063f94b65" }
]

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){

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
},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{"_process":34}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":36,"./encode":37}],39:[function(require,module,exports){
var random = require("rnd");

module.exports = color;

function color (max, min) {
  max || (max = 255);
  return 'rgb(' + random(max, min) + ', ' + random(max, min) + ', ' + random(max, min) + ')';
}

},{"rnd":41}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
module.exports = random;

function random (max, min) {
  max || (max = 999999999999);
  min || (min = 0);

  return min + Math.floor(Math.random() * (max - min));
}

},{}],42:[function(require,module,exports){

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
},{}],43:[function(require,module,exports){
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

},{"to-title":46}],44:[function(require,module,exports){

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
},{"to-no-case":45}],45:[function(require,module,exports){

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
},{}],46:[function(require,module,exports){
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

},{"escape-regexp-component":30,"title-case-minors":42,"to-capital-case":44}],47:[function(require,module,exports){
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

},{"./util":48,"punycode":35,"querystring":38}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
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

},{"url":47}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaHJvbWUvc2V0dGluZ3Mtc2VjdGlvbnMuanNvbiIsImxpYi9tZXNzYWdpbmcuanMiLCJuZXd0YWIvYm9va21hcmstc2VhcmNoLmpzIiwibmV3dGFiL2Jvb2ttYXJrLXRhZ3MuanMiLCJuZXd0YWIvY29udGVudC5qcyIsIm5ld3RhYi9ncmVldGluZy5qcyIsIm5ld3RhYi9oaXN0b3J5LmpzIiwibmV3dGFiL2ljb24uanMiLCJuZXd0YWIvbG9nby5qcyIsIm5ld3RhYi9tZW51LmpzIiwibmV3dGFiL21lc3NhZ2luZy5qcyIsIm5ld3RhYi9uZXd0YWIuanMiLCJuZXd0YWIvb3Blbi13ZWJzaXRlLmpzIiwibmV3dGFiL3F1ZXJ5LXN1Z2dlc3Rpb25zLmpzIiwibmV3dGFiL3JlY2VudC1ib29rbWFya3MuanMiLCJuZXd0YWIvcmVzdWx0cy5qcyIsIm5ld3RhYi9yb3dzLmpzIiwibmV3dGFiL3NlYXJjaC1pbnB1dC5qcyIsIm5ld3RhYi9zZWFyY2guanMiLCJuZXd0YWIvc2V0dGluZ3MuanMiLCJuZXd0YWIvc2lkZWJhci5qcyIsIm5ld3RhYi90YWdiYXIuanMiLCJuZXd0YWIvdGl0bGVzLmpzIiwibmV3dGFiL3RvcC1zaXRlcy5qcyIsIm5ld3RhYi91cmwtaWNvbi5qcyIsIm5ld3RhYi91cmwtaW1hZ2UuanMiLCJuZXd0YWIvd2FsbHBhcGVyLmpzIiwibmV3dGFiL3dhbGxwYXBlcnMuanNvbiIsIm5vZGVfbW9kdWxlcy9kZWJvdW5jZS1mbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lc2NhcGUtcmVnZXhwLWNvbXBvbmVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbWcvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3ByZWFjdC9kaXN0L3ByZWFjdC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHVueWNvZGUvcHVueWNvZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yYW5kb20tY29sb3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVsYXRpdmUtZGF0ZS9saWIvcmVsYXRpdmUtZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9ybmQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGl0bGUtY2FzZS1taW5vcnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGl0bGUtZnJvbS11cmwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdG8tY2FwaXRhbC1jYXNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RvLW5vLWNhc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdG8tdGl0bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdXJsL3VybC5qcyIsIm5vZGVfbW9kdWxlcy91cmwvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy91cmxzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdDQSxJQUFJLGlCQUFpQixDQUFyQjs7QUFFTyxJQUFNLHNEQUF1QixDQUE3Qjs7SUFFYyxTO0FBQ25CLHVCQUFjO0FBQUE7O0FBQ1osU0FBSyxp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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHtcbiAgICBrZXk6IFwib25lQ2xpY2tMaWtlXCIsXG4gICAgdGl0bGU6IFwiT25lLWNsaWNrIGJvb2ttYXJraW5nXCIsXG4gICAgZGVzYzogXCJIZWFydCBidXR0b24gd2lsbCBpbW1lZGlhdGVseSBib29rbWFyayB3aGVuIGNsaWNrZWQuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHBvcHVwOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwicmVjZW50Qm9va21hcmtzRmlyc3RcIixcbiAgICB0aXRsZTogXCJSZWNlbnQgQm9va21hcmtzIEZpcnN0XCIsXG4gICAgZGVzYzogXCJNb3ZlIFJlY2VudCBCb29rbWFya3MgT3ZlciBGcmVxdWVudGx5IFZpc2l0ZWRcIixcbiAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgbmV3dGFiOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwibWluaW1hbE1vZGVcIixcbiAgICB0aXRsZTogXCJFbmFibGUgTWluaW1hbCBNb2RlXCIsXG4gICAgZGVzYzogXCJIaWRlIG1ham9yaXR5IG9mIHRoZSBpbnRlcmZhY2UgdW50aWwgdXNlciBmb2N1c2VzLlwiLFxuICAgIGRlZmF1bHRWYWx1ZTogdHJ1ZSxcbiAgICBuZXd0YWI6IHRydWVcbiAgfSxcbiAge1xuICAgIGtleTogXCJzaG93V2FsbHBhcGVyXCIsXG4gICAgdGl0bGU6IFwiU2hvdyBXYWxscGFwZXJcIixcbiAgICBkZXNjOiBcIkdldCBhIG5ldyBiZWF1dGlmdWwgcGhvdG8gaW4geW91ciBuZXcgdGFiIGV2ZXJ5IGRheS5cIixcbiAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgbmV3dGFiOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwiZW5hYmxlR3JlZXRpbmdcIixcbiAgICB0aXRsZTogXCJTaG93IGdyZWV0aW5nICYgdGltZVwiLFxuICAgIGRlc2M6IFwiU2VlIHlvdXIgbmFtZSwgYW5kIGEgbmljZSBjbG9jay5cIixcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9LFxuICB7XG4gICAga2V5OiBcImVuYWJsZU5ld1RhYlwiLFxuICAgIHRpdGxlOiBcIkVuYWJsZSBOZXcgVGFiIEludGVyZmFjZVwiLFxuICAgIGRlc2M6IFwiRmFzdGVyIGFuZCBlYXNpZXIgc2VhcmNoIGludGVyZmFjZS5cIixcbiAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgcG9wdXA6IHRydWUsXG4gICAgbmV3dGFiOiB0cnVlXG4gIH1cbl1cbiIsImxldCBtZXNzYWdlQ291bnRlciA9IDBcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfVElNRU9VVF9TRUNTID0gNVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdpbmcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmxpc3RlbkZvck1lc3NhZ2VzKClcbiAgICB0aGlzLndhaXRpbmcgPSB7fVxuICB9XG5cbiAgZHJhZnQoeyBpZCwgY29udGVudCwgZXJyb3IsIHRvLCByZXBseSB9KSB7XG4gICAgaWQgPSB0aGlzLmdlbmVyYXRlSWQoKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyb206IHRoaXMubmFtZSxcbiAgICAgIHRvOiB0byB8fCB0aGlzLnRhcmdldCxcbiAgICAgIGVycm9yOiBjb250ZW50LmVycm9yIHx8IGVycm9yLFxuICAgICAgaWQsIGNvbnRlbnQsIHJlcGx5XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVJZCgpIHtcbiAgICByZXR1cm4gKERhdGUubm93KCkgKiAxMDAwKSArICgrK21lc3NhZ2VDb3VudGVyKVxuICB9XG5cbiAgb25SZWNlaXZlKG1zZykge1xuICAgIGlmIChtc2cudG8gIT09IHRoaXMubmFtZSkgcmV0dXJuIHRydWVcblxuICAgIGlmIChtc2cucmVwbHkgJiYgdGhpcy53YWl0aW5nW21zZy5yZXBseV0pIHtcbiAgICAgIHRoaXMud2FpdGluZ1ttc2cucmVwbHldKG1zZylcbiAgICB9XG5cbiAgICBpZiAobXNnLnJlcGx5KSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChtc2cuY29udGVudCAmJiBtc2cuY29udGVudC5waW5nKSB7XG4gICAgICB0aGlzLnJlcGx5KG1zZywgeyBwb25nOiB0cnVlIH0pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHBpbmcoY2FsbGJhY2spIHtcbiAgICB0aGlzLnNlbmQoeyBwaW5nOiB0cnVlIH0sIGNhbGxiYWNrKVxuICB9XG5cbiAgcmVwbHkobXNnLCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmNvbnRlbnQpIHtcbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIGNvbnRlbnQ6IG9wdGlvbnNcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvcHRpb25zLnJlcGx5ID0gbXNnLmlkXG4gICAgb3B0aW9ucy50byA9IG1zZy5mcm9tXG5cbiAgICB0aGlzLnNlbmQob3B0aW9ucylcbiAgfVxuXG4gIHNlbmQob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBtc2cgPSB0aGlzLmRyYWZ0KG9wdGlvbnMuY29udGVudCA/IG9wdGlvbnMgOiB7IGNvbnRlbnQ6IG9wdGlvbnMgfSlcblxuICAgIHRoaXMuc2VuZE1lc3NhZ2UobXNnKVxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLndhaXRSZXBseUZvcihtc2cuaWQsIERFRkFVTFRfVElNRU9VVF9TRUNTLCBjYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICB3YWl0UmVwbHlGb3IobXNnSWQsIHRpbWVvdXRTZWNzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzXG4gICAgbGV0IHRpbWVvdXQgPSB1bmRlZmluZWRcblxuICAgIGlmICh0aW1lb3V0U2VjcyA+IDApIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KG9uVGltZW91dCwgdGltZW91dFNlY3MgKiAxMDAwKVxuICAgIH1cblxuICAgIHRoaXMud2FpdGluZ1ttc2dJZF0gPSBtc2cgPT4ge1xuICAgICAgZG9uZSgpXG4gICAgICBjYWxsYmFjayhtc2cpXG4gICAgfVxuXG4gICAgcmV0dXJuIGRvbmVcblxuICAgIGZ1bmN0aW9uIGRvbmUgKCkge1xuICAgICAgaWYgKHRpbWVvdXQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KVxuICAgICAgfVxuXG4gICAgICB0aW1lb3V0ID0gdW5kZWZpbmVkXG4gICAgICBkZWxldGUgc2VsZi53YWl0aW5nW21zZ0lkXVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uVGltZW91dCAoKSB7XG4gICAgICBkb25lKClcbiAgICAgIGNhbGxiYWNrKHsgZXJyb3I6ICdNZXNzYWdlIHJlc3BvbnNlIHRpbWVvdXQgKCcgKyB0aW1lb3V0U2VjcyArJylzLicgfSlcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvb2ttYXJrU2VhcmNoIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMubmFtZSA9ICdib29rbWFyay1zZWFyY2gnXG4gICAgdGhpcy50aXRsZSA9ICdMaWtlZCBpbiBLb3ptb3MnXG5cbiAgICB0aGlzLnVwZGF0ZSA9IGRlYm91bmNlKHRoaXMuX3VwZGF0ZS5iaW5kKHRoaXMpLCAyNTApXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkgJiYgcXVlcnkubGVuZ3RoID4gMSAmJiAocXVlcnkuaW5kZXhPZigndGFnOicpICE9PSAwIHx8IHF1ZXJ5Lmxlbmd0aCA8IDUpXG4gIH1cblxuICBmYWlsKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgfVxuXG4gIF91cGRhdGUocXVlcnkpIHtcbiAgICBjb25zdCBvcXVlcnkgPSBxdWVyeSB8fCB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnlcblxuICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ3NlYXJjaC1ib29rbWFya3MnLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChvcXVlcnkgIT09IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeS50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgIHRoaXMuYWRkKHJlc3AuY29udGVudC5yZXN1bHRzLmxpa2VzKVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXN0Qm9va21hcmtzQnlUYWcgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gJ2Jvb2ttYXJrcy1ieS10YWcnXG4gICAgdGhpcy50aXRsZSA9IHF1ZXJ5ID0+IGBUYWdnZWQgd2l0aCAke3F1ZXJ5LnNsaWNlKDQpfSBPbiBLb3ptb3NgXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkgJiYgcXVlcnkuaW5kZXhPZigndGFnOicpID09PSAwICYmIHF1ZXJ5Lmxlbmd0aCA+IDRcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIGNvbnN0IG9xdWVyeSA9IHF1ZXJ5IHx8IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeVxuXG4gICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnc2VhcmNoLWJvb2ttYXJrcycsIHF1ZXJ5IH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKG9xdWVyeSAhPT0gdGhpcy5yZXN1bHRzLnByb3BzLnF1ZXJ5LnRyaW0oKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLmZhaWwocmVzcC5lcnJvcilcblxuICAgICAgdGhpcy5hZGQocmVzcC5jb250ZW50LnJlc3VsdHMubGlrZXMpXG4gICAgfSlcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudC13cmFwcGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2VudGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Bjb250ZW50ICR7dGhpcy5wcm9wcy5mb2N1c2VkID8gXCJmb2N1c2VkXCIgOiBcIlwifWB9PlxuICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmVldGluZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLnByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LW5hbWUnIH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLm9uRXJyb3IocmVzcC5lcnJvcilcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG5hbWU6IHJlc3AuY29udGVudC5uYW1lXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLnRpY2soKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5kZWxldGVUaW1lcigpXG4gIH1cblxuICBkZWxldGVUaW1lcigpIHtcbiAgICBpZiAodGhpcy50aW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcilcbiAgICAgIHRoaXMudGltZXIgPSB1bmRlZmluZWRcbiAgICB9XG4gIH1cblxuICBzZXRUaW1lcigpIHtcbiAgICB0aGlzLmRlbGV0ZVRpbWVyKClcbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnRpY2soKSwgNjAwMDApXG4gIH1cblxuICB0aWNrKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKClcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaG91cnM6IG5vdy5nZXRIb3VycygpLFxuICAgICAgbWludXRlczogbm93LmdldE1pbnV0ZXMoKVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFRpbWVyKClcbiAgfVxuXG4gIG9uRXJyb3IoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyZWV0aW5nXCI+XG4gICAgICAgIHt0aGlzLnJlbmRlck1lc3NhZ2UoKX1cbiAgICAgICAge3RoaXMucmVuZGVyVGltZSgpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGltZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aW1lXCI+XG4gICAgICAgIHtwYWQodGhpcy5zdGF0ZS5ob3Vycyl9OntwYWQodGhpcy5zdGF0ZS5taW51dGVzKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck1lc3NhZ2UoKSB7XG4gICAgY29uc3QgaG91ciA9IHRoaXMuc3RhdGUuaG91cnNcbiAgICBsZXQgbWVzc2FnZSA9IFwiR29vZCBtb3JuaW5nXCJcblxuICAgIGlmIChob3VyID49IDEyKSBtZXNzYWdlID0gXCJHb29kIEFmdGVybm9vblwiXG4gICAgaWYgKGhvdXIgPj0gMTYpIG1lc3NhZ2UgPSBcIkdvb2QgRXZlbmluZ1wiXG5cbiAgICBtZXNzYWdlICs9ICh0aGlzLnN0YXRlLm5hbWUgPyBcIixcIiA6IFwiLlwiKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVzc2FnZVwiPlxuICAgICAgICB7bWVzc2FnZX1cbiAgICAgICAge3RoaXMucmVuZGVyTmFtZSgpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTmFtZSgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUubmFtZSkgcmV0dXJuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYW1lXCI+XG4gICAgICAgIHt0aGlzLnN0YXRlLm5hbWUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHRoaXMuc3RhdGUubmFtZS5zbGljZSgxKX0uXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gcGFkIChuKSB7XG4gIGlmIChTdHJpbmcobikubGVuZ3RoIDwgMikge1xuICAgIHJldHVybiAnMCcgKyBuXG4gIH1cblxuICByZXR1cm4gblxufVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5pbXBvcnQgeyBmaW5kSG9zdG5hbWUgfSBmcm9tICcuL3VybC1pbWFnZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlzdG9yeSBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSAnaGlzdG9yeSdcbiAgICB0aGlzLnRpdGxlID0gJ1ByZXZpb3VzbHkgVmlzaXRlZCdcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeS5sZW5ndGggPiAxICYmIHF1ZXJ5LnRyaW0oKS5sZW5ndGggPiAxXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBjaHJvbWUuaGlzdG9yeS5zZWFyY2goeyB0ZXh0OiBxdWVyeSB9LCBoaXN0b3J5ID0+IHtcbiAgICAgIHRoaXMuYWRkKGhpc3RvcnkuZmlsdGVyKGZpbHRlck91dFNlYXJjaCkpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJPdXRTZWFyY2ggKHJvdykge1xuICByZXR1cm4gZmluZEhvc3RuYW1lKHJvdy51cmwpLnNwbGl0KCcuJylbMF0gIT09ICdnb29nbGUnXG4gICAgJiYgIS9zZWFyY2hcXC8/XFw/cVxcPVxcdyovLnRlc3Qocm93LnVybClcbiAgICAmJiAhL2ZhY2Vib29rXFwuY29tXFwvc2VhcmNoLy50ZXN0KHJvdy51cmwpXG4gICAgJiYgIS90d2l0dGVyXFwuY29tXFwvc2VhcmNoLy50ZXN0KHJvdy51cmwpXG4gICAgJiYgZmluZEhvc3RuYW1lKHJvdy51cmwpICE9PSAndC5jbydcbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJY29uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXNbJ3JlbmRlcicgKyB0aGlzLnByb3BzLm5hbWUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoMCwgMSkgKyB0aGlzLnByb3BzLm5hbWUuc2xpY2UoMSldXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2xpY2t9IGNsYXNzTmFtZT17YGljb24gaWNvbi0ke3RoaXMucHJvcHMubmFtZX1gfSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIHttZXRob2QgPyBtZXRob2QuY2FsbCh0aGlzKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBzdHJva2UgKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnN0cm9rZSB8fCAyXG4gIH1cblxuICByZW5kZXJBbGVydCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktYWxlcnRcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0xNiAzIEwzMCAyOSAyIDI5IFogTTE2IDExIEwxNiAxOSBNMTYgMjMgTDE2IDI1XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsb2NrKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jbG9ja1wiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTZcIiBjeT1cIjE2XCIgcj1cIjE0XCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0xNiA4IEwxNiAxNiAyMCAyMFwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJDbG9zZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktY2xvc2VcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0yIDMwIEwzMCAyIE0zMCAzMCBMMiAyXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckhlYXJ0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1oZWFydFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnN0cm9rZSgpfT5cbiAgICAgICAgPHBhdGggZD1cIk00IDE2IEMxIDEyIDIgNiA3IDQgMTIgMiAxNSA2IDE2IDggMTcgNiAyMSAyIDI2IDQgMzEgNiAzMSAxMiAyOCAxNiAyNSAyMCAxNiAyOCAxNiAyOCAxNiAyOCA3IDIwIDQgMTYgWlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZWFyY2goKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXNlYXJjaFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTRcIiBjeT1cIjE0XCIgcj1cIjEyXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0yMyAyMyBMMzAgMzBcIiAgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckV4dGVybmFsKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1leHRlcm5hbFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTE0IDkgTDMgOSAzIDI5IDIzIDI5IDIzIDE4IE0xOCA0IEwyOCA0IDI4IDE0IE0yOCA0IEwxNCAxOFwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJUYWcoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXRhZ1wiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMjRcIiBjeT1cIjhcIiByPVwiMlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMiAxOCBMMTggMiAzMCAyIDMwIDE0IDE0IDMwIFpcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVHJhc2goKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXRyYXNoXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMjggNiBMNiA2IDggMzAgMjQgMzAgMjYgNiA0IDYgTTE2IDEyIEwxNiAyNCBNMjEgMTIgTDIwIDI0IE0xMSAxMiBMMTIgMjQgTTEyIDYgTDEzIDIgMTkgMiAyMCA2XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclJpZ2h0Q2hldnJvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktY2hldnJvbi1yaWdodFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTEyIDMwIEwyNCAxNiAxMiAyXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNldHRpbmdzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1zZXR0aW5nc1wiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTEzIDIgTDEzIDYgMTEgNyA4IDQgNCA4IDcgMTEgNiAxMyAyIDEzIDIgMTkgNiAxOSA3IDIxIDQgMjQgOCAyOCAxMSAyNSAxMyAyNiAxMyAzMCAxOSAzMCAxOSAyNiAyMSAyNSAyNCAyOCAyOCAyNCAyNSAyMSAyNiAxOSAzMCAxOSAzMCAxMyAyNiAxMyAyNSAxMSAyOCA4IDI0IDQgMjEgNyAxOSA2IDE5IDIgWlwiIC8+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNlwiIGN5PVwiMTZcIiByPVwiNFwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dvIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJsb2dvXCIgaHJlZj1cImh0dHBzOi8vZ2V0a296bW9zLmNvbVwiPlxuICAgICAgICA8aW1nIHNyYz17Y2hyb21lLmV4dGVuc2lvbi5nZXRVUkwoXCJpbWFnZXMvaWNvbjEyOC5wbmdcIil9IHRpdGxlPVwiT3BlbiBLb3ptb3NcIiAvPlxuICAgICAgPC9hPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbnUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzZXRUaXRsZSh0aXRsZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyB0aXRsZSB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lbnVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICAgIHt0aGlzLnN0YXRlLnRpdGxlIHx8IFwiXCJ9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwiYnV0dG9uc1wiPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgaWNvbj1cImNhbGVuZGFyXCJcbiAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0VGl0bGUoJ1JlY2VudGx5IFZpc2l0ZWQnKX1cbiAgICAgICAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy5zZXRUaXRsZSgpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5SZWNlbnQoKX0gLz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgaWNvbj1cImhlYXJ0XCJcbiAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0VGl0bGUoJ0Jvb2ttYXJrcycpfVxuICAgICAgICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLnNldFRpdGxlKCl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub3BlbkJvb2ttYXJrcygpfSAvPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgaWNvbj1cImZpcmVcIlxuICAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0VGl0bGUoJ01vc3QgVmlzaXRlZCcpfVxuICAgICAgICAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy5zZXRUaXRsZSgpfVxuICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vcGVuVG9wKCl9IC8+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IE1lc3NhZ2luZyBmcm9tICcuLi9saWIvbWVzc2FnaW5nJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGcm9tTmV3VGFiVG9CYWNrZ3JvdW5kIGV4dGVuZHMgTWVzc2FnaW5nIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubmFtZSA9ICdrb3ptb3M6bmV3dGFiJ1xuICAgIHRoaXMudGFyZ2V0ID0gJ2tvem1vczpiYWNrZ3JvdW5kJ1xuICB9XG5cbiAgbGlzdGVuRm9yTWVzc2FnZXMoKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKG1zZyA9PiB0aGlzLm9uUmVjZWl2ZShtc2cpKVxuICB9XG5cbiAgc2VuZE1lc3NhZ2UgKG1zZywgY2FsbGJhY2spIHtcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtc2csIGNhbGxiYWNrKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQsIHJlbmRlciB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IFdhbGxwYXBlciBmcm9tICcuL3dhbGxwYXBlcidcbmltcG9ydCBNZW51IGZyb20gXCIuL21lbnVcIlxuaW1wb3J0IFNlYXJjaCBmcm9tICcuL3NlYXJjaCdcbmltcG9ydCBMb2dvIGZyb20gJy4vbG9nbydcbmltcG9ydCBNZXNzYWdpbmcgZnJvbSBcIi4vbWVzc2FnaW5nXCJcbmltcG9ydCBTZXR0aW5ncyBmcm9tIFwiLi9zZXR0aW5nc1wiXG5cbmNsYXNzIE5ld1RhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNZXNzYWdpbmcoKVxuXG4gICAgdGhpcy5sb2FkU2V0dGluZ3MoKVxuICAgIHRoaXMuY2hlY2tJZkRpc2FibGVkKClcbiAgfVxuXG4gIGxvYWRTZXR0aW5ncyhhdm9pZENhY2hlKSB7XG4gICAgdGhpcy5sb2FkU2V0dGluZygnbWluaW1hbE1vZGUnLCBhdm9pZENhY2hlKVxuICAgIHRoaXMubG9hZFNldHRpbmcoJ3Nob3dXYWxscGFwZXInLCBhdm9pZENhY2hlKVxuICAgIHRoaXMubG9hZFNldHRpbmcoJ2VuYWJsZUdyZWV0aW5nJywgYXZvaWRDYWNoZSlcbiAgICB0aGlzLmxvYWRTZXR0aW5nKCdyZWNlbnRCb29rbWFya3NGaXJzdCcsIGF2b2lkQ2FjaGUpXG4gIH1cblxuICBjaGVja0lmRGlzYWJsZWQoKSB7XG4gICAgaWYgKGxvY2FsU3RvcmFnZVsnaXMtZGlzYWJsZWQnXSA9PSAnMScpIHtcbiAgICAgIHRoaXMuc2hvd0RlZmF1bHROZXdUYWIoKVxuICAgIH1cblxuICAgIHRoaXMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtc2V0dGluZ3MtdmFsdWUnLCBrZXk6ICdlbmFibGVOZXdUYWInIH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKHJlc3AuZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogcmVzcC5lcnJvciB9KVxuICAgICAgfVxuXG4gICAgICBpZiAoIXJlc3AuY29udGVudC52YWx1ZSkge1xuICAgICAgICBsb2NhbFN0b3JhZ2VbJ2lzLWRpc2FibGVkJ10gPSBcIjFcIlxuICAgICAgICB0aGlzLnNob3dEZWZhdWx0TmV3VGFiKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZVsnaXMtZGlzYWJsZWQnXSA9IFwiXCJcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgbG9hZFNldHRpbmcoa2V5LCBhdm9pZENhY2hlKSB7XG4gICAgaWYgKCFhdm9pZENhY2hlICYmIGxvY2FsU3RvcmFnZVsnc2V0dGluZ3MtY2FjaGUtJyArIGtleV0pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuYXBwbHlTZXR0aW5nKGtleSwgSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbJ3NldHRpbmdzLWNhY2hlLScgKyBrZXldKSlcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuXG4gICAgdGhpcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ2dldC1zZXR0aW5ncy12YWx1ZScsIGtleSB9LCByZXNwID0+IHtcbiAgICAgIGlmICghcmVzcC5lcnJvcikge1xuICAgICAgICBsb2NhbFN0b3JhZ2VbJ3NldHRpbmdzLWNhY2hlLScgKyBrZXldID0gSlNPTi5zdHJpbmdpZnkocmVzcC5jb250ZW50LnZhbHVlKVxuICAgICAgICB0aGlzLmFwcGx5U2V0dGluZyhrZXksIHJlc3AuY29udGVudC52YWx1ZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYXBwbHlTZXR0aW5nKGtleSwgdmFsdWUpIHtcbiAgICBjb25zdCB1ID0ge31cbiAgICB1W2tleV0gPSB2YWx1ZVxuICAgIHRoaXMuc2V0U3RhdGUodSlcbiAgfVxuXG4gIHNob3dEZWZhdWx0TmV3VGFiKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmRpc2FibGVkKSByZXR1cm5cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbmV3VGFiVVJMOiBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLFxuICAgICAgZGlzYWJsZWQ6IHRydWVcbiAgICB9KVxuXG5cdFx0Y2hyb21lLnRhYnMucXVlcnkoeyBhY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWUgfSwgZnVuY3Rpb24odGFicykge1xuXHRcdFx0dmFyIGFjdGl2ZSA9IHRhYnNbMF0uaWRcblxuXHRcdFx0Y2hyb21lLnRhYnMudXBkYXRlKGFjdGl2ZSwge1xuICAgICAgICB1cmw6IC9maXJlZm94L2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSA/IFwiYWJvdXQ6bmV3dGFiXCIgOiBcImNocm9tZS1zZWFyY2g6Ly9sb2NhbC1udHAvbG9jYWwtbnRwLmh0bWxcIlxuICAgICAgfSlcblx0XHR9KVxuICB9XG5cbiAgcHJldldhbGxwYXBlcigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHdhbGxwYXBlckluZGV4OiAodGhpcy5zdGF0ZS53YWxscGFwZXJJbmRleCB8fCAwKSAtIDFcbiAgICB9KVxuICB9XG5cbiAgbmV4dFdhbGxwYXBlcigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHdhbGxwYXBlckluZGV4OiAodGhpcy5zdGF0ZS53YWxscGFwZXJJbmRleCB8fCAwKSArIDFcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmRpc2FibGVkKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YG5ld3RhYiAke3RoaXMuc3RhdGUuc2hvd1dhbGxwYXBlciA/IFwiaGFzLXdhbGxwYXBlclwiIDogXCJcIn0gJHt0aGlzLnN0YXRlLm1pbmltYWxNb2RlID8gXCJtaW5pbWFsXCIgOiBcIlwifWB9PlxuICAgICAgICB7dGhpcy5zdGF0ZS5taW5pbWFsTW9kZSA/IG51bGwgOiA8TG9nbyAvPn1cbiAgICAgICAgPFNldHRpbmdzIG9uQ2hhbmdlPXsoKSA9PiB0aGlzLmxvYWRTZXR0aW5ncyh0cnVlKX0gbWVzc2FnZXM9e3RoaXMubWVzc2FnZXN9IHR5cGU9XCJuZXd0YWJcIiAvPlxuICAgICAgICA8U2VhcmNoIHJlY2VudEJvb2ttYXJrc0ZpcnN0PXt0aGlzLnN0YXRlLnJlY2VudEJvb2ttYXJrc0ZpcnN0fSBuZXh0V2FsbHBhcGVyPXsoKSA9PiB0aGlzLm5leHRXYWxscGFwZXIoKX0gcHJldldhbGxwYXBlcj17KCkgPT4gdGhpcy5wcmV2V2FsbHBhcGVyKCl9IGVuYWJsZUdyZWV0aW5nPXt0aGlzLnN0YXRlLmVuYWJsZUdyZWV0aW5nfSBzZXR0aW5ncz17dGhpcy5zZXR0aW5nc30gLz5cbiAgICAgICAgeyB0aGlzLnN0YXRlLnNob3dXYWxscGFwZXIgPyA8V2FsbHBhcGVyIGluZGV4PXt0aGlzLnN0YXRlLndhbGxwYXBlckluZGV4fSBtZXNzYWdlcz17dGhpcy5tZXNzYWdlc30gLz4gOiBudWxsIH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5yZW5kZXIoPE5ld1RhYiAvPiwgZG9jdW1lbnQuYm9keSlcbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcGVuV2Vic2l0ZSBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSAnb3Blbi13ZWJzaXRlJ1xuICAgIHRoaXMucGlubmVkID0gdHJ1ZVxuICAgIHRoaXMudGl0bGUgPSAnJ1xuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5ICYmIHF1ZXJ5Lmxlbmd0aCA+IDEgJiYgL15bXFx3XFwuXSskL2kudGVzdChxdWVyeSlcbiAgfVxuXG4gIGZhaWwoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgY29uc3Qgb3F1ZXJ5ID0gcXVlcnkgfHwgdGhpcy5yZXN1bHRzLnByb3BzLnF1ZXJ5XG5cbiAgICB0aGlzLnJlc3VsdHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtd2Vic2l0ZScsIHF1ZXJ5IH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKG9xdWVyeSAhPT0gdGhpcy5yZXN1bHRzLnByb3BzLnF1ZXJ5LnRyaW0oKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLmZhaWwocmVzcC5lcnJvcilcblxuICAgICAgdGhpcy5hZGQocmVzcC5jb250ZW50LnJlc3VsdHMubGlrZXMuc2xpY2UoMCwgMSkpXG4gICAgfSlcbiAgfVxufVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5pbXBvcnQgdGl0bGVGcm9tVVJMIGZyb20gXCJ0aXRsZS1mcm9tLXVybFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5U3VnZ2VzdGlvbnMgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gJ3F1ZXJ5LXN1Z2dlc3Rpb25zJ1xuICAgIHRoaXMucGlubmVkID0gdHJ1ZVxuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5Lmxlbmd0aCA+IDEgJiYgcXVlcnkudHJpbSgpLmxlbmd0aCA+IDFcbiAgfVxuXG4gIGNyZWF0ZVVSTFN1Z2dlc3Rpb25zKHF1ZXJ5KSB7XG4gICAgaWYgKCFpc1VSTChxdWVyeSkpIHJldHVybiBbXVxuXG4gICAgY29uc3QgdXJsID0gL1xcdys6XFwvXFwvLy50ZXN0KHF1ZXJ5KSA/IHF1ZXJ5IDogJ2h0dHA6Ly8nICsgcXVlcnlcblxuICAgIHJldHVybiBbe1xuICAgICAgdGl0bGU6IGBPcGVuIFwiJHt0aXRsZUZyb21VUkwocXVlcnkpfVwiYCxcbiAgICAgIHR5cGU6ICdxdWVyeS1zdWdnZXN0aW9uJyxcbiAgICAgIHVybFxuICAgIH1dXG4gIH1cblxuICBjcmVhdGVTZWFyY2hTdWdnZXN0aW9ucyhxdWVyeSkge1xuICAgIGlmIChpc1VSTChxdWVyeSkpIHJldHVybiBbXVxuICAgIGlmIChxdWVyeS5pbmRleE9mKCd0YWc6JykgPT09IDAgJiYgcXVlcnkubGVuZ3RoID4gNCkgcmV0dXJuIFt7XG4gICAgICB1cmw6ICdodHRwczovL2dldGtvem1vcy5jb20vdGFnLycgKyBlbmNvZGVVUkkocXVlcnkuc2xpY2UoNCkpLFxuICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgdGl0bGU6IGBPcGVuIFwiJHtxdWVyeS5zbGljZSg0KX1cIiB0YWcgaW4gS296bW9zYCxcbiAgICAgIHR5cGU6ICdzZWFyY2gtcXVlcnknXG4gICAgfV1cblxuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vZ29vZ2xlLmNvbS9zZWFyY2g/cT0nICsgZW5jb2RlVVJJKHF1ZXJ5KSxcbiAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICB0aXRsZTogYFNlYXJjaCBcIiR7cXVlcnl9XCIgb24gR29vZ2xlYCxcbiAgICAgICAgdHlwZTogJ3NlYXJjaC1xdWVyeSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vZ2V0a296bW9zLmNvbS9zZWFyY2g/cT0nICsgZW5jb2RlVVJJKHF1ZXJ5KSxcbiAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICB0aXRsZTogYFNlYXJjaCBcIiR7cXVlcnl9XCIgb24gS296bW9zYCxcbiAgICAgICAgdHlwZTogJ3NlYXJjaC1xdWVyeSdcbiAgICAgIH1cbiAgICBdXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICB0aGlzLmFkZCh0aGlzLmNyZWF0ZVVSTFN1Z2dlc3Rpb25zKHF1ZXJ5KS5jb25jYXQodGhpcy5jcmVhdGVTZWFyY2hTdWdnZXN0aW9ucyhxdWVyeSkpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzVVJMIChxdWVyeSkge1xuICByZXR1cm4gcXVlcnkudHJpbSgpLmluZGV4T2YoJy4nKSA+IDAgJiYgcXVlcnkuaW5kZXhPZignICcpID09PSAtMVxufVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY2VudEJvb2ttYXJrcyBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSAncmVjZW50LWJvb2ttYXJrcydcbiAgICB0aGlzLnRpdGxlID0gJ1JlY2VudGx5IExpa2VkIGluIEtvem1vcydcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeS5sZW5ndGggPT09IDBcbiAgfVxuXG4gIGZhaWwoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICB0aGlzLnJlc3VsdHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtcmVjZW50LWJvb2ttYXJrcycsIHF1ZXJ5IH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLmZhaWwocmVzcC5lcnJvcilcbiAgICAgIHRoaXMuYWRkKHJlc3AuY29udGVudC5yZXN1bHRzLmxpa2VzKVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5cbmltcG9ydCBUb3BTaXRlcyBmcm9tIFwiLi90b3Atc2l0ZXNcIlxuaW1wb3J0IFJlY2VudEJvb2ttYXJrcyBmcm9tIFwiLi9yZWNlbnQtYm9va21hcmtzXCJcbmltcG9ydCBRdWVyeVN1Z2dlc3Rpb25zIGZyb20gXCIuL3F1ZXJ5LXN1Z2dlc3Rpb25zXCJcbmltcG9ydCBCb29rbWFya1NlYXJjaCBmcm9tIFwiLi9ib29rbWFyay1zZWFyY2hcIlxuaW1wb3J0IEhpc3RvcnkgZnJvbSBcIi4vaGlzdG9yeVwiXG5pbXBvcnQgQm9va21hcmtUYWdzIGZyb20gXCIuL2Jvb2ttYXJrLXRhZ3NcIlxuXG5pbXBvcnQgU2lkZWJhciBmcm9tIFwiLi9zaWRlYmFyXCJcbmltcG9ydCBUYWdiYXIgZnJvbSBcIi4vdGFnYmFyXCJcbmltcG9ydCBNZXNzYWdpbmcgZnJvbSBcIi4vbWVzc2FnaW5nXCJcbmltcG9ydCBVUkxJY29uIGZyb20gXCIuL3VybC1pY29uXCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuaW1wb3J0IE9wZW5XZWJzaXRlIGZyb20gJy4vb3Blbi13ZWJzaXRlJ1xuXG5jb25zdCBNQVhfSVRFTVMgPSA1XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3VsdHMgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWVzc2FnaW5nKClcblxuICAgIHRoaXMuc2V0Q2F0ZWdvcmllcyhwcm9wcylcblxuICAgIHRoaXMuX29uS2V5UHJlc3MgPSBkZWJvdW5jZSh0aGlzLm9uS2V5UHJlc3MuYmluZCh0aGlzKSwgNTApXG4gICAgdGhpcy51cGRhdGUocHJvcHMucXVlcnkgfHwgXCJcIilcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAocHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QgIT09IHRoaXMucHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QpIHtcbiAgICAgIHRoaXMuc2V0Q2F0ZWdvcmllcyhwcm9wcylcbiAgICB9XG4gIH1cblxuICBzZXRDYXRlZ29yaWVzKHByb3BzKSB7XG4gICAgY29uc3QgY2F0ZWdvcmllcyA9IFtcbiAgICAgIG5ldyBPcGVuV2Vic2l0ZSh0aGlzLCAxKSxcbiAgICAgIG5ldyBRdWVyeVN1Z2dlc3Rpb25zKHRoaXMsIDIpLFxuICAgICAgbmV3IFRvcFNpdGVzKHRoaXMsIHByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0ID8gNCA6IDMpLFxuICAgICAgbmV3IFJlY2VudEJvb2ttYXJrcyh0aGlzLCBwcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdCA/IDMgOiA0KSxcbiAgICAgIG5ldyBCb29rbWFya1RhZ3ModGhpcywgNSksXG4gICAgICBuZXcgQm9va21hcmtTZWFyY2godGhpcywgNiksXG4gICAgICBuZXcgSGlzdG9yeSh0aGlzLCA3KVxuICAgIF1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY2F0ZWdvcmllc1xuICAgIH0pXG5cbiAgICB0aGlzLnVwZGF0ZShwcm9wcy5xdWVyeSB8fCBcIlwiKVxuICB9XG5cbiAgYWRkUm93cyhjYXRlZ29yeSwgcm93cykge1xuICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgICBjb25zdCB1cmxNYXAgPSB7fVxuICAgIGxldCBpID0gdGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHVybE1hcFt0aGlzLnN0YXRlLmNvbnRlbnRbaV0udXJsXSA9IHRydWVcbiAgICB9XG5cbiAgICBsZXQgdGFncyA9IHRoaXMuc3RhdGUudGFnc1xuICAgIGkgPSByb3dzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAocm93c1tpXS50YWdzKSB7XG4gICAgICAgIHRhZ3MgPSB0YWdzLmNvbmNhdChyb3dzW2ldLnRhZ3MpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGFncyA9IHRhZ3MuZmlsdGVyKHQgPT4gJ3RhZzonICsgdCAhPT0gdGhpcy5wcm9wcy5xdWVyeSlcblxuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnRyaW0odGhpcy5zdGF0ZS5jb250ZW50LmNvbmNhdChyb3dzLmZpbHRlcihyID0+ICF1cmxNYXBbci51cmxdKS5tYXAoKHIsIGkpID0+IHtcbiAgICAgIHIuY2F0ZWdvcnkgPSBjYXRlZ29yeVxuICAgICAgci5pbmRleCA9IHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGggKyBpXG4gICAgICByZXR1cm4gclxuICAgIH0pKSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY29udGVudCxcbiAgICAgIHRhZ3NcbiAgICB9KVxuICB9XG5cbiAgY29udGVudCgpIHtcbiAgICBsZXQgY29udGVudCA9IHRoaXMuc3RhdGUuY29udGVudFxuICAgIGNvbnRlbnQuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEuY2F0ZWdvcnkuc29ydCA8IGIuY2F0ZWdvcnkuc29ydCkgcmV0dXJuIC0xXG4gICAgICBpZiAoYS5jYXRlZ29yeS5zb3J0ID4gYi5jYXRlZ29yeS5zb3J0KSByZXR1cm4gMVxuXG4gICAgICBpZiAoYS5pbmRleCA8IGIuaW5kZXgpIHJldHVybiAtMVxuICAgICAgaWYgKGEuaW5kZXggPiBiLmluZGV4KSByZXR1cm4gMVxuXG4gICAgICByZXR1cm4gMFxuICAgIH0pXG5cbiAgICByZXR1cm4gY29udGVudC5tYXAoKHJvdywgaW5kZXgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVybDogcm93LnVybCxcbiAgICAgICAgdGl0bGU6IHJvdy50aXRsZSxcbiAgICAgICAgaW1hZ2VzOiByb3cuaW1hZ2VzLFxuICAgICAgICB0eXBlOiByb3cuY2F0ZWdvcnkubmFtZSxcbiAgICAgICAgY2F0ZWdvcnk6IHJvdy5jYXRlZ29yeSxcbiAgICAgICAgYWJzSW5kZXg6IGluZGV4LFxuICAgICAgICBpbmRleFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjb250ZW50QnlDYXRlZ29yeSgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5jb250ZW50KClcbiAgICBjb25zdCBzZWxlY3RlZENhdGVnb3J5ID0gdGhpcy5zdGF0ZS5zZWxlY3RlZCA/IGNvbnRlbnRbdGhpcy5zdGF0ZS5zZWxlY3RlZF0uY2F0ZWdvcnkgOiBjb250ZW50WzBdLmNhdGVnb3J5XG4gICAgY29uc3QgY2F0ZWdvcmllcyA9IFtdXG4gICAgY29uc3QgY2F0ZWdvcmllc01hcCA9IHt9XG5cbiAgICBsZXQgdGFiSW5kZXggPSAyXG4gICAgbGV0IGNhdGVnb3J5ID0gbnVsbFxuICAgIGNvbnRlbnQuZm9yRWFjaCgocm93LCBpbmQpID0+IHtcbiAgICAgIGlmICghY2F0ZWdvcnkgfHwgY2F0ZWdvcnkubmFtZSAhPT0gcm93LmNhdGVnb3J5Lm5hbWUpIHtcbiAgICAgICAgY2F0ZWdvcnkgPSByb3cuY2F0ZWdvcnlcbiAgICAgICAgY2F0ZWdvcmllc01hcFtjYXRlZ29yeS5uYW1lXSA9IHtcbiAgICAgICAgICB0aXRsZTogY2F0ZWdvcnkudGl0bGUsXG4gICAgICAgICAgbmFtZTogY2F0ZWdvcnkubmFtZSxcbiAgICAgICAgICBzb3J0OiBjYXRlZ29yeS5zb3J0LFxuICAgICAgICAgIGNvbGxhcHNlZDogY29udGVudC5sZW5ndGggPj0gTUFYX0lURU1TICYmIHNlbGVjdGVkQ2F0ZWdvcnkubmFtZSAhPSBjYXRlZ29yeS5uYW1lICYmICEhY2F0ZWdvcnkudGl0bGUsXG4gICAgICAgICAgcm93czogW11cbiAgICAgICAgfVxuXG4gICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yaWVzTWFwW2NhdGVnb3J5Lm5hbWVdKVxuXG4gICAgICAgIHJvdy50YWJJbmRleCA9ICsrdGFiSW5kZXhcbiAgICAgIH1cblxuICAgICAgY2F0ZWdvcmllc01hcFtjYXRlZ29yeS5uYW1lXS5yb3dzLnB1c2gocm93KVxuICAgIH0pXG5cbiAgICByZXR1cm4gY2F0ZWdvcmllc1xuICB9XG5cbiAgdHJpbShjb250ZW50KSB7XG4gICAgY29uc3QgY2F0ZWdvcnlDb3VudHMgPSB7fVxuICAgIGNvbnN0IHBpbm5lZENvdW50ID0gdGhpcy5waW5uZWRSb3dDb3VudCgpXG5cbiAgICBjb250ZW50ID0gY29udGVudC5maWx0ZXIociA9PiB7XG4gICAgICBpZiAoIWNhdGVnb3J5Q291bnRzW3IuY2F0ZWdvcnkubmFtZV0pIHtcbiAgICAgICAgY2F0ZWdvcnlDb3VudHNbci5jYXRlZ29yeS5uYW1lXSA9IDBcbiAgICAgIH1cblxuICAgICAgY2F0ZWdvcnlDb3VudHNbci5jYXRlZ29yeS5uYW1lXSsrXG5cbiAgICAgIHJldHVybiByLmNhdGVnb3J5LnBpbm5lZCB8fCBNQVhfSVRFTVMgLSBwaW5uZWRDb3VudCA+PSBjYXRlZ29yeUNvdW50c1tyLmNhdGVnb3J5Lm5hbWVdXG4gICAgfSlcblxuICAgIHJldHVybiBjb250ZW50XG4gIH1cblxuICBwaW5uZWRSb3dDb3VudChjb250ZW50KSB7XG4gICAgY29udGVudCB8fCAoY29udGVudCA9IHRoaXMuc3RhdGUuY29udGVudClcbiAgICBjb25zdCBsZW4gPSBjb250ZW50Lmxlbmd0aFxuXG4gICAgbGV0IGN0ciA9IDBcbiAgICBsZXQgaSA9IC0xXG4gICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgaWYgKGNvbnRlbnRbaV0uY2F0ZWdvcnkucGlubmVkKSB7XG4gICAgICAgIGN0cisrXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGN0clxuICB9XG5cbiAgcmVzZXQocXVlcnkpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOiAwLFxuICAgICAgY29udGVudDogW10sXG4gICAgICB0YWdzOiBbXSxcbiAgICAgIGVycm9yczogW10sXG4gICAgICBxdWVyeTogcXVlcnkgfHwgJydcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSAocXVlcnkgfHwgXCJcIikudHJpbSgpXG4gICAgdGhpcy5yZXNldCgpXG4gICAgdGhpcy5zdGF0ZS5jYXRlZ29yaWVzLmZvckVhY2goYyA9PiBjLm9uTmV3UXVlcnkocXVlcnkpKVxuICB9XG5cbiAgc2VsZWN0KGluZGV4KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZDogaW5kZXhcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0TmV4dCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOiAodGhpcy5zdGF0ZS5zZWxlY3RlZCArIDEpICUgdGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aFxuICAgIH0pXG4gIH1cblxuICBzZWxlY3RQcmV2aW91cygpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOiB0aGlzLnN0YXRlLnNlbGVjdGVkID09IDAgPyB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoIC0gMSA6IHRoaXMuc3RhdGUuc2VsZWN0ZWQgLSAxXG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdE5leHRDYXRlZ29yeSgpIHtcbiAgICBsZXQgY3VycmVudENhdGVnb3J5ID0gdGhpcy5zdGF0ZS5jb250ZW50W3RoaXMuc3RhdGUuc2VsZWN0ZWRdLmNhdGVnb3J5XG5cbiAgICBjb25zdCBsZW4gPSB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoXG4gICAgbGV0IGkgPSB0aGlzLnN0YXRlLnNlbGVjdGVkXG4gICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuY29udGVudFtpXS5jYXRlZ29yeS5zb3J0ICE9PSBjdXJyZW50Q2F0ZWdvcnkuc29ydCkge1xuICAgICAgICB0aGlzLnNlbGVjdChpKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5jb250ZW50WzBdLmNhdGVnb3J5LnNvcnQgIT09IGN1cnJlbnRDYXRlZ29yeS5zb3J0KSB7XG4gICAgICB0aGlzLnNlbGVjdCgwKVxuICAgIH1cbiAgfVxuXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgIGlmIChuZXh0UHJvcHMucXVlcnkgIT09IHRoaXMucHJvcHMucXVlcnkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG5leHRTdGF0ZS5jb250ZW50Lmxlbmd0aCAhPT0gdGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobmV4dFN0YXRlLnNlbGVjdGVkICE9PSB0aGlzLnN0YXRlLnNlbGVjdGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChuZXh0UHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QgIT09IHRoaXMucHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fb25LZXlQcmVzcywgZmFsc2UpXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9vbktleVByZXNzLCBmYWxzZSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAocHJvcHMucXVlcnkgIT09IHRoaXMucHJvcHMucXVlcnkpIHtcbiAgICAgIHRoaXMudXBkYXRlKHByb3BzLnF1ZXJ5IHx8IFwiXCIpXG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0ICE9PSB0aGlzLnByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0KSB7XG4gICAgICB0aGlzLnNldENhdGVnb3JpZXMocHJvcHMpXG4gICAgfVxuXG4gIH1cblxuICBuYXZpZ2F0ZVRvKHVybCkge1xuICAgIGlmICghL15cXHcrOlxcL1xcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSAnaHR0cDovLycgKyB1cmxcbiAgICB9XG5cbiAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gdXJsXG4gIH1cblxuICBvbktleVByZXNzKGUpIHtcbiAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7IC8vIGVudGVyXG4gICAgICB0aGlzLm5hdmlnYXRlVG8odGhpcy5zdGF0ZS5jb250ZW50W3RoaXMuc3RhdGUuc2VsZWN0ZWRdLnVybClcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSA0MCkgeyAvLyBkb3duIGFycm93XG4gICAgICB0aGlzLnNlbGVjdE5leHQoKVxuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDM4KSB7IC8vIHVwIGFycm93XG4gICAgICB0aGlzLnNlbGVjdFByZXZpb3VzKClcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSA5KSB7IC8vIHRhYiBrZXlcbiAgICAgIHRoaXMuc2VsZWN0TmV4dENhdGVnb3J5KClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUua2V5Q29kZSA9PSAzNykge1xuICAgICAgdGhpcy5wcm9wcy5wcmV2V2FsbHBhcGVyKClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH0gZWxzZSBpZihlLmN0cmxLZXkgJiYgZS5rZXlDb2RlID09IDM5KSB7XG4gICAgICB0aGlzLnByb3BzLm5leHRXYWxscGFwZXIoKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuY291bnRlciA9IDBcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YHJlc3VsdHMgJHt0aGlzLnN0YXRlLnRhZ3MubGVuZ3RoID8gXCJoYXMtdGFnc1wiIDogXCJcIn1gfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaW5rc1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzdWx0cy1jYXRlZ29yaWVzXCI+XG4gICAgICAgICAgICB7dGhpcy5jb250ZW50QnlDYXRlZ29yeSgpLm1hcChjYXRlZ29yeSA9PiB0aGlzLnJlbmRlckNhdGVnb3J5KGNhdGVnb3J5KSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFNpZGViYXIgb25DaGFuZ2U9eygpID0+IHRoaXMudXBkYXRlKCl9IHNlbGVjdGVkPXt0aGlzLmNvbnRlbnQoKVt0aGlzLnN0YXRlLnNlbGVjdGVkXX0gbWVzc2FnZXM9e3RoaXMubWVzc2FnZXN9IG9uVXBkYXRlVG9wU2l0ZXM9eygpID0+IHRoaXMub25VcGRhdGVUb3BTaXRlcygpfSB1cGRhdGVGbj17KCkgPT4gdGhpcy51cGRhdGUodGhpcy5wcm9wcy5xdWVyeSB8fCBcIlwiKX0gLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8VGFnYmFyIHF1ZXJ5PXt0aGlzLnByb3BzLnF1ZXJ5fSBvcGVuVGFnPXt0aGlzLnByb3BzLm9wZW5UYWd9IGNvbnRlbnQ9e3RoaXMuc3RhdGUudGFnc30gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNhdGVnb3J5KGMpIHtcbiAgICBjb25zdCBvdmVyZmxvdyA9IGMuY29sbGFwc2VkICYmIHRoaXMuc3RhdGUuY29udGVudFt0aGlzLnN0YXRlLnNlbGVjdGVkXS5jYXRlZ29yeS5zb3J0IDwgYy5zb3J0ICYmIHRoaXMuY291bnRlciA8IE1BWF9JVEVNUyA/IGMucm93cy5zbGljZSgwLCBNQVhfSVRFTVMgLSB0aGlzLmNvdW50ZXIpIDogW11cbiAgICBjb25zdCBjb2xsYXBzZWQgPSBjLnJvd3Muc2xpY2Uob3ZlcmZsb3cubGVuZ3RoLCBNQVhfSVRFTVMpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BjYXRlZ29yeSAke2MuY29sbGFwc2VkID8gXCJjb2xsYXBzZWRcIiA6IFwiXCJ9YH0+XG4gICAgICAgIHt0aGlzLnJlbmRlckNhdGVnb3J5VGl0bGUoYyl9XG4gICAgICAgIHtvdmVyZmxvdy5sZW5ndGggPiAwID8gPGRpdiBjbGFzc05hbWU9J2NhdGVnb3J5LXJvd3Mgb3ZlcmZsb3cnPlxuICAgICAgICAgIHtvdmVyZmxvdy5tYXAoKHJvdykgPT4gdGhpcy5yZW5kZXJSb3cocm93KSl9XG4gICAgICAgIDwvZGl2PiA6IG51bGx9XG4gICAgICAgICB7Y29sbGFwc2VkLmxlbmd0aCA+IDAgPyA8ZGl2IGNsYXNzTmFtZT0nY2F0ZWdvcnktcm93cyc+XG4gICAgICAgICAgICB7Y29sbGFwc2VkLm1hcCgocm93KSA9PiB0aGlzLnJlbmRlclJvdyhyb3cpKX1cbiAgICAgICAgIDwvZGl2PiA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDYXRlZ29yeVRpdGxlKGMpIHtcbiAgICBpZiAoIWMudGl0bGUpIHJldHVyblxuXG4gICAgbGV0IHRpdGxlID0gYy50aXRsZVxuICAgIGlmICh0eXBlb2YgdGl0bGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRpdGxlID0gYy50aXRsZSh0aGlzLnByb3BzLnF1ZXJ5KVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgIDxoMSBvbkNsaWNrPXsoKSA9PiB0aGlzLnNlbGVjdChjLnJvd3NbMF0uYWJzSW5kZXgpfT5cbiAgICAgICAgICA8SWNvbiBzdHJva2U9XCIzXCIgbmFtZT1cInJpZ2h0Q2hldnJvblwiIC8+XG4gICAgICAgICAge3RpdGxlfVxuICAgICAgICA8L2gxPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUm93KHJvdykge1xuICAgIHRoaXMuY291bnRlcisrXG5cbiAgICByZXR1cm4gKFxuICAgICAgPFVSTEljb24gY29udGVudD17cm93fSBvblNlbGVjdD17ciA9PiB0aGlzLnNlbGVjdChyLmluZGV4KX0gc2VsZWN0ZWQ9e3RoaXMuc3RhdGUuc2VsZWN0ZWQgPT0gcm93LmluZGV4fSAvPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IFVSTEljb24gZnJvbSBcIi4vdXJsLWljb25cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHRoaXMucmVzdWx0cyA9IHJlc3VsdHNcbiAgICB0aGlzLnNvcnQgPSBzb3J0XG4gIH1cblxuICBhZGQocm93cykge1xuICAgIHRoaXMucmVzdWx0cy5hZGRSb3dzKHRoaXMsIHJvd3MpXG4gIH1cblxuICBvbk5ld1F1ZXJ5KHF1ZXJ5KSB7XG4gICAgdGhpcy5sYXRlc3RRdWVyeSA9IHF1ZXJ5XG5cbiAgICBpZiAodGhpcy5zaG91bGRCZU9wZW4ocXVlcnkpKSB7XG4gICAgICB0aGlzLnVwZGF0ZShxdWVyeSlcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaElucHV0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmFsdWU6ICcnXG4gICAgfSlcblxuICAgIHRoaXMuX29uQ2xpY2sgPSB0aGlzLm9uQ2xpY2suYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmIChwcm9wcy52YWx1ZSAmJiBwcm9wcy52YWx1ZS50cmltKCkgIT09IHRoaXMuc3RhdGUudmFsdWUudHJpbSgpKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdmFsdWU6IHByb3BzLnZhbHVlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG9uQmx1cigpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZm9jdXNlZCkgcmV0dXJuXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvY3VzZWQ6IGZhbHNlXG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMub25CbHVyKClcbiAgfVxuXG4gIG9uRm9jdXMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZm9jdXNlZCkgcmV0dXJuXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvY3VzZWQ6IHRydWVcbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy5vbkZvY3VzKClcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGlmICh0aGlzLmlucHV0KSB7XG4gICAgICB0aGlzLmlucHV0LmZvY3VzKClcbiAgICB9XG4gIH1cblxuICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICByZXR1cm4gbmV4dFN0YXRlLnZhbHVlICE9PSB0aGlzLnN0YXRlLnZhbHVlXG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25DbGljaylcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uQ2xpY2spXG4gIH1cblxuICBvbkNsaWNrKGUpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS52YWx1ZSA9PT0gJycgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50LXdyYXBwZXIgLmNvbnRlbnQnKS5jb250YWlucyhlLnRhcmdldCkgJiYgIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYnV0dG9uJykpIHtcbiAgICAgIHRoaXMub25CbHVyKClcbiAgICB9XG4gIH1cblxuICBvblF1ZXJ5Q2hhbmdlKHZhbHVlLCBrZXlDb2RlLCBldmVudCkge1xuICAgIGlmICh2YWx1ZS50cmltKCkgIT09IFwiXCIpIHtcbiAgICAgIHRoaXMub25Gb2N1cygpXG4gICAgfVxuXG4gICAgaWYgKGtleUNvZGUgPT09IDEzKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5vblByZXNzRW50ZXIodmFsdWUpXG4gICAgfVxuXG4gICAgaWYgKGtleUNvZGUgPT09IDI3KSB7XG4gICAgICByZXR1cm4gdGhpcy5vbkJsdXIoKVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZSB9KVxuXG4gICAgaWYgKHRoaXMucXVlcnlDaGFuZ2VUaW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5xdWVyeUNoYW5nZVRpbWVyKVxuICAgICAgdGhpcy5xdWVyeUNoYW5nZVRpbWVyID0gMDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vblF1ZXJ5Q2hhbmdlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uUXVlcnlDaGFuZ2UodmFsdWUpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlYXJjaC1pbnB1dFwiPlxuICAgICAgICB7dGhpcy5yZW5kZXJJY29uKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlcklucHV0KCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJJY29uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8SWNvbiBuYW1lPVwic2VhcmNoXCIgb25jbGljaz17KCkgPT4gdGhpcy5pbnB1dC5mb2N1cygpfSAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlcklucHV0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8aW5wdXQgdGFiaW5kZXg9XCIxXCJcbiAgICAgICAgcmVmPXtlbCA9PiB0aGlzLmlucHV0ID0gZWx9XG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXRcIlxuICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBvciBlbnRlciB3ZWJzaXRlIG5hbWUuXCJcbiAgICAgICAgb25Gb2N1cz17ZSA9PiB0aGlzLm9uRm9jdXMoKX1cbiAgICAgICAgb25DaGFuZ2U9e2UgPT4gdGhpcy5vblF1ZXJ5Q2hhbmdlKGUudGFyZ2V0LnZhbHVlLCB1bmRlZmluZWQsICdjaGFuZ2UnKX1cbiAgICAgICAgb25LZXlVcD17ZSA9PiB0aGlzLm9uUXVlcnlDaGFuZ2UoZS50YXJnZXQudmFsdWUsIGUua2V5Q29kZSwgJ2tleSB1cCcpfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLm9uRm9jdXMoKX1cbiAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9IC8+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuaW1wb3J0IENvbnRlbnQgZnJvbSBcIi4vY29udGVudFwiXG5pbXBvcnQgU2VhcmNoSW5wdXQgZnJvbSBcIi4vc2VhcmNoLWlucHV0XCJcbmltcG9ydCBSZXN1bHRzIGZyb20gXCIuL3Jlc3VsdHNcIlxuaW1wb3J0IE1lc3NhZ2luZyBmcm9tIFwiLi9tZXNzYWdpbmdcIlxuaW1wb3J0IEdyZWV0aW5nIGZyb20gXCIuL2dyZWV0aW5nXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1lc3NhZ2luZygpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlkOiAwLFxuICAgICAgcm93czoge30sXG4gICAgICByb3dzQXZhaWxhYmxlOiA1LFxuICAgICAgcXVlcnk6ICcnLFxuICAgICAgZm9jdXNlZDogZmFsc2VcbiAgICB9KVxuXG4gICAgdGhpcy5fb25RdWVyeUNoYW5nZSA9IGRlYm91bmNlKHRoaXMub25RdWVyeUNoYW5nZS5iaW5kKHRoaXMpLCA1MClcbiAgfVxuXG4gIGlkKCkge1xuICAgIHJldHVybiArK3RoaXMuc3RhdGUuaWRcbiAgfVxuXG4gIG9uRm9jdXMoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c2VkOiB0cnVlXG4gICAgfSlcbiAgfVxuXG4gIG9uQmx1cigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvY3VzZWQ6IGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIG9uUHJlc3NFbnRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZCkge1xuICAgICAgdGhpcy5uYXZpZ2F0ZVRvKHRoaXMuc3RhdGUuc2VsZWN0ZWQudXJsKVxuICAgIH1cbiAgfVxuXG4gIG9uU2VsZWN0KHJvdykge1xuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkICYmIHRoaXMuc3RhdGUuc2VsZWN0ZWQuaWQgPT09IHJvdy5pZCkgcmV0dXJuXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOiByb3dcbiAgICB9KVxuICB9XG5cbiAgb25RdWVyeUNoYW5nZShxdWVyeSkge1xuICAgIHF1ZXJ5ID0gcXVlcnkudHJpbSgpXG5cbiAgICBpZiAocXVlcnkgPT09IHRoaXMuc3RhdGUucXVlcnkpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByb3dzOiB7fSxcbiAgICAgIHJvd3NBdmFpbGFibGU6IDUsXG4gICAgICBzZWxlY3RlZDogbnVsbCxcbiAgICAgIGlkOiAwLFxuICAgICAgcXVlcnlcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Q29udGVudCB3YWxscGFwZXI9e3RoaXMucHJvcHMud2FsbHBhcGVyfSBmb2N1c2VkPXt0aGlzLnN0YXRlLmZvY3VzZWR9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnQtaW5uZXJcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5lbmFibGVHcmVldGluZyA/IDxHcmVldGluZyBuYW1lPXt0aGlzLnN0YXRlLnVzZXJuYW1lfSBtZXNzYWdlcz17dGhpcy5tZXNzYWdlc30gLz4gOiBudWxsfVxuICAgICAgICAgIDxTZWFyY2hJbnB1dCBvblByZXNzRW50ZXI9eygpID0+IHRoaXMub25QcmVzc0VudGVyKCl9XG4gICAgICAgICAgICBvblF1ZXJ5Q2hhbmdlPXt0aGlzLl9vblF1ZXJ5Q2hhbmdlfVxuICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gdGhpcy5vbkZvY3VzKCl9XG4gICAgICAgICAgICBvbkJsdXI9eygpID0+IHRoaXMub25CbHVyKCl9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5xdWVyeX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8UmVzdWx0cyByZWNlbnRCb29rbWFya3NGaXJzdD17dGhpcy5wcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdH0gbmV4dFdhbGxwYXBlcj17dGhpcy5wcm9wcy5uZXh0V2FsbHBhcGVyfSBwcmV2V2FsbHBhcGVyPXt0aGlzLnByb3BzLnByZXZXYWxscGFwZXJ9IG9wZW5UYWc9e3RhZyA9PiB0aGlzLl9vblF1ZXJ5Q2hhbmdlKCd0YWc6JyArIHRhZyl9IGZvY3VzZWQ9e3RoaXMuc3RhdGUuZm9jdXNlZH0gcXVlcnk9e3RoaXMuc3RhdGUucXVlcnl9IC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Db250ZW50PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclJlc3VsdHMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzdWx0c1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHMtcm93c1wiPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhclwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbn1cblxuZnVuY3Rpb24gc29ydExpa2VzKGEsIGIpIHtcbiAgaWYgKGEubGlrZWRfYXQgPCBiLmxpa2VkX2F0KSByZXR1cm4gMVxuICBpZiAoYS5saWtlZF9hdCA+IGIubGlrZWRfYXQpIHJldHVybiAtMVxuICByZXR1cm4gMFxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcbmltcG9ydCBzZWN0aW9ucyBmcm9tICcuLi9jaHJvbWUvc2V0dGluZ3Mtc2VjdGlvbnMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmdzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHNlY3Rpb25zLmZvckVhY2gocyA9PiB0aGlzLmxvYWRTZWN0aW9uKHMpKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpIHtcbiAgICBzZWN0aW9ucy5mb3JFYWNoKHMgPT4gdGhpcy5sb2FkU2VjdGlvbihzKSlcbiAgfVxuXG4gIGxvYWRTZWN0aW9uKHMpIHtcbiAgICB0aGlzLnByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LXNldHRpbmdzLXZhbHVlJywga2V5OiBzLmtleSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5vbkVycm9yKHJlc3AuZXJyb3IpXG4gICAgICBjb25zdCB1ID0ge31cbiAgICAgIHVbcy5rZXldID0gcmVzcC5jb250ZW50LnZhbHVlXG4gICAgICB0aGlzLnNldFN0YXRlKHUpXG4gICAgfSlcbiAgfVxuXG4gIG9uQ2hhbmdlKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgdGhpcy5wcm9wcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ3NldC1zZXR0aW5ncy12YWx1ZScsIGtleTogb3B0aW9ucy5rZXksIHZhbHVlIH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLm9uRXJyb3IocmVzcC5lcnJvcilcblxuICAgICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG9uRXJyb3IoZXJyb3IpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVycm9yXG4gICAgfSlcblxuICAgIGlmICh0aGlzLnByb3BzLm9uRXJyb3IpIHtcbiAgICAgIHRoaXMucHJvcHMub25FcnJvcihlcnJvcilcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2V0dGluZ3MgJHt0aGlzLnN0YXRlLm9wZW4gPyBcIm9wZW5cIiA6IFwiXCJ9YH0+XG4gICAgICAgIDxJY29uIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBvcGVuOiB0cnVlIH0pfSBuYW1lPVwic2V0dGluZ3NcIiAvPlxuICAgICAgICB7dGhpcy5yZW5kZXJTZXR0aW5ncygpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPlxuICAgICAgICB7dGhpcy5yZW5kZXJDbG9zZUJ1dHRvbigpfVxuICAgICAgICA8aDE+U2V0dGluZ3M8L2gxPlxuICAgICAgICA8aDI+R290IGZlZWRiYWNrIC8gcmVjb21tZW5kYXRpb24gPyA8YSBocmVmPVwibWFpbHRvOmF6ZXJAZ2V0a296bW9zLmNvbVwiPmZlZWRiYWNrPC9hPiBhbnl0aW1lLjwvaDI+XG4gICAgICAgIHt0aGlzLnJlbmRlclNlY3Rpb25zKCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyXCI+XG4gICAgICAgICAgPGJ1dHRvbiBvbmNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgb3BlbjogZmFsc2UgfSl9PlxuICAgICAgICAgICAgRG9uZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNlY3Rpb25zKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlY3Rpb25zXCI+XG4gICAgICAgIHtzZWN0aW9ucy5tYXAocyA9PiB0aGlzLnJlbmRlclNlY3Rpb24ocykpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2VjdGlvbihvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMucHJvcHMudHlwZSAmJiAhb3B0aW9uc1t0aGlzLnByb3BzLnR5cGVdKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPXtgc2V0dGluZyAke29wdGlvbnMua2V5fWB9PlxuICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiY2hlY2tib3hcIiBpZD17b3B0aW9ucy5rZXl9IG5hbWU9e29wdGlvbnMua2V5fSB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXt0aGlzLnN0YXRlW29wdGlvbnMua2V5XX0gb25DaGFuZ2U9e2UgPT4gdGhpcy5vbkNoYW5nZShlLnRhcmdldC5jaGVja2VkLCBvcHRpb25zKX0gLz5cbiAgICAgICAgPGxhYmVsIHRpdGxlPXtvcHRpb25zLmRlc2N9IGh0bWxGb3I9e29wdGlvbnMua2V5fT57b3B0aW9ucy50aXRsZX08L2xhYmVsPlxuICAgICAgICA8cD57b3B0aW9ucy5kZXNjfTwvcD5cbiAgICAgIDwvc2VjdGlvbj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDbG9zZUJ1dHRvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEljb24gc3Ryb2tlPVwiM1wiIG5hbWU9XCJjbG9zZVwiIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBvcGVuOiBmYWxzZSB9KX0gLz5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IHsgY2xlYW4gYXMgY2xlYW5VUkwgfSBmcm9tIFwidXJsc1wiXG5pbXBvcnQgcmVsYXRpdmVEYXRlIGZyb20gXCJyZWxhdGl2ZS1kYXRlXCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuaW1wb3J0IFVSTEltYWdlIGZyb20gXCIuL3VybC1pbWFnZVwiXG5pbXBvcnQgeyBoaWRlIGFzIGhpZGVUb3BTaXRlIH0gZnJvbSAnLi90b3Atc2l0ZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGViYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKCFwcm9wcy5zZWxlY3RlZCkgcmV0dXJuXG4gICAgcHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtbGlrZScsIHVybDogcHJvcHMuc2VsZWN0ZWQudXJsIH0sIHJlc3AgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxpa2U6IHJlc3AuY29udGVudC5saWtlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVUb3BTaXRlKCkge1xuICAgIGhpZGVUb3BTaXRlKHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsKVxuICAgIHRoaXMucHJvcHMudXBkYXRlRm4oKVxuICB9XG5cbiAgdG9nZ2xlTGlrZSgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5saWtlKSB0aGlzLnVubGlrZSgpXG4gICAgZWxzZSB0aGlzLmxpa2UoKVxuICB9XG5cbiAgbGlrZSgpIHtcbiAgICB0aGlzLnByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnbGlrZScsIHVybDogdGhpcy5wcm9wcy5zZWxlY3RlZC51cmwgfSwgcmVzcCA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbGlrZTogcmVzcC5jb250ZW50Lmxpa2VcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHNldFRpbWVvdXQodGhpcy5wcm9wcy5vbkNoYW5nZSwgMTAwMClcbiAgfVxuXG4gIHVubGlrZSgpIHtcbiAgICB0aGlzLnByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAndW5saWtlJywgdXJsOiB0aGlzLnByb3BzLnNlbGVjdGVkLnVybCB9LCByZXNwID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsaWtlOiBudWxsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBzZXRUaW1lb3V0KHRoaXMucHJvcHMub25DaGFuZ2UsIDEwMDApXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnNlbGVjdGVkKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNpZGViYXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWFnZVwiPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImxpbmtcIiBocmVmPXt0aGlzLnByb3BzLnNlbGVjdGVkLnVybH0+XG4gICAgICAgICAgICA8VVJMSW1hZ2UgY29udGVudD17dGhpcy5wcm9wcy5zZWxlY3RlZH0gLz5cbiAgICAgICAgICAgIDxoMT57dGhpcy5wcm9wcy5zZWxlY3RlZC50aXRsZX08L2gxPlxuICAgICAgICAgICAgPGgyPntjbGVhblVSTCh0aGlzLnByb3BzLnNlbGVjdGVkLnVybCl9PC9oMj5cbiAgICAgICAgICA8L2E+XG4gICAgICAgICAge3RoaXMucmVuZGVyQnV0dG9ucygpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckJ1dHRvbnMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnV0dG9uc1wiPlxuICAgICAgICB7dGhpcy5yZW5kZXJMaWtlQnV0dG9uKCl9XG4gICAgICAgIHt0aGlzLnByb3BzLnNlbGVjdGVkLnR5cGUgPT09ICd0b3AnID8gdGhpcy5yZW5kZXJEZWxldGVUb3BTaXRlQnV0dG9uKCkgOiBudWxsfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTGlrZUJ1dHRvbigpIHtcbiAgICBjb25zdCBhZ28gPSB0aGlzLnN0YXRlLmxpa2UgPyByZWxhdGl2ZURhdGUodGhpcy5zdGF0ZS5saWtlLmxpa2VkQXQpIDogXCJcIlxuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5zdGF0ZS5saWtlID8gXCJEZWxldGUgSXQgRnJvbSBZb3VyIExpa2VzXCIgOiBcIkFkZCBJdCBUbyBZb3VyIExpa2VzXCJcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHRpdGxlPXt0aXRsZX0gY2xhc3NOYW1lPXtgYnV0dG9uIGxpa2UtYnV0dG9uICR7dGhpcy5zdGF0ZS5saWtlPyBcImxpa2VkXCIgOiBcIlwifWB9IG9uQ2xpY2s9eygpID0+IHRoaXMudG9nZ2xlTGlrZSgpfT5cbiAgICAgICAgPEljb24gbmFtZT1cImhlYXJ0XCIgLz5cbiAgICAgICAge3RoaXMuc3RhdGUubGlrZSA/IGBMaWtlZCAke2Fnb31gIDogXCJMaWtlIEl0XCJ9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJEZWxldGVUb3BTaXRlQnV0dG9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHRpdGxlPVwiRGVsZXRlIEl0IEZyb20gRnJlcXVlbnRseSBWaXNpdGVkXCIgY2xhc3NOYW1lPVwiYnV0dG9uIGRlbGV0ZS1idXR0b25cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLmRlbGV0ZVRvcFNpdGUoKX0+XG4gICAgICAgIDxJY29uIG5hbWU9XCJ0cmFzaFwiIC8+XG4gICAgICAgIERlbGV0ZSBJdFxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZ2JhciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnRlbnQoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNvbnRlbnQgfHwgIXRoaXMucHJvcHMuY29udGVudC5sZW5ndGgpIHJldHVybiBbXVxuXG4gICAgY29uc3QgY29weSA9IHRoaXMucHJvcHMuY29udGVudC5zbGljZSgpXG5cbiAgICBjb25zdCBvY2NyID0ge31cbiAgICBsZXQgaSA9IGNvcHkubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgb2Njcltjb3B5W2ldXSA9IG9jY3JbY29weVtpXV0gPyBvY2NyW2NvcHlbaV1dKzEgOiAxXG4gICAgfVxuXG4gICAgY29uc3QgdW5pcXVlcyA9IE9iamVjdC5rZXlzKG9jY3IpXG4gICAgdW5pcXVlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBpZiAob2NjclthXSA8IG9jY3JbYl0pIHJldHVybiAxXG4gICAgICBpZiAob2NjclthXSA+IG9jY3JbYl0pIHJldHVybiAtMVxuICAgICAgcmV0dXJuIDBcbiAgICB9KVxuXG4gICAgcmV0dXJuIHVuaXF1ZXNcbiAgfVxuXG4gIG1heCgpIHtcbiAgICByZXR1cm4gMTBcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5jb250ZW50KClcbiAgICBpZiAoY29udGVudC5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFnYmFyXCI+XG4gICAgICAgIDxJY29uIG5hbWU9XCJ0YWdcIiBzdHJva2U9XCIzXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZXJzb25hbC10YWdzXCI+XG4gICAgICAgICAge2NvbnRlbnQuc2xpY2UoMCwgdGhpcy5tYXgoKSkubWFwKHQgPT4gdGhpcy5yZW5kZXJUYWcodCkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRhZyhuYW1lKSB7XG4gICAgY29uc3QgdGl0bGUgPSBjYXBpdGFsaXplKG5hbWUpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGEgY2xhc3NOYW1lPVwidGFnIGJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub3BlblRhZyhuYW1lKX0gdGl0bGU9e2BPcGVuIFwiJHt0aXRsZX1cIiB0YWdgfT5cbiAgICAgICAge3RpdGxlfVxuICAgICAgPC9hPlxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBjYXBpdGFsaXplICh0aXRsZSkge1xuICByZXR1cm4gdGl0bGUuc3BsaXQoL1xccysvKS5tYXAodyA9PiB3LnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB3LnNsaWNlKDEpKS5qb2luKCcgJylcbn1cbiIsImltcG9ydCB0aXRsZUZyb21VUkwgZnJvbSBcInRpdGxlLWZyb20tdXJsXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWQodGl0bGUpIHtcbiAgY29uc3QgYWJzbGVuID0gdGl0bGUucmVwbGFjZSgvW15cXHddKy9nLCAnJykubGVuZ3RoXG4gIHJldHVybiBhYnNsZW4gPj0gMiAmJiAhL15odHRwXFx3PzpcXC9cXC8vLnRlc3QodGl0bGUpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUodGl0bGUpIHtcbiAgcmV0dXJuIHRpdGxlLnRyaW0oKS5yZXBsYWNlKC9eXFwoXFxkK1xcKS8sICcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVGcm9tVVJMKHVybCkge1xuICByZXR1cm4gdGl0bGVGcm9tVVJMKHVybClcbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IHsgY2xlYW4gfSBmcm9tICd1cmxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3BTaXRlcyBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLnRpdGxlID0gJ0ZyZXF1ZW50bHkgVmlzaXRlZCdcbiAgICB0aGlzLm5hbWUgPSAndG9wJ1xuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5Lmxlbmd0aCA8IDVcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFsbCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlckJ5UXVlcnkocXVlcnkpXG4gICAgfVxuICB9XG5cbiAgYWxsKCkge1xuICAgIGdldChyb3dzID0+IHRoaXMuYWRkKGFkZEtvem1vcyhyb3dzLnNsaWNlKDAsIDUpKSkpXG4gIH1cblxuICBmaWx0ZXJCeVF1ZXJ5KHF1ZXJ5KSB7XG4gICAgY29uc3QgcmVzdWx0ID0gW11cblxuICAgIGNocm9tZS50b3BTaXRlcy5nZXQodG9wU2l0ZXMgPT4ge1xuICAgICAgbGV0IGkgPSAtMVxuICAgICAgY29uc3QgbGVuID0gdG9wU2l0ZXMubGVuZ3RoXG4gICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgIGlmIChjbGVhbih0b3BTaXRlc1tpXS51cmwpLmluZGV4T2YocXVlcnkpID09PSAwIHx8IHRvcFNpdGVzW2ldLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeSkgPT09IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh0b3BTaXRlc1tpXSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFkZChyZXN1bHQpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRLb3ptb3MgKHJvd3MpIHtcbiAgbGV0IGkgPSByb3dzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKHJvd3NbaV0udXJsLmluZGV4T2YoJ2dldGtvem1vcy5jb20nKSA+IC0xKSB7XG4gICAgICByZXR1cm4gcm93c1xuICAgIH1cbiAgfVxuXG4gIHJvd3NbNF0gPSB7XG4gICAgdXJsOiAnaHR0cHM6Ly9nZXRrb3ptb3MuY29tJyxcbiAgICB0aXRsZTogJ0tvem1vcydcbiAgfVxuXG4gIHJldHVybiByb3dzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXQgKGNhbGxiYWNrKSB7XG4gIGNocm9tZS50b3BTaXRlcy5nZXQodG9wU2l0ZXMgPT4ge1xuICAgIGNhbGxiYWNrKGZpbHRlcih0b3BTaXRlcykpXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlICh1cmwpIHtcbiAgbGV0IGhpZGRlbiA9IGdldEhpZGRlblRvcFNpdGVzKClcbiAgaGlkZGVuW3VybF0gPSB0cnVlXG4gIHNldEhpZGRlblRvcFNpdGVzKGhpZGRlbilcbn1cblxuZnVuY3Rpb24gZ2V0SGlkZGVuVG9wU2l0ZXMgKCkge1xuICBsZXQgbGlzdCA9IHtcbiAgICAnaHR0cHM6Ly9nb29nbGUuY29tLyc6IHRydWUsXG4gICAgJ2h0dHA6Ly9nb29nbGUuY29tLyc6IHRydWVcbiAgfVxuXG4gIHRyeSB7XG4gICAgbGlzdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydoaWRkZW4tdG9wbGlzdCddKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBzZXRIaWRkZW5Ub3BTaXRlcyhsaXN0KVxuICB9XG5cbiAgcmV0dXJuIGxpc3Rcbn1cblxuZnVuY3Rpb24gc2V0SGlkZGVuVG9wU2l0ZXMobGlzdCkge1xuICBsb2NhbFN0b3JhZ2VbJ2hpZGRlbi10b3BsaXN0J10gPSBKU09OLnN0cmluZ2lmeShsaXN0KVxufVxuXG5mdW5jdGlvbiBmaWx0ZXIodG9wU2l0ZXMpIHtcbiAgY29uc3QgaGlkZSA9IGdldEhpZGRlblRvcFNpdGVzKClcbiAgcmV0dXJuIHRvcFNpdGVzLmZpbHRlcihyb3cgPT4gIWhpZGVbcm93LnVybF0pXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBpbWcgZnJvbSBcImltZ1wiXG5pbXBvcnQgeyBjbGVhbiBhcyBjbGVhblVSTCB9IGZyb20gXCJ1cmxzXCJcbmltcG9ydCAqIGFzIHRpdGxlcyBmcm9tIFwiLi90aXRsZXNcIlxuaW1wb3J0IFVSTEltYWdlIGZyb20gJy4vdXJsLWltYWdlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVUkxJY29uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmNvbnRlbnQudXJsICE9PSBuZXh0UHJvcHMuY29udGVudC51cmwgfHxcbiAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWQgIT09IG5leHRQcm9wcy5zZWxlY3RlZCB8fFxuICAgICAgdGhpcy5wcm9wcy50eXBlICE9PSBuZXh0UHJvcHMudHlwZVxuICB9XG5cbiAgc2VsZWN0KCkge1xuICAgIHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy5jb250ZW50KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBpZD17dGhpcy5wcm9wcy5jb250ZW50LmlkfSBjbGFzc05hbWU9e2B1cmxpY29uICR7dGhpcy5wcm9wcy5zZWxlY3RlZCA/IFwic2VsZWN0ZWRcIiA6IFwiXCJ9YH0gaHJlZj17dGhpcy51cmwoKX0gdGl0bGU9e2Ake3RoaXMudGl0bGUoKX0gLSAke2NsZWFuVVJMKHRoaXMucHJvcHMuY29udGVudC51cmwpfWB9IG9uTW91c2VNb3ZlPXsoKSA9PiB0aGlzLnNlbGVjdCgpfT5cbiAgICAgICAgPFVSTEltYWdlIGNvbnRlbnQ9e3RoaXMucHJvcHMuY29udGVudH0gaWNvbi1vbmx5IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICB7dGhpcy50aXRsZSgpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cmxcIj5cbiAgICAgICAgICB7dGhpcy5wcmV0dHlVUkwoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgIDwvYT5cbiAgICApXG4gIH1cblxuICB0aXRsZSgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jb250ZW50LnR5cGUgPT09ICdzZWFyY2gtcXVlcnknKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5jb250ZW50LnRpdGxlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC50eXBlID09PSAndXJsLXF1ZXJ5Jykge1xuICAgICAgcmV0dXJuIGBPcGVuICR7Y2xlYW5VUkwodGhpcy5wcm9wcy5jb250ZW50LnVybCl9YFxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNvbnRlbnQudGl0bGUgJiYgdGl0bGVzLmlzVmFsaWQodGhpcy5wcm9wcy5jb250ZW50LnRpdGxlKSkge1xuICAgICAgcmV0dXJuIHRpdGxlcy5ub3JtYWxpemUodGhpcy5wcm9wcy5jb250ZW50LnRpdGxlKVxuICAgIH1cblxuICAgIHJldHVybiB0aXRsZXMuZ2VuZXJhdGVGcm9tVVJMKHRoaXMucHJvcHMuY29udGVudC51cmwpXG4gIH1cblxuICB1cmwoKSB7XG4gICAgaWYgKC9eaHR0cHM/OlxcL1xcLy8udGVzdCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY29udGVudC51cmxcbiAgICB9XG5cbiAgICByZXR1cm4gJ2h0dHA6Ly8nICsgdGhpcy5wcm9wcy5jb250ZW50LnVybFxuICB9XG5cbiAgcHJldHR5VVJMKCkge1xuICAgIHJldHVybiBjbGVhblVSTCh0aGlzLnVybCgpKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBpbWcgZnJvbSAnaW1nJ1xuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5pbXBvcnQgcmFuZG9tQ29sb3IgZnJvbSBcInJhbmRvbS1jb2xvclwiXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcblxuZXhwb3J0IGNvbnN0IHBvcHVsYXJJY29ucyA9IHtcbiAgJ2ZhY2Vib29rLmNvbSc6ICdodHRwczovL3N0YXRpYy54eC5mYmNkbi5uZXQvcnNyYy5waHAvdjMveXgvci9ONEhfNTBLRnA4aS5wbmcnLFxuICAndHdpdHRlci5jb20nOiAnaHR0cHM6Ly9tYS0wLnR3aW1nLmNvbS90d2l0dGVyLWFzc2V0cy9yZXNwb25zaXZlLXdlYi93ZWIvbHRyL2ljb24taW9zLmE5Y2Q4ODViY2NiY2FmMmYucG5nJyxcbiAgJ3lvdXR1YmUuY29tJzogJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3l0cy9pbWcvZmF2aWNvbl85Ni12ZmxXOUVjMHcucG5nJyxcbiAgJ2FtYXpvbi5jb20nOiAnaHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9HLzAxL2FueXdoZXJlL2Ffc21pbGVfMTIweDEyMC5fQ0IzNjgyNDY1NzNfLnBuZycsXG4gICdnb29nbGUuY29tJzogJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2JyYW5kaW5nL3Byb2R1Y3RfaW9zLzJ4L2dzYV9pb3NfNjBkcC5wbmcnLFxuICAneWFob28uY29tJzogJ2h0dHBzOi8vd3d3LnlhaG9vLmNvbS9hcHBsZS10b3VjaC1pY29uLXByZWNvbXBvc2VkLnBuZycsXG4gICdyZWRkaXQuY29tJzogJ2h0dHBzOi8vd3d3LnJlZGRpdHN0YXRpYy5jb20vbXdlYjJ4L2Zhdmljb24vMTIweDEyMC5wbmcnLFxuICAnaW5zdGFncmFtLmNvbSc6ICdodHRwczovL3d3dy5pbnN0YWdyYW0uY29tL3N0YXRpYy9pbWFnZXMvaWNvL2FwcGxlLXRvdWNoLWljb24tMTIweDEyMC1wcmVjb21wb3NlZC5wbmcvMDA0NzA1YzkzNTNmLnBuZycsXG4gICdnZXRrb3ptb3MuY29tJzogJ2h0dHBzOi8vZ2V0a296bW9zLmNvbS9wdWJsaWMvbG9nb3Mva296bW9zLWhlYXJ0LWxvZ28tMTAwcHgucG5nJyxcbiAgJ2dpdGh1Yi5jb20nOiAnaHR0cHM6Ly9hc3NldHMtY2RuLmdpdGh1Yi5jb20vcGlubmVkLW9jdG9jYXQuc3ZnJyxcbiAgJ2dpc3QuZ2l0aHViLmNvbSc6ICdodHRwczovL2Fzc2V0cy1jZG4uZ2l0aHViLmNvbS9waW5uZWQtb2N0b2NhdC5zdmcnLFxuICAnbWFpbC5nb29nbGUuY29tJzogJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2ljb25zL3Byb2R1Y3QvZ29vZ2xlbWFpbC0xMjgucG5nJyxcbiAgJ3BheXBhbC5jb20nOiAnaHR0cHM6Ly93d3cucGF5cGFsb2JqZWN0cy5jb20vd2Vic3RhdGljL2ljb24vcHAxNDQucG5nJyxcbiAgJ2ltZGIuY29tJzogJ2h0dHA6Ly9pYS5tZWRpYS1pbWRiLmNvbS9pbWFnZXMvRy8wMS9pbWRiL2ltYWdlcy9kZXNrdG9wLWZhdmljb24tMjE2NTgwNjk3MC5fQ0I1MjI3MzY1NjFfLmljbycsXG4gICdlbi53aWtpcGVkaWEub3JnJzogJ2h0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy9zdGF0aWMvZmF2aWNvbi93aWtpcGVkaWEuaWNvJyxcbiAgJ3dpa2lwZWRpYS5vcmcnOiAnaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3N0YXRpYy9mYXZpY29uL3dpa2lwZWRpYS5pY28nLFxuICAnZXNwbi5jb20nOiAnaHR0cDovL2EuZXNwbmNkbi5jb20vZmF2aWNvbi5pY28nLFxuICAndHdpdGNoLnR2JzogJ2h0dHBzOi8vc3RhdGljLnR3aXRjaGNkbi5uZXQvYXNzZXRzL2Zhdmljb24tNzUyNzBmOWRmMmIwNzE3NGMyM2NlODQ0YTAzZDg0YWYuaWNvJyxcbiAgJ2Nubi5jb20nOiAnaHR0cDovL2Nkbi5jbm4uY29tL2Nubi8uZS9pbWcvMy4wL2dsb2JhbC9taXNjL2FwcGxlLXRvdWNoLWljb24ucG5nJyxcbiAgJ29mZmljZS5jb20nOiAnaHR0cHM6Ly9zZWFvZmZpY2Vob21lLm1zb2Nkbi5jb20vcy83MDQ3NDUyZS9JbWFnZXMvZmF2aWNvbl9tZXRyby5pY28nLFxuICAnYmFua29mYW1lcmljYS5jb20nOiAnaHR0cHM6Ly93d3cxLmJhYy1hc3NldHMuY29tL2hvbWVwYWdlL3NwYS1hc3NldHMvaW1hZ2VzL2Fzc2V0cy1pbWFnZXMtZ2xvYmFsLWZhdmljb24tZmF2aWNvbi1DU1gzODZiMzMyZC5pY28nLFxuICAnY2hhc2UuY29tJzogJ2h0dHBzOi8vd3d3LmNoYXNlLmNvbS9ldGMvZGVzaWducy9jaGFzZS11eC9mYXZpY29uLTE1Mi5wbmcnLFxuICAnbnl0aW1lcy5jb20nOiAnaHR0cHM6Ly9zdGF0aWMwMS5ueXQuY29tL2ltYWdlcy9pY29ucy9pb3MtaXBhZC0xNDR4MTQ0LnBuZycsXG4gICdhcHBsZS5jb20nOiAnaHR0cHM6Ly93d3cuYXBwbGUuY29tL2Zhdmljb24uaWNvJyxcbiAgJ3dlbGxzZmFyZ28uY29tJzogJ2h0dHBzOi8vd3d3LndlbGxzZmFyZ28uY29tL2Fzc2V0cy9pbWFnZXMvaWNvbnMvYXBwbGUtdG91Y2gtaWNvbi0xMjB4MTIwLnBuZycsXG4gICd5ZWxwLmNvbSc6ICdodHRwczovL3MzLW1lZGlhMi5mbC55ZWxwY2RuLmNvbS9hc3NldHMvc3J2MC95ZWxwX3N0eWxlZ3VpZGUvMTE4ZmY0NzVhMzQxL2Fzc2V0cy9pbWcvbG9nb3MvZmF2aWNvbi5pY28nLFxuICAnd29yZHByZXNzLmNvbSc6ICdodHRwOi8vczAud3AuY29tL2kvd2ViY2xpcC5wbmcnLFxuICAnZHJvcGJveC5jb20nOiAnaHR0cHM6Ly9jZmwuZHJvcGJveHN0YXRpYy5jb20vc3RhdGljL2ltYWdlcy9mYXZpY29uLXZmbFVlTGVlWS5pY28nLFxuICAnbWFpbC5zdXBlcmh1bWFuLmNvbSc6ICdodHRwczovL3N1cGVyaHVtYW4uY29tL2J1aWxkLzcxMjIyYmRjMTY5ZTU5MDZjMjgyNDdlZDViN2NmMGVkLnNoYXJlLWljb24ucG5nJyxcbiAgJ2F3cy5hbWF6b24uY29tJzogJ2h0dHBzOi8vYTAuYXdzc3RhdGljLmNvbS9saWJyYS1jc3MvaW1hZ2VzL3NpdGUvdG91Y2gtaWNvbi1pcGhvbmUtMTE0LXNtaWxlLnBuZycsXG4gICdjb25zb2xlLmF3cy5hbWF6b24uY29tJzogJ2h0dHBzOi8vYTAuYXdzc3RhdGljLmNvbS9saWJyYS1jc3MvaW1hZ2VzL3NpdGUvdG91Y2gtaWNvbi1pcGhvbmUtMTE0LXNtaWxlLnBuZycsXG4gICd1cy13ZXN0LTIuY29uc29sZS5hd3MuYW1hem9uLmNvbSc6ICdodHRwczovL2EwLmF3c3N0YXRpYy5jb20vbGlicmEtY3NzL2ltYWdlcy9zaXRlL3RvdWNoLWljb24taXBob25lLTExNC1zbWlsZS5wbmcnLFxuICAnc3RhY2tvdmVyZmxvdy5jb20nOiAnaHR0cHM6Ly9jZG4uc3N0YXRpYy5uZXQvU2l0ZXMvc3RhY2tvdmVyZmxvdy9pbWcvYXBwbGUtdG91Y2gtaWNvbi5wbmcnXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVSTEltYWdlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLl9yZWZyZXNoU291cmNlID0gZGVib3VuY2UodGhpcy5yZWZyZXNoU291cmNlLmJpbmQodGhpcykpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC51cmwgIT09IHByb3BzLmNvbnRlbnQudXJsKSB7XG4gICAgICB0aGlzLl9yZWZyZXNoU291cmNlKHByb3BzLmNvbnRlbnQpXG4gICAgfVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgaWYgKG5leHRQcm9wcy5jb250ZW50LnVybCAhPT0gdGhpcy5wcm9wcy5jb250ZW50LnVybCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobmV4dFN0YXRlLnNyYyAhPT0gdGhpcy5zdGF0ZS5zcmMpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG5leHRTdGF0ZS5sb2FkaW5nICE9PSB0aGlzLnN0YXRlLmxvYWRpbmcgfHwgbmV4dFN0YXRlLmVycm9yICE9PSB0aGlzLnN0YXRlLmVycm9yKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmICgoIW5leHRQcm9wcy5jb250ZW50LmltYWdlcyB8fCB0aGlzLnByb3BzLmNvbnRlbnQuaW1hZ2VzKSB8fCAobmV4dFByb3BzLmNvbnRlbnQuaW1hZ2VzIHx8ICF0aGlzLnByb3BzLmNvbnRlbnQuaW1hZ2VzKSB8fCAobmV4dFByb3BzLmNvbnRlbnQuaW1hZ2VzWzBdICE9PSB0aGlzLnByb3BzLmNvbnRlbnQuaW1hZ2VzWzBdKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLnJlZnJlc2hTb3VyY2UoKVxuICB9XG5cbiAgcmVmcmVzaFNvdXJjZShjb250ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb2xvcjogcmFuZG9tQ29sb3IoMTAwLCA1MClcbiAgICB9KVxuXG4gICAgdGhpcy5maW5kU291cmNlKGNvbnRlbnQpXG4gICAgdGhpcy5wcmVsb2FkKHRoaXMuc3RhdGUuc3JjKVxuICB9XG5cbiAgZmluZFNvdXJjZShjb250ZW50KSB7XG4gICAgY29udGVudCB8fCAoY29udGVudCA9IHRoaXMucHJvcHMuY29udGVudClcblxuICAgIGlmICghdGhpcy5wcm9wc1snaWNvbi1vbmx5J10gJiYgY29udGVudC5pbWFnZXMgJiYgY29udGVudC5pbWFnZXMubGVuZ3RoID4gMCAmJiBjb250ZW50LmltYWdlc1swXSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzcmM6IGNvbnRlbnQuaW1hZ2VzWzBdXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChjb250ZW50Lmljb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdHlwZTogJ2ljb24nLFxuICAgICAgICBzcmM6IGFic29sdXRlSWNvblVSTChjb250ZW50KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBob3N0bmFtZSA9IGZpbmRIb3N0bmFtZShjb250ZW50LnVybClcbiAgICBpZiAocG9wdWxhckljb25zW2hvc3RuYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0eXBlOiAncG9wdWxhci1pY29uJyxcbiAgICAgICAgc3JjOiBwb3B1bGFySWNvbnNbaG9zdG5hbWVdXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdHlwZTogJ2Zhdmljb24nLFxuICAgICAgc3JjOiAnaHR0cDovLycgKyBob3N0bmFtZSArICcvZmF2aWNvbi5pY28nXG4gICAgfSlcbiAgfVxuXG4gIHByZWxvYWQoc3JjKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubG9hZGluZyAmJiB0aGlzLnN0YXRlLmxvYWRpbmdGb3IgPT09IHRoaXMucHJvcHMuY29udGVudC51cmwpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBsb2FkaW5nRm9yOiB0aGlzLnByb3BzLmNvbnRlbnQudXJsLFxuICAgICAgbG9hZGluZ1NyYzogc3JjLFxuICAgICAgc3JjOiB0aGlzLmNhY2hlZEljb25VUkwoKVxuICAgIH0pXG5cbiAgICBpbWcoc3JjLCBlcnIgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUubG9hZGluZ1NyYyAhPT0gc3JjKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICBlcnJvcjogZXJyLFxuICAgICAgICAgIHNyYzogdGhpcy5jYWNoZWRJY29uVVJMKClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNyYzogc3JjLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGxcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5sb2FkaW5nIHx8IHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRpbmcoKVxuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7dGhpcy5zdGF0ZS5zcmN9KWBcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2B1cmwtaW1hZ2UgJHt0aGlzLnN0YXRlLnR5cGV9YH0gc3R5bGU9e3N0eWxlfT48L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJMb2FkaW5nKCkge1xuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnN0YXRlLmNvbG9yXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS1lcnJvcj17dGhpcy5zdGF0ZS5lcnJvcn0gZGF0YS10eXBlPXt0aGlzLnN0YXRlLnR5cGV9IGRhdGEtc3JjPXt0aGlzLnN0YXRlLnNyY30gY2xhc3NOYW1lPVwidXJsLWltYWdlIGdlbmVyYXRlZC1pbWFnZSBjZW50ZXJcIiBzdHlsZT17c3R5bGV9PlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICB7ZmluZEhvc3RuYW1lKHRoaXMucHJvcHMuY29udGVudC51cmwpLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCl9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNhY2hlZEljb25VUkwoKSB7XG4gICAgcmV0dXJuICdjaHJvbWU6Ly9mYXZpY29uL3NpemUvNzIvJyArIGZpbmRQcm90b2NvbCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKSArICc6Ly8nICsgZmluZEhvc3RuYW1lKHRoaXMucHJvcHMuY29udGVudC51cmwpXG4gIH1cblxufVxuXG5mdW5jdGlvbiBhYnNvbHV0ZUljb25VUkwgKGxpa2UpIHtcbiAgaWYgKC9eaHR0cHM/OlxcL1xcLy8udGVzdChsaWtlLmljb24pKSByZXR1cm4gbGlrZS5pY29uXG4gIHJldHVybiAnaHR0cDpcXC9cXC8nICsgam9pbihmaW5kSG9zdG5hbWUobGlrZS51cmwpLCBsaWtlLmljb24pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSG9zdG5hbWUodXJsKSB7XG4gIHJldHVybiB1cmwucmVwbGFjZSgvXlxcdys6XFwvXFwvLywgJycpLnNwbGl0KCcvJylbMF0ucmVwbGFjZSgvXnd3d1xcLi8sICcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFByb3RvY29sKHVybCkge1xuICBpZiAoIS9eaHR0cHM/OlxcL1xcLy8udGVzdCh1cmwpKSByZXR1cm4gJ2h0dHAnXG4gIHJldHVybiB1cmwuc3BsaXQoJzovLycpWzBdXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBpbWcgZnJvbSBcImltZ1wiXG5pbXBvcnQgd2FsbHBhcGVycyBmcm9tICcuL3dhbGxwYXBlcnMnXG5jb25zdCBPTkVfREFZID0gMTAwMCAqIDYwICogNjAgKiAyNFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYWxscGFwZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdGhpcy5sb2FkKClcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAocHJvcHMuaW5kZXggIT09IHRoaXMucHJvcHMuaW5kZXgpIHtcbiAgICAgIHRoaXMubG9hZCgpXG4gICAgfVxuICB9XG5cbiAgbG9hZCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBzcmM6IG51bGxcbiAgICB9KVxuXG4gICAgaW1nKHRoaXMuc2VsZWN0ZWQoKS51cmwsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gdGhpcy5vbkVycm9yKGVycilcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBzcmM6IHRoaXMuc2VsZWN0ZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUubG9hZGluZyB8fCB0aGlzLnByb3BzLmluZGV4KSByZXR1cm5cblxuICAgICAgbGV0IHN0YXJ0ID0gRGF0ZS5ub3coKVxuICAgICAgbGV0IGNhY2hlZCA9IGltZyh0aGlzLnVybCh0aGlzLnNyYyh0aGlzLnllc3RlcmRheSgpKSksIGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIgfHwgIXRoaXMuc3RhdGUubG9hZGluZykgcmV0dXJuXG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgc3JjOiB0aGlzLnNyYyh0aGlzLnllc3RlcmRheSgpKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNhY2hlZC5zcmMgPSAnJztcbiAgICAgIH0sIDEwMDApXG4gICAgfSwgNTAwKVxuICB9XG5cbiAgb25FcnJvcihlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgZXJyb3JcbiAgICB9KVxuICB9XG5cbiAgdG9kYXkoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIDAsIDApXG4gICAgY29uc3QgZGlmZiA9IChub3cgLSBzdGFydCkgKyAoKHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkgLSBub3cuZ2V0VGltZXpvbmVPZmZzZXQoKSkgKiA2MCAqIDEwMDApXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoZGlmZiAvIE9ORV9EQVkpXG4gIH1cblxuICB5ZXN0ZXJkYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9kYXkoKSAtIDFcbiAgfVxuXG4gIHNyYyhpbmRleCkge1xuICAgIHJldHVybiB3YWxscGFwZXJzW2luZGV4ICUgd2FsbHBhcGVycy5sZW5ndGhdXG4gIH1cblxuICBzZWxlY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zcmModGhpcy50b2RheSgpICArICh0aGlzLnByb3BzLmluZGV4IHx8IDApKVxuICB9XG5cbiAgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoXG4gIH1cblxuICB1cmwoc3JjKSB7XG4gICAgcmV0dXJuIHNyYy51cmwgKyAnP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnc9JyArIHRoaXMud2lkdGgoKVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5zcmMpIHJldHVyblxuXG4gICAgY29uc3Qgc3JjID0gdGhpcy5zdGF0ZS5zcmNcbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke3RoaXMudXJsKHRoaXMuc3RhdGUuc3JjKX0pYFxuICAgIH1cblxuICAgIGlmIChzcmMucG9zaXRpb24pIHtcbiAgICAgIHN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IHNyYy5wb3NpdGlvblxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhbGxwYXBlclwiIHN0eWxlPXtzdHlsZX0+PC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ0NDQ2NDY2NjE2OC00OWQ2MzNiODY3OTdcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTA4NDk2MDg4ODAtNmY3ODc1NDJjODhhXCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6IFwidG9wIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDI5NTE2Mzg3NDU5LTk4OTFiN2I5NmM3OFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ2OTg1NDUyMzA4Ni1jYzAyZmU1ZDg4MDBcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0ODg3MjQwMzQ5NTgtMGZhYWQ4OGNmNjlmXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDMwNjUxNzE3NTA0LWViYjllM2U2Nzk1ZVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ0MTgwMjI1OTg3OC1hMTNmNzMyY2U0MTBcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJib3R0b20gY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQyMDA0ODMwMzUtZGI3YmM2YWE1NzM5XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU5MjU4MzUwODc5LTM0ODg2MzE5YTNjOVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNzA5ODkyNjMzMS04ZDMyNGIxMzlkMTVcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJ0b3AgY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQzMDE5NTA2MjQtMmM1NGNjOTgyNmM1XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDgwNDk5NDg0MjY4LWE4NWEyNDE0ZGE4MVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ4MzExNjUzMTUyMi00YzRlNTI1ZjUwNGVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzkwMzAxNjAxODAtYjE4NjA5NTFkNjk2XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTEwMzUzNjIyNzU4LTYyZTNiNjNiNWZiNVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwMTQ0NjY5MDg1Mi1kYTU1ZGY3YmZlMDdcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJ0b3AgY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDE4NjIxNjkyODYtNTE4YzI5MWUzZWVkXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDY5NDc0OTY4MDI4LTU2NjIzZjAyZTQyZVwiIH0sXG4gIHsgXCJwb3NpdGlvblwiOiBcInRvcCBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ3OTAzMDE2MDE4MC1iMTg2MDk1MWQ2OTZcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0MzE4ODc3NzMwNDItODAzZWQ1MmJlZDI2XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTAwNTE0OTY2OTA2LWZlMjQ1ZWVhOTM0NFwiIH0sXG4gIHsgXCJwb3NpdGlvblwiOiBcImJvdHRvbSBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ2NTQwMTE4MDQ4OS1jZWI1YTM0ZDhhNjNcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDUyOTk5MTYxMzctYjY5NzkzYTY2OTA3XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA0NDYxMTU0MDA1LTMxYjQzNWU2ODdlZFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNDc0MDE5MTA0NS02M2UxNTI1MWU3NTBcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0MzE3OTQwNjIyMzItMmE5OWE1NDMxYzZjXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA0OTA4NDE1MDI1LWI3YzI1NjA5NDY5M1wiIH0sXG4gIHsgXCJwb3NpdGlvblwiOlwiYm90dG9tIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTAxOTYzNDIyNzYyLTNkODliZDk4OTU2OFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ3MDA3MTQ1OTYwNC0zYjVlYzNhN2ZlMDVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTkyNDA3MTM2NzctMmM3YTRmNjkyMDQ0XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDkwNDY0MzQ4MTY2LThiOGJiZDlmMWUyZVwiIH0sXG4gIHsgXCJwb3NpdGlvblwiOlwidG9wIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU1MzI1NTI4MDU1LWFkODE1YWZlY2ViZVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ3ODAzMzM5NDE1MS1jOTMxZDVhNGJkZDZcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NDkwMzQ0NDY4NTMtNjZjODYxNDRiMGFkXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA1MDUzMjYyNjkxLTYyNDA2M2Y5NGI2NVwiIH1cbl1cbiIsIm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG5cbmZ1bmN0aW9uIGRlYm91bmNlIChmbiwgd2FpdCkge1xuICB2YXIgdGltZXI7XG4gIHZhciBhcmdzO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICB3YWl0ID0gMjUwO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGltZXIgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgdGltZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9O1xufVxuIiwiXG4vKipcbiAqIEVzY2FwZSByZWdleHAgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gU3RyaW5nKHN0cikucmVwbGFjZSgvKFsuKis/PV4hOiR7fSgpfFtcXF1cXC9cXFxcXSkvZywgJ1xcXFwkMScpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGltZztcblxuZnVuY3Rpb24gaW1nIChzcmMsIG9wdCwgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBvcHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdFxuICAgIG9wdCA9IG51bGxcbiAgfVxuXG5cbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gIHZhciBsb2NrZWQ7XG5cbiAgZWwub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChsb2NrZWQpIHJldHVybjtcbiAgICBsb2NrZWQgPSB0cnVlO1xuXG4gICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sodW5kZWZpbmVkLCBlbCk7XG4gIH07XG5cbiAgZWwub25lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAobG9ja2VkKSByZXR1cm47XG4gICAgbG9ja2VkID0gdHJ1ZTtcblxuICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKG5ldyBFcnJvcignVW5hYmxlIHRvIGxvYWQgXCInICsgc3JjICsgJ1wiJyksIGVsKTtcbiAgfTtcbiAgXG4gIGlmIChvcHQgJiYgb3B0LmNyb3NzT3JpZ2luKVxuICAgIGVsLmNyb3NzT3JpZ2luID0gb3B0LmNyb3NzT3JpZ2luO1xuXG4gIGVsLnNyYyA9IHNyYztcblxuICByZXR1cm4gZWw7XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTcGxpdCBhIGZpbGVuYW1lIGludG8gW3Jvb3QsIGRpciwgYmFzZW5hbWUsIGV4dF0sIHVuaXggdmVyc2lvblxuLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy5cbnZhciBzcGxpdFBhdGhSZSA9XG4gICAgL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG52YXIgc3BsaXRQYXRoID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufTtcblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKSxcbiAgICAgIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUoZmlsdGVyKHBhdGhzLCBmdW5jdGlvbihwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICAgIHJldHVybiBwO1xuICB9KS5qb2luKCcvJykpO1xufTtcblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZWxhdGl2ZSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBleHBvcnRzLnJlc29sdmUoZnJvbSkuc3Vic3RyKDEpO1xuICB0byA9IGV4cG9ydHMucmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufTtcblxuZXhwb3J0cy5zZXAgPSAnLyc7XG5leHBvcnRzLmRlbGltaXRlciA9ICc6JztcblxuZXhwb3J0cy5kaXJuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgcmVzdWx0ID0gc3BsaXRQYXRoKHBhdGgpLFxuICAgICAgcm9vdCA9IHJlc3VsdFswXSxcbiAgICAgIGRpciA9IHJlc3VsdFsxXTtcblxuICBpZiAoIXJvb3QgJiYgIWRpcikge1xuICAgIC8vIE5vIGRpcm5hbWUgd2hhdHNvZXZlclxuICAgIHJldHVybiAnLic7XG4gIH1cblxuICBpZiAoZGlyKSB7XG4gICAgLy8gSXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2hcbiAgICBkaXIgPSBkaXIuc3Vic3RyKDAsIGRpci5sZW5ndGggLSAxKTtcbiAgfVxuXG4gIHJldHVybiByb290ICsgZGlyO1xufTtcblxuXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24ocGF0aCwgZXh0KSB7XG4gIHZhciBmID0gc3BsaXRQYXRoKHBhdGgpWzJdO1xuICAvLyBUT0RPOiBtYWtlIHRoaXMgY29tcGFyaXNvbiBjYXNlLWluc2Vuc2l0aXZlIG9uIHdpbmRvd3M/XG4gIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGY7XG59O1xuXG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcbiIsIiFmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgZnVuY3Rpb24gVk5vZGUoKSB7fVxuICAgIGZ1bmN0aW9uIGgobm9kZU5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGxhc3RTaW1wbGUsIGNoaWxkLCBzaW1wbGUsIGksIGNoaWxkcmVuID0gRU1QVFlfQ0hJTERSRU47XG4gICAgICAgIGZvciAoaSA9IGFyZ3VtZW50cy5sZW5ndGg7IGktLSA+IDI7ICkgc3RhY2sucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICBpZiAoYXR0cmlidXRlcyAmJiBudWxsICE9IGF0dHJpYnV0ZXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmICghc3RhY2subGVuZ3RoKSBzdGFjay5wdXNoKGF0dHJpYnV0ZXMuY2hpbGRyZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGF0dHJpYnV0ZXMuY2hpbGRyZW47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkgaWYgKChjaGlsZCA9IHN0YWNrLnBvcCgpKSAmJiB2b2lkIDAgIT09IGNoaWxkLnBvcCkgZm9yIChpID0gY2hpbGQubGVuZ3RoOyBpLS07ICkgc3RhY2sucHVzaChjaGlsZFtpXSk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgY2hpbGQpIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChzaW1wbGUgPSAnZnVuY3Rpb24nICE9IHR5cGVvZiBub2RlTmFtZSkgaWYgKG51bGwgPT0gY2hpbGQpIGNoaWxkID0gJyc7IGVsc2UgaWYgKCdudW1iZXInID09IHR5cGVvZiBjaGlsZCkgY2hpbGQgPSBTdHJpbmcoY2hpbGQpOyBlbHNlIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgY2hpbGQpIHNpbXBsZSA9ICExO1xuICAgICAgICAgICAgaWYgKHNpbXBsZSAmJiBsYXN0U2ltcGxlKSBjaGlsZHJlbltjaGlsZHJlbi5sZW5ndGggLSAxXSArPSBjaGlsZDsgZWxzZSBpZiAoY2hpbGRyZW4gPT09IEVNUFRZX0NISUxEUkVOKSBjaGlsZHJlbiA9IFsgY2hpbGQgXTsgZWxzZSBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIGxhc3RTaW1wbGUgPSBzaW1wbGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHAgPSBuZXcgVk5vZGUoKTtcbiAgICAgICAgcC5ub2RlTmFtZSA9IG5vZGVOYW1lO1xuICAgICAgICBwLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHAuYXR0cmlidXRlcyA9IG51bGwgPT0gYXR0cmlidXRlcyA/IHZvaWQgMCA6IGF0dHJpYnV0ZXM7XG4gICAgICAgIHAua2V5ID0gbnVsbCA9PSBhdHRyaWJ1dGVzID8gdm9pZCAwIDogYXR0cmlidXRlcy5rZXk7XG4gICAgICAgIGlmICh2b2lkIDAgIT09IG9wdGlvbnMudm5vZGUpIG9wdGlvbnMudm5vZGUocCk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBleHRlbmQob2JqLCBwcm9wcykge1xuICAgICAgICBmb3IgKHZhciBpIGluIHByb3BzKSBvYmpbaV0gPSBwcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xvbmVFbGVtZW50KHZub2RlLCBwcm9wcykge1xuICAgICAgICByZXR1cm4gaCh2bm9kZS5ub2RlTmFtZSwgZXh0ZW5kKGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyksIHByb3BzKSwgYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiB2bm9kZS5jaGlsZHJlbik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVucXVldWVSZW5kZXIoY29tcG9uZW50KSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9fZCAmJiAoY29tcG9uZW50Ll9fZCA9ICEwKSAmJiAxID09IGl0ZW1zLnB1c2goY29tcG9uZW50KSkgKG9wdGlvbnMuZGVib3VuY2VSZW5kZXJpbmcgfHwgZGVmZXIpKHJlcmVuZGVyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVyZW5kZXIoKSB7XG4gICAgICAgIHZhciBwLCBsaXN0ID0gaXRlbXM7XG4gICAgICAgIGl0ZW1zID0gW107XG4gICAgICAgIHdoaWxlIChwID0gbGlzdC5wb3AoKSkgaWYgKHAuX19kKSByZW5kZXJDb21wb25lbnQocCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzU2FtZU5vZGVUeXBlKG5vZGUsIHZub2RlLCBoeWRyYXRpbmcpIHtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHJldHVybiB2b2lkIDAgIT09IG5vZGUuc3BsaXRUZXh0O1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlLm5vZGVOYW1lKSByZXR1cm4gIW5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yICYmIGlzTmFtZWROb2RlKG5vZGUsIHZub2RlLm5vZGVOYW1lKTsgZWxzZSByZXR1cm4gaHlkcmF0aW5nIHx8IG5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNOYW1lZE5vZGUobm9kZSwgbm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuX19uID09PSBub2RlTmFtZSB8fCBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5vZGVQcm9wcyh2bm9kZSkge1xuICAgICAgICB2YXIgcHJvcHMgPSBleHRlbmQoe30sIHZub2RlLmF0dHJpYnV0ZXMpO1xuICAgICAgICBwcm9wcy5jaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0gdm5vZGUubm9kZU5hbWUuZGVmYXVsdFByb3BzO1xuICAgICAgICBpZiAodm9pZCAwICE9PSBkZWZhdWx0UHJvcHMpIGZvciAodmFyIGkgaW4gZGVmYXVsdFByb3BzKSBpZiAodm9pZCAwID09PSBwcm9wc1tpXSkgcHJvcHNbaV0gPSBkZWZhdWx0UHJvcHNbaV07XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTm9kZShub2RlTmFtZSwgaXNTdmcpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBpc1N2ZyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBub2RlTmFtZSkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcbiAgICAgICAgbm9kZS5fX24gPSBub2RlTmFtZTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudE5vZGUpIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldEFjY2Vzc29yKG5vZGUsIG5hbWUsIG9sZCwgdmFsdWUsIGlzU3ZnKSB7XG4gICAgICAgIGlmICgnY2xhc3NOYW1lJyA9PT0gbmFtZSkgbmFtZSA9ICdjbGFzcyc7XG4gICAgICAgIGlmICgna2V5JyA9PT0gbmFtZSkgOyBlbHNlIGlmICgncmVmJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKG9sZCkgb2xkKG51bGwpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB2YWx1ZShub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmICgnY2xhc3MnID09PSBuYW1lICYmICFpc1N2Zykgbm9kZS5jbGFzc05hbWUgPSB2YWx1ZSB8fCAnJzsgZWxzZSBpZiAoJ3N0eWxlJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2YgdmFsdWUgfHwgJ3N0cmluZycgPT0gdHlwZW9mIG9sZCkgbm9kZS5zdHlsZS5jc3NUZXh0ID0gdmFsdWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBvbGQpIGZvciAodmFyIGkgaW4gb2xkKSBpZiAoIShpIGluIHZhbHVlKSkgbm9kZS5zdHlsZVtpXSA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIG5vZGUuc3R5bGVbaV0gPSAnbnVtYmVyJyA9PSB0eXBlb2YgdmFsdWVbaV0gJiYgITEgPT09IElTX05PTl9ESU1FTlNJT05BTC50ZXN0KGkpID8gdmFsdWVbaV0gKyAncHgnIDogdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSBub2RlLmlubmVySFRNTCA9IHZhbHVlLl9faHRtbCB8fCAnJztcbiAgICAgICAgfSBlbHNlIGlmICgnbycgPT0gbmFtZVswXSAmJiAnbicgPT0gbmFtZVsxXSkge1xuICAgICAgICAgICAgdmFyIHVzZUNhcHR1cmUgPSBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvQ2FwdHVyZSQvLCAnJykpO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9sZCkgbm9kZS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudFByb3h5LCB1c2VDYXB0dXJlKTtcbiAgICAgICAgICAgIChub2RlLl9fbCB8fCAobm9kZS5fX2wgPSB7fSkpW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2xpc3QnICE9PSBuYW1lICYmICd0eXBlJyAhPT0gbmFtZSAmJiAhaXNTdmcgJiYgbmFtZSBpbiBub2RlKSB7XG4gICAgICAgICAgICBzZXRQcm9wZXJ0eShub2RlLCBuYW1lLCBudWxsID09IHZhbHVlID8gJycgOiB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAobnVsbCA9PSB2YWx1ZSB8fCAhMSA9PT0gdmFsdWUpIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5zID0gaXNTdmcgJiYgbmFtZSAhPT0gKG5hbWUgPSBuYW1lLnJlcGxhY2UoL154bGlua1xcOj8vLCAnJykpO1xuICAgICAgICAgICAgaWYgKG51bGwgPT0gdmFsdWUgfHwgITEgPT09IHZhbHVlKSBpZiAobnMpIG5vZGUucmVtb3ZlQXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBuYW1lLnRvTG93ZXJDYXNlKCkpOyBlbHNlIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpOyBlbHNlIGlmICgnZnVuY3Rpb24nICE9IHR5cGVvZiB2YWx1ZSkgaWYgKG5zKSBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpLCB2YWx1ZSk7IGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldFByb3BlcnR5KG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBub2RlW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV2ZW50UHJveHkoZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2xbZS50eXBlXShvcHRpb25zLmV2ZW50ICYmIG9wdGlvbnMuZXZlbnQoZSkgfHwgZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZsdXNoTW91bnRzKCkge1xuICAgICAgICB2YXIgYztcbiAgICAgICAgd2hpbGUgKGMgPSBtb3VudHMucG9wKCkpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyTW91bnQpIG9wdGlvbnMuYWZ0ZXJNb3VudChjKTtcbiAgICAgICAgICAgIGlmIChjLmNvbXBvbmVudERpZE1vdW50KSBjLmNvbXBvbmVudERpZE1vdW50KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgcGFyZW50LCBjb21wb25lbnRSb290KSB7XG4gICAgICAgIGlmICghZGlmZkxldmVsKyspIHtcbiAgICAgICAgICAgIGlzU3ZnTW9kZSA9IG51bGwgIT0gcGFyZW50ICYmIHZvaWQgMCAhPT0gcGFyZW50Lm93bmVyU1ZHRWxlbWVudDtcbiAgICAgICAgICAgIGh5ZHJhdGluZyA9IG51bGwgIT0gZG9tICYmICEoJ19fcHJlYWN0YXR0cl8nIGluIGRvbSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IGlkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBjb21wb25lbnRSb290KTtcbiAgICAgICAgaWYgKHBhcmVudCAmJiByZXQucGFyZW50Tm9kZSAhPT0gcGFyZW50KSBwYXJlbnQuYXBwZW5kQ2hpbGQocmV0KTtcbiAgICAgICAgaWYgKCEtLWRpZmZMZXZlbCkge1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gITE7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudFJvb3QpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpIHtcbiAgICAgICAgdmFyIG91dCA9IGRvbSwgcHJldlN2Z01vZGUgPSBpc1N2Z01vZGU7XG4gICAgICAgIGlmIChudWxsID09IHZub2RlIHx8ICdib29sZWFuJyA9PSB0eXBlb2Ygdm5vZGUpIHZub2RlID0gJyc7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUgfHwgJ251bWJlcicgPT0gdHlwZW9mIHZub2RlKSB7XG4gICAgICAgICAgICBpZiAoZG9tICYmIHZvaWQgMCAhPT0gZG9tLnNwbGl0VGV4dCAmJiBkb20ucGFyZW50Tm9kZSAmJiAoIWRvbS5fY29tcG9uZW50IHx8IGNvbXBvbmVudFJvb3QpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVmFsdWUgIT0gdm5vZGUpIGRvbS5ub2RlVmFsdWUgPSB2bm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodm5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShkb20sICEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQuX19wcmVhY3RhdHRyXyA9ICEwO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdm5vZGVOYW1lID0gdm5vZGUubm9kZU5hbWU7XG4gICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiB2bm9kZU5hbWUpIHJldHVybiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgIGlzU3ZnTW9kZSA9ICdzdmcnID09PSB2bm9kZU5hbWUgPyAhMCA6ICdmb3JlaWduT2JqZWN0JyA9PT0gdm5vZGVOYW1lID8gITEgOiBpc1N2Z01vZGU7XG4gICAgICAgIHZub2RlTmFtZSA9IFN0cmluZyh2bm9kZU5hbWUpO1xuICAgICAgICBpZiAoIWRvbSB8fCAhaXNOYW1lZE5vZGUoZG9tLCB2bm9kZU5hbWUpKSB7XG4gICAgICAgICAgICBvdXQgPSBjcmVhdGVOb2RlKHZub2RlTmFtZSwgaXNTdmdNb2RlKTtcbiAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIG91dC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGRvbSwgITApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBmYyA9IG91dC5maXJzdENoaWxkLCBwcm9wcyA9IG91dC5fX3ByZWFjdGF0dHJfLCB2Y2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKG51bGwgPT0gcHJvcHMpIHtcbiAgICAgICAgICAgIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8gPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGEgPSBvdXQuYXR0cmlidXRlcywgaSA9IGEubGVuZ3RoOyBpLS07ICkgcHJvcHNbYVtpXS5uYW1lXSA9IGFbaV0udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoeWRyYXRpbmcgJiYgdmNoaWxkcmVuICYmIDEgPT09IHZjaGlsZHJlbi5sZW5ndGggJiYgJ3N0cmluZycgPT0gdHlwZW9mIHZjaGlsZHJlblswXSAmJiBudWxsICE9IGZjICYmIHZvaWQgMCAhPT0gZmMuc3BsaXRUZXh0ICYmIG51bGwgPT0gZmMubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIGlmIChmYy5ub2RlVmFsdWUgIT0gdmNoaWxkcmVuWzBdKSBmYy5ub2RlVmFsdWUgPSB2Y2hpbGRyZW5bMF07XG4gICAgICAgIH0gZWxzZSBpZiAodmNoaWxkcmVuICYmIHZjaGlsZHJlbi5sZW5ndGggfHwgbnVsbCAhPSBmYykgaW5uZXJEaWZmTm9kZShvdXQsIHZjaGlsZHJlbiwgY29udGV4dCwgbW91bnRBbGwsIGh5ZHJhdGluZyB8fCBudWxsICE9IHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKTtcbiAgICAgICAgZGlmZkF0dHJpYnV0ZXMob3V0LCB2bm9kZS5hdHRyaWJ1dGVzLCBwcm9wcyk7XG4gICAgICAgIGlzU3ZnTW9kZSA9IHByZXZTdmdNb2RlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbm5lckRpZmZOb2RlKGRvbSwgdmNoaWxkcmVuLCBjb250ZXh0LCBtb3VudEFsbCwgaXNIeWRyYXRpbmcpIHtcbiAgICAgICAgdmFyIGosIGMsIGYsIHZjaGlsZCwgY2hpbGQsIG9yaWdpbmFsQ2hpbGRyZW4gPSBkb20uY2hpbGROb2RlcywgY2hpbGRyZW4gPSBbXSwga2V5ZWQgPSB7fSwga2V5ZWRMZW4gPSAwLCBtaW4gPSAwLCBsZW4gPSBvcmlnaW5hbENoaWxkcmVuLmxlbmd0aCwgY2hpbGRyZW5MZW4gPSAwLCB2bGVuID0gdmNoaWxkcmVuID8gdmNoaWxkcmVuLmxlbmd0aCA6IDA7XG4gICAgICAgIGlmICgwICE9PSBsZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBfY2hpbGQgPSBvcmlnaW5hbENoaWxkcmVuW2ldLCBwcm9wcyA9IF9jaGlsZC5fX3ByZWFjdGF0dHJfLCBrZXkgPSB2bGVuICYmIHByb3BzID8gX2NoaWxkLl9jb21wb25lbnQgPyBfY2hpbGQuX2NvbXBvbmVudC5fX2sgOiBwcm9wcy5rZXkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAga2V5ZWRMZW4rKztcbiAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gX2NoaWxkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcyB8fCAodm9pZCAwICE9PSBfY2hpbGQuc3BsaXRUZXh0ID8gaXNIeWRyYXRpbmcgPyBfY2hpbGQubm9kZVZhbHVlLnRyaW0oKSA6ICEwIDogaXNIeWRyYXRpbmcpKSBjaGlsZHJlbltjaGlsZHJlbkxlbisrXSA9IF9jaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoMCAhPT0gdmxlbikgZm9yICh2YXIgaSA9IDA7IGkgPCB2bGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZjaGlsZCA9IHZjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBrZXkgPSB2Y2hpbGQua2V5O1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleWVkTGVuICYmIHZvaWQgMCAhPT0ga2V5ZWRba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGtleWVkW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGtleWVkW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGtleWVkTGVuLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghY2hpbGQgJiYgbWluIDwgY2hpbGRyZW5MZW4pIGZvciAoaiA9IG1pbjsgaiA8IGNoaWxkcmVuTGVuOyBqKyspIGlmICh2b2lkIDAgIT09IGNoaWxkcmVuW2pdICYmIGlzU2FtZU5vZGVUeXBlKGMgPSBjaGlsZHJlbltqXSwgdmNoaWxkLCBpc0h5ZHJhdGluZykpIHtcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGM7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bal0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGNoaWxkcmVuTGVuIC0gMSkgY2hpbGRyZW5MZW4tLTtcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gbWluKSBtaW4rKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoaWxkID0gaWRpZmYoY2hpbGQsIHZjaGlsZCwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZiA9IG9yaWdpbmFsQ2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQgJiYgY2hpbGQgIT09IGRvbSAmJiBjaGlsZCAhPT0gZikgaWYgKG51bGwgPT0gZikgZG9tLmFwcGVuZENoaWxkKGNoaWxkKTsgZWxzZSBpZiAoY2hpbGQgPT09IGYubmV4dFNpYmxpbmcpIHJlbW92ZU5vZGUoZik7IGVsc2UgZG9tLmluc2VydEJlZm9yZShjaGlsZCwgZik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleWVkTGVuKSBmb3IgKHZhciBpIGluIGtleWVkKSBpZiAodm9pZCAwICE9PSBrZXllZFtpXSkgcmVjb2xsZWN0Tm9kZVRyZWUoa2V5ZWRbaV0sICExKTtcbiAgICAgICAgd2hpbGUgKG1pbiA8PSBjaGlsZHJlbkxlbikgaWYgKHZvaWQgMCAhPT0gKGNoaWxkID0gY2hpbGRyZW5bY2hpbGRyZW5MZW4tLV0pKSByZWNvbGxlY3ROb2RlVHJlZShjaGlsZCwgITEpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZWNvbGxlY3ROb2RlVHJlZShub2RlLCB1bm1vdW50T25seSkge1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gbm9kZS5fY29tcG9uZW50O1xuICAgICAgICBpZiAoY29tcG9uZW50KSB1bm1vdW50Q29tcG9uZW50KGNvbXBvbmVudCk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG51bGwgIT0gbm9kZS5fX3ByZWFjdGF0dHJfICYmIG5vZGUuX19wcmVhY3RhdHRyXy5yZWYpIG5vZGUuX19wcmVhY3RhdHRyXy5yZWYobnVsbCk7XG4gICAgICAgICAgICBpZiAoITEgPT09IHVubW91bnRPbmx5IHx8IG51bGwgPT0gbm9kZS5fX3ByZWFjdGF0dHJfKSByZW1vdmVOb2RlKG5vZGUpO1xuICAgICAgICAgICAgcmVtb3ZlQ2hpbGRyZW4obm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBub2RlID0gbm9kZS5sYXN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgICAgICB2YXIgbmV4dCA9IG5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUobm9kZSwgITApO1xuICAgICAgICAgICAgbm9kZSA9IG5leHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZkF0dHJpYnV0ZXMoZG9tLCBhdHRycywgb2xkKSB7XG4gICAgICAgIHZhciBuYW1lO1xuICAgICAgICBmb3IgKG5hbWUgaW4gb2xkKSBpZiAoKCFhdHRycyB8fCBudWxsID09IGF0dHJzW25hbWVdKSAmJiBudWxsICE9IG9sZFtuYW1lXSkgc2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBvbGRbbmFtZV0sIG9sZFtuYW1lXSA9IHZvaWQgMCwgaXNTdmdNb2RlKTtcbiAgICAgICAgZm9yIChuYW1lIGluIGF0dHJzKSBpZiAoISgnY2hpbGRyZW4nID09PSBuYW1lIHx8ICdpbm5lckhUTUwnID09PSBuYW1lIHx8IG5hbWUgaW4gb2xkICYmIGF0dHJzW25hbWVdID09PSAoJ3ZhbHVlJyA9PT0gbmFtZSB8fCAnY2hlY2tlZCcgPT09IG5hbWUgPyBkb21bbmFtZV0gOiBvbGRbbmFtZV0pKSkgc2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBvbGRbbmFtZV0sIG9sZFtuYW1lXSA9IGF0dHJzW25hbWVdLCBpc1N2Z01vZGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb2xsZWN0Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICB2YXIgbmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAoY29tcG9uZW50c1tuYW1lXSB8fCAoY29tcG9uZW50c1tuYW1lXSA9IFtdKSkucHVzaChjb21wb25lbnQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoQ3RvciwgcHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGluc3QsIGxpc3QgPSBjb21wb25lbnRzW0N0b3IubmFtZV07XG4gICAgICAgIGlmIChDdG9yLnByb3RvdHlwZSAmJiBDdG9yLnByb3RvdHlwZS5yZW5kZXIpIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgQ3Rvcihwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBDb21wb25lbnQuY2FsbChpbnN0LCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IENvbXBvbmVudChwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpbnN0LmNvbnN0cnVjdG9yID0gQ3RvcjtcbiAgICAgICAgICAgIGluc3QucmVuZGVyID0gZG9SZW5kZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpc3QpIGZvciAodmFyIGkgPSBsaXN0Lmxlbmd0aDsgaS0tOyApIGlmIChsaXN0W2ldLmNvbnN0cnVjdG9yID09PSBDdG9yKSB7XG4gICAgICAgICAgICBpbnN0Ll9fYiA9IGxpc3RbaV0uX19iO1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZG9SZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0Q29tcG9uZW50UHJvcHMoY29tcG9uZW50LCBwcm9wcywgb3B0cywgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX194KSB7XG4gICAgICAgICAgICBjb21wb25lbnQuX194ID0gITA7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fciA9IHByb3BzLnJlZikgZGVsZXRlIHByb3BzLnJlZjtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19rID0gcHJvcHMua2V5KSBkZWxldGUgcHJvcHMua2V5O1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuYmFzZSB8fCBtb3VudEFsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKSBjb21wb25lbnQuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0ICE9PSBjb21wb25lbnQuY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50Ll9fYykgY29tcG9uZW50Ll9fYyA9IGNvbXBvbmVudC5jb250ZXh0O1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY29tcG9uZW50Ll9fcCkgY29tcG9uZW50Ll9fcCA9IGNvbXBvbmVudC5wcm9wcztcbiAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9feCA9ICExO1xuICAgICAgICAgICAgaWYgKDAgIT09IG9wdHMpIGlmICgxID09PSBvcHRzIHx8ICExICE9PSBvcHRpb25zLnN5bmNDb21wb25lbnRVcGRhdGVzIHx8ICFjb21wb25lbnQuYmFzZSkgcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCwgMSwgbW91bnRBbGwpOyBlbHNlIGVucXVldWVSZW5kZXIoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19yKSBjb21wb25lbnQuX19yKGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCwgb3B0cywgbW91bnRBbGwsIGlzQ2hpbGQpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX194KSB7XG4gICAgICAgICAgICB2YXIgcmVuZGVyZWQsIGluc3QsIGNiYXNlLCBwcm9wcyA9IGNvbXBvbmVudC5wcm9wcywgc3RhdGUgPSBjb21wb25lbnQuc3RhdGUsIGNvbnRleHQgPSBjb21wb25lbnQuY29udGV4dCwgcHJldmlvdXNQcm9wcyA9IGNvbXBvbmVudC5fX3AgfHwgcHJvcHMsIHByZXZpb3VzU3RhdGUgPSBjb21wb25lbnQuX19zIHx8IHN0YXRlLCBwcmV2aW91c0NvbnRleHQgPSBjb21wb25lbnQuX19jIHx8IGNvbnRleHQsIGlzVXBkYXRlID0gY29tcG9uZW50LmJhc2UsIG5leHRCYXNlID0gY29tcG9uZW50Ll9fYiwgaW5pdGlhbEJhc2UgPSBpc1VwZGF0ZSB8fCBuZXh0QmFzZSwgaW5pdGlhbENoaWxkQ29tcG9uZW50ID0gY29tcG9uZW50Ll9jb21wb25lbnQsIHNraXAgPSAhMTtcbiAgICAgICAgICAgIGlmIChpc1VwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByZXZpb3VzUHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gcHJldmlvdXNTdGF0ZTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IHByZXZpb3VzQ29udGV4dDtcbiAgICAgICAgICAgICAgICBpZiAoMiAhPT0gb3B0cyAmJiBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlICYmICExID09PSBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCkpIHNraXAgPSAhMDsgZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50Ll9fcCA9IGNvbXBvbmVudC5fX3MgPSBjb21wb25lbnQuX19jID0gY29tcG9uZW50Ll9fYiA9IG51bGw7XG4gICAgICAgICAgICBjb21wb25lbnQuX19kID0gITE7XG4gICAgICAgICAgICBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICByZW5kZXJlZCA9IGNvbXBvbmVudC5yZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmdldENoaWxkQ29udGV4dCkgY29udGV4dCA9IGV4dGVuZChleHRlbmQoe30sIGNvbnRleHQpLCBjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkpO1xuICAgICAgICAgICAgICAgIHZhciB0b1VubW91bnQsIGJhc2UsIGNoaWxkQ29tcG9uZW50ID0gcmVuZGVyZWQgJiYgcmVuZGVyZWQubm9kZU5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZFByb3BzID0gZ2V0Tm9kZVByb3BzKHJlbmRlcmVkKTtcbiAgICAgICAgICAgICAgICAgICAgaW5zdCA9IGluaXRpYWxDaGlsZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluc3QgJiYgaW5zdC5jb25zdHJ1Y3RvciA9PT0gY2hpbGRDb21wb25lbnQgJiYgY2hpbGRQcm9wcy5rZXkgPT0gaW5zdC5fX2spIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDEsIGNvbnRleHQsICExKTsgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbnN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Ll9jb21wb25lbnQgPSBpbnN0ID0gY3JlYXRlQ29tcG9uZW50KGNoaWxkQ29tcG9uZW50LCBjaGlsZFByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QuX19iID0gaW5zdC5fX2IgfHwgbmV4dEJhc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fdSA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDAsIGNvbnRleHQsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBvbmVudChpbnN0LCAxLCBtb3VudEFsbCwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJhc2UgPSBpbnN0LmJhc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2Jhc2UgPSBpbml0aWFsQmFzZTtcbiAgICAgICAgICAgICAgICAgICAgdG9Vbm1vdW50ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9Vbm1vdW50KSBjYmFzZSA9IGNvbXBvbmVudC5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxCYXNlIHx8IDEgPT09IG9wdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYmFzZSkgY2Jhc2UuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlID0gZGlmZihjYmFzZSwgcmVuZGVyZWQsIGNvbnRleHQsIG1vdW50QWxsIHx8ICFpc1VwZGF0ZSwgaW5pdGlhbEJhc2UgJiYgaW5pdGlhbEJhc2UucGFyZW50Tm9kZSwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbml0aWFsQmFzZSAmJiBiYXNlICE9PSBpbml0aWFsQmFzZSAmJiBpbnN0ICE9PSBpbml0aWFsQ2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJhc2VQYXJlbnQgPSBpbml0aWFsQmFzZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZVBhcmVudCAmJiBiYXNlICE9PSBiYXNlUGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlUGFyZW50LnJlcGxhY2VDaGlsZChiYXNlLCBpbml0aWFsQmFzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRvVW5tb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxCYXNlLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGluaXRpYWxCYXNlLCAhMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgdW5tb3VudENvbXBvbmVudCh0b1VubW91bnQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5iYXNlID0gYmFzZTtcbiAgICAgICAgICAgICAgICBpZiAoYmFzZSAmJiAhaXNDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50UmVmID0gY29tcG9uZW50LCB0ID0gY29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodCA9IHQuX191KSAoY29tcG9uZW50UmVmID0gdCkuYmFzZSA9IGJhc2U7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UuX2NvbXBvbmVudCA9IGNvbXBvbmVudFJlZjtcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPSBjb21wb25lbnRSZWYuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1VwZGF0ZSB8fCBtb3VudEFsbCkgbW91bnRzLnVuc2hpZnQoY29tcG9uZW50KTsgZWxzZSBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZSkgY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZShwcmV2aW91c1Byb3BzLCBwcmV2aW91c1N0YXRlLCBwcmV2aW91c0NvbnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyVXBkYXRlKSBvcHRpb25zLmFmdGVyVXBkYXRlKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBjb21wb25lbnQuX19oKSB3aGlsZSAoY29tcG9uZW50Ll9faC5sZW5ndGgpIGNvbXBvbmVudC5fX2gucG9wKCkuY2FsbChjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKCFkaWZmTGV2ZWwgJiYgIWlzQ2hpbGQpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGRDb21wb25lbnRGcm9tVk5vZGUoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgdmFyIGMgPSBkb20gJiYgZG9tLl9jb21wb25lbnQsIG9yaWdpbmFsQ29tcG9uZW50ID0gYywgb2xkRG9tID0gZG9tLCBpc0RpcmVjdE93bmVyID0gYyAmJiBkb20uX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZSwgaXNPd25lciA9IGlzRGlyZWN0T3duZXIsIHByb3BzID0gZ2V0Tm9kZVByb3BzKHZub2RlKTtcbiAgICAgICAgd2hpbGUgKGMgJiYgIWlzT3duZXIgJiYgKGMgPSBjLl9fdSkpIGlzT3duZXIgPSBjLmNvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICAgICAgaWYgKGMgJiYgaXNPd25lciAmJiAoIW1vdW50QWxsIHx8IGMuX2NvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCAzLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBkb20gPSBjLmJhc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWxDb21wb25lbnQgJiYgIWlzRGlyZWN0T3duZXIpIHtcbiAgICAgICAgICAgICAgICB1bm1vdW50Q29tcG9uZW50KG9yaWdpbmFsQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICBkb20gPSBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYyA9IGNyZWF0ZUNvbXBvbmVudCh2bm9kZS5ub2RlTmFtZSwgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGRvbSAmJiAhYy5fX2IpIHtcbiAgICAgICAgICAgICAgICBjLl9fYiA9IGRvbTtcbiAgICAgICAgICAgICAgICBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoYywgcHJvcHMsIDEsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGRvbSA9IGMuYmFzZTtcbiAgICAgICAgICAgIGlmIChvbGREb20gJiYgZG9tICE9PSBvbGREb20pIHtcbiAgICAgICAgICAgICAgICBvbGREb20uX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUob2xkRG9tLCAhMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvbTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdW5tb3VudENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYmVmb3JlVW5tb3VudCkgb3B0aW9ucy5iZWZvcmVVbm1vdW50KGNvbXBvbmVudCk7XG4gICAgICAgIHZhciBiYXNlID0gY29tcG9uZW50LmJhc2U7XG4gICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG4gICAgICAgIGNvbXBvbmVudC5iYXNlID0gbnVsbDtcbiAgICAgICAgdmFyIGlubmVyID0gY29tcG9uZW50Ll9jb21wb25lbnQ7XG4gICAgICAgIGlmIChpbm5lcikgdW5tb3VudENvbXBvbmVudChpbm5lcik7IGVsc2UgaWYgKGJhc2UpIHtcbiAgICAgICAgICAgIGlmIChiYXNlLl9fcHJlYWN0YXR0cl8gJiYgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZikgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX2IgPSBiYXNlO1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShiYXNlKTtcbiAgICAgICAgICAgIGNvbGxlY3RDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkcmVuKGJhc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb21wb25lbnQuX19yKSBjb21wb25lbnQuX19yKG51bGwpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBDb21wb25lbnQocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fX2QgPSAhMDtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVuZGVyKHZub2RlLCBwYXJlbnQsIG1lcmdlKSB7XG4gICAgICAgIHJldHVybiBkaWZmKG1lcmdlLCB2bm9kZSwge30sICExLCBwYXJlbnQsICExKTtcbiAgICB9XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICB2YXIgRU1QVFlfQ0hJTERSRU4gPSBbXTtcbiAgICB2YXIgZGVmZXIgPSAnZnVuY3Rpb24nID09IHR5cGVvZiBQcm9taXNlID8gUHJvbWlzZS5yZXNvbHZlKCkudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKSA6IHNldFRpbWVvdXQ7XG4gICAgdmFyIElTX05PTl9ESU1FTlNJT05BTCA9IC9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHZhciBtb3VudHMgPSBbXTtcbiAgICB2YXIgZGlmZkxldmVsID0gMDtcbiAgICB2YXIgaXNTdmdNb2RlID0gITE7XG4gICAgdmFyIGh5ZHJhdGluZyA9ICExO1xuICAgIHZhciBjb21wb25lbnRzID0ge307XG4gICAgZXh0ZW5kKENvbXBvbmVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgc2V0U3RhdGU6IGZ1bmN0aW9uKHN0YXRlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLnN0YXRlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9fcykgdGhpcy5fX3MgPSBleHRlbmQoe30sIHMpO1xuICAgICAgICAgICAgZXh0ZW5kKHMsICdmdW5jdGlvbicgPT0gdHlwZW9mIHN0YXRlID8gc3RhdGUocywgdGhpcy5wcm9wcykgOiBzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spICh0aGlzLl9faCA9IHRoaXMuX19oIHx8IFtdKS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGVucXVldWVSZW5kZXIodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcmNlVXBkYXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSAodGhpcy5fX2ggPSB0aGlzLl9faCB8fCBbXSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICByZW5kZXJDb21wb25lbnQodGhpcywgMik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBwcmVhY3QgPSB7XG4gICAgICAgIGg6IGgsXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQ6IGgsXG4gICAgICAgIGNsb25lRWxlbWVudDogY2xvbmVFbGVtZW50LFxuICAgICAgICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgICAgICAgcmVuZGVyOiByZW5kZXIsXG4gICAgICAgIHJlcmVuZGVyOiByZXJlbmRlcixcbiAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgIH07XG4gICAgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiBtb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gcHJlYWN0OyBlbHNlIHNlbGYucHJlYWN0ID0gcHJlYWN0O1xufSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0LmpzLm1hcCIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKiEgaHR0cHM6Ly9tdGhzLmJlL3B1bnljb2RlIHYxLjQuMSBieSBAbWF0aGlhcyAqL1xuOyhmdW5jdGlvbihyb290KSB7XG5cblx0LyoqIERldGVjdCBmcmVlIHZhcmlhYmxlcyAqL1xuXHR2YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmXG5cdFx0IWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblx0dmFyIGZyZWVNb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJlxuXHRcdCFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXHR2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO1xuXHRpZiAoXG5cdFx0ZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHxcblx0XHRmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCB8fFxuXHRcdGZyZWVHbG9iYWwuc2VsZiA9PT0gZnJlZUdsb2JhbFxuXHQpIHtcblx0XHRyb290ID0gZnJlZUdsb2JhbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYHB1bnljb2RlYCBvYmplY3QuXG5cdCAqIEBuYW1lIHB1bnljb2RlXG5cdCAqIEB0eXBlIE9iamVjdFxuXHQgKi9cblx0dmFyIHB1bnljb2RlLFxuXG5cdC8qKiBIaWdoZXN0IHBvc2l0aXZlIHNpZ25lZCAzMi1iaXQgZmxvYXQgdmFsdWUgKi9cblx0bWF4SW50ID0gMjE0NzQ4MzY0NywgLy8gYWthLiAweDdGRkZGRkZGIG9yIDJeMzEtMVxuXG5cdC8qKiBCb290c3RyaW5nIHBhcmFtZXRlcnMgKi9cblx0YmFzZSA9IDM2LFxuXHR0TWluID0gMSxcblx0dE1heCA9IDI2LFxuXHRza2V3ID0gMzgsXG5cdGRhbXAgPSA3MDAsXG5cdGluaXRpYWxCaWFzID0gNzIsXG5cdGluaXRpYWxOID0gMTI4LCAvLyAweDgwXG5cdGRlbGltaXRlciA9ICctJywgLy8gJ1xceDJEJ1xuXG5cdC8qKiBSZWd1bGFyIGV4cHJlc3Npb25zICovXG5cdHJlZ2V4UHVueWNvZGUgPSAvXnhuLS0vLFxuXHRyZWdleE5vbkFTQ0lJID0gL1teXFx4MjAtXFx4N0VdLywgLy8gdW5wcmludGFibGUgQVNDSUkgY2hhcnMgKyBub24tQVNDSUkgY2hhcnNcblx0cmVnZXhTZXBhcmF0b3JzID0gL1tcXHgyRVxcdTMwMDJcXHVGRjBFXFx1RkY2MV0vZywgLy8gUkZDIDM0OTAgc2VwYXJhdG9yc1xuXG5cdC8qKiBFcnJvciBtZXNzYWdlcyAqL1xuXHRlcnJvcnMgPSB7XG5cdFx0J292ZXJmbG93JzogJ092ZXJmbG93OiBpbnB1dCBuZWVkcyB3aWRlciBpbnRlZ2VycyB0byBwcm9jZXNzJyxcblx0XHQnbm90LWJhc2ljJzogJ0lsbGVnYWwgaW5wdXQgPj0gMHg4MCAobm90IGEgYmFzaWMgY29kZSBwb2ludCknLFxuXHRcdCdpbnZhbGlkLWlucHV0JzogJ0ludmFsaWQgaW5wdXQnXG5cdH0sXG5cblx0LyoqIENvbnZlbmllbmNlIHNob3J0Y3V0cyAqL1xuXHRiYXNlTWludXNUTWluID0gYmFzZSAtIHRNaW4sXG5cdGZsb29yID0gTWF0aC5mbG9vcixcblx0c3RyaW5nRnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZSxcblxuXHQvKiogVGVtcG9yYXJ5IHZhcmlhYmxlICovXG5cdGtleTtcblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGVycm9yIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFRoZSBlcnJvciB0eXBlLlxuXHQgKiBAcmV0dXJucyB7RXJyb3J9IFRocm93cyBhIGBSYW5nZUVycm9yYCB3aXRoIHRoZSBhcHBsaWNhYmxlIGVycm9yIG1lc3NhZ2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBlcnJvcih0eXBlKSB7XG5cdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoZXJyb3JzW3R5cGVdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIGdlbmVyaWMgYEFycmF5I21hcGAgdXRpbGl0eSBmdW5jdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5IGFycmF5XG5cdCAqIGl0ZW0uXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgb2YgdmFsdWVzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG1hcChhcnJheSwgZm4pIHtcblx0XHR2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcdHZhciByZXN1bHQgPSBbXTtcblx0XHR3aGlsZSAobGVuZ3RoLS0pIHtcblx0XHRcdHJlc3VsdFtsZW5ndGhdID0gZm4oYXJyYXlbbGVuZ3RoXSk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHQvKipcblx0ICogQSBzaW1wbGUgYEFycmF5I21hcGAtbGlrZSB3cmFwcGVyIHRvIHdvcmsgd2l0aCBkb21haW4gbmFtZSBzdHJpbmdzIG9yIGVtYWlsXG5cdCAqIGFkZHJlc3Nlcy5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcy5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5XG5cdCAqIGNoYXJhY3Rlci5cblx0ICogQHJldHVybnMge0FycmF5fSBBIG5ldyBzdHJpbmcgb2YgY2hhcmFjdGVycyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2tcblx0ICogZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXBEb21haW4oc3RyaW5nLCBmbikge1xuXHRcdHZhciBwYXJ0cyA9IHN0cmluZy5zcGxpdCgnQCcpO1xuXHRcdHZhciByZXN1bHQgPSAnJztcblx0XHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdFx0Ly8gSW4gZW1haWwgYWRkcmVzc2VzLCBvbmx5IHRoZSBkb21haW4gbmFtZSBzaG91bGQgYmUgcHVueWNvZGVkLiBMZWF2ZVxuXHRcdFx0Ly8gdGhlIGxvY2FsIHBhcnQgKGkuZS4gZXZlcnl0aGluZyB1cCB0byBgQGApIGludGFjdC5cblx0XHRcdHJlc3VsdCA9IHBhcnRzWzBdICsgJ0AnO1xuXHRcdFx0c3RyaW5nID0gcGFydHNbMV07XG5cdFx0fVxuXHRcdC8vIEF2b2lkIGBzcGxpdChyZWdleClgIGZvciBJRTggY29tcGF0aWJpbGl0eS4gU2VlICMxNy5cblx0XHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShyZWdleFNlcGFyYXRvcnMsICdcXHgyRScpO1xuXHRcdHZhciBsYWJlbHMgPSBzdHJpbmcuc3BsaXQoJy4nKTtcblx0XHR2YXIgZW5jb2RlZCA9IG1hcChsYWJlbHMsIGZuKS5qb2luKCcuJyk7XG5cdFx0cmV0dXJuIHJlc3VsdCArIGVuY29kZWQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBudW1lcmljIGNvZGUgcG9pbnRzIG9mIGVhY2ggVW5pY29kZVxuXHQgKiBjaGFyYWN0ZXIgaW4gdGhlIHN0cmluZy4gV2hpbGUgSmF2YVNjcmlwdCB1c2VzIFVDUy0yIGludGVybmFsbHksXG5cdCAqIHRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IGEgcGFpciBvZiBzdXJyb2dhdGUgaGFsdmVzIChlYWNoIG9mIHdoaWNoXG5cdCAqIFVDUy0yIGV4cG9zZXMgYXMgc2VwYXJhdGUgY2hhcmFjdGVycykgaW50byBhIHNpbmdsZSBjb2RlIHBvaW50LFxuXHQgKiBtYXRjaGluZyBVVEYtMTYuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZW5jb2RlYFxuXHQgKiBAc2VlIDxodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZGVjb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgVGhlIFVuaWNvZGUgaW5wdXQgc3RyaW5nIChVQ1MtMikuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIG5ldyBhcnJheSBvZiBjb2RlIHBvaW50cy5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJkZWNvZGUoc3RyaW5nKSB7XG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBjb3VudGVyID0gMCxcblx0XHQgICAgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcblx0XHQgICAgdmFsdWUsXG5cdFx0ICAgIGV4dHJhO1xuXHRcdHdoaWxlIChjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHR2YWx1ZSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHRcdC8vIGhpZ2ggc3Vycm9nYXRlLCBhbmQgdGhlcmUgaXMgYSBuZXh0IGNoYXJhY3RlclxuXHRcdFx0XHRleHRyYSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRcdGlmICgoZXh0cmEgJiAweEZDMDApID09IDB4REMwMCkgeyAvLyBsb3cgc3Vycm9nYXRlXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goKCh2YWx1ZSAmIDB4M0ZGKSA8PCAxMCkgKyAoZXh0cmEgJiAweDNGRikgKyAweDEwMDAwKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyB1bm1hdGNoZWQgc3Vycm9nYXRlOyBvbmx5IGFwcGVuZCB0aGlzIGNvZGUgdW5pdCwgaW4gY2FzZSB0aGUgbmV4dFxuXHRcdFx0XHRcdC8vIGNvZGUgdW5pdCBpcyB0aGUgaGlnaCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpclxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdFx0XHRjb3VudGVyLS07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgc3RyaW5nIGJhc2VkIG9uIGFuIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZGVjb2RlYFxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuXHQgKiBAbmFtZSBlbmNvZGVcblx0ICogQHBhcmFtIHtBcnJheX0gY29kZVBvaW50cyBUaGUgYXJyYXkgb2YgbnVtZXJpYyBjb2RlIHBvaW50cy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIG5ldyBVbmljb2RlIHN0cmluZyAoVUNTLTIpLlxuXHQgKi9cblx0ZnVuY3Rpb24gdWNzMmVuY29kZShhcnJheSkge1xuXHRcdHJldHVybiBtYXAoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YXIgb3V0cHV0ID0gJyc7XG5cdFx0XHRpZiAodmFsdWUgPiAweEZGRkYpIHtcblx0XHRcdFx0dmFsdWUgLT0gMHgxMDAwMDtcblx0XHRcdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMCk7XG5cdFx0XHRcdHZhbHVlID0gMHhEQzAwIHwgdmFsdWUgJiAweDNGRjtcblx0XHRcdH1cblx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIG91dHB1dDtcblx0XHR9KS5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGJhc2ljIGNvZGUgcG9pbnQgaW50byBhIGRpZ2l0L2ludGVnZXIuXG5cdCAqIEBzZWUgYGRpZ2l0VG9CYXNpYygpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gY29kZVBvaW50IFRoZSBiYXNpYyBudW1lcmljIGNvZGUgcG9pbnQgdmFsdWUuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludCAoZm9yIHVzZSBpblxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGluIHRoZSByYW5nZSBgMGAgdG8gYGJhc2UgLSAxYCwgb3IgYGJhc2VgIGlmXG5cdCAqIHRoZSBjb2RlIHBvaW50IGRvZXMgbm90IHJlcHJlc2VudCBhIHZhbHVlLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzaWNUb0RpZ2l0KGNvZGVQb2ludCkge1xuXHRcdGlmIChjb2RlUG9pbnQgLSA0OCA8IDEwKSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gMjI7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA2NSA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gNjU7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA5NyA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gOTc7XG5cdFx0fVxuXHRcdHJldHVybiBiYXNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgZGlnaXQvaW50ZWdlciBpbnRvIGEgYmFzaWMgY29kZSBwb2ludC5cblx0ICogQHNlZSBgYmFzaWNUb0RpZ2l0KClgXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBkaWdpdCBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBiYXNpYyBjb2RlIHBvaW50IHdob3NlIHZhbHVlICh3aGVuIHVzZWQgZm9yXG5cdCAqIHJlcHJlc2VudGluZyBpbnRlZ2VycykgaXMgYGRpZ2l0YCwgd2hpY2ggbmVlZHMgdG8gYmUgaW4gdGhlIHJhbmdlXG5cdCAqIGAwYCB0byBgYmFzZSAtIDFgLiBJZiBgZmxhZ2AgaXMgbm9uLXplcm8sIHRoZSB1cHBlcmNhc2UgZm9ybSBpc1xuXHQgKiB1c2VkOyBlbHNlLCB0aGUgbG93ZXJjYXNlIGZvcm0gaXMgdXNlZC4gVGhlIGJlaGF2aW9yIGlzIHVuZGVmaW5lZFxuXHQgKiBpZiBgZmxhZ2AgaXMgbm9uLXplcm8gYW5kIGBkaWdpdGAgaGFzIG5vIHVwcGVyY2FzZSBmb3JtLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlnaXRUb0Jhc2ljKGRpZ2l0LCBmbGFnKSB7XG5cdFx0Ly8gIDAuLjI1IG1hcCB0byBBU0NJSSBhLi56IG9yIEEuLlpcblx0XHQvLyAyNi4uMzUgbWFwIHRvIEFTQ0lJIDAuLjlcblx0XHRyZXR1cm4gZGlnaXQgKyAyMiArIDc1ICogKGRpZ2l0IDwgMjYpIC0gKChmbGFnICE9IDApIDw8IDUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpYXMgYWRhcHRhdGlvbiBmdW5jdGlvbiBhcyBwZXIgc2VjdGlvbiAzLjQgb2YgUkZDIDM0OTIuXG5cdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNDkyI3NlY3Rpb24tMy40XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBhZGFwdChkZWx0YSwgbnVtUG9pbnRzLCBmaXJzdFRpbWUpIHtcblx0XHR2YXIgayA9IDA7XG5cdFx0ZGVsdGEgPSBmaXJzdFRpbWUgPyBmbG9vcihkZWx0YSAvIGRhbXApIDogZGVsdGEgPj4gMTtcblx0XHRkZWx0YSArPSBmbG9vcihkZWx0YSAvIG51bVBvaW50cyk7XG5cdFx0Zm9yICgvKiBubyBpbml0aWFsaXphdGlvbiAqLzsgZGVsdGEgPiBiYXNlTWludXNUTWluICogdE1heCA+PiAxOyBrICs9IGJhc2UpIHtcblx0XHRcdGRlbHRhID0gZmxvb3IoZGVsdGEgLyBiYXNlTWludXNUTWluKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZsb29yKGsgKyAoYmFzZU1pbnVzVE1pbiArIDEpICogZGVsdGEgLyAoZGVsdGEgKyBza2V3KSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzIHRvIGEgc3RyaW5nIG9mIFVuaWNvZGVcblx0ICogc3ltYm9scy5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIHJlc3VsdGluZyBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG5cdFx0Ly8gRG9uJ3QgdXNlIFVDUy0yXG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aCxcblx0XHQgICAgb3V0LFxuXHRcdCAgICBpID0gMCxcblx0XHQgICAgbiA9IGluaXRpYWxOLFxuXHRcdCAgICBiaWFzID0gaW5pdGlhbEJpYXMsXG5cdFx0ICAgIGJhc2ljLFxuXHRcdCAgICBqLFxuXHRcdCAgICBpbmRleCxcblx0XHQgICAgb2xkaSxcblx0XHQgICAgdyxcblx0XHQgICAgayxcblx0XHQgICAgZGlnaXQsXG5cdFx0ICAgIHQsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBiYXNlTWludXNUO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50czogbGV0IGBiYXNpY2AgYmUgdGhlIG51bWJlciBvZiBpbnB1dCBjb2RlXG5cdFx0Ly8gcG9pbnRzIGJlZm9yZSB0aGUgbGFzdCBkZWxpbWl0ZXIsIG9yIGAwYCBpZiB0aGVyZSBpcyBub25lLCB0aGVuIGNvcHlcblx0XHQvLyB0aGUgZmlyc3QgYmFzaWMgY29kZSBwb2ludHMgdG8gdGhlIG91dHB1dC5cblxuXHRcdGJhc2ljID0gaW5wdXQubGFzdEluZGV4T2YoZGVsaW1pdGVyKTtcblx0XHRpZiAoYmFzaWMgPCAwKSB7XG5cdFx0XHRiYXNpYyA9IDA7XG5cdFx0fVxuXG5cdFx0Zm9yIChqID0gMDsgaiA8IGJhc2ljOyArK2opIHtcblx0XHRcdC8vIGlmIGl0J3Mgbm90IGEgYmFzaWMgY29kZSBwb2ludFxuXHRcdFx0aWYgKGlucHV0LmNoYXJDb2RlQXQoaikgPj0gMHg4MCkge1xuXHRcdFx0XHRlcnJvcignbm90LWJhc2ljJyk7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQucHVzaChpbnB1dC5jaGFyQ29kZUF0KGopKTtcblx0XHR9XG5cblx0XHQvLyBNYWluIGRlY29kaW5nIGxvb3A6IHN0YXJ0IGp1c3QgYWZ0ZXIgdGhlIGxhc3QgZGVsaW1pdGVyIGlmIGFueSBiYXNpYyBjb2RlXG5cdFx0Ly8gcG9pbnRzIHdlcmUgY29waWVkOyBzdGFydCBhdCB0aGUgYmVnaW5uaW5nIG90aGVyd2lzZS5cblxuXHRcdGZvciAoaW5kZXggPSBiYXNpYyA+IDAgPyBiYXNpYyArIDEgOiAwOyBpbmRleCA8IGlucHV0TGVuZ3RoOyAvKiBubyBmaW5hbCBleHByZXNzaW9uICovKSB7XG5cblx0XHRcdC8vIGBpbmRleGAgaXMgdGhlIGluZGV4IG9mIHRoZSBuZXh0IGNoYXJhY3RlciB0byBiZSBjb25zdW1lZC5cblx0XHRcdC8vIERlY29kZSBhIGdlbmVyYWxpemVkIHZhcmlhYmxlLWxlbmd0aCBpbnRlZ2VyIGludG8gYGRlbHRhYCxcblx0XHRcdC8vIHdoaWNoIGdldHMgYWRkZWQgdG8gYGlgLiBUaGUgb3ZlcmZsb3cgY2hlY2tpbmcgaXMgZWFzaWVyXG5cdFx0XHQvLyBpZiB3ZSBpbmNyZWFzZSBgaWAgYXMgd2UgZ28sIHRoZW4gc3VidHJhY3Qgb2ZmIGl0cyBzdGFydGluZ1xuXHRcdFx0Ly8gdmFsdWUgYXQgdGhlIGVuZCB0byBvYnRhaW4gYGRlbHRhYC5cblx0XHRcdGZvciAob2xkaSA9IGksIHcgPSAxLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblxuXHRcdFx0XHRpZiAoaW5kZXggPj0gaW5wdXRMZW5ndGgpIHtcblx0XHRcdFx0XHRlcnJvcignaW52YWxpZC1pbnB1dCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlnaXQgPSBiYXNpY1RvRGlnaXQoaW5wdXQuY2hhckNvZGVBdChpbmRleCsrKSk7XG5cblx0XHRcdFx0aWYgKGRpZ2l0ID49IGJhc2UgfHwgZGlnaXQgPiBmbG9vcigobWF4SW50IC0gaSkgLyB3KSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aSArPSBkaWdpdCAqIHc7XG5cdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA8IHQpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0aWYgKHcgPiBmbG9vcihtYXhJbnQgLyBiYXNlTWludXNUKSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dyAqPSBiYXNlTWludXNUO1xuXG5cdFx0XHR9XG5cblx0XHRcdG91dCA9IG91dHB1dC5sZW5ndGggKyAxO1xuXHRcdFx0YmlhcyA9IGFkYXB0KGkgLSBvbGRpLCBvdXQsIG9sZGkgPT0gMCk7XG5cblx0XHRcdC8vIGBpYCB3YXMgc3VwcG9zZWQgdG8gd3JhcCBhcm91bmQgZnJvbSBgb3V0YCB0byBgMGAsXG5cdFx0XHQvLyBpbmNyZW1lbnRpbmcgYG5gIGVhY2ggdGltZSwgc28gd2UnbGwgZml4IHRoYXQgbm93OlxuXHRcdFx0aWYgKGZsb29yKGkgLyBvdXQpID4gbWF4SW50IC0gbikge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0biArPSBmbG9vcihpIC8gb3V0KTtcblx0XHRcdGkgJT0gb3V0O1xuXG5cdFx0XHQvLyBJbnNlcnQgYG5gIGF0IHBvc2l0aW9uIGBpYCBvZiB0aGUgb3V0cHV0XG5cdFx0XHRvdXRwdXQuc3BsaWNlKGkrKywgMCwgbik7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdWNzMmVuY29kZShvdXRwdXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scyAoZS5nLiBhIGRvbWFpbiBuYW1lIGxhYmVsKSB0byBhXG5cdCAqIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGVuY29kZShpbnB1dCkge1xuXHRcdHZhciBuLFxuXHRcdCAgICBkZWx0YSxcblx0XHQgICAgaGFuZGxlZENQQ291bnQsXG5cdFx0ICAgIGJhc2ljTGVuZ3RoLFxuXHRcdCAgICBiaWFzLFxuXHRcdCAgICBqLFxuXHRcdCAgICBtLFxuXHRcdCAgICBxLFxuXHRcdCAgICBrLFxuXHRcdCAgICB0LFxuXHRcdCAgICBjdXJyZW50VmFsdWUsXG5cdFx0ICAgIG91dHB1dCA9IFtdLFxuXHRcdCAgICAvKiogYGlucHV0TGVuZ3RoYCB3aWxsIGhvbGQgdGhlIG51bWJlciBvZiBjb2RlIHBvaW50cyBpbiBgaW5wdXRgLiAqL1xuXHRcdCAgICBpbnB1dExlbmd0aCxcblx0XHQgICAgLyoqIENhY2hlZCBjYWxjdWxhdGlvbiByZXN1bHRzICovXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50UGx1c09uZSxcblx0XHQgICAgYmFzZU1pbnVzVCxcblx0XHQgICAgcU1pbnVzVDtcblxuXHRcdC8vIENvbnZlcnQgdGhlIGlucHV0IGluIFVDUy0yIHRvIFVuaWNvZGVcblx0XHRpbnB1dCA9IHVjczJkZWNvZGUoaW5wdXQpO1xuXG5cdFx0Ly8gQ2FjaGUgdGhlIGxlbmd0aFxuXHRcdGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgc3RhdGVcblx0XHRuID0gaW5pdGlhbE47XG5cdFx0ZGVsdGEgPSAwO1xuXHRcdGJpYXMgPSBpbml0aWFsQmlhcztcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHNcblx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgMHg4MCkge1xuXHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoY3VycmVudFZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aGFuZGxlZENQQ291bnQgPSBiYXNpY0xlbmd0aCA9IG91dHB1dC5sZW5ndGg7XG5cblx0XHQvLyBgaGFuZGxlZENQQ291bnRgIGlzIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgdGhhdCBoYXZlIGJlZW4gaGFuZGxlZDtcblx0XHQvLyBgYmFzaWNMZW5ndGhgIGlzIHRoZSBudW1iZXIgb2YgYmFzaWMgY29kZSBwb2ludHMuXG5cblx0XHQvLyBGaW5pc2ggdGhlIGJhc2ljIHN0cmluZyAtIGlmIGl0IGlzIG5vdCBlbXB0eSAtIHdpdGggYSBkZWxpbWl0ZXJcblx0XHRpZiAoYmFzaWNMZW5ndGgpIHtcblx0XHRcdG91dHB1dC5wdXNoKGRlbGltaXRlcik7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBlbmNvZGluZyBsb29wOlxuXHRcdHdoaWxlIChoYW5kbGVkQ1BDb3VudCA8IGlucHV0TGVuZ3RoKSB7XG5cblx0XHRcdC8vIEFsbCBub24tYmFzaWMgY29kZSBwb2ludHMgPCBuIGhhdmUgYmVlbiBoYW5kbGVkIGFscmVhZHkuIEZpbmQgdGhlIG5leHRcblx0XHRcdC8vIGxhcmdlciBvbmU6XG5cdFx0XHRmb3IgKG0gPSBtYXhJbnQsIGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA+PSBuICYmIGN1cnJlbnRWYWx1ZSA8IG0pIHtcblx0XHRcdFx0XHRtID0gY3VycmVudFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEluY3JlYXNlIGBkZWx0YWAgZW5vdWdoIHRvIGFkdmFuY2UgdGhlIGRlY29kZXIncyA8bixpPiBzdGF0ZSB0byA8bSwwPixcblx0XHRcdC8vIGJ1dCBndWFyZCBhZ2FpbnN0IG92ZXJmbG93XG5cdFx0XHRoYW5kbGVkQ1BDb3VudFBsdXNPbmUgPSBoYW5kbGVkQ1BDb3VudCArIDE7XG5cdFx0XHRpZiAobSAtIG4gPiBmbG9vcigobWF4SW50IC0gZGVsdGEpIC8gaGFuZGxlZENQQ291bnRQbHVzT25lKSkge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsdGEgKz0gKG0gLSBuKSAqIGhhbmRsZWRDUENvdW50UGx1c09uZTtcblx0XHRcdG4gPSBtO1xuXG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgbiAmJiArK2RlbHRhID4gbWF4SW50KSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlID09IG4pIHtcblx0XHRcdFx0XHQvLyBSZXByZXNlbnQgZGVsdGEgYXMgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlclxuXHRcdFx0XHRcdGZvciAocSA9IGRlbHRhLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblx0XHRcdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXHRcdFx0XHRcdFx0aWYgKHEgPCB0KSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cU1pbnVzVCA9IHEgLSB0O1xuXHRcdFx0XHRcdFx0YmFzZU1pbnVzVCA9IGJhc2UgLSB0O1xuXHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goXG5cdFx0XHRcdFx0XHRcdHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWModCArIHFNaW51c1QgJSBiYXNlTWludXNULCAwKSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRxID0gZmxvb3IocU1pbnVzVCAvIGJhc2VNaW51c1QpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWMocSwgMCkpKTtcblx0XHRcdFx0XHRiaWFzID0gYWRhcHQoZGVsdGEsIGhhbmRsZWRDUENvdW50UGx1c09uZSwgaGFuZGxlZENQQ291bnQgPT0gYmFzaWNMZW5ndGgpO1xuXHRcdFx0XHRcdGRlbHRhID0gMDtcblx0XHRcdFx0XHQrK2hhbmRsZWRDUENvdW50O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdCsrZGVsdGE7XG5cdFx0XHQrK247XG5cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dC5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzXG5cdCAqIHRvIFVuaWNvZGUuIE9ubHkgdGhlIFB1bnljb2RlZCBwYXJ0cyBvZiB0aGUgaW5wdXQgd2lsbCBiZSBjb252ZXJ0ZWQsIGkuZS5cblx0ICogaXQgZG9lc24ndCBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgb24gYSBzdHJpbmcgdGhhdCBoYXMgYWxyZWFkeSBiZWVuXG5cdCAqIGNvbnZlcnRlZCB0byBVbmljb2RlLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBQdW55Y29kZWQgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcyB0b1xuXHQgKiBjb252ZXJ0IHRvIFVuaWNvZGUuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBVbmljb2RlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBQdW55Y29kZVxuXHQgKiBzdHJpbmcuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b1VuaWNvZGUoaW5wdXQpIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleFB1bnljb2RlLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/IGRlY29kZShzdHJpbmcuc2xpY2UoNCkudG9Mb3dlckNhc2UoKSlcblx0XHRcdFx0OiBzdHJpbmc7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBVbmljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzIHRvXG5cdCAqIFB1bnljb2RlLiBPbmx5IHRoZSBub24tQVNDSUkgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHdpbGwgYmUgY29udmVydGVkLFxuXHQgKiBpLmUuIGl0IGRvZXNuJ3QgbWF0dGVyIGlmIHlvdSBjYWxsIGl0IHdpdGggYSBkb21haW4gdGhhdCdzIGFscmVhZHkgaW5cblx0ICogQVNDSUkuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MgdG8gY29udmVydCwgYXMgYVxuXHQgKiBVbmljb2RlIHN0cmluZy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFB1bnljb2RlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBkb21haW4gbmFtZSBvclxuXHQgKiBlbWFpbCBhZGRyZXNzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9BU0NJSShpbnB1dCkge1xuXHRcdHJldHVybiBtYXBEb21haW4oaW5wdXQsIGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHJlZ2V4Tm9uQVNDSUkudGVzdChzdHJpbmcpXG5cdFx0XHRcdD8gJ3huLS0nICsgZW5jb2RlKHN0cmluZylcblx0XHRcdFx0OiBzdHJpbmc7XG5cdFx0fSk7XG5cdH1cblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHQvKiogRGVmaW5lIHRoZSBwdWJsaWMgQVBJICovXG5cdHB1bnljb2RlID0ge1xuXHRcdC8qKlxuXHRcdCAqIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBQdW55Y29kZS5qcyB2ZXJzaW9uIG51bWJlci5cblx0XHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0XHQgKiBAdHlwZSBTdHJpbmdcblx0XHQgKi9cblx0XHQndmVyc2lvbic6ICcxLjQuMScsXG5cdFx0LyoqXG5cdFx0ICogQW4gb2JqZWN0IG9mIG1ldGhvZHMgdG8gY29udmVydCBmcm9tIEphdmFTY3JpcHQncyBpbnRlcm5hbCBjaGFyYWN0ZXJcblx0XHQgKiByZXByZXNlbnRhdGlvbiAoVUNTLTIpIHRvIFVuaWNvZGUgY29kZSBwb2ludHMsIGFuZCBiYWNrLlxuXHRcdCAqIEBzZWUgPGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nPlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIE9iamVjdFxuXHRcdCAqL1xuXHRcdCd1Y3MyJzoge1xuXHRcdFx0J2RlY29kZSc6IHVjczJkZWNvZGUsXG5cdFx0XHQnZW5jb2RlJzogdWNzMmVuY29kZVxuXHRcdH0sXG5cdFx0J2RlY29kZSc6IGRlY29kZSxcblx0XHQnZW5jb2RlJzogZW5jb2RlLFxuXHRcdCd0b0FTQ0lJJzogdG9BU0NJSSxcblx0XHQndG9Vbmljb2RlJzogdG9Vbmljb2RlXG5cdH07XG5cblx0LyoqIEV4cG9zZSBgcHVueWNvZGVgICovXG5cdC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIHNwZWNpZmljIGNvbmRpdGlvbiBwYXR0ZXJuc1xuXHQvLyBsaWtlIHRoZSBmb2xsb3dpbmc6XG5cdGlmIChcblx0XHR0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJlxuXHRcdGRlZmluZS5hbWRcblx0KSB7XG5cdFx0ZGVmaW5lKCdwdW55Y29kZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHB1bnljb2RlO1xuXHRcdH0pO1xuXHR9IGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcblx0XHRpZiAobW9kdWxlLmV4cG9ydHMgPT0gZnJlZUV4cG9ydHMpIHtcblx0XHRcdC8vIGluIE5vZGUuanMsIGlvLmpzLCBvciBSaW5nb0pTIHYwLjguMCtcblx0XHRcdGZyZWVNb2R1bGUuZXhwb3J0cyA9IHB1bnljb2RlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBpbiBOYXJ3aGFsIG9yIFJpbmdvSlMgdjAuNy4wLVxuXHRcdFx0Zm9yIChrZXkgaW4gcHVueWNvZGUpIHtcblx0XHRcdFx0cHVueWNvZGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAoZnJlZUV4cG9ydHNba2V5XSA9IHB1bnljb2RlW2tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvLyBpbiBSaGlubyBvciBhIHdlYiBicm93c2VyXG5cdFx0cm9vdC5wdW55Y29kZSA9IHB1bnljb2RlO1xuXHR9XG5cbn0odGhpcykpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnlQcmltaXRpdmUgPSBmdW5jdGlvbih2KSB7XG4gIHN3aXRjaCAodHlwZW9mIHYpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHY7XG5cbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2ID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gaXNGaW5pdGUodikgPyB2IDogJyc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwgc2VwLCBlcSwgbmFtZSkge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIG9iaiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBtYXAob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihrKSB7XG4gICAgICB2YXIga3MgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuICAgICAgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgICByZXR1cm4gbWFwKG9ialtrXSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuZnVuY3Rpb24gbWFwICh4cywgZikge1xuICBpZiAoeHMubWFwKSByZXR1cm4geHMubWFwKGYpO1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICByZXMucHVzaChmKHhzW2ldLCBpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG4iLCJ2YXIgcmFuZG9tID0gcmVxdWlyZShcInJuZFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb2xvcjtcblxuZnVuY3Rpb24gY29sb3IgKG1heCwgbWluKSB7XG4gIG1heCB8fCAobWF4ID0gMjU1KTtcbiAgcmV0dXJuICdyZ2IoJyArIHJhbmRvbShtYXgsIG1pbikgKyAnLCAnICsgcmFuZG9tKG1heCwgbWluKSArICcsICcgKyByYW5kb20obWF4LCBtaW4pICsgJyknO1xufVxuIiwidmFyIHJlbGF0aXZlRGF0ZSA9IChmdW5jdGlvbih1bmRlZmluZWQpe1xuXG4gIHZhciBTRUNPTkQgPSAxMDAwLFxuICAgICAgTUlOVVRFID0gNjAgKiBTRUNPTkQsXG4gICAgICBIT1VSID0gNjAgKiBNSU5VVEUsXG4gICAgICBEQVkgPSAyNCAqIEhPVVIsXG4gICAgICBXRUVLID0gNyAqIERBWSxcbiAgICAgIFlFQVIgPSBEQVkgKiAzNjUsXG4gICAgICBNT05USCA9IFlFQVIgLyAxMjtcblxuICB2YXIgZm9ybWF0cyA9IFtcbiAgICBbIDAuNyAqIE1JTlVURSwgJ2p1c3Qgbm93JyBdLFxuICAgIFsgMS41ICogTUlOVVRFLCAnYSBtaW51dGUgYWdvJyBdLFxuICAgIFsgNjAgKiBNSU5VVEUsICdtaW51dGVzIGFnbycsIE1JTlVURSBdLFxuICAgIFsgMS41ICogSE9VUiwgJ2FuIGhvdXIgYWdvJyBdLFxuICAgIFsgREFZLCAnaG91cnMgYWdvJywgSE9VUiBdLFxuICAgIFsgMiAqIERBWSwgJ3llc3RlcmRheScgXSxcbiAgICBbIDcgKiBEQVksICdkYXlzIGFnbycsIERBWSBdLFxuICAgIFsgMS41ICogV0VFSywgJ2Egd2VlayBhZ28nXSxcbiAgICBbIE1PTlRILCAnd2Vla3MgYWdvJywgV0VFSyBdLFxuICAgIFsgMS41ICogTU9OVEgsICdhIG1vbnRoIGFnbycgXSxcbiAgICBbIFlFQVIsICdtb250aHMgYWdvJywgTU9OVEggXSxcbiAgICBbIDEuNSAqIFlFQVIsICdhIHllYXIgYWdvJyBdLFxuICAgIFsgTnVtYmVyLk1BWF9WQUxVRSwgJ3llYXJzIGFnbycsIFlFQVIgXVxuICBdO1xuXG4gIGZ1bmN0aW9uIHJlbGF0aXZlRGF0ZShpbnB1dCxyZWZlcmVuY2Upe1xuICAgICFyZWZlcmVuY2UgJiYgKCByZWZlcmVuY2UgPSAobmV3IERhdGUpLmdldFRpbWUoKSApO1xuICAgIHJlZmVyZW5jZSBpbnN0YW5jZW9mIERhdGUgJiYgKCByZWZlcmVuY2UgPSByZWZlcmVuY2UuZ2V0VGltZSgpICk7XG4gICAgaW5wdXQgaW5zdGFuY2VvZiBEYXRlICYmICggaW5wdXQgPSBpbnB1dC5nZXRUaW1lKCkgKTtcbiAgICBcbiAgICB2YXIgZGVsdGEgPSByZWZlcmVuY2UgLSBpbnB1dCxcbiAgICAgICAgZm9ybWF0LCBpLCBsZW47XG5cbiAgICBmb3IoaSA9IC0xLCBsZW49Zm9ybWF0cy5sZW5ndGg7ICsraSA8IGxlbjsgKXtcbiAgICAgIGZvcm1hdCA9IGZvcm1hdHNbaV07XG4gICAgICBpZihkZWx0YSA8IGZvcm1hdFswXSl7XG4gICAgICAgIHJldHVybiBmb3JtYXRbMl0gPT0gdW5kZWZpbmVkID8gZm9ybWF0WzFdIDogTWF0aC5yb3VuZChkZWx0YS9mb3JtYXRbMl0pICsgJyAnICsgZm9ybWF0WzFdO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gcmVsYXRpdmVEYXRlO1xuXG59KSgpO1xuXG5pZih0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKXtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZWxhdGl2ZURhdGU7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJhbmRvbTtcblxuZnVuY3Rpb24gcmFuZG9tIChtYXgsIG1pbikge1xuICBtYXggfHwgKG1heCA9IDk5OTk5OTk5OTk5OSk7XG4gIG1pbiB8fCAobWluID0gMCk7XG5cbiAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKTtcbn1cbiIsIlxubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdhJyxcbiAgJ2FuJyxcbiAgJ2FuZCcsXG4gICdhcycsXG4gICdhdCcsXG4gICdidXQnLFxuICAnYnknLFxuICAnZW4nLFxuICAnZm9yJyxcbiAgJ2Zyb20nLFxuICAnaG93JyxcbiAgJ2lmJyxcbiAgJ2luJyxcbiAgJ25laXRoZXInLFxuICAnbm9yJyxcbiAgJ29mJyxcbiAgJ29uJyxcbiAgJ29ubHknLFxuICAnb250bycsXG4gICdvdXQnLFxuICAnb3InLFxuICAncGVyJyxcbiAgJ3NvJyxcbiAgJ3RoYW4nLFxuICAndGhhdCcsXG4gICd0aGUnLFxuICAndG8nLFxuICAndW50aWwnLFxuICAndXAnLFxuICAndXBvbicsXG4gICd2JyxcbiAgJ3YuJyxcbiAgJ3ZlcnN1cycsXG4gICd2cycsXG4gICd2cy4nLFxuICAndmlhJyxcbiAgJ3doZW4nLFxuICAnd2l0aCcsXG4gICd3aXRob3V0JyxcbiAgJ3lldCdcbl07IiwidmFyIHRvVGl0bGUgPSByZXF1aXJlKFwidG8tdGl0bGVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gdXJsVG9UaXRsZTtcblxuZnVuY3Rpb24gdXJsVG9UaXRsZSAodXJsKSB7XG4gIHVybCA9IHVuZXNjYXBlKHVybCkucmVwbGFjZSgvXy9nLCAnICcpO1xuICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcdys6XFwvXFwvLywgJycpO1xuICB1cmwgPSB1cmwucmVwbGFjZSgvXnd3d1xcLi8sICcnKTtcbiAgdXJsID0gdXJsLnJlcGxhY2UoLyhcXC98XFw/KSQvLCAnJyk7XG5cbiAgdmFyIHBhcnRzID0gdXJsLnNwbGl0KCc/Jyk7XG4gIHVybCA9IHBhcnRzWzBdO1xuICB1cmwgPSB1cmwucmVwbGFjZSgvXFwuXFx3KyQvLCAnJyk7XG5cbiAgcGFydHMgPSB1cmwuc3BsaXQoJy8nKTtcblxuICB2YXIgbmFtZSA9IHBhcnRzWzBdO1xuICBuYW1lID0gbmFtZS5yZXBsYWNlKC9cXC5cXHcrKFxcL3wkKS8sICcnKS5yZXBsYWNlKC9cXC4oY29tP3xuZXR8b3JnfGZyKSQvLCAnJylcblxuICBpZiAocGFydHMubGVuZ3RoID09IDEpIHtcbiAgICByZXR1cm4gdGl0bGUobmFtZSk7XG4gIH1cblxuICByZXR1cm4gdG9UaXRsZShwYXJ0cy5zbGljZSgxKS5yZXZlcnNlKCkubWFwKHRvVGl0bGUpLmpvaW4oJyAtICcpKSArICcgb24gJyArIHRpdGxlKG5hbWUpO1xufVxuXG5mdW5jdGlvbiB0aXRsZSAoaG9zdCkge1xuICBpZiAoL15bXFx3XFwuXFwtXSs6XFxkKy8udGVzdChob3N0KSkge1xuICAgIHJldHVybiBob3N0XG4gIH1cblxuICByZXR1cm4gdG9UaXRsZShob3N0LnNwbGl0KCcuJykuam9pbignLCAnKSlcbn1cbiIsIlxudmFyIGNsZWFuID0gcmVxdWlyZSgndG8tbm8tY2FzZScpO1xuXG5cbi8qKlxuICogRXhwb3NlIGB0b0NhcGl0YWxDYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvQ2FwaXRhbENhc2U7XG5cblxuLyoqXG4gKiBDb252ZXJ0IGEgYHN0cmluZ2AgdG8gY2FwaXRhbCBjYXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5cbmZ1bmN0aW9uIHRvQ2FwaXRhbENhc2UgKHN0cmluZykge1xuICByZXR1cm4gY2xlYW4oc3RyaW5nKS5yZXBsYWNlKC8oXnxcXHMpKFxcdykvZywgZnVuY3Rpb24gKG1hdGNoZXMsIHByZXZpb3VzLCBsZXR0ZXIpIHtcbiAgICByZXR1cm4gcHJldmlvdXMgKyBsZXR0ZXIudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59IiwiXG4vKipcbiAqIEV4cG9zZSBgdG9Ob0Nhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdG9Ob0Nhc2U7XG5cblxuLyoqXG4gKiBUZXN0IHdoZXRoZXIgYSBzdHJpbmcgaXMgY2FtZWwtY2FzZS5cbiAqL1xuXG52YXIgaGFzU3BhY2UgPSAvXFxzLztcbnZhciBoYXNDYW1lbCA9IC9bYS16XVtBLVpdLztcbnZhciBoYXNTZXBhcmF0b3IgPSAvW1xcV19dLztcblxuXG4vKipcbiAqIFJlbW92ZSBhbnkgc3RhcnRpbmcgY2FzZSBmcm9tIGEgYHN0cmluZ2AsIGxpa2UgY2FtZWwgb3Igc25ha2UsIGJ1dCBrZWVwXG4gKiBzcGFjZXMgYW5kIHB1bmN0dWF0aW9uIHRoYXQgbWF5IGJlIGltcG9ydGFudCBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHRvTm9DYXNlIChzdHJpbmcpIHtcbiAgaWYgKGhhc1NwYWNlLnRlc3Qoc3RyaW5nKSkgcmV0dXJuIHN0cmluZy50b0xvd2VyQ2FzZSgpO1xuXG4gIGlmIChoYXNTZXBhcmF0b3IudGVzdChzdHJpbmcpKSBzdHJpbmcgPSB1bnNlcGFyYXRlKHN0cmluZyk7XG4gIGlmIChoYXNDYW1lbC50ZXN0KHN0cmluZykpIHN0cmluZyA9IHVuY2FtZWxpemUoc3RyaW5nKTtcbiAgcmV0dXJuIHN0cmluZy50b0xvd2VyQ2FzZSgpO1xufVxuXG5cbi8qKlxuICogU2VwYXJhdG9yIHNwbGl0dGVyLlxuICovXG5cbnZhciBzZXBhcmF0b3JTcGxpdHRlciA9IC9bXFxXX10rKC58JCkvZztcblxuXG4vKipcbiAqIFVuLXNlcGFyYXRlIGEgYHN0cmluZ2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHVuc2VwYXJhdGUgKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2Uoc2VwYXJhdG9yU3BsaXR0ZXIsIGZ1bmN0aW9uIChtLCBuZXh0KSB7XG4gICAgcmV0dXJuIG5leHQgPyAnICcgKyBuZXh0IDogJyc7XG4gIH0pO1xufVxuXG5cbi8qKlxuICogQ2FtZWxjYXNlIHNwbGl0dGVyLlxuICovXG5cbnZhciBjYW1lbFNwbGl0dGVyID0gLyguKShbQS1aXSspL2c7XG5cblxuLyoqXG4gKiBVbi1jYW1lbGNhc2UgYSBgc3RyaW5nYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gdW5jYW1lbGl6ZSAoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShjYW1lbFNwbGl0dGVyLCBmdW5jdGlvbiAobSwgcHJldmlvdXMsIHVwcGVycykge1xuICAgIHJldHVybiBwcmV2aW91cyArICcgJyArIHVwcGVycy50b0xvd2VyQ2FzZSgpLnNwbGl0KCcnKS5qb2luKCcgJyk7XG4gIH0pO1xufSIsInZhciBlc2NhcGUgPSByZXF1aXJlKCdlc2NhcGUtcmVnZXhwLWNvbXBvbmVudCcpO1xudmFyIGNhcGl0YWwgPSByZXF1aXJlKCd0by1jYXBpdGFsLWNhc2UnKTtcbnZhciBtaW5vcnMgPSByZXF1aXJlKCd0aXRsZS1jYXNlLW1pbm9ycycpO1xuXG4vKipcbiAqIEV4cG9zZSBgdG9UaXRsZUNhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdG9UaXRsZUNhc2U7XG5cblxuLyoqXG4gKiBNaW5vcnMuXG4gKi9cblxudmFyIGVzY2FwZWQgPSBtaW5vcnMubWFwKGVzY2FwZSk7XG52YXIgbWlub3JNYXRjaGVyID0gbmV3IFJlZ0V4cCgnW15eXVxcXFxiKCcgKyBlc2NhcGVkLmpvaW4oJ3wnKSArICcpXFxcXGInLCAnaWcnKTtcbnZhciBjb2xvbk1hdGNoZXIgPSAvOlxccyooXFx3KS9nO1xuXG5cbi8qKlxuICogQ29udmVydCBhIGBzdHJpbmdgIHRvIGNhbWVsIGNhc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cblxuZnVuY3Rpb24gdG9UaXRsZUNhc2UgKHN0cmluZykge1xuICByZXR1cm4gY2FwaXRhbChzdHJpbmcpXG4gICAgLnJlcGxhY2UobWlub3JNYXRjaGVyLCBmdW5jdGlvbiAobWlub3IpIHtcbiAgICAgIHJldHVybiBtaW5vci50b0xvd2VyQ2FzZSgpO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoY29sb25NYXRjaGVyLCBmdW5jdGlvbiAobGV0dGVyKSB7XG4gICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHVueWNvZGUgPSByZXF1aXJlKCdwdW55Y29kZScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuZXhwb3J0cy5wYXJzZSA9IHVybFBhcnNlO1xuZXhwb3J0cy5yZXNvbHZlID0gdXJsUmVzb2x2ZTtcbmV4cG9ydHMucmVzb2x2ZU9iamVjdCA9IHVybFJlc29sdmVPYmplY3Q7XG5leHBvcnRzLmZvcm1hdCA9IHVybEZvcm1hdDtcblxuZXhwb3J0cy5VcmwgPSBVcmw7XG5cbmZ1bmN0aW9uIFVybCgpIHtcbiAgdGhpcy5wcm90b2NvbCA9IG51bGw7XG4gIHRoaXMuc2xhc2hlcyA9IG51bGw7XG4gIHRoaXMuYXV0aCA9IG51bGw7XG4gIHRoaXMuaG9zdCA9IG51bGw7XG4gIHRoaXMucG9ydCA9IG51bGw7XG4gIHRoaXMuaG9zdG5hbWUgPSBudWxsO1xuICB0aGlzLmhhc2ggPSBudWxsO1xuICB0aGlzLnNlYXJjaCA9IG51bGw7XG4gIHRoaXMucXVlcnkgPSBudWxsO1xuICB0aGlzLnBhdGhuYW1lID0gbnVsbDtcbiAgdGhpcy5wYXRoID0gbnVsbDtcbiAgdGhpcy5ocmVmID0gbnVsbDtcbn1cblxuLy8gUmVmZXJlbmNlOiBSRkMgMzk4NiwgUkZDIDE4MDgsIFJGQyAyMzk2XG5cbi8vIGRlZmluZSB0aGVzZSBoZXJlIHNvIGF0IGxlYXN0IHRoZXkgb25seSBoYXZlIHRvIGJlXG4vLyBjb21waWxlZCBvbmNlIG9uIHRoZSBmaXJzdCBtb2R1bGUgbG9hZC5cbnZhciBwcm90b2NvbFBhdHRlcm4gPSAvXihbYS16MC05ListXSs6KS9pLFxuICAgIHBvcnRQYXR0ZXJuID0gLzpbMC05XSokLyxcblxuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgYSBzaW1wbGUgcGF0aCBVUkxcbiAgICBzaW1wbGVQYXRoUGF0dGVybiA9IC9eKFxcL1xcLz8oPyFcXC8pW15cXD9cXHNdKikoXFw/W15cXHNdKik/JC8sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyByZXNlcnZlZCBmb3IgZGVsaW1pdGluZyBVUkxzLlxuICAgIC8vIFdlIGFjdHVhbGx5IGp1c3QgYXV0by1lc2NhcGUgdGhlc2UuXG4gICAgZGVsaW1zID0gWyc8JywgJz4nLCAnXCInLCAnYCcsICcgJywgJ1xccicsICdcXG4nLCAnXFx0J10sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyBub3QgYWxsb3dlZCBmb3IgdmFyaW91cyByZWFzb25zLlxuICAgIHVud2lzZSA9IFsneycsICd9JywgJ3wnLCAnXFxcXCcsICdeJywgJ2AnXS5jb25jYXQoZGVsaW1zKSxcblxuICAgIC8vIEFsbG93ZWQgYnkgUkZDcywgYnV0IGNhdXNlIG9mIFhTUyBhdHRhY2tzLiAgQWx3YXlzIGVzY2FwZSB0aGVzZS5cbiAgICBhdXRvRXNjYXBlID0gWydcXCcnXS5jb25jYXQodW53aXNlKSxcbiAgICAvLyBDaGFyYWN0ZXJzIHRoYXQgYXJlIG5ldmVyIGV2ZXIgYWxsb3dlZCBpbiBhIGhvc3RuYW1lLlxuICAgIC8vIE5vdGUgdGhhdCBhbnkgaW52YWxpZCBjaGFycyBhcmUgYWxzbyBoYW5kbGVkLCBidXQgdGhlc2VcbiAgICAvLyBhcmUgdGhlIG9uZXMgdGhhdCBhcmUgKmV4cGVjdGVkKiB0byBiZSBzZWVuLCBzbyB3ZSBmYXN0LXBhdGhcbiAgICAvLyB0aGVtLlxuICAgIG5vbkhvc3RDaGFycyA9IFsnJScsICcvJywgJz8nLCAnOycsICcjJ10uY29uY2F0KGF1dG9Fc2NhcGUpLFxuICAgIGhvc3RFbmRpbmdDaGFycyA9IFsnLycsICc/JywgJyMnXSxcbiAgICBob3N0bmFtZU1heExlbiA9IDI1NSxcbiAgICBob3N0bmFtZVBhcnRQYXR0ZXJuID0gL15bK2EtejAtOUEtWl8tXXswLDYzfSQvLFxuICAgIGhvc3RuYW1lUGFydFN0YXJ0ID0gL14oWythLXowLTlBLVpfLV17MCw2M30pKC4qKSQvLFxuICAgIC8vIHByb3RvY29scyB0aGF0IGNhbiBhbGxvdyBcInVuc2FmZVwiIGFuZCBcInVud2lzZVwiIGNoYXJzLlxuICAgIHVuc2FmZVByb3RvY29sID0ge1xuICAgICAgJ2phdmFzY3JpcHQnOiB0cnVlLFxuICAgICAgJ2phdmFzY3JpcHQ6JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgbmV2ZXIgaGF2ZSBhIGhvc3RuYW1lLlxuICAgIGhvc3RsZXNzUHJvdG9jb2wgPSB7XG4gICAgICAnamF2YXNjcmlwdCc6IHRydWUsXG4gICAgICAnamF2YXNjcmlwdDonOiB0cnVlXG4gICAgfSxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBhbHdheXMgY29udGFpbiBhIC8vIGJpdC5cbiAgICBzbGFzaGVkUHJvdG9jb2wgPSB7XG4gICAgICAnaHR0cCc6IHRydWUsXG4gICAgICAnaHR0cHMnOiB0cnVlLFxuICAgICAgJ2Z0cCc6IHRydWUsXG4gICAgICAnZ29waGVyJzogdHJ1ZSxcbiAgICAgICdmaWxlJzogdHJ1ZSxcbiAgICAgICdodHRwOic6IHRydWUsXG4gICAgICAnaHR0cHM6JzogdHJ1ZSxcbiAgICAgICdmdHA6JzogdHJ1ZSxcbiAgICAgICdnb3BoZXI6JzogdHJ1ZSxcbiAgICAgICdmaWxlOic6IHRydWVcbiAgICB9LFxuICAgIHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcblxuZnVuY3Rpb24gdXJsUGFyc2UodXJsLCBwYXJzZVF1ZXJ5U3RyaW5nLCBzbGFzaGVzRGVub3RlSG9zdCkge1xuICBpZiAodXJsICYmIHV0aWwuaXNPYmplY3QodXJsKSAmJiB1cmwgaW5zdGFuY2VvZiBVcmwpIHJldHVybiB1cmw7XG5cbiAgdmFyIHUgPSBuZXcgVXJsO1xuICB1LnBhcnNlKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpO1xuICByZXR1cm4gdTtcbn1cblxuVXJsLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpIHtcbiAgaWYgKCF1dGlsLmlzU3RyaW5nKHVybCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGFyYW1ldGVyICd1cmwnIG11c3QgYmUgYSBzdHJpbmcsIG5vdCBcIiArIHR5cGVvZiB1cmwpO1xuICB9XG5cbiAgLy8gQ29weSBjaHJvbWUsIElFLCBvcGVyYSBiYWNrc2xhc2gtaGFuZGxpbmcgYmVoYXZpb3IuXG4gIC8vIEJhY2sgc2xhc2hlcyBiZWZvcmUgdGhlIHF1ZXJ5IHN0cmluZyBnZXQgY29udmVydGVkIHRvIGZvcndhcmQgc2xhc2hlc1xuICAvLyBTZWU6IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0yNTkxNlxuICB2YXIgcXVlcnlJbmRleCA9IHVybC5pbmRleE9mKCc/JyksXG4gICAgICBzcGxpdHRlciA9XG4gICAgICAgICAgKHF1ZXJ5SW5kZXggIT09IC0xICYmIHF1ZXJ5SW5kZXggPCB1cmwuaW5kZXhPZignIycpKSA/ICc/JyA6ICcjJyxcbiAgICAgIHVTcGxpdCA9IHVybC5zcGxpdChzcGxpdHRlciksXG4gICAgICBzbGFzaFJlZ2V4ID0gL1xcXFwvZztcbiAgdVNwbGl0WzBdID0gdVNwbGl0WzBdLnJlcGxhY2Uoc2xhc2hSZWdleCwgJy8nKTtcbiAgdXJsID0gdVNwbGl0LmpvaW4oc3BsaXR0ZXIpO1xuXG4gIHZhciByZXN0ID0gdXJsO1xuXG4gIC8vIHRyaW0gYmVmb3JlIHByb2NlZWRpbmcuXG4gIC8vIFRoaXMgaXMgdG8gc3VwcG9ydCBwYXJzZSBzdHVmZiBsaWtlIFwiICBodHRwOi8vZm9vLmNvbSAgXFxuXCJcbiAgcmVzdCA9IHJlc3QudHJpbSgpO1xuXG4gIGlmICghc2xhc2hlc0Rlbm90ZUhvc3QgJiYgdXJsLnNwbGl0KCcjJykubGVuZ3RoID09PSAxKSB7XG4gICAgLy8gVHJ5IGZhc3QgcGF0aCByZWdleHBcbiAgICB2YXIgc2ltcGxlUGF0aCA9IHNpbXBsZVBhdGhQYXR0ZXJuLmV4ZWMocmVzdCk7XG4gICAgaWYgKHNpbXBsZVBhdGgpIHtcbiAgICAgIHRoaXMucGF0aCA9IHJlc3Q7XG4gICAgICB0aGlzLmhyZWYgPSByZXN0O1xuICAgICAgdGhpcy5wYXRobmFtZSA9IHNpbXBsZVBhdGhbMV07XG4gICAgICBpZiAoc2ltcGxlUGF0aFsyXSkge1xuICAgICAgICB0aGlzLnNlYXJjaCA9IHNpbXBsZVBhdGhbMl07XG4gICAgICAgIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHRoaXMuc2VhcmNoLnN1YnN0cigxKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5xdWVyeSA9IHRoaXMuc2VhcmNoLnN1YnN0cigxKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoID0gJyc7XG4gICAgICAgIHRoaXMucXVlcnkgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwcm90byA9IHByb3RvY29sUGF0dGVybi5leGVjKHJlc3QpO1xuICBpZiAocHJvdG8pIHtcbiAgICBwcm90byA9IHByb3RvWzBdO1xuICAgIHZhciBsb3dlclByb3RvID0gcHJvdG8udG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLnByb3RvY29sID0gbG93ZXJQcm90bztcbiAgICByZXN0ID0gcmVzdC5zdWJzdHIocHJvdG8ubGVuZ3RoKTtcbiAgfVxuXG4gIC8vIGZpZ3VyZSBvdXQgaWYgaXQncyBnb3QgYSBob3N0XG4gIC8vIHVzZXJAc2VydmVyIGlzICphbHdheXMqIGludGVycHJldGVkIGFzIGEgaG9zdG5hbWUsIGFuZCB1cmxcbiAgLy8gcmVzb2x1dGlvbiB3aWxsIHRyZWF0IC8vZm9vL2JhciBhcyBob3N0PWZvbyxwYXRoPWJhciBiZWNhdXNlIHRoYXQnc1xuICAvLyBob3cgdGhlIGJyb3dzZXIgcmVzb2x2ZXMgcmVsYXRpdmUgVVJMcy5cbiAgaWYgKHNsYXNoZXNEZW5vdGVIb3N0IHx8IHByb3RvIHx8IHJlc3QubWF0Y2goL15cXC9cXC9bXkBcXC9dK0BbXkBcXC9dKy8pKSB7XG4gICAgdmFyIHNsYXNoZXMgPSByZXN0LnN1YnN0cigwLCAyKSA9PT0gJy8vJztcbiAgICBpZiAoc2xhc2hlcyAmJiAhKHByb3RvICYmIGhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dKSkge1xuICAgICAgcmVzdCA9IHJlc3Quc3Vic3RyKDIpO1xuICAgICAgdGhpcy5zbGFzaGVzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dICYmXG4gICAgICAoc2xhc2hlcyB8fCAocHJvdG8gJiYgIXNsYXNoZWRQcm90b2NvbFtwcm90b10pKSkge1xuXG4gICAgLy8gdGhlcmUncyBhIGhvc3RuYW1lLlxuICAgIC8vIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiAvLCA/LCA7LCBvciAjIGVuZHMgdGhlIGhvc3QuXG4gICAgLy9cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBAIGluIHRoZSBob3N0bmFtZSwgdGhlbiBub24taG9zdCBjaGFycyAqYXJlKiBhbGxvd2VkXG4gICAgLy8gdG8gdGhlIGxlZnQgb2YgdGhlIGxhc3QgQCBzaWduLCB1bmxlc3Mgc29tZSBob3N0LWVuZGluZyBjaGFyYWN0ZXJcbiAgICAvLyBjb21lcyAqYmVmb3JlKiB0aGUgQC1zaWduLlxuICAgIC8vIFVSTHMgYXJlIG9ibm94aW91cy5cbiAgICAvL1xuICAgIC8vIGV4OlxuICAgIC8vIGh0dHA6Ly9hQGJAYy8gPT4gdXNlcjphQGIgaG9zdDpjXG4gICAgLy8gaHR0cDovL2FAYj9AYyA9PiB1c2VyOmEgaG9zdDpjIHBhdGg6Lz9AY1xuXG4gICAgLy8gdjAuMTIgVE9ETyhpc2FhY3MpOiBUaGlzIGlzIG5vdCBxdWl0ZSBob3cgQ2hyb21lIGRvZXMgdGhpbmdzLlxuICAgIC8vIFJldmlldyBvdXIgdGVzdCBjYXNlIGFnYWluc3QgYnJvd3NlcnMgbW9yZSBjb21wcmVoZW5zaXZlbHkuXG5cbiAgICAvLyBmaW5kIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhbnkgaG9zdEVuZGluZ0NoYXJzXG4gICAgdmFyIGhvc3RFbmQgPSAtMTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhvc3RFbmRpbmdDaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGhlYyA9IHJlc3QuaW5kZXhPZihob3N0RW5kaW5nQ2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKVxuICAgICAgICBob3N0RW5kID0gaGVjO1xuICAgIH1cblxuICAgIC8vIGF0IHRoaXMgcG9pbnQsIGVpdGhlciB3ZSBoYXZlIGFuIGV4cGxpY2l0IHBvaW50IHdoZXJlIHRoZVxuICAgIC8vIGF1dGggcG9ydGlvbiBjYW5ub3QgZ28gcGFzdCwgb3IgdGhlIGxhc3QgQCBjaGFyIGlzIHRoZSBkZWNpZGVyLlxuICAgIHZhciBhdXRoLCBhdFNpZ247XG4gICAgaWYgKGhvc3RFbmQgPT09IC0xKSB7XG4gICAgICAvLyBhdFNpZ24gY2FuIGJlIGFueXdoZXJlLlxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhdFNpZ24gbXVzdCBiZSBpbiBhdXRoIHBvcnRpb24uXG4gICAgICAvLyBodHRwOi8vYUBiL2NAZCA9PiBob3N0OmIgYXV0aDphIHBhdGg6L2NAZFxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcsIGhvc3RFbmQpO1xuICAgIH1cblxuICAgIC8vIE5vdyB3ZSBoYXZlIGEgcG9ydGlvbiB3aGljaCBpcyBkZWZpbml0ZWx5IHRoZSBhdXRoLlxuICAgIC8vIFB1bGwgdGhhdCBvZmYuXG4gICAgaWYgKGF0U2lnbiAhPT0gLTEpIHtcbiAgICAgIGF1dGggPSByZXN0LnNsaWNlKDAsIGF0U2lnbik7XG4gICAgICByZXN0ID0gcmVzdC5zbGljZShhdFNpZ24gKyAxKTtcbiAgICAgIHRoaXMuYXV0aCA9IGRlY29kZVVSSUNvbXBvbmVudChhdXRoKTtcbiAgICB9XG5cbiAgICAvLyB0aGUgaG9zdCBpcyB0aGUgcmVtYWluaW5nIHRvIHRoZSBsZWZ0IG9mIHRoZSBmaXJzdCBub24taG9zdCBjaGFyXG4gICAgaG9zdEVuZCA9IC0xO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9uSG9zdENoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaGVjID0gcmVzdC5pbmRleE9mKG5vbkhvc3RDaGFyc1tpXSk7XG4gICAgICBpZiAoaGVjICE9PSAtMSAmJiAoaG9zdEVuZCA9PT0gLTEgfHwgaGVjIDwgaG9zdEVuZCkpXG4gICAgICAgIGhvc3RFbmQgPSBoZWM7XG4gICAgfVxuICAgIC8vIGlmIHdlIHN0aWxsIGhhdmUgbm90IGhpdCBpdCwgdGhlbiB0aGUgZW50aXJlIHRoaW5nIGlzIGEgaG9zdC5cbiAgICBpZiAoaG9zdEVuZCA9PT0gLTEpXG4gICAgICBob3N0RW5kID0gcmVzdC5sZW5ndGg7XG5cbiAgICB0aGlzLmhvc3QgPSByZXN0LnNsaWNlKDAsIGhvc3RFbmQpO1xuICAgIHJlc3QgPSByZXN0LnNsaWNlKGhvc3RFbmQpO1xuXG4gICAgLy8gcHVsbCBvdXQgcG9ydC5cbiAgICB0aGlzLnBhcnNlSG9zdCgpO1xuXG4gICAgLy8gd2UndmUgaW5kaWNhdGVkIHRoYXQgdGhlcmUgaXMgYSBob3N0bmFtZSxcbiAgICAvLyBzbyBldmVuIGlmIGl0J3MgZW1wdHksIGl0IGhhcyB0byBiZSBwcmVzZW50LlxuICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lIHx8ICcnO1xuXG4gICAgLy8gaWYgaG9zdG5hbWUgYmVnaW5zIHdpdGggWyBhbmQgZW5kcyB3aXRoIF1cbiAgICAvLyBhc3N1bWUgdGhhdCBpdCdzIGFuIElQdjYgYWRkcmVzcy5cbiAgICB2YXIgaXB2Nkhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVswXSA9PT0gJ1snICYmXG4gICAgICAgIHRoaXMuaG9zdG5hbWVbdGhpcy5ob3N0bmFtZS5sZW5ndGggLSAxXSA9PT0gJ10nO1xuXG4gICAgLy8gdmFsaWRhdGUgYSBsaXR0bGUuXG4gICAgaWYgKCFpcHY2SG9zdG5hbWUpIHtcbiAgICAgIHZhciBob3N0cGFydHMgPSB0aGlzLmhvc3RuYW1lLnNwbGl0KC9cXC4vKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gaG9zdHBhcnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgcGFydCA9IGhvc3RwYXJ0c1tpXTtcbiAgICAgICAgaWYgKCFwYXJ0KSBjb250aW51ZTtcbiAgICAgICAgaWYgKCFwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFBhdHRlcm4pKSB7XG4gICAgICAgICAgdmFyIG5ld3BhcnQgPSAnJztcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgayA9IHBhcnQubGVuZ3RoOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgICBpZiAocGFydC5jaGFyQ29kZUF0KGopID4gMTI3KSB7XG4gICAgICAgICAgICAgIC8vIHdlIHJlcGxhY2Ugbm9uLUFTQ0lJIGNoYXIgd2l0aCBhIHRlbXBvcmFyeSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRoaXMgdG8gbWFrZSBzdXJlIHNpemUgb2YgaG9zdG5hbWUgaXMgbm90XG4gICAgICAgICAgICAgIC8vIGJyb2tlbiBieSByZXBsYWNpbmcgbm9uLUFTQ0lJIGJ5IG5vdGhpbmdcbiAgICAgICAgICAgICAgbmV3cGFydCArPSAneCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdwYXJ0ICs9IHBhcnRbal07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHdlIHRlc3QgYWdhaW4gd2l0aCBBU0NJSSBjaGFyIG9ubHlcbiAgICAgICAgICBpZiAoIW5ld3BhcnQubWF0Y2goaG9zdG5hbWVQYXJ0UGF0dGVybikpIHtcbiAgICAgICAgICAgIHZhciB2YWxpZFBhcnRzID0gaG9zdHBhcnRzLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgdmFyIG5vdEhvc3QgPSBob3N0cGFydHMuc2xpY2UoaSArIDEpO1xuICAgICAgICAgICAgdmFyIGJpdCA9IHBhcnQubWF0Y2goaG9zdG5hbWVQYXJ0U3RhcnQpO1xuICAgICAgICAgICAgaWYgKGJpdCkge1xuICAgICAgICAgICAgICB2YWxpZFBhcnRzLnB1c2goYml0WzFdKTtcbiAgICAgICAgICAgICAgbm90SG9zdC51bnNoaWZ0KGJpdFsyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm90SG9zdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmVzdCA9ICcvJyArIG5vdEhvc3Quam9pbignLicpICsgcmVzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaG9zdG5hbWUgPSB2YWxpZFBhcnRzLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhvc3RuYW1lLmxlbmd0aCA+IGhvc3RuYW1lTWF4TGVuKSB7XG4gICAgICB0aGlzLmhvc3RuYW1lID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGhvc3RuYW1lcyBhcmUgYWx3YXlzIGxvd2VyIGNhc2UuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGlmICghaXB2Nkhvc3RuYW1lKSB7XG4gICAgICAvLyBJRE5BIFN1cHBvcnQ6IFJldHVybnMgYSBwdW55Y29kZWQgcmVwcmVzZW50YXRpb24gb2YgXCJkb21haW5cIi5cbiAgICAgIC8vIEl0IG9ubHkgY29udmVydHMgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHRoYXRcbiAgICAgIC8vIGhhdmUgbm9uLUFTQ0lJIGNoYXJhY3RlcnMsIGkuZS4gaXQgZG9lc24ndCBtYXR0ZXIgaWZcbiAgICAgIC8vIHlvdSBjYWxsIGl0IHdpdGggYSBkb21haW4gdGhhdCBhbHJlYWR5IGlzIEFTQ0lJLW9ubHkuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gcHVueWNvZGUudG9BU0NJSSh0aGlzLmhvc3RuYW1lKTtcbiAgICB9XG5cbiAgICB2YXIgcCA9IHRoaXMucG9ydCA/ICc6JyArIHRoaXMucG9ydCA6ICcnO1xuICAgIHZhciBoID0gdGhpcy5ob3N0bmFtZSB8fCAnJztcbiAgICB0aGlzLmhvc3QgPSBoICsgcDtcbiAgICB0aGlzLmhyZWYgKz0gdGhpcy5ob3N0O1xuXG4gICAgLy8gc3RyaXAgWyBhbmQgXSBmcm9tIHRoZSBob3N0bmFtZVxuICAgIC8vIHRoZSBob3N0IGZpZWxkIHN0aWxsIHJldGFpbnMgdGhlbSwgdGhvdWdoXG4gICAgaWYgKGlwdjZIb3N0bmFtZSkge1xuICAgICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUuc3Vic3RyKDEsIHRoaXMuaG9zdG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBpZiAocmVzdFswXSAhPT0gJy8nKSB7XG4gICAgICAgIHJlc3QgPSAnLycgKyByZXN0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIG5vdyByZXN0IGlzIHNldCB0byB0aGUgcG9zdC1ob3N0IHN0dWZmLlxuICAvLyBjaG9wIG9mZiBhbnkgZGVsaW0gY2hhcnMuXG4gIGlmICghdW5zYWZlUHJvdG9jb2xbbG93ZXJQcm90b10pIHtcblxuICAgIC8vIEZpcnN0LCBtYWtlIDEwMCUgc3VyZSB0aGF0IGFueSBcImF1dG9Fc2NhcGVcIiBjaGFycyBnZXRcbiAgICAvLyBlc2NhcGVkLCBldmVuIGlmIGVuY29kZVVSSUNvbXBvbmVudCBkb2Vzbid0IHRoaW5rIHRoZXlcbiAgICAvLyBuZWVkIHRvIGJlLlxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXV0b0VzY2FwZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBhZSA9IGF1dG9Fc2NhcGVbaV07XG4gICAgICBpZiAocmVzdC5pbmRleE9mKGFlKSA9PT0gLTEpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgdmFyIGVzYyA9IGVuY29kZVVSSUNvbXBvbmVudChhZSk7XG4gICAgICBpZiAoZXNjID09PSBhZSkge1xuICAgICAgICBlc2MgPSBlc2NhcGUoYWUpO1xuICAgICAgfVxuICAgICAgcmVzdCA9IHJlc3Quc3BsaXQoYWUpLmpvaW4oZXNjKTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIGNob3Agb2ZmIGZyb20gdGhlIHRhaWwgZmlyc3QuXG4gIHZhciBoYXNoID0gcmVzdC5pbmRleE9mKCcjJyk7XG4gIGlmIChoYXNoICE9PSAtMSkge1xuICAgIC8vIGdvdCBhIGZyYWdtZW50IHN0cmluZy5cbiAgICB0aGlzLmhhc2ggPSByZXN0LnN1YnN0cihoYXNoKTtcbiAgICByZXN0ID0gcmVzdC5zbGljZSgwLCBoYXNoKTtcbiAgfVxuICB2YXIgcW0gPSByZXN0LmluZGV4T2YoJz8nKTtcbiAgaWYgKHFtICE9PSAtMSkge1xuICAgIHRoaXMuc2VhcmNoID0gcmVzdC5zdWJzdHIocW0pO1xuICAgIHRoaXMucXVlcnkgPSByZXN0LnN1YnN0cihxbSArIDEpO1xuICAgIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnlzdHJpbmcucGFyc2UodGhpcy5xdWVyeSk7XG4gICAgfVxuICAgIHJlc3QgPSByZXN0LnNsaWNlKDAsIHFtKTtcbiAgfSBlbHNlIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgLy8gbm8gcXVlcnkgc3RyaW5nLCBidXQgcGFyc2VRdWVyeVN0cmluZyBzdGlsbCByZXF1ZXN0ZWRcbiAgICB0aGlzLnNlYXJjaCA9ICcnO1xuICAgIHRoaXMucXVlcnkgPSB7fTtcbiAgfVxuICBpZiAocmVzdCkgdGhpcy5wYXRobmFtZSA9IHJlc3Q7XG4gIGlmIChzbGFzaGVkUHJvdG9jb2xbbG93ZXJQcm90b10gJiZcbiAgICAgIHRoaXMuaG9zdG5hbWUgJiYgIXRoaXMucGF0aG5hbWUpIHtcbiAgICB0aGlzLnBhdGhuYW1lID0gJy8nO1xuICB9XG5cbiAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICBpZiAodGhpcy5wYXRobmFtZSB8fCB0aGlzLnNlYXJjaCkge1xuICAgIHZhciBwID0gdGhpcy5wYXRobmFtZSB8fCAnJztcbiAgICB2YXIgcyA9IHRoaXMuc2VhcmNoIHx8ICcnO1xuICAgIHRoaXMucGF0aCA9IHAgKyBzO1xuICB9XG5cbiAgLy8gZmluYWxseSwgcmVjb25zdHJ1Y3QgdGhlIGhyZWYgYmFzZWQgb24gd2hhdCBoYXMgYmVlbiB2YWxpZGF0ZWQuXG4gIHRoaXMuaHJlZiA9IHRoaXMuZm9ybWF0KCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZm9ybWF0IGEgcGFyc2VkIG9iamVjdCBpbnRvIGEgdXJsIHN0cmluZ1xuZnVuY3Rpb24gdXJsRm9ybWF0KG9iaikge1xuICAvLyBlbnN1cmUgaXQncyBhbiBvYmplY3QsIGFuZCBub3QgYSBzdHJpbmcgdXJsLlxuICAvLyBJZiBpdCdzIGFuIG9iaiwgdGhpcyBpcyBhIG5vLW9wLlxuICAvLyB0aGlzIHdheSwgeW91IGNhbiBjYWxsIHVybF9mb3JtYXQoKSBvbiBzdHJpbmdzXG4gIC8vIHRvIGNsZWFuIHVwIHBvdGVudGlhbGx5IHdvbmt5IHVybHMuXG4gIGlmICh1dGlsLmlzU3RyaW5nKG9iaikpIG9iaiA9IHVybFBhcnNlKG9iaik7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIFVybCkpIHJldHVybiBVcmwucHJvdG90eXBlLmZvcm1hdC5jYWxsKG9iaik7XG4gIHJldHVybiBvYmouZm9ybWF0KCk7XG59XG5cblVybC5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhdXRoID0gdGhpcy5hdXRoIHx8ICcnO1xuICBpZiAoYXV0aCkge1xuICAgIGF1dGggPSBlbmNvZGVVUklDb21wb25lbnQoYXV0aCk7XG4gICAgYXV0aCA9IGF1dGgucmVwbGFjZSgvJTNBL2ksICc6Jyk7XG4gICAgYXV0aCArPSAnQCc7XG4gIH1cblxuICB2YXIgcHJvdG9jb2wgPSB0aGlzLnByb3RvY29sIHx8ICcnLFxuICAgICAgcGF0aG5hbWUgPSB0aGlzLnBhdGhuYW1lIHx8ICcnLFxuICAgICAgaGFzaCA9IHRoaXMuaGFzaCB8fCAnJyxcbiAgICAgIGhvc3QgPSBmYWxzZSxcbiAgICAgIHF1ZXJ5ID0gJyc7XG5cbiAgaWYgKHRoaXMuaG9zdCkge1xuICAgIGhvc3QgPSBhdXRoICsgdGhpcy5ob3N0O1xuICB9IGVsc2UgaWYgKHRoaXMuaG9zdG5hbWUpIHtcbiAgICBob3N0ID0gYXV0aCArICh0aGlzLmhvc3RuYW1lLmluZGV4T2YoJzonKSA9PT0gLTEgP1xuICAgICAgICB0aGlzLmhvc3RuYW1lIDpcbiAgICAgICAgJ1snICsgdGhpcy5ob3N0bmFtZSArICddJyk7XG4gICAgaWYgKHRoaXMucG9ydCkge1xuICAgICAgaG9zdCArPSAnOicgKyB0aGlzLnBvcnQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMucXVlcnkgJiZcbiAgICAgIHV0aWwuaXNPYmplY3QodGhpcy5xdWVyeSkgJiZcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMucXVlcnkpLmxlbmd0aCkge1xuICAgIHF1ZXJ5ID0gcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHRoaXMucXVlcnkpO1xuICB9XG5cbiAgdmFyIHNlYXJjaCA9IHRoaXMuc2VhcmNoIHx8IChxdWVyeSAmJiAoJz8nICsgcXVlcnkpKSB8fCAnJztcblxuICBpZiAocHJvdG9jb2wgJiYgcHJvdG9jb2wuc3Vic3RyKC0xKSAhPT0gJzonKSBwcm90b2NvbCArPSAnOic7XG5cbiAgLy8gb25seSB0aGUgc2xhc2hlZFByb3RvY29scyBnZXQgdGhlIC8vLiAgTm90IG1haWx0bzosIHhtcHA6LCBldGMuXG4gIC8vIHVubGVzcyB0aGV5IGhhZCB0aGVtIHRvIGJlZ2luIHdpdGguXG4gIGlmICh0aGlzLnNsYXNoZXMgfHxcbiAgICAgICghcHJvdG9jb2wgfHwgc2xhc2hlZFByb3RvY29sW3Byb3RvY29sXSkgJiYgaG9zdCAhPT0gZmFsc2UpIHtcbiAgICBob3N0ID0gJy8vJyArIChob3N0IHx8ICcnKTtcbiAgICBpZiAocGF0aG5hbWUgJiYgcGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycpIHBhdGhuYW1lID0gJy8nICsgcGF0aG5hbWU7XG4gIH0gZWxzZSBpZiAoIWhvc3QpIHtcbiAgICBob3N0ID0gJyc7XG4gIH1cblxuICBpZiAoaGFzaCAmJiBoYXNoLmNoYXJBdCgwKSAhPT0gJyMnKSBoYXNoID0gJyMnICsgaGFzaDtcbiAgaWYgKHNlYXJjaCAmJiBzZWFyY2guY2hhckF0KDApICE9PSAnPycpIHNlYXJjaCA9ICc/JyArIHNlYXJjaDtcblxuICBwYXRobmFtZSA9IHBhdGhuYW1lLnJlcGxhY2UoL1s/I10vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KG1hdGNoKTtcbiAgfSk7XG4gIHNlYXJjaCA9IHNlYXJjaC5yZXBsYWNlKCcjJywgJyUyMycpO1xuXG4gIHJldHVybiBwcm90b2NvbCArIGhvc3QgKyBwYXRobmFtZSArIHNlYXJjaCArIGhhc2g7XG59O1xuXG5mdW5jdGlvbiB1cmxSZXNvbHZlKHNvdXJjZSwgcmVsYXRpdmUpIHtcbiAgcmV0dXJuIHVybFBhcnNlKHNvdXJjZSwgZmFsc2UsIHRydWUpLnJlc29sdmUocmVsYXRpdmUpO1xufVxuXG5VcmwucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihyZWxhdGl2ZSkge1xuICByZXR1cm4gdGhpcy5yZXNvbHZlT2JqZWN0KHVybFBhcnNlKHJlbGF0aXZlLCBmYWxzZSwgdHJ1ZSkpLmZvcm1hdCgpO1xufTtcblxuZnVuY3Rpb24gdXJsUmVzb2x2ZU9iamVjdChzb3VyY2UsIHJlbGF0aXZlKSB7XG4gIGlmICghc291cmNlKSByZXR1cm4gcmVsYXRpdmU7XG4gIHJldHVybiB1cmxQYXJzZShzb3VyY2UsIGZhbHNlLCB0cnVlKS5yZXNvbHZlT2JqZWN0KHJlbGF0aXZlKTtcbn1cblxuVXJsLnByb3RvdHlwZS5yZXNvbHZlT2JqZWN0ID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcbiAgaWYgKHV0aWwuaXNTdHJpbmcocmVsYXRpdmUpKSB7XG4gICAgdmFyIHJlbCA9IG5ldyBVcmwoKTtcbiAgICByZWwucGFyc2UocmVsYXRpdmUsIGZhbHNlLCB0cnVlKTtcbiAgICByZWxhdGl2ZSA9IHJlbDtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBuZXcgVXJsKCk7XG4gIHZhciB0a2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpO1xuICBmb3IgKHZhciB0ayA9IDA7IHRrIDwgdGtleXMubGVuZ3RoOyB0aysrKSB7XG4gICAgdmFyIHRrZXkgPSB0a2V5c1t0a107XG4gICAgcmVzdWx0W3RrZXldID0gdGhpc1t0a2V5XTtcbiAgfVxuXG4gIC8vIGhhc2ggaXMgYWx3YXlzIG92ZXJyaWRkZW4sIG5vIG1hdHRlciB3aGF0LlxuICAvLyBldmVuIGhyZWY9XCJcIiB3aWxsIHJlbW92ZSBpdC5cbiAgcmVzdWx0Lmhhc2ggPSByZWxhdGl2ZS5oYXNoO1xuXG4gIC8vIGlmIHRoZSByZWxhdGl2ZSB1cmwgaXMgZW1wdHksIHRoZW4gdGhlcmUncyBub3RoaW5nIGxlZnQgdG8gZG8gaGVyZS5cbiAgaWYgKHJlbGF0aXZlLmhyZWYgPT09ICcnKSB7XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGhyZWZzIGxpa2UgLy9mb28vYmFyIGFsd2F5cyBjdXQgdG8gdGhlIHByb3RvY29sLlxuICBpZiAocmVsYXRpdmUuc2xhc2hlcyAmJiAhcmVsYXRpdmUucHJvdG9jb2wpIHtcbiAgICAvLyB0YWtlIGV2ZXJ5dGhpbmcgZXhjZXB0IHRoZSBwcm90b2NvbCBmcm9tIHJlbGF0aXZlXG4gICAgdmFyIHJrZXlzID0gT2JqZWN0LmtleXMocmVsYXRpdmUpO1xuICAgIGZvciAodmFyIHJrID0gMDsgcmsgPCBya2V5cy5sZW5ndGg7IHJrKyspIHtcbiAgICAgIHZhciBya2V5ID0gcmtleXNbcmtdO1xuICAgICAgaWYgKHJrZXkgIT09ICdwcm90b2NvbCcpXG4gICAgICAgIHJlc3VsdFtya2V5XSA9IHJlbGF0aXZlW3JrZXldO1xuICAgIH1cblxuICAgIC8vdXJsUGFyc2UgYXBwZW5kcyB0cmFpbGluZyAvIHRvIHVybHMgbGlrZSBodHRwOi8vd3d3LmV4YW1wbGUuY29tXG4gICAgaWYgKHNsYXNoZWRQcm90b2NvbFtyZXN1bHQucHJvdG9jb2xdICYmXG4gICAgICAgIHJlc3VsdC5ob3N0bmFtZSAmJiAhcmVzdWx0LnBhdGhuYW1lKSB7XG4gICAgICByZXN1bHQucGF0aCA9IHJlc3VsdC5wYXRobmFtZSA9ICcvJztcbiAgICB9XG5cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKHJlbGF0aXZlLnByb3RvY29sICYmIHJlbGF0aXZlLnByb3RvY29sICE9PSByZXN1bHQucHJvdG9jb2wpIHtcbiAgICAvLyBpZiBpdCdzIGEga25vd24gdXJsIHByb3RvY29sLCB0aGVuIGNoYW5naW5nXG4gICAgLy8gdGhlIHByb3RvY29sIGRvZXMgd2VpcmQgdGhpbmdzXG4gICAgLy8gZmlyc3QsIGlmIGl0J3Mgbm90IGZpbGU6LCB0aGVuIHdlIE1VU1QgaGF2ZSBhIGhvc3QsXG4gICAgLy8gYW5kIGlmIHRoZXJlIHdhcyBhIHBhdGhcbiAgICAvLyB0byBiZWdpbiB3aXRoLCB0aGVuIHdlIE1VU1QgaGF2ZSBhIHBhdGguXG4gICAgLy8gaWYgaXQgaXMgZmlsZTosIHRoZW4gdGhlIGhvc3QgaXMgZHJvcHBlZCxcbiAgICAvLyBiZWNhdXNlIHRoYXQncyBrbm93biB0byBiZSBob3N0bGVzcy5cbiAgICAvLyBhbnl0aGluZyBlbHNlIGlzIGFzc3VtZWQgdG8gYmUgYWJzb2x1dGUuXG4gICAgaWYgKCFzbGFzaGVkUHJvdG9jb2xbcmVsYXRpdmUucHJvdG9jb2xdKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHJlbGF0aXZlKTtcbiAgICAgIGZvciAodmFyIHYgPSAwOyB2IDwga2V5cy5sZW5ndGg7IHYrKykge1xuICAgICAgICB2YXIgayA9IGtleXNbdl07XG4gICAgICAgIHJlc3VsdFtrXSA9IHJlbGF0aXZlW2tdO1xuICAgICAgfVxuICAgICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHJlc3VsdC5wcm90b2NvbCA9IHJlbGF0aXZlLnByb3RvY29sO1xuICAgIGlmICghcmVsYXRpdmUuaG9zdCAmJiAhaG9zdGxlc3NQcm90b2NvbFtyZWxhdGl2ZS5wcm90b2NvbF0pIHtcbiAgICAgIHZhciByZWxQYXRoID0gKHJlbGF0aXZlLnBhdGhuYW1lIHx8ICcnKS5zcGxpdCgnLycpO1xuICAgICAgd2hpbGUgKHJlbFBhdGgubGVuZ3RoICYmICEocmVsYXRpdmUuaG9zdCA9IHJlbFBhdGguc2hpZnQoKSkpO1xuICAgICAgaWYgKCFyZWxhdGl2ZS5ob3N0KSByZWxhdGl2ZS5ob3N0ID0gJyc7XG4gICAgICBpZiAoIXJlbGF0aXZlLmhvc3RuYW1lKSByZWxhdGl2ZS5ob3N0bmFtZSA9ICcnO1xuICAgICAgaWYgKHJlbFBhdGhbMF0gIT09ICcnKSByZWxQYXRoLnVuc2hpZnQoJycpO1xuICAgICAgaWYgKHJlbFBhdGgubGVuZ3RoIDwgMikgcmVsUGF0aC51bnNoaWZ0KCcnKTtcbiAgICAgIHJlc3VsdC5wYXRobmFtZSA9IHJlbFBhdGguam9pbignLycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucGF0aG5hbWUgPSByZWxhdGl2ZS5wYXRobmFtZTtcbiAgICB9XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICByZXN1bHQuaG9zdCA9IHJlbGF0aXZlLmhvc3QgfHwgJyc7XG4gICAgcmVzdWx0LmF1dGggPSByZWxhdGl2ZS5hdXRoO1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3Q7XG4gICAgcmVzdWx0LnBvcnQgPSByZWxhdGl2ZS5wb3J0O1xuICAgIC8vIHRvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKHJlc3VsdC5wYXRobmFtZSB8fCByZXN1bHQuc2VhcmNoKSB7XG4gICAgICB2YXIgcCA9IHJlc3VsdC5wYXRobmFtZSB8fCAnJztcbiAgICAgIHZhciBzID0gcmVzdWx0LnNlYXJjaCB8fCAnJztcbiAgICAgIHJlc3VsdC5wYXRoID0gcCArIHM7XG4gICAgfVxuICAgIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdmFyIGlzU291cmNlQWJzID0gKHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpLFxuICAgICAgaXNSZWxBYnMgPSAoXG4gICAgICAgICAgcmVsYXRpdmUuaG9zdCB8fFxuICAgICAgICAgIHJlbGF0aXZlLnBhdGhuYW1lICYmIHJlbGF0aXZlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nXG4gICAgICApLFxuICAgICAgbXVzdEVuZEFicyA9IChpc1JlbEFicyB8fCBpc1NvdXJjZUFicyB8fFxuICAgICAgICAgICAgICAgICAgICAocmVzdWx0Lmhvc3QgJiYgcmVsYXRpdmUucGF0aG5hbWUpKSxcbiAgICAgIHJlbW92ZUFsbERvdHMgPSBtdXN0RW5kQWJzLFxuICAgICAgc3JjUGF0aCA9IHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuc3BsaXQoJy8nKSB8fCBbXSxcbiAgICAgIHJlbFBhdGggPSByZWxhdGl2ZS5wYXRobmFtZSAmJiByZWxhdGl2ZS5wYXRobmFtZS5zcGxpdCgnLycpIHx8IFtdLFxuICAgICAgcHN5Y2hvdGljID0gcmVzdWx0LnByb3RvY29sICYmICFzbGFzaGVkUHJvdG9jb2xbcmVzdWx0LnByb3RvY29sXTtcblxuICAvLyBpZiB0aGUgdXJsIGlzIGEgbm9uLXNsYXNoZWQgdXJsLCB0aGVuIHJlbGF0aXZlXG4gIC8vIGxpbmtzIGxpa2UgLi4vLi4gc2hvdWxkIGJlIGFibGVcbiAgLy8gdG8gY3Jhd2wgdXAgdG8gdGhlIGhvc3RuYW1lLCBhcyB3ZWxsLiAgVGhpcyBpcyBzdHJhbmdlLlxuICAvLyByZXN1bHQucHJvdG9jb2wgaGFzIGFscmVhZHkgYmVlbiBzZXQgYnkgbm93LlxuICAvLyBMYXRlciBvbiwgcHV0IHRoZSBmaXJzdCBwYXRoIHBhcnQgaW50byB0aGUgaG9zdCBmaWVsZC5cbiAgaWYgKHBzeWNob3RpYykge1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9ICcnO1xuICAgIHJlc3VsdC5wb3J0ID0gbnVsbDtcbiAgICBpZiAocmVzdWx0Lmhvc3QpIHtcbiAgICAgIGlmIChzcmNQYXRoWzBdID09PSAnJykgc3JjUGF0aFswXSA9IHJlc3VsdC5ob3N0O1xuICAgICAgZWxzZSBzcmNQYXRoLnVuc2hpZnQocmVzdWx0Lmhvc3QpO1xuICAgIH1cbiAgICByZXN1bHQuaG9zdCA9ICcnO1xuICAgIGlmIChyZWxhdGl2ZS5wcm90b2NvbCkge1xuICAgICAgcmVsYXRpdmUuaG9zdG5hbWUgPSBudWxsO1xuICAgICAgcmVsYXRpdmUucG9ydCA9IG51bGw7XG4gICAgICBpZiAocmVsYXRpdmUuaG9zdCkge1xuICAgICAgICBpZiAocmVsUGF0aFswXSA9PT0gJycpIHJlbFBhdGhbMF0gPSByZWxhdGl2ZS5ob3N0O1xuICAgICAgICBlbHNlIHJlbFBhdGgudW5zaGlmdChyZWxhdGl2ZS5ob3N0KTtcbiAgICAgIH1cbiAgICAgIHJlbGF0aXZlLmhvc3QgPSBudWxsO1xuICAgIH1cbiAgICBtdXN0RW5kQWJzID0gbXVzdEVuZEFicyAmJiAocmVsUGF0aFswXSA9PT0gJycgfHwgc3JjUGF0aFswXSA9PT0gJycpO1xuICB9XG5cbiAgaWYgKGlzUmVsQWJzKSB7XG4gICAgLy8gaXQncyBhYnNvbHV0ZS5cbiAgICByZXN1bHQuaG9zdCA9IChyZWxhdGl2ZS5ob3N0IHx8IHJlbGF0aXZlLmhvc3QgPT09ICcnKSA/XG4gICAgICAgICAgICAgICAgICByZWxhdGl2ZS5ob3N0IDogcmVzdWx0Lmhvc3Q7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gKHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3RuYW1lID09PSAnJykgP1xuICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLmhvc3RuYW1lIDogcmVzdWx0Lmhvc3RuYW1lO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgc3JjUGF0aCA9IHJlbFBhdGg7XG4gICAgLy8gZmFsbCB0aHJvdWdoIHRvIHRoZSBkb3QtaGFuZGxpbmcgYmVsb3cuXG4gIH0gZWxzZSBpZiAocmVsUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBpdCdzIHJlbGF0aXZlXG4gICAgLy8gdGhyb3cgYXdheSB0aGUgZXhpc3RpbmcgZmlsZSwgYW5kIHRha2UgdGhlIG5ldyBwYXRoIGluc3RlYWQuXG4gICAgaWYgKCFzcmNQYXRoKSBzcmNQYXRoID0gW107XG4gICAgc3JjUGF0aC5wb3AoKTtcbiAgICBzcmNQYXRoID0gc3JjUGF0aC5jb25jYXQocmVsUGF0aCk7XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgfSBlbHNlIGlmICghdXRpbC5pc051bGxPclVuZGVmaW5lZChyZWxhdGl2ZS5zZWFyY2gpKSB7XG4gICAgLy8ganVzdCBwdWxsIG91dCB0aGUgc2VhcmNoLlxuICAgIC8vIGxpa2UgaHJlZj0nP2ZvbycuXG4gICAgLy8gUHV0IHRoaXMgYWZ0ZXIgdGhlIG90aGVyIHR3byBjYXNlcyBiZWNhdXNlIGl0IHNpbXBsaWZpZXMgdGhlIGJvb2xlYW5zXG4gICAgaWYgKHBzeWNob3RpYykge1xuICAgICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBzcmNQYXRoLnNoaWZ0KCk7XG4gICAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgICAvL3RoaXMgZXNwZWNpYWxseSBoYXBwZW5zIGluIGNhc2VzIGxpa2VcbiAgICAgIC8vdXJsLnJlc29sdmVPYmplY3QoJ21haWx0bzpsb2NhbDFAZG9tYWluMScsICdsb2NhbDJAZG9tYWluMicpXG4gICAgICB2YXIgYXV0aEluSG9zdCA9IHJlc3VsdC5ob3N0ICYmIHJlc3VsdC5ob3N0LmluZGV4T2YoJ0AnKSA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuaG9zdC5zcGxpdCgnQCcpIDogZmFsc2U7XG4gICAgICBpZiAoYXV0aEluSG9zdCkge1xuICAgICAgICByZXN1bHQuYXV0aCA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSByZXN1bHQuaG9zdG5hbWUgPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmICghdXRpbC5pc051bGwocmVzdWx0LnBhdGhuYW1lKSB8fCAhdXRpbC5pc051bGwocmVzdWx0LnNlYXJjaCkpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gKHJlc3VsdC5wYXRobmFtZSA/IHJlc3VsdC5wYXRobmFtZSA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQuc2VhcmNoID8gcmVzdWx0LnNlYXJjaCA6ICcnKTtcbiAgICB9XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmICghc3JjUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBubyBwYXRoIGF0IGFsbC4gIGVhc3kuXG4gICAgLy8gd2UndmUgYWxyZWFkeSBoYW5kbGVkIHRoZSBvdGhlciBzdHVmZiBhYm92ZS5cbiAgICByZXN1bHQucGF0aG5hbWUgPSBudWxsO1xuICAgIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAocmVzdWx0LnNlYXJjaCkge1xuICAgICAgcmVzdWx0LnBhdGggPSAnLycgKyByZXN1bHQuc2VhcmNoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucGF0aCA9IG51bGw7XG4gICAgfVxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBpZiBhIHVybCBFTkRzIGluIC4gb3IgLi4sIHRoZW4gaXQgbXVzdCBnZXQgYSB0cmFpbGluZyBzbGFzaC5cbiAgLy8gaG93ZXZlciwgaWYgaXQgZW5kcyBpbiBhbnl0aGluZyBlbHNlIG5vbi1zbGFzaHksXG4gIC8vIHRoZW4gaXQgbXVzdCBOT1QgZ2V0IGEgdHJhaWxpbmcgc2xhc2guXG4gIHZhciBsYXN0ID0gc3JjUGF0aC5zbGljZSgtMSlbMF07XG4gIHZhciBoYXNUcmFpbGluZ1NsYXNoID0gKFxuICAgICAgKHJlc3VsdC5ob3N0IHx8IHJlbGF0aXZlLmhvc3QgfHwgc3JjUGF0aC5sZW5ndGggPiAxKSAmJlxuICAgICAgKGxhc3QgPT09ICcuJyB8fCBsYXN0ID09PSAnLi4nKSB8fCBsYXN0ID09PSAnJyk7XG5cbiAgLy8gc3RyaXAgc2luZ2xlIGRvdHMsIHJlc29sdmUgZG91YmxlIGRvdHMgdG8gcGFyZW50IGRpclxuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gc3JjUGF0aC5sZW5ndGg7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGFzdCA9IHNyY1BhdGhbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKCFtdXN0RW5kQWJzICYmICFyZW1vdmVBbGxEb3RzKSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBzcmNQYXRoLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG11c3RFbmRBYnMgJiYgc3JjUGF0aFswXSAhPT0gJycgJiZcbiAgICAgICghc3JjUGF0aFswXSB8fCBzcmNQYXRoWzBdLmNoYXJBdCgwKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgudW5zaGlmdCgnJyk7XG4gIH1cblxuICBpZiAoaGFzVHJhaWxpbmdTbGFzaCAmJiAoc3JjUGF0aC5qb2luKCcvJykuc3Vic3RyKC0xKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgucHVzaCgnJyk7XG4gIH1cblxuICB2YXIgaXNBYnNvbHV0ZSA9IHNyY1BhdGhbMF0gPT09ICcnIHx8XG4gICAgICAoc3JjUGF0aFswXSAmJiBzcmNQYXRoWzBdLmNoYXJBdCgwKSA9PT0gJy8nKTtcblxuICAvLyBwdXQgdGhlIGhvc3QgYmFja1xuICBpZiAocHN5Y2hvdGljKSB7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBpc0Fic29sdXRlID8gJycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjUGF0aC5sZW5ndGggPyBzcmNQYXRoLnNoaWZ0KCkgOiAnJztcbiAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgLy90aGlzIGVzcGVjaWFsbHkgaGFwcGVucyBpbiBjYXNlcyBsaWtlXG4gICAgLy91cmwucmVzb2x2ZU9iamVjdCgnbWFpbHRvOmxvY2FsMUBkb21haW4xJywgJ2xvY2FsMkBkb21haW4yJylcbiAgICB2YXIgYXV0aEluSG9zdCA9IHJlc3VsdC5ob3N0ICYmIHJlc3VsdC5ob3N0LmluZGV4T2YoJ0AnKSA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lmhvc3Quc3BsaXQoJ0AnKSA6IGZhbHNlO1xuICAgIGlmIChhdXRoSW5Ib3N0KSB7XG4gICAgICByZXN1bHQuYXV0aCA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgIHJlc3VsdC5ob3N0ID0gcmVzdWx0Lmhvc3RuYW1lID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgIH1cbiAgfVxuXG4gIG11c3RFbmRBYnMgPSBtdXN0RW5kQWJzIHx8IChyZXN1bHQuaG9zdCAmJiBzcmNQYXRoLmxlbmd0aCk7XG5cbiAgaWYgKG11c3RFbmRBYnMgJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBzcmNQYXRoLnVuc2hpZnQoJycpO1xuICB9XG5cbiAgaWYgKCFzcmNQYXRoLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wYXRobmFtZSA9IG51bGw7XG4gICAgcmVzdWx0LnBhdGggPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5wYXRobmFtZSA9IHNyY1BhdGguam9pbignLycpO1xuICB9XG5cbiAgLy90byBzdXBwb3J0IHJlcXVlc3QuaHR0cFxuICBpZiAoIXV0aWwuaXNOdWxsKHJlc3VsdC5wYXRobmFtZSkgfHwgIXV0aWwuaXNOdWxsKHJlc3VsdC5zZWFyY2gpKSB7XG4gICAgcmVzdWx0LnBhdGggPSAocmVzdWx0LnBhdGhuYW1lID8gcmVzdWx0LnBhdGhuYW1lIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChyZXN1bHQuc2VhcmNoID8gcmVzdWx0LnNlYXJjaCA6ICcnKTtcbiAgfVxuICByZXN1bHQuYXV0aCA9IHJlbGF0aXZlLmF1dGggfHwgcmVzdWx0LmF1dGg7XG4gIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5VcmwucHJvdG90eXBlLnBhcnNlSG9zdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaG9zdCA9IHRoaXMuaG9zdDtcbiAgdmFyIHBvcnQgPSBwb3J0UGF0dGVybi5leGVjKGhvc3QpO1xuICBpZiAocG9ydCkge1xuICAgIHBvcnQgPSBwb3J0WzBdO1xuICAgIGlmIChwb3J0ICE9PSAnOicpIHtcbiAgICAgIHRoaXMucG9ydCA9IHBvcnQuc3Vic3RyKDEpO1xuICAgIH1cbiAgICBob3N0ID0gaG9zdC5zdWJzdHIoMCwgaG9zdC5sZW5ndGggLSBwb3J0Lmxlbmd0aCk7XG4gIH1cbiAgaWYgKGhvc3QpIHRoaXMuaG9zdG5hbWUgPSBob3N0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzU3RyaW5nOiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mKGFyZykgPT09ICdzdHJpbmcnO1xuICB9LFxuICBpc09iamVjdDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZihhcmcpID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG4gIH0sXG4gIGlzTnVsbDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbiAgfSxcbiAgaXNOdWxsT3JVbmRlZmluZWQ6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBhcmcgPT0gbnVsbDtcbiAgfVxufTtcbiIsImNvbnN0IHBhcnNlID0gcmVxdWlyZShcInVybFwiKS5wYXJzZVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2xlYW4sXG4gIHBhZ2UsXG4gIHByb3RvY29sLFxuICBob3N0bmFtZSxcbiAgbm9ybWFsaXplLFxuICBpc1NlYXJjaFF1ZXJ5LFxuICBpc1VSTFxufVxuXG5mdW5jdGlvbiBwcm90b2NvbCAodXJsKSB7XG4gIGNvbnN0IG1hdGNoID0gdXJsLm1hdGNoKC8oXlxcdyspOlxcL1xcLy8pXG4gIGlmIChtYXRjaCkge1xuICAgIHJldHVybiBtYXRjaFsxXVxuICB9XG5cbiAgcmV0dXJuICdodHRwJ1xufVxuXG5mdW5jdGlvbiBjbGVhbiAodXJsKSB7XG4gIHJldHVybiBjbGVhblVUTSh1cmwpXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9eXFx3KzpcXC9cXC8vLCAnJylcbiAgICAucmVwbGFjZSgvXltcXHctX10rOltcXHctX10rQC8sICcnKVxuICAgIC5yZXBsYWNlKC8jLiokLywgJycpXG4gICAgLnJlcGxhY2UoLyhcXC98XFw/fFxcJnwjKSokLywgJycpXG4gICAgLnJlcGxhY2UoL1xcL1xcPy8sICc/JylcbiAgICAucmVwbGFjZSgvXnd3d1xcLi8sICcnKVxufVxuXG5mdW5jdGlvbiBwYWdlICh1cmwpIHtcbiAgcmV0dXJuIGNsZWFuKHVybC5yZXBsYWNlKC9cXCMuKiQvLCAnJykpXG59XG5cbmZ1bmN0aW9uIGhvc3RuYW1lICh1cmwpIHtcbiAgcmV0dXJuIHBhcnNlKG5vcm1hbGl6ZSh1cmwpKS5ob3N0bmFtZS5yZXBsYWNlKC9ed3d3XFwuLywgJycpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZSAoaW5wdXQpIHtcbiAgaWYgKGlucHV0LnRyaW0oKS5sZW5ndGggPT09IDApIHJldHVybiAnJ1xuXG4gIGlmIChpc1NlYXJjaFF1ZXJ5KGlucHV0KSkge1xuICAgIHJldHVybiBgaHR0cHM6Ly9nb29nbGUuY29tL3NlYXJjaD9xPSR7ZW5jb2RlVVJJKGlucHV0KX1gXG4gIH1cblxuICBpZiAoIS9eXFx3KzpcXC9cXC8vLnRlc3QoaW5wdXQpKSB7XG4gICAgcmV0dXJuIGBodHRwOi8vJHtpbnB1dH1gXG4gIH1cblxuICByZXR1cm4gaW5wdXRcbn1cblxuZnVuY3Rpb24gaXNTZWFyY2hRdWVyeSAoaW5wdXQpIHtcbiAgcmV0dXJuICFpc1VSTChpbnB1dC50cmltKCkpXG59XG5cbmZ1bmN0aW9uIGlzVVJMIChpbnB1dCkge1xuICByZXR1cm4gaW5wdXQuaW5kZXhPZignICcpID09PSAtMSAmJiAoL15cXHcrOlxcL1xcLy8udGVzdChpbnB1dCkgfHwgaW5wdXQuaW5kZXhPZignLicpID4gMCB8fCBpbnB1dC5pbmRleE9mKCc6JykgPiAwKVxufVxuXG5mdW5jdGlvbiBjbGVhblVUTSAodXJsKSB7XG4gIHJldHVybiB1cmxcbiAgICAucmVwbGFjZSgvKFxcP3xcXCYpdXRtX1tcXHddK1xcPVteXFwmXSsvZywgJyQxJylcbiAgICAucmVwbGFjZSgvKFxcP3xcXCYpcmVmXFw9W15cXCZdK1xcJj8vLCAnJDEnKVxuICAgIC5yZXBsYWNlKC9bXFwmXXsyLH0vLCcmJylcbiAgICAucmVwbGFjZSgnPyYnLCAnPycpXG59XG4iXX0=
