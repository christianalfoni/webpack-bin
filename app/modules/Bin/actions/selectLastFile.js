function selectLastFile({state}) {
  const lastFile = state.get('bin.files').length - 1;
  state.set('bin.selectedFileIndex', lastFile);
}

export default selectLastFile;
