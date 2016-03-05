import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  isRunning: 'bin.isRunning'
})
class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.onIframeMessage = this.onIframeMessage.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isRunning && !this.props.isRunning) {
      this.refs.iframe.src =  location.origin + '/api/sandbox';
    }
  }
  componentDidMount() {
    window.addEventListener('message', this.onIframeMessage);
    this.refs.iframe.addEventListener('load', () => {
      this.refs.iframe.contentWindow.document.addEventListener('click', () => {
        this.props.signals.bin.appClicked();
      });
    });
  }
  onIframeMessage(event) {
    if (event.data.type === 'loaded') {
      console.log('Loaded!');
      this.props.signals.bin.iframeLoaded();
    }
    if (event.data.type === 'log') {
      this.props.signals.bin.logReceived({
        value: event.data.value
      });
    }
  }
  render() {
    return (
      <div className={styles.wrapper}>
        <iframe className={styles.iframe} ref="iframe"/>
      </div>
    );
  }
}

export default Preview;
