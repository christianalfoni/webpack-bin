import addFile from '../actions/addFile';
import setLoadersByFilename from '../actions/setLoadersByFilename';
import addEntryToIndex from '../actions/addEntryToIndex';
import selectLastFile from '../actions/selectLastFile';
import shouldLint from '../actions/shouldLint';
import set from 'cerebral-addons/set';
import when from 'cerebral-addons/when';

export default [
  addFile,
  setLoadersByFilename,
  when('state:/bin.isEntry'), {
    isTrue: [
      addEntryToIndex,
      set('state:/bin.forceUpdateCode', true)
    ],
    isFalse: []
  },
  selectLastFile,
  set('state:/bin.newFileName', ''),
  set('state:/bin.showAddFileInput', false),
  set('state:/bin.isEntry', false),
  shouldLint
];
