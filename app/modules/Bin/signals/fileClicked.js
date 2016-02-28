import copy from 'cerebral-addons/copy';
import shouldLint from '../actions/shouldLint';
import set from 'cerebral-addons/set';

export default [
  copy('input:/index', 'state:/bin.selectedFileIndex'),
  set('state:/bin.shouldSave', false),
  shouldLint
];
