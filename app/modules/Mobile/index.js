import previewToggled from './signals/previewToggled';

export default () => {
  return (module, controller) => {

    module.addState({
      showPreview: false
    });

    module.addSignals({
      previewToggled
    });

  };
}
