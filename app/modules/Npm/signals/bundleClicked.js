import copy from 'cerebral-addons/copy';
import set from 'cerebral-addons/set';

export default [
  copy('input:/packages', 'state:/bin.currentBin.packages')
];
