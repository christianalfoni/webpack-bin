import copy from 'cerebral-addons/copy';
import returnToList from '../actions/returnToList';
export default [
  copy('state:/bin.jwt', 'output:/jwt'),
  copy('state:/bin.user', 'output:/userId'),
  returnToList
];
