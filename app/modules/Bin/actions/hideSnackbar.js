function hideSnackbar({state}) {
  state.merge('bin.snackbar', {
    show: false
  });
}

export default hideSnackbar;
