import packageNameQuerySubmitted from './signals/packageNameQuerySubmitted';
import packageNameQueryChanged from './signals/packageNameQueryChanged';
import quickstartClicked from './signals/quickstartClicked';

export default () => {
  return (module) => {

    module.addState({
      isGettingPackage: false,
      package: null,
      packageNameQuery: '',
      packageError: null
    });

    module.addSignals({
      packageNameQuerySubmitted,
      quickstartClicked,
      packageNameQueryChanged: {
        chain: packageNameQueryChanged,
        immediate: true
      }
    });

  };
}
