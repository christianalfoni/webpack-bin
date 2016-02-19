import httpGet from 'cerebral-module-http/get';
import copy from 'cerebral-addons/copy';

export default [
  httpGet('/api/randomcolor'), {
    success: [
      copy('input:/result.color', 'state:/example.color')
    ],
    error: []
  }
];
