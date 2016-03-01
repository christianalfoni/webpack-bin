import set from 'cerebral-addons/set';
import hidePopups from '../factories/hidePopups';
import runClicked from './runClicked';
import redirectToBoilerplate from '../actions/redirectToBoilerplate';

export default [
  set('state:/bin.forceUpdateCode', true),
  set('state:/bin.hasChangedPackages', true),
  ...hidePopups,
  redirectToBoilerplate
];
