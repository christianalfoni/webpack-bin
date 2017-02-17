function setSessionToken({input, state}) {
  state.set('bin.jwt', input.jwt);
}

export default setSessionToken;