import addFile from '../actions/addFile';
import selectLastFile from '../actions/selectLastFile';
import shouldLint from '../actions/shouldLint';
import set from 'cerebral-addons/set';

export default [
  addFile,
  selectLastFile,
  set('state:/bin.newFileName', ''),
  set('state:/bin.showAddFileInput', false),
  set('state:/bin.isEntry', false),
  shouldLint
];
