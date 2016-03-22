import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from '../styles.css';
import babelStyles from './styles.css';
import currentLoader from '../../../computed/currentLoader';

@Cerebral({
  loader: currentLoader
})
class BabelConfig extends React.Component {
  render() {
    const loader = this.props.loader;

    return (
      <div>
        <div className={styles.description}>
          This loader allows you to write modern JavaScript not implemented yet for
          the browser.
        </div>
        <div className={styles.config}>
          <input
            type="checkbox"
            checked={loader && loader.stage0}
            disabled={!loader}
            onChange={() => this.props.signals.bin.configToggled({name: 'stage0'})}/>
          Stage-0
          <div className={styles.configDescription}>
            Latest Babel specific transforms
          </div>
        </div>
        <div className={styles.config}>
          <input
            type="checkbox"
            checked={loader && loader.es2015}
            disabled={!loader}
            onChange={() => this.props.signals.bin.configToggled({name: 'es2015'})}/>
          ES2015
          <div className={styles.configDescription}>
            Features according to ES2015 spec
          </div>
        </div>
        <div className={styles.config}>
          <input
            type="checkbox"
            checked={loader && loader.react}
            disabled={!loader}
            onChange={() => this.props.signals.bin.configToggled({name: 'react'})}/>
          React
          <div className={styles.configDescription}>
            React JSX Support
          </div>
        </div>
        <div className={styles.config}>
          <input
            type="checkbox"
            checked={loader && loader.jsx}
            disabled={!loader}
            onChange={() => this.props.signals.bin.configToggled({name: 'jsx'})}/>
          JSX
          <div className={babelStyles.pragma}>
            Pragma: <input
              type="text"
              className={babelStyles.pragmaInput}
              value={loader && loader.jsx && loader.jsx.pragma ? loader.jsx.pragma : ''}
              disabled={!loader || !loader.jsx}
              onChange={(event) => this.props.signals.bin.configChanged({
                loader: 'jsx',
                option: 'pragma',
                value: event.target.value
              })}/>
          </div>
          <div className={styles.configDescription}>
            JSX Support
          </div>
        </div>
      </div>
    );
  }
}

 export default BabelConfig;
