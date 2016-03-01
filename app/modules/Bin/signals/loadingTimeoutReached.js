import when from 'cerebral-addons/when';
import set from 'cerebral-addons/set';
import showSnackbar from '../factories/showSnackbar';

export default [
  when('state:/bin.hasChangedPackages'), {
    isTrue: [
      showSnackbar('You changed packages and might be the first to combine them this way, hold on please...', true),
    ],
    isFalse: []
  },
  set('state:/bin.showLoadingBin', true)
];
