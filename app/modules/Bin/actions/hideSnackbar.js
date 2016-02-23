function hideSnackbar({state}) {
  state.merge('bin.snackbar', {
    text: '',
    show: false
  });
}

export default hideSnackbar;
