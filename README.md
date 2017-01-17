# TsServer

## Install

```
$ npm install ts-server --save-dev
```

## Usage

```
import TsServer from "ts-server"
import path from "path"
import config from "./config"

var name = "my-component"
var $server = new TsServer()
$server.setup({
	root: config.paths.root,
	open: `${config.dirs.components}/${name}/preview/`,
	livereload: {
		directory: `${config.dirs.components}/${name}`,
		filter: function (file) {
			var filepos = file.replace(`${config.dirs.components}/${name}`, "")
			var sep = path.sep
			if(filepos.indexOf(sep + "dist") === 0 || filepos.indexOf(sep + "preview") === 0) {
				return true
			}
			else { 
				return false
			}
		},
	},
})
```

1 instantiate

```
var $server = new TsServer()
```

2 setup

```
$server.setup(options)
```

default options:

```
{
	host: "localhost",
	port: 8978,
	root: ".",
	open: "/",
	livereload: {
		enable: true,
		port: 9572,
		directory: ".", // only files in this directory changes causing reload
		filter: function (file) { // based on "directory", files in directory will be filtered for listening, return "true" to be listened, return "false" to ignore
			if(file.match(/node_modules/)) {
				return false
			} 
			else { 
				return true
			}
		},
	},
	middleware: [], // middleware for node http app.use. livereload is a middleware in fact
	indexes: false, // whether to display file indexes when you visit a folder
	backendServer: false, // pass a function with parameter `app` to server up a back end server `function(app) {}`
}
```

Default options will be extended by you own `options`.

#### APIs

**open()**

Open your local browser to open a new page. It's just an alias and improvement of `open` module.
Just open in browser, no other feature.

```
$server.open(uri)
```

**reload()**

Call the livereload to reload.

```
$server.reload()
```

**destory()**

Destory the server

```
$server.destory()
```

## Development

This package is written by ES6, after you change source code, you can run:

```
npm run babel
```