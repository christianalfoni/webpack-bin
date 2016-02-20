import testClicked from './signals/testClicked';
import fileClicked from './signals/fileClicked';
import codeChanged from './signals/codeChanged';

export default (options = {}) => {
  return (module, controller) => {

    module.addState({
      url: null,
      isLoading: false,
      selectedFileIndex: 0,
      files: [{
        name: 'main.js',
        content: 'var react = require(\'react\');\nvar react = require(\'./test.js\');'
      },
      {
        name: 'test.js',
        content: 'console.log(\'Haha\')'
      }]
    });

    module.addSignals({
      codeChanged,
      testClicked,
      fileClicked
    });

  };
}
