function addFile({state}) {
  const fileName = state.get('bin.newFileName');
  state.push('bin.files', {
    name: fileName,
    content: ''
  })
}

export default addFile;
