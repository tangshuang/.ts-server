module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _http = __webpack_require__(1);

	var _http2 = _interopRequireDefault(_http);

	var _open2 = __webpack_require__(2);

	var _open3 = _interopRequireDefault(_open2);

	var _connect = __webpack_require__(3);

	var _connect2 = _interopRequireDefault(_connect);

	var _connectLivereload = __webpack_require__(4);

	var _connectLivereload2 = _interopRequireDefault(_connectLivereload);

	var _tinyLr = __webpack_require__(5);

	var _tinyLr2 = _interopRequireDefault(_tinyLr);

	var _serveStatic = __webpack_require__(6);

	var _serveStatic2 = _interopRequireDefault(_serveStatic);

	var _watch = __webpack_require__(7);

	var _watch2 = _interopRequireDefault(_watch);

	var _url = __webpack_require__(8);

	var _url2 = _interopRequireDefault(_url);

	var _extend = __webpack_require__(9);

	var _extend2 = _interopRequireDefault(_extend);

	var _serveIndex = __webpack_require__(10);

	var _serveIndex2 = _interopRequireDefault(_serveIndex);

	var _process = __webpack_require__(11);

	var _process2 = _interopRequireDefault(_process);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TsServer = function () {
		function TsServer() {
			_classCallCheck(this, TsServer);

			this.options = null;
			this.livereloadServer = null;
			this.server = null;
		}

		_createClass(TsServer, [{
			key: "setup",
			value: function setup(options) {
				var defaults = {
					host: "localhost",
					port: 8978,
					root: ".",
					open: "/",
					livereload: {
						enable: true,
						port: 9572,
						directory: ".",
						filter: function filter(file) {
							if (file.match(/node_modules/)) {
								return false;
							} else {
								return true;
							}
						},
						callback: function callback() {}
					},
					middleware: [],
					indexes: false
				};
				options = (0, _extend2.default)(true, {}, defaults, options);
				this.options = options;

				var app = (0, _connect2.default)();

				// middleware routers
				if (options.middleware instanceof Array) {
					options.middleware.filter(function (item) {
						return typeof item === "function";
					}).forEach(function (item) {
						return app.use(item);
					});
				}

				// livereload
				if (options.livereload.enable) {
					// setup routers
					app.use((0, _connectLivereload2.default)({
						port: options.livereload.port
					}));
					// setup a tiny server for livereload backend
					var livereloadServer = (0, _tinyLr2.default)();
					livereloadServer.listen(options.livereload.port, options.host);
					// watch files for livereload
					_watch2.default.watchTree(options.livereload.directory, {
						ignoreDotFiles: true,
						filter: options.livereload.filter
					}, function (file) {
						livereloadServer.changed({
							body: {
								files: file
							}
						});
						if (typeof file === "string") {
							_process2.default.set("timestamp", true).help("File \"" + file + "\" has been changed.");
						}
						if (typeof options.livereload.callback === "function") {
							options.livereload.callback(file);
						}
					});
					this.livereloadServer = livereloadServer;
				}

				if (options.indexes) {
					app.use((0, _serveIndex2.default)(options.root));
				}

				// our local path routers
				app.use((0, _serveStatic2.default)(options.root));

				var self = this;
				var server = this.server = _http2.default.createServer(app).listen(options.port, options.host, function () {
					self.open(options.open);
				});
			}
		}, {
			key: "open",
			value: function open(uri) {
				var options = this.options;
				var page = _url2.default.format({
					protocol: "http",
					hostname: options.host,
					port: options.port,
					pathname: uri
				});
				(0, _open3.default)(page);
				(0, _process2.default)({
					text: "Url"
				}, {
					style: "help",
					text: page
				}, {
					text: "has been opened in your browser."
				});
			}
		}, {
			key: "reload",
			value: function reload() {
				var livereloadServer = this.livereloadServer;
				if (livereloadServer && typeof livereloadServer.changed === "function") {
					livereloadServer.reload();
				}
			}
		}, {
			key: "destory",
			value: function destory() {
				var server = this.server;
				if (server && typeof server.close === "function") {
					server.close();
				}

				var livereloadServer = this.livereloadServer;
				if (livereloadServer && typeof livereloadServer.close === "function") {
					livereloadServer.close();
				}
			}
		}]);

		return TsServer;
	}();

	exports.default = TsServer;

	module.exports = TsServer;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("open");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("connect");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("connect-livereload");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("tiny-lr");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("serve-static");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("watch");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("extend");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("serve-index");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("process.logger");

/***/ }
/******/ ]);