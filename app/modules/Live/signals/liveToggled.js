import when from 'cerebral-addons/when';
import set from 'cerebral-addons/set';
import showSnackbar from '../../Bin/factories/showSnackbar';
import runClicked from '../../Bin/signals/runClicked';
import connect from '../actions/connect';

export default [
  when('state:/bin.currentBin.isLive'), {
    isTrue: [
      set('state:/bin.currentBin.isLive', false)
    ],
    isFalse: [
      set('state:/bin.currentBin.isLive', true),
      showSnackbar('Anyone entering your bin will see live code updates!', true),
      ...runClicked,
      connect, {
        success: [
          set('state:/live.connected', true)
        ],
        error: []
      }
    ]
  }
];
