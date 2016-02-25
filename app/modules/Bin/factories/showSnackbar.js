function showSnackbar(text, persist) {
  function action({state}) {
    if (state.get('bin.snackbar.show') && state.get('bin.snackbar.persist')) {
      return;
    }
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
