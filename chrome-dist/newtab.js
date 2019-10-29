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
      return query.length > 0 && query.indexOf("tag:") === -1 && query.indexOf("in:") === -1;
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

},{"../config":2,"./rows":23,"debounce-fn":36}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _row = require("./row");

var _row2 = _interopRequireDefault(_row);

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
            result.push(new _row2.default(_this2, topSites[i]));
          }
        }

        _this2.add(result);
      });
    }
  }]);

  return AutocompleteTopSites;
}(_rows2.default);

exports.default = AutocompleteTopSites;

},{"./row":22,"./rows":23,"debounce-fn":36,"urls":56}],6:[function(require,module,exports){
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
      return query && query.length > 1 && (query.indexOf("tag:") !== 0 || query.length < 5) && query.indexOf("in:") !== 0;
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

},{"./rows":23,"debounce-fn":36}],7:[function(require,module,exports){
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
        }) : resp.content;

        _this2.add(content);
      });
    }
  }]);

  return ListBookmarksByTag;
}(_rows2.default);

exports.default = ListBookmarksByTag;

},{"../config":2,"./rows":23}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require("./rows");

var _rows2 = _interopRequireDefault(_rows);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListBookmarksByCollection = function (_Rows) {
  _inherits(ListBookmarksByCollection, _Rows);

  function ListBookmarksByCollection(results, sort) {
    _classCallCheck(this, ListBookmarksByCollection);

    var _this = _possibleConstructorReturn(this, (ListBookmarksByCollection.__proto__ || Object.getPrototypeOf(ListBookmarksByCollection)).call(this, results, sort));

    _this.name = "bookmarks-by-collection";
    _this.title = function (query) {
      return "Bookmarks in \"" + query.slice(3) + " Collection\"";
    };
    return _this;
  }

  _createClass(ListBookmarksByCollection, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return query && query.indexOf("in:") === 0 && query.length > 3;
    }
  }, {
    key: "update",
    value: async function update(query) {
      var _parseQuery = parseQuery(query || this.results.props.query),
          _parseQuery2 = _slicedToArray(_parseQuery, 2),
          collection = _parseQuery2[0],
          filter = _parseQuery2[1];

      var results = void 0;

      try {
        results = await this.getBookmarksByCollection(collection, filter);
      } catch (err) {
        this.fail(err);
      }

      this.add(results);
    }
  }, {
    key: "getBookmarksByCollection",
    value: async function getBookmarksByCollection(collection, filter) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.results.messages.send({
          task: "get-bookmarks-by-collection",
          collection: collection,
          offset: 0,
          limit: 5,
          filter: filter
        }, function (resp) {
          if (resp.error) return reject(resp.error);
          resolve(resp.content);
        });
      });
    }
  }, {
    key: "getLinkByUrl",
    value: async function getLinkByUrl(url) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.results.messages.send({ task: "get-like", url: url }, function (resp) {
          if (resp.error) return reject(resp.error);
          resolve(resp.content.like);
        });
      });
    }
  }]);

  return ListBookmarksByCollection;
}(_rows2.default);

exports.default = ListBookmarksByCollection;


function parseQuery(query) {
  if (/^in:\"[\w\s]+\"$/.test(query)) {
    return [query.slice(4, -1).trim()];
  }

  if (/^in:\"[\w\s]+\" [\w\s]+$/.test(query)) {
    var closingQuoteAt = query.indexOf('" ', 4);
    var collection = query.slice(4, closingQuoteAt);
    var filter = query.slice(closingQuoteAt);
    return [collection.trim(), filter.trim()];
  }

  if (/^in:\w+ [\w\s]+$/.test(query)) {
    var separatingSpaceAt = query.indexOf(" ", 3);
    var _collection = query.slice(3, separatingSpaceAt);
    var _filter = query.slice(separatingSpaceAt);
    return [_collection.trim(), _filter.trim()];
  }

  return [query.slice(3).trim()];
}

},{"../config":2,"./rows":23}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _row = require("./row");

var _row2 = _interopRequireDefault(_row);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CollectionRow = function (_Row) {
  _inherits(CollectionRow, _Row);

  function CollectionRow() {
    _classCallCheck(this, CollectionRow);

    return _possibleConstructorReturn(this, (CollectionRow.__proto__ || Object.getPrototypeOf(CollectionRow)).apply(this, arguments));
  }

  _createClass(CollectionRow, [{
    key: "onClick",
    value: function onClick() {
      this.category.results.props.openCollection(this.title);
    }
  }, {
    key: "renderDesc",
    value: function renderDesc() {
      return this.desc || "Links under \"" + this.title + "\" collection";
    }
  }]);

  return CollectionRow;
}(_row2.default);

exports.default = CollectionRow;

},{"./row":22}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rows = require("./rows");

var _rows2 = _interopRequireDefault(_rows);

var _collectionRow = require("./collection-row");

var _collectionRow2 = _interopRequireDefault(_collectionRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Collections = function (_Rows) {
  _inherits(Collections, _Rows);

  function Collections(results, sort) {
    _classCallCheck(this, Collections);

    var _this = _possibleConstructorReturn(this, (Collections.__proto__ || Object.getPrototypeOf(Collections)).call(this, results, sort));

    _this.name = "collections";
    _this.title = "Collections";
    return _this;
  }

  _createClass(Collections, [{
    key: "add",
    value: function add(rows) {
      var _this2 = this;

      this.results.addRows(this, rows.map(function (r) {
        return new _collectionRow2.default(_this2, r);
      }));
    }
  }, {
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return !query.trim().startsWith("tag:") && !/^in:.+/.test(query.trim());
    }
  }, {
    key: "fail",
    value: function fail(err) {
      console.error(err);
    }
  }, {
    key: "update",
    value: function update(query) {
      var _this3 = this;

      this.results.messages.send({ task: "get-collections", query: query }, function (resp) {
        if (resp.error) return _this3.fail(resp.error);

        if (query.length === 0 || query.trim() === "in:") {
          _this3.add(resp.content);
          return;
        }

        _this3.add(resp.content.filter(function (c) {
          return c.title.toLowerCase().includes(query.toLowerCase());
        }));
      });
    }
  }]);

  return Collections;
}(_rows2.default);

exports.default = Collections;

},{"./collection-row":9,"./rows":23}],11:[function(require,module,exports){
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

},{"preact":40}],12:[function(require,module,exports){
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

},{"preact":40}],13:[function(require,module,exports){
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

},{"./rows":23,"./url-image":33}],14:[function(require,module,exports){
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

},{"preact":40}],15:[function(require,module,exports){
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

},{"preact":40}],16:[function(require,module,exports){
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

},{"preact":40}],17:[function(require,module,exports){
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

},{"../lib/messaging":3}],18:[function(require,module,exports){
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

},{"./logo":15,"./menu":16,"./messaging":17,"./search":25,"./settings":26,"./wallpaper":34,"preact":40}],19:[function(require,module,exports){
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

},{"./rows":23,"title-from-url":50}],20:[function(require,module,exports){
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

},{"./rows":23}],21:[function(require,module,exports){
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

var _collections = require("./collections");

var _collections2 = _interopRequireDefault(_collections);

var _querySuggestions = require("./query-suggestions");

var _querySuggestions2 = _interopRequireDefault(_querySuggestions);

var _bookmarkSearch = require("./bookmark-search");

var _bookmarkSearch2 = _interopRequireDefault(_bookmarkSearch);

var _history = require("./history");

var _history2 = _interopRequireDefault(_history);

var _bookmarkTags = require("./bookmark-tags");

var _bookmarkTags2 = _interopRequireDefault(_bookmarkTags);

var _collectionList = require("./collection-list");

var _collectionList2 = _interopRequireDefault(_collectionList);

var _speedDial = require("./speed-dial");

var _speedDial2 = _interopRequireDefault(_speedDial);

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
    _this._select = (0, _debounceFn2.default)(_this.select.bind(_this), 100);

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
      var categories = [new _speedDial2.default(this, 0), new _querySuggestions2.default(this, 1), new _autocompleteTopSites2.default(this, 2), new _autocompleteBookmarks2.default(this, 3), new _topSites2.default(this, props.recentBookmarksFirst ? 5 : 4), new _recentBookmarks2.default(this, props.recentBookmarksFirst ? 4 : 5), new _collections2.default(this, 6), new _bookmarkTags2.default(this, 7),
      //new BookmarkSearch(this, 7),
      new _history2.default(this, 8), new _collectionList2.default(this, 9)];

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

      var content = this.trim(this.state.content.concat(rows.map(function (row, i) {
        return {
          row: row,
          index: _this2.state.content.length + i
        };
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
        if (a.row.category.sort < b.row.category.sort) return -1;
        if (a.row.category.sort > b.row.category.sort) return 1;

        if (a.index < b.index) return -1;
        if (a.index > b.index) return 1;

        return 0;
      });

      var dict = {};
      var uniques = content.filter(function (c) {
        if (dict[c.row.key()]) return false;
        dict[c.row.key()] = true;
        return true;
      });

      return content.map(function (c, index) {
        return {
          row: c.row,
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

      var selectedCategory = this.state.selected && content[this.state.selected] ? content[this.state.selected].row.category : content[0].row.category;
      var categories = [];
      var categoriesMap = {};

      var tabIndex = 2;
      var category = null;
      content.forEach(function (c, ind) {
        if (!category || category.name !== c.row.category.name) {
          category = c.row.category;
          categoriesMap[category.name] = {
            title: category.title,
            name: category.name,
            sort: category.sort,
            collapsed: content.length >= MAX_ITEMS && selectedCategory.name != category.name && !!category.title,
            rows: []
          };

          categories.push(categoriesMap[category.name]);

          c.tabIndex = ++tabIndex;
        }

        categoriesMap[category.name].rows.push(c);
      });

      return categories;
    }
  }, {
    key: "trim",
    value: function trim(content) {
      var categoryCounts = {};
      var pinnedCount = this.pinnedRowCount();

      content = content.filter(function (c) {
        if (!categoryCounts[c.row.category.name]) {
          categoryCounts[c.row.category.name] = 0;
        }

        categoryCounts[c.row.category.name]++;

        return c.row.category.pinned || MAX_ITEMS - pinnedCount >= categoryCounts[c.row.category.name];
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
        if (content[i].row.category.pinned) {
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
      var currentCategory = this.state.content[this.state.selected].row.category;

      var len = this.state.content.length;
      var i = this.state.selected;
      while (++i < len) {
        if (this.state.content[i].row.category.sort !== currentCategory.sort) {
          this.select(i);
          return;
        }
      }

      if (this.state.content[0].row.category.sort !== currentCategory.sort) {
        this.select(0);
      }
    }
  }, {
    key: "selectPreviousCategory",
    value: function selectPreviousCategory() {
      var currentCategory = this.state.content[this.state.selected].row.category;

      var len = this.state.content.length;
      var i = this.state.selected === 0 ? len - this.state.selected : this.state.selected;

      var nextCategorySort = undefined;
      var nextCategoryIndex = undefined;

      while (i--) {
        if (nextCategorySort !== undefined && nextCategorySort !== this.state.content[i].row.category.sort) {
          this.select(nextCategoryIndex);
          return;
        }

        if (this.state.content[i].row.category.sort !== currentCategory.sort) {
          nextCategoryIndex = i;
          nextCategorySort = this.state.content[i].row.category.sort;
          continue;
        }
      }

      if (this.state.content[0].row.category.sort !== currentCategory.sort) {
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
    key: "onKeyPress",
    value: function onKeyPress(e) {
      if (e.keyCode == 13) {
        // enter
        this.state.content[this.state.selected].row.onPressEnter();
      } else if (e.keyCode == 9 || e.keyCode === 40 && e.ctrlKey) {
        // tab key or ctrl+down
        this.selectNextCategory();
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode === 38 && e.ctrlKey) {
        // ctrl+up
        this.selectPreviousCategory();
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode == 40) {
        // down arrow
        this.selectNext();
      } else if (e.keyCode == 38) {
        // up arrow
        this.selectPrevious();
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
            selected: this.content()[this.state.selected] && this.content()[this.state.selected].row,
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

      var overflow = c.collapsed && this.state.content[this.state.selected].row.category.sort < c.sort && this.counter < MAX_ITEMS ? c.rows.slice(0, MAX_ITEMS - this.counter) : [];
      var collapsed = c.rows.slice(overflow.length, MAX_ITEMS);

      return (0, _preact.h)(
        "div",
        { className: "category " + (c.collapsed ? "collapsed" : "") },
        this.renderCategoryTitle(c),
        overflow.length > 0 ? (0, _preact.h)(
          "div",
          { className: "category-rows overflow" },
          overflow.map(function (c) {
            return _this4.renderRow(c.row, c.index);
          })
        ) : null,
        collapsed.length > 0 ? (0, _preact.h)(
          "div",
          { className: "category-rows" },
          collapsed.map(function (c) {
            return _this4.renderRow(c.row, c.index);
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
    value: function renderRow(row, index) {
      var _this6 = this;

      this.counter++;

      return (0, _preact.h)(_urlIcon2.default, {
        content: row,
        index: index,
        onSelect: function onSelect(index) {
          return _this6._select(index);
        },
        selected: this.state.selected == index
      });
    }
  }]);

  return Results;
}(_preact.Component);

exports.default = Results;

},{"./autocomplete-bookmarks":4,"./autocomplete-top-sites":5,"./bookmark-search":6,"./bookmark-tags":7,"./collection-list":8,"./collections":10,"./history":13,"./icon":14,"./messaging":17,"./query-suggestions":19,"./recent-bookmarks":20,"./sidebar":27,"./speed-dial":28,"./tagbar":29,"./top-sites":31,"./url-icon":32,"debounce-fn":36,"preact":40}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.findHostname = findHostname;

var _urls = require("urls");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Row = function () {
  function Row(category, _ref) {
    var title = _ref.title,
        desc = _ref.desc,
        tags = _ref.tags,
        url = _ref.url,
        isMoreButton = _ref.isMoreButton;

    _classCallCheck(this, Row);

    this.category = category;
    this.title = title;
    this.desc = desc;
    this.url = url;
    this.isMoreButton = isMoreButton;
    this.tags = tags;
  }

  _createClass(Row, [{
    key: "key",
    value: function key() {
      return this.url;
    }
  }, {
    key: "onClick",
    value: function onClick() {
      var url = this.url;

      if (!/^https?:\/\//.test(url)) {
        url = "http://" + url;
      }

      document.location.href = url;
    }
  }, {
    key: "onPressEnter",
    value: function onPressEnter() {
      this.onClick();
    }
  }, {
    key: "renderTitle",
    value: function renderTitle() {
      return this.title;
    }
  }, {
    key: "renderDesc",
    value: function renderDesc() {
      return this.desc || (0, _urls.clean)(this.url);
    }
  }, {
    key: "renderFirstLetter",
    value: function renderFirstLetter() {
      if (!this.url) {
        return this.title.slice(0, 1).toUpperCase();
      }

      return findHostname(this.url).slice(0, 1).toUpperCase();
    }
  }]);

  return Row;
}();

exports.default = Row;
function findHostname(url) {
  return url.replace(/^\w+:\/\//, "").split("/")[0].replace(/^www\./, "");
}

},{"urls":56}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _row = require("./row");

var _row2 = _interopRequireDefault(_row);

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
      var _this = this;

      this.results.addRows(this, rows.map(function (r) {
        return new _row2.default(_this, r);
      }));
    }
  }, {
    key: "addMoreButton",
    value: function addMoreButton(rows, _ref) {
      var _this2 = this;

      var title = _ref.title,
          url = _ref.url;

      var alreadyAddedCount = this.results.count(function (row) {
        return row.row.category.name === _this2.name && !row.row.isMoreButton;
      });
      var limit = MORE_RESULTS_THRESHOLD - alreadyAddedCount;

      if (rows.length > limit) {
        rows = rows.slice(0, limit);
      }

      this.results.removeRows(function (row) {
        return row.row.category.name !== _this2.name || !row.row.isMoreButton;
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

},{"../config":2,"./row":22}],24:[function(require,module,exports){
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

},{"./icon":14,"preact":40}],25:[function(require,module,exports){
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
      query: "",
      focused: false
    });

    _this._onQueryChange = (0, _debounceFn2.default)(_this.onQueryChange.bind(_this), 250);
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
          (0, _preact.h)(_searchInput2.default, {
            onPressEnter: function onPressEnter() {
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
          (0, _preact.h)(_results2.default, {
            recentBookmarksFirst: this.props.recentBookmarksFirst,
            nextWallpaper: this.props.nextWallpaper,
            prevWallpaper: this.props.prevWallpaper,
            openTag: function openTag(tag) {
              return _this2._onQueryChange("tag:" + tag);
            },
            openCollection: function openCollection(tag) {
              return _this2._onQueryChange("in:" + tag);
            },
            focused: this.state.focused,
            query: this.state.query
          }),
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

},{"./content":11,"./greeting":12,"./messaging":17,"./results":21,"./search-input":24,"debounce-fn":36,"preact":40}],26:[function(require,module,exports){
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

},{"../chrome/settings-sections":1,"./icon":14,"preact":40}],27:[function(require,module,exports){
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
            { className: "link", href: this.props.selected.url, tabindex: "-1" },
            (0, _preact.h)(_urlImage2.default, { content: this.props.selected }),
            (0, _preact.h)(
              "h1",
              null,
              this.props.selected.title
            ),
            (0, _preact.h)(
              "h2",
              null,
              this.props.selected.url ? (0, _urls.clean)(this.props.selected.url) : this.props.selected.desc
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

},{"./icon":14,"./top-sites":31,"./url-image":33,"preact":40,"relative-date":47,"urls":56}],28:[function(require,module,exports){
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

var ListSpeedDial = function (_Rows) {
  _inherits(ListSpeedDial, _Rows);

  function ListSpeedDial(results, sort) {
    _classCallCheck(this, ListSpeedDial);

    var _this = _possibleConstructorReturn(this, (ListSpeedDial.__proto__ || Object.getPrototypeOf(ListSpeedDial)).call(this, results, sort));

    _this.name = "speed-dial";
    _this.title = function (query) {
      return "Speed Dial";
    };
    return _this;
  }

  _createClass(ListSpeedDial, [{
    key: "shouldBeOpen",
    value: function shouldBeOpen(query) {
      return query.length > 0 && !query.startsWith("in:") && !query.startsWith("tag:");
    }
  }, {
    key: "update",
    value: async function update(query) {
      var speeddial = await this.getSpeedDialByKey(query);

      if (speeddial) {
        this.add([speeddial]);
      }
    }
  }, {
    key: "getSpeedDialByKey",
    value: async function getSpeedDialByKey(key) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.results.messages.send({
          task: "get-speed-dial",
          key: key
        }, function (resp) {
          if (resp.error) return reject(resp.error);
          resolve(resp.content.speeddial);
        });
      });
    }
  }, {
    key: "getLinkByUrl",
    value: async function getLinkByUrl(url) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.results.messages.send({ task: "get-like", url: url }, function (resp) {
          if (resp.error) return reject(resp.error);
          resolve(resp.content.like);
        });
      });
    }
  }]);

  return ListSpeedDial;
}(_rows2.default);

exports.default = ListSpeedDial;


function parseQuery(query) {
  if (/^in:\"[\w\s]+\"$/.test(query)) {
    return [query.slice(4, -1).trim()];
  }

  if (/^in:\"[\w\s]+\" [\w\s]+$/.test(query)) {
    var closingQuoteAt = query.indexOf('" ', 4);
    var collection = query.slice(4, closingQuoteAt);
    var filter = query.slice(closingQuoteAt);
    return [collection.trim(), filter.trim()];
  }

  if (/^in:\w+ [\w\s]+$/.test(query)) {
    var separatingSpaceAt = query.indexOf(" ", 3);
    var _collection = query.slice(3, separatingSpaceAt);
    var _filter = query.slice(separatingSpaceAt);
    return [_collection.trim(), _filter.trim()];
  }

  return [query.slice(3).trim()];
}

},{"../config":2,"./rows":23}],29:[function(require,module,exports){
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

},{"./icon":14,"preact":40}],30:[function(require,module,exports){
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

},{"title-from-url":50}],31:[function(require,module,exports){
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

},{"./rows":23}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require("preact");

var _img = require("img");

var _img2 = _interopRequireDefault(_img);

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
      this.props.onSelect(this.props.index);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      /*const linkTitle = this.props.content.url
        ? `${this.title()} - ${cleanURL(this.props.content.url)}`
        : this.title()*/

      return (0, _preact.h)(
        "div",
        {
          id: this.props.content.id,
          className: "urlicon " + (this.props.selected ? "selected" : ""),
          onClick: function onClick() {
            return _this2.props.content.onClick();
          },
          title: this.props.content.renderTitle(),
          onMouseMove: function onMouseMove() {
            return _this2.select();
          }
        },
        (0, _preact.h)(_urlImage2.default, { content: this.props.content, "icon-only": true }),
        (0, _preact.h)(
          "div",
          { className: "title" },
          this.props.content.renderTitle()
        ),
        (0, _preact.h)(
          "div",
          { className: "url" },
          this.props.content.renderDesc()
        ),
        (0, _preact.h)("div", { className: "clear" })
      );
    }

    /*title() {
      if (this.props.content.type === "search-query") {
        return this.props.content.title
      }
       if (this.props.content.type === "url-query") {
        return `Open ${cleanURL(this.props.content.url)}`
      }
       if (this.props.content.type === "collections") {
        return this.props.content.title
      }
       if (this.props.content.title && titles.isValid(this.props.content.title)) {
        return titles.normalize(this.props.content.title)
      }
       return titles.generateFromURL(this.props.content.url)
    }*/

  }]);

  return URLIcon;
}(_preact.Component);

exports.default = URLIcon;

},{"./titles":30,"./url-image":33,"img":38,"preact":40}],33:[function(require,module,exports){
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
  "facebook.com": "https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/N4H_50KFp8i.png",
  "twitter.com": "https://ma-0.twimg.com/twitter-assets/responsive-web/web/ltr/icon-ios.a9cd885bccbcaf2f.png",
  "youtube.com": "https://www.youtube.com/yts/img/favicon_96-vflW9Ec0w.png",
  "amazon.com": "https://images-na.ssl-images-amazon.com/images/G/01/anywhere/a_smile_120x120._CB368246573_.png",
  "google.com": "https://www.google.com/images/branding/product_ios/2x/gsa_ios_60dp.png",
  "yahoo.com": "https://www.yahoo.com/apple-touch-icon-precomposed.png",
  "reddit.com": "https://www.redditstatic.com/mweb2x/favicon/120x120.png",
  "instagram.com": "https://www.instagram.com/static/images/ico/apple-touch-icon-120x120-precomposed.png/004705c9353f.png",
  "getkozmos.com": "https://getkozmos.com/public/logos/kozmos-heart-logo-100px.png",
  "github.com": "https://github.githubassets.com/pinned-octocat.svg",
  "gist.github.com": "https://github.githubassets.com/pinned-octocat.svg",
  "mail.google.com": "https://www.google.com/images/icons/product/googlemail-128.png",
  "gmail.com": "https://www.google.com/images/icons/product/googlemail-128.png",
  "paypal.com": "https://www.paypalobjects.com/webstatic/icon/pp144.png",
  "slack.com": "https://assets.brandfolder.com/pl546j-7le8zk-6gwiyo/view@2x.png",
  "imdb.com": "http://ia.media-imdb.com/images/G/01/imdb/images/desktop-favicon-2165806970._CB522736561_.ico",
  "en.wikipedia.org": "https://en.wikipedia.org/static/favicon/wikipedia.ico",
  "wikipedia.org": "https://en.wikipedia.org/static/favicon/wikipedia.ico",
  "espn.com": "http://a.espncdn.com/favicon.ico",
  "twitch.tv": "https://static.twitchcdn.net/assets/favicon-75270f9df2b07174c23ce844a03d84af.ico",
  "cnn.com": "http://cdn.cnn.com/cnn/.e/img/3.0/global/misc/apple-touch-icon.png",
  "office.com": "https://seaofficehome.msocdn.com/s/7047452e/Images/favicon_metro.ico",
  "bankofamerica.com": "https://www1.bac-assets.com/homepage/spa-assets/images/assets-images-global-favicon-favicon-CSX386b332d.ico",
  "chase.com": "https://www.chase.com/etc/designs/chase-ux/favicon-152.png",
  "nytimes.com": "https://static01.nyt.com/images/icons/ios-ipad-144x144.png",
  "apple.com": "https://www.apple.com/favicon.ico",
  "wellsfargo.com": "https://www.wellsfargo.com/assets/images/icons/apple-touch-icon-120x120.png",
  "yelp.com": "https://s3-media2.fl.yelpcdn.com/assets/srv0/yelp_styleguide/118ff475a341/assets/img/logos/favicon.ico",
  "wordpress.com": "http://s0.wp.com/i/webclip.png",
  "dropbox.com": "https://cfl.dropboxstatic.com/static/images/favicon-vflUeLeeY.ico",
  "mail.superhuman.com": "https://superhuman.com/build/71222bdc169e5906c28247ed5b7cf0ed.share-icon.png",
  "aws.amazon.com": "https://a0.awsstatic.com/libra-css/images/site/touch-icon-iphone-114-smile.png",
  "console.aws.amazon.com": "https://a0.awsstatic.com/libra-css/images/site/touch-icon-iphone-114-smile.png",
  "us-west-2.console.aws.amazon.com": "https://a0.awsstatic.com/libra-css/images/site/touch-icon-iphone-114-smile.png",
  "stackoverflow.com": "https://cdn.sstatic.net/Sites/stackoverflow/img/apple-touch-icon.png"
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

      if (!content.url) {
        return;
      }

      if (!this.props["icon-only"] && content.images && content.images.length > 0 && content.images[0]) {
        return this.setState({
          type: "image",
          src: content.images[0]
        });
      }

      if (content.icon) {
        return this.setState({
          type: "icon",
          src: absoluteIconURL(content)
        });
      }

      var hostname = findHostname(content.url);
      if (popularIcons[hostname]) {
        return this.setState({
          type: "popular-icon",
          src: popularIcons[hostname]
        });
      }

      if (/\.slack\.com$/.test(hostname)) {
        return this.setState({
          type: "popular-icon",
          src: popularIcons["slack.com"]
        });
      }

      this.setState({
        type: "favicon",
        src: "http://" + hostname + "/favicon.ico"
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

      return (0, _preact.h)("div", {
        tabindex: "-1",
        className: "url-image " + this.state.type,
        style: style
      });
    }
  }, {
    key: "renderLoading",
    value: function renderLoading() {
      var style = {
        backgroundColor: this.state.color
      };

      return (0, _preact.h)(
        "div",
        {
          "data-error": this.state.error,
          "data-type": this.state.type,
          "data-src": this.state.src,
          className: "url-image generated-image center",
          style: style
        },
        (0, _preact.h)(
          "span",
          null,
          this.props.content.renderFirstLetter()
        )
      );
    }
  }, {
    key: "cachedIconURL",
    value: function cachedIconURL() {
      if (!this.props.content.url) return;

      return "chrome://favicon/size/72/" + findProtocol(this.props.content.url) + "://" + findHostname(this.props.content.url);
    }
  }]);

  return URLImage;
}(_preact.Component);

exports.default = URLImage;


function absoluteIconURL(like) {
  if (/^https?:\/\//.test(like.icon)) return like.icon;
  return "http://" + (0, _path.join)(findHostname(like.url), like.icon);
}

function findHostname(url) {
  return url.replace(/^\w+:\/\//, "").split("/")[0].replace(/^www\./, "");
}

function findProtocol(url) {
  if (!/^https?:\/\//.test(url)) return "http";
  return url.split("://")[0];
}

},{"debounce-fn":36,"img":38,"path":39,"preact":40,"random-color":46}],34:[function(require,module,exports){
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

},{"./wallpapers":35,"preact":40}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
module.exports = debounce

function debounce(fn, wait) {
  var timer
  var args

  if (arguments.length == 1) {
    wait = 250
  }

  return function() {
    if (timer != undefined) {
      clearTimeout(timer)
      timer = undefined
    } else {
      timer = setTimeout(noop)
      fn.apply(undefined, arguments)
      return
    }

    args = arguments

    timer = setTimeout(function() {
      timer = undefined
      fn.apply(undefined, args)
    }, wait)
  }
}

function noop() {}

},{}],37:[function(require,module,exports){

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
},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

},{"_process":41}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":43,"./encode":44}],46:[function(require,module,exports){
var random = require("rnd");

module.exports = color;

function color (max, min) {
  max || (max = 255);
  return 'rgb(' + random(max, min) + ', ' + random(max, min) + ', ' + random(max, min) + ')';
}

},{"rnd":48}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
module.exports = random;

function random (max, min) {
  max || (max = 999999999999);
  min || (min = 0);

  return min + Math.floor(Math.random() * (max - min));
}

},{}],49:[function(require,module,exports){

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
},{}],50:[function(require,module,exports){
var toTitle = require("to-title")

module.exports = urlToTitle

function urlToTitle(url) {
  url = unescape(url).replace(/_/g, " ")
  url = url.replace(/^\w+:\/\//, "")
  url = url.replace(/^www\./, "")
  url = url.replace(/(\/|\?)$/, "")

  var parts = url.split("?")
  url = parts[0]
  url = url.replace(/\.\w+$/, "")

  parts = url.split("/")

  var name = parts[0]
  name = name.replace(/\.\w+(\/|$)/, "").replace(/\.(com?|net|org|fr)$/, "")

  if (parts.length == 1) {
    return title(name)
  }

  return (
    toTitle(
      parts
        .slice(1)
        .reverse()
        .filter(isValidPart)
        .map(toTitle)
        .join(" - ")
    ) +
    " on " +
    title(name)
  )
}

function isValidPart(part) {
  return part.length > 2 && !/^[0-9]+$/.test(part)
}

function title(host) {
  if (/^[\w\.\-]+:\d+/.test(host)) {
    return host
  }

  return toTitle(
    host
      .split(".")
      .filter(isValidPart)
      .join(", ")
  )
}

},{"to-title":53}],51:[function(require,module,exports){

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
},{"to-no-case":52}],52:[function(require,module,exports){

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
},{}],53:[function(require,module,exports){
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

},{"escape-regexp-component":37,"title-case-minors":49,"to-capital-case":51}],54:[function(require,module,exports){
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

},{"./util":55,"punycode":42,"querystring":45}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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

},{"url":54}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaHJvbWUvc2V0dGluZ3Mtc2VjdGlvbnMuanNvbiIsImNvbmZpZy5qc29uIiwibGliL21lc3NhZ2luZy5qcyIsIm5ld3RhYi9hdXRvY29tcGxldGUtYm9va21hcmtzLmpzIiwibmV3dGFiL2F1dG9jb21wbGV0ZS10b3Atc2l0ZXMuanMiLCJuZXd0YWIvYm9va21hcmstc2VhcmNoLmpzIiwibmV3dGFiL2Jvb2ttYXJrLXRhZ3MuanMiLCJuZXd0YWIvY29sbGVjdGlvbi1saXN0LmpzIiwibmV3dGFiL2NvbGxlY3Rpb24tcm93LmpzIiwibmV3dGFiL2NvbGxlY3Rpb25zLmpzIiwibmV3dGFiL2NvbnRlbnQuanMiLCJuZXd0YWIvZ3JlZXRpbmcuanMiLCJuZXd0YWIvaGlzdG9yeS5qcyIsIm5ld3RhYi9pY29uLmpzIiwibmV3dGFiL2xvZ28uanMiLCJuZXd0YWIvbWVudS5qcyIsIm5ld3RhYi9tZXNzYWdpbmcuanMiLCJuZXd0YWIvbmV3dGFiLmpzIiwibmV3dGFiL3F1ZXJ5LXN1Z2dlc3Rpb25zLmpzIiwibmV3dGFiL3JlY2VudC1ib29rbWFya3MuanMiLCJuZXd0YWIvcmVzdWx0cy5qcyIsIm5ld3RhYi9yb3cuanMiLCJuZXd0YWIvcm93cy5qcyIsIm5ld3RhYi9zZWFyY2gtaW5wdXQuanMiLCJuZXd0YWIvc2VhcmNoLmpzIiwibmV3dGFiL3NldHRpbmdzLmpzIiwibmV3dGFiL3NpZGViYXIuanMiLCJuZXd0YWIvc3BlZWQtZGlhbC5qcyIsIm5ld3RhYi90YWdiYXIuanMiLCJuZXd0YWIvdGl0bGVzLmpzIiwibmV3dGFiL3RvcC1zaXRlcy5qcyIsIm5ld3RhYi91cmwtaWNvbi5qcyIsIm5ld3RhYi91cmwtaW1hZ2UuanMiLCJuZXd0YWIvd2FsbHBhcGVyLmpzIiwibmV3dGFiL3dhbGxwYXBlcnMuanNvbiIsIm5vZGVfbW9kdWxlcy9kZWJvdW5jZS1mbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lc2NhcGUtcmVnZXhwLWNvbXBvbmVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbWcvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3ByZWFjdC9kaXN0L3ByZWFjdC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHVueWNvZGUvcHVueWNvZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yYW5kb20tY29sb3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVsYXRpdmUtZGF0ZS9saWIvcmVsYXRpdmUtZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9ybmQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGl0bGUtY2FzZS1taW5vcnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGl0bGUtZnJvbS11cmwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdG8tY2FwaXRhbC1jYXNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RvLW5vLWNhc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdG8tdGl0bGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdXJsL3VybC5qcyIsIm5vZGVfbW9kdWxlcy91cmwvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy91cmxzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1dEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHM9W1xuICB7XG4gICAga2V5OiBcIm9uZUNsaWNrTGlrZVwiLFxuICAgIHRpdGxlOiBcIk9uZS1jbGljayBib29rbWFya2luZ1wiLFxuICAgIGRlc2M6IFwiSGVhcnQgYnV0dG9uIHdpbGwgaW1tZWRpYXRlbHkgYm9va21hcmsgd2hlbiBjbGlja2VkLlwiLFxuICAgIGRlZmF1bHRWYWx1ZTogdHJ1ZSxcbiAgICBwb3B1cDogdHJ1ZVxuICB9LFxuICB7XG4gICAga2V5OiBcInJlY2VudEJvb2ttYXJrc0ZpcnN0XCIsXG4gICAgdGl0bGU6IFwiUmVjZW50IEJvb2ttYXJrcyBGaXJzdFwiLFxuICAgIGRlc2M6IFwiTW92ZSBSZWNlbnQgQm9va21hcmtzIE92ZXIgRnJlcXVlbnRseSBWaXNpdGVkXCIsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBuZXd0YWI6IHRydWVcbiAgfSxcbiAge1xuICAgIGtleTogXCJtaW5pbWFsTW9kZVwiLFxuICAgIHRpdGxlOiBcIkVuYWJsZSBNaW5pbWFsIE1vZGVcIixcbiAgICBkZXNjOiBcIkhpZGUgbWFqb3JpdHkgb2YgdGhlIGludGVyZmFjZSB1bnRpbCB1c2VyIGZvY3VzZXMuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9LFxuICB7XG4gICAga2V5OiBcInNob3dXYWxscGFwZXJcIixcbiAgICB0aXRsZTogXCJTaG93IFdhbGxwYXBlclwiLFxuICAgIGRlc2M6IFwiR2V0IGEgbmV3IGJlYXV0aWZ1bCBwaG90byBpbiB5b3VyIG5ldyB0YWIgZXZlcnkgZGF5LlwiLFxuICAgIGRlZmF1bHRWYWx1ZTogdHJ1ZSxcbiAgICBuZXd0YWI6IHRydWVcbiAgfSxcbiAge1xuICAgIGtleTogXCJlbmFibGVHcmVldGluZ1wiLFxuICAgIHRpdGxlOiBcIlNob3cgZ3JlZXRpbmcgJiB0aW1lXCIsXG4gICAgZGVzYzogXCJTZWUgeW91ciBuYW1lLCBhbmQgYSBuaWNlIGNsb2NrLlwiLFxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgbmV3dGFiOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwiZW5hYmxlTmV3VGFiXCIsXG4gICAgdGl0bGU6IFwiRW5hYmxlIE5ldyBUYWIgSW50ZXJmYWNlXCIsXG4gICAgZGVzYzogXCJGYXN0ZXIgYW5kIGVhc2llciBzZWFyY2ggaW50ZXJmYWNlLlwiLFxuICAgIGRlZmF1bHRWYWx1ZTogdHJ1ZSxcbiAgICBwb3B1cDogdHJ1ZSxcbiAgICBuZXd0YWI6IHRydWVcbiAgfVxuXVxuIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcImhvc3RcIjogXCJodHRwczovL2dldGtvem1vcy5jb21cIlxufVxuIiwibGV0IG1lc3NhZ2VDb3VudGVyID0gMFxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9USU1FT1VUX1NFQ1MgPSA1XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2luZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubGlzdGVuRm9yTWVzc2FnZXMoKVxuICAgIHRoaXMud2FpdGluZyA9IHt9XG4gIH1cblxuICBkcmFmdCh7IGlkLCBjb250ZW50LCBlcnJvciwgdG8sIHJlcGx5IH0pIHtcbiAgICBpZCA9IHRoaXMuZ2VuZXJhdGVJZCgpXG5cbiAgICByZXR1cm4ge1xuICAgICAgZnJvbTogdGhpcy5uYW1lLFxuICAgICAgdG86IHRvIHx8IHRoaXMudGFyZ2V0LFxuICAgICAgZXJyb3I6IGNvbnRlbnQuZXJyb3IgfHwgZXJyb3IsXG4gICAgICBpZCwgY29udGVudCwgcmVwbHlcbiAgICB9XG4gIH1cblxuICBnZW5lcmF0ZUlkKCkge1xuICAgIHJldHVybiAoRGF0ZS5ub3coKSAqIDEwMDApICsgKCsrbWVzc2FnZUNvdW50ZXIpXG4gIH1cblxuICBvblJlY2VpdmUobXNnKSB7XG4gICAgaWYgKG1zZy50byAhPT0gdGhpcy5uYW1lKSByZXR1cm4gdHJ1ZVxuXG4gICAgaWYgKG1zZy5yZXBseSAmJiB0aGlzLndhaXRpbmdbbXNnLnJlcGx5XSkge1xuICAgICAgdGhpcy53YWl0aW5nW21zZy5yZXBseV0obXNnKVxuICAgIH1cblxuICAgIGlmIChtc2cucmVwbHkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG1zZy5jb250ZW50ICYmIG1zZy5jb250ZW50LnBpbmcpIHtcbiAgICAgIHRoaXMucmVwbHkobXNnLCB7IHBvbmc6IHRydWUgfSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgcGluZyhjYWxsYmFjaykge1xuICAgIHRoaXMuc2VuZCh7IHBpbmc6IHRydWUgfSwgY2FsbGJhY2spXG4gIH1cblxuICByZXBseShtc2csIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMuY29udGVudCkge1xuICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgY29udGVudDogb3B0aW9uc1xuICAgICAgfVxuICAgIH1cblxuICAgIG9wdGlvbnMucmVwbHkgPSBtc2cuaWRcbiAgICBvcHRpb25zLnRvID0gbXNnLmZyb21cblxuICAgIHRoaXMuc2VuZChvcHRpb25zKVxuICB9XG5cbiAgc2VuZChvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG1zZyA9IHRoaXMuZHJhZnQob3B0aW9ucy5jb250ZW50ID8gb3B0aW9ucyA6IHsgY29udGVudDogb3B0aW9ucyB9KVxuXG4gICAgdGhpcy5zZW5kTWVzc2FnZShtc2cpXG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMud2FpdFJlcGx5Rm9yKG1zZy5pZCwgREVGQVVMVF9USU1FT1VUX1NFQ1MsIGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIHdhaXRSZXBseUZvcihtc2dJZCwgdGltZW91dFNlY3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXNcbiAgICBsZXQgdGltZW91dCA9IHVuZGVmaW5lZFxuXG4gICAgaWYgKHRpbWVvdXRTZWNzID4gMCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQob25UaW1lb3V0LCB0aW1lb3V0U2VjcyAqIDEwMDApXG4gICAgfVxuXG4gICAgdGhpcy53YWl0aW5nW21zZ0lkXSA9IG1zZyA9PiB7XG4gICAgICBkb25lKClcbiAgICAgIGNhbGxiYWNrKG1zZylcbiAgICB9XG5cbiAgICByZXR1cm4gZG9uZVxuXG4gICAgZnVuY3Rpb24gZG9uZSAoKSB7XG4gICAgICBpZiAodGltZW91dCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgICB9XG5cbiAgICAgIHRpbWVvdXQgPSB1bmRlZmluZWRcbiAgICAgIGRlbGV0ZSBzZWxmLndhaXRpbmdbbXNnSWRdXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25UaW1lb3V0ICgpIHtcbiAgICAgIGRvbmUoKVxuICAgICAgY2FsbGJhY2soeyBlcnJvcjogbmV3IEVycm9yKCdNZXNzYWdlIHJlc3BvbnNlIHRpbWVvdXQgKCcgKyB0aW1lb3V0U2VjcyArJylzLicpIH0pXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCJcblxuY29uc3QgT0ZGTElORV9SRVNVTFRTX1RIUkVTSE9MRCA9IDRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b2NvbXBsZXRlIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMubmFtZSA9IFwiYXV0b2NvbXBsZXRlLWJvb2ttYXJrc1wiXG4gICAgdGhpcy50aXRsZSA9IFwiQm9va21hcmtzXCJcbiAgICB0aGlzLnNob3dNb3JlQnV0dG9uID0gdHJ1ZVxuICAgIHRoaXMudXBkYXRlID0gZGVib3VuY2UodGhpcy5mZXRjaC5iaW5kKHRoaXMpLCAxNTApXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgcXVlcnkubGVuZ3RoID4gMCAmJlxuICAgICAgcXVlcnkuaW5kZXhPZihcInRhZzpcIikgPT09IC0xICYmXG4gICAgICBxdWVyeS5pbmRleE9mKFwiaW46XCIpID09PSAtMVxuICAgIClcbiAgfVxuXG4gIGZldGNoKHF1ZXJ5KSB7XG4gICAgY29uc3Qgb3F1ZXJ5ID0gcXVlcnkgfHwgdGhpcy5yZXN1bHRzLnByb3BzLnF1ZXJ5XG4gICAgY29uc3QgYWRkZWRBbHJlYWR5ID0ge31cblxuICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogXCJhdXRvY29tcGxldGVcIiwgcXVlcnkgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAob3F1ZXJ5ICE9PSB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnkudHJpbSgpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMuZmFpbChyZXNwLmVycm9yKVxuXG4gICAgICByZXNwLmNvbnRlbnQuZm9yRWFjaChyb3cgPT4gKGFkZGVkQWxyZWFkeVtyb3cudXJsXSA9IHRydWUpKVxuXG4gICAgICB0aGlzLmFkZChcbiAgICAgICAgdGhpcy5hZGRNb3JlQnV0dG9uKHJlc3AuY29udGVudCwge1xuICAgICAgICAgIHRpdGxlOiBgTW9yZSByZXN1bHRzIGZvciBcIiR7b3F1ZXJ5fVwiYCxcbiAgICAgICAgICB1cmw6IGAke2NvbmZpZy5ob3N0fS9zZWFyY2g/cT0ke29xdWVyeX1gXG4gICAgICAgIH0pXG4gICAgICApXG5cbiAgICAgIGlmIChyZXNwLmNvbnRlbnQubGVuZ3RoID49IE9GRkxJTkVfUkVTVUxUU19USFJFU0hPTEQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogXCJzZWFyY2gtYm9va21hcmtzXCIsIHF1ZXJ5IH0sIHJlc3AgPT4ge1xuICAgICAgICBpZiAob3F1ZXJ5ICE9PSB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnkudHJpbSgpKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMuZmFpbChyZXNwLmVycm9yKVxuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSByZXNwLmNvbnRlbnQuZmlsdGVyKHJvdyA9PiAhYWRkZWRBbHJlYWR5W3Jvdy51cmxdKVxuXG4gICAgICAgIHRoaXMuYWRkKFxuICAgICAgICAgIHRoaXMuYWRkTW9yZUJ1dHRvbihjb250ZW50LCB7XG4gICAgICAgICAgICB0aXRsZTogYE1vcmUgcmVzdWx0cyBmb3IgXCIke29xdWVyeX1cImAsXG4gICAgICAgICAgICB1cmw6IGAke2NvbmZpZy5ob3N0fS9zZWFyY2g/cT0ke29xdWVyeX1gXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgUm93IGZyb20gXCIuL3Jvd1wiXG5pbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuaW1wb3J0IHsgY2xlYW4gfSBmcm9tIFwidXJsc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9jb21wbGV0ZVRvcFNpdGVzIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMubmFtZSA9IFwiYXV0b2NvbXBsZXRlLXRvcC1zaXRlc1wiXG4gICAgdGhpcy50aXRsZSA9IFwiRnJlcXVlbnRseSBWaXNpdGVkXCJcbiAgICB0aGlzLnVwZGF0ZSA9IGRlYm91bmNlKHRoaXMuZmV0Y2guYmluZCh0aGlzKSwgMTUwKVxuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5Lmxlbmd0aCA+IDBcbiAgfVxuXG4gIGZldGNoKHF1ZXJ5KSB7XG4gICAgY29uc3QgcmVzdWx0ID0gW11cblxuICAgIGNocm9tZS50b3BTaXRlcy5nZXQodG9wU2l0ZXMgPT4ge1xuICAgICAgbGV0IGkgPSAtMVxuICAgICAgY29uc3QgbGVuID0gdG9wU2l0ZXMubGVuZ3RoXG4gICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjbGVhbih0b3BTaXRlc1tpXS51cmwpLmluZGV4T2YocXVlcnkpID09PSAwIHx8XG4gICAgICAgICAgdG9wU2l0ZXNbaV0udGl0bGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5KSA+IC0xXG4gICAgICAgICkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBSb3codGhpcywgdG9wU2l0ZXNbaV0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWRkKHJlc3VsdClcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb29rbWFya1NlYXJjaCBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSBcImJvb2ttYXJrLXNlYXJjaFwiXG4gICAgdGhpcy50aXRsZSA9IFwiTGlrZWQgaW4gS296bW9zXCJcblxuICAgIHRoaXMudXBkYXRlID0gZGVib3VuY2UodGhpcy5fdXBkYXRlLmJpbmQodGhpcyksIDI1MClcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiAoXG4gICAgICBxdWVyeSAmJlxuICAgICAgcXVlcnkubGVuZ3RoID4gMSAmJlxuICAgICAgKHF1ZXJ5LmluZGV4T2YoXCJ0YWc6XCIpICE9PSAwIHx8IHF1ZXJ5Lmxlbmd0aCA8IDUpICYmXG4gICAgICBxdWVyeS5pbmRleE9mKFwiaW46XCIpICE9PSAwXG4gICAgKVxuICB9XG5cbiAgX3VwZGF0ZShxdWVyeSkge1xuICAgIGNvbnN0IG9xdWVyeSA9IHF1ZXJ5IHx8IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeVxuXG4gICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiBcInNlYXJjaC1ib29rbWFya3NcIiwgcXVlcnkgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAob3F1ZXJ5ICE9PSB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnkudHJpbSgpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMuZmFpbChyZXNwLmVycm9yKVxuXG4gICAgICB0aGlzLmFkZChyZXNwLmNvbnRlbnQpXG4gICAgfSlcbiAgfVxufVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5pbXBvcnQgY29uZmlnIGZyb20gXCIuLi9jb25maWdcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXN0Qm9va21hcmtzQnlUYWcgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJib29rbWFya3MtYnktdGFnXCJcbiAgICB0aGlzLnRpdGxlID0gcXVlcnkgPT4gYEJvb2ttYXJrcyBUYWdnZWQgV2l0aCBcIiR7cXVlcnkuc2xpY2UoNCl9XCJgXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkgJiYgcXVlcnkuaW5kZXhPZihcInRhZzpcIikgPT09IDAgJiYgcXVlcnkubGVuZ3RoID4gNFxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgY29uc3Qgb3F1ZXJ5ID0gcXVlcnkgfHwgdGhpcy5yZXN1bHRzLnByb3BzLnF1ZXJ5XG4gICAgY29uc3QgdGFnID0gb3F1ZXJ5LnNsaWNlKDQpXG5cbiAgICB0aGlzLnJlc3VsdHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6IFwiZ2V0LWJvb2ttYXJrcy1ieS10YWdcIiwgdGFnIH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKG9xdWVyeSAhPT0gdGhpcy5yZXN1bHRzLnByb3BzLnF1ZXJ5LnRyaW0oKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLmZhaWwocmVzcC5lcnJvcilcblxuICAgICAgY29uc3QgY29udGVudCA9XG4gICAgICAgIHJlc3AuY29udGVudC5sZW5ndGggPiA0XG4gICAgICAgICAgPyB0aGlzLmFkZE1vcmVCdXR0b24ocmVzcC5jb250ZW50LCB7XG4gICAgICAgICAgICAgIHRpdGxlOiBgTW9yZSB0YWdnZWQgd2l0aCBcIiR7dGFnfVwiYCxcbiAgICAgICAgICAgICAgdXJsOiBgJHtjb25maWcuaG9zdH0vdGFnLyR7dGFnfWBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgOiByZXNwLmNvbnRlbnRcblxuICAgICAgdGhpcy5hZGQoY29udGVudClcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpc3RCb29rbWFya3NCeUNvbGxlY3Rpb24gZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJib29rbWFya3MtYnktY29sbGVjdGlvblwiXG4gICAgdGhpcy50aXRsZSA9IHF1ZXJ5ID0+IGBCb29rbWFya3MgaW4gXCIke3F1ZXJ5LnNsaWNlKDMpfSBDb2xsZWN0aW9uXCJgXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkgJiYgcXVlcnkuaW5kZXhPZihcImluOlwiKSA9PT0gMCAmJiBxdWVyeS5sZW5ndGggPiAzXG4gIH1cblxuICBhc3luYyB1cGRhdGUocXVlcnkpIHtcbiAgICBjb25zdCBbY29sbGVjdGlvbiwgZmlsdGVyXSA9IHBhcnNlUXVlcnkocXVlcnkgfHwgdGhpcy5yZXN1bHRzLnByb3BzLnF1ZXJ5KVxuICAgIGxldCByZXN1bHRzXG5cbiAgICB0cnkge1xuICAgICAgcmVzdWx0cyA9IGF3YWl0IHRoaXMuZ2V0Qm9va21hcmtzQnlDb2xsZWN0aW9uKGNvbGxlY3Rpb24sIGZpbHRlcilcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZmFpbChlcnIpXG4gICAgfVxuXG4gICAgdGhpcy5hZGQocmVzdWx0cylcbiAgfVxuXG4gIGFzeW5jIGdldEJvb2ttYXJrc0J5Q29sbGVjdGlvbihjb2xsZWN0aW9uLCBmaWx0ZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoXG4gICAgICAgIHtcbiAgICAgICAgICB0YXNrOiBcImdldC1ib29rbWFya3MtYnktY29sbGVjdGlvblwiLFxuICAgICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgICAgb2Zmc2V0OiAwLFxuICAgICAgICAgIGxpbWl0OiA1LFxuICAgICAgICAgIGZpbHRlclxuICAgICAgICB9LFxuICAgICAgICByZXNwID0+IHtcbiAgICAgICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHJlamVjdChyZXNwLmVycm9yKVxuICAgICAgICAgIHJlc29sdmUocmVzcC5jb250ZW50KVxuICAgICAgICB9XG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGdldExpbmtCeVVybCh1cmwpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiBcImdldC1saWtlXCIsIHVybCB9LCByZXNwID0+IHtcbiAgICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiByZWplY3QocmVzcC5lcnJvcilcbiAgICAgICAgcmVzb2x2ZShyZXNwLmNvbnRlbnQubGlrZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVF1ZXJ5KHF1ZXJ5KSB7XG4gIGlmICgvXmluOlxcXCJbXFx3XFxzXStcXFwiJC8udGVzdChxdWVyeSkpIHtcbiAgICByZXR1cm4gW3F1ZXJ5LnNsaWNlKDQsIC0xKS50cmltKCldXG4gIH1cblxuICBpZiAoL15pbjpcXFwiW1xcd1xcc10rXFxcIiBbXFx3XFxzXSskLy50ZXN0KHF1ZXJ5KSkge1xuICAgIGNvbnN0IGNsb3NpbmdRdW90ZUF0ID0gcXVlcnkuaW5kZXhPZignXCIgJywgNClcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gcXVlcnkuc2xpY2UoNCwgY2xvc2luZ1F1b3RlQXQpXG4gICAgY29uc3QgZmlsdGVyID0gcXVlcnkuc2xpY2UoY2xvc2luZ1F1b3RlQXQpXG4gICAgcmV0dXJuIFtjb2xsZWN0aW9uLnRyaW0oKSwgZmlsdGVyLnRyaW0oKV1cbiAgfVxuXG4gIGlmICgvXmluOlxcdysgW1xcd1xcc10rJC8udGVzdChxdWVyeSkpIHtcbiAgICBjb25zdCBzZXBhcmF0aW5nU3BhY2VBdCA9IHF1ZXJ5LmluZGV4T2YoXCIgXCIsIDMpXG4gICAgY29uc3QgY29sbGVjdGlvbiA9IHF1ZXJ5LnNsaWNlKDMsIHNlcGFyYXRpbmdTcGFjZUF0KVxuICAgIGNvbnN0IGZpbHRlciA9IHF1ZXJ5LnNsaWNlKHNlcGFyYXRpbmdTcGFjZUF0KVxuICAgIHJldHVybiBbY29sbGVjdGlvbi50cmltKCksIGZpbHRlci50cmltKCldXG4gIH1cblxuICByZXR1cm4gW3F1ZXJ5LnNsaWNlKDMpLnRyaW0oKV1cbn1cbiIsImltcG9ydCBSb3cgZnJvbSBcIi4vcm93XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sbGVjdGlvblJvdyBleHRlbmRzIFJvdyB7XG4gIG9uQ2xpY2soKSB7XG4gICAgdGhpcy5jYXRlZ29yeS5yZXN1bHRzLnByb3BzLm9wZW5Db2xsZWN0aW9uKHRoaXMudGl0bGUpXG4gIH1cblxuICByZW5kZXJEZXNjKCkge1xuICAgIHJldHVybiB0aGlzLmRlc2MgfHwgYExpbmtzIHVuZGVyIFwiJHt0aGlzLnRpdGxlfVwiIGNvbGxlY3Rpb25gXG4gIH1cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IENvbGxlY3Rpb25Sb3cgZnJvbSBcIi4vY29sbGVjdGlvbi1yb3dcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xsZWN0aW9ucyBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSBcImNvbGxlY3Rpb25zXCJcbiAgICB0aGlzLnRpdGxlID0gXCJDb2xsZWN0aW9uc1wiXG4gIH1cblxuICBhZGQocm93cykge1xuICAgIHRoaXMucmVzdWx0cy5hZGRSb3dzKHRoaXMsIHJvd3MubWFwKHIgPT4gbmV3IENvbGxlY3Rpb25Sb3codGhpcywgcikpKVxuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuICFxdWVyeS50cmltKCkuc3RhcnRzV2l0aChcInRhZzpcIikgJiYgIS9eaW46LisvLnRlc3QocXVlcnkudHJpbSgpKVxuICB9XG5cbiAgZmFpbChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycilcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogXCJnZXQtY29sbGVjdGlvbnNcIiwgcXVlcnkgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMuZmFpbChyZXNwLmVycm9yKVxuXG4gICAgICBpZiAocXVlcnkubGVuZ3RoID09PSAwIHx8IHF1ZXJ5LnRyaW0oKSA9PT0gXCJpbjpcIikge1xuICAgICAgICB0aGlzLmFkZChyZXNwLmNvbnRlbnQpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLmFkZChcbiAgICAgICAgcmVzcC5jb250ZW50LmZpbHRlcihjID0+XG4gICAgICAgICAgYy50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpXG4gICAgICAgIClcbiAgICAgIClcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50LXdyYXBwZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjZW50ZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGNvbnRlbnQgJHt0aGlzLnByb3BzLmZvY3VzZWQgPyBcImZvY3VzZWRcIiA6IFwiXCJ9YH0+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyZWV0aW5nIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtbmFtZScgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMub25FcnJvcihyZXNwLmVycm9yKVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbmFtZTogcmVzcC5jb250ZW50Lm5hbWVcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMudGljaygpXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmRlbGV0ZVRpbWVyKClcbiAgfVxuXG4gIGRlbGV0ZVRpbWVyKCkge1xuICAgIGlmICh0aGlzLnRpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKVxuICAgICAgdGhpcy50aW1lciA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfVxuXG4gIHNldFRpbWVyKCkge1xuICAgIHRoaXMuZGVsZXRlVGltZXIoKVxuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMudGljaygpLCA2MDAwMClcbiAgfVxuXG4gIHRpY2soKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBob3Vyczogbm93LmdldEhvdXJzKCksXG4gICAgICBtaW51dGVzOiBub3cuZ2V0TWludXRlcygpXG4gICAgfSlcblxuICAgIHRoaXMuc2V0VGltZXIoKVxuICB9XG5cbiAgb25FcnJvcihlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JlZXRpbmdcIj5cbiAgICAgICAge3RoaXMucmVuZGVyTWVzc2FnZSgpfVxuICAgICAgICB7dGhpcy5yZW5kZXJUaW1lKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUaW1lKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpbWVcIj5cbiAgICAgICAge3BhZCh0aGlzLnN0YXRlLmhvdXJzKX06e3BhZCh0aGlzLnN0YXRlLm1pbnV0ZXMpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTWVzc2FnZSgpIHtcbiAgICBjb25zdCBob3VyID0gdGhpcy5zdGF0ZS5ob3Vyc1xuICAgIGxldCBtZXNzYWdlID0gXCJHb29kIG1vcm5pbmdcIlxuXG4gICAgaWYgKGhvdXIgPj0gMTIpIG1lc3NhZ2UgPSBcIkdvb2QgQWZ0ZXJub29uXCJcbiAgICBpZiAoaG91ciA+PSAxNikgbWVzc2FnZSA9IFwiR29vZCBFdmVuaW5nXCJcblxuICAgIG1lc3NhZ2UgKz0gKHRoaXMuc3RhdGUubmFtZSA/IFwiLFwiIDogXCIuXCIpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXNzYWdlXCI+XG4gICAgICAgIHttZXNzYWdlfVxuICAgICAgICB7dGhpcy5yZW5kZXJOYW1lKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJOYW1lKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5uYW1lKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hbWVcIj5cbiAgICAgICAge3RoaXMuc3RhdGUubmFtZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5zdGF0ZS5uYW1lLnNsaWNlKDEpfS5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBwYWQgKG4pIHtcbiAgaWYgKFN0cmluZyhuKS5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuICcwJyArIG5cbiAgfVxuXG4gIHJldHVybiBuXG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCB7IGZpbmRIb3N0bmFtZSB9IGZyb20gXCIuL3VybC1pbWFnZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhpc3RvcnkgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJoaXN0b3J5XCJcbiAgICB0aGlzLnRpdGxlID0gXCJIaXN0b3J5XCJcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeS5sZW5ndGggPiAxICYmIHF1ZXJ5LnRyaW0oKS5sZW5ndGggPiAxXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBjaHJvbWUuaGlzdG9yeS5zZWFyY2goeyB0ZXh0OiBxdWVyeSB9LCBoaXN0b3J5ID0+IHtcbiAgICAgIHRoaXMuYWRkKGhpc3RvcnkuZmlsdGVyKGZpbHRlck91dFNlYXJjaCkpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJPdXRTZWFyY2gocm93KSB7XG4gIHJldHVybiAoXG4gICAgZmluZEhvc3RuYW1lKHJvdy51cmwpLnNwbGl0KFwiLlwiKVswXSAhPT0gXCJnb29nbGVcIiAmJlxuICAgICEvc2VhcmNoXFwvP1xcP3FcXD1cXHcqLy50ZXN0KHJvdy51cmwpICYmXG4gICAgIS9mYWNlYm9va1xcLmNvbVxcL3NlYXJjaC8udGVzdChyb3cudXJsKSAmJlxuICAgICEvdHdpdHRlclxcLmNvbVxcL3NlYXJjaC8udGVzdChyb3cudXJsKSAmJlxuICAgIGZpbmRIb3N0bmFtZShyb3cudXJsKSAhPT0gXCJ0LmNvXCJcbiAgKVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEljb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgbWV0aG9kID0gdGhpc1sncmVuZGVyJyArIHRoaXMucHJvcHMubmFtZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgwLCAxKSArIHRoaXMucHJvcHMubmFtZS5zbGljZSgxKV1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja30gY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7dGhpcy5wcm9wcy5uYW1lfWB9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21ldGhvZCA/IG1ldGhvZC5jYWxsKHRoaXMpIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHN0cm9rZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuc3Ryb2tlIHx8IDJcbiAgfVxuXG4gIHJlbmRlckFsZXJ0KCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1hbGVydFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTE2IDMgTDMwIDI5IDIgMjkgWiBNMTYgMTEgTDE2IDE5IE0xNiAyMyBMMTYgMjVcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2xvY2soKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWNsb2NrXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNlwiIGN5PVwiMTZcIiByPVwiMTRcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTE2IDggTDE2IDE2IDIwIDIwXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsb3NlKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jbG9zZVwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTIgMzAgTDMwIDIgTTMwIDMwIEwyIDJcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySGVhcnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWhlYXJ0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJjdXJyZW50Y29sb3JcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMuc3Ryb2tlKCl9PlxuICAgICAgICA8cGF0aCBkPVwiTTQgMTYgQzEgMTIgMiA2IDcgNCAxMiAyIDE1IDYgMTYgOCAxNyA2IDIxIDIgMjYgNCAzMSA2IDMxIDEyIDI4IDE2IDI1IDIwIDE2IDI4IDE2IDI4IDE2IDI4IDcgMjAgNCAxNiBaXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNlYXJjaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktc2VhcmNoXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxNFwiIGN5PVwiMTRcIiByPVwiMTJcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTIzIDIzIEwzMCAzMFwiICAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRXh0ZXJuYWwoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWV4dGVybmFsXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTQgOSBMMyA5IDMgMjkgMjMgMjkgMjMgMTggTTE4IDQgTDI4IDQgMjggMTQgTTI4IDQgTDE0IDE4XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRhZygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktdGFnXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIyNFwiIGN5PVwiOFwiIHI9XCIyXCIgLz5cbiAgICAgICAgPHBhdGggZD1cIk0yIDE4IEwxOCAyIDMwIDIgMzAgMTQgMTQgMzAgWlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJUcmFzaCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktdHJhc2hcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0yOCA2IEw2IDYgOCAzMCAyNCAzMCAyNiA2IDQgNiBNMTYgMTIgTDE2IDI0IE0yMSAxMiBMMjAgMjQgTTExIDEyIEwxMiAyNCBNMTIgNiBMMTMgMiAxOSAyIDIwIDZcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUmlnaHRDaGV2cm9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1jaGV2cm9uLXJpZ2h0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTIgMzAgTDI0IDE2IDEyIDJcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLXNldHRpbmdzXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTMgMiBMMTMgNiAxMSA3IDggNCA0IDggNyAxMSA2IDEzIDIgMTMgMiAxOSA2IDE5IDcgMjEgNCAyNCA4IDI4IDExIDI1IDEzIDI2IDEzIDMwIDE5IDMwIDE5IDI2IDIxIDI1IDI0IDI4IDI4IDI0IDI1IDIxIDI2IDE5IDMwIDE5IDMwIDEzIDI2IDEzIDI1IDExIDI4IDggMjQgNCAyMSA3IDE5IDYgMTkgMiBaXCIgLz5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjE2XCIgY3k9XCIxNlwiIHI9XCI0XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLW1zZ1wiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTIgNCBMMzAgNCAzMCAyMiAxNiAyMiA4IDI5IDggMjIgMiAyMiBaXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ28gZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGNsYXNzTmFtZT1cImxvZ29cIiBocmVmPVwiaHR0cHM6Ly9nZXRrb3ptb3MuY29tXCI+XG4gICAgICAgIDxpbWcgc3JjPXtjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTChcImltYWdlcy9pY29uMTI4LnBuZ1wiKX0gdGl0bGU9XCJPcGVuIEtvem1vc1wiIC8+XG4gICAgICA8L2E+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVudSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHNldFRpdGxlKHRpdGxlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRpdGxlIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVudVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAge3RoaXMuc3RhdGUudGl0bGUgfHwgXCJcIn1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJidXR0b25zXCI+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBpY29uPVwiY2FsZW5kYXJcIlxuICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRUaXRsZSgnUmVjZW50bHkgVmlzaXRlZCcpfVxuICAgICAgICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLnNldFRpdGxlKCl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub3BlblJlY2VudCgpfSAvPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICBpY29uPVwiaGVhcnRcIlxuICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRUaXRsZSgnQm9va21hcmtzJyl9XG4gICAgICAgICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMuc2V0VGl0bGUoKX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vcGVuQm9va21hcmtzKCl9IC8+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICBpY29uPVwiZmlyZVwiXG4gICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRUaXRsZSgnTW9zdCBWaXNpdGVkJyl9XG4gICAgICAgICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLnNldFRpdGxlKCl9XG4gICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5Ub3AoKX0gLz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgTWVzc2FnaW5nIGZyb20gJy4uL2xpYi9tZXNzYWdpbmcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZyb21OZXdUYWJUb0JhY2tncm91bmQgZXh0ZW5kcyBNZXNzYWdpbmcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5uYW1lID0gJ2tvem1vczpuZXd0YWInXG4gICAgdGhpcy50YXJnZXQgPSAna296bW9zOmJhY2tncm91bmQnXG4gIH1cblxuICBsaXN0ZW5Gb3JNZXNzYWdlcygpIHtcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobXNnID0+IHRoaXMub25SZWNlaXZlKG1zZykpXG4gIH1cblxuICBzZW5kTWVzc2FnZSAobXNnLCBjYWxsYmFjaykge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1zZywgY2FsbGJhY2spXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCwgcmVuZGVyIH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgV2FsbHBhcGVyIGZyb20gJy4vd2FsbHBhcGVyJ1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4vbWVudVwiXG5pbXBvcnQgU2VhcmNoIGZyb20gJy4vc2VhcmNoJ1xuaW1wb3J0IExvZ28gZnJvbSAnLi9sb2dvJ1xuaW1wb3J0IE1lc3NhZ2luZyBmcm9tIFwiLi9tZXNzYWdpbmdcIlxuaW1wb3J0IFNldHRpbmdzIGZyb20gXCIuL3NldHRpbmdzXCJcblxuY2xhc3MgTmV3VGFiIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1lc3NhZ2luZygpXG5cbiAgICB0aGlzLmxvYWRTZXR0aW5ncygpXG4gICAgdGhpcy5jaGVja0lmRGlzYWJsZWQoKVxuICB9XG5cbiAgbG9hZFNldHRpbmdzKGF2b2lkQ2FjaGUpIHtcbiAgICB0aGlzLmxvYWRTZXR0aW5nKCdtaW5pbWFsTW9kZScsIGF2b2lkQ2FjaGUpXG4gICAgdGhpcy5sb2FkU2V0dGluZygnc2hvd1dhbGxwYXBlcicsIGF2b2lkQ2FjaGUpXG4gICAgdGhpcy5sb2FkU2V0dGluZygnZW5hYmxlR3JlZXRpbmcnLCBhdm9pZENhY2hlKVxuICAgIHRoaXMubG9hZFNldHRpbmcoJ3JlY2VudEJvb2ttYXJrc0ZpcnN0JywgYXZvaWRDYWNoZSlcbiAgfVxuXG4gIGNoZWNrSWZEaXNhYmxlZCgpIHtcbiAgICBpZiAobG9jYWxTdG9yYWdlWydpcy1kaXNhYmxlZCddID09ICcxJykge1xuICAgICAgdGhpcy5zaG93RGVmYXVsdE5ld1RhYigpXG4gICAgfVxuXG4gICAgdGhpcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ2dldC1zZXR0aW5ncy12YWx1ZScsIGtleTogJ2VuYWJsZU5ld1RhYicgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiByZXNwLmVycm9yIH0pXG4gICAgICB9XG5cbiAgICAgIGlmICghcmVzcC5jb250ZW50LnZhbHVlKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZVsnaXMtZGlzYWJsZWQnXSA9IFwiMVwiXG4gICAgICAgIHRoaXMuc2hvd0RlZmF1bHROZXdUYWIoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlWydpcy1kaXNhYmxlZCddID0gXCJcIlxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBsb2FkU2V0dGluZyhrZXksIGF2b2lkQ2FjaGUpIHtcbiAgICBpZiAoIWF2b2lkQ2FjaGUgJiYgbG9jYWxTdG9yYWdlWydzZXR0aW5ncy1jYWNoZS0nICsga2V5XSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5hcHBseVNldHRpbmcoa2V5LCBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVsnc2V0dGluZ3MtY2FjaGUtJyArIGtleV0pKVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgICB0aGlzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LXNldHRpbmdzLXZhbHVlJywga2V5IH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKCFyZXNwLmVycm9yKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZVsnc2V0dGluZ3MtY2FjaGUtJyArIGtleV0gPSBKU09OLnN0cmluZ2lmeShyZXNwLmNvbnRlbnQudmFsdWUpXG4gICAgICAgIHRoaXMuYXBwbHlTZXR0aW5nKGtleSwgcmVzcC5jb250ZW50LnZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBhcHBseVNldHRpbmcoa2V5LCB2YWx1ZSkge1xuICAgIGNvbnN0IHUgPSB7fVxuICAgIHVba2V5XSA9IHZhbHVlXG4gICAgdGhpcy5zZXRTdGF0ZSh1KVxuICB9XG5cbiAgc2hvd0RlZmF1bHROZXdUYWIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZGlzYWJsZWQpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBuZXdUYWJVUkw6IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYsXG4gICAgICBkaXNhYmxlZDogdHJ1ZVxuICAgIH0pXG5cblx0XHRjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCBmdW5jdGlvbih0YWJzKSB7XG5cdFx0XHR2YXIgYWN0aXZlID0gdGFic1swXS5pZFxuXG5cdFx0XHRjaHJvbWUudGFicy51cGRhdGUoYWN0aXZlLCB7XG4gICAgICAgIHVybDogL2ZpcmVmb3gvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpID8gXCJhYm91dDpuZXd0YWJcIiA6IFwiY2hyb21lLXNlYXJjaDovL2xvY2FsLW50cC9sb2NhbC1udHAuaHRtbFwiXG4gICAgICB9KVxuXHRcdH0pXG4gIH1cblxuICBwcmV2V2FsbHBhcGVyKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgd2FsbHBhcGVySW5kZXg6ICh0aGlzLnN0YXRlLndhbGxwYXBlckluZGV4IHx8IDApIC0gMVxuICAgIH0pXG4gIH1cblxuICBuZXh0V2FsbHBhcGVyKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgd2FsbHBhcGVySW5kZXg6ICh0aGlzLnN0YXRlLndhbGxwYXBlckluZGV4IHx8IDApICsgMVxuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZGlzYWJsZWQpIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgbmV3dGFiICR7dGhpcy5zdGF0ZS5zaG93V2FsbHBhcGVyID8gXCJoYXMtd2FsbHBhcGVyXCIgOiBcIlwifSAke3RoaXMuc3RhdGUubWluaW1hbE1vZGUgPyBcIm1pbmltYWxcIiA6IFwiXCJ9YH0+XG4gICAgICAgIHt0aGlzLnN0YXRlLm1pbmltYWxNb2RlID8gbnVsbCA6IDxMb2dvIC8+fVxuICAgICAgICA8U2V0dGluZ3Mgb25DaGFuZ2U9eygpID0+IHRoaXMubG9hZFNldHRpbmdzKHRydWUpfSBtZXNzYWdlcz17dGhpcy5tZXNzYWdlc30gdHlwZT1cIm5ld3RhYlwiIC8+XG4gICAgICAgIDxTZWFyY2ggcmVjZW50Qm9va21hcmtzRmlyc3Q9e3RoaXMuc3RhdGUucmVjZW50Qm9va21hcmtzRmlyc3R9IG5leHRXYWxscGFwZXI9eygpID0+IHRoaXMubmV4dFdhbGxwYXBlcigpfSBwcmV2V2FsbHBhcGVyPXsoKSA9PiB0aGlzLnByZXZXYWxscGFwZXIoKX0gZW5hYmxlR3JlZXRpbmc9e3RoaXMuc3RhdGUuZW5hYmxlR3JlZXRpbmd9IHNldHRpbmdzPXt0aGlzLnNldHRpbmdzfSAvPlxuICAgICAgICB7IHRoaXMuc3RhdGUuc2hvd1dhbGxwYXBlciA/IDxXYWxscGFwZXIgaW5kZXg9e3RoaXMuc3RhdGUud2FsbHBhcGVySW5kZXh9IG1lc3NhZ2VzPXt0aGlzLm1lc3NhZ2VzfSAvPiA6IG51bGwgfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbnJlbmRlcig8TmV3VGFiIC8+LCBkb2N1bWVudC5ib2R5KVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5pbXBvcnQgdGl0bGVGcm9tVVJMIGZyb20gXCJ0aXRsZS1mcm9tLXVybFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5U3VnZ2VzdGlvbnMgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJxdWVyeS1zdWdnZXN0aW9uc1wiXG4gICAgdGhpcy5waW5uZWQgPSB0cnVlXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gaXNVUkwocXVlcnkpXG4gICAgLy8gcmV0dXJuIHF1ZXJ5Lmxlbmd0aCA+IDEgJiYgcXVlcnkudHJpbSgpLmxlbmd0aCA+IDFcbiAgfVxuXG4gIGNyZWF0ZVVSTFN1Z2dlc3Rpb25zKHF1ZXJ5KSB7XG4gICAgaWYgKCFpc1VSTChxdWVyeSkpIHJldHVybiBbXVxuXG4gICAgY29uc3QgdXJsID0gL1xcdys6XFwvXFwvLy50ZXN0KHF1ZXJ5KSA/IHF1ZXJ5IDogXCJodHRwOi8vXCIgKyBxdWVyeVxuXG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgdGl0bGU6IGBPcGVuIFwiJHt0aXRsZUZyb21VUkwocXVlcnkpfVwiYCxcbiAgICAgICAgdHlwZTogXCJxdWVyeS1zdWdnZXN0aW9uXCIsXG4gICAgICAgIHVybFxuICAgICAgfVxuICAgIF1cbiAgfVxuXG4gIGNyZWF0ZVNlYXJjaFN1Z2dlc3Rpb25zKHF1ZXJ5KSB7XG4gICAgaWYgKGlzVVJMKHF1ZXJ5KSkgcmV0dXJuIFtdXG4gICAgaWYgKHF1ZXJ5LmluZGV4T2YoXCJ0YWc6XCIpID09PSAwICYmIHF1ZXJ5Lmxlbmd0aCA+IDQpXG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgdXJsOiBcImh0dHBzOi8vZ2V0a296bW9zLmNvbS90YWcvXCIgKyBlbmNvZGVVUkkocXVlcnkuc2xpY2UoNCkpLFxuICAgICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgICB0aXRsZTogYE9wZW4gXCIke3F1ZXJ5LnNsaWNlKDQpfVwiIHRhZyBpbiBLb3ptb3NgLFxuICAgICAgICAgIHR5cGU6IFwic2VhcmNoLXF1ZXJ5XCJcbiAgICAgICAgfVxuICAgICAgXVxuXG4gICAgcmV0dXJuIFtcbiAgICAgIC8qe1xuICAgICAgICB1cmw6ICdodHRwczovL2dvb2dsZS5jb20vc2VhcmNoP3E9JyArIGVuY29kZVVSSShxdWVyeSksXG4gICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgdGl0bGU6IGBTZWFyY2ggXCIke3F1ZXJ5fVwiIG9uIEdvb2dsZWAsXG4gICAgICAgIHR5cGU6ICdzZWFyY2gtcXVlcnknXG4gICAgICB9LCovXG4gICAgICB7XG4gICAgICAgIHVybDogXCJodHRwczovL2dldGtvem1vcy5jb20vc2VhcmNoP3E9XCIgKyBlbmNvZGVVUkkocXVlcnkpLFxuICAgICAgICBxdWVyeTogcXVlcnksXG4gICAgICAgIHRpdGxlOiBgU2VhcmNoIFwiJHtxdWVyeX1cIiBvbiBLb3ptb3NgLFxuICAgICAgICB0eXBlOiBcInNlYXJjaC1xdWVyeVwiXG4gICAgICB9XG4gICAgXVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgdGhpcy5hZGQoXG4gICAgICB0aGlzLmNyZWF0ZVVSTFN1Z2dlc3Rpb25zKHF1ZXJ5KS5jb25jYXQoXG4gICAgICAgIHRoaXMuY3JlYXRlU2VhcmNoU3VnZ2VzdGlvbnMocXVlcnkpXG4gICAgICApXG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzVVJMKHF1ZXJ5KSB7XG4gIHJldHVybiBxdWVyeS50cmltKCkuaW5kZXhPZihcIi5cIikgPiAwICYmIHF1ZXJ5LmluZGV4T2YoXCIgXCIpID09PSAtMVxufVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY2VudEJvb2ttYXJrcyBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSBcInJlY2VudC1ib29rbWFya3NcIlxuICAgIHRoaXMudGl0bGUgPSBcIlJlY2VudGx5IEJvb2ttYXJrZWRcIlxuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5Lmxlbmd0aCA9PT0gMFxuICB9XG5cbiAgZmFpbChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycilcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKFxuICAgICAgeyB0YXNrOiBcImdldC1yZWNlbnQtYm9va21hcmtzXCIsIHF1ZXJ5IH0sXG4gICAgICByZXNwID0+IHtcbiAgICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLmZhaWwocmVzcC5lcnJvcilcblxuICAgICAgICB0aGlzLmFkZChyZXNwLmNvbnRlbnQpXG4gICAgICB9XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuXG5pbXBvcnQgVG9wU2l0ZXMgZnJvbSBcIi4vdG9wLXNpdGVzXCJcbmltcG9ydCBSZWNlbnRCb29rbWFya3MgZnJvbSBcIi4vcmVjZW50LWJvb2ttYXJrc1wiXG5pbXBvcnQgQ29sbGVjdGlvbnMgZnJvbSBcIi4vY29sbGVjdGlvbnNcIlxuaW1wb3J0IFF1ZXJ5U3VnZ2VzdGlvbnMgZnJvbSBcIi4vcXVlcnktc3VnZ2VzdGlvbnNcIlxuaW1wb3J0IEJvb2ttYXJrU2VhcmNoIGZyb20gXCIuL2Jvb2ttYXJrLXNlYXJjaFwiXG5pbXBvcnQgSGlzdG9yeSBmcm9tIFwiLi9oaXN0b3J5XCJcbmltcG9ydCBMaXN0Qm9va21hcmtzQnlUYWcgZnJvbSBcIi4vYm9va21hcmstdGFnc1wiXG5pbXBvcnQgTGlzdEJvb2ttYXJrc0J5Q29sbGVjdGlvbiBmcm9tIFwiLi9jb2xsZWN0aW9uLWxpc3RcIlxuaW1wb3J0IExpc3RTcGVlZERpYWwgZnJvbSBcIi4vc3BlZWQtZGlhbFwiXG5pbXBvcnQgQXV0b2NvbXBsZXRlQm9va21hcmtzIGZyb20gXCIuL2F1dG9jb21wbGV0ZS1ib29rbWFya3NcIlxuaW1wb3J0IEF1dG9jb21wbGV0ZVRvcFNpdGVzIGZyb20gXCIuL2F1dG9jb21wbGV0ZS10b3Atc2l0ZXNcIlxuXG5pbXBvcnQgU2lkZWJhciBmcm9tIFwiLi9zaWRlYmFyXCJcbmltcG9ydCBUYWdiYXIgZnJvbSBcIi4vdGFnYmFyXCJcbmltcG9ydCBNZXNzYWdpbmcgZnJvbSBcIi4vbWVzc2FnaW5nXCJcbmltcG9ydCBVUkxJY29uIGZyb20gXCIuL3VybC1pY29uXCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuXG5jb25zdCBNQVhfSVRFTVMgPSA1XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3VsdHMgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWVzc2FnaW5nKClcbiAgICB0aGlzLl9vbktleVByZXNzID0gZGVib3VuY2UodGhpcy5vbktleVByZXNzLmJpbmQodGhpcyksIDUwKVxuICAgIHRoaXMuX3NlbGVjdCA9IGRlYm91bmNlKHRoaXMuc2VsZWN0LmJpbmQodGhpcyksIDEwMClcblxuICAgIHRoaXMuc2V0Q2F0ZWdvcmllcyhwcm9wcylcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAocHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QgIT09IHRoaXMucHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QpIHtcbiAgICAgIHRoaXMuc2V0Q2F0ZWdvcmllcyhwcm9wcylcbiAgICB9XG4gIH1cblxuICBzZXRDYXRlZ29yaWVzKHByb3BzKSB7XG4gICAgY29uc3QgY2F0ZWdvcmllcyA9IFtcbiAgICAgIG5ldyBMaXN0U3BlZWREaWFsKHRoaXMsIDApLFxuICAgICAgbmV3IFF1ZXJ5U3VnZ2VzdGlvbnModGhpcywgMSksXG4gICAgICBuZXcgQXV0b2NvbXBsZXRlVG9wU2l0ZXModGhpcywgMiksXG4gICAgICBuZXcgQXV0b2NvbXBsZXRlQm9va21hcmtzKHRoaXMsIDMpLFxuICAgICAgbmV3IFRvcFNpdGVzKHRoaXMsIHByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0ID8gNSA6IDQpLFxuICAgICAgbmV3IFJlY2VudEJvb2ttYXJrcyh0aGlzLCBwcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdCA/IDQgOiA1KSxcbiAgICAgIG5ldyBDb2xsZWN0aW9ucyh0aGlzLCA2KSxcbiAgICAgIG5ldyBMaXN0Qm9va21hcmtzQnlUYWcodGhpcywgNyksXG4gICAgICAvL25ldyBCb29rbWFya1NlYXJjaCh0aGlzLCA3KSxcbiAgICAgIG5ldyBIaXN0b3J5KHRoaXMsIDgpLFxuICAgICAgbmV3IExpc3RCb29rbWFya3NCeUNvbGxlY3Rpb24odGhpcywgOSlcbiAgICBdXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNhdGVnb3JpZXNcbiAgICB9KVxuXG4gICAgdGhpcy51cGRhdGUocHJvcHMucXVlcnkgfHwgXCJcIilcbiAgfVxuXG4gIGFkZFJvd3MoY2F0ZWdvcnksIHJvd3MpIHtcbiAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgbGV0IHRhZ3MgPSB0aGlzLnN0YXRlLnRhZ3NcbiAgICBsZXQgaSA9IHJvd3MubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgaWYgKHJvd3NbaV0udGFncykge1xuICAgICAgICB0YWdzID0gdGFncy5jb25jYXQocm93c1tpXS50YWdzKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRhZ3MgPSB0YWdzLmZpbHRlcih0ID0+IFwidGFnOlwiICsgdCAhPT0gdGhpcy5wcm9wcy5xdWVyeSlcblxuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnRyaW0oXG4gICAgICB0aGlzLnN0YXRlLmNvbnRlbnQuY29uY2F0KFxuICAgICAgICByb3dzLm1hcCgocm93LCBpKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJvdyxcbiAgICAgICAgICAgIGluZGV4OiB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoICsgaVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIClcbiAgICApXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNvbnRlbnQsXG4gICAgICB0YWdzXG4gICAgfSlcbiAgfVxuXG4gIGNvdW50KGZpbHRlckZuKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY29udGVudC5maWx0ZXIoZmlsdGVyRm4pLmxlbmd0aFxuICB9XG5cbiAgcmVtb3ZlUm93cyhmaWx0ZXJGbikge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY29udGVudDogdGhpcy5zdGF0ZS5jb250ZW50LmZpbHRlcihmaWx0ZXJGbilcbiAgICB9KVxuICB9XG5cbiAgY29udGVudCgpIHtcbiAgICBsZXQgY29udGVudCA9IHRoaXMuc3RhdGUuY29udGVudFxuICAgIGNvbnRlbnQuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEucm93LmNhdGVnb3J5LnNvcnQgPCBiLnJvdy5jYXRlZ29yeS5zb3J0KSByZXR1cm4gLTFcbiAgICAgIGlmIChhLnJvdy5jYXRlZ29yeS5zb3J0ID4gYi5yb3cuY2F0ZWdvcnkuc29ydCkgcmV0dXJuIDFcblxuICAgICAgaWYgKGEuaW5kZXggPCBiLmluZGV4KSByZXR1cm4gLTFcbiAgICAgIGlmIChhLmluZGV4ID4gYi5pbmRleCkgcmV0dXJuIDFcblxuICAgICAgcmV0dXJuIDBcbiAgICB9KVxuXG4gICAgY29uc3QgZGljdCA9IHt9XG4gICAgY29uc3QgdW5pcXVlcyA9IGNvbnRlbnQuZmlsdGVyKGMgPT4ge1xuICAgICAgaWYgKGRpY3RbYy5yb3cua2V5KCldKSByZXR1cm4gZmFsc2VcbiAgICAgIGRpY3RbYy5yb3cua2V5KCldID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbnRlbnQubWFwKChjLCBpbmRleCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcm93OiBjLnJvdyxcbiAgICAgICAgYWJzSW5kZXg6IGluZGV4LFxuICAgICAgICBpbmRleFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjb250ZW50QnlDYXRlZ29yeSgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5jb250ZW50KClcblxuICAgIGNvbnN0IHNlbGVjdGVkQ2F0ZWdvcnkgPVxuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZCAmJiBjb250ZW50W3RoaXMuc3RhdGUuc2VsZWN0ZWRdXG4gICAgICAgID8gY29udGVudFt0aGlzLnN0YXRlLnNlbGVjdGVkXS5yb3cuY2F0ZWdvcnlcbiAgICAgICAgOiBjb250ZW50WzBdLnJvdy5jYXRlZ29yeVxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBbXVxuICAgIGNvbnN0IGNhdGVnb3JpZXNNYXAgPSB7fVxuXG4gICAgbGV0IHRhYkluZGV4ID0gMlxuICAgIGxldCBjYXRlZ29yeSA9IG51bGxcbiAgICBjb250ZW50LmZvckVhY2goKGMsIGluZCkgPT4ge1xuICAgICAgaWYgKCFjYXRlZ29yeSB8fCBjYXRlZ29yeS5uYW1lICE9PSBjLnJvdy5jYXRlZ29yeS5uYW1lKSB7XG4gICAgICAgIGNhdGVnb3J5ID0gYy5yb3cuY2F0ZWdvcnlcbiAgICAgICAgY2F0ZWdvcmllc01hcFtjYXRlZ29yeS5uYW1lXSA9IHtcbiAgICAgICAgICB0aXRsZTogY2F0ZWdvcnkudGl0bGUsXG4gICAgICAgICAgbmFtZTogY2F0ZWdvcnkubmFtZSxcbiAgICAgICAgICBzb3J0OiBjYXRlZ29yeS5zb3J0LFxuICAgICAgICAgIGNvbGxhcHNlZDpcbiAgICAgICAgICAgIGNvbnRlbnQubGVuZ3RoID49IE1BWF9JVEVNUyAmJlxuICAgICAgICAgICAgc2VsZWN0ZWRDYXRlZ29yeS5uYW1lICE9IGNhdGVnb3J5Lm5hbWUgJiZcbiAgICAgICAgICAgICEhY2F0ZWdvcnkudGl0bGUsXG4gICAgICAgICAgcm93czogW11cbiAgICAgICAgfVxuXG4gICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yaWVzTWFwW2NhdGVnb3J5Lm5hbWVdKVxuXG4gICAgICAgIGMudGFiSW5kZXggPSArK3RhYkluZGV4XG4gICAgICB9XG5cbiAgICAgIGNhdGVnb3JpZXNNYXBbY2F0ZWdvcnkubmFtZV0ucm93cy5wdXNoKGMpXG4gICAgfSlcblxuICAgIHJldHVybiBjYXRlZ29yaWVzXG4gIH1cblxuICB0cmltKGNvbnRlbnQpIHtcbiAgICBjb25zdCBjYXRlZ29yeUNvdW50cyA9IHt9XG4gICAgY29uc3QgcGlubmVkQ291bnQgPSB0aGlzLnBpbm5lZFJvd0NvdW50KClcblxuICAgIGNvbnRlbnQgPSBjb250ZW50LmZpbHRlcihjID0+IHtcbiAgICAgIGlmICghY2F0ZWdvcnlDb3VudHNbYy5yb3cuY2F0ZWdvcnkubmFtZV0pIHtcbiAgICAgICAgY2F0ZWdvcnlDb3VudHNbYy5yb3cuY2F0ZWdvcnkubmFtZV0gPSAwXG4gICAgICB9XG5cbiAgICAgIGNhdGVnb3J5Q291bnRzW2Mucm93LmNhdGVnb3J5Lm5hbWVdKytcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgYy5yb3cuY2F0ZWdvcnkucGlubmVkIHx8XG4gICAgICAgIE1BWF9JVEVNUyAtIHBpbm5lZENvdW50ID49IGNhdGVnb3J5Q291bnRzW2Mucm93LmNhdGVnb3J5Lm5hbWVdXG4gICAgICApXG4gICAgfSlcblxuICAgIHJldHVybiBjb250ZW50XG4gIH1cblxuICBwaW5uZWRSb3dDb3VudChjb250ZW50KSB7XG4gICAgY29udGVudCB8fCAoY29udGVudCA9IHRoaXMuc3RhdGUuY29udGVudClcbiAgICBjb25zdCBsZW4gPSBjb250ZW50Lmxlbmd0aFxuXG4gICAgbGV0IGN0ciA9IDBcbiAgICBsZXQgaSA9IC0xXG4gICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgaWYgKGNvbnRlbnRbaV0ucm93LmNhdGVnb3J5LnBpbm5lZCkge1xuICAgICAgICBjdHIrK1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjdHJcbiAgfVxuXG4gIHJlc2V0KHF1ZXJ5LCBjYWxsYmFjaykge1xuICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICB7XG4gICAgICAgIHNlbGVjdGVkOiAwLFxuICAgICAgICBjb250ZW50OiBbXSxcbiAgICAgICAgdGFnczogW10sXG4gICAgICAgIGVycm9yczogW10sXG4gICAgICAgIHF1ZXJ5OiBxdWVyeSB8fCBcIlwiXG4gICAgICB9LFxuICAgICAgY2FsbGJhY2tcbiAgICApXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBxdWVyeSA9IChxdWVyeSB8fCBcIlwiKS50cmltKClcbiAgICB0aGlzLnJlc2V0KHF1ZXJ5KVxuICAgIHRoaXMuc3RhdGUuY2F0ZWdvcmllcy5mb3JFYWNoKGMgPT4gYy5vbk5ld1F1ZXJ5KHF1ZXJ5KSlcbiAgfVxuXG4gIHNlbGVjdChpbmRleCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWQ6IGluZGV4XG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdE5leHQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZDogKHRoaXMuc3RhdGUuc2VsZWN0ZWQgKyAxKSAlIHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGhcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0UHJldmlvdXMoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZDpcbiAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZCA9PSAwXG4gICAgICAgICAgPyB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoIC0gMVxuICAgICAgICAgIDogdGhpcy5zdGF0ZS5zZWxlY3RlZCAtIDFcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0TmV4dENhdGVnb3J5KCkge1xuICAgIGxldCBjdXJyZW50Q2F0ZWdvcnkgPSB0aGlzLnN0YXRlLmNvbnRlbnRbdGhpcy5zdGF0ZS5zZWxlY3RlZF0ucm93LmNhdGVnb3J5XG5cbiAgICBjb25zdCBsZW4gPSB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoXG4gICAgbGV0IGkgPSB0aGlzLnN0YXRlLnNlbGVjdGVkXG4gICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuY29udGVudFtpXS5yb3cuY2F0ZWdvcnkuc29ydCAhPT0gY3VycmVudENhdGVnb3J5LnNvcnQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3QoaSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuY29udGVudFswXS5yb3cuY2F0ZWdvcnkuc29ydCAhPT0gY3VycmVudENhdGVnb3J5LnNvcnQpIHtcbiAgICAgIHRoaXMuc2VsZWN0KDApXG4gICAgfVxuICB9XG5cbiAgc2VsZWN0UHJldmlvdXNDYXRlZ29yeSgpIHtcbiAgICBsZXQgY3VycmVudENhdGVnb3J5ID0gdGhpcy5zdGF0ZS5jb250ZW50W3RoaXMuc3RhdGUuc2VsZWN0ZWRdLnJvdy5jYXRlZ29yeVxuXG4gICAgY29uc3QgbGVuID0gdGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aFxuICAgIGxldCBpID1cbiAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWQgPT09IDBcbiAgICAgICAgPyBsZW4gLSB0aGlzLnN0YXRlLnNlbGVjdGVkXG4gICAgICAgIDogdGhpcy5zdGF0ZS5zZWxlY3RlZFxuXG4gICAgbGV0IG5leHRDYXRlZ29yeVNvcnQgPSB1bmRlZmluZWRcbiAgICBsZXQgbmV4dENhdGVnb3J5SW5kZXggPSB1bmRlZmluZWRcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGlmIChcbiAgICAgICAgbmV4dENhdGVnb3J5U29ydCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIG5leHRDYXRlZ29yeVNvcnQgIT09IHRoaXMuc3RhdGUuY29udGVudFtpXS5yb3cuY2F0ZWdvcnkuc29ydFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KG5leHRDYXRlZ29yeUluZGV4KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc3RhdGUuY29udGVudFtpXS5yb3cuY2F0ZWdvcnkuc29ydCAhPT0gY3VycmVudENhdGVnb3J5LnNvcnQpIHtcbiAgICAgICAgbmV4dENhdGVnb3J5SW5kZXggPSBpXG4gICAgICAgIG5leHRDYXRlZ29yeVNvcnQgPSB0aGlzLnN0YXRlLmNvbnRlbnRbaV0ucm93LmNhdGVnb3J5LnNvcnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5jb250ZW50WzBdLnJvdy5jYXRlZ29yeS5zb3J0ICE9PSBjdXJyZW50Q2F0ZWdvcnkuc29ydCkge1xuICAgICAgdGhpcy5zZWxlY3QoMClcbiAgICB9XG4gIH1cblxuICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICBpZiAobmV4dFByb3BzLnF1ZXJ5ICE9PSB0aGlzLnByb3BzLnF1ZXJ5KSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChuZXh0U3RhdGUuY29udGVudC5sZW5ndGggIT09IHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG5leHRTdGF0ZS5zZWxlY3RlZCAhPT0gdGhpcy5zdGF0ZS5zZWxlY3RlZCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobmV4dFByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0ICE9PSB0aGlzLnByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0KSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5fb25LZXlQcmVzcywgZmFsc2UpXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuX29uS2V5UHJlc3MsIGZhbHNlKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmIChwcm9wcy5xdWVyeSAhPT0gdGhpcy5wcm9wcy5xdWVyeSkge1xuICAgICAgdGhpcy51cGRhdGUocHJvcHMucXVlcnkgfHwgXCJcIilcbiAgICB9XG5cbiAgICBpZiAocHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QgIT09IHRoaXMucHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QpIHtcbiAgICAgIHRoaXMuc2V0Q2F0ZWdvcmllcyhwcm9wcylcbiAgICB9XG4gIH1cblxuICBvbktleVByZXNzKGUpIHtcbiAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAvLyBlbnRlclxuICAgICAgdGhpcy5zdGF0ZS5jb250ZW50W3RoaXMuc3RhdGUuc2VsZWN0ZWRdLnJvdy5vblByZXNzRW50ZXIoKVxuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDkgfHwgKGUua2V5Q29kZSA9PT0gNDAgJiYgZS5jdHJsS2V5KSkge1xuICAgICAgLy8gdGFiIGtleSBvciBjdHJsK2Rvd25cbiAgICAgIHRoaXMuc2VsZWN0TmV4dENhdGVnb3J5KClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSAzOCAmJiBlLmN0cmxLZXkpIHtcbiAgICAgIC8vIGN0cmwrdXBcbiAgICAgIHRoaXMuc2VsZWN0UHJldmlvdXNDYXRlZ29yeSgpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSA0MCkge1xuICAgICAgLy8gZG93biBhcnJvd1xuICAgICAgdGhpcy5zZWxlY3ROZXh0KClcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSAzOCkge1xuICAgICAgLy8gdXAgYXJyb3dcbiAgICAgIHRoaXMuc2VsZWN0UHJldmlvdXMoKVxuICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUua2V5Q29kZSA9PSAzNykge1xuICAgICAgdGhpcy5wcm9wcy5wcmV2V2FsbHBhcGVyKClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUua2V5Q29kZSA9PSAzOSkge1xuICAgICAgdGhpcy5wcm9wcy5uZXh0V2FsbHBhcGVyKClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLmNvdW50ZXIgPSAwXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2ByZXN1bHRzICR7dGhpcy5zdGF0ZS50YWdzLmxlbmd0aCA/IFwiaGFzLXRhZ3NcIiA6IFwiXCJ9YH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlua3NcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHMtY2F0ZWdvcmllc1wiPlxuICAgICAgICAgICAge3RoaXMuY29udGVudEJ5Q2F0ZWdvcnkoKS5tYXAoY2F0ZWdvcnkgPT5cbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJDYXRlZ29yeShjYXRlZ29yeSlcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFNpZGViYXJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiB0aGlzLnVwZGF0ZSgpfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e1xuICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQoKVt0aGlzLnN0YXRlLnNlbGVjdGVkXSAmJlxuICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQoKVt0aGlzLnN0YXRlLnNlbGVjdGVkXS5yb3dcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lc3NhZ2VzPXt0aGlzLm1lc3NhZ2VzfVxuICAgICAgICAgICAgb25VcGRhdGVUb3BTaXRlcz17KCkgPT4gdGhpcy5vblVwZGF0ZVRvcFNpdGVzKCl9XG4gICAgICAgICAgICB1cGRhdGVGbj17KCkgPT4gdGhpcy51cGRhdGUodGhpcy5wcm9wcy5xdWVyeSB8fCBcIlwiKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFRhZ2JhclxuICAgICAgICAgIHF1ZXJ5PXt0aGlzLnByb3BzLnF1ZXJ5fVxuICAgICAgICAgIG9wZW5UYWc9e3RoaXMucHJvcHMub3BlblRhZ31cbiAgICAgICAgICBjb250ZW50PXt0aGlzLnN0YXRlLnRhZ3N9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDYXRlZ29yeShjKSB7XG4gICAgY29uc3Qgb3ZlcmZsb3cgPVxuICAgICAgYy5jb2xsYXBzZWQgJiZcbiAgICAgIHRoaXMuc3RhdGUuY29udGVudFt0aGlzLnN0YXRlLnNlbGVjdGVkXS5yb3cuY2F0ZWdvcnkuc29ydCA8IGMuc29ydCAmJlxuICAgICAgdGhpcy5jb3VudGVyIDwgTUFYX0lURU1TXG4gICAgICAgID8gYy5yb3dzLnNsaWNlKDAsIE1BWF9JVEVNUyAtIHRoaXMuY291bnRlcilcbiAgICAgICAgOiBbXVxuICAgIGNvbnN0IGNvbGxhcHNlZCA9IGMucm93cy5zbGljZShvdmVyZmxvdy5sZW5ndGgsIE1BWF9JVEVNUylcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YGNhdGVnb3J5ICR7Yy5jb2xsYXBzZWQgPyBcImNvbGxhcHNlZFwiIDogXCJcIn1gfT5cbiAgICAgICAge3RoaXMucmVuZGVyQ2F0ZWdvcnlUaXRsZShjKX1cbiAgICAgICAge292ZXJmbG93Lmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1yb3dzIG92ZXJmbG93XCI+XG4gICAgICAgICAgICB7b3ZlcmZsb3cubWFwKGMgPT4gdGhpcy5yZW5kZXJSb3coYy5yb3csIGMuaW5kZXgpKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIHtjb2xsYXBzZWQubGVuZ3RoID4gMCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXJvd3NcIj5cbiAgICAgICAgICAgIHtjb2xsYXBzZWQubWFwKGMgPT4gdGhpcy5yZW5kZXJSb3coYy5yb3csIGMuaW5kZXgpKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDYXRlZ29yeVRpdGxlKGMpIHtcbiAgICBpZiAoIWMudGl0bGUpIHJldHVyblxuXG4gICAgbGV0IHRpdGxlID0gYy50aXRsZVxuICAgIGlmICh0eXBlb2YgdGl0bGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGl0bGUgPSBjLnRpdGxlKHRoaXMucHJvcHMucXVlcnkpXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgPGgxIG9uQ2xpY2s9eygpID0+IHRoaXMuc2VsZWN0KGMucm93c1swXS5hYnNJbmRleCl9PlxuICAgICAgICAgIDxJY29uIHN0cm9rZT1cIjNcIiBuYW1lPVwicmlnaHRDaGV2cm9uXCIgLz5cbiAgICAgICAgICB7dGl0bGV9XG4gICAgICAgIDwvaDE+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJSb3cocm93LCBpbmRleCkge1xuICAgIHRoaXMuY291bnRlcisrXG5cbiAgICByZXR1cm4gKFxuICAgICAgPFVSTEljb25cbiAgICAgICAgY29udGVudD17cm93fVxuICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgIG9uU2VsZWN0PXtpbmRleCA9PiB0aGlzLl9zZWxlY3QoaW5kZXgpfVxuICAgICAgICBzZWxlY3RlZD17dGhpcy5zdGF0ZS5zZWxlY3RlZCA9PSBpbmRleH1cbiAgICAgIC8+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBjbGVhbiBhcyBjbGVhblVSTCB9IGZyb20gXCJ1cmxzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm93IHtcbiAgY29uc3RydWN0b3IoY2F0ZWdvcnksIHsgdGl0bGUsIGRlc2MsIHRhZ3MsIHVybCwgaXNNb3JlQnV0dG9uIH0pIHtcbiAgICB0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnlcbiAgICB0aGlzLnRpdGxlID0gdGl0bGVcbiAgICB0aGlzLmRlc2MgPSBkZXNjXG4gICAgdGhpcy51cmwgPSB1cmxcbiAgICB0aGlzLmlzTW9yZUJ1dHRvbiA9IGlzTW9yZUJ1dHRvblxuICAgIHRoaXMudGFncyA9IHRhZ3NcbiAgfVxuXG4gIGtleSgpIHtcbiAgICByZXR1cm4gdGhpcy51cmxcbiAgfVxuXG4gIG9uQ2xpY2soKSB7XG4gICAgbGV0IHVybCA9IHRoaXMudXJsXG5cbiAgICBpZiAoIS9eaHR0cHM/OlxcL1xcLy8udGVzdCh1cmwpKSB7XG4gICAgICB1cmwgPSBcImh0dHA6Ly9cIiArIHVybFxuICAgIH1cblxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB1cmxcbiAgfVxuXG4gIG9uUHJlc3NFbnRlcigpIHtcbiAgICB0aGlzLm9uQ2xpY2soKVxuICB9XG5cbiAgcmVuZGVyVGl0bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudGl0bGVcbiAgfVxuXG4gIHJlbmRlckRlc2MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVzYyB8fCBjbGVhblVSTCh0aGlzLnVybClcbiAgfVxuXG4gIHJlbmRlckZpcnN0TGV0dGVyKCkge1xuICAgIGlmICghdGhpcy51cmwpIHtcbiAgICAgIHJldHVybiB0aGlzLnRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKClcbiAgICB9XG5cbiAgICByZXR1cm4gZmluZEhvc3RuYW1lKHRoaXMudXJsKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICAudG9VcHBlckNhc2UoKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSG9zdG5hbWUodXJsKSB7XG4gIHJldHVybiB1cmxcbiAgICAucmVwbGFjZSgvXlxcdys6XFwvXFwvLywgXCJcIilcbiAgICAuc3BsaXQoXCIvXCIpWzBdXG4gICAgLnJlcGxhY2UoL153d3dcXC4vLCBcIlwiKVxufVxuIiwiaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCJcbmltcG9ydCBSb3cgZnJvbSBcIi4vcm93XCJcblxuY29uc3QgTU9SRV9SRVNVTFRTX1RIUkVTSE9MRCA9IDRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICB0aGlzLnJlc3VsdHMgPSByZXN1bHRzXG4gICAgdGhpcy5zb3J0ID0gc29ydFxuICB9XG5cbiAgYWRkKHJvd3MpIHtcbiAgICB0aGlzLnJlc3VsdHMuYWRkUm93cyh0aGlzLCByb3dzLm1hcChyID0+IG5ldyBSb3codGhpcywgcikpKVxuICB9XG5cbiAgYWRkTW9yZUJ1dHRvbihyb3dzLCB7IHRpdGxlLCB1cmwgfSkge1xuICAgIGNvbnN0IGFscmVhZHlBZGRlZENvdW50ID0gdGhpcy5yZXN1bHRzLmNvdW50KFxuICAgICAgcm93ID0+IHJvdy5yb3cuY2F0ZWdvcnkubmFtZSA9PT0gdGhpcy5uYW1lICYmICFyb3cucm93LmlzTW9yZUJ1dHRvblxuICAgIClcbiAgICBjb25zdCBsaW1pdCA9IE1PUkVfUkVTVUxUU19USFJFU0hPTEQgLSBhbHJlYWR5QWRkZWRDb3VudFxuXG4gICAgaWYgKHJvd3MubGVuZ3RoID4gbGltaXQpIHtcbiAgICAgIHJvd3MgPSByb3dzLnNsaWNlKDAsIGxpbWl0KVxuICAgIH1cblxuICAgIHRoaXMucmVzdWx0cy5yZW1vdmVSb3dzKFxuICAgICAgcm93ID0+IHJvdy5yb3cuY2F0ZWdvcnkubmFtZSAhPT0gdGhpcy5uYW1lIHx8ICFyb3cucm93LmlzTW9yZUJ1dHRvblxuICAgIClcblxuICAgIHJvd3MucHVzaCh7XG4gICAgICBpc01vcmVCdXR0b246IHRydWUsXG4gICAgICB1cmw6IHVybCB8fCBjb25maWcuaG9zdCxcbiAgICAgIHRpdGxlOiB0aXRsZSB8fCBcIk1vcmUgcmVzdWx0c1wiXG4gICAgfSlcblxuICAgIHJldHVybiByb3dzXG4gIH1cblxuICBmYWlsKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yICVzOiBcIiwgdGhpcy5uYW1lLCBlcnJvcilcbiAgfVxuXG4gIG9uTmV3UXVlcnkocXVlcnkpIHtcbiAgICB0aGlzLmxhdGVzdFF1ZXJ5ID0gcXVlcnlcblxuICAgIGlmICh0aGlzLnNob3VsZEJlT3BlbihxdWVyeSkpIHtcbiAgICAgIHRoaXMudXBkYXRlKHF1ZXJ5KVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoSW5wdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2YWx1ZTogJydcbiAgICB9KVxuXG4gICAgdGhpcy5fb25DbGljayA9IHRoaXMub25DbGljay5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHByb3BzLnZhbHVlICYmIHByb3BzLnZhbHVlLnRyaW0oKSAhPT0gdGhpcy5zdGF0ZS52YWx1ZS50cmltKCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB2YWx1ZTogcHJvcHMudmFsdWVcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgb25CbHVyKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5mb2N1c2VkKSByZXR1cm5cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9jdXNlZDogZmFsc2VcbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy5vbkJsdXIoKVxuICB9XG5cbiAgb25Gb2N1cygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5mb2N1c2VkKSByZXR1cm5cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9jdXNlZDogdHJ1ZVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLm9uRm9jdXMoKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKHRoaXMuaW5wdXQpIHtcbiAgICAgIHRoaXMuaW5wdXQuZm9jdXMoKVxuICAgIH1cbiAgfVxuXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgIHJldHVybiBuZXh0U3RhdGUudmFsdWUgIT09IHRoaXMuc3RhdGUudmFsdWVcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkNsaWNrKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25DbGljaylcbiAgfVxuXG4gIG9uQ2xpY2soZSkge1xuICAgIGlmICh0aGlzLnN0YXRlLnZhbHVlID09PSAnJyAmJiAhZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnQtd3JhcHBlciAuY29udGVudCcpLmNvbnRhaW5zKGUudGFyZ2V0KSAmJiAhZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXR0b24nKSkge1xuICAgICAgdGhpcy5vbkJsdXIoKVxuICAgIH1cbiAgfVxuXG4gIG9uUXVlcnlDaGFuZ2UodmFsdWUsIGtleUNvZGUsIGV2ZW50KSB7XG4gICAgaWYgKHZhbHVlLnRyaW0oKSAhPT0gXCJcIikge1xuICAgICAgdGhpcy5vbkZvY3VzKClcbiAgICB9XG5cbiAgICBpZiAoa2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uUHJlc3NFbnRlcih2YWx1ZSlcbiAgICB9XG5cbiAgICBpZiAoa2V5Q29kZSA9PT0gMjcpIHtcbiAgICAgIHJldHVybiB0aGlzLm9uQmx1cigpXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlIH0pXG5cbiAgICBpZiAodGhpcy5xdWVyeUNoYW5nZVRpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnF1ZXJ5Q2hhbmdlVGltZXIpXG4gICAgICB0aGlzLnF1ZXJ5Q2hhbmdlVGltZXIgPSAwO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLm9uUXVlcnlDaGFuZ2UpIHtcbiAgICAgIHRoaXMucHJvcHMub25RdWVyeUNoYW5nZSh2YWx1ZSlcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VhcmNoLWlucHV0XCI+XG4gICAgICAgIHt0aGlzLnJlbmRlckljb24oKX1cbiAgICAgICAge3RoaXMucmVuZGVySW5wdXQoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckljb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxJY29uIG5hbWU9XCJzZWFyY2hcIiBvbmNsaWNrPXsoKSA9PiB0aGlzLmlucHV0LmZvY3VzKCl9IC8+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySW5wdXQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxpbnB1dCB0YWJpbmRleD1cIjFcIlxuICAgICAgICByZWY9e2VsID0+IHRoaXMuaW5wdXQgPSBlbH1cbiAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICBjbGFzc05hbWU9XCJpbnB1dFwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIG9yIGVudGVyIHdlYnNpdGUgbmFtZS5cIlxuICAgICAgICBvbkZvY3VzPXtlID0+IHRoaXMub25Gb2N1cygpfVxuICAgICAgICBvbkNoYW5nZT17ZSA9PiB0aGlzLm9uUXVlcnlDaGFuZ2UoZS50YXJnZXQudmFsdWUsIHVuZGVmaW5lZCwgJ2NoYW5nZScpfVxuICAgICAgICBvbktleVVwPXtlID0+IHRoaXMub25RdWVyeUNoYW5nZShlLnRhcmdldC52YWx1ZSwgZS5rZXlDb2RlLCAna2V5IHVwJyl9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMub25Gb2N1cygpfVxuICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gLz5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5pbXBvcnQgQ29udGVudCBmcm9tIFwiLi9jb250ZW50XCJcbmltcG9ydCBTZWFyY2hJbnB1dCBmcm9tIFwiLi9zZWFyY2gtaW5wdXRcIlxuaW1wb3J0IFJlc3VsdHMgZnJvbSBcIi4vcmVzdWx0c1wiXG5pbXBvcnQgTWVzc2FnaW5nIGZyb20gXCIuL21lc3NhZ2luZ1wiXG5pbXBvcnQgR3JlZXRpbmcgZnJvbSBcIi4vZ3JlZXRpbmdcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2ggZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWVzc2FnaW5nKClcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaWQ6IDAsXG4gICAgICByb3dzOiB7fSxcbiAgICAgIHJvd3NBdmFpbGFibGU6IDUsXG4gICAgICBxdWVyeTogXCJcIixcbiAgICAgIGZvY3VzZWQ6IGZhbHNlXG4gICAgfSlcblxuICAgIHRoaXMuX29uUXVlcnlDaGFuZ2UgPSBkZWJvdW5jZSh0aGlzLm9uUXVlcnlDaGFuZ2UuYmluZCh0aGlzKSwgMjUwKVxuICB9XG5cbiAgaWQoKSB7XG4gICAgcmV0dXJuICsrdGhpcy5zdGF0ZS5pZFxuICB9XG5cbiAgb25Gb2N1cygpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvY3VzZWQ6IHRydWVcbiAgICB9KVxuICB9XG5cbiAgb25CbHVyKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9jdXNlZDogZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgb25QcmVzc0VudGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkKSB7XG4gICAgICB0aGlzLm5hdmlnYXRlVG8odGhpcy5zdGF0ZS5zZWxlY3RlZC51cmwpXG4gICAgfVxuICB9XG5cbiAgb25TZWxlY3Qocm93KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWQgJiYgdGhpcy5zdGF0ZS5zZWxlY3RlZC5pZCA9PT0gcm93LmlkKSByZXR1cm5cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWQ6IHJvd1xuICAgIH0pXG4gIH1cblxuICBvblF1ZXJ5Q2hhbmdlKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSBxdWVyeS50cmltKClcblxuICAgIGlmIChxdWVyeSA9PT0gdGhpcy5zdGF0ZS5xdWVyeSkgcmV0dXJuXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJvd3M6IHt9LFxuICAgICAgcm93c0F2YWlsYWJsZTogNSxcbiAgICAgIHNlbGVjdGVkOiBudWxsLFxuICAgICAgaWQ6IDAsXG4gICAgICBxdWVyeVxuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxDb250ZW50IHdhbGxwYXBlcj17dGhpcy5wcm9wcy53YWxscGFwZXJ9IGZvY3VzZWQ9e3RoaXMuc3RhdGUuZm9jdXNlZH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudC1pbm5lclwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmVuYWJsZUdyZWV0aW5nID8gKFxuICAgICAgICAgICAgPEdyZWV0aW5nIG5hbWU9e3RoaXMuc3RhdGUudXNlcm5hbWV9IG1lc3NhZ2VzPXt0aGlzLm1lc3NhZ2VzfSAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDxTZWFyY2hJbnB1dFxuICAgICAgICAgICAgb25QcmVzc0VudGVyPXsoKSA9PiB0aGlzLm9uUHJlc3NFbnRlcigpfVxuICAgICAgICAgICAgb25RdWVyeUNoYW5nZT17dGhpcy5fb25RdWVyeUNoYW5nZX1cbiAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHRoaXMub25Gb2N1cygpfVxuICAgICAgICAgICAgb25CbHVyPXsoKSA9PiB0aGlzLm9uQmx1cigpfVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUucXVlcnl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8UmVzdWx0c1xuICAgICAgICAgICAgcmVjZW50Qm9va21hcmtzRmlyc3Q9e3RoaXMucHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3R9XG4gICAgICAgICAgICBuZXh0V2FsbHBhcGVyPXt0aGlzLnByb3BzLm5leHRXYWxscGFwZXJ9XG4gICAgICAgICAgICBwcmV2V2FsbHBhcGVyPXt0aGlzLnByb3BzLnByZXZXYWxscGFwZXJ9XG4gICAgICAgICAgICBvcGVuVGFnPXt0YWcgPT4gdGhpcy5fb25RdWVyeUNoYW5nZShcInRhZzpcIiArIHRhZyl9XG4gICAgICAgICAgICBvcGVuQ29sbGVjdGlvbj17dGFnID0+IHRoaXMuX29uUXVlcnlDaGFuZ2UoXCJpbjpcIiArIHRhZyl9XG4gICAgICAgICAgICBmb2N1c2VkPXt0aGlzLnN0YXRlLmZvY3VzZWR9XG4gICAgICAgICAgICBxdWVyeT17dGhpcy5zdGF0ZS5xdWVyeX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvQ29udGVudD5cbiAgICApXG4gIH1cblxuICByZW5kZXJSZXN1bHRzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRzLXJvd3NcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBzb3J0TGlrZXMoYSwgYikge1xuICBpZiAoYS5saWtlZF9hdCA8IGIubGlrZWRfYXQpIHJldHVybiAxXG4gIGlmIChhLmxpa2VkX2F0ID4gYi5saWtlZF9hdCkgcmV0dXJuIC0xXG4gIHJldHVybiAwXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuaW1wb3J0IHNlY3Rpb25zIGZyb20gJy4uL2Nocm9tZS9zZXR0aW5ncy1zZWN0aW9ucydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dGluZ3MgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgc2VjdGlvbnMuZm9yRWFjaChzID0+IHRoaXMubG9hZFNlY3Rpb24ocykpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKCkge1xuICAgIHNlY3Rpb25zLmZvckVhY2gocyA9PiB0aGlzLmxvYWRTZWN0aW9uKHMpKVxuICB9XG5cbiAgbG9hZFNlY3Rpb24ocykge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtc2V0dGluZ3MtdmFsdWUnLCBrZXk6IHMua2V5IH0sIHJlc3AgPT4ge1xuICAgICAgaWYgKHJlc3AuZXJyb3IpIHJldHVybiB0aGlzLm9uRXJyb3IocmVzcC5lcnJvcilcbiAgICAgIGNvbnN0IHUgPSB7fVxuICAgICAgdVtzLmtleV0gPSByZXNwLmNvbnRlbnQudmFsdWVcbiAgICAgIHRoaXMuc2V0U3RhdGUodSlcbiAgICB9KVxuICB9XG5cbiAgb25DaGFuZ2UodmFsdWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnc2V0LXNldHRpbmdzLXZhbHVlJywga2V5OiBvcHRpb25zLmtleSwgdmFsdWUgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMub25FcnJvcihyZXNwLmVycm9yKVxuXG4gICAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgb25FcnJvcihlcnJvcikge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXJyb3JcbiAgICB9KVxuXG4gICAgaWYgKHRoaXMucHJvcHMub25FcnJvcikge1xuICAgICAgdGhpcy5wcm9wcy5vbkVycm9yKGVycm9yKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BzZXR0aW5ncyAke3RoaXMuc3RhdGUub3BlbiA/IFwib3BlblwiIDogXCJcIn1gfT5cbiAgICAgICAgPEljb24gb25DbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG9wZW46IHRydWUgfSl9IG5hbWU9XCJzZXR0aW5nc1wiIC8+XG4gICAgICAgIHt0aGlzLnJlbmRlclNldHRpbmdzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZXR0aW5ncygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50XCI+XG4gICAgICAgIHt0aGlzLnJlbmRlckNsb3NlQnV0dG9uKCl9XG4gICAgICAgIDxoMT5TZXR0aW5nczwvaDE+XG4gICAgICAgIDxoMj5Hb3QgZmVlZGJhY2sgLyByZWNvbW1lbmRhdGlvbiA/IDxhIGhyZWY9XCJtYWlsdG86YXplckBnZXRrb3ptb3MuY29tXCI+ZmVlZGJhY2s8L2E+IGFueXRpbWUuPC9oMj5cbiAgICAgICAge3RoaXMucmVuZGVyU2VjdGlvbnMoKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb290ZXJcIj5cbiAgICAgICAgICA8YnV0dG9uIG9uY2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBvcGVuOiBmYWxzZSB9KX0+XG4gICAgICAgICAgICBEb25lXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2VjdGlvbnMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbnNcIj5cbiAgICAgICAge3NlY3Rpb25zLm1hcChzID0+IHRoaXMucmVuZGVyU2VjdGlvbihzKSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZWN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5wcm9wcy50eXBlICYmICFvcHRpb25zW3RoaXMucHJvcHMudHlwZV0pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8c2VjdGlvbiBjbGFzc05hbWU9e2BzZXR0aW5nICR7b3B0aW9ucy5rZXl9YH0+XG4gICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJjaGVja2JveFwiIGlkPXtvcHRpb25zLmtleX0gbmFtZT17b3B0aW9ucy5rZXl9IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3RoaXMuc3RhdGVbb3B0aW9ucy5rZXldfSBvbkNoYW5nZT17ZSA9PiB0aGlzLm9uQ2hhbmdlKGUudGFyZ2V0LmNoZWNrZWQsIG9wdGlvbnMpfSAvPlxuICAgICAgICA8bGFiZWwgdGl0bGU9e29wdGlvbnMuZGVzY30gaHRtbEZvcj17b3B0aW9ucy5rZXl9PntvcHRpb25zLnRpdGxlfTwvbGFiZWw+XG4gICAgICAgIDxwPntvcHRpb25zLmRlc2N9PC9wPlxuICAgICAgPC9zZWN0aW9uPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsb3NlQnV0dG9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8SWNvbiBzdHJva2U9XCIzXCIgbmFtZT1cImNsb3NlXCIgb25DbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG9wZW46IGZhbHNlIH0pfSAvPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgeyBjbGVhbiBhcyBjbGVhblVSTCB9IGZyb20gXCJ1cmxzXCJcbmltcG9ydCByZWxhdGl2ZURhdGUgZnJvbSBcInJlbGF0aXZlLWRhdGVcIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5pbXBvcnQgVVJMSW1hZ2UgZnJvbSBcIi4vdXJsLWltYWdlXCJcbmltcG9ydCB7IGhpZGUgYXMgaGlkZVRvcFNpdGUgfSBmcm9tIFwiLi90b3Atc2l0ZXNcIlxuaW1wb3J0IHsgZmluZEhvc3RuYW1lIH0gZnJvbSBcIi4vdXJsLWltYWdlXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lkZWJhciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAoIXByb3BzLnNlbGVjdGVkKSByZXR1cm5cbiAgICBwcm9wcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogXCJnZXQtbGlrZVwiLCB1cmw6IHByb3BzLnNlbGVjdGVkLnVybCB9LCByZXNwID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsaWtlOiByZXNwLmNvbnRlbnQubGlrZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgZGVsZXRlVG9wU2l0ZSgpIHtcbiAgICBoaWRlVG9wU2l0ZSh0aGlzLnByb3BzLnNlbGVjdGVkLnVybClcbiAgICB0aGlzLnByb3BzLnVwZGF0ZUZuKClcbiAgfVxuXG4gIHRvZ2dsZUxpa2UoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubGlrZSkgdGhpcy51bmxpa2UoKVxuICAgIGVsc2UgdGhpcy5saWtlKClcbiAgfVxuXG4gIGxpa2UoKSB7XG4gICAgdGhpcy5wcm9wcy5tZXNzYWdlcy5zZW5kKFxuICAgICAgeyB0YXNrOiBcImxpa2VcIiwgdXJsOiB0aGlzLnByb3BzLnNlbGVjdGVkLnVybCB9LFxuICAgICAgcmVzcCA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGxpa2U6IHJlc3AuY29udGVudC5saWtlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgKVxuXG4gICAgc2V0VGltZW91dCh0aGlzLnByb3BzLm9uQ2hhbmdlLCAxMDAwKVxuICB9XG5cbiAgdW5saWtlKCkge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZChcbiAgICAgIHsgdGFzazogXCJ1bmxpa2VcIiwgdXJsOiB0aGlzLnByb3BzLnNlbGVjdGVkLnVybCB9LFxuICAgICAgcmVzcCA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGxpa2U6IG51bGxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICApXG5cbiAgICBzZXRUaW1lb3V0KHRoaXMucHJvcHMub25DaGFuZ2UsIDEwMDApXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnNlbGVjdGVkKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNpZGViYXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWFnZVwiPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImxpbmtcIiBocmVmPXt0aGlzLnByb3BzLnNlbGVjdGVkLnVybH0gdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICAgPFVSTEltYWdlIGNvbnRlbnQ9e3RoaXMucHJvcHMuc2VsZWN0ZWR9IC8+XG4gICAgICAgICAgICA8aDE+e3RoaXMucHJvcHMuc2VsZWN0ZWQudGl0bGV9PC9oMT5cbiAgICAgICAgICAgIDxoMj5cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMuc2VsZWN0ZWQudXJsXG4gICAgICAgICAgICAgICAgPyBjbGVhblVSTCh0aGlzLnByb3BzLnNlbGVjdGVkLnVybClcbiAgICAgICAgICAgICAgICA6IHRoaXMucHJvcHMuc2VsZWN0ZWQuZGVzY31cbiAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgPC9hPlxuICAgICAgICAgIHt0aGlzLnJlbmRlckJ1dHRvbnMoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJCdXR0b25zKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbnNcIj5cbiAgICAgICAge3RoaXMucmVuZGVyTGlrZUJ1dHRvbigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tZW50QnV0dG9uKCl9XG4gICAgICAgIHt0aGlzLnByb3BzLnNlbGVjdGVkLnR5cGUgPT09IFwidG9wXCJcbiAgICAgICAgICA/IHRoaXMucmVuZGVyRGVsZXRlVG9wU2l0ZUJ1dHRvbigpXG4gICAgICAgICAgOiBudWxsfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTGlrZUJ1dHRvbigpIHtcbiAgICBjb25zdCBhZ28gPSB0aGlzLnN0YXRlLmxpa2UgPyByZWxhdGl2ZURhdGUodGhpcy5zdGF0ZS5saWtlLmNyZWF0ZWRBdCkgOiBcIlwiXG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLnN0YXRlLmxpa2VcbiAgICAgID8gXCJEZWxldGUgdGhpcyB3ZWJzaXRlIGZyb20gbXkgYm9va21hcmtzXCJcbiAgICAgIDogXCJCb29rbWFyayB0aGlzIHdlYnNpdGVcIlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgICBjbGFzc05hbWU9e2BidXR0b24gbGlrZS1idXR0b24gJHt0aGlzLnN0YXRlLmxpa2UgPyBcImxpa2VkXCIgOiBcIlwifWB9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMudG9nZ2xlTGlrZSgpfVxuICAgICAgPlxuICAgICAgICA8SWNvbiBuYW1lPVwiaGVhcnRcIiAvPlxuICAgICAgICB7dGhpcy5zdGF0ZS5saWtlID8gYExpa2VkICR7YWdvfWAgOiBcIkxpa2UgSXRcIn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbW1lbnRCdXR0b24oKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmxpa2UpIHJldHVyblxuXG4gICAgY29uc3QgaG9zdG5hbWUgPSBmaW5kSG9zdG5hbWUodGhpcy5zdGF0ZS5saWtlLnVybClcbiAgICBjb25zdCBpc0hvbWVwYWdlID0gY2xlYW5VUkwodGhpcy5zdGF0ZS5saWtlLnVybCkuaW5kZXhPZihcIi9cIikgPT09IC0xXG5cbiAgICBpZiAoIWlzSG9tZXBhZ2UpIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxhXG4gICAgICAgIHRpdGxlPXtgQ29tbWVudHMgYWJvdXQgJHtob3N0bmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9e2BidXR0b24gY29tbWVudC1idXR0b25gfVxuICAgICAgICBocmVmPXtgaHR0cHM6Ly9nZXRrb3ptb3MuY29tL3NpdGUvJHtob3N0bmFtZX1gfVxuICAgICAgPlxuICAgICAgICA8SWNvbiBuYW1lPVwibWVzc2FnZVwiIC8+XG4gICAgICAgIENvbW1lbnRzXG4gICAgICA8L2E+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRGVsZXRlVG9wU2l0ZUJ1dHRvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICB0aXRsZT1cIkRlbGV0ZSBJdCBGcm9tIEZyZXF1ZW50bHkgVmlzaXRlZFwiXG4gICAgICAgIGNsYXNzTmFtZT1cImJ1dHRvbiBkZWxldGUtYnV0dG9uXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5kZWxldGVUb3BTaXRlKCl9XG4gICAgICA+XG4gICAgICAgIDxJY29uIG5hbWU9XCJ0cmFzaFwiIC8+XG4gICAgICAgIERlbGV0ZSBJdFxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpc3RTcGVlZERpYWwgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJzcGVlZC1kaWFsXCJcbiAgICB0aGlzLnRpdGxlID0gcXVlcnkgPT4gYFNwZWVkIERpYWxgXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgcXVlcnkubGVuZ3RoID4gMCAmJiAhcXVlcnkuc3RhcnRzV2l0aChcImluOlwiKSAmJiAhcXVlcnkuc3RhcnRzV2l0aChcInRhZzpcIilcbiAgICApXG4gIH1cblxuICBhc3luYyB1cGRhdGUocXVlcnkpIHtcbiAgICBjb25zdCBzcGVlZGRpYWwgPSBhd2FpdCB0aGlzLmdldFNwZWVkRGlhbEJ5S2V5KHF1ZXJ5KVxuXG4gICAgaWYgKHNwZWVkZGlhbCkge1xuICAgICAgdGhpcy5hZGQoW3NwZWVkZGlhbF0pXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0U3BlZWREaWFsQnlLZXkoa2V5KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKFxuICAgICAgICB7XG4gICAgICAgICAgdGFzazogXCJnZXQtc3BlZWQtZGlhbFwiLFxuICAgICAgICAgIGtleVxuICAgICAgICB9LFxuICAgICAgICByZXNwID0+IHtcbiAgICAgICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHJlamVjdChyZXNwLmVycm9yKVxuICAgICAgICAgIHJlc29sdmUocmVzcC5jb250ZW50LnNwZWVkZGlhbClcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBnZXRMaW5rQnlVcmwodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogXCJnZXQtbGlrZVwiLCB1cmwgfSwgcmVzcCA9PiB7XG4gICAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gcmVqZWN0KHJlc3AuZXJyb3IpXG4gICAgICAgIHJlc29sdmUocmVzcC5jb250ZW50Lmxpa2UpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VRdWVyeShxdWVyeSkge1xuICBpZiAoL15pbjpcXFwiW1xcd1xcc10rXFxcIiQvLnRlc3QocXVlcnkpKSB7XG4gICAgcmV0dXJuIFtxdWVyeS5zbGljZSg0LCAtMSkudHJpbSgpXVxuICB9XG5cbiAgaWYgKC9eaW46XFxcIltcXHdcXHNdK1xcXCIgW1xcd1xcc10rJC8udGVzdChxdWVyeSkpIHtcbiAgICBjb25zdCBjbG9zaW5nUXVvdGVBdCA9IHF1ZXJ5LmluZGV4T2YoJ1wiICcsIDQpXG4gICAgY29uc3QgY29sbGVjdGlvbiA9IHF1ZXJ5LnNsaWNlKDQsIGNsb3NpbmdRdW90ZUF0KVxuICAgIGNvbnN0IGZpbHRlciA9IHF1ZXJ5LnNsaWNlKGNsb3NpbmdRdW90ZUF0KVxuICAgIHJldHVybiBbY29sbGVjdGlvbi50cmltKCksIGZpbHRlci50cmltKCldXG4gIH1cblxuICBpZiAoL15pbjpcXHcrIFtcXHdcXHNdKyQvLnRlc3QocXVlcnkpKSB7XG4gICAgY29uc3Qgc2VwYXJhdGluZ1NwYWNlQXQgPSBxdWVyeS5pbmRleE9mKFwiIFwiLCAzKVxuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBxdWVyeS5zbGljZSgzLCBzZXBhcmF0aW5nU3BhY2VBdClcbiAgICBjb25zdCBmaWx0ZXIgPSBxdWVyeS5zbGljZShzZXBhcmF0aW5nU3BhY2VBdClcbiAgICByZXR1cm4gW2NvbGxlY3Rpb24udHJpbSgpLCBmaWx0ZXIudHJpbSgpXVxuICB9XG5cbiAgcmV0dXJuIFtxdWVyeS5zbGljZSgzKS50cmltKCldXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYWdiYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb250ZW50KCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5jb250ZW50IHx8ICF0aGlzLnByb3BzLmNvbnRlbnQubGVuZ3RoKSByZXR1cm4gW11cblxuICAgIGNvbnN0IGNvcHkgPSB0aGlzLnByb3BzLmNvbnRlbnQuc2xpY2UoKVxuXG4gICAgY29uc3Qgb2NjciA9IHt9XG4gICAgbGV0IGkgPSBjb3B5Lmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIG9jY3JbY29weVtpXV0gPSBvY2NyW2NvcHlbaV1dID8gb2Njcltjb3B5W2ldXSsxIDogMVxuICAgIH1cblxuICAgIGNvbnN0IHVuaXF1ZXMgPSBPYmplY3Qua2V5cyhvY2NyKVxuICAgIHVuaXF1ZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKG9jY3JbYV0gPCBvY2NyW2JdKSByZXR1cm4gMVxuICAgICAgaWYgKG9jY3JbYV0gPiBvY2NyW2JdKSByZXR1cm4gLTFcbiAgICAgIHJldHVybiAwXG4gICAgfSlcblxuICAgIHJldHVybiB1bmlxdWVzXG4gIH1cblxuICBtYXgoKSB7XG4gICAgcmV0dXJuIDEwXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudCgpXG4gICAgaWYgKGNvbnRlbnQubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhZ2JhclwiPlxuICAgICAgICA8SWNvbiBuYW1lPVwidGFnXCIgc3Ryb2tlPVwiM1wiIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGVyc29uYWwtdGFnc1wiPlxuICAgICAgICAgIHtjb250ZW50LnNsaWNlKDAsIHRoaXMubWF4KCkpLm1hcCh0ID0+IHRoaXMucmVuZGVyVGFnKHQpKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUYWcobmFtZSkge1xuICAgIGNvbnN0IHRpdGxlID0gY2FwaXRhbGl6ZShuYW1lKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGNsYXNzTmFtZT1cInRhZyBidXR0b25cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5UYWcobmFtZSl9IHRpdGxlPXtgT3BlbiBcIiR7dGl0bGV9XCIgdGFnYH0+XG4gICAgICAgIHt0aXRsZX1cbiAgICAgIDwvYT5cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gY2FwaXRhbGl6ZSAodGl0bGUpIHtcbiAgcmV0dXJuIHRpdGxlLnNwbGl0KC9cXHMrLykubWFwKHcgPT4gdy5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgdy5zbGljZSgxKSkuam9pbignICcpXG59XG4iLCJpbXBvcnQgdGl0bGVGcm9tVVJMIGZyb20gXCJ0aXRsZS1mcm9tLXVybFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkKHRpdGxlKSB7XG4gIGNvbnN0IGFic2xlbiA9IHRpdGxlLnJlcGxhY2UoL1teXFx3XSsvZywgJycpLmxlbmd0aFxuICByZXR1cm4gYWJzbGVuID49IDIgJiYgIS9eaHR0cFxcdz86XFwvXFwvLy50ZXN0KHRpdGxlKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKHRpdGxlKSB7XG4gIHJldHVybiB0aXRsZS50cmltKCkucmVwbGFjZSgvXlxcKFxcZCtcXCkvLCAnJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlRnJvbVVSTCh1cmwpIHtcbiAgcmV0dXJuIHRpdGxlRnJvbVVSTCh1cmwpXG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9wU2l0ZXMgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy50aXRsZSA9IFwiRnJlcXVlbnRseSBWaXNpdGVkXCJcbiAgICB0aGlzLm5hbWUgPSBcInRvcFwiXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkubGVuZ3RoID09IDBcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIHJldHVybiB0aGlzLmFsbCgpXG4gIH1cblxuICBhbGwoKSB7XG4gICAgZ2V0KHJvd3MgPT4gdGhpcy5hZGQocm93cy5zbGljZSgwLCA1KSkpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkS296bW9zKHJvd3MpIHtcbiAgbGV0IGkgPSByb3dzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKHJvd3NbaV0udXJsLmluZGV4T2YoXCJnZXRrb3ptb3MuY29tXCIpID4gLTEpIHtcbiAgICAgIHJldHVybiByb3dzXG4gICAgfVxuICB9XG5cbiAgcm93c1s0XSA9IHtcbiAgICB1cmw6IFwiaHR0cHM6Ly9nZXRrb3ptb3MuY29tXCIsXG4gICAgdGl0bGU6IFwiS296bW9zXCJcbiAgfVxuXG4gIHJldHVybiByb3dzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXQoY2FsbGJhY2spIHtcbiAgY2hyb21lLnRvcFNpdGVzLmdldCh0b3BTaXRlcyA9PiB7XG4gICAgY2FsbGJhY2soZmlsdGVyKHRvcFNpdGVzKSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGUodXJsKSB7XG4gIGxldCBoaWRkZW4gPSBnZXRIaWRkZW5Ub3BTaXRlcygpXG4gIGhpZGRlblt1cmxdID0gdHJ1ZVxuICBzZXRIaWRkZW5Ub3BTaXRlcyhoaWRkZW4pXG59XG5cbmZ1bmN0aW9uIGdldEhpZGRlblRvcFNpdGVzKCkge1xuICBsZXQgbGlzdCA9IHtcbiAgICBcImh0dHBzOi8vZ29vZ2xlLmNvbS9cIjogdHJ1ZSxcbiAgICBcImh0dHA6Ly9nb29nbGUuY29tL1wiOiB0cnVlXG4gIH1cblxuICB0cnkge1xuICAgIGxpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtcImhpZGRlbi10b3BsaXN0XCJdKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBzZXRIaWRkZW5Ub3BTaXRlcyhsaXN0KVxuICB9XG5cbiAgcmV0dXJuIGxpc3Rcbn1cblxuZnVuY3Rpb24gc2V0SGlkZGVuVG9wU2l0ZXMobGlzdCkge1xuICBsb2NhbFN0b3JhZ2VbXCJoaWRkZW4tdG9wbGlzdFwiXSA9IEpTT04uc3RyaW5naWZ5KGxpc3QpXG59XG5cbmZ1bmN0aW9uIGZpbHRlcih0b3BTaXRlcykge1xuICBjb25zdCBoaWRlID0gZ2V0SGlkZGVuVG9wU2l0ZXMoKVxuICByZXR1cm4gdG9wU2l0ZXMuZmlsdGVyKHJvdyA9PiAhaGlkZVtyb3cudXJsXSlcbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IGltZyBmcm9tIFwiaW1nXCJcbmltcG9ydCAqIGFzIHRpdGxlcyBmcm9tIFwiLi90aXRsZXNcIlxuaW1wb3J0IFVSTEltYWdlIGZyb20gXCIuL3VybC1pbWFnZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVSTEljb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMucHJvcHMuY29udGVudC51cmwgIT09IG5leHRQcm9wcy5jb250ZW50LnVybCB8fFxuICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZCAhPT0gbmV4dFByb3BzLnNlbGVjdGVkIHx8XG4gICAgICB0aGlzLnByb3BzLnR5cGUgIT09IG5leHRQcm9wcy50eXBlXG4gICAgKVxuICB9XG5cbiAgc2VsZWN0KCkge1xuICAgIHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy5pbmRleClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvKmNvbnN0IGxpbmtUaXRsZSA9IHRoaXMucHJvcHMuY29udGVudC51cmxcbiAgICAgID8gYCR7dGhpcy50aXRsZSgpfSAtICR7Y2xlYW5VUkwodGhpcy5wcm9wcy5jb250ZW50LnVybCl9YFxuICAgICAgOiB0aGlzLnRpdGxlKCkqL1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgaWQ9e3RoaXMucHJvcHMuY29udGVudC5pZH1cbiAgICAgICAgY2xhc3NOYW1lPXtgdXJsaWNvbiAke3RoaXMucHJvcHMuc2VsZWN0ZWQgPyBcInNlbGVjdGVkXCIgOiBcIlwifWB9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMuY29udGVudC5vbkNsaWNrKCl9XG4gICAgICAgIHRpdGxlPXt0aGlzLnByb3BzLmNvbnRlbnQucmVuZGVyVGl0bGUoKX1cbiAgICAgICAgb25Nb3VzZU1vdmU9eygpID0+IHRoaXMuc2VsZWN0KCl9XG4gICAgICA+XG4gICAgICAgIDxVUkxJbWFnZSBjb250ZW50PXt0aGlzLnByb3BzLmNvbnRlbnR9IGljb24tb25seSAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+e3RoaXMucHJvcHMuY29udGVudC5yZW5kZXJUaXRsZSgpfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVybFwiPnt0aGlzLnByb3BzLmNvbnRlbnQucmVuZGVyRGVzYygpfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIC8qdGl0bGUoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC50eXBlID09PSBcInNlYXJjaC1xdWVyeVwiKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5jb250ZW50LnRpdGxlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC50eXBlID09PSBcInVybC1xdWVyeVwiKSB7XG4gICAgICByZXR1cm4gYE9wZW4gJHtjbGVhblVSTCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKX1gXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC50eXBlID09PSBcImNvbGxlY3Rpb25zXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmNvbnRlbnQudGl0bGVcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jb250ZW50LnRpdGxlICYmIHRpdGxlcy5pc1ZhbGlkKHRoaXMucHJvcHMuY29udGVudC50aXRsZSkpIHtcbiAgICAgIHJldHVybiB0aXRsZXMubm9ybWFsaXplKHRoaXMucHJvcHMuY29udGVudC50aXRsZSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGl0bGVzLmdlbmVyYXRlRnJvbVVSTCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKVxuICB9Ki9cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IGltZyBmcm9tIFwiaW1nXCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuaW1wb3J0IHJhbmRvbUNvbG9yIGZyb20gXCJyYW5kb20tY29sb3JcIlxuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCJcblxuZXhwb3J0IGNvbnN0IHBvcHVsYXJJY29ucyA9IHtcbiAgXCJmYWNlYm9vay5jb21cIjpcbiAgICBcImh0dHBzOi8vc3RhdGljLnh4LmZiY2RuLm5ldC9yc3JjLnBocC92My95eC9yL040SF81MEtGcDhpLnBuZ1wiLFxuICBcInR3aXR0ZXIuY29tXCI6XG4gICAgXCJodHRwczovL21hLTAudHdpbWcuY29tL3R3aXR0ZXItYXNzZXRzL3Jlc3BvbnNpdmUtd2ViL3dlYi9sdHIvaWNvbi1pb3MuYTljZDg4NWJjY2JjYWYyZi5wbmdcIixcbiAgXCJ5b3V0dWJlLmNvbVwiOiBcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3l0cy9pbWcvZmF2aWNvbl85Ni12ZmxXOUVjMHcucG5nXCIsXG4gIFwiYW1hem9uLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9HLzAxL2FueXdoZXJlL2Ffc21pbGVfMTIweDEyMC5fQ0IzNjgyNDY1NzNfLnBuZ1wiLFxuICBcImdvb2dsZS5jb21cIjpcbiAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2JyYW5kaW5nL3Byb2R1Y3RfaW9zLzJ4L2dzYV9pb3NfNjBkcC5wbmdcIixcbiAgXCJ5YWhvby5jb21cIjogXCJodHRwczovL3d3dy55YWhvby5jb20vYXBwbGUtdG91Y2gtaWNvbi1wcmVjb21wb3NlZC5wbmdcIixcbiAgXCJyZWRkaXQuY29tXCI6IFwiaHR0cHM6Ly93d3cucmVkZGl0c3RhdGljLmNvbS9td2ViMngvZmF2aWNvbi8xMjB4MTIwLnBuZ1wiLFxuICBcImluc3RhZ3JhbS5jb21cIjpcbiAgICBcImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vc3RhdGljL2ltYWdlcy9pY28vYXBwbGUtdG91Y2gtaWNvbi0xMjB4MTIwLXByZWNvbXBvc2VkLnBuZy8wMDQ3MDVjOTM1M2YucG5nXCIsXG4gIFwiZ2V0a296bW9zLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly9nZXRrb3ptb3MuY29tL3B1YmxpYy9sb2dvcy9rb3ptb3MtaGVhcnQtbG9nby0xMDBweC5wbmdcIixcbiAgXCJnaXRodWIuY29tXCI6IFwiaHR0cHM6Ly9naXRodWIuZ2l0aHViYXNzZXRzLmNvbS9waW5uZWQtb2N0b2NhdC5zdmdcIixcbiAgXCJnaXN0LmdpdGh1Yi5jb21cIjogXCJodHRwczovL2dpdGh1Yi5naXRodWJhc3NldHMuY29tL3Bpbm5lZC1vY3RvY2F0LnN2Z1wiLFxuICBcIm1haWwuZ29vZ2xlLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9pbWFnZXMvaWNvbnMvcHJvZHVjdC9nb29nbGVtYWlsLTEyOC5wbmdcIixcbiAgXCJnbWFpbC5jb21cIjogXCJodHRwczovL3d3dy5nb29nbGUuY29tL2ltYWdlcy9pY29ucy9wcm9kdWN0L2dvb2dsZW1haWwtMTI4LnBuZ1wiLFxuICBcInBheXBhbC5jb21cIjogXCJodHRwczovL3d3dy5wYXlwYWxvYmplY3RzLmNvbS93ZWJzdGF0aWMvaWNvbi9wcDE0NC5wbmdcIixcbiAgXCJzbGFjay5jb21cIjpcbiAgICBcImh0dHBzOi8vYXNzZXRzLmJyYW5kZm9sZGVyLmNvbS9wbDU0NmotN2xlOHprLTZnd2l5by92aWV3QDJ4LnBuZ1wiLFxuICBcImltZGIuY29tXCI6XG4gICAgXCJodHRwOi8vaWEubWVkaWEtaW1kYi5jb20vaW1hZ2VzL0cvMDEvaW1kYi9pbWFnZXMvZGVza3RvcC1mYXZpY29uLTIxNjU4MDY5NzAuX0NCNTIyNzM2NTYxXy5pY29cIixcbiAgXCJlbi53aWtpcGVkaWEub3JnXCI6IFwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3N0YXRpYy9mYXZpY29uL3dpa2lwZWRpYS5pY29cIixcbiAgXCJ3aWtpcGVkaWEub3JnXCI6IFwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3N0YXRpYy9mYXZpY29uL3dpa2lwZWRpYS5pY29cIixcbiAgXCJlc3BuLmNvbVwiOiBcImh0dHA6Ly9hLmVzcG5jZG4uY29tL2Zhdmljb24uaWNvXCIsXG4gIFwidHdpdGNoLnR2XCI6XG4gICAgXCJodHRwczovL3N0YXRpYy50d2l0Y2hjZG4ubmV0L2Fzc2V0cy9mYXZpY29uLTc1MjcwZjlkZjJiMDcxNzRjMjNjZTg0NGEwM2Q4NGFmLmljb1wiLFxuICBcImNubi5jb21cIjpcbiAgICBcImh0dHA6Ly9jZG4uY25uLmNvbS9jbm4vLmUvaW1nLzMuMC9nbG9iYWwvbWlzYy9hcHBsZS10b3VjaC1pY29uLnBuZ1wiLFxuICBcIm9mZmljZS5jb21cIjpcbiAgICBcImh0dHBzOi8vc2Vhb2ZmaWNlaG9tZS5tc29jZG4uY29tL3MvNzA0NzQ1MmUvSW1hZ2VzL2Zhdmljb25fbWV0cm8uaWNvXCIsXG4gIFwiYmFua29mYW1lcmljYS5jb21cIjpcbiAgICBcImh0dHBzOi8vd3d3MS5iYWMtYXNzZXRzLmNvbS9ob21lcGFnZS9zcGEtYXNzZXRzL2ltYWdlcy9hc3NldHMtaW1hZ2VzLWdsb2JhbC1mYXZpY29uLWZhdmljb24tQ1NYMzg2YjMzMmQuaWNvXCIsXG4gIFwiY2hhc2UuY29tXCI6IFwiaHR0cHM6Ly93d3cuY2hhc2UuY29tL2V0Yy9kZXNpZ25zL2NoYXNlLXV4L2Zhdmljb24tMTUyLnBuZ1wiLFxuICBcIm55dGltZXMuY29tXCI6IFwiaHR0cHM6Ly9zdGF0aWMwMS5ueXQuY29tL2ltYWdlcy9pY29ucy9pb3MtaXBhZC0xNDR4MTQ0LnBuZ1wiLFxuICBcImFwcGxlLmNvbVwiOiBcImh0dHBzOi8vd3d3LmFwcGxlLmNvbS9mYXZpY29uLmljb1wiLFxuICBcIndlbGxzZmFyZ28uY29tXCI6XG4gICAgXCJodHRwczovL3d3dy53ZWxsc2ZhcmdvLmNvbS9hc3NldHMvaW1hZ2VzL2ljb25zL2FwcGxlLXRvdWNoLWljb24tMTIweDEyMC5wbmdcIixcbiAgXCJ5ZWxwLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly9zMy1tZWRpYTIuZmwueWVscGNkbi5jb20vYXNzZXRzL3NydjAveWVscF9zdHlsZWd1aWRlLzExOGZmNDc1YTM0MS9hc3NldHMvaW1nL2xvZ29zL2Zhdmljb24uaWNvXCIsXG4gIFwid29yZHByZXNzLmNvbVwiOiBcImh0dHA6Ly9zMC53cC5jb20vaS93ZWJjbGlwLnBuZ1wiLFxuICBcImRyb3Bib3guY29tXCI6XG4gICAgXCJodHRwczovL2NmbC5kcm9wYm94c3RhdGljLmNvbS9zdGF0aWMvaW1hZ2VzL2Zhdmljb24tdmZsVWVMZWVZLmljb1wiLFxuICBcIm1haWwuc3VwZXJodW1hbi5jb21cIjpcbiAgICBcImh0dHBzOi8vc3VwZXJodW1hbi5jb20vYnVpbGQvNzEyMjJiZGMxNjllNTkwNmMyODI0N2VkNWI3Y2YwZWQuc2hhcmUtaWNvbi5wbmdcIixcbiAgXCJhd3MuYW1hem9uLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly9hMC5hd3NzdGF0aWMuY29tL2xpYnJhLWNzcy9pbWFnZXMvc2l0ZS90b3VjaC1pY29uLWlwaG9uZS0xMTQtc21pbGUucG5nXCIsXG4gIFwiY29uc29sZS5hd3MuYW1hem9uLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly9hMC5hd3NzdGF0aWMuY29tL2xpYnJhLWNzcy9pbWFnZXMvc2l0ZS90b3VjaC1pY29uLWlwaG9uZS0xMTQtc21pbGUucG5nXCIsXG4gIFwidXMtd2VzdC0yLmNvbnNvbGUuYXdzLmFtYXpvbi5jb21cIjpcbiAgICBcImh0dHBzOi8vYTAuYXdzc3RhdGljLmNvbS9saWJyYS1jc3MvaW1hZ2VzL3NpdGUvdG91Y2gtaWNvbi1pcGhvbmUtMTE0LXNtaWxlLnBuZ1wiLFxuICBcInN0YWNrb3ZlcmZsb3cuY29tXCI6XG4gICAgXCJodHRwczovL2Nkbi5zc3RhdGljLm5ldC9TaXRlcy9zdGFja292ZXJmbG93L2ltZy9hcHBsZS10b3VjaC1pY29uLnBuZ1wiXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVSTEltYWdlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLl9yZWZyZXNoU291cmNlID0gZGVib3VuY2UodGhpcy5yZWZyZXNoU291cmNlLmJpbmQodGhpcykpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC51cmwgIT09IHByb3BzLmNvbnRlbnQudXJsKSB7XG4gICAgICB0aGlzLl9yZWZyZXNoU291cmNlKHByb3BzLmNvbnRlbnQpXG4gICAgfVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgaWYgKG5leHRQcm9wcy5jb250ZW50LnVybCAhPT0gdGhpcy5wcm9wcy5jb250ZW50LnVybCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobmV4dFN0YXRlLnNyYyAhPT0gdGhpcy5zdGF0ZS5zcmMpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgbmV4dFN0YXRlLmxvYWRpbmcgIT09IHRoaXMuc3RhdGUubG9hZGluZyB8fFxuICAgICAgbmV4dFN0YXRlLmVycm9yICE9PSB0aGlzLnN0YXRlLmVycm9yXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgICFuZXh0UHJvcHMuY29udGVudC5pbWFnZXMgfHxcbiAgICAgIHRoaXMucHJvcHMuY29udGVudC5pbWFnZXMgfHxcbiAgICAgIChuZXh0UHJvcHMuY29udGVudC5pbWFnZXMgfHwgIXRoaXMucHJvcHMuY29udGVudC5pbWFnZXMpIHx8XG4gICAgICBuZXh0UHJvcHMuY29udGVudC5pbWFnZXNbMF0gIT09IHRoaXMucHJvcHMuY29udGVudC5pbWFnZXNbMF1cbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdGhpcy5yZWZyZXNoU291cmNlKClcbiAgfVxuXG4gIHJlZnJlc2hTb3VyY2UoY29udGVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY29sb3I6IHJhbmRvbUNvbG9yKDEwMCwgNTApXG4gICAgfSlcblxuICAgIHRoaXMuZmluZFNvdXJjZShjb250ZW50KVxuICAgIHRoaXMucHJlbG9hZCh0aGlzLnN0YXRlLnNyYylcbiAgfVxuXG4gIGZpbmRTb3VyY2UoY29udGVudCkge1xuICAgIGNvbnRlbnQgfHwgKGNvbnRlbnQgPSB0aGlzLnByb3BzLmNvbnRlbnQpXG5cbiAgICBpZiAoIWNvbnRlbnQudXJsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAhdGhpcy5wcm9wc1tcImljb24tb25seVwiXSAmJlxuICAgICAgY29udGVudC5pbWFnZXMgJiZcbiAgICAgIGNvbnRlbnQuaW1hZ2VzLmxlbmd0aCA+IDAgJiZcbiAgICAgIGNvbnRlbnQuaW1hZ2VzWzBdXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcbiAgICAgICAgc3JjOiBjb250ZW50LmltYWdlc1swXVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoY29udGVudC5pY29uKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHR5cGU6IFwiaWNvblwiLFxuICAgICAgICBzcmM6IGFic29sdXRlSWNvblVSTChjb250ZW50KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBob3N0bmFtZSA9IGZpbmRIb3N0bmFtZShjb250ZW50LnVybClcbiAgICBpZiAocG9wdWxhckljb25zW2hvc3RuYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0eXBlOiBcInBvcHVsYXItaWNvblwiLFxuICAgICAgICBzcmM6IHBvcHVsYXJJY29uc1tob3N0bmFtZV1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKC9cXC5zbGFja1xcLmNvbSQvLnRlc3QoaG9zdG5hbWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHR5cGU6IFwicG9wdWxhci1pY29uXCIsXG4gICAgICAgIHNyYzogcG9wdWxhckljb25zW1wic2xhY2suY29tXCJdXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdHlwZTogXCJmYXZpY29uXCIsXG4gICAgICBzcmM6IFwiaHR0cDovL1wiICsgaG9zdG5hbWUgKyBcIi9mYXZpY29uLmljb1wiXG4gICAgfSlcbiAgfVxuXG4gIHByZWxvYWQoc3JjKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5zdGF0ZS5sb2FkaW5nICYmXG4gICAgICB0aGlzLnN0YXRlLmxvYWRpbmdGb3IgPT09IHRoaXMucHJvcHMuY29udGVudC51cmxcbiAgICApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgbG9hZGluZ0ZvcjogdGhpcy5wcm9wcy5jb250ZW50LnVybCxcbiAgICAgIGxvYWRpbmdTcmM6IHNyYyxcbiAgICAgIHNyYzogdGhpcy5jYWNoZWRJY29uVVJMKClcbiAgICB9KVxuXG4gICAgaW1nKHNyYywgZXJyID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmxvYWRpbmdTcmMgIT09IHNyYykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgZXJyb3I6IGVycixcbiAgICAgICAgICBzcmM6IHRoaXMuY2FjaGVkSWNvblVSTCgpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzcmM6IHNyYyxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGVycm9yOiBudWxsXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubG9hZGluZyB8fCB0aGlzLnN0YXRlLmVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2FkaW5nKClcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke3RoaXMuc3RhdGUuc3JjfSlgXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgIGNsYXNzTmFtZT17YHVybC1pbWFnZSAke3RoaXMuc3RhdGUudHlwZX1gfVxuICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckxvYWRpbmcoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuc3RhdGUuY29sb3JcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBkYXRhLWVycm9yPXt0aGlzLnN0YXRlLmVycm9yfVxuICAgICAgICBkYXRhLXR5cGU9e3RoaXMuc3RhdGUudHlwZX1cbiAgICAgICAgZGF0YS1zcmM9e3RoaXMuc3RhdGUuc3JjfVxuICAgICAgICBjbGFzc05hbWU9XCJ1cmwtaW1hZ2UgZ2VuZXJhdGVkLWltYWdlIGNlbnRlclwiXG4gICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgID5cbiAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuY29udGVudC5yZW5kZXJGaXJzdExldHRlcigpfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNhY2hlZEljb25VUkwoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNvbnRlbnQudXJsKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICBcImNocm9tZTovL2Zhdmljb24vc2l6ZS83Mi9cIiArXG4gICAgICBmaW5kUHJvdG9jb2wodGhpcy5wcm9wcy5jb250ZW50LnVybCkgK1xuICAgICAgXCI6Ly9cIiArXG4gICAgICBmaW5kSG9zdG5hbWUodGhpcy5wcm9wcy5jb250ZW50LnVybClcbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gYWJzb2x1dGVJY29uVVJMKGxpa2UpIHtcbiAgaWYgKC9eaHR0cHM/OlxcL1xcLy8udGVzdChsaWtlLmljb24pKSByZXR1cm4gbGlrZS5pY29uXG4gIHJldHVybiBcImh0dHA6Ly9cIiArIGpvaW4oZmluZEhvc3RuYW1lKGxpa2UudXJsKSwgbGlrZS5pY29uKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEhvc3RuYW1lKHVybCkge1xuICByZXR1cm4gdXJsXG4gICAgLnJlcGxhY2UoL15cXHcrOlxcL1xcLy8sIFwiXCIpXG4gICAgLnNwbGl0KFwiL1wiKVswXVxuICAgIC5yZXBsYWNlKC9ed3d3XFwuLywgXCJcIilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQcm90b2NvbCh1cmwpIHtcbiAgaWYgKCEvXmh0dHBzPzpcXC9cXC8vLnRlc3QodXJsKSkgcmV0dXJuIFwiaHR0cFwiXG4gIHJldHVybiB1cmwuc3BsaXQoXCI6Ly9cIilbMF1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IHdhbGxwYXBlcnMgZnJvbSAnLi93YWxscGFwZXJzJ1xuY29uc3QgT05FX0RBWSA9IDEwMDAgKiA2MCAqIDYwICogMjRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbHBhcGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc2VsZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3JjKHRoaXMudG9kYXkoKSAgKyAodGhpcy5wcm9wcy5pbmRleCB8fCAwKSlcbiAgfVxuXG4gIHRvZGF5KCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKClcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKVxuICAgIGNvbnN0IGRpZmYgPSAobm93IC0gc3RhcnQpICsgKChzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpIC0gbm93LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNjAgKiAxMDAwKVxuICAgIHJldHVybiBNYXRoLmZsb29yKGRpZmYgLyBPTkVfREFZKVxuICB9XG5cbiAgc3JjKGluZGV4KSB7XG4gICAgcmV0dXJuIHdhbGxwYXBlcnNbaW5kZXggJSB3YWxscGFwZXJzLmxlbmd0aF1cbiAgfVxuXG4gIHdpZHRoKCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aFxuICB9XG5cbiAgdXJsKHNyYykge1xuICAgIHJldHVybiBzcmMudXJsICsgJz9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PScgKyB0aGlzLndpZHRoKClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzcmMgPSB0aGlzLnNlbGVjdGVkKClcblxuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7dGhpcy51cmwoc3JjKX0pYFxuICAgIH1cblxuICAgIGlmIChzcmMucG9zaXRpb24pIHtcbiAgICAgIHN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IHNyYy5wb3NpdGlvblxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhbGxwYXBlclwiIHN0eWxlPXtzdHlsZX0+PC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ0NDQ2NDY2NjE2OC00OWQ2MzNiODY3OTdcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTA4NDk2MDg4ODAtNmY3ODc1NDJjODhhXCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6IFwidG9wIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDI5NTE2Mzg3NDU5LTk4OTFiN2I5NmM3OFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ2OTg1NDUyMzA4Ni1jYzAyZmU1ZDg4MDBcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0ODg3MjQwMzQ5NTgtMGZhYWQ4OGNmNjlmXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDMwNjUxNzE3NTA0LWViYjllM2U2Nzk1ZVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ0MTgwMjI1OTg3OC1hMTNmNzMyY2U0MTBcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJib3R0b20gY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQyMDA0ODMwMzUtZGI3YmM2YWE1NzM5XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU5MjU4MzUwODc5LTM0ODg2MzE5YTNjOVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNzA5ODkyNjMzMS04ZDMyNGIxMzlkMTVcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJ0b3AgY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQzMDE5NTA2MjQtMmM1NGNjOTgyNmM1XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDgwNDk5NDg0MjY4LWE4NWEyNDE0ZGE4MVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ4MzExNjUzMTUyMi00YzRlNTI1ZjUwNGVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzkwMzAxNjAxODAtYjE4NjA5NTFkNjk2XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTEwMzUzNjIyNzU4LTYyZTNiNjNiNWZiNVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwMTQ0NjY5MDg1Mi1kYTU1ZGY3YmZlMDdcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJ0b3AgY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDE4NjIxNjkyODYtNTE4YzI5MWUzZWVkXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDY5NDc0OTY4MDI4LTU2NjIzZjAyZTQyZVwiIH0sXG4gIHsgXCJwb3NpdGlvblwiOiBcInRvcCBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ3OTAzMDE2MDE4MC1iMTg2MDk1MWQ2OTZcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0MzE4ODc3NzMwNDItODAzZWQ1MmJlZDI2XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTAwNTE0OTY2OTA2LWZlMjQ1ZWVhOTM0NFwiIH0sXG4gIHsgXCJwb3NpdGlvblwiOiBcImJvdHRvbSBjZW50ZXJcIiwgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ2NTQwMTE4MDQ4OS1jZWI1YTM0ZDhhNjNcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDUyOTk5MTYxMzctYjY5NzkzYTY2OTA3XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA0NDYxMTU0MDA1LTMxYjQzNWU2ODdlZFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNDc0MDE5MTA0NS02M2UxNTI1MWU3NTBcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0MzE3OTQwNjIyMzItMmE5OWE1NDMxYzZjXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA0OTA4NDE1MDI1LWI3YzI1NjA5NDY5M1wiIH0sXG4gIHsgXCJwb3NpdGlvblwiOlwiYm90dG9tIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTAxOTYzNDIyNzYyLTNkODliZDk4OTU2OFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ3MDA3MTQ1OTYwNC0zYjVlYzNhN2ZlMDVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTkyNDA3MTM2NzctMmM3YTRmNjkyMDQ0XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDkwNDY0MzQ4MTY2LThiOGJiZDlmMWUyZVwiIH0sXG4gIHsgXCJwb3NpdGlvblwiOlwidG9wIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU1MzI1NTI4MDU1LWFkODE1YWZlY2ViZVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ3ODAzMzM5NDE1MS1jOTMxZDVhNGJkZDZcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NDkwMzQ0NDY4NTMtNjZjODYxNDRiMGFkXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA1MDUzMjYyNjkxLTYyNDA2M2Y5NGI2NVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2MyLnN0YXRpY2ZsaWNrci5jb20vNC8zOTEzLzE0OTQ1NzAyNzM2XzlkMjgzMDQ0YTdfaC5qcGdcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9jMi5zdGF0aWNmbGlja3IuY29tLzQvMzg5Ni8xNDIxNTM4MzA5N19iZDA3MzQyZThlX2guanBnXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vYzIuc3RhdGljZmxpY2tyLmNvbS82LzUwMzUvMTQxMDMyNjgwMjZfMjVlZDk2ZjgxMV9vLmpwZ1wiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2MxLnN0YXRpY2ZsaWNrci5jb20vMy8yODI1LzEzNDY0OTMxNzc0XzVlYTk2NjA4YWFfaC5qcGdcIiB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlXG5cbmZ1bmN0aW9uIGRlYm91bmNlKGZuLCB3YWl0KSB7XG4gIHZhciB0aW1lclxuICB2YXIgYXJnc1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICB3YWl0ID0gMjUwXG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVyICE9IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKVxuICAgICAgdGltZXIgPSB1bmRlZmluZWRcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KG5vb3ApXG4gICAgICBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGFyZ3MgPSBhcmd1bWVudHNcblxuICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVyID0gdW5kZWZpbmVkXG4gICAgICBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpXG4gICAgfSwgd2FpdClcbiAgfVxufVxuXG5mdW5jdGlvbiBub29wKCkge31cbiIsIlxuLyoqXG4gKiBFc2NhcGUgcmVnZXhwIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIFN0cmluZyhzdHIpLnJlcGxhY2UoLyhbLiorPz1eIToke30oKXxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBpbWc7XG5cbmZ1bmN0aW9uIGltZyAoc3JjLCBvcHQsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRcbiAgICBvcHQgPSBudWxsXG4gIH1cblxuXG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICB2YXIgbG9ja2VkO1xuXG4gIGVsLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAobG9ja2VkKSByZXR1cm47XG4gICAgbG9ja2VkID0gdHJ1ZTtcblxuICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHVuZGVmaW5lZCwgZWwpO1xuICB9O1xuXG4gIGVsLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGxvY2tlZCkgcmV0dXJuO1xuICAgIGxvY2tlZCA9IHRydWU7XG5cbiAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhuZXcgRXJyb3IoJ1VuYWJsZSB0byBsb2FkIFwiJyArIHNyYyArICdcIicpLCBlbCk7XG4gIH07XG4gIFxuICBpZiAob3B0ICYmIG9wdC5jcm9zc09yaWdpbilcbiAgICBlbC5jcm9zc09yaWdpbiA9IG9wdC5jcm9zc09yaWdpbjtcblxuICBlbC5zcmMgPSBzcmM7XG5cbiAgcmV0dXJuIGVsO1xufVxuIiwiLy8gLmRpcm5hbWUsIC5iYXNlbmFtZSwgYW5kIC5leHRuYW1lIG1ldGhvZHMgYXJlIGV4dHJhY3RlZCBmcm9tIE5vZGUuanMgdjguMTEuMSxcbi8vIGJhY2twb3J0ZWQgYW5kIHRyYW5zcGxpdGVkIHdpdGggQmFiZWwsIHdpdGggYmFja3dhcmRzLWNvbXBhdCBmaXhlc1xuXG4vLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbiAocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSBwYXRoID0gcGF0aCArICcnO1xuICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiAnLic7XG4gIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KDApO1xuICB2YXIgaGFzUm9vdCA9IGNvZGUgPT09IDQ3IC8qLyovO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDE7IC0taSkge1xuICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yXG4gICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW5kID09PSAtMSkgcmV0dXJuIGhhc1Jvb3QgPyAnLycgOiAnLic7XG4gIGlmIChoYXNSb290ICYmIGVuZCA9PT0gMSkge1xuICAgIC8vIHJldHVybiAnLy8nO1xuICAgIC8vIEJhY2t3YXJkcy1jb21wYXQgZml4OlxuICAgIHJldHVybiAnLyc7XG4gIH1cbiAgcmV0dXJuIHBhdGguc2xpY2UoMCwgZW5kKTtcbn07XG5cbmZ1bmN0aW9uIGJhc2VuYW1lKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9IHBhdGggKyAnJztcblxuICB2YXIgc3RhcnQgPSAwO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICB2YXIgaTtcblxuICBmb3IgKGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgaWYgKHBhdGguY2hhckNvZGVBdChpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAvLyBwYXRoIGNvbXBvbmVudFxuICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICBlbmQgPSBpICsgMTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW5kID09PSAtMSkgcmV0dXJuICcnO1xuICByZXR1cm4gcGF0aC5zbGljZShzdGFydCwgZW5kKTtcbn1cblxuLy8gVXNlcyBhIG1peGVkIGFwcHJvYWNoIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSwgYXMgZXh0IGJlaGF2aW9yIGNoYW5nZWRcbi8vIGluIG5ldyBOb2RlLmpzIHZlcnNpb25zLCBzbyBvbmx5IGJhc2VuYW1lKCkgYWJvdmUgaXMgYmFja3BvcnRlZCBoZXJlXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24gKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IGJhc2VuYW1lKHBhdGgpO1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9IHBhdGggKyAnJztcbiAgdmFyIHN0YXJ0RG90ID0gLTE7XG4gIHZhciBzdGFydFBhcnQgPSAwO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXG4gIC8vIGFmdGVyIGFueSBwYXRoIHNlcGFyYXRvciB3ZSBmaW5kXG4gIHZhciBwcmVEb3RTdGF0ZSA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgIHN0YXJ0UGFydCA9IGkgKyAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAvLyBleHRlbnNpb25cbiAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgZW5kID0gaSArIDE7XG4gICAgfVxuICAgIGlmIChjb2RlID09PSA0NiAvKi4qLykge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIG91ciBmaXJzdCBkb3QsIG1hcmsgaXQgYXMgdGhlIHN0YXJ0IG9mIG91ciBleHRlbnNpb25cbiAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSlcbiAgICAgICAgICBzdGFydERvdCA9IGk7XG4gICAgICAgIGVsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKVxuICAgICAgICAgIHByZURvdFN0YXRlID0gMTtcbiAgICB9IGVsc2UgaWYgKHN0YXJ0RG90ICE9PSAtMSkge1xuICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBhbmQgbm9uLXBhdGggc2VwYXJhdG9yIGJlZm9yZSBvdXIgZG90LCBzbyB3ZSBzaG91bGRcbiAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICBwcmVEb3RTdGF0ZSA9IC0xO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGFydERvdCA9PT0gLTEgfHwgZW5kID09PSAtMSB8fFxuICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBjaGFyYWN0ZXIgaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBkb3RcbiAgICAgIHByZURvdFN0YXRlID09PSAwIHx8XG4gICAgICAvLyBUaGUgKHJpZ2h0LW1vc3QpIHRyaW1tZWQgcGF0aCBjb21wb25lbnQgaXMgZXhhY3RseSAnLi4nXG4gICAgICBwcmVEb3RTdGF0ZSA9PT0gMSAmJiBzdGFydERvdCA9PT0gZW5kIC0gMSAmJiBzdGFydERvdCA9PT0gc3RhcnRQYXJ0ICsgMSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICByZXR1cm4gcGF0aC5zbGljZShzdGFydERvdCwgZW5kKTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcbiIsIiFmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgZnVuY3Rpb24gaChub2RlTmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgbGFzdFNpbXBsZSwgY2hpbGQsIHNpbXBsZSwgaSwgY2hpbGRyZW4gPSBFTVBUWV9DSElMRFJFTjtcbiAgICAgICAgZm9yIChpID0gYXJndW1lbnRzLmxlbmd0aDsgaS0tID4gMjsgKSBzdGFjay5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzICYmIG51bGwgIT0gYXR0cmlidXRlcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgaWYgKCFzdGFjay5sZW5ndGgpIHN0YWNrLnB1c2goYXR0cmlidXRlcy5jaGlsZHJlbik7XG4gICAgICAgICAgICBkZWxldGUgYXR0cmlidXRlcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSBpZiAoKGNoaWxkID0gc3RhY2sucG9wKCkpICYmIHZvaWQgMCAhPT0gY2hpbGQucG9wKSBmb3IgKGkgPSBjaGlsZC5sZW5ndGg7IGktLTsgKSBzdGFjay5wdXNoKGNoaWxkW2ldKTsgZWxzZSB7XG4gICAgICAgICAgICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiBjaGlsZCkgY2hpbGQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHNpbXBsZSA9ICdmdW5jdGlvbicgIT0gdHlwZW9mIG5vZGVOYW1lKSBpZiAobnVsbCA9PSBjaGlsZCkgY2hpbGQgPSAnJzsgZWxzZSBpZiAoJ251bWJlcicgPT0gdHlwZW9mIGNoaWxkKSBjaGlsZCA9IFN0cmluZyhjaGlsZCk7IGVsc2UgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBjaGlsZCkgc2ltcGxlID0gITE7XG4gICAgICAgICAgICBpZiAoc2ltcGxlICYmIGxhc3RTaW1wbGUpIGNoaWxkcmVuW2NoaWxkcmVuLmxlbmd0aCAtIDFdICs9IGNoaWxkOyBlbHNlIGlmIChjaGlsZHJlbiA9PT0gRU1QVFlfQ0hJTERSRU4pIGNoaWxkcmVuID0gWyBjaGlsZCBdOyBlbHNlIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgbGFzdFNpbXBsZSA9IHNpbXBsZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcCA9IG5ldyBWTm9kZSgpO1xuICAgICAgICBwLm5vZGVOYW1lID0gbm9kZU5hbWU7XG4gICAgICAgIHAuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgcC5hdHRyaWJ1dGVzID0gbnVsbCA9PSBhdHRyaWJ1dGVzID8gdm9pZCAwIDogYXR0cmlidXRlcztcbiAgICAgICAgcC5rZXkgPSBudWxsID09IGF0dHJpYnV0ZXMgPyB2b2lkIDAgOiBhdHRyaWJ1dGVzLmtleTtcbiAgICAgICAgaWYgKHZvaWQgMCAhPT0gb3B0aW9ucy52bm9kZSkgb3B0aW9ucy52bm9kZShwKTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV4dGVuZChvYmosIHByb3BzKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gcHJvcHMpIG9ialtpXSA9IHByb3BzW2ldO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbG9uZUVsZW1lbnQodm5vZGUsIHByb3BzKSB7XG4gICAgICAgIHJldHVybiBoKHZub2RlLm5vZGVOYW1lLCBleHRlbmQoZXh0ZW5kKHt9LCB2bm9kZS5hdHRyaWJ1dGVzKSwgcHJvcHMpLCBhcmd1bWVudHMubGVuZ3RoID4gMiA/IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IHZub2RlLmNoaWxkcmVuKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX19kICYmIChjb21wb25lbnQuX19kID0gITApICYmIDEgPT0gaXRlbXMucHVzaChjb21wb25lbnQpKSAob3B0aW9ucy5kZWJvdW5jZVJlbmRlcmluZyB8fCBkZWZlcikocmVyZW5kZXIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXJlbmRlcigpIHtcbiAgICAgICAgdmFyIHAsIGxpc3QgPSBpdGVtcztcbiAgICAgICAgaXRlbXMgPSBbXTtcbiAgICAgICAgd2hpbGUgKHAgPSBsaXN0LnBvcCgpKSBpZiAocC5fX2QpIHJlbmRlckNvbXBvbmVudChwKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNTYW1lTm9kZVR5cGUobm9kZSwgdm5vZGUsIGh5ZHJhdGluZykge1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlIHx8ICdudW1iZXInID09IHR5cGVvZiB2bm9kZSkgcmV0dXJuIHZvaWQgMCAhPT0gbm9kZS5zcGxpdFRleHQ7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUubm9kZU5hbWUpIHJldHVybiAhbm9kZS5fY29tcG9uZW50Q29uc3RydWN0b3IgJiYgaXNOYW1lZE5vZGUobm9kZSwgdm5vZGUubm9kZU5hbWUpOyBlbHNlIHJldHVybiBoeWRyYXRpbmcgfHwgbm9kZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc05hbWVkTm9kZShub2RlLCBub2RlTmFtZSkge1xuICAgICAgICByZXR1cm4gbm9kZS5fX24gPT09IG5vZGVOYW1lIHx8IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0Tm9kZVByb3BzKHZub2RlKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyk7XG4gICAgICAgIHByb3BzLmNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG4gICAgICAgIHZhciBkZWZhdWx0UHJvcHMgPSB2bm9kZS5ub2RlTmFtZS5kZWZhdWx0UHJvcHM7XG4gICAgICAgIGlmICh2b2lkIDAgIT09IGRlZmF1bHRQcm9wcykgZm9yICh2YXIgaSBpbiBkZWZhdWx0UHJvcHMpIGlmICh2b2lkIDAgPT09IHByb3BzW2ldKSBwcm9wc1tpXSA9IGRlZmF1bHRQcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVOb2RlKG5vZGVOYW1lLCBpc1N2Zykge1xuICAgICAgICB2YXIgbm9kZSA9IGlzU3ZnID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIG5vZGVOYW1lKSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuICAgICAgICBub2RlLl9fbiA9IG5vZGVOYW1lO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlKSB7XG4gICAgICAgIHZhciBwYXJlbnROb2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocGFyZW50Tm9kZSkgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0QWNjZXNzb3Iobm9kZSwgbmFtZSwgb2xkLCB2YWx1ZSwgaXNTdmcpIHtcbiAgICAgICAgaWYgKCdjbGFzc05hbWUnID09PSBuYW1lKSBuYW1lID0gJ2NsYXNzJztcbiAgICAgICAgaWYgKCdrZXknID09PSBuYW1lKSA7IGVsc2UgaWYgKCdyZWYnID09PSBuYW1lKSB7XG4gICAgICAgICAgICBpZiAob2xkKSBvbGQobnVsbCk7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHZhbHVlKG5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKCdjbGFzcycgPT09IG5hbWUgJiYgIWlzU3ZnKSBub2RlLmNsYXNzTmFtZSA9IHZhbHVlIHx8ICcnOyBlbHNlIGlmICgnc3R5bGUnID09PSBuYW1lKSB7XG4gICAgICAgICAgICBpZiAoIXZhbHVlIHx8ICdzdHJpbmcnID09IHR5cGVvZiB2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2Ygb2xkKSBub2RlLnN0eWxlLmNzc1RleHQgPSB2YWx1ZSB8fCAnJztcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiAnb2JqZWN0JyA9PSB0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIG9sZCkgZm9yICh2YXIgaSBpbiBvbGQpIGlmICghKGkgaW4gdmFsdWUpKSBub2RlLnN0eWxlW2ldID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkgbm9kZS5zdHlsZVtpXSA9ICdudW1iZXInID09IHR5cGVvZiB2YWx1ZVtpXSAmJiAhMSA9PT0gSVNfTk9OX0RJTUVOU0lPTkFMLnRlc3QoaSkgPyB2YWx1ZVtpXSArICdweCcgOiB2YWx1ZVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgnZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwnID09PSBuYW1lKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIG5vZGUuaW5uZXJIVE1MID0gdmFsdWUuX19odG1sIHx8ICcnO1xuICAgICAgICB9IGVsc2UgaWYgKCdvJyA9PSBuYW1lWzBdICYmICduJyA9PSBuYW1lWzFdKSB7XG4gICAgICAgICAgICB2YXIgdXNlQ2FwdHVyZSA9IG5hbWUgIT09IChuYW1lID0gbmFtZS5yZXBsYWNlKC9DYXB0dXJlJC8sICcnKSk7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpLnN1YnN0cmluZygyKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghb2xkKSBub2RlLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZXZlbnRQcm94eSwgdXNlQ2FwdHVyZSk7XG4gICAgICAgICAgICB9IGVsc2Ugbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgKG5vZGUuX19sIHx8IChub2RlLl9fbCA9IHt9KSlbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmICgnbGlzdCcgIT09IG5hbWUgJiYgJ3R5cGUnICE9PSBuYW1lICYmICFpc1N2ZyAmJiBuYW1lIGluIG5vZGUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbm9kZVtuYW1lXSA9IG51bGwgPT0gdmFsdWUgPyAnJyA6IHZhbHVlO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgIGlmICgobnVsbCA9PSB2YWx1ZSB8fCAhMSA9PT0gdmFsdWUpICYmICdzcGVsbGNoZWNrJyAhPSBuYW1lKSBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBucyA9IGlzU3ZnICYmIG5hbWUgIT09IChuYW1lID0gbmFtZS5yZXBsYWNlKC9eeGxpbms6Py8sICcnKSk7XG4gICAgICAgICAgICBpZiAobnVsbCA9PSB2YWx1ZSB8fCAhMSA9PT0gdmFsdWUpIGlmIChucykgbm9kZS5yZW1vdmVBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsIG5hbWUudG9Mb3dlckNhc2UoKSk7IGVsc2Ugbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7IGVsc2UgaWYgKCdmdW5jdGlvbicgIT0gdHlwZW9mIHZhbHVlKSBpZiAobnMpIG5vZGUuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBuYW1lLnRvTG93ZXJDYXNlKCksIHZhbHVlKTsgZWxzZSBub2RlLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZXZlbnRQcm94eShlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fbFtlLnR5cGVdKG9wdGlvbnMuZXZlbnQgJiYgb3B0aW9ucy5ldmVudChlKSB8fCBlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmx1c2hNb3VudHMoKSB7XG4gICAgICAgIHZhciBjO1xuICAgICAgICB3aGlsZSAoYyA9IG1vdW50cy5wb3AoKSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWZ0ZXJNb3VudCkgb3B0aW9ucy5hZnRlck1vdW50KGMpO1xuICAgICAgICAgICAgaWYgKGMuY29tcG9uZW50RGlkTW91bnQpIGMuY29tcG9uZW50RGlkTW91bnQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBwYXJlbnQsIGNvbXBvbmVudFJvb3QpIHtcbiAgICAgICAgaWYgKCFkaWZmTGV2ZWwrKykge1xuICAgICAgICAgICAgaXNTdmdNb2RlID0gbnVsbCAhPSBwYXJlbnQgJiYgdm9pZCAwICE9PSBwYXJlbnQub3duZXJTVkdFbGVtZW50O1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gbnVsbCAhPSBkb20gJiYgISgnX19wcmVhY3RhdHRyXycgaW4gZG9tKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmV0ID0gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpO1xuICAgICAgICBpZiAocGFyZW50ICYmIHJldC5wYXJlbnROb2RlICE9PSBwYXJlbnQpIHBhcmVudC5hcHBlbmRDaGlsZChyZXQpO1xuICAgICAgICBpZiAoIS0tZGlmZkxldmVsKSB7XG4gICAgICAgICAgICBoeWRyYXRpbmcgPSAhMTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50Um9vdCkgZmx1c2hNb3VudHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgY29tcG9uZW50Um9vdCkge1xuICAgICAgICB2YXIgb3V0ID0gZG9tLCBwcmV2U3ZnTW9kZSA9IGlzU3ZnTW9kZTtcbiAgICAgICAgaWYgKG51bGwgPT0gdm5vZGUgfHwgJ2Jvb2xlYW4nID09IHR5cGVvZiB2bm9kZSkgdm5vZGUgPSAnJztcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHtcbiAgICAgICAgICAgIGlmIChkb20gJiYgdm9pZCAwICE9PSBkb20uc3BsaXRUZXh0ICYmIGRvbS5wYXJlbnROb2RlICYmICghZG9tLl9jb21wb25lbnQgfHwgY29tcG9uZW50Um9vdCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLm5vZGVWYWx1ZSAhPSB2bm9kZSkgZG9tLm5vZGVWYWx1ZSA9IHZub2RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2bm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tLnBhcmVudE5vZGUpIGRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChvdXQsIGRvbSk7XG4gICAgICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGRvbSwgITApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dC5fX3ByZWFjdGF0dHJfID0gITA7XG4gICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICB9XG4gICAgICAgIHZhciB2bm9kZU5hbWUgPSB2bm9kZS5ub2RlTmFtZTtcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHZub2RlTmFtZSkgcmV0dXJuIGJ1aWxkQ29tcG9uZW50RnJvbVZOb2RlKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgaXNTdmdNb2RlID0gJ3N2ZycgPT09IHZub2RlTmFtZSA/ICEwIDogJ2ZvcmVpZ25PYmplY3QnID09PSB2bm9kZU5hbWUgPyAhMSA6IGlzU3ZnTW9kZTtcbiAgICAgICAgdm5vZGVOYW1lID0gU3RyaW5nKHZub2RlTmFtZSk7XG4gICAgICAgIGlmICghZG9tIHx8ICFpc05hbWVkTm9kZShkb20sIHZub2RlTmFtZSkpIHtcbiAgICAgICAgICAgIG91dCA9IGNyZWF0ZU5vZGUodm5vZGVOYW1lLCBpc1N2Z01vZGUpO1xuICAgICAgICAgICAgaWYgKGRvbSkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChkb20uZmlyc3RDaGlsZCkgb3V0LmFwcGVuZENoaWxkKGRvbS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLnBhcmVudE5vZGUpIGRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChvdXQsIGRvbSk7XG4gICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoZG9tLCAhMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZjID0gb3V0LmZpcnN0Q2hpbGQsIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8sIHZjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAobnVsbCA9PSBwcm9wcykge1xuICAgICAgICAgICAgcHJvcHMgPSBvdXQuX19wcmVhY3RhdHRyXyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgYSA9IG91dC5hdHRyaWJ1dGVzLCBpID0gYS5sZW5ndGg7IGktLTsgKSBwcm9wc1thW2ldLm5hbWVdID0gYVtpXS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWh5ZHJhdGluZyAmJiB2Y2hpbGRyZW4gJiYgMSA9PT0gdmNoaWxkcmVuLmxlbmd0aCAmJiAnc3RyaW5nJyA9PSB0eXBlb2YgdmNoaWxkcmVuWzBdICYmIG51bGwgIT0gZmMgJiYgdm9pZCAwICE9PSBmYy5zcGxpdFRleHQgJiYgbnVsbCA9PSBmYy5uZXh0U2libGluZykge1xuICAgICAgICAgICAgaWYgKGZjLm5vZGVWYWx1ZSAhPSB2Y2hpbGRyZW5bMF0pIGZjLm5vZGVWYWx1ZSA9IHZjaGlsZHJlblswXTtcbiAgICAgICAgfSBlbHNlIGlmICh2Y2hpbGRyZW4gJiYgdmNoaWxkcmVuLmxlbmd0aCB8fCBudWxsICE9IGZjKSBpbm5lckRpZmZOb2RlKG91dCwgdmNoaWxkcmVuLCBjb250ZXh0LCBtb3VudEFsbCwgaHlkcmF0aW5nIHx8IG51bGwgIT0gcHJvcHMuZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwpO1xuICAgICAgICBkaWZmQXR0cmlidXRlcyhvdXQsIHZub2RlLmF0dHJpYnV0ZXMsIHByb3BzKTtcbiAgICAgICAgaXNTdmdNb2RlID0gcHJldlN2Z01vZGU7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlubmVyRGlmZk5vZGUoZG9tLCB2Y2hpbGRyZW4sIGNvbnRleHQsIG1vdW50QWxsLCBpc0h5ZHJhdGluZykge1xuICAgICAgICB2YXIgaiwgYywgZiwgdmNoaWxkLCBjaGlsZCwgb3JpZ2luYWxDaGlsZHJlbiA9IGRvbS5jaGlsZE5vZGVzLCBjaGlsZHJlbiA9IFtdLCBrZXllZCA9IHt9LCBrZXllZExlbiA9IDAsIG1pbiA9IDAsIGxlbiA9IG9yaWdpbmFsQ2hpbGRyZW4ubGVuZ3RoLCBjaGlsZHJlbkxlbiA9IDAsIHZsZW4gPSB2Y2hpbGRyZW4gPyB2Y2hpbGRyZW4ubGVuZ3RoIDogMDtcbiAgICAgICAgaWYgKDAgIT09IGxlbikgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgdmFyIF9jaGlsZCA9IG9yaWdpbmFsQ2hpbGRyZW5baV0sIHByb3BzID0gX2NoaWxkLl9fcHJlYWN0YXR0cl8sIGtleSA9IHZsZW4gJiYgcHJvcHMgPyBfY2hpbGQuX2NvbXBvbmVudCA/IF9jaGlsZC5fY29tcG9uZW50Ll9fayA6IHByb3BzLmtleSA6IG51bGw7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBrZXkpIHtcbiAgICAgICAgICAgICAgICBrZXllZExlbisrO1xuICAgICAgICAgICAgICAgIGtleWVkW2tleV0gPSBfY2hpbGQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BzIHx8ICh2b2lkIDAgIT09IF9jaGlsZC5zcGxpdFRleHQgPyBpc0h5ZHJhdGluZyA/IF9jaGlsZC5ub2RlVmFsdWUudHJpbSgpIDogITAgOiBpc0h5ZHJhdGluZykpIGNoaWxkcmVuW2NoaWxkcmVuTGVuKytdID0gX2NoaWxkO1xuICAgICAgICB9XG4gICAgICAgIGlmICgwICE9PSB2bGVuKSBmb3IgKHZhciBpID0gMDsgaSA8IHZsZW47IGkrKykge1xuICAgICAgICAgICAgdmNoaWxkID0gdmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgY2hpbGQgPSBudWxsO1xuICAgICAgICAgICAgdmFyIGtleSA9IHZjaGlsZC5rZXk7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ZWRMZW4gJiYgdm9pZCAwICE9PSBrZXllZFtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0ga2V5ZWRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAga2V5ZWRba2V5XSA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgICAga2V5ZWRMZW4tLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1pbiA8IGNoaWxkcmVuTGVuKSBmb3IgKGogPSBtaW47IGogPCBjaGlsZHJlbkxlbjsgaisrKSBpZiAodm9pZCAwICE9PSBjaGlsZHJlbltqXSAmJiBpc1NhbWVOb2RlVHlwZShjID0gY2hpbGRyZW5bal0sIHZjaGlsZCwgaXNIeWRyYXRpbmcpKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQgPSBjO1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGlmIChqID09PSBjaGlsZHJlbkxlbiAtIDEpIGNoaWxkcmVuTGVuLS07XG4gICAgICAgICAgICAgICAgaWYgKGogPT09IG1pbikgbWluKys7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGlsZCA9IGlkaWZmKGNoaWxkLCB2Y2hpbGQsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGYgPSBvcmlnaW5hbENoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkICYmIGNoaWxkICE9PSBkb20gJiYgY2hpbGQgIT09IGYpIGlmIChudWxsID09IGYpIGRvbS5hcHBlbmRDaGlsZChjaGlsZCk7IGVsc2UgaWYgKGNoaWxkID09PSBmLm5leHRTaWJsaW5nKSByZW1vdmVOb2RlKGYpOyBlbHNlIGRvbS5pbnNlcnRCZWZvcmUoY2hpbGQsIGYpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXllZExlbikgZm9yICh2YXIgaSBpbiBrZXllZCkgaWYgKHZvaWQgMCAhPT0ga2V5ZWRbaV0pIHJlY29sbGVjdE5vZGVUcmVlKGtleWVkW2ldLCAhMSk7XG4gICAgICAgIHdoaWxlIChtaW4gPD0gY2hpbGRyZW5MZW4pIGlmICh2b2lkIDAgIT09IChjaGlsZCA9IGNoaWxkcmVuW2NoaWxkcmVuTGVuLS1dKSkgcmVjb2xsZWN0Tm9kZVRyZWUoY2hpbGQsICExKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVjb2xsZWN0Tm9kZVRyZWUobm9kZSwgdW5tb3VudE9ubHkpIHtcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IG5vZGUuX2NvbXBvbmVudDtcbiAgICAgICAgaWYgKGNvbXBvbmVudCkgdW5tb3VudENvbXBvbmVudChjb21wb25lbnQpOyBlbHNlIHtcbiAgICAgICAgICAgIGlmIChudWxsICE9IG5vZGUuX19wcmVhY3RhdHRyXyAmJiBub2RlLl9fcHJlYWN0YXR0cl8ucmVmKSBub2RlLl9fcHJlYWN0YXR0cl8ucmVmKG51bGwpO1xuICAgICAgICAgICAgaWYgKCExID09PSB1bm1vdW50T25seSB8fCBudWxsID09IG5vZGUuX19wcmVhY3RhdHRyXykgcmVtb3ZlTm9kZShub2RlKTtcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkcmVuKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuKG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUubGFzdENoaWxkO1xuICAgICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICAgICAgdmFyIG5leHQgPSBub2RlLnByZXZpb3VzU2libGluZztcbiAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsICEwKTtcbiAgICAgICAgICAgIG5vZGUgPSBuZXh0O1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpZmZBdHRyaWJ1dGVzKGRvbSwgYXR0cnMsIG9sZCkge1xuICAgICAgICB2YXIgbmFtZTtcbiAgICAgICAgZm9yIChuYW1lIGluIG9sZCkgaWYgKCghYXR0cnMgfHwgbnVsbCA9PSBhdHRyc1tuYW1lXSkgJiYgbnVsbCAhPSBvbGRbbmFtZV0pIHNldEFjY2Vzc29yKGRvbSwgbmFtZSwgb2xkW25hbWVdLCBvbGRbbmFtZV0gPSB2b2lkIDAsIGlzU3ZnTW9kZSk7XG4gICAgICAgIGZvciAobmFtZSBpbiBhdHRycykgaWYgKCEoJ2NoaWxkcmVuJyA9PT0gbmFtZSB8fCAnaW5uZXJIVE1MJyA9PT0gbmFtZSB8fCBuYW1lIGluIG9sZCAmJiBhdHRyc1tuYW1lXSA9PT0gKCd2YWx1ZScgPT09IG5hbWUgfHwgJ2NoZWNrZWQnID09PSBuYW1lID8gZG9tW25hbWVdIDogb2xkW25hbWVdKSkpIHNldEFjY2Vzc29yKGRvbSwgbmFtZSwgb2xkW25hbWVdLCBvbGRbbmFtZV0gPSBhdHRyc1tuYW1lXSwgaXNTdmdNb2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50KEN0b3IsIHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBpbnN0LCBpID0gcmVjeWNsZXJDb21wb25lbnRzLmxlbmd0aDtcbiAgICAgICAgaWYgKEN0b3IucHJvdG90eXBlICYmIEN0b3IucHJvdG90eXBlLnJlbmRlcikge1xuICAgICAgICAgICAgaW5zdCA9IG5ldyBDdG9yKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIENvbXBvbmVudC5jYWxsKGluc3QsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGluc3QuY29uc3RydWN0b3IgPSBDdG9yO1xuICAgICAgICAgICAgaW5zdC5yZW5kZXIgPSBkb1JlbmRlcjtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoaS0tKSBpZiAocmVjeWNsZXJDb21wb25lbnRzW2ldLmNvbnN0cnVjdG9yID09PSBDdG9yKSB7XG4gICAgICAgICAgICBpbnN0Ll9fYiA9IHJlY3ljbGVyQ29tcG9uZW50c1tpXS5fX2I7XG4gICAgICAgICAgICByZWN5Y2xlckNvbXBvbmVudHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3Q7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3Q7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRvUmVuZGVyKHByb3BzLCBzdGF0ZSwgY29udGV4dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldENvbXBvbmVudFByb3BzKGNvbXBvbmVudCwgcHJvcHMsIHJlbmRlck1vZGUsIGNvbnRleHQsIG1vdW50QWxsKSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9feCkge1xuICAgICAgICAgICAgY29tcG9uZW50Ll9feCA9ICEwO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9fciA9IHByb3BzLnJlZjtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX2sgPSBwcm9wcy5rZXk7XG4gICAgICAgICAgICBkZWxldGUgcHJvcHMucmVmO1xuICAgICAgICAgICAgZGVsZXRlIHByb3BzLmtleTtcbiAgICAgICAgICAgIGlmICh2b2lkIDAgPT09IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMpIGlmICghY29tcG9uZW50LmJhc2UgfHwgbW91bnRBbGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcykgY29tcG9uZW50LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHQgJiYgY29udGV4dCAhPT0gY29tcG9uZW50LmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5fX2MpIGNvbXBvbmVudC5fX2MgPSBjb21wb25lbnQuY29udGV4dDtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3ApIGNvbXBvbmVudC5fX3AgPSBjb21wb25lbnQucHJvcHM7XG4gICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMTtcbiAgICAgICAgICAgIGlmICgwICE9PSByZW5kZXJNb2RlKSBpZiAoMSA9PT0gcmVuZGVyTW9kZSB8fCAhMSAhPT0gb3B0aW9ucy5zeW5jQ29tcG9uZW50VXBkYXRlcyB8fCAhY29tcG9uZW50LmJhc2UpIHJlbmRlckNvbXBvbmVudChjb21wb25lbnQsIDEsIG1vdW50QWxsKTsgZWxzZSBlbnF1ZXVlUmVuZGVyKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fcikgY29tcG9uZW50Ll9fcihjb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudChjb21wb25lbnQsIHJlbmRlck1vZGUsIG1vdW50QWxsLCBpc0NoaWxkKSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9feCkge1xuICAgICAgICAgICAgdmFyIHJlbmRlcmVkLCBpbnN0LCBjYmFzZSwgcHJvcHMgPSBjb21wb25lbnQucHJvcHMsIHN0YXRlID0gY29tcG9uZW50LnN0YXRlLCBjb250ZXh0ID0gY29tcG9uZW50LmNvbnRleHQsIHByZXZpb3VzUHJvcHMgPSBjb21wb25lbnQuX19wIHx8IHByb3BzLCBwcmV2aW91c1N0YXRlID0gY29tcG9uZW50Ll9fcyB8fCBzdGF0ZSwgcHJldmlvdXNDb250ZXh0ID0gY29tcG9uZW50Ll9fYyB8fCBjb250ZXh0LCBpc1VwZGF0ZSA9IGNvbXBvbmVudC5iYXNlLCBuZXh0QmFzZSA9IGNvbXBvbmVudC5fX2IsIGluaXRpYWxCYXNlID0gaXNVcGRhdGUgfHwgbmV4dEJhc2UsIGluaXRpYWxDaGlsZENvbXBvbmVudCA9IGNvbXBvbmVudC5fY29tcG9uZW50LCBza2lwID0gITEsIHNuYXBzaG90ID0gcHJldmlvdXNDb250ZXh0O1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IGV4dGVuZChleHRlbmQoe30sIHN0YXRlKSwgY29tcG9uZW50LmNvbnN0cnVjdG9yLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcywgc3RhdGUpKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1VwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByZXZpb3VzUHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gcHJldmlvdXNTdGF0ZTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IHByZXZpb3VzQ29udGV4dDtcbiAgICAgICAgICAgICAgICBpZiAoMiAhPT0gcmVuZGVyTW9kZSAmJiBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlICYmICExID09PSBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCkpIHNraXAgPSAhMDsgZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50Ll9fcCA9IGNvbXBvbmVudC5fX3MgPSBjb21wb25lbnQuX19jID0gY29tcG9uZW50Ll9fYiA9IG51bGw7XG4gICAgICAgICAgICBjb21wb25lbnQuX19kID0gITE7XG4gICAgICAgICAgICBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICByZW5kZXJlZCA9IGNvbXBvbmVudC5yZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmdldENoaWxkQ29udGV4dCkgY29udGV4dCA9IGV4dGVuZChleHRlbmQoe30sIGNvbnRleHQpLCBjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkpO1xuICAgICAgICAgICAgICAgIGlmIChpc1VwZGF0ZSAmJiBjb21wb25lbnQuZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUpIHNuYXBzaG90ID0gY29tcG9uZW50LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHByZXZpb3VzUHJvcHMsIHByZXZpb3VzU3RhdGUpO1xuICAgICAgICAgICAgICAgIHZhciB0b1VubW91bnQsIGJhc2UsIGNoaWxkQ29tcG9uZW50ID0gcmVuZGVyZWQgJiYgcmVuZGVyZWQubm9kZU5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZFByb3BzID0gZ2V0Tm9kZVByb3BzKHJlbmRlcmVkKTtcbiAgICAgICAgICAgICAgICAgICAgaW5zdCA9IGluaXRpYWxDaGlsZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluc3QgJiYgaW5zdC5jb25zdHJ1Y3RvciA9PT0gY2hpbGRDb21wb25lbnQgJiYgY2hpbGRQcm9wcy5rZXkgPT0gaW5zdC5fX2spIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDEsIGNvbnRleHQsICExKTsgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbnN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Ll9jb21wb25lbnQgPSBpbnN0ID0gY3JlYXRlQ29tcG9uZW50KGNoaWxkQ29tcG9uZW50LCBjaGlsZFByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QuX19iID0gaW5zdC5fX2IgfHwgbmV4dEJhc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fdSA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDAsIGNvbnRleHQsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBvbmVudChpbnN0LCAxLCBtb3VudEFsbCwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJhc2UgPSBpbnN0LmJhc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2Jhc2UgPSBpbml0aWFsQmFzZTtcbiAgICAgICAgICAgICAgICAgICAgdG9Vbm1vdW50ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9Vbm1vdW50KSBjYmFzZSA9IGNvbXBvbmVudC5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxCYXNlIHx8IDEgPT09IHJlbmRlck1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYmFzZSkgY2Jhc2UuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlID0gZGlmZihjYmFzZSwgcmVuZGVyZWQsIGNvbnRleHQsIG1vdW50QWxsIHx8ICFpc1VwZGF0ZSwgaW5pdGlhbEJhc2UgJiYgaW5pdGlhbEJhc2UucGFyZW50Tm9kZSwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbml0aWFsQmFzZSAmJiBiYXNlICE9PSBpbml0aWFsQmFzZSAmJiBpbnN0ICE9PSBpbml0aWFsQ2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJhc2VQYXJlbnQgPSBpbml0aWFsQmFzZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZVBhcmVudCAmJiBiYXNlICE9PSBiYXNlUGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlUGFyZW50LnJlcGxhY2VDaGlsZChiYXNlLCBpbml0aWFsQmFzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRvVW5tb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxCYXNlLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGluaXRpYWxCYXNlLCAhMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgdW5tb3VudENvbXBvbmVudCh0b1VubW91bnQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5iYXNlID0gYmFzZTtcbiAgICAgICAgICAgICAgICBpZiAoYmFzZSAmJiAhaXNDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50UmVmID0gY29tcG9uZW50LCB0ID0gY29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodCA9IHQuX191KSAoY29tcG9uZW50UmVmID0gdCkuYmFzZSA9IGJhc2U7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UuX2NvbXBvbmVudCA9IGNvbXBvbmVudFJlZjtcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPSBjb21wb25lbnRSZWYuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1VwZGF0ZSB8fCBtb3VudEFsbCkgbW91bnRzLnVuc2hpZnQoY29tcG9uZW50KTsgZWxzZSBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZSkgY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZShwcmV2aW91c1Byb3BzLCBwcmV2aW91c1N0YXRlLCBzbmFwc2hvdCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWZ0ZXJVcGRhdGUpIG9wdGlvbnMuYWZ0ZXJVcGRhdGUoY29tcG9uZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlIChjb21wb25lbnQuX19oLmxlbmd0aCkgY29tcG9uZW50Ll9faC5wb3AoKS5jYWxsKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoIWRpZmZMZXZlbCAmJiAhaXNDaGlsZCkgZmx1c2hNb3VudHMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgICAgICB2YXIgYyA9IGRvbSAmJiBkb20uX2NvbXBvbmVudCwgb3JpZ2luYWxDb21wb25lbnQgPSBjLCBvbGREb20gPSBkb20sIGlzRGlyZWN0T3duZXIgPSBjICYmIGRvbS5fY29tcG9uZW50Q29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lLCBpc093bmVyID0gaXNEaXJlY3RPd25lciwgcHJvcHMgPSBnZXROb2RlUHJvcHModm5vZGUpO1xuICAgICAgICB3aGlsZSAoYyAmJiAhaXNPd25lciAmJiAoYyA9IGMuX191KSkgaXNPd25lciA9IGMuY29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lO1xuICAgICAgICBpZiAoYyAmJiBpc093bmVyICYmICghbW91bnRBbGwgfHwgYy5fY29tcG9uZW50KSkge1xuICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoYywgcHJvcHMsIDMsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGRvbSA9IGMuYmFzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChvcmlnaW5hbENvbXBvbmVudCAmJiAhaXNEaXJlY3RPd25lcikge1xuICAgICAgICAgICAgICAgIHVubW91bnRDb21wb25lbnQob3JpZ2luYWxDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIGRvbSA9IG9sZERvbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjID0gY3JlYXRlQ29tcG9uZW50KHZub2RlLm5vZGVOYW1lLCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoZG9tICYmICFjLl9fYikge1xuICAgICAgICAgICAgICAgIGMuX19iID0gZG9tO1xuICAgICAgICAgICAgICAgIG9sZERvbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhjLCBwcm9wcywgMSwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZG9tID0gYy5iYXNlO1xuICAgICAgICAgICAgaWYgKG9sZERvbSAmJiBkb20gIT09IG9sZERvbSkge1xuICAgICAgICAgICAgICAgIG9sZERvbS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShvbGREb20sICExKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZG9tO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1bm1vdW50Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICBpZiAob3B0aW9ucy5iZWZvcmVVbm1vdW50KSBvcHRpb25zLmJlZm9yZVVubW91bnQoY29tcG9uZW50KTtcbiAgICAgICAgdmFyIGJhc2UgPSBjb21wb25lbnQuYmFzZTtcbiAgICAgICAgY29tcG9uZW50Ll9feCA9ICEwO1xuICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcbiAgICAgICAgY29tcG9uZW50LmJhc2UgPSBudWxsO1xuICAgICAgICB2YXIgaW5uZXIgPSBjb21wb25lbnQuX2NvbXBvbmVudDtcbiAgICAgICAgaWYgKGlubmVyKSB1bm1vdW50Q29tcG9uZW50KGlubmVyKTsgZWxzZSBpZiAoYmFzZSkge1xuICAgICAgICAgICAgaWYgKGJhc2UuX19wcmVhY3RhdHRyXyAmJiBiYXNlLl9fcHJlYWN0YXR0cl8ucmVmKSBiYXNlLl9fcHJlYWN0YXR0cl8ucmVmKG51bGwpO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9fYiA9IGJhc2U7XG4gICAgICAgICAgICByZW1vdmVOb2RlKGJhc2UpO1xuICAgICAgICAgICAgcmVjeWNsZXJDb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkcmVuKGJhc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb21wb25lbnQuX19yKSBjb21wb25lbnQuX19yKG51bGwpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBDb21wb25lbnQocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fX2QgPSAhMDtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgdGhpcy5fX2ggPSBbXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVuZGVyKHZub2RlLCBwYXJlbnQsIG1lcmdlKSB7XG4gICAgICAgIHJldHVybiBkaWZmKG1lcmdlLCB2bm9kZSwge30sICExLCBwYXJlbnQsICExKTtcbiAgICB9XG4gICAgdmFyIFZOb2RlID0gZnVuY3Rpb24oKSB7fTtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBzdGFjayA9IFtdO1xuICAgIHZhciBFTVBUWV9DSElMRFJFTiA9IFtdO1xuICAgIHZhciBkZWZlciA9ICdmdW5jdGlvbicgPT0gdHlwZW9mIFByb21pc2UgPyBQcm9taXNlLnJlc29sdmUoKS50aGVuLmJpbmQoUHJvbWlzZS5yZXNvbHZlKCkpIDogc2V0VGltZW91dDtcbiAgICB2YXIgSVNfTk9OX0RJTUVOU0lPTkFMID0gL2FjaXR8ZXgoPzpzfGd8bnxwfCQpfHJwaHxvd3N8bW5jfG50d3xpbmVbY2hdfHpvb3xeb3JkL2k7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgdmFyIG1vdW50cyA9IFtdO1xuICAgIHZhciBkaWZmTGV2ZWwgPSAwO1xuICAgIHZhciBpc1N2Z01vZGUgPSAhMTtcbiAgICB2YXIgaHlkcmF0aW5nID0gITE7XG4gICAgdmFyIHJlY3ljbGVyQ29tcG9uZW50cyA9IFtdO1xuICAgIGV4dGVuZChDb21wb25lbnQucHJvdG90eXBlLCB7XG4gICAgICAgIHNldFN0YXRlOiBmdW5jdGlvbihzdGF0ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fX3MpIHRoaXMuX19zID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBleHRlbmQoZXh0ZW5kKHt9LCB0aGlzLnN0YXRlKSwgJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygc3RhdGUgPyBzdGF0ZSh0aGlzLnN0YXRlLCB0aGlzLnByb3BzKSA6IHN0YXRlKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgdGhpcy5fX2gucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICBlbnF1ZXVlUmVuZGVyKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgdGhpcy5fX2gucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICByZW5kZXJDb21wb25lbnQodGhpcywgMik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBwcmVhY3QgPSB7XG4gICAgICAgIGg6IGgsXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQ6IGgsXG4gICAgICAgIGNsb25lRWxlbWVudDogY2xvbmVFbGVtZW50LFxuICAgICAgICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgICAgICAgcmVuZGVyOiByZW5kZXIsXG4gICAgICAgIHJlcmVuZGVyOiByZXJlbmRlcixcbiAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgIH07XG4gICAgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiBtb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gcHJlYWN0OyBlbHNlIHNlbGYucHJlYWN0ID0gcHJlYWN0O1xufSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0LmpzLm1hcCIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKiEgaHR0cHM6Ly9tdGhzLmJlL3B1bnljb2RlIHYxLjQuMSBieSBAbWF0aGlhcyAqL1xuOyhmdW5jdGlvbihyb290KSB7XG5cblx0LyoqIERldGVjdCBmcmVlIHZhcmlhYmxlcyAqL1xuXHR2YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmXG5cdFx0IWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblx0dmFyIGZyZWVNb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJlxuXHRcdCFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXHR2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO1xuXHRpZiAoXG5cdFx0ZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHxcblx0XHRmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCB8fFxuXHRcdGZyZWVHbG9iYWwuc2VsZiA9PT0gZnJlZUdsb2JhbFxuXHQpIHtcblx0XHRyb290ID0gZnJlZUdsb2JhbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYHB1bnljb2RlYCBvYmplY3QuXG5cdCAqIEBuYW1lIHB1bnljb2RlXG5cdCAqIEB0eXBlIE9iamVjdFxuXHQgKi9cblx0dmFyIHB1bnljb2RlLFxuXG5cdC8qKiBIaWdoZXN0IHBvc2l0aXZlIHNpZ25lZCAzMi1iaXQgZmxvYXQgdmFsdWUgKi9cblx0bWF4SW50ID0gMjE0NzQ4MzY0NywgLy8gYWthLiAweDdGRkZGRkZGIG9yIDJeMzEtMVxuXG5cdC8qKiBCb290c3RyaW5nIHBhcmFtZXRlcnMgKi9cblx0YmFzZSA9IDM2LFxuXHR0TWluID0gMSxcblx0dE1heCA9IDI2LFxuXHRza2V3ID0gMzgsXG5cdGRhbXAgPSA3MDAsXG5cdGluaXRpYWxCaWFzID0gNzIsXG5cdGluaXRpYWxOID0gMTI4LCAvLyAweDgwXG5cdGRlbGltaXRlciA9ICctJywgLy8gJ1xceDJEJ1xuXG5cdC8qKiBSZWd1bGFyIGV4cHJlc3Npb25zICovXG5cdHJlZ2V4UHVueWNvZGUgPSAvXnhuLS0vLFxuXHRyZWdleE5vbkFTQ0lJID0gL1teXFx4MjAtXFx4N0VdLywgLy8gdW5wcmludGFibGUgQVNDSUkgY2hhcnMgKyBub24tQVNDSUkgY2hhcnNcblx0cmVnZXhTZXBhcmF0b3JzID0gL1tcXHgyRVxcdTMwMDJcXHVGRjBFXFx1RkY2MV0vZywgLy8gUkZDIDM0OTAgc2VwYXJhdG9yc1xuXG5cdC8qKiBFcnJvciBtZXNzYWdlcyAqL1xuXHRlcnJvcnMgPSB7XG5cdFx0J292ZXJmbG93JzogJ092ZXJmbG93OiBpbnB1dCBuZWVkcyB3aWRlciBpbnRlZ2VycyB0byBwcm9jZXNzJyxcblx0XHQnbm90LWJhc2ljJzogJ0lsbGVnYWwgaW5wdXQgPj0gMHg4MCAobm90IGEgYmFzaWMgY29kZSBwb2ludCknLFxuXHRcdCdpbnZhbGlkLWlucHV0JzogJ0ludmFsaWQgaW5wdXQnXG5cdH0sXG5cblx0LyoqIENvbnZlbmllbmNlIHNob3J0Y3V0cyAqL1xuXHRiYXNlTWludXNUTWluID0gYmFzZSAtIHRNaW4sXG5cdGZsb29yID0gTWF0aC5mbG9vcixcblx0c3RyaW5nRnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZSxcblxuXHQvKiogVGVtcG9yYXJ5IHZhcmlhYmxlICovXG5cdGtleTtcblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGVycm9yIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFRoZSBlcnJvciB0eXBlLlxuXHQgKiBAcmV0dXJucyB7RXJyb3J9IFRocm93cyBhIGBSYW5nZUVycm9yYCB3aXRoIHRoZSBhcHBsaWNhYmxlIGVycm9yIG1lc3NhZ2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBlcnJvcih0eXBlKSB7XG5cdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoZXJyb3JzW3R5cGVdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIGdlbmVyaWMgYEFycmF5I21hcGAgdXRpbGl0eSBmdW5jdGlvbi5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5IGFycmF5XG5cdCAqIGl0ZW0uXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgb2YgdmFsdWVzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG1hcChhcnJheSwgZm4pIHtcblx0XHR2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcdHZhciByZXN1bHQgPSBbXTtcblx0XHR3aGlsZSAobGVuZ3RoLS0pIHtcblx0XHRcdHJlc3VsdFtsZW5ndGhdID0gZm4oYXJyYXlbbGVuZ3RoXSk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHQvKipcblx0ICogQSBzaW1wbGUgYEFycmF5I21hcGAtbGlrZSB3cmFwcGVyIHRvIHdvcmsgd2l0aCBkb21haW4gbmFtZSBzdHJpbmdzIG9yIGVtYWlsXG5cdCAqIGFkZHJlc3Nlcy5cblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiBUaGUgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcy5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgZm9yIGV2ZXJ5XG5cdCAqIGNoYXJhY3Rlci5cblx0ICogQHJldHVybnMge0FycmF5fSBBIG5ldyBzdHJpbmcgb2YgY2hhcmFjdGVycyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2tcblx0ICogZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXBEb21haW4oc3RyaW5nLCBmbikge1xuXHRcdHZhciBwYXJ0cyA9IHN0cmluZy5zcGxpdCgnQCcpO1xuXHRcdHZhciByZXN1bHQgPSAnJztcblx0XHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xuXHRcdFx0Ly8gSW4gZW1haWwgYWRkcmVzc2VzLCBvbmx5IHRoZSBkb21haW4gbmFtZSBzaG91bGQgYmUgcHVueWNvZGVkLiBMZWF2ZVxuXHRcdFx0Ly8gdGhlIGxvY2FsIHBhcnQgKGkuZS4gZXZlcnl0aGluZyB1cCB0byBgQGApIGludGFjdC5cblx0XHRcdHJlc3VsdCA9IHBhcnRzWzBdICsgJ0AnO1xuXHRcdFx0c3RyaW5nID0gcGFydHNbMV07XG5cdFx0fVxuXHRcdC8vIEF2b2lkIGBzcGxpdChyZWdleClgIGZvciBJRTggY29tcGF0aWJpbGl0eS4gU2VlICMxNy5cblx0XHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShyZWdleFNlcGFyYXRvcnMsICdcXHgyRScpO1xuXHRcdHZhciBsYWJlbHMgPSBzdHJpbmcuc3BsaXQoJy4nKTtcblx0XHR2YXIgZW5jb2RlZCA9IG1hcChsYWJlbHMsIGZuKS5qb2luKCcuJyk7XG5cdFx0cmV0dXJuIHJlc3VsdCArIGVuY29kZWQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBudW1lcmljIGNvZGUgcG9pbnRzIG9mIGVhY2ggVW5pY29kZVxuXHQgKiBjaGFyYWN0ZXIgaW4gdGhlIHN0cmluZy4gV2hpbGUgSmF2YVNjcmlwdCB1c2VzIFVDUy0yIGludGVybmFsbHksXG5cdCAqIHRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IGEgcGFpciBvZiBzdXJyb2dhdGUgaGFsdmVzIChlYWNoIG9mIHdoaWNoXG5cdCAqIFVDUy0yIGV4cG9zZXMgYXMgc2VwYXJhdGUgY2hhcmFjdGVycykgaW50byBhIHNpbmdsZSBjb2RlIHBvaW50LFxuXHQgKiBtYXRjaGluZyBVVEYtMTYuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZW5jb2RlYFxuXHQgKiBAc2VlIDxodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZGVjb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgVGhlIFVuaWNvZGUgaW5wdXQgc3RyaW5nIChVQ1MtMikuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIG5ldyBhcnJheSBvZiBjb2RlIHBvaW50cy5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJkZWNvZGUoc3RyaW5nKSB7XG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBjb3VudGVyID0gMCxcblx0XHQgICAgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcblx0XHQgICAgdmFsdWUsXG5cdFx0ICAgIGV4dHJhO1xuXHRcdHdoaWxlIChjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHR2YWx1ZSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBjb3VudGVyIDwgbGVuZ3RoKSB7XG5cdFx0XHRcdC8vIGhpZ2ggc3Vycm9nYXRlLCBhbmQgdGhlcmUgaXMgYSBuZXh0IGNoYXJhY3RlclxuXHRcdFx0XHRleHRyYSA9IHN0cmluZy5jaGFyQ29kZUF0KGNvdW50ZXIrKyk7XG5cdFx0XHRcdGlmICgoZXh0cmEgJiAweEZDMDApID09IDB4REMwMCkgeyAvLyBsb3cgc3Vycm9nYXRlXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goKCh2YWx1ZSAmIDB4M0ZGKSA8PCAxMCkgKyAoZXh0cmEgJiAweDNGRikgKyAweDEwMDAwKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyB1bm1hdGNoZWQgc3Vycm9nYXRlOyBvbmx5IGFwcGVuZCB0aGlzIGNvZGUgdW5pdCwgaW4gY2FzZSB0aGUgbmV4dFxuXHRcdFx0XHRcdC8vIGNvZGUgdW5pdCBpcyB0aGUgaGlnaCBzdXJyb2dhdGUgb2YgYSBzdXJyb2dhdGUgcGFpclxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdFx0XHRjb3VudGVyLS07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgc3RyaW5nIGJhc2VkIG9uIGFuIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEBzZWUgYHB1bnljb2RlLnVjczIuZGVjb2RlYFxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuXHQgKiBAbmFtZSBlbmNvZGVcblx0ICogQHBhcmFtIHtBcnJheX0gY29kZVBvaW50cyBUaGUgYXJyYXkgb2YgbnVtZXJpYyBjb2RlIHBvaW50cy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIG5ldyBVbmljb2RlIHN0cmluZyAoVUNTLTIpLlxuXHQgKi9cblx0ZnVuY3Rpb24gdWNzMmVuY29kZShhcnJheSkge1xuXHRcdHJldHVybiBtYXAoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHR2YXIgb3V0cHV0ID0gJyc7XG5cdFx0XHRpZiAodmFsdWUgPiAweEZGRkYpIHtcblx0XHRcdFx0dmFsdWUgLT0gMHgxMDAwMDtcblx0XHRcdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMCk7XG5cdFx0XHRcdHZhbHVlID0gMHhEQzAwIHwgdmFsdWUgJiAweDNGRjtcblx0XHRcdH1cblx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUpO1xuXHRcdFx0cmV0dXJuIG91dHB1dDtcblx0XHR9KS5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGJhc2ljIGNvZGUgcG9pbnQgaW50byBhIGRpZ2l0L2ludGVnZXIuXG5cdCAqIEBzZWUgYGRpZ2l0VG9CYXNpYygpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gY29kZVBvaW50IFRoZSBiYXNpYyBudW1lcmljIGNvZGUgcG9pbnQgdmFsdWUuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludCAoZm9yIHVzZSBpblxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGluIHRoZSByYW5nZSBgMGAgdG8gYGJhc2UgLSAxYCwgb3IgYGJhc2VgIGlmXG5cdCAqIHRoZSBjb2RlIHBvaW50IGRvZXMgbm90IHJlcHJlc2VudCBhIHZhbHVlLlxuXHQgKi9cblx0ZnVuY3Rpb24gYmFzaWNUb0RpZ2l0KGNvZGVQb2ludCkge1xuXHRcdGlmIChjb2RlUG9pbnQgLSA0OCA8IDEwKSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gMjI7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA2NSA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gNjU7XG5cdFx0fVxuXHRcdGlmIChjb2RlUG9pbnQgLSA5NyA8IDI2KSB7XG5cdFx0XHRyZXR1cm4gY29kZVBvaW50IC0gOTc7XG5cdFx0fVxuXHRcdHJldHVybiBiYXNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgZGlnaXQvaW50ZWdlciBpbnRvIGEgYmFzaWMgY29kZSBwb2ludC5cblx0ICogQHNlZSBgYmFzaWNUb0RpZ2l0KClgXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBkaWdpdCBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBiYXNpYyBjb2RlIHBvaW50IHdob3NlIHZhbHVlICh3aGVuIHVzZWQgZm9yXG5cdCAqIHJlcHJlc2VudGluZyBpbnRlZ2VycykgaXMgYGRpZ2l0YCwgd2hpY2ggbmVlZHMgdG8gYmUgaW4gdGhlIHJhbmdlXG5cdCAqIGAwYCB0byBgYmFzZSAtIDFgLiBJZiBgZmxhZ2AgaXMgbm9uLXplcm8sIHRoZSB1cHBlcmNhc2UgZm9ybSBpc1xuXHQgKiB1c2VkOyBlbHNlLCB0aGUgbG93ZXJjYXNlIGZvcm0gaXMgdXNlZC4gVGhlIGJlaGF2aW9yIGlzIHVuZGVmaW5lZFxuXHQgKiBpZiBgZmxhZ2AgaXMgbm9uLXplcm8gYW5kIGBkaWdpdGAgaGFzIG5vIHVwcGVyY2FzZSBmb3JtLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlnaXRUb0Jhc2ljKGRpZ2l0LCBmbGFnKSB7XG5cdFx0Ly8gIDAuLjI1IG1hcCB0byBBU0NJSSBhLi56IG9yIEEuLlpcblx0XHQvLyAyNi4uMzUgbWFwIHRvIEFTQ0lJIDAuLjlcblx0XHRyZXR1cm4gZGlnaXQgKyAyMiArIDc1ICogKGRpZ2l0IDwgMjYpIC0gKChmbGFnICE9IDApIDw8IDUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpYXMgYWRhcHRhdGlvbiBmdW5jdGlvbiBhcyBwZXIgc2VjdGlvbiAzLjQgb2YgUkZDIDM0OTIuXG5cdCAqIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNDkyI3NlY3Rpb24tMy40XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBhZGFwdChkZWx0YSwgbnVtUG9pbnRzLCBmaXJzdFRpbWUpIHtcblx0XHR2YXIgayA9IDA7XG5cdFx0ZGVsdGEgPSBmaXJzdFRpbWUgPyBmbG9vcihkZWx0YSAvIGRhbXApIDogZGVsdGEgPj4gMTtcblx0XHRkZWx0YSArPSBmbG9vcihkZWx0YSAvIG51bVBvaW50cyk7XG5cdFx0Zm9yICgvKiBubyBpbml0aWFsaXphdGlvbiAqLzsgZGVsdGEgPiBiYXNlTWludXNUTWluICogdE1heCA+PiAxOyBrICs9IGJhc2UpIHtcblx0XHRcdGRlbHRhID0gZmxvb3IoZGVsdGEgLyBiYXNlTWludXNUTWluKTtcblx0XHR9XG5cdFx0cmV0dXJuIGZsb29yKGsgKyAoYmFzZU1pbnVzVE1pbiArIDEpICogZGVsdGEgLyAoZGVsdGEgKyBza2V3KSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzIHRvIGEgc3RyaW5nIG9mIFVuaWNvZGVcblx0ICogc3ltYm9scy5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIHJlc3VsdGluZyBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG5cdFx0Ly8gRG9uJ3QgdXNlIFVDUy0yXG5cdFx0dmFyIG91dHB1dCA9IFtdLFxuXHRcdCAgICBpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aCxcblx0XHQgICAgb3V0LFxuXHRcdCAgICBpID0gMCxcblx0XHQgICAgbiA9IGluaXRpYWxOLFxuXHRcdCAgICBiaWFzID0gaW5pdGlhbEJpYXMsXG5cdFx0ICAgIGJhc2ljLFxuXHRcdCAgICBqLFxuXHRcdCAgICBpbmRleCxcblx0XHQgICAgb2xkaSxcblx0XHQgICAgdyxcblx0XHQgICAgayxcblx0XHQgICAgZGlnaXQsXG5cdFx0ICAgIHQsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBiYXNlTWludXNUO1xuXG5cdFx0Ly8gSGFuZGxlIHRoZSBiYXNpYyBjb2RlIHBvaW50czogbGV0IGBiYXNpY2AgYmUgdGhlIG51bWJlciBvZiBpbnB1dCBjb2RlXG5cdFx0Ly8gcG9pbnRzIGJlZm9yZSB0aGUgbGFzdCBkZWxpbWl0ZXIsIG9yIGAwYCBpZiB0aGVyZSBpcyBub25lLCB0aGVuIGNvcHlcblx0XHQvLyB0aGUgZmlyc3QgYmFzaWMgY29kZSBwb2ludHMgdG8gdGhlIG91dHB1dC5cblxuXHRcdGJhc2ljID0gaW5wdXQubGFzdEluZGV4T2YoZGVsaW1pdGVyKTtcblx0XHRpZiAoYmFzaWMgPCAwKSB7XG5cdFx0XHRiYXNpYyA9IDA7XG5cdFx0fVxuXG5cdFx0Zm9yIChqID0gMDsgaiA8IGJhc2ljOyArK2opIHtcblx0XHRcdC8vIGlmIGl0J3Mgbm90IGEgYmFzaWMgY29kZSBwb2ludFxuXHRcdFx0aWYgKGlucHV0LmNoYXJDb2RlQXQoaikgPj0gMHg4MCkge1xuXHRcdFx0XHRlcnJvcignbm90LWJhc2ljJyk7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQucHVzaChpbnB1dC5jaGFyQ29kZUF0KGopKTtcblx0XHR9XG5cblx0XHQvLyBNYWluIGRlY29kaW5nIGxvb3A6IHN0YXJ0IGp1c3QgYWZ0ZXIgdGhlIGxhc3QgZGVsaW1pdGVyIGlmIGFueSBiYXNpYyBjb2RlXG5cdFx0Ly8gcG9pbnRzIHdlcmUgY29waWVkOyBzdGFydCBhdCB0aGUgYmVnaW5uaW5nIG90aGVyd2lzZS5cblxuXHRcdGZvciAoaW5kZXggPSBiYXNpYyA+IDAgPyBiYXNpYyArIDEgOiAwOyBpbmRleCA8IGlucHV0TGVuZ3RoOyAvKiBubyBmaW5hbCBleHByZXNzaW9uICovKSB7XG5cblx0XHRcdC8vIGBpbmRleGAgaXMgdGhlIGluZGV4IG9mIHRoZSBuZXh0IGNoYXJhY3RlciB0byBiZSBjb25zdW1lZC5cblx0XHRcdC8vIERlY29kZSBhIGdlbmVyYWxpemVkIHZhcmlhYmxlLWxlbmd0aCBpbnRlZ2VyIGludG8gYGRlbHRhYCxcblx0XHRcdC8vIHdoaWNoIGdldHMgYWRkZWQgdG8gYGlgLiBUaGUgb3ZlcmZsb3cgY2hlY2tpbmcgaXMgZWFzaWVyXG5cdFx0XHQvLyBpZiB3ZSBpbmNyZWFzZSBgaWAgYXMgd2UgZ28sIHRoZW4gc3VidHJhY3Qgb2ZmIGl0cyBzdGFydGluZ1xuXHRcdFx0Ly8gdmFsdWUgYXQgdGhlIGVuZCB0byBvYnRhaW4gYGRlbHRhYC5cblx0XHRcdGZvciAob2xkaSA9IGksIHcgPSAxLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblxuXHRcdFx0XHRpZiAoaW5kZXggPj0gaW5wdXRMZW5ndGgpIHtcblx0XHRcdFx0XHRlcnJvcignaW52YWxpZC1pbnB1dCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGlnaXQgPSBiYXNpY1RvRGlnaXQoaW5wdXQuY2hhckNvZGVBdChpbmRleCsrKSk7XG5cblx0XHRcdFx0aWYgKGRpZ2l0ID49IGJhc2UgfHwgZGlnaXQgPiBmbG9vcigobWF4SW50IC0gaSkgLyB3KSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aSArPSBkaWdpdCAqIHc7XG5cdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA8IHQpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0aWYgKHcgPiBmbG9vcihtYXhJbnQgLyBiYXNlTWludXNUKSkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dyAqPSBiYXNlTWludXNUO1xuXG5cdFx0XHR9XG5cblx0XHRcdG91dCA9IG91dHB1dC5sZW5ndGggKyAxO1xuXHRcdFx0YmlhcyA9IGFkYXB0KGkgLSBvbGRpLCBvdXQsIG9sZGkgPT0gMCk7XG5cblx0XHRcdC8vIGBpYCB3YXMgc3VwcG9zZWQgdG8gd3JhcCBhcm91bmQgZnJvbSBgb3V0YCB0byBgMGAsXG5cdFx0XHQvLyBpbmNyZW1lbnRpbmcgYG5gIGVhY2ggdGltZSwgc28gd2UnbGwgZml4IHRoYXQgbm93OlxuXHRcdFx0aWYgKGZsb29yKGkgLyBvdXQpID4gbWF4SW50IC0gbikge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0biArPSBmbG9vcihpIC8gb3V0KTtcblx0XHRcdGkgJT0gb3V0O1xuXG5cdFx0XHQvLyBJbnNlcnQgYG5gIGF0IHBvc2l0aW9uIGBpYCBvZiB0aGUgb3V0cHV0XG5cdFx0XHRvdXRwdXQuc3BsaWNlKGkrKywgMCwgbik7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdWNzMmVuY29kZShvdXRwdXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scyAoZS5nLiBhIGRvbWFpbiBuYW1lIGxhYmVsKSB0byBhXG5cdCAqIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGVuY29kZShpbnB1dCkge1xuXHRcdHZhciBuLFxuXHRcdCAgICBkZWx0YSxcblx0XHQgICAgaGFuZGxlZENQQ291bnQsXG5cdFx0ICAgIGJhc2ljTGVuZ3RoLFxuXHRcdCAgICBiaWFzLFxuXHRcdCAgICBqLFxuXHRcdCAgICBtLFxuXHRcdCAgICBxLFxuXHRcdCAgICBrLFxuXHRcdCAgICB0LFxuXHRcdCAgICBjdXJyZW50VmFsdWUsXG5cdFx0ICAgIG91dHB1dCA9IFtdLFxuXHRcdCAgICAvKiogYGlucHV0TGVuZ3RoYCB3aWxsIGhvbGQgdGhlIG51bWJlciBvZiBjb2RlIHBvaW50cyBpbiBgaW5wdXRgLiAqL1xuXHRcdCAgICBpbnB1dExlbmd0aCxcblx0XHQgICAgLyoqIENhY2hlZCBjYWxjdWxhdGlvbiByZXN1bHRzICovXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50UGx1c09uZSxcblx0XHQgICAgYmFzZU1pbnVzVCxcblx0XHQgICAgcU1pbnVzVDtcblxuXHRcdC8vIENvbnZlcnQgdGhlIGlucHV0IGluIFVDUy0yIHRvIFVuaWNvZGVcblx0XHRpbnB1dCA9IHVjczJkZWNvZGUoaW5wdXQpO1xuXG5cdFx0Ly8gQ2FjaGUgdGhlIGxlbmd0aFxuXHRcdGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgc3RhdGVcblx0XHRuID0gaW5pdGlhbE47XG5cdFx0ZGVsdGEgPSAwO1xuXHRcdGJpYXMgPSBpbml0aWFsQmlhcztcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHNcblx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgMHg4MCkge1xuXHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoY3VycmVudFZhbHVlKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aGFuZGxlZENQQ291bnQgPSBiYXNpY0xlbmd0aCA9IG91dHB1dC5sZW5ndGg7XG5cblx0XHQvLyBgaGFuZGxlZENQQ291bnRgIGlzIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgdGhhdCBoYXZlIGJlZW4gaGFuZGxlZDtcblx0XHQvLyBgYmFzaWNMZW5ndGhgIGlzIHRoZSBudW1iZXIgb2YgYmFzaWMgY29kZSBwb2ludHMuXG5cblx0XHQvLyBGaW5pc2ggdGhlIGJhc2ljIHN0cmluZyAtIGlmIGl0IGlzIG5vdCBlbXB0eSAtIHdpdGggYSBkZWxpbWl0ZXJcblx0XHRpZiAoYmFzaWNMZW5ndGgpIHtcblx0XHRcdG91dHB1dC5wdXNoKGRlbGltaXRlcik7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBlbmNvZGluZyBsb29wOlxuXHRcdHdoaWxlIChoYW5kbGVkQ1BDb3VudCA8IGlucHV0TGVuZ3RoKSB7XG5cblx0XHRcdC8vIEFsbCBub24tYmFzaWMgY29kZSBwb2ludHMgPCBuIGhhdmUgYmVlbiBoYW5kbGVkIGFscmVhZHkuIEZpbmQgdGhlIG5leHRcblx0XHRcdC8vIGxhcmdlciBvbmU6XG5cdFx0XHRmb3IgKG0gPSBtYXhJbnQsIGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA+PSBuICYmIGN1cnJlbnRWYWx1ZSA8IG0pIHtcblx0XHRcdFx0XHRtID0gY3VycmVudFZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEluY3JlYXNlIGBkZWx0YWAgZW5vdWdoIHRvIGFkdmFuY2UgdGhlIGRlY29kZXIncyA8bixpPiBzdGF0ZSB0byA8bSwwPixcblx0XHRcdC8vIGJ1dCBndWFyZCBhZ2FpbnN0IG92ZXJmbG93XG5cdFx0XHRoYW5kbGVkQ1BDb3VudFBsdXNPbmUgPSBoYW5kbGVkQ1BDb3VudCArIDE7XG5cdFx0XHRpZiAobSAtIG4gPiBmbG9vcigobWF4SW50IC0gZGVsdGEpIC8gaGFuZGxlZENQQ291bnRQbHVzT25lKSkge1xuXHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsdGEgKz0gKG0gLSBuKSAqIGhhbmRsZWRDUENvdW50UGx1c09uZTtcblx0XHRcdG4gPSBtO1xuXG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgaW5wdXRMZW5ndGg7ICsraikge1xuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBpbnB1dFtqXTtcblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlIDwgbiAmJiArK2RlbHRhID4gbWF4SW50KSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY3VycmVudFZhbHVlID09IG4pIHtcblx0XHRcdFx0XHQvLyBSZXByZXNlbnQgZGVsdGEgYXMgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlclxuXHRcdFx0XHRcdGZvciAocSA9IGRlbHRhLCBrID0gYmFzZTsgLyogbm8gY29uZGl0aW9uICovOyBrICs9IGJhc2UpIHtcblx0XHRcdFx0XHRcdHQgPSBrIDw9IGJpYXMgPyB0TWluIDogKGsgPj0gYmlhcyArIHRNYXggPyB0TWF4IDogayAtIGJpYXMpO1xuXHRcdFx0XHRcdFx0aWYgKHEgPCB0KSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cU1pbnVzVCA9IHEgLSB0O1xuXHRcdFx0XHRcdFx0YmFzZU1pbnVzVCA9IGJhc2UgLSB0O1xuXHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goXG5cdFx0XHRcdFx0XHRcdHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWModCArIHFNaW51c1QgJSBiYXNlTWludXNULCAwKSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRxID0gZmxvb3IocU1pbnVzVCAvIGJhc2VNaW51c1QpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKHN0cmluZ0Zyb21DaGFyQ29kZShkaWdpdFRvQmFzaWMocSwgMCkpKTtcblx0XHRcdFx0XHRiaWFzID0gYWRhcHQoZGVsdGEsIGhhbmRsZWRDUENvdW50UGx1c09uZSwgaGFuZGxlZENQQ291bnQgPT0gYmFzaWNMZW5ndGgpO1xuXHRcdFx0XHRcdGRlbHRhID0gMDtcblx0XHRcdFx0XHQrK2hhbmRsZWRDUENvdW50O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdCsrZGVsdGE7XG5cdFx0XHQrK247XG5cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dC5qb2luKCcnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIFB1bnljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzXG5cdCAqIHRvIFVuaWNvZGUuIE9ubHkgdGhlIFB1bnljb2RlZCBwYXJ0cyBvZiB0aGUgaW5wdXQgd2lsbCBiZSBjb252ZXJ0ZWQsIGkuZS5cblx0ICogaXQgZG9lc24ndCBtYXR0ZXIgaWYgeW91IGNhbGwgaXQgb24gYSBzdHJpbmcgdGhhdCBoYXMgYWxyZWFkeSBiZWVuXG5cdCAqIGNvbnZlcnRlZCB0byBVbmljb2RlLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBQdW55Y29kZWQgZG9tYWluIG5hbWUgb3IgZW1haWwgYWRkcmVzcyB0b1xuXHQgKiBjb252ZXJ0IHRvIFVuaWNvZGUuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBVbmljb2RlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBQdW55Y29kZVxuXHQgKiBzdHJpbmcuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b1VuaWNvZGUoaW5wdXQpIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleFB1bnljb2RlLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/IGRlY29kZShzdHJpbmcuc2xpY2UoNCkudG9Mb3dlckNhc2UoKSlcblx0XHRcdFx0OiBzdHJpbmc7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBVbmljb2RlIHN0cmluZyByZXByZXNlbnRpbmcgYSBkb21haW4gbmFtZSBvciBhbiBlbWFpbCBhZGRyZXNzIHRvXG5cdCAqIFB1bnljb2RlLiBPbmx5IHRoZSBub24tQVNDSUkgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHdpbGwgYmUgY29udmVydGVkLFxuXHQgKiBpLmUuIGl0IGRvZXNuJ3QgbWF0dGVyIGlmIHlvdSBjYWxsIGl0IHdpdGggYSBkb21haW4gdGhhdCdzIGFscmVhZHkgaW5cblx0ICogQVNDSUkuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MgdG8gY29udmVydCwgYXMgYVxuXHQgKiBVbmljb2RlIHN0cmluZy5cblx0ICogQHJldHVybnMge1N0cmluZ30gVGhlIFB1bnljb2RlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBkb21haW4gbmFtZSBvclxuXHQgKiBlbWFpbCBhZGRyZXNzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9BU0NJSShpbnB1dCkge1xuXHRcdHJldHVybiBtYXBEb21haW4oaW5wdXQsIGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0cmV0dXJuIHJlZ2V4Tm9uQVNDSUkudGVzdChzdHJpbmcpXG5cdFx0XHRcdD8gJ3huLS0nICsgZW5jb2RlKHN0cmluZylcblx0XHRcdFx0OiBzdHJpbmc7XG5cdFx0fSk7XG5cdH1cblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHQvKiogRGVmaW5lIHRoZSBwdWJsaWMgQVBJICovXG5cdHB1bnljb2RlID0ge1xuXHRcdC8qKlxuXHRcdCAqIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBQdW55Y29kZS5qcyB2ZXJzaW9uIG51bWJlci5cblx0XHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0XHQgKiBAdHlwZSBTdHJpbmdcblx0XHQgKi9cblx0XHQndmVyc2lvbic6ICcxLjQuMScsXG5cdFx0LyoqXG5cdFx0ICogQW4gb2JqZWN0IG9mIG1ldGhvZHMgdG8gY29udmVydCBmcm9tIEphdmFTY3JpcHQncyBpbnRlcm5hbCBjaGFyYWN0ZXJcblx0XHQgKiByZXByZXNlbnRhdGlvbiAoVUNTLTIpIHRvIFVuaWNvZGUgY29kZSBwb2ludHMsIGFuZCBiYWNrLlxuXHRcdCAqIEBzZWUgPGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nPlxuXHRcdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHRcdCAqIEB0eXBlIE9iamVjdFxuXHRcdCAqL1xuXHRcdCd1Y3MyJzoge1xuXHRcdFx0J2RlY29kZSc6IHVjczJkZWNvZGUsXG5cdFx0XHQnZW5jb2RlJzogdWNzMmVuY29kZVxuXHRcdH0sXG5cdFx0J2RlY29kZSc6IGRlY29kZSxcblx0XHQnZW5jb2RlJzogZW5jb2RlLFxuXHRcdCd0b0FTQ0lJJzogdG9BU0NJSSxcblx0XHQndG9Vbmljb2RlJzogdG9Vbmljb2RlXG5cdH07XG5cblx0LyoqIEV4cG9zZSBgcHVueWNvZGVgICovXG5cdC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIHNwZWNpZmljIGNvbmRpdGlvbiBwYXR0ZXJuc1xuXHQvLyBsaWtlIHRoZSBmb2xsb3dpbmc6XG5cdGlmIChcblx0XHR0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJlxuXHRcdGRlZmluZS5hbWRcblx0KSB7XG5cdFx0ZGVmaW5lKCdwdW55Y29kZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHB1bnljb2RlO1xuXHRcdH0pO1xuXHR9IGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcblx0XHRpZiAobW9kdWxlLmV4cG9ydHMgPT0gZnJlZUV4cG9ydHMpIHtcblx0XHRcdC8vIGluIE5vZGUuanMsIGlvLmpzLCBvciBSaW5nb0pTIHYwLjguMCtcblx0XHRcdGZyZWVNb2R1bGUuZXhwb3J0cyA9IHB1bnljb2RlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBpbiBOYXJ3aGFsIG9yIFJpbmdvSlMgdjAuNy4wLVxuXHRcdFx0Zm9yIChrZXkgaW4gcHVueWNvZGUpIHtcblx0XHRcdFx0cHVueWNvZGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAoZnJlZUV4cG9ydHNba2V5XSA9IHB1bnljb2RlW2tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvLyBpbiBSaGlubyBvciBhIHdlYiBicm93c2VyXG5cdFx0cm9vdC5wdW55Y29kZSA9IHB1bnljb2RlO1xuXHR9XG5cbn0odGhpcykpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnlQcmltaXRpdmUgPSBmdW5jdGlvbih2KSB7XG4gIHN3aXRjaCAodHlwZW9mIHYpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHY7XG5cbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2ID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gaXNGaW5pdGUodikgPyB2IDogJyc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwgc2VwLCBlcSwgbmFtZSkge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIG9iaiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBtYXAob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihrKSB7XG4gICAgICB2YXIga3MgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuICAgICAgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgICByZXR1cm4gbWFwKG9ialtrXSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuZnVuY3Rpb24gbWFwICh4cywgZikge1xuICBpZiAoeHMubWFwKSByZXR1cm4geHMubWFwKGYpO1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICByZXMucHVzaChmKHhzW2ldLCBpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG4iLCJ2YXIgcmFuZG9tID0gcmVxdWlyZShcInJuZFwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb2xvcjtcblxuZnVuY3Rpb24gY29sb3IgKG1heCwgbWluKSB7XG4gIG1heCB8fCAobWF4ID0gMjU1KTtcbiAgcmV0dXJuICdyZ2IoJyArIHJhbmRvbShtYXgsIG1pbikgKyAnLCAnICsgcmFuZG9tKG1heCwgbWluKSArICcsICcgKyByYW5kb20obWF4LCBtaW4pICsgJyknO1xufVxuIiwidmFyIHJlbGF0aXZlRGF0ZSA9IChmdW5jdGlvbih1bmRlZmluZWQpe1xuXG4gIHZhciBTRUNPTkQgPSAxMDAwLFxuICAgICAgTUlOVVRFID0gNjAgKiBTRUNPTkQsXG4gICAgICBIT1VSID0gNjAgKiBNSU5VVEUsXG4gICAgICBEQVkgPSAyNCAqIEhPVVIsXG4gICAgICBXRUVLID0gNyAqIERBWSxcbiAgICAgIFlFQVIgPSBEQVkgKiAzNjUsXG4gICAgICBNT05USCA9IFlFQVIgLyAxMjtcblxuICB2YXIgZm9ybWF0cyA9IFtcbiAgICBbIDAuNyAqIE1JTlVURSwgJ2p1c3Qgbm93JyBdLFxuICAgIFsgMS41ICogTUlOVVRFLCAnYSBtaW51dGUgYWdvJyBdLFxuICAgIFsgNjAgKiBNSU5VVEUsICdtaW51dGVzIGFnbycsIE1JTlVURSBdLFxuICAgIFsgMS41ICogSE9VUiwgJ2FuIGhvdXIgYWdvJyBdLFxuICAgIFsgREFZLCAnaG91cnMgYWdvJywgSE9VUiBdLFxuICAgIFsgMiAqIERBWSwgJ3llc3RlcmRheScgXSxcbiAgICBbIDcgKiBEQVksICdkYXlzIGFnbycsIERBWSBdLFxuICAgIFsgMS41ICogV0VFSywgJ2Egd2VlayBhZ28nXSxcbiAgICBbIE1PTlRILCAnd2Vla3MgYWdvJywgV0VFSyBdLFxuICAgIFsgMS41ICogTU9OVEgsICdhIG1vbnRoIGFnbycgXSxcbiAgICBbIFlFQVIsICdtb250aHMgYWdvJywgTU9OVEggXSxcbiAgICBbIDEuNSAqIFlFQVIsICdhIHllYXIgYWdvJyBdLFxuICAgIFsgTnVtYmVyLk1BWF9WQUxVRSwgJ3llYXJzIGFnbycsIFlFQVIgXVxuICBdO1xuXG4gIGZ1bmN0aW9uIHJlbGF0aXZlRGF0ZShpbnB1dCxyZWZlcmVuY2Upe1xuICAgICFyZWZlcmVuY2UgJiYgKCByZWZlcmVuY2UgPSAobmV3IERhdGUpLmdldFRpbWUoKSApO1xuICAgIHJlZmVyZW5jZSBpbnN0YW5jZW9mIERhdGUgJiYgKCByZWZlcmVuY2UgPSByZWZlcmVuY2UuZ2V0VGltZSgpICk7XG4gICAgaW5wdXQgaW5zdGFuY2VvZiBEYXRlICYmICggaW5wdXQgPSBpbnB1dC5nZXRUaW1lKCkgKTtcbiAgICBcbiAgICB2YXIgZGVsdGEgPSByZWZlcmVuY2UgLSBpbnB1dCxcbiAgICAgICAgZm9ybWF0LCBpLCBsZW47XG5cbiAgICBmb3IoaSA9IC0xLCBsZW49Zm9ybWF0cy5sZW5ndGg7ICsraSA8IGxlbjsgKXtcbiAgICAgIGZvcm1hdCA9IGZvcm1hdHNbaV07XG4gICAgICBpZihkZWx0YSA8IGZvcm1hdFswXSl7XG4gICAgICAgIHJldHVybiBmb3JtYXRbMl0gPT0gdW5kZWZpbmVkID8gZm9ybWF0WzFdIDogTWF0aC5yb3VuZChkZWx0YS9mb3JtYXRbMl0pICsgJyAnICsgZm9ybWF0WzFdO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gcmVsYXRpdmVEYXRlO1xuXG59KSgpO1xuXG5pZih0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKXtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZWxhdGl2ZURhdGU7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJhbmRvbTtcblxuZnVuY3Rpb24gcmFuZG9tIChtYXgsIG1pbikge1xuICBtYXggfHwgKG1heCA9IDk5OTk5OTk5OTk5OSk7XG4gIG1pbiB8fCAobWluID0gMCk7XG5cbiAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKTtcbn1cbiIsIlxubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdhJyxcbiAgJ2FuJyxcbiAgJ2FuZCcsXG4gICdhcycsXG4gICdhdCcsXG4gICdidXQnLFxuICAnYnknLFxuICAnZW4nLFxuICAnZm9yJyxcbiAgJ2Zyb20nLFxuICAnaG93JyxcbiAgJ2lmJyxcbiAgJ2luJyxcbiAgJ25laXRoZXInLFxuICAnbm9yJyxcbiAgJ29mJyxcbiAgJ29uJyxcbiAgJ29ubHknLFxuICAnb250bycsXG4gICdvdXQnLFxuICAnb3InLFxuICAncGVyJyxcbiAgJ3NvJyxcbiAgJ3RoYW4nLFxuICAndGhhdCcsXG4gICd0aGUnLFxuICAndG8nLFxuICAndW50aWwnLFxuICAndXAnLFxuICAndXBvbicsXG4gICd2JyxcbiAgJ3YuJyxcbiAgJ3ZlcnN1cycsXG4gICd2cycsXG4gICd2cy4nLFxuICAndmlhJyxcbiAgJ3doZW4nLFxuICAnd2l0aCcsXG4gICd3aXRob3V0JyxcbiAgJ3lldCdcbl07IiwidmFyIHRvVGl0bGUgPSByZXF1aXJlKFwidG8tdGl0bGVcIilcblxubW9kdWxlLmV4cG9ydHMgPSB1cmxUb1RpdGxlXG5cbmZ1bmN0aW9uIHVybFRvVGl0bGUodXJsKSB7XG4gIHVybCA9IHVuZXNjYXBlKHVybCkucmVwbGFjZSgvXy9nLCBcIiBcIilcbiAgdXJsID0gdXJsLnJlcGxhY2UoL15cXHcrOlxcL1xcLy8sIFwiXCIpXG4gIHVybCA9IHVybC5yZXBsYWNlKC9ed3d3XFwuLywgXCJcIilcbiAgdXJsID0gdXJsLnJlcGxhY2UoLyhcXC98XFw/KSQvLCBcIlwiKVxuXG4gIHZhciBwYXJ0cyA9IHVybC5zcGxpdChcIj9cIilcbiAgdXJsID0gcGFydHNbMF1cbiAgdXJsID0gdXJsLnJlcGxhY2UoL1xcLlxcdyskLywgXCJcIilcblxuICBwYXJ0cyA9IHVybC5zcGxpdChcIi9cIilcblxuICB2YXIgbmFtZSA9IHBhcnRzWzBdXG4gIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1xcLlxcdysoXFwvfCQpLywgXCJcIikucmVwbGFjZSgvXFwuKGNvbT98bmV0fG9yZ3xmcikkLywgXCJcIilcblxuICBpZiAocGFydHMubGVuZ3RoID09IDEpIHtcbiAgICByZXR1cm4gdGl0bGUobmFtZSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgdG9UaXRsZShcbiAgICAgIHBhcnRzXG4gICAgICAgIC5zbGljZSgxKVxuICAgICAgICAucmV2ZXJzZSgpXG4gICAgICAgIC5maWx0ZXIoaXNWYWxpZFBhcnQpXG4gICAgICAgIC5tYXAodG9UaXRsZSlcbiAgICAgICAgLmpvaW4oXCIgLSBcIilcbiAgICApICtcbiAgICBcIiBvbiBcIiArXG4gICAgdGl0bGUobmFtZSlcbiAgKVxufVxuXG5mdW5jdGlvbiBpc1ZhbGlkUGFydChwYXJ0KSB7XG4gIHJldHVybiBwYXJ0Lmxlbmd0aCA+IDIgJiYgIS9eWzAtOV0rJC8udGVzdChwYXJ0KVxufVxuXG5mdW5jdGlvbiB0aXRsZShob3N0KSB7XG4gIGlmICgvXltcXHdcXC5cXC1dKzpcXGQrLy50ZXN0KGhvc3QpKSB7XG4gICAgcmV0dXJuIGhvc3RcbiAgfVxuXG4gIHJldHVybiB0b1RpdGxlKFxuICAgIGhvc3RcbiAgICAgIC5zcGxpdChcIi5cIilcbiAgICAgIC5maWx0ZXIoaXNWYWxpZFBhcnQpXG4gICAgICAuam9pbihcIiwgXCIpXG4gIClcbn1cbiIsIlxudmFyIGNsZWFuID0gcmVxdWlyZSgndG8tbm8tY2FzZScpO1xuXG5cbi8qKlxuICogRXhwb3NlIGB0b0NhcGl0YWxDYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvQ2FwaXRhbENhc2U7XG5cblxuLyoqXG4gKiBDb252ZXJ0IGEgYHN0cmluZ2AgdG8gY2FwaXRhbCBjYXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5cbmZ1bmN0aW9uIHRvQ2FwaXRhbENhc2UgKHN0cmluZykge1xuICByZXR1cm4gY2xlYW4oc3RyaW5nKS5yZXBsYWNlKC8oXnxcXHMpKFxcdykvZywgZnVuY3Rpb24gKG1hdGNoZXMsIHByZXZpb3VzLCBsZXR0ZXIpIHtcbiAgICByZXR1cm4gcHJldmlvdXMgKyBsZXR0ZXIudG9VcHBlckNhc2UoKTtcbiAgfSk7XG59IiwiXG4vKipcbiAqIEV4cG9zZSBgdG9Ob0Nhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdG9Ob0Nhc2U7XG5cblxuLyoqXG4gKiBUZXN0IHdoZXRoZXIgYSBzdHJpbmcgaXMgY2FtZWwtY2FzZS5cbiAqL1xuXG52YXIgaGFzU3BhY2UgPSAvXFxzLztcbnZhciBoYXNDYW1lbCA9IC9bYS16XVtBLVpdLztcbnZhciBoYXNTZXBhcmF0b3IgPSAvW1xcV19dLztcblxuXG4vKipcbiAqIFJlbW92ZSBhbnkgc3RhcnRpbmcgY2FzZSBmcm9tIGEgYHN0cmluZ2AsIGxpa2UgY2FtZWwgb3Igc25ha2UsIGJ1dCBrZWVwXG4gKiBzcGFjZXMgYW5kIHB1bmN0dWF0aW9uIHRoYXQgbWF5IGJlIGltcG9ydGFudCBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHRvTm9DYXNlIChzdHJpbmcpIHtcbiAgaWYgKGhhc1NwYWNlLnRlc3Qoc3RyaW5nKSkgcmV0dXJuIHN0cmluZy50b0xvd2VyQ2FzZSgpO1xuXG4gIGlmIChoYXNTZXBhcmF0b3IudGVzdChzdHJpbmcpKSBzdHJpbmcgPSB1bnNlcGFyYXRlKHN0cmluZyk7XG4gIGlmIChoYXNDYW1lbC50ZXN0KHN0cmluZykpIHN0cmluZyA9IHVuY2FtZWxpemUoc3RyaW5nKTtcbiAgcmV0dXJuIHN0cmluZy50b0xvd2VyQ2FzZSgpO1xufVxuXG5cbi8qKlxuICogU2VwYXJhdG9yIHNwbGl0dGVyLlxuICovXG5cbnZhciBzZXBhcmF0b3JTcGxpdHRlciA9IC9bXFxXX10rKC58JCkvZztcblxuXG4vKipcbiAqIFVuLXNlcGFyYXRlIGEgYHN0cmluZ2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHVuc2VwYXJhdGUgKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2Uoc2VwYXJhdG9yU3BsaXR0ZXIsIGZ1bmN0aW9uIChtLCBuZXh0KSB7XG4gICAgcmV0dXJuIG5leHQgPyAnICcgKyBuZXh0IDogJyc7XG4gIH0pO1xufVxuXG5cbi8qKlxuICogQ2FtZWxjYXNlIHNwbGl0dGVyLlxuICovXG5cbnZhciBjYW1lbFNwbGl0dGVyID0gLyguKShbQS1aXSspL2c7XG5cblxuLyoqXG4gKiBVbi1jYW1lbGNhc2UgYSBgc3RyaW5nYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gdW5jYW1lbGl6ZSAoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShjYW1lbFNwbGl0dGVyLCBmdW5jdGlvbiAobSwgcHJldmlvdXMsIHVwcGVycykge1xuICAgIHJldHVybiBwcmV2aW91cyArICcgJyArIHVwcGVycy50b0xvd2VyQ2FzZSgpLnNwbGl0KCcnKS5qb2luKCcgJyk7XG4gIH0pO1xufSIsInZhciBlc2NhcGUgPSByZXF1aXJlKCdlc2NhcGUtcmVnZXhwLWNvbXBvbmVudCcpO1xudmFyIGNhcGl0YWwgPSByZXF1aXJlKCd0by1jYXBpdGFsLWNhc2UnKTtcbnZhciBtaW5vcnMgPSByZXF1aXJlKCd0aXRsZS1jYXNlLW1pbm9ycycpO1xuXG4vKipcbiAqIEV4cG9zZSBgdG9UaXRsZUNhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdG9UaXRsZUNhc2U7XG5cblxuLyoqXG4gKiBNaW5vcnMuXG4gKi9cblxudmFyIGVzY2FwZWQgPSBtaW5vcnMubWFwKGVzY2FwZSk7XG52YXIgbWlub3JNYXRjaGVyID0gbmV3IFJlZ0V4cCgnW15eXVxcXFxiKCcgKyBlc2NhcGVkLmpvaW4oJ3wnKSArICcpXFxcXGInLCAnaWcnKTtcbnZhciBjb2xvbk1hdGNoZXIgPSAvOlxccyooXFx3KS9nO1xuXG5cbi8qKlxuICogQ29udmVydCBhIGBzdHJpbmdgIHRvIGNhbWVsIGNhc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cblxuZnVuY3Rpb24gdG9UaXRsZUNhc2UgKHN0cmluZykge1xuICByZXR1cm4gY2FwaXRhbChzdHJpbmcpXG4gICAgLnJlcGxhY2UobWlub3JNYXRjaGVyLCBmdW5jdGlvbiAobWlub3IpIHtcbiAgICAgIHJldHVybiBtaW5vci50b0xvd2VyQ2FzZSgpO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoY29sb25NYXRjaGVyLCBmdW5jdGlvbiAobGV0dGVyKSB7XG4gICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHVueWNvZGUgPSByZXF1aXJlKCdwdW55Y29kZScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuZXhwb3J0cy5wYXJzZSA9IHVybFBhcnNlO1xuZXhwb3J0cy5yZXNvbHZlID0gdXJsUmVzb2x2ZTtcbmV4cG9ydHMucmVzb2x2ZU9iamVjdCA9IHVybFJlc29sdmVPYmplY3Q7XG5leHBvcnRzLmZvcm1hdCA9IHVybEZvcm1hdDtcblxuZXhwb3J0cy5VcmwgPSBVcmw7XG5cbmZ1bmN0aW9uIFVybCgpIHtcbiAgdGhpcy5wcm90b2NvbCA9IG51bGw7XG4gIHRoaXMuc2xhc2hlcyA9IG51bGw7XG4gIHRoaXMuYXV0aCA9IG51bGw7XG4gIHRoaXMuaG9zdCA9IG51bGw7XG4gIHRoaXMucG9ydCA9IG51bGw7XG4gIHRoaXMuaG9zdG5hbWUgPSBudWxsO1xuICB0aGlzLmhhc2ggPSBudWxsO1xuICB0aGlzLnNlYXJjaCA9IG51bGw7XG4gIHRoaXMucXVlcnkgPSBudWxsO1xuICB0aGlzLnBhdGhuYW1lID0gbnVsbDtcbiAgdGhpcy5wYXRoID0gbnVsbDtcbiAgdGhpcy5ocmVmID0gbnVsbDtcbn1cblxuLy8gUmVmZXJlbmNlOiBSRkMgMzk4NiwgUkZDIDE4MDgsIFJGQyAyMzk2XG5cbi8vIGRlZmluZSB0aGVzZSBoZXJlIHNvIGF0IGxlYXN0IHRoZXkgb25seSBoYXZlIHRvIGJlXG4vLyBjb21waWxlZCBvbmNlIG9uIHRoZSBmaXJzdCBtb2R1bGUgbG9hZC5cbnZhciBwcm90b2NvbFBhdHRlcm4gPSAvXihbYS16MC05ListXSs6KS9pLFxuICAgIHBvcnRQYXR0ZXJuID0gLzpbMC05XSokLyxcblxuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgYSBzaW1wbGUgcGF0aCBVUkxcbiAgICBzaW1wbGVQYXRoUGF0dGVybiA9IC9eKFxcL1xcLz8oPyFcXC8pW15cXD9cXHNdKikoXFw/W15cXHNdKik/JC8sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyByZXNlcnZlZCBmb3IgZGVsaW1pdGluZyBVUkxzLlxuICAgIC8vIFdlIGFjdHVhbGx5IGp1c3QgYXV0by1lc2NhcGUgdGhlc2UuXG4gICAgZGVsaW1zID0gWyc8JywgJz4nLCAnXCInLCAnYCcsICcgJywgJ1xccicsICdcXG4nLCAnXFx0J10sXG5cbiAgICAvLyBSRkMgMjM5NjogY2hhcmFjdGVycyBub3QgYWxsb3dlZCBmb3IgdmFyaW91cyByZWFzb25zLlxuICAgIHVud2lzZSA9IFsneycsICd9JywgJ3wnLCAnXFxcXCcsICdeJywgJ2AnXS5jb25jYXQoZGVsaW1zKSxcblxuICAgIC8vIEFsbG93ZWQgYnkgUkZDcywgYnV0IGNhdXNlIG9mIFhTUyBhdHRhY2tzLiAgQWx3YXlzIGVzY2FwZSB0aGVzZS5cbiAgICBhdXRvRXNjYXBlID0gWydcXCcnXS5jb25jYXQodW53aXNlKSxcbiAgICAvLyBDaGFyYWN0ZXJzIHRoYXQgYXJlIG5ldmVyIGV2ZXIgYWxsb3dlZCBpbiBhIGhvc3RuYW1lLlxuICAgIC8vIE5vdGUgdGhhdCBhbnkgaW52YWxpZCBjaGFycyBhcmUgYWxzbyBoYW5kbGVkLCBidXQgdGhlc2VcbiAgICAvLyBhcmUgdGhlIG9uZXMgdGhhdCBhcmUgKmV4cGVjdGVkKiB0byBiZSBzZWVuLCBzbyB3ZSBmYXN0LXBhdGhcbiAgICAvLyB0aGVtLlxuICAgIG5vbkhvc3RDaGFycyA9IFsnJScsICcvJywgJz8nLCAnOycsICcjJ10uY29uY2F0KGF1dG9Fc2NhcGUpLFxuICAgIGhvc3RFbmRpbmdDaGFycyA9IFsnLycsICc/JywgJyMnXSxcbiAgICBob3N0bmFtZU1heExlbiA9IDI1NSxcbiAgICBob3N0bmFtZVBhcnRQYXR0ZXJuID0gL15bK2EtejAtOUEtWl8tXXswLDYzfSQvLFxuICAgIGhvc3RuYW1lUGFydFN0YXJ0ID0gL14oWythLXowLTlBLVpfLV17MCw2M30pKC4qKSQvLFxuICAgIC8vIHByb3RvY29scyB0aGF0IGNhbiBhbGxvdyBcInVuc2FmZVwiIGFuZCBcInVud2lzZVwiIGNoYXJzLlxuICAgIHVuc2FmZVByb3RvY29sID0ge1xuICAgICAgJ2phdmFzY3JpcHQnOiB0cnVlLFxuICAgICAgJ2phdmFzY3JpcHQ6JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgbmV2ZXIgaGF2ZSBhIGhvc3RuYW1lLlxuICAgIGhvc3RsZXNzUHJvdG9jb2wgPSB7XG4gICAgICAnamF2YXNjcmlwdCc6IHRydWUsXG4gICAgICAnamF2YXNjcmlwdDonOiB0cnVlXG4gICAgfSxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBhbHdheXMgY29udGFpbiBhIC8vIGJpdC5cbiAgICBzbGFzaGVkUHJvdG9jb2wgPSB7XG4gICAgICAnaHR0cCc6IHRydWUsXG4gICAgICAnaHR0cHMnOiB0cnVlLFxuICAgICAgJ2Z0cCc6IHRydWUsXG4gICAgICAnZ29waGVyJzogdHJ1ZSxcbiAgICAgICdmaWxlJzogdHJ1ZSxcbiAgICAgICdodHRwOic6IHRydWUsXG4gICAgICAnaHR0cHM6JzogdHJ1ZSxcbiAgICAgICdmdHA6JzogdHJ1ZSxcbiAgICAgICdnb3BoZXI6JzogdHJ1ZSxcbiAgICAgICdmaWxlOic6IHRydWVcbiAgICB9LFxuICAgIHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcblxuZnVuY3Rpb24gdXJsUGFyc2UodXJsLCBwYXJzZVF1ZXJ5U3RyaW5nLCBzbGFzaGVzRGVub3RlSG9zdCkge1xuICBpZiAodXJsICYmIHV0aWwuaXNPYmplY3QodXJsKSAmJiB1cmwgaW5zdGFuY2VvZiBVcmwpIHJldHVybiB1cmw7XG5cbiAgdmFyIHUgPSBuZXcgVXJsO1xuICB1LnBhcnNlKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpO1xuICByZXR1cm4gdTtcbn1cblxuVXJsLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpIHtcbiAgaWYgKCF1dGlsLmlzU3RyaW5nKHVybCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUGFyYW1ldGVyICd1cmwnIG11c3QgYmUgYSBzdHJpbmcsIG5vdCBcIiArIHR5cGVvZiB1cmwpO1xuICB9XG5cbiAgLy8gQ29weSBjaHJvbWUsIElFLCBvcGVyYSBiYWNrc2xhc2gtaGFuZGxpbmcgYmVoYXZpb3IuXG4gIC8vIEJhY2sgc2xhc2hlcyBiZWZvcmUgdGhlIHF1ZXJ5IHN0cmluZyBnZXQgY29udmVydGVkIHRvIGZvcndhcmQgc2xhc2hlc1xuICAvLyBTZWU6IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0yNTkxNlxuICB2YXIgcXVlcnlJbmRleCA9IHVybC5pbmRleE9mKCc/JyksXG4gICAgICBzcGxpdHRlciA9XG4gICAgICAgICAgKHF1ZXJ5SW5kZXggIT09IC0xICYmIHF1ZXJ5SW5kZXggPCB1cmwuaW5kZXhPZignIycpKSA/ICc/JyA6ICcjJyxcbiAgICAgIHVTcGxpdCA9IHVybC5zcGxpdChzcGxpdHRlciksXG4gICAgICBzbGFzaFJlZ2V4ID0gL1xcXFwvZztcbiAgdVNwbGl0WzBdID0gdVNwbGl0WzBdLnJlcGxhY2Uoc2xhc2hSZWdleCwgJy8nKTtcbiAgdXJsID0gdVNwbGl0LmpvaW4oc3BsaXR0ZXIpO1xuXG4gIHZhciByZXN0ID0gdXJsO1xuXG4gIC8vIHRyaW0gYmVmb3JlIHByb2NlZWRpbmcuXG4gIC8vIFRoaXMgaXMgdG8gc3VwcG9ydCBwYXJzZSBzdHVmZiBsaWtlIFwiICBodHRwOi8vZm9vLmNvbSAgXFxuXCJcbiAgcmVzdCA9IHJlc3QudHJpbSgpO1xuXG4gIGlmICghc2xhc2hlc0Rlbm90ZUhvc3QgJiYgdXJsLnNwbGl0KCcjJykubGVuZ3RoID09PSAxKSB7XG4gICAgLy8gVHJ5IGZhc3QgcGF0aCByZWdleHBcbiAgICB2YXIgc2ltcGxlUGF0aCA9IHNpbXBsZVBhdGhQYXR0ZXJuLmV4ZWMocmVzdCk7XG4gICAgaWYgKHNpbXBsZVBhdGgpIHtcbiAgICAgIHRoaXMucGF0aCA9IHJlc3Q7XG4gICAgICB0aGlzLmhyZWYgPSByZXN0O1xuICAgICAgdGhpcy5wYXRobmFtZSA9IHNpbXBsZVBhdGhbMV07XG4gICAgICBpZiAoc2ltcGxlUGF0aFsyXSkge1xuICAgICAgICB0aGlzLnNlYXJjaCA9IHNpbXBsZVBhdGhbMl07XG4gICAgICAgIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHRoaXMuc2VhcmNoLnN1YnN0cigxKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5xdWVyeSA9IHRoaXMuc2VhcmNoLnN1YnN0cigxKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoID0gJyc7XG4gICAgICAgIHRoaXMucXVlcnkgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwcm90byA9IHByb3RvY29sUGF0dGVybi5leGVjKHJlc3QpO1xuICBpZiAocHJvdG8pIHtcbiAgICBwcm90byA9IHByb3RvWzBdO1xuICAgIHZhciBsb3dlclByb3RvID0gcHJvdG8udG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLnByb3RvY29sID0gbG93ZXJQcm90bztcbiAgICByZXN0ID0gcmVzdC5zdWJzdHIocHJvdG8ubGVuZ3RoKTtcbiAgfVxuXG4gIC8vIGZpZ3VyZSBvdXQgaWYgaXQncyBnb3QgYSBob3N0XG4gIC8vIHVzZXJAc2VydmVyIGlzICphbHdheXMqIGludGVycHJldGVkIGFzIGEgaG9zdG5hbWUsIGFuZCB1cmxcbiAgLy8gcmVzb2x1dGlvbiB3aWxsIHRyZWF0IC8vZm9vL2JhciBhcyBob3N0PWZvbyxwYXRoPWJhciBiZWNhdXNlIHRoYXQnc1xuICAvLyBob3cgdGhlIGJyb3dzZXIgcmVzb2x2ZXMgcmVsYXRpdmUgVVJMcy5cbiAgaWYgKHNsYXNoZXNEZW5vdGVIb3N0IHx8IHByb3RvIHx8IHJlc3QubWF0Y2goL15cXC9cXC9bXkBcXC9dK0BbXkBcXC9dKy8pKSB7XG4gICAgdmFyIHNsYXNoZXMgPSByZXN0LnN1YnN0cigwLCAyKSA9PT0gJy8vJztcbiAgICBpZiAoc2xhc2hlcyAmJiAhKHByb3RvICYmIGhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dKSkge1xuICAgICAgcmVzdCA9IHJlc3Quc3Vic3RyKDIpO1xuICAgICAgdGhpcy5zbGFzaGVzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWhvc3RsZXNzUHJvdG9jb2xbcHJvdG9dICYmXG4gICAgICAoc2xhc2hlcyB8fCAocHJvdG8gJiYgIXNsYXNoZWRQcm90b2NvbFtwcm90b10pKSkge1xuXG4gICAgLy8gdGhlcmUncyBhIGhvc3RuYW1lLlxuICAgIC8vIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiAvLCA/LCA7LCBvciAjIGVuZHMgdGhlIGhvc3QuXG4gICAgLy9cbiAgICAvLyBJZiB0aGVyZSBpcyBhbiBAIGluIHRoZSBob3N0bmFtZSwgdGhlbiBub24taG9zdCBjaGFycyAqYXJlKiBhbGxvd2VkXG4gICAgLy8gdG8gdGhlIGxlZnQgb2YgdGhlIGxhc3QgQCBzaWduLCB1bmxlc3Mgc29tZSBob3N0LWVuZGluZyBjaGFyYWN0ZXJcbiAgICAvLyBjb21lcyAqYmVmb3JlKiB0aGUgQC1zaWduLlxuICAgIC8vIFVSTHMgYXJlIG9ibm94aW91cy5cbiAgICAvL1xuICAgIC8vIGV4OlxuICAgIC8vIGh0dHA6Ly9hQGJAYy8gPT4gdXNlcjphQGIgaG9zdDpjXG4gICAgLy8gaHR0cDovL2FAYj9AYyA9PiB1c2VyOmEgaG9zdDpjIHBhdGg6Lz9AY1xuXG4gICAgLy8gdjAuMTIgVE9ETyhpc2FhY3MpOiBUaGlzIGlzIG5vdCBxdWl0ZSBob3cgQ2hyb21lIGRvZXMgdGhpbmdzLlxuICAgIC8vIFJldmlldyBvdXIgdGVzdCBjYXNlIGFnYWluc3QgYnJvd3NlcnMgbW9yZSBjb21wcmVoZW5zaXZlbHkuXG5cbiAgICAvLyBmaW5kIHRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhbnkgaG9zdEVuZGluZ0NoYXJzXG4gICAgdmFyIGhvc3RFbmQgPSAtMTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhvc3RFbmRpbmdDaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGhlYyA9IHJlc3QuaW5kZXhPZihob3N0RW5kaW5nQ2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKVxuICAgICAgICBob3N0RW5kID0gaGVjO1xuICAgIH1cblxuICAgIC8vIGF0IHRoaXMgcG9pbnQsIGVpdGhlciB3ZSBoYXZlIGFuIGV4cGxpY2l0IHBvaW50IHdoZXJlIHRoZVxuICAgIC8vIGF1dGggcG9ydGlvbiBjYW5ub3QgZ28gcGFzdCwgb3IgdGhlIGxhc3QgQCBjaGFyIGlzIHRoZSBkZWNpZGVyLlxuICAgIHZhciBhdXRoLCBhdFNpZ247XG4gICAgaWYgKGhvc3RFbmQgPT09IC0xKSB7XG4gICAgICAvLyBhdFNpZ24gY2FuIGJlIGFueXdoZXJlLlxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhdFNpZ24gbXVzdCBiZSBpbiBhdXRoIHBvcnRpb24uXG4gICAgICAvLyBodHRwOi8vYUBiL2NAZCA9PiBob3N0OmIgYXV0aDphIHBhdGg6L2NAZFxuICAgICAgYXRTaWduID0gcmVzdC5sYXN0SW5kZXhPZignQCcsIGhvc3RFbmQpO1xuICAgIH1cblxuICAgIC8vIE5vdyB3ZSBoYXZlIGEgcG9ydGlvbiB3aGljaCBpcyBkZWZpbml0ZWx5IHRoZSBhdXRoLlxuICAgIC8vIFB1bGwgdGhhdCBvZmYuXG4gICAgaWYgKGF0U2lnbiAhPT0gLTEpIHtcbiAgICAgIGF1dGggPSByZXN0LnNsaWNlKDAsIGF0U2lnbik7XG4gICAgICByZXN0ID0gcmVzdC5zbGljZShhdFNpZ24gKyAxKTtcbiAgICAgIHRoaXMuYXV0aCA9IGRlY29kZVVSSUNvbXBvbmVudChhdXRoKTtcbiAgICB9XG5cbiAgICAvLyB0aGUgaG9zdCBpcyB0aGUgcmVtYWluaW5nIHRvIHRoZSBsZWZ0IG9mIHRoZSBmaXJzdCBub24taG9zdCBjaGFyXG4gICAgaG9zdEVuZCA9IC0xO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9uSG9zdENoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaGVjID0gcmVzdC5pbmRleE9mKG5vbkhvc3RDaGFyc1tpXSk7XG4gICAgICBpZiAoaGVjICE9PSAtMSAmJiAoaG9zdEVuZCA9PT0gLTEgfHwgaGVjIDwgaG9zdEVuZCkpXG4gICAgICAgIGhvc3RFbmQgPSBoZWM7XG4gICAgfVxuICAgIC8vIGlmIHdlIHN0aWxsIGhhdmUgbm90IGhpdCBpdCwgdGhlbiB0aGUgZW50aXJlIHRoaW5nIGlzIGEgaG9zdC5cbiAgICBpZiAoaG9zdEVuZCA9PT0gLTEpXG4gICAgICBob3N0RW5kID0gcmVzdC5sZW5ndGg7XG5cbiAgICB0aGlzLmhvc3QgPSByZXN0LnNsaWNlKDAsIGhvc3RFbmQpO1xuICAgIHJlc3QgPSByZXN0LnNsaWNlKGhvc3RFbmQpO1xuXG4gICAgLy8gcHVsbCBvdXQgcG9ydC5cbiAgICB0aGlzLnBhcnNlSG9zdCgpO1xuXG4gICAgLy8gd2UndmUgaW5kaWNhdGVkIHRoYXQgdGhlcmUgaXMgYSBob3N0bmFtZSxcbiAgICAvLyBzbyBldmVuIGlmIGl0J3MgZW1wdHksIGl0IGhhcyB0byBiZSBwcmVzZW50LlxuICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lIHx8ICcnO1xuXG4gICAgLy8gaWYgaG9zdG5hbWUgYmVnaW5zIHdpdGggWyBhbmQgZW5kcyB3aXRoIF1cbiAgICAvLyBhc3N1bWUgdGhhdCBpdCdzIGFuIElQdjYgYWRkcmVzcy5cbiAgICB2YXIgaXB2Nkhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVswXSA9PT0gJ1snICYmXG4gICAgICAgIHRoaXMuaG9zdG5hbWVbdGhpcy5ob3N0bmFtZS5sZW5ndGggLSAxXSA9PT0gJ10nO1xuXG4gICAgLy8gdmFsaWRhdGUgYSBsaXR0bGUuXG4gICAgaWYgKCFpcHY2SG9zdG5hbWUpIHtcbiAgICAgIHZhciBob3N0cGFydHMgPSB0aGlzLmhvc3RuYW1lLnNwbGl0KC9cXC4vKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gaG9zdHBhcnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgcGFydCA9IGhvc3RwYXJ0c1tpXTtcbiAgICAgICAgaWYgKCFwYXJ0KSBjb250aW51ZTtcbiAgICAgICAgaWYgKCFwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFBhdHRlcm4pKSB7XG4gICAgICAgICAgdmFyIG5ld3BhcnQgPSAnJztcbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgayA9IHBhcnQubGVuZ3RoOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgICBpZiAocGFydC5jaGFyQ29kZUF0KGopID4gMTI3KSB7XG4gICAgICAgICAgICAgIC8vIHdlIHJlcGxhY2Ugbm9uLUFTQ0lJIGNoYXIgd2l0aCBhIHRlbXBvcmFyeSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICAvLyB3ZSBuZWVkIHRoaXMgdG8gbWFrZSBzdXJlIHNpemUgb2YgaG9zdG5hbWUgaXMgbm90XG4gICAgICAgICAgICAgIC8vIGJyb2tlbiBieSByZXBsYWNpbmcgbm9uLUFTQ0lJIGJ5IG5vdGhpbmdcbiAgICAgICAgICAgICAgbmV3cGFydCArPSAneCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdwYXJ0ICs9IHBhcnRbal07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHdlIHRlc3QgYWdhaW4gd2l0aCBBU0NJSSBjaGFyIG9ubHlcbiAgICAgICAgICBpZiAoIW5ld3BhcnQubWF0Y2goaG9zdG5hbWVQYXJ0UGF0dGVybikpIHtcbiAgICAgICAgICAgIHZhciB2YWxpZFBhcnRzID0gaG9zdHBhcnRzLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgdmFyIG5vdEhvc3QgPSBob3N0cGFydHMuc2xpY2UoaSArIDEpO1xuICAgICAgICAgICAgdmFyIGJpdCA9IHBhcnQubWF0Y2goaG9zdG5hbWVQYXJ0U3RhcnQpO1xuICAgICAgICAgICAgaWYgKGJpdCkge1xuICAgICAgICAgICAgICB2YWxpZFBhcnRzLnB1c2goYml0WzFdKTtcbiAgICAgICAgICAgICAgbm90SG9zdC51bnNoaWZ0KGJpdFsyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm90SG9zdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmVzdCA9ICcvJyArIG5vdEhvc3Quam9pbignLicpICsgcmVzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaG9zdG5hbWUgPSB2YWxpZFBhcnRzLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhvc3RuYW1lLmxlbmd0aCA+IGhvc3RuYW1lTWF4TGVuKSB7XG4gICAgICB0aGlzLmhvc3RuYW1lID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGhvc3RuYW1lcyBhcmUgYWx3YXlzIGxvd2VyIGNhc2UuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGlmICghaXB2Nkhvc3RuYW1lKSB7XG4gICAgICAvLyBJRE5BIFN1cHBvcnQ6IFJldHVybnMgYSBwdW55Y29kZWQgcmVwcmVzZW50YXRpb24gb2YgXCJkb21haW5cIi5cbiAgICAgIC8vIEl0IG9ubHkgY29udmVydHMgcGFydHMgb2YgdGhlIGRvbWFpbiBuYW1lIHRoYXRcbiAgICAgIC8vIGhhdmUgbm9uLUFTQ0lJIGNoYXJhY3RlcnMsIGkuZS4gaXQgZG9lc24ndCBtYXR0ZXIgaWZcbiAgICAgIC8vIHlvdSBjYWxsIGl0IHdpdGggYSBkb21haW4gdGhhdCBhbHJlYWR5IGlzIEFTQ0lJLW9ubHkuXG4gICAgICB0aGlzLmhvc3RuYW1lID0gcHVueWNvZGUudG9BU0NJSSh0aGlzLmhvc3RuYW1lKTtcbiAgICB9XG5cbiAgICB2YXIgcCA9IHRoaXMucG9ydCA/ICc6JyArIHRoaXMucG9ydCA6ICcnO1xuICAgIHZhciBoID0gdGhpcy5ob3N0bmFtZSB8fCAnJztcbiAgICB0aGlzLmhvc3QgPSBoICsgcDtcbiAgICB0aGlzLmhyZWYgKz0gdGhpcy5ob3N0O1xuXG4gICAgLy8gc3RyaXAgWyBhbmQgXSBmcm9tIHRoZSBob3N0bmFtZVxuICAgIC8vIHRoZSBob3N0IGZpZWxkIHN0aWxsIHJldGFpbnMgdGhlbSwgdGhvdWdoXG4gICAgaWYgKGlwdjZIb3N0bmFtZSkge1xuICAgICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUuc3Vic3RyKDEsIHRoaXMuaG9zdG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBpZiAocmVzdFswXSAhPT0gJy8nKSB7XG4gICAgICAgIHJlc3QgPSAnLycgKyByZXN0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIG5vdyByZXN0IGlzIHNldCB0byB0aGUgcG9zdC1ob3N0IHN0dWZmLlxuICAvLyBjaG9wIG9mZiBhbnkgZGVsaW0gY2hhcnMuXG4gIGlmICghdW5zYWZlUHJvdG9jb2xbbG93ZXJQcm90b10pIHtcblxuICAgIC8vIEZpcnN0LCBtYWtlIDEwMCUgc3VyZSB0aGF0IGFueSBcImF1dG9Fc2NhcGVcIiBjaGFycyBnZXRcbiAgICAvLyBlc2NhcGVkLCBldmVuIGlmIGVuY29kZVVSSUNvbXBvbmVudCBkb2Vzbid0IHRoaW5rIHRoZXlcbiAgICAvLyBuZWVkIHRvIGJlLlxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXV0b0VzY2FwZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBhZSA9IGF1dG9Fc2NhcGVbaV07XG4gICAgICBpZiAocmVzdC5pbmRleE9mKGFlKSA9PT0gLTEpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgdmFyIGVzYyA9IGVuY29kZVVSSUNvbXBvbmVudChhZSk7XG4gICAgICBpZiAoZXNjID09PSBhZSkge1xuICAgICAgICBlc2MgPSBlc2NhcGUoYWUpO1xuICAgICAgfVxuICAgICAgcmVzdCA9IHJlc3Quc3BsaXQoYWUpLmpvaW4oZXNjKTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIGNob3Agb2ZmIGZyb20gdGhlIHRhaWwgZmlyc3QuXG4gIHZhciBoYXNoID0gcmVzdC5pbmRleE9mKCcjJyk7XG4gIGlmIChoYXNoICE9PSAtMSkge1xuICAgIC8vIGdvdCBhIGZyYWdtZW50IHN0cmluZy5cbiAgICB0aGlzLmhhc2ggPSByZXN0LnN1YnN0cihoYXNoKTtcbiAgICByZXN0ID0gcmVzdC5zbGljZSgwLCBoYXNoKTtcbiAgfVxuICB2YXIgcW0gPSByZXN0LmluZGV4T2YoJz8nKTtcbiAgaWYgKHFtICE9PSAtMSkge1xuICAgIHRoaXMuc2VhcmNoID0gcmVzdC5zdWJzdHIocW0pO1xuICAgIHRoaXMucXVlcnkgPSByZXN0LnN1YnN0cihxbSArIDEpO1xuICAgIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnlzdHJpbmcucGFyc2UodGhpcy5xdWVyeSk7XG4gICAgfVxuICAgIHJlc3QgPSByZXN0LnNsaWNlKDAsIHFtKTtcbiAgfSBlbHNlIGlmIChwYXJzZVF1ZXJ5U3RyaW5nKSB7XG4gICAgLy8gbm8gcXVlcnkgc3RyaW5nLCBidXQgcGFyc2VRdWVyeVN0cmluZyBzdGlsbCByZXF1ZXN0ZWRcbiAgICB0aGlzLnNlYXJjaCA9ICcnO1xuICAgIHRoaXMucXVlcnkgPSB7fTtcbiAgfVxuICBpZiAocmVzdCkgdGhpcy5wYXRobmFtZSA9IHJlc3Q7XG4gIGlmIChzbGFzaGVkUHJvdG9jb2xbbG93ZXJQcm90b10gJiZcbiAgICAgIHRoaXMuaG9zdG5hbWUgJiYgIXRoaXMucGF0aG5hbWUpIHtcbiAgICB0aGlzLnBhdGhuYW1lID0gJy8nO1xuICB9XG5cbiAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICBpZiAodGhpcy5wYXRobmFtZSB8fCB0aGlzLnNlYXJjaCkge1xuICAgIHZhciBwID0gdGhpcy5wYXRobmFtZSB8fCAnJztcbiAgICB2YXIgcyA9IHRoaXMuc2VhcmNoIHx8ICcnO1xuICAgIHRoaXMucGF0aCA9IHAgKyBzO1xuICB9XG5cbiAgLy8gZmluYWxseSwgcmVjb25zdHJ1Y3QgdGhlIGhyZWYgYmFzZWQgb24gd2hhdCBoYXMgYmVlbiB2YWxpZGF0ZWQuXG4gIHRoaXMuaHJlZiA9IHRoaXMuZm9ybWF0KCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZm9ybWF0IGEgcGFyc2VkIG9iamVjdCBpbnRvIGEgdXJsIHN0cmluZ1xuZnVuY3Rpb24gdXJsRm9ybWF0KG9iaikge1xuICAvLyBlbnN1cmUgaXQncyBhbiBvYmplY3QsIGFuZCBub3QgYSBzdHJpbmcgdXJsLlxuICAvLyBJZiBpdCdzIGFuIG9iaiwgdGhpcyBpcyBhIG5vLW9wLlxuICAvLyB0aGlzIHdheSwgeW91IGNhbiBjYWxsIHVybF9mb3JtYXQoKSBvbiBzdHJpbmdzXG4gIC8vIHRvIGNsZWFuIHVwIHBvdGVudGlhbGx5IHdvbmt5IHVybHMuXG4gIGlmICh1dGlsLmlzU3RyaW5nKG9iaikpIG9iaiA9IHVybFBhcnNlKG9iaik7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIFVybCkpIHJldHVybiBVcmwucHJvdG90eXBlLmZvcm1hdC5jYWxsKG9iaik7XG4gIHJldHVybiBvYmouZm9ybWF0KCk7XG59XG5cblVybC5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhdXRoID0gdGhpcy5hdXRoIHx8ICcnO1xuICBpZiAoYXV0aCkge1xuICAgIGF1dGggPSBlbmNvZGVVUklDb21wb25lbnQoYXV0aCk7XG4gICAgYXV0aCA9IGF1dGgucmVwbGFjZSgvJTNBL2ksICc6Jyk7XG4gICAgYXV0aCArPSAnQCc7XG4gIH1cblxuICB2YXIgcHJvdG9jb2wgPSB0aGlzLnByb3RvY29sIHx8ICcnLFxuICAgICAgcGF0aG5hbWUgPSB0aGlzLnBhdGhuYW1lIHx8ICcnLFxuICAgICAgaGFzaCA9IHRoaXMuaGFzaCB8fCAnJyxcbiAgICAgIGhvc3QgPSBmYWxzZSxcbiAgICAgIHF1ZXJ5ID0gJyc7XG5cbiAgaWYgKHRoaXMuaG9zdCkge1xuICAgIGhvc3QgPSBhdXRoICsgdGhpcy5ob3N0O1xuICB9IGVsc2UgaWYgKHRoaXMuaG9zdG5hbWUpIHtcbiAgICBob3N0ID0gYXV0aCArICh0aGlzLmhvc3RuYW1lLmluZGV4T2YoJzonKSA9PT0gLTEgP1xuICAgICAgICB0aGlzLmhvc3RuYW1lIDpcbiAgICAgICAgJ1snICsgdGhpcy5ob3N0bmFtZSArICddJyk7XG4gICAgaWYgKHRoaXMucG9ydCkge1xuICAgICAgaG9zdCArPSAnOicgKyB0aGlzLnBvcnQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMucXVlcnkgJiZcbiAgICAgIHV0aWwuaXNPYmplY3QodGhpcy5xdWVyeSkgJiZcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMucXVlcnkpLmxlbmd0aCkge1xuICAgIHF1ZXJ5ID0gcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHRoaXMucXVlcnkpO1xuICB9XG5cbiAgdmFyIHNlYXJjaCA9IHRoaXMuc2VhcmNoIHx8IChxdWVyeSAmJiAoJz8nICsgcXVlcnkpKSB8fCAnJztcblxuICBpZiAocHJvdG9jb2wgJiYgcHJvdG9jb2wuc3Vic3RyKC0xKSAhPT0gJzonKSBwcm90b2NvbCArPSAnOic7XG5cbiAgLy8gb25seSB0aGUgc2xhc2hlZFByb3RvY29scyBnZXQgdGhlIC8vLiAgTm90IG1haWx0bzosIHhtcHA6LCBldGMuXG4gIC8vIHVubGVzcyB0aGV5IGhhZCB0aGVtIHRvIGJlZ2luIHdpdGguXG4gIGlmICh0aGlzLnNsYXNoZXMgfHxcbiAgICAgICghcHJvdG9jb2wgfHwgc2xhc2hlZFByb3RvY29sW3Byb3RvY29sXSkgJiYgaG9zdCAhPT0gZmFsc2UpIHtcbiAgICBob3N0ID0gJy8vJyArIChob3N0IHx8ICcnKTtcbiAgICBpZiAocGF0aG5hbWUgJiYgcGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycpIHBhdGhuYW1lID0gJy8nICsgcGF0aG5hbWU7XG4gIH0gZWxzZSBpZiAoIWhvc3QpIHtcbiAgICBob3N0ID0gJyc7XG4gIH1cblxuICBpZiAoaGFzaCAmJiBoYXNoLmNoYXJBdCgwKSAhPT0gJyMnKSBoYXNoID0gJyMnICsgaGFzaDtcbiAgaWYgKHNlYXJjaCAmJiBzZWFyY2guY2hhckF0KDApICE9PSAnPycpIHNlYXJjaCA9ICc/JyArIHNlYXJjaDtcblxuICBwYXRobmFtZSA9IHBhdGhuYW1lLnJlcGxhY2UoL1s/I10vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KG1hdGNoKTtcbiAgfSk7XG4gIHNlYXJjaCA9IHNlYXJjaC5yZXBsYWNlKCcjJywgJyUyMycpO1xuXG4gIHJldHVybiBwcm90b2NvbCArIGhvc3QgKyBwYXRobmFtZSArIHNlYXJjaCArIGhhc2g7XG59O1xuXG5mdW5jdGlvbiB1cmxSZXNvbHZlKHNvdXJjZSwgcmVsYXRpdmUpIHtcbiAgcmV0dXJuIHVybFBhcnNlKHNvdXJjZSwgZmFsc2UsIHRydWUpLnJlc29sdmUocmVsYXRpdmUpO1xufVxuXG5VcmwucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbihyZWxhdGl2ZSkge1xuICByZXR1cm4gdGhpcy5yZXNvbHZlT2JqZWN0KHVybFBhcnNlKHJlbGF0aXZlLCBmYWxzZSwgdHJ1ZSkpLmZvcm1hdCgpO1xufTtcblxuZnVuY3Rpb24gdXJsUmVzb2x2ZU9iamVjdChzb3VyY2UsIHJlbGF0aXZlKSB7XG4gIGlmICghc291cmNlKSByZXR1cm4gcmVsYXRpdmU7XG4gIHJldHVybiB1cmxQYXJzZShzb3VyY2UsIGZhbHNlLCB0cnVlKS5yZXNvbHZlT2JqZWN0KHJlbGF0aXZlKTtcbn1cblxuVXJsLnByb3RvdHlwZS5yZXNvbHZlT2JqZWN0ID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcbiAgaWYgKHV0aWwuaXNTdHJpbmcocmVsYXRpdmUpKSB7XG4gICAgdmFyIHJlbCA9IG5ldyBVcmwoKTtcbiAgICByZWwucGFyc2UocmVsYXRpdmUsIGZhbHNlLCB0cnVlKTtcbiAgICByZWxhdGl2ZSA9IHJlbDtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBuZXcgVXJsKCk7XG4gIHZhciB0a2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpO1xuICBmb3IgKHZhciB0ayA9IDA7IHRrIDwgdGtleXMubGVuZ3RoOyB0aysrKSB7XG4gICAgdmFyIHRrZXkgPSB0a2V5c1t0a107XG4gICAgcmVzdWx0W3RrZXldID0gdGhpc1t0a2V5XTtcbiAgfVxuXG4gIC8vIGhhc2ggaXMgYWx3YXlzIG92ZXJyaWRkZW4sIG5vIG1hdHRlciB3aGF0LlxuICAvLyBldmVuIGhyZWY9XCJcIiB3aWxsIHJlbW92ZSBpdC5cbiAgcmVzdWx0Lmhhc2ggPSByZWxhdGl2ZS5oYXNoO1xuXG4gIC8vIGlmIHRoZSByZWxhdGl2ZSB1cmwgaXMgZW1wdHksIHRoZW4gdGhlcmUncyBub3RoaW5nIGxlZnQgdG8gZG8gaGVyZS5cbiAgaWYgKHJlbGF0aXZlLmhyZWYgPT09ICcnKSB7XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGhyZWZzIGxpa2UgLy9mb28vYmFyIGFsd2F5cyBjdXQgdG8gdGhlIHByb3RvY29sLlxuICBpZiAocmVsYXRpdmUuc2xhc2hlcyAmJiAhcmVsYXRpdmUucHJvdG9jb2wpIHtcbiAgICAvLyB0YWtlIGV2ZXJ5dGhpbmcgZXhjZXB0IHRoZSBwcm90b2NvbCBmcm9tIHJlbGF0aXZlXG4gICAgdmFyIHJrZXlzID0gT2JqZWN0LmtleXMocmVsYXRpdmUpO1xuICAgIGZvciAodmFyIHJrID0gMDsgcmsgPCBya2V5cy5sZW5ndGg7IHJrKyspIHtcbiAgICAgIHZhciBya2V5ID0gcmtleXNbcmtdO1xuICAgICAgaWYgKHJrZXkgIT09ICdwcm90b2NvbCcpXG4gICAgICAgIHJlc3VsdFtya2V5XSA9IHJlbGF0aXZlW3JrZXldO1xuICAgIH1cblxuICAgIC8vdXJsUGFyc2UgYXBwZW5kcyB0cmFpbGluZyAvIHRvIHVybHMgbGlrZSBodHRwOi8vd3d3LmV4YW1wbGUuY29tXG4gICAgaWYgKHNsYXNoZWRQcm90b2NvbFtyZXN1bHQucHJvdG9jb2xdICYmXG4gICAgICAgIHJlc3VsdC5ob3N0bmFtZSAmJiAhcmVzdWx0LnBhdGhuYW1lKSB7XG4gICAgICByZXN1bHQucGF0aCA9IHJlc3VsdC5wYXRobmFtZSA9ICcvJztcbiAgICB9XG5cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKHJlbGF0aXZlLnByb3RvY29sICYmIHJlbGF0aXZlLnByb3RvY29sICE9PSByZXN1bHQucHJvdG9jb2wpIHtcbiAgICAvLyBpZiBpdCdzIGEga25vd24gdXJsIHByb3RvY29sLCB0aGVuIGNoYW5naW5nXG4gICAgLy8gdGhlIHByb3RvY29sIGRvZXMgd2VpcmQgdGhpbmdzXG4gICAgLy8gZmlyc3QsIGlmIGl0J3Mgbm90IGZpbGU6LCB0aGVuIHdlIE1VU1QgaGF2ZSBhIGhvc3QsXG4gICAgLy8gYW5kIGlmIHRoZXJlIHdhcyBhIHBhdGhcbiAgICAvLyB0byBiZWdpbiB3aXRoLCB0aGVuIHdlIE1VU1QgaGF2ZSBhIHBhdGguXG4gICAgLy8gaWYgaXQgaXMgZmlsZTosIHRoZW4gdGhlIGhvc3QgaXMgZHJvcHBlZCxcbiAgICAvLyBiZWNhdXNlIHRoYXQncyBrbm93biB0byBiZSBob3N0bGVzcy5cbiAgICAvLyBhbnl0aGluZyBlbHNlIGlzIGFzc3VtZWQgdG8gYmUgYWJzb2x1dGUuXG4gICAgaWYgKCFzbGFzaGVkUHJvdG9jb2xbcmVsYXRpdmUucHJvdG9jb2xdKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHJlbGF0aXZlKTtcbiAgICAgIGZvciAodmFyIHYgPSAwOyB2IDwga2V5cy5sZW5ndGg7IHYrKykge1xuICAgICAgICB2YXIgayA9IGtleXNbdl07XG4gICAgICAgIHJlc3VsdFtrXSA9IHJlbGF0aXZlW2tdO1xuICAgICAgfVxuICAgICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHJlc3VsdC5wcm90b2NvbCA9IHJlbGF0aXZlLnByb3RvY29sO1xuICAgIGlmICghcmVsYXRpdmUuaG9zdCAmJiAhaG9zdGxlc3NQcm90b2NvbFtyZWxhdGl2ZS5wcm90b2NvbF0pIHtcbiAgICAgIHZhciByZWxQYXRoID0gKHJlbGF0aXZlLnBhdGhuYW1lIHx8ICcnKS5zcGxpdCgnLycpO1xuICAgICAgd2hpbGUgKHJlbFBhdGgubGVuZ3RoICYmICEocmVsYXRpdmUuaG9zdCA9IHJlbFBhdGguc2hpZnQoKSkpO1xuICAgICAgaWYgKCFyZWxhdGl2ZS5ob3N0KSByZWxhdGl2ZS5ob3N0ID0gJyc7XG4gICAgICBpZiAoIXJlbGF0aXZlLmhvc3RuYW1lKSByZWxhdGl2ZS5ob3N0bmFtZSA9ICcnO1xuICAgICAgaWYgKHJlbFBhdGhbMF0gIT09ICcnKSByZWxQYXRoLnVuc2hpZnQoJycpO1xuICAgICAgaWYgKHJlbFBhdGgubGVuZ3RoIDwgMikgcmVsUGF0aC51bnNoaWZ0KCcnKTtcbiAgICAgIHJlc3VsdC5wYXRobmFtZSA9IHJlbFBhdGguam9pbignLycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucGF0aG5hbWUgPSByZWxhdGl2ZS5wYXRobmFtZTtcbiAgICB9XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICByZXN1bHQuaG9zdCA9IHJlbGF0aXZlLmhvc3QgfHwgJyc7XG4gICAgcmVzdWx0LmF1dGggPSByZWxhdGl2ZS5hdXRoO1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3Q7XG4gICAgcmVzdWx0LnBvcnQgPSByZWxhdGl2ZS5wb3J0O1xuICAgIC8vIHRvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKHJlc3VsdC5wYXRobmFtZSB8fCByZXN1bHQuc2VhcmNoKSB7XG4gICAgICB2YXIgcCA9IHJlc3VsdC5wYXRobmFtZSB8fCAnJztcbiAgICAgIHZhciBzID0gcmVzdWx0LnNlYXJjaCB8fCAnJztcbiAgICAgIHJlc3VsdC5wYXRoID0gcCArIHM7XG4gICAgfVxuICAgIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdmFyIGlzU291cmNlQWJzID0gKHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycpLFxuICAgICAgaXNSZWxBYnMgPSAoXG4gICAgICAgICAgcmVsYXRpdmUuaG9zdCB8fFxuICAgICAgICAgIHJlbGF0aXZlLnBhdGhuYW1lICYmIHJlbGF0aXZlLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nXG4gICAgICApLFxuICAgICAgbXVzdEVuZEFicyA9IChpc1JlbEFicyB8fCBpc1NvdXJjZUFicyB8fFxuICAgICAgICAgICAgICAgICAgICAocmVzdWx0Lmhvc3QgJiYgcmVsYXRpdmUucGF0aG5hbWUpKSxcbiAgICAgIHJlbW92ZUFsbERvdHMgPSBtdXN0RW5kQWJzLFxuICAgICAgc3JjUGF0aCA9IHJlc3VsdC5wYXRobmFtZSAmJiByZXN1bHQucGF0aG5hbWUuc3BsaXQoJy8nKSB8fCBbXSxcbiAgICAgIHJlbFBhdGggPSByZWxhdGl2ZS5wYXRobmFtZSAmJiByZWxhdGl2ZS5wYXRobmFtZS5zcGxpdCgnLycpIHx8IFtdLFxuICAgICAgcHN5Y2hvdGljID0gcmVzdWx0LnByb3RvY29sICYmICFzbGFzaGVkUHJvdG9jb2xbcmVzdWx0LnByb3RvY29sXTtcblxuICAvLyBpZiB0aGUgdXJsIGlzIGEgbm9uLXNsYXNoZWQgdXJsLCB0aGVuIHJlbGF0aXZlXG4gIC8vIGxpbmtzIGxpa2UgLi4vLi4gc2hvdWxkIGJlIGFibGVcbiAgLy8gdG8gY3Jhd2wgdXAgdG8gdGhlIGhvc3RuYW1lLCBhcyB3ZWxsLiAgVGhpcyBpcyBzdHJhbmdlLlxuICAvLyByZXN1bHQucHJvdG9jb2wgaGFzIGFscmVhZHkgYmVlbiBzZXQgYnkgbm93LlxuICAvLyBMYXRlciBvbiwgcHV0IHRoZSBmaXJzdCBwYXRoIHBhcnQgaW50byB0aGUgaG9zdCBmaWVsZC5cbiAgaWYgKHBzeWNob3RpYykge1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9ICcnO1xuICAgIHJlc3VsdC5wb3J0ID0gbnVsbDtcbiAgICBpZiAocmVzdWx0Lmhvc3QpIHtcbiAgICAgIGlmIChzcmNQYXRoWzBdID09PSAnJykgc3JjUGF0aFswXSA9IHJlc3VsdC5ob3N0O1xuICAgICAgZWxzZSBzcmNQYXRoLnVuc2hpZnQocmVzdWx0Lmhvc3QpO1xuICAgIH1cbiAgICByZXN1bHQuaG9zdCA9ICcnO1xuICAgIGlmIChyZWxhdGl2ZS5wcm90b2NvbCkge1xuICAgICAgcmVsYXRpdmUuaG9zdG5hbWUgPSBudWxsO1xuICAgICAgcmVsYXRpdmUucG9ydCA9IG51bGw7XG4gICAgICBpZiAocmVsYXRpdmUuaG9zdCkge1xuICAgICAgICBpZiAocmVsUGF0aFswXSA9PT0gJycpIHJlbFBhdGhbMF0gPSByZWxhdGl2ZS5ob3N0O1xuICAgICAgICBlbHNlIHJlbFBhdGgudW5zaGlmdChyZWxhdGl2ZS5ob3N0KTtcbiAgICAgIH1cbiAgICAgIHJlbGF0aXZlLmhvc3QgPSBudWxsO1xuICAgIH1cbiAgICBtdXN0RW5kQWJzID0gbXVzdEVuZEFicyAmJiAocmVsUGF0aFswXSA9PT0gJycgfHwgc3JjUGF0aFswXSA9PT0gJycpO1xuICB9XG5cbiAgaWYgKGlzUmVsQWJzKSB7XG4gICAgLy8gaXQncyBhYnNvbHV0ZS5cbiAgICByZXN1bHQuaG9zdCA9IChyZWxhdGl2ZS5ob3N0IHx8IHJlbGF0aXZlLmhvc3QgPT09ICcnKSA/XG4gICAgICAgICAgICAgICAgICByZWxhdGl2ZS5ob3N0IDogcmVzdWx0Lmhvc3Q7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gKHJlbGF0aXZlLmhvc3RuYW1lIHx8IHJlbGF0aXZlLmhvc3RuYW1lID09PSAnJykgP1xuICAgICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLmhvc3RuYW1lIDogcmVzdWx0Lmhvc3RuYW1lO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgc3JjUGF0aCA9IHJlbFBhdGg7XG4gICAgLy8gZmFsbCB0aHJvdWdoIHRvIHRoZSBkb3QtaGFuZGxpbmcgYmVsb3cuXG4gIH0gZWxzZSBpZiAocmVsUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBpdCdzIHJlbGF0aXZlXG4gICAgLy8gdGhyb3cgYXdheSB0aGUgZXhpc3RpbmcgZmlsZSwgYW5kIHRha2UgdGhlIG5ldyBwYXRoIGluc3RlYWQuXG4gICAgaWYgKCFzcmNQYXRoKSBzcmNQYXRoID0gW107XG4gICAgc3JjUGF0aC5wb3AoKTtcbiAgICBzcmNQYXRoID0gc3JjUGF0aC5jb25jYXQocmVsUGF0aCk7XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgfSBlbHNlIGlmICghdXRpbC5pc051bGxPclVuZGVmaW5lZChyZWxhdGl2ZS5zZWFyY2gpKSB7XG4gICAgLy8ganVzdCBwdWxsIG91dCB0aGUgc2VhcmNoLlxuICAgIC8vIGxpa2UgaHJlZj0nP2ZvbycuXG4gICAgLy8gUHV0IHRoaXMgYWZ0ZXIgdGhlIG90aGVyIHR3byBjYXNlcyBiZWNhdXNlIGl0IHNpbXBsaWZpZXMgdGhlIGJvb2xlYW5zXG4gICAgaWYgKHBzeWNob3RpYykge1xuICAgICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBzcmNQYXRoLnNoaWZ0KCk7XG4gICAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgICAvL3RoaXMgZXNwZWNpYWxseSBoYXBwZW5zIGluIGNhc2VzIGxpa2VcbiAgICAgIC8vdXJsLnJlc29sdmVPYmplY3QoJ21haWx0bzpsb2NhbDFAZG9tYWluMScsICdsb2NhbDJAZG9tYWluMicpXG4gICAgICB2YXIgYXV0aEluSG9zdCA9IHJlc3VsdC5ob3N0ICYmIHJlc3VsdC5ob3N0LmluZGV4T2YoJ0AnKSA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuaG9zdC5zcGxpdCgnQCcpIDogZmFsc2U7XG4gICAgICBpZiAoYXV0aEluSG9zdCkge1xuICAgICAgICByZXN1bHQuYXV0aCA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSByZXN1bHQuaG9zdG5hbWUgPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmICghdXRpbC5pc051bGwocmVzdWx0LnBhdGhuYW1lKSB8fCAhdXRpbC5pc051bGwocmVzdWx0LnNlYXJjaCkpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gKHJlc3VsdC5wYXRobmFtZSA/IHJlc3VsdC5wYXRobmFtZSA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQuc2VhcmNoID8gcmVzdWx0LnNlYXJjaCA6ICcnKTtcbiAgICB9XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmICghc3JjUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBubyBwYXRoIGF0IGFsbC4gIGVhc3kuXG4gICAgLy8gd2UndmUgYWxyZWFkeSBoYW5kbGVkIHRoZSBvdGhlciBzdHVmZiBhYm92ZS5cbiAgICByZXN1bHQucGF0aG5hbWUgPSBudWxsO1xuICAgIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAocmVzdWx0LnNlYXJjaCkge1xuICAgICAgcmVzdWx0LnBhdGggPSAnLycgKyByZXN1bHQuc2VhcmNoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucGF0aCA9IG51bGw7XG4gICAgfVxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBpZiBhIHVybCBFTkRzIGluIC4gb3IgLi4sIHRoZW4gaXQgbXVzdCBnZXQgYSB0cmFpbGluZyBzbGFzaC5cbiAgLy8gaG93ZXZlciwgaWYgaXQgZW5kcyBpbiBhbnl0aGluZyBlbHNlIG5vbi1zbGFzaHksXG4gIC8vIHRoZW4gaXQgbXVzdCBOT1QgZ2V0IGEgdHJhaWxpbmcgc2xhc2guXG4gIHZhciBsYXN0ID0gc3JjUGF0aC5zbGljZSgtMSlbMF07XG4gIHZhciBoYXNUcmFpbGluZ1NsYXNoID0gKFxuICAgICAgKHJlc3VsdC5ob3N0IHx8IHJlbGF0aXZlLmhvc3QgfHwgc3JjUGF0aC5sZW5ndGggPiAxKSAmJlxuICAgICAgKGxhc3QgPT09ICcuJyB8fCBsYXN0ID09PSAnLi4nKSB8fCBsYXN0ID09PSAnJyk7XG5cbiAgLy8gc3RyaXAgc2luZ2xlIGRvdHMsIHJlc29sdmUgZG91YmxlIGRvdHMgdG8gcGFyZW50IGRpclxuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gc3JjUGF0aC5sZW5ndGg7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGFzdCA9IHNyY1BhdGhbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKCFtdXN0RW5kQWJzICYmICFyZW1vdmVBbGxEb3RzKSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBzcmNQYXRoLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG11c3RFbmRBYnMgJiYgc3JjUGF0aFswXSAhPT0gJycgJiZcbiAgICAgICghc3JjUGF0aFswXSB8fCBzcmNQYXRoWzBdLmNoYXJBdCgwKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgudW5zaGlmdCgnJyk7XG4gIH1cblxuICBpZiAoaGFzVHJhaWxpbmdTbGFzaCAmJiAoc3JjUGF0aC5qb2luKCcvJykuc3Vic3RyKC0xKSAhPT0gJy8nKSkge1xuICAgIHNyY1BhdGgucHVzaCgnJyk7XG4gIH1cblxuICB2YXIgaXNBYnNvbHV0ZSA9IHNyY1BhdGhbMF0gPT09ICcnIHx8XG4gICAgICAoc3JjUGF0aFswXSAmJiBzcmNQYXRoWzBdLmNoYXJBdCgwKSA9PT0gJy8nKTtcblxuICAvLyBwdXQgdGhlIGhvc3QgYmFja1xuICBpZiAocHN5Y2hvdGljKSB7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3QgPSBpc0Fic29sdXRlID8gJycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjUGF0aC5sZW5ndGggPyBzcmNQYXRoLnNoaWZ0KCkgOiAnJztcbiAgICAvL29jY2F0aW9uYWx5IHRoZSBhdXRoIGNhbiBnZXQgc3R1Y2sgb25seSBpbiBob3N0XG4gICAgLy90aGlzIGVzcGVjaWFsbHkgaGFwcGVucyBpbiBjYXNlcyBsaWtlXG4gICAgLy91cmwucmVzb2x2ZU9iamVjdCgnbWFpbHRvOmxvY2FsMUBkb21haW4xJywgJ2xvY2FsMkBkb21haW4yJylcbiAgICB2YXIgYXV0aEluSG9zdCA9IHJlc3VsdC5ob3N0ICYmIHJlc3VsdC5ob3N0LmluZGV4T2YoJ0AnKSA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lmhvc3Quc3BsaXQoJ0AnKSA6IGZhbHNlO1xuICAgIGlmIChhdXRoSW5Ib3N0KSB7XG4gICAgICByZXN1bHQuYXV0aCA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgIHJlc3VsdC5ob3N0ID0gcmVzdWx0Lmhvc3RuYW1lID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgIH1cbiAgfVxuXG4gIG11c3RFbmRBYnMgPSBtdXN0RW5kQWJzIHx8IChyZXN1bHQuaG9zdCAmJiBzcmNQYXRoLmxlbmd0aCk7XG5cbiAgaWYgKG11c3RFbmRBYnMgJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBzcmNQYXRoLnVuc2hpZnQoJycpO1xuICB9XG5cbiAgaWYgKCFzcmNQYXRoLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wYXRobmFtZSA9IG51bGw7XG4gICAgcmVzdWx0LnBhdGggPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5wYXRobmFtZSA9IHNyY1BhdGguam9pbignLycpO1xuICB9XG5cbiAgLy90byBzdXBwb3J0IHJlcXVlc3QuaHR0cFxuICBpZiAoIXV0aWwuaXNOdWxsKHJlc3VsdC5wYXRobmFtZSkgfHwgIXV0aWwuaXNOdWxsKHJlc3VsdC5zZWFyY2gpKSB7XG4gICAgcmVzdWx0LnBhdGggPSAocmVzdWx0LnBhdGhuYW1lID8gcmVzdWx0LnBhdGhuYW1lIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChyZXN1bHQuc2VhcmNoID8gcmVzdWx0LnNlYXJjaCA6ICcnKTtcbiAgfVxuICByZXN1bHQuYXV0aCA9IHJlbGF0aXZlLmF1dGggfHwgcmVzdWx0LmF1dGg7XG4gIHJlc3VsdC5zbGFzaGVzID0gcmVzdWx0LnNsYXNoZXMgfHwgcmVsYXRpdmUuc2xhc2hlcztcbiAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5VcmwucHJvdG90eXBlLnBhcnNlSG9zdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaG9zdCA9IHRoaXMuaG9zdDtcbiAgdmFyIHBvcnQgPSBwb3J0UGF0dGVybi5leGVjKGhvc3QpO1xuICBpZiAocG9ydCkge1xuICAgIHBvcnQgPSBwb3J0WzBdO1xuICAgIGlmIChwb3J0ICE9PSAnOicpIHtcbiAgICAgIHRoaXMucG9ydCA9IHBvcnQuc3Vic3RyKDEpO1xuICAgIH1cbiAgICBob3N0ID0gaG9zdC5zdWJzdHIoMCwgaG9zdC5sZW5ndGggLSBwb3J0Lmxlbmd0aCk7XG4gIH1cbiAgaWYgKGhvc3QpIHRoaXMuaG9zdG5hbWUgPSBob3N0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzU3RyaW5nOiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mKGFyZykgPT09ICdzdHJpbmcnO1xuICB9LFxuICBpc09iamVjdDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZihhcmcpID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG4gIH0sXG4gIGlzTnVsbDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbiAgfSxcbiAgaXNOdWxsT3JVbmRlZmluZWQ6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBhcmcgPT0gbnVsbDtcbiAgfVxufTtcbiIsImNvbnN0IHBhcnNlID0gcmVxdWlyZShcInVybFwiKS5wYXJzZVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2xlYW4sXG4gIHBhZ2UsXG4gIHByb3RvY29sLFxuICBob3N0bmFtZSxcbiAgbm9ybWFsaXplLFxuICBpc1NlYXJjaFF1ZXJ5LFxuICBpc1VSTFxufVxuXG5mdW5jdGlvbiBwcm90b2NvbCAodXJsKSB7XG4gIGNvbnN0IG1hdGNoID0gdXJsLm1hdGNoKC8oXlxcdyspOlxcL1xcLy8pXG4gIGlmIChtYXRjaCkge1xuICAgIHJldHVybiBtYXRjaFsxXVxuICB9XG5cbiAgcmV0dXJuICdodHRwJ1xufVxuXG5mdW5jdGlvbiBjbGVhbiAodXJsKSB7XG4gIHJldHVybiBjbGVhblVUTSh1cmwpXG4gICAgLnRyaW0oKVxuICAgIC5yZXBsYWNlKC9eXFx3KzpcXC9cXC8vLCAnJylcbiAgICAucmVwbGFjZSgvXltcXHctX10rOltcXHctX10rQC8sICcnKVxuICAgIC5yZXBsYWNlKC8jLiokLywgJycpXG4gICAgLnJlcGxhY2UoLyhcXC98XFw/fFxcJnwjKSokLywgJycpXG4gICAgLnJlcGxhY2UoL1xcL1xcPy8sICc/JylcbiAgICAucmVwbGFjZSgvXnd3d1xcLi8sICcnKVxufVxuXG5mdW5jdGlvbiBwYWdlICh1cmwpIHtcbiAgcmV0dXJuIGNsZWFuKHVybC5yZXBsYWNlKC9cXCMuKiQvLCAnJykpXG59XG5cbmZ1bmN0aW9uIGhvc3RuYW1lICh1cmwpIHtcbiAgcmV0dXJuIHBhcnNlKG5vcm1hbGl6ZSh1cmwpKS5ob3N0bmFtZS5yZXBsYWNlKC9ed3d3XFwuLywgJycpXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZSAoaW5wdXQpIHtcbiAgaWYgKGlucHV0LnRyaW0oKS5sZW5ndGggPT09IDApIHJldHVybiAnJ1xuXG4gIGlmIChpc1NlYXJjaFF1ZXJ5KGlucHV0KSkge1xuICAgIHJldHVybiBgaHR0cHM6Ly9nb29nbGUuY29tL3NlYXJjaD9xPSR7ZW5jb2RlVVJJKGlucHV0KX1gXG4gIH1cblxuICBpZiAoIS9eXFx3KzpcXC9cXC8vLnRlc3QoaW5wdXQpKSB7XG4gICAgcmV0dXJuIGBodHRwOi8vJHtpbnB1dH1gXG4gIH1cblxuICByZXR1cm4gaW5wdXRcbn1cblxuZnVuY3Rpb24gaXNTZWFyY2hRdWVyeSAoaW5wdXQpIHtcbiAgcmV0dXJuICFpc1VSTChpbnB1dC50cmltKCkpXG59XG5cbmZ1bmN0aW9uIGlzVVJMIChpbnB1dCkge1xuICByZXR1cm4gaW5wdXQuaW5kZXhPZignICcpID09PSAtMSAmJiAoL15cXHcrOlxcL1xcLy8udGVzdChpbnB1dCkgfHwgaW5wdXQuaW5kZXhPZignLicpID4gMCB8fCBpbnB1dC5pbmRleE9mKCc6JykgPiAwKVxufVxuXG5mdW5jdGlvbiBjbGVhblVUTSAodXJsKSB7XG4gIHJldHVybiB1cmxcbiAgICAucmVwbGFjZSgvKFxcP3xcXCYpdXRtX1tcXHddK1xcPVteXFwmXSsvZywgJyQxJylcbiAgICAucmVwbGFjZSgvKFxcP3xcXCYpcmVmXFw9W15cXCZdK1xcJj8vLCAnJDEnKVxuICAgIC5yZXBsYWNlKC9bXFwmXXsyLH0vLCcmJylcbiAgICAucmVwbGFjZSgnPyYnLCAnPycpXG59XG4iXX0=
