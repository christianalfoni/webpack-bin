import set from 'cerebral-addons/set';
import changeCode from '../actions/changeCode';
import isLintable from '../actions/isLintable';
import setChangedFile from '../actions/setChangedFile';

export default [
  set('state:/bin.hasSaved', false),
  set('state:/bin.forceUpdateCode', false),
  isLintable, {
    true: [
        set('state:/bin.isLinting', true),
    ],
    false: []
  },
  changeCode,
  setChangedFile,
  set('state:/mobile.showPreview', false)
];
