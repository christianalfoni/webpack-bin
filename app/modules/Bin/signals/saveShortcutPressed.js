import when from 'cerebral-addons/when';
import set from 'cerebral-addons/set';
import runBin from '../factories/runBin';
import hasValidLinting from '../actions/hasValidLinting';
import canControlBin from '../../Live/actions/canControlBin';

export default [
  when('state:/bin.isRunning'), {
    isTrue: [],
    isFalse: [
      set('state:/bin.logs', []),
      set('state:/bin.selectedLogPath', []),
      when('state:/live.hasJoined'), {
        isTrue: [
          set('state:/bin.isRunning', true)
        ],
        isFalse: [
          ...runBin
        ]
      }
    ]
  }
];
