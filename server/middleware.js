/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var MemoryFileSystem = require("memory-fs");
var mime = require("mime");

var HASH_REGEXP = /[0-9a-f]{10,}/;

// constructor for the middleware
module.exports = function(compiler, options, onFileSystemAdded) {

	//Initialize options.
	if(!options) options = {}
	if(typeof options.watchOptions === "undefined") options.watchOptions = {};
	if(typeof options.watchDelay !== "undefined") {
		// TODO remove this in next major version
		console.warn("options.watchDelay is deprecated: Use 'options.watchOptions.aggregateTimeout' instead");
		options.watchOptions.aggregateTimeout = options.watchDelay;
	}
	if(typeof options.watchOptions.aggregateTimeout === "undefined") options.watchOptions.aggregateTimeout = 200;
	if(typeof options.stats === "undefined") options.stats = {};
	if(!options.stats.context) options.stats.context = process.cwd();
	if(options.lazy) {
		if(typeof options.filename === "string") {
			var str = options.filename
				.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
				.replace(/\\\[[a-z]+\\\]/ig, ".+");
			options.filename = new RegExp("^[\/]{0,1}" + str + "$");
		}
	}
	// Finished initializing options.

	// store our files in memory
	var files = {};
	var fs = compiler.outputFileSystem;

	// Add file system if specified. Here it is memoryFs.
	onFileSystemAdded && onFileSystemAdded(fs);

	compiler.plugin("done", function(stats) {
		// We are now on valid state
		state = true;
		// Do the stuff in nextTick, because bundle may be invalidated
		//  if a change happend while compiling
		process.nextTick(function() {
			// check if still in valid state
			if(!state) return;
			// print webpack output
			var error = null;

			if (stats.hasErrors()) {
				error = stats.compilation.errors[0];
			}

			// execute callback that are delayed
			var cbs = callbacks;
			callbacks = [];
			cbs.forEach(function continueBecauseBundleAvailible(cb) {
				cb(error);
			});
		});

		// In lazy mode, we may issue another rebuild
		if(forceRebuild) {
			forceRebuild = false;
			rebuild();
		}
	});

	// on compiling
	function invalidPlugin() {
		if(state && (!options.noInfo && !options.quiet))
		// We are now in invalid state
		state = false;
	}
	function invalidAsyncPlugin(compiler, callback) {
		invalidPlugin();
		callback();
	}
	compiler.plugin("invalid", invalidPlugin);
	compiler.plugin("watch-run", invalidAsyncPlugin);
	compiler.plugin("run", invalidAsyncPlugin);

	// the state, false: bundle invalid, true: bundle valid
	var state = false;

	// in lazy mode, rebuild automatically
	var forceRebuild = false;

	// delayed callback
	var callbacks = [];
	console.log('Options are', options);

	// start watching
	if(!options.lazy) {
		var watching = compiler.watch(options.watchOptions, function(err) {
			if(err) throw err;
		});
	} else {
		state = true;
	}

	function rebuild() {
		console.log('In rebuild');
		console.log('Will test', state);
		if(state) {
			state = false;
			console.log('Compiler will run');
			compiler.run(function(err) {
				console.log('Compiler has run');
				if(err) throw err;
			});
		} else {
			forceRebuild = true;
		}
	}

	function pathJoin(a, b) {
		return a == "/" ? "/" + b : (a||"") + "/" + b
	}

	function getFilenameFromUrl(url) {
		// publicPrefix is the folder our bundle should be in
		var localPrefix = options.publicPath || "/";
		if(url.indexOf(localPrefix) !== 0) {
			if(/^(https?:)?\/\//.test(localPrefix)) {
				localPrefix = "/" + localPrefix.replace(/^(https?:)?\/\/[^\/]+\//, "");
				// fast exit if another directory requested
				if(url.indexOf(localPrefix) !== 0) return false;
			} else return false;
		}
		// get filename from request
		var filename = url.substr(localPrefix.length);
		if(filename.indexOf("?") >= 0) {
			filename = filename.substr(0, filename.indexOf("?"));
		}
		return filename ? pathJoin(compiler.outputPath, filename) : compiler.outputPath;
	}

	// The middleware function
	function webpackDevMiddleware(req, res, next) {
		var filename = getFilenameFromUrl(req.url);
		if (filename === false) return next();

		var passResponse = function (error) {
			if (error) {

				var html = [
					'<div>',
					'  <h1 style="color:#eb1e64;padding:10px;margin:0;">ERROR: ' + error.name + '</h1>',
					'  <textarea id="textarea" style="border:0;resize:none;width:100%;height:500px;font-size:16px;padding:20px;line-height:22px;box-sizing:border-box;">' + error.message.replace(/\n/g, '\\n').replace(/\'/g, '\\\'') + '</textarea>',
					'</div>'
				].join('');
				var content = [
					'var html = \'' + html + '\';',
					'document.body.innerHTML = html;'
				].join('\n');
				res.setHeader("Content-Type", mime.lookup('error.js'));
				res.setHeader("Content-Length", content.length);
				res.send(content);
				return;
			}

			// server content
			var content = fs.readFileSync(filename);
			res.setHeader("Access-Control-Allow-Origin", "*"); // To support XHR, etc.
			res.setHeader("Content-Type", mime.lookup(filename));
			res.setHeader("Content-Length", content.length);
			if(options.headers) {
				for(var name in options.headers) {
					res.setHeader(name, options.headers[name]);
				}
			}
			if (res.send) res.send(content);
			else res.end(content);
		}
		console.log('Options in middleware', options);
		// in lazy mode, rebuild on bundle request
		if(options.lazy && (!options.filename || options.filename.test(filename))) {
			callbacks.push(passResponse);
			rebuild();
		} else {
			passResponse();
		}
	}

	webpackDevMiddleware.getFilenameFromUrl = getFilenameFromUrl;

	webpackDevMiddleware.invalidate = function() {
		if(watching) watching.invalidate();
	};
	webpackDevMiddleware.close = function(callback) {
		callback = callback || function(){};
		if(watching) watching.close(callback);
		else callback();
	};

	webpackDevMiddleware.fileSystem = fs;

	return webpackDevMiddleware;
}
