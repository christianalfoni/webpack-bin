import set from 'cerebral-addons/set';
import postCode from '../actions/postCode';
import httpGet from 'cerebral-module-http/get';

export default [
  set('state:/bin.isLoading', true),
  postCode, {
    success: [],
    error: []
  },
  function action({state}) {
    state.set('bin.url', String(Date.now()));
  },
  set('state:/bin.isLoading', false)
];
