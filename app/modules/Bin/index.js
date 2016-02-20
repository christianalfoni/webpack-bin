import testClicked from './signals/testClicked';
import fileClicked from './signals/fileClicked';
import codeChanged from './signals/codeChanged';
import mounted from './signals/mounted';
import linted from './signals/linted';
import saveShortcutPressed from './signals/saveShortcutPressed';

export default (options = {}) => {
  return (module, controller) => {

    module.addState({
      url: null,
      hasSaved: false,
      isLinting: false,
      lastLintedIndex: 0,
      isValid: true,
      isLoading: false,
      selectedFileIndex: 0,
      files: [{
        name: 'main.js',
        content: `import React from \'react\';
import {render} from \'react-dom\';

render((
  <h1>Hello world</h1>
), document.querySelector(\'#app\'));
`
      },
      {
        name: 'test.js',
        content: 'console.log(\'Haha\')'
      }]
    });

    module.addSignals({
      codeChanged,
      testClicked,
      fileClicked,
      mounted,
      linted,
      saveShortcutPressed
    });

  };
}
