function toggleConfig({input, state}) {
  const currentLoader = state.get('bin.currentLoader');
  const currentConfig = state.get(`bin.currentBin.loaders.${currentLoader}`);

  if (currentConfig[input.name]) {
    state.set(`bin.currentBin.loaders.${currentLoader}.${input.name}`, false);
  } else {
    if (currentLoader === 'babel' && input.name === 'jsx') {
      state.set(`bin.currentBin.loaders.${currentLoader}.${input.name}`, {
        pragma: 'h'
      });
    } else {
      state.set(`bin.currentBin.loaders.${currentLoader}.${input.name}`, true);
    }
  }
}

export default toggleConfig;
