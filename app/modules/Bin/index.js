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
import packageToggled from './signals/packageToggled';
import packagesToggled from './signals/packagesToggled';
import appClicked from './signals/appClicked';
import infoToggled from './signals/infoToggled';
import opened from './signals/opened';
import loadersToggled from './signals/loadersToggled';
import loaderClicked from './signals/loaderClicked';
import loaderToggled from './signals/loaderToggled';
import configToggled from './signals/configToggled';
import boilerplatesToggled from './signals/boilerplatesToggled';
import boilerplateClicked from './signals/boilerplateClicked';
import linterLoaded from './signals/linterLoaded';
import linterRequested from './signals/linterRequested';
import vimModeClicked from './signals/vimModeClicked';

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
        packages: {},
        loaders: {}
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
      showPackagesSelector: false,
      showLoadersSelector: false,
      showBoilerplatesSelector: false,
      currentLoader: 'babel',
      forceUpdateCode: false,
      vimMode: false
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
      packageToggled,
      packagesToggled,
      appClicked,
      infoToggled,
      opened,
      loadersToggled,
      loaderClicked,
      loaderToggled,
      configToggled,
      boilerplatesToggled,
      boilerplateClicked,
      linterRequested,
      linterLoaded,
      vimModeClicked
    });

  };
}
