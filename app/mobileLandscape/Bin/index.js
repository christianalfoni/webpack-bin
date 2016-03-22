import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

import Welcome from '../Welcome';
import Toolbar from '../Toolbar';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';
import Log from '../Log';

@Cerebral({
  isInitialized: 'bin.isInitialized',
  currentBin: 'bin.currentBin',
  showWelcome: 'bin.showWelcome',
  showPreview: 'mobile.showPreview',
  showLog: 'bin.showLog'
})
class Bin extends React.Component {
  componentDidMount() {
    if (this.props.isInitialized) {
      document.querySelector('#loader').style.display = 'none';
    }
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.isInitialized && this.props.isInitialized) {
      document.querySelector('#loader').style.display = 'none';
    }
  }
  render() {
    if (this.props.showWelcome) {
      return <Welcome/>
    }
    return (
      <div className={styles.wrapper}>
        <Toolbar/>
        <CodeEditor/>
        <div className={this.props.showPreview ? styles.showPreview : styles.preview}>
          <Preview/>
          {
            this.props.showLog ?
              <Log/>
            :
              null
          }
        </div>
      </div>
    );
  }
}

 export default Bin;
