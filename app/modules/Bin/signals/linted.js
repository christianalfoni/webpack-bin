import set from 'cerebral-addons/set';
import copy from 'cerebral-addons/copy';
import runBin from '../factories/runBin';

export default [
  set('state:/bin.isLinting', false),
  copy('input:/isValid', 'state:/bin.isValid'),
  copy('state:/bin.selectedFileIndex', 'state:/bin.lastLintedFileIndex')
]
