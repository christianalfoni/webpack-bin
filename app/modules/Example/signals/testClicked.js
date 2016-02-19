import postCode from '../actions/postCode';
import httpGet from 'cerebral-module-http/get';

export default [
  postCode, {
    success: [
      function log({input}) {
        console.log(input.result);
      }
    ],
    error: [

    ]
  },
  function action({state}) {
    state.set('url', Date.now());
  }
];
