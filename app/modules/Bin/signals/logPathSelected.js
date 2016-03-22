import copy from 'cerebral-addons/copy';
import set from 'cerebral-addons/set';

export default [
  copy('input:/path', 'state:/bin.selectedLogPath'),
  set('state:/mobile.showPreview', true)
];
