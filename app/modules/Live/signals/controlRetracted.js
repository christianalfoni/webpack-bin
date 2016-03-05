import retractControl from '../actions/retractControl';
import showSnackbar from '../../Bin/factories/showSnackbar';

export default [
  retractControl,
  showSnackbar('Owner took back control')
];
