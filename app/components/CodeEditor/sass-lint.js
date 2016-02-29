module.exports = function(CodeMirror, sass) {

  function validator(text, options) {
	   var result = [];

	    var errors = sass.lintText({
        text: text,
        name: 'file.scss',
        format: 'scss'
      }, {}).messages;
  	for (var i = 0; i < errors.length; i++) {
  	  var error = errors[i];
  	  result.push({
        message: error.message,
  		  severity: error.level,
  		  from: CodeMirror.Pos(error.line - 1),
  	    to: CodeMirror.Pos(error.line - 1)
      });
  	}
  	return result;
  }

  CodeMirror.registerHelper("lint", "sass", validator);

}
