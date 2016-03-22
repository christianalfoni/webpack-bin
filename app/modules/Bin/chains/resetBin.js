import set from 'cerebral-addons/set';

export default [
  set('state:/bin.logs', []),
  set('state:/bin.changedFiles', []),
  set('state:/bin.selectedLogPath', []),
  set('state:/bin.hasTriedToRun', false),
  set('state:/bin.isRunning', false),
  set('state:/bin.isLoadingBin', false),
  set('state:/bin.showLoadingBin', false),
  set('state:/bin.forceUpdateCode', false)
];
