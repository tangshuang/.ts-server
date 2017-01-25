var TsServer = require("../dist/ts-server")

var server = new TsServer()
server.set({
	open: "test.html",
	livereload: {
		enable: true,
		filter: function(file) {
			return file.indexOf("index.js") === -1
		},
	}
}).start()
