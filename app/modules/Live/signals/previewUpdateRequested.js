import set from 'cerebral-addons/set';
import canControlBin from '../actions/canControlBin';

export default [
  canControlBin, {
    true: [],
    false: [
      set('state:/bin.logs', [])
    ]
  },
  set('state:/bin.hasTriedToRun', false),
  set('state:/bin.isRunning', false),
  set('state:/bin.hasChangedPackages', false),
  set('state:/bin.isLoadingBin', false),
  set('state:/bin.showLoadingBin', false)
];
