function postCode({state, input, output, services}) {
  services.http.post('/api/sandbox', {
    files: state.get('bin.files')
  })
  .then(output.success)
  .catch(output.error);
}

postCode.async = true;

export default postCode;
