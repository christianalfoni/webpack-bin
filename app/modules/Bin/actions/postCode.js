function postCode({state, input, output, services}) {
  services.http.post('/api/sandbox?user='+state.get('bin.user'), state.get('bin.currentBin'))
  .then(output.success)
  .catch(output.error);
}

postCode.async = true;

export default postCode;
