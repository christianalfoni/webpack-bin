function setSessionToken({input, state}) {
  if (input.jwt) state.set('bin.jwt', input.jwt);
  if (input.user) state.set('bin.user', input.user);
}

export default setSessionToken;