import set from 'cerebral-addons/set';
import when from 'cerebral-addons/when';
import hidePopups from '../factories/hidePopups';
import runClicked from './runClicked';
import getBoilerplate from '../actions/getBoilerplate';
import setBoilerplate from '../actions/setBoilerplate';
import showSnackbar from '../factories/showSnackbar';
import canControlBin from '../../Live/actions/canControlBin';

export default [
  set('state:/bin.hasChangedPackages', true),
  ...hidePopups,
  canControlBin, {
    true: [
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
    ],
    false: []
  }
];
