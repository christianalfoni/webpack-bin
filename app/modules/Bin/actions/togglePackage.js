function togglePackage({input, state}) {
  const packages = state.get('bin.packages');
  if (packages[input.package.name] && packages[input.package.name] === input.package.version) {
    state.unset(`bin.packages.${input.package.name}`);
  } else {
    state.set(`bin.packages.${input.package.name}`, input.package.version);
  }
}

export default togglePackage;
