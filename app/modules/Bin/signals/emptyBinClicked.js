import setEmptyBin from '../actions/setEmptyBin';
import set from 'cerebral-addons/set';

export default [
  setEmptyBin,
  set('state:/bin.showWelcome', false)
]
