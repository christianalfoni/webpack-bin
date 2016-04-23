import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  isRunning: 'bin.isRunning',
  isLoadingIframe: 'bin.isLoadingIframe',
  currentBin: 'bin.currentBin'
})

class TestResults extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isLoadingIframe && prevProps.isRunning && !this.props.isRunning) {
      this.refreshIframe();
    }
  }

  refreshIframe() {
    this.refs.iframe.src = [
      location.protocol,
      '//',
      location.hostname.replace('www', 'sandbox'),
      (location.port ? ':' + location.port : ''),
      '/test'
    ].join('');
    this.props.signals.bin.iframeLoading();
  }

  onIframeMessage(event) {
    if (event.data.type === 'loaded') {
      this.props.signals.bin.iframeLoaded();
    }
    if (event.data.type === 'click') {
      this.props.signals.bin.appClicked();
    }
  }

  render() {
    return (
      <div>

        <div className = {styles.wrapper}>
          <div className={styles.arrow}></div>
          <div className={styles.arrowBorder}></div>
          <iframe className={styles.iframe} ref="iframe" />
        </div>
      </div>
    )
  }
}

export default TestResults;
