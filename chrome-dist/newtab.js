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

},{"../config":2,"./rows":24,"debounce-fn":37}],5:[function(require,module,exports){
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

},{"./row":23,"./rows":24,"debounce-fn":37,"urls":57}],6:[function(require,module,exports){
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

},{"./rows":24,"debounce-fn":37}],7:[function(require,module,exports){
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

},{"../config":2,"./rows":24}],8:[function(require,module,exports){
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

var CollectionLinkRow = function (_Row) {
  _inherits(CollectionLinkRow, _Row);

  function CollectionLinkRow() {
    _classCallCheck(this, CollectionLinkRow);

    return _possibleConstructorReturn(this, (CollectionLinkRow.__proto__ || Object.getPrototypeOf(CollectionLinkRow)).apply(this, arguments));
  }

  _createClass(CollectionLinkRow, [{
    key: "buttons",
    value: function buttons() {
      var _this2 = this;

      var coll = this.category.collection;
      console.log(coll);

      var remove = {
        title: "Remove from collection",
        icon: "Trash",
        action: function action(_ref) {
          var update = _ref.update,
              sendMessage = _ref.sendMessage;

          var yes = confirm("Are you sure you want to delete this link from the collection \"" + coll + "\" ?");
          if (!yes) return;

          sendMessage({
            task: "remove-from-collection",
            url: _this2.url,
            collection: coll
          }, function () {
            update();
          });
        }
      };

      return [remove];
    }
  }]);

  return CollectionLinkRow;
}(_row2.default);

exports.default = CollectionLinkRow;

},{"./row":23}],9:[function(require,module,exports){
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

var _collectionLinkRow = require("./collection-link-row");

var _collectionLinkRow2 = _interopRequireDefault(_collectionLinkRow);

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
    key: "add",
    value: function add(rows) {
      var _this2 = this;

      this.results.addRows(this, rows.map(function (l) {
        return new _collectionLinkRow2.default(_this2, l);
      }));
    }
  }, {
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
      var _this3 = this;

      this.collection = collection;

      return new Promise(function (resolve, reject) {
        _this3.results.messages.send({
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
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4.results.messages.send({ task: "get-like", url: url }, function (resp) {
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

},{"../config":2,"./collection-link-row":8,"./rows":24}],10:[function(require,module,exports){
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
    key: "buttons",
    value: function buttons() {
      var _this2 = this;

      var rename = {
        title: "Rename",
        icon: "settings",
        action: function action(_ref) {
          var update = _ref.update,
              sendMessage = _ref.sendMessage;

          var title = prompt("title", _this2.title);

          console.log(title, _this2.title);
          if (title === _this2.title) return;

          sendMessage({ task: "update-collection", titleToUpdate: _this2.title, title: title }, function () {
            console.log("response received");
            _this2.title = title;
            update();
          });
        }
      };

      var remove = {
        title: "Remove",
        icon: "Trash",
        action: function action(_ref2) {
          var update = _ref2.update,
              sendMessage = _ref2.sendMessage;

          var yes = confirm("Are you sure you want to delete the collection \"" + _this2.title + "\" ?");
          if (!yes) return;

          sendMessage({ task: "delete-collection", title: _this2.title }, function () {
            update();
          });
        }
      };

      return [rename, remove];
    }
  }, {
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

},{"./row":23}],11:[function(require,module,exports){
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

},{"./collection-row":10,"./rows":24}],12:[function(require,module,exports){
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

},{"preact":41}],13:[function(require,module,exports){
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

},{"preact":41}],14:[function(require,module,exports){
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

},{"./rows":24,"./url-image":34}],15:[function(require,module,exports){
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

},{"preact":41}],16:[function(require,module,exports){
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

},{"preact":41}],17:[function(require,module,exports){
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

},{"preact":41}],18:[function(require,module,exports){
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

},{"../lib/messaging":3}],19:[function(require,module,exports){
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

},{"./logo":16,"./menu":17,"./messaging":18,"./search":26,"./settings":27,"./wallpaper":35,"preact":41}],20:[function(require,module,exports){
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

},{"./rows":24,"title-from-url":51}],21:[function(require,module,exports){
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

},{"./rows":24}],22:[function(require,module,exports){
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

},{"./autocomplete-bookmarks":4,"./autocomplete-top-sites":5,"./bookmark-search":6,"./bookmark-tags":7,"./collection-list":9,"./collections":11,"./history":14,"./icon":15,"./messaging":18,"./query-suggestions":20,"./recent-bookmarks":21,"./sidebar":28,"./speed-dial":29,"./tagbar":30,"./top-sites":32,"./url-icon":33,"debounce-fn":37,"preact":41}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.findHostname = findHostname;

var _urls = require("urls");

var _titleFromUrl = require("title-from-url");

var _titleFromUrl2 = _interopRequireDefault(_titleFromUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      return this.title.trim() || (0, _titleFromUrl2.default)(this.url);
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

},{"title-from-url":51,"urls":57}],24:[function(require,module,exports){
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

},{"../config":2,"./row":23}],25:[function(require,module,exports){
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

},{"./icon":15,"preact":41}],26:[function(require,module,exports){
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

},{"./content":12,"./greeting":13,"./messaging":18,"./results":22,"./search-input":25,"debounce-fn":37,"preact":41}],27:[function(require,module,exports){
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

},{"../chrome/settings-sections":1,"./icon":15,"preact":41}],28:[function(require,module,exports){
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
              this.props.selected.renderTitle()
            ),
            (0, _preact.h)(
              "h2",
              null,
              this.props.selected.renderDesc()
            )
          ),
          this.renderButtons()
        )
      );
    }
  }, {
    key: "renderButtons",
    value: function renderButtons() {
      var _this5 = this;

      if (this.props.selected.buttons) {
        return (0, _preact.h)(
          "div",
          { className: "buttons" },
          this.props.selected.buttons().map(function (b) {
            return _this5.renderButton(b);
          })
        );
      }

      return (0, _preact.h)(
        "div",
        { className: "buttons" },
        this.renderLikeButton(),
        this.renderCommentButton(),
        this.props.selected.type === "top" ? this.renderDeleteTopSiteButton() : null
      );
    }
  }, {
    key: "renderButton",
    value: function renderButton(_ref) {
      var title = _ref.title,
          icon = _ref.icon,
          action = _ref.action;

      var update = this.props.updateFn;
      var sendMessage = this.props.messages.send.bind(this.props.messages);

      return (0, _preact.h)(
        "div",
        {
          title: title,
          className: "button",
          onClick: function onClick() {
            return action({ update: update, sendMessage: sendMessage });
          }
        },
        (0, _preact.h)(_icon2.default, { name: icon }),
        title
      );
    }
  }, {
    key: "renderLikeButton",
    value: function renderLikeButton() {
      var _this6 = this;

      var ago = this.state.like ? (0, _relativeDate2.default)(this.state.like.createdAt) : "";
      var title = this.state.like ? "Delete this website from my bookmarks" : "Bookmark this website";

      return (0, _preact.h)(
        "div",
        {
          title: title,
          className: "button like-button " + (this.state.like ? "liked" : ""),
          onClick: function onClick() {
            return _this6.toggleLike();
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
      var _this7 = this;

      return (0, _preact.h)(
        "div",
        {
          title: "Delete It From Frequently Visited",
          className: "button delete-button",
          onClick: function onClick() {
            return _this7.deleteTopSite();
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

},{"./icon":15,"./top-sites":32,"./url-image":34,"preact":41,"relative-date":48,"urls":57}],29:[function(require,module,exports){
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

},{"../config":2,"./rows":24}],30:[function(require,module,exports){
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

},{"./icon":15,"preact":41}],31:[function(require,module,exports){
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

},{"title-from-url":51}],32:[function(require,module,exports){
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

},{"./rows":24}],33:[function(require,module,exports){
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

},{"./titles":31,"./url-image":34,"img":39,"preact":41}],34:[function(require,module,exports){
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

},{"debounce-fn":37,"img":39,"path":40,"preact":41,"random-color":47}],35:[function(require,module,exports){
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

},{"./wallpapers":36,"preact":41}],36:[function(require,module,exports){
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
  { "url": "https://images.unsplash.com/photo-1501446690852-da55df7bfe07" },
  { "position": "top center", "url": "https://images.unsplash.com/photo-1501862169286-518c291e3eed" },
  { "url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e" },
  { "position": "top center", "url": "https://images.unsplash.com/photo-1479030160180-b1860951d696" },
  { "url": "https://images.unsplash.com/photo-1431887773042-803ed52bed26" },
  { "url": "https://images.unsplash.com/photo-1500514966906-fe245eea9344" },
  { "position": "bottom center", "url": "https://images.unsplash.com/photo-1465401180489-ceb5a34d8a63" },
  { "url": "https://images.unsplash.com/photo-1504461154005-31b435e687ed" },
  { "url": "https://images.unsplash.com/photo-1504740191045-63e15251e750" },
  { "url": "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c" },
  { "position":"bottom center", "url": "https://images.unsplash.com/photo-1501963422762-3d89bd989568" },
  { "position":"top center", "url": "https://images.unsplash.com/photo-1455325528055-ad815afecebe" },
  { "url": "https://images.unsplash.com/photo-1478033394151-c931d5a4bdd6" },
  { "url": "https://images.unsplash.com/photo-1505053262691-624063f94b65" },
  { "url": "https://c2.staticflickr.com/4/3913/14945702736_9d283044a7_h.jpg" },
  { "url": "https://c2.staticflickr.com/4/3896/14215383097_bd07342e8e_h.jpg" },
  { "url": "https://c1.staticflickr.com/3/2825/13464931774_5ea96608aa_h.jpg" },
  { "url": "https://images.unsplash.com/photo-1473800447596-01729482b8eb" },
  { "url": "https://images.unsplash.com/photo-1510806267120-5f11bb474ea0" },
  { "url": "https://images.unsplash.com/photo-1521464302861-ce943915d1c3" },
  { "url": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071" },
  { "url": "https://images.unsplash.com/photo-1538435740860-67bd8f4e8eb8" },
  { "url": "https://images.unsplash.com/photo-1458668383970-8ddd3927deed" },
  { "url": "https://images.unsplash.com/photo-1527519135413-1e146b552e10" }
]

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){

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
},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{"_process":42}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":44,"./encode":45}],47:[function(require,module,exports){
var random = require("rnd");

module.exports = color;

function color (max, min) {
  max || (max = 255);
  return 'rgb(' + random(max, min) + ', ' + random(max, min) + ', ' + random(max, min) + ')';
}

},{"rnd":49}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
module.exports = random;

function random (max, min) {
  max || (max = 999999999999);
  min || (min = 0);

  return min + Math.floor(Math.random() * (max - min));
}

},{}],50:[function(require,module,exports){

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
},{}],51:[function(require,module,exports){
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

},{"to-title":54}],52:[function(require,module,exports){

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
},{"to-no-case":53}],53:[function(require,module,exports){

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
},{}],54:[function(require,module,exports){
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

},{"escape-regexp-component":38,"title-case-minors":50,"to-capital-case":52}],55:[function(require,module,exports){
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

},{"./util":56,"punycode":43,"querystring":46}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
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

},{"url":55}]},{},[19])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaHJvbWUvc2V0dGluZ3Mtc2VjdGlvbnMuanNvbiIsImNvbmZpZy5qc29uIiwibGliL21lc3NhZ2luZy5qcyIsIm5ld3RhYi9hdXRvY29tcGxldGUtYm9va21hcmtzLmpzIiwibmV3dGFiL2F1dG9jb21wbGV0ZS10b3Atc2l0ZXMuanMiLCJuZXd0YWIvYm9va21hcmstc2VhcmNoLmpzIiwibmV3dGFiL2Jvb2ttYXJrLXRhZ3MuanMiLCJuZXd0YWIvY29sbGVjdGlvbi1saW5rLXJvdy5qcyIsIm5ld3RhYi9jb2xsZWN0aW9uLWxpc3QuanMiLCJuZXd0YWIvY29sbGVjdGlvbi1yb3cuanMiLCJuZXd0YWIvY29sbGVjdGlvbnMuanMiLCJuZXd0YWIvY29udGVudC5qcyIsIm5ld3RhYi9ncmVldGluZy5qcyIsIm5ld3RhYi9oaXN0b3J5LmpzIiwibmV3dGFiL2ljb24uanMiLCJuZXd0YWIvbG9nby5qcyIsIm5ld3RhYi9tZW51LmpzIiwibmV3dGFiL21lc3NhZ2luZy5qcyIsIm5ld3RhYi9uZXd0YWIuanMiLCJuZXd0YWIvcXVlcnktc3VnZ2VzdGlvbnMuanMiLCJuZXd0YWIvcmVjZW50LWJvb2ttYXJrcy5qcyIsIm5ld3RhYi9yZXN1bHRzLmpzIiwibmV3dGFiL3Jvdy5qcyIsIm5ld3RhYi9yb3dzLmpzIiwibmV3dGFiL3NlYXJjaC1pbnB1dC5qcyIsIm5ld3RhYi9zZWFyY2guanMiLCJuZXd0YWIvc2V0dGluZ3MuanMiLCJuZXd0YWIvc2lkZWJhci5qcyIsIm5ld3RhYi9zcGVlZC1kaWFsLmpzIiwibmV3dGFiL3RhZ2Jhci5qcyIsIm5ld3RhYi90aXRsZXMuanMiLCJuZXd0YWIvdG9wLXNpdGVzLmpzIiwibmV3dGFiL3VybC1pY29uLmpzIiwibmV3dGFiL3VybC1pbWFnZS5qcyIsIm5ld3RhYi93YWxscGFwZXIuanMiLCJuZXd0YWIvd2FsbHBhcGVycy5qc29uIiwibm9kZV9tb2R1bGVzL2RlYm91bmNlLWZuL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzY2FwZS1yZWdleHAtY29tcG9uZW50L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ltZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wdW55Y29kZS9wdW55Y29kZS5qcyIsIm5vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZGVjb2RlLmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9lbmNvZGUuanMiLCJub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JhbmRvbS1jb2xvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWxhdGl2ZS1kYXRlL2xpYi9yZWxhdGl2ZS1kYXRlLmpzIiwibm9kZV9tb2R1bGVzL3JuZC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aXRsZS1jYXNlLW1pbm9ycy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90aXRsZS1mcm9tLXVybC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90by1jYXBpdGFsLWNhc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdG8tbm8tY2FzZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90by10aXRsZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy91cmwvdXJsLmpzIiwibm9kZV9tb2R1bGVzL3VybC91dGlsLmpzIiwibm9kZV9tb2R1bGVzL3VybHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzV0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHtcbiAgICBrZXk6IFwib25lQ2xpY2tMaWtlXCIsXG4gICAgdGl0bGU6IFwiT25lLWNsaWNrIGJvb2ttYXJraW5nXCIsXG4gICAgZGVzYzogXCJIZWFydCBidXR0b24gd2lsbCBpbW1lZGlhdGVseSBib29rbWFyayB3aGVuIGNsaWNrZWQuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHBvcHVwOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwicmVjZW50Qm9va21hcmtzRmlyc3RcIixcbiAgICB0aXRsZTogXCJSZWNlbnQgQm9va21hcmtzIEZpcnN0XCIsXG4gICAgZGVzYzogXCJNb3ZlIFJlY2VudCBCb29rbWFya3MgT3ZlciBGcmVxdWVudGx5IFZpc2l0ZWRcIixcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9LFxuICB7XG4gICAga2V5OiBcIm1pbmltYWxNb2RlXCIsXG4gICAgdGl0bGU6IFwiRW5hYmxlIE1pbmltYWwgTW9kZVwiLFxuICAgIGRlc2M6IFwiSGlkZSBtYWpvcml0eSBvZiB0aGUgaW50ZXJmYWNlIHVudGlsIHVzZXIgZm9jdXNlcy5cIixcbiAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgbmV3dGFiOiB0cnVlXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwic2hvd1dhbGxwYXBlclwiLFxuICAgIHRpdGxlOiBcIlNob3cgV2FsbHBhcGVyXCIsXG4gICAgZGVzYzogXCJHZXQgYSBuZXcgYmVhdXRpZnVsIHBob3RvIGluIHlvdXIgbmV3IHRhYiBldmVyeSBkYXkuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9LFxuICB7XG4gICAga2V5OiBcImVuYWJsZUdyZWV0aW5nXCIsXG4gICAgdGl0bGU6IFwiU2hvdyBncmVldGluZyAmIHRpbWVcIixcbiAgICBkZXNjOiBcIlNlZSB5b3VyIG5hbWUsIGFuZCBhIG5pY2UgY2xvY2suXCIsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBuZXd0YWI6IHRydWVcbiAgfSxcbiAge1xuICAgIGtleTogXCJlbmFibGVOZXdUYWJcIixcbiAgICB0aXRsZTogXCJFbmFibGUgTmV3IFRhYiBJbnRlcmZhY2VcIixcbiAgICBkZXNjOiBcIkZhc3RlciBhbmQgZWFzaWVyIHNlYXJjaCBpbnRlcmZhY2UuXCIsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIHBvcHVwOiB0cnVlLFxuICAgIG5ld3RhYjogdHJ1ZVxuICB9XG5dXG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwiaG9zdFwiOiBcImh0dHBzOi8vZ2V0a296bW9zLmNvbVwiXG59XG4iLCJsZXQgbWVzc2FnZUNvdW50ZXIgPSAwXG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RJTUVPVVRfU0VDUyA9IDVcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnaW5nIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5saXN0ZW5Gb3JNZXNzYWdlcygpXG4gICAgdGhpcy53YWl0aW5nID0ge31cbiAgfVxuXG4gIGRyYWZ0KHsgaWQsIGNvbnRlbnQsIGVycm9yLCB0bywgcmVwbHkgfSkge1xuICAgIGlkID0gdGhpcy5nZW5lcmF0ZUlkKClcblxuICAgIHJldHVybiB7XG4gICAgICBmcm9tOiB0aGlzLm5hbWUsXG4gICAgICB0bzogdG8gfHwgdGhpcy50YXJnZXQsXG4gICAgICBlcnJvcjogY29udGVudC5lcnJvciB8fCBlcnJvcixcbiAgICAgIGlkLCBjb250ZW50LCByZXBseVxuICAgIH1cbiAgfVxuXG4gIGdlbmVyYXRlSWQoKSB7XG4gICAgcmV0dXJuIChEYXRlLm5vdygpICogMTAwMCkgKyAoKyttZXNzYWdlQ291bnRlcilcbiAgfVxuXG4gIG9uUmVjZWl2ZShtc2cpIHtcbiAgICBpZiAobXNnLnRvICE9PSB0aGlzLm5hbWUpIHJldHVybiB0cnVlXG5cbiAgICBpZiAobXNnLnJlcGx5ICYmIHRoaXMud2FpdGluZ1ttc2cucmVwbHldKSB7XG4gICAgICB0aGlzLndhaXRpbmdbbXNnLnJlcGx5XShtc2cpXG4gICAgfVxuXG4gICAgaWYgKG1zZy5yZXBseSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobXNnLmNvbnRlbnQgJiYgbXNnLmNvbnRlbnQucGluZykge1xuICAgICAgdGhpcy5yZXBseShtc2csIHsgcG9uZzogdHJ1ZSB9KVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBwaW5nKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zZW5kKHsgcGluZzogdHJ1ZSB9LCBjYWxsYmFjaylcbiAgfVxuXG4gIHJlcGx5KG1zZywgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5jb250ZW50KSB7XG4gICAgICBvcHRpb25zID0ge1xuICAgICAgICBjb250ZW50OiBvcHRpb25zXG4gICAgICB9XG4gICAgfVxuXG4gICAgb3B0aW9ucy5yZXBseSA9IG1zZy5pZFxuICAgIG9wdGlvbnMudG8gPSBtc2cuZnJvbVxuXG4gICAgdGhpcy5zZW5kKG9wdGlvbnMpXG4gIH1cblxuICBzZW5kKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbXNnID0gdGhpcy5kcmFmdChvcHRpb25zLmNvbnRlbnQgPyBvcHRpb25zIDogeyBjb250ZW50OiBvcHRpb25zIH0pXG5cbiAgICB0aGlzLnNlbmRNZXNzYWdlKG1zZylcblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdGhpcy53YWl0UmVwbHlGb3IobXNnLmlkLCBERUZBVUxUX1RJTUVPVVRfU0VDUywgY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgd2FpdFJlcGx5Rm9yKG1zZ0lkLCB0aW1lb3V0U2VjcywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgIGxldCB0aW1lb3V0ID0gdW5kZWZpbmVkXG5cbiAgICBpZiAodGltZW91dFNlY3MgPiAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChvblRpbWVvdXQsIHRpbWVvdXRTZWNzICogMTAwMClcbiAgICB9XG5cbiAgICB0aGlzLndhaXRpbmdbbXNnSWRdID0gbXNnID0+IHtcbiAgICAgIGRvbmUoKVxuICAgICAgY2FsbGJhY2sobXNnKVxuICAgIH1cblxuICAgIHJldHVybiBkb25lXG5cbiAgICBmdW5jdGlvbiBkb25lICgpIHtcbiAgICAgIGlmICh0aW1lb3V0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgIH1cblxuICAgICAgdGltZW91dCA9IHVuZGVmaW5lZFxuICAgICAgZGVsZXRlIHNlbGYud2FpdGluZ1ttc2dJZF1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblRpbWVvdXQgKCkge1xuICAgICAgZG9uZSgpXG4gICAgICBjYWxsYmFjayh7IGVycm9yOiBuZXcgRXJyb3IoJ01lc3NhZ2UgcmVzcG9uc2UgdGltZW91dCAoJyArIHRpbWVvdXRTZWNzICsnKXMuJykgfSlcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5pbXBvcnQgY29uZmlnIGZyb20gXCIuLi9jb25maWdcIlxuXG5jb25zdCBPRkZMSU5FX1JFU1VMVFNfVEhSRVNIT0xEID0gNFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvY29tcGxldGUgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJhdXRvY29tcGxldGUtYm9va21hcmtzXCJcbiAgICB0aGlzLnRpdGxlID0gXCJCb29rbWFya3NcIlxuICAgIHRoaXMuc2hvd01vcmVCdXR0b24gPSB0cnVlXG4gICAgdGhpcy51cGRhdGUgPSBkZWJvdW5jZSh0aGlzLmZldGNoLmJpbmQodGhpcyksIDE1MClcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiAoXG4gICAgICBxdWVyeS5sZW5ndGggPiAwICYmXG4gICAgICBxdWVyeS5pbmRleE9mKFwidGFnOlwiKSA9PT0gLTEgJiZcbiAgICAgIHF1ZXJ5LmluZGV4T2YoXCJpbjpcIikgPT09IC0xXG4gICAgKVxuICB9XG5cbiAgZmV0Y2gocXVlcnkpIHtcbiAgICBjb25zdCBvcXVlcnkgPSBxdWVyeSB8fCB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnlcbiAgICBjb25zdCBhZGRlZEFscmVhZHkgPSB7fVxuXG4gICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiBcImF1dG9jb21wbGV0ZVwiLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChvcXVlcnkgIT09IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeS50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgIHJlc3AuY29udGVudC5mb3JFYWNoKHJvdyA9PiAoYWRkZWRBbHJlYWR5W3Jvdy51cmxdID0gdHJ1ZSkpXG5cbiAgICAgIHRoaXMuYWRkKFxuICAgICAgICB0aGlzLmFkZE1vcmVCdXR0b24ocmVzcC5jb250ZW50LCB7XG4gICAgICAgICAgdGl0bGU6IGBNb3JlIHJlc3VsdHMgZm9yIFwiJHtvcXVlcnl9XCJgLFxuICAgICAgICAgIHVybDogYCR7Y29uZmlnLmhvc3R9L3NlYXJjaD9xPSR7b3F1ZXJ5fWBcbiAgICAgICAgfSlcbiAgICAgIClcblxuICAgICAgaWYgKHJlc3AuY29udGVudC5sZW5ndGggPj0gT0ZGTElORV9SRVNVTFRTX1RIUkVTSE9MRCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiBcInNlYXJjaC1ib29rbWFya3NcIiwgcXVlcnkgfSwgcmVzcCA9PiB7XG4gICAgICAgIGlmIChvcXVlcnkgIT09IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeS50cmltKCkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IHJlc3AuY29udGVudC5maWx0ZXIocm93ID0+ICFhZGRlZEFscmVhZHlbcm93LnVybF0pXG5cbiAgICAgICAgdGhpcy5hZGQoXG4gICAgICAgICAgdGhpcy5hZGRNb3JlQnV0dG9uKGNvbnRlbnQsIHtcbiAgICAgICAgICAgIHRpdGxlOiBgTW9yZSByZXN1bHRzIGZvciBcIiR7b3F1ZXJ5fVwiYCxcbiAgICAgICAgICAgIHVybDogYCR7Y29uZmlnLmhvc3R9L3NlYXJjaD9xPSR7b3F1ZXJ5fWBcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCBSb3cgZnJvbSBcIi4vcm93XCJcbmltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5pbXBvcnQgeyBjbGVhbiB9IGZyb20gXCJ1cmxzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b2NvbXBsZXRlVG9wU2l0ZXMgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJhdXRvY29tcGxldGUtdG9wLXNpdGVzXCJcbiAgICB0aGlzLnRpdGxlID0gXCJGcmVxdWVudGx5IFZpc2l0ZWRcIlxuICAgIHRoaXMudXBkYXRlID0gZGVib3VuY2UodGhpcy5mZXRjaC5iaW5kKHRoaXMpLCAxNTApXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkubGVuZ3RoID4gMFxuICB9XG5cbiAgZmV0Y2gocXVlcnkpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXVxuXG4gICAgY2hyb21lLnRvcFNpdGVzLmdldCh0b3BTaXRlcyA9PiB7XG4gICAgICBsZXQgaSA9IC0xXG4gICAgICBjb25zdCBsZW4gPSB0b3BTaXRlcy5sZW5ndGhcbiAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNsZWFuKHRvcFNpdGVzW2ldLnVybCkuaW5kZXhPZihxdWVyeSkgPT09IDAgfHxcbiAgICAgICAgICB0b3BTaXRlc1tpXS50aXRsZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXVlcnkpID4gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFJvdyh0aGlzLCB0b3BTaXRlc1tpXSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hZGQocmVzdWx0KVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvb2ttYXJrU2VhcmNoIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMubmFtZSA9IFwiYm9va21hcmstc2VhcmNoXCJcbiAgICB0aGlzLnRpdGxlID0gXCJMaWtlZCBpbiBLb3ptb3NcIlxuXG4gICAgdGhpcy51cGRhdGUgPSBkZWJvdW5jZSh0aGlzLl91cGRhdGUuYmluZCh0aGlzKSwgMjUwKVxuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHF1ZXJ5ICYmXG4gICAgICBxdWVyeS5sZW5ndGggPiAxICYmXG4gICAgICAocXVlcnkuaW5kZXhPZihcInRhZzpcIikgIT09IDAgfHwgcXVlcnkubGVuZ3RoIDwgNSkgJiZcbiAgICAgIHF1ZXJ5LmluZGV4T2YoXCJpbjpcIikgIT09IDBcbiAgICApXG4gIH1cblxuICBfdXBkYXRlKHF1ZXJ5KSB7XG4gICAgY29uc3Qgb3F1ZXJ5ID0gcXVlcnkgfHwgdGhpcy5yZXN1bHRzLnByb3BzLnF1ZXJ5XG5cbiAgICB0aGlzLnJlc3VsdHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6IFwic2VhcmNoLWJvb2ttYXJrc1wiLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChvcXVlcnkgIT09IHRoaXMucmVzdWx0cy5wcm9wcy5xdWVyeS50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgIHRoaXMuYWRkKHJlc3AuY29udGVudClcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpc3RCb29rbWFya3NCeVRhZyBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSBcImJvb2ttYXJrcy1ieS10YWdcIlxuICAgIHRoaXMudGl0bGUgPSBxdWVyeSA9PiBgQm9va21hcmtzIFRhZ2dlZCBXaXRoIFwiJHtxdWVyeS5zbGljZSg0KX1cImBcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeSAmJiBxdWVyeS5pbmRleE9mKFwidGFnOlwiKSA9PT0gMCAmJiBxdWVyeS5sZW5ndGggPiA0XG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICBjb25zdCBvcXVlcnkgPSBxdWVyeSB8fCB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnlcbiAgICBjb25zdCB0YWcgPSBvcXVlcnkuc2xpY2UoNClcblxuICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogXCJnZXQtYm9va21hcmtzLWJ5LXRhZ1wiLCB0YWcgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAob3F1ZXJ5ICE9PSB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnkudHJpbSgpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMuZmFpbChyZXNwLmVycm9yKVxuXG4gICAgICBjb25zdCBjb250ZW50ID1cbiAgICAgICAgcmVzcC5jb250ZW50Lmxlbmd0aCA+IDRcbiAgICAgICAgICA/IHRoaXMuYWRkTW9yZUJ1dHRvbihyZXNwLmNvbnRlbnQsIHtcbiAgICAgICAgICAgICAgdGl0bGU6IGBNb3JlIHRhZ2dlZCB3aXRoIFwiJHt0YWd9XCJgLFxuICAgICAgICAgICAgICB1cmw6IGAke2NvbmZpZy5ob3N0fS90YWcvJHt0YWd9YFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICA6IHJlc3AuY29udGVudFxuXG4gICAgICB0aGlzLmFkZChjb250ZW50KVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCBSb3cgZnJvbSBcIi4vcm93XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sbGVjdGlvbkxpbmtSb3cgZXh0ZW5kcyBSb3cge1xuICBidXR0b25zKCkge1xuICAgIGNvbnN0IGNvbGwgPSB0aGlzLmNhdGVnb3J5LmNvbGxlY3Rpb25cbiAgICBjb25zb2xlLmxvZyhjb2xsKVxuXG4gICAgY29uc3QgcmVtb3ZlID0ge1xuICAgICAgdGl0bGU6IFwiUmVtb3ZlIGZyb20gY29sbGVjdGlvblwiLFxuICAgICAgaWNvbjogXCJUcmFzaFwiLFxuICAgICAgYWN0aW9uOiAoeyB1cGRhdGUsIHNlbmRNZXNzYWdlIH0pID0+IHtcbiAgICAgICAgY29uc3QgeWVzID0gY29uZmlybShcbiAgICAgICAgICBgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGxpbmsgZnJvbSB0aGUgY29sbGVjdGlvbiBcIiR7Y29sbH1cIiA/YFxuICAgICAgICApXG4gICAgICAgIGlmICgheWVzKSByZXR1cm5cblxuICAgICAgICBzZW5kTWVzc2FnZShcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0YXNrOiBcInJlbW92ZS1mcm9tLWNvbGxlY3Rpb25cIixcbiAgICAgICAgICAgIHVybDogdGhpcy51cmwsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBjb2xsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB1cGRhdGUoKVxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBbcmVtb3ZlXVxuICB9XG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ1wiXG5pbXBvcnQgQ29sbGVjdGlvbkxpbmtSb3cgZnJvbSBcIi4vY29sbGVjdGlvbi1saW5rLXJvd1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpc3RCb29rbWFya3NCeUNvbGxlY3Rpb24gZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJib29rbWFya3MtYnktY29sbGVjdGlvblwiXG4gICAgdGhpcy50aXRsZSA9IHF1ZXJ5ID0+IGBCb29rbWFya3MgaW4gXCIke3F1ZXJ5LnNsaWNlKDMpfSBDb2xsZWN0aW9uXCJgXG4gIH1cblxuICBhZGQocm93cykge1xuICAgIHRoaXMucmVzdWx0cy5hZGRSb3dzKHRoaXMsIHJvd3MubWFwKGwgPT4gbmV3IENvbGxlY3Rpb25MaW5rUm93KHRoaXMsIGwpKSlcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeSAmJiBxdWVyeS5pbmRleE9mKFwiaW46XCIpID09PSAwICYmIHF1ZXJ5Lmxlbmd0aCA+IDNcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZShxdWVyeSkge1xuICAgIGNvbnN0IFtjb2xsZWN0aW9uLCBmaWx0ZXJdID0gcGFyc2VRdWVyeShxdWVyeSB8fCB0aGlzLnJlc3VsdHMucHJvcHMucXVlcnkpXG4gICAgbGV0IHJlc3VsdHNcblxuICAgIHRyeSB7XG4gICAgICByZXN1bHRzID0gYXdhaXQgdGhpcy5nZXRCb29rbWFya3NCeUNvbGxlY3Rpb24oY29sbGVjdGlvbiwgZmlsdGVyKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5mYWlsKGVycilcbiAgICB9XG5cbiAgICB0aGlzLmFkZChyZXN1bHRzKVxuICB9XG5cbiAgYXN5bmMgZ2V0Qm9va21hcmtzQnlDb2xsZWN0aW9uKGNvbGxlY3Rpb24sIGZpbHRlcikge1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnJlc3VsdHMubWVzc2FnZXMuc2VuZChcbiAgICAgICAge1xuICAgICAgICAgIHRhc2s6IFwiZ2V0LWJvb2ttYXJrcy1ieS1jb2xsZWN0aW9uXCIsXG4gICAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgICBvZmZzZXQ6IDAsXG4gICAgICAgICAgbGltaXQ6IDUsXG4gICAgICAgICAgZmlsdGVyXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3AgPT4ge1xuICAgICAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gcmVqZWN0KHJlc3AuZXJyb3IpXG4gICAgICAgICAgcmVzb2x2ZShyZXNwLmNvbnRlbnQpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgZ2V0TGlua0J5VXJsKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnJlc3VsdHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6IFwiZ2V0LWxpa2VcIiwgdXJsIH0sIHJlc3AgPT4ge1xuICAgICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHJlamVjdChyZXNwLmVycm9yKVxuICAgICAgICByZXNvbHZlKHJlc3AuY29udGVudC5saWtlKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlUXVlcnkocXVlcnkpIHtcbiAgaWYgKC9eaW46XFxcIltcXHdcXHNdK1xcXCIkLy50ZXN0KHF1ZXJ5KSkge1xuICAgIHJldHVybiBbcXVlcnkuc2xpY2UoNCwgLTEpLnRyaW0oKV1cbiAgfVxuXG4gIGlmICgvXmluOlxcXCJbXFx3XFxzXStcXFwiIFtcXHdcXHNdKyQvLnRlc3QocXVlcnkpKSB7XG4gICAgY29uc3QgY2xvc2luZ1F1b3RlQXQgPSBxdWVyeS5pbmRleE9mKCdcIiAnLCA0KVxuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBxdWVyeS5zbGljZSg0LCBjbG9zaW5nUXVvdGVBdClcbiAgICBjb25zdCBmaWx0ZXIgPSBxdWVyeS5zbGljZShjbG9zaW5nUXVvdGVBdClcbiAgICByZXR1cm4gW2NvbGxlY3Rpb24udHJpbSgpLCBmaWx0ZXIudHJpbSgpXVxuICB9XG5cbiAgaWYgKC9eaW46XFx3KyBbXFx3XFxzXSskLy50ZXN0KHF1ZXJ5KSkge1xuICAgIGNvbnN0IHNlcGFyYXRpbmdTcGFjZUF0ID0gcXVlcnkuaW5kZXhPZihcIiBcIiwgMylcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gcXVlcnkuc2xpY2UoMywgc2VwYXJhdGluZ1NwYWNlQXQpXG4gICAgY29uc3QgZmlsdGVyID0gcXVlcnkuc2xpY2Uoc2VwYXJhdGluZ1NwYWNlQXQpXG4gICAgcmV0dXJuIFtjb2xsZWN0aW9uLnRyaW0oKSwgZmlsdGVyLnRyaW0oKV1cbiAgfVxuXG4gIHJldHVybiBbcXVlcnkuc2xpY2UoMykudHJpbSgpXVxufVxuIiwiaW1wb3J0IFJvdyBmcm9tIFwiLi9yb3dcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xsZWN0aW9uUm93IGV4dGVuZHMgUm93IHtcbiAgYnV0dG9ucygpIHtcbiAgICBjb25zdCByZW5hbWUgPSB7XG4gICAgICB0aXRsZTogXCJSZW5hbWVcIixcbiAgICAgIGljb246IFwic2V0dGluZ3NcIixcbiAgICAgIGFjdGlvbjogKHsgdXBkYXRlLCBzZW5kTWVzc2FnZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gcHJvbXB0KFwidGl0bGVcIiwgdGhpcy50aXRsZSlcblxuICAgICAgICBjb25zb2xlLmxvZyh0aXRsZSwgdGhpcy50aXRsZSlcbiAgICAgICAgaWYgKHRpdGxlID09PSB0aGlzLnRpdGxlKSByZXR1cm5cblxuICAgICAgICBzZW5kTWVzc2FnZShcbiAgICAgICAgICB7IHRhc2s6IFwidXBkYXRlLWNvbGxlY3Rpb25cIiwgdGl0bGVUb1VwZGF0ZTogdGhpcy50aXRsZSwgdGl0bGUgfSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlc3BvbnNlIHJlY2VpdmVkXCIpXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGVcbiAgICAgICAgICAgIHVwZGF0ZSgpXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVtb3ZlID0ge1xuICAgICAgdGl0bGU6IFwiUmVtb3ZlXCIsXG4gICAgICBpY29uOiBcIlRyYXNoXCIsXG4gICAgICBhY3Rpb246ICh7IHVwZGF0ZSwgc2VuZE1lc3NhZ2UgfSkgPT4ge1xuICAgICAgICBjb25zdCB5ZXMgPSBjb25maXJtKFxuICAgICAgICAgIGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoZSBjb2xsZWN0aW9uIFwiJHt0aGlzLnRpdGxlfVwiID9gXG4gICAgICAgIClcbiAgICAgICAgaWYgKCF5ZXMpIHJldHVyblxuXG4gICAgICAgIHNlbmRNZXNzYWdlKHsgdGFzazogXCJkZWxldGUtY29sbGVjdGlvblwiLCB0aXRsZTogdGhpcy50aXRsZSB9LCAoKSA9PiB7XG4gICAgICAgICAgdXBkYXRlKClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gW3JlbmFtZSwgcmVtb3ZlXVxuICB9XG5cbiAgb25DbGljaygpIHtcbiAgICB0aGlzLmNhdGVnb3J5LnJlc3VsdHMucHJvcHMub3BlbkNvbGxlY3Rpb24odGhpcy50aXRsZSlcbiAgfVxuXG4gIHJlbmRlckRlc2MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVzYyB8fCBgTGlua3MgdW5kZXIgXCIke3RoaXMudGl0bGV9XCIgY29sbGVjdGlvbmBcbiAgfVxufVxuIiwiaW1wb3J0IFJvd3MgZnJvbSBcIi4vcm93c1wiXG5pbXBvcnQgQ29sbGVjdGlvblJvdyBmcm9tIFwiLi9jb2xsZWN0aW9uLXJvd1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbGxlY3Rpb25zIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMubmFtZSA9IFwiY29sbGVjdGlvbnNcIlxuICAgIHRoaXMudGl0bGUgPSBcIkNvbGxlY3Rpb25zXCJcbiAgfVxuXG4gIGFkZChyb3dzKSB7XG4gICAgdGhpcy5yZXN1bHRzLmFkZFJvd3ModGhpcywgcm93cy5tYXAociA9PiBuZXcgQ29sbGVjdGlvblJvdyh0aGlzLCByKSkpXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gIXF1ZXJ5LnRyaW0oKS5zdGFydHNXaXRoKFwidGFnOlwiKSAmJiAhL15pbjouKy8udGVzdChxdWVyeS50cmltKCkpXG4gIH1cblxuICBmYWlsKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiBcImdldC1jb2xsZWN0aW9uc1wiLCBxdWVyeSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5mYWlsKHJlc3AuZXJyb3IpXG5cbiAgICAgIGlmIChxdWVyeS5sZW5ndGggPT09IDAgfHwgcXVlcnkudHJpbSgpID09PSBcImluOlwiKSB7XG4gICAgICAgIHRoaXMuYWRkKHJlc3AuY29udGVudClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWRkKFxuICAgICAgICByZXNwLmNvbnRlbnQuZmlsdGVyKGMgPT5cbiAgICAgICAgICBjLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnQtd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNlbnRlclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgY29udGVudCAke3RoaXMucHJvcHMuZm9jdXNlZCA/IFwiZm9jdXNlZFwiIDogXCJcIn1gfT5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JlZXRpbmcgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ2dldC1uYW1lJyB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5vbkVycm9yKHJlc3AuZXJyb3IpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBuYW1lOiByZXNwLmNvbnRlbnQubmFtZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy50aWNrKClcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuZGVsZXRlVGltZXIoKVxuICB9XG5cbiAgZGVsZXRlVGltZXIoKSB7XG4gICAgaWYgKHRoaXMudGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG4gICAgICB0aGlzLnRpbWVyID0gdW5kZWZpbmVkXG4gICAgfVxuICB9XG5cbiAgc2V0VGltZXIoKSB7XG4gICAgdGhpcy5kZWxldGVUaW1lcigpXG4gICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy50aWNrKCksIDYwMDAwKVxuICB9XG5cbiAgdGljaygpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGhvdXJzOiBub3cuZ2V0SG91cnMoKSxcbiAgICAgIG1pbnV0ZXM6IG5vdy5nZXRNaW51dGVzKClcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRUaW1lcigpXG4gIH1cblxuICBvbkVycm9yKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmVldGluZ1wiPlxuICAgICAgICB7dGhpcy5yZW5kZXJNZXNzYWdlKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlclRpbWUoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRpbWUoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGltZVwiPlxuICAgICAgICB7cGFkKHRoaXMuc3RhdGUuaG91cnMpfTp7cGFkKHRoaXMuc3RhdGUubWludXRlcyl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJNZXNzYWdlKCkge1xuICAgIGNvbnN0IGhvdXIgPSB0aGlzLnN0YXRlLmhvdXJzXG4gICAgbGV0IG1lc3NhZ2UgPSBcIkdvb2QgbW9ybmluZ1wiXG5cbiAgICBpZiAoaG91ciA+PSAxMikgbWVzc2FnZSA9IFwiR29vZCBBZnRlcm5vb25cIlxuICAgIGlmIChob3VyID49IDE2KSBtZXNzYWdlID0gXCJHb29kIEV2ZW5pbmdcIlxuXG4gICAgbWVzc2FnZSArPSAodGhpcy5zdGF0ZS5uYW1lID8gXCIsXCIgOiBcIi5cIilcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1lc3NhZ2VcIj5cbiAgICAgICAge21lc3NhZ2V9XG4gICAgICAgIHt0aGlzLnJlbmRlck5hbWUoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck5hbWUoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLm5hbWUpIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmFtZVwiPlxuICAgICAgICB7dGhpcy5zdGF0ZS5uYW1lLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnN0YXRlLm5hbWUuc2xpY2UoMSl9LlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIHBhZCAobikge1xuICBpZiAoU3RyaW5nKG4pLmxlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gJzAnICsgblxuICB9XG5cbiAgcmV0dXJuIG5cbn1cbiIsImltcG9ydCBSb3dzIGZyb20gXCIuL3Jvd3NcIlxuaW1wb3J0IHsgZmluZEhvc3RuYW1lIH0gZnJvbSBcIi4vdXJsLWltYWdlXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlzdG9yeSBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSBcImhpc3RvcnlcIlxuICAgIHRoaXMudGl0bGUgPSBcIkhpc3RvcnlcIlxuICB9XG5cbiAgc2hvdWxkQmVPcGVuKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5Lmxlbmd0aCA+IDEgJiYgcXVlcnkudHJpbSgpLmxlbmd0aCA+IDFcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIGNocm9tZS5oaXN0b3J5LnNlYXJjaCh7IHRleHQ6IHF1ZXJ5IH0sIGhpc3RvcnkgPT4ge1xuICAgICAgdGhpcy5hZGQoaGlzdG9yeS5maWx0ZXIoZmlsdGVyT3V0U2VhcmNoKSlcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGZpbHRlck91dFNlYXJjaChyb3cpIHtcbiAgcmV0dXJuIChcbiAgICBmaW5kSG9zdG5hbWUocm93LnVybCkuc3BsaXQoXCIuXCIpWzBdICE9PSBcImdvb2dsZVwiICYmXG4gICAgIS9zZWFyY2hcXC8/XFw/cVxcPVxcdyovLnRlc3Qocm93LnVybCkgJiZcbiAgICAhL2ZhY2Vib29rXFwuY29tXFwvc2VhcmNoLy50ZXN0KHJvdy51cmwpICYmXG4gICAgIS90d2l0dGVyXFwuY29tXFwvc2VhcmNoLy50ZXN0KHJvdy51cmwpICYmXG4gICAgZmluZEhvc3RuYW1lKHJvdy51cmwpICE9PSBcInQuY29cIlxuICApXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSWNvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBtZXRob2QgPSB0aGlzWydyZW5kZXInICsgdGhpcy5wcm9wcy5uYW1lLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKDAsIDEpICsgdGhpcy5wcm9wcy5uYW1lLnNsaWNlKDEpXVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgb25DbGljaz17dGhpcy5wcm9wcy5vbkNsaWNrfSBjbGFzc05hbWU9e2BpY29uIGljb24tJHt0aGlzLnByb3BzLm5hbWV9YH0gey4uLnRoaXMucHJvcHN9PlxuICAgICAgICB7bWV0aG9kID8gbWV0aG9kLmNhbGwodGhpcykgOiBudWxsfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgc3Ryb2tlICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zdHJva2UgfHwgMlxuICB9XG5cbiAgcmVuZGVyQWxlcnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWFsZXJ0XCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTYgMyBMMzAgMjkgMiAyOSBaIE0xNiAxMSBMMTYgMTkgTTE2IDIzIEwxNiAyNVwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJDbG9jaygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktY2xvY2tcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjE2XCIgY3k9XCIxNlwiIHI9XCIxNFwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTYgOCBMMTYgMTYgMjAgMjBcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2xvc2UoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWNsb3NlXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMiAzMCBMMzAgMiBNMzAgMzAgTDIgMlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJIZWFydCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktaGVhcnRcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cImN1cnJlbnRjb2xvclwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5zdHJva2UoKX0+XG4gICAgICAgIDxwYXRoIGQ9XCJNNCAxNiBDMSAxMiAyIDYgNyA0IDEyIDIgMTUgNiAxNiA4IDE3IDYgMjEgMiAyNiA0IDMxIDYgMzEgMTIgMjggMTYgMjUgMjAgMTYgMjggMTYgMjggMTYgMjggNyAyMCA0IDE2IFpcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2VhcmNoKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS1zZWFyY2hcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjE0XCIgY3k9XCIxNFwiIHI9XCIxMlwiIC8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMjMgMjMgTDMwIDMwXCIgIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJFeHRlcm5hbCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktZXh0ZXJuYWxcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0xNCA5IEwzIDkgMyAyOSAyMyAyOSAyMyAxOCBNMTggNCBMMjggNCAyOCAxNCBNMjggNCBMMTQgMThcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGFnKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS10YWdcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjI0XCIgY3k9XCI4XCIgcj1cIjJcIiAvPlxuICAgICAgICA8cGF0aCBkPVwiTTIgMTggTDE4IDIgMzAgMiAzMCAxNCAxNCAzMCBaXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRyYXNoKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGlkPVwiaS10cmFzaFwiIHZpZXdCb3g9XCIwIDAgMzIgMzJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRjb2xvclwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0cm9rZS13aWR0aD17dGhpcy5wcm9wcy5zdHJva2UgfHwgXCIyXCJ9PlxuICAgICAgICA8cGF0aCBkPVwiTTI4IDYgTDYgNiA4IDMwIDI0IDMwIDI2IDYgNCA2IE0xNiAxMiBMMTYgMjQgTTIxIDEyIEwyMCAyNCBNMTEgMTIgTDEyIDI0IE0xMiA2IEwxMyAyIDE5IDIgMjAgNlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJSaWdodENoZXZyb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzdmcgaWQ9XCJpLWNoZXZyb24tcmlnaHRcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0xMiAzMCBMMjQgMTYgMTIgMlwiIC8+XG4gICAgICA8L3N2Zz5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZXR0aW5ncygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktc2V0dGluZ3NcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Y29sb3JcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBzdHJva2Utd2lkdGg9e3RoaXMucHJvcHMuc3Ryb2tlIHx8IFwiMlwifT5cbiAgICAgICAgPHBhdGggZD1cIk0xMyAyIEwxMyA2IDExIDcgOCA0IDQgOCA3IDExIDYgMTMgMiAxMyAyIDE5IDYgMTkgNyAyMSA0IDI0IDggMjggMTEgMjUgMTMgMjYgMTMgMzAgMTkgMzAgMTkgMjYgMjEgMjUgMjQgMjggMjggMjQgMjUgMjEgMjYgMTkgMzAgMTkgMzAgMTMgMjYgMTMgMjUgMTEgMjggOCAyNCA0IDIxIDcgMTkgNiAxOSAyIFpcIiAvPlxuICAgICAgICA8Y2lyY2xlIGN4PVwiMTZcIiBjeT1cIjE2XCIgcj1cIjRcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTWVzc2FnZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBpZD1cImktbXNnXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudGNvbG9yXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlLXdpZHRoPXt0aGlzLnByb3BzLnN0cm9rZSB8fCBcIjJcIn0+XG4gICAgICAgIDxwYXRoIGQ9XCJNMiA0IEwzMCA0IDMwIDIyIDE2IDIyIDggMjkgOCAyMiAyIDIyIFpcIiAvPlxuICAgICAgPC9zdmc+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nbyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGEgY2xhc3NOYW1lPVwibG9nb1wiIGhyZWY9XCJodHRwczovL2dldGtvem1vcy5jb21cIj5cbiAgICAgICAgPGltZyBzcmM9e2Nocm9tZS5leHRlbnNpb24uZ2V0VVJMKFwiaW1hZ2VzL2ljb24xMjgucG5nXCIpfSB0aXRsZT1cIk9wZW4gS296bW9zXCIgLz5cbiAgICAgIDwvYT5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW51IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc2V0VGl0bGUodGl0bGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgdGl0bGUgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICB7dGhpcy5zdGF0ZS50aXRsZSB8fCBcIlwifVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImJ1dHRvbnNcIj5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGljb249XCJjYWxlbmRhclwiXG4gICAgICAgICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLnNldFRpdGxlKCdSZWNlbnRseSBWaXNpdGVkJyl9XG4gICAgICAgICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMuc2V0VGl0bGUoKX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vcGVuUmVjZW50KCl9IC8+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgIGljb249XCJoZWFydFwiXG4gICAgICAgICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLnNldFRpdGxlKCdCb29rbWFya3MnKX1cbiAgICAgICAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy5zZXRUaXRsZSgpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5Cb29rbWFya3MoKX0gLz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgIGljb249XCJmaXJlXCJcbiAgICAgICAgICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLnNldFRpdGxlKCdNb3N0IFZpc2l0ZWQnKX1cbiAgICAgICAgICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMuc2V0VGl0bGUoKX1cbiAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub3BlblRvcCgpfSAvPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCBNZXNzYWdpbmcgZnJvbSAnLi4vbGliL21lc3NhZ2luZydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnJvbU5ld1RhYlRvQmFja2dyb3VuZCBleHRlbmRzIE1lc3NhZ2luZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLm5hbWUgPSAna296bW9zOm5ld3RhYidcbiAgICB0aGlzLnRhcmdldCA9ICdrb3ptb3M6YmFja2dyb3VuZCdcbiAgfVxuXG4gIGxpc3RlbkZvck1lc3NhZ2VzKCkge1xuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihtc2cgPT4gdGhpcy5vblJlY2VpdmUobXNnKSlcbiAgfVxuXG4gIHNlbmRNZXNzYWdlIChtc2csIGNhbGxiYWNrKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobXNnLCBjYWxsYmFjaylcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50LCByZW5kZXIgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBXYWxscGFwZXIgZnJvbSAnLi93YWxscGFwZXInXG5pbXBvcnQgTWVudSBmcm9tIFwiLi9tZW51XCJcbmltcG9ydCBTZWFyY2ggZnJvbSAnLi9zZWFyY2gnXG5pbXBvcnQgTG9nbyBmcm9tICcuL2xvZ28nXG5pbXBvcnQgTWVzc2FnaW5nIGZyb20gXCIuL21lc3NhZ2luZ1wiXG5pbXBvcnQgU2V0dGluZ3MgZnJvbSBcIi4vc2V0dGluZ3NcIlxuXG5jbGFzcyBOZXdUYWIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWVzc2FnaW5nKClcblxuICAgIHRoaXMubG9hZFNldHRpbmdzKClcbiAgICB0aGlzLmNoZWNrSWZEaXNhYmxlZCgpXG4gIH1cblxuICBsb2FkU2V0dGluZ3MoYXZvaWRDYWNoZSkge1xuICAgIHRoaXMubG9hZFNldHRpbmcoJ21pbmltYWxNb2RlJywgYXZvaWRDYWNoZSlcbiAgICB0aGlzLmxvYWRTZXR0aW5nKCdzaG93V2FsbHBhcGVyJywgYXZvaWRDYWNoZSlcbiAgICB0aGlzLmxvYWRTZXR0aW5nKCdlbmFibGVHcmVldGluZycsIGF2b2lkQ2FjaGUpXG4gICAgdGhpcy5sb2FkU2V0dGluZygncmVjZW50Qm9va21hcmtzRmlyc3QnLCBhdm9pZENhY2hlKVxuICB9XG5cbiAgY2hlY2tJZkRpc2FibGVkKCkge1xuICAgIGlmIChsb2NhbFN0b3JhZ2VbJ2lzLWRpc2FibGVkJ10gPT0gJzEnKSB7XG4gICAgICB0aGlzLnNob3dEZWZhdWx0TmV3VGFiKClcbiAgICB9XG5cbiAgICB0aGlzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiAnZ2V0LXNldHRpbmdzLXZhbHVlJywga2V5OiAnZW5hYmxlTmV3VGFiJyB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IHJlc3AuZXJyb3IgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXNwLmNvbnRlbnQudmFsdWUpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlWydpcy1kaXNhYmxlZCddID0gXCIxXCJcbiAgICAgICAgdGhpcy5zaG93RGVmYXVsdE5ld1RhYigpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2NhbFN0b3JhZ2VbJ2lzLWRpc2FibGVkJ10gPSBcIlwiXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGxvYWRTZXR0aW5nKGtleSwgYXZvaWRDYWNoZSkge1xuICAgIGlmICghYXZvaWRDYWNoZSAmJiBsb2NhbFN0b3JhZ2VbJ3NldHRpbmdzLWNhY2hlLScgKyBrZXldKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmFwcGx5U2V0dGluZyhrZXksIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydzZXR0aW5ncy1jYWNoZS0nICsga2V5XSkpXG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIHRoaXMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdnZXQtc2V0dGluZ3MtdmFsdWUnLCBrZXkgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAoIXJlc3AuZXJyb3IpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlWydzZXR0aW5ncy1jYWNoZS0nICsga2V5XSA9IEpTT04uc3RyaW5naWZ5KHJlc3AuY29udGVudC52YWx1ZSlcbiAgICAgICAgdGhpcy5hcHBseVNldHRpbmcoa2V5LCByZXNwLmNvbnRlbnQudmFsdWUpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGFwcGx5U2V0dGluZyhrZXksIHZhbHVlKSB7XG4gICAgY29uc3QgdSA9IHt9XG4gICAgdVtrZXldID0gdmFsdWVcbiAgICB0aGlzLnNldFN0YXRlKHUpXG4gIH1cblxuICBzaG93RGVmYXVsdE5ld1RhYigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5kaXNhYmxlZCkgcmV0dXJuXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG5ld1RhYlVSTDogZG9jdW1lbnQubG9jYXRpb24uaHJlZixcbiAgICAgIGRpc2FibGVkOiB0cnVlXG4gICAgfSlcblxuXHRcdGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIGZ1bmN0aW9uKHRhYnMpIHtcblx0XHRcdHZhciBhY3RpdmUgPSB0YWJzWzBdLmlkXG5cblx0XHRcdGNocm9tZS50YWJzLnVwZGF0ZShhY3RpdmUsIHtcbiAgICAgICAgdXJsOiAvZmlyZWZveC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgPyBcImFib3V0Om5ld3RhYlwiIDogXCJjaHJvbWUtc2VhcmNoOi8vbG9jYWwtbnRwL2xvY2FsLW50cC5odG1sXCJcbiAgICAgIH0pXG5cdFx0fSlcbiAgfVxuXG4gIHByZXZXYWxscGFwZXIoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB3YWxscGFwZXJJbmRleDogKHRoaXMuc3RhdGUud2FsbHBhcGVySW5kZXggfHwgMCkgLSAxXG4gICAgfSlcbiAgfVxuXG4gIG5leHRXYWxscGFwZXIoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB3YWxscGFwZXJJbmRleDogKHRoaXMuc3RhdGUud2FsbHBhcGVySW5kZXggfHwgMCkgKyAxXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5kaXNhYmxlZCkgcmV0dXJuXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BuZXd0YWIgJHt0aGlzLnN0YXRlLnNob3dXYWxscGFwZXIgPyBcImhhcy13YWxscGFwZXJcIiA6IFwiXCJ9ICR7dGhpcy5zdGF0ZS5taW5pbWFsTW9kZSA/IFwibWluaW1hbFwiIDogXCJcIn1gfT5cbiAgICAgICAge3RoaXMuc3RhdGUubWluaW1hbE1vZGUgPyBudWxsIDogPExvZ28gLz59XG4gICAgICAgIDxTZXR0aW5ncyBvbkNoYW5nZT17KCkgPT4gdGhpcy5sb2FkU2V0dGluZ3ModHJ1ZSl9IG1lc3NhZ2VzPXt0aGlzLm1lc3NhZ2VzfSB0eXBlPVwibmV3dGFiXCIgLz5cbiAgICAgICAgPFNlYXJjaCByZWNlbnRCb29rbWFya3NGaXJzdD17dGhpcy5zdGF0ZS5yZWNlbnRCb29rbWFya3NGaXJzdH0gbmV4dFdhbGxwYXBlcj17KCkgPT4gdGhpcy5uZXh0V2FsbHBhcGVyKCl9IHByZXZXYWxscGFwZXI9eygpID0+IHRoaXMucHJldldhbGxwYXBlcigpfSBlbmFibGVHcmVldGluZz17dGhpcy5zdGF0ZS5lbmFibGVHcmVldGluZ30gc2V0dGluZ3M9e3RoaXMuc2V0dGluZ3N9IC8+XG4gICAgICAgIHsgdGhpcy5zdGF0ZS5zaG93V2FsbHBhcGVyID8gPFdhbGxwYXBlciBpbmRleD17dGhpcy5zdGF0ZS53YWxscGFwZXJJbmRleH0gbWVzc2FnZXM9e3RoaXMubWVzc2FnZXN9IC8+IDogbnVsbCB9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxucmVuZGVyKDxOZXdUYWIgLz4sIGRvY3VtZW50LmJvZHkpXG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCB0aXRsZUZyb21VUkwgZnJvbSBcInRpdGxlLWZyb20tdXJsXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnlTdWdnZXN0aW9ucyBleHRlbmRzIFJvd3Mge1xuICBjb25zdHJ1Y3RvcihyZXN1bHRzLCBzb3J0KSB7XG4gICAgc3VwZXIocmVzdWx0cywgc29ydClcbiAgICB0aGlzLm5hbWUgPSBcInF1ZXJ5LXN1Z2dlc3Rpb25zXCJcbiAgICB0aGlzLnBpbm5lZCA9IHRydWVcbiAgfVxuXG4gIHNob3VsZEJlT3BlbihxdWVyeSkge1xuICAgIHJldHVybiBpc1VSTChxdWVyeSlcbiAgICAvLyByZXR1cm4gcXVlcnkubGVuZ3RoID4gMSAmJiBxdWVyeS50cmltKCkubGVuZ3RoID4gMVxuICB9XG5cbiAgY3JlYXRlVVJMU3VnZ2VzdGlvbnMocXVlcnkpIHtcbiAgICBpZiAoIWlzVVJMKHF1ZXJ5KSkgcmV0dXJuIFtdXG5cbiAgICBjb25zdCB1cmwgPSAvXFx3KzpcXC9cXC8vLnRlc3QocXVlcnkpID8gcXVlcnkgOiBcImh0dHA6Ly9cIiArIHF1ZXJ5XG5cbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICB0aXRsZTogYE9wZW4gXCIke3RpdGxlRnJvbVVSTChxdWVyeSl9XCJgLFxuICAgICAgICB0eXBlOiBcInF1ZXJ5LXN1Z2dlc3Rpb25cIixcbiAgICAgICAgdXJsXG4gICAgICB9XG4gICAgXVxuICB9XG5cbiAgY3JlYXRlU2VhcmNoU3VnZ2VzdGlvbnMocXVlcnkpIHtcbiAgICBpZiAoaXNVUkwocXVlcnkpKSByZXR1cm4gW11cbiAgICBpZiAocXVlcnkuaW5kZXhPZihcInRhZzpcIikgPT09IDAgJiYgcXVlcnkubGVuZ3RoID4gNClcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly9nZXRrb3ptb3MuY29tL3RhZy9cIiArIGVuY29kZVVSSShxdWVyeS5zbGljZSg0KSksXG4gICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgIHRpdGxlOiBgT3BlbiBcIiR7cXVlcnkuc2xpY2UoNCl9XCIgdGFnIGluIEtvem1vc2AsXG4gICAgICAgICAgdHlwZTogXCJzZWFyY2gtcXVlcnlcIlxuICAgICAgICB9XG4gICAgICBdXG5cbiAgICByZXR1cm4gW1xuICAgICAgLyp7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vZ29vZ2xlLmNvbS9zZWFyY2g/cT0nICsgZW5jb2RlVVJJKHF1ZXJ5KSxcbiAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICB0aXRsZTogYFNlYXJjaCBcIiR7cXVlcnl9XCIgb24gR29vZ2xlYCxcbiAgICAgICAgdHlwZTogJ3NlYXJjaC1xdWVyeSdcbiAgICAgIH0sKi9cbiAgICAgIHtcbiAgICAgICAgdXJsOiBcImh0dHBzOi8vZ2V0a296bW9zLmNvbS9zZWFyY2g/cT1cIiArIGVuY29kZVVSSShxdWVyeSksXG4gICAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgICAgdGl0bGU6IGBTZWFyY2ggXCIke3F1ZXJ5fVwiIG9uIEtvem1vc2AsXG4gICAgICAgIHR5cGU6IFwic2VhcmNoLXF1ZXJ5XCJcbiAgICAgIH1cbiAgICBdXG4gIH1cblxuICB1cGRhdGUocXVlcnkpIHtcbiAgICB0aGlzLmFkZChcbiAgICAgIHRoaXMuY3JlYXRlVVJMU3VnZ2VzdGlvbnMocXVlcnkpLmNvbmNhdChcbiAgICAgICAgdGhpcy5jcmVhdGVTZWFyY2hTdWdnZXN0aW9ucyhxdWVyeSlcbiAgICAgIClcbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gaXNVUkwocXVlcnkpIHtcbiAgcmV0dXJuIHF1ZXJ5LnRyaW0oKS5pbmRleE9mKFwiLlwiKSA+IDAgJiYgcXVlcnkuaW5kZXhPZihcIiBcIikgPT09IC0xXG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjZW50Qm9va21hcmtzIGV4dGVuZHMgUm93cyB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMsIHNvcnQpIHtcbiAgICBzdXBlcihyZXN1bHRzLCBzb3J0KVxuICAgIHRoaXMubmFtZSA9IFwicmVjZW50LWJvb2ttYXJrc1wiXG4gICAgdGhpcy50aXRsZSA9IFwiUmVjZW50bHkgQm9va21hcmtlZFwiXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkubGVuZ3RoID09PSAwXG4gIH1cblxuICBmYWlsKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICB9XG5cbiAgdXBkYXRlKHF1ZXJ5KSB7XG4gICAgdGhpcy5yZXN1bHRzLm1lc3NhZ2VzLnNlbmQoXG4gICAgICB7IHRhc2s6IFwiZ2V0LXJlY2VudC1ib29rbWFya3NcIiwgcXVlcnkgfSxcbiAgICAgIHJlc3AgPT4ge1xuICAgICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMuZmFpbChyZXNwLmVycm9yKVxuXG4gICAgICAgIHRoaXMuYWRkKHJlc3AuY29udGVudClcbiAgICAgIH1cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJkZWJvdW5jZS1mblwiXG5cbmltcG9ydCBUb3BTaXRlcyBmcm9tIFwiLi90b3Atc2l0ZXNcIlxuaW1wb3J0IFJlY2VudEJvb2ttYXJrcyBmcm9tIFwiLi9yZWNlbnQtYm9va21hcmtzXCJcbmltcG9ydCBDb2xsZWN0aW9ucyBmcm9tIFwiLi9jb2xsZWN0aW9uc1wiXG5pbXBvcnQgUXVlcnlTdWdnZXN0aW9ucyBmcm9tIFwiLi9xdWVyeS1zdWdnZXN0aW9uc1wiXG5pbXBvcnQgQm9va21hcmtTZWFyY2ggZnJvbSBcIi4vYm9va21hcmstc2VhcmNoXCJcbmltcG9ydCBIaXN0b3J5IGZyb20gXCIuL2hpc3RvcnlcIlxuaW1wb3J0IExpc3RCb29rbWFya3NCeVRhZyBmcm9tIFwiLi9ib29rbWFyay10YWdzXCJcbmltcG9ydCBMaXN0Qm9va21hcmtzQnlDb2xsZWN0aW9uIGZyb20gXCIuL2NvbGxlY3Rpb24tbGlzdFwiXG5pbXBvcnQgTGlzdFNwZWVkRGlhbCBmcm9tIFwiLi9zcGVlZC1kaWFsXCJcbmltcG9ydCBBdXRvY29tcGxldGVCb29rbWFya3MgZnJvbSBcIi4vYXV0b2NvbXBsZXRlLWJvb2ttYXJrc1wiXG5pbXBvcnQgQXV0b2NvbXBsZXRlVG9wU2l0ZXMgZnJvbSBcIi4vYXV0b2NvbXBsZXRlLXRvcC1zaXRlc1wiXG5cbmltcG9ydCBTaWRlYmFyIGZyb20gXCIuL3NpZGViYXJcIlxuaW1wb3J0IFRhZ2JhciBmcm9tIFwiLi90YWdiYXJcIlxuaW1wb3J0IE1lc3NhZ2luZyBmcm9tIFwiLi9tZXNzYWdpbmdcIlxuaW1wb3J0IFVSTEljb24gZnJvbSBcIi4vdXJsLWljb25cIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5cbmNvbnN0IE1BWF9JVEVNUyA9IDVcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzdWx0cyBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNZXNzYWdpbmcoKVxuICAgIHRoaXMuX29uS2V5UHJlc3MgPSBkZWJvdW5jZSh0aGlzLm9uS2V5UHJlc3MuYmluZCh0aGlzKSwgNTApXG4gICAgdGhpcy5fc2VsZWN0ID0gZGVib3VuY2UodGhpcy5zZWxlY3QuYmluZCh0aGlzKSwgMTAwKVxuXG4gICAgdGhpcy5zZXRDYXRlZ29yaWVzKHByb3BzKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmIChwcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdCAhPT0gdGhpcy5wcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdCkge1xuICAgICAgdGhpcy5zZXRDYXRlZ29yaWVzKHByb3BzKVxuICAgIH1cbiAgfVxuXG4gIHNldENhdGVnb3JpZXMocHJvcHMpIHtcbiAgICBjb25zdCBjYXRlZ29yaWVzID0gW1xuICAgICAgbmV3IExpc3RTcGVlZERpYWwodGhpcywgMCksXG4gICAgICBuZXcgUXVlcnlTdWdnZXN0aW9ucyh0aGlzLCAxKSxcbiAgICAgIG5ldyBBdXRvY29tcGxldGVUb3BTaXRlcyh0aGlzLCAyKSxcbiAgICAgIG5ldyBBdXRvY29tcGxldGVCb29rbWFya3ModGhpcywgMyksXG4gICAgICBuZXcgVG9wU2l0ZXModGhpcywgcHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QgPyA1IDogNCksXG4gICAgICBuZXcgUmVjZW50Qm9va21hcmtzKHRoaXMsIHByb3BzLnJlY2VudEJvb2ttYXJrc0ZpcnN0ID8gNCA6IDUpLFxuICAgICAgbmV3IENvbGxlY3Rpb25zKHRoaXMsIDYpLFxuICAgICAgbmV3IExpc3RCb29rbWFya3NCeVRhZyh0aGlzLCA3KSxcbiAgICAgIC8vbmV3IEJvb2ttYXJrU2VhcmNoKHRoaXMsIDcpLFxuICAgICAgbmV3IEhpc3RvcnkodGhpcywgOCksXG4gICAgICBuZXcgTGlzdEJvb2ttYXJrc0J5Q29sbGVjdGlvbih0aGlzLCA5KVxuICAgIF1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY2F0ZWdvcmllc1xuICAgIH0pXG5cbiAgICB0aGlzLnVwZGF0ZShwcm9wcy5xdWVyeSB8fCBcIlwiKVxuICB9XG5cbiAgYWRkUm93cyhjYXRlZ29yeSwgcm93cykge1xuICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgICBsZXQgdGFncyA9IHRoaXMuc3RhdGUudGFnc1xuICAgIGxldCBpID0gcm93cy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAocm93c1tpXS50YWdzKSB7XG4gICAgICAgIHRhZ3MgPSB0YWdzLmNvbmNhdChyb3dzW2ldLnRhZ3MpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGFncyA9IHRhZ3MuZmlsdGVyKHQgPT4gXCJ0YWc6XCIgKyB0ICE9PSB0aGlzLnByb3BzLnF1ZXJ5KVxuXG4gICAgY29uc3QgY29udGVudCA9IHRoaXMudHJpbShcbiAgICAgIHRoaXMuc3RhdGUuY29udGVudC5jb25jYXQoXG4gICAgICAgIHJvd3MubWFwKChyb3csIGkpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93LFxuICAgICAgICAgICAgaW5kZXg6IHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGggKyBpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKVxuICAgIClcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY29udGVudCxcbiAgICAgIHRhZ3NcbiAgICB9KVxuICB9XG5cbiAgY291bnQoZmlsdGVyRm4pIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5jb250ZW50LmZpbHRlcihmaWx0ZXJGbikubGVuZ3RoXG4gIH1cblxuICByZW1vdmVSb3dzKGZpbHRlckZuKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb250ZW50OiB0aGlzLnN0YXRlLmNvbnRlbnQuZmlsdGVyKGZpbHRlckZuKVxuICAgIH0pXG4gIH1cblxuICBjb250ZW50KCkge1xuICAgIGxldCBjb250ZW50ID0gdGhpcy5zdGF0ZS5jb250ZW50XG4gICAgY29udGVudC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBpZiAoYS5yb3cuY2F0ZWdvcnkuc29ydCA8IGIucm93LmNhdGVnb3J5LnNvcnQpIHJldHVybiAtMVxuICAgICAgaWYgKGEucm93LmNhdGVnb3J5LnNvcnQgPiBiLnJvdy5jYXRlZ29yeS5zb3J0KSByZXR1cm4gMVxuXG4gICAgICBpZiAoYS5pbmRleCA8IGIuaW5kZXgpIHJldHVybiAtMVxuICAgICAgaWYgKGEuaW5kZXggPiBiLmluZGV4KSByZXR1cm4gMVxuXG4gICAgICByZXR1cm4gMFxuICAgIH0pXG5cbiAgICBjb25zdCBkaWN0ID0ge31cbiAgICBjb25zdCB1bmlxdWVzID0gY29udGVudC5maWx0ZXIoYyA9PiB7XG4gICAgICBpZiAoZGljdFtjLnJvdy5rZXkoKV0pIHJldHVybiBmYWxzZVxuICAgICAgZGljdFtjLnJvdy5rZXkoKV0gPSB0cnVlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gY29udGVudC5tYXAoKGMsIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByb3c6IGMucm93LFxuICAgICAgICBhYnNJbmRleDogaW5kZXgsXG4gICAgICAgIGluZGV4XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNvbnRlbnRCeUNhdGVnb3J5KCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoID09PSAwKSByZXR1cm4gW11cblxuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQoKVxuXG4gICAgY29uc3Qgc2VsZWN0ZWRDYXRlZ29yeSA9XG4gICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkICYmIGNvbnRlbnRbdGhpcy5zdGF0ZS5zZWxlY3RlZF1cbiAgICAgICAgPyBjb250ZW50W3RoaXMuc3RhdGUuc2VsZWN0ZWRdLnJvdy5jYXRlZ29yeVxuICAgICAgICA6IGNvbnRlbnRbMF0ucm93LmNhdGVnb3J5XG4gICAgY29uc3QgY2F0ZWdvcmllcyA9IFtdXG4gICAgY29uc3QgY2F0ZWdvcmllc01hcCA9IHt9XG5cbiAgICBsZXQgdGFiSW5kZXggPSAyXG4gICAgbGV0IGNhdGVnb3J5ID0gbnVsbFxuICAgIGNvbnRlbnQuZm9yRWFjaCgoYywgaW5kKSA9PiB7XG4gICAgICBpZiAoIWNhdGVnb3J5IHx8IGNhdGVnb3J5Lm5hbWUgIT09IGMucm93LmNhdGVnb3J5Lm5hbWUpIHtcbiAgICAgICAgY2F0ZWdvcnkgPSBjLnJvdy5jYXRlZ29yeVxuICAgICAgICBjYXRlZ29yaWVzTWFwW2NhdGVnb3J5Lm5hbWVdID0ge1xuICAgICAgICAgIHRpdGxlOiBjYXRlZ29yeS50aXRsZSxcbiAgICAgICAgICBuYW1lOiBjYXRlZ29yeS5uYW1lLFxuICAgICAgICAgIHNvcnQ6IGNhdGVnb3J5LnNvcnQsXG4gICAgICAgICAgY29sbGFwc2VkOlxuICAgICAgICAgICAgY29udGVudC5sZW5ndGggPj0gTUFYX0lURU1TICYmXG4gICAgICAgICAgICBzZWxlY3RlZENhdGVnb3J5Lm5hbWUgIT0gY2F0ZWdvcnkubmFtZSAmJlxuICAgICAgICAgICAgISFjYXRlZ29yeS50aXRsZSxcbiAgICAgICAgICByb3dzOiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3JpZXNNYXBbY2F0ZWdvcnkubmFtZV0pXG5cbiAgICAgICAgYy50YWJJbmRleCA9ICsrdGFiSW5kZXhcbiAgICAgIH1cblxuICAgICAgY2F0ZWdvcmllc01hcFtjYXRlZ29yeS5uYW1lXS5yb3dzLnB1c2goYylcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNhdGVnb3JpZXNcbiAgfVxuXG4gIHRyaW0oY29udGVudCkge1xuICAgIGNvbnN0IGNhdGVnb3J5Q291bnRzID0ge31cbiAgICBjb25zdCBwaW5uZWRDb3VudCA9IHRoaXMucGlubmVkUm93Q291bnQoKVxuXG4gICAgY29udGVudCA9IGNvbnRlbnQuZmlsdGVyKGMgPT4ge1xuICAgICAgaWYgKCFjYXRlZ29yeUNvdW50c1tjLnJvdy5jYXRlZ29yeS5uYW1lXSkge1xuICAgICAgICBjYXRlZ29yeUNvdW50c1tjLnJvdy5jYXRlZ29yeS5uYW1lXSA9IDBcbiAgICAgIH1cblxuICAgICAgY2F0ZWdvcnlDb3VudHNbYy5yb3cuY2F0ZWdvcnkubmFtZV0rK1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICBjLnJvdy5jYXRlZ29yeS5waW5uZWQgfHxcbiAgICAgICAgTUFYX0lURU1TIC0gcGlubmVkQ291bnQgPj0gY2F0ZWdvcnlDb3VudHNbYy5yb3cuY2F0ZWdvcnkubmFtZV1cbiAgICAgIClcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbnRlbnRcbiAgfVxuXG4gIHBpbm5lZFJvd0NvdW50KGNvbnRlbnQpIHtcbiAgICBjb250ZW50IHx8IChjb250ZW50ID0gdGhpcy5zdGF0ZS5jb250ZW50KVxuICAgIGNvbnN0IGxlbiA9IGNvbnRlbnQubGVuZ3RoXG5cbiAgICBsZXQgY3RyID0gMFxuICAgIGxldCBpID0gLTFcbiAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICBpZiAoY29udGVudFtpXS5yb3cuY2F0ZWdvcnkucGlubmVkKSB7XG4gICAgICAgIGN0cisrXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGN0clxuICB9XG5cbiAgcmVzZXQocXVlcnksIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgIHtcbiAgICAgICAgc2VsZWN0ZWQ6IDAsXG4gICAgICAgIGNvbnRlbnQ6IFtdLFxuICAgICAgICB0YWdzOiBbXSxcbiAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgcXVlcnk6IHF1ZXJ5IHx8IFwiXCJcbiAgICAgIH0sXG4gICAgICBjYWxsYmFja1xuICAgIClcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIHF1ZXJ5ID0gKHF1ZXJ5IHx8IFwiXCIpLnRyaW0oKVxuICAgIHRoaXMucmVzZXQocXVlcnkpXG4gICAgdGhpcy5zdGF0ZS5jYXRlZ29yaWVzLmZvckVhY2goYyA9PiBjLm9uTmV3UXVlcnkocXVlcnkpKVxuICB9XG5cbiAgc2VsZWN0KGluZGV4KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZDogaW5kZXhcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0TmV4dCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOiAodGhpcy5zdGF0ZS5zZWxlY3RlZCArIDEpICUgdGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aFxuICAgIH0pXG4gIH1cblxuICBzZWxlY3RQcmV2aW91cygpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOlxuICAgICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkID09IDBcbiAgICAgICAgICA/IHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGggLSAxXG4gICAgICAgICAgOiB0aGlzLnN0YXRlLnNlbGVjdGVkIC0gMVxuICAgIH0pXG4gIH1cblxuICBzZWxlY3ROZXh0Q2F0ZWdvcnkoKSB7XG4gICAgbGV0IGN1cnJlbnRDYXRlZ29yeSA9IHRoaXMuc3RhdGUuY29udGVudFt0aGlzLnN0YXRlLnNlbGVjdGVkXS5yb3cuY2F0ZWdvcnlcblxuICAgIGNvbnN0IGxlbiA9IHRoaXMuc3RhdGUuY29udGVudC5sZW5ndGhcbiAgICBsZXQgaSA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRcbiAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5jb250ZW50W2ldLnJvdy5jYXRlZ29yeS5zb3J0ICE9PSBjdXJyZW50Q2F0ZWdvcnkuc29ydCkge1xuICAgICAgICB0aGlzLnNlbGVjdChpKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5jb250ZW50WzBdLnJvdy5jYXRlZ29yeS5zb3J0ICE9PSBjdXJyZW50Q2F0ZWdvcnkuc29ydCkge1xuICAgICAgdGhpcy5zZWxlY3QoMClcbiAgICB9XG4gIH1cblxuICBzZWxlY3RQcmV2aW91c0NhdGVnb3J5KCkge1xuICAgIGxldCBjdXJyZW50Q2F0ZWdvcnkgPSB0aGlzLnN0YXRlLmNvbnRlbnRbdGhpcy5zdGF0ZS5zZWxlY3RlZF0ucm93LmNhdGVnb3J5XG5cbiAgICBjb25zdCBsZW4gPSB0aGlzLnN0YXRlLmNvbnRlbnQubGVuZ3RoXG4gICAgbGV0IGkgPVxuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZCA9PT0gMFxuICAgICAgICA/IGxlbiAtIHRoaXMuc3RhdGUuc2VsZWN0ZWRcbiAgICAgICAgOiB0aGlzLnN0YXRlLnNlbGVjdGVkXG5cbiAgICBsZXQgbmV4dENhdGVnb3J5U29ydCA9IHVuZGVmaW5lZFxuICAgIGxldCBuZXh0Q2F0ZWdvcnlJbmRleCA9IHVuZGVmaW5lZFxuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgaWYgKFxuICAgICAgICBuZXh0Q2F0ZWdvcnlTb3J0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgbmV4dENhdGVnb3J5U29ydCAhPT0gdGhpcy5zdGF0ZS5jb250ZW50W2ldLnJvdy5jYXRlZ29yeS5zb3J0XG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zZWxlY3QobmV4dENhdGVnb3J5SW5kZXgpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zdGF0ZS5jb250ZW50W2ldLnJvdy5jYXRlZ29yeS5zb3J0ICE9PSBjdXJyZW50Q2F0ZWdvcnkuc29ydCkge1xuICAgICAgICBuZXh0Q2F0ZWdvcnlJbmRleCA9IGlcbiAgICAgICAgbmV4dENhdGVnb3J5U29ydCA9IHRoaXMuc3RhdGUuY29udGVudFtpXS5yb3cuY2F0ZWdvcnkuc29ydFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmNvbnRlbnRbMF0ucm93LmNhdGVnb3J5LnNvcnQgIT09IGN1cnJlbnRDYXRlZ29yeS5zb3J0KSB7XG4gICAgICB0aGlzLnNlbGVjdCgwKVxuICAgIH1cbiAgfVxuXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgIGlmIChuZXh0UHJvcHMucXVlcnkgIT09IHRoaXMucHJvcHMucXVlcnkpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG5leHRTdGF0ZS5jb250ZW50Lmxlbmd0aCAhPT0gdGhpcy5zdGF0ZS5jb250ZW50Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobmV4dFN0YXRlLnNlbGVjdGVkICE9PSB0aGlzLnN0YXRlLnNlbGVjdGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChuZXh0UHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QgIT09IHRoaXMucHJvcHMucmVjZW50Qm9va21hcmtzRmlyc3QpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLl9vbktleVByZXNzLCBmYWxzZSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5fb25LZXlQcmVzcywgZmFsc2UpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHByb3BzLnF1ZXJ5ICE9PSB0aGlzLnByb3BzLnF1ZXJ5KSB7XG4gICAgICB0aGlzLnVwZGF0ZShwcm9wcy5xdWVyeSB8fCBcIlwiKVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdCAhPT0gdGhpcy5wcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdCkge1xuICAgICAgdGhpcy5zZXRDYXRlZ29yaWVzKHByb3BzKVxuICAgIH1cbiAgfVxuXG4gIG9uS2V5UHJlc3MoZSkge1xuICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgIC8vIGVudGVyXG4gICAgICB0aGlzLnN0YXRlLmNvbnRlbnRbdGhpcy5zdGF0ZS5zZWxlY3RlZF0ucm93Lm9uUHJlc3NFbnRlcigpXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gOSB8fCAoZS5rZXlDb2RlID09PSA0MCAmJiBlLmN0cmxLZXkpKSB7XG4gICAgICAvLyB0YWIga2V5IG9yIGN0cmwrZG93blxuICAgICAgdGhpcy5zZWxlY3ROZXh0Q2F0ZWdvcnkoKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM4ICYmIGUuY3RybEtleSkge1xuICAgICAgLy8gY3RybCt1cFxuICAgICAgdGhpcy5zZWxlY3RQcmV2aW91c0NhdGVnb3J5KClcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDQwKSB7XG4gICAgICAvLyBkb3duIGFycm93XG4gICAgICB0aGlzLnNlbGVjdE5leHQoKVxuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDM4KSB7XG4gICAgICAvLyB1cCBhcnJvd1xuICAgICAgdGhpcy5zZWxlY3RQcmV2aW91cygpXG4gICAgfSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgZS5rZXlDb2RlID09IDM3KSB7XG4gICAgICB0aGlzLnByb3BzLnByZXZXYWxscGFwZXIoKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgZS5rZXlDb2RlID09IDM5KSB7XG4gICAgICB0aGlzLnByb3BzLm5leHRXYWxscGFwZXIoKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuY291bnRlciA9IDBcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YHJlc3VsdHMgJHt0aGlzLnN0YXRlLnRhZ3MubGVuZ3RoID8gXCJoYXMtdGFnc1wiIDogXCJcIn1gfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsaW5rc1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzdWx0cy1jYXRlZ29yaWVzXCI+XG4gICAgICAgICAgICB7dGhpcy5jb250ZW50QnlDYXRlZ29yeSgpLm1hcChjYXRlZ29yeSA9PlxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckNhdGVnb3J5KGNhdGVnb3J5KVxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U2lkZWJhclxuICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IHRoaXMudXBkYXRlKCl9XG4gICAgICAgICAgICBzZWxlY3RlZD17XG4gICAgICAgICAgICAgIHRoaXMuY29udGVudCgpW3RoaXMuc3RhdGUuc2VsZWN0ZWRdICYmXG4gICAgICAgICAgICAgIHRoaXMuY29udGVudCgpW3RoaXMuc3RhdGUuc2VsZWN0ZWRdLnJvd1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVzc2FnZXM9e3RoaXMubWVzc2FnZXN9XG4gICAgICAgICAgICBvblVwZGF0ZVRvcFNpdGVzPXsoKSA9PiB0aGlzLm9uVXBkYXRlVG9wU2l0ZXMoKX1cbiAgICAgICAgICAgIHVwZGF0ZUZuPXsoKSA9PiB0aGlzLnVwZGF0ZSh0aGlzLnByb3BzLnF1ZXJ5IHx8IFwiXCIpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhclwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8VGFnYmFyXG4gICAgICAgICAgcXVlcnk9e3RoaXMucHJvcHMucXVlcnl9XG4gICAgICAgICAgb3BlblRhZz17dGhpcy5wcm9wcy5vcGVuVGFnfVxuICAgICAgICAgIGNvbnRlbnQ9e3RoaXMuc3RhdGUudGFnc31cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNhdGVnb3J5KGMpIHtcbiAgICBjb25zdCBvdmVyZmxvdyA9XG4gICAgICBjLmNvbGxhcHNlZCAmJlxuICAgICAgdGhpcy5zdGF0ZS5jb250ZW50W3RoaXMuc3RhdGUuc2VsZWN0ZWRdLnJvdy5jYXRlZ29yeS5zb3J0IDwgYy5zb3J0ICYmXG4gICAgICB0aGlzLmNvdW50ZXIgPCBNQVhfSVRFTVNcbiAgICAgICAgPyBjLnJvd3Muc2xpY2UoMCwgTUFYX0lURU1TIC0gdGhpcy5jb3VudGVyKVxuICAgICAgICA6IFtdXG4gICAgY29uc3QgY29sbGFwc2VkID0gYy5yb3dzLnNsaWNlKG92ZXJmbG93Lmxlbmd0aCwgTUFYX0lURU1TKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgY2F0ZWdvcnkgJHtjLmNvbGxhcHNlZCA/IFwiY29sbGFwc2VkXCIgOiBcIlwifWB9PlxuICAgICAgICB7dGhpcy5yZW5kZXJDYXRlZ29yeVRpdGxlKGMpfVxuICAgICAgICB7b3ZlcmZsb3cubGVuZ3RoID4gMCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXJvd3Mgb3ZlcmZsb3dcIj5cbiAgICAgICAgICAgIHtvdmVyZmxvdy5tYXAoYyA9PiB0aGlzLnJlbmRlclJvdyhjLnJvdywgYy5pbmRleCkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAge2NvbGxhcHNlZC5sZW5ndGggPiAwID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktcm93c1wiPlxuICAgICAgICAgICAge2NvbGxhcHNlZC5tYXAoYyA9PiB0aGlzLnJlbmRlclJvdyhjLnJvdywgYy5pbmRleCkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNhdGVnb3J5VGl0bGUoYykge1xuICAgIGlmICghYy50aXRsZSkgcmV0dXJuXG5cbiAgICBsZXQgdGl0bGUgPSBjLnRpdGxlXG4gICAgaWYgKHR5cGVvZiB0aXRsZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aXRsZSA9IGMudGl0bGUodGhpcy5wcm9wcy5xdWVyeSlcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICA8aDEgb25DbGljaz17KCkgPT4gdGhpcy5zZWxlY3QoYy5yb3dzWzBdLmFic0luZGV4KX0+XG4gICAgICAgICAgPEljb24gc3Ryb2tlPVwiM1wiIG5hbWU9XCJyaWdodENoZXZyb25cIiAvPlxuICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgPC9oMT5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclJvdyhyb3csIGluZGV4KSB7XG4gICAgdGhpcy5jb3VudGVyKytcblxuICAgIHJldHVybiAoXG4gICAgICA8VVJMSWNvblxuICAgICAgICBjb250ZW50PXtyb3d9XG4gICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgb25TZWxlY3Q9e2luZGV4ID0+IHRoaXMuX3NlbGVjdChpbmRleCl9XG4gICAgICAgIHNlbGVjdGVkPXt0aGlzLnN0YXRlLnNlbGVjdGVkID09IGluZGV4fVxuICAgICAgLz5cbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGNsZWFuIGFzIGNsZWFuVVJMIH0gZnJvbSBcInVybHNcIlxuaW1wb3J0IHRpdGxlRnJvbVVSTCBmcm9tIFwidGl0bGUtZnJvbS11cmxcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3cge1xuICBjb25zdHJ1Y3RvcihjYXRlZ29yeSwgeyB0aXRsZSwgZGVzYywgdGFncywgdXJsLCBpc01vcmVCdXR0b24gfSkge1xuICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeVxuICAgIHRoaXMudGl0bGUgPSB0aXRsZVxuICAgIHRoaXMuZGVzYyA9IGRlc2NcbiAgICB0aGlzLnVybCA9IHVybFxuICAgIHRoaXMuaXNNb3JlQnV0dG9uID0gaXNNb3JlQnV0dG9uXG4gICAgdGhpcy50YWdzID0gdGFnc1xuICB9XG5cbiAga2V5KCkge1xuICAgIHJldHVybiB0aGlzLnVybFxuICB9XG5cbiAgb25DbGljaygpIHtcbiAgICBsZXQgdXJsID0gdGhpcy51cmxcblxuICAgIGlmICghL15odHRwcz86XFwvXFwvLy50ZXN0KHVybCkpIHtcbiAgICAgIHVybCA9IFwiaHR0cDovL1wiICsgdXJsXG4gICAgfVxuXG4gICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHVybFxuICB9XG5cbiAgb25QcmVzc0VudGVyKCkge1xuICAgIHRoaXMub25DbGljaygpXG4gIH1cblxuICByZW5kZXJUaXRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy50aXRsZS50cmltKCkgfHwgdGl0bGVGcm9tVVJMKHRoaXMudXJsKVxuICB9XG5cbiAgcmVuZGVyRGVzYygpIHtcbiAgICByZXR1cm4gdGhpcy5kZXNjIHx8IGNsZWFuVVJMKHRoaXMudXJsKVxuICB9XG5cbiAgcmVuZGVyRmlyc3RMZXR0ZXIoKSB7XG4gICAgaWYgKCF0aGlzLnVybCkge1xuICAgICAgcmV0dXJuIHRoaXMudGl0bGUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKVxuICAgIH1cblxuICAgIHJldHVybiBmaW5kSG9zdG5hbWUodGhpcy51cmwpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIC50b1VwcGVyQ2FzZSgpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRIb3N0bmFtZSh1cmwpIHtcbiAgcmV0dXJuIHVybFxuICAgIC5yZXBsYWNlKC9eXFx3KzpcXC9cXC8vLCBcIlwiKVxuICAgIC5zcGxpdChcIi9cIilbMF1cbiAgICAucmVwbGFjZSgvXnd3d1xcLi8sIFwiXCIpXG59XG4iLCJpbXBvcnQgY29uZmlnIGZyb20gXCIuLi9jb25maWdcIlxuaW1wb3J0IFJvdyBmcm9tIFwiLi9yb3dcIlxuXG5jb25zdCBNT1JFX1JFU1VMVFNfVEhSRVNIT0xEID0gNFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHRoaXMucmVzdWx0cyA9IHJlc3VsdHNcbiAgICB0aGlzLnNvcnQgPSBzb3J0XG4gIH1cblxuICBhZGQocm93cykge1xuICAgIHRoaXMucmVzdWx0cy5hZGRSb3dzKHRoaXMsIHJvd3MubWFwKHIgPT4gbmV3IFJvdyh0aGlzLCByKSkpXG4gIH1cblxuICBhZGRNb3JlQnV0dG9uKHJvd3MsIHsgdGl0bGUsIHVybCB9KSB7XG4gICAgY29uc3QgYWxyZWFkeUFkZGVkQ291bnQgPSB0aGlzLnJlc3VsdHMuY291bnQoXG4gICAgICByb3cgPT4gcm93LnJvdy5jYXRlZ29yeS5uYW1lID09PSB0aGlzLm5hbWUgJiYgIXJvdy5yb3cuaXNNb3JlQnV0dG9uXG4gICAgKVxuICAgIGNvbnN0IGxpbWl0ID0gTU9SRV9SRVNVTFRTX1RIUkVTSE9MRCAtIGFscmVhZHlBZGRlZENvdW50XG5cbiAgICBpZiAocm93cy5sZW5ndGggPiBsaW1pdCkge1xuICAgICAgcm93cyA9IHJvd3Muc2xpY2UoMCwgbGltaXQpXG4gICAgfVxuXG4gICAgdGhpcy5yZXN1bHRzLnJlbW92ZVJvd3MoXG4gICAgICByb3cgPT4gcm93LnJvdy5jYXRlZ29yeS5uYW1lICE9PSB0aGlzLm5hbWUgfHwgIXJvdy5yb3cuaXNNb3JlQnV0dG9uXG4gICAgKVxuXG4gICAgcm93cy5wdXNoKHtcbiAgICAgIGlzTW9yZUJ1dHRvbjogdHJ1ZSxcbiAgICAgIHVybDogdXJsIHx8IGNvbmZpZy5ob3N0LFxuICAgICAgdGl0bGU6IHRpdGxlIHx8IFwiTW9yZSByZXN1bHRzXCJcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJvd3NcbiAgfVxuXG4gIGZhaWwoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgJXM6IFwiLCB0aGlzLm5hbWUsIGVycm9yKVxuICB9XG5cbiAgb25OZXdRdWVyeShxdWVyeSkge1xuICAgIHRoaXMubGF0ZXN0UXVlcnkgPSBxdWVyeVxuXG4gICAgaWYgKHRoaXMuc2hvdWxkQmVPcGVuKHF1ZXJ5KSkge1xuICAgICAgdGhpcy51cGRhdGUocXVlcnkpXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hJbnB1dCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZhbHVlOiAnJ1xuICAgIH0pXG5cbiAgICB0aGlzLl9vbkNsaWNrID0gdGhpcy5vbkNsaWNrLmJpbmQodGhpcylcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbiAgICBpZiAocHJvcHMudmFsdWUgJiYgcHJvcHMudmFsdWUudHJpbSgpICE9PSB0aGlzLnN0YXRlLnZhbHVlLnRyaW0oKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHZhbHVlOiBwcm9wcy52YWx1ZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBvbkJsdXIoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmZvY3VzZWQpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c2VkOiBmYWxzZVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLm9uQmx1cigpXG4gIH1cblxuICBvbkZvY3VzKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmZvY3VzZWQpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c2VkOiB0cnVlXG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMub25Gb2N1cygpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBpZiAodGhpcy5pbnB1dCkge1xuICAgICAgdGhpcy5pbnB1dC5mb2N1cygpXG4gICAgfVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgcmV0dXJuIG5leHRTdGF0ZS52YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uQ2xpY2spXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkNsaWNrKVxuICB9XG5cbiAgb25DbGljayhlKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudmFsdWUgPT09ICcnICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudC13cmFwcGVyIC5jb250ZW50JykuY29udGFpbnMoZS50YXJnZXQpICYmICFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2J1dHRvbicpKSB7XG4gICAgICB0aGlzLm9uQmx1cigpXG4gICAgfVxuICB9XG5cbiAgb25RdWVyeUNoYW5nZSh2YWx1ZSwga2V5Q29kZSwgZXZlbnQpIHtcbiAgICBpZiAodmFsdWUudHJpbSgpICE9PSBcIlwiKSB7XG4gICAgICB0aGlzLm9uRm9jdXMoKVxuICAgIH1cblxuICAgIGlmIChrZXlDb2RlID09PSAxMykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25QcmVzc0VudGVyKHZhbHVlKVxuICAgIH1cblxuICAgIGlmIChrZXlDb2RlID09PSAyNykge1xuICAgICAgcmV0dXJuIHRoaXMub25CbHVyKClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWUgfSlcblxuICAgIGlmICh0aGlzLnF1ZXJ5Q2hhbmdlVGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucXVlcnlDaGFuZ2VUaW1lcilcbiAgICAgIHRoaXMucXVlcnlDaGFuZ2VUaW1lciA9IDA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMub25RdWVyeUNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vblF1ZXJ5Q2hhbmdlKHZhbHVlKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWFyY2gtaW5wdXRcIj5cbiAgICAgICAge3RoaXMucmVuZGVySWNvbigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJJbnB1dCgpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySWNvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEljb24gbmFtZT1cInNlYXJjaFwiIG9uY2xpY2s9eygpID0+IHRoaXMuaW5wdXQuZm9jdXMoKX0gLz5cbiAgICApXG4gIH1cblxuICByZW5kZXJJbnB1dCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGlucHV0IHRhYmluZGV4PVwiMVwiXG4gICAgICAgIHJlZj17ZWwgPT4gdGhpcy5pbnB1dCA9IGVsfVxuICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgIGNsYXNzTmFtZT1cImlucHV0XCJcbiAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggb3IgZW50ZXIgd2Vic2l0ZSBuYW1lLlwiXG4gICAgICAgIG9uRm9jdXM9e2UgPT4gdGhpcy5vbkZvY3VzKCl9XG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMub25RdWVyeUNoYW5nZShlLnRhcmdldC52YWx1ZSwgdW5kZWZpbmVkLCAnY2hhbmdlJyl9XG4gICAgICAgIG9uS2V5VXA9e2UgPT4gdGhpcy5vblF1ZXJ5Q2hhbmdlKGUudGFyZ2V0LnZhbHVlLCBlLmtleUNvZGUsICdrZXkgdXAnKX1cbiAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5vbkZvY3VzKCl9XG4gICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSAvPlxuICAgIClcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgQ29tcG9uZW50IH0gZnJvbSBcInByZWFjdFwiXG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImRlYm91bmNlLWZuXCJcbmltcG9ydCBDb250ZW50IGZyb20gXCIuL2NvbnRlbnRcIlxuaW1wb3J0IFNlYXJjaElucHV0IGZyb20gXCIuL3NlYXJjaC1pbnB1dFwiXG5pbXBvcnQgUmVzdWx0cyBmcm9tIFwiLi9yZXN1bHRzXCJcbmltcG9ydCBNZXNzYWdpbmcgZnJvbSBcIi4vbWVzc2FnaW5nXCJcbmltcG9ydCBHcmVldGluZyBmcm9tIFwiLi9ncmVldGluZ1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNZXNzYWdpbmcoKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpZDogMCxcbiAgICAgIHJvd3M6IHt9LFxuICAgICAgcm93c0F2YWlsYWJsZTogNSxcbiAgICAgIHF1ZXJ5OiBcIlwiLFxuICAgICAgZm9jdXNlZDogZmFsc2VcbiAgICB9KVxuXG4gICAgdGhpcy5fb25RdWVyeUNoYW5nZSA9IGRlYm91bmNlKHRoaXMub25RdWVyeUNoYW5nZS5iaW5kKHRoaXMpLCAyNTApXG4gIH1cblxuICBpZCgpIHtcbiAgICByZXR1cm4gKyt0aGlzLnN0YXRlLmlkXG4gIH1cblxuICBvbkZvY3VzKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9jdXNlZDogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBvbkJsdXIoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c2VkOiBmYWxzZVxuICAgIH0pXG4gIH1cblxuICBvblByZXNzRW50ZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMubmF2aWdhdGVUbyh0aGlzLnN0YXRlLnNlbGVjdGVkLnVybClcbiAgICB9XG4gIH1cblxuICBvblNlbGVjdChyb3cpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZCAmJiB0aGlzLnN0YXRlLnNlbGVjdGVkLmlkID09PSByb3cuaWQpIHJldHVyblxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWxlY3RlZDogcm93XG4gICAgfSlcbiAgfVxuXG4gIG9uUXVlcnlDaGFuZ2UocXVlcnkpIHtcbiAgICBxdWVyeSA9IHF1ZXJ5LnRyaW0oKVxuXG4gICAgaWYgKHF1ZXJ5ID09PSB0aGlzLnN0YXRlLnF1ZXJ5KSByZXR1cm5cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcm93czoge30sXG4gICAgICByb3dzQXZhaWxhYmxlOiA1LFxuICAgICAgc2VsZWN0ZWQ6IG51bGwsXG4gICAgICBpZDogMCxcbiAgICAgIHF1ZXJ5XG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPENvbnRlbnQgd2FsbHBhcGVyPXt0aGlzLnByb3BzLndhbGxwYXBlcn0gZm9jdXNlZD17dGhpcy5zdGF0ZS5mb2N1c2VkfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250ZW50LWlubmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuZW5hYmxlR3JlZXRpbmcgPyAoXG4gICAgICAgICAgICA8R3JlZXRpbmcgbmFtZT17dGhpcy5zdGF0ZS51c2VybmFtZX0gbWVzc2FnZXM9e3RoaXMubWVzc2FnZXN9IC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPFNlYXJjaElucHV0XG4gICAgICAgICAgICBvblByZXNzRW50ZXI9eygpID0+IHRoaXMub25QcmVzc0VudGVyKCl9XG4gICAgICAgICAgICBvblF1ZXJ5Q2hhbmdlPXt0aGlzLl9vblF1ZXJ5Q2hhbmdlfVxuICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gdGhpcy5vbkZvY3VzKCl9XG4gICAgICAgICAgICBvbkJsdXI9eygpID0+IHRoaXMub25CbHVyKCl9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5xdWVyeX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxSZXN1bHRzXG4gICAgICAgICAgICByZWNlbnRCb29rbWFya3NGaXJzdD17dGhpcy5wcm9wcy5yZWNlbnRCb29rbWFya3NGaXJzdH1cbiAgICAgICAgICAgIG5leHRXYWxscGFwZXI9e3RoaXMucHJvcHMubmV4dFdhbGxwYXBlcn1cbiAgICAgICAgICAgIHByZXZXYWxscGFwZXI9e3RoaXMucHJvcHMucHJldldhbGxwYXBlcn1cbiAgICAgICAgICAgIG9wZW5UYWc9e3RhZyA9PiB0aGlzLl9vblF1ZXJ5Q2hhbmdlKFwidGFnOlwiICsgdGFnKX1cbiAgICAgICAgICAgIG9wZW5Db2xsZWN0aW9uPXt0YWcgPT4gdGhpcy5fb25RdWVyeUNoYW5nZShcImluOlwiICsgdGFnKX1cbiAgICAgICAgICAgIGZvY3VzZWQ9e3RoaXMuc3RhdGUuZm9jdXNlZH1cbiAgICAgICAgICAgIHF1ZXJ5PXt0aGlzLnN0YXRlLnF1ZXJ5fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhclwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Db250ZW50PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclJlc3VsdHMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzdWx0c1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHMtcm93c1wiIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIHNvcnRMaWtlcyhhLCBiKSB7XG4gIGlmIChhLmxpa2VkX2F0IDwgYi5saWtlZF9hdCkgcmV0dXJuIDFcbiAgaWYgKGEubGlrZWRfYXQgPiBiLmxpa2VkX2F0KSByZXR1cm4gLTFcbiAgcmV0dXJuIDBcbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IEljb24gZnJvbSBcIi4vaWNvblwiXG5pbXBvcnQgc2VjdGlvbnMgZnJvbSAnLi4vY2hyb21lL3NldHRpbmdzLXNlY3Rpb25zJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR0aW5ncyBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICBzZWN0aW9ucy5mb3JFYWNoKHMgPT4gdGhpcy5sb2FkU2VjdGlvbihzKSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKSB7XG4gICAgc2VjdGlvbnMuZm9yRWFjaChzID0+IHRoaXMubG9hZFNlY3Rpb24ocykpXG4gIH1cblxuICBsb2FkU2VjdGlvbihzKSB7XG4gICAgdGhpcy5wcm9wcy5tZXNzYWdlcy5zZW5kKHsgdGFzazogJ2dldC1zZXR0aW5ncy12YWx1ZScsIGtleTogcy5rZXkgfSwgcmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHRoaXMub25FcnJvcihyZXNwLmVycm9yKVxuICAgICAgY29uc3QgdSA9IHt9XG4gICAgICB1W3Mua2V5XSA9IHJlc3AuY29udGVudC52YWx1ZVxuICAgICAgdGhpcy5zZXRTdGF0ZSh1KVxuICAgIH0pXG4gIH1cblxuICBvbkNoYW5nZSh2YWx1ZSwgb3B0aW9ucykge1xuICAgIHRoaXMucHJvcHMubWVzc2FnZXMuc2VuZCh7IHRhc2s6ICdzZXQtc2V0dGluZ3MtdmFsdWUnLCBrZXk6IG9wdGlvbnMua2V5LCB2YWx1ZSB9LCByZXNwID0+IHtcbiAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gdGhpcy5vbkVycm9yKHJlc3AuZXJyb3IpXG5cbiAgICAgIGlmICh0aGlzLnByb3BzLm9uQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBvbkVycm9yKGVycm9yKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlcnJvclxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5wcm9wcy5vbkVycm9yKSB7XG4gICAgICB0aGlzLnByb3BzLm9uRXJyb3IoZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YHNldHRpbmdzICR7dGhpcy5zdGF0ZS5vcGVuID8gXCJvcGVuXCIgOiBcIlwifWB9PlxuICAgICAgICA8SWNvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgb3BlbjogdHJ1ZSB9KX0gbmFtZT1cInNldHRpbmdzXCIgLz5cbiAgICAgICAge3RoaXMucmVuZGVyU2V0dGluZ3MoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNldHRpbmdzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cbiAgICAgICAge3RoaXMucmVuZGVyQ2xvc2VCdXR0b24oKX1cbiAgICAgICAgPGgxPlNldHRpbmdzPC9oMT5cbiAgICAgICAgPGgyPkdvdCBmZWVkYmFjayAvIHJlY29tbWVuZGF0aW9uID8gPGEgaHJlZj1cIm1haWx0bzphemVyQGdldGtvem1vcy5jb21cIj5mZWVkYmFjazwvYT4gYW55dGltZS48L2gyPlxuICAgICAgICB7dGhpcy5yZW5kZXJTZWN0aW9ucygpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvb3RlclwiPlxuICAgICAgICAgIDxidXR0b24gb25jbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG9wZW46IGZhbHNlIH0pfT5cbiAgICAgICAgICAgIERvbmVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJTZWN0aW9ucygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uc1wiPlxuICAgICAgICB7c2VjdGlvbnMubWFwKHMgPT4gdGhpcy5yZW5kZXJTZWN0aW9uKHMpKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNlY3Rpb24ob3B0aW9ucykge1xuICAgIGlmICh0aGlzLnByb3BzLnR5cGUgJiYgIW9wdGlvbnNbdGhpcy5wcm9wcy50eXBlXSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT17YHNldHRpbmcgJHtvcHRpb25zLmtleX1gfT5cbiAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImNoZWNrYm94XCIgaWQ9e29wdGlvbnMua2V5fSBuYW1lPXtvcHRpb25zLmtleX0gdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17dGhpcy5zdGF0ZVtvcHRpb25zLmtleV19IG9uQ2hhbmdlPXtlID0+IHRoaXMub25DaGFuZ2UoZS50YXJnZXQuY2hlY2tlZCwgb3B0aW9ucyl9IC8+XG4gICAgICAgIDxsYWJlbCB0aXRsZT17b3B0aW9ucy5kZXNjfSBodG1sRm9yPXtvcHRpb25zLmtleX0+e29wdGlvbnMudGl0bGV9PC9sYWJlbD5cbiAgICAgICAgPHA+e29wdGlvbnMuZGVzY308L3A+XG4gICAgICA8L3NlY3Rpb24+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2xvc2VCdXR0b24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxJY29uIHN0cm9rZT1cIjNcIiBuYW1lPVwiY2xvc2VcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgb3BlbjogZmFsc2UgfSl9IC8+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCB7IGNsZWFuIGFzIGNsZWFuVVJMIH0gZnJvbSBcInVybHNcIlxuaW1wb3J0IHJlbGF0aXZlRGF0ZSBmcm9tIFwicmVsYXRpdmUtZGF0ZVwiXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi9pY29uXCJcbmltcG9ydCBVUkxJbWFnZSBmcm9tIFwiLi91cmwtaW1hZ2VcIlxuaW1wb3J0IHsgaGlkZSBhcyBoaWRlVG9wU2l0ZSB9IGZyb20gXCIuL3RvcC1zaXRlc1wiXG5pbXBvcnQgeyBmaW5kSG9zdG5hbWUgfSBmcm9tIFwiLi91cmwtaW1hZ2VcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWRlYmFyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgIGlmICghcHJvcHMuc2VsZWN0ZWQpIHJldHVyblxuICAgIHByb3BzLm1lc3NhZ2VzLnNlbmQoeyB0YXNrOiBcImdldC1saWtlXCIsIHVybDogcHJvcHMuc2VsZWN0ZWQudXJsIH0sIHJlc3AgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxpa2U6IHJlc3AuY29udGVudC5saWtlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBkZWxldGVUb3BTaXRlKCkge1xuICAgIGhpZGVUb3BTaXRlKHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsKVxuICAgIHRoaXMucHJvcHMudXBkYXRlRm4oKVxuICB9XG5cbiAgdG9nZ2xlTGlrZSgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5saWtlKSB0aGlzLnVubGlrZSgpXG4gICAgZWxzZSB0aGlzLmxpa2UoKVxuICB9XG5cbiAgbGlrZSgpIHtcbiAgICB0aGlzLnByb3BzLm1lc3NhZ2VzLnNlbmQoXG4gICAgICB7IHRhc2s6IFwibGlrZVwiLCB1cmw6IHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsIH0sXG4gICAgICByZXNwID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgbGlrZTogcmVzcC5jb250ZW50Lmxpa2VcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICApXG5cbiAgICBzZXRUaW1lb3V0KHRoaXMucHJvcHMub25DaGFuZ2UsIDEwMDApXG4gIH1cblxuICB1bmxpa2UoKSB7XG4gICAgdGhpcy5wcm9wcy5tZXNzYWdlcy5zZW5kKFxuICAgICAgeyB0YXNrOiBcInVubGlrZVwiLCB1cmw6IHRoaXMucHJvcHMuc2VsZWN0ZWQudXJsIH0sXG4gICAgICByZXNwID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgbGlrZTogbnVsbFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIClcblxuICAgIHNldFRpbWVvdXQodGhpcy5wcm9wcy5vbkNoYW5nZSwgMTAwMClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuc2VsZWN0ZWQpIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2lkZWJhclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltYWdlXCI+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwibGlua1wiIGhyZWY9e3RoaXMucHJvcHMuc2VsZWN0ZWQudXJsfSB0YWJpbmRleD1cIi0xXCI+XG4gICAgICAgICAgICA8VVJMSW1hZ2UgY29udGVudD17dGhpcy5wcm9wcy5zZWxlY3RlZH0gLz5cbiAgICAgICAgICAgIDxoMT57dGhpcy5wcm9wcy5zZWxlY3RlZC5yZW5kZXJUaXRsZSgpfTwvaDE+XG4gICAgICAgICAgICA8aDI+e3RoaXMucHJvcHMuc2VsZWN0ZWQucmVuZGVyRGVzYygpfTwvaDI+XG4gICAgICAgICAgPC9hPlxuICAgICAgICAgIHt0aGlzLnJlbmRlckJ1dHRvbnMoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJCdXR0b25zKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNlbGVjdGVkLmJ1dHRvbnMpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnV0dG9uc1wiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLnNlbGVjdGVkLmJ1dHRvbnMoKS5tYXAoYiA9PiB0aGlzLnJlbmRlckJ1dHRvbihiKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbnNcIj5cbiAgICAgICAge3RoaXMucmVuZGVyTGlrZUJ1dHRvbigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tZW50QnV0dG9uKCl9XG4gICAgICAgIHt0aGlzLnByb3BzLnNlbGVjdGVkLnR5cGUgPT09IFwidG9wXCJcbiAgICAgICAgICA/IHRoaXMucmVuZGVyRGVsZXRlVG9wU2l0ZUJ1dHRvbigpXG4gICAgICAgICAgOiBudWxsfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQnV0dG9uKHsgdGl0bGUsIGljb24sIGFjdGlvbiB9KSB7XG4gICAgY29uc3QgdXBkYXRlID0gdGhpcy5wcm9wcy51cGRhdGVGblxuICAgIGNvbnN0IHNlbmRNZXNzYWdlID0gdGhpcy5wcm9wcy5tZXNzYWdlcy5zZW5kLmJpbmQodGhpcy5wcm9wcy5tZXNzYWdlcylcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHRpdGxlPXt0aXRsZX1cbiAgICAgICAgY2xhc3NOYW1lPXtgYnV0dG9uYH1cbiAgICAgICAgb25DbGljaz17KCkgPT4gYWN0aW9uKHsgdXBkYXRlLCBzZW5kTWVzc2FnZSB9KX1cbiAgICAgID5cbiAgICAgICAgPEljb24gbmFtZT17aWNvbn0gLz5cbiAgICAgICAge3RpdGxlfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTGlrZUJ1dHRvbigpIHtcbiAgICBjb25zdCBhZ28gPSB0aGlzLnN0YXRlLmxpa2UgPyByZWxhdGl2ZURhdGUodGhpcy5zdGF0ZS5saWtlLmNyZWF0ZWRBdCkgOiBcIlwiXG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLnN0YXRlLmxpa2VcbiAgICAgID8gXCJEZWxldGUgdGhpcyB3ZWJzaXRlIGZyb20gbXkgYm9va21hcmtzXCJcbiAgICAgIDogXCJCb29rbWFyayB0aGlzIHdlYnNpdGVcIlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgICBjbGFzc05hbWU9e2BidXR0b24gbGlrZS1idXR0b24gJHt0aGlzLnN0YXRlLmxpa2UgPyBcImxpa2VkXCIgOiBcIlwifWB9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMudG9nZ2xlTGlrZSgpfVxuICAgICAgPlxuICAgICAgICA8SWNvbiBuYW1lPVwiaGVhcnRcIiAvPlxuICAgICAgICB7dGhpcy5zdGF0ZS5saWtlID8gYExpa2VkICR7YWdvfWAgOiBcIkxpa2UgSXRcIn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbW1lbnRCdXR0b24oKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmxpa2UpIHJldHVyblxuXG4gICAgY29uc3QgaG9zdG5hbWUgPSBmaW5kSG9zdG5hbWUodGhpcy5zdGF0ZS5saWtlLnVybClcbiAgICBjb25zdCBpc0hvbWVwYWdlID0gY2xlYW5VUkwodGhpcy5zdGF0ZS5saWtlLnVybCkuaW5kZXhPZihcIi9cIikgPT09IC0xXG5cbiAgICBpZiAoIWlzSG9tZXBhZ2UpIHJldHVyblxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxhXG4gICAgICAgIHRpdGxlPXtgQ29tbWVudHMgYWJvdXQgJHtob3N0bmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9e2BidXR0b24gY29tbWVudC1idXR0b25gfVxuICAgICAgICBocmVmPXtgaHR0cHM6Ly9nZXRrb3ptb3MuY29tL3NpdGUvJHtob3N0bmFtZX1gfVxuICAgICAgPlxuICAgICAgICA8SWNvbiBuYW1lPVwibWVzc2FnZVwiIC8+XG4gICAgICAgIENvbW1lbnRzXG4gICAgICA8L2E+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRGVsZXRlVG9wU2l0ZUJ1dHRvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICB0aXRsZT1cIkRlbGV0ZSBJdCBGcm9tIEZyZXF1ZW50bHkgVmlzaXRlZFwiXG4gICAgICAgIGNsYXNzTmFtZT1cImJ1dHRvbiBkZWxldGUtYnV0dG9uXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5kZWxldGVUb3BTaXRlKCl9XG4gICAgICA+XG4gICAgICAgIDxJY29uIG5hbWU9XCJ0cmFzaFwiIC8+XG4gICAgICAgIERlbGV0ZSBJdFxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpc3RTcGVlZERpYWwgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy5uYW1lID0gXCJzcGVlZC1kaWFsXCJcbiAgICB0aGlzLnRpdGxlID0gcXVlcnkgPT4gYFNwZWVkIERpYWxgXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgcXVlcnkubGVuZ3RoID4gMCAmJiAhcXVlcnkuc3RhcnRzV2l0aChcImluOlwiKSAmJiAhcXVlcnkuc3RhcnRzV2l0aChcInRhZzpcIilcbiAgICApXG4gIH1cblxuICBhc3luYyB1cGRhdGUocXVlcnkpIHtcbiAgICBjb25zdCBzcGVlZGRpYWwgPSBhd2FpdCB0aGlzLmdldFNwZWVkRGlhbEJ5S2V5KHF1ZXJ5KVxuXG4gICAgaWYgKHNwZWVkZGlhbCkge1xuICAgICAgdGhpcy5hZGQoW3NwZWVkZGlhbF0pXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0U3BlZWREaWFsQnlLZXkoa2V5KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKFxuICAgICAgICB7XG4gICAgICAgICAgdGFzazogXCJnZXQtc3BlZWQtZGlhbFwiLFxuICAgICAgICAgIGtleVxuICAgICAgICB9LFxuICAgICAgICByZXNwID0+IHtcbiAgICAgICAgICBpZiAocmVzcC5lcnJvcikgcmV0dXJuIHJlamVjdChyZXNwLmVycm9yKVxuICAgICAgICAgIHJlc29sdmUocmVzcC5jb250ZW50LnNwZWVkZGlhbClcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBnZXRMaW5rQnlVcmwodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVzdWx0cy5tZXNzYWdlcy5zZW5kKHsgdGFzazogXCJnZXQtbGlrZVwiLCB1cmwgfSwgcmVzcCA9PiB7XG4gICAgICAgIGlmIChyZXNwLmVycm9yKSByZXR1cm4gcmVqZWN0KHJlc3AuZXJyb3IpXG4gICAgICAgIHJlc29sdmUocmVzcC5jb250ZW50Lmxpa2UpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VRdWVyeShxdWVyeSkge1xuICBpZiAoL15pbjpcXFwiW1xcd1xcc10rXFxcIiQvLnRlc3QocXVlcnkpKSB7XG4gICAgcmV0dXJuIFtxdWVyeS5zbGljZSg0LCAtMSkudHJpbSgpXVxuICB9XG5cbiAgaWYgKC9eaW46XFxcIltcXHdcXHNdK1xcXCIgW1xcd1xcc10rJC8udGVzdChxdWVyeSkpIHtcbiAgICBjb25zdCBjbG9zaW5nUXVvdGVBdCA9IHF1ZXJ5LmluZGV4T2YoJ1wiICcsIDQpXG4gICAgY29uc3QgY29sbGVjdGlvbiA9IHF1ZXJ5LnNsaWNlKDQsIGNsb3NpbmdRdW90ZUF0KVxuICAgIGNvbnN0IGZpbHRlciA9IHF1ZXJ5LnNsaWNlKGNsb3NpbmdRdW90ZUF0KVxuICAgIHJldHVybiBbY29sbGVjdGlvbi50cmltKCksIGZpbHRlci50cmltKCldXG4gIH1cblxuICBpZiAoL15pbjpcXHcrIFtcXHdcXHNdKyQvLnRlc3QocXVlcnkpKSB7XG4gICAgY29uc3Qgc2VwYXJhdGluZ1NwYWNlQXQgPSBxdWVyeS5pbmRleE9mKFwiIFwiLCAzKVxuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBxdWVyeS5zbGljZSgzLCBzZXBhcmF0aW5nU3BhY2VBdClcbiAgICBjb25zdCBmaWx0ZXIgPSBxdWVyeS5zbGljZShzZXBhcmF0aW5nU3BhY2VBdClcbiAgICByZXR1cm4gW2NvbGxlY3Rpb24udHJpbSgpLCBmaWx0ZXIudHJpbSgpXVxuICB9XG5cbiAgcmV0dXJuIFtxdWVyeS5zbGljZSgzKS50cmltKCldXG59XG4iLCJpbXBvcnQgeyBoLCBDb21wb25lbnQgfSBmcm9tIFwicHJlYWN0XCJcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYWdiYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb250ZW50KCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5jb250ZW50IHx8ICF0aGlzLnByb3BzLmNvbnRlbnQubGVuZ3RoKSByZXR1cm4gW11cblxuICAgIGNvbnN0IGNvcHkgPSB0aGlzLnByb3BzLmNvbnRlbnQuc2xpY2UoKVxuXG4gICAgY29uc3Qgb2NjciA9IHt9XG4gICAgbGV0IGkgPSBjb3B5Lmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIG9jY3JbY29weVtpXV0gPSBvY2NyW2NvcHlbaV1dID8gb2Njcltjb3B5W2ldXSsxIDogMVxuICAgIH1cblxuICAgIGNvbnN0IHVuaXF1ZXMgPSBPYmplY3Qua2V5cyhvY2NyKVxuICAgIHVuaXF1ZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKG9jY3JbYV0gPCBvY2NyW2JdKSByZXR1cm4gMVxuICAgICAgaWYgKG9jY3JbYV0gPiBvY2NyW2JdKSByZXR1cm4gLTFcbiAgICAgIHJldHVybiAwXG4gICAgfSlcblxuICAgIHJldHVybiB1bmlxdWVzXG4gIH1cblxuICBtYXgoKSB7XG4gICAgcmV0dXJuIDEwXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudCgpXG4gICAgaWYgKGNvbnRlbnQubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRhZ2JhclwiPlxuICAgICAgICA8SWNvbiBuYW1lPVwidGFnXCIgc3Ryb2tlPVwiM1wiIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGVyc29uYWwtdGFnc1wiPlxuICAgICAgICAgIHtjb250ZW50LnNsaWNlKDAsIHRoaXMubWF4KCkpLm1hcCh0ID0+IHRoaXMucmVuZGVyVGFnKHQpKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUYWcobmFtZSkge1xuICAgIGNvbnN0IHRpdGxlID0gY2FwaXRhbGl6ZShuYW1lKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGNsYXNzTmFtZT1cInRhZyBidXR0b25cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5UYWcobmFtZSl9IHRpdGxlPXtgT3BlbiBcIiR7dGl0bGV9XCIgdGFnYH0+XG4gICAgICAgIHt0aXRsZX1cbiAgICAgIDwvYT5cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gY2FwaXRhbGl6ZSAodGl0bGUpIHtcbiAgcmV0dXJuIHRpdGxlLnNwbGl0KC9cXHMrLykubWFwKHcgPT4gdy5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgdy5zbGljZSgxKSkuam9pbignICcpXG59XG4iLCJpbXBvcnQgdGl0bGVGcm9tVVJMIGZyb20gXCJ0aXRsZS1mcm9tLXVybFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkKHRpdGxlKSB7XG4gIGNvbnN0IGFic2xlbiA9IHRpdGxlLnJlcGxhY2UoL1teXFx3XSsvZywgJycpLmxlbmd0aFxuICByZXR1cm4gYWJzbGVuID49IDIgJiYgIS9eaHR0cFxcdz86XFwvXFwvLy50ZXN0KHRpdGxlKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKHRpdGxlKSB7XG4gIHJldHVybiB0aXRsZS50cmltKCkucmVwbGFjZSgvXlxcKFxcZCtcXCkvLCAnJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlRnJvbVVSTCh1cmwpIHtcbiAgcmV0dXJuIHRpdGxlRnJvbVVSTCh1cmwpXG59XG4iLCJpbXBvcnQgUm93cyBmcm9tIFwiLi9yb3dzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9wU2l0ZXMgZXh0ZW5kcyBSb3dzIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cywgc29ydCkge1xuICAgIHN1cGVyKHJlc3VsdHMsIHNvcnQpXG4gICAgdGhpcy50aXRsZSA9IFwiRnJlcXVlbnRseSBWaXNpdGVkXCJcbiAgICB0aGlzLm5hbWUgPSBcInRvcFwiXG4gIH1cblxuICBzaG91bGRCZU9wZW4ocXVlcnkpIHtcbiAgICByZXR1cm4gcXVlcnkubGVuZ3RoID09IDBcbiAgfVxuXG4gIHVwZGF0ZShxdWVyeSkge1xuICAgIHJldHVybiB0aGlzLmFsbCgpXG4gIH1cblxuICBhbGwoKSB7XG4gICAgZ2V0KHJvd3MgPT4gdGhpcy5hZGQocm93cy5zbGljZSgwLCA1KSkpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkS296bW9zKHJvd3MpIHtcbiAgbGV0IGkgPSByb3dzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKHJvd3NbaV0udXJsLmluZGV4T2YoXCJnZXRrb3ptb3MuY29tXCIpID4gLTEpIHtcbiAgICAgIHJldHVybiByb3dzXG4gICAgfVxuICB9XG5cbiAgcm93c1s0XSA9IHtcbiAgICB1cmw6IFwiaHR0cHM6Ly9nZXRrb3ptb3MuY29tXCIsXG4gICAgdGl0bGU6IFwiS296bW9zXCJcbiAgfVxuXG4gIHJldHVybiByb3dzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXQoY2FsbGJhY2spIHtcbiAgY2hyb21lLnRvcFNpdGVzLmdldCh0b3BTaXRlcyA9PiB7XG4gICAgY2FsbGJhY2soZmlsdGVyKHRvcFNpdGVzKSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGUodXJsKSB7XG4gIGxldCBoaWRkZW4gPSBnZXRIaWRkZW5Ub3BTaXRlcygpXG4gIGhpZGRlblt1cmxdID0gdHJ1ZVxuICBzZXRIaWRkZW5Ub3BTaXRlcyhoaWRkZW4pXG59XG5cbmZ1bmN0aW9uIGdldEhpZGRlblRvcFNpdGVzKCkge1xuICBsZXQgbGlzdCA9IHtcbiAgICBcImh0dHBzOi8vZ29vZ2xlLmNvbS9cIjogdHJ1ZSxcbiAgICBcImh0dHA6Ly9nb29nbGUuY29tL1wiOiB0cnVlXG4gIH1cblxuICB0cnkge1xuICAgIGxpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtcImhpZGRlbi10b3BsaXN0XCJdKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBzZXRIaWRkZW5Ub3BTaXRlcyhsaXN0KVxuICB9XG5cbiAgcmV0dXJuIGxpc3Rcbn1cblxuZnVuY3Rpb24gc2V0SGlkZGVuVG9wU2l0ZXMobGlzdCkge1xuICBsb2NhbFN0b3JhZ2VbXCJoaWRkZW4tdG9wbGlzdFwiXSA9IEpTT04uc3RyaW5naWZ5KGxpc3QpXG59XG5cbmZ1bmN0aW9uIGZpbHRlcih0b3BTaXRlcykge1xuICBjb25zdCBoaWRlID0gZ2V0SGlkZGVuVG9wU2l0ZXMoKVxuICByZXR1cm4gdG9wU2l0ZXMuZmlsdGVyKHJvdyA9PiAhaGlkZVtyb3cudXJsXSlcbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IGltZyBmcm9tIFwiaW1nXCJcbmltcG9ydCAqIGFzIHRpdGxlcyBmcm9tIFwiLi90aXRsZXNcIlxuaW1wb3J0IFVSTEltYWdlIGZyb20gXCIuL3VybC1pbWFnZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVSTEljb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMucHJvcHMuY29udGVudC51cmwgIT09IG5leHRQcm9wcy5jb250ZW50LnVybCB8fFxuICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZCAhPT0gbmV4dFByb3BzLnNlbGVjdGVkIHx8XG4gICAgICB0aGlzLnByb3BzLnR5cGUgIT09IG5leHRQcm9wcy50eXBlXG4gICAgKVxuICB9XG5cbiAgc2VsZWN0KCkge1xuICAgIHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy5pbmRleClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvKmNvbnN0IGxpbmtUaXRsZSA9IHRoaXMucHJvcHMuY29udGVudC51cmxcbiAgICAgID8gYCR7dGhpcy50aXRsZSgpfSAtICR7Y2xlYW5VUkwodGhpcy5wcm9wcy5jb250ZW50LnVybCl9YFxuICAgICAgOiB0aGlzLnRpdGxlKCkqL1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgaWQ9e3RoaXMucHJvcHMuY29udGVudC5pZH1cbiAgICAgICAgY2xhc3NOYW1lPXtgdXJsaWNvbiAke3RoaXMucHJvcHMuc2VsZWN0ZWQgPyBcInNlbGVjdGVkXCIgOiBcIlwifWB9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMuY29udGVudC5vbkNsaWNrKCl9XG4gICAgICAgIHRpdGxlPXt0aGlzLnByb3BzLmNvbnRlbnQucmVuZGVyVGl0bGUoKX1cbiAgICAgICAgb25Nb3VzZU1vdmU9eygpID0+IHRoaXMuc2VsZWN0KCl9XG4gICAgICA+XG4gICAgICAgIDxVUkxJbWFnZSBjb250ZW50PXt0aGlzLnByb3BzLmNvbnRlbnR9IGljb24tb25seSAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+e3RoaXMucHJvcHMuY29udGVudC5yZW5kZXJUaXRsZSgpfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVybFwiPnt0aGlzLnByb3BzLmNvbnRlbnQucmVuZGVyRGVzYygpfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIC8qdGl0bGUoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC50eXBlID09PSBcInNlYXJjaC1xdWVyeVwiKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5jb250ZW50LnRpdGxlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC50eXBlID09PSBcInVybC1xdWVyeVwiKSB7XG4gICAgICByZXR1cm4gYE9wZW4gJHtjbGVhblVSTCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKX1gXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC50eXBlID09PSBcImNvbGxlY3Rpb25zXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmNvbnRlbnQudGl0bGVcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jb250ZW50LnRpdGxlICYmIHRpdGxlcy5pc1ZhbGlkKHRoaXMucHJvcHMuY29udGVudC50aXRsZSkpIHtcbiAgICAgIHJldHVybiB0aXRsZXMubm9ybWFsaXplKHRoaXMucHJvcHMuY29udGVudC50aXRsZSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGl0bGVzLmdlbmVyYXRlRnJvbVVSTCh0aGlzLnByb3BzLmNvbnRlbnQudXJsKVxuICB9Ki9cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IGltZyBmcm9tIFwiaW1nXCJcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiZGVib3VuY2UtZm5cIlxuaW1wb3J0IHJhbmRvbUNvbG9yIGZyb20gXCJyYW5kb20tY29sb3JcIlxuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCJcblxuZXhwb3J0IGNvbnN0IHBvcHVsYXJJY29ucyA9IHtcbiAgXCJmYWNlYm9vay5jb21cIjpcbiAgICBcImh0dHBzOi8vc3RhdGljLnh4LmZiY2RuLm5ldC9yc3JjLnBocC92My95eC9yL040SF81MEtGcDhpLnBuZ1wiLFxuICBcInR3aXR0ZXIuY29tXCI6XG4gICAgXCJodHRwczovL21hLTAudHdpbWcuY29tL3R3aXR0ZXItYXNzZXRzL3Jlc3BvbnNpdmUtd2ViL3dlYi9sdHIvaWNvbi1pb3MuYTljZDg4NWJjY2JjYWYyZi5wbmdcIixcbiAgXCJ5b3V0dWJlLmNvbVwiOiBcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3l0cy9pbWcvZmF2aWNvbl85Ni12ZmxXOUVjMHcucG5nXCIsXG4gIFwiYW1hem9uLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly9pbWFnZXMtbmEuc3NsLWltYWdlcy1hbWF6b24uY29tL2ltYWdlcy9HLzAxL2FueXdoZXJlL2Ffc21pbGVfMTIweDEyMC5fQ0IzNjgyNDY1NzNfLnBuZ1wiLFxuICBcImdvb2dsZS5jb21cIjpcbiAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vaW1hZ2VzL2JyYW5kaW5nL3Byb2R1Y3RfaW9zLzJ4L2dzYV9pb3NfNjBkcC5wbmdcIixcbiAgXCJ5YWhvby5jb21cIjogXCJodHRwczovL3d3dy55YWhvby5jb20vYXBwbGUtdG91Y2gtaWNvbi1wcmVjb21wb3NlZC5wbmdcIixcbiAgXCJyZWRkaXQuY29tXCI6IFwiaHR0cHM6Ly93d3cucmVkZGl0c3RhdGljLmNvbS9td2ViMngvZmF2aWNvbi8xMjB4MTIwLnBuZ1wiLFxuICBcImluc3RhZ3JhbS5jb21cIjpcbiAgICBcImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vc3RhdGljL2ltYWdlcy9pY28vYXBwbGUtdG91Y2gtaWNvbi0xMjB4MTIwLXByZWNvbXBvc2VkLnBuZy8wMDQ3MDVjOTM1M2YucG5nXCIsXG4gIFwiZ2V0a296bW9zLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly9nZXRrb3ptb3MuY29tL3B1YmxpYy9sb2dvcy9rb3ptb3MtaGVhcnQtbG9nby0xMDBweC5wbmdcIixcbiAgXCJnaXRodWIuY29tXCI6IFwiaHR0cHM6Ly9naXRodWIuZ2l0aHViYXNzZXRzLmNvbS9waW5uZWQtb2N0b2NhdC5zdmdcIixcbiAgXCJnaXN0LmdpdGh1Yi5jb21cIjogXCJodHRwczovL2dpdGh1Yi5naXRodWJhc3NldHMuY29tL3Bpbm5lZC1vY3RvY2F0LnN2Z1wiLFxuICBcIm1haWwuZ29vZ2xlLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9pbWFnZXMvaWNvbnMvcHJvZHVjdC9nb29nbGVtYWlsLTEyOC5wbmdcIixcbiAgXCJnbWFpbC5jb21cIjogXCJodHRwczovL3d3dy5nb29nbGUuY29tL2ltYWdlcy9pY29ucy9wcm9kdWN0L2dvb2dsZW1haWwtMTI4LnBuZ1wiLFxuICBcInBheXBhbC5jb21cIjogXCJodHRwczovL3d3dy5wYXlwYWxvYmplY3RzLmNvbS93ZWJzdGF0aWMvaWNvbi9wcDE0NC5wbmdcIixcbiAgXCJzbGFjay5jb21cIjpcbiAgICBcImh0dHBzOi8vYXNzZXRzLmJyYW5kZm9sZGVyLmNvbS9wbDU0NmotN2xlOHprLTZnd2l5by92aWV3QDJ4LnBuZ1wiLFxuICBcImltZGIuY29tXCI6XG4gICAgXCJodHRwOi8vaWEubWVkaWEtaW1kYi5jb20vaW1hZ2VzL0cvMDEvaW1kYi9pbWFnZXMvZGVza3RvcC1mYXZpY29uLTIxNjU4MDY5NzAuX0NCNTIyNzM2NTYxXy5pY29cIixcbiAgXCJlbi53aWtpcGVkaWEub3JnXCI6IFwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3N0YXRpYy9mYXZpY29uL3dpa2lwZWRpYS5pY29cIixcbiAgXCJ3aWtpcGVkaWEub3JnXCI6IFwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3N0YXRpYy9mYXZpY29uL3dpa2lwZWRpYS5pY29cIixcbiAgXCJlc3BuLmNvbVwiOiBcImh0dHA6Ly9hLmVzcG5jZG4uY29tL2Zhdmljb24uaWNvXCIsXG4gIFwidHdpdGNoLnR2XCI6XG4gICAgXCJodHRwczovL3N0YXRpYy50d2l0Y2hjZG4ubmV0L2Fzc2V0cy9mYXZpY29uLTc1MjcwZjlkZjJiMDcxNzRjMjNjZTg0NGEwM2Q4NGFmLmljb1wiLFxuICBcImNubi5jb21cIjpcbiAgICBcImh0dHA6Ly9jZG4uY25uLmNvbS9jbm4vLmUvaW1nLzMuMC9nbG9iYWwvbWlzYy9hcHBsZS10b3VjaC1pY29uLnBuZ1wiLFxuICBcIm9mZmljZS5jb21cIjpcbiAgICBcImh0dHBzOi8vc2Vhb2ZmaWNlaG9tZS5tc29jZG4uY29tL3MvNzA0NzQ1MmUvSW1hZ2VzL2Zhdmljb25fbWV0cm8uaWNvXCIsXG4gIFwiYmFua29mYW1lcmljYS5jb21cIjpcbiAgICBcImh0dHBzOi8vd3d3MS5iYWMtYXNzZXRzLmNvbS9ob21lcGFnZS9zcGEtYXNzZXRzL2ltYWdlcy9hc3NldHMtaW1hZ2VzLWdsb2JhbC1mYXZpY29uLWZhdmljb24tQ1NYMzg2YjMzMmQuaWNvXCIsXG4gIFwiY2hhc2UuY29tXCI6IFwiaHR0cHM6Ly93d3cuY2hhc2UuY29tL2V0Yy9kZXNpZ25zL2NoYXNlLXV4L2Zhdmljb24tMTUyLnBuZ1wiLFxuICBcIm55dGltZXMuY29tXCI6IFwiaHR0cHM6Ly9zdGF0aWMwMS5ueXQuY29tL2ltYWdlcy9pY29ucy9pb3MtaXBhZC0xNDR4MTQ0LnBuZ1wiLFxuICBcImFwcGxlLmNvbVwiOiBcImh0dHBzOi8vd3d3LmFwcGxlLmNvbS9mYXZpY29uLmljb1wiLFxuICBcIndlbGxzZmFyZ28uY29tXCI6XG4gICAgXCJodHRwczovL3d3dy53ZWxsc2ZhcmdvLmNvbS9hc3NldHMvaW1hZ2VzL2ljb25zL2FwcGxlLXRvdWNoLWljb24tMTIweDEyMC5wbmdcIixcbiAgXCJ5ZWxwLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly9zMy1tZWRpYTIuZmwueWVscGNkbi5jb20vYXNzZXRzL3NydjAveWVscF9zdHlsZWd1aWRlLzExOGZmNDc1YTM0MS9hc3NldHMvaW1nL2xvZ29zL2Zhdmljb24uaWNvXCIsXG4gIFwid29yZHByZXNzLmNvbVwiOiBcImh0dHA6Ly9zMC53cC5jb20vaS93ZWJjbGlwLnBuZ1wiLFxuICBcImRyb3Bib3guY29tXCI6XG4gICAgXCJodHRwczovL2NmbC5kcm9wYm94c3RhdGljLmNvbS9zdGF0aWMvaW1hZ2VzL2Zhdmljb24tdmZsVWVMZWVZLmljb1wiLFxuICBcIm1haWwuc3VwZXJodW1hbi5jb21cIjpcbiAgICBcImh0dHBzOi8vc3VwZXJodW1hbi5jb20vYnVpbGQvNzEyMjJiZGMxNjllNTkwNmMyODI0N2VkNWI3Y2YwZWQuc2hhcmUtaWNvbi5wbmdcIixcbiAgXCJhd3MuYW1hem9uLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly9hMC5hd3NzdGF0aWMuY29tL2xpYnJhLWNzcy9pbWFnZXMvc2l0ZS90b3VjaC1pY29uLWlwaG9uZS0xMTQtc21pbGUucG5nXCIsXG4gIFwiY29uc29sZS5hd3MuYW1hem9uLmNvbVwiOlxuICAgIFwiaHR0cHM6Ly9hMC5hd3NzdGF0aWMuY29tL2xpYnJhLWNzcy9pbWFnZXMvc2l0ZS90b3VjaC1pY29uLWlwaG9uZS0xMTQtc21pbGUucG5nXCIsXG4gIFwidXMtd2VzdC0yLmNvbnNvbGUuYXdzLmFtYXpvbi5jb21cIjpcbiAgICBcImh0dHBzOi8vYTAuYXdzc3RhdGljLmNvbS9saWJyYS1jc3MvaW1hZ2VzL3NpdGUvdG91Y2gtaWNvbi1pcGhvbmUtMTE0LXNtaWxlLnBuZ1wiLFxuICBcInN0YWNrb3ZlcmZsb3cuY29tXCI6XG4gICAgXCJodHRwczovL2Nkbi5zc3RhdGljLm5ldC9TaXRlcy9zdGFja292ZXJmbG93L2ltZy9hcHBsZS10b3VjaC1pY29uLnBuZ1wiXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVSTEltYWdlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLl9yZWZyZXNoU291cmNlID0gZGVib3VuY2UodGhpcy5yZWZyZXNoU291cmNlLmJpbmQodGhpcykpXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY29udGVudC51cmwgIT09IHByb3BzLmNvbnRlbnQudXJsKSB7XG4gICAgICB0aGlzLl9yZWZyZXNoU291cmNlKHByb3BzLmNvbnRlbnQpXG4gICAgfVxuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgaWYgKG5leHRQcm9wcy5jb250ZW50LnVybCAhPT0gdGhpcy5wcm9wcy5jb250ZW50LnVybCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAobmV4dFN0YXRlLnNyYyAhPT0gdGhpcy5zdGF0ZS5zcmMpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgbmV4dFN0YXRlLmxvYWRpbmcgIT09IHRoaXMuc3RhdGUubG9hZGluZyB8fFxuICAgICAgbmV4dFN0YXRlLmVycm9yICE9PSB0aGlzLnN0YXRlLmVycm9yXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgICFuZXh0UHJvcHMuY29udGVudC5pbWFnZXMgfHxcbiAgICAgIHRoaXMucHJvcHMuY29udGVudC5pbWFnZXMgfHxcbiAgICAgIChuZXh0UHJvcHMuY29udGVudC5pbWFnZXMgfHwgIXRoaXMucHJvcHMuY29udGVudC5pbWFnZXMpIHx8XG4gICAgICBuZXh0UHJvcHMuY29udGVudC5pbWFnZXNbMF0gIT09IHRoaXMucHJvcHMuY29udGVudC5pbWFnZXNbMF1cbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgdGhpcy5yZWZyZXNoU291cmNlKClcbiAgfVxuXG4gIHJlZnJlc2hTb3VyY2UoY29udGVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY29sb3I6IHJhbmRvbUNvbG9yKDEwMCwgNTApXG4gICAgfSlcblxuICAgIHRoaXMuZmluZFNvdXJjZShjb250ZW50KVxuICAgIHRoaXMucHJlbG9hZCh0aGlzLnN0YXRlLnNyYylcbiAgfVxuXG4gIGZpbmRTb3VyY2UoY29udGVudCkge1xuICAgIGNvbnRlbnQgfHwgKGNvbnRlbnQgPSB0aGlzLnByb3BzLmNvbnRlbnQpXG5cbiAgICBpZiAoIWNvbnRlbnQudXJsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAhdGhpcy5wcm9wc1tcImljb24tb25seVwiXSAmJlxuICAgICAgY29udGVudC5pbWFnZXMgJiZcbiAgICAgIGNvbnRlbnQuaW1hZ2VzLmxlbmd0aCA+IDAgJiZcbiAgICAgIGNvbnRlbnQuaW1hZ2VzWzBdXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHR5cGU6IFwiaW1hZ2VcIixcbiAgICAgICAgc3JjOiBjb250ZW50LmltYWdlc1swXVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoY29udGVudC5pY29uKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHR5cGU6IFwiaWNvblwiLFxuICAgICAgICBzcmM6IGFic29sdXRlSWNvblVSTChjb250ZW50KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBob3N0bmFtZSA9IGZpbmRIb3N0bmFtZShjb250ZW50LnVybClcbiAgICBpZiAocG9wdWxhckljb25zW2hvc3RuYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB0eXBlOiBcInBvcHVsYXItaWNvblwiLFxuICAgICAgICBzcmM6IHBvcHVsYXJJY29uc1tob3N0bmFtZV1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKC9cXC5zbGFja1xcLmNvbSQvLnRlc3QoaG9zdG5hbWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHR5cGU6IFwicG9wdWxhci1pY29uXCIsXG4gICAgICAgIHNyYzogcG9wdWxhckljb25zW1wic2xhY2suY29tXCJdXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdHlwZTogXCJmYXZpY29uXCIsXG4gICAgICBzcmM6IFwiaHR0cDovL1wiICsgaG9zdG5hbWUgKyBcIi9mYXZpY29uLmljb1wiXG4gICAgfSlcbiAgfVxuXG4gIHByZWxvYWQoc3JjKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5zdGF0ZS5sb2FkaW5nICYmXG4gICAgICB0aGlzLnN0YXRlLmxvYWRpbmdGb3IgPT09IHRoaXMucHJvcHMuY29udGVudC51cmxcbiAgICApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgbG9hZGluZ0ZvcjogdGhpcy5wcm9wcy5jb250ZW50LnVybCxcbiAgICAgIGxvYWRpbmdTcmM6IHNyYyxcbiAgICAgIHNyYzogdGhpcy5jYWNoZWRJY29uVVJMKClcbiAgICB9KVxuXG4gICAgaW1nKHNyYywgZXJyID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmxvYWRpbmdTcmMgIT09IHNyYykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgZXJyb3I6IGVycixcbiAgICAgICAgICBzcmM6IHRoaXMuY2FjaGVkSWNvblVSTCgpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzcmM6IHNyYyxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGVycm9yOiBudWxsXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubG9hZGluZyB8fCB0aGlzLnN0YXRlLmVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2FkaW5nKClcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIGJhY2tncm91bmRJbWFnZTogYHVybCgke3RoaXMuc3RhdGUuc3JjfSlgXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgIGNsYXNzTmFtZT17YHVybC1pbWFnZSAke3RoaXMuc3RhdGUudHlwZX1gfVxuICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckxvYWRpbmcoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuc3RhdGUuY29sb3JcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBkYXRhLWVycm9yPXt0aGlzLnN0YXRlLmVycm9yfVxuICAgICAgICBkYXRhLXR5cGU9e3RoaXMuc3RhdGUudHlwZX1cbiAgICAgICAgZGF0YS1zcmM9e3RoaXMuc3RhdGUuc3JjfVxuICAgICAgICBjbGFzc05hbWU9XCJ1cmwtaW1hZ2UgZ2VuZXJhdGVkLWltYWdlIGNlbnRlclwiXG4gICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgID5cbiAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMuY29udGVudC5yZW5kZXJGaXJzdExldHRlcigpfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNhY2hlZEljb25VUkwoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNvbnRlbnQudXJsKSByZXR1cm5cblxuICAgIHJldHVybiAoXG4gICAgICBcImNocm9tZTovL2Zhdmljb24vc2l6ZS83Mi9cIiArXG4gICAgICBmaW5kUHJvdG9jb2wodGhpcy5wcm9wcy5jb250ZW50LnVybCkgK1xuICAgICAgXCI6Ly9cIiArXG4gICAgICBmaW5kSG9zdG5hbWUodGhpcy5wcm9wcy5jb250ZW50LnVybClcbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gYWJzb2x1dGVJY29uVVJMKGxpa2UpIHtcbiAgaWYgKC9eaHR0cHM/OlxcL1xcLy8udGVzdChsaWtlLmljb24pKSByZXR1cm4gbGlrZS5pY29uXG4gIHJldHVybiBcImh0dHA6Ly9cIiArIGpvaW4oZmluZEhvc3RuYW1lKGxpa2UudXJsKSwgbGlrZS5pY29uKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEhvc3RuYW1lKHVybCkge1xuICByZXR1cm4gdXJsXG4gICAgLnJlcGxhY2UoL15cXHcrOlxcL1xcLy8sIFwiXCIpXG4gICAgLnNwbGl0KFwiL1wiKVswXVxuICAgIC5yZXBsYWNlKC9ed3d3XFwuLywgXCJcIilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQcm90b2NvbCh1cmwpIHtcbiAgaWYgKCEvXmh0dHBzPzpcXC9cXC8vLnRlc3QodXJsKSkgcmV0dXJuIFwiaHR0cFwiXG4gIHJldHVybiB1cmwuc3BsaXQoXCI6Ly9cIilbMF1cbn1cbiIsImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gXCJwcmVhY3RcIlxuaW1wb3J0IHdhbGxwYXBlcnMgZnJvbSAnLi93YWxscGFwZXJzJ1xuY29uc3QgT05FX0RBWSA9IDEwMDAgKiA2MCAqIDYwICogMjRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbHBhcGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc2VsZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3JjKHRoaXMudG9kYXkoKSAgKyAodGhpcy5wcm9wcy5pbmRleCB8fCAwKSlcbiAgfVxuXG4gIHRvZGF5KCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKClcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKVxuICAgIGNvbnN0IGRpZmYgPSAobm93IC0gc3RhcnQpICsgKChzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpIC0gbm93LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNjAgKiAxMDAwKVxuICAgIHJldHVybiBNYXRoLmZsb29yKGRpZmYgLyBPTkVfREFZKVxuICB9XG5cbiAgc3JjKGluZGV4KSB7XG4gICAgcmV0dXJuIHdhbGxwYXBlcnNbaW5kZXggJSB3YWxscGFwZXJzLmxlbmd0aF1cbiAgfVxuXG4gIHdpZHRoKCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aFxuICB9XG5cbiAgdXJsKHNyYykge1xuICAgIHJldHVybiBzcmMudXJsICsgJz9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PScgKyB0aGlzLndpZHRoKClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzcmMgPSB0aGlzLnNlbGVjdGVkKClcblxuICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7dGhpcy51cmwoc3JjKX0pYFxuICAgIH1cblxuICAgIGlmIChzcmMucG9zaXRpb24pIHtcbiAgICAgIHN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IHNyYy5wb3NpdGlvblxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhbGxwYXBlclwiIHN0eWxlPXtzdHlsZX0+PC9kaXY+XG4gICAgKVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ0NDQ2NDY2NjE2OC00OWQ2MzNiODY3OTdcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTA4NDk2MDg4ODAtNmY3ODc1NDJjODhhXCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6IFwidG9wIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDI5NTE2Mzg3NDU5LTk4OTFiN2I5NmM3OFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ2OTg1NDUyMzA4Ni1jYzAyZmU1ZDg4MDBcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0ODg3MjQwMzQ5NTgtMGZhYWQ4OGNmNjlmXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDMwNjUxNzE3NTA0LWViYjllM2U2Nzk1ZVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ0MTgwMjI1OTg3OC1hMTNmNzMyY2U0MTBcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJib3R0b20gY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQyMDA0ODMwMzUtZGI3YmM2YWE1NzM5XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDU5MjU4MzUwODc5LTM0ODg2MzE5YTNjOVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNzA5ODkyNjMzMS04ZDMyNGIxMzlkMTVcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJ0b3AgY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQzMDE5NTA2MjQtMmM1NGNjOTgyNmM1XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDgwNDk5NDg0MjY4LWE4NWEyNDE0ZGE4MVwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ4MzExNjUzMTUyMi00YzRlNTI1ZjUwNGVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDE0NDY2OTA4NTItZGE1NWRmN2JmZTA3XCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6IFwidG9wIGNlbnRlclwiLCBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTAxODYyMTY5Mjg2LTUxOGMyOTFlM2VlZFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ2OTQ3NDk2ODAyOC01NjYyM2YwMmU0MmVcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJ0b3AgY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzkwMzAxNjAxODAtYjE4NjA5NTFkNjk2XCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDMxODg3NzczMDQyLTgwM2VkNTJiZWQyNlwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwMDUxNDk2NjkwNi1mZTI0NWVlYTkzNDRcIiB9LFxuICB7IFwicG9zaXRpb25cIjogXCJib3R0b20gY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NjU0MDExODA0ODktY2ViNWEzNGQ4YTYzXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA0NDYxMTU0MDA1LTMxYjQzNWU2ODdlZFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNDc0MDE5MTA0NS02M2UxNTI1MWU3NTBcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0MzE3OTQwNjIyMzItMmE5OWE1NDMxYzZjXCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6XCJib3R0b20gY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDE5NjM0MjI3NjItM2Q4OWJkOTg5NTY4XCIgfSxcbiAgeyBcInBvc2l0aW9uXCI6XCJ0b3AgY2VudGVyXCIsIFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NTUzMjU1MjgwNTUtYWQ4MTVhZmVjZWJlXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDc4MDMzMzk0MTUxLWM5MzFkNWE0YmRkNlwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNTA1MzI2MjY5MS02MjQwNjNmOTRiNjVcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9jMi5zdGF0aWNmbGlja3IuY29tLzQvMzkxMy8xNDk0NTcwMjczNl85ZDI4MzA0NGE3X2guanBnXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vYzIuc3RhdGljZmxpY2tyLmNvbS80LzM4OTYvMTQyMTUzODMwOTdfYmQwNzM0MmU4ZV9oLmpwZ1wiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2MxLnN0YXRpY2ZsaWNrci5jb20vMy8yODI1LzEzNDY0OTMxNzc0XzVlYTk2NjA4YWFfaC5qcGdcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzM4MDA0NDc1OTYtMDE3Mjk0ODJiOGViXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTEwODA2MjY3MTIwLTVmMTFiYjQ3NGVhMFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUyMTQ2NDMwMjg2MS1jZTk0MzkxNWQxYzNcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDg3Mzk3NzM0MzQtYzI2YjNkMDllMDcxXCIgfSxcbiAgeyBcInVybFwiOiBcImh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTM4NDM1NzQwODYwLTY3YmQ4ZjRlOGViOFwiIH0sXG4gIHsgXCJ1cmxcIjogXCJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1ODY2ODM4Mzk3MC04ZGRkMzkyN2RlZWRcIiB9LFxuICB7IFwidXJsXCI6IFwiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1Mjc1MTkxMzU0MTMtMWUxNDZiNTUyZTEwXCIgfVxuXVxuIiwibW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZVxuXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgd2FpdCkge1xuICB2YXIgdGltZXJcbiAgdmFyIGFyZ3NcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgd2FpdCA9IDI1MFxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lciAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcilcbiAgICAgIHRpbWVyID0gdW5kZWZpbmVkXG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVyID0gc2V0VGltZW91dChub29wKVxuICAgICAgZm4uYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBhcmdzID0gYXJndW1lbnRzXG5cbiAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB0aW1lciA9IHVuZGVmaW5lZFxuICAgICAgZm4uYXBwbHkodW5kZWZpbmVkLCBhcmdzKVxuICAgIH0sIHdhaXQpXG4gIH1cbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG4iLCJcbi8qKlxuICogRXNjYXBlIHJlZ2V4cCBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKC8oWy4qKz89XiE6JHt9KCl8W1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gaW1nO1xuXG5mdW5jdGlvbiBpbWcgKHNyYywgb3B0LCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0XG4gICAgb3B0ID0gbnVsbFxuICB9XG5cblxuICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgdmFyIGxvY2tlZDtcblxuICBlbC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGxvY2tlZCkgcmV0dXJuO1xuICAgIGxvY2tlZCA9IHRydWU7XG5cbiAgICBjYWxsYmFjayAmJiBjYWxsYmFjayh1bmRlZmluZWQsIGVsKTtcbiAgfTtcblxuICBlbC5vbmVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChsb2NrZWQpIHJldHVybjtcbiAgICBsb2NrZWQgPSB0cnVlO1xuXG4gICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobmV3IEVycm9yKCdVbmFibGUgdG8gbG9hZCBcIicgKyBzcmMgKyAnXCInKSwgZWwpO1xuICB9O1xuICBcbiAgaWYgKG9wdCAmJiBvcHQuY3Jvc3NPcmlnaW4pXG4gICAgZWwuY3Jvc3NPcmlnaW4gPSBvcHQuY3Jvc3NPcmlnaW47XG5cbiAgZWwuc3JjID0gc3JjO1xuXG4gIHJldHVybiBlbDtcbn1cbiIsIi8vIC5kaXJuYW1lLCAuYmFzZW5hbWUsIGFuZCAuZXh0bmFtZSBtZXRob2RzIGFyZSBleHRyYWN0ZWQgZnJvbSBOb2RlLmpzIHY4LjExLjEsXG4vLyBiYWNrcG9ydGVkIGFuZCB0cmFuc3BsaXRlZCB3aXRoIEJhYmVsLCB3aXRoIGJhY2t3YXJkcy1jb21wYXQgZml4ZXNcblxuLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNvbHZlZFBhdGggPSAnJyxcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcblxuICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgIHZhciBwYXRoID0gKGkgPj0gMCkgPyBhcmd1bWVudHNbaV0gOiBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgLy8gU2tpcCBlbXB0eSBhbmQgaW52YWxpZCBlbnRyaWVzXG4gICAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9IGVsc2UgaWYgKCFwYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXNvbHZlZFBhdGggPSBwYXRoICsgJy8nICsgcmVzb2x2ZWRQYXRoO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICB9XG5cbiAgLy8gQXQgdGhpcyBwb2ludCB0aGUgcGF0aCBzaG91bGQgYmUgcmVzb2x2ZWQgdG8gYSBmdWxsIGFic29sdXRlIHBhdGgsIGJ1dFxuICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcmVzb2x2ZWRQYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHJlc29sdmVkUGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFyZXNvbHZlZEFic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuICgocmVzb2x2ZWRBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHJlc29sdmVkUGF0aCkgfHwgJy4nO1xufTtcblxuLy8gcGF0aC5ub3JtYWxpemUocGF0aClcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aCkge1xuICB2YXIgaXNBYnNvbHV0ZSA9IGV4cG9ydHMuaXNBYnNvbHV0ZShwYXRoKSxcbiAgICAgIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICEhcDtcbiAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgcGF0aCA9ICcuJztcbiAgfVxuICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgcGF0aCArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUoZmlsdGVyKHBhdGhzLCBmdW5jdGlvbihwLCBpbmRleCkge1xuICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICAgIHJldHVybiBwO1xuICB9KS5qb2luKCcvJykpO1xufTtcblxuXG4vLyBwYXRoLnJlbGF0aXZlKGZyb20sIHRvKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5yZWxhdGl2ZSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBleHBvcnRzLnJlc29sdmUoZnJvbSkuc3Vic3RyKDEpO1xuICB0byA9IGV4cG9ydHMucmVzb2x2ZSh0bykuc3Vic3RyKDEpO1xuXG4gIGZ1bmN0aW9uIHRyaW0oYXJyKSB7XG4gICAgdmFyIHN0YXJ0ID0gMDtcbiAgICBmb3IgKDsgc3RhcnQgPCBhcnIubGVuZ3RoOyBzdGFydCsrKSB7XG4gICAgICBpZiAoYXJyW3N0YXJ0XSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBlbmQgPSBhcnIubGVuZ3RoIC0gMTtcbiAgICBmb3IgKDsgZW5kID49IDA7IGVuZC0tKSB7XG4gICAgICBpZiAoYXJyW2VuZF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhcnQgPiBlbmQpIHJldHVybiBbXTtcbiAgICByZXR1cm4gYXJyLnNsaWNlKHN0YXJ0LCBlbmQgLSBzdGFydCArIDEpO1xuICB9XG5cbiAgdmFyIGZyb21QYXJ0cyA9IHRyaW0oZnJvbS5zcGxpdCgnLycpKTtcbiAgdmFyIHRvUGFydHMgPSB0cmltKHRvLnNwbGl0KCcvJykpO1xuXG4gIHZhciBsZW5ndGggPSBNYXRoLm1pbihmcm9tUGFydHMubGVuZ3RoLCB0b1BhcnRzLmxlbmd0aCk7XG4gIHZhciBzYW1lUGFydHNMZW5ndGggPSBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZnJvbVBhcnRzW2ldICE9PSB0b1BhcnRzW2ldKSB7XG4gICAgICBzYW1lUGFydHNMZW5ndGggPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIG91dHB1dFBhcnRzID0gW107XG4gIGZvciAodmFyIGkgPSBzYW1lUGFydHNMZW5ndGg7IGkgPCBmcm9tUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRQYXJ0cy5wdXNoKCcuLicpO1xuICB9XG5cbiAgb3V0cHV0UGFydHMgPSBvdXRwdXRQYXJ0cy5jb25jYXQodG9QYXJ0cy5zbGljZShzYW1lUGFydHNMZW5ndGgpKTtcblxuICByZXR1cm4gb3V0cHV0UGFydHMuam9pbignLycpO1xufTtcblxuZXhwb3J0cy5zZXAgPSAnLyc7XG5leHBvcnRzLmRlbGltaXRlciA9ICc6JztcblxuZXhwb3J0cy5kaXJuYW1lID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9IHBhdGggKyAnJztcbiAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gJy4nO1xuICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdCgwKTtcbiAgdmFyIGhhc1Jvb3QgPSBjb2RlID09PSA0NyAvKi8qLztcbiAgdmFyIGVuZCA9IC0xO1xuICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgZm9yICh2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAxOyAtLWkpIHtcbiAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgIGVuZCA9IGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvclxuICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiBoYXNSb290ID8gJy8nIDogJy4nO1xuICBpZiAoaGFzUm9vdCAmJiBlbmQgPT09IDEpIHtcbiAgICAvLyByZXR1cm4gJy8vJztcbiAgICAvLyBCYWNrd2FyZHMtY29tcGF0IGZpeDpcbiAgICByZXR1cm4gJy8nO1xuICB9XG4gIHJldHVybiBwYXRoLnNsaWNlKDAsIGVuZCk7XG59O1xuXG5mdW5jdGlvbiBiYXNlbmFtZShwYXRoKSB7XG4gIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHBhdGggPSBwYXRoICsgJyc7XG5cbiAgdmFyIHN0YXJ0ID0gMDtcbiAgdmFyIGVuZCA9IC0xO1xuICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgdmFyIGk7XG5cbiAgZm9yIChpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgIGlmIChwYXRoLmNoYXJDb2RlQXQoaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZW5kID09PSAtMSkge1xuICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgLy8gcGF0aCBjb21wb25lbnRcbiAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgZW5kID0gaSArIDE7XG4gICAgfVxuICB9XG5cbiAgaWYgKGVuZCA9PT0gLTEpIHJldHVybiAnJztcbiAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnQsIGVuZCk7XG59XG5cbi8vIFVzZXMgYSBtaXhlZCBhcHByb2FjaCBmb3IgYmFja3dhcmRzLWNvbXBhdGliaWxpdHksIGFzIGV4dCBiZWhhdmlvciBjaGFuZ2VkXG4vLyBpbiBuZXcgTm9kZS5qcyB2ZXJzaW9ucywgc28gb25seSBiYXNlbmFtZSgpIGFib3ZlIGlzIGJhY2twb3J0ZWQgaGVyZVxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uIChwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBiYXNlbmFtZShwYXRoKTtcbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHBhdGggPSBwYXRoICsgJyc7XG4gIHZhciBzdGFydERvdCA9IC0xO1xuICB2YXIgc3RhcnRQYXJ0ID0gMDtcbiAgdmFyIGVuZCA9IC0xO1xuICB2YXIgbWF0Y2hlZFNsYXNoID0gdHJ1ZTtcbiAgLy8gVHJhY2sgdGhlIHN0YXRlIG9mIGNoYXJhY3RlcnMgKGlmIGFueSkgd2Ugc2VlIGJlZm9yZSBvdXIgZmlyc3QgZG90IGFuZFxuICAvLyBhZnRlciBhbnkgcGF0aCBzZXBhcmF0b3Igd2UgZmluZFxuICB2YXIgcHJlRG90U3RhdGUgPSAwO1xuICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChjb2RlID09PSA0NyAvKi8qLykge1xuICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICBzdGFydFBhcnQgPSBpICsgMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICBpZiAoZW5kID09PSAtMSkge1xuICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3IsIG1hcmsgdGhpcyBhcyB0aGUgZW5kIG9mIG91clxuICAgICAgLy8gZXh0ZW5zaW9uXG4gICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgIGVuZCA9IGkgKyAxO1xuICAgIH1cbiAgICBpZiAoY29kZSA9PT0gNDYgLyouKi8pIHtcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBvdXIgZmlyc3QgZG90LCBtYXJrIGl0IGFzIHRoZSBzdGFydCBvZiBvdXIgZXh0ZW5zaW9uXG4gICAgICAgIGlmIChzdGFydERvdCA9PT0gLTEpXG4gICAgICAgICAgc3RhcnREb3QgPSBpO1xuICAgICAgICBlbHNlIGlmIChwcmVEb3RTdGF0ZSAhPT0gMSlcbiAgICAgICAgICBwcmVEb3RTdGF0ZSA9IDE7XG4gICAgfSBlbHNlIGlmIChzdGFydERvdCAhPT0gLTEpIHtcbiAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgYW5kIG5vbi1wYXRoIHNlcGFyYXRvciBiZWZvcmUgb3VyIGRvdCwgc28gd2Ugc2hvdWxkXG4gICAgICAvLyBoYXZlIGEgZ29vZCBjaGFuY2UgYXQgaGF2aW5nIGEgbm9uLWVtcHR5IGV4dGVuc2lvblxuICAgICAgcHJlRG90U3RhdGUgPSAtMTtcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhcnREb3QgPT09IC0xIHx8IGVuZCA9PT0gLTEgfHxcbiAgICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgY2hhcmFjdGVyIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZG90XG4gICAgICBwcmVEb3RTdGF0ZSA9PT0gMCB8fFxuICAgICAgLy8gVGhlIChyaWdodC1tb3N0KSB0cmltbWVkIHBhdGggY29tcG9uZW50IGlzIGV4YWN0bHkgJy4uJ1xuICAgICAgcHJlRG90U3RhdGUgPT09IDEgJiYgc3RhcnREb3QgPT09IGVuZCAtIDEgJiYgc3RhcnREb3QgPT09IHN0YXJ0UGFydCArIDEpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnREb3QsIGVuZCk7XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iLCIhZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGZ1bmN0aW9uIGgobm9kZU5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGxhc3RTaW1wbGUsIGNoaWxkLCBzaW1wbGUsIGksIGNoaWxkcmVuID0gRU1QVFlfQ0hJTERSRU47XG4gICAgICAgIGZvciAoaSA9IGFyZ3VtZW50cy5sZW5ndGg7IGktLSA+IDI7ICkgc3RhY2sucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICBpZiAoYXR0cmlidXRlcyAmJiBudWxsICE9IGF0dHJpYnV0ZXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmICghc3RhY2subGVuZ3RoKSBzdGFjay5wdXNoKGF0dHJpYnV0ZXMuY2hpbGRyZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGF0dHJpYnV0ZXMuY2hpbGRyZW47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkgaWYgKChjaGlsZCA9IHN0YWNrLnBvcCgpKSAmJiB2b2lkIDAgIT09IGNoaWxkLnBvcCkgZm9yIChpID0gY2hpbGQubGVuZ3RoOyBpLS07ICkgc3RhY2sucHVzaChjaGlsZFtpXSk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgY2hpbGQpIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChzaW1wbGUgPSAnZnVuY3Rpb24nICE9IHR5cGVvZiBub2RlTmFtZSkgaWYgKG51bGwgPT0gY2hpbGQpIGNoaWxkID0gJyc7IGVsc2UgaWYgKCdudW1iZXInID09IHR5cGVvZiBjaGlsZCkgY2hpbGQgPSBTdHJpbmcoY2hpbGQpOyBlbHNlIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgY2hpbGQpIHNpbXBsZSA9ICExO1xuICAgICAgICAgICAgaWYgKHNpbXBsZSAmJiBsYXN0U2ltcGxlKSBjaGlsZHJlbltjaGlsZHJlbi5sZW5ndGggLSAxXSArPSBjaGlsZDsgZWxzZSBpZiAoY2hpbGRyZW4gPT09IEVNUFRZX0NISUxEUkVOKSBjaGlsZHJlbiA9IFsgY2hpbGQgXTsgZWxzZSBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIGxhc3RTaW1wbGUgPSBzaW1wbGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHAgPSBuZXcgVk5vZGUoKTtcbiAgICAgICAgcC5ub2RlTmFtZSA9IG5vZGVOYW1lO1xuICAgICAgICBwLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHAuYXR0cmlidXRlcyA9IG51bGwgPT0gYXR0cmlidXRlcyA/IHZvaWQgMCA6IGF0dHJpYnV0ZXM7XG4gICAgICAgIHAua2V5ID0gbnVsbCA9PSBhdHRyaWJ1dGVzID8gdm9pZCAwIDogYXR0cmlidXRlcy5rZXk7XG4gICAgICAgIGlmICh2b2lkIDAgIT09IG9wdGlvbnMudm5vZGUpIG9wdGlvbnMudm5vZGUocCk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBleHRlbmQob2JqLCBwcm9wcykge1xuICAgICAgICBmb3IgKHZhciBpIGluIHByb3BzKSBvYmpbaV0gPSBwcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xvbmVFbGVtZW50KHZub2RlLCBwcm9wcykge1xuICAgICAgICByZXR1cm4gaCh2bm9kZS5ub2RlTmFtZSwgZXh0ZW5kKGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyksIHByb3BzKSwgYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiB2bm9kZS5jaGlsZHJlbik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVucXVldWVSZW5kZXIoY29tcG9uZW50KSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9fZCAmJiAoY29tcG9uZW50Ll9fZCA9ICEwKSAmJiAxID09IGl0ZW1zLnB1c2goY29tcG9uZW50KSkgKG9wdGlvbnMuZGVib3VuY2VSZW5kZXJpbmcgfHwgZGVmZXIpKHJlcmVuZGVyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVyZW5kZXIoKSB7XG4gICAgICAgIHZhciBwLCBsaXN0ID0gaXRlbXM7XG4gICAgICAgIGl0ZW1zID0gW107XG4gICAgICAgIHdoaWxlIChwID0gbGlzdC5wb3AoKSkgaWYgKHAuX19kKSByZW5kZXJDb21wb25lbnQocCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzU2FtZU5vZGVUeXBlKG5vZGUsIHZub2RlLCBoeWRyYXRpbmcpIHtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHJldHVybiB2b2lkIDAgIT09IG5vZGUuc3BsaXRUZXh0O1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlLm5vZGVOYW1lKSByZXR1cm4gIW5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yICYmIGlzTmFtZWROb2RlKG5vZGUsIHZub2RlLm5vZGVOYW1lKTsgZWxzZSByZXR1cm4gaHlkcmF0aW5nIHx8IG5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNOYW1lZE5vZGUobm9kZSwgbm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuX19uID09PSBub2RlTmFtZSB8fCBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5vZGVQcm9wcyh2bm9kZSkge1xuICAgICAgICB2YXIgcHJvcHMgPSBleHRlbmQoe30sIHZub2RlLmF0dHJpYnV0ZXMpO1xuICAgICAgICBwcm9wcy5jaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0gdm5vZGUubm9kZU5hbWUuZGVmYXVsdFByb3BzO1xuICAgICAgICBpZiAodm9pZCAwICE9PSBkZWZhdWx0UHJvcHMpIGZvciAodmFyIGkgaW4gZGVmYXVsdFByb3BzKSBpZiAodm9pZCAwID09PSBwcm9wc1tpXSkgcHJvcHNbaV0gPSBkZWZhdWx0UHJvcHNbaV07XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTm9kZShub2RlTmFtZSwgaXNTdmcpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBpc1N2ZyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBub2RlTmFtZSkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcbiAgICAgICAgbm9kZS5fX24gPSBub2RlTmFtZTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudE5vZGUpIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldEFjY2Vzc29yKG5vZGUsIG5hbWUsIG9sZCwgdmFsdWUsIGlzU3ZnKSB7XG4gICAgICAgIGlmICgnY2xhc3NOYW1lJyA9PT0gbmFtZSkgbmFtZSA9ICdjbGFzcyc7XG4gICAgICAgIGlmICgna2V5JyA9PT0gbmFtZSkgOyBlbHNlIGlmICgncmVmJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKG9sZCkgb2xkKG51bGwpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB2YWx1ZShub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmICgnY2xhc3MnID09PSBuYW1lICYmICFpc1N2Zykgbm9kZS5jbGFzc05hbWUgPSB2YWx1ZSB8fCAnJzsgZWxzZSBpZiAoJ3N0eWxlJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2YgdmFsdWUgfHwgJ3N0cmluZycgPT0gdHlwZW9mIG9sZCkgbm9kZS5zdHlsZS5jc3NUZXh0ID0gdmFsdWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBvbGQpIGZvciAodmFyIGkgaW4gb2xkKSBpZiAoIShpIGluIHZhbHVlKSkgbm9kZS5zdHlsZVtpXSA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIG5vZGUuc3R5bGVbaV0gPSAnbnVtYmVyJyA9PSB0eXBlb2YgdmFsdWVbaV0gJiYgITEgPT09IElTX05PTl9ESU1FTlNJT05BTC50ZXN0KGkpID8gdmFsdWVbaV0gKyAncHgnIDogdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSBub2RlLmlubmVySFRNTCA9IHZhbHVlLl9faHRtbCB8fCAnJztcbiAgICAgICAgfSBlbHNlIGlmICgnbycgPT0gbmFtZVswXSAmJiAnbicgPT0gbmFtZVsxXSkge1xuICAgICAgICAgICAgdmFyIHVzZUNhcHR1cmUgPSBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvQ2FwdHVyZSQvLCAnJykpO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9sZCkgbm9kZS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudFByb3h5LCB1c2VDYXB0dXJlKTtcbiAgICAgICAgICAgIChub2RlLl9fbCB8fCAobm9kZS5fX2wgPSB7fSkpW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2xpc3QnICE9PSBuYW1lICYmICd0eXBlJyAhPT0gbmFtZSAmJiAhaXNTdmcgJiYgbmFtZSBpbiBub2RlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5vZGVbbmFtZV0gPSBudWxsID09IHZhbHVlID8gJycgOiB2YWx1ZTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICBpZiAoKG51bGwgPT0gdmFsdWUgfHwgITEgPT09IHZhbHVlKSAmJiAnc3BlbGxjaGVjaycgIT0gbmFtZSkgbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbnMgPSBpc1N2ZyAmJiBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvXnhsaW5rOj8vLCAnJykpO1xuICAgICAgICAgICAgaWYgKG51bGwgPT0gdmFsdWUgfHwgITEgPT09IHZhbHVlKSBpZiAobnMpIG5vZGUucmVtb3ZlQXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBuYW1lLnRvTG93ZXJDYXNlKCkpOyBlbHNlIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpOyBlbHNlIGlmICgnZnVuY3Rpb24nICE9IHR5cGVvZiB2YWx1ZSkgaWYgKG5zKSBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpLCB2YWx1ZSk7IGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV2ZW50UHJveHkoZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2xbZS50eXBlXShvcHRpb25zLmV2ZW50ICYmIG9wdGlvbnMuZXZlbnQoZSkgfHwgZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZsdXNoTW91bnRzKCkge1xuICAgICAgICB2YXIgYztcbiAgICAgICAgd2hpbGUgKGMgPSBtb3VudHMucG9wKCkpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyTW91bnQpIG9wdGlvbnMuYWZ0ZXJNb3VudChjKTtcbiAgICAgICAgICAgIGlmIChjLmNvbXBvbmVudERpZE1vdW50KSBjLmNvbXBvbmVudERpZE1vdW50KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgcGFyZW50LCBjb21wb25lbnRSb290KSB7XG4gICAgICAgIGlmICghZGlmZkxldmVsKyspIHtcbiAgICAgICAgICAgIGlzU3ZnTW9kZSA9IG51bGwgIT0gcGFyZW50ICYmIHZvaWQgMCAhPT0gcGFyZW50Lm93bmVyU1ZHRWxlbWVudDtcbiAgICAgICAgICAgIGh5ZHJhdGluZyA9IG51bGwgIT0gZG9tICYmICEoJ19fcHJlYWN0YXR0cl8nIGluIGRvbSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IGlkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBjb21wb25lbnRSb290KTtcbiAgICAgICAgaWYgKHBhcmVudCAmJiByZXQucGFyZW50Tm9kZSAhPT0gcGFyZW50KSBwYXJlbnQuYXBwZW5kQ2hpbGQocmV0KTtcbiAgICAgICAgaWYgKCEtLWRpZmZMZXZlbCkge1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gITE7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudFJvb3QpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpIHtcbiAgICAgICAgdmFyIG91dCA9IGRvbSwgcHJldlN2Z01vZGUgPSBpc1N2Z01vZGU7XG4gICAgICAgIGlmIChudWxsID09IHZub2RlIHx8ICdib29sZWFuJyA9PSB0eXBlb2Ygdm5vZGUpIHZub2RlID0gJyc7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUgfHwgJ251bWJlcicgPT0gdHlwZW9mIHZub2RlKSB7XG4gICAgICAgICAgICBpZiAoZG9tICYmIHZvaWQgMCAhPT0gZG9tLnNwbGl0VGV4dCAmJiBkb20ucGFyZW50Tm9kZSAmJiAoIWRvbS5fY29tcG9uZW50IHx8IGNvbXBvbmVudFJvb3QpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVmFsdWUgIT0gdm5vZGUpIGRvbS5ub2RlVmFsdWUgPSB2bm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodm5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShkb20sICEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQuX19wcmVhY3RhdHRyXyA9ICEwO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdm5vZGVOYW1lID0gdm5vZGUubm9kZU5hbWU7XG4gICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiB2bm9kZU5hbWUpIHJldHVybiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgIGlzU3ZnTW9kZSA9ICdzdmcnID09PSB2bm9kZU5hbWUgPyAhMCA6ICdmb3JlaWduT2JqZWN0JyA9PT0gdm5vZGVOYW1lID8gITEgOiBpc1N2Z01vZGU7XG4gICAgICAgIHZub2RlTmFtZSA9IFN0cmluZyh2bm9kZU5hbWUpO1xuICAgICAgICBpZiAoIWRvbSB8fCAhaXNOYW1lZE5vZGUoZG9tLCB2bm9kZU5hbWUpKSB7XG4gICAgICAgICAgICBvdXQgPSBjcmVhdGVOb2RlKHZub2RlTmFtZSwgaXNTdmdNb2RlKTtcbiAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIG91dC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGRvbSwgITApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBmYyA9IG91dC5maXJzdENoaWxkLCBwcm9wcyA9IG91dC5fX3ByZWFjdGF0dHJfLCB2Y2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKG51bGwgPT0gcHJvcHMpIHtcbiAgICAgICAgICAgIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8gPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGEgPSBvdXQuYXR0cmlidXRlcywgaSA9IGEubGVuZ3RoOyBpLS07ICkgcHJvcHNbYVtpXS5uYW1lXSA9IGFbaV0udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoeWRyYXRpbmcgJiYgdmNoaWxkcmVuICYmIDEgPT09IHZjaGlsZHJlbi5sZW5ndGggJiYgJ3N0cmluZycgPT0gdHlwZW9mIHZjaGlsZHJlblswXSAmJiBudWxsICE9IGZjICYmIHZvaWQgMCAhPT0gZmMuc3BsaXRUZXh0ICYmIG51bGwgPT0gZmMubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIGlmIChmYy5ub2RlVmFsdWUgIT0gdmNoaWxkcmVuWzBdKSBmYy5ub2RlVmFsdWUgPSB2Y2hpbGRyZW5bMF07XG4gICAgICAgIH0gZWxzZSBpZiAodmNoaWxkcmVuICYmIHZjaGlsZHJlbi5sZW5ndGggfHwgbnVsbCAhPSBmYykgaW5uZXJEaWZmTm9kZShvdXQsIHZjaGlsZHJlbiwgY29udGV4dCwgbW91bnRBbGwsIGh5ZHJhdGluZyB8fCBudWxsICE9IHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKTtcbiAgICAgICAgZGlmZkF0dHJpYnV0ZXMob3V0LCB2bm9kZS5hdHRyaWJ1dGVzLCBwcm9wcyk7XG4gICAgICAgIGlzU3ZnTW9kZSA9IHByZXZTdmdNb2RlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbm5lckRpZmZOb2RlKGRvbSwgdmNoaWxkcmVuLCBjb250ZXh0LCBtb3VudEFsbCwgaXNIeWRyYXRpbmcpIHtcbiAgICAgICAgdmFyIGosIGMsIGYsIHZjaGlsZCwgY2hpbGQsIG9yaWdpbmFsQ2hpbGRyZW4gPSBkb20uY2hpbGROb2RlcywgY2hpbGRyZW4gPSBbXSwga2V5ZWQgPSB7fSwga2V5ZWRMZW4gPSAwLCBtaW4gPSAwLCBsZW4gPSBvcmlnaW5hbENoaWxkcmVuLmxlbmd0aCwgY2hpbGRyZW5MZW4gPSAwLCB2bGVuID0gdmNoaWxkcmVuID8gdmNoaWxkcmVuLmxlbmd0aCA6IDA7XG4gICAgICAgIGlmICgwICE9PSBsZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBfY2hpbGQgPSBvcmlnaW5hbENoaWxkcmVuW2ldLCBwcm9wcyA9IF9jaGlsZC5fX3ByZWFjdGF0dHJfLCBrZXkgPSB2bGVuICYmIHByb3BzID8gX2NoaWxkLl9jb21wb25lbnQgPyBfY2hpbGQuX2NvbXBvbmVudC5fX2sgOiBwcm9wcy5rZXkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAga2V5ZWRMZW4rKztcbiAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gX2NoaWxkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcyB8fCAodm9pZCAwICE9PSBfY2hpbGQuc3BsaXRUZXh0ID8gaXNIeWRyYXRpbmcgPyBfY2hpbGQubm9kZVZhbHVlLnRyaW0oKSA6ICEwIDogaXNIeWRyYXRpbmcpKSBjaGlsZHJlbltjaGlsZHJlbkxlbisrXSA9IF9jaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoMCAhPT0gdmxlbikgZm9yICh2YXIgaSA9IDA7IGkgPCB2bGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZjaGlsZCA9IHZjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBrZXkgPSB2Y2hpbGQua2V5O1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleWVkTGVuICYmIHZvaWQgMCAhPT0ga2V5ZWRba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGtleWVkW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGtleWVkW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGtleWVkTGVuLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtaW4gPCBjaGlsZHJlbkxlbikgZm9yIChqID0gbWluOyBqIDwgY2hpbGRyZW5MZW47IGorKykgaWYgKHZvaWQgMCAhPT0gY2hpbGRyZW5bal0gJiYgaXNTYW1lTm9kZVR5cGUoYyA9IGNoaWxkcmVuW2pdLCB2Y2hpbGQsIGlzSHlkcmF0aW5nKSkge1xuICAgICAgICAgICAgICAgIGNoaWxkID0gYztcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltqXSA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gY2hpbGRyZW5MZW4gLSAxKSBjaGlsZHJlbkxlbi0tO1xuICAgICAgICAgICAgICAgIGlmIChqID09PSBtaW4pIG1pbisrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hpbGQgPSBpZGlmZihjaGlsZCwgdmNoaWxkLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBmID0gb3JpZ2luYWxDaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZCAmJiBjaGlsZCAhPT0gZG9tICYmIGNoaWxkICE9PSBmKSBpZiAobnVsbCA9PSBmKSBkb20uYXBwZW5kQ2hpbGQoY2hpbGQpOyBlbHNlIGlmIChjaGlsZCA9PT0gZi5uZXh0U2libGluZykgcmVtb3ZlTm9kZShmKTsgZWxzZSBkb20uaW5zZXJ0QmVmb3JlKGNoaWxkLCBmKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ZWRMZW4pIGZvciAodmFyIGkgaW4ga2V5ZWQpIGlmICh2b2lkIDAgIT09IGtleWVkW2ldKSByZWNvbGxlY3ROb2RlVHJlZShrZXllZFtpXSwgITEpO1xuICAgICAgICB3aGlsZSAobWluIDw9IGNoaWxkcmVuTGVuKSBpZiAodm9pZCAwICE9PSAoY2hpbGQgPSBjaGlsZHJlbltjaGlsZHJlbkxlbi0tXSkpIHJlY29sbGVjdE5vZGVUcmVlKGNoaWxkLCAhMSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsIHVubW91bnRPbmx5KSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBub2RlLl9jb21wb25lbnQ7XG4gICAgICAgIGlmIChjb21wb25lbnQpIHVubW91bnRDb21wb25lbnQoY29tcG9uZW50KTsgZWxzZSB7XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBub2RlLl9fcHJlYWN0YXR0cl8gJiYgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZikgbm9kZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgICAgIGlmICghMSA9PT0gdW5tb3VudE9ubHkgfHwgbnVsbCA9PSBub2RlLl9fcHJlYWN0YXR0cl8pIHJlbW92ZU5vZGUobm9kZSk7XG4gICAgICAgICAgICByZW1vdmVDaGlsZHJlbihub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmxhc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBuZXh0ID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShub2RlLCAhMCk7XG4gICAgICAgICAgICBub2RlID0gbmV4dDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBkaWZmQXR0cmlidXRlcyhkb20sIGF0dHJzLCBvbGQpIHtcbiAgICAgICAgdmFyIG5hbWU7XG4gICAgICAgIGZvciAobmFtZSBpbiBvbGQpIGlmICgoIWF0dHJzIHx8IG51bGwgPT0gYXR0cnNbbmFtZV0pICYmIG51bGwgIT0gb2xkW25hbWVdKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gdm9pZCAwLCBpc1N2Z01vZGUpO1xuICAgICAgICBmb3IgKG5hbWUgaW4gYXR0cnMpIGlmICghKCdjaGlsZHJlbicgPT09IG5hbWUgfHwgJ2lubmVySFRNTCcgPT09IG5hbWUgfHwgbmFtZSBpbiBvbGQgJiYgYXR0cnNbbmFtZV0gPT09ICgndmFsdWUnID09PSBuYW1lIHx8ICdjaGVja2VkJyA9PT0gbmFtZSA/IGRvbVtuYW1lXSA6IG9sZFtuYW1lXSkpKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gYXR0cnNbbmFtZV0sIGlzU3ZnTW9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudChDdG9yLCBwcm9wcywgY29udGV4dCkge1xuICAgICAgICB2YXIgaW5zdCwgaSA9IHJlY3ljbGVyQ29tcG9uZW50cy5sZW5ndGg7XG4gICAgICAgIGlmIChDdG9yLnByb3RvdHlwZSAmJiBDdG9yLnByb3RvdHlwZS5yZW5kZXIpIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgQ3Rvcihwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBDb21wb25lbnQuY2FsbChpbnN0LCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IENvbXBvbmVudChwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpbnN0LmNvbnN0cnVjdG9yID0gQ3RvcjtcbiAgICAgICAgICAgIGluc3QucmVuZGVyID0gZG9SZW5kZXI7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGktLSkgaWYgKHJlY3ljbGVyQ29tcG9uZW50c1tpXS5jb25zdHJ1Y3RvciA9PT0gQ3Rvcikge1xuICAgICAgICAgICAgaW5zdC5fX2IgPSByZWN5Y2xlckNvbXBvbmVudHNbaV0uX19iO1xuICAgICAgICAgICAgcmVjeWNsZXJDb21wb25lbnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBkb1JlbmRlcihwcm9wcywgc3RhdGUsIGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRDb21wb25lbnRQcm9wcyhjb21wb25lbnQsIHByb3BzLCByZW5kZXJNb2RlLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3gpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3IgPSBwcm9wcy5yZWY7XG4gICAgICAgICAgICBjb21wb25lbnQuX19rID0gcHJvcHMua2V5O1xuICAgICAgICAgICAgZGVsZXRlIHByb3BzLnJlZjtcbiAgICAgICAgICAgIGRlbGV0ZSBwcm9wcy5rZXk7XG4gICAgICAgICAgICBpZiAodm9pZCAwID09PSBjb21wb25lbnQuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKSBpZiAoIWNvbXBvbmVudC5iYXNlIHx8IG1vdW50QWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0ICYmIGNvbnRleHQgIT09IGNvbXBvbmVudC5jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuX19jKSBjb21wb25lbnQuX19jID0gY29tcG9uZW50LmNvbnRleHQ7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuX19wKSBjb21wb25lbnQuX19wID0gY29tcG9uZW50LnByb3BzO1xuICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICBjb21wb25lbnQuX194ID0gITE7XG4gICAgICAgICAgICBpZiAoMCAhPT0gcmVuZGVyTW9kZSkgaWYgKDEgPT09IHJlbmRlck1vZGUgfHwgITEgIT09IG9wdGlvbnMuc3luY0NvbXBvbmVudFVwZGF0ZXMgfHwgIWNvbXBvbmVudC5iYXNlKSByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCAxLCBtb3VudEFsbCk7IGVsc2UgZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fX3IpIGNvbXBvbmVudC5fX3IoY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCByZW5kZXJNb2RlLCBtb3VudEFsbCwgaXNDaGlsZCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fX3gpIHtcbiAgICAgICAgICAgIHZhciByZW5kZXJlZCwgaW5zdCwgY2Jhc2UsIHByb3BzID0gY29tcG9uZW50LnByb3BzLCBzdGF0ZSA9IGNvbXBvbmVudC5zdGF0ZSwgY29udGV4dCA9IGNvbXBvbmVudC5jb250ZXh0LCBwcmV2aW91c1Byb3BzID0gY29tcG9uZW50Ll9fcCB8fCBwcm9wcywgcHJldmlvdXNTdGF0ZSA9IGNvbXBvbmVudC5fX3MgfHwgc3RhdGUsIHByZXZpb3VzQ29udGV4dCA9IGNvbXBvbmVudC5fX2MgfHwgY29udGV4dCwgaXNVcGRhdGUgPSBjb21wb25lbnQuYmFzZSwgbmV4dEJhc2UgPSBjb21wb25lbnQuX19iLCBpbml0aWFsQmFzZSA9IGlzVXBkYXRlIHx8IG5leHRCYXNlLCBpbml0aWFsQ2hpbGRDb21wb25lbnQgPSBjb21wb25lbnQuX2NvbXBvbmVudCwgc2tpcCA9ICExLCBzbmFwc2hvdCA9IHByZXZpb3VzQ29udGV4dDtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuY29uc3RydWN0b3IuZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSBleHRlbmQoZXh0ZW5kKHt9LCBzdGF0ZSksIGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMsIHN0YXRlKSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcmV2aW91c1Byb3BzO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHByZXZpb3VzU3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBwcmV2aW91c0NvbnRleHQ7XG4gICAgICAgICAgICAgICAgaWYgKDIgIT09IHJlbmRlck1vZGUgJiYgY29tcG9uZW50LnNob3VsZENvbXBvbmVudFVwZGF0ZSAmJiAhMSA9PT0gY29tcG9uZW50LnNob3VsZENvbXBvbmVudFVwZGF0ZShwcm9wcywgc3RhdGUsIGNvbnRleHQpKSBza2lwID0gITA7IGVsc2UgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKSBjb21wb25lbnQuY29tcG9uZW50V2lsbFVwZGF0ZShwcm9wcywgc3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbXBvbmVudC5fX3AgPSBjb21wb25lbnQuX19zID0gY29tcG9uZW50Ll9fYyA9IGNvbXBvbmVudC5fX2IgPSBudWxsO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9fZCA9ICExO1xuICAgICAgICAgICAgaWYgKCFza2lwKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyZWQgPSBjb21wb25lbnQucmVuZGVyKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5nZXRDaGlsZENvbnRleHQpIGNvbnRleHQgPSBleHRlbmQoZXh0ZW5kKHt9LCBjb250ZXh0KSwgY29tcG9uZW50LmdldENoaWxkQ29udGV4dCgpKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNVcGRhdGUgJiYgY29tcG9uZW50LmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKSBzbmFwc2hvdCA9IGNvbXBvbmVudC5nZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZShwcmV2aW91c1Byb3BzLCBwcmV2aW91c1N0YXRlKTtcbiAgICAgICAgICAgICAgICB2YXIgdG9Vbm1vdW50LCBiYXNlLCBjaGlsZENvbXBvbmVudCA9IHJlbmRlcmVkICYmIHJlbmRlcmVkLm5vZGVOYW1lO1xuICAgICAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBjaGlsZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRQcm9wcyA9IGdldE5vZGVQcm9wcyhyZW5kZXJlZCk7XG4gICAgICAgICAgICAgICAgICAgIGluc3QgPSBpbml0aWFsQ2hpbGRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnN0ICYmIGluc3QuY29uc3RydWN0b3IgPT09IGNoaWxkQ29tcG9uZW50ICYmIGNoaWxkUHJvcHMua2V5ID09IGluc3QuX19rKSBzZXRDb21wb25lbnRQcm9wcyhpbnN0LCBjaGlsZFByb3BzLCAxLCBjb250ZXh0LCAhMSk7IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9Vbm1vdW50ID0gaW5zdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5fY29tcG9uZW50ID0gaW5zdCA9IGNyZWF0ZUNvbXBvbmVudChjaGlsZENvbXBvbmVudCwgY2hpbGRQcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fYiA9IGluc3QuX19iIHx8IG5leHRCYXNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdC5fX3UgPSBjb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhpbnN0LCBjaGlsZFByb3BzLCAwLCBjb250ZXh0LCAhMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJDb21wb25lbnQoaW5zdCwgMSwgbW91bnRBbGwsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBiYXNlID0gaW5zdC5iYXNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNiYXNlID0gaW5pdGlhbEJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHRvVW5tb3VudCA9IGluaXRpYWxDaGlsZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgY2Jhc2UgPSBjb21wb25lbnQuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsQmFzZSB8fCAxID09PSByZW5kZXJNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2Jhc2UpIGNiYXNlLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZSA9IGRpZmYoY2Jhc2UsIHJlbmRlcmVkLCBjb250ZXh0LCBtb3VudEFsbCB8fCAhaXNVcGRhdGUsIGluaXRpYWxCYXNlICYmIGluaXRpYWxCYXNlLnBhcmVudE5vZGUsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEJhc2UgJiYgYmFzZSAhPT0gaW5pdGlhbEJhc2UgJiYgaW5zdCAhPT0gaW5pdGlhbENoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiYXNlUGFyZW50ID0gaW5pdGlhbEJhc2UucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2VQYXJlbnQgJiYgYmFzZSAhPT0gYmFzZVBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZVBhcmVudC5yZXBsYWNlQ2hpbGQoYmFzZSwgaW5pdGlhbEJhc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0b1VubW91bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsQmFzZS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShpbml0aWFsQmFzZSwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0b1VubW91bnQpIHVubW91bnRDb21wb25lbnQodG9Vbm1vdW50KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuYmFzZSA9IGJhc2U7XG4gICAgICAgICAgICAgICAgaWYgKGJhc2UgJiYgIWlzQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudFJlZiA9IGNvbXBvbmVudCwgdCA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHQgPSB0Ll9fdSkgKGNvbXBvbmVudFJlZiA9IHQpLmJhc2UgPSBiYXNlO1xuICAgICAgICAgICAgICAgICAgICBiYXNlLl9jb21wb25lbnQgPSBjb21wb25lbnRSZWY7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UuX2NvbXBvbmVudENvbnN0cnVjdG9yID0gY29tcG9uZW50UmVmLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNVcGRhdGUgfHwgbW91bnRBbGwpIG1vdW50cy51bnNoaWZ0KGNvbXBvbmVudCk7IGVsc2UgaWYgKCFza2lwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnREaWRVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnREaWRVcGRhdGUocHJldmlvdXNQcm9wcywgcHJldmlvdXNTdGF0ZSwgc25hcHNob3QpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyVXBkYXRlKSBvcHRpb25zLmFmdGVyVXBkYXRlKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoY29tcG9uZW50Ll9faC5sZW5ndGgpIGNvbXBvbmVudC5fX2gucG9wKCkuY2FsbChjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKCFkaWZmTGV2ZWwgJiYgIWlzQ2hpbGQpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGRDb21wb25lbnRGcm9tVk5vZGUoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgdmFyIGMgPSBkb20gJiYgZG9tLl9jb21wb25lbnQsIG9yaWdpbmFsQ29tcG9uZW50ID0gYywgb2xkRG9tID0gZG9tLCBpc0RpcmVjdE93bmVyID0gYyAmJiBkb20uX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZSwgaXNPd25lciA9IGlzRGlyZWN0T3duZXIsIHByb3BzID0gZ2V0Tm9kZVByb3BzKHZub2RlKTtcbiAgICAgICAgd2hpbGUgKGMgJiYgIWlzT3duZXIgJiYgKGMgPSBjLl9fdSkpIGlzT3duZXIgPSBjLmNvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICAgICAgaWYgKGMgJiYgaXNPd25lciAmJiAoIW1vdW50QWxsIHx8IGMuX2NvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCAzLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBkb20gPSBjLmJhc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWxDb21wb25lbnQgJiYgIWlzRGlyZWN0T3duZXIpIHtcbiAgICAgICAgICAgICAgICB1bm1vdW50Q29tcG9uZW50KG9yaWdpbmFsQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICBkb20gPSBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYyA9IGNyZWF0ZUNvbXBvbmVudCh2bm9kZS5ub2RlTmFtZSwgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGRvbSAmJiAhYy5fX2IpIHtcbiAgICAgICAgICAgICAgICBjLl9fYiA9IGRvbTtcbiAgICAgICAgICAgICAgICBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoYywgcHJvcHMsIDEsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGRvbSA9IGMuYmFzZTtcbiAgICAgICAgICAgIGlmIChvbGREb20gJiYgZG9tICE9PSBvbGREb20pIHtcbiAgICAgICAgICAgICAgICBvbGREb20uX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUob2xkRG9tLCAhMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvbTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdW5tb3VudENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYmVmb3JlVW5tb3VudCkgb3B0aW9ucy5iZWZvcmVVbm1vdW50KGNvbXBvbmVudCk7XG4gICAgICAgIHZhciBiYXNlID0gY29tcG9uZW50LmJhc2U7XG4gICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG4gICAgICAgIGNvbXBvbmVudC5iYXNlID0gbnVsbDtcbiAgICAgICAgdmFyIGlubmVyID0gY29tcG9uZW50Ll9jb21wb25lbnQ7XG4gICAgICAgIGlmIChpbm5lcikgdW5tb3VudENvbXBvbmVudChpbm5lcik7IGVsc2UgaWYgKGJhc2UpIHtcbiAgICAgICAgICAgIGlmIChiYXNlLl9fcHJlYWN0YXR0cl8gJiYgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZikgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX2IgPSBiYXNlO1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShiYXNlKTtcbiAgICAgICAgICAgIHJlY3ljbGVyQ29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgICAgICByZW1vdmVDaGlsZHJlbihiYXNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcG9uZW50Ll9fcikgY29tcG9uZW50Ll9fcihudWxsKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuX19kID0gITA7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhdGUgfHwge307XG4gICAgICAgIHRoaXMuX19oID0gW107XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbmRlcih2bm9kZSwgcGFyZW50LCBtZXJnZSkge1xuICAgICAgICByZXR1cm4gZGlmZihtZXJnZSwgdm5vZGUsIHt9LCAhMSwgcGFyZW50LCAhMSk7XG4gICAgfVxuICAgIHZhciBWTm9kZSA9IGZ1bmN0aW9uKCkge307XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICB2YXIgRU1QVFlfQ0hJTERSRU4gPSBbXTtcbiAgICB2YXIgZGVmZXIgPSAnZnVuY3Rpb24nID09IHR5cGVvZiBQcm9taXNlID8gUHJvbWlzZS5yZXNvbHZlKCkudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKSA6IHNldFRpbWVvdXQ7XG4gICAgdmFyIElTX05PTl9ESU1FTlNJT05BTCA9IC9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHZhciBtb3VudHMgPSBbXTtcbiAgICB2YXIgZGlmZkxldmVsID0gMDtcbiAgICB2YXIgaXNTdmdNb2RlID0gITE7XG4gICAgdmFyIGh5ZHJhdGluZyA9ICExO1xuICAgIHZhciByZWN5Y2xlckNvbXBvbmVudHMgPSBbXTtcbiAgICBleHRlbmQoQ29tcG9uZW50LnByb3RvdHlwZSwge1xuICAgICAgICBzZXRTdGF0ZTogZnVuY3Rpb24oc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX19zKSB0aGlzLl9fcyA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gZXh0ZW5kKGV4dGVuZCh7fSwgdGhpcy5zdGF0ZSksICdmdW5jdGlvbicgPT0gdHlwZW9mIHN0YXRlID8gc3RhdGUodGhpcy5zdGF0ZSwgdGhpcy5wcm9wcykgOiBzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHRoaXMuX19oLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgZW5xdWV1ZVJlbmRlcih0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9yY2VVcGRhdGU6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHRoaXMuX19oLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmVuZGVyQ29tcG9uZW50KHRoaXMsIDIpO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgcHJlYWN0ID0ge1xuICAgICAgICBoOiBoLFxuICAgICAgICBjcmVhdGVFbGVtZW50OiBoLFxuICAgICAgICBjbG9uZUVsZW1lbnQ6IGNsb25lRWxlbWVudCxcbiAgICAgICAgQ29tcG9uZW50OiBDb21wb25lbnQsXG4gICAgICAgIHJlbmRlcjogcmVuZGVyLFxuICAgICAgICByZXJlbmRlcjogcmVyZW5kZXIsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9O1xuICAgIGlmICgndW5kZWZpbmVkJyAhPSB0eXBlb2YgbW9kdWxlKSBtb2R1bGUuZXhwb3J0cyA9IHByZWFjdDsgZWxzZSBzZWxmLnByZWFjdCA9IHByZWFjdDtcbn0oKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZWFjdC5qcy5tYXAiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyohIGh0dHBzOi8vbXRocy5iZS9wdW55Y29kZSB2MS40LjEgYnkgQG1hdGhpYXMgKi9cbjsoZnVuY3Rpb24ocm9vdCkge1xuXG5cdC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZXMgKi9cblx0dmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJlxuXHRcdCFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cdHZhciBmcmVlTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiZcblx0XHQhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblx0dmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcblx0aWYgKFxuXHRcdGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8XG5cdFx0ZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwgfHxcblx0XHRmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWxcblx0KSB7XG5cdFx0cm9vdCA9IGZyZWVHbG9iYWw7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGBwdW55Y29kZWAgb2JqZWN0LlxuXHQgKiBAbmFtZSBwdW55Y29kZVxuXHQgKiBAdHlwZSBPYmplY3Rcblx0ICovXG5cdHZhciBwdW55Y29kZSxcblxuXHQvKiogSGlnaGVzdCBwb3NpdGl2ZSBzaWduZWQgMzItYml0IGZsb2F0IHZhbHVlICovXG5cdG1heEludCA9IDIxNDc0ODM2NDcsIC8vIGFrYS4gMHg3RkZGRkZGRiBvciAyXjMxLTFcblxuXHQvKiogQm9vdHN0cmluZyBwYXJhbWV0ZXJzICovXG5cdGJhc2UgPSAzNixcblx0dE1pbiA9IDEsXG5cdHRNYXggPSAyNixcblx0c2tldyA9IDM4LFxuXHRkYW1wID0gNzAwLFxuXHRpbml0aWFsQmlhcyA9IDcyLFxuXHRpbml0aWFsTiA9IDEyOCwgLy8gMHg4MFxuXHRkZWxpbWl0ZXIgPSAnLScsIC8vICdcXHgyRCdcblxuXHQvKiogUmVndWxhciBleHByZXNzaW9ucyAqL1xuXHRyZWdleFB1bnljb2RlID0gL154bi0tLyxcblx0cmVnZXhOb25BU0NJSSA9IC9bXlxceDIwLVxceDdFXS8sIC8vIHVucHJpbnRhYmxlIEFTQ0lJIGNoYXJzICsgbm9uLUFTQ0lJIGNoYXJzXG5cdHJlZ2V4U2VwYXJhdG9ycyA9IC9bXFx4MkVcXHUzMDAyXFx1RkYwRVxcdUZGNjFdL2csIC8vIFJGQyAzNDkwIHNlcGFyYXRvcnNcblxuXHQvKiogRXJyb3IgbWVzc2FnZXMgKi9cblx0ZXJyb3JzID0ge1xuXHRcdCdvdmVyZmxvdyc6ICdPdmVyZmxvdzogaW5wdXQgbmVlZHMgd2lkZXIgaW50ZWdlcnMgdG8gcHJvY2VzcycsXG5cdFx0J25vdC1iYXNpYyc6ICdJbGxlZ2FsIGlucHV0ID49IDB4ODAgKG5vdCBhIGJhc2ljIGNvZGUgcG9pbnQpJyxcblx0XHQnaW52YWxpZC1pbnB1dCc6ICdJbnZhbGlkIGlucHV0J1xuXHR9LFxuXG5cdC8qKiBDb252ZW5pZW5jZSBzaG9ydGN1dHMgKi9cblx0YmFzZU1pbnVzVE1pbiA9IGJhc2UgLSB0TWluLFxuXHRmbG9vciA9IE1hdGguZmxvb3IsXG5cdHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGUsXG5cblx0LyoqIFRlbXBvcmFyeSB2YXJpYWJsZSAqL1xuXHRrZXk7XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqXG5cdCAqIEEgZ2VuZXJpYyBlcnJvciB1dGlsaXR5IGZ1bmN0aW9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgZXJyb3IgdHlwZS5cblx0ICogQHJldHVybnMge0Vycm9yfSBUaHJvd3MgYSBgUmFuZ2VFcnJvcmAgd2l0aCB0aGUgYXBwbGljYWJsZSBlcnJvciBtZXNzYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZXJyb3IodHlwZSkge1xuXHRcdHRocm93IG5ldyBSYW5nZUVycm9yKGVycm9yc1t0eXBlXSk7XG5cdH1cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGBBcnJheSNtYXBgIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeSBhcnJheVxuXHQgKiBpdGVtLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IGFycmF5IG9mIHZhbHVlcyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBtYXAoYXJyYXksIGZuKSB7XG5cdFx0dmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblx0XHR2YXIgcmVzdWx0ID0gW107XG5cdFx0d2hpbGUgKGxlbmd0aC0tKSB7XG5cdFx0XHRyZXN1bHRbbGVuZ3RoXSA9IGZuKGFycmF5W2xlbmd0aF0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgc2ltcGxlIGBBcnJheSNtYXBgLWxpa2Ugd3JhcHBlciB0byB3b3JrIHdpdGggZG9tYWluIG5hbWUgc3RyaW5ncyBvciBlbWFpbFxuXHQgKiBhZGRyZXNzZXMuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gVGhlIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGZvciBldmVyeVxuXHQgKiBjaGFyYWN0ZXIuXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgc3RyaW5nIG9mIGNoYXJhY3RlcnMgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrXG5cdCAqIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwRG9tYWluKHN0cmluZywgZm4pIHtcblx0XHR2YXIgcGFydHMgPSBzdHJpbmcuc3BsaXQoJ0AnKTtcblx0XHR2YXIgcmVzdWx0ID0gJyc7XG5cdFx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdC8vIEluIGVtYWlsIGFkZHJlc3Nlcywgb25seSB0aGUgZG9tYWluIG5hbWUgc2hvdWxkIGJlIHB1bnljb2RlZC4gTGVhdmVcblx0XHRcdC8vIHRoZSBsb2NhbCBwYXJ0IChpLmUuIGV2ZXJ5dGhpbmcgdXAgdG8gYEBgKSBpbnRhY3QuXG5cdFx0XHRyZXN1bHQgPSBwYXJ0c1swXSArICdAJztcblx0XHRcdHN0cmluZyA9IHBhcnRzWzFdO1xuXHRcdH1cblx0XHQvLyBBdm9pZCBgc3BsaXQocmVnZXgpYCBmb3IgSUU4IGNvbXBhdGliaWxpdHkuIFNlZSAjMTcuXG5cdFx0c3RyaW5nID0gc3RyaW5nLnJlcGxhY2UocmVnZXhTZXBhcmF0b3JzLCAnXFx4MkUnKTtcblx0XHR2YXIgbGFiZWxzID0gc3RyaW5nLnNwbGl0KCcuJyk7XG5cdFx0dmFyIGVuY29kZWQgPSBtYXAobGFiZWxzLCBmbikuam9pbignLicpO1xuXHRcdHJldHVybiByZXN1bHQgKyBlbmNvZGVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgbnVtZXJpYyBjb2RlIHBvaW50cyBvZiBlYWNoIFVuaWNvZGVcblx0ICogY2hhcmFjdGVyIGluIHRoZSBzdHJpbmcuIFdoaWxlIEphdmFTY3JpcHQgdXNlcyBVQ1MtMiBpbnRlcm5hbGx5LFxuXHQgKiB0aGlzIGZ1bmN0aW9uIHdpbGwgY29udmVydCBhIHBhaXIgb2Ygc3Vycm9nYXRlIGhhbHZlcyAoZWFjaCBvZiB3aGljaFxuXHQgKiBVQ1MtMiBleHBvc2VzIGFzIHNlcGFyYXRlIGNoYXJhY3RlcnMpIGludG8gYSBzaW5nbGUgY29kZSBwb2ludCxcblx0ICogbWF0Y2hpbmcgVVRGLTE2LlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmVuY29kZWBcblx0ICogQHNlZSA8aHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmc+XG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG5cdCAqIEBuYW1lIGRlY29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIFRoZSBVbmljb2RlIGlucHV0IHN0cmluZyAoVUNTLTIpLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBuZXcgYXJyYXkgb2YgY29kZSBwb2ludHMuXG5cdCAqL1xuXHRmdW5jdGlvbiB1Y3MyZGVjb2RlKHN0cmluZykge1xuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgY291bnRlciA9IDAsXG5cdFx0ICAgIGxlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG5cdFx0ICAgIHZhbHVlLFxuXHRcdCAgICBleHRyYTtcblx0XHR3aGlsZSAoY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0dmFsdWUgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0aWYgKHZhbHVlID49IDB4RDgwMCAmJiB2YWx1ZSA8PSAweERCRkYgJiYgY291bnRlciA8IGxlbmd0aCkge1xuXHRcdFx0XHQvLyBoaWdoIHN1cnJvZ2F0ZSwgYW5kIHRoZXJlIGlzIGEgbmV4dCBjaGFyYWN0ZXJcblx0XHRcdFx0ZXh0cmEgPSBzdHJpbmcuY2hhckNvZGVBdChjb3VudGVyKyspO1xuXHRcdFx0XHRpZiAoKGV4dHJhICYgMHhGQzAwKSA9PSAweERDMDApIHsgLy8gbG93IHN1cnJvZ2F0ZVxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKCgodmFsdWUgJiAweDNGRikgPDwgMTApICsgKGV4dHJhICYgMHgzRkYpICsgMHgxMDAwMCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gdW5tYXRjaGVkIHN1cnJvZ2F0ZTsgb25seSBhcHBlbmQgdGhpcyBjb2RlIHVuaXQsIGluIGNhc2UgdGhlIG5leHRcblx0XHRcdFx0XHQvLyBjb2RlIHVuaXQgaXMgdGhlIGhpZ2ggc3Vycm9nYXRlIG9mIGEgc3Vycm9nYXRlIHBhaXJcblx0XHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHRcdFx0Y291bnRlci0tO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdXRwdXQucHVzaCh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIHN0cmluZyBiYXNlZCBvbiBhbiBhcnJheSBvZiBudW1lcmljIGNvZGUgcG9pbnRzLlxuXHQgKiBAc2VlIGBwdW55Y29kZS51Y3MyLmRlY29kZWBcblx0ICogQG1lbWJlck9mIHB1bnljb2RlLnVjczJcblx0ICogQG5hbWUgZW5jb2RlXG5cdCAqIEBwYXJhbSB7QXJyYXl9IGNvZGVQb2ludHMgVGhlIGFycmF5IG9mIG51bWVyaWMgY29kZSBwb2ludHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBuZXcgVW5pY29kZSBzdHJpbmcgKFVDUy0yKS5cblx0ICovXG5cdGZ1bmN0aW9uIHVjczJlbmNvZGUoYXJyYXkpIHtcblx0XHRyZXR1cm4gbWFwKGFycmF5LCBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0dmFyIG91dHB1dCA9ICcnO1xuXHRcdFx0aWYgKHZhbHVlID4gMHhGRkZGKSB7XG5cdFx0XHRcdHZhbHVlIC09IDB4MTAwMDA7XG5cdFx0XHRcdG91dHB1dCArPSBzdHJpbmdGcm9tQ2hhckNvZGUodmFsdWUgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApO1xuXHRcdFx0XHR2YWx1ZSA9IDB4REMwMCB8IHZhbHVlICYgMHgzRkY7XG5cdFx0XHR9XG5cdFx0XHRvdXRwdXQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKHZhbHVlKTtcblx0XHRcdHJldHVybiBvdXRwdXQ7XG5cdFx0fSkuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBiYXNpYyBjb2RlIHBvaW50IGludG8gYSBkaWdpdC9pbnRlZ2VyLlxuXHQgKiBAc2VlIGBkaWdpdFRvQmFzaWMoKWBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGNvZGVQb2ludCBUaGUgYmFzaWMgbnVtZXJpYyBjb2RlIHBvaW50IHZhbHVlLlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgbnVtZXJpYyB2YWx1ZSBvZiBhIGJhc2ljIGNvZGUgcG9pbnQgKGZvciB1c2UgaW5cblx0ICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpbiB0aGUgcmFuZ2UgYDBgIHRvIGBiYXNlIC0gMWAsIG9yIGBiYXNlYCBpZlxuXHQgKiB0aGUgY29kZSBwb2ludCBkb2VzIG5vdCByZXByZXNlbnQgYSB2YWx1ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGJhc2ljVG9EaWdpdChjb2RlUG9pbnQpIHtcblx0XHRpZiAoY29kZVBvaW50IC0gNDggPCAxMCkge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDIyO1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gNjUgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDY1O1xuXHRcdH1cblx0XHRpZiAoY29kZVBvaW50IC0gOTcgPCAyNikge1xuXHRcdFx0cmV0dXJuIGNvZGVQb2ludCAtIDk3O1xuXHRcdH1cblx0XHRyZXR1cm4gYmFzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGRpZ2l0L2ludGVnZXIgaW50byBhIGJhc2ljIGNvZGUgcG9pbnQuXG5cdCAqIEBzZWUgYGJhc2ljVG9EaWdpdCgpYFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gZGlnaXQgVGhlIG51bWVyaWMgdmFsdWUgb2YgYSBiYXNpYyBjb2RlIHBvaW50LlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgYmFzaWMgY29kZSBwb2ludCB3aG9zZSB2YWx1ZSAod2hlbiB1c2VkIGZvclxuXHQgKiByZXByZXNlbnRpbmcgaW50ZWdlcnMpIGlzIGBkaWdpdGAsIHdoaWNoIG5lZWRzIHRvIGJlIGluIHRoZSByYW5nZVxuXHQgKiBgMGAgdG8gYGJhc2UgLSAxYC4gSWYgYGZsYWdgIGlzIG5vbi16ZXJvLCB0aGUgdXBwZXJjYXNlIGZvcm0gaXNcblx0ICogdXNlZDsgZWxzZSwgdGhlIGxvd2VyY2FzZSBmb3JtIGlzIHVzZWQuIFRoZSBiZWhhdmlvciBpcyB1bmRlZmluZWRcblx0ICogaWYgYGZsYWdgIGlzIG5vbi16ZXJvIGFuZCBgZGlnaXRgIGhhcyBubyB1cHBlcmNhc2UgZm9ybS5cblx0ICovXG5cdGZ1bmN0aW9uIGRpZ2l0VG9CYXNpYyhkaWdpdCwgZmxhZykge1xuXHRcdC8vICAwLi4yNSBtYXAgdG8gQVNDSUkgYS4ueiBvciBBLi5aXG5cdFx0Ly8gMjYuLjM1IG1hcCB0byBBU0NJSSAwLi45XG5cdFx0cmV0dXJuIGRpZ2l0ICsgMjIgKyA3NSAqIChkaWdpdCA8IDI2KSAtICgoZmxhZyAhPSAwKSA8PCA1KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaWFzIGFkYXB0YXRpb24gZnVuY3Rpb24gYXMgcGVyIHNlY3Rpb24gMy40IG9mIFJGQyAzNDkyLlxuXHQgKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzQ5MiNzZWN0aW9uLTMuNFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0ZnVuY3Rpb24gYWRhcHQoZGVsdGEsIG51bVBvaW50cywgZmlyc3RUaW1lKSB7XG5cdFx0dmFyIGsgPSAwO1xuXHRcdGRlbHRhID0gZmlyc3RUaW1lID8gZmxvb3IoZGVsdGEgLyBkYW1wKSA6IGRlbHRhID4+IDE7XG5cdFx0ZGVsdGEgKz0gZmxvb3IoZGVsdGEgLyBudW1Qb2ludHMpO1xuXHRcdGZvciAoLyogbm8gaW5pdGlhbGl6YXRpb24gKi87IGRlbHRhID4gYmFzZU1pbnVzVE1pbiAqIHRNYXggPj4gMTsgayArPSBiYXNlKSB7XG5cdFx0XHRkZWx0YSA9IGZsb29yKGRlbHRhIC8gYmFzZU1pbnVzVE1pbik7XG5cdFx0fVxuXHRcdHJldHVybiBmbG9vcihrICsgKGJhc2VNaW51c1RNaW4gKyAxKSAqIGRlbHRhIC8gKGRlbHRhICsgc2tldykpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scyB0byBhIHN0cmluZyBvZiBVbmljb2RlXG5cdCAqIHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuXHRcdC8vIERvbid0IHVzZSBVQ1MtMlxuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGgsXG5cdFx0ICAgIG91dCxcblx0XHQgICAgaSA9IDAsXG5cdFx0ICAgIG4gPSBpbml0aWFsTixcblx0XHQgICAgYmlhcyA9IGluaXRpYWxCaWFzLFxuXHRcdCAgICBiYXNpYyxcblx0XHQgICAgaixcblx0XHQgICAgaW5kZXgsXG5cdFx0ICAgIG9sZGksXG5cdFx0ICAgIHcsXG5cdFx0ICAgIGssXG5cdFx0ICAgIGRpZ2l0LFxuXHRcdCAgICB0LFxuXHRcdCAgICAvKiogQ2FjaGVkIGNhbGN1bGF0aW9uIHJlc3VsdHMgKi9cblx0XHQgICAgYmFzZU1pbnVzVDtcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHM6IGxldCBgYmFzaWNgIGJlIHRoZSBudW1iZXIgb2YgaW5wdXQgY29kZVxuXHRcdC8vIHBvaW50cyBiZWZvcmUgdGhlIGxhc3QgZGVsaW1pdGVyLCBvciBgMGAgaWYgdGhlcmUgaXMgbm9uZSwgdGhlbiBjb3B5XG5cdFx0Ly8gdGhlIGZpcnN0IGJhc2ljIGNvZGUgcG9pbnRzIHRvIHRoZSBvdXRwdXQuXG5cblx0XHRiYXNpYyA9IGlucHV0Lmxhc3RJbmRleE9mKGRlbGltaXRlcik7XG5cdFx0aWYgKGJhc2ljIDwgMCkge1xuXHRcdFx0YmFzaWMgPSAwO1xuXHRcdH1cblxuXHRcdGZvciAoaiA9IDA7IGogPCBiYXNpYzsgKytqKSB7XG5cdFx0XHQvLyBpZiBpdCdzIG5vdCBhIGJhc2ljIGNvZGUgcG9pbnRcblx0XHRcdGlmIChpbnB1dC5jaGFyQ29kZUF0KGopID49IDB4ODApIHtcblx0XHRcdFx0ZXJyb3IoJ25vdC1iYXNpYycpO1xuXHRcdFx0fVxuXHRcdFx0b3V0cHV0LnB1c2goaW5wdXQuY2hhckNvZGVBdChqKSk7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBkZWNvZGluZyBsb29wOiBzdGFydCBqdXN0IGFmdGVyIHRoZSBsYXN0IGRlbGltaXRlciBpZiBhbnkgYmFzaWMgY29kZVxuXHRcdC8vIHBvaW50cyB3ZXJlIGNvcGllZDsgc3RhcnQgYXQgdGhlIGJlZ2lubmluZyBvdGhlcndpc2UuXG5cblx0XHRmb3IgKGluZGV4ID0gYmFzaWMgPiAwID8gYmFzaWMgKyAxIDogMDsgaW5kZXggPCBpbnB1dExlbmd0aDsgLyogbm8gZmluYWwgZXhwcmVzc2lvbiAqLykge1xuXG5cdFx0XHQvLyBgaW5kZXhgIGlzIHRoZSBpbmRleCBvZiB0aGUgbmV4dCBjaGFyYWN0ZXIgdG8gYmUgY29uc3VtZWQuXG5cdFx0XHQvLyBEZWNvZGUgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlciBpbnRvIGBkZWx0YWAsXG5cdFx0XHQvLyB3aGljaCBnZXRzIGFkZGVkIHRvIGBpYC4gVGhlIG92ZXJmbG93IGNoZWNraW5nIGlzIGVhc2llclxuXHRcdFx0Ly8gaWYgd2UgaW5jcmVhc2UgYGlgIGFzIHdlIGdvLCB0aGVuIHN1YnRyYWN0IG9mZiBpdHMgc3RhcnRpbmdcblx0XHRcdC8vIHZhbHVlIGF0IHRoZSBlbmQgdG8gb2J0YWluIGBkZWx0YWAuXG5cdFx0XHRmb3IgKG9sZGkgPSBpLCB3ID0gMSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cblx0XHRcdFx0aWYgKGluZGV4ID49IGlucHV0TGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ2ludmFsaWQtaW5wdXQnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRpZ2l0ID0gYmFzaWNUb0RpZ2l0KGlucHV0LmNoYXJDb2RlQXQoaW5kZXgrKykpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA+PSBiYXNlIHx8IGRpZ2l0ID4gZmxvb3IoKG1heEludCAtIGkpIC8gdykpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGkgKz0gZGlnaXQgKiB3O1xuXHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblxuXHRcdFx0XHRpZiAoZGlnaXQgPCB0KSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRiYXNlTWludXNUID0gYmFzZSAtIHQ7XG5cdFx0XHRcdGlmICh3ID4gZmxvb3IobWF4SW50IC8gYmFzZU1pbnVzVCkpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHcgKj0gYmFzZU1pbnVzVDtcblxuXHRcdFx0fVxuXG5cdFx0XHRvdXQgPSBvdXRwdXQubGVuZ3RoICsgMTtcblx0XHRcdGJpYXMgPSBhZGFwdChpIC0gb2xkaSwgb3V0LCBvbGRpID09IDApO1xuXG5cdFx0XHQvLyBgaWAgd2FzIHN1cHBvc2VkIHRvIHdyYXAgYXJvdW5kIGZyb20gYG91dGAgdG8gYDBgLFxuXHRcdFx0Ly8gaW5jcmVtZW50aW5nIGBuYCBlYWNoIHRpbWUsIHNvIHdlJ2xsIGZpeCB0aGF0IG5vdzpcblx0XHRcdGlmIChmbG9vcihpIC8gb3V0KSA+IG1heEludCAtIG4pIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdG4gKz0gZmxvb3IoaSAvIG91dCk7XG5cdFx0XHRpICU9IG91dDtcblxuXHRcdFx0Ly8gSW5zZXJ0IGBuYCBhdCBwb3NpdGlvbiBgaWAgb2YgdGhlIG91dHB1dFxuXHRcdFx0b3V0cHV0LnNwbGljZShpKyssIDAsIG4pO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVjczJlbmNvZGUob3V0cHV0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMgKGUuZy4gYSBkb21haW4gbmFtZSBsYWJlbCkgdG8gYVxuXHQgKiBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBlbmNvZGUoaW5wdXQpIHtcblx0XHR2YXIgbixcblx0XHQgICAgZGVsdGEsXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50LFxuXHRcdCAgICBiYXNpY0xlbmd0aCxcblx0XHQgICAgYmlhcyxcblx0XHQgICAgaixcblx0XHQgICAgbSxcblx0XHQgICAgcSxcblx0XHQgICAgayxcblx0XHQgICAgdCxcblx0XHQgICAgY3VycmVudFZhbHVlLFxuXHRcdCAgICBvdXRwdXQgPSBbXSxcblx0XHQgICAgLyoqIGBpbnB1dExlbmd0aGAgd2lsbCBob2xkIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgaW4gYGlucHV0YC4gKi9cblx0XHQgICAgaW5wdXRMZW5ndGgsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsXG5cdFx0ICAgIGJhc2VNaW51c1QsXG5cdFx0ICAgIHFNaW51c1Q7XG5cblx0XHQvLyBDb252ZXJ0IHRoZSBpbnB1dCBpbiBVQ1MtMiB0byBVbmljb2RlXG5cdFx0aW5wdXQgPSB1Y3MyZGVjb2RlKGlucHV0KTtcblxuXHRcdC8vIENhY2hlIHRoZSBsZW5ndGhcblx0XHRpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aDtcblxuXHRcdC8vIEluaXRpYWxpemUgdGhlIHN0YXRlXG5cdFx0biA9IGluaXRpYWxOO1xuXHRcdGRlbHRhID0gMDtcblx0XHRiaWFzID0gaW5pdGlhbEJpYXM7XG5cblx0XHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzXG5cdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IDB4ODApIHtcblx0XHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGN1cnJlbnRWYWx1ZSkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGhhbmRsZWRDUENvdW50ID0gYmFzaWNMZW5ndGggPSBvdXRwdXQubGVuZ3RoO1xuXG5cdFx0Ly8gYGhhbmRsZWRDUENvdW50YCBpcyB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIHRoYXQgaGF2ZSBiZWVuIGhhbmRsZWQ7XG5cdFx0Ly8gYGJhc2ljTGVuZ3RoYCBpcyB0aGUgbnVtYmVyIG9mIGJhc2ljIGNvZGUgcG9pbnRzLlxuXG5cdFx0Ly8gRmluaXNoIHRoZSBiYXNpYyBzdHJpbmcgLSBpZiBpdCBpcyBub3QgZW1wdHkgLSB3aXRoIGEgZGVsaW1pdGVyXG5cdFx0aWYgKGJhc2ljTGVuZ3RoKSB7XG5cdFx0XHRvdXRwdXQucHVzaChkZWxpbWl0ZXIpO1xuXHRcdH1cblxuXHRcdC8vIE1haW4gZW5jb2RpbmcgbG9vcDpcblx0XHR3aGlsZSAoaGFuZGxlZENQQ291bnQgPCBpbnB1dExlbmd0aCkge1xuXG5cdFx0XHQvLyBBbGwgbm9uLWJhc2ljIGNvZGUgcG9pbnRzIDwgbiBoYXZlIGJlZW4gaGFuZGxlZCBhbHJlYWR5LiBGaW5kIHRoZSBuZXh0XG5cdFx0XHQvLyBsYXJnZXIgb25lOlxuXHRcdFx0Zm9yIChtID0gbWF4SW50LCBqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPj0gbiAmJiBjdXJyZW50VmFsdWUgPCBtKSB7XG5cdFx0XHRcdFx0bSA9IGN1cnJlbnRWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbmNyZWFzZSBgZGVsdGFgIGVub3VnaCB0byBhZHZhbmNlIHRoZSBkZWNvZGVyJ3MgPG4saT4gc3RhdGUgdG8gPG0sMD4sXG5cdFx0XHQvLyBidXQgZ3VhcmQgYWdhaW5zdCBvdmVyZmxvd1xuXHRcdFx0aGFuZGxlZENQQ291bnRQbHVzT25lID0gaGFuZGxlZENQQ291bnQgKyAxO1xuXHRcdFx0aWYgKG0gLSBuID4gZmxvb3IoKG1heEludCAtIGRlbHRhKSAvIGhhbmRsZWRDUENvdW50UGx1c09uZSkpIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGRlbHRhICs9IChtIC0gbikgKiBoYW5kbGVkQ1BDb3VudFBsdXNPbmU7XG5cdFx0XHRuID0gbTtcblxuXHRcdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IG4gJiYgKytkZWx0YSA+IG1heEludCkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PSBuKSB7XG5cdFx0XHRcdFx0Ly8gUmVwcmVzZW50IGRlbHRhIGFzIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXJcblx0XHRcdFx0XHRmb3IgKHEgPSBkZWx0YSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cdFx0XHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblx0XHRcdFx0XHRcdGlmIChxIDwgdCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHFNaW51c1QgPSBxIC0gdDtcblx0XHRcdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKFxuXHRcdFx0XHRcdFx0XHRzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHQgKyBxTWludXNUICUgYmFzZU1pbnVzVCwgMCkpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0cSA9IGZsb29yKHFNaW51c1QgLyBiYXNlTWludXNUKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHEsIDApKSk7XG5cdFx0XHRcdFx0YmlhcyA9IGFkYXB0KGRlbHRhLCBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsIGhhbmRsZWRDUENvdW50ID09IGJhc2ljTGVuZ3RoKTtcblx0XHRcdFx0XHRkZWx0YSA9IDA7XG5cdFx0XHRcdFx0KytoYW5kbGVkQ1BDb3VudDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQrK2RlbHRhO1xuXHRcdFx0KytuO1xuXG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgb3IgYW4gZW1haWwgYWRkcmVzc1xuXHQgKiB0byBVbmljb2RlLiBPbmx5IHRoZSBQdW55Y29kZWQgcGFydHMgb2YgdGhlIGlucHV0IHdpbGwgYmUgY29udmVydGVkLCBpLmUuXG5cdCAqIGl0IGRvZXNuJ3QgbWF0dGVyIGlmIHlvdSBjYWxsIGl0IG9uIGEgc3RyaW5nIHRoYXQgaGFzIGFscmVhZHkgYmVlblxuXHQgKiBjb252ZXJ0ZWQgdG8gVW5pY29kZS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGVkIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MgdG9cblx0ICogY29udmVydCB0byBVbmljb2RlLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgVW5pY29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gUHVueWNvZGVcblx0ICogc3RyaW5nLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9Vbmljb2RlKGlucHV0KSB7XG5cdFx0cmV0dXJuIG1hcERvbWFpbihpbnB1dCwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhQdW55Y29kZS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyBkZWNvZGUoc3RyaW5nLnNsaWNlKDQpLnRvTG93ZXJDYXNlKCkpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgVW5pY29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgb3IgYW4gZW1haWwgYWRkcmVzcyB0b1xuXHQgKiBQdW55Y29kZS4gT25seSB0aGUgbm9uLUFTQ0lJIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB3aWxsIGJlIGNvbnZlcnRlZCxcblx0ICogaS5lLiBpdCBkb2Vzbid0IG1hdHRlciBpZiB5b3UgY2FsbCBpdCB3aXRoIGEgZG9tYWluIHRoYXQncyBhbHJlYWR5IGluXG5cdCAqIEFTQ0lJLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzIHRvIGNvbnZlcnQsIGFzIGFcblx0ICogVW5pY29kZSBzdHJpbmcuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBQdW55Y29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gZG9tYWluIG5hbWUgb3Jcblx0ICogZW1haWwgYWRkcmVzcy5cblx0ICovXG5cdGZ1bmN0aW9uIHRvQVNDSUkoaW5wdXQpIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleE5vbkFTQ0lJLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/ICd4bi0tJyArIGVuY29kZShzdHJpbmcpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqIERlZmluZSB0aGUgcHVibGljIEFQSSAqL1xuXHRwdW55Y29kZSA9IHtcblx0XHQvKipcblx0XHQgKiBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgUHVueWNvZGUuanMgdmVyc2lvbiBudW1iZXIuXG5cdFx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdFx0ICogQHR5cGUgU3RyaW5nXG5cdFx0ICovXG5cdFx0J3ZlcnNpb24nOiAnMS40LjEnLFxuXHRcdC8qKlxuXHRcdCAqIEFuIG9iamVjdCBvZiBtZXRob2RzIHRvIGNvbnZlcnQgZnJvbSBKYXZhU2NyaXB0J3MgaW50ZXJuYWwgY2hhcmFjdGVyXG5cdFx0ICogcmVwcmVzZW50YXRpb24gKFVDUy0yKSB0byBVbmljb2RlIGNvZGUgcG9pbnRzLCBhbmQgYmFjay5cblx0XHQgKiBAc2VlIDxodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0XHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0XHQgKiBAdHlwZSBPYmplY3Rcblx0XHQgKi9cblx0XHQndWNzMic6IHtcblx0XHRcdCdkZWNvZGUnOiB1Y3MyZGVjb2RlLFxuXHRcdFx0J2VuY29kZSc6IHVjczJlbmNvZGVcblx0XHR9LFxuXHRcdCdkZWNvZGUnOiBkZWNvZGUsXG5cdFx0J2VuY29kZSc6IGVuY29kZSxcblx0XHQndG9BU0NJSSc6IHRvQVNDSUksXG5cdFx0J3RvVW5pY29kZSc6IHRvVW5pY29kZVxuXHR9O1xuXG5cdC8qKiBFeHBvc2UgYHB1bnljb2RlYCAqL1xuXHQvLyBTb21lIEFNRCBidWlsZCBvcHRpbWl6ZXJzLCBsaWtlIHIuanMsIGNoZWNrIGZvciBzcGVjaWZpYyBjb25kaXRpb24gcGF0dGVybnNcblx0Ly8gbGlrZSB0aGUgZm9sbG93aW5nOlxuXHRpZiAoXG5cdFx0dHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiZcblx0XHRkZWZpbmUuYW1kXG5cdCkge1xuXHRcdGRlZmluZSgncHVueWNvZGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBwdW55Y29kZTtcblx0XHR9KTtcblx0fSBlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG5cdFx0aWYgKG1vZHVsZS5leHBvcnRzID09IGZyZWVFeHBvcnRzKSB7XG5cdFx0XHQvLyBpbiBOb2RlLmpzLCBpby5qcywgb3IgUmluZ29KUyB2MC44LjArXG5cdFx0XHRmcmVlTW9kdWxlLmV4cG9ydHMgPSBwdW55Y29kZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gaW4gTmFyd2hhbCBvciBSaW5nb0pTIHYwLjcuMC1cblx0XHRcdGZvciAoa2V5IGluIHB1bnljb2RlKSB7XG5cdFx0XHRcdHB1bnljb2RlLmhhc093blByb3BlcnR5KGtleSkgJiYgKGZyZWVFeHBvcnRzW2tleV0gPSBwdW55Y29kZVtrZXldKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly8gaW4gUmhpbm8gb3IgYSB3ZWIgYnJvd3NlclxuXHRcdHJvb3QucHVueWNvZGUgPSBwdW55Y29kZTtcblx0fVxuXG59KHRoaXMpKTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIElmIG9iai5oYXNPd25Qcm9wZXJ0eSBoYXMgYmVlbiBvdmVycmlkZGVuLCB0aGVuIGNhbGxpbmdcbi8vIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSB3aWxsIGJyZWFrLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MDdcbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocXMsIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIHZhciBvYmogPSB7fTtcblxuICBpZiAodHlwZW9mIHFzICE9PSAnc3RyaW5nJyB8fCBxcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIHJlZ2V4cCA9IC9cXCsvZztcbiAgcXMgPSBxcy5zcGxpdChzZXApO1xuXG4gIHZhciBtYXhLZXlzID0gMTAwMDtcbiAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMubWF4S2V5cyA9PT0gJ251bWJlcicpIHtcbiAgICBtYXhLZXlzID0gb3B0aW9ucy5tYXhLZXlzO1xuICB9XG5cbiAgdmFyIGxlbiA9IHFzLmxlbmd0aDtcbiAgLy8gbWF4S2V5cyA8PSAwIG1lYW5zIHRoYXQgd2Ugc2hvdWxkIG5vdCBsaW1pdCBrZXlzIGNvdW50XG4gIGlmIChtYXhLZXlzID4gMCAmJiBsZW4gPiBtYXhLZXlzKSB7XG4gICAgbGVuID0gbWF4S2V5cztcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgeCA9IHFzW2ldLnJlcGxhY2UocmVnZXhwLCAnJTIwJyksXG4gICAgICAgIGlkeCA9IHguaW5kZXhPZihlcSksXG4gICAgICAgIGtzdHIsIHZzdHIsIGssIHY7XG5cbiAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgIGtzdHIgPSB4LnN1YnN0cigwLCBpZHgpO1xuICAgICAgdnN0ciA9IHguc3Vic3RyKGlkeCArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrc3RyID0geDtcbiAgICAgIHZzdHIgPSAnJztcbiAgICB9XG5cbiAgICBrID0gZGVjb2RlVVJJQ29tcG9uZW50KGtzdHIpO1xuICAgIHYgPSBkZWNvZGVVUklDb21wb25lbnQodnN0cik7XG5cbiAgICBpZiAoIWhhc093blByb3BlcnR5KG9iaiwgaykpIHtcbiAgICAgIG9ialtrXSA9IHY7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgIG9ialtrXS5wdXNoKHYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba10gPSBbb2JqW2tdLCB2XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyaW5naWZ5UHJpbWl0aXZlID0gZnVuY3Rpb24odikge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB2O1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG5cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzRmluaXRlKHYpID8gdiA6ICcnO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAnJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHNlcCwgZXEsIG5hbWUpIHtcbiAgc2VwID0gc2VwIHx8ICcmJztcbiAgZXEgPSBlcSB8fCAnPSc7XG4gIGlmIChvYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbWFwKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24oaykge1xuICAgICAgdmFyIGtzID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcbiAgICAgIGlmIChpc0FycmF5KG9ialtrXSkpIHtcbiAgICAgICAgcmV0dXJuIG1hcChvYmpba10sIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uICh4cykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbmZ1bmN0aW9uIG1hcCAoeHMsIGYpIHtcbiAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgdmFyIHJlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzLnB1c2goZih4c1tpXSwgaSkpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLnBhcnNlID0gcmVxdWlyZSgnLi9kZWNvZGUnKTtcbmV4cG9ydHMuZW5jb2RlID0gZXhwb3J0cy5zdHJpbmdpZnkgPSByZXF1aXJlKCcuL2VuY29kZScpO1xuIiwidmFyIHJhbmRvbSA9IHJlcXVpcmUoXCJybmRcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gY29sb3I7XG5cbmZ1bmN0aW9uIGNvbG9yIChtYXgsIG1pbikge1xuICBtYXggfHwgKG1heCA9IDI1NSk7XG4gIHJldHVybiAncmdiKCcgKyByYW5kb20obWF4LCBtaW4pICsgJywgJyArIHJhbmRvbShtYXgsIG1pbikgKyAnLCAnICsgcmFuZG9tKG1heCwgbWluKSArICcpJztcbn1cbiIsInZhciByZWxhdGl2ZURhdGUgPSAoZnVuY3Rpb24odW5kZWZpbmVkKXtcblxuICB2YXIgU0VDT05EID0gMTAwMCxcbiAgICAgIE1JTlVURSA9IDYwICogU0VDT05ELFxuICAgICAgSE9VUiA9IDYwICogTUlOVVRFLFxuICAgICAgREFZID0gMjQgKiBIT1VSLFxuICAgICAgV0VFSyA9IDcgKiBEQVksXG4gICAgICBZRUFSID0gREFZICogMzY1LFxuICAgICAgTU9OVEggPSBZRUFSIC8gMTI7XG5cbiAgdmFyIGZvcm1hdHMgPSBbXG4gICAgWyAwLjcgKiBNSU5VVEUsICdqdXN0IG5vdycgXSxcbiAgICBbIDEuNSAqIE1JTlVURSwgJ2EgbWludXRlIGFnbycgXSxcbiAgICBbIDYwICogTUlOVVRFLCAnbWludXRlcyBhZ28nLCBNSU5VVEUgXSxcbiAgICBbIDEuNSAqIEhPVVIsICdhbiBob3VyIGFnbycgXSxcbiAgICBbIERBWSwgJ2hvdXJzIGFnbycsIEhPVVIgXSxcbiAgICBbIDIgKiBEQVksICd5ZXN0ZXJkYXknIF0sXG4gICAgWyA3ICogREFZLCAnZGF5cyBhZ28nLCBEQVkgXSxcbiAgICBbIDEuNSAqIFdFRUssICdhIHdlZWsgYWdvJ10sXG4gICAgWyBNT05USCwgJ3dlZWtzIGFnbycsIFdFRUsgXSxcbiAgICBbIDEuNSAqIE1PTlRILCAnYSBtb250aCBhZ28nIF0sXG4gICAgWyBZRUFSLCAnbW9udGhzIGFnbycsIE1PTlRIIF0sXG4gICAgWyAxLjUgKiBZRUFSLCAnYSB5ZWFyIGFnbycgXSxcbiAgICBbIE51bWJlci5NQVhfVkFMVUUsICd5ZWFycyBhZ28nLCBZRUFSIF1cbiAgXTtcblxuICBmdW5jdGlvbiByZWxhdGl2ZURhdGUoaW5wdXQscmVmZXJlbmNlKXtcbiAgICAhcmVmZXJlbmNlICYmICggcmVmZXJlbmNlID0gKG5ldyBEYXRlKS5nZXRUaW1lKCkgKTtcbiAgICByZWZlcmVuY2UgaW5zdGFuY2VvZiBEYXRlICYmICggcmVmZXJlbmNlID0gcmVmZXJlbmNlLmdldFRpbWUoKSApO1xuICAgIGlucHV0IGluc3RhbmNlb2YgRGF0ZSAmJiAoIGlucHV0ID0gaW5wdXQuZ2V0VGltZSgpICk7XG4gICAgXG4gICAgdmFyIGRlbHRhID0gcmVmZXJlbmNlIC0gaW5wdXQsXG4gICAgICAgIGZvcm1hdCwgaSwgbGVuO1xuXG4gICAgZm9yKGkgPSAtMSwgbGVuPWZvcm1hdHMubGVuZ3RoOyArK2kgPCBsZW47ICl7XG4gICAgICBmb3JtYXQgPSBmb3JtYXRzW2ldO1xuICAgICAgaWYoZGVsdGEgPCBmb3JtYXRbMF0pe1xuICAgICAgICByZXR1cm4gZm9ybWF0WzJdID09IHVuZGVmaW5lZCA/IGZvcm1hdFsxXSA6IE1hdGgucm91bmQoZGVsdGEvZm9ybWF0WzJdKSArICcgJyArIGZvcm1hdFsxXTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aXZlRGF0ZTtcblxufSkoKTtcblxuaWYodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyl7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVsYXRpdmVEYXRlO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByYW5kb207XG5cbmZ1bmN0aW9uIHJhbmRvbSAobWF4LCBtaW4pIHtcbiAgbWF4IHx8IChtYXggPSA5OTk5OTk5OTk5OTkpO1xuICBtaW4gfHwgKG1pbiA9IDApO1xuXG4gIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSk7XG59XG4iLCJcbm1vZHVsZS5leHBvcnRzID0gW1xuICAnYScsXG4gICdhbicsXG4gICdhbmQnLFxuICAnYXMnLFxuICAnYXQnLFxuICAnYnV0JyxcbiAgJ2J5JyxcbiAgJ2VuJyxcbiAgJ2ZvcicsXG4gICdmcm9tJyxcbiAgJ2hvdycsXG4gICdpZicsXG4gICdpbicsXG4gICduZWl0aGVyJyxcbiAgJ25vcicsXG4gICdvZicsXG4gICdvbicsXG4gICdvbmx5JyxcbiAgJ29udG8nLFxuICAnb3V0JyxcbiAgJ29yJyxcbiAgJ3BlcicsXG4gICdzbycsXG4gICd0aGFuJyxcbiAgJ3RoYXQnLFxuICAndGhlJyxcbiAgJ3RvJyxcbiAgJ3VudGlsJyxcbiAgJ3VwJyxcbiAgJ3Vwb24nLFxuICAndicsXG4gICd2LicsXG4gICd2ZXJzdXMnLFxuICAndnMnLFxuICAndnMuJyxcbiAgJ3ZpYScsXG4gICd3aGVuJyxcbiAgJ3dpdGgnLFxuICAnd2l0aG91dCcsXG4gICd5ZXQnXG5dOyIsInZhciB0b1RpdGxlID0gcmVxdWlyZShcInRvLXRpdGxlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gdXJsVG9UaXRsZVxuXG5mdW5jdGlvbiB1cmxUb1RpdGxlKHVybCkge1xuICB1cmwgPSB1bmVzY2FwZSh1cmwpLnJlcGxhY2UoL18vZywgXCIgXCIpXG4gIHVybCA9IHVybC5yZXBsYWNlKC9eXFx3KzpcXC9cXC8vLCBcIlwiKVxuICB1cmwgPSB1cmwucmVwbGFjZSgvXnd3d1xcLi8sIFwiXCIpXG4gIHVybCA9IHVybC5yZXBsYWNlKC8oXFwvfFxcPykkLywgXCJcIilcblxuICB2YXIgcGFydHMgPSB1cmwuc3BsaXQoXCI/XCIpXG4gIHVybCA9IHBhcnRzWzBdXG4gIHVybCA9IHVybC5yZXBsYWNlKC9cXC5cXHcrJC8sIFwiXCIpXG5cbiAgcGFydHMgPSB1cmwuc3BsaXQoXCIvXCIpXG5cbiAgdmFyIG5hbWUgPSBwYXJ0c1swXVxuICBuYW1lID0gbmFtZS5yZXBsYWNlKC9cXC5cXHcrKFxcL3wkKS8sIFwiXCIpLnJlcGxhY2UoL1xcLihjb20/fG5ldHxvcmd8ZnIpJC8sIFwiXCIpXG5cbiAgaWYgKHBhcnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgcmV0dXJuIHRpdGxlKG5hbWUpXG4gIH1cblxuICByZXR1cm4gKFxuICAgIHRvVGl0bGUoXG4gICAgICBwYXJ0c1xuICAgICAgICAuc2xpY2UoMSlcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAuZmlsdGVyKGlzVmFsaWRQYXJ0KVxuICAgICAgICAubWFwKHRvVGl0bGUpXG4gICAgICAgIC5qb2luKFwiIC0gXCIpXG4gICAgKSArXG4gICAgXCIgb24gXCIgK1xuICAgIHRpdGxlKG5hbWUpXG4gIClcbn1cblxuZnVuY3Rpb24gaXNWYWxpZFBhcnQocGFydCkge1xuICByZXR1cm4gcGFydC5sZW5ndGggPiAyICYmICEvXlswLTldKyQvLnRlc3QocGFydClcbn1cblxuZnVuY3Rpb24gdGl0bGUoaG9zdCkge1xuICBpZiAoL15bXFx3XFwuXFwtXSs6XFxkKy8udGVzdChob3N0KSkge1xuICAgIHJldHVybiBob3N0XG4gIH1cblxuICByZXR1cm4gdG9UaXRsZShcbiAgICBob3N0XG4gICAgICAuc3BsaXQoXCIuXCIpXG4gICAgICAuZmlsdGVyKGlzVmFsaWRQYXJ0KVxuICAgICAgLmpvaW4oXCIsIFwiKVxuICApXG59XG4iLCJcbnZhciBjbGVhbiA9IHJlcXVpcmUoJ3RvLW5vLWNhc2UnKTtcblxuXG4vKipcbiAqIEV4cG9zZSBgdG9DYXBpdGFsQ2FzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0b0NhcGl0YWxDYXNlO1xuXG5cbi8qKlxuICogQ29udmVydCBhIGBzdHJpbmdgIHRvIGNhcGl0YWwgY2FzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuXG5mdW5jdGlvbiB0b0NhcGl0YWxDYXNlIChzdHJpbmcpIHtcbiAgcmV0dXJuIGNsZWFuKHN0cmluZykucmVwbGFjZSgvKF58XFxzKShcXHcpL2csIGZ1bmN0aW9uIChtYXRjaGVzLCBwcmV2aW91cywgbGV0dGVyKSB7XG4gICAgcmV0dXJuIHByZXZpb3VzICsgbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xufSIsIlxuLyoqXG4gKiBFeHBvc2UgYHRvTm9DYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTm9DYXNlO1xuXG5cbi8qKlxuICogVGVzdCB3aGV0aGVyIGEgc3RyaW5nIGlzIGNhbWVsLWNhc2UuXG4gKi9cblxudmFyIGhhc1NwYWNlID0gL1xccy87XG52YXIgaGFzQ2FtZWwgPSAvW2Etel1bQS1aXS87XG52YXIgaGFzU2VwYXJhdG9yID0gL1tcXFdfXS87XG5cblxuLyoqXG4gKiBSZW1vdmUgYW55IHN0YXJ0aW5nIGNhc2UgZnJvbSBhIGBzdHJpbmdgLCBsaWtlIGNhbWVsIG9yIHNuYWtlLCBidXQga2VlcFxuICogc3BhY2VzIGFuZCBwdW5jdHVhdGlvbiB0aGF0IG1heSBiZSBpbXBvcnRhbnQgb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiB0b05vQ2FzZSAoc3RyaW5nKSB7XG4gIGlmIChoYXNTcGFjZS50ZXN0KHN0cmluZykpIHJldHVybiBzdHJpbmcudG9Mb3dlckNhc2UoKTtcblxuICBpZiAoaGFzU2VwYXJhdG9yLnRlc3Qoc3RyaW5nKSkgc3RyaW5nID0gdW5zZXBhcmF0ZShzdHJpbmcpO1xuICBpZiAoaGFzQ2FtZWwudGVzdChzdHJpbmcpKSBzdHJpbmcgPSB1bmNhbWVsaXplKHN0cmluZyk7XG4gIHJldHVybiBzdHJpbmcudG9Mb3dlckNhc2UoKTtcbn1cblxuXG4vKipcbiAqIFNlcGFyYXRvciBzcGxpdHRlci5cbiAqL1xuXG52YXIgc2VwYXJhdG9yU3BsaXR0ZXIgPSAvW1xcV19dKygufCQpL2c7XG5cblxuLyoqXG4gKiBVbi1zZXBhcmF0ZSBhIGBzdHJpbmdgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiB1bnNlcGFyYXRlIChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKHNlcGFyYXRvclNwbGl0dGVyLCBmdW5jdGlvbiAobSwgbmV4dCkge1xuICAgIHJldHVybiBuZXh0ID8gJyAnICsgbmV4dCA6ICcnO1xuICB9KTtcbn1cblxuXG4vKipcbiAqIENhbWVsY2FzZSBzcGxpdHRlci5cbiAqL1xuXG52YXIgY2FtZWxTcGxpdHRlciA9IC8oLikoW0EtWl0rKS9nO1xuXG5cbi8qKlxuICogVW4tY2FtZWxjYXNlIGEgYHN0cmluZ2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHVuY2FtZWxpemUgKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoY2FtZWxTcGxpdHRlciwgZnVuY3Rpb24gKG0sIHByZXZpb3VzLCB1cHBlcnMpIHtcbiAgICByZXR1cm4gcHJldmlvdXMgKyAnICcgKyB1cHBlcnMudG9Mb3dlckNhc2UoKS5zcGxpdCgnJykuam9pbignICcpO1xuICB9KTtcbn0iLCJ2YXIgZXNjYXBlID0gcmVxdWlyZSgnZXNjYXBlLXJlZ2V4cC1jb21wb25lbnQnKTtcbnZhciBjYXBpdGFsID0gcmVxdWlyZSgndG8tY2FwaXRhbC1jYXNlJyk7XG52YXIgbWlub3JzID0gcmVxdWlyZSgndGl0bGUtY2FzZS1taW5vcnMnKTtcblxuLyoqXG4gKiBFeHBvc2UgYHRvVGl0bGVDYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvVGl0bGVDYXNlO1xuXG5cbi8qKlxuICogTWlub3JzLlxuICovXG5cbnZhciBlc2NhcGVkID0gbWlub3JzLm1hcChlc2NhcGUpO1xudmFyIG1pbm9yTWF0Y2hlciA9IG5ldyBSZWdFeHAoJ1teXl1cXFxcYignICsgZXNjYXBlZC5qb2luKCd8JykgKyAnKVxcXFxiJywgJ2lnJyk7XG52YXIgY29sb25NYXRjaGVyID0gLzpcXHMqKFxcdykvZztcblxuXG4vKipcbiAqIENvbnZlcnQgYSBgc3RyaW5nYCB0byBjYW1lbCBjYXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5cbmZ1bmN0aW9uIHRvVGl0bGVDYXNlIChzdHJpbmcpIHtcbiAgcmV0dXJuIGNhcGl0YWwoc3RyaW5nKVxuICAgIC5yZXBsYWNlKG1pbm9yTWF0Y2hlciwgZnVuY3Rpb24gKG1pbm9yKSB7XG4gICAgICByZXR1cm4gbWlub3IudG9Mb3dlckNhc2UoKTtcbiAgICB9KVxuICAgIC5yZXBsYWNlKGNvbG9uTWF0Y2hlciwgZnVuY3Rpb24gKGxldHRlcikge1xuICAgICAgcmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHB1bnljb2RlID0gcmVxdWlyZSgncHVueWNvZGUnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmV4cG9ydHMucGFyc2UgPSB1cmxQYXJzZTtcbmV4cG9ydHMucmVzb2x2ZSA9IHVybFJlc29sdmU7XG5leHBvcnRzLnJlc29sdmVPYmplY3QgPSB1cmxSZXNvbHZlT2JqZWN0O1xuZXhwb3J0cy5mb3JtYXQgPSB1cmxGb3JtYXQ7XG5cbmV4cG9ydHMuVXJsID0gVXJsO1xuXG5mdW5jdGlvbiBVcmwoKSB7XG4gIHRoaXMucHJvdG9jb2wgPSBudWxsO1xuICB0aGlzLnNsYXNoZXMgPSBudWxsO1xuICB0aGlzLmF1dGggPSBudWxsO1xuICB0aGlzLmhvc3QgPSBudWxsO1xuICB0aGlzLnBvcnQgPSBudWxsO1xuICB0aGlzLmhvc3RuYW1lID0gbnVsbDtcbiAgdGhpcy5oYXNoID0gbnVsbDtcbiAgdGhpcy5zZWFyY2ggPSBudWxsO1xuICB0aGlzLnF1ZXJ5ID0gbnVsbDtcbiAgdGhpcy5wYXRobmFtZSA9IG51bGw7XG4gIHRoaXMucGF0aCA9IG51bGw7XG4gIHRoaXMuaHJlZiA9IG51bGw7XG59XG5cbi8vIFJlZmVyZW5jZTogUkZDIDM5ODYsIFJGQyAxODA4LCBSRkMgMjM5NlxuXG4vLyBkZWZpbmUgdGhlc2UgaGVyZSBzbyBhdCBsZWFzdCB0aGV5IG9ubHkgaGF2ZSB0byBiZVxuLy8gY29tcGlsZWQgb25jZSBvbiB0aGUgZmlyc3QgbW9kdWxlIGxvYWQuXG52YXIgcHJvdG9jb2xQYXR0ZXJuID0gL14oW2EtejAtOS4rLV0rOikvaSxcbiAgICBwb3J0UGF0dGVybiA9IC86WzAtOV0qJC8sXG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIGEgc2ltcGxlIHBhdGggVVJMXG4gICAgc2ltcGxlUGF0aFBhdHRlcm4gPSAvXihcXC9cXC8/KD8hXFwvKVteXFw/XFxzXSopKFxcP1teXFxzXSopPyQvLFxuXG4gICAgLy8gUkZDIDIzOTY6IGNoYXJhY3RlcnMgcmVzZXJ2ZWQgZm9yIGRlbGltaXRpbmcgVVJMcy5cbiAgICAvLyBXZSBhY3R1YWxseSBqdXN0IGF1dG8tZXNjYXBlIHRoZXNlLlxuICAgIGRlbGltcyA9IFsnPCcsICc+JywgJ1wiJywgJ2AnLCAnICcsICdcXHInLCAnXFxuJywgJ1xcdCddLFxuXG4gICAgLy8gUkZDIDIzOTY6IGNoYXJhY3RlcnMgbm90IGFsbG93ZWQgZm9yIHZhcmlvdXMgcmVhc29ucy5cbiAgICB1bndpc2UgPSBbJ3snLCAnfScsICd8JywgJ1xcXFwnLCAnXicsICdgJ10uY29uY2F0KGRlbGltcyksXG5cbiAgICAvLyBBbGxvd2VkIGJ5IFJGQ3MsIGJ1dCBjYXVzZSBvZiBYU1MgYXR0YWNrcy4gIEFsd2F5cyBlc2NhcGUgdGhlc2UuXG4gICAgYXV0b0VzY2FwZSA9IFsnXFwnJ10uY29uY2F0KHVud2lzZSksXG4gICAgLy8gQ2hhcmFjdGVycyB0aGF0IGFyZSBuZXZlciBldmVyIGFsbG93ZWQgaW4gYSBob3N0bmFtZS5cbiAgICAvLyBOb3RlIHRoYXQgYW55IGludmFsaWQgY2hhcnMgYXJlIGFsc28gaGFuZGxlZCwgYnV0IHRoZXNlXG4gICAgLy8gYXJlIHRoZSBvbmVzIHRoYXQgYXJlICpleHBlY3RlZCogdG8gYmUgc2Vlbiwgc28gd2UgZmFzdC1wYXRoXG4gICAgLy8gdGhlbS5cbiAgICBub25Ib3N0Q2hhcnMgPSBbJyUnLCAnLycsICc/JywgJzsnLCAnIyddLmNvbmNhdChhdXRvRXNjYXBlKSxcbiAgICBob3N0RW5kaW5nQ2hhcnMgPSBbJy8nLCAnPycsICcjJ10sXG4gICAgaG9zdG5hbWVNYXhMZW4gPSAyNTUsXG4gICAgaG9zdG5hbWVQYXJ0UGF0dGVybiA9IC9eWythLXowLTlBLVpfLV17MCw2M30kLyxcbiAgICBob3N0bmFtZVBhcnRTdGFydCA9IC9eKFsrYS16MC05QS1aXy1dezAsNjN9KSguKikkLyxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBjYW4gYWxsb3cgXCJ1bnNhZmVcIiBhbmQgXCJ1bndpc2VcIiBjaGFycy5cbiAgICB1bnNhZmVQcm90b2NvbCA9IHtcbiAgICAgICdqYXZhc2NyaXB0JzogdHJ1ZSxcbiAgICAgICdqYXZhc2NyaXB0Oic6IHRydWVcbiAgICB9LFxuICAgIC8vIHByb3RvY29scyB0aGF0IG5ldmVyIGhhdmUgYSBob3N0bmFtZS5cbiAgICBob3N0bGVzc1Byb3RvY29sID0ge1xuICAgICAgJ2phdmFzY3JpcHQnOiB0cnVlLFxuICAgICAgJ2phdmFzY3JpcHQ6JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgYWx3YXlzIGNvbnRhaW4gYSAvLyBiaXQuXG4gICAgc2xhc2hlZFByb3RvY29sID0ge1xuICAgICAgJ2h0dHAnOiB0cnVlLFxuICAgICAgJ2h0dHBzJzogdHJ1ZSxcbiAgICAgICdmdHAnOiB0cnVlLFxuICAgICAgJ2dvcGhlcic6IHRydWUsXG4gICAgICAnZmlsZSc6IHRydWUsXG4gICAgICAnaHR0cDonOiB0cnVlLFxuICAgICAgJ2h0dHBzOic6IHRydWUsXG4gICAgICAnZnRwOic6IHRydWUsXG4gICAgICAnZ29waGVyOic6IHRydWUsXG4gICAgICAnZmlsZTonOiB0cnVlXG4gICAgfSxcbiAgICBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XG5cbmZ1bmN0aW9uIHVybFBhcnNlKHVybCwgcGFyc2VRdWVyeVN0cmluZywgc2xhc2hlc0Rlbm90ZUhvc3QpIHtcbiAgaWYgKHVybCAmJiB1dGlsLmlzT2JqZWN0KHVybCkgJiYgdXJsIGluc3RhbmNlb2YgVXJsKSByZXR1cm4gdXJsO1xuXG4gIHZhciB1ID0gbmV3IFVybDtcbiAgdS5wYXJzZSh1cmwsIHBhcnNlUXVlcnlTdHJpbmcsIHNsYXNoZXNEZW5vdGVIb3N0KTtcbiAgcmV0dXJuIHU7XG59XG5cblVybC5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbih1cmwsIHBhcnNlUXVlcnlTdHJpbmcsIHNsYXNoZXNEZW5vdGVIb3N0KSB7XG4gIGlmICghdXRpbC5pc1N0cmluZyh1cmwpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlBhcmFtZXRlciAndXJsJyBtdXN0IGJlIGEgc3RyaW5nLCBub3QgXCIgKyB0eXBlb2YgdXJsKTtcbiAgfVxuXG4gIC8vIENvcHkgY2hyb21lLCBJRSwgb3BlcmEgYmFja3NsYXNoLWhhbmRsaW5nIGJlaGF2aW9yLlxuICAvLyBCYWNrIHNsYXNoZXMgYmVmb3JlIHRoZSBxdWVyeSBzdHJpbmcgZ2V0IGNvbnZlcnRlZCB0byBmb3J3YXJkIHNsYXNoZXNcbiAgLy8gU2VlOiBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MjU5MTZcbiAgdmFyIHF1ZXJ5SW5kZXggPSB1cmwuaW5kZXhPZignPycpLFxuICAgICAgc3BsaXR0ZXIgPVxuICAgICAgICAgIChxdWVyeUluZGV4ICE9PSAtMSAmJiBxdWVyeUluZGV4IDwgdXJsLmluZGV4T2YoJyMnKSkgPyAnPycgOiAnIycsXG4gICAgICB1U3BsaXQgPSB1cmwuc3BsaXQoc3BsaXR0ZXIpLFxuICAgICAgc2xhc2hSZWdleCA9IC9cXFxcL2c7XG4gIHVTcGxpdFswXSA9IHVTcGxpdFswXS5yZXBsYWNlKHNsYXNoUmVnZXgsICcvJyk7XG4gIHVybCA9IHVTcGxpdC5qb2luKHNwbGl0dGVyKTtcblxuICB2YXIgcmVzdCA9IHVybDtcblxuICAvLyB0cmltIGJlZm9yZSBwcm9jZWVkaW5nLlxuICAvLyBUaGlzIGlzIHRvIHN1cHBvcnQgcGFyc2Ugc3R1ZmYgbGlrZSBcIiAgaHR0cDovL2Zvby5jb20gIFxcblwiXG4gIHJlc3QgPSByZXN0LnRyaW0oKTtcblxuICBpZiAoIXNsYXNoZXNEZW5vdGVIb3N0ICYmIHVybC5zcGxpdCgnIycpLmxlbmd0aCA9PT0gMSkge1xuICAgIC8vIFRyeSBmYXN0IHBhdGggcmVnZXhwXG4gICAgdmFyIHNpbXBsZVBhdGggPSBzaW1wbGVQYXRoUGF0dGVybi5leGVjKHJlc3QpO1xuICAgIGlmIChzaW1wbGVQYXRoKSB7XG4gICAgICB0aGlzLnBhdGggPSByZXN0O1xuICAgICAgdGhpcy5ocmVmID0gcmVzdDtcbiAgICAgIHRoaXMucGF0aG5hbWUgPSBzaW1wbGVQYXRoWzFdO1xuICAgICAgaWYgKHNpbXBsZVBhdGhbMl0pIHtcbiAgICAgICAgdGhpcy5zZWFyY2ggPSBzaW1wbGVQYXRoWzJdO1xuICAgICAgICBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgICAgIHRoaXMucXVlcnkgPSBxdWVyeXN0cmluZy5wYXJzZSh0aGlzLnNlYXJjaC5zdWJzdHIoMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucXVlcnkgPSB0aGlzLnNlYXJjaC5zdWJzdHIoMSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgICB0aGlzLnNlYXJjaCA9ICcnO1xuICAgICAgICB0aGlzLnF1ZXJ5ID0ge307XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cblxuICB2YXIgcHJvdG8gPSBwcm90b2NvbFBhdHRlcm4uZXhlYyhyZXN0KTtcbiAgaWYgKHByb3RvKSB7XG4gICAgcHJvdG8gPSBwcm90b1swXTtcbiAgICB2YXIgbG93ZXJQcm90byA9IHByb3RvLnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5wcm90b2NvbCA9IGxvd2VyUHJvdG87XG4gICAgcmVzdCA9IHJlc3Quc3Vic3RyKHByb3RvLmxlbmd0aCk7XG4gIH1cblxuICAvLyBmaWd1cmUgb3V0IGlmIGl0J3MgZ290IGEgaG9zdFxuICAvLyB1c2VyQHNlcnZlciBpcyAqYWx3YXlzKiBpbnRlcnByZXRlZCBhcyBhIGhvc3RuYW1lLCBhbmQgdXJsXG4gIC8vIHJlc29sdXRpb24gd2lsbCB0cmVhdCAvL2Zvby9iYXIgYXMgaG9zdD1mb28scGF0aD1iYXIgYmVjYXVzZSB0aGF0J3NcbiAgLy8gaG93IHRoZSBicm93c2VyIHJlc29sdmVzIHJlbGF0aXZlIFVSTHMuXG4gIGlmIChzbGFzaGVzRGVub3RlSG9zdCB8fCBwcm90byB8fCByZXN0Lm1hdGNoKC9eXFwvXFwvW15AXFwvXStAW15AXFwvXSsvKSkge1xuICAgIHZhciBzbGFzaGVzID0gcmVzdC5zdWJzdHIoMCwgMikgPT09ICcvLyc7XG4gICAgaWYgKHNsYXNoZXMgJiYgIShwcm90byAmJiBob3N0bGVzc1Byb3RvY29sW3Byb3RvXSkpIHtcbiAgICAgIHJlc3QgPSByZXN0LnN1YnN0cigyKTtcbiAgICAgIHRoaXMuc2xhc2hlcyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob3N0bGVzc1Byb3RvY29sW3Byb3RvXSAmJlxuICAgICAgKHNsYXNoZXMgfHwgKHByb3RvICYmICFzbGFzaGVkUHJvdG9jb2xbcHJvdG9dKSkpIHtcblxuICAgIC8vIHRoZXJlJ3MgYSBob3N0bmFtZS5cbiAgICAvLyB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgLywgPywgOywgb3IgIyBlbmRzIHRoZSBob3N0LlxuICAgIC8vXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gQCBpbiB0aGUgaG9zdG5hbWUsIHRoZW4gbm9uLWhvc3QgY2hhcnMgKmFyZSogYWxsb3dlZFxuICAgIC8vIHRvIHRoZSBsZWZ0IG9mIHRoZSBsYXN0IEAgc2lnbiwgdW5sZXNzIHNvbWUgaG9zdC1lbmRpbmcgY2hhcmFjdGVyXG4gICAgLy8gY29tZXMgKmJlZm9yZSogdGhlIEAtc2lnbi5cbiAgICAvLyBVUkxzIGFyZSBvYm5veGlvdXMuXG4gICAgLy9cbiAgICAvLyBleDpcbiAgICAvLyBodHRwOi8vYUBiQGMvID0+IHVzZXI6YUBiIGhvc3Q6Y1xuICAgIC8vIGh0dHA6Ly9hQGI/QGMgPT4gdXNlcjphIGhvc3Q6YyBwYXRoOi8/QGNcblxuICAgIC8vIHYwLjEyIFRPRE8oaXNhYWNzKTogVGhpcyBpcyBub3QgcXVpdGUgaG93IENocm9tZSBkb2VzIHRoaW5ncy5cbiAgICAvLyBSZXZpZXcgb3VyIHRlc3QgY2FzZSBhZ2FpbnN0IGJyb3dzZXJzIG1vcmUgY29tcHJlaGVuc2l2ZWx5LlxuXG4gICAgLy8gZmluZCB0aGUgZmlyc3QgaW5zdGFuY2Ugb2YgYW55IGhvc3RFbmRpbmdDaGFyc1xuICAgIHZhciBob3N0RW5kID0gLTE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBob3N0RW5kaW5nQ2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBoZWMgPSByZXN0LmluZGV4T2YoaG9zdEVuZGluZ0NoYXJzW2ldKTtcbiAgICAgIGlmIChoZWMgIT09IC0xICYmIChob3N0RW5kID09PSAtMSB8fCBoZWMgPCBob3N0RW5kKSlcbiAgICAgICAgaG9zdEVuZCA9IGhlYztcbiAgICB9XG5cbiAgICAvLyBhdCB0aGlzIHBvaW50LCBlaXRoZXIgd2UgaGF2ZSBhbiBleHBsaWNpdCBwb2ludCB3aGVyZSB0aGVcbiAgICAvLyBhdXRoIHBvcnRpb24gY2Fubm90IGdvIHBhc3QsIG9yIHRoZSBsYXN0IEAgY2hhciBpcyB0aGUgZGVjaWRlci5cbiAgICB2YXIgYXV0aCwgYXRTaWduO1xuICAgIGlmIChob3N0RW5kID09PSAtMSkge1xuICAgICAgLy8gYXRTaWduIGNhbiBiZSBhbnl3aGVyZS5cbiAgICAgIGF0U2lnbiA9IHJlc3QubGFzdEluZGV4T2YoJ0AnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYXRTaWduIG11c3QgYmUgaW4gYXV0aCBwb3J0aW9uLlxuICAgICAgLy8gaHR0cDovL2FAYi9jQGQgPT4gaG9zdDpiIGF1dGg6YSBwYXRoOi9jQGRcbiAgICAgIGF0U2lnbiA9IHJlc3QubGFzdEluZGV4T2YoJ0AnLCBob3N0RW5kKTtcbiAgICB9XG5cbiAgICAvLyBOb3cgd2UgaGF2ZSBhIHBvcnRpb24gd2hpY2ggaXMgZGVmaW5pdGVseSB0aGUgYXV0aC5cbiAgICAvLyBQdWxsIHRoYXQgb2ZmLlxuICAgIGlmIChhdFNpZ24gIT09IC0xKSB7XG4gICAgICBhdXRoID0gcmVzdC5zbGljZSgwLCBhdFNpZ24pO1xuICAgICAgcmVzdCA9IHJlc3Quc2xpY2UoYXRTaWduICsgMSk7XG4gICAgICB0aGlzLmF1dGggPSBkZWNvZGVVUklDb21wb25lbnQoYXV0aCk7XG4gICAgfVxuXG4gICAgLy8gdGhlIGhvc3QgaXMgdGhlIHJlbWFpbmluZyB0byB0aGUgbGVmdCBvZiB0aGUgZmlyc3Qgbm9uLWhvc3QgY2hhclxuICAgIGhvc3RFbmQgPSAtMTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vbkhvc3RDaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGhlYyA9IHJlc3QuaW5kZXhPZihub25Ib3N0Q2hhcnNbaV0pO1xuICAgICAgaWYgKGhlYyAhPT0gLTEgJiYgKGhvc3RFbmQgPT09IC0xIHx8IGhlYyA8IGhvc3RFbmQpKVxuICAgICAgICBob3N0RW5kID0gaGVjO1xuICAgIH1cbiAgICAvLyBpZiB3ZSBzdGlsbCBoYXZlIG5vdCBoaXQgaXQsIHRoZW4gdGhlIGVudGlyZSB0aGluZyBpcyBhIGhvc3QuXG4gICAgaWYgKGhvc3RFbmQgPT09IC0xKVxuICAgICAgaG9zdEVuZCA9IHJlc3QubGVuZ3RoO1xuXG4gICAgdGhpcy5ob3N0ID0gcmVzdC5zbGljZSgwLCBob3N0RW5kKTtcbiAgICByZXN0ID0gcmVzdC5zbGljZShob3N0RW5kKTtcblxuICAgIC8vIHB1bGwgb3V0IHBvcnQuXG4gICAgdGhpcy5wYXJzZUhvc3QoKTtcblxuICAgIC8vIHdlJ3ZlIGluZGljYXRlZCB0aGF0IHRoZXJlIGlzIGEgaG9zdG5hbWUsXG4gICAgLy8gc28gZXZlbiBpZiBpdCdzIGVtcHR5LCBpdCBoYXMgdG8gYmUgcHJlc2VudC5cbiAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZSB8fCAnJztcblxuICAgIC8vIGlmIGhvc3RuYW1lIGJlZ2lucyB3aXRoIFsgYW5kIGVuZHMgd2l0aCBdXG4gICAgLy8gYXNzdW1lIHRoYXQgaXQncyBhbiBJUHY2IGFkZHJlc3MuXG4gICAgdmFyIGlwdjZIb3N0bmFtZSA9IHRoaXMuaG9zdG5hbWVbMF0gPT09ICdbJyAmJlxuICAgICAgICB0aGlzLmhvc3RuYW1lW3RoaXMuaG9zdG5hbWUubGVuZ3RoIC0gMV0gPT09ICddJztcblxuICAgIC8vIHZhbGlkYXRlIGEgbGl0dGxlLlxuICAgIGlmICghaXB2Nkhvc3RuYW1lKSB7XG4gICAgICB2YXIgaG9zdHBhcnRzID0gdGhpcy5ob3N0bmFtZS5zcGxpdCgvXFwuLyk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGhvc3RwYXJ0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcnQgPSBob3N0cGFydHNbaV07XG4gICAgICAgIGlmICghcGFydCkgY29udGludWU7XG4gICAgICAgIGlmICghcGFydC5tYXRjaChob3N0bmFtZVBhcnRQYXR0ZXJuKSkge1xuICAgICAgICAgIHZhciBuZXdwYXJ0ID0gJyc7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGsgPSBwYXJ0Lmxlbmd0aDsgaiA8IGs7IGorKykge1xuICAgICAgICAgICAgaWYgKHBhcnQuY2hhckNvZGVBdChqKSA+IDEyNykge1xuICAgICAgICAgICAgICAvLyB3ZSByZXBsYWNlIG5vbi1BU0NJSSBjaGFyIHdpdGggYSB0ZW1wb3JhcnkgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0aGlzIHRvIG1ha2Ugc3VyZSBzaXplIG9mIGhvc3RuYW1lIGlzIG5vdFxuICAgICAgICAgICAgICAvLyBicm9rZW4gYnkgcmVwbGFjaW5nIG5vbi1BU0NJSSBieSBub3RoaW5nXG4gICAgICAgICAgICAgIG5ld3BhcnQgKz0gJ3gnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbmV3cGFydCArPSBwYXJ0W2pdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyB3ZSB0ZXN0IGFnYWluIHdpdGggQVNDSUkgY2hhciBvbmx5XG4gICAgICAgICAgaWYgKCFuZXdwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFBhdHRlcm4pKSB7XG4gICAgICAgICAgICB2YXIgdmFsaWRQYXJ0cyA9IGhvc3RwYXJ0cy5zbGljZSgwLCBpKTtcbiAgICAgICAgICAgIHZhciBub3RIb3N0ID0gaG9zdHBhcnRzLnNsaWNlKGkgKyAxKTtcbiAgICAgICAgICAgIHZhciBiaXQgPSBwYXJ0Lm1hdGNoKGhvc3RuYW1lUGFydFN0YXJ0KTtcbiAgICAgICAgICAgIGlmIChiaXQpIHtcbiAgICAgICAgICAgICAgdmFsaWRQYXJ0cy5wdXNoKGJpdFsxXSk7XG4gICAgICAgICAgICAgIG5vdEhvc3QudW5zaGlmdChiaXRbMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vdEhvc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJlc3QgPSAnLycgKyBub3RIb3N0LmpvaW4oJy4nKSArIHJlc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhvc3RuYW1lID0gdmFsaWRQYXJ0cy5qb2luKCcuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5ob3N0bmFtZS5sZW5ndGggPiBob3N0bmFtZU1heExlbikge1xuICAgICAgdGhpcy5ob3N0bmFtZSA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBob3N0bmFtZXMgYXJlIGFsd2F5cyBsb3dlciBjYXNlLlxuICAgICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpZiAoIWlwdjZIb3N0bmFtZSkge1xuICAgICAgLy8gSUROQSBTdXBwb3J0OiBSZXR1cm5zIGEgcHVueWNvZGVkIHJlcHJlc2VudGF0aW9uIG9mIFwiZG9tYWluXCIuXG4gICAgICAvLyBJdCBvbmx5IGNvbnZlcnRzIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB0aGF0XG4gICAgICAvLyBoYXZlIG5vbi1BU0NJSSBjaGFyYWN0ZXJzLCBpLmUuIGl0IGRvZXNuJ3QgbWF0dGVyIGlmXG4gICAgICAvLyB5b3UgY2FsbCBpdCB3aXRoIGEgZG9tYWluIHRoYXQgYWxyZWFkeSBpcyBBU0NJSS1vbmx5LlxuICAgICAgdGhpcy5ob3N0bmFtZSA9IHB1bnljb2RlLnRvQVNDSUkodGhpcy5ob3N0bmFtZSk7XG4gICAgfVxuXG4gICAgdmFyIHAgPSB0aGlzLnBvcnQgPyAnOicgKyB0aGlzLnBvcnQgOiAnJztcbiAgICB2YXIgaCA9IHRoaXMuaG9zdG5hbWUgfHwgJyc7XG4gICAgdGhpcy5ob3N0ID0gaCArIHA7XG4gICAgdGhpcy5ocmVmICs9IHRoaXMuaG9zdDtcblxuICAgIC8vIHN0cmlwIFsgYW5kIF0gZnJvbSB0aGUgaG9zdG5hbWVcbiAgICAvLyB0aGUgaG9zdCBmaWVsZCBzdGlsbCByZXRhaW5zIHRoZW0sIHRob3VnaFxuICAgIGlmIChpcHY2SG9zdG5hbWUpIHtcbiAgICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lLnN1YnN0cigxLCB0aGlzLmhvc3RuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgaWYgKHJlc3RbMF0gIT09ICcvJykge1xuICAgICAgICByZXN0ID0gJy8nICsgcmVzdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBub3cgcmVzdCBpcyBzZXQgdG8gdGhlIHBvc3QtaG9zdCBzdHVmZi5cbiAgLy8gY2hvcCBvZmYgYW55IGRlbGltIGNoYXJzLlxuICBpZiAoIXVuc2FmZVByb3RvY29sW2xvd2VyUHJvdG9dKSB7XG5cbiAgICAvLyBGaXJzdCwgbWFrZSAxMDAlIHN1cmUgdGhhdCBhbnkgXCJhdXRvRXNjYXBlXCIgY2hhcnMgZ2V0XG4gICAgLy8gZXNjYXBlZCwgZXZlbiBpZiBlbmNvZGVVUklDb21wb25lbnQgZG9lc24ndCB0aGluayB0aGV5XG4gICAgLy8gbmVlZCB0byBiZS5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGF1dG9Fc2NhcGUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgYWUgPSBhdXRvRXNjYXBlW2ldO1xuICAgICAgaWYgKHJlc3QuaW5kZXhPZihhZSkgPT09IC0xKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIHZhciBlc2MgPSBlbmNvZGVVUklDb21wb25lbnQoYWUpO1xuICAgICAgaWYgKGVzYyA9PT0gYWUpIHtcbiAgICAgICAgZXNjID0gZXNjYXBlKGFlKTtcbiAgICAgIH1cbiAgICAgIHJlc3QgPSByZXN0LnNwbGl0KGFlKS5qb2luKGVzYyk7XG4gICAgfVxuICB9XG5cblxuICAvLyBjaG9wIG9mZiBmcm9tIHRoZSB0YWlsIGZpcnN0LlxuICB2YXIgaGFzaCA9IHJlc3QuaW5kZXhPZignIycpO1xuICBpZiAoaGFzaCAhPT0gLTEpIHtcbiAgICAvLyBnb3QgYSBmcmFnbWVudCBzdHJpbmcuXG4gICAgdGhpcy5oYXNoID0gcmVzdC5zdWJzdHIoaGFzaCk7XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoMCwgaGFzaCk7XG4gIH1cbiAgdmFyIHFtID0gcmVzdC5pbmRleE9mKCc/Jyk7XG4gIGlmIChxbSAhPT0gLTEpIHtcbiAgICB0aGlzLnNlYXJjaCA9IHJlc3Quc3Vic3RyKHFtKTtcbiAgICB0aGlzLnF1ZXJ5ID0gcmVzdC5zdWJzdHIocW0gKyAxKTtcbiAgICBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHRoaXMucXVlcnkpO1xuICAgIH1cbiAgICByZXN0ID0gcmVzdC5zbGljZSgwLCBxbSk7XG4gIH0gZWxzZSBpZiAocGFyc2VRdWVyeVN0cmluZykge1xuICAgIC8vIG5vIHF1ZXJ5IHN0cmluZywgYnV0IHBhcnNlUXVlcnlTdHJpbmcgc3RpbGwgcmVxdWVzdGVkXG4gICAgdGhpcy5zZWFyY2ggPSAnJztcbiAgICB0aGlzLnF1ZXJ5ID0ge307XG4gIH1cbiAgaWYgKHJlc3QpIHRoaXMucGF0aG5hbWUgPSByZXN0O1xuICBpZiAoc2xhc2hlZFByb3RvY29sW2xvd2VyUHJvdG9dICYmXG4gICAgICB0aGlzLmhvc3RuYW1lICYmICF0aGlzLnBhdGhuYW1lKSB7XG4gICAgdGhpcy5wYXRobmFtZSA9ICcvJztcbiAgfVxuXG4gIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgaWYgKHRoaXMucGF0aG5hbWUgfHwgdGhpcy5zZWFyY2gpIHtcbiAgICB2YXIgcCA9IHRoaXMucGF0aG5hbWUgfHwgJyc7XG4gICAgdmFyIHMgPSB0aGlzLnNlYXJjaCB8fCAnJztcbiAgICB0aGlzLnBhdGggPSBwICsgcztcbiAgfVxuXG4gIC8vIGZpbmFsbHksIHJlY29uc3RydWN0IHRoZSBocmVmIGJhc2VkIG9uIHdoYXQgaGFzIGJlZW4gdmFsaWRhdGVkLlxuICB0aGlzLmhyZWYgPSB0aGlzLmZvcm1hdCgpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGZvcm1hdCBhIHBhcnNlZCBvYmplY3QgaW50byBhIHVybCBzdHJpbmdcbmZ1bmN0aW9uIHVybEZvcm1hdChvYmopIHtcbiAgLy8gZW5zdXJlIGl0J3MgYW4gb2JqZWN0LCBhbmQgbm90IGEgc3RyaW5nIHVybC5cbiAgLy8gSWYgaXQncyBhbiBvYmosIHRoaXMgaXMgYSBuby1vcC5cbiAgLy8gdGhpcyB3YXksIHlvdSBjYW4gY2FsbCB1cmxfZm9ybWF0KCkgb24gc3RyaW5nc1xuICAvLyB0byBjbGVhbiB1cCBwb3RlbnRpYWxseSB3b25reSB1cmxzLlxuICBpZiAodXRpbC5pc1N0cmluZyhvYmopKSBvYmogPSB1cmxQYXJzZShvYmopO1xuICBpZiAoIShvYmogaW5zdGFuY2VvZiBVcmwpKSByZXR1cm4gVXJsLnByb3RvdHlwZS5mb3JtYXQuY2FsbChvYmopO1xuICByZXR1cm4gb2JqLmZvcm1hdCgpO1xufVxuXG5VcmwucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXV0aCA9IHRoaXMuYXV0aCB8fCAnJztcbiAgaWYgKGF1dGgpIHtcbiAgICBhdXRoID0gZW5jb2RlVVJJQ29tcG9uZW50KGF1dGgpO1xuICAgIGF1dGggPSBhdXRoLnJlcGxhY2UoLyUzQS9pLCAnOicpO1xuICAgIGF1dGggKz0gJ0AnO1xuICB9XG5cbiAgdmFyIHByb3RvY29sID0gdGhpcy5wcm90b2NvbCB8fCAnJyxcbiAgICAgIHBhdGhuYW1lID0gdGhpcy5wYXRobmFtZSB8fCAnJyxcbiAgICAgIGhhc2ggPSB0aGlzLmhhc2ggfHwgJycsXG4gICAgICBob3N0ID0gZmFsc2UsXG4gICAgICBxdWVyeSA9ICcnO1xuXG4gIGlmICh0aGlzLmhvc3QpIHtcbiAgICBob3N0ID0gYXV0aCArIHRoaXMuaG9zdDtcbiAgfSBlbHNlIGlmICh0aGlzLmhvc3RuYW1lKSB7XG4gICAgaG9zdCA9IGF1dGggKyAodGhpcy5ob3N0bmFtZS5pbmRleE9mKCc6JykgPT09IC0xID9cbiAgICAgICAgdGhpcy5ob3N0bmFtZSA6XG4gICAgICAgICdbJyArIHRoaXMuaG9zdG5hbWUgKyAnXScpO1xuICAgIGlmICh0aGlzLnBvcnQpIHtcbiAgICAgIGhvc3QgKz0gJzonICsgdGhpcy5wb3J0O1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLnF1ZXJ5ICYmXG4gICAgICB1dGlsLmlzT2JqZWN0KHRoaXMucXVlcnkpICYmXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnF1ZXJ5KS5sZW5ndGgpIHtcbiAgICBxdWVyeSA9IHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeSh0aGlzLnF1ZXJ5KTtcbiAgfVxuXG4gIHZhciBzZWFyY2ggPSB0aGlzLnNlYXJjaCB8fCAocXVlcnkgJiYgKCc/JyArIHF1ZXJ5KSkgfHwgJyc7XG5cbiAgaWYgKHByb3RvY29sICYmIHByb3RvY29sLnN1YnN0cigtMSkgIT09ICc6JykgcHJvdG9jb2wgKz0gJzonO1xuXG4gIC8vIG9ubHkgdGhlIHNsYXNoZWRQcm90b2NvbHMgZ2V0IHRoZSAvLy4gIE5vdCBtYWlsdG86LCB4bXBwOiwgZXRjLlxuICAvLyB1bmxlc3MgdGhleSBoYWQgdGhlbSB0byBiZWdpbiB3aXRoLlxuICBpZiAodGhpcy5zbGFzaGVzIHx8XG4gICAgICAoIXByb3RvY29sIHx8IHNsYXNoZWRQcm90b2NvbFtwcm90b2NvbF0pICYmIGhvc3QgIT09IGZhbHNlKSB7XG4gICAgaG9zdCA9ICcvLycgKyAoaG9zdCB8fCAnJyk7XG4gICAgaWYgKHBhdGhuYW1lICYmIHBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nKSBwYXRobmFtZSA9ICcvJyArIHBhdGhuYW1lO1xuICB9IGVsc2UgaWYgKCFob3N0KSB7XG4gICAgaG9zdCA9ICcnO1xuICB9XG5cbiAgaWYgKGhhc2ggJiYgaGFzaC5jaGFyQXQoMCkgIT09ICcjJykgaGFzaCA9ICcjJyArIGhhc2g7XG4gIGlmIChzZWFyY2ggJiYgc2VhcmNoLmNoYXJBdCgwKSAhPT0gJz8nKSBzZWFyY2ggPSAnPycgKyBzZWFyY2g7XG5cbiAgcGF0aG5hbWUgPSBwYXRobmFtZS5yZXBsYWNlKC9bPyNdL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChtYXRjaCk7XG4gIH0pO1xuICBzZWFyY2ggPSBzZWFyY2gucmVwbGFjZSgnIycsICclMjMnKTtcblxuICByZXR1cm4gcHJvdG9jb2wgKyBob3N0ICsgcGF0aG5hbWUgKyBzZWFyY2ggKyBoYXNoO1xufTtcblxuZnVuY3Rpb24gdXJsUmVzb2x2ZShzb3VyY2UsIHJlbGF0aXZlKSB7XG4gIHJldHVybiB1cmxQYXJzZShzb3VyY2UsIGZhbHNlLCB0cnVlKS5yZXNvbHZlKHJlbGF0aXZlKTtcbn1cblxuVXJsLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24ocmVsYXRpdmUpIHtcbiAgcmV0dXJuIHRoaXMucmVzb2x2ZU9iamVjdCh1cmxQYXJzZShyZWxhdGl2ZSwgZmFsc2UsIHRydWUpKS5mb3JtYXQoKTtcbn07XG5cbmZ1bmN0aW9uIHVybFJlc29sdmVPYmplY3Qoc291cmNlLCByZWxhdGl2ZSkge1xuICBpZiAoIXNvdXJjZSkgcmV0dXJuIHJlbGF0aXZlO1xuICByZXR1cm4gdXJsUGFyc2Uoc291cmNlLCBmYWxzZSwgdHJ1ZSkucmVzb2x2ZU9iamVjdChyZWxhdGl2ZSk7XG59XG5cblVybC5wcm90b3R5cGUucmVzb2x2ZU9iamVjdCA9IGZ1bmN0aW9uKHJlbGF0aXZlKSB7XG4gIGlmICh1dGlsLmlzU3RyaW5nKHJlbGF0aXZlKSkge1xuICAgIHZhciByZWwgPSBuZXcgVXJsKCk7XG4gICAgcmVsLnBhcnNlKHJlbGF0aXZlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgcmVsYXRpdmUgPSByZWw7XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gbmV3IFVybCgpO1xuICB2YXIgdGtleXMgPSBPYmplY3Qua2V5cyh0aGlzKTtcbiAgZm9yICh2YXIgdGsgPSAwOyB0ayA8IHRrZXlzLmxlbmd0aDsgdGsrKykge1xuICAgIHZhciB0a2V5ID0gdGtleXNbdGtdO1xuICAgIHJlc3VsdFt0a2V5XSA9IHRoaXNbdGtleV07XG4gIH1cblxuICAvLyBoYXNoIGlzIGFsd2F5cyBvdmVycmlkZGVuLCBubyBtYXR0ZXIgd2hhdC5cbiAgLy8gZXZlbiBocmVmPVwiXCIgd2lsbCByZW1vdmUgaXQuXG4gIHJlc3VsdC5oYXNoID0gcmVsYXRpdmUuaGFzaDtcblxuICAvLyBpZiB0aGUgcmVsYXRpdmUgdXJsIGlzIGVtcHR5LCB0aGVuIHRoZXJlJ3Mgbm90aGluZyBsZWZ0IHRvIGRvIGhlcmUuXG4gIGlmIChyZWxhdGl2ZS5ocmVmID09PSAnJykge1xuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBocmVmcyBsaWtlIC8vZm9vL2JhciBhbHdheXMgY3V0IHRvIHRoZSBwcm90b2NvbC5cbiAgaWYgKHJlbGF0aXZlLnNsYXNoZXMgJiYgIXJlbGF0aXZlLnByb3RvY29sKSB7XG4gICAgLy8gdGFrZSBldmVyeXRoaW5nIGV4Y2VwdCB0aGUgcHJvdG9jb2wgZnJvbSByZWxhdGl2ZVxuICAgIHZhciBya2V5cyA9IE9iamVjdC5rZXlzKHJlbGF0aXZlKTtcbiAgICBmb3IgKHZhciByayA9IDA7IHJrIDwgcmtleXMubGVuZ3RoOyByaysrKSB7XG4gICAgICB2YXIgcmtleSA9IHJrZXlzW3JrXTtcbiAgICAgIGlmIChya2V5ICE9PSAncHJvdG9jb2wnKVxuICAgICAgICByZXN1bHRbcmtleV0gPSByZWxhdGl2ZVtya2V5XTtcbiAgICB9XG5cbiAgICAvL3VybFBhcnNlIGFwcGVuZHMgdHJhaWxpbmcgLyB0byB1cmxzIGxpa2UgaHR0cDovL3d3dy5leGFtcGxlLmNvbVxuICAgIGlmIChzbGFzaGVkUHJvdG9jb2xbcmVzdWx0LnByb3RvY29sXSAmJlxuICAgICAgICByZXN1bHQuaG9zdG5hbWUgJiYgIXJlc3VsdC5wYXRobmFtZSkge1xuICAgICAgcmVzdWx0LnBhdGggPSByZXN1bHQucGF0aG5hbWUgPSAnLyc7XG4gICAgfVxuXG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlmIChyZWxhdGl2ZS5wcm90b2NvbCAmJiByZWxhdGl2ZS5wcm90b2NvbCAhPT0gcmVzdWx0LnByb3RvY29sKSB7XG4gICAgLy8gaWYgaXQncyBhIGtub3duIHVybCBwcm90b2NvbCwgdGhlbiBjaGFuZ2luZ1xuICAgIC8vIHRoZSBwcm90b2NvbCBkb2VzIHdlaXJkIHRoaW5nc1xuICAgIC8vIGZpcnN0LCBpZiBpdCdzIG5vdCBmaWxlOiwgdGhlbiB3ZSBNVVNUIGhhdmUgYSBob3N0LFxuICAgIC8vIGFuZCBpZiB0aGVyZSB3YXMgYSBwYXRoXG4gICAgLy8gdG8gYmVnaW4gd2l0aCwgdGhlbiB3ZSBNVVNUIGhhdmUgYSBwYXRoLlxuICAgIC8vIGlmIGl0IGlzIGZpbGU6LCB0aGVuIHRoZSBob3N0IGlzIGRyb3BwZWQsXG4gICAgLy8gYmVjYXVzZSB0aGF0J3Mga25vd24gdG8gYmUgaG9zdGxlc3MuXG4gICAgLy8gYW55dGhpbmcgZWxzZSBpcyBhc3N1bWVkIHRvIGJlIGFic29sdXRlLlxuICAgIGlmICghc2xhc2hlZFByb3RvY29sW3JlbGF0aXZlLnByb3RvY29sXSkge1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhyZWxhdGl2ZSk7XG4gICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IGtleXMubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgdmFyIGsgPSBrZXlzW3ZdO1xuICAgICAgICByZXN1bHRba10gPSByZWxhdGl2ZVtrXTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICByZXN1bHQucHJvdG9jb2wgPSByZWxhdGl2ZS5wcm90b2NvbDtcbiAgICBpZiAoIXJlbGF0aXZlLmhvc3QgJiYgIWhvc3RsZXNzUHJvdG9jb2xbcmVsYXRpdmUucHJvdG9jb2xdKSB7XG4gICAgICB2YXIgcmVsUGF0aCA9IChyZWxhdGl2ZS5wYXRobmFtZSB8fCAnJykuc3BsaXQoJy8nKTtcbiAgICAgIHdoaWxlIChyZWxQYXRoLmxlbmd0aCAmJiAhKHJlbGF0aXZlLmhvc3QgPSByZWxQYXRoLnNoaWZ0KCkpKTtcbiAgICAgIGlmICghcmVsYXRpdmUuaG9zdCkgcmVsYXRpdmUuaG9zdCA9ICcnO1xuICAgICAgaWYgKCFyZWxhdGl2ZS5ob3N0bmFtZSkgcmVsYXRpdmUuaG9zdG5hbWUgPSAnJztcbiAgICAgIGlmIChyZWxQYXRoWzBdICE9PSAnJykgcmVsUGF0aC51bnNoaWZ0KCcnKTtcbiAgICAgIGlmIChyZWxQYXRoLmxlbmd0aCA8IDIpIHJlbFBhdGgudW5zaGlmdCgnJyk7XG4gICAgICByZXN1bHQucGF0aG5hbWUgPSByZWxQYXRoLmpvaW4oJy8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnBhdGhuYW1lID0gcmVsYXRpdmUucGF0aG5hbWU7XG4gICAgfVxuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gICAgcmVzdWx0Lmhvc3QgPSByZWxhdGl2ZS5ob3N0IHx8ICcnO1xuICAgIHJlc3VsdC5hdXRoID0gcmVsYXRpdmUuYXV0aDtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSByZWxhdGl2ZS5ob3N0bmFtZSB8fCByZWxhdGl2ZS5ob3N0O1xuICAgIHJlc3VsdC5wb3J0ID0gcmVsYXRpdmUucG9ydDtcbiAgICAvLyB0byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmIChyZXN1bHQucGF0aG5hbWUgfHwgcmVzdWx0LnNlYXJjaCkge1xuICAgICAgdmFyIHAgPSByZXN1bHQucGF0aG5hbWUgfHwgJyc7XG4gICAgICB2YXIgcyA9IHJlc3VsdC5zZWFyY2ggfHwgJyc7XG4gICAgICByZXN1bHQucGF0aCA9IHAgKyBzO1xuICAgIH1cbiAgICByZXN1bHQuc2xhc2hlcyA9IHJlc3VsdC5zbGFzaGVzIHx8IHJlbGF0aXZlLnNsYXNoZXM7XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZhciBpc1NvdXJjZUFicyA9IChyZXN1bHQucGF0aG5hbWUgJiYgcmVzdWx0LnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nKSxcbiAgICAgIGlzUmVsQWJzID0gKFxuICAgICAgICAgIHJlbGF0aXZlLmhvc3QgfHxcbiAgICAgICAgICByZWxhdGl2ZS5wYXRobmFtZSAmJiByZWxhdGl2ZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJ1xuICAgICAgKSxcbiAgICAgIG11c3RFbmRBYnMgPSAoaXNSZWxBYnMgfHwgaXNTb3VyY2VBYnMgfHxcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5ob3N0ICYmIHJlbGF0aXZlLnBhdGhuYW1lKSksXG4gICAgICByZW1vdmVBbGxEb3RzID0gbXVzdEVuZEFicyxcbiAgICAgIHNyY1BhdGggPSByZXN1bHQucGF0aG5hbWUgJiYgcmVzdWx0LnBhdGhuYW1lLnNwbGl0KCcvJykgfHwgW10sXG4gICAgICByZWxQYXRoID0gcmVsYXRpdmUucGF0aG5hbWUgJiYgcmVsYXRpdmUucGF0aG5hbWUuc3BsaXQoJy8nKSB8fCBbXSxcbiAgICAgIHBzeWNob3RpYyA9IHJlc3VsdC5wcm90b2NvbCAmJiAhc2xhc2hlZFByb3RvY29sW3Jlc3VsdC5wcm90b2NvbF07XG5cbiAgLy8gaWYgdGhlIHVybCBpcyBhIG5vbi1zbGFzaGVkIHVybCwgdGhlbiByZWxhdGl2ZVxuICAvLyBsaW5rcyBsaWtlIC4uLy4uIHNob3VsZCBiZSBhYmxlXG4gIC8vIHRvIGNyYXdsIHVwIHRvIHRoZSBob3N0bmFtZSwgYXMgd2VsbC4gIFRoaXMgaXMgc3RyYW5nZS5cbiAgLy8gcmVzdWx0LnByb3RvY29sIGhhcyBhbHJlYWR5IGJlZW4gc2V0IGJ5IG5vdy5cbiAgLy8gTGF0ZXIgb24sIHB1dCB0aGUgZmlyc3QgcGF0aCBwYXJ0IGludG8gdGhlIGhvc3QgZmllbGQuXG4gIGlmIChwc3ljaG90aWMpIHtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSAnJztcbiAgICByZXN1bHQucG9ydCA9IG51bGw7XG4gICAgaWYgKHJlc3VsdC5ob3N0KSB7XG4gICAgICBpZiAoc3JjUGF0aFswXSA9PT0gJycpIHNyY1BhdGhbMF0gPSByZXN1bHQuaG9zdDtcbiAgICAgIGVsc2Ugc3JjUGF0aC51bnNoaWZ0KHJlc3VsdC5ob3N0KTtcbiAgICB9XG4gICAgcmVzdWx0Lmhvc3QgPSAnJztcbiAgICBpZiAocmVsYXRpdmUucHJvdG9jb2wpIHtcbiAgICAgIHJlbGF0aXZlLmhvc3RuYW1lID0gbnVsbDtcbiAgICAgIHJlbGF0aXZlLnBvcnQgPSBudWxsO1xuICAgICAgaWYgKHJlbGF0aXZlLmhvc3QpIHtcbiAgICAgICAgaWYgKHJlbFBhdGhbMF0gPT09ICcnKSByZWxQYXRoWzBdID0gcmVsYXRpdmUuaG9zdDtcbiAgICAgICAgZWxzZSByZWxQYXRoLnVuc2hpZnQocmVsYXRpdmUuaG9zdCk7XG4gICAgICB9XG4gICAgICByZWxhdGl2ZS5ob3N0ID0gbnVsbDtcbiAgICB9XG4gICAgbXVzdEVuZEFicyA9IG11c3RFbmRBYnMgJiYgKHJlbFBhdGhbMF0gPT09ICcnIHx8IHNyY1BhdGhbMF0gPT09ICcnKTtcbiAgfVxuXG4gIGlmIChpc1JlbEFicykge1xuICAgIC8vIGl0J3MgYWJzb2x1dGUuXG4gICAgcmVzdWx0Lmhvc3QgPSAocmVsYXRpdmUuaG9zdCB8fCByZWxhdGl2ZS5ob3N0ID09PSAnJykgP1xuICAgICAgICAgICAgICAgICAgcmVsYXRpdmUuaG9zdCA6IHJlc3VsdC5ob3N0O1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IChyZWxhdGl2ZS5ob3N0bmFtZSB8fCByZWxhdGl2ZS5ob3N0bmFtZSA9PT0gJycpID9cbiAgICAgICAgICAgICAgICAgICAgICByZWxhdGl2ZS5ob3N0bmFtZSA6IHJlc3VsdC5ob3N0bmFtZTtcbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICAgIHNyY1BhdGggPSByZWxQYXRoO1xuICAgIC8vIGZhbGwgdGhyb3VnaCB0byB0aGUgZG90LWhhbmRsaW5nIGJlbG93LlxuICB9IGVsc2UgaWYgKHJlbFBhdGgubGVuZ3RoKSB7XG4gICAgLy8gaXQncyByZWxhdGl2ZVxuICAgIC8vIHRocm93IGF3YXkgdGhlIGV4aXN0aW5nIGZpbGUsIGFuZCB0YWtlIHRoZSBuZXcgcGF0aCBpbnN0ZWFkLlxuICAgIGlmICghc3JjUGF0aCkgc3JjUGF0aCA9IFtdO1xuICAgIHNyY1BhdGgucG9wKCk7XG4gICAgc3JjUGF0aCA9IHNyY1BhdGguY29uY2F0KHJlbFBhdGgpO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZWxhdGl2ZS5zZWFyY2g7XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG4gIH0gZWxzZSBpZiAoIXV0aWwuaXNOdWxsT3JVbmRlZmluZWQocmVsYXRpdmUuc2VhcmNoKSkge1xuICAgIC8vIGp1c3QgcHVsbCBvdXQgdGhlIHNlYXJjaC5cbiAgICAvLyBsaWtlIGhyZWY9Jz9mb28nLlxuICAgIC8vIFB1dCB0aGlzIGFmdGVyIHRoZSBvdGhlciB0d28gY2FzZXMgYmVjYXVzZSBpdCBzaW1wbGlmaWVzIHRoZSBib29sZWFuc1xuICAgIGlmIChwc3ljaG90aWMpIHtcbiAgICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0ID0gc3JjUGF0aC5zaGlmdCgpO1xuICAgICAgLy9vY2NhdGlvbmFseSB0aGUgYXV0aCBjYW4gZ2V0IHN0dWNrIG9ubHkgaW4gaG9zdFxuICAgICAgLy90aGlzIGVzcGVjaWFsbHkgaGFwcGVucyBpbiBjYXNlcyBsaWtlXG4gICAgICAvL3VybC5yZXNvbHZlT2JqZWN0KCdtYWlsdG86bG9jYWwxQGRvbWFpbjEnLCAnbG9jYWwyQGRvbWFpbjInKVxuICAgICAgdmFyIGF1dGhJbkhvc3QgPSByZXN1bHQuaG9zdCAmJiByZXN1bHQuaG9zdC5pbmRleE9mKCdAJykgPiAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lmhvc3Quc3BsaXQoJ0AnKSA6IGZhbHNlO1xuICAgICAgaWYgKGF1dGhJbkhvc3QpIHtcbiAgICAgICAgcmVzdWx0LmF1dGggPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICAgIHJlc3VsdC5ob3N0ID0gcmVzdWx0Lmhvc3RuYW1lID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICAgIC8vdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAoIXV0aWwuaXNOdWxsKHJlc3VsdC5wYXRobmFtZSkgfHwgIXV0aWwuaXNOdWxsKHJlc3VsdC5zZWFyY2gpKSB7XG4gICAgICByZXN1bHQucGF0aCA9IChyZXN1bHQucGF0aG5hbWUgPyByZXN1bHQucGF0aG5hbWUgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgICAocmVzdWx0LnNlYXJjaCA/IHJlc3VsdC5zZWFyY2ggOiAnJyk7XG4gICAgfVxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpZiAoIXNyY1BhdGgubGVuZ3RoKSB7XG4gICAgLy8gbm8gcGF0aCBhdCBhbGwuICBlYXN5LlxuICAgIC8vIHdlJ3ZlIGFscmVhZHkgaGFuZGxlZCB0aGUgb3RoZXIgc3R1ZmYgYWJvdmUuXG4gICAgcmVzdWx0LnBhdGhuYW1lID0gbnVsbDtcbiAgICAvL3RvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKHJlc3VsdC5zZWFyY2gpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gJy8nICsgcmVzdWx0LnNlYXJjaDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnBhdGggPSBudWxsO1xuICAgIH1cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gaWYgYSB1cmwgRU5EcyBpbiAuIG9yIC4uLCB0aGVuIGl0IG11c3QgZ2V0IGEgdHJhaWxpbmcgc2xhc2guXG4gIC8vIGhvd2V2ZXIsIGlmIGl0IGVuZHMgaW4gYW55dGhpbmcgZWxzZSBub24tc2xhc2h5LFxuICAvLyB0aGVuIGl0IG11c3QgTk9UIGdldCBhIHRyYWlsaW5nIHNsYXNoLlxuICB2YXIgbGFzdCA9IHNyY1BhdGguc2xpY2UoLTEpWzBdO1xuICB2YXIgaGFzVHJhaWxpbmdTbGFzaCA9IChcbiAgICAgIChyZXN1bHQuaG9zdCB8fCByZWxhdGl2ZS5ob3N0IHx8IHNyY1BhdGgubGVuZ3RoID4gMSkgJiZcbiAgICAgIChsYXN0ID09PSAnLicgfHwgbGFzdCA9PT0gJy4uJykgfHwgbGFzdCA9PT0gJycpO1xuXG4gIC8vIHN0cmlwIHNpbmdsZSBkb3RzLCByZXNvbHZlIGRvdWJsZSBkb3RzIHRvIHBhcmVudCBkaXJcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHNyY1BhdGgubGVuZ3RoOyBpID49IDA7IGktLSkge1xuICAgIGxhc3QgPSBzcmNQYXRoW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHNyY1BhdGguc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgc3JjUGF0aC5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHNyY1BhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmICghbXVzdEVuZEFicyAmJiAhcmVtb3ZlQWxsRG90cykge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgc3JjUGF0aC51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtdXN0RW5kQWJzICYmIHNyY1BhdGhbMF0gIT09ICcnICYmXG4gICAgICAoIXNyY1BhdGhbMF0gfHwgc3JjUGF0aFswXS5jaGFyQXQoMCkgIT09ICcvJykpIHtcbiAgICBzcmNQYXRoLnVuc2hpZnQoJycpO1xuICB9XG5cbiAgaWYgKGhhc1RyYWlsaW5nU2xhc2ggJiYgKHNyY1BhdGguam9pbignLycpLnN1YnN0cigtMSkgIT09ICcvJykpIHtcbiAgICBzcmNQYXRoLnB1c2goJycpO1xuICB9XG5cbiAgdmFyIGlzQWJzb2x1dGUgPSBzcmNQYXRoWzBdID09PSAnJyB8fFxuICAgICAgKHNyY1BhdGhbMF0gJiYgc3JjUGF0aFswXS5jaGFyQXQoMCkgPT09ICcvJyk7XG5cbiAgLy8gcHV0IHRoZSBob3N0IGJhY2tcbiAgaWYgKHBzeWNob3RpYykge1xuICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0ID0gaXNBYnNvbHV0ZSA/ICcnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyY1BhdGgubGVuZ3RoID8gc3JjUGF0aC5zaGlmdCgpIDogJyc7XG4gICAgLy9vY2NhdGlvbmFseSB0aGUgYXV0aCBjYW4gZ2V0IHN0dWNrIG9ubHkgaW4gaG9zdFxuICAgIC8vdGhpcyBlc3BlY2lhbGx5IGhhcHBlbnMgaW4gY2FzZXMgbGlrZVxuICAgIC8vdXJsLnJlc29sdmVPYmplY3QoJ21haWx0bzpsb2NhbDFAZG9tYWluMScsICdsb2NhbDJAZG9tYWluMicpXG4gICAgdmFyIGF1dGhJbkhvc3QgPSByZXN1bHQuaG9zdCAmJiByZXN1bHQuaG9zdC5pbmRleE9mKCdAJykgPiAwID9cbiAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5ob3N0LnNwbGl0KCdAJykgOiBmYWxzZTtcbiAgICBpZiAoYXV0aEluSG9zdCkge1xuICAgICAgcmVzdWx0LmF1dGggPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgICByZXN1bHQuaG9zdCA9IHJlc3VsdC5ob3N0bmFtZSA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICB9XG4gIH1cblxuICBtdXN0RW5kQWJzID0gbXVzdEVuZEFicyB8fCAocmVzdWx0Lmhvc3QgJiYgc3JjUGF0aC5sZW5ndGgpO1xuXG4gIGlmIChtdXN0RW5kQWJzICYmICFpc0Fic29sdXRlKSB7XG4gICAgc3JjUGF0aC51bnNoaWZ0KCcnKTtcbiAgfVxuXG4gIGlmICghc3JjUGF0aC5sZW5ndGgpIHtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBudWxsO1xuICAgIHJlc3VsdC5wYXRoID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBzcmNQYXRoLmpvaW4oJy8nKTtcbiAgfVxuXG4gIC8vdG8gc3VwcG9ydCByZXF1ZXN0Lmh0dHBcbiAgaWYgKCF1dGlsLmlzTnVsbChyZXN1bHQucGF0aG5hbWUpIHx8ICF1dGlsLmlzTnVsbChyZXN1bHQuc2VhcmNoKSkge1xuICAgIHJlc3VsdC5wYXRoID0gKHJlc3VsdC5wYXRobmFtZSA/IHJlc3VsdC5wYXRobmFtZSA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAocmVzdWx0LnNlYXJjaCA/IHJlc3VsdC5zZWFyY2ggOiAnJyk7XG4gIH1cbiAgcmVzdWx0LmF1dGggPSByZWxhdGl2ZS5hdXRoIHx8IHJlc3VsdC5hdXRoO1xuICByZXN1bHQuc2xhc2hlcyA9IHJlc3VsdC5zbGFzaGVzIHx8IHJlbGF0aXZlLnNsYXNoZXM7XG4gIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuVXJsLnByb3RvdHlwZS5wYXJzZUhvc3QgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhvc3QgPSB0aGlzLmhvc3Q7XG4gIHZhciBwb3J0ID0gcG9ydFBhdHRlcm4uZXhlYyhob3N0KTtcbiAgaWYgKHBvcnQpIHtcbiAgICBwb3J0ID0gcG9ydFswXTtcbiAgICBpZiAocG9ydCAhPT0gJzonKSB7XG4gICAgICB0aGlzLnBvcnQgPSBwb3J0LnN1YnN0cigxKTtcbiAgICB9XG4gICAgaG9zdCA9IGhvc3Quc3Vic3RyKDAsIGhvc3QubGVuZ3RoIC0gcG9ydC5sZW5ndGgpO1xuICB9XG4gIGlmIChob3N0KSB0aGlzLmhvc3RuYW1lID0gaG9zdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1N0cmluZzogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHR5cGVvZihhcmcpID09PSAnc3RyaW5nJztcbiAgfSxcbiAgaXNPYmplY3Q6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB0eXBlb2YoYXJnKSA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xuICB9LFxuICBpc051bGw6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBhcmcgPT09IG51bGw7XG4gIH0sXG4gIGlzTnVsbE9yVW5kZWZpbmVkOiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gYXJnID09IG51bGw7XG4gIH1cbn07XG4iLCJjb25zdCBwYXJzZSA9IHJlcXVpcmUoXCJ1cmxcIikucGFyc2VcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNsZWFuLFxuICBwYWdlLFxuICBwcm90b2NvbCxcbiAgaG9zdG5hbWUsXG4gIG5vcm1hbGl6ZSxcbiAgaXNTZWFyY2hRdWVyeSxcbiAgaXNVUkxcbn1cblxuZnVuY3Rpb24gcHJvdG9jb2wgKHVybCkge1xuICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvKF5cXHcrKTpcXC9cXC8vKVxuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gbWF0Y2hbMV1cbiAgfVxuXG4gIHJldHVybiAnaHR0cCdcbn1cblxuZnVuY3Rpb24gY2xlYW4gKHVybCkge1xuICByZXR1cm4gY2xlYW5VVE0odXJsKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvXlxcdys6XFwvXFwvLywgJycpXG4gICAgLnJlcGxhY2UoL15bXFx3LV9dKzpbXFx3LV9dK0AvLCAnJylcbiAgICAucmVwbGFjZSgvIy4qJC8sICcnKVxuICAgIC5yZXBsYWNlKC8oXFwvfFxcP3xcXCZ8IykqJC8sICcnKVxuICAgIC5yZXBsYWNlKC9cXC9cXD8vLCAnPycpXG4gICAgLnJlcGxhY2UoL153d3dcXC4vLCAnJylcbn1cblxuZnVuY3Rpb24gcGFnZSAodXJsKSB7XG4gIHJldHVybiBjbGVhbih1cmwucmVwbGFjZSgvXFwjLiokLywgJycpKVxufVxuXG5mdW5jdGlvbiBob3N0bmFtZSAodXJsKSB7XG4gIHJldHVybiBwYXJzZShub3JtYWxpemUodXJsKSkuaG9zdG5hbWUucmVwbGFjZSgvXnd3d1xcLi8sICcnKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemUgKGlucHV0KSB7XG4gIGlmIChpbnB1dC50cmltKCkubGVuZ3RoID09PSAwKSByZXR1cm4gJydcblxuICBpZiAoaXNTZWFyY2hRdWVyeShpbnB1dCkpIHtcbiAgICByZXR1cm4gYGh0dHBzOi8vZ29vZ2xlLmNvbS9zZWFyY2g/cT0ke2VuY29kZVVSSShpbnB1dCl9YFxuICB9XG5cbiAgaWYgKCEvXlxcdys6XFwvXFwvLy50ZXN0KGlucHV0KSkge1xuICAgIHJldHVybiBgaHR0cDovLyR7aW5wdXR9YFxuICB9XG5cbiAgcmV0dXJuIGlucHV0XG59XG5cbmZ1bmN0aW9uIGlzU2VhcmNoUXVlcnkgKGlucHV0KSB7XG4gIHJldHVybiAhaXNVUkwoaW5wdXQudHJpbSgpKVxufVxuXG5mdW5jdGlvbiBpc1VSTCAoaW5wdXQpIHtcbiAgcmV0dXJuIGlucHV0LmluZGV4T2YoJyAnKSA9PT0gLTEgJiYgKC9eXFx3KzpcXC9cXC8vLnRlc3QoaW5wdXQpIHx8IGlucHV0LmluZGV4T2YoJy4nKSA+IDAgfHwgaW5wdXQuaW5kZXhPZignOicpID4gMClcbn1cblxuZnVuY3Rpb24gY2xlYW5VVE0gKHVybCkge1xuICByZXR1cm4gdXJsXG4gICAgLnJlcGxhY2UoLyhcXD98XFwmKXV0bV9bXFx3XStcXD1bXlxcJl0rL2csICckMScpXG4gICAgLnJlcGxhY2UoLyhcXD98XFwmKXJlZlxcPVteXFwmXStcXCY/LywgJyQxJylcbiAgICAucmVwbGFjZSgvW1xcJl17Mix9LywnJicpXG4gICAgLnJlcGxhY2UoJz8mJywgJz8nKVxufVxuIl19
