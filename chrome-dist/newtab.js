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

var Bookmarks = function (_Component) {
  _inherits(Bookmarks, _Component);

  function Bookmarks(props) {
    _classCallCheck(this, Bookmarks);

    var _this = _possibleConstructorReturn(this, (Bookmarks.__proto__ || Object.getPrototypeOf(Bookmarks)).call(this, props));

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

  _createClass(Bookmarks, [{
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

      if (!this.props.open) return;

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

  return Bookmarks;
}(_preact.Component);

exports.default = Bookmarks;


function sortLikes(a, b) {
  if (a.liked_at < b.liked_at) return 1;
  if (a.liked_at > b.liked_at) return -1;
  return 0;
}

},{"./content":4,"./messaging":7,"./search-input":9,"debounce-fn":13,"preact":14}],3:[function(require,module,exports){
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

},{"./icons":5,"preact":14}],4:[function(require,module,exports){
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

},{"preact":14}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./button":3,"preact":14}],7:[function(require,module,exports){
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

},{"../lib/messaging":1}],8:[function(require,module,exports){
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

var _settings = require("./settings");

var _settings2 = _interopRequireDefault(_settings);

var _bookmarks = require("./bookmarks");

var _bookmarks2 = _interopRequireDefault(_bookmarks);

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
      wallpaper: null,
      showBookmarks: true
    });

    _this.bookmarks = new _bookmarks2.default();
    return _this;
  }

  _createClass(NewTab, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return (0, _preact.h)(
        "div",
        { className: "newtab" },
        (0, _preact.h)("img", { src: _icons2.default.close, className: "close-button", onclick: function onclick() {
            return _this2.setState({ showBookmarks: false });
          } }),
        (0, _preact.h)(
          "div",
          { className: "center" },
          this.renderBookmarks()
        ),
        this.state.wallpaper ? (0, _preact.h)(_wallpaper2.default, this.state.wallpaper) : null,
        (0, _preact.h)(_settings2.default, { open: this.state.isSettingsOpen })
      );
    }
  }, {
    key: "renderBookmarks",
    value: function renderBookmarks() {
      return (0, _preact.h)(_bookmarks2.default, { open: this.state.showBookmarks, wallpaper: this.state.wallpaper });
    }
  }, {
    key: "renderSettingsButton",
    value: function renderSettingsButton() {
      var _this3 = this;

      return (0, _preact.h)(_button2.default, { className: "settings", icon: this.state.isSettingsOpen ? "close" : "settings", onClick: function onClick() {
          return _this3.setState({ isSettingsOpen: !_this3.state.isSettingsOpen });
        } });
    }
  }]);

  return NewTab;
}(_preact.Component);

(0, _preact.render)((0, _preact.h)(NewTab, null), document.body);

},{"./bookmarks":2,"./button":3,"./icons":5,"./menu":6,"./settings":10,"./wallpaper":11,"./wallpapers":12,"preact":14}],9:[function(require,module,exports){
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

},{"./icons":5,"preact":14}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

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
        (0, _preact.h)("div", { className: "triangle" }),
        (0, _preact.h)(
          "h1",
          null,
          (0, _preact.h)(
            "span",
            null,
            "Settings"
          )
        )
      );
    }
  }]);

  return Settings;
}(_preact.Component);

exports.default = Settings;

},{"preact":14}],11:[function(require,module,exports){
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

},{"preact":14}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWVzc2FnaW5nLmpzIiwibmV3dGFiL2Jvb2ttYXJrcy5qcyIsIm5ld3RhYi9idXR0b24uanMiLCJuZXd0YWIvY29udGVudC5qcyIsIm5ld3RhYi9pY29ucy5qc29uIiwibmV3dGFiL21lbnUuanMiLCJuZXd0YWIvbWVzc2FnaW5nLmpzIiwibmV3dGFiL25ld3RhYi5qcyIsIm5ld3RhYi9zZWFyY2gtaW5wdXQuanMiLCJuZXd0YWIvc2V0dGluZ3MuanMiLCJuZXd0YWIvd2FsbHBhcGVyLmpzIiwibmV3dGFiL3dhbGxwYXBlcnMuanNvbiIsIm5vZGVfbW9kdWxlcy9kZWJvdW5jZS1mbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUEsSUFBSSxpQkFBaUIsQ0FBckI7O0FBRU8sSUFBTSxzREFBdUIsQ0FBN0I7O0lBRWMsUztBQUNuQix1QkFBYztBQUFBOztBQUNaLFNBQUssaUJBQUw7QUFDQSxTQUFLLE9BQUwsR0FBZSxFQUFmO0FBQ0Q7Ozs7Z0NBRXdDO0FBQUEsVUFBakMsRUFBaUMsUUFBakMsRUFBaUM7QUFBQSxVQUE3QixPQUE2QixRQUE3QixPQUE2QjtBQUFBLFVBQXBCLEtBQW9CLFFBQXBCLEtBQW9CO0FBQUEsVUFBYixFQUFhLFFBQWIsRUFBYTtBQUFBLFVBQVQsS0FBUyxRQUFULEtBQVM7O0FBQ3ZDLFdBQUssS0FBSyxVQUFMLEVBQUw7O0FBRUEsYUFBTztBQUNMLGNBQU0sS0FBSyxJQUROO0FBRUwsWUFBSSxNQUFNLEtBQUssTUFGVjtBQUdMLGVBQU8sUUFBUSxLQUFSLElBQWlCLEtBSG5CO0FBSUwsY0FKSyxFQUlELGdCQUpDLEVBSVE7QUFKUixPQUFQO0FBTUQ7OztpQ0FFWTtBQUNYLGFBQVEsS0FBSyxHQUFMLEtBQWEsSUFBZCxHQUF1QixFQUFFLGNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCBtZXNzYWdlQ291bnRlciA9IDBcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfVElNRU9VVF9TRUNTID0gNVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdpbmcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmxpc3RlbkZvck1lc3NhZ2VzKClcbiAgICB0aGlzLndhaXRpbmcgPSB7fVxuICB9XG5cbiAgZHJhZnQoeyBpZCwgY29udGVudCwgZXJyb3IsIHRvLCByZXBseSB9KSB7XG4gICAgaWQgPSB0aGlzLmdlbmVyYXRlSWQoKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyb206IHRoaXMubmFtZSxcbiAgICAgIHRvOiB0byB8fCB0aGlzLnRhcmdldCxcbiAgICAgIGVycm9yOiBjb250ZW50LmVycm9yIHx8IGVycm9yLFxuICAgICAgaWQsIGNvbnRlbnQsIHJlcGx5XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVJZCgpIHtcbiAgICByZXR1cm4gKERhdGUubm93KCkgKiAxMDAwKSArICgrK21lc3NhZ2VDb3VudGVyKVxuICB9XG5cbiAgb25SZWNlaXZlKG1zZykge1xuICAgIGlmIChtc2cudG8gIT09IHRoaXMubmFtZSkgcmV0dXJuIHRydWVcblxuICAgIGlmIChtc2cucmVwbHkgJiYgdGhpcy53YWl0aW5nW21zZy5yZXBseV0pIHtcbiAgICAgIHRoaXMud2FpdGluZ1ttc2cucmVwbHldKG1zZylcbiAgICB9XG5cbiAgICBpZiAobXNnLnJlcGx5KSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChtc2cuY29udGVudC5waW5nKSB7XG4gICAgICB0aGlzLnJlcGx5KG1zZywgeyBwb25nOiB0cnVlIH0pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHBpbmcoY2FsbGJhY2spIHtcbiAgICB0aGlzLnNlbmQoeyBwaW5nOiB0cnVlIH0sIGNhbGxiYWNrKVxuICB9XG5cbiAgcmVwbHkobXNnLCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmNvbnRlbnQpIHtcbiAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgIGNvbnRlbnQ6IG9wdGlvbnNcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvcHRpb25zLnJlcGx5ID0gbXNnLmlkXG4gICAgb3B0aW9ucy50byA9IG1zZy5mcm9tXG5cbiAgICB0aGlzLnNlbmQob3B0aW9ucylcbiAgfVxuXG4gIHNlbmQob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBtc2cgPSB0aGlzLmRyYWZ0KG9wdGlvbnMuY29udGVudCA/IG9wdGlvbnMgOiB7IGNvbnRlbnQ6IG9wdGlvbnMgfSlcblxuICAgIHRoaXMuc2VuZE1lc3NhZ2UobXNnKVxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLndhaXRSZXBseUZvcihtc2cuaWQsIERFRkFVTFRfVElNRU9VVF9TRUNTLCBjYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICB3YWl0UmVwbHlGb3IobXNnSWQsIHRpbWVvdXRTZWNzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzXG4gICAgbGV0IHRpbWVvdXQgPSB1bmRlZmluZWRcblxuICAgIGlmICh0aW1lb3V0U2VjcyA+IDApIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KG9uVGltZW91dCwgdGltZW91dFNlY3MgKiAxMDAwKVxuICAgIH1cblxuICAgIHRoaXMud2FpdGluZ1ttc2dJZF0gPSBtc2cgPT4ge1xuICAgICAgZG9uZSgpXG4gICAgICBjYWxsYmFjayhtc2cpXG4gICAgfVxuXG4gICAgcmV0dXJuIGRvbmVcblxuICAgIGZ1bmN0aW9uIGRvbmUgKCkge1xuICAgICAgaWYgKHRpbWVvdXQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KVxuICAgICAgfVxuXG4gICAgICB0aW1lb3V0ID0gdW5kZWZpbmVkXG4gICAgICBkZWxldGUgc2VsZi53YWl0aW5nW21zZ0lkXVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uVGltZW91dCAoKSB7XG4gICAgICBkb25lKClcbiAgICAgIGNhbGxiYWNrKHsgZXJyb3I6ICdNZXNzYWdlIHJlc3BvbnNlIHRpbWVvdXQgKCcgKyB0aW1lb3V0U2VjcyArJylzLicgfSlcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IENvbnRlbnQgZnJvbSBcIi4vY29udGVudFwiXG5pbXBvcnQgTWVzc2FnaW5nIGZyb20gXCIuL21lc3NhZ2luZ1wiXG5pbXBvcnQgU2VhcmNoSW5wdXQgZnJvbSBcIi4vc2VhcmNoLWlucHV0XCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb29rbWFya3MgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWVzc2FnaW5nKClcbiAgICB0aGlzLnNlYXJjaEJvb2ttYXJrcyA9IGRlYm91bmNlKHRoaXMuX3NlYXJjaEJvb2ttYXJrcy5iaW5kKHRoaXMpLCA2MDApXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHF1ZXJ5OiAnJyxcbiAgICAgIGxpa2VzOiBbXSxcbiAgICAgIHRvcFNpdGVzOiBbXVxuICAgIH0pXG5cbiAgICBjaHJvbWUudG9wU2l0ZXMuZ2V0KHRvcFNpdGVzID0+IHRoaXMuc2V0U3RhdGUoeyB0b3BTaXRlczogdG9wU2l0ZXMuc2xpY2UoMCwgNSkgfSkpXG4gICAgdGhpcy5nZXRSZWNlbnRCb29rbWFya3MoKGVyciwgbGlrZXMpID0+IHRoaXMuc2V0U3RhdGUoeyBsaWtlcyB9KSlcbiAgfVxuXG4gIGdldFJlY2VudEJvb2ttYXJrcyhjYWxsYmFjaykge1xuICAgIHRoaXMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtcmVjZW50LWJvb2ttYXJrcycgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihyZXNwLmVycm9yKSlcbiAgICAgIGNhbGxiYWNrKHVuZGVmaW5lZCwgcmVzcC5tZWRpYS5jb25jYXQocmVzcC5ub25fbWVkaWEpLnNvcnQoc29ydExpa2VzKS5zbGljZSgwLCA1KSlcbiAgICB9KVxuICB9XG5cbiAgX3NlYXJjaEJvb2ttYXJrcyhxdWVyeSwgY2FsbGJhY2spIHtcbiAgICB0aGlzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnc2VhcmNoLWJvb2ttYXJrcycsIHF1ZXJ5IH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKHJlc3AuY29udGVudC5xdWVyeSAhPT0gdGhpcy5zdGF0ZS5xdWVyeSkgcmV0dXJuXG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihyZXNwLmVycm9yKSlcbiAgICAgIGNhbGxiYWNrKHVuZGVmaW5lZCwgcmVzcC5jb250ZW50KVxuICAgIH0pXG4gIH1cblxuICBvblF1ZXJ5Q2hhbmdlKHF1ZXJ5KSB7XG4gICAgaWYgKHF1ZXJ5ID09PSB0aGlzLnN0YXRlLnF1ZXJ5KSByZXR1cm5cblxuICAgIGlmIChxdWVyeS5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgbGlrZXM6IFtdLFxuICAgICAgICBxdWVyeTogXCJcIlxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAocXVlcnkgPT09IHRoaXMuc3RhdGUucXVlcnkudHJpbSgpKSByZXR1cm5cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIGxpa2VzOiBbXSxcbiAgICAgIGhpc3Rvcnk6IFtdLFxuICAgICAgcXVlcnlcbiAgICB9KVxuXG4gICAgdGhpcy5zZWFyY2hCb29rbWFya3MocXVlcnkudHJpbSgpLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yIH0pXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsaWtlczogcmVzdWx0Lm1lZGlhLmNvbmNhdChyZXN1bHQubm9uX21lZGlhKS5zb3J0KHNvcnRMaWtlcyksXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBjaHJvbWUuaGlzdG9yeS5zZWFyY2goeyB0ZXh0OiBxdWVyeS50cmltKCkgfSwgaGlzdG9yeSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaGlzdG9yeVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5vcGVuKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8Q29udGVudCB3YWxscGFwZXI9e3RoaXMucHJvcHMud2FsbHBhcGVyfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib29rbWFya3NcIj5cbiAgICAgICAgICA8U2VhcmNoSW5wdXQgcXVlcnk9e3RoaXMuc3RhdGUucXVlcnl9IG9uUXVlcnlDaGFuZ2U9e3F1ZXJ5ID0+IHRoaXMub25RdWVyeUNoYW5nZShxdWVyeSl9IC8+XG4gICAgICAgICAge3RoaXMucmVuZGVyVG9wU2l0ZXMoKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJIaXN0b3J5KCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyTGlrZXMoKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJMb2FkaW5nKCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyTm9SZXN1bHRzKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Db250ZW50PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRvcFNpdGVzKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnF1ZXJ5KSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvcC1zaXRlcyB1cmxzXCI+XG4gICAgICAgIHt0aGlzLnN0YXRlLnRvcFNpdGVzLm1hcChzaXRlID0+IDxVUkxJY29uIHsuLi5zaXRlfSAvPil9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckhpc3RvcnkoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmhpc3RvcnkgfHwgdGhpcy5zdGF0ZS5oaXN0b3J5Lmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJoaXN0b3J5IHVybHNcIj5cbiAgICAgICAge3RoaXMuc3RhdGUuaGlzdG9yeS5zbGljZSgwLCA1KS5tYXAodXJsID0+IDxVUkxJY29uIHsuLi51cmx9IC8+KX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhclwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTGlrZXMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VhcmNoLWxpa2VzIHVybHNcIj5cbiAgICAgICAge3RoaXMuc3RhdGUubGlrZXMubGVuZ3RoID4gMTAgPyB0aGlzLnJlbmRlck1vcmVSZXN1bHRzTGluaygpIDogbnVsbH1cbiAgICAgICAge3RoaXMuc3RhdGUubGlrZXMuc2xpY2UoMCwgNSkubWFwKGxpa2UgPT4gPFVSTEljb24gey4uLmxpa2V9IC8+KX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhclwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTW9yZVJlc3VsdHNMaW5rKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJtb3JlLXJlc3VsdHMtYnV0dG9uXCIgaHJlZj17YGh0dHBzOi8vZ2V0a296bW9zLmNvbS9zZWFyY2g/cXVlcnk9JHt0aGlzLnN0YXRlLnF1ZXJ5fWB9PlxuICAgICAgICBTZWUgTW9yZSBSZXN1bHRzXG4gICAgICA8L2E+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTG9hZGluZygpIHtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMuc3RhdGUucXVlcnkudHJpbSgpXG4gICAgaWYgKCF0aGlzLnN0YXRlLmxvYWRpbmcgfHwgcXVlcnkgPT0gXCJcIikgcmV0dXJuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJsb2FkaW5nXCI+XG4gICAgICAgIDxTcGlubmVyIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJOb1Jlc3VsdHMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubG9hZGluZyB8fCB0aGlzLnN0YXRlLnF1ZXJ5ID09PSBcIlwiIHx8IHRoaXMuc3RhdGUubGlrZXMubGVuZ3RoID4gMCkgcmV0dXJuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJsb2FkaW5nXCI+XG4gICAgICAgIDxwPk5vIEJvb2ttYXJrcyBGb3VuZCBGb3IgXCI8c3Ryb25nPnt0aGlzLnN0YXRlLnF1ZXJ5fTwvc3Ryb25nPlwiIDooPC9wPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIHNvcnRMaWtlcyhhLCBiKSB7XG4gIGlmIChhLmxpa2VkX2F0IDwgYi5saWtlZF9hdCkgcmV0dXJuIDFcbiAgaWYgKGEubGlrZWRfYXQgPiBiLmxpa2VkX2F0KSByZXR1cm4gLTFcbiAgcmV0dXJuIDBcbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IGljb25zIGZyb20gJy4vaWNvbnMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1dHRvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BidXR0b24gJHt0aGlzLnByb3BzLmNsYXNzTmFtZSB8fCB0aGlzLnByb3BzLmljb259LWJ1dHRvbiB3aXRoLSR7dGhpcy5wcm9wcy5pY29ufS1pY29uYH0gb25jbGljaz17KCkgPT4gdGhpcy5vbkNsaWNrKCl9IG9uTW91c2VPdmVyPXt0aGlzLnByb3BzLm9uTW91c2VPdmVyfSBvbk1vdXNlT3V0PXt0aGlzLnByb3BzLm9uTW91c2VPdXR9PlxuICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImljb25cIiBzcmM9e3RoaXMuc3JjKCl9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBvbkNsaWNrKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2xpY2spIHRoaXMucHJvcHMub25DbGljaygpXG4gIH1cblxuICBzcmMoKSB7XG4gICAgcmV0dXJuIGljb25zW3RoaXMucHJvcHMuaWNvbl1cbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgYmcgPSB0aGlzLnByb3BzLndhbGxwYXBlciA/IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke3RoaXMucHJvcHMud2FsbHBhcGVyLnVybHMudGh1bWJ9KWBcbiAgICB9IDogbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudC13cmFwcGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmdcIiBzdHlsZT17Ymd9PjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNlbnRlclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwid2hpdGVcIjoge1xuICAgIFwic2VhcmNoXCI6IFwiZGF0YTppbWFnZS9zdmcreG1sO3V0Zjg7YmFzZTY0LFBEOTRiV3dnZG1WeWMybHZiajBpTVM0d0lpQmxibU52WkdsdVp6MGlhWE52TFRnNE5Ua3RNU0kvUGdvOElTMHRJRWRsYm1WeVlYUnZjam9nUVdSdlltVWdTV3hzZFhOMGNtRjBiM0lnTVRrdU1DNHdMQ0JUVmtjZ1JYaHdiM0owSUZCc2RXY3RTVzRnTGlCVFZrY2dWbVZ5YzJsdmJqb2dOaTR3TUNCQ2RXbHNaQ0F3S1NBZ0xTMCtDanh6ZG1jZ2VHMXNibk05SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSWlCNGJXeHVjenA0YkdsdWF6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNVGs1T1M5NGJHbHVheUlnZG1WeWMybHZiajBpTVM0eElpQnBaRDBpUTJGd1lWOHhJaUI0UFNJd2NIZ2lJSGs5SWpCd2VDSWdkbWxsZDBKdmVEMGlNQ0F3SURVMkxqazJOaUExTmk0NU5qWWlJSE4wZVd4bFBTSmxibUZpYkdVdFltRmphMmR5YjNWdVpEcHVaWGNnTUNBd0lEVTJMamsyTmlBMU5pNDVOalk3SWlCNGJXdzZjM0JoWTJVOUluQnlaWE5sY25abElpQjNhV1IwYUQwaU1qUndlQ0lnYUdWcFoyaDBQU0l5TkhCNElqNEtQSEJoZEdnZ1pEMGlUVFUxTGpFME5pdzFNUzQ0T0RkTU5ERXVOVGc0TERNM0xqYzRObU16TGpRNE5pMDBMakUwTkN3MUxqTTVOaTA1TGpNMU9DdzFMak01TmkweE5DNDNPRFpqTUMweE1pNDJPREl0TVRBdU16RTRMVEl6TFRJekxUSXpjeTB5TXl3eE1DNHpNVGd0TWpNc01qTWdJSE14TUM0ek1UZ3NNak1zTWpNc01qTmpOQzQzTmpFc01DdzVMakk1T0MweExqUXpOaXd4TXk0eE56Y3ROQzR4TmpKc01UTXVOall4TERFMExqSXdPR013TGpVM01Td3dMalU1TXl3eExqTXpPU3d3TGpreUxESXVNVFl5TERBdU9USWdJR013TGpjM09Td3dMREV1TlRFNExUQXVNamszTERJdU1EYzVMVEF1T0RNM1F6VTJMakkxTlN3MU5DNDVPRElzTlRZdU1qa3pMRFV6TGpBNExEVTFMakUwTml3MU1TNDRPRGQ2SUUweU15NDVPRFFzTm1NNUxqTTNOQ3d3TERFM0xEY3VOakkyTERFM0xERTNjeTAzTGpZeU5pd3hOeTB4Tnl3eE55QWdjeTB4TnkwM0xqWXlOaTB4TnkweE4xTXhOQzQyTVN3MkxESXpMams0TkN3MmVpSWdabWxzYkQwaUkwWkdSa1pHUmlJdlBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhaejRLUEM5blBnbzhMM04yWno0S1wiLFxuICAgIFwiaGVhcnRcIjogXCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmODtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaWFYTnZMVGc0TlRrdE1TSS9QZ284SVMwdElFZGxibVZ5WVhSdmNqb2dRV1J2WW1VZ1NXeHNkWE4wY21GMGIzSWdNVFl1TUM0d0xDQlRWa2NnUlhod2IzSjBJRkJzZFdjdFNXNGdMaUJUVmtjZ1ZtVnljMmx2YmpvZ05pNHdNQ0JDZFdsc1pDQXdLU0FnTFMwK0Nqd2hSRTlEVkZsUVJTQnpkbWNnVUZWQ1RFbERJQ0l0THk5WE0wTXZMMFJVUkNCVFZrY2dNUzR4THk5RlRpSWdJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MMGR5WVhCb2FXTnpMMU5XUnk4eExqRXZSRlJFTDNOMlp6RXhMbVIwWkNJK0NqeHpkbWNnZUcxc2JuTTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5JaUI0Yld4dWN6cDRiR2x1YXowaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1UazVPUzk0YkdsdWF5SWdkbVZ5YzJsdmJqMGlNUzR4SWlCcFpEMGlRMkZ3WVY4eElpQjRQU0l3Y0hnaUlIazlJakJ3ZUNJZ2QybGtkR2c5SWpJMGNIZ2lJR2hsYVdkb2REMGlNalJ3ZUNJZ2RtbGxkMEp2ZUQwaU1DQXdJRFV4TUNBMU1UQWlJSE4wZVd4bFBTSmxibUZpYkdVdFltRmphMmR5YjNWdVpEcHVaWGNnTUNBd0lEVXhNQ0ExTVRBN0lpQjRiV3c2YzNCaFkyVTlJbkJ5WlhObGNuWmxJajRLUEdjK0NnazhaeUJwWkQwaVptRjJiM0pwZEdVaVBnb0pDVHh3WVhSb0lHUTlJazB5TlRVc05EZzVMalpzTFRNMUxqY3RNelV1TjBNNE5pNDNMRE16Tmk0MkxEQXNNalUzTGpVMUxEQXNNVFl3TGpZMVF6QXNPREV1Tml3Mk1TNHlMREl3TGpRc01UUXdMakkxTERJd0xqUmpORE11TXpVc01DdzROaTQzTERJd0xqUXNNVEUwTGpjMUxEVXpMalUxSUNBZ0lFTXlPRE11TURVc05EQXVPQ3d6TWpZdU5Dd3lNQzQwTERNMk9TNDNOU3d5TUM0MFF6UTBPQzQ0TERJd0xqUXNOVEV3TERneExqWXNOVEV3TERFMk1DNDJOV013TERrMkxqa3RPRFl1Tnl3eE56VXVPVFV0TWpFNUxqTXNNamt6TGpJMVRESTFOU3cwT0RrdU5ub2lJR1pwYkd3OUlpTkdSa1pHUmtZaUx6NEtDVHd2Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284Wno0S1BDOW5QZ284TDNOMlp6NEtcIixcbiAgICBcInBhZ2VcIjogXCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmODtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaWFYTnZMVGc0TlRrdE1TSS9QZ284SVMwdElFZGxibVZ5WVhSdmNqb2dRV1J2WW1VZ1NXeHNkWE4wY21GMGIzSWdNVFl1TUM0d0xDQlRWa2NnUlhod2IzSjBJRkJzZFdjdFNXNGdMaUJUVmtjZ1ZtVnljMmx2YmpvZ05pNHdNQ0JDZFdsc1pDQXdLU0FnTFMwK0Nqd2hSRTlEVkZsUVJTQnpkbWNnVUZWQ1RFbERJQ0l0THk5WE0wTXZMMFJVUkNCVFZrY2dNUzR4THk5RlRpSWdJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MMGR5WVhCb2FXTnpMMU5XUnk4eExqRXZSRlJFTDNOMlp6RXhMbVIwWkNJK0NqeHpkbWNnZUcxc2JuTTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5JaUI0Yld4dWN6cDRiR2x1YXowaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1UazVPUzk0YkdsdWF5SWdkbVZ5YzJsdmJqMGlNUzR4SWlCcFpEMGlRMkZ3WVY4eElpQjRQU0l3Y0hnaUlIazlJakJ3ZUNJZ2QybGtkR2c5SWpJMGNIZ2lJR2hsYVdkb2REMGlNalJ3ZUNJZ2RtbGxkMEp2ZUQwaU1DQXdJRFF6T0M0MU16TWdORE00TGpVek15SWdjM1I1YkdVOUltVnVZV0pzWlMxaVlXTnJaM0p2ZFc1a09tNWxkeUF3SURBZ05ETTRMalV6TXlBME16Z3VOVE16T3lJZ2VHMXNPbk53WVdObFBTSndjbVZ6WlhKMlpTSStDanhuUGdvSlBIQmhkR2dnWkQwaVRUTTVOaTR5T0RNc01UTXdMakU0T0dNdE15NDRNRFl0T1M0eE16VXRPQzR6TnpFdE1UWXVNelkxTFRFekxqY3dNeTB5TVM0Mk9UVnNMVGc1TGpBM09DMDRPUzR3T0RGakxUVXVNek15TFRVdU16STFMVEV5TGpVMkxUa3VPRGsxTFRJeExqWTVOeTB4TXk0M01EUWdJQ0JETWpZeUxqWTNNaXd4TGprd015d3lOVFF1TWprM0xEQXNNalEyTGpZNE55d3dTRFl6TGprMU0wTTFOaTR6TkRFc01DdzBPUzQ0Tmprc01pNDJOak1zTkRRdU5UUXNOeTQ1T1ROakxUVXVNek1zTlM0ek1qY3ROeTQ1T1RRc01URXVOems1TFRjdU9UazBMREU1TGpReE5IWXpPRE11TnpFNUlDQWdZekFzTnk0Mk1UY3NNaTQyTmpRc01UUXVNRGc1TERjdU9UazBMREU1TGpReE4yTTFMak16TERVdU16STFMREV4TGpnd01TdzNMams1TVN3eE9TNDBNVFFzTnk0NU9URm9NekV3TGpZek0yTTNMall4TVN3d0xERTBMakEzT1MweUxqWTJOaXd4T1M0ME1EY3ROeTQ1T1RFZ0lDQmpOUzR6TWpndE5TNHpNeklzTnk0NU9UUXRNVEV1T0N3M0xqazVOQzB4T1M0ME1UZFdNVFUxTGpNeE0wTTBNREV1T1RreExERTBOeTQyT1Rrc05EQXdMakE0T0N3eE16a3VNekl6TERNNU5pNHlPRE1zTVRNd0xqRTRPSG9nVFRJMU5TNDRNVFlzTXpndU9ESTJJQ0FnWXpVdU5URTNMREV1T1RBekxEa3VOREU0TERNdU9UazVMREV4TGpjd05DdzJMakk0YkRnNUxqTTJOaXc0T1M0ek5qWmpNaTR5Tnprc01pNHlPRFlzTkM0ek56UXNOaTR4T0RZc05pNHlOellzTVRFdU56QTJTREkxTlM0NE1UWldNemd1T0RJMmVpQk5NelkxTGpRME9TdzBNREV1T1RreElDQWdTRGN6TGpBNE9WWXpOaTQxTkRWb01UUTJMakUzT0hZeE1UZ3VOemN4WXpBc055NDJNVFFzTWk0Mk5qSXNNVFF1TURnMExEY3VPVGt5TERFNUxqUXhOR00xTGpNek1pdzFMak15Tnl3eE1TNDRMRGN1T1RrMExERTVMalF4Tnl3M0xqazVOR2d4TVRndU56Y3pWalF3TVM0NU9URjZJaUJtYVd4c1BTSWpSa1pHUmtaR0lpOCtDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BHYytDand2Wno0S1BDOXpkbWMrQ2c9PVwiXG4gIH0sXG4gIFwiYmxhY2tcIjoge1xuICAgIFwic2VhcmNoXCI6IFwiZGF0YTppbWFnZS9zdmcreG1sO3V0Zjg7YmFzZTY0LFBEOTRiV3dnZG1WeWMybHZiajBpTVM0d0lpQmxibU52WkdsdVp6MGlhWE52TFRnNE5Ua3RNU0kvUGdvOElTMHRJRWRsYm1WeVlYUnZjam9nUVdSdlltVWdTV3hzZFhOMGNtRjBiM0lnTVRndU1TNHhMQ0JUVmtjZ1JYaHdiM0owSUZCc2RXY3RTVzRnTGlCVFZrY2dWbVZ5YzJsdmJqb2dOaTR3TUNCQ2RXbHNaQ0F3S1NBZ0xTMCtDanh6ZG1jZ2VHMXNibk05SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSWlCNGJXeHVjenA0YkdsdWF6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNVGs1T1M5NGJHbHVheUlnZG1WeWMybHZiajBpTVM0eElpQnBaRDBpUTJGd1lWOHhJaUI0UFNJd2NIZ2lJSGs5SWpCd2VDSWdkbWxsZDBKdmVEMGlNQ0F3SURJMU1DNHpNVE1nTWpVd0xqTXhNeUlnYzNSNWJHVTlJbVZ1WVdKc1pTMWlZV05yWjNKdmRXNWtPbTVsZHlBd0lEQWdNalV3TGpNeE15QXlOVEF1TXpFek95SWdlRzFzT25Od1lXTmxQU0p3Y21WelpYSjJaU0lnZDJsa2RHZzlJakkwY0hnaUlHaGxhV2RvZEQwaU1qUndlQ0krQ2p4bklHbGtQU0pUWldGeVkyZ2lQZ29KUEhCaGRHZ2djM1I1YkdVOUltWnBiR3d0Y25Wc1pUcGxkbVZ1YjJSa08yTnNhWEF0Y25Wc1pUcGxkbVZ1YjJSa095SWdaRDBpVFRJME5DNHhPRFlzTWpFMExqWXdOR3d0TlRRdU16YzVMVFUwTGpNM09HTXRNQzR5T0RrdE1DNHlPRGt0TUM0Mk1qZ3RNQzQwT1RFdE1DNDVNeTB3TGpjMklDQWdZekV3TGpjdE1UWXVNak14TERFMkxqazBOUzB6TlM0Mk5pd3hOaTQ1TkRVdE5UWXVOVFUwUXpJd05TNDRNaklzTkRZdU1EYzFMREUxT1M0M05EY3NNQ3d4TURJdU9URXhMREJUTUN3ME5pNHdOelVzTUN3eE1ESXVPVEV4SUNBZ1l6QXNOVFl1T0RNMUxEUTJMakEzTkN3eE1ESXVPVEV4TERFd01pNDVNU3d4TURJdU9URXhZekl3TGpnNU5Td3dMRFF3TGpNeU15MDJMakkwTlN3MU5pNDFOVFF0TVRZdU9UUTFZekF1TWpZNUxEQXVNekF4TERBdU5EY3NNQzQyTkN3d0xqYzFPU3d3TGpreU9XdzFOQzR6T0N3MU5DNHpPQ0FnSUdNNExqRTJPU3c0TGpFMk9Dd3lNUzQwTVRNc09DNHhOamdzTWprdU5UZ3pMREJETWpVeUxqTTFOQ3d5TXpZdU1ERTNMREkxTWk0ek5UUXNNakl5TGpjM015d3lORFF1TVRnMkxESXhOQzQyTURSNklFMHhNREl1T1RFeExERTNNQzR4TkRZZ0lDQmpMVE0zTGpFek5Dd3dMVFkzTGpJek5pMHpNQzR4TURJdE5qY3VNak0yTFRZM0xqSXpOV013TFRNM0xqRXpOQ3d6TUM0eE1ETXROamN1TWpNMkxEWTNMakl6TmkwMk55NHlNelpqTXpjdU1UTXlMREFzTmpjdU1qTTFMRE13TGpFd015dzJOeTR5TXpVc05qY3VNak0ySUNBZ1F6RTNNQzR4TkRZc01UUXdMakEwTkN3eE5EQXVNRFF6TERFM01DNHhORFlzTVRBeUxqa3hNU3d4TnpBdU1UUTJlaUlnWm1sc2JEMGlJekF3TURBd01DSXZQZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0NqeG5QZ284TDJjK0Nqd3ZjM1puUGdvPVwiLFxuICAgIFwicGFnZVwiOiBcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4O2Jhc2U2NCxQRDk0Yld3Z2RtVnljMmx2YmowaU1TNHdJaUJsYm1OdlpHbHVaejBpYVhOdkxUZzROVGt0TVNJL1BnbzhJUzB0SUVkbGJtVnlZWFJ2Y2pvZ1FXUnZZbVVnU1d4c2RYTjBjbUYwYjNJZ01UWXVNQzR3TENCVFZrY2dSWGh3YjNKMElGQnNkV2N0U1c0Z0xpQlRWa2NnVm1WeWMybHZiam9nTmk0d01DQkNkV2xzWkNBd0tTQWdMUzArQ2p3aFJFOURWRmxRUlNCemRtY2dVRlZDVEVsRElDSXRMeTlYTTBNdkwwUlVSQ0JUVmtjZ01TNHhMeTlGVGlJZ0ltaDBkSEE2THk5M2QzY3Vkek11YjNKbkwwZHlZWEJvYVdOekwxTldSeTh4TGpFdlJGUkVMM04yWnpFeExtUjBaQ0krQ2p4emRtY2dlRzFzYm5NOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6SXdNREF2YzNabklpQjRiV3h1Y3pwNGJHbHVhejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TVRrNU9TOTRiR2x1YXlJZ2RtVnljMmx2YmowaU1TNHhJaUJwWkQwaVEyRndZVjh4SWlCNFBTSXdjSGdpSUhrOUlqQndlQ0lnZDJsa2RHZzlJakkwY0hnaUlHaGxhV2RvZEQwaU1qUndlQ0lnZG1sbGQwSnZlRDBpTUNBd0lEUXpPQzQxTXpNZ05ETTRMalV6TXlJZ2MzUjViR1U5SW1WdVlXSnNaUzFpWVdOclozSnZkVzVrT201bGR5QXdJREFnTkRNNExqVXpNeUEwTXpndU5UTXpPeUlnZUcxc09uTndZV05sUFNKd2NtVnpaWEoyWlNJK0NqeG5QZ29KUEhCaGRHZ2daRDBpVFRNNU5pNHlPRE1zTVRNd0xqRTRPR010TXk0NE1EWXRPUzR4TXpVdE9DNHpOekV0TVRZdU16WTFMVEV6TGpjd015MHlNUzQyT1RWc0xUZzVMakEzT0MwNE9TNHdPREZqTFRVdU16TXlMVFV1TXpJMUxURXlMalUyTFRrdU9EazFMVEl4TGpZNU55MHhNeTQzTURRZ0lDQkRNall5TGpZM01pd3hMamt3TXl3eU5UUXVNamszTERBc01qUTJMalk0Tnl3d1NEWXpMamsxTTBNMU5pNHpOREVzTUN3ME9TNDROamtzTWk0Mk5qTXNORFF1TlRRc055NDVPVE5qTFRVdU16TXNOUzR6TWpjdE55NDVPVFFzTVRFdU56azVMVGN1T1RrMExERTVMalF4TkhZek9ETXVOekU1SUNBZ1l6QXNOeTQyTVRjc01pNDJOalFzTVRRdU1EZzVMRGN1T1RrMExERTVMalF4TjJNMUxqTXpMRFV1TXpJMUxERXhMamd3TVN3M0xqazVNU3d4T1M0ME1UUXNOeTQ1T1RGb016RXdMall6TTJNM0xqWXhNU3d3TERFMExqQTNPUzB5TGpZMk5pd3hPUzQwTURjdE55NDVPVEVnSUNCak5TNHpNamd0TlM0ek16SXNOeTQ1T1RRdE1URXVPQ3czTGprNU5DMHhPUzQwTVRkV01UVTFMak14TTBNME1ERXVPVGt4TERFME55NDJPVGtzTkRBd0xqQTRPQ3d4TXprdU16SXpMRE01Tmk0eU9ETXNNVE13TGpFNE9Ib2dUVEkxTlM0NE1UWXNNemd1T0RJMklDQWdZelV1TlRFM0xERXVPVEF6TERrdU5ERTRMRE11T1RrNUxERXhMamN3TkN3MkxqSTRiRGc1TGpNMk5pdzRPUzR6Tmpaak1pNHlOemtzTWk0eU9EWXNOQzR6TnpRc05pNHhPRFlzTmk0eU56WXNNVEV1TnpBMlNESTFOUzQ0TVRaV016Z3VPREkyZWlCTk16WTFMalEwT1N3ME1ERXVPVGt4SUNBZ1NEY3pMakE0T1ZZek5pNDFORFZvTVRRMkxqRTNPSFl4TVRndU56Y3hZekFzTnk0Mk1UUXNNaTQyTmpJc01UUXVNRGcwTERjdU9Ua3lMREU1TGpReE5HTTFMak16TWl3MUxqTXlOeXd4TVM0NExEY3VPVGswTERFNUxqUXhOeXczTGprNU5HZ3hNVGd1TnpjelZqUXdNUzQ1T1RGNklpQm1hV3hzUFNJak1EQXdNREF3SWk4K0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEdjK0Nqd3ZaejRLUEM5emRtYytDZz09XCJcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4vYnV0dG9uJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW51IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc2V0VGl0bGUodGl0bGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgdGl0bGUgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICB7dGhpcy5zdGF0ZS50aXRsZSB8fCBcIlwifVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImJ1dHRvbnNcIj5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGljb249XCJjYWxlbmRhclwiXG4gICAgICAgICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLnNldFRpdGxlKCdSZWNlbnRseSBWaXNpdGVkJyl9XG4gICAgICAgICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMuc2V0VGl0bGUoKX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vcGVuUmVjZW50KCl9IC8+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGljb249XCJoZWFydFwiXG4gICAgICAgICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLnNldFRpdGxlKCdCb29rbWFya3MnKX1cbiAgICAgICAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy5zZXRUaXRsZSgpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5Cb29rbWFya3MoKX0gLz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgIGljb249XCJmaXJlXCJcbiAgICAgICAgICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLnNldFRpdGxlKCdNb3N0IFZpc2l0ZWQnKX1cbiAgICAgICAgICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMuc2V0VGl0bGUoKX1cbiAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub3BlblRvcCgpfSAvPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCBNZXNzYWdpbmcgZnJvbSAnLi4vbGliL21lc3NhZ2luZydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnJvbU5ld1RhYlRvQmFja2dyb3VuZCBleHRlbmRzIE1lc3NhZ2luZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLm5hbWUgPSAna296bW9zOm5ld3RhYidcbiAgICB0aGlzLnRhcmdldCA9ICdrb3ptb3M6YmFja2dyb3VuZCdcbiAgfVxuXG4gIGxpc3RlbkZvck1lc3NhZ2VzKCkge1xuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihtc2cgPT4gdGhpcy5vblJlY2VpdmUobXNnKSlcbiAgfVxuXG4gIHNlbmRNZXNzYWdlIChtc2csIGNhbGxiYWNrKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobXNnLCBjYWxsYmFjaylcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50LCByZW5kZXIgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBXYWxscGFwZXIgZnJvbSAnLi93YWxscGFwZXInXG5pbXBvcnQgTWVudSBmcm9tIFwiLi9tZW51XCJcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vYnV0dG9uXCJcbmltcG9ydCB3YWxscGFwZXJzIGZyb20gJy4vd2FsbHBhcGVycydcbmltcG9ydCBTZXR0aW5ncyBmcm9tICcuL3NldHRpbmdzJ1xuaW1wb3J0IEJvb2ttYXJrcyBmcm9tICcuL2Jvb2ttYXJrcydcbmltcG9ydCBpY29ucyBmcm9tIFwiLi9pY29uc1wiXG5cbmNsYXNzIE5ld1RhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHdhbGxwYXBlcjogbnVsbCxcbiAgICAgIHNob3dCb29rbWFya3M6IHRydWVcbiAgICB9KVxuXG4gICAgdGhpcy5ib29rbWFya3MgPSBuZXcgQm9va21hcmtzKClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BuZXd0YWJgfT5cbiAgICAgICAgPGltZyBzcmM9e2ljb25zLmNsb3NlfSBjbGFzc05hbWU9XCJjbG9zZS1idXR0b25cIiBvbmNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgc2hvd0Jvb2ttYXJrczogZmFsc2UgfSl9IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2VudGVyXCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyQm9va21hcmtzKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7IHRoaXMuc3RhdGUud2FsbHBhcGVyID8gPFdhbGxwYXBlciB7Li4udGhpcy5zdGF0ZS53YWxscGFwZXJ9IC8+IDogbnVsbCB9XG4gICAgICAgIDxTZXR0aW5ncyBvcGVuPXt0aGlzLnN0YXRlLmlzU2V0dGluZ3NPcGVufSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQm9va21hcmtzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Qm9va21hcmtzIG9wZW49e3RoaXMuc3RhdGUuc2hvd0Jvb2ttYXJrc30gd2FsbHBhcGVyPXt0aGlzLnN0YXRlLndhbGxwYXBlcn0gLz5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZXR0aW5nc0J1dHRvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJ1dHRvbiBjbGFzc05hbWU9XCJzZXR0aW5nc1wiIGljb249e3RoaXMuc3RhdGUuaXNTZXR0aW5nc09wZW4gPyBcImNsb3NlXCIgOiBcInNldHRpbmdzXCJ9IG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBpc1NldHRpbmdzT3BlbjogIXRoaXMuc3RhdGUuaXNTZXR0aW5nc09wZW4gfSl9IC8+XG4gICAgKVxuICB9XG59XG5cbnJlbmRlcig8TmV3VGFiIC8+LCBkb2N1bWVudC5ib2R5KVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgaWNvbnMgZnJvbSAnLi9pY29ucydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoSW5wdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5pbnB1dCkgdGhpcy5pbnB1dC5mb2N1cygpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VhcmNoLWlucHV0XCI+XG4gICAgICAgIHt0aGlzLnJlbmRlckljb24oKX1cbiAgICAgICAge3RoaXMucmVuZGVySW5wdXQoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckljb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxpbWcgY2xhc3NOYW1lPVwiaWNvblwiIHNyYz17aWNvbnMuYmxhY2suc2VhcmNofSAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlcklucHV0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8aW5wdXQgcmVmPXtlbCA9PiB0aGlzLmlucHV0ID0gZWx9XG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXRcIlxuICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCB5b3VyIGhpc3RvcnkgYW5kIGJvb2ttYXJrc1wiXG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMucHJvcHMub25RdWVyeUNoYW5nZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgIG9uS2V5VXA9e2UgPT4gdGhpcy5wcm9wcy5vblF1ZXJ5Q2hhbmdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMucXVlcnl9IC8+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZ3MgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2V0dGluZ3MgJHt0aGlzLnByb3BzLm9wZW4gPyBcIm9wZW5cIiA6IFwiXCJ9YH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpYW5nbGVcIj48L2Rpdj5cbiAgICAgICAgPGgxPjxzcGFuPlNldHRpbmdzPC9zcGFuPjwvaDE+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYWxscGFwZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6IGB1cmwoJHt0aGlzLnByb3BzLnVybHMuZnVsbH0pYFxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhbGxwYXBlclwiIHN0eWxlPXtzdHlsZX0+XG4gICAgICAgIHt0aGlzLnJlbmRlckF1dGhvcigpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQXV0aG9yKCkge1xuICAgIGxldCBuYW1lID0gdGhpcy5zdGF0ZS51c2VyLm5hbWUgfHwgdGhpcy5zdGF0ZS51c2VyLnVzZXJuYW1lXG4gICAgbGV0IGxpbmsgPSB0aGlzLnN0YXRlLnVzZXIucG9ydGZvbGlvX3VybCB8fCAoJ2h0dHBzOi8vdW5zcGxhc2guY29tL0AnICsgdGhpcy5zdGF0ZS51c2VyLnVzZXJuYW1lKVxuICAgIGNvbnN0IHByb2ZpbGVQaG90b1N0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7dGhpcy5zdGF0ZS51c2VyLnByb2ZpbGVfaW1hZ2Uuc21hbGx9KWBcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGEgaHJlZj17bGlua30gY2xhc3NOYW1lPVwiYXV0aG9yXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInByb2ZpbGUtaW1hZ2VcIiBzdHlsZT17cHJvZmlsZVBob3RvU3R5bGV9Pjwvc3Bhbj5cbiAgICAgICAgPGxhYmVsPlBob3RvZ3JhcGhlcjogPC9sYWJlbD57bmFtZX1cbiAgICAgIDwvYT5cbiAgICApXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzPVtcbiAge1xuICAgIFwiY2F0ZWdvcmllc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwiaWRcIjogNCxcbiAgICAgICAgXCJsaW5rc1wiOiB7XG4gICAgICAgICAgXCJwaG90b3NcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vY2F0ZWdvcmllcy80L3Bob3Rvc1wiLFxuICAgICAgICAgIFwic2VsZlwiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS9jYXRlZ29yaWVzLzRcIlxuICAgICAgICB9LFxuICAgICAgICBcInBob3RvX2NvdW50XCI6IDU0MTg0LFxuICAgICAgICBcInRpdGxlXCI6IFwiTmF0dXJlXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwiY29sb3JcIjogXCIjQzBDMTk4XCIsXG4gICAgXCJjcmVhdGVkX2F0XCI6IFwiMjAxNi0wMy0yM1QwNTowOTo0Ny0wNDowMFwiLFxuICAgIFwiY3VycmVudF91c2VyX2NvbGxlY3Rpb25zXCI6IFtdLFxuICAgIFwiZGVzY3JpcHRpb25cIjogbnVsbCxcbiAgICBcImhlaWdodFwiOiAzMzE5LFxuICAgIFwiaWRcIjogXCJETWNJMGNtWUpZa1wiLFxuICAgIFwibGlrZWRfYnlfdXNlclwiOiBmYWxzZSxcbiAgICBcImxpa2VzXCI6IDEyMDMsXG4gICAgXCJsaW5rc1wiOiB7XG4gICAgICBcImRvd25sb2FkXCI6IFwiaHR0cDovL3Vuc3BsYXNoLmNvbS9waG90b3MvRE1jSTBjbVlKWWsvZG93bmxvYWRcIixcbiAgICAgIFwiZG93bmxvYWRfbG9jYXRpb25cIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vcGhvdG9zL0RNY0kwY21ZSllrL2Rvd25sb2FkXCIsXG4gICAgICBcImh0bWxcIjogXCJodHRwOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9ETWNJMGNtWUpZa1wiLFxuICAgICAgXCJzZWxmXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3Bob3Rvcy9ETWNJMGNtWUpZa1wiXG4gICAgfSxcbiAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE3LTA3LTAxVDAzOjUzOjU0LTA0OjAwXCIsXG4gICAgXCJ1cmxzXCI6IHtcbiAgICAgIFwiZnVsbFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU4NzI0MDI5OTM2LTJjYzZlZTM4ZjVlZj9peGxpYj1yYi0wLjMuNSZxPTg1JmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9c3JnYiZzPTY2Mzk1ODMwOWM5ZGQzM2E2ZGYwMWMzZjNjOTNlZDFkXCIsXG4gICAgICBcInJhd1wiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU4NzI0MDI5OTM2LTJjYzZlZTM4ZjVlZlwiLFxuICAgICAgXCJyZWd1bGFyXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTg3MjQwMjk5MzYtMmNjNmVlMzhmNWVmP2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZW50cm9weSZjcz10aW55c3JnYiZ3PTEwODAmZml0PW1heCZzPTRiODdlYjYyNDJmNmE0NTFhMjEyNTI5MGFkYmNiMzdhXCIsXG4gICAgICBcInNtYWxsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTg3MjQwMjk5MzYtMmNjNmVlMzhmNWVmP2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZW50cm9weSZjcz10aW55c3JnYiZ3PTQwMCZmaXQ9bWF4JnM9NGM0MTc3NjlhNDY1NjliYTM3Y2VkN2E4MmQ3YjkxOGNcIixcbiAgICAgIFwidGh1bWJcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1ODcyNDAyOTkzNi0yY2M2ZWUzOGY1ZWY/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXRpbnlzcmdiJnc9MjAwJmZpdD1tYXgmcz0wMjc1N2JlM2Q5YjRkY2JmODM2MmMxNTQ2NmNhNDcyNVwiXG4gICAgfSxcbiAgICBcInVzZXJcIjoge1xuICAgICAgXCJiaW9cIjogXCJFbmdsaXNoIHBob3RvZ3JhcGhlciBsaXZpbmcgaW4gU3lkbmV5LCBBdXN0cmFsaWEuIFNob290aW5nIHdpdGggYSBDYW5vbiA2RC5cXHJcXG5cXHJcXG5TYW1zY3JpbUBnb29nbGVtYWlsLmNvbVxcclxcblwiLFxuICAgICAgXCJmaXJzdF9uYW1lXCI6IFwiU2FtdWVsXCIsXG4gICAgICBcImlkXCI6IFwiV2ROZVlxa2ZZS01cIixcbiAgICAgIFwibGFzdF9uYW1lXCI6IFwiU2NyaW1zaGF3XCIsXG4gICAgICBcImxpbmtzXCI6IHtcbiAgICAgICAgXCJmb2xsb3dlcnNcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvc2Ftc2NyaW0vZm9sbG93ZXJzXCIsXG4gICAgICAgIFwiZm9sbG93aW5nXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL3NhbXNjcmltL2ZvbGxvd2luZ1wiLFxuICAgICAgICBcImh0bWxcIjogXCJodHRwOi8vdW5zcGxhc2guY29tL0BzYW1zY3JpbVwiLFxuICAgICAgICBcImxpa2VzXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL3NhbXNjcmltL2xpa2VzXCIsXG4gICAgICAgIFwicGhvdG9zXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL3NhbXNjcmltL3Bob3Rvc1wiLFxuICAgICAgICBcInBvcnRmb2xpb1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9zYW1zY3JpbS9wb3J0Zm9saW9cIixcbiAgICAgICAgXCJzZWxmXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL3NhbXNjcmltXCJcbiAgICAgIH0sXG4gICAgICBcImxvY2F0aW9uXCI6IFwiQXVzdHJhbGlhXCIsXG4gICAgICBcIm5hbWVcIjogXCJTYW11ZWwgU2NyaW1zaGF3XCIsXG4gICAgICBcInBvcnRmb2xpb191cmxcIjogXCJodHRwOi8vd3d3Lmluc3RhZ3JhbS5jb20vc2Ftc2NyaW1cIixcbiAgICAgIFwicHJvZmlsZV9pbWFnZVwiOiB7XG4gICAgICAgIFwibGFyZ2VcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcHJvZmlsZS0xNDU4NzIzNjc5MjYxLWE1ZWYzMmNiMmEwND9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWZhY2VzJmNzPXRpbnlzcmdiJmZpdD1jcm9wJmg9MTI4Jnc9MTI4JnM9MTVhZmNlNGZkMjg2MDc0ZDkyZmE3MjYzMmQ4Y2FhMzRcIixcbiAgICAgICAgXCJtZWRpdW1cIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcHJvZmlsZS0xNDU4NzIzNjc5MjYxLWE1ZWYzMmNiMmEwND9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWZhY2VzJmNzPXRpbnlzcmdiJmZpdD1jcm9wJmg9NjQmdz02NCZzPTQ1MDk2NDViOTI4OWE5ZmVhOGI4NTUxOGM3N2NlMGVkXCIsXG4gICAgICAgIFwic21hbGxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcHJvZmlsZS0xNDU4NzIzNjc5MjYxLWE1ZWYzMmNiMmEwND9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWZhY2VzJmNzPXRpbnlzcmdiJmZpdD1jcm9wJmg9MzImdz0zMiZzPTkwZWE3NThiZTY5OTk4MDdiNmQ4ZGExZWM2MDI1MzBmXCJcbiAgICAgIH0sXG4gICAgICBcInRvdGFsX2NvbGxlY3Rpb25zXCI6IDAsXG4gICAgICBcInRvdGFsX2xpa2VzXCI6IDAsXG4gICAgICBcInRvdGFsX3Bob3Rvc1wiOiAxNCxcbiAgICAgIFwidHdpdHRlcl91c2VybmFtZVwiOiBudWxsLFxuICAgICAgXCJ1cGRhdGVkX2F0XCI6IFwiMjAxNy0wNy0wMVQwNzowNToyNC0wNDowMFwiLFxuICAgICAgXCJ1c2VybmFtZVwiOiBcInNhbXNjcmltXCJcbiAgICB9LFxuICAgIFwid2lkdGhcIjogNDk3OVxuICB9LFxuICB7XG4gICAgXCJjYXRlZ29yaWVzXCI6IFtdLFxuICAgIFwiY29sb3JcIjogXCIjMzgyRjMwXCIsXG4gICAgXCJjcmVhdGVkX2F0XCI6IFwiMjAxNy0wNS0wN1QxOTo0NjozMi0wNDowMFwiLFxuICAgIFwiY3VycmVudF91c2VyX2NvbGxlY3Rpb25zXCI6IFtdLFxuICAgIFwiZGVzY3JpcHRpb25cIjogbnVsbCxcbiAgICBcImhlaWdodFwiOiAyMDAwLFxuICAgIFwiaWRcIjogXCJFd0U0dEJZaDNtc1wiLFxuICAgIFwibGlrZWRfYnlfdXNlclwiOiBmYWxzZSxcbiAgICBcImxpa2VzXCI6IDE5NCxcbiAgICBcImxpbmtzXCI6IHtcbiAgICAgIFwiZG93bmxvYWRcIjogXCJodHRwOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9Fd0U0dEJZaDNtcy9kb3dubG9hZFwiLFxuICAgICAgXCJkb3dubG9hZF9sb2NhdGlvblwiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS9waG90b3MvRXdFNHRCWWgzbXMvZG93bmxvYWRcIixcbiAgICAgIFwiaHRtbFwiOiBcImh0dHA6Ly91bnNwbGFzaC5jb20vcGhvdG9zL0V3RTR0QlloM21zXCIsXG4gICAgICBcInNlbGZcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vcGhvdG9zL0V3RTR0QlloM21zXCJcbiAgICB9LFxuICAgIFwidXBkYXRlZF9hdFwiOiBcIjIwMTctMDctMDFUMDQ6MjM6MjQtMDQ6MDBcIixcbiAgICBcInVybHNcIjoge1xuICAgICAgXCJmdWxsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQyMDA0ODMwMzUtZGI3YmM2YWE1NzM5P2l4bGliPXJiLTAuMy41JnE9ODUmZm09anBnJmNyb3A9ZW50cm9weSZjcz1zcmdiJnM9MzMyNTg5MjExYjVmM2IyY2I3YzY0YjdlZmE2ZjM0NzNcIixcbiAgICAgIFwicmF3XCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQyMDA0ODMwMzUtZGI3YmM2YWE1NzM5XCIsXG4gICAgICBcInJlZ3VsYXJcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ5NDIwMDQ4MzAzNS1kYjdiYzZhYTU3Mzk/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXRpbnlzcmdiJnc9MTA4MCZmaXQ9bWF4JnM9ZjcxMjRkODhjZDhiZTk2YTA2MTEwOGI2ZTNlZjlkMzBcIixcbiAgICAgIFwic21hbGxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ5NDIwMDQ4MzAzNS1kYjdiYzZhYTU3Mzk/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXRpbnlzcmdiJnc9NDAwJmZpdD1tYXgmcz1lN2RmZmQ2ZGY5YmFkZWE5Y2FlYmEzM2IyYTc1Y2IxM1wiLFxuICAgICAgXCJ0aHVtYlwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk0MjAwNDgzMDM1LWRiN2JjNmFhNTczOT9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9dGlueXNyZ2Imdz0yMDAmZml0PW1heCZzPTk4ZTczZWY4ZTRiMzAyY2Y3YWFkMWJjNjExYTdlYzc4XCJcbiAgICB9LFxuICAgIFwidXNlclwiOiB7XG4gICAgICBcImJpb1wiOiBcIlwiLFxuICAgICAgXCJmaXJzdF9uYW1lXCI6IFwiS2F0aWVcIixcbiAgICAgIFwiaWRcIjogXCJuaWdUdXM5YXNSOFwiLFxuICAgICAgXCJsYXN0X25hbWVcIjogXCJUcmVhZHdheVwiLFxuICAgICAgXCJsaW5rc1wiOiB7XG4gICAgICAgIFwiZm9sbG93ZXJzXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2thdGlldHJlYWR3YXkvZm9sbG93ZXJzXCIsXG4gICAgICAgIFwiZm9sbG93aW5nXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2thdGlldHJlYWR3YXkvZm9sbG93aW5nXCIsXG4gICAgICAgIFwiaHRtbFwiOiBcImh0dHA6Ly91bnNwbGFzaC5jb20vQGthdGlldHJlYWR3YXlcIixcbiAgICAgICAgXCJsaWtlc1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9rYXRpZXRyZWFkd2F5L2xpa2VzXCIsXG4gICAgICAgIFwicGhvdG9zXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2thdGlldHJlYWR3YXkvcGhvdG9zXCIsXG4gICAgICAgIFwicG9ydGZvbGlvXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2thdGlldHJlYWR3YXkvcG9ydGZvbGlvXCIsXG4gICAgICAgIFwic2VsZlwiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9rYXRpZXRyZWFkd2F5XCJcbiAgICAgIH0sXG4gICAgICBcImxvY2F0aW9uXCI6IFwiQmVudG9udmlsbGUsIEFyXCIsXG4gICAgICBcIm5hbWVcIjogXCJLYXRpZSBUcmVhZHdheVwiLFxuICAgICAgXCJwb3J0Zm9saW9fdXJsXCI6IFwiaHR0cDovL3d3dy5rYXRpZXRyZWFkd2F5cGhvdG9ncmFwaHkuY29tL1wiLFxuICAgICAgXCJwcm9maWxlX2ltYWdlXCI6IHtcbiAgICAgICAgXCJsYXJnZVwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9wcm9maWxlLTE0ODA4NjUyNzU5MzMtMjUxODE3ZmM1MTc2P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZmFjZXMmY3M9dGlueXNyZ2ImZml0PWNyb3AmaD0xMjgmdz0xMjgmcz1lMWVjY2UzNmNlZTYwYWM4NGY4OWU2ZDVkZGE2NGY2MlwiLFxuICAgICAgICBcIm1lZGl1bVwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9wcm9maWxlLTE0ODA4NjUyNzU5MzMtMjUxODE3ZmM1MTc2P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZmFjZXMmY3M9dGlueXNyZ2ImZml0PWNyb3AmaD02NCZ3PTY0JnM9NTE1YTk1MmE4ODEyZDk1MTJiYWUxNDQ2MzI3YzczMjdcIixcbiAgICAgICAgXCJzbWFsbFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9wcm9maWxlLTE0ODA4NjUyNzU5MzMtMjUxODE3ZmM1MTc2P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZmFjZXMmY3M9dGlueXNyZ2ImZml0PWNyb3AmaD0zMiZ3PTMyJnM9ZWY4NzU2YzVhYmM0MjU5YjI3NTQxMGE4ZTgwYzA1ZTZcIlxuICAgICAgfSxcbiAgICAgIFwidG90YWxfY29sbGVjdGlvbnNcIjogMCxcbiAgICAgIFwidG90YWxfbGlrZXNcIjogMCxcbiAgICAgIFwidG90YWxfcGhvdG9zXCI6IDcsXG4gICAgICBcInR3aXR0ZXJfdXNlcm5hbWVcIjogbnVsbCxcbiAgICAgIFwidXBkYXRlZF9hdFwiOiBcIjIwMTctMDctMDFUMDQ6MjM6MjQtMDQ6MDBcIixcbiAgICAgIFwidXNlcm5hbWVcIjogXCJrYXRpZXRyZWFkd2F5XCJcbiAgICB9LFxuICAgIFwid2lkdGhcIjogMzAwMFxuICB9LFxuICB7XG4gICAgICAgIFwiY2F0ZWdvcmllc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJpZFwiOiAyLFxuICAgICAgICAgICAgICAgIFwibGlua3NcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInBob3Rvc1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS9jYXRlZ29yaWVzLzIvcGhvdG9zXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZlwiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS9jYXRlZ29yaWVzLzJcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJwaG90b19jb3VudFwiOiAyMjg5NyxcbiAgICAgICAgICAgICAgICBcInRpdGxlXCI6IFwiQnVpbGRpbmdzXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJjb2xvclwiOiBcIiMyQjJGMkVcIixcbiAgICAgICAgXCJjcmVhdGVkX2F0XCI6IFwiMjAxNi0wMy0yMlQxNzozODo0NC0wNDowMFwiLFxuICAgICAgICBcImN1cnJlbnRfdXNlcl9jb2xsZWN0aW9uc1wiOiBbXSxcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBudWxsLFxuICAgICAgICBcImhlaWdodFwiOiAzMzY2LFxuICAgICAgICBcImlkXCI6IFwialI0WmYtcmlFaklcIixcbiAgICAgICAgXCJsaWtlZF9ieV91c2VyXCI6IGZhbHNlLFxuICAgICAgICBcImxpa2VzXCI6IDExNDEsXG4gICAgICAgIFwibGlua3NcIjoge1xuICAgICAgICAgICAgXCJkb3dubG9hZFwiOiBcImh0dHA6Ly91bnNwbGFzaC5jb20vcGhvdG9zL2pSNFpmLXJpRWpJL2Rvd25sb2FkXCIsXG4gICAgICAgICAgICBcImRvd25sb2FkX2xvY2F0aW9uXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3Bob3Rvcy9qUjRaZi1yaUVqSS9kb3dubG9hZFwiLFxuICAgICAgICAgICAgXCJodG1sXCI6IFwiaHR0cDovL3Vuc3BsYXNoLmNvbS9waG90b3MvalI0WmYtcmlFaklcIixcbiAgICAgICAgICAgIFwic2VsZlwiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS9waG90b3MvalI0WmYtcmlFaklcIlxuICAgICAgICB9LFxuICAgICAgICBcInVwZGF0ZWRfYXRcIjogXCIyMDE3LTA3LTAxVDAzOjM2OjQ1LTA0OjAwXCIsXG4gICAgXCJ1cmxzXCI6IHtcbiAgICAgICAgICAgIFwiZnVsbFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU4NjgyNjI1MjIxLTNhNDVmOGE4NDRjNz9peGxpYj1yYi0wLjMuNSZxPTg1JmZtPWpwZyZjcm9wPWVudHJvcHkmY3M9c3JnYiZzPTA5Mjc5YTFhMWNjNmFmOGY3ZTQxZDFmYzcwNmM3MDI1XCIsXG4gICAgICAgICAgICBcInJhd1wiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU4NjgyNjI1MjIxLTNhNDVmOGE4NDRjN1wiLFxuICAgICAgICAgICAgXCJyZWd1bGFyXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTg2ODI2MjUyMjEtM2E0NWY4YTg0NGM3P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZW50cm9weSZjcz10aW55c3JnYiZ3PTEwODAmZml0PW1heCZzPTEwMjQ1MTI2NGU5Y2QwYzZmYzk0NzY4YmYzNDVlNjg2XCIsXG4gICAgICAgICAgICBcInNtYWxsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTg2ODI2MjUyMjEtM2E0NWY4YTg0NGM3P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZW50cm9weSZjcz10aW55c3JnYiZ3PTQwMCZmaXQ9bWF4JnM9MzAwMDM2OGFhMjY1Mjk5NDMzODk0YmFjYzdkMzUyNmJcIixcbiAgICAgICAgICAgIFwidGh1bWJcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1ODY4MjYyNTIyMS0zYTQ1ZjhhODQ0Yzc/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1lbnRyb3B5JmNzPXRpbnlzcmdiJnc9MjAwJmZpdD1tYXgmcz0wMDJkYzU0NTljN2UzN2Y0MGYxYjUwOGQ0YmIxZGQ0ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwidXNlclwiOiB7XG4gICAgICAgICAgICBcImJpb1wiOiBcIkxvbmRvbiBiYXNlZCBwaG90b2dyYXBoZXIgd2l0aCBhbiBleWUgZm9yIHRoZSBkZXRhaWxzIGluIGxpZmUsIHdoaWNoIGlzIHRoZSBiYXNpcyBvZiB0aGUgYWVzdGhldGljIGluIG15IHBob3RvZ3JhcGhzLiBXaGVyZWFzIGZvciBzb21lLCBmb2N1c2luZyBvbiBkZXRhaWxzIGFuZCBwcmVjaXNpb24gZGV0YWNoZXMgZmVlbGluZ3MsIEkgdXNlIGRldGFpbHMgdG8gYnJpbmcgc3ViamVjdHMgdG8gbGlmZS5cIixcbiAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiBcIkFuZHJld1wiLFxuICAgICAgICAgICAgXCJpZFwiOiBcIml4Y1JnZ0hwVXpzXCIsXG4gICAgICAgICAgICBcImxhc3RfbmFtZVwiOiBcIlJpZGxleVwiLFxuICAgICAgICAgICAgXCJsaW5rc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJmb2xsb3dlcnNcIjogXCJodHRwczovL2FwaS51bnNwbGFzaC5jb20vdXNlcnMvYXJpZGxleTg4L2ZvbGxvd2Vyc1wiLFxuICAgICAgICAgICAgICAgIFwiZm9sbG93aW5nXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2FyaWRsZXk4OC9mb2xsb3dpbmdcIixcbiAgICAgICAgICAgICAgICBcImh0bWxcIjogXCJodHRwOi8vdW5zcGxhc2guY29tL0BhcmlkbGV5ODhcIixcbiAgICAgICAgICAgICAgICBcImxpa2VzXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2FyaWRsZXk4OC9saWtlc1wiLFxuICAgICAgICAgICAgICAgIFwicGhvdG9zXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2FyaWRsZXk4OC9waG90b3NcIixcbiAgICAgICAgICAgICAgICBcInBvcnRmb2xpb1wiOiBcImh0dHBzOi8vYXBpLnVuc3BsYXNoLmNvbS91c2Vycy9hcmlkbGV5ODgvcG9ydGZvbGlvXCIsXG4gICAgICAgICAgICAgICAgXCJzZWxmXCI6IFwiaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tL3VzZXJzL2FyaWRsZXk4OFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJsb2NhdGlvblwiOiBcIkxvbmRvbiwgVUtcIixcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkFuZHJldyBSaWRsZXlcIixcbiAgICAgICAgICAgIFwicG9ydGZvbGlvX3VybFwiOiBcImh0dHA6Ly93d3cuYXJpZGxleXBob3RvZ3JhcGh5LmNvbS9cIixcbiAgICAgICAgICAgIFwicHJvZmlsZV9pbWFnZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJsYXJnZVwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9wcm9maWxlLTE0ODQ0MTgyNTg3MzEtNjRhNjQ3YWY2ZTA4P2l4bGliPXJiLTAuMy41JnE9ODAmZm09anBnJmNyb3A9ZmFjZXMmY3M9dGlueXNyZ2ImZml0PWNyb3AmaD0xMjgmdz0xMjgmcz0xNjllMDI1MjAzNjQ3ZmZhODAyZmFkMTQ1OWRjYzMzYVwiLFxuICAgICAgICAgICAgICAgIFwibWVkaXVtXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Byb2ZpbGUtMTQ4NDQxODI1ODczMS02NGE2NDdhZjZlMDg/aXhsaWI9cmItMC4zLjUmcT04MCZmbT1qcGcmY3JvcD1mYWNlcyZjcz10aW55c3JnYiZmaXQ9Y3JvcCZoPTY0Jnc9NjQmcz0zMWNiZjNiNTUwNWE1YTg3YWU2OWMxM2NhMGQ2MGJmN1wiLFxuICAgICAgICAgICAgICAgIFwic21hbGxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcHJvZmlsZS0xNDg0NDE4MjU4NzMxLTY0YTY0N2FmNmUwOD9peGxpYj1yYi0wLjMuNSZxPTgwJmZtPWpwZyZjcm9wPWZhY2VzJmNzPXRpbnlzcmdiJmZpdD1jcm9wJmg9MzImdz0zMiZzPThlMDc4NzQ1MTM1MzBlOWFmMjlmMTRhMTQyMjZjZjBjXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInRvdGFsX2NvbGxlY3Rpb25zXCI6IDAsXG4gICAgICAgICAgICBcInRvdGFsX2xpa2VzXCI6IDM2LFxuICAgICAgICAgICAgXCJ0b3RhbF9waG90b3NcIjogMzMsXG4gICAgICAgICAgICBcInR3aXR0ZXJfdXNlcm5hbWVcIjogXCJhbmRyZXdyaWRsZXlcIixcbiAgICAgICAgICAgIFwidXBkYXRlZF9hdFwiOiBcIjIwMTctMDctMDFUMDU6NDk6MjctMDQ6MDBcIixcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogXCJhcmlkbGV5ODhcIlxuICAgICAgICB9LFxuICAgICAgICBcIndpZHRoXCI6IDQ0ODhcbiAgfVxuXVxuIiwibW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcblxuZnVuY3Rpb24gZGVib3VuY2UgKGZuLCB3YWl0KSB7XG4gIHZhciB0aW1lcjtcbiAgdmFyIGFyZ3M7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgIHdhaXQgPSAyNTA7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aW1lciAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICB0aW1lciA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH07XG59XG4iLCIhZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGZ1bmN0aW9uIFZOb2RlKCkge31cbiAgICBmdW5jdGlvbiBoKG5vZGVOYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBsYXN0U2ltcGxlLCBjaGlsZCwgc2ltcGxlLCBpLCBjaGlsZHJlbiA9IEVNUFRZX0NISUxEUkVOO1xuICAgICAgICBmb3IgKGkgPSBhcmd1bWVudHMubGVuZ3RoOyBpLS0gPiAyOyApIHN0YWNrLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMgJiYgbnVsbCAhPSBhdHRyaWJ1dGVzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoIXN0YWNrLmxlbmd0aCkgc3RhY2sucHVzaChhdHRyaWJ1dGVzLmNoaWxkcmVuKTtcbiAgICAgICAgICAgIGRlbGV0ZSBhdHRyaWJ1dGVzLmNoaWxkcmVuO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChzdGFjay5sZW5ndGgpIGlmICgoY2hpbGQgPSBzdGFjay5wb3AoKSkgJiYgdm9pZCAwICE9PSBjaGlsZC5wb3ApIGZvciAoaSA9IGNoaWxkLmxlbmd0aDsgaS0tOyApIHN0YWNrLnB1c2goY2hpbGRbaV0pOyBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjaGlsZCA9PT0gITAgfHwgY2hpbGQgPT09ICExKSBjaGlsZCA9IG51bGw7XG4gICAgICAgICAgICBpZiAoc2ltcGxlID0gJ2Z1bmN0aW9uJyAhPSB0eXBlb2Ygbm9kZU5hbWUpIGlmIChudWxsID09IGNoaWxkKSBjaGlsZCA9ICcnOyBlbHNlIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgY2hpbGQpIGNoaWxkID0gU3RyaW5nKGNoaWxkKTsgZWxzZSBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIGNoaWxkKSBzaW1wbGUgPSAhMTtcbiAgICAgICAgICAgIGlmIChzaW1wbGUgJiYgbGFzdFNpbXBsZSkgY2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoIC0gMV0gKz0gY2hpbGQ7IGVsc2UgaWYgKGNoaWxkcmVuID09PSBFTVBUWV9DSElMRFJFTikgY2hpbGRyZW4gPSBbIGNoaWxkIF07IGVsc2UgY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICAgICAgICBsYXN0U2ltcGxlID0gc2ltcGxlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwID0gbmV3IFZOb2RlKCk7XG4gICAgICAgIHAubm9kZU5hbWUgPSBub2RlTmFtZTtcbiAgICAgICAgcC5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICBwLmF0dHJpYnV0ZXMgPSBudWxsID09IGF0dHJpYnV0ZXMgPyB2b2lkIDAgOiBhdHRyaWJ1dGVzO1xuICAgICAgICBwLmtleSA9IG51bGwgPT0gYXR0cmlidXRlcyA/IHZvaWQgMCA6IGF0dHJpYnV0ZXMua2V5O1xuICAgICAgICBpZiAodm9pZCAwICE9PSBvcHRpb25zLnZub2RlKSBvcHRpb25zLnZub2RlKHApO1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZXh0ZW5kKG9iaiwgcHJvcHMpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBwcm9wcykgb2JqW2ldID0gcHJvcHNbaV07XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsb25lRWxlbWVudCh2bm9kZSwgcHJvcHMpIHtcbiAgICAgICAgcmV0dXJuIGgodm5vZGUubm9kZU5hbWUsIGV4dGVuZChleHRlbmQoe30sIHZub2RlLmF0dHJpYnV0ZXMpLCBwcm9wcyksIGFyZ3VtZW50cy5sZW5ndGggPiAyID8gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpIDogdm5vZGUuY2hpbGRyZW4pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlbnF1ZXVlUmVuZGVyKGNvbXBvbmVudCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX2QgJiYgKGNvbXBvbmVudC5fX2QgPSAhMCkgJiYgMSA9PSBpdGVtcy5wdXNoKGNvbXBvbmVudCkpIChvcHRpb25zLmRlYm91bmNlUmVuZGVyaW5nIHx8IHNldFRpbWVvdXQpKHJlcmVuZGVyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVyZW5kZXIoKSB7XG4gICAgICAgIHZhciBwLCBsaXN0ID0gaXRlbXM7XG4gICAgICAgIGl0ZW1zID0gW107XG4gICAgICAgIHdoaWxlIChwID0gbGlzdC5wb3AoKSkgaWYgKHAuX19kKSByZW5kZXJDb21wb25lbnQocCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzU2FtZU5vZGVUeXBlKG5vZGUsIHZub2RlLCBoeWRyYXRpbmcpIHtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHJldHVybiB2b2lkIDAgIT09IG5vZGUuc3BsaXRUZXh0O1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlLm5vZGVOYW1lKSByZXR1cm4gIW5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yICYmIGlzTmFtZWROb2RlKG5vZGUsIHZub2RlLm5vZGVOYW1lKTsgZWxzZSByZXR1cm4gaHlkcmF0aW5nIHx8IG5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNOYW1lZE5vZGUobm9kZSwgbm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuX19uID09PSBub2RlTmFtZSB8fCBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5vZGVQcm9wcyh2bm9kZSkge1xuICAgICAgICB2YXIgcHJvcHMgPSBleHRlbmQoe30sIHZub2RlLmF0dHJpYnV0ZXMpO1xuICAgICAgICBwcm9wcy5jaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0gdm5vZGUubm9kZU5hbWUuZGVmYXVsdFByb3BzO1xuICAgICAgICBpZiAodm9pZCAwICE9PSBkZWZhdWx0UHJvcHMpIGZvciAodmFyIGkgaW4gZGVmYXVsdFByb3BzKSBpZiAodm9pZCAwID09PSBwcm9wc1tpXSkgcHJvcHNbaV0gPSBkZWZhdWx0UHJvcHNbaV07XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTm9kZShub2RlTmFtZSwgaXNTdmcpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBpc1N2ZyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBub2RlTmFtZSkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcbiAgICAgICAgbm9kZS5fX24gPSBub2RlTmFtZTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldEFjY2Vzc29yKG5vZGUsIG5hbWUsIG9sZCwgdmFsdWUsIGlzU3ZnKSB7XG4gICAgICAgIGlmICgnY2xhc3NOYW1lJyA9PT0gbmFtZSkgbmFtZSA9ICdjbGFzcyc7XG4gICAgICAgIGlmICgna2V5JyA9PT0gbmFtZSkgOyBlbHNlIGlmICgncmVmJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKG9sZCkgb2xkKG51bGwpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB2YWx1ZShub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmICgnY2xhc3MnID09PSBuYW1lICYmICFpc1N2Zykgbm9kZS5jbGFzc05hbWUgPSB2YWx1ZSB8fCAnJzsgZWxzZSBpZiAoJ3N0eWxlJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2YgdmFsdWUgfHwgJ3N0cmluZycgPT0gdHlwZW9mIG9sZCkgbm9kZS5zdHlsZS5jc3NUZXh0ID0gdmFsdWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBvbGQpIGZvciAodmFyIGkgaW4gb2xkKSBpZiAoIShpIGluIHZhbHVlKSkgbm9kZS5zdHlsZVtpXSA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIG5vZGUuc3R5bGVbaV0gPSAnbnVtYmVyJyA9PSB0eXBlb2YgdmFsdWVbaV0gJiYgSVNfTk9OX0RJTUVOU0lPTkFMLnRlc3QoaSkgPT09ICExID8gdmFsdWVbaV0gKyAncHgnIDogdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSBub2RlLmlubmVySFRNTCA9IHZhbHVlLl9faHRtbCB8fCAnJztcbiAgICAgICAgfSBlbHNlIGlmICgnbycgPT0gbmFtZVswXSAmJiAnbicgPT0gbmFtZVsxXSkge1xuICAgICAgICAgICAgdmFyIHVzZUNhcHR1cmUgPSBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvQ2FwdHVyZSQvLCAnJykpO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9sZCkgbm9kZS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudFByb3h5LCB1c2VDYXB0dXJlKTtcbiAgICAgICAgICAgIChub2RlLl9fbCB8fCAobm9kZS5fX2wgPSB7fSkpW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2xpc3QnICE9PSBuYW1lICYmICd0eXBlJyAhPT0gbmFtZSAmJiAhaXNTdmcgJiYgbmFtZSBpbiBub2RlKSB7XG4gICAgICAgICAgICBzZXRQcm9wZXJ0eShub2RlLCBuYW1lLCBudWxsID09IHZhbHVlID8gJycgOiB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAobnVsbCA9PSB2YWx1ZSB8fCB2YWx1ZSA9PT0gITEpIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5zID0gaXNTdmcgJiYgbmFtZSAhPT0gKG5hbWUgPSBuYW1lLnJlcGxhY2UoL154bGlua1xcOj8vLCAnJykpO1xuICAgICAgICAgICAgaWYgKG51bGwgPT0gdmFsdWUgfHwgdmFsdWUgPT09ICExKSBpZiAobnMpIG5vZGUucmVtb3ZlQXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBuYW1lLnRvTG93ZXJDYXNlKCkpOyBlbHNlIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpOyBlbHNlIGlmICgnZnVuY3Rpb24nICE9IHR5cGVvZiB2YWx1ZSkgaWYgKG5zKSBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpLCB2YWx1ZSk7IGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldFByb3BlcnR5KG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBub2RlW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV2ZW50UHJveHkoZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2xbZS50eXBlXShvcHRpb25zLmV2ZW50ICYmIG9wdGlvbnMuZXZlbnQoZSkgfHwgZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZsdXNoTW91bnRzKCkge1xuICAgICAgICB2YXIgYztcbiAgICAgICAgd2hpbGUgKGMgPSBtb3VudHMucG9wKCkpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyTW91bnQpIG9wdGlvbnMuYWZ0ZXJNb3VudChjKTtcbiAgICAgICAgICAgIGlmIChjLmNvbXBvbmVudERpZE1vdW50KSBjLmNvbXBvbmVudERpZE1vdW50KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgcGFyZW50LCBjb21wb25lbnRSb290KSB7XG4gICAgICAgIGlmICghZGlmZkxldmVsKyspIHtcbiAgICAgICAgICAgIGlzU3ZnTW9kZSA9IG51bGwgIT0gcGFyZW50ICYmIHZvaWQgMCAhPT0gcGFyZW50Lm93bmVyU1ZHRWxlbWVudDtcbiAgICAgICAgICAgIGh5ZHJhdGluZyA9IG51bGwgIT0gZG9tICYmICEoJ19fcHJlYWN0YXR0cl8nIGluIGRvbSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IGlkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBjb21wb25lbnRSb290KTtcbiAgICAgICAgaWYgKHBhcmVudCAmJiByZXQucGFyZW50Tm9kZSAhPT0gcGFyZW50KSBwYXJlbnQuYXBwZW5kQ2hpbGQocmV0KTtcbiAgICAgICAgaWYgKCEtLWRpZmZMZXZlbCkge1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gITE7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudFJvb3QpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpIHtcbiAgICAgICAgdmFyIG91dCA9IGRvbSwgcHJldlN2Z01vZGUgPSBpc1N2Z01vZGU7XG4gICAgICAgIGlmIChudWxsID09IHZub2RlKSB2bm9kZSA9ICcnO1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlKSB7XG4gICAgICAgICAgICBpZiAoZG9tICYmIHZvaWQgMCAhPT0gZG9tLnNwbGl0VGV4dCAmJiBkb20ucGFyZW50Tm9kZSAmJiAoIWRvbS5fY29tcG9uZW50IHx8IGNvbXBvbmVudFJvb3QpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVmFsdWUgIT0gdm5vZGUpIGRvbS5ub2RlVmFsdWUgPSB2bm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodm5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShkb20sICEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQuX19wcmVhY3RhdHRyXyA9ICEwO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygdm5vZGUubm9kZU5hbWUpIHJldHVybiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgIGlzU3ZnTW9kZSA9ICdzdmcnID09PSB2bm9kZS5ub2RlTmFtZSA/ICEwIDogJ2ZvcmVpZ25PYmplY3QnID09PSB2bm9kZS5ub2RlTmFtZSA/ICExIDogaXNTdmdNb2RlO1xuICAgICAgICBpZiAoIWRvbSB8fCAhaXNOYW1lZE5vZGUoZG9tLCBTdHJpbmcodm5vZGUubm9kZU5hbWUpKSkge1xuICAgICAgICAgICAgb3V0ID0gY3JlYXRlTm9kZShTdHJpbmcodm5vZGUubm9kZU5hbWUpLCBpc1N2Z01vZGUpO1xuICAgICAgICAgICAgaWYgKGRvbSkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChkb20uZmlyc3RDaGlsZCkgb3V0LmFwcGVuZENoaWxkKGRvbS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLnBhcmVudE5vZGUpIGRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChvdXQsIGRvbSk7XG4gICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoZG9tLCAhMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZjID0gb3V0LmZpcnN0Q2hpbGQsIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8gfHwgKG91dC5fX3ByZWFjdGF0dHJfID0ge30pLCB2Y2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKCFoeWRyYXRpbmcgJiYgdmNoaWxkcmVuICYmIDEgPT09IHZjaGlsZHJlbi5sZW5ndGggJiYgJ3N0cmluZycgPT0gdHlwZW9mIHZjaGlsZHJlblswXSAmJiBudWxsICE9IGZjICYmIHZvaWQgMCAhPT0gZmMuc3BsaXRUZXh0ICYmIG51bGwgPT0gZmMubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIGlmIChmYy5ub2RlVmFsdWUgIT0gdmNoaWxkcmVuWzBdKSBmYy5ub2RlVmFsdWUgPSB2Y2hpbGRyZW5bMF07XG4gICAgICAgIH0gZWxzZSBpZiAodmNoaWxkcmVuICYmIHZjaGlsZHJlbi5sZW5ndGggfHwgbnVsbCAhPSBmYykgaW5uZXJEaWZmTm9kZShvdXQsIHZjaGlsZHJlbiwgY29udGV4dCwgbW91bnRBbGwsIGh5ZHJhdGluZyB8fCBudWxsICE9IHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKTtcbiAgICAgICAgZGlmZkF0dHJpYnV0ZXMob3V0LCB2bm9kZS5hdHRyaWJ1dGVzLCBwcm9wcyk7XG4gICAgICAgIGlzU3ZnTW9kZSA9IHByZXZTdmdNb2RlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbm5lckRpZmZOb2RlKGRvbSwgdmNoaWxkcmVuLCBjb250ZXh0LCBtb3VudEFsbCwgaXNIeWRyYXRpbmcpIHtcbiAgICAgICAgdmFyIGosIGMsIHZjaGlsZCwgY2hpbGQsIG9yaWdpbmFsQ2hpbGRyZW4gPSBkb20uY2hpbGROb2RlcywgY2hpbGRyZW4gPSBbXSwga2V5ZWQgPSB7fSwga2V5ZWRMZW4gPSAwLCBtaW4gPSAwLCBsZW4gPSBvcmlnaW5hbENoaWxkcmVuLmxlbmd0aCwgY2hpbGRyZW5MZW4gPSAwLCB2bGVuID0gdmNoaWxkcmVuID8gdmNoaWxkcmVuLmxlbmd0aCA6IDA7XG4gICAgICAgIGlmICgwICE9PSBsZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBfY2hpbGQgPSBvcmlnaW5hbENoaWxkcmVuW2ldLCBwcm9wcyA9IF9jaGlsZC5fX3ByZWFjdGF0dHJfLCBrZXkgPSB2bGVuICYmIHByb3BzID8gX2NoaWxkLl9jb21wb25lbnQgPyBfY2hpbGQuX2NvbXBvbmVudC5fX2sgOiBwcm9wcy5rZXkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAga2V5ZWRMZW4rKztcbiAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gX2NoaWxkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcyB8fCAodm9pZCAwICE9PSBfY2hpbGQuc3BsaXRUZXh0ID8gaXNIeWRyYXRpbmcgPyBfY2hpbGQubm9kZVZhbHVlLnRyaW0oKSA6ICEwIDogaXNIeWRyYXRpbmcpKSBjaGlsZHJlbltjaGlsZHJlbkxlbisrXSA9IF9jaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoMCAhPT0gdmxlbikgZm9yICh2YXIgaSA9IDA7IGkgPCB2bGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZjaGlsZCA9IHZjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBrZXkgPSB2Y2hpbGQua2V5O1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleWVkTGVuICYmIHZvaWQgMCAhPT0ga2V5ZWRba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGtleWVkW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGtleWVkW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGtleWVkTGVuLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghY2hpbGQgJiYgbWluIDwgY2hpbGRyZW5MZW4pIGZvciAoaiA9IG1pbjsgaiA8IGNoaWxkcmVuTGVuOyBqKyspIGlmICh2b2lkIDAgIT09IGNoaWxkcmVuW2pdICYmIGlzU2FtZU5vZGVUeXBlKGMgPSBjaGlsZHJlbltqXSwgdmNoaWxkLCBpc0h5ZHJhdGluZykpIHtcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGM7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bal0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGNoaWxkcmVuTGVuIC0gMSkgY2hpbGRyZW5MZW4tLTtcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gbWluKSBtaW4rKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoaWxkID0gaWRpZmYoY2hpbGQsIHZjaGlsZCwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgaWYgKGNoaWxkICYmIGNoaWxkICE9PSBkb20pIGlmIChpID49IGxlbikgZG9tLmFwcGVuZENoaWxkKGNoaWxkKTsgZWxzZSBpZiAoY2hpbGQgIT09IG9yaWdpbmFsQ2hpbGRyZW5baV0pIGlmIChjaGlsZCA9PT0gb3JpZ2luYWxDaGlsZHJlbltpICsgMV0pIHJlbW92ZU5vZGUob3JpZ2luYWxDaGlsZHJlbltpXSk7IGVsc2UgZG9tLmluc2VydEJlZm9yZShjaGlsZCwgb3JpZ2luYWxDaGlsZHJlbltpXSB8fCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ZWRMZW4pIGZvciAodmFyIGkgaW4ga2V5ZWQpIGlmICh2b2lkIDAgIT09IGtleWVkW2ldKSByZWNvbGxlY3ROb2RlVHJlZShrZXllZFtpXSwgITEpO1xuICAgICAgICB3aGlsZSAobWluIDw9IGNoaWxkcmVuTGVuKSBpZiAodm9pZCAwICE9PSAoY2hpbGQgPSBjaGlsZHJlbltjaGlsZHJlbkxlbi0tXSkpIHJlY29sbGVjdE5vZGVUcmVlKGNoaWxkLCAhMSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsIHVubW91bnRPbmx5KSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBub2RlLl9jb21wb25lbnQ7XG4gICAgICAgIGlmIChjb21wb25lbnQpIHVubW91bnRDb21wb25lbnQoY29tcG9uZW50KTsgZWxzZSB7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBub2RlLl9fcHJlYWN0YXR0cl8gJiYgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZikgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgICAgIGlmICh1bm1vdW50T25seSA9PT0gITEgfHwgbnVsbCA9PSBub2RlLl9fcHJlYWN0YXR0cl8pIHJlbW92ZU5vZGUobm9kZSk7XG4gICAgICAgICAgICByZW1vdmVDaGlsZHJlbihub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmxhc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBuZXh0ID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShub2RlLCAhMCk7XG4gICAgICAgICAgICBub2RlID0gbmV4dDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBkaWZmQXR0cmlidXRlcyhkb20sIGF0dHJzLCBvbGQpIHtcbiAgICAgICAgdmFyIG5hbWU7XG4gICAgICAgIGZvciAobmFtZSBpbiBvbGQpIGlmICgoIWF0dHJzIHx8IG51bGwgPT0gYXR0cnNbbmFtZV0pICYmIG51bGwgIT0gb2xkW25hbWVdKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gdm9pZCAwLCBpc1N2Z01vZGUpO1xuICAgICAgICBmb3IgKG5hbWUgaW4gYXR0cnMpIGlmICghKCdjaGlsZHJlbicgPT09IG5hbWUgfHwgJ2lubmVySFRNTCcgPT09IG5hbWUgfHwgbmFtZSBpbiBvbGQgJiYgYXR0cnNbbmFtZV0gPT09ICgndmFsdWUnID09PSBuYW1lIHx8ICdjaGVja2VkJyA9PT0gbmFtZSA/IGRvbVtuYW1lXSA6IG9sZFtuYW1lXSkpKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gYXR0cnNbbmFtZV0sIGlzU3ZnTW9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbGxlY3RDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgICAgIHZhciBuYW1lID0gY29tcG9uZW50LmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIChjb21wb25lbnRzW25hbWVdIHx8IChjb21wb25lbnRzW25hbWVdID0gW10pKS5wdXNoKGNvbXBvbmVudCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChDdG9yLCBwcm9wcywgY29udGV4dCkge1xuICAgICAgICB2YXIgaW5zdCwgbGlzdCA9IGNvbXBvbmVudHNbQ3Rvci5uYW1lXTtcbiAgICAgICAgaWYgKEN0b3IucHJvdG90eXBlICYmIEN0b3IucHJvdG90eXBlLnJlbmRlcikge1xuICAgICAgICAgICAgaW5zdCA9IG5ldyBDdG9yKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIENvbXBvbmVudC5jYWxsKGluc3QsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGluc3QuY29uc3RydWN0b3IgPSBDdG9yO1xuICAgICAgICAgICAgaW5zdC5yZW5kZXIgPSBkb1JlbmRlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGlzdCkgZm9yICh2YXIgaSA9IGxpc3QubGVuZ3RoOyBpLS07ICkgaWYgKGxpc3RbaV0uY29uc3RydWN0b3IgPT09IEN0b3IpIHtcbiAgICAgICAgICAgIGluc3QuX19iID0gbGlzdFtpXS5fX2I7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBkb1JlbmRlcihwcm9wcywgc3RhdGUsIGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRDb21wb25lbnRQcm9wcyhjb21wb25lbnQsIHByb3BzLCBvcHRzLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3gpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19yID0gcHJvcHMucmVmKSBkZWxldGUgcHJvcHMucmVmO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fX2sgPSBwcm9wcy5rZXkpIGRlbGV0ZSBwcm9wcy5rZXk7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5iYXNlIHx8IG1vdW50QWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0ICYmIGNvbnRleHQgIT09IGNvbXBvbmVudC5jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuX19jKSBjb21wb25lbnQuX19jID0gY29tcG9uZW50LmNvbnRleHQ7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuX19wKSBjb21wb25lbnQuX19wID0gY29tcG9uZW50LnByb3BzO1xuICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICBjb21wb25lbnQuX194ID0gITE7XG4gICAgICAgICAgICBpZiAoMCAhPT0gb3B0cykgaWYgKDEgPT09IG9wdHMgfHwgb3B0aW9ucy5zeW5jQ29tcG9uZW50VXBkYXRlcyAhPT0gITEgfHwgIWNvbXBvbmVudC5iYXNlKSByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCAxLCBtb3VudEFsbCk7IGVsc2UgZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fX3IpIGNvbXBvbmVudC5fX3IoY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCBvcHRzLCBtb3VudEFsbCwgaXNDaGlsZCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3gpIHtcbiAgICAgICAgICAgIHZhciByZW5kZXJlZCwgaW5zdCwgY2Jhc2UsIHByb3BzID0gY29tcG9uZW50LnByb3BzLCBzdGF0ZSA9IGNvbXBvbmVudC5zdGF0ZSwgY29udGV4dCA9IGNvbXBvbmVudC5jb250ZXh0LCBwcmV2aW91c1Byb3BzID0gY29tcG9uZW50Ll9fcCB8fCBwcm9wcywgcHJldmlvdXNTdGF0ZSA9IGNvbXBvbmVudC5fX3MgfHwgc3RhdGUsIHByZXZpb3VzQ29udGV4dCA9IGNvbXBvbmVudC5fX2MgfHwgY29udGV4dCwgaXNVcGRhdGUgPSBjb21wb25lbnQuYmFzZSwgbmV4dEJhc2UgPSBjb21wb25lbnQuX19iLCBpbml0aWFsQmFzZSA9IGlzVXBkYXRlIHx8IG5leHRCYXNlLCBpbml0aWFsQ2hpbGRDb21wb25lbnQgPSBjb21wb25lbnQuX2NvbXBvbmVudCwgc2tpcCA9ICExO1xuICAgICAgICAgICAgaWYgKGlzVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJldmlvdXNQcm9wcztcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3RhdGUgPSBwcmV2aW91c1N0YXRlO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gcHJldmlvdXNDb250ZXh0O1xuICAgICAgICAgICAgICAgIGlmICgyICE9PSBvcHRzICYmIGNvbXBvbmVudC5zaG91bGRDb21wb25lbnRVcGRhdGUgJiYgY29tcG9uZW50LnNob3VsZENvbXBvbmVudFVwZGF0ZShwcm9wcywgc3RhdGUsIGNvbnRleHQpID09PSAhMSkgc2tpcCA9ICEwOyBlbHNlIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbFVwZGF0ZSkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxVcGRhdGUocHJvcHMsIHN0YXRlLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21wb25lbnQuX19wID0gY29tcG9uZW50Ll9fcyA9IGNvbXBvbmVudC5fX2MgPSBjb21wb25lbnQuX19iID0gbnVsbDtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX2QgPSAhMTtcbiAgICAgICAgICAgIGlmICghc2tpcCkge1xuICAgICAgICAgICAgICAgIHJlbmRlcmVkID0gY29tcG9uZW50LnJlbmRlcihwcm9wcywgc3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KSBjb250ZXh0ID0gZXh0ZW5kKGV4dGVuZCh7fSwgY29udGV4dCksIGNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQoKSk7XG4gICAgICAgICAgICAgICAgdmFyIHRvVW5tb3VudCwgYmFzZSwgY2hpbGRDb21wb25lbnQgPSByZW5kZXJlZCAmJiByZW5kZXJlZC5ub2RlTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgY2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkUHJvcHMgPSBnZXROb2RlUHJvcHMocmVuZGVyZWQpO1xuICAgICAgICAgICAgICAgICAgICBpbnN0ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdCAmJiBpbnN0LmNvbnN0cnVjdG9yID09PSBjaGlsZENvbXBvbmVudCAmJiBjaGlsZFByb3BzLmtleSA9PSBpbnN0Ll9faykgc2V0Q29tcG9uZW50UHJvcHMoaW5zdCwgY2hpbGRQcm9wcywgMSwgY29udGV4dCwgITEpOyBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvVW5tb3VudCA9IGluc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuX2NvbXBvbmVudCA9IGluc3QgPSBjcmVhdGVDb21wb25lbnQoY2hpbGRDb21wb25lbnQsIGNoaWxkUHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdC5fX2IgPSBpbnN0Ll9fYiB8fCBuZXh0QmFzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QuX191ID0gY29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoaW5zdCwgY2hpbGRQcm9wcywgMCwgY29udGV4dCwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcG9uZW50KGluc3QsIDEsIG1vdW50QWxsLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYmFzZSA9IGluc3QuYmFzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYmFzZSA9IGluaXRpYWxCYXNlO1xuICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbml0aWFsQ2hpbGRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b1VubW91bnQpIGNiYXNlID0gY29tcG9uZW50Ll9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEJhc2UgfHwgMSA9PT0gb3B0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNiYXNlKSBjYmFzZS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2UgPSBkaWZmKGNiYXNlLCByZW5kZXJlZCwgY29udGV4dCwgbW91bnRBbGwgfHwgIWlzVXBkYXRlLCBpbml0aWFsQmFzZSAmJiBpbml0aWFsQmFzZS5wYXJlbnROb2RlLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxCYXNlICYmIGJhc2UgIT09IGluaXRpYWxCYXNlICYmIGluc3QgIT09IGluaXRpYWxDaGlsZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmFzZVBhcmVudCA9IGluaXRpYWxCYXNlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYXNlUGFyZW50ICYmIGJhc2UgIT09IGJhc2VQYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VQYXJlbnQucmVwbGFjZUNoaWxkKGJhc2UsIGluaXRpYWxCYXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdG9Vbm1vdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbEJhc2UuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoaW5pdGlhbEJhc2UsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodG9Vbm1vdW50KSB1bm1vdW50Q29tcG9uZW50KHRvVW5tb3VudCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmJhc2UgPSBiYXNlO1xuICAgICAgICAgICAgICAgIGlmIChiYXNlICYmICFpc0NoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnRSZWYgPSBjb21wb25lbnQsIHQgPSBjb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0ID0gdC5fX3UpIChjb21wb25lbnRSZWYgPSB0KS5iYXNlID0gYmFzZTtcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50ID0gY29tcG9uZW50UmVmO1xuICAgICAgICAgICAgICAgICAgICBiYXNlLl9jb21wb25lbnRDb25zdHJ1Y3RvciA9IGNvbXBvbmVudFJlZi5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzVXBkYXRlIHx8IG1vdW50QWxsKSBtb3VudHMudW5zaGlmdChjb21wb25lbnQpOyBlbHNlIGlmICghc2tpcCkge1xuICAgICAgICAgICAgICAgIGZsdXNoTW91bnRzKCk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnREaWRVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnREaWRVcGRhdGUocHJldmlvdXNQcm9wcywgcHJldmlvdXNTdGF0ZSwgcHJldmlvdXNDb250ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5hZnRlclVwZGF0ZSkgb3B0aW9ucy5hZnRlclVwZGF0ZShjb21wb25lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG51bGwgIT0gY29tcG9uZW50Ll9faCkgd2hpbGUgKGNvbXBvbmVudC5fX2gubGVuZ3RoKSBjb21wb25lbnQuX19oLnBvcCgpLmNhbGwoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmICghZGlmZkxldmVsICYmICFpc0NoaWxkKSBmbHVzaE1vdW50cygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkQ29tcG9uZW50RnJvbVZOb2RlKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsKSB7XG4gICAgICAgIHZhciBjID0gZG9tICYmIGRvbS5fY29tcG9uZW50LCBvcmlnaW5hbENvbXBvbmVudCA9IGMsIG9sZERvbSA9IGRvbSwgaXNEaXJlY3RPd25lciA9IGMgJiYgZG9tLl9jb21wb25lbnRDb25zdHJ1Y3RvciA9PT0gdm5vZGUubm9kZU5hbWUsIGlzT3duZXIgPSBpc0RpcmVjdE93bmVyLCBwcm9wcyA9IGdldE5vZGVQcm9wcyh2bm9kZSk7XG4gICAgICAgIHdoaWxlIChjICYmICFpc093bmVyICYmIChjID0gYy5fX3UpKSBpc093bmVyID0gYy5jb25zdHJ1Y3RvciA9PT0gdm5vZGUubm9kZU5hbWU7XG4gICAgICAgIGlmIChjICYmIGlzT3duZXIgJiYgKCFtb3VudEFsbCB8fCBjLl9jb21wb25lbnQpKSB7XG4gICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhjLCBwcm9wcywgMywgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZG9tID0gYy5iYXNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG9yaWdpbmFsQ29tcG9uZW50ICYmICFpc0RpcmVjdE93bmVyKSB7XG4gICAgICAgICAgICAgICAgdW5tb3VudENvbXBvbmVudChvcmlnaW5hbENvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgZG9tID0gb2xkRG9tID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGMgPSBjcmVhdGVDb21wb25lbnQodm5vZGUubm9kZU5hbWUsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChkb20gJiYgIWMuX19iKSB7XG4gICAgICAgICAgICAgICAgYy5fX2IgPSBkb207XG4gICAgICAgICAgICAgICAgb2xkRG9tID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCAxLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBkb20gPSBjLmJhc2U7XG4gICAgICAgICAgICBpZiAob2xkRG9tICYmIGRvbSAhPT0gb2xkRG9tKSB7XG4gICAgICAgICAgICAgICAgb2xkRG9tLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKG9sZERvbSwgITEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb207XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVubW91bnRDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgICAgIGlmIChvcHRpb25zLmJlZm9yZVVubW91bnQpIG9wdGlvbnMuYmVmb3JlVW5tb3VudChjb21wb25lbnQpO1xuICAgICAgICB2YXIgYmFzZSA9IGNvbXBvbmVudC5iYXNlO1xuICAgICAgICBjb21wb25lbnQuX194ID0gITA7XG4gICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgICAgICBjb21wb25lbnQuYmFzZSA9IG51bGw7XG4gICAgICAgIHZhciBpbm5lciA9IGNvbXBvbmVudC5fY29tcG9uZW50O1xuICAgICAgICBpZiAoaW5uZXIpIHVubW91bnRDb21wb25lbnQoaW5uZXIpOyBlbHNlIGlmIChiYXNlKSB7XG4gICAgICAgICAgICBpZiAoYmFzZS5fX3ByZWFjdGF0dHJfICYmIGJhc2UuX19wcmVhY3RhdHRyXy5yZWYpIGJhc2UuX19wcmVhY3RhdHRyXy5yZWYobnVsbCk7XG4gICAgICAgICAgICBjb21wb25lbnQuX19iID0gYmFzZTtcbiAgICAgICAgICAgIHJlbW92ZU5vZGUoYmFzZSk7XG4gICAgICAgICAgICBjb2xsZWN0Q29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgICAgICByZW1vdmVDaGlsZHJlbihiYXNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcG9uZW50Ll9fcikgY29tcG9uZW50Ll9fcihudWxsKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuX19kID0gITA7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbmRlcih2bm9kZSwgcGFyZW50LCBtZXJnZSkge1xuICAgICAgICByZXR1cm4gZGlmZihtZXJnZSwgdm5vZGUsIHt9LCAhMSwgcGFyZW50LCAhMSk7XG4gICAgfVxuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdmFyIHN0YWNrID0gW107XG4gICAgdmFyIEVNUFRZX0NISUxEUkVOID0gW107XG4gICAgdmFyIElTX05PTl9ESU1FTlNJT05BTCA9IC9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHZhciBtb3VudHMgPSBbXTtcbiAgICB2YXIgZGlmZkxldmVsID0gMDtcbiAgICB2YXIgaXNTdmdNb2RlID0gITE7XG4gICAgdmFyIGh5ZHJhdGluZyA9ICExO1xuICAgIHZhciBjb21wb25lbnRzID0ge307XG4gICAgZXh0ZW5kKENvbXBvbmVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgc2V0U3RhdGU6IGZ1bmN0aW9uKHN0YXRlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLnN0YXRlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9fcykgdGhpcy5fX3MgPSBleHRlbmQoe30sIHMpO1xuICAgICAgICAgICAgZXh0ZW5kKHMsICdmdW5jdGlvbicgPT0gdHlwZW9mIHN0YXRlID8gc3RhdGUocywgdGhpcy5wcm9wcykgOiBzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spICh0aGlzLl9faCA9IHRoaXMuX19oIHx8IFtdKS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGVucXVldWVSZW5kZXIodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcmNlVXBkYXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSAodGhpcy5fX2ggPSB0aGlzLl9faCB8fCBbXSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICByZW5kZXJDb21wb25lbnQodGhpcywgMik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBwcmVhY3QgPSB7XG4gICAgICAgIGg6IGgsXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQ6IGgsXG4gICAgICAgIGNsb25lRWxlbWVudDogY2xvbmVFbGVtZW50LFxuICAgICAgICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgICAgICAgcmVuZGVyOiByZW5kZXIsXG4gICAgICAgIHJlcmVuZGVyOiByZXJlbmRlcixcbiAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgIH07XG4gICAgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiBtb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gcHJlYWN0OyBlbHNlIHNlbGYucHJlYWN0ID0gcHJlYWN0O1xufSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0LmpzLm1hcCJdfQ==
