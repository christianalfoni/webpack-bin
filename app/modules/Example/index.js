import colorChanged from './signals/colorChanged';
import redirectRoot from './signals/redirectRoot';
import randomColorClicked from './signals/randomColorClicked';
import testClicked from './signals/testClicked';

export default (options = {}) => {
  return (module, controller) => {

    module.addState({
      title: 'You can change the url too!',
      color: '#333',
      file: [{
        name: 'main.js',
        content: ''
      }]
    });

    module.addSignals({
      colorChanged,
      redirectRoot,
      randomColorClicked,
      testClicked
    });

  };
}
