function postCode({state, input, output, services}) {
  services.http.post('/api/sandbox', {
    packages: state.get('bin.packages'),
    files: state.get('bin.files')
  })
  .then(output.success)
  .catch(output.error);
}

postCode.async = true;

export default postCode;
