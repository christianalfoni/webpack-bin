import when from 'cerebral-addons/when';
import set from 'cerebral-addons/set';
import showSnackbar from '../../Bin/factories/showSnackbar';
import runBin from '../../Bin/factories/runBin';
import connect from '../actions/connect';
import disconnect from '../actions/disconnect';

export default [
  when('state:/bin.currentBin.isLive'), {
    isTrue: [
      set('state:/bin.currentBin.isLive', false),
      disconnect
    ],
    isFalse: [
      set('state:/bin.currentBin.isLive', true),
      showSnackbar('Anyone entering your bin will see live code updates!', true),
      ...runBin,
      connect, {
        success: [
          set('state:/live.connected', true)
        ],
        error: []
      }
    ]
  }
];
