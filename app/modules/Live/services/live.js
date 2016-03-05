export default (controller) => {
  let ws;
  let hasConnected = false;
  const preventedSignals = [
    'bin.linted',
    'bin.iframeLoaded',
    'live.userJoined',
    'live.userLeft',
    'live.controlDesignated',
    'live.controlRetracted',
    'live.previewUpdateRequested'
  ];
  let onSignalEnd = (args) => {
    if (preventedSignals.indexOf(args.signal.name) >= 0) {
      return;
    }
    ws.send(JSON.stringify({
      type: 'signal',
      signal: {
        name: args.signal.name,
        payload: args.signal.input
      }
    }));
  };

  return {
    sendSignal(name, payload = {}) {
      ws.send(JSON.stringify({
        type: 'signal',
        signal: {
          name,
          payload
        }
      }));
    },
    sendSnapshot(name, snapshot) {
      ws.send(JSON.stringify({
        type: 'snapshot',
        name,
        snapshot
      }));
    },
    designateControl(name) {
      controller.removeListener('signalEnd', onSignalEnd);
      ws.send(JSON.stringify({
        type: 'designateControl',
        name
      }));
    },
    takeControl() {
      controller.removeListener('signalEnd', onSignalEnd);
      controller.on('signalEnd', onSignalEnd);
    },
    retractControl() {
      ws.send(JSON.stringify({
        type: 'retractControl'
      }));
    },
    releaseControl() {
      controller.removeListener('signalEnd', onSignalEnd);
    },
    disconnect() {
      ws.close();
    },
    connect() {
      return new Promise((resolve, reject) => {
        const url = location.origin.replace('http:', 'ws:').replace(':3000', ':4000');
        ws = new WebSocket(url);

        ws.onopen = function open() {
          console.log('connected');
          hasConnected = true;
          resolve();
        };

        ws.onclose = function close() {
          console.log('disconnected');
          if (!hasConnected) {
            reject();
          } else {
            controller.getSignals().live.disconnected();
          }
        };

        ws.onmessage = function message(event) {
          const data = JSON.parse(event.data);

          if (data.type === 'created') {
            controller.getSignals().live.created();
            controller.removeListener('signalEnd', onSignalEnd);
            controller.on('signalEnd', onSignalEnd);
          }

          if (data.type === 'connected') {
            return ws.send(JSON.stringify({
              type: 'join'
            }));
          }

          if (data.type === 'joined') {
            return controller.getSignals().live.joined({name: data.name});
          }

          if (data.type === 'userJoined') {
            return controller.getSignals().live.userJoined({name: data.name});
          }

          if (data.type === 'userLeft') {
            return controller.getSignals().live.userLeft({name: data.name});
          }

          if (data.type === 'snapshot') {
            return controller.getSignals().live.snapshotReceived({snapshot: data.snapshot});
          }

          if (data.type === 'controlDesignated') {
            return controller.getSignals().live.controlDesignated();
          }

          if (data.type === 'controlRetracted') {
            return controller.getSignals().live.controlRetracted();
          }

          if (data.type === 'signal') {
            const signals = controller.getSignals();
            const signal = data.signal.name.split('.').reduce((signals, namespace) => {
              return signals[namespace];
            }, signals);
            return signal({
              ...data.signal.payload,
              isLiveSignal: true
            });
          }
        };
      });
    }
  }
}
