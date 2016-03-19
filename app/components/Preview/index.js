import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  isRunning: 'bin.isRunning',
  showFullLog: 'bin.showFullLog',
  showLog: 'bin.showLog',
  isLoadingIframe: 'bin.isLoadingIframe'
})
class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.onIframeMessage = this.onIframeMessage.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (!this.props.isLoadingIframe && prevProps.isRunning && !this.props.isRunning) {
      this.refs.iframe.src =  [
        location.protocol,
        '//',
        location.hostname.replace('www', 'sandbox'),
        (location.port ? ':' + location.port : ''),
        '/'
      ].join('');
      this.props.signals.bin.iframeLoading();
    }
  }
  componentDidMount() {
    window.addEventListener('message', this.onIframeMessage);
  }
  onIframeMessage(event) {
    if (event.data.type === 'loaded') {
      this.props.signals.bin.iframeLoaded();
    }
    if (event.data.type === 'log') {
      this.props.signals.bin.logReceived({
        value: event.data.value
      });
    }
    if (event.data.type === 'click') {
      this.props.signals.bin.appClicked();
    }
  }
  render() {
    return (
      <div className={this.props.showFullLog || !this.props.showLog ? styles.wrapper : styles.halfWrapper}>
        <iframe className={styles.iframe} ref="iframe"/>
      </div>
    );
  }
}

export default Preview;
