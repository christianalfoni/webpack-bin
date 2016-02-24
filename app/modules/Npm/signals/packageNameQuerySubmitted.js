import httpGet from 'cerebral-module-http/get';
import set from 'cerebral-addons/set';
import getPackage from '../actions/getPackage';
import addPackage from '../actions/addPackage';

export default [
  set('state:/npm.packageError', false),
  set('state:/npm.isGettingPackage', true),
  getPackage, {
    success: [
      addPackage,
      set('state:/npm.packageNameQuery', '')
    ],
    error: [
      set('state:/npm.packageError', true)
    ]
  },
  set('state:/npm.isGettingPackage', false)
];
