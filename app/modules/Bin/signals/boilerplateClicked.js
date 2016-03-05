import set from 'cerebral-addons/set';
import hidePopups from '../factories/hidePopups';
import runClicked from './runClicked';
import getBoilerplate from '../actions/getBoilerplate';
import setBoilerplate from '../actions/setBoilerplate';
import showSnackbar from '../factories/showSnackbar';

export default [
  set('state:/bin.hasChangedPackages', true),
  ...hidePopups,
  getBoilerplate, {
    success: [
      set('state:/bin.forceUpdateCode', true),
      setBoilerplate,
      ...runClicked
    ],
    error: [
      showSnackbar('Could not load boilerplate, sorry')
    ]
  }
];
