const defaultRules = {
  'tagname-lowercase': true,
  'attr-lowercase': true,
  'attr-value-double-quotes': true,
  'doctype-first': false,
  'tag-pair': true,
  'spec-char-escape': true,
  'id-unique': true,
  'src-not-empty': true,
  'attr-no-duplication': true
};

module.exports = function (CodeMirror, HTMLHint) {
  return function(text, options) {
    const found = [];

    const messages = HTMLHint.verify(text, options && options.rules || defaultRules);
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      var startLine = message.line - 1, endLine = message.line - 1, startCol = message.col - 1, endCol = message.col;
      found.push({
        from: CodeMirror.Pos(startLine, startCol),
        to: CodeMirror.Pos(endLine, endCol),
        message: message.message,
        severity : message.type
      });
    }
    return found;
  };
}
