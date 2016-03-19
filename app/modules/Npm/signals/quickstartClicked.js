import set from 'cerebral-addons/set';
import loadQuickstart from '../actions/loadQuickstart';
import runBin from '../../Bin/factories/runBin';

export default [
  loadQuickstart,
  set('state:/bin.selectedFileIndex', 0),
  set('state:/bin.forceUpdateCode', true),
  set('state:/bin.showPackagesSelector', false),
  ...runBin
];
