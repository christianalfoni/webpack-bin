function redirectToBin({state, services}) {
  services.router.redirect(`/${state.get('bin.currentBin.id')}`);
}

export default redirectToBin;
