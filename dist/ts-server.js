"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _open2 = require("open");

var _open3 = _interopRequireDefault(_open2);

var _connect = require("connect");

var _connect2 = _interopRequireDefault(_connect);

var _connectLivereload = require("connect-livereload");

var _connectLivereload2 = _interopRequireDefault(_connectLivereload);

var _tinyLr = require("tiny-lr");

var _tinyLr2 = _interopRequireDefault(_tinyLr);

var _serveStatic = require("serve-static");

var _serveStatic2 = _interopRequireDefault(_serveStatic);

var _watch = require("watch");

var _watch2 = _interopRequireDefault(_watch);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _serveIndex = require("serve-index");

var _serveIndex2 = _interopRequireDefault(_serveIndex);

var _process = require("process.logger");

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
					}
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
						(0, _process2.default)().help("File \"" + file + "\" has been changed.");
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
				text: "URL: "
			}, {
				style: "help",
				text: page
			}, {
				text: " has been opened in your browser."
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
