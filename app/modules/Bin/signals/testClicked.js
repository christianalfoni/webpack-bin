import set from 'cerebral-addons/set';
import postCode from '../actions/postCode';
import httpGet from 'cerebral-module-http/get';
import showSnackbar from '../factories/showSnackbar';
import hideSnackbar from '../actions/hideSnackbar';

export default [
  showSnackbar('Loading sandbox...', true),
  set('state:/bin.isLoading', true),
  postCode, {
    success: [],
    error: []
  },
  function action({state}) {
    state.set('bin.url', String(Date.now()));
  },
  set('state:/bin.hasSaved', false),
  hideSnackbar
];
