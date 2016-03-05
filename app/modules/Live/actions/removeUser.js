function removeUser({input, state}) {
  const users = state.get('live.connectedUsers');
  const leftUserIndex = users.indexOf(input.name);
  state.splice('live.connectedUsers', leftUserIndex, 1);
}

export default removeUser;
