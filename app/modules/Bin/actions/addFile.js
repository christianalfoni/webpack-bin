function addFile({state}) {
  const fileName = state.get('bin.newFileName');
  state.push('bin.currentBin.files', {
    name: fileName,
    content: '',
    isEntry: state.get('bin.isEntry')
  });


}

export default addFile;
