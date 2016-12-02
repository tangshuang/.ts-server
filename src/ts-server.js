import http from "http"
import open from "open"
import connect from "connect"
import livereload from "connect-livereload"
import tinyLr from "tiny-lr"
import serveStatic from "serve-static"
import watch from "watch"
import url from "url"
import extend from "extend"
import serveIndex from "serve-index"
import logger from "process.logger"

export default class TsServer {
	constructor() {
		this.options = null
		this.livereloadServer = null
		this.server = null
	}
	setup(options) {
		var defaults = {
			host: "localhost",
			port: 8978,
			root: ".",
			open: "/",
			livereload: {
				enable: true,
				port: 9572,
				directory: ".",
				filter: function (file) {
					if(file.match(/node_modules/)) {
						return false
					} 
					else { 
						return true
					}
				},
			},
			middleware: [],
			indexes: false,
		}
		options = extend(true, {}, defaults, options)
		this.options = options

		var app = connect()

		// middleware routers
		if(options.middleware instanceof Array) {
			options.middleware
				.filter(item => typeof item === "function")
				.forEach(item => app.use(item))
		}

		// livereload
		if(options.livereload.enable) {
			// setup routers
			app.use(livereload({
				port: options.livereload.port,
			}))
			// setup a tiny server for livereload backend
			var livereloadServer = tinyLr()
			livereloadServer.listen(options.livereload.port, options.host)
			// watch files for livereload
			watch.watchTree(options.livereload.directory, {
				ignoreDotFiles: true,
				filter: options.livereload.filter
			}, file => {
				livereloadServer.changed({
					body: {
						files: file,
					},
				})
				if(typeof file === "string") {
					logger.set("timestamp", true).help(`File "${file}" has been changed.`)
				}
			})
			this.livereloadServer = livereloadServer
		}

		if(options.indexes) {
			app.use(serveIndex(options.root))
		}

		// our local path routers
		app.use(serveStatic(options.root))

		var self = this
		var server = this.server = http.createServer(app).listen(options.port, options.host, () => {
			self.open(options.open)
		})
	}
	open(uri) {
		var options = this.options
		var page = url.format({
			protocol: "http",
			hostname: options.host,
			port: options.port,
			pathname: uri,
		})
		open(page)
		logger({
			text: "URL:",
		}, {
			style: "help",
			text: page,
		}, {
			text: "has been opened in your browser.",
		})
	}
	reload() {
		var livereloadServer = this.livereloadServer
		if(livereloadServer && typeof livereloadServer.changed === "function") {
			livereloadServer.reload()
		}
	}
	destory() {
		var server = this.server
		if(server && typeof server.close === "function") {
			server.close()
		}

		var livereloadServer = this.livereloadServer
		if(livereloadServer && typeof livereloadServer.close === "function") {
			livereloadServer.close()
		}
	}
}
module.exports = TsServer