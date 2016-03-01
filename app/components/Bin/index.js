import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import Toolbar from '../Toolbar';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';
import Log from '../Log';

@Cerebral({
  snackbar: 'bin.snackbar',
  isRunning: 'bin.isRunning',
  isLoadingBin: 'bin.isLoadingBin',
  showLog: 'bin.showLog',
  showLoadingBin: 'bin.showLoadingBin'
})
class Bin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSnackbar: false
    };
  }
  componentDidMount() {
    window.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.keyCode === 83) {
        event.preventDefault();
        this.props.signals.bin.saveShortcutPressed();
      }
    });
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.isLoadingBin && this.props.isLoadingBin) {
      this.setLoaderTimeout();
    } else if (prevProps.isLoadingBin && !this.props.isLoadingBin) {
      clearTimeout(this.loaderTimeout);
    }

    if (!prevProps.snackbar.show && this.props.snackbar.show) {
      this.setSnackbarTimeout();
      this.setState({
        showSnackbar: true
      });
      return;
    }

    if (this.props.snackbar.show && prevProps.snackbar.text !== this.props.snackbar.text) {
      this.setSnackbarTimeout();
    }
  }
  setLoaderTimeout() {
    this.loaderTimeout = setTimeout(() => {
      this.props.signals.bin.loadingTimeoutReached();
    }, 500);
  }
  setSnackbarTimeout() {
    clearTimeout(this.snackbarTimeout);
    this.snackbarTimeout = setTimeout(() => {
      this.props.signals.snackbarTimedOut();
      this.setState({
        showSnackbar: false
      });
    }, 4000);
  }
  render() {
    return (
      <div onClick={() => this.props.signals.bin.appClicked()}>
        <Toolbar/>
        <div className={this.props.showLoadingBin ? styles.wrapperFaded : styles.wrapper}>
          <CodeEditor/>
          <Preview/>
          {
            this.props.showLog ?
              <Log/>
            :
              null
          }
        </div>
        {
          this.props.showLoadingBin ?
            <div className={styles.loaderWrapper}>
              <div className={styles.logo}/>
              Loading your WebpackBin...
            </div>
          :
            null
        }
        <div className={this.state.showSnackbar ? styles.snackbarVisible : styles.snackbar}>
          {this.props.snackbar.text}
        </div>
      </div>
    );
  }
}

 export default Bin;
