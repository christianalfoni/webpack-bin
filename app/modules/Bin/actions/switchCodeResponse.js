function switchCodeResponse({input, state, output}) {
  if (input.result.isFetchingVendorsBundle) {
    output.isFetchingVendorsBundle();
  } else if (input.result.id && state.get('bin.currentBin.id') !== input.result.id) {
    output.isNewBin();
  } else {
    output.otherwise();
  }
}

switchCodeResponse.outputs = ['isNewBin', 'isFetchingVendorsBundle', 'otherwise'];

export default switchCodeResponse;
