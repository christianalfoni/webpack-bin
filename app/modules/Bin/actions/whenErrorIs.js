function whenErrorIs({input, output}) {
  if (output[input.result.message]) {
    output[input.result.message]();
  } else {
    output.otherwise();
  }
}

whenErrorIs.outputs = [
  'PACKAGE_EXTRACTOR_DOWN',
  'PACKAGE_EXTRACTOR_RUNNING',
  'otherwise'
]

export default whenErrorIs;
