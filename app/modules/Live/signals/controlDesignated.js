import takeControl from '../actions/takeControl';
import showSnackbar from '../../Bin/factories/showSnackbar';

export default [
  takeControl,
  showSnackbar('You now have control of the bin')
];
