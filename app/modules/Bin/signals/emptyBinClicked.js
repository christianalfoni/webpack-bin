import setEmptyBin from '../actions/setEmptyBin';
import set from 'cerebral-addons/set';
import setVisited from '../actions/setVisited';

export default [
  setVisited,
  setEmptyBin,
  set('state:/bin.showWelcome', false)
]
