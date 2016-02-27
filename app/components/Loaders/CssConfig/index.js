import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from '../styles.css';
import currentLoader from '../../../computed/currentLoader';

@Cerebral({
  loader: currentLoader
})
class CssConfig extends React.Component {
  render() {
    const loader = this.props.loader;

    return (
      <div>
        <div className={styles.config}>
          <input
            type="checkbox"
            checked={loader && loader.modules}
            disabled={!loader}
            onChange={() => this.props.signals.bin.configToggled({name: 'modules'})}/>
          CSS Modules
          <div className={styles.configDescription}>
            Import css classes
          </div>
        </div>
      </div>
    );
  }
}

 export default CssConfig;
