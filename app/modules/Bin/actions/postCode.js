function postCode({state, input, output, services}) {
  services.http.post('/api/sandbox', {
    files: state.get('bin.files')
  })
  .then(output)
  .catch(output);
}

postCode.async = true;

export default postCode;
