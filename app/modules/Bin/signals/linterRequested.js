import showSnackbar from '../factories/showSnackbar';
import when from 'cerebral-addons/when';

export default [
  when('input:/noLint'), {
    isTrue: [
      showSnackbar('Loading mode...')
    ],
    isFalse: [
      showSnackbar('Loading linter and mode...')
    ]
  }
];
