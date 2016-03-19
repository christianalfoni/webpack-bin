function canControl(get) {
  const files = get('bin.currentBin.files');
  return Boolean(files.filter((file) => {
    return file.isEntry;
  }).length)
}

export default canControl;
