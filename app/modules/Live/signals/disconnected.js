import set from 'cerebral-addons/set';
import showSnackbar from '../../Bin/factories/showSnackbar';

export default [
  set('state:/live.connected', false),
  set('state:/bin.currentBin.isLive', false),
  showSnackbar('You were disconnected!')
];
