import setWelcomeBin from '../actions/setWelcomeBin';
import set from 'cerebral-addons/set';
import runBin from '../factories/runBin';

export default [
  setWelcomeBin,
  set('state:/bin.showWelcome', false),
  ...runBin
]
