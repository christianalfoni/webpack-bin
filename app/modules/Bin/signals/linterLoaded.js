import showSnackbar from '../factories/showSnackbar';
import when from 'cerebral-addons/when';

export default [
  when('input:/noLint'), {
    isTrue: [
      showSnackbar('Mode loaded! No linter though...')
    ],
    isFalse: [
      showSnackbar('Linter and mode loaded!')
    ]
  }
];
