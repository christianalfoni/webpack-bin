import removeUser from '../actions/removeUser';
import showSnackbar from '../../Bin/factories/showSnackbar';

export default [
  removeUser,
  showSnackbar('A user left the session')
];
