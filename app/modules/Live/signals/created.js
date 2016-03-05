import showSnackbar from '../../Bin/factories/showSnackbar';
import set from 'cerebral-addons/set';

export default [
  set('state:/live.connected', true),
  showSnackbar('Created live session!')
];
