function addPackage({input, state}) {
  state.set(`bin.currentBin.packages.${input.result.name}`, input.result.version);
}

export default addPackage;
