import set from 'cerebral-addons/set';
import updateClientsPreview from '../../Live/factories/updateClientsPreview';

export default [
  set('state:/bin.isRunning', false),
  ...updateClientsPreview
];
