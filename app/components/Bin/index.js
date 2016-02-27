import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import Toolbar from '../Toolbar';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';

@Cerebral({
  snackbar: 'bin.snackbar',
  isRunning: 'bin.isRunning',
  isRunningLong: 'bin.isRunningLong',
  isLoadingBin: 'bin.isLoadingBin',
  hasChangedPackages: 'bin.hasChangedPackages'
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
        <div className={this.props.isLoadingBin ? styles.wrapperFaded : styles.wrapper}>
          <CodeEditor/>
          <Preview/>
        </div>
        {
          this.props.isLoadingBin ?
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
