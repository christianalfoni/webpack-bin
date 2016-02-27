function toggleConfig({input, state}) {
  const currentLoader = state.get('bin.currentLoader');
  const currentConfig = state.get(`bin.currentBin.loaders.${currentLoader}`);
  if (currentConfig[input.name]) {
    state.set(`bin.currentBin.loaders.${currentLoader}.${input.name}`, false);
  } else {
    state.set(`bin.currentBin.loaders.${currentLoader}.${input.name}`, true);
  }
}

export default toggleConfig;
