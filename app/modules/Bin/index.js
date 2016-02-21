import testClicked from './signals/testClicked';
import fileClicked from './signals/fileClicked';
import codeChanged from './signals/codeChanged';
import mounted from './signals/mounted';
import linted from './signals/linted';
import saveShortcutPressed from './signals/saveShortcutPressed';
import iframeLoaded from './signals/iframeLoaded';

export default (options = {}) => {
  return (module, controller) => {

    module.addState({
      url: null,
      hasInitialized: false,
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
import HelloWorld from './HelloWorld';

render(<HelloWorld/>, document.querySelector(\'#app\'));`
      },
      {
        name: 'HelloWorld.js',
        content: `import React from \'react\';

function HelloWorld() {
  return (
    <h1>Hello World</h1>
  );
}

export default HelloWorld;`
      }]
    });

    module.addSignals({
      codeChanged,
      testClicked,
      fileClicked,
      mounted,
      linted,
      saveShortcutPressed,
      iframeLoaded
    });

  };
}
