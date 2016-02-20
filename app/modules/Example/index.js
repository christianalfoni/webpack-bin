import colorChanged from './signals/colorChanged';
import redirectRoot from './signals/redirectRoot';
import randomColorClicked from './signals/randomColorClicked';
import testClicked from './signals/testClicked';
import fileClicked from './signals/fileClicked';

export default (options = {}) => {
  return (module, controller) => {

    module.addState({
      title: 'You can change the url too!',
      color: '#333',
      selectedFileIndex: 0,
      files: [{
        name: 'main.js',
        content: ''
      },
      {
        name: 'test.js',
        content: ''
      }]
    });

    module.addSignals({
      colorChanged,
      redirectRoot,
      randomColorClicked,
      testClicked,
      fileClicked
    });

  };
}
