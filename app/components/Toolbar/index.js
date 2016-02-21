import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';
import classNames from 'classnames';

@Cerebral({
  files: 'bin.files',
  selectedFileIndex: 'bin.selectedFileIndex',
  isLoading: 'bin.isLoading',
  isValid: 'bin.isValid',
  hasInitialized: 'bin.hasInitialized'
})
class Toolbar extends React.Component {
  static propTypes = {
    files: PropTypes.array
  };

  renderFiles() {
    return this.props.files.map((file, index) => {
      const active = index === this.props.selectedFileIndex;
      const signals = this.props.signals.bin;

      return (
        <div
          key={index}
          className={classNames(styles.file, {[styles.active]: active})}
          onClick={() => signals.fileClicked({index: index})}>
          {file.name}
        </div>
      );
    })
  }
  renderStatus() {
    if (!this.props.hasInitialized && this.props.isLoading) {
      return 'Initializing Webpack instance...';
    }
    if (this.props.isLoading) {
      return 'Rebundling...';
    }
    return 'Bundle is valid';
  }
  render() {
    const signals = this.props.signals.bin;

    return (
      <div className={styles.wrapper}>
        <div className={styles.column}>
          {this.renderFiles()}
        </div>
        <div className={styles.column}>
          <div className={styles.status}>
            {this.renderStatus()}
          </div>
          <button
            disabled={this.props.isLoading || !this.props.isValid}
            onClick={() => signals.testClicked()}
            className={styles.button}>Run code</button>
        </div>
      </div>
    );
  }
}

export default Toolbar;
