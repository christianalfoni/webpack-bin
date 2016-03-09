import set from 'cerebral-addons/set';
import copy from 'cerebral-addons/copy';
import when from 'cerebral-addons/when';
import postCode from '../actions/postCode';
import httpGet from 'cerebral-module-http/get';
import showSnackbar from './showSnackbar';
import hideSnackbar from '../actions/hideSnackbar';
import redirectToBin from '../actions/redirectToBin';
import gotNewBin from '../actions/gotNewBin';
import requestBinUpdate from '../../Live/actions/requestBinUpdate';

export default [
  set('state:/bin.isRunning', true),
  when('state:/live.hasJoined'), {
    isTrue: [
      requestBinUpdate
    ],
    isFalse: [
      set('state:/bin.isLoadingBin', true),
      postCode, {
        success: [
          gotNewBin, {
            true: [
              copy('input:/result', 'state:/bin.currentBin'),
              showSnackbar('Created your personal bin, have fun!', true),
              redirectToBin
            ],
            false: [
              hideSnackbar
            ]
          }
        ],
        error: [
          set('state:/bin.showInfo', true),
          set('state:/bin.highlightCreateIssue', true),
          showSnackbar('An error occured, please report what you tried to do!', true)
        ]
      },
      set('state:/bin.logs', []),
      set('state:/bin.selectedLogPath', []),
      set('state:/bin.hasTriedToRun', false),
      set('state:/bin.isRunning', false),
      set('state:/bin.hasChangedPackages', false),
      set('state:/bin.isLoadingBin', false),
      set('state:/bin.showLoadingBin', false),
      set('state:/bin.forceUpdateCode', false)
    ]
  }
];
