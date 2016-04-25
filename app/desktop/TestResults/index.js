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

  componentDidMount() {
    this.refreshIframe();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isRunning && !this.props.isRunning) {
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
