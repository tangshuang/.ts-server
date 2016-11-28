import http from 'http'
import open from 'open'
import connect from 'connect'
import livereload from 'connect-livereload'
import tinyLr from 'tiny-lr'
import serveStatic from 'serve-static'
import watch from 'watch'
import fs from 'fs'
import path from 'path'
import url from 'url'
import extend from 'node.extend'

export default class LiteServer {
	constructor() {
		this.options = null
		this.lrServer = null
		this.server = null
	}
	server(options) {
		var default = {
			host: "localhost",
			port: 8989,
			root: ".",
			open: "",
			livereload: true,
			listenpaths: ["."],
			middleware: [],
			debug: false,
		}
		options = extend({}, default, options)
		this.options = options

		var app = connect()
		
		if(options.middleware instanceof Array) {
			options.middleware
				.filter(item => typeof item === 'function')
				.forEach(item => app.use(item))
		}

		app.use(options.root, serveStatic(options.root))

		app.use(livereload({
			port: 80809
		}))

		var lrServer = tinyLr()
		lrServer.listen(80809, options.host)
		this.lrServer = lrServer

		if(options.livereload) {
			watch.watchTree(options.listenpaths, filename => {
				lrServer.changed({
					body: {
						files: filename,
					}
				})
			})
		}

		var server = http.createServer(app).listen(options.port)
		this.server = server

		var page = url({
			protocal: "http",
			hostname: options.host,
			port: options.port,
			pathname: options.open,
		})
		open(page)


	}
	open(uri) {
		var page = url({
			protocal: "http",
			hostname: options.host,
			port: options.port,
			pathname: uri,
		})
		open(page)
	}
	reload() {
		var lrServer = this.lrServer
		if(lrServer && typeof lrServer.changed === "function") {
			lrServer.changed()
		}
	}
	destory() {
		var server = this.server
		if(server && typeof server.close === "function") {
			server.close()
		}

		var lrServer = this.lrServer
		if(lrServer && typeof lrServer.close === "function") {
			lrServer.close()
		}
	}
}
module.exports = LiteServer;