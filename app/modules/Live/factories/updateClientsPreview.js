import canControlBin from '../actions/canControlBin';
import sendPreviewUpdate from '../actions/sendPreviewUpdate';

export default [
  canControlBin, {
    true: [
      sendPreviewUpdate
    ],
    false: []
  }
]
