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
        this.renderCommentButton(),
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
    key: "renderCommentButton",
    value: function renderCommentButton() {
      var hostname = (0, _urlImage.findHostname)(this.state.like.url);
      var isHomepage = (0, _urls.clean)(this.state.like.url).indexOf('/') === -1;

      if (!isHomepage) return;

      return (0, _preact.h)(
        "a",
        { title: "Comments about " + hostname, className: "button comment-button", href: "https://getkozmos.com/site/" + hostname },
        (0, _preact.h)(_icon2.default, { name: "message" }),
        "Comments"
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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require('preact');

var _wallpapers = require('./wallpapers');

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
    key: 'selected',
    value: function selected() {
      return this.src(this.today() + (this.props.index || 0));
    }
  }, {
    key: 'today',
    value: function today() {
      var now = new Date();
      var start = new Date(now.getFullYear(), 0, 0);
      var diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
      return Math.floor(diff / ONE_DAY);
    }
  }, {
    key: 'src',
    value: function src(index) {
      return _wallpapers2.default[index % _wallpapers2.default.length];
    }
  }, {
    key: 'width',
    value: function width() {
      return window.innerWidth;
    }
  }, {
    key: 'url',
    value: function url(src) {
      return src.url + '?auto=format&fit=crop&w=' + this.width();
    }
  }, {
    key: 'render',
    value: function render() {
      var src = this.selected();

      var style = {
        backgroundImage: 'url(' + this.url(src) + ')'
      };

      if (src.position) {
        style.backgroundPosition = src.position;
      }

      return (0, _preact.h)('div', { className: 'wallpaper', style: style });
    }
  }]);

  return Wallpaper;
}(_preact.Component);

exports.default = Wallpaper;

},{"./wallpapers":28,"preact":33}],28:[function(require,module,exports){
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
  { "url": "https://images.unsplash.com/photo-1505053262691-624063f94b65" },
  { "url": "https://c2.staticflickr.com/4/3913/14945702736_9d283044a7_h.jpg" },
  { "url": "https://c2.staticflickr.com/4/3896/14215383097_bd07342e8e_h.jpg" },
  { "url": "https://c2.staticflickr.com/6/5035/14103268026_25ed96f811_o.jpg" },
  { "url": "https://c1.staticflickr.com/3/2825/13464931774_5ea96608aa_h.jpg" }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaHJvbWUvc2V0dGluZ3Mtc2VjdGlvbnMuanNvbiIsImxpYi9tZXNzYWdpbmcuanMiLCJuZXd0YWIvYm9va21hcmstc2VhcmNoLmpzIiwibmV3dGFiL2Jvb2ttYXJrLXRhZ3MuanMiLCJuZXd0YWIvY29udGVudC5qcyIsIm5ld3RhYi9ncmVldGluZy5qcyIsIm5ld3RhYi9oaXN0b3J5LmpzIiwibmV3dGFiL2ljb24uanMiLCJuZXd0YWIvbG9nby5qcyIsIm5ld3RhYi9tZW51LmpzIiwibmV3dGFiL21lc3NhZ2luZy5qcyIsIm5ld3RhYi9uZXd0YWIuanMiLCJuZXd0YWIvb3Blbi13ZWJzaXRlLmpzIiwibmV3dGFiL3F1ZXJ5LXN1Z2dlc3Rpb25zLmpzIiwibmV3dGFiL3JlY2VudC1ib29rbWFya3MuanMiLCJuZXd0YWIvcmVzdWx0cy5qcyIsIm5ld3RhYi9yb3dzLmpzIiwibmV3dGFiL3NlYXJjaC1pbnB1dC5qcyIsIm5ld3RhYi9zZWFyY2guanMiLCJuZXd0YWIvc2V0dGluZ3MuanMiLCJuZXd0YWIvc2lkZWJhci5qcyIsIm5ld3RhYi90YWdiYXIuanMiLCJuZXd0YWIvdGl0bGVzLmpzIiwibmV3dGFiL3RvcC1zaXRlcy5qcyIsIm5ld3RhYi91cmwtaWNvbi5qcyIsIm5ld3RhYi91cmwtaW1hZ2UuanMiLCJuZXd0YWIvd2FsbHBhcGVyLmpzIiwibmV3dGFiL3dhbGxwYXBlcnMuanNvbiIsIm5vZGVfbW9kdWxlcy9kZWJvdW5jZS1mbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lc2NhcGUtcmVnZXhwLWNvbXBvbmVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbWcvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3ByZWFjdC9kaXN0L3ByZWFjdC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHVueWNvZGUvcHVueWNvZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yYW5kb20tY29sb3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVsYXRpdmUtZGF0ZS9saWIvcmVsYXRpdmUtZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9ybmQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGl0bGUtY2FzZS1taW5vcnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGl0bGUtZnJvbS11cmwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdG8tY2FwaXRhbC1jYXNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RvLW5vLWNhc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdG8tdGl0bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdXJsL3VybC5qcyIsIm5vZGVfbW9kdWxlcy91cmwvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy91cmxzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzdDQSxJQUFJLGlCQUFpQixDQUFyQjs7QUFFTyxJQUFNLHNEQUF1QixDQUE3Qjs7SUFFYyxTO0FBQ25CLHVCQUFjO0FBQUE7O0FBQ1osU0FBSyxp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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHtcbiAgICBrZXk6IFwib25lQ2xpY2tMaWtlXCIsXG4gICAgdGl0bGU6IFwiT25lLWNsaWNrIGJvb2ttYXJraW5nXCIsXG4gICAgZGVzYzogXCJIZWFydCBidXR0b24gd2lsbCBpbW1lZGlhdGVseSBib29rbWFyayB3aGVuIGNsaWNrZWQuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHBvcHVwOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwicmVjZW50Qm9va21hcmtzRmlyc3RcIixcbiAgICB0aXRsZTogXCJSZWNlbnQgQm9va21hcmtzIEZpcnN0XCIsXG4gICAgZGVzYzogXCJNb3ZlIFJlY2VudCBCb29rbWFya3MgT3ZlciBGcmVxdWVudGx5IFZpc2l0ZWRcIixcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9LFxuICB7XG4gICAga2V5OiBcIm1pbmltYWxNb2RlXCIsXG4gICAgdGl0bGU6IFwiRW5hYmxlIE1pbmltYWwgTW9kZVwiLFxuICAgIGRlc2M6IFwiSGlkZSBtYWpvcml0eSBvZiB0aGUgaW50ZXJmYWNlIHVudGlsIHVzZXIgZm9jdXNlcy5cIixcbiAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgbmV3dGFiOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwic2hvd1dhbGxwYXBlclwiLFxuICAgIHRpdGxlOiBcIlNob3cgV2FsbHBhcGVyXCIsXG4gICAgZGVzYzogXCJHZXQgYSBuZXcgYmVhdXRpZnVsIHBob3RvIGluIHlvdXIgbmV3IHRhYiBldmVyeSBkYXkuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9LFxuICB7XG4gICAga2V5OiBcImVuYWJsZUdyZWV0aW5nXCIsXG4gICAgdGl0bGU6IFwiU2hvdyBncmVldGluZyAmIHRpbWVcIixcbiAgICBkZXNjOiBcIlNlZSB5b3VyIG5hbWUsIGFuZCBhIG5pY2UgY2xvY2suXCIsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBuZXd0YWI6IHRydWVcbiAgfSxcbiAge1xuICAgIGtleTogXCJlbmFibGVOZXdUYWJcIixcbiAgICB0aXRsZTogXCJFbmFibGUgTmV3IFRhYiBJbnRlcmZhY2VcIixcbiAgICBkZXNjOiBcIkZhc3RlciBhbmQgZWFzaWVyIHNlYXJjaCBpbnRlcmZhY2UuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHBvcHVwOiB0cnVlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9XG5dXG4iLCJsZXQgbWVzc2FnZUNvdW50ZXIgPSAwXG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RJTUVPVVRfU0VDUyA9IDVcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnaW5nIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5saXN0ZW5Gb3JNZXNzYWdlcygpXG4gICAgdGhpcy53YWl0aW5nID0ge31cbiAgfVxuXG4gIGRyYWZ0KHsgaWQsIGNvbnRlbnQsIGVycm9yLCB0bywgcmVwbHkgfSkge1xuICAgIGlkID0gdGhpcy5nZW5lcmF0ZUlkKClcblxuICAgIHJldHVybiB7XG4gICAgICBmcm9tOiB0aGlzLm5hbWUsXG4gICAgICB0bzogdG8gfHwgdGhpcy50YXJnZXQsXG4gICAgICBlcnJvcjogY29udGVudC5lcnJvciB8fCBlcnJvcixcbiAgICAgIGlkLCBjb250ZW50LCByZXBseVxuICAgIH1cbiAgfVxuXG4gIGdlbmVyYXRlSWQoKSB7XG4gICAgcmV0dXJuIChEYXRlLm5vdygpICogMTAwMCkgKyAoKyttZXNzYWdlQ291bnRlcilcbiAgfVxuXG4gIG9uUmVjZWl2ZShtc2cpIHtcbiAgICBpZiAobXNnLnRvICE9PSB0aGlzLm5hbWUpIHJldHVybiB0cnVlXG5cbiAgICBpZiAobXNnLnJlcGx5ICYmIHRoaXMud2FpdGluZ1ttc2cucmVwbHldKSB7XG4gICAgICB0aGlzLndhaXRpbmdbbXNnLnJlcGx5XShtc2cpXG4gICAgfVxuXG4gICAgaWYgKG1zZy5yZXBseSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobXNnLmNvbnRlbnQgJiYgbXNnLmNvbnRlbnQucGluZykge1xuICAgICAgdGhpcy5yZXBseShtc2csIHsgcG9uZzogdHJ1ZSB9KVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBwaW5nKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zZW5kKHsgcGluZzogdHJ1ZSB9LCBjYWxsYmFjaylcbiAgfVxuXG4gIHJlcGx5KG1zZywgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5jb250ZW50KSB7XG4gICAgICBvcHRpb25zID0ge1xuICAgICAgICBjb250ZW50OiBvcHRpb25zXG4gICAgICB9XG4gICAgfVxuXG4gICAgb3B0aW9ucy5yZXBseSA9IG1zZy5pZFxuICAgIG9wdGlvbnMudG8gPSBtc2cuZnJvbVxuXG4gICAgdGhpcy5zZW5kKG9wdGlvbnMpXG4gIH1cblxuICBzZW5kKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbXNnID0gdGhpcy5kcmFmdChvcHRpb25zLmNvbnRlbnQgPyBvcHRpb25zIDogeyBjb250ZW50OiBvcHRpb25zIH0pXG5cbiAgICB0aGlzLnNlbmRNZXNzYWdlKG1zZylcblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdGhpcy53YWl0UmVwbHlGb3IobXNnLmlkLCBERUZBVUxUX1RJTUVPVVRfU0VDUywgY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgd2FpdFJlcGx5Rm9yKG1zZ0lkLCB0aW1lb3V0U2VjcywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgIGxldCB0aW1lb3V0ID0gdW5kZWZpbmVkXG5cbiAgICBpZiAodGltZW91dFNlY3MgPiAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChvblRpbWVvdXQsIHRpbWVvdXRTZWNzICogMTAwMClcbiAgICB9XG5cbiAgICB0aGlzLndhaXRpbmdbbXNnSWRdID0gbXNnID0+IHtcbiAgICAgIGRvbmUoKVxuICAgICAgY2FsbGJhY2sobXNnKVxuICAgIH1cblxuICAgIHJldHVybiBkb25lXG5cbiAgICBmdW5jdGlvbiBkb25lICgpIHtcbiAgICAgIGlmICh0aW1lb3V0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgIH1cblxuICAgICAgdGltZW91dCA9IHVuZGVmaW5lZFxuICAgICAgZGVsZXRlIHNlbGYud2FpdGluZ1ttc2dJZF1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblRpbWVvdXQgKCkge1xuICAgICAgZG9uZSgpXG4gICAgICBjYWxsYmFjayh7IGVycm9yOiAnTWVzc2FnZSByZXNwb25zZSB0aW1lb3V0ICgnICsgdGltZW91dFNlY3MgKycpcy4nIH0pXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb29rbWFya1NlYXJjaCBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSAnYm9va21hcmstc2VhcmNoJ1xuICAgIHRoaXMudGl0bGUgPSAnTGlrZWQgaW4gS296bW9zJ1xuXG4gICAgdGhpcy51cGRhdGUgPSBkZWJvdW5jZSh0aGlzLl91cGRhdGUuYmluZCh0aGlzKSwgMjUwKVxuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5ICYmIHF1ZXJ5Lmxlbmd0aCA+IDEgJiYgKHF1ZXJ5LmluZGV4T2YoJ3RhZzonKSAhPT0gMCB8fCBxdWVyeS5sZW5ndGggPCA1KVxuICB9XG5cbiAgZmFpbChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIH1cblxuICBfdXBkYXRlKHF1ZXJ5KSB7XG4gICAgY29uc3Qgb3F1ZXJ5ID0gcXVlcnkgfHwgdGhpcy5yZXN1bHRzLnByb3BzLnF1ZXJ5XG5cbiAgICB0aGlzLnJlc3VsdHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdzZWFyY2gtYm9va21hcmtzJywgcXVlcnkgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAob3F1ZXJ5ICE9PSB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnkudHJpbSgpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMuZmFpbChyZXNwLmVycm9yKVxuXG4gICAgICB0aGlzLmFkZChyZXNwLmNvbnRlbnQucmVzdWx0cy5saWtlcylcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlzdEJvb2ttYXJrc0J5VGFnIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMubmFtZSA9ICdib29rbWFya3MtYnktdGFnJ1xuICAgIHRoaXMudGl0bGUgPSBxdWVyeSA9PiBgVGFnZ2VkIHdpdGggJHtxdWVyeS5zbGljZSg0KX0gT24gS296bW9zYFxuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5ICYmIHF1ZXJ5LmluZGV4T2YoJ3RhZzonKSA9PT0gMCAmJiBxdWVyeS5sZW5ndGggPiA0XG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBjb25zdCBvcXVlcnkgPSBxdWVyeSB8fCB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnlcblxuICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ3NlYXJjaC1ib29rbWFya3MnLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChvcXVlcnkgIT09IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeS50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgIHRoaXMuYWRkKHJlc3AuY29udGVudC5yZXN1bHRzLmxpa2VzKVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnQtd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNlbnRlclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgY29udGVudCAke3RoaXMucHJvcHMuZm9jdXNlZCA/IFwiZm9jdXNlZFwiIDogXCJcIn1gfT5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JlZXRpbmcgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ2dldC1uYW1lJyB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5vbkVycm9yKHJlc3AuZXJyb3IpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBuYW1lOiByZXNwLmNvbnRlbnQubmFtZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy50aWNrKClcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuZGVsZXRlVGltZXIoKVxuICB9XG5cbiAgZGVsZXRlVGltZXIoKSB7XG4gICAgaWYgKHRoaXMudGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG4gICAgICB0aGlzLnRpbWVyID0gdW5kZWZpbmVkXG4gICAgfVxuICB9XG5cbiAgc2V0VGltZXIoKSB7XG4gICAgdGhpcy5kZWxldGVUaW1lcigpXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy50aWNrKCksIDYwMDAwKVxuICB9XG5cbiAgdGljaygpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGhvdXJzOiBub3cuZ2V0SG91cnMoKSxcbiAgICAgIG1pbnV0ZXM6IG5vdy5nZXRNaW51dGVzKClcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRUaW1lcigpXG4gIH1cblxuICBvbkVycm9yKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmVldGluZ1wiPlxuICAgICAgICB7dGhpcy5yZW5kZXJNZXNzYWdlKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlclRpbWUoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRpbWUoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGltZVwiPlxuICAgICAgICB7cGFkKHRoaXMuc3RhdGUuaG91cnMpfTp7cGFkKHRoaXMuc3RhdGUubWludXRlcyl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJNZXNzYWdlKCkge1xuICAgIGNvbnN0IGhvdXIgPSB0aGlzLnN0YXRlLmhvdXJzXG4gICAgbGV0IG1lc3NhZ2UgPSBcIkdvb2QgbW9ybmluZ1wiXG5cbiAgICBpZiAoaG91ciA+PSAxMikgbWVzc2FnZSA9IFwiR29vZCBBZnRlcm5vb25cIlxuICAgIGlmIChob3VyID49IDE2KSBtZXNzYWdlID0gXCJHb29kIEV2ZW5pbmdcIlxuXG4gICAgbWVzc2FnZSArPSAodGhpcy5zdGF0ZS5uYW1lID8gXCIsXCIgOiBcIi5cIilcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lc3NhZ2VcIj5cbiAgICAgICAge21lc3NhZ2V9XG4gICAgICAgIHt0aGlzLnJlbmRlck5hbWUoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck5hbWUoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLm5hbWUpIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmFtZVwiPlxuICAgICAgICB7dGhpcy5zdGF0ZS5uYW1lLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnN0YXRlLm5hbWUuc2xpY2UoMSl9LlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIHBhZCAobikge1xuICBpZiAoU3RyaW5nKG4pLmxlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gJzAnICsgblxuICB9XG5cbiAgcmV0dXJuIG5cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IHsgZmluZEhvc3RuYW1lIH0gZnJvbSAnLi91cmwtaW1hZ2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhpc3RvcnkgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gJ2hpc3RvcnknXG4gICAgdGhpcy50aXRsZSA9ICdQcmV2aW91c2x5IFZpc2l0ZWQnXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkubGVuZ3RoID4gMSAmJiBxdWVyeS50cmltKCkubGVuZ3RoID4gMVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgY2hyb21lLmhpc3Rvcnkuc2VhcmNoKHsgdGV4dDogcXVlcnkgfSwgaGlzdG9yeSA9PiB7XG4gICAgICB0aGlzLmFkZChoaXN0b3J5LmZpbHRlcihmaWx0ZXJPdXRTZWFyY2gpKVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gZmlsdGVyT3V0U2VhcmNoIChyb3cpIHtcbiAgcmV0dXJuIGZpbmRIb3N0bmFtZShyb3cudXJsKS5zcGxpdCgnLicpWzBdICE9PSAnZ29vZ2xlJ1xuICAgICYmICEvc2VhcmNoXFwvP1xcP3FcXD1cXHcqLy50ZXN0KHJvdy51cmwpXG4gICAgJiYgIS9mYWNlYm9va1xcLmNvbVxcL3NlYXJjaC8udGVzdChyb3cudXJsKVxuICAgICYmICEvdHdpdHRlclxcLmNvbVxcL3NlYXJjaC8udGVzdChyb3cudXJsKVxuICAgICYmIGZpbmRIb3N0bmFtZShyb3cudXJsKSAhPT0gJ3QuY28nXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSWNvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBtZXRob2QgPSB0aGlzWydyZW5kZXInICsgdGhpcy5wcm9wcy5uYW1lLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKDAsIDEpICsgdGhpcy5wcm9wcy5uYW1lLnNsaWNlKDEpXVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgb25DbGljaz17dGhpcy5wcm9wcy5vbkNsaWNrfSBjbGFzc05hbWU9e2BpY29uIGljb24tJHt0aGlzLnByb3BzLm5hbWV9YH0gey4uLnRoaXMucHJvcHN9PlxuICAgICAgICB7bWV0aG9kID8gbWV0aG9kLmNhbGwodGhpcykgOiBudWxsfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgc3Ryb2tlICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zdHJva2UgfHwgMlxuICB9XG5cbiAgcmVuZGVyQWxlcnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWFsZXJ0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTYgMyBMMzAgMjkgMiAyOSBaIE0xNiAxMSBMMTYgMTkgTTE2IDIzIEwxNiAyNVwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJDbG9jaygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktY2xvY2tcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjE2XCIgY3k9XCIxNlwiIHI9XCIxNFwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTYgOCBMMTYgMTYgMjAgMjBcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2xvc2UoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWNsb3NlXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMiAzMCBMMzAgMiBNMzAgMzAgTDIgMlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJIZWFydCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktaGVhcnRcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cImN1cnJlbnRjb2xvclwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5zdHJva2UoKX0+XG4gICAgICAgIDxwYXRoIGQ9XCJNNCAxNiBDMSAxMiAyIDYgNyA0IDEyIDIgMTUgNiAxNiA4IDE3IDYgMjEgMiAyNiA0IDMxIDYgMzEgMTIgMjggMTYgMjUgMjAgMTYgMjggMTYgMjggMTYgMjggNyAyMCA0IDE2IFpcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2VhcmNoKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1zZWFyY2hcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjE0XCIgY3k9XCIxNFwiIHI9XCIxMlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMjMgMjMgTDMwIDMwXCIgIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJFeHRlcm5hbCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktZXh0ZXJuYWxcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0xNCA5IEwzIDkgMyAyOSAyMyAyOSAyMyAxOCBNMTggNCBMMjggNCAyOCAxNCBNMjggNCBMMTQgMThcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGFnKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS10YWdcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjI0XCIgY3k9XCI4XCIgcj1cIjJcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTIgMTggTDE4IDIgMzAgMiAzMCAxNCAxNCAzMCBaXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRyYXNoKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS10cmFzaFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTI4IDYgTDYgNiA4IDMwIDI0IDMwIDI2IDYgNCA2IE0xNiAxMiBMMTYgMjQgTTIxIDEyIEwyMCAyNCBNMTEgMTIgTDEyIDI0IE0xMiA2IEwxMyAyIDE5IDIgMjAgNlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJSaWdodENoZXZyb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWNoZXZyb24tcmlnaHRcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0xMiAzMCBMMjQgMTYgMTIgMlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZXR0aW5ncygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktc2V0dGluZ3NcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0xMyAyIEwxMyA2IDExIDcgOCA0IDQgOCA3IDExIDYgMTMgMiAxMyAyIDE5IDYgMTkgNyAyMSA0IDI0IDggMjggMTEgMjUgMTMgMjYgMTMgMzAgMTkgMzAgMTkgMjYgMjEgMjUgMjQgMjggMjggMjQgMjUgMjEgMjYgMTkgMzAgMTkgMzAgMTMgMjYgMTMgMjUgMTEgMjggOCAyNCA0IDIxIDcgMTkgNiAxOSAyIFpcIiAvPlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTZcIiBjeT1cIjE2XCIgcj1cIjRcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTWVzc2FnZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktbXNnXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMiA0IEwzMCA0IDMwIDIyIDE2IDIyIDggMjkgOCAyMiAyIDIyIFpcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nbyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGEgY2xhc3NOYW1lPVwibG9nb1wiIGhyZWY9XCJodHRwczovL2dldGtvem1vcy5jb21cIj5cbiAgICAgICAgPGltZyBzcmM9e2Nocm9tZS5leHRlbnNpb24uZ2V0VVJMKFwiaW1hZ2VzL2ljb24xMjgucG5nXCIpfSB0aXRsZT1cIk9wZW4gS296bW9zXCIgLz5cbiAgICAgIDwvYT5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW51IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc2V0VGl0bGUodGl0bGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgdGl0bGUgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICB7dGhpcy5zdGF0ZS50aXRsZSB8fCBcIlwifVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImJ1dHRvbnNcIj5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGljb249XCJjYWxlbmRhclwiXG4gICAgICAgICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLnNldFRpdGxlKCdSZWNlbnRseSBWaXNpdGVkJyl9XG4gICAgICAgICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMuc2V0VGl0bGUoKX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vcGVuUmVjZW50KCl9IC8+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGljb249XCJoZWFydFwiXG4gICAgICAgICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLnNldFRpdGxlKCdCb29rbWFya3MnKX1cbiAgICAgICAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy5zZXRUaXRsZSgpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5Cb29rbWFya3MoKX0gLz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgIGljb249XCJmaXJlXCJcbiAgICAgICAgICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLnNldFRpdGxlKCdNb3N0IFZpc2l0ZWQnKX1cbiAgICAgICAgICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMuc2V0VGl0bGUoKX1cbiAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub3BlblRvcCgpfSAvPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCBNZXNzYWdpbmcgZnJvbSAnLi4vbGliL21lc3NhZ2luZydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnJvbU5ld1RhYlRvQmFja2dyb3VuZCBleHRlbmRzIE1lc3NhZ2luZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLm5hbWUgPSAna296bW9zOm5ld3RhYidcbiAgICB0aGlzLnRhcmdldCA9ICdrb3ptb3M6YmFja2dyb3VuZCdcbiAgfVxuXG4gIGxpc3RlbkZvck1lc3NhZ2VzKCkge1xuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihtc2cgPT4gdGhpcy5vblJlY2VpdmUobXNnKSlcbiAgfVxuXG4gIHNlbmRNZXNzYWdlIChtc2csIGNhbGxiYWNrKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobXNnLCBjYWxsYmFjaylcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50LCByZW5kZXIgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBXYWxscGFwZXIgZnJvbSAnLi93YWxscGFwZXInXG5pbXBvcnQgTWVudSBmcm9tIFwiLi9tZW51XCJcbmltcG9ydCBTZWFyY2ggZnJvbSAnLi9zZWFyY2gnXG5pbXBvcnQgTG9nbyBmcm9tICcuL2xvZ28nXG5pbXBvcnQgTWVzc2FnaW5nIGZyb20gXCIuL21lc3NhZ2luZ1wiXG5pbXBvcnQgU2V0dGluZ3MgZnJvbSBcIi4vc2V0dGluZ3NcIlxuXG5jbGFzcyBOZXdUYWIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWVzc2FnaW5nKClcblxuICAgIHRoaXMubG9hZFNldHRpbmdzKClcbiAgICB0aGlzLmNoZWNrSWZEaXNhYmxlZCgpXG4gIH1cblxuICBsb2FkU2V0dGluZ3MoYXZvaWRDYWNoZSkge1xuICAgIHRoaXMubG9hZFNldHRpbmcoJ21pbmltYWxNb2RlJywgYXZvaWRDYWNoZSlcbiAgICB0aGlzLmxvYWRTZXR0aW5nKCdzaG93V2FsbHBhcGVyJywgYXZvaWRDYWNoZSlcbiAgICB0aGlzLmxvYWRTZXR0aW5nKCdlbmFibGVHcmVldGluZycsIGF2b2lkQ2FjaGUpXG4gICAgdGhpcy5sb2FkU2V0dGluZygncmVjZW50Qm9va21hcmtzRmlyc3QnLCBhdm9pZENhY2hlKVxuICB9XG5cbiAgY2hlY2tJZkRpc2FibGVkKCkge1xuICAgIGlmIChsb2NhbFN0b3JhZ2VbJ2lzLWRpc2FibGVkJ10gPT0gJzEnKSB7XG4gICAgICB0aGlzLnNob3dEZWZhdWx0TmV3VGFiKClcbiAgICB9XG5cbiAgICB0aGlzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LXNldHRpbmdzLXZhbHVlJywga2V5OiAnZW5hYmxlTmV3VGFiJyB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IHJlc3AuZXJyb3IgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXNwLmNvbnRlbnQudmFsdWUpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlWydpcy1kaXNhYmxlZCddID0gXCIxXCJcbiAgICAgICAgdGhpcy5zaG93RGVmYXVsdE5ld1RhYigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2NhbFN0b3JhZ2VbJ2lzLWRpc2FibGVkJ10gPSBcIlwiXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGxvYWRTZXR0aW5nKGtleSwgYXZvaWRDYWNoZSkge1xuICAgIGlmICghYXZvaWRDYWNoZSAmJiBsb2NhbFN0b3JhZ2VbJ3NldHRpbmdzLWNhY2hlLScgKyBrZXldKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmFwcGx5U2V0dGluZyhrZXksIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydzZXR0aW5ncy1jYWNoZS0nICsga2V5XSkpXG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIHRoaXMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtc2V0dGluZ3MtdmFsdWUnLCBrZXkgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAoIXJlc3AuZXJyb3IpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlWydzZXR0aW5ncy1jYWNoZS0nICsga2V5XSA9IEpTT04uc3RyaW5naWZ5KHJlc3AuY29udGVudC52YWx1ZSlcbiAgICAgICAgdGhpcy5hcHBseVNldHRpbmcoa2V5LCByZXNwLmNvbnRlbnQudmFsdWUpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGFwcGx5U2V0dGluZyhrZXksIHZhbHVlKSB7XG4gICAgY29uc3QgdSA9IHt9XG4gICAgdVtrZXldID0gdmFsdWVcbiAgICB0aGlzLnNldFN0YXRlKHUpXG4gIH1cblxuICBzaG93RGVmYXVsdE5ld1RhYigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5kaXNhYmxlZCkgcmV0dXJuXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG5ld1RhYlVSTDogZG9jdW1lbnQubG9jYXRpb24uaHJlZixcbiAgICAgIGRpc2FibGVkOiB0cnVlXG4gICAgfSlcblxuXHRcdGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIGZ1bmN0aW9uKHRhYnMpIHtcblx0XHRcdHZhciBhY3RpdmUgPSB0YWJzWzBdLmlkXG5cblx0XHRcdGNocm9tZS50YWJzLnVwZGF0ZShhY3RpdmUsIHtcbiAgICAgICAgdXJsOiAvZmlyZWZveC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgPyBcImFib3V0Om5ld3RhYlwiIDogXCJjaHJvbWUtc2VhcmNoOi8vbG9jYWwtbnRwL2xvY2FsLW50cC5odG1sXCJcbiAgICAgIH0pXG5cdFx0fSlcbiAgfVxuXG4gIHByZXZXYWxscGFwZXIoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB3YWxscGFwZXJJbmRleDogKHRoaXMuc3RhdGUud2FsbHBhcGVySW5kZXggfHwgMCkgLSAxXG4gICAgfSlcbiAgfVxuXG4gIG5leHRXYWxscGFwZXIoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB3YWxscGFwZXJJbmRleDogKHRoaXMuc3RhdGUud2FsbHBhcGVySW5kZXggfHwgMCkgKyAxXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5kaXNhYmxlZCkgcmV0dXJuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BuZXd0YWIgJHt0aGlzLnN0YXRlLnNob3dXYWxscGFwZXIgPyBcImhhcy13YWxscGFwZXJcIiA6IFwiXCJ9ICR7dGhpcy5zdGF0ZS5taW5pbWFsTW9kZSA/IFwibWluaW1hbFwiIDogXCJcIn1gfT5cbiAgICAgICAge3RoaXMuc3RhdGUubWluaW1hbE1vZGUgPyBudWxsIDogPExvZ28gLz59XG4gICAgICAgIDxTZXR0aW5ncyBvbkNoYW5nZT17KCkgPT4gdGhpcy5sb2FkU2V0dGluZ3ModHJ1ZSl9IG1lc3NhZ2VzPXt0aGlzLm1lc3NhZ2VzfSB0eXBlPVwibmV3dGFiXCIgLz5cbiAgICAgICAgPFNlYXJjaCByZWNlbnRCb29rbWFya3NGaXJzdD17dGhpcy5zdGF0ZS5yZWNlbnRCb29rbWFya3NGaXJzdH0gbmV4dFdhbGxwYXBlcj17KCkgPT4gdGhpcy5uZXh0V2FsbHBhcGVyKCl9IHByZXZXYWxscGFwZXI9eygpID0+IHRoaXMucHJldldhbGxwYXBlcigpfSBlbmFibGVHcmVldGluZz17dGhpcy5zdGF0ZS5lbmFibGVHcmVldGluZ30gc2V0dGluZ3M9e3RoaXMuc2V0dGluZ3N9IC8+XG4gICAgICAgIHsgdGhpcy5zdGF0ZS5zaG93V2FsbHBhcGVyID8gPFdhbGxwYXBlciBpbmRleD17dGhpcy5zdGF0ZS53YWxscGFwZXJJbmRleH0gbWVzc2FnZXM9e3RoaXMubWVzc2FnZXN9IC8+IDogbnVsbCB9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxucmVuZGVyKDxOZXdUYWIgLz4sIGRvY3VtZW50LmJvZHkpXG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3BlbldlYnNpdGUgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gJ29wZW4td2Vic2l0ZSdcbiAgICB0aGlzLnBpbm5lZCA9IHRydWVcbiAgICB0aGlzLnRpdGxlID0gJydcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeSAmJiBxdWVyeS5sZW5ndGggPiAxICYmIC9eW1xcd1xcLl0rJC9pLnRlc3QocXVlcnkpXG4gIH1cblxuICBmYWlsKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIGNvbnN0IG9xdWVyeSA9IHF1ZXJ5IHx8IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeVxuXG4gICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LXdlYnNpdGUnLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChvcXVlcnkgIT09IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeS50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgIHRoaXMuYWRkKHJlc3AuY29udGVudC5yZXN1bHRzLmxpa2VzLnNsaWNlKDAsIDEpKVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IHRpdGxlRnJvbVVSTCBmcm9tIFwidGl0bGUtZnJvbS11cmxcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeVN1Z2dlc3Rpb25zIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMubmFtZSA9ICdxdWVyeS1zdWdnZXN0aW9ucydcbiAgICB0aGlzLnBpbm5lZCA9IHRydWVcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeS5sZW5ndGggPiAxICYmIHF1ZXJ5LnRyaW0oKS5sZW5ndGggPiAxXG4gIH1cblxuICBjcmVhdGVVUkxTdWdnZXN0aW9ucyhxdWVyeSkge1xuICAgIGlmICghaXNVUkwocXVlcnkpKSByZXR1cm4gW11cblxuICAgIGNvbnN0IHVybCA9IC9cXHcrOlxcL1xcLy8udGVzdChxdWVyeSkgPyBxdWVyeSA6ICdodHRwOi8vJyArIHF1ZXJ5XG5cbiAgICByZXR1cm4gW3tcbiAgICAgIHRpdGxlOiBgT3BlbiBcIiR7dGl0bGVGcm9tVVJMKHF1ZXJ5KX1cImAsXG4gICAgICB0eXBlOiAncXVlcnktc3VnZ2VzdGlvbicsXG4gICAgICB1cmxcbiAgICB9XVxuICB9XG5cbiAgY3JlYXRlU2VhcmNoU3VnZ2VzdGlvbnMocXVlcnkpIHtcbiAgICBpZiAoaXNVUkwocXVlcnkpKSByZXR1cm4gW11cbiAgICBpZiAocXVlcnkuaW5kZXhPZigndGFnOicpID09PSAwICYmIHF1ZXJ5Lmxlbmd0aCA+IDQpIHJldHVybiBbe1xuICAgICAgdXJsOiAnaHR0cHM6Ly9nZXRrb3ptb3MuY29tL3RhZy8nICsgZW5jb2RlVVJJKHF1ZXJ5LnNsaWNlKDQpKSxcbiAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgIHRpdGxlOiBgT3BlbiBcIiR7cXVlcnkuc2xpY2UoNCl9XCIgdGFnIGluIEtvem1vc2AsXG4gICAgICB0eXBlOiAnc2VhcmNoLXF1ZXJ5J1xuICAgIH1dXG5cbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICB1cmw6ICdodHRwczovL2dvb2dsZS5jb20vc2VhcmNoP3E9JyArIGVuY29kZVVSSShxdWVyeSksXG4gICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgdGl0bGU6IGBTZWFyY2ggXCIke3F1ZXJ5fVwiIG9uIEdvb2dsZWAsXG4gICAgICAgIHR5cGU6ICdzZWFyY2gtcXVlcnknXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB1cmw6ICdodHRwczovL2dldGtvem1vcy5jb20vc2VhcmNoP3E9JyArIGVuY29kZVVSSShxdWVyeSksXG4gICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgdGl0bGU6IGBTZWFyY2ggXCIke3F1ZXJ5fVwiIG9uIEtvem1vc2AsXG4gICAgICAgIHR5cGU6ICdzZWFyY2gtcXVlcnknXG4gICAgICB9XG4gICAgXVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgdGhpcy5hZGQodGhpcy5jcmVhdGVVUkxTdWdnZXN0aW9ucyhxdWVyeSkuY29uY2F0KHRoaXMuY3JlYXRlU2VhcmNoU3VnZ2VzdGlvbnMocXVlcnkpKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1VSTCAocXVlcnkpIHtcbiAgcmV0dXJuIHF1ZXJ5LnRyaW0oKS5pbmRleE9mKCcuJykgPiAwICYmIHF1ZXJ5LmluZGV4T2YoJyAnKSA9PT0gLTFcbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWNlbnRCb29rbWFya3MgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gJ3JlY2VudC1ib29rbWFya3MnXG4gICAgdGhpcy50aXRsZSA9ICdSZWNlbnRseSBMaWtlZCBpbiBLb3ptb3MnXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkubGVuZ3RoID09PSAwXG4gIH1cblxuICBmYWlsKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LXJlY2VudC1ib29rbWFya3MnLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG4gICAgICB0aGlzLmFkZChyZXNwLmNvbnRlbnQucmVzdWx0cy5saWtlcylcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuXG5pbXBvcnQgVG9wU2l0ZXMgZnJvbSBcIi4vdG9wLXNpdGVzXCJcbmltcG9ydCBSZWNlbnRCb29rbWFya3MgZnJvbSBcIi4vcmVjZW50LWJvb2ttYXJrc1wiXG5pbXBvcnQgUXVlcnlTdWdnZXN0aW9ucyBmcm9tIFwiLi9xdWVyeS1zdWdnZXN0aW9uc1wiXG5pbXBvcnQgQm9va21hcmtTZWFyY2ggZnJvbSBcIi4vYm9va21hcmstc2VhcmNoXCJcbmltcG9ydCBIaXN0b3J5IGZyb20gXCIuL2hpc3RvcnlcIlxuaW1wb3J0IEJvb2ttYXJrVGFncyBmcm9tIFwiLi9ib29rbWFyay10YWdzXCJcblxuaW1wb3J0IFNpZGViYXIgZnJvbSBcIi4vc2lkZWJhclwiXG5pbXBvcnQgVGFnYmFyIGZyb20gXCIuL3RhZ2JhclwiXG5pbXBvcnQgTWVzc2FnaW5nIGZyb20gXCIuL21lc3NhZ2luZ1wiXG5pbXBvcnQgVVJMSWNvbiBmcm9tIFwiLi91cmwtaWNvblwiXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcbmltcG9ydCBPcGVuV2Vic2l0ZSBmcm9tICcuL29wZW4td2Vic2l0ZSdcblxuY29uc3QgTUFYX0lURU1TID0gNVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXN1bHRzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1lc3NhZ2luZygpXG5cbiAgICB0aGlzLnNldENhdGVnb3JpZXMocHJvcHMpXG5cbiAgICB0aGlzLl9vbktleVByZXNzID0gZGVib3VuY2UodGhpcy5vbktleVByZXNzLmJpbmQodGhpcyksIDUwKVxuICAgIHRoaXMudXBkYXRlKHByb3BzLnF1ZXJ5IHx8IFwiXCIpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0ICE9PSB0aGlzLnByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0KSB7XG4gICAgICB0aGlzLnNldENhdGVnb3JpZXMocHJvcHMpXG4gICAgfVxuICB9XG5cbiAgc2V0Q2F0ZWdvcmllcyhwcm9wcykge1xuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBbXG4gICAgICBuZXcgT3BlbldlYnNpdGUodGhpcywgMSksXG4gICAgICBuZXcgUXVlcnlTdWdnZXN0aW9ucyh0aGlzLCAyKSxcbiAgICAgIG5ldyBUb3BTaXRlcyh0aGlzLCBwcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdCA/IDQgOiAzKSxcbiAgICAgIG5ldyBSZWNlbnRCb29rbWFya3ModGhpcywgcHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QgPyAzIDogNCksXG4gICAgICBuZXcgQm9va21hcmtUYWdzKHRoaXMsIDUpLFxuICAgICAgbmV3IEJvb2ttYXJrU2VhcmNoKHRoaXMsIDYpLFxuICAgICAgbmV3IEhpc3RvcnkodGhpcywgNylcbiAgICBdXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNhdGVnb3JpZXNcbiAgICB9KVxuXG4gICAgdGhpcy51cGRhdGUocHJvcHMucXVlcnkgfHwgXCJcIilcbiAgfVxuXG4gIGFkZFJvd3MoY2F0ZWdvcnksIHJvd3MpIHtcbiAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgY29uc3QgdXJsTWFwID0ge31cbiAgICBsZXQgaSA9IHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICB1cmxNYXBbdGhpcy5zdGF0ZS5jb250ZW50W2ldLnVybF0gPSB0cnVlXG4gICAgfVxuXG4gICAgbGV0IHRhZ3MgPSB0aGlzLnN0YXRlLnRhZ3NcbiAgICBpID0gcm93cy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgaWYgKHJvd3NbaV0udGFncykge1xuICAgICAgICB0YWdzID0gdGFncy5jb25jYXQocm93c1tpXS50YWdzKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRhZ3MgPSB0YWdzLmZpbHRlcih0ID0+ICd0YWc6JyArIHQgIT09IHRoaXMucHJvcHMucXVlcnkpXG5cbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy50cmltKHRoaXMuc3RhdGUuY29udGVudC5jb25jYXQocm93cy5maWx0ZXIociA9PiAhdXJsTWFwW3IudXJsXSkubWFwKChyLCBpKSA9PiB7XG4gICAgICByLmNhdGVnb3J5ID0gY2F0ZWdvcnlcbiAgICAgIHIuaW5kZXggPSB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoICsgaVxuICAgICAgcmV0dXJuIHJcbiAgICB9KSkpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNvbnRlbnQsXG4gICAgICB0YWdzXG4gICAgfSlcbiAgfVxuXG4gIGNvbnRlbnQoKSB7XG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLnN0YXRlLmNvbnRlbnRcbiAgICBjb250ZW50LnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLmNhdGVnb3J5LnNvcnQgPCBiLmNhdGVnb3J5LnNvcnQpIHJldHVybiAtMVxuICAgICAgaWYgKGEuY2F0ZWdvcnkuc29ydCA+IGIuY2F0ZWdvcnkuc29ydCkgcmV0dXJuIDFcblxuICAgICAgaWYgKGEuaW5kZXggPCBiLmluZGV4KSByZXR1cm4gLTFcbiAgICAgIGlmIChhLmluZGV4ID4gYi5pbmRleCkgcmV0dXJuIDFcblxuICAgICAgcmV0dXJuIDBcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbnRlbnQubWFwKChyb3csIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6IHJvdy51cmwsXG4gICAgICAgIHRpdGxlOiByb3cudGl0bGUsXG4gICAgICAgIGltYWdlczogcm93LmltYWdlcyxcbiAgICAgICAgdHlwZTogcm93LmNhdGVnb3J5Lm5hbWUsXG4gICAgICAgIGNhdGVnb3J5OiByb3cuY2F0ZWdvcnksXG4gICAgICAgIGFic0luZGV4OiBpbmRleCxcbiAgICAgICAgaW5kZXhcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY29udGVudEJ5Q2F0ZWdvcnkoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGggPT09IDApIHJldHVybiBbXVxuXG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudCgpXG4gICAgY29uc3Qgc2VsZWN0ZWRDYXRlZ29yeSA9IHRoaXMuc3RhdGUuc2VsZWN0ZWQgPyBjb250ZW50W3RoaXMuc3RhdGUuc2VsZWN0ZWRdLmNhdGVnb3J5IDogY29udGVudFswXS5jYXRlZ29yeVxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBbXVxuICAgIGNvbnN0IGNhdGVnb3JpZXNNYXAgPSB7fVxuXG4gICAgbGV0IHRhYkluZGV4ID0gMlxuICAgIGxldCBjYXRlZ29yeSA9IG51bGxcbiAgICBjb250ZW50LmZvckVhY2goKHJvdywgaW5kKSA9PiB7XG4gICAgICBpZiAoIWNhdGVnb3J5IHx8IGNhdGVnb3J5Lm5hbWUgIT09IHJvdy5jYXRlZ29yeS5uYW1lKSB7XG4gICAgICAgIGNhdGVnb3J5ID0gcm93LmNhdGVnb3J5XG4gICAgICAgIGNhdGVnb3JpZXNNYXBbY2F0ZWdvcnkubmFtZV0gPSB7XG4gICAgICAgICAgdGl0bGU6IGNhdGVnb3J5LnRpdGxlLFxuICAgICAgICAgIG5hbWU6IGNhdGVnb3J5Lm5hbWUsXG4gICAgICAgICAgc29ydDogY2F0ZWdvcnkuc29ydCxcbiAgICAgICAgICBjb2xsYXBzZWQ6IGNvbnRlbnQubGVuZ3RoID49IE1BWF9JVEVNUyAmJiBzZWxlY3RlZENhdGVnb3J5Lm5hbWUgIT0gY2F0ZWdvcnkubmFtZSAmJiAhIWNhdGVnb3J5LnRpdGxlLFxuICAgICAgICAgIHJvd3M6IFtdXG4gICAgICAgIH1cblxuICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcmllc01hcFtjYXRlZ29yeS5uYW1lXSlcblxuICAgICAgICByb3cudGFiSW5kZXggPSArK3RhYkluZGV4XG4gICAgICB9XG5cbiAgICAgIGNhdGVnb3JpZXNNYXBbY2F0ZWdvcnkubmFtZV0ucm93cy5wdXNoKHJvdylcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNhdGVnb3JpZXNcbiAgfVxuXG4gIHRyaW0oY29udGVudCkge1xuICAgIGNvbnN0IGNhdGVnb3J5Q291bnRzID0ge31cbiAgICBjb25zdCBwaW5uZWRDb3VudCA9IHRoaXMucGlubmVkUm93Q291bnQoKVxuXG4gICAgY29udGVudCA9IGNvbnRlbnQuZmlsdGVyKHIgPT4ge1xuICAgICAgaWYgKCFjYXRlZ29yeUNvdW50c1tyLmNhdGVnb3J5Lm5hbWVdKSB7XG4gICAgICAgIGNhdGVnb3J5Q291bnRzW3IuY2F0ZWdvcnkubmFtZV0gPSAwXG4gICAgICB9XG5cbiAgICAgIGNhdGVnb3J5Q291bnRzW3IuY2F0ZWdvcnkubmFtZV0rK1xuXG4gICAgICByZXR1cm4gci5jYXRlZ29yeS5waW5uZWQgfHwgTUFYX0lURU1TIC0gcGlubmVkQ291bnQgPj0gY2F0ZWdvcnlDb3VudHNbci5jYXRlZ29yeS5uYW1lXVxuICAgIH0pXG5cbiAgICByZXR1cm4gY29udGVudFxuICB9XG5cbiAgcGlubmVkUm93Q291bnQoY29udGVudCkge1xuICAgIGNvbnRlbnQgfHwgKGNvbnRlbnQgPSB0aGlzLnN0YXRlLmNvbnRlbnQpXG4gICAgY29uc3QgbGVuID0gY29udGVudC5sZW5ndGhcblxuICAgIGxldCBjdHIgPSAwXG4gICAgbGV0IGkgPSAtMVxuICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgIGlmIChjb250ZW50W2ldLmNhdGVnb3J5LnBpbm5lZCkge1xuICAgICAgICBjdHIrK1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjdHJcbiAgfVxuXG4gIHJlc2V0KHF1ZXJ5KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZDogMCxcbiAgICAgIGNvbnRlbnQ6IFtdLFxuICAgICAgdGFnczogW10sXG4gICAgICBlcnJvcnM6IFtdLFxuICAgICAgcXVlcnk6IHF1ZXJ5IHx8ICcnXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIHF1ZXJ5ID0gKHF1ZXJ5IHx8IFwiXCIpLnRyaW0oKVxuICAgIHRoaXMucmVzZXQoKVxuICAgIHRoaXMuc3RhdGUuY2F0ZWdvcmllcy5mb3JFYWNoKGMgPT4gYy5vbk5ld1F1ZXJ5KHF1ZXJ5KSlcbiAgfVxuXG4gIHNlbGVjdChpbmRleCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWQ6IGluZGV4XG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdE5leHQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZDogKHRoaXMuc3RhdGUuc2VsZWN0ZWQgKyAxKSAlIHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGhcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0UHJldmlvdXMoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZDogdGhpcy5zdGF0ZS5zZWxlY3RlZCA9PSAwID8gdGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aCAtIDEgOiB0aGlzLnN0YXRlLnNlbGVjdGVkIC0gMVxuICAgIH0pXG4gIH1cblxuICBzZWxlY3ROZXh0Q2F0ZWdvcnkoKSB7XG4gICAgbGV0IGN1cnJlbnRDYXRlZ29yeSA9IHRoaXMuc3RhdGUuY29udGVudFt0aGlzLnN0YXRlLnNlbGVjdGVkXS5jYXRlZ29yeVxuXG4gICAgY29uc3QgbGVuID0gdGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aFxuICAgIGxldCBpID0gdGhpcy5zdGF0ZS5zZWxlY3RlZFxuICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmNvbnRlbnRbaV0uY2F0ZWdvcnkuc29ydCAhPT0gY3VycmVudENhdGVnb3J5LnNvcnQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3QoaSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuY29udGVudFswXS5jYXRlZ29yeS5zb3J0ICE9PSBjdXJyZW50Q2F0ZWdvcnkuc29ydCkge1xuICAgICAgdGhpcy5zZWxlY3QoMClcbiAgICB9XG4gIH1cblxuICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICBpZiAobmV4dFByb3BzLnF1ZXJ5ICE9PSB0aGlzLnByb3BzLnF1ZXJ5KSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChuZXh0U3RhdGUuY29udGVudC5sZW5ndGggIT09IHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG5leHRTdGF0ZS5zZWxlY3RlZCAhPT0gdGhpcy5zdGF0ZS5zZWxlY3RlZCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobmV4dFByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0ICE9PSB0aGlzLnByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0KSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX29uS2V5UHJlc3MsIGZhbHNlKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fb25LZXlQcmVzcywgZmFsc2UpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHByb3BzLnF1ZXJ5ICE9PSB0aGlzLnByb3BzLnF1ZXJ5KSB7XG4gICAgICB0aGlzLnVwZGF0ZShwcm9wcy5xdWVyeSB8fCBcIlwiKVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdCAhPT0gdGhpcy5wcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdCkge1xuICAgICAgdGhpcy5zZXRDYXRlZ29yaWVzKHByb3BzKVxuICAgIH1cblxuICB9XG5cbiAgbmF2aWdhdGVUbyh1cmwpIHtcbiAgICBpZiAoIS9eXFx3KzpcXC9cXC8vLnRlc3QodXJsKSkge1xuICAgICAgdXJsID0gJ2h0dHA6Ly8nICsgdXJsXG4gICAgfVxuXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHVybFxuICB9XG5cbiAgb25LZXlQcmVzcyhlKSB7XG4gICAgaWYgKGUua2V5Q29kZSA9PSAxMykgeyAvLyBlbnRlclxuICAgICAgdGhpcy5uYXZpZ2F0ZVRvKHRoaXMuc3RhdGUuY29udGVudFt0aGlzLnN0YXRlLnNlbGVjdGVkXS51cmwpXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gNDApIHsgLy8gZG93biBhcnJvd1xuICAgICAgdGhpcy5zZWxlY3ROZXh0KClcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSAzOCkgeyAvLyB1cCBhcnJvd1xuICAgICAgdGhpcy5zZWxlY3RQcmV2aW91cygpXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gOSkgeyAvLyB0YWIga2V5XG4gICAgICB0aGlzLnNlbGVjdE5leHRDYXRlZ29yeSgpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmtleUNvZGUgPT0gMzcpIHtcbiAgICAgIHRoaXMucHJvcHMucHJldldhbGxwYXBlcigpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB9IGVsc2UgaWYoZS5jdHJsS2V5ICYmIGUua2V5Q29kZSA9PSAzOSkge1xuICAgICAgdGhpcy5wcm9wcy5uZXh0V2FsbHBhcGVyKClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLmNvdW50ZXIgPSAwXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2ByZXN1bHRzICR7dGhpcy5zdGF0ZS50YWdzLmxlbmd0aCA/IFwiaGFzLXRhZ3NcIiA6IFwiXCJ9YH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlua3NcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHMtY2F0ZWdvcmllc1wiPlxuICAgICAgICAgICAge3RoaXMuY29udGVudEJ5Q2F0ZWdvcnkoKS5tYXAoY2F0ZWdvcnkgPT4gdGhpcy5yZW5kZXJDYXRlZ29yeShjYXRlZ29yeSkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTaWRlYmFyIG9uQ2hhbmdlPXsoKSA9PiB0aGlzLnVwZGF0ZSgpfSBzZWxlY3RlZD17dGhpcy5jb250ZW50KClbdGhpcy5zdGF0ZS5zZWxlY3RlZF19IG1lc3NhZ2VzPXt0aGlzLm1lc3NhZ2VzfSBvblVwZGF0ZVRvcFNpdGVzPXsoKSA9PiB0aGlzLm9uVXBkYXRlVG9wU2l0ZXMoKX0gdXBkYXRlRm49eygpID0+IHRoaXMudXBkYXRlKHRoaXMucHJvcHMucXVlcnkgfHwgXCJcIil9IC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhclwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFRhZ2JhciBxdWVyeT17dGhpcy5wcm9wcy5xdWVyeX0gb3BlblRhZz17dGhpcy5wcm9wcy5vcGVuVGFnfSBjb250ZW50PXt0aGlzLnN0YXRlLnRhZ3N9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDYXRlZ29yeShjKSB7XG4gICAgY29uc3Qgb3ZlcmZsb3cgPSBjLmNvbGxhcHNlZCAmJiB0aGlzLnN0YXRlLmNvbnRlbnRbdGhpcy5zdGF0ZS5zZWxlY3RlZF0uY2F0ZWdvcnkuc29ydCA8IGMuc29ydCAmJiB0aGlzLmNvdW50ZXIgPCBNQVhfSVRFTVMgPyBjLnJvd3Muc2xpY2UoMCwgTUFYX0lURU1TIC0gdGhpcy5jb3VudGVyKSA6IFtdXG4gICAgY29uc3QgY29sbGFwc2VkID0gYy5yb3dzLnNsaWNlKG92ZXJmbG93Lmxlbmd0aCwgTUFYX0lURU1TKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgY2F0ZWdvcnkgJHtjLmNvbGxhcHNlZCA/IFwiY29sbGFwc2VkXCIgOiBcIlwifWB9PlxuICAgICAgICB7dGhpcy5yZW5kZXJDYXRlZ29yeVRpdGxlKGMpfVxuICAgICAgICB7b3ZlcmZsb3cubGVuZ3RoID4gMCA/IDxkaXYgY2xhc3NOYW1lPSdjYXRlZ29yeS1yb3dzIG92ZXJmbG93Jz5cbiAgICAgICAgICB7b3ZlcmZsb3cubWFwKChyb3cpID0+IHRoaXMucmVuZGVyUm93KHJvdykpfVxuICAgICAgICA8L2Rpdj4gOiBudWxsfVxuICAgICAgICAge2NvbGxhcHNlZC5sZW5ndGggPiAwID8gPGRpdiBjbGFzc05hbWU9J2NhdGVnb3J5LXJvd3MnPlxuICAgICAgICAgICAge2NvbGxhcHNlZC5tYXAoKHJvdykgPT4gdGhpcy5yZW5kZXJSb3cocm93KSl9XG4gICAgICAgICA8L2Rpdj4gOiBudWxsfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2F0ZWdvcnlUaXRsZShjKSB7XG4gICAgaWYgKCFjLnRpdGxlKSByZXR1cm5cblxuICAgIGxldCB0aXRsZSA9IGMudGl0bGVcbiAgICBpZiAodHlwZW9mIHRpdGxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aXRsZSA9IGMudGl0bGUodGhpcy5wcm9wcy5xdWVyeSlcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICA8aDEgb25DbGljaz17KCkgPT4gdGhpcy5zZWxlY3QoYy5yb3dzWzBdLmFic0luZGV4KX0+XG4gICAgICAgICAgPEljb24gc3Ryb2tlPVwiM1wiIG5hbWU9XCJyaWdodENoZXZyb25cIiAvPlxuICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgPC9oMT5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclJvdyhyb3cpIHtcbiAgICB0aGlzLmNvdW50ZXIrK1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxVUkxJY29uIGNvbnRlbnQ9e3Jvd30gb25TZWxlY3Q9e3IgPT4gdGhpcy5zZWxlY3Qoci5pbmRleCl9IHNlbGVjdGVkPXt0aGlzLnN0YXRlLnNlbGVjdGVkID09IHJvdy5pbmRleH0gLz5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCBVUkxJY29uIGZyb20gXCIuL3VybC1pY29uXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICB0aGlzLnJlc3VsdHMgPSByZXN1bHRzXG4gICAgdGhpcy5zb3J0ID0gc29ydFxuICB9XG5cbiAgYWRkKHJvd3MpIHtcbiAgICB0aGlzLnJlc3VsdHMuYWRkUm93cyh0aGlzLCByb3dzKVxuICB9XG5cbiAgb25OZXdRdWVyeShxdWVyeSkge1xuICAgIHRoaXMubGF0ZXN0UXVlcnkgPSBxdWVyeVxuXG4gICAgaWYgKHRoaXMuc2hvdWxkQmVPcGVuKHF1ZXJ5KSkge1xuICAgICAgdGhpcy51cGRhdGUocXVlcnkpXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hJbnB1dCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZhbHVlOiAnJ1xuICAgIH0pXG5cbiAgICB0aGlzLl9vbkNsaWNrID0gdGhpcy5vbkNsaWNrLmJpbmQodGhpcylcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAocHJvcHMudmFsdWUgJiYgcHJvcHMudmFsdWUudHJpbSgpICE9PSB0aGlzLnN0YXRlLnZhbHVlLnRyaW0oKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHZhbHVlOiBwcm9wcy52YWx1ZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBvbkJsdXIoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmZvY3VzZWQpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c2VkOiBmYWxzZVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLm9uQmx1cigpXG4gIH1cblxuICBvbkZvY3VzKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmZvY3VzZWQpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c2VkOiB0cnVlXG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMub25Gb2N1cygpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5pbnB1dCkge1xuICAgICAgdGhpcy5pbnB1dC5mb2N1cygpXG4gICAgfVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgcmV0dXJuIG5leHRTdGF0ZS52YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uQ2xpY2spXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkNsaWNrKVxuICB9XG5cbiAgb25DbGljayhlKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudmFsdWUgPT09ICcnICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudC13cmFwcGVyIC5jb250ZW50JykuY29udGFpbnMoZS50YXJnZXQpICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2J1dHRvbicpKSB7XG4gICAgICB0aGlzLm9uQmx1cigpXG4gICAgfVxuICB9XG5cbiAgb25RdWVyeUNoYW5nZSh2YWx1ZSwga2V5Q29kZSwgZXZlbnQpIHtcbiAgICBpZiAodmFsdWUudHJpbSgpICE9PSBcIlwiKSB7XG4gICAgICB0aGlzLm9uRm9jdXMoKVxuICAgIH1cblxuICAgIGlmIChrZXlDb2RlID09PSAxMykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25QcmVzc0VudGVyKHZhbHVlKVxuICAgIH1cblxuICAgIGlmIChrZXlDb2RlID09PSAyNykge1xuICAgICAgcmV0dXJuIHRoaXMub25CbHVyKClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWUgfSlcblxuICAgIGlmICh0aGlzLnF1ZXJ5Q2hhbmdlVGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucXVlcnlDaGFuZ2VUaW1lcilcbiAgICAgIHRoaXMucXVlcnlDaGFuZ2VUaW1lciA9IDA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMub25RdWVyeUNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vblF1ZXJ5Q2hhbmdlKHZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWFyY2gtaW5wdXRcIj5cbiAgICAgICAge3RoaXMucmVuZGVySWNvbigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJJbnB1dCgpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySWNvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEljb24gbmFtZT1cInNlYXJjaFwiIG9uY2xpY2s9eygpID0+IHRoaXMuaW5wdXQuZm9jdXMoKX0gLz5cbiAgICApXG4gIH1cblxuICByZW5kZXJJbnB1dCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGlucHV0IHRhYmluZGV4PVwiMVwiXG4gICAgICAgIHJlZj17ZWwgPT4gdGhpcy5pbnB1dCA9IGVsfVxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIGNsYXNzTmFtZT1cImlucHV0XCJcbiAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggb3IgZW50ZXIgd2Vic2l0ZSBuYW1lLlwiXG4gICAgICAgIG9uRm9jdXM9e2UgPT4gdGhpcy5vbkZvY3VzKCl9XG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMub25RdWVyeUNoYW5nZShlLnRhcmdldC52YWx1ZSwgdW5kZWZpbmVkLCAnY2hhbmdlJyl9XG4gICAgICAgIG9uS2V5VXA9e2UgPT4gdGhpcy5vblF1ZXJ5Q2hhbmdlKGUudGFyZ2V0LnZhbHVlLCBlLmtleUNvZGUsICdrZXkgdXAnKX1cbiAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5vbkZvY3VzKCl9XG4gICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSAvPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImRlYm91bmNlLWZuXCJcbmltcG9ydCBDb250ZW50IGZyb20gXCIuL2NvbnRlbnRcIlxuaW1wb3J0IFNlYXJjaElucHV0IGZyb20gXCIuL3NlYXJjaC1pbnB1dFwiXG5pbXBvcnQgUmVzdWx0cyBmcm9tIFwiLi9yZXN1bHRzXCJcbmltcG9ydCBNZXNzYWdpbmcgZnJvbSBcIi4vbWVzc2FnaW5nXCJcbmltcG9ydCBHcmVldGluZyBmcm9tIFwiLi9ncmVldGluZ1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNZXNzYWdpbmcoKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpZDogMCxcbiAgICAgIHJvd3M6IHt9LFxuICAgICAgcm93c0F2YWlsYWJsZTogNSxcbiAgICAgIHF1ZXJ5OiAnJyxcbiAgICAgIGZvY3VzZWQ6IGZhbHNlXG4gICAgfSlcblxuICAgIHRoaXMuX29uUXVlcnlDaGFuZ2UgPSBkZWJvdW5jZSh0aGlzLm9uUXVlcnlDaGFuZ2UuYmluZCh0aGlzKSwgNTApXG4gIH1cblxuICBpZCgpIHtcbiAgICByZXR1cm4gKyt0aGlzLnN0YXRlLmlkXG4gIH1cblxuICBvbkZvY3VzKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9jdXNlZDogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBvbkJsdXIoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c2VkOiBmYWxzZVxuICAgIH0pXG4gIH1cblxuICBvblByZXNzRW50ZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMubmF2aWdhdGVUbyh0aGlzLnN0YXRlLnNlbGVjdGVkLnVybClcbiAgICB9XG4gIH1cblxuICBvblNlbGVjdChyb3cpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZCAmJiB0aGlzLnN0YXRlLnNlbGVjdGVkLmlkID09PSByb3cuaWQpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZDogcm93XG4gICAgfSlcbiAgfVxuXG4gIG9uUXVlcnlDaGFuZ2UocXVlcnkpIHtcbiAgICBxdWVyeSA9IHF1ZXJ5LnRyaW0oKVxuXG4gICAgaWYgKHF1ZXJ5ID09PSB0aGlzLnN0YXRlLnF1ZXJ5KSByZXR1cm5cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcm93czoge30sXG4gICAgICByb3dzQXZhaWxhYmxlOiA1LFxuICAgICAgc2VsZWN0ZWQ6IG51bGwsXG4gICAgICBpZDogMCxcbiAgICAgIHF1ZXJ5XG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENvbnRlbnQgd2FsbHBhcGVyPXt0aGlzLnByb3BzLndhbGxwYXBlcn0gZm9jdXNlZD17dGhpcy5zdGF0ZS5mb2N1c2VkfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50LWlubmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuZW5hYmxlR3JlZXRpbmcgPyA8R3JlZXRpbmcgbmFtZT17dGhpcy5zdGF0ZS51c2VybmFtZX0gbWVzc2FnZXM9e3RoaXMubWVzc2FnZXN9IC8+IDogbnVsbH1cbiAgICAgICAgICA8U2VhcmNoSW5wdXQgb25QcmVzc0VudGVyPXsoKSA9PiB0aGlzLm9uUHJlc3NFbnRlcigpfVxuICAgICAgICAgICAgb25RdWVyeUNoYW5nZT17dGhpcy5fb25RdWVyeUNoYW5nZX1cbiAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHRoaXMub25Gb2N1cygpfVxuICAgICAgICAgICAgb25CbHVyPXsoKSA9PiB0aGlzLm9uQmx1cigpfVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUucXVlcnl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFJlc3VsdHMgcmVjZW50Qm9va21hcmtzRmlyc3Q9e3RoaXMucHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3R9IG5leHRXYWxscGFwZXI9e3RoaXMucHJvcHMubmV4dFdhbGxwYXBlcn0gcHJldldhbGxwYXBlcj17dGhpcy5wcm9wcy5wcmV2V2FsbHBhcGVyfSBvcGVuVGFnPXt0YWcgPT4gdGhpcy5fb25RdWVyeUNoYW5nZSgndGFnOicgKyB0YWcpfSBmb2N1c2VkPXt0aGlzLnN0YXRlLmZvY3VzZWR9IHF1ZXJ5PXt0aGlzLnN0YXRlLnF1ZXJ5fSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhclwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvQ29udGVudD5cbiAgICApXG4gIH1cblxuICByZW5kZXJSZXN1bHRzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRzLXJvd3NcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIHNvcnRMaWtlcyhhLCBiKSB7XG4gIGlmIChhLmxpa2VkX2F0IDwgYi5saWtlZF9hdCkgcmV0dXJuIDFcbiAgaWYgKGEubGlrZWRfYXQgPiBiLmxpa2VkX2F0KSByZXR1cm4gLTFcbiAgcmV0dXJuIDBcbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5pbXBvcnQgc2VjdGlvbnMgZnJvbSAnLi4vY2hyb21lL3NldHRpbmdzLXNlY3Rpb25zJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR0aW5ncyBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICBzZWN0aW9ucy5mb3JFYWNoKHMgPT4gdGhpcy5sb2FkU2VjdGlvbihzKSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKSB7XG4gICAgc2VjdGlvbnMuZm9yRWFjaChzID0+IHRoaXMubG9hZFNlY3Rpb24ocykpXG4gIH1cblxuICBsb2FkU2VjdGlvbihzKSB7XG4gICAgdGhpcy5wcm9wcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ2dldC1zZXR0aW5ncy12YWx1ZScsIGtleTogcy5rZXkgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMub25FcnJvcihyZXNwLmVycm9yKVxuICAgICAgY29uc3QgdSA9IHt9XG4gICAgICB1W3Mua2V5XSA9IHJlc3AuY29udGVudC52YWx1ZVxuICAgICAgdGhpcy5zZXRTdGF0ZSh1KVxuICAgIH0pXG4gIH1cblxuICBvbkNoYW5nZSh2YWx1ZSwgb3B0aW9ucykge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdzZXQtc2V0dGluZ3MtdmFsdWUnLCBrZXk6IG9wdGlvbnMua2V5LCB2YWx1ZSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5vbkVycm9yKHJlc3AuZXJyb3IpXG5cbiAgICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBvbkVycm9yKGVycm9yKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlcnJvclxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbkVycm9yKSB7XG4gICAgICB0aGlzLnByb3BzLm9uRXJyb3IoZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YHNldHRpbmdzICR7dGhpcy5zdGF0ZS5vcGVuID8gXCJvcGVuXCIgOiBcIlwifWB9PlxuICAgICAgICA8SWNvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgb3BlbjogdHJ1ZSB9KX0gbmFtZT1cInNldHRpbmdzXCIgLz5cbiAgICAgICAge3RoaXMucmVuZGVyU2V0dGluZ3MoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNldHRpbmdzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cbiAgICAgICAge3RoaXMucmVuZGVyQ2xvc2VCdXR0b24oKX1cbiAgICAgICAgPGgxPlNldHRpbmdzPC9oMT5cbiAgICAgICAgPGgyPkdvdCBmZWVkYmFjayAvIHJlY29tbWVuZGF0aW9uID8gPGEgaHJlZj1cIm1haWx0bzphemVyQGdldGtvem1vcy5jb21cIj5mZWVkYmFjazwvYT4gYW55dGltZS48L2gyPlxuICAgICAgICB7dGhpcy5yZW5kZXJTZWN0aW9ucygpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvb3RlclwiPlxuICAgICAgICAgIDxidXR0b24gb25jbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG9wZW46IGZhbHNlIH0pfT5cbiAgICAgICAgICAgIERvbmVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZWN0aW9ucygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uc1wiPlxuICAgICAgICB7c2VjdGlvbnMubWFwKHMgPT4gdGhpcy5yZW5kZXJTZWN0aW9uKHMpKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNlY3Rpb24ob3B0aW9ucykge1xuICAgIGlmICh0aGlzLnByb3BzLnR5cGUgJiYgIW9wdGlvbnNbdGhpcy5wcm9wcy50eXBlXSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT17YHNldHRpbmcgJHtvcHRpb25zLmtleX1gfT5cbiAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImNoZWNrYm94XCIgaWQ9e29wdGlvbnMua2V5fSBuYW1lPXtvcHRpb25zLmtleX0gdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17dGhpcy5zdGF0ZVtvcHRpb25zLmtleV19IG9uQ2hhbmdlPXtlID0+IHRoaXMub25DaGFuZ2UoZS50YXJnZXQuY2hlY2tlZCwgb3B0aW9ucyl9IC8+XG4gICAgICAgIDxsYWJlbCB0aXRsZT17b3B0aW9ucy5kZXNjfSBodG1sRm9yPXtvcHRpb25zLmtleX0+e29wdGlvbnMudGl0bGV9PC9sYWJlbD5cbiAgICAgICAgPHA+e29wdGlvbnMuZGVzY308L3A+XG4gICAgICA8L3NlY3Rpb24+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2xvc2VCdXR0b24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxJY29uIHN0cm9rZT1cIjNcIiBuYW1lPVwiY2xvc2VcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgb3BlbjogZmFsc2UgfSl9IC8+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCB7IGNsZWFuIGFzIGNsZWFuVVJMIH0gZnJvbSBcInVybHNcIlxuaW1wb3J0IHJlbGF0aXZlRGF0ZSBmcm9tIFwicmVsYXRpdmUtZGF0ZVwiXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcbmltcG9ydCBVUkxJbWFnZSBmcm9tIFwiLi91cmwtaW1hZ2VcIlxuaW1wb3J0IHsgaGlkZSBhcyBoaWRlVG9wU2l0ZSB9IGZyb20gJy4vdG9wLXNpdGVzJ1xuaW1wb3J0IHsgZmluZEhvc3RuYW1lIH0gZnJvbSAnLi91cmwtaW1hZ2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGViYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKCFwcm9wcy5zZWxlY3RlZCkgcmV0dXJuXG4gICAgcHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtbGlrZScsIHVybDogcHJvcHMuc2VsZWN0ZWQudXJsIH0sIHJlc3AgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxpa2U6IHJlc3AuY29udGVudC5saWtlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVUb3BTaXRlKCkge1xuICAgIGhpZGVUb3BTaXRlKHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsKVxuICAgIHRoaXMucHJvcHMudXBkYXRlRm4oKVxuICB9XG5cbiAgdG9nZ2xlTGlrZSgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5saWtlKSB0aGlzLnVubGlrZSgpXG4gICAgZWxzZSB0aGlzLmxpa2UoKVxuICB9XG5cbiAgbGlrZSgpIHtcbiAgICB0aGlzLnByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnbGlrZScsIHVybDogdGhpcy5wcm9wcy5zZWxlY3RlZC51cmwgfSwgcmVzcCA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbGlrZTogcmVzcC5jb250ZW50Lmxpa2VcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHNldFRpbWVvdXQodGhpcy5wcm9wcy5vbkNoYW5nZSwgMTAwMClcbiAgfVxuXG4gIHVubGlrZSgpIHtcbiAgICB0aGlzLnByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAndW5saWtlJywgdXJsOiB0aGlzLnByb3BzLnNlbGVjdGVkLnVybCB9LCByZXNwID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsaWtlOiBudWxsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBzZXRUaW1lb3V0KHRoaXMucHJvcHMub25DaGFuZ2UsIDEwMDApXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnNlbGVjdGVkKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNpZGViYXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWFnZVwiPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImxpbmtcIiBocmVmPXt0aGlzLnByb3BzLnNlbGVjdGVkLnVybH0+XG4gICAgICAgICAgICA8VVJMSW1hZ2UgY29udGVudD17dGhpcy5wcm9wcy5zZWxlY3RlZH0gLz5cbiAgICAgICAgICAgIDxoMT57dGhpcy5wcm9wcy5zZWxlY3RlZC50aXRsZX08L2gxPlxuICAgICAgICAgICAgPGgyPntjbGVhblVSTCh0aGlzLnByb3BzLnNlbGVjdGVkLnVybCl9PC9oMj5cbiAgICAgICAgICA8L2E+XG4gICAgICAgICAge3RoaXMucmVuZGVyQnV0dG9ucygpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckJ1dHRvbnMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnV0dG9uc1wiPlxuICAgICAgICB7dGhpcy5yZW5kZXJMaWtlQnV0dG9uKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1lbnRCdXR0b24oKX1cbiAgICAgICAge3RoaXMucHJvcHMuc2VsZWN0ZWQudHlwZSA9PT0gJ3RvcCcgPyB0aGlzLnJlbmRlckRlbGV0ZVRvcFNpdGVCdXR0b24oKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJMaWtlQnV0dG9uKCkge1xuICAgIGNvbnN0IGFnbyA9IHRoaXMuc3RhdGUubGlrZSA/IHJlbGF0aXZlRGF0ZSh0aGlzLnN0YXRlLmxpa2UubGlrZWRBdCkgOiBcIlwiXG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLnN0YXRlLmxpa2UgPyBcIkRlbGV0ZSBJdCBGcm9tIFlvdXIgTGlrZXNcIiA6IFwiQWRkIEl0IFRvIFlvdXIgTGlrZXNcIlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgdGl0bGU9e3RpdGxlfSBjbGFzc05hbWU9e2BidXR0b24gbGlrZS1idXR0b24gJHt0aGlzLnN0YXRlLmxpa2U/IFwibGlrZWRcIiA6IFwiXCJ9YH0gb25DbGljaz17KCkgPT4gdGhpcy50b2dnbGVMaWtlKCl9PlxuICAgICAgICA8SWNvbiBuYW1lPVwiaGVhcnRcIiAvPlxuICAgICAgICB7dGhpcy5zdGF0ZS5saWtlID8gYExpa2VkICR7YWdvfWAgOiBcIkxpa2UgSXRcIn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbW1lbnRCdXR0b24oKSB7XG4gICAgY29uc3QgaG9zdG5hbWUgPSBmaW5kSG9zdG5hbWUodGhpcy5zdGF0ZS5saWtlLnVybClcbiAgICBjb25zdCBpc0hvbWVwYWdlID0gY2xlYW5VUkwodGhpcy5zdGF0ZS5saWtlLnVybCkuaW5kZXhPZignLycpID09PSAtMVxuXG4gICAgaWYgKCFpc0hvbWVwYWdlKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8YSB0aXRsZT17YENvbW1lbnRzIGFib3V0ICR7aG9zdG5hbWV9YH0gY2xhc3NOYW1lPXtgYnV0dG9uIGNvbW1lbnQtYnV0dG9uYH0gaHJlZj17YGh0dHBzOi8vZ2V0a296bW9zLmNvbS9zaXRlLyR7aG9zdG5hbWV9YH0+XG4gICAgICAgIDxJY29uIG5hbWU9XCJtZXNzYWdlXCIgLz5cbiAgICAgICAgQ29tbWVudHNcbiAgICAgIDwvYT5cbiAgICApXG4gIH1cblxuICByZW5kZXJEZWxldGVUb3BTaXRlQnV0dG9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHRpdGxlPVwiRGVsZXRlIEl0IEZyb20gRnJlcXVlbnRseSBWaXNpdGVkXCIgY2xhc3NOYW1lPVwiYnV0dG9uIGRlbGV0ZS1idXR0b25cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLmRlbGV0ZVRvcFNpdGUoKX0+XG4gICAgICAgIDxJY29uIG5hbWU9XCJ0cmFzaFwiIC8+XG4gICAgICAgIERlbGV0ZSBJdFxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhZ2JhciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnRlbnQoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNvbnRlbnQgfHwgIXRoaXMucHJvcHMuY29udGVudC5sZW5ndGgpIHJldHVybiBbXVxuXG4gICAgY29uc3QgY29weSA9IHRoaXMucHJvcHMuY29udGVudC5zbGljZSgpXG5cbiAgICBjb25zdCBvY2NyID0ge31cbiAgICBsZXQgaSA9IGNvcHkubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgb2Njcltjb3B5W2ldXSA9IG9jY3JbY29weVtpXV0gPyBvY2NyW2NvcHlbaV1dKzEgOiAxXG4gICAgfVxuXG4gICAgY29uc3QgdW5pcXVlcyA9IE9iamVjdC5rZXlzKG9jY3IpXG4gICAgdW5pcXVlcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBpZiAob2NjclthXSA8IG9jY3JbYl0pIHJldHVybiAxXG4gICAgICBpZiAob2NjclthXSA+IG9jY3JbYl0pIHJldHVybiAtMVxuICAgICAgcmV0dXJuIDBcbiAgICB9KVxuXG4gICAgcmV0dXJuIHVuaXF1ZXNcbiAgfVxuXG4gIG1heCgpIHtcbiAgICByZXR1cm4gMTBcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5jb250ZW50KClcbiAgICBpZiAoY29udGVudC5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGFnYmFyXCI+XG4gICAgICAgIDxJY29uIG5hbWU9XCJ0YWdcIiBzdHJva2U9XCIzXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZXJzb25hbC10YWdzXCI+XG4gICAgICAgICAge2NvbnRlbnQuc2xpY2UoMCwgdGhpcy5tYXgoKSkubWFwKHQgPT4gdGhpcy5yZW5kZXJUYWcodCkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRhZyhuYW1lKSB7XG4gICAgY29uc3QgdGl0bGUgPSBjYXBpdGFsaXplKG5hbWUpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGEgY2xhc3NOYW1lPVwidGFnIGJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub3BlblRhZyhuYW1lKX0gdGl0bGU9e2BPcGVuIFwiJHt0aXRsZX1cIiB0YWdgfT5cbiAgICAgICAge3RpdGxlfVxuICAgICAgPC9hPlxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBjYXBpdGFsaXplICh0aXRsZSkge1xuICByZXR1cm4gdGl0bGUuc3BsaXQoL1xccysvKS5tYXAodyA9PiB3LnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB3LnNsaWNlKDEpKS5qb2luKCcgJylcbn1cbiIsImltcG9ydCB0aXRsZUZyb21VUkwgZnJvbSBcInRpdGxlLWZyb20tdXJsXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWQodGl0bGUpIHtcbiAgY29uc3QgYWJzbGVuID0gdGl0bGUucmVwbGFjZSgvW15cXHddKy9nLCAnJykubGVuZ3RoXG4gIHJldHVybiBhYnNsZW4gPj0gMiAmJiAhL15odHRwXFx3PzpcXC9cXC8vLnRlc3QodGl0bGUpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUodGl0bGUpIHtcbiAgcmV0dXJuIHRpdGxlLnRyaW0oKS5yZXBsYWNlKC9eXFwoXFxkK1xcKS8sICcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVGcm9tVVJMKHVybCkge1xuICByZXR1cm4gdGl0bGVGcm9tVVJMKHVybClcbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IHsgY2xlYW4gfSBmcm9tICd1cmxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3BTaXRlcyBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLnRpdGxlID0gJ0ZyZXF1ZW50bHkgVmlzaXRlZCdcbiAgICB0aGlzLm5hbWUgPSAndG9wJ1xuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5Lmxlbmd0aCA8IDVcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFsbCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlckJ5UXVlcnkocXVlcnkpXG4gICAgfVxuICB9XG5cbiAgYWxsKCkge1xuICAgIGdldChyb3dzID0+IHRoaXMuYWRkKGFkZEtvem1vcyhyb3dzLnNsaWNlKDAsIDUpKSkpXG4gIH1cblxuICBmaWx0ZXJCeVF1ZXJ5KHF1ZXJ5KSB7XG4gICAgY29uc3QgcmVzdWx0ID0gW11cblxuICAgIGNocm9tZS50b3BTaXRlcy5nZXQodG9wU2l0ZXMgPT4ge1xuICAgICAgbGV0IGkgPSAtMVxuICAgICAgY29uc3QgbGVuID0gdG9wU2l0ZXMubGVuZ3RoXG4gICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgIGlmIChjbGVhbih0b3BTaXRlc1tpXS51cmwpLmluZGV4T2YocXVlcnkpID09PSAwIHx8IHRvcFNpdGVzW2ldLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeSkgPT09IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh0b3BTaXRlc1tpXSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFkZChyZXN1bHQpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRLb3ptb3MgKHJvd3MpIHtcbiAgbGV0IGkgPSByb3dzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKHJvd3NbaV0udXJsLmluZGV4T2YoJ2dldGtvem1vcy5jb20nKSA+IC0xKSB7XG4gICAgICByZXR1cm4gcm93c1xuICAgIH1cbiAgfVxuXG4gIHJvd3NbNF0gPSB7XG4gICAgdXJsOiAnaHR0cHM6Ly9nZXRrb3ptb3MuY29tJyxcbiAgICB0aXRsZTogJ0tvem1vcydcbiAgfVxuXG4gIHJldHVybiByb3dzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXQgKGNhbGxiYWNrKSB7XG4gIGNocm9tZS50b3BTaXRlcy5nZXQodG9wU2l0ZXMgPT4ge1xuICAgIGNhbGxiYWNrKGZpbHRlcih0b3BTaXRlcykpXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlICh1cmwpIHtcbiAgbGV0IGhpZGRlbiA9IGdldEhpZGRlblRvcFNpdGVzKClcbiAgaGlkZGVuW3VybF0gPSB0cnVlXG4gIHNldEhpZGRlblRvcFNpdGVzKGhpZGRlbilcbn1cblxuZnVuY3Rpb24gZ2V0SGlkZGVuVG9wU2l0ZXMgKCkge1xuICBsZXQgbGlzdCA9IHtcbiAgICAnaHR0cHM6Ly9nb29nbGUuY29tLyc6IHRydWUsXG4gICAgJ2h0dHA6Ly9nb29nbGUuY29tLyc6IHRydWVcbiAgfVxuXG4gIHRyeSB7XG4gICAgbGlzdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydoaWRkZW4tdG9wbGlzdCddKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBzZXRIaWRkZW5Ub3BTaXRlcyhsaXN0KVxuICB9XG5cbiAgcmV0dXJuIGxpc3Rcbn1cblxuZnVuY3Rpb24gc2V0SGlkZGVuVG9wU2l0ZXMobGlzdCkge1xuICBsb2NhbFN0b3JhZ2VbJ2hpZGRlbi10b3BsaXN0J10gPSBKU09OLnN0cmluZ2lmeShsaXN0KVxufVxuXG5mdW5jdGlvbiBmaWx0ZXIodG9wU2l0ZXMpIHtcbiAgY29uc3QgaGlkZSA9IGdldEhpZGRlblRvcFNpdGVzKClcbiAgcmV0dXJuIHRvcFNpdGVzLmZpbHRlcihyb3cgPT4gIWhpZGVbcm93LnVybF0pXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBpbWcgZnJvbSBcImltZ1wiXG5pbXBvcnQgeyBjbGVhbiBhcyBjbGVhblVSTCB9IGZyb20gXCJ1cmxzXCJcbmltcG9ydCAqIGFzIHRpdGxlcyBmcm9tIFwiLi90aXRsZXNcIlxuaW1wb3J0IFVSTEltYWdlIGZyb20gJy4vdXJsLWltYWdlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVUkxJY29uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmNvbnRlbnQudXJsICE9PSBuZXh0UHJvcHMuY29udGVudC51cmwgfHxcbiAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWQgIT09IG5leHRQcm9wcy5zZWxlY3RlZCB8fFxuICAgICAgdGhpcy5wcm9wcy50eXBlICE9PSBuZXh0UHJvcHMudHlwZVxuICB9XG5cbiAgc2VsZWN0KCkge1xuICAgIHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy5jb250ZW50KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBpZD17dGhpcy5wcm9wcy5jb250ZW50LmlkfSBjbGFzc05hbWU9e2B1cmxpY29uICR7dGhpcy5wcm9wcy5zZWxlY3RlZCA/IFwic2VsZWN0ZWRcIiA6IFwiXCJ9YH0gaHJlZj17dGhpcy51cmwoKX0gdGl0bGU9e2Ake3RoaXMudGl0bGUoKX0gLSAke2NsZWFuVVJMKHRoaXMucHJvcHMuY29udGVudC51cmwpfWB9IG9uTW91c2VNb3ZlPXsoKSA9PiB0aGlzLnNlbGVjdCgpfT5cbiAgICAgICAgPFVSTEltYWdlIGNvbnRlbnQ9e3RoaXMucHJvcHMuY29udGVudH0gaWNvbi1vbmx5IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICB7dGhpcy50aXRsZSgpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cmxcIj5cbiAgICAgICAgICB7dGhpcy5wcmV0dHlVUkwoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgIDwvYT5cbiAgICApXG4gIH1cblxuICB0aXRsZSgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jb250ZW50LnR5cGUgPT09ICdzZWFyY2gtcXVlcnknKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5jb250ZW50LnRpdGxlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC50eXBlID09PSAndXJsLXF1ZXJ5Jykge1xuICAgICAgcmV0dXJuIGBPcGVuICR7Y2xlYW5VUkwodGhpcy5wcm9wcy5jb250ZW50LnVybCl9YFxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNvbnRlbnQudGl0bGUgJiYgdGl0bGVzLmlzVmFsaWQodGhpcy5wcm9wcy5jb250ZW50LnRpdGxlKSkge1xuICAgICAgcmV0dXJuIHRpdGxlcy5ub3JtYWxpemUodGhpcy5wcm9wcy5jb250ZW50LnRpdGxlKVxuICAgIH1cblxuICAgIHJldHVybiB0aXRsZXMuZ2VuZXJhdGVGcm9tVVJMKHRoaXMucHJvcHMuY29udGVudC51cmwpXG4gIH1cblxuICB1cmwoKSB7XG4gICAgaWYgKC9eaHR0cHM/OlxcL1xcLy8udGVzdCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY29udGVudC51cmxcbiAgICB9XG5cbiAgICByZXR1cm4gJ2h0dHA6Ly8nICsgdGhpcy5wcm9wcy5jb250ZW50LnVybFxuICB9XG5cbiAgcHJldHR5VVJMKCkge1xuICAgIHJldHVybiBjbGVhblVSTCh0aGlzLnVybCgpKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBpbWcgZnJvbSAnaW1nJ1xuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5pbXBvcnQgcmFuZG9tQ29sb3IgZnJvbSBcInJhbmRvbS1jb2xvclwiXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcblxuZXhwb3J0IGNvbnN0IHBvcHVsYXJJY29ucyA9IHtcbiAgJ2ZhY2Vib29rLmNvbSc6ICdodHRwczovL3N0YXRpYy54eC5mYmNkbi5uZXQvcnNyYy5waHAvdjMveXgvci9ONEhfNTBLRnA4aS5wbmcnLFxuICAndHdpdHRlci5jb20nOiAnaHR0cHM6Ly9tYS0wLnR3aW1nLmNvbS90d2l0dGVyLWFzc2V0cy9yZXNwb25zaXZlLXdlYi93ZWIvbHRyL2ljb24taW9zLmE5Y2Q4ODViY2NiY2FmMmYucG5nJyxcbiAgJ3lvdXR1YmUuY29tJzogJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3l0cy9pbWcvZmF2aWNvbl85Ni12ZmxXOUVjMHcucG5nJyxcbiAgJ2FtYXpvbi5jb20nOiAnaHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9HLzAxL2FueXdoZXJlL2Ffc21pbGVfMTIweDEyMC5fQ0IzNjgyNDY1NzNfLnBuZycsXG4gICdnb29nbGUuY29tJzogJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2JyYW5kaW5nL3Byb2R1Y3RfaW9zLzJ4L2dzYV9pb3NfNjBkcC5wbmcnLFxuICAneWFob28uY29tJzogJ2h0dHBzOi8vd3d3LnlhaG9vLmNvbS9hcHBsZS10b3VjaC1pY29uLXByZWNvbXBvc2VkLnBuZycsXG4gICdyZWRkaXQuY29tJzogJ2h0dHBzOi8vd3d3LnJlZGRpdHN0YXRpYy5jb20vbXdlYjJ4L2Zhdmljb24vMTIweDEyMC5wbmcnLFxuICAnaW5zdGFncmFtLmNvbSc6ICdodHRwczovL3d3dy5pbnN0YWdyYW0uY29tL3N0YXRpYy9pbWFnZXMvaWNvL2FwcGxlLXRvdWNoLWljb24tMTIweDEyMC1wcmVjb21wb3NlZC5wbmcvMDA0NzA1YzkzNTNmLnBuZycsXG4gICdnZXRrb3ptb3MuY29tJzogJ2h0dHBzOi8vZ2V0a296bW9zLmNvbS9wdWJsaWMvbG9nb3Mva296bW9zLWhlYXJ0LWxvZ28tMTAwcHgucG5nJyxcbiAgJ2dpdGh1Yi5jb20nOiAnaHR0cHM6Ly9hc3NldHMtY2RuLmdpdGh1Yi5jb20vcGlubmVkLW9jdG9jYXQuc3ZnJyxcbiAgJ2dpc3QuZ2l0aHViLmNvbSc6ICdodHRwczovL2Fzc2V0cy1jZG4uZ2l0aHViLmNvbS9waW5uZWQtb2N0b2NhdC5zdmcnLFxuICAnbWFpbC5nb29nbGUuY29tJzogJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2ljb25zL3Byb2R1Y3QvZ29vZ2xlbWFpbC0xMjgucG5nJyxcbiAgJ3BheXBhbC5jb20nOiAnaHR0cHM6Ly93d3cucGF5cGFsb2JqZWN0cy5jb20vd2Vic3RhdGljL2ljb24vcHAxNDQucG5nJyxcbiAgJ2ltZGIuY29tJzogJ2h0dHA6Ly9pYS5tZWRpYS1pbWRiLmNvbS9pbWFnZXMvRy8wMS9pbWRiL2ltYWdlcy9kZXNrdG9wLWZhdmljb24tMjE2NTgwNjk3MC5fQ0I1MjI3MzY1NjFfLmljbycsXG4gICdlbi53aWtpcGVkaWEub3JnJzogJ2h0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy9zdGF0aWMvZmF2aWNvbi93aWtpcGVkaWEuaWNvJyxcbiAgJ3dpa2lwZWRpYS5vcmcnOiAnaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3N0YXRpYy9mYXZpY29uL3dpa2lwZWRpYS5pY28nLFxuICAnZXNwbi5jb20nOiAnaHR0cDovL2EuZXNwbmNkbi5jb20vZmF2aWNvbi5pY28nLFxuICAndHdpdGNoLnR2JzogJ2h0dHBzOi8vc3RhdGljLnR3aXRjaGNkbi5uZXQvYXNzZXRzL2Zhdmljb24tNzUyNzBmOWRmMmIwNzE3NGMyM2NlODQ0YTAzZDg0YWYuaWNvJyxcbiAgJ2Nubi5jb20nOiAnaHR0cDovL2Nkbi5jbm4uY29tL2Nubi8uZS9pbWcvMy4wL2dsb2JhbC9taXNjL2FwcGxlLXRvdWNoLWljb24ucG5nJyxcbiAgJ29mZmljZS5jb20nOiAnaHR0cHM6Ly9zZWFvZmZpY2Vob21lLm1zb2Nkbi5jb20vcy83MDQ3NDUyZS9JbWFnZXMvZmF2aWNvbl9tZXRyby5pY28nLFxuICAnYmFua29mYW1lcmljYS5jb20nOiAnaHR0cHM6Ly93d3cxLmJhYy1hc3NldHMuY29tL2hvbWVwYWdlL3NwYS1hc3NldHMvaW1hZ2VzL2Fzc2V0cy1pbWFnZXMtZ2xvYmFsLWZhdmljb24tZmF2aWNvbi1DU1gzODZiMzMyZC5pY28nLFxuICAnY2hhc2UuY29tJzogJ2h0dHBzOi8vd3d3LmNoYXNlLmNvbS9ldGMvZGVzaWducy9jaGFzZS11eC9mYXZpY29uLTE1Mi5wbmcnLFxuICAnbnl0aW1lcy5jb20nOiAnaHR0cHM6Ly9zdGF0aWMwMS5ueXQuY29tL2ltYWdlcy9pY29ucy9pb3MtaXBhZC0xNDR4MTQ0LnBuZycsXG4gICdhcHBsZS5jb20nOiAnaHR0cHM6Ly93d3cuYXBwbGUuY29tL2Zhdmljb24uaWNvJyxcbiAgJ3dlbGxzZmFyZ28uY29tJzogJ2h0dHBzOi8vd3d3LndlbGxzZmFyZ28uY29tL2Fzc2V0cy9pbWFnZXMvaWNvbnMvYXBwbGUtdG91Y2gtaWNvbi0xMjB4MTIwLnBuZycsXG4gICd5ZWxwLmNvbSc6ICdodHRwczovL3MzLW1lZGlhMi5mbC55ZWxwY2RuLmNvbS9hc3NldHMvc3J2MC95ZWxwX3N0eWxlZ3VpZGUvMTE4ZmY0NzVhMzQxL2Fzc2V0cy9pbWcvbG9nb3MvZmF2aWNvbi5pY28nLFxuICAnd29yZHByZXNzLmNvbSc6ICdodHRwOi8vczAud3AuY29tL2kvd2ViY2xpcC5wbmcnLFxuICAnZHJvcGJveC5jb20nOiAnaHR0cHM6Ly9jZmwuZHJvcGJveHN0YXRpYy5jb20vc3RhdGljL2ltYWdlcy9mYXZpY29uLXZmbFVlTGVlWS5pY28nLFxuICAnbWFpbC5zdXBlcmh1bWFuLmNvbSc6ICdodHRwczovL3N1cGVyaHVtYW4uY29tL2J1aWxkLzcxMjIyYmRjMTY5ZTU5MDZjMjgyNDdlZDViN2NmMGVkLnNoYXJlLWljb24ucG5nJyxcbiAgJ2F3cy5hbWF6b24uY29tJzogJ2h0dHBzOi8vYTAuYXdzc3RhdGljLmNvbS9saWJyYS1jc3MvaW1hZ2VzL3NpdGUvdG91Y2gtaWNvbi1pcGhvbmUtMTE0LXNtaWxlLnBuZycsXG4gICdjb25zb2xlLmF3cy5hbWF6b24uY29tJzogJ2h0dHBzOi8vYTAuYXdzc3RhdGljLmNvbS9saWJyYS1jc3MvaW1hZ2VzL3NpdGUvdG91Y2gtaWNvbi1pcGhvbmUtMTE0LXNtaWxlLnBuZycsXG4gICd1cy13ZXN0LTIuY29uc29sZS5hd3MuYW1hem9uLmNvbSc6ICdodHRwczovL2EwLmF3c3N0YXRpYy5jb20vbGlicmEtY3NzL2ltYWdlcy9zaXRlL3RvdWNoLWljb24taXBob25lLTExNC1zbWlsZS5wbmcnLFxuICAnc3RhY2tvdmVyZmxvdy5jb20nOiAnaHR0cHM6Ly9jZG4uc3N0YXRpYy5uZXQvU2l0ZXMvc3RhY2tvdmVyZmxvdy9pbWcvYXBwbGUtdG91Y2gtaWNvbi5wbmcnXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVSTEltYWdlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLl9yZWZyZXNoU291cmNlID0gZGVib3VuY2UodGhpcy5yZWZyZXNoU291cmNlLmJpbmQodGhpcykpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC51cmwgIT09IHByb3BzLmNvbnRlbnQudXJsKSB7XG4gICAgICB0aGlzLl9yZWZyZXNoU291cmNlKHByb3BzLmNvbnRlbnQpXG4gICAgfVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgaWYgKG5leHRQcm9wcy5jb250ZW50LnVybCAhPT0gdGhpcy5wcm9wcy5jb250ZW50LnVybCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobmV4dFN0YXRlLnNyYyAhPT0gdGhpcy5zdGF0ZS5zcmMpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG5leHRTdGF0ZS5sb2FkaW5nICE9PSB0aGlzLnN0YXRlLmxvYWRpbmcgfHwgbmV4dFN0YXRlLmVycm9yICE9PSB0aGlzLnN0YXRlLmVycm9yKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmICgoIW5leHRQcm9wcy5jb250ZW50LmltYWdlcyB8fCB0aGlzLnByb3BzLmNvbnRlbnQuaW1hZ2VzKSB8fCAobmV4dFByb3BzLmNvbnRlbnQuaW1hZ2VzIHx8ICF0aGlzLnByb3BzLmNvbnRlbnQuaW1hZ2VzKSB8fCAobmV4dFByb3BzLmNvbnRlbnQuaW1hZ2VzWzBdICE9PSB0aGlzLnByb3BzLmNvbnRlbnQuaW1hZ2VzWzBdKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLnJlZnJlc2hTb3VyY2UoKVxuICB9XG5cbiAgcmVmcmVzaFNvdXJjZShjb250ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb2xvcjogcmFuZG9tQ29sb3IoMTAwLCA1MClcbiAgICB9KVxuXG4gICAgdGhpcy5maW5kU291cmNlKGNvbnRlbnQpXG4gICAgdGhpcy5wcmVsb2FkKHRoaXMuc3RhdGUuc3JjKVxuICB9XG5cbiAgZmluZFNvdXJjZShjb250ZW50KSB7XG4gICAgY29udGVudCB8fCAoY29udGVudCA9IHRoaXMucHJvcHMuY29udGVudClcblxuICAgIGlmICghdGhpcy5wcm9wc1snaWNvbi1vbmx5J10gJiYgY29udGVudC5pbWFnZXMgJiYgY29udGVudC5pbWFnZXMubGVuZ3RoID4gMCAmJiBjb250ZW50LmltYWdlc1swXSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzcmM6IGNvbnRlbnQuaW1hZ2VzWzBdXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChjb250ZW50Lmljb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdHlwZTogJ2ljb24nLFxuICAgICAgICBzcmM6IGFic29sdXRlSWNvblVSTChjb250ZW50KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBob3N0bmFtZSA9IGZpbmRIb3N0bmFtZShjb250ZW50LnVybClcbiAgICBpZiAocG9wdWxhckljb25zW2hvc3RuYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0eXBlOiAncG9wdWxhci1pY29uJyxcbiAgICAgICAgc3JjOiBwb3B1bGFySWNvbnNbaG9zdG5hbWVdXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdHlwZTogJ2Zhdmljb24nLFxuICAgICAgc3JjOiAnaHR0cDovLycgKyBob3N0bmFtZSArICcvZmF2aWNvbi5pY28nXG4gICAgfSlcbiAgfVxuXG4gIHByZWxvYWQoc3JjKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubG9hZGluZyAmJiB0aGlzLnN0YXRlLmxvYWRpbmdGb3IgPT09IHRoaXMucHJvcHMuY29udGVudC51cmwpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBsb2FkaW5nRm9yOiB0aGlzLnByb3BzLmNvbnRlbnQudXJsLFxuICAgICAgbG9hZGluZ1NyYzogc3JjLFxuICAgICAgc3JjOiB0aGlzLmNhY2hlZEljb25VUkwoKVxuICAgIH0pXG5cbiAgICBpbWcoc3JjLCBlcnIgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUubG9hZGluZ1NyYyAhPT0gc3JjKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICBlcnJvcjogZXJyLFxuICAgICAgICAgIHNyYzogdGhpcy5jYWNoZWRJY29uVVJMKClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNyYzogc3JjLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGxcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5sb2FkaW5nIHx8IHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRpbmcoKVxuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7dGhpcy5zdGF0ZS5zcmN9KWBcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2B1cmwtaW1hZ2UgJHt0aGlzLnN0YXRlLnR5cGV9YH0gc3R5bGU9e3N0eWxlfT48L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJMb2FkaW5nKCkge1xuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnN0YXRlLmNvbG9yXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS1lcnJvcj17dGhpcy5zdGF0ZS5lcnJvcn0gZGF0YS10eXBlPXt0aGlzLnN0YXRlLnR5cGV9IGRhdGEtc3JjPXt0aGlzLnN0YXRlLnNyY30gY2xhc3NOYW1lPVwidXJsLWltYWdlIGdlbmVyYXRlZC1pbWFnZSBjZW50ZXJcIiBzdHlsZT17c3R5bGV9PlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICB7ZmluZEhvc3RuYW1lKHRoaXMucHJvcHMuY29udGVudC51cmwpLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCl9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNhY2hlZEljb25VUkwoKSB7XG4gICAgcmV0dXJuICdjaHJvbWU6Ly9mYXZpY29uL3NpemUvNzIvJyArIGZpbmRQcm90b2NvbCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKSArICc6Ly8nICsgZmluZEhvc3RuYW1lKHRoaXMucHJvcHMuY29udGVudC51cmwpXG4gIH1cblxufVxuXG5mdW5jdGlvbiBhYnNvbHV0ZUljb25VUkwgKGxpa2UpIHtcbiAgaWYgKC9eaHR0cHM/OlxcL1xcLy8udGVzdChsaWtlLmljb24pKSByZXR1cm4gbGlrZS5pY29uXG4gIHJldHVybiAnaHR0cDpcXC9cXC8nICsgam9pbihmaW5kSG9zdG5hbWUobGlrZS51cmwpLCBsaWtlLmljb24pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSG9zdG5hbWUodXJsKSB7XG4gIHJldHVybiB1cmwucmVwbGFjZSgvXlxcdys6XFwvXFwvLywgJycpLnNwbGl0KCcvJylbMF0ucmVwbGFjZSgvXnd3d1xcLi8sICcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFByb3RvY29sKHVybCkge1xuICBpZiAoIS9eaHR0cHM/OlxcL1xcLy8udGVzdCh1cmwpKSByZXR1cm4gJ2h0dHAnXG4gIHJldHVybiB1cmwuc3BsaXQoJzovLycpWzBdXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCB3YWxscGFwZXJzIGZyb20gJy4vd2FsbHBhcGVycydcbmNvbnN0IE9ORV9EQVkgPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGxwYXBlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHNlbGVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLnNyYyh0aGlzLnRvZGF5KCkgICsgKHRoaXMucHJvcHMuaW5kZXggfHwgMCkpXG4gIH1cblxuICB0b2RheSgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMClcbiAgICBjb25zdCBkaWZmID0gKG5vdyAtIHN0YXJ0KSArICgoc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIG5vdy5nZXRUaW1lem9uZU9mZnNldCgpKSAqIDYwICogMTAwMClcbiAgICByZXR1cm4gTWF0aC5mbG9vcihkaWZmIC8gT05FX0RBWSlcbiAgfVxuXG4gIHNyYyhpbmRleCkge1xuICAgIHJldHVybiB3YWxscGFwZXJzW2luZGV4ICUgd2FsbHBhcGVycy5sZW5ndGhdXG4gIH1cblxuICB3aWR0aCgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGhcbiAgfVxuXG4gIHVybChzcmMpIHtcbiAgICByZXR1cm4gc3JjLnVybCArICc/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz0nICsgdGhpcy53aWR0aCgpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc3JjID0gdGhpcy5zZWxlY3RlZCgpXG5cbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke3RoaXMudXJsKHNyYyl9KWBcbiAgICB9XG5cbiAgICBpZiAoc3JjLnBvc2l0aW9uKSB7XG4gICAgICBzdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBzcmMucG9zaXRpb25cbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YWxscGFwZXJcIiBzdHlsZT17c3R5bGV9PjwvZGl2PlxuICAgIClcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NDQ0NjQ2NjYxNjgtNDlkNjMzYjg2Nzk3XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDUwODQ5NjA4ODgwLTZmNzg3NTQyYzg4YVwiIH0sXG4gIHsgXCJwb3NpdGlvblwiOiBcInRvcCBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQyOTUxNjM4NzQ1OS05ODkxYjdiOTZjNzhcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0Njk4NTQ1MjMwODYtY2MwMmZlNWQ4ODAwXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDg4NzI0MDM0OTU4LTBmYWFkODhjZjY5ZlwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQzMDY1MTcxNzUwNC1lYmI5ZTNlNjc5NWVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NDE4MDIyNTk4NzgtYTEzZjczMmNlNDEwXCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6IFwiYm90dG9tIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk0MjAwNDgzMDM1LWRiN2JjNmFhNTczOVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1OTI1ODM1MDg3OS0zNDg4NjMxOWEzYzlcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDcwOTg5MjYzMzEtOGQzMjRiMTM5ZDE1XCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6IFwidG9wIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk0MzAxOTUwNjI0LTJjNTRjYzk4MjZjNVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ4MDQ5OTQ4NDI2OC1hODVhMjQxNGRhODFcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0ODMxMTY1MzE1MjItNGM0ZTUyNWY1MDRlXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDc5MDMwMTYwMTgwLWIxODYwOTUxZDY5NlwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxMDM1MzYyMjc1OC02MmUzYjYzYjVmYjVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDE0NDY2OTA4NTItZGE1NWRmN2JmZTA3XCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6IFwidG9wIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTAxODYyMTY5Mjg2LTUxOGMyOTFlM2VlZFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ2OTQ3NDk2ODAyOC01NjYyM2YwMmU0MmVcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJ0b3AgY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzkwMzAxNjAxODAtYjE4NjA5NTFkNjk2XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDMxODg3NzczMDQyLTgwM2VkNTJiZWQyNlwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwMDUxNDk2NjkwNi1mZTI0NWVlYTkzNDRcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJib3R0b20gY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NjU0MDExODA0ODktY2ViNWEzNGQ4YTYzXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA1Mjk5OTE2MTM3LWI2OTc5M2E2NjkwN1wiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNDQ2MTE1NDAwNS0zMWI0MzVlNjg3ZWRcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDQ3NDAxOTEwNDUtNjNlMTUyNTFlNzUwXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDMxNzk0MDYyMjMyLTJhOTlhNTQzMWM2Y1wiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNDkwODQxNTAyNS1iN2MyNTYwOTQ2OTNcIiB9LFxuICB7IFwicG9zaXRpb25cIjpcImJvdHRvbSBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwMTk2MzQyMjc2Mi0zZDg5YmQ5ODk1NjhcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzAwNzE0NTk2MDQtM2I1ZWMzYTdmZTA1XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk5MjQwNzEzNjc3LTJjN2E0ZjY5MjA0NFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ5MDQ2NDM0ODE2Ni04YjhiYmQ5ZjFlMmVcIiB9LFxuICB7IFwicG9zaXRpb25cIjpcInRvcCBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1NTMyNTUyODA1NS1hZDgxNWFmZWNlYmVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzgwMzMzOTQxNTEtYzkzMWQ1YTRiZGQ2XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDQ5MDM0NDQ2ODUzLTY2Yzg2MTQ0YjBhZFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNTA1MzI2MjY5MS02MjQwNjNmOTRiNjVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9jMi5zdGF0aWNmbGlja3IuY29tLzQvMzkxMy8xNDk0NTcwMjczNl85ZDI4MzA0NGE3X2guanBnXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vYzIuc3RhdGljZmxpY2tyLmNvbS80LzM4OTYvMTQyMTUzODMwOTdfYmQwNzM0MmU4ZV9oLmpwZ1wiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2MyLnN0YXRpY2ZsaWNrci5jb20vNi81MDM1LzE0MTAzMjY4MDI2XzI1ZWQ5NmY4MTFfby5qcGdcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9jMS5zdGF0aWNmbGlja3IuY29tLzMvMjgyNS8xMzQ2NDkzMTc3NF81ZWE5NjYwOGFhX2guanBnXCIgfVxuXVxuIiwibW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcblxuZnVuY3Rpb24gZGVib3VuY2UgKGZuLCB3YWl0KSB7XG4gIHZhciB0aW1lcjtcbiAgdmFyIGFyZ3M7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgIHdhaXQgPSAyNTA7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aW1lciAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICB0aW1lciA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH07XG59XG4iLCJcbi8qKlxuICogRXNjYXBlIHJlZ2V4cCBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKC8oWy4qKz89XiE6JHt9KCl8W1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gaW1nO1xuXG5mdW5jdGlvbiBpbWcgKHNyYywgb3B0LCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0XG4gICAgb3B0ID0gbnVsbFxuICB9XG5cblxuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgdmFyIGxvY2tlZDtcblxuICBlbC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGxvY2tlZCkgcmV0dXJuO1xuICAgIGxvY2tlZCA9IHRydWU7XG5cbiAgICBjYWxsYmFjayAmJiBjYWxsYmFjayh1bmRlZmluZWQsIGVsKTtcbiAgfTtcblxuICBlbC5vbmVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChsb2NrZWQpIHJldHVybjtcbiAgICBsb2NrZWQgPSB0cnVlO1xuXG4gICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobmV3IEVycm9yKCdVbmFibGUgdG8gbG9hZCBcIicgKyBzcmMgKyAnXCInKSwgZWwpO1xuICB9O1xuICBcbiAgaWYgKG9wdCAmJiBvcHQuY3Jvc3NPcmlnaW4pXG4gICAgZWwuY3Jvc3NPcmlnaW4gPSBvcHQuY3Jvc3NPcmlnaW47XG5cbiAgZWwuc3JjID0gc3JjO1xuXG4gIHJldHVybiBlbDtcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiIWZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBmdW5jdGlvbiBWTm9kZSgpIHt9XG4gICAgZnVuY3Rpb24gaChub2RlTmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgbGFzdFNpbXBsZSwgY2hpbGQsIHNpbXBsZSwgaSwgY2hpbGRyZW4gPSBFTVBUWV9DSElMRFJFTjtcbiAgICAgICAgZm9yIChpID0gYXJndW1lbnRzLmxlbmd0aDsgaS0tID4gMjsgKSBzdGFjay5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzICYmIG51bGwgIT0gYXR0cmlidXRlcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgaWYgKCFzdGFjay5sZW5ndGgpIHN0YWNrLnB1c2goYXR0cmlidXRlcy5jaGlsZHJlbik7XG4gICAgICAgICAgICBkZWxldGUgYXR0cmlidXRlcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSBpZiAoKGNoaWxkID0gc3RhY2sucG9wKCkpICYmIHZvaWQgMCAhPT0gY2hpbGQucG9wKSBmb3IgKGkgPSBjaGlsZC5sZW5ndGg7IGktLTsgKSBzdGFjay5wdXNoKGNoaWxkW2ldKTsgZWxzZSB7XG4gICAgICAgICAgICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiBjaGlsZCkgY2hpbGQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHNpbXBsZSA9ICdmdW5jdGlvbicgIT0gdHlwZW9mIG5vZGVOYW1lKSBpZiAobnVsbCA9PSBjaGlsZCkgY2hpbGQgPSAnJzsgZWxzZSBpZiAoJ251bWJlcicgPT0gdHlwZW9mIGNoaWxkKSBjaGlsZCA9IFN0cmluZyhjaGlsZCk7IGVsc2UgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBjaGlsZCkgc2ltcGxlID0gITE7XG4gICAgICAgICAgICBpZiAoc2ltcGxlICYmIGxhc3RTaW1wbGUpIGNoaWxkcmVuW2NoaWxkcmVuLmxlbmd0aCAtIDFdICs9IGNoaWxkOyBlbHNlIGlmIChjaGlsZHJlbiA9PT0gRU1QVFlfQ0hJTERSRU4pIGNoaWxkcmVuID0gWyBjaGlsZCBdOyBlbHNlIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgbGFzdFNpbXBsZSA9IHNpbXBsZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcCA9IG5ldyBWTm9kZSgpO1xuICAgICAgICBwLm5vZGVOYW1lID0gbm9kZU5hbWU7XG4gICAgICAgIHAuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgcC5hdHRyaWJ1dGVzID0gbnVsbCA9PSBhdHRyaWJ1dGVzID8gdm9pZCAwIDogYXR0cmlidXRlcztcbiAgICAgICAgcC5rZXkgPSBudWxsID09IGF0dHJpYnV0ZXMgPyB2b2lkIDAgOiBhdHRyaWJ1dGVzLmtleTtcbiAgICAgICAgaWYgKHZvaWQgMCAhPT0gb3B0aW9ucy52bm9kZSkgb3B0aW9ucy52bm9kZShwKTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV4dGVuZChvYmosIHByb3BzKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gcHJvcHMpIG9ialtpXSA9IHByb3BzW2ldO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbG9uZUVsZW1lbnQodm5vZGUsIHByb3BzKSB7XG4gICAgICAgIHJldHVybiBoKHZub2RlLm5vZGVOYW1lLCBleHRlbmQoZXh0ZW5kKHt9LCB2bm9kZS5hdHRyaWJ1dGVzKSwgcHJvcHMpLCBhcmd1bWVudHMubGVuZ3RoID4gMiA/IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IHZub2RlLmNoaWxkcmVuKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX19kICYmIChjb21wb25lbnQuX19kID0gITApICYmIDEgPT0gaXRlbXMucHVzaChjb21wb25lbnQpKSAob3B0aW9ucy5kZWJvdW5jZVJlbmRlcmluZyB8fCBkZWZlcikocmVyZW5kZXIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXJlbmRlcigpIHtcbiAgICAgICAgdmFyIHAsIGxpc3QgPSBpdGVtcztcbiAgICAgICAgaXRlbXMgPSBbXTtcbiAgICAgICAgd2hpbGUgKHAgPSBsaXN0LnBvcCgpKSBpZiAocC5fX2QpIHJlbmRlckNvbXBvbmVudChwKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNTYW1lTm9kZVR5cGUobm9kZSwgdm5vZGUsIGh5ZHJhdGluZykge1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlIHx8ICdudW1iZXInID09IHR5cGVvZiB2bm9kZSkgcmV0dXJuIHZvaWQgMCAhPT0gbm9kZS5zcGxpdFRleHQ7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUubm9kZU5hbWUpIHJldHVybiAhbm9kZS5fY29tcG9uZW50Q29uc3RydWN0b3IgJiYgaXNOYW1lZE5vZGUobm9kZSwgdm5vZGUubm9kZU5hbWUpOyBlbHNlIHJldHVybiBoeWRyYXRpbmcgfHwgbm9kZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc05hbWVkTm9kZShub2RlLCBub2RlTmFtZSkge1xuICAgICAgICByZXR1cm4gbm9kZS5fX24gPT09IG5vZGVOYW1lIHx8IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0Tm9kZVByb3BzKHZub2RlKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyk7XG4gICAgICAgIHByb3BzLmNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG4gICAgICAgIHZhciBkZWZhdWx0UHJvcHMgPSB2bm9kZS5ub2RlTmFtZS5kZWZhdWx0UHJvcHM7XG4gICAgICAgIGlmICh2b2lkIDAgIT09IGRlZmF1bHRQcm9wcykgZm9yICh2YXIgaSBpbiBkZWZhdWx0UHJvcHMpIGlmICh2b2lkIDAgPT09IHByb3BzW2ldKSBwcm9wc1tpXSA9IGRlZmF1bHRQcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVOb2RlKG5vZGVOYW1lLCBpc1N2Zykge1xuICAgICAgICB2YXIgbm9kZSA9IGlzU3ZnID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIG5vZGVOYW1lKSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuICAgICAgICBub2RlLl9fbiA9IG5vZGVOYW1lO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlKSB7XG4gICAgICAgIHZhciBwYXJlbnROb2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocGFyZW50Tm9kZSkgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0QWNjZXNzb3Iobm9kZSwgbmFtZSwgb2xkLCB2YWx1ZSwgaXNTdmcpIHtcbiAgICAgICAgaWYgKCdjbGFzc05hbWUnID09PSBuYW1lKSBuYW1lID0gJ2NsYXNzJztcbiAgICAgICAgaWYgKCdrZXknID09PSBuYW1lKSA7IGVsc2UgaWYgKCdyZWYnID09PSBuYW1lKSB7XG4gICAgICAgICAgICBpZiAob2xkKSBvbGQobnVsbCk7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHZhbHVlKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKCdjbGFzcycgPT09IG5hbWUgJiYgIWlzU3ZnKSBub2RlLmNsYXNzTmFtZSA9IHZhbHVlIHx8ICcnOyBlbHNlIGlmICgnc3R5bGUnID09PSBuYW1lKSB7XG4gICAgICAgICAgICBpZiAoIXZhbHVlIHx8ICdzdHJpbmcnID09IHR5cGVvZiB2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2Ygb2xkKSBub2RlLnN0eWxlLmNzc1RleHQgPSB2YWx1ZSB8fCAnJztcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiAnb2JqZWN0JyA9PSB0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIG9sZCkgZm9yICh2YXIgaSBpbiBvbGQpIGlmICghKGkgaW4gdmFsdWUpKSBub2RlLnN0eWxlW2ldID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkgbm9kZS5zdHlsZVtpXSA9ICdudW1iZXInID09IHR5cGVvZiB2YWx1ZVtpXSAmJiAhMSA9PT0gSVNfTk9OX0RJTUVOU0lPTkFMLnRlc3QoaSkgPyB2YWx1ZVtpXSArICdweCcgOiB2YWx1ZVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgnZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwnID09PSBuYW1lKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIG5vZGUuaW5uZXJIVE1MID0gdmFsdWUuX19odG1sIHx8ICcnO1xuICAgICAgICB9IGVsc2UgaWYgKCdvJyA9PSBuYW1lWzBdICYmICduJyA9PSBuYW1lWzFdKSB7XG4gICAgICAgICAgICB2YXIgdXNlQ2FwdHVyZSA9IG5hbWUgIT09IChuYW1lID0gbmFtZS5yZXBsYWNlKC9DYXB0dXJlJC8sICcnKSk7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpLnN1YnN0cmluZygyKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghb2xkKSBub2RlLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZXZlbnRQcm94eSwgdXNlQ2FwdHVyZSk7XG4gICAgICAgICAgICB9IGVsc2Ugbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgKG5vZGUuX19sIHx8IChub2RlLl9fbCA9IHt9KSlbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmICgnbGlzdCcgIT09IG5hbWUgJiYgJ3R5cGUnICE9PSBuYW1lICYmICFpc1N2ZyAmJiBuYW1lIGluIG5vZGUpIHtcbiAgICAgICAgICAgIHNldFByb3BlcnR5KG5vZGUsIG5hbWUsIG51bGwgPT0gdmFsdWUgPyAnJyA6IHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChudWxsID09IHZhbHVlIHx8ICExID09PSB2YWx1ZSkgbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbnMgPSBpc1N2ZyAmJiBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvXnhsaW5rXFw6Py8sICcnKSk7XG4gICAgICAgICAgICBpZiAobnVsbCA9PSB2YWx1ZSB8fCAhMSA9PT0gdmFsdWUpIGlmIChucykgbm9kZS5yZW1vdmVBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsIG5hbWUudG9Mb3dlckNhc2UoKSk7IGVsc2Ugbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7IGVsc2UgaWYgKCdmdW5jdGlvbicgIT0gdHlwZW9mIHZhbHVlKSBpZiAobnMpIG5vZGUuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBuYW1lLnRvTG93ZXJDYXNlKCksIHZhbHVlKTsgZWxzZSBub2RlLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0UHJvcGVydHkobm9kZSwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG5vZGVbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gICAgZnVuY3Rpb24gZXZlbnRQcm94eShlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fbFtlLnR5cGVdKG9wdGlvbnMuZXZlbnQgJiYgb3B0aW9ucy5ldmVudChlKSB8fCBlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmx1c2hNb3VudHMoKSB7XG4gICAgICAgIHZhciBjO1xuICAgICAgICB3aGlsZSAoYyA9IG1vdW50cy5wb3AoKSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWZ0ZXJNb3VudCkgb3B0aW9ucy5hZnRlck1vdW50KGMpO1xuICAgICAgICAgICAgaWYgKGMuY29tcG9uZW50RGlkTW91bnQpIGMuY29tcG9uZW50RGlkTW91bnQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBwYXJlbnQsIGNvbXBvbmVudFJvb3QpIHtcbiAgICAgICAgaWYgKCFkaWZmTGV2ZWwrKykge1xuICAgICAgICAgICAgaXNTdmdNb2RlID0gbnVsbCAhPSBwYXJlbnQgJiYgdm9pZCAwICE9PSBwYXJlbnQub3duZXJTVkdFbGVtZW50O1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gbnVsbCAhPSBkb20gJiYgISgnX19wcmVhY3RhdHRyXycgaW4gZG9tKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmV0ID0gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpO1xuICAgICAgICBpZiAocGFyZW50ICYmIHJldC5wYXJlbnROb2RlICE9PSBwYXJlbnQpIHBhcmVudC5hcHBlbmRDaGlsZChyZXQpO1xuICAgICAgICBpZiAoIS0tZGlmZkxldmVsKSB7XG4gICAgICAgICAgICBoeWRyYXRpbmcgPSAhMTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50Um9vdCkgZmx1c2hNb3VudHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgY29tcG9uZW50Um9vdCkge1xuICAgICAgICB2YXIgb3V0ID0gZG9tLCBwcmV2U3ZnTW9kZSA9IGlzU3ZnTW9kZTtcbiAgICAgICAgaWYgKG51bGwgPT0gdm5vZGUgfHwgJ2Jvb2xlYW4nID09IHR5cGVvZiB2bm9kZSkgdm5vZGUgPSAnJztcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHtcbiAgICAgICAgICAgIGlmIChkb20gJiYgdm9pZCAwICE9PSBkb20uc3BsaXRUZXh0ICYmIGRvbS5wYXJlbnROb2RlICYmICghZG9tLl9jb21wb25lbnQgfHwgY29tcG9uZW50Um9vdCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLm5vZGVWYWx1ZSAhPSB2bm9kZSkgZG9tLm5vZGVWYWx1ZSA9IHZub2RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2bm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tLnBhcmVudE5vZGUpIGRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChvdXQsIGRvbSk7XG4gICAgICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGRvbSwgITApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dC5fX3ByZWFjdGF0dHJfID0gITA7XG4gICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICB9XG4gICAgICAgIHZhciB2bm9kZU5hbWUgPSB2bm9kZS5ub2RlTmFtZTtcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHZub2RlTmFtZSkgcmV0dXJuIGJ1aWxkQ29tcG9uZW50RnJvbVZOb2RlKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgaXNTdmdNb2RlID0gJ3N2ZycgPT09IHZub2RlTmFtZSA/ICEwIDogJ2ZvcmVpZ25PYmplY3QnID09PSB2bm9kZU5hbWUgPyAhMSA6IGlzU3ZnTW9kZTtcbiAgICAgICAgdm5vZGVOYW1lID0gU3RyaW5nKHZub2RlTmFtZSk7XG4gICAgICAgIGlmICghZG9tIHx8ICFpc05hbWVkTm9kZShkb20sIHZub2RlTmFtZSkpIHtcbiAgICAgICAgICAgIG91dCA9IGNyZWF0ZU5vZGUodm5vZGVOYW1lLCBpc1N2Z01vZGUpO1xuICAgICAgICAgICAgaWYgKGRvbSkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChkb20uZmlyc3RDaGlsZCkgb3V0LmFwcGVuZENoaWxkKGRvbS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLnBhcmVudE5vZGUpIGRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChvdXQsIGRvbSk7XG4gICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoZG9tLCAhMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZjID0gb3V0LmZpcnN0Q2hpbGQsIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8sIHZjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAobnVsbCA9PSBwcm9wcykge1xuICAgICAgICAgICAgcHJvcHMgPSBvdXQuX19wcmVhY3RhdHRyXyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgYSA9IG91dC5hdHRyaWJ1dGVzLCBpID0gYS5sZW5ndGg7IGktLTsgKSBwcm9wc1thW2ldLm5hbWVdID0gYVtpXS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWh5ZHJhdGluZyAmJiB2Y2hpbGRyZW4gJiYgMSA9PT0gdmNoaWxkcmVuLmxlbmd0aCAmJiAnc3RyaW5nJyA9PSB0eXBlb2YgdmNoaWxkcmVuWzBdICYmIG51bGwgIT0gZmMgJiYgdm9pZCAwICE9PSBmYy5zcGxpdFRleHQgJiYgbnVsbCA9PSBmYy5uZXh0U2libGluZykge1xuICAgICAgICAgICAgaWYgKGZjLm5vZGVWYWx1ZSAhPSB2Y2hpbGRyZW5bMF0pIGZjLm5vZGVWYWx1ZSA9IHZjaGlsZHJlblswXTtcbiAgICAgICAgfSBlbHNlIGlmICh2Y2hpbGRyZW4gJiYgdmNoaWxkcmVuLmxlbmd0aCB8fCBudWxsICE9IGZjKSBpbm5lckRpZmZOb2RlKG91dCwgdmNoaWxkcmVuLCBjb250ZXh0LCBtb3VudEFsbCwgaHlkcmF0aW5nIHx8IG51bGwgIT0gcHJvcHMuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwpO1xuICAgICAgICBkaWZmQXR0cmlidXRlcyhvdXQsIHZub2RlLmF0dHJpYnV0ZXMsIHByb3BzKTtcbiAgICAgICAgaXNTdmdNb2RlID0gcHJldlN2Z01vZGU7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlubmVyRGlmZk5vZGUoZG9tLCB2Y2hpbGRyZW4sIGNvbnRleHQsIG1vdW50QWxsLCBpc0h5ZHJhdGluZykge1xuICAgICAgICB2YXIgaiwgYywgZiwgdmNoaWxkLCBjaGlsZCwgb3JpZ2luYWxDaGlsZHJlbiA9IGRvbS5jaGlsZE5vZGVzLCBjaGlsZHJlbiA9IFtdLCBrZXllZCA9IHt9LCBrZXllZExlbiA9IDAsIG1pbiA9IDAsIGxlbiA9IG9yaWdpbmFsQ2hpbGRyZW4ubGVuZ3RoLCBjaGlsZHJlbkxlbiA9IDAsIHZsZW4gPSB2Y2hpbGRyZW4gPyB2Y2hpbGRyZW4ubGVuZ3RoIDogMDtcbiAgICAgICAgaWYgKDAgIT09IGxlbikgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIF9jaGlsZCA9IG9yaWdpbmFsQ2hpbGRyZW5baV0sIHByb3BzID0gX2NoaWxkLl9fcHJlYWN0YXR0cl8sIGtleSA9IHZsZW4gJiYgcHJvcHMgPyBfY2hpbGQuX2NvbXBvbmVudCA/IF9jaGlsZC5fY29tcG9uZW50Ll9fayA6IHByb3BzLmtleSA6IG51bGw7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBrZXkpIHtcbiAgICAgICAgICAgICAgICBrZXllZExlbisrO1xuICAgICAgICAgICAgICAgIGtleWVkW2tleV0gPSBfY2hpbGQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BzIHx8ICh2b2lkIDAgIT09IF9jaGlsZC5zcGxpdFRleHQgPyBpc0h5ZHJhdGluZyA/IF9jaGlsZC5ub2RlVmFsdWUudHJpbSgpIDogITAgOiBpc0h5ZHJhdGluZykpIGNoaWxkcmVuW2NoaWxkcmVuTGVuKytdID0gX2NoaWxkO1xuICAgICAgICB9XG4gICAgICAgIGlmICgwICE9PSB2bGVuKSBmb3IgKHZhciBpID0gMDsgaSA8IHZsZW47IGkrKykge1xuICAgICAgICAgICAgdmNoaWxkID0gdmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgY2hpbGQgPSBudWxsO1xuICAgICAgICAgICAgdmFyIGtleSA9IHZjaGlsZC5rZXk7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ZWRMZW4gJiYgdm9pZCAwICE9PSBrZXllZFtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0ga2V5ZWRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAga2V5ZWRba2V5XSA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgICAga2V5ZWRMZW4tLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFjaGlsZCAmJiBtaW4gPCBjaGlsZHJlbkxlbikgZm9yIChqID0gbWluOyBqIDwgY2hpbGRyZW5MZW47IGorKykgaWYgKHZvaWQgMCAhPT0gY2hpbGRyZW5bal0gJiYgaXNTYW1lTm9kZVR5cGUoYyA9IGNoaWxkcmVuW2pdLCB2Y2hpbGQsIGlzSHlkcmF0aW5nKSkge1xuICAgICAgICAgICAgICAgIGNoaWxkID0gYztcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltqXSA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gY2hpbGRyZW5MZW4gLSAxKSBjaGlsZHJlbkxlbi0tO1xuICAgICAgICAgICAgICAgIGlmIChqID09PSBtaW4pIG1pbisrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hpbGQgPSBpZGlmZihjaGlsZCwgdmNoaWxkLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBmID0gb3JpZ2luYWxDaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZCAmJiBjaGlsZCAhPT0gZG9tICYmIGNoaWxkICE9PSBmKSBpZiAobnVsbCA9PSBmKSBkb20uYXBwZW5kQ2hpbGQoY2hpbGQpOyBlbHNlIGlmIChjaGlsZCA9PT0gZi5uZXh0U2libGluZykgcmVtb3ZlTm9kZShmKTsgZWxzZSBkb20uaW5zZXJ0QmVmb3JlKGNoaWxkLCBmKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ZWRMZW4pIGZvciAodmFyIGkgaW4ga2V5ZWQpIGlmICh2b2lkIDAgIT09IGtleWVkW2ldKSByZWNvbGxlY3ROb2RlVHJlZShrZXllZFtpXSwgITEpO1xuICAgICAgICB3aGlsZSAobWluIDw9IGNoaWxkcmVuTGVuKSBpZiAodm9pZCAwICE9PSAoY2hpbGQgPSBjaGlsZHJlbltjaGlsZHJlbkxlbi0tXSkpIHJlY29sbGVjdE5vZGVUcmVlKGNoaWxkLCAhMSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsIHVubW91bnRPbmx5KSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBub2RlLl9jb21wb25lbnQ7XG4gICAgICAgIGlmIChjb21wb25lbnQpIHVubW91bnRDb21wb25lbnQoY29tcG9uZW50KTsgZWxzZSB7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBub2RlLl9fcHJlYWN0YXR0cl8gJiYgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZikgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgICAgIGlmICghMSA9PT0gdW5tb3VudE9ubHkgfHwgbnVsbCA9PSBub2RlLl9fcHJlYWN0YXR0cl8pIHJlbW92ZU5vZGUobm9kZSk7XG4gICAgICAgICAgICByZW1vdmVDaGlsZHJlbihub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmxhc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBuZXh0ID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShub2RlLCAhMCk7XG4gICAgICAgICAgICBub2RlID0gbmV4dDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBkaWZmQXR0cmlidXRlcyhkb20sIGF0dHJzLCBvbGQpIHtcbiAgICAgICAgdmFyIG5hbWU7XG4gICAgICAgIGZvciAobmFtZSBpbiBvbGQpIGlmICgoIWF0dHJzIHx8IG51bGwgPT0gYXR0cnNbbmFtZV0pICYmIG51bGwgIT0gb2xkW25hbWVdKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gdm9pZCAwLCBpc1N2Z01vZGUpO1xuICAgICAgICBmb3IgKG5hbWUgaW4gYXR0cnMpIGlmICghKCdjaGlsZHJlbicgPT09IG5hbWUgfHwgJ2lubmVySFRNTCcgPT09IG5hbWUgfHwgbmFtZSBpbiBvbGQgJiYgYXR0cnNbbmFtZV0gPT09ICgndmFsdWUnID09PSBuYW1lIHx8ICdjaGVja2VkJyA9PT0gbmFtZSA/IGRvbVtuYW1lXSA6IG9sZFtuYW1lXSkpKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gYXR0cnNbbmFtZV0sIGlzU3ZnTW9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbGxlY3RDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgICAgIHZhciBuYW1lID0gY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIChjb21wb25lbnRzW25hbWVdIHx8IChjb21wb25lbnRzW25hbWVdID0gW10pKS5wdXNoKGNvbXBvbmVudCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChDdG9yLCBwcm9wcywgY29udGV4dCkge1xuICAgICAgICB2YXIgaW5zdCwgbGlzdCA9IGNvbXBvbmVudHNbQ3Rvci5uYW1lXTtcbiAgICAgICAgaWYgKEN0b3IucHJvdG90eXBlICYmIEN0b3IucHJvdG90eXBlLnJlbmRlcikge1xuICAgICAgICAgICAgaW5zdCA9IG5ldyBDdG9yKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIENvbXBvbmVudC5jYWxsKGluc3QsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGluc3QuY29uc3RydWN0b3IgPSBDdG9yO1xuICAgICAgICAgICAgaW5zdC5yZW5kZXIgPSBkb1JlbmRlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGlzdCkgZm9yICh2YXIgaSA9IGxpc3QubGVuZ3RoOyBpLS07ICkgaWYgKGxpc3RbaV0uY29uc3RydWN0b3IgPT09IEN0b3IpIHtcbiAgICAgICAgICAgIGluc3QuX19iID0gbGlzdFtpXS5fX2I7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBkb1JlbmRlcihwcm9wcywgc3RhdGUsIGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRDb21wb25lbnRQcm9wcyhjb21wb25lbnQsIHByb3BzLCBvcHRzLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3gpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19yID0gcHJvcHMucmVmKSBkZWxldGUgcHJvcHMucmVmO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fX2sgPSBwcm9wcy5rZXkpIGRlbGV0ZSBwcm9wcy5rZXk7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5iYXNlIHx8IG1vdW50QWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0ICYmIGNvbnRleHQgIT09IGNvbXBvbmVudC5jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuX19jKSBjb21wb25lbnQuX19jID0gY29tcG9uZW50LmNvbnRleHQ7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuX19wKSBjb21wb25lbnQuX19wID0gY29tcG9uZW50LnByb3BzO1xuICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICBjb21wb25lbnQuX194ID0gITE7XG4gICAgICAgICAgICBpZiAoMCAhPT0gb3B0cykgaWYgKDEgPT09IG9wdHMgfHwgITEgIT09IG9wdGlvbnMuc3luY0NvbXBvbmVudFVwZGF0ZXMgfHwgIWNvbXBvbmVudC5iYXNlKSByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCAxLCBtb3VudEFsbCk7IGVsc2UgZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fX3IpIGNvbXBvbmVudC5fX3IoY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCBvcHRzLCBtb3VudEFsbCwgaXNDaGlsZCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3gpIHtcbiAgICAgICAgICAgIHZhciByZW5kZXJlZCwgaW5zdCwgY2Jhc2UsIHByb3BzID0gY29tcG9uZW50LnByb3BzLCBzdGF0ZSA9IGNvbXBvbmVudC5zdGF0ZSwgY29udGV4dCA9IGNvbXBvbmVudC5jb250ZXh0LCBwcmV2aW91c1Byb3BzID0gY29tcG9uZW50Ll9fcCB8fCBwcm9wcywgcHJldmlvdXNTdGF0ZSA9IGNvbXBvbmVudC5fX3MgfHwgc3RhdGUsIHByZXZpb3VzQ29udGV4dCA9IGNvbXBvbmVudC5fX2MgfHwgY29udGV4dCwgaXNVcGRhdGUgPSBjb21wb25lbnQuYmFzZSwgbmV4dEJhc2UgPSBjb21wb25lbnQuX19iLCBpbml0aWFsQmFzZSA9IGlzVXBkYXRlIHx8IG5leHRCYXNlLCBpbml0aWFsQ2hpbGRDb21wb25lbnQgPSBjb21wb25lbnQuX2NvbXBvbmVudCwgc2tpcCA9ICExO1xuICAgICAgICAgICAgaWYgKGlzVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJldmlvdXNQcm9wcztcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3RhdGUgPSBwcmV2aW91c1N0YXRlO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gcHJldmlvdXNDb250ZXh0O1xuICAgICAgICAgICAgICAgIGlmICgyICE9PSBvcHRzICYmIGNvbXBvbmVudC5zaG91bGRDb21wb25lbnRVcGRhdGUgJiYgITEgPT09IGNvbXBvbmVudC5zaG91bGRDb21wb25lbnRVcGRhdGUocHJvcHMsIHN0YXRlLCBjb250ZXh0KSkgc2tpcCA9ICEwOyBlbHNlIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbFVwZGF0ZSkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxVcGRhdGUocHJvcHMsIHN0YXRlLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21wb25lbnQuX19wID0gY29tcG9uZW50Ll9fcyA9IGNvbXBvbmVudC5fX2MgPSBjb21wb25lbnQuX19iID0gbnVsbDtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX2QgPSAhMTtcbiAgICAgICAgICAgIGlmICghc2tpcCkge1xuICAgICAgICAgICAgICAgIHJlbmRlcmVkID0gY29tcG9uZW50LnJlbmRlcihwcm9wcywgc3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KSBjb250ZXh0ID0gZXh0ZW5kKGV4dGVuZCh7fSwgY29udGV4dCksIGNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQoKSk7XG4gICAgICAgICAgICAgICAgdmFyIHRvVW5tb3VudCwgYmFzZSwgY2hpbGRDb21wb25lbnQgPSByZW5kZXJlZCAmJiByZW5kZXJlZC5ub2RlTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgY2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkUHJvcHMgPSBnZXROb2RlUHJvcHMocmVuZGVyZWQpO1xuICAgICAgICAgICAgICAgICAgICBpbnN0ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdCAmJiBpbnN0LmNvbnN0cnVjdG9yID09PSBjaGlsZENvbXBvbmVudCAmJiBjaGlsZFByb3BzLmtleSA9PSBpbnN0Ll9faykgc2V0Q29tcG9uZW50UHJvcHMoaW5zdCwgY2hpbGRQcm9wcywgMSwgY29udGV4dCwgITEpOyBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvVW5tb3VudCA9IGluc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuX2NvbXBvbmVudCA9IGluc3QgPSBjcmVhdGVDb21wb25lbnQoY2hpbGRDb21wb25lbnQsIGNoaWxkUHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdC5fX2IgPSBpbnN0Ll9fYiB8fCBuZXh0QmFzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QuX191ID0gY29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoaW5zdCwgY2hpbGRQcm9wcywgMCwgY29udGV4dCwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcG9uZW50KGluc3QsIDEsIG1vdW50QWxsLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYmFzZSA9IGluc3QuYmFzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYmFzZSA9IGluaXRpYWxCYXNlO1xuICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbml0aWFsQ2hpbGRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b1VubW91bnQpIGNiYXNlID0gY29tcG9uZW50Ll9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEJhc2UgfHwgMSA9PT0gb3B0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNiYXNlKSBjYmFzZS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2UgPSBkaWZmKGNiYXNlLCByZW5kZXJlZCwgY29udGV4dCwgbW91bnRBbGwgfHwgIWlzVXBkYXRlLCBpbml0aWFsQmFzZSAmJiBpbml0aWFsQmFzZS5wYXJlbnROb2RlLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxCYXNlICYmIGJhc2UgIT09IGluaXRpYWxCYXNlICYmIGluc3QgIT09IGluaXRpYWxDaGlsZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmFzZVBhcmVudCA9IGluaXRpYWxCYXNlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYXNlUGFyZW50ICYmIGJhc2UgIT09IGJhc2VQYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VQYXJlbnQucmVwbGFjZUNoaWxkKGJhc2UsIGluaXRpYWxCYXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdG9Vbm1vdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbEJhc2UuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoaW5pdGlhbEJhc2UsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodG9Vbm1vdW50KSB1bm1vdW50Q29tcG9uZW50KHRvVW5tb3VudCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmJhc2UgPSBiYXNlO1xuICAgICAgICAgICAgICAgIGlmIChiYXNlICYmICFpc0NoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnRSZWYgPSBjb21wb25lbnQsIHQgPSBjb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0ID0gdC5fX3UpIChjb21wb25lbnRSZWYgPSB0KS5iYXNlID0gYmFzZTtcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50ID0gY29tcG9uZW50UmVmO1xuICAgICAgICAgICAgICAgICAgICBiYXNlLl9jb21wb25lbnRDb25zdHJ1Y3RvciA9IGNvbXBvbmVudFJlZi5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzVXBkYXRlIHx8IG1vdW50QWxsKSBtb3VudHMudW5zaGlmdChjb21wb25lbnQpOyBlbHNlIGlmICghc2tpcCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50RGlkVXBkYXRlKSBjb21wb25lbnQuY29tcG9uZW50RGlkVXBkYXRlKHByZXZpb3VzUHJvcHMsIHByZXZpb3VzU3RhdGUsIHByZXZpb3VzQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWZ0ZXJVcGRhdGUpIG9wdGlvbnMuYWZ0ZXJVcGRhdGUoY29tcG9uZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChudWxsICE9IGNvbXBvbmVudC5fX2gpIHdoaWxlIChjb21wb25lbnQuX19oLmxlbmd0aCkgY29tcG9uZW50Ll9faC5wb3AoKS5jYWxsKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoIWRpZmZMZXZlbCAmJiAhaXNDaGlsZCkgZmx1c2hNb3VudHMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgICAgICB2YXIgYyA9IGRvbSAmJiBkb20uX2NvbXBvbmVudCwgb3JpZ2luYWxDb21wb25lbnQgPSBjLCBvbGREb20gPSBkb20sIGlzRGlyZWN0T3duZXIgPSBjICYmIGRvbS5fY29tcG9uZW50Q29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lLCBpc093bmVyID0gaXNEaXJlY3RPd25lciwgcHJvcHMgPSBnZXROb2RlUHJvcHModm5vZGUpO1xuICAgICAgICB3aGlsZSAoYyAmJiAhaXNPd25lciAmJiAoYyA9IGMuX191KSkgaXNPd25lciA9IGMuY29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lO1xuICAgICAgICBpZiAoYyAmJiBpc093bmVyICYmICghbW91bnRBbGwgfHwgYy5fY29tcG9uZW50KSkge1xuICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoYywgcHJvcHMsIDMsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGRvbSA9IGMuYmFzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChvcmlnaW5hbENvbXBvbmVudCAmJiAhaXNEaXJlY3RPd25lcikge1xuICAgICAgICAgICAgICAgIHVubW91bnRDb21wb25lbnQob3JpZ2luYWxDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIGRvbSA9IG9sZERvbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjID0gY3JlYXRlQ29tcG9uZW50KHZub2RlLm5vZGVOYW1lLCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoZG9tICYmICFjLl9fYikge1xuICAgICAgICAgICAgICAgIGMuX19iID0gZG9tO1xuICAgICAgICAgICAgICAgIG9sZERvbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhjLCBwcm9wcywgMSwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZG9tID0gYy5iYXNlO1xuICAgICAgICAgICAgaWYgKG9sZERvbSAmJiBkb20gIT09IG9sZERvbSkge1xuICAgICAgICAgICAgICAgIG9sZERvbS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShvbGREb20sICExKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZG9tO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1bm1vdW50Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICBpZiAob3B0aW9ucy5iZWZvcmVVbm1vdW50KSBvcHRpb25zLmJlZm9yZVVubW91bnQoY29tcG9uZW50KTtcbiAgICAgICAgdmFyIGJhc2UgPSBjb21wb25lbnQuYmFzZTtcbiAgICAgICAgY29tcG9uZW50Ll9feCA9ICEwO1xuICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcbiAgICAgICAgY29tcG9uZW50LmJhc2UgPSBudWxsO1xuICAgICAgICB2YXIgaW5uZXIgPSBjb21wb25lbnQuX2NvbXBvbmVudDtcbiAgICAgICAgaWYgKGlubmVyKSB1bm1vdW50Q29tcG9uZW50KGlubmVyKTsgZWxzZSBpZiAoYmFzZSkge1xuICAgICAgICAgICAgaWYgKGJhc2UuX19wcmVhY3RhdHRyXyAmJiBiYXNlLl9fcHJlYWN0YXR0cl8ucmVmKSBiYXNlLl9fcHJlYWN0YXR0cl8ucmVmKG51bGwpO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9fYiA9IGJhc2U7XG4gICAgICAgICAgICByZW1vdmVOb2RlKGJhc2UpO1xuICAgICAgICAgICAgY29sbGVjdENvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgcmVtb3ZlQ2hpbGRyZW4oYmFzZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBvbmVudC5fX3IpIGNvbXBvbmVudC5fX3IobnVsbCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIENvbXBvbmVudChwcm9wcywgY29udGV4dCkge1xuICAgICAgICB0aGlzLl9fZCA9ICEwO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgIH1cbiAgICBmdW5jdGlvbiByZW5kZXIodm5vZGUsIHBhcmVudCwgbWVyZ2UpIHtcbiAgICAgICAgcmV0dXJuIGRpZmYobWVyZ2UsIHZub2RlLCB7fSwgITEsIHBhcmVudCwgITEpO1xuICAgIH1cbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBzdGFjayA9IFtdO1xuICAgIHZhciBFTVBUWV9DSElMRFJFTiA9IFtdO1xuICAgIHZhciBkZWZlciA9ICdmdW5jdGlvbicgPT0gdHlwZW9mIFByb21pc2UgPyBQcm9taXNlLnJlc29sdmUoKS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpIDogc2V0VGltZW91dDtcbiAgICB2YXIgSVNfTk9OX0RJTUVOU0lPTkFMID0gL2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgdmFyIG1vdW50cyA9IFtdO1xuICAgIHZhciBkaWZmTGV2ZWwgPSAwO1xuICAgIHZhciBpc1N2Z01vZGUgPSAhMTtcbiAgICB2YXIgaHlkcmF0aW5nID0gITE7XG4gICAgdmFyIGNvbXBvbmVudHMgPSB7fTtcbiAgICBleHRlbmQoQ29tcG9uZW50LnByb3RvdHlwZSwge1xuICAgICAgICBzZXRTdGF0ZTogZnVuY3Rpb24oc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX19zKSB0aGlzLl9fcyA9IGV4dGVuZCh7fSwgcyk7XG4gICAgICAgICAgICBleHRlbmQocywgJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygc3RhdGUgPyBzdGF0ZShzLCB0aGlzLnByb3BzKSA6IHN0YXRlKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgKHRoaXMuX19oID0gdGhpcy5fX2ggfHwgW10pLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgZW5xdWV1ZVJlbmRlcih0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9yY2VVcGRhdGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spICh0aGlzLl9faCA9IHRoaXMuX19oIHx8IFtdKS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHJlbmRlckNvbXBvbmVudCh0aGlzLCAyKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHt9XG4gICAgfSk7XG4gICAgdmFyIHByZWFjdCA9IHtcbiAgICAgICAgaDogaCxcbiAgICAgICAgY3JlYXRlRWxlbWVudDogaCxcbiAgICAgICAgY2xvbmVFbGVtZW50OiBjbG9uZUVsZW1lbnQsXG4gICAgICAgIENvbXBvbmVudDogQ29tcG9uZW50LFxuICAgICAgICByZW5kZXI6IHJlbmRlcixcbiAgICAgICAgcmVyZW5kZXI6IHJlcmVuZGVyLFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgfTtcbiAgICBpZiAoJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIG1vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBwcmVhY3Q7IGVsc2Ugc2VsZi5wcmVhY3QgPSBwcmVhY3Q7XG59KCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QuanMubWFwIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qISBodHRwczovL210aHMuYmUvcHVueWNvZGUgdjEuNC4xIGJ5IEBtYXRoaWFzICovXG47KGZ1bmN0aW9uKHJvb3QpIHtcblxuXHQvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGVzICovXG5cdHZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiZcblx0XHQhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXHR2YXIgZnJlZU1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmXG5cdFx0IW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cdHZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWw7XG5cdGlmIChcblx0XHRmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fFxuXHRcdGZyZWVHbG9iYWwud2luZG93ID09PSBmcmVlR2xvYmFsIHx8XG5cdFx0ZnJlZUdsb2JhbC5zZWxmID09PSBmcmVlR2xvYmFsXG5cdCkge1xuXHRcdHJvb3QgPSBmcmVlR2xvYmFsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBgcHVueWNvZGVgIG9iamVjdC5cblx0ICogQG5hbWUgcHVueWNvZGVcblx0ICogQHR5cGUgT2JqZWN0XG5cdCAqL1xuXHR2YXIgcHVueWNvZGUsXG5cblx0LyoqIEhpZ2hlc3QgcG9zaXRpdmUgc2lnbmVkIDMyLWJpdCBmbG9hdCB2YWx1ZSAqL1xuXHRtYXhJbnQgPSAyMTQ3NDgzNjQ3LCAvLyBha2EuIDB4N0ZGRkZGRkYgb3IgMl4zMS0xXG5cblx0LyoqIEJvb3RzdHJpbmcgcGFyYW1ldGVycyAqL1xuXHRiYXNlID0gMzYsXG5cdHRNaW4gPSAxLFxuXHR0TWF4ID0gMjYsXG5cdHNrZXcgPSAzOCxcblx0ZGFtcCA9IDcwMCxcblx0aW5pdGlhbEJpYXMgPSA3Mixcblx0aW5pdGlhbE4gPSAxMjgsIC8vIDB4ODBcblx0ZGVsaW1pdGVyID0gJy0nLCAvLyAnXFx4MkQnXG5cblx0LyoqIFJlZ3VsYXIgZXhwcmVzc2lvbnMgKi9cblx0cmVnZXhQdW55Y29kZSA9IC9eeG4tLS8sXG5cdHJlZ2V4Tm9uQVNDSUkgPSAvW15cXHgyMC1cXHg3RV0vLCAvLyB1bnByaW50YWJsZSBBU0NJSSBjaGFycyArIG5vbi1BU0NJSSBjaGFyc1xuXHRyZWdleFNlcGFyYXRvcnMgPSAvW1xceDJFXFx1MzAwMlxcdUZGMEVcXHVGRjYxXS9nLCAvLyBSRkMgMzQ5MCBzZXBhcmF0b3JzXG5cblx0LyoqIEVycm9yIG1lc3NhZ2VzICovXG5cdGVycm9ycyA9IHtcblx0XHQnb3ZlcmZsb3cnOiAnT3ZlcmZsb3c6IGlucHV0IG5lZWRzIHdpZGVyIGludGVnZXJzIHRvIHByb2Nlc3MnLFxuXHRcdCdub3QtYmFzaWMnOiAnSWxsZWdhbCBpbnB1dCA+PSAweDgwIChub3QgYSBiYXNpYyBjb2RlIHBvaW50KScsXG5cdFx0J2ludmFsaWQtaW5wdXQnOiAnSW52YWxpZCBpbnB1dCdcblx0fSxcblxuXHQvKiogQ29udmVuaWVuY2Ugc2hvcnRjdXRzICovXG5cdGJhc2VNaW51c1RNaW4gPSBiYXNlIC0gdE1pbixcblx0Zmxvb3IgPSBNYXRoLmZsb29yLFxuXHRzdHJpbmdGcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlLFxuXG5cdC8qKiBUZW1wb3JhcnkgdmFyaWFibGUgKi9cblx0a2V5O1xuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdC8qKlxuXHQgKiBBIGdlbmVyaWMgZXJyb3IgdXRpbGl0eSBmdW5jdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVGhlIGVycm9yIHR5cGUuXG5cdCAqIEByZXR1cm5zIHtFcnJvcn0gVGhyb3dzIGEgYFJhbmdlRXJyb3JgIHdpdGggdGhlIGFwcGxpY2FibGUgZXJyb3IgbWVzc2FnZS5cblx0ICovXG5cdGZ1bmN0aW9uIGVycm9yKHR5cGUpIHtcblx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcihlcnJvcnNbdHlwZV0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgZ2VuZXJpYyBgQXJyYXkjbWFwYCB1dGlsaXR5IGZ1bmN0aW9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCBmb3IgZXZlcnkgYXJyYXlcblx0ICogaXRlbS5cblx0ICogQHJldHVybnMge0FycmF5fSBBIG5ldyBhcnJheSBvZiB2YWx1ZXMgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwKGFycmF5LCBmbikge1xuXHRcdHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xuXHRcdHdoaWxlIChsZW5ndGgtLSkge1xuXHRcdFx0cmVzdWx0W2xlbmd0aF0gPSBmbihhcnJheVtsZW5ndGhdKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHNpbXBsZSBgQXJyYXkjbWFwYC1saWtlIHdyYXBwZXIgdG8gd29yayB3aXRoIGRvbWFpbiBuYW1lIHN0cmluZ3Mgb3IgZW1haWxcblx0ICogYWRkcmVzc2VzLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZG9tYWluIFRoZSBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCBmb3IgZXZlcnlcblx0ICogY2hhcmFjdGVyLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IHN0cmluZyBvZiBjaGFyYWN0ZXJzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFja1xuXHQgKiBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG1hcERvbWFpbihzdHJpbmcsIGZuKSB7XG5cdFx0dmFyIHBhcnRzID0gc3RyaW5nLnNwbGl0KCdAJyk7XG5cdFx0dmFyIHJlc3VsdCA9ICcnO1xuXHRcdGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG5cdFx0XHQvLyBJbiBlbWFpbCBhZGRyZXNzZXMsIG9ubHkgdGhlIGRvbWFpbiBuYW1lIHNob3VsZCBiZSBwdW55Y29kZWQuIExlYXZlXG5cdFx0XHQvLyB0aGUgbG9jYWwgcGFydCAoaS5lLiBldmVyeXRoaW5nIHVwIHRvIGBAYCkgaW50YWN0LlxuXHRcdFx0cmVzdWx0ID0gcGFydHNbMF0gKyAnQCc7XG5cdFx0XHRzdHJpbmcgPSBwYXJ0c1sxXTtcblx0XHR9XG5cdFx0Ly8gQXZvaWQgYHNwbGl0KHJlZ2V4KWAgZm9yIElFOCBjb21wYXRpYmlsaXR5LiBTZWUgIzE3LlxuXHRcdHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJlZ2V4U2VwYXJhdG9ycywgJ1xceDJFJyk7XG5cdFx0dmFyIGxhYmVscyA9IHN0cmluZy5zcGxpdCgnLicpO1xuXHRcdHZhciBlbmNvZGVkID0gbWFwKGxhYmVscywgZm4pLmpvaW4oJy4nKTtcblx0XHRyZXR1cm4gcmVzdWx0ICsgZW5jb2RlZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIG51bWVyaWMgY29kZSBwb2ludHMgb2YgZWFjaCBVbmljb2RlXG5cdCAqIGNoYXJhY3RlciBpbiB0aGUgc3RyaW5nLiBXaGlsZSBKYXZhU2NyaXB0IHVzZXMgVUNTLTIgaW50ZXJuYWxseSxcblx0ICogdGhpcyBmdW5jdGlvbiB3aWxsIGNvbnZlcnQgYSBwYWlyIG9mIHN1cnJvZ2F0ZSBoYWx2ZXMgKGVhY2ggb2Ygd2hpY2hcblx0ICogVUNTLTIgZXhwb3NlcyBhcyBzZXBhcmF0ZSBjaGFyYWN0ZXJzKSBpbnRvIGEgc2luZ2xlIGNvZGUgcG9pbnQsXG5cdCAqIG1hdGNoaW5nIFVURi0xNi5cblx0ICogQHNlZSBgcHVueWNvZGUudWNzMi5lbmNvZGVgXG5cdCAqIEBzZWUgPGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nPlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuXHQgKiBAbmFtZSBkZWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBUaGUgVW5pY29kZSBpbnB1dCBzdHJpbmcgKFVDUy0yKS5cblx0ICogQHJldHVybnMge0FycmF5fSBUaGUgbmV3IGFycmF5IG9mIGNvZGUgcG9pbnRzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdWNzMmRlY29kZShzdHJpbmcpIHtcblx0XHR2YXIgb3V0cHV0ID0gW10sXG5cdFx0ICAgIGNvdW50ZXIgPSAwLFxuXHRcdCAgICBsZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuXHRcdCAgICB2YWx1ZSxcblx0XHQgICAgZXh0cmE7XG5cdFx0d2hpbGUgKGNvdW50ZXIgPCBsZW5ndGgpIHtcblx0XHRcdHZhbHVlID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtcblx0XHRcdGlmICh2YWx1ZSA+PSAweEQ4MDAgJiYgdmFsdWUgPD0gMHhEQkZGICYmIGNvdW50ZXIgPCBsZW5ndGgpIHtcblx0XHRcdFx0Ly8gaGlnaCBzdXJyb2dhdGUsIGFuZCB0aGVyZSBpcyBhIG5leHQgY2hhcmFjdGVyXG5cdFx0XHRcdGV4dHJhID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtcblx0XHRcdFx0aWYgKChleHRyYSAmIDB4RkMwMCkgPT0gMHhEQzAwKSB7IC8vIGxvdyBzdXJyb2dhdGVcblx0XHRcdFx0XHRvdXRwdXQucHVzaCgoKHZhbHVlICYgMHgzRkYpIDw8IDEwKSArIChleHRyYSAmIDB4M0ZGKSArIDB4MTAwMDApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIHVubWF0Y2hlZCBzdXJyb2dhdGU7IG9ubHkgYXBwZW5kIHRoaXMgY29kZSB1bml0LCBpbiBjYXNlIHRoZSBuZXh0XG5cdFx0XHRcdFx0Ly8gY29kZSB1bml0IGlzIHRoZSBoaWdoIHN1cnJvZ2F0ZSBvZiBhIHN1cnJvZ2F0ZSBwYWlyXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2godmFsdWUpO1xuXHRcdFx0XHRcdGNvdW50ZXItLTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b3V0cHV0LnB1c2godmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBzdHJpbmcgYmFzZWQgb24gYW4gYXJyYXkgb2YgbnVtZXJpYyBjb2RlIHBvaW50cy5cblx0ICogQHNlZSBgcHVueWNvZGUudWNzMi5kZWNvZGVgXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG5cdCAqIEBuYW1lIGVuY29kZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBjb2RlUG9pbnRzIFRoZSBhcnJheSBvZiBudW1lcmljIGNvZGUgcG9pbnRzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgbmV3IFVuaWNvZGUgc3RyaW5nIChVQ1MtMikuXG5cdCAqL1xuXHRmdW5jdGlvbiB1Y3MyZW5jb2RlKGFycmF5KSB7XG5cdFx0cmV0dXJuIG1hcChhcnJheSwgZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhciBvdXRwdXQgPSAnJztcblx0XHRcdGlmICh2YWx1ZSA+IDB4RkZGRikge1xuXHRcdFx0XHR2YWx1ZSAtPSAweDEwMDAwO1xuXHRcdFx0XHRvdXRwdXQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKHZhbHVlID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKTtcblx0XHRcdFx0dmFsdWUgPSAweERDMDAgfCB2YWx1ZSAmIDB4M0ZGO1xuXHRcdFx0fVxuXHRcdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gb3V0cHV0O1xuXHRcdH0pLmpvaW4oJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgYmFzaWMgY29kZSBwb2ludCBpbnRvIGEgZGlnaXQvaW50ZWdlci5cblx0ICogQHNlZSBgZGlnaXRUb0Jhc2ljKClgXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBjb2RlUG9pbnQgVGhlIGJhc2ljIG51bWVyaWMgY29kZSBwb2ludCB2YWx1ZS5cblx0ICogQHJldHVybnMge051bWJlcn0gVGhlIG51bWVyaWMgdmFsdWUgb2YgYSBiYXNpYyBjb2RlIHBvaW50IChmb3IgdXNlIGluXG5cdCAqIHJlcHJlc2VudGluZyBpbnRlZ2VycykgaW4gdGhlIHJhbmdlIGAwYCB0byBgYmFzZSAtIDFgLCBvciBgYmFzZWAgaWZcblx0ICogdGhlIGNvZGUgcG9pbnQgZG9lcyBub3QgcmVwcmVzZW50IGEgdmFsdWUuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNpY1RvRGlnaXQoY29kZVBvaW50KSB7XG5cdFx0aWYgKGNvZGVQb2ludCAtIDQ4IDwgMTApIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSAyMjtcblx0XHR9XG5cdFx0aWYgKGNvZGVQb2ludCAtIDY1IDwgMjYpIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSA2NTtcblx0XHR9XG5cdFx0aWYgKGNvZGVQb2ludCAtIDk3IDwgMjYpIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSA5Nztcblx0XHR9XG5cdFx0cmV0dXJuIGJhc2U7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBkaWdpdC9pbnRlZ2VyIGludG8gYSBiYXNpYyBjb2RlIHBvaW50LlxuXHQgKiBAc2VlIGBiYXNpY1RvRGlnaXQoKWBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGRpZ2l0IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludC5cblx0ICogQHJldHVybnMge051bWJlcn0gVGhlIGJhc2ljIGNvZGUgcG9pbnQgd2hvc2UgdmFsdWUgKHdoZW4gdXNlZCBmb3Jcblx0ICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpcyBgZGlnaXRgLCB3aGljaCBuZWVkcyB0byBiZSBpbiB0aGUgcmFuZ2Vcblx0ICogYDBgIHRvIGBiYXNlIC0gMWAuIElmIGBmbGFnYCBpcyBub24temVybywgdGhlIHVwcGVyY2FzZSBmb3JtIGlzXG5cdCAqIHVzZWQ7IGVsc2UsIHRoZSBsb3dlcmNhc2UgZm9ybSBpcyB1c2VkLiBUaGUgYmVoYXZpb3IgaXMgdW5kZWZpbmVkXG5cdCAqIGlmIGBmbGFnYCBpcyBub24temVybyBhbmQgYGRpZ2l0YCBoYXMgbm8gdXBwZXJjYXNlIGZvcm0uXG5cdCAqL1xuXHRmdW5jdGlvbiBkaWdpdFRvQmFzaWMoZGlnaXQsIGZsYWcpIHtcblx0XHQvLyAgMC4uMjUgbWFwIHRvIEFTQ0lJIGEuLnogb3IgQS4uWlxuXHRcdC8vIDI2Li4zNSBtYXAgdG8gQVNDSUkgMC4uOVxuXHRcdHJldHVybiBkaWdpdCArIDIyICsgNzUgKiAoZGlnaXQgPCAyNikgLSAoKGZsYWcgIT0gMCkgPDwgNSk7XG5cdH1cblxuXHQvKipcblx0ICogQmlhcyBhZGFwdGF0aW9uIGZ1bmN0aW9uIGFzIHBlciBzZWN0aW9uIDMuNCBvZiBSRkMgMzQ5Mi5cblx0ICogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM0OTIjc2VjdGlvbi0zLjRcblx0ICogQHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIGFkYXB0KGRlbHRhLCBudW1Qb2ludHMsIGZpcnN0VGltZSkge1xuXHRcdHZhciBrID0gMDtcblx0XHRkZWx0YSA9IGZpcnN0VGltZSA/IGZsb29yKGRlbHRhIC8gZGFtcCkgOiBkZWx0YSA+PiAxO1xuXHRcdGRlbHRhICs9IGZsb29yKGRlbHRhIC8gbnVtUG9pbnRzKTtcblx0XHRmb3IgKC8qIG5vIGluaXRpYWxpemF0aW9uICovOyBkZWx0YSA+IGJhc2VNaW51c1RNaW4gKiB0TWF4ID4+IDE7IGsgKz0gYmFzZSkge1xuXHRcdFx0ZGVsdGEgPSBmbG9vcihkZWx0YSAvIGJhc2VNaW51c1RNaW4pO1xuXHRcdH1cblx0XHRyZXR1cm4gZmxvb3IoayArIChiYXNlTWludXNUTWluICsgMSkgKiBkZWx0YSAvIChkZWx0YSArIHNrZXcpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMgdG8gYSBzdHJpbmcgb2YgVW5pY29kZVxuXHQgKiBzeW1ib2xzLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBkZWNvZGUoaW5wdXQpIHtcblx0XHQvLyBEb24ndCB1c2UgVUNTLTJcblx0XHR2YXIgb3V0cHV0ID0gW10sXG5cdFx0ICAgIGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoLFxuXHRcdCAgICBvdXQsXG5cdFx0ICAgIGkgPSAwLFxuXHRcdCAgICBuID0gaW5pdGlhbE4sXG5cdFx0ICAgIGJpYXMgPSBpbml0aWFsQmlhcyxcblx0XHQgICAgYmFzaWMsXG5cdFx0ICAgIGosXG5cdFx0ICAgIGluZGV4LFxuXHRcdCAgICBvbGRpLFxuXHRcdCAgICB3LFxuXHRcdCAgICBrLFxuXHRcdCAgICBkaWdpdCxcblx0XHQgICAgdCxcblx0XHQgICAgLyoqIENhY2hlZCBjYWxjdWxhdGlvbiByZXN1bHRzICovXG5cdFx0ICAgIGJhc2VNaW51c1Q7XG5cblx0XHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzOiBsZXQgYGJhc2ljYCBiZSB0aGUgbnVtYmVyIG9mIGlucHV0IGNvZGVcblx0XHQvLyBwb2ludHMgYmVmb3JlIHRoZSBsYXN0IGRlbGltaXRlciwgb3IgYDBgIGlmIHRoZXJlIGlzIG5vbmUsIHRoZW4gY29weVxuXHRcdC8vIHRoZSBmaXJzdCBiYXNpYyBjb2RlIHBvaW50cyB0byB0aGUgb3V0cHV0LlxuXG5cdFx0YmFzaWMgPSBpbnB1dC5sYXN0SW5kZXhPZihkZWxpbWl0ZXIpO1xuXHRcdGlmIChiYXNpYyA8IDApIHtcblx0XHRcdGJhc2ljID0gMDtcblx0XHR9XG5cblx0XHRmb3IgKGogPSAwOyBqIDwgYmFzaWM7ICsraikge1xuXHRcdFx0Ly8gaWYgaXQncyBub3QgYSBiYXNpYyBjb2RlIHBvaW50XG5cdFx0XHRpZiAoaW5wdXQuY2hhckNvZGVBdChqKSA+PSAweDgwKSB7XG5cdFx0XHRcdGVycm9yKCdub3QtYmFzaWMnKTtcblx0XHRcdH1cblx0XHRcdG91dHB1dC5wdXNoKGlucHV0LmNoYXJDb2RlQXQoaikpO1xuXHRcdH1cblxuXHRcdC8vIE1haW4gZGVjb2RpbmcgbG9vcDogc3RhcnQganVzdCBhZnRlciB0aGUgbGFzdCBkZWxpbWl0ZXIgaWYgYW55IGJhc2ljIGNvZGVcblx0XHQvLyBwb2ludHMgd2VyZSBjb3BpZWQ7IHN0YXJ0IGF0IHRoZSBiZWdpbm5pbmcgb3RoZXJ3aXNlLlxuXG5cdFx0Zm9yIChpbmRleCA9IGJhc2ljID4gMCA/IGJhc2ljICsgMSA6IDA7IGluZGV4IDwgaW5wdXRMZW5ndGg7IC8qIG5vIGZpbmFsIGV4cHJlc3Npb24gKi8pIHtcblxuXHRcdFx0Ly8gYGluZGV4YCBpcyB0aGUgaW5kZXggb2YgdGhlIG5leHQgY2hhcmFjdGVyIHRvIGJlIGNvbnN1bWVkLlxuXHRcdFx0Ly8gRGVjb2RlIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXIgaW50byBgZGVsdGFgLFxuXHRcdFx0Ly8gd2hpY2ggZ2V0cyBhZGRlZCB0byBgaWAuIFRoZSBvdmVyZmxvdyBjaGVja2luZyBpcyBlYXNpZXJcblx0XHRcdC8vIGlmIHdlIGluY3JlYXNlIGBpYCBhcyB3ZSBnbywgdGhlbiBzdWJ0cmFjdCBvZmYgaXRzIHN0YXJ0aW5nXG5cdFx0XHQvLyB2YWx1ZSBhdCB0aGUgZW5kIHRvIG9idGFpbiBgZGVsdGFgLlxuXHRcdFx0Zm9yIChvbGRpID0gaSwgdyA9IDEsIGsgPSBiYXNlOyAvKiBubyBjb25kaXRpb24gKi87IGsgKz0gYmFzZSkge1xuXG5cdFx0XHRcdGlmIChpbmRleCA+PSBpbnB1dExlbmd0aCkge1xuXHRcdFx0XHRcdGVycm9yKCdpbnZhbGlkLWlucHV0Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkaWdpdCA9IGJhc2ljVG9EaWdpdChpbnB1dC5jaGFyQ29kZUF0KGluZGV4KyspKTtcblxuXHRcdFx0XHRpZiAoZGlnaXQgPj0gYmFzZSB8fCBkaWdpdCA+IGZsb29yKChtYXhJbnQgLSBpKSAvIHcpKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpICs9IGRpZ2l0ICogdztcblx0XHRcdFx0dCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cblx0XHRcdFx0aWYgKGRpZ2l0IDwgdCkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YmFzZU1pbnVzVCA9IGJhc2UgLSB0O1xuXHRcdFx0XHRpZiAodyA+IGZsb29yKG1heEludCAvIGJhc2VNaW51c1QpKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR3ICo9IGJhc2VNaW51c1Q7XG5cblx0XHRcdH1cblxuXHRcdFx0b3V0ID0gb3V0cHV0Lmxlbmd0aCArIDE7XG5cdFx0XHRiaWFzID0gYWRhcHQoaSAtIG9sZGksIG91dCwgb2xkaSA9PSAwKTtcblxuXHRcdFx0Ly8gYGlgIHdhcyBzdXBwb3NlZCB0byB3cmFwIGFyb3VuZCBmcm9tIGBvdXRgIHRvIGAwYCxcblx0XHRcdC8vIGluY3JlbWVudGluZyBgbmAgZWFjaCB0aW1lLCBzbyB3ZSdsbCBmaXggdGhhdCBub3c6XG5cdFx0XHRpZiAoZmxvb3IoaSAvIG91dCkgPiBtYXhJbnQgLSBuKSB7XG5cdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0fVxuXG5cdFx0XHRuICs9IGZsb29yKGkgLyBvdXQpO1xuXHRcdFx0aSAlPSBvdXQ7XG5cblx0XHRcdC8vIEluc2VydCBgbmAgYXQgcG9zaXRpb24gYGlgIG9mIHRoZSBvdXRwdXRcblx0XHRcdG91dHB1dC5zcGxpY2UoaSsrLCAwLCBuKTtcblxuXHRcdH1cblxuXHRcdHJldHVybiB1Y3MyZW5jb2RlKG91dHB1dCk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzIChlLmcuIGEgZG9tYWluIG5hbWUgbGFiZWwpIHRvIGFcblx0ICogUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIHJlc3VsdGluZyBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZW5jb2RlKGlucHV0KSB7XG5cdFx0dmFyIG4sXG5cdFx0ICAgIGRlbHRhLFxuXHRcdCAgICBoYW5kbGVkQ1BDb3VudCxcblx0XHQgICAgYmFzaWNMZW5ndGgsXG5cdFx0ICAgIGJpYXMsXG5cdFx0ICAgIGosXG5cdFx0ICAgIG0sXG5cdFx0ICAgIHEsXG5cdFx0ICAgIGssXG5cdFx0ICAgIHQsXG5cdFx0ICAgIGN1cnJlbnRWYWx1ZSxcblx0XHQgICAgb3V0cHV0ID0gW10sXG5cdFx0ICAgIC8qKiBgaW5wdXRMZW5ndGhgIHdpbGwgaG9sZCB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIGluIGBpbnB1dGAuICovXG5cdFx0ICAgIGlucHV0TGVuZ3RoLFxuXHRcdCAgICAvKiogQ2FjaGVkIGNhbGN1bGF0aW9uIHJlc3VsdHMgKi9cblx0XHQgICAgaGFuZGxlZENQQ291bnRQbHVzT25lLFxuXHRcdCAgICBiYXNlTWludXNULFxuXHRcdCAgICBxTWludXNUO1xuXG5cdFx0Ly8gQ29udmVydCB0aGUgaW5wdXQgaW4gVUNTLTIgdG8gVW5pY29kZVxuXHRcdGlucHV0ID0gdWNzMmRlY29kZShpbnB1dCk7XG5cblx0XHQvLyBDYWNoZSB0aGUgbGVuZ3RoXG5cdFx0aW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGg7XG5cblx0XHQvLyBJbml0aWFsaXplIHRoZSBzdGF0ZVxuXHRcdG4gPSBpbml0aWFsTjtcblx0XHRkZWx0YSA9IDA7XG5cdFx0YmlhcyA9IGluaXRpYWxCaWFzO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50c1xuXHRcdGZvciAoaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblx0XHRcdGlmIChjdXJyZW50VmFsdWUgPCAweDgwKSB7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHN0cmluZ0Zyb21DaGFyQ29kZShjdXJyZW50VmFsdWUpKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRoYW5kbGVkQ1BDb3VudCA9IGJhc2ljTGVuZ3RoID0gb3V0cHV0Lmxlbmd0aDtcblxuXHRcdC8vIGBoYW5kbGVkQ1BDb3VudGAgaXMgdGhlIG51bWJlciBvZiBjb2RlIHBvaW50cyB0aGF0IGhhdmUgYmVlbiBoYW5kbGVkO1xuXHRcdC8vIGBiYXNpY0xlbmd0aGAgaXMgdGhlIG51bWJlciBvZiBiYXNpYyBjb2RlIHBvaW50cy5cblxuXHRcdC8vIEZpbmlzaCB0aGUgYmFzaWMgc3RyaW5nIC0gaWYgaXQgaXMgbm90IGVtcHR5IC0gd2l0aCBhIGRlbGltaXRlclxuXHRcdGlmIChiYXNpY0xlbmd0aCkge1xuXHRcdFx0b3V0cHV0LnB1c2goZGVsaW1pdGVyKTtcblx0XHR9XG5cblx0XHQvLyBNYWluIGVuY29kaW5nIGxvb3A6XG5cdFx0d2hpbGUgKGhhbmRsZWRDUENvdW50IDwgaW5wdXRMZW5ndGgpIHtcblxuXHRcdFx0Ly8gQWxsIG5vbi1iYXNpYyBjb2RlIHBvaW50cyA8IG4gaGF2ZSBiZWVuIGhhbmRsZWQgYWxyZWFkeS4gRmluZCB0aGUgbmV4dFxuXHRcdFx0Ly8gbGFyZ2VyIG9uZTpcblx0XHRcdGZvciAobSA9IG1heEludCwgaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlID49IG4gJiYgY3VycmVudFZhbHVlIDwgbSkge1xuXHRcdFx0XHRcdG0gPSBjdXJyZW50VmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSW5jcmVhc2UgYGRlbHRhYCBlbm91Z2ggdG8gYWR2YW5jZSB0aGUgZGVjb2RlcidzIDxuLGk+IHN0YXRlIHRvIDxtLDA+LFxuXHRcdFx0Ly8gYnV0IGd1YXJkIGFnYWluc3Qgb3ZlcmZsb3dcblx0XHRcdGhhbmRsZWRDUENvdW50UGx1c09uZSA9IGhhbmRsZWRDUENvdW50ICsgMTtcblx0XHRcdGlmIChtIC0gbiA+IGZsb29yKChtYXhJbnQgLSBkZWx0YSkgLyBoYW5kbGVkQ1BDb3VudFBsdXNPbmUpKSB7XG5cdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0fVxuXG5cdFx0XHRkZWx0YSArPSAobSAtIG4pICogaGFuZGxlZENQQ291bnRQbHVzT25lO1xuXHRcdFx0biA9IG07XG5cblx0XHRcdGZvciAoaiA9IDA7IGogPCBpbnB1dExlbmd0aDsgKytqKSB7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPCBuICYmICsrZGVsdGEgPiBtYXhJbnQpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPT0gbikge1xuXHRcdFx0XHRcdC8vIFJlcHJlc2VudCBkZWx0YSBhcyBhIGdlbmVyYWxpemVkIHZhcmlhYmxlLWxlbmd0aCBpbnRlZ2VyXG5cdFx0XHRcdFx0Zm9yIChxID0gZGVsdGEsIGsgPSBiYXNlOyAvKiBubyBjb25kaXRpb24gKi87IGsgKz0gYmFzZSkge1xuXHRcdFx0XHRcdFx0dCA9IGsgPD0gYmlhcyA/IHRNaW4gOiAoayA+PSBiaWFzICsgdE1heCA/IHRNYXggOiBrIC0gYmlhcyk7XG5cdFx0XHRcdFx0XHRpZiAocSA8IHQpIHtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRxTWludXNUID0gcSAtIHQ7XG5cdFx0XHRcdFx0XHRiYXNlTWludXNUID0gYmFzZSAtIHQ7XG5cdFx0XHRcdFx0XHRvdXRwdXQucHVzaChcblx0XHRcdFx0XHRcdFx0c3RyaW5nRnJvbUNoYXJDb2RlKGRpZ2l0VG9CYXNpYyh0ICsgcU1pbnVzVCAlIGJhc2VNaW51c1QsIDApKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHEgPSBmbG9vcihxTWludXNUIC8gYmFzZU1pbnVzVCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGRpZ2l0VG9CYXNpYyhxLCAwKSkpO1xuXHRcdFx0XHRcdGJpYXMgPSBhZGFwdChkZWx0YSwgaGFuZGxlZENQQ291bnRQbHVzT25lLCBoYW5kbGVkQ1BDb3VudCA9PSBiYXNpY0xlbmd0aCk7XG5cdFx0XHRcdFx0ZGVsdGEgPSAwO1xuXHRcdFx0XHRcdCsraGFuZGxlZENQQ291bnQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0KytkZWx0YTtcblx0XHRcdCsrbjtcblxuXHRcdH1cblx0XHRyZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgUHVueWNvZGUgc3RyaW5nIHJlcHJlc2VudGluZyBhIGRvbWFpbiBuYW1lIG9yIGFuIGVtYWlsIGFkZHJlc3Ncblx0ICogdG8gVW5pY29kZS4gT25seSB0aGUgUHVueWNvZGVkIHBhcnRzIG9mIHRoZSBpbnB1dCB3aWxsIGJlIGNvbnZlcnRlZCwgaS5lLlxuXHQgKiBpdCBkb2Vzbid0IG1hdHRlciBpZiB5b3UgY2FsbCBpdCBvbiBhIHN0cmluZyB0aGF0IGhhcyBhbHJlYWR5IGJlZW5cblx0ICogY29udmVydGVkIHRvIFVuaWNvZGUuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlZCBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzIHRvXG5cdCAqIGNvbnZlcnQgdG8gVW5pY29kZS5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFVuaWNvZGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIFB1bnljb2RlXG5cdCAqIHN0cmluZy5cblx0ICovXG5cdGZ1bmN0aW9uIHRvVW5pY29kZShpbnB1dCkge1xuXHRcdHJldHVybiBtYXBEb21haW4oaW5wdXQsIGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHJlZ2V4UHVueWNvZGUudGVzdChzdHJpbmcpXG5cdFx0XHRcdD8gZGVjb2RlKHN0cmluZy5zbGljZSg0KS50b0xvd2VyQ2FzZSgpKVxuXHRcdFx0XHQ6IHN0cmluZztcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFVuaWNvZGUgc3RyaW5nIHJlcHJlc2VudGluZyBhIGRvbWFpbiBuYW1lIG9yIGFuIGVtYWlsIGFkZHJlc3MgdG9cblx0ICogUHVueWNvZGUuIE9ubHkgdGhlIG5vbi1BU0NJSSBwYXJ0cyBvZiB0aGUgZG9tYWluIG5hbWUgd2lsbCBiZSBjb252ZXJ0ZWQsXG5cdCAqIGkuZS4gaXQgZG9lc24ndCBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgd2l0aCBhIGRvbWFpbiB0aGF0J3MgYWxyZWFkeSBpblxuXHQgKiBBU0NJSS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcyB0byBjb252ZXJ0LCBhcyBhXG5cdCAqIFVuaWNvZGUgc3RyaW5nLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgUHVueWNvZGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIGRvbWFpbiBuYW1lIG9yXG5cdCAqIGVtYWlsIGFkZHJlc3MuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b0FTQ0lJKGlucHV0KSB7XG5cdFx0cmV0dXJuIG1hcERvbWFpbihpbnB1dCwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhOb25BU0NJSS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyAneG4tLScgKyBlbmNvZGUoc3RyaW5nKVxuXHRcdFx0XHQ6IHN0cmluZztcblx0XHR9KTtcblx0fVxuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdC8qKiBEZWZpbmUgdGhlIHB1YmxpYyBBUEkgKi9cblx0cHVueWNvZGUgPSB7XG5cdFx0LyoqXG5cdFx0ICogQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IFB1bnljb2RlLmpzIHZlcnNpb24gbnVtYmVyLlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIFN0cmluZ1xuXHRcdCAqL1xuXHRcdCd2ZXJzaW9uJzogJzEuNC4xJyxcblx0XHQvKipcblx0XHQgKiBBbiBvYmplY3Qgb2YgbWV0aG9kcyB0byBjb252ZXJ0IGZyb20gSmF2YVNjcmlwdCdzIGludGVybmFsIGNoYXJhY3RlclxuXHRcdCAqIHJlcHJlc2VudGF0aW9uIChVQ1MtMikgdG8gVW5pY29kZSBjb2RlIHBvaW50cywgYW5kIGJhY2suXG5cdFx0ICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdFx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdFx0ICogQHR5cGUgT2JqZWN0XG5cdFx0ICovXG5cdFx0J3VjczInOiB7XG5cdFx0XHQnZGVjb2RlJzogdWNzMmRlY29kZSxcblx0XHRcdCdlbmNvZGUnOiB1Y3MyZW5jb2RlXG5cdFx0fSxcblx0XHQnZGVjb2RlJzogZGVjb2RlLFxuXHRcdCdlbmNvZGUnOiBlbmNvZGUsXG5cdFx0J3RvQVNDSUknOiB0b0FTQ0lJLFxuXHRcdCd0b1VuaWNvZGUnOiB0b1VuaWNvZGVcblx0fTtcblxuXHQvKiogRXhwb3NlIGBwdW55Y29kZWAgKi9cblx0Ly8gU29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3Igc3BlY2lmaWMgY29uZGl0aW9uIHBhdHRlcm5zXG5cdC8vIGxpa2UgdGhlIGZvbGxvd2luZzpcblx0aWYgKFxuXHRcdHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmXG5cdFx0ZGVmaW5lLmFtZFxuXHQpIHtcblx0XHRkZWZpbmUoJ3B1bnljb2RlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gcHVueWNvZGU7XG5cdFx0fSk7XG5cdH0gZWxzZSBpZiAoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSkge1xuXHRcdGlmIChtb2R1bGUuZXhwb3J0cyA9PSBmcmVlRXhwb3J0cykge1xuXHRcdFx0Ly8gaW4gTm9kZS5qcywgaW8uanMsIG9yIFJpbmdvSlMgdjAuOC4wK1xuXHRcdFx0ZnJlZU1vZHVsZS5leHBvcnRzID0gcHVueWNvZGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGluIE5hcndoYWwgb3IgUmluZ29KUyB2MC43LjAtXG5cdFx0XHRmb3IgKGtleSBpbiBwdW55Y29kZSkge1xuXHRcdFx0XHRwdW55Y29kZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIChmcmVlRXhwb3J0c1trZXldID0gcHVueWNvZGVba2V5XSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vIGluIFJoaW5vIG9yIGEgd2ViIGJyb3dzZXJcblx0XHRyb290LnB1bnljb2RlID0gcHVueWNvZGU7XG5cdH1cblxufSh0aGlzKSk7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBJZiBvYmouaGFzT3duUHJvcGVydHkgaGFzIGJlZW4gb3ZlcnJpZGRlbiwgdGhlbiBjYWxsaW5nXG4vLyBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgd2lsbCBicmVhay5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzA3XG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHFzLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICB2YXIgb2JqID0ge307XG5cbiAgaWYgKHR5cGVvZiBxcyAhPT0gJ3N0cmluZycgfHwgcXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciByZWdleHAgPSAvXFwrL2c7XG4gIHFzID0gcXMuc3BsaXQoc2VwKTtcblxuICB2YXIgbWF4S2V5cyA9IDEwMDA7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLm1heEtleXMgPT09ICdudW1iZXInKSB7XG4gICAgbWF4S2V5cyA9IG9wdGlvbnMubWF4S2V5cztcbiAgfVxuXG4gIHZhciBsZW4gPSBxcy5sZW5ndGg7XG4gIC8vIG1heEtleXMgPD0gMCBtZWFucyB0aGF0IHdlIHNob3VsZCBub3QgbGltaXQga2V5cyBjb3VudFxuICBpZiAobWF4S2V5cyA+IDAgJiYgbGVuID4gbWF4S2V5cykge1xuICAgIGxlbiA9IG1heEtleXM7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHggPSBxc1tpXS5yZXBsYWNlKHJlZ2V4cCwgJyUyMCcpLFxuICAgICAgICBpZHggPSB4LmluZGV4T2YoZXEpLFxuICAgICAgICBrc3RyLCB2c3RyLCBrLCB2O1xuXG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBrc3RyID0geC5zdWJzdHIoMCwgaWR4KTtcbiAgICAgIHZzdHIgPSB4LnN1YnN0cihpZHggKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAga3N0ciA9IHg7XG4gICAgICB2c3RyID0gJyc7XG4gICAgfVxuXG4gICAgayA9IGRlY29kZVVSSUNvbXBvbmVudChrc3RyKTtcbiAgICB2ID0gZGVjb2RlVVJJQ29tcG9uZW50KHZzdHIpO1xuXG4gICAgaWYgKCFoYXNPd25Qcm9wZXJ0eShvYmosIGspKSB7XG4gICAgICBvYmpba10gPSB2O1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICBvYmpba10ucHVzaCh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqW2tdID0gW29ialtrXSwgdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeVByaW1pdGl2ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdjtcblxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuXG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBpc0Zpbml0ZSh2KSA/IHYgOiAnJztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBzZXAsIGVxLCBuYW1lKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgb2JqID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG1hcChvYmplY3RLZXlzKG9iaiksIGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBrcyA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG4gICAgICBpZiAoaXNBcnJheShvYmpba10pKSB7XG4gICAgICAgIHJldHVybiBtYXAob2JqW2tdLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgIH0pLmpvaW4oc2VwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqW2tdKSk7XG4gICAgICB9XG4gICAgfSkuam9pbihzZXApO1xuXG4gIH1cblxuICBpZiAoIW5hbWUpIHJldHVybiAnJztcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUobmFtZSkpICsgZXEgK1xuICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmopKTtcbn07XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5mdW5jdGlvbiBtYXAgKHhzLCBmKSB7XG4gIGlmICh4cy5tYXApIHJldHVybiB4cy5tYXAoZik7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgIHJlcy5wdXNoKGYoeHNbaV0sIGkpKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHJlcy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuZGVjb2RlID0gZXhwb3J0cy5wYXJzZSA9IHJlcXVpcmUoJy4vZGVjb2RlJyk7XG5leHBvcnRzLmVuY29kZSA9IGV4cG9ydHMuc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9lbmNvZGUnKTtcbiIsInZhciByYW5kb20gPSByZXF1aXJlKFwicm5kXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbG9yO1xuXG5mdW5jdGlvbiBjb2xvciAobWF4LCBtaW4pIHtcbiAgbWF4IHx8IChtYXggPSAyNTUpO1xuICByZXR1cm4gJ3JnYignICsgcmFuZG9tKG1heCwgbWluKSArICcsICcgKyByYW5kb20obWF4LCBtaW4pICsgJywgJyArIHJhbmRvbShtYXgsIG1pbikgKyAnKSc7XG59XG4iLCJ2YXIgcmVsYXRpdmVEYXRlID0gKGZ1bmN0aW9uKHVuZGVmaW5lZCl7XG5cbiAgdmFyIFNFQ09ORCA9IDEwMDAsXG4gICAgICBNSU5VVEUgPSA2MCAqIFNFQ09ORCxcbiAgICAgIEhPVVIgPSA2MCAqIE1JTlVURSxcbiAgICAgIERBWSA9IDI0ICogSE9VUixcbiAgICAgIFdFRUsgPSA3ICogREFZLFxuICAgICAgWUVBUiA9IERBWSAqIDM2NSxcbiAgICAgIE1PTlRIID0gWUVBUiAvIDEyO1xuXG4gIHZhciBmb3JtYXRzID0gW1xuICAgIFsgMC43ICogTUlOVVRFLCAnanVzdCBub3cnIF0sXG4gICAgWyAxLjUgKiBNSU5VVEUsICdhIG1pbnV0ZSBhZ28nIF0sXG4gICAgWyA2MCAqIE1JTlVURSwgJ21pbnV0ZXMgYWdvJywgTUlOVVRFIF0sXG4gICAgWyAxLjUgKiBIT1VSLCAnYW4gaG91ciBhZ28nIF0sXG4gICAgWyBEQVksICdob3VycyBhZ28nLCBIT1VSIF0sXG4gICAgWyAyICogREFZLCAneWVzdGVyZGF5JyBdLFxuICAgIFsgNyAqIERBWSwgJ2RheXMgYWdvJywgREFZIF0sXG4gICAgWyAxLjUgKiBXRUVLLCAnYSB3ZWVrIGFnbyddLFxuICAgIFsgTU9OVEgsICd3ZWVrcyBhZ28nLCBXRUVLIF0sXG4gICAgWyAxLjUgKiBNT05USCwgJ2EgbW9udGggYWdvJyBdLFxuICAgIFsgWUVBUiwgJ21vbnRocyBhZ28nLCBNT05USCBdLFxuICAgIFsgMS41ICogWUVBUiwgJ2EgeWVhciBhZ28nIF0sXG4gICAgWyBOdW1iZXIuTUFYX1ZBTFVFLCAneWVhcnMgYWdvJywgWUVBUiBdXG4gIF07XG5cbiAgZnVuY3Rpb24gcmVsYXRpdmVEYXRlKGlucHV0LHJlZmVyZW5jZSl7XG4gICAgIXJlZmVyZW5jZSAmJiAoIHJlZmVyZW5jZSA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpICk7XG4gICAgcmVmZXJlbmNlIGluc3RhbmNlb2YgRGF0ZSAmJiAoIHJlZmVyZW5jZSA9IHJlZmVyZW5jZS5nZXRUaW1lKCkgKTtcbiAgICBpbnB1dCBpbnN0YW5jZW9mIERhdGUgJiYgKCBpbnB1dCA9IGlucHV0LmdldFRpbWUoKSApO1xuICAgIFxuICAgIHZhciBkZWx0YSA9IHJlZmVyZW5jZSAtIGlucHV0LFxuICAgICAgICBmb3JtYXQsIGksIGxlbjtcblxuICAgIGZvcihpID0gLTEsIGxlbj1mb3JtYXRzLmxlbmd0aDsgKytpIDwgbGVuOyApe1xuICAgICAgZm9ybWF0ID0gZm9ybWF0c1tpXTtcbiAgICAgIGlmKGRlbHRhIDwgZm9ybWF0WzBdKXtcbiAgICAgICAgcmV0dXJuIGZvcm1hdFsyXSA9PSB1bmRlZmluZWQgPyBmb3JtYXRbMV0gOiBNYXRoLnJvdW5kKGRlbHRhL2Zvcm1hdFsyXSkgKyAnICcgKyBmb3JtYXRbMV07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiByZWxhdGl2ZURhdGU7XG5cbn0pKCk7XG5cbmlmKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpe1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlbGF0aXZlRGF0ZTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmFuZG9tO1xuXG5mdW5jdGlvbiByYW5kb20gKG1heCwgbWluKSB7XG4gIG1heCB8fCAobWF4ID0gOTk5OTk5OTk5OTk5KTtcbiAgbWluIHx8IChtaW4gPSAwKTtcblxuICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpO1xufVxuIiwiXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ2EnLFxuICAnYW4nLFxuICAnYW5kJyxcbiAgJ2FzJyxcbiAgJ2F0JyxcbiAgJ2J1dCcsXG4gICdieScsXG4gICdlbicsXG4gICdmb3InLFxuICAnZnJvbScsXG4gICdob3cnLFxuICAnaWYnLFxuICAnaW4nLFxuICAnbmVpdGhlcicsXG4gICdub3InLFxuICAnb2YnLFxuICAnb24nLFxuICAnb25seScsXG4gICdvbnRvJyxcbiAgJ291dCcsXG4gICdvcicsXG4gICdwZXInLFxuICAnc28nLFxuICAndGhhbicsXG4gICd0aGF0JyxcbiAgJ3RoZScsXG4gICd0bycsXG4gICd1bnRpbCcsXG4gICd1cCcsXG4gICd1cG9uJyxcbiAgJ3YnLFxuICAndi4nLFxuICAndmVyc3VzJyxcbiAgJ3ZzJyxcbiAgJ3ZzLicsXG4gICd2aWEnLFxuICAnd2hlbicsXG4gICd3aXRoJyxcbiAgJ3dpdGhvdXQnLFxuICAneWV0J1xuXTsiLCJ2YXIgdG9UaXRsZSA9IHJlcXVpcmUoXCJ0by10aXRsZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB1cmxUb1RpdGxlO1xuXG5mdW5jdGlvbiB1cmxUb1RpdGxlICh1cmwpIHtcbiAgdXJsID0gdW5lc2NhcGUodXJsKS5yZXBsYWNlKC9fL2csICcgJyk7XG4gIHVybCA9IHVybC5yZXBsYWNlKC9eXFx3KzpcXC9cXC8vLCAnJyk7XG4gIHVybCA9IHVybC5yZXBsYWNlKC9ed3d3XFwuLywgJycpO1xuICB1cmwgPSB1cmwucmVwbGFjZSgvKFxcL3xcXD8pJC8sICcnKTtcblxuICB2YXIgcGFydHMgPSB1cmwuc3BsaXQoJz8nKTtcbiAgdXJsID0gcGFydHNbMF07XG4gIHVybCA9IHVybC5yZXBsYWNlKC9cXC5cXHcrJC8sICcnKTtcblxuICBwYXJ0cyA9IHVybC5zcGxpdCgnLycpO1xuXG4gIHZhciBuYW1lID0gcGFydHNbMF07XG4gIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1xcLlxcdysoXFwvfCQpLywgJycpLnJlcGxhY2UoL1xcLihjb20/fG5ldHxvcmd8ZnIpJC8sICcnKVxuXG4gIGlmIChwYXJ0cy5sZW5ndGggPT0gMSkge1xuICAgIHJldHVybiB0aXRsZShuYW1lKTtcbiAgfVxuXG4gIHJldHVybiB0b1RpdGxlKHBhcnRzLnNsaWNlKDEpLnJldmVyc2UoKS5tYXAodG9UaXRsZSkuam9pbignIC0gJykpICsgJyBvbiAnICsgdGl0bGUobmFtZSk7XG59XG5cbmZ1bmN0aW9uIHRpdGxlIChob3N0KSB7XG4gIGlmICgvXltcXHdcXC5cXC1dKzpcXGQrLy50ZXN0KGhvc3QpKSB7XG4gICAgcmV0dXJuIGhvc3RcbiAgfVxuXG4gIHJldHVybiB0b1RpdGxlKGhvc3Quc3BsaXQoJy4nKS5qb2luKCcsICcpKVxufVxuIiwiXG52YXIgY2xlYW4gPSByZXF1aXJlKCd0by1uby1jYXNlJyk7XG5cblxuLyoqXG4gKiBFeHBvc2UgYHRvQ2FwaXRhbENhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdG9DYXBpdGFsQ2FzZTtcblxuXG4vKipcbiAqIENvbnZlcnQgYSBgc3RyaW5nYCB0byBjYXBpdGFsIGNhc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cblxuZnVuY3Rpb24gdG9DYXBpdGFsQ2FzZSAoc3RyaW5nKSB7XG4gIHJldHVybiBjbGVhbihzdHJpbmcpLnJlcGxhY2UoLyhefFxccykoXFx3KS9nLCBmdW5jdGlvbiAobWF0Y2hlcywgcHJldmlvdXMsIGxldHRlcikge1xuICAgIHJldHVybiBwcmV2aW91cyArIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuICB9KTtcbn0iLCJcbi8qKlxuICogRXhwb3NlIGB0b05vQ2FzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0b05vQ2FzZTtcblxuXG4vKipcbiAqIFRlc3Qgd2hldGhlciBhIHN0cmluZyBpcyBjYW1lbC1jYXNlLlxuICovXG5cbnZhciBoYXNTcGFjZSA9IC9cXHMvO1xudmFyIGhhc0NhbWVsID0gL1thLXpdW0EtWl0vO1xudmFyIGhhc1NlcGFyYXRvciA9IC9bXFxXX10vO1xuXG5cbi8qKlxuICogUmVtb3ZlIGFueSBzdGFydGluZyBjYXNlIGZyb20gYSBgc3RyaW5nYCwgbGlrZSBjYW1lbCBvciBzbmFrZSwgYnV0IGtlZXBcbiAqIHNwYWNlcyBhbmQgcHVuY3R1YXRpb24gdGhhdCBtYXkgYmUgaW1wb3J0YW50IG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gdG9Ob0Nhc2UgKHN0cmluZykge1xuICBpZiAoaGFzU3BhY2UudGVzdChzdHJpbmcpKSByZXR1cm4gc3RyaW5nLnRvTG93ZXJDYXNlKCk7XG5cbiAgaWYgKGhhc1NlcGFyYXRvci50ZXN0KHN0cmluZykpIHN0cmluZyA9IHVuc2VwYXJhdGUoc3RyaW5nKTtcbiAgaWYgKGhhc0NhbWVsLnRlc3Qoc3RyaW5nKSkgc3RyaW5nID0gdW5jYW1lbGl6ZShzdHJpbmcpO1xuICByZXR1cm4gc3RyaW5nLnRvTG93ZXJDYXNlKCk7XG59XG5cblxuLyoqXG4gKiBTZXBhcmF0b3Igc3BsaXR0ZXIuXG4gKi9cblxudmFyIHNlcGFyYXRvclNwbGl0dGVyID0gL1tcXFdfXSsoLnwkKS9nO1xuXG5cbi8qKlxuICogVW4tc2VwYXJhdGUgYSBgc3RyaW5nYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gdW5zZXBhcmF0ZSAoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShzZXBhcmF0b3JTcGxpdHRlciwgZnVuY3Rpb24gKG0sIG5leHQpIHtcbiAgICByZXR1cm4gbmV4dCA/ICcgJyArIG5leHQgOiAnJztcbiAgfSk7XG59XG5cblxuLyoqXG4gKiBDYW1lbGNhc2Ugc3BsaXR0ZXIuXG4gKi9cblxudmFyIGNhbWVsU3BsaXR0ZXIgPSAvKC4pKFtBLVpdKykvZztcblxuXG4vKipcbiAqIFVuLWNhbWVsY2FzZSBhIGBzdHJpbmdgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiB1bmNhbWVsaXplIChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKGNhbWVsU3BsaXR0ZXIsIGZ1bmN0aW9uIChtLCBwcmV2aW91cywgdXBwZXJzKSB7XG4gICAgcmV0dXJuIHByZXZpb3VzICsgJyAnICsgdXBwZXJzLnRvTG93ZXJDYXNlKCkuc3BsaXQoJycpLmpvaW4oJyAnKTtcbiAgfSk7XG59IiwidmFyIGVzY2FwZSA9IHJlcXVpcmUoJ2VzY2FwZS1yZWdleHAtY29tcG9uZW50Jyk7XG52YXIgY2FwaXRhbCA9IHJlcXVpcmUoJ3RvLWNhcGl0YWwtY2FzZScpO1xudmFyIG1pbm9ycyA9IHJlcXVpcmUoJ3RpdGxlLWNhc2UtbWlub3JzJyk7XG5cbi8qKlxuICogRXhwb3NlIGB0b1RpdGxlQ2FzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0b1RpdGxlQ2FzZTtcblxuXG4vKipcbiAqIE1pbm9ycy5cbiAqL1xuXG52YXIgZXNjYXBlZCA9IG1pbm9ycy5tYXAoZXNjYXBlKTtcbnZhciBtaW5vck1hdGNoZXIgPSBuZXcgUmVnRXhwKCdbXl5dXFxcXGIoJyArIGVzY2FwZWQuam9pbignfCcpICsgJylcXFxcYicsICdpZycpO1xudmFyIGNvbG9uTWF0Y2hlciA9IC86XFxzKihcXHcpL2c7XG5cblxuLyoqXG4gKiBDb252ZXJ0IGEgYHN0cmluZ2AgdG8gY2FtZWwgY2FzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuXG5mdW5jdGlvbiB0b1RpdGxlQ2FzZSAoc3RyaW5nKSB7XG4gIHJldHVybiBjYXBpdGFsKHN0cmluZylcbiAgICAucmVwbGFjZShtaW5vck1hdGNoZXIsIGZ1bmN0aW9uIChtaW5vcikge1xuICAgICAgcmV0dXJuIG1pbm9yLnRvTG93ZXJDYXNlKCk7XG4gICAgfSlcbiAgICAucmVwbGFjZShjb2xvbk1hdGNoZXIsIGZ1bmN0aW9uIChsZXR0ZXIpIHtcbiAgICAgIHJldHVybiBsZXR0ZXIudG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBwdW55Y29kZSA9IHJlcXVpcmUoJ3B1bnljb2RlJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5leHBvcnRzLnBhcnNlID0gdXJsUGFyc2U7XG5leHBvcnRzLnJlc29sdmUgPSB1cmxSZXNvbHZlO1xuZXhwb3J0cy5yZXNvbHZlT2JqZWN0ID0gdXJsUmVzb2x2ZU9iamVjdDtcbmV4cG9ydHMuZm9ybWF0ID0gdXJsRm9ybWF0O1xuXG5leHBvcnRzLlVybCA9IFVybDtcblxuZnVuY3Rpb24gVXJsKCkge1xuICB0aGlzLnByb3RvY29sID0gbnVsbDtcbiAgdGhpcy5zbGFzaGVzID0gbnVsbDtcbiAgdGhpcy5hdXRoID0gbnVsbDtcbiAgdGhpcy5ob3N0ID0gbnVsbDtcbiAgdGhpcy5wb3J0ID0gbnVsbDtcbiAgdGhpcy5ob3N0bmFtZSA9IG51bGw7XG4gIHRoaXMuaGFzaCA9IG51bGw7XG4gIHRoaXMuc2VhcmNoID0gbnVsbDtcbiAgdGhpcy5xdWVyeSA9IG51bGw7XG4gIHRoaXMucGF0aG5hbWUgPSBudWxsO1xuICB0aGlzLnBhdGggPSBudWxsO1xuICB0aGlzLmhyZWYgPSBudWxsO1xufVxuXG4vLyBSZWZlcmVuY2U6IFJGQyAzOTg2LCBSRkMgMTgwOCwgUkZDIDIzOTZcblxuLy8gZGVmaW5lIHRoZXNlIGhlcmUgc28gYXQgbGVhc3QgdGhleSBvbmx5IGhhdmUgdG8gYmVcbi8vIGNvbXBpbGVkIG9uY2Ugb24gdGhlIGZpcnN0IG1vZHVsZSBsb2FkLlxudmFyIHByb3RvY29sUGF0dGVybiA9IC9eKFthLXowLTkuKy1dKzopL2ksXG4gICAgcG9ydFBhdHRlcm4gPSAvOlswLTldKiQvLFxuXG4gICAgLy8gU3BlY2lhbCBjYXNlIGZvciBhIHNpbXBsZSBwYXRoIFVSTFxuICAgIHNpbXBsZVBhdGhQYXR0ZXJuID0gL14oXFwvXFwvPyg/IVxcLylbXlxcP1xcc10qKShcXD9bXlxcc10qKT8kLyxcblxuICAgIC8vIFJGQyAyMzk2OiBjaGFyYWN0ZXJzIHJlc2VydmVkIGZvciBkZWxpbWl0aW5nIFVSTHMuXG4gICAgLy8gV2UgYWN0dWFsbHkganVzdCBhdXRvLWVzY2FwZSB0aGVzZS5cbiAgICBkZWxpbXMgPSBbJzwnLCAnPicsICdcIicsICdgJywgJyAnLCAnXFxyJywgJ1xcbicsICdcXHQnXSxcblxuICAgIC8vIFJGQyAyMzk2OiBjaGFyYWN0ZXJzIG5vdCBhbGxvd2VkIGZvciB2YXJpb3VzIHJlYXNvbnMuXG4gICAgdW53aXNlID0gWyd7JywgJ30nLCAnfCcsICdcXFxcJywgJ14nLCAnYCddLmNvbmNhdChkZWxpbXMpLFxuXG4gICAgLy8gQWxsb3dlZCBieSBSRkNzLCBidXQgY2F1c2Ugb2YgWFNTIGF0dGFja3MuICBBbHdheXMgZXNjYXBlIHRoZXNlLlxuICAgIGF1dG9Fc2NhcGUgPSBbJ1xcJyddLmNvbmNhdCh1bndpc2UpLFxuICAgIC8vIENoYXJhY3RlcnMgdGhhdCBhcmUgbmV2ZXIgZXZlciBhbGxvd2VkIGluIGEgaG9zdG5hbWUuXG4gICAgLy8gTm90ZSB0aGF0IGFueSBpbnZhbGlkIGNoYXJzIGFyZSBhbHNvIGhhbmRsZWQsIGJ1dCB0aGVzZVxuICAgIC8vIGFyZSB0aGUgb25lcyB0aGF0IGFyZSAqZXhwZWN0ZWQqIHRvIGJlIHNlZW4sIHNvIHdlIGZhc3QtcGF0aFxuICAgIC8vIHRoZW0uXG4gICAgbm9uSG9zdENoYXJzID0gWyclJywgJy8nLCAnPycsICc7JywgJyMnXS5jb25jYXQoYXV0b0VzY2FwZSksXG4gICAgaG9zdEVuZGluZ0NoYXJzID0gWycvJywgJz8nLCAnIyddLFxuICAgIGhvc3RuYW1lTWF4TGVuID0gMjU1LFxuICAgIGhvc3RuYW1lUGFydFBhdHRlcm4gPSAvXlsrYS16MC05QS1aXy1dezAsNjN9JC8sXG4gICAgaG9zdG5hbWVQYXJ0U3RhcnQgPSAvXihbK2EtejAtOUEtWl8tXXswLDYzfSkoLiopJC8sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgY2FuIGFsbG93IFwidW5zYWZlXCIgYW5kIFwidW53aXNlXCIgY2hhcnMuXG4gICAgdW5zYWZlUHJvdG9jb2wgPSB7XG4gICAgICAnamF2YXNjcmlwdCc6IHRydWUsXG4gICAgICAnamF2YXNjcmlwdDonOiB0cnVlXG4gICAgfSxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBuZXZlciBoYXZlIGEgaG9zdG5hbWUuXG4gICAgaG9zdGxlc3NQcm90b2NvbCA9IHtcbiAgICAgICdqYXZhc2NyaXB0JzogdHJ1ZSxcbiAgICAgICdqYXZhc2NyaXB0Oic6IHRydWVcbiAgICB9LFxuICAgIC8vIHByb3RvY29scyB0aGF0IGFsd2F5cyBjb250YWluIGEgLy8gYml0LlxuICAgIHNsYXNoZWRQcm90b2NvbCA9IHtcbiAgICAgICdodHRwJzogdHJ1ZSxcbiAgICAgICdodHRwcyc6IHRydWUsXG4gICAgICAnZnRwJzogdHJ1ZSxcbiAgICAgICdnb3BoZXInOiB0cnVlLFxuICAgICAgJ2ZpbGUnOiB0cnVlLFxuICAgICAgJ2h0dHA6JzogdHJ1ZSxcbiAgICAgICdodHRwczonOiB0cnVlLFxuICAgICAgJ2Z0cDonOiB0cnVlLFxuICAgICAgJ2dvcGhlcjonOiB0cnVlLFxuICAgICAgJ2ZpbGU6JzogdHJ1ZVxuICAgIH0sXG4gICAgcXVlcnlzdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xuXG5mdW5jdGlvbiB1cmxQYXJzZSh1cmwsIHBhcnNlUXVlcnlTdHJpbmcsIHNsYXNoZXNEZW5vdGVIb3N0KSB7XG4gIGlmICh1cmwgJiYgdXRpbC5pc09iamVjdCh1cmwpICYmIHVybCBpbnN0YW5jZW9mIFVybCkgcmV0dXJuIHVybDtcblxuICB2YXIgdSA9IG5ldyBVcmw7XG4gIHUucGFyc2UodXJsLCBwYXJzZVF1ZXJ5U3RyaW5nLCBzbGFzaGVzRGVub3RlSG9zdCk7XG4gIHJldHVybiB1O1xufVxuXG5VcmwucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24odXJsLCBwYXJzZVF1ZXJ5U3RyaW5nLCBzbGFzaGVzRGVub3RlSG9zdCkge1xuICBpZiAoIXV0aWwuaXNTdHJpbmcodXJsKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQYXJhbWV0ZXIgJ3VybCcgbXVzdCBiZSBhIHN0cmluZywgbm90IFwiICsgdHlwZW9mIHVybCk7XG4gIH1cblxuICAvLyBDb3B5IGNocm9tZSwgSUUsIG9wZXJhIGJhY2tzbGFzaC1oYW5kbGluZyBiZWhhdmlvci5cbiAgLy8gQmFjayBzbGFzaGVzIGJlZm9yZSB0aGUgcXVlcnkgc3RyaW5nIGdldCBjb252ZXJ0ZWQgdG8gZm9yd2FyZCBzbGFzaGVzXG4gIC8vIFNlZTogaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTI1OTE2XG4gIHZhciBxdWVyeUluZGV4ID0gdXJsLmluZGV4T2YoJz8nKSxcbiAgICAgIHNwbGl0dGVyID1cbiAgICAgICAgICAocXVlcnlJbmRleCAhPT0gLTEgJiYgcXVlcnlJbmRleCA8IHVybC5pbmRleE9mKCcjJykpID8gJz8nIDogJyMnLFxuICAgICAgdVNwbGl0ID0gdXJsLnNwbGl0KHNwbGl0dGVyKSxcbiAgICAgIHNsYXNoUmVnZXggPSAvXFxcXC9nO1xuICB1U3BsaXRbMF0gPSB1U3BsaXRbMF0ucmVwbGFjZShzbGFzaFJlZ2V4LCAnLycpO1xuICB1cmwgPSB1U3BsaXQuam9pbihzcGxpdHRlcik7XG5cbiAgdmFyIHJlc3QgPSB1cmw7XG5cbiAgLy8gdHJpbSBiZWZvcmUgcHJvY2VlZGluZy5cbiAgLy8gVGhpcyBpcyB0byBzdXBwb3J0IHBhcnNlIHN0dWZmIGxpa2UgXCIgIGh0dHA6Ly9mb28uY29tICBcXG5cIlxuICByZXN0ID0gcmVzdC50cmltKCk7XG5cbiAgaWYgKCFzbGFzaGVzRGVub3RlSG9zdCAmJiB1cmwuc3BsaXQoJyMnKS5sZW5ndGggPT09IDEpIHtcbiAgICAvLyBUcnkgZmFzdCBwYXRoIHJlZ2V4cFxuICAgIHZhciBzaW1wbGVQYXRoID0gc2ltcGxlUGF0aFBhdHRlcm4uZXhlYyhyZXN0KTtcbiAgICBpZiAoc2ltcGxlUGF0aCkge1xuICAgICAgdGhpcy5wYXRoID0gcmVzdDtcbiAgICAgIHRoaXMuaHJlZiA9IHJlc3Q7XG4gICAgICB0aGlzLnBhdGhuYW1lID0gc2ltcGxlUGF0aFsxXTtcbiAgICAgIGlmIChzaW1wbGVQYXRoWzJdKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoID0gc2ltcGxlUGF0aFsyXTtcbiAgICAgICAgaWYgKHBhcnNlUXVlcnlTdHJpbmcpIHtcbiAgICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnlzdHJpbmcucGFyc2UodGhpcy5zZWFyY2guc3Vic3RyKDEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnF1ZXJ5ID0gdGhpcy5zZWFyY2guc3Vic3RyKDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHBhcnNlUXVlcnlTdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zZWFyY2ggPSAnJztcbiAgICAgICAgdGhpcy5xdWVyeSA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XG5cbiAgdmFyIHByb3RvID0gcHJvdG9jb2xQYXR0ZXJuLmV4ZWMocmVzdCk7XG4gIGlmIChwcm90bykge1xuICAgIHByb3RvID0gcHJvdG9bMF07XG4gICAgdmFyIGxvd2VyUHJvdG8gPSBwcm90by50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMucHJvdG9jb2wgPSBsb3dlclByb3RvO1xuICAgIHJlc3QgPSByZXN0LnN1YnN0cihwcm90by5sZW5ndGgpO1xuICB9XG5cbiAgLy8gZmlndXJlIG91dCBpZiBpdCdzIGdvdCBhIGhvc3RcbiAgLy8gdXNlckBzZXJ2ZXIgaXMgKmFsd2F5cyogaW50ZXJwcmV0ZWQgYXMgYSBob3N0bmFtZSwgYW5kIHVybFxuICAvLyByZXNvbHV0aW9uIHdpbGwgdHJlYXQgLy9mb28vYmFyIGFzIGhvc3Q9Zm9vLHBhdGg9YmFyIGJlY2F1c2UgdGhhdCdzXG4gIC8vIGhvdyB0aGUgYnJvd3NlciByZXNvbHZlcyByZWxhdGl2ZSBVUkxzLlxuICBpZiAoc2xhc2hlc0Rlbm90ZUhvc3QgfHwgcHJvdG8gfHwgcmVzdC5tYXRjaCgvXlxcL1xcL1teQFxcL10rQFteQFxcL10rLykpIHtcbiAgICB2YXIgc2xhc2hlcyA9IHJlc3Quc3Vic3RyKDAsIDIpID09PSAnLy8nO1xuICAgIGlmIChzbGFzaGVzICYmICEocHJvdG8gJiYgaG9zdGxlc3NQcm90b2NvbFtwcm90b10pKSB7XG4gICAgICByZXN0ID0gcmVzdC5zdWJzdHIoMik7XG4gICAgICB0aGlzLnNsYXNoZXMgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaG9zdGxlc3NQcm90b2NvbFtwcm90b10gJiZcbiAgICAgIChzbGFzaGVzIHx8IChwcm90byAmJiAhc2xhc2hlZFByb3RvY29sW3Byb3RvXSkpKSB7XG5cbiAgICAvLyB0aGVyZSdzIGEgaG9zdG5hbWUuXG4gICAgLy8gdGhlIGZpcnN0IGluc3RhbmNlIG9mIC8sID8sIDssIG9yICMgZW5kcyB0aGUgaG9zdC5cbiAgICAvL1xuICAgIC8vIElmIHRoZXJlIGlzIGFuIEAgaW4gdGhlIGhvc3RuYW1lLCB0aGVuIG5vbi1ob3N0IGNoYXJzICphcmUqIGFsbG93ZWRcbiAgICAvLyB0byB0aGUgbGVmdCBvZiB0aGUgbGFzdCBAIHNpZ24sIHVubGVzcyBzb21lIGhvc3QtZW5kaW5nIGNoYXJhY3RlclxuICAgIC8vIGNvbWVzICpiZWZvcmUqIHRoZSBALXNpZ24uXG4gICAgLy8gVVJMcyBhcmUgb2Jub3hpb3VzLlxuICAgIC8vXG4gICAgLy8gZXg6XG4gICAgLy8gaHR0cDovL2FAYkBjLyA9PiB1c2VyOmFAYiBob3N0OmNcbiAgICAvLyBodHRwOi8vYUBiP0BjID0+IHVzZXI6YSBob3N0OmMgcGF0aDovP0BjXG5cbiAgICAvLyB2MC4xMiBUT0RPKGlzYWFjcyk6IFRoaXMgaXMgbm90IHF1aXRlIGhvdyBDaHJvbWUgZG9lcyB0aGluZ3MuXG4gICAgLy8gUmV2aWV3IG91ciB0ZXN0IGNhc2UgYWdhaW5zdCBicm93c2VycyBtb3JlIGNvbXByZWhlbnNpdmVseS5cblxuICAgIC8vIGZpbmQgdGhlIGZpcnN0IGluc3RhbmNlIG9mIGFueSBob3N0RW5kaW5nQ2hhcnNcbiAgICB2YXIgaG9zdEVuZCA9IC0xO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaG9zdEVuZGluZ0NoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaGVjID0gcmVzdC5pbmRleE9mKGhvc3RFbmRpbmdDaGFyc1tpXSk7XG4gICAgICBpZiAoaGVjICE9PSAtMSAmJiAoaG9zdEVuZCA9PT0gLTEgfHwgaGVjIDwgaG9zdEVuZCkpXG4gICAgICAgIGhvc3RFbmQgPSBoZWM7XG4gICAgfVxuXG4gICAgLy8gYXQgdGhpcyBwb2ludCwgZWl0aGVyIHdlIGhhdmUgYW4gZXhwbGljaXQgcG9pbnQgd2hlcmUgdGhlXG4gICAgLy8gYXV0aCBwb3J0aW9uIGNhbm5vdCBnbyBwYXN0LCBvciB0aGUgbGFzdCBAIGNoYXIgaXMgdGhlIGRlY2lkZXIuXG4gICAgdmFyIGF1dGgsIGF0U2lnbjtcbiAgICBpZiAoaG9zdEVuZCA9PT0gLTEpIHtcbiAgICAgIC8vIGF0U2lnbiBjYW4gYmUgYW55d2hlcmUuXG4gICAgICBhdFNpZ24gPSByZXN0Lmxhc3RJbmRleE9mKCdAJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGF0U2lnbiBtdXN0IGJlIGluIGF1dGggcG9ydGlvbi5cbiAgICAgIC8vIGh0dHA6Ly9hQGIvY0BkID0+IGhvc3Q6YiBhdXRoOmEgcGF0aDovY0BkXG4gICAgICBhdFNpZ24gPSByZXN0Lmxhc3RJbmRleE9mKCdAJywgaG9zdEVuZCk7XG4gICAgfVxuXG4gICAgLy8gTm93IHdlIGhhdmUgYSBwb3J0aW9uIHdoaWNoIGlzIGRlZmluaXRlbHkgdGhlIGF1dGguXG4gICAgLy8gUHVsbCB0aGF0IG9mZi5cbiAgICBpZiAoYXRTaWduICE9PSAtMSkge1xuICAgICAgYXV0aCA9IHJlc3Quc2xpY2UoMCwgYXRTaWduKTtcbiAgICAgIHJlc3QgPSByZXN0LnNsaWNlKGF0U2lnbiArIDEpO1xuICAgICAgdGhpcy5hdXRoID0gZGVjb2RlVVJJQ29tcG9uZW50KGF1dGgpO1xuICAgIH1cblxuICAgIC8vIHRoZSBob3N0IGlzIHRoZSByZW1haW5pbmcgdG8gdGhlIGxlZnQgb2YgdGhlIGZpcnN0IG5vbi1ob3N0IGNoYXJcbiAgICBob3N0RW5kID0gLTE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub25Ib3N0Q2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBoZWMgPSByZXN0LmluZGV4T2Yobm9uSG9zdENoYXJzW2ldKTtcbiAgICAgIGlmIChoZWMgIT09IC0xICYmIChob3N0RW5kID09PSAtMSB8fCBoZWMgPCBob3N0RW5kKSlcbiAgICAgICAgaG9zdEVuZCA9IGhlYztcbiAgICB9XG4gICAgLy8gaWYgd2Ugc3RpbGwgaGF2ZSBub3QgaGl0IGl0LCB0aGVuIHRoZSBlbnRpcmUgdGhpbmcgaXMgYSBob3N0LlxuICAgIGlmIChob3N0RW5kID09PSAtMSlcbiAgICAgIGhvc3RFbmQgPSByZXN0Lmxlbmd0aDtcblxuICAgIHRoaXMuaG9zdCA9IHJlc3Quc2xpY2UoMCwgaG9zdEVuZCk7XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoaG9zdEVuZCk7XG5cbiAgICAvLyBwdWxsIG91dCBwb3J0LlxuICAgIHRoaXMucGFyc2VIb3N0KCk7XG5cbiAgICAvLyB3ZSd2ZSBpbmRpY2F0ZWQgdGhhdCB0aGVyZSBpcyBhIGhvc3RuYW1lLFxuICAgIC8vIHNvIGV2ZW4gaWYgaXQncyBlbXB0eSwgaXQgaGFzIHRvIGJlIHByZXNlbnQuXG4gICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUgfHwgJyc7XG5cbiAgICAvLyBpZiBob3N0bmFtZSBiZWdpbnMgd2l0aCBbIGFuZCBlbmRzIHdpdGggXVxuICAgIC8vIGFzc3VtZSB0aGF0IGl0J3MgYW4gSVB2NiBhZGRyZXNzLlxuICAgIHZhciBpcHY2SG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lWzBdID09PSAnWycgJiZcbiAgICAgICAgdGhpcy5ob3N0bmFtZVt0aGlzLmhvc3RuYW1lLmxlbmd0aCAtIDFdID09PSAnXSc7XG5cbiAgICAvLyB2YWxpZGF0ZSBhIGxpdHRsZS5cbiAgICBpZiAoIWlwdjZIb3N0bmFtZSkge1xuICAgICAgdmFyIGhvc3RwYXJ0cyA9IHRoaXMuaG9zdG5hbWUuc3BsaXQoL1xcLi8pO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBob3N0cGFydHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJ0ID0gaG9zdHBhcnRzW2ldO1xuICAgICAgICBpZiAoIXBhcnQpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoIXBhcnQubWF0Y2goaG9zdG5hbWVQYXJ0UGF0dGVybikpIHtcbiAgICAgICAgICB2YXIgbmV3cGFydCA9ICcnO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBrID0gcGFydC5sZW5ndGg7IGogPCBrOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChwYXJ0LmNoYXJDb2RlQXQoaikgPiAxMjcpIHtcbiAgICAgICAgICAgICAgLy8gd2UgcmVwbGFjZSBub24tQVNDSUkgY2hhciB3aXRoIGEgdGVtcG9yYXJ5IHBsYWNlaG9sZGVyXG4gICAgICAgICAgICAgIC8vIHdlIG5lZWQgdGhpcyB0byBtYWtlIHN1cmUgc2l6ZSBvZiBob3N0bmFtZSBpcyBub3RcbiAgICAgICAgICAgICAgLy8gYnJva2VuIGJ5IHJlcGxhY2luZyBub24tQVNDSUkgYnkgbm90aGluZ1xuICAgICAgICAgICAgICBuZXdwYXJ0ICs9ICd4JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5ld3BhcnQgKz0gcGFydFtqXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gd2UgdGVzdCBhZ2FpbiB3aXRoIEFTQ0lJIGNoYXIgb25seVxuICAgICAgICAgIGlmICghbmV3cGFydC5tYXRjaChob3N0bmFtZVBhcnRQYXR0ZXJuKSkge1xuICAgICAgICAgICAgdmFyIHZhbGlkUGFydHMgPSBob3N0cGFydHMuc2xpY2UoMCwgaSk7XG4gICAgICAgICAgICB2YXIgbm90SG9zdCA9IGhvc3RwYXJ0cy5zbGljZShpICsgMSk7XG4gICAgICAgICAgICB2YXIgYml0ID0gcGFydC5tYXRjaChob3N0bmFtZVBhcnRTdGFydCk7XG4gICAgICAgICAgICBpZiAoYml0KSB7XG4gICAgICAgICAgICAgIHZhbGlkUGFydHMucHVzaChiaXRbMV0pO1xuICAgICAgICAgICAgICBub3RIb3N0LnVuc2hpZnQoYml0WzJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub3RIb3N0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXN0ID0gJy8nICsgbm90SG9zdC5qb2luKCcuJykgKyByZXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ob3N0bmFtZSA9IHZhbGlkUGFydHMuam9pbignLicpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaG9zdG5hbWUubGVuZ3RoID4gaG9zdG5hbWVNYXhMZW4pIHtcbiAgICAgIHRoaXMuaG9zdG5hbWUgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaG9zdG5hbWVzIGFyZSBhbHdheXMgbG93ZXIgY2FzZS5cbiAgICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgaWYgKCFpcHY2SG9zdG5hbWUpIHtcbiAgICAgIC8vIElETkEgU3VwcG9ydDogUmV0dXJucyBhIHB1bnljb2RlZCByZXByZXNlbnRhdGlvbiBvZiBcImRvbWFpblwiLlxuICAgICAgLy8gSXQgb25seSBjb252ZXJ0cyBwYXJ0cyBvZiB0aGUgZG9tYWluIG5hbWUgdGhhdFxuICAgICAgLy8gaGF2ZSBub24tQVNDSUkgY2hhcmFjdGVycywgaS5lLiBpdCBkb2Vzbid0IG1hdHRlciBpZlxuICAgICAgLy8geW91IGNhbGwgaXQgd2l0aCBhIGRvbWFpbiB0aGF0IGFscmVhZHkgaXMgQVNDSUktb25seS5cbiAgICAgIHRoaXMuaG9zdG5hbWUgPSBwdW55Y29kZS50b0FTQ0lJKHRoaXMuaG9zdG5hbWUpO1xuICAgIH1cblxuICAgIHZhciBwID0gdGhpcy5wb3J0ID8gJzonICsgdGhpcy5wb3J0IDogJyc7XG4gICAgdmFyIGggPSB0aGlzLmhvc3RuYW1lIHx8ICcnO1xuICAgIHRoaXMuaG9zdCA9IGggKyBwO1xuICAgIHRoaXMuaHJlZiArPSB0aGlzLmhvc3Q7XG5cbiAgICAvLyBzdHJpcCBbIGFuZCBdIGZyb20gdGhlIGhvc3RuYW1lXG4gICAgLy8gdGhlIGhvc3QgZmllbGQgc3RpbGwgcmV0YWlucyB0aGVtLCB0aG91Z2hcbiAgICBpZiAoaXB2Nkhvc3RuYW1lKSB7XG4gICAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZS5zdWJzdHIoMSwgdGhpcy5ob3N0bmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIGlmIChyZXN0WzBdICE9PSAnLycpIHtcbiAgICAgICAgcmVzdCA9ICcvJyArIHJlc3Q7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gbm93IHJlc3QgaXMgc2V0IHRvIHRoZSBwb3N0LWhvc3Qgc3R1ZmYuXG4gIC8vIGNob3Agb2ZmIGFueSBkZWxpbSBjaGFycy5cbiAgaWYgKCF1bnNhZmVQcm90b2NvbFtsb3dlclByb3RvXSkge1xuXG4gICAgLy8gRmlyc3QsIG1ha2UgMTAwJSBzdXJlIHRoYXQgYW55IFwiYXV0b0VzY2FwZVwiIGNoYXJzIGdldFxuICAgIC8vIGVzY2FwZWQsIGV2ZW4gaWYgZW5jb2RlVVJJQ29tcG9uZW50IGRvZXNuJ3QgdGhpbmsgdGhleVxuICAgIC8vIG5lZWQgdG8gYmUuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdXRvRXNjYXBlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIGFlID0gYXV0b0VzY2FwZVtpXTtcbiAgICAgIGlmIChyZXN0LmluZGV4T2YoYWUpID09PSAtMSlcbiAgICAgICAgY29udGludWU7XG4gICAgICB2YXIgZXNjID0gZW5jb2RlVVJJQ29tcG9uZW50KGFlKTtcbiAgICAgIGlmIChlc2MgPT09IGFlKSB7XG4gICAgICAgIGVzYyA9IGVzY2FwZShhZSk7XG4gICAgICB9XG4gICAgICByZXN0ID0gcmVzdC5zcGxpdChhZSkuam9pbihlc2MpO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gY2hvcCBvZmYgZnJvbSB0aGUgdGFpbCBmaXJzdC5cbiAgdmFyIGhhc2ggPSByZXN0LmluZGV4T2YoJyMnKTtcbiAgaWYgKGhhc2ggIT09IC0xKSB7XG4gICAgLy8gZ290IGEgZnJhZ21lbnQgc3RyaW5nLlxuICAgIHRoaXMuaGFzaCA9IHJlc3Quc3Vic3RyKGhhc2gpO1xuICAgIHJlc3QgPSByZXN0LnNsaWNlKDAsIGhhc2gpO1xuICB9XG4gIHZhciBxbSA9IHJlc3QuaW5kZXhPZignPycpO1xuICBpZiAocW0gIT09IC0xKSB7XG4gICAgdGhpcy5zZWFyY2ggPSByZXN0LnN1YnN0cihxbSk7XG4gICAgdGhpcy5xdWVyeSA9IHJlc3Quc3Vic3RyKHFtICsgMSk7XG4gICAgaWYgKHBhcnNlUXVlcnlTdHJpbmcpIHtcbiAgICAgIHRoaXMucXVlcnkgPSBxdWVyeXN0cmluZy5wYXJzZSh0aGlzLnF1ZXJ5KTtcbiAgICB9XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoMCwgcW0pO1xuICB9IGVsc2UgaWYgKHBhcnNlUXVlcnlTdHJpbmcpIHtcbiAgICAvLyBubyBxdWVyeSBzdHJpbmcsIGJ1dCBwYXJzZVF1ZXJ5U3RyaW5nIHN0aWxsIHJlcXVlc3RlZFxuICAgIHRoaXMuc2VhcmNoID0gJyc7XG4gICAgdGhpcy5xdWVyeSA9IHt9O1xuICB9XG4gIGlmIChyZXN0KSB0aGlzLnBhdGhuYW1lID0gcmVzdDtcbiAgaWYgKHNsYXNoZWRQcm90b2NvbFtsb3dlclByb3RvXSAmJlxuICAgICAgdGhpcy5ob3N0bmFtZSAmJiAhdGhpcy5wYXRobmFtZSkge1xuICAgIHRoaXMucGF0aG5hbWUgPSAnLyc7XG4gIH1cblxuICAvL3RvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gIGlmICh0aGlzLnBhdGhuYW1lIHx8IHRoaXMuc2VhcmNoKSB7XG4gICAgdmFyIHAgPSB0aGlzLnBhdGhuYW1lIHx8ICcnO1xuICAgIHZhciBzID0gdGhpcy5zZWFyY2ggfHwgJyc7XG4gICAgdGhpcy5wYXRoID0gcCArIHM7XG4gIH1cblxuICAvLyBmaW5hbGx5LCByZWNvbnN0cnVjdCB0aGUgaHJlZiBiYXNlZCBvbiB3aGF0IGhhcyBiZWVuIHZhbGlkYXRlZC5cbiAgdGhpcy5ocmVmID0gdGhpcy5mb3JtYXQoKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBmb3JtYXQgYSBwYXJzZWQgb2JqZWN0IGludG8gYSB1cmwgc3RyaW5nXG5mdW5jdGlvbiB1cmxGb3JtYXQob2JqKSB7XG4gIC8vIGVuc3VyZSBpdCdzIGFuIG9iamVjdCwgYW5kIG5vdCBhIHN0cmluZyB1cmwuXG4gIC8vIElmIGl0J3MgYW4gb2JqLCB0aGlzIGlzIGEgbm8tb3AuXG4gIC8vIHRoaXMgd2F5LCB5b3UgY2FuIGNhbGwgdXJsX2Zvcm1hdCgpIG9uIHN0cmluZ3NcbiAgLy8gdG8gY2xlYW4gdXAgcG90ZW50aWFsbHkgd29ua3kgdXJscy5cbiAgaWYgKHV0aWwuaXNTdHJpbmcob2JqKSkgb2JqID0gdXJsUGFyc2Uob2JqKTtcbiAgaWYgKCEob2JqIGluc3RhbmNlb2YgVXJsKSkgcmV0dXJuIFVybC5wcm90b3R5cGUuZm9ybWF0LmNhbGwob2JqKTtcbiAgcmV0dXJuIG9iai5mb3JtYXQoKTtcbn1cblxuVXJsLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGF1dGggPSB0aGlzLmF1dGggfHwgJyc7XG4gIGlmIChhdXRoKSB7XG4gICAgYXV0aCA9IGVuY29kZVVSSUNvbXBvbmVudChhdXRoKTtcbiAgICBhdXRoID0gYXV0aC5yZXBsYWNlKC8lM0EvaSwgJzonKTtcbiAgICBhdXRoICs9ICdAJztcbiAgfVxuXG4gIHZhciBwcm90b2NvbCA9IHRoaXMucHJvdG9jb2wgfHwgJycsXG4gICAgICBwYXRobmFtZSA9IHRoaXMucGF0aG5hbWUgfHwgJycsXG4gICAgICBoYXNoID0gdGhpcy5oYXNoIHx8ICcnLFxuICAgICAgaG9zdCA9IGZhbHNlLFxuICAgICAgcXVlcnkgPSAnJztcblxuICBpZiAodGhpcy5ob3N0KSB7XG4gICAgaG9zdCA9IGF1dGggKyB0aGlzLmhvc3Q7XG4gIH0gZWxzZSBpZiAodGhpcy5ob3N0bmFtZSkge1xuICAgIGhvc3QgPSBhdXRoICsgKHRoaXMuaG9zdG5hbWUuaW5kZXhPZignOicpID09PSAtMSA/XG4gICAgICAgIHRoaXMuaG9zdG5hbWUgOlxuICAgICAgICAnWycgKyB0aGlzLmhvc3RuYW1lICsgJ10nKTtcbiAgICBpZiAodGhpcy5wb3J0KSB7XG4gICAgICBob3N0ICs9ICc6JyArIHRoaXMucG9ydDtcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5xdWVyeSAmJlxuICAgICAgdXRpbC5pc09iamVjdCh0aGlzLnF1ZXJ5KSAmJlxuICAgICAgT2JqZWN0LmtleXModGhpcy5xdWVyeSkubGVuZ3RoKSB7XG4gICAgcXVlcnkgPSBxdWVyeXN0cmluZy5zdHJpbmdpZnkodGhpcy5xdWVyeSk7XG4gIH1cblxuICB2YXIgc2VhcmNoID0gdGhpcy5zZWFyY2ggfHwgKHF1ZXJ5ICYmICgnPycgKyBxdWVyeSkpIHx8ICcnO1xuXG4gIGlmIChwcm90b2NvbCAmJiBwcm90b2NvbC5zdWJzdHIoLTEpICE9PSAnOicpIHByb3RvY29sICs9ICc6JztcblxuICAvLyBvbmx5IHRoZSBzbGFzaGVkUHJvdG9jb2xzIGdldCB0aGUgLy8uICBOb3QgbWFpbHRvOiwgeG1wcDosIGV0Yy5cbiAgLy8gdW5sZXNzIHRoZXkgaGFkIHRoZW0gdG8gYmVnaW4gd2l0aC5cbiAgaWYgKHRoaXMuc2xhc2hlcyB8fFxuICAgICAgKCFwcm90b2NvbCB8fCBzbGFzaGVkUHJvdG9jb2xbcHJvdG9jb2xdKSAmJiBob3N0ICE9PSBmYWxzZSkge1xuICAgIGhvc3QgPSAnLy8nICsgKGhvc3QgfHwgJycpO1xuICAgIGlmIChwYXRobmFtZSAmJiBwYXRobmFtZS5jaGFyQXQoMCkgIT09ICcvJykgcGF0aG5hbWUgPSAnLycgKyBwYXRobmFtZTtcbiAgfSBlbHNlIGlmICghaG9zdCkge1xuICAgIGhvc3QgPSAnJztcbiAgfVxuXG4gIGlmIChoYXNoICYmIGhhc2guY2hhckF0KDApICE9PSAnIycpIGhhc2ggPSAnIycgKyBoYXNoO1xuICBpZiAoc2VhcmNoICYmIHNlYXJjaC5jaGFyQXQoMCkgIT09ICc/Jykgc2VhcmNoID0gJz8nICsgc2VhcmNoO1xuXG4gIHBhdGhuYW1lID0gcGF0aG5hbWUucmVwbGFjZSgvWz8jXS9nLCBmdW5jdGlvbihtYXRjaCkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQobWF0Y2gpO1xuICB9KTtcbiAgc2VhcmNoID0gc2VhcmNoLnJlcGxhY2UoJyMnLCAnJTIzJyk7XG5cbiAgcmV0dXJuIHByb3RvY29sICsgaG9zdCArIHBhdGhuYW1lICsgc2VhcmNoICsgaGFzaDtcbn07XG5cbmZ1bmN0aW9uIHVybFJlc29sdmUoc291cmNlLCByZWxhdGl2ZSkge1xuICByZXR1cm4gdXJsUGFyc2Uoc291cmNlLCBmYWxzZSwgdHJ1ZSkucmVzb2x2ZShyZWxhdGl2ZSk7XG59XG5cblVybC5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKHJlbGF0aXZlKSB7XG4gIHJldHVybiB0aGlzLnJlc29sdmVPYmplY3QodXJsUGFyc2UocmVsYXRpdmUsIGZhbHNlLCB0cnVlKSkuZm9ybWF0KCk7XG59O1xuXG5mdW5jdGlvbiB1cmxSZXNvbHZlT2JqZWN0KHNvdXJjZSwgcmVsYXRpdmUpIHtcbiAgaWYgKCFzb3VyY2UpIHJldHVybiByZWxhdGl2ZTtcbiAgcmV0dXJuIHVybFBhcnNlKHNvdXJjZSwgZmFsc2UsIHRydWUpLnJlc29sdmVPYmplY3QocmVsYXRpdmUpO1xufVxuXG5VcmwucHJvdG90eXBlLnJlc29sdmVPYmplY3QgPSBmdW5jdGlvbihyZWxhdGl2ZSkge1xuICBpZiAodXRpbC5pc1N0cmluZyhyZWxhdGl2ZSkpIHtcbiAgICB2YXIgcmVsID0gbmV3IFVybCgpO1xuICAgIHJlbC5wYXJzZShyZWxhdGl2ZSwgZmFsc2UsIHRydWUpO1xuICAgIHJlbGF0aXZlID0gcmVsO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IG5ldyBVcmwoKTtcbiAgdmFyIHRrZXlzID0gT2JqZWN0LmtleXModGhpcyk7XG4gIGZvciAodmFyIHRrID0gMDsgdGsgPCB0a2V5cy5sZW5ndGg7IHRrKyspIHtcbiAgICB2YXIgdGtleSA9IHRrZXlzW3RrXTtcbiAgICByZXN1bHRbdGtleV0gPSB0aGlzW3RrZXldO1xuICB9XG5cbiAgLy8gaGFzaCBpcyBhbHdheXMgb3ZlcnJpZGRlbiwgbm8gbWF0dGVyIHdoYXQuXG4gIC8vIGV2ZW4gaHJlZj1cIlwiIHdpbGwgcmVtb3ZlIGl0LlxuICByZXN1bHQuaGFzaCA9IHJlbGF0aXZlLmhhc2g7XG5cbiAgLy8gaWYgdGhlIHJlbGF0aXZlIHVybCBpcyBlbXB0eSwgdGhlbiB0aGVyZSdzIG5vdGhpbmcgbGVmdCB0byBkbyBoZXJlLlxuICBpZiAocmVsYXRpdmUuaHJlZiA9PT0gJycpIHtcbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gaHJlZnMgbGlrZSAvL2Zvby9iYXIgYWx3YXlzIGN1dCB0byB0aGUgcHJvdG9jb2wuXG4gIGlmIChyZWxhdGl2ZS5zbGFzaGVzICYmICFyZWxhdGl2ZS5wcm90b2NvbCkge1xuICAgIC8vIHRha2UgZXZlcnl0aGluZyBleGNlcHQgdGhlIHByb3RvY29sIGZyb20gcmVsYXRpdmVcbiAgICB2YXIgcmtleXMgPSBPYmplY3Qua2V5cyhyZWxhdGl2ZSk7XG4gICAgZm9yICh2YXIgcmsgPSAwOyByayA8IHJrZXlzLmxlbmd0aDsgcmsrKykge1xuICAgICAgdmFyIHJrZXkgPSBya2V5c1tya107XG4gICAgICBpZiAocmtleSAhPT0gJ3Byb3RvY29sJylcbiAgICAgICAgcmVzdWx0W3JrZXldID0gcmVsYXRpdmVbcmtleV07XG4gICAgfVxuXG4gICAgLy91cmxQYXJzZSBhcHBlbmRzIHRyYWlsaW5nIC8gdG8gdXJscyBsaWtlIGh0dHA6Ly93d3cuZXhhbXBsZS5jb21cbiAgICBpZiAoc2xhc2hlZFByb3RvY29sW3Jlc3VsdC5wcm90b2NvbF0gJiZcbiAgICAgICAgcmVzdWx0Lmhvc3RuYW1lICYmICFyZXN1bHQucGF0aG5hbWUpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gcmVzdWx0LnBhdGhuYW1lID0gJy8nO1xuICAgIH1cblxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpZiAocmVsYXRpdmUucHJvdG9jb2wgJiYgcmVsYXRpdmUucHJvdG9jb2wgIT09IHJlc3VsdC5wcm90b2NvbCkge1xuICAgIC8vIGlmIGl0J3MgYSBrbm93biB1cmwgcHJvdG9jb2wsIHRoZW4gY2hhbmdpbmdcbiAgICAvLyB0aGUgcHJvdG9jb2wgZG9lcyB3ZWlyZCB0aGluZ3NcbiAgICAvLyBmaXJzdCwgaWYgaXQncyBub3QgZmlsZTosIHRoZW4gd2UgTVVTVCBoYXZlIGEgaG9zdCxcbiAgICAvLyBhbmQgaWYgdGhlcmUgd2FzIGEgcGF0aFxuICAgIC8vIHRvIGJlZ2luIHdpdGgsIHRoZW4gd2UgTVVTVCBoYXZlIGEgcGF0aC5cbiAgICAvLyBpZiBpdCBpcyBmaWxlOiwgdGhlbiB0aGUgaG9zdCBpcyBkcm9wcGVkLFxuICAgIC8vIGJlY2F1c2UgdGhhdCdzIGtub3duIHRvIGJlIGhvc3RsZXNzLlxuICAgIC8vIGFueXRoaW5nIGVsc2UgaXMgYXNzdW1lZCB0byBiZSBhYnNvbHV0ZS5cbiAgICBpZiAoIXNsYXNoZWRQcm90b2NvbFtyZWxhdGl2ZS5wcm90b2NvbF0pIHtcbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMocmVsYXRpdmUpO1xuICAgICAgZm9yICh2YXIgdiA9IDA7IHYgPCBrZXlzLmxlbmd0aDsgdisrKSB7XG4gICAgICAgIHZhciBrID0ga2V5c1t2XTtcbiAgICAgICAgcmVzdWx0W2tdID0gcmVsYXRpdmVba107XG4gICAgICB9XG4gICAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcmVzdWx0LnByb3RvY29sID0gcmVsYXRpdmUucHJvdG9jb2w7XG4gICAgaWYgKCFyZWxhdGl2ZS5ob3N0ICYmICFob3N0bGVzc1Byb3RvY29sW3JlbGF0aXZlLnByb3RvY29sXSkge1xuICAgICAgdmFyIHJlbFBhdGggPSAocmVsYXRpdmUucGF0aG5hbWUgfHwgJycpLnNwbGl0KCcvJyk7XG4gICAgICB3aGlsZSAocmVsUGF0aC5sZW5ndGggJiYgIShyZWxhdGl2ZS5ob3N0ID0gcmVsUGF0aC5zaGlmdCgpKSk7XG4gICAgICBpZiAoIXJlbGF0aXZlLmhvc3QpIHJlbGF0aXZlLmhvc3QgPSAnJztcbiAgICAgIGlmICghcmVsYXRpdmUuaG9zdG5hbWUpIHJlbGF0aXZlLmhvc3RuYW1lID0gJyc7XG4gICAgICBpZiAocmVsUGF0aFswXSAhPT0gJycpIHJlbFBhdGgudW5zaGlmdCgnJyk7XG4gICAgICBpZiAocmVsUGF0aC5sZW5ndGggPCAyKSByZWxQYXRoLnVuc2hpZnQoJycpO1xuICAgICAgcmVzdWx0LnBhdGhuYW1lID0gcmVsUGF0aC5qb2luKCcvJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wYXRobmFtZSA9IHJlbGF0aXZlLnBhdGhuYW1lO1xuICAgIH1cbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICAgIHJlc3VsdC5ob3N0ID0gcmVsYXRpdmUuaG9zdCB8fCAnJztcbiAgICByZXN1bHQuYXV0aCA9IHJlbGF0aXZlLmF1dGg7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVsYXRpdmUuaG9zdG5hbWUgfHwgcmVsYXRpdmUuaG9zdDtcbiAgICByZXN1bHQucG9ydCA9IHJlbGF0aXZlLnBvcnQ7XG4gICAgLy8gdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAocmVzdWx0LnBhdGhuYW1lIHx8IHJlc3VsdC5zZWFyY2gpIHtcbiAgICAgIHZhciBwID0gcmVzdWx0LnBhdGhuYW1lIHx8ICcnO1xuICAgICAgdmFyIHMgPSByZXN1bHQuc2VhcmNoIHx8ICcnO1xuICAgICAgcmVzdWx0LnBhdGggPSBwICsgcztcbiAgICB9XG4gICAgcmVzdWx0LnNsYXNoZXMgPSByZXN1bHQuc2xhc2hlcyB8fCByZWxhdGl2ZS5zbGFzaGVzO1xuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB2YXIgaXNTb3VyY2VBYnMgPSAocmVzdWx0LnBhdGhuYW1lICYmIHJlc3VsdC5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJyksXG4gICAgICBpc1JlbEFicyA9IChcbiAgICAgICAgICByZWxhdGl2ZS5ob3N0IHx8XG4gICAgICAgICAgcmVsYXRpdmUucGF0aG5hbWUgJiYgcmVsYXRpdmUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLydcbiAgICAgICksXG4gICAgICBtdXN0RW5kQWJzID0gKGlzUmVsQWJzIHx8IGlzU291cmNlQWJzIHx8XG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQuaG9zdCAmJiByZWxhdGl2ZS5wYXRobmFtZSkpLFxuICAgICAgcmVtb3ZlQWxsRG90cyA9IG11c3RFbmRBYnMsXG4gICAgICBzcmNQYXRoID0gcmVzdWx0LnBhdGhuYW1lICYmIHJlc3VsdC5wYXRobmFtZS5zcGxpdCgnLycpIHx8IFtdLFxuICAgICAgcmVsUGF0aCA9IHJlbGF0aXZlLnBhdGhuYW1lICYmIHJlbGF0aXZlLnBhdGhuYW1lLnNwbGl0KCcvJykgfHwgW10sXG4gICAgICBwc3ljaG90aWMgPSByZXN1bHQucHJvdG9jb2wgJiYgIXNsYXNoZWRQcm90b2NvbFtyZXN1bHQucHJvdG9jb2xdO1xuXG4gIC8vIGlmIHRoZSB1cmwgaXMgYSBub24tc2xhc2hlZCB1cmwsIHRoZW4gcmVsYXRpdmVcbiAgLy8gbGlua3MgbGlrZSAuLi8uLiBzaG91bGQgYmUgYWJsZVxuICAvLyB0byBjcmF3bCB1cCB0byB0aGUgaG9zdG5hbWUsIGFzIHdlbGwuICBUaGlzIGlzIHN0cmFuZ2UuXG4gIC8vIHJlc3VsdC5wcm90b2NvbCBoYXMgYWxyZWFkeSBiZWVuIHNldCBieSBub3cuXG4gIC8vIExhdGVyIG9uLCBwdXQgdGhlIGZpcnN0IHBhdGggcGFydCBpbnRvIHRoZSBob3N0IGZpZWxkLlxuICBpZiAocHN5Y2hvdGljKSB7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gJyc7XG4gICAgcmVzdWx0LnBvcnQgPSBudWxsO1xuICAgIGlmIChyZXN1bHQuaG9zdCkge1xuICAgICAgaWYgKHNyY1BhdGhbMF0gPT09ICcnKSBzcmNQYXRoWzBdID0gcmVzdWx0Lmhvc3Q7XG4gICAgICBlbHNlIHNyY1BhdGgudW5zaGlmdChyZXN1bHQuaG9zdCk7XG4gICAgfVxuICAgIHJlc3VsdC5ob3N0ID0gJyc7XG4gICAgaWYgKHJlbGF0aXZlLnByb3RvY29sKSB7XG4gICAgICByZWxhdGl2ZS5ob3N0bmFtZSA9IG51bGw7XG4gICAgICByZWxhdGl2ZS5wb3J0ID0gbnVsbDtcbiAgICAgIGlmIChyZWxhdGl2ZS5ob3N0KSB7XG4gICAgICAgIGlmIChyZWxQYXRoWzBdID09PSAnJykgcmVsUGF0aFswXSA9IHJlbGF0aXZlLmhvc3Q7XG4gICAgICAgIGVsc2UgcmVsUGF0aC51bnNoaWZ0KHJlbGF0aXZlLmhvc3QpO1xuICAgICAgfVxuICAgICAgcmVsYXRpdmUuaG9zdCA9IG51bGw7XG4gICAgfVxuICAgIG11c3RFbmRBYnMgPSBtdXN0RW5kQWJzICYmIChyZWxQYXRoWzBdID09PSAnJyB8fCBzcmNQYXRoWzBdID09PSAnJyk7XG4gIH1cblxuICBpZiAoaXNSZWxBYnMpIHtcbiAgICAvLyBpdCdzIGFic29sdXRlLlxuICAgIHJlc3VsdC5ob3N0ID0gKHJlbGF0aXZlLmhvc3QgfHwgcmVsYXRpdmUuaG9zdCA9PT0gJycpID9cbiAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLmhvc3QgOiByZXN1bHQuaG9zdDtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSAocmVsYXRpdmUuaG9zdG5hbWUgfHwgcmVsYXRpdmUuaG9zdG5hbWUgPT09ICcnKSA/XG4gICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUuaG9zdG5hbWUgOiByZXN1bHQuaG9zdG5hbWU7XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICBzcmNQYXRoID0gcmVsUGF0aDtcbiAgICAvLyBmYWxsIHRocm91Z2ggdG8gdGhlIGRvdC1oYW5kbGluZyBiZWxvdy5cbiAgfSBlbHNlIGlmIChyZWxQYXRoLmxlbmd0aCkge1xuICAgIC8vIGl0J3MgcmVsYXRpdmVcbiAgICAvLyB0aHJvdyBhd2F5IHRoZSBleGlzdGluZyBmaWxlLCBhbmQgdGFrZSB0aGUgbmV3IHBhdGggaW5zdGVhZC5cbiAgICBpZiAoIXNyY1BhdGgpIHNyY1BhdGggPSBbXTtcbiAgICBzcmNQYXRoLnBvcCgpO1xuICAgIHNyY1BhdGggPSBzcmNQYXRoLmNvbmNhdChyZWxQYXRoKTtcbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICB9IGVsc2UgaWYgKCF1dGlsLmlzTnVsbE9yVW5kZWZpbmVkKHJlbGF0aXZlLnNlYXJjaCkpIHtcbiAgICAvLyBqdXN0IHB1bGwgb3V0IHRoZSBzZWFyY2guXG4gICAgLy8gbGlrZSBocmVmPSc/Zm9vJy5cbiAgICAvLyBQdXQgdGhpcyBhZnRlciB0aGUgb3RoZXIgdHdvIGNhc2VzIGJlY2F1c2UgaXQgc2ltcGxpZmllcyB0aGUgYm9vbGVhbnNcbiAgICBpZiAocHN5Y2hvdGljKSB7XG4gICAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdCA9IHNyY1BhdGguc2hpZnQoKTtcbiAgICAgIC8vb2NjYXRpb25hbHkgdGhlIGF1dGggY2FuIGdldCBzdHVjayBvbmx5IGluIGhvc3RcbiAgICAgIC8vdGhpcyBlc3BlY2lhbGx5IGhhcHBlbnMgaW4gY2FzZXMgbGlrZVxuICAgICAgLy91cmwucmVzb2x2ZU9iamVjdCgnbWFpbHRvOmxvY2FsMUBkb21haW4xJywgJ2xvY2FsMkBkb21haW4yJylcbiAgICAgIHZhciBhdXRoSW5Ib3N0ID0gcmVzdWx0Lmhvc3QgJiYgcmVzdWx0Lmhvc3QuaW5kZXhPZignQCcpID4gMCA/XG4gICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5ob3N0LnNwbGl0KCdAJykgOiBmYWxzZTtcbiAgICAgIGlmIChhdXRoSW5Ib3N0KSB7XG4gICAgICAgIHJlc3VsdC5hdXRoID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgICAgICByZXN1bHQuaG9zdCA9IHJlc3VsdC5ob3N0bmFtZSA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICAvL3RvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKCF1dGlsLmlzTnVsbChyZXN1bHQucGF0aG5hbWUpIHx8ICF1dGlsLmlzTnVsbChyZXN1bHQuc2VhcmNoKSkge1xuICAgICAgcmVzdWx0LnBhdGggPSAocmVzdWx0LnBhdGhuYW1lID8gcmVzdWx0LnBhdGhuYW1lIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5zZWFyY2ggPyByZXN1bHQuc2VhcmNoIDogJycpO1xuICAgIH1cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKCFzcmNQYXRoLmxlbmd0aCkge1xuICAgIC8vIG5vIHBhdGggYXQgYWxsLiAgZWFzeS5cbiAgICAvLyB3ZSd2ZSBhbHJlYWR5IGhhbmRsZWQgdGhlIG90aGVyIHN0dWZmIGFib3ZlLlxuICAgIHJlc3VsdC5wYXRobmFtZSA9IG51bGw7XG4gICAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmIChyZXN1bHQuc2VhcmNoKSB7XG4gICAgICByZXN1bHQucGF0aCA9ICcvJyArIHJlc3VsdC5zZWFyY2g7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gbnVsbDtcbiAgICB9XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGlmIGEgdXJsIEVORHMgaW4gLiBvciAuLiwgdGhlbiBpdCBtdXN0IGdldCBhIHRyYWlsaW5nIHNsYXNoLlxuICAvLyBob3dldmVyLCBpZiBpdCBlbmRzIGluIGFueXRoaW5nIGVsc2Ugbm9uLXNsYXNoeSxcbiAgLy8gdGhlbiBpdCBtdXN0IE5PVCBnZXQgYSB0cmFpbGluZyBzbGFzaC5cbiAgdmFyIGxhc3QgPSBzcmNQYXRoLnNsaWNlKC0xKVswXTtcbiAgdmFyIGhhc1RyYWlsaW5nU2xhc2ggPSAoXG4gICAgICAocmVzdWx0Lmhvc3QgfHwgcmVsYXRpdmUuaG9zdCB8fCBzcmNQYXRoLmxlbmd0aCA+IDEpICYmXG4gICAgICAobGFzdCA9PT0gJy4nIHx8IGxhc3QgPT09ICcuLicpIHx8IGxhc3QgPT09ICcnKTtcblxuICAvLyBzdHJpcCBzaW5nbGUgZG90cywgcmVzb2x2ZSBkb3VibGUgZG90cyB0byBwYXJlbnQgZGlyXG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBzcmNQYXRoLmxlbmd0aDsgaSA+PSAwOyBpLS0pIHtcbiAgICBsYXN0ID0gc3JjUGF0aFtpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHNyY1BhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoIW11c3RFbmRBYnMgJiYgIXJlbW92ZUFsbERvdHMpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHNyY1BhdGgudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICBpZiAobXVzdEVuZEFicyAmJiBzcmNQYXRoWzBdICE9PSAnJyAmJlxuICAgICAgKCFzcmNQYXRoWzBdIHx8IHNyY1BhdGhbMF0uY2hhckF0KDApICE9PSAnLycpKSB7XG4gICAgc3JjUGF0aC51bnNoaWZ0KCcnKTtcbiAgfVxuXG4gIGlmIChoYXNUcmFpbGluZ1NsYXNoICYmIChzcmNQYXRoLmpvaW4oJy8nKS5zdWJzdHIoLTEpICE9PSAnLycpKSB7XG4gICAgc3JjUGF0aC5wdXNoKCcnKTtcbiAgfVxuXG4gIHZhciBpc0Fic29sdXRlID0gc3JjUGF0aFswXSA9PT0gJycgfHxcbiAgICAgIChzcmNQYXRoWzBdICYmIHNyY1BhdGhbMF0uY2hhckF0KDApID09PSAnLycpO1xuXG4gIC8vIHB1dCB0aGUgaG9zdCBiYWNrXG4gIGlmIChwc3ljaG90aWMpIHtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdCA9IGlzQWJzb2x1dGUgPyAnJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmNQYXRoLmxlbmd0aCA/IHNyY1BhdGguc2hpZnQoKSA6ICcnO1xuICAgIC8vb2NjYXRpb25hbHkgdGhlIGF1dGggY2FuIGdldCBzdHVjayBvbmx5IGluIGhvc3RcbiAgICAvL3RoaXMgZXNwZWNpYWxseSBoYXBwZW5zIGluIGNhc2VzIGxpa2VcbiAgICAvL3VybC5yZXNvbHZlT2JqZWN0KCdtYWlsdG86bG9jYWwxQGRvbWFpbjEnLCAnbG9jYWwyQGRvbWFpbjInKVxuICAgIHZhciBhdXRoSW5Ib3N0ID0gcmVzdWx0Lmhvc3QgJiYgcmVzdWx0Lmhvc3QuaW5kZXhPZignQCcpID4gMCA/XG4gICAgICAgICAgICAgICAgICAgICByZXN1bHQuaG9zdC5zcGxpdCgnQCcpIDogZmFsc2U7XG4gICAgaWYgKGF1dGhJbkhvc3QpIHtcbiAgICAgIHJlc3VsdC5hdXRoID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgICAgcmVzdWx0Lmhvc3QgPSByZXN1bHQuaG9zdG5hbWUgPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgfVxuICB9XG5cbiAgbXVzdEVuZEFicyA9IG11c3RFbmRBYnMgfHwgKHJlc3VsdC5ob3N0ICYmIHNyY1BhdGgubGVuZ3RoKTtcblxuICBpZiAobXVzdEVuZEFicyAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHNyY1BhdGgudW5zaGlmdCgnJyk7XG4gIH1cblxuICBpZiAoIXNyY1BhdGgubGVuZ3RoKSB7XG4gICAgcmVzdWx0LnBhdGhuYW1lID0gbnVsbDtcbiAgICByZXN1bHQucGF0aCA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0LnBhdGhuYW1lID0gc3JjUGF0aC5qb2luKCcvJyk7XG4gIH1cblxuICAvL3RvIHN1cHBvcnQgcmVxdWVzdC5odHRwXG4gIGlmICghdXRpbC5pc051bGwocmVzdWx0LnBhdGhuYW1lKSB8fCAhdXRpbC5pc051bGwocmVzdWx0LnNlYXJjaCkpIHtcbiAgICByZXN1bHQucGF0aCA9IChyZXN1bHQucGF0aG5hbWUgPyByZXN1bHQucGF0aG5hbWUgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHJlc3VsdC5zZWFyY2ggPyByZXN1bHQuc2VhcmNoIDogJycpO1xuICB9XG4gIHJlc3VsdC5hdXRoID0gcmVsYXRpdmUuYXV0aCB8fCByZXN1bHQuYXV0aDtcbiAgcmVzdWx0LnNsYXNoZXMgPSByZXN1bHQuc2xhc2hlcyB8fCByZWxhdGl2ZS5zbGFzaGVzO1xuICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblVybC5wcm90b3R5cGUucGFyc2VIb3N0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBob3N0ID0gdGhpcy5ob3N0O1xuICB2YXIgcG9ydCA9IHBvcnRQYXR0ZXJuLmV4ZWMoaG9zdCk7XG4gIGlmIChwb3J0KSB7XG4gICAgcG9ydCA9IHBvcnRbMF07XG4gICAgaWYgKHBvcnQgIT09ICc6Jykge1xuICAgICAgdGhpcy5wb3J0ID0gcG9ydC5zdWJzdHIoMSk7XG4gICAgfVxuICAgIGhvc3QgPSBob3N0LnN1YnN0cigwLCBob3N0Lmxlbmd0aCAtIHBvcnQubGVuZ3RoKTtcbiAgfVxuICBpZiAoaG9zdCkgdGhpcy5ob3N0bmFtZSA9IGhvc3Q7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNTdHJpbmc6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB0eXBlb2YoYXJnKSA9PT0gJ3N0cmluZyc7XG4gIH0sXG4gIGlzT2JqZWN0OiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mKGFyZykgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbiAgfSxcbiAgaXNOdWxsOiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gYXJnID09PSBudWxsO1xuICB9LFxuICBpc051bGxPclVuZGVmaW5lZDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGFyZyA9PSBudWxsO1xuICB9XG59O1xuIiwiY29uc3QgcGFyc2UgPSByZXF1aXJlKFwidXJsXCIpLnBhcnNlXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjbGVhbixcbiAgcGFnZSxcbiAgcHJvdG9jb2wsXG4gIGhvc3RuYW1lLFxuICBub3JtYWxpemUsXG4gIGlzU2VhcmNoUXVlcnksXG4gIGlzVVJMXG59XG5cbmZ1bmN0aW9uIHByb3RvY29sICh1cmwpIHtcbiAgY29uc3QgbWF0Y2ggPSB1cmwubWF0Y2goLyheXFx3Kyk6XFwvXFwvLylcbiAgaWYgKG1hdGNoKSB7XG4gICAgcmV0dXJuIG1hdGNoWzFdXG4gIH1cblxuICByZXR1cm4gJ2h0dHAnXG59XG5cbmZ1bmN0aW9uIGNsZWFuICh1cmwpIHtcbiAgcmV0dXJuIGNsZWFuVVRNKHVybClcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL15cXHcrOlxcL1xcLy8sICcnKVxuICAgIC5yZXBsYWNlKC9eW1xcdy1fXSs6W1xcdy1fXStALywgJycpXG4gICAgLnJlcGxhY2UoLyMuKiQvLCAnJylcbiAgICAucmVwbGFjZSgvKFxcL3xcXD98XFwmfCMpKiQvLCAnJylcbiAgICAucmVwbGFjZSgvXFwvXFw/LywgJz8nKVxuICAgIC5yZXBsYWNlKC9ed3d3XFwuLywgJycpXG59XG5cbmZ1bmN0aW9uIHBhZ2UgKHVybCkge1xuICByZXR1cm4gY2xlYW4odXJsLnJlcGxhY2UoL1xcIy4qJC8sICcnKSlcbn1cblxuZnVuY3Rpb24gaG9zdG5hbWUgKHVybCkge1xuICByZXR1cm4gcGFyc2Uobm9ybWFsaXplKHVybCkpLmhvc3RuYW1lLnJlcGxhY2UoL153d3dcXC4vLCAnJylcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplIChpbnB1dCkge1xuICBpZiAoaW5wdXQudHJpbSgpLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG5cbiAgaWYgKGlzU2VhcmNoUXVlcnkoaW5wdXQpKSB7XG4gICAgcmV0dXJuIGBodHRwczovL2dvb2dsZS5jb20vc2VhcmNoP3E9JHtlbmNvZGVVUkkoaW5wdXQpfWBcbiAgfVxuXG4gIGlmICghL15cXHcrOlxcL1xcLy8udGVzdChpbnB1dCkpIHtcbiAgICByZXR1cm4gYGh0dHA6Ly8ke2lucHV0fWBcbiAgfVxuXG4gIHJldHVybiBpbnB1dFxufVxuXG5mdW5jdGlvbiBpc1NlYXJjaFF1ZXJ5IChpbnB1dCkge1xuICByZXR1cm4gIWlzVVJMKGlucHV0LnRyaW0oKSlcbn1cblxuZnVuY3Rpb24gaXNVUkwgKGlucHV0KSB7XG4gIHJldHVybiBpbnB1dC5pbmRleE9mKCcgJykgPT09IC0xICYmICgvXlxcdys6XFwvXFwvLy50ZXN0KGlucHV0KSB8fCBpbnB1dC5pbmRleE9mKCcuJykgPiAwIHx8IGlucHV0LmluZGV4T2YoJzonKSA+IDApXG59XG5cbmZ1bmN0aW9uIGNsZWFuVVRNICh1cmwpIHtcbiAgcmV0dXJuIHVybFxuICAgIC5yZXBsYWNlKC8oXFw/fFxcJil1dG1fW1xcd10rXFw9W15cXCZdKy9nLCAnJDEnKVxuICAgIC5yZXBsYWNlKC8oXFw/fFxcJilyZWZcXD1bXlxcJl0rXFwmPy8sICckMScpXG4gICAgLnJlcGxhY2UoL1tcXCZdezIsfS8sJyYnKVxuICAgIC5yZXBsYWNlKCc/JicsICc/Jylcbn1cbiJdfQ==
