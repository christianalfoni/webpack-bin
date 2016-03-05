import set from 'cerebral-addons/set';
import copy from 'cerebral-addons/copy';
import when from 'cerebral-addons/when';
import httpGet from 'cerebral-module-http/get';
import showSnackbar from '../factories/showSnackbar';
import hideSnackbar from '../actions/hideSnackbar';
import isNewBin from '../actions/isNewBin';
import runClicked from './runClicked';
import connectToLiveBin from '../actions/connectToLiveBin';

export default [
  isNewBin, {
    true: [
      set('state:/bin.isLoadingBin', true),
      showSnackbar('Loading WebpackBin...'),
      httpGet(['/api/bins/', 'input:/id']), {
        success: [
          copy('input:/result', 'state:/bin.currentBin'),
          showSnackbar('WebpackBin is loaded!')
        ],
        error: [
          showSnackbar('Sorry, but this WebpackBin does not exist? Still Alpha though, probably a reset!', true)
        ]
      },
      set('state:/bin.isLoadingBin', false),
      set('state:/bin.showLoadingBin', false),
      set('state:/bin.selectedFileIndex', 0),
      when('state:/bin.currentBin.isLive'), {
        isTrue: [
          connectToLiveBin
        ],
        isFalse: [
          ...runClicked
        ]
      }
    ],
    false: [
      set('state:/bin.selectedFileIndex', 0),
      ...runClicked
    ]
  }
];
