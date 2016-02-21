import when from 'cerebral-addons/when';
import set from 'cerebral-addons/set';
import testClicked from './testClicked';
import hasValidLinting from '../actions/hasValidLinting';

export default [
  when('state:/bin.isLoading'), {
    isTrue: [],
    isFalse: [
      hasValidLinting, {
        true: [
          ...testClicked
        ],
        false: [
          set('state:/bin.hasSaved', true)
        ]
      }    
    ]
  }
];
