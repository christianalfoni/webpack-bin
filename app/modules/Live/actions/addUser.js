function addUser({input, state}) {
  state.push('live.connectedUsers', input.name);
}

export default addUser;
