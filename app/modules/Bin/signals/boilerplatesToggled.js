import when from 'cerebral-addons/when';
import toggle from 'cerebral-addons/toggle';
import hidePopups from '../factories/hidePopups';

export default [
  when('state:/bin.showBoilerplatesSelector'), {
    isTrue: [
      ...hidePopups
    ],
    isFalse: [
      ...hidePopups,
      toggle('state:/bin.showBoilerplatesSelector')
    ]
  }
];
