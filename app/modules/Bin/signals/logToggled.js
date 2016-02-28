import toggle from 'cerebral-addons/toggle';
import set from 'cerebral-addons/set';

export default [
  toggle('state:/bin.showLog'),
  set('state:/bin.shouldCheckLog', false)
];
