import showSnackbar from '../../Bin/factories/showSnackbar';
import set from 'cerebral-addons/set';
import copy from 'cerebral-addons/copy';

export default [
  showSnackbar('Joined a LIVE session'),
  set('state:/live.hasJoined', true),
  set('state:/live.connected', true),
  copy('input:/name', 'state:/live.userName')
];
