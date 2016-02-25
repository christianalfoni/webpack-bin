function changeCode({input, state}) {
  const selectedFileIndex = state.get('bin.selectedFileIndex');
  state.set(`bin.currentBin.files.${selectedFileIndex}.content`, input.code);
}

export default changeCode;
