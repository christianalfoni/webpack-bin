function deleteFile({input, state}) {
  const selectedFileIndex = state.get('bin.selectedFileIndex');
  const fileToDeleteIndex = state.get('bin.fileToDeleteIndex');

  state.splice('bin.currentBin.files', fileToDeleteIndex, 1);
  if (!state.get('bin.currentBin.files')[selectedFileIndex]) {
    state.set('bin.selectedFileIndex', selectedFileIndex - 1);
  }
}

export default deleteFile;
