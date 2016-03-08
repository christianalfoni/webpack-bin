import setWelcomeBin from '../actions/setWelcomeBin';
import set from 'cerebral-addons/set';
import runBin from '../factories/runBin';
import setVisited from '../actions/setVisited';

export default [
  setVisited,
  setWelcomeBin,
  set('state:/bin.showWelcome', false),
  ...runBin
]
