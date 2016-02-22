import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import styles from './styles.css';
import icons from 'common/icons.css';
import classNames from 'classnames';
import AddFile from '../AddFile';
import ToolbarButton from '../ToolbarButton';

@Cerebral({
  files: 'bin.files',
  selectedFileIndex: 'bin.selectedFileIndex',
  isLoading: 'bin.isLoading',
  isValid: 'bin.isValid',
  hasInitialized: 'bin.hasInitialized',
  showAddFileInput: 'bin.showAddFileInput',
  newFileName: 'bin.newFileName'
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
          <AddFile
            onAddFileClick={this.props.signals.bin.addFileClicked}
            onFileNameChange={this.props.signals.bin.addFileNameUpdated}
            onFileSubmit={this.props.signals.bin.addFileSubmitted}
            onAddFileAborted={this.props.signals.bin.addFileAborted}
            showInput={this.props.showAddFileInput}
            placeholder="Filename..."
            value={this.props.newFileName}/>
        </div>
        <div className={styles.column}>
          <div className={styles.status}>
            {this.renderStatus()}
          </div>
          <div className={styles.buttonWrapper}>
            <ToolbarButton
              title='Run code'
              icon={icons.play}
              disabled={this.props.isLoading || !this.props.isValid}
              onClick={() => signals.testClicked()}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Toolbar;
