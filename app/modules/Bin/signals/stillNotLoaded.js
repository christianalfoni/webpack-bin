import set from 'cerebral-addons/set';
import showSnackbar from '../factories/showSnackbar';

export default [
  set('state:/bin.isLoadingLong', true),
  showSnackbar('You are probably the first one to ever load this combination of packages, hold on please...', true)
]
