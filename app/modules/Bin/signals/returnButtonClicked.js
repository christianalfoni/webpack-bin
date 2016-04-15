import copy from 'cerebral-addons/copy';
import returnToList from '../actions/returnToList';
export default [
  copy('state:/bin.jwt', 'output:/jwt'),
  returnToList
];