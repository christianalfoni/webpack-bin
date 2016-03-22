import toggle from 'cerebral-addons/toggle';
import set from 'cerebral-addons/set';
import when from 'cerebral-addons/when';

export default [
  toggle('state:/bin.showLog'),
  set('state:/bin.shouldCheckLog', false),
  when('state:/bin.showLog'), {
    isTrue: [
      set('state:/mobile.showPreview', true)
    ],
    isFalse: []
  }
];
