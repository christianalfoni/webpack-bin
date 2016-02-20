import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';
import classNames from 'classnames';

@Cerebral({
  files: 'example.files',
  selectedFileIndex: 'example.selectedFileIndex'
})
class Toolbar extends React.Component {
  static propTypes = {
    files: PropTypes.array
  };

  renderFiles() {
    return this.props.files.map((file, index) => {
      const active = index === this.props.selectedFileIndex;
      const signals = this.props.signals.example;

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
  render() {
    const signals = this.props.signals.example;

    return (
      <div className={styles.wrapper}>
        <div className={styles.column}>
          {this.renderFiles()}
        </div>
        <div className={styles.column}>
          <button onClick={() => signals.testClicked({code: this.codemirror.getDoc().getValue()})} className={styles.button}>Run code</button>
        </div>
      </div>
    );
  }
}

export default Toolbar;
