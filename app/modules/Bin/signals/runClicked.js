import set from 'cerebral-addons/set';
import copy from 'cerebral-addons/copy';
import when from 'cerebral-addons/when';
import postCode from '../actions/postCode';
import httpGet from 'cerebral-module-http/get';
import showSnackbar from '../factories/showSnackbar';
import hideSnackbar from '../actions/hideSnackbar';
import redirectToBin from '../actions/redirectToBin';
import gotNewBin from '../actions/gotNewBin';

export default [
  set('state:/bin.isRunning', true),
  set('state:/bin.isLoadingBin', true),
  postCode, {
    success: [
      gotNewBin, {
        true: [
          copy('input:/result', 'state:/bin.currentBin'),
          redirectToBin,
          showSnackbar('Created your personal version of this WebpackBin, have fun!', true)
        ],
        false: [
          hideSnackbar
        ]
      }
    ],
    error: []
  },
  set('state:/bin.logs', []),
  function action({state}) {
    state.set('bin.url', String(Date.now()));
  },
  set('state:/bin.hasTriedToRun', false),
  set('state:/bin.isRunning', false),
  set('state:/bin.hasChangedPackages', false),
  set('state:/bin.isLoadingBin', false),
  set('state:/bin.showLoadingBin', false)
];
