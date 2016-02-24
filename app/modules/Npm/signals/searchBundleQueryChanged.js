import copy from 'cerebral-addons/copy';
import when from 'cerebral-addons/when';
import set from 'cerebral-addons/set';
import debounce from 'cerebral-addons/debounce';
import showSnackbar from '../../Bin/factories/showSnackbar';
import searchBundles from '../actions/searchBundles';

export default [
  copy('input:/query', 'state:/npm.searchBundleQuery'),
  when('input:/query'), {
    isTrue: [
      debounce(1000, [
        set('state:/npm.isSearchingBundles', true),
        searchBundles, {
          success: [
            copy('input:/result', 'state:/npm.bundles')
          ],
          error: [
            showSnackbar('Error searching bundles...')
          ]
        },
        set('state:/npm.isSearchingBundles', false)
      ], {immediate: false})
    ],
    isFalse: []
  }
];
