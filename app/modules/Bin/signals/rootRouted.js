import httpPost from 'cerebral-module-http/post';
import copy from 'cerebral-addons/copy';
import set from 'cerebral-addons/set';
import showSnackbar from '../factories/showSnackbar';
import redirectToBin from '../actions/redirectToBin';
import createBin from '../actions/createBin';

export default [
  set('state:/bin.isLoadingBin'),
  showSnackbar('Creating a WebpackBin for you'),
  createBin, {
    success: [
      copy('input:/result', 'state:/bin.currentBin')
    ],
    error: [
      showSnackbar('Could not create bin, sorry...')
    ]
  },
  set('state:/bin.isLoadingBin', false),
  showSnackbar('WebpackBin created!'),
  redirectToBin
];
