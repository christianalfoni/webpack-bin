import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';

@Cerebral({
  isLoadingBin: 'bin.isLoadingBin',
  snackbar: 'bin.snackbar'
})
class Snackbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSnackbar: false
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isLoadingBin && !this.props.isLoadingBin) {
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
      <div className={this.state.showSnackbar ? styles.snackbarVisible : styles.snackbar}>
        {this.props.snackbar.text}
      </div>
    );
  }
}

 export default Snackbar;
