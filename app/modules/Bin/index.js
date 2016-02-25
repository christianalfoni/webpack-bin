import runClicked from './signals/runClicked';
import fileClicked from './signals/fileClicked';
import codeChanged from './signals/codeChanged';
import rootRouted from './signals/rootRouted';
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
import opened from './signals/opened';

import hideSnackbar from './actions/hideSnackbar.js';

export default (options = {}) => {
  return (module, controller) => {

    module.addState({
      snackbar: {
        text: '',
        show: false
      },
      currentBin: {
        files: [{
          name: 'main.js',
          content: ''
        }],
        packages: {}
      },
      isLoadingBin: false,

      hasTriedToRun: false,
      isLinting: false,
      lastLintedFileIndex: 0,
      isValid: true,
      isRunning: false,
      hasChangedPackages: false,

      showAddFileInput: false,
      newFileName: '',
      selectedFileIndex: 0,
      showInfo: false,
      showPackagesSelector: false
    });

    module.addSignals({
      snackbarTimedOut: [hideSnackbar],
      codeChanged,
      runClicked,
      fileClicked,
      rootRouted,
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
      toggleShowInfo,
      opened
    });

  };
}
