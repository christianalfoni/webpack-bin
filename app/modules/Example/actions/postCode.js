function postCode({input, output, services}) {
  services.http.post('/api/sandbox', {
    files: [{
      name: 'main.js',
      content: input.code
    }]
  })
  .then(output.success)
  .catch(output.error);
}

postCode.async = true;

export default postCode;
