import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  url: 'url'
})
class Preview extends React.Component {
  static propTypes = {
    url: PropTypes.string
  };
  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.refs.iframe.src = "http://www.codebox.dev:3000/api/sandbox";
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
