import preventIfLive from '../Live/factories/preventIfLive';
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
import fileDeleteClicked from './signals/fileDeleteClicked';
import fileDeleted from './signals/fileDeleted';
import fileDeleteAborted from './signals/fileDeleteAborted';
import hideSnackbar from './actions/hideSnackbar.js';
import logValueToggled from './signals/logValueToggled';
import logPathSelected from './signals/logPathSelected';
import welcomeBinClicked from './signals/welcomeBinClicked';
import emptyBinClicked from './signals/emptyBinClicked';
import toggleFullLog from './signals/toggleFullLog';
import entryToggled from './signals/entryToggled';
import iframeLoading from './signals/iframeLoading';

export default (options = {}) => {
  return (module, controller) => {

    module.addState({
      isInitialized: false,
      showWelcome: !Boolean(localStorage && localStorage.getItem('hasVisited')),
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
      isEntry: false,
      isLoadingBin: false,
      showBinLoader: false,
      logs: [],
      selectedLogPath: [],
      shouldCheckLog: false,
      isLoadingIframe: false,

      shouldLint: true,
      isLinting: false,
      lastLintedFileIndex: 0,
      isValid: true,
      isRunning: false,

      showAddFileInput: false,
      newFileName: '',
      selectedFileIndex: -1,
      showInfo: false,
      showPackagesSelector: false,
      showBoilerplatesSelector: false,
      boilerplates: {
        'react': 'React',
        'cerebral': 'Cerebral',
        'redux': 'Redux',
        'cycle': 'Cycle JS',
        'vue': 'Vue JS',
        'angular': 'Angular',
        'angular2': 'Angular2'
      },
      showLog: false,
      showFullLog: true,
      currentLoader: 'babel',
      forceUpdateCode: false,
      vimMode: false,
      highlightCreateIssue: false,
      changedFiles: [],
      fileToDeleteIndex: 0,
      showDeleteFileModal: false,
      isFetchingVendorsBundle: false
    });

    module.addSignals({
      snackbarTimedOut: preventIfLive([hideSnackbar]),
      codeChanged: preventIfLive(codeChanged),
      runClicked: preventIfLive(saveShortcutPressed),
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
      fileDeleteClicked: preventIfLive(fileDeleteClicked),
      logValueToggled: preventIfLive(logValueToggled),
      logPathSelected: preventIfLive(logPathSelected),
      logReceived: preventIfLive(logReceived),
      toggleFullLog: preventIfLive(toggleFullLog),
      entryToggled: preventIfLive(entryToggled),
      addFileAborted: preventIfLive(addFileAborted),
      addFileNameUpdated: preventIfLive(addFileNameUpdated),
      addFileSubmitted: preventIfLive(addFileSubmitted),
      fileDeleted: preventIfLive(fileDeleted),
      fileDeleteAborted: preventIfLive(fileDeleteAborted),
      opened,
      vimModeClicked,
      linterRequested,
      linterLoaded,
      rootRouted,
      linted,
      iframeLoaded,
      iframeLoading,
      welcomeBinClicked,
      emptyBinClicked
    });

  };
}
