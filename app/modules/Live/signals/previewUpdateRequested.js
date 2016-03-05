import set from 'cerebral-addons/set';
import when from 'cerebral-addons/when';

export default [
  when('state:/live.hasJoined'), {
    isTrue: [
      set('state:/bin.logs', [])
    ],
    isFalse: []
  },
  set('state:/bin.hasTriedToRun', false),
  set('state:/bin.isRunning', false),
  set('state:/bin.hasChangedPackages', false),
  set('state:/bin.isLoadingBin', false),
  set('state:/bin.showLoadingBin', false)
];
