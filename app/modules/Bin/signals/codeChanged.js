import set from 'cerebral-addons/set';
import changeCode from '../actions/changeCode';
import isLintable from '../actions/isLintable';

export default [
  set('state:/bin.hasSaved', false),
  isLintable, {
    true: [
        set('state:/bin.isLinting', true),
    ],
    false: []
  },
  changeCode
];
