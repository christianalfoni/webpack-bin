import when from 'cerebral-addons/when';
import set from 'cerebral-addons/set';
import runClicked from './runClicked';
import hasValidLinting from '../actions/hasValidLinting';

export default [
  when('state:/bin.isRunning'), {
    isTrue: [],
    isFalse: [
      when('state:/live.hasJoined'), {
        isTrue: [
          set('state:/bin.isRunning', true)
        ],
        isFalse: [
          hasValidLinting, {
            true: [
              ...runClicked
            ],
            false: [
              set('state:/bin.hasTriedToRun', true)
            ]
          }
        ]
      }
    ]
  }
];
