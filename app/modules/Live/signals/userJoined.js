import addUser from '../actions/addUser';
import showSnackbar from '../../Bin/factories/showSnackbar';
import sendSnapshot from '../actions/sendSnapshot';

export default [
  sendSnapshot,
  addUser,
  showSnackbar('A user joined the session')
];
