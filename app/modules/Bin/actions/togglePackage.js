function togglePackage({input, state}) {
  const packages = state.get('bin.currentBin.packages');
  if (packages[input.name]) {
    state.unset(`bin.currentBin.packages.${input.name}`);
  } else {
    state.set(`bin.currentBin.packages.${input.name}`, input.version);
  }
}

export default togglePackage;
