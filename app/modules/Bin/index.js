import preventIfLive from '../Live/factories/preventIfLive';
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
import loaderClicked from './signals/loaderClicked';
import loaderToggled from './signals/loaderToggled';
import configToggled from './signals/configToggled';
import boilerplatesToggled from './signals/boilerplatesToggled';
import boilerplateClicked from './signals/boilerplateClicked';
import linterLoaded from './signals/linterLoaded';
import linterRequested from './signals/linterRequested';
import logToggled from './signals/logToggled';
import logReceived from './signals/logReceived';
import vimModeClicked from './signals/vimModeClicked';
import fileDeleted from './signals/fileDeleted';
import loadingTimeoutReached from './signals/loadingTimeoutReached';
import hideSnackbar from './actions/hideSnackbar.js';
import logValueToggled from './signals/logValueToggled';
import logPathSelected from './signals/logPathSelected';

export default (options = {}) => {
  return (module, controller) => {

    module.addState({
      snackbar: {
        text: '',
        show: false
      },
      currentBin: {
        files: [],
        packages: {},
        loaders: {},
        isLive: false
      },
      isLoadingBin: false,
      showBinLoader: false,
      logs: [],
      selectedLogPath: [],
      shouldCheckLog: false,

      hasTriedToRun: false,
      shouldLint: true,
      isLinting: false,
      lastLintedFileIndex: 0,
      isValid: true,
      isRunning: false,
      hasChangedPackages: false,

      showAddFileInput: false,
      newFileName: '',
      selectedFileIndex: -1,
      showInfo: false,
      showPackagesSelector: false,
      showBoilerplatesSelector: false,
      showLog: false,
      currentLoader: 'babel',
      forceUpdateCode: false,
      vimMode: false
    });

    module.addSignals({
      snackbarTimedOut: preventIfLive([hideSnackbar]),
      codeChanged: preventIfLive(codeChanged),
      runClicked: preventIfLive(runClicked),
      fileClicked: preventIfLive(fileClicked),
      saveShortcutPressed: preventIfLive(saveShortcutPressed),
      addFileClicked: preventIfLive(addFileClicked),
      packageToggled: preventIfLive(packageToggled),
      packagesToggled: preventIfLive(packagesToggled),
      appClicked: preventIfLive(appClicked),
      infoToggled: preventIfLive(infoToggled),
      loaderClicked: preventIfLive(loaderClicked),
      loaderToggled: preventIfLive(loaderToggled),
      configToggled: preventIfLive(configToggled),
      boilerplatesToggled: preventIfLive(boilerplatesToggled),
      boilerplateClicked: preventIfLive(boilerplateClicked),
      logToggled: preventIfLive(logToggled),
      fileDeleted: preventIfLive(fileDeleted),
      logValueToggled: preventIfLive(logValueToggled),
      logPathSelected: preventIfLive(logPathSelected),
      logReceived: preventIfLive(logReceived),
      opened,
      vimModeClicked,
      linterRequested,
      linterLoaded,
      loadingTimeoutReached,
      rootRouted,
      linted,
      iframeLoaded,
      addFileAborted,
      addFileNameUpdated,
      addFileSubmitted,
    });

  };
}
