function changeConfig({input, state}) {
  state.set(`bin.currentBin.loaders${input.loader}.${input.option}`, input.value);
}

export default changeConfig;
