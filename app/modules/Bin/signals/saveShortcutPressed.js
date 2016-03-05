import when from 'cerebral-addons/when';
import set from 'cerebral-addons/set';
import runClicked from './runClicked';
import hasValidLinting from '../actions/hasValidLinting';
import canControlBin from '../../Live/actions/canControlBin';

export default [
  when('state:/bin.isRunning'), {
    isTrue: [],
    isFalse: [
      set('state:/bin.logs', []),
      set('state:/bin.selectedLogPath', []),
      canControlBin, {
        true: [
          hasValidLinting, {
            true: [
              ...runClicked
            ],
            false: [
              set('state:/bin.hasTriedToRun', true)
            ]
          }

        ],
        false: [
          set('state:/bin.isRunning', true)
        ]
      }
    ]
  }
];
