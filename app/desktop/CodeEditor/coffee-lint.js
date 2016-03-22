module.exports = function(CodeMirror, coffeelint) {

  function validator(text, options) {
	   var result = [];

	    var errors = coffeelint.lint(text);
  	for (var i = 0; i < errors.length; i++) {
  	  var error = errors[i];
  	  result.push({
        message: error.message,
  		  severity: error.level,
  		  from: CodeMirror.Pos(error.lineNumber - 1),
  	    to: CodeMirror.Pos(error.lineNumber - 1)
      });
  	}
  	return result;
  }

  CodeMirror.registerHelper("lint", "coffeescript", validator);

}
