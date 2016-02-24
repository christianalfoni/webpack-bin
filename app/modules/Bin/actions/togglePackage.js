function togglePackage({input, state}) {
  const packages = state.get('bin.packages');
  if (packages[input.name]) {
    state.unset(`bin.packages.${input.name}`);
  } else {
    state.set(`bin.packages.${input.name}`, input.version);
  }
}

export default togglePackage;
