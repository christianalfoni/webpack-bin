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
      set('state:/bin.changedFiles', []),
      when('state:/live.hasJoined'), {
        isTrue: [
          set('state:/mobile.showPreview', true),
          set('state:/bin.isRunning', true)
        ],
        isFalse: [
          ...runBin
        ]
      }
    ]
  }
];
