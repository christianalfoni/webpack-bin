import searchBundleQueryChanged from './signals/searchBundleQueryChanged';
import packageNameQuerySubmitted from './signals/packageNameQuerySubmitted';
import packageNameQueryChanged from './signals/packageNameQueryChanged';
import bundleClicked from './signals/bundleClicked';

export default () => {
  return (module) => {

    module.addState({
      isSearchingBundles: false,
      isGettingPackage: false,
      bundles: [],
      package: null,
      searchBundleQuery: '',
      packageNameQuery: '',
      packageError: null
    });

    module.addSignals({
      packageNameQuerySubmitted,
      bundleClicked,
      searchBundleQueryChanged: {
        chain: searchBundleQueryChanged,
        sync: true
      },
      packageNameQueryChanged: {
        chain: packageNameQueryChanged,
        sync: true
      }
    });

  };
}
