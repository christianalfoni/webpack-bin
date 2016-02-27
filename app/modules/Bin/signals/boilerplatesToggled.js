import toggle from 'cerebral-addons/toggle';
import hidePopups from '../factories/hidePopups';

export default [
  ...hidePopups,
  toggle('state:/bin.showBoilerplatesSelector')
];
