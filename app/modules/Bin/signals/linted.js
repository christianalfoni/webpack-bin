import set from 'cerebral-addons/set';
import copy from 'cerebral-addons/copy';
import testClicked from './testClicked';
import shouldSave from '../actions/shouldSave';

export default [
  set('state:/bin.isLinting', false),
  copy('input:/isValid', 'state:/bin.isValid'),
  shouldSave, {
    true: [
      ...testClicked
    ],
    false: [
      set('state:/bin.hasSaved', false)
    ]
  },
  copy('state:/bin.selectedFileIndex', 'state:/bin.lastLintedIndex')
]
