import set from 'cerebral-addons/set';
import copy from 'cerebral-addons/copy';
import runClicked from './runClicked';
import shouldSave from '../actions/shouldSave';

export default [
  set('state:/bin.isLinting', false),
  copy('input:/isValid', 'state:/bin.isValid'),
  shouldSave, {
    true: [
      ...runClicked
    ],
    false: [
      set('state:/bin.hasTriedToRun', false)
    ]
  },
  copy('state:/bin.selectedFileIndex', 'state:/bin.lastLintedFileIndex')
]
