import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import Toolbar from '../Toolbar';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';

@Cerebral({
  snackbar: 'bin.snackbar'
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
  setSnackbarTimeout() {
    this.snackbarTimeout = setTimeout(() => this.props.signals.snackbarTimedOut({}, {isRecorded: true}), 2000);
  }
  render() {
    return (
      <div onClick={() => this.props.signals.bin.appClicked()}>
        <Toolbar/>
        <div style={{height: 'calc(100vh - 50px)', width: '100%', display: 'flex'}}>
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
