import TsServer from "../src/ts-server"

var server = new TsServer()
server.setup({
	open: "test.html",
	livereload: {
		enable: true,
		filter: function(file) {
			return file !== "index.js"
		},
	}
})