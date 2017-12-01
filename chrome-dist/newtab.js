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

},{}],2:[function(require,module,exports){
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

  function BookmarkSearch(props) {
    _classCallCheck(this, BookmarkSearch);

    var _this = _possibleConstructorReturn(this, (BookmarkSearch.__proto__ || Object.getPrototypeOf(BookmarkSearch)).call(this, props));

    _this.name = 'bookmark-search';
    _this.title = 'Liked in Kozmos';
    return _this;
  }

  _createClass(BookmarkSearch, [{
    key: 'update',
    value: function update(query) {
      var _this2 = this;

      if (query.length == 0) return this.setState({
        rows: []
      });

      this.setState({
        loading: true
      });

      this.props.messages.send({ task: 'search-bookmarks', query: query }, function (resp) {
        _this2.setState({ loading: false });

        if (resp.error) return _this2.setState({
          error: resp.error
        });

        var rows = resp.content.results.likes;

        _this2.setState({
          rows: rows.slice(0, _this2.max(rows.length)).map(function (row) {
            return _this2.mapEach(row);
          })
        });
      });
    }
  }]);

  return BookmarkSearch;
}(_rows2.default);

exports.default = BookmarkSearch;

},{"./rows":11}],3:[function(require,module,exports){
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

},{"preact":26}],4:[function(require,module,exports){
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

  function History(props) {
    _classCallCheck(this, History);

    var _this = _possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).call(this, props));

    _this.name = 'history';
    _this.title = 'Previously Visited';
    return _this;
  }

  _createClass(History, [{
    key: 'update',
    value: function update(query) {
      var _this2 = this;

      if (query.length === 0) return this.setState({ rows: [] });

      this.setState({
        loading: true
      });

      chrome.history.search({ text: query }, function (history) {
        var rows = history.filter(filterOutSearch);

        _this2.setState({
          loading: false,
          rows: rows.slice(0, _this2.max(rows.length)).map(function (row) {
            return _this2.mapEach(row);
          })
        });
      });
    }
  }]);

  return History;
}(_rows2.default);

exports.default = History;


function filterOutSearch(row) {
  return (0, _urlImage.findHostname)(row.url).split('.')[0] !== 'google' && !/search\/?\?q\=\w*/.test(row.url);
}

},{"./rows":11,"./url-image":19}],5:[function(require,module,exports){
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
      var method = this['render' + this.props.name.slice(0, 1).toUpperCase(0, 1) + this.props.name.slice(1)].bind(this);

      if (method) {
        return (0, _preact.h)(
          "div",
          _extends({ className: "icon icon-" + this.props.name }, this.props),
          method()
        );
      }
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
      return (0, _preact.h)("img", { src: "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDUxMCA1MTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMCA1MTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iZmF2b3JpdGUiPgoJCTxwYXRoIGQ9Ik0yNTUsNDg5LjZsLTM1LjctMzUuN0M4Ni43LDMzNi42LDAsMjU3LjU1LDAsMTYwLjY1QzAsODEuNiw2MS4yLDIwLjQsMTQwLjI1LDIwLjRjNDMuMzUsMCw4Ni43LDIwLjQsMTE0Ljc1LDUzLjU1ICAgIEMyODMuMDUsNDAuOCwzMjYuNCwyMC40LDM2OS43NSwyMC40QzQ0OC44LDIwLjQsNTEwLDgxLjYsNTEwLDE2MC42NWMwLDk2LjktODYuNywxNzUuOTUtMjE5LjMsMjkzLjI1TDI1NSw0ODkuNnoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" });
    }
  }, {
    key: "renderRedHeart",
    value: function renderRedHeart() {
      return (0, _preact.h)("img", { src: "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDUxMCA1MTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMCA1MTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iZmF2b3JpdGUiPgoJCTxwYXRoIGQ9Ik0yNTUsNDg5LjZsLTM1LjctMzUuN0M4Ni43LDMzNi42LDAsMjU3LjU1LDAsMTYwLjY1QzAsODEuNiw2MS4yLDIwLjQsMTQwLjI1LDIwLjRjNDMuMzUsMCw4Ni43LDIwLjQsMTE0Ljc1LDUzLjU1ICAgIEMyODMuMDUsNDAuOCwzMjYuNCwyMC40LDM2OS43NSwyMC40QzQ0OC44LDIwLjQsNTEwLDgxLjYsNTEwLDE2MC42NWMwLDk2LjktODYuNywxNzUuOTUtMjE5LjMsMjkzLjI1TDI1NSw0ODkuNnoiIGZpbGw9IiNlMzJhMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" });
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
        { id: "i-chevron-right", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2" },
        (0, _preact.h)("path", { d: "M12 30 L24 16 12 2" })
      );
    }
  }]);

  return Icon;
}(_preact.Component);

exports.default = Icon;

},{"preact":26}],6:[function(require,module,exports){
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

},{"preact":26}],7:[function(require,module,exports){
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

},{"preact":26}],8:[function(require,module,exports){
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

},{"../lib/messaging":1}],9:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _wallpaper = require("./wallpaper");

var _wallpaper2 = _interopRequireDefault(_wallpaper);

var _menu = require("./menu");

var _menu2 = _interopRequireDefault(_menu);

var _wallpapers = require("./wallpapers");

var _wallpapers2 = _interopRequireDefault(_wallpapers);

var _search = require("./search");

var _search2 = _interopRequireDefault(_search);

var _logo = require("./logo");

var _logo2 = _interopRequireDefault(_logo);

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
        (0, _preact.h)(_logo2.default, null),
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

},{"./logo":6,"./menu":7,"./search":13,"./settings":14,"./wallpaper":20,"./wallpapers":21,"preact":26}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

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

  function QuerySuggestions(props) {
    _classCallCheck(this, QuerySuggestions);

    var _this = _possibleConstructorReturn(this, (QuerySuggestions.__proto__ || Object.getPrototypeOf(QuerySuggestions)).call(this, props));

    _this.type = 'query-suggestions';
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
      var _this2 = this;

      if (query.length === 0) return this.setState({ rows: [] });

      var rows = this.createURLSuggestions(query).concat(this.createSearchSuggestions(query)).map(function (row) {
        return _this2.mapEach(row);
      });

      this.setState({
        rows: rows.slice(0, this.max(rows.length))
      });
    }
  }]);

  return QuerySuggestions;
}(_rows2.default);

exports.default = QuerySuggestions;


function isURL(query) {
  return query.trim().indexOf('.') > 0 && query.indexOf(' ') === -1;
}

},{"./rows":11,"preact":26,"title-from-url":34}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _urlIcon = require("./url-icon");

var _urlIcon2 = _interopRequireDefault(_urlIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rows = function (_Component) {
  _inherits(Rows, _Component);

  function Rows(props) {
    _classCallCheck(this, Rows);

    var _this = _possibleConstructorReturn(this, (Rows.__proto__ || Object.getPrototypeOf(Rows)).call(this, props));

    _this.setState({ rows: [] });
    _this.update(props.query);
    return _this;
  }

  _createClass(Rows, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.props.query !== nextProps.query || !this.state.rows || this.state.rows.length !== nextState.rows.length) {
        return true;
      }

      if (!this.props.selected && nextProps.selected || this.props.selected && !nextProps.selected || this.props.selected && nextProps.selected && this.props.selected.id !== nextProps.selected.id) {
        return true;
      }

      var i = Math.min(5, this.state.rows.length);
      while (i--) {
        if (this.state.rows[i].url !== nextState.rows[i].url) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      if (this.props.query !== props.query) {
        this.update(props.query);
      }
    }
  }, {
    key: "mapEach",
    value: function mapEach(row) {
      row.type = this.name;
      row.id = this.props.id(row);
      this.props.mapRow(row);
      return row;
    }
  }, {
    key: "max",
    value: function max(count) {
      return this.props.reserveRows(count, this.type);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      if (this.state.rows.length === 0) return;

      return (0, _preact.h)(
        "div",
        { className: "rows" },
        this.title ? (0, _preact.h)(
          "div",
          { className: "title" },
          (0, _preact.h)(
            "h1",
            null,
            this.title
          )
        ) : null,
        (0, _preact.h)(
          "div",
          { className: "rows-content" },
          this.state.rows.map(function (row) {
            return _this2.renderRow(row);
          })
        )
      );
    }
  }, {
    key: "renderRow",
    value: function renderRow(row) {
      if (!this.props.selected && row.id === 1) {
        this.props.onSelect(row);
      }

      return (0, _preact.h)(_urlIcon2.default, { content: row,
        onSelect: this.props.onSelect,
        selected: this.props.selected && this.props.selected.id == row.id
      });
    }
  }]);

  return Rows;
}(_preact.Component);

exports.default = Rows;

},{"./url-icon":18,"preact":26}],12:[function(require,module,exports){
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
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextState.value !== this.state.value;
    }
  }, {
    key: "onQueryChange",
    value: function onQueryChange(value, keyCode) {
      if (keyCode === 13) {
        return this.props.onPressEnter(value);
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

      return (0, _preact.h)("input", { ref: function ref(el) {
          return _this3.input = el;
        },
        type: "text",
        className: "input",
        placeholder: "What are you looking for?",
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

},{"./icon":5,"preact":26}],13:[function(require,module,exports){
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

var _messaging = require("./messaging");

var _messaging2 = _interopRequireDefault(_messaging);

var _searchInput = require("./search-input");

var _searchInput2 = _interopRequireDefault(_searchInput);

var _urlIcon = require("./url-icon");

var _urlIcon2 = _interopRequireDefault(_urlIcon);

var _topSites = require("./top-sites");

var _topSites2 = _interopRequireDefault(_topSites);

var _querySuggestions = require("./query-suggestions");

var _querySuggestions2 = _interopRequireDefault(_querySuggestions);

var _bookmarkSearch = require("./bookmark-search");

var _bookmarkSearch2 = _interopRequireDefault(_bookmarkSearch);

var _sidebar = require("./sidebar");

var _sidebar2 = _interopRequireDefault(_sidebar);

var _history = require("./history");

var _history2 = _interopRequireDefault(_history);

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
      query: ''
    });

    _this._onKeyPress = (0, _debounceFn2.default)(_this.onKeyPress.bind(_this), 50);
    _this._onQueryChange = (0, _debounceFn2.default)(_this.onQueryChange.bind(_this));
    return _this;
  }

  _createClass(Search, [{
    key: "id",
    value: function id() {
      return ++this.state.id;
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
    key: "mapRow",
    value: function mapRow(row) {
      this.state.rows[row.id] = row;
    }
  }, {
    key: "selectNext",
    value: function selectNext() {
      var id = this.state.selected ? this.state.selected.id : 0;
      if (id == 5) id = 0;

      this.setState({
        selected: this.state.rows[id + 1]
      });
    }
  }, {
    key: "selectPrevious",
    value: function selectPrevious() {
      var id = this.state.selected ? this.state.selected.id : 6;
      if (id == 1) id = 6;

      this.setState({
        selected: this.state.rows[id - 1]
      });
    }
  }, {
    key: "reserveRows",
    value: function reserveRows(count) {
      var left = this.state.rowsAvailable - count;

      this.setState({
        rowsAvailable: Math.max(left, 0)
      });

      return left < 0 ? count + left : count;
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
    key: "onPressEnter",
    value: function onPressEnter() {
      if (this.state.selected) {
        this.navigateTo(this.state.selected.url);
      }
    }
  }, {
    key: "onKeyPress",
    value: function onKeyPress(e) {
      if (e.keyCode == 40) {
        this.selectNext();
      } else if (e.keyCode == 38) {
        this.selectPrevious();
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

    /*getRecentBookmarks(callback) {
      this.messages.send({ task: 'get-recent-bookmarks' }, resp => {
        if (resp.error) return callback(new Error(resp.error))
        callback(undefined, resp.content.results.likes)
      })
    }
     searchBookmarks(query, callback) {
      this.messages.send({ task: 'search-bookmarks', query }, resp => {
        if (resp.error) return callback(new Error(resp.error))
        if (resp.content.query !== this.state.query) return
        callback(undefined, resp.content.results.likes)
      })
    }*/

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
        { wallpaper: this.props.wallpaper },
        (0, _preact.h)(
          "div",
          { className: "content-inner" },
          (0, _preact.h)(_searchInput2.default, { onPressEnter: function onPressEnter() {
              return _this2.onPressEnter();
            }, onQueryChange: this._onQueryChange }),
          this.renderResults(),
          (0, _preact.h)("div", { className: "clear" })
        )
      );
    }
  }, {
    key: "renderResults",
    value: function renderResults() {
      var _this3 = this;

      return (0, _preact.h)(
        "div",
        { className: "results" },
        (0, _preact.h)(
          "div",
          { className: "results-rows" },
          (0, _preact.h)(_querySuggestions2.default, { query: this.state.query, id: function id() {
              return _this3.id();
            }, onSelect: function onSelect(id) {
              return _this3.onSelect(id);
            }, selected: this.state.selected, reserveRows: function reserveRows(c) {
              return _this3.reserveRows(c);
            }, mapRow: function mapRow(r) {
              return _this3.mapRow(r);
            } }),
          (0, _preact.h)(_topSites2.default, { query: this.state.query, id: function id() {
              return _this3.id();
            }, onSelect: function onSelect(id) {
              return _this3.onSelect(id);
            }, selected: this.state.selected, reserveRows: function reserveRows(c) {
              return _this3.reserveRows(c);
            }, mapRow: function mapRow(r) {
              return _this3.mapRow(r);
            } }),
          (0, _preact.h)(_bookmarkSearch2.default, { messages: this.messages, query: this.state.query, id: function id() {
              return _this3.id();
            }, onSelect: function onSelect(id) {
              return _this3.onSelect(id);
            }, selected: this.state.selected, reserveRows: function reserveRows(c) {
              return _this3.reserveRows(c);
            }, mapRow: function mapRow(r) {
              return _this3.mapRow(r);
            } }),
          (0, _preact.h)(_history2.default, { query: this.state.query, id: function id() {
              return _this3.id();
            }, onSelect: function onSelect(id) {
              return _this3.onSelect(id);
            }, selected: this.state.selected, reserveRows: function reserveRows(c) {
              return _this3.reserveRows(c);
            }, mapRow: function mapRow(r) {
              return _this3.mapRow(r);
            } })
        ),
        (0, _preact.h)(_sidebar2.default, { selected: this.state.selected, messages: this.messages, onUpdateTopSites: function onUpdateTopSites() {
            return _this3.onUpdateTopSites();
          } }),
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

},{"./bookmark-search":2,"./content":3,"./history":4,"./messaging":8,"./query-suggestions":10,"./search-input":12,"./sidebar":15,"./top-sites":17,"./url-icon":18,"debounce-fn":22,"preact":26}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _icon = require("../popup/icon");

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Settings = function (_Component) {
  _inherits(Settings, _Component);

  function Settings() {
    _classCallCheck(this, Settings);

    return _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).apply(this, arguments));
  }

  _createClass(Settings, [{
    key: "render",
    value: function render() {
      return (0, _preact.h)(
        "div",
        { className: "settings " + (this.props.open ? "open" : "") },
        (0, _preact.h)(_icon2.default, { name: "options" })
      );
    }
  }]);

  return Settings;
}(_preact.Component);

exports.default = Settings;

},{"../popup/icon":41,"preact":26}],15:[function(require,module,exports){
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

    /*shouldComponentUpdate(nextProps, nextState) {
      return this.props.selected.url !== nextProps.selected.url
      }*/

  }, {
    key: "deleteTopSite",
    value: function deleteTopSite() {
      (0, _topSites.hide)(this.props.selected.url);
      this.props.onUpdateTopSites();
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
        (0, _preact.h)(_icon2.default, { name: this.state.like ? "redHeart" : "heart" }),
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

},{"./icon":5,"./top-sites":17,"./url-image":19,"preact":26,"relative-date":32,"urls":40}],16:[function(require,module,exports){
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

},{"title-from-url":34}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.get = get;
exports.hide = hide;

var _preact = require("preact");

var _rows = require("./rows");

var _rows2 = _interopRequireDefault(_rows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TopSites = function (_Rows) {
  _inherits(TopSites, _Rows);

  function TopSites(props) {
    _classCallCheck(this, TopSites);

    var _this = _possibleConstructorReturn(this, (TopSites.__proto__ || Object.getPrototypeOf(TopSites)).call(this, props));

    _this.title = 'Frequently Visited';
    _this.name = 'top';
    return _this;
  }

  _createClass(TopSites, [{
    key: "update",
    value: function update(query) {
      var _this2 = this;

      if (query.length > 0) return this.setState({
        rows: []
      });

      get(function (rows) {
        _this2.setState({
          rows: rows.slice(0, _this2.max(rows.length)).map(function (r) {
            return _this2.mapEach(r);
          })
        });
      });
    }
  }]);

  return TopSites;
}(_rows2.default);

exports.default = TopSites;
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

},{"./rows":11,"preact":26}],18:[function(require,module,exports){
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
        { id: this.props.content.id, className: "urlicon " + (this.props.selected ? "selected" : ""), href: this.url(), title: this.title() + " - " + (0, _urls.clean)(this.props.content.url), onMouseOver: function onMouseOver() {
            return _this2.select();
          } },
        (0, _preact.h)(_urlImage2.default, { content: this.props.content, "icon-only": true }),
        (0, _preact.h)(
          "div",
          { className: "title" },
          this.props.content.id,
          " ",
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

      if (titles.isValid(this.props.content.title)) {
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

},{"./titles":16,"./url-image":19,"img":24,"preact":26,"urls":40}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.popularIcons = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.findHostname = findHostname;
exports.findProtocol = findProtocol;

var _preact = require('preact');

var _img = require('img');

var _img2 = _interopRequireDefault(_img);

var _path = require('path');

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
  'mail.superhuman.com': 'https://superhuman.com/build/71222bdc169e5906c28247ed5b7cf0ed.share-icon.png'
};

var URLImage = function (_Component) {
  _inherits(URLImage, _Component);

  function URLImage() {
    _classCallCheck(this, URLImage);

    return _possibleConstructorReturn(this, (URLImage.__proto__ || Object.getPrototypeOf(URLImage)).apply(this, arguments));
  }

  _createClass(URLImage, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (this.props.content.url !== props.content.url) {
        this.refreshSource(props.content);
      }
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.refreshSource();
    }
  }, {
    key: 'refreshSource',
    value: function refreshSource(content) {
      this.findSource(content);
      this.preload(this.state.src);
    }
  }, {
    key: 'findSource',
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
    key: 'preload',
    value: function preload(src) {
      var _this2 = this;

      if (this.state.loading) {
        console.log('already loading', this.props.content.url, this.state.loadingSrc, src);
        return;
      }

      this.setState({
        loading: true,
        loadingSrc: src,
        src: this.cachedIconURL()
      });

      (0, _img2.default)(src, function (err) {
        if (err) {
          console.error('Image failed to load. src: %s url: %s', src, err);

          return _this2.setState({
            loading: false,
            src: _this2.cachedIconURL()
          });
        }

        _this2.setState({
          src: src,
          loading: false
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var style = {
        backgroundImage: 'url(' + this.state.src + ')'
      };

      return (0, _preact.h)('div', { className: 'url-image ' + this.state.type, style: style });
    }
  }, {
    key: 'cachedIconURL',
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

},{"img":24,"path":25,"preact":26}],20:[function(require,module,exports){
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

},{"preact":26}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){

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
},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"_process":27}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":29,"./encode":30}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){

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
},{}],34:[function(require,module,exports){
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

},{"to-title":37}],35:[function(require,module,exports){

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
},{"to-no-case":36}],36:[function(require,module,exports){

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
},{}],37:[function(require,module,exports){
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

},{"escape-regexp-component":23,"title-case-minors":33,"to-capital-case":35}],38:[function(require,module,exports){
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

},{"./util":39,"punycode":28,"querystring":31}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{"url":38}],41:[function(require,module,exports){
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
      var method = this['render' + this.props.name.slice(0, 1).toUpperCase(0, 1) + this.props.name.slice(1)].bind(this);

      if (method) {
        return (0, _preact.h)(
          "div",
          _extends({ className: "icon icon-" + this.props.name }, this.props),
          method()
        );
      }
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
      return (0, _preact.h)("img", { src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmBAMAAABaE/SdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAtUExURUdwTP///////////////////////////////////////////////////////81e3QIAAAAOdFJOUwAPbsnztB2e4C4/VoZ5zGlfVgAAAOlJREFUKBVjYKATWFNalAC0iut4+E2YjRrv3r17OoGBuw9IW0EEhYHMd+/eMsaB6QMgQcY+MPvdYQj1HCTGCmHDSQWg2D44D8JwBIrZoYm9ZWBgQxN695iBgRtd7B0DAxOGWAIDL4bYBKzquNDVPQF6A10MaC829zHooSl8BlQngSZWABRDc/STBKAYmoGPQEJomgPAYpx+SCY+FgCLMSxBEjOECDFwIRTClDEwzIArLIQqA/ovDioIDGM4YILofjEBLgJkTAYrROgEy50DCnYjqwKyufrePU1AE2MQf6KALsTAsBNTiIAIAAc4W+eLBa54AAAAAElFTkSuQmCC" });
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
    key: "renderOptions",
    value: function renderOptions() {
      return (0, _preact.h)(
        "svg",
        { id: "i-options", viewBox: "0 0 32 32", width: "32", height: "32", fill: "none", stroke: "currentcolor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": this.props.stroke || "2" },
        (0, _preact.h)("path", { d: "M28 6 L4 6 M28 16 L4 16 M28 26 L4 26 M24 3 L24 9 M8 13 L8 19 M20 23 L20 29" })
      );
    }
  }]);

  return Icon;
}(_preact.Component);

exports.default = Icon;

},{"preact":26}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWVzc2FnaW5nLmpzIiwibmV3dGFiL2Jvb2ttYXJrLXNlYXJjaC5qcyIsIm5ld3RhYi9jb250ZW50LmpzIiwibmV3dGFiL2hpc3RvcnkuanMiLCJuZXd0YWIvaWNvbi5qcyIsIm5ld3RhYi9sb2dvLmpzIiwibmV3dGFiL21lbnUuanMiLCJuZXd0YWIvbWVzc2FnaW5nLmpzIiwibmV3dGFiL25ld3RhYi5qcyIsIm5ld3RhYi9xdWVyeS1zdWdnZXN0aW9ucy5qcyIsIm5ld3RhYi9yb3dzLmpzIiwibmV3dGFiL3NlYXJjaC1pbnB1dC5qcyIsIm5ld3RhYi9zZWFyY2guanMiLCJuZXd0YWIvc2V0dGluZ3MuanMiLCJuZXd0YWIvc2lkZWJhci5qcyIsIm5ld3RhYi90aXRsZXMuanMiLCJuZXd0YWIvdG9wLXNpdGVzLmpzIiwibmV3dGFiL3VybC1pY29uLmpzIiwibmV3dGFiL3VybC1pbWFnZS5qcyIsIm5ld3RhYi93YWxscGFwZXIuanMiLCJuZXd0YWIvd2FsbHBhcGVycy5qc29uIiwibm9kZV9tb2R1bGVzL2RlYm91bmNlLWZuL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzY2FwZS1yZWdleHAtY29tcG9uZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ltZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wdW55Y29kZS9wdW55Y29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZGVjb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlbGF0aXZlLWRhdGUvbGliL3JlbGF0aXZlLWRhdGUuanMiLCJub2RlX21vZHVsZXMvdGl0bGUtY2FzZS1taW5vcnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGl0bGUtZnJvbS11cmwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdG8tY2FwaXRhbC1jYXNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RvLW5vLWNhc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdG8tdGl0bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdXJsL3VybC5qcyIsIm5vZGVfbW9kdWxlcy91cmwvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy91cmxzL2luZGV4LmpzIiwicG9wdXAvaWNvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJLGlCQUFpQixDQUFyQjs7QUFFTyxJQUFNLHNEQUF1QixDQUE3Qjs7SUFFYyxTO0FBQ25CLHVCQUFjO0FBQUE7O0FBQ1osU0FBSyxpQkFBTDtBQUNBLFNBQUssT0FBTCxHQUFlLEVBQWY7QUFDRDs7OztnQ0FFd0M7QUFBQSxVQUFqQyxFQUFpQyxRQUFqQyxFQUFpQztBQUFBLFVBQTdCLE9BQTZCLFFBQTdCLE9BQTZCO0FBQUEsVUFBcEIsS0FBb0IsUUFBcEIsS0FBb0I7QUFBQSxVQUFiLEVBQWEsUUFBYixFQUFhO0FBQUEsVUFBVCxLQUFTLFFBQVQsS0FBUzs7QUFDdkMsV0FBSyxLQUFLLFVBQUwsRUFBTDs7QUFFQSxhQUFPO0FBQ0wsY0FBTSxLQUFLLElBRE47QUFFTCxZQUFJLE1BQU0sS0FBSyxNQUZWO0FBR0wsZUFBTyxRQUFRLEtBQVIsSUFBaUIsS0FIbkI7QUFJTCxjQUpLLEVBSUQsZ0JBSkMsRUFJUTtBQUpSLE9BQVA7QUFNRDs7O2lDQUVZO0FBQ1gsYUFBUSxLQUFLLEdBQUwsS0FBYSxJQUFkLEdBQXVCLEVBQUUsY0FBaEM7QUFDRDs7OzhCQUVTLEcsRUFBSztBQUNiLFVBQUksSUFBSSxFQUFKLEtBQVcsS0FBSyxJQUFwQixFQUEwQixPQUFPLElBQVA7O0FBRTFCLFVBQUksSUFBSSxLQUFKLElBQWEsS0FBSyxPQUFMLENBQWEsSUFBSSxLQUFqQixDQUFqQixFQUEwQztBQUN4QyxhQUFLLE9BQUwsQ0FBYSxJQUFJLEtBQWpCLEVBQXdCLEdBQXhCO0FBQ0Q7O0FBRUQsVUFBSSxJQUFJLEtBQVIsRUFBZTtBQUNiLGVBQU8sSUFBUDtBQUNEOztBQUVELFVBQUksSUFBSSxPQUFKLElBQWUsSUFBSSxPQUFKLENBQVksSUFBL0IsRUFBcUM7QUFDbkMsYUFBSyxLQUFMLENBQVcsR0FBWCxFQUFnQixFQUFFLE1BQU0sSUFBUixFQUFoQjtBQUNBLGVBQU8sSUFBUDtBQUNEO0FBQ0Y7Ozt5QkFFSSxRLEVBQVU7QUFDYixXQUFLLElBQUwsQ0FBVSxFQUFFLE1BQU0sSUFBUixFQUFWLEVBQTBCLFFBQTFCO0FBQ0Q7OzswQkFFSyxHLEVBQUssTyxFQUFTO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLE9BQWIsRUFBc0I7QUFDcEIsa0JBQVU7QUFDUixtQkFBUztBQURELFNBQVY7QUFHRDs7QUFFRCxjQUFRLEtBQVIsR0FBZ0IsSUFBSSxFQUFwQjtBQUNBLGNBQVEsRUFBUixHQUFhLElBQUksSUFBakI7O0FBRUEsV0FBSyxJQUFMLENBQVUsT0FBVjtBQUNEOzs7eUJBRUksTyxFQUFTLFEsRUFBVTtBQUN0QixVQUFNLE1BQU0sS0FBSyxLQUFMLENBQVcsUUFBUSxPQUFSLEdBQWtCLE9BQWxCLEdBQTRCLEVBQUUsU0FBUyxPQUFYLEVBQXZDLENBQVo7O0FBRUEsV0FBSyxXQUFMLENBQWlCLEdBQWpCOztBQUVBLFVBQUksUUFBSixFQUFjO0FBQ1osYUFBSyxZQUFMLENBQWtCLElBQUksRUFBdEIsRUFBMEIsb0JBQTFCLEVBQWdELFFBQWhEO0FBQ0Q7QUFDRjs7O2lDQUVZLEssRUFBTyxXLEVBQWEsUSxFQUFVO0FBQ3pDLFVBQU0sT0FBTyxJQUFiO0FBQ0EsVUFBSSxVQUFVLFNBQWQ7O0FBRUEsVUFBSSxjQUFjLENBQWxCLEVBQXFCO0FBQ25CLGtCQUFVLFdBQVcsU0FBWCxFQUFzQixjQUFjLElBQXBDLENBQVY7QUFDRDs7QUFFRCxXQUFLLE9BQUwsQ0FBYSxLQUFiLElBQXNCLGVBQU87QUFDM0I7QUFDQSxpQkFBUyxHQUFUO0FBQ0QsT0FIRDs7QUFLQSxhQUFPLElBQVA7O0FBRUEsZUFBUyxJQUFULEdBQWlCO0FBQ2YsWUFBSSxXQUFXLFNBQWYsRUFBMEI7QUFDeEIsdUJBQWEsT0FBYjtBQUNEOztBQUVELGtCQUFVLFNBQVY7QUFDQSxlQUFPLEtBQUssT0FBTCxDQUFhLEtBQWIsQ0FBUDtBQUNEOztBQUVELGVBQVMsU0FBVCxHQUFzQjtBQUNwQjtBQUNBLGlCQUFTLEVBQUUsT0FBTywrQkFBK0IsV0FBL0IsR0FBNEMsS0FBckQsRUFBVDtBQUNEO0FBQ0Y7Ozs7OztrQkE3RmtCLFM7Ozs7Ozs7Ozs7O0FDSnJCOzs7Ozs7Ozs7Ozs7SUFFcUIsYzs7O0FBQ25CLDBCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxnSUFDWCxLQURXOztBQUVqQixVQUFLLElBQUwsR0FBWSxpQkFBWjtBQUNBLFVBQUssS0FBTCxHQUFhLGlCQUFiO0FBSGlCO0FBSWxCOzs7OzJCQUVNLEssRUFBTztBQUFBOztBQUNaLFVBQUksTUFBTSxNQUFOLElBQWdCLENBQXBCLEVBQXVCLE9BQU8sS0FBSyxRQUFMLENBQWM7QUFDMUMsY0FBTTtBQURvQyxPQUFkLENBQVA7O0FBSXZCLFdBQUssUUFBTCxDQUFjO0FBQ1osaUJBQVM7QUFERyxPQUFkOztBQUlBLFdBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsSUFBcEIsQ0FBeUIsRUFBRSxNQUFNLGtCQUFSLEVBQTRCLFlBQTVCLEVBQXpCLEVBQThELGdCQUFRO0FBQ3BFLGVBQUssUUFBTCxDQUFjLEVBQUUsU0FBUyxLQUFYLEVBQWQ7O0FBRUEsWUFBSSxLQUFLLEtBQVQsRUFBZ0IsT0FBTyxPQUFLLFFBQUwsQ0FBYztBQUNuQyxpQkFBTyxLQUFLO0FBRHVCLFNBQWQsQ0FBUDs7QUFJaEIsWUFBTSxPQUFPLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsS0FBbEM7O0FBRUEsZUFBSyxRQUFMLENBQWM7QUFDWixnQkFBTSxLQUNILEtBREcsQ0FDRyxDQURILEVBQ00sT0FBSyxHQUFMLENBQVMsS0FBSyxNQUFkLENBRE4sRUFFSCxHQUZHLENBRUM7QUFBQSxtQkFBTyxPQUFLLE9BQUwsQ0FBYSxHQUFiLENBQVA7QUFBQSxXQUZEO0FBRE0sU0FBZDtBQUtELE9BZEQ7QUFlRDs7Ozs7O2tCQS9Ca0IsYzs7Ozs7Ozs7Ozs7QUNGckI7Ozs7Ozs7O0lBRXFCLE87Ozs7Ozs7Ozs7OzZCQUNWO0FBQ1AsVUFBTSxLQUFLLEtBQUssS0FBTCxDQUFXLFNBQVgsR0FBdUI7QUFDaEMsa0NBQXdCLEtBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsSUFBckIsQ0FBMEIsS0FBbEQ7QUFEZ0MsT0FBdkIsR0FFUCxJQUZKOztBQUlBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxpQkFBZjtBQUNFLGdDQUFLLFdBQVUsSUFBZixFQUFvQixPQUFPLEVBQTNCLEdBREY7QUFFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFFBQWY7QUFDRTtBQUFBO0FBQUEsY0FBSyxXQUFVLFNBQWY7QUFDRyxpQkFBSyxLQUFMLENBQVc7QUFEZDtBQURGO0FBRkYsT0FERjtBQVVEOzs7Ozs7a0JBaEJrQixPOzs7Ozs7Ozs7OztBQ0ZyQjs7OztBQUNBOzs7Ozs7Ozs7O0lBRXFCLE87OztBQUNuQixtQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0hBQ1gsS0FEVzs7QUFFakIsVUFBSyxJQUFMLEdBQVksU0FBWjtBQUNBLFVBQUssS0FBTCxHQUFhLG9CQUFiO0FBSGlCO0FBSWxCOzs7OzJCQUVNLEssRUFBTztBQUFBOztBQUNaLFVBQUksTUFBTSxNQUFOLEtBQWlCLENBQXJCLEVBQXdCLE9BQU8sS0FBSyxRQUFMLENBQWMsRUFBRSxNQUFNLEVBQVIsRUFBZCxDQUFQOztBQUV4QixXQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFTO0FBREcsT0FBZDs7QUFJQSxhQUFPLE9BQVAsQ0FBZSxNQUFmLENBQXNCLEVBQUUsTUFBTSxLQUFSLEVBQXRCLEVBQXVDLG1CQUFXO0FBQ2hELFlBQU0sT0FBTyxRQUFRLE1BQVIsQ0FBZSxlQUFmLENBQWI7O0FBRUEsZUFBSyxRQUFMLENBQWM7QUFDWixtQkFBUyxLQURHO0FBRVosZ0JBQU0sS0FDSCxLQURHLENBQ0csQ0FESCxFQUNNLE9BQUssR0FBTCxDQUFTLEtBQUssTUFBZCxDQUROLEVBRUgsR0FGRyxDQUVDO0FBQUEsbUJBQU8sT0FBSyxPQUFMLENBQWEsR0FBYixDQUFQO0FBQUEsV0FGRDtBQUZNLFNBQWQ7QUFNRCxPQVREO0FBVUQ7Ozs7OztrQkF4QmtCLE87OztBQTJCckIsU0FBUyxlQUFULENBQTBCLEdBQTFCLEVBQStCO0FBQzdCLFNBQU8sNEJBQWEsSUFBSSxHQUFqQixFQUFzQixLQUF0QixDQUE0QixHQUE1QixFQUFpQyxDQUFqQyxNQUF3QyxRQUF4QyxJQUNGLENBQUMsb0JBQW9CLElBQXBCLENBQXlCLElBQUksR0FBN0IsQ0FETjtBQUVEOzs7Ozs7Ozs7Ozs7O0FDakNEOzs7Ozs7OztJQUVxQixJOzs7Ozs7Ozs7Ozs2QkFDVjtBQUNQLFVBQU0sU0FBUyxLQUFLLFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixLQUFoQixDQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QixXQUE1QixDQUF3QyxDQUF4QyxFQUEyQyxDQUEzQyxDQUFYLEdBQTJELEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsS0FBaEIsQ0FBc0IsQ0FBdEIsQ0FBaEUsRUFBMEYsSUFBMUYsQ0FBK0YsSUFBL0YsQ0FBZjs7QUFFQSxVQUFJLE1BQUosRUFBWTtBQUNWLGVBQ0U7QUFBQTtBQUFBLHFCQUFLLDBCQUF3QixLQUFLLEtBQUwsQ0FBVyxJQUF4QyxJQUFvRCxLQUFLLEtBQXpEO0FBQ0c7QUFESCxTQURGO0FBS0Q7QUFDRjs7O2tDQUVhO0FBQ1osYUFDRTtBQUFBO0FBQUEsVUFBSyxJQUFHLFNBQVIsRUFBa0IsU0FBUSxXQUExQixFQUFzQyxPQUFNLElBQTVDLEVBQWlELFFBQU8sSUFBeEQsRUFBNkQsTUFBSyxNQUFsRSxFQUF5RSxRQUFPLGNBQWhGLEVBQStGLGtCQUFlLE9BQTlHLEVBQXNILG1CQUFnQixPQUF0SSxFQUE4SSxnQkFBYyxLQUFLLEtBQUwsQ0FBVyxNQUFYLElBQXFCLEdBQWpMO0FBQ0UsaUNBQU0sR0FBRSxpREFBUjtBQURGLE9BREY7QUFLRDs7O2tDQUVhO0FBQ1osYUFDRTtBQUFBO0FBQUEsVUFBSyxJQUFHLFNBQVIsRUFBa0IsU0FBUSxXQUExQixFQUFzQyxPQUFNLElBQTVDLEVBQWlELFFBQU8sSUFBeEQsRUFBNkQsTUFBSyxNQUFsRSxFQUF5RSxRQUFPLGNBQWhGLEVBQStGLGtCQUFlLE9BQTlHLEVBQXNILG1CQUFnQixPQUF0SSxFQUE4SSxnQkFBYyxLQUFLLEtBQUwsQ0FBVyxNQUFYLElBQXFCLEdBQWpMO0FBQ0UsbUNBQVEsSUFBRyxJQUFYLEVBQWdCLElBQUcsSUFBbkIsRUFBd0IsR0FBRSxJQUExQixHQURGO0FBRUUsaUNBQU0sR0FBRSxvQkFBUjtBQUZGLE9BREY7QUFNRDs7O2tDQUVhO0FBQ1osYUFDRTtBQUFBO0FBQUEsVUFBSyxJQUFHLFNBQVIsRUFBa0IsU0FBUSxXQUExQixFQUFzQyxPQUFNLElBQTVDLEVBQWlELFFBQU8sSUFBeEQsRUFBNkQsTUFBSyxNQUFsRSxFQUF5RSxRQUFPLGNBQWhGLEVBQStGLGtCQUFlLE9BQTlHLEVBQXNILG1CQUFnQixPQUF0SSxFQUE4SSxnQkFBYyxLQUFLLEtBQUwsQ0FBVyxNQUFYLElBQXFCLEdBQWpMO0FBQ0UsaUNBQU0sR0FBRSx5QkFBUjtBQURGLE9BREY7QUFLRDs7O2tDQUVhO0FBQ1osYUFDRSx3QkFBSyxLQUFJLHl0Q0FBVCxHQURGO0FBR0Q7OztxQ0FFZ0I7QUFDZixhQUNFLHdCQUFLLEtBQUkseXRDQUFULEdBREY7QUFHRDs7O21DQUVjO0FBQ2IsYUFDRTtBQUFBO0FBQUEsVUFBSyxJQUFHLFVBQVIsRUFBbUIsU0FBUSxXQUEzQixFQUF1QyxPQUFNLElBQTdDLEVBQWtELFFBQU8sSUFBekQsRUFBOEQsTUFBSyxNQUFuRSxFQUEwRSxRQUFPLGNBQWpGLEVBQWdHLGtCQUFlLE9BQS9HLEVBQXVILG1CQUFnQixPQUF2SSxFQUErSSxnQkFBYyxLQUFLLEtBQUwsQ0FBVyxNQUFYLElBQXFCLEdBQWxMO0FBQ0UsbUNBQVEsSUFBRyxJQUFYLEVBQWdCLElBQUcsSUFBbkIsRUFBd0IsR0FBRSxJQUExQixHQURGO0FBRUUsaUNBQU0sR0FBRSxlQUFSO0FBRkYsT0FERjtBQU1EOzs7cUNBRWdCO0FBQ2YsYUFDRTtBQUFBO0FBQUEsVUFBSyxJQUFHLFlBQVIsRUFBcUIsU0FBUSxXQUE3QixFQUF5QyxPQUFNLElBQS9DLEVBQW9ELFFBQU8sSUFBM0QsRUFBZ0UsTUFBSyxNQUFyRSxFQUE0RSxRQUFPLGNBQW5GLEVBQWtHLGtCQUFlLE9BQWpILEVBQXlILG1CQUFnQixPQUF6SSxFQUFpSixnQkFBYyxLQUFLLEtBQUwsQ0FBVyxNQUFYLElBQXFCLEdBQXBMO0FBQ0UsaUNBQU0sR0FBRSw0REFBUjtBQURGLE9BREY7QUFLRDs7O2dDQUVXO0FBQ1YsYUFDRTtBQUFBO0FBQUEsVUFBSyxJQUFHLE9BQVIsRUFBZ0IsU0FBUSxXQUF4QixFQUFvQyxPQUFNLElBQTFDLEVBQStDLFFBQU8sSUFBdEQsRUFBMkQsTUFBSyxNQUFoRSxFQUF1RSxRQUFPLGNBQTlFLEVBQTZGLGtCQUFlLE9BQTVHLEVBQW9ILG1CQUFnQixPQUFwSSxFQUE0SSxnQkFBYyxLQUFLLEtBQUwsQ0FBVyxNQUFYLElBQXFCLEdBQS9LO0FBQ0UsbUNBQVEsSUFBRyxJQUFYLEVBQWdCLElBQUcsR0FBbkIsRUFBdUIsR0FBRSxHQUF6QixHQURGO0FBRUUsaUNBQU0sR0FBRSxnQ0FBUjtBQUZGLE9BREY7QUFNRDs7O2tDQUVhO0FBQ1osYUFDRTtBQUFBO0FBQUEsVUFBSyxJQUFHLFNBQVIsRUFBa0IsU0FBUSxXQUExQixFQUFzQyxPQUFNLElBQTVDLEVBQWlELFFBQU8sSUFBeEQsRUFBNkQsTUFBSyxNQUFsRSxFQUF5RSxRQUFPLGNBQWhGLEVBQStGLGtCQUFlLE9BQTlHLEVBQXNILG1CQUFnQixPQUF0SSxFQUE4SSxnQkFBYyxLQUFLLEtBQUwsQ0FBVyxNQUFYLElBQXFCLEdBQWpMO0FBQ0UsaUNBQU0sR0FBRSxnR0FBUjtBQURGLE9BREY7QUFLRDs7O3lDQUVvQjtBQUNuQixhQUNFO0FBQUE7QUFBQSxVQUFLLElBQUcsaUJBQVIsRUFBMEIsU0FBUSxXQUFsQyxFQUE4QyxPQUFNLElBQXBELEVBQXlELFFBQU8sSUFBaEUsRUFBcUUsTUFBSyxNQUExRSxFQUFpRixRQUFPLGNBQXhGLEVBQXVHLGtCQUFlLE9BQXRILEVBQThILG1CQUFnQixPQUE5SSxFQUFzSixnQkFBYSxHQUFuSztBQUNFLGlDQUFNLEdBQUUsb0JBQVI7QUFERixPQURGO0FBS0Q7Ozs7OztrQkExRmtCLEk7Ozs7Ozs7Ozs7O0FDRnJCOzs7Ozs7OztJQUVxQixJOzs7Ozs7Ozs7Ozs2QkFDVjtBQUNQLGFBQ0U7QUFBQTtBQUFBLFVBQUcsV0FBVSxNQUFiLEVBQW9CLE1BQUssdUJBQXpCO0FBQ0UsZ0NBQUssS0FBSyxPQUFPLFNBQVAsQ0FBaUIsTUFBakIsQ0FBd0Isb0JBQXhCLENBQVYsRUFBeUQsT0FBTSxhQUEvRDtBQURGLE9BREY7QUFLRDs7Ozs7O2tCQVBrQixJOzs7Ozs7Ozs7OztBQ0ZyQjs7Ozs7Ozs7SUFFcUIsSTs7Ozs7Ozs7Ozs7NkJBQ1YsSyxFQUFPO0FBQ2QsV0FBSyxRQUFMLENBQWMsRUFBRSxZQUFGLEVBQWQ7QUFDRDs7OzZCQUVRO0FBQUE7O0FBQ1AsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLE1BQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLE9BQWY7QUFDRyxlQUFLLEtBQUwsQ0FBVyxLQUFYLElBQW9CO0FBRHZCLFNBREY7QUFJRTtBQUFBO0FBQUEsWUFBSSxXQUFVLFNBQWQ7QUFDRTtBQUFBO0FBQUE7QUFDRSwyQkFBQyxNQUFEO0FBQ0Usb0JBQUssVUFEUDtBQUVFLDJCQUFhO0FBQUEsdUJBQU0sT0FBSyxRQUFMLENBQWMsa0JBQWQsQ0FBTjtBQUFBLGVBRmY7QUFHRSwwQkFBWTtBQUFBLHVCQUFNLE9BQUssUUFBTCxFQUFOO0FBQUEsZUFIZDtBQUlFLHVCQUFTO0FBQUEsdUJBQU0sT0FBSyxLQUFMLENBQVcsVUFBWCxFQUFOO0FBQUEsZUFKWDtBQURGLFdBREY7QUFRRTtBQUFBO0FBQUE7QUFDRSwyQkFBQyxNQUFEO0FBQ0Usb0JBQUssT0FEUDtBQUVFLDJCQUFhO0FBQUEsdUJBQU0sT0FBSyxRQUFMLENBQWMsV0FBZCxDQUFOO0FBQUEsZUFGZjtBQUdFLDBCQUFZO0FBQUEsdUJBQU0sT0FBSyxRQUFMLEVBQU47QUFBQSxlQUhkO0FBSUUsdUJBQVM7QUFBQSx1QkFBTSxPQUFLLEtBQUwsQ0FBVyxhQUFYLEVBQU47QUFBQSxlQUpYO0FBREYsV0FSRjtBQWVFO0FBQUE7QUFBQTtBQUNFLDJCQUFDLE1BQUQ7QUFDRyxvQkFBSyxNQURSO0FBRUcsMkJBQWE7QUFBQSx1QkFBTSxPQUFLLFFBQUwsQ0FBYyxjQUFkLENBQU47QUFBQSxlQUZoQjtBQUdHLDBCQUFZO0FBQUEsdUJBQU0sT0FBSyxRQUFMLEVBQU47QUFBQSxlQUhmO0FBSUcsdUJBQVM7QUFBQSx1QkFBTSxPQUFLLEtBQUwsQ0FBVyxPQUFYLEVBQU47QUFBQSxlQUpaO0FBREY7QUFmRjtBQUpGLE9BREY7QUE4QkQ7Ozs7OztrQkFwQ2tCLEk7Ozs7Ozs7Ozs7O0FDRnJCOzs7Ozs7Ozs7Ozs7SUFFcUIsc0I7OztBQUNuQixvQ0FBYztBQUFBOztBQUFBOztBQUVaLFVBQUssSUFBTCxHQUFZLGVBQVo7QUFDQSxVQUFLLE1BQUwsR0FBYyxtQkFBZDtBQUhZO0FBSWI7Ozs7d0NBRW1CO0FBQUE7O0FBQ2xCLGFBQU8sT0FBUCxDQUFlLFNBQWYsQ0FBeUIsV0FBekIsQ0FBcUM7QUFBQSxlQUFPLE9BQUssU0FBTCxDQUFlLEdBQWYsQ0FBUDtBQUFBLE9BQXJDO0FBQ0Q7OztnQ0FFWSxHLEVBQUssUSxFQUFVO0FBQzFCLGFBQU8sT0FBUCxDQUFlLFdBQWYsQ0FBMkIsR0FBM0IsRUFBZ0MsUUFBaEM7QUFDRDs7Ozs7O2tCQWJrQixzQjs7Ozs7OztBQ0ZyQjs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNLE07OztBQUNKLGtCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxnSEFDWCxLQURXOztBQUdqQixVQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFXO0FBREMsS0FBZDtBQUhpQjtBQU1sQjs7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtBQUFBLFVBQUssbUJBQUw7QUFDRSw0Q0FERjtBQUVFO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZjtBQUNFO0FBREYsU0FGRjtBQUtJLGFBQUssS0FBTCxDQUFXLFNBQVgsR0FBdUIsb0NBQWUsS0FBSyxLQUFMLENBQVcsU0FBMUIsQ0FBdkIsR0FBaUU7QUFMckUsT0FERjtBQVNEOzs7Ozs7QUFHSCxvQkFBTyxlQUFDLE1BQUQsT0FBUCxFQUFtQixTQUFTLElBQTVCOzs7Ozs7Ozs7OztBQzlCQTs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUIsZ0I7OztBQUNuQiw0QkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsb0lBQ1gsS0FEVzs7QUFFakIsVUFBSyxJQUFMLEdBQVksbUJBQVo7QUFGaUI7QUFHbEI7Ozs7eUNBRW9CLEssRUFBTztBQUMxQixVQUFJLENBQUMsTUFBTSxLQUFOLENBQUwsRUFBbUIsT0FBTyxFQUFQOztBQUVuQixVQUFNLE1BQU0sV0FBVyxJQUFYLENBQWdCLEtBQWhCLElBQXlCLEtBQXpCLEdBQWlDLFlBQVksS0FBekQ7O0FBRUEsYUFBTyxDQUFDO0FBQ04sMkJBQWdCLDRCQUFhLEtBQWIsQ0FBaEIsT0FETTtBQUVOLGNBQU0sa0JBRkE7QUFHTjtBQUhNLE9BQUQsQ0FBUDtBQUtEOzs7NENBRXVCLEssRUFBTztBQUM3QixVQUFJLE1BQU0sS0FBTixDQUFKLEVBQWtCLE9BQU8sRUFBUDs7QUFFbEIsYUFBTyxDQUNMO0FBQ0UsYUFBSyxpQ0FBaUMsVUFBVSxLQUFWLENBRHhDO0FBRUUsZUFBTyxLQUZUO0FBR0UsNkJBQWtCLEtBQWxCLGlCQUhGO0FBSUUsY0FBTTtBQUpSLE9BREssRUFPTDtBQUNFLGFBQUssb0NBQW9DLFVBQVUsS0FBVixDQUQzQztBQUVFLGVBQU8sS0FGVDtBQUdFLDZCQUFrQixLQUFsQixpQkFIRjtBQUlFLGNBQU07QUFKUixPQVBLLENBQVA7QUFjRDs7OzJCQUVNLEssRUFBTztBQUFBOztBQUNaLFVBQUksTUFBTSxNQUFOLEtBQWlCLENBQXJCLEVBQXdCLE9BQU8sS0FBSyxRQUFMLENBQWMsRUFBRSxNQUFNLEVBQVIsRUFBZCxDQUFQOztBQUV4QixVQUFNLE9BQU8sS0FBSyxvQkFBTCxDQUEwQixLQUExQixFQUNWLE1BRFUsQ0FDSCxLQUFLLHVCQUFMLENBQTZCLEtBQTdCLENBREcsRUFFVixHQUZVLENBRU47QUFBQSxlQUFPLE9BQUssT0FBTCxDQUFhLEdBQWIsQ0FBUDtBQUFBLE9BRk0sQ0FBYjs7QUFJQSxXQUFLLFFBQUwsQ0FBYztBQUNaLGNBQU0sS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLEtBQUssR0FBTCxDQUFTLEtBQUssTUFBZCxDQUFkO0FBRE0sT0FBZDtBQUdEOzs7Ozs7a0JBL0NrQixnQjs7O0FBa0RyQixTQUFTLEtBQVQsQ0FBZ0IsS0FBaEIsRUFBdUI7QUFDckIsU0FBTyxNQUFNLElBQU4sR0FBYSxPQUFiLENBQXFCLEdBQXJCLElBQTRCLENBQTVCLElBQWlDLE1BQU0sT0FBTixDQUFjLEdBQWQsTUFBdUIsQ0FBQyxDQUFoRTtBQUNEOzs7Ozs7Ozs7OztBQ3hERDs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCLEk7OztBQUNuQixnQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsNEdBQ1gsS0FEVzs7QUFFakIsVUFBSyxRQUFMLENBQWMsRUFBRSxNQUFNLEVBQVIsRUFBZDtBQUNBLFVBQUssTUFBTCxDQUFZLE1BQU0sS0FBbEI7QUFIaUI7QUFJbEI7Ozs7MENBRXFCLFMsRUFBVyxTLEVBQVc7QUFDMUMsVUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEtBQXFCLFVBQVUsS0FBL0IsSUFBd0MsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxJQUFwRCxJQUE0RCxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLE1BQWhCLEtBQTJCLFVBQVUsSUFBVixDQUFlLE1BQTFHLEVBQWtIO0FBQ2hILGVBQU8sSUFBUDtBQUNEOztBQUVELFVBQUssQ0FBQyxLQUFLLEtBQUwsQ0FBVyxRQUFaLElBQXdCLFVBQVUsUUFBbkMsSUFBaUQsS0FBSyxLQUFMLENBQVcsUUFBWCxJQUF1QixDQUFDLFVBQVUsUUFBbkYsSUFBaUcsS0FBSyxLQUFMLENBQVcsUUFBWCxJQUF1QixVQUFVLFFBQWpDLElBQTZDLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsRUFBcEIsS0FBMkIsVUFBVSxRQUFWLENBQW1CLEVBQWhNLEVBQXFNO0FBQ25NLGVBQU8sSUFBUDtBQUNEOztBQUVELFVBQUksSUFBSSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixNQUE1QixDQUFSO0FBQ0EsYUFBTyxHQUFQLEVBQVk7QUFDVixZQUFJLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsQ0FBaEIsRUFBbUIsR0FBbkIsS0FBMkIsVUFBVSxJQUFWLENBQWUsQ0FBZixFQUFrQixHQUFqRCxFQUFzRDtBQUNwRCxpQkFBTyxJQUFQO0FBQ0Q7QUFDRjtBQUNELGFBQU8sS0FBUDtBQUNEOzs7OENBRXlCLEssRUFBTztBQUMvQixVQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsS0FBcUIsTUFBTSxLQUEvQixFQUFzQztBQUNwQyxhQUFLLE1BQUwsQ0FBWSxNQUFNLEtBQWxCO0FBQ0Q7QUFDRjs7OzRCQUVPLEcsRUFBSztBQUNYLFVBQUksSUFBSixHQUFXLEtBQUssSUFBaEI7QUFDQSxVQUFJLEVBQUosR0FBUyxLQUFLLEtBQUwsQ0FBVyxFQUFYLENBQWMsR0FBZCxDQUFUO0FBQ0EsV0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixHQUFsQjtBQUNBLGFBQU8sR0FBUDtBQUNEOzs7d0JBRUcsSyxFQUFPO0FBQ1QsYUFBTyxLQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLEtBQXZCLEVBQThCLEtBQUssSUFBbkMsQ0FBUDtBQUNEOzs7NkJBRVE7QUFBQTs7QUFDUCxVQUFJLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsTUFBaEIsS0FBMkIsQ0FBL0IsRUFBa0M7O0FBRWxDLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxNQUFmO0FBQ0csYUFBSyxLQUFMLEdBQWE7QUFBQTtBQUFBLFlBQUssV0FBVSxPQUFmO0FBQ1o7QUFBQTtBQUFBO0FBQUssaUJBQUs7QUFBVjtBQURZLFNBQWIsR0FFUSxJQUhYO0FBSUU7QUFBQTtBQUFBLFlBQUssV0FBVSxjQUFmO0FBQ0csZUFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixHQUFoQixDQUFvQixVQUFDLEdBQUQ7QUFBQSxtQkFBUyxPQUFLLFNBQUwsQ0FBZSxHQUFmLENBQVQ7QUFBQSxXQUFwQjtBQURIO0FBSkYsT0FERjtBQVVEOzs7OEJBRVMsRyxFQUFLO0FBQ2IsVUFBSSxDQUFDLEtBQUssS0FBTCxDQUFXLFFBQVosSUFBd0IsSUFBSSxFQUFKLEtBQVcsQ0FBdkMsRUFBMEM7QUFDeEMsYUFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixHQUFwQjtBQUNEOztBQUVELGFBQ0Usb0NBQVMsU0FBUyxHQUFsQjtBQUNTLGtCQUFVLEtBQUssS0FBTCxDQUFXLFFBRDlCO0FBRVMsa0JBQVUsS0FBSyxLQUFMLENBQVcsUUFBWCxJQUF1QixLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEVBQXBCLElBQTBCLElBQUk7QUFGeEUsUUFERjtBQU1EOzs7Ozs7a0JBcEVrQixJOzs7Ozs7Ozs7OztBQ0hyQjs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCLFc7Ozs7Ozs7Ozs7O3dDQUNDO0FBQ2xCLFVBQUksS0FBSyxLQUFULEVBQWdCLEtBQUssS0FBTCxDQUFXLEtBQVg7QUFDakI7OzswQ0FFcUIsUyxFQUFXLFMsRUFBVztBQUMxQyxhQUFPLFVBQVUsS0FBVixLQUFvQixLQUFLLEtBQUwsQ0FBVyxLQUF0QztBQUNEOzs7a0NBRWEsSyxFQUFPLE8sRUFBUztBQUM1QixVQUFJLFlBQVksRUFBaEIsRUFBb0I7QUFDbEIsZUFBTyxLQUFLLEtBQUwsQ0FBVyxZQUFYLENBQXdCLEtBQXhCLENBQVA7QUFDRDs7QUFFRCxXQUFLLFFBQUwsQ0FBYyxFQUFFLFlBQUYsRUFBZDs7QUFFQSxVQUFJLEtBQUssZ0JBQUwsS0FBMEIsU0FBOUIsRUFBeUM7QUFDdkMscUJBQWEsS0FBSyxnQkFBbEI7QUFDQSxhQUFLLGdCQUFMLEdBQXdCLENBQXhCO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLLEtBQUwsQ0FBVyxhQUFmLEVBQThCO0FBQzVCLGFBQUssS0FBTCxDQUFXLGFBQVgsQ0FBeUIsS0FBekI7QUFDRDtBQUNGOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsY0FBZjtBQUNHLGFBQUssVUFBTCxFQURIO0FBRUcsYUFBSyxXQUFMO0FBRkgsT0FERjtBQU1EOzs7aUNBRVk7QUFBQTs7QUFDWCxhQUNJLGlDQUFNLE1BQUssUUFBWCxFQUFvQixTQUFTO0FBQUEsaUJBQU0sT0FBSyxLQUFMLENBQVcsS0FBWCxFQUFOO0FBQUEsU0FBN0IsR0FESjtBQUdEOzs7a0NBRWE7QUFBQTs7QUFDWixhQUNFLDBCQUFPLEtBQUs7QUFBQSxpQkFBTSxPQUFLLEtBQUwsR0FBYSxFQUFuQjtBQUFBLFNBQVo7QUFDRSxjQUFLLE1BRFA7QUFFRSxtQkFBVSxPQUZaO0FBR0UscUJBQVksMkJBSGQ7QUFJRSxrQkFBVTtBQUFBLGlCQUFLLE9BQUssYUFBTCxDQUFtQixFQUFFLE1BQUYsQ0FBUyxLQUE1QixDQUFMO0FBQUEsU0FKWjtBQUtFLGlCQUFTO0FBQUEsaUJBQUssT0FBSyxhQUFMLENBQW1CLEVBQUUsTUFBRixDQUFTLEtBQTVCLEVBQW1DLEVBQUUsT0FBckMsQ0FBTDtBQUFBLFNBTFg7QUFNRSxlQUFPLEtBQUssS0FBTCxDQUFXLEtBTnBCLEdBREY7QUFTRDs7Ozs7O2tCQW5Ea0IsVzs7Ozs7Ozs7Ozs7QUNIckI7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQixNOzs7QUFDbkIsa0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLGdIQUNYLEtBRFc7O0FBRWpCLFVBQUssUUFBTCxHQUFnQix5QkFBaEI7O0FBRUEsVUFBSyxRQUFMLENBQWM7QUFDWixVQUFJLENBRFE7QUFFWixZQUFNLEVBRk07QUFHWixxQkFBZSxDQUhIO0FBSVosYUFBTztBQUpLLEtBQWQ7O0FBT0EsVUFBSyxXQUFMLEdBQW1CLDBCQUFTLE1BQUssVUFBTCxDQUFnQixJQUFoQixPQUFULEVBQXFDLEVBQXJDLENBQW5CO0FBQ0EsVUFBSyxjQUFMLEdBQXNCLDBCQUFTLE1BQUssYUFBTCxDQUFtQixJQUFuQixPQUFULENBQXRCO0FBWmlCO0FBYWxCOzs7O3lCQUdJO0FBQ0gsYUFBTyxFQUFFLEtBQUssS0FBTCxDQUFXLEVBQXBCO0FBQ0Q7OzsrQkFFVSxHLEVBQUs7QUFDZCxVQUFJLENBQUMsWUFBWSxJQUFaLENBQWlCLEdBQWpCLENBQUwsRUFBNEI7QUFDMUIsY0FBTSxZQUFZLEdBQWxCO0FBQ0Q7O0FBRUQsZUFBUyxRQUFULENBQWtCLElBQWxCLEdBQXlCLEdBQXpCO0FBQ0Q7OzsyQkFFTSxHLEVBQUs7QUFDVixXQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQUksRUFBcEIsSUFBMEIsR0FBMUI7QUFDRDs7O2lDQUVZO0FBQ1gsVUFBSSxLQUFLLEtBQUssS0FBTCxDQUFXLFFBQVgsR0FBc0IsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixFQUExQyxHQUErQyxDQUF4RDtBQUNBLFVBQUksTUFBTSxDQUFWLEVBQWEsS0FBSyxDQUFMOztBQUViLFdBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVUsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixLQUFLLENBQXJCO0FBREUsT0FBZDtBQUdEOzs7cUNBRWdCO0FBQ2YsVUFBSSxLQUFLLEtBQUssS0FBTCxDQUFXLFFBQVgsR0FBc0IsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixFQUExQyxHQUErQyxDQUF4RDtBQUNBLFVBQUksTUFBTSxDQUFWLEVBQWEsS0FBSyxDQUFMOztBQUViLFdBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVUsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixLQUFLLENBQXJCO0FBREUsT0FBZDtBQUdEOzs7Z0NBRVcsSyxFQUFPO0FBQ2pCLFVBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxhQUFYLEdBQTJCLEtBQXRDOztBQUVBLFdBQUssUUFBTCxDQUFjO0FBQ1osdUJBQWUsS0FBSyxHQUFMLENBQVMsSUFBVCxFQUFlLENBQWY7QUFESCxPQUFkOztBQUlBLGFBQU8sT0FBTyxDQUFQLEdBQVcsUUFBUSxJQUFuQixHQUEwQixLQUFqQztBQUNEOzs7eUNBRW9CO0FBQ25CLGFBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsS0FBSyxXQUF0QyxFQUFtRCxLQUFuRDtBQUNEOzs7MkNBRXNCO0FBQ3JCLGFBQU8sbUJBQVAsQ0FBMkIsT0FBM0IsRUFBb0MsS0FBSyxXQUF6QyxFQUFzRCxLQUF0RDtBQUNEOzs7bUNBRWM7QUFDYixVQUFJLEtBQUssS0FBTCxDQUFXLFFBQWYsRUFBeUI7QUFDdkIsYUFBSyxVQUFMLENBQWdCLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsR0FBcEM7QUFDRDtBQUNGOzs7K0JBRVUsQyxFQUFHO0FBQ1osVUFBSSxFQUFFLE9BQUYsSUFBYSxFQUFqQixFQUFxQjtBQUNuQixhQUFLLFVBQUw7QUFDRCxPQUZELE1BRU8sSUFBSSxFQUFFLE9BQUYsSUFBYSxFQUFqQixFQUFxQjtBQUMxQixhQUFLLGNBQUw7QUFDRDtBQUNGOzs7NkJBRVEsRyxFQUFLO0FBQ1osVUFBSSxLQUFLLEtBQUwsQ0FBVyxRQUFYLElBQXVCLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsRUFBcEIsS0FBMkIsSUFBSSxFQUExRCxFQUE4RDs7QUFFOUQsV0FBSyxRQUFMLENBQWM7QUFDWixrQkFBVTtBQURFLE9BQWQ7QUFHRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztrQ0FlYyxLLEVBQU87QUFDbkIsY0FBUSxNQUFNLElBQU4sRUFBUjs7QUFFQSxVQUFJLFVBQVUsS0FBSyxLQUFMLENBQVcsS0FBekIsRUFBZ0M7O0FBRWhDLFdBQUssUUFBTCxDQUFjO0FBQ1osY0FBTSxFQURNO0FBRVosdUJBQWUsQ0FGSDtBQUdaLGtCQUFVLElBSEU7QUFJWixZQUFJLENBSlE7QUFLWjtBQUxZLE9BQWQ7QUFPRDs7OzZCQUVRO0FBQUE7O0FBQ1AsYUFDRTtBQUFBO0FBQUEsVUFBUyxXQUFXLEtBQUssS0FBTCxDQUFXLFNBQS9CO0FBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxlQUFmO0FBQ0Usa0RBQWEsY0FBYztBQUFBLHFCQUFNLE9BQUssWUFBTCxFQUFOO0FBQUEsYUFBM0IsRUFBc0QsZUFBZSxLQUFLLGNBQTFFLEdBREY7QUFFRyxlQUFLLGFBQUwsRUFGSDtBQUdFLGtDQUFLLFdBQVUsT0FBZjtBQUhGO0FBREYsT0FERjtBQVNEOzs7b0NBRWU7QUFBQTs7QUFDZCxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsU0FBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsY0FBZjtBQUNFLHVEQUFrQixPQUFPLEtBQUssS0FBTCxDQUFXLEtBQXBDLEVBQTJDLElBQUk7QUFBQSxxQkFBTSxPQUFLLEVBQUwsRUFBTjtBQUFBLGFBQS9DLEVBQWdFLFVBQVU7QUFBQSxxQkFBTSxPQUFLLFFBQUwsQ0FBYyxFQUFkLENBQU47QUFBQSxhQUExRSxFQUFtRyxVQUFVLEtBQUssS0FBTCxDQUFXLFFBQXhILEVBQWtJLGFBQWE7QUFBQSxxQkFBSyxPQUFLLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBTDtBQUFBLGFBQS9JLEVBQXlLLFFBQVE7QUFBQSxxQkFBSyxPQUFLLE1BQUwsQ0FBWSxDQUFaLENBQUw7QUFBQSxhQUFqTCxHQURGO0FBRUUsK0NBQVUsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUE1QixFQUFtQyxJQUFJO0FBQUEscUJBQU0sT0FBSyxFQUFMLEVBQU47QUFBQSxhQUF2QyxFQUF3RCxVQUFVO0FBQUEscUJBQU0sT0FBSyxRQUFMLENBQWMsRUFBZCxDQUFOO0FBQUEsYUFBbEUsRUFBMkYsVUFBVSxLQUFLLEtBQUwsQ0FBVyxRQUFoSCxFQUEwSCxhQUFhO0FBQUEscUJBQUssT0FBSyxXQUFMLENBQWlCLENBQWpCLENBQUw7QUFBQSxhQUF2SSxFQUFpSyxRQUFRO0FBQUEscUJBQUssT0FBSyxNQUFMLENBQVksQ0FBWixDQUFMO0FBQUEsYUFBekssR0FGRjtBQUdFLHFEQUFnQixVQUFVLEtBQUssUUFBL0IsRUFBeUMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUEzRCxFQUFrRSxJQUFJO0FBQUEscUJBQU0sT0FBSyxFQUFMLEVBQU47QUFBQSxhQUF0RSxFQUF1RixVQUFVO0FBQUEscUJBQU0sT0FBSyxRQUFMLENBQWMsRUFBZCxDQUFOO0FBQUEsYUFBakcsRUFBMEgsVUFBVSxLQUFLLEtBQUwsQ0FBVyxRQUEvSSxFQUF5SixhQUFhO0FBQUEscUJBQUssT0FBSyxXQUFMLENBQWlCLENBQWpCLENBQUw7QUFBQSxhQUF0SyxFQUFnTSxRQUFRO0FBQUEscUJBQUssT0FBSyxNQUFMLENBQVksQ0FBWixDQUFMO0FBQUEsYUFBeE0sR0FIRjtBQUlFLDhDQUFTLE9BQU8sS0FBSyxLQUFMLENBQVcsS0FBM0IsRUFBa0MsSUFBSTtBQUFBLHFCQUFNLE9BQUssRUFBTCxFQUFOO0FBQUEsYUFBdEMsRUFBdUQsVUFBVTtBQUFBLHFCQUFNLE9BQUssUUFBTCxDQUFjLEVBQWQsQ0FBTjtBQUFBLGFBQWpFLEVBQTBGLFVBQVUsS0FBSyxLQUFMLENBQVcsUUFBL0csRUFBeUgsYUFBYTtBQUFBLHFCQUFLLE9BQUssV0FBTCxDQUFpQixDQUFqQixDQUFMO0FBQUEsYUFBdEksRUFBaUssUUFBUTtBQUFBLHFCQUFLLE9BQUssTUFBTCxDQUFZLENBQVosQ0FBTDtBQUFBLGFBQXpLO0FBSkYsU0FERjtBQU9FLDRDQUFTLFVBQVUsS0FBSyxLQUFMLENBQVcsUUFBOUIsRUFBd0MsVUFBVSxLQUFLLFFBQXZELEVBQWlFLGtCQUFrQjtBQUFBLG1CQUFNLE9BQUssZ0JBQUwsRUFBTjtBQUFBLFdBQW5GLEdBUEY7QUFRRSxnQ0FBSyxXQUFVLE9BQWY7QUFSRixPQURGO0FBWUQ7Ozs7OztrQkFqSmtCLE07OztBQXFKckIsU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCO0FBQ3ZCLE1BQUksRUFBRSxRQUFGLEdBQWEsRUFBRSxRQUFuQixFQUE2QixPQUFPLENBQVA7QUFDN0IsTUFBSSxFQUFFLFFBQUYsR0FBYSxFQUFFLFFBQW5CLEVBQTZCLE9BQU8sQ0FBQyxDQUFSO0FBQzdCLFNBQU8sQ0FBUDtBQUNEOzs7Ozs7Ozs7OztBQ3ZLRDs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCLFE7Ozs7Ozs7Ozs7OzZCQUNWO0FBQ1AsYUFDRTtBQUFBO0FBQUEsVUFBSywwQkFBdUIsS0FBSyxLQUFMLENBQVcsSUFBWCxHQUFrQixNQUFsQixHQUEyQixFQUFsRCxDQUFMO0FBQ0UseUNBQU0sTUFBSyxTQUFYO0FBREYsT0FERjtBQUtEOzs7Ozs7a0JBUGtCLFE7Ozs7Ozs7Ozs7O0FDSHJCOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0lBRXFCLE87Ozs7Ozs7Ozs7OzhDQUNPLEssRUFBTztBQUFBOztBQUMvQixVQUFJLENBQUMsTUFBTSxRQUFYLEVBQXFCO0FBQ3JCLFlBQU0sUUFBTixDQUFlLElBQWYsQ0FBb0IsRUFBRSxNQUFNLFVBQVIsRUFBb0IsS0FBSyxNQUFNLFFBQU4sQ0FBZSxHQUF4QyxFQUFwQixFQUFtRSxnQkFBUTtBQUN6RSxlQUFLLFFBQUwsQ0FBYztBQUNaLGdCQUFNLEtBQUssT0FBTCxDQUFhO0FBRFAsU0FBZDtBQUdELE9BSkQ7QUFLRDs7QUFFRDs7Ozs7O29DQUlnQjtBQUNkLDBCQUFZLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsR0FBaEM7QUFDQSxXQUFLLEtBQUwsQ0FBVyxnQkFBWDtBQUNEOzs7aUNBRVk7QUFDWCxVQUFJLEtBQUssS0FBTCxDQUFXLElBQWYsRUFBcUIsS0FBSyxNQUFMLEdBQXJCLEtBQ0ssS0FBSyxJQUFMO0FBQ047OzsyQkFFTTtBQUFBOztBQUNMLFdBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsSUFBcEIsQ0FBeUIsRUFBRSxNQUFNLE1BQVIsRUFBZ0IsS0FBSyxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEdBQXpDLEVBQXpCLEVBQXlFLGdCQUFRO0FBQy9FLGVBQUssUUFBTCxDQUFjO0FBQ1osZ0JBQU0sS0FBSyxPQUFMLENBQWE7QUFEUCxTQUFkO0FBR0QsT0FKRDtBQUtEOzs7NkJBRVE7QUFBQTs7QUFDUCxXQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLElBQXBCLENBQXlCLEVBQUUsTUFBTSxRQUFSLEVBQWtCLEtBQUssS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixHQUEzQyxFQUF6QixFQUEyRSxnQkFBUTtBQUNqRixlQUFLLFFBQUwsQ0FBYztBQUNaLGdCQUFNO0FBRE0sU0FBZDtBQUdELE9BSkQ7QUFLRDs7OzZCQUVRO0FBQ1AsVUFBSSxDQUFDLEtBQUssS0FBTCxDQUFXLFFBQWhCLEVBQTBCOztBQUUxQixhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsU0FBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsT0FBZjtBQUNFO0FBQUE7QUFBQSxjQUFHLFdBQVUsTUFBYixFQUFvQixNQUFNLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsR0FBOUM7QUFDRSxpREFBVSxTQUFTLEtBQUssS0FBTCxDQUFXLFFBQTlCLEdBREY7QUFFRTtBQUFBO0FBQUE7QUFBSyxtQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQjtBQUF6QixhQUZGO0FBR0U7QUFBQTtBQUFBO0FBQUssK0JBQVMsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixHQUE3QjtBQUFMO0FBSEYsV0FERjtBQU1HLGVBQUssYUFBTDtBQU5IO0FBREYsT0FERjtBQVlEOzs7b0NBRWU7QUFDZCxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsU0FBZjtBQUNHLGFBQUssZ0JBQUwsRUFESDtBQUVHLGFBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsSUFBcEIsS0FBNkIsS0FBN0IsR0FBcUMsS0FBSyx5QkFBTCxFQUFyQyxHQUF3RTtBQUYzRSxPQURGO0FBTUQ7Ozt1Q0FFa0I7QUFBQTs7QUFDakIsVUFBTSxNQUFNLEtBQUssS0FBTCxDQUFXLElBQVgsR0FBa0IsNEJBQWEsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixPQUE3QixDQUFsQixHQUEwRCxFQUF0RTtBQUNBLFVBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxJQUFYLEdBQWtCLDJCQUFsQixHQUFnRCxzQkFBOUQ7O0FBRUEsYUFDRTtBQUFBO0FBQUEsVUFBSyxPQUFPLEtBQVosRUFBbUIsb0NBQWlDLEtBQUssS0FBTCxDQUFXLElBQVgsR0FBaUIsT0FBakIsR0FBMkIsRUFBNUQsQ0FBbkIsRUFBcUYsU0FBUztBQUFBLG1CQUFNLE9BQUssVUFBTCxFQUFOO0FBQUEsV0FBOUY7QUFDRSx5Q0FBTSxNQUFNLEtBQUssS0FBTCxDQUFXLElBQVgsR0FBa0IsVUFBbEIsR0FBK0IsT0FBM0MsR0FERjtBQUVHLGFBQUssS0FBTCxDQUFXLElBQVgsY0FBMkIsR0FBM0IsR0FBbUM7QUFGdEMsT0FERjtBQU1EOzs7Z0RBRTJCO0FBQUE7O0FBQzFCLGFBQ0U7QUFBQTtBQUFBLFVBQUssT0FBTSxtQ0FBWCxFQUErQyxXQUFVLHNCQUF6RCxFQUFnRixTQUFTO0FBQUEsbUJBQU0sT0FBSyxhQUFMLEVBQU47QUFBQSxXQUF6RjtBQUNFLHlDQUFNLE1BQUssT0FBWCxHQURGO0FBQUE7QUFBQSxPQURGO0FBTUQ7Ozs7OztrQkFyRmtCLE87Ozs7Ozs7O1FDTEwsTyxHQUFBLE87UUFLQSxTLEdBQUEsUztRQUlBLGUsR0FBQSxlOztBQVhoQjs7Ozs7O0FBRU8sU0FBUyxPQUFULENBQWlCLEtBQWpCLEVBQXdCO0FBQzdCLE1BQU0sU0FBUyxNQUFNLE9BQU4sQ0FBYyxTQUFkLEVBQXlCLEVBQXpCLEVBQTZCLE1BQTVDO0FBQ0EsU0FBTyxVQUFVLENBQVYsSUFBZSxDQUFDLGdCQUFnQixJQUFoQixDQUFxQixLQUFyQixDQUF2QjtBQUNEOztBQUVNLFNBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQjtBQUMvQixTQUFPLE1BQU0sSUFBTixHQUFhLE9BQWIsQ0FBcUIsVUFBckIsRUFBaUMsRUFBakMsQ0FBUDtBQUNEOztBQUVNLFNBQVMsZUFBVCxDQUF5QixHQUF6QixFQUE4QjtBQUNuQyxTQUFPLDRCQUFhLEdBQWIsQ0FBUDtBQUNEOzs7Ozs7Ozs7OztRQ1VlLEcsR0FBQSxHO1FBTUEsSSxHQUFBLEk7O0FBN0JoQjs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCLFE7OztBQUNuQixvQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsb0hBQ1gsS0FEVzs7QUFFakIsVUFBSyxLQUFMLEdBQWEsb0JBQWI7QUFDQSxVQUFLLElBQUwsR0FBWSxLQUFaO0FBSGlCO0FBSWxCOzs7OzJCQUVNLEssRUFBTztBQUFBOztBQUNaLFVBQUksTUFBTSxNQUFOLEdBQWUsQ0FBbkIsRUFBc0IsT0FBTyxLQUFLLFFBQUwsQ0FBYztBQUN6QyxjQUFNO0FBRG1DLE9BQWQsQ0FBUDs7QUFJdEIsVUFBSSxnQkFBUTtBQUNWLGVBQUssUUFBTCxDQUFjO0FBQ1osZ0JBQU0sS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLE9BQUssR0FBTCxDQUFTLEtBQUssTUFBZCxDQUFkLEVBQXFDLEdBQXJDLENBQXlDO0FBQUEsbUJBQUssT0FBSyxPQUFMLENBQWEsQ0FBYixDQUFMO0FBQUEsV0FBekM7QUFETSxTQUFkO0FBR0QsT0FKRDtBQUtEOzs7Ozs7a0JBakJrQixRO0FBb0JkLFNBQVMsR0FBVCxDQUFjLFFBQWQsRUFBd0I7QUFDN0IsU0FBTyxRQUFQLENBQWdCLEdBQWhCLENBQW9CLG9CQUFZO0FBQzlCLGFBQVMsT0FBTyxRQUFQLENBQVQ7QUFDRCxHQUZEO0FBR0Q7O0FBRU0sU0FBUyxJQUFULENBQWUsR0FBZixFQUFvQjtBQUN6QixNQUFJLFNBQVMsbUJBQWI7QUFDQSxTQUFPLEdBQVAsSUFBYyxJQUFkO0FBQ0Esb0JBQWtCLE1BQWxCO0FBQ0Q7O0FBRUQsU0FBUyxpQkFBVCxHQUE4QjtBQUM1QixNQUFJLE9BQU8sRUFBWDtBQUNBLE1BQUk7QUFDRixXQUFPLEtBQUssS0FBTCxDQUFXLGFBQWEsZ0JBQWIsQ0FBWCxDQUFQO0FBQ0QsR0FGRCxDQUVFLE9BQU8sR0FBUCxFQUFZO0FBQ1osc0JBQWtCLElBQWxCO0FBQ0Q7O0FBRUQsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBUyxpQkFBVCxDQUEyQixJQUEzQixFQUFpQztBQUMvQixlQUFhLGdCQUFiLElBQWlDLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBakM7QUFDRDs7QUFFRCxTQUFTLE1BQVQsQ0FBZ0IsUUFBaEIsRUFBMEI7QUFDeEIsTUFBTSxPQUFPLG1CQUFiO0FBQ0EsU0FBTyxTQUFTLE1BQVQsQ0FBZ0I7QUFBQSxXQUFPLENBQUMsS0FBSyxJQUFJLEdBQVQsQ0FBUjtBQUFBLEdBQWhCLENBQVA7QUFDRDs7Ozs7Ozs7Ozs7QUNyREQ7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7SUFBWSxNOztBQUNaOzs7Ozs7Ozs7Ozs7OztJQUVxQixPOzs7Ozs7Ozs7OzswQ0FDRyxTLEVBQVc7QUFDL0IsYUFBTyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEdBQW5CLEtBQTJCLFVBQVUsT0FBVixDQUFrQixHQUE3QyxJQUNMLEtBQUssS0FBTCxDQUFXLFFBQVgsS0FBd0IsVUFBVSxRQUQ3QixJQUVMLEtBQUssS0FBTCxDQUFXLElBQVgsS0FBb0IsVUFBVSxJQUZoQztBQUdEOzs7NkJBRVE7QUFDUCxXQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEtBQUssS0FBTCxDQUFXLE9BQS9CO0FBQ0Q7Ozs2QkFFUTtBQUFBOztBQUNQLGFBQ0U7QUFBQTtBQUFBLFVBQUcsSUFBSSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEVBQTFCLEVBQThCLHlCQUFzQixLQUFLLEtBQUwsQ0FBVyxRQUFYLEdBQXNCLFVBQXRCLEdBQW1DLEVBQXpELENBQTlCLEVBQTZGLE1BQU0sS0FBSyxHQUFMLEVBQW5HLEVBQStHLE9BQVUsS0FBSyxLQUFMLEVBQVYsV0FBNEIsaUJBQVMsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixHQUE1QixDQUEzSSxFQUErSyxhQUFhO0FBQUEsbUJBQU0sT0FBSyxNQUFMLEVBQU47QUFBQSxXQUE1TDtBQUNFLDZDQUFVLFNBQVMsS0FBSyxLQUFMLENBQVcsT0FBOUIsRUFBdUMsaUJBQXZDLEdBREY7QUFFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLE9BQWY7QUFDRyxlQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEVBRHRCO0FBQUE7QUFDMkIsZUFBSyxLQUFMO0FBRDNCLFNBRkY7QUFLRTtBQUFBO0FBQUEsWUFBSyxXQUFVLEtBQWY7QUFDRyxlQUFLLFNBQUw7QUFESCxTQUxGO0FBUUUsZ0NBQUssV0FBVSxPQUFmO0FBUkYsT0FERjtBQVlEOzs7NEJBSU87QUFDTixVQUFJLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsSUFBbkIsS0FBNEIsY0FBaEMsRUFBZ0Q7QUFDOUMsZUFBTyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEtBQTFCO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLElBQW5CLEtBQTRCLFdBQWhDLEVBQTZDO0FBQzNDLHlCQUFlLGlCQUFTLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsR0FBNUIsQ0FBZjtBQUNEOztBQUVELFVBQUksT0FBTyxPQUFQLENBQWUsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixLQUFsQyxDQUFKLEVBQThDO0FBQzVDLGVBQU8sT0FBTyxTQUFQLENBQWlCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsS0FBcEMsQ0FBUDtBQUNEOztBQUVELGFBQU8sT0FBTyxlQUFQLENBQXVCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsR0FBMUMsQ0FBUDtBQUNEOzs7MEJBRUs7QUFDSixVQUFJLGVBQWUsSUFBZixDQUFvQixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEdBQXZDLENBQUosRUFBaUQ7QUFDL0MsZUFBTyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEdBQTFCO0FBQ0Q7O0FBRUQsYUFBTyxZQUFZLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsR0FBdEM7QUFDRDs7O2dDQUVXO0FBQ1YsYUFBTyxpQkFBUyxLQUFLLEdBQUwsRUFBVCxDQUFQO0FBQ0Q7Ozs7OztrQkF0RGtCLE87Ozs7Ozs7Ozs7OztRQytITCxZLEdBQUEsWTtRQUlBLFksR0FBQSxZOztBQXpJaEI7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVPLElBQU0sc0NBQWU7QUFDMUIsa0JBQWdCLDhEQURVO0FBRTFCLGlCQUFlLDRGQUZXO0FBRzFCLGlCQUFlLDBEQUhXO0FBSTFCLGdCQUFjLGdHQUpZO0FBSzFCLGdCQUFjLHdFQUxZO0FBTTFCLGVBQWEsd0RBTmE7QUFPMUIsZ0JBQWMseURBUFk7QUFRMUIsbUJBQWlCLHVHQVJTO0FBUzFCLG1CQUFpQixnRUFUUztBQVUxQixnQkFBYyxrREFWWTtBQVcxQixxQkFBbUIsa0RBWE87QUFZMUIscUJBQW1CLGdFQVpPO0FBYTFCLGdCQUFjLHdEQWJZO0FBYzFCLGNBQVksK0ZBZGM7QUFlMUIsc0JBQW9CLHVEQWZNO0FBZ0IxQixtQkFBaUIsdURBaEJTO0FBaUIxQixjQUFZLGtDQWpCYztBQWtCMUIsZUFBYSxrRkFsQmE7QUFtQjFCLGFBQVcsb0VBbkJlO0FBb0IxQixnQkFBYyxzRUFwQlk7QUFxQjFCLHVCQUFxQiw2R0FyQks7QUFzQjFCLGVBQWEsNERBdEJhO0FBdUIxQixpQkFBZSw0REF2Qlc7QUF3QjFCLGVBQWEsbUNBeEJhO0FBeUIxQixvQkFBa0IsNkVBekJRO0FBMEIxQixjQUFZLHdHQTFCYztBQTJCMUIsbUJBQWlCLGdDQTNCUztBQTRCMUIsaUJBQWUsbUVBNUJXO0FBNkIxQix5QkFBdUI7QUE3QkcsQ0FBckI7O0lBZ0NjLFE7Ozs7Ozs7Ozs7OzhDQUNPLEssRUFBTztBQUMvQixVQUFJLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsR0FBbkIsS0FBMkIsTUFBTSxPQUFOLENBQWMsR0FBN0MsRUFBa0Q7QUFDaEQsYUFBSyxhQUFMLENBQW1CLE1BQU0sT0FBekI7QUFDRDtBQUNGOzs7eUNBRW9CO0FBQ25CLFdBQUssYUFBTDtBQUNEOzs7a0NBRWEsTyxFQUFTO0FBQ3JCLFdBQUssVUFBTCxDQUFnQixPQUFoQjtBQUNBLFdBQUssT0FBTCxDQUFhLEtBQUssS0FBTCxDQUFXLEdBQXhCO0FBQ0Q7OzsrQkFFVSxPLEVBQVM7QUFDbEIsa0JBQVksVUFBVSxLQUFLLEtBQUwsQ0FBVyxPQUFqQzs7QUFFQSxVQUFJLENBQUMsS0FBSyxLQUFMLENBQVcsV0FBWCxDQUFELElBQTRCLFFBQVEsTUFBcEMsSUFBOEMsUUFBUSxNQUFSLENBQWUsTUFBZixHQUF3QixDQUExRSxFQUE2RTtBQUMzRSxlQUFPLEtBQUssUUFBTCxDQUFjO0FBQ25CLGdCQUFNLE9BRGE7QUFFbkIsZUFBSyxRQUFRLE1BQVIsQ0FBZSxDQUFmO0FBRmMsU0FBZCxDQUFQO0FBSUQ7O0FBRUQsVUFBSSxRQUFRLElBQVosRUFBa0I7QUFDaEIsZUFBTyxLQUFLLFFBQUwsQ0FBYztBQUNuQixnQkFBTSxNQURhO0FBRW5CLGVBQUssZ0JBQWdCLE9BQWhCO0FBRmMsU0FBZCxDQUFQO0FBSUQ7O0FBRUQsVUFBTSxXQUFXLGFBQWEsUUFBUSxHQUFyQixDQUFqQjtBQUNBLFVBQUksYUFBYSxRQUFiLENBQUosRUFBNEI7QUFDMUIsZUFBTyxLQUFLLFFBQUwsQ0FBYztBQUNuQixnQkFBTSxjQURhO0FBRW5CLGVBQUssYUFBYSxRQUFiO0FBRmMsU0FBZCxDQUFQO0FBSUQ7O0FBRUQsV0FBSyxRQUFMLENBQWM7QUFDWixjQUFNLFNBRE07QUFFWixhQUFLLFlBQVksUUFBWixHQUF1QjtBQUZoQixPQUFkO0FBSUQ7Ozs0QkFFTyxHLEVBQUs7QUFBQTs7QUFDWCxVQUFJLEtBQUssS0FBTCxDQUFXLE9BQWYsRUFBd0I7QUFDdEIsZ0JBQVEsR0FBUixDQUFZLGlCQUFaLEVBQStCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsR0FBbEQsRUFBdUQsS0FBSyxLQUFMLENBQVcsVUFBbEUsRUFBOEUsR0FBOUU7QUFDQTtBQUNEOztBQUVELFdBQUssUUFBTCxDQUFjO0FBQ1osaUJBQVMsSUFERztBQUVaLG9CQUFZLEdBRkE7QUFHWixhQUFLLEtBQUssYUFBTDtBQUhPLE9BQWQ7O0FBTUEseUJBQUksR0FBSixFQUFTLGVBQU87QUFDZCxZQUFJLEdBQUosRUFBUztBQUNQLGtCQUFRLEtBQVIsQ0FBYyx1Q0FBZCxFQUF1RCxHQUF2RCxFQUE0RCxHQUE1RDs7QUFFQSxpQkFBTyxPQUFLLFFBQUwsQ0FBYztBQUNuQixxQkFBUyxLQURVO0FBRW5CLGlCQUFLLE9BQUssYUFBTDtBQUZjLFdBQWQsQ0FBUDtBQUlEOztBQUVELGVBQUssUUFBTCxDQUFjO0FBQ1osZUFBSyxHQURPO0FBRVosbUJBQVM7QUFGRyxTQUFkO0FBSUQsT0FkRDtBQWVEOzs7NkJBRVE7QUFDUCxVQUFNLFFBQVE7QUFDWixrQ0FBd0IsS0FBSyxLQUFMLENBQVcsR0FBbkM7QUFEWSxPQUFkOztBQUlBLGFBQ0Usd0JBQUssMEJBQXdCLEtBQUssS0FBTCxDQUFXLElBQXhDLEVBQWdELE9BQU8sS0FBdkQsR0FERjtBQUdEOzs7b0NBRWU7QUFDZCxhQUFPLDhCQUE4QixhQUFhLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsR0FBaEMsQ0FBOUIsR0FBcUUsS0FBckUsR0FBNkUsYUFBYSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLEdBQWhDLENBQXBGO0FBQ0Q7Ozs7OztrQkF4RmtCLFE7OztBQTRGckIsU0FBUyxlQUFULENBQTBCLElBQTFCLEVBQWdDO0FBQzlCLE1BQUksZUFBZSxJQUFmLENBQW9CLEtBQUssSUFBekIsQ0FBSixFQUFvQyxPQUFPLEtBQUssSUFBWjtBQUNwQyxTQUFPLGNBQWMsZ0JBQUssYUFBYSxLQUFLLEdBQWxCLENBQUwsRUFBNkIsS0FBSyxJQUFsQyxDQUFyQjtBQUNEOztBQUVNLFNBQVMsWUFBVCxDQUFzQixHQUF0QixFQUEyQjtBQUNoQyxTQUFPLElBQUksT0FBSixDQUFZLFdBQVosRUFBeUIsRUFBekIsRUFBNkIsS0FBN0IsQ0FBbUMsR0FBbkMsRUFBd0MsQ0FBeEMsRUFBMkMsT0FBM0MsQ0FBbUQsUUFBbkQsRUFBNkQsRUFBN0QsQ0FBUDtBQUNEOztBQUVNLFNBQVMsWUFBVCxDQUFzQixHQUF0QixFQUEyQjtBQUNoQyxNQUFJLENBQUMsZUFBZSxJQUFmLENBQW9CLEdBQXBCLENBQUwsRUFBK0IsT0FBTyxNQUFQO0FBQy9CLFNBQU8sSUFBSSxLQUFKLENBQVUsS0FBVixFQUFpQixDQUFqQixDQUFQO0FBQ0Q7Ozs7Ozs7Ozs7O0FDNUlEOzs7Ozs7OztJQUVxQixTOzs7Ozs7Ozs7Ozs2QkFDVjtBQUNQLFVBQU0sUUFBUTtBQUNaLGtDQUF3QixLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQXhDO0FBRFksT0FBZDs7QUFJQSxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsV0FBZixFQUEyQixPQUFPLEtBQWxDO0FBQ0csYUFBSyxZQUFMO0FBREgsT0FERjtBQUtEOzs7bUNBRWM7QUFDYixVQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixJQUF3QixLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFFBQW5EO0FBQ0EsVUFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsYUFBaEIsSUFBa0MsMkJBQTJCLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsUUFBeEY7QUFDQSxVQUFNLG9CQUFvQjtBQUN4QixrQ0FBd0IsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixhQUFoQixDQUE4QixLQUF0RDtBQUR3QixPQUExQjs7QUFJQSxhQUNFO0FBQUE7QUFBQSxVQUFHLE1BQU0sSUFBVCxFQUFlLFdBQVUsUUFBekI7QUFDRSxpQ0FBTSxXQUFVLGVBQWhCLEVBQWdDLE9BQU8saUJBQXZDLEdBREY7QUFFRTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBRkY7QUFFZ0M7QUFGaEMsT0FERjtBQU1EOzs7Ozs7a0JBMUJrQixTOzs7QUNGckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcmhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDckVBOzs7Ozs7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V0FBeEIsRUFBb0MsT0FBTSxJQUExQyxFQUErQyxRQUFPLElBQXRELEVBQTJELE1BQUssTUFBaEUsRUFBdUUsUUFBTyxjQUE5RSxFQUE2RixrQkFBZSxPQUE1RyxFQUFvSCxtQkFBZ0IsT0FBcEksRUFBNEksZ0JBQWMsS0FBSyxLQUFMLENBQVcsTUFBWCxJQUFxQixHQUEvSztBQUNFLG1DQUFRLElBQUcsSUFBWCxFQUFnQixJQUFHLEdBQW5CLEVBQXVCLEdBQUUsR0FBekIsR0FERjtBQUVFLGlDQUFNLEdBQUUsZ0NBQVI7QUFGRixPQURGO0FBTUQ7OztrQ0FFYTtBQUNaLGFBQ0U7QUFBQTtBQUFBLFVBQUssSUFBRyxTQUFSLEVBQWtCLFNBQVEsV0FBMUIsRUFBc0MsT0FBTSxJQUE1QyxFQUFpRCxRQUFPLElBQXhELEVBQTZELE1BQUssTUFBbEUsRUFBeUUsUUFBTyxjQUFoRixFQUErRixrQkFBZSxPQUE5RyxFQUFzSCxtQkFBZ0IsT0FBdEksRUFBOEksZ0JBQWMsS0FBSyxLQUFMLENBQVcsTUFBWCxJQUFxQixHQUFqTDtBQUNFLGlDQUFNLEdBQUUsZ0dBQVI7QUFERixPQURGO0FBS0Q7OztvQ0FFZTtBQUNkLGFBQ0U7QUFBQTtBQUFBLFVBQUssSUFBRyxXQUFSLEVBQW9CLFNBQVEsV0FBNUIsRUFBd0MsT0FBTSxJQUE5QyxFQUFtRCxRQUFPLElBQTFELEVBQStELE1BQUssTUFBcEUsRUFBMkUsUUFBTyxjQUFsRixFQUFpRyxrQkFBZSxPQUFoSCxFQUF3SCxtQkFBZ0IsT0FBeEksRUFBZ0osZ0JBQWMsS0FBSyxLQUFMLENBQVcsTUFBWCxJQUFxQixHQUFuTDtBQUNFLGlDQUFNLEdBQUUsNEVBQVI7QUFERixPQURGO0FBS0Q7Ozs7OztrQkFwRmtCLEkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IG1lc3NhZ2VDb3VudGVyID0gMFxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9USU1FT1VUX1NFQ1MgPSA1XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2luZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubGlzdGVuRm9yTWVzc2FnZXMoKVxuICAgIHRoaXMud2FpdGluZyA9IHt9XG4gIH1cblxuICBkcmFmdCh7IGlkLCBjb250ZW50LCBlcnJvciwgdG8sIHJlcGx5IH0pIHtcbiAgICBpZCA9IHRoaXMuZ2VuZXJhdGVJZCgpXG5cbiAgICByZXR1cm4ge1xuICAgICAgZnJvbTogdGhpcy5uYW1lLFxuICAgICAgdG86IHRvIHx8IHRoaXMudGFyZ2V0LFxuICAgICAgZXJyb3I6IGNvbnRlbnQuZXJyb3IgfHwgZXJyb3IsXG4gICAgICBpZCwgY29udGVudCwgcmVwbHlcbiAgICB9XG4gIH1cblxuICBnZW5lcmF0ZUlkKCkge1xuICAgIHJldHVybiAoRGF0ZS5ub3coKSAqIDEwMDApICsgKCsrbWVzc2FnZUNvdW50ZXIpXG4gIH1cblxuICBvblJlY2VpdmUobXNnKSB7XG4gICAgaWYgKG1zZy50byAhPT0gdGhpcy5uYW1lKSByZXR1cm4gdHJ1ZVxuXG4gICAgaWYgKG1zZy5yZXBseSAmJiB0aGlzLndhaXRpbmdbbXNnLnJlcGx5XSkge1xuICAgICAgdGhpcy53YWl0aW5nW21zZy5yZXBseV0obXNnKVxuICAgIH1cblxuICAgIGlmIChtc2cucmVwbHkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG1zZy5jb250ZW50ICYmIG1zZy5jb250ZW50LnBpbmcpIHtcbiAgICAgIHRoaXMucmVwbHkobXNnLCB7IHBvbmc6IHRydWUgfSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgcGluZyhjYWxsYmFjaykge1xuICAgIHRoaXMuc2VuZCh7IHBpbmc6IHRydWUgfSwgY2FsbGJhY2spXG4gIH1cblxuICByZXBseShtc2csIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuY29udGVudCkge1xuICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgY29udGVudDogb3B0aW9uc1xuICAgICAgfVxuICAgIH1cblxuICAgIG9wdGlvbnMucmVwbHkgPSBtc2cuaWRcbiAgICBvcHRpb25zLnRvID0gbXNnLmZyb21cblxuICAgIHRoaXMuc2VuZChvcHRpb25zKVxuICB9XG5cbiAgc2VuZChvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG1zZyA9IHRoaXMuZHJhZnQob3B0aW9ucy5jb250ZW50ID8gb3B0aW9ucyA6IHsgY29udGVudDogb3B0aW9ucyB9KVxuXG4gICAgdGhpcy5zZW5kTWVzc2FnZShtc2cpXG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMud2FpdFJlcGx5Rm9yKG1zZy5pZCwgREVGQVVMVF9USU1FT1VUX1NFQ1MsIGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIHdhaXRSZXBseUZvcihtc2dJZCwgdGltZW91dFNlY3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXNcbiAgICBsZXQgdGltZW91dCA9IHVuZGVmaW5lZFxuXG4gICAgaWYgKHRpbWVvdXRTZWNzID4gMCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQob25UaW1lb3V0LCB0aW1lb3V0U2VjcyAqIDEwMDApXG4gICAgfVxuXG4gICAgdGhpcy53YWl0aW5nW21zZ0lkXSA9IG1zZyA9PiB7XG4gICAgICBkb25lKClcbiAgICAgIGNhbGxiYWNrKG1zZylcbiAgICB9XG5cbiAgICByZXR1cm4gZG9uZVxuXG4gICAgZnVuY3Rpb24gZG9uZSAoKSB7XG4gICAgICBpZiAodGltZW91dCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgICB9XG5cbiAgICAgIHRpbWVvdXQgPSB1bmRlZmluZWRcbiAgICAgIGRlbGV0ZSBzZWxmLndhaXRpbmdbbXNnSWRdXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25UaW1lb3V0ICgpIHtcbiAgICAgIGRvbmUoKVxuICAgICAgY2FsbGJhY2soeyBlcnJvcjogJ01lc3NhZ2UgcmVzcG9uc2UgdGltZW91dCAoJyArIHRpbWVvdXRTZWNzICsnKXMuJyB9KVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvb2ttYXJrU2VhcmNoIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5uYW1lID0gJ2Jvb2ttYXJrLXNlYXJjaCdcbiAgICB0aGlzLnRpdGxlID0gJ0xpa2VkIGluIEtvem1vcydcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIGlmIChxdWVyeS5sZW5ndGggPT0gMCkgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcm93czogW11cbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBsb2FkaW5nOiB0cnVlXG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdzZWFyY2gtYm9va21hcmtzJywgcXVlcnkgfSwgcmVzcCA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogZmFsc2UgfSlcblxuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZXJyb3I6IHJlc3AuZXJyb3JcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHJvd3MgPSByZXNwLmNvbnRlbnQucmVzdWx0cy5saWtlc1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcm93czogcm93c1xuICAgICAgICAgIC5zbGljZSgwLCB0aGlzLm1heChyb3dzLmxlbmd0aCkpXG4gICAgICAgICAgLm1hcChyb3cgPT4gdGhpcy5tYXBFYWNoKHJvdykpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGJnID0gdGhpcy5wcm9wcy53YWxscGFwZXIgPyB7XG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6IGB1cmwoJHt0aGlzLnByb3BzLndhbGxwYXBlci51cmxzLnRodW1ifSlgXG4gICAgfSA6IG51bGxcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnQtd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnXCIgc3R5bGU9e2JnfT48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjZW50ZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5pbXBvcnQgeyBmaW5kSG9zdG5hbWUgfSBmcm9tICcuL3VybC1pbWFnZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlzdG9yeSBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMubmFtZSA9ICdoaXN0b3J5J1xuICAgIHRoaXMudGl0bGUgPSAnUHJldmlvdXNseSBWaXNpdGVkJ1xuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgaWYgKHF1ZXJ5Lmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyByb3dzOiBbXSB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBsb2FkaW5nOiB0cnVlXG4gICAgfSlcblxuICAgIGNocm9tZS5oaXN0b3J5LnNlYXJjaCh7IHRleHQ6IHF1ZXJ5IH0sIGhpc3RvcnkgPT4ge1xuICAgICAgY29uc3Qgcm93cyA9IGhpc3RvcnkuZmlsdGVyKGZpbHRlck91dFNlYXJjaClcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICByb3dzOiByb3dzXG4gICAgICAgICAgLnNsaWNlKDAsIHRoaXMubWF4KHJvd3MubGVuZ3RoKSlcbiAgICAgICAgICAubWFwKHJvdyA9PiB0aGlzLm1hcEVhY2gocm93KSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJPdXRTZWFyY2ggKHJvdykge1xuICByZXR1cm4gZmluZEhvc3RuYW1lKHJvdy51cmwpLnNwbGl0KCcuJylbMF0gIT09ICdnb29nbGUnXG4gICAgJiYgIS9zZWFyY2hcXC8/XFw/cVxcPVxcdyovLnRlc3Qocm93LnVybClcbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJY29uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXNbJ3JlbmRlcicgKyB0aGlzLnByb3BzLm5hbWUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoMCwgMSkgKyB0aGlzLnByb3BzLm5hbWUuc2xpY2UoMSldLmJpbmQodGhpcylcblxuICAgIGlmIChtZXRob2QpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7dGhpcy5wcm9wcy5uYW1lfWB9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAgICB7bWV0aG9kKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckFsZXJ0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1hbGVydFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTE2IDMgTDMwIDI5IDIgMjkgWiBNMTYgMTEgTDE2IDE5IE0xNiAyMyBMMTYgMjVcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2xvY2soKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWNsb2NrXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNlwiIGN5PVwiMTZcIiByPVwiMTRcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTE2IDggTDE2IDE2IDIwIDIwXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsb3NlKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jbG9zZVwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTIgMzAgTDMwIDIgTTMwIDMwIEwyIDJcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySGVhcnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxpbWcgc3JjPVwiZGF0YTppbWFnZS9zdmcreG1sO3V0Zjg7YmFzZTY0LFBEOTRiV3dnZG1WeWMybHZiajBpTVM0d0lpQmxibU52WkdsdVp6MGlhWE52TFRnNE5Ua3RNU0kvUGdvOElTMHRJRWRsYm1WeVlYUnZjam9nUVdSdlltVWdTV3hzZFhOMGNtRjBiM0lnTVRZdU1DNHdMQ0JUVmtjZ1JYaHdiM0owSUZCc2RXY3RTVzRnTGlCVFZrY2dWbVZ5YzJsdmJqb2dOaTR3TUNCQ2RXbHNaQ0F3S1NBZ0xTMCtDandoUkU5RFZGbFFSU0J6ZG1jZ1VGVkNURWxESUNJdEx5OVhNME12TDBSVVJDQlRWa2NnTVM0eEx5OUZUaUlnSW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTDBkeVlYQm9hV056TDFOV1J5OHhMakV2UkZSRUwzTjJaekV4TG1SMFpDSStDanh6ZG1jZ2VHMXNibk05SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSWlCNGJXeHVjenA0YkdsdWF6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNVGs1T1M5NGJHbHVheUlnZG1WeWMybHZiajBpTVM0eElpQnBaRDBpUTJGd1lWOHhJaUI0UFNJd2NIZ2lJSGs5SWpCd2VDSWdkMmxrZEdnOUlqSTBjSGdpSUdobGFXZG9kRDBpTWpSd2VDSWdkbWxsZDBKdmVEMGlNQ0F3SURVeE1DQTFNVEFpSUhOMGVXeGxQU0psYm1GaWJHVXRZbUZqYTJkeWIzVnVaRHB1WlhjZ01DQXdJRFV4TUNBMU1UQTdJaUI0Yld3NmMzQmhZMlU5SW5CeVpYTmxjblpsSWo0S1BHYytDZ2s4WnlCcFpEMGlabUYyYjNKcGRHVWlQZ29KQ1R4d1lYUm9JR1E5SWsweU5UVXNORGc1TGpac0xUTTFMamN0TXpVdU4wTTROaTQzTERNek5pNDJMREFzTWpVM0xqVTFMREFzTVRZd0xqWTFRekFzT0RFdU5pdzJNUzR5TERJd0xqUXNNVFF3TGpJMUxESXdMalJqTkRNdU16VXNNQ3c0Tmk0M0xESXdMalFzTVRFMExqYzFMRFV6TGpVMUlDQWdJRU15T0RNdU1EVXNOREF1T0N3ek1qWXVOQ3d5TUM0MExETTJPUzQzTlN3eU1DNDBRelEwT0M0NExESXdMalFzTlRFd0xEZ3hMallzTlRFd0xERTJNQzQyTldNd0xEazJMamt0T0RZdU55d3hOelV1T1RVdE1qRTVMak1zTWprekxqSTFUREkxTlN3ME9Ea3VObm9pSUdacGJHdzlJaU13TURBd01EQWlMejRLQ1R3dlp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOFp6NEtQQzluUGdvOEwzTjJaejRLXCIgLz5cbiAgICApXG4gIH1cblxuICByZW5kZXJSZWRIZWFydCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGltZyBzcmM9XCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmODtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaWFYTnZMVGc0TlRrdE1TSS9QZ284SVMwdElFZGxibVZ5WVhSdmNqb2dRV1J2WW1VZ1NXeHNkWE4wY21GMGIzSWdNVFl1TUM0d0xDQlRWa2NnUlhod2IzSjBJRkJzZFdjdFNXNGdMaUJUVmtjZ1ZtVnljMmx2YmpvZ05pNHdNQ0JDZFdsc1pDQXdLU0FnTFMwK0Nqd2hSRTlEVkZsUVJTQnpkbWNnVUZWQ1RFbERJQ0l0THk5WE0wTXZMMFJVUkNCVFZrY2dNUzR4THk5RlRpSWdJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MMGR5WVhCb2FXTnpMMU5XUnk4eExqRXZSRlJFTDNOMlp6RXhMbVIwWkNJK0NqeHpkbWNnZUcxc2JuTTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5JaUI0Yld4dWN6cDRiR2x1YXowaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1UazVPUzk0YkdsdWF5SWdkbVZ5YzJsdmJqMGlNUzR4SWlCcFpEMGlRMkZ3WVY4eElpQjRQU0l3Y0hnaUlIazlJakJ3ZUNJZ2QybGtkR2c5SWpJMGNIZ2lJR2hsYVdkb2REMGlNalJ3ZUNJZ2RtbGxkMEp2ZUQwaU1DQXdJRFV4TUNBMU1UQWlJSE4wZVd4bFBTSmxibUZpYkdVdFltRmphMmR5YjNWdVpEcHVaWGNnTUNBd0lEVXhNQ0ExTVRBN0lpQjRiV3c2YzNCaFkyVTlJbkJ5WlhObGNuWmxJajRLUEdjK0NnazhaeUJwWkQwaVptRjJiM0pwZEdVaVBnb0pDVHh3WVhSb0lHUTlJazB5TlRVc05EZzVMalpzTFRNMUxqY3RNelV1TjBNNE5pNDNMRE16Tmk0MkxEQXNNalUzTGpVMUxEQXNNVFl3TGpZMVF6QXNPREV1Tml3Mk1TNHlMREl3TGpRc01UUXdMakkxTERJd0xqUmpORE11TXpVc01DdzROaTQzTERJd0xqUXNNVEUwTGpjMUxEVXpMalUxSUNBZ0lFTXlPRE11TURVc05EQXVPQ3d6TWpZdU5Dd3lNQzQwTERNMk9TNDNOU3d5TUM0MFF6UTBPQzQ0TERJd0xqUXNOVEV3TERneExqWXNOVEV3TERFMk1DNDJOV013TERrMkxqa3RPRFl1Tnl3eE56VXVPVFV0TWpFNUxqTXNNamt6TGpJMVRESTFOU3cwT0RrdU5ub2lJR1pwYkd3OUlpTmxNekpoTURBaUx6NEtDVHd2Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284TDNOMlp6NEtcIiAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNlYXJjaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktc2VhcmNoXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNFwiIGN5PVwiMTRcIiByPVwiMTJcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTIzIDIzIEwzMCAzMFwiICAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRXh0ZXJuYWwoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWV4dGVybmFsXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTQgOSBMMyA5IDMgMjkgMjMgMjkgMjMgMTggTTE4IDQgTDI4IDQgMjggMTQgTTI4IDQgTDE0IDE4XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRhZygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktdGFnXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIyNFwiIGN5PVwiOFwiIHI9XCIyXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0yIDE4IEwxOCAyIDMwIDIgMzAgMTQgMTQgMzAgWlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJUcmFzaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktdHJhc2hcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0yOCA2IEw2IDYgOCAzMCAyNCAzMCAyNiA2IDQgNiBNMTYgMTIgTDE2IDI0IE0yMSAxMiBMMjAgMjQgTTExIDEyIEwxMiAyNCBNMTIgNiBMMTMgMiAxOSAyIDIwIDZcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUmlnaHRDaGV2cm9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jaGV2cm9uLXJpZ2h0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPVwiMlwiPlxuICAgICAgICA8cGF0aCBkPVwiTTEyIDMwIEwyNCAxNiAxMiAyXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ28gZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGNsYXNzTmFtZT1cImxvZ29cIiBocmVmPVwiaHR0cHM6Ly9nZXRrb3ptb3MuY29tXCI+XG4gICAgICAgIDxpbWcgc3JjPXtjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTChcImltYWdlcy9pY29uMTI4LnBuZ1wiKX0gdGl0bGU9XCJPcGVuIEtvem1vc1wiIC8+XG4gICAgICA8L2E+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVudSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHNldFRpdGxlKHRpdGxlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRpdGxlIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAge3RoaXMuc3RhdGUudGl0bGUgfHwgXCJcIn1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJidXR0b25zXCI+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBpY29uPVwiY2FsZW5kYXJcIlxuICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRUaXRsZSgnUmVjZW50bHkgVmlzaXRlZCcpfVxuICAgICAgICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLnNldFRpdGxlKCl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub3BlblJlY2VudCgpfSAvPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBpY29uPVwiaGVhcnRcIlxuICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRUaXRsZSgnQm9va21hcmtzJyl9XG4gICAgICAgICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMuc2V0VGl0bGUoKX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vcGVuQm9va21hcmtzKCl9IC8+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICBpY29uPVwiZmlyZVwiXG4gICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRUaXRsZSgnTW9zdCBWaXNpdGVkJyl9XG4gICAgICAgICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLnNldFRpdGxlKCl9XG4gICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5Ub3AoKX0gLz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgTWVzc2FnaW5nIGZyb20gJy4uL2xpYi9tZXNzYWdpbmcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZyb21OZXdUYWJUb0JhY2tncm91bmQgZXh0ZW5kcyBNZXNzYWdpbmcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5uYW1lID0gJ2tvem1vczpuZXd0YWInXG4gICAgdGhpcy50YXJnZXQgPSAna296bW9zOmJhY2tncm91bmQnXG4gIH1cblxuICBsaXN0ZW5Gb3JNZXNzYWdlcygpIHtcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobXNnID0+IHRoaXMub25SZWNlaXZlKG1zZykpXG4gIH1cblxuICBzZW5kTWVzc2FnZSAobXNnLCBjYWxsYmFjaykge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1zZywgY2FsbGJhY2spXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCwgcmVuZGVyIH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgV2FsbHBhcGVyIGZyb20gJy4vd2FsbHBhcGVyJ1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4vbWVudVwiXG5pbXBvcnQgd2FsbHBhcGVycyBmcm9tICcuL3dhbGxwYXBlcnMnXG5pbXBvcnQgU2VhcmNoIGZyb20gJy4vc2VhcmNoJ1xuaW1wb3J0IExvZ28gZnJvbSAnLi9sb2dvJ1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4vc2V0dGluZ3MnXG5cbmNsYXNzIE5ld1RhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHdhbGxwYXBlcjogbnVsbFxuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgbmV3dGFiYH0+XG4gICAgICAgIDxMb2dvIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2VudGVyXCI+XG4gICAgICAgICAgPFNlYXJjaCAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgeyB0aGlzLnN0YXRlLndhbGxwYXBlciA/IDxXYWxscGFwZXIgey4uLnRoaXMuc3RhdGUud2FsbHBhcGVyfSAvPiA6IG51bGwgfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbnJlbmRlcig8TmV3VGFiIC8+LCBkb2N1bWVudC5ib2R5KVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5pbXBvcnQgdGl0bGVGcm9tVVJMIGZyb20gXCJ0aXRsZS1mcm9tLXVybFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5U3VnZ2VzdGlvbnMgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnR5cGUgPSAncXVlcnktc3VnZ2VzdGlvbnMnXG4gIH1cblxuICBjcmVhdGVVUkxTdWdnZXN0aW9ucyhxdWVyeSkge1xuICAgIGlmICghaXNVUkwocXVlcnkpKSByZXR1cm4gW11cblxuICAgIGNvbnN0IHVybCA9IC9cXHcrOlxcL1xcLy8udGVzdChxdWVyeSkgPyBxdWVyeSA6ICdodHRwOi8vJyArIHF1ZXJ5XG5cbiAgICByZXR1cm4gW3tcbiAgICAgIHRpdGxlOiBgT3BlbiBcIiR7dGl0bGVGcm9tVVJMKHF1ZXJ5KX1cImAsXG4gICAgICB0eXBlOiAncXVlcnktc3VnZ2VzdGlvbicsXG4gICAgICB1cmxcbiAgICB9XVxuICB9XG5cbiAgY3JlYXRlU2VhcmNoU3VnZ2VzdGlvbnMocXVlcnkpIHtcbiAgICBpZiAoaXNVUkwocXVlcnkpKSByZXR1cm4gW11cblxuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vZ29vZ2xlLmNvbS9zZWFyY2g/cT0nICsgZW5jb2RlVVJJKHF1ZXJ5KSxcbiAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICB0aXRsZTogYFNlYXJjaCBcIiR7cXVlcnl9XCIgb24gR29vZ2xlYCxcbiAgICAgICAgdHlwZTogJ3NlYXJjaC1xdWVyeSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vZ2V0a296bW9zLmNvbS9zZWFyY2g/cT0nICsgZW5jb2RlVVJJKHF1ZXJ5KSxcbiAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICB0aXRsZTogYFNlYXJjaCBcIiR7cXVlcnl9XCIgb24gS296bW9zYCxcbiAgICAgICAgdHlwZTogJ3NlYXJjaC1xdWVyeSdcbiAgICAgIH1cbiAgICBdXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBpZiAocXVlcnkubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHJvd3M6IFtdIH0pXG5cbiAgICBjb25zdCByb3dzID0gdGhpcy5jcmVhdGVVUkxTdWdnZXN0aW9ucyhxdWVyeSlcbiAgICAgIC5jb25jYXQodGhpcy5jcmVhdGVTZWFyY2hTdWdnZXN0aW9ucyhxdWVyeSkpXG4gICAgICAubWFwKHJvdyA9PiB0aGlzLm1hcEVhY2gocm93KSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcm93czogcm93cy5zbGljZSgwLCB0aGlzLm1heChyb3dzLmxlbmd0aCkpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1VSTCAocXVlcnkpIHtcbiAgcmV0dXJuIHF1ZXJ5LnRyaW0oKS5pbmRleE9mKCcuJykgPiAwICYmIHF1ZXJ5LmluZGV4T2YoJyAnKSA9PT0gLTFcbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IFVSTEljb24gZnJvbSBcIi4vdXJsLWljb25cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3dzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnNldFN0YXRlKHsgcm93czogW10gfSlcbiAgICB0aGlzLnVwZGF0ZShwcm9wcy5xdWVyeSlcbiAgfVxuXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgIGlmICh0aGlzLnByb3BzLnF1ZXJ5ICE9PSBuZXh0UHJvcHMucXVlcnkgfHwgIXRoaXMuc3RhdGUucm93cyB8fCB0aGlzLnN0YXRlLnJvd3MubGVuZ3RoICE9PSBuZXh0U3RhdGUucm93cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKCghdGhpcy5wcm9wcy5zZWxlY3RlZCAmJiBuZXh0UHJvcHMuc2VsZWN0ZWQpIHx8ICh0aGlzLnByb3BzLnNlbGVjdGVkICYmICFuZXh0UHJvcHMuc2VsZWN0ZWQpIHx8ICh0aGlzLnByb3BzLnNlbGVjdGVkICYmIG5leHRQcm9wcy5zZWxlY3RlZCAmJiB0aGlzLnByb3BzLnNlbGVjdGVkLmlkICE9PSBuZXh0UHJvcHMuc2VsZWN0ZWQuaWQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGxldCBpID0gTWF0aC5taW4oNSwgdGhpcy5zdGF0ZS5yb3dzLmxlbmd0aCk7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUucm93c1tpXS51cmwgIT09IG5leHRTdGF0ZS5yb3dzW2ldLnVybCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5xdWVyeSAhPT0gcHJvcHMucXVlcnkpIHtcbiAgICAgIHRoaXMudXBkYXRlKHByb3BzLnF1ZXJ5KVxuICAgIH1cbiAgfVxuXG4gIG1hcEVhY2gocm93KSB7XG4gICAgcm93LnR5cGUgPSB0aGlzLm5hbWVcbiAgICByb3cuaWQgPSB0aGlzLnByb3BzLmlkKHJvdylcbiAgICB0aGlzLnByb3BzLm1hcFJvdyhyb3cpXG4gICAgcmV0dXJuIHJvd1xuICB9XG5cbiAgbWF4KGNvdW50KSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucmVzZXJ2ZVJvd3MoY291bnQsIHRoaXMudHlwZSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yb3dzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dzXCI+XG4gICAgICAgIHt0aGlzLnRpdGxlID8gPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICAgIDxoMT57dGhpcy50aXRsZX08L2gxPlxuICAgICAgICA8L2Rpdj4gOiBudWxsIH1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jvd3MtY29udGVudCc+XG4gICAgICAgICAge3RoaXMuc3RhdGUucm93cy5tYXAoKHJvdykgPT4gdGhpcy5yZW5kZXJSb3cocm93KSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUm93KHJvdykge1xuICAgIGlmICghdGhpcy5wcm9wcy5zZWxlY3RlZCAmJiByb3cuaWQgPT09IDEpIHtcbiAgICAgIHRoaXMucHJvcHMub25TZWxlY3Qocm93KVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8VVJMSWNvbiBjb250ZW50PXtyb3d9XG4gICAgICAgICAgICAgICBvblNlbGVjdD17dGhpcy5wcm9wcy5vblNlbGVjdH1cbiAgICAgICAgICAgICAgIHNlbGVjdGVkPXt0aGlzLnByb3BzLnNlbGVjdGVkICYmIHRoaXMucHJvcHMuc2VsZWN0ZWQuaWQgPT0gcm93LmlkfVxuICAgICAgICAgICAgICAgLz5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaElucHV0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKHRoaXMuaW5wdXQpIHRoaXMuaW5wdXQuZm9jdXMoKVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgcmV0dXJuIG5leHRTdGF0ZS52YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZVxuICB9XG5cbiAgb25RdWVyeUNoYW5nZSh2YWx1ZSwga2V5Q29kZSkge1xuICAgIGlmIChrZXlDb2RlID09PSAxMykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25QcmVzc0VudGVyKHZhbHVlKVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZSB9KVxuXG4gICAgaWYgKHRoaXMucXVlcnlDaGFuZ2VUaW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5xdWVyeUNoYW5nZVRpbWVyKVxuICAgICAgdGhpcy5xdWVyeUNoYW5nZVRpbWVyID0gMDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vblF1ZXJ5Q2hhbmdlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uUXVlcnlDaGFuZ2UodmFsdWUpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlYXJjaC1pbnB1dFwiPlxuICAgICAgICB7dGhpcy5yZW5kZXJJY29uKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlcklucHV0KCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJJY29uKCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxJY29uIG5hbWU9XCJzZWFyY2hcIiBvbmNsaWNrPXsoKSA9PiB0aGlzLmlucHV0LmZvY3VzKCl9IC8+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySW5wdXQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxpbnB1dCByZWY9e2VsID0+IHRoaXMuaW5wdXQgPSBlbH1cbiAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICBjbGFzc05hbWU9XCJpbnB1dFwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiV2hhdCBhcmUgeW91IGxvb2tpbmcgZm9yP1wiXG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMub25RdWVyeUNoYW5nZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgIG9uS2V5VXA9e2UgPT4gdGhpcy5vblF1ZXJ5Q2hhbmdlKGUudGFyZ2V0LnZhbHVlLCBlLmtleUNvZGUpfVxuICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gLz5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5cbmltcG9ydCBDb250ZW50IGZyb20gXCIuL2NvbnRlbnRcIlxuaW1wb3J0IE1lc3NhZ2luZyBmcm9tIFwiLi9tZXNzYWdpbmdcIlxuaW1wb3J0IFNlYXJjaElucHV0IGZyb20gXCIuL3NlYXJjaC1pbnB1dFwiXG5pbXBvcnQgVVJMSWNvbiBmcm9tIFwiLi91cmwtaWNvblwiXG5cbmltcG9ydCBUb3BTaXRlcyBmcm9tIFwiLi90b3Atc2l0ZXNcIlxuaW1wb3J0IFF1ZXJ5U3VnZ2VzdGlvbnMgZnJvbSBcIi4vcXVlcnktc3VnZ2VzdGlvbnNcIlxuaW1wb3J0IEJvb2ttYXJrU2VhcmNoIGZyb20gXCIuL2Jvb2ttYXJrLXNlYXJjaFwiXG5pbXBvcnQgU2lkZWJhciBmcm9tIFwiLi9zaWRlYmFyXCJcbmltcG9ydCBIaXN0b3J5IGZyb20gXCIuL2hpc3RvcnlcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2ggZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWVzc2FnaW5nKClcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaWQ6IDAsXG4gICAgICByb3dzOiB7fSxcbiAgICAgIHJvd3NBdmFpbGFibGU6IDUsXG4gICAgICBxdWVyeTogJydcbiAgICB9KVxuXG4gICAgdGhpcy5fb25LZXlQcmVzcyA9IGRlYm91bmNlKHRoaXMub25LZXlQcmVzcy5iaW5kKHRoaXMpLCA1MClcbiAgICB0aGlzLl9vblF1ZXJ5Q2hhbmdlID0gZGVib3VuY2UodGhpcy5vblF1ZXJ5Q2hhbmdlLmJpbmQodGhpcykpXG4gIH1cblxuXG4gIGlkKCkge1xuICAgIHJldHVybiArK3RoaXMuc3RhdGUuaWRcbiAgfVxuXG4gIG5hdmlnYXRlVG8odXJsKSB7XG4gICAgaWYgKCEvXlxcdys6XFwvXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9ICdodHRwOi8vJyArIHVybFxuICAgIH1cblxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB1cmxcbiAgfVxuXG4gIG1hcFJvdyhyb3cpIHtcbiAgICB0aGlzLnN0YXRlLnJvd3Nbcm93LmlkXSA9IHJvd1xuICB9XG5cbiAgc2VsZWN0TmV4dCgpIHtcbiAgICBsZXQgaWQgPSB0aGlzLnN0YXRlLnNlbGVjdGVkID8gdGhpcy5zdGF0ZS5zZWxlY3RlZC5pZCA6IDBcbiAgICBpZiAoaWQgPT0gNSkgaWQgPSAwXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOiB0aGlzLnN0YXRlLnJvd3NbaWQgKyAxXVxuICAgIH0pXG4gIH1cblxuICBzZWxlY3RQcmV2aW91cygpIHtcbiAgICBsZXQgaWQgPSB0aGlzLnN0YXRlLnNlbGVjdGVkID8gdGhpcy5zdGF0ZS5zZWxlY3RlZC5pZCA6IDZcbiAgICBpZiAoaWQgPT0gMSkgaWQgPSA2XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOiB0aGlzLnN0YXRlLnJvd3NbaWQgLSAxXVxuICAgIH0pXG4gIH1cblxuICByZXNlcnZlUm93cyhjb3VudCkge1xuICAgIGxldCBsZWZ0ID0gdGhpcy5zdGF0ZS5yb3dzQXZhaWxhYmxlIC0gY291bnRcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcm93c0F2YWlsYWJsZTogTWF0aC5tYXgobGVmdCwgMClcbiAgICB9KVxuXG4gICAgcmV0dXJuIGxlZnQgPCAwID8gY291bnQgKyBsZWZ0IDogY291bnRcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9vbktleVByZXNzLCBmYWxzZSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX29uS2V5UHJlc3MsIGZhbHNlKVxuICB9XG5cbiAgb25QcmVzc0VudGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkKSB7XG4gICAgICB0aGlzLm5hdmlnYXRlVG8odGhpcy5zdGF0ZS5zZWxlY3RlZC51cmwpXG4gICAgfVxuICB9XG5cbiAgb25LZXlQcmVzcyhlKSB7XG4gICAgaWYgKGUua2V5Q29kZSA9PSA0MCkge1xuICAgICAgdGhpcy5zZWxlY3ROZXh0KClcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSAzOCkge1xuICAgICAgdGhpcy5zZWxlY3RQcmV2aW91cygpXG4gICAgfVxuICB9XG5cbiAgb25TZWxlY3Qocm93KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWQgJiYgdGhpcy5zdGF0ZS5zZWxlY3RlZC5pZCA9PT0gcm93LmlkKSByZXR1cm5cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWQ6IHJvd1xuICAgIH0pXG4gIH1cblxuICAvKmdldFJlY2VudEJvb2ttYXJrcyhjYWxsYmFjaykge1xuICAgIHRoaXMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtcmVjZW50LWJvb2ttYXJrcycgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihyZXNwLmVycm9yKSlcbiAgICAgIGNhbGxiYWNrKHVuZGVmaW5lZCwgcmVzcC5jb250ZW50LnJlc3VsdHMubGlrZXMpXG4gICAgfSlcbiAgfVxuXG4gIHNlYXJjaEJvb2ttYXJrcyhxdWVyeSwgY2FsbGJhY2spIHtcbiAgICB0aGlzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnc2VhcmNoLWJvb2ttYXJrcycsIHF1ZXJ5IH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IocmVzcC5lcnJvcikpXG4gICAgICBpZiAocmVzcC5jb250ZW50LnF1ZXJ5ICE9PSB0aGlzLnN0YXRlLnF1ZXJ5KSByZXR1cm5cbiAgICAgIGNhbGxiYWNrKHVuZGVmaW5lZCwgcmVzcC5jb250ZW50LnJlc3VsdHMubGlrZXMpXG4gICAgfSlcbiAgfSovXG5cbiAgb25RdWVyeUNoYW5nZShxdWVyeSkge1xuICAgIHF1ZXJ5ID0gcXVlcnkudHJpbSgpXG5cbiAgICBpZiAocXVlcnkgPT09IHRoaXMuc3RhdGUucXVlcnkpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByb3dzOiB7fSxcbiAgICAgIHJvd3NBdmFpbGFibGU6IDUsXG4gICAgICBzZWxlY3RlZDogbnVsbCxcbiAgICAgIGlkOiAwLFxuICAgICAgcXVlcnlcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Q29udGVudCB3YWxscGFwZXI9e3RoaXMucHJvcHMud2FsbHBhcGVyfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50LWlubmVyXCI+XG4gICAgICAgICAgPFNlYXJjaElucHV0IG9uUHJlc3NFbnRlcj17KCkgPT4gdGhpcy5vblByZXNzRW50ZXIoKX0gb25RdWVyeUNoYW5nZT17dGhpcy5fb25RdWVyeUNoYW5nZX0gLz5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJSZXN1bHRzKCl9XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhclwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvQ29udGVudD5cbiAgICApXG4gIH1cblxuICByZW5kZXJSZXN1bHRzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRzLXJvd3NcIj5cbiAgICAgICAgICA8UXVlcnlTdWdnZXN0aW9ucyBxdWVyeT17dGhpcy5zdGF0ZS5xdWVyeX0gaWQ9eygpID0+IHRoaXMuaWQoKX0gb25TZWxlY3Q9e2lkID0+IHRoaXMub25TZWxlY3QoaWQpfSBzZWxlY3RlZD17dGhpcy5zdGF0ZS5zZWxlY3RlZH0gcmVzZXJ2ZVJvd3M9e2MgPT4gdGhpcy5yZXNlcnZlUm93cyhjKX0gbWFwUm93PXtyID0+IHRoaXMubWFwUm93KHIpfSAvPlxuICAgICAgICAgIDxUb3BTaXRlcyBxdWVyeT17dGhpcy5zdGF0ZS5xdWVyeX0gaWQ9eygpID0+IHRoaXMuaWQoKX0gb25TZWxlY3Q9e2lkID0+IHRoaXMub25TZWxlY3QoaWQpfSBzZWxlY3RlZD17dGhpcy5zdGF0ZS5zZWxlY3RlZH0gcmVzZXJ2ZVJvd3M9e2MgPT4gdGhpcy5yZXNlcnZlUm93cyhjKX0gbWFwUm93PXtyID0+IHRoaXMubWFwUm93KHIpfSAvPlxuICAgICAgICAgIDxCb29rbWFya1NlYXJjaCBtZXNzYWdlcz17dGhpcy5tZXNzYWdlc30gcXVlcnk9e3RoaXMuc3RhdGUucXVlcnl9IGlkPXsoKSA9PiB0aGlzLmlkKCl9IG9uU2VsZWN0PXtpZCA9PiB0aGlzLm9uU2VsZWN0KGlkKX0gc2VsZWN0ZWQ9e3RoaXMuc3RhdGUuc2VsZWN0ZWR9IHJlc2VydmVSb3dzPXtjID0+IHRoaXMucmVzZXJ2ZVJvd3MoYyl9IG1hcFJvdz17ciA9PiB0aGlzLm1hcFJvdyhyKX0gLz5cbiAgICAgICAgICA8SGlzdG9yeSBxdWVyeT17dGhpcy5zdGF0ZS5xdWVyeX0gaWQ9eygpID0+IHRoaXMuaWQoKX0gb25TZWxlY3Q9e2lkID0+IHRoaXMub25TZWxlY3QoaWQpfSBzZWxlY3RlZD17dGhpcy5zdGF0ZS5zZWxlY3RlZH0gcmVzZXJ2ZVJvd3M9e2MgPT4gdGhpcy5yZXNlcnZlUm93cyhjKX0gIG1hcFJvdz17ciA9PiB0aGlzLm1hcFJvdyhyKX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxTaWRlYmFyIHNlbGVjdGVkPXt0aGlzLnN0YXRlLnNlbGVjdGVkfSBtZXNzYWdlcz17dGhpcy5tZXNzYWdlc30gb25VcGRhdGVUb3BTaXRlcz17KCkgPT4gdGhpcy5vblVwZGF0ZVRvcFNpdGVzKCl9IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIHNvcnRMaWtlcyhhLCBiKSB7XG4gIGlmIChhLmxpa2VkX2F0IDwgYi5saWtlZF9hdCkgcmV0dXJuIDFcbiAgaWYgKGEubGlrZWRfYXQgPiBiLmxpa2VkX2F0KSByZXR1cm4gLTFcbiAgcmV0dXJuIDBcbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IEljb24gZnJvbSBcIi4uL3BvcHVwL2ljb25cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR0aW5ncyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BzZXR0aW5ncyAke3RoaXMucHJvcHMub3BlbiA/IFwib3BlblwiIDogXCJcIn1gfT5cbiAgICAgICAgPEljb24gbmFtZT1cIm9wdGlvbnNcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCB7IGNsZWFuIGFzIGNsZWFuVVJMIH0gZnJvbSBcInVybHNcIlxuaW1wb3J0IHJlbGF0aXZlRGF0ZSBmcm9tIFwicmVsYXRpdmUtZGF0ZVwiXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcbmltcG9ydCBVUkxJbWFnZSBmcm9tIFwiLi91cmwtaW1hZ2VcIlxuaW1wb3J0IHsgaGlkZSBhcyBoaWRlVG9wU2l0ZSB9IGZyb20gJy4vdG9wLXNpdGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWRlYmFyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICghcHJvcHMuc2VsZWN0ZWQpIHJldHVyblxuICAgIHByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LWxpa2UnLCB1cmw6IHByb3BzLnNlbGVjdGVkLnVybCB9LCByZXNwID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsaWtlOiByZXNwLmNvbnRlbnQubGlrZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLypzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zZWxlY3RlZC51cmwgIT09IG5leHRQcm9wcy5zZWxlY3RlZC51cmxcbiAgICB9Ki9cblxuICBkZWxldGVUb3BTaXRlKCkge1xuICAgIGhpZGVUb3BTaXRlKHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsKVxuICAgIHRoaXMucHJvcHMub25VcGRhdGVUb3BTaXRlcygpXG4gIH1cblxuICB0b2dnbGVMaWtlKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmxpa2UpIHRoaXMudW5saWtlKClcbiAgICBlbHNlIHRoaXMubGlrZSgpXG4gIH1cblxuICBsaWtlKCkge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdsaWtlJywgdXJsOiB0aGlzLnByb3BzLnNlbGVjdGVkLnVybCB9LCByZXNwID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsaWtlOiByZXNwLmNvbnRlbnQubGlrZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgdW5saWtlKCkge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICd1bmxpa2UnLCB1cmw6IHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsIH0sIHJlc3AgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxpa2U6IG51bGxcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuc2VsZWN0ZWQpIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2lkZWJhclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltYWdlXCI+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwibGlua1wiIGhyZWY9e3RoaXMucHJvcHMuc2VsZWN0ZWQudXJsfT5cbiAgICAgICAgICAgIDxVUkxJbWFnZSBjb250ZW50PXt0aGlzLnByb3BzLnNlbGVjdGVkfSAvPlxuICAgICAgICAgICAgPGgxPnt0aGlzLnByb3BzLnNlbGVjdGVkLnRpdGxlfTwvaDE+XG4gICAgICAgICAgICA8aDI+e2NsZWFuVVJMKHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsKX08L2gyPlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJCdXR0b25zKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQnV0dG9ucygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidXR0b25zXCI+XG4gICAgICAgIHt0aGlzLnJlbmRlckxpa2VCdXR0b24oKX1cbiAgICAgICAge3RoaXMucHJvcHMuc2VsZWN0ZWQudHlwZSA9PT0gJ3RvcCcgPyB0aGlzLnJlbmRlckRlbGV0ZVRvcFNpdGVCdXR0b24oKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJMaWtlQnV0dG9uKCkge1xuICAgIGNvbnN0IGFnbyA9IHRoaXMuc3RhdGUubGlrZSA/IHJlbGF0aXZlRGF0ZSh0aGlzLnN0YXRlLmxpa2UubGlrZWRBdCkgOiBcIlwiXG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLnN0YXRlLmxpa2UgPyBcIkRlbGV0ZSBJdCBGcm9tIFlvdXIgTGlrZXNcIiA6IFwiQWRkIEl0IFRvIFlvdXIgTGlrZXNcIlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgdGl0bGU9e3RpdGxlfSBjbGFzc05hbWU9e2BidXR0b24gbGlrZS1idXR0b24gJHt0aGlzLnN0YXRlLmxpa2U/IFwibGlrZWRcIiA6IFwiXCJ9YH0gb25DbGljaz17KCkgPT4gdGhpcy50b2dnbGVMaWtlKCl9PlxuICAgICAgICA8SWNvbiBuYW1lPXt0aGlzLnN0YXRlLmxpa2UgPyBcInJlZEhlYXJ0XCIgOiBcImhlYXJ0XCIgfSAvPlxuICAgICAgICB7dGhpcy5zdGF0ZS5saWtlID8gYExpa2VkICR7YWdvfWAgOiBcIkxpa2UgSXRcIn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckRlbGV0ZVRvcFNpdGVCdXR0b24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgdGl0bGU9XCJEZWxldGUgSXQgRnJvbSBGcmVxdWVudGx5IFZpc2l0ZWRcIiBjbGFzc05hbWU9XCJidXR0b24gZGVsZXRlLWJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHRoaXMuZGVsZXRlVG9wU2l0ZSgpfT5cbiAgICAgICAgPEljb24gbmFtZT1cInRyYXNoXCIgLz5cbiAgICAgICAgRGVsZXRlIEl0XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxufVxuIiwiaW1wb3J0IHRpdGxlRnJvbVVSTCBmcm9tIFwidGl0bGUtZnJvbS11cmxcIlxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZCh0aXRsZSkge1xuICBjb25zdCBhYnNsZW4gPSB0aXRsZS5yZXBsYWNlKC9bXlxcd10rL2csICcnKS5sZW5ndGhcbiAgcmV0dXJuIGFic2xlbiA+PSAyICYmICEvXmh0dHBcXHc/OlxcL1xcLy8udGVzdCh0aXRsZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZSh0aXRsZSkge1xuICByZXR1cm4gdGl0bGUudHJpbSgpLnJlcGxhY2UoL15cXChcXGQrXFwpLywgJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUZyb21VUkwodXJsKSB7XG4gIHJldHVybiB0aXRsZUZyb21VUkwodXJsKVxufVxuIiwiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvcFNpdGVzIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy50aXRsZSA9ICdGcmVxdWVudGx5IFZpc2l0ZWQnXG4gICAgdGhpcy5uYW1lID0gJ3RvcCdcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIGlmIChxdWVyeS5sZW5ndGggPiAwKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByb3dzOiBbXVxuICAgIH0pXG5cbiAgICBnZXQocm93cyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcm93czogcm93cy5zbGljZSgwLCB0aGlzLm1heChyb3dzLmxlbmd0aCkpLm1hcChyID0+IHRoaXMubWFwRWFjaChyKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0IChjYWxsYmFjaykge1xuICBjaHJvbWUudG9wU2l0ZXMuZ2V0KHRvcFNpdGVzID0+IHtcbiAgICBjYWxsYmFjayhmaWx0ZXIodG9wU2l0ZXMpKVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlkZSAodXJsKSB7XG4gIGxldCBoaWRkZW4gPSBnZXRIaWRkZW5Ub3BTaXRlcygpXG4gIGhpZGRlblt1cmxdID0gdHJ1ZVxuICBzZXRIaWRkZW5Ub3BTaXRlcyhoaWRkZW4pXG59XG5cbmZ1bmN0aW9uIGdldEhpZGRlblRvcFNpdGVzICgpIHtcbiAgbGV0IGxpc3QgPSB7fVxuICB0cnkge1xuICAgIGxpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVsnaGlkZGVuLXRvcGxpc3QnXSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgc2V0SGlkZGVuVG9wU2l0ZXMobGlzdClcbiAgfVxuXG4gIHJldHVybiBsaXN0XG59XG5cbmZ1bmN0aW9uIHNldEhpZGRlblRvcFNpdGVzKGxpc3QpIHtcbiAgbG9jYWxTdG9yYWdlWydoaWRkZW4tdG9wbGlzdCddID0gSlNPTi5zdHJpbmdpZnkobGlzdClcbn1cblxuZnVuY3Rpb24gZmlsdGVyKHRvcFNpdGVzKSB7XG4gIGNvbnN0IGhpZGUgPSBnZXRIaWRkZW5Ub3BTaXRlcygpXG4gIHJldHVybiB0b3BTaXRlcy5maWx0ZXIocm93ID0+ICFoaWRlW3Jvdy51cmxdKVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgaW1nIGZyb20gJ2ltZydcbmltcG9ydCB7IGNsZWFuIGFzIGNsZWFuVVJMIH0gZnJvbSBcInVybHNcIlxuaW1wb3J0ICogYXMgdGl0bGVzIGZyb20gXCIuL3RpdGxlc1wiXG5pbXBvcnQgVVJMSW1hZ2UgZnJvbSAnLi91cmwtaW1hZ2UnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVSTEljb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuY29udGVudC51cmwgIT09IG5leHRQcm9wcy5jb250ZW50LnVybCB8fFxuICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZCAhPT0gbmV4dFByb3BzLnNlbGVjdGVkIHx8XG4gICAgICB0aGlzLnByb3BzLnR5cGUgIT09IG5leHRQcm9wcy50eXBlXG4gIH1cblxuICBzZWxlY3QoKSB7XG4gICAgdGhpcy5wcm9wcy5vblNlbGVjdCh0aGlzLnByb3BzLmNvbnRlbnQpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGlkPXt0aGlzLnByb3BzLmNvbnRlbnQuaWR9IGNsYXNzTmFtZT17YHVybGljb24gJHt0aGlzLnByb3BzLnNlbGVjdGVkID8gXCJzZWxlY3RlZFwiIDogXCJcIn1gfSBocmVmPXt0aGlzLnVybCgpfSB0aXRsZT17YCR7dGhpcy50aXRsZSgpfSAtICR7Y2xlYW5VUkwodGhpcy5wcm9wcy5jb250ZW50LnVybCl9YH0gb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2VsZWN0KCl9PlxuICAgICAgICA8VVJMSW1hZ2UgY29udGVudD17dGhpcy5wcm9wcy5jb250ZW50fSBpY29uLW9ubHkgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNvbnRlbnQuaWR9IHt0aGlzLnRpdGxlKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVybFwiPlxuICAgICAgICAgIHt0aGlzLnByZXR0eVVSTCgpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhclwiPjwvZGl2PlxuICAgICAgPC9hPlxuICAgIClcbiAgfVxuXG5cblxuICB0aXRsZSgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jb250ZW50LnR5cGUgPT09ICdzZWFyY2gtcXVlcnknKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5jb250ZW50LnRpdGxlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC50eXBlID09PSAndXJsLXF1ZXJ5Jykge1xuICAgICAgcmV0dXJuIGBPcGVuICR7Y2xlYW5VUkwodGhpcy5wcm9wcy5jb250ZW50LnVybCl9YFxuICAgIH1cblxuICAgIGlmICh0aXRsZXMuaXNWYWxpZCh0aGlzLnByb3BzLmNvbnRlbnQudGl0bGUpKSB7XG4gICAgICByZXR1cm4gdGl0bGVzLm5vcm1hbGl6ZSh0aGlzLnByb3BzLmNvbnRlbnQudGl0bGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRpdGxlcy5nZW5lcmF0ZUZyb21VUkwodGhpcy5wcm9wcy5jb250ZW50LnVybClcbiAgfVxuXG4gIHVybCgpIHtcbiAgICBpZiAoL15odHRwcz86XFwvXFwvLy50ZXN0KHRoaXMucHJvcHMuY29udGVudC51cmwpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5jb250ZW50LnVybFxuICAgIH1cblxuICAgIHJldHVybiAnaHR0cDovLycgKyB0aGlzLnByb3BzLmNvbnRlbnQudXJsXG4gIH1cblxuICBwcmV0dHlVUkwoKSB7XG4gICAgcmV0dXJuIGNsZWFuVVJMKHRoaXMudXJsKCkpXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IGltZyBmcm9tICdpbWcnXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcblxuZXhwb3J0IGNvbnN0IHBvcHVsYXJJY29ucyA9IHtcbiAgJ2ZhY2Vib29rLmNvbSc6ICdodHRwczovL3N0YXRpYy54eC5mYmNkbi5uZXQvcnNyYy5waHAvdjMveXgvci9ONEhfNTBLRnA4aS5wbmcnLFxuICAndHdpdHRlci5jb20nOiAnaHR0cHM6Ly9tYS0wLnR3aW1nLmNvbS90d2l0dGVyLWFzc2V0cy9yZXNwb25zaXZlLXdlYi93ZWIvbHRyL2ljb24taW9zLmE5Y2Q4ODViY2NiY2FmMmYucG5nJyxcbiAgJ3lvdXR1YmUuY29tJzogJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3l0cy9pbWcvZmF2aWNvbl85Ni12ZmxXOUVjMHcucG5nJyxcbiAgJ2FtYXpvbi5jb20nOiAnaHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9HLzAxL2FueXdoZXJlL2Ffc21pbGVfMTIweDEyMC5fQ0IzNjgyNDY1NzNfLnBuZycsXG4gICdnb29nbGUuY29tJzogJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2JyYW5kaW5nL3Byb2R1Y3RfaW9zLzJ4L2dzYV9pb3NfNjBkcC5wbmcnLFxuICAneWFob28uY29tJzogJ2h0dHBzOi8vd3d3LnlhaG9vLmNvbS9hcHBsZS10b3VjaC1pY29uLXByZWNvbXBvc2VkLnBuZycsXG4gICdyZWRkaXQuY29tJzogJ2h0dHBzOi8vd3d3LnJlZGRpdHN0YXRpYy5jb20vbXdlYjJ4L2Zhdmljb24vMTIweDEyMC5wbmcnLFxuICAnaW5zdGFncmFtLmNvbSc6ICdodHRwczovL3d3dy5pbnN0YWdyYW0uY29tL3N0YXRpYy9pbWFnZXMvaWNvL2FwcGxlLXRvdWNoLWljb24tMTIweDEyMC1wcmVjb21wb3NlZC5wbmcvMDA0NzA1YzkzNTNmLnBuZycsXG4gICdnZXRrb3ptb3MuY29tJzogJ2h0dHBzOi8vZ2V0a296bW9zLmNvbS9wdWJsaWMvbG9nb3Mva296bW9zLWhlYXJ0LWxvZ28tMTAwcHgucG5nJyxcbiAgJ2dpdGh1Yi5jb20nOiAnaHR0cHM6Ly9hc3NldHMtY2RuLmdpdGh1Yi5jb20vcGlubmVkLW9jdG9jYXQuc3ZnJyxcbiAgJ2dpc3QuZ2l0aHViLmNvbSc6ICdodHRwczovL2Fzc2V0cy1jZG4uZ2l0aHViLmNvbS9waW5uZWQtb2N0b2NhdC5zdmcnLFxuICAnbWFpbC5nb29nbGUuY29tJzogJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2ljb25zL3Byb2R1Y3QvZ29vZ2xlbWFpbC0xMjgucG5nJyxcbiAgJ3BheXBhbC5jb20nOiAnaHR0cHM6Ly93d3cucGF5cGFsb2JqZWN0cy5jb20vd2Vic3RhdGljL2ljb24vcHAxNDQucG5nJyxcbiAgJ2ltZGIuY29tJzogJ2h0dHA6Ly9pYS5tZWRpYS1pbWRiLmNvbS9pbWFnZXMvRy8wMS9pbWRiL2ltYWdlcy9kZXNrdG9wLWZhdmljb24tMjE2NTgwNjk3MC5fQ0I1MjI3MzY1NjFfLmljbycsXG4gICdlbi53aWtpcGVkaWEub3JnJzogJ2h0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy9zdGF0aWMvZmF2aWNvbi93aWtpcGVkaWEuaWNvJyxcbiAgJ3dpa2lwZWRpYS5vcmcnOiAnaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3N0YXRpYy9mYXZpY29uL3dpa2lwZWRpYS5pY28nLFxuICAnZXNwbi5jb20nOiAnaHR0cDovL2EuZXNwbmNkbi5jb20vZmF2aWNvbi5pY28nLFxuICAndHdpdGNoLnR2JzogJ2h0dHBzOi8vc3RhdGljLnR3aXRjaGNkbi5uZXQvYXNzZXRzL2Zhdmljb24tNzUyNzBmOWRmMmIwNzE3NGMyM2NlODQ0YTAzZDg0YWYuaWNvJyxcbiAgJ2Nubi5jb20nOiAnaHR0cDovL2Nkbi5jbm4uY29tL2Nubi8uZS9pbWcvMy4wL2dsb2JhbC9taXNjL2FwcGxlLXRvdWNoLWljb24ucG5nJyxcbiAgJ29mZmljZS5jb20nOiAnaHR0cHM6Ly9zZWFvZmZpY2Vob21lLm1zb2Nkbi5jb20vcy83MDQ3NDUyZS9JbWFnZXMvZmF2aWNvbl9tZXRyby5pY28nLFxuICAnYmFua29mYW1lcmljYS5jb20nOiAnaHR0cHM6Ly93d3cxLmJhYy1hc3NldHMuY29tL2hvbWVwYWdlL3NwYS1hc3NldHMvaW1hZ2VzL2Fzc2V0cy1pbWFnZXMtZ2xvYmFsLWZhdmljb24tZmF2aWNvbi1DU1gzODZiMzMyZC5pY28nLFxuICAnY2hhc2UuY29tJzogJ2h0dHBzOi8vd3d3LmNoYXNlLmNvbS9ldGMvZGVzaWducy9jaGFzZS11eC9mYXZpY29uLTE1Mi5wbmcnLFxuICAnbnl0aW1lcy5jb20nOiAnaHR0cHM6Ly9zdGF0aWMwMS5ueXQuY29tL2ltYWdlcy9pY29ucy9pb3MtaXBhZC0xNDR4MTQ0LnBuZycsXG4gICdhcHBsZS5jb20nOiAnaHR0cHM6Ly93d3cuYXBwbGUuY29tL2Zhdmljb24uaWNvJyxcbiAgJ3dlbGxzZmFyZ28uY29tJzogJ2h0dHBzOi8vd3d3LndlbGxzZmFyZ28uY29tL2Fzc2V0cy9pbWFnZXMvaWNvbnMvYXBwbGUtdG91Y2gtaWNvbi0xMjB4MTIwLnBuZycsXG4gICd5ZWxwLmNvbSc6ICdodHRwczovL3MzLW1lZGlhMi5mbC55ZWxwY2RuLmNvbS9hc3NldHMvc3J2MC95ZWxwX3N0eWxlZ3VpZGUvMTE4ZmY0NzVhMzQxL2Fzc2V0cy9pbWcvbG9nb3MvZmF2aWNvbi5pY28nLFxuICAnd29yZHByZXNzLmNvbSc6ICdodHRwOi8vczAud3AuY29tL2kvd2ViY2xpcC5wbmcnLFxuICAnZHJvcGJveC5jb20nOiAnaHR0cHM6Ly9jZmwuZHJvcGJveHN0YXRpYy5jb20vc3RhdGljL2ltYWdlcy9mYXZpY29uLXZmbFVlTGVlWS5pY28nLFxuICAnbWFpbC5zdXBlcmh1bWFuLmNvbSc6ICdodHRwczovL3N1cGVyaHVtYW4uY29tL2J1aWxkLzcxMjIyYmRjMTY5ZTU5MDZjMjgyNDdlZDViN2NmMGVkLnNoYXJlLWljb24ucG5nJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVUkxJbWFnZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jb250ZW50LnVybCAhPT0gcHJvcHMuY29udGVudC51cmwpIHtcbiAgICAgIHRoaXMucmVmcmVzaFNvdXJjZShwcm9wcy5jb250ZW50KVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLnJlZnJlc2hTb3VyY2UoKVxuICB9XG5cbiAgcmVmcmVzaFNvdXJjZShjb250ZW50KSB7XG4gICAgdGhpcy5maW5kU291cmNlKGNvbnRlbnQpXG4gICAgdGhpcy5wcmVsb2FkKHRoaXMuc3RhdGUuc3JjKVxuICB9XG5cbiAgZmluZFNvdXJjZShjb250ZW50KSB7XG4gICAgY29udGVudCB8fCAoY29udGVudCA9IHRoaXMucHJvcHMuY29udGVudClcblxuICAgIGlmICghdGhpcy5wcm9wc1snaWNvbi1vbmx5J10gJiYgY29udGVudC5pbWFnZXMgJiYgY29udGVudC5pbWFnZXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzcmM6IGNvbnRlbnQuaW1hZ2VzWzBdXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChjb250ZW50Lmljb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdHlwZTogJ2ljb24nLFxuICAgICAgICBzcmM6IGFic29sdXRlSWNvblVSTChjb250ZW50KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBob3N0bmFtZSA9IGZpbmRIb3N0bmFtZShjb250ZW50LnVybClcbiAgICBpZiAocG9wdWxhckljb25zW2hvc3RuYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0eXBlOiAncG9wdWxhci1pY29uJyxcbiAgICAgICAgc3JjOiBwb3B1bGFySWNvbnNbaG9zdG5hbWVdXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdHlwZTogJ2Zhdmljb24nLFxuICAgICAgc3JjOiAnaHR0cDovLycgKyBob3N0bmFtZSArICcvZmF2aWNvbi5pY28nXG4gICAgfSlcbiAgfVxuXG4gIHByZWxvYWQoc3JjKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubG9hZGluZykge1xuICAgICAgY29uc29sZS5sb2coJ2FscmVhZHkgbG9hZGluZycsIHRoaXMucHJvcHMuY29udGVudC51cmwsIHRoaXMuc3RhdGUubG9hZGluZ1NyYywgc3JjKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgbG9hZGluZ1NyYzogc3JjLFxuICAgICAgc3JjOiB0aGlzLmNhY2hlZEljb25VUkwoKVxuICAgIH0pXG5cbiAgICBpbWcoc3JjLCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdJbWFnZSBmYWlsZWQgdG8gbG9hZC4gc3JjOiAlcyB1cmw6ICVzJywgc3JjLCBlcnIpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgIHNyYzogdGhpcy5jYWNoZWRJY29uVVJMKClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNyYzogc3JjLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7dGhpcy5zdGF0ZS5zcmN9KWBcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2B1cmwtaW1hZ2UgJHt0aGlzLnN0YXRlLnR5cGV9YH0gc3R5bGU9e3N0eWxlfT48L2Rpdj5cbiAgICApXG4gIH1cblxuICBjYWNoZWRJY29uVVJMKCkge1xuICAgIHJldHVybiAnY2hyb21lOi8vZmF2aWNvbi9zaXplLzcyLycgKyBmaW5kUHJvdG9jb2wodGhpcy5wcm9wcy5jb250ZW50LnVybCkgKyAnOi8vJyArIGZpbmRIb3N0bmFtZSh0aGlzLnByb3BzLmNvbnRlbnQudXJsKVxuICB9XG5cbn1cblxuZnVuY3Rpb24gYWJzb2x1dGVJY29uVVJMIChsaWtlKSB7XG4gIGlmICgvXmh0dHBzPzpcXC9cXC8vLnRlc3QobGlrZS5pY29uKSkgcmV0dXJuIGxpa2UuaWNvblxuICByZXR1cm4gJ2h0dHA6XFwvXFwvJyArIGpvaW4oZmluZEhvc3RuYW1lKGxpa2UudXJsKSwgbGlrZS5pY29uKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEhvc3RuYW1lKHVybCkge1xuICByZXR1cm4gdXJsLnJlcGxhY2UoL15cXHcrOlxcL1xcLy8sICcnKS5zcGxpdCgnLycpWzBdLnJlcGxhY2UoL153d3dcXC4vLCAnJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQcm90b2NvbCh1cmwpIHtcbiAgaWYgKCEvXmh0dHBzPzpcXC9cXC8vLnRlc3QodXJsKSkgcmV0dXJuICdodHRwJ1xuICByZXR1cm4gdXJsLnNwbGl0KCc6Ly8nKVswXVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGxwYXBlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke3RoaXMucHJvcHMudXJscy5mdWxsfSlgXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2FsbHBhcGVyXCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAge3RoaXMucmVuZGVyQXV0aG9yKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJBdXRob3IoKSB7XG4gICAgbGV0IG5hbWUgPSB0aGlzLnN0YXRlLnVzZXIubmFtZSB8fCB0aGlzLnN0YXRlLnVzZXIudXNlcm5hbWVcbiAgICBsZXQgbGluayA9IHRoaXMuc3RhdGUudXNlci5wb3J0Zm9saW9fdXJsIHx8ICgnaHR0cHM6Ly91bnNwbGFzaC5jb20vQCcgKyB0aGlzLnN0YXRlLnVzZXIudXNlcm5hbWUpXG4gICAgY29uc3QgcHJvZmlsZVBob3RvU3R5bGUgPSB7XG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6IGB1cmwoJHt0aGlzLnN0YXRlLnVzZXIucHJvZmlsZV9pbWFnZS5zbWFsbH0pYFxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8YSBocmVmPXtsaW5rfSBjbGFzc05hbWU9XCJhdXRob3JcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicHJvZmlsZS1pbWFnZVwiIHN0eWxlPXtwcm9maWxlUGhvdG9TdHlsZX0+PC9zcGFuPlxuICAgICAgICA8bGFiZWw+UGhvdG9ncmFwaGVyOiA8L2xhYmVsPntuYW1lfVxuICAgICAgPC9hPlxuICAgIClcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuICB7XG4gICAgXCJjYXRlZ29yaWVzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJpZFwiOiA0LFxuICAgICAgICBcImxpbmtzXCI6IHtcbiAgICAgICAgICBcInBob3Rvc1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS9jYXRlZ29yaWVzLzQvcGhvdG9zXCIsXG4gICAgICAgICAgXCJzZWxmXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL2NhdGVnb3JpZXMvNFwiXG4gICAgICAgIH0sXG4gICAgICAgIFwicGhvdG9fY291bnRcIjogNTQxODQsXG4gICAgICAgIFwidGl0bGVcIjogXCJOYXR1cmVcIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJjb2xvclwiOiBcIiNDMEMxOThcIixcbiAgICBcImNyZWF0ZWRfYXRcIjogXCIyMDE2LTAzLTIzVDA1OjA5OjQ3LTA0OjAwXCIsXG4gICAgXCJjdXJyZW50X3VzZXJfY29sbGVjdGlvbnNcIjogW10sXG4gICAgXCJkZXNjcmlwdGlvblwiOiBudWxsLFxuICAgIFwiaGVpZ2h0XCI6IDMzMTksXG4gICAgXCJpZFwiOiBcIkRNY0kwY21ZSllrXCIsXG4gICAgXCJsaWtlZF9ieV91c2VyXCI6IGZhbHNlLFxuICAgIFwibGlrZXNcIjogMTIwMyxcbiAgICBcImxpbmtzXCI6IHtcbiAgICAgIFwiZG93bmxvYWRcIjogXCJodHRwOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9ETWNJMGNtWUpZay9kb3dubG9hZFwiLFxuICAgICAgXCJkb3dubG9hZF9sb2NhdGlvblwiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS9waG90b3MvRE1jSTBjbVlKWWsvZG93bmxvYWRcIixcbiAgICAgIFwiaHRtbFwiOiBcImh0dHA6Ly91bnNwbGFzaC5jb20vcGhvdG9zL0RNY0kwY21ZSllrXCIsXG4gICAgICBcInNlbGZcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vcGhvdG9zL0RNY0kwY21ZSllrXCJcbiAgICB9LFxuICAgIFwidXBkYXRlZF9hdFwiOiBcIjIwMTctMDctMDFUMDM6NTM6NTQtMDQ6MDBcIixcbiAgICBcInVybHNcIjoge1xuICAgICAgXCJmdWxsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTg3MjQwMjk5MzYtMmNjNmVlMzhmNWVmP2l4bGliPXJiLTAuMy41JnE9ODUmZm09anBnJmNyb3A9ZW50cm9weSZjcz1zcmdiJnM9NjYzOTU4MzA5YzlkZDMzYTZkZjAxYzNmM2M5M2VkMWRcIixcbiAgICAgIFwicmF3XCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTg3MjQwMjk5MzYtMmNjNmVlMzhmNWVmXCIsXG4gICAgICBcInJlZ3VsYXJcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1ODcyNDAyOTkzNi0yY2M2ZWUzOGY1ZWY/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXRpbnlzcmdiJnc9MTA4MCZmaXQ9bWF4JnM9NGI4N2ViNjI0MmY2YTQ1MWEyMTI1MjkwYWRiY2IzN2FcIixcbiAgICAgIFwic21hbGxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1ODcyNDAyOTkzNi0yY2M2ZWUzOGY1ZWY/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXRpbnlzcmdiJnc9NDAwJmZpdD1tYXgmcz00YzQxNzc2OWE0NjU2OWJhMzdjZWQ3YTgyZDdiOTE4Y1wiLFxuICAgICAgXCJ0aHVtYlwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU4NzI0MDI5OTM2LTJjYzZlZTM4ZjVlZj9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9dGlueXNyZ2Imdz0yMDAmZml0PW1heCZzPTAyNzU3YmUzZDliNGRjYmY4MzYyYzE1NDY2Y2E0NzI1XCJcbiAgICB9LFxuICAgIFwidXNlclwiOiB7XG4gICAgICBcImJpb1wiOiBcIkVuZ2xpc2ggcGhvdG9ncmFwaGVyIGxpdmluZyBpbiBTeWRuZXksIEF1c3RyYWxpYS4gU2hvb3Rpbmcgd2l0aCBhIENhbm9uIDZELlxcclxcblxcclxcblNhbXNjcmltQGdvb2dsZW1haWwuY29tXFxyXFxuXCIsXG4gICAgICBcImZpcnN0X25hbWVcIjogXCJTYW11ZWxcIixcbiAgICAgIFwiaWRcIjogXCJXZE5lWXFrZllLTVwiLFxuICAgICAgXCJsYXN0X25hbWVcIjogXCJTY3JpbXNoYXdcIixcbiAgICAgIFwibGlua3NcIjoge1xuICAgICAgICBcImZvbGxvd2Vyc1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9zYW1zY3JpbS9mb2xsb3dlcnNcIixcbiAgICAgICAgXCJmb2xsb3dpbmdcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvc2Ftc2NyaW0vZm9sbG93aW5nXCIsXG4gICAgICAgIFwiaHRtbFwiOiBcImh0dHA6Ly91bnNwbGFzaC5jb20vQHNhbXNjcmltXCIsXG4gICAgICAgIFwibGlrZXNcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvc2Ftc2NyaW0vbGlrZXNcIixcbiAgICAgICAgXCJwaG90b3NcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvc2Ftc2NyaW0vcGhvdG9zXCIsXG4gICAgICAgIFwicG9ydGZvbGlvXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL3NhbXNjcmltL3BvcnRmb2xpb1wiLFxuICAgICAgICBcInNlbGZcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvc2Ftc2NyaW1cIlxuICAgICAgfSxcbiAgICAgIFwibG9jYXRpb25cIjogXCJBdXN0cmFsaWFcIixcbiAgICAgIFwibmFtZVwiOiBcIlNhbXVlbCBTY3JpbXNoYXdcIixcbiAgICAgIFwicG9ydGZvbGlvX3VybFwiOiBcImh0dHA6Ly93d3cuaW5zdGFncmFtLmNvbS9zYW1zY3JpbVwiLFxuICAgICAgXCJwcm9maWxlX2ltYWdlXCI6IHtcbiAgICAgICAgXCJsYXJnZVwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9wcm9maWxlLTE0NTg3MjM2NzkyNjEtYTVlZjMyY2IyYTA0P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZmFjZXMmY3M9dGlueXNyZ2ImZml0PWNyb3AmaD0xMjgmdz0xMjgmcz0xNWFmY2U0ZmQyODYwNzRkOTJmYTcyNjMyZDhjYWEzNFwiLFxuICAgICAgICBcIm1lZGl1bVwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9wcm9maWxlLTE0NTg3MjM2NzkyNjEtYTVlZjMyY2IyYTA0P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZmFjZXMmY3M9dGlueXNyZ2ImZml0PWNyb3AmaD02NCZ3PTY0JnM9NDUwOTY0NWI5Mjg5YTlmZWE4Yjg1NTE4Yzc3Y2UwZWRcIixcbiAgICAgICAgXCJzbWFsbFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9wcm9maWxlLTE0NTg3MjM2NzkyNjEtYTVlZjMyY2IyYTA0P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZmFjZXMmY3M9dGlueXNyZ2ImZml0PWNyb3AmaD0zMiZ3PTMyJnM9OTBlYTc1OGJlNjk5OTgwN2I2ZDhkYTFlYzYwMjUzMGZcIlxuICAgICAgfSxcbiAgICAgIFwidG90YWxfY29sbGVjdGlvbnNcIjogMCxcbiAgICAgIFwidG90YWxfbGlrZXNcIjogMCxcbiAgICAgIFwidG90YWxfcGhvdG9zXCI6IDE0LFxuICAgICAgXCJ0d2l0dGVyX3VzZXJuYW1lXCI6IG51bGwsXG4gICAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE3LTA3LTAxVDA3OjA1OjI0LTA0OjAwXCIsXG4gICAgICBcInVzZXJuYW1lXCI6IFwic2Ftc2NyaW1cIlxuICAgIH0sXG4gICAgXCJ3aWR0aFwiOiA0OTc5XG4gIH0sXG4gIHtcbiAgICBcImNhdGVnb3JpZXNcIjogW10sXG4gICAgXCJjb2xvclwiOiBcIiMzODJGMzBcIixcbiAgICBcImNyZWF0ZWRfYXRcIjogXCIyMDE3LTA1LTA3VDE5OjQ2OjMyLTA0OjAwXCIsXG4gICAgXCJjdXJyZW50X3VzZXJfY29sbGVjdGlvbnNcIjogW10sXG4gICAgXCJkZXNjcmlwdGlvblwiOiBudWxsLFxuICAgIFwiaGVpZ2h0XCI6IDIwMDAsXG4gICAgXCJpZFwiOiBcIkV3RTR0QlloM21zXCIsXG4gICAgXCJsaWtlZF9ieV91c2VyXCI6IGZhbHNlLFxuICAgIFwibGlrZXNcIjogMTk0LFxuICAgIFwibGlua3NcIjoge1xuICAgICAgXCJkb3dubG9hZFwiOiBcImh0dHA6Ly91bnNwbGFzaC5jb20vcGhvdG9zL0V3RTR0QlloM21zL2Rvd25sb2FkXCIsXG4gICAgICBcImRvd25sb2FkX2xvY2F0aW9uXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3Bob3Rvcy9Fd0U0dEJZaDNtcy9kb3dubG9hZFwiLFxuICAgICAgXCJodG1sXCI6IFwiaHR0cDovL3Vuc3BsYXNoLmNvbS9waG90b3MvRXdFNHRCWWgzbXNcIixcbiAgICAgIFwic2VsZlwiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS9waG90b3MvRXdFNHRCWWgzbXNcIlxuICAgIH0sXG4gICAgXCJ1cGRhdGVkX2F0XCI6IFwiMjAxNy0wNy0wMVQwNDoyMzoyNC0wNDowMFwiLFxuICAgIFwidXJsc1wiOiB7XG4gICAgICBcImZ1bGxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ5NDIwMDQ4MzAzNS1kYjdiYzZhYTU3Mzk/aXhsaWI9cmItMC4zLjUmcT04NSZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXNyZ2Imcz0zMzI1ODkyMTFiNWYzYjJjYjdjNjRiN2VmYTZmMzQ3M1wiLFxuICAgICAgXCJyYXdcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ5NDIwMDQ4MzAzNS1kYjdiYzZhYTU3MzlcIixcbiAgICAgIFwicmVndWxhclwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk0MjAwNDgzMDM1LWRiN2JjNmFhNTczOT9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9dGlueXNyZ2Imdz0xMDgwJmZpdD1tYXgmcz1mNzEyNGQ4OGNkOGJlOTZhMDYxMTA4YjZlM2VmOWQzMFwiLFxuICAgICAgXCJzbWFsbFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk0MjAwNDgzMDM1LWRiN2JjNmFhNTczOT9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9dGlueXNyZ2Imdz00MDAmZml0PW1heCZzPWU3ZGZmZDZkZjliYWRlYTljYWViYTMzYjJhNzVjYjEzXCIsXG4gICAgICBcInRodW1iXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQyMDA0ODMwMzUtZGI3YmM2YWE1NzM5P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZW50cm9weSZjcz10aW55c3JnYiZ3PTIwMCZmaXQ9bWF4JnM9OThlNzNlZjhlNGIzMDJjZjdhYWQxYmM2MTFhN2VjNzhcIlxuICAgIH0sXG4gICAgXCJ1c2VyXCI6IHtcbiAgICAgIFwiYmlvXCI6IFwiXCIsXG4gICAgICBcImZpcnN0X25hbWVcIjogXCJLYXRpZVwiLFxuICAgICAgXCJpZFwiOiBcIm5pZ1R1czlhc1I4XCIsXG4gICAgICBcImxhc3RfbmFtZVwiOiBcIlRyZWFkd2F5XCIsXG4gICAgICBcImxpbmtzXCI6IHtcbiAgICAgICAgXCJmb2xsb3dlcnNcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMva2F0aWV0cmVhZHdheS9mb2xsb3dlcnNcIixcbiAgICAgICAgXCJmb2xsb3dpbmdcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMva2F0aWV0cmVhZHdheS9mb2xsb3dpbmdcIixcbiAgICAgICAgXCJodG1sXCI6IFwiaHR0cDovL3Vuc3BsYXNoLmNvbS9Aa2F0aWV0cmVhZHdheVwiLFxuICAgICAgICBcImxpa2VzXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2thdGlldHJlYWR3YXkvbGlrZXNcIixcbiAgICAgICAgXCJwaG90b3NcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMva2F0aWV0cmVhZHdheS9waG90b3NcIixcbiAgICAgICAgXCJwb3J0Zm9saW9cIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMva2F0aWV0cmVhZHdheS9wb3J0Zm9saW9cIixcbiAgICAgICAgXCJzZWxmXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2thdGlldHJlYWR3YXlcIlxuICAgICAgfSxcbiAgICAgIFwibG9jYXRpb25cIjogXCJCZW50b252aWxsZSwgQXJcIixcbiAgICAgIFwibmFtZVwiOiBcIkthdGllIFRyZWFkd2F5XCIsXG4gICAgICBcInBvcnRmb2xpb191cmxcIjogXCJodHRwOi8vd3d3LmthdGlldHJlYWR3YXlwaG90b2dyYXBoeS5jb20vXCIsXG4gICAgICBcInByb2ZpbGVfaW1hZ2VcIjoge1xuICAgICAgICBcImxhcmdlXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Byb2ZpbGUtMTQ4MDg2NTI3NTkzMy0yNTE4MTdmYzUxNzY/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1mYWNlcyZjcz10aW55c3JnYiZmaXQ9Y3JvcCZoPTEyOCZ3PTEyOCZzPWUxZWNjZTM2Y2VlNjBhYzg0Zjg5ZTZkNWRkYTY0ZjYyXCIsXG4gICAgICAgIFwibWVkaXVtXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Byb2ZpbGUtMTQ4MDg2NTI3NTkzMy0yNTE4MTdmYzUxNzY/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1mYWNlcyZjcz10aW55c3JnYiZmaXQ9Y3JvcCZoPTY0Jnc9NjQmcz01MTVhOTUyYTg4MTJkOTUxMmJhZTE0NDYzMjdjNzMyN1wiLFxuICAgICAgICBcInNtYWxsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Byb2ZpbGUtMTQ4MDg2NTI3NTkzMy0yNTE4MTdmYzUxNzY/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1mYWNlcyZjcz10aW55c3JnYiZmaXQ9Y3JvcCZoPTMyJnc9MzImcz1lZjg3NTZjNWFiYzQyNTliMjc1NDEwYThlODBjMDVlNlwiXG4gICAgICB9LFxuICAgICAgXCJ0b3RhbF9jb2xsZWN0aW9uc1wiOiAwLFxuICAgICAgXCJ0b3RhbF9saWtlc1wiOiAwLFxuICAgICAgXCJ0b3RhbF9waG90b3NcIjogNyxcbiAgICAgIFwidHdpdHRlcl91c2VybmFtZVwiOiBudWxsLFxuICAgICAgXCJ1cGRhdGVkX2F0XCI6IFwiMjAxNy0wNy0wMVQwNDoyMzoyNC0wNDowMFwiLFxuICAgICAgXCJ1c2VybmFtZVwiOiBcImthdGlldHJlYWR3YXlcIlxuICAgIH0sXG4gICAgXCJ3aWR0aFwiOiAzMDAwXG4gIH0sXG4gIHtcbiAgICAgICAgXCJjYXRlZ29yaWVzXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImlkXCI6IDIsXG4gICAgICAgICAgICAgICAgXCJsaW5rc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwicGhvdG9zXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL2NhdGVnb3JpZXMvMi9waG90b3NcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxmXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL2NhdGVnb3JpZXMvMlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInBob3RvX2NvdW50XCI6IDIyODk3LFxuICAgICAgICAgICAgICAgIFwidGl0bGVcIjogXCJCdWlsZGluZ3NcIlxuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImNvbG9yXCI6IFwiIzJCMkYyRVwiLFxuICAgICAgICBcImNyZWF0ZWRfYXRcIjogXCIyMDE2LTAzLTIyVDE3OjM4OjQ0LTA0OjAwXCIsXG4gICAgICAgIFwiY3VycmVudF91c2VyX2NvbGxlY3Rpb25zXCI6IFtdLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IG51bGwsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDMzNjYsXG4gICAgICAgIFwiaWRcIjogXCJqUjRaZi1yaUVqSVwiLFxuICAgICAgICBcImxpa2VkX2J5X3VzZXJcIjogZmFsc2UsXG4gICAgICAgIFwibGlrZXNcIjogMTE0MSxcbiAgICAgICAgXCJsaW5rc1wiOiB7XG4gICAgICAgICAgICBcImRvd25sb2FkXCI6IFwiaHR0cDovL3Vuc3BsYXNoLmNvbS9waG90b3MvalI0WmYtcmlFakkvZG93bmxvYWRcIixcbiAgICAgICAgICAgIFwiZG93bmxvYWRfbG9jYXRpb25cIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vcGhvdG9zL2pSNFpmLXJpRWpJL2Rvd25sb2FkXCIsXG4gICAgICAgICAgICBcImh0bWxcIjogXCJodHRwOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9qUjRaZi1yaUVqSVwiLFxuICAgICAgICAgICAgXCJzZWxmXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3Bob3Rvcy9qUjRaZi1yaUVqSVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwidXBkYXRlZF9hdFwiOiBcIjIwMTctMDctMDFUMDM6MzY6NDUtMDQ6MDBcIixcbiAgICBcInVybHNcIjoge1xuICAgICAgICAgICAgXCJmdWxsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTg2ODI2MjUyMjEtM2E0NWY4YTg0NGM3P2l4bGliPXJiLTAuMy41JnE9ODUmZm09anBnJmNyb3A9ZW50cm9weSZjcz1zcmdiJnM9MDkyNzlhMWExY2M2YWY4ZjdlNDFkMWZjNzA2YzcwMjVcIixcbiAgICAgICAgICAgIFwicmF3XCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTg2ODI2MjUyMjEtM2E0NWY4YTg0NGM3XCIsXG4gICAgICAgICAgICBcInJlZ3VsYXJcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1ODY4MjYyNTIyMS0zYTQ1ZjhhODQ0Yzc/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXRpbnlzcmdiJnc9MTA4MCZmaXQ9bWF4JnM9MTAyNDUxMjY0ZTljZDBjNmZjOTQ3NjhiZjM0NWU2ODZcIixcbiAgICAgICAgICAgIFwic21hbGxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1ODY4MjYyNTIyMS0zYTQ1ZjhhODQ0Yzc/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXRpbnlzcmdiJnc9NDAwJmZpdD1tYXgmcz0zMDAwMzY4YWEyNjUyOTk0MzM4OTRiYWNjN2QzNTI2YlwiLFxuICAgICAgICAgICAgXCJ0aHVtYlwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU4NjgyNjI1MjIxLTNhNDVmOGE4NDRjNz9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9dGlueXNyZ2Imdz0yMDAmZml0PW1heCZzPTAwMmRjNTQ1OWM3ZTM3ZjQwZjFiNTA4ZDRiYjFkZDRlXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJ1c2VyXCI6IHtcbiAgICAgICAgICAgIFwiYmlvXCI6IFwiTG9uZG9uIGJhc2VkIHBob3RvZ3JhcGhlciB3aXRoIGFuIGV5ZSBmb3IgdGhlIGRldGFpbHMgaW4gbGlmZSwgd2hpY2ggaXMgdGhlIGJhc2lzIG9mIHRoZSBhZXN0aGV0aWMgaW4gbXkgcGhvdG9ncmFwaHMuIFdoZXJlYXMgZm9yIHNvbWUsIGZvY3VzaW5nIG9uIGRldGFpbHMgYW5kIHByZWNpc2lvbiBkZXRhY2hlcyBmZWVsaW5ncywgSSB1c2UgZGV0YWlscyB0byBicmluZyBzdWJqZWN0cyB0byBsaWZlLlwiLFxuICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IFwiQW5kcmV3XCIsXG4gICAgICAgICAgICBcImlkXCI6IFwiaXhjUmdnSHBVenNcIixcbiAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IFwiUmlkbGV5XCIsXG4gICAgICAgICAgICBcImxpbmtzXCI6IHtcbiAgICAgICAgICAgICAgICBcImZvbGxvd2Vyc1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9hcmlkbGV5ODgvZm9sbG93ZXJzXCIsXG4gICAgICAgICAgICAgICAgXCJmb2xsb3dpbmdcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvYXJpZGxleTg4L2ZvbGxvd2luZ1wiLFxuICAgICAgICAgICAgICAgIFwiaHRtbFwiOiBcImh0dHA6Ly91bnNwbGFzaC5jb20vQGFyaWRsZXk4OFwiLFxuICAgICAgICAgICAgICAgIFwibGlrZXNcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvYXJpZGxleTg4L2xpa2VzXCIsXG4gICAgICAgICAgICAgICAgXCJwaG90b3NcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvYXJpZGxleTg4L3Bob3Rvc1wiLFxuICAgICAgICAgICAgICAgIFwicG9ydGZvbGlvXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2FyaWRsZXk4OC9wb3J0Zm9saW9cIixcbiAgICAgICAgICAgICAgICBcInNlbGZcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvYXJpZGxleTg4XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImxvY2F0aW9uXCI6IFwiTG9uZG9uLCBVS1wiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiQW5kcmV3IFJpZGxleVwiLFxuICAgICAgICAgICAgXCJwb3J0Zm9saW9fdXJsXCI6IFwiaHR0cDovL3d3dy5hcmlkbGV5cGhvdG9ncmFwaHkuY29tL1wiLFxuICAgICAgICAgICAgXCJwcm9maWxlX2ltYWdlXCI6IHtcbiAgICAgICAgICAgICAgICBcImxhcmdlXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Byb2ZpbGUtMTQ4NDQxODI1ODczMS02NGE2NDdhZjZlMDg/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1mYWNlcyZjcz10aW55c3JnYiZmaXQ9Y3JvcCZoPTEyOCZ3PTEyOCZzPTE2OWUwMjUyMDM2NDdmZmE4MDJmYWQxNDU5ZGNjMzNhXCIsXG4gICAgICAgICAgICAgICAgXCJtZWRpdW1cIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcHJvZmlsZS0xNDg0NDE4MjU4NzMxLTY0YTY0N2FmNmUwOD9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWZhY2VzJmNzPXRpbnlzcmdiJmZpdD1jcm9wJmg9NjQmdz02NCZzPTMxY2JmM2I1NTA1YTVhODdhZTY5YzEzY2EwZDYwYmY3XCIsXG4gICAgICAgICAgICAgICAgXCJzbWFsbFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9wcm9maWxlLTE0ODQ0MTgyNTg3MzEtNjRhNjQ3YWY2ZTA4P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZmFjZXMmY3M9dGlueXNyZ2ImZml0PWNyb3AmaD0zMiZ3PTMyJnM9OGUwNzg3NDUxMzUzMGU5YWYyOWYxNGExNDIyNmNmMGNcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidG90YWxfY29sbGVjdGlvbnNcIjogMCxcbiAgICAgICAgICAgIFwidG90YWxfbGlrZXNcIjogMzYsXG4gICAgICAgICAgICBcInRvdGFsX3Bob3Rvc1wiOiAzMyxcbiAgICAgICAgICAgIFwidHdpdHRlcl91c2VybmFtZVwiOiBcImFuZHJld3JpZGxleVwiLFxuICAgICAgICAgICAgXCJ1cGRhdGVkX2F0XCI6IFwiMjAxNy0wNy0wMVQwNTo0OToyNy0wNDowMFwiLFxuICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiBcImFyaWRsZXk4OFwiXG4gICAgICAgIH0sXG4gICAgICAgIFwid2lkdGhcIjogNDQ4OFxuICB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuXG5mdW5jdGlvbiBkZWJvdW5jZSAoZm4sIHdhaXQpIHtcbiAgdmFyIHRpbWVyO1xuICB2YXIgYXJncztcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgd2FpdCA9IDI1MDtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRpbWVyICE9IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgIHRpbWVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZm4uYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICB9LCB3YWl0KTtcbiAgfTtcbn1cbiIsIlxuLyoqXG4gKiBFc2NhcGUgcmVnZXhwIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIFN0cmluZyhzdHIpLnJlcGxhY2UoLyhbLiorPz1eIToke30oKXxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBpbWc7XG5cbmZ1bmN0aW9uIGltZyAoc3JjLCBvcHQsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRcbiAgICBvcHQgPSBudWxsXG4gIH1cblxuXG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICB2YXIgbG9ja2VkO1xuXG4gIGVsLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAobG9ja2VkKSByZXR1cm47XG4gICAgbG9ja2VkID0gdHJ1ZTtcblxuICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHVuZGVmaW5lZCwgZWwpO1xuICB9O1xuXG4gIGVsLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGxvY2tlZCkgcmV0dXJuO1xuICAgIGxvY2tlZCA9IHRydWU7XG5cbiAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhuZXcgRXJyb3IoJ1VuYWJsZSB0byBsb2FkIFwiJyArIHNyYyArICdcIicpLCBlbCk7XG4gIH07XG4gIFxuICBpZiAob3B0ICYmIG9wdC5jcm9zc09yaWdpbilcbiAgICBlbC5jcm9zc09yaWdpbiA9IG9wdC5jcm9zc09yaWdpbjtcblxuICBlbC5zcmMgPSBzcmM7XG5cbiAgcmV0dXJuIGVsO1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iLCIhZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGZ1bmN0aW9uIFZOb2RlKCkge31cbiAgICBmdW5jdGlvbiBoKG5vZGVOYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBsYXN0U2ltcGxlLCBjaGlsZCwgc2ltcGxlLCBpLCBjaGlsZHJlbiA9IEVNUFRZX0NISUxEUkVOO1xuICAgICAgICBmb3IgKGkgPSBhcmd1bWVudHMubGVuZ3RoOyBpLS0gPiAyOyApIHN0YWNrLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMgJiYgbnVsbCAhPSBhdHRyaWJ1dGVzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoIXN0YWNrLmxlbmd0aCkgc3RhY2sucHVzaChhdHRyaWJ1dGVzLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIGRlbGV0ZSBhdHRyaWJ1dGVzLmNoaWxkcmVuO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChzdGFjay5sZW5ndGgpIGlmICgoY2hpbGQgPSBzdGFjay5wb3AoKSkgJiYgdm9pZCAwICE9PSBjaGlsZC5wb3ApIGZvciAoaSA9IGNoaWxkLmxlbmd0aDsgaS0tOyApIHN0YWNrLnB1c2goY2hpbGRbaV0pOyBlbHNlIHtcbiAgICAgICAgICAgIGlmICgnYm9vbGVhbicgPT0gdHlwZW9mIGNoaWxkKSBjaGlsZCA9IG51bGw7XG4gICAgICAgICAgICBpZiAoc2ltcGxlID0gJ2Z1bmN0aW9uJyAhPSB0eXBlb2Ygbm9kZU5hbWUpIGlmIChudWxsID09IGNoaWxkKSBjaGlsZCA9ICcnOyBlbHNlIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgY2hpbGQpIGNoaWxkID0gU3RyaW5nKGNoaWxkKTsgZWxzZSBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIGNoaWxkKSBzaW1wbGUgPSAhMTtcbiAgICAgICAgICAgIGlmIChzaW1wbGUgJiYgbGFzdFNpbXBsZSkgY2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoIC0gMV0gKz0gY2hpbGQ7IGVsc2UgaWYgKGNoaWxkcmVuID09PSBFTVBUWV9DSElMRFJFTikgY2hpbGRyZW4gPSBbIGNoaWxkIF07IGVsc2UgY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICAgICAgICBsYXN0U2ltcGxlID0gc2ltcGxlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwID0gbmV3IFZOb2RlKCk7XG4gICAgICAgIHAubm9kZU5hbWUgPSBub2RlTmFtZTtcbiAgICAgICAgcC5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICBwLmF0dHJpYnV0ZXMgPSBudWxsID09IGF0dHJpYnV0ZXMgPyB2b2lkIDAgOiBhdHRyaWJ1dGVzO1xuICAgICAgICBwLmtleSA9IG51bGwgPT0gYXR0cmlidXRlcyA/IHZvaWQgMCA6IGF0dHJpYnV0ZXMua2V5O1xuICAgICAgICBpZiAodm9pZCAwICE9PSBvcHRpb25zLnZub2RlKSBvcHRpb25zLnZub2RlKHApO1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZXh0ZW5kKG9iaiwgcHJvcHMpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBwcm9wcykgb2JqW2ldID0gcHJvcHNbaV07XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsb25lRWxlbWVudCh2bm9kZSwgcHJvcHMpIHtcbiAgICAgICAgcmV0dXJuIGgodm5vZGUubm9kZU5hbWUsIGV4dGVuZChleHRlbmQoe30sIHZub2RlLmF0dHJpYnV0ZXMpLCBwcm9wcyksIGFyZ3VtZW50cy5sZW5ndGggPiAyID8gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpIDogdm5vZGUuY2hpbGRyZW4pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlbnF1ZXVlUmVuZGVyKGNvbXBvbmVudCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX2QgJiYgKGNvbXBvbmVudC5fX2QgPSAhMCkgJiYgMSA9PSBpdGVtcy5wdXNoKGNvbXBvbmVudCkpIChvcHRpb25zLmRlYm91bmNlUmVuZGVyaW5nIHx8IGRlZmVyKShyZXJlbmRlcik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlcmVuZGVyKCkge1xuICAgICAgICB2YXIgcCwgbGlzdCA9IGl0ZW1zO1xuICAgICAgICBpdGVtcyA9IFtdO1xuICAgICAgICB3aGlsZSAocCA9IGxpc3QucG9wKCkpIGlmIChwLl9fZCkgcmVuZGVyQ29tcG9uZW50KHApO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1NhbWVOb2RlVHlwZShub2RlLCB2bm9kZSwgaHlkcmF0aW5nKSB7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUgfHwgJ251bWJlcicgPT0gdHlwZW9mIHZub2RlKSByZXR1cm4gdm9pZCAwICE9PSBub2RlLnNwbGl0VGV4dDtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZS5ub2RlTmFtZSkgcmV0dXJuICFub2RlLl9jb21wb25lbnRDb25zdHJ1Y3RvciAmJiBpc05hbWVkTm9kZShub2RlLCB2bm9kZS5ub2RlTmFtZSk7IGVsc2UgcmV0dXJuIGh5ZHJhdGluZyB8fCBub2RlLl9jb21wb25lbnRDb25zdHJ1Y3RvciA9PT0gdm5vZGUubm9kZU5hbWU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzTmFtZWROb2RlKG5vZGUsIG5vZGVOYW1lKSB7XG4gICAgICAgIHJldHVybiBub2RlLl9fbiA9PT0gbm9kZU5hbWUgfHwgbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXROb2RlUHJvcHModm5vZGUpIHtcbiAgICAgICAgdmFyIHByb3BzID0gZXh0ZW5kKHt9LCB2bm9kZS5hdHRyaWJ1dGVzKTtcbiAgICAgICAgcHJvcHMuY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICAgICAgdmFyIGRlZmF1bHRQcm9wcyA9IHZub2RlLm5vZGVOYW1lLmRlZmF1bHRQcm9wcztcbiAgICAgICAgaWYgKHZvaWQgMCAhPT0gZGVmYXVsdFByb3BzKSBmb3IgKHZhciBpIGluIGRlZmF1bHRQcm9wcykgaWYgKHZvaWQgMCA9PT0gcHJvcHNbaV0pIHByb3BzW2ldID0gZGVmYXVsdFByb3BzW2ldO1xuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZU5vZGUobm9kZU5hbWUsIGlzU3ZnKSB7XG4gICAgICAgIHZhciBub2RlID0gaXNTdmcgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgbm9kZU5hbWUpIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG4gICAgICAgIG5vZGUuX19uID0gbm9kZU5hbWU7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVOb2RlKG5vZGUpIHtcbiAgICAgICAgdmFyIHBhcmVudE5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgIGlmIChwYXJlbnROb2RlKSBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRBY2Nlc3Nvcihub2RlLCBuYW1lLCBvbGQsIHZhbHVlLCBpc1N2Zykge1xuICAgICAgICBpZiAoJ2NsYXNzTmFtZScgPT09IG5hbWUpIG5hbWUgPSAnY2xhc3MnO1xuICAgICAgICBpZiAoJ2tleScgPT09IG5hbWUpIDsgZWxzZSBpZiAoJ3JlZicgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGlmIChvbGQpIG9sZChudWxsKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkgdmFsdWUobm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2NsYXNzJyA9PT0gbmFtZSAmJiAhaXNTdmcpIG5vZGUuY2xhc3NOYW1lID0gdmFsdWUgfHwgJyc7IGVsc2UgaWYgKCdzdHlsZScgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGlmICghdmFsdWUgfHwgJ3N0cmluZycgPT0gdHlwZW9mIHZhbHVlIHx8ICdzdHJpbmcnID09IHR5cGVvZiBvbGQpIG5vZGUuc3R5bGUuY3NzVGV4dCA9IHZhbHVlIHx8ICcnO1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmICdvYmplY3QnID09IHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICgnc3RyaW5nJyAhPSB0eXBlb2Ygb2xkKSBmb3IgKHZhciBpIGluIG9sZCkgaWYgKCEoaSBpbiB2YWx1ZSkpIG5vZGUuc3R5bGVbaV0gPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHZhbHVlKSBub2RlLnN0eWxlW2ldID0gJ251bWJlcicgPT0gdHlwZW9mIHZhbHVlW2ldICYmICExID09PSBJU19OT05fRElNRU5TSU9OQUwudGVzdChpKSA/IHZhbHVlW2ldICsgJ3B4JyA6IHZhbHVlW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCdkYW5nZXJvdXNseVNldElubmVySFRNTCcgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkgbm9kZS5pbm5lckhUTUwgPSB2YWx1ZS5fX2h0bWwgfHwgJyc7XG4gICAgICAgIH0gZWxzZSBpZiAoJ28nID09IG5hbWVbMF0gJiYgJ24nID09IG5hbWVbMV0pIHtcbiAgICAgICAgICAgIHZhciB1c2VDYXB0dXJlID0gbmFtZSAhPT0gKG5hbWUgPSBuYW1lLnJlcGxhY2UoL0NhcHR1cmUkLywgJycpKTtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCkuc3Vic3RyaW5nKDIpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFvbGQpIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudFByb3h5LCB1c2VDYXB0dXJlKTtcbiAgICAgICAgICAgIH0gZWxzZSBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZXZlbnRQcm94eSwgdXNlQ2FwdHVyZSk7XG4gICAgICAgICAgICAobm9kZS5fX2wgfHwgKG5vZGUuX19sID0ge30pKVtuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKCdsaXN0JyAhPT0gbmFtZSAmJiAndHlwZScgIT09IG5hbWUgJiYgIWlzU3ZnICYmIG5hbWUgaW4gbm9kZSkge1xuICAgICAgICAgICAgc2V0UHJvcGVydHkobm9kZSwgbmFtZSwgbnVsbCA9PSB2YWx1ZSA/ICcnIDogdmFsdWUpO1xuICAgICAgICAgICAgaWYgKG51bGwgPT0gdmFsdWUgfHwgITEgPT09IHZhbHVlKSBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBucyA9IGlzU3ZnICYmIG5hbWUgIT09IChuYW1lID0gbmFtZS5yZXBsYWNlKC9eeGxpbmtcXDo/LywgJycpKTtcbiAgICAgICAgICAgIGlmIChudWxsID09IHZhbHVlIHx8ICExID09PSB2YWx1ZSkgaWYgKG5zKSBub2RlLnJlbW92ZUF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpKTsgZWxzZSBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTsgZWxzZSBpZiAoJ2Z1bmN0aW9uJyAhPSB0eXBlb2YgdmFsdWUpIGlmIChucykgbm9kZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsIG5hbWUudG9Mb3dlckNhc2UoKSwgdmFsdWUpOyBlbHNlIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRQcm9wZXJ0eShub2RlLCBuYW1lLCB2YWx1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbm9kZVtuYW1lXSA9IHZhbHVlO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cbiAgICBmdW5jdGlvbiBldmVudFByb3h5KGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19sW2UudHlwZV0ob3B0aW9ucy5ldmVudCAmJiBvcHRpb25zLmV2ZW50KGUpIHx8IGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmbHVzaE1vdW50cygpIHtcbiAgICAgICAgdmFyIGM7XG4gICAgICAgIHdoaWxlIChjID0gbW91bnRzLnBvcCgpKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hZnRlck1vdW50KSBvcHRpb25zLmFmdGVyTW91bnQoYyk7XG4gICAgICAgICAgICBpZiAoYy5jb21wb25lbnREaWRNb3VudCkgYy5jb21wb25lbnREaWRNb3VudCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIHBhcmVudCwgY29tcG9uZW50Um9vdCkge1xuICAgICAgICBpZiAoIWRpZmZMZXZlbCsrKSB7XG4gICAgICAgICAgICBpc1N2Z01vZGUgPSBudWxsICE9IHBhcmVudCAmJiB2b2lkIDAgIT09IHBhcmVudC5vd25lclNWR0VsZW1lbnQ7XG4gICAgICAgICAgICBoeWRyYXRpbmcgPSBudWxsICE9IGRvbSAmJiAhKCdfX3ByZWFjdGF0dHJfJyBpbiBkb20pO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXQgPSBpZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgY29tcG9uZW50Um9vdCk7XG4gICAgICAgIGlmIChwYXJlbnQgJiYgcmV0LnBhcmVudE5vZGUgIT09IHBhcmVudCkgcGFyZW50LmFwcGVuZENoaWxkKHJldCk7XG4gICAgICAgIGlmICghLS1kaWZmTGV2ZWwpIHtcbiAgICAgICAgICAgIGh5ZHJhdGluZyA9ICExO1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnRSb290KSBmbHVzaE1vdW50cygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBjb21wb25lbnRSb290KSB7XG4gICAgICAgIHZhciBvdXQgPSBkb20sIHByZXZTdmdNb2RlID0gaXNTdmdNb2RlO1xuICAgICAgICBpZiAobnVsbCA9PSB2bm9kZSB8fCAnYm9vbGVhbicgPT0gdHlwZW9mIHZub2RlKSB2bm9kZSA9ICcnO1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlIHx8ICdudW1iZXInID09IHR5cGVvZiB2bm9kZSkge1xuICAgICAgICAgICAgaWYgKGRvbSAmJiB2b2lkIDAgIT09IGRvbS5zcGxpdFRleHQgJiYgZG9tLnBhcmVudE5vZGUgJiYgKCFkb20uX2NvbXBvbmVudCB8fCBjb21wb25lbnRSb290KSkge1xuICAgICAgICAgICAgICAgIGlmIChkb20ubm9kZVZhbHVlICE9IHZub2RlKSBkb20ubm9kZVZhbHVlID0gdm5vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9tKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb20ucGFyZW50Tm9kZSkgZG9tLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG91dCwgZG9tKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoZG9tLCAhMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0Ll9fcHJlYWN0YXR0cl8gPSAhMDtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZub2RlTmFtZSA9IHZub2RlLm5vZGVOYW1lO1xuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygdm5vZGVOYW1lKSByZXR1cm4gYnVpbGRDb21wb25lbnRGcm9tVk5vZGUoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICBpc1N2Z01vZGUgPSAnc3ZnJyA9PT0gdm5vZGVOYW1lID8gITAgOiAnZm9yZWlnbk9iamVjdCcgPT09IHZub2RlTmFtZSA/ICExIDogaXNTdmdNb2RlO1xuICAgICAgICB2bm9kZU5hbWUgPSBTdHJpbmcodm5vZGVOYW1lKTtcbiAgICAgICAgaWYgKCFkb20gfHwgIWlzTmFtZWROb2RlKGRvbSwgdm5vZGVOYW1lKSkge1xuICAgICAgICAgICAgb3V0ID0gY3JlYXRlTm9kZSh2bm9kZU5hbWUsIGlzU3ZnTW9kZSk7XG4gICAgICAgICAgICBpZiAoZG9tKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGRvbS5maXJzdENoaWxkKSBvdXQuYXBwZW5kQ2hpbGQoZG9tLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIGlmIChkb20ucGFyZW50Tm9kZSkgZG9tLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG91dCwgZG9tKTtcbiAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShkb20sICEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZmMgPSBvdXQuZmlyc3RDaGlsZCwgcHJvcHMgPSBvdXQuX19wcmVhY3RhdHRyXywgdmNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG4gICAgICAgIGlmIChudWxsID09IHByb3BzKSB7XG4gICAgICAgICAgICBwcm9wcyA9IG91dC5fX3ByZWFjdGF0dHJfID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBhID0gb3V0LmF0dHJpYnV0ZXMsIGkgPSBhLmxlbmd0aDsgaS0tOyApIHByb3BzW2FbaV0ubmFtZV0gPSBhW2ldLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaHlkcmF0aW5nICYmIHZjaGlsZHJlbiAmJiAxID09PSB2Y2hpbGRyZW4ubGVuZ3RoICYmICdzdHJpbmcnID09IHR5cGVvZiB2Y2hpbGRyZW5bMF0gJiYgbnVsbCAhPSBmYyAmJiB2b2lkIDAgIT09IGZjLnNwbGl0VGV4dCAmJiBudWxsID09IGZjLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICBpZiAoZmMubm9kZVZhbHVlICE9IHZjaGlsZHJlblswXSkgZmMubm9kZVZhbHVlID0gdmNoaWxkcmVuWzBdO1xuICAgICAgICB9IGVsc2UgaWYgKHZjaGlsZHJlbiAmJiB2Y2hpbGRyZW4ubGVuZ3RoIHx8IG51bGwgIT0gZmMpIGlubmVyRGlmZk5vZGUob3V0LCB2Y2hpbGRyZW4sIGNvbnRleHQsIG1vdW50QWxsLCBoeWRyYXRpbmcgfHwgbnVsbCAhPSBwcm9wcy5kYW5nZXJvdXNseVNldElubmVySFRNTCk7XG4gICAgICAgIGRpZmZBdHRyaWJ1dGVzKG91dCwgdm5vZGUuYXR0cmlidXRlcywgcHJvcHMpO1xuICAgICAgICBpc1N2Z01vZGUgPSBwcmV2U3ZnTW9kZTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5uZXJEaWZmTm9kZShkb20sIHZjaGlsZHJlbiwgY29udGV4dCwgbW91bnRBbGwsIGlzSHlkcmF0aW5nKSB7XG4gICAgICAgIHZhciBqLCBjLCBmLCB2Y2hpbGQsIGNoaWxkLCBvcmlnaW5hbENoaWxkcmVuID0gZG9tLmNoaWxkTm9kZXMsIGNoaWxkcmVuID0gW10sIGtleWVkID0ge30sIGtleWVkTGVuID0gMCwgbWluID0gMCwgbGVuID0gb3JpZ2luYWxDaGlsZHJlbi5sZW5ndGgsIGNoaWxkcmVuTGVuID0gMCwgdmxlbiA9IHZjaGlsZHJlbiA/IHZjaGlsZHJlbi5sZW5ndGggOiAwO1xuICAgICAgICBpZiAoMCAhPT0gbGVuKSBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgX2NoaWxkID0gb3JpZ2luYWxDaGlsZHJlbltpXSwgcHJvcHMgPSBfY2hpbGQuX19wcmVhY3RhdHRyXywga2V5ID0gdmxlbiAmJiBwcm9wcyA/IF9jaGlsZC5fY29tcG9uZW50ID8gX2NoaWxkLl9jb21wb25lbnQuX19rIDogcHJvcHMua2V5IDogbnVsbDtcbiAgICAgICAgICAgIGlmIChudWxsICE9IGtleSkge1xuICAgICAgICAgICAgICAgIGtleWVkTGVuKys7XG4gICAgICAgICAgICAgICAga2V5ZWRba2V5XSA9IF9jaGlsZDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcHMgfHwgKHZvaWQgMCAhPT0gX2NoaWxkLnNwbGl0VGV4dCA/IGlzSHlkcmF0aW5nID8gX2NoaWxkLm5vZGVWYWx1ZS50cmltKCkgOiAhMCA6IGlzSHlkcmF0aW5nKSkgY2hpbGRyZW5bY2hpbGRyZW5MZW4rK10gPSBfY2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKDAgIT09IHZsZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgdmxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2Y2hpbGQgPSB2Y2hpbGRyZW5baV07XG4gICAgICAgICAgICBjaGlsZCA9IG51bGw7XG4gICAgICAgICAgICB2YXIga2V5ID0gdmNoaWxkLmtleTtcbiAgICAgICAgICAgIGlmIChudWxsICE9IGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXllZExlbiAmJiB2b2lkIDAgIT09IGtleWVkW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBrZXllZFtrZXldO1xuICAgICAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICBrZXllZExlbi0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWNoaWxkICYmIG1pbiA8IGNoaWxkcmVuTGVuKSBmb3IgKGogPSBtaW47IGogPCBjaGlsZHJlbkxlbjsgaisrKSBpZiAodm9pZCAwICE9PSBjaGlsZHJlbltqXSAmJiBpc1NhbWVOb2RlVHlwZShjID0gY2hpbGRyZW5bal0sIHZjaGlsZCwgaXNIeWRyYXRpbmcpKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSBjO1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGlmIChqID09PSBjaGlsZHJlbkxlbiAtIDEpIGNoaWxkcmVuTGVuLS07XG4gICAgICAgICAgICAgICAgaWYgKGogPT09IG1pbikgbWluKys7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGlsZCA9IGlkaWZmKGNoaWxkLCB2Y2hpbGQsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGYgPSBvcmlnaW5hbENoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkICYmIGNoaWxkICE9PSBkb20gJiYgY2hpbGQgIT09IGYpIGlmIChudWxsID09IGYpIGRvbS5hcHBlbmRDaGlsZChjaGlsZCk7IGVsc2UgaWYgKGNoaWxkID09PSBmLm5leHRTaWJsaW5nKSByZW1vdmVOb2RlKGYpOyBlbHNlIGRvbS5pbnNlcnRCZWZvcmUoY2hpbGQsIGYpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXllZExlbikgZm9yICh2YXIgaSBpbiBrZXllZCkgaWYgKHZvaWQgMCAhPT0ga2V5ZWRbaV0pIHJlY29sbGVjdE5vZGVUcmVlKGtleWVkW2ldLCAhMSk7XG4gICAgICAgIHdoaWxlIChtaW4gPD0gY2hpbGRyZW5MZW4pIGlmICh2b2lkIDAgIT09IChjaGlsZCA9IGNoaWxkcmVuW2NoaWxkcmVuTGVuLS1dKSkgcmVjb2xsZWN0Tm9kZVRyZWUoY2hpbGQsICExKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVjb2xsZWN0Tm9kZVRyZWUobm9kZSwgdW5tb3VudE9ubHkpIHtcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IG5vZGUuX2NvbXBvbmVudDtcbiAgICAgICAgaWYgKGNvbXBvbmVudCkgdW5tb3VudENvbXBvbmVudChjb21wb25lbnQpOyBlbHNlIHtcbiAgICAgICAgICAgIGlmIChudWxsICE9IG5vZGUuX19wcmVhY3RhdHRyXyAmJiBub2RlLl9fcHJlYWN0YXR0cl8ucmVmKSBub2RlLl9fcHJlYWN0YXR0cl8ucmVmKG51bGwpO1xuICAgICAgICAgICAgaWYgKCExID09PSB1bm1vdW50T25seSB8fCBudWxsID09IG5vZGUuX19wcmVhY3RhdHRyXykgcmVtb3ZlTm9kZShub2RlKTtcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkcmVuKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuKG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUubGFzdENoaWxkO1xuICAgICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICAgICAgdmFyIG5leHQgPSBub2RlLnByZXZpb3VzU2libGluZztcbiAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsICEwKTtcbiAgICAgICAgICAgIG5vZGUgPSBuZXh0O1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpZmZBdHRyaWJ1dGVzKGRvbSwgYXR0cnMsIG9sZCkge1xuICAgICAgICB2YXIgbmFtZTtcbiAgICAgICAgZm9yIChuYW1lIGluIG9sZCkgaWYgKCghYXR0cnMgfHwgbnVsbCA9PSBhdHRyc1tuYW1lXSkgJiYgbnVsbCAhPSBvbGRbbmFtZV0pIHNldEFjY2Vzc29yKGRvbSwgbmFtZSwgb2xkW25hbWVdLCBvbGRbbmFtZV0gPSB2b2lkIDAsIGlzU3ZnTW9kZSk7XG4gICAgICAgIGZvciAobmFtZSBpbiBhdHRycykgaWYgKCEoJ2NoaWxkcmVuJyA9PT0gbmFtZSB8fCAnaW5uZXJIVE1MJyA9PT0gbmFtZSB8fCBuYW1lIGluIG9sZCAmJiBhdHRyc1tuYW1lXSA9PT0gKCd2YWx1ZScgPT09IG5hbWUgfHwgJ2NoZWNrZWQnID09PSBuYW1lID8gZG9tW25hbWVdIDogb2xkW25hbWVdKSkpIHNldEFjY2Vzc29yKGRvbSwgbmFtZSwgb2xkW25hbWVdLCBvbGRbbmFtZV0gPSBhdHRyc1tuYW1lXSwgaXNTdmdNb2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29sbGVjdENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgKGNvbXBvbmVudHNbbmFtZV0gfHwgKGNvbXBvbmVudHNbbmFtZV0gPSBbXSkpLnB1c2goY29tcG9uZW50KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50KEN0b3IsIHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBpbnN0LCBsaXN0ID0gY29tcG9uZW50c1tDdG9yLm5hbWVdO1xuICAgICAgICBpZiAoQ3Rvci5wcm90b3R5cGUgJiYgQ3Rvci5wcm90b3R5cGUucmVuZGVyKSB7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IEN0b3IocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgQ29tcG9uZW50LmNhbGwoaW5zdCwgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5zdCA9IG5ldyBDb21wb25lbnQocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaW5zdC5jb25zdHJ1Y3RvciA9IEN0b3I7XG4gICAgICAgICAgICBpbnN0LnJlbmRlciA9IGRvUmVuZGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaXN0KSBmb3IgKHZhciBpID0gbGlzdC5sZW5ndGg7IGktLTsgKSBpZiAobGlzdFtpXS5jb25zdHJ1Y3RvciA9PT0gQ3Rvcikge1xuICAgICAgICAgICAgaW5zdC5fX2IgPSBsaXN0W2ldLl9fYjtcbiAgICAgICAgICAgIGxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3Q7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRvUmVuZGVyKHByb3BzLCBzdGF0ZSwgY29udGV4dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldENvbXBvbmVudFByb3BzKGNvbXBvbmVudCwgcHJvcHMsIG9wdHMsIGNvbnRleHQsIG1vdW50QWxsKSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9feCkge1xuICAgICAgICAgICAgY29tcG9uZW50Ll9feCA9ICEwO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fX3IgPSBwcm9wcy5yZWYpIGRlbGV0ZSBwcm9wcy5yZWY7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fayA9IHByb3BzLmtleSkgZGVsZXRlIHByb3BzLmtleTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LmJhc2UgfHwgbW91bnRBbGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcykgY29tcG9uZW50LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHQgJiYgY29udGV4dCAhPT0gY29tcG9uZW50LmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5fX2MpIGNvbXBvbmVudC5fX2MgPSBjb21wb25lbnQuY29udGV4dDtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3ApIGNvbXBvbmVudC5fX3AgPSBjb21wb25lbnQucHJvcHM7XG4gICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMTtcbiAgICAgICAgICAgIGlmICgwICE9PSBvcHRzKSBpZiAoMSA9PT0gb3B0cyB8fCAhMSAhPT0gb3B0aW9ucy5zeW5jQ29tcG9uZW50VXBkYXRlcyB8fCAhY29tcG9uZW50LmJhc2UpIHJlbmRlckNvbXBvbmVudChjb21wb25lbnQsIDEsIG1vdW50QWxsKTsgZWxzZSBlbnF1ZXVlUmVuZGVyKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fcikgY29tcG9uZW50Ll9fcihjb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudChjb21wb25lbnQsIG9wdHMsIG1vdW50QWxsLCBpc0NoaWxkKSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9feCkge1xuICAgICAgICAgICAgdmFyIHJlbmRlcmVkLCBpbnN0LCBjYmFzZSwgcHJvcHMgPSBjb21wb25lbnQucHJvcHMsIHN0YXRlID0gY29tcG9uZW50LnN0YXRlLCBjb250ZXh0ID0gY29tcG9uZW50LmNvbnRleHQsIHByZXZpb3VzUHJvcHMgPSBjb21wb25lbnQuX19wIHx8IHByb3BzLCBwcmV2aW91c1N0YXRlID0gY29tcG9uZW50Ll9fcyB8fCBzdGF0ZSwgcHJldmlvdXNDb250ZXh0ID0gY29tcG9uZW50Ll9fYyB8fCBjb250ZXh0LCBpc1VwZGF0ZSA9IGNvbXBvbmVudC5iYXNlLCBuZXh0QmFzZSA9IGNvbXBvbmVudC5fX2IsIGluaXRpYWxCYXNlID0gaXNVcGRhdGUgfHwgbmV4dEJhc2UsIGluaXRpYWxDaGlsZENvbXBvbmVudCA9IGNvbXBvbmVudC5fY29tcG9uZW50LCBza2lwID0gITE7XG4gICAgICAgICAgICBpZiAoaXNVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcmV2aW91c1Byb3BzO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHByZXZpb3VzU3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBwcmV2aW91c0NvbnRleHQ7XG4gICAgICAgICAgICAgICAgaWYgKDIgIT09IG9wdHMgJiYgY29tcG9uZW50LnNob3VsZENvbXBvbmVudFVwZGF0ZSAmJiAhMSA9PT0gY29tcG9uZW50LnNob3VsZENvbXBvbmVudFVwZGF0ZShwcm9wcywgc3RhdGUsIGNvbnRleHQpKSBza2lwID0gITA7IGVsc2UgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKSBjb21wb25lbnQuY29tcG9uZW50V2lsbFVwZGF0ZShwcm9wcywgc3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3AgPSBjb21wb25lbnQuX19zID0gY29tcG9uZW50Ll9fYyA9IGNvbXBvbmVudC5fX2IgPSBudWxsO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9fZCA9ICExO1xuICAgICAgICAgICAgaWYgKCFza2lwKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyZWQgPSBjb21wb25lbnQucmVuZGVyKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQpIGNvbnRleHQgPSBleHRlbmQoZXh0ZW5kKHt9LCBjb250ZXh0KSwgY29tcG9uZW50LmdldENoaWxkQ29udGV4dCgpKTtcbiAgICAgICAgICAgICAgICB2YXIgdG9Vbm1vdW50LCBiYXNlLCBjaGlsZENvbXBvbmVudCA9IHJlbmRlcmVkICYmIHJlbmRlcmVkLm5vZGVOYW1lO1xuICAgICAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBjaGlsZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRQcm9wcyA9IGdldE5vZGVQcm9wcyhyZW5kZXJlZCk7XG4gICAgICAgICAgICAgICAgICAgIGluc3QgPSBpbml0aWFsQ2hpbGRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnN0ICYmIGluc3QuY29uc3RydWN0b3IgPT09IGNoaWxkQ29tcG9uZW50ICYmIGNoaWxkUHJvcHMua2V5ID09IGluc3QuX19rKSBzZXRDb21wb25lbnRQcm9wcyhpbnN0LCBjaGlsZFByb3BzLCAxLCBjb250ZXh0LCAhMSk7IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9Vbm1vdW50ID0gaW5zdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5fY29tcG9uZW50ID0gaW5zdCA9IGNyZWF0ZUNvbXBvbmVudChjaGlsZENvbXBvbmVudCwgY2hpbGRQcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fYiA9IGluc3QuX19iIHx8IG5leHRCYXNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdC5fX3UgPSBjb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhpbnN0LCBjaGlsZFByb3BzLCAwLCBjb250ZXh0LCAhMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wb25lbnQoaW5zdCwgMSwgbW91bnRBbGwsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBiYXNlID0gaW5zdC5iYXNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNiYXNlID0gaW5pdGlhbEJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHRvVW5tb3VudCA9IGluaXRpYWxDaGlsZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgY2Jhc2UgPSBjb21wb25lbnQuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsQmFzZSB8fCAxID09PSBvcHRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2Jhc2UpIGNiYXNlLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZSA9IGRpZmYoY2Jhc2UsIHJlbmRlcmVkLCBjb250ZXh0LCBtb3VudEFsbCB8fCAhaXNVcGRhdGUsIGluaXRpYWxCYXNlICYmIGluaXRpYWxCYXNlLnBhcmVudE5vZGUsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEJhc2UgJiYgYmFzZSAhPT0gaW5pdGlhbEJhc2UgJiYgaW5zdCAhPT0gaW5pdGlhbENoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiYXNlUGFyZW50ID0gaW5pdGlhbEJhc2UucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2VQYXJlbnQgJiYgYmFzZSAhPT0gYmFzZVBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZVBhcmVudC5yZXBsYWNlQ2hpbGQoYmFzZSwgaW5pdGlhbEJhc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0b1VubW91bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsQmFzZS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShpbml0aWFsQmFzZSwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0b1VubW91bnQpIHVubW91bnRDb21wb25lbnQodG9Vbm1vdW50KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuYmFzZSA9IGJhc2U7XG4gICAgICAgICAgICAgICAgaWYgKGJhc2UgJiYgIWlzQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudFJlZiA9IGNvbXBvbmVudCwgdCA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHQgPSB0Ll9fdSkgKGNvbXBvbmVudFJlZiA9IHQpLmJhc2UgPSBiYXNlO1xuICAgICAgICAgICAgICAgICAgICBiYXNlLl9jb21wb25lbnQgPSBjb21wb25lbnRSZWY7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UuX2NvbXBvbmVudENvbnN0cnVjdG9yID0gY29tcG9uZW50UmVmLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNVcGRhdGUgfHwgbW91bnRBbGwpIG1vdW50cy51bnNoaWZ0KGNvbXBvbmVudCk7IGVsc2UgaWYgKCFza2lwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnREaWRVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnREaWRVcGRhdGUocHJldmlvdXNQcm9wcywgcHJldmlvdXNTdGF0ZSwgcHJldmlvdXNDb250ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5hZnRlclVwZGF0ZSkgb3B0aW9ucy5hZnRlclVwZGF0ZShjb21wb25lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG51bGwgIT0gY29tcG9uZW50Ll9faCkgd2hpbGUgKGNvbXBvbmVudC5fX2gubGVuZ3RoKSBjb21wb25lbnQuX19oLnBvcCgpLmNhbGwoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmICghZGlmZkxldmVsICYmICFpc0NoaWxkKSBmbHVzaE1vdW50cygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkQ29tcG9uZW50RnJvbVZOb2RlKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsKSB7XG4gICAgICAgIHZhciBjID0gZG9tICYmIGRvbS5fY29tcG9uZW50LCBvcmlnaW5hbENvbXBvbmVudCA9IGMsIG9sZERvbSA9IGRvbSwgaXNEaXJlY3RPd25lciA9IGMgJiYgZG9tLl9jb21wb25lbnRDb25zdHJ1Y3RvciA9PT0gdm5vZGUubm9kZU5hbWUsIGlzT3duZXIgPSBpc0RpcmVjdE93bmVyLCBwcm9wcyA9IGdldE5vZGVQcm9wcyh2bm9kZSk7XG4gICAgICAgIHdoaWxlIChjICYmICFpc093bmVyICYmIChjID0gYy5fX3UpKSBpc093bmVyID0gYy5jb25zdHJ1Y3RvciA9PT0gdm5vZGUubm9kZU5hbWU7XG4gICAgICAgIGlmIChjICYmIGlzT3duZXIgJiYgKCFtb3VudEFsbCB8fCBjLl9jb21wb25lbnQpKSB7XG4gICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhjLCBwcm9wcywgMywgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZG9tID0gYy5iYXNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG9yaWdpbmFsQ29tcG9uZW50ICYmICFpc0RpcmVjdE93bmVyKSB7XG4gICAgICAgICAgICAgICAgdW5tb3VudENvbXBvbmVudChvcmlnaW5hbENvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgZG9tID0gb2xkRG9tID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGMgPSBjcmVhdGVDb21wb25lbnQodm5vZGUubm9kZU5hbWUsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChkb20gJiYgIWMuX19iKSB7XG4gICAgICAgICAgICAgICAgYy5fX2IgPSBkb207XG4gICAgICAgICAgICAgICAgb2xkRG9tID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCAxLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBkb20gPSBjLmJhc2U7XG4gICAgICAgICAgICBpZiAob2xkRG9tICYmIGRvbSAhPT0gb2xkRG9tKSB7XG4gICAgICAgICAgICAgICAgb2xkRG9tLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKG9sZERvbSwgITEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb207XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVubW91bnRDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgICAgIGlmIChvcHRpb25zLmJlZm9yZVVubW91bnQpIG9wdGlvbnMuYmVmb3JlVW5tb3VudChjb21wb25lbnQpO1xuICAgICAgICB2YXIgYmFzZSA9IGNvbXBvbmVudC5iYXNlO1xuICAgICAgICBjb21wb25lbnQuX194ID0gITA7XG4gICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgICAgICBjb21wb25lbnQuYmFzZSA9IG51bGw7XG4gICAgICAgIHZhciBpbm5lciA9IGNvbXBvbmVudC5fY29tcG9uZW50O1xuICAgICAgICBpZiAoaW5uZXIpIHVubW91bnRDb21wb25lbnQoaW5uZXIpOyBlbHNlIGlmIChiYXNlKSB7XG4gICAgICAgICAgICBpZiAoYmFzZS5fX3ByZWFjdGF0dHJfICYmIGJhc2UuX19wcmVhY3RhdHRyXy5yZWYpIGJhc2UuX19wcmVhY3RhdHRyXy5yZWYobnVsbCk7XG4gICAgICAgICAgICBjb21wb25lbnQuX19iID0gYmFzZTtcbiAgICAgICAgICAgIHJlbW92ZU5vZGUoYmFzZSk7XG4gICAgICAgICAgICBjb2xsZWN0Q29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgICAgICByZW1vdmVDaGlsZHJlbihiYXNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcG9uZW50Ll9fcikgY29tcG9uZW50Ll9fcihudWxsKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuX19kID0gITA7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbmRlcih2bm9kZSwgcGFyZW50LCBtZXJnZSkge1xuICAgICAgICByZXR1cm4gZGlmZihtZXJnZSwgdm5vZGUsIHt9LCAhMSwgcGFyZW50LCAhMSk7XG4gICAgfVxuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdmFyIHN0YWNrID0gW107XG4gICAgdmFyIEVNUFRZX0NISUxEUkVOID0gW107XG4gICAgdmFyIGRlZmVyID0gJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgUHJvbWlzZSA/IFByb21pc2UucmVzb2x2ZSgpLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSkgOiBzZXRUaW1lb3V0O1xuICAgIHZhciBJU19OT05fRElNRU5TSU9OQUwgPSAvYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofG93c3xtbmN8bnR3fGluZVtjaF18em9vfF5vcmQvaTtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB2YXIgbW91bnRzID0gW107XG4gICAgdmFyIGRpZmZMZXZlbCA9IDA7XG4gICAgdmFyIGlzU3ZnTW9kZSA9ICExO1xuICAgIHZhciBoeWRyYXRpbmcgPSAhMTtcbiAgICB2YXIgY29tcG9uZW50cyA9IHt9O1xuICAgIGV4dGVuZChDb21wb25lbnQucHJvdG90eXBlLCB7XG4gICAgICAgIHNldFN0YXRlOiBmdW5jdGlvbihzdGF0ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBzID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fX3MpIHRoaXMuX19zID0gZXh0ZW5kKHt9LCBzKTtcbiAgICAgICAgICAgIGV4dGVuZChzLCAnZnVuY3Rpb24nID09IHR5cGVvZiBzdGF0ZSA/IHN0YXRlKHMsIHRoaXMucHJvcHMpIDogc3RhdGUpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSAodGhpcy5fX2ggPSB0aGlzLl9faCB8fCBbXSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICBlbnF1ZXVlUmVuZGVyKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgKHRoaXMuX19oID0gdGhpcy5fX2ggfHwgW10pLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmVuZGVyQ29tcG9uZW50KHRoaXMsIDIpO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgcHJlYWN0ID0ge1xuICAgICAgICBoOiBoLFxuICAgICAgICBjcmVhdGVFbGVtZW50OiBoLFxuICAgICAgICBjbG9uZUVsZW1lbnQ6IGNsb25lRWxlbWVudCxcbiAgICAgICAgQ29tcG9uZW50OiBDb21wb25lbnQsXG4gICAgICAgIHJlbmRlcjogcmVuZGVyLFxuICAgICAgICByZXJlbmRlcjogcmVyZW5kZXIsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9O1xuICAgIGlmICgndW5kZWZpbmVkJyAhPSB0eXBlb2YgbW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IHByZWFjdDsgZWxzZSBzZWxmLnByZWFjdCA9IHByZWFjdDtcbn0oKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5qcy5tYXAiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyohIGh0dHBzOi8vbXRocy5iZS9wdW55Y29kZSB2MS40LjEgYnkgQG1hdGhpYXMgKi9cbjsoZnVuY3Rpb24ocm9vdCkge1xuXG5cdC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZXMgKi9cblx0dmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJlxuXHRcdCFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cdHZhciBmcmVlTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiZcblx0XHQhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblx0dmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcblx0aWYgKFxuXHRcdGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8XG5cdFx0ZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwgfHxcblx0XHRmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWxcblx0KSB7XG5cdFx0cm9vdCA9IGZyZWVHbG9iYWw7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwdW55Y29kZWAgb2JqZWN0LlxuXHQgKiBAbmFtZSBwdW55Y29kZVxuXHQgKiBAdHlwZSBPYmplY3Rcblx0ICovXG5cdHZhciBwdW55Y29kZSxcblxuXHQvKiogSGlnaGVzdCBwb3NpdGl2ZSBzaWduZWQgMzItYml0IGZsb2F0IHZhbHVlICovXG5cdG1heEludCA9IDIxNDc0ODM2NDcsIC8vIGFrYS4gMHg3RkZGRkZGRiBvciAyXjMxLTFcblxuXHQvKiogQm9vdHN0cmluZyBwYXJhbWV0ZXJzICovXG5cdGJhc2UgPSAzNixcblx0dE1pbiA9IDEsXG5cdHRNYXggPSAyNixcblx0c2tldyA9IDM4LFxuXHRkYW1wID0gNzAwLFxuXHRpbml0aWFsQmlhcyA9IDcyLFxuXHRpbml0aWFsTiA9IDEyOCwgLy8gMHg4MFxuXHRkZWxpbWl0ZXIgPSAnLScsIC8vICdcXHgyRCdcblxuXHQvKiogUmVndWxhciBleHByZXNzaW9ucyAqL1xuXHRyZWdleFB1bnljb2RlID0gL154bi0tLyxcblx0cmVnZXhOb25BU0NJSSA9IC9bXlxceDIwLVxceDdFXS8sIC8vIHVucHJpbnRhYmxlIEFTQ0lJIGNoYXJzICsgbm9uLUFTQ0lJIGNoYXJzXG5cdHJlZ2V4U2VwYXJhdG9ycyA9IC9bXFx4MkVcXHUzMDAyXFx1RkYwRVxcdUZGNjFdL2csIC8vIFJGQyAzNDkwIHNlcGFyYXRvcnNcblxuXHQvKiogRXJyb3IgbWVzc2FnZXMgKi9cblx0ZXJyb3JzID0ge1xuXHRcdCdvdmVyZmxvdyc6ICdPdmVyZmxvdzogaW5wdXQgbmVlZHMgd2lkZXIgaW50ZWdlcnMgdG8gcHJvY2VzcycsXG5cdFx0J25vdC1iYXNpYyc6ICdJbGxlZ2FsIGlucHV0ID49IDB4ODAgKG5vdCBhIGJhc2ljIGNvZGUgcG9pbnQpJyxcblx0XHQnaW52YWxpZC1pbnB1dCc6ICdJbnZhbGlkIGlucHV0J1xuXHR9LFxuXG5cdC8qKiBDb252ZW5pZW5jZSBzaG9ydGN1dHMgKi9cblx0YmFzZU1pbnVzVE1pbiA9IGJhc2UgLSB0TWluLFxuXHRmbG9vciA9IE1hdGguZmxvb3IsXG5cdHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUsXG5cblx0LyoqIFRlbXBvcmFyeSB2YXJpYWJsZSAqL1xuXHRrZXk7XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqXG5cdCAqIEEgZ2VuZXJpYyBlcnJvciB1dGlsaXR5IGZ1bmN0aW9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgZXJyb3IgdHlwZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaHJvd3MgYSBgUmFuZ2VFcnJvcmAgd2l0aCB0aGUgYXBwbGljYWJsZSBlcnJvciBtZXNzYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZXJyb3IodHlwZSkge1xuXHRcdHRocm93IG5ldyBSYW5nZUVycm9yKGVycm9yc1t0eXBlXSk7XG5cdH1cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGBBcnJheSNtYXBgIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeSBhcnJheVxuXHQgKiBpdGVtLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IGFycmF5IG9mIHZhbHVlcyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAoYXJyYXksIGZuKSB7XG5cdFx0dmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblx0XHR2YXIgcmVzdWx0ID0gW107XG5cdFx0d2hpbGUgKGxlbmd0aC0tKSB7XG5cdFx0XHRyZXN1bHRbbGVuZ3RoXSA9IGZuKGFycmF5W2xlbmd0aF0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgc2ltcGxlIGBBcnJheSNtYXBgLWxpa2Ugd3JhcHBlciB0byB3b3JrIHdpdGggZG9tYWluIG5hbWUgc3RyaW5ncyBvciBlbWFpbFxuXHQgKiBhZGRyZXNzZXMuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gVGhlIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeVxuXHQgKiBjaGFyYWN0ZXIuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgc3RyaW5nIG9mIGNoYXJhY3RlcnMgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrXG5cdCAqIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwRG9tYWluKHN0cmluZywgZm4pIHtcblx0XHR2YXIgcGFydHMgPSBzdHJpbmcuc3BsaXQoJ0AnKTtcblx0XHR2YXIgcmVzdWx0ID0gJyc7XG5cdFx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdC8vIEluIGVtYWlsIGFkZHJlc3Nlcywgb25seSB0aGUgZG9tYWluIG5hbWUgc2hvdWxkIGJlIHB1bnljb2RlZC4gTGVhdmVcblx0XHRcdC8vIHRoZSBsb2NhbCBwYXJ0IChpLmUuIGV2ZXJ5dGhpbmcgdXAgdG8gYEBgKSBpbnRhY3QuXG5cdFx0XHRyZXN1bHQgPSBwYXJ0c1swXSArICdAJztcblx0XHRcdHN0cmluZyA9IHBhcnRzWzFdO1xuXHRcdH1cblx0XHQvLyBBdm9pZCBgc3BsaXQocmVnZXgpYCBmb3IgSUU4IGNvbXBhdGliaWxpdHkuIFNlZSAjMTcuXG5cdFx0c3RyaW5nID0gc3RyaW5nLnJlcGxhY2UocmVnZXhTZXBhcmF0b3JzLCAnXFx4MkUnKTtcblx0XHR2YXIgbGFiZWxzID0gc3RyaW5nLnNwbGl0KCcuJyk7XG5cdFx0dmFyIGVuY29kZWQgPSBtYXAobGFiZWxzLCBmbikuam9pbignLicpO1xuXHRcdHJldHVybiByZXN1bHQgKyBlbmNvZGVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgbnVtZXJpYyBjb2RlIHBvaW50cyBvZiBlYWNoIFVuaWNvZGVcblx0ICogY2hhcmFjdGVyIGluIHRoZSBzdHJpbmcuIFdoaWxlIEphdmFTY3JpcHQgdXNlcyBVQ1MtMiBpbnRlcm5hbGx5LFxuXHQgKiB0aGlzIGZ1bmN0aW9uIHdpbGwgY29udmVydCBhIHBhaXIgb2Ygc3Vycm9nYXRlIGhhbHZlcyAoZWFjaCBvZiB3aGljaFxuXHQgKiBVQ1MtMiBleHBvc2VzIGFzIHNlcGFyYXRlIGNoYXJhY3RlcnMpIGludG8gYSBzaW5nbGUgY29kZSBwb2ludCxcblx0ICogbWF0Y2hpbmcgVVRGLTE2LlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmVuY29kZWBcblx0ICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG5cdCAqIEBuYW1lIGRlY29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIFRoZSBVbmljb2RlIGlucHV0IHN0cmluZyAoVUNTLTIpLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBuZXcgYXJyYXkgb2YgY29kZSBwb2ludHMuXG5cdCAqL1xuXHRmdW5jdGlvbiB1Y3MyZGVjb2RlKHN0cmluZykge1xuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgY291bnRlciA9IDAsXG5cdFx0ICAgIGxlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG5cdFx0ICAgIHZhbHVlLFxuXHRcdCAgICBleHRyYTtcblx0XHR3aGlsZSAoY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0dmFsdWUgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0aWYgKHZhbHVlID49IDB4RDgwMCAmJiB2YWx1ZSA8PSAweERCRkYgJiYgY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0XHQvLyBoaWdoIHN1cnJvZ2F0ZSwgYW5kIHRoZXJlIGlzIGEgbmV4dCBjaGFyYWN0ZXJcblx0XHRcdFx0ZXh0cmEgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0XHRpZiAoKGV4dHJhICYgMHhGQzAwKSA9PSAweERDMDApIHsgLy8gbG93IHN1cnJvZ2F0ZVxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKCgodmFsdWUgJiAweDNGRikgPDwgMTApICsgKGV4dHJhICYgMHgzRkYpICsgMHgxMDAwMCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gdW5tYXRjaGVkIHN1cnJvZ2F0ZTsgb25seSBhcHBlbmQgdGhpcyBjb2RlIHVuaXQsIGluIGNhc2UgdGhlIG5leHRcblx0XHRcdFx0XHQvLyBjb2RlIHVuaXQgaXMgdGhlIGhpZ2ggc3Vycm9nYXRlIG9mIGEgc3Vycm9nYXRlIHBhaXJcblx0XHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHRcdFx0Y291bnRlci0tO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIHN0cmluZyBiYXNlZCBvbiBhbiBhcnJheSBvZiBudW1lcmljIGNvZGUgcG9pbnRzLlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmRlY29kZWBcblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZW5jb2RlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGNvZGVQb2ludHMgVGhlIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBuZXcgVW5pY29kZSBzdHJpbmcgKFVDUy0yKS5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJlbmNvZGUoYXJyYXkpIHtcblx0XHRyZXR1cm4gbWFwKGFycmF5LCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyIG91dHB1dCA9ICcnO1xuXHRcdFx0aWYgKHZhbHVlID4gMHhGRkZGKSB7XG5cdFx0XHRcdHZhbHVlIC09IDB4MTAwMDA7XG5cdFx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApO1xuXHRcdFx0XHR2YWx1ZSA9IDB4REMwMCB8IHZhbHVlICYgMHgzRkY7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKHZhbHVlKTtcblx0XHRcdHJldHVybiBvdXRwdXQ7XG5cdFx0fSkuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBiYXNpYyBjb2RlIHBvaW50IGludG8gYSBkaWdpdC9pbnRlZ2VyLlxuXHQgKiBAc2VlIGBkaWdpdFRvQmFzaWMoKWBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGNvZGVQb2ludCBUaGUgYmFzaWMgbnVtZXJpYyBjb2RlIHBvaW50IHZhbHVlLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQgKGZvciB1c2UgaW5cblx0ICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpbiB0aGUgcmFuZ2UgYDBgIHRvIGBiYXNlIC0gMWAsIG9yIGBiYXNlYCBpZlxuXHQgKiB0aGUgY29kZSBwb2ludCBkb2VzIG5vdCByZXByZXNlbnQgYSB2YWx1ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2ljVG9EaWdpdChjb2RlUG9pbnQpIHtcblx0XHRpZiAoY29kZVBvaW50IC0gNDggPCAxMCkge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDIyO1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gNjUgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDY1O1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gOTcgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDk3O1xuXHRcdH1cblx0XHRyZXR1cm4gYmFzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGRpZ2l0L2ludGVnZXIgaW50byBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEBzZWUgYGJhc2ljVG9EaWdpdCgpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gZGlnaXQgVGhlIG51bWVyaWMgdmFsdWUgb2YgYSBiYXNpYyBjb2RlIHBvaW50LlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgYmFzaWMgY29kZSBwb2ludCB3aG9zZSB2YWx1ZSAod2hlbiB1c2VkIGZvclxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGlzIGBkaWdpdGAsIHdoaWNoIG5lZWRzIHRvIGJlIGluIHRoZSByYW5nZVxuXHQgKiBgMGAgdG8gYGJhc2UgLSAxYC4gSWYgYGZsYWdgIGlzIG5vbi16ZXJvLCB0aGUgdXBwZXJjYXNlIGZvcm0gaXNcblx0ICogdXNlZDsgZWxzZSwgdGhlIGxvd2VyY2FzZSBmb3JtIGlzIHVzZWQuIFRoZSBiZWhhdmlvciBpcyB1bmRlZmluZWRcblx0ICogaWYgYGZsYWdgIGlzIG5vbi16ZXJvIGFuZCBgZGlnaXRgIGhhcyBubyB1cHBlcmNhc2UgZm9ybS5cblx0ICovXG5cdGZ1bmN0aW9uIGRpZ2l0VG9CYXNpYyhkaWdpdCwgZmxhZykge1xuXHRcdC8vICAwLi4yNSBtYXAgdG8gQVNDSUkgYS4ueiBvciBBLi5aXG5cdFx0Ly8gMjYuLjM1IG1hcCB0byBBU0NJSSAwLi45XG5cdFx0cmV0dXJuIGRpZ2l0ICsgMjIgKyA3NSAqIChkaWdpdCA8IDI2KSAtICgoZmxhZyAhPSAwKSA8PCA1KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaWFzIGFkYXB0YXRpb24gZnVuY3Rpb24gYXMgcGVyIHNlY3Rpb24gMy40IG9mIFJGQyAzNDkyLlxuXHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzQ5MiNzZWN0aW9uLTMuNFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0ZnVuY3Rpb24gYWRhcHQoZGVsdGEsIG51bVBvaW50cywgZmlyc3RUaW1lKSB7XG5cdFx0dmFyIGsgPSAwO1xuXHRcdGRlbHRhID0gZmlyc3RUaW1lID8gZmxvb3IoZGVsdGEgLyBkYW1wKSA6IGRlbHRhID4+IDE7XG5cdFx0ZGVsdGEgKz0gZmxvb3IoZGVsdGEgLyBudW1Qb2ludHMpO1xuXHRcdGZvciAoLyogbm8gaW5pdGlhbGl6YXRpb24gKi87IGRlbHRhID4gYmFzZU1pbnVzVE1pbiAqIHRNYXggPj4gMTsgayArPSBiYXNlKSB7XG5cdFx0XHRkZWx0YSA9IGZsb29yKGRlbHRhIC8gYmFzZU1pbnVzVE1pbik7XG5cdFx0fVxuXHRcdHJldHVybiBmbG9vcihrICsgKGJhc2VNaW51c1RNaW4gKyAxKSAqIGRlbHRhIC8gKGRlbHRhICsgc2tldykpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scyB0byBhIHN0cmluZyBvZiBVbmljb2RlXG5cdCAqIHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuXHRcdC8vIERvbid0IHVzZSBVQ1MtMlxuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGgsXG5cdFx0ICAgIG91dCxcblx0XHQgICAgaSA9IDAsXG5cdFx0ICAgIG4gPSBpbml0aWFsTixcblx0XHQgICAgYmlhcyA9IGluaXRpYWxCaWFzLFxuXHRcdCAgICBiYXNpYyxcblx0XHQgICAgaixcblx0XHQgICAgaW5kZXgsXG5cdFx0ICAgIG9sZGksXG5cdFx0ICAgIHcsXG5cdFx0ICAgIGssXG5cdFx0ICAgIGRpZ2l0LFxuXHRcdCAgICB0LFxuXHRcdCAgICAvKiogQ2FjaGVkIGNhbGN1bGF0aW9uIHJlc3VsdHMgKi9cblx0XHQgICAgYmFzZU1pbnVzVDtcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHM6IGxldCBgYmFzaWNgIGJlIHRoZSBudW1iZXIgb2YgaW5wdXQgY29kZVxuXHRcdC8vIHBvaW50cyBiZWZvcmUgdGhlIGxhc3QgZGVsaW1pdGVyLCBvciBgMGAgaWYgdGhlcmUgaXMgbm9uZSwgdGhlbiBjb3B5XG5cdFx0Ly8gdGhlIGZpcnN0IGJhc2ljIGNvZGUgcG9pbnRzIHRvIHRoZSBvdXRwdXQuXG5cblx0XHRiYXNpYyA9IGlucHV0Lmxhc3RJbmRleE9mKGRlbGltaXRlcik7XG5cdFx0aWYgKGJhc2ljIDwgMCkge1xuXHRcdFx0YmFzaWMgPSAwO1xuXHRcdH1cblxuXHRcdGZvciAoaiA9IDA7IGogPCBiYXNpYzsgKytqKSB7XG5cdFx0XHQvLyBpZiBpdCdzIG5vdCBhIGJhc2ljIGNvZGUgcG9pbnRcblx0XHRcdGlmIChpbnB1dC5jaGFyQ29kZUF0KGopID49IDB4ODApIHtcblx0XHRcdFx0ZXJyb3IoJ25vdC1iYXNpYycpO1xuXHRcdFx0fVxuXHRcdFx0b3V0cHV0LnB1c2goaW5wdXQuY2hhckNvZGVBdChqKSk7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBkZWNvZGluZyBsb29wOiBzdGFydCBqdXN0IGFmdGVyIHRoZSBsYXN0IGRlbGltaXRlciBpZiBhbnkgYmFzaWMgY29kZVxuXHRcdC8vIHBvaW50cyB3ZXJlIGNvcGllZDsgc3RhcnQgYXQgdGhlIGJlZ2lubmluZyBvdGhlcndpc2UuXG5cblx0XHRmb3IgKGluZGV4ID0gYmFzaWMgPiAwID8gYmFzaWMgKyAxIDogMDsgaW5kZXggPCBpbnB1dExlbmd0aDsgLyogbm8gZmluYWwgZXhwcmVzc2lvbiAqLykge1xuXG5cdFx0XHQvLyBgaW5kZXhgIGlzIHRoZSBpbmRleCBvZiB0aGUgbmV4dCBjaGFyYWN0ZXIgdG8gYmUgY29uc3VtZWQuXG5cdFx0XHQvLyBEZWNvZGUgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlciBpbnRvIGBkZWx0YWAsXG5cdFx0XHQvLyB3aGljaCBnZXRzIGFkZGVkIHRvIGBpYC4gVGhlIG92ZXJmbG93IGNoZWNraW5nIGlzIGVhc2llclxuXHRcdFx0Ly8gaWYgd2UgaW5jcmVhc2UgYGlgIGFzIHdlIGdvLCB0aGVuIHN1YnRyYWN0IG9mZiBpdHMgc3RhcnRpbmdcblx0XHRcdC8vIHZhbHVlIGF0IHRoZSBlbmQgdG8gb2J0YWluIGBkZWx0YWAuXG5cdFx0XHRmb3IgKG9sZGkgPSBpLCB3ID0gMSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cblx0XHRcdFx0aWYgKGluZGV4ID49IGlucHV0TGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ2ludmFsaWQtaW5wdXQnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRpZ2l0ID0gYmFzaWNUb0RpZ2l0KGlucHV0LmNoYXJDb2RlQXQoaW5kZXgrKykpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA+PSBiYXNlIHx8IGRpZ2l0ID4gZmxvb3IoKG1heEludCAtIGkpIC8gdykpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGkgKz0gZGlnaXQgKiB3O1xuXHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblxuXHRcdFx0XHRpZiAoZGlnaXQgPCB0KSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRiYXNlTWludXNUID0gYmFzZSAtIHQ7XG5cdFx0XHRcdGlmICh3ID4gZmxvb3IobWF4SW50IC8gYmFzZU1pbnVzVCkpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHcgKj0gYmFzZU1pbnVzVDtcblxuXHRcdFx0fVxuXG5cdFx0XHRvdXQgPSBvdXRwdXQubGVuZ3RoICsgMTtcblx0XHRcdGJpYXMgPSBhZGFwdChpIC0gb2xkaSwgb3V0LCBvbGRpID09IDApO1xuXG5cdFx0XHQvLyBgaWAgd2FzIHN1cHBvc2VkIHRvIHdyYXAgYXJvdW5kIGZyb20gYG91dGAgdG8gYDBgLFxuXHRcdFx0Ly8gaW5jcmVtZW50aW5nIGBuYCBlYWNoIHRpbWUsIHNvIHdlJ2xsIGZpeCB0aGF0IG5vdzpcblx0XHRcdGlmIChmbG9vcihpIC8gb3V0KSA+IG1heEludCAtIG4pIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdG4gKz0gZmxvb3IoaSAvIG91dCk7XG5cdFx0XHRpICU9IG91dDtcblxuXHRcdFx0Ly8gSW5zZXJ0IGBuYCBhdCBwb3NpdGlvbiBgaWAgb2YgdGhlIG91dHB1dFxuXHRcdFx0b3V0cHV0LnNwbGljZShpKyssIDAsIG4pO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVjczJlbmNvZGUob3V0cHV0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMgKGUuZy4gYSBkb21haW4gbmFtZSBsYWJlbCkgdG8gYVxuXHQgKiBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBlbmNvZGUoaW5wdXQpIHtcblx0XHR2YXIgbixcblx0XHQgICAgZGVsdGEsXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50LFxuXHRcdCAgICBiYXNpY0xlbmd0aCxcblx0XHQgICAgYmlhcyxcblx0XHQgICAgaixcblx0XHQgICAgbSxcblx0XHQgICAgcSxcblx0XHQgICAgayxcblx0XHQgICAgdCxcblx0XHQgICAgY3VycmVudFZhbHVlLFxuXHRcdCAgICBvdXRwdXQgPSBbXSxcblx0XHQgICAgLyoqIGBpbnB1dExlbmd0aGAgd2lsbCBob2xkIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgaW4gYGlucHV0YC4gKi9cblx0XHQgICAgaW5wdXRMZW5ndGgsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsXG5cdFx0ICAgIGJhc2VNaW51c1QsXG5cdFx0ICAgIHFNaW51c1Q7XG5cblx0XHQvLyBDb252ZXJ0IHRoZSBpbnB1dCBpbiBVQ1MtMiB0byBVbmljb2RlXG5cdFx0aW5wdXQgPSB1Y3MyZGVjb2RlKGlucHV0KTtcblxuXHRcdC8vIENhY2hlIHRoZSBsZW5ndGhcblx0XHRpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aDtcblxuXHRcdC8vIEluaXRpYWxpemUgdGhlIHN0YXRlXG5cdFx0biA9IGluaXRpYWxOO1xuXHRcdGRlbHRhID0gMDtcblx0XHRiaWFzID0gaW5pdGlhbEJpYXM7XG5cblx0XHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzXG5cdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IDB4ODApIHtcblx0XHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGN1cnJlbnRWYWx1ZSkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGhhbmRsZWRDUENvdW50ID0gYmFzaWNMZW5ndGggPSBvdXRwdXQubGVuZ3RoO1xuXG5cdFx0Ly8gYGhhbmRsZWRDUENvdW50YCBpcyB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIHRoYXQgaGF2ZSBiZWVuIGhhbmRsZWQ7XG5cdFx0Ly8gYGJhc2ljTGVuZ3RoYCBpcyB0aGUgbnVtYmVyIG9mIGJhc2ljIGNvZGUgcG9pbnRzLlxuXG5cdFx0Ly8gRmluaXNoIHRoZSBiYXNpYyBzdHJpbmcgLSBpZiBpdCBpcyBub3QgZW1wdHkgLSB3aXRoIGEgZGVsaW1pdGVyXG5cdFx0aWYgKGJhc2ljTGVuZ3RoKSB7XG5cdFx0XHRvdXRwdXQucHVzaChkZWxpbWl0ZXIpO1xuXHRcdH1cblxuXHRcdC8vIE1haW4gZW5jb2RpbmcgbG9vcDpcblx0XHR3aGlsZSAoaGFuZGxlZENQQ291bnQgPCBpbnB1dExlbmd0aCkge1xuXG5cdFx0XHQvLyBBbGwgbm9uLWJhc2ljIGNvZGUgcG9pbnRzIDwgbiBoYXZlIGJlZW4gaGFuZGxlZCBhbHJlYWR5LiBGaW5kIHRoZSBuZXh0XG5cdFx0XHQvLyBsYXJnZXIgb25lOlxuXHRcdFx0Zm9yIChtID0gbWF4SW50LCBqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPj0gbiAmJiBjdXJyZW50VmFsdWUgPCBtKSB7XG5cdFx0XHRcdFx0bSA9IGN1cnJlbnRWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbmNyZWFzZSBgZGVsdGFgIGVub3VnaCB0byBhZHZhbmNlIHRoZSBkZWNvZGVyJ3MgPG4saT4gc3RhdGUgdG8gPG0sMD4sXG5cdFx0XHQvLyBidXQgZ3VhcmQgYWdhaW5zdCBvdmVyZmxvd1xuXHRcdFx0aGFuZGxlZENQQ291bnRQbHVzT25lID0gaGFuZGxlZENQQ291bnQgKyAxO1xuXHRcdFx0aWYgKG0gLSBuID4gZmxvb3IoKG1heEludCAtIGRlbHRhKSAvIGhhbmRsZWRDUENvdW50UGx1c09uZSkpIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGRlbHRhICs9IChtIC0gbikgKiBoYW5kbGVkQ1BDb3VudFBsdXNPbmU7XG5cdFx0XHRuID0gbTtcblxuXHRcdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IG4gJiYgKytkZWx0YSA+IG1heEludCkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PSBuKSB7XG5cdFx0XHRcdFx0Ly8gUmVwcmVzZW50IGRlbHRhIGFzIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXJcblx0XHRcdFx0XHRmb3IgKHEgPSBkZWx0YSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cdFx0XHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblx0XHRcdFx0XHRcdGlmIChxIDwgdCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHFNaW51c1QgPSBxIC0gdDtcblx0XHRcdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKFxuXHRcdFx0XHRcdFx0XHRzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHQgKyBxTWludXNUICUgYmFzZU1pbnVzVCwgMCkpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0cSA9IGZsb29yKHFNaW51c1QgLyBiYXNlTWludXNUKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHEsIDApKSk7XG5cdFx0XHRcdFx0YmlhcyA9IGFkYXB0KGRlbHRhLCBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsIGhhbmRsZWRDUENvdW50ID09IGJhc2ljTGVuZ3RoKTtcblx0XHRcdFx0XHRkZWx0YSA9IDA7XG5cdFx0XHRcdFx0KytoYW5kbGVkQ1BDb3VudDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQrK2RlbHRhO1xuXHRcdFx0KytuO1xuXG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgb3IgYW4gZW1haWwgYWRkcmVzc1xuXHQgKiB0byBVbmljb2RlLiBPbmx5IHRoZSBQdW55Y29kZWQgcGFydHMgb2YgdGhlIGlucHV0IHdpbGwgYmUgY29udmVydGVkLCBpLmUuXG5cdCAqIGl0IGRvZXNuJ3QgbWF0dGVyIGlmIHlvdSBjYWxsIGl0IG9uIGEgc3RyaW5nIHRoYXQgaGFzIGFscmVhZHkgYmVlblxuXHQgKiBjb252ZXJ0ZWQgdG8gVW5pY29kZS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGVkIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MgdG9cblx0ICogY29udmVydCB0byBVbmljb2RlLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgVW5pY29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gUHVueWNvZGVcblx0ICogc3RyaW5nLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9Vbmljb2RlKGlucHV0KSB7XG5cdFx0cmV0dXJuIG1hcERvbWFpbihpbnB1dCwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhQdW55Y29kZS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyBkZWNvZGUoc3RyaW5nLnNsaWNlKDQpLnRvTG93ZXJDYXNlKCkpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgVW5pY29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgb3IgYW4gZW1haWwgYWRkcmVzcyB0b1xuXHQgKiBQdW55Y29kZS4gT25seSB0aGUgbm9uLUFTQ0lJIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB3aWxsIGJlIGNvbnZlcnRlZCxcblx0ICogaS5lLiBpdCBkb2Vzbid0IG1hdHRlciBpZiB5b3UgY2FsbCBpdCB3aXRoIGEgZG9tYWluIHRoYXQncyBhbHJlYWR5IGluXG5cdCAqIEFTQ0lJLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzIHRvIGNvbnZlcnQsIGFzIGFcblx0ICogVW5pY29kZSBzdHJpbmcuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBQdW55Y29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gZG9tYWluIG5hbWUgb3Jcblx0ICogZW1haWwgYWRkcmVzcy5cblx0ICovXG5cdGZ1bmN0aW9uIHRvQVNDSUkoaW5wdXQpIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleE5vbkFTQ0lJLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/ICd4bi0tJyArIGVuY29kZShzdHJpbmcpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqIERlZmluZSB0aGUgcHVibGljIEFQSSAqL1xuXHRwdW55Y29kZSA9IHtcblx0XHQvKipcblx0XHQgKiBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgUHVueWNvZGUuanMgdmVyc2lvbiBudW1iZXIuXG5cdFx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdFx0ICogQHR5cGUgU3RyaW5nXG5cdFx0ICovXG5cdFx0J3ZlcnNpb24nOiAnMS40LjEnLFxuXHRcdC8qKlxuXHRcdCAqIEFuIG9iamVjdCBvZiBtZXRob2RzIHRvIGNvbnZlcnQgZnJvbSBKYXZhU2NyaXB0J3MgaW50ZXJuYWwgY2hhcmFjdGVyXG5cdFx0ICogcmVwcmVzZW50YXRpb24gKFVDUy0yKSB0byBVbmljb2RlIGNvZGUgcG9pbnRzLCBhbmQgYmFjay5cblx0XHQgKiBAc2VlIDxodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0XHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0XHQgKiBAdHlwZSBPYmplY3Rcblx0XHQgKi9cblx0XHQndWNzMic6IHtcblx0XHRcdCdkZWNvZGUnOiB1Y3MyZGVjb2RlLFxuXHRcdFx0J2VuY29kZSc6IHVjczJlbmNvZGVcblx0XHR9LFxuXHRcdCdkZWNvZGUnOiBkZWNvZGUsXG5cdFx0J2VuY29kZSc6IGVuY29kZSxcblx0XHQndG9BU0NJSSc6IHRvQVNDSUksXG5cdFx0J3RvVW5pY29kZSc6IHRvVW5pY29kZVxuXHR9O1xuXG5cdC8qKiBFeHBvc2UgYHB1bnljb2RlYCAqL1xuXHQvLyBTb21lIEFNRCBidWlsZCBvcHRpbWl6ZXJzLCBsaWtlIHIuanMsIGNoZWNrIGZvciBzcGVjaWZpYyBjb25kaXRpb24gcGF0dGVybnNcblx0Ly8gbGlrZSB0aGUgZm9sbG93aW5nOlxuXHRpZiAoXG5cdFx0dHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiZcblx0XHRkZWZpbmUuYW1kXG5cdCkge1xuXHRcdGRlZmluZSgncHVueWNvZGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBwdW55Y29kZTtcblx0XHR9KTtcblx0fSBlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG5cdFx0aWYgKG1vZHVsZS5leHBvcnRzID09IGZyZWVFeHBvcnRzKSB7XG5cdFx0XHQvLyBpbiBOb2RlLmpzLCBpby5qcywgb3IgUmluZ29KUyB2MC44LjArXG5cdFx0XHRmcmVlTW9kdWxlLmV4cG9ydHMgPSBwdW55Y29kZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gaW4gTmFyd2hhbCBvciBSaW5nb0pTIHYwLjcuMC1cblx0XHRcdGZvciAoa2V5IGluIHB1bnljb2RlKSB7XG5cdFx0XHRcdHB1bnljb2RlLmhhc093blByb3BlcnR5KGtleSkgJiYgKGZyZWVFeHBvcnRzW2tleV0gPSBwdW55Y29kZVtrZXldKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly8gaW4gUmhpbm8gb3IgYSB3ZWIgYnJvd3NlclxuXHRcdHJvb3QucHVueWNvZGUgPSBwdW55Y29kZTtcblx0fVxuXG59KHRoaXMpKTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuIiwidmFyIHJlbGF0aXZlRGF0ZSA9IChmdW5jdGlvbih1bmRlZmluZWQpe1xuXG4gIHZhciBTRUNPTkQgPSAxMDAwLFxuICAgICAgTUlOVVRFID0gNjAgKiBTRUNPTkQsXG4gICAgICBIT1VSID0gNjAgKiBNSU5VVEUsXG4gICAgICBEQVkgPSAyNCAqIEhPVVIsXG4gICAgICBXRUVLID0gNyAqIERBWSxcbiAgICAgIFlFQVIgPSBEQVkgKiAzNjUsXG4gICAgICBNT05USCA9IFlFQVIgLyAxMjtcblxuICB2YXIgZm9ybWF0cyA9IFtcbiAgICBbIDAuNyAqIE1JTlVURSwgJ2p1c3Qgbm93JyBdLFxuICAgIFsgMS41ICogTUlOVVRFLCAnYSBtaW51dGUgYWdvJyBdLFxuICAgIFsgNjAgKiBNSU5VVEUsICdtaW51dGVzIGFnbycsIE1JTlVURSBdLFxuICAgIFsgMS41ICogSE9VUiwgJ2FuIGhvdXIgYWdvJyBdLFxuICAgIFsgREFZLCAnaG91cnMgYWdvJywgSE9VUiBdLFxuICAgIFsgMiAqIERBWSwgJ3llc3RlcmRheScgXSxcbiAgICBbIDcgKiBEQVksICdkYXlzIGFnbycsIERBWSBdLFxuICAgIFsgMS41ICogV0VFSywgJ2Egd2VlayBhZ28nXSxcbiAgICBbIE1PTlRILCAnd2Vla3MgYWdvJywgV0VFSyBdLFxuICAgIFsgMS41ICogTU9OVEgsICdhIG1vbnRoIGFnbycgXSxcbiAgICBbIFlFQVIsICdtb250aHMgYWdvJywgTU9OVEggXSxcbiAgICBbIDEuNSAqIFlFQVIsICdhIHllYXIgYWdvJyBdLFxuICAgIFsgTnVtYmVyLk1BWF9WQUxVRSwgJ3llYXJzIGFnbycsIFlFQVIgXVxuICBdO1xuXG4gIGZ1bmN0aW9uIHJlbGF0aXZlRGF0ZShpbnB1dCxyZWZlcmVuY2Upe1xuICAgICFyZWZlcmVuY2UgJiYgKCByZWZlcmVuY2UgPSAobmV3IERhdGUpLmdldFRpbWUoKSApO1xuICAgIHJlZmVyZW5jZSBpbnN0YW5jZW9mIERhdGUgJiYgKCByZWZlcmVuY2UgPSByZWZlcmVuY2UuZ2V0VGltZSgpICk7XG4gICAgaW5wdXQgaW5zdGFuY2VvZiBEYXRlICYmICggaW5wdXQgPSBpbnB1dC5nZXRUaW1lKCkgKTtcbiAgICBcbiAgICB2YXIgZGVsdGEgPSByZWZlcmVuY2UgLSBpbnB1dCxcbiAgICAgICAgZm9ybWF0LCBpLCBsZW47XG5cbiAgICBmb3IoaSA9IC0xLCBsZW49Zm9ybWF0cy5sZW5ndGg7ICsraSA8IGxlbjsgKXtcbiAgICAgIGZvcm1hdCA9IGZvcm1hdHNbaV07XG4gICAgICBpZihkZWx0YSA8IGZvcm1hdFswXSl7XG4gICAgICAgIHJldHVybiBmb3JtYXRbMl0gPT0gdW5kZWZpbmVkID8gZm9ybWF0WzFdIDogTWF0aC5yb3VuZChkZWx0YS9mb3JtYXRbMl0pICsgJyAnICsgZm9ybWF0WzFdO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gcmVsYXRpdmVEYXRlO1xuXG59KSgpO1xuXG5pZih0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKXtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZWxhdGl2ZURhdGU7XG59XG4iLCJcbm1vZHVsZS5leHBvcnRzID0gW1xuICAnYScsXG4gICdhbicsXG4gICdhbmQnLFxuICAnYXMnLFxuICAnYXQnLFxuICAnYnV0JyxcbiAgJ2J5JyxcbiAgJ2VuJyxcbiAgJ2ZvcicsXG4gICdmcm9tJyxcbiAgJ2hvdycsXG4gICdpZicsXG4gICdpbicsXG4gICduZWl0aGVyJyxcbiAgJ25vcicsXG4gICdvZicsXG4gICdvbicsXG4gICdvbmx5JyxcbiAgJ29udG8nLFxuICAnb3V0JyxcbiAgJ29yJyxcbiAgJ3BlcicsXG4gICdzbycsXG4gICd0aGFuJyxcbiAgJ3RoYXQnLFxuICAndGhlJyxcbiAgJ3RvJyxcbiAgJ3VudGlsJyxcbiAgJ3VwJyxcbiAgJ3Vwb24nLFxuICAndicsXG4gICd2LicsXG4gICd2ZXJzdXMnLFxuICAndnMnLFxuICAndnMuJyxcbiAgJ3ZpYScsXG4gICd3aGVuJyxcbiAgJ3dpdGgnLFxuICAnd2l0aG91dCcsXG4gICd5ZXQnXG5dOyIsInZhciB0b1RpdGxlID0gcmVxdWlyZShcInRvLXRpdGxlXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVybFRvVGl0bGU7XG5cbmZ1bmN0aW9uIHVybFRvVGl0bGUgKHVybCkge1xuICB1cmwgPSB1bmVzY2FwZSh1cmwpLnJlcGxhY2UoL18vZywgJyAnKTtcbiAgdXJsID0gdXJsLnJlcGxhY2UoL15cXHcrOlxcL1xcLy8sICcnKTtcbiAgdXJsID0gdXJsLnJlcGxhY2UoL153d3dcXC4vLCAnJyk7XG4gIHVybCA9IHVybC5yZXBsYWNlKC8oXFwvfFxcPykkLywgJycpO1xuXG4gIHZhciBwYXJ0cyA9IHVybC5zcGxpdCgnPycpO1xuICB1cmwgPSBwYXJ0c1swXTtcbiAgdXJsID0gdXJsLnJlcGxhY2UoL1xcLlxcdyskLywgJycpO1xuXG4gIHBhcnRzID0gdXJsLnNwbGl0KCcvJyk7XG5cbiAgdmFyIG5hbWUgPSBwYXJ0c1swXTtcbiAgbmFtZSA9IG5hbWUucmVwbGFjZSgvXFwuXFx3KyhcXC98JCkvLCAnJykucmVwbGFjZSgvXFwuKGNvbT98bmV0fG9yZ3xmcikkLywgJycpXG5cbiAgaWYgKHBhcnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgcmV0dXJuIHRpdGxlKG5hbWUpO1xuICB9XG5cbiAgcmV0dXJuIHRvVGl0bGUocGFydHMuc2xpY2UoMSkucmV2ZXJzZSgpLm1hcCh0b1RpdGxlKS5qb2luKCcgLSAnKSkgKyAnIG9uICcgKyB0aXRsZShuYW1lKTtcbn1cblxuZnVuY3Rpb24gdGl0bGUgKGhvc3QpIHtcbiAgaWYgKC9eW1xcd1xcLlxcLV0rOlxcZCsvLnRlc3QoaG9zdCkpIHtcbiAgICByZXR1cm4gaG9zdFxuICB9XG5cbiAgcmV0dXJuIHRvVGl0bGUoaG9zdC5zcGxpdCgnLicpLmpvaW4oJywgJykpXG59XG4iLCJcbnZhciBjbGVhbiA9IHJlcXVpcmUoJ3RvLW5vLWNhc2UnKTtcblxuXG4vKipcbiAqIEV4cG9zZSBgdG9DYXBpdGFsQ2FzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0b0NhcGl0YWxDYXNlO1xuXG5cbi8qKlxuICogQ29udmVydCBhIGBzdHJpbmdgIHRvIGNhcGl0YWwgY2FzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuXG5mdW5jdGlvbiB0b0NhcGl0YWxDYXNlIChzdHJpbmcpIHtcbiAgcmV0dXJuIGNsZWFuKHN0cmluZykucmVwbGFjZSgvKF58XFxzKShcXHcpL2csIGZ1bmN0aW9uIChtYXRjaGVzLCBwcmV2aW91cywgbGV0dGVyKSB7XG4gICAgcmV0dXJuIHByZXZpb3VzICsgbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xufSIsIlxuLyoqXG4gKiBFeHBvc2UgYHRvTm9DYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTm9DYXNlO1xuXG5cbi8qKlxuICogVGVzdCB3aGV0aGVyIGEgc3RyaW5nIGlzIGNhbWVsLWNhc2UuXG4gKi9cblxudmFyIGhhc1NwYWNlID0gL1xccy87XG52YXIgaGFzQ2FtZWwgPSAvW2Etel1bQS1aXS87XG52YXIgaGFzU2VwYXJhdG9yID0gL1tcXFdfXS87XG5cblxuLyoqXG4gKiBSZW1vdmUgYW55IHN0YXJ0aW5nIGNhc2UgZnJvbSBhIGBzdHJpbmdgLCBsaWtlIGNhbWVsIG9yIHNuYWtlLCBidXQga2VlcFxuICogc3BhY2VzIGFuZCBwdW5jdHVhdGlvbiB0aGF0IG1heSBiZSBpbXBvcnRhbnQgb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiB0b05vQ2FzZSAoc3RyaW5nKSB7XG4gIGlmIChoYXNTcGFjZS50ZXN0KHN0cmluZykpIHJldHVybiBzdHJpbmcudG9Mb3dlckNhc2UoKTtcblxuICBpZiAoaGFzU2VwYXJhdG9yLnRlc3Qoc3RyaW5nKSkgc3RyaW5nID0gdW5zZXBhcmF0ZShzdHJpbmcpO1xuICBpZiAoaGFzQ2FtZWwudGVzdChzdHJpbmcpKSBzdHJpbmcgPSB1bmNhbWVsaXplKHN0cmluZyk7XG4gIHJldHVybiBzdHJpbmcudG9Mb3dlckNhc2UoKTtcbn1cblxuXG4vKipcbiAqIFNlcGFyYXRvciBzcGxpdHRlci5cbiAqL1xuXG52YXIgc2VwYXJhdG9yU3BsaXR0ZXIgPSAvW1xcV19dKygufCQpL2c7XG5cblxuLyoqXG4gKiBVbi1zZXBhcmF0ZSBhIGBzdHJpbmdgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiB1bnNlcGFyYXRlIChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKHNlcGFyYXRvclNwbGl0dGVyLCBmdW5jdGlvbiAobSwgbmV4dCkge1xuICAgIHJldHVybiBuZXh0ID8gJyAnICsgbmV4dCA6ICcnO1xuICB9KTtcbn1cblxuXG4vKipcbiAqIENhbWVsY2FzZSBzcGxpdHRlci5cbiAqL1xuXG52YXIgY2FtZWxTcGxpdHRlciA9IC8oLikoW0EtWl0rKS9nO1xuXG5cbi8qKlxuICogVW4tY2FtZWxjYXNlIGEgYHN0cmluZ2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHVuY2FtZWxpemUgKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoY2FtZWxTcGxpdHRlciwgZnVuY3Rpb24gKG0sIHByZXZpb3VzLCB1cHBlcnMpIHtcbiAgICByZXR1cm4gcHJldmlvdXMgKyAnICcgKyB1cHBlcnMudG9Mb3dlckNhc2UoKS5zcGxpdCgnJykuam9pbignICcpO1xuICB9KTtcbn0iLCJ2YXIgZXNjYXBlID0gcmVxdWlyZSgnZXNjYXBlLXJlZ2V4cC1jb21wb25lbnQnKTtcbnZhciBjYXBpdGFsID0gcmVxdWlyZSgndG8tY2FwaXRhbC1jYXNlJyk7XG52YXIgbWlub3JzID0gcmVxdWlyZSgndGl0bGUtY2FzZS1taW5vcnMnKTtcblxuLyoqXG4gKiBFeHBvc2UgYHRvVGl0bGVDYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvVGl0bGVDYXNlO1xuXG5cbi8qKlxuICogTWlub3JzLlxuICovXG5cbnZhciBlc2NhcGVkID0gbWlub3JzLm1hcChlc2NhcGUpO1xudmFyIG1pbm9yTWF0Y2hlciA9IG5ldyBSZWdFeHAoJ1teXl1cXFxcYignICsgZXNjYXBlZC5qb2luKCd8JykgKyAnKVxcXFxiJywgJ2lnJyk7XG52YXIgY29sb25NYXRjaGVyID0gLzpcXHMqKFxcdykvZztcblxuXG4vKipcbiAqIENvbnZlcnQgYSBgc3RyaW5nYCB0byBjYW1lbCBjYXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlIChzdHJpbmcpIHtcbiAgcmV0dXJuIGNhcGl0YWwoc3RyaW5nKVxuICAgIC5yZXBsYWNlKG1pbm9yTWF0Y2hlciwgZnVuY3Rpb24gKG1pbm9yKSB7XG4gICAgICByZXR1cm4gbWlub3IudG9Mb3dlckNhc2UoKTtcbiAgICB9KVxuICAgIC5yZXBsYWNlKGNvbG9uTWF0Y2hlciwgZnVuY3Rpb24gKGxldHRlcikge1xuICAgICAgcmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHB1bnljb2RlID0gcmVxdWlyZSgncHVueWNvZGUnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmV4cG9ydHMucGFyc2UgPSB1cmxQYXJzZTtcbmV4cG9ydHMucmVzb2x2ZSA9IHVybFJlc29sdmU7XG5leHBvcnRzLnJlc29sdmVPYmplY3QgPSB1cmxSZXNvbHZlT2JqZWN0O1xuZXhwb3J0cy5mb3JtYXQgPSB1cmxGb3JtYXQ7XG5cbmV4cG9ydHMuVXJsID0gVXJsO1xuXG5mdW5jdGlvbiBVcmwoKSB7XG4gIHRoaXMucHJvdG9jb2wgPSBudWxsO1xuICB0aGlzLnNsYXNoZXMgPSBudWxsO1xuICB0aGlzLmF1dGggPSBudWxsO1xuICB0aGlzLmhvc3QgPSBudWxsO1xuICB0aGlzLnBvcnQgPSBudWxsO1xuICB0aGlzLmhvc3RuYW1lID0gbnVsbDtcbiAgdGhpcy5oYXNoID0gbnVsbDtcbiAgdGhpcy5zZWFyY2ggPSBudWxsO1xuICB0aGlzLnF1ZXJ5ID0gbnVsbDtcbiAgdGhpcy5wYXRobmFtZSA9IG51bGw7XG4gIHRoaXMucGF0aCA9IG51bGw7XG4gIHRoaXMuaHJlZiA9IG51bGw7XG59XG5cbi8vIFJlZmVyZW5jZTogUkZDIDM5ODYsIFJGQyAxODA4LCBSRkMgMjM5NlxuXG4vLyBkZWZpbmUgdGhlc2UgaGVyZSBzbyBhdCBsZWFzdCB0aGV5IG9ubHkgaGF2ZSB0byBiZVxuLy8gY29tcGlsZWQgb25jZSBvbiB0aGUgZmlyc3QgbW9kdWxlIGxvYWQuXG52YXIgcHJvdG9jb2xQYXR0ZXJuID0gL14oW2EtejAtOS4rLV0rOikvaSxcbiAgICBwb3J0UGF0dGVybiA9IC86WzAtOV0qJC8sXG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIGEgc2ltcGxlIHBhdGggVVJMXG4gICAgc2ltcGxlUGF0aFBhdHRlcm4gPSAvXihcXC9cXC8/KD8hXFwvKVteXFw/XFxzXSopKFxcP1teXFxzXSopPyQvLFxuXG4gICAgLy8gUkZDIDIzOTY6IGNoYXJhY3RlcnMgcmVzZXJ2ZWQgZm9yIGRlbGltaXRpbmcgVVJMcy5cbiAgICAvLyBXZSBhY3R1YWxseSBqdXN0IGF1dG8tZXNjYXBlIHRoZXNlLlxuICAgIGRlbGltcyA9IFsnPCcsICc+JywgJ1wiJywgJ2AnLCAnICcsICdcXHInLCAnXFxuJywgJ1xcdCddLFxuXG4gICAgLy8gUkZDIDIzOTY6IGNoYXJhY3RlcnMgbm90IGFsbG93ZWQgZm9yIHZhcmlvdXMgcmVhc29ucy5cbiAgICB1bndpc2UgPSBbJ3snLCAnfScsICd8JywgJ1xcXFwnLCAnXicsICdgJ10uY29uY2F0KGRlbGltcyksXG5cbiAgICAvLyBBbGxvd2VkIGJ5IFJGQ3MsIGJ1dCBjYXVzZSBvZiBYU1MgYXR0YWNrcy4gIEFsd2F5cyBlc2NhcGUgdGhlc2UuXG4gICAgYXV0b0VzY2FwZSA9IFsnXFwnJ10uY29uY2F0KHVud2lzZSksXG4gICAgLy8gQ2hhcmFjdGVycyB0aGF0IGFyZSBuZXZlciBldmVyIGFsbG93ZWQgaW4gYSBob3N0bmFtZS5cbiAgICAvLyBOb3RlIHRoYXQgYW55IGludmFsaWQgY2hhcnMgYXJlIGFsc28gaGFuZGxlZCwgYnV0IHRoZXNlXG4gICAgLy8gYXJlIHRoZSBvbmVzIHRoYXQgYXJlICpleHBlY3RlZCogdG8gYmUgc2Vlbiwgc28gd2UgZmFzdC1wYXRoXG4gICAgLy8gdGhlbS5cbiAgICBub25Ib3N0Q2hhcnMgPSBbJyUnLCAnLycsICc/JywgJzsnLCAnIyddLmNvbmNhdChhdXRvRXNjYXBlKSxcbiAgICBob3N0RW5kaW5nQ2hhcnMgPSBbJy8nLCAnPycsICcjJ10sXG4gICAgaG9zdG5hbWVNYXhMZW4gPSAyNTUsXG4gICAgaG9zdG5hbWVQYXJ0UGF0dGVybiA9IC9eWythLXowLTlBLVpfLV17MCw2M30kLyxcbiAgICBob3N0bmFtZVBhcnRTdGFydCA9IC9eKFsrYS16MC05QS1aXy1dezAsNjN9KSguKikkLyxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBjYW4gYWxsb3cgXCJ1bnNhZmVcIiBhbmQgXCJ1bndpc2VcIiBjaGFycy5cbiAgICB1bnNhZmVQcm90b2NvbCA9IHtcbiAgICAgICdqYXZhc2NyaXB0JzogdHJ1ZSxcbiAgICAgICdqYXZhc2NyaXB0Oic6IHRydWVcbiAgICB9LFxuICAgIC8vIHByb3RvY29scyB0aGF0IG5ldmVyIGhhdmUgYSBob3N0bmFtZS5cbiAgICBob3N0bGVzc1Byb3RvY29sID0ge1xuICAgICAgJ2phdmFzY3JpcHQnOiB0cnVlLFxuICAgICAgJ2phdmFzY3JpcHQ6JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgYWx3YXlzIGNvbnRhaW4gYSAvLyBiaXQuXG4gICAgc2xhc2hlZFByb3RvY29sID0ge1xuICAgICAgJ2h0dHAnOiB0cnVlLFxuICAgICAgJ2h0dHBzJzogdHJ1ZSxcbiAgICAgICdmdHAnOiB0cnVlLFxuICAgICAgJ2dvcGhlcic6IHRydWUsXG4gICAgICAnZmlsZSc6IHRydWUsXG4gICAgICAnaHR0cDonOiB0cnVlLFxuICAgICAgJ2h0dHBzOic6IHRydWUsXG4gICAgICAnZnRwOic6IHRydWUsXG4gICAgICAnZ29waGVyOic6IHRydWUsXG4gICAgICAnZmlsZTonOiB0cnVlXG4gICAgfSxcbiAgICBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XG5cbmZ1bmN0aW9uIHVybFBhcnNlKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpIHtcbiAgaWYgKHVybCAmJiB1dGlsLmlzT2JqZWN0KHVybCkgJiYgdXJsIGluc3RhbmNlb2YgVXJsKSByZXR1cm4gdXJsO1xuXG4gIHZhciB1ID0gbmV3IFVybDtcbiAgdS5wYXJzZSh1cmwsIHBhcnNlUXVlcnlTdHJpbmcsIHNsYXNoZXNEZW5vdGVIb3N0KTtcbiAgcmV0dXJuIHU7XG59XG5cblVybC5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbih1cmwsIHBhcnNlUXVlcnlTdHJpbmcsIHNsYXNoZXNEZW5vdGVIb3N0KSB7XG4gIGlmICghdXRpbC5pc1N0cmluZyh1cmwpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlBhcmFtZXRlciAndXJsJyBtdXN0IGJlIGEgc3RyaW5nLCBub3QgXCIgKyB0eXBlb2YgdXJsKTtcbiAgfVxuXG4gIC8vIENvcHkgY2hyb21lLCBJRSwgb3BlcmEgYmFja3NsYXNoLWhhbmRsaW5nIGJlaGF2aW9yLlxuICAvLyBCYWNrIHNsYXNoZXMgYmVmb3JlIHRoZSBxdWVyeSBzdHJpbmcgZ2V0IGNvbnZlcnRlZCB0byBmb3J3YXJkIHNsYXNoZXNcbiAgLy8gU2VlOiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MjU5MTZcbiAgdmFyIHF1ZXJ5SW5kZXggPSB1cmwuaW5kZXhPZignPycpLFxuICAgICAgc3BsaXR0ZXIgPVxuICAgICAgICAgIChxdWVyeUluZGV4ICE9PSAtMSAmJiBxdWVyeUluZGV4IDwgdXJsLmluZGV4T2YoJyMnKSkgPyAnPycgOiAnIycsXG4gICAgICB1U3BsaXQgPSB1cmwuc3BsaXQoc3BsaXR0ZXIpLFxuICAgICAgc2xhc2hSZWdleCA9IC9cXFxcL2c7XG4gIHVTcGxpdFswXSA9IHVTcGxpdFswXS5yZXBsYWNlKHNsYXNoUmVnZXgsICcvJyk7XG4gIHVybCA9IHVTcGxpdC5qb2luKHNwbGl0dGVyKTtcblxuICB2YXIgcmVzdCA9IHVybDtcblxuICAvLyB0cmltIGJlZm9yZSBwcm9jZWVkaW5nLlxuICAvLyBUaGlzIGlzIHRvIHN1cHBvcnQgcGFyc2Ugc3R1ZmYgbGlrZSBcIiAgaHR0cDovL2Zvby5jb20gIFxcblwiXG4gIHJlc3QgPSByZXN0LnRyaW0oKTtcblxuICBpZiAoIXNsYXNoZXNEZW5vdGVIb3N0ICYmIHVybC5zcGxpdCgnIycpLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIFRyeSBmYXN0IHBhdGggcmVnZXhwXG4gICAgdmFyIHNpbXBsZVBhdGggPSBzaW1wbGVQYXRoUGF0dGVybi5leGVjKHJlc3QpO1xuICAgIGlmIChzaW1wbGVQYXRoKSB7XG4gICAgICB0aGlzLnBhdGggPSByZXN0O1xuICAgICAgdGhpcy5ocmVmID0gcmVzdDtcbiAgICAgIHRoaXMucGF0aG5hbWUgPSBzaW1wbGVQYXRoWzFdO1xuICAgICAgaWYgKHNpbXBsZVBhdGhbMl0pIHtcbiAgICAgICAgdGhpcy5zZWFyY2ggPSBzaW1wbGVQYXRoWzJdO1xuICAgICAgICBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgICAgIHRoaXMucXVlcnkgPSBxdWVyeXN0cmluZy5wYXJzZSh0aGlzLnNlYXJjaC5zdWJzdHIoMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucXVlcnkgPSB0aGlzLnNlYXJjaC5zdWJzdHIoMSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgICB0aGlzLnNlYXJjaCA9ICcnO1xuICAgICAgICB0aGlzLnF1ZXJ5ID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cblxuICB2YXIgcHJvdG8gPSBwcm90b2NvbFBhdHRlcm4uZXhlYyhyZXN0KTtcbiAgaWYgKHByb3RvKSB7XG4gICAgcHJvdG8gPSBwcm90b1swXTtcbiAgICB2YXIgbG93ZXJQcm90byA9IHByb3RvLnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5wcm90b2NvbCA9IGxvd2VyUHJvdG87XG4gICAgcmVzdCA9IHJlc3Quc3Vic3RyKHByb3RvLmxlbmd0aCk7XG4gIH1cblxuICAvLyBmaWd1cmUgb3V0IGlmIGl0J3MgZ290IGEgaG9zdFxuICAvLyB1c2VyQHNlcnZlciBpcyAqYWx3YXlzKiBpbnRlcnByZXRlZCBhcyBhIGhvc3RuYW1lLCBhbmQgdXJsXG4gIC8vIHJlc29sdXRpb24gd2lsbCB0cmVhdCAvL2Zvby9iYXIgYXMgaG9zdD1mb28scGF0aD1iYXIgYmVjYXVzZSB0aGF0J3NcbiAgLy8gaG93IHRoZSBicm93c2VyIHJlc29sdmVzIHJlbGF0aXZlIFVSTHMuXG4gIGlmIChzbGFzaGVzRGVub3RlSG9zdCB8fCBwcm90byB8fCByZXN0Lm1hdGNoKC9eXFwvXFwvW15AXFwvXStAW15AXFwvXSsvKSkge1xuICAgIHZhciBzbGFzaGVzID0gcmVzdC5zdWJzdHIoMCwgMikgPT09ICcvLyc7XG4gICAgaWYgKHNsYXNoZXMgJiYgIShwcm90byAmJiBob3N0bGVzc1Byb3RvY29sW3Byb3RvXSkpIHtcbiAgICAgIHJlc3QgPSByZXN0LnN1YnN0cigyKTtcbiAgICAgIHRoaXMuc2xhc2hlcyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob3N0bGVzc1Byb3RvY29sW3Byb3RvXSAmJlxuICAgICAgKHNsYXNoZXMgfHwgKHByb3RvICYmICFzbGFzaGVkUHJvdG9jb2xbcHJvdG9dKSkpIHtcblxuICAgIC8vIHRoZXJlJ3MgYSBob3N0bmFtZS5cbiAgICAvLyB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgLywgPywgOywgb3IgIyBlbmRzIHRoZSBob3N0LlxuICAgIC8vXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gQCBpbiB0aGUgaG9zdG5hbWUsIHRoZW4gbm9uLWhvc3QgY2hhcnMgKmFyZSogYWxsb3dlZFxuICAgIC8vIHRvIHRoZSBsZWZ0IG9mIHRoZSBsYXN0IEAgc2lnbiwgdW5sZXNzIHNvbWUgaG9zdC1lbmRpbmcgY2hhcmFjdGVyXG4gICAgLy8gY29tZXMgKmJlZm9yZSogdGhlIEAtc2lnbi5cbiAgICAvLyBVUkxzIGFyZSBvYm5veGlvdXMuXG4gICAgLy9cbiAgICAvLyBleDpcbiAgICAvLyBodHRwOi8vYUBiQGMvID0+IHVzZXI6YUBiIGhvc3Q6Y1xuICAgIC8vIGh0dHA6Ly9hQGI/QGMgPT4gdXNlcjphIGhvc3Q6YyBwYXRoOi8/QGNcblxuICAgIC8vIHYwLjEyIFRPRE8oaXNhYWNzKTogVGhpcyBpcyBub3QgcXVpdGUgaG93IENocm9tZSBkb2VzIHRoaW5ncy5cbiAgICAvLyBSZXZpZXcgb3VyIHRlc3QgY2FzZSBhZ2FpbnN0IGJyb3dzZXJzIG1vcmUgY29tcHJlaGVuc2l2ZWx5LlxuXG4gICAgLy8gZmluZCB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgYW55IGhvc3RFbmRpbmdDaGFyc1xuICAgIHZhciBob3N0RW5kID0gLTE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBob3N0RW5kaW5nQ2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBoZWMgPSByZXN0LmluZGV4T2YoaG9zdEVuZGluZ0NoYXJzW2ldKTtcbiAgICAgIGlmIChoZWMgIT09IC0xICYmIChob3N0RW5kID09PSAtMSB8fCBoZWMgPCBob3N0RW5kKSlcbiAgICAgICAgaG9zdEVuZCA9IGhlYztcbiAgICB9XG5cbiAgICAvLyBhdCB0aGlzIHBvaW50LCBlaXRoZXIgd2UgaGF2ZSBhbiBleHBsaWNpdCBwb2ludCB3aGVyZSB0aGVcbiAgICAvLyBhdXRoIHBvcnRpb24gY2Fubm90IGdvIHBhc3QsIG9yIHRoZSBsYXN0IEAgY2hhciBpcyB0aGUgZGVjaWRlci5cbiAgICB2YXIgYXV0aCwgYXRTaWduO1xuICAgIGlmIChob3N0RW5kID09PSAtMSkge1xuICAgICAgLy8gYXRTaWduIGNhbiBiZSBhbnl3aGVyZS5cbiAgICAgIGF0U2lnbiA9IHJlc3QubGFzdEluZGV4T2YoJ0AnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYXRTaWduIG11c3QgYmUgaW4gYXV0aCBwb3J0aW9uLlxuICAgICAgLy8gaHR0cDovL2FAYi9jQGQgPT4gaG9zdDpiIGF1dGg6YSBwYXRoOi9jQGRcbiAgICAgIGF0U2lnbiA9IHJlc3QubGFzdEluZGV4T2YoJ0AnLCBob3N0RW5kKTtcbiAgICB9XG5cbiAgICAvLyBOb3cgd2UgaGF2ZSBhIHBvcnRpb24gd2hpY2ggaXMgZGVmaW5pdGVseSB0aGUgYXV0aC5cbiAgICAvLyBQdWxsIHRoYXQgb2ZmLlxuICAgIGlmIChhdFNpZ24gIT09IC0xKSB7XG4gICAgICBhdXRoID0gcmVzdC5zbGljZSgwLCBhdFNpZ24pO1xuICAgICAgcmVzdCA9IHJlc3Quc2xpY2UoYXRTaWduICsgMSk7XG4gICAgICB0aGlzLmF1dGggPSBkZWNvZGVVUklDb21wb25lbnQoYXV0aCk7XG4gICAgfVxuXG4gICAgLy8gdGhlIGhvc3QgaXMgdGhlIHJlbWFpbmluZyB0byB0aGUgbGVmdCBvZiB0aGUgZmlyc3Qgbm9uLWhvc3QgY2hhclxuICAgIGhvc3RFbmQgPSAtMTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vbkhvc3RDaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGhlYyA9IHJlc3QuaW5kZXhPZihub25Ib3N0Q2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKVxuICAgICAgICBob3N0RW5kID0gaGVjO1xuICAgIH1cbiAgICAvLyBpZiB3ZSBzdGlsbCBoYXZlIG5vdCBoaXQgaXQsIHRoZW4gdGhlIGVudGlyZSB0aGluZyBpcyBhIGhvc3QuXG4gICAgaWYgKGhvc3RFbmQgPT09IC0xKVxuICAgICAgaG9zdEVuZCA9IHJlc3QubGVuZ3RoO1xuXG4gICAgdGhpcy5ob3N0ID0gcmVzdC5zbGljZSgwLCBob3N0RW5kKTtcbiAgICByZXN0ID0gcmVzdC5zbGljZShob3N0RW5kKTtcblxuICAgIC8vIHB1bGwgb3V0IHBvcnQuXG4gICAgdGhpcy5wYXJzZUhvc3QoKTtcblxuICAgIC8vIHdlJ3ZlIGluZGljYXRlZCB0aGF0IHRoZXJlIGlzIGEgaG9zdG5hbWUsXG4gICAgLy8gc28gZXZlbiBpZiBpdCdzIGVtcHR5LCBpdCBoYXMgdG8gYmUgcHJlc2VudC5cbiAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZSB8fCAnJztcblxuICAgIC8vIGlmIGhvc3RuYW1lIGJlZ2lucyB3aXRoIFsgYW5kIGVuZHMgd2l0aCBdXG4gICAgLy8gYXNzdW1lIHRoYXQgaXQncyBhbiBJUHY2IGFkZHJlc3MuXG4gICAgdmFyIGlwdjZIb3N0bmFtZSA9IHRoaXMuaG9zdG5hbWVbMF0gPT09ICdbJyAmJlxuICAgICAgICB0aGlzLmhvc3RuYW1lW3RoaXMuaG9zdG5hbWUubGVuZ3RoIC0gMV0gPT09ICddJztcblxuICAgIC8vIHZhbGlkYXRlIGEgbGl0dGxlLlxuICAgIGlmICghaXB2Nkhvc3RuYW1lKSB7XG4gICAgICB2YXIgaG9zdHBhcnRzID0gdGhpcy5ob3N0bmFtZS5zcGxpdCgvXFwuLyk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGhvc3RwYXJ0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcnQgPSBob3N0cGFydHNbaV07XG4gICAgICAgIGlmICghcGFydCkgY29udGludWU7XG4gICAgICAgIGlmICghcGFydC5tYXRjaChob3N0bmFtZVBhcnRQYXR0ZXJuKSkge1xuICAgICAgICAgIHZhciBuZXdwYXJ0ID0gJyc7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGsgPSBwYXJ0Lmxlbmd0aDsgaiA8IGs7IGorKykge1xuICAgICAgICAgICAgaWYgKHBhcnQuY2hhckNvZGVBdChqKSA+IDEyNykge1xuICAgICAgICAgICAgICAvLyB3ZSByZXBsYWNlIG5vbi1BU0NJSSBjaGFyIHdpdGggYSB0ZW1wb3JhcnkgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0aGlzIHRvIG1ha2Ugc3VyZSBzaXplIG9mIGhvc3RuYW1lIGlzIG5vdFxuICAgICAgICAgICAgICAvLyBicm9rZW4gYnkgcmVwbGFjaW5nIG5vbi1BU0NJSSBieSBub3RoaW5nXG4gICAgICAgICAgICAgIG5ld3BhcnQgKz0gJ3gnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbmV3cGFydCArPSBwYXJ0W2pdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyB3ZSB0ZXN0IGFnYWluIHdpdGggQVNDSUkgY2hhciBvbmx5XG4gICAgICAgICAgaWYgKCFuZXdwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFBhdHRlcm4pKSB7XG4gICAgICAgICAgICB2YXIgdmFsaWRQYXJ0cyA9IGhvc3RwYXJ0cy5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgIHZhciBub3RIb3N0ID0gaG9zdHBhcnRzLnNsaWNlKGkgKyAxKTtcbiAgICAgICAgICAgIHZhciBiaXQgPSBwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFN0YXJ0KTtcbiAgICAgICAgICAgIGlmIChiaXQpIHtcbiAgICAgICAgICAgICAgdmFsaWRQYXJ0cy5wdXNoKGJpdFsxXSk7XG4gICAgICAgICAgICAgIG5vdEhvc3QudW5zaGlmdChiaXRbMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vdEhvc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJlc3QgPSAnLycgKyBub3RIb3N0LmpvaW4oJy4nKSArIHJlc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhvc3RuYW1lID0gdmFsaWRQYXJ0cy5qb2luKCcuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5ob3N0bmFtZS5sZW5ndGggPiBob3N0bmFtZU1heExlbikge1xuICAgICAgdGhpcy5ob3N0bmFtZSA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBob3N0bmFtZXMgYXJlIGFsd2F5cyBsb3dlciBjYXNlLlxuICAgICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpZiAoIWlwdjZIb3N0bmFtZSkge1xuICAgICAgLy8gSUROQSBTdXBwb3J0OiBSZXR1cm5zIGEgcHVueWNvZGVkIHJlcHJlc2VudGF0aW9uIG9mIFwiZG9tYWluXCIuXG4gICAgICAvLyBJdCBvbmx5IGNvbnZlcnRzIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB0aGF0XG4gICAgICAvLyBoYXZlIG5vbi1BU0NJSSBjaGFyYWN0ZXJzLCBpLmUuIGl0IGRvZXNuJ3QgbWF0dGVyIGlmXG4gICAgICAvLyB5b3UgY2FsbCBpdCB3aXRoIGEgZG9tYWluIHRoYXQgYWxyZWFkeSBpcyBBU0NJSS1vbmx5LlxuICAgICAgdGhpcy5ob3N0bmFtZSA9IHB1bnljb2RlLnRvQVNDSUkodGhpcy5ob3N0bmFtZSk7XG4gICAgfVxuXG4gICAgdmFyIHAgPSB0aGlzLnBvcnQgPyAnOicgKyB0aGlzLnBvcnQgOiAnJztcbiAgICB2YXIgaCA9IHRoaXMuaG9zdG5hbWUgfHwgJyc7XG4gICAgdGhpcy5ob3N0ID0gaCArIHA7XG4gICAgdGhpcy5ocmVmICs9IHRoaXMuaG9zdDtcblxuICAgIC8vIHN0cmlwIFsgYW5kIF0gZnJvbSB0aGUgaG9zdG5hbWVcbiAgICAvLyB0aGUgaG9zdCBmaWVsZCBzdGlsbCByZXRhaW5zIHRoZW0sIHRob3VnaFxuICAgIGlmIChpcHY2SG9zdG5hbWUpIHtcbiAgICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lLnN1YnN0cigxLCB0aGlzLmhvc3RuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgaWYgKHJlc3RbMF0gIT09ICcvJykge1xuICAgICAgICByZXN0ID0gJy8nICsgcmVzdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBub3cgcmVzdCBpcyBzZXQgdG8gdGhlIHBvc3QtaG9zdCBzdHVmZi5cbiAgLy8gY2hvcCBvZmYgYW55IGRlbGltIGNoYXJzLlxuICBpZiAoIXVuc2FmZVByb3RvY29sW2xvd2VyUHJvdG9dKSB7XG5cbiAgICAvLyBGaXJzdCwgbWFrZSAxMDAlIHN1cmUgdGhhdCBhbnkgXCJhdXRvRXNjYXBlXCIgY2hhcnMgZ2V0XG4gICAgLy8gZXNjYXBlZCwgZXZlbiBpZiBlbmNvZGVVUklDb21wb25lbnQgZG9lc24ndCB0aGluayB0aGV5XG4gICAgLy8gbmVlZCB0byBiZS5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGF1dG9Fc2NhcGUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgYWUgPSBhdXRvRXNjYXBlW2ldO1xuICAgICAgaWYgKHJlc3QuaW5kZXhPZihhZSkgPT09IC0xKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIHZhciBlc2MgPSBlbmNvZGVVUklDb21wb25lbnQoYWUpO1xuICAgICAgaWYgKGVzYyA9PT0gYWUpIHtcbiAgICAgICAgZXNjID0gZXNjYXBlKGFlKTtcbiAgICAgIH1cbiAgICAgIHJlc3QgPSByZXN0LnNwbGl0KGFlKS5qb2luKGVzYyk7XG4gICAgfVxuICB9XG5cblxuICAvLyBjaG9wIG9mZiBmcm9tIHRoZSB0YWlsIGZpcnN0LlxuICB2YXIgaGFzaCA9IHJlc3QuaW5kZXhPZignIycpO1xuICBpZiAoaGFzaCAhPT0gLTEpIHtcbiAgICAvLyBnb3QgYSBmcmFnbWVudCBzdHJpbmcuXG4gICAgdGhpcy5oYXNoID0gcmVzdC5zdWJzdHIoaGFzaCk7XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoMCwgaGFzaCk7XG4gIH1cbiAgdmFyIHFtID0gcmVzdC5pbmRleE9mKCc/Jyk7XG4gIGlmIChxbSAhPT0gLTEpIHtcbiAgICB0aGlzLnNlYXJjaCA9IHJlc3Quc3Vic3RyKHFtKTtcbiAgICB0aGlzLnF1ZXJ5ID0gcmVzdC5zdWJzdHIocW0gKyAxKTtcbiAgICBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHRoaXMucXVlcnkpO1xuICAgIH1cbiAgICByZXN0ID0gcmVzdC5zbGljZSgwLCBxbSk7XG4gIH0gZWxzZSBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgIC8vIG5vIHF1ZXJ5IHN0cmluZywgYnV0IHBhcnNlUXVlcnlTdHJpbmcgc3RpbGwgcmVxdWVzdGVkXG4gICAgdGhpcy5zZWFyY2ggPSAnJztcbiAgICB0aGlzLnF1ZXJ5ID0ge307XG4gIH1cbiAgaWYgKHJlc3QpIHRoaXMucGF0aG5hbWUgPSByZXN0O1xuICBpZiAoc2xhc2hlZFByb3RvY29sW2xvd2VyUHJvdG9dICYmXG4gICAgICB0aGlzLmhvc3RuYW1lICYmICF0aGlzLnBhdGhuYW1lKSB7XG4gICAgdGhpcy5wYXRobmFtZSA9ICcvJztcbiAgfVxuXG4gIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgaWYgKHRoaXMucGF0aG5hbWUgfHwgdGhpcy5zZWFyY2gpIHtcbiAgICB2YXIgcCA9IHRoaXMucGF0aG5hbWUgfHwgJyc7XG4gICAgdmFyIHMgPSB0aGlzLnNlYXJjaCB8fCAnJztcbiAgICB0aGlzLnBhdGggPSBwICsgcztcbiAgfVxuXG4gIC8vIGZpbmFsbHksIHJlY29uc3RydWN0IHRoZSBocmVmIGJhc2VkIG9uIHdoYXQgaGFzIGJlZW4gdmFsaWRhdGVkLlxuICB0aGlzLmhyZWYgPSB0aGlzLmZvcm1hdCgpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGZvcm1hdCBhIHBhcnNlZCBvYmplY3QgaW50byBhIHVybCBzdHJpbmdcbmZ1bmN0aW9uIHVybEZvcm1hdChvYmopIHtcbiAgLy8gZW5zdXJlIGl0J3MgYW4gb2JqZWN0LCBhbmQgbm90IGEgc3RyaW5nIHVybC5cbiAgLy8gSWYgaXQncyBhbiBvYmosIHRoaXMgaXMgYSBuby1vcC5cbiAgLy8gdGhpcyB3YXksIHlvdSBjYW4gY2FsbCB1cmxfZm9ybWF0KCkgb24gc3RyaW5nc1xuICAvLyB0byBjbGVhbiB1cCBwb3RlbnRpYWxseSB3b25reSB1cmxzLlxuICBpZiAodXRpbC5pc1N0cmluZyhvYmopKSBvYmogPSB1cmxQYXJzZShvYmopO1xuICBpZiAoIShvYmogaW5zdGFuY2VvZiBVcmwpKSByZXR1cm4gVXJsLnByb3RvdHlwZS5mb3JtYXQuY2FsbChvYmopO1xuICByZXR1cm4gb2JqLmZvcm1hdCgpO1xufVxuXG5VcmwucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXV0aCA9IHRoaXMuYXV0aCB8fCAnJztcbiAgaWYgKGF1dGgpIHtcbiAgICBhdXRoID0gZW5jb2RlVVJJQ29tcG9uZW50KGF1dGgpO1xuICAgIGF1dGggPSBhdXRoLnJlcGxhY2UoLyUzQS9pLCAnOicpO1xuICAgIGF1dGggKz0gJ0AnO1xuICB9XG5cbiAgdmFyIHByb3RvY29sID0gdGhpcy5wcm90b2NvbCB8fCAnJyxcbiAgICAgIHBhdGhuYW1lID0gdGhpcy5wYXRobmFtZSB8fCAnJyxcbiAgICAgIGhhc2ggPSB0aGlzLmhhc2ggfHwgJycsXG4gICAgICBob3N0ID0gZmFsc2UsXG4gICAgICBxdWVyeSA9ICcnO1xuXG4gIGlmICh0aGlzLmhvc3QpIHtcbiAgICBob3N0ID0gYXV0aCArIHRoaXMuaG9zdDtcbiAgfSBlbHNlIGlmICh0aGlzLmhvc3RuYW1lKSB7XG4gICAgaG9zdCA9IGF1dGggKyAodGhpcy5ob3N0bmFtZS5pbmRleE9mKCc6JykgPT09IC0xID9cbiAgICAgICAgdGhpcy5ob3N0bmFtZSA6XG4gICAgICAgICdbJyArIHRoaXMuaG9zdG5hbWUgKyAnXScpO1xuICAgIGlmICh0aGlzLnBvcnQpIHtcbiAgICAgIGhvc3QgKz0gJzonICsgdGhpcy5wb3J0O1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLnF1ZXJ5ICYmXG4gICAgICB1dGlsLmlzT2JqZWN0KHRoaXMucXVlcnkpICYmXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnF1ZXJ5KS5sZW5ndGgpIHtcbiAgICBxdWVyeSA9IHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeSh0aGlzLnF1ZXJ5KTtcbiAgfVxuXG4gIHZhciBzZWFyY2ggPSB0aGlzLnNlYXJjaCB8fCAocXVlcnkgJiYgKCc/JyArIHF1ZXJ5KSkgfHwgJyc7XG5cbiAgaWYgKHByb3RvY29sICYmIHByb3RvY29sLnN1YnN0cigtMSkgIT09ICc6JykgcHJvdG9jb2wgKz0gJzonO1xuXG4gIC8vIG9ubHkgdGhlIHNsYXNoZWRQcm90b2NvbHMgZ2V0IHRoZSAvLy4gIE5vdCBtYWlsdG86LCB4bXBwOiwgZXRjLlxuICAvLyB1bmxlc3MgdGhleSBoYWQgdGhlbSB0byBiZWdpbiB3aXRoLlxuICBpZiAodGhpcy5zbGFzaGVzIHx8XG4gICAgICAoIXByb3RvY29sIHx8IHNsYXNoZWRQcm90b2NvbFtwcm90b2NvbF0pICYmIGhvc3QgIT09IGZhbHNlKSB7XG4gICAgaG9zdCA9ICcvLycgKyAoaG9zdCB8fCAnJyk7XG4gICAgaWYgKHBhdGhuYW1lICYmIHBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nKSBwYXRobmFtZSA9ICcvJyArIHBhdGhuYW1lO1xuICB9IGVsc2UgaWYgKCFob3N0KSB7XG4gICAgaG9zdCA9ICcnO1xuICB9XG5cbiAgaWYgKGhhc2ggJiYgaGFzaC5jaGFyQXQoMCkgIT09ICcjJykgaGFzaCA9ICcjJyArIGhhc2g7XG4gIGlmIChzZWFyY2ggJiYgc2VhcmNoLmNoYXJBdCgwKSAhPT0gJz8nKSBzZWFyY2ggPSAnPycgKyBzZWFyY2g7XG5cbiAgcGF0aG5hbWUgPSBwYXRobmFtZS5yZXBsYWNlKC9bPyNdL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChtYXRjaCk7XG4gIH0pO1xuICBzZWFyY2ggPSBzZWFyY2gucmVwbGFjZSgnIycsICclMjMnKTtcblxuICByZXR1cm4gcHJvdG9jb2wgKyBob3N0ICsgcGF0aG5hbWUgKyBzZWFyY2ggKyBoYXNoO1xufTtcblxuZnVuY3Rpb24gdXJsUmVzb2x2ZShzb3VyY2UsIHJlbGF0aXZlKSB7XG4gIHJldHVybiB1cmxQYXJzZShzb3VyY2UsIGZhbHNlLCB0cnVlKS5yZXNvbHZlKHJlbGF0aXZlKTtcbn1cblxuVXJsLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcbiAgcmV0dXJuIHRoaXMucmVzb2x2ZU9iamVjdCh1cmxQYXJzZShyZWxhdGl2ZSwgZmFsc2UsIHRydWUpKS5mb3JtYXQoKTtcbn07XG5cbmZ1bmN0aW9uIHVybFJlc29sdmVPYmplY3Qoc291cmNlLCByZWxhdGl2ZSkge1xuICBpZiAoIXNvdXJjZSkgcmV0dXJuIHJlbGF0aXZlO1xuICByZXR1cm4gdXJsUGFyc2Uoc291cmNlLCBmYWxzZSwgdHJ1ZSkucmVzb2x2ZU9iamVjdChyZWxhdGl2ZSk7XG59XG5cblVybC5wcm90b3R5cGUucmVzb2x2ZU9iamVjdCA9IGZ1bmN0aW9uKHJlbGF0aXZlKSB7XG4gIGlmICh1dGlsLmlzU3RyaW5nKHJlbGF0aXZlKSkge1xuICAgIHZhciByZWwgPSBuZXcgVXJsKCk7XG4gICAgcmVsLnBhcnNlKHJlbGF0aXZlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgcmVsYXRpdmUgPSByZWw7XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gbmV3IFVybCgpO1xuICB2YXIgdGtleXMgPSBPYmplY3Qua2V5cyh0aGlzKTtcbiAgZm9yICh2YXIgdGsgPSAwOyB0ayA8IHRrZXlzLmxlbmd0aDsgdGsrKykge1xuICAgIHZhciB0a2V5ID0gdGtleXNbdGtdO1xuICAgIHJlc3VsdFt0a2V5XSA9IHRoaXNbdGtleV07XG4gIH1cblxuICAvLyBoYXNoIGlzIGFsd2F5cyBvdmVycmlkZGVuLCBubyBtYXR0ZXIgd2hhdC5cbiAgLy8gZXZlbiBocmVmPVwiXCIgd2lsbCByZW1vdmUgaXQuXG4gIHJlc3VsdC5oYXNoID0gcmVsYXRpdmUuaGFzaDtcblxuICAvLyBpZiB0aGUgcmVsYXRpdmUgdXJsIGlzIGVtcHR5LCB0aGVuIHRoZXJlJ3Mgbm90aGluZyBsZWZ0IHRvIGRvIGhlcmUuXG4gIGlmIChyZWxhdGl2ZS5ocmVmID09PSAnJykge1xuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBocmVmcyBsaWtlIC8vZm9vL2JhciBhbHdheXMgY3V0IHRvIHRoZSBwcm90b2NvbC5cbiAgaWYgKHJlbGF0aXZlLnNsYXNoZXMgJiYgIXJlbGF0aXZlLnByb3RvY29sKSB7XG4gICAgLy8gdGFrZSBldmVyeXRoaW5nIGV4Y2VwdCB0aGUgcHJvdG9jb2wgZnJvbSByZWxhdGl2ZVxuICAgIHZhciBya2V5cyA9IE9iamVjdC5rZXlzKHJlbGF0aXZlKTtcbiAgICBmb3IgKHZhciByayA9IDA7IHJrIDwgcmtleXMubGVuZ3RoOyByaysrKSB7XG4gICAgICB2YXIgcmtleSA9IHJrZXlzW3JrXTtcbiAgICAgIGlmIChya2V5ICE9PSAncHJvdG9jb2wnKVxuICAgICAgICByZXN1bHRbcmtleV0gPSByZWxhdGl2ZVtya2V5XTtcbiAgICB9XG5cbiAgICAvL3VybFBhcnNlIGFwcGVuZHMgdHJhaWxpbmcgLyB0byB1cmxzIGxpa2UgaHR0cDovL3d3dy5leGFtcGxlLmNvbVxuICAgIGlmIChzbGFzaGVkUHJvdG9jb2xbcmVzdWx0LnByb3RvY29sXSAmJlxuICAgICAgICByZXN1bHQuaG9zdG5hbWUgJiYgIXJlc3VsdC5wYXRobmFtZSkge1xuICAgICAgcmVzdWx0LnBhdGggPSByZXN1bHQucGF0aG5hbWUgPSAnLyc7XG4gICAgfVxuXG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmIChyZWxhdGl2ZS5wcm90b2NvbCAmJiByZWxhdGl2ZS5wcm90b2NvbCAhPT0gcmVzdWx0LnByb3RvY29sKSB7XG4gICAgLy8gaWYgaXQncyBhIGtub3duIHVybCBwcm90b2NvbCwgdGhlbiBjaGFuZ2luZ1xuICAgIC8vIHRoZSBwcm90b2NvbCBkb2VzIHdlaXJkIHRoaW5nc1xuICAgIC8vIGZpcnN0LCBpZiBpdCdzIG5vdCBmaWxlOiwgdGhlbiB3ZSBNVVNUIGhhdmUgYSBob3N0LFxuICAgIC8vIGFuZCBpZiB0aGVyZSB3YXMgYSBwYXRoXG4gICAgLy8gdG8gYmVnaW4gd2l0aCwgdGhlbiB3ZSBNVVNUIGhhdmUgYSBwYXRoLlxuICAgIC8vIGlmIGl0IGlzIGZpbGU6LCB0aGVuIHRoZSBob3N0IGlzIGRyb3BwZWQsXG4gICAgLy8gYmVjYXVzZSB0aGF0J3Mga25vd24gdG8gYmUgaG9zdGxlc3MuXG4gICAgLy8gYW55dGhpbmcgZWxzZSBpcyBhc3N1bWVkIHRvIGJlIGFic29sdXRlLlxuICAgIGlmICghc2xhc2hlZFByb3RvY29sW3JlbGF0aXZlLnByb3RvY29sXSkge1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhyZWxhdGl2ZSk7XG4gICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IGtleXMubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgdmFyIGsgPSBrZXlzW3ZdO1xuICAgICAgICByZXN1bHRba10gPSByZWxhdGl2ZVtrXTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICByZXN1bHQucHJvdG9jb2wgPSByZWxhdGl2ZS5wcm90b2NvbDtcbiAgICBpZiAoIXJlbGF0aXZlLmhvc3QgJiYgIWhvc3RsZXNzUHJvdG9jb2xbcmVsYXRpdmUucHJvdG9jb2xdKSB7XG4gICAgICB2YXIgcmVsUGF0aCA9IChyZWxhdGl2ZS5wYXRobmFtZSB8fCAnJykuc3BsaXQoJy8nKTtcbiAgICAgIHdoaWxlIChyZWxQYXRoLmxlbmd0aCAmJiAhKHJlbGF0aXZlLmhvc3QgPSByZWxQYXRoLnNoaWZ0KCkpKTtcbiAgICAgIGlmICghcmVsYXRpdmUuaG9zdCkgcmVsYXRpdmUuaG9zdCA9ICcnO1xuICAgICAgaWYgKCFyZWxhdGl2ZS5ob3N0bmFtZSkgcmVsYXRpdmUuaG9zdG5hbWUgPSAnJztcbiAgICAgIGlmIChyZWxQYXRoWzBdICE9PSAnJykgcmVsUGF0aC51bnNoaWZ0KCcnKTtcbiAgICAgIGlmIChyZWxQYXRoLmxlbmd0aCA8IDIpIHJlbFBhdGgudW5zaGlmdCgnJyk7XG4gICAgICByZXN1bHQucGF0aG5hbWUgPSByZWxQYXRoLmpvaW4oJy8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnBhdGhuYW1lID0gcmVsYXRpdmUucGF0aG5hbWU7XG4gICAgfVxuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgcmVzdWx0Lmhvc3QgPSByZWxhdGl2ZS5ob3N0IHx8ICcnO1xuICAgIHJlc3VsdC5hdXRoID0gcmVsYXRpdmUuYXV0aDtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSByZWxhdGl2ZS5ob3N0bmFtZSB8fCByZWxhdGl2ZS5ob3N0O1xuICAgIHJlc3VsdC5wb3J0ID0gcmVsYXRpdmUucG9ydDtcbiAgICAvLyB0byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmIChyZXN1bHQucGF0aG5hbWUgfHwgcmVzdWx0LnNlYXJjaCkge1xuICAgICAgdmFyIHAgPSByZXN1bHQucGF0aG5hbWUgfHwgJyc7XG4gICAgICB2YXIgcyA9IHJlc3VsdC5zZWFyY2ggfHwgJyc7XG4gICAgICByZXN1bHQucGF0aCA9IHAgKyBzO1xuICAgIH1cbiAgICByZXN1bHQuc2xhc2hlcyA9IHJlc3VsdC5zbGFzaGVzIHx8IHJlbGF0aXZlLnNsYXNoZXM7XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZhciBpc1NvdXJjZUFicyA9IChyZXN1bHQucGF0aG5hbWUgJiYgcmVzdWx0LnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSxcbiAgICAgIGlzUmVsQWJzID0gKFxuICAgICAgICAgIHJlbGF0aXZlLmhvc3QgfHxcbiAgICAgICAgICByZWxhdGl2ZS5wYXRobmFtZSAmJiByZWxhdGl2ZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJ1xuICAgICAgKSxcbiAgICAgIG11c3RFbmRBYnMgPSAoaXNSZWxBYnMgfHwgaXNTb3VyY2VBYnMgfHxcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5ob3N0ICYmIHJlbGF0aXZlLnBhdGhuYW1lKSksXG4gICAgICByZW1vdmVBbGxEb3RzID0gbXVzdEVuZEFicyxcbiAgICAgIHNyY1BhdGggPSByZXN1bHQucGF0aG5hbWUgJiYgcmVzdWx0LnBhdGhuYW1lLnNwbGl0KCcvJykgfHwgW10sXG4gICAgICByZWxQYXRoID0gcmVsYXRpdmUucGF0aG5hbWUgJiYgcmVsYXRpdmUucGF0aG5hbWUuc3BsaXQoJy8nKSB8fCBbXSxcbiAgICAgIHBzeWNob3RpYyA9IHJlc3VsdC5wcm90b2NvbCAmJiAhc2xhc2hlZFByb3RvY29sW3Jlc3VsdC5wcm90b2NvbF07XG5cbiAgLy8gaWYgdGhlIHVybCBpcyBhIG5vbi1zbGFzaGVkIHVybCwgdGhlbiByZWxhdGl2ZVxuICAvLyBsaW5rcyBsaWtlIC4uLy4uIHNob3VsZCBiZSBhYmxlXG4gIC8vIHRvIGNyYXdsIHVwIHRvIHRoZSBob3N0bmFtZSwgYXMgd2VsbC4gIFRoaXMgaXMgc3RyYW5nZS5cbiAgLy8gcmVzdWx0LnByb3RvY29sIGhhcyBhbHJlYWR5IGJlZW4gc2V0IGJ5IG5vdy5cbiAgLy8gTGF0ZXIgb24sIHB1dCB0aGUgZmlyc3QgcGF0aCBwYXJ0IGludG8gdGhlIGhvc3QgZmllbGQuXG4gIGlmIChwc3ljaG90aWMpIHtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSAnJztcbiAgICByZXN1bHQucG9ydCA9IG51bGw7XG4gICAgaWYgKHJlc3VsdC5ob3N0KSB7XG4gICAgICBpZiAoc3JjUGF0aFswXSA9PT0gJycpIHNyY1BhdGhbMF0gPSByZXN1bHQuaG9zdDtcbiAgICAgIGVsc2Ugc3JjUGF0aC51bnNoaWZ0KHJlc3VsdC5ob3N0KTtcbiAgICB9XG4gICAgcmVzdWx0Lmhvc3QgPSAnJztcbiAgICBpZiAocmVsYXRpdmUucHJvdG9jb2wpIHtcbiAgICAgIHJlbGF0aXZlLmhvc3RuYW1lID0gbnVsbDtcbiAgICAgIHJlbGF0aXZlLnBvcnQgPSBudWxsO1xuICAgICAgaWYgKHJlbGF0aXZlLmhvc3QpIHtcbiAgICAgICAgaWYgKHJlbFBhdGhbMF0gPT09ICcnKSByZWxQYXRoWzBdID0gcmVsYXRpdmUuaG9zdDtcbiAgICAgICAgZWxzZSByZWxQYXRoLnVuc2hpZnQocmVsYXRpdmUuaG9zdCk7XG4gICAgICB9XG4gICAgICByZWxhdGl2ZS5ob3N0ID0gbnVsbDtcbiAgICB9XG4gICAgbXVzdEVuZEFicyA9IG11c3RFbmRBYnMgJiYgKHJlbFBhdGhbMF0gPT09ICcnIHx8IHNyY1BhdGhbMF0gPT09ICcnKTtcbiAgfVxuXG4gIGlmIChpc1JlbEFicykge1xuICAgIC8vIGl0J3MgYWJzb2x1dGUuXG4gICAgcmVzdWx0Lmhvc3QgPSAocmVsYXRpdmUuaG9zdCB8fCByZWxhdGl2ZS5ob3N0ID09PSAnJykgP1xuICAgICAgICAgICAgICAgICAgcmVsYXRpdmUuaG9zdCA6IHJlc3VsdC5ob3N0O1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IChyZWxhdGl2ZS5ob3N0bmFtZSB8fCByZWxhdGl2ZS5ob3N0bmFtZSA9PT0gJycpID9cbiAgICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZS5ob3N0bmFtZSA6IHJlc3VsdC5ob3N0bmFtZTtcbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICAgIHNyY1BhdGggPSByZWxQYXRoO1xuICAgIC8vIGZhbGwgdGhyb3VnaCB0byB0aGUgZG90LWhhbmRsaW5nIGJlbG93LlxuICB9IGVsc2UgaWYgKHJlbFBhdGgubGVuZ3RoKSB7XG4gICAgLy8gaXQncyByZWxhdGl2ZVxuICAgIC8vIHRocm93IGF3YXkgdGhlIGV4aXN0aW5nIGZpbGUsIGFuZCB0YWtlIHRoZSBuZXcgcGF0aCBpbnN0ZWFkLlxuICAgIGlmICghc3JjUGF0aCkgc3JjUGF0aCA9IFtdO1xuICAgIHNyY1BhdGgucG9wKCk7XG4gICAgc3JjUGF0aCA9IHNyY1BhdGguY29uY2F0KHJlbFBhdGgpO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gIH0gZWxzZSBpZiAoIXV0aWwuaXNOdWxsT3JVbmRlZmluZWQocmVsYXRpdmUuc2VhcmNoKSkge1xuICAgIC8vIGp1c3QgcHVsbCBvdXQgdGhlIHNlYXJjaC5cbiAgICAvLyBsaWtlIGhyZWY9Jz9mb28nLlxuICAgIC8vIFB1dCB0aGlzIGFmdGVyIHRoZSBvdGhlciB0d28gY2FzZXMgYmVjYXVzZSBpdCBzaW1wbGlmaWVzIHRoZSBib29sZWFuc1xuICAgIGlmIChwc3ljaG90aWMpIHtcbiAgICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0ID0gc3JjUGF0aC5zaGlmdCgpO1xuICAgICAgLy9vY2NhdGlvbmFseSB0aGUgYXV0aCBjYW4gZ2V0IHN0dWNrIG9ubHkgaW4gaG9zdFxuICAgICAgLy90aGlzIGVzcGVjaWFsbHkgaGFwcGVucyBpbiBjYXNlcyBsaWtlXG4gICAgICAvL3VybC5yZXNvbHZlT2JqZWN0KCdtYWlsdG86bG9jYWwxQGRvbWFpbjEnLCAnbG9jYWwyQGRvbWFpbjInKVxuICAgICAgdmFyIGF1dGhJbkhvc3QgPSByZXN1bHQuaG9zdCAmJiByZXN1bHQuaG9zdC5pbmRleE9mKCdAJykgPiAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lmhvc3Quc3BsaXQoJ0AnKSA6IGZhbHNlO1xuICAgICAgaWYgKGF1dGhJbkhvc3QpIHtcbiAgICAgICAgcmVzdWx0LmF1dGggPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICAgIHJlc3VsdC5ob3N0ID0gcmVzdWx0Lmhvc3RuYW1lID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICAgIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAoIXV0aWwuaXNOdWxsKHJlc3VsdC5wYXRobmFtZSkgfHwgIXV0aWwuaXNOdWxsKHJlc3VsdC5zZWFyY2gpKSB7XG4gICAgICByZXN1bHQucGF0aCA9IChyZXN1bHQucGF0aG5hbWUgPyByZXN1bHQucGF0aG5hbWUgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgICAocmVzdWx0LnNlYXJjaCA/IHJlc3VsdC5zZWFyY2ggOiAnJyk7XG4gICAgfVxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpZiAoIXNyY1BhdGgubGVuZ3RoKSB7XG4gICAgLy8gbm8gcGF0aCBhdCBhbGwuICBlYXN5LlxuICAgIC8vIHdlJ3ZlIGFscmVhZHkgaGFuZGxlZCB0aGUgb3RoZXIgc3R1ZmYgYWJvdmUuXG4gICAgcmVzdWx0LnBhdGhuYW1lID0gbnVsbDtcbiAgICAvL3RvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKHJlc3VsdC5zZWFyY2gpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gJy8nICsgcmVzdWx0LnNlYXJjaDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnBhdGggPSBudWxsO1xuICAgIH1cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gaWYgYSB1cmwgRU5EcyBpbiAuIG9yIC4uLCB0aGVuIGl0IG11c3QgZ2V0IGEgdHJhaWxpbmcgc2xhc2guXG4gIC8vIGhvd2V2ZXIsIGlmIGl0IGVuZHMgaW4gYW55dGhpbmcgZWxzZSBub24tc2xhc2h5LFxuICAvLyB0aGVuIGl0IG11c3QgTk9UIGdldCBhIHRyYWlsaW5nIHNsYXNoLlxuICB2YXIgbGFzdCA9IHNyY1BhdGguc2xpY2UoLTEpWzBdO1xuICB2YXIgaGFzVHJhaWxpbmdTbGFzaCA9IChcbiAgICAgIChyZXN1bHQuaG9zdCB8fCByZWxhdGl2ZS5ob3N0IHx8IHNyY1BhdGgubGVuZ3RoID4gMSkgJiZcbiAgICAgIChsYXN0ID09PSAnLicgfHwgbGFzdCA9PT0gJy4uJykgfHwgbGFzdCA9PT0gJycpO1xuXG4gIC8vIHN0cmlwIHNpbmdsZSBkb3RzLCByZXNvbHZlIGRvdWJsZSBkb3RzIHRvIHBhcmVudCBkaXJcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHNyY1BhdGgubGVuZ3RoOyBpID49IDA7IGktLSkge1xuICAgIGxhc3QgPSBzcmNQYXRoW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHNyY1BhdGguc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHNyY1BhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmICghbXVzdEVuZEFicyAmJiAhcmVtb3ZlQWxsRG90cykge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgc3JjUGF0aC51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtdXN0RW5kQWJzICYmIHNyY1BhdGhbMF0gIT09ICcnICYmXG4gICAgICAoIXNyY1BhdGhbMF0gfHwgc3JjUGF0aFswXS5jaGFyQXQoMCkgIT09ICcvJykpIHtcbiAgICBzcmNQYXRoLnVuc2hpZnQoJycpO1xuICB9XG5cbiAgaWYgKGhhc1RyYWlsaW5nU2xhc2ggJiYgKHNyY1BhdGguam9pbignLycpLnN1YnN0cigtMSkgIT09ICcvJykpIHtcbiAgICBzcmNQYXRoLnB1c2goJycpO1xuICB9XG5cbiAgdmFyIGlzQWJzb2x1dGUgPSBzcmNQYXRoWzBdID09PSAnJyB8fFxuICAgICAgKHNyY1BhdGhbMF0gJiYgc3JjUGF0aFswXS5jaGFyQXQoMCkgPT09ICcvJyk7XG5cbiAgLy8gcHV0IHRoZSBob3N0IGJhY2tcbiAgaWYgKHBzeWNob3RpYykge1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0ID0gaXNBYnNvbHV0ZSA/ICcnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY1BhdGgubGVuZ3RoID8gc3JjUGF0aC5zaGlmdCgpIDogJyc7XG4gICAgLy9vY2NhdGlvbmFseSB0aGUgYXV0aCBjYW4gZ2V0IHN0dWNrIG9ubHkgaW4gaG9zdFxuICAgIC8vdGhpcyBlc3BlY2lhbGx5IGhhcHBlbnMgaW4gY2FzZXMgbGlrZVxuICAgIC8vdXJsLnJlc29sdmVPYmplY3QoJ21haWx0bzpsb2NhbDFAZG9tYWluMScsICdsb2NhbDJAZG9tYWluMicpXG4gICAgdmFyIGF1dGhJbkhvc3QgPSByZXN1bHQuaG9zdCAmJiByZXN1bHQuaG9zdC5pbmRleE9mKCdAJykgPiAwID9cbiAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5ob3N0LnNwbGl0KCdAJykgOiBmYWxzZTtcbiAgICBpZiAoYXV0aEluSG9zdCkge1xuICAgICAgcmVzdWx0LmF1dGggPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICByZXN1bHQuaG9zdCA9IHJlc3VsdC5ob3N0bmFtZSA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICB9XG4gIH1cblxuICBtdXN0RW5kQWJzID0gbXVzdEVuZEFicyB8fCAocmVzdWx0Lmhvc3QgJiYgc3JjUGF0aC5sZW5ndGgpO1xuXG4gIGlmIChtdXN0RW5kQWJzICYmICFpc0Fic29sdXRlKSB7XG4gICAgc3JjUGF0aC51bnNoaWZ0KCcnKTtcbiAgfVxuXG4gIGlmICghc3JjUGF0aC5sZW5ndGgpIHtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBudWxsO1xuICAgIHJlc3VsdC5wYXRoID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBzcmNQYXRoLmpvaW4oJy8nKTtcbiAgfVxuXG4gIC8vdG8gc3VwcG9ydCByZXF1ZXN0Lmh0dHBcbiAgaWYgKCF1dGlsLmlzTnVsbChyZXN1bHQucGF0aG5hbWUpIHx8ICF1dGlsLmlzTnVsbChyZXN1bHQuc2VhcmNoKSkge1xuICAgIHJlc3VsdC5wYXRoID0gKHJlc3VsdC5wYXRobmFtZSA/IHJlc3VsdC5wYXRobmFtZSA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAocmVzdWx0LnNlYXJjaCA/IHJlc3VsdC5zZWFyY2ggOiAnJyk7XG4gIH1cbiAgcmVzdWx0LmF1dGggPSByZWxhdGl2ZS5hdXRoIHx8IHJlc3VsdC5hdXRoO1xuICByZXN1bHQuc2xhc2hlcyA9IHJlc3VsdC5zbGFzaGVzIHx8IHJlbGF0aXZlLnNsYXNoZXM7XG4gIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuVXJsLnByb3RvdHlwZS5wYXJzZUhvc3QgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhvc3QgPSB0aGlzLmhvc3Q7XG4gIHZhciBwb3J0ID0gcG9ydFBhdHRlcm4uZXhlYyhob3N0KTtcbiAgaWYgKHBvcnQpIHtcbiAgICBwb3J0ID0gcG9ydFswXTtcbiAgICBpZiAocG9ydCAhPT0gJzonKSB7XG4gICAgICB0aGlzLnBvcnQgPSBwb3J0LnN1YnN0cigxKTtcbiAgICB9XG4gICAgaG9zdCA9IGhvc3Quc3Vic3RyKDAsIGhvc3QubGVuZ3RoIC0gcG9ydC5sZW5ndGgpO1xuICB9XG4gIGlmIChob3N0KSB0aGlzLmhvc3RuYW1lID0gaG9zdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1N0cmluZzogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZihhcmcpID09PSAnc3RyaW5nJztcbiAgfSxcbiAgaXNPYmplY3Q6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB0eXBlb2YoYXJnKSA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xuICB9LFxuICBpc051bGw6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBhcmcgPT09IG51bGw7XG4gIH0sXG4gIGlzTnVsbE9yVW5kZWZpbmVkOiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gYXJnID09IG51bGw7XG4gIH1cbn07XG4iLCJjb25zdCBwYXJzZSA9IHJlcXVpcmUoXCJ1cmxcIikucGFyc2VcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNsZWFuLFxuICBwYWdlLFxuICBwcm90b2NvbCxcbiAgaG9zdG5hbWUsXG4gIG5vcm1hbGl6ZSxcbiAgaXNTZWFyY2hRdWVyeSxcbiAgaXNVUkxcbn1cblxuZnVuY3Rpb24gcHJvdG9jb2wgKHVybCkge1xuICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvKF5cXHcrKTpcXC9cXC8vKVxuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gbWF0Y2hbMV1cbiAgfVxuXG4gIHJldHVybiAnaHR0cCdcbn1cblxuZnVuY3Rpb24gY2xlYW4gKHVybCkge1xuICByZXR1cm4gY2xlYW5VVE0odXJsKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvXlxcdys6XFwvXFwvLywgJycpXG4gICAgLnJlcGxhY2UoL15bXFx3LV9dKzpbXFx3LV9dK0AvLCAnJylcbiAgICAucmVwbGFjZSgvIy4qJC8sICcnKVxuICAgIC5yZXBsYWNlKC8oXFwvfFxcP3xcXCZ8IykqJC8sICcnKVxuICAgIC5yZXBsYWNlKC9cXC9cXD8vLCAnPycpXG4gICAgLnJlcGxhY2UoL153d3dcXC4vLCAnJylcbn1cblxuZnVuY3Rpb24gcGFnZSAodXJsKSB7XG4gIHJldHVybiBjbGVhbih1cmwucmVwbGFjZSgvXFwjLiokLywgJycpKVxufVxuXG5mdW5jdGlvbiBob3N0bmFtZSAodXJsKSB7XG4gIHJldHVybiBwYXJzZShub3JtYWxpemUodXJsKSkuaG9zdG5hbWUucmVwbGFjZSgvXnd3d1xcLi8sICcnKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemUgKGlucHV0KSB7XG4gIGlmIChpbnB1dC50cmltKCkubGVuZ3RoID09PSAwKSByZXR1cm4gJydcblxuICBpZiAoaXNTZWFyY2hRdWVyeShpbnB1dCkpIHtcbiAgICByZXR1cm4gYGh0dHBzOi8vZ29vZ2xlLmNvbS9zZWFyY2g/cT0ke2VuY29kZVVSSShpbnB1dCl9YFxuICB9XG5cbiAgaWYgKCEvXlxcdys6XFwvXFwvLy50ZXN0KGlucHV0KSkge1xuICAgIHJldHVybiBgaHR0cDovLyR7aW5wdXR9YFxuICB9XG5cbiAgcmV0dXJuIGlucHV0XG59XG5cbmZ1bmN0aW9uIGlzU2VhcmNoUXVlcnkgKGlucHV0KSB7XG4gIHJldHVybiAhaXNVUkwoaW5wdXQudHJpbSgpKVxufVxuXG5mdW5jdGlvbiBpc1VSTCAoaW5wdXQpIHtcbiAgcmV0dXJuIGlucHV0LmluZGV4T2YoJyAnKSA9PT0gLTEgJiYgKC9eXFx3KzpcXC9cXC8vLnRlc3QoaW5wdXQpIHx8IGlucHV0LmluZGV4T2YoJy4nKSA+IDAgfHwgaW5wdXQuaW5kZXhPZignOicpID4gMClcbn1cblxuZnVuY3Rpb24gY2xlYW5VVE0gKHVybCkge1xuICByZXR1cm4gdXJsXG4gICAgLnJlcGxhY2UoLyhcXD98XFwmKXV0bV9bXFx3XStcXD1bXlxcJl0rL2csICckMScpXG4gICAgLnJlcGxhY2UoLyhcXD98XFwmKXJlZlxcPVteXFwmXStcXCY/LywgJyQxJylcbiAgICAucmVwbGFjZSgvW1xcJl17Mix9LywnJicpXG4gICAgLnJlcGxhY2UoJz8mJywgJz8nKVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEljb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgbWV0aG9kID0gdGhpc1sncmVuZGVyJyArIHRoaXMucHJvcHMubmFtZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgwLCAxKSArIHRoaXMucHJvcHMubmFtZS5zbGljZSgxKV0uYmluZCh0aGlzKVxuXG4gICAgaWYgKG1ldGhvZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BpY29uIGljb24tJHt0aGlzLnByb3BzLm5hbWV9YH0gey4uLnRoaXMucHJvcHN9PlxuICAgICAgICAgIHttZXRob2QoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQWxlcnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWFsZXJ0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTYgMyBMMzAgMjkgMiAyOSBaIE0xNiAxMSBMMTYgMTkgTTE2IDIzIEwxNiAyNVwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJDbG9jaygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktY2xvY2tcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjE2XCIgY3k9XCIxNlwiIHI9XCIxNFwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTYgOCBMMTYgMTYgMjAgMjBcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2xvc2UoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWNsb3NlXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMiAzMCBMMzAgMiBNMzAgMzAgTDIgMlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJIZWFydCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGltZyBzcmM9XCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNZQUFBQW1CQU1BQUFCYUUvU2RBQUFBQkdkQlRVRUFBTEdQQy94aEJRQUFBQUZ6VWtkQ0FLN09IT2tBQUFBSmNFaFpjd0FBRHNNQUFBN0RBY2R2cUdRQUFBQXRVRXhVUlVkd1RQLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLzgxZTNRSUFBQUFPZEZKT1V3QVBic256dEIyZTRDNC9Wb1o1ekdsZlZnQUFBT2xKUkVGVUtCVmpZS0FUV0ZOYWxBQzBpdXQ0K0UyWWpScnYzcjE3T29HQnV3OUlXMEVFaFlITWQrL2VNc2FCNlFNZ1FjWStNUHZkWVFqMUhDVEdDbUhEU1FXZzJENDREOEp3QklyWm9ZbTlaV0JnUXhONjk1aUJnUnRkN0IwREF4T0dXQUlETDRiWUJLenF1TkRWUFFGNkExME1hQzgyOXpIb29TbDhCbFFuZ1NaV0FCUkRjL1NUQktBWW1vR1BRRUpvbWdQQVlweCtTQ1krRmdDTE1TeEJFak9FQ0RGd0lSVENsREV3eklBckxJUXFBL292RGlvSURHTTRZSUxvZmpFQkxnSmtUQVlyUk9nRXk1MERDbllqcXdLeXVmcmVQVTFBRTJNUWY2S0FMc1RBc0JOVGlJQUlBQWM0VytlTEJhNTRBQUFBQUVsRlRrU3VRbUNDXCIgLz5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZWFyY2goKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXNlYXJjaFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTRcIiBjeT1cIjE0XCIgcj1cIjEyXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0yMyAyMyBMMzAgMzBcIiAgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckV4dGVybmFsKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1leHRlcm5hbFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTE0IDkgTDMgOSAzIDI5IDIzIDI5IDIzIDE4IE0xOCA0IEwyOCA0IDI4IDE0IE0yOCA0IEwxNCAxOFwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJUYWcoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXRhZ1wiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMjRcIiBjeT1cIjhcIiByPVwiMlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMiAxOCBMMTggMiAzMCAyIDMwIDE0IDE0IDMwIFpcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVHJhc2goKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXRyYXNoXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMjggNiBMNiA2IDggMzAgMjQgMzAgMjYgNiA0IDYgTTE2IDEyIEwxNiAyNCBNMjEgMTIgTDIwIDI0IE0xMSAxMiBMMTIgMjQgTTEyIDYgTDEzIDIgMTkgMiAyMCA2XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLW9wdGlvbnNcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0yOCA2IEw0IDYgTTI4IDE2IEw0IDE2IE0yOCAyNiBMNCAyNiBNMjQgMyBMMjQgOSBNOCAxMyBMOCAxOSBNMjAgMjMgTDIwIDI5XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxufVxuIl19
