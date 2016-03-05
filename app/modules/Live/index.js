import liveToggled from './signals/liveToggled';
import created from './signals/created';
import joined from './signals/joined';
import previewUpdateRequested from './signals/previewUpdateRequested';
import live from './services/live';
import userJoined from './signals/userJoined';
import userLeft from './signals/userLeft';
import disconnected from './signals/disconnected';
import snapshotReceived from './signals/snapshotReceived';
import controlDesignated from './signals/controlDesignated';
import userClicked from './signals/userClicked';
import controlRetracted from './signals/controlRetracted';

export default () => {
  return (module, controller) => {

    module.addState({
      hasJoined: false,
      connected: false,
      userName: null,

      connectedUsers: [],
      controllingUser: null
    });

    module.addSignals({
      liveToggled,
      created,
      joined,
      previewUpdateRequested,
      userJoined,
      userLeft,
      disconnected,
      snapshotReceived,
      controlDesignated,
      userClicked,
      controlRetracted
    });

    module.addServices(live(controller));

  };
}
