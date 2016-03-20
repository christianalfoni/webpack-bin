function setChangedFile({state}) {
  const selectedFileIndex = state.get('bin.selectedFileIndex');
  const changedFiles = state.get('bin.changedFiles');
  if (changedFiles.indexOf(selectedFileIndex) === -1) {
    state.push('bin.changedFiles', selectedFileIndex);
  }
}

export default setChangedFile;
