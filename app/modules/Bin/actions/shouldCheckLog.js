function shouldCheckLog({input, state}) {
  if (!state.get('bin.showLog') && input.value && input.value.__webpackbin_type_error) {
    state.set('bin.shouldCheckLog', true);
  }
}

export default shouldCheckLog;
