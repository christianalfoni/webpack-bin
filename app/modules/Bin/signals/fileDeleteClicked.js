import set from 'cerebral-addons/set';
import copy from 'cerebral-addons/copy';

export default [
  set('state:/bin.showDeleteFileModal', true),
  copy('input:/index', 'state:/bin.fileToDeleteIndex')
];
