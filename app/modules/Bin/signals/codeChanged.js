import set from 'cerebral-addons/set';
import changeCode from '../actions/changeCode';

export default [
  set('state:/bin.hasSaved', false),
  set('state:/bin.isLinting', true),
  changeCode
];
