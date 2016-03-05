function sendPreviewUpdate({services}) {
  services.live.sendSignal('live.previewUpdateRequested');
}

export default sendPreviewUpdate;
