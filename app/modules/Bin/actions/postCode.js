function postCode({state, input, output, services}) {
  services.http.post('/api/sandbox', {
    id: state.get('bin.currentBin.id'),
    packages: state.get('bin.currentBin.packages'),
    files: state.get('bin.currentBin.files'),
    loaders: state.get('bin.currentBin.loaders')
  })
  .then(output.success)
  .catch(output.error);
}

postCode.async = true;

export default postCode;
