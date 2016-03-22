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
        <div className={styles.description}>
          The CSS loader allows you to import any css file and it will be loaded as
          a normal style tag.
        </div>
        <div className={styles.config}>
          <input
            type="checkbox"
            checked={loader && loader.modules}
            disabled={!loader}
            onChange={() => this.props.signals.bin.configToggled({name: 'modules'})}/>
          CSS Modules
          <div className={styles.configDescription}>
            Import css classes as an object to reference class names by key, on .css files
          </div>
        </div>
        <div className={styles.config}>
          <input
            type="checkbox"
            checked={loader && loader.less}
            disabled={!loader}
            onChange={() => this.props.signals.bin.configToggled({name: 'less'})}/>
          Less
          <div className={styles.configDescription}>
            Import .less files to styles tags
          </div>
        </div>
        <div className={styles.config}>
          <input
            type="checkbox"
            checked={loader && loader.sass}
            disabled={!loader}
            onChange={() => this.props.signals.bin.configToggled({name: 'sass'})}/>
          Sass
          <div className={styles.configDescription}>
            Import .scss files to styles tags
          </div>
        </div>
      </div>
    );
  }
}

 export default CssConfig;
