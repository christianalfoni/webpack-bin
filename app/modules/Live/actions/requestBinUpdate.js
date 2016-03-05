function requestBinUpdate({services}) {
  services.live.sendSignal('bin.runClicked');
}

export default requestBinUpdate;
