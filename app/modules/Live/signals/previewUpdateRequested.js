import set from 'cerebral-addons/set';
import when from 'cerebral-addons/when';

export default [
  set('state:/bin.hasTriedToRun', false),
  set('state:/bin.isRunning', false),
  set('state:/bin.isLoadingBin', false),
  set('state:/bin.showLoadingBin', false)
];
