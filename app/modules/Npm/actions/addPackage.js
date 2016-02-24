function addPackage({input, state}) {
  state.set(`bin.packages.${input.result.name}`, input.result.version);
}

export default addPackage;
