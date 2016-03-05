function canControl(get) {
  const connected = get('live.connected');
  const controllingUser = get('live.controllingUser');
  const userName = get('live.userName');
  const isOwner = get('bin.currentBin.isOwner');

  return (
    !connected ||
    (
      connected &&
      (
        controllingUser === userName ||
        (
          isOwner && !controllingUser
        )
      )
    )
  )
}

export default canControl;
