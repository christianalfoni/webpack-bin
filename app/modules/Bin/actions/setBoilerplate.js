function setBoilerplate({input, state}) {
  state.merge('bin.currentBin', {
    files: input.result.files,
    packages: input.result.packages,
    loaders: input.result.loaders
  });
}

export default setBoilerplate;
