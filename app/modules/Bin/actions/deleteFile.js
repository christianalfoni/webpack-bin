function deleteFile({input, state}) {
  const selectedFileIndex = state.get('bin.selectedFileIndex');
  state.splice('bin.currentBin.files', input.index, 1);
  if (!state.get('bin.currentBin.files')[selectedFileIndex]) {
    state.set('bin.selectedFileIndex', selectedFileIndex - 1);
  }
}

export default deleteFile;
