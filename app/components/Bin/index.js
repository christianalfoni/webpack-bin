import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import Toolbar from '../Toolbar';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';

@Cerebral({
  snackbar: 'bin.snackbar',
  isLoading: 'bin.isLoading',
  isLoadingLong: 'bin.isLoadingLong'
})
class Bin extends React.Component {
  componentDidMount() {
    this.props.signals.bin.mounted();
    window.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.keyCode === 83) {
        event.preventDefault();
        this.props.signals.bin.saveShortcutPressed();
      }
    });
  }
  componentDidUpdate(prevProps) {
    this.setLoadingTimer(prevProps.isLoading);
    if (!prevProps.snackbar.show && this.props.snackbar.show) {
      this.setSnackbarTimeout();
    }

    if (this.props.snackbar.persist && !prevProps.snackbar.persist) {
      clearTimeout(this.snackbarTimeout);
    } else if (!this.props.snackbar.persist && prevProps.snackbar.persist) {
      this.setSnackbarTimeout();
    }

    if (this.props.snackbar.show && prevProps.snackbar.text !== this.props.snackbar.text) {
      clearTimeout(this.snackbarTimeout);

      if (!this.props.snackbar.persist) {
        this.setSnackbarTimeout();
      }
    }
  }
  setLoadingTimer(wasLoading) {
    if (!wasLoading && this.props.isLoading) {
      this.timeout = setTimeout(() => {
        this.props.signals.bin.stillNotLoaded();
      }, 1000);
    } else if (wasLoading && !this.props.isLoading) {
      clearTimeout(this.timeout);
    }
  }
  setSnackbarTimeout() {
    this.snackbarTimeout = setTimeout(() => this.props.signals.snackbarTimedOut({}, {isRecorded: true}), 2000);
  }
  render() {
    return (
      <div onClick={() => this.props.signals.bin.appClicked()}>
        <Toolbar/>
        <div className={this.props.isLoadingLong ? styles.wrapperFaded : styles.wrapper}>
          <CodeEditor/>
          <Preview/>
        </div>
        <div className={this.props.snackbar.show ? styles.snackbarVisible : styles.snackbar}>
          {this.props.snackbar.text}
        </div>
      </div>
    );
  }
}

 export default Bin;
