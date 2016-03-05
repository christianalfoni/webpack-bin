import mergeSnapshot from '../actions/mergeSnapshot';
import showSnackbar from '../../Bin/factories/showSnackbar';

export default [
  mergeSnapshot,
  showSnackbar('Received snapshot')
];
