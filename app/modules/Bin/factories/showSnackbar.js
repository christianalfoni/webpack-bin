function showSnackbar(text, persist) {
  function action({state}) {
    state.merge('bin.snackbar', {
      text: text,
      show: true,
      persist: persist || false
    });
  }

  action.displayName = 'showSnackbar';

  return action;
}

export default showSnackbar;
