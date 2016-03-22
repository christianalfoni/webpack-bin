import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from '../styles.css';
import currentLoader from '../../../computed/currentLoader';

@Cerebral({
  loader: currentLoader
})
class RawConfig extends React.Component {
  render() {
    const loader = this.props.loader;

    return (
      <div>
        <div className={styles.description}>
          With the .html extension you can load raw HTML into your code
        </div>
      </div>
    );
  }
}

 export default RawConfig;
