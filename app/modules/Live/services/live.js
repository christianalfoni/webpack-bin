export default (controller) => {
  let ws;
  let hasConnected = false;
  const preventedSignals = [
    'bin.linted',
    'bin.iframeLoaded',
    'bin.logReceived',
    'live.userJoined',
    'live.userLeft',
    'live.controlDesignated',
    'live.controlRetracted'
  ];
  let onChange = (args) => {
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
      controller.removeListener('change', onChange);
      ws.send(JSON.stringify({
        type: 'designateControl',
        name
      }));
    },
    takeControl() {
      controller.on('change', onChange);
    },
    retractControl() {
      ws.send(JSON.stringify({
        type: 'retractControl'
      }));
    },
    releaseControl() {
      controller.removeListener('change', onChange);
    },
    connect() {
      return new Promise((resolve, reject) => {
        ws = new WebSocket('ws://www.codebox.dev:4000/');

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
            controller.on('change', onChange);
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
