import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import Toolbar from '../Toolbar';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';
import Log from '../Log';
import LiveUsers from '../LiveUsers';
import LiveUser from '../LiveUser';
import Welcome from '../Welcome';
import DeleteFileModal from '../DeleteFileModal';
import Snackbar from '../Snackbar';
import TestResults from '../TestResults';

@Cerebral({
  isRunning: 'bin.isRunning',
  showLog: 'bin.showLog',
  showLoadingBin: 'bin.showLoadingBin',
  live: 'live',
  showWelcome: 'bin.showWelcome',
  isInitialized: 'bin.isInitialized',
  showDeleteFileModal: 'bin.showDeleteFileModal',
  isFetchingVendorsBundle: 'bin.isFetchingVendorsBundle',
  showTestResults: 'bin.showTestResults'
})
class Bin extends React.Component {
  componentDidMount() {
    if (this.props.isInitialized) {
      document.querySelector('#loader').style.display = 'none';
    }
    window.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.keyCode === 83) {
        event.preventDefault();
        this.props.signals.bin.saveShortcutPressed();
      }
    });
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.isInitialized && this.props.isInitialized) {
      document.querySelector('#loader').style.display = 'none';
    }
  }
  render() {

    if (!this.props.isInitialized) {
      return null;
    }

    if (this.props.showWelcome) {
      return <Welcome/>;
    }

    return (
      <div onClick={() => this.props.signals.bin.appClicked()}>
        {(this.props.showTestResults) ? <TestResults/> : null}
        <Toolbar/>
        <div className={styles.wrapper}>
          <CodeEditor/>
          <div className={styles.previewAndLog}>
            <Preview/>

            {
              this.props.showLog ?
                <Log/>
              :
                null
            }
          </div>
          {
            this.props.live.connected && this.props.live.hasJoined ?
              <LiveUser/>
            :
              null
          }
          {
            this.props.live.connected && !this.props.live.hasJoined ?
              <LiveUsers/>
            :
              null
          }
        </div>
        {
          this.props.showLoadingBin ?
            <div className={styles.overlayWrapper}>
              <div className={styles.overlay}/>
              <div className={styles.loaderWrapper}>
                <div className={styles.logo}/>
                {
                  this.props.isFetchingVendorsBundle ?
                    'You are the first to grab these NPM packages, it will take a few seconds...'
                  :
                    'Loading your WebpackBin...'
                }
              </div>
            </div>
          :
            null
        }
        <Snackbar/>
        {
          this.props.showDeleteFileModal ?
            <DeleteFileModal/>
          :
            null
        }
      </div>
    );
  }
}

 export default Bin;
