import set from 'cerebral-addons/set';
import loadBoilerplate from '../actions/loadBoilerplate';
import hidePopups from '../factories/hidePopups';
import runClicked from './runClicked';

export default [
  set('state:/bin.forceUpdateCode', true),
  loadBoilerplate,
  ...hidePopups,
  ...runClicked
];
