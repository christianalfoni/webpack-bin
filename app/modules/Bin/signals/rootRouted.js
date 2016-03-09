import set from 'cerebral-addons/set';
import setEmptyBin from '../actions/setEmptyBin';

export default [
  set('state:/bin.isInitialized', true),
  setEmptyBin
];
