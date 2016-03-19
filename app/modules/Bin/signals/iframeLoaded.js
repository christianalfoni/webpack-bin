import set from 'cerebral-addons/set';
import when from 'cerebral-addons/when';
import sendPreviewUpdate from '../../Live/actions/sendPreviewUpdate';

export default [
  set('state:/bin.isLoadingIframe', false),
  set('state:/bin.isRunning', false),
  when('state:/live.connected'), {
    isTrue: [sendPreviewUpdate],
    isFalse: []
  }
];
