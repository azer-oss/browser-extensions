(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
module.exports={
  "host": "https://getkozmos.com"
}

},{}],3:[function(require,module,exports){
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
        callback({ error: new Error('Message response timeout (' + timeoutSecs + ')s.') });
      }
    }
  }]);

  return Messaging;
}();

exports.default = Messaging;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require("./rows");

var _rows2 = _interopRequireDefault(_rows);

var _debounceFn = require("debounce-fn");

var _debounceFn2 = _interopRequireDefault(_debounceFn);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OFFLINE_RESULTS_THRESHOLD = 4;

var Autocomplete = function (_Rows) {
  _inherits(Autocomplete, _Rows);

  function Autocomplete(results, sort) {
    _classCallCheck(this, Autocomplete);

    var _this = _possibleConstructorReturn(this, (Autocomplete.__proto__ || Object.getPrototypeOf(Autocomplete)).call(this, results, sort));

    _this.name = "autocomplete-bookmarks";
    _this.title = "Bookmarks";
    _this.showMoreButton = true;
    _this.update = (0, _debounceFn2.default)(_this.fetch.bind(_this), 150);
    return _this;
  }

  _createClass(Autocomplete, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return query.length > 0 && query.indexOf("tag:") === -1;
    }
  }, {
    key: "fetch",
    value: function fetch(query) {
      var _this2 = this;

      var oquery = query || this.results.props.query;
      var addedAlready = {};

      this.results.messages.send({ task: "autocomplete", query: query }, function (resp) {
        if (oquery !== _this2.results.props.query.trim()) {
          return;
        }

        if (resp.error) return _this2.fail(resp.error);

        resp.content.forEach(function (row) {
          return addedAlready[row.url] = true;
        });

        _this2.add(_this2.addMoreButton(resp.content, {
          title: "More results for \"" + oquery + "\"",
          url: _config2.default.host + "/search?q=" + oquery
        }));

        if (resp.content.length >= OFFLINE_RESULTS_THRESHOLD) {
          return;
        }

        _this2.results.messages.send({ task: "search-bookmarks", query: query }, function (resp) {
          if (oquery !== _this2.results.props.query.trim()) {
            return;
          }

          if (resp.error) return _this2.fail(resp.error);

          var content = resp.content.filter(function (row) {
            return !addedAlready[row.url];
          });

          _this2.add(_this2.addMoreButton(content, {
            title: "More results for \"" + oquery + "\"",
            url: _config2.default.host + "/search?q=" + oquery
          }));
        });
      });
    }
  }]);

  return Autocomplete;
}(_rows2.default);

exports.default = Autocomplete;

},{"../config":2,"./rows":19,"debounce-fn":31}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require("./rows");

var _rows2 = _interopRequireDefault(_rows);

var _debounceFn = require("debounce-fn");

var _debounceFn2 = _interopRequireDefault(_debounceFn);

var _urls = require("urls");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AutocompleteTopSites = function (_Rows) {
  _inherits(AutocompleteTopSites, _Rows);

  function AutocompleteTopSites(results, sort) {
    _classCallCheck(this, AutocompleteTopSites);

    var _this = _possibleConstructorReturn(this, (AutocompleteTopSites.__proto__ || Object.getPrototypeOf(AutocompleteTopSites)).call(this, results, sort));

    _this.name = "autocomplete-top-sites";
    _this.title = "Frequently Visited";
    _this.update = (0, _debounceFn2.default)(_this.fetch.bind(_this), 150);
    return _this;
  }

  _createClass(AutocompleteTopSites, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return query.length > 0;
    }
  }, {
    key: "fetch",
    value: function fetch(query) {
      var _this2 = this;

      var result = [];

      chrome.topSites.get(function (topSites) {
        var i = -1;
        var len = topSites.length;
        while (++i < len) {
          if ((0, _urls.clean)(topSites[i].url).indexOf(query) === 0 || topSites[i].title.toLowerCase().indexOf(query) > -1) {
            result.push(topSites[i]);
          }
        }

        _this2.add(result);
      });
    }
  }]);

  return AutocompleteTopSites;
}(_rows2.default);

exports.default = AutocompleteTopSites;

},{"./rows":19,"debounce-fn":31,"urls":51}],6:[function(require,module,exports){
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

    _this.name = "bookmark-search";
    _this.title = "Liked in Kozmos";

    _this.update = (0, _debounceFn2.default)(_this._update.bind(_this), 250);
    return _this;
  }

  _createClass(BookmarkSearch, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return query && query.length > 1 && (query.indexOf("tag:") !== 0 || query.length < 5);
    }
  }, {
    key: "_update",
    value: function _update(query) {
      var _this2 = this;

      var oquery = query || this.results.props.query;

      this.results.messages.send({ task: "search-bookmarks", query: query }, function (resp) {
        if (oquery !== _this2.results.props.query.trim()) {
          return;
        }

        if (resp.error) return _this2.fail(resp.error);

        _this2.add(resp.content);
      });
    }
  }]);

  return BookmarkSearch;
}(_rows2.default);

exports.default = BookmarkSearch;

},{"./rows":19,"debounce-fn":31}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require("./rows");

var _rows2 = _interopRequireDefault(_rows);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListBookmarksByTag = function (_Rows) {
  _inherits(ListBookmarksByTag, _Rows);

  function ListBookmarksByTag(results, sort) {
    _classCallCheck(this, ListBookmarksByTag);

    var _this = _possibleConstructorReturn(this, (ListBookmarksByTag.__proto__ || Object.getPrototypeOf(ListBookmarksByTag)).call(this, results, sort));

    _this.name = "bookmarks-by-tag";
    _this.title = function (query) {
      return "Bookmarks Tagged With \"" + query.slice(4) + "\"";
    };
    return _this;
  }

  _createClass(ListBookmarksByTag, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return query && query.indexOf("tag:") === 0 && query.length > 4;
    }
  }, {
    key: "update",
    value: function update(query) {
      var _this2 = this;

      var oquery = query || this.results.props.query;
      var tag = oquery.slice(4);

      this.results.messages.send({ task: "get-bookmarks-by-tag", tag: tag }, function (resp) {
        if (oquery !== _this2.results.props.query.trim()) {
          return;
        }

        if (resp.error) return _this2.fail(resp.error);

        var content = resp.content.length > 4 ? _this2.addMoreButton(resp.content, {
          title: "More tagged with \"" + tag + "\"",
          url: _config2.default.host + "/tag/" + tag
        }) : content;

        _this2.add(content);
      });
    }
  }]);

  return ListBookmarksByTag;
}(_rows2.default);

exports.default = ListBookmarksByTag;

},{"../config":2,"./rows":19}],8:[function(require,module,exports){
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

},{"preact":35}],9:[function(require,module,exports){
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

},{"preact":35}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require("./rows");

var _rows2 = _interopRequireDefault(_rows);

var _urlImage = require("./url-image");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var History = function (_Rows) {
  _inherits(History, _Rows);

  function History(results, sort) {
    _classCallCheck(this, History);

    var _this = _possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).call(this, results, sort));

    _this.name = "history";
    _this.title = "History";
    return _this;
  }

  _createClass(History, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return query.length > 1 && query.trim().length > 1;
    }
  }, {
    key: "update",
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
  return (0, _urlImage.findHostname)(row.url).split(".")[0] !== "google" && !/search\/?\?q\=\w*/.test(row.url) && !/facebook\.com\/search/.test(row.url) && !/twitter\.com\/search/.test(row.url) && (0, _urlImage.findHostname)(row.url) !== "t.co";
}

},{"./rows":19,"./url-image":28}],11:[function(require,module,exports){
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

},{"preact":35}],12:[function(require,module,exports){
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

},{"preact":35}],13:[function(require,module,exports){
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

},{"preact":35}],14:[function(require,module,exports){
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

},{"../lib/messaging":3}],15:[function(require,module,exports){
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

},{"./logo":12,"./menu":13,"./messaging":14,"./search":21,"./settings":22,"./wallpaper":29,"preact":35}],16:[function(require,module,exports){
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

    _this.name = "query-suggestions";
    _this.pinned = true;
    return _this;
  }

  _createClass(QuerySuggestions, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return isURL(query);
      // return query.length > 1 && query.trim().length > 1
    }
  }, {
    key: "createURLSuggestions",
    value: function createURLSuggestions(query) {
      if (!isURL(query)) return [];

      var url = /\w+:\/\//.test(query) ? query : "http://" + query;

      return [{
        title: "Open \"" + (0, _titleFromUrl2.default)(query) + "\"",
        type: "query-suggestion",
        url: url
      }];
    }
  }, {
    key: "createSearchSuggestions",
    value: function createSearchSuggestions(query) {
      if (isURL(query)) return [];
      if (query.indexOf("tag:") === 0 && query.length > 4) return [{
        url: "https://getkozmos.com/tag/" + encodeURI(query.slice(4)),
        query: query,
        title: "Open \"" + query.slice(4) + "\" tag in Kozmos",
        type: "search-query"
      }];

      return [
      /*{
        url: 'https://google.com/search?q=' + encodeURI(query),
        query: query,
        title: `Search "${query}" on Google`,
        type: 'search-query'
      },*/
      {
        url: "https://getkozmos.com/search?q=" + encodeURI(query),
        query: query,
        title: "Search \"" + query + "\" on Kozmos",
        type: "search-query"
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
  return query.trim().indexOf(".") > 0 && query.indexOf(" ") === -1;
}

},{"./rows":19,"title-from-url":45}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require("./rows");

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

    _this.name = "recent-bookmarks";
    _this.title = "Recently Bookmarked";
    return _this;
  }

  _createClass(RecentBookmarks, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return query.length === 0;
    }
  }, {
    key: "fail",
    value: function fail(err) {
      console.error(err);
    }
  }, {
    key: "update",
    value: function update(query) {
      var _this2 = this;

      this.results.messages.send({ task: "get-recent-bookmarks", query: query }, function (resp) {
        if (resp.error) return _this2.fail(resp.error);

        _this2.add(resp.content);
      });
    }
  }]);

  return RecentBookmarks;
}(_rows2.default);

exports.default = RecentBookmarks;

},{"./rows":19}],18:[function(require,module,exports){
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

var _autocompleteBookmarks = require("./autocomplete-bookmarks");

var _autocompleteBookmarks2 = _interopRequireDefault(_autocompleteBookmarks);

var _autocompleteTopSites = require("./autocomplete-top-sites");

var _autocompleteTopSites2 = _interopRequireDefault(_autocompleteTopSites);

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
    _this._onKeyPress = (0, _debounceFn2.default)(_this.onKeyPress.bind(_this), 50);

    _this.setCategories(props);
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
      var categories = [new _querySuggestions2.default(this, 1), new _autocompleteTopSites2.default(this, 2), new _autocompleteBookmarks2.default(this, 3), new _topSites2.default(this, props.recentBookmarksFirst ? 5 : 4), new _recentBookmarks2.default(this, props.recentBookmarksFirst ? 4 : 5), new _bookmarkTags2.default(this, 6),
      //new BookmarkSearch(this, 7),
      new _history2.default(this, 8)];

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

      var tags = this.state.tags;
      var i = rows.length;
      while (i--) {
        if (rows[i].tags) {
          tags = tags.concat(rows[i].tags);
        }
      }

      tags = tags.filter(function (t) {
        return "tag:" + t !== _this2.props.query;
      });

      var content = this.trim(this.state.content.concat(rows.map(function (r, i) {
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
    key: "count",
    value: function count(filterFn) {
      return this.state.content.filter(filterFn).length;
    }
  }, {
    key: "removeRows",
    value: function removeRows(filterFn) {
      this.setState({
        content: this.state.content.filter(filterFn)
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

      var dict = {};
      var uniques = content.filter(function (row) {
        if (dict[row.url]) return false;
        dict[row.url] = true;
        return true;
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
    value: function reset(query, callback) {
      this.setState({
        selected: 0,
        content: [],
        tags: [],
        errors: [],
        query: query || ""
      }, callback);
    }
  }, {
    key: "update",
    value: function update(query) {
      query = (query || "").trim();
      this.reset(query);
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
      window.addEventListener("keyup", this._onKeyPress, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("keyup", this._onKeyPress, false);
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
        url = "http://" + url;
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
          (0, _preact.h)(_sidebar2.default, {
            onChange: function onChange() {
              return _this3.update();
            },
            selected: this.content()[this.state.selected],
            messages: this.messages,
            onUpdateTopSites: function onUpdateTopSites() {
              return _this3.onUpdateTopSites();
            },
            updateFn: function updateFn() {
              return _this3.update(_this3.props.query || "");
            }
          }),
          (0, _preact.h)("div", { className: "clear" })
        ),
        (0, _preact.h)(_tagbar2.default, {
          query: this.props.query,
          openTag: this.props.openTag,
          content: this.state.tags
        })
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
      if (typeof title === "function") {
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

      return (0, _preact.h)(_urlIcon2.default, {
        content: row,
        onSelect: function onSelect(r) {
          return _this6.select(r.index);
        },
        selected: this.state.selected == row.index
      });
    }
  }]);

  return Results;
}(_preact.Component);

exports.default = Results;

},{"./autocomplete-bookmarks":4,"./autocomplete-top-sites":5,"./bookmark-search":6,"./bookmark-tags":7,"./history":10,"./icon":11,"./messaging":14,"./query-suggestions":16,"./recent-bookmarks":17,"./sidebar":23,"./tagbar":24,"./top-sites":26,"./url-icon":27,"debounce-fn":31,"preact":35}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _urlIcon = require("./url-icon");

var _urlIcon2 = _interopRequireDefault(_urlIcon);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MORE_RESULTS_THRESHOLD = 4;

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
    key: "addMoreButton",
    value: function addMoreButton(rows, _ref) {
      var _this = this;

      var title = _ref.title,
          url = _ref.url;

      var alreadyAddedCount = this.results.count(function (row) {
        return row.category.name === _this.name && !row.isMoreButton;
      });
      var limit = MORE_RESULTS_THRESHOLD - alreadyAddedCount;

      if (rows.length > limit) {
        rows = rows.slice(0, limit);
      }

      this.results.removeRows(function (row) {
        return row.category.name !== _this.name || !row.isMoreButton;
      });

      rows.push({
        isMoreButton: true,
        url: url || _config2.default.host,
        title: title || "More results"
      });

      return rows;
    }
  }, {
    key: "fail",
    value: function fail(error) {
      console.error("Error %s: ", this.name, error);
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

},{"../config":2,"./url-icon":27}],20:[function(require,module,exports){
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

},{"./icon":11,"preact":35}],21:[function(require,module,exports){
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

},{"./content":8,"./greeting":9,"./messaging":14,"./results":18,"./search-input":20,"debounce-fn":31,"preact":35}],22:[function(require,module,exports){
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

},{"../chrome/settings-sections":1,"./icon":11,"preact":35}],23:[function(require,module,exports){
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
      props.messages.send({ task: "get-like", url: props.selected.url }, function (resp) {
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

      this.props.messages.send({ task: "like", url: this.props.selected.url }, function (resp) {
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

      this.props.messages.send({ task: "unlike", url: this.props.selected.url }, function (resp) {
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
        this.props.selected.type === "top" ? this.renderDeleteTopSiteButton() : null
      );
    }
  }, {
    key: "renderLikeButton",
    value: function renderLikeButton() {
      var _this5 = this;

      var ago = this.state.like ? (0, _relativeDate2.default)(this.state.like.createdAt) : "";
      var title = this.state.like ? "Delete this website from my bookmarks" : "Bookmark this website";

      return (0, _preact.h)(
        "div",
        {
          title: title,
          className: "button like-button " + (this.state.like ? "liked" : ""),
          onClick: function onClick() {
            return _this5.toggleLike();
          }
        },
        (0, _preact.h)(_icon2.default, { name: "heart" }),
        this.state.like ? "Liked " + ago : "Like It"
      );
    }
  }, {
    key: "renderCommentButton",
    value: function renderCommentButton() {
      if (!this.state.like) return;

      var hostname = (0, _urlImage.findHostname)(this.state.like.url);
      var isHomepage = (0, _urls.clean)(this.state.like.url).indexOf("/") === -1;

      if (!isHomepage) return;

      return (0, _preact.h)(
        "a",
        {
          title: "Comments about " + hostname,
          className: "button comment-button",
          href: "https://getkozmos.com/site/" + hostname
        },
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
        {
          title: "Delete It From Frequently Visited",
          className: "button delete-button",
          onClick: function onClick() {
            return _this6.deleteTopSite();
          }
        },
        (0, _preact.h)(_icon2.default, { name: "trash" }),
        "Delete It"
      );
    }
  }]);

  return Sidebar;
}(_preact.Component);

exports.default = Sidebar;

},{"./icon":11,"./top-sites":26,"./url-image":28,"preact":35,"relative-date":42,"urls":51}],24:[function(require,module,exports){
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

},{"./icon":11,"preact":35}],25:[function(require,module,exports){
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

},{"title-from-url":45}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.get = get;
exports.hide = hide;

var _rows = require("./rows");

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

    _this.title = "Frequently Visited";
    _this.name = "top";
    return _this;
  }

  _createClass(TopSites, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return query.length == 0;
    }
  }, {
    key: "update",
    value: function update(query) {
      return this.all();
    }
  }, {
    key: "all",
    value: function all() {
      var _this2 = this;

      get(function (rows) {
        return _this2.add(rows.slice(0, 5));
      });
    }
  }]);

  return TopSites;
}(_rows2.default);

exports.default = TopSites;


function addKozmos(rows) {
  var i = rows.length;
  while (i--) {
    if (rows[i].url.indexOf("getkozmos.com") > -1) {
      return rows;
    }
  }

  rows[4] = {
    url: "https://getkozmos.com",
    title: "Kozmos"
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
    "https://google.com/": true,
    "http://google.com/": true
  };

  try {
    list = JSON.parse(localStorage["hidden-toplist"]);
  } catch (err) {
    setHiddenTopSites(list);
  }

  return list;
}

function setHiddenTopSites(list) {
  localStorage["hidden-toplist"] = JSON.stringify(list);
}

function filter(topSites) {
  var hide = getHiddenTopSites();
  return topSites.filter(function (row) {
    return !hide[row.url];
  });
}

},{"./rows":19}],27:[function(require,module,exports){
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

},{"./titles":25,"./url-image":28,"img":33,"preact":35,"urls":51}],28:[function(require,module,exports){
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

},{"debounce-fn":31,"img":33,"path":34,"preact":35,"random-color":41}],29:[function(require,module,exports){
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

},{"./wallpapers":30,"preact":35}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){

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
},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

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

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
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

},{"_process":36}],35:[function(require,module,exports){
!function() {
    'use strict';
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
            try {
                node[name] = null == value ? '' : value;
            } catch (e) {}
            if ((null == value || !1 === value) && 'spellcheck' != name) node.removeAttribute(name);
        } else {
            var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));
            if (null == value || !1 === value) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase()); else node.removeAttribute(name); else if ('function' != typeof value) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value); else node.setAttribute(name, value);
        }
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
            } else if (min < childrenLen) for (j = min; j < childrenLen; j++) if (void 0 !== children[j] && isSameNodeType(c = children[j], vchild, isHydrating)) {
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
    function createComponent(Ctor, props, context) {
        var inst, i = recyclerComponents.length;
        if (Ctor.prototype && Ctor.prototype.render) {
            inst = new Ctor(props, context);
            Component.call(inst, props, context);
        } else {
            inst = new Component(props, context);
            inst.constructor = Ctor;
            inst.render = doRender;
        }
        while (i--) if (recyclerComponents[i].constructor === Ctor) {
            inst.__b = recyclerComponents[i].__b;
            recyclerComponents.splice(i, 1);
            return inst;
        }
        return inst;
    }
    function doRender(props, state, context) {
        return this.constructor(props, context);
    }
    function setComponentProps(component, props, renderMode, context, mountAll) {
        if (!component.__x) {
            component.__x = !0;
            component.__r = props.ref;
            component.__k = props.key;
            delete props.ref;
            delete props.key;
            if (void 0 === component.constructor.getDerivedStateFromProps) if (!component.base || mountAll) {
                if (component.componentWillMount) component.componentWillMount();
            } else if (component.componentWillReceiveProps) component.componentWillReceiveProps(props, context);
            if (context && context !== component.context) {
                if (!component.__c) component.__c = component.context;
                component.context = context;
            }
            if (!component.__p) component.__p = component.props;
            component.props = props;
            component.__x = !1;
            if (0 !== renderMode) if (1 === renderMode || !1 !== options.syncComponentUpdates || !component.base) renderComponent(component, 1, mountAll); else enqueueRender(component);
            if (component.__r) component.__r(component);
        }
    }
    function renderComponent(component, renderMode, mountAll, isChild) {
        if (!component.__x) {
            var rendered, inst, cbase, props = component.props, state = component.state, context = component.context, previousProps = component.__p || props, previousState = component.__s || state, previousContext = component.__c || context, isUpdate = component.base, nextBase = component.__b, initialBase = isUpdate || nextBase, initialChildComponent = component._component, skip = !1, snapshot = previousContext;
            if (component.constructor.getDerivedStateFromProps) {
                state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
                component.state = state;
            }
            if (isUpdate) {
                component.props = previousProps;
                component.state = previousState;
                component.context = previousContext;
                if (2 !== renderMode && component.shouldComponentUpdate && !1 === component.shouldComponentUpdate(props, state, context)) skip = !0; else if (component.componentWillUpdate) component.componentWillUpdate(props, state, context);
                component.props = props;
                component.state = state;
                component.context = context;
            }
            component.__p = component.__s = component.__c = component.__b = null;
            component.__d = !1;
            if (!skip) {
                rendered = component.render(props, state, context);
                if (component.getChildContext) context = extend(extend({}, context), component.getChildContext());
                if (isUpdate && component.getSnapshotBeforeUpdate) snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
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
                    if (initialBase || 1 === renderMode) {
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
                if (component.componentDidUpdate) component.componentDidUpdate(previousProps, previousState, snapshot);
                if (options.afterUpdate) options.afterUpdate(component);
            }
            while (component.__h.length) component.__h.pop().call(component);
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
            recyclerComponents.push(component);
            removeChildren(base);
        }
        if (component.__r) component.__r(null);
    }
    function Component(props, context) {
        this.__d = !0;
        this.context = context;
        this.props = props;
        this.state = this.state || {};
        this.__h = [];
    }
    function render(vnode, parent, merge) {
        return diff(merge, vnode, {}, !1, parent, !1);
    }
    var VNode = function() {};
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
    var recyclerComponents = [];
    extend(Component.prototype, {
        setState: function(state, callback) {
            if (!this.__s) this.__s = this.state;
            this.state = extend(extend({}, this.state), 'function' == typeof state ? state(this.state, this.props) : state);
            if (callback) this.__h.push(callback);
            enqueueRender(this);
        },
        forceUpdate: function(callback) {
            if (callback) this.__h.push(callback);
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

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":38,"./encode":39}],41:[function(require,module,exports){
var random = require("rnd");

module.exports = color;

function color (max, min) {
  max || (max = 255);
  return 'rgb(' + random(max, min) + ', ' + random(max, min) + ', ' + random(max, min) + ')';
}

},{"rnd":43}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
module.exports = random;

function random (max, min) {
  max || (max = 999999999999);
  min || (min = 0);

  return min + Math.floor(Math.random() * (max - min));
}

},{}],44:[function(require,module,exports){

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
},{}],45:[function(require,module,exports){
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

},{"to-title":48}],46:[function(require,module,exports){

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
},{"to-no-case":47}],47:[function(require,module,exports){

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
},{}],48:[function(require,module,exports){
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

},{"escape-regexp-component":32,"title-case-minors":44,"to-capital-case":46}],49:[function(require,module,exports){
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

},{"./util":50,"punycode":37,"querystring":40}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){
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

},{"url":49}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaHJvbWUvc2V0dGluZ3Mtc2VjdGlvbnMuanNvbiIsImNvbmZpZy5qc29uIiwibGliL21lc3NhZ2luZy5qcyIsIm5ld3RhYi9hdXRvY29tcGxldGUtYm9va21hcmtzLmpzIiwibmV3dGFiL2F1dG9jb21wbGV0ZS10b3Atc2l0ZXMuanMiLCJuZXd0YWIvYm9va21hcmstc2VhcmNoLmpzIiwibmV3dGFiL2Jvb2ttYXJrLXRhZ3MuanMiLCJuZXd0YWIvY29udGVudC5qcyIsIm5ld3RhYi9ncmVldGluZy5qcyIsIm5ld3RhYi9oaXN0b3J5LmpzIiwibmV3dGFiL2ljb24uanMiLCJuZXd0YWIvbG9nby5qcyIsIm5ld3RhYi9tZW51LmpzIiwibmV3dGFiL21lc3NhZ2luZy5qcyIsIm5ld3RhYi9uZXd0YWIuanMiLCJuZXd0YWIvcXVlcnktc3VnZ2VzdGlvbnMuanMiLCJuZXd0YWIvcmVjZW50LWJvb2ttYXJrcy5qcyIsIm5ld3RhYi9yZXN1bHRzLmpzIiwibmV3dGFiL3Jvd3MuanMiLCJuZXd0YWIvc2VhcmNoLWlucHV0LmpzIiwibmV3dGFiL3NlYXJjaC5qcyIsIm5ld3RhYi9zZXR0aW5ncy5qcyIsIm5ld3RhYi9zaWRlYmFyLmpzIiwibmV3dGFiL3RhZ2Jhci5qcyIsIm5ld3RhYi90aXRsZXMuanMiLCJuZXd0YWIvdG9wLXNpdGVzLmpzIiwibmV3dGFiL3VybC1pY29uLmpzIiwibmV3dGFiL3VybC1pbWFnZS5qcyIsIm5ld3RhYi93YWxscGFwZXIuanMiLCJuZXd0YWIvd2FsbHBhcGVycy5qc29uIiwibm9kZV9tb2R1bGVzL2RlYm91bmNlLWZuL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzY2FwZS1yZWdleHAtY29tcG9uZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ltZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wdW55Y29kZS9wdW55Y29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZGVjb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JhbmRvbS1jb2xvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWxhdGl2ZS1kYXRlL2xpYi9yZWxhdGl2ZS1kYXRlLmpzIiwibm9kZV9tb2R1bGVzL3JuZC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aXRsZS1jYXNlLW1pbm9ycy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aXRsZS1mcm9tLXVybC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90by1jYXBpdGFsLWNhc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdG8tbm8tY2FzZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90by10aXRsZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy91cmwvdXJsLmpzIiwibm9kZV9tb2R1bGVzL3VybC91dGlsLmpzIiwibm9kZV9tb2R1bGVzL3VybHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ0hB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzV0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHtcbiAgICBrZXk6IFwib25lQ2xpY2tMaWtlXCIsXG4gICAgdGl0bGU6IFwiT25lLWNsaWNrIGJvb2ttYXJraW5nXCIsXG4gICAgZGVzYzogXCJIZWFydCBidXR0b24gd2lsbCBpbW1lZGlhdGVseSBib29rbWFyayB3aGVuIGNsaWNrZWQuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHBvcHVwOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwicmVjZW50Qm9va21hcmtzRmlyc3RcIixcbiAgICB0aXRsZTogXCJSZWNlbnQgQm9va21hcmtzIEZpcnN0XCIsXG4gICAgZGVzYzogXCJNb3ZlIFJlY2VudCBCb29rbWFya3MgT3ZlciBGcmVxdWVudGx5IFZpc2l0ZWRcIixcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9LFxuICB7XG4gICAga2V5OiBcIm1pbmltYWxNb2RlXCIsXG4gICAgdGl0bGU6IFwiRW5hYmxlIE1pbmltYWwgTW9kZVwiLFxuICAgIGRlc2M6IFwiSGlkZSBtYWpvcml0eSBvZiB0aGUgaW50ZXJmYWNlIHVudGlsIHVzZXIgZm9jdXNlcy5cIixcbiAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgbmV3dGFiOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwic2hvd1dhbGxwYXBlclwiLFxuICAgIHRpdGxlOiBcIlNob3cgV2FsbHBhcGVyXCIsXG4gICAgZGVzYzogXCJHZXQgYSBuZXcgYmVhdXRpZnVsIHBob3RvIGluIHlvdXIgbmV3IHRhYiBldmVyeSBkYXkuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9LFxuICB7XG4gICAga2V5OiBcImVuYWJsZUdyZWV0aW5nXCIsXG4gICAgdGl0bGU6IFwiU2hvdyBncmVldGluZyAmIHRpbWVcIixcbiAgICBkZXNjOiBcIlNlZSB5b3VyIG5hbWUsIGFuZCBhIG5pY2UgY2xvY2suXCIsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBuZXd0YWI6IHRydWVcbiAgfSxcbiAge1xuICAgIGtleTogXCJlbmFibGVOZXdUYWJcIixcbiAgICB0aXRsZTogXCJFbmFibGUgTmV3IFRhYiBJbnRlcmZhY2VcIixcbiAgICBkZXNjOiBcIkZhc3RlciBhbmQgZWFzaWVyIHNlYXJjaCBpbnRlcmZhY2UuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHBvcHVwOiB0cnVlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwiaG9zdFwiOiBcImh0dHBzOi8vZ2V0a296bW9zLmNvbVwiXG59XG4iLCJsZXQgbWVzc2FnZUNvdW50ZXIgPSAwXG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RJTUVPVVRfU0VDUyA9IDVcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnaW5nIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5saXN0ZW5Gb3JNZXNzYWdlcygpXG4gICAgdGhpcy53YWl0aW5nID0ge31cbiAgfVxuXG4gIGRyYWZ0KHsgaWQsIGNvbnRlbnQsIGVycm9yLCB0bywgcmVwbHkgfSkge1xuICAgIGlkID0gdGhpcy5nZW5lcmF0ZUlkKClcblxuICAgIHJldHVybiB7XG4gICAgICBmcm9tOiB0aGlzLm5hbWUsXG4gICAgICB0bzogdG8gfHwgdGhpcy50YXJnZXQsXG4gICAgICBlcnJvcjogY29udGVudC5lcnJvciB8fCBlcnJvcixcbiAgICAgIGlkLCBjb250ZW50LCByZXBseVxuICAgIH1cbiAgfVxuXG4gIGdlbmVyYXRlSWQoKSB7XG4gICAgcmV0dXJuIChEYXRlLm5vdygpICogMTAwMCkgKyAoKyttZXNzYWdlQ291bnRlcilcbiAgfVxuXG4gIG9uUmVjZWl2ZShtc2cpIHtcbiAgICBpZiAobXNnLnRvICE9PSB0aGlzLm5hbWUpIHJldHVybiB0cnVlXG5cbiAgICBpZiAobXNnLnJlcGx5ICYmIHRoaXMud2FpdGluZ1ttc2cucmVwbHldKSB7XG4gICAgICB0aGlzLndhaXRpbmdbbXNnLnJlcGx5XShtc2cpXG4gICAgfVxuXG4gICAgaWYgKG1zZy5yZXBseSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobXNnLmNvbnRlbnQgJiYgbXNnLmNvbnRlbnQucGluZykge1xuICAgICAgdGhpcy5yZXBseShtc2csIHsgcG9uZzogdHJ1ZSB9KVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBwaW5nKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zZW5kKHsgcGluZzogdHJ1ZSB9LCBjYWxsYmFjaylcbiAgfVxuXG4gIHJlcGx5KG1zZywgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5jb250ZW50KSB7XG4gICAgICBvcHRpb25zID0ge1xuICAgICAgICBjb250ZW50OiBvcHRpb25zXG4gICAgICB9XG4gICAgfVxuXG4gICAgb3B0aW9ucy5yZXBseSA9IG1zZy5pZFxuICAgIG9wdGlvbnMudG8gPSBtc2cuZnJvbVxuXG4gICAgdGhpcy5zZW5kKG9wdGlvbnMpXG4gIH1cblxuICBzZW5kKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbXNnID0gdGhpcy5kcmFmdChvcHRpb25zLmNvbnRlbnQgPyBvcHRpb25zIDogeyBjb250ZW50OiBvcHRpb25zIH0pXG5cbiAgICB0aGlzLnNlbmRNZXNzYWdlKG1zZylcblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdGhpcy53YWl0UmVwbHlGb3IobXNnLmlkLCBERUZBVUxUX1RJTUVPVVRfU0VDUywgY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgd2FpdFJlcGx5Rm9yKG1zZ0lkLCB0aW1lb3V0U2VjcywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgIGxldCB0aW1lb3V0ID0gdW5kZWZpbmVkXG5cbiAgICBpZiAodGltZW91dFNlY3MgPiAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChvblRpbWVvdXQsIHRpbWVvdXRTZWNzICogMTAwMClcbiAgICB9XG5cbiAgICB0aGlzLndhaXRpbmdbbXNnSWRdID0gbXNnID0+IHtcbiAgICAgIGRvbmUoKVxuICAgICAgY2FsbGJhY2sobXNnKVxuICAgIH1cblxuICAgIHJldHVybiBkb25lXG5cbiAgICBmdW5jdGlvbiBkb25lICgpIHtcbiAgICAgIGlmICh0aW1lb3V0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgIH1cblxuICAgICAgdGltZW91dCA9IHVuZGVmaW5lZFxuICAgICAgZGVsZXRlIHNlbGYud2FpdGluZ1ttc2dJZF1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblRpbWVvdXQgKCkge1xuICAgICAgZG9uZSgpXG4gICAgICBjYWxsYmFjayh7IGVycm9yOiBuZXcgRXJyb3IoJ01lc3NhZ2UgcmVzcG9uc2UgdGltZW91dCAoJyArIHRpbWVvdXRTZWNzICsnKXMuJykgfSlcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5pbXBvcnQgY29uZmlnIGZyb20gXCIuLi9jb25maWdcIlxuXG5jb25zdCBPRkZMSU5FX1JFU1VMVFNfVEhSRVNIT0xEID0gNFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvY29tcGxldGUgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJhdXRvY29tcGxldGUtYm9va21hcmtzXCJcbiAgICB0aGlzLnRpdGxlID0gXCJCb29rbWFya3NcIlxuICAgIHRoaXMuc2hvd01vcmVCdXR0b24gPSB0cnVlXG4gICAgdGhpcy51cGRhdGUgPSBkZWJvdW5jZSh0aGlzLmZldGNoLmJpbmQodGhpcyksIDE1MClcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeS5sZW5ndGggPiAwICYmIHF1ZXJ5LmluZGV4T2YoXCJ0YWc6XCIpID09PSAtMVxuICB9XG5cbiAgZmV0Y2gocXVlcnkpIHtcbiAgICBjb25zdCBvcXVlcnkgPSBxdWVyeSB8fCB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnlcbiAgICBjb25zdCBhZGRlZEFscmVhZHkgPSB7fVxuXG4gICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiBcImF1dG9jb21wbGV0ZVwiLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChvcXVlcnkgIT09IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeS50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgIHJlc3AuY29udGVudC5mb3JFYWNoKHJvdyA9PiAoYWRkZWRBbHJlYWR5W3Jvdy51cmxdID0gdHJ1ZSkpXG5cbiAgICAgIHRoaXMuYWRkKFxuICAgICAgICB0aGlzLmFkZE1vcmVCdXR0b24ocmVzcC5jb250ZW50LCB7XG4gICAgICAgICAgdGl0bGU6IGBNb3JlIHJlc3VsdHMgZm9yIFwiJHtvcXVlcnl9XCJgLFxuICAgICAgICAgIHVybDogYCR7Y29uZmlnLmhvc3R9L3NlYXJjaD9xPSR7b3F1ZXJ5fWBcbiAgICAgICAgfSlcbiAgICAgIClcblxuICAgICAgaWYgKHJlc3AuY29udGVudC5sZW5ndGggPj0gT0ZGTElORV9SRVNVTFRTX1RIUkVTSE9MRCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiBcInNlYXJjaC1ib29rbWFya3NcIiwgcXVlcnkgfSwgcmVzcCA9PiB7XG4gICAgICAgIGlmIChvcXVlcnkgIT09IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeS50cmltKCkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IHJlc3AuY29udGVudC5maWx0ZXIocm93ID0+ICFhZGRlZEFscmVhZHlbcm93LnVybF0pXG5cbiAgICAgICAgdGhpcy5hZGQoXG4gICAgICAgICAgdGhpcy5hZGRNb3JlQnV0dG9uKGNvbnRlbnQsIHtcbiAgICAgICAgICAgIHRpdGxlOiBgTW9yZSByZXN1bHRzIGZvciBcIiR7b3F1ZXJ5fVwiYCxcbiAgICAgICAgICAgIHVybDogYCR7Y29uZmlnLmhvc3R9L3NlYXJjaD9xPSR7b3F1ZXJ5fWBcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5pbXBvcnQgeyBjbGVhbiB9IGZyb20gXCJ1cmxzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b2NvbXBsZXRlVG9wU2l0ZXMgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJhdXRvY29tcGxldGUtdG9wLXNpdGVzXCJcbiAgICB0aGlzLnRpdGxlID0gXCJGcmVxdWVudGx5IFZpc2l0ZWRcIlxuICAgIHRoaXMudXBkYXRlID0gZGVib3VuY2UodGhpcy5mZXRjaC5iaW5kKHRoaXMpLCAxNTApXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkubGVuZ3RoID4gMFxuICB9XG5cbiAgZmV0Y2gocXVlcnkpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXVxuXG4gICAgY2hyb21lLnRvcFNpdGVzLmdldCh0b3BTaXRlcyA9PiB7XG4gICAgICBsZXQgaSA9IC0xXG4gICAgICBjb25zdCBsZW4gPSB0b3BTaXRlcy5sZW5ndGhcbiAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNsZWFuKHRvcFNpdGVzW2ldLnVybCkuaW5kZXhPZihxdWVyeSkgPT09IDAgfHxcbiAgICAgICAgICB0b3BTaXRlc1tpXS50aXRsZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkpID4gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godG9wU2l0ZXNbaV0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hZGQocmVzdWx0KVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvb2ttYXJrU2VhcmNoIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMubmFtZSA9IFwiYm9va21hcmstc2VhcmNoXCJcbiAgICB0aGlzLnRpdGxlID0gXCJMaWtlZCBpbiBLb3ptb3NcIlxuXG4gICAgdGhpcy51cGRhdGUgPSBkZWJvdW5jZSh0aGlzLl91cGRhdGUuYmluZCh0aGlzKSwgMjUwKVxuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHF1ZXJ5ICYmXG4gICAgICBxdWVyeS5sZW5ndGggPiAxICYmXG4gICAgICAocXVlcnkuaW5kZXhPZihcInRhZzpcIikgIT09IDAgfHwgcXVlcnkubGVuZ3RoIDwgNSlcbiAgICApXG4gIH1cblxuICBfdXBkYXRlKHF1ZXJ5KSB7XG4gICAgY29uc3Qgb3F1ZXJ5ID0gcXVlcnkgfHwgdGhpcy5yZXN1bHRzLnByb3BzLnF1ZXJ5XG5cbiAgICB0aGlzLnJlc3VsdHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6IFwic2VhcmNoLWJvb2ttYXJrc1wiLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChvcXVlcnkgIT09IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeS50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgIHRoaXMuYWRkKHJlc3AuY29udGVudClcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpc3RCb29rbWFya3NCeVRhZyBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSBcImJvb2ttYXJrcy1ieS10YWdcIlxuICAgIHRoaXMudGl0bGUgPSBxdWVyeSA9PiBgQm9va21hcmtzIFRhZ2dlZCBXaXRoIFwiJHtxdWVyeS5zbGljZSg0KX1cImBcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeSAmJiBxdWVyeS5pbmRleE9mKFwidGFnOlwiKSA9PT0gMCAmJiBxdWVyeS5sZW5ndGggPiA0XG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBjb25zdCBvcXVlcnkgPSBxdWVyeSB8fCB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnlcbiAgICBjb25zdCB0YWcgPSBvcXVlcnkuc2xpY2UoNClcblxuICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogXCJnZXQtYm9va21hcmtzLWJ5LXRhZ1wiLCB0YWcgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAob3F1ZXJ5ICE9PSB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnkudHJpbSgpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMuZmFpbChyZXNwLmVycm9yKVxuXG4gICAgICBjb25zdCBjb250ZW50ID1cbiAgICAgICAgcmVzcC5jb250ZW50Lmxlbmd0aCA+IDRcbiAgICAgICAgICA/IHRoaXMuYWRkTW9yZUJ1dHRvbihyZXNwLmNvbnRlbnQsIHtcbiAgICAgICAgICAgICAgdGl0bGU6IGBNb3JlIHRhZ2dlZCB3aXRoIFwiJHt0YWd9XCJgLFxuICAgICAgICAgICAgICB1cmw6IGAke2NvbmZpZy5ob3N0fS90YWcvJHt0YWd9YFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICA6IGNvbnRlbnRcblxuICAgICAgdGhpcy5hZGQoY29udGVudClcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50LXdyYXBwZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjZW50ZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGNvbnRlbnQgJHt0aGlzLnByb3BzLmZvY3VzZWQgPyBcImZvY3VzZWRcIiA6IFwiXCJ9YH0+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyZWV0aW5nIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtbmFtZScgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMub25FcnJvcihyZXNwLmVycm9yKVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbmFtZTogcmVzcC5jb250ZW50Lm5hbWVcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMudGljaygpXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmRlbGV0ZVRpbWVyKClcbiAgfVxuXG4gIGRlbGV0ZVRpbWVyKCkge1xuICAgIGlmICh0aGlzLnRpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKVxuICAgICAgdGhpcy50aW1lciA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfVxuXG4gIHNldFRpbWVyKCkge1xuICAgIHRoaXMuZGVsZXRlVGltZXIoKVxuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMudGljaygpLCA2MDAwMClcbiAgfVxuXG4gIHRpY2soKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBob3Vyczogbm93LmdldEhvdXJzKCksXG4gICAgICBtaW51dGVzOiBub3cuZ2V0TWludXRlcygpXG4gICAgfSlcblxuICAgIHRoaXMuc2V0VGltZXIoKVxuICB9XG5cbiAgb25FcnJvcihlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JlZXRpbmdcIj5cbiAgICAgICAge3RoaXMucmVuZGVyTWVzc2FnZSgpfVxuICAgICAgICB7dGhpcy5yZW5kZXJUaW1lKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUaW1lKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpbWVcIj5cbiAgICAgICAge3BhZCh0aGlzLnN0YXRlLmhvdXJzKX06e3BhZCh0aGlzLnN0YXRlLm1pbnV0ZXMpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTWVzc2FnZSgpIHtcbiAgICBjb25zdCBob3VyID0gdGhpcy5zdGF0ZS5ob3Vyc1xuICAgIGxldCBtZXNzYWdlID0gXCJHb29kIG1vcm5pbmdcIlxuXG4gICAgaWYgKGhvdXIgPj0gMTIpIG1lc3NhZ2UgPSBcIkdvb2QgQWZ0ZXJub29uXCJcbiAgICBpZiAoaG91ciA+PSAxNikgbWVzc2FnZSA9IFwiR29vZCBFdmVuaW5nXCJcblxuICAgIG1lc3NhZ2UgKz0gKHRoaXMuc3RhdGUubmFtZSA/IFwiLFwiIDogXCIuXCIpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXNzYWdlXCI+XG4gICAgICAgIHttZXNzYWdlfVxuICAgICAgICB7dGhpcy5yZW5kZXJOYW1lKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJOYW1lKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5uYW1lKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hbWVcIj5cbiAgICAgICAge3RoaXMuc3RhdGUubmFtZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5zdGF0ZS5uYW1lLnNsaWNlKDEpfS5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBwYWQgKG4pIHtcbiAgaWYgKFN0cmluZyhuKS5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuICcwJyArIG5cbiAgfVxuXG4gIHJldHVybiBuXG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCB7IGZpbmRIb3N0bmFtZSB9IGZyb20gXCIuL3VybC1pbWFnZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhpc3RvcnkgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJoaXN0b3J5XCJcbiAgICB0aGlzLnRpdGxlID0gXCJIaXN0b3J5XCJcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeS5sZW5ndGggPiAxICYmIHF1ZXJ5LnRyaW0oKS5sZW5ndGggPiAxXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBjaHJvbWUuaGlzdG9yeS5zZWFyY2goeyB0ZXh0OiBxdWVyeSB9LCBoaXN0b3J5ID0+IHtcbiAgICAgIHRoaXMuYWRkKGhpc3RvcnkuZmlsdGVyKGZpbHRlck91dFNlYXJjaCkpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJPdXRTZWFyY2gocm93KSB7XG4gIHJldHVybiAoXG4gICAgZmluZEhvc3RuYW1lKHJvdy51cmwpLnNwbGl0KFwiLlwiKVswXSAhPT0gXCJnb29nbGVcIiAmJlxuICAgICEvc2VhcmNoXFwvP1xcP3FcXD1cXHcqLy50ZXN0KHJvdy51cmwpICYmXG4gICAgIS9mYWNlYm9va1xcLmNvbVxcL3NlYXJjaC8udGVzdChyb3cudXJsKSAmJlxuICAgICEvdHdpdHRlclxcLmNvbVxcL3NlYXJjaC8udGVzdChyb3cudXJsKSAmJlxuICAgIGZpbmRIb3N0bmFtZShyb3cudXJsKSAhPT0gXCJ0LmNvXCJcbiAgKVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEljb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgbWV0aG9kID0gdGhpc1sncmVuZGVyJyArIHRoaXMucHJvcHMubmFtZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgwLCAxKSArIHRoaXMucHJvcHMubmFtZS5zbGljZSgxKV1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja30gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7dGhpcy5wcm9wcy5uYW1lfWB9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21ldGhvZCA/IG1ldGhvZC5jYWxsKHRoaXMpIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHN0cm9rZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc3Ryb2tlIHx8IDJcbiAgfVxuXG4gIHJlbmRlckFsZXJ0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1hbGVydFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTE2IDMgTDMwIDI5IDIgMjkgWiBNMTYgMTEgTDE2IDE5IE0xNiAyMyBMMTYgMjVcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2xvY2soKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWNsb2NrXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNlwiIGN5PVwiMTZcIiByPVwiMTRcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTE2IDggTDE2IDE2IDIwIDIwXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsb3NlKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jbG9zZVwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTIgMzAgTDMwIDIgTTMwIDMwIEwyIDJcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySGVhcnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWhlYXJ0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJjdXJyZW50Y29sb3JcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMuc3Ryb2tlKCl9PlxuICAgICAgICA8cGF0aCBkPVwiTTQgMTYgQzEgMTIgMiA2IDcgNCAxMiAyIDE1IDYgMTYgOCAxNyA2IDIxIDIgMjYgNCAzMSA2IDMxIDEyIDI4IDE2IDI1IDIwIDE2IDI4IDE2IDI4IDE2IDI4IDcgMjAgNCAxNiBaXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNlYXJjaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktc2VhcmNoXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNFwiIGN5PVwiMTRcIiByPVwiMTJcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTIzIDIzIEwzMCAzMFwiICAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRXh0ZXJuYWwoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWV4dGVybmFsXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTQgOSBMMyA5IDMgMjkgMjMgMjkgMjMgMTggTTE4IDQgTDI4IDQgMjggMTQgTTI4IDQgTDE0IDE4XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRhZygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktdGFnXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIyNFwiIGN5PVwiOFwiIHI9XCIyXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0yIDE4IEwxOCAyIDMwIDIgMzAgMTQgMTQgMzAgWlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJUcmFzaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktdHJhc2hcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0yOCA2IEw2IDYgOCAzMCAyNCAzMCAyNiA2IDQgNiBNMTYgMTIgTDE2IDI0IE0yMSAxMiBMMjAgMjQgTTExIDEyIEwxMiAyNCBNMTIgNiBMMTMgMiAxOSAyIDIwIDZcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUmlnaHRDaGV2cm9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jaGV2cm9uLXJpZ2h0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTIgMzAgTDI0IDE2IDEyIDJcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXNldHRpbmdzXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTMgMiBMMTMgNiAxMSA3IDggNCA0IDggNyAxMSA2IDEzIDIgMTMgMiAxOSA2IDE5IDcgMjEgNCAyNCA4IDI4IDExIDI1IDEzIDI2IDEzIDMwIDE5IDMwIDE5IDI2IDIxIDI1IDI0IDI4IDI4IDI0IDI1IDIxIDI2IDE5IDMwIDE5IDMwIDEzIDI2IDEzIDI1IDExIDI4IDggMjQgNCAyMSA3IDE5IDYgMTkgMiBaXCIgLz5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjE2XCIgY3k9XCIxNlwiIHI9XCI0XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLW1zZ1wiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTIgNCBMMzAgNCAzMCAyMiAxNiAyMiA4IDI5IDggMjIgMiAyMiBaXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ28gZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGNsYXNzTmFtZT1cImxvZ29cIiBocmVmPVwiaHR0cHM6Ly9nZXRrb3ptb3MuY29tXCI+XG4gICAgICAgIDxpbWcgc3JjPXtjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTChcImltYWdlcy9pY29uMTI4LnBuZ1wiKX0gdGl0bGU9XCJPcGVuIEtvem1vc1wiIC8+XG4gICAgICA8L2E+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVudSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHNldFRpdGxlKHRpdGxlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRpdGxlIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAge3RoaXMuc3RhdGUudGl0bGUgfHwgXCJcIn1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJidXR0b25zXCI+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBpY29uPVwiY2FsZW5kYXJcIlxuICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRUaXRsZSgnUmVjZW50bHkgVmlzaXRlZCcpfVxuICAgICAgICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLnNldFRpdGxlKCl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub3BlblJlY2VudCgpfSAvPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBpY29uPVwiaGVhcnRcIlxuICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRUaXRsZSgnQm9va21hcmtzJyl9XG4gICAgICAgICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMuc2V0VGl0bGUoKX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vcGVuQm9va21hcmtzKCl9IC8+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICBpY29uPVwiZmlyZVwiXG4gICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRUaXRsZSgnTW9zdCBWaXNpdGVkJyl9XG4gICAgICAgICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLnNldFRpdGxlKCl9XG4gICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5Ub3AoKX0gLz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgTWVzc2FnaW5nIGZyb20gJy4uL2xpYi9tZXNzYWdpbmcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZyb21OZXdUYWJUb0JhY2tncm91bmQgZXh0ZW5kcyBNZXNzYWdpbmcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5uYW1lID0gJ2tvem1vczpuZXd0YWInXG4gICAgdGhpcy50YXJnZXQgPSAna296bW9zOmJhY2tncm91bmQnXG4gIH1cblxuICBsaXN0ZW5Gb3JNZXNzYWdlcygpIHtcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobXNnID0+IHRoaXMub25SZWNlaXZlKG1zZykpXG4gIH1cblxuICBzZW5kTWVzc2FnZSAobXNnLCBjYWxsYmFjaykge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1zZywgY2FsbGJhY2spXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCwgcmVuZGVyIH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgV2FsbHBhcGVyIGZyb20gJy4vd2FsbHBhcGVyJ1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4vbWVudVwiXG5pbXBvcnQgU2VhcmNoIGZyb20gJy4vc2VhcmNoJ1xuaW1wb3J0IExvZ28gZnJvbSAnLi9sb2dvJ1xuaW1wb3J0IE1lc3NhZ2luZyBmcm9tIFwiLi9tZXNzYWdpbmdcIlxuaW1wb3J0IFNldHRpbmdzIGZyb20gXCIuL3NldHRpbmdzXCJcblxuY2xhc3MgTmV3VGFiIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1lc3NhZ2luZygpXG5cbiAgICB0aGlzLmxvYWRTZXR0aW5ncygpXG4gICAgdGhpcy5jaGVja0lmRGlzYWJsZWQoKVxuICB9XG5cbiAgbG9hZFNldHRpbmdzKGF2b2lkQ2FjaGUpIHtcbiAgICB0aGlzLmxvYWRTZXR0aW5nKCdtaW5pbWFsTW9kZScsIGF2b2lkQ2FjaGUpXG4gICAgdGhpcy5sb2FkU2V0dGluZygnc2hvd1dhbGxwYXBlcicsIGF2b2lkQ2FjaGUpXG4gICAgdGhpcy5sb2FkU2V0dGluZygnZW5hYmxlR3JlZXRpbmcnLCBhdm9pZENhY2hlKVxuICAgIHRoaXMubG9hZFNldHRpbmcoJ3JlY2VudEJvb2ttYXJrc0ZpcnN0JywgYXZvaWRDYWNoZSlcbiAgfVxuXG4gIGNoZWNrSWZEaXNhYmxlZCgpIHtcbiAgICBpZiAobG9jYWxTdG9yYWdlWydpcy1kaXNhYmxlZCddID09ICcxJykge1xuICAgICAgdGhpcy5zaG93RGVmYXVsdE5ld1RhYigpXG4gICAgfVxuXG4gICAgdGhpcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ2dldC1zZXR0aW5ncy12YWx1ZScsIGtleTogJ2VuYWJsZU5ld1RhYicgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiByZXNwLmVycm9yIH0pXG4gICAgICB9XG5cbiAgICAgIGlmICghcmVzcC5jb250ZW50LnZhbHVlKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZVsnaXMtZGlzYWJsZWQnXSA9IFwiMVwiXG4gICAgICAgIHRoaXMuc2hvd0RlZmF1bHROZXdUYWIoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlWydpcy1kaXNhYmxlZCddID0gXCJcIlxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBsb2FkU2V0dGluZyhrZXksIGF2b2lkQ2FjaGUpIHtcbiAgICBpZiAoIWF2b2lkQ2FjaGUgJiYgbG9jYWxTdG9yYWdlWydzZXR0aW5ncy1jYWNoZS0nICsga2V5XSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5hcHBseVNldHRpbmcoa2V5LCBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVsnc2V0dGluZ3MtY2FjaGUtJyArIGtleV0pKVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgICB0aGlzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LXNldHRpbmdzLXZhbHVlJywga2V5IH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKCFyZXNwLmVycm9yKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZVsnc2V0dGluZ3MtY2FjaGUtJyArIGtleV0gPSBKU09OLnN0cmluZ2lmeShyZXNwLmNvbnRlbnQudmFsdWUpXG4gICAgICAgIHRoaXMuYXBwbHlTZXR0aW5nKGtleSwgcmVzcC5jb250ZW50LnZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBhcHBseVNldHRpbmcoa2V5LCB2YWx1ZSkge1xuICAgIGNvbnN0IHUgPSB7fVxuICAgIHVba2V5XSA9IHZhbHVlXG4gICAgdGhpcy5zZXRTdGF0ZSh1KVxuICB9XG5cbiAgc2hvd0RlZmF1bHROZXdUYWIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZGlzYWJsZWQpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBuZXdUYWJVUkw6IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYsXG4gICAgICBkaXNhYmxlZDogdHJ1ZVxuICAgIH0pXG5cblx0XHRjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCBmdW5jdGlvbih0YWJzKSB7XG5cdFx0XHR2YXIgYWN0aXZlID0gdGFic1swXS5pZFxuXG5cdFx0XHRjaHJvbWUudGFicy51cGRhdGUoYWN0aXZlLCB7XG4gICAgICAgIHVybDogL2ZpcmVmb3gvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpID8gXCJhYm91dDpuZXd0YWJcIiA6IFwiY2hyb21lLXNlYXJjaDovL2xvY2FsLW50cC9sb2NhbC1udHAuaHRtbFwiXG4gICAgICB9KVxuXHRcdH0pXG4gIH1cblxuICBwcmV2V2FsbHBhcGVyKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgd2FsbHBhcGVySW5kZXg6ICh0aGlzLnN0YXRlLndhbGxwYXBlckluZGV4IHx8IDApIC0gMVxuICAgIH0pXG4gIH1cblxuICBuZXh0V2FsbHBhcGVyKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgd2FsbHBhcGVySW5kZXg6ICh0aGlzLnN0YXRlLndhbGxwYXBlckluZGV4IHx8IDApICsgMVxuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZGlzYWJsZWQpIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgbmV3dGFiICR7dGhpcy5zdGF0ZS5zaG93V2FsbHBhcGVyID8gXCJoYXMtd2FsbHBhcGVyXCIgOiBcIlwifSAke3RoaXMuc3RhdGUubWluaW1hbE1vZGUgPyBcIm1pbmltYWxcIiA6IFwiXCJ9YH0+XG4gICAgICAgIHt0aGlzLnN0YXRlLm1pbmltYWxNb2RlID8gbnVsbCA6IDxMb2dvIC8+fVxuICAgICAgICA8U2V0dGluZ3Mgb25DaGFuZ2U9eygpID0+IHRoaXMubG9hZFNldHRpbmdzKHRydWUpfSBtZXNzYWdlcz17dGhpcy5tZXNzYWdlc30gdHlwZT1cIm5ld3RhYlwiIC8+XG4gICAgICAgIDxTZWFyY2ggcmVjZW50Qm9va21hcmtzRmlyc3Q9e3RoaXMuc3RhdGUucmVjZW50Qm9va21hcmtzRmlyc3R9IG5leHRXYWxscGFwZXI9eygpID0+IHRoaXMubmV4dFdhbGxwYXBlcigpfSBwcmV2V2FsbHBhcGVyPXsoKSA9PiB0aGlzLnByZXZXYWxscGFwZXIoKX0gZW5hYmxlR3JlZXRpbmc9e3RoaXMuc3RhdGUuZW5hYmxlR3JlZXRpbmd9IHNldHRpbmdzPXt0aGlzLnNldHRpbmdzfSAvPlxuICAgICAgICB7IHRoaXMuc3RhdGUuc2hvd1dhbGxwYXBlciA/IDxXYWxscGFwZXIgaW5kZXg9e3RoaXMuc3RhdGUud2FsbHBhcGVySW5kZXh9IG1lc3NhZ2VzPXt0aGlzLm1lc3NhZ2VzfSAvPiA6IG51bGwgfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbnJlbmRlcig8TmV3VGFiIC8+LCBkb2N1bWVudC5ib2R5KVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5pbXBvcnQgdGl0bGVGcm9tVVJMIGZyb20gXCJ0aXRsZS1mcm9tLXVybFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5U3VnZ2VzdGlvbnMgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJxdWVyeS1zdWdnZXN0aW9uc1wiXG4gICAgdGhpcy5waW5uZWQgPSB0cnVlXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gaXNVUkwocXVlcnkpXG4gICAgLy8gcmV0dXJuIHF1ZXJ5Lmxlbmd0aCA+IDEgJiYgcXVlcnkudHJpbSgpLmxlbmd0aCA+IDFcbiAgfVxuXG4gIGNyZWF0ZVVSTFN1Z2dlc3Rpb25zKHF1ZXJ5KSB7XG4gICAgaWYgKCFpc1VSTChxdWVyeSkpIHJldHVybiBbXVxuXG4gICAgY29uc3QgdXJsID0gL1xcdys6XFwvXFwvLy50ZXN0KHF1ZXJ5KSA/IHF1ZXJ5IDogXCJodHRwOi8vXCIgKyBxdWVyeVxuXG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgdGl0bGU6IGBPcGVuIFwiJHt0aXRsZUZyb21VUkwocXVlcnkpfVwiYCxcbiAgICAgICAgdHlwZTogXCJxdWVyeS1zdWdnZXN0aW9uXCIsXG4gICAgICAgIHVybFxuICAgICAgfVxuICAgIF1cbiAgfVxuXG4gIGNyZWF0ZVNlYXJjaFN1Z2dlc3Rpb25zKHF1ZXJ5KSB7XG4gICAgaWYgKGlzVVJMKHF1ZXJ5KSkgcmV0dXJuIFtdXG4gICAgaWYgKHF1ZXJ5LmluZGV4T2YoXCJ0YWc6XCIpID09PSAwICYmIHF1ZXJ5Lmxlbmd0aCA+IDQpXG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgdXJsOiBcImh0dHBzOi8vZ2V0a296bW9zLmNvbS90YWcvXCIgKyBlbmNvZGVVUkkocXVlcnkuc2xpY2UoNCkpLFxuICAgICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgICB0aXRsZTogYE9wZW4gXCIke3F1ZXJ5LnNsaWNlKDQpfVwiIHRhZyBpbiBLb3ptb3NgLFxuICAgICAgICAgIHR5cGU6IFwic2VhcmNoLXF1ZXJ5XCJcbiAgICAgICAgfVxuICAgICAgXVxuXG4gICAgcmV0dXJuIFtcbiAgICAgIC8qe1xuICAgICAgICB1cmw6ICdodHRwczovL2dvb2dsZS5jb20vc2VhcmNoP3E9JyArIGVuY29kZVVSSShxdWVyeSksXG4gICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgdGl0bGU6IGBTZWFyY2ggXCIke3F1ZXJ5fVwiIG9uIEdvb2dsZWAsXG4gICAgICAgIHR5cGU6ICdzZWFyY2gtcXVlcnknXG4gICAgICB9LCovXG4gICAgICB7XG4gICAgICAgIHVybDogXCJodHRwczovL2dldGtvem1vcy5jb20vc2VhcmNoP3E9XCIgKyBlbmNvZGVVUkkocXVlcnkpLFxuICAgICAgICBxdWVyeTogcXVlcnksXG4gICAgICAgIHRpdGxlOiBgU2VhcmNoIFwiJHtxdWVyeX1cIiBvbiBLb3ptb3NgLFxuICAgICAgICB0eXBlOiBcInNlYXJjaC1xdWVyeVwiXG4gICAgICB9XG4gICAgXVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgdGhpcy5hZGQoXG4gICAgICB0aGlzLmNyZWF0ZVVSTFN1Z2dlc3Rpb25zKHF1ZXJ5KS5jb25jYXQoXG4gICAgICAgIHRoaXMuY3JlYXRlU2VhcmNoU3VnZ2VzdGlvbnMocXVlcnkpXG4gICAgICApXG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzVVJMKHF1ZXJ5KSB7XG4gIHJldHVybiBxdWVyeS50cmltKCkuaW5kZXhPZihcIi5cIikgPiAwICYmIHF1ZXJ5LmluZGV4T2YoXCIgXCIpID09PSAtMVxufVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY2VudEJvb2ttYXJrcyBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSBcInJlY2VudC1ib29rbWFya3NcIlxuICAgIHRoaXMudGl0bGUgPSBcIlJlY2VudGx5IEJvb2ttYXJrZWRcIlxuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5Lmxlbmd0aCA9PT0gMFxuICB9XG5cbiAgZmFpbChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycilcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKFxuICAgICAgeyB0YXNrOiBcImdldC1yZWNlbnQtYm9va21hcmtzXCIsIHF1ZXJ5IH0sXG4gICAgICByZXNwID0+IHtcbiAgICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLmZhaWwocmVzcC5lcnJvcilcblxuICAgICAgICB0aGlzLmFkZChyZXNwLmNvbnRlbnQpXG4gICAgICB9XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuXG5pbXBvcnQgVG9wU2l0ZXMgZnJvbSBcIi4vdG9wLXNpdGVzXCJcbmltcG9ydCBSZWNlbnRCb29rbWFya3MgZnJvbSBcIi4vcmVjZW50LWJvb2ttYXJrc1wiXG5pbXBvcnQgUXVlcnlTdWdnZXN0aW9ucyBmcm9tIFwiLi9xdWVyeS1zdWdnZXN0aW9uc1wiXG5pbXBvcnQgQm9va21hcmtTZWFyY2ggZnJvbSBcIi4vYm9va21hcmstc2VhcmNoXCJcbmltcG9ydCBIaXN0b3J5IGZyb20gXCIuL2hpc3RvcnlcIlxuaW1wb3J0IExpc3RCb29rbWFya3NCeVRhZyBmcm9tIFwiLi9ib29rbWFyay10YWdzXCJcbmltcG9ydCBBdXRvY29tcGxldGVCb29rbWFya3MgZnJvbSBcIi4vYXV0b2NvbXBsZXRlLWJvb2ttYXJrc1wiXG5pbXBvcnQgQXV0b2NvbXBsZXRlVG9wU2l0ZXMgZnJvbSBcIi4vYXV0b2NvbXBsZXRlLXRvcC1zaXRlc1wiXG5cbmltcG9ydCBTaWRlYmFyIGZyb20gXCIuL3NpZGViYXJcIlxuaW1wb3J0IFRhZ2JhciBmcm9tIFwiLi90YWdiYXJcIlxuaW1wb3J0IE1lc3NhZ2luZyBmcm9tIFwiLi9tZXNzYWdpbmdcIlxuaW1wb3J0IFVSTEljb24gZnJvbSBcIi4vdXJsLWljb25cIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5cbmNvbnN0IE1BWF9JVEVNUyA9IDVcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzdWx0cyBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNZXNzYWdpbmcoKVxuICAgIHRoaXMuX29uS2V5UHJlc3MgPSBkZWJvdW5jZSh0aGlzLm9uS2V5UHJlc3MuYmluZCh0aGlzKSwgNTApXG5cbiAgICB0aGlzLnNldENhdGVnb3JpZXMocHJvcHMpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0ICE9PSB0aGlzLnByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0KSB7XG4gICAgICB0aGlzLnNldENhdGVnb3JpZXMocHJvcHMpXG4gICAgfVxuICB9XG5cbiAgc2V0Q2F0ZWdvcmllcyhwcm9wcykge1xuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBbXG4gICAgICBuZXcgUXVlcnlTdWdnZXN0aW9ucyh0aGlzLCAxKSxcbiAgICAgIG5ldyBBdXRvY29tcGxldGVUb3BTaXRlcyh0aGlzLCAyKSxcbiAgICAgIG5ldyBBdXRvY29tcGxldGVCb29rbWFya3ModGhpcywgMyksXG4gICAgICBuZXcgVG9wU2l0ZXModGhpcywgcHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QgPyA1IDogNCksXG4gICAgICBuZXcgUmVjZW50Qm9va21hcmtzKHRoaXMsIHByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0ID8gNCA6IDUpLFxuICAgICAgbmV3IExpc3RCb29rbWFya3NCeVRhZyh0aGlzLCA2KSxcbiAgICAgIC8vbmV3IEJvb2ttYXJrU2VhcmNoKHRoaXMsIDcpLFxuICAgICAgbmV3IEhpc3RvcnkodGhpcywgOClcbiAgICBdXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNhdGVnb3JpZXNcbiAgICB9KVxuXG4gICAgdGhpcy51cGRhdGUocHJvcHMucXVlcnkgfHwgXCJcIilcbiAgfVxuXG4gIGFkZFJvd3MoY2F0ZWdvcnksIHJvd3MpIHtcbiAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgbGV0IHRhZ3MgPSB0aGlzLnN0YXRlLnRhZ3NcbiAgICBsZXQgaSA9IHJvd3MubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgaWYgKHJvd3NbaV0udGFncykge1xuICAgICAgICB0YWdzID0gdGFncy5jb25jYXQocm93c1tpXS50YWdzKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRhZ3MgPSB0YWdzLmZpbHRlcih0ID0+IFwidGFnOlwiICsgdCAhPT0gdGhpcy5wcm9wcy5xdWVyeSlcblxuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnRyaW0oXG4gICAgICB0aGlzLnN0YXRlLmNvbnRlbnQuY29uY2F0KFxuICAgICAgICByb3dzLm1hcCgociwgaSkgPT4ge1xuICAgICAgICAgIHIuY2F0ZWdvcnkgPSBjYXRlZ29yeVxuICAgICAgICAgIHIuaW5kZXggPSB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoICsgaVxuICAgICAgICAgIHJldHVybiByXG4gICAgICAgIH0pXG4gICAgICApXG4gICAgKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb250ZW50LFxuICAgICAgdGFnc1xuICAgIH0pXG4gIH1cblxuICBjb3VudChmaWx0ZXJGbikge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLmNvbnRlbnQuZmlsdGVyKGZpbHRlckZuKS5sZW5ndGhcbiAgfVxuXG4gIHJlbW92ZVJvd3MoZmlsdGVyRm4pIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNvbnRlbnQ6IHRoaXMuc3RhdGUuY29udGVudC5maWx0ZXIoZmlsdGVyRm4pXG4gICAgfSlcbiAgfVxuXG4gIGNvbnRlbnQoKSB7XG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLnN0YXRlLmNvbnRlbnRcbiAgICBjb250ZW50LnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLmNhdGVnb3J5LnNvcnQgPCBiLmNhdGVnb3J5LnNvcnQpIHJldHVybiAtMVxuICAgICAgaWYgKGEuY2F0ZWdvcnkuc29ydCA+IGIuY2F0ZWdvcnkuc29ydCkgcmV0dXJuIDFcblxuICAgICAgaWYgKGEuaW5kZXggPCBiLmluZGV4KSByZXR1cm4gLTFcbiAgICAgIGlmIChhLmluZGV4ID4gYi5pbmRleCkgcmV0dXJuIDFcblxuICAgICAgcmV0dXJuIDBcbiAgICB9KVxuXG4gICAgY29uc3QgZGljdCA9IHt9XG4gICAgY29uc3QgdW5pcXVlcyA9IGNvbnRlbnQuZmlsdGVyKHJvdyA9PiB7XG4gICAgICBpZiAoZGljdFtyb3cudXJsXSkgcmV0dXJuIGZhbHNlXG4gICAgICBkaWN0W3Jvdy51cmxdID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbnRlbnQubWFwKChyb3csIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6IHJvdy51cmwsXG4gICAgICAgIHRpdGxlOiByb3cudGl0bGUsXG4gICAgICAgIGltYWdlczogcm93LmltYWdlcyxcbiAgICAgICAgdHlwZTogcm93LmNhdGVnb3J5Lm5hbWUsXG4gICAgICAgIGNhdGVnb3J5OiByb3cuY2F0ZWdvcnksXG4gICAgICAgIGFic0luZGV4OiBpbmRleCxcbiAgICAgICAgaW5kZXhcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY29udGVudEJ5Q2F0ZWdvcnkoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGggPT09IDApIHJldHVybiBbXVxuXG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudCgpXG4gICAgY29uc3Qgc2VsZWN0ZWRDYXRlZ29yeSA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRcbiAgICAgID8gY29udGVudFt0aGlzLnN0YXRlLnNlbGVjdGVkXS5jYXRlZ29yeVxuICAgICAgOiBjb250ZW50WzBdLmNhdGVnb3J5XG4gICAgY29uc3QgY2F0ZWdvcmllcyA9IFtdXG4gICAgY29uc3QgY2F0ZWdvcmllc01hcCA9IHt9XG5cbiAgICBsZXQgdGFiSW5kZXggPSAyXG4gICAgbGV0IGNhdGVnb3J5ID0gbnVsbFxuICAgIGNvbnRlbnQuZm9yRWFjaCgocm93LCBpbmQpID0+IHtcbiAgICAgIGlmICghY2F0ZWdvcnkgfHwgY2F0ZWdvcnkubmFtZSAhPT0gcm93LmNhdGVnb3J5Lm5hbWUpIHtcbiAgICAgICAgY2F0ZWdvcnkgPSByb3cuY2F0ZWdvcnlcbiAgICAgICAgY2F0ZWdvcmllc01hcFtjYXRlZ29yeS5uYW1lXSA9IHtcbiAgICAgICAgICB0aXRsZTogY2F0ZWdvcnkudGl0bGUsXG4gICAgICAgICAgbmFtZTogY2F0ZWdvcnkubmFtZSxcbiAgICAgICAgICBzb3J0OiBjYXRlZ29yeS5zb3J0LFxuICAgICAgICAgIGNvbGxhcHNlZDpcbiAgICAgICAgICAgIGNvbnRlbnQubGVuZ3RoID49IE1BWF9JVEVNUyAmJlxuICAgICAgICAgICAgc2VsZWN0ZWRDYXRlZ29yeS5uYW1lICE9IGNhdGVnb3J5Lm5hbWUgJiZcbiAgICAgICAgICAgICEhY2F0ZWdvcnkudGl0bGUsXG4gICAgICAgICAgcm93czogW11cbiAgICAgICAgfVxuXG4gICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yaWVzTWFwW2NhdGVnb3J5Lm5hbWVdKVxuXG4gICAgICAgIHJvdy50YWJJbmRleCA9ICsrdGFiSW5kZXhcbiAgICAgIH1cblxuICAgICAgY2F0ZWdvcmllc01hcFtjYXRlZ29yeS5uYW1lXS5yb3dzLnB1c2gocm93KVxuICAgIH0pXG5cbiAgICByZXR1cm4gY2F0ZWdvcmllc1xuICB9XG5cbiAgdHJpbShjb250ZW50KSB7XG4gICAgY29uc3QgY2F0ZWdvcnlDb3VudHMgPSB7fVxuICAgIGNvbnN0IHBpbm5lZENvdW50ID0gdGhpcy5waW5uZWRSb3dDb3VudCgpXG5cbiAgICBjb250ZW50ID0gY29udGVudC5maWx0ZXIociA9PiB7XG4gICAgICBpZiAoIWNhdGVnb3J5Q291bnRzW3IuY2F0ZWdvcnkubmFtZV0pIHtcbiAgICAgICAgY2F0ZWdvcnlDb3VudHNbci5jYXRlZ29yeS5uYW1lXSA9IDBcbiAgICAgIH1cblxuICAgICAgY2F0ZWdvcnlDb3VudHNbci5jYXRlZ29yeS5uYW1lXSsrXG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIHIuY2F0ZWdvcnkucGlubmVkIHx8XG4gICAgICAgIE1BWF9JVEVNUyAtIHBpbm5lZENvdW50ID49IGNhdGVnb3J5Q291bnRzW3IuY2F0ZWdvcnkubmFtZV1cbiAgICAgIClcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbnRlbnRcbiAgfVxuXG4gIHBpbm5lZFJvd0NvdW50KGNvbnRlbnQpIHtcbiAgICBjb250ZW50IHx8IChjb250ZW50ID0gdGhpcy5zdGF0ZS5jb250ZW50KVxuICAgIGNvbnN0IGxlbiA9IGNvbnRlbnQubGVuZ3RoXG5cbiAgICBsZXQgY3RyID0gMFxuICAgIGxldCBpID0gLTFcbiAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICBpZiAoY29udGVudFtpXS5jYXRlZ29yeS5waW5uZWQpIHtcbiAgICAgICAgY3RyKytcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY3RyXG4gIH1cblxuICByZXNldChxdWVyeSwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnNldFN0YXRlKFxuICAgICAge1xuICAgICAgICBzZWxlY3RlZDogMCxcbiAgICAgICAgY29udGVudDogW10sXG4gICAgICAgIHRhZ3M6IFtdLFxuICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICBxdWVyeTogcXVlcnkgfHwgXCJcIlxuICAgICAgfSxcbiAgICAgIGNhbGxiYWNrXG4gICAgKVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSAocXVlcnkgfHwgXCJcIikudHJpbSgpXG4gICAgdGhpcy5yZXNldChxdWVyeSlcbiAgICB0aGlzLnN0YXRlLmNhdGVnb3JpZXMuZm9yRWFjaChjID0+IGMub25OZXdRdWVyeShxdWVyeSkpXG4gIH1cblxuICBzZWxlY3QoaW5kZXgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOiBpbmRleFxuICAgIH0pXG4gIH1cblxuICBzZWxlY3ROZXh0KCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWQ6ICh0aGlzLnN0YXRlLnNlbGVjdGVkICsgMSkgJSB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoXG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdFByZXZpb3VzKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWQ6XG4gICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWQgPT0gMFxuICAgICAgICAgID8gdGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aCAtIDFcbiAgICAgICAgICA6IHRoaXMuc3RhdGUuc2VsZWN0ZWQgLSAxXG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdE5leHRDYXRlZ29yeSgpIHtcbiAgICBsZXQgY3VycmVudENhdGVnb3J5ID0gdGhpcy5zdGF0ZS5jb250ZW50W3RoaXMuc3RhdGUuc2VsZWN0ZWRdLmNhdGVnb3J5XG5cbiAgICBjb25zdCBsZW4gPSB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoXG4gICAgbGV0IGkgPSB0aGlzLnN0YXRlLnNlbGVjdGVkXG4gICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuY29udGVudFtpXS5jYXRlZ29yeS5zb3J0ICE9PSBjdXJyZW50Q2F0ZWdvcnkuc29ydCkge1xuICAgICAgICB0aGlzLnNlbGVjdChpKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5jb250ZW50WzBdLmNhdGVnb3J5LnNvcnQgIT09IGN1cnJlbnRDYXRlZ29yeS5zb3J0KSB7XG4gICAgICB0aGlzLnNlbGVjdCgwKVxuICAgIH1cbiAgfVxuXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgIGlmIChuZXh0UHJvcHMucXVlcnkgIT09IHRoaXMucHJvcHMucXVlcnkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG5leHRTdGF0ZS5jb250ZW50Lmxlbmd0aCAhPT0gdGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobmV4dFN0YXRlLnNlbGVjdGVkICE9PSB0aGlzLnN0YXRlLnNlbGVjdGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChuZXh0UHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QgIT09IHRoaXMucHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLl9vbktleVByZXNzLCBmYWxzZSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5fb25LZXlQcmVzcywgZmFsc2UpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHByb3BzLnF1ZXJ5ICE9PSB0aGlzLnByb3BzLnF1ZXJ5KSB7XG4gICAgICB0aGlzLnVwZGF0ZShwcm9wcy5xdWVyeSB8fCBcIlwiKVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdCAhPT0gdGhpcy5wcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdCkge1xuICAgICAgdGhpcy5zZXRDYXRlZ29yaWVzKHByb3BzKVxuICAgIH1cbiAgfVxuXG4gIG5hdmlnYXRlVG8odXJsKSB7XG4gICAgaWYgKCEvXlxcdys6XFwvXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiaHR0cDovL1wiICsgdXJsXG4gICAgfVxuXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHVybFxuICB9XG5cbiAgb25LZXlQcmVzcyhlKSB7XG4gICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgLy8gZW50ZXJcbiAgICAgIHRoaXMubmF2aWdhdGVUbyh0aGlzLnN0YXRlLmNvbnRlbnRbdGhpcy5zdGF0ZS5zZWxlY3RlZF0udXJsKVxuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDQwKSB7XG4gICAgICAvLyBkb3duIGFycm93XG4gICAgICB0aGlzLnNlbGVjdE5leHQoKVxuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDM4KSB7XG4gICAgICAvLyB1cCBhcnJvd1xuICAgICAgdGhpcy5zZWxlY3RQcmV2aW91cygpXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gOSkge1xuICAgICAgLy8gdGFiIGtleVxuICAgICAgdGhpcy5zZWxlY3ROZXh0Q2F0ZWdvcnkoKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgZS5rZXlDb2RlID09IDM3KSB7XG4gICAgICB0aGlzLnByb3BzLnByZXZXYWxscGFwZXIoKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgZS5rZXlDb2RlID09IDM5KSB7XG4gICAgICB0aGlzLnByb3BzLm5leHRXYWxscGFwZXIoKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuY291bnRlciA9IDBcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YHJlc3VsdHMgJHt0aGlzLnN0YXRlLnRhZ3MubGVuZ3RoID8gXCJoYXMtdGFnc1wiIDogXCJcIn1gfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaW5rc1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzdWx0cy1jYXRlZ29yaWVzXCI+XG4gICAgICAgICAgICB7dGhpcy5jb250ZW50QnlDYXRlZ29yeSgpLm1hcChjYXRlZ29yeSA9PlxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckNhdGVnb3J5KGNhdGVnb3J5KVxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U2lkZWJhclxuICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IHRoaXMudXBkYXRlKCl9XG4gICAgICAgICAgICBzZWxlY3RlZD17dGhpcy5jb250ZW50KClbdGhpcy5zdGF0ZS5zZWxlY3RlZF19XG4gICAgICAgICAgICBtZXNzYWdlcz17dGhpcy5tZXNzYWdlc31cbiAgICAgICAgICAgIG9uVXBkYXRlVG9wU2l0ZXM9eygpID0+IHRoaXMub25VcGRhdGVUb3BTaXRlcygpfVxuICAgICAgICAgICAgdXBkYXRlRm49eygpID0+IHRoaXMudXBkYXRlKHRoaXMucHJvcHMucXVlcnkgfHwgXCJcIil9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxUYWdiYXJcbiAgICAgICAgICBxdWVyeT17dGhpcy5wcm9wcy5xdWVyeX1cbiAgICAgICAgICBvcGVuVGFnPXt0aGlzLnByb3BzLm9wZW5UYWd9XG4gICAgICAgICAgY29udGVudD17dGhpcy5zdGF0ZS50YWdzfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2F0ZWdvcnkoYykge1xuICAgIGNvbnN0IG92ZXJmbG93ID1cbiAgICAgIGMuY29sbGFwc2VkICYmXG4gICAgICB0aGlzLnN0YXRlLmNvbnRlbnRbdGhpcy5zdGF0ZS5zZWxlY3RlZF0uY2F0ZWdvcnkuc29ydCA8IGMuc29ydCAmJlxuICAgICAgdGhpcy5jb3VudGVyIDwgTUFYX0lURU1TXG4gICAgICAgID8gYy5yb3dzLnNsaWNlKDAsIE1BWF9JVEVNUyAtIHRoaXMuY291bnRlcilcbiAgICAgICAgOiBbXVxuICAgIGNvbnN0IGNvbGxhcHNlZCA9IGMucm93cy5zbGljZShvdmVyZmxvdy5sZW5ndGgsIE1BWF9JVEVNUylcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YGNhdGVnb3J5ICR7Yy5jb2xsYXBzZWQgPyBcImNvbGxhcHNlZFwiIDogXCJcIn1gfT5cbiAgICAgICAge3RoaXMucmVuZGVyQ2F0ZWdvcnlUaXRsZShjKX1cbiAgICAgICAge292ZXJmbG93Lmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1yb3dzIG92ZXJmbG93XCI+XG4gICAgICAgICAgICB7b3ZlcmZsb3cubWFwKHJvdyA9PiB0aGlzLnJlbmRlclJvdyhyb3cpKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIHtjb2xsYXBzZWQubGVuZ3RoID4gMCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXJvd3NcIj5cbiAgICAgICAgICAgIHtjb2xsYXBzZWQubWFwKHJvdyA9PiB0aGlzLnJlbmRlclJvdyhyb3cpKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDYXRlZ29yeVRpdGxlKGMpIHtcbiAgICBpZiAoIWMudGl0bGUpIHJldHVyblxuXG4gICAgbGV0IHRpdGxlID0gYy50aXRsZVxuICAgIGlmICh0eXBlb2YgdGl0bGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGl0bGUgPSBjLnRpdGxlKHRoaXMucHJvcHMucXVlcnkpXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgPGgxIG9uQ2xpY2s9eygpID0+IHRoaXMuc2VsZWN0KGMucm93c1swXS5hYnNJbmRleCl9PlxuICAgICAgICAgIDxJY29uIHN0cm9rZT1cIjNcIiBuYW1lPVwicmlnaHRDaGV2cm9uXCIgLz5cbiAgICAgICAgICB7dGl0bGV9XG4gICAgICAgIDwvaDE+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJSb3cocm93KSB7XG4gICAgdGhpcy5jb3VudGVyKytcblxuICAgIHJldHVybiAoXG4gICAgICA8VVJMSWNvblxuICAgICAgICBjb250ZW50PXtyb3d9XG4gICAgICAgIG9uU2VsZWN0PXtyID0+IHRoaXMuc2VsZWN0KHIuaW5kZXgpfVxuICAgICAgICBzZWxlY3RlZD17dGhpcy5zdGF0ZS5zZWxlY3RlZCA9PSByb3cuaW5kZXh9XG4gICAgICAvPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IFVSTEljb24gZnJvbSBcIi4vdXJsLWljb25cIlxuaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCJcblxuY29uc3QgTU9SRV9SRVNVTFRTX1RIUkVTSE9MRCA9IDRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICB0aGlzLnJlc3VsdHMgPSByZXN1bHRzXG4gICAgdGhpcy5zb3J0ID0gc29ydFxuICB9XG5cbiAgYWRkKHJvd3MpIHtcbiAgICB0aGlzLnJlc3VsdHMuYWRkUm93cyh0aGlzLCByb3dzKVxuICB9XG5cbiAgYWRkTW9yZUJ1dHRvbihyb3dzLCB7IHRpdGxlLCB1cmwgfSkge1xuICAgIGNvbnN0IGFscmVhZHlBZGRlZENvdW50ID0gdGhpcy5yZXN1bHRzLmNvdW50KFxuICAgICAgcm93ID0+IHJvdy5jYXRlZ29yeS5uYW1lID09PSB0aGlzLm5hbWUgJiYgIXJvdy5pc01vcmVCdXR0b25cbiAgICApXG4gICAgY29uc3QgbGltaXQgPSBNT1JFX1JFU1VMVFNfVEhSRVNIT0xEIC0gYWxyZWFkeUFkZGVkQ291bnRcblxuICAgIGlmIChyb3dzLmxlbmd0aCA+IGxpbWl0KSB7XG4gICAgICByb3dzID0gcm93cy5zbGljZSgwLCBsaW1pdClcbiAgICB9XG5cbiAgICB0aGlzLnJlc3VsdHMucmVtb3ZlUm93cyhcbiAgICAgIHJvdyA9PiByb3cuY2F0ZWdvcnkubmFtZSAhPT0gdGhpcy5uYW1lIHx8ICFyb3cuaXNNb3JlQnV0dG9uXG4gICAgKVxuXG4gICAgcm93cy5wdXNoKHtcbiAgICAgIGlzTW9yZUJ1dHRvbjogdHJ1ZSxcbiAgICAgIHVybDogdXJsIHx8IGNvbmZpZy5ob3N0LFxuICAgICAgdGl0bGU6IHRpdGxlIHx8IFwiTW9yZSByZXN1bHRzXCJcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJvd3NcbiAgfVxuXG4gIGZhaWwoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgJXM6IFwiLCB0aGlzLm5hbWUsIGVycm9yKVxuICB9XG5cbiAgb25OZXdRdWVyeShxdWVyeSkge1xuICAgIHRoaXMubGF0ZXN0UXVlcnkgPSBxdWVyeVxuXG4gICAgaWYgKHRoaXMuc2hvdWxkQmVPcGVuKHF1ZXJ5KSkge1xuICAgICAgdGhpcy51cGRhdGUocXVlcnkpXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hJbnB1dCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZhbHVlOiAnJ1xuICAgIH0pXG5cbiAgICB0aGlzLl9vbkNsaWNrID0gdGhpcy5vbkNsaWNrLmJpbmQodGhpcylcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAocHJvcHMudmFsdWUgJiYgcHJvcHMudmFsdWUudHJpbSgpICE9PSB0aGlzLnN0YXRlLnZhbHVlLnRyaW0oKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHZhbHVlOiBwcm9wcy52YWx1ZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBvbkJsdXIoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmZvY3VzZWQpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c2VkOiBmYWxzZVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLm9uQmx1cigpXG4gIH1cblxuICBvbkZvY3VzKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmZvY3VzZWQpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c2VkOiB0cnVlXG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMub25Gb2N1cygpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5pbnB1dCkge1xuICAgICAgdGhpcy5pbnB1dC5mb2N1cygpXG4gICAgfVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgcmV0dXJuIG5leHRTdGF0ZS52YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uQ2xpY2spXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkNsaWNrKVxuICB9XG5cbiAgb25DbGljayhlKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudmFsdWUgPT09ICcnICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudC13cmFwcGVyIC5jb250ZW50JykuY29udGFpbnMoZS50YXJnZXQpICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2J1dHRvbicpKSB7XG4gICAgICB0aGlzLm9uQmx1cigpXG4gICAgfVxuICB9XG5cbiAgb25RdWVyeUNoYW5nZSh2YWx1ZSwga2V5Q29kZSwgZXZlbnQpIHtcbiAgICBpZiAodmFsdWUudHJpbSgpICE9PSBcIlwiKSB7XG4gICAgICB0aGlzLm9uRm9jdXMoKVxuICAgIH1cblxuICAgIGlmIChrZXlDb2RlID09PSAxMykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25QcmVzc0VudGVyKHZhbHVlKVxuICAgIH1cblxuICAgIGlmIChrZXlDb2RlID09PSAyNykge1xuICAgICAgcmV0dXJuIHRoaXMub25CbHVyKClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWUgfSlcblxuICAgIGlmICh0aGlzLnF1ZXJ5Q2hhbmdlVGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucXVlcnlDaGFuZ2VUaW1lcilcbiAgICAgIHRoaXMucXVlcnlDaGFuZ2VUaW1lciA9IDA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMub25RdWVyeUNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vblF1ZXJ5Q2hhbmdlKHZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWFyY2gtaW5wdXRcIj5cbiAgICAgICAge3RoaXMucmVuZGVySWNvbigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJJbnB1dCgpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySWNvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEljb24gbmFtZT1cInNlYXJjaFwiIG9uY2xpY2s9eygpID0+IHRoaXMuaW5wdXQuZm9jdXMoKX0gLz5cbiAgICApXG4gIH1cblxuICByZW5kZXJJbnB1dCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGlucHV0IHRhYmluZGV4PVwiMVwiXG4gICAgICAgIHJlZj17ZWwgPT4gdGhpcy5pbnB1dCA9IGVsfVxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIGNsYXNzTmFtZT1cImlucHV0XCJcbiAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggb3IgZW50ZXIgd2Vic2l0ZSBuYW1lLlwiXG4gICAgICAgIG9uRm9jdXM9e2UgPT4gdGhpcy5vbkZvY3VzKCl9XG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMub25RdWVyeUNoYW5nZShlLnRhcmdldC52YWx1ZSwgdW5kZWZpbmVkLCAnY2hhbmdlJyl9XG4gICAgICAgIG9uS2V5VXA9e2UgPT4gdGhpcy5vblF1ZXJ5Q2hhbmdlKGUudGFyZ2V0LnZhbHVlLCBlLmtleUNvZGUsICdrZXkgdXAnKX1cbiAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5vbkZvY3VzKCl9XG4gICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSAvPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImRlYm91bmNlLWZuXCJcbmltcG9ydCBDb250ZW50IGZyb20gXCIuL2NvbnRlbnRcIlxuaW1wb3J0IFNlYXJjaElucHV0IGZyb20gXCIuL3NlYXJjaC1pbnB1dFwiXG5pbXBvcnQgUmVzdWx0cyBmcm9tIFwiLi9yZXN1bHRzXCJcbmltcG9ydCBNZXNzYWdpbmcgZnJvbSBcIi4vbWVzc2FnaW5nXCJcbmltcG9ydCBHcmVldGluZyBmcm9tIFwiLi9ncmVldGluZ1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNZXNzYWdpbmcoKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpZDogMCxcbiAgICAgIHJvd3M6IHt9LFxuICAgICAgcm93c0F2YWlsYWJsZTogNSxcbiAgICAgIHF1ZXJ5OiAnJyxcbiAgICAgIGZvY3VzZWQ6IGZhbHNlXG4gICAgfSlcblxuICAgIHRoaXMuX29uUXVlcnlDaGFuZ2UgPSBkZWJvdW5jZSh0aGlzLm9uUXVlcnlDaGFuZ2UuYmluZCh0aGlzKSwgNTApXG4gIH1cblxuICBpZCgpIHtcbiAgICByZXR1cm4gKyt0aGlzLnN0YXRlLmlkXG4gIH1cblxuICBvbkZvY3VzKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9jdXNlZDogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBvbkJsdXIoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c2VkOiBmYWxzZVxuICAgIH0pXG4gIH1cblxuICBvblByZXNzRW50ZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMubmF2aWdhdGVUbyh0aGlzLnN0YXRlLnNlbGVjdGVkLnVybClcbiAgICB9XG4gIH1cblxuICBvblNlbGVjdChyb3cpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZCAmJiB0aGlzLnN0YXRlLnNlbGVjdGVkLmlkID09PSByb3cuaWQpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZDogcm93XG4gICAgfSlcbiAgfVxuXG4gIG9uUXVlcnlDaGFuZ2UocXVlcnkpIHtcbiAgICBxdWVyeSA9IHF1ZXJ5LnRyaW0oKVxuXG4gICAgaWYgKHF1ZXJ5ID09PSB0aGlzLnN0YXRlLnF1ZXJ5KSByZXR1cm5cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcm93czoge30sXG4gICAgICByb3dzQXZhaWxhYmxlOiA1LFxuICAgICAgc2VsZWN0ZWQ6IG51bGwsXG4gICAgICBpZDogMCxcbiAgICAgIHF1ZXJ5XG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENvbnRlbnQgd2FsbHBhcGVyPXt0aGlzLnByb3BzLndhbGxwYXBlcn0gZm9jdXNlZD17dGhpcy5zdGF0ZS5mb2N1c2VkfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50LWlubmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuZW5hYmxlR3JlZXRpbmcgPyA8R3JlZXRpbmcgbmFtZT17dGhpcy5zdGF0ZS51c2VybmFtZX0gbWVzc2FnZXM9e3RoaXMubWVzc2FnZXN9IC8+IDogbnVsbH1cbiAgICAgICAgICA8U2VhcmNoSW5wdXQgb25QcmVzc0VudGVyPXsoKSA9PiB0aGlzLm9uUHJlc3NFbnRlcigpfVxuICAgICAgICAgICAgb25RdWVyeUNoYW5nZT17dGhpcy5fb25RdWVyeUNoYW5nZX1cbiAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHRoaXMub25Gb2N1cygpfVxuICAgICAgICAgICAgb25CbHVyPXsoKSA9PiB0aGlzLm9uQmx1cigpfVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUucXVlcnl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFJlc3VsdHMgcmVjZW50Qm9va21hcmtzRmlyc3Q9e3RoaXMucHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3R9IG5leHRXYWxscGFwZXI9e3RoaXMucHJvcHMubmV4dFdhbGxwYXBlcn0gcHJldldhbGxwYXBlcj17dGhpcy5wcm9wcy5wcmV2V2FsbHBhcGVyfSBvcGVuVGFnPXt0YWcgPT4gdGhpcy5fb25RdWVyeUNoYW5nZSgndGFnOicgKyB0YWcpfSBmb2N1c2VkPXt0aGlzLnN0YXRlLmZvY3VzZWR9IHF1ZXJ5PXt0aGlzLnN0YXRlLnF1ZXJ5fSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhclwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvQ29udGVudD5cbiAgICApXG4gIH1cblxuICByZW5kZXJSZXN1bHRzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRzLXJvd3NcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIHNvcnRMaWtlcyhhLCBiKSB7XG4gIGlmIChhLmxpa2VkX2F0IDwgYi5saWtlZF9hdCkgcmV0dXJuIDFcbiAgaWYgKGEubGlrZWRfYXQgPiBiLmxpa2VkX2F0KSByZXR1cm4gLTFcbiAgcmV0dXJuIDBcbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5pbXBvcnQgc2VjdGlvbnMgZnJvbSAnLi4vY2hyb21lL3NldHRpbmdzLXNlY3Rpb25zJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR0aW5ncyBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICBzZWN0aW9ucy5mb3JFYWNoKHMgPT4gdGhpcy5sb2FkU2VjdGlvbihzKSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKSB7XG4gICAgc2VjdGlvbnMuZm9yRWFjaChzID0+IHRoaXMubG9hZFNlY3Rpb24ocykpXG4gIH1cblxuICBsb2FkU2VjdGlvbihzKSB7XG4gICAgdGhpcy5wcm9wcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ2dldC1zZXR0aW5ncy12YWx1ZScsIGtleTogcy5rZXkgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMub25FcnJvcihyZXNwLmVycm9yKVxuICAgICAgY29uc3QgdSA9IHt9XG4gICAgICB1W3Mua2V5XSA9IHJlc3AuY29udGVudC52YWx1ZVxuICAgICAgdGhpcy5zZXRTdGF0ZSh1KVxuICAgIH0pXG4gIH1cblxuICBvbkNoYW5nZSh2YWx1ZSwgb3B0aW9ucykge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdzZXQtc2V0dGluZ3MtdmFsdWUnLCBrZXk6IG9wdGlvbnMua2V5LCB2YWx1ZSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5vbkVycm9yKHJlc3AuZXJyb3IpXG5cbiAgICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBvbkVycm9yKGVycm9yKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlcnJvclxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbkVycm9yKSB7XG4gICAgICB0aGlzLnByb3BzLm9uRXJyb3IoZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YHNldHRpbmdzICR7dGhpcy5zdGF0ZS5vcGVuID8gXCJvcGVuXCIgOiBcIlwifWB9PlxuICAgICAgICA8SWNvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgb3BlbjogdHJ1ZSB9KX0gbmFtZT1cInNldHRpbmdzXCIgLz5cbiAgICAgICAge3RoaXMucmVuZGVyU2V0dGluZ3MoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNldHRpbmdzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cbiAgICAgICAge3RoaXMucmVuZGVyQ2xvc2VCdXR0b24oKX1cbiAgICAgICAgPGgxPlNldHRpbmdzPC9oMT5cbiAgICAgICAgPGgyPkdvdCBmZWVkYmFjayAvIHJlY29tbWVuZGF0aW9uID8gPGEgaHJlZj1cIm1haWx0bzphemVyQGdldGtvem1vcy5jb21cIj5mZWVkYmFjazwvYT4gYW55dGltZS48L2gyPlxuICAgICAgICB7dGhpcy5yZW5kZXJTZWN0aW9ucygpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvb3RlclwiPlxuICAgICAgICAgIDxidXR0b24gb25jbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG9wZW46IGZhbHNlIH0pfT5cbiAgICAgICAgICAgIERvbmVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZWN0aW9ucygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uc1wiPlxuICAgICAgICB7c2VjdGlvbnMubWFwKHMgPT4gdGhpcy5yZW5kZXJTZWN0aW9uKHMpKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNlY3Rpb24ob3B0aW9ucykge1xuICAgIGlmICh0aGlzLnByb3BzLnR5cGUgJiYgIW9wdGlvbnNbdGhpcy5wcm9wcy50eXBlXSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT17YHNldHRpbmcgJHtvcHRpb25zLmtleX1gfT5cbiAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImNoZWNrYm94XCIgaWQ9e29wdGlvbnMua2V5fSBuYW1lPXtvcHRpb25zLmtleX0gdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17dGhpcy5zdGF0ZVtvcHRpb25zLmtleV19IG9uQ2hhbmdlPXtlID0+IHRoaXMub25DaGFuZ2UoZS50YXJnZXQuY2hlY2tlZCwgb3B0aW9ucyl9IC8+XG4gICAgICAgIDxsYWJlbCB0aXRsZT17b3B0aW9ucy5kZXNjfSBodG1sRm9yPXtvcHRpb25zLmtleX0+e29wdGlvbnMudGl0bGV9PC9sYWJlbD5cbiAgICAgICAgPHA+e29wdGlvbnMuZGVzY308L3A+XG4gICAgICA8L3NlY3Rpb24+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2xvc2VCdXR0b24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxJY29uIHN0cm9rZT1cIjNcIiBuYW1lPVwiY2xvc2VcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgb3BlbjogZmFsc2UgfSl9IC8+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCB7IGNsZWFuIGFzIGNsZWFuVVJMIH0gZnJvbSBcInVybHNcIlxuaW1wb3J0IHJlbGF0aXZlRGF0ZSBmcm9tIFwicmVsYXRpdmUtZGF0ZVwiXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcbmltcG9ydCBVUkxJbWFnZSBmcm9tIFwiLi91cmwtaW1hZ2VcIlxuaW1wb3J0IHsgaGlkZSBhcyBoaWRlVG9wU2l0ZSB9IGZyb20gXCIuL3RvcC1zaXRlc1wiXG5pbXBvcnQgeyBmaW5kSG9zdG5hbWUgfSBmcm9tIFwiLi91cmwtaW1hZ2VcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWRlYmFyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICghcHJvcHMuc2VsZWN0ZWQpIHJldHVyblxuICAgIHByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiBcImdldC1saWtlXCIsIHVybDogcHJvcHMuc2VsZWN0ZWQudXJsIH0sIHJlc3AgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxpa2U6IHJlc3AuY29udGVudC5saWtlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVUb3BTaXRlKCkge1xuICAgIGhpZGVUb3BTaXRlKHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsKVxuICAgIHRoaXMucHJvcHMudXBkYXRlRm4oKVxuICB9XG5cbiAgdG9nZ2xlTGlrZSgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5saWtlKSB0aGlzLnVubGlrZSgpXG4gICAgZWxzZSB0aGlzLmxpa2UoKVxuICB9XG5cbiAgbGlrZSgpIHtcbiAgICB0aGlzLnByb3BzLm1lc3NhZ2VzLnNlbmQoXG4gICAgICB7IHRhc2s6IFwibGlrZVwiLCB1cmw6IHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsIH0sXG4gICAgICByZXNwID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgbGlrZTogcmVzcC5jb250ZW50Lmxpa2VcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICApXG5cbiAgICBzZXRUaW1lb3V0KHRoaXMucHJvcHMub25DaGFuZ2UsIDEwMDApXG4gIH1cblxuICB1bmxpa2UoKSB7XG4gICAgdGhpcy5wcm9wcy5tZXNzYWdlcy5zZW5kKFxuICAgICAgeyB0YXNrOiBcInVubGlrZVwiLCB1cmw6IHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsIH0sXG4gICAgICByZXNwID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgbGlrZTogbnVsbFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIClcblxuICAgIHNldFRpbWVvdXQodGhpcy5wcm9wcy5vbkNoYW5nZSwgMTAwMClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuc2VsZWN0ZWQpIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2lkZWJhclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltYWdlXCI+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwibGlua1wiIGhyZWY9e3RoaXMucHJvcHMuc2VsZWN0ZWQudXJsfT5cbiAgICAgICAgICAgIDxVUkxJbWFnZSBjb250ZW50PXt0aGlzLnByb3BzLnNlbGVjdGVkfSAvPlxuICAgICAgICAgICAgPGgxPnt0aGlzLnByb3BzLnNlbGVjdGVkLnRpdGxlfTwvaDE+XG4gICAgICAgICAgICA8aDI+e2NsZWFuVVJMKHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsKX08L2gyPlxuICAgICAgICAgIDwvYT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJCdXR0b25zKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQnV0dG9ucygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidXR0b25zXCI+XG4gICAgICAgIHt0aGlzLnJlbmRlckxpa2VCdXR0b24oKX1cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWVudEJ1dHRvbigpfVxuICAgICAgICB7dGhpcy5wcm9wcy5zZWxlY3RlZC50eXBlID09PSBcInRvcFwiXG4gICAgICAgICAgPyB0aGlzLnJlbmRlckRlbGV0ZVRvcFNpdGVCdXR0b24oKVxuICAgICAgICAgIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckxpa2VCdXR0b24oKSB7XG4gICAgY29uc3QgYWdvID0gdGhpcy5zdGF0ZS5saWtlID8gcmVsYXRpdmVEYXRlKHRoaXMuc3RhdGUubGlrZS5jcmVhdGVkQXQpIDogXCJcIlxuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5zdGF0ZS5saWtlXG4gICAgICA/IFwiRGVsZXRlIHRoaXMgd2Vic2l0ZSBmcm9tIG15IGJvb2ttYXJrc1wiXG4gICAgICA6IFwiQm9va21hcmsgdGhpcyB3ZWJzaXRlXCJcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAgICAgY2xhc3NOYW1lPXtgYnV0dG9uIGxpa2UtYnV0dG9uICR7dGhpcy5zdGF0ZS5saWtlID8gXCJsaWtlZFwiIDogXCJcIn1gfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnRvZ2dsZUxpa2UoKX1cbiAgICAgID5cbiAgICAgICAgPEljb24gbmFtZT1cImhlYXJ0XCIgLz5cbiAgICAgICAge3RoaXMuc3RhdGUubGlrZSA/IGBMaWtlZCAke2Fnb31gIDogXCJMaWtlIEl0XCJ9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb21tZW50QnV0dG9uKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5saWtlKSByZXR1cm5cblxuICAgIGNvbnN0IGhvc3RuYW1lID0gZmluZEhvc3RuYW1lKHRoaXMuc3RhdGUubGlrZS51cmwpXG4gICAgY29uc3QgaXNIb21lcGFnZSA9IGNsZWFuVVJMKHRoaXMuc3RhdGUubGlrZS51cmwpLmluZGV4T2YoXCIvXCIpID09PSAtMVxuXG4gICAgaWYgKCFpc0hvbWVwYWdlKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8YVxuICAgICAgICB0aXRsZT17YENvbW1lbnRzIGFib3V0ICR7aG9zdG5hbWV9YH1cbiAgICAgICAgY2xhc3NOYW1lPXtgYnV0dG9uIGNvbW1lbnQtYnV0dG9uYH1cbiAgICAgICAgaHJlZj17YGh0dHBzOi8vZ2V0a296bW9zLmNvbS9zaXRlLyR7aG9zdG5hbWV9YH1cbiAgICAgID5cbiAgICAgICAgPEljb24gbmFtZT1cIm1lc3NhZ2VcIiAvPlxuICAgICAgICBDb21tZW50c1xuICAgICAgPC9hPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckRlbGV0ZVRvcFNpdGVCdXR0b24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgdGl0bGU9XCJEZWxldGUgSXQgRnJvbSBGcmVxdWVudGx5IFZpc2l0ZWRcIlxuICAgICAgICBjbGFzc05hbWU9XCJidXR0b24gZGVsZXRlLWJ1dHRvblwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuZGVsZXRlVG9wU2l0ZSgpfVxuICAgICAgPlxuICAgICAgICA8SWNvbiBuYW1lPVwidHJhc2hcIiAvPlxuICAgICAgICBEZWxldGUgSXRcbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFnYmFyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29udGVudCgpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuY29udGVudCB8fCAhdGhpcy5wcm9wcy5jb250ZW50Lmxlbmd0aCkgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBjb3B5ID0gdGhpcy5wcm9wcy5jb250ZW50LnNsaWNlKClcblxuICAgIGNvbnN0IG9jY3IgPSB7fVxuICAgIGxldCBpID0gY29weS5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBvY2NyW2NvcHlbaV1dID0gb2Njcltjb3B5W2ldXSA/IG9jY3JbY29weVtpXV0rMSA6IDFcbiAgICB9XG5cbiAgICBjb25zdCB1bmlxdWVzID0gT2JqZWN0LmtleXMob2NjcilcbiAgICB1bmlxdWVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChvY2NyW2FdIDwgb2NjcltiXSkgcmV0dXJuIDFcbiAgICAgIGlmIChvY2NyW2FdID4gb2NjcltiXSkgcmV0dXJuIC0xXG4gICAgICByZXR1cm4gMFxuICAgIH0pXG5cbiAgICByZXR1cm4gdW5pcXVlc1xuICB9XG5cbiAgbWF4KCkge1xuICAgIHJldHVybiAxMFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQoKVxuICAgIGlmIChjb250ZW50Lmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YWdiYXJcIj5cbiAgICAgICAgPEljb24gbmFtZT1cInRhZ1wiIHN0cm9rZT1cIjNcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBlcnNvbmFsLXRhZ3NcIj5cbiAgICAgICAgICB7Y29udGVudC5zbGljZSgwLCB0aGlzLm1heCgpKS5tYXAodCA9PiB0aGlzLnJlbmRlclRhZyh0KSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGFnKG5hbWUpIHtcbiAgICBjb25zdCB0aXRsZSA9IGNhcGl0YWxpemUobmFtZSlcblxuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJ0YWcgYnV0dG9uXCIgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vcGVuVGFnKG5hbWUpfSB0aXRsZT17YE9wZW4gXCIke3RpdGxlfVwiIHRhZ2B9PlxuICAgICAgICB7dGl0bGV9XG4gICAgICA8L2E+XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNhcGl0YWxpemUgKHRpdGxlKSB7XG4gIHJldHVybiB0aXRsZS5zcGxpdCgvXFxzKy8pLm1hcCh3ID0+IHcuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHcuc2xpY2UoMSkpLmpvaW4oJyAnKVxufVxuIiwiaW1wb3J0IHRpdGxlRnJvbVVSTCBmcm9tIFwidGl0bGUtZnJvbS11cmxcIlxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZCh0aXRsZSkge1xuICBjb25zdCBhYnNsZW4gPSB0aXRsZS5yZXBsYWNlKC9bXlxcd10rL2csICcnKS5sZW5ndGhcbiAgcmV0dXJuIGFic2xlbiA+PSAyICYmICEvXmh0dHBcXHc/OlxcL1xcLy8udGVzdCh0aXRsZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZSh0aXRsZSkge1xuICByZXR1cm4gdGl0bGUudHJpbSgpLnJlcGxhY2UoL15cXChcXGQrXFwpLywgJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUZyb21VUkwodXJsKSB7XG4gIHJldHVybiB0aXRsZUZyb21VUkwodXJsKVxufVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvcFNpdGVzIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMudGl0bGUgPSBcIkZyZXF1ZW50bHkgVmlzaXRlZFwiXG4gICAgdGhpcy5uYW1lID0gXCJ0b3BcIlxuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5Lmxlbmd0aCA9PSAwXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICByZXR1cm4gdGhpcy5hbGwoKVxuICB9XG5cbiAgYWxsKCkge1xuICAgIGdldChyb3dzID0+IHRoaXMuYWRkKHJvd3Muc2xpY2UoMCwgNSkpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEtvem1vcyhyb3dzKSB7XG4gIGxldCBpID0gcm93cy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChyb3dzW2ldLnVybC5pbmRleE9mKFwiZ2V0a296bW9zLmNvbVwiKSA+IC0xKSB7XG4gICAgICByZXR1cm4gcm93c1xuICAgIH1cbiAgfVxuXG4gIHJvd3NbNF0gPSB7XG4gICAgdXJsOiBcImh0dHBzOi8vZ2V0a296bW9zLmNvbVwiLFxuICAgIHRpdGxlOiBcIktvem1vc1wiXG4gIH1cblxuICByZXR1cm4gcm93c1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0KGNhbGxiYWNrKSB7XG4gIGNocm9tZS50b3BTaXRlcy5nZXQodG9wU2l0ZXMgPT4ge1xuICAgIGNhbGxiYWNrKGZpbHRlcih0b3BTaXRlcykpXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlKHVybCkge1xuICBsZXQgaGlkZGVuID0gZ2V0SGlkZGVuVG9wU2l0ZXMoKVxuICBoaWRkZW5bdXJsXSA9IHRydWVcbiAgc2V0SGlkZGVuVG9wU2l0ZXMoaGlkZGVuKVxufVxuXG5mdW5jdGlvbiBnZXRIaWRkZW5Ub3BTaXRlcygpIHtcbiAgbGV0IGxpc3QgPSB7XG4gICAgXCJodHRwczovL2dvb2dsZS5jb20vXCI6IHRydWUsXG4gICAgXCJodHRwOi8vZ29vZ2xlLmNvbS9cIjogdHJ1ZVxuICB9XG5cbiAgdHJ5IHtcbiAgICBsaXN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbXCJoaWRkZW4tdG9wbGlzdFwiXSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgc2V0SGlkZGVuVG9wU2l0ZXMobGlzdClcbiAgfVxuXG4gIHJldHVybiBsaXN0XG59XG5cbmZ1bmN0aW9uIHNldEhpZGRlblRvcFNpdGVzKGxpc3QpIHtcbiAgbG9jYWxTdG9yYWdlW1wiaGlkZGVuLXRvcGxpc3RcIl0gPSBKU09OLnN0cmluZ2lmeShsaXN0KVxufVxuXG5mdW5jdGlvbiBmaWx0ZXIodG9wU2l0ZXMpIHtcbiAgY29uc3QgaGlkZSA9IGdldEhpZGRlblRvcFNpdGVzKClcbiAgcmV0dXJuIHRvcFNpdGVzLmZpbHRlcihyb3cgPT4gIWhpZGVbcm93LnVybF0pXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBpbWcgZnJvbSBcImltZ1wiXG5pbXBvcnQgeyBjbGVhbiBhcyBjbGVhblVSTCB9IGZyb20gXCJ1cmxzXCJcbmltcG9ydCAqIGFzIHRpdGxlcyBmcm9tIFwiLi90aXRsZXNcIlxuaW1wb3J0IFVSTEltYWdlIGZyb20gJy4vdXJsLWltYWdlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVUkxJY29uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmNvbnRlbnQudXJsICE9PSBuZXh0UHJvcHMuY29udGVudC51cmwgfHxcbiAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWQgIT09IG5leHRQcm9wcy5zZWxlY3RlZCB8fFxuICAgICAgdGhpcy5wcm9wcy50eXBlICE9PSBuZXh0UHJvcHMudHlwZVxuICB9XG5cbiAgc2VsZWN0KCkge1xuICAgIHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy5jb250ZW50KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBpZD17dGhpcy5wcm9wcy5jb250ZW50LmlkfSBjbGFzc05hbWU9e2B1cmxpY29uICR7dGhpcy5wcm9wcy5zZWxlY3RlZCA/IFwic2VsZWN0ZWRcIiA6IFwiXCJ9YH0gaHJlZj17dGhpcy51cmwoKX0gdGl0bGU9e2Ake3RoaXMudGl0bGUoKX0gLSAke2NsZWFuVVJMKHRoaXMucHJvcHMuY29udGVudC51cmwpfWB9IG9uTW91c2VNb3ZlPXsoKSA9PiB0aGlzLnNlbGVjdCgpfT5cbiAgICAgICAgPFVSTEltYWdlIGNvbnRlbnQ9e3RoaXMucHJvcHMuY29udGVudH0gaWNvbi1vbmx5IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICB7dGhpcy50aXRsZSgpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cmxcIj5cbiAgICAgICAgICB7dGhpcy5wcmV0dHlVUkwoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIj48L2Rpdj5cbiAgICAgIDwvYT5cbiAgICApXG4gIH1cblxuICB0aXRsZSgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jb250ZW50LnR5cGUgPT09ICdzZWFyY2gtcXVlcnknKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5jb250ZW50LnRpdGxlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC50eXBlID09PSAndXJsLXF1ZXJ5Jykge1xuICAgICAgcmV0dXJuIGBPcGVuICR7Y2xlYW5VUkwodGhpcy5wcm9wcy5jb250ZW50LnVybCl9YFxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNvbnRlbnQudGl0bGUgJiYgdGl0bGVzLmlzVmFsaWQodGhpcy5wcm9wcy5jb250ZW50LnRpdGxlKSkge1xuICAgICAgcmV0dXJuIHRpdGxlcy5ub3JtYWxpemUodGhpcy5wcm9wcy5jb250ZW50LnRpdGxlKVxuICAgIH1cblxuICAgIHJldHVybiB0aXRsZXMuZ2VuZXJhdGVGcm9tVVJMKHRoaXMucHJvcHMuY29udGVudC51cmwpXG4gIH1cblxuICB1cmwoKSB7XG4gICAgaWYgKC9eaHR0cHM/OlxcL1xcLy8udGVzdCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY29udGVudC51cmxcbiAgICB9XG5cbiAgICByZXR1cm4gJ2h0dHA6Ly8nICsgdGhpcy5wcm9wcy5jb250ZW50LnVybFxuICB9XG5cbiAgcHJldHR5VVJMKCkge1xuICAgIHJldHVybiBjbGVhblVSTCh0aGlzLnVybCgpKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBpbWcgZnJvbSAnaW1nJ1xuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5pbXBvcnQgcmFuZG9tQ29sb3IgZnJvbSBcInJhbmRvbS1jb2xvclwiXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcblxuZXhwb3J0IGNvbnN0IHBvcHVsYXJJY29ucyA9IHtcbiAgJ2ZhY2Vib29rLmNvbSc6ICdodHRwczovL3N0YXRpYy54eC5mYmNkbi5uZXQvcnNyYy5waHAvdjMveXgvci9ONEhfNTBLRnA4aS5wbmcnLFxuICAndHdpdHRlci5jb20nOiAnaHR0cHM6Ly9tYS0wLnR3aW1nLmNvbS90d2l0dGVyLWFzc2V0cy9yZXNwb25zaXZlLXdlYi93ZWIvbHRyL2ljb24taW9zLmE5Y2Q4ODViY2NiY2FmMmYucG5nJyxcbiAgJ3lvdXR1YmUuY29tJzogJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3l0cy9pbWcvZmF2aWNvbl85Ni12ZmxXOUVjMHcucG5nJyxcbiAgJ2FtYXpvbi5jb20nOiAnaHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9HLzAxL2FueXdoZXJlL2Ffc21pbGVfMTIweDEyMC5fQ0IzNjgyNDY1NzNfLnBuZycsXG4gICdnb29nbGUuY29tJzogJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2JyYW5kaW5nL3Byb2R1Y3RfaW9zLzJ4L2dzYV9pb3NfNjBkcC5wbmcnLFxuICAneWFob28uY29tJzogJ2h0dHBzOi8vd3d3LnlhaG9vLmNvbS9hcHBsZS10b3VjaC1pY29uLXByZWNvbXBvc2VkLnBuZycsXG4gICdyZWRkaXQuY29tJzogJ2h0dHBzOi8vd3d3LnJlZGRpdHN0YXRpYy5jb20vbXdlYjJ4L2Zhdmljb24vMTIweDEyMC5wbmcnLFxuICAnaW5zdGFncmFtLmNvbSc6ICdodHRwczovL3d3dy5pbnN0YWdyYW0uY29tL3N0YXRpYy9pbWFnZXMvaWNvL2FwcGxlLXRvdWNoLWljb24tMTIweDEyMC1wcmVjb21wb3NlZC5wbmcvMDA0NzA1YzkzNTNmLnBuZycsXG4gICdnZXRrb3ptb3MuY29tJzogJ2h0dHBzOi8vZ2V0a296bW9zLmNvbS9wdWJsaWMvbG9nb3Mva296bW9zLWhlYXJ0LWxvZ28tMTAwcHgucG5nJyxcbiAgJ2dpdGh1Yi5jb20nOiAnaHR0cHM6Ly9hc3NldHMtY2RuLmdpdGh1Yi5jb20vcGlubmVkLW9jdG9jYXQuc3ZnJyxcbiAgJ2dpc3QuZ2l0aHViLmNvbSc6ICdodHRwczovL2Fzc2V0cy1jZG4uZ2l0aHViLmNvbS9waW5uZWQtb2N0b2NhdC5zdmcnLFxuICAnbWFpbC5nb29nbGUuY29tJzogJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2ljb25zL3Byb2R1Y3QvZ29vZ2xlbWFpbC0xMjgucG5nJyxcbiAgJ3BheXBhbC5jb20nOiAnaHR0cHM6Ly93d3cucGF5cGFsb2JqZWN0cy5jb20vd2Vic3RhdGljL2ljb24vcHAxNDQucG5nJyxcbiAgJ2ltZGIuY29tJzogJ2h0dHA6Ly9pYS5tZWRpYS1pbWRiLmNvbS9pbWFnZXMvRy8wMS9pbWRiL2ltYWdlcy9kZXNrdG9wLWZhdmljb24tMjE2NTgwNjk3MC5fQ0I1MjI3MzY1NjFfLmljbycsXG4gICdlbi53aWtpcGVkaWEub3JnJzogJ2h0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy9zdGF0aWMvZmF2aWNvbi93aWtpcGVkaWEuaWNvJyxcbiAgJ3dpa2lwZWRpYS5vcmcnOiAnaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3N0YXRpYy9mYXZpY29uL3dpa2lwZWRpYS5pY28nLFxuICAnZXNwbi5jb20nOiAnaHR0cDovL2EuZXNwbmNkbi5jb20vZmF2aWNvbi5pY28nLFxuICAndHdpdGNoLnR2JzogJ2h0dHBzOi8vc3RhdGljLnR3aXRjaGNkbi5uZXQvYXNzZXRzL2Zhdmljb24tNzUyNzBmOWRmMmIwNzE3NGMyM2NlODQ0YTAzZDg0YWYuaWNvJyxcbiAgJ2Nubi5jb20nOiAnaHR0cDovL2Nkbi5jbm4uY29tL2Nubi8uZS9pbWcvMy4wL2dsb2JhbC9taXNjL2FwcGxlLXRvdWNoLWljb24ucG5nJyxcbiAgJ29mZmljZS5jb20nOiAnaHR0cHM6Ly9zZWFvZmZpY2Vob21lLm1zb2Nkbi5jb20vcy83MDQ3NDUyZS9JbWFnZXMvZmF2aWNvbl9tZXRyby5pY28nLFxuICAnYmFua29mYW1lcmljYS5jb20nOiAnaHR0cHM6Ly93d3cxLmJhYy1hc3NldHMuY29tL2hvbWVwYWdlL3NwYS1hc3NldHMvaW1hZ2VzL2Fzc2V0cy1pbWFnZXMtZ2xvYmFsLWZhdmljb24tZmF2aWNvbi1DU1gzODZiMzMyZC5pY28nLFxuICAnY2hhc2UuY29tJzogJ2h0dHBzOi8vd3d3LmNoYXNlLmNvbS9ldGMvZGVzaWducy9jaGFzZS11eC9mYXZpY29uLTE1Mi5wbmcnLFxuICAnbnl0aW1lcy5jb20nOiAnaHR0cHM6Ly9zdGF0aWMwMS5ueXQuY29tL2ltYWdlcy9pY29ucy9pb3MtaXBhZC0xNDR4MTQ0LnBuZycsXG4gICdhcHBsZS5jb20nOiAnaHR0cHM6Ly93d3cuYXBwbGUuY29tL2Zhdmljb24uaWNvJyxcbiAgJ3dlbGxzZmFyZ28uY29tJzogJ2h0dHBzOi8vd3d3LndlbGxzZmFyZ28uY29tL2Fzc2V0cy9pbWFnZXMvaWNvbnMvYXBwbGUtdG91Y2gtaWNvbi0xMjB4MTIwLnBuZycsXG4gICd5ZWxwLmNvbSc6ICdodHRwczovL3MzLW1lZGlhMi5mbC55ZWxwY2RuLmNvbS9hc3NldHMvc3J2MC95ZWxwX3N0eWxlZ3VpZGUvMTE4ZmY0NzVhMzQxL2Fzc2V0cy9pbWcvbG9nb3MvZmF2aWNvbi5pY28nLFxuICAnd29yZHByZXNzLmNvbSc6ICdodHRwOi8vczAud3AuY29tL2kvd2ViY2xpcC5wbmcnLFxuICAnZHJvcGJveC5jb20nOiAnaHR0cHM6Ly9jZmwuZHJvcGJveHN0YXRpYy5jb20vc3RhdGljL2ltYWdlcy9mYXZpY29uLXZmbFVlTGVlWS5pY28nLFxuICAnbWFpbC5zdXBlcmh1bWFuLmNvbSc6ICdodHRwczovL3N1cGVyaHVtYW4uY29tL2J1aWxkLzcxMjIyYmRjMTY5ZTU5MDZjMjgyNDdlZDViN2NmMGVkLnNoYXJlLWljb24ucG5nJyxcbiAgJ2F3cy5hbWF6b24uY29tJzogJ2h0dHBzOi8vYTAuYXdzc3RhdGljLmNvbS9saWJyYS1jc3MvaW1hZ2VzL3NpdGUvdG91Y2gtaWNvbi1pcGhvbmUtMTE0LXNtaWxlLnBuZycsXG4gICdjb25zb2xlLmF3cy5hbWF6b24uY29tJzogJ2h0dHBzOi8vYTAuYXdzc3RhdGljLmNvbS9saWJyYS1jc3MvaW1hZ2VzL3NpdGUvdG91Y2gtaWNvbi1pcGhvbmUtMTE0LXNtaWxlLnBuZycsXG4gICd1cy13ZXN0LTIuY29uc29sZS5hd3MuYW1hem9uLmNvbSc6ICdodHRwczovL2EwLmF3c3N0YXRpYy5jb20vbGlicmEtY3NzL2ltYWdlcy9zaXRlL3RvdWNoLWljb24taXBob25lLTExNC1zbWlsZS5wbmcnLFxuICAnc3RhY2tvdmVyZmxvdy5jb20nOiAnaHR0cHM6Ly9jZG4uc3N0YXRpYy5uZXQvU2l0ZXMvc3RhY2tvdmVyZmxvdy9pbWcvYXBwbGUtdG91Y2gtaWNvbi5wbmcnXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVSTEltYWdlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLl9yZWZyZXNoU291cmNlID0gZGVib3VuY2UodGhpcy5yZWZyZXNoU291cmNlLmJpbmQodGhpcykpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC51cmwgIT09IHByb3BzLmNvbnRlbnQudXJsKSB7XG4gICAgICB0aGlzLl9yZWZyZXNoU291cmNlKHByb3BzLmNvbnRlbnQpXG4gICAgfVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgaWYgKG5leHRQcm9wcy5jb250ZW50LnVybCAhPT0gdGhpcy5wcm9wcy5jb250ZW50LnVybCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobmV4dFN0YXRlLnNyYyAhPT0gdGhpcy5zdGF0ZS5zcmMpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG5leHRTdGF0ZS5sb2FkaW5nICE9PSB0aGlzLnN0YXRlLmxvYWRpbmcgfHwgbmV4dFN0YXRlLmVycm9yICE9PSB0aGlzLnN0YXRlLmVycm9yKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmICgoIW5leHRQcm9wcy5jb250ZW50LmltYWdlcyB8fCB0aGlzLnByb3BzLmNvbnRlbnQuaW1hZ2VzKSB8fCAobmV4dFByb3BzLmNvbnRlbnQuaW1hZ2VzIHx8ICF0aGlzLnByb3BzLmNvbnRlbnQuaW1hZ2VzKSB8fCAobmV4dFByb3BzLmNvbnRlbnQuaW1hZ2VzWzBdICE9PSB0aGlzLnByb3BzLmNvbnRlbnQuaW1hZ2VzWzBdKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB0aGlzLnJlZnJlc2hTb3VyY2UoKVxuICB9XG5cbiAgcmVmcmVzaFNvdXJjZShjb250ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb2xvcjogcmFuZG9tQ29sb3IoMTAwLCA1MClcbiAgICB9KVxuXG4gICAgdGhpcy5maW5kU291cmNlKGNvbnRlbnQpXG4gICAgdGhpcy5wcmVsb2FkKHRoaXMuc3RhdGUuc3JjKVxuICB9XG5cbiAgZmluZFNvdXJjZShjb250ZW50KSB7XG4gICAgY29udGVudCB8fCAoY29udGVudCA9IHRoaXMucHJvcHMuY29udGVudClcblxuICAgIGlmICghdGhpcy5wcm9wc1snaWNvbi1vbmx5J10gJiYgY29udGVudC5pbWFnZXMgJiYgY29udGVudC5pbWFnZXMubGVuZ3RoID4gMCAmJiBjb250ZW50LmltYWdlc1swXSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzcmM6IGNvbnRlbnQuaW1hZ2VzWzBdXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChjb250ZW50Lmljb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdHlwZTogJ2ljb24nLFxuICAgICAgICBzcmM6IGFic29sdXRlSWNvblVSTChjb250ZW50KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBob3N0bmFtZSA9IGZpbmRIb3N0bmFtZShjb250ZW50LnVybClcbiAgICBpZiAocG9wdWxhckljb25zW2hvc3RuYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0eXBlOiAncG9wdWxhci1pY29uJyxcbiAgICAgICAgc3JjOiBwb3B1bGFySWNvbnNbaG9zdG5hbWVdXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdHlwZTogJ2Zhdmljb24nLFxuICAgICAgc3JjOiAnaHR0cDovLycgKyBob3N0bmFtZSArICcvZmF2aWNvbi5pY28nXG4gICAgfSlcbiAgfVxuXG4gIHByZWxvYWQoc3JjKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubG9hZGluZyAmJiB0aGlzLnN0YXRlLmxvYWRpbmdGb3IgPT09IHRoaXMucHJvcHMuY29udGVudC51cmwpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBsb2FkaW5nRm9yOiB0aGlzLnByb3BzLmNvbnRlbnQudXJsLFxuICAgICAgbG9hZGluZ1NyYzogc3JjLFxuICAgICAgc3JjOiB0aGlzLmNhY2hlZEljb25VUkwoKVxuICAgIH0pXG5cbiAgICBpbWcoc3JjLCBlcnIgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUubG9hZGluZ1NyYyAhPT0gc3JjKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICBlcnJvcjogZXJyLFxuICAgICAgICAgIHNyYzogdGhpcy5jYWNoZWRJY29uVVJMKClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNyYzogc3JjLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGxcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5sb2FkaW5nIHx8IHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRpbmcoKVxuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7dGhpcy5zdGF0ZS5zcmN9KWBcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2B1cmwtaW1hZ2UgJHt0aGlzLnN0YXRlLnR5cGV9YH0gc3R5bGU9e3N0eWxlfT48L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJMb2FkaW5nKCkge1xuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnN0YXRlLmNvbG9yXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS1lcnJvcj17dGhpcy5zdGF0ZS5lcnJvcn0gZGF0YS10eXBlPXt0aGlzLnN0YXRlLnR5cGV9IGRhdGEtc3JjPXt0aGlzLnN0YXRlLnNyY30gY2xhc3NOYW1lPVwidXJsLWltYWdlIGdlbmVyYXRlZC1pbWFnZSBjZW50ZXJcIiBzdHlsZT17c3R5bGV9PlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICB7ZmluZEhvc3RuYW1lKHRoaXMucHJvcHMuY29udGVudC51cmwpLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCl9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNhY2hlZEljb25VUkwoKSB7XG4gICAgcmV0dXJuICdjaHJvbWU6Ly9mYXZpY29uL3NpemUvNzIvJyArIGZpbmRQcm90b2NvbCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKSArICc6Ly8nICsgZmluZEhvc3RuYW1lKHRoaXMucHJvcHMuY29udGVudC51cmwpXG4gIH1cblxufVxuXG5mdW5jdGlvbiBhYnNvbHV0ZUljb25VUkwgKGxpa2UpIHtcbiAgaWYgKC9eaHR0cHM/OlxcL1xcLy8udGVzdChsaWtlLmljb24pKSByZXR1cm4gbGlrZS5pY29uXG4gIHJldHVybiAnaHR0cDpcXC9cXC8nICsgam9pbihmaW5kSG9zdG5hbWUobGlrZS51cmwpLCBsaWtlLmljb24pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSG9zdG5hbWUodXJsKSB7XG4gIHJldHVybiB1cmwucmVwbGFjZSgvXlxcdys6XFwvXFwvLywgJycpLnNwbGl0KCcvJylbMF0ucmVwbGFjZSgvXnd3d1xcLi8sICcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFByb3RvY29sKHVybCkge1xuICBpZiAoIS9eaHR0cHM/OlxcL1xcLy8udGVzdCh1cmwpKSByZXR1cm4gJ2h0dHAnXG4gIHJldHVybiB1cmwuc3BsaXQoJzovLycpWzBdXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCB3YWxscGFwZXJzIGZyb20gJy4vd2FsbHBhcGVycydcbmNvbnN0IE9ORV9EQVkgPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGxwYXBlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHNlbGVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLnNyYyh0aGlzLnRvZGF5KCkgICsgKHRoaXMucHJvcHMuaW5kZXggfHwgMCkpXG4gIH1cblxuICB0b2RheSgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMClcbiAgICBjb25zdCBkaWZmID0gKG5vdyAtIHN0YXJ0KSArICgoc3RhcnQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIG5vdy5nZXRUaW1lem9uZU9mZnNldCgpKSAqIDYwICogMTAwMClcbiAgICByZXR1cm4gTWF0aC5mbG9vcihkaWZmIC8gT05FX0RBWSlcbiAgfVxuXG4gIHNyYyhpbmRleCkge1xuICAgIHJldHVybiB3YWxscGFwZXJzW2luZGV4ICUgd2FsbHBhcGVycy5sZW5ndGhdXG4gIH1cblxuICB3aWR0aCgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGhcbiAgfVxuXG4gIHVybChzcmMpIHtcbiAgICByZXR1cm4gc3JjLnVybCArICc/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz0nICsgdGhpcy53aWR0aCgpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc3JjID0gdGhpcy5zZWxlY3RlZCgpXG5cbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke3RoaXMudXJsKHNyYyl9KWBcbiAgICB9XG5cbiAgICBpZiAoc3JjLnBvc2l0aW9uKSB7XG4gICAgICBzdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBzcmMucG9zaXRpb25cbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YWxscGFwZXJcIiBzdHlsZT17c3R5bGV9PjwvZGl2PlxuICAgIClcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NDQ0NjQ2NjYxNjgtNDlkNjMzYjg2Nzk3XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDUwODQ5NjA4ODgwLTZmNzg3NTQyYzg4YVwiIH0sXG4gIHsgXCJwb3NpdGlvblwiOiBcInRvcCBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQyOTUxNjM4NzQ1OS05ODkxYjdiOTZjNzhcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0Njk4NTQ1MjMwODYtY2MwMmZlNWQ4ODAwXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDg4NzI0MDM0OTU4LTBmYWFkODhjZjY5ZlwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQzMDY1MTcxNzUwNC1lYmI5ZTNlNjc5NWVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NDE4MDIyNTk4NzgtYTEzZjczMmNlNDEwXCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6IFwiYm90dG9tIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk0MjAwNDgzMDM1LWRiN2JjNmFhNTczOVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1OTI1ODM1MDg3OS0zNDg4NjMxOWEzYzlcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDcwOTg5MjYzMzEtOGQzMjRiMTM5ZDE1XCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6IFwidG9wIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk0MzAxOTUwNjI0LTJjNTRjYzk4MjZjNVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ4MDQ5OTQ4NDI2OC1hODVhMjQxNGRhODFcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0ODMxMTY1MzE1MjItNGM0ZTUyNWY1MDRlXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDc5MDMwMTYwMTgwLWIxODYwOTUxZDY5NlwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxMDM1MzYyMjc1OC02MmUzYjYzYjVmYjVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDE0NDY2OTA4NTItZGE1NWRmN2JmZTA3XCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6IFwidG9wIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTAxODYyMTY5Mjg2LTUxOGMyOTFlM2VlZFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ2OTQ3NDk2ODAyOC01NjYyM2YwMmU0MmVcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJ0b3AgY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzkwMzAxNjAxODAtYjE4NjA5NTFkNjk2XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDMxODg3NzczMDQyLTgwM2VkNTJiZWQyNlwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwMDUxNDk2NjkwNi1mZTI0NWVlYTkzNDRcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJib3R0b20gY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NjU0MDExODA0ODktY2ViNWEzNGQ4YTYzXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA1Mjk5OTE2MTM3LWI2OTc5M2E2NjkwN1wiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNDQ2MTE1NDAwNS0zMWI0MzVlNjg3ZWRcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDQ3NDAxOTEwNDUtNjNlMTUyNTFlNzUwXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDMxNzk0MDYyMjMyLTJhOTlhNTQzMWM2Y1wiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNDkwODQxNTAyNS1iN2MyNTYwOTQ2OTNcIiB9LFxuICB7IFwicG9zaXRpb25cIjpcImJvdHRvbSBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwMTk2MzQyMjc2Mi0zZDg5YmQ5ODk1NjhcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzAwNzE0NTk2MDQtM2I1ZWMzYTdmZTA1XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDk5MjQwNzEzNjc3LTJjN2E0ZjY5MjA0NFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ5MDQ2NDM0ODE2Ni04YjhiYmQ5ZjFlMmVcIiB9LFxuICB7IFwicG9zaXRpb25cIjpcInRvcCBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1NTMyNTUyODA1NS1hZDgxNWFmZWNlYmVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzgwMzMzOTQxNTEtYzkzMWQ1YTRiZGQ2XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDQ5MDM0NDQ2ODUzLTY2Yzg2MTQ0YjBhZFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNTA1MzI2MjY5MS02MjQwNjNmOTRiNjVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9jMi5zdGF0aWNmbGlja3IuY29tLzQvMzkxMy8xNDk0NTcwMjczNl85ZDI4MzA0NGE3X2guanBnXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vYzIuc3RhdGljZmxpY2tyLmNvbS80LzM4OTYvMTQyMTUzODMwOTdfYmQwNzM0MmU4ZV9oLmpwZ1wiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2MyLnN0YXRpY2ZsaWNrci5jb20vNi81MDM1LzE0MTAzMjY4MDI2XzI1ZWQ5NmY4MTFfby5qcGdcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9jMS5zdGF0aWNmbGlja3IuY29tLzMvMjgyNS8xMzQ2NDkzMTc3NF81ZWE5NjYwOGFhX2guanBnXCIgfVxuXVxuIiwibW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcblxuZnVuY3Rpb24gZGVib3VuY2UgKGZuLCB3YWl0KSB7XG4gIHZhciB0aW1lcjtcbiAgdmFyIGFyZ3M7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgIHdhaXQgPSAyNTA7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aW1lciAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICB0aW1lciA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH07XG59XG4iLCJcbi8qKlxuICogRXNjYXBlIHJlZ2V4cCBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKC8oWy4qKz89XiE6JHt9KCl8W1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gaW1nO1xuXG5mdW5jdGlvbiBpbWcgKHNyYywgb3B0LCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0XG4gICAgb3B0ID0gbnVsbFxuICB9XG5cblxuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgdmFyIGxvY2tlZDtcblxuICBlbC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGxvY2tlZCkgcmV0dXJuO1xuICAgIGxvY2tlZCA9IHRydWU7XG5cbiAgICBjYWxsYmFjayAmJiBjYWxsYmFjayh1bmRlZmluZWQsIGVsKTtcbiAgfTtcblxuICBlbC5vbmVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChsb2NrZWQpIHJldHVybjtcbiAgICBsb2NrZWQgPSB0cnVlO1xuXG4gICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobmV3IEVycm9yKCdVbmFibGUgdG8gbG9hZCBcIicgKyBzcmMgKyAnXCInKSwgZWwpO1xuICB9O1xuICBcbiAgaWYgKG9wdCAmJiBvcHQuY3Jvc3NPcmlnaW4pXG4gICAgZWwuY3Jvc3NPcmlnaW4gPSBvcHQuY3Jvc3NPcmlnaW47XG5cbiAgZWwuc3JjID0gc3JjO1xuXG4gIHJldHVybiBlbDtcbn1cbiIsIi8vIC5kaXJuYW1lLCAuYmFzZW5hbWUsIGFuZCAuZXh0bmFtZSBtZXRob2RzIGFyZSBleHRyYWN0ZWQgZnJvbSBOb2RlLmpzIHY4LjExLjEsXG4vLyBiYWNrcG9ydGVkIGFuZCB0cmFuc3BsaXRlZCB3aXRoIEJhYmVsLCB3aXRoIGJhY2t3YXJkcy1jb21wYXQgZml4ZXNcblxuLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKSxcbiAgICAgIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUoZmlsdGVyKHBhdGhzLCBmdW5jdGlvbihwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICAgIHJldHVybiBwO1xuICB9KS5qb2luKCcvJykpO1xufTtcblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZWxhdGl2ZSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBleHBvcnRzLnJlc29sdmUoZnJvbSkuc3Vic3RyKDEpO1xuICB0byA9IGV4cG9ydHMucmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufTtcblxuZXhwb3J0cy5zZXAgPSAnLyc7XG5leHBvcnRzLmRlbGltaXRlciA9ICc6JztcblxuZXhwb3J0cy5kaXJuYW1lID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9IHBhdGggKyAnJztcbiAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gJy4nO1xuICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdCgwKTtcbiAgdmFyIGhhc1Jvb3QgPSBjb2RlID09PSA0NyAvKi8qLztcbiAgdmFyIGVuZCA9IC0xO1xuICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgZm9yICh2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAxOyAtLWkpIHtcbiAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgIGVuZCA9IGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvclxuICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiBoYXNSb290ID8gJy8nIDogJy4nO1xuICBpZiAoaGFzUm9vdCAmJiBlbmQgPT09IDEpIHtcbiAgICAvLyByZXR1cm4gJy8vJztcbiAgICAvLyBCYWNrd2FyZHMtY29tcGF0IGZpeDpcbiAgICByZXR1cm4gJy8nO1xuICB9XG4gIHJldHVybiBwYXRoLnNsaWNlKDAsIGVuZCk7XG59O1xuXG5mdW5jdGlvbiBiYXNlbmFtZShwYXRoKSB7XG4gIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHBhdGggPSBwYXRoICsgJyc7XG5cbiAgdmFyIHN0YXJ0ID0gMDtcbiAgdmFyIGVuZCA9IC0xO1xuICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgdmFyIGk7XG5cbiAgZm9yIChpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgIGlmIChwYXRoLmNoYXJDb2RlQXQoaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZW5kID09PSAtMSkge1xuICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgLy8gcGF0aCBjb21wb25lbnRcbiAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgZW5kID0gaSArIDE7XG4gICAgfVxuICB9XG5cbiAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiAnJztcbiAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnQsIGVuZCk7XG59XG5cbi8vIFVzZXMgYSBtaXhlZCBhcHByb2FjaCBmb3IgYmFja3dhcmRzLWNvbXBhdGliaWxpdHksIGFzIGV4dCBiZWhhdmlvciBjaGFuZ2VkXG4vLyBpbiBuZXcgTm9kZS5qcyB2ZXJzaW9ucywgc28gb25seSBiYXNlbmFtZSgpIGFib3ZlIGlzIGJhY2twb3J0ZWQgaGVyZVxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uIChwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBiYXNlbmFtZShwYXRoKTtcbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHBhdGggPSBwYXRoICsgJyc7XG4gIHZhciBzdGFydERvdCA9IC0xO1xuICB2YXIgc3RhcnRQYXJ0ID0gMDtcbiAgdmFyIGVuZCA9IC0xO1xuICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgLy8gVHJhY2sgdGhlIHN0YXRlIG9mIGNoYXJhY3RlcnMgKGlmIGFueSkgd2Ugc2VlIGJlZm9yZSBvdXIgZmlyc3QgZG90IGFuZFxuICAvLyBhZnRlciBhbnkgcGF0aCBzZXBhcmF0b3Igd2UgZmluZFxuICB2YXIgcHJlRG90U3RhdGUgPSAwO1xuICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICBzdGFydFBhcnQgPSBpICsgMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICBpZiAoZW5kID09PSAtMSkge1xuICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgLy8gZXh0ZW5zaW9uXG4gICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgIGVuZCA9IGkgKyAxO1xuICAgIH1cbiAgICBpZiAoY29kZSA9PT0gNDYgLyouKi8pIHtcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXG4gICAgICAgIGlmIChzdGFydERvdCA9PT0gLTEpXG4gICAgICAgICAgc3RhcnREb3QgPSBpO1xuICAgICAgICBlbHNlIGlmIChwcmVEb3RTdGF0ZSAhPT0gMSlcbiAgICAgICAgICBwcmVEb3RTdGF0ZSA9IDE7XG4gICAgfSBlbHNlIGlmIChzdGFydERvdCAhPT0gLTEpIHtcbiAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgYW5kIG5vbi1wYXRoIHNlcGFyYXRvciBiZWZvcmUgb3VyIGRvdCwgc28gd2Ugc2hvdWxkXG4gICAgICAvLyBoYXZlIGEgZ29vZCBjaGFuY2UgYXQgaGF2aW5nIGEgbm9uLWVtcHR5IGV4dGVuc2lvblxuICAgICAgcHJlRG90U3RhdGUgPSAtMTtcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhcnREb3QgPT09IC0xIHx8IGVuZCA9PT0gLTEgfHxcbiAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgY2hhcmFjdGVyIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZG90XG4gICAgICBwcmVEb3RTdGF0ZSA9PT0gMCB8fFxuICAgICAgLy8gVGhlIChyaWdodC1tb3N0KSB0cmltbWVkIHBhdGggY29tcG9uZW50IGlzIGV4YWN0bHkgJy4uJ1xuICAgICAgcHJlRG90U3RhdGUgPT09IDEgJiYgc3RhcnREb3QgPT09IGVuZCAtIDEgJiYgc3RhcnREb3QgPT09IHN0YXJ0UGFydCArIDEpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnREb3QsIGVuZCk7XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iLCIhZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGZ1bmN0aW9uIGgobm9kZU5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGxhc3RTaW1wbGUsIGNoaWxkLCBzaW1wbGUsIGksIGNoaWxkcmVuID0gRU1QVFlfQ0hJTERSRU47XG4gICAgICAgIGZvciAoaSA9IGFyZ3VtZW50cy5sZW5ndGg7IGktLSA+IDI7ICkgc3RhY2sucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICBpZiAoYXR0cmlidXRlcyAmJiBudWxsICE9IGF0dHJpYnV0ZXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmICghc3RhY2subGVuZ3RoKSBzdGFjay5wdXNoKGF0dHJpYnV0ZXMuY2hpbGRyZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGF0dHJpYnV0ZXMuY2hpbGRyZW47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkgaWYgKChjaGlsZCA9IHN0YWNrLnBvcCgpKSAmJiB2b2lkIDAgIT09IGNoaWxkLnBvcCkgZm9yIChpID0gY2hpbGQubGVuZ3RoOyBpLS07ICkgc3RhY2sucHVzaChjaGlsZFtpXSk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgY2hpbGQpIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChzaW1wbGUgPSAnZnVuY3Rpb24nICE9IHR5cGVvZiBub2RlTmFtZSkgaWYgKG51bGwgPT0gY2hpbGQpIGNoaWxkID0gJyc7IGVsc2UgaWYgKCdudW1iZXInID09IHR5cGVvZiBjaGlsZCkgY2hpbGQgPSBTdHJpbmcoY2hpbGQpOyBlbHNlIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgY2hpbGQpIHNpbXBsZSA9ICExO1xuICAgICAgICAgICAgaWYgKHNpbXBsZSAmJiBsYXN0U2ltcGxlKSBjaGlsZHJlbltjaGlsZHJlbi5sZW5ndGggLSAxXSArPSBjaGlsZDsgZWxzZSBpZiAoY2hpbGRyZW4gPT09IEVNUFRZX0NISUxEUkVOKSBjaGlsZHJlbiA9IFsgY2hpbGQgXTsgZWxzZSBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIGxhc3RTaW1wbGUgPSBzaW1wbGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHAgPSBuZXcgVk5vZGUoKTtcbiAgICAgICAgcC5ub2RlTmFtZSA9IG5vZGVOYW1lO1xuICAgICAgICBwLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHAuYXR0cmlidXRlcyA9IG51bGwgPT0gYXR0cmlidXRlcyA/IHZvaWQgMCA6IGF0dHJpYnV0ZXM7XG4gICAgICAgIHAua2V5ID0gbnVsbCA9PSBhdHRyaWJ1dGVzID8gdm9pZCAwIDogYXR0cmlidXRlcy5rZXk7XG4gICAgICAgIGlmICh2b2lkIDAgIT09IG9wdGlvbnMudm5vZGUpIG9wdGlvbnMudm5vZGUocCk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBleHRlbmQob2JqLCBwcm9wcykge1xuICAgICAgICBmb3IgKHZhciBpIGluIHByb3BzKSBvYmpbaV0gPSBwcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xvbmVFbGVtZW50KHZub2RlLCBwcm9wcykge1xuICAgICAgICByZXR1cm4gaCh2bm9kZS5ub2RlTmFtZSwgZXh0ZW5kKGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyksIHByb3BzKSwgYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiB2bm9kZS5jaGlsZHJlbik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVucXVldWVSZW5kZXIoY29tcG9uZW50KSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9fZCAmJiAoY29tcG9uZW50Ll9fZCA9ICEwKSAmJiAxID09IGl0ZW1zLnB1c2goY29tcG9uZW50KSkgKG9wdGlvbnMuZGVib3VuY2VSZW5kZXJpbmcgfHwgZGVmZXIpKHJlcmVuZGVyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVyZW5kZXIoKSB7XG4gICAgICAgIHZhciBwLCBsaXN0ID0gaXRlbXM7XG4gICAgICAgIGl0ZW1zID0gW107XG4gICAgICAgIHdoaWxlIChwID0gbGlzdC5wb3AoKSkgaWYgKHAuX19kKSByZW5kZXJDb21wb25lbnQocCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzU2FtZU5vZGVUeXBlKG5vZGUsIHZub2RlLCBoeWRyYXRpbmcpIHtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHJldHVybiB2b2lkIDAgIT09IG5vZGUuc3BsaXRUZXh0O1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlLm5vZGVOYW1lKSByZXR1cm4gIW5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yICYmIGlzTmFtZWROb2RlKG5vZGUsIHZub2RlLm5vZGVOYW1lKTsgZWxzZSByZXR1cm4gaHlkcmF0aW5nIHx8IG5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNOYW1lZE5vZGUobm9kZSwgbm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuX19uID09PSBub2RlTmFtZSB8fCBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5vZGVQcm9wcyh2bm9kZSkge1xuICAgICAgICB2YXIgcHJvcHMgPSBleHRlbmQoe30sIHZub2RlLmF0dHJpYnV0ZXMpO1xuICAgICAgICBwcm9wcy5jaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0gdm5vZGUubm9kZU5hbWUuZGVmYXVsdFByb3BzO1xuICAgICAgICBpZiAodm9pZCAwICE9PSBkZWZhdWx0UHJvcHMpIGZvciAodmFyIGkgaW4gZGVmYXVsdFByb3BzKSBpZiAodm9pZCAwID09PSBwcm9wc1tpXSkgcHJvcHNbaV0gPSBkZWZhdWx0UHJvcHNbaV07XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTm9kZShub2RlTmFtZSwgaXNTdmcpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBpc1N2ZyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBub2RlTmFtZSkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcbiAgICAgICAgbm9kZS5fX24gPSBub2RlTmFtZTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudE5vZGUpIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldEFjY2Vzc29yKG5vZGUsIG5hbWUsIG9sZCwgdmFsdWUsIGlzU3ZnKSB7XG4gICAgICAgIGlmICgnY2xhc3NOYW1lJyA9PT0gbmFtZSkgbmFtZSA9ICdjbGFzcyc7XG4gICAgICAgIGlmICgna2V5JyA9PT0gbmFtZSkgOyBlbHNlIGlmICgncmVmJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKG9sZCkgb2xkKG51bGwpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB2YWx1ZShub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmICgnY2xhc3MnID09PSBuYW1lICYmICFpc1N2Zykgbm9kZS5jbGFzc05hbWUgPSB2YWx1ZSB8fCAnJzsgZWxzZSBpZiAoJ3N0eWxlJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2YgdmFsdWUgfHwgJ3N0cmluZycgPT0gdHlwZW9mIG9sZCkgbm9kZS5zdHlsZS5jc3NUZXh0ID0gdmFsdWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBvbGQpIGZvciAodmFyIGkgaW4gb2xkKSBpZiAoIShpIGluIHZhbHVlKSkgbm9kZS5zdHlsZVtpXSA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIG5vZGUuc3R5bGVbaV0gPSAnbnVtYmVyJyA9PSB0eXBlb2YgdmFsdWVbaV0gJiYgITEgPT09IElTX05PTl9ESU1FTlNJT05BTC50ZXN0KGkpID8gdmFsdWVbaV0gKyAncHgnIDogdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSBub2RlLmlubmVySFRNTCA9IHZhbHVlLl9faHRtbCB8fCAnJztcbiAgICAgICAgfSBlbHNlIGlmICgnbycgPT0gbmFtZVswXSAmJiAnbicgPT0gbmFtZVsxXSkge1xuICAgICAgICAgICAgdmFyIHVzZUNhcHR1cmUgPSBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvQ2FwdHVyZSQvLCAnJykpO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9sZCkgbm9kZS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudFByb3h5LCB1c2VDYXB0dXJlKTtcbiAgICAgICAgICAgIChub2RlLl9fbCB8fCAobm9kZS5fX2wgPSB7fSkpW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2xpc3QnICE9PSBuYW1lICYmICd0eXBlJyAhPT0gbmFtZSAmJiAhaXNTdmcgJiYgbmFtZSBpbiBub2RlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5vZGVbbmFtZV0gPSBudWxsID09IHZhbHVlID8gJycgOiB2YWx1ZTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICBpZiAoKG51bGwgPT0gdmFsdWUgfHwgITEgPT09IHZhbHVlKSAmJiAnc3BlbGxjaGVjaycgIT0gbmFtZSkgbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbnMgPSBpc1N2ZyAmJiBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvXnhsaW5rOj8vLCAnJykpO1xuICAgICAgICAgICAgaWYgKG51bGwgPT0gdmFsdWUgfHwgITEgPT09IHZhbHVlKSBpZiAobnMpIG5vZGUucmVtb3ZlQXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBuYW1lLnRvTG93ZXJDYXNlKCkpOyBlbHNlIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpOyBlbHNlIGlmICgnZnVuY3Rpb24nICE9IHR5cGVvZiB2YWx1ZSkgaWYgKG5zKSBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpLCB2YWx1ZSk7IGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV2ZW50UHJveHkoZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2xbZS50eXBlXShvcHRpb25zLmV2ZW50ICYmIG9wdGlvbnMuZXZlbnQoZSkgfHwgZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZsdXNoTW91bnRzKCkge1xuICAgICAgICB2YXIgYztcbiAgICAgICAgd2hpbGUgKGMgPSBtb3VudHMucG9wKCkpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyTW91bnQpIG9wdGlvbnMuYWZ0ZXJNb3VudChjKTtcbiAgICAgICAgICAgIGlmIChjLmNvbXBvbmVudERpZE1vdW50KSBjLmNvbXBvbmVudERpZE1vdW50KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgcGFyZW50LCBjb21wb25lbnRSb290KSB7XG4gICAgICAgIGlmICghZGlmZkxldmVsKyspIHtcbiAgICAgICAgICAgIGlzU3ZnTW9kZSA9IG51bGwgIT0gcGFyZW50ICYmIHZvaWQgMCAhPT0gcGFyZW50Lm93bmVyU1ZHRWxlbWVudDtcbiAgICAgICAgICAgIGh5ZHJhdGluZyA9IG51bGwgIT0gZG9tICYmICEoJ19fcHJlYWN0YXR0cl8nIGluIGRvbSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IGlkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBjb21wb25lbnRSb290KTtcbiAgICAgICAgaWYgKHBhcmVudCAmJiByZXQucGFyZW50Tm9kZSAhPT0gcGFyZW50KSBwYXJlbnQuYXBwZW5kQ2hpbGQocmV0KTtcbiAgICAgICAgaWYgKCEtLWRpZmZMZXZlbCkge1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gITE7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudFJvb3QpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpIHtcbiAgICAgICAgdmFyIG91dCA9IGRvbSwgcHJldlN2Z01vZGUgPSBpc1N2Z01vZGU7XG4gICAgICAgIGlmIChudWxsID09IHZub2RlIHx8ICdib29sZWFuJyA9PSB0eXBlb2Ygdm5vZGUpIHZub2RlID0gJyc7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUgfHwgJ251bWJlcicgPT0gdHlwZW9mIHZub2RlKSB7XG4gICAgICAgICAgICBpZiAoZG9tICYmIHZvaWQgMCAhPT0gZG9tLnNwbGl0VGV4dCAmJiBkb20ucGFyZW50Tm9kZSAmJiAoIWRvbS5fY29tcG9uZW50IHx8IGNvbXBvbmVudFJvb3QpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVmFsdWUgIT0gdm5vZGUpIGRvbS5ub2RlVmFsdWUgPSB2bm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodm5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShkb20sICEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQuX19wcmVhY3RhdHRyXyA9ICEwO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdm5vZGVOYW1lID0gdm5vZGUubm9kZU5hbWU7XG4gICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiB2bm9kZU5hbWUpIHJldHVybiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgIGlzU3ZnTW9kZSA9ICdzdmcnID09PSB2bm9kZU5hbWUgPyAhMCA6ICdmb3JlaWduT2JqZWN0JyA9PT0gdm5vZGVOYW1lID8gITEgOiBpc1N2Z01vZGU7XG4gICAgICAgIHZub2RlTmFtZSA9IFN0cmluZyh2bm9kZU5hbWUpO1xuICAgICAgICBpZiAoIWRvbSB8fCAhaXNOYW1lZE5vZGUoZG9tLCB2bm9kZU5hbWUpKSB7XG4gICAgICAgICAgICBvdXQgPSBjcmVhdGVOb2RlKHZub2RlTmFtZSwgaXNTdmdNb2RlKTtcbiAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIG91dC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGRvbSwgITApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBmYyA9IG91dC5maXJzdENoaWxkLCBwcm9wcyA9IG91dC5fX3ByZWFjdGF0dHJfLCB2Y2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKG51bGwgPT0gcHJvcHMpIHtcbiAgICAgICAgICAgIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8gPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGEgPSBvdXQuYXR0cmlidXRlcywgaSA9IGEubGVuZ3RoOyBpLS07ICkgcHJvcHNbYVtpXS5uYW1lXSA9IGFbaV0udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoeWRyYXRpbmcgJiYgdmNoaWxkcmVuICYmIDEgPT09IHZjaGlsZHJlbi5sZW5ndGggJiYgJ3N0cmluZycgPT0gdHlwZW9mIHZjaGlsZHJlblswXSAmJiBudWxsICE9IGZjICYmIHZvaWQgMCAhPT0gZmMuc3BsaXRUZXh0ICYmIG51bGwgPT0gZmMubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIGlmIChmYy5ub2RlVmFsdWUgIT0gdmNoaWxkcmVuWzBdKSBmYy5ub2RlVmFsdWUgPSB2Y2hpbGRyZW5bMF07XG4gICAgICAgIH0gZWxzZSBpZiAodmNoaWxkcmVuICYmIHZjaGlsZHJlbi5sZW5ndGggfHwgbnVsbCAhPSBmYykgaW5uZXJEaWZmTm9kZShvdXQsIHZjaGlsZHJlbiwgY29udGV4dCwgbW91bnRBbGwsIGh5ZHJhdGluZyB8fCBudWxsICE9IHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKTtcbiAgICAgICAgZGlmZkF0dHJpYnV0ZXMob3V0LCB2bm9kZS5hdHRyaWJ1dGVzLCBwcm9wcyk7XG4gICAgICAgIGlzU3ZnTW9kZSA9IHByZXZTdmdNb2RlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbm5lckRpZmZOb2RlKGRvbSwgdmNoaWxkcmVuLCBjb250ZXh0LCBtb3VudEFsbCwgaXNIeWRyYXRpbmcpIHtcbiAgICAgICAgdmFyIGosIGMsIGYsIHZjaGlsZCwgY2hpbGQsIG9yaWdpbmFsQ2hpbGRyZW4gPSBkb20uY2hpbGROb2RlcywgY2hpbGRyZW4gPSBbXSwga2V5ZWQgPSB7fSwga2V5ZWRMZW4gPSAwLCBtaW4gPSAwLCBsZW4gPSBvcmlnaW5hbENoaWxkcmVuLmxlbmd0aCwgY2hpbGRyZW5MZW4gPSAwLCB2bGVuID0gdmNoaWxkcmVuID8gdmNoaWxkcmVuLmxlbmd0aCA6IDA7XG4gICAgICAgIGlmICgwICE9PSBsZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBfY2hpbGQgPSBvcmlnaW5hbENoaWxkcmVuW2ldLCBwcm9wcyA9IF9jaGlsZC5fX3ByZWFjdGF0dHJfLCBrZXkgPSB2bGVuICYmIHByb3BzID8gX2NoaWxkLl9jb21wb25lbnQgPyBfY2hpbGQuX2NvbXBvbmVudC5fX2sgOiBwcm9wcy5rZXkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAga2V5ZWRMZW4rKztcbiAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gX2NoaWxkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcyB8fCAodm9pZCAwICE9PSBfY2hpbGQuc3BsaXRUZXh0ID8gaXNIeWRyYXRpbmcgPyBfY2hpbGQubm9kZVZhbHVlLnRyaW0oKSA6ICEwIDogaXNIeWRyYXRpbmcpKSBjaGlsZHJlbltjaGlsZHJlbkxlbisrXSA9IF9jaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoMCAhPT0gdmxlbikgZm9yICh2YXIgaSA9IDA7IGkgPCB2bGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZjaGlsZCA9IHZjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBrZXkgPSB2Y2hpbGQua2V5O1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleWVkTGVuICYmIHZvaWQgMCAhPT0ga2V5ZWRba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGtleWVkW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGtleWVkW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGtleWVkTGVuLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtaW4gPCBjaGlsZHJlbkxlbikgZm9yIChqID0gbWluOyBqIDwgY2hpbGRyZW5MZW47IGorKykgaWYgKHZvaWQgMCAhPT0gY2hpbGRyZW5bal0gJiYgaXNTYW1lTm9kZVR5cGUoYyA9IGNoaWxkcmVuW2pdLCB2Y2hpbGQsIGlzSHlkcmF0aW5nKSkge1xuICAgICAgICAgICAgICAgIGNoaWxkID0gYztcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltqXSA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gY2hpbGRyZW5MZW4gLSAxKSBjaGlsZHJlbkxlbi0tO1xuICAgICAgICAgICAgICAgIGlmIChqID09PSBtaW4pIG1pbisrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hpbGQgPSBpZGlmZihjaGlsZCwgdmNoaWxkLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBmID0gb3JpZ2luYWxDaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZCAmJiBjaGlsZCAhPT0gZG9tICYmIGNoaWxkICE9PSBmKSBpZiAobnVsbCA9PSBmKSBkb20uYXBwZW5kQ2hpbGQoY2hpbGQpOyBlbHNlIGlmIChjaGlsZCA9PT0gZi5uZXh0U2libGluZykgcmVtb3ZlTm9kZShmKTsgZWxzZSBkb20uaW5zZXJ0QmVmb3JlKGNoaWxkLCBmKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ZWRMZW4pIGZvciAodmFyIGkgaW4ga2V5ZWQpIGlmICh2b2lkIDAgIT09IGtleWVkW2ldKSByZWNvbGxlY3ROb2RlVHJlZShrZXllZFtpXSwgITEpO1xuICAgICAgICB3aGlsZSAobWluIDw9IGNoaWxkcmVuTGVuKSBpZiAodm9pZCAwICE9PSAoY2hpbGQgPSBjaGlsZHJlbltjaGlsZHJlbkxlbi0tXSkpIHJlY29sbGVjdE5vZGVUcmVlKGNoaWxkLCAhMSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsIHVubW91bnRPbmx5KSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBub2RlLl9jb21wb25lbnQ7XG4gICAgICAgIGlmIChjb21wb25lbnQpIHVubW91bnRDb21wb25lbnQoY29tcG9uZW50KTsgZWxzZSB7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBub2RlLl9fcHJlYWN0YXR0cl8gJiYgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZikgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgICAgIGlmICghMSA9PT0gdW5tb3VudE9ubHkgfHwgbnVsbCA9PSBub2RlLl9fcHJlYWN0YXR0cl8pIHJlbW92ZU5vZGUobm9kZSk7XG4gICAgICAgICAgICByZW1vdmVDaGlsZHJlbihub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmxhc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBuZXh0ID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShub2RlLCAhMCk7XG4gICAgICAgICAgICBub2RlID0gbmV4dDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBkaWZmQXR0cmlidXRlcyhkb20sIGF0dHJzLCBvbGQpIHtcbiAgICAgICAgdmFyIG5hbWU7XG4gICAgICAgIGZvciAobmFtZSBpbiBvbGQpIGlmICgoIWF0dHJzIHx8IG51bGwgPT0gYXR0cnNbbmFtZV0pICYmIG51bGwgIT0gb2xkW25hbWVdKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gdm9pZCAwLCBpc1N2Z01vZGUpO1xuICAgICAgICBmb3IgKG5hbWUgaW4gYXR0cnMpIGlmICghKCdjaGlsZHJlbicgPT09IG5hbWUgfHwgJ2lubmVySFRNTCcgPT09IG5hbWUgfHwgbmFtZSBpbiBvbGQgJiYgYXR0cnNbbmFtZV0gPT09ICgndmFsdWUnID09PSBuYW1lIHx8ICdjaGVja2VkJyA9PT0gbmFtZSA/IGRvbVtuYW1lXSA6IG9sZFtuYW1lXSkpKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gYXR0cnNbbmFtZV0sIGlzU3ZnTW9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChDdG9yLCBwcm9wcywgY29udGV4dCkge1xuICAgICAgICB2YXIgaW5zdCwgaSA9IHJlY3ljbGVyQ29tcG9uZW50cy5sZW5ndGg7XG4gICAgICAgIGlmIChDdG9yLnByb3RvdHlwZSAmJiBDdG9yLnByb3RvdHlwZS5yZW5kZXIpIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgQ3Rvcihwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBDb21wb25lbnQuY2FsbChpbnN0LCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IENvbXBvbmVudChwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpbnN0LmNvbnN0cnVjdG9yID0gQ3RvcjtcbiAgICAgICAgICAgIGluc3QucmVuZGVyID0gZG9SZW5kZXI7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGktLSkgaWYgKHJlY3ljbGVyQ29tcG9uZW50c1tpXS5jb25zdHJ1Y3RvciA9PT0gQ3Rvcikge1xuICAgICAgICAgICAgaW5zdC5fX2IgPSByZWN5Y2xlckNvbXBvbmVudHNbaV0uX19iO1xuICAgICAgICAgICAgcmVjeWNsZXJDb21wb25lbnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBkb1JlbmRlcihwcm9wcywgc3RhdGUsIGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRDb21wb25lbnRQcm9wcyhjb21wb25lbnQsIHByb3BzLCByZW5kZXJNb2RlLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3gpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3IgPSBwcm9wcy5yZWY7XG4gICAgICAgICAgICBjb21wb25lbnQuX19rID0gcHJvcHMua2V5O1xuICAgICAgICAgICAgZGVsZXRlIHByb3BzLnJlZjtcbiAgICAgICAgICAgIGRlbGV0ZSBwcm9wcy5rZXk7XG4gICAgICAgICAgICBpZiAodm9pZCAwID09PSBjb21wb25lbnQuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKSBpZiAoIWNvbXBvbmVudC5iYXNlIHx8IG1vdW50QWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0ICYmIGNvbnRleHQgIT09IGNvbXBvbmVudC5jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuX19jKSBjb21wb25lbnQuX19jID0gY29tcG9uZW50LmNvbnRleHQ7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuX19wKSBjb21wb25lbnQuX19wID0gY29tcG9uZW50LnByb3BzO1xuICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICBjb21wb25lbnQuX194ID0gITE7XG4gICAgICAgICAgICBpZiAoMCAhPT0gcmVuZGVyTW9kZSkgaWYgKDEgPT09IHJlbmRlck1vZGUgfHwgITEgIT09IG9wdGlvbnMuc3luY0NvbXBvbmVudFVwZGF0ZXMgfHwgIWNvbXBvbmVudC5iYXNlKSByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCAxLCBtb3VudEFsbCk7IGVsc2UgZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fX3IpIGNvbXBvbmVudC5fX3IoY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCByZW5kZXJNb2RlLCBtb3VudEFsbCwgaXNDaGlsZCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3gpIHtcbiAgICAgICAgICAgIHZhciByZW5kZXJlZCwgaW5zdCwgY2Jhc2UsIHByb3BzID0gY29tcG9uZW50LnByb3BzLCBzdGF0ZSA9IGNvbXBvbmVudC5zdGF0ZSwgY29udGV4dCA9IGNvbXBvbmVudC5jb250ZXh0LCBwcmV2aW91c1Byb3BzID0gY29tcG9uZW50Ll9fcCB8fCBwcm9wcywgcHJldmlvdXNTdGF0ZSA9IGNvbXBvbmVudC5fX3MgfHwgc3RhdGUsIHByZXZpb3VzQ29udGV4dCA9IGNvbXBvbmVudC5fX2MgfHwgY29udGV4dCwgaXNVcGRhdGUgPSBjb21wb25lbnQuYmFzZSwgbmV4dEJhc2UgPSBjb21wb25lbnQuX19iLCBpbml0aWFsQmFzZSA9IGlzVXBkYXRlIHx8IG5leHRCYXNlLCBpbml0aWFsQ2hpbGRDb21wb25lbnQgPSBjb21wb25lbnQuX2NvbXBvbmVudCwgc2tpcCA9ICExLCBzbmFwc2hvdCA9IHByZXZpb3VzQ29udGV4dDtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSBleHRlbmQoZXh0ZW5kKHt9LCBzdGF0ZSksIGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMsIHN0YXRlKSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcmV2aW91c1Byb3BzO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHByZXZpb3VzU3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBwcmV2aW91c0NvbnRleHQ7XG4gICAgICAgICAgICAgICAgaWYgKDIgIT09IHJlbmRlck1vZGUgJiYgY29tcG9uZW50LnNob3VsZENvbXBvbmVudFVwZGF0ZSAmJiAhMSA9PT0gY29tcG9uZW50LnNob3VsZENvbXBvbmVudFVwZGF0ZShwcm9wcywgc3RhdGUsIGNvbnRleHQpKSBza2lwID0gITA7IGVsc2UgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKSBjb21wb25lbnQuY29tcG9uZW50V2lsbFVwZGF0ZShwcm9wcywgc3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3AgPSBjb21wb25lbnQuX19zID0gY29tcG9uZW50Ll9fYyA9IGNvbXBvbmVudC5fX2IgPSBudWxsO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9fZCA9ICExO1xuICAgICAgICAgICAgaWYgKCFza2lwKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyZWQgPSBjb21wb25lbnQucmVuZGVyKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQpIGNvbnRleHQgPSBleHRlbmQoZXh0ZW5kKHt9LCBjb250ZXh0KSwgY29tcG9uZW50LmdldENoaWxkQ29udGV4dCgpKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNVcGRhdGUgJiYgY29tcG9uZW50LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKSBzbmFwc2hvdCA9IGNvbXBvbmVudC5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwcmV2aW91c1Byb3BzLCBwcmV2aW91c1N0YXRlKTtcbiAgICAgICAgICAgICAgICB2YXIgdG9Vbm1vdW50LCBiYXNlLCBjaGlsZENvbXBvbmVudCA9IHJlbmRlcmVkICYmIHJlbmRlcmVkLm5vZGVOYW1lO1xuICAgICAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBjaGlsZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRQcm9wcyA9IGdldE5vZGVQcm9wcyhyZW5kZXJlZCk7XG4gICAgICAgICAgICAgICAgICAgIGluc3QgPSBpbml0aWFsQ2hpbGRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnN0ICYmIGluc3QuY29uc3RydWN0b3IgPT09IGNoaWxkQ29tcG9uZW50ICYmIGNoaWxkUHJvcHMua2V5ID09IGluc3QuX19rKSBzZXRDb21wb25lbnRQcm9wcyhpbnN0LCBjaGlsZFByb3BzLCAxLCBjb250ZXh0LCAhMSk7IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9Vbm1vdW50ID0gaW5zdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5fY29tcG9uZW50ID0gaW5zdCA9IGNyZWF0ZUNvbXBvbmVudChjaGlsZENvbXBvbmVudCwgY2hpbGRQcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fYiA9IGluc3QuX19iIHx8IG5leHRCYXNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdC5fX3UgPSBjb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhpbnN0LCBjaGlsZFByb3BzLCAwLCBjb250ZXh0LCAhMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wb25lbnQoaW5zdCwgMSwgbW91bnRBbGwsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBiYXNlID0gaW5zdC5iYXNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNiYXNlID0gaW5pdGlhbEJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHRvVW5tb3VudCA9IGluaXRpYWxDaGlsZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgY2Jhc2UgPSBjb21wb25lbnQuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsQmFzZSB8fCAxID09PSByZW5kZXJNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2Jhc2UpIGNiYXNlLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZSA9IGRpZmYoY2Jhc2UsIHJlbmRlcmVkLCBjb250ZXh0LCBtb3VudEFsbCB8fCAhaXNVcGRhdGUsIGluaXRpYWxCYXNlICYmIGluaXRpYWxCYXNlLnBhcmVudE5vZGUsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEJhc2UgJiYgYmFzZSAhPT0gaW5pdGlhbEJhc2UgJiYgaW5zdCAhPT0gaW5pdGlhbENoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiYXNlUGFyZW50ID0gaW5pdGlhbEJhc2UucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2VQYXJlbnQgJiYgYmFzZSAhPT0gYmFzZVBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZVBhcmVudC5yZXBsYWNlQ2hpbGQoYmFzZSwgaW5pdGlhbEJhc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0b1VubW91bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsQmFzZS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShpbml0aWFsQmFzZSwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0b1VubW91bnQpIHVubW91bnRDb21wb25lbnQodG9Vbm1vdW50KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuYmFzZSA9IGJhc2U7XG4gICAgICAgICAgICAgICAgaWYgKGJhc2UgJiYgIWlzQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudFJlZiA9IGNvbXBvbmVudCwgdCA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHQgPSB0Ll9fdSkgKGNvbXBvbmVudFJlZiA9IHQpLmJhc2UgPSBiYXNlO1xuICAgICAgICAgICAgICAgICAgICBiYXNlLl9jb21wb25lbnQgPSBjb21wb25lbnRSZWY7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UuX2NvbXBvbmVudENvbnN0cnVjdG9yID0gY29tcG9uZW50UmVmLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNVcGRhdGUgfHwgbW91bnRBbGwpIG1vdW50cy51bnNoaWZ0KGNvbXBvbmVudCk7IGVsc2UgaWYgKCFza2lwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnREaWRVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnREaWRVcGRhdGUocHJldmlvdXNQcm9wcywgcHJldmlvdXNTdGF0ZSwgc25hcHNob3QpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyVXBkYXRlKSBvcHRpb25zLmFmdGVyVXBkYXRlKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoY29tcG9uZW50Ll9faC5sZW5ndGgpIGNvbXBvbmVudC5fX2gucG9wKCkuY2FsbChjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKCFkaWZmTGV2ZWwgJiYgIWlzQ2hpbGQpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGRDb21wb25lbnRGcm9tVk5vZGUoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgdmFyIGMgPSBkb20gJiYgZG9tLl9jb21wb25lbnQsIG9yaWdpbmFsQ29tcG9uZW50ID0gYywgb2xkRG9tID0gZG9tLCBpc0RpcmVjdE93bmVyID0gYyAmJiBkb20uX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZSwgaXNPd25lciA9IGlzRGlyZWN0T3duZXIsIHByb3BzID0gZ2V0Tm9kZVByb3BzKHZub2RlKTtcbiAgICAgICAgd2hpbGUgKGMgJiYgIWlzT3duZXIgJiYgKGMgPSBjLl9fdSkpIGlzT3duZXIgPSBjLmNvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICAgICAgaWYgKGMgJiYgaXNPd25lciAmJiAoIW1vdW50QWxsIHx8IGMuX2NvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCAzLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBkb20gPSBjLmJhc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWxDb21wb25lbnQgJiYgIWlzRGlyZWN0T3duZXIpIHtcbiAgICAgICAgICAgICAgICB1bm1vdW50Q29tcG9uZW50KG9yaWdpbmFsQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICBkb20gPSBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYyA9IGNyZWF0ZUNvbXBvbmVudCh2bm9kZS5ub2RlTmFtZSwgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGRvbSAmJiAhYy5fX2IpIHtcbiAgICAgICAgICAgICAgICBjLl9fYiA9IGRvbTtcbiAgICAgICAgICAgICAgICBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoYywgcHJvcHMsIDEsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGRvbSA9IGMuYmFzZTtcbiAgICAgICAgICAgIGlmIChvbGREb20gJiYgZG9tICE9PSBvbGREb20pIHtcbiAgICAgICAgICAgICAgICBvbGREb20uX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUob2xkRG9tLCAhMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvbTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdW5tb3VudENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYmVmb3JlVW5tb3VudCkgb3B0aW9ucy5iZWZvcmVVbm1vdW50KGNvbXBvbmVudCk7XG4gICAgICAgIHZhciBiYXNlID0gY29tcG9uZW50LmJhc2U7XG4gICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG4gICAgICAgIGNvbXBvbmVudC5iYXNlID0gbnVsbDtcbiAgICAgICAgdmFyIGlubmVyID0gY29tcG9uZW50Ll9jb21wb25lbnQ7XG4gICAgICAgIGlmIChpbm5lcikgdW5tb3VudENvbXBvbmVudChpbm5lcik7IGVsc2UgaWYgKGJhc2UpIHtcbiAgICAgICAgICAgIGlmIChiYXNlLl9fcHJlYWN0YXR0cl8gJiYgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZikgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX2IgPSBiYXNlO1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShiYXNlKTtcbiAgICAgICAgICAgIHJlY3ljbGVyQ29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgICAgICByZW1vdmVDaGlsZHJlbihiYXNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcG9uZW50Ll9fcikgY29tcG9uZW50Ll9fcihudWxsKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuX19kID0gITA7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgIHRoaXMuX19oID0gW107XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbmRlcih2bm9kZSwgcGFyZW50LCBtZXJnZSkge1xuICAgICAgICByZXR1cm4gZGlmZihtZXJnZSwgdm5vZGUsIHt9LCAhMSwgcGFyZW50LCAhMSk7XG4gICAgfVxuICAgIHZhciBWTm9kZSA9IGZ1bmN0aW9uKCkge307XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICB2YXIgRU1QVFlfQ0hJTERSRU4gPSBbXTtcbiAgICB2YXIgZGVmZXIgPSAnZnVuY3Rpb24nID09IHR5cGVvZiBQcm9taXNlID8gUHJvbWlzZS5yZXNvbHZlKCkudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKSA6IHNldFRpbWVvdXQ7XG4gICAgdmFyIElTX05PTl9ESU1FTlNJT05BTCA9IC9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHZhciBtb3VudHMgPSBbXTtcbiAgICB2YXIgZGlmZkxldmVsID0gMDtcbiAgICB2YXIgaXNTdmdNb2RlID0gITE7XG4gICAgdmFyIGh5ZHJhdGluZyA9ICExO1xuICAgIHZhciByZWN5Y2xlckNvbXBvbmVudHMgPSBbXTtcbiAgICBleHRlbmQoQ29tcG9uZW50LnByb3RvdHlwZSwge1xuICAgICAgICBzZXRTdGF0ZTogZnVuY3Rpb24oc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX19zKSB0aGlzLl9fcyA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gZXh0ZW5kKGV4dGVuZCh7fSwgdGhpcy5zdGF0ZSksICdmdW5jdGlvbicgPT0gdHlwZW9mIHN0YXRlID8gc3RhdGUodGhpcy5zdGF0ZSwgdGhpcy5wcm9wcykgOiBzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHRoaXMuX19oLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgZW5xdWV1ZVJlbmRlcih0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9yY2VVcGRhdGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHRoaXMuX19oLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmVuZGVyQ29tcG9uZW50KHRoaXMsIDIpO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgcHJlYWN0ID0ge1xuICAgICAgICBoOiBoLFxuICAgICAgICBjcmVhdGVFbGVtZW50OiBoLFxuICAgICAgICBjbG9uZUVsZW1lbnQ6IGNsb25lRWxlbWVudCxcbiAgICAgICAgQ29tcG9uZW50OiBDb21wb25lbnQsXG4gICAgICAgIHJlbmRlcjogcmVuZGVyLFxuICAgICAgICByZXJlbmRlcjogcmVyZW5kZXIsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9O1xuICAgIGlmICgndW5kZWZpbmVkJyAhPSB0eXBlb2YgbW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IHByZWFjdDsgZWxzZSBzZWxmLnByZWFjdCA9IHByZWFjdDtcbn0oKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5qcy5tYXAiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyohIGh0dHBzOi8vbXRocy5iZS9wdW55Y29kZSB2MS40LjEgYnkgQG1hdGhpYXMgKi9cbjsoZnVuY3Rpb24ocm9vdCkge1xuXG5cdC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZXMgKi9cblx0dmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJlxuXHRcdCFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cdHZhciBmcmVlTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiZcblx0XHQhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblx0dmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcblx0aWYgKFxuXHRcdGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8XG5cdFx0ZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwgfHxcblx0XHRmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWxcblx0KSB7XG5cdFx0cm9vdCA9IGZyZWVHbG9iYWw7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwdW55Y29kZWAgb2JqZWN0LlxuXHQgKiBAbmFtZSBwdW55Y29kZVxuXHQgKiBAdHlwZSBPYmplY3Rcblx0ICovXG5cdHZhciBwdW55Y29kZSxcblxuXHQvKiogSGlnaGVzdCBwb3NpdGl2ZSBzaWduZWQgMzItYml0IGZsb2F0IHZhbHVlICovXG5cdG1heEludCA9IDIxNDc0ODM2NDcsIC8vIGFrYS4gMHg3RkZGRkZGRiBvciAyXjMxLTFcblxuXHQvKiogQm9vdHN0cmluZyBwYXJhbWV0ZXJzICovXG5cdGJhc2UgPSAzNixcblx0dE1pbiA9IDEsXG5cdHRNYXggPSAyNixcblx0c2tldyA9IDM4LFxuXHRkYW1wID0gNzAwLFxuXHRpbml0aWFsQmlhcyA9IDcyLFxuXHRpbml0aWFsTiA9IDEyOCwgLy8gMHg4MFxuXHRkZWxpbWl0ZXIgPSAnLScsIC8vICdcXHgyRCdcblxuXHQvKiogUmVndWxhciBleHByZXNzaW9ucyAqL1xuXHRyZWdleFB1bnljb2RlID0gL154bi0tLyxcblx0cmVnZXhOb25BU0NJSSA9IC9bXlxceDIwLVxceDdFXS8sIC8vIHVucHJpbnRhYmxlIEFTQ0lJIGNoYXJzICsgbm9uLUFTQ0lJIGNoYXJzXG5cdHJlZ2V4U2VwYXJhdG9ycyA9IC9bXFx4MkVcXHUzMDAyXFx1RkYwRVxcdUZGNjFdL2csIC8vIFJGQyAzNDkwIHNlcGFyYXRvcnNcblxuXHQvKiogRXJyb3IgbWVzc2FnZXMgKi9cblx0ZXJyb3JzID0ge1xuXHRcdCdvdmVyZmxvdyc6ICdPdmVyZmxvdzogaW5wdXQgbmVlZHMgd2lkZXIgaW50ZWdlcnMgdG8gcHJvY2VzcycsXG5cdFx0J25vdC1iYXNpYyc6ICdJbGxlZ2FsIGlucHV0ID49IDB4ODAgKG5vdCBhIGJhc2ljIGNvZGUgcG9pbnQpJyxcblx0XHQnaW52YWxpZC1pbnB1dCc6ICdJbnZhbGlkIGlucHV0J1xuXHR9LFxuXG5cdC8qKiBDb252ZW5pZW5jZSBzaG9ydGN1dHMgKi9cblx0YmFzZU1pbnVzVE1pbiA9IGJhc2UgLSB0TWluLFxuXHRmbG9vciA9IE1hdGguZmxvb3IsXG5cdHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUsXG5cblx0LyoqIFRlbXBvcmFyeSB2YXJpYWJsZSAqL1xuXHRrZXk7XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqXG5cdCAqIEEgZ2VuZXJpYyBlcnJvciB1dGlsaXR5IGZ1bmN0aW9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgZXJyb3IgdHlwZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaHJvd3MgYSBgUmFuZ2VFcnJvcmAgd2l0aCB0aGUgYXBwbGljYWJsZSBlcnJvciBtZXNzYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZXJyb3IodHlwZSkge1xuXHRcdHRocm93IG5ldyBSYW5nZUVycm9yKGVycm9yc1t0eXBlXSk7XG5cdH1cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGBBcnJheSNtYXBgIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeSBhcnJheVxuXHQgKiBpdGVtLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IGFycmF5IG9mIHZhbHVlcyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAoYXJyYXksIGZuKSB7XG5cdFx0dmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblx0XHR2YXIgcmVzdWx0ID0gW107XG5cdFx0d2hpbGUgKGxlbmd0aC0tKSB7XG5cdFx0XHRyZXN1bHRbbGVuZ3RoXSA9IGZuKGFycmF5W2xlbmd0aF0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgc2ltcGxlIGBBcnJheSNtYXBgLWxpa2Ugd3JhcHBlciB0byB3b3JrIHdpdGggZG9tYWluIG5hbWUgc3RyaW5ncyBvciBlbWFpbFxuXHQgKiBhZGRyZXNzZXMuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gVGhlIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeVxuXHQgKiBjaGFyYWN0ZXIuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgc3RyaW5nIG9mIGNoYXJhY3RlcnMgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrXG5cdCAqIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwRG9tYWluKHN0cmluZywgZm4pIHtcblx0XHR2YXIgcGFydHMgPSBzdHJpbmcuc3BsaXQoJ0AnKTtcblx0XHR2YXIgcmVzdWx0ID0gJyc7XG5cdFx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdC8vIEluIGVtYWlsIGFkZHJlc3Nlcywgb25seSB0aGUgZG9tYWluIG5hbWUgc2hvdWxkIGJlIHB1bnljb2RlZC4gTGVhdmVcblx0XHRcdC8vIHRoZSBsb2NhbCBwYXJ0IChpLmUuIGV2ZXJ5dGhpbmcgdXAgdG8gYEBgKSBpbnRhY3QuXG5cdFx0XHRyZXN1bHQgPSBwYXJ0c1swXSArICdAJztcblx0XHRcdHN0cmluZyA9IHBhcnRzWzFdO1xuXHRcdH1cblx0XHQvLyBBdm9pZCBgc3BsaXQocmVnZXgpYCBmb3IgSUU4IGNvbXBhdGliaWxpdHkuIFNlZSAjMTcuXG5cdFx0c3RyaW5nID0gc3RyaW5nLnJlcGxhY2UocmVnZXhTZXBhcmF0b3JzLCAnXFx4MkUnKTtcblx0XHR2YXIgbGFiZWxzID0gc3RyaW5nLnNwbGl0KCcuJyk7XG5cdFx0dmFyIGVuY29kZWQgPSBtYXAobGFiZWxzLCBmbikuam9pbignLicpO1xuXHRcdHJldHVybiByZXN1bHQgKyBlbmNvZGVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgbnVtZXJpYyBjb2RlIHBvaW50cyBvZiBlYWNoIFVuaWNvZGVcblx0ICogY2hhcmFjdGVyIGluIHRoZSBzdHJpbmcuIFdoaWxlIEphdmFTY3JpcHQgdXNlcyBVQ1MtMiBpbnRlcm5hbGx5LFxuXHQgKiB0aGlzIGZ1bmN0aW9uIHdpbGwgY29udmVydCBhIHBhaXIgb2Ygc3Vycm9nYXRlIGhhbHZlcyAoZWFjaCBvZiB3aGljaFxuXHQgKiBVQ1MtMiBleHBvc2VzIGFzIHNlcGFyYXRlIGNoYXJhY3RlcnMpIGludG8gYSBzaW5nbGUgY29kZSBwb2ludCxcblx0ICogbWF0Y2hpbmcgVVRGLTE2LlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmVuY29kZWBcblx0ICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG5cdCAqIEBuYW1lIGRlY29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIFRoZSBVbmljb2RlIGlucHV0IHN0cmluZyAoVUNTLTIpLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBuZXcgYXJyYXkgb2YgY29kZSBwb2ludHMuXG5cdCAqL1xuXHRmdW5jdGlvbiB1Y3MyZGVjb2RlKHN0cmluZykge1xuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgY291bnRlciA9IDAsXG5cdFx0ICAgIGxlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG5cdFx0ICAgIHZhbHVlLFxuXHRcdCAgICBleHRyYTtcblx0XHR3aGlsZSAoY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0dmFsdWUgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0aWYgKHZhbHVlID49IDB4RDgwMCAmJiB2YWx1ZSA8PSAweERCRkYgJiYgY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0XHQvLyBoaWdoIHN1cnJvZ2F0ZSwgYW5kIHRoZXJlIGlzIGEgbmV4dCBjaGFyYWN0ZXJcblx0XHRcdFx0ZXh0cmEgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0XHRpZiAoKGV4dHJhICYgMHhGQzAwKSA9PSAweERDMDApIHsgLy8gbG93IHN1cnJvZ2F0ZVxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKCgodmFsdWUgJiAweDNGRikgPDwgMTApICsgKGV4dHJhICYgMHgzRkYpICsgMHgxMDAwMCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gdW5tYXRjaGVkIHN1cnJvZ2F0ZTsgb25seSBhcHBlbmQgdGhpcyBjb2RlIHVuaXQsIGluIGNhc2UgdGhlIG5leHRcblx0XHRcdFx0XHQvLyBjb2RlIHVuaXQgaXMgdGhlIGhpZ2ggc3Vycm9nYXRlIG9mIGEgc3Vycm9nYXRlIHBhaXJcblx0XHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHRcdFx0Y291bnRlci0tO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIHN0cmluZyBiYXNlZCBvbiBhbiBhcnJheSBvZiBudW1lcmljIGNvZGUgcG9pbnRzLlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmRlY29kZWBcblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZW5jb2RlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGNvZGVQb2ludHMgVGhlIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBuZXcgVW5pY29kZSBzdHJpbmcgKFVDUy0yKS5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJlbmNvZGUoYXJyYXkpIHtcblx0XHRyZXR1cm4gbWFwKGFycmF5LCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyIG91dHB1dCA9ICcnO1xuXHRcdFx0aWYgKHZhbHVlID4gMHhGRkZGKSB7XG5cdFx0XHRcdHZhbHVlIC09IDB4MTAwMDA7XG5cdFx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApO1xuXHRcdFx0XHR2YWx1ZSA9IDB4REMwMCB8IHZhbHVlICYgMHgzRkY7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKHZhbHVlKTtcblx0XHRcdHJldHVybiBvdXRwdXQ7XG5cdFx0fSkuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBiYXNpYyBjb2RlIHBvaW50IGludG8gYSBkaWdpdC9pbnRlZ2VyLlxuXHQgKiBAc2VlIGBkaWdpdFRvQmFzaWMoKWBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGNvZGVQb2ludCBUaGUgYmFzaWMgbnVtZXJpYyBjb2RlIHBvaW50IHZhbHVlLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQgKGZvciB1c2UgaW5cblx0ICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpbiB0aGUgcmFuZ2UgYDBgIHRvIGBiYXNlIC0gMWAsIG9yIGBiYXNlYCBpZlxuXHQgKiB0aGUgY29kZSBwb2ludCBkb2VzIG5vdCByZXByZXNlbnQgYSB2YWx1ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2ljVG9EaWdpdChjb2RlUG9pbnQpIHtcblx0XHRpZiAoY29kZVBvaW50IC0gNDggPCAxMCkge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDIyO1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gNjUgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDY1O1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gOTcgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDk3O1xuXHRcdH1cblx0XHRyZXR1cm4gYmFzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGRpZ2l0L2ludGVnZXIgaW50byBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEBzZWUgYGJhc2ljVG9EaWdpdCgpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gZGlnaXQgVGhlIG51bWVyaWMgdmFsdWUgb2YgYSBiYXNpYyBjb2RlIHBvaW50LlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgYmFzaWMgY29kZSBwb2ludCB3aG9zZSB2YWx1ZSAod2hlbiB1c2VkIGZvclxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGlzIGBkaWdpdGAsIHdoaWNoIG5lZWRzIHRvIGJlIGluIHRoZSByYW5nZVxuXHQgKiBgMGAgdG8gYGJhc2UgLSAxYC4gSWYgYGZsYWdgIGlzIG5vbi16ZXJvLCB0aGUgdXBwZXJjYXNlIGZvcm0gaXNcblx0ICogdXNlZDsgZWxzZSwgdGhlIGxvd2VyY2FzZSBmb3JtIGlzIHVzZWQuIFRoZSBiZWhhdmlvciBpcyB1bmRlZmluZWRcblx0ICogaWYgYGZsYWdgIGlzIG5vbi16ZXJvIGFuZCBgZGlnaXRgIGhhcyBubyB1cHBlcmNhc2UgZm9ybS5cblx0ICovXG5cdGZ1bmN0aW9uIGRpZ2l0VG9CYXNpYyhkaWdpdCwgZmxhZykge1xuXHRcdC8vICAwLi4yNSBtYXAgdG8gQVNDSUkgYS4ueiBvciBBLi5aXG5cdFx0Ly8gMjYuLjM1IG1hcCB0byBBU0NJSSAwLi45XG5cdFx0cmV0dXJuIGRpZ2l0ICsgMjIgKyA3NSAqIChkaWdpdCA8IDI2KSAtICgoZmxhZyAhPSAwKSA8PCA1KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaWFzIGFkYXB0YXRpb24gZnVuY3Rpb24gYXMgcGVyIHNlY3Rpb24gMy40IG9mIFJGQyAzNDkyLlxuXHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzQ5MiNzZWN0aW9uLTMuNFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0ZnVuY3Rpb24gYWRhcHQoZGVsdGEsIG51bVBvaW50cywgZmlyc3RUaW1lKSB7XG5cdFx0dmFyIGsgPSAwO1xuXHRcdGRlbHRhID0gZmlyc3RUaW1lID8gZmxvb3IoZGVsdGEgLyBkYW1wKSA6IGRlbHRhID4+IDE7XG5cdFx0ZGVsdGEgKz0gZmxvb3IoZGVsdGEgLyBudW1Qb2ludHMpO1xuXHRcdGZvciAoLyogbm8gaW5pdGlhbGl6YXRpb24gKi87IGRlbHRhID4gYmFzZU1pbnVzVE1pbiAqIHRNYXggPj4gMTsgayArPSBiYXNlKSB7XG5cdFx0XHRkZWx0YSA9IGZsb29yKGRlbHRhIC8gYmFzZU1pbnVzVE1pbik7XG5cdFx0fVxuXHRcdHJldHVybiBmbG9vcihrICsgKGJhc2VNaW51c1RNaW4gKyAxKSAqIGRlbHRhIC8gKGRlbHRhICsgc2tldykpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scyB0byBhIHN0cmluZyBvZiBVbmljb2RlXG5cdCAqIHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuXHRcdC8vIERvbid0IHVzZSBVQ1MtMlxuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGgsXG5cdFx0ICAgIG91dCxcblx0XHQgICAgaSA9IDAsXG5cdFx0ICAgIG4gPSBpbml0aWFsTixcblx0XHQgICAgYmlhcyA9IGluaXRpYWxCaWFzLFxuXHRcdCAgICBiYXNpYyxcblx0XHQgICAgaixcblx0XHQgICAgaW5kZXgsXG5cdFx0ICAgIG9sZGksXG5cdFx0ICAgIHcsXG5cdFx0ICAgIGssXG5cdFx0ICAgIGRpZ2l0LFxuXHRcdCAgICB0LFxuXHRcdCAgICAvKiogQ2FjaGVkIGNhbGN1bGF0aW9uIHJlc3VsdHMgKi9cblx0XHQgICAgYmFzZU1pbnVzVDtcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHM6IGxldCBgYmFzaWNgIGJlIHRoZSBudW1iZXIgb2YgaW5wdXQgY29kZVxuXHRcdC8vIHBvaW50cyBiZWZvcmUgdGhlIGxhc3QgZGVsaW1pdGVyLCBvciBgMGAgaWYgdGhlcmUgaXMgbm9uZSwgdGhlbiBjb3B5XG5cdFx0Ly8gdGhlIGZpcnN0IGJhc2ljIGNvZGUgcG9pbnRzIHRvIHRoZSBvdXRwdXQuXG5cblx0XHRiYXNpYyA9IGlucHV0Lmxhc3RJbmRleE9mKGRlbGltaXRlcik7XG5cdFx0aWYgKGJhc2ljIDwgMCkge1xuXHRcdFx0YmFzaWMgPSAwO1xuXHRcdH1cblxuXHRcdGZvciAoaiA9IDA7IGogPCBiYXNpYzsgKytqKSB7XG5cdFx0XHQvLyBpZiBpdCdzIG5vdCBhIGJhc2ljIGNvZGUgcG9pbnRcblx0XHRcdGlmIChpbnB1dC5jaGFyQ29kZUF0KGopID49IDB4ODApIHtcblx0XHRcdFx0ZXJyb3IoJ25vdC1iYXNpYycpO1xuXHRcdFx0fVxuXHRcdFx0b3V0cHV0LnB1c2goaW5wdXQuY2hhckNvZGVBdChqKSk7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBkZWNvZGluZyBsb29wOiBzdGFydCBqdXN0IGFmdGVyIHRoZSBsYXN0IGRlbGltaXRlciBpZiBhbnkgYmFzaWMgY29kZVxuXHRcdC8vIHBvaW50cyB3ZXJlIGNvcGllZDsgc3RhcnQgYXQgdGhlIGJlZ2lubmluZyBvdGhlcndpc2UuXG5cblx0XHRmb3IgKGluZGV4ID0gYmFzaWMgPiAwID8gYmFzaWMgKyAxIDogMDsgaW5kZXggPCBpbnB1dExlbmd0aDsgLyogbm8gZmluYWwgZXhwcmVzc2lvbiAqLykge1xuXG5cdFx0XHQvLyBgaW5kZXhgIGlzIHRoZSBpbmRleCBvZiB0aGUgbmV4dCBjaGFyYWN0ZXIgdG8gYmUgY29uc3VtZWQuXG5cdFx0XHQvLyBEZWNvZGUgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlciBpbnRvIGBkZWx0YWAsXG5cdFx0XHQvLyB3aGljaCBnZXRzIGFkZGVkIHRvIGBpYC4gVGhlIG92ZXJmbG93IGNoZWNraW5nIGlzIGVhc2llclxuXHRcdFx0Ly8gaWYgd2UgaW5jcmVhc2UgYGlgIGFzIHdlIGdvLCB0aGVuIHN1YnRyYWN0IG9mZiBpdHMgc3RhcnRpbmdcblx0XHRcdC8vIHZhbHVlIGF0IHRoZSBlbmQgdG8gb2J0YWluIGBkZWx0YWAuXG5cdFx0XHRmb3IgKG9sZGkgPSBpLCB3ID0gMSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cblx0XHRcdFx0aWYgKGluZGV4ID49IGlucHV0TGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ2ludmFsaWQtaW5wdXQnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRpZ2l0ID0gYmFzaWNUb0RpZ2l0KGlucHV0LmNoYXJDb2RlQXQoaW5kZXgrKykpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA+PSBiYXNlIHx8IGRpZ2l0ID4gZmxvb3IoKG1heEludCAtIGkpIC8gdykpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGkgKz0gZGlnaXQgKiB3O1xuXHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblxuXHRcdFx0XHRpZiAoZGlnaXQgPCB0KSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRiYXNlTWludXNUID0gYmFzZSAtIHQ7XG5cdFx0XHRcdGlmICh3ID4gZmxvb3IobWF4SW50IC8gYmFzZU1pbnVzVCkpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHcgKj0gYmFzZU1pbnVzVDtcblxuXHRcdFx0fVxuXG5cdFx0XHRvdXQgPSBvdXRwdXQubGVuZ3RoICsgMTtcblx0XHRcdGJpYXMgPSBhZGFwdChpIC0gb2xkaSwgb3V0LCBvbGRpID09IDApO1xuXG5cdFx0XHQvLyBgaWAgd2FzIHN1cHBvc2VkIHRvIHdyYXAgYXJvdW5kIGZyb20gYG91dGAgdG8gYDBgLFxuXHRcdFx0Ly8gaW5jcmVtZW50aW5nIGBuYCBlYWNoIHRpbWUsIHNvIHdlJ2xsIGZpeCB0aGF0IG5vdzpcblx0XHRcdGlmIChmbG9vcihpIC8gb3V0KSA+IG1heEludCAtIG4pIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdG4gKz0gZmxvb3IoaSAvIG91dCk7XG5cdFx0XHRpICU9IG91dDtcblxuXHRcdFx0Ly8gSW5zZXJ0IGBuYCBhdCBwb3NpdGlvbiBgaWAgb2YgdGhlIG91dHB1dFxuXHRcdFx0b3V0cHV0LnNwbGljZShpKyssIDAsIG4pO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVjczJlbmNvZGUob3V0cHV0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMgKGUuZy4gYSBkb21haW4gbmFtZSBsYWJlbCkgdG8gYVxuXHQgKiBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBlbmNvZGUoaW5wdXQpIHtcblx0XHR2YXIgbixcblx0XHQgICAgZGVsdGEsXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50LFxuXHRcdCAgICBiYXNpY0xlbmd0aCxcblx0XHQgICAgYmlhcyxcblx0XHQgICAgaixcblx0XHQgICAgbSxcblx0XHQgICAgcSxcblx0XHQgICAgayxcblx0XHQgICAgdCxcblx0XHQgICAgY3VycmVudFZhbHVlLFxuXHRcdCAgICBvdXRwdXQgPSBbXSxcblx0XHQgICAgLyoqIGBpbnB1dExlbmd0aGAgd2lsbCBob2xkIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgaW4gYGlucHV0YC4gKi9cblx0XHQgICAgaW5wdXRMZW5ndGgsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsXG5cdFx0ICAgIGJhc2VNaW51c1QsXG5cdFx0ICAgIHFNaW51c1Q7XG5cblx0XHQvLyBDb252ZXJ0IHRoZSBpbnB1dCBpbiBVQ1MtMiB0byBVbmljb2RlXG5cdFx0aW5wdXQgPSB1Y3MyZGVjb2RlKGlucHV0KTtcblxuXHRcdC8vIENhY2hlIHRoZSBsZW5ndGhcblx0XHRpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aDtcblxuXHRcdC8vIEluaXRpYWxpemUgdGhlIHN0YXRlXG5cdFx0biA9IGluaXRpYWxOO1xuXHRcdGRlbHRhID0gMDtcblx0XHRiaWFzID0gaW5pdGlhbEJpYXM7XG5cblx0XHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzXG5cdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IDB4ODApIHtcblx0XHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGN1cnJlbnRWYWx1ZSkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGhhbmRsZWRDUENvdW50ID0gYmFzaWNMZW5ndGggPSBvdXRwdXQubGVuZ3RoO1xuXG5cdFx0Ly8gYGhhbmRsZWRDUENvdW50YCBpcyB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIHRoYXQgaGF2ZSBiZWVuIGhhbmRsZWQ7XG5cdFx0Ly8gYGJhc2ljTGVuZ3RoYCBpcyB0aGUgbnVtYmVyIG9mIGJhc2ljIGNvZGUgcG9pbnRzLlxuXG5cdFx0Ly8gRmluaXNoIHRoZSBiYXNpYyBzdHJpbmcgLSBpZiBpdCBpcyBub3QgZW1wdHkgLSB3aXRoIGEgZGVsaW1pdGVyXG5cdFx0aWYgKGJhc2ljTGVuZ3RoKSB7XG5cdFx0XHRvdXRwdXQucHVzaChkZWxpbWl0ZXIpO1xuXHRcdH1cblxuXHRcdC8vIE1haW4gZW5jb2RpbmcgbG9vcDpcblx0XHR3aGlsZSAoaGFuZGxlZENQQ291bnQgPCBpbnB1dExlbmd0aCkge1xuXG5cdFx0XHQvLyBBbGwgbm9uLWJhc2ljIGNvZGUgcG9pbnRzIDwgbiBoYXZlIGJlZW4gaGFuZGxlZCBhbHJlYWR5LiBGaW5kIHRoZSBuZXh0XG5cdFx0XHQvLyBsYXJnZXIgb25lOlxuXHRcdFx0Zm9yIChtID0gbWF4SW50LCBqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPj0gbiAmJiBjdXJyZW50VmFsdWUgPCBtKSB7XG5cdFx0XHRcdFx0bSA9IGN1cnJlbnRWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbmNyZWFzZSBgZGVsdGFgIGVub3VnaCB0byBhZHZhbmNlIHRoZSBkZWNvZGVyJ3MgPG4saT4gc3RhdGUgdG8gPG0sMD4sXG5cdFx0XHQvLyBidXQgZ3VhcmQgYWdhaW5zdCBvdmVyZmxvd1xuXHRcdFx0aGFuZGxlZENQQ291bnRQbHVzT25lID0gaGFuZGxlZENQQ291bnQgKyAxO1xuXHRcdFx0aWYgKG0gLSBuID4gZmxvb3IoKG1heEludCAtIGRlbHRhKSAvIGhhbmRsZWRDUENvdW50UGx1c09uZSkpIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGRlbHRhICs9IChtIC0gbikgKiBoYW5kbGVkQ1BDb3VudFBsdXNPbmU7XG5cdFx0XHRuID0gbTtcblxuXHRcdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IG4gJiYgKytkZWx0YSA+IG1heEludCkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PSBuKSB7XG5cdFx0XHRcdFx0Ly8gUmVwcmVzZW50IGRlbHRhIGFzIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXJcblx0XHRcdFx0XHRmb3IgKHEgPSBkZWx0YSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cdFx0XHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblx0XHRcdFx0XHRcdGlmIChxIDwgdCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHFNaW51c1QgPSBxIC0gdDtcblx0XHRcdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKFxuXHRcdFx0XHRcdFx0XHRzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHQgKyBxTWludXNUICUgYmFzZU1pbnVzVCwgMCkpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0cSA9IGZsb29yKHFNaW51c1QgLyBiYXNlTWludXNUKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHEsIDApKSk7XG5cdFx0XHRcdFx0YmlhcyA9IGFkYXB0KGRlbHRhLCBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsIGhhbmRsZWRDUENvdW50ID09IGJhc2ljTGVuZ3RoKTtcblx0XHRcdFx0XHRkZWx0YSA9IDA7XG5cdFx0XHRcdFx0KytoYW5kbGVkQ1BDb3VudDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQrK2RlbHRhO1xuXHRcdFx0KytuO1xuXG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgb3IgYW4gZW1haWwgYWRkcmVzc1xuXHQgKiB0byBVbmljb2RlLiBPbmx5IHRoZSBQdW55Y29kZWQgcGFydHMgb2YgdGhlIGlucHV0IHdpbGwgYmUgY29udmVydGVkLCBpLmUuXG5cdCAqIGl0IGRvZXNuJ3QgbWF0dGVyIGlmIHlvdSBjYWxsIGl0IG9uIGEgc3RyaW5nIHRoYXQgaGFzIGFscmVhZHkgYmVlblxuXHQgKiBjb252ZXJ0ZWQgdG8gVW5pY29kZS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGVkIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MgdG9cblx0ICogY29udmVydCB0byBVbmljb2RlLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgVW5pY29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gUHVueWNvZGVcblx0ICogc3RyaW5nLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9Vbmljb2RlKGlucHV0KSB7XG5cdFx0cmV0dXJuIG1hcERvbWFpbihpbnB1dCwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhQdW55Y29kZS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyBkZWNvZGUoc3RyaW5nLnNsaWNlKDQpLnRvTG93ZXJDYXNlKCkpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgVW5pY29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgb3IgYW4gZW1haWwgYWRkcmVzcyB0b1xuXHQgKiBQdW55Y29kZS4gT25seSB0aGUgbm9uLUFTQ0lJIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB3aWxsIGJlIGNvbnZlcnRlZCxcblx0ICogaS5lLiBpdCBkb2Vzbid0IG1hdHRlciBpZiB5b3UgY2FsbCBpdCB3aXRoIGEgZG9tYWluIHRoYXQncyBhbHJlYWR5IGluXG5cdCAqIEFTQ0lJLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzIHRvIGNvbnZlcnQsIGFzIGFcblx0ICogVW5pY29kZSBzdHJpbmcuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBQdW55Y29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gZG9tYWluIG5hbWUgb3Jcblx0ICogZW1haWwgYWRkcmVzcy5cblx0ICovXG5cdGZ1bmN0aW9uIHRvQVNDSUkoaW5wdXQpIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleE5vbkFTQ0lJLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/ICd4bi0tJyArIGVuY29kZShzdHJpbmcpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqIERlZmluZSB0aGUgcHVibGljIEFQSSAqL1xuXHRwdW55Y29kZSA9IHtcblx0XHQvKipcblx0XHQgKiBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgUHVueWNvZGUuanMgdmVyc2lvbiBudW1iZXIuXG5cdFx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdFx0ICogQHR5cGUgU3RyaW5nXG5cdFx0ICovXG5cdFx0J3ZlcnNpb24nOiAnMS40LjEnLFxuXHRcdC8qKlxuXHRcdCAqIEFuIG9iamVjdCBvZiBtZXRob2RzIHRvIGNvbnZlcnQgZnJvbSBKYXZhU2NyaXB0J3MgaW50ZXJuYWwgY2hhcmFjdGVyXG5cdFx0ICogcmVwcmVzZW50YXRpb24gKFVDUy0yKSB0byBVbmljb2RlIGNvZGUgcG9pbnRzLCBhbmQgYmFjay5cblx0XHQgKiBAc2VlIDxodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0XHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0XHQgKiBAdHlwZSBPYmplY3Rcblx0XHQgKi9cblx0XHQndWNzMic6IHtcblx0XHRcdCdkZWNvZGUnOiB1Y3MyZGVjb2RlLFxuXHRcdFx0J2VuY29kZSc6IHVjczJlbmNvZGVcblx0XHR9LFxuXHRcdCdkZWNvZGUnOiBkZWNvZGUsXG5cdFx0J2VuY29kZSc6IGVuY29kZSxcblx0XHQndG9BU0NJSSc6IHRvQVNDSUksXG5cdFx0J3RvVW5pY29kZSc6IHRvVW5pY29kZVxuXHR9O1xuXG5cdC8qKiBFeHBvc2UgYHB1bnljb2RlYCAqL1xuXHQvLyBTb21lIEFNRCBidWlsZCBvcHRpbWl6ZXJzLCBsaWtlIHIuanMsIGNoZWNrIGZvciBzcGVjaWZpYyBjb25kaXRpb24gcGF0dGVybnNcblx0Ly8gbGlrZSB0aGUgZm9sbG93aW5nOlxuXHRpZiAoXG5cdFx0dHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiZcblx0XHRkZWZpbmUuYW1kXG5cdCkge1xuXHRcdGRlZmluZSgncHVueWNvZGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBwdW55Y29kZTtcblx0XHR9KTtcblx0fSBlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG5cdFx0aWYgKG1vZHVsZS5leHBvcnRzID09IGZyZWVFeHBvcnRzKSB7XG5cdFx0XHQvLyBpbiBOb2RlLmpzLCBpby5qcywgb3IgUmluZ29KUyB2MC44LjArXG5cdFx0XHRmcmVlTW9kdWxlLmV4cG9ydHMgPSBwdW55Y29kZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gaW4gTmFyd2hhbCBvciBSaW5nb0pTIHYwLjcuMC1cblx0XHRcdGZvciAoa2V5IGluIHB1bnljb2RlKSB7XG5cdFx0XHRcdHB1bnljb2RlLmhhc093blByb3BlcnR5KGtleSkgJiYgKGZyZWVFeHBvcnRzW2tleV0gPSBwdW55Y29kZVtrZXldKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly8gaW4gUmhpbm8gb3IgYSB3ZWIgYnJvd3NlclxuXHRcdHJvb3QucHVueWNvZGUgPSBwdW55Y29kZTtcblx0fVxuXG59KHRoaXMpKTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuIiwidmFyIHJhbmRvbSA9IHJlcXVpcmUoXCJybmRcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gY29sb3I7XG5cbmZ1bmN0aW9uIGNvbG9yIChtYXgsIG1pbikge1xuICBtYXggfHwgKG1heCA9IDI1NSk7XG4gIHJldHVybiAncmdiKCcgKyByYW5kb20obWF4LCBtaW4pICsgJywgJyArIHJhbmRvbShtYXgsIG1pbikgKyAnLCAnICsgcmFuZG9tKG1heCwgbWluKSArICcpJztcbn1cbiIsInZhciByZWxhdGl2ZURhdGUgPSAoZnVuY3Rpb24odW5kZWZpbmVkKXtcblxuICB2YXIgU0VDT05EID0gMTAwMCxcbiAgICAgIE1JTlVURSA9IDYwICogU0VDT05ELFxuICAgICAgSE9VUiA9IDYwICogTUlOVVRFLFxuICAgICAgREFZID0gMjQgKiBIT1VSLFxuICAgICAgV0VFSyA9IDcgKiBEQVksXG4gICAgICBZRUFSID0gREFZICogMzY1LFxuICAgICAgTU9OVEggPSBZRUFSIC8gMTI7XG5cbiAgdmFyIGZvcm1hdHMgPSBbXG4gICAgWyAwLjcgKiBNSU5VVEUsICdqdXN0IG5vdycgXSxcbiAgICBbIDEuNSAqIE1JTlVURSwgJ2EgbWludXRlIGFnbycgXSxcbiAgICBbIDYwICogTUlOVVRFLCAnbWludXRlcyBhZ28nLCBNSU5VVEUgXSxcbiAgICBbIDEuNSAqIEhPVVIsICdhbiBob3VyIGFnbycgXSxcbiAgICBbIERBWSwgJ2hvdXJzIGFnbycsIEhPVVIgXSxcbiAgICBbIDIgKiBEQVksICd5ZXN0ZXJkYXknIF0sXG4gICAgWyA3ICogREFZLCAnZGF5cyBhZ28nLCBEQVkgXSxcbiAgICBbIDEuNSAqIFdFRUssICdhIHdlZWsgYWdvJ10sXG4gICAgWyBNT05USCwgJ3dlZWtzIGFnbycsIFdFRUsgXSxcbiAgICBbIDEuNSAqIE1PTlRILCAnYSBtb250aCBhZ28nIF0sXG4gICAgWyBZRUFSLCAnbW9udGhzIGFnbycsIE1PTlRIIF0sXG4gICAgWyAxLjUgKiBZRUFSLCAnYSB5ZWFyIGFnbycgXSxcbiAgICBbIE51bWJlci5NQVhfVkFMVUUsICd5ZWFycyBhZ28nLCBZRUFSIF1cbiAgXTtcblxuICBmdW5jdGlvbiByZWxhdGl2ZURhdGUoaW5wdXQscmVmZXJlbmNlKXtcbiAgICAhcmVmZXJlbmNlICYmICggcmVmZXJlbmNlID0gKG5ldyBEYXRlKS5nZXRUaW1lKCkgKTtcbiAgICByZWZlcmVuY2UgaW5zdGFuY2VvZiBEYXRlICYmICggcmVmZXJlbmNlID0gcmVmZXJlbmNlLmdldFRpbWUoKSApO1xuICAgIGlucHV0IGluc3RhbmNlb2YgRGF0ZSAmJiAoIGlucHV0ID0gaW5wdXQuZ2V0VGltZSgpICk7XG4gICAgXG4gICAgdmFyIGRlbHRhID0gcmVmZXJlbmNlIC0gaW5wdXQsXG4gICAgICAgIGZvcm1hdCwgaSwgbGVuO1xuXG4gICAgZm9yKGkgPSAtMSwgbGVuPWZvcm1hdHMubGVuZ3RoOyArK2kgPCBsZW47ICl7XG4gICAgICBmb3JtYXQgPSBmb3JtYXRzW2ldO1xuICAgICAgaWYoZGVsdGEgPCBmb3JtYXRbMF0pe1xuICAgICAgICByZXR1cm4gZm9ybWF0WzJdID09IHVuZGVmaW5lZCA/IGZvcm1hdFsxXSA6IE1hdGgucm91bmQoZGVsdGEvZm9ybWF0WzJdKSArICcgJyArIGZvcm1hdFsxXTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aXZlRGF0ZTtcblxufSkoKTtcblxuaWYodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyl7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVsYXRpdmVEYXRlO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByYW5kb207XG5cbmZ1bmN0aW9uIHJhbmRvbSAobWF4LCBtaW4pIHtcbiAgbWF4IHx8IChtYXggPSA5OTk5OTk5OTk5OTkpO1xuICBtaW4gfHwgKG1pbiA9IDApO1xuXG4gIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSk7XG59XG4iLCJcbm1vZHVsZS5leHBvcnRzID0gW1xuICAnYScsXG4gICdhbicsXG4gICdhbmQnLFxuICAnYXMnLFxuICAnYXQnLFxuICAnYnV0JyxcbiAgJ2J5JyxcbiAgJ2VuJyxcbiAgJ2ZvcicsXG4gICdmcm9tJyxcbiAgJ2hvdycsXG4gICdpZicsXG4gICdpbicsXG4gICduZWl0aGVyJyxcbiAgJ25vcicsXG4gICdvZicsXG4gICdvbicsXG4gICdvbmx5JyxcbiAgJ29udG8nLFxuICAnb3V0JyxcbiAgJ29yJyxcbiAgJ3BlcicsXG4gICdzbycsXG4gICd0aGFuJyxcbiAgJ3RoYXQnLFxuICAndGhlJyxcbiAgJ3RvJyxcbiAgJ3VudGlsJyxcbiAgJ3VwJyxcbiAgJ3Vwb24nLFxuICAndicsXG4gICd2LicsXG4gICd2ZXJzdXMnLFxuICAndnMnLFxuICAndnMuJyxcbiAgJ3ZpYScsXG4gICd3aGVuJyxcbiAgJ3dpdGgnLFxuICAnd2l0aG91dCcsXG4gICd5ZXQnXG5dOyIsInZhciB0b1RpdGxlID0gcmVxdWlyZShcInRvLXRpdGxlXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVybFRvVGl0bGU7XG5cbmZ1bmN0aW9uIHVybFRvVGl0bGUgKHVybCkge1xuICB1cmwgPSB1bmVzY2FwZSh1cmwpLnJlcGxhY2UoL18vZywgJyAnKTtcbiAgdXJsID0gdXJsLnJlcGxhY2UoL15cXHcrOlxcL1xcLy8sICcnKTtcbiAgdXJsID0gdXJsLnJlcGxhY2UoL153d3dcXC4vLCAnJyk7XG4gIHVybCA9IHVybC5yZXBsYWNlKC8oXFwvfFxcPykkLywgJycpO1xuXG4gIHZhciBwYXJ0cyA9IHVybC5zcGxpdCgnPycpO1xuICB1cmwgPSBwYXJ0c1swXTtcbiAgdXJsID0gdXJsLnJlcGxhY2UoL1xcLlxcdyskLywgJycpO1xuXG4gIHBhcnRzID0gdXJsLnNwbGl0KCcvJyk7XG5cbiAgdmFyIG5hbWUgPSBwYXJ0c1swXTtcbiAgbmFtZSA9IG5hbWUucmVwbGFjZSgvXFwuXFx3KyhcXC98JCkvLCAnJykucmVwbGFjZSgvXFwuKGNvbT98bmV0fG9yZ3xmcikkLywgJycpXG5cbiAgaWYgKHBhcnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgcmV0dXJuIHRpdGxlKG5hbWUpO1xuICB9XG5cbiAgcmV0dXJuIHRvVGl0bGUocGFydHMuc2xpY2UoMSkucmV2ZXJzZSgpLm1hcCh0b1RpdGxlKS5qb2luKCcgLSAnKSkgKyAnIG9uICcgKyB0aXRsZShuYW1lKTtcbn1cblxuZnVuY3Rpb24gdGl0bGUgKGhvc3QpIHtcbiAgaWYgKC9eW1xcd1xcLlxcLV0rOlxcZCsvLnRlc3QoaG9zdCkpIHtcbiAgICByZXR1cm4gaG9zdFxuICB9XG5cbiAgcmV0dXJuIHRvVGl0bGUoaG9zdC5zcGxpdCgnLicpLmpvaW4oJywgJykpXG59XG4iLCJcbnZhciBjbGVhbiA9IHJlcXVpcmUoJ3RvLW5vLWNhc2UnKTtcblxuXG4vKipcbiAqIEV4cG9zZSBgdG9DYXBpdGFsQ2FzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0b0NhcGl0YWxDYXNlO1xuXG5cbi8qKlxuICogQ29udmVydCBhIGBzdHJpbmdgIHRvIGNhcGl0YWwgY2FzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuXG5mdW5jdGlvbiB0b0NhcGl0YWxDYXNlIChzdHJpbmcpIHtcbiAgcmV0dXJuIGNsZWFuKHN0cmluZykucmVwbGFjZSgvKF58XFxzKShcXHcpL2csIGZ1bmN0aW9uIChtYXRjaGVzLCBwcmV2aW91cywgbGV0dGVyKSB7XG4gICAgcmV0dXJuIHByZXZpb3VzICsgbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xufSIsIlxuLyoqXG4gKiBFeHBvc2UgYHRvTm9DYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTm9DYXNlO1xuXG5cbi8qKlxuICogVGVzdCB3aGV0aGVyIGEgc3RyaW5nIGlzIGNhbWVsLWNhc2UuXG4gKi9cblxudmFyIGhhc1NwYWNlID0gL1xccy87XG52YXIgaGFzQ2FtZWwgPSAvW2Etel1bQS1aXS87XG52YXIgaGFzU2VwYXJhdG9yID0gL1tcXFdfXS87XG5cblxuLyoqXG4gKiBSZW1vdmUgYW55IHN0YXJ0aW5nIGNhc2UgZnJvbSBhIGBzdHJpbmdgLCBsaWtlIGNhbWVsIG9yIHNuYWtlLCBidXQga2VlcFxuICogc3BhY2VzIGFuZCBwdW5jdHVhdGlvbiB0aGF0IG1heSBiZSBpbXBvcnRhbnQgb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiB0b05vQ2FzZSAoc3RyaW5nKSB7XG4gIGlmIChoYXNTcGFjZS50ZXN0KHN0cmluZykpIHJldHVybiBzdHJpbmcudG9Mb3dlckNhc2UoKTtcblxuICBpZiAoaGFzU2VwYXJhdG9yLnRlc3Qoc3RyaW5nKSkgc3RyaW5nID0gdW5zZXBhcmF0ZShzdHJpbmcpO1xuICBpZiAoaGFzQ2FtZWwudGVzdChzdHJpbmcpKSBzdHJpbmcgPSB1bmNhbWVsaXplKHN0cmluZyk7XG4gIHJldHVybiBzdHJpbmcudG9Mb3dlckNhc2UoKTtcbn1cblxuXG4vKipcbiAqIFNlcGFyYXRvciBzcGxpdHRlci5cbiAqL1xuXG52YXIgc2VwYXJhdG9yU3BsaXR0ZXIgPSAvW1xcV19dKygufCQpL2c7XG5cblxuLyoqXG4gKiBVbi1zZXBhcmF0ZSBhIGBzdHJpbmdgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiB1bnNlcGFyYXRlIChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKHNlcGFyYXRvclNwbGl0dGVyLCBmdW5jdGlvbiAobSwgbmV4dCkge1xuICAgIHJldHVybiBuZXh0ID8gJyAnICsgbmV4dCA6ICcnO1xuICB9KTtcbn1cblxuXG4vKipcbiAqIENhbWVsY2FzZSBzcGxpdHRlci5cbiAqL1xuXG52YXIgY2FtZWxTcGxpdHRlciA9IC8oLikoW0EtWl0rKS9nO1xuXG5cbi8qKlxuICogVW4tY2FtZWxjYXNlIGEgYHN0cmluZ2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHVuY2FtZWxpemUgKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoY2FtZWxTcGxpdHRlciwgZnVuY3Rpb24gKG0sIHByZXZpb3VzLCB1cHBlcnMpIHtcbiAgICByZXR1cm4gcHJldmlvdXMgKyAnICcgKyB1cHBlcnMudG9Mb3dlckNhc2UoKS5zcGxpdCgnJykuam9pbignICcpO1xuICB9KTtcbn0iLCJ2YXIgZXNjYXBlID0gcmVxdWlyZSgnZXNjYXBlLXJlZ2V4cC1jb21wb25lbnQnKTtcbnZhciBjYXBpdGFsID0gcmVxdWlyZSgndG8tY2FwaXRhbC1jYXNlJyk7XG52YXIgbWlub3JzID0gcmVxdWlyZSgndGl0bGUtY2FzZS1taW5vcnMnKTtcblxuLyoqXG4gKiBFeHBvc2UgYHRvVGl0bGVDYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvVGl0bGVDYXNlO1xuXG5cbi8qKlxuICogTWlub3JzLlxuICovXG5cbnZhciBlc2NhcGVkID0gbWlub3JzLm1hcChlc2NhcGUpO1xudmFyIG1pbm9yTWF0Y2hlciA9IG5ldyBSZWdFeHAoJ1teXl1cXFxcYignICsgZXNjYXBlZC5qb2luKCd8JykgKyAnKVxcXFxiJywgJ2lnJyk7XG52YXIgY29sb25NYXRjaGVyID0gLzpcXHMqKFxcdykvZztcblxuXG4vKipcbiAqIENvbnZlcnQgYSBgc3RyaW5nYCB0byBjYW1lbCBjYXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlIChzdHJpbmcpIHtcbiAgcmV0dXJuIGNhcGl0YWwoc3RyaW5nKVxuICAgIC5yZXBsYWNlKG1pbm9yTWF0Y2hlciwgZnVuY3Rpb24gKG1pbm9yKSB7XG4gICAgICByZXR1cm4gbWlub3IudG9Mb3dlckNhc2UoKTtcbiAgICB9KVxuICAgIC5yZXBsYWNlKGNvbG9uTWF0Y2hlciwgZnVuY3Rpb24gKGxldHRlcikge1xuICAgICAgcmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHB1bnljb2RlID0gcmVxdWlyZSgncHVueWNvZGUnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmV4cG9ydHMucGFyc2UgPSB1cmxQYXJzZTtcbmV4cG9ydHMucmVzb2x2ZSA9IHVybFJlc29sdmU7XG5leHBvcnRzLnJlc29sdmVPYmplY3QgPSB1cmxSZXNvbHZlT2JqZWN0O1xuZXhwb3J0cy5mb3JtYXQgPSB1cmxGb3JtYXQ7XG5cbmV4cG9ydHMuVXJsID0gVXJsO1xuXG5mdW5jdGlvbiBVcmwoKSB7XG4gIHRoaXMucHJvdG9jb2wgPSBudWxsO1xuICB0aGlzLnNsYXNoZXMgPSBudWxsO1xuICB0aGlzLmF1dGggPSBudWxsO1xuICB0aGlzLmhvc3QgPSBudWxsO1xuICB0aGlzLnBvcnQgPSBudWxsO1xuICB0aGlzLmhvc3RuYW1lID0gbnVsbDtcbiAgdGhpcy5oYXNoID0gbnVsbDtcbiAgdGhpcy5zZWFyY2ggPSBudWxsO1xuICB0aGlzLnF1ZXJ5ID0gbnVsbDtcbiAgdGhpcy5wYXRobmFtZSA9IG51bGw7XG4gIHRoaXMucGF0aCA9IG51bGw7XG4gIHRoaXMuaHJlZiA9IG51bGw7XG59XG5cbi8vIFJlZmVyZW5jZTogUkZDIDM5ODYsIFJGQyAxODA4LCBSRkMgMjM5NlxuXG4vLyBkZWZpbmUgdGhlc2UgaGVyZSBzbyBhdCBsZWFzdCB0aGV5IG9ubHkgaGF2ZSB0byBiZVxuLy8gY29tcGlsZWQgb25jZSBvbiB0aGUgZmlyc3QgbW9kdWxlIGxvYWQuXG52YXIgcHJvdG9jb2xQYXR0ZXJuID0gL14oW2EtejAtOS4rLV0rOikvaSxcbiAgICBwb3J0UGF0dGVybiA9IC86WzAtOV0qJC8sXG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIGEgc2ltcGxlIHBhdGggVVJMXG4gICAgc2ltcGxlUGF0aFBhdHRlcm4gPSAvXihcXC9cXC8/KD8hXFwvKVteXFw/XFxzXSopKFxcP1teXFxzXSopPyQvLFxuXG4gICAgLy8gUkZDIDIzOTY6IGNoYXJhY3RlcnMgcmVzZXJ2ZWQgZm9yIGRlbGltaXRpbmcgVVJMcy5cbiAgICAvLyBXZSBhY3R1YWxseSBqdXN0IGF1dG8tZXNjYXBlIHRoZXNlLlxuICAgIGRlbGltcyA9IFsnPCcsICc+JywgJ1wiJywgJ2AnLCAnICcsICdcXHInLCAnXFxuJywgJ1xcdCddLFxuXG4gICAgLy8gUkZDIDIzOTY6IGNoYXJhY3RlcnMgbm90IGFsbG93ZWQgZm9yIHZhcmlvdXMgcmVhc29ucy5cbiAgICB1bndpc2UgPSBbJ3snLCAnfScsICd8JywgJ1xcXFwnLCAnXicsICdgJ10uY29uY2F0KGRlbGltcyksXG5cbiAgICAvLyBBbGxvd2VkIGJ5IFJGQ3MsIGJ1dCBjYXVzZSBvZiBYU1MgYXR0YWNrcy4gIEFsd2F5cyBlc2NhcGUgdGhlc2UuXG4gICAgYXV0b0VzY2FwZSA9IFsnXFwnJ10uY29uY2F0KHVud2lzZSksXG4gICAgLy8gQ2hhcmFjdGVycyB0aGF0IGFyZSBuZXZlciBldmVyIGFsbG93ZWQgaW4gYSBob3N0bmFtZS5cbiAgICAvLyBOb3RlIHRoYXQgYW55IGludmFsaWQgY2hhcnMgYXJlIGFsc28gaGFuZGxlZCwgYnV0IHRoZXNlXG4gICAgLy8gYXJlIHRoZSBvbmVzIHRoYXQgYXJlICpleHBlY3RlZCogdG8gYmUgc2Vlbiwgc28gd2UgZmFzdC1wYXRoXG4gICAgLy8gdGhlbS5cbiAgICBub25Ib3N0Q2hhcnMgPSBbJyUnLCAnLycsICc/JywgJzsnLCAnIyddLmNvbmNhdChhdXRvRXNjYXBlKSxcbiAgICBob3N0RW5kaW5nQ2hhcnMgPSBbJy8nLCAnPycsICcjJ10sXG4gICAgaG9zdG5hbWVNYXhMZW4gPSAyNTUsXG4gICAgaG9zdG5hbWVQYXJ0UGF0dGVybiA9IC9eWythLXowLTlBLVpfLV17MCw2M30kLyxcbiAgICBob3N0bmFtZVBhcnRTdGFydCA9IC9eKFsrYS16MC05QS1aXy1dezAsNjN9KSguKikkLyxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBjYW4gYWxsb3cgXCJ1bnNhZmVcIiBhbmQgXCJ1bndpc2VcIiBjaGFycy5cbiAgICB1bnNhZmVQcm90b2NvbCA9IHtcbiAgICAgICdqYXZhc2NyaXB0JzogdHJ1ZSxcbiAgICAgICdqYXZhc2NyaXB0Oic6IHRydWVcbiAgICB9LFxuICAgIC8vIHByb3RvY29scyB0aGF0IG5ldmVyIGhhdmUgYSBob3N0bmFtZS5cbiAgICBob3N0bGVzc1Byb3RvY29sID0ge1xuICAgICAgJ2phdmFzY3JpcHQnOiB0cnVlLFxuICAgICAgJ2phdmFzY3JpcHQ6JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgYWx3YXlzIGNvbnRhaW4gYSAvLyBiaXQuXG4gICAgc2xhc2hlZFByb3RvY29sID0ge1xuICAgICAgJ2h0dHAnOiB0cnVlLFxuICAgICAgJ2h0dHBzJzogdHJ1ZSxcbiAgICAgICdmdHAnOiB0cnVlLFxuICAgICAgJ2dvcGhlcic6IHRydWUsXG4gICAgICAnZmlsZSc6IHRydWUsXG4gICAgICAnaHR0cDonOiB0cnVlLFxuICAgICAgJ2h0dHBzOic6IHRydWUsXG4gICAgICAnZnRwOic6IHRydWUsXG4gICAgICAnZ29waGVyOic6IHRydWUsXG4gICAgICAnZmlsZTonOiB0cnVlXG4gICAgfSxcbiAgICBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XG5cbmZ1bmN0aW9uIHVybFBhcnNlKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpIHtcbiAgaWYgKHVybCAmJiB1dGlsLmlzT2JqZWN0KHVybCkgJiYgdXJsIGluc3RhbmNlb2YgVXJsKSByZXR1cm4gdXJsO1xuXG4gIHZhciB1ID0gbmV3IFVybDtcbiAgdS5wYXJzZSh1cmwsIHBhcnNlUXVlcnlTdHJpbmcsIHNsYXNoZXNEZW5vdGVIb3N0KTtcbiAgcmV0dXJuIHU7XG59XG5cblVybC5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbih1cmwsIHBhcnNlUXVlcnlTdHJpbmcsIHNsYXNoZXNEZW5vdGVIb3N0KSB7XG4gIGlmICghdXRpbC5pc1N0cmluZyh1cmwpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlBhcmFtZXRlciAndXJsJyBtdXN0IGJlIGEgc3RyaW5nLCBub3QgXCIgKyB0eXBlb2YgdXJsKTtcbiAgfVxuXG4gIC8vIENvcHkgY2hyb21lLCBJRSwgb3BlcmEgYmFja3NsYXNoLWhhbmRsaW5nIGJlaGF2aW9yLlxuICAvLyBCYWNrIHNsYXNoZXMgYmVmb3JlIHRoZSBxdWVyeSBzdHJpbmcgZ2V0IGNvbnZlcnRlZCB0byBmb3J3YXJkIHNsYXNoZXNcbiAgLy8gU2VlOiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MjU5MTZcbiAgdmFyIHF1ZXJ5SW5kZXggPSB1cmwuaW5kZXhPZignPycpLFxuICAgICAgc3BsaXR0ZXIgPVxuICAgICAgICAgIChxdWVyeUluZGV4ICE9PSAtMSAmJiBxdWVyeUluZGV4IDwgdXJsLmluZGV4T2YoJyMnKSkgPyAnPycgOiAnIycsXG4gICAgICB1U3BsaXQgPSB1cmwuc3BsaXQoc3BsaXR0ZXIpLFxuICAgICAgc2xhc2hSZWdleCA9IC9cXFxcL2c7XG4gIHVTcGxpdFswXSA9IHVTcGxpdFswXS5yZXBsYWNlKHNsYXNoUmVnZXgsICcvJyk7XG4gIHVybCA9IHVTcGxpdC5qb2luKHNwbGl0dGVyKTtcblxuICB2YXIgcmVzdCA9IHVybDtcblxuICAvLyB0cmltIGJlZm9yZSBwcm9jZWVkaW5nLlxuICAvLyBUaGlzIGlzIHRvIHN1cHBvcnQgcGFyc2Ugc3R1ZmYgbGlrZSBcIiAgaHR0cDovL2Zvby5jb20gIFxcblwiXG4gIHJlc3QgPSByZXN0LnRyaW0oKTtcblxuICBpZiAoIXNsYXNoZXNEZW5vdGVIb3N0ICYmIHVybC5zcGxpdCgnIycpLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIFRyeSBmYXN0IHBhdGggcmVnZXhwXG4gICAgdmFyIHNpbXBsZVBhdGggPSBzaW1wbGVQYXRoUGF0dGVybi5leGVjKHJlc3QpO1xuICAgIGlmIChzaW1wbGVQYXRoKSB7XG4gICAgICB0aGlzLnBhdGggPSByZXN0O1xuICAgICAgdGhpcy5ocmVmID0gcmVzdDtcbiAgICAgIHRoaXMucGF0aG5hbWUgPSBzaW1wbGVQYXRoWzFdO1xuICAgICAgaWYgKHNpbXBsZVBhdGhbMl0pIHtcbiAgICAgICAgdGhpcy5zZWFyY2ggPSBzaW1wbGVQYXRoWzJdO1xuICAgICAgICBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgICAgIHRoaXMucXVlcnkgPSBxdWVyeXN0cmluZy5wYXJzZSh0aGlzLnNlYXJjaC5zdWJzdHIoMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucXVlcnkgPSB0aGlzLnNlYXJjaC5zdWJzdHIoMSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgICB0aGlzLnNlYXJjaCA9ICcnO1xuICAgICAgICB0aGlzLnF1ZXJ5ID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cblxuICB2YXIgcHJvdG8gPSBwcm90b2NvbFBhdHRlcm4uZXhlYyhyZXN0KTtcbiAgaWYgKHByb3RvKSB7XG4gICAgcHJvdG8gPSBwcm90b1swXTtcbiAgICB2YXIgbG93ZXJQcm90byA9IHByb3RvLnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5wcm90b2NvbCA9IGxvd2VyUHJvdG87XG4gICAgcmVzdCA9IHJlc3Quc3Vic3RyKHByb3RvLmxlbmd0aCk7XG4gIH1cblxuICAvLyBmaWd1cmUgb3V0IGlmIGl0J3MgZ290IGEgaG9zdFxuICAvLyB1c2VyQHNlcnZlciBpcyAqYWx3YXlzKiBpbnRlcnByZXRlZCBhcyBhIGhvc3RuYW1lLCBhbmQgdXJsXG4gIC8vIHJlc29sdXRpb24gd2lsbCB0cmVhdCAvL2Zvby9iYXIgYXMgaG9zdD1mb28scGF0aD1iYXIgYmVjYXVzZSB0aGF0J3NcbiAgLy8gaG93IHRoZSBicm93c2VyIHJlc29sdmVzIHJlbGF0aXZlIFVSTHMuXG4gIGlmIChzbGFzaGVzRGVub3RlSG9zdCB8fCBwcm90byB8fCByZXN0Lm1hdGNoKC9eXFwvXFwvW15AXFwvXStAW15AXFwvXSsvKSkge1xuICAgIHZhciBzbGFzaGVzID0gcmVzdC5zdWJzdHIoMCwgMikgPT09ICcvLyc7XG4gICAgaWYgKHNsYXNoZXMgJiYgIShwcm90byAmJiBob3N0bGVzc1Byb3RvY29sW3Byb3RvXSkpIHtcbiAgICAgIHJlc3QgPSByZXN0LnN1YnN0cigyKTtcbiAgICAgIHRoaXMuc2xhc2hlcyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob3N0bGVzc1Byb3RvY29sW3Byb3RvXSAmJlxuICAgICAgKHNsYXNoZXMgfHwgKHByb3RvICYmICFzbGFzaGVkUHJvdG9jb2xbcHJvdG9dKSkpIHtcblxuICAgIC8vIHRoZXJlJ3MgYSBob3N0bmFtZS5cbiAgICAvLyB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgLywgPywgOywgb3IgIyBlbmRzIHRoZSBob3N0LlxuICAgIC8vXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gQCBpbiB0aGUgaG9zdG5hbWUsIHRoZW4gbm9uLWhvc3QgY2hhcnMgKmFyZSogYWxsb3dlZFxuICAgIC8vIHRvIHRoZSBsZWZ0IG9mIHRoZSBsYXN0IEAgc2lnbiwgdW5sZXNzIHNvbWUgaG9zdC1lbmRpbmcgY2hhcmFjdGVyXG4gICAgLy8gY29tZXMgKmJlZm9yZSogdGhlIEAtc2lnbi5cbiAgICAvLyBVUkxzIGFyZSBvYm5veGlvdXMuXG4gICAgLy9cbiAgICAvLyBleDpcbiAgICAvLyBodHRwOi8vYUBiQGMvID0+IHVzZXI6YUBiIGhvc3Q6Y1xuICAgIC8vIGh0dHA6Ly9hQGI/QGMgPT4gdXNlcjphIGhvc3Q6YyBwYXRoOi8/QGNcblxuICAgIC8vIHYwLjEyIFRPRE8oaXNhYWNzKTogVGhpcyBpcyBub3QgcXVpdGUgaG93IENocm9tZSBkb2VzIHRoaW5ncy5cbiAgICAvLyBSZXZpZXcgb3VyIHRlc3QgY2FzZSBhZ2FpbnN0IGJyb3dzZXJzIG1vcmUgY29tcHJlaGVuc2l2ZWx5LlxuXG4gICAgLy8gZmluZCB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgYW55IGhvc3RFbmRpbmdDaGFyc1xuICAgIHZhciBob3N0RW5kID0gLTE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBob3N0RW5kaW5nQ2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBoZWMgPSByZXN0LmluZGV4T2YoaG9zdEVuZGluZ0NoYXJzW2ldKTtcbiAgICAgIGlmIChoZWMgIT09IC0xICYmIChob3N0RW5kID09PSAtMSB8fCBoZWMgPCBob3N0RW5kKSlcbiAgICAgICAgaG9zdEVuZCA9IGhlYztcbiAgICB9XG5cbiAgICAvLyBhdCB0aGlzIHBvaW50LCBlaXRoZXIgd2UgaGF2ZSBhbiBleHBsaWNpdCBwb2ludCB3aGVyZSB0aGVcbiAgICAvLyBhdXRoIHBvcnRpb24gY2Fubm90IGdvIHBhc3QsIG9yIHRoZSBsYXN0IEAgY2hhciBpcyB0aGUgZGVjaWRlci5cbiAgICB2YXIgYXV0aCwgYXRTaWduO1xuICAgIGlmIChob3N0RW5kID09PSAtMSkge1xuICAgICAgLy8gYXRTaWduIGNhbiBiZSBhbnl3aGVyZS5cbiAgICAgIGF0U2lnbiA9IHJlc3QubGFzdEluZGV4T2YoJ0AnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYXRTaWduIG11c3QgYmUgaW4gYXV0aCBwb3J0aW9uLlxuICAgICAgLy8gaHR0cDovL2FAYi9jQGQgPT4gaG9zdDpiIGF1dGg6YSBwYXRoOi9jQGRcbiAgICAgIGF0U2lnbiA9IHJlc3QubGFzdEluZGV4T2YoJ0AnLCBob3N0RW5kKTtcbiAgICB9XG5cbiAgICAvLyBOb3cgd2UgaGF2ZSBhIHBvcnRpb24gd2hpY2ggaXMgZGVmaW5pdGVseSB0aGUgYXV0aC5cbiAgICAvLyBQdWxsIHRoYXQgb2ZmLlxuICAgIGlmIChhdFNpZ24gIT09IC0xKSB7XG4gICAgICBhdXRoID0gcmVzdC5zbGljZSgwLCBhdFNpZ24pO1xuICAgICAgcmVzdCA9IHJlc3Quc2xpY2UoYXRTaWduICsgMSk7XG4gICAgICB0aGlzLmF1dGggPSBkZWNvZGVVUklDb21wb25lbnQoYXV0aCk7XG4gICAgfVxuXG4gICAgLy8gdGhlIGhvc3QgaXMgdGhlIHJlbWFpbmluZyB0byB0aGUgbGVmdCBvZiB0aGUgZmlyc3Qgbm9uLWhvc3QgY2hhclxuICAgIGhvc3RFbmQgPSAtMTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vbkhvc3RDaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGhlYyA9IHJlc3QuaW5kZXhPZihub25Ib3N0Q2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKVxuICAgICAgICBob3N0RW5kID0gaGVjO1xuICAgIH1cbiAgICAvLyBpZiB3ZSBzdGlsbCBoYXZlIG5vdCBoaXQgaXQsIHRoZW4gdGhlIGVudGlyZSB0aGluZyBpcyBhIGhvc3QuXG4gICAgaWYgKGhvc3RFbmQgPT09IC0xKVxuICAgICAgaG9zdEVuZCA9IHJlc3QubGVuZ3RoO1xuXG4gICAgdGhpcy5ob3N0ID0gcmVzdC5zbGljZSgwLCBob3N0RW5kKTtcbiAgICByZXN0ID0gcmVzdC5zbGljZShob3N0RW5kKTtcblxuICAgIC8vIHB1bGwgb3V0IHBvcnQuXG4gICAgdGhpcy5wYXJzZUhvc3QoKTtcblxuICAgIC8vIHdlJ3ZlIGluZGljYXRlZCB0aGF0IHRoZXJlIGlzIGEgaG9zdG5hbWUsXG4gICAgLy8gc28gZXZlbiBpZiBpdCdzIGVtcHR5LCBpdCBoYXMgdG8gYmUgcHJlc2VudC5cbiAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZSB8fCAnJztcblxuICAgIC8vIGlmIGhvc3RuYW1lIGJlZ2lucyB3aXRoIFsgYW5kIGVuZHMgd2l0aCBdXG4gICAgLy8gYXNzdW1lIHRoYXQgaXQncyBhbiBJUHY2IGFkZHJlc3MuXG4gICAgdmFyIGlwdjZIb3N0bmFtZSA9IHRoaXMuaG9zdG5hbWVbMF0gPT09ICdbJyAmJlxuICAgICAgICB0aGlzLmhvc3RuYW1lW3RoaXMuaG9zdG5hbWUubGVuZ3RoIC0gMV0gPT09ICddJztcblxuICAgIC8vIHZhbGlkYXRlIGEgbGl0dGxlLlxuICAgIGlmICghaXB2Nkhvc3RuYW1lKSB7XG4gICAgICB2YXIgaG9zdHBhcnRzID0gdGhpcy5ob3N0bmFtZS5zcGxpdCgvXFwuLyk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGhvc3RwYXJ0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcnQgPSBob3N0cGFydHNbaV07XG4gICAgICAgIGlmICghcGFydCkgY29udGludWU7XG4gICAgICAgIGlmICghcGFydC5tYXRjaChob3N0bmFtZVBhcnRQYXR0ZXJuKSkge1xuICAgICAgICAgIHZhciBuZXdwYXJ0ID0gJyc7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGsgPSBwYXJ0Lmxlbmd0aDsgaiA8IGs7IGorKykge1xuICAgICAgICAgICAgaWYgKHBhcnQuY2hhckNvZGVBdChqKSA+IDEyNykge1xuICAgICAgICAgICAgICAvLyB3ZSByZXBsYWNlIG5vbi1BU0NJSSBjaGFyIHdpdGggYSB0ZW1wb3JhcnkgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0aGlzIHRvIG1ha2Ugc3VyZSBzaXplIG9mIGhvc3RuYW1lIGlzIG5vdFxuICAgICAgICAgICAgICAvLyBicm9rZW4gYnkgcmVwbGFjaW5nIG5vbi1BU0NJSSBieSBub3RoaW5nXG4gICAgICAgICAgICAgIG5ld3BhcnQgKz0gJ3gnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbmV3cGFydCArPSBwYXJ0W2pdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyB3ZSB0ZXN0IGFnYWluIHdpdGggQVNDSUkgY2hhciBvbmx5XG4gICAgICAgICAgaWYgKCFuZXdwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFBhdHRlcm4pKSB7XG4gICAgICAgICAgICB2YXIgdmFsaWRQYXJ0cyA9IGhvc3RwYXJ0cy5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgIHZhciBub3RIb3N0ID0gaG9zdHBhcnRzLnNsaWNlKGkgKyAxKTtcbiAgICAgICAgICAgIHZhciBiaXQgPSBwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFN0YXJ0KTtcbiAgICAgICAgICAgIGlmIChiaXQpIHtcbiAgICAgICAgICAgICAgdmFsaWRQYXJ0cy5wdXNoKGJpdFsxXSk7XG4gICAgICAgICAgICAgIG5vdEhvc3QudW5zaGlmdChiaXRbMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vdEhvc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJlc3QgPSAnLycgKyBub3RIb3N0LmpvaW4oJy4nKSArIHJlc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhvc3RuYW1lID0gdmFsaWRQYXJ0cy5qb2luKCcuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5ob3N0bmFtZS5sZW5ndGggPiBob3N0bmFtZU1heExlbikge1xuICAgICAgdGhpcy5ob3N0bmFtZSA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBob3N0bmFtZXMgYXJlIGFsd2F5cyBsb3dlciBjYXNlLlxuICAgICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpZiAoIWlwdjZIb3N0bmFtZSkge1xuICAgICAgLy8gSUROQSBTdXBwb3J0OiBSZXR1cm5zIGEgcHVueWNvZGVkIHJlcHJlc2VudGF0aW9uIG9mIFwiZG9tYWluXCIuXG4gICAgICAvLyBJdCBvbmx5IGNvbnZlcnRzIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB0aGF0XG4gICAgICAvLyBoYXZlIG5vbi1BU0NJSSBjaGFyYWN0ZXJzLCBpLmUuIGl0IGRvZXNuJ3QgbWF0dGVyIGlmXG4gICAgICAvLyB5b3UgY2FsbCBpdCB3aXRoIGEgZG9tYWluIHRoYXQgYWxyZWFkeSBpcyBBU0NJSS1vbmx5LlxuICAgICAgdGhpcy5ob3N0bmFtZSA9IHB1bnljb2RlLnRvQVNDSUkodGhpcy5ob3N0bmFtZSk7XG4gICAgfVxuXG4gICAgdmFyIHAgPSB0aGlzLnBvcnQgPyAnOicgKyB0aGlzLnBvcnQgOiAnJztcbiAgICB2YXIgaCA9IHRoaXMuaG9zdG5hbWUgfHwgJyc7XG4gICAgdGhpcy5ob3N0ID0gaCArIHA7XG4gICAgdGhpcy5ocmVmICs9IHRoaXMuaG9zdDtcblxuICAgIC8vIHN0cmlwIFsgYW5kIF0gZnJvbSB0aGUgaG9zdG5hbWVcbiAgICAvLyB0aGUgaG9zdCBmaWVsZCBzdGlsbCByZXRhaW5zIHRoZW0sIHRob3VnaFxuICAgIGlmIChpcHY2SG9zdG5hbWUpIHtcbiAgICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lLnN1YnN0cigxLCB0aGlzLmhvc3RuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgaWYgKHJlc3RbMF0gIT09ICcvJykge1xuICAgICAgICByZXN0ID0gJy8nICsgcmVzdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBub3cgcmVzdCBpcyBzZXQgdG8gdGhlIHBvc3QtaG9zdCBzdHVmZi5cbiAgLy8gY2hvcCBvZmYgYW55IGRlbGltIGNoYXJzLlxuICBpZiAoIXVuc2FmZVByb3RvY29sW2xvd2VyUHJvdG9dKSB7XG5cbiAgICAvLyBGaXJzdCwgbWFrZSAxMDAlIHN1cmUgdGhhdCBhbnkgXCJhdXRvRXNjYXBlXCIgY2hhcnMgZ2V0XG4gICAgLy8gZXNjYXBlZCwgZXZlbiBpZiBlbmNvZGVVUklDb21wb25lbnQgZG9lc24ndCB0aGluayB0aGV5XG4gICAgLy8gbmVlZCB0byBiZS5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGF1dG9Fc2NhcGUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgYWUgPSBhdXRvRXNjYXBlW2ldO1xuICAgICAgaWYgKHJlc3QuaW5kZXhPZihhZSkgPT09IC0xKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIHZhciBlc2MgPSBlbmNvZGVVUklDb21wb25lbnQoYWUpO1xuICAgICAgaWYgKGVzYyA9PT0gYWUpIHtcbiAgICAgICAgZXNjID0gZXNjYXBlKGFlKTtcbiAgICAgIH1cbiAgICAgIHJlc3QgPSByZXN0LnNwbGl0KGFlKS5qb2luKGVzYyk7XG4gICAgfVxuICB9XG5cblxuICAvLyBjaG9wIG9mZiBmcm9tIHRoZSB0YWlsIGZpcnN0LlxuICB2YXIgaGFzaCA9IHJlc3QuaW5kZXhPZignIycpO1xuICBpZiAoaGFzaCAhPT0gLTEpIHtcbiAgICAvLyBnb3QgYSBmcmFnbWVudCBzdHJpbmcuXG4gICAgdGhpcy5oYXNoID0gcmVzdC5zdWJzdHIoaGFzaCk7XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoMCwgaGFzaCk7XG4gIH1cbiAgdmFyIHFtID0gcmVzdC5pbmRleE9mKCc/Jyk7XG4gIGlmIChxbSAhPT0gLTEpIHtcbiAgICB0aGlzLnNlYXJjaCA9IHJlc3Quc3Vic3RyKHFtKTtcbiAgICB0aGlzLnF1ZXJ5ID0gcmVzdC5zdWJzdHIocW0gKyAxKTtcbiAgICBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHRoaXMucXVlcnkpO1xuICAgIH1cbiAgICByZXN0ID0gcmVzdC5zbGljZSgwLCBxbSk7XG4gIH0gZWxzZSBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgIC8vIG5vIHF1ZXJ5IHN0cmluZywgYnV0IHBhcnNlUXVlcnlTdHJpbmcgc3RpbGwgcmVxdWVzdGVkXG4gICAgdGhpcy5zZWFyY2ggPSAnJztcbiAgICB0aGlzLnF1ZXJ5ID0ge307XG4gIH1cbiAgaWYgKHJlc3QpIHRoaXMucGF0aG5hbWUgPSByZXN0O1xuICBpZiAoc2xhc2hlZFByb3RvY29sW2xvd2VyUHJvdG9dICYmXG4gICAgICB0aGlzLmhvc3RuYW1lICYmICF0aGlzLnBhdGhuYW1lKSB7XG4gICAgdGhpcy5wYXRobmFtZSA9ICcvJztcbiAgfVxuXG4gIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgaWYgKHRoaXMucGF0aG5hbWUgfHwgdGhpcy5zZWFyY2gpIHtcbiAgICB2YXIgcCA9IHRoaXMucGF0aG5hbWUgfHwgJyc7XG4gICAgdmFyIHMgPSB0aGlzLnNlYXJjaCB8fCAnJztcbiAgICB0aGlzLnBhdGggPSBwICsgcztcbiAgfVxuXG4gIC8vIGZpbmFsbHksIHJlY29uc3RydWN0IHRoZSBocmVmIGJhc2VkIG9uIHdoYXQgaGFzIGJlZW4gdmFsaWRhdGVkLlxuICB0aGlzLmhyZWYgPSB0aGlzLmZvcm1hdCgpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGZvcm1hdCBhIHBhcnNlZCBvYmplY3QgaW50byBhIHVybCBzdHJpbmdcbmZ1bmN0aW9uIHVybEZvcm1hdChvYmopIHtcbiAgLy8gZW5zdXJlIGl0J3MgYW4gb2JqZWN0LCBhbmQgbm90IGEgc3RyaW5nIHVybC5cbiAgLy8gSWYgaXQncyBhbiBvYmosIHRoaXMgaXMgYSBuby1vcC5cbiAgLy8gdGhpcyB3YXksIHlvdSBjYW4gY2FsbCB1cmxfZm9ybWF0KCkgb24gc3RyaW5nc1xuICAvLyB0byBjbGVhbiB1cCBwb3RlbnRpYWxseSB3b25reSB1cmxzLlxuICBpZiAodXRpbC5pc1N0cmluZyhvYmopKSBvYmogPSB1cmxQYXJzZShvYmopO1xuICBpZiAoIShvYmogaW5zdGFuY2VvZiBVcmwpKSByZXR1cm4gVXJsLnByb3RvdHlwZS5mb3JtYXQuY2FsbChvYmopO1xuICByZXR1cm4gb2JqLmZvcm1hdCgpO1xufVxuXG5VcmwucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXV0aCA9IHRoaXMuYXV0aCB8fCAnJztcbiAgaWYgKGF1dGgpIHtcbiAgICBhdXRoID0gZW5jb2RlVVJJQ29tcG9uZW50KGF1dGgpO1xuICAgIGF1dGggPSBhdXRoLnJlcGxhY2UoLyUzQS9pLCAnOicpO1xuICAgIGF1dGggKz0gJ0AnO1xuICB9XG5cbiAgdmFyIHByb3RvY29sID0gdGhpcy5wcm90b2NvbCB8fCAnJyxcbiAgICAgIHBhdGhuYW1lID0gdGhpcy5wYXRobmFtZSB8fCAnJyxcbiAgICAgIGhhc2ggPSB0aGlzLmhhc2ggfHwgJycsXG4gICAgICBob3N0ID0gZmFsc2UsXG4gICAgICBxdWVyeSA9ICcnO1xuXG4gIGlmICh0aGlzLmhvc3QpIHtcbiAgICBob3N0ID0gYXV0aCArIHRoaXMuaG9zdDtcbiAgfSBlbHNlIGlmICh0aGlzLmhvc3RuYW1lKSB7XG4gICAgaG9zdCA9IGF1dGggKyAodGhpcy5ob3N0bmFtZS5pbmRleE9mKCc6JykgPT09IC0xID9cbiAgICAgICAgdGhpcy5ob3N0bmFtZSA6XG4gICAgICAgICdbJyArIHRoaXMuaG9zdG5hbWUgKyAnXScpO1xuICAgIGlmICh0aGlzLnBvcnQpIHtcbiAgICAgIGhvc3QgKz0gJzonICsgdGhpcy5wb3J0O1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLnF1ZXJ5ICYmXG4gICAgICB1dGlsLmlzT2JqZWN0KHRoaXMucXVlcnkpICYmXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnF1ZXJ5KS5sZW5ndGgpIHtcbiAgICBxdWVyeSA9IHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeSh0aGlzLnF1ZXJ5KTtcbiAgfVxuXG4gIHZhciBzZWFyY2ggPSB0aGlzLnNlYXJjaCB8fCAocXVlcnkgJiYgKCc/JyArIHF1ZXJ5KSkgfHwgJyc7XG5cbiAgaWYgKHByb3RvY29sICYmIHByb3RvY29sLnN1YnN0cigtMSkgIT09ICc6JykgcHJvdG9jb2wgKz0gJzonO1xuXG4gIC8vIG9ubHkgdGhlIHNsYXNoZWRQcm90b2NvbHMgZ2V0IHRoZSAvLy4gIE5vdCBtYWlsdG86LCB4bXBwOiwgZXRjLlxuICAvLyB1bmxlc3MgdGhleSBoYWQgdGhlbSB0byBiZWdpbiB3aXRoLlxuICBpZiAodGhpcy5zbGFzaGVzIHx8XG4gICAgICAoIXByb3RvY29sIHx8IHNsYXNoZWRQcm90b2NvbFtwcm90b2NvbF0pICYmIGhvc3QgIT09IGZhbHNlKSB7XG4gICAgaG9zdCA9ICcvLycgKyAoaG9zdCB8fCAnJyk7XG4gICAgaWYgKHBhdGhuYW1lICYmIHBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nKSBwYXRobmFtZSA9ICcvJyArIHBhdGhuYW1lO1xuICB9IGVsc2UgaWYgKCFob3N0KSB7XG4gICAgaG9zdCA9ICcnO1xuICB9XG5cbiAgaWYgKGhhc2ggJiYgaGFzaC5jaGFyQXQoMCkgIT09ICcjJykgaGFzaCA9ICcjJyArIGhhc2g7XG4gIGlmIChzZWFyY2ggJiYgc2VhcmNoLmNoYXJBdCgwKSAhPT0gJz8nKSBzZWFyY2ggPSAnPycgKyBzZWFyY2g7XG5cbiAgcGF0aG5hbWUgPSBwYXRobmFtZS5yZXBsYWNlKC9bPyNdL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChtYXRjaCk7XG4gIH0pO1xuICBzZWFyY2ggPSBzZWFyY2gucmVwbGFjZSgnIycsICclMjMnKTtcblxuICByZXR1cm4gcHJvdG9jb2wgKyBob3N0ICsgcGF0aG5hbWUgKyBzZWFyY2ggKyBoYXNoO1xufTtcblxuZnVuY3Rpb24gdXJsUmVzb2x2ZShzb3VyY2UsIHJlbGF0aXZlKSB7XG4gIHJldHVybiB1cmxQYXJzZShzb3VyY2UsIGZhbHNlLCB0cnVlKS5yZXNvbHZlKHJlbGF0aXZlKTtcbn1cblxuVXJsLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcbiAgcmV0dXJuIHRoaXMucmVzb2x2ZU9iamVjdCh1cmxQYXJzZShyZWxhdGl2ZSwgZmFsc2UsIHRydWUpKS5mb3JtYXQoKTtcbn07XG5cbmZ1bmN0aW9uIHVybFJlc29sdmVPYmplY3Qoc291cmNlLCByZWxhdGl2ZSkge1xuICBpZiAoIXNvdXJjZSkgcmV0dXJuIHJlbGF0aXZlO1xuICByZXR1cm4gdXJsUGFyc2Uoc291cmNlLCBmYWxzZSwgdHJ1ZSkucmVzb2x2ZU9iamVjdChyZWxhdGl2ZSk7XG59XG5cblVybC5wcm90b3R5cGUucmVzb2x2ZU9iamVjdCA9IGZ1bmN0aW9uKHJlbGF0aXZlKSB7XG4gIGlmICh1dGlsLmlzU3RyaW5nKHJlbGF0aXZlKSkge1xuICAgIHZhciByZWwgPSBuZXcgVXJsKCk7XG4gICAgcmVsLnBhcnNlKHJlbGF0aXZlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgcmVsYXRpdmUgPSByZWw7XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gbmV3IFVybCgpO1xuICB2YXIgdGtleXMgPSBPYmplY3Qua2V5cyh0aGlzKTtcbiAgZm9yICh2YXIgdGsgPSAwOyB0ayA8IHRrZXlzLmxlbmd0aDsgdGsrKykge1xuICAgIHZhciB0a2V5ID0gdGtleXNbdGtdO1xuICAgIHJlc3VsdFt0a2V5XSA9IHRoaXNbdGtleV07XG4gIH1cblxuICAvLyBoYXNoIGlzIGFsd2F5cyBvdmVycmlkZGVuLCBubyBtYXR0ZXIgd2hhdC5cbiAgLy8gZXZlbiBocmVmPVwiXCIgd2lsbCByZW1vdmUgaXQuXG4gIHJlc3VsdC5oYXNoID0gcmVsYXRpdmUuaGFzaDtcblxuICAvLyBpZiB0aGUgcmVsYXRpdmUgdXJsIGlzIGVtcHR5LCB0aGVuIHRoZXJlJ3Mgbm90aGluZyBsZWZ0IHRvIGRvIGhlcmUuXG4gIGlmIChyZWxhdGl2ZS5ocmVmID09PSAnJykge1xuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBocmVmcyBsaWtlIC8vZm9vL2JhciBhbHdheXMgY3V0IHRvIHRoZSBwcm90b2NvbC5cbiAgaWYgKHJlbGF0aXZlLnNsYXNoZXMgJiYgIXJlbGF0aXZlLnByb3RvY29sKSB7XG4gICAgLy8gdGFrZSBldmVyeXRoaW5nIGV4Y2VwdCB0aGUgcHJvdG9jb2wgZnJvbSByZWxhdGl2ZVxuICAgIHZhciBya2V5cyA9IE9iamVjdC5rZXlzKHJlbGF0aXZlKTtcbiAgICBmb3IgKHZhciByayA9IDA7IHJrIDwgcmtleXMubGVuZ3RoOyByaysrKSB7XG4gICAgICB2YXIgcmtleSA9IHJrZXlzW3JrXTtcbiAgICAgIGlmIChya2V5ICE9PSAncHJvdG9jb2wnKVxuICAgICAgICByZXN1bHRbcmtleV0gPSByZWxhdGl2ZVtya2V5XTtcbiAgICB9XG5cbiAgICAvL3VybFBhcnNlIGFwcGVuZHMgdHJhaWxpbmcgLyB0byB1cmxzIGxpa2UgaHR0cDovL3d3dy5leGFtcGxlLmNvbVxuICAgIGlmIChzbGFzaGVkUHJvdG9jb2xbcmVzdWx0LnByb3RvY29sXSAmJlxuICAgICAgICByZXN1bHQuaG9zdG5hbWUgJiYgIXJlc3VsdC5wYXRobmFtZSkge1xuICAgICAgcmVzdWx0LnBhdGggPSByZXN1bHQucGF0aG5hbWUgPSAnLyc7XG4gICAgfVxuXG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmIChyZWxhdGl2ZS5wcm90b2NvbCAmJiByZWxhdGl2ZS5wcm90b2NvbCAhPT0gcmVzdWx0LnByb3RvY29sKSB7XG4gICAgLy8gaWYgaXQncyBhIGtub3duIHVybCBwcm90b2NvbCwgdGhlbiBjaGFuZ2luZ1xuICAgIC8vIHRoZSBwcm90b2NvbCBkb2VzIHdlaXJkIHRoaW5nc1xuICAgIC8vIGZpcnN0LCBpZiBpdCdzIG5vdCBmaWxlOiwgdGhlbiB3ZSBNVVNUIGhhdmUgYSBob3N0LFxuICAgIC8vIGFuZCBpZiB0aGVyZSB3YXMgYSBwYXRoXG4gICAgLy8gdG8gYmVnaW4gd2l0aCwgdGhlbiB3ZSBNVVNUIGhhdmUgYSBwYXRoLlxuICAgIC8vIGlmIGl0IGlzIGZpbGU6LCB0aGVuIHRoZSBob3N0IGlzIGRyb3BwZWQsXG4gICAgLy8gYmVjYXVzZSB0aGF0J3Mga25vd24gdG8gYmUgaG9zdGxlc3MuXG4gICAgLy8gYW55dGhpbmcgZWxzZSBpcyBhc3N1bWVkIHRvIGJlIGFic29sdXRlLlxuICAgIGlmICghc2xhc2hlZFByb3RvY29sW3JlbGF0aXZlLnByb3RvY29sXSkge1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhyZWxhdGl2ZSk7XG4gICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IGtleXMubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgdmFyIGsgPSBrZXlzW3ZdO1xuICAgICAgICByZXN1bHRba10gPSByZWxhdGl2ZVtrXTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICByZXN1bHQucHJvdG9jb2wgPSByZWxhdGl2ZS5wcm90b2NvbDtcbiAgICBpZiAoIXJlbGF0aXZlLmhvc3QgJiYgIWhvc3RsZXNzUHJvdG9jb2xbcmVsYXRpdmUucHJvdG9jb2xdKSB7XG4gICAgICB2YXIgcmVsUGF0aCA9IChyZWxhdGl2ZS5wYXRobmFtZSB8fCAnJykuc3BsaXQoJy8nKTtcbiAgICAgIHdoaWxlIChyZWxQYXRoLmxlbmd0aCAmJiAhKHJlbGF0aXZlLmhvc3QgPSByZWxQYXRoLnNoaWZ0KCkpKTtcbiAgICAgIGlmICghcmVsYXRpdmUuaG9zdCkgcmVsYXRpdmUuaG9zdCA9ICcnO1xuICAgICAgaWYgKCFyZWxhdGl2ZS5ob3N0bmFtZSkgcmVsYXRpdmUuaG9zdG5hbWUgPSAnJztcbiAgICAgIGlmIChyZWxQYXRoWzBdICE9PSAnJykgcmVsUGF0aC51bnNoaWZ0KCcnKTtcbiAgICAgIGlmIChyZWxQYXRoLmxlbmd0aCA8IDIpIHJlbFBhdGgudW5zaGlmdCgnJyk7XG4gICAgICByZXN1bHQucGF0aG5hbWUgPSByZWxQYXRoLmpvaW4oJy8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnBhdGhuYW1lID0gcmVsYXRpdmUucGF0aG5hbWU7XG4gICAgfVxuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgcmVzdWx0Lmhvc3QgPSByZWxhdGl2ZS5ob3N0IHx8ICcnO1xuICAgIHJlc3VsdC5hdXRoID0gcmVsYXRpdmUuYXV0aDtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSByZWxhdGl2ZS5ob3N0bmFtZSB8fCByZWxhdGl2ZS5ob3N0O1xuICAgIHJlc3VsdC5wb3J0ID0gcmVsYXRpdmUucG9ydDtcbiAgICAvLyB0byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmIChyZXN1bHQucGF0aG5hbWUgfHwgcmVzdWx0LnNlYXJjaCkge1xuICAgICAgdmFyIHAgPSByZXN1bHQucGF0aG5hbWUgfHwgJyc7XG4gICAgICB2YXIgcyA9IHJlc3VsdC5zZWFyY2ggfHwgJyc7XG4gICAgICByZXN1bHQucGF0aCA9IHAgKyBzO1xuICAgIH1cbiAgICByZXN1bHQuc2xhc2hlcyA9IHJlc3VsdC5zbGFzaGVzIHx8IHJlbGF0aXZlLnNsYXNoZXM7XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZhciBpc1NvdXJjZUFicyA9IChyZXN1bHQucGF0aG5hbWUgJiYgcmVzdWx0LnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSxcbiAgICAgIGlzUmVsQWJzID0gKFxuICAgICAgICAgIHJlbGF0aXZlLmhvc3QgfHxcbiAgICAgICAgICByZWxhdGl2ZS5wYXRobmFtZSAmJiByZWxhdGl2ZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJ1xuICAgICAgKSxcbiAgICAgIG11c3RFbmRBYnMgPSAoaXNSZWxBYnMgfHwgaXNTb3VyY2VBYnMgfHxcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5ob3N0ICYmIHJlbGF0aXZlLnBhdGhuYW1lKSksXG4gICAgICByZW1vdmVBbGxEb3RzID0gbXVzdEVuZEFicyxcbiAgICAgIHNyY1BhdGggPSByZXN1bHQucGF0aG5hbWUgJiYgcmVzdWx0LnBhdGhuYW1lLnNwbGl0KCcvJykgfHwgW10sXG4gICAgICByZWxQYXRoID0gcmVsYXRpdmUucGF0aG5hbWUgJiYgcmVsYXRpdmUucGF0aG5hbWUuc3BsaXQoJy8nKSB8fCBbXSxcbiAgICAgIHBzeWNob3RpYyA9IHJlc3VsdC5wcm90b2NvbCAmJiAhc2xhc2hlZFByb3RvY29sW3Jlc3VsdC5wcm90b2NvbF07XG5cbiAgLy8gaWYgdGhlIHVybCBpcyBhIG5vbi1zbGFzaGVkIHVybCwgdGhlbiByZWxhdGl2ZVxuICAvLyBsaW5rcyBsaWtlIC4uLy4uIHNob3VsZCBiZSBhYmxlXG4gIC8vIHRvIGNyYXdsIHVwIHRvIHRoZSBob3N0bmFtZSwgYXMgd2VsbC4gIFRoaXMgaXMgc3RyYW5nZS5cbiAgLy8gcmVzdWx0LnByb3RvY29sIGhhcyBhbHJlYWR5IGJlZW4gc2V0IGJ5IG5vdy5cbiAgLy8gTGF0ZXIgb24sIHB1dCB0aGUgZmlyc3QgcGF0aCBwYXJ0IGludG8gdGhlIGhvc3QgZmllbGQuXG4gIGlmIChwc3ljaG90aWMpIHtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSAnJztcbiAgICByZXN1bHQucG9ydCA9IG51bGw7XG4gICAgaWYgKHJlc3VsdC5ob3N0KSB7XG4gICAgICBpZiAoc3JjUGF0aFswXSA9PT0gJycpIHNyY1BhdGhbMF0gPSByZXN1bHQuaG9zdDtcbiAgICAgIGVsc2Ugc3JjUGF0aC51bnNoaWZ0KHJlc3VsdC5ob3N0KTtcbiAgICB9XG4gICAgcmVzdWx0Lmhvc3QgPSAnJztcbiAgICBpZiAocmVsYXRpdmUucHJvdG9jb2wpIHtcbiAgICAgIHJlbGF0aXZlLmhvc3RuYW1lID0gbnVsbDtcbiAgICAgIHJlbGF0aXZlLnBvcnQgPSBudWxsO1xuICAgICAgaWYgKHJlbGF0aXZlLmhvc3QpIHtcbiAgICAgICAgaWYgKHJlbFBhdGhbMF0gPT09ICcnKSByZWxQYXRoWzBdID0gcmVsYXRpdmUuaG9zdDtcbiAgICAgICAgZWxzZSByZWxQYXRoLnVuc2hpZnQocmVsYXRpdmUuaG9zdCk7XG4gICAgICB9XG4gICAgICByZWxhdGl2ZS5ob3N0ID0gbnVsbDtcbiAgICB9XG4gICAgbXVzdEVuZEFicyA9IG11c3RFbmRBYnMgJiYgKHJlbFBhdGhbMF0gPT09ICcnIHx8IHNyY1BhdGhbMF0gPT09ICcnKTtcbiAgfVxuXG4gIGlmIChpc1JlbEFicykge1xuICAgIC8vIGl0J3MgYWJzb2x1dGUuXG4gICAgcmVzdWx0Lmhvc3QgPSAocmVsYXRpdmUuaG9zdCB8fCByZWxhdGl2ZS5ob3N0ID09PSAnJykgP1xuICAgICAgICAgICAgICAgICAgcmVsYXRpdmUuaG9zdCA6IHJlc3VsdC5ob3N0O1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IChyZWxhdGl2ZS5ob3N0bmFtZSB8fCByZWxhdGl2ZS5ob3N0bmFtZSA9PT0gJycpID9cbiAgICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZS5ob3N0bmFtZSA6IHJlc3VsdC5ob3N0bmFtZTtcbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICAgIHNyY1BhdGggPSByZWxQYXRoO1xuICAgIC8vIGZhbGwgdGhyb3VnaCB0byB0aGUgZG90LWhhbmRsaW5nIGJlbG93LlxuICB9IGVsc2UgaWYgKHJlbFBhdGgubGVuZ3RoKSB7XG4gICAgLy8gaXQncyByZWxhdGl2ZVxuICAgIC8vIHRocm93IGF3YXkgdGhlIGV4aXN0aW5nIGZpbGUsIGFuZCB0YWtlIHRoZSBuZXcgcGF0aCBpbnN0ZWFkLlxuICAgIGlmICghc3JjUGF0aCkgc3JjUGF0aCA9IFtdO1xuICAgIHNyY1BhdGgucG9wKCk7XG4gICAgc3JjUGF0aCA9IHNyY1BhdGguY29uY2F0KHJlbFBhdGgpO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gIH0gZWxzZSBpZiAoIXV0aWwuaXNOdWxsT3JVbmRlZmluZWQocmVsYXRpdmUuc2VhcmNoKSkge1xuICAgIC8vIGp1c3QgcHVsbCBvdXQgdGhlIHNlYXJjaC5cbiAgICAvLyBsaWtlIGhyZWY9Jz9mb28nLlxuICAgIC8vIFB1dCB0aGlzIGFmdGVyIHRoZSBvdGhlciB0d28gY2FzZXMgYmVjYXVzZSBpdCBzaW1wbGlmaWVzIHRoZSBib29sZWFuc1xuICAgIGlmIChwc3ljaG90aWMpIHtcbiAgICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0ID0gc3JjUGF0aC5zaGlmdCgpO1xuICAgICAgLy9vY2NhdGlvbmFseSB0aGUgYXV0aCBjYW4gZ2V0IHN0dWNrIG9ubHkgaW4gaG9zdFxuICAgICAgLy90aGlzIGVzcGVjaWFsbHkgaGFwcGVucyBpbiBjYXNlcyBsaWtlXG4gICAgICAvL3VybC5yZXNvbHZlT2JqZWN0KCdtYWlsdG86bG9jYWwxQGRvbWFpbjEnLCAnbG9jYWwyQGRvbWFpbjInKVxuICAgICAgdmFyIGF1dGhJbkhvc3QgPSByZXN1bHQuaG9zdCAmJiByZXN1bHQuaG9zdC5pbmRleE9mKCdAJykgPiAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lmhvc3Quc3BsaXQoJ0AnKSA6IGZhbHNlO1xuICAgICAgaWYgKGF1dGhJbkhvc3QpIHtcbiAgICAgICAgcmVzdWx0LmF1dGggPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICAgIHJlc3VsdC5ob3N0ID0gcmVzdWx0Lmhvc3RuYW1lID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICAgIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAoIXV0aWwuaXNOdWxsKHJlc3VsdC5wYXRobmFtZSkgfHwgIXV0aWwuaXNOdWxsKHJlc3VsdC5zZWFyY2gpKSB7XG4gICAgICByZXN1bHQucGF0aCA9IChyZXN1bHQucGF0aG5hbWUgPyByZXN1bHQucGF0aG5hbWUgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgICAocmVzdWx0LnNlYXJjaCA/IHJlc3VsdC5zZWFyY2ggOiAnJyk7XG4gICAgfVxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpZiAoIXNyY1BhdGgubGVuZ3RoKSB7XG4gICAgLy8gbm8gcGF0aCBhdCBhbGwuICBlYXN5LlxuICAgIC8vIHdlJ3ZlIGFscmVhZHkgaGFuZGxlZCB0aGUgb3RoZXIgc3R1ZmYgYWJvdmUuXG4gICAgcmVzdWx0LnBhdGhuYW1lID0gbnVsbDtcbiAgICAvL3RvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKHJlc3VsdC5zZWFyY2gpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gJy8nICsgcmVzdWx0LnNlYXJjaDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnBhdGggPSBudWxsO1xuICAgIH1cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gaWYgYSB1cmwgRU5EcyBpbiAuIG9yIC4uLCB0aGVuIGl0IG11c3QgZ2V0IGEgdHJhaWxpbmcgc2xhc2guXG4gIC8vIGhvd2V2ZXIsIGlmIGl0IGVuZHMgaW4gYW55dGhpbmcgZWxzZSBub24tc2xhc2h5LFxuICAvLyB0aGVuIGl0IG11c3QgTk9UIGdldCBhIHRyYWlsaW5nIHNsYXNoLlxuICB2YXIgbGFzdCA9IHNyY1BhdGguc2xpY2UoLTEpWzBdO1xuICB2YXIgaGFzVHJhaWxpbmdTbGFzaCA9IChcbiAgICAgIChyZXN1bHQuaG9zdCB8fCByZWxhdGl2ZS5ob3N0IHx8IHNyY1BhdGgubGVuZ3RoID4gMSkgJiZcbiAgICAgIChsYXN0ID09PSAnLicgfHwgbGFzdCA9PT0gJy4uJykgfHwgbGFzdCA9PT0gJycpO1xuXG4gIC8vIHN0cmlwIHNpbmdsZSBkb3RzLCByZXNvbHZlIGRvdWJsZSBkb3RzIHRvIHBhcmVudCBkaXJcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHNyY1BhdGgubGVuZ3RoOyBpID49IDA7IGktLSkge1xuICAgIGxhc3QgPSBzcmNQYXRoW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHNyY1BhdGguc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHNyY1BhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmICghbXVzdEVuZEFicyAmJiAhcmVtb3ZlQWxsRG90cykge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgc3JjUGF0aC51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtdXN0RW5kQWJzICYmIHNyY1BhdGhbMF0gIT09ICcnICYmXG4gICAgICAoIXNyY1BhdGhbMF0gfHwgc3JjUGF0aFswXS5jaGFyQXQoMCkgIT09ICcvJykpIHtcbiAgICBzcmNQYXRoLnVuc2hpZnQoJycpO1xuICB9XG5cbiAgaWYgKGhhc1RyYWlsaW5nU2xhc2ggJiYgKHNyY1BhdGguam9pbignLycpLnN1YnN0cigtMSkgIT09ICcvJykpIHtcbiAgICBzcmNQYXRoLnB1c2goJycpO1xuICB9XG5cbiAgdmFyIGlzQWJzb2x1dGUgPSBzcmNQYXRoWzBdID09PSAnJyB8fFxuICAgICAgKHNyY1BhdGhbMF0gJiYgc3JjUGF0aFswXS5jaGFyQXQoMCkgPT09ICcvJyk7XG5cbiAgLy8gcHV0IHRoZSBob3N0IGJhY2tcbiAgaWYgKHBzeWNob3RpYykge1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0ID0gaXNBYnNvbHV0ZSA/ICcnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY1BhdGgubGVuZ3RoID8gc3JjUGF0aC5zaGlmdCgpIDogJyc7XG4gICAgLy9vY2NhdGlvbmFseSB0aGUgYXV0aCBjYW4gZ2V0IHN0dWNrIG9ubHkgaW4gaG9zdFxuICAgIC8vdGhpcyBlc3BlY2lhbGx5IGhhcHBlbnMgaW4gY2FzZXMgbGlrZVxuICAgIC8vdXJsLnJlc29sdmVPYmplY3QoJ21haWx0bzpsb2NhbDFAZG9tYWluMScsICdsb2NhbDJAZG9tYWluMicpXG4gICAgdmFyIGF1dGhJbkhvc3QgPSByZXN1bHQuaG9zdCAmJiByZXN1bHQuaG9zdC5pbmRleE9mKCdAJykgPiAwID9cbiAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5ob3N0LnNwbGl0KCdAJykgOiBmYWxzZTtcbiAgICBpZiAoYXV0aEluSG9zdCkge1xuICAgICAgcmVzdWx0LmF1dGggPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICByZXN1bHQuaG9zdCA9IHJlc3VsdC5ob3N0bmFtZSA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICB9XG4gIH1cblxuICBtdXN0RW5kQWJzID0gbXVzdEVuZEFicyB8fCAocmVzdWx0Lmhvc3QgJiYgc3JjUGF0aC5sZW5ndGgpO1xuXG4gIGlmIChtdXN0RW5kQWJzICYmICFpc0Fic29sdXRlKSB7XG4gICAgc3JjUGF0aC51bnNoaWZ0KCcnKTtcbiAgfVxuXG4gIGlmICghc3JjUGF0aC5sZW5ndGgpIHtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBudWxsO1xuICAgIHJlc3VsdC5wYXRoID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBzcmNQYXRoLmpvaW4oJy8nKTtcbiAgfVxuXG4gIC8vdG8gc3VwcG9ydCByZXF1ZXN0Lmh0dHBcbiAgaWYgKCF1dGlsLmlzTnVsbChyZXN1bHQucGF0aG5hbWUpIHx8ICF1dGlsLmlzTnVsbChyZXN1bHQuc2VhcmNoKSkge1xuICAgIHJlc3VsdC5wYXRoID0gKHJlc3VsdC5wYXRobmFtZSA/IHJlc3VsdC5wYXRobmFtZSA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAocmVzdWx0LnNlYXJjaCA/IHJlc3VsdC5zZWFyY2ggOiAnJyk7XG4gIH1cbiAgcmVzdWx0LmF1dGggPSByZWxhdGl2ZS5hdXRoIHx8IHJlc3VsdC5hdXRoO1xuICByZXN1bHQuc2xhc2hlcyA9IHJlc3VsdC5zbGFzaGVzIHx8IHJlbGF0aXZlLnNsYXNoZXM7XG4gIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuVXJsLnByb3RvdHlwZS5wYXJzZUhvc3QgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhvc3QgPSB0aGlzLmhvc3Q7XG4gIHZhciBwb3J0ID0gcG9ydFBhdHRlcm4uZXhlYyhob3N0KTtcbiAgaWYgKHBvcnQpIHtcbiAgICBwb3J0ID0gcG9ydFswXTtcbiAgICBpZiAocG9ydCAhPT0gJzonKSB7XG4gICAgICB0aGlzLnBvcnQgPSBwb3J0LnN1YnN0cigxKTtcbiAgICB9XG4gICAgaG9zdCA9IGhvc3Quc3Vic3RyKDAsIGhvc3QubGVuZ3RoIC0gcG9ydC5sZW5ndGgpO1xuICB9XG4gIGlmIChob3N0KSB0aGlzLmhvc3RuYW1lID0gaG9zdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1N0cmluZzogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZihhcmcpID09PSAnc3RyaW5nJztcbiAgfSxcbiAgaXNPYmplY3Q6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB0eXBlb2YoYXJnKSA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xuICB9LFxuICBpc051bGw6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBhcmcgPT09IG51bGw7XG4gIH0sXG4gIGlzTnVsbE9yVW5kZWZpbmVkOiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gYXJnID09IG51bGw7XG4gIH1cbn07XG4iLCJjb25zdCBwYXJzZSA9IHJlcXVpcmUoXCJ1cmxcIikucGFyc2VcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNsZWFuLFxuICBwYWdlLFxuICBwcm90b2NvbCxcbiAgaG9zdG5hbWUsXG4gIG5vcm1hbGl6ZSxcbiAgaXNTZWFyY2hRdWVyeSxcbiAgaXNVUkxcbn1cblxuZnVuY3Rpb24gcHJvdG9jb2wgKHVybCkge1xuICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvKF5cXHcrKTpcXC9cXC8vKVxuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gbWF0Y2hbMV1cbiAgfVxuXG4gIHJldHVybiAnaHR0cCdcbn1cblxuZnVuY3Rpb24gY2xlYW4gKHVybCkge1xuICByZXR1cm4gY2xlYW5VVE0odXJsKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvXlxcdys6XFwvXFwvLywgJycpXG4gICAgLnJlcGxhY2UoL15bXFx3LV9dKzpbXFx3LV9dK0AvLCAnJylcbiAgICAucmVwbGFjZSgvIy4qJC8sICcnKVxuICAgIC5yZXBsYWNlKC8oXFwvfFxcP3xcXCZ8IykqJC8sICcnKVxuICAgIC5yZXBsYWNlKC9cXC9cXD8vLCAnPycpXG4gICAgLnJlcGxhY2UoL153d3dcXC4vLCAnJylcbn1cblxuZnVuY3Rpb24gcGFnZSAodXJsKSB7XG4gIHJldHVybiBjbGVhbih1cmwucmVwbGFjZSgvXFwjLiokLywgJycpKVxufVxuXG5mdW5jdGlvbiBob3N0bmFtZSAodXJsKSB7XG4gIHJldHVybiBwYXJzZShub3JtYWxpemUodXJsKSkuaG9zdG5hbWUucmVwbGFjZSgvXnd3d1xcLi8sICcnKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemUgKGlucHV0KSB7XG4gIGlmIChpbnB1dC50cmltKCkubGVuZ3RoID09PSAwKSByZXR1cm4gJydcblxuICBpZiAoaXNTZWFyY2hRdWVyeShpbnB1dCkpIHtcbiAgICByZXR1cm4gYGh0dHBzOi8vZ29vZ2xlLmNvbS9zZWFyY2g/cT0ke2VuY29kZVVSSShpbnB1dCl9YFxuICB9XG5cbiAgaWYgKCEvXlxcdys6XFwvXFwvLy50ZXN0KGlucHV0KSkge1xuICAgIHJldHVybiBgaHR0cDovLyR7aW5wdXR9YFxuICB9XG5cbiAgcmV0dXJuIGlucHV0XG59XG5cbmZ1bmN0aW9uIGlzU2VhcmNoUXVlcnkgKGlucHV0KSB7XG4gIHJldHVybiAhaXNVUkwoaW5wdXQudHJpbSgpKVxufVxuXG5mdW5jdGlvbiBpc1VSTCAoaW5wdXQpIHtcbiAgcmV0dXJuIGlucHV0LmluZGV4T2YoJyAnKSA9PT0gLTEgJiYgKC9eXFx3KzpcXC9cXC8vLnRlc3QoaW5wdXQpIHx8IGlucHV0LmluZGV4T2YoJy4nKSA+IDAgfHwgaW5wdXQuaW5kZXhPZignOicpID4gMClcbn1cblxuZnVuY3Rpb24gY2xlYW5VVE0gKHVybCkge1xuICByZXR1cm4gdXJsXG4gICAgLnJlcGxhY2UoLyhcXD98XFwmKXV0bV9bXFx3XStcXD1bXlxcJl0rL2csICckMScpXG4gICAgLnJlcGxhY2UoLyhcXD98XFwmKXJlZlxcPVteXFwmXStcXCY/LywgJyQxJylcbiAgICAucmVwbGFjZSgvW1xcJl17Mix9LywnJicpXG4gICAgLnJlcGxhY2UoJz8mJywgJz8nKVxufVxuIl19
