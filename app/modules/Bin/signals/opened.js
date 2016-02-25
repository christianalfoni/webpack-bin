import set from 'cerebral-addons/set';
import copy from 'cerebral-addons/copy';
import httpGet from 'cerebral-module-http/get';
import showSnackbar from '../factories/showSnackbar';
import hideSnackbar from '../actions/hideSnackbar';
import isNewBin from '../actions/isNewBin';
import runClicked from './runClicked';

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
          showSnackbar('Sorry, but this WebpackBin does not exist?', true)
        ]
      },
      set('state:/bin.isLoadingBin', false),
      ...runClicked
    ],
    false: [
      ...runClicked
    ]
  }
];
