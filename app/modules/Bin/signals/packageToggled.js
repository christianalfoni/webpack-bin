import togglePackage from '../actions/togglePackage';
import set from 'cerebral-addons/set';

export default [
  togglePackage,
  set('state:/bin.hasChangedPackages', true)
];
