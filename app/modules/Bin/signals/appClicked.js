import set from 'cerebral-addons/set';
import hidePopups from '../factories/hidePopups';

export default [
  ...hidePopups,
  set('state:/bin.showAddFileInput', false)
];
