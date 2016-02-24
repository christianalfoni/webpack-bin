import testClicked from './signals/testClicked';
import fileClicked from './signals/fileClicked';
import codeChanged from './signals/codeChanged';
import mounted from './signals/mounted';
import linted from './signals/linted';
import saveShortcutPressed from './signals/saveShortcutPressed';
import iframeLoaded from './signals/iframeLoaded';
import addFileAborted from './signals/addFileAborted';
import addFileClicked from './signals/addFileClicked';
import addFileNameUpdated from './signals/addFileNameUpdated';
import addFileSubmitted from './signals/addFileSubmitted';
import togglePackage from './signals/togglePackage';
import toggleShowPackagesSelector from './signals/toggleShowPackagesSelector';
import appClicked from './signals/appClicked';
import toggleShowInfo from './signals/toggleShowInfo';

import hideSnackbar from './actions/hideSnackbar.js';

export default (options = {}) => {
  return (module, controller) => {

    module.addState({
      snackbar: {
        text: '',
        show: false
      },
      url: null,
      hasInitialized: false,
      hasSaved: false,
      isLinting: false,
      lastLintedIndex: 0,
      isValid: true,
      isLoading: false,
      showAddFileInput: false,
      newFileName: '',
      selectedFileIndex: 0,
      showInfo: false,
      showPackagesSelector: false,
      packages: {},
      files: [{
        name: 'main.js',
        content: ''
      }]
    });

    module.addSignals({
      snackbarTimedOut: [hideSnackbar],
      codeChanged,
      testClicked,
      fileClicked,
      mounted,
      linted,
      saveShortcutPressed,
      iframeLoaded,
      addFileAborted,
      addFileClicked,
      addFileNameUpdated,
      addFileSubmitted,
      togglePackage,
      toggleShowPackagesSelector,
      appClicked,
      toggleShowInfo
    });

  };
}
